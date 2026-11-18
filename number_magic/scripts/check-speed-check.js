#!/usr/bin/env node
/* 1분 계산 속도(app/speed-check.js) 검사기 — 2026-11-18
   1. 과정 번호 → 묶음(0~1 10까지 더하기 · 2~3 한 자리 덧뺄 · 4~7 구구 · 8~28 구구·나눗셈 · 29~37 정수 · 38~ 없음)
   2. 묶음마다 문제 300개: 답이 식과 맞다 · 바로 앞과 같은 문제 없음 · 범위(10까지 합, 구구 2~9단, 나눗셈은 나누어떨어짐, 정수 −9~9 · 0 없음)
   3. 같은 시드 = 같은 문제(다시 만들 수 있다)
   4. 요약: 맞힌 개수·정확도·느린 셈·틀린 셈, 음수 답은 −/- 둘 다 맞음
   실패하면 exit 1. */
'use strict';
const assert = require('node:assert/strict');
const S = require('../app/speed-check.js');

const want = { C0: 'add10', C1: 'add10', C2: 'addsub20', C3: 'addsub20', C4: 'times', C7: 'times', C8: 'muldiv', C28: 'muldiv', C29: 'integer', C37: 'integer', C38: null, C73: null };
for(const [c, s] of Object.entries(want)) assert.equal(S.setFor(c), s, c);

const val = q => {
  const m = q.replace(/\(−(\d+)\)/g, '(-$1)').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
  return Function('return (' + m + ')')();
};
for(const set of Object.keys(S.SETS)){
  const list = S.make(set, 'check', 300);
  assert.equal(list.length, 300);
  list.forEach((p, i) => {
    assert.equal(val(p.q), p.a, set + ' 답이 틀림: ' + p.q + ' = ' + p.a);
    assert.ok(Number.isInteger(p.a), set + ' 정수 답: ' + p.q);
    if(i) assert.notEqual(list[i - 1].q, p.q, set + ' 같은 문제 연속');
    const nums = (p.q.match(/\d+/g) || []).map(Number);
    if(set === 'add10') assert.ok(p.a <= 10 && nums.every(n => n >= 1), p.q);
    if(set === 'addsub20') assert.ok(p.a >= 1 && p.a <= 18, p.q);
    if(set === 'times') assert.ok(nums.every(n => n >= 2 && n <= 9), p.q);
    if(set === 'muldiv') assert.ok(p.a >= 2 && p.a <= 81 && (p.q.includes('÷') ? nums[1] >= 2 && nums[1] <= 9 : true), p.q);
    if(set === 'integer') assert.ok(nums.every(n => n >= 1 && n <= 9), p.q);
  });
  assert.deepEqual(S.make(set, 'same', 20), S.make(set, 'same', 20), set + ' 같은 시드');
  assert.ok(new Set(list.map(p => p.q)).size >= 20, set + ' 문제가 너무 적게 섞임');
}
assert.equal(S.answerText(-8), '−8');
const r = S.summarize('integer', [
  { q: '(−5) − 3', a: -8, v: '−8', ms: 1200 },
  { q: '4 + (−9)', a: -5, v: '-5', ms: 900 },
  { q: '2 − 7', a: -5, v: '5', ms: 3000 }
], 60);
assert.equal(r.correct, 2); assert.equal(r.attempted, 3); assert.equal(r.accuracy, 67); assert.equal(r.perMin, 2);
assert.equal(r.wrong.length, 1); assert.equal(r.slow[0].q, '(−5) − 3');
const pace = S.itemPace([{ ok: true, sec: 4, band: 'current' }, { ok: true, sec: 8, band: 'current' }, { ok: false, sec: 1, band: 'current' }, { ok: true, sec: 3, band: 'previous' }]);
assert.deepEqual(pace, { current: { n: 2, median: 4 }, previous: { n: 1, median: 3 } });
console.log('SPEED_CHECK_OK sets=' + Object.keys(S.SETS).length);
