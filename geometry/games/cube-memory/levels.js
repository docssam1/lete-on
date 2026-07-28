import { sessionProblems } from "../../shared/problem-pool.js";

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

const pools = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("mem-l1-01", 1, [3, 3], 6000, [{ x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 1, z: 2, color: 2 }]),
      makeProblem("mem-l1-02", 1, [3, 3], 6000, [{ x: 1, z: 1, color: 3 }, { x: 0, z: 2, color: 0 }, { x: 2, z: 2, color: 1 }]),
      makeProblem("mem-l1-03", 1, [3, 3], 6000, [{ x: 0, z: 0, color: 2 }, { x: 2, z: 1, color: 3 }, { x: 1, z: 2, color: 0 }]),
      makeProblem("mem-l1-04", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 1 }, { x: 0, z: 1, color: 2 }, { x: 1, z: 1, color: 0 }]),
      makeProblem("mem-l1-05", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 1 }, { x: 1, z: 0, color: 2 }, { x: 1, z: 1, color: 3 }]),
      makeProblem("mem-l1-06", 1, [3, 3], 6000, [{ x: 0, z: 1, color: 0 }, { x: 0, z: 2, color: 4 }, { x: 1, z: 2, color: 2 }]),
      makeProblem("mem-l1-07", 1, [3, 3], 6000, [{ x: 1, z: 1, color: 2 }, { x: 1, z: 2, color: 0 }, { x: 2, z: 2, color: 1 }]),
      makeProblem("mem-l1-08", 1, [3, 3], 6000, [{ x: 1, z: 0, color: 3 }, { x: 2, z: 1, color: 4 }, { x: 2, z: 0, color: 1 }]),
      makeProblem("mem-l1-09", 1, [3, 3], 6000, [{ x: 1, z: 0, color: 0 }, { x: 2, z: 0, color: 2 }, { x: 2, z: 1, color: 4 }]),
      makeProblem("mem-l1-10", 1, [3, 3], 6000, [{ x: 0, z: 1, color: 3 }, { x: 1, z: 1, color: 2 }, { x: 1, z: 0, color: 4 }]),
      makeProblem("mem-l1-11", 1, [3, 3], 6000, [{ x: 2, z: 2, color: 0 }, { x: 2, z: 1, color: 3 }, { x: 1, z: 1, color: 4 }]),
      makeProblem("mem-l1-12", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 3 }, { x: 2, z: 1, color: 0 }, { x: 1, z: 0, color: 1 }]),
      makeProblem("mem-l1-13", 1, [3, 3], 6000, [{ x: 0, z: 1, color: 3 }, { x: 0, z: 2, color: 1 }, { x: 1, z: 1, color: 2 }]),
      makeProblem("mem-l1-14", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 2 }, { x: 2, z: 1, color: 3 }, { x: 1, z: 0, color: 1 }]),
      makeProblem("mem-l1-15", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 0 }, { x: 2, z: 1, color: 3 }, { x: 2, z: 2, color: 4 }]),
      makeProblem("mem-l1-16", 1, [3, 3], 6000, [{ x: 1, z: 2, color: 4 }, { x: 0, z: 0, color: 2 }, { x: 0, z: 1, color: 1 }]),
      makeProblem("mem-l1-17", 1, [3, 3], 6000, [{ x: 2, z: 0, color: 4 }, { x: 1, z: 0, color: 0 }, { x: 1, z: 2, color: 2 }]),
      makeProblem("mem-l1-18", 1, [3, 3], 6000, [{ x: 0, z: 2, color: 0 }, { x: 0, z: 1, color: 3 }, { x: 2, z: 0, color: 2 }]),
      makeProblem("mem-l1-19", 1, [3, 3], 6000, [{ x: 1, z: 0, color: 0 }, { x: 1, z: 1, color: 1 }, { x: 2, z: 0, color: 2 }]),
      makeProblem("mem-l1-20", 1, [3, 3], 6000, [{ x: 1, z: 2, color: 0 }, { x: 0, z: 2, color: 3 }, { x: 0, z: 1, color: 1 }])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("mem-l2-01", 2, [3, 3], 5000, [{ x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 0, z: 2, color: 2 }, { x: 2, z: 2, color: 0 }]),
      makeProblem("mem-l2-02", 2, [3, 3], 5000, [{ x: 1, z: 0, color: 3 }, { x: 0, z: 1, color: 1 }, { x: 2, z: 1, color: 2 }, { x: 1, z: 2, color: 3 }]),
      makeProblem("mem-l2-03", 2, [3, 3], 5000, [{ x: 0, z: 0, color: 2 }, { x: 1, z: 1, color: 0 }, { x: 2, z: 2, color: 1 }, { x: 2, z: 0, color: 3 }]),
      makeProblem("mem-l2-04", 2, [3, 3], 5000, [{ x: 0, z: 1, color: 1 }, { x: 1, z: 1, color: 2 }, { x: 2, z: 1, color: 1 }, { x: 1, z: 0, color: 0 }]),
      makeProblem("mem-l2-05", 2, [3, 3], 5000, [{ x: 1, z: 0, color: 4 }, { x: 1, z: 1, color: 1 }, { x: 2, z: 2, color: 0 }, { x: 1, z: 2, color: 2 }]),
      makeProblem("mem-l2-06", 2, [3, 3], 5000, [{ x: 1, z: 0, color: 1 }, { x: 2, z: 0, color: 4 }, { x: 1, z: 1, color: 0 }, { x: 0, z: 0, color: 1 }]),
      makeProblem("mem-l2-07", 2, [3, 3], 5000, [{ x: 2, z: 2, color: 0 }, { x: 2, z: 1, color: 1 }, { x: 1, z: 2, color: 2 }, { x: 1, z: 1, color: 3 }]),
      makeProblem("mem-l2-08", 2, [3, 3], 5000, [{ x: 2, z: 2, color: 4 }, { x: 1, z: 2, color: 3 }, { x: 2, z: 1, color: 2 }, { x: 1, z: 1, color: 1 }]),
      makeProblem("mem-l2-09", 2, [3, 3], 5000, [{ x: 1, z: 1, color: 4 }, { x: 2, z: 1, color: 0 }, { x: 2, z: 0, color: 3 }, { x: 1, z: 0, color: 4 }]),
      makeProblem("mem-l2-10", 2, [3, 3], 5000, [{ x: 2, z: 0, color: 1 }, { x: 2, z: 1, color: 3 }, { x: 1, z: 0, color: 4 }, { x: 2, z: 2, color: 0 }]),
      makeProblem("mem-l2-11", 2, [3, 3], 5000, [{ x: 0, z: 0, color: 2 }, { x: 1, z: 0, color: 3 }, { x: 2, z: 2, color: 0 }, { x: 1, z: 2, color: 3 }]),
      makeProblem("mem-l2-12", 2, [3, 3], 5000, [{ x: 0, z: 1, color: 0 }, { x: 1, z: 1, color: 2 }, { x: 2, z: 1, color: 1 }, { x: 2, z: 2, color: 3 }]),
      makeProblem("mem-l2-13", 2, [3, 3], 5000, [{ x: 2, z: 2, color: 1 }, { x: 2, z: 1, color: 4 }, { x: 2, z: 0, color: 3 }, { x: 1, z: 1, color: 1 }]),
      makeProblem("mem-l2-14", 2, [3, 3], 5000, [{ x: 1, z: 2, color: 2 }, { x: 0, z: 2, color: 1 }, { x: 2, z: 2, color: 0 }, { x: 1, z: 1, color: 3 }]),
      makeProblem("mem-l2-15", 2, [3, 3], 5000, [{ x: 1, z: 2, color: 0 }, { x: 0, z: 2, color: 2 }, { x: 0, z: 1, color: 2 }, { x: 1, z: 1, color: 1 }]),
      makeProblem("mem-l2-16", 2, [3, 3], 5000, [{ x: 2, z: 2, color: 4 }, { x: 1, z: 0, color: 1 }, { x: 1, z: 1, color: 2 }, { x: 0, z: 1, color: 0 }]),
      makeProblem("mem-l2-17", 2, [3, 3], 5000, [{ x: 1, z: 1, color: 0 }, { x: 1, z: 0, color: 2 }, { x: 2, z: 0, color: 2 }, { x: 2, z: 1, color: 3 }]),
      makeProblem("mem-l2-18", 2, [3, 3], 5000, [{ x: 0, z: 0, color: 0 }, { x: 0, z: 1, color: 3 }, { x: 0, z: 2, color: 2 }, { x: 1, z: 1, color: 0 }]),
      makeProblem("mem-l2-19", 2, [3, 3], 5000, [{ x: 2, z: 2, color: 2 }, { x: 2, z: 0, color: 0 }, { x: 1, z: 2, color: 2 }, { x: 2, z: 1, color: 4 }]),
      makeProblem("mem-l2-20", 2, [3, 3], 5000, [{ x: 1, z: 0, color: 4 }, { x: 2, z: 0, color: 0 }, { x: 0, z: 2, color: 2 }, { x: 1, z: 1, color: 0 }])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("mem-l3-01", 3, [4, 4], 5000, [{ x: 0, z: 0, color: 0 }, { x: 3, z: 0, color: 1 }, { x: 1, z: 2, color: 2 }, { x: 3, z: 3, color: 3 }, { x: 0, z: 3, color: 1 }]),
      makeProblem("mem-l3-02", 3, [4, 4], 5000, [{ x: 1, z: 1, color: 2 }, { x: 2, z: 1, color: 0 }, { x: 1, z: 2, color: 3 }, { x: 2, z: 2, color: 1 }, { x: 0, z: 0, color: 0 }]),
      makeProblem("mem-l3-03", 3, [4, 4], 5000, [{ x: 0, z: 1, color: 3 }, { x: 2, z: 0, color: 2 }, { x: 3, z: 2, color: 0 }, { x: 1, z: 3, color: 1 }, { x: 2, z: 3, color: 2 }]),
      makeProblem("mem-l3-04", 3, [4, 4], 5000, [{ x: 0, z: 0, color: 1 }, { x: 3, z: 0, color: 3 }, { x: 0, z: 3, color: 2 }, { x: 3, z: 3, color: 0 }, { x: 1, z: 1, color: 2 }]),
      makeProblem("mem-l3-05", 3, [4, 4], 5000, [{ x: 3, z: 0, color: 0 }, { x: 1, z: 3, color: 3 }, { x: 2, z: 0, color: 4 }, { x: 3, z: 1, color: 2 }, { x: 1, z: 0, color: 2 }]),
      makeProblem("mem-l3-06", 3, [4, 4], 5000, [{ x: 0, z: 3, color: 4 }, { x: 1, z: 2, color: 3 }, { x: 1, z: 3, color: 1 }, { x: 0, z: 2, color: 4 }, { x: 2, z: 3, color: 2 }]),
      makeProblem("mem-l3-07", 3, [4, 4], 5000, [{ x: 3, z: 3, color: 4 }, { x: 2, z: 3, color: 0 }, { x: 1, z: 3, color: 1 }, { x: 2, z: 2, color: 0 }, { x: 3, z: 0, color: 3 }]),
      makeProblem("mem-l3-08", 3, [4, 4], 5000, [{ x: 3, z: 1, color: 2 }, { x: 3, z: 0, color: 3 }, { x: 1, z: 1, color: 0 }, { x: 2, z: 1, color: 0 }, { x: 2, z: 2, color: 1 }]),
      makeProblem("mem-l3-09", 3, [4, 4], 5000, [{ x: 0, z: 1, color: 2 }, { x: 0, z: 2, color: 1 }, { x: 0, z: 0, color: 0 }, { x: 1, z: 2, color: 3 }, { x: 1, z: 1, color: 3 }]),
      makeProblem("mem-l3-10", 3, [4, 4], 5000, [{ x: 3, z: 1, color: 2 }, { x: 3, z: 2, color: 0 }, { x: 3, z: 3, color: 0 }, { x: 2, z: 1, color: 3 }, { x: 2, z: 2, color: 4 }]),
      makeProblem("mem-l3-11", 3, [4, 4], 5000, [{ x: 2, z: 1, color: 4 }, { x: 1, z: 3, color: 3 }, { x: 0, z: 3, color: 0 }, { x: 0, z: 2, color: 2 }, { x: 3, z: 1, color: 2 }]),
      makeProblem("mem-l3-12", 3, [4, 4], 5000, [{ x: 0, z: 3, color: 4 }, { x: 1, z: 0, color: 3 }, { x: 2, z: 0, color: 2 }, { x: 3, z: 0, color: 1 }, { x: 0, z: 0, color: 1 }]),
      makeProblem("mem-l3-13", 3, [4, 4], 5000, [{ x: 0, z: 2, color: 0 }, { x: 1, z: 2, color: 3 }, { x: 0, z: 3, color: 1 }, { x: 0, z: 1, color: 2 }, { x: 2, z: 2, color: 1 }]),
      makeProblem("mem-l3-14", 3, [4, 4], 5000, [{ x: 0, z: 2, color: 0 }, { x: 1, z: 2, color: 2 }, { x: 2, z: 2, color: 3 }, { x: 2, z: 0, color: 4 }, { x: 1, z: 3, color: 0 }]),
      makeProblem("mem-l3-15", 3, [4, 4], 5000, [{ x: 2, z: 0, color: 1 }, { x: 3, z: 0, color: 2 }, { x: 2, z: 1, color: 4 }, { x: 3, z: 1, color: 2 }, { x: 2, z: 3, color: 0 }]),
      makeProblem("mem-l3-16", 3, [4, 4], 5000, [{ x: 3, z: 1, color: 4 }, { x: 2, z: 1, color: 3 }, { x: 3, z: 0, color: 0 }, { x: 2, z: 0, color: 0 }, { x: 3, z: 2, color: 1 }]),
      makeProblem("mem-l3-17", 3, [4, 4], 5000, [{ x: 0, z: 2, color: 0 }, { x: 1, z: 2, color: 2 }, { x: 3, z: 3, color: 2 }, { x: 0, z: 1, color: 1 }, { x: 1, z: 3, color: 4 }]),
      makeProblem("mem-l3-18", 3, [4, 4], 5000, [{ x: 2, z: 1, color: 4 }, { x: 2, z: 2, color: 3 }, { x: 1, z: 2, color: 1 }, { x: 1, z: 1, color: 0 }, { x: 1, z: 0, color: 0 }]),
      makeProblem("mem-l3-19", 3, [4, 4], 5000, [{ x: 1, z: 3, color: 4 }, { x: 2, z: 3, color: 2 }, { x: 1, z: 2, color: 3 }, { x: 0, z: 2, color: 3 }, { x: 0, z: 3, color: 1 }]),
      makeProblem("mem-l3-20", 3, [4, 4], 5000, [{ x: 3, z: 0, color: 0 }, { x: 2, z: 0, color: 3 }, { x: 3, z: 1, color: 2 }, { x: 3, z: 2, color: 4 }, { x: 2, z: 2, color: 4 }])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("mem-l4-01", 4, [4, 4], 4500, [{ x: 0, z: 0, color: 0 }, { x: 2, z: 0, color: 1 }, { x: 1, z: 1, color: 2 }, { x: 3, z: 2, color: 3 }, { x: 0, z: 3, color: 4 }, { x: 2, z: 3, color: 1 }]),
      makeProblem("mem-l4-02", 4, [4, 4], 4500, [{ x: 1, z: 0, color: 4 }, { x: 3, z: 0, color: 2 }, { x: 0, z: 1, color: 0 }, { x: 2, z: 2, color: 3 }, { x: 1, z: 3, color: 1 }, { x: 3, z: 3, color: 4 }]),
      makeProblem("mem-l4-03", 4, [4, 4], 4500, [{ x: 0, z: 0, color: 2 }, { x: 1, z: 1, color: 0 }, { x: 2, z: 1, color: 4 }, { x: 3, z: 2, color: 1 }, { x: 0, z: 2, color: 3 }, { x: 2, z: 3, color: 2 }, { x: 3, z: 0, color: 0 }]),
      makeProblem("mem-l4-04", 4, [4, 4], 4500, [{ x: 0, z: 1, color: 1 }, { x: 1, z: 0, color: 4 }, { x: 2, z: 2, color: 0 }, { x: 3, z: 1, color: 2 }, { x: 1, z: 3, color: 3 }, { x: 3, z: 3, color: 4 }, { x: 2, z: 0, color: 3 }]),
      makeProblem("mem-l4-05", 4, [4, 4], 4500, [{ x: 1, z: 3, color: 1 }, { x: 1, z: 2, color: 3 }, { x: 0, z: 2, color: 2 }, { x: 2, z: 3, color: 0 }, { x: 0, z: 3, color: 4 }, { x: 1, z: 1, color: 4 }]),
      makeProblem("mem-l4-06", 4, [4, 4], 4500, [{ x: 0, z: 0, color: 2 }, { x: 0, z: 1, color: 4 }, { x: 1, z: 0, color: 3 }, { x: 2, z: 0, color: 3 }, { x: 2, z: 1, color: 0 }, { x: 2, z: 2, color: 1 }]),
      makeProblem("mem-l4-07", 4, [4, 4], 4500, [{ x: 0, z: 3, color: 1 }, { x: 0, z: 2, color: 0 }, { x: 0, z: 1, color: 4 }, { x: 1, z: 1, color: 3 }, { x: 2, z: 1, color: 4 }, { x: 0, z: 0, color: 2 }, { x: 3, z: 3, color: 1 }]),
      makeProblem("mem-l4-08", 4, [4, 4], 4500, [{ x: 1, z: 3, color: 1 }, { x: 1, z: 2, color: 2 }, { x: 3, z: 2, color: 1 }, { x: 0, z: 3, color: 3 }, { x: 2, z: 3, color: 2 }, { x: 2, z: 0, color: 4 }, { x: 3, z: 3, color: 0 }]),
      makeProblem("mem-l4-09", 4, [4, 4], 4500, [{ x: 1, z: 3, color: 0 }, { x: 0, z: 3, color: 4 }, { x: 2, z: 3, color: 3 }, { x: 1, z: 2, color: 1 }, { x: 3, z: 3, color: 1 }, { x: 0, z: 2, color: 3 }, { x: 0, z: 1, color: 2 }]),
      makeProblem("mem-l4-10", 4, [4, 4], 4500, [{ x: 3, z: 0, color: 2 }, { x: 0, z: 2, color: 3 }, { x: 2, z: 1, color: 0 }, { x: 3, z: 1, color: 4 }, { x: 3, z: 2, color: 1 }, { x: 2, z: 2, color: 3 }, { x: 1, z: 2, color: 1 }]),
      makeProblem("mem-l4-11", 4, [4, 4], 4500, [{ x: 3, z: 3, color: 2 }, { x: 2, z: 3, color: 3 }, { x: 3, z: 2, color: 0 }, { x: 0, z: 1, color: 4 }, { x: 2, z: 2, color: 4 }, { x: 1, z: 3, color: 1 }]),
      makeProblem("mem-l4-12", 4, [4, 4], 4500, [{ x: 0, z: 3, color: 3 }, { x: 0, z: 2, color: 3 }, { x: 0, z: 1, color: 0 }, { x: 1, z: 1, color: 1 }, { x: 3, z: 2, color: 4 }, { x: 1, z: 2, color: 1 }, { x: 0, z: 0, color: 2 }]),
      makeProblem("mem-l4-13", 4, [4, 4], 4500, [{ x: 0, z: 0, color: 4 }, { x: 0, z: 1, color: 2 }, { x: 1, z: 1, color: 2 }, { x: 1, z: 0, color: 0 }, { x: 1, z: 2, color: 1 }, { x: 2, z: 0, color: 3 }, { x: 3, z: 2, color: 3 }]),
      makeProblem("mem-l4-14", 4, [4, 4], 4500, [{ x: 3, z: 1, color: 3 }, { x: 2, z: 1, color: 2 }, { x: 1, z: 3, color: 0 }, { x: 3, z: 2, color: 4 }, { x: 2, z: 2, color: 0 }, { x: 2, z: 3, color: 1 }]),
      makeProblem("mem-l4-15", 4, [4, 4], 4500, [{ x: 0, z: 2, color: 0 }, { x: 0, z: 3, color: 1 }, { x: 0, z: 1, color: 0 }, { x: 1, z: 3, color: 2 }, { x: 0, z: 0, color: 4 }, { x: 3, z: 1, color: 3 }]),
      makeProblem("mem-l4-16", 4, [4, 4], 4500, [{ x: 0, z: 2, color: 0 }, { x: 1, z: 2, color: 3 }, { x: 3, z: 0, color: 0 }, { x: 0, z: 3, color: 2 }, { x: 0, z: 1, color: 4 }, { x: 0, z: 0, color: 1 }, { x: 2, z: 0, color: 1 }]),
      makeProblem("mem-l4-17", 4, [4, 4], 4500, [{ x: 0, z: 3, color: 2 }, { x: 1, z: 3, color: 1 }, { x: 1, z: 2, color: 4 }, { x: 2, z: 3, color: 3 }, { x: 2, z: 2, color: 0 }, { x: 0, z: 2, color: 1 }, { x: 3, z: 0, color: 3 }]),
      makeProblem("mem-l4-18", 4, [4, 4], 4500, [{ x: 3, z: 0, color: 4 }, { x: 2, z: 0, color: 1 }, { x: 1, z: 0, color: 0 }, { x: 3, z: 2, color: 3 }, { x: 3, z: 1, color: 2 }, { x: 1, z: 1, color: 2 }, { x: 0, z: 2, color: 0 }]),
      makeProblem("mem-l4-19", 4, [4, 4], 4500, [{ x: 1, z: 2, color: 2 }, { x: 2, z: 2, color: 3 }, { x: 3, z: 2, color: 4 }, { x: 3, z: 1, color: 1 }, { x: 2, z: 3, color: 0 }, { x: 1, z: 3, color: 1 }, { x: 2, z: 1, color: 1 }]),
      makeProblem("mem-l4-20", 4, [4, 4], 4500, [{ x: 0, z: 1, color: 2 }, { x: 1, z: 0, color: 2 }, { x: 0, z: 2, color: 2 }, { x: 2, z: 0, color: 1 }, { x: 0, z: 3, color: 0 }, { x: 0, z: 0, color: 4 }, { x: 1, z: 1, color: 3 }])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("mem-l5-01", 5, [5, 5], 4000, [{ x: 0, z: 0, color: 0 }, { x: 4, z: 0, color: 1 }, { x: 2, z: 1, color: 2 }, { x: 0, z: 2, color: 3 }, { x: 4, z: 2, color: 4 }, { x: 1, z: 3, color: 0 }, { x: 3, z: 4, color: 1 }, { x: 2, z: 2, color: 3 }]),
      makeProblem("mem-l5-02", 5, [5, 5], 4000, [{ x: 1, z: 0, color: 4 }, { x: 3, z: 0, color: 2 }, { x: 0, z: 1, color: 0 }, { x: 4, z: 1, color: 3 }, { x: 2, z: 2, color: 1 }, { x: 0, z: 3, color: 4 }, { x: 4, z: 3, color: 0 }, { x: 2, z: 4, color: 2 }]),
      makeProblem("mem-l5-03", 5, [5, 5], 4000, [{ x: 0, z: 0, color: 1 }, { x: 2, z: 0, color: 3 }, { x: 4, z: 0, color: 0 }, { x: 1, z: 2, color: 2 }, { x: 3, z: 2, color: 4 }, { x: 0, z: 4, color: 1 }, { x: 2, z: 4, color: 0 }, { x: 4, z: 4, color: 3 }, { x: 2, z: 2, color: 2 }]),
      makeProblem("mem-l5-04", 5, [5, 5], 4000, [{ x: 0, z: 1, color: 2 }, { x: 1, z: 0, color: 4 }, { x: 2, z: 2, color: 0 }, { x: 3, z: 1, color: 1 }, { x: 4, z: 3, color: 3 }, { x: 1, z: 3, color: 2 }, { x: 3, z: 3, color: 4 }, { x: 0, z: 4, color: 0 }, { x: 4, z: 0, color: 1 }]),
      makeProblem("mem-l5-05", 5, [5, 5], 4000, [{ x: 4, z: 2, color: 1 }, { x: 3, z: 4, color: 2 }, { x: 4, z: 3, color: 4 }, { x: 3, z: 3, color: 0 }, { x: 4, z: 4, color: 2 }, { x: 2, z: 4, color: 3 }, { x: 2, z: 3, color: 4 }, { x: 4, z: 1, color: 3 }, { x: 2, z: 2, color: 0 }]),
      makeProblem("mem-l5-06", 5, [5, 5], 4000, [{ x: 1, z: 0, color: 3 }, { x: 2, z: 0, color: 3 }, { x: 0, z: 1, color: 2 }, { x: 1, z: 2, color: 4 }, { x: 4, z: 4, color: 1 }, { x: 4, z: 3, color: 3 }, { x: 0, z: 2, color: 4 }, { x: 0, z: 3, color: 0 }]),
      makeProblem("mem-l5-07", 5, [5, 5], 4000, [{ x: 0, z: 4, color: 1 }, { x: 0, z: 3, color: 2 }, { x: 0, z: 2, color: 4 }, { x: 1, z: 2, color: 0 }, { x: 1, z: 3, color: 2 }, { x: 0, z: 1, color: 3 }, { x: 2, z: 2, color: 3 }, { x: 1, z: 1, color: 1 }, { x: 1, z: 4, color: 2 }]),
      makeProblem("mem-l5-08", 5, [5, 5], 4000, [{ x: 4, z: 4, color: 1 }, { x: 4, z: 3, color: 2 }, { x: 0, z: 2, color: 3 }, { x: 0, z: 3, color: 0 }, { x: 2, z: 4, color: 0 }, { x: 4, z: 2, color: 4 }, { x: 3, z: 4, color: 4 }, { x: 3, z: 0, color: 0 }, { x: 0, z: 4, color: 4 }]),
      makeProblem("mem-l5-09", 5, [5, 5], 4000, [{ x: 1, z: 4, color: 0 }, { x: 4, z: 3, color: 0 }, { x: 4, z: 4, color: 1 }, { x: 3, z: 3, color: 3 }, { x: 3, z: 4, color: 2 }, { x: 2, z: 4, color: 3 }, { x: 2, z: 1, color: 4 }, { x: 2, z: 3, color: 3 }]),
      makeProblem("mem-l5-10", 5, [5, 5], 4000, [{ x: 1, z: 0, color: 2 }, { x: 2, z: 0, color: 2 }, { x: 1, z: 3, color: 4 }, { x: 1, z: 2, color: 0 }, { x: 3, z: 0, color: 1 }, { x: 2, z: 1, color: 0 }, { x: 0, z: 3, color: 2 }, { x: 1, z: 4, color: 3 }]),
      makeProblem("mem-l5-11", 5, [5, 5], 4000, [{ x: 2, z: 1, color: 1 }, { x: 3, z: 1, color: 3 }, { x: 4, z: 1, color: 2 }, { x: 1, z: 1, color: 4 }, { x: 2, z: 2, color: 3 }, { x: 4, z: 0, color: 4 }, { x: 4, z: 2, color: 0 }, { x: 3, z: 0, color: 3 }]),
      makeProblem("mem-l5-12", 5, [5, 5], 4000, [{ x: 0, z: 3, color: 4 }, { x: 1, z: 3, color: 1 }, { x: 2, z: 0, color: 2 }, { x: 4, z: 3, color: 0 }, { x: 1, z: 0, color: 2 }, { x: 3, z: 4, color: 0 }, { x: 2, z: 3, color: 0 }, { x: 3, z: 3, color: 3 }]),
      makeProblem("mem-l5-13", 5, [5, 5], 4000, [{ x: 4, z: 2, color: 4 }, { x: 3, z: 2, color: 3 }, { x: 3, z: 3, color: 0 }, { x: 4, z: 1, color: 1 }, { x: 4, z: 3, color: 2 }, { x: 3, z: 1, color: 1 }, { x: 2, z: 2, color: 2 }, { x: 4, z: 0, color: 3 }, { x: 4, z: 4, color: 1 }]),
      makeProblem("mem-l5-14", 5, [5, 5], 4000, [{ x: 4, z: 3, color: 1 }, { x: 0, z: 4, color: 0 }, { x: 2, z: 0, color: 0 }, { x: 0, z: 3, color: 4 }, { x: 1, z: 4, color: 4 }, { x: 4, z: 4, color: 2 }, { x: 1, z: 0, color: 3 }, { x: 3, z: 4, color: 2 }, { x: 0, z: 1, color: 1 }]),
      makeProblem("mem-l5-15", 5, [5, 5], 4000, [{ x: 2, z: 3, color: 1 }, { x: 1, z: 3, color: 3 }, { x: 1, z: 2, color: 0 }, { x: 2, z: 2, color: 3 }, { x: 0, z: 3, color: 2 }, { x: 3, z: 2, color: 1 }, { x: 4, z: 2, color: 0 }, { x: 4, z: 1, color: 4 }]),
      makeProblem("mem-l5-16", 5, [5, 5], 4000, [{ x: 4, z: 3, color: 0 }, { x: 2, z: 1, color: 4 }, { x: 4, z: 2, color: 0 }, { x: 1, z: 1, color: 2 }, { x: 4, z: 4, color: 0 }, { x: 0, z: 1, color: 0 }, { x: 3, z: 3, color: 3 }, { x: 4, z: 1, color: 1 }]),
      makeProblem("mem-l5-17", 5, [5, 5], 4000, [{ x: 0, z: 3, color: 3 }, { x: 1, z: 3, color: 4 }, { x: 0, z: 2, color: 0 }, { x: 2, z: 1, color: 2 }, { x: 0, z: 4, color: 4 }, { x: 4, z: 2, color: 0 }, { x: 1, z: 2, color: 1 }, { x: 1, z: 4, color: 2 }]),
      makeProblem("mem-l5-18", 5, [5, 5], 4000, [{ x: 2, z: 1, color: 3 }, { x: 3, z: 3, color: 4 }, { x: 2, z: 0, color: 1 }, { x: 4, z: 3, color: 0 }, { x: 3, z: 0, color: 1 }, { x: 4, z: 4, color: 0 }, { x: 1, z: 1, color: 2 }, { x: 1, z: 0, color: 2 }]),
      makeProblem("mem-l5-19", 5, [5, 5], 4000, [{ x: 1, z: 4, color: 2 }, { x: 2, z: 4, color: 3 }, { x: 1, z: 3, color: 3 }, { x: 1, z: 1, color: 4 }, { x: 2, z: 3, color: 0 }, { x: 1, z: 2, color: 1 }, { x: 1, z: 0, color: 4 }, { x: 0, z: 4, color: 0 }]),
      makeProblem("mem-l5-20", 5, [5, 5], 4000, [{ x: 4, z: 2, color: 4 }, { x: 4, z: 3, color: 2 }, { x: 2, z: 1, color: 0 }, { x: 3, z: 2, color: 0 }, { x: 3, z: 3, color: 2 }, { x: 3, z: 4, color: 1 }, { x: 1, z: 1, color: 3 }, { x: 2, z: 4, color: 3 }])
    ]
  }
];

export const levels = pools.map((entry) => ({
  level: entry.level,
  stars: entry.stars,
  pool: entry.problems,
  problems: sessionProblems("cube-memory", entry.level, entry.problems, 5)
}));

export function validateLevels() {
  if (levels.length !== 5) throw new Error("cube-memory requires five levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 5 || depth > 5) throw new Error(`${problem.id} grid exceeds 5x5`);
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
