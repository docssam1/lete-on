'use strict';
// 인쇄한 학습지 사진 채점 시험판 검사(2026-11-21, app/photo-grade.js). 로컬 서버만 쓴다(외부 요청 없음).
// 사진은 브라우저가 직접 만든다: 학습지 쪽에 숫자 획을 얹고, 종이를 기울여(원근) 회색 바닥 위에 놓고 화면을 찍는다.
// 화면 사진: NM_PHOTO_ARTIFACTS=<절대 경로>
//  1 marks=1 이 없으면 귀퉁이 표시·단추·스크립트가 없다 / 있으면 쪽마다 표시 넷(왼쪽 위만 큼)과 「사진으로 채점」
//  2 휴대폰 화면(줄여 보기)에서 잰 자리 좌표 = 넓은 화면에서 잰 좌표
//  3 정답을 써서 기울여 찍은 사진 → 모두 ○ (C16 네모 칸 · C4 세로셈)
//  0 위 막대에 이모지·주차 열쇠·과정 번호가 없다 · 맞은 답 동그라미 수 = 점수(쪽 위 「12/12」) · 틀림을 누르면 빗금
//  4 틀린 답 → 「확인」 + 쓴 값대로 읽음 · 안 쓴 문항 → 「답 없음」 · ○/✕ 를 누르면 저장되고 새로고침 뒤에도 남음
//  5 사진이 옆으로 누워도(90°) 같은 결과 · 귀퉁이 하나가 가려지면 다시 찍으라는 안내
//  6 인쇄 화면: 귀퉁이 표시는 찍히고 채점 표시·단추는 안 나옴 · PDF 생성용(auto=0)은 표시만 있고 단추 없음
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('node:assert/strict');
const { chromium } = require('./lib/playwright');
const root = path.resolve(__dirname, '../..'), out = process.env.NM_PHOTO_ARTIFACTS;
if(out) fs.mkdirSync(out, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };
const server = http.createServer((req, res) => { const f = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0])); if(!f.startsWith(root + '/') || !fs.existsSync(f) || !fs.statSync(f).isFile()){ res.writeHead(404); return res.end(); } res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream'); res.end(fs.readFileSync(f)); });
// 아이 글씨를 흉내 낸 숫자 획(100×140 칸) — check-pen-sheet-browser.js 와 같은 모양
const P = { 0: [[[50,5],[20,25],[12,70],[22,120],[50,135],[78,118],[88,70],[78,22],[50,5]]], 1: [[[40,25],[55,5],[55,135]]], 2: [[[15,35],[30,10],[60,5],[82,25],[78,55],[15,130],[88,130]]], 3: [[[15,20],[45,5],[78,20],[75,55],[45,68],[80,85],[82,118],[50,135],[15,120]]], 4: [[[60,5],[12,95],[88,95]],[[65,40],[65,135]]], 5: [[[80,8],[25,8],[20,62],[55,55],[82,80],[78,118],[48,135],[15,122]]], 6: [[[75,10],[40,30],[18,80],[25,122],[52,135],[78,115],[75,82],[48,72],[22,90]]], 7: [[[12,8],[88,8],[45,135]]], 8: [[[50,68],[22,45],[30,12],[55,5],[78,25],[72,52],[50,68],[22,90],[25,125],[52,135],[80,120],[78,88],[50,68]]], 9: [[[78,40],[60,10],[30,8],[18,35],[35,62],[65,55],[78,40],[75,135]]], '-': [[[10,70],[90,70]]] };

