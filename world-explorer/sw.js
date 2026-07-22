const CACHE_NAME = 'world-explorer-shell-v4';
const SCOPE = '/world-explorer/';
const COUNTRY_CODES = 'af al dz ad ao ag ar am au at az bs bh bd bb by be bz bj bt bo ba bw br bn bg bf bi cv kh cm ca cf td cl cn co km cg cd cr ci hr cu cy cz dk dj dm do ec eg sv gq er ee sz et fj fi fr ga gm ge de gh gr gd gt gn gw gy ht hn hu is in id ir iq ie il it jm jp jo kz ke ki kp kr kw kg la lv lb ls lr ly li lt lu mg mw my mv ml mt mh mr mu mx fm md mc mn me ma mz mm na nr np nl nz ni ne ng mk no om pk pw pa pg py pe ph pl pt qa ro ru rw kn lc vc ws sm st sa sn rs sc sl sg sk si sb so za ss es lk sd sr se ch sy tj tz th tl tg to tt tn tr tm tv ug ua ae gb us uy uz vu va ve vn ye zm zw ps'.split(' ');
const FLAG_ASSETS = COUNTRY_CODES.map(code => SCOPE + `assets/flags/${code}.svg`);
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
  SCOPE + 'assets/icons/icon-512.png',
  ...FLAG_ASSETS
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

  const needsFreshCode = event.request.mode === 'navigate' || ['script', 'style', 'worker'].includes(event.request.destination);
  if (needsFreshCode) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
