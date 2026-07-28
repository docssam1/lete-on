import { sessionProblems } from "../../shared/problem-pool.js";

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

const pools = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("fill-l1-01", 1, [2, 2, 2], [[1, 1], [1, 1]]),
      makeProblem("fill-l1-02", 1, [2, 2, 2], [[2, 1], [1, 1]]),
      makeProblem("fill-l1-03", 1, [2, 2, 2], [[1, 1], [1, 0]]),
      makeProblem("fill-l1-04", 1, [3, 2, 2], [[1, 1, 1], [1, 1, 1]]),
      makeProblem("fill-l1-05", 1, [2, 2, 3], [[2, 2], [1, 1]]),
      makeProblem("fill-l1-06", 1, [2, 2, 2], [[1, 0], [2, 1]]),
      makeProblem("fill-l1-07", 1, [2, 2, 2], [[1, 1], [2, 1]]),
      makeProblem("fill-l1-08", 1, [3, 2, 2], [[0, 1, 2], [1, 0, 2]]),
      makeProblem("fill-l1-09", 1, [2, 2, 2], [[0, 2], [0, 0]]),
      makeProblem("fill-l1-10", 1, [2, 2, 2], [[1, 0], [0, 1]]),
      makeProblem("fill-l1-11", 1, [2, 2, 3], [[3, 1], [2, 0]]),
      makeProblem("fill-l1-12", 1, [2, 2, 2], [[2, 1], [0, 0]]),
      makeProblem("fill-l1-13", 1, [2, 2, 2], [[1, 0], [1, 1]]),
      makeProblem("fill-l1-14", 1, [2, 2, 2], [[0, 1], [1, 2]]),
      makeProblem("fill-l1-15", 1, [2, 2, 2], [[0, 2], [1, 2]]),
      makeProblem("fill-l1-16", 1, [2, 2, 2], [[0, 0], [2, 1]]),
      makeProblem("fill-l1-17", 1, [3, 2, 2], [[1, 2, 2], [0, 0, 2]]),
      makeProblem("fill-l1-18", 1, [2, 2, 2], [[1, 1], [1, 2]]),
      makeProblem("fill-l1-19", 1, [2, 2, 2], [[0, 1], [2, 2]]),
      makeProblem("fill-l1-20", 1, [2, 2, 3], [[2, 1], [2, 2]])
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
      makeProblem("fill-l2-05", 2, [2, 2, 4], [[3, 2], [2, 1]]),
      makeProblem("fill-l2-06", 2, [3, 2, 2], [[0, 1, 1], [1, 2, 1]]),
      makeProblem("fill-l2-07", 2, [3, 2, 2], [[0, 1, 0], [0, 0, 1]]),
      makeProblem("fill-l2-08", 2, [3, 2, 2], [[1, 2, 0], [0, 0, 1]]),
      makeProblem("fill-l2-09", 2, [3, 2, 3], [[0, 0, 2], [1, 3, 3]]),
      makeProblem("fill-l2-10", 2, [3, 2, 3], [[2, 3, 2], [0, 2, 1]]),
      makeProblem("fill-l2-11", 2, [3, 2, 3], [[1, 2, 3], [0, 1, 2]]),
      makeProblem("fill-l2-12", 2, [3, 2, 2], [[0, 1, 0], [1, 2, 2]]),
      makeProblem("fill-l2-13", 2, [3, 2, 3], [[0, 1, 2], [1, 2, 2]]),
      makeProblem("fill-l2-14", 2, [2, 2, 4], [[1, 1], [4, 3]]),
      makeProblem("fill-l2-15", 2, [3, 2, 2], [[1, 0, 0], [0, 2, 0]]),
      makeProblem("fill-l2-16", 2, [3, 2, 2], [[1, 2, 0], [1, 1, 0]]),
      makeProblem("fill-l2-17", 2, [3, 2, 2], [[2, 1, 0], [1, 0, 0]]),
      makeProblem("fill-l2-18", 2, [2, 2, 4], [[2, 0], [3, 3]]),
      makeProblem("fill-l2-19", 2, [3, 2, 2], [[0, 0, 0], [2, 0, 1]]),
      makeProblem("fill-l2-20", 2, [2, 2, 4], [[2, 1], [2, 1]])
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
      makeProblem("fill-l3-05", 3, [3, 3, 3], [[2, 2, 2], [2, 2, 1], [1, 1, 1]]),
      makeProblem("fill-l3-06", 3, [4, 3, 2], [[0, 1, 1, 2], [0, 0, 0, 1], [0, 0, 0, 0]]),
      makeProblem("fill-l3-07", 3, [3, 3, 3], [[1, 2, 3], [0, 1, 1], [1, 0, 0]]),
      makeProblem("fill-l3-08", 3, [3, 3, 3], [[0, 0, 1], [1, 1, 3], [0, 0, 2]]),
      makeProblem("fill-l3-09", 3, [4, 4, 2], [[0, 1, 2, 1], [1, 1, 2, 1], [0, 1, 1, 1], [0, 1, 1, 1]]),
      makeProblem("fill-l3-10", 3, [3, 3, 3], [[2, 0, 0], [3, 2, 0], [1, 2, 1]]),
      makeProblem("fill-l3-11", 3, [4, 3, 2], [[1, 0, 0, 0], [2, 2, 0, 0], [1, 0, 0, 0]]),
      makeProblem("fill-l3-12", 3, [4, 3, 2], [[0, 0, 0, 1], [0, 1, 2, 0], [0, 1, 1, 1]]),
      makeProblem("fill-l3-13", 3, [4, 3, 2], [[1, 0, 0, 0], [1, 0, 0, 0], [2, 1, 1, 0]]),
      makeProblem("fill-l3-14", 3, [3, 3, 3], [[2, 1, 2], [2, 1, 3], [0, 1, 2]]),
      makeProblem("fill-l3-15", 3, [3, 3, 3], [[1, 1, 0], [2, 1, 0], [3, 3, 1]]),
      makeProblem("fill-l3-16", 3, [3, 3, 3], [[0, 0, 1], [0, 1, 3], [2, 2, 2]]),
      makeProblem("fill-l3-17", 3, [4, 3, 2], [[0, 2, 2, 2], [0, 0, 1, 0], [0, 0, 1, 0]]),
      makeProblem("fill-l3-18", 3, [3, 3, 3], [[3, 1, 0], [0, 2, 0], [1, 2, 1]]),
      makeProblem("fill-l3-19", 3, [4, 3, 2], [[0, 0, 1, 0], [0, 0, 0, 1], [1, 0, 1, 2]]),
      makeProblem("fill-l3-20", 3, [4, 3, 2], [[0, 0, 0, 1], [0, 1, 1, 0], [0, 1, 2, 1]])
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
      makeProblem("fill-l4-05", 4, [4, 4, 4], [[4, 4, 3, 2], [3, 3, 2, 2], [2, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("fill-l4-06", 4, [4, 4, 3], [[0, 2, 2, 2], [1, 2, 3, 3], [0, 1, 2, 2], [0, 0, 1, 2]]),
      makeProblem("fill-l4-07", 4, [4, 3, 4], [[0, 0, 0, 2], [1, 1, 2, 3], [0, 2, 3, 3]]),
      makeProblem("fill-l4-08", 4, [4, 4, 4], [[4, 4, 4, 3], [3, 2, 3, 2], [2, 1, 2, 1], [1, 0, 1, 0]]),
      makeProblem("fill-l4-09", 4, [4, 4, 3], [[0, 0, 1, 1], [0, 0, 2, 1], [0, 2, 3, 2], [0, 1, 2, 2]]),
      makeProblem("fill-l4-10", 4, [4, 3, 4], [[3, 3, 4, 3], [2, 1, 3, 0], [0, 0, 1, 1]]),
      makeProblem("fill-l4-11", 4, [4, 4, 3], [[0, 0, 1, 1], [1, 2, 1, 1], [2, 2, 2, 1], [1, 3, 1, 0]]),
      makeProblem("fill-l4-12", 4, [4, 4, 3], [[0, 0, 0, 3], [0, 0, 2, 3], [0, 2, 0, 2], [3, 3, 2, 0]]),
      makeProblem("fill-l4-13", 4, [4, 3, 4], [[2, 2, 1, 1], [1, 2, 2, 0], [2, 3, 3, 1]]),
      makeProblem("fill-l4-14", 4, [4, 4, 3], [[1, 0, 2, 1], [1, 0, 1, 2], [2, 1, 2, 3], [3, 2, 2, 2]]),
      makeProblem("fill-l4-15", 4, [4, 4, 4], [[1, 3, 3, 2], [1, 3, 4, 2], [1, 2, 3, 3], [0, 1, 3, 1]]),
      makeProblem("fill-l4-16", 4, [4, 4, 3], [[0, 1, 2, 1], [2, 3, 3, 2], [0, 1, 2, 1], [0, 0, 1, 0]]),
      makeProblem("fill-l4-17", 4, [4, 3, 4], [[1, 0, 1, 2], [3, 2, 2, 3], [3, 3, 1, 2]]),
      makeProblem("fill-l4-18", 4, [4, 3, 4], [[1, 2, 1, 0], [3, 3, 1, 1], [3, 4, 2, 2]]),
      makeProblem("fill-l4-19", 4, [4, 4, 3], [[0, 1, 0, 0], [2, 1, 1, 0], [1, 3, 0, 1], [2, 3, 2, 1]]),
      makeProblem("fill-l4-20", 4, [4, 3, 4], [[2, 3, 2, 2], [2, 3, 2, 1], [0, 2, 1, 0]])
    ]
  }
];

export const levels = pools.map((entry) => ({
  level: entry.level,
  stars: entry.stars,
  pool: entry.problems,
  problems: sessionProblems("fill-box", entry.level, entry.problems, 5)
}));

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
