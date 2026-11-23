# Edu Dash — many installable PWAs on one Netlify site
Single origin (`edu-dash.netlify.app` or your custom domain). Each app under
`/<appId>/` has its own manifest (`id`, `start_url`, `scope`) → each installs
to the home screen separately.
## Deploy (GitHub → Netlify)
1. Push this repo to GitHub.
2. Netlify → Add new site → Import from GitHub.
3. Build command: *(empty)*. Publish directory: `.`  (already set in `netlify.toml`).
4. Deploy.
## Add an app
    node tools/add-app.mjs math "Math Edu Dashboard" en ltr "#c0392b"
Creates `math/` with index, manifest, header/footer partials, a sample module
(`math/sample-module/lesson1.html`) demonstrating `data-include` + `window.I18N`,
and appends an entry to `apps.json`.
If you don't use the script: copy `arabic/` → `math/`, replace `arabic` → `math`,
edit `name`/`short_name`/`lang`/`dir`/`theme_color`, append one object to `apps.json`.
## Icons (you provide)
`<app>/assets/icons/icon-96x96.png`, `icon-144x144.png`, `icon-192x192.png`,
`icon-512x512.png` — square PNG. Add maskable variants later if desired.
## File contracts (short)
- **Partials**: `<div data-include="/absolute/path.html"></div>` — resolved
  by `shared/include.js` before the `partials:ready` event fires.
- **Translations**: each HTML page sets `window.I18N = { key: {en,fr,ar} }`
  and tags elements with `data-i18n="key"` (or `data-i18n-attr="aria-label:key"`
  for attributes). Missing keys fall back to the element's current text.
- **Storage**: always via `prefs.*` or `appData.*` from `shared/store.js`.
  Namespace: cross-app `edu:*`, per-app `<appId>:*`. Never call
  `localStorage` directly from page scripts.
- **Auth**: only via `shared/auth.js`. `edu:session` is managed by it alone.
- **Header controls**: IDs `#theme-btn`, `#lang-sel`, `#user-chip`,
  `#install-btn` are auto-wired by `initHeader()` / `initInstallButton()`.
## Offline + updates
- HTML / CSS / JS / JSON: **network-first** → new deploys visible on next
  visit; every visited page cached offline.
- Images / fonts: **stale-while-revalidate** → fast, refreshed in background.
- Partials are cached when first fetched (i.e. first time a page using them
  is viewed online). A page that has never been opened online is *not* offline-
  available — its partials don't exist yet. This is intentional; the SW's
  `SHELL` covers the shared bootstrap.
- Service worker takes over immediately (`skipWaiting` + `clients.claim`).
- Bump `VERSION` in `sw.js` **only** when you change SW logic or need to
  purge the whole cache. Content edits do not need a bump.
## Adding nested pages
Drop files anywhere under `<app>/`, e.g. `/arabic/year7/module1/lesson1.html`,
and:
- include `<script src="/register-sw.js" defer></script>`
- include your app header/footer partials and (optionally) module partials
- declare `window.I18N` for the page
- import `shared/ui.js` + `shared/install.js` for the header controls
- put a module-scoped `styles.css` and any specific JS (e.g. canvas drawing)
  next to the page
## Test locally
    npx serve .
Open `http://localhost:3000/arabic/`. Service workers require localhost or
HTTPS. DevTools → Application → Manifest / Service Workers / Cache Storage.
Debug cross-app state: open `/shared/debug.html`.
## Important
- Storage (localStorage / IndexedDB / cookies / Cache) is **shared by origin**
  across all apps. Keys are namespaced (`edu:*`, `arabic:*`, `philo:*`, …).
- Uninstalling one app with "clear data" wipes the origin's data for **all**
  apps; offline pages re-cache on the next online visit.
- Auth in `local` mode stores a session in `localStorage['edu:session']` —
  fine for testing, **never** for real credentials. Switch `CONFIG.backend`
  to `'supabase'` when ready; the schema + wiring are documented at the end
  of the setup messages.
## Files at a glance
    versions.log          progression log
    netlify.toml          headers + build config
    apps.json             launcher + SW source of truth
    index.html            launcher (not installable)
    offline.html          fallback for uncached navigation
    register-sw.js        one-liner registration for every page
    sw.js                 single root-scoped SW
    shared/               cross-app modules (storage, auth, i18n, partials, UI)
    tools/add-app.mjs     scaffold a new app
    <app>/                per-app (index, manifest, header/footer, assets, modules)
    <app>/<module>/       per-module (header/footer, styles.css, *.js, pages)
```
repo/
├── versions.log
├── netlify.toml
├── apps.json
├── index.html
├── offline.html
├── register-sw.js
├── sw.js                     v3
├── README.md
├── docs/
│   └── SUPABASE.md
├── tools/
│   └── add-app.mjs
├── shared/
│   ├── config.js
│   ├── store.js
│   ├── auth.js
│   ├── install.js
│   ├── ui.js
│   ├── i18n.js
│   ├── include.js
│   └── debug.html
├── arabic/
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── header.html
│   ├── footer.html
│   ├── assets/
│   │   ├── css/styles.css
│   │   ├── js/app.js
│   │   └── icons/{96,144,192,512}.png   ← you drop these
│   ├── assets/screenshots/{home,lesson}.png   ← optional
│   └── year7/module1/
│       ├── header.html
│       ├── footer.html
│       ├── styles.css
│       ├── draw.js
│       ├── lesson1.html
│       └── lesson2.html
└── philo/
    ├── index.html
    ├── manifest.webmanifest
    ├── header.html
    ├── footer.html
    ├── assets/
    │   ├── css/styles.css
    │   ├── js/app.js
    │   └── icons/{96,144,192,512}.png   ← you drop these
    ├── assets/screenshots/{home,lesson}.png   ← optional
    └── term1/
        ├── header.html
        ├── footer.html
        ├── styles.css
        ├── writing.js
        └── lesson1.html
```