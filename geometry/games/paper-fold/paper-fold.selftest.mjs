import assert from "node:assert/strict";
import { levels, validateLevels, reflectPoint } from "./levels.js";

validateLevels();

assert.equal(levels.length, 2);
assert.deepEqual(levels.map((level) => level.title.ko), ["색종이 접어 자르기", "색종이 접어 구멍 뚫기"]);
assert.ok(levels.every((level) => level.problems.length === 36));

const expectedInteractions = [
  new Set(["piece-count", "connect-match"]),
  new Set(["hole-count", "hole-result", "connect-match"])
];
const ids = new Set();

levels.forEach((level, levelIndex) => {
  assert.deepEqual(new Set(level.problems.map((problem) => problem.interaction)), expectedInteractions[levelIndex]);
  level.problems.forEach((problem) => {
    assert.ok(!ids.has(problem.id), `duplicate id ${problem.id}`);
    ids.add(problem.id);
    assert.ok(problem.sourceRef.startsWith("user-reference.kinderfacto"));

    if (problem.interaction === "piece-count") {
      assert.ok([1, 2].includes(problem.folds.length));
      assert.equal(problem.placementSteps.length, problem.folds.length);
      if (problem.folds.length === 1) assert.equal(problem.placementSteps[0].answer, problem.fold.side);
      else assert.deepEqual(problem.placementSteps.map((step) => step.answer), problem.folds.map((step) => step.target));
      assert.equal(problem.choices.find((choice) => choice.key === problem.answer).value, problem.pieceCount);
      problem.unfoldedSegments.flat().forEach(({ x, y }) => assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1));
    } else if (problem.interaction === "hole-count") {
      assert.equal(problem.folds.length, 1);
      assert.equal(problem.placementSteps.length, 1);
      assert.equal(problem.choices.find((choice) => choice.key === problem.answer).value, problem.unfoldedPoints.length);
    } else if (problem.interaction === "hole-result") {
      assert.equal(problem.folds.length, 2);
      assert.equal(problem.placementSteps.length, 2);
      assert.equal(problem.unfoldedPoints.length, 4);
      assert.deepEqual(problem.placementSteps.map((step, index) => step.answer), problem.folds.map((step) => step.target));
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
    const pointToReflect = specimen.punches?.[0] || specimen.cutSegments?.[0]?.[0];
    if (pointToReflect) {
      const axis = specimen.folds.at(-1).axis;
      assert.deepEqual(reflectPoint(reflectPoint(pointToReflect, axis), axis), pointToReflect);
    }
  });
});

assert.equal(ids.size, 72);
console.log("Paper Fold self-test passed: 2 courses, 72 source-linked problems, staged choices, counts, and matching verified.");