/* 쪽에 답을 써 넣고(획), 기울여 찍는다. answers: 문항마다 써 넣을 글자(없으면 정답, null 이면 비움). 돌려주는 값: PNG */
async function shoot(p, pageIdx, opt){
  await p.evaluate(({ pageIdx, P, write, tilt, hide }) => {
    const G = window.NM_PHOTO_GRADE, pg = G._pages().find(x => x.idx === pageIdx), el = pg.el, r0 = el.getBoundingClientRect();
    const g = G._geometry(pg);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'tst-ink'); svg.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:6;overflow:visible;pointer-events:none';
    svg.setAttribute('viewBox', `0 0 ${el.offsetWidth} ${el.offsetHeight}`);
    const k = el.offsetWidth / r0.width, ox = (g.tl[0] - r0.left) * k, oy = (g.tl[1] - r0.top) * k, U = v => v * g.unitPx * k;
    g.items.forEach((it, i) => {
      if(!it.a) return;
      const zones = it.a.length === it.zones.length ? it.zones : it.zones.slice(0, 1);
      zones.forEach((z, j) => {
        const txt = write && Object.prototype.hasOwnProperty.call(write, i) ? write[i] : String(it.a[j]); if(txt == null) return;
        const zh = U(z.h), zw = U(z.w), sc = Math.min(zh * 0.7 / 140, zw * 0.9 / (txt.length * 110)), tw = txt.length * 110 * sc - 10 * sc;
        let x = ox + U(z.x) + (zw - tw) / 2; const y = oy + U(z.y) + (zh - 140 * sc) / 2;
        txt.split('').forEach(ch => { (ch === '-' ? [[[10, 70], [80, 70]]] : P[ch]).forEach(st => { const pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); pl.setAttribute('points', st.map(([a, b]) => (x + a * sc).toFixed(1) + ',' + (y + b * sc).toFixed(1)).join(' ')); pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#3a3f4a'); pl.setAttribute('stroke-width', String(Math.max(2.2, 13 * sc))); pl.setAttribute('stroke-linecap', 'round'); pl.setAttribute('stroke-linejoin', 'round'); svg.appendChild(pl); }); x += 110 * sc; });
      });
    });
    el.appendChild(svg);
    if(hide){ const m = el.querySelector('.nm-ph-mark.' + hide); m.dataset.tstHide = '1'; m.style.visibility = 'hidden'; }
    const back = document.createElement('div'); back.id = 'tstBack'; back.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#8a8f96'; document.body.appendChild(back);
    el.dataset.tstStyle = el.getAttribute('style') || '';
    const w = el.offsetWidth, h = el.offsetHeight, s = Math.min((innerWidth - 80) / w, (innerHeight - 80) / h);
    el.style.cssText += `;position:fixed!important;left:${(innerWidth - w) / 2}px;top:${(innerHeight - h) / 2}px;width:${w}px;height:${h}px;margin:0;z-index:9001;background:#fff;transform:perspective(2600px) ${tilt} scale(${s.toFixed(3)});border:0`;
    el.querySelector('.nm-ph-marks').style.visibility = 'hidden';
  }, { pageIdx, P, write: opt.write || null, tilt: opt.tilt || 'rotateX(7deg) rotateY(-5deg) rotateZ(2deg)', hide: opt.hide || '' });
  const png = await p.screenshot({ type: 'png' });
  await p.evaluate(pageIdx => { const pg = window.NM_PHOTO_GRADE._pages().find(x => x.idx === pageIdx), el = pg.el; el.setAttribute('style', el.dataset.tstStyle); el.querySelector('.tst-ink').remove(); document.getElementById('tstBack').remove(); el.querySelector('.nm-ph-marks').style.visibility = ''; el.querySelectorAll('[data-tst-hide]').forEach(m => { m.style.visibility = ''; delete m.dataset.tstHide; }); }, pageIdx);
  return png;
}
/* 사진(PNG) → 채점. turn: 90 이면 사진을 옆으로 눕혀서 넣는다 */
async function grade(p, pageIdx, png, turn){
  return p.evaluate(async ({ pageIdx, b64, turn }) => {
    const G = window.NM_PHOTO_GRADE, pg = G._pages().find(x => x.idx === pageIdx);
    let blob = await (await fetch('data:image/png;base64,' + b64)).blob();
    if(turn){ const im = await createImageBitmap(blob), cv = document.createElement('canvas'); cv.width = im.height; cv.height = im.width; const cx = cv.getContext('2d'); cx.translate(cv.width / 2, cv.height / 2); cx.rotate(Math.PI / 2); cx.drawImage(im, -im.width / 2, -im.height / 2); blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.85)); }
    const res = await G._grade(pg, new File([blob], 'p.png', { type: blob.type }));
    if(res.error) return { error: res.error };
    return { quality: res.quality, ms: res.ms, items: res.items.map((it, i) => ({ state: it.state, read: it.read || null, a: pg.geom.items[i].a })) };
  }, { pageIdx, b64: png.toString('base64'), turn: turn || 0 });
}
const gradable = r => r.items.filter(i => i.a && i.state !== 'self');

