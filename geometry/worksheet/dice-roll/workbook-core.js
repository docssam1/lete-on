import { directionInfo, orientations, roll, rollMany, visibleFaces } from "../../games/dice-roll/levels.js?v=dice-roll-3";

export const ACTIVITIES = Object.freeze([
  { id: "sequence", level: 2, names: { ko: "칸마다 밑면 기록", en: "Record each bottom face", zh: "记录每格底面", ja: "各マスの底面を記録" } },
  { id: "target", level: 2, names: { ko: "목표 칸의 밑면", en: "Bottom face at the target", zh: "目标格的底面", ja: "目標マスの底面" } },
  { id: "sum", level: 3, names: { ko: "표시한 칸의 눈의 합", en: "Sum on marked cells", zh: "标记格点数之和", ja: "印のマスの目の和" } },
  { id: "paired", level: 4, names: { ko: "두 주사위 밑면 추리", en: "Compare two dice routes", zh: "比较两条骰子路线", ja: "2つのさいころの経路" } },
  { id: "visible", level: 3, names: { ko: "도착한 주사위의 다섯 면", en: "Five faces at the finish", zh: "终点骰子的五个面", ja: "到着したさいころの5面" } }
]);

const ACTIVITY_IDS = new Set(ACTIVITIES.map((activity) => activity.id));
const DIRECTIONS = Object.freeze(["N", "E", "S", "W"]);
const OPPOSITE = Object.freeze({ N: "S", E: "W", S: "N", W: "E" });

export function normalizeCount(value) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.min(20, Math.max(1, parsed)) : 20;
}

export function normalizeLanguage(value) {
  return ["ko", "en", "zh", "ja"].includes(value) ? value : "ko";
}

export function normalizeLevel(value) {
  const parsed = Math.trunc(Number(value));
  return Number.isFinite(parsed) ? Math.min(5, Math.max(2, parsed)) : 3;
}

export function normalizeActivity(value) {
  return value === "all" || ACTIVITY_IDS.has(value) ? value : "all";
}

