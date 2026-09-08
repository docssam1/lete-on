import assert from "node:assert/strict";
import {
  domains, problemsFor, perimeterOf, boundaryEdges, sharedEdges, connectedCells,
  hasHoles, shapeKey, answerFor, grade, promptFor, hintFor, solutionFor
} from "./core.js";

const languages = ["ko", "en", "zh", "ja"];
const all = domains.flatMap(domain => problemsFor(domain.id));
const coords = cells => cells.map(({ x, y }) => [x, y]);
const objects = points => points.map(([x, y]) => ({ x, y }));
const pointKey = ([x, y]) => `${x},${y}`;
const sortedKey = points => points.map(pointKey).sort().join(";");
const summary = {
  problems: all.length, correctExamples: 0, figureChecks: 0, boundaryEdgeChecks: 0,
  joinedChecks: 0, comparisons: { less: 0, equal: 0, greater: 0 },
  numericChecks: 0, buildChecks: 0, acceptedNonExampleBuilds: 0,
  congruentRejections: 0, exhaustiveFigures: 0, randomFigures: 0, localeChecks: 0
};

// This oracle counts each adjacent cell pair once: P = 4N - 2E.
function independentPerimeter(points) {
  let adjacent = 0;
  for (let i = 0; i < points.length; i++) for (let j = 0; j < i; j++) {
    if (Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]) === 1) adjacent++;
  }
  return 4 * points.length - 2 * adjacent;
}

// Union-find is separate from production's reachability search.
function independentConnected(points) {
  if (!points.length) return false;
  const parents = points.map((_, i) => i);
  const root = i => parents[i] === i ? i : (parents[i] = root(parents[i]));
  points.forEach(([x, y], i) => points.slice(0, i).forEach(([px, py], j) => {
    if (Math.abs(x - px) + Math.abs(y - py) === 1) parents[root(i)] = root(j);
  }));
  return new Set(parents.map((_, i) => root(i))).size === 1;
}

// Flood each unshaded component of an 8x8 board. A component with no rim cell is a hole.
function independentHoles(points) {
  const grid = Array.from({ length: 8 }, () => Array(8).fill(false));
  for (const [x, y] of points) grid[y + 1][x + 1] = true;
  const visited = Array.from({ length: 8 }, () => Array(8).fill(false));
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    if (grid[y][x] || visited[y][x]) continue;
    const stack = [[x, y]];
    let touchesRim = false;
    visited[y][x] = true;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx === 0 || cy === 0 || cx === 7 || cy === 7) touchesRim = true;
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || nx > 7 || ny < 0 || ny > 7 || grid[ny][nx] || visited[ny][nx]) continue;
        visited[ny][nx] = true;
        stack.push([nx, ny]);
      }
    }
    if (!touchesRim) return true;
  }
  return false;
}

const transforms = [
  [1, 0, 0, 1], [0, -1, 1, 0], [-1, 0, 0, -1], [0, 1, -1, 0],
  [-1, 0, 0, 1], [0, 1, 1, 0], [1, 0, 0, -1], [0, -1, -1, 0]
];
function normalized(points) {
  const minX = Math.min(...points.map(point => point[0]));
  const minY = Math.min(...points.map(point => point[1]));
  return points.map(([x, y]) => [x - minX, y - minY]);
}
function orientations(points) {
  return transforms.map(([a, b, c, d]) => normalized(points.map(([x, y]) => [a * x + b * y, c * x + d * y])));
}
function independentShapeKey(points) {
  return points.length ? orientations(points).map(sortedKey).sort()[0] : "";
}

