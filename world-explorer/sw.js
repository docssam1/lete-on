const CACHE_NAME = 'world-explorer-shell-v1';
const SCOPE = '/world-explorer/';
const APP_SHELL = [
  SCOPE,
  SCOPE + 'index.html',
  SCOPE + 'styles.css',
  SCOPE + 'app.js',
  SCOPE + 'character.js',
  SCOPE + 'character-data.js',
  SCOPE + 'camera-controller.js',
  SCOPE + 'map-game.js',
  SCOPE + 'data/countries-195.js',
  SCOPE + 'data/world-lowres.js',
  SCOPE + 'vendor/three.module.js',
  SCOPE + 'vendor/three.core.js',
  SCOPE + 'vendor/d3.esm.js',
  SCOPE + 'manifest.webmanifest',
  SCOPE + 'assets/icons/icon-192.png',
  SCOPE + 'assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
