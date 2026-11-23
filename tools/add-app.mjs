#!/usr/bin/env node
// Usage: node tools/add-app.mjs <id> "<Name>" [lang] [dir] [theme]
// Creates <id>/ and appends to apps.json.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
const [id, name, lang = 'en', dir = 'ltr', theme = '#334155'] = process.argv.slice(2);
if (!id || !name) {
  console.error('Usage: node tools/add-app.mjs <id> "<Name>" [lang] [dir] [theme]');
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(id)) {
  console.error('id must be lowercase letters, digits, hyphens');
  process.exit(1);
}
const root = process.cwd();
const appDir = path.join(root, id);
if (existsSync(appDir)) { console.error(`Folder ${id}/ already exists`); process.exit(1); }
const short = name.replace(/\s+Dashboard$/i, '');
const KEY   = id;
const indexHtml = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${name}</title>
  <meta name="theme-color" content="${theme}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="manifest" href="/${id}/manifest.webmanifest">
  <link rel="icon" href="/${id}/assets/icons/icon-96x96.png" sizes="96x96" type="image/png">
  <link rel="apple-touch-icon" href="/${id}/assets/icons/icon-192x192.png">
  <link rel="stylesheet" href="/${id}/assets/css/styles.css">
  <script>
    try {
      const m = JSON.parse(localStorage.getItem('edu:mode') || '"light"');
      const l = JSON.parse(localStorage.getItem('edu:lang') || '"${lang}"');
      document.documentElement.dataset.mode = m;
      document.documentElement.lang = l;
      document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    } catch {}
  </script>
  <script>
    window.I18N = {
      'app.title':   { en: '${name}', fr: '${name}', ar: '${name}' },
      'app.welcome': { en: 'Welcome', fr: 'Bienvenue', ar: 'مرحباً' },
      'app.sample':  { en: 'Open sample module', fr: 'Ouvrir le module d\\u2019exemple',
                       ar: 'افتح الوحدة التجريبية' },
      'nav.signin':  { en: 'Sign in', fr: 'Connexion', ar: 'تسجيل الدخول' },
      'nav.install': { en: 'Install', fr: 'Installer', ar: 'تثبيت' },
      'nav.addHome': { en: 'Add to Home', fr: 'Ajouter à l\\u2019accueil', ar: 'أضف للشاشة' },
      'nav.lang':    { en: 'Language', fr: 'Langue', ar: 'اللغة' },
      'nav.theme':   { en: 'Toggle theme', fr: 'Changer de thème', ar: 'تبديل المظهر' }
    };
  </script>
</head>
<body>
  <div data-include="/${id}/header.html"></div>
  <main>
    <h1 data-i18n="app.welcome">Welcome</h1>
    <p><a href="/${id}/sample-module/lesson1.html" data-i18n="app.sample">Open sample module</a></p>
  </main>
  <div data-include="/${id}/footer.html"></div>
  <script src="/shared/include.js"></script>
  <script src="/register-sw.js" defer></script>
  <script type="module">
    import { initHeader, externalAppLink } from '/shared/ui.js';
    import { initInstallButton } from '/shared/install.js';
    import '/shared/i18n.js';
    initHeader(); initInstallButton();
  </script>
</body>
</html>
`;
const headerHtml = `<header>
  <strong data-i18n="app.title">${short}</strong>
  <div class="hdr-actions">
    <button id="theme-btn" aria-label="Toggle theme" data-i18n-attr="aria-label:nav.theme" type="button">☾</button>
    <select id="lang-sel" aria-label="Language" data-i18n-attr="aria-label:nav.lang">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
    <button id="install-btn" hidden type="button" data-i18n="nav.install">Install</button>
    <button id="user-chip" type="button" data-i18n="nav.signin">Sign in</button>
  </div>
</header>
`;
const footerHtml = `<footer>
  <small>${short} · ${new Date().getFullYear()}</small>
