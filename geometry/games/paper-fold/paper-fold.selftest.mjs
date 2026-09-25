import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { levels, validateLevels, reflectPoint, foldedPolygon } from "./levels.js";
import { patternKey } from "./pattern-choices.js";
import { createPolygonMark } from "./mark-geometry.js";
import { seededRandom, sessionQueue, visualProblemKey } from "./session-order.js";

validateLevels();

assert.equal(levels.length, 2);
assert.deepEqual(levels.map((level) => level.title.ko), ["색종이 접어 자르기", "색종이 접어 구멍 뚫기"]);
assert.deepEqual(levels.map((level) => level.problems.length), [52, 36]);

const expectedInteractions = [
  new Set(["piece-count", "region-unfold", "connect-match"]),
  new Set(["hole-count", "hole-result", "mixed-hole-result", "connect-match"])
];
const ids = new Set();

levels.forEach((level, levelIndex) => {
  assert.deepEqual(new Set(level.problems.map((problem) => problem.interaction)), expectedInteractions[levelIndex]);
  level.problems.forEach((problem) => {
    assert.ok(!ids.has(problem.id), `duplicate id ${problem.id}`);
    ids.add(problem.id);
    assert.match(problem.sourceRef, /^user-reference\.(kinderfacto|paper-fold)/);
    assert.equal(problem.sourceCoverage, "partial");
    assert.ok(problem.sourceAuditRefs.length > 0);
    assert.ok(problem.sourceAuditRefs.every((id) => /^PF-[ABC]\d{2}$/.test(id)));

    if (problem.interaction === "region-unfold") {
      assert.ok([1, 2].includes(problem.folds.length));
      assert.equal(problem.completeOnUnfold, true);
      assert.deepEqual(problem.markStages.map((stage) => stage.length), Array.from({ length: problem.folds.length + 1 }, (_, index) => 2 ** index));
      assert.ok(problem.cutMarks.every((mark) => mark.kind === "polygon"));
      assert.deepEqual(problem.unfoldSteps.map((step) => step.answer), problem.folds.slice().reverse().map((step) => step.side));
    } else if (problem.interaction === "mixed-hole-result") {
      assert.equal(problem.folds.length, 2);
      assert.equal(problem.completeOnUnfold, true);
      assert.deepEqual(problem.markStages.map((stage) => stage.length), [2, 4, 8]);
      assert.deepEqual(new Set(problem.punches.map((mark) => mark.shape)), new Set(["square", "triangle"]));
      assert.deepEqual(problem.unfoldSteps.map((step) => step.answer), problem.folds.slice().reverse().map((step) => step.side));
    } else if (problem.interaction === "piece-count") {
      assert.ok([1, 2].includes(problem.folds.length));
      assert.equal(problem.unfoldSteps.length, problem.folds.length);
      assert.deepEqual(problem.unfoldSteps.map((step) => step.answer), problem.folds.slice().reverse().map((step) => step.side));
      assert.equal(problem.segmentStages.length, problem.folds.length + 1);
      assert.deepEqual(problem.segmentStages.at(-1), problem.unfoldedSegments);
      assert.equal(problem.choices.find((choice) => choice.key === problem.answer).value, problem.pieceCount);
      problem.unfoldedSegments.flat().forEach(({ x, y }) => assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1));
    } else if (problem.interaction === "hole-count") {
      assert.equal(problem.folds.length, 1);
      assert.equal(problem.unfoldSteps.length, 1);
      assert.equal(problem.unfoldSteps[0].answer, problem.folds[0].side);
      assert.equal(problem.pointStages.length, 2);
      assert.deepEqual(problem.pointStages.at(-1), problem.unfoldedPoints);
      assert.equal(problem.choices.find((choice) => choice.key === problem.answer).value, problem.unfoldedPoints.length);
    } else if (problem.interaction === "hole-result") {
      assert.equal(problem.folds.length, 2);
      assert.equal(problem.unfoldSteps.length, 2);
      assert.equal(problem.unfoldedPoints.length, 4);
      assert.deepEqual(problem.unfoldSteps.map((step) => step.answer), problem.folds.slice().reverse().map((step) => step.side));
      assert.deepEqual(problem.pointStages.map((stage) => stage.length), [1, 2, 4]);
      assert.deepEqual(problem.pointStages.at(-1), problem.unfoldedPoints);
      const correct = problem.choices.find((choice) => choice.key === problem.answer);
      assert.equal(correct.variant, "correct");
      assert.deepEqual(correct.points, problem.unfoldedPoints);
    } else {
      assert.equal(problem.interaction, "connect-match");
      assert.equal(problem.pairs.length, 3);
      assert.equal(problem.results.length, 3);
      assert.deepEqual(new Set(problem.results.map((item) => item.key)), new Set(problem.pairs.map((item) => item.key)));
      if (levelIndex === 0) assert.ok(problem.pairs.every((item) => item.kind === "pieces"));
      else assert.ok(problem.pairs.every((item) => item.kind.includes("holes")));
    }

    const specimen = problem.interaction === "connect-match" ? problem.pairs[0] : problem;
    for (const sample of problem.pairs || [problem]) {
      if (!sample.pointStages) continue;
      sample.pointStages.forEach((stage, index) => {
        const polygon = sample.stagePolygons[sample.folds.length - index];
        const signed = polygon.reduce((sum, a, n) => {
          const b = polygon[(n + 1) % polygon.length];
          return sum + a.x * b.y - b.x * a.y;
        }, 0);
        for (const hole of stage) {
          polygon.forEach((a, n) => {
            const b = polygon[(n + 1) % polygon.length];
            const distance = Math.sign(signed) * ((b.x - a.x) * (hole.y - a.y) - (b.y - a.y) * (hole.x - a.x)) / Math.hypot(b.x - a.x, b.y - a.y);
            assert.ok(distance >= .05 - 1e-8, `hole crosses paper edge: ${problem.id} stage ${index}`);
          });
        }
        stage.forEach((a, n) => stage.slice(n + 1).forEach((b) => assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= .1 - 1e-8, `overlapping holes: ${problem.id}`)));
      });
    }
    if (specimen.folds.length === 1) {
      const computed = specimen.stagePolygons.at(-1).map(({ x, y }) => `${x},${y}`).sort();
      const displayed = foldedPolygon(specimen.fold).map(({ x, y }) => `${x},${y}`).sort();
      assert.deepEqual(computed, displayed, `computed and displayed folded outlines differ for ${problem.id}`);
    }
    const pointToReflect = specimen.punches?.[0]?.center || specimen.punches?.[0] || specimen.cutMarks?.[0]?.points?.[0] || specimen.cutSegments?.[0]?.[0];
    if (pointToReflect) {
      const axis = specimen.folds.at(-1).axis;
      assert.deepEqual(reflectPoint(reflectPoint(pointToReflect, axis), axis), pointToReflect);
    }
  });
});