function edgeId(a, b) {
  const endpoints = [a, b].sort((u, v) => u[0] - v[0] || u[1] - v[1]);
  return endpoints.map(pointKey).join(":");
}
function independentEdges(points) {
  const occupied = new Set(points.map(pointKey)), edges = [];
  for (const [x, y] of points) {
    if (!occupied.has(`${x},${y - 1}`)) edges.push(edgeId([x, y], [x + 1, y]));
    if (!occupied.has(`${x},${y + 1}`)) edges.push(edgeId([x, y + 1], [x + 1, y + 1]));
    if (!occupied.has(`${x - 1},${y}`)) edges.push(edgeId([x, y], [x, y + 1]));
    if (!occupied.has(`${x + 1},${y}`)) edges.push(edgeId([x + 1, y], [x + 1, y + 1]));
  }
  return edges.sort();
}
function independentShared(a, b) {
  const edges = [];
  for (const [x, y] of a) for (const [bx, by] of b) {
    if (y === by && Math.abs(x - bx) === 1) {
      const sharedX = Math.max(x, bx);
      edges.push(edgeId([sharedX, y], [sharedX, y + 1]));
    }
    if (x === bx && Math.abs(y - by) === 1) {
      const sharedY = Math.max(y, by);
      edges.push(edgeId([x, sharedY], [x + 1, sharedY]));
    }
  }
  return edges.sort();
}

function auditEdge(edge) {
  assert.deepEqual(Object.keys(edge).sort(), ["from", "id", "to"]);
  assert.equal(edge.id, edgeId(edge.from, edge.to));
  assert.equal(Math.abs(edge.to[0] - edge.from[0]) + Math.abs(edge.to[1] - edge.from[1]), 1);
  assert.ok(edge.from[0] < edge.to[0] || (edge.from[0] === edge.to[0] && edge.from[1] < edge.to[1]));
}

function assertDeepFrozen(value) {
  if (!value || typeof value !== "object") return;
  assert.ok(Object.isFrozen(value));
  Object.values(value).forEach(assertDeepFrozen);
}

function auditFigure(cells, label) {
  assert.ok(cells.length > 0, label);
  for (const cell of cells) {
    assert.deepEqual(Object.keys(cell).sort(), ["x", "y"], label);
    assert.ok(Number.isSafeInteger(cell.x) && Number.isSafeInteger(cell.y), label);
    assert.ok(cell.x >= 0 && cell.x < 6 && cell.y >= 0 && cell.y < 6, label);
  }
  const points = coords(cells);
  assert.equal(new Set(points.map(pointKey)).size, points.length, label);
  assert.equal(independentConnected(points), true, label);
  assert.equal(connectedCells(points), true, label);
  assert.equal(independentHoles(points), false, label);
  assert.equal(hasHoles(cells), false, label);
  assert.equal(perimeterOf(cells), independentPerimeter(points), label);
  const edges = boundaryEdges(cells);
  edges.forEach(auditEdge);
  assert.deepEqual(edges.map(edge => edge.id), independentEdges(points), label);
  assert.deepEqual(boundaryEdges([...cells].reverse()), edges, `${label}: order independence`);
  summary.figureChecks++;
  summary.boundaryEdgeChecks += edges.length;
}

function expectGrade(p, response, valid, correct, kind) {
  const before = JSON.stringify(response);
  assert.deepEqual(grade(p, response), { valid, correct, kind }, `${p?.id}: expected ${kind}`);
  assert.equal(JSON.stringify(response), before, "Grading must not mutate a response");
  if (p?.domain === "build") summary.buildChecks++;
  else summary.numericChecks++;
}

function isRectangle(points) {
  const width = Math.max(...points.map(p => p[0])) - Math.min(...points.map(p => p[0])) + 1;
  const height = Math.max(...points.map(p => p[1])) - Math.min(...points.map(p => p[1])) + 1;
  return width * height === points.length;
}

