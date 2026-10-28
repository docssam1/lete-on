/* 수의 마법 앱 서비스 워커(2026-10-28, 원장 「이제 프로그램·iOS·APK 하자」).
 * 아이폰 「홈 화면에 추가」, 윈도우·안드로이드 「앱 설치」의 바탕이다. 하는 일:
 *  - 화면(HTML): 네트워크 먼저 → 안 되면 저장본. 그래서 고친 화면은 늘 바로 반영되고, 인터넷이 끊겨도 열린다.
 *  - 꼬리표(?v=) 붙은 파일: 한 번 받으면 그대로 쓴다(꼬리표가 바뀌면 주소가 바뀌어 새로 받는다).
 *  - 꼬리표 없는 스크립트·스타일·데이터: 네트워크 먼저(새 화면과 옛 스크립트가 섞이지 않게) → 안 되면 저장본.
 *  - 꼬리표 없는 그림·소리·글꼴: 저장본을 먼저 보여 주고 뒤에서 새로 받아 둔다.
 *  - 로그인·회원·기록(Supabase)과 그 밖의 다른 사이트 요청은 건드리지 않는다(저장하지 않는다). 글꼴 사이트만 저장.
 *  - 「다 받아 두기」(install.html): offline-files.json 목록을 전부 받아 둔다 — 그 뒤로는 인터넷 없이도 공부할 수 있다.
 *  - 인터넷이 없을 때 꼬리표가 다른 주소를 찾으면 꼬리표를 빼고 같은 파일을 찾아 준다.
 * 끄기: 이 파일 맨 위 KILL = true 로 올리면 다음 접속 때 저장본을 모두 지우고 스스로 물러난다. */
'use strict';
const VERSION = '20261028-app1';
const KILL = false;
const SHELL = 'nm-shell-' + VERSION;      // 첫 화면에 꼭 필요한 것(설치 때 받음)
const FILES = 'nm-files';                  // 쓰면서 받은 것·「다 받아 두기」로 받은 것(버전과 무관하게 이어 씀)
const FONTS = 'nm-fonts';
const SHELL_PAGES = ['access.html', 'index.html', 'install.html'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];
const SCOPE = new URL('./', self.location).href;

self.addEventListener('install', (event) => {
  if (KILL) { self.skipWaiting(); return; }
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const urls = new Set(SHELL_PAGES.map((p) => new URL(p, SCOPE).href));
    urls.add(new URL('manifest.webmanifest', SCOPE).href);
    // 화면이 부르는 파일(스크립트·스타일·글꼴·그림)을 그 화면의 주소 그대로 — 꼬리표가 바뀌어도 목록을 손으로 고칠 일이 없다
    for (const page of SHELL_PAGES) {
      try {
        const res = await fetch(new URL(page, SCOPE).href, { cache: 'no-cache' });
        if (!res.ok) continue;
        const html = await res.text();
        for (const m of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)) {
          const u = new URL(m[1], new URL(page, SCOPE));
          if (u.origin === self.location.origin && /\.(js|mjs|css|woff2?|ttf|png|webp|svg|jpe?g|json|webmanifest)(\?|$)/i.test(u.pathname + u.search)) urls.add(u.href);
        }
      } catch (_) { /* 받지 못한 것은 쓸 때 받는다 */ }
    }
    await Promise.all([...urls].map((u) => cache.add(new Request(u, { cache: 'no-cache' })).catch(() => null)));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    if (KILL) {
      await Promise.all(keys.filter((k) => k.startsWith('nm-')).map((k) => caches.delete(k)));
      await self.registration.unregister();
      return;
    }
    await Promise.all(keys.filter((k) => k.startsWith('nm-shell-') && k !== SHELL).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'skip-waiting') self.skipWaiting();
  if (data.type === 'download-all') event.waitUntil(downloadAll(event.source));
  if (data.type === 'status') event.waitUntil(status(event.source));
});

