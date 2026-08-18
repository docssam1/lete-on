import { sessionProblems } from "../../shared/problem-pool.js";

// Each authored problem has exactly one build that satisfies all three views.
const frontView = (map, height) => Array.from({ length: height }, (_, row) => {
  const y = height - row;
  return Array.from({ length: map[0].length }, (_, x) => Number(map.some((line) => line[x] >= y)));
});

const sideView = (map, height) => Array.from({ length: height }, (_, row) => {
  const y = height - row;
  return Array.from({ length: map.length }, (_, column) => {
    const z = map.length - 1 - column;
    return Number(map[z].some((value) => value >= y));
  });
});

const topView = (map) => map.map((row) => row.map((value) => Number(value > 0)));

export function viewsOfHeightGrid(map, _grid, height) {
  return { front: frontView(map, height), side: sideView(map, height), top: topView(map) };
}

export function viewsMatch(actual, target, activeViews = ["front", "side", "top"]) {
  return activeViews.every((name) => JSON.stringify(actual[name]) === JSON.stringify(target[name]));
}

function makeProblem(id, level, reference) {
  const depth = reference.length;
  const width = reference[0].length;
  const maxH = Math.max(...reference.flat());
  return {
    id, level, grid: [width, depth], maxH, reference,
    target: viewsOfHeightGrid(reference, [width, depth], maxH),
    activeViews: ["front", "side", "top"],
    cubeCount: reference.flat().reduce((sum, value) => sum + value, 0)
  };
}

const authoredMaps = {
  2: [
    [[2,1],[2,1]], [[1,2],[1,0]], [[1,2],[0,2]], [[0,2],[1,2]], [[0,1],[1,2]],
    [[1,1],[2,0]], [[2,2],[1,1]], [[2,1],[0,1]], [[2,1],[1,0]], [[1,1],[2,2]]
  ],
  3: [
    [[1,1,0],[3,0,0],[1,1,0]], [[3,1,0],[0,1,1],[0,0,3]],
    [[0,0,0],[3,1,3],[2,0,0]], [[0,0,0],[1,3,2],[0,3,0]],
    [[0,0,3],[2,1,3],[0,0,1]], [[0,0,0],[0,0,2],[1,3,3]],
    [[0,1,1],[2,3,0],[0,1,0]], [[0,0,0],[0,0,2],[1,2,3]],
    [[2,3,3],[0,2,0],[0,0,0]], [[2,2,3],[1,0,0],[0,0,0]]
  ],
  4: [
    [[1,2,3],[0,0,1],[0,0,3]], [[1,1,3],[0,0,2],[0,1,2]],
    [[3,1,0],[0,1,3],[0,1,3]], [[1,1,1],[1,3,2],[1,0,0]],
    [[0,1,0],[0,1,3],[2,1,0]], [[1,3,2],[1,0,1],[1,0,1]],
    [[3,1,3],[2,1,0],[1,0,0]], [[0,0,1],[1,1,1],[2,3,2]],
    [[3,3,2],[0,0,1],[0,0,1]], [[1,0,1],[3,2,1],[0,0,0]]
  ],
  5: [
    [[4,4,4,3],[1,0,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,2],[0,0,1,1],[0,0,0,1],[0,0,0,4]],
    [[0,0,4,1],[0,3,4,0],[0,0,2,1],[0,0,0,0]],
    [[0,0,0,0],[0,2,3,2],[1,1,0,0],[4,0,0,0]],
    [[0,1,0,0],[4,1,2,0],[4,0,0,0],[2,0,0,0]],
    [[0,0,0,0],[4,3,0,0],[1,1,1,0],[3,0,0,0]],
    [[1,3,2,0],[0,4,0,0],[1,1,0,0],[0,0,0,0]],
    [[0,2,0,0],[3,3,1,4],[0,0,0,4],[0,0,0,0]],
    [[0,1,0,0],[0,4,0,0],[1,3,1,2],[1,3,0,0]],
    [[0,0,4,3],[3,3,4,0],[0,1,1,0],[0,0,0,0]]
  ]
};

const pools = Object.entries(authoredMaps).map(([level, maps]) => ({
  level: Number(level), stars: Number(level),
  problems: maps.map((map, index) => makeProblem(`blueprint-l${level}-${String(index + 1).padStart(2, "0")}`, Number(level), map))
}));

export const levels = pools.map((entry, index) => ({
  level: entry.level, stars: entry.stars, pool: entry.problems,
  problems: sessionProblems("cube-blueprint", index + 1, entry.problems, 5)
}));

function solutionCount(problem, stopAt = 2) {
  const positions = [];
  problem.target.top.forEach((row, z) => row.forEach((filled, x) => { if (filled) positions.push([x, z]); }));
  const map = problem.target.top.map((row) => row.map(() => 0));
  let count = 0;
  function visit(index) {
    if (count >= stopAt) return;
    if (index === positions.length) {
      if (viewsMatch(viewsOfHeightGrid(map, problem.grid, problem.maxH), problem.target)) count += 1;
      return;
    }
    const [x, z] = positions[index];
    for (let h = 1; h <= problem.maxH; h += 1) {
      map[z][x] = h;
      visit(index + 1);
      if (count >= stopAt) break;
    }
    map[z][x] = 0;
  }
  visit(0);
  return count;
}

export function validateLevels() {
  if (levels.length !== 4) throw new Error("cube-blueprint requires four levels");
  pools.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`level ${level.level} requires 10 authored problems`);
    level.problems.forEach((problem) => {
      const [width, depth] = problem.grid;
      if (width > 4 || depth > 4 || problem.maxH > 4) throw new Error(`${problem.id} exceeds 4x4x4`);
      if (!viewsMatch(viewsOfHeightGrid(problem.reference, problem.grid, problem.maxH), problem.target)) throw new Error(`${problem.id} reference mismatch`);
      if (solutionCount(problem) !== 1) throw new Error(`${problem.id} must have exactly one solution`);
    });
  });
  return true;
}
