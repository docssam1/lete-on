import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  learner_stage, domains, problemsFor, properties, answerFor, grade,
  className, optionLabels, promptPartsFor, promptFor, hintFor, solutionFor
} from "./core.js";

const languages = ["ko", "en", "zh", "ja"];
const classIDs = ["trapezoid", "parallelogram", "rectangle", "rhombus", "square"];
const pairIDs = ["ab-cd", "bc-da"];
const letters = ["A", "B", "C", "D"];
const all = domains.flatMap(({ id }) => problemsFor(id));
const grid = Array.from({ length: 49 }, (_, i) => [i % 7, Math.floor(i / 7)]);
const summary = {
  problems: all.length, propertyChecks: 0, selectionSubsets: 0, buildCandidates: 0,
  malformedChecks: 0, transformChecks: 0, localeChecks: 0, negativeControls: 0,
  acceptedNonExampleBuilds: 0, multiAnswerBuilds: 0, distributions: {}, buildAnswerCounts: []
};
const pointKey = p => p.join(",");
const setKey = set => [...set].sort().join("|");
const coordinateSet = points => points.map(pointKey).sort();
const blank = () => ({ valid: false, parallelPairs: [], rightVertices: [], equalSideGroups: [], classes: [] });
const squaredDistance = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
const signedArea = (a, b, c) => a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
function lineDirection(a, b) {
  let x = b[0] - a[0], y = b[1] - a[1];
  const divisor = gcd(Math.abs(x), Math.abs(y));
  x /= divisor; y /= divisor;
  if (x < 0 || (x === 0 && y < 0)) { x = -x; y = -y; }
  return `${x},${y}`;
}

// Independent oracle: supporting half-planes, reduced integer directions, and
// Pythagoras on each corner triangle (not production's turn/cross/dot tests).
function oracle(vertices) {
  if (!Array.isArray(vertices) || vertices.length !== 4 || !Array.from(vertices).every(p =>
    Array.isArray(p) && p.length === 2 && [p[0], p[1]].every(n => Number.isInteger(n) && n >= 0 && n <= 6))) return blank();
  if (new Set(vertices.map(pointKey)).size !== 4) return blank();
  for (let i = 0; i < 4; i++) {
    const a = vertices[i], b = vertices[(i + 1) % 4];
    const side1 = signedArea(a, b, vertices[(i + 2) % 4]);
    const side2 = signedArea(a, b, vertices[(i + 3) % 4]);
    if (side1 * side2 <= 0) return blank();
  }
  const directions = vertices.map((p, i) => lineDirection(p, vertices[(i + 1) % 4]));
  const lengths = vertices.map((p, i) => squaredDistance(p, vertices[(i + 1) % 4]));
  const parallelPairs = pairIDs.filter((_, i) => directions[i] === directions[i + 2]);
  const rightVertices = letters.filter((_, i) =>
    lengths[(i + 3) % 4] + lengths[i] === squaredDistance(vertices[(i + 3) % 4], vertices[(i + 1) % 4]));
  const equalSideGroups = [];
  for (let i = 0; i < 4; i++) {
    if (lengths.indexOf(lengths[i]) !== i) continue;
    const group = [0, 1, 2, 3].filter(j => lengths[i] === lengths[j]);
    if (group.length > 1) equalSideGroups.push(group);
  }
  const classes = [];
  if (parallelPairs.length) classes.push("trapezoid");
  if (parallelPairs.length === 2) classes.push("parallelogram");
  if (rightVertices.length === 4) classes.push("rectangle");
  if (new Set(lengths).size === 1) classes.push("rhombus");
  if (rightVertices.length === 4 && new Set(lengths).size === 1) classes.push("square");
  return { valid: true, parallelPairs, rightVertices, equalSideGroups, classes };
}
function expectedSelection(p) {
  const info = oracle(p.vertices);
  const ids = p.domain === "parallel" ? info.parallelPairs : p.domain === "right" ? info.rightVertices : info.classes;
  return ids.length ? ids : ["none"];
}
function expectedBuild(p, d) {
  const info = oracle([...p.vertices, d]);
  return info.valid && info.classes.includes(p.target) &&
    (p.extra !== "exactly-one-parallel" || info.parallelPairs.length === 1);
}
function expectGrade(p, response, valid, correct, kind) {
  const before = JSON.stringify(response);
  assert.deepEqual(grade(p, response), { valid, correct, kind }, `${p?.id}: ${String(response)}`);
  assert.equal(JSON.stringify(response), before, "response mutation");
}
function auditProperties(vertices) {
  const before = JSON.stringify(vertices);
  assert.deepEqual(properties(vertices), oracle(vertices), before);
  assert.equal(JSON.stringify(vertices), before);
  summary.propertyChecks++;
}
function frozen(value) {
  if (value && typeof value === "object") {
    assert.ok(Object.isFrozen(value));
    Object.values(value).forEach(frozen);
  }
}
function powerset(ids) {
  return Array.from({ length: 2 ** ids.length }, (_, mask) => ids.filter((_, i) => mask & (1 << i)));
}
const transforms = [
  ([x, y]) => [x, y], ([x, y]) => [6 - y, x], ([x, y]) => [6 - x, 6 - y], ([x, y]) => [y, 6 - x],
  ([x, y]) => [6 - x, y], ([x, y]) => [x, 6 - y], ([x, y]) => [y, x], ([x, y]) => [6 - y, 6 - x]
];

