import assert from "node:assert/strict";
import * as sut from "./core.js";

// Run: node geometry/games/perimeter/holdout.selftest.mjs
// Exhaustive: all 65,535 nonempty 4x4 subsets, each at one deterministic 6x6 placement.
// Not exhaustive: 6x6 subsets, all translations, or browser/print/persistence behavior.
// Production helpers are actual values only; every oracle below is independent.
const DOMAIN_IDS = ["boundary", "joined", "compare", "build"];
const SIDE = 4;
const BOARD = 6;
const pairs = cells => cells.map(({ x, y }) => [x, y]);
const pointKey = ([x, y]) => `${x},${y}`;

function perimeterOracle(points) {
  const occupied = new Set(points.map(pointKey));
  let length = 0;
  for (const [x, y] of points) {
    for (const next of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (!occupied.has(pointKey(next))) length++;
    }
  }
  return length;
}

function componentsOracle(mask, shaded) {
  let seen = 0, count = 0, enclosed = 0;
  for (let i = 0; i < SIDE * SIDE; i++) {
    if ((seen & (1 << i)) || Boolean(mask & (1 << i)) !== shaded) continue;
    count++;
    const queue = [i];
    seen |= 1 << i;
    let touchesRim = false;
    for (let k = 0; k < queue.length; k++) {
      const x = queue[k] % SIDE, y = Math.floor(queue[k] / SIDE);
      touchesRim ||= x === 0 || x === SIDE - 1 || y === 0 || y === SIDE - 1;
      for (const [a, b] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (a < 0 || a >= SIDE || b < 0 || b >= SIDE) continue;
        const j = b * SIDE + a;
        if ((seen & (1 << j)) || Boolean(mask & (1 << j)) !== shaded) continue;
        seen |= 1 << j;
        queue.push(j);
      }
    }
    if (!touchesRim) enclosed++;
  }
  return { count, enclosed };
}

// Axis swap and sign choices enumerate D4; normalized occupancy bits encode identity.
function signatureOracle(points) {
  let minimum;
  for (const swap of [false, true]) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      const transformed = points.map(([x, y]) => swap ? [sx * y, sy * x] : [sx * x, sy * y]);
      const minX = Math.min(...transformed.map(p => p[0]));
      const minY = Math.min(...transformed.map(p => p[1]));
      let bits = 0n;
      for (const [x, y] of transformed) bits |= 1n << BigInt((y - minY) * BOARD + x - minX);
      if (minimum === undefined || bits < minimum) minimum = bits;
    }
  }
  return minimum.toString();
}

function edgesOracle(points) {
  const occupied = new Set(points.map(pointKey)), edges = [];
  const add = (a, b) => edges.push([a, b]
    .sort((p, q) => p[0] - q[0] || p[1] - q[1]).map(pointKey).join(":"));
  for (const [x, y] of points) {
    if (!occupied.has(`${x - 1},${y}`)) add([x, y], [x, y + 1]);
    if (!occupied.has(`${x + 1},${y}`)) add([x + 1, y], [x + 1, y + 1]);
    if (!occupied.has(`${x},${y - 1}`)) add([x, y], [x + 1, y]);
    if (!occupied.has(`${x},${y + 1}`)) add([x, y + 1], [x + 1, y + 1]);
  }
  return edges.sort();
}

const summary = {
  subsets: 0, connectedHoleFree: 0, gradeChecks: 0,
  accepted: 0, rejected: 0, bankAnswerChecks: 0,
  figures: 0, edgeChecks: 0, sharedChecks: 0,
  negativeChecks: 0, nonExampleChecks: 0, failures: 0
};
const bank = DOMAIN_IDS.flatMap(domain => {
  const problems = sut.problemsFor(domain);
  assert.equal(problems.length, 20, `${domain}: expected 20 problems`);
  return problems;
});
const references = bank.filter(p => p.domain === "build").map(p => {
  const points = pairs(p.cells), target = perimeterOracle(points);
  assert.equal(p.size, BOARD, p.id);
  assert.equal(p.target, target, `${p.id}: independently calculated target`);
  return { p, target, signature: signatureOracle(points) };
});
assert.equal(references.length, 20);

const productionToOracle = new Map(), oracleToProduction = new Map();
function mismatch(context, check, expected, actual) {
  throw new Error(JSON.stringify({ ...context, check, expected, actual }));
}