assert.deepEqual(domains.map(({ id, level }) => [id, level]), [["boundary", 1], ["joined", 2], ["compare", 3], ["build", 4]]);
assert.equal(all.length, 80);
assert.equal(new Set(all.map(p => p.id)).size, 80);
assertDeepFrozen(domains);
for (const unknown of ["missing", "toString", "__proto__", "", null, undefined, 1, ["build"], {}]) {
  assert.deepEqual(problemsFor(unknown), []);
  assertDeepFrozen(problemsFor(unknown));
}
for (const domain of domains) {
  assert.deepEqual(Object.keys(domain.names).sort(), [...languages].sort());
  const pool = problemsFor(domain.id);
  assert.equal(pool.length, 20);
  assert.equal(problemsFor(domain.id), pool, "Bank identity must remain stable");
  assertDeepFrozen(pool);
  const seen = new Set();
  for (const [index, p] of pool.entries()) {
    assert.equal(p.id, `perimeter-${domain.id}-${String(index + 1).padStart(2, "0")}`);
    assert.equal(p.index, index);
    assert.equal(p.domain, domain.id);
    assert.equal(p.size, 6);
    const signature = p.other
      ? [independentShapeKey(coords(p.cells)), independentShapeKey(coords(p.other))].sort().join("|")
      : independentShapeKey(coords(p.cells));
    assert.ok(!seen.has(signature), `${p.id}: duplicate figure or reversed compare pair`);
    seen.add(signature);
  }
}
assert.throws(() => { problemsFor("boundary")[0].cells[0].x = 5; }, TypeError);
assert.throws(() => { problemsFor("joined")[0].groups.push([]); }, TypeError);

