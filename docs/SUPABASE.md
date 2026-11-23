# Supabase migration — flipping `backend: 'supabase'`
## Why bother
`localStorage` on a shared origin:
- Is wiped for **all** apps when the user uninstalls **any** one of them.
- Has no per-user isolation.
- Cannot safely hold credentials.
Supabase fixes the first two. It also gives you real auth (email/password,
magic link, OAuth) without any server code.
## What actually changes
Three source files and one SQL script. **No changes to `arabic/` or `philo/`.**
| File | Change |
|---|---|
| `shared/config.js` | flip `backend: 'supabase'`, fill `supabaseUrl`, `supabaseAnonKey` |
| `shared/store.js`  | replace the `supabase` stub with the body below |
| `shared/auth.js`   | replace the `supabaseAuth` stub with the body below |
| `sw.js`            | bump `VERSION` (optional but recommended — data shape changed) |
| Supabase project   | run the SQL below |
The facade in `store.js` / `auth.js` exposes the **same public API** as the
local backend, so app pages (`arabic/`, `philo/`) keep working unmodified.
---
## 1. Create the Supabase project
1. supabase.com → New project (free tier is enough).
2. Once ready: Project Settings → API → copy **Project URL** and **anon public key**.
3. Save them for step 3 below.
> The `anon` key is *public* by design. Row Level Security (RLS) is what
> actually protects data — see the policies in step 2.
---
## 2. Schema + RLS — paste into Supabase SQL Editor and run
```sql
-- One row per user: shared prefs live here.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  avatar_url text,
  prefs      jsonb not null default '{}'::jsonb,   -- { mode, lang }
  updated_at timestamptz not null default now()
);
-- Per-app key/value. The composite PK is what isolates apps.
create table app_data (
  user_id    uuid not null references auth.users(id) on delete cascade,
  app_id     text not null,
  key        text not null,
  value      jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, app_id, key)
);
create index app_data_user_app_idx on app_data(user_id, app_id);
alter table profiles  enable row level security;
alter table app_data  enable row level security;
create policy "profiles: own row" on profiles
  for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);
create policy "app_data: own rows" on app_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```
**Why this is enough:**
- Every read/write from the client carries the user's JWT. Postgres checks
  `auth.uid()` against the row's `id` / `user_id`. Cross-user leaks are
  impossible without a stolen JWT.
- `app_id` is client-supplied but constrained by the RLS policy to the
  authenticated user's own rows — one user can't see another user's data.
- **Uninstalling** the Arabic PWA does **not** affect `app_data` rows for
  Philo, because those are rows on the server, keyed by `(user_id, app_id)`.
