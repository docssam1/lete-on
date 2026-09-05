#!/usr/bin/env node
'use strict';
/* ============================================================
   진단 사다리(bracketing) 시뮬레이터 — app/placement-core.js
   ------------------------------------------------------------
   나이(진입 칸) × 실제 실력(어느 칸까지 풀 수 있는가)의 모든 조합을 결정적
   오라클(칸 idx <= ability면 정답)로 돌려, nextRung/grade/boundary가
   ①최대 몇 문항 만에 멈추는지 ②경계 판정이 실제 실력과 어긋나는 경우가
   있는지를 센다. main.js는 DOM이 있어야 로드되므로(document.getElementById)
   여기서는 안 부른다 — 나이→과정 매핑은 main.js의 PLACEMENT_AGES와 같은
   값을 이 파일에 그대로 옮겨 적었다(바뀌면 같이 고칠 것).

   쓰는 법: node scripts/sim-placement.js
   최대 문항 수가 NM_PLACEMENT_CORE.MAX_Q를 넘거나 경계 오차가 하나라도
   있으면 exit 1.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
global.window = global;

for (const f of ['engine/rng.js', 'engine/generators.js']) {
  eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
}
fs.readdirSync(path.join(ROOT, 'engine/threads')).forEach(f => {
  eval(fs.readFileSync(path.join(ROOT, 'engine/threads', f), 'utf8'));
});
eval(fs.readFileSync(path.join(ROOT, 'data/curriculum.js'), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'data/threads.js'), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'data/courses.js'), 'utf8'));
fs.readdirSync(path.join(ROOT, 'data/units')).forEach(f => {
  if (f.endsWith('.js')) eval(fs.readFileSync(path.join(ROOT, 'data/units', f), 'utf8'));
});
eval(fs.readFileSync(path.join(ROOT, 'app/placement-core.js'), 'utf8'));

const CORE = window.NM_PLACEMENT_CORE;
const ladder = CORE.buildLadder();
console.log(`사다리 길이: ${ladder.length}칸 (수의 나라 4 + 과정 ${ladder.length - 4})`);

/* app/main.js PLACEMENT_AGES와 같은 나이→과정 매핑(§A2). pre는 나이의 진입 칸
   그대로 0번(수의 나라 첫 칸)을 쓴다. */
const AGE_COURSES = [
  ['pre', null],
  ['g1', 'C1'], ['g2', 'C11'], ['g3', 'C17'], ['adv', 'C26'],
  ['m1', 'C29'], ['m2', 'C32'], ['m3', 'C34'], ['hi', 'C36']
];
const ENTRIES = AGE_COURSES.map(([age, key]) => {
  const idx = key === null ? 0 : CORE.rungIndexOfCourse(ladder, key);
  if (idx < 0) { console.error(`FATAL: 과정 ${key}이 사다리에 없다(courseBuilt 아닌가?)`); process.exit(1); }
  return { age, idx };
});
console.log('나이별 진입 칸:', ENTRIES.map(e => `${e.age}=${e.idx}(${ladder[e.idx] ? ladder[e.idx].course : '?'})`).join('  '));

const N = ladder.length;
function run(entryIdx, ability) {
  const d = { lo: -1, hi: N, at: null, entry: entryIdx, asked: 0, correct: 0, ups: 0 };
  while (true) {
    const nxt = CORE.nextRung(d, N);
    if (nxt === null || d.asked >= CORE.MAX_Q) break;
    const ok = nxt <= ability;
    CORE.grade(d, nxt, ok, N);
  }
  return { asked: d.asked, b: CORE.boundary(d, N) };
}

let maxQ = 0, sumQ = 0, cnt = 0, wrong = 0;
const wrongCases = [];
for (const e of ENTRIES) {
  for (let ability = -1; ability <= N; ability++) {
    const r = run(e.idx, ability);
    maxQ = Math.max(maxQ, r.asked); sumQ += r.asked; cnt++;
    const trueB = Math.min(ability + 1, N);
    if (r.b !== trueB) { wrong++; wrongCases.push({ age: e.age, ability, trueB, got: r.b, asked: r.asked }); }
  }
}

console.log(`\n총 ${cnt}가지 조합 — 나이 ${ENTRIES.length}개 × 실력 단계 ${N + 2}개(칸 -1~${N})`);
console.log(`최대 문항 수: ${maxQ}  (한도 ${CORE.MAX_Q})`);
console.log(`평균 문항 수: ${(sumQ / cnt).toFixed(3)}`);
console.log(`경계 오차:   ${wrong}건`);
if (wrongCases.length) {
  console.log('\n오차 사례(최대 15건):');
  wrongCases.slice(0, 15).forEach(c =>
    console.log(`  나이=${c.age} 실력칸=${c.ability} 진짜경계=${c.trueB} 판정=${c.got} (${c.asked}문항)`));
}

const pass = maxQ <= CORE.MAX_Q && wrong === 0;
console.log(pass ? '\nPASS' : '\nFAIL');
process.exit(pass ? 0 : 1);
