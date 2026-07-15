const makeProblem = (id, level, heights) => {
  const depth = heights.length;
  const width = heights[0].length;
  return {
    id,
    level,
    board: [width, depth],
    maxHeight: Math.max(...heights.flat()),
    heights,
    answer: { total: heights.flat().reduce((sum, value) => sum + value, 0) }
  };
};

export const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("height-l1-01", 1, [[1, 1], [0, 2]]),
      makeProblem("height-l1-02", 1, [[2, 1], [1, 0]]),
      makeProblem("height-l1-03", 1, [[1, 2], [2, 1]]),
      makeProblem("height-l1-04", 1, [[2, 0], [1, 2]]),
      makeProblem("height-l1-05", 1, [[1, 1], [2, 2]])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("height-l2-01", 2, [[3, 2, 1], [0, 2, 1], [0, 0, 1]]),
      makeProblem("height-l2-02", 2, [[2, 2, 0], [1, 3, 1], [0, 1, 0]]),
      makeProblem("height-l2-03", 2, [[1, 2, 3], [1, 2, 0], [1, 0, 0]]),
      makeProblem("height-l2-04", 2, [[0, 2, 0], [1, 3, 1], [1, 1, 1]]),
      makeProblem("height-l2-05", 2, [[3, 3, 0], [2, 2, 1], [1, 0, 1]])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("height-l3-01", 3, [[1, 2, 3, 0], [0, 3, 2, 1], [1, 0, 2, 0]]),
      makeProblem("height-l3-02", 3, [[4, 3, 2, 1], [0, 2, 0, 1], [1, 1, 0, 0]]),
      makeProblem("height-l3-03", 3, [[0, 2, 3, 0], [1, 4, 2, 1], [0, 1, 1, 0]]),
      makeProblem("height-l3-04", 3, [[2, 0, 1, 3], [2, 3, 0, 1], [1, 1, 1, 0]]),
      makeProblem("height-l3-05", 3, [[1, 2, 2, 1], [0, 3, 4, 0], [1, 0, 1, 2]])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("height-l4-01", 4, [[4, 3, 2, 1], [3, 3, 2, 0], [2, 2, 0, 0], [1, 0, 0, 0]]),
      makeProblem("height-l4-02", 4, [[2, 2, 2, 2], [2, 4, 4, 2], [0, 3, 3, 0], [1, 0, 0, 1]]),
      makeProblem("height-l4-03", 4, [[1, 3, 0, 2], [2, 4, 3, 0], [0, 3, 2, 1], [1, 0, 2, 1]]),
      makeProblem("height-l4-04", 4, [[4, 0, 2, 1], [3, 3, 2, 0], [2, 1, 4, 2], [0, 1, 2, 1]]),
      makeProblem("height-l4-05", 4, [[1, 2, 3, 4], [0, 2, 3, 0], [1, 2, 2, 1], [0, 1, 0, 1]])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("height-l5-01", 5, [[4, 4, 3, 2], [3, 4, 3, 1], [2, 3, 2, 1], [1, 1, 1, 0]]),
      makeProblem("height-l5-02", 5, [[0, 3, 4, 0], [2, 4, 4, 2], [1, 3, 3, 1], [0, 2, 1, 0]]),
      makeProblem("height-l5-03", 5, [[4, 2, 0, 3], [3, 4, 2, 2], [1, 3, 4, 0], [0, 1, 2, 1]]),
      makeProblem("height-l5-04", 5, [[2, 3, 4, 3], [1, 4, 3, 2], [0, 2, 4, 1], [1, 1, 2, 0]]),
      makeProblem("height-l5-05", 5, [[4, 3, 2, 1], [3, 2, 4, 2], [2, 4, 3, 1], [1, 2, 1, 0]])
    ]
  }
];

export function validateLevels() {
  if (levels.length !== 5) throw new Error("count-heights requires five levels");
  levels.forEach((level) => {
    if (level.problems.length !== 5) throw new Error(`level ${level.level} requires five problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.board;
      if (width > 4 || depth > 4 || problem.maxHeight > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.heights.length !== depth || problem.heights.some((row) => row.length !== width)) {
        throw new Error(`${problem.id} has an invalid board`);
      }
      const total = problem.heights.flat().reduce((sum, value) => sum + value, 0);
      if (total !== problem.answer.total) throw new Error(`${problem.id} has an invalid total`);
    });
  });
}
