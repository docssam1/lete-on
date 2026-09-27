#!/usr/bin/env node
'use strict';

/* MD13 polynomial ÷ monomial gate.
 * - independently reconstructs every dividend from divisor × quotient
 * - checks deterministic replay and the learner-visible expression
 * - exercises production no-repeat allocation at the intended 12/24/24 counts
 * Private textbook pages are not loaded or copied here; source locators live in
 * docs/middle-concepts-source-audit.md.
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
load('engine/threads/mid2.js');
load('data/threads.js');
load('data/middle-concepts.js');
load('app/exam.js');

function plain(v) { return JSON.parse(JSON.stringify(v)); }
function signature(p) {
  return JSON.stringify({ tex:p.tex, prompt:p.prompt, answer:p.answer });
}
function validate(p, label) {
  const m = p.algebra;
  assert(m && m.operation === 'poly-div-mono', `${label}: semantic algebra model missing`);
  assert.equal(m.dividend.length, m.quotient.length, `${label}: term count changed`);
  assert.deepEqual(plain(p.answer), plain(m.quotient.map(t => t.c)), `${label}: answer coefficients drifted`);

  const divisorCoeff = 'n' in m.divisor ? m.divisor.n / m.divisor.d : m.divisor.c;
  assert.notEqual(divisorCoeff, 0, `${label}: zero divisor`);
  for(let i = 0; i < m.quotient.length; i++) {
    const q = m.quotient[i], dividend = m.dividend[i];
    assert.equal(q.c * divisorCoeff, dividend.c, `${label}: coefficient does not divide exactly`);
    assert.equal(q.x + m.divisor.x, dividend.x, `${label}: x exponent mismatch`);
    assert.equal(q.y + m.divisor.y, dividend.y, `${label}: y exponent mismatch`);
    assert(Number.isInteger(q.c), `${label}: answer coefficient is not an integer`);
  }
  assert(!/x\^\{?-/.test(p.tex) && !/y\^\{?-/.test(p.tex), `${label}: negative exponent leaked into learner problem`);
  assert.equal((p.tex.match(/\\square/g) || []).length, p.answer.length, `${label}: blank/answer count mismatch`);
  assert.equal(p.negative, p.answer.some(n => n < 0), `${label}: minus-key contract mismatch`);
}

const cases = [
  { level:4, mode:'divideBinomial', count:12, minSampleCapacity:400 },
  { level:5, mode:'divideFraction', count:24, minSampleCapacity:700 },
  { level:6, mode:'divideTrinomial', count:24, minSampleCapacity:1000 }
];
let generated = 0;
for(const test of cases) {
  const seen = new Set();
  for(let seed = 0; seed < 12000; seed++) {
    const numericSeed = w.NM_RNG.hashSeed(`MD13/${test.level}/${seed}`);
    const p = w.NM_TGEN.md13_monoTimesPoly({mode:test.mode}, w.NM_RNG.mulberry32(numericSeed));
    validate(p, `MD13 L${test.level} seed ${seed}`);
    seen.add(signature(p));
    const replay = w.NM_TGEN.md13_monoTimesPoly({mode:test.mode}, w.NM_RNG.mulberry32(numericSeed));
    assert.equal(signature(replay), signature(p), `MD13 L${test.level}: deterministic replay changed`);
    generated++;
  }
  assert(seen.size >= test.minSampleCapacity,
    `MD13 L${test.level}: sampled learner-visible capacity too small (${seen.size})`);

  // Production path: one intended worksheet plus a worked example and three
  // guided items all share one exclusion set. Repeats must never be returned.
  for(let seed = 0; seed < 100; seed++) {
    const shared = new Set();
    const numericSeed = w.NM_RNG.hashSeed(`MD13/set/${test.level}/${seed}`);
    const practice = w.NM_EXAM.buildProblems('MD13', test.level, test.count, numericSeed, null, null, shared);
    const teaching = w.NM_EXAM.buildProblems('MD13', test.level, 4, numericSeed ^ 0x9e3779b9, null, null, shared);
    const all = practice.concat(teaching);
    assert.equal(all.length, test.count + 4);
    assert.equal(new Set(all.map(signature)).size, all.length, `MD13 L${test.level}: visible repeat in one worksheet`);
    assert.equal(new Set(all.map(w.NM_EXAM.problemKey)).size, all.length, `MD13 L${test.level}: production key repeated`);
  }
  console.log(`PASS MD13 L${test.level} ${test.mode}: ${seen.size.toLocaleString()} sampled variants; ${test.count}+4 no-repeat allocation.`);
}

const lesson = w.NM_MIDDLE_CONCEPTS.MD13;
assert(lesson && lesson.source === '2-1A:96,98-99');
assert(lesson.why.includes('모든 항') && lesson.steps.join(' ').includes('지수'));
const levels = w.NM_THREADS.MD13.levels;
assert.deepEqual(plain(levels.slice(-3).map(l => l.params.mode)), ['divideBinomial','divideFraction','divideTrinomial']);
console.log(`PASS MD13 polynomial division: ${generated.toLocaleString()} independently checked problems; learner-fit middle2-1, integer coefficient response, no negative exponents.`);
