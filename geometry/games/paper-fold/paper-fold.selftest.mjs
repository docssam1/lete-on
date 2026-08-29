import assert from "node:assert/strict";
import { levels, validateLevels } from "./levels.js";

validateLevels();

const reflect = (region, axis) => {
  const match = /^r([1-4])c([1-4])(?:-(ne|nw|se|sw))?$/.exec(region);
  assert.ok(match, `invalid region ${region}`);
  const row = Number(match[1]);
  const col = Number(match[2]);
  const part = match[3];
  const next = {
    vertical: [row, 5 - col],
    horizontal: [5 - row, col],
    "diag-main": [col, row],
    "diag-anti": [5 - col, 5 - row]
  }[axis];
  const corner = {
    vertical: { nw: "ne", ne: "nw", sw: "se", se: "sw" },
    horizontal: { nw: "sw", sw: "nw", ne: "se", se: "ne" },
    "diag-main": { nw: "nw", ne: "sw", sw: "ne", se: "se" },
    "diag-anti": { nw: "se", ne: "ne", sw: "sw", se: "nw" }
  };
  return `r${next[0]}c${next[1]}${part ? `-${corner[axis][part]}` : ""}`;
};

const unfold = (regions, folds) => folds.reduce(
  (current, step) => [...new Set(current.flatMap((region) => [region, reflect(region, step.axis)]))],
  [...regions]
);

function stackTop(values, folds) {
  let board = values.map((row) => row.map((value) => [value]));
  for (const step of folds) {
    const rows = board.length;
    const cols = board[0].length;
    if (step.axis === "vertical") {
      const half = cols / 2;
      board = board.map((row) => Array.from({ length: half }, (_, col) => {
        const target = step.side === "left" ? row[half + col] : row[col];
        const moving = step.side === "left" ? row[half - 1 - col] : row[cols - 1 - col];
        return target.concat(moving.slice().reverse());
      }));
    } else {
      const half = rows / 2;
      board = Array.from({ length: half }, (_, row) => Array.from({ length: cols }, (_, col) => {
        const target = step.side === "top" ? board[half + row][col] : board[row][col];
        const moving = step.side === "top" ? board[half - 1 - row][col] : board[rows - 1 - row][col];
        return target.concat(moving.slice().reverse());
      }));
    }
  }
  assert.equal(board.length, 1);
  assert.equal(board[0].length, 1);
  return board[0][0].at(-1);
}

assert.deepEqual(levels.map((level) => level.difficulty), ["입문", "입문", "초급", "초급", "중급"]);
assert.deepEqual(levels.map((level) => level.problems.length), [10, 10, 10, 10, 10]);

const ids = new Set();
for (const level of levels) {
  for (const problem of level.problems) {
    assert.ok(!ids.has(problem.id), `duplicate id ${problem.id}`);
    ids.add(problem.id);
    assert.ok(problem.sourceRef, `missing sourceRef ${problem.id}`);

    if (["grid-select", "punch-select"].includes(problem.interaction)) {
      assert.deepEqual(new Set(problem.targetRegions), new Set(unfold(problem.sourceRegions, problem.folds)), `unfold mismatch ${problem.id}`);
    }

    if (problem.interaction === "cut-number-sum") {
      const cells = problem.answer.cells;
      assert.deepEqual(new Set(cells), new Set(unfold(problem.cutRegions, problem.folds)), `number cells mismatch ${problem.id}`);
      const values = cells.map((region) => {
        const match = /^r([1-4])c([1-4])/.exec(region);
        return problem.grid.values[Number(match[1]) - 1][Number(match[2]) - 1];
      });
      assert.deepEqual(problem.answer.values, values, `number values mismatch ${problem.id}`);
      assert.equal(problem.answer.sum, values.reduce((sum, value) => sum + value, 0), `number sum mismatch ${problem.id}`);
    }

    if (problem.interaction === "top-choice") {
      assert.equal(problem.answer, String(stackTop(problem.topGrid, problem.folds)), `top layer mismatch ${problem.id}`);
      assert.equal(problem.condition, "same-number-on-both-sides");
      assert.match(problem.sourceAdaptation, /top-color adapted/);
    }
  }
}

assert.equal(ids.size, 50);
console.log("Paper Fold self-test passed: 5 distinct strands, 50 verified problems.");
