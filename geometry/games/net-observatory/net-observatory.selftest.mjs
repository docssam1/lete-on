import assert from "node:assert/strict";
import {
  levels, validateLevels, enumerateFreePolyominoes, canonicalCells,
  foldCubeNet, VALID_CUBE_NETS, INVALID_CUBE_NETS, SOLIDS
} from "./levels.js";

const result = validateLevels();
assert.equal(result.problems, 50);
assert.equal(result.hexominoes, 35);
assert.equal(result.cubeNets, 11);

const independentCanonical = (cells) => {
  const transforms = [];
  for (let reflect = 0; reflect < 2; reflect += 1) {
    for (let turn = 0; turn < 4; turn += 1) {
      let transformed = cells.map(([x, y]) => [reflect ? -x : x, y]);
      for (let step = 0; step < turn; step += 1) {
        transformed = transformed.map(([x, y]) => [-y, x]);
      }
      const minX = Math.min(...transformed.map(([x]) => x));
      const minY = Math.min(...transformed.map(([, y]) => y));
      transforms.push(transformed
        .map(([x, y]) => [x - minX, y - minY])
        .sort(([ax, ay], [bx, by]) => ax - bx || ay - by)
        .map(([x, y]) => `${x},${y}`)
        .join(";"));
    }
  }
  return transforms.sort()[0];
};

const independentShapes = (() => {
  let current = [new Set(["0,0"])];
  for (let size = 1; size < 6; size += 1) {
    const next = new Map();
    current.forEach((shape) => {
      shape.forEach((raw) => {
        const [x, y] = raw.split(",").map(Number);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const key = `${x + dx},${y + dy}`;
          if (shape.has(key)) return;
          const cells = [...shape, key].map((cell) => cell.split(",").map(Number));
          const canonical = independentCanonical(cells);
          next.set(canonical, new Set(cells.map((cell) => cell.join(","))));
        });
      });
    });
    current = [...next.values()];
  }
  return current.map((shape) => [...shape].map((cell) => cell.split(",").map(Number)));
})();

assert.equal(enumerateFreePolyominoes(6).length, independentShapes.length);
assert.equal(independentShapes.length, 35);
assert.equal(VALID_CUBE_NETS.length + INVALID_CUBE_NETS.length, 35);
assert.equal(new Set(VALID_CUBE_NETS.map(canonicalCells)).size, 11);
assert.ok(VALID_CUBE_NETS.every((shape) => foldCubeNet(shape).valid));
assert.ok(INVALID_CUBE_NETS.every((shape) => !foldCubeNet(shape).valid));

levels[0].problems.forEach((problem) => {
  assert.equal(problem.choices.filter((choice) => foldCubeNet(choice.cells).valid).length, 1, problem.id);
});

levels[2].problems.forEach((problem) => {
  if (problem.interaction === "dice-opposite") {
    assert.equal(problem.face + problem.answer, 7, problem.id);
  } else {
    const validPairs = problem.choices.filter(([a, b]) => a + b === 7);
    assert.equal(validPairs.length, 1, problem.id);
  }
});

SOLIDS.forEach((solid) => {
  assert.equal(solid.vertices - solid.edges + solid.faces, 2, solid.id);
  assert.equal(solid.faces * ({ triangle: 3, square: 4, pentagon: 5 }[solid.faceShape]) / 2, solid.edges, solid.id);
});

console.log(`net-observatory selftest: ${result.problems} problems, ${result.hexominoes} free hexominoes, ${result.cubeNets} valid cube nets`);