---
## 3. `shared/config.js` — flip the switch
```js
export const CONFIG = {
  backend: 'supabase',
  supabaseUrl:     'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'eyJhbGciOi...',     // anon public key from step 1
  defaultLang: 'en',
  apps: {
    arabic: { name: 'Arabic Edu', url: '/arabic/' },
    philo:  { name: 'Philo Edu',  url: '/philo/'  }
  }
};
```
---
## 4. `shared/store.js` — replace the `supabase` stub
Replace the whole `const supabase = { … }` object with:
```js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const sb = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true }
});
export { sb };   // auth.js imports it below
const supabase = {
  async pushPrefs() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const prefs = {
      mode: mirror.read(PREF_KEYS.mode, null),
      lang: mirror.read(PREF_KEYS.lang, null)
    };
    await sb.from('profiles').upsert({
      id: user.id, prefs, updated_at: new Date().toISOString()
    });
  },
  async pullPrefs() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data } = await sb.from('profiles')
      .select('prefs, name, avatar_url').eq('id', user.id).maybeSingle();
    if (!data) return null;
    return {
      mode: data.prefs?.mode,
      lang: data.prefs?.lang,
      profile: data.name ? { name: data.name, avatar: data.avatar_url } : null
    };
  },
  async getApp(appId, key) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    const { data } = await sb.from('app_data')
      .select('value').eq('user_id', user.id)
      .eq('app_id', appId).eq('key', key).maybeSingle();
    return data?.value ?? null;
  },
  async setApp(appId, key, val) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('app_data').upsert({
      user_id: user.id, app_id: appId, key, value: val,
      updated_at: new Date().toISOString()
    });
  },
  async removeApp(appId, key) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('app_data').delete()
      .eq('user_id', user.id).eq('app_id', appId).eq('key', key);
  },
  async clearApp(appId) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('app_data').delete()
      .eq('user_id', user.id).eq('app_id', appId);
  },
  async setProfile(p) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('profiles').upsert({
      id: user.id,
      name: p?.name ?? null,
      avatar_url: p?.avatar ?? null
    });
  }
};
```
> **Offline note:** writes still land in the local mirror first
> (`mirror.write(...)` inside `appData.set`), then `await backend.setApp(...)`.
> If the network is down, the Supabase call rejects — `appData.set` currently
> `await`s it, so the caller sees the error. Two options:
> (a) leave as-is (UI blocks / retries when back online), or
> (b) wrap backend calls in try/catch + enqueue to an outbox. For v1,
> the simplest correct choice is to catch in `appData` and log:
>
> ```js
> async set(appId, key, val) {
>   mirror.write(`${appId}:${key}`, val);
>   try { await backend.setApp(appId, key, val); }
>   catch (e) { console.warn('[appData.set] offline:', e); }
> }
> ```
---
## 5. `shared/auth.js` — replace the `supabaseAuth` stub
```js
import { sb } from './store.js';       // reuses the same Supabase client
import { prefs } from './store.js';
const supabaseAuth = {
  async signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await prefs.sync();                     // pull shared prefs from server
    notify();
    return data.user;
  },
  async signUp(email, password, name) {
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { data: { name } }
    });
    if (error) throw error;
    if (data.user) {
      await sb.from('profiles').upsert({
        id: data.user.id, name: name || email.split('@')[0]
      });
    }
    notify();
    return data.user;
  },
  async signOut() {
    await sb.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    await prefs.setProfile(null);
    notify();
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
};
// Mirror Supabase session into our local mirror for the sync chip.
// (Supabase SDK itself stores the session; we only copy the display bits.)
sb.auth.onAuthStateChange((_evt, session) => {
  if (session?.user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id:    session.user.id,
      email: session.user.email,
      name:  session.user.user_metadata?.name
    }));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  notify();
});
```
> ⚠️ `notify()` in `auth.js` already exists (it fires `onChange` listeners).
> Keep it as-is. The chip in `shared/ui.js` reacts automatically.
>
> **First sign-in after switching backends:** the user has local data from
> `local` mode; the server has none. Either (a) clear local data on first
> Supabase sign-in (`prefs.sync()` returning `null` means server empty), or
> (b) accept that the local mirror is empty until they re-enter settings.
> Option (a) is cleaner; add to `auth.signIn`:
>
> ```js
> const remote = await backend.pullPrefs();
> if (!remote) {
>   // seed the server from whatever is still in local mirror
>   await backend.pushPrefs();
>   await backend.setProfile(prefs.get().profile);
> }
> ```
---
## 6. Bump `sw.js`
In `sw.js`, `const VERSION = 'v3';` → `'v4'`. Content SHA changes, but data
shape changed too; a cache purge is safest.
```diff
-const VERSION = 'v3';
+const VERSION = 'v4';
```
---
## 7. Test checklist
1. `npx serve .` → open `/arabic/` → Sign in (real Supabase account).
2. Write a draft on `/philo/term1/lesson1.html` → refresh → draft present.
3. Open Supabase → Table Editor → `app_data` → see `arabic:*` and `philo:*` rows.
4. **Uninstall `Arabic Edu`** from the browser (with "clear data").
5. Reinstall `Philo Edu` → sign in → **draft still there**. ✅
6. Install `Arabic Edu` again → sign in → its data still in Supabase. ✅
---
## 8. Rollback
Flip `CONFIG.backend` back to `'local'`. The app uses `localStorage` again.
Remote data is untouched. **There is no automatic merge** back into local
storage — if you roll back and want to keep data, export from Supabase
first (`Table Editor → app_data → Download CSV`).
---
## 9. What this does *not* solve
- **Offline writes**: Supabase is HTTP. Writes fail offline. Add an outbox
  (IndexedDB + Background Sync) later if that matters. Reads still work from
  the local mirror, so the UI stays populated.
- **Passwords in `localStorage`**: never happened. Supabase SDK stores the
  *session* (JWT + refresh token) in `localStorage`, which is standard and
  reasonable — it's not a password, and Supabase rotates it.
- **Cross-tab sign-in**: works out of the box via `onAuthStateChange`. The
  local mirror's `storage` event listener also fires `notify()` if another
  tab writes it, so the chip updates in every tab.