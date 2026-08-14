import { sessionProblems } from "../../shared/problem-pool.js";

/* =========================================================================
   최대·최소 큐브 챌린지 (Cube Min–Max Challenge)

   The child never sees the stack. They see only its three silhouettes —
   위 / 앞 / 오른쪽 옆 — and must work out how many cubes it takes.

   Levels 1–3 (개수 구하기): the three views pin the total down exactly, so
   there is a single right answer.
   Levels 4–5 (최대·최소): the views leave room, so the child reports the
   greatest and the least possible totals.

   A problem is authored as a heightmap `map[z][x]` (x: 0..W-1 left→right,
   z: 0..D-1 back→front). EVERYTHING ELSE — the three views, the helper
   numbers, the min/max totals — is DERIVED here at module load by the solver
   below, so a stored map and a printed answer can never drift apart.

   View convention is the house one (identical to games/three-views/levels.js,
   which matches the 3/4 camera in app.js — the viewer sees the +z front face
   and the +x right face):

     front (앞) : look toward −z. columns = x (0→W−1), rows = height y
                  (top row = tallest). filled(x,y) ⇔ ∃z map[z][x] > y
     side  (옆) : look from the right (+x). drawn column c maps to
                  z = D−1−c so the FRONT row lands on the left.
                  filled(c,y) ⇔ ∃x map[D−1−c][x] > y
     top   (위) : straight down. rows r = z (back on top), columns = x.
                  filled(x,r) ⇔ map[r][x] ≥ 1
   ========================================================================= */

const makeEmptyMap = (width, depth) =>
  Array.from({ length: depth }, () => Array.from({ length: width }, () => 0));

const cloneMap = (map) => map.map((row) => row.slice());

const mapTotal = (map) => map.flat().reduce((sum, value) => sum + value, 0);

const mapHeight = (map) => Math.max(0, ...map.flat());

