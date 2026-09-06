import assert from "node:assert/strict";
import { levels, levelMeta, pointsKey, transformPoints, expectedFor, validateLevels } from "./levels.js";
import { auditDomainContent, independentAnswer } from "./domain-content-audit.mjs";

assert.equal(validateLevels(), true);
assert.equal(levels.reduce((sum, level) => sum + level.problems.length, 0), 50);
assert.deepEqual(levels.map((level) => level.problems.length), [10, 10, 10, 10, 10]);
assert.deepEqual(levels.map((level) => level.band), ["facto1", "1031-intro-entry", "1031-intro-entry", "1031-basic", "1031-basic"]);
assert.deepEqual(levels.map((level) => level.problems.filter((problem) => problem.closed).length), [5, 5, 5, 5, 5]);
assert.deepEqual(levelMeta.map((level) => level.id), [1, 2, 3, 4, 5]);

// Literal examples fix screen-coordinate handedness and the specified pivot.
const fixture = [[50,50],[30,50],[30,20]];
assert.deepEqual(transformPoints(fixture, { angle: 90, pivot: [50,50] }), [[50,50],[50,30],[80,30]]);
assert.deepEqual(transformPoints(fixture, { angle: -90, pivot: [50,50] }), [[50,50],[50,70],[20,70]]);
assert.deepEqual(transformPoints(fixture, { angle: 180, pivot: [50,50] }), [[50,50],[70,50],[70,80]]);
assert.deepEqual(transformPoints([[40,42],[60,54]], { scale: 2, pivot: [50,50] }), [[30,34],[70,58]]);
assert.deepEqual(transformPoints([[14,18],[86,82]], { scale: .5, pivot: [50,50] }), [[32,34],[68,66]]);
assert.deepEqual(transformPoints(fixture, { dx: 20, dy: -10 }), [[70,40],[50,40],[50,10]]);
assert.deepEqual(transformPoints([[10,10],[30,10]], { angle: 180 }), [[30,10],[10,10]], "legacy default pivot is the vertex mean");
assert.equal(pointsKey([[1.23456,2],[3,4]]), "1.235,2|3,4", "ordered key precision stays compatible");

const snapshot = JSON.stringify(levels);
const report = auditDomainContent();
assert.equal(report.problems, 50);
assert.equal(report.paths, 200);
assert.equal(report.distinctSeeds, 50);

for (const level of levels) {
  for (const problem of level.problems) {
    assert.equal(new Set(problem.choices.map(pointsKey)).size, 3);
    assert.ok(problem.sourceRef.startsWith("owner-designed-"));
    assert.deepEqual(expectedFor(problem), independentAnswer(problem), `${problem.id}: independent answer agrees`);
    const original = structuredClone(problem.target);
    transformPoints(problem.target, problem.operation);
    assert.deepEqual(problem.target, original, "transform helper must not mutate its input");
    if (level.id === 2) {
      assert.deepEqual(transformPoints(expectedFor(problem), { dx: -problem.operation.dx, dy: -problem.operation.dy }), problem.target);
    } else if (level.id >= 3) {
      const inverse = level.id === 3 ? { angle: -problem.operation.angle, pivot: [50,50] } : { scale: 1 / problem.operation.scale, pivot: [50,50] };
      assert.deepEqual(transformPoints(expectedFor(problem), inverse), problem.target, `${problem.id}: inverse operation`);
    }
  }
}

const withoutExplanations = structuredClone(levels);
withoutExplanations.forEach((level) => level.problems.forEach((p) => delete p.explanation));
assert.equal(validateLevels(withoutExplanations), true, "explanation metadata is optional for consumers");

let negativeControls = 0;
function reject(name, change, pattern = /./) {
  const bank = structuredClone(levels);
  change(bank);
  assert.throws(() => validateLevels(bank), pattern, `${name}: runtime validator`);
  assert.throws(() => auditDomainContent(bank), /./, `${name}: independent auditor`);
  negativeControls++;
}

const wrongIndex = (p) => (p.answerIndex + 1) % 3;
const moveSection = (points) => points.map(([x, y], i) => [x + (i === 1 || i === 2 ? 4 : 0), y]);

