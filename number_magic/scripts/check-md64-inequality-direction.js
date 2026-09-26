#!/usr/bin/env node
'use strict';

/* MD64 L4 — 부등식의 양변 변형 뒤 부등호 방향을 학생이 직접 고르는 유형.
 * Source contract: 디딤돌수학 개념연산 2-1A, 인쇄 120쪽(비공개 원본은 읽기만 함).
 * Result contract: single-value choice, ①=< / ②=>.
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
load('engine/threads/mid9.js');
load('data/threads.js');
load('data/middle-pacing.js');
load('data/wordable.js');
load('data/courses.js');
load('app/exam.js');

const gen = w.NM_TGEN.md64_linearInequality;
const params = w.NM_THREADS.MD64.levels.find(level => level.id === 4).params;
const flip = rel => rel === '<' ? '>' : '<';
const relation = (left, right) => left < right ? '<' : left > right ? '>' : '=';
function visibleKey(p) { return p.tex.replace(/\s+/g, ' ').trim(); }

function independentValues(meta) {
  const a = meta.base === '<' ? -3 : 5;
  const b = meta.base === '<' ? 5 : -3;
  switch (meta.kind) {
    case 'add': return [a + meta.operand, b + meta.operand];
    case 'subtract': return [a - meta.operand, b - meta.operand];
    case 'multiplyPositive': return [a * meta.operand, b * meta.operand];
    case 'dividePositive': return [a / meta.operand, b / meta.operand];
    case 'multiplyNegative': return [a * -meta.operand, b * -meta.operand];
    case 'divideNegative': return [a / -meta.operand, b / -meta.operand];
    default: throw new Error('unknown transform ' + meta.kind);
  }
}

function validate(p) {
  const m = p.inequalityDirection;
  assert(m && ['<','>'].includes(m.base));
  assert(['<','>'].includes(m.result));
  assert(Number.isInteger(m.operand) && m.operand >= 2 && m.operand <= 9);
  const [left, right] = independentValues(m);
  const expected = relation(left, right);
  assert.equal(m.result, expected, 'independent numeric comparison disagrees');
  assert.equal(m.result, m.scale < 0 ? flip(m.base) : m.base, 'sign rule disagrees');
  assert.equal(p.answer, expected === '<' ? 1 : 2);
  assert.equal(p.answerNote.ko, expected);
  assert.equal(p.answerType, 'number');
  assert.equal(p.widget, 'numpad');
  assert(p.tex.includes('\\bigcirc') && p.tex.includes('①') && p.tex.includes('②'));
  assert(p.solution[p.solution.length - 1].tex.includes(expected));
}

// Exact learner-visible pool: 2 base directions x 6 transforms x 8 operands.
const rng = w.NM_RNG.mulberry32(w.NM_RNG.hashSeed('md64-direction-full-pool'));
const pool = new Map();
for (let i = 0; i < 200000 && pool.size < 96; i++) {
  const p = gen(params, rng);
  validate(p);
  const key = visibleKey(p);
  if (pool.has(key)) assert.equal(pool.get(key), p.answer, 'same visible question changed answer');
  else pool.set(key, p.answer);
}
assert.equal(pool.size, 96, 'finite pool must expose all 96 mathematical variants');

const coverage = new Set();
for (let seed = 0; seed < 10000; seed++) {
  const p = gen(params, w.NM_RNG.mulberry32(seed));
  validate(p);
  coverage.add(`${p.inequalityDirection.base}|${p.inequalityDirection.kind}|${p.inequalityDirection.operand}`);
}
assert.equal(coverage.size, 96, 'base/direction/operand coverage incomplete');

// Same seed must reproduce the same visible problem and answer.
for (let seed = 0; seed < 1000; seed++) {
  const a = gen(params, w.NM_RNG.mulberry32(seed));
  const b = gen(params, w.NM_RNG.mulberry32(seed));
  assert.equal(visibleKey(a), visibleKey(b));
  assert.equal(a.answer, b.answer);
}

// Real worksheet path: 12 practice + 4 teaching reserve can be selected without reuse.
const first = w.NM_EXAM.buildProblems('MD64', 4, 16, w.NM_RNG.hashSeed('md64-session'));
assert.equal(new Set(first.map(w.NM_EXAM.problemKey)).size, 16);
first.forEach(validate);
const replay = w.NM_EXAM.buildProblems('MD64', 4, 16, w.NM_RNG.hashSeed('md64-session'));
assert.deepEqual(first.map(visibleKey), replay.map(visibleKey));
assert.deepEqual(first.map(p => p.answer), replay.map(p => p.answer));

// Cross-round reservation consumes the exact pool without reuse, then fails closed.
const reserved = new Set();
for (const [i, count] of [40, 40, 16].entries()) {
  const batch = w.NM_EXAM.buildProblems('MD64', 4, count, w.NM_RNG.hashSeed('md64-capacity-' + i), null, null, reserved);
  batch.forEach(validate);
}
assert.equal(reserved.size, 96);
assert.throws(
  () => w.NM_EXAM.buildProblems('MD64', 4, 1, w.NM_RNG.hashSeed('md64-over-capacity'), null, null, reserved),
  err => err && err.code === 'NM_UNIQUE_POOL_EXHAUSTED'
);

// 2026-09-25 통합: 정규 과정 C33 이 MD64 L2·L3·L4 를 교과로 싣고(각 12문항 이상), 옛 번호 M2-S06 은 L4 가 실린 회차로 이어진다.
const c33 = w.NM_COURSES.C33.sessions.filter(s => !s.test);
for (const lv of [2, 3, 4]) assert(c33.some(s => s.school.some(d => d.t === 'MD64' && d.lv === lv && d.count >= 12)), 'C33 must schedule MD64 L' + lv);
const session = w.NM_MIDDLE_PACING.getSession(2, 'M2-S06');
assert(session && session.blocks.some(b => b.t === 'MD64' && b.lv === 4), 'legacy M2-S06 must open the session with MD64 L4');

const learnerFit = {
  id:'learner-fit', learner_stage:'중2 1학기 일차부등식',
  language:'부등호 방향을 고르고 ① 또는 ②로 응답',
  representations:'a와 b의 대소관계, 양변의 같은 연산, <와 >',
  prerequisites:'정수의 사칙계산과 수의 대소관계',
  reasoning_load:'연산의 부호를 판별한 뒤 유지 또는 반전을 한 번 결정',
  response_mode:'숫자패드 단일 선택'
};
for (const key of ['language','representations','prerequisites','reasoning_load','response_mode']) assert(learnerFit[key]);

console.log(JSON.stringify({
  ok:true, poolCapacity:pool.size, coverage:coverage.size,
  worksheetUnique:first.length, exactCapacity:reserved.size,
  pacingQuestions:session.blocks.reduce((sum, block) => sum + block.n, 0), learnerFit
}, null, 2));