const emptyResponses = [null, undefined, "", "   ", "\t\n"];
const invalidNumbers = [
  true, false, [], [8], {}, { valueOf: () => 8 }, NaN, Infinity, -Infinity,
  -1, 8.5, Number.MAX_SAFE_INTEGER + 1, "8.0", "8e0", "0x8", "+8", "-8", "8 cm", "8x", "8 0", "８"
];
const seenPrimaryShape = new Map();
for (const p of all) {
  auditFigure(p.cells, p.id);
  seenPrimaryShape.set(independentShapeKey(coords(p.cells)), shapeKey(p.cells));
  if (p.other) auditFigure(p.other, `${p.id}: B`);
  if (p.example) auditFigure(p.example, `${p.id}: example`);
  for (const value of emptyResponses) expectGrade(p, value, false, false, "empty");
  if (p.domain === "boundary" || p.domain === "joined") {
    const answer = independentPerimeter(coords(p.cells));
    assert.equal(answerFor(p), answer);
    for (const value of [answer, String(answer), `  ${answer}  `]) expectGrade(p, value, true, true, "correct");
    for (const value of [0, answer - 1, answer + 1, String(answer + 2)]) expectGrade(p, value, true, false, "retry");
    for (const value of invalidNumbers) expectGrade(p, value, false, false, "invalid");
  }
  if (p.domain === "boundary") {
    assert.ok(answerFor(p) >= 8 && answerFor(p) <= 32);
  }
  if (p.domain === "joined") {
    assert.equal(p.groups.length, 2);
    p.groups.forEach((group, i) => {
      auditFigure(group, `${p.id}: rectangle ${i}`);
      assert.ok(isRectangle(coords(group)), `${p.id}: axis-aligned rectangle`);
    });
    const [a, b] = p.groups.map(coords);
    assert.equal(new Set([...a, ...b].map(pointKey)).size, a.length + b.length, "Disjoint rectangles");
    assert.equal(sortedKey(coords(p.cells)), sortedKey([...a, ...b]));
    const common = sharedEdges(p.groups);
    assert.ok(common.length >= 1, "At least one full unit side must be shared");
    common.forEach(auditEdge);
    assert.deepEqual(common.map(edge => edge.id), independentShared(a, b));
    assert.deepEqual(sharedEdges([...p.groups].reverse()), common, "Stable shared edge order");
    const outer = new Set(boundaryEdges(p.cells).map(edge => edge.id));
    assert.ok(common.every(edge => !outer.has(edge.id)), "Shared sides are not outside perimeter");
    const sum = independentPerimeter(a) + independentPerimeter(b);
    assert.equal(answerFor(p), sum - 2 * common.length);
    expectGrade(p, sum, true, false, "retry");
    expectGrade(p, sum - common.length, true, false, "retry");
    summary.joinedChecks++;
  }
  if (p.domain === "compare") {
    const a = independentPerimeter(coords(p.cells)), b = independentPerimeter(coords(p.other));
    const answer = a < b ? "less" : a > b ? "greater" : "equal";
    assert.equal(answerFor(p), answer);
    assert.notEqual(independentShapeKey(coords(p.cells)), independentShapeKey(coords(p.other)));
    summary.comparisons[answer]++;
    for (const response of ["less", "equal", "greater"]) {
      expectGrade(p, response, true, response === answer, response === answer ? "correct" : "retry");
    }
    for (const response of [0, a, "<", "=", ">", "LESS", " less ", true, [], {}]) {
      expectGrade(p, response, false, false, "invalid");
    }
  }
  if (p.domain === "build") {
    assert.equal(answerFor(p), p.target);
    assert.equal(p.target, independentPerimeter(coords(p.cells)));
    assert.ok(p.target >= 8 && p.target <= 26);
    assert.equal(independentPerimeter(coords(p.example)), p.target);
    assert.notEqual(independentShapeKey(coords(p.example)), independentShapeKey(coords(p.cells)));
    expectGrade(p, coords(p.example), true, true, "correct");
    for (const orientation of orientations(coords(p.example))) {
      expectGrade(p, orientation, true, true, "correct");
    }
    expectGrade(p, p.example.map(({ x, y }) => [5 - x, y]), true, true, "correct");
    expectGrade(p, p.example, false, false, "invalid");
    expectGrade(p, [], false, false, "empty");
    for (const malformed of [false, true, p.target, String(p.target), {}, [null], [[0]], [[0, 0, 0]], [[0.5, 0]], [[NaN, 0]], [[Infinity, 0]], [["0", 0]], [[false, 0]], [[null, 0]], Array(1), [Array(2)]]) {
      expectGrade(p, malformed, false, false, "invalid");
    }
    expectGrade(p, [[-1, 0]], true, false, "outside");
    expectGrade(p, [[6, 0]], true, false, "outside");
    expectGrade(p, [[0, 6]], true, false, "outside");
    expectGrade(p, [[0, 0], [0, 0]], true, false, "duplicate");
    expectGrade(p, [[0, 0], [1, 1]], true, false, "disconnected");
    expectGrade(p, [[0, 0]], true, false, "retry");
    // Every in-bounds translation of all eight rigid orientations must be rejected.
    for (const orientation of orientations(coords(p.cells))) {
      const maxX = Math.max(...orientation.map(point => point[0]));
      const maxY = Math.max(...orientation.map(point => point[1]));
      for (let dy = 0; dy < 6 - maxY; dy++) for (let dx = 0; dx < 6 - maxX; dx++) {
        const moved = orientation.map(([x, y]) => [x + dx, y + dy]);
        assert.equal(shapeKey(moved), shapeKey(p.cells));
        expectGrade(p, moved, true, false, "same-shape");
        summary.congruentRejections++;
      }
    }
  }
  summary.correctExamples++;
}
assert.equal(summary.correctExamples, 80);
assert.equal(new Set(seenPrimaryShape.values()).size, seenPrimaryShape.size, "Noncongruent bank figures must not collide");
assert.deepEqual(summary.comparisons, { less: 7, equal: 6, greater: 7 });
assert.equal(Math.min(...problemsFor("boundary").map(answerFor)), 8);
assert.equal(Math.max(...problemsFor("boundary").map(answerFor)), 32);
assert.equal(Math.min(...problemsFor("build").map(answerFor)), 8);
assert.equal(Math.max(...problemsFor("build").map(answerFor)), 26);
assert.ok(problemsFor("boundary").filter(p => !isRectangle(coords(p.cells))).length >= 14, "Concave figures are not an occasional exception");
assert.ok(problemsFor("compare").some(p => p.cells.length === p.other.length && answerFor(p) !== "equal"), "Equal square counts need not give equal perimeter");
assert.ok(problemsFor("compare").some(p => p.cells.length !== p.other.length && answerFor(p) === "equal"), "Different square counts can give equal perimeter");
assert.ok(problemsFor("compare").some(p => p.cells.length > p.other.length && answerFor(p) === "less"), "Perimeter cannot be graded by square count");

