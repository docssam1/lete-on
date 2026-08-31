/* GFIELD Geometry World — service worker.
 *
 * Purpose: make the site installable (so "Add to Home Screen" gives a real
 * fullscreen app icon) and keep it usable offline. Strategy is NETWORK-FIRST
 * for same-origin GET requests, so an online visitor always sees the freshest
 * deploy; the cache is only a fallback when the network is unavailable. This
 * deliberately avoids the classic "PWA keeps serving an old version" trap.
 */
const CACHE = "gfield-geo-v22";
const CORE = [
  "/geometry/world-map/",
  "/geometry/cube-town/",
  "/geometry/solid-vista/",
  "/geometry/solid-vista/styles.css?v=solid-studio-3",
  "/geometry/solid-vista/soma.css?v=solid-2",
  "/geometry/solid-vista/material-refresh.css?v=solid-1",
  "/geometry/solid-vista/app.js?v=solid-studio-7",
  "/geometry/solid-vista/assets/net-level-1.webp?v=material-3",
  "/geometry/solid-vista/assets/net-level-2.webp?v=material-3",
  "/geometry/solid-vista/assets/net-level-3.webp?v=material-3",
  "/geometry/solid-vista/assets/net-level-4.webp?v=material-3",
  "/geometry/solid-vista/assets/net-level-5.webp?v=material-3",
  "/geometry/solid-vista/assets/soma-level-1.webp?v=material-3",
  "/geometry/solid-vista/assets/soma-level-2.webp?v=material-3",
  "/geometry/solid-vista/assets/soma-level-3.webp?v=material-3",
  "/geometry/solid-vista/assets/soma-level-4.webp?v=material-3",
  "/geometry/solid-vista/assets/soma-level-5.webp?v=material-3",
  "/geometry/games/net-observatory/",
  "/geometry/games/net-observatory/styles.css?v=net-5",
  "/geometry/games/net-observatory/app.js?v=net-6",
  "/geometry/games/net-observatory/levels.js?v=net-6",
  "/geometry/games/net-observatory/i18n.js?v=net-6",
  "/geometry/games/net-observatory/fold-view.js?v=net-6",
  "/geometry/games/soma-cube/",
  "/geometry/games/soma-cube/styles.css?v=soma-5",
  "/geometry/games/soma-cube/material-refresh.css?v=soma-1",
  "/geometry/games/soma-cube/app.js?v=soma-9",
  "/geometry/games/soma-cube/levels.js?v=soma-3",
  "/geometry/games/soma-cube/i18n.js?v=soma-5",
  "/geometry/games/dice-roll/",
  "/geometry/games/dice-roll/styles.css?v=dice-roll-6",
  "/geometry/games/dice-roll/app.js?v=dice-roll-9",
  "/geometry/games/dice-roll/levels.js?v=dice-roll-3",
  "/geometry/games/dice-roll/route-scene.js?v=dice-roll-3",
  "/geometry/games/path-walk/",
  "/geometry/games/path-walk/styles.css?v=path-walk-2",
  "/geometry/games/path-walk/app.js?v=path-walk-2",
  "/geometry/games/path-walk/levels.js?v=path-walk-2",
  "/geometry/worksheet/path-walk/",
  "/geometry/worksheet/path-walk/styles.css?v=path-sheet-2",
  "/geometry/worksheet/path-walk/app.js?v=path-sheet-2",
  "/geometry/manifest.webmanifest",
  "/geometry/shared/viewport-fit.js?v=1",
  "/geometry/shared/problem-pool.js",
  "/geometry/shared/profile-storage.js",
  "/geometry/shared/pwa.css?v=2",
  "/geometry/shared/pwa.js?v=3",
  "/geometry/vendor/three/three.module.js",
  "/geometry/vendor/three/addons/controls/OrbitControls.js",
  "/geometry/vendor/three/addons/geometries/RoundedBoxGeometry.js",
  "/geometry/assets/ui/bg-ambient.webp",
  "/geometry/world-map/assets/geometry-characters.png",
  "/geometry/assets/audio/cubi/success/ko/good-job.mp3",
  "/geometry/assets/audio/cubi/success/ko/great-job.mp3",
  "/geometry/assets/audio/cubi/success/ko/success.mp3",
  "/geometry/assets/audio/cubi/success/en/good-job.mp3",
  "/geometry/assets/audio/cubi/success/en/great-job.mp3",
  "/geometry/assets/audio/cubi/success/en/success.mp3",
  "/geometry/assets/audio/cubi/success/zh/good-job.mp3",
  "/geometry/assets/audio/cubi/success/zh/great-job.mp3",
  "/geometry/assets/audio/cubi/success/zh/success.mp3",
  "/geometry/assets/audio/cubi/success/ja/good-job.mp3",
  "/geometry/assets/audio/cubi/success/ja/great-job.mp3",
  "/geometry/assets/audio/cubi/success/ja/success.mp3",
  "/geometry/assets/icons/icon-192.png",
  "/geometry/assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let sameOrigin = false;
  try { sameOrigin = new URL(req.url).origin === self.location.origin; } catch (e) { sameOrigin = false; }
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res && res.ok && sameOrigin) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") {
        const fallback = await caches.match("/geometry/world-map/");
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
