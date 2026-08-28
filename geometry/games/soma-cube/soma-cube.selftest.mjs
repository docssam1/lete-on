import assert from "node:assert/strict";
import {
  CUBE_TARGET,
  PIECES,
  ROTATIONS,
  canonical,
  canonicalArrangement,
  levels,
  problemSignature,
  validateLevels
} from "./levels.js";

const cellKey = (cell) => cell.join(",");
const target = new Set(CUBE_TARGET.map(cellKey));

assert.deepEqual(validateLevels(), { rotations: 24, cubeSolutions: 40, problems: 50 });
assert.equal(ROTATIONS.length, 24);
assert.equal(PIECES.reduce((sum, piece) => sum + piece.cells.length, 0), 27);
assert.equal(new Set(PIECES.map((piece) => canonical(piece.cells))).size, 7);
assert.deepEqual(levels.map((level) => level.stage), ["키즈", "Pre", "입문", "초급", "중급"]);

for (const level of levels) {
  assert.equal(level.problems.length, 10, `level ${level.id} problem count`);
  assert.equal(new Set(level.problems.map(problemSignature)).size, 10, `level ${level.id} challenge uniqueness`);

  for (const problem of level.problems) {
    if (problem.mode === "recognize") {
      const targetShape = canonical(problem.target);
      assert.equal(problem.options.filter((option) => canonical(option) === targetShape).length, 1, `${problem.id} answer uniqueness`);
      continue;
    }

    const occupied = new Set();
    for (const placement of problem.fixed || []) {
      assert.ok(placement.cells.some(([x, y, z]) => y === 0 || occupied.has(cellKey([x, y - 1, z]))), `${problem.id} fixed support`);
      for (const cell of placement.cells) {
        assert.ok(target.has(cellKey(cell)), `${problem.id} fixed cell outside cube`);
        assert.ok(!occupied.has(cellKey(cell)), `${problem.id} fixed overlap`);
        occupied.add(cellKey(cell));
      }
    }

    if (level.id === 5) {
      assert.equal(problem.verifiedAssemblies.length, 2, `${problem.id} verified assembly pair`);
      assert.equal(new Set(problem.verifiedAssemblies.map(canonicalArrangement)).size, 2, `${problem.id} distinct assembly pair`);
      for (const assembly of problem.verifiedAssemblies) {
        const cells = assembly.flatMap((placement) => placement.cells.map(cellKey));
        assert.equal(cells.length, 27, `${problem.id} assembly volume`);
        assert.equal(new Set(cells).size, 27, `${problem.id} assembly overlap`);
        assert.ok(cells.every((cell) => target.has(cell)), `${problem.id} assembly outside cube`);
      }
    }
  }
}

assert.deepEqual([...new Set(levels[3].problems.map((problem) => problem.fixed.length))].sort(), [2, 3, 4]);
assert.deepEqual([...new Set(levels[4].problems.map((problem) => problem.fixed.length))].sort(), [1, 2]);

console.log("Soma Cube self-test passed: 5 stages, 50 unique challenges, 24 rotations, two verified final assemblies.");
