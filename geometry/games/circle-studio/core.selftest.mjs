import assert from "node:assert/strict";
import {
  learner_stage, domains, problemsFor, answerFor, grade, segmentKind,
  promptPartsFor, promptFor, hintFor, solutionFor, optionLabels
} from "./core.js";

const LANGS = ["ko", "en", "zh", "ja"];
const LETTERS = ["A", "B", "C", "D"];
const counts = { problems: 0, centerResponses: 0, drawResponses: 0, partsResponses: 0, measureResponses: 0,
  negativeResponses: 0, segmentCases: 0, locales: 0, frozenNodes: 0 };
function frozen(value) {
  if (!value || typeof value !== "object") return;
  assert.ok(Object.isFrozen(value));
  counts.frozenNodes++;
  for (const child of Object.values(value)) frozen(child);
}
const equalPoint = (a, b) => a[0] === b[0] && a[1] === b[1];
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const near = (a, b) => Math.abs(a - b) < 1e-10;
function oracleKind(s, center, radius) {
  const a = distance(s.start, center), b = distance(s.end, center), length = distance(s.start, s.end);
  if (near(length, 0)) return "other";
  if ((near(a, 0) && near(b, radius)) || (near(b, 0) && near(a, radius))) return "radius";
  return near(a, radius) && near(b, radius) && near(length, 2 * radius) ? "diameter" : "other";
}
function checked(p, response, valid, correct) {
  const result = grade(p, response);
  assert.deepEqual(Object.keys(result).sort(), ["correct", "kind", "valid"]);
  assert.equal(result.valid, valid, `${p?.id}: ${String(response)}`);
  assert.equal(result.correct, correct, p?.id);
  assert.ok(["empty", "invalid", "outside", "correct", "retry"].includes(result.kind));
  if (correct) assert.equal(result.kind, "correct");
  if (!valid) assert.equal(correct, false);
}
function rejected(p, values) {
  for (const response of values) {
    checked(p, response, false, false);
    counts.negativeResponses++;
  }
}
assert.equal(learner_stage, "초등 도형 · 원의 중심, 반지름, 지름과 원 그리기");
assert.deepEqual(domains.map(d => d.id), ["center", "parts", "measure", "draw"]);
frozen(domains);
for (const unknown of ["", "missing", "__proto__", "constructor", null, 0, {}, ["center"]]) {
  assert.deepEqual(problemsFor(unknown), []);
  assert.ok(Object.isFrozen(problemsFor(unknown)));
  assert.deepEqual(optionLabels(unknown), []);
}

// Exhaustive lattice segments include chords, shortened arms, outside points,
// reversed endpoints, coincident endpoints and translated circle centers.
for (const center of [[0, 0], [2, -3]]) for (const radius of [1, 3, 5]) {
  const points = [];
  for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) points.push([center[0] + x, center[1] + y]);
  for (const start of points) for (const end of points) {
    const s = { start, end };
    assert.equal(segmentKind(s, center, radius), oracleKind(s, center, radius));
    counts.segmentCases++;
  }
}
const validSegment = { start: [0, 0], end: [3, 4] };
for (const segment of [null, {}, [], { start: [], end: [3, 4] }, { start: [0, 0], end: [3, NaN] },
  { start: [0, 0], end: [3, "4"] }, { start: [0, 0], end: [3, 4, 0] },
  { start: [0, 0], end: [0, 0] }, { start: [0, 0], end: [Number.MAX_VALUE, 0] }]) {
  assert.equal(segmentKind(segment, [0, 0], 5), "other");
}
for (const center of [null, [], [0], [0, "0"], [Infinity, 0], [0, 0, 0]]) {
  assert.equal(segmentKind(validSegment, center, 5), "other");
}
for (const radius of [0, -5, NaN, Infinity, "5", 5.5, undefined, 1n, Number.MAX_SAFE_INTEGER]) {
  assert.equal(segmentKind(validSegment, [0, 0], radius), "other");
}

