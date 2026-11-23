// shared/install.js — one install prompt per app, plus manual iOS hint.
const isIos  = /iphone|ipad|ipod/i.test(navigator.userAgent);
const inited = new WeakSet();
let deferredPrompt = null;

// Window-level listeners are registered immediately — beforeinstallprompt
// can fire before the header partial has been injected into the DOM.
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showIfWired('nav.install');
});
addEventListener('appinstalled', () => {
  deferredPrompt = null;
  const btn = document.getElementById('install-btn');
  if (btn) btn.hidden = true;
});

function showIfWired(i18nKey) {
  const btn = document.getElementById('install-btn');
  if (!btn || !inited.has(btn)) return;     // not injected / not yet wired
  btn.hidden = false;
  btn.dataset.i18n = i18nKey;
  document.dispatchEvent(new CustomEvent('partials:ready'));
}

export function initInstallButton() {
  const run = () => {
    const btn = document.getElementById('install-btn');
    if (!btn || inited.has(btn)) return;
    inited.add(btn);

    const standalone =
      matchMedia('(display-mode: standalone)').matches ||
      matchMedia('(display-mode: minimal-ui)').matches  ||
      navigator.standalone === true;
    if (standalone) { btn.hidden = true; return; }

    if (deferredPrompt)  showIfWired('nav.install');
    else if (isIos)      showIfWired('nav.addHome');

    btn.addEventListener('click', async () => {
      if (isIos) {
        alert('Tap the Share button, then "Add to Home Screen".');
        return;
      }
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try { await deferredPrompt.userChoice; } catch {}
      deferredPrompt = null;
      btn.hidden = true;
    });
  };

  if (window.__partialsLoaded) { run(); return; }
  (window.partialsReady || Promise.resolve()).then(run);
}