</footer>
`;
const manifest = {
  id: `/${id}/`, name, short_name: short, lang, dir,
  start_url: `/${id}/`, scope: `/${id}/`,
  display: 'standalone', orientation: 'any',
  theme_color: theme, background_color: '#f6f7f9',
  categories: ['education'],
  icons: [96, 144, 192, 512].map((s) => ({
    src: `/${id}/assets/icons/icon-${s}x${s}.png`,
    sizes: `${s}x${s}`, type: 'image/png', purpose: 'any'
  })),
  shortcuts: [
    { name: 'Sample module', short_name: 'Sample',
      url: `/${id}/sample-module/lesson1.html`,
      icons: [{ src: `/${id}/assets/icons/icon-96x96.png`, sizes: '96x96' }] }
  ]
};
const appCss = `:root { --brand: ${theme}; --bg:#f6f7f9; --fg:#1b1f24; --card:#ffffff; --line:#e3e6ea; --muted:#667; }
html[data-mode="dark"] { --bg:#0f1216; --fg:#e9edf2; --card:#171c22; --line:#242b33; --muted:#8a95a1; }
* { box-sizing: border-box; }
body { margin:0; min-height:100dvh; background:var(--bg); color:var(--fg);
       font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
       transition: background .15s, color .15s; }
header { background:var(--brand); color:#fff; padding:1rem 1.25rem;
         padding-top:calc(1rem + env(safe-area-inset-top));
         display:flex; align-items:center; justify-content:space-between; gap:.75rem; flex-wrap:wrap; }
.hdr-actions { display:flex; gap:.5rem; align-items:center; }
.hdr-actions button, .hdr-actions select {
  background:rgba(255,255,255,.15); color:#fff; border:1px solid rgba(255,255,255,.25);
  padding:.4rem .7rem; border-radius:8px; font-size:.9rem; cursor:pointer;
}
.hdr-actions button:hover, .hdr-actions select:hover { background:rgba(255,255,255,.25); }
main { padding:1.25rem; padding-bottom:calc(1.25rem + env(safe-area-inset-bottom)); }
a { color:var(--brand); }
html[data-mode="dark"] a { color:#4ecfa3; }
footer { padding:1rem 1.25rem; color:var(--muted); border-top:1px solid var(--line); }
[data-signedin="1"] { background:rgba(255,255,255,.35) !important; }
`;
const appJs = `// ${name} — app entry. Replace with real logic.
// Always go through shared/store.js; never touch localStorage directly.
import { appData } from '/shared/store.js';
const KEY = 'visits';
(async () => {
  const n = (await appData.get('${KEY}', KEY, 0)) + 1;
  await appData.set('${KEY}', KEY, n);
  console.log('${id} loaded, visits:', n);
})();
`;
const moduleHeader = `<nav class="mod-hdr">
  <a href="/${id}/">← <span data-i18n="mod.back">Back to ${short}</span></a>
</nav>
`;
const moduleFooter = `<footer class="mod-ftr">
  <small data-i18n="mod.copy">${short} · sample module</small>
</footer>
`;
const moduleCss = `/* Sample-module-scoped styles */
.mod-hdr { padding:.75rem 1.25rem; border-bottom:1px solid var(--line); }
.mod-hdr a { text-decoration:none; }
.mod-ftr { margin-top:1.5rem; }
canvas { background:var(--card); border:1px solid var(--line); border-radius:12px; display:block; max-width:100%; }
`;
const moduleJs = `// Sample module-specific JS (canvas drawing). Import only on pages that need it.
export function attachCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.round(rect.width  * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.scale(dpr, dpr);
  let drawing = false;
  const draw = (x, y) => {
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  canvas.addEventListener('pointerdown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(...pos(e));
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    draw(...pos(e));
  });
  const end = () => { drawing = false; };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
}
`;
const lessonHtml = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Lesson 1 — ${name}</title>
  <meta name="theme-color" content="${theme}">
  <link rel="stylesheet" href="/${id}/assets/css/styles.css">
  <link rel="stylesheet" href="/${id}/sample-module/styles.css">
  <script>
    try {
      const m = JSON.parse(localStorage.getItem('edu:mode') || '"light"');
      const l = JSON.parse(localStorage.getItem('edu:lang') || '"${lang}"');
      document.documentElement.dataset.mode = m;
      document.documentElement.lang = l;
      document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    } catch {}
  </script>
  <script>
    window.I18N = {
      'page.title':  { en: 'Lesson 1 — Drawing', fr: 'Leçon 1 — Dessin', ar: 'الدرس الأول — الرسم' },
      'lesson.hint': { en: 'Draw with the pointer.', fr: 'Dessinez avec le pointeur.',
                       ar: 'ارسم بمؤشر الفأرة أو الإصبع.' },
      'lesson.clear':{ en: 'Clear', fr: 'Effacer', ar: 'مسح' },
      'mod.back':    { en: 'Back to ${short}', fr: 'Retour à ${short}', ar: 'العودة إلى ${short}' },
      'mod.copy':    { en: '${short} · sample module', fr: '${short} · module exemple',
                       ar: '${short} · وحدة تجريبية' }
    };
  </script>
</head>
<body>
  <div data-include="/${id}/header.html"></div>
  <div data-include="/${id}/sample-module/header.html"></div>
  <main>
    <h1 data-i18n="page.title">Lesson 1 — Drawing</h1>
    <p data-i18n="lesson.hint">Draw with the pointer.</p>
    <canvas id="board" height="320" style="width:100%;height:320px;"></canvas>
    <p><button id="clear" class="btn" data-i18n="lesson.clear" type="button">Clear</button></p>
  </main>
  <div data-include="/${id}/sample-module/footer.html"></div>
  <div data-include="/${id}/footer.html"></div>
  <script src="/shared/include.js"></script>
  <script src="/register-sw.js" defer></script>
  <script type="module">
    import { initHeader } from '/shared/ui.js';
    import { initInstallButton } from '/shared/install.js';
    import '/shared/i18n.js';
    import { attachCanvas } from '/${id}/sample-module/draw.js';
    initHeader(); initInstallButton();
    const canvas = document.getElementById('board');
    attachCanvas(canvas);
    document.getElementById('clear').addEventListener('click', () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  </script>
</body>
</html>
`;
// ── write files ────────────────────────────────────────────
await mkdir(path.join(appDir, 'assets/css'), { recursive: true });
await mkdir(path.join(appDir, 'assets/js'),  { recursive: true });
await mkdir(path.join(appDir, 'assets/icons'), { recursive: true });
await mkdir(path.join(appDir, 'sample-module'), { recursive: true });
await writeFile(path.join(appDir, 'index.html'), indexHtml);
await writeFile(path.join(appDir, 'header.html'), headerHtml);
await writeFile(path.join(appDir, 'footer.html'), footerHtml);
await writeFile(path.join(appDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(path.join(appDir, 'assets/css/styles.css'), appCss);
await writeFile(path.join(appDir, 'assets/js/app.js'), appJs);
await writeFile(path.join(appDir, 'sample-module/header.html'), moduleHeader);
await writeFile(path.join(appDir, 'sample-module/footer.html'), moduleFooter);
await writeFile(path.join(appDir, 'sample-module/styles.css'), moduleCss);
await writeFile(path.join(appDir, 'sample-module/draw.js'), moduleJs);
await writeFile(path.join(appDir, 'sample-module/lesson1.html'), lessonHtml);
// ── update apps.json ───────────────────────────────────────
const appsPath = path.join(root, 'apps.json');
const data = JSON.parse(await readFile(appsPath, 'utf8'));
data.apps = data.apps.filter((a) => a.id !== id);
data.apps.push({
  id, name, short_name: short, path: `/${id}/`,
  lang, dir, theme_color: theme,
  icon: `/${id}/assets/icons/icon-192x192.png`
});
data.apps.sort((a, b) => a.id.localeCompare(b.id));
await writeFile(appsPath, JSON.stringify(data, null, 2) + '\n');
console.log(`✓ Created ${id}/ (index, manifest, partials, sample-module)`);
console.log(`✓ Registered in apps.json`);
console.log(`→ Drop icon-{96,144,192,512}x{...}.png into ${id}/assets/icons/`);