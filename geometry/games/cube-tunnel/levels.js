import { sessionProblems } from "../../shared/problem-pool.js";

// 큐브 터널 (Cube Tunnels)
//
// Start from a solid rectangular block of size box = [W, D, H]. Straight tunnels
// are drilled all the way through, each removing a full line of unit cubes.
// The child counts how many cubes REMAIN:
//
//   remaining = W * D * H  -  (number of cubes removed by the tunnels)
//
// Overlapping tunnels share cells, so the removed cells are counted as a set.
//
// Coordinates: x = 0..W-1 (left→right, +x), y = 0..H-1 (bottom→top), z = 0..D-1
// (back→front, +z). A tunnel is one of:
//   { axis: "z", x, y }  drills front↔back  (removes every z at column x,y)
//   { axis: "x", y, z }  drills left↔right   (removes every x at row y, depth z)
//   { axis: "y", x, z }  drills top↔bottom   (removes every y at column x, depth z)

const key = (x, y, z) => `${x},${y},${z}`;

// The set of cells removed by the tunnels — used to score the answer and to
// light up the drilled channels on "구멍 보기".
export function removedCells(box, tunnels) {
  const [width, depth, height] = box;
  const cells = new Set();
  tunnels.forEach((t) => {
    if (t.axis === "z") { for (let z = 0; z < depth; z += 1) cells.add(key(t.x, t.y, z)); }
    else if (t.axis === "x") { for (let x = 0; x < width; x += 1) cells.add(key(x, t.y, t.z)); }
    else if (t.axis === "y") { for (let y = 0; y < height; y += 1) cells.add(key(t.x, y, t.z)); }
  });
  return cells;
}

const makeProblem = (id, level, box, tunnels) => {
  const [width, depth, height] = box;
  tunnels.forEach((t) => {
    const bad =
      (t.axis === "z" && (t.x >= width || t.y >= height)) ||
      (t.axis === "x" && (t.y >= height || t.z >= depth)) ||
      (t.axis === "y" && (t.x >= width || t.z >= depth));
    if (bad) throw new Error(`${id} has a tunnel outside the block`);
  });
  const capacity = width * depth * height;
  const removed = removedCells(box, tunnels).size;
  return {
    id,
    level,
    box,
    tunnels,
    capacity,
    removed,
    answer: { remaining: capacity - removed }
  };
};

