'use strict';
// 주간 학습지 펜으로 풀기·바로 채점 검사(2026-11-16, app/pen-sheet.js · app/pen-digits.js).
// 로컬 서버만 쓴다(외부 요청 없음). 화면 사진: NM_PEN_ARTIFACTS=<절대 경로>
//  1 숫자 읽기: 획으로 그린 0~9 400개 + 여러 자리·빼기 부호
//  2 학습지(C16 네모 칸·C1 세로셈·C60 음수 과정): 정답을 써 넣으면 ○
//  3 틀린 답 → ✕ 「○○로 읽었어요 · 고치기」 → 눌러 고치면 ○(고침) · 안 쓴 문항은 「답 없음」 · 스스로 ○✕ 칩
//  4 채점 뒤 그 문항에 더 쓰면 표시가 걷힘 · 지우개 · 되돌리기
//  5 새로고침 → 펜 글씨·고친 답이 남아 있음 · 6 펜을 쓴 뒤 손가락(손바닥) 획은 글씨로 안 침
//  7 인쇄 화면에는 펜 글씨·표시가 안 나옴 · 8 PDF 생성용 주소(auto=0)에는 펜 단추가 없음 · 9 영어 화면
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('node:assert/strict');
const { chromium } = require('./lib/playwright');
const root = path.resolve(__dirname, '../..'), out = process.env.NM_PEN_ARTIFACTS;
if(out) fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { const f = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0])); if(!f.startsWith(root + '/') || !fs.existsSync(f) || !fs.statSync(f).isFile()){ res.writeHead(404); return res.end(); } const ext = path.extname(f); res.setHeader('Content-Type', ({ '.js': 'application/javascript', '.css': 'text/css', '.html': 'text/html' })[ext] || 'application/octet-stream'); res.end(fs.readFileSync(f)); });
// 아이 글씨를 흉내 낸 숫자 획(100×140 칸)
const P = { 0: [[[50,5],[20,25],[12,70],[22,120],[50,135],[78,118],[88,70],[78,22],[50,5]]], 1: [[[40,25],[55,5],[55,135]]], 2: [[[15,35],[30,10],[60,5],[82,25],[78,55],[15,130],[88,130]]], 3: [[[15,20],[45,5],[78,20],[75,55],[45,68],[80,85],[82,118],[50,135],[15,120]]], 4: [[[60,5],[12,95],[88,95]],[[65,40],[65,135]]], 5: [[[80,8],[25,8],[20,62],[55,55],[82,80],[78,118],[48,135],[15,122]]], 6: [[[75,10],[40,30],[18,80],[25,122],[52,135],[78,115],[75,82],[48,72],[22,90]]], 7: [[[12,8],[88,8],[45,135]]], 8: [[[50,68],[22,45],[30,12],[55,5],[78,25],[72,52],[50,68],[22,90],[25,125],[52,135],[80,120],[78,88],[50,68]]], 9: [[[78,40],[60,10],[30,8],[18,35],[35,62],[65,55],[78,40],[75,135]]], '-': [[[10,70],[90,70]]] };

function digitsCheck(){
  globalThis.window = globalThis;
  require('../app/pen-digits-model.js'); const D = require('../app/pen-digits.js');
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const shape = (strokes, sc, dx, dy, rot, sh) => strokes.map(st => { const pts = []; for(let i = 1; i < st.length; i++){ const [a, b] = [st[i - 1], st[i]]; for(let t = 0; t < 1; t += 0.2) pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } pts.push(st[st.length - 1]); return pts.map(([x, y]) => { x += (rnd() - .5) * 4 - 50; y += (rnd() - .5) * 4 - 70; return [(x * Math.cos(rot) - y * Math.sin(rot) + sh * y) * sc + dx, (x * Math.sin(rot) + y * Math.cos(rot)) * sc + dy]; }); });
  let ok = 0, n = 0;
  for(let d = 0; d < 10; d++) for(let k = 0; k < 40; k++){ const r = D.readNumber(shape(P[d], 0.15 + rnd() * 0.5, 220, 300, (rnd() - .5) * 0.4, (rnd() - .5) * 0.3)); n++; if(r && r.text === String(d)) ok++; }
  assert.ok(ok / n >= 0.97, `single digits ${ok}/${n}`);
  const place = (txt, sc) => { let x = 0; const o = []; txt.split('').forEach(ch => { o.push(...shape(P[ch], sc, x + 50 * sc, 300, (rnd() - .5) * 0.2, 0)); x += 110 * sc; }); return o; };
  ['125', '-7', '40', '308', '2048', '999'].forEach(t => assert.equal(D.readNumber(place(t, 0.3)).text, t, 'multi ' + t));
  assert.equal(D.readNumber([]), null);
  return { single: `${ok}/${n}` };
}

(async () => {
  const report = { digits: digitsCheck() };
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/number_magic/ws.html';
  const browser = await chromium.launch();
  try{
    const ctx = await browser.newContext({ viewport: { width: 820, height: 1180 } });
    const p = await ctx.newPage(), errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await ctx.route('**/*', r => r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort());
    const external = []; p.on('request', r => { const u = r.url(); if(!u.startsWith('http://127.0.0.1') && !/^https:\/\/(fonts\.googleapis\.com\/|cdn\.jsdelivr\.net\/gh\/orioncactus\/pretendard@)/.test(u)) external.push(r.method() + ' ' + u); });  // 학습지 글꼴 말고는 밖으로 나가는 요청이 없어야 한다(펜 글씨는 기기 안에서만)
    async function write(text, x, y, h){
      const w = h * 0.62; let cx = x;
      for(const ch of String(text)){ for(const s of P[ch]){ await p.mouse.move(cx + s[0][0] / 100 * w, y + s[0][1] / 140 * h); await p.mouse.down(); for(let i = 1; i < s.length; i++) await p.mouse.move(cx + s[i][0] / 100 * w, y + s[i][1] / 140 * h, { steps: 4 }); await p.mouse.up(); } cx += w * 1.25; }
    }
    const geo = i => p.evaluate(i => { const el = document.querySelectorAll('.nm-w2-page .nm-w2-item[data-pen-ans]')[i]; el.scrollIntoView({ block: 'center' }); const R = x => { const r = x.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }; const ln = el.querySelector('.nm-print-word-blank,.nm-print-solve-ans'); return { spec: JSON.parse(el.dataset.penAns), item: R(el), boxes: [...el.querySelectorAll('.fbox')].map(R), line: ln && R(ln) }; }, i);
    async function answer(i, value){
      const g = await geo(i), a = value != null ? [value] : g.spec.a;
      if(g.boxes.length && g.boxes.length === a.length && a.length > 1){ for(let k = 0; k < a.length; k++){ const b = g.boxes[k]; await write(a[k], b.x + 2, b.y + b.h * 0.12, b.h * 0.75); } }
      else if(g.boxes.length){ const b = g.boxes[0]; await write(a[0], b.x + 2, b.y + b.h * 0.12, Math.min(b.h * 0.75, 28)); }
      else if(g.line) await write(a[0], g.line.x + g.line.w * 0.35, g.line.y - 14, 22);
      else await write(a[0], g.item.x + g.item.w * 0.3, g.item.y + g.item.h - 30, 22);
      return g.spec;
    }
    const autoIdx = () => p.evaluate(() => [...document.querySelectorAll('.nm-w2-page .nm-w2-item[data-pen-ans]')].map((el, i) => ({ i, s: JSON.parse(el.dataset.penAns) })).filter(x => !x.s.self).map(x => x.i));
    const results = () => p.evaluate(() => { const R = NM_PEN_SHEET._state().results, o = {}; Object.entries(R).forEach(([k, r]) => { o[k] = r.self ? 'self:' + (r.mark || '') : r.blank ? 'blank' : r.ask ? 'ask' : r.ok ? (r.fixed ? 'fixed-o' : 'o') : 'x:' + r.text; }); return o; });
    const keyOf = i => p.evaluate(i => { const all = [...document.querySelectorAll('.nm-w2-page')]; const el = document.querySelectorAll('.nm-w2-page .nm-w2-item[data-pen-ans]')[i], pg = el.closest('.nm-w2-page'); return all.indexOf(pg) + ':' + [...pg.querySelectorAll('.nm-w2-item[data-pen-ans]')].indexOf(el); }, i);
    const grade = async () => { await p.click('[data-pen=grade]'); await p.waitForFunction(() => Object.keys(NM_PEN_SHEET._state().results).length > 0); };

    // 2 정답을 써 넣으면 ○ (세 과정)
    report.courses = {};
    for(const [c, r, lim] of [['C16', 1, 10], ['C1', 3, 8], ['C60', 1, 8]]){
      await p.goto(`${base}?w=2026-W47&c=${c}&n=t&r=${r}`); await p.waitForFunction(() => window.NM_WS_READY && document.getElementById('wsPen'), null, { timeout: 60000 });
      await p.evaluate(() => localStorage.clear()); await p.click('#wsPen'); await p.waitForSelector('.nm-pen-layer');
      const idx = (await autoIdx()).slice(0, lim); assert.ok(idx.length >= lim, c + ' readable items');
      for(const i of idx) await answer(i);
      await grade(); const R = await results();
      const keys = await Promise.all(idx.map(keyOf)), got = keys.map(k => R[k]);
      assert.deepEqual(got, keys.map(() => 'o'), c + ' written answers graded right ' + JSON.stringify(got));
      report.courses[c] = `${got.length}/${got.length} ○`;
      if(out) await p.screenshot({ path: path.join(out, `pen-${c}.png`) });
    }

    // 3 틀린 답·고치기·답 없음·스스로
    await p.goto(`${base}?w=2026-W47&c=C16&n=t&r=1`); await p.waitForFunction(() => window.NM_WS_READY && document.getElementById('wsPen'));
    await p.evaluate(() => localStorage.clear()); await p.click('#wsPen'); await p.waitForSelector('.nm-pen-layer');
    const idx = await autoIdx(), right = idx[0], wrong = idx[1], blank = idx[2];
    await answer(right); const wspec = await geo(wrong); const bad = (wspec.spec.a[0] + 3) % 10; await answer(wrong, bad);
    // 스스로 ○✕ 문항(분수·식 답 등)에도 무언가 쓴다 — 쓴 쪽만 채점하므로
    const selfIdx = await p.evaluate(() => [...document.querySelectorAll('.nm-w2-page .nm-w2-item[data-pen-ans]')].findIndex(el => JSON.parse(el.dataset.penAns).self));
    if(selfIdx >= 0){ const gs = await geo(selfIdx); await write(7, gs.item.x + gs.item.w * 0.5, gs.item.y + gs.item.h * 0.5, 20); }
    await grade(); let R = await results();
    const kr = await keyOf(right), kw = await keyOf(wrong), kb = await keyOf(blank);
    assert.equal(R[kr], 'o'); assert.equal(R[kw], 'x:' + bad); assert.equal(R[kb], 'blank');
    const chip = p.locator(`.nm-pen-chip[data-key="${kw}"]`); assert.match(await chip.textContent(), new RegExp(bad + '로 읽었어요'));
    if(out){ await chip.scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(out, 'pen-wrong.png') }); }
    await chip.click(); await p.waitForSelector('.nm-pen-pad input');
    if(out) await p.screenshot({ path: path.join(out, 'pen-fix-pad.png') });
    await p.fill('.nm-pen-pad input', String(wspec.spec.a[0])); await p.click('.nm-pen-pad button[type=submit]');
    R = await results(); assert.equal(R[kw], 'fixed-o', 'fixed answer graded right');
    const selfKey = Object.keys(R).find(k => R[k].startsWith('self'));
    if(selfKey){ const sc = p.locator(`.nm-pen-chip[data-key="${selfKey}"]`); await sc.click(); assert.equal((await results())[selfKey], 'self:o'); await sc.click(); assert.equal((await results())[selfKey], 'self:x'); }
    assert.ok(selfIdx < 0 || selfKey, 'self-mark chip shown');
    report.marks = { wrongRead: true, fix: true, blank: true, self: !!selfKey };

    // 4 채점 뒤 더 쓰면 그 문항 표시가 걷힘 · 지우개 · 되돌리기
    const before = await p.evaluate(() => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0));
    const g = await geo(right); await write(1, g.item.x + g.item.w * 0.6, g.item.y + g.item.h * 0.5, 18);
    assert.equal((await results())[kr], undefined, 'mark removed after writing more');
    await p.click('[data-pen=undo]');
    assert.equal(await p.evaluate(() => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0)), before, 'undo');
    await p.click('[data-pen=erase]'); const g2 = await geo(right);
    await p.mouse.move(g2.boxes[0].x - 4, g2.boxes[0].y + g2.boxes[0].h / 2); await p.mouse.down(); await p.mouse.move(g2.boxes[0].x + g2.boxes[0].w + 4, g2.boxes[0].y + g2.boxes[0].h / 2, { steps: 12 }); await p.mouse.up();
    const afterErase = await p.evaluate(() => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0));
    assert.ok(afterErase < before, 'eraser removed strokes');
    await p.click('[data-pen=undo]'); await p.click('[data-pen=pen]');
    assert.equal(await p.evaluate(() => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0)), before, 'undo erase');

    // 5 새로고침 → 그대로
    await p.waitForTimeout(400); await p.reload(); await p.waitForFunction(() => window.NM_WS_READY && document.body.classList.contains('nm-pen-on'));
    assert.equal(await p.evaluate(() => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0)), before, 'strokes kept after reload');
    await grade(); R = await results(); assert.equal(R[kr], 'o'); assert.equal(R[kw], 'fixed-o', 'fix kept after reload');

    // 6 펜을 쓴 뒤 손가락·손바닥은 글씨가 아님
    const palm = await p.evaluate(() => {
      const L = document.querySelector('.nm-pen-layer'), r = L.getBoundingClientRect(), count = () => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0);
      const fire = (type, pointerType, id, x, y) => L.dispatchEvent(new PointerEvent(type, { pointerType, pointerId: id, clientX: r.left + x, clientY: r.top + y, bubbles: true, cancelable: true, isPrimary: true, button: 0 }));
      const a = count();
      fire('pointerdown', 'pen', 11, 300, 300); fire('pointermove', 'pen', 11, 320, 320); fire('pointermove', 'pen', 11, 340, 330); fire('pointerup', 'pen', 11, 340, 330);
      const b = count();
      setTimeout(() => {}, 0);
      return { a, b };
    });
    assert.equal(palm.b, palm.a + 1, 'pen stroke added');
    await p.waitForTimeout(700);
    const palm2 = await p.evaluate(() => {
      const L = document.querySelector('.nm-pen-layer'), r = L.getBoundingClientRect(), count = () => Object.values(NM_PEN_SHEET._state().data.pages).reduce((a, l) => a + l.length, 0);
      const fire = (type, id, x, y) => L.dispatchEvent(new PointerEvent(type, { pointerType: 'touch', pointerId: id, clientX: r.left + x, clientY: r.top + y, bubbles: true, cancelable: true, isPrimary: true, button: 0 }));
      const a = count(); fire('pointerdown', 21, 200, 500); fire('pointermove', 21, 260, 540); fire('pointerup', 21, 260, 540); return { a, b: count(), seen: NM_PEN_SHEET._state().penSeen };
    });
    assert.ok(palm2.seen && palm2.b === palm2.a, 'finger/palm ignored after pen');
    await p.click('[data-pen=undo]');

    // 7 인쇄에는 안 나옴
    await p.emulateMedia({ media: 'print' });
    assert.equal(await p.evaluate(() => [...document.querySelectorAll('.nm-pen-layer,.nm-pen-marks,.nm-pen-bar')].every(e => getComputedStyle(e).display === 'none')), true, 'hidden in print');
    await p.emulateMedia({ media: 'screen' });

    // 8 PDF 생성용 주소 · 9 영어
    await p.goto(`${base}?w=2026-W47&c=C16&n=t&r=1&auto=0`); await p.waitForFunction(() => window.NM_WS_READY);
    assert.equal(await p.locator('#wsPen').count(), 0, 'no pen button for PDF generator');
    await p.goto(`${base}?w=2026-W47&c=C16&n=t&r=1&l=en`); await p.waitForFunction(() => window.NM_WS_READY && document.getElementById('wsPen'));
    assert.match(await p.textContent('#wsPen'), /Solve with pen|Pen off/);
    assert.deepEqual(errors, [], 'page errors'); assert.deepEqual(external, [], 'no external requests');
    await ctx.close();
    console.log('PEN_SHEET_BROWSER_OK', JSON.stringify(report));
  }finally{ await browser.close(); server.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
