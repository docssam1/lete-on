#!/usr/bin/env node
/* ============================================================
   Training Course 칸 풀이 줄 검사 (2026-09-26 밤) — 브라우저
   창의 연산 칸(Training Course)은 문항마다 식 한 줄 + 풀이 줄(p.steps, 없으면 p.solution)을 "= …" 로 찍는다.
   독립 검수에서 두 가지가 나왔다(원장 검수 C6 SB12 · MD83·MD23·MD29·MD33·MD3·MD19·MD25·MD27·MD30):
     ① 다른 양을 구하는 곁 계산("26 − 19" 아래 "= 19 + 1 = □")에도 "=" 가 붙어 거짓 등식으로 읽혔다
     ② solution 으로 채우는 줄이 답을 글자 그대로 보여 주거나("= \dfrac{√6−√14}{2}") "= =" 가 찍혔다
   courses.js 에 놓인 **모든** 유형·레벨(교과·창의·적용·심화·점검 풀) × 시드 20 으로 문항을 뽑아
   exam.js trainCellPlan(칸이 실제로 쓰는 짜임)을 보고, 하나라도 걸리면 실패한다.
     A. 풀이 줄이 답을 빈칸 밖 글자로 드러낸다(음수는 절댓값으로 센다)
        · solution 줄: 답의 수가 모두 있거나, 답의 수 하나라도 문제 식보다 더 많이 나온다
        · 생성기 steps 줄: 한 변이 답 하나뿐이거나(`⇒ 220 = □`), 답을 재료로 답을 다시 만든다(`810 + 0 = □`).
          다른 값을 구하는 줄의 재료로 우연히 같은 수가 나오는 것(SB8 `61 − 31` 의 `61 − 30`, 답 30)은 노출이 아니다
     B. "= =" — 줄이 "=" 로 시작하거나 "= =" 를 품는다
     C. 거짓 등식 — "=" 로 이은 줄은 계산해서 원래 식의 값과 같아야 하고, 계산되는 등식 줄은 변끼리 같아야 한다
        (계산은 이 검사기의 계산기로 — exam.js cpEval 과 다른 구현)
     node scripts/check-train-steps.js            # 전체(약 1분)
     node scripts/check-train-steps.js SB12 MD83  # 지정 유형만
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const only = process.argv.slice(2).filter(a => /^[A-Z]+\d+$/.test(a));
const SEEDS = 20;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };

/* 설명 글은 괄호로 묶은 것과 맨 끝에 붙은 것만 지운다 — 수 사이에 낀 말이 남으면 계산하지 않는다(evalTex → NaN) */
function stripAnn(t){
  return String(t).replace(/\((?:[^()]*?)\\text\{[^}]*\}[^()]*\)/g, '').replace(/(?:\\[;,:! ]|\s)*\\text\{[^}]*\}\s*$/, '')
    .replace(/\\left|\\right|\\displaystyle/g, '').replace(/\\(?:quad|qquad|;|,|!|:| )/g, ' ');
}
function evalTex(t){
  let s = stripAnn(t);
  for(let g = 0; g < 6; g++) s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
  s = s.replace(/\^\{([^{}]*)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
       .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/').replace(/−/g, '-');
  if(!/^[\d.+\-*/()\s]+$/.test(s) || !/\d/.test(s)) return NaN;
  try { const v = Function('"use strict";return (' + s + ');')(); return typeof v === 'number' ? v : NaN; } catch(e){ return NaN; }
}
const near = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
function tokens(t){ return (String(t).replace(/\\square/g, ' ').match(/\d+(?:\.\d+)?/g) || []); }

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.route('**/*', r => /jsdelivr|supabase|google/.test(r.request().url()) ? r.abort() : r.continue());
  await page.addInitScript(() => { window.NM_NO_AUTOPRINT = true; });
  await page.goto(`http://localhost:${server.address().port}/drill.html`);
  await page.waitForFunction(() => window.NM_EXAM && window.NM_EXAM.trainCellPlan && window.NM_COURSES, null, { timeout:20000 });
  const data = await page.evaluate(({ SEEDS, only }) => {
    const keys = new Map();
    const add = (d, role, at) => { if(!d || !d.t || !NM_THREADS[d.t]) return; if(only.length && !only.includes(d.t)) return;
      const k = d.t + '@' + (d.lv || 1); if(!keys.has(k)) keys.set(k, { t:d.t, lv:d.lv || 1, role, at }); };
    for(const [ck, c] of Object.entries(NM_COURSES)) (c.sessions || []).forEach((s, i) => {
      const at = ck + '.' + (i + 1);
      /* 놓인 것 전부 — 교과·창의·적용·심화·점검 풀. Training Course 칸은 창의·창의에서 온 적용·심화만 타지만,
         같은 유형이 다른 과정에서 창의 칸으로 옮겨 갈 수 있으니(편성은 자주 바뀐다) 모두 본다. */
      (s.drills || []).forEach(d => add(d, 'drill', at)); (s.creative || []).forEach(d => add(d, 'creative', at));
      (s.school || []).forEach(d => add(d, 'school', at));
      ((s.strategy && s.strategy.practice) || []).forEach(d => add(d, 'strategy', at));
      (s.application || []).forEach(d => add(d, 'application', at)); (s.stretch || []).forEach(d => add(d, 'stretch', at));
      (s.pool || []).forEach(d => add(d, 'test', at));
    });
    const out = [];
    for(const [k, u] of keys){
      for(let sd = 0; sd < SEEDS; sd++){
        let ps; try { ps = NM_EXAM.buildProblems(u.t, u.lv, 6, NM_RNG.hashSeed('trs' + sd + k)); } catch(e){ continue; }
        ps.forEach((p, i) => {
          if(!p || p.word || p.graph || !p.tex) return;
          const plan = NM_EXAM.trainCellPlan(p, 0, 6);
          if(!plan.steps.length) return;
          out.push({ k, sd, i, at:u.at, role:u.role, tex:p.tex, answer:p.answer, value:plan.value, ans:plan.ans, from:plan.from,
            steps:plan.steps.map(x => ({ tex:x.tex, eq:x.eq, fill:x.fill })) });
        });
      }
    }
    return { n:keys.size, out };
  }, { SEEDS, only });
  await browser.close(); server.close();

  const fail = { A:[], B:[], C:[] }, perKey = {};
  const note = (c, k, msg) => { fail[c].push(msg); perKey[k] = perKey[k] || {}; perKey[k][c] = (perKey[k][c] || 0) + 1; };
  let lines = 0, eqLines = 0, sideLines = 0;
  for(const r of data.out){
    const tag = `${r.k} 시드 ${r.sd} (${r.i + 1}) ${r.tex}`;
    const lits = [].concat(r.answer == null ? [] : r.answer).filter(v => v !== '' && Number.isFinite(+v)).map(v => String(Math.abs(+v)));
    r.steps.forEach(x => {
      lines++; if(x.eq) eqLines++; else sideLines++;
      const toks = tokens(x.tex);
      const hit = lits.find(l => toks.includes(l));
      /* solution 줄: 답의 수가 글자로 있으면 곧 노출. 생성기 steps 줄: 답을 그대로 되풀이하는 줄(한 변이 답 하나뿐이거나
         답을 재료로 답을 다시 만드는 줄 `810 + 0 = □`)만 노출 — 다른 값을 구하는 줄의 재료로 우연히 같은 수가 나오는 것은 아니다 */
      const cnt = (t, l) => tokens(t).filter(x2 => x2 === l).length;
      const solReveal = lits.length && (lits.every(l => toks.includes(l)) || lits.some(l => cnt(x.tex, l) > cnt(r.tex, l)));
      if(r.from !== 'steps' && solReveal) note('A', r.k, `A · ${tag} — solution 줄 "${x.tex}" 이 답(${lits.join(',')})을 드러낸다`);
      if(hit != null && r.from === 'steps'){
        const lone = x.tex.split('=').some(sg => stripAnn(sg).replace(/\\Rightarrow|\\therefore|\s+/g, '') === hit);
        const fs = x.fill != null ? x.fill.split('=') : null;
        const same = fs && typeof r.answer === 'number' && near(evalTex(fs[fs.length - 1]), r.answer);
        if(lone || same) note('A', r.k, `A · ${tag} — 풀이 줄 "${x.tex}" 에 답 ${hit}`);
      }
      /* 몫 ⋯ 나머지 줄은 A = B × 몫 + 나머지 로 확인 */
      const qr = x.fill && /^\s*(\d+)\s*\\div\s*(\d+)\s*=\s*(\d+)\s*\\cdots\s*(\d+)/.exec(stripAnn(x.fill));
      if(qr && !(+qr[1] === +qr[2] * +qr[3] + +qr[4] && +qr[4] < +qr[2])) note('C', r.k, `C · ${tag} — 몫·나머지가 맞지 않는다 "${x.fill}"`);
      if(/^\s*=/.test(x.tex) || /=\s*=/.test(x.tex) || /^\s*\\Rightarrow/.test(x.tex) && x.eq) note('B', r.k, `B · ${tag} — "${x.eq ? '= ' : '→ '}${x.tex}"`);
      if(x.fill != null){
        const segs = x.fill.split('='), vals = segs.map(evalTex);
        if(vals.every(Number.isFinite)){
          if(segs.length > 1 && !vals.every(v => near(v, vals[0]))) note('C', r.k, `C · ${tag} — 거짓 등식 "${x.fill}"`);
          if(x.eq && Number.isFinite(r.value) && !vals.every(v => near(v, r.value))) note('C', r.k, `C · ${tag} — "= ${x.fill}" 가 원래 식의 값 ${r.value} 와 다르다`);
          if(x.eq && !Number.isFinite(r.value)) note('C', r.k, `C · ${tag} — 원래 식의 값을 모르는데 "= ${x.fill}" 로 이었다`);
        }
      }
    });
  }
  const total = fail.A.length + fail.B.length + fail.C.length;
  console.log(`courses.js 유형·레벨 ${data.n}개 × 시드 ${SEEDS} → 풀이 줄이 있는 문항 ${data.out.length}개 · 줄 ${lines}개("=" 로 이은 줄 ${eqLines} · 곁 계산 → ${sideLines})`);
  if(errs.length) errs.forEach(e => console.log('페이지 오류: ' + e));
  if(total || errs.length){
    console.log(`\n✗ 실패 ${total}건 — A 답 노출 ${fail.A.length} · B "= =" ${fail.B.length} · C 거짓 등식 ${fail.C.length}`);
    console.log('  유형·레벨별: ' + Object.entries(perKey).map(([k, v]) => `${k}(${Object.entries(v).map(([c, n]) => c + n).join(' ')})`).join(', '));
    /* 유형·레벨·종류마다 첫 예 하나씩 */
    const shown = new Set();
    ['A', 'B', 'C'].forEach(c => fail[c].forEach(f => { const k = c + ' ' + f.split(' ')[2]; if(shown.has(k)) return; shown.add(k); console.log('  ' + f); }));
    process.exit(1);
  }
  console.log('통과 — 답이 빈칸 밖에 보이지 않고, "= =" 가 없고, "=" 로 이은 줄은 모두 원래 식과 같은 값이다.');
});
