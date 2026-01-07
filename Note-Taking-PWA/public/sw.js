const CACHE_NAME = 'offline-notes-v3';
const STATIC_ASSETS = [
    './',
    './index.html',
    './src/style.css',
    './src/app.js',
    './src/idb.js',
    './manifest.json',
    './public/Note.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
        )
    );
    self.clients.claim();
});

// Cache-first for navigation and static assets
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    event.respondWith(
        caches.match(req).then(cached => {
            const fetchPromise = fetch(req).then(res => {
                const copy = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
                return res;
            }).catch(() => cached);
            return cached || fetchPromise;
        })
    );
});

/*
self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-outbox') {
    event.waitUntil(syncFunction());
  }
});
*/
