import { sessionProblems } from "../../shared/problem-pool.js";

// 숨은 쌓기나무 찾기 (Find Hidden Cubes)
//
// A cube is HIDDEN when it cannot be seen from the standard viewing angle —
// it is blocked from the TOP (a cube sits directly above it), from the FRONT
// (+z, a tall-enough cube stands in front of it), AND from the RIGHT (+x, a
// tall-enough cube stands to its right). If all three shown faces are covered,
// no face of the cube is visible, so it is hidden inside the shape.
//
// heights[z][x] = the height of the cube column at grid position (x, z),
// exactly like the "쌓기나무 개수 세기" game, so the two games share a board model.
function countHidden(heights) {
  const depth = heights.length;
  const width = heights[0].length;
  let hidden = 0;
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const h = heights[z][x];
      for (let y = 0; y < h; y += 1) {
        const coveredTop = y < h - 1;
        let coveredFront = false;
        for (let z2 = z + 1; z2 < depth; z2 += 1) {
          if (heights[z2][x] > y) { coveredFront = true; break; }
        }
        let coveredRight = false;
        for (let x2 = x + 1; x2 < width; x2 += 1) {
          if (heights[z][x2] > y) { coveredRight = true; break; }
        }
        if (coveredTop && coveredFront && coveredRight) hidden += 1;
      }
    }
  }
  return hidden;
}

// Which cubes are hidden — used by the "속 보기" (X-ray) reveal so the same
// rule that scores the answer also decides what glows inside the shape.
export function hiddenCubes(heights) {
  const depth = heights.length;
  const width = heights[0].length;
  const cubes = [];
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) {
      const h = heights[z][x];
      for (let y = 0; y < h; y += 1) {
        const coveredTop = y < h - 1;
        let coveredFront = false;
        for (let z2 = z + 1; z2 < depth; z2 += 1) {
          if (heights[z2][x] > y) { coveredFront = true; break; }
        }
        let coveredRight = false;
        for (let x2 = x + 1; x2 < width; x2 += 1) {
          if (heights[z][x2] > y) { coveredRight = true; break; }
        }
        if (coveredTop && coveredFront && coveredRight) cubes.push({ x, y, z });
      }
    }
  }
  return cubes;
}

const makeProblem = (id, level, heights) => {
  const depth = heights.length;
  const width = heights[0].length;
  return {
    id,
    level,
    board: [width, depth],
    maxHeight: Math.max(...heights.flat()),
    heights,
    answer: {
      total: heights.flat().reduce((sum, value) => sum + value, 0),
      hidden: countHidden(heights)
    }
  };
};

