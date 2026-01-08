const CACHE_NAME = 'offline-notes-v4';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/Note.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll(STATIC_ASSETS).catch(err => {
                console.error('Failed to cache:', err);
                // Continue anyway
            })
        )
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
    const url = new URL(req.url);

    if (req.method !== 'GET') return;

    // Don't cache Firebase or external APIs
    if (url.origin !== location.origin) {
        event.respondWith(fetch(req));
        return;
    }

    event.respondWith(
        caches.match(req).then(cached => {
            const fetchPromise = fetch(req).then(res => {
                // Only cache successful responses
                if (res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
                }
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
