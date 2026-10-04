#!/usr/bin/env node
/* G1-13~15호 생성기 검사 — NL57~NL66 전 레벨을 시드 N개씩 돌려
   ① 예외 없음 ② answer 정수 ③ 3언어 prompt ④ 서로 다른 문항 수 ⑤ 위젯별 불변식(유일해·범위)을 본다.
   쓰는 법: node scripts/check-g1315-gen.js [시드수=400]   (실패가 있으면 exit 1) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const N = +process.argv[2] || 400;
const w = { console, Math, JSON, Object, Array, String, Number, RegExp, Set, Map, parseInt, parseFloat, isNaN, isFinite, Error, Symbol };
w.window = w; w.global = w;
const sb = vm.createContext(w);
for (const f of ['engine/rng.js', 'data/threads.js', 'engine/threads/g1-13-15.js', 'data/g1/13-15-threads.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f });
const { NM_THREADS: TH, NM_TGEN: GEN, NM_RNG } = w;
const IDS = ['NL57', 'NL58', 'NL59', 'NL60', 'NL61', 'NL62', 'NL63', 'NL64', 'NL65', 'NL66'];
const fails = [];
const rows = [];

function coreOf(p) {
  const d = {};
  (p.keyFields || []).forEach(k => { d[k] = p[k]; });
  return JSON.stringify(d);
}
function keyOf(p) {
  const d = { prompt: p.prompt, choices: p.choices };
  (p.keyFields || []).forEach(k => { d[k] = p[k]; });
  return JSON.stringify(d);
}
/* 위젯별 불변식 */
function inv(p, tag) {
  const bad = m => fails.push(`${tag}: ${m}`);
  const rng = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  switch (p.widget) {
    case 'overlapSum': {
      const v = {}; p.regions.forEach(r => { v[r.id] = r.v; });
      const ask = p.regions.find(r => r.v === null);
      if (!ask || ask.id !== p.askId) bad('빈 칸');
      v[p.askId] = p.answer;
      p.sets.forEach(s => { if (s.reduce((a, id) => a + v[id], 0) !== p.target) bad('도형 합'); });
      if (p.target > 9 || Object.values(v).some(x => !rng(x, 1, 9))) bad('범위');
      if (!p.choices.includes(p.answer) || new Set(p.choices).size !== 3) bad('보기');
      break;
    }
    case 'weightPick': {
      if (!p.solutions.length) bad('해 없음');
      p.solutions.forEach(s => { if (s.reduce((a, b) => a + b, 0) !== p.target || s.length > p.maxPick) bad('해'); });
      break;
    }
    case 'balanceEq': {
      const side = [0, 0]; side[p.objSide] += p.objW; p.fixed.forEach(f => { side[f.side] += f.w; }); side[p.blank.side] += p.answer;
      if (side[0] !== side[1]) bad('평형');
      if (side[0] > 9) bad('총합');
      if (!p.choices.includes(p.answer) || new Set(p.choices).size !== 3) bad('보기');
      break;
    }
    case 'pathSum': { if (p.answer > 9) bad('최소합'); break; }
    case 'gridSum': {
      const g = p.sol;
      for (let i = 0; i < p.n; i++) {
        if (g[i].reduce((a, b) => a + b, 0) !== p.T) bad('행합');
        if (g.reduce((a, r) => a + r[i], 0) !== p.T) bad('열합');
      }
      if (p.grid.some((r, ri) => r.some((x, ci) => (x === null) !== p.blanks.some(b => b[0] === ri && b[1] === ci)))) bad('빈칸표');
      break;
    }
    case 'crossPlace': {
      const s = p.sol;
      if (s.l + s.c + s.r !== p.T || s.u + s.c + s.d !== p.T || new Set(Object.values(s)).size !== 5) bad('십자');
      break;
    }
    case 'pairUp': {
      const sums = p.pairs.map(x => x[0] + x[1]);
      if (new Set(sums).size !== 1 || sums[0] !== p.T || p.cards.length !== 2 * p.k) bad('짝');
      break;
    }
    case 'ringSum': {
      const c = p.sol;
      if (c.some((x, i) => x + c[(i + 1) % 4] !== p.sides[i])) bad('변합');
      break;
    }
    case 'ruleTable': {
      const r = p.rows[3];
      const a = p.rule === 'a+b' ? r[0] + r[1] : p.rule === 'a-b' ? r[0] - r[1] : r[0] + r[1] + r[2];
      if (a !== p.answer) bad('표');
      break;
    }
    case 'numberTrain': {
      const c = p.cars, l = p.links;
      for (let i = 0; i < l.length; i++) if (c[i] !== null && c[i + 1] !== null && l[i] !== null && c[i + 1] - c[i] !== l[i]) bad('기차');
      break;
    }
    case 'promiseBox': {
      const Rl = w.NM_G1315_PRULES[p.rule];
      p.examples.forEach(([a, b, r]) => { if (Rl.f(a, b) !== r) bad('예시'); });
      if (p.askPos === 'result' && Rl.f(p.target[0], p.target[1]) !== p.answer) bad('답');
      break;
    }
    case 'shapeEq': {
      const v = p.vals, ev = k => typeof k === 'number' ? k : v[k];
      p.eqs.forEach(e => {
        let s = ev(e.l[0]);
        for (let i = 1; i < e.l.length; i += 2) s = e.l[i] === '+' ? s + ev(e.l[i + 1]) : s - ev(e.l[i + 1]);
        if (s !== ev(e.r)) bad('식');
      });
      if (new Set(Object.values(v)).size !== Object.keys(v).length) bad('다른 기호 다른 수');
      if (Object.values(v).some(x => !rng(x, 1, 9))) bad('범위');
      break;
    }
    case 'arrowChain': {
      const v = p.vals, n = v.length;
      p.arrows.forEach((a, i) => { if (i + 1 < n && v[i + 1] !== v[i] + a.d) bad('사슬'); });
      if (p.loop && v[n - 1] + p.arrows[n - 1].d !== v[0]) bad('고리');
      if (v.some(x => !rng(x, 0, 9))) bad('범위');
      break;
    }
    case 'splitList': { if (!p.pairs.length || p.pairs.length !== p.answer) bad('가짓수'); break; }
    case 'seqGap': {
      p.blanks.forEach((i, bi) => { if (!p.choices[bi].includes(p.seq[i])) bad('보기'); });
      if (p.seq.some(x => !rng(x, 0, 9))) bad('범위');
      break;
    }
    case 'storyFill': { if (p.chips.slice().sort().join() !== p.sol.slice().sort().join()) bad('칩'); break; }
    case 'eqChoice': { if (!rng(p.answer, 0, 2) || p.choices.length !== 3) bad('보기'); break; }
    case 'tapWrong': {
      const nums = p.tokens.ko.filter(t => t.n != null);
      if (nums.filter(t => t.wrong).length !== 1) bad('틀린 수 하나');
      if (p.tokens.en.filter(t => t.wrong).length !== 1 || p.tokens.zh.filter(t => t.wrong).length !== 1) bad('언어별 틀린 수');
      if (nums.find(t => t.wrong).n === p.answer) bad('틀린 수=정답');
      if (!p.choices.includes(p.answer)) bad('보기');
      break;
    }
    case 'dartTarget': {
      const s = p.hits.reduce((a, h) => a + h.ring, 0);
      if (p.ask === 'sum') { if (s !== p.answer) bad('합'); } else if (s + p.answer !== p.total) bad('가린 화살');
      break;
    }
    case 'digitBoard': {
      const flat = [].concat(...p.grid), cnt = {};
      flat.forEach(x => { cnt[x] = (cnt[x] || 0) + 1; });
      const vs = Object.values(cnt);
      if (flat.length !== 20) bad('20칸');
      const mx = Math.max(...vs), mn = Math.min(...vs);
      if (vs.filter(x => x === mx).length !== 1 || vs.filter(x => x === mn).length !== 1) bad('동점');
      if (p.ask === 'diff' ? mx - mn !== p.answer : cnt[p.answer] !== (p.ask === 'most' ? mx : mn)) bad('답');
      if (!p.choices.includes(p.answer)) bad('보기');
      break;
    }
    case 'stairsGame': { if (2 * p.game.wins - p.game.losses !== p.answer || p.answer < 1 || p.answer > 9) bad('위치'); break; }
    case 'sortBasket3': { if (new Set(p.counts).size !== 3) bad('동점'); break; }
    default: break;
  }
}

