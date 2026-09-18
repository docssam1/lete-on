import assert from "node:assert/strict";
import { levels, validateLevels, reflectPoint, unfoldedPolygon } from "./levels.js";

validateLevels();

assert.equal(levels.length, 2);
assert.deepEqual(levels.map((level) => level.title.ko), ["색종이 접어 자르기", "대각선으로 접어 자르기"]);
assert.ok(levels.every((level) => level.problems.length === 36));

const ids = new Set();
for (const level of levels) {
  const counts = { "result-choice": 0, "connect-match": 0 };
  for (const problem of level.problems) {
    assert.ok(!ids.has(problem.id), `duplicate id ${problem.id}`);
    ids.add(problem.id);
    assert.equal(problem.folds.length, 1, `multiple folds found in ${problem.id}`);
    assert.equal(problem.fold, problem.folds[0]);
    assert.ok(problem.sourceRef.startsWith("user-reference.kinderfacto.single-fold"));
    counts[problem.interaction] += 1;

    const first = problem.interaction === "connect-match" ? problem.pairs[0] : problem;
    const polygon = unfoldedPolygon(first.cut, first.fold);
    assert.ok(polygon.length >= first.cut.length + 1, `unfolded polygon is incomplete: ${problem.id}`);
    assert.deepEqual(reflectPoint(reflectPoint(first.cut[1], first.fold.axis), first.fold.axis), first.cut[1]);
    const specimens = problem.interaction === "connect-match" ? problem.pairs : [problem, ...problem.choices];
    specimens.forEach((specimen) => specimen.cut.forEach(({ x, y }) => {
      assert.ok(x >= 0 && x <= 1 && y >= 0 && y <= 1, `cut leaves paper in ${problem.id}: ${x},${y}`);
    }));

    if (problem.interaction === "result-choice") {
      assert.equal(problem.choices.length, 3);
      const correct = problem.choices.find((choice) => choice.key === problem.answer);
      assert.equal(correct.profileId, problem.profileId);
      assert.equal(correct.variant, "correct");
      assert.deepEqual(new Set(problem.choices.map((choice) => choice.profileId)), new Set([problem.profileId]));
      assert.deepEqual(new Set(problem.choices.map((choice) => choice.variant)), new Set(["correct", "shallow", "shifted"]));
    } else {
      assert.equal(problem.pairs.length, 3);
      assert.equal(problem.results.length, 3);
      assert.deepEqual(new Set(problem.results.map((item) => item.key)), new Set(problem.pairs.map((item) => item.key)));
    }
  }
  assert.ok(counts["result-choice"] >= 20);
  assert.ok(counts["connect-match"] >= 10);
}

assert.equal(ids.size, 72);
console.log("Paper Fold self-test passed: 2 single-fold types, 72 generated problems, choice and line matching verified.");
