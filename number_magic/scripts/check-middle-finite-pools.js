#!/usr/bin/env node
'use strict';

/* Exact finite-pool guard for the middle-school pacing types that previously
 * had fewer learner-visible variants than one assigned set plus its example.
 * This deliberately keys only visible/math data; hidden IDs cannot add capacity.
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
load('app/exam.js');

function plain(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]));
  }
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
}
function visibleSignature(p) {
  const fields = ['tex','word','wordAsk','wordUnit','choices','prompt','graph','answer'];
  return JSON.stringify(stable(Object.fromEntries(fields.filter(key => p[key] !== undefined).map(key => [key, p[key]]))));
}
function range(lo, hi) { return Array.from({ length:hi - lo + 1 }, (_, i) => lo + i); }
function signedRange(lo, hi) { return range(lo, hi).flatMap(n => [n, -n]); }
function setEqual(actual, expected, label) {
  assert.deepEqual([...actual].sort((a,b) => String(a).localeCompare(String(b))),
    [...expected].sort((a,b) => String(a).localeCompare(String(b))), label);
}
function inGraph(graph, x, y) {
  return x >= graph.xr[0] && x <= graph.xr[1] && y >= graph.yr[0] && y <= graph.yr[1];
}

const cases = [
  {
    label:'MD69 L1 directGraph', thread:'MD69', level:1, gen:'md69_proportionGraph',
    params:{mode:'directGraph'}, pacing:12, capacity:16,
    expected:new Set(signedRange(1,8).map(String)),
    project:p => String(p.answer),
    validate(p) {
      const [x,y] = plain(p.graph.pts[0]);
      assert.equal(p.graph.kind, 'line');
      assert.equal(p.graph.m, p.answer);
      assert.equal(y, p.answer * x);
      assert(inGraph(p.graph, x, y), 'MD69 direct marked point escaped the graph grid');
      assert(Number.isInteger(x) && Number.isInteger(y), 'MD69 direct marked point must stay on integer ticks');
    }
  },
  {
    label:'MD69 L2 inverseGraph', thread:'MD69', level:2, gen:'md69_proportionGraph',
    params:{mode:'inverseGraph'}, pacing:12, capacity:16,
    expected:new Set(signedRange(1,8).map(String)),
    project:p => String(p.answer),
    validate(p) {
      const [x,y] = plain(p.graph.pts[0]);
      assert.equal(p.graph.kind, 'hyperbola');
      assert.equal(p.graph.k, p.answer);
      assert.equal(x * y, p.answer);
      assert(inGraph(p.graph, x, y), 'MD69 marked point escaped the graph grid');
      assert(Number.isInteger(x) && Number.isInteger(y), 'MD69 marked point must stay on integer ticks');
    }
  },
  {
    label:'MD77 L1 consecutive application', thread:'MD77', level:1, gen:'md77_quadApply',
    params:{mode:'consecutive'}, pacing:24, capacity:26,
    expected:new Set(range(4,29).map(String)),
    project:p => String(p.answer),
    validate(p) {
      const n = p.answer, product = n * (n + 1);
      assert(Number.isInteger(n) && n >= 4 && n <= 29);
      assert(p.word.ko.includes(String(product)), 'MD77 story product does not match its answer');
      assert(p.word.en.includes(String(product)) && p.word.zh.includes(String(product)));
      assert(p.solution[0].tex.includes(String(product)), 'MD77 equation does not match its story');
    }
  },
  {
    label:'MD77 L3 projectile application', thread:'MD77', level:3, gen:'md77_quadApply',
    params:{mode:'projectile'}, pacing:12, capacity:19,
    expected:new Set(range(2,20).map(String)),
    project:p => String(p.answer),
    validate(p) {
      const t=p.answer, v=5*t;
      assert(Number.isInteger(t) && t>=2 && t<=20);
      assert(p.word.ko.includes(String(v)) && p.word.en.includes(String(v)) && p.word.zh.includes(String(v)));
      assert.equal(v*t-5*t*t,0,'MD77 projectile answer is not a nonzero ground time');
    }
  },
  {
    label:'MD78 L3 readA', thread:'MD78', level:3, gen:'md78_quadBasic',
    params:{mode:'readA'}, pacing:12, capacity:16,
    expected:new Set(signedRange(1,8).map(String)),
    project:p => String(p.answer),
    validate(p) {
      const [x,y] = plain(p.graph.pts[0]);
      assert.equal(p.graph.kind, 'parabola');
      assert.equal(p.graph.a, p.answer);
      assert.equal(y, p.answer * x * x);
      assert(inGraph(p.graph, x, y), 'MD78 marked point escaped the graph grid');
      assert(Number.isInteger(x) && Number.isInteger(y), 'MD78 marked point must stay on integer ticks');
    }
  },
  {
    label:'MD82 L1 integer', thread:'MD82', level:1, gen:'md82_numberLine',
    params:{mode:'integer'}, pacing:20, teachReserve:4, capacity:25,
    expected:new Set(range(-12,12).map(String)),
    project:p => String(p.answer),
    validate(p) {
      assert.equal(p.graph.kind, 'numberline');
      assert.equal(p.graph.lo, -13); assert.equal(p.graph.hi, 13); assert.equal(p.graph.den, 1);
      assert.equal(p.graph.pts[0].v, p.answer);
      assert(Number.isInteger(p.answer) && p.answer >= -12 && p.answer <= 12);
      assert.equal((p.tex.match(/\\square/g)||[]).length,1);
    }
  },
  {
    label:'MD82 L2 rational', thread:'MD82', level:2, gen:'md82_numberLine',
    params:{mode:'rational'}, pacing:12, teachReserve:4, capacity:32,
    expected:new Set([2,4,5].flatMap(den=>range(-2*den+1,2*den-1)
      .filter(num=>num%den!==0).map(num=>`${num}|${den}`))),
    project:p => `${p.answer[0]}|${p.answer[1]}`,
    validate(p) {
      assert.equal(p.graph.kind,'numberline');
      assert.equal(p.graph.lo,-2);assert.equal(p.graph.hi,2);
      const [num,den]=plain(p.answer);
      assert([2,4,5].includes(den));assert.notEqual(num%den,0);
      assert.equal(p.graph.den,den);assert.equal(p.graph.pts[0].v,num/den);
      assert.equal((p.tex.match(/\\square/g)||[]).length,2);
    }
  },
  {
    label:'MD82 L3 absolute', thread:'MD82', level:3, gen:'md82_numberLine',
    params:{mode:'absolute'}, pacing:12, teachReserve:4, capacity:18,
    expected:new Set(range(1,6).flatMap(k => ['left','right','both'].map(ask => `${k}|${ask}`))),
    project(p) {
      const k = p.graph.pts[1].v;
      const ask = Array.isArray(p.answer) ? 'both' : p.answer < 0 ? 'left' : 'right';
      return `${k}|${ask}`;
    },
    validate(p) {
      assert.equal(p.graph.kind, 'numberline');
      assert.equal(p.graph.lo, -7); assert.equal(p.graph.hi, 7); assert.equal(p.graph.den, 1);
      const k = p.graph.pts[1].v;
      assert(k >= 1 && k <= 6 && Number.isInteger(k));
      assert.deepEqual(plain(p.graph.pts.map(point => point.v)), [-k,k]);
      if (Array.isArray(p.answer)) {
        assert.deepEqual(plain(p.answer), [-k,k]);
        assert.equal((p.tex.match(/\\square/g)||[]).length,2,'both answers need two visible boxes');
      } else {
        assert([-k,k].includes(p.answer));
        assert.equal((p.tex.match(/\\square/g)||[]).length,1);
      }
    }
  }
];

let checked = 0;
for (const test of cases) {
  const gen = w.NM_TGEN[test.gen];
  assert.equal(typeof gen, 'function', `missing ${test.gen}`);
  const byMathTask = new Map();
  const productionKeys = new Set();
  for (let seed = 0; seed < 65536; seed++) {
    const numericSeed = w.NM_RNG.hashSeed(`${test.thread}/${test.level}/${seed}`);
    const p = gen(test.params, w.NM_RNG.mulberry32(numericSeed));
    test.validate(p);
    const task = test.project(p), signature = visibleSignature(p);
    productionKeys.add(w.NM_EXAM.problemKey(p));
    if (byMathTask.has(task)) {
      assert.equal(byMathTask.get(task), signature, `${test.label}: hidden randomness changed one math task`);
    } else byMathTask.set(task, signature);

    const replay = gen(test.params, w.NM_RNG.mulberry32(numericSeed));
    assert.equal(visibleSignature(replay), signature, `${test.label}: seed replay changed`);
    checked++;
  }
  setEqual(new Set(byMathTask.keys()), test.expected, `${test.label}: finite domain changed`);
  assert.equal(new Set(byMathTask.values()).size, test.capacity,
    `${test.label}: learner-visible capacity is not exact`);
  assert.equal(productionKeys.size, test.capacity,
    `${test.label}: production identity disagrees with learner-visible capacity`);
  assert(test.capacity >= test.pacing + (test.teachReserve||1),
    `${test.label}: insufficient teaching reserve beyond the pacing count`);

  const fullSeed = w.NM_RNG.hashSeed(`full/${test.thread}/${test.level}`);
  const full = w.NM_EXAM.buildProblems(test.thread, test.level, test.capacity, fullSeed);
  assert.equal(new Set(full.map(visibleSignature)).size, test.capacity,
    `${test.label}: production allocator could not consume the exact pool once each`);
  let exhaustion;
  try { w.NM_EXAM.buildProblems(test.thread, test.level, test.capacity + 1, fullSeed); }
  catch (error) { exhaustion = error; }
  assert(exhaustion, `${test.label}: capacity+1 unexpectedly returned a repeated task`);
  assert.equal(exhaustion.code, 'NM_UNIQUE_POOL_EXHAUSTED',
    `${test.label}: capacity+1 did not fail closed with the standard error`);

  // Exercise the same production allocator: one full pacing set, then one
  // worked-example draw sharing its exclusion set. No duplicate may be returned.
  for (let seed = 0; seed < 20; seed++) {
    const numericSeed = w.NM_RNG.hashSeed(`pacing/${test.thread}/${test.level}/${seed}`);
    const reserve=test.teachReserve||1,seen = new Set();
    const set = w.NM_EXAM.buildProblems(test.thread, test.level, test.pacing, numericSeed, null, null, seen);
    const teaching = w.NM_EXAM.buildProblems(test.thread, test.level, reserve, numericSeed, null, null, seen);
    const all = [...set, ...teaching];
    assert.equal(all.length, test.pacing + reserve);
    assert.equal(seen.size, test.pacing + reserve);
    assert.equal(new Set(all.map(visibleSignature)).size, all.length,
      `${test.label}: pacing set reused a learner-visible task`);
  }
  console.log(`PASS ${test.label}: exact capacity ${test.capacity}; pacing ${test.pacing} + teaching reserve ${test.teachReserve||1}`);
}

console.log(`PASS middle finite pools: ${cases.length} types, ${checked.toLocaleString()} deterministic samples; exact capacities ${cases.map(test=>test.capacity).join('/')}.`);