for (const id of IDS) {
  const th = TH[id];
  if (!th) { fails.push(`${id}: 스레드 없음`); continue; }
  if (!GEN[th.gen]) { fails.push(`${id}: 생성기 ${th.gen} 없음`); continue; }
  for (const lv of th.levels) {
    const keys = new Set(), core = new Set(), answers = {};
    let ok = 0;
    for (let s = 0; s < N; s++) {
      const rng = NM_RNG.mulberry32(NM_RNG.hashSeed(`g1315-${id}-${lv.id}-${s}`));
      let p;
      const tag = `${id}L${lv.id}#${s}`;
      try { p = GEN[th.gen](lv.params, rng); } catch (e) { fails.push(`${tag}: 예외 ${e.message}`); continue; }
      if (!Number.isInteger(p.answer)) { fails.push(`${tag}: answer 정수 아님 ${p.answer}`); continue; }
      if (p.answerType !== 'number') fails.push(`${tag}: answerType`);
      for (const l of ['ko', 'en', 'zh']) if (!p.prompt || !p.prompt[l]) fails.push(`${tag}: prompt.${l}`);
      if (/undefined|NaN|null/.test(JSON.stringify(p.prompt))) fails.push(`${tag}: prompt 값 이상`);
      if (!Array.isArray(p.keyFields) || !p.keyFields.length) fails.push(`${tag}: keyFields`);
      inv(p, tag);
      keys.add(keyOf(p)); core.add(coreOf(p)); answers[p.answer] = (answers[p.answer] || 0) + 1; ok++;
    }
    rows.push(`${id}L${lv.id} ${lv.label.ko.padEnd(20)} 시드 ${ok}/${N}  서로 다른 문항 ${keys.size} (보기 제외 ${core.size})  답 종류 ${Object.keys(answers).length}`);
  }
}
console.log(rows.join('\n'));
const uniq = [...new Set(fails)];
console.log(`\n실패 ${uniq.length}건`);
uniq.slice(0, 40).forEach(f => console.log('  ' + f));
process.exit(uniq.length ? 1 : 0);
