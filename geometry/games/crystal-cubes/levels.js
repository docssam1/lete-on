import { sessionProblems } from "../../shared/problem-pool.js";

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

export function viewsMatch(a, b, names = ["front", "side", "top"]) {
  return names.every((name) =>
    a[name].length === b[name].length &&
    a[name].every((row, r) => row.length === b[name][r].length && row.every((v, c) => v === b[name][r][c]))
  );
}

// `solutions` is the EXACT count of distinct builds (within the reference's own
// footprint — the cells its stacks occupy) that satisfy this problem's active
// view cards. It is measured offline by a dev-only brute-force script (never
// shipped) and passed in here as a plain number rather than recomputed at
// load time, because the true count needs a brute-force search that is too
// slow to repeat on every page load. 66 of the 80 authored problems turned out
// to have more than one valid build — see levelNoticeKey() in app.js for how
// that is surfaced to the child instead of silently staying unnoticed.
//
// `challenge` (level 5 only) turns a "match the cards" problem into a
// "가장 많이 / 가장 적게 쌓기" one. It is authored, never derived, because the
// true minimum and maximum totals need the same brute-force search as
// `solutions` — far too slow for a page load. All four numbers are typed out
// explicitly (including `targetTotal`, which is redundant with
// goal+min+maxTotal) precisely SO THAT validateLevels() has something real to
// cross-check: a derived value could never disagree with itself, an authored
// one catches a typo the moment the page loads.
//   { goal: "max" | "min", minTotal, maxTotal, targetTotal }
// Only the top/front/side cards constrain a level-5 build (all three views are
// active there), so every accepted build has cubes on exactly the top card's
// cells — which is why a total between minTotal and maxTotal is guaranteed and
// comparing against targetTotal is enough to grade the goal.
const makeProblem = (id, level, grid, stacks, solutions, challenge = null) => {
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
  const activeViews = level === 2 ? ["front"] : level === 3 ? ["front", "side"] : ["front", "side", "top"];
  const problem = { id, level, grid, maxH: height, reference: map, target, activeViews, solutions };
  // Spread the authored challenge onto the problem only when there is one, so
  // levels 2-4 keep exactly the shape they had (no `goal` key at all) and
  // app.js can branch on a simple `problem.goal` truthiness test.
  if (challenge) {
    problem.goal = challenge.goal;
    problem.minTotal = challenge.minTotal;
    problem.maxTotal = challenge.maxTotal;
    problem.targetTotal = challenge.targetTotal;
  }
  return problem;
};

