#!/usr/bin/env node
'use strict';

/* MD19 L5 finite-pool regression.
 *
 * The concept example uses (sqrt(3)+sqrt(2))(sqrt(3)-sqrt(2)). Practice must
 * not repeat that exact visible problem. The remaining source-faithful pool is
 * every a>b pair from the squarefree integers 2..30: 18C2 - 1 = 152 items.
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
  getElementById: () => ({}),
  querySelector: () => null,
  querySelectorAll: () => [],
  head: { appendChild() {} },
  body: { appendChild() {} }
};
w.localStorage = {
  getItem: key => store.has(key) ? store.get(key) : null,
  setItem: (key, value) => store.set(key, String(value))
};
vm.createContext(w);

function load(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), w, { filename: file });
}

load('engine/rng.js');
load('engine/threads/mid3.js');
load('data/threads.js');
load('app/exam.js');

const gen = w.NM_TGEN.md19_expandFormula;
const params = w.NM_THREADS.MD19.levels.find(level => level.id === 5).params;
const exampleKey = '3:2';

function squarefree(n) {
  for (let p = 2; p * p <= n; p++) if (n % (p * p) === 0) return false;
  return true;
}

function pairFrom(problem) {
  const match = problem.tex.match(/^\(\\sqrt\{(\d+)\} \+ \\sqrt\{(\d+)\}\)\(\\sqrt\{(\d+)\} - \\sqrt\{(\d+)\}\) = \\square$/);
  assert(match, `Unexpected MD19 L5 tex: ${problem.tex}`);
  const [a, b, a2, b2] = match.slice(1).map(Number);
  assert.equal(a2, a, 'The conjugate must repeat the first radicand');
  assert.equal(b2, b, 'The conjugate must repeat the second radicand');
  return { a, b, key: `${a}:${b}` };
}

function verifyProblem(problem) {
  const { a, b, key } = pairFrom(problem);
  assert(a > b, 'Radicands must be normalized as a>b');
  assert(a >= 2 && a <= 30 && b >= 2 && b <= 30, 'Radicands left the source range 2..30');
  assert(squarefree(a) && squarefree(b), 'A radicand is not squarefree');
  assert.notEqual(key, exampleKey, 'The exact concept example leaked into practice');
  assert.equal(problem.answer, a - b, 'Answer must remain a-b');
  assert.equal(problem.solution[0].tex, `(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2 = ${a} - ${b}`);
  assert.equal(problem.solution[1].blank, a - b);
  return key;
}

/* Independently derive the source pool instead of trusting the generator. */
const values = [];
for (let n = 2; n <= 30; n++) if (squarefree(n)) values.push(n);
assert.equal(values.length, 18, 'Expected 18 squarefree integers in 2..30');
const allPairs = [];
for (let ai = 1; ai < values.length; ai++) {
  for (let bi = 0; bi < ai; bi++) allPairs.push(`${values[ai]}:${values[bi]}`);
}
assert.equal(allPairs.length, 153, 'Expected the full 18C2 source pool');
const expectedPractice = new Set(allPairs.filter(key => key !== exampleKey));
assert.equal(expectedPractice.size, 152, 'Expected 152 practice pairs after reserving the example');

/* A constant RNG value selects an exact array position through NM_RNG.pick.
 * Walking all 152 buckets proves that no pair is missing or added. */
const actualPractice = new Set();
for (let index = 0; index < expectedPractice.size; index++) {
  const problem = gen(params, () => (index + 0.5) / expectedPractice.size);
  actualPractice.add(verifyProblem(problem));
}
assert.deepEqual([...actualPractice].sort(), [...expectedPractice].sort(), 'MD19 L5 practice pool differs from all allowed pairs');

/* The app-level de-duplicator must be able to fill a full 24-question round,
 * replay it exactly, and keep the concept example outside the round. */
const seed = w.NM_RNG.hashSeed('md19-radical-pool-24');
const first = w.NM_EXAM.buildProblems('MD19', 5, 24, seed);
const replay = w.NM_EXAM.buildProblems('MD19', 5, 24, seed);
const firstKeys = first.map(verifyProblem);
const replayKeys = replay.map(verifyProblem);
assert.equal(new Set(firstKeys).size, 24, 'A 24-question MD19 L5 round repeated a visible pair');
assert.deepEqual(firstKeys, replayKeys, 'Seeded MD19 L5 generation is not deterministic');
assert.equal(new Set([...firstKeys, exampleKey]).size, 25, 'Practice and the concept example are not all distinct');

const capacitySeed = w.NM_RNG.hashSeed('md19-full-capacity');
const full = w.NM_EXAM.buildProblems('MD19', 5, expectedPractice.size, capacitySeed);
assert.equal(new Set(full.map(verifyProblem)).size, expectedPractice.size, 'The app cannot draw the complete finite practice pool');
assert.throws(
  () => w.NM_EXAM.buildProblems('MD19', 5, expectedPractice.size + 1, capacitySeed),
  error => error && error.code === 'NM_UNIQUE_POOL_EXHAUSTED',
  'Requesting more than the finite pool must fail closed'
);

/* Adding the pool must not consume RNG state or change any older MD19 mode. */
const oldModes = {
  twoFactors: { tex: '(x - 5)(x + 8) = x^2 + \\square x + \\square', answer: [3, -40] },
  square: { tex: '(x - 25)^2 = x^2 + \\square x + \\square', answer: [-50, 625] },
  diffSquares: { tex: '(x + 38)(x - 38) = x^2 - \\square', answer: 1444 },
  numApplication: { tex: '43 \\times 57 = \\square', answer: 2451 },
  rationalizeConjugate: { tex: '\\dfrac{1}{\\sqrt{17} - \\sqrt{15}} = \\dfrac{\\sqrt{\\square} + \\sqrt{\\square}}{\\square}', answer: [17, 15, 2] },
  formulaVariant: { tex: 'a + b = 3, \\quad ab = -40 \\quad\\Rightarrow\\quad a^2 + b^2 = \\square', answer: 89 },
  substitutionExpand: { tex: '(x+y - 5)(x+y + 8) = (x+y)^2 + \\square (x+y) + \\square', answer: [3, -40] }
};
for (const [mode, expected] of Object.entries(oldModes)) {
  const problem = gen({ mode }, w.NM_RNG.mulberry32(20260924));
  assert.equal(problem.tex, expected.tex, `${mode} seeded tex changed`);
  assert.equal(JSON.stringify(problem.answer), JSON.stringify(expected.answer), `${mode} seeded answer changed`);
}

console.log('PASS MD19 L5: 153 source pairs, all 152 practice pairs reachable, concept example excluded.');
console.log('PASS MD19 L5: 24 unique deterministic practice questions plus a distinct example.');
console.log('PASS MD19 L5: full capacity succeeds and 153 practice questions fail closed.');
console.log(`PASS MD19 regression: ${Object.keys(oldModes).length} non-target modes unchanged.`);
