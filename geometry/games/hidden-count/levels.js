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

export const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("hidden-l1-01", 1, [[2, 1], [1, 1]]),
      makeProblem("hidden-l1-02", 1, [[1, 1], [1, 1]]),
      makeProblem("hidden-l1-03", 1, [[2, 2], [1, 1]]),
      makeProblem("hidden-l1-04", 1, [[2, 2], [2, 1]]),
      makeProblem("hidden-l1-05", 1, [[2, 1], [2, 1]])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("hidden-l2-01", 2, [[2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l2-02", 2, [[3, 2, 1], [2, 1, 1]]),
      makeProblem("hidden-l2-03", 2, [[2, 1], [2, 1], [1, 1]]),
      makeProblem("hidden-l2-04", 2, [[2, 2, 2], [1, 1, 1]]),
      makeProblem("hidden-l2-05", 2, [[3, 2, 1], [2, 2, 1]])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("hidden-l3-01", 3, [[2, 2, 1], [2, 1, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-02", 3, [[3, 2, 1], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-03", 3, [[3, 3, 2], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-04", 3, [[2, 2, 2], [2, 2, 1], [1, 1, 1]]),
      makeProblem("hidden-l3-05", 3, [[3, 2, 2], [3, 2, 1], [2, 1, 1]])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("hidden-l4-01", 4, [[3, 3, 2], [3, 2, 2], [2, 2, 1]]),
      makeProblem("hidden-l4-02", 4, [[4, 3, 2], [3, 3, 1], [2, 1, 1]]),
      makeProblem("hidden-l4-03", 4, [[3, 3, 3], [3, 2, 2], [2, 2, 1]]),
      makeProblem("hidden-l4-04", 4, [[4, 3, 2, 1], [3, 3, 2, 1], [2, 2, 1, 1]]),
      makeProblem("hidden-l4-05", 4, [[3, 3, 2, 2], [3, 2, 2, 1], [2, 2, 1, 1]])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("hidden-l5-01", 5, [[4, 4, 3, 2], [3, 3, 2, 1], [2, 2, 1, 1], [1, 1, 1, 1]]),
      makeProblem("hidden-l5-02", 5, [[4, 3, 3, 2], [4, 3, 2, 1], [3, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("hidden-l5-03", 5, [[4, 4, 3, 3], [3, 3, 2, 2], [2, 2, 1, 1], [1, 1, 1, 1]]),
      makeProblem("hidden-l5-04", 5, [[4, 4, 4, 3], [4, 3, 3, 2], [3, 2, 2, 1], [2, 1, 1, 1]]),
      makeProblem("hidden-l5-05", 5, [[4, 3, 3, 2], [3, 4, 2, 2], [3, 2, 2, 1], [2, 2, 1, 1]])
    ]
  }
];

export function validateLevels() {
  if (levels.length !== 5) throw new Error("hidden-count requires five levels");
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
