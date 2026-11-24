// shared/ui.js — header controls: theme toggle, language select, user chip.
import { prefs } from './store.js';
import { auth }  from './auth.js';
import { applyI18n } from './i18n.js';

function currentLang() { return prefs.get().lang || document.documentElement.lang || 'en'; }

const inited = new WeakSet();

export function initTheme() {
  const btn = document.getElementById('theme-btn');
  if (!btn || inited.has(btn)) return;
  inited.add(btn);

  const sync = (mode) => {
    document.documentElement.dataset.mode = mode;
    btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    // Icon swap is CSS-driven (html[data-mode="dark"] .icon-sun / .icon-moon).
  };
  sync(prefs.get().mode);

  btn.addEventListener('click', async () => {
    const next = prefs.get().mode === 'dark' ? 'light' : 'dark';
    sync(next);
    await prefs.setMode(next);
  });
  window.addEventListener('edu:mode-changed', (e) => sync(e.detail.mode));
  window.addEventListener('storage', (e) => { if (e.key === 'edu:mode') sync(prefs.get().mode); });
}

export function initLang(selectEl) {
  const sel = selectEl || document.getElementById('lang-sel');
  if (!sel || inited.has(sel)) return;
  inited.add(sel);

  const apply = (lang) => {
    const l = lang || document.documentElement.lang || 'en';
    sel.value = l;
    document.documentElement.lang = l;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
  };
  apply(prefs.get().lang);

  sel.addEventListener('change', async () => {
    apply(sel.value);
    await prefs.setLang(sel.value);
  });
  window.addEventListener('edu:lang-changed', (e) => apply(e.detail.lang));
  window.addEventListener('storage', (e) => { if (e.key === 'edu:lang') apply(prefs.get().lang); });
}

export function initUserChip() {
  const chip = document.getElementById('user-chip');
  if (!chip || inited.has(chip)) return;
  inited.add(chip);

  auth.onChange((user) => {
    if (user) {
      chip.textContent = user.name || user.email || 'You';
      chip.removeAttribute('data-i18n');
    } else {
      chip.setAttribute('data-i18n', 'nav.signin');
      applyI18n(chip);
    }
    chip.title  = user?.email || '';
    chip.dataset.signedin = user ? '1' : '0';
  });

  chip.addEventListener('click', async () => {
    if (!auth.getUser()) {
      const email = prompt('Email');    if (!email) return;
      const pw    = prompt('Password'); if (!pw)    return;
      try { await auth.signIn(email, pw); }
      catch (e) { alert(e.message); }
    } else if (confirm('Sign out?')) {
      await auth.signOut();
    }
  });

  window.addEventListener('edu:lang-changed', () => {
    if (!auth.getUser()) applyI18n(chip);
  });
}

export function initConnectionStatus() {
  const dot = document.querySelector('.status-dot');
  if (!dot) return;
  const sync = () => {
    dot.classList.toggle('offline', !navigator.onLine);
    const parent = dot.parentElement;
    if (parent) parent.setAttribute('title', navigator.onLine ? 'Online' : 'Offline');
  };
  sync();
  window.addEventListener('online',  sync);
  window.addEventListener('offline', sync);
}

export function externalAppLink(appId) {
  const a = document.querySelector(`[data-app-link="${appId}"]`);
  if (!a) return;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
}

export function initHeader() {
  const go = () => {
    initTheme();
    initLang();
    initUserChip();
    initConnectionStatus();
  };
  if (window.__partialsLoaded) { go(); return; }
  (window.partialsReady || Promise.resolve()).then(go);
}