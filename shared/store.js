// shared/store.js — storage facade. Async from day one so Supabase is a drop-in swap.
import { CONFIG } from './config.js';
const PREF_KEYS = { mode: 'edu:mode', lang: 'edu:lang', profile: 'edu:profile' };
const mirror = {
  read(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  write(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  remove(k) { localStorage.removeItem(k); },
  keys(prefix) {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) out.push(k);
    }
    return out;
  }
};
const local = {
  async pushPrefs() {},
  async pullPrefs() { return null; },
  async getApp(appId, key) { return mirror.read(`${appId}:${key}`, null); },
  async setApp(appId, key, val) { mirror.write(`${appId}:${key}`, val); },
  async removeApp(appId, key) { mirror.remove(`${appId}:${key}`); },
  async clearApp(appId) { mirror.keys(`${appId}:`).forEach((k) => mirror.remove(k)); },
  async setProfile(p) { mirror.write(PREF_KEYS.profile, p); }
};
const supabase = {
  async pushPrefs() {},
  async pullPrefs() { return null; },
  async getApp()     { throw new Error('supabase backend not wired yet'); },
  async setApp()     { throw new Error('supabase backend not wired yet'); },
  async removeApp()  { throw new Error('supabase backend not wired yet'); },
  async clearApp()   { throw new Error('supabase backend not wired yet'); },
  async setProfile(p) { mirror.write(PREF_KEYS.profile, p); }
};
const backend = CONFIG.backend === 'supabase' ? supabase : local;
export const prefs = {
  /** Sync read of local mirror. Used pre-paint to avoid flash. */
  get() {
    return {
      mode:    mirror.read(PREF_KEYS.mode, 'light'),
      lang:    mirror.read(PREF_KEYS.lang, null),
      profile: mirror.read(PREF_KEYS.profile, null)
    };
  },
  async setMode(mode) {
    mirror.write(PREF_KEYS.mode, mode);
    window.dispatchEvent(new CustomEvent('edu:mode-changed', { detail: { mode } }));
    await backend.pushPrefs();
  },
  async setLang(lang) {
    mirror.write(PREF_KEYS.lang, lang);
    window.dispatchEvent(new CustomEvent('edu:lang-changed', { detail: { lang } }));
    await backend.pushPrefs();
  },
  async setProfile(profile) {
    mirror.write(PREF_KEYS.profile, profile);
    await backend.setProfile(profile);
  },
  async sync() {
    const remote = await backend.pullPrefs();
    if (!remote) return;
    if (remote.mode)    mirror.write(PREF_KEYS.mode, remote.mode);
    if (remote.lang)    mirror.write(PREF_KEYS.lang, remote.lang);
    if (remote.profile) mirror.write(PREF_KEYS.profile, remote.profile);
  }
};
export const appData = {
  async get(appId, key, def = null) {
    if (CONFIG.backend === 'local') return mirror.read(`${appId}:${key}`, def);
    const cached = mirror.read(`${appId}:${key}`, undefined);
    if (cached !== undefined) return cached;
    try {
      const v = await backend.getApp(appId, key);
      if (v !== null) mirror.write(`${appId}:${key}`, v);
      return v ?? def;
    } catch { return def; }
  },
  async set(appId, key, val) {
    mirror.write(`${appId}:${key}`, val);
    await backend.setApp(appId, key, val);
  },
  async remove(appId, key) {
    mirror.remove(`${appId}:${key}`);
    await backend.removeApp(appId, key);
  },
  async clear(appId) {
    mirror.keys(`${appId}:`).forEach((k) => mirror.remove(k));
    await backend.clearApp(appId);
  }
};