const ring = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
const openNotch = ring.filter(([x, y]) => x !== 1 || y !== 0);
const cornerLeak = ring.filter(([x, y]) => x !== 0 || y !== 0);
assert.equal(connectedCells(ring), true);
assert.equal(hasHoles(ring), true);
assert.equal(hasHoles(openNotch), false, "An open notch is not a hole");
assert.equal(hasHoles(cornerLeak), true, "Corner-only contact does not open a unit-grid hole");
const disconnectedSamePerimeter = [[0, 0], [1, 0], [3, 0], [4, 0]];
const target12 = problemsFor("build").find(p => p.target === independentPerimeter(disconnectedSamePerimeter));
expectGrade(target12, disconnectedSamePerimeter, true, false, "disconnected");
const target16 = problemsFor("build").find(p => p.target === independentPerimeter(ring));
expectGrade(target16, ring, true, false, "hole");
for (const p of problemsFor("build")) expectGrade(p, ring, true, false, "hole");

assert.deepEqual(boundaryEdges([{ x: 0, y: 0 }]).map(edge => edge.id), ["0,0:0,1", "0,0:1,0", "0,1:1,1", "1,0:1,1"]);
assert.deepEqual(sharedEdges([[{ x: 0, y: 0 }], [{ x: 1, y: 0 }]]), [{ id: "1,0:1,1", from: [1, 0], to: [1, 1] }]);
assert.deepEqual(sharedEdges([[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]]), []);
assert.deepEqual(sharedEdges([[{ x: 0, y: 0 }], [{ x: 0, y: 0 }]]), []);
for (const bad of [null, {}, [null], [[0]], [["0", 0]], [[0, 0], [0, 0]], Array(1)]) {
  assert.equal(connectedCells(bad), false);
  assert.equal(hasHoles(bad), false);
  assert.equal(shapeKey(bad), "");
  assert.ok(Number.isNaN(perimeterOf(bad)));
  assert.deepEqual(boundaryEdges(bad), []);
}
assert.equal(perimeterOf([]), 0);
assert.equal(hasHoles([]), false);
assert.equal(connectedCells([]), false);
assert.equal(shapeKey([]), "");
assert.deepEqual(sharedEdges(null), []);
assert.deepEqual(sharedEdges([null, []]), []);
assert.throws(() => answerFor({ domain: "area" }), RangeError);
expectGrade(null, 8, false, false, "invalid");
expectGrade({ domain: "toString" }, 8, false, false, "invalid");

