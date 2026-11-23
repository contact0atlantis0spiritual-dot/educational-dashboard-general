// shared/include.js — <div data-include="/arabic/header.html"></div> loader.
const cache = new Map();

// Readiness contract: ui.js / install.js wait for this so their inits
// don't run before the header partial has been injected into the DOM.
window.__partialsLoaded = false;
let _resolveReady;
window.partialsReady = new Promise((res) => { _resolveReady = res; });

async function fetchPartial(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const text = await res.text();
  cache.set(url, text);
  return text;
}

async function processNode(node) {
  if (!node.isConnected) return;                // already replaced by another parent
  const url = node.dataset.include;
  if (!url) return;
  try {
    const html = await fetchPartial(url);
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    const fragment = tpl.content;
    const nested = [...fragment.querySelectorAll('[data-include]')];
    node.replaceWith(fragment);
    await Promise.all(nested.map(processNode));
  } catch (err) {
    console.error('[include]', url, err);
    node.replaceWith(document.createComment(` include failed: ${url} `));
  }
}

async function run() {
  const roots = [...document.querySelectorAll('[data-include]')];
  await Promise.all(roots.map(processNode));
  window.__partialsLoaded = true;
  _resolveReady();
  document.dispatchEvent(new CustomEvent('partials:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run);
} else {
  run();
}