assert.equal(learner_stage, "초등 도형 · 사각형의 성질과 분류");
assert.deepEqual(domains.map(({ id, level }) => [id, level]), [["parallel", 1], ["right", 2], ["classify", 3], ["build", 4]]);
assert.equal(all.length, 80);
assert.equal(new Set(all.map(p => p.id)).size, 80);
frozen(domains);
for (const badDomain of [undefined, null, "", "toString", "__proto__", "constructor", [], {}, 1]) {
  assert.deepEqual(problemsFor(badDomain), []);
  assert.deepEqual(optionLabels(badDomain), []);
}

for (const domain of domains) {
  const bank = problemsFor(domain.id);
  frozen(bank);
  assert.equal(bank.length, 20);
  assert.equal(new Set(bank.map(p => JSON.stringify([p.vertices, p.target]))).size, 20);
  const expectedOptionIDs = domain.id === "parallel" ? [...pairIDs, "none"] : domain.id === "right" ? [...letters, "none"] :
    domain.id === "classify" ? [...classIDs, "none"] : [];
  for (const lang of languages) {
    assert.equal(typeof domain.names[lang], "string");
    assert.deepEqual(optionLabels(domain.id, lang).map(o => o.id), expectedOptionIDs);
    assert.ok(optionLabels(domain.id, lang).every(o => typeof o.label === "string" && o.label.length > 0));
  }
  const distribution = {};
  for (const [index, p] of bank.entries()) {
    assert.equal(p.index, index);
    assert.equal(p.id, `quadrilateral-${domain.id}-${String(index + 1).padStart(2, "0")}`);
    assert.equal(p.domain, domain.id);
    assert.equal(p.size, 7);
    assert.equal(p.vertices.length, domain.id === "build" ? 3 : 4);
    assert.equal(p.extra, undefined, "Bank uses simple inclusive targets only");
    for (const d of p.vertices) assert.ok(grid.some(g => pointKey(g) === pointKey(d)));
    if (p.domain === "build") {
      assert.ok(classIDs.includes(p.target));
      assert.ok(Array.isArray(p.example) && p.example.length === 2);
      const expected = grid.filter(d => expectedBuild(p, d));
      assert.ok(expected.length > 0, p.id);
      assert.ok(expectedBuild(p, p.example), p.id);
      assert.deepEqual(coordinateSet(answerFor(p)), coordinateSet(expected));
      summary.buildAnswerCounts.push({ id: p.id, target: p.target, count: expected.length });
      if (expected.length > 1) summary.multiAnswerBuilds++;
      for (const d of grid) {
        const info = oracle([...p.vertices, d]);
        const correct = expectedBuild(p, d);
        expectGrade(p, d, true, correct, correct ? "correct" : info.valid ? "retry" : "shape");
        auditProperties([...p.vertices, d]);
        if (correct && pointKey(d) !== pointKey(p.example)) summary.acceptedNonExampleBuilds++;
        summary.buildCandidates++;
      }
      for (const d of [[-1, 0], [7, 0], [0, -1], [0, 7], [Number.MAX_SAFE_INTEGER, 0]]) expectGrade(p, d, true, false, "outside");
      distribution[p.target] = (distribution[p.target] || 0) + 1;
    } else {
      assert.ok(oracle(p.vertices).valid, p.id);
      auditProperties(p.vertices);
      const expected = expectedSelection(p);
      assert.deepEqual(answerFor(p), expected, p.id);
      for (const response of powerset(expectedOptionIDs)) {
        const empty = response.length === 0;
        const mixedNone = response.includes("none") && response.length > 1;
        const valid = !empty && !mixedNone;
        const correct = valid && setKey(response) === setKey(expected);
        expectGrade(p, response, valid, correct, empty ? "empty" : mixedNone ? "invalid" : correct ? "correct" : "retry");
        if (valid) expectGrade(p, [...response].reverse(), true, correct, correct ? "correct" : "retry");
        summary.selectionSubsets++;
      }
      distribution[setKey(expected)] = (distribution[setKey(expected)] || 0) + 1;
      for (const ids of [[expected[0], expected[0]], ["unknown"], ["NONE"], ["none", expectedOptionIDs[0]], [0], [true], [[expected[0]]], [new String(expected[0])]]) {
        expectGrade(p, ids, false, false, "invalid");
        summary.malformedChecks++;
      }
    }
    for (const response of [undefined, null, []]) {
      expectGrade(p, response, false, false, "empty"); summary.malformedChecks++;
    }
    for (const response of ["", "0,0", 0, false, true, {}, { x: 0, y: 0 }, new Set(), new Int32Array([0, 0]), Array(1), Array(2), [NaN, 0], [Infinity, 0], [0.5, 1], ["1", 1], [1, false], [1], [1, 2, 3], [Number.MAX_SAFE_INTEGER + 1, 0]]) {
      expectGrade(p, response, false, false, "invalid"); summary.malformedChecks++;
    }
    for (const transform of transforms) {
      const q = { ...p, vertices: p.vertices.map(transform), ...(p.domain === "build" ? { example: transform(p.example) } : {}) };
      if (p.domain === "build") {
        assert.deepEqual(coordinateSet(answerFor(q)), coordinateSet(grid.filter(d => expectedBuild(q, d))));
        for (const d of grid) {
          assert.equal(grade(q, transform(d)).correct, expectedBuild(p, d));
          summary.transformChecks++;
        }
      } else {
        assert.deepEqual(properties(q.vertices), oracle(p.vertices));
        assert.deepEqual(answerFor(q), expectedSelection(p));
        summary.transformChecks++;
      }
    }
    // Translate through every placement that keeps the full figure inside the grid.
    const full = p.domain === "build" ? [...p.vertices, p.example] : p.vertices;
    for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
      const shifted = full.map(([x, y]) => [x + dx, y + dy]);
      if (!shifted.every(([x, y]) => x >= 0 && x <= 6 && y >= 0 && y <= 6)) continue;
      assert.deepEqual(properties(shifted), oracle(full));
      summary.transformChecks++;
    }
    for (let start = 0; start < 4; start++) for (const direction of [1, -1]) {
      auditProperties(full.map((_, i) => full[(start + direction * i + 4) % 4]));
    }
    for (const lang of languages) {
      const prompt = promptFor(p, lang), hint = hintFor(p, lang), solution = solutionFor(p, lang);
      const parts = promptPartsFor(p, lang);
      assert.deepEqual(Object.keys(parts), ["question", "conditions"]);
      assert.equal(typeof parts.question, "string");
      assert.ok(Array.isArray(parts.conditions));
      assert.ok(parts.conditions.every(condition => typeof condition === "string" && condition.length > 0));
      assert.equal(parts.conditions.length, p.domain === "build" ? 2 : p.domain === "classify" ? 1 : 0);
      const combined = p.domain === "build" && ["zh", "ja"].includes(lang)
        ? [parts.question + parts.conditions[0], ...parts.conditions.slice(1)].join(" ")
        : [parts.question, ...parts.conditions].join(" ");
      assert.equal(prompt, combined);
      for (const text of [prompt, hint, solution]) {
        assert.equal(typeof text, "string");
        assert.ok(text.length > 15);
        assert.doesNotMatch(text, /undefined|NaN|\[object Object\]|exampleD|dot product|cross product|内積|外積|내적|외적/);
      }
      for (const text of [prompt, hint]) {
        assert.doesNotMatch(text, /정답:|Answer:|答案：|答え：|D\s*=/, "No solved answer before submission");
      }
      if (["build", "classify"].includes(p.domain)) {
        const inclusion = { ko: /적어도 한 쌍/, en: /at least one pair/, zh: /至少有一组/, ja: /少なくとも1組/ }[lang];
        assert.match(prompt, inclusion); assert.match(hint, inclusion);
      }
      if (p.domain === "build") {
        for (const d of grid.filter(d => expectedBuild(p, d))) {
          assert.ok(solutionFor(p, lang, d).includes(`(${d.join(", ")})`), "accepted alternative shown, not example");
        }
      } else {
        // Changing the answer-bearing figure cannot inject answers into prompts/hints.
        for (const other of bank) {
          assert.equal(promptFor(other, lang), prompt);
          assert.equal(hintFor(other, lang), hint);
        }
      }
      summary.localeChecks++;
    }
  }
  summary.distributions[domain.id] = distribution;
  if (domain.id !== "build") {
    const sequence = bank.map(p => setKey(expectedSelection(p)));
    assert.ok(Object.keys(distribution).length >= (domain.id === "classify" ? 6 : 4));
    for (let period = 1; period <= 5; period++) assert.ok(sequence.some((key, i) => i >= period && key !== sequence[i - period]), "No repeated short answer cycle");
    for (const id of expectedOptionIDs) {
      assert.ok(bank.some(p => expectedSelection(p).includes(id)), `option ${id} is sometimes true`);
      assert.ok(bank.some(p => !expectedSelection(p).includes(id)), `option ${id} is sometimes false`);
    }
  }
}

