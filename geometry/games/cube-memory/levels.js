// 큐브 메모리 (Cube Memory)
//
// A small arrangement of colored cubes is shown on the board for a few seconds,
// then hidden. The child rebuilds it from memory — placing each cube back in the
// right spot with the right color — "10초 동안 본 모양과 색을 기억해 똑같이 재현해요".
//
// Each puzzle is a single layer of cubes on a W×D footprint:
//   grid   = [W, D]                 the board footprint (x: 0..W-1, z: 0..D-1)
//   cells  = [{ x, z, color }, ...] one colored cube per listed cell
//   viewMs = how long the arrangement is shown before it hides
//
// The child reproduces it on a matching grid using the color palette; the answer
// is correct only when every cell matches in both position and color.

// A fixed, high-contrast, color-blind-friendly-ish palette. Index = color id.
export const palette = [
  { id: 0, hex: 0xe8615a, css: "#e8615a", key: "colorRed" },
  { id: 1, hex: 0x4f97e8, css: "#4f97e8", key: "colorBlue" },
  { id: 2, hex: 0xf2c14e, css: "#f2c14e", key: "colorYellow" },
  { id: 3, hex: 0x66c07a, css: "#66c07a", key: "colorGreen" },
  { id: 4, hex: 0xa679d6, css: "#a679d6", key: "colorPurple" }
];

const makeProblem = (id, level, grid, viewMs, cells) => {
  const [width, depth] = grid;
  const seen = new Set();
  cells.forEach(({ x, z, color }) => {
    if (x < 0 || x >= width || z < 0 || z >= depth) throw new Error(`${id}: cell ${x},${z} outside grid`);
    if (color < 0 || color >= palette.length) throw new Error(`${id}: bad color ${color}`);
    const k = `${x},${z}`;
    if (seen.has(k)) throw new Error(`${id}: duplicate cell ${k}`);
    seen.add(k);
  });
  const colorsUsed = new Set(cells.map((c) => c.color)).size;
  return { id, level, grid, viewMs, cells, count: cells.length, colorsUsed };
};

export const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      // 3×3, three cubes, three colors, a generous look.
      makeProblem("mem-l1-01", 1, [3, 3], 6000, [
        { x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 1, z: 2, color: 2 }
      ]),
      makeProblem("mem-l1-02", 1, [3, 3], 6000, [
        { x: 1, z: 1, color: 3 }, { x: 0, z: 2, color: 0 }, { x: 2, z: 2, color: 1 }
      ]),
      makeProblem("mem-l1-03", 1, [3, 3], 6000, [
        { x: 0, z: 0, color: 2 }, { x: 2, z: 1, color: 3 }, { x: 1, z: 2, color: 0 }
      ]),
      makeProblem("mem-l1-04", 1, [3, 3], 6000, [
        { x: 2, z: 0, color: 1 }, { x: 0, z: 1, color: 2 }, { x: 1, z: 1, color: 0 }
      ])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      // 3×3, four cubes, three colors.
      makeProblem("mem-l2-01", 2, [3, 3], 5000, [
        { x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 0, z: 2, color: 2 }, { x: 2, z: 2, color: 0 }
      ]),
      makeProblem("mem-l2-02", 2, [3, 3], 5000, [
        { x: 1, z: 0, color: 3 }, { x: 0, z: 1, color: 1 }, { x: 2, z: 1, color: 2 }, { x: 1, z: 2, color: 3 }
      ]),
      makeProblem("mem-l2-03", 2, [3, 3], 5000, [
        { x: 0, z: 0, color: 2 }, { x: 1, z: 1, color: 0 }, { x: 2, z: 2, color: 1 }, { x: 2, z: 0, color: 3 }
      ]),
      makeProblem("mem-l2-04", 2, [3, 3], 5000, [
        { x: 0, z: 1, color: 1 }, { x: 1, z: 1, color: 2 }, { x: 2, z: 1, color: 1 }, { x: 1, z: 0, color: 0 }
      ])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      // 4×4, five cubes, four colors.
      makeProblem("mem-l3-01", 3, [4, 4], 5000, [
        { x: 0, z: 0, color: 0 }, { x: 3, z: 0, color: 1 }, { x: 1, z: 2, color: 2 }, { x: 3, z: 3, color: 3 }, { x: 0, z: 3, color: 1 }
      ]),
      makeProblem("mem-l3-02", 3, [4, 4], 5000, [
        { x: 1, z: 1, color: 2 }, { x: 2, z: 1, color: 0 }, { x: 1, z: 2, color: 3 }, { x: 2, z: 2, color: 1 }, { x: 0, z: 0, color: 0 }
      ]),
      makeProblem("mem-l3-03", 3, [4, 4], 5000, [
        { x: 0, z: 1, color: 3 }, { x: 2, z: 0, color: 2 }, { x: 3, z: 2, color: 0 }, { x: 1, z: 3, color: 1 }, { x: 2, z: 3, color: 2 }
      ]),
      makeProblem("mem-l3-04", 3, [4, 4], 5000, [
        { x: 0, z: 0, color: 1 }, { x: 3, z: 0, color: 3 }, { x: 0, z: 3, color: 2 }, { x: 3, z: 3, color: 0 }, { x: 1, z: 1, color: 2 }
      ])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      // 4×4, six or seven cubes, five colors, a quicker look.
      makeProblem("mem-l4-01", 4, [4, 4], 4500, [
        { x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 1, z: 1, color: 2 }, { x: 3, z: 2, color: 3 }, { x: 0, z: 3, color: 4 }, { x: 2, z: 3, color: 1 }
      ]),
      makeProblem("mem-l4-02", 4, [4, 4], 4500, [
        { x: 1, z: 0, color: 4 }, { x: 3, z: 0, color: 2 }, { x: 0, z: 1, color: 0 }, { x: 2, z: 2, color: 3 }, { x: 1, z: 3, color: 1 }, { x: 3, z: 3, color: 4 }
      ]),
      makeProblem("mem-l4-03", 4, [4, 4], 4500, [
        { x: 0, z: 0, color: 2 }, { x: 1, z: 1, color: 0 }, { x: 2, z: 1, color: 4 }, { x: 3, z: 2, color: 1 }, { x: 0, z: 2, color: 3 }, { x: 2, z: 3, color: 2 }, { x: 3, z: 0, color: 0 }
      ]),
      makeProblem("mem-l4-04", 4, [4, 4], 4500, [
        { x: 0, z: 1, color: 1 }, { x: 1, z: 0, color: 4 }, { x: 2, z: 2, color: 0 }, { x: 3, z: 1, color: 2 }, { x: 1, z: 3, color: 3 }, { x: 3, z: 3, color: 4 }, { x: 2, z: 0, color: 3 }
      ])
    ]
  }
];

export function validateLevels() {
  if (levels.length !== 4) throw new Error("cube-memory requires four levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 4 || depth > 4) throw new Error(`${problem.id} grid exceeds 4x4`);
      if (problem.cells.length < 3) throw new Error(`${problem.id} needs at least three cubes`);
      if (problem.viewMs < 2000 || problem.viewMs > 12000) throw new Error(`${problem.id} viewMs out of range`);
      const seen = new Set();
      problem.cells.forEach(({ x, z, color }) => {
        if (x < 0 || x >= width || z < 0 || z >= depth) throw new Error(`${problem.id} cell out of grid`);
        if (color < 0 || color >= palette.length) throw new Error(`${problem.id} bad color`);
        const k = `${x},${z}`;
        if (seen.has(k)) throw new Error(`${problem.id} duplicate cell`);
        seen.add(k);
      });
    });
  });
}