assert.equal(ids.size, 88);

const reflectIndependent = ({ x, y }, axis) => ({
  vertical: { x: 1 - x, y }, horizontal: { x, y: 1 - y },
  "diag-main": { x: y, y: x }, "diag-anti": { x: 1 - y, y: 1 - x }
})[axis];
const cutProblems = levels[0].problems.filter((item) => item.resultChoices);
for (const item of cutProblems) {
  let expected = item.cutMarks;
  for (const fold of [...item.folds].reverse()) expected = [...expected, ...expected.map((mark) => createPolygonMark(mark.points.map((p) => reflectIndependent(p, fold.axis))))];
  assert.equal(patternKey(item.markStages.at(-1)), patternKey(expected), `independent reflection ${item.id}`);
  assert.equal(new Set(item.resultChoices.map((choice) => patternKey(choice.marks))).size, 3);
  assert.equal(item.resultChoices.filter((choice) => patternKey(choice.marks) === patternKey(expected)).length, 1);
}
const oneFold = cutProblems.filter((p) => p.id.startsWith("paper-one-fold-pattern-"));
assert.equal(oneFold.length, 16);
assert.equal(new Set(oneFold.map((p) => JSON.stringify(p.folds) + patternKey(p.cutMarks))).size, 16);
for (const course of levels) {
  for (let seed = 0; seed < 30; seed += 1) {
    for (const count of [10, 20]) {
      const a = sessionQueue(course.problems, count, new Set(), seededRandom(seed));
      const b = sessionQueue(course.problems, count, new Set(), seededRandom(seed)).reverse();
      assert.equal(new Set(a.map((p) => p.id)).size, count);
      assert.equal(new Set(a.map(visualProblemKey)).size, count);
      assert.ok(a.every((p, index) => visualProblemKey(p) !== visualProblemKey(b[index])), "battle order has a same-position problem");
      assert.deepEqual(a.map((p) => p.id).sort(), b.map((p) => p.id).sort());
      for (const players of [2, 3, 4]) {
        const queues = Array.from({ length: players }, (_, index) => {
          const offset = index * Math.floor(count / players);
          return a.slice(offset).concat(a.slice(0, offset));
        });
        for (let index = 0; index < count; index += 1) assert.equal(new Set(queues.map((queue) => visualProblemKey(queue[index]))).size, players);
      }
    }
  }
  assert.throws(() => sessionQueue(course.problems, 10, new Set(course.problems.map((p) => p.id))), /POOL_EXHAUSTED/);
}

const coverage = await readFile(new URL("../../docs/25_PAPER_FOLD_SOURCE_COVERAGE.md", import.meta.url), "utf8");
const coverageIds = new Set([...coverage.matchAll(/\| (PF-[ABC]\d{2}) \|/g)].map((match) => match[1]));
const expectedCoverageIds = [
  ...Array.from({ length: 12 }, (_, index) => `PF-A${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 9 }, (_, index) => `PF-B${String(index + 1).padStart(2, "0")}`),
  ...Array.from({ length: 12 }, (_, index) => `PF-C${String(index + 1).padStart(2, "0")}`)
];
assert.deepEqual([...coverageIds].sort(), expectedCoverageIds.sort(), "the 33-source coverage matrix is incomplete");

console.log("Paper Fold self-test passed: 33 source pages, 88 problems, independent reflections, unique choices and 2/3/4-player orders across 120 seeded sets.");
