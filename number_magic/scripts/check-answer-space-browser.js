'use strict';
// 답 쓰는 칸·나눗셈 꼴·초등 말 검사(2026-11-21~22, 원장 「곱셈구구에 80/2가 있어」「한 줄로 놓고 네모칸을 더 키워야 …
// 답 쓰는란이 너무 작은 것 같아」「교환보다는 위치를 바꿔도 똑같아요」). 로컬 서버만 쓴다.
//  1 반으로 나누기(ML1·DV1) 식에 분수 모양(\dfrac)이 없다 — 분수를 배우기 전이다
//  2 초등 단원 글(M- 이 아닌 단원)의 한국어에 「교환」이 없다
//  3 학습지: 나눗셈을 덧셈처럼 세로로 쌓은 칸이 없다(과정 4·7·10) · 분수 모양 수식이 없다(과정 4)
//  4 따라 풀기 한 줄(과정 4 3회차 「짝수÷2」): (가)(나)(다) 모두 한 줄 · 칸 높이 15mm 이상 · 줄 밖으로 안 넘침
//  5 저학년 큰 글씨 칸의 답 상자: 폭 20mm 이상 · 높이 10mm 이상 · 문항 칸 안
//  6 세로셈 답 줄: 높이 9mm 이상 · 폭 20mm 이상 · 문항 칸 안
//  7 소수점 아래 몇째 자리 숫자 물음(과정 27): 칸 밖으로 안 잘림 · 영어판은 영어 물음
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('node:assert/strict');
const { chromium } = require('./lib/playwright');
const NM = path.resolve(__dirname, '..'), root = path.resolve(NM, '..');

function generators(){
  globalThis.window = globalThis;
  require(path.join(NM, 'engine/rng.js'));
  for(const f of ['ml.js', 'dv.js']){ try{ require(path.join(NM, 'engine/threads', f)); }catch(e){ if(!/is not defined/.test(e.message)) throw e; } }
  const R = globalThis.NM_RNG, G = globalThis.NM_TGEN; let n = 0;
  for(let seed = 1; seed <= 300; seed++){
    for(const [name, params] of [['ml1_double', { op: 'd2', max: 99 }], ['ml1_double', { op: 'mix', max: 99 }], ['dv1_half', {}]]){
      const p = G[name](params, R.mulberry32(seed)); n++;
      assert.ok(!/frac/.test(p.tex), `${name} 분수 모양: ${p.tex}`);
    }
  }
  return n;
}

function wording(){
  const dir = path.join(NM, 'data/units'); let n = 0;
  for(const f of fs.readdirSync(dir)){
    if(!/\.js$/.test(f) || /^M-/.test(f)) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(!/교환/.test(src), `${f}: 초등 단원 글에 「교환」`); n++;
  }
  return n;
}

const server = http.createServer((req, res) => {
  const f = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if(!f.startsWith(root + '/') || !fs.existsSync(f) || !fs.statSync(f).isFile()){ res.writeHead(404); return res.end(); }
  const type = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' }[path.extname(f)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': type }); fs.createReadStream(f).pipe(res);
});