assert.ok(summary.multiAnswerBuilds >= 3);
assert.ok(summary.acceptedNonExampleBuilds >= 10);
assert.equal(summary.buildCandidates, 20 * 49);
assert.equal(summary.selectionSubsets, 20 * (8 + 32 + 64));
assert.equal(summary.distributions.parallel["ab-cd"], 2);
assert.equal(summary.distributions.parallel["bc-da"], 2);
assert.deepEqual(Object.values(summary.distributions.build), [4, 4, 4, 4, 4]);
for (const letter of letters) assert.ok(problemsFor("right").some(p => setKey(expectedSelection(p)) === letter), `${letter} singleton`);

const square = [[1, 1], [4, 1], [4, 4], [1, 4]];
assert.deepEqual(properties(square), { valid: true, parallelPairs: pairIDs, rightVertices: letters, equalSideGroups: [[0, 1, 2, 3]], classes: classIDs });
const special = { id: "special", size: 7, domain: "build", target: "rectangle", vertices: square.slice(0, 3), example: square[3] };
for (const target of classIDs) {
  const p = { ...special, target };
  expectGrade(p, square[3], true, true, "correct");
  const restricted = { ...p, extra: "exactly-one-parallel" };
  expectGrade(restricted, square[3], true, false, "retry");
  assert.deepEqual(coordinateSet(answerFor(restricted)), coordinateSet(grid.filter(d => expectedBuild(restricted, d))));
  for (const lang of languages) {
    const phrase = { ko: /정확히 한 쌍/, en: /exactly one pair/, zh: /恰好有一组/, ja: /ちょうど1組/ }[lang];
    assert.match(promptFor(restricted, lang), phrase);
    assert.match(hintFor(restricted, lang), phrase);
    assert.equal(promptPartsFor(restricted, lang).conditions.length, 3);
  }
}
for (const invalid of [
  null, undefined, {}, [], Array(4), square.slice(0, 3), [...square, [5, 5]],
  [[0, 0], [2, 2], [0, 2], [2, 0]], // crossing
  [[0, 0], [4, 0], [1, 1], [0, 4]], // concave
  [[0, 0], [2, 0], [4, 0], [0, 3]], // straight corner
  [[0, 0], [2, 0], [0, 0], [0, 3]], // repeated point
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [["1", 1], ...square.slice(1)], [[NaN, 1], ...square.slice(1)], [[0.5, 1], ...square.slice(1)],
  [[-1, 1], ...square.slice(1)], [[7, 1], ...square.slice(1)]
]) {
  assert.deepEqual(properties(invalid), blank());
  const p = { ...special, domain: "classify", vertices: invalid };
  expectGrade(p, ["none"], false, false, "invalid");
  assert.throws(() => answerFor(p), RangeError);
}
for (const p of [null, {}, { ...special, domain: "constructor" }, { ...special, size: 6 }, { ...special, vertices: Array(3) },
  { ...special, target: "kite" }, { ...special, extra: "secret-exclusion" }, { ...special, vertices: [[0, 0], [1, 1], [2, 2]] }]) {
  expectGrade(p, [1, 4], false, false, "invalid");
}

