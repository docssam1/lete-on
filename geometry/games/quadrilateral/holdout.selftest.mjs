import assert from "node:assert/strict";
import * as sut from "./core.js";

// Independent angle/length oracle. Production answer helpers are never expected values.
const labels = ["A", "B", "C", "D"];
const pairIds = ["ab-cd", "bc-da"];
const sorted = items => [...items].sort();
const close = (a, b) => Math.abs(a - b) < 1e-10;
const key = point => point.join(",");
const turn = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);

function hull(points) {
  const ordered = points.map(p => [...p]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const half = values => {
    const chain = [];
    for (const point of values) {
      while (chain.length > 1 && turn(chain.at(-2), chain.at(-1), point) <= 0) chain.pop();
      chain.push(point);
    }
    return chain.slice(0, -1);
  };
  return [...half(ordered), ...half([...ordered].reverse())];
}

function oracle(points) {
  const empty = { valid: false, parallelPairs: [], rightVertices: [], classes: [] };
  if (!Array.isArray(points) || points.length !== 4 || points.some(p => !Array.isArray(p) || p.length !== 2 || p.some(n => !Number.isFinite(n)))) return empty;
  if (new Set(points.map(key)).size !== 4) return empty;
  const boundary = hull(points);
  if (boundary.length !== 4) return empty;
  const indices = points.map(p => boundary.findIndex(q => key(q) === key(p)));
  const step = (indices[1] - indices[0] + 4) % 4;
  if (![1, 3].includes(step) || indices.some((n, i) => i && (n - indices[i - 1] + 4) % 4 !== step)) return empty;
  const angles = points.map((p, i) => Math.atan2(points[(i + 1) % 4][1] - p[1], points[(i + 1) % 4][0] - p[0]));
  const lengths = points.map((p, i) => Math.hypot(points[(i + 1) % 4][0] - p[0], points[(i + 1) % 4][1] - p[1]));
  const parallelPairs = pairIds.filter((_, i) => close(Math.sin(angles[i] - angles[i + 2]), 0));
  const rightVertices = labels.filter((_, i) => close(Math.cos(angles[i] - angles[(i + 3) % 4]), 0));
  const equal = lengths.every(n => close(n, lengths[0]));
  const classes = [];
  if (parallelPairs.length) classes.push("trapezoid");
  if (parallelPairs.length === 2) classes.push("parallelogram");
  if (rightVertices.length === 4) classes.push("rectangle");
  if (equal) classes.push("rhombus");
  if (equal && rightVertices.length === 4) classes.push("square");
  return { valid: true, parallelPairs, rightVertices, classes };
}

const stats = { exhaustive5x5Orders: 0, validOrders: 0, bankProblems: 0, symmetryChecks: 0, selectionGrades: 0, completionGrades: 0, completionSolutions: 0, multiAnswerProblems: 0, malformedChecks: 0, failures: 0 };
function inspect(points) {
  const expected = oracle(points), actual = sut.properties(points);
  assert.equal(actual.valid, expected.valid, JSON.stringify(points));
  if (expected.valid) for (const prop of ["parallelPairs", "rightVertices", "classes"]) assert.deepEqual(sorted(actual[prop]), sorted(expected[prop]), `${prop}: ${JSON.stringify(points)}`);
  return expected;
}

// Every 4-point subset of a 5x5 grid, all boundary orders modulo cyclic relabeling.
const grid = Array.from({ length: 25 }, (_, i) => [i % 5, Math.floor(i / 5)]);
const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
for (let a = 0; a < 22; a++) for (let b = a + 1; b < 23; b++) for (let c = b + 1; c < 24; c++) for (let d = c + 1; d < 25; d++) {
  const tail = [grid[b], grid[c], grid[d]];
  for (const order of permutations) {
    if (inspect([grid[a], ...order.map(i => tail[i])]).valid) stats.validOrders++;
    stats.exhaustive5x5Orders++;
  }
}

const expectedIds = ["parallel", "right", "classify", "build"];
assert.deepEqual(sut.domains.map(d => d.id), expectedIds);
const bank = expectedIds.flatMap(id => {
  const problems = sut.problemsFor(id);
  assert.equal(problems.length, 20, id);
  return problems;
});
assert.equal(new Set(bank.map(p => p.id)).size, 80);
for (const p of bank) {
  assert.equal(p.size, 7, p.id);
  assert.ok(p.vertices.flat().every(n => Number.isInteger(n) && n >= 0 && n <= 6), p.id);
  const full = p.domain === "build" ? [...p.vertices, p.example] : p.vertices;
  assert.equal(inspect(full).valid, true, p.id);
  for (const reflect of [false, true]) for (let rotation = 0; rotation < 4; rotation++) {
    let transformed = full.map(([x, y]) => [reflect ? 6 - x : x, y]);
    for (let n = 0; n < rotation; n++) transformed = transformed.map(([x, y]) => [6 - y, x]);
    for (let shift = 0; shift < 4; shift++) {
      inspect([...transformed.slice(shift), ...transformed.slice(0, shift)]);
      stats.symmetryChecks++;
    }
  }
  if (p.domain === "build") {
    const expected = [];
    for (let y = 0; y <= 6; y++) for (let x = 0; x <= 6; x++) {
      const point = [x, y], shape = oracle([...p.vertices, point]);
      const correct = shape.valid && shape.classes.includes(p.target) && (p.extra !== "exactly-one-parallel" || shape.parallelPairs.length === 1);
      assert.equal(sut.grade(p, point).correct, correct, `${p.id}: ${point}`);
      if (correct) expected.push(point);
      stats.completionGrades++;
    }
    assert.ok(expected.length, p.id);
    assert.deepEqual(sorted(sut.answerFor(p).map(key)), sorted(expected.map(key)), p.id);
    assert.ok(expected.some(point => key(point) === key(p.example)), p.id);
    stats.completionSolutions += expected.length;
    if (expected.length > 1) stats.multiAnswerProblems++;
    for (const invalid of [null, [], [1], ["1", 2], [1, 2, 3], [NaN, 2], [Infinity, 0], [-1, 2], [7, 2], [1.5, 2]]) {
      assert.equal(sut.grade(p, invalid).correct, false, p.id);
      stats.malformedChecks++;
    }
  } else {
    const properties = oracle(full);
    const raw = p.domain === "parallel" ? properties.parallelPairs : p.domain === "right" ? properties.rightVertices : properties.classes;
    const expected = raw.length ? raw : ["none"];
    assert.deepEqual(sorted(sut.answerFor(p)), sorted(expected), p.id);
    const options = sut.optionLabels(p.domain, "ko").map(o => o.id);
    for (let mask = 0; mask < 2 ** options.length; mask++) {
      const response = options.filter((_, i) => mask & (1 << i));
      const correct = JSON.stringify(sorted(response)) === JSON.stringify(sorted(expected));
      assert.equal(sut.grade(p, response).correct, correct, `${p.id}: ${response}`);
      stats.selectionGrades++;
    }
    for (const invalid of [null, "none", ["unknown"], [expected[0], expected[0]], ["none", options[0]], [0], {}]) {
      assert.equal(sut.grade(p, invalid).correct, false, p.id);
      stats.malformedChecks++;
    }
  }
  for (const lang of ["ko", "en", "zh", "ja"]) for (const text of [sut.promptFor(p, lang), sut.hintFor(p, lang), sut.solutionFor(p, lang)]) {
    assert.equal(typeof text, "string");
    assert.ok(text.length > 5 && !/undefined|NaN/.test(text), `${p.id}/${lang}`);
  }
  stats.bankProblems++;
}
assert.equal(stats.exhaustive5x5Orders, 75900);
assert.ok(stats.multiAnswerProblems > 0);
console.log(JSON.stringify({ ...stats, learner_stage: "초등 도형 · 사각형의 성질과 분류", scope: "Independent mathematics and answer contract; UI and print are separate gates." }, null, 2));
