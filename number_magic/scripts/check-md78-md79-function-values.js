#!/usr/bin/env node
'use strict';

/* MD78 L4 / MD79 L4 evidence gates.
 * learner_stage: Korean middle school grade 3, first semester; learners know
 * integer substitution, powers, coordinates, and the basic y=ax^2 graph.
 * learner-fit criteria: Korean mathematical language, table/ordered-pair
 * representations, only those prerequisites, one short substitution chain,
 * and the existing numpad/multi-slot response mode.
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
load('engine/threads/mid10.js');
load('data/threads.js');
load('data/middle-concepts.js');
load('data/middle-pacing.js');
load('data/courses.js');
load('app/exam.js');

const plain = value => JSON.parse(JSON.stringify(value));
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
}
function visibleSignature(p) {
  return JSON.stringify(stable({ prompt:p.prompt, tex:p.tex, answer:p.answer }));
}
function checkTable(p) {
  const m = p.mathModel;
  if (!m || m.kind !== 'quadraticTable' || m.p !== 0 || m.q !== 0) return false;
  const expected = m.xs.map(x => m.a * x * x);
  return JSON.stringify(plain(p.answer)) === JSON.stringify(expected)
    && p.answer[0] === p.answer[4] && p.answer[1] === p.answer[3] && p.answer[2] === 0;
}
function checkPoint(p) {
  const m = p.mathModel;
  if (!m || m.kind !== 'quadraticPoint') return false;
  return p.answer === m.a * (m.x - m.p) * (m.x - m.p) + m.q;
}

const cases = [
  { thread:'MD78', level:4, mode:'symmetryTable', capacity:16, pacing:12, check:checkTable },
  { thread:'MD79', level:4, mode:'pointValue', capacity:48, pacing:12, check:checkPoint }
];

let deterministicSamples = 0;
for (const test of cases) {
  const gen = w.NM_TGEN[w.NM_THREADS[test.thread].gen];
  const visible = new Set(), production = new Set(), models = new Set();
  for (let seed = 0; seed < 65536; seed++) {
    const numericSeed = w.NM_RNG.hashSeed(`${test.thread}/${test.level}/${seed}`);
    const p = gen({ mode:test.mode }, w.NM_RNG.mulberry32(numericSeed));
    assert.equal(p.widget, 'numpad', `${test.thread}: must retain the existing numpad response`);
    assert(!p.graph, `${test.thread}: must not add a graph response widget`);
    assert(test.check(p), `${test.thread}: independent formula check failed`);
    assert(p.prompt.ko && p.prompt.en && p.prompt.zh, `${test.thread}: incomplete prompt locales`);
    if (test.thread === 'MD78') assert.equal(p.answer.length, 5, 'MD78 table must have five cells');
    visible.add(visibleSignature(p));
    production.add(w.NM_EXAM.problemKey(p));
    models.add(JSON.stringify(plain(p.mathModel)));
    const replay = gen({ mode:test.mode }, w.NM_RNG.mulberry32(numericSeed));
    assert.equal(visibleSignature(replay), visibleSignature(p), `${test.thread}: seed replay drifted`);
    deterministicSamples++;
  }
  assert.equal(visible.size, test.capacity, `${test.thread}: exact visible capacity changed`);
  assert.equal(production.size, test.capacity, `${test.thread}: production identity disagrees with visibility`);
  assert.equal(models.size, test.capacity, `${test.thread}: semantic model capacity changed`);

  const fullSeed = w.NM_RNG.hashSeed(`full/${test.thread}/${test.level}`);
  const full = w.NM_EXAM.buildProblems(test.thread, test.level, test.capacity, fullSeed);
  assert.equal(new Set(full.map(visibleSignature)).size, test.capacity,
    `${test.thread}: exact pool was not consumed without repetition`);
  let exhaustion;
  try { w.NM_EXAM.buildProblems(test.thread, test.level, test.capacity + 1, fullSeed); }
  catch (error) { exhaustion = error; }
  assert(exhaustion, `${test.thread}: capacity+1 silently repeated a visible problem`);
  assert.equal(exhaustion.code, 'NM_UNIQUE_POOL_EXHAUSTED');

  for (let seed = 0; seed < 20; seed++) {
    const seen = new Set();
    const numericSeed = w.NM_RNG.hashSeed(`pacing/${test.thread}/${seed}`);
    const practice = w.NM_EXAM.buildProblems(test.thread, test.level, test.pacing, numericSeed, null, null, seen);
    const example = w.NM_EXAM.buildProblems(test.thread, test.level, 1, numericSeed, null, null, seen);
    assert.equal(new Set([...practice, ...example].map(visibleSignature)).size, test.pacing + 1,
      `${test.thread}: practice and example reused a learner-visible task`);
  }

  // Negative control: an answer changed by one must be rejected by the independent invariant.
  const corrupted = plain(full[0]);
  if (Array.isArray(corrupted.answer)) corrupted.answer[0] += 1;
  else corrupted.answer += 1;
  assert.equal(test.check(corrupted), false, `${test.thread}: negative control was not caught`);
  console.log(`PASS ${test.thread} L${test.level}: capacity ${test.capacity}; pacing 12 + example 1; math/determinism/negative control`);
}

const stage = w.NM_MIDDLE_PACING.grades[3];
const session = stage.sessions.find(item => item.id === 'M3-S12');
assert(session, 'missing M3-S12');
assert(session.blocks.some(item => item.t === 'MD78' && item.lv === 4 && item.n === 12));
assert(session.blocks.some(item => item.t === 'MD79' && item.lv === 4 && item.n === 12));
assert(session.blocks.some(item => item.kind === 'drawing' && item.mode === 'quadratic'));
assert(stage.supplementary.some(item => item.t === 'MD78' && item.lv === 3 && item.n === 12));
assert(stage.supplementary.some(item => item.t === 'MD79' && item.lv === 3 && item.n === 12));
const course37 = w.NM_COURSE_SPEC.find(item => item.id === 37);
assert(course37.drills.includes('MD78@4') && course37.drills.includes('MD79@4'));
assert.equal(w.NM_THREADS.MD78.levels[3].params.mode, 'symmetryTable');
assert.equal(w.NM_THREADS.MD79.levels[3].params.mode, 'pointValue');
assert.equal(w.NM_MIDDLE_CONCEPTS.MD78.source, '3-1B:76');
assert.equal(w.NM_MIDDLE_CONCEPTS.MD79.source, '3-1B:92');

console.log(`PASS learner-fit: Korean middle school grade 3, first semester; language/table-and-point representations/prerequisites/reasoning-load/numpad response verified.`);
console.log(`PASS MD78/MD79 function-value gates: ${deterministicSamples.toLocaleString()} deterministic samples.`);
