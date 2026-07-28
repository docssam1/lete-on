const level1Wood = [
  [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  [[1, 1, 0], [0, 1, 0], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
  [[1, 0, 1], [0, 1, 0], [0, 0, 0]],
  [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
];

const level2Wood = [
  [[0, 1, 0], [1, 2, 1], [0, 1, 0]],
  [[1, 2, 0], [0, 1, 1], [0, 0, 0]],
  [[0, 2, 1], [1, 1, 0], [0, 1, 0]],
  [[1, 1, 0], [3, 1, 1], [0, 0, 0]],
  [[0, 1, 0], [2, 3, 1], [0, 0, 1]]
];

const level3Wood = [
  [[0, 1, 0, 0], [1, 2, 2, 0], [0, 3, 1, 1], [0, 0, 1, 0]],
  [[1, 1, 0, 0], [0, 2, 3, 1], [1, 1, 2, 0], [0, 0, 1, 0]],
  [[0, 2, 1, 0], [1, 3, 2, 1], [0, 1, 4, 0], [0, 0, 1, 1]],
  [[1, 0, 1, 0], [2, 2, 3, 1], [0, 1, 2, 2], [0, 1, 0, 1]],
  [[0, 1, 0, 1], [1, 3, 2, 0], [2, 2, 4, 1], [0, 1, 1, 0]]
];

const level3Color = [
  [[1, 0, 2], [1, 2, 1], [0, 0, 1]],
  [[0, 2, 0], [1, 3, 1], [0, 1, 0]],
  [[2, 1, 0], [1, 2, 2], [0, 0, 1]],
  [[0, 1, 3], [1, 2, 1], [1, 0, 0]],
  [[1, 2, 1], [0, 3, 2], [1, 0, 1]]
];

const COLOR_NAMES = ["cube", "green", "blue", "yellow", "rose"];

export function makeColorProblem(grid, seed) {
  const colorMap = grid.map((row, z) => (
    row.map((height, x) => (
      Array.from({ length: height }, (_, y) => COLOR_NAMES[(seed + x * 2 + z * 3 + y) % COLOR_NAMES.length])
    ))
  ));
  return { grid, colorMap };
}

function makeLevel(level, stars, woodProblems, colorProblems, seed) {
  return {
    level,
    stars,
    problems: [
      ...woodProblems,
      ...colorProblems.map((grid, index) => makeColorProblem(grid, seed + index))
    ]
  };
}

export const COPY_BUILD_LEVELS = [
  makeLevel(1, 1, level1Wood, level1Wood, 1),
  makeLevel(2, 2, level2Wood, level2Wood, 7),
  makeLevel(3, 3, level3Wood, level3Color, 13)
];