(async () => {
  const report = {};
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/number_magic/ws.html';
  const browser = await chromium.launch();
  try{
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 1500 }, deviceScaleFactor: 2 });
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const p = await ctx.newPage(), errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const open = async (page, q) => { await page.goto(base + '?' + q); await page.waitForFunction(() => window.NM_WS_READY, null, { timeout: 60000 }); };

    // 1 시험판 스위치
    await open(p, 'w=2026-W39&c=C16&n=check&k=1&cad=w2');
    assert.equal(await p.locator('.nm-ph-mark').count(), 0, 'no marks without marks=1');
    assert.equal(await p.locator('#wsPhoto').count(), 0, 'no button without marks=1');
    assert.equal(await p.evaluate(() => !!window.NM_PHOTO_GRADE), false, 'script not loaded without marks=1');
    await open(p, 'w=2026-W39&c=C16&n=check&k=1&cad=w2&marks=1');
    assert.equal(await p.locator('#wsPhoto').count(), 1, 'photo button');
    // 위 막대: 과정 이름만. 이모지·주차 열쇠·과정 번호·영문 상표가 보이지 않는다
    const barText = await p.locator('#wsBar').innerText();
    assert.ok(/소수의 덧셈과 뺄셈/.test(barText) && !/2026-W|C16\.|Numbers of Magic/.test(barText) && !/\p{Extended_Pictographic}/u.test(barText), 'clean top bar: ' + barText);
    const info = await p.evaluate(() => window.NM_PHOTO_GRADE._pages().map(pg => ({ idx: pg.idx, n: pg.geom.items.filter(i => i.a).length, marks: pg.el.querySelectorAll('.nm-ph-mark').length, big: pg.el.querySelectorAll('.nm-ph-mark.big.tl').length })));
    assert.ok(info.length >= 4 && info.every(i => i.marks === 4 && i.big === 1), 'four marks per page, big one top-left');
    const pageIdx = info.find(i => i.n >= 10).idx;

    // 2 줄여 보는 휴대폰 화면에서 잰 좌표 = 넓은 화면에서 잰 좌표
    const wide = await p.evaluate(i => window.NM_PHOTO_GRADE._pages().find(x => x.idx === i).geom, pageIdx);
    const phone = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await phone.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const pp = await phone.newPage(); await open(pp, 'w=2026-W39&c=C16&n=check&k=1&cad=w2&marks=1');
    const small = await pp.evaluate(i => window.NM_PHOTO_GRADE._pages().find(x => x.idx === i).geom, pageIdx);
    let worst = Math.abs(wide.aspect - small.aspect);
    wide.items.forEach((it, i) => it.zones.forEach((z, j) => ['x', 'y', 'w', 'h'].forEach(k => { worst = Math.max(worst, Math.abs(z[k] - small.items[i].zones[j][k])); })));
    assert.ok(worst < 0.0015, 'phone geometry equals wide geometry: ' + worst);
    report.geometry = worst.toFixed(5);
    await phone.close();

    // 3 정답을 써서 기울여 찍기 → 모두 ○
    let png = await shoot(p, pageIdx, {}); if(out) fs.writeFileSync(path.join(out, 'photo-c16.png'), png);
    let r = await grade(p, pageIdx, png);
    assert.ok(!r.error, 'graded: ' + r.error);
    assert.ok(gradable(r).length >= 10 && gradable(r).every(i => i.state === 'ok'), 'all correct → ○: ' + JSON.stringify(gradable(r).filter(i => i.state !== 'ok')));
    assert.equal(r.quality.low, false, 'sharp photo is not flagged');
    report.c16 = { items: gradable(r).length, ms: r.ms, quality: r.quality };
    assert.equal(await p.locator('.nm-ph-ring').count(), gradable(r).length, 'a ring per correct answer');
    assert.equal(await p.locator('.nm-ph-score').innerText(), gradable(r).length + '/' + gradable(r).length, 'score written on the page');
    if(out) await p.screenshot({ path: path.join(out, 'marks-c16.png') });

    // 4 틀린 답·빈칸
    const first = r.items.findIndex(i => i.a && i.a.length === 1 && i.a[0] >= 0 && i.a[0] <= 8), second = r.items.findIndex((i, k) => k > first && i.a && i.a.length === 1);
    const wrong = String(r.items[first].a[0] + 1);
    png = await shoot(p, pageIdx, { write: { [first]: wrong, [second]: null } });
    r = await grade(p, pageIdx, png);
    assert.equal(r.items[first].state, 'check'); assert.deepEqual(r.items[first].read, [wrong], 'wrong answer is read as written');
    assert.equal(r.items[second].state, 'blank', 'unanswered item');
    assert.equal(gradable(r).filter(i => i.state === 'ok').length, gradable(r).length - 2, 'the rest stay ○');
    assert.equal(await p.locator('.nm-ph-chip').count(), 1, 'one check chip'); assert.equal(await p.locator('.nm-ph-note').count(), 1, 'one no-answer note');
    await p.locator('.nm-ph-chip button.x').click();
    assert.equal(await p.locator('.nm-ph-chip[data-set=x]').count(), 1, 'marked wrong');
    assert.equal(await p.locator('.nm-ph-slash').count(), 1, 'a slash on the wrong answer');
    await p.click('#wsPhoto'); const txt = await p.locator('.nm-ph-sheet').innerText();
    assert.ok(/틀림 1/.test(txt) && /답 없음 1/.test(txt) && !/확인할 것/.test(txt), 'summary: ' + txt.slice(0, 200));
    assert.ok(!/\p{Extended_Pictographic}/u.test(txt), 'no emoji in the panel');
    if(out) await p.screenshot({ path: path.join(out, 'panel.png') });
    await p.locator('[data-close]').click(); assert.equal(await p.locator('.nm-ph-panel').isVisible(), false, 'panel closes');
    await p.reload(); await p.waitForFunction(() => window.NM_WS_READY && window.NM_PHOTO_GRADE, null, { timeout: 60000 });
    assert.equal(await p.locator('.nm-ph-chip[data-set=x]').count(), 1, 'the choice survives a reload');

    // 5 옆으로 누운 사진 · 가려진 귀퉁이
    png = await shoot(p, pageIdx, {});
    r = await grade(p, pageIdx, png, 90);
    assert.ok(!r.error && gradable(r).every(i => i.state === 'ok'), 'sideways photo: ' + JSON.stringify(r.error || gradable(r).filter(i => i.state !== 'ok')));
    png = await shoot(p, pageIdx, { hide: 'br' });
    r = await grade(p, pageIdx, png);
    assert.ok(r.error === 'marks' || r.error === 'turn', 'hidden corner → retake: ' + JSON.stringify(r.error || 'graded'));

    // 3' 세로셈(C4)
    await open(p, 'w=2026-W39&c=C4&n=check&k=1&cad=w2&marks=1');
    const c4 = await p.evaluate(() => { const pg = window.NM_PHOTO_GRADE._pages().find(pg => pg.geom.items.filter(i => i.a && i.type === 'bottom').length >= 6); return pg ? pg.idx : -1; });
    assert.ok(c4 >= 0, 'C4 has a vertical-sum page');
    png = await shoot(p, c4, {}); if(out) fs.writeFileSync(path.join(out, 'photo-c4.png'), png);
    r = await grade(p, c4, png);
    assert.ok(!r.error && gradable(r).every(i => i.state === 'ok'), 'C4 vertical sums → ○: ' + JSON.stringify(r.error || gradable(r).filter(i => i.state !== 'ok')));
    report.c4 = { items: gradable(r).length, ms: r.ms };

    // 6 인쇄 · PDF 생성용
    await p.emulateMedia({ media: 'print' });
    assert.ok(await p.locator('.nm-ph-mark').first().isVisible(), 'marks print');
    assert.equal(await p.locator('.nm-ph-ring').first().isVisible(), false, 'grading marks do not print');
    assert.equal(await p.locator('#wsPhoto').isVisible(), false, 'button does not print');
    await p.emulateMedia({ media: 'screen' });
    await open(p, 'w=2026-W39&c=C16&n=check&k=1&cad=w2&marks=1&auto=0');
    assert.ok(await p.locator('.nm-ph-mark').count() >= 16, 'marks in the PDF build'); assert.equal(await p.locator('#wsPhoto').count(), 0, 'no button in the PDF build');
    assert.deepEqual(errors, [], 'no page errors');
    console.log('check-photo-grade-browser OK', JSON.stringify(report));
  } finally { await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exit(1); });