const pools = [
  {
    level: 2,
    stars: 2,
    problems: [
      makeProblem("crystal-l2-01", 2, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 1 }], 3),
      makeProblem("crystal-l2-02", 2, [3, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 1 }], 1),
      makeProblem("crystal-l2-03", 2, [3, 2], [{ x: 0, z: 0, h: 2 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }], 1),
      makeProblem("crystal-l2-04", 2, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }], 3),
      makeProblem("crystal-l2-05", 2, [2, 2], [{ x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }], 1),
      makeProblem("crystal-l2-06", 2, [2, 2], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-07", 2, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-08", 2, [2, 2], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }], 3),
      makeProblem("crystal-l2-09", 2, [3, 2], [{ x: 0, z: 1, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-10", 2, [2, 2], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }], 3),
      makeProblem("crystal-l2-11", 2, [2, 2], [{ x: 1, z: 1, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 0, h: 2 }], 3),
      makeProblem("crystal-l2-12", 2, [3, 2], [{ x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 0, z: 0, h: 2 }], 1),
      makeProblem("crystal-l2-13", 2, [3, 2], [{ x: 0, z: 1, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 0, z: 0, h: 1 }], 1),
      makeProblem("crystal-l2-14", 2, [3, 2], [{ x: 0, z: 0, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-15", 2, [3, 2], [{ x: 2, z: 0, h: 2 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-16", 2, [3, 2], [{ x: 2, z: 1, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 1 }], 1),
      makeProblem("crystal-l2-17", 2, [2, 2], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-18", 2, [3, 2], [{ x: 0, z: 1, h: 2 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 1, h: 2 }], 1),
      makeProblem("crystal-l2-19", 2, [3, 2], [{ x: 2, z: 0, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }], 3),
      makeProblem("crystal-l2-20", 2, [3, 2], [{ x: 2, z: 1, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 0, z: 0, h: 2 }], 3)
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      makeProblem("crystal-l3-01", 3, [3, 3], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }], 3),
      makeProblem("crystal-l3-02", 3, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 2, h: 2 }], 5),
      makeProblem("crystal-l3-03", 3, [3, 3], [{ x: 1, z: 0, h: 3 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 0, h: 1 }], 2),
      makeProblem("crystal-l3-04", 3, [3, 3], [{ x: 2, z: 0, h: 2 }, { x: 0, z: 0, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 0, z: 2, h: 1 }], 17),
      makeProblem("crystal-l3-05", 3, [3, 3], [{ x: 1, z: 2, h: 2 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 2, z: 0, h: 3 }, { x: 0, z: 2, h: 1 }], 4),
      makeProblem("crystal-l3-06", 3, [3, 3], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 1, z: 1, h: 3 }], 1),
      makeProblem("crystal-l3-07", 3, [3, 3], [{ x: 2, z: 1, h: 1 }, { x: 2, z: 2, h: 2 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 2, h: 3 }], 2),
      makeProblem("crystal-l3-08", 3, [3, 3], [{ x: 2, z: 1, h: 3 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 1, z: 1, h: 1 }], 3),
      makeProblem("crystal-l3-09", 3, [3, 3], [{ x: 1, z: 0, h: 2 }, { x: 1, z: 2, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 1, h: 1 }], 2),
      makeProblem("crystal-l3-10", 3, [3, 3], [{ x: 0, z: 1, h: 2 }, { x: 0, z: 2, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 2, z: 1, h: 3 }], 9),
      makeProblem("crystal-l3-11", 3, [3, 3], [{ x: 1, z: 0, h: 2 }, { x: 0, z: 2, h: 3 }, { x: 2, z: 2, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }], 4),
      makeProblem("crystal-l3-12", 3, [3, 3], [{ x: 0, z: 2, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 1, z: 2, h: 3 }], 1),
      makeProblem("crystal-l3-13", 3, [3, 3], [{ x: 0, z: 0, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 0, h: 3 }, { x: 0, z: 2, h: 2 }], 5),
      makeProblem("crystal-l3-14", 3, [3, 3], [{ x: 1, z: 2, h: 3 }, { x: 0, z: 2, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 2, h: 3 }, { x: 2, z: 1, h: 1 }], 1),
      makeProblem("crystal-l3-15", 3, [3, 3], [{ x: 2, z: 2, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 2, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }], 3),
      makeProblem("crystal-l3-16", 3, [3, 3], [{ x: 1, z: 0, h: 2 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 0, h: 1 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 1, h: 3 }], 6),
      makeProblem("crystal-l3-17", 3, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 0, z: 1, h: 1 }, { x: 0, z: 2, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 0, h: 2 }], 2),
      makeProblem("crystal-l3-18", 3, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 2, h: 2 }], 2),
      makeProblem("crystal-l3-19", 3, [3, 3], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 0, h: 2 }], 5),
      makeProblem("crystal-l3-20", 3, [3, 3], [{ x: 1, z: 2, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 0, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 0, h: 2 }], 1)
    ]
  },
  {
    level: 4,
    stars: 4,
    problems: [
      makeProblem("crystal-l4-01", 4, [4, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 3, z: 0, h: 2 }], 3),
      makeProblem("crystal-l4-02", 4, [4, 3], [{ x: 0, z: 1, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 3, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 0, h: 1 }], 1),
      makeProblem("crystal-l4-03", 4, [3, 3], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 1, h: 3 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 2, h: 2 }, { x: 2, z: 2, h: 1 }], 11),
      makeProblem("crystal-l4-04", 4, [4, 3], [{ x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 2, z: 0, h: 3 }, { x: 3, z: 1, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 0, z: 2, h: 2 }], 5),
      makeProblem("crystal-l4-05", 4, [4, 3], [{ x: 2, z: 0, h: 1 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 0, h: 3 }, { x: 1, z: 2, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 2, z: 2, h: 2 }], 3),
      makeProblem("crystal-l4-06", 4, [3, 3], [{ x: 2, z: 2, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 1, h: 3 }, { x: 0, z: 0, h: 3 }, { x: 0, z: 1, h: 1 }], 17),
      makeProblem("crystal-l4-07", 4, [4, 3], [{ x: 2, z: 2, h: 3 }, { x: 0, z: 2, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 3, z: 2, h: 2 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 0, h: 2 }], 3),
      makeProblem("crystal-l4-08", 4, [4, 3], [{ x: 1, z: 2, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 3, z: 1, h: 1 }], 17),
      makeProblem("crystal-l4-09", 4, [4, 3], [{ x: 1, z: 1, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 3, z: 1, h: 3 }, { x: 3, z: 2, h: 2 }], 3),
      makeProblem("crystal-l4-10", 4, [4, 3], [{ x: 3, z: 0, h: 2 }, { x: 3, z: 2, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 1, h: 3 }], 3),
      makeProblem("crystal-l4-11", 4, [3, 3], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 0, h: 3 }, { x: 2, z: 2, h: 2 }, { x: 2, z: 0, h: 3 }], 3),
      makeProblem("crystal-l4-12", 4, [4, 3], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 3, z: 2, h: 1 }, { x: 2, z: 2, h: 3 }, { x: 1, z: 2, h: 3 }, { x: 3, z: 1, h: 1 }], 3),
      makeProblem("crystal-l4-13", 4, [3, 3], [{ x: 2, z: 0, h: 3 }, { x: 2, z: 1, h: 1 }, { x: 1, z: 0, h: 2 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 1, z: 1, h: 2 }], 5),
      makeProblem("crystal-l4-14", 4, [3, 3], [{ x: 2, z: 0, h: 3 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 1, h: 3 }, { x: 1, z: 1, h: 1 }, { x: 1, z: 0, h: 3 }, { x: 2, z: 2, h: 1 }], 5),
      makeProblem("crystal-l4-15", 4, [4, 3], [{ x: 2, z: 1, h: 2 }, { x: 0, z: 1, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 0, z: 2, h: 1 }], 2),
      makeProblem("crystal-l4-16", 4, [4, 3], [{ x: 3, z: 0, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 0, h: 1 }, { x: 2, z: 2, h: 2 }, { x: 3, z: 1, h: 2 }, { x: 2, z: 1, h: 1 }], 2),
      makeProblem("crystal-l4-17", 4, [3, 3], [{ x: 0, z: 2, h: 3 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 1, z: 0, h: 1 }, { x: 1, z: 2, h: 3 }], 17),
      makeProblem("crystal-l4-18", 4, [3, 3], [{ x: 1, z: 1, h: 1 }, { x: 1, z: 2, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 2, z: 1, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }], 2),
      makeProblem("crystal-l4-19", 4, [4, 3], [{ x: 0, z: 1, h: 1 }, { x: 1, z: 2, h: 1 }, { x: 3, z: 1, h: 3 }, { x: 3, z: 0, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 2, z: 0, h: 2 }], 2),
      makeProblem("crystal-l4-20", 4, [4, 3], [{ x: 2, z: 2, h: 1 }, { x: 3, z: 2, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 1, z: 2, h: 1 }, { x: 3, z: 0, h: 3 }, { x: 0, z: 1, h: 1 }], 1)
    ]
  },
  {
    level: 5,
    stars: 5,
    problems: [
      makeProblem("crystal-l5-01", 5, [4, 4], [{ x: 0, z: 0, h: 4 }, { x: 1, z: 1, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 3, z: 3, h: 1 }, { x: 3, z: 0, h: 2 }, { x: 0, z: 3, h: 1 }, { x: 1, z: 3, h: 2 }], 11, { goal: "max", minTotal: 14, maxTotal: 17, targetTotal: 17 }),
      makeProblem("crystal-l5-02", 5, [4, 4], [{ x: 1, z: 1, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 3, z: 0, h: 2 }, { x: 2, z: 2, h: 3 }, { x: 0, z: 3, h: 2 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }], 15, { goal: "min", minTotal: 14, maxTotal: 17, targetTotal: 14 }),
      makeProblem("crystal-l5-03", 5, [4, 4], [{ x: 0, z: 0, h: 3 }, { x: 1, z: 0, h: 4 }, { x: 2, z: 1, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 3, z: 0, h: 2 }], 21, { goal: "max", minTotal: 15, maxTotal: 19, targetTotal: 19 }),
      makeProblem("crystal-l5-04", 5, [4, 4], [{ x: 3, z: 0, h: 4 }, { x: 0, z: 0, h: 2 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 3, h: 3 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }], 22, { goal: "min", minTotal: 15, maxTotal: 20, targetTotal: 15 }),
      makeProblem("crystal-l5-05", 5, [4, 4], [{ x: 2, z: 1, h: 4 }, { x: 1, z: 2, h: 3 }, { x: 2, z: 2, h: 4 }, { x: 0, z: 1, h: 1 }, { x: 1, z: 1, h: 3 }, { x: 2, z: 3, h: 1 }, { x: 2, z: 0, h: 1 }], 5, { goal: "max", minTotal: 15, maxTotal: 17, targetTotal: 17 }),
      makeProblem("crystal-l5-06", 5, [4, 4], [{ x: 2, z: 1, h: 2 }, { x: 2, z: 2, h: 2 }, { x: 1, z: 1, h: 1 }, { x: 0, z: 2, h: 4 }, { x: 0, z: 1, h: 3 }, { x: 0, z: 0, h: 1 }, { x: 3, z: 0, h: 2 }], 6, { goal: "min", minTotal: 14, maxTotal: 16, targetTotal: 14 }),
      makeProblem("crystal-l5-07", 5, [4, 4], [{ x: 0, z: 2, h: 3 }, { x: 1, z: 0, h: 1 }, { x: 0, z: 3, h: 3 }, { x: 2, z: 2, h: 1 }, { x: 2, z: 0, h: 4 }, { x: 1, z: 1, h: 1 }, { x: 3, z: 3, h: 3 }], 11, { goal: "max", minTotal: 14, maxTotal: 18, targetTotal: 18 }),
      makeProblem("crystal-l5-08", 5, [4, 4], [{ x: 0, z: 2, h: 1 }, { x: 3, z: 1, h: 3 }, { x: 2, z: 3, h: 4 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 1, z: 3, h: 1 }, { x: 3, z: 0, h: 3 }], 5, { goal: "min", minTotal: 14, maxTotal: 16, targetTotal: 14 }),
      makeProblem("crystal-l5-09", 5, [4, 4], [{ x: 1, z: 1, h: 2 }, { x: 0, z: 1, h: 2 }, { x: 2, z: 2, h: 2 }, { x: 0, z: 0, h: 1 }, { x: 3, z: 1, h: 2 }, { x: 0, z: 3, h: 4 }, { x: 2, z: 1, h: 2 }], 4, { goal: "max", minTotal: 13, maxTotal: 15, targetTotal: 15 }),
      makeProblem("crystal-l5-10", 5, [4, 4], [{ x: 2, z: 3, h: 2 }, { x: 3, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 0, z: 3, h: 3 }, { x: 1, z: 2, h: 2 }, { x: 0, z: 1, h: 1 }, { x: 3, z: 1, h: 4 }], 15, { goal: "min", minTotal: 14, maxTotal: 18, targetTotal: 14 }),
      makeProblem("crystal-l5-11", 5, [4, 4], [{ x: 1, z: 0, h: 1 }, { x: 0, z: 3, h: 2 }, { x: 3, z: 2, h: 3 }, { x: 1, z: 3, h: 2 }, { x: 0, z: 2, h: 4 }, { x: 1, z: 1, h: 4 }, { x: 2, z: 1, h: 1 }], 3, { goal: "max", minTotal: 16, maxTotal: 17, targetTotal: 17 }),
      // Replaces the retired crystal-l5-12, whose cards admitted exactly one
      // build (min == max == 15): with zero spread it cannot pose a "가장 많이 /
      // 가장 적게" question at all, and leaving it in would have dropped the
      // pool to 19 — which problem-pool.js floors to 3 rounds of five, silently
      // making four authored problems unreachable. This replacement keeps the
      // pool at 20 (4 full practice rounds) and sits in the middle of the
      // level's measured range: 6 valid builds, totals 14..17.
      makeProblem("crystal-l5-21", 5, [4, 4], [{ x: 1, z: 0, h: 2 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 0, h: 2 }, { x: 0, z: 2, h: 3 }, { x: 3, z: 1, h: 4 }, { x: 0, z: 1, h: 2 }], 6, { goal: "min", minTotal: 14, maxTotal: 17, targetTotal: 14 }),
      makeProblem("crystal-l5-13", 5, [4, 4], [{ x: 3, z: 0, h: 2 }, { x: 3, z: 3, h: 4 }, { x: 1, z: 3, h: 2 }, { x: 0, z: 2, h: 4 }, { x: 3, z: 1, h: 2 }, { x: 1, z: 2, h: 1 }, { x: 2, z: 1, h: 2 }], 6, { goal: "max", minTotal: 16, maxTotal: 18, targetTotal: 18 }),
      makeProblem("crystal-l5-14", 5, [4, 4], [{ x: 3, z: 0, h: 4 }, { x: 2, z: 3, h: 3 }, { x: 3, z: 3, h: 2 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 2, h: 1 }, { x: 0, z: 1, h: 4 }, { x: 2, z: 1, h: 1 }], 11, { goal: "min", minTotal: 15, maxTotal: 19, targetTotal: 15 }),
      makeProblem("crystal-l5-15", 5, [4, 4], [{ x: 0, z: 0, h: 2 }, { x: 2, z: 3, h: 2 }, { x: 2, z: 0, h: 2 }, { x: 2, z: 2, h: 1 }, { x: 3, z: 1, h: 3 }, { x: 1, z: 2, h: 4 }, { x: 2, z: 1, h: 2 }], 8, { goal: "max", minTotal: 14, maxTotal: 17, targetTotal: 17 }),
      makeProblem("crystal-l5-16", 5, [4, 4], [{ x: 1, z: 1, h: 4 }, { x: 3, z: 3, h: 4 }, { x: 1, z: 3, h: 1 }, { x: 0, z: 2, h: 2 }, { x: 3, z: 1, h: 1 }, { x: 3, z: 0, h: 2 }, { x: 2, z: 3, h: 3 }], 31, { goal: "min", minTotal: 17, maxTotal: 23, targetTotal: 17 }),
      makeProblem("crystal-l5-17", 5, [4, 4], [{ x: 1, z: 1, h: 3 }, { x: 0, z: 2, h: 2 }, { x: 3, z: 2, h: 2 }, { x: 0, z: 3, h: 2 }, { x: 3, z: 3, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 1, z: 3, h: 4 }], 8, { goal: "max", minTotal: 15, maxTotal: 17, targetTotal: 17 }),
      makeProblem("crystal-l5-18", 5, [4, 4], [{ x: 3, z: 1, h: 2 }, { x: 1, z: 3, h: 3 }, { x: 1, z: 1, h: 2 }, { x: 1, z: 0, h: 2 }, { x: 3, z: 0, h: 1 }, { x: 2, z: 0, h: 2 }, { x: 0, z: 0, h: 4 }], 15, { goal: "min", minTotal: 14, maxTotal: 18, targetTotal: 14 }),
      makeProblem("crystal-l5-19", 5, [4, 4], [{ x: 0, z: 0, h: 2 }, { x: 0, z: 2, h: 1 }, { x: 1, z: 2, h: 4 }, { x: 0, z: 1, h: 2 }, { x: 3, z: 0, h: 3 }, { x: 3, z: 2, h: 1 }, { x: 1, z: 0, h: 3 }], 44, { goal: "max", minTotal: 13, maxTotal: 19, targetTotal: 19 }),
      makeProblem("crystal-l5-20", 5, [4, 4], [{ x: 1, z: 2, h: 1 }, { x: 0, z: 1, h: 4 }, { x: 2, z: 2, h: 4 }, { x: 2, z: 0, h: 4 }, { x: 2, z: 3, h: 1 }, { x: 2, z: 1, h: 1 }, { x: 0, z: 0, h: 2 }], 40, { goal: "min", minTotal: 16, maxTotal: 22, targetTotal: 16 })
    ]
  }
];

