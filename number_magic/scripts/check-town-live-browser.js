'use strict';
// 살아 있는 마을 지도(app/town-live.js) 검사 — WebGL(swiftshader)을 켠 브라우저에서
//  ① 캔버스가 #townWorld 맨 아래에 붙고 실제로 그려진다(빈 화면이 아니다)
//  ② 장소 발밑이 TOWN_SPOTS 자리와 맞는다(이름표·누르는 자리 그대로)
//  ③ 건물에 들어가면 캔버스가 정리되고, 돌아오면 다시 붙는다
//  ④ 움직임 줄이기면 한 장만 그린다 ⑤ ?live=0 이면 붙지 않는다 ⑥ 페이지 오류 0
// 쓰는 법: node number_magic/scripts/check-town-live-browser.js   (NM_TOWN_ARTIFACTS=폴더 → 캡처 저장)
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('node:assert/strict');
const { chromium } = require('./lib/playwright');
const root = path.resolve(__dirname, '../..'), out = process.env.NM_TOWN_ARTIFACTS;
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.glb': 'model/gltf-binary', '.webp': 'image/webp' };
const server = http.createServer((req, res) => { const f = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0])); if (!f.startsWith(root + '/') || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end(); } res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(res); });
const SPOT_EXPECT = { tower: [0.33, 0.205], tents: [0.155, 0.47], tavern: [0.49, 0.55], chapel: [0.632, 0.475], houses: [0.555, 0.735], mush: [0.20, 0.78], west: [0.035, 0.535], windmill: [0.865, 0.47], dock: [0.79, 0.87] };
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    if (out) fs.mkdirSync(out, { recursive: true });
    for (const [width, height, motion, query] of [[1280, 800, 'no-preference', ''], [390, 844, 'no-preference', ''], [390, 844, 'reduce', ''], [1280, 800, 'no-preference', '&live=0']]) {
      const c = await b.newContext({ viewport: { width, height }, reducedMotion: motion }), p = await c.newPage(), errors = [];
      p.on('pageerror', e => errors.push(e.message));
      await c.route('**/*', r => { const u = r.request().url(); if (u.startsWith(base + '/') && r.request().method() === 'GET') return r.continue(); return r.abort(); });
      await c.route('**/app/entry.js?*', r => r.fulfill({ contentType: 'application/javascript', body: 'window.NM_ENTRY={mode:"fixture"};' }));
      await c.addInitScript(() => { if (!localStorage.getItem('nm_preview_state_v1')) localStorage.setItem('nm_preview_state_v1', JSON.stringify({ lang: 'ko', onboarded: true, name: 'Live map', view: 'town', avatar: { kind: 'girl', name: '민지' }, character: { number: 3, color: 'gold' }, coins: 10, progress: { 'N-01': { done: true } }, r0BannerSeen: true, attend: { last: new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10), days: 1 }, account: { status: 'active' } })); });
      await p.goto(base + '/number_magic/index.html?enter=1' + query);
      if (!await p.locator('#townVp').count()) await p.locator('#ttGame:visible,.t3d-btn[data-id="game"]').first().click();
      await p.waitForSelector('#townVp.is-illustrated');
      const tag = `${width}x${height}${motion === 'reduce' ? '-still' : ''}${query ? '-off' : ''}`;
      if (query) {
        await p.waitForTimeout(2500);
        assert.equal(await p.locator('canvas.nm-town-live').count(), 0, '?live=0 keeps the still map');
        assert((await p.locator('#townWorld').evaluate(e => getComputedStyle(e).backgroundImage)).includes('assets/map.jpg'), 'still map underneath');
      } else {
        await p.waitForFunction(() => window.__nmTownLive && window.__nmTownLive.report && document.querySelector('#townVp.is-live-map canvas.nm-town-live'), null, { timeout: 120000 });
        const info = await p.evaluate(() => { const cv = document.querySelector('canvas.nm-town-live'), w = document.querySelector('#townWorld'); return { first: w.firstElementChild === cv, report: window.__nmTownLive.report, w: cv.width, h: cv.height, rect: (r => [r.width, r.height])(cv.getBoundingClientRect()), world: (r => [r.width, r.height])(w.getBoundingClientRect()), pe: getComputedStyle(cv).pointerEvents }; });
        assert(info.first, 'canvas sits under every map layer');
        assert.equal(info.pe, 'none', 'canvas never takes taps');
        assert(Math.abs(info.rect[0] - info.world[0]) < 1 && Math.abs(info.rect[1] - info.world[1]) < 1, 'canvas covers the whole map');
        assert(info.w >= 700, 'canvas resolution follows the on-screen size: ' + info.w);
        for (const [k, [x, y]] of Object.entries(SPOT_EXPECT)) { const [rx, ry] = info.report.spots[k]; assert(Math.abs(rx - x) < 0.01 && Math.abs(ry - y) < 0.01, `place ${k} stands on its map spot (${rx},${ry})`); }
        assert(info.report.sails && info.report.wheel, 'windmill sails and water wheel are found for animation');
        assert.equal(info.report.still, motion === 'reduce', 'reduced motion draws one still frame');
        await p.waitForTimeout(1200);
        const px = await p.evaluate(() => { const cv = document.querySelector('canvas.nm-town-live'), g = document.createElement('canvas'); g.width = 64; g.height = 43; const x = g.getContext('2d'); window.__nmTownLive.renderAt(1); x.drawImage(cv, 0, 0, 64, 43); const d = x.getImageData(0, 0, 64, 43).data; let sum = 0, vari = 0, prev = 0; for (let i = 0; i < d.length; i += 4) { const l = d[i] + d[i + 1] + d[i + 2]; sum += l; vari += Math.abs(l - prev); prev = l; } return { avg: sum / (d.length / 4), vari: vari / (d.length / 4) }; });
        assert(px.avg > 120 && px.vari > 8, 'canvas shows a drawn scene, not a blank: ' + JSON.stringify(px));
        if (out) await p.screenshot({ path: path.join(out, tag + '.png') });
        // enter a building and come back — the canvas is cleaned up and mounted again
        const zone = p.locator('.nm-zone[data-spot="numberland"]');
        const onMap = await zone.evaluate(e => { const r = e.getBoundingClientRect(), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return r.x >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && !!hit && (hit === e || e.contains(hit)); });
        if (onMap) await zone.click(); else { if (await p.locator('.nm-town-toolbox').getAttribute('open') === null) await p.locator('.nm-town-toolbox > summary').click(); if (await p.locator('.nm-town-more').getAttribute('open') === null) await p.locator('.nm-town-more > summary').click(); await p.locator('[data-place="numberland"]').click(); }
        await p.waitForSelector('#backTown');
        assert.equal(await p.locator('canvas.nm-town-live').count(), 0, 'leaving the town disposes the live map');
        await p.click('#backTown'); await p.waitForSelector('#townVp.is-illustrated');
        await p.waitForFunction(() => document.querySelector('#townVp.is-live-map canvas.nm-town-live'), null, { timeout: 120000 });
        assert.equal(await p.locator('canvas.nm-town-live').count(), 1, 'one live map after returning');
        assert.equal(await p.locator('.nm-town-credits').count(), 1, 'map art credits link in the village menu');
      }
      assert.deepEqual(errors, [], 'no page errors');
      console.log('ok', tag);
      await c.close();
    }
    console.log('town live map: all checks passed');
  } finally { await b.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