for (let mask = 1; mask < 1 << (SIDE * SIDE); mask++) {
  const dx = mask % 3, dy = (mask >> 2) % 3;
  const points = [];
  for (let i = 0; i < SIDE * SIDE; i++) {
    if (mask & (1 << i)) points.push([i % SIDE + dx, Math.floor(i / SIDE) + dy]);
  }
  const context = { mask, points };
  const perimeter = perimeterOracle(points);
  const connected = componentsOracle(mask, true).count === 1;
  const holes = componentsOracle(mask, false).enclosed > 0;
  const signature = signatureOracle(points), productionKey = sut.shapeKey(points);
  for (const [check, expected, actual] of [
    ["perimeter", perimeter, sut.perimeterOf(points)],
    ["connectivity", connected, sut.connectedCells(points)],
    ["holes", holes, sut.hasHoles(points)]
  ]) {
    if (actual !== expected) mismatch(context, check, expected, actual);
  }
  if (productionToOracle.has(productionKey) && productionToOracle.get(productionKey) !== signature) {
    mismatch(context, "false-congruence", productionToOracle.get(productionKey), signature);
  }
  if (oracleToProduction.has(signature) && oracleToProduction.get(signature) !== productionKey) {
    mismatch(context, "missed-congruence", oracleToProduction.get(signature), productionKey);
  }
  productionToOracle.set(productionKey, signature);
  oracleToProduction.set(signature, productionKey);
  summary.subsets++;
  if (connected && !holes) summary.connectedHoleFree++;

  for (const { p, target, signature: reference } of references) {
    const correct = connected && !holes && perimeter === target && signature !== reference;
    const kind = !connected ? "disconnected" : holes ? "hole" : signature === reference
      ? "same-shape" : correct ? "correct" : "retry";
    const actual = sut.grade(p, points);
    summary.gradeChecks++;
    if (actual.valid !== true || actual.correct !== correct || actual.kind !== kind) {
      mismatch({ ...context, id: p.id }, "grade", { valid: true, correct, kind }, actual);
    }
    if (correct) summary.accepted++;
    else summary.rejected++;
  }
}

for (const p of bank) {
  const perimeter = perimeterOracle(pairs(p.cells));
  const other = p.other ? perimeterOracle(pairs(p.other)) : null;
  const expected = p.domain === "compare"
    ? perimeter < other ? "less" : perimeter > other ? "greater" : "equal"
    : perimeter;
  assert.equal(sut.answerFor(p), expected, `${p.id}: independent answer`);
  summary.bankAnswerChecks++;
  for (const cells of [p.cells, p.other, p.example, ...(p.groups || [])].filter(Boolean)) {
    const points = pairs(cells);
    assert.ok(points.flat().every(n => Number.isInteger(n) && n >= 0 && n < BOARD), p.id);
    assert.equal(new Set(points.map(pointKey)).size, points.length, p.id);
    const edges = sut.boundaryEdges(cells);
    assert.deepEqual(edges.map(edge => edge.id).sort(), edgesOracle(points), p.id);
    for (const { from, to } of edges) {
      assert.ok([...from, ...to].every(n => Number.isInteger(n) && n >= 0 && n <= BOARD), p.id);
      assert.equal(Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]), 1, p.id);
      summary.edgeChecks++;
    }
    summary.figures++;
  }
  if (p.groups) {
    const a = edgesOracle(pairs(p.groups[0])), b = new Set(edgesOracle(pairs(p.groups[1])));
    assert.deepEqual(sut.sharedEdges(p.groups).map(edge => edge.id).sort(), a.filter(edge => b.has(edge)), p.id);
    summary.sharedChecks++;
  }
}

const firstBuild = references.find(({ p }) => p.id === "perimeter-build-01").p;
for (const [points, kind] of [
  [[[5, 3], [5, 4], [5, 6]], "outside"],
  [[[Number.MAX_SAFE_INTEGER, 0]], "outside"],
  [[[0, -Number.MAX_SAFE_INTEGER]], "outside"],
  [[[5, 3], [5, 4], [5, 5], [5, 5]], "duplicate"]
]) {
  assert.deepEqual(sut.grade(firstBuild, points), { valid: true, correct: false, kind }, JSON.stringify(points));
  summary.negativeChecks++;
}
const alternate = [[5, 3], [5, 4], [5, 5]];
assert.equal(perimeterOracle(alternate), 8);
assert.equal(perimeterOracle(pairs(firstBuild.cells)), 8);
assert.notEqual(signatureOracle(alternate), signatureOracle(pairs(firstBuild.cells)));
assert.notEqual(signatureOracle(alternate), signatureOracle(pairs(firstBuild.example)));
assert.deepEqual(sut.grade(firstBuild, alternate), { valid: true, correct: true, kind: "correct" });
summary.nonExampleChecks++;

assert.equal(summary.subsets, 65535);
assert.equal(summary.gradeChecks, summary.subsets * references.length);
assert.equal(summary.accepted + summary.rejected, summary.gradeChecks);
console.log(JSON.stringify(summary, null, 2));