export function normalizeActivities(value) {
  const requested = Array.isArray(value)
    ? value
    : String(value ?? "").split(/[.,]/);
  if (!requested.length || requested.includes("all")) return ACTIVITIES.map((activity) => activity.id);
  const selected = new Set(requested.map((item) => String(item).trim()).filter((item) => ACTIVITY_IDS.has(item)));
  return selected.size ? ACTIVITIES.filter((activity) => selected.has(activity.id)).map((activity) => activity.id) : ACTIVITIES.map((activity) => activity.id);
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function integer(random, minimum, maximum) {
  return Math.floor(random() * (maximum - minimum + 1)) + minimum;
}

function sample(random, items) {
  return items[integer(random, 0, items.length - 1)];
}

function shuffle(random, items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = integer(random, 0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function routeLength(random, level, activity) {
  const ranges = { 2: [2, 3], 3: [3, 4], 4: [4, 6], 5: [6, 8] };
  const [minimum, maximum] = ranges[level] || ranges[3];
  const extra = activity === "paired" && level >= 4 ? 0 : activity === "sum" ? 1 : 0;
  return Math.min(8, integer(random, minimum, maximum) + extra);
}

function makeRoute(random, length) {
  const size = length >= 6 ? 4 : 3;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const start = [integer(random, 0, size - 1), integer(random, 0, size - 1)];
    const path = [[...start]];
    const directions = [];
    const visited = new Set([start.join(",")]);
    while (directions.length < length) {
      const [row, column] = path.at(-1);
      const candidates = DIRECTIONS.filter((direction) => {
        const { dr, dc } = directionInfo[direction];
        const next = [row + dr, column + dc];
        return next[0] >= 0 && next[0] < size && next[1] >= 0 && next[1] < size
          && (!directions.length || OPPOSITE[directions.at(-1)] !== direction)
          && !visited.has(next.join(","));
      });
      if (!candidates.length) break;
      const direction = sample(random, candidates);
      const { dr, dc } = directionInfo[direction];
      const next = [row + dr, column + dc];
      directions.push(direction);
      path.push(next);
      visited.add(next.join(","));
    }
    if (directions.length === length) return { rows: size, cols: size, start, path, directions };
  }
  throw new Error("Unable to create a dice route");
}

function makeBoard(random, length, forcedOrientation = null) {
  const route = makeRoute(random, length);
  const startOrientation = forcedOrientation || sample(random, orientations);
  const states = [];
  let current = startOrientation;
  route.directions.forEach((direction) => {
    current = roll(current, direction);
    states.push(current);
  });
  return { ...route, startOrientation, states, bottomValues: states.map((state) => state.bottom), finalOrientation: current };
}

function makeProblem(random, activity, level, id) {
  const length = routeLength(random, level, activity);
  if (activity === "paired") {
    const first = makeBoard(random, length);
    const secondRoute = makeRoute(random, routeLength(random, level, activity));
    const contactValue = first.bottomValues.at(-1);
    const candidates = orientations.filter((orientation) => rollMany(orientation, secondRoute.directions).bottom === contactValue);
    const startOrientation = sample(random, candidates);
    const second = makeBoardFromRoute(secondRoute, startOrientation);
    const unknownFace = sample(random, ["top", "front", "right"]);
    return { id, activity, level, boards: [first, second], contactValue, unknownFace, answer: visibleFaces(startOrientation)[unknownFace] };
  }
  const board = makeBoard(random, length);
  if (activity === "sequence") return { id, activity, level, boards: [board], answer: board.bottomValues.join(" → ") };
  if (activity === "target") return { id, activity, level, boards: [board], answer: String(board.bottomValues.at(-1)) };
  if (activity === "sum") {
    const count = level >= 4 ? 3 : 2;
    const targetSteps = shuffle(random, board.bottomValues.map((_, index) => index)).slice(0, count).sort((a, b) => a - b);
    const addends = targetSteps.map((index) => board.bottomValues[index]);
    return { id, activity, level, boards: [board], targetSteps, addends, answer: String(addends.reduce((sum, value) => sum + value, 0)) };
  }
  return { id, activity: "visible", level, boards: [board], answer: visibleFaces(board.finalOrientation) };
}

function makeBoardFromRoute(route, startOrientation) {
  const states = [];
  let current = startOrientation;
  route.directions.forEach((direction) => {
    current = roll(current, direction);
    states.push(current);
  });
  return { ...route, startOrientation, states, bottomValues: states.map((state) => state.bottom), finalOrientation: current };
}

function signature(problem) {
  return JSON.stringify({ activity: problem.activity, boards: problem.boards.map((board) => [board.start, board.directions, board.startOrientation]), targets: problem.targetSteps, unknown: problem.unknownFace });
}

export function chooseProblems(activity, count, options = {}) {
  const normalizedActivities = normalizeActivities(activity);
  const total = normalizeCount(count);
  const level = normalizeLevel(options.level);
  const seed = (Number(options.seed) + Number(options.round || 0) * 2654435761) >>> 0;
  const random = seededRandom(seed);
  const selected = ACTIVITIES.filter((item) => normalizedActivities.includes(item.id));
  const result = [];
  const used = new Set();
  for (let index = 0; index < total; index += 1) {
    const activityId = selected[index % selected.length].id;
    let problem;
    for (let attempt = 0; attempt < 120; attempt += 1) {
      problem = makeProblem(random, activityId, level, `dice-sheet-${seed}-${index + 1}-${attempt}`);
      if (!used.has(signature(problem))) break;
    }
    used.add(signature(problem));
    result.push(problem);
  }
  return result;
}

export function groupPages(problems) {
  const pages = [];
  for (let index = 0; index < problems.length; index += 2) pages.push(problems.slice(index, index + 2));
  return pages;
}

export function validateProblem(problem) {
  if (!ACTIVITY_IDS.has(problem.activity)) throw new Error(`Unknown dice activity: ${problem.activity}`);
  problem.boards.forEach((board) => {
    if (board.path.length !== board.directions.length + 1) throw new Error(`Broken route: ${problem.id}`);
    if (new Set(board.path.map((point) => point.join(","))).size !== board.path.length) throw new Error(`Repeated cell: ${problem.id}`);
    let current = board.startOrientation;
    const bottoms = board.directions.map((direction) => (current = roll(current, direction)).bottom);
    if (bottoms.join(",") !== board.bottomValues.join(",")) throw new Error(`Incorrect bottom sequence: ${problem.id}`);
  });
  if (problem.activity === "paired" && problem.boards[0].bottomValues.at(-1) !== problem.boards[1].bottomValues.at(-1)) throw new Error(`Paired contact mismatch: ${problem.id}`);
  return true;
}
