// shared/auth.js — same interface for local (testing) and supabase (later).
import { CONFIG } from './config.js';
import { prefs } from './store.js';
const SESSION_KEY = 'edu:session';   // testing only; Supabase mode replaces with SDK session
const localAuth = {
  async signIn(email, password) {
    if (!email || !password) throw new Error('Email and password required');
    const user = { id: `local-${btoa(email).slice(0, 8)}`, email, name: email.split('@')[0] };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    await prefs.setProfile({ name: user.name });
    notify();
    return user;
  },
  async signUp(email, password, name) {
    if (!email || !password) throw new Error('Email and password required');
    const user = { id: `local-${btoa(email).slice(0, 8)}`, email, name: name || email.split('@')[0] };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    await prefs.setProfile({ name: user.name });
    notify();
    return user;
  },
  async signOut() {
    localStorage.removeItem(SESSION_KEY);
    await prefs.setProfile(null);
    notify();
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }
};
const supabaseAuth = {
  async signIn() { throw new Error('supabase auth not wired yet'); },
  async signUp() { throw new Error('supabase auth not wired yet'); },
  async signOut() { throw new Error('supabase auth not wired yet'); },
  getUser()      { throw new Error('supabase auth not wired yet'); }
};
const impl = CONFIG.backend === 'supabase' ? supabaseAuth : localAuth;
const listeners = new Set();
function notify() { listeners.forEach((cb) => { try { cb(impl.getUser()); } catch {} }); }
// Cross-tab: another tab signed in/out → refresh chip.
window.addEventListener('storage', (e) => { if (e.key === SESSION_KEY) notify(); });
export const auth = {
  signIn:  (e, p)    => impl.signIn(e, p),
  signUp:  (e, p, n) => impl.signUp(e, p, n),
  signOut: ()        => impl.signOut(),
  getUser: ()        => impl.getUser(),
  onChange(cb) { listeners.add(cb); cb(impl.getUser()); return () => listeners.delete(cb); }
};