function frontView(map, width, depth, height) {
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

function sideView(map, width, depth, height) {
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

function topView(map, width, depth) {
  const rows = [];
  for (let z = 0; z < depth; z += 1) {
    const row = [];
    for (let x = 0; x < width; x += 1) row.push(map[z][x] >= 1 ? 1 : 0);
    rows.push(row);
  }
  return rows;
}

/* -------------------------------------------------------------------------
   Helper numbers ("수 쓰기 표"의 도움 수).

   These are read off the PRINTED VIEWS, not off the private answer map — the
   same move the child makes with a pencil. A view column is filled bottom-up
   with no gaps, so counting its 1s recovers that column's tallest stack
   directly. Deriving them this way means the numbers the game shows are
   provably the numbers a child could have read for themselves.
   ------------------------------------------------------------------------- */
function colMaxFromFrontView(front, width) {
  const out = new Array(width).fill(0);
  for (let x = 0; x < width; x += 1) {
    let max = 0;
    for (let r = 0; r < front.length; r += 1) max += front[r][x];
    out[x] = max;
  }
  return out;
}

function rowMaxFromSideView(side, depth) {
  const out = new Array(depth).fill(0);
  for (let z = 0; z < depth; z += 1) {
    const c = depth - 1 - z;                    // see sideView(): column c ↔ z = D−1−c
    let max = 0;
    for (let r = 0; r < side.length; r += 1) max += side[r][c];
    out[z] = max;
  }
  return out;
}

/* -------------------------------------------------------------------------
   The solver — a pruned DFS over every heightmap consistent with the three
   views. Ported (not imported) from worksheet/generators.js enumerateShapes:
   that file is an IIFE-on-window module, so it cannot be pulled into an ES
   module page; the algorithm is reproduced here instead.

   Consistency means exactly three things:
     1. every footprint cell holds at least one cube, every other cell none
        (that is what the 위 silhouette says);
     2. the tallest stack in column x equals colMax[x] (what 앞 says);
     3. the tallest stack in row z equals rowMax[z] (what 오른쪽 옆 says).

   Pruning: each cell is capped at min(maxH, colMax[x], rowMax[z]) up front,
   and the LAST cell visited in a column/row is forced to make that
   column/row hit its recorded max — so dead branches die at the cell that
   proves them dead instead of at the leaf.

   Unlike the worksheet version this does NOT collect every solution: the
   game only needs how many there are plus a witness stack for the smallest
   and the largest total. Keeping just those two keeps module load cheap even
   for the level-5 boards, which have a couple of hundred solutions.
   ------------------------------------------------------------------------- */
function enumerateConsistent(width, depth, footprint, colMax, rowMax, maxH, nodeCap = 200000) {
  const cells = [];
  for (let z = 0; z < depth; z += 1) {
    for (let x = 0; x < width; x += 1) if (footprint[z][x]) cells.push([x, z]);
  }
  const total = cells.length;
  const lastInCol = new Array(width).fill(-1);
  const lastInRow = new Array(depth).fill(-1);
  cells.forEach(([x, z], index) => { lastInCol[x] = index; lastInRow[z] = index; });

  const work = makeEmptyMap(width, depth);
  const runningCol = new Array(width).fill(0);
  const runningRow = new Array(depth).fill(0);
  let count = 0;
  let nodes = 0;
  let capped = false;
  let min = Infinity;
  let max = -Infinity;
  let minMap = null;
  let maxMap = null;

  function dfs(index, sum) {
    if (capped) return;
    nodes += 1;
    if (nodes > nodeCap) { capped = true; return; }
    if (index === total) {
      count += 1;
      if (sum < min) { min = sum; minMap = cloneMap(work); }
      if (sum > max) { max = sum; maxMap = cloneMap(work); }
      return;
    }
    const [x, z] = cells[index];
    const cap = Math.min(maxH, colMax[x], rowMax[z]);
    const prevCol = runningCol[x];
    const prevRow = runningRow[z];
    for (let h = 1; h <= cap; h += 1) {
      work[z][x] = h;
      runningCol[x] = Math.max(prevCol, h);
      runningRow[z] = Math.max(prevRow, h);
      const colSettled = index === lastInCol[x] && runningCol[x] !== colMax[x];
      const rowSettled = index === lastInRow[z] && runningRow[z] !== rowMax[z];
      if (!colSettled && !rowSettled) dfs(index + 1, sum + h);
      if (capped) return;
    }
    work[z][x] = 0;
    runningCol[x] = prevCol;
    runningRow[z] = prevRow;
  }
  dfs(0, 0);

  return { count, nodes, capped, min, max, minMap, maxMap };
}

/* -------------------------------------------------------------------------
   Problem construction. Everything the game renders comes out of here.
   ------------------------------------------------------------------------- */
function makeProblem(id, level, maxH, heights) {
  const depth = heights.length;
  const width = heights[0].length;
  const height = Math.max(1, mapHeight(heights));
  const views = {
    top: topView(heights, width, depth),
    front: frontView(heights, width, depth, height),
    side: sideView(heights, width, depth, height)
  };
  const footprint = views.top;
  const colMax = colMaxFromFrontView(views.front, width);
  const rowMax = rowMaxFromSideView(views.side, depth);
  const solutions = enumerateConsistent(width, depth, footprint, colMax, rowMax, maxH);
  // 개수 (one answer) below level 4, 최대·최소 (two answers) at 4 and 5. The
  // mode is decided by the LEVEL, and validateLevels() then proves the data
  // actually behaves that way — a level-2 problem that turned out ambiguous
  // would be unanswerable, so it must never ship.
  const mode = level <= 3 ? "count" : "range";
  return {
    id,
    level,
    mode,
    board: [width, depth],
    maxHeight: maxH,
    height,
    heights,
    views,
    footprint,
    cells: footprint.flat().reduce((sum, value) => sum + value, 0),
    colMax,
    rowMax,
    solutions,
    answer: mode === "count"
      ? { count: solutions.min }
      : { max: solutions.max, min: solutions.min }
  };
}

/* -------------------------------------------------------------------------
   Authored pools. Ten problems per level so shared/problem-pool.js can hand
   out two non-overlapping sets of five ("🔁 한번 더 연습하기" gives the child
   puzzles they have not seen).

   Grid / height caps per the game spec:
     L1 3x3 maxH 3 · L2 3x3 maxH 3 · L3 4x3 maxH 3 · L4 4x4 maxH 4 · L5 4x4 maxH 4

   Each map below was searched offline against this very solver, so levels 1–3
   are guaranteed unique-total and 4–5 guaranteed ambiguous; validateLevels()
   re-proves it here at load time.
   ------------------------------------------------------------------------- */
const pools = [
  {
    level: 1,
    stars: 1,
    maxH: 3,
    seeds: [
      [[1, 0, 2], [0, 0, 0], [0, 3, 0]],
      [[1, 0, 0], [0, 0, 1], [0, 0, 3]],
      [[3, 0, 0], [0, 3, 0], [0, 0, 1]],
      [[0, 3, 0], [0, 0, 0], [2, 0, 2]],
      [[0, 2, 0], [0, 0, 1], [0, 0, 2]],
      [[0, 0, 1], [3, 1, 0], [3, 0, 0]],
      [[1, 0, 0], [3, 0, 1], [1, 0, 0]],
      [[0, 0, 0], [3, 1, 1], [0, 0, 1]],
      [[0, 1, 3], [0, 1, 0], [2, 0, 0]],
      [[2, 2, 0], [1, 0, 0], [0, 0, 1]]
    ]
  },
  {
    level: 2,
    stars: 2,
    maxH: 3,
    seeds: [
      [[0, 0, 3], [2, 2, 0], [0, 1, 0]],
      [[0, 0, 3], [0, 0, 2], [2, 2, 0]],
      [[0, 1, 1], [0, 0, 0], [1, 0, 3]],
      [[0, 3, 0], [1, 2, 1], [0, 1, 0]],
      [[1, 1, 0], [0, 1, 1], [0, 0, 3]],
      [[0, 1, 1], [0, 1, 0], [3, 0, 2]],
      [[0, 0, 1], [0, 3, 1], [1, 3, 0]],
      [[0, 3, 3], [1, 0, 1], [1, 0, 1]],
      [[1, 0, 1], [0, 1, 3], [1, 0, 3]],
      [[0, 0, 3], [1, 0, 2], [1, 1, 3]]
    ]
  },
  {
    level: 3,
    stars: 3,
    maxH: 3,
    seeds: [
      [[0, 0, 0, 1], [3, 1, 0, 2], [0, 1, 0, 0]],
      [[1, 0, 1, 0], [3, 1, 0, 2], [0, 0, 0, 0]],
      [[1, 1, 2, 0], [0, 0, 3, 0], [0, 0, 3, 0]],
      [[0, 2, 2, 1], [0, 1, 0, 0], [3, 0, 0, 1]],
      [[1, 0, 1, 0], [0, 3, 3, 0], [2, 0, 0, 2]],
      [[1, 0, 0, 0], [0, 1, 0, 1], [3, 3, 1, 0]],
      [[1, 0, 1, 0], [2, 3, 0, 2], [0, 0, 3, 0]],
      [[0, 2, 1, 0], [1, 2, 1, 0], [0, 3, 0, 1]],
      [[0, 0, 3, 1], [0, 1, 3, 0], [3, 1, 0, 1]],
      [[0, 1, 3, 0], [0, 1, 0, 0], [1, 1, 3, 1]]
    ]
  },
  {
    level: 4,
    stars: 4,
    maxH: 4,
    seeds: [
      [[0, 0, 0, 2], [0, 2, 1, 0], [4, 0, 4, 0], [0, 0, 0, 2]],
      [[0, 0, 3, 1], [0, 0, 0, 1], [0, 0, 4, 0], [4, 0, 1, 0]],
      [[0, 3, 0, 0], [0, 0, 0, 4], [2, 0, 0, 1], [0, 4, 4, 0]],
      [[0, 0, 0, 1], [0, 0, 3, 0], [1, 4, 1, 0], [0, 1, 0, 2]],
      [[0, 3, 0, 1], [0, 2, 0, 0], [4, 0, 1, 0], [0, 0, 3, 1]],
      [[2, 0, 0, 0], [0, 2, 0, 1], [0, 0, 2, 3], [3, 0, 0, 1]],
      [[0, 3, 0, 0], [0, 3, 1, 0], [0, 0, 0, 4], [2, 1, 0, 3]],
      [[0, 1, 0, 0], [1, 0, 0, 4], [1, 0, 1, 0], [0, 2, 3, 1]],
      [[1, 0, 4, 0], [2, 0, 3, 0], [0, 1, 3, 1], [0, 0, 0, 2]],
      [[0, 2, 0, 0], [2, 1, 1, 0], [0, 1, 3, 0], [0, 1, 0, 1]]
    ]
  },
  {
    level: 5,
    stars: 5,
    maxH: 4,
    seeds: [
      [[0, 1, 1, 2], [1, 4, 0, 0], [3, 1, 1, 0], [0, 0, 0, 0]],
      [[0, 0, 0, 3], [1, 1, 0, 4], [0, 2, 0, 1], [0, 0, 4, 1]],
      [[0, 1, 0, 4], [3, 4, 0, 0], [0, 1, 0, 3], [0, 0, 1, 1]],
      [[1, 4, 0, 0], [3, 1, 1, 4], [0, 3, 1, 0], [0, 3, 0, 0]],
      [[1, 0, 0, 0], [0, 4, 0, 1], [0, 4, 1, 1], [2, 0, 3, 2]],
      [[0, 4, 1, 0], [0, 1, 0, 3], [2, 0, 1, 0], [1, 0, 4, 4]],
      [[4, 4, 4, 1], [0, 1, 3, 1], [1, 0, 0, 1], [3, 0, 0, 0]],
      [[2, 0, 0, 0], [1, 4, 1, 1], [0, 1, 0, 2], [1, 0, 4, 3]],
      [[0, 1, 2, 0], [0, 2, 0, 0], [1, 1, 1, 2], [1, 4, 3, 3]],
      [[1, 1, 0, 2], [0, 1, 3, 1], [1, 0, 0, 0], [4, 4, 1, 4]]
    ]
  }
];

export const levels = pools.map((entry) => {
  const pool = entry.seeds.map((heights, index) =>
    makeProblem(`minmax-l${entry.level}-${String(index + 1).padStart(2, "0")}`, entry.level, entry.maxH, heights)
  );
  return {
    level: entry.level,
    stars: entry.stars,
    maxHeight: entry.maxH,
    pool,
    problems: sessionProblems("minmax", entry.level, pool, 5)
  };
});

/* Board size expected per level, asserted below. A puzzle authored on the
   wrong grid would still "work" but would break the difficulty ramp and the
   cell-fitting maths app.js does for phone screens. */
const EXPECTED_BOARD = { 1: [3, 3], 2: [3, 3], 3: [4, 3], 4: [4, 4], 5: [4, 4] };

export function validateLevels() {
  if (levels.length !== 5) throw new Error("minmax requires five levels");
  levels.forEach((level) => {
    const [wantWidth, wantDepth] = EXPECTED_BOARD[level.level];
    if (level.pool.length < 8) throw new Error(`level ${level.level} needs a pool of at least eight problems`);
    if (!level.problems.length) throw new Error(`level ${level.level} has no session problems`);
    level.pool.forEach((problem) => {
      const [width, depth] = problem.board;
      if (width !== wantWidth || depth !== wantDepth) {
        throw new Error(`${problem.id} is ${width}x${depth}, expected ${wantWidth}x${wantDepth}`);
      }
      if (problem.heights.length !== depth || problem.heights.some((row) => row.length !== width)) {
        throw new Error(`${problem.id} has a ragged heightmap`);
      }
      if (problem.heights.some((row) => row.some((value) => value < 0 || value > level.maxHeight))) {
        throw new Error(`${problem.id} exceeds the level cap of ${level.maxHeight}`);
      }
      if (problem.cells < 2) throw new Error(`${problem.id} needs a footprint of at least two cells`);
      // A capped search would have skipped branches, so its min/max cannot be
      // trusted — that must fail loudly rather than ship a wrong answer.
      if (problem.solutions.capped) throw new Error(`${problem.id} exhausted the solver node budget`);
      if (problem.solutions.count < 1) throw new Error(`${problem.id} has no shape consistent with its own views`);
      // The stored map must itself be one of the consistent shapes.
      if (mapTotal(problem.heights) < problem.solutions.min || mapTotal(problem.heights) > problem.solutions.max) {
        throw new Error(`${problem.id} stores a heightmap outside its own min/max range`);
      }
      if (problem.colMax.length !== width || problem.rowMax.length !== depth) {
        throw new Error(`${problem.id} has malformed helper numbers`);
      }
      // Helper numbers were read off the views; they must agree with the map
      // they came from, otherwise the scaffold would teach the wrong method.
      for (let x = 0; x < width; x += 1) {
        let max = 0;
        for (let z = 0; z < depth; z += 1) max = Math.max(max, problem.heights[z][x]);
        if (max !== problem.colMax[x]) throw new Error(`${problem.id} column ${x} helper number mismatch`);
      }
      for (let z = 0; z < depth; z += 1) {
        if (Math.max(0, ...problem.heights[z]) !== problem.rowMax[z]) {
          throw new Error(`${problem.id} row ${z} helper number mismatch`);
        }
      }
      if (problem.views.front.length !== problem.height || problem.views.side.length !== problem.height) {
        throw new Error(`${problem.id} view row counts disagree with its height`);
      }
      if (problem.views.front[0].length !== width) throw new Error(`${problem.id} front view column count`);
      if (problem.views.side[0].length !== depth) throw new Error(`${problem.id} side view column count`);
      if (problem.level <= 3) {
        if (problem.solutions.min !== problem.solutions.max) {
          throw new Error(`${problem.id} is ambiguous, but level ${problem.level} asks for one count`);
        }
        if (problem.answer.count !== problem.solutions.min) throw new Error(`${problem.id} count answer mismatch`);
      } else {
        if (problem.solutions.min >= problem.solutions.max) {
          throw new Error(`${problem.id} has a single total, but level ${problem.level} asks for 최대 and 최소`);
        }
        if (!problem.solutions.minMap || !problem.solutions.maxMap) {
          throw new Error(`${problem.id} is missing a witness stack for the reveal`);
        }
      }
    });
  });
}

// Exported for the self-test, which re-derives everything independently.
export { frontView, sideView, topView, colMaxFromFrontView, rowMaxFromSideView, enumerateConsistent };