// Exhaust all 3x3 subsets, then independently generate larger in-bounds selections.
const candidates = new Map();
const productionToOracle = new Map(), oracleToProduction = new Map();
function auditSelection(points) {
  const cells = objects(points);
  const perimeter = independentPerimeter(points), connected = independentConnected(points), holes = independentHoles(points);
  assert.equal(perimeterOf(cells), perimeter);
  assert.equal(perimeterOf(points), perimeter);
  assert.equal(connectedCells(points), connected);
  assert.equal(hasHoles(cells), holes);
  assert.deepEqual(boundaryEdges(cells).map(edge => edge.id), independentEdges(points));
  const actual = shapeKey(cells), expected = independentShapeKey(points);
  if (productionToOracle.has(actual)) assert.equal(productionToOracle.get(actual), expected, "No false congruence");
  if (oracleToProduction.has(expected)) assert.equal(oracleToProduction.get(expected), actual, "No missed congruence");
  productionToOracle.set(actual, expected);
  oracleToProduction.set(expected, actual);
  assert.equal(shapeKey([...cells].reverse()), actual);
  assert.equal(shapeKey(points.map(([x, y]) => [x - 17, y + 23])), actual, "Translation-invariant shape identity");
  if (connected && !holes && perimeter >= 8 && perimeter <= 26) candidates.set(expected, { points, perimeter });
}
for (let mask = 1; mask < 1 << 9; mask++) {
  const points = Array.from({ length: 9 }, (_, i) => [i % 3, Math.floor(i / 3)]).filter((_, i) => mask & (1 << i));
  auditSelection(points);
  summary.exhaustiveFigures++;
}
let state = 20260909;
const random = () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 4294967296;
};
for (let sample = 0; sample < 1800; sample++) {
  let points;
  if (sample % 2 === 0) {
    points = [[Math.floor(random() * 6), Math.floor(random() * 6)]];
    const occupied = new Set(points.map(pointKey)), count = 3 + Math.floor(random() * 27);
    while (points.length < count) {
      const possible = [];
      for (const [x, y] of points) for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const next = [x + dx, y + dy];
        if (next.some(n => n < 0 || n >= 6) || occupied.has(pointKey(next))) continue;
        possible.push(next);
      }
      const next = possible[Math.floor(random() * possible.length)];
      points.push(next);
      occupied.add(pointKey(next));
    }
  } else {
    points = Array.from({ length: 36 }, (_, i) => [i % 6, Math.floor(i / 6)]).filter(() => random() < 0.65);
  }
  auditSelection(points);
  summary.randomFigures++;
}

// Match arbitrary valid shapes to the rule, never to the stored example.
for (const p of problemsFor("build")) {
  const reference = independentShapeKey(coords(p.cells)), example = independentShapeKey(coords(p.example));
  const alternatives = [...candidates.entries()].filter(([signature, candidate]) =>
    candidate.perimeter === p.target && signature !== reference && signature !== example);
  assert.ok(alternatives.length > 0, `${p.id}: independently found non-example answer`);
  for (const [, { points }] of alternatives.slice(0, 12)) {
    expectGrade(p, points, true, true, "correct");
    expectGrade(p, [...points].reverse(), true, true, "correct");
    summary.acceptedNonExampleBuilds++;
  }
  for (const { points, perimeter } of candidates.values()) {
    if (perimeter === p.target || independentShapeKey(points) === reference) continue;
    expectGrade(p, points, true, false, "retry");
    break;
  }
}
assert.ok(summary.acceptedNonExampleBuilds >= 20);

