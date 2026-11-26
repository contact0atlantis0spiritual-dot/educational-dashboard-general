/* Edu Dash — single service worker, scope "/". */
const VERSION = 'v7';
const CACHE   = `edu-dash-${VERSION}`;
const SHELL = [
  '/', '/index.html', '/offline.html', '/apps.json', '/register-sw.js',
  '/shared/config.js', '/shared/store.js', '/shared/auth.js',
  '/shared/i18n.js', '/shared/include.js',
  '/shared/ui.js', '/shared/install.js'
];
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(SHELL.map((u) => cache.add(u).catch(() => {})));
    // Precache each app's entry page so freshly-installed apps work offline.
    try {
      const res = await fetch('/apps.json', { cache: 'no-cache' });
      const { apps = [] } = await res.json();
      await Promise.all(apps.map((a) => cache.add(a.path).catch(() => {})));
    } catch { /* offline during install — fine */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith('edu-dash-') && k !== CACHE)
          .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
/* HTML/CSS/JS/JSON: network-first so deploys land on the next visit.
   Images/fonts/media:        stale-while-revalidate.
   Cross-origin (e.g. supabase.co): bypass — let the browser handle it. */
const NETWORK_FIRST = /\.(?:html?|css|js|mjs|json|webmanifest)$/i;
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isNav = req.mode === 'navigate' || url.pathname.endsWith('/');
  if (isNav || NETWORK_FIRST.test(url.pathname)) {
    event.respondWith(networkFirst(req, isNav));
  } else {
    event.respondWith(staleWhileRevalidate(req));
  }
});
async function networkFirst(req, isNav) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached =
      (await cache.match(req, { ignoreSearch: true })) ||
      (await cache.match(new URL(req.url).pathname));
    if (cached) return cached;
    if (isNav) {
      const offline = await cache.match('/offline.html');
      if (offline) return offline;
    }
    return Response.error();
  }
}
async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const network = fetch(req)
    .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return cached || (await network) || Response.error();
}