async function offlineList() {
  const res = await fetch(new URL('offline-files.json', SCOPE).href, { cache: 'no-cache' });
  if (!res.ok) throw new Error('list');
  const list = await res.json();
  return list.files.map((f) => new URL(f, SCOPE).href);
}
async function status(client) {
  try {
    const list = await offlineList(), cache = await caches.open(FILES);
    let have = 0; for (const u of list) if (await cache.match(u, { ignoreSearch: true })) have++;
    client && client.postMessage({ type: 'status', have, total: list.length, version: VERSION });
  } catch (_) { client && client.postMessage({ type: 'status', have: 0, total: 0, version: VERSION, error: true }); }
}
async function downloadAll(client) {
  let list;
  try { list = await offlineList(); } catch (_) { client && client.postMessage({ type: 'download', error: 'list' }); return; }
  const cache = await caches.open(FILES);
  let done = 0, failed = 0;
  const queue = list.slice();
  const worker = async () => {
    for (let u = queue.shift(); u; u = queue.shift()) {
      try {
        if (!(await cache.match(u))) { const res = await fetch(u); if (res.ok) await cache.put(u, res); else failed++; }
      } catch (_) { failed++; }
      done++;
      if (done % 20 === 0 || done === list.length) client && client.postMessage({ type: 'download', done, total: list.length, failed });
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  client && client.postMessage({ type: 'download', done, total: list.length, failed, finished: true });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || KILL) return;
  const url = new URL(req.url);
  if (/\.apk$/i.test(url.pathname)) return;   // 앱 설치 파일은 저장하지 않는다
  if (url.origin !== self.location.origin) {
    if (FONT_HOSTS.includes(url.hostname)) event.respondWith(cacheFirst(req, FONTS));
    return;                                   // Supabase·그 밖의 사이트: 그대로 네트워크
  }
  if (req.mode === 'navigate' || req.destination === 'document') { event.respondWith(networkFirst(req)); return; }
  if (req.headers.has('range')) { event.respondWith(rangeFromCache(req)); return; }
  if (url.search && /[?&]v=/.test(url.search)) { event.respondWith(cacheFirst(req, FILES)); return; }
  // 꼬리표 없는 스크립트·스타일·데이터는 네트워크 먼저 — 새 화면(HTML)과 옛 스크립트가 섞이지 않게
  if (/\.(m?js|css|json|webmanifest)$/i.test(url.pathname)) { event.respondWith(networkFirst(req)); return; }
  event.respondWith(staleWhileRevalidate(req));   // 그림·소리·글꼴: 한 번 늦게 바뀌어도 탈이 없다
});

async function fromAnyCache(req, loose) {
  const hit = await caches.match(req);
  if (hit || !loose) return hit;
  return caches.match(req, { ignoreSearch: true });   // 인터넷이 없을 때만: 꼬리표가 다른 같은 파일
}
async function networkFirst(req) {
  try {
    const res = await fetchWithTimeout(req, 6000);
    if (res && res.ok) { const c = await caches.open(FILES); c.put(req, res.clone()).catch(() => {}); }
    return res;
  } catch (_) {
    const hit = await fromAnyCache(req, true);
    if (hit) return hit;
    if (req.mode !== 'navigate' && req.destination !== 'document') return Response.error();
    const home = await caches.match(new URL('access.html', SCOPE).href, { ignoreSearch: true });
    return home || new Response('<meta charset="utf-8"><p style="font:16px sans-serif;padding:24px">인터넷에 연결되면 다시 열어 주세요.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
async function cacheFirst(req, name) {
  const hit = await caches.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) { const c = await caches.open(name); c.put(req, res.clone()).catch(() => {}); }
    return res;
  } catch (e) {
    const loose = await fromAnyCache(req, true);
    if (loose) return loose;
    throw e;
  }
}
async function staleWhileRevalidate(req) {
  const hit = await caches.match(req);
  const update = fetch(req).then(async (res) => {
    if (res && res.ok) { const c = await caches.open(FILES); await c.put(req, res.clone()); }
    return res;
  }).catch(() => null);
  if (hit) return hit;
  const res = await update;
  if (res) return res;
  const loose = await fromAnyCache(req, true);
  return loose || Response.error();
}
/* 소리 파일은 브라우저가 앞뒤를 나눠(Range) 달라고 한다. 저장본이 있으면 그 부분만 잘라 준다(아이폰 사파리가 이렇게 요구한다). */
async function rangeFromCache(req) {
  const hit = await fromAnyCache(new Request(req.url), true);
  if (!hit) return fetch(req);
  const buf = await hit.arrayBuffer(), size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  let start = m && m[1] ? +m[1] : 0, end = m && m[2] ? +m[2] : size - 1;
  if (m && !m[1] && m[2]) { start = Math.max(0, size - +m[2]); end = size - 1; }
  end = Math.min(end, size - 1);
  if (start > end || start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), { status: 206, headers: {
    'Content-Type': hit.headers.get('Content-Type') || 'application/octet-stream',
    'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
}
function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(req).then((r) => { clearTimeout(t); resolve(r); }, (e) => { clearTimeout(t); reject(e); });
  });
}
