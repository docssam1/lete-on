/* GFIELD Geometry World — service worker.
 *
 * Purpose: make the site installable (so "Add to Home Screen" gives a real
 * fullscreen app icon) and keep it usable offline. Strategy is NETWORK-FIRST
 * for same-origin GET requests, so an online visitor always sees the freshest
 * deploy; the cache is only a fallback when the network is unavailable. This
 * deliberately avoids the classic "PWA keeps serving an old version" trap.
 */
const CACHE = "gfield-geo-v2";
const CORE = [
  "/geometry/world-map/",
  "/geometry/cube-town/",
  "/geometry/manifest.webmanifest",
  "/geometry/shared/pwa.css?v=2",
  "/geometry/shared/pwa.js?v=2",
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
