#!/usr/bin/env node
/* G1-13~15호 화면 위젯 검사 — NL57~NL66 의 모든 레벨을 index.html 에서 NM_WIDGETS.render 로 실제로 그려
   ① 정답 시나리오(위젯을 규칙대로 눌러 풀면 onAnswer(problem.answer)) ② 오답 시나리오(틀리면 answer 가 아닌 값)
   ③ 콘솔·페이지 에러 0 을 본다. 모바일 폭 430px. 스크린샷은 NM_SHOTS=<폴더> 를 주면 레벨마다 저장.
   쓰는 법: node scripts/check-g1315-screen.js [NL57 NL60 …]   (실패가 있으면 exit 1) */
'use strict';
const { spawn } = require('child_process');
const path = require('path'), http = require('http'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.NM_CHECK_PORT || 8795;
const ONLY = process.argv.slice(2).map(s => s.toUpperCase());
const SHOTS = process.env.NM_SHOTS || '';
const { chromium } = require('./lib/playwright');

function serve() {
  return new Promise((resolve, reject) => {
    const py = spawn(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
    py.on('error', reject);
    const t0 = Date.now();
    (function ping() {
      http.get(`http://localhost:${PORT}/index.html`, res => { res.resume(); resolve(py); })
        .on('error', () => { if (Date.now() - t0 > 8000) return reject(new Error('서버 기동 실패')); setTimeout(ping, 150); });
    })();
  });
}

/* 페이지 안에서 도는 풀이기 — 위젯 DOM 을 사람처럼 누른다 */
const PAGE_FN = `
window.__g1315 = async function (p, c, mode) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const tap = el => { if (!el) throw new Error('누를 대상 없음'); el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true })); };
  const $ = s => c.querySelector(s), $$ = s => [...c.querySelectorAll(s)];
  const choice = v => $$('.nm-g1315-choices button').find(b => b.dataset.v === String(v));
  const first = W0 => (p.widget === 'shapeEq' ? p.vals[p.ask[0]] : p.widget === 'arrowChain' ? (p.askRule ? p.legend.a : p.vals[p.asks[0]]) : p.widget === 'seqGap' ? p.seq[p.blanks[0]] : (p.widget === 'mysteryBox' && p.op === 'wrong') ? p.x : p.answer);
  const wrongChoice = () => $$('.nm-g1315-choices button').find(b => +b.dataset.v !== first());
  const W = p.widget;
  if (mode === 'wrong') {
    /* 틀린 보기를 하나 눌러 본다 — 보기 없는 위젯은 건너뜀(null) */
    if (p.widget === 'pyramid') { tap($$('.nm-py-choices button').find(b => b.textContent !== String(p.answer))); return 'tapped'; }
    const b = wrongChoice();
    if (b) { tap(b); return 'tapped'; }
    return null;
  }
  switch (W) {
    case 'pyramid': { tap($$('.nm-py-choices button').find(b => b.textContent === String(p.answer))); return; }
    case 'overlapSum': case 'balanceEq': case 'g15RuleTable': case 'numberTrain': case 'promiseBox': case 'rodNumeral':
      tap(choice(p.answer)); return;
    case 'weightPick': {
      const sol = p.solutions[0], used = {};
      sol.forEach(w => { const i = p.weights.findIndex((x, k) => x === w && !used[k]); used[i] = 1; tap($$('.nm-g1315-wshelf .nm-g1315-wt')[i]); });
      await sleep(500); return;
    }
    case 'pathSum': {
      for (const [r, cc] of p.minPath) { tap($('.nm-g1315-pc[data-r="' + r + '"][data-c="' + cc + '"]')); await sleep(30); }
      await sleep(500); return;
    }
    case 'gridSum': {
      for (const [r, cc] of p.blanks) { const v = p.sol[r][cc]; tap($$('.nm-g1315-gschips button').find(b => b.textContent === String(v))); await sleep(30); }
      await sleep(500); return;
    }
    case 'crossPlace': {
      for (const k of ['u', 'd', 'l', 'r', 'c']) if (p.cells[k] == null) { tap($$('.nm-g1315-cards .nm-g1315-card').find(b => b.textContent.trim() === String(p.sol[k]))); await sleep(30); }
      await sleep(500); return;
    }
    case 'pairUp': {
      for (const pr of p.pairs) for (const v of pr) { tap($$('.nm-g1315-purow .nm-g1315-card')[p.cards.indexOf(v)]); await sleep(30); }
      await sleep(500); return;
    }
    case 'ringSum': {
      if (p.choices) { tap(choice(p.answer)); return; }
      for (const i of p.blanks) { tap($$('.nm-g1315-cards .nm-g1315-card').find(b => b.textContent.trim() === String(p.sol[i]))); await sleep(30); }
      await sleep(500); return;
    }
    case 'shapeEq': { for (const k of p.ask) { tap(choice(p.vals[k])); await sleep(350); } return; }
    case 'arrowChain': {
      if (p.askRule) { tap(choice(p.legend.a)); await sleep(350); tap(choice(p.legend.b)); return; }
      for (const i of p.asks) { tap(choice(p.vals[i])); await sleep(350); } return;
    }
    case 'seqGap': { for (const i of p.blanks) { tap(choice(p.seq[i])); await sleep(350); } return; }
    case 'splitList': {
      for (const pr of p.pairs) { if (pr[0] === p.example[0] && pr[1] === p.example[1]) continue; tap($$('.nm-g1315-slchips button').find(b => b.textContent === String(pr[0]))); await sleep(20); }
      tap($('.nm-g1315-slok')); return;
    }
    case 'storyFill': {
      for (let i = 0; i < p.slots; i++) { tap($$('.nm-g1315-sfchips button').find(b => !b.classList.contains('dim') && b.textContent === String(p.sol[i]))); await sleep(20); }
      tap($('.nm-g1315-slok')); return;
    }
    case 'mysteryBox': {
      if (p.op === 'wrong') { tap(choice(p.x)); await sleep(400); tap(choice(p.final)); return; }
      tap(choice(p.answer)); return;
    }
    case 'eqChoice': tap($$('.nm-g1315-eccard')[p.answer]); return;
    case 'tapWrong': {
      const tk = p.tokens[(window.S && window.S.lang) || 'ko'] || p.tokens.ko;
      tap($('.nm-g1315-tk[data-i="' + tk.findIndex(t => t.wrong) + '"]')); await sleep(30);
      tap(choice(p.answer)); return;
    }
    case 'digitBoard': { for (const b of $$('.nm-g1315-dbc')) tap(b); await sleep(30); tap(choice(p.answer)); return; }
    case 'dartTarget': { if (p.ask === 'sum') tap(choice(p.answer)); else tap($('.nm-g1315-ring[data-s="' + p.answer + '"]')); return; }
    case 'sortBasket3': {
      for (const b of $$('.nm-g1315-s3chip')) tap(b); await sleep(30);
      if (p.askMode === 'diff') tap(choice(p.answer)); else tap($$('.nm-g1315-s3b')[p.answer]); return;
    }
    case 'stairsGame': case 'ageStory': {
      if (p.interaction === 'tap') { tap($$('.nm-sc-char')[p.targetIndex]); return; }
      for (const ch of String(p.answer)) { const k = $$('.nm-numpad .nm-key').find(b => b.textContent === ch); k.dispatchEvent(new MouseEvent('click', { bubbles: true })); k.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); await sleep(10); }
      const ok = $$('.nm-numpad .nm-key').find(b => b.classList.contains('ok')); ok.dispatchEvent(new MouseEvent('click', { bubbles: true })); ok.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return;
    }
  }
  throw new Error('풀이기 없음: ' + W);
};
`;

(async () => {
  const server = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|favicon|supabase/i.test(m.text())) errors.push('console: ' + m.text()); });
  await page.route(/supabase|googleapis|gstatic/, r => r.abort());
  await page.goto(`http://localhost:${PORT}/index.html?enter=1`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.NM_WIDGETS && window.NM_THREADS && window.NM_THREADS.NL57 && window.NM_WIDGET_EXT && window.NM_WIDGET_EXT.overlapSum, null, { timeout: 15000 });
  await page.evaluate(PAGE_FN);
  await page.evaluate(() => {
    /* 앱 위에 흰 판을 덮고 그 안에 위젯을 그린다 — 호스트의 말풍선 자리도 흉내 낸다 */
    const ov = document.createElement('div'); ov.id = '__ov'; ov.style.cssText = 'position:fixed;inset:0;background:#FBFAF7;z-index:99999;overflow:auto;padding:10px;font-family:Pretendard,sans-serif';
    ov.innerHTML = '<div id="__bubble" style="font-weight:800;margin:6px 0 10px;font-size:16px;line-height:1.5"></div><div id="__w" class="nm-lab-widget"></div>';
    document.body.appendChild(ov);
  });
  const targets = await page.evaluate(only => {
    const out = [];
    for (const id of ['NL57', 'NL58', 'NL59', 'NL60', 'NL61', 'NL62', 'NL63', 'NL64', 'NL65', 'NL66'])
      if (!only.length || only.includes(id)) for (const lv of window.NM_THREADS[id].levels) out.push({ id, lv: lv.id, label: lv.label.ko });
    return out;
  }, ONLY);
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const fails = [];
  let n = 0;
  for (const t of targets) {
    for (const lang of ['ko', 'en', 'zh']) {
      /* 같은 문항을 정답/오답 두 번 푼다(시드 3개) */
      for (const seedN of [0, 1, 2]) {
        const r = await page.evaluate(async ({ id, lv, lang, seedN }) => {
          window.S = window.S || {}; window.S.lang = lang;
          const th = NM_THREADS[id], level = th.levels.find(l => l.id === lv);
          const out = {};
          for (const mode of ['right', 'wrong']) {
            const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('scr-' + id + '-' + lv + '-' + seedN));
            const p = NM_TGEN[th.gen](level.params, rng);
            const host = document.getElementById('__w'); host.innerHTML = '';
            document.getElementById('__bubble').textContent = (p.prompt[lang] || '');
            const calls = [];
            try { NM_WIDGETS.render(p, host, v => calls.push(v)); } catch (e) { return { err: '렌더 예외: ' + e.message }; }
            if (!host.firstChild || !host.innerHTML.trim()) return { err: '빈 화면' };
            await new Promise(r => setTimeout(r, 30));
            try { const x = await window.__g1315(p, host, mode); if (mode === 'wrong' && x === null) { out.wrong = 'skip'; continue; } } catch (e) { return { err: mode + ' 풀이 예외: ' + e.message }; }
            await new Promise(r => setTimeout(r, 700));
            out[mode] = calls.slice();
            out.answer = p.answer; out.widget = p.widget;
          }
          return out;
        }, { id: t.id, lv: t.lv, lang, seedN });
        const tag = `${t.id}L${t.lv}/${lang}/#${seedN}`;
        if (r.err) { fails.push(`${tag} — ${r.err}`); continue; }
        if (!(r.right && r.right.length === 1 && r.right[0] === r.answer)) fails.push(`${tag} — 정답 시나리오: onAnswer=${JSON.stringify(r.right)} (기대 ${r.answer}, ${r.widget})`);
        if (r.wrong !== 'skip' && !(r.wrong && r.wrong.length >= 1 && r.wrong[0] !== r.answer)) fails.push(`${tag} — 오답 시나리오: onAnswer=${JSON.stringify(r.wrong)} (정답 ${r.answer})`);
        n++;
      }
    }
    if (SHOTS) {
      /* 초기 화면과 푼 뒤 화면을 한 장씩 */
      for (const stage of ['init', 'solved']) {
        await page.evaluate(async ({ id, lv, stage }) => {
          window.S = window.S || {}; window.S.lang = 'ko';
          const th = NM_THREADS[id], level = th.levels.find(l => l.id === lv);
          const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('shot-' + id + '-' + lv));
          const p = NM_TGEN[th.gen](level.params, rng);
          const host = document.getElementById('__w'); host.innerHTML = '';
          document.getElementById('__bubble').textContent = p.prompt.ko;
          NM_WIDGETS.render(p, host, () => {});
          await new Promise(r => setTimeout(r, 50));
          if (stage === 'solved') { try { await window.__g1315(p, host, 'right'); } catch (e) {} await new Promise(r => setTimeout(r, 700)); }
        }, { id: t.id, lv: t.lv, stage });
        await page.screenshot({ path: path.join(SHOTS, `${t.id}L${t.lv}-${stage}.png`) });
      }
    }
  }
  await browser.close(); server.kill();
  const uniqErr = [...new Set(errors)];
  console.log(`검사한 (레벨×언어×시드) ${n}건`);
  if (uniqErr.length) { console.log(`[FAIL] 페이지/콘솔 에러 ${uniqErr.length}건`); uniqErr.slice(0, 10).forEach(e => console.log('   ' + e)); }
  if (fails.length) { console.log(`[FAIL] ${fails.length}건`); fails.slice(0, 40).forEach(f => console.log('   ' + f)); }
  if (fails.length || uniqErr.length) process.exit(1);
  console.log('통과 — 모든 위젯이 정답·오답 시나리오를 처리한다.');
})().catch(e => { console.error(e); process.exit(2); });
