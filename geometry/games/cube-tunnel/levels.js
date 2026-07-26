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

export const levels = [
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("tunnel-l2-01", 2, [3, 3, 2], [{ axis: "z", x: 1, y: 0 }]),
      makeProblem("tunnel-l2-02", 2, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }]),
      makeProblem("tunnel-l2-03", 2, [3, 3, 3], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 2, y: 1 }]),
      makeProblem("tunnel-l2-04", 2, [3, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 1, z: 1 }]),
      makeProblem("tunnel-l2-05", 2, [4, 3, 2], [{ axis: "z", x: 1, y: 0 }, { axis: "z", x: 2, y: 1 }])
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
      makeProblem("tunnel-l3-05", 3, [4, 3, 3], [{ axis: "z", x: 1, y: 1 }, { axis: "x", y: 0, z: 1 }])
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
      makeProblem("tunnel-l4-05", 4, [4, 4, 3], [{ axis: "z", x: 0, y: 1 }, { axis: "z", x: 3, y: 1 }, { axis: "x", y: 0, z: 1 }, { axis: "x", y: 2, z: 1 }])
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
      makeProblem("tunnel-l5-05", 5, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 1 }, { axis: "y", x: 3, z: 3 }, { axis: "y", x: 0, z: 0 }])
    ]
  },
  {
    // Expert: dense 4×4×4 blocks with five or six tunnels across all three axes.
    // Overlapping channels share cells, so the child must count the removed cells
    // as a set rather than adding tunnel lengths.
    level: 6,
    stars: 5,
    problems: [
      makeProblem("tunnel-l6-01", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 1 }, { axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 2 }, { axis: "x", y: 2, z: 1 }, { axis: "y", x: 0, z: 0 }]),
      makeProblem("tunnel-l6-02", 6, [4, 4, 4], [{ axis: "z", x: 0, y: 0 }, { axis: "z", x: 3, y: 3 }, { axis: "x", y: 0, z: 3 }, { axis: "x", y: 3, z: 0 }, { axis: "y", x: 1, z: 1 }, { axis: "y", x: 2, z: 2 }]),
      makeProblem("tunnel-l6-03", 6, [4, 4, 4], [{ axis: "z", x: 1, y: 2 }, { axis: "z", x: 2, y: 1 }, { axis: "x", y: 0, z: 0 }, { axis: "x", y: 3, z: 3 }, { axis: "y", x: 0, z: 3 }]),
      makeProblem("tunnel-l6-04", 6, [4, 4, 4], [{ axis: "z", x: 0, y: 3 }, { axis: "z", x: 3, y: 0 }, { axis: "z", x: 1, y: 1 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 2, z: 1 }, { axis: "y", x: 3, z: 3 }]),
      makeProblem("tunnel-l6-05", 6, [4, 4, 4], [{ axis: "z", x: 2, y: 2 }, { axis: "x", y: 1, z: 1 }, { axis: "x", y: 2, z: 2 }, { axis: "y", x: 0, z: 0 }, { axis: "y", x: 3, z: 0 }, { axis: "y", x: 1, z: 3 }])
    ]
  }
];

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