const ids = new Set();
const slots = { radius: [0, 0, 0, 0], diameter: [0, 0, 0, 0] };
const cardinalities = { 1: 0, 2: 0 };
const measurementKeys = new Set();
for (const [domainIndex, domain] of domains.entries()) {
  assert.equal(domain.level, domainIndex + 1);
  const bank = problemsFor(domain.id);
  assert.equal(bank.length, 20);
  assert.equal(problemsFor(domain.id), bank);
  frozen(bank);
  assert.throws(() => bank.push(bank[0]), TypeError);
  const placements = new Set(), centers = new Set(), radii = new Set();
  for (const [index, p] of bank.entries()) {
    counts.problems++;
    assert.equal(p.id, `circle-${domain.id}-${String(index + 1).padStart(2, "0")}`);
    assert.equal(p.index, index);
    assert.equal(p.domain, domain.id);
    assert.equal(p.size, 7);
    assert.ok(!ids.has(p.id));
    ids.add(p.id);
    assert.throws(() => { p.radius = 42; }, TypeError);
    assert.throws(() => { p.center[0] = 42; }, TypeError);
    checked(p, answerFor(p), true, true);
    rejected(p, [null, undefined, []]);
    if (p.domain === "center" || p.domain === "draw") {
      placements.add(JSON.stringify([p.center, p.radius]));
      centers.add(p.center.join(","));
      radii.add(p.radius);
      assert.ok(Number.isInteger(p.radius) && p.radius >= 1 && p.radius <= 3);
      assert.ok(p.center.every(n => Number.isInteger(n) && n - p.radius >= 0 && n + p.radius <= 6));
      let correctCount = 0;
      for (let x = 0; x < 7; x++) for (let y = 0; y < 7; y++) {
        if (p.domain === "center") {
          const correct = equalPoint([x, y], p.center);
          checked(p, [x, y], true, correct);
          correctCount += Number(correct);
          counts.centerResponses++;
        } else for (let radius = 1; radius <= 3; radius++) {
          const correct = equalPoint([x, y], p.center) && radius === p.radius;
          checked(p, { center: [x, y], radius }, true, correct);
          correctCount += Number(correct);
          counts.drawResponses++;
        }
      }
      assert.equal(correctCount, 1);
      const badPoints = [[1], [1, 2, 3], [1.5, 2], [NaN, 2], [Infinity, 2], ["1", 2], Array(2), {}, "1,2"];
      rejected(p, p.domain === "center" ? badPoints : badPoints.map(center => ({ center, radius: p.radius })));
      for (const center of [[-1, 0], [7, 0], [0, 7]]) {
        const response = p.domain === "center" ? center : { center, radius: p.radius };
        checked(p, response, true, false);
        assert.equal(grade(p, response).kind, "outside");
      }
      if (p.domain === "draw") rejected(p, [{}, p.center, ...[0, 4, -1, "2", 2.5, NaN, null].map(radius => ({ center: p.center, radius }))]);
      const answer = answerFor(p);
      (p.domain === "center" ? answer : answer.center)[0] = 99;
      assert.notEqual(p.center[0], 99);
    } else if (p.domain === "parts") {
      assert.equal(p.radius, 5);
      assert.deepEqual(p.center, [0, 0]);
      assert.deepEqual(p.segments.map(s => s.id), LETTERS);
      const keys = new Set();
      for (const s of p.segments) {
        assert.ok(s.start.concat(s.end).every(Number.isInteger));
        assert.ok(distance(s.start, s.end) >= 2, "Visible nondegenerate segment");
        assert.ok(distance(s.start, p.center) <= 5 && distance(s.end, p.center) <= 5);
        const key = [s.start.join(","), s.end.join(",")].sort().join(";");
        assert.ok(!keys.has(key), "No visually identical options including reversed endpoints");
        keys.add(key);
      }
      const expected = p.segments.filter(s => oracleKind(s, p.center, 5) === p.target).map(s => s.id);
      assert.ok([1, 2].includes(expected.length));
      cardinalities[expected.length]++;
      expected.forEach(id => slots[p.target][LETTERS.indexOf(id)]++);
      assert.deepEqual(answerFor(p), expected);
      for (let mask = 1; mask < 16; mask++) {
        const response = LETTERS.filter((_, i) => mask & (1 << i));
        const correct = response.join() === expected.join();
        checked(p, response, true, correct);
        checked(p, response.reverse(), true, correct);
        counts.partsResponses += 2;
      }
      rejected(p, [["A", "A"], ["E"], ["none"], [0], ["a"], "A", new Set(expected), Array(2)]);
      const answer = answerFor(p);
      answer.push("E");
      assert.deepEqual(answerFor(p), expected);
    } else {
      assert.deepEqual(p.center, [0, 0]);
      assert.ok(Number.isInteger(p.radius) && p.radius >= 1 && p.radius <= 10);
      measurementKeys.add(`${p.radius}:${p.given}`);
      const expected = p.given === "radius" ? p.radius + p.radius : p.radius;
      for (let n = -2; n <= 30; n += 0.5) {
        checked(p, n, Number.isInteger(n) && n > 0, n === expected);
        counts.measureResponses++;
      }
      rejected(p, ["", " ", String(expected), `${expected}cm`, NaN, Infinity, -Infinity, true, false, {},
        [expected], 1n, new Number(expected), Number.MAX_VALUE]);
    }
    for (const lang of LANGS) {
      assert.ok(domain.names[lang].length > 0);
      const parts = promptPartsFor(p, lang);
      assert.equal(typeof parts.question, "string");
      assert.ok(Array.isArray(parts.conditions));
      assert.equal(promptFor(p, lang), [parts.question, ...parts.conditions].join(" "));
      for (const text of [parts.question, ...parts.conditions, hintFor(p, lang), solutionFor(p, lang)]) {
        assert.ok(text.length > 0);
        assert.ok(!/undefined|NaN|Infinity|\[object Object\]|\bpi\b|circumference|원의 넓이|원주율/i.test(text));
      }
      assert.deepEqual(optionLabels(p.domain, lang), p.domain === "parts" ? LETTERS.map(id => ({ id, label: id })) : []);
      counts.locales++;
    }
    for (const fn of [promptFor, hintFor, solutionFor, promptPartsFor]) assert.deepEqual(fn(p, "unknown"), fn(p, "ko"));
    for (const bad of [null, {}, { ...p, size: 6 }, { ...p, center: [NaN, 0] }, { ...p, radius: 0 }, { ...p, domain: "missing" }]) {
      checked(bad, answerFor(p), false, false);
      for (const fn of [answerFor, promptFor, promptPartsFor, hintFor, solutionFor]) assert.throws(() => fn(bad), RangeError);
    }
  }
  if (["center", "draw"].includes(domain.id)) {
    assert.equal(placements.size, 20);
    assert.ok(centers.size >= 12);
    assert.deepEqual([...radii].sort(), [1, 2, 3]);
  }
}
assert.equal(ids.size, 80);
assert.equal(measurementKeys.size, 20);
for (let radius = 1; radius <= 10; radius++) for (const given of ["radius", "diameter"]) assert.ok(measurementKeys.has(`${radius}:${given}`));
for (const target of ["radius", "diameter"]) {
  const bank = problemsFor("parts").filter(p => p.target === target);
  assert.equal(bank.length, 10);
  assert.equal(new Set(bank.map(p => answerFor(p).sort().join(","))).size, 10);
  assert.deepEqual(slots[target], [4, 4, 4, 4]);
}
const partsBank = problemsFor("parts");
for (let i = 0; i < partsBank.length; i += 2) {
  assert.equal(partsBank[i].target, "radius");
  assert.equal(partsBank[i + 1].target, "diameter");
  assert.notDeepEqual(answerFor(partsBank[i]).sort(), answerFor(partsBank[i + 1]).sort(),
    "Adjacent radius/diameter questions must not reuse the same answer IDs");
}
assert.deepEqual(cardinalities, { 1: 8, 2: 12 });
const parts = problemsFor("parts")[0];
for (const segments of [Array(4), parts.segments.slice(1), parts.segments.map(s => ({ ...s, id: "A" })),
  parts.segments.map(s => ({ ...s, start: [0, 0], end: [0, 0] })),
  parts.segments.map(s => ({ ...s, start: [0, 0], end: [5, 0] }))]) {
  checked({ ...parts, segments }, ["A"], false, false);
}
console.log(JSON.stringify({ passed: true, ...counts, slotAnswers: slots, answerCardinalities: cardinalities,
  learner_stage,
  "learner-fit": {
    language: LANGS,
    representations: "7 by 7 grid, separate circle diagrams, labeled cm lengths, fixed-radius compass construction",
    prerequisites: "Grid points, cm, doubling and halving even whole numbers",
    "reasoning-load": "One requested property per domain; one or two matching parts, no riddles or advanced circle formulas",
    "response-mode": "Point, complete unordered set, positive whole-number length, center and opening"
  },
  scope: "Mathematical and text checks only; parent owns source verification, independent oracle, rendering, trace-state QA and release"
}, null, 2));