// Exhaust all ordered selections of four distinct points on a 3x3 board.
const small = grid.filter(([x, y]) => x < 3 && y < 3);
for (const a of small) for (const b of small) for (const c of small) for (const d of small) {
  if (new Set([a, b, c, d]).size === 4) auditProperties([a, b, c, d]);
}
// Fixed-seed full-grid holdout includes convex, concave, crossing and degenerate inputs.
let state = 0x47ac92;
const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state; };
for (let i = 0; i < 12000; i++) auditProperties(Array.from({ length: 4 }, () => grid[random() % 49]));

// Negative controls prove the checks reject exclusive classification, missing
// alternatives, poisoned marks, and example-only grading without editing files.
const negativeControl = check => { assert.throws(check, assert.AssertionError); summary.negativeControls++; };
negativeControl(() => assert.deepEqual(["square"], oracle(square).classes));
negativeControl(() => assert.deepEqual({ ...properties(square), parallelPairs: [] }, oracle(square)));
const multi = problemsFor("build").find(p => grid.filter(d => expectedBuild(p, d)).length > 1);
negativeControl(() => assert.deepEqual(coordinateSet([multi.example]), coordinateSet(grid.filter(d => expectedBuild(multi, d)))));
const alternative = grid.find(d => expectedBuild(multi, d) && pointKey(d) !== pointKey(multi.example));
negativeControl(() => assert.equal(pointKey(alternative) === pointKey(multi.example), expectedBuild(multi, alternative)));
negativeControl(() => assert.deepEqual(properties([[0, 0], [2, 2], [0, 2], [2, 0]]), { ...blank(), valid: true }));
negativeControl(() => assert.equal(grade(special, ["1", 4]).valid, true));

