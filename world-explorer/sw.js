const CACHE_PREFIX = 'world-explorer-shell-';
const CACHE_VERSION = 'v11';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const SCOPE = '/world-explorer/';
const SHELL_URL = SCOPE + 'index.html';
const ASSET_VERSION = '11';
const COUNTRY_CODES = 'af al dz ad ao ag ar am au at az bs bh bd bb by be bz bj bt bo ba bw br bn bg bf bi cv kh cm ca cf td cl cn co km cg cd cr ci hr cu cy cz dk dj dm do ec eg sv gq er ee sz et fj fi fr ga gm ge de gh gr gd gt gn gw gy ht hn hu is in id ir iq ie il it jm jp jo kz ke ki kp kr kw kg la lv lb ls lr ly li lt lu mg mw my mv ml mt mh mr mu mx fm md mc mn me ma mz mm na nr np nl nz ni ne ng mk no om pk pw pa pg py pe ph pl pt qa ro ru rw kn lc vc ws sm st sa sn rs sc sl sg sk si sb so za ss es lk sd sr se ch sy tj tz th tl tg to tt tn tr tm tv ug ua ae gb us uy uz vu va ve vn ye zm zw ps'.split(' ');
const FLAG_ASSETS = COUNTRY_CODES.map(code => SCOPE + `assets/flags/${code}.svg`);
const CORE_SHELL = [
  SCOPE,
  SHELL_URL,
  SCOPE + `styles.css?v=${ASSET_VERSION}`,
  SCOPE + `app.js?v=${ASSET_VERSION}`,
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
const OPTIONAL_ASSETS = [
  SCOPE + 'assets/intro/gfield-world-explorer-intro.mp4?v=9',
  ...FLAG_ASSETS
];

async function cacheOptionalAssets(cache) {
  const batchSize = 20;
  for (let index = 0; index < OPTIONAL_ASSETS.length; index += batchSize) {
    const batch = OPTIONAL_ASSETS.slice(index, index + batchSize);
    await Promise.allSettled(batch.map(url => cache.add(url)));
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        await cache.addAll(CORE_SHELL);
        await cacheOptionalAssets(cache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function currentCacheFallback(request, includeShell = false) {
  const cache = await caches.open(CACHE_NAME);
  const exact = await cache.match(request);
  if (exact) return exact;
  if (!includeShell) return undefined;
  return (await cache.match(SHELL_URL)) || cache.match(SCOPE);
}

async function networkFirst(request, includeShell = false) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
      return response;
    }
    return (await currentCacheFallback(request, includeShell)) || response;
  } catch (error) {
    const cached = await currentCacheFallback(request, includeShell);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;

  const needsFreshCode = event.request.mode === 'navigate' || ['script', 'style', 'worker'].includes(event.request.destination);
  if (needsFreshCode) {
    event.respondWith(networkFirst(event.request, event.request.mode === 'navigate'));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