// A level counts as "multi-answer" the moment ANY problem it actually serves
// this session has more than one valid build — decided from the measured
// `solutions` data, never from the level number. app.js reads this to choose
// between the "여러 가지 정답" and "정답은 하나" level-start notices.
export function isMultiAnswerSession(problems) {
  return problems.some((problem) => problem.solutions > 1);
}

// Same fix as cube-tunnel's levels.js: the pool-cache key must use the
// level's ARRAY POSITION (index + 1), not its raw `level` number — this
// game's first playable level is numbered 2 as well, but game-flow.js's
// "?level=N" practice reload always sends the 1-based position shown in the
// level picker.
export const levels = pools.map((entry, index) => {
  const problems = sessionProblems("crystal-cubes", index + 1, entry.problems, 5);
  return {
    level: entry.level,
    stars: entry.stars,
    pool: entry.problems,
    problems,
    multiAnswer: isMultiAnswerSession(problems)
  };
});

export function validateLevels() {
  if (levels.length !== 4) throw new Error("crystal-cubes requires four levels");
  levels.forEach((level) => {
    if (level.problems.length < 4) throw new Error(`level ${level.level} needs at least four problems`);
    // Cheap field-shape check over the WHOLE pool (not just this session's five):
    // every authored problem must carry a measured, positive-integer solution
    // count. This is O(pool size) and does no brute-force search itself — the
    // actual brute-force cross-check lives in a separate dev-only script,
    // never imported here (it must never run on a page load).
    level.pool.forEach((problem) => {
      if (!Number.isInteger(problem.solutions) || problem.solutions < 1) {
        throw new Error(`${problem.id} has a missing or invalid solutions count`);
      }
      // Level 5 is the "가장 많이 / 가장 적게 쌓기" level: every one of its
      // problems must carry a complete, self-consistent challenge, because
      // app.js grades the cube TOTAL against `targetTotal` there and a missing
      // or mistyped number would silently accept (or reject) every build.
      // Everything below is a declared-field consistency check only — the real
      // proof that these totals are the true extremes is a brute force, which
      // lives in the dev-only self-test and must never run on a page load.
      if (level.level === 5) {
        if (problem.goal !== "max" && problem.goal !== "min") {
          throw new Error(`${problem.id} must declare goal "max" or "min"`);
        }
        ["minTotal", "maxTotal", "targetTotal"].forEach((field) => {
          if (!Number.isInteger(problem[field]) || problem[field] < 1) {
            throw new Error(`${problem.id} has a missing or invalid ${field}`);
          }
        });
        // A zero (or inverted) spread makes the question meaningless: the
        // child could not build anything other than the answer, so "쌓아 보자"
        // would grade every card-matching build as correct anyway.
        if (problem.maxTotal <= problem.minTotal) {
          throw new Error(`${problem.id} needs maxTotal > minTotal (no spread to aim at)`);
        }
        const expected = problem.goal === "max" ? problem.maxTotal : problem.minTotal;
        if (problem.targetTotal !== expected) {
          throw new Error(`${problem.id} targetTotal ${problem.targetTotal} contradicts goal "${problem.goal}"`);
        }
        // The authored reference must satisfy its own cards for the WHOLE
        // level-5 pool (not just this session's five), since a broken
        // reference there would mean the target totals describe a card set no
        // build can meet. Cheap: one view computation per 4x4x4 problem.
        const refViews = viewsOfHeightGrid(problem.reference, problem.grid, problem.maxH);
        if (!viewsMatch(refViews, problem.target, problem.activeViews)) {
          throw new Error(`${problem.id} reference does not match target`);
        }
      } else if (problem.goal !== undefined) {
        // Goal fields belong to level 5 only — levels 2-4 stay views-only, and
        // a stray `goal` there would make app.js start grading their totals.
        throw new Error(`${problem.id} is not a level-5 problem but declares a goal`);
      }
    });
    // The level's declared `multiAnswer` flag must still agree with what its
    // currently served problems say — catches the flag going stale if this
    // module is ever edited to compute/assign it differently.
    if (level.multiAnswer !== isMultiAnswerSession(level.problems)) {
      throw new Error(`level ${level.level} multiAnswer flag contradicts its problems' solutions counts`);
    }
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 4 || depth > 4 || problem.maxH > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      // The reference build must satisfy its own cards (a guaranteed solution exists).
      const refViews = viewsOfHeightGrid(problem.reference, problem.grid, problem.maxH);
      if (!viewsMatch(refViews, problem.target, problem.activeViews)) throw new Error(`${problem.id} reference does not match target`);
      // Every card must have at least one filled cell.
      if (!problem.target.top.flat().some((c) => c === 1)) throw new Error(`${problem.id} empty top card`);
      if (!problem.target.front.flat().some((c) => c === 1)) throw new Error(`${problem.id} empty front card`);
    });
  });
}