const units = {
  ko: "한 칸의 변 길이 = 1", en: "Side length of one grid square = 1",
  zh: "一个方格的边长 = 1", ja: "ひとますの辺の長さ = 1"
};
const buildRules = {
  ko: [/둘레/, /모양/, /변끼리/, /구멍/, /옮기|옮겨/, /돌리/, /뒤집/],
  en: [/perimeter|boundary/, /shape/, /along sides/, /holes/, /moving/i, /turning/, /flipping/],
  zh: [/周长|长度/, /形状/, /通过边/, /孔洞/, /平移/, /旋转/, /翻转/],
  ja: [/長さ/, /形/, /辺で/, /穴/, /動かす/, /回す/, /裏返す/]
};
for (const p of all) for (const lang of languages) {
  const prompt = promptFor(p, lang), hint = hintFor(p, lang), solution = solutionFor(p, lang);
  for (const text of [prompt, hint, solution, domains.find(d => d.id === p.domain).names[lang]]) {
    assert.equal(typeof text, "string");
    assert.ok(text.trim().length > 3);
    assert.doesNotMatch(text, /undefined|NaN|\[object Object\]|<script|면적|넓이|面积|面積|\barea\b|\bcm\b|㎝|cm²|cm2|제곱|平方|square units/i);
    if (lang === "en") assert.doesNotMatch(text, /[가-힣\u3040-\u30ff\u4e00-\u9fff]/);
    if (lang === "ko") assert.match(text, /[가-힣]/);
    if (lang === "zh") { assert.match(text, /[\u4e00-\u9fff]/); assert.doesNotMatch(text, /[가-힣\u3040-\u30ff]/); }
    if (lang === "ja") { assert.match(text, /[\u3040-\u30ff]/); assert.doesNotMatch(text, /[가-힣]/); }
  }
  assert.ok(prompt.includes(units[lang]));
  if (p.domain === "build") {
    assert.ok(prompt.includes(String(p.target)));
    for (const rule of buildRules[lang]) {
      assert.match(prompt, rule, `${p.id}: ${lang} prompt rule`);
      assert.match(hint, rule, `${p.id}: ${lang} hint rule`);
    }
    const accepted = solutionFor(p, lang, coords(p.example));
    assert.notEqual(accepted, solution, "Distinguish the learner's accepted answer from an example");
    assert.ok(accepted.includes(String(p.target)));
    assert.equal(solutionFor(p, lang, [[0, 0]]), solution, "Never label a wrong response as correct");
  }
  if (p.domain === "joined") {
    const common = independentShared(...p.groups.map(coords)).length;
    assert.ok(solution.includes(`- ${common} - ${common} = ${answerFor(p)}`));
  }
  if (p.domain === "compare") {
    assert.ok(solution.includes(`A ${{ less: "<", equal: "=", greater: ">" }[answerFor(p)]} B`));
  }
  for (const badLanguage of ["fr", "toString", "__proto__", "<script>", null]) {
    assert.equal(promptFor(p, badLanguage), promptFor(p, "ko"));
    assert.equal(hintFor(p, badLanguage), hintFor(p, "ko"));
    assert.equal(solutionFor(p, badLanguage), solutionFor(p, "ko"));
  }
  summary.localeChecks++;
}

// Learner-fit evidence covers this model and wording, not untested UI or print layouts.
summary.learnerFit = {
  learner_stage: "초등 기초 도형 · 단위길이와 둘레",
  scope: "Core problem data, wording, and response rules only; rendering remains a separate check.",
  criteria: {
    language: "All 80 problems have ko/en/zh/ja prompts, hints, and solutions; each prompt states a unit side length of 1. No area or cm claims.",
    representations: "Every figure uses the same 6x6 unit grid. Unit boundary segments and internal shared segments have distinct stable IDs.",
    prerequisites: "Recognize square sides, count unit lengths, and distinguish side contact from corner contact. No rectangle formula is required to answer.",
    "reasoning-load": "Four separate domains progress from following a closed boundary to excluding common sides, comparing lengths, and satisfying construction constraints. Hints support each step.",
    "response-mode": "Boundary/joined use a whole-number length, compare uses less/equal/greater, and build uses a free construction. Any valid noncongruent shape is accepted."
  },
  evidence: {
    fourLanguageProblems: summary.localeChecks,
    independentlyCheckedExamples: summary.correctExamples,
    distinctDomainTasks: domains.map(d => d.id),
    comparisonBalance: summary.comparisons,
    acceptedNonExampleBuilds: summary.acceptedNonExampleBuilds,
    congruentRejections: summary.congruentRejections,
    numericCoercionRejected: true,
    holesAndDisconnectionRejected: true
  }
};
assert.equal(summary.learnerFit.learner_stage, "초등 기초 도형 · 단위길이와 둘레");
assert.deepEqual(Object.keys(summary.learnerFit.criteria).sort(), ["language", "representations", "prerequisites", "reasoning-load", "response-mode"].sort());
assert.ok(Object.values(summary.learnerFit.criteria).every(text => text.length > 40));
assert.equal(summary.localeChecks, 320);
assertDeepFrozen(domains);
all.forEach(assertDeepFrozen);
console.log(JSON.stringify(summary, null, 2));