reject("missing domain", (bank) => bank.pop(), /five levels/);
reject("missing problem", (bank) => bank[0].problems.pop(), /Invalid shape-transform level/);
reject("duplicate ID", (bank) => { bank[0].problems[1].id = bank[0].problems[0].id; }, /duplicate problem id/);
reject("wrong domain", (bank) => { bank[1].problems[0].level = 1; }, /Invalid domain/);
reject("wrong alternation", (bank) => { bank[0].problems[0].closed = false; }, /alternation/);
reject("unsupported provenance claim", (bank) => { bank[0].problems[0].sourceRef = "copied-textbook"; }, /source reference/);
reject("negative answer index", (bank) => { bank[0].problems[0].answerIndex = -1; }, /answer index/);
reject("bounds", (bank) => { bank[0].problems[0].target[0][0] = 5; }, /6\.\.94/);
reject("nonfinite coordinate", (bank) => { bank[0].problems[0].target[0][0] = NaN; }, /6\.\.94/);
reject("repeated vertex", (bank) => { const p = bank[0].problems[0]; p.target[1] = [...p.target[0]]; }, /Repeated vertex/);
reject("straight degenerate bend", (bank) => { const p = bank[0].problems[0]; p.target.splice(1, 0, [40,18]); }, /Degenerate/);
reject("orthogonal crossing", (bank) => { bank[0].problems[0].target = [[20,20],[70,20],[70,70],[40,70],[40,10],[80,10],[80,80],[20,80]]; }, /Self-intersection/);
reject("visually repeated closed answer", (bank) => {
  const p = bank[0].problems[0], correct = p.choices[p.answerIndex];
  p.choices[wrongIndex(p)] = [...correct.slice(2), ...correct.slice(0, 2)].reverse();
}, /visually unique/);
reject("reversed open answer", (bank) => { const p = bank[0].problems[1]; p.choices[wrongIndex(p)] = [...p.choices[p.answerIndex]].reverse(); }, /visually unique/);
reject("observation hiding an enlargement", (bank) => { bank[0].problems[0].operation.scale = 1.1; }, /Unexpected operation component/);
reject("observation global move", (bank) => {
  const p = bank[0].problems[0];
  p.choices[wrongIndex(p)] = p.target.map(([x, y]) => [x + 4, y]);
}, /one internal bent section/);
reject("translation off grid", (bank) => { bank[1].problems[0].operation.dx = 9; }, /10-unit vector/);
reject("zero translation", (bank) => { bank[1].problems[0].operation.dx = 0; }, /10-unit vector/);
reject("translation with hidden turn", (bank) => { bank[1].problems[0].operation.angle = 90; }, /Unexpected operation component/);
reject("missing rotation pivot", (bank) => { delete bank[2].problems[0].operation.pivot; }, /Explicit pivot/);
reject("incorrect rotation pivot", (bank) => { bank[2].problems[0].operation.pivot = [40,50]; }, /Explicit pivot/);
reject("unsupported rotation", (bank) => { bank[2].problems[0].operation.angle = 45; }, /rotation angle/);
reject("clockwise answer mislabeled counterclockwise", (bank) => { const p = bank[2].problems[0]; p.answerIndex = p.choices.findIndex((c) => equalPoints(c, independentAnswer({ ...p, operation: { ...p.operation, angle: -90 } }))); }, /Single-answer failure/);
reject("enlargement factor drift", (bank) => { bank[3].problems[0].operation.scale = 1.34; }, /scale factor/);
reject("reduction factor drift", (bank) => { bank[4].problems[0].operation.scale = .64; }, /scale factor/);
reject("missing enlargement pivot", (bank) => { delete bank[3].problems[0].operation.pivot; }, /Explicit pivot/);
reject("missing reduction pivot", (bank) => { delete bank[4].problems[0].operation.pivot; }, /Explicit pivot/);

function equalPoints(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

for (let levelIndex = 0; levelIndex < 5; levelIndex++) {
  reject(`wrong recorded answer in domain ${levelIndex + 1}`, (bank) => { const p = bank[levelIndex].problems[0]; p.answerIndex = wrongIndex(p); }, /Single-answer failure/);
  reject(`duplicate seed in domain ${levelIndex + 1}`, (bank) => { const p = bank[levelIndex].problems[0]; bank[levelIndex].problems[2] = { ...structuredClone(p), id: `duplicate-seed-${levelIndex}` }; }, /Duplicate seed geometry/);
}

for (let levelIndex = 1; levelIndex < 5; levelIndex++) {
  reject(`fake kink-matching distractor in domain ${levelIndex + 1}`, (bank) => {
    const p = bank[levelIndex].problems[0];
    const originalWrong = p.choices.findIndex((choice, i) => i !== p.answerIndex && !equalPoints(choice, p.target));
    p.choices[originalWrong] = moveSection(p.target);
  }, /preserve shape|wrong turn|only one axis/);
}

assert.equal(JSON.stringify(levels), snapshot, "audits and negative controls must not mutate the exported bank");

console.log(`Shape transform passed: 5 domains, 50 distinct seeds, 200 safe paths, ${negativeControls} negative controls rejected by both validators.`);
console.log(JSON.stringify(report));
