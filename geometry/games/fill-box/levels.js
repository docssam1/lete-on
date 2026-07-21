// 큐브 박스 채우기 (Fill the Cube Box)
//
// A rectangular box of size box = [W, D, H] must be completely filled with unit
// cubes. Some cubes are already placed at the bottom of each column, given as
// placed[z][x] = the current stacked height of column (x, z) (0 <= height <= H).
// The child works out how many MORE cubes are needed to fill the box:
//
//   needed = W * D * H  -  (cubes already placed)
//
// Because cubes are stacked from the bottom of each column, the empty cells are
// exactly the top part of every column (height..H-1), so filling the box means
// completing each column up to the brim.

const makeProblem = (id, level, box, placed) => {
  const [width, depth, height] = box;
  if (placed.length !== depth || placed.some((row) => row.length !== width)) {
    throw new Error(`${id} footprint does not match the box`);
  }
  if (placed.some((row) => row.some((h) => h < 0 || h > height))) {
    throw new Error(`${id} has a column taller than the box`);
  }
  const capacity = width * depth * height;
  const placedCount = placed.flat().reduce((sum, value) => sum + value, 0);
  return {
    id,
    level,
    box,
    placed,
    capacity,
    placedCount,
    answer: { needed: capacity - placedCount }
  };
};

export const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("fill-l1-01", 1, [2, 2, 2], [[1, 1], [1, 1]]),
      makeProblem("fill-l1-02", 1, [2, 2, 2], [[2, 1], [1, 1]]),
      makeProblem("fill-l1-03", 1, [2, 2, 2], [[1, 1], [1, 0]]),
      makeProblem("fill-l1-04", 1, [3, 2, 2], [[1, 1, 1], [1, 1, 1]]),
      makeProblem("fill-l1-05", 1, [2, 2, 3], [[2, 2], [1, 1]])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("fill-l2-01", 2, [3, 2, 2], [[2, 1, 1], [1, 1, 0]]),
      makeProblem("fill-l2-02", 2, [3, 3, 2], [[2, 2, 1], [1, 1, 1], [1, 0, 0]]),
      makeProblem("fill-l2-03", 2, [3, 2, 3], [[3, 2, 1], [2, 1, 1]]),
      makeProblem("fill-l2-04", 2, [3, 3, 2], [[2, 2, 2], [1, 1, 1], [1, 1, 0]]),
      makeProblem("fill-l2-05", 2, [2, 2, 4], [[3, 2], [2, 1]])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("fill-l3-01", 3, [3, 3, 3], [[2, 2, 1], [2, 1, 1], [1, 1, 1]]),
      makeProblem("fill-l3-02", 3, [4, 3, 2], [[2, 2, 1, 1], [1, 1, 1, 0], [1, 1, 0, 0]]),
      makeProblem("fill-l3-03", 3, [3, 3, 3], [[3, 2, 1], [2, 2, 1], [1, 1, 1]]),
      makeProblem("fill-l3-04", 3, [4, 4, 2], [[2, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 0], [1, 1, 0, 0]]),
      makeProblem("fill-l3-05", 3, [3, 3, 3], [[2, 2, 2], [2, 2, 1], [1, 1, 1]])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("fill-l4-01", 4, [4, 4, 3], [[3, 2, 2, 1], [2, 2, 1, 1], [2, 1, 1, 1], [1, 1, 1, 0]]),
      makeProblem("fill-l4-02", 4, [4, 3, 4], [[4, 3, 2, 1], [3, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("fill-l4-03", 4, [4, 4, 4], [[4, 3, 3, 2], [3, 3, 2, 2], [3, 2, 2, 1], [2, 2, 1, 1]]),
      makeProblem("fill-l4-04", 4, [4, 4, 3], [[3, 3, 2, 2], [2, 2, 2, 1], [2, 1, 1, 1], [1, 1, 1, 1]]),
      makeProblem("fill-l4-05", 4, [4, 4, 4], [[4, 4, 3, 2], [3, 3, 2, 2], [2, 2, 2, 1], [2, 1, 1, 1]])
    ]
  }
];

// The empty cells that must be filled — used by the "빈칸 보기" preview and the
// fill-on-success reveal, so the same rule that scores the answer decides what
// gets filled.
export function emptyCells(box, placed) {
  const [width, depth, height] = box;
  const cells = [];
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      for (let y = placed[z][x]; y < height; y += 1) cells.push({ x, y, z });
    }
  }
  return cells;
}

export function validateLevels() {
  if (levels.length !== 4) throw new Error("fill-box requires four levels");
  levels.forEach((level) => {
    if (level.problems.length !== 5) throw new Error(`level ${level.level} requires five problems`);
    level.problems.forEach((problem) => {
      const [width, depth, height] = problem.box;
      if (width > 4 || depth > 4 || height > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.answer.needed !== emptyCells(problem.box, problem.placed).length) {
        throw new Error(`${problem.id} has an inconsistent needed count`);
      }
      if (problem.answer.needed < 1) throw new Error(`${problem.id} is already full`);
    });
  });
}
