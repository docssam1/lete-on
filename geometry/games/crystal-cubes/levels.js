// 크리스털 큐브 (Crystal Cubes)
//
// The reverse of the Three-View Station. The child is given three view cards —
// front (앞), side (옆, from the right), and top (위) — and must BUILD a solid
// inside a clear case so that it looks exactly like all three cards at once —
// "투명 케이스의 세 방향 카드를 만족하는 모양을 만들어요".
//
// Because several different solids can share the same three views, the game
// accepts ANY build whose three views match the cards (not one fixed answer).
// A reference arrangement is authored only to GENERATE the target cards.
//
// Axis convention is identical to the Three-View Station so the two games teach
// the same picture:
//   grid   = [W, D]              footprint (x: 0..W-1 left→right, z: 0..D-1 back→front)
//   stacks = [{ x, z, h }, ...]  reference column of height h (≥1) at (x, z)
//   front (앞): cols = x, rows = height (top = tallest). filled(x,y) ⇔ ∃z h[x][z] > y
//   side  (옆): cols c → z = D−1−c (front on the left), rows = height.
//   top   (위): cols = x, rows r → z = r (back on top). filled(x,r) ⇔ h[x][r] ≥ 1

const heightMap = (grid, stacks) => {
  const [width, depth] = grid;
  const map = Array.from({ length: depth }, () => Array.from({ length: width }, () => 0));
  stacks.forEach(({ x, z, h }) => { map[z][x] = h; });
  return map;
};

const maxHeight = (map) => Math.max(1, ...map.flat());

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

// Compute the three views of an arbitrary build. `heightGrid` is indexed
// [z][x]; `height` fixes the row count so it can be compared cell-for-cell with
// the target cards. Used by the game to score whatever the child builds.
export function viewsOfHeightGrid(heightGrid, grid, height) {
  return {
    front: frontView(heightGrid, grid, height),
    side: sideView(heightGrid, grid, height),
    top: topView(heightGrid, grid)
  };
}

export function viewsMatch(a, b) {
  return ["front", "side", "top"].every((name) =>
    a[name].length === b[name].length &&
    a[name].every((row, r) => row.length === b[name][r].length && row.every((v, c) => v === b[name][r][c]))
  );
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
  const target = {
    front: frontView(map, grid, height),
    side: sideView(map, grid, height),
    top: topView(map, grid)
  };
  return { id, level, grid, maxH: height, reference: map, target };
};

export const levels = [
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("crystal-l2-01", 2, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 1 }]),
      makeProblem("crystal-l2-02", 2, [3, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 1 }]),
      makeProblem("crystal-l2-03", 2, [3, 2], [{ x: 0, z: 0, h: 2 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }]),
      makeProblem("crystal-l2-04", 2, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }])
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("crystal-l3-01", 3, [3, 3], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }]),
      makeProblem("crystal-l3-02", 3, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 2, h: 2 }]),
      makeProblem("crystal-l3-03", 3, [3, 3], [{ x: 1, z: 0, h: 3 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 0, h: 1 }]),
      makeProblem("crystal-l3-04", 3, [3, 3], [{ x: 2, z: 0, h: 2 }, { x: 0, z: 0, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 0, z: 2, h: 1 }])
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("crystal-l4-01", 4, [4, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 3, z: 0, h: 2 }]),
      makeProblem("crystal-l4-02", 4, [4, 3], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 3, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 0, h: 1 }]),
      makeProblem("crystal-l4-03", 4, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 3 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 2, z: 2, h: 1 }]),
      makeProblem("crystal-l4-04", 4, [4, 3], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 0, h: 3 }, { x: 3, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }])
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("crystal-l5-01", 5, [4, 4], [{ x: 0, z: 0, h: 4 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 3, z: 3, h: 1 }, { x: 3, z: 0, h: 2 }, { x: 0, z: 3, h: 1 }, { x: 1, z: 3, h: 2 }]),
      makeProblem("crystal-l5-02", 5, [4, 4], [{ x: 1, z: 1, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 3, z: 0, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 0, z: 3, h: 2 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }]),
      makeProblem("crystal-l5-03", 5, [4, 4], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 4 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 3, z: 0, h: 2 }]),
      makeProblem("crystal-l5-04", 5, [4, 4], [{ x: 3, z: 0, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 3, h: 3 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }])
    ]
  }
];

export function validateLevels() {
  if (levels.length !== 4) throw new Error("crystal-cubes requires four levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 4 || depth > 4 || problem.maxH > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      // The reference build must satisfy its own cards (a guaranteed solution exists).
      const refViews = viewsOfHeightGrid(problem.reference, problem.grid, problem.maxH);
      if (!viewsMatch(refViews, problem.target)) throw new Error(`${problem.id} reference does not match target`);
      // Every card must have at least one filled cell.
      if (!problem.target.top.flat().some((c) => c === 1)) throw new Error(`${problem.id} empty top card`);
      if (!problem.target.front.flat().some((c) => c === 1)) throw new Error(`${problem.id} empty front card`);
    });
  });
}
