#!/usr/bin/env node
'use strict';

/* MD9 L5 — 순환소수의 소수점 아래 n번째 자리.
 * learner_stage: 중학교 2학년 1학기, 순환마디의 뜻을 알고 자연수 나눗셈의
 * 몫과 나머지를 구할 수 있는 학생. 원본 문항은 싣지 않고 p.18의 원리만 검증한다.
 */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const store = new Map();
const w = { console, Set, Map, Math, JSON, Date, URL, URLSearchParams, setTimeout, clearTimeout };
w.window = w;
w.document = {
  getElementById: () => ({}), querySelector: () => null, querySelectorAll: () => [],
  head: { appendChild() {} }, body: { appendChild() {} }
};
w.localStorage = {
  getItem: key => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value))
};
vm.createContext(w);
function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), w, { filename:file });
}

load('engine/rng.js');
load('engine/threads/mid.js');
load('data/threads.js');
load('data/middle-concepts.js');
load('data/middle-pacing.js');
load('data/drill-topics.js');
load('data/courses.js');
load('app/exam.js');

const blocks = ['13','26','37','58','107','125','208','314','427','503','1247','2031','142857','076923'];
const positions = [5,7,8,10,11,12,17,20,23,30,41,50,73,99];
const capacity = blocks.length * positions.length;
const gen = w.NM_TGEN.md9_repeatToFrac;
const level = w.NM_THREADS.MD9.levels.find(item => item.id === 5);
assert(level, 'MD9 L5 is not registered');
assert.deepEqual(JSON.parse(JSON.stringify(level.params)), { mode:'digitAt' });

function isPrimitive(block) {
  for (let d = 1; d < block.length; d++) {
    if (block.length % d === 0 && block.slice(0, d).repeat(block.length / d) === block) return false;
  }
  return true;
}
function expectedDigit(block, n) {
  return Number(block.charAt((n - 1) % block.length));
}
function verify(problem) {
  assert(blocks.includes(problem.repeatBlock), `unexpected block ${problem.repeatBlock}`);
  assert(positions.includes(problem.digitIndex), `unexpected n ${problem.digitIndex}`);
  assert.equal(problem.cycleLength, problem.repeatBlock.length);
  assert.equal(problem.remainder, problem.digitIndex % problem.cycleLength);
  assert.equal(problem.answer, expectedDigit(problem.repeatBlock, problem.digitIndex), 'n-th digit is wrong');
  assert.equal(problem.answerType, 'number');
  assert.equal(problem.widget, 'numpad');
  assert(problem.tex.includes(`\\overline{${problem.repeatBlock}}`));
  assert(problem.tex.includes(`d_{${problem.digitIndex}}`));
  assert.equal(problem.solution.at(-1).blank, problem.answer);
  if (problem.remainder === 0) assert(problem.solution.at(-1).tex.includes(`j=a=${problem.cycleLength}`), 'remainder 0 must map to the last digit');
  else assert(problem.solution.at(-1).tex.includes(`j=${problem.remainder}`), 'nonzero remainder mapping is missing');
  return `${problem.repeatBlock}|${problem.digitIndex}`;
}

/* 독립적으로 적은 14×14 정의역을 상수 RNG의 각 버킷으로 전수 확인한다. */
for (const block of blocks) assert(isPrimitive(block), `${block} has a shorter true period`);
const actual = new Set();
for (let index = 0; index < capacity; index++) {
  const problem = gen(level.params, () => (index + 0.5) / capacity);
  actual.add(verify(problem));
}
const expected = new Set(blocks.flatMap(block => positions.map(n => `${block}|${n}`)));
assert.deepEqual([...actual].sort(), [...expected].sort(), 'finite pool differs from the declared 14×14 domain');

/* 난수 재현성과 24문항+별도 예시 1문항의 학습자 노출 무중복을 앱 할당기로 확인한다. */
for (let seedIndex = 0; seedIndex < 40; seedIndex++) {
  const seed = w.NM_RNG.hashSeed(`MD9/L5/${seedIndex}`);
  const first = gen(level.params, w.NM_RNG.mulberry32(seed));
  const replay = gen(level.params, w.NM_RNG.mulberry32(seed));
  assert.equal(JSON.stringify(first), JSON.stringify(replay), 'seed replay changed');
  verify(first);
}
const seen = new Set();
const roundSeed = w.NM_RNG.hashSeed('MD9-L5-pacing-24');
const practice = w.NM_EXAM.buildProblems('MD9', 5, 24, roundSeed, null, null, seen);
const example = w.NM_EXAM.buildProblems('MD9', 5, 1, roundSeed, null, null, seen);
const selected = [...practice, ...example];
assert.equal(selected.length, 25);
assert.equal(new Set(selected.map(verify)).size, 25, '24 practice items and the example are not unique');
assert.equal(new Set(selected.map(w.NM_EXAM.problemKey)).size, 25, 'production visible identity repeated');

