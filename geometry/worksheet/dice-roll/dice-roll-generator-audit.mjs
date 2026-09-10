import assert from "node:assert/strict";
import { ACTIVITIES, chooseProblems, groupPages, normalizeActivities, normalizeCount } from "./workbook-core.js";
import { directionInfo, roll, visibleFaces } from "../../games/dice-roll/levels.js";

function verifyBoard(board) {
  assert.equal(board.path.length, board.directions.length + 1);
  assert.equal(new Set(board.path.map((point) => point.join(","))).size, board.path.length, "route revisits a cell");
  let orientation = board.startOrientation;
  const bottoms = [];
  board.directions.forEach((direction, index) => {
    const [row, column] = board.path[index];
    const { dr, dc } = directionInfo[direction];
    assert.deepEqual(board.path[index + 1], [row + dr, column + dc]);
    assert.ok(row + dr >= 0 && row + dr < board.rows && column + dc >= 0 && column + dc < board.cols);
    orientation = roll(orientation, direction);
    bottoms.push(orientation.bottom);
  });
  assert.deepEqual(board.bottomValues, bottoms);
  assert.deepEqual(board.finalOrientation, orientation);
  assert.equal(board.startOrientation.top + board.startOrientation.bottom, 7);
  assert.equal(board.startOrientation.north + board.startOrientation.south, 7);
  assert.equal(board.startOrientation.east + board.startOrientation.west, 7);
}

function verify(problem) {
  problem.boards.forEach(verifyBoard);
  const board = problem.boards[0];
  if (problem.activity === "sequence") assert.equal(problem.answer, board.bottomValues.join(" → "));
  if (problem.activity === "target") assert.equal(Number(problem.answer), board.bottomValues.at(-1));
  if (problem.activity === "sum") assert.equal(Number(problem.answer), problem.targetSteps.reduce((sum, index) => sum + board.bottomValues[index], 0));
  if (problem.activity === "paired") {
    assert.equal(problem.boards[0].bottomValues.at(-1), problem.boards[1].bottomValues.at(-1));
    assert.equal(problem.answer, visibleFaces(problem.boards[1].startOrientation)[problem.unknownFace]);
  }
  if (problem.activity === "visible") assert.deepEqual(problem.answer, visibleFaces(board.finalOrientation));
}

for (const activity of ACTIVITIES) {
  for (const level of [2, 3, 4, 5]) {
    const signatures = new Set();
    for (let round = 0; round < 15; round += 1) {
      const problems = chooseProblems(activity.id, 20, { level, seed: 20260910, round });
      assert.equal(problems.length, 20);
      assert.equal(groupPages(problems).length, 10);
      problems.forEach((problem) => {
        verify(problem);
        signatures.add(JSON.stringify(problem.boards.map((board) => [board.start, board.directions, board.startOrientation])) + JSON.stringify(problem.targetSteps) + problem.unknownFace);
      });
    }
    assert.ok(signatures.size >= 250, `${activity.id} level ${level} lacks variation: ${signatures.size}`);
  }
}

assert.equal(normalizeCount(0), 1);
assert.equal(normalizeCount(21), 20);
assert.equal(chooseProblems("all", 20, { level: 5, seed: 7 }).length, 20);
assert.deepEqual(normalizeActivities("visible.sequence.visible"), ["sequence", "visible"]);
const mixedSelection = chooseProblems(["sequence", "visible"], 20, { level: 5, seed: 17 });
assert.deepEqual([...new Set(mixedSelection.map((problem) => problem.activity))].sort(), ["sequence", "visible"]);
assert.equal(mixedSelection.filter((problem) => problem.activity === "sequence").length, 10);
assert.equal(mixedSelection.filter((problem) => problem.activity === "visible").length, 10);
console.log("DICE_ROLL_GENERATOR_AUDIT_OK activities=5 levels=4 samples=6000 per-sheet=20 pages=10");