const pools = [
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("tunnel-l2-01", 2, [3, 3, 2], [{ axis: "z", x: 1, y: 0 }]),
      makeProblem("tunnel-l2-02", 2, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l2-03", 2, [3, 3, 3], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-04", 2, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 1, z: 1 }]),
      makeProblem("tunnel-l2-05", 2, [4, 3, 2], [{ axis: "z", x: 1, y: 0 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-06", 2, [3, 3, 2], [{ axis: "z", x: 2, y: 0 }]),
      makeProblem("tunnel-l2-07", 2, [3, 3, 3], [{ axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-08", 2, [3, 3, 3], [{ axis: "x", y: 1, z: 2 }, { axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l2-09", 2, [4, 3, 2], [{ axis: "x", y: 1, z: 0 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-10", 2, [3, 3, 2], [{ axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l2-11", 2, [4, 3, 2], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 2, y: 0 }]),
      makeProblem("tunnel-l2-12", 2, [4, 3, 2], [{ axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l2-13", 2, [3, 3, 3], [{ axis: "z", x: 0, y: 2 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-14", 2, [3, 3, 2], [{ axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-15", 2, [4, 3, 2], [{ axis: "z", x: 3, y: 0 }]),
      makeProblem("tunnel-l2-16", 2, [3, 3, 3], [{ axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l2-17", 2, [4, 3, 2], [{ axis: "x", y: 0, z: 0 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l2-18", 2, [3, 3, 3], [{ axis: "z", x: 0, y: 1 }]),
      makeProblem("tunnel-l2-19", 2, [3, 3, 3], [{ axis: "z", x: 2, y: 0 }, { axis: "x", y: 0, z: 1 }]),
      makeProblem("tunnel-l2-20", 2, [4, 3, 2], [{ axis: "x", y: 0, z: 1 }, { axis: "z", x: 1, y: 1 }])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("tunnel-l3-01", 3, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 1, z: 0 }]),
      makeProblem("tunnel-l3-02", 3, [4, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l3-03", 3, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 1, z: 1 }, { axis: "y", x: 1, z: 1 }]),
      makeProblem("tunnel-l3-04", 3, [4, 4, 2], [{ axis: "z", x: 1, y: 0 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 2 }]),
      makeProblem("tunnel-l3-05", 3, [4, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 0, z: 1 }]),
      makeProblem("tunnel-l3-06", 3, [4, 4, 2], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 3, y: 0 }]),
      makeProblem("tunnel-l3-07", 3, [4, 4, 2], [{ axis: "z", x: 3, y: 0 }, { axis: "z", x: 0, y: 1 }, { axis: "y", x: 2, z: 2 }]),
      makeProblem("tunnel-l3-08", 3, [4, 4, 2], [{ axis: "z", x: 2, y: 0 }, { axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l3-09", 3, [4, 3, 3], [{ axis: "z", x: 3, y: 2 }, { axis: "y", x: 0, z: 0 }]),
      makeProblem("tunnel-l3-10", 3, [3, 3, 3], [{ axis: "z", x: 2, y: 1 }, { axis: "y", x: 2, z: 2 }]),
      makeProblem("tunnel-l3-11", 3, [4, 4, 2], [{ axis: "x", y: 0, z: 1 }, { axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l3-12", 3, [4, 4, 2], [{ axis: "y", x: 0, z: 2 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l3-13", 3, [4, 4, 2], [{ axis: "x", y: 1, z: 0 }, { axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l3-14", 3, [4, 4, 2], [{ axis: "z", x: 0, y: 0 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l3-15", 3, [3, 3, 3], [{ axis: "z", x: 2, y: 0 }, { axis: "z", x: 2, y: 2 }]),
      makeProblem("tunnel-l3-16", 3, [4, 4, 2], [{ axis: "y", x: 2, z: 1 }, { axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l3-17", 3, [4, 3, 3], [{ axis: "x", y: 1, z: 0 }, { axis: "z", x: 2, y: 2 }]),
      makeProblem("tunnel-l3-18", 3, [4, 4, 2], [{ axis: "x", y: 0, z: 2 }, { axis: "y", x: 0, z: 2 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l3-19", 3, [4, 4, 2], [{ axis: "x", y: 1, z: 2 }, { axis: "z", x: 3, y: 1 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l3-20", 3, [4, 4, 2], [{ axis: "z", x: 2, y: 0 }, { axis: "y", x: 2, z: 3 }])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("tunnel-l4-01", 4, [4, 4, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 2 }]),
      makeProblem("tunnel-l4-02", 4, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 2, z: 2 }]),
      makeProblem("tunnel-l4-03", 4, [4, 4, 3], [{ axis: "z", x: 1, y: 0 }, { axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 1 }]),
      makeProblem("tunnel-l4-04", 4, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 2 }, { axis: "y", x: 0, z: 0 }]),
      makeProblem("tunnel-l4-05", 4, [4, 4, 3], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 3, y: 1 }, { axis: "x", y: 0, z: 1 }, { axis: "x", y: 2, z: 1 }]),
      makeProblem("tunnel-l4-06", 4, [4, 4, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "y", x: 1, z: 2 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l4-07", 4, [4, 4, 3], [{ axis: "x", y: 0, z: 1 }, { axis: "y", x: 3, z: 1 }, { axis: "x", y: 1, z: 1 }, { axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l4-08", 4, [4, 4, 4], [{ axis: "x", y: 2, z: 2 }, { axis: "x", y: 3, z: 3 }, { axis: "y", x: 3, z: 3 }, { axis: "z", x: 3, y: 0 }]),
      makeProblem("tunnel-l4-09", 4, [4, 4, 4], [{ axis: "z", x: 2, y: 1 }, { axis: "x", y: 2, z: 1 }, { axis: "y", x: 3, z: 0 }]),
      makeProblem("tunnel-l4-10", 4, [4, 4, 4], [{ axis: "x", y: 2, z: 3 }, { axis: "y", x: 2, z: 1 }, { axis: "z", x: 0, y: 2 }]),
      makeProblem("tunnel-l4-11", 4, [4, 4, 3], [{ axis: "z", x: 3, y: 2 }, { axis: "y", x: 0, z: 1 }]),
      makeProblem("tunnel-l4-12", 4, [4, 4, 4], [{ axis: "x", y: 3, z: 1 }, { axis: "z", x: 0, y: 2 }, { axis: "z", x: 1, y: 3 }]),
      makeProblem("tunnel-l4-13", 4, [4, 4, 4], [{ axis: "x", y: 2, z: 3 }, { axis: "x", y: 2, z: 0 }, { axis: "z", x: 3, y: 3 }]),
      makeProblem("tunnel-l4-14", 4, [4, 4, 4], [{ axis: "y", x: 2, z: 2 }, { axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l4-15", 4, [4, 4, 3], [{ axis: "z", x: 3, y: 0 }, { axis: "z", x: 3, y: 1 }, { axis: "x", y: 1, z: 1 }, { axis: "x", y: 2, z: 0 }]),
      makeProblem("tunnel-l4-16", 4, [4, 4, 4], [{ axis: "z", x: 0, y: 1 }, { axis: "x", y: 1, z: 1 }, { axis: "x", y: 3, z: 2 }, { axis: "z", x: 3, y: 3 }]),
      makeProblem("tunnel-l4-17", 4, [4, 4, 3], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l4-18", 4, [4, 4, 3], [{ axis: "z", x: 3, y: 2 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l4-19", 4, [4, 4, 3], [{ axis: "y", x: 1, z: 0 }, { axis: "z", x: 3, y: 2 }, { axis: "x", y: 1, z: 0 }]),
      makeProblem("tunnel-l4-20", 4, [4, 4, 4], [{ axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 1 }, { axis: "y", x: 0, z: 3 }])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("tunnel-l5-01", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 2 }, { axis: "x", y: 0, z: 0 }, { axis: "x", y: 3, z: 3 }]),
      makeProblem("tunnel-l5-02", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 3, z: 0 }]),
      makeProblem("tunnel-l5-03", 5, [4, 4, 4], [{ axis: "z", x: 0, y: 0 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 1, z: 1 }, { axis: "y", x: 2, z: 2 }]),
      makeProblem("tunnel-l5-04", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 1, z: 1 }, { axis: "x", y: 1, z: 2 }]),
      makeProblem("tunnel-l5-05", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 1 }, { axis: "y", x: 3, z: 3 }, { axis: "y", x: 0, z: 0 }]),
      makeProblem("tunnel-l5-06", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 0 }, { axis: "y", x: 1, z: 1 }, { axis: "y", x: 3, z: 1 }, { axis: "x", y: 3, z: 3 }, { axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l5-07", 5, [4, 4, 4], [{ axis: "x", y: 2, z: 0 }, { axis: "x", y: 1, z: 2 }, { axis: "z", x: 2, y: 0 }, { axis: "z", x: 2, y: 2 }]),
      makeProblem("tunnel-l5-08", 5, [4, 4, 4], [{ axis: "y", x: 0, z: 1 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 0, z: 3 }]),
      makeProblem("tunnel-l5-09", 5, [4, 4, 4], [{ axis: "x", y: 3, z: 3 }, { axis: "y", x: 0, z: 2 }, { axis: "z", x: 3, y: 1 }, { axis: "x", y: 0, z: 0 }]),
      makeProblem("tunnel-l5-10", 5, [4, 4, 4], [{ axis: "y", x: 3, z: 3 }, { axis: "y", x: 0, z: 2 }, { axis: "z", x: 3, y: 1 }, { axis: "z", x: 1, y: 3 }]),
      makeProblem("tunnel-l5-11", 5, [4, 4, 4], [{ axis: "y", x: 1, z: 0 }, { axis: "x", y: 1, z: 2 }, { axis: "z", x: 1, y: 1 }, { axis: "y", x: 1, z: 3 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l5-12", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 3 }, { axis: "x", y: 1, z: 3 }, { axis: "x", y: 3, z: 1 }, { axis: "z", x: 0, y: 1 }]),
      makeProblem("tunnel-l5-13", 5, [4, 4, 4], [{ axis: "x", y: 0, z: 0 }, { axis: "y", x: 0, z: 0 }, { axis: "y", x: 1, z: 1 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l5-14", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 0 }, { axis: "y", x: 3, z: 1 }, { axis: "z", x: 0, y: 3 }]),
      makeProblem("tunnel-l5-15", 5, [4, 4, 4], [{ axis: "z", x: 2, y: 3 }, { axis: "y", x: 0, z: 0 }, { axis: "z", x: 3, y: 3 }]),
      makeProblem("tunnel-l5-16", 5, [4, 4, 4], [{ axis: "y", x: 1, z: 2 }, { axis: "x", y: 2, z: 3 }, { axis: "z", x: 3, y: 1 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 3, z: 3 }]),
      makeProblem("tunnel-l5-17", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "y", x: 3, z: 3 }, { axis: "x", y: 2, z: 0 }, { axis: "x", y: 0, z: 3 }]),
      makeProblem("tunnel-l5-18", 5, [4, 4, 4], [{ axis: "y", x: 2, z: 3 }, { axis: "x", y: 1, z: 0 }, { axis: "y", x: 0, z: 3 }, { axis: "z", x: 2, y: 0 }]),
      makeProblem("tunnel-l5-19", 5, [4, 4, 4], [{ axis: "z", x: 2, y: 1 }, { axis: "y", x: 2, z: 0 }, { axis: "x", y: 0, z: 3 }, { axis: "x", y: 1, z: 0 }, { axis: "z", x: 3, y: 1 }]),
      makeProblem("tunnel-l5-20", 5, [4, 4, 4], [{ axis: "x", y: 1, z: 2 }, { axis: "z", x: 0, y: 2 }, { axis: "x", y: 0, z: 0 }, { axis: "y", x: 2, z: 0 }, { axis: "z", x: 1, y: 2 }])
    ]
  },
  {
    level: 6,
    stars: 5,
    problems: [
      makeProblem("tunnel-l6-01", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 2 }, { axis: "x", y: 2, z: 1 }, { axis: "y", x: 0, z: 0 }]),
      makeProblem("tunnel-l6-02", 6, [4, 4, 4], [{ axis: "z", x: 0, y: 0 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 0, z: 3 }, { axis: "x", y: 3, z: 0 }, { axis: "y", x: 1, z: 1 }, { axis: "y", x: 2, z: 2 }]),
      makeProblem("tunnel-l6-03", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 0 }, { axis: "x", y: 3, z: 3 }, { axis: "y", x: 0, z: 3 }]),
      makeProblem("tunnel-l6-04", 6, [4, 4, 4], [{ axis: "z", x: 0, y: 3 }, { axis: "z", x: 3, y: 0 }, { axis: "z", x: 1, y: 1 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 2, z: 1 }, { axis: "y", x: 3, z: 3 }]),
      makeProblem("tunnel-l6-05", 6, [4, 4, 4], [{ axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 1 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 0, z: 0 }, { axis: "y", x: 3, z: 0 }, { axis: "y", x: 1, z: 3 }]),
      makeProblem("tunnel-l6-06", 6, [4, 4, 4], [{ axis: "z", x: 2, y: 1 }, { axis: "y", x: 2, z: 1 }, { axis: "x", y: 0, z: 2 }, { axis: "z", x: 1, y: 1 }, { axis: "y", x: 0, z: 2 }, { axis: "z", x: 3, y: 3 }]),
      makeProblem("tunnel-l6-07", 6, [4, 4, 4], [{ axis: "z", x: 2, y: 2 }, { axis: "z", x: 0, y: 2 }, { axis: "z", x: 1, y: 3 }, { axis: "y", x: 2, z: 1 }, { axis: "x", y: 1, z: 2 }]),
      makeProblem("tunnel-l6-08", 6, [4, 4, 4], [{ axis: "y", x: 3, z: 2 }, { axis: "y", x: 1, z: 3 }, { axis: "z", x: 0, y: 3 }, { axis: "y", x: 0, z: 2 }, { axis: "x", y: 2, z: 3 }, { axis: "x", y: 3, z: 3 }]),
      makeProblem("tunnel-l6-09", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "y", x: 3, z: 0 }, { axis: "y", x: 1, z: 2 }, { axis: "x", y: 3, z: 0 }, { axis: "x", y: 2, z: 0 }, { axis: "z", x: 2, y: 0 }]),
      makeProblem("tunnel-l6-10", 6, [4, 4, 4], [{ axis: "y", x: 3, z: 3 }, { axis: "z", x: 2, y: 0 }, { axis: "x", y: 2, z: 1 }, { axis: "y", x: 2, z: 2 }, { axis: "x", y: 3, z: 3 }]),
      makeProblem("tunnel-l6-11", 6, [4, 4, 4], [{ axis: "x", y: 2, z: 0 }, { axis: "y", x: 3, z: 0 }, { axis: "z", x: 3, y: 1 }, { axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 3 }, { axis: "x", y: 2, z: 3 }]),
      makeProblem("tunnel-l6-12", 6, [4, 4, 4], [{ axis: "z", x: 3, y: 0 }, { axis: "z", x: 0, y: 0 }, { axis: "z", x: 3, y: 1 }, { axis: "y", x: 1, z: 2 }, { axis: "x", y: 1, z: 0 }, { axis: "y", x: 0, z: 1 }]),
      makeProblem("tunnel-l6-13", 6, [4, 4, 4], [{ axis: "x", y: 0, z: 3 }, { axis: "z", x: 1, y: 0 }, { axis: "z", x: 2, y: 1 }, { axis: "y", x: 3, z: 1 }, { axis: "z", x: 0, y: 2 }]),
      makeProblem("tunnel-l6-14", 6, [4, 4, 4], [{ axis: "z", x: 3, y: 1 }, { axis: "x", y: 3, z: 2 }, { axis: "x", y: 0, z: 3 }, { axis: "y", x: 1, z: 3 }, { axis: "y", x: 0, z: 3 }, { axis: "y", x: 3, z: 2 }]),
      makeProblem("tunnel-l6-15", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "x", y: 1, z: 2 }, { axis: "z", x: 3, y: 1 }, { axis: "y", x: 3, z: 3 }, { axis: "z", x: 2, y: 3 }]),
      makeProblem("tunnel-l6-16", 6, [4, 4, 4], [{ axis: "x", y: 2, z: 0 }, { axis: "y", x: 0, z: 2 }, { axis: "y", x: 2, z: 3 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 3 }, { axis: "z", x: 0, y: 0 }]),
      makeProblem("tunnel-l6-17", 6, [4, 4, 4], [{ axis: "x", y: 0, z: 3 }, { axis: "z", x: 3, y: 1 }, { axis: "y", x: 3, z: 0 }, { axis: "y", x: 0, z: 2 }, { axis: "y", x: 2, z: 0 }]),
      makeProblem("tunnel-l6-18", 6, [4, 4, 4], [{ axis: "y", x: 1, z: 3 }, { axis: "y", x: 2, z: 1 }, { axis: "y", x: 2, z: 0 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 2, z: 1 }, { axis: "x", y: 3, z: 2 }]),
      makeProblem("tunnel-l6-19", 6, [4, 4, 4], [{ axis: "y", x: 2, z: 0 }, { axis: "z", x: 1, y: 2 }, { axis: "z", x: 3, y: 0 }, { axis: "z", x: 3, y: 2 }, { axis: "x", y: 3, z: 1 }, { axis: "y", x: 3, z: 1 }]),
      makeProblem("tunnel-l6-20", 6, [4, 4, 4], [{ axis: "z", x: 3, y: 3 }, { axis: "y", x: 1, z: 2 }, { axis: "y", x: 1, z: 3 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 0, z: 3 }, { axis: "z", x: 0, y: 3 }])
    ]
  }
];

// The pool-cache key uses the level's ARRAY POSITION (index + 1), not its raw
// `level` number — cube-tunnel's first playable level is numbered 2 (no
// level 1 puzzle set exists), but game-flow.js's "?level=N" practice reload
// always sends the 1-based position shown in the level picker (readProgress()
// parses "레벨 N" off state.levelIndex + 1 in app.js, and requestedLevel()
// clicks buttons[N - 1]). Keying sessionProblems() by the raw level number
// here would silently never match that URL, so the practice cursor would
// never advance.
export const levels = pools.map((entry, index) => ({
  level: entry.level,
  stars: entry.stars,
  pool: entry.problems,
  problems: sessionProblems("cube-tunnel", index + 1, entry.problems, 5)
}));

export function validateLevels() {
  if (levels.length !== 5) throw new Error("cube-tunnel requires five levels");
  levels.forEach((level) => {
    if (level.problems.length !== 5) throw new Error(`level ${level.level} requires five problems`);
    level.problems.forEach((problem) => {
      const [width, depth, height] = problem.box;
      if (width > 4 || depth > 4 || height > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (problem.answer.remaining !== problem.capacity - removedCells(problem.box, problem.tunnels).size) {
        throw new Error(`${problem.id} has an inconsistent remaining count`);
      }
      if (problem.answer.remaining < 1 || problem.answer.remaining > 64) {
        throw new Error(`${problem.id} remaining out of range`);
      }
      if (problem.removed < 1) throw new Error(`${problem.id} has no tunnel`);
    });
  });
}