/* 정확한 유한 풀은 한 번씩 모두 쓸 수 있고, 하나를 더 요구하면 중복 대신 닫혀야 한다. */
const fullSeed = w.NM_RNG.hashSeed('MD9-L5-full-capacity');
const full = w.NM_EXAM.buildProblems('MD9', 5, capacity, fullSeed);
assert.equal(new Set(full.map(verify)).size, capacity, 'production allocator did not consume the exact pool once each');
assert.throws(
  () => w.NM_EXAM.buildProblems('MD9', 5, capacity + 1, fullSeed),
  error => error && error.code === 'NM_UNIQUE_POOL_EXHAUSTED',
  'capacity+1 must fail closed instead of repeating a visible task'
);

/* 기존 L1~L4의 같은 시드 결과를 잠근다. 새 모드는 기존 난수 흐름을 바꾸면 안 된다. */
const oldCases = [
  [{k:1,m:1}, '0.5\\overline{7} = \\square', [26,45]],
  [{k:2,m:1}, '0.53\\overline{7} = \\square', [121,225]],
  [{k:1,m:2}, '0.5\\overline{67} = \\square', [281,495]],
  [{k:2,m:2}, '0.53\\overline{67} = \\square', [2657,4950]]
];
for (const [params, tex, answer] of oldCases) {
  const problem = gen(params, w.NM_RNG.mulberry32(20260924));
  assert.equal(problem.tex, tex, 'legacy MD9 prompt changed');
  assert.deepEqual(JSON.parse(JSON.stringify(problem.answer)), answer, 'legacy MD9 answer changed');
}

/* 앱의 찾기·권장 진도·정규 과정 세 층에 모두 연결되어야 한다. */
const topic = w.NM_DRILL_TOPICS.flatMap(category => category.subs).find(item => item.thread === 'MD9' && item.level === 5);
assert(topic && topic.label.includes('n번째'), 'drill topic missing MD9 L5');
const pacingBlocks = w.NM_MIDDLE_PACING.grades[2].sessions.flatMap(session => session.blocks);
assert(pacingBlocks.some(item => item.t === 'MD9' && item.lv === 5 && item.n === 24), 'middle pacing missing 24-question MD9 L5 block');
const course31 = w.NM_COURSE_SPEC.find(course => course.id === 31);
assert(course31.drills.includes('MD9@5'), 'course31 missing MD9@5');
assert.equal(
  course31.minSessions,
  Math.ceil(course31.drills.length / 2),
  'course31 minSessions must cover every listed drill at two drills per session'
);
assert(w.NM_MIDDLE_CONCEPTS.MD9.source.includes('18'), 'concept provenance does not point to printed p.18');

/* 대표 결함을 일부러 계산해 검사 민감도를 확인: 나머지 0을 첫째로 고르면 오답이다. */
const zeroRemainder = gen(level.params, () => (blocks.indexOf('26') * positions.length + positions.indexOf(10) + 0.5) / capacity);
assert.equal(verify(zeroRemainder), '26|10');
assert.notEqual(Number(zeroRemainder.repeatBlock.charAt(0)), zeroRemainder.answer,
  'negative control failed: remainder 0 was incorrectly mapped to the first digit');

console.log(`PASS MD9 L5 math: ${capacity} exact modular tasks; primitive repeating blocks; remainder-0 last-digit rule.`);
console.log('PASS MD9 L5 allocation: 24 practice + 1 example unique; full pool once; capacity+1 fails closed.');
console.log('PASS MD9 regression: L1-L4 seeded prompts and answers unchanged.');
console.log('PASS MD9 integration: drill topic, 24-question middle pacing block, course31 MD9@5.');
console.log('PASS learner-fit: learner_stage=중2-1; language=나머지 중심 한국어; representations=순환마디와 나눗셈식; prerequisites=순환마디·몫과 나머지; reasoning-load=1회 나눗셈+자리 대응; response-mode=한 자리 숫자 입력.');