for (const lang of languages) {
  const names = [...classIDs, "none"].map(id => className(id, lang));
  assert.equal(new Set(names).size, 6);
  assert.ok(names.every(name => name.length > 0));
}
assert.equal(className("invalid"), "");
const sample = all[0];
for (const lang of ["fr", null, "constructor", {}, undefined]) {
  assert.equal(promptFor(sample, lang), promptFor(sample, "ko"));
  assert.deepEqual(promptPartsFor(sample, lang), promptPartsFor(sample, "ko"));
  assert.equal(hintFor(sample, lang), hintFor(sample, "ko"));
  assert.equal(solutionFor(sample, lang), solutionFor(sample, "ko"));
}
assert.throws(() => { sample.vertices[0][0] = 99; }, TypeError);
assert.throws(() => { problemsFor("build")[0].example[0] = 99; }, TypeError);
assert.throws(() => { problemsFor("parallel").push(sample); }, TypeError);
const detachedAnswer = answerFor(sample);
detachedAnswer.push("poison");
assert.deepEqual(answerFor(sample), expectedSelection(sample));
const coreSource = readFileSync(new URL("./core.js", import.meta.url), "utf8");
assert.doesNotMatch(coreSource, /Math\.(acos|asin|atan|atan2|sqrt|hypot)|parseInt|parseFloat|Math\.random/);

summary.learnerFit = {
  gate: "learner-fit", learner_stage, status: "pass-core-scope",
  criteria: {
    language: "All 80 prompts, hints and solutions checked in ko/en/zh/ja. Child-facing text uses side, corner, parallel and equal; dot/cross products remain internal. All classification/build prompts and hints state the inclusive trapezoid convention. Classification is enrichment, not a national-curriculum requirement.",
    representations: "Every bank point is on a 7x7 integer lattice, in perimeter order A-B-C-D. Builds expose only A-B-C and p.example stays separate. Renderer contract: show all matching marks only for classification; no property answer marks before responses in parallel/right. Visual verification belongs to the renderer/worksheet owners.",
    prerequisites: "Recognize four sides and vertices, opposite sides, parallel lines, paper-corner right angles, equal lengths, and grid points. Tilted cases require transferring a familiar right-angle corner and comparing grid directions; no angle estimates or formal vector arithmetic are required.",
    "reasoning-load": "Parallel and right domains isolate distinct properties. Classification enrichment combines those properties using explicit definitions. Build fixes three vertices and asks for one point, with inclusive special cases accepted and no hidden extra conditions.",
    "response-mode": "Selection is an unordered set of all matching IDs with an explicit none alternative. Empty, duplicate, unknown and mixed-none responses are invalid. Build is one integer coordinate pair; all 49 points are tested and every condition-satisfying answer is accepted, not only p.example."
  },
  evidence: { problems: all.length, localeChecks: summary.localeChecks, selectionSubsets: summary.selectionSubsets, buildCandidates: summary.buildCandidates },
  pending: ["renderer desktop/mobile observability", "worksheet A4 visual verification"]
};
assert.deepEqual(Object.keys(summary.learnerFit.criteria).sort(), ["language", "representations", "prerequisites", "reasoning-load", "response-mode"].sort());
console.log(JSON.stringify(summary, null, 2));
