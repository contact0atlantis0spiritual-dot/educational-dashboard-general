// shared/install.js — one install prompt per app, plus manual iOS hint.
export function initInstallButton() {
  const btn = document.getElementById('install-btn');
  if (!btn) return;
  const standalone =
    matchMedia('(display-mode: standalone)').matches ||
    matchMedia('(display-mode: minimal-ui)').matches  ||
    navigator.standalone === true;
  if (standalone) { btn.hidden = true; return; }
  let promptEvent = null;
  addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    promptEvent = e;
    btn.hidden = false;
    btn.setAttribute('data-i18n', 'nav.install');
    // trigger i18n for the newly-visible label
    document.dispatchEvent(new CustomEvent('partials:ready'));
  });
  addEventListener('appinstalled', () => {
    btn.hidden = true;
    promptEvent = null;
  });
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIos) {
    btn.hidden = false;
    btn.setAttribute('data-i18n', 'nav.addHome');
    document.dispatchEvent(new CustomEvent('partials:ready'));
  }
  btn.addEventListener('click', async () => {
    if (isIos) {
      alert('Tap the Share button, then "Add to Home Screen".');
      return;
    }
    if (!promptEvent) return;
    promptEvent.prompt();
    try { await promptEvent.userChoice; } catch {}
    promptEvent = null;
    btn.hidden = true;
  });
}