(async () => {
  const report = { generators: generators(), units: wording() };
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port + '/number_magic/ws.html';
  const browser = await chromium.launch();
  try{
    const p = await browser.newPage({ viewport: { width: 1100, height: 1400 } }), errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const open = async q => { await p.goto(base + '?w=2026-W47&' + q + '&auto=0'); await p.waitForFunction(() => window.NM_WS_READY === true, null, { timeout: 120000 }); };
    const measure = () => p.evaluate(() => {
      const d = document.createElement('div'); d.style.cssText = 'width:100mm;position:absolute'; document.body.appendChild(d);
      const mm = d.getBoundingClientRect().width / 100; d.remove();
      const R = e => e.getBoundingClientRect(), inside = (a, b) => a.top >= b.top - 2 && a.bottom <= b.bottom + 2 && a.left >= b.left - 2 && a.right <= b.right + 2;
      const stackedDiv = [...document.querySelectorAll('.nm-print-vp,.nm-w2-ex-vp')].filter(v => /÷/.test(v.textContent)).length;
      const frac = [...document.querySelectorAll('.nm-w2-page annotation')].filter(a => /frac/.test(a.textContent)).length;
      const lines = [...document.querySelectorAll('.nm-w2-guide')].map(g => {
        const items = [...g.querySelectorAll('.nm-w2-guide-item')], on = items.filter(i => i.classList.contains('is-line'));
        return { items: items.length, line: on.length,
          boxH: Math.min(...on.flatMap(i => [...i.querySelectorAll('.fbox')].map(b => R(b).height / mm)), 99),
          fits: on.every(i => [...i.querySelectorAll('.nm-w2-tex')].every(t => inside(R(t), R(g)))) };
      });
      const big = [...document.querySelectorAll('.nm-w2-abox-big')].map(b => ({ w: R(b).width / mm, h: R(b).height / mm, in: inside(R(b), R(b.closest('.nm-w2-item'))) }));
      const vp = [...document.querySelectorAll('.nm-w2-grid-vertical .nm-print-vp:not(.nm-print-vp-2row) .nm-print-vp-bot')].map(b => ({ w: R(b).width / mm, h: R(b).height / mm, in: inside(R(b), R(b.closest('.nm-w2-item'))) }));
      return { stackedDiv, frac, lines, big, vp };
    });

    await open('c=C4&r=3');
    const c4 = await measure();
    assert.equal(c4.stackedDiv, 0, '과정 4: 세로로 쌓인 나눗셈'); assert.equal(c4.frac, 0, '과정 4: 분수 모양 수식');
    const half = c4.lines.find(l => l.line);
    assert.ok(half && half.items === 3 && half.line === 3, '짝수÷2 따라 풀기 세 문제가 모두 한 줄: ' + JSON.stringify(c4.lines));
    assert.ok(half.boxH >= 15 && half.fits, '한 줄 따라 풀기 칸 높이·넘침: ' + JSON.stringify(half));
    assert.ok(c4.lines.every(l => l.line === 0 || l.line === l.items), '한 줄과 두 줄이 섞인 따라 풀기');
    assert.ok(c4.big.length >= 10 && c4.big.every(b => b.w >= 20 && b.h >= 10 && b.in), '큰 글씨 칸 답 상자: ' + JSON.stringify(c4.big.slice(0, 3)));
    assert.ok(c4.vp.length >= 6 && c4.vp.every(b => b.w >= 20 && b.h >= 9 && b.in), '세로셈 답 줄: ' + JSON.stringify(c4.vp.slice(0, 3)));
    report.c4 = { line: half, big: c4.big.length, vp: c4.vp.length };

    for(const q of ['c=C4&r=6', 'c=C7&r=1', 'c=C10&r=1', 'c=C1&r=5']){
      await open(q); const m = await measure();
      assert.equal(m.stackedDiv, 0, q + ': 세로로 쌓인 나눗셈');
      assert.ok(m.lines.every(l => l.line === 0 || (l.line === l.items && l.fits)), q + ': 따라 풀기 한 줄 ' + JSON.stringify(m.lines));
      assert.ok(m.big.every(b => b.in && b.h >= 10) && m.vp.every(b => b.in), q + ': 답 칸이 문항 칸 밖');
      report[q] = { line: m.lines.filter(l => l.line).length, big: m.big.length, vp: m.vp.length };
    }
    // 7 소수점 아래 몇째 자리 숫자(CH5, 과정 27 8회차): 물음이 칸 밖으로 잘리지 않는다 · 영어판에 한국어 물음이 없다
    for(const q of ['c=C27&r=8', 'c=C27&r=8&l=en']){
      await open(q);
      const cut = await p.evaluate(() => [...document.querySelectorAll('.nm-w2-item')].filter(e => e.scrollWidth > e.clientWidth + 3 || e.scrollHeight > e.clientHeight + 3).length);
      assert.equal(cut, 0, q + ': 칸 밖으로 넘친 문항');
      const txt = await p.evaluate(() => [...document.querySelectorAll('.nm-w2-item .nm-print-word')].map(e => e.textContent).join(' | '));
      assert.ok(/l=en/.test(q) ? /digit after the decimal point/.test(txt) && !/소수점/.test(txt) : /소수점 아래 \d+번째 자리 숫자/.test(txt), q + ': 물음 글 ' + txt.slice(0, 80));
    }
    report.digitAsk = 'ok';
    assert.deepEqual(errors, []);
  } finally { await browser.close(); server.close(); }
  console.log('check-answer-space-browser OK ' + JSON.stringify(report));
})().catch(e => { console.error(e); process.exit(1); });
