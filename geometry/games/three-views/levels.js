import { sessionProblems } from "../../shared/problem-pool.js";

// 세 방향 관찰소 (Three-View Station)
//
// A stacking-cube arrangement is shown in 3D. The child colors the shape as seen
// from three directions — front (앞), side (옆, from the right), and top (위) —
// "앞·옆·위에서 본 모양을 표에 직접 색칠해요".
//
// A problem is authored as a heightmap:
//   grid   = [W, D]              footprint (x: 0..W-1 left→right, z: 0..D-1 back→front)
//   stacks = [{ x, z, h }, ...]  a column of height h (≥1) at (x, z)
//
// Views are DERIVED from the heightmap with a fixed convention that matches the
// 3/4 camera used in app.js (viewer sees the +z front face and +x right face):
//
//   front (앞) : look toward −z. columns = x (0→W−1, left→right),
//                rows = height y (top row = tallest). filled(x,y) ⇔ ∃z h[x][z] > y
//   side  (옆) : look from the right (+x) toward −x. columns = drawn c (0→D−1)
//                mapping to z = D−1−c so the FRONT (z=D−1) is on the left,
//                rows = height y. filled(c,y) ⇔ ∃x h[x][D−1−c] > y
//   top   (위) : look straight down. columns = x, rows = drawn r (0→D−1) mapping
//                to z = r so the BACK (z=0) is the top row, front the bottom.
//                filled(x,r) ⇔ h[x][r] ≥ 1
//
// Each view grid is an array of rows of 0/1. The child reproduces all three.

const heightMap = (grid, stacks) => {
  const [width, depth] = grid;
  const map = Array.from({ length: depth }, () => Array.from({ length: width }, () => 0));
  stacks.forEach(({ x, z, h }) => { map[z][x] = h; });
  return map;
};

const maxHeight = (map) => Math.max(1, ...map.flat());

// front view: rows top→bottom = y high→low, cols = x
function frontView(map, grid, height) {
  const [width, depth] = grid;
  const rows = [];
  for (let y = height - 1; y >= 0; y -= 1) {
    const row = [];
    for (let x = 0; x < width; x += 1) {
      let filled = 0;
      for (let z = 0; z < depth; z += 1) if (map[z][x] > y) { filled = 1; break; }
      row.push(filled);
    }
    rows.push(row);
  }
  return rows;
}

// side view from the right: cols c→z=D−1−c (front on the left), rows y high→low
function sideView(map, grid, height) {
  const [width, depth] = grid;
  const rows = [];
  for (let y = height - 1; y >= 0; y -= 1) {
    const row = [];
    for (let c = 0; c < depth; c += 1) {
      const z = depth - 1 - c;
      let filled = 0;
      for (let x = 0; x < width; x += 1) if (map[z][x] > y) { filled = 1; break; }
      row.push(filled);
    }
    rows.push(row);
  }
  return rows;
}

// top view: rows r→z=r (back on top), cols = x
function topView(map, grid) {
  const [width, depth] = grid;
  const rows = [];
  for (let r = 0; r < depth; r += 1) {
    const row = [];
    for (let x = 0; x < width; x += 1) row.push(map[r][x] >= 1 ? 1 : 0);
    rows.push(row);
  }
  return rows;
}

const makeProblem = (id, level, grid, stacks) => {
  const [width, depth] = grid;
  const seen = new Set();
  stacks.forEach(({ x, z, h }) => {
    if (x < 0 || x >= width || z < 0 || z >= depth) throw new Error(`${id}: stack ${x},${z} outside grid`);
    if (h < 1 || h > 4) throw new Error(`${id}: bad height ${h}`);
    const k = `${x},${z}`;
    if (seen.has(k)) throw new Error(`${id}: duplicate stack ${k}`);
    seen.add(k);
  });
  const map = heightMap(grid, stacks);
  const height = maxHeight(map);
  const views = {
    front: frontView(map, grid, height),
    side: sideView(map, grid, height),
    top: topView(map, grid)
  };
  const cubeCount = stacks.reduce((sum, s) => sum + s.h, 0);
  return { id, level, grid, stacks, map, height, views, cubeCount };
};