const pools = [
  {
    level: 1,
    stars: 1,
    pool: [
      makeProblem("hidden-l1-01", 1, [[2, 1], [1, 1]]),
      makeProblem("hidden-l1-02", 1, [[1, 1], [1, 1]]),
      makeProblem("hidden-l1-03", 1, [[2, 2], [1, 1]]),
      makeProblem("hidden-l1-04", 1, [[2, 2], [2, 1]]),
      makeProblem("hidden-l1-05", 1, [[2, 1], [2, 1]]),
      makeProblem("hidden-l1-06", 1, [[1, 0], [2, 1]]),
      makeProblem("hidden-l1-07", 1, [[1, 1], [2, 1]]),
      makeProblem("hidden-l1-08", 1, [[1, 2], [0, 2]]),
      makeProblem("hidden-l1-09", 1, [[2, 0], [2, 1]]),
      makeProblem("hidden-l1-10", 1, [[2, 0], [2, 0]]),
      makeProblem("hidden-l1-11", 1, [[1, 1], [2, 0]]),
      makeProblem("hidden-l1-12", 1, [[2, 1], [1, 0]]),
      makeProblem("hidden-l1-13", 1, [[2, 2], [0, 1]]),
      makeProblem("hidden-l1-14", 1, [[2, 2], [1, 0]]),
      makeProblem("hidden-l1-15", 1, [[1, 0], [2, 2]]),
      makeProblem("hidden-l1-16", 1, [[0, 1], [1, 2]]),
      makeProblem("hidden-l1-17", 1, [[2, 1], [0, 1]]),
      makeProblem("hidden-l1-18", 1, [[1, 1], [2, 2]]),
      makeProblem("hidden-l1-19", 1, [[1, 2], [0, 1]]),
      makeProblem("hidden-l1-20", 1, [[2, 1], [1, 2]])
    ]
  },
  {
    level: 2,
    stars: 2,
    pool: [
      makeProblem("hidden-l2-01", 2, [[2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l2-02", 2, [[3, 2, 1], [2, 1, 1]]),
      makeProblem("hidden-l2-03", 2, [[2, 1], [2, 1], [1, 1]]),
      makeProblem("hidden-l2-04", 2, [[2, 2, 2], [1, 1, 1]]),
      makeProblem("hidden-l2-05", 2, [[3, 2, 1], [2, 2, 1]]),
      makeProblem("hidden-l2-06", 2, [[0, 1], [3, 1], [2, 0]]),
      makeProblem("hidden-l2-07", 2, [[2, 3, 2], [1, 2, 1]]),
      makeProblem("hidden-l2-08", 2, [[2, 2, 3], [0, 2, 2]]),
      makeProblem("hidden-l2-09", 2, [[3, 3], [1, 1], [1, 0]]),
      makeProblem("hidden-l2-10", 2, [[1, 3, 2], [1, 2, 1]]),
      makeProblem("hidden-l2-11", 2, [[1, 2, 3], [0, 1, 1]]),
      makeProblem("hidden-l2-12", 2, [[2, 2], [0, 2], [1, 3]]),
      makeProblem("hidden-l2-13", 2, [[2, 3, 2], [0, 2, 0]]),
      makeProblem("hidden-l2-14", 2, [[2, 0], [3, 2], [2, 0]]),
      makeProblem("hidden-l2-15", 2, [[1, 2], [3, 2], [1, 0]]),
      makeProblem("hidden-l2-16", 2, [[2, 1], [2, 0], [3, 0]]),
      makeProblem("hidden-l2-17", 2, [[0, 0], [3, 1], [2, 2]]),
      makeProblem("hidden-l2-18", 2, [[1, 3, 1], [1, 3, 0]]),
      makeProblem("hidden-l2-19", 2, [[3, 2], [2, 1], [1, 0]]),
      makeProblem("hidden-l2-20", 2, [[2, 3], [1, 2], [0, 1]])
    ]
  },
  {
    level: 3,
    stars: 3,
    pool: [
      makeProblem("hidden-l3-01", 3, [[2, 2, 1], [2, 1, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-02", 3, [[3, 2, 1], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-03", 3, [[3, 3, 2], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-04", 3, [[2, 2, 2], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-05", 3, [[3, 2, 2], [3, 2, 1], [2, 1, 1]]),
      makeProblem("hidden-l3-06", 3, [[2, 3, 3], [2, 2, 0], [1, 1, 1]]),
      makeProblem("hidden-l3-07", 3, [[1, 3, 1], [2, 3, 2], [2, 1, 1]]),
      makeProblem("hidden-l3-08", 3, [[2, 3, 3], [1, 3, 1], [0, 1, 2]]),
      makeProblem("hidden-l3-09", 3, [[2, 2, 0], [3, 2, 1], [2, 2, 1]]),
      makeProblem("hidden-l3-10", 3, [[3, 2, 1], [2, 2, 0], [2, 0, 1]]),
      makeProblem("hidden-l3-11", 3, [[1, 3, 2], [1, 2, 1], [1, 2, 0]]),
      makeProblem("hidden-l3-12", 3, [[3, 3, 1], [2, 1, 1], [2, 0, 0]]),
      makeProblem("hidden-l3-13", 3, [[0, 2, 0], [2, 3, 2], [2, 3, 2]]),
      makeProblem("hidden-l3-14", 3, [[3, 2, 1], [2, 1, 1], [2, 1, 0]]),
      makeProblem("hidden-l3-15", 3, [[3, 2, 1], [2, 2, 0], [1, 0, 0]]),
      makeProblem("hidden-l3-16", 3, [[1, 2, 2], [2, 3, 2], [1, 2, 2]]),
      makeProblem("hidden-l3-17", 3, [[3, 3, 1], [2, 1, 0], [0, 1, 0]]),
      makeProblem("hidden-l3-18", 3, [[2, 3, 3], [1, 2, 2], [1, 1, 1]]),
      makeProblem("hidden-l3-19", 3, [[2, 3, 2], [1, 2, 1], [2, 1, 1]]),
      makeProblem("hidden-l3-20", 3, [[3, 2, 2], [2, 1, 2], [1, 0, 0]])
    ]
  },
  {
    level: 4,
    stars: 4,
    pool: [
      makeProblem("hidden-l4-01", 4, [[3, 3, 2], [3, 2, 2], [2, 2, 1]]),
      makeProblem("hidden-l4-02", 4, [[4, 3, 2], [3, 3, 1], [2, 1, 1]]),
      makeProblem("hidden-l4-03", 4, [[3, 3, 3], [3, 2, 2], [2, 2, 1]]),
      makeProblem("hidden-l4-04", 4, [[4, 3, 2, 1], [3, 3, 2, 1], [2, 2, 1, 1]]),
      makeProblem("hidden-l4-05", 4, [[3, 3, 2, 2], [3, 2, 2, 1], [2, 2, 1, 1]]),
      makeProblem("hidden-l4-06", 4, [[3, 4, 2], [2, 3, 2], [2, 2, 1], [0, 1, 0]]),
      makeProblem("hidden-l4-07", 4, [[1, 3, 4], [2, 3, 2], [2, 2, 1], [0, 2, 0]]),
      makeProblem("hidden-l4-08", 4, [[2, 2, 2, 3], [2, 2, 2, 1], [4, 3, 1, 2]]),
      makeProblem("hidden-l4-09", 4, [[1, 2, 0, 0], [4, 3, 2, 1], [4, 3, 2, 0]]),
      makeProblem("hidden-l4-10", 4, [[1, 2, 1, 0], [3, 3, 2, 1], [3, 4, 3, 2]]),
      makeProblem("hidden-l4-11", 4, [[3, 2, 4], [4, 3, 2], [2, 1, 2], [2, 0, 1]]),
      makeProblem("hidden-l4-12", 4, [[1, 1, 4, 3], [2, 4, 4, 3], [0, 1, 2, 1]]),
      makeProblem("hidden-l4-13", 4, [[1, 2, 2], [3, 4, 3], [2, 4, 2], [0, 2, 0]]),
      makeProblem("hidden-l4-14", 4, [[4, 4, 3, 3], [2, 3, 1, 1], [2, 1, 1, 0]]),
      makeProblem("hidden-l4-15", 4, [[4, 2, 1], [3, 2, 1], [2, 4, 2], [1, 1, 1]]),
      makeProblem("hidden-l4-16", 4, [[3, 1, 2, 0], [4, 3, 3, 2], [3, 1, 2, 0]]),
      makeProblem("hidden-l4-17", 4, [[4, 3, 3], [4, 3, 2], [3, 1, 1], [1, 0, 0]]),
      makeProblem("hidden-l4-18", 4, [[4, 4, 2], [3, 2, 0], [2, 1, 0], [1, 0, 0]]),
      makeProblem("hidden-l4-19", 4, [[2, 1, 0], [2, 1, 0], [4, 3, 2], [4, 2, 2]]),
      makeProblem("hidden-l4-20", 4, [[3, 4, 2], [4, 3, 1], [3, 1, 0], [1, 0, 0]])
    ]
  },
  {
    level: 5,
    stars: 5,
    pool: [
      makeProblem("hidden-l5-01", 5, [[4, 4, 3, 2], [3, 3, 2, 1], [2, 2, 1, 1], [1, 1, 1, 1]]),
      makeProblem("hidden-l5-02", 5, [[4, 3, 3, 2], [4, 3, 2, 1], [3, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("hidden-l5-03", 5, [[4, 4, 3, 3], [3, 3, 2, 2], [2, 2, 1, 1], [1, 1, 1, 1]]),
      makeProblem("hidden-l5-04", 5, [[4, 4, 4, 3], [4, 3, 3, 2], [3, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("hidden-l5-05", 5, [[4, 3, 3, 2], [3, 4, 2, 2], [3, 2, 2, 1], [2, 2, 1, 1]]),
      makeProblem("hidden-l5-06", 5, [[4, 4, 3, 1], [3, 3, 1, 1], [4, 3, 1, 1], [3, 1, 0, 1]]),
      makeProblem("hidden-l5-07", 5, [[3, 2, 2, 1], [4, 3, 2, 3], [3, 2, 2, 1], [2, 2, 1, 0]]),
      makeProblem("hidden-l5-08", 5, [[2, 3, 2, 0], [3, 4, 3, 2], [3, 3, 2, 1], [2, 3, 1, 0]]),
      makeProblem("hidden-l5-09", 5, [[3, 2, 2, 1], [4, 3, 3, 1], [3, 3, 2, 0], [3, 2, 1, 0]]),
      makeProblem("hidden-l5-10", 5, [[4, 4, 3, 3], [2, 3, 2, 2], [2, 3, 2, 1], [1, 2, 1, 0]]),
      makeProblem("hidden-l5-11", 5, [[4, 2, 3, 3], [2, 3, 3, 3], [2, 2, 4, 3], [1, 1, 2, 1]]),
      makeProblem("hidden-l5-12", 5, [[2, 3, 3, 1], [3, 4, 3, 3], [3, 3, 4, 1], [3, 3, 2, 1]]),
      makeProblem("hidden-l5-13", 5, [[3, 2, 1, 0], [4, 3, 2, 1], [4, 3, 2, 1], [2, 2, 1, 0]]),
      makeProblem("hidden-l5-14", 5, [[2, 3, 3, 3], [2, 3, 4, 3], [1, 2, 3, 2], [0, 1, 2, 0]]),
      makeProblem("hidden-l5-15", 5, [[2, 3, 2, 1], [3, 4, 3, 2], [2, 3, 2, 1], [1, 2, 3, 1]]),
      makeProblem("hidden-l5-16", 5, [[3, 2, 2, 1], [3, 4, 3, 2], [3, 3, 2, 1], [2, 2, 1, 0]]),
      makeProblem("hidden-l5-17", 5, [[2, 2, 3, 2], [2, 3, 4, 4], [2, 3, 4, 3], [1, 2, 2, 1]]),
      makeProblem("hidden-l5-18", 5, [[3, 3, 2, 0], [4, 4, 4, 2], [2, 2, 4, 3], [0, 3, 3, 2]]),
      makeProblem("hidden-l5-19", 5, [[2, 3, 2, 0], [3, 4, 3, 2], [2, 3, 2, 2], [4, 2, 2, 0]]),
      makeProblem("hidden-l5-20", 5, [[1, 3, 3, 2], [2, 3, 3, 2], [2, 2, 4, 3], [3, 2, 3, 2]])
    ]
  },
  {
    level: 6,
    stars: 5,
    wall: true,
    pool: [
      makeProblem("hidden-l6-01", 6, [[2, 2], [2, 2]]),
      makeProblem("hidden-l6-02", 6, [[2, 2, 2], [2, 2, 2], [2, 2, 2]]),
      makeProblem("hidden-l6-03", 6, [[3, 3, 3], [3, 3, 3], [3, 3, 3]]),
      makeProblem("hidden-l6-04", 6, [[3, 3, 3, 3], [3, 3, 3, 3], [3, 3, 3, 3], [3, 3, 3, 3]]),
      makeProblem("hidden-l6-05", 6, [[4, 4, 4, 4], [4, 4, 4, 4], [4, 4, 4, 4], [4, 4, 4, 4]]),
      makeProblem("hidden-l6-06", 6, [[4, 4, 4, 4], [4, 4, 4, 4], [4, 4, 4, 4]]),
      makeProblem("hidden-l6-07", 6, [[2, 2], [2, 2], [2, 2], [2, 2]]),
      makeProblem("hidden-l6-08", 6, [[2, 2, 2], [2, 2, 2], [2, 2, 2], [2, 2, 2]]),
      makeProblem("hidden-l6-09", 6, [[4, 4, 4, 4], [4, 4, 4, 4]]),
      makeProblem("hidden-l6-10", 6, [[3, 3, 3, 3], [3, 3, 3, 3]]),
      makeProblem("hidden-l6-11", 6, [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]),
      makeProblem("hidden-l6-12", 6, [[3, 3], [3, 3], [3, 3]]),
      makeProblem("hidden-l6-13", 6, [[4, 4], [4, 4], [4, 4], [4, 4]]),
      makeProblem("hidden-l6-14", 6, [[3, 3, 3, 3], [3, 3, 3, 3], [3, 3, 3, 3]]),
      makeProblem("hidden-l6-15", 6, [[3, 3, 3], [3, 3, 3], [3, 3, 3], [3, 3, 3]]),
      makeProblem("hidden-l6-16", 6, [[2, 2], [2, 2], [2, 2]]),
      makeProblem("hidden-l6-17", 6, [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]),
      makeProblem("hidden-l6-18", 6, [[4, 4, 4], [4, 4, 4], [4, 4, 4], [4, 4, 4]]),
      makeProblem("hidden-l6-19", 6, [[4, 4], [4, 4], [4, 4]]),
      makeProblem("hidden-l6-20", 6, [[3, 3], [3, 3]])
    ]
  }
];

export const levels = pools.map((entry) => ({
  level: entry.level,
  stars: entry.stars,
  wall: entry.wall,
  pool: entry.pool,
  problems: sessionProblems("hidden-count", entry.level, entry.pool, 5)
}));

export function validateLevels() {
  if (levels.length !== 6) throw new Error("hidden-count requires six levels");
  levels.forEach((level) => {
    if (level.problems.length !== 5) throw new Error(`level ${level.level} requires five problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.board;
      if (width > 4 || depth > 4 || problem.maxHeight > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.heights.length !== depth || problem.heights.some((row) => row.length !== width)) {
        throw new Error(`${problem.id} has an invalid board`);
      }
      if (problem.answer.hidden !== hiddenCubes(problem.heights).length) {
        throw new Error(`${problem.id} has an inconsistent hidden count`);
      }
    });
  });
}
