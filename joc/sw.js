/* Agència Digital — service worker: permet jugar sense connexió i instal·lar el joc com a app */
const CACHE = 'agencia-digital-v3';
const ASSETS = [
  './', './index.html', './style.css', './manifest.webmanifest',
  './js/i18n.js', './js/i18n-es.js', './js/i18n-en.js', './js/art.js', './js/data-lessons.js', './js/data-story1.js', './js/data-story2.js', './js/data-story3.js', './js/game.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Xarxa primer per als fitxers del joc (així les actualitzacions arriben de seguida); memòria cau si no hi ha connexió.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok && (sameOrigin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'))) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((r) => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
