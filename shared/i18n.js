// shared/i18n.js — applies window.I18N[key][lang] to [data-i18n] and [data-i18n-attr].
import { prefs } from './store.js';
import { CONFIG } from './config.js';
function currentLang() {
  return prefs.get().lang || document.documentElement.lang || CONFIG.defaultLang;
}
function translateNode(el, lang) {
  const key = el.dataset.i18n;
  if (!key) return;
  const entry = (window.I18N || {})[key];
  if (!entry) return;
  const val = entry[lang] ?? entry.en;
  if (val != null) el.textContent = val;
}
function translateAttr(el, lang) {
  const spec = el.dataset.i18nAttr;
  if (!spec) return;
  const dict = window.I18N || {};
  // format: "attr:key;attr2:key2"
  for (const pair of spec.split(';')) {
    const [attr, key] = pair.split(':').map((s) => s.trim());
    if (!attr || !key) continue;
    const entry = dict[key];
    if (!entry) continue;
    const val = entry[lang] ?? entry.en;
    if (val != null) el.setAttribute(attr, val);
  }
}
export function applyI18n(root = document) {
  const lang = currentLang();
  if (root === document || root === document.documentElement) {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  }
  if (root.matches?.('[data-i18n]'))      translateNode(root, lang);
  if (root.matches?.('[data-i18n-attr]')) translateAttr(root, lang);
  root.querySelectorAll?.('[data-i18n]').forEach((el) => translateNode(el, lang));
  root.querySelectorAll?.('[data-i18n-attr]').forEach((el) => translateAttr(el, lang));
}
// Re-apply on events that can change what's on screen.
document.addEventListener('partials:ready',  () => applyI18n());
window.addEventListener('edu:lang-changed',   () => applyI18n());
window.addEventListener('storage', (e) => { if (e.key === 'edu:lang') applyI18n(); });
// Always translate once after the DOM settles.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyI18n());
} else {
  applyI18n();
}