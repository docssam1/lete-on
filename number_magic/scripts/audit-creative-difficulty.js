#!/usr/bin/env node
/* 초등 과정 C1~C25 회차별 "교과 칸 vs 창의 칸" 수 크기 감사 (2026-10-07 도입, 10-09 저장소로 옮김).
   회차마다 교과 문항과 창의 문항을 시드 25개로 만들어, 문항에 나오는 가장 큰 수의 중앙값을 비교한다.
   8배 이상 차이 나면 표시한다: '창의 훨씬 어려움' / '창의 훨씬 쉬움'.

   쓰는 법:  node scripts/audit-creative-difficulty.js            # 표를 표준출력으로
            node scripts/audit-creative-difficulty.js out.tsv     # 표를 파일로
   열: 회차 · 교과 크기 · 창의 크기 · 표시 · 교과 항목 · 창의 항목

   판정이 아니라 후보다. 2026-10-09 기준선은 어려움 17 · 쉬움 25.
   남은 표시의 사유(오탐·의도된 연습→실전 순서)는 docs/진도대응-기적의계산법-2026-10-05.md 끝 절.
   기준선보다 늘면 바꾼 편성을 다시 볼 것. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const R = path.join(__dirname, '..');
const w = { console }; w.window = w; vm.createContext(w);
const run = f => vm.runInContext(fs.readFileSync(path.join(R, f), 'utf8'), w, { filename: f });
['engine/rng.js', 'engine/generators.js',
  ...fs.readdirSync(path.join(R, 'engine/threads')).map(f => 'engine/threads/' + f),
  'data/threads.js',
  ...fs.readdirSync(path.join(R, 'data/g1')).map(f => 'data/g1/' + f),
  'data/middle-concepts.js',
  ...fs.readdirSync(path.join(R, 'data/units')).map(f => 'data/units/' + f),
  'data/courses.js'].forEach(f => { try { run(f); } catch (e) { /* 브라우저 전용 파일은 건너뜀 */ } });

const T = w.NM_THREADS, G = w.NM_TGEN, RNG = w.NM_RNG;
const memo = {};
function mag(t, lv) {
  const k = t + '@' + lv; if (k in memo) return memo[k];
  const th = T[t]; const L = th && th.levels.find(l => l.id === lv);
  if (!L || !G[th.gen]) return (memo[k] = null);
  const v = [];
  for (let s = 1; s <= 25; s++) {
    try {
      const p = G[th.gen](L.params || {}, RNG.mulberry32(s * 97 + lv));
      const txt = JSON.stringify([p.tex, p.prompt && p.prompt.ko, p.answer, p.items && p.items.length]);
      const ns = (txt.match(/\d+(\.\d+)?/g) || []).map(Number).filter(x => x < 1e9);
      v.push(ns.length ? Math.max(...ns) : 0);
    } catch (e) { /* 생성 실패 시드는 뺀다 */ }
  }
  v.sort((a, b) => a - b);
  return (memo[k] = v.length ? v[Math.floor(v.length / 2)] : null);
}
const lab = (t, lv) => { const th = T[t]; const L = th && th.levels.find(l => l.id === lv);
  return t + '@' + lv + '(' + (th ? th.name.ko : '?') + (L ? ' ' + (L.label.ko || L.label) : '') + ')'; };

const out = [];
for (let c = 1; c <= 25; c++) {
  const C = w.NM_COURSES['C' + c]; if (!C) continue;
  C.sessions.forEach((s, i) => {
    if (s.test) return;
    const sch = (s.school || []).filter(d => !d.review), cr = (s.strategy && s.strategy.practice) || [];
    const sm = sch.map(d => mag(d.t, d.lv)).filter(x => x != null), cm = cr.map(d => mag(d.t, d.lv)).filter(x => x != null);
    const S = sm.length ? Math.max(...sm) : 0, Cc = cm.length ? Math.max(...cm) : 0;
    let flag = '';
    if (S && Cc) { if (Cc * 8 <= S) flag = '창의 훨씬 쉬움'; else if (Cc >= S * 8) flag = '창의 훨씬 어려움'; }
    out.push(['C' + c + '-' + (i + 1), S, Cc, flag, sch.map(d => lab(d.t, d.lv)).join(' + '), cr.map(d => lab(d.t, d.lv)).join(' + ')].join('\t'));
  });
}
const hard = out.filter(l => l.split('\t')[3] === '창의 훨씬 어려움').length;
const easy = out.filter(l => l.split('\t')[3] === '창의 훨씬 쉬움').length;
if (process.argv[2]) fs.writeFileSync(process.argv[2], out.join('\n') + '\n');
else console.log(out.join('\n'));
console.log(`\n회차 ${out.length} · 창의 훨씬 어려움 ${hard} · 창의 훨씬 쉬움 ${easy} (2026-10-09 기준선 17 · 25)`);