const pools = [
  {
    level: 1,
    stars: 1,
    problems: [
      makeProblem("view-l1-01", 1, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l1-02", 1, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l1-03", 1, [3, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("view-l1-04", 1, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }]),
      makeProblem("view-l1-05", 1, [3, 2], [{ x: 2, z: 1, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l1-06", 1, [3, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 1, h: 2 }]),
      makeProblem("view-l1-07", 1, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }]),
      makeProblem("view-l1-08", 1, [3, 2], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l1-09", 1, [2, 2], [{ x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }]),
      makeProblem("view-l1-10", 1, [3, 2], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }]),
      makeProblem("view-l1-11", 1, [3, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }]),
      makeProblem("view-l1-12", 1, [3, 2], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }]),
      makeProblem("view-l1-13", 1, [3, 2], [{ x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }]),
      makeProblem("view-l1-14", 1, [2, 2], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }]),
      makeProblem("view-l1-15", 1, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 2 }]),
      makeProblem("view-l1-16", 1, [3, 2], [{ x: 2, z: 1, h: 1 }, { x: 0, z: 1, h: 1 }, { x: 0, z: 0, h: 2 }]),
      makeProblem("view-l1-17", 1, [3, 2], [{ x: 2, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }]),
      makeProblem("view-l1-18", 1, [3, 2], [{ x: 2, z: 1, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 2 }]),
      makeProblem("view-l1-19", 1, [2, 2], [{ x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 0, h: 1 }]),
      makeProblem("view-l1-20", 1, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 2 }])
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("view-l2-01", 2, [3, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }]),
      makeProblem("view-l2-02", 2, [3, 2], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 0, z: 0, h: 1 }]),
      makeProblem("view-l2-03", 2, [3, 3], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l2-04", 2, [3, 2], [{ x: 0, z: 0, h: 2 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l2-05", 2, [3, 2], [{ x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 0, z: 1, h: 2 }]),
      makeProblem("view-l2-06", 2, [3, 3], [{ x: 2, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 2, z: 1, h: 2 }]),
      makeProblem("view-l2-07", 2, [3, 3], [{ x: 2, z: 2, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 2, h: 1 }]),
      makeProblem("view-l2-08", 2, [3, 3], [{ x: 0, z: 2, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 1, z: 0, h: 2 }]),
      makeProblem("view-l2-09", 2, [3, 2], [{ x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 1 }]),
      makeProblem("view-l2-10", 2, [3, 3], [{ x: 1, z: 1, h: 1 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 2, z: 1, h: 2 }]),
      makeProblem("view-l2-11", 2, [3, 3], [{ x: 2, z: 0, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }]),
      makeProblem("view-l2-12", 2, [3, 3], [{ x: 2, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 0, z: 2, h: 2 }]),
      makeProblem("view-l2-13", 2, [3, 2], [{ x: 1, z: 1, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l2-14", 2, [3, 2], [{ x: 1, z: 0, h: 2 }, { x: 0, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("view-l2-15", 2, [3, 3], [{ x: 2, z: 1, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l2-16", 2, [3, 2], [{ x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 2 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l2-17", 2, [3, 3], [{ x: 0, z: 2, h: 1 }, { x: 1, z: 2, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l2-18", 2, [3, 3], [{ x: 2, z: 0, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 2, h: 2 }]),
      makeProblem("view-l2-19", 2, [3, 2], [{ x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l2-20", 2, [3, 2], [{ x: 0, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 2, z: 0, h: 2 }])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("view-l3-01", 3, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }]),
      makeProblem("view-l3-02", 3, [3, 3], [{ x: 1, z: 1, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l3-03", 3, [3, 3], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l3-04", 3, [3, 3], [{ x: 2, z: 0, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 3 }]),
      makeProblem("view-l3-05", 3, [3, 3], [{ x: 1, z: 2, h: 1 }, { x: 0, z: 1, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 2, z: 2, h: 3 }]),
      makeProblem("view-l3-06", 3, [3, 3], [{ x: 1, z: 0, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 0, z: 1, h: 2 }]),
      makeProblem("view-l3-07", 3, [3, 3], [{ x: 2, z: 1, h: 3 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }]),
      makeProblem("view-l3-08", 3, [3, 3], [{ x: 2, z: 0, h: 1 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 2, h: 2 }]),
      makeProblem("view-l3-09", 3, [3, 3], [{ x: 2, z: 0, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 1, h: 3 }, { x: 1, z: 0, h: 1 }]),
      makeProblem("view-l3-10", 3, [3, 3], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 1, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l3-11", 3, [3, 3], [{ x: 1, z: 2, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 2, h: 3 }, { x: 1, z: 1, h: 2 }]),
      makeProblem("view-l3-12", 3, [3, 3], [{ x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }]),
      makeProblem("view-l3-13", 3, [3, 3], [{ x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l3-14", 3, [3, 3], [{ x: 1, z: 2, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 0, h: 3 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l3-15", 3, [3, 3], [{ x: 1, z: 2, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("view-l3-16", 3, [3, 3], [{ x: 0, z: 2, h: 2 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 3 }]),
      makeProblem("view-l3-17", 3, [3, 3], [{ x: 0, z: 2, h: 3 }, { x: 0, z: 0, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 1, h: 3 }]),
      makeProblem("view-l3-18", 3, [3, 3], [{ x: 0, z: 1, h: 2 }, { x: 0, z: 0, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 2, z: 2, h: 2 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("view-l3-19", 3, [3, 3], [{ x: 0, z: 0, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 1, z: 2, h: 3 }]),
      makeProblem("view-l3-20", 3, [3, 3], [{ x: 2, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 1, z: 2, h: 3 }, { x: 2, z: 0, h: 2 }])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("view-l4-01", 4, [4, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 3, z: 0, h: 2 }]),
      makeProblem("view-l4-02", 4, [4, 3], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 3, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 0, h: 1 }]),
      makeProblem("view-l4-03", 4, [4, 4], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 2 }, { x: 3, z: 3, h: 1 }, { x: 3, z: 0, h: 3 }, { x: 0, z: 3, h: 1 }]),
      makeProblem("view-l4-04", 4, [4, 3], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 0, h: 3 }, { x: 3, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }]),
      makeProblem("view-l4-05", 4, [4, 3], [{ x: 1, z: 2, h: 1 }, { x: 3, z: 2, h: 3 }, { x: 0, z: 2, h: 1 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 1, h: 3 }]),
      makeProblem("view-l4-06", 4, [4, 3], [{ x: 3, z: 2, h: 1 }, { x: 3, z: 0, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 2, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("view-l4-07", 4, [4, 4], [{ x: 3, z: 0, h: 3 }, { x: 0, z: 3, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }]),
      makeProblem("view-l4-08", 4, [4, 3], [{ x: 2, z: 2, h: 1 }, { x: 2, z: 0, h: 3 }, { x: 1, z: 1, h: 1 }, { x: 3, z: 1, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }]),
      makeProblem("view-l4-09", 4, [4, 3], [{ x: 0, z: 0, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 1, h: 1 }, { x: 3, z: 1, h: 3 }, { x: 1, z: 1, h: 3 }, { x: 0, z: 2, h: 1 }]),
      makeProblem("view-l4-10", 4, [4, 4], [{ x: 3, z: 1, h: 1 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 3, h: 2 }, { x: 0, z: 0, h: 3 }, { x: 3, z: 2, h: 1 }, { x: 0, z: 1, h: 3 }]),
      makeProblem("view-l4-11", 4, [4, 4], [{ x: 2, z: 2, h: 1 }, { x: 3, z: 2, h: 3 }, { x: 0, z: 1, h: 3 }, { x: 3, z: 0, h: 1 }, { x: 1, z: 2, h: 3 }, { x: 1, z: 1, h: 1 }]),
      makeProblem("view-l4-12", 4, [4, 3], [{ x: 3, z: 2, h: 2 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 0, h: 1 }, { x: 3, z: 1, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 0, z: 0, h: 3 }]),
      makeProblem("view-l4-13", 4, [4, 4], [{ x: 0, z: 2, h: 1 }, { x: 1, z: 2, h: 3 }, { x: 0, z: 3, h: 2 }, { x: 1, z: 3, h: 1 }, { x: 2, z: 3, h: 1 }, { x: 2, z: 2, h: 2 }]),
      makeProblem("view-l4-14", 4, [4, 4], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 3, z: 3, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }]),
      makeProblem("view-l4-15", 4, [4, 3], [{ x: 0, z: 1, h: 2 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 2, h: 2 }, { x: 3, z: 1, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("view-l4-16", 4, [4, 4], [{ x: 0, z: 3, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }, { x: 3, z: 0, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 3, z: 3, h: 1 }]),
      makeProblem("view-l4-17", 4, [4, 4], [{ x: 2, z: 3, h: 3 }, { x: 1, z: 3, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 3, h: 3 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l4-18", 4, [4, 4], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 3, z: 3, h: 1 }, { x: 0, z: 0, h: 3 }, { x: 3, z: 0, h: 1 }, { x: 3, z: 2, h: 2 }]),
      makeProblem("view-l4-19", 4, [4, 3], [{ x: 0, z: 0, h: 3 }, { x: 3, z: 1, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 3, z: 0, h: 3 }, { x: 3, z: 2, h: 1 }, { x: 1, z: 0, h: 1 }]),
      makeProblem("view-l4-20", 4, [4, 3], [{ x: 2, z: 1, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 2, h: 2 }, { x: 3, z: 0, h: 1 }, { x: 3, z: 2, h: 1 }, { x: 1, z: 0, h: 2 }])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("view-l5-01", 5, [4, 4], [{ x: 0, z: 0, h: 4 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 3, z: 3, h: 1 }, { x: 3, z: 0, h: 2 }, { x: 0, z: 3, h: 1 }, { x: 1, z: 3, h: 2 }]),
      makeProblem("view-l5-02", 5, [4, 4], [{ x: 1, z: 1, h: 4 }, { x: 0, z: 0, h: 1 }, { x: 3, z: 0, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 0, z: 3, h: 2 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l5-03", 5, [4, 4], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 4 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 3, z: 0, h: 1 }]),
      makeProblem("view-l5-04", 5, [4, 4], [{ x: 3, z: 0, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 3, h: 4 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }]),
      makeProblem("view-l5-05", 5, [4, 4], [{ x: 3, z: 0, h: 4 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 3, h: 3 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 1, h: 1 }, { x: 3, z: 3, h: 4 }]),
      makeProblem("view-l5-06", 5, [4, 4], [{ x: 2, z: 0, h: 1 }, { x: 3, z: 3, h: 4 }, { x: 1, z: 0, h: 3 }, { x: 1, z: 3, h: 3 }, { x: 0, z: 3, h: 1 }, { x: 2, z: 3, h: 3 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l5-07", 5, [4, 4], [{ x: 2, z: 0, h: 3 }, { x: 1, z: 2, h: 2 }, { x: 2, z: 1, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 3, z: 0, h: 3 }, { x: 0, z: 2, h: 3 }, { x: 1, z: 1, h: 4 }]),
      makeProblem("view-l5-08", 5, [4, 4], [{ x: 2, z: 2, h: 4 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 3, h: 1 }, { x: 3, z: 3, h: 3 }, { x: 3, z: 1, h: 3 }, { x: 2, z: 3, h: 1 }, { x: 1, z: 2, h: 2 }]),
      makeProblem("view-l5-09", 5, [4, 4], [{ x: 3, z: 1, h: 2 }, { x: 1, z: 0, h: 4 }, { x: 1, z: 3, h: 3 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 0, h: 3 }, { x: 1, z: 2, h: 2 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("view-l5-10", 5, [4, 4], [{ x: 2, z: 3, h: 1 }, { x: 1, z: 3, h: 2 }, { x: 3, z: 2, h: 2 }, { x: 0, z: 2, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 2, h: 4 }]),
      makeProblem("view-l5-11", 5, [4, 4], [{ x: 3, z: 3, h: 1 }, { x: 3, z: 1, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 2, z: 0, h: 4 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 2, h: 2 }, { x: 0, z: 1, h: 4 }]),
      makeProblem("view-l5-12", 5, [4, 4], [{ x: 3, z: 1, h: 2 }, { x: 3, z: 3, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 3, h: 4 }, { x: 0, z: 2, h: 4 }, { x: 0, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }]),
      makeProblem("view-l5-13", 5, [4, 4], [{ x: 1, z: 0, h: 1 }, { x: 1, z: 3, h: 2 }, { x: 2, z: 2, h: 4 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 3, z: 2, h: 2 }, { x: 3, z: 1, h: 4 }]),
      makeProblem("view-l5-14", 5, [4, 4], [{ x: 1, z: 3, h: 4 }, { x: 3, z: 2, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 2, z: 3, h: 1 }, { x: 3, z: 1, h: 4 }, { x: 2, z: 1, h: 2 }, { x: 1, z: 0, h: 3 }]),
      makeProblem("view-l5-15", 5, [4, 4], [{ x: 3, z: 1, h: 3 }, { x: 2, z: 3, h: 2 }, { x: 1, z: 3, h: 3 }, { x: 2, z: 1, h: 4 }, { x: 0, z: 3, h: 2 }, { x: 1, z: 2, h: 2 }, { x: 3, z: 3, h: 1 }]),
      makeProblem("view-l5-16", 5, [4, 4], [{ x: 0, z: 3, h: 4 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 2, h: 4 }, { x: 1, z: 0, h: 4 }, { x: 3, z: 2, h: 1 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }]),
      makeProblem("view-l5-17", 5, [4, 4], [{ x: 0, z: 3, h: 2 }, { x: 2, z: 2, h: 4 }, { x: 2, z: 0, h: 3 }, { x: 1, z: 1, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 3, h: 1 }, { x: 1, z: 0, h: 1 }]),
      makeProblem("view-l5-18", 5, [4, 4], [{ x: 3, z: 0, h: 1 }, { x: 0, z: 0, h: 3 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 3, h: 3 }, { x: 2, z: 0, h: 4 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 3, h: 2 }]),
      makeProblem("view-l5-19", 5, [4, 4], [{ x: 0, z: 2, h: 4 }, { x: 3, z: 0, h: 3 }, { x: 1, z: 3, h: 1 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 3, z: 2, h: 4 }]),
      makeProblem("view-l5-20", 5, [4, 4], [{ x: 1, z: 0, h: 3 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 0, h: 2 }, { x: 3, z: 0, h: 1 }, { x: 1, z: 3, h: 2 }, { x: 0, z: 3, h: 4 }, { x: 3, z: 3, h: 2 }])
    ]
  }
];

export const levels = pools.map((entry) => ({
  level: entry.level,
  stars: entry.stars,
  pool: entry.problems,
  problems: sessionProblems("three-views", entry.level, entry.problems, 5)
}));

export function validateLevels() {
  if (levels.length !== 5) throw new Error("three-views requires five levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 4 || depth > 4 || problem.height > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.stacks.length < 3) throw new Error(`${problem.id} needs at least three stacks`);
      // Views must be self-consistent: recomputing from the map matches, and the
      // top view's filled-cell count equals the number of stacks.
      const topFilled = problem.views.top.flat().reduce((a, b) => a + b, 0);
      if (topFilled !== problem.stacks.length) throw new Error(`${problem.id} top view mismatch`);
      if (problem.views.front.length !== problem.height) throw new Error(`${problem.id} front rows`);
      if (problem.views.front[0].length !== width) throw new Error(`${problem.id} front cols`);
      if (problem.views.side[0].length !== depth) throw new Error(`${problem.id} side cols`);
      // Every view must have at least one filled cell in its bottom row (object sits on the board).
      const bottom = problem.views.front[problem.height - 1];
      if (!bottom.some((c) => c === 1)) throw new Error(`${problem.id} front bottom empty`);
    });
  });
}
