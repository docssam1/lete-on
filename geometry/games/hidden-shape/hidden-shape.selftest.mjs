import assert from "node:assert/strict";
import { levels, countFan, countSquareGrid, countRectangles, countTriangleGrid, resultFor, validateLevels } from "./levels.js";

assert.deepEqual(validateLevels(), []);
assert.equal(levels.length, 5);
assert.equal(levels.flatMap((level) => level.problems).length, 50);
assert.equal(countFan(4, 0).total, 6);
assert.equal(countFan(4, 2).total, 18);
assert.deepEqual(countFan(7, 0).byWidth.map((item) => item.count), [6,5,4,3,2,1]);
assert.equal(countFan(7, 0).total, 21);
assert.equal(countSquareGrid(3).total, 14);
assert.equal(countRectangles([[0,0],[1,0],[0,1],[1,1]]).total, 9);
assert.deepEqual(countTriangleGrid(3), {
  total: 13,
  upward: 10,
  downward: 3,
  upwardBySize: [{ size:1,count:6 },{ size:2,count:3 },{ size:3,count:1 }],
  downwardBySize: [{ size:1,count:3 }]
});

for (const level of levels) {
  for (const problem of level.problems) {
    assert.equal(resultFor(problem).total, problem.answer, problem.id);
    assert.equal(problem.choices[problem.answerIndex], problem.answer, problem.id);
    assert.equal(problem.choices.filter((choice) => choice === problem.answer).length, 1, problem.id);
  }
}

console.log("hidden-shape selftest: 5 levels, 50 verified problems");
