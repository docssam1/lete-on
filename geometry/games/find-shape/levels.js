import { sessionProblems } from "../../shared/problem-pool.js";

const clone = (grid) => grid.map((row) => [...row]);
const flatten = (grid) => grid.flat();
const keyOf = (grid) => grid.map((row) => row.join("")).join("/");

function hashSeed(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFrom(seedValue) {
  let seed = hashSeed(seedValue) || 1;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function shuffle(values, random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function connected(grid) {
  const depth = grid.length;
  const width = grid[0].length;
  const occupied = [];
  grid.forEach((row, z) => row.forEach((height, x) => { if (height > 0) occupied.push([x, z]); }));
  if (!occupied.length) return false;
  const seen = new Set([occupied[0].join(",")]);
  const queue = [occupied[0]];
  while (queue.length) {
    const [x, z] = queue.shift();
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dz]) => {
      const nx = x + dx;
      const nz = z + dz;
      const key = `${nx},${nz}`;
      if (nx >= 0 && nx < width && nz >= 0 && nz < depth && grid[nz][nx] > 0 && !seen.has(key)) {
        seen.add(key);
        queue.push([nx, nz]);
      }
    });
  }
  return seen.size === occupied.length;
}

export function cluesOf(grid) {
  const maxHeight = Math.max(...flatten(grid));
  const width = grid[0].length;
  const depth = grid.length;
  const layers = Array.from({ length: maxHeight }, (_, level) =>
    flatten(grid).filter((height) => height >= level + 1).length
  );
  const front = Array.from({ length: width }, (_, x) => Math.max(...grid.map((row) => row[x])));
  const right = Array.from({ length: depth }, (_, z) => Math.max(...grid[z]));
  return { layers, front, right, maxHeight };
}

export function clueSignature(grid) {
  const clues = cluesOf(grid);
  return `${clues.layers.join(",")}|${clues.front.join(",")}|${clues.right.join(",")}`;
}

function similarity(candidate, target) {
  const a = cluesOf(candidate);
  const b = cluesOf(target);
  const same = (left, right) => left.reduce((total, value, index) => total + (value === right[index] ? 1 : 0), 0);
  return same(a.front, b.front) * 4 + same(a.right, b.right) * 4 + same(a.layers, b.layers) * 2;
}

function makeOptions(id, target, count) {
  const random = randomFrom(id);
  const depth = target.length;
  const width = target[0].length;
  const values = flatten(target);
  const targetKey = keyOf(target);
  const targetSignature = clueSignature(target);
  const candidates = new Map();

  for (let attempt = 0; attempt < 1800; attempt += 1) {
    const shuffled = shuffle(values, random);
    const grid = Array.from({ length: depth }, (_, z) => shuffled.slice(z * width, (z + 1) * width));
    const key = keyOf(grid);
    if (key === targetKey || candidates.has(key) || !connected(grid)) continue;
    if (clueSignature(grid) === targetSignature) continue;
    candidates.set(key, { grid, score: similarity(grid, target) });
  }

  const distractors = [...candidates.values()]
    .sort((a, b) => b.score - a.score || keyOf(a.grid).localeCompare(keyOf(b.grid)))
    .slice(0, count - 1)
    .map((entry) => entry.grid);
  if (distractors.length !== count - 1) throw new Error(`${id}: not enough valid distractors`);

  const answer = hashSeed(`${id}:answer`) % count;
  const options = [...distractors];
  options.splice(answer, 0, clone(target));
  return { options, answer };
}

function problem(id, level, target, optionCount) {
  const { options, answer } = makeOptions(id, target, optionCount);
  return { id, level, target: clone(target), clues: cluesOf(target), options, answer };
}

const pools = [
  {
    level: 3, stars: 3, optionCount: 3, targets: [
      [[0,1,0],[1,2,1],[0,1,0]], [[1,2,0],[1,1,1],[0,1,0]],
      [[0,2,1],[1,1,0],[1,1,0]], [[1,1,0],[0,2,1],[0,1,1]],
      [[0,1,1],[2,1,0],[1,0,0]], [[1,0,1],[1,2,1],[0,1,0]],
      [[1,1,0],[1,2,0],[0,1,1]], [[0,1,0],[2,1,1],[1,1,0]],
      [[1,2,1],[0,1,0],[0,1,0]], [[0,1,1],[1,2,0],[1,0,1]]
    ]
  },
  {
    level: 4, stars: 4, optionCount: 4, targets: [
      [[0,1,2],[1,3,1],[0,2,0]], [[1,2,0],[2,1,1],[0,3,1]],
      [[0,2,1],[1,3,0],[2,1,1]], [[1,1,2],[0,3,1],[0,2,0]],
      [[0,1,0],[2,3,1],[1,2,1]], [[1,0,2],[2,3,1],[0,1,1]],
      [[0,2,1],[2,1,0],[1,3,1]], [[1,2,0],[0,3,2],[1,1,0]],
      [[0,1,2],[1,2,1],[2,3,0]], [[2,1,0],[1,3,2],[0,1,1]]
    ]
  },
  {
    level: 5, stars: 5, optionCount: 4, targets: [
      [[0,1,2,0],[1,3,2,1],[0,2,4,1],[0,1,1,0]],
      [[1,2,0,0],[2,4,1,0],[1,3,2,1],[0,1,1,0]],
      [[0,2,1,0],[1,3,4,1],[2,2,1,0],[0,1,0,0]],
      [[0,1,2,1],[1,4,2,0],[0,3,1,1],[0,1,0,0]],
      [[1,0,1,0],[2,3,2,1],[0,4,1,2],[0,1,1,0]],
      [[0,1,0,0],[1,3,2,1],[2,4,3,0],[1,1,0,0]],
      [[0,2,1,0],[1,4,2,1],[0,3,1,2],[0,1,0,0]],
      [[1,1,0,0],[2,4,3,1],[1,2,1,0],[0,0,1,0]],
      [[0,1,2,0],[2,3,1,1],[1,4,2,0],[0,1,1,0]],
      [[0,2,0,0],[1,3,2,1],[2,1,4,1],[0,1,1,0]]
    ]
  }
];

export const levels = pools.map((entry) => ({
  level: entry.level,
  stars: entry.stars,
  problems: sessionProblems(
    "find-shape",
    entry.level,
    entry.targets.map((target, index) => problem(
      `find-l${entry.level}-${String(index + 1).padStart(2, "0")}`,
      entry.level,
      target,
      entry.optionCount
    )),
    5
  )
}));

export function validateLevels() {
  if (levels.length !== 3) throw new Error("find-shape requires three levels");
  levels.forEach((level) => {
    level.problems.forEach((entry) => {
      const width = entry.target[0].length;
      if (width > 4 || entry.target.length > 4 || entry.clues.maxHeight > 4) throw new Error(`${entry.id}: exceeds 4x4x4`);
      if (!connected(entry.target)) throw new Error(`${entry.id}: target is disconnected`);
      const targetSignature = clueSignature(entry.target);
      const matches = entry.options.filter((option) => clueSignature(option) === targetSignature);
      if (matches.length !== 1) throw new Error(`${entry.id}: expected one clue match, found ${matches.length}`);
      if (keyOf(entry.options[entry.answer]) !== keyOf(entry.target)) throw new Error(`${entry.id}: wrong answer index`);
      const expectedLayers = flatten(entry.target).reduce((sum, height) => sum + height, 0);
      const countedLayers = entry.clues.layers.reduce((sum, count) => sum + count, 0);
      if (expectedLayers !== countedLayers) throw new Error(`${entry.id}: layer counts are inconsistent`);
    });
  });
  return true;
}
