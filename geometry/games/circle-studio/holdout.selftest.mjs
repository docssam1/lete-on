import assert from 'node:assert/strict';
import { domains, learner_stage, problemsFor, answerFor, grade, segmentKind, promptPartsFor, hintFor, solutionFor } from './core.js';

const stage = '초등 도형 · 원의 중심, 반지름, 지름과 원 그리기';
assert.equal(learner_stage, stage);
assert.deepEqual(domains.map(d => d.id), ['center', 'parts', 'measure', 'draw']);
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const near = (a, b) => Math.abs(a - b) < 1e-10;
function independentKind(s, o, r) {
  const a = distance(s.start, o), b = distance(s.end, o), length = distance(s.start, s.end);
  if (near(length, 0)) return 'other';
  if ((near(a, 0) && near(b, r)) || (near(b, 0) && near(a, r))) return 'radius';
  if (near(a, r) && near(b, r) && near(length, r * 2)) return 'diameter';
  return 'other';
}
let segmentCases = 0, centerGrades = 0, constructionGrades = 0, selectionGrades = 0, numericGrades = 0, localeChecks = 0;
const points = [];
for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) points.push([x, y]);
for (const o of [[0, 0], [1, -1], [-1, 1]]) for (let r = 1; r <= 5; r++) {
  for (let a = 0; a < points.length; a++) for (let b = a; b < points.length; b++) {
    const s = { id: 'A', start: points[a], end: points[b] };
    assert.equal(segmentKind(s, o, r), independentKind(s, o, r), JSON.stringify({ s, o, r }));
    segmentCases++;
  }
}
const all = domains.flatMap(d => problemsFor(d.id));
assert.equal(all.length, 80);
assert.equal(new Set(all.map(p => p.id)).size, 80);
const slotAnswers = { radius: [0, 0, 0, 0], diameter: [0, 0, 0, 0] };
for (const d of domains) {
  const bank = problemsFor(d.id);
  assert.equal(bank.length, 20);
  assert.ok(Object.isFrozen(bank));
  const tuples = new Set();
  for (const [index, p] of bank.entries()) {
    assert.ok(Object.isFrozen(p));
    assert.equal(p.index, index);
    assert.equal(p.id, `circle-${d.id}-${String(index + 1).padStart(2, '0')}`);
    assert.equal(p.size, 7);
    if (d.id === 'center' || d.id === 'draw') {
      assert.ok(Number.isInteger(p.radius) && p.radius >= 1 && p.radius <= 3);
      for (const v of p.center) assert.ok(Number.isInteger(v) && v - p.radius >= 0 && v + p.radius <= 6);
      tuples.add(JSON.stringify([p.center, p.radius]));
      let successes = 0;
      for (let x = 0; x < 7; x++) for (let y = 0; y < 7; y++) {
        const equal = near(distance([x, y], p.center), 0);
        if (d.id === 'center') {
          const result = grade(p, [x, y]); assert.equal(result.valid, true); assert.equal(result.correct, equal); centerGrades++;
          successes += +result.correct;
        } else for (let radius = 1; radius <= 3; radius++) {
          const result = grade(p, { center: [x, y], radius });
          assert.equal(result.correct, equal && radius === p.radius); constructionGrades++; successes += +result.correct;
        }
      }
      assert.equal(successes, 1);
      assert.deepEqual(answerFor(p), d.id === 'center' ? p.center : { center: p.center, radius: p.radius });
    } else if (d.id === 'parts') {
      assert.deepEqual(p.segments.map(s => s.id), ['A', 'B', 'C', 'D']);
      const expected = p.segments.filter(s => independentKind(s, p.center, p.radius) === p.target).map(s => s.id);
      assert.ok(expected.length === 1 || expected.length === 2);
      assert.deepEqual([...answerFor(p)].sort(), expected.sort());
      expected.forEach(id => slotAnswers[p.target]['ABCD'.indexOf(id)]++);
      for (let mask = 1; mask < 16; mask++) {
        const response = ['A', 'B', 'C', 'D'].filter((_, i) => mask & (1 << i));
        const result = grade(p, response);
        assert.equal(result.valid, true); assert.equal(result.correct, response.join() === expected.join()); selectionGrades++;
        assert.deepEqual(grade(p, [...response].reverse()), result);
      }
      for (const bad of [[], ['E'], ['A', 'A'], ['A', 'none'], 'A', null]) assert.equal(grade(p, bad).valid, false);
    } else {
      assert.ok(Number.isInteger(p.radius) && p.radius >= 1 && p.radius <= 10);
      const expected = p.given === 'radius' ? p.radius + p.radius : (p.radius * 2) / 2;
      assert.equal(answerFor(p), expected);
      for (let n = 0; n <= 25; n += .5) {
        assert.equal(grade(p, n).correct, n === expected); numericGrades++;
      }
      for (const bad of ['', String(expected), NaN, Infinity, null, true, [], {}]) assert.equal(grade(p, bad).valid, false);
    }
    for (const lang of ['ko', 'en', 'zh', 'ja']) {
      const parts = promptPartsFor(p, lang);
      assert.ok(parts.question.length > 8); assert.ok(Array.isArray(parts.conditions));
      for (const s of [parts.question, ...parts.conditions, hintFor(p, lang), solutionFor(p, lang)]) {
        assert.equal(typeof s, 'string'); assert.ok(s.length > 0); assert.ok(!/undefined|NaN|\[object Object\]/.test(s));
      }
      localeChecks++;
    }
  }
  if (d.id === 'center' || d.id === 'draw') assert.equal(tuples.size, 20);
}
for (const totals of Object.values(slotAnswers)) { assert.ok(totals.every(n => n > 0)); assert.ok(Math.max(...totals) - Math.min(...totals) <= 2); }
console.log(JSON.stringify({ passed: true, segmentCases, centerGrades, constructionGrades, selectionGrades, numericGrades, localeChecks, slotAnswers, learner_stage: stage,
  'learner-fit': { language: 'Four complete localized questions/hints/solutions', representations: 'Exact radius and diameter definitions; true circles with integer grid centers', prerequisites: 'Grid points, cm, doubling and halving whole numbers', 'reasoning-load': 'Four separate property and construction domains', 'response-mode': 'Center point, complete set, numeric length, unique constructed circle' },
  scope: 'Independent mathematical checks; rendered and instructional states require separate verification' }, null, 2));
