#!/usr/bin/env node
/* ============================================================
   창의 연산 과정 빈칸 · 색 힌트 검사 (2026-09-26) — 브라우저
   설계 docs/creative-stages-design-2026-09-26.md §3-3 · §3-4, 표 data/creative-process.js.
   원장 "창의 연산 때 한 문제는 빈칸 넣기도 있어야" · "학습지도 이런 스킬(자릿값 색)이 들어가야".

   A. 문항 단위(drill.html) — 과정 0~47 의 **모든 회차**의 창의 칸(strategy.practice) 유형·레벨을
      시드 여러 개로 뽑아 NM_EXAM.applyProcessBlank 를 돌린다.
      1) 4문항 이상인 회차는 cfg 가 정한 수(6문항 → 1, 12문항 → 2)만큼 과정 빈칸이 있다.
         모자란 회차는 **이 검사기가 따로** 모든 풀이 줄을 뒤져 쓸 수 있는 줄이 정말 없는지 본다 —
         하나라도 있으면 실패(앱이 놓친 것), 없으면 "생성기에 과정 줄 없음"으로 목록에 올린다(통과는 하되 숨기지 않는다).
      2) 빈칸 값은 1 이상의 정수, 빈칸은 문항 전체에 딱 하나, 식 줄에는 없다.
      3) 빈칸 줄은 이 검사기의 계산기(앱과 다른 구현)로 다시 계산해 **그 값에서 참, 0~넉넉한 범위의 다른 정수에서 거짓**.
         빈칸을 값으로 채우면 원래 풀이 줄과 글자 그대로 같다(수를 지어내지 않았다). 뒤 줄에 같은 수가 없다.
      4) 식 줄의 끝 변(최종 답)이 원래 문항의 답과 같다. 정답(p.answer)은 빈칸 값이다.
      5) 색 힌트(NM_PV_HINT=true): (2)(5)… 자리만, 과정 빈칸 문항엔 없음, F9·F10·F11 가족엔 없음,
         짝 색은 F1·F7 가족에만·4쌍 이하·쌍의 합(곱)이 10·100(1000) 또는 수열의 첫수·끝수.
   B. 주간 학습지(ws.html, 96장, NM_PV_HINT=true) — 실제 인쇄 DOM 에서
      창의 칸(data-cre="strategy")의 Training Course 회차마다 과정 빈칸 칸 수 = cfg, 빈칸 상자 1개, 정답지 사슬 칸 수 = 과정 빈칸 칸 수,
      색 칸(data-cptint)은 (2)(5)… 자리에만·과정 빈칸 칸엔 없음, 짝 색을 쓴 쪽엔 "같은 색 = 짝꿍" 범례. 적용 칸(data-cre="application")엔 둘 다 없음.
   C. 말(ko/en/zh) — 표의 지시문·범례가 세 말로 다 있고 한국어는 해요체. 영어·중국어 학습지에 한글이 새지 않는다.
     node scripts/check-creative-process.js            # 전체(약 4분)
     node scripts/check-creative-process.js --quick    # A·C 만(주간 학습지 렌더 생략)
   실패하면 exit 1, 브라우저가 없으면 exit 2(미실행).
   ============================================================ */
'use strict';
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('./lib/playwright');
const ROOT = path.resolve(__dirname, '..');
const QUICK = process.argv.includes('--quick');
const SEEDS = 24;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.json':'application/json', '.woff2':'font/woff2' };

/* ── 이 검사기의 계산기 — 앱(exam.js cpEval)과 다른 방식으로 짠다(tex → JS 식 → Function) ── */
function stripAnn(t){
  return String(t).replace(/\((?:[^()]*?)\\text\{[^}]*\}[^()]*\)/g, '').replace(/\\text\{[^}]*\}/g, '')
    .replace(/\\left|\\right|\\displaystyle/g, '').replace(/\\(?:quad|qquad|;|,|!|:| )/g, ' ');
}
function toJs(t){
  let s = stripAnn(t);
  for(let g = 0; g < 6; g++) s = s.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
  s = s.replace(/\^\{([^{}]*)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
       .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/').replace(/−/g, '-');
  return /^[\d.+\-*/()\sX]+$/.test(s) && /[\dX]/.test(s) ? s : null;
}
function evalTex(t){
  const s = toJs(t); if(s == null || /X/.test(s)) return NaN;
  try { const v = Function('"use strict";return (' + s + ');')(); return typeof v === 'number' ? v : NaN; } catch(e){ return NaN; }
}
const near = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
/* □ 가 든 줄을 x 의 함수로 한 번만 짠다 — 변이 하나면 사슬의 값(chain)과 비교 */
function compile(line, chain){
  const segs = String(line).split('\\square').join('X').split('=').map(toJs);
  if(segs.some(x => x == null)) return null;
  try {
    const f = Function('X', '"use strict";return [' + segs.map(x => '(' + x + ')').join(',') + '];');
    return x => { let v; try { v = f(x); } catch(e){ return false; }
      return v.length < 2 ? near(v[0], chain) : v.every(y => near(y, v[0])); };
  } catch(e){ return null; }
}
function uniqueAt(line, v, chain){
  const h = compile(line, chain);
  if(!h || !h(v)) return false;
  /* 0~400 전부 + v 둘레 ±1~±50 + 몇 배 자리(□ 는 한 번만 나오므로 0 이상에서 한 방향으로만 변한다) */
  for(let x = 0; x <= 400; x++) if(x !== v && h(x)) return false;
  for(let d = 1; d <= 50; d++) if((v - d >= 0 && h(v - d)) || h(v + d)) return false;
  return ![v * 3, Math.floor(v / 3), v * 100].some(x => x !== v && h(x));
}
const sig = sg => { const t = String(sg).replace(/\\(?:quad|qquad|;|,|:|!| )|\s+|\\left|\\right/g, '');
  if(/^\(?\d+(?:\\times\d+)+\)?$/.test(t)) return 'x' + t.replace(/[()]/g, '').split('\\times').sort();
  if(/^\(?\d+(?:\+\d+)+\)?$/.test(t)) return '+' + t.replace(/[()]/g, '').split('+').sort();
  return t; };
/* 한 문항에 쓸 수 있는 과정 빈칸 후보가 하나라도 있는가 — 앱과 따로 짠 탐색(설계 §3-3 조건 그대로) */
function anyCandidate(q){
  const lines = q.chain, expr = q.expr; if(!lines || !expr) return null;
  const eSegs = expr.split('='), eSig = new Set(eSegs.map(sig)), fin = evalTex(eSegs[eSegs.length - 1]);
  for(let li = 0; li < lines.length; li++){
    const L = lines[li];
    if(L.split('=').every(sg => eSig.has(sig(sg)))) continue;
    let pos = 0;
    for(const seg of L.split('=')){
      const lone = /^\d+$/.test(stripAnn(seg).replace(/\s+/g, ''));
      if(!lone && !eSig.has(sig(seg))){
        const re = /\d+(?:\.\d+)?/g; let m;
        while((m = re.exec(seg))){
          const st = pos + m.index, tok = m[0], v = +tok;
          if(/\./.test(tok) || L[st-1] === '.' || L[st+tok.length] === '.' || /(?:\^\{|_\{|[\^_#])$/.test(L.slice(0, st))) continue;
          const tx = L.lastIndexOf('\\text{', st); if(tx >= 0 && L.indexOf('}', tx) > st) continue;
          const ov = L.lastIndexOf('\\overline{', st); if(ov >= 0 && L.indexOf('}', ov) > st) continue;
          if(!Number.isInteger(v) || v < 1 || near(v, fin)) continue;
          if(lines.slice(li + 1).some(l => (String(l).match(/\d+(?:\.\d+)?/g) || []).some(x => +x === v))) continue;
          const cand = L.slice(0, st) + '\\square' + L.slice(st + tok.length);
          if(cand.split('=').some(sg => /^\s*\\square\s*$/.test(sg))) continue;
          if(uniqueAt(cand, v, fin)) return { line:li, cand, v };
        }
      }
      pos += seg.length + 1;
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if(!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control':'no-store' });
  fs.createReadStream(p).pipe(res);
});
server.listen(0, async () => {
  const port = server.address().port;
  const fail = [], gaps = new Map(), notes = [];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{ width:1100, height:1100 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.route('**/*', r => /jsdelivr|supabase|google/.test(r.request().url()) ? r.abort() : r.continue());
  await page.addInitScript(() => { window.NM_NO_AUTOPRINT = true; window.NM_PV_HINT = true; });
  await page.goto(`http://localhost:${port}/drill.html`);
  await page.waitForFunction(() => window.NM_EXAM && window.NM_COURSES && window.NM_CREATIVE_PROCESS, null, { timeout:20000 });

  /* ── C. 표의 말 ── */
  const table = await page.evaluate(() => ({ cfg:NM_CREATIVE_PROCESS.cfg, ask:NM_CREATIVE_PROCESS.ask, legend:NM_CREATIVE_PROCESS.pairLegend,
    threads:Object.keys(NM_CREATIVE_PROCESS.threads).map(t => [t, !!NM_THREADS[t]]) }));
  for(const [k, o] of Object.entries(Object.assign({}, table.ask, { pairLegend:table.legend }))){
    for(const l of ['ko', 'en', 'zh']) if(!o || !String(o[l] || '').trim()) fail.push(`C · 말 ${k}.${l} 가 비었다`);
    if(o && /[가-힣]/.test(o.en || '') ) fail.push(`C · ${k}.en 에 한글`);
    if(o && /[가-힣]/.test(o.zh || '') ) fail.push(`C · ${k}.zh 에 한글`);
    if(o && k !== 'pairLegend' && !/요\.?$/.test(String(o.ko).trim())) fail.push(`C · ${k}.ko 가 해요체가 아니다: ${o.ko}`);
  }
  table.threads.filter(x => !x[1]).forEach(x => fail.push(`표 · ${x[0]} 는 data/threads.js 에 없는 유형이다`));

  /* ── A. 문항 단위 ── */
  const units = await page.evaluate(SEEDS => {
    const seen = new Map();
    for(const [ck, c] of Object.entries(NM_COURSES)){
      (c.sessions || []).forEach((s, si) => { if(s.test) return;
        ((s.strategy && s.strategy.practice) || []).forEach(d => { const k = d.t + '@' + d.lv + 'x' + (d.count || 6);
          if(!seen.has(k)) seen.set(k, { t:d.t, lv:d.lv, n:d.count || 6, at:ck + '.' + (si + 1), tier:c.tier }); }); });
    }
    const I = NM_EXAM.processInternals, out = [];
    for(const [k, u] of seen){
      const conf = I.cpOf(u.t, u.lv);
      for(let sd = 0; sd < SEEDS; sd++){
        let ps; try { ps = NM_EXAM.buildProblems(u.t, u.lv, u.n, NM_RNG.hashSeed('cpchk' + sd + k)); } catch(e){ out.push({ k, sd, err:String(e && e.message || e) }); continue; }
        /* classifyRoundLayout 의 train 조건 그대로 — 그림만·문장제만·그래프 회차는 Training Course 가 아니다 */
        const train = !ps.every(p => !p.tex && !p.word) && !ps.every(p => p.word) && !ps.some(p => p.graph);
        if(!train){ out.push({ k, sd, notTrain:true }); break; }
        const before = ps.map(p => ({ tex:p.tex, answer:JSON.parse(JSON.stringify(p.answer)), shape:p.answerShape || null,
          expr:I.cpExprLine(p), chain:(I.cpSourceLines(p) || []).map(x => { let k2 = 0; const b = x.blank;
            if(!/\\square/.test(x.tex)) return String(x.tex);
            if(b == null) return null;
            return String(x.tex).replace(/\\square/g, () => { const v = Array.isArray(b) ? b[k2++] : b; return String(v); }); }) }));
        const item = { thread:u.t, level:u.lv, creative:true, role:'strategy', schoolTier: /^middle/.test(u.tier) ? 'mid' : 'elem', seed:'x' };
        NM_EXAM.applyProcessBlank(ps, item);
        I.applyTrainColor(ps, item);
        out.push({ k, sd, t:u.t, lv:u.lv, at:u.at, fam:conf.fam, n:ps.length, want:NM_EXAM.processBlankIndexes(ps.length),
          before, after:ps.map(p => ({ answer:p.answer, process:p.__process ? JSON.parse(JSON.stringify(p.__process)) : null,
            tint:p.__cpTint ? JSON.parse(JSON.stringify(p.__cpTint)) : null, word:!!p.word })) });
      }
    }
    return out;
  }, SEEDS);

  const cfg = table.cfg;
  let rounds = 0, blanks = 0, moved = 0, tinted = 0;
  const numTok = s => (String(s).match(/\d+(?:\.\d+)?/g) || []).map(Number);
  for(const r of units){
    if(r.err){ fail.push(`A · ${r.k} 시드 ${r.sd}: 생성 실패 ${r.err}`); continue; }
    if(r.notTrain) continue;
    rounds++;
    const got = r.after.map((a, i) => a.process ? i : -1).filter(i => i >= 0);
    blanks += got.length;
    if(r.n >= 4 && got.length !== r.want.length){
      if(got.length > r.want.length) fail.push(`A1 · ${r.k} 시드 ${r.sd}: 과정 빈칸 ${got.length}개 — ${r.want.length}개여야`);
      else {
        /* 모자라면 — 남은 문항 가운데 쓸 수 있는 줄이 정말 없는지 따로 본다 */
        const miss = r.before.map((b, i) => got.includes(i) || r.after[i].word ? null : anyCandidate(b)).find(Boolean);
        if(miss) fail.push(`A1 · ${r.k} 시드 ${r.sd}: 과정 빈칸 ${got.length}/${r.want.length} — 쓸 수 있는 줄이 있는데 놓쳤다(${miss.cand} → ${miss.v})`);
        else { const g = gaps.get(r.k) || { at:r.at, n:0, of:0, ex:r.before[r.want[0]] && r.before[r.want[0]].tex }; g.n++; gaps.set(r.k, g); }
      }
    }
    got.forEach(i => {
      const P = r.after[i].process, B = r.before[i], tag = `${r.k} 시드 ${r.sd} (${i + 1})`;
      if(!r.want.includes(i)) moved++;
      const v = P.value;
      if(!Number.isInteger(v) || v < 1) fail.push(`A2 · ${tag}: 빈칸 값 ${v} 이 1 이상의 정수가 아니다`);
      if(r.after[i].answer !== v) fail.push(`A4 · ${tag}: 정답 ${r.after[i].answer} ≠ 빈칸 값 ${v}`);
      const boxes = P.lines.join(' ').split('\\square').length - 1;
      if(boxes !== 1) fail.push(`A2 · ${tag}: 빈칸 ${boxes}개`);
      if(/\\square/.test(P.expr)) fail.push(`A2 · ${tag}: 식 줄에 빈칸이 남았다 ${P.expr}`);
      const L = P.lines[P.line];
      if(L.split('\\square').join(String(v)) !== B.chain[P.line]) fail.push(`A3 · ${tag}: 빈칸을 채운 줄이 원래 풀이 줄과 다르다 — ${L} / ${B.chain[P.line]}`);
      if(JSON.stringify(P.lines.filter((_, j) => j !== P.line)) !== JSON.stringify(B.chain.filter((_, j) => j !== P.line))) fail.push(`A3 · ${tag}: 다른 줄이 바뀌었다`);
      const eSegs = P.expr.split('='), fin = evalTex(eSegs[eSegs.length - 1]);
      if(!uniqueAt(L, v, fin)) fail.push(`A3 · ${tag}: ${L} 이 ${v} 하나로만 풀리지 않는다(검사기 계산)`);
      if(P.lines.slice(P.line + 1).some(l => numTok(l).includes(v))) fail.push(`A3 · ${tag}: 뒤 줄에 ${v} 가 그대로 보인다`);
      if(P.expr !== B.expr) fail.push(`A4 · ${tag}: 식 줄이 문항과 다르다 ${P.expr} / ${B.expr}`);
      /* 식 줄 끝 변 = 원래 답 */
      const oa = B.answer, shape = B.shape;
      const expect = shape === 'fraction' && Array.isArray(oa) ? oa[0] / oa[1] : (!Array.isArray(oa) ? +oa : NaN);
      if(Number.isFinite(expect) && !/,/.test(B.tex) && /=\s*\\square\s*$/.test(B.tex) && !near(fin, expect))
        fail.push(`A4 · ${tag}: 식 줄의 최종 답 ${eSegs[eSegs.length - 1]} ≠ 원래 답 ${JSON.stringify(oa)}`);
    });
    /* 색 */
    r.after.forEach((a, i) => {
      if(!a.tint) return; tinted++;
      const tag = `${r.k} 시드 ${r.sd} (${i + 1})`;
      if(i % cfg.colorEvery !== cfg.colorOffset) fail.push(`A5 · ${tag}: 색이 (2)(5)… 자리가 아닌 곳에`);
      if(a.process) fail.push(`A5 · ${tag}: 과정 빈칸 문항에 색`);
      if(r.fam && cfg.noColorFamilies.includes(r.fam)) fail.push(`A5 · ${tag}: 색을 주지 않는 가족 ${r.fam} 에 색`);
      if(a.tint.kind === 'pair'){
        if(!cfg.pairFamilies.includes(r.fam)) fail.push(`A5 · ${tag}: 짝 색이 ${r.fam} 가족에`);
        const ps = a.tint.pairs || [];
        if(!ps.length || ps.length > cfg.maxPairs) fail.push(`A5 · ${tag}: 짝 ${ps.length}쌍`);
        const lhs = String(r.before[i].tex).split('=')[0];
        const mul = /\\times/.test(lhs), seq = /\\cdots|\\ldots/.test(lhs);
        ps.forEach(pp => { const s2 = mul ? pp.va * pp.vb : pp.va + pp.vb;
          const ok = seq ? true : (mul ? [10, 100, 1000] : [10, 100]).includes(s2);
          if(!ok) fail.push(`A5 · ${tag}: 짝 ${pp.va}·${pp.vb} 가 10·100 짝이 아니다`); });
        if(seq && ps[0] && !(ps[0].a === 0)) fail.push(`A5 · ${tag}: 수열 짝이 첫수에서 시작하지 않는다`);
      } else if(a.tint.kind === 'place'){ if(/\\times|\\div/.test(r.before[i].tex.split('=')[0])) fail.push(`A5 · ${tag}: 곱나눗에 자리 색`); }
      else if(a.tint.kind === 'key'){ if(!/\\times|\\div|\\cdot/.test(r.before[i].tex.split('=')[0])) fail.push(`A5 · ${tag}: 덧뺄에 key 색`); }
    });
  }

  /* ── B. 주간 학습지 ── */
  let sheets = 0, domRounds = 0, domBlanks = 0, domTint = 0;
  if(!QUICK){
    const pg = await browser.newPage();
    pg.on('pageerror', e => errs.push(e.message));
    await pg.addInitScript(() => { window.NM_PV_HINT = true; });
    for(let c = 0; c < 48; c++) for(const k of [1, 2]){
      await pg.goto(`http://localhost:${port}/ws.html?w=2026-W39&c=C${c}&n=check&k=${k}&cad=w2&auto=0`);
      let ready = null;
      for(let i = 0; i < 60; i++){ await pg.waitForTimeout(200); ready = await pg.evaluate(() => window.NM_WS_READY); if(ready) break; }
      if(ready !== true){ fail.push(`B · C${c} k${k}: 학습지가 만들어지지 않았다(${ready})`); continue; }
      sheets++;
      const d = await pg.evaluate(cfg => {
        const byCode = new Map();
        document.querySelectorAll('.nm-print-sheet .nm-w2-page[data-cre]').forEach(p => {
          const code = (p.querySelector('.nm-w2-foot-code') || {}).textContent || '?';
          const r = byCode.get(code) || { role:p.getAttribute('data-cre'), cells:[], pairPages:0, pairLegends:0 };
          p.querySelectorAll('.nm-w2-item-train').forEach(e => r.cells.push({
            num:+((e.querySelector('.nm-w2-num') || {}).textContent || '0').replace(/\D/g, ''),
            process:e.classList.contains('nm-w2-item-process'), form:e.getAttribute('data-process'),
            boxes:[...e.querySelectorAll('[data-tex]')].map(x => x.getAttribute('data-tex')).join(' ').split('\\boxed{').length - 1,
            tint:e.getAttribute('data-cptint'), ask:(e.querySelector('.nm-w2-process-ask') || {}).textContent || '' }));
          if(p.querySelector('[data-cptint="pair"]')) r.pairPages++;
          if(p.querySelector('.nm-pv-legend-pair')) r.pairLegends++;
          byCode.set(code, r);
        });
        const chains = document.querySelectorAll('.nm-ak-item-chain').length;
        const legendTxt = [...document.querySelectorAll('.nm-pv-legend-pair b')].map(b => b.textContent);
        return { rounds:[...byCode.entries()], chains, legendTxt };
      }, cfg);
      let procCells = 0;
      for(const [code, r] of d.rounds){
        const n = r.cells.length; if(!n) continue;
        const tag = `C${c} k${k} ${code}`;
        const proc = r.cells.filter(x => x.process);
        procCells += proc.length;
        if(r.role !== 'strategy'){ if(proc.length || r.cells.some(x => x.tint)) fail.push(`B · ${tag}: 적용 칸에 과정 빈칸·색`); continue; }
        domRounds++; domBlanks += proc.length;
        const want = n >= 4 ? (() => { const bare = Math.ceil(n * 0.75), o = []; for(let i = 0; i < n; i++) if(i % cfg.blankEvery === cfg.blankOffset && i < bare) o.push(i); if(!o.length) o.push(cfg.blankOffset); return o.length; })() : 0;
        const th = code.replace(/^#/, '').split('-L')[0], lv = +((code.match(/-L(\d+)x/) || [])[1]);
        if(proc.length !== want){
          const g = gaps.get(`${th}@${lv}x${n}`);
          if(!(proc.length < want && g)) fail.push(`B · ${tag}: 과정 빈칸 칸 ${proc.length}/${want}`);
          else notes.push(`${tag}: 과정 빈칸 ${proc.length}/${want} — ${th}@${lv} 생성기에 과정 줄 없음(A 에서 확인)`);
        }
        proc.forEach(x => { if(x.boxes !== 1) fail.push(`B · ${tag} (${x.num}): 과정 빈칸 칸의 빈칸 상자 ${x.boxes}개`);
          if(!x.ask.trim()) fail.push(`B · ${tag} (${x.num}): 과정 빈칸 지시문이 없다`); });
        r.cells.filter(x => x.tint).forEach(x => { domTint++;
          if((x.num - 1) % cfg.colorEvery !== cfg.colorOffset) fail.push(`B · ${tag} (${x.num}): 색이 (2)(5)… 자리가 아니다`);
          if(x.process) fail.push(`B · ${tag} (${x.num}): 과정 빈칸 칸에 색`); });
        if(r.pairPages !== r.pairLegends) fail.push(`B · ${tag}: 짝 색 쪽 ${r.pairPages} · 범례 ${r.pairLegends}`);
      }
      if(d.chains !== procCells) fail.push(`B · C${c} k${k}: 정답지 사슬 ${d.chains} ≠ 과정 빈칸 칸 ${procCells}`);
      d.legendTxt.forEach(t => { if(t !== '같은 색 = 짝꿍') fail.push(`B · C${c} k${k}: 범례 "${t}"`); });
    }
    /* C. 영어·중국어 학습지 — 과정 빈칸 지시문·짝 범례가 그 말로, 한글 없이 */
    for(const [c, l] of [['C4', 'en'], ['C4', 'zh'], ['C9', 'en'], ['C9', 'zh'], ['C15', 'en'], ['C15', 'zh']]){
      await pg.goto(`http://localhost:${port}/ws.html?w=2026-W39&c=${c}&n=check&k=1&cad=w2&auto=0&l=${l}`);
      for(let i = 0; i < 60; i++){ await pg.waitForTimeout(200); if(await pg.evaluate(() => window.NM_WS_READY)) break; }
      const t = await pg.evaluate(() => ({ asks:[...document.querySelectorAll('.nm-w2-process-ask')].map(e => e.textContent),
        legends:[...document.querySelectorAll('.nm-pv-legend-pair b')].map(e => e.textContent) }));
      const allowed = new Set(Object.values(table.ask).map(o => o[l]));
      if(!t.asks.length) fail.push(`C · ${c} ${l}: 과정 빈칸 지시문이 없다`);
      t.asks.forEach(a => { if(!allowed.has(a)) fail.push(`C · ${c} ${l}: 지시문 "${a}" 가 표의 ${l} 문장이 아니다`); if(/[가-힣]/.test(a)) fail.push(`C · ${c} ${l}: 지시문에 한글`); });
      t.legends.forEach(a => { if(a !== table.legend[l]) fail.push(`C · ${c} ${l}: 범례 "${a}"`); });
    }
  }
  await browser.close(); server.close();
  errs.forEach(e => fail.push('페이지 오류: ' + e));

  console.log(`A · 창의 칸 유형·레벨 ${new Set(units.map(u => u.k)).size}개 × 시드 ${SEEDS} → Training Course 회차 ${rounds}개, 과정 빈칸 ${blanks}개(정한 자리에서 옮긴 것 ${moved}), 색 칸 ${tinted}개`);
  if(!QUICK) console.log(`B · 주간 학습지 ${sheets}장 — 창의 Training Course 회차 ${domRounds}개, 과정 빈칸 칸 ${domBlanks}개, 색 칸 ${domTint}개`);
  if(gaps.size){
    console.log(`\n⚠ 생성기에 과정 줄이 없어 과정 빈칸을 못 넣은 유형 ${gaps.size}개(수를 지어내지 않았다 — 검사기가 따로 뒤져도 쓸 줄이 없었다):`);
    [...gaps.entries()].forEach(([k, g]) => console.log(`  ${k}  (처음 나오는 회차 ${g.at}, ${g.n}/${SEEDS} 시드) 예: ${g.ex}`));
  }
  if(notes.length){ console.log(`\n  주간 학습지에서 그 때문에 빈칸이 모자란 회차 ${notes.length}개:`); notes.forEach(n => console.log('   ' + n)); }
  if(fail.length){ console.log(`\n✗ 실패 ${fail.length}건`); fail.slice(0, 200).forEach(f => console.log('  ' + f)); process.exit(1); }
  console.log('\n통과 — 창의 회차마다 정한 수의 과정 빈칸(정수 하나·되계산 일치)과 정한 자리의 색 힌트, 세 말 문구.');
});
