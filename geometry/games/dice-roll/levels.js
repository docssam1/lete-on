export const GAME_ID = "dice-roll";
export const PROGRESS_KEY = "diceRoll";

export const directionInfo = {
  N: { dr: -1, dc: 0, arrow: "↑", ko: "위쪽" },
  E: { dr: 0, dc: 1, arrow: "→", ko: "오른쪽" },
  S: { dr: 1, dc: 0, arrow: "↓", ko: "아래쪽" },
  W: { dr: 0, dc: -1, arrow: "←", ko: "왼쪽" }
};

export const startingOrientation = Object.freeze({
  top: 1, bottom: 6, north: 2, south: 5, east: 3, west: 4
});

export function roll(orientation, direction) {
  const { top, bottom, north, south, east, west } = orientation;
  if (direction === "N") return { top: south, bottom: north, north: top, south: bottom, east, west };
  if (direction === "S") return { top: north, bottom: south, north: bottom, south: top, east, west };
  if (direction === "E") return { top: west, bottom: east, north, south, east: top, west: bottom };
  if (direction === "W") return { top: east, bottom: west, north, south, east: bottom, west: top };
  throw new Error(`Unknown roll direction: ${direction}`);
}

export function rollMany(orientation, directions) {
  return directions.reduce((current, direction) => roll(current, direction), orientation);
}

export function visibleFaces(orientation) {
  return { top: orientation.top, front: orientation.south, right: orientation.east };
}

export function orientationKey(orientation) {
  return [orientation.top, orientation.bottom, orientation.north, orientation.south, orientation.east, orientation.west].join("");
}

function buildOrientations() {
  const found = new Map([[orientationKey(startingOrientation), startingOrientation]]);
  const queue = [startingOrientation];
  while (queue.length) {
    const current = queue.shift();
    Object.keys(directionInfo).forEach((direction) => {
      const next = roll(current, direction);
      const key = orientationKey(next);
      if (!found.has(key)) { found.set(key, next); queue.push(next); }
    });
  }
  return [...found.values()];
}

export const orientations = buildOrientations();

function pathFrom(start, directions) {
  const path = [[...start]];
  directions.forEach((direction) => {
    const [row, col] = path.at(-1);
    const { dr, dc } = directionInfo[direction];
    path.push([row + dr, col + dc]);
  });
  return path;
}

function numberChoices(answer, seed) {
  const choices = [answer];
  for (let offset = 1; choices.length < 4; offset += 1) {
    const value = ((answer + seed + offset - 1) % 6) + 1;
    if (!choices.includes(value)) choices.push(value);
  }
  const turn = seed % choices.length;
  return choices.map((_, index) => choices[(index + turn) % choices.length]);
}

function makeFaceProblem({ id, level, rows, cols, start, directions, orientation, faceKey, sourceType }) {
  const finalOrientation = rollMany(orientation, directions);
  const answer = visibleFaces(finalOrientation)[faceKey];
  return {
    id, level, interaction: "face-answer", rows, cols, path: pathFrom(start, directions), directions,
    startOrientation: orientation, finalOrientation, faceKey,
    choices: numberChoices(answer, Number(id.slice(-2))), answer,
    sourceRef: sourceType
  };
}

const oneRollDirections = ["N", "E", "S", "W", "E", "N", "W", "S", "N", "E"];
const level1 = oneRollDirections.map((direction, index) => makeFaceProblem({
  id: `dice-l1-${String(index + 1).padStart(2, "0")}`, level: 1, rows: 3, cols: 3,
  start: direction === "N" ? [1, 1] : direction === "S" ? [1, 1] : direction === "E" ? [1, 0] : [1, 2],
  directions: [direction], orientation: orientations[(index * 5) % orientations.length], faceKey: "top",
  sourceType: "attached-source; one-grid-step dice roll"
}));

const shortRoutes = [
  ["S", "E"], ["E", "N"], ["N", "W"], ["W", "S"], ["S", "E", "N"],
  ["E", "S", "W"], ["N", "E", "S"], ["W", "N", "E"], ["S", "S", "E"], ["E", "E", "N"]
];
const shortStarts = [[0,0],[2,0],[2,2],[0,2],[0,0],[0,0],[2,0],[2,2],[0,0],[2,0]];
const level2 = shortRoutes.map((directions, index) => makeFaceProblem({
  id: `dice-l2-${String(index + 1).padStart(2, "0")}`, level: 2, rows: 3, cols: 3,
  start: shortStarts[index], directions, orientation: orientations[(index * 7 + 3) % orientations.length],
  faceKey: ["top", "front", "right"][index % 3], sourceType: "attached-source; consecutive grid dice rolls"
}));

const loopRoutes = [
  { start:[1,0], route:["S","E","N"], turn:"counterclockwise" },
  { start:[1,2], route:["N","W","S"], turn:"counterclockwise" },
  { start:[0,1], route:["E","S","W"], turn:"clockwise" },
  { start:[2,1], route:["W","N","E"], turn:"clockwise" },
  { start:[0,0], route:["E","S","W"], turn:"clockwise" },
  { start:[0,2], route:["W","S","E"], turn:"counterclockwise" },
  { start:[2,2], route:["N","W","S"], turn:"counterclockwise" },
  { start:[2,0], route:["N","E","S"], turn:"clockwise" },
  { start:[1,0], route:["N","E","S","W"], turn:"clockwise" },
  { start:[1,2], route:["S","W","N","E"], turn:"clockwise" }
];

function visibleKey(orientation) {
  const visible = visibleFaces(orientation);
  return `${visible.top}-${visible.front}-${visible.right}`;
}

function orientationChoices(correct, seed) {
  const choices = [correct];
  for (let offset = 1; choices.length < 3; offset += 1) {
    const candidate = orientations[(seed * 5 + offset * 7) % orientations.length];
    if (!choices.some((item) => visibleKey(item) === visibleKey(candidate))) choices.push(candidate);
  }
  const turn = seed % choices.length;
  return choices.map((_, index) => choices[(index + turn) % choices.length]);
}

const level3 = loopRoutes.map((spec, index) => {
  const startOrientation = orientations[(index * 11 + 2) % orientations.length];
  const finalOrientation = rollMany(startOrientation, spec.route);
  const choices = orientationChoices(finalOrientation, index + 1);
  return {
    id:`dice-l3-${String(index + 1).padStart(2, "0")}`, level:3, interaction:"orientation-answer",
    rows:3, cols:3, path:pathFrom(spec.start, spec.route), directions:spec.route, turn:spec.turn,
    startOrientation, finalOrientation, choices, answer:choices.findIndex((choice) => visibleKey(choice) === visibleKey(finalOrientation)),
    sourceRef:"attached-source; clockwise and counterclockwise dice path"
  };
});

const longRoutes = [
  ["E","E","S","W"], ["S","S","E","N","E"], ["N","E","E","S","S"], ["W","N","E","N"],
  ["E","S","E","N","E"], ["S","W","S","E","E"], ["N","N","E","S","E","S"],
  ["W","S","S","E","N","E"], ["E","E","S","S","W","N"], ["S","E","N","E","S","W"]
];
const longStarts = [[1,0],[0,0],[2,0],[3,2],[1,0],[0,2],[3,0],[0,2],[0,0],[0,0]];
const level4 = longRoutes.map((directions, index) => makeFaceProblem({
  id:`dice-l4-${String(index + 1).padStart(2, "0")}`, level:4, rows:4, cols:4,
  start:longStarts[index], directions, orientation:orientations[(index * 13 + 1) % orientations.length],
  faceKey:["front","right","top","right","front"][index % 5], sourceType:"attached-source extension; long grid dice route"
}));

const reverseRouteSets = [
  [["E","S"],["S","E"],["E","E"]], [["N","W"],["W","N"],["N","N"]],
  [["S","E","N"],["E","S","W"],["S","S","E"]], [["W","N","E"],["N","E","N"],["W","W","N"]],
  [["E","E","S"],["S","E","E"],["E","S","W"]], [["N","N","E"],["E","N","N"],["N","E","S"]],
  [["S","W","N","W"],["W","S","E","S"],["S","S","W","N"]],
  [["E","N","W","N"],["N","E","S","E"],["E","E","N","W"]],
  [["S","E","N","E"],["E","S","W","S"],["S","S","E","E"]],
  [["N","W","W","S"],["W","N","E","N"],["N","N","W","E"]]
];

const reverseStarts = [[0,0],[2,2],[0,0],[2,2],[0,0],[3,0],[0,3],[3,0],[0,0],[3,3]];
const level5 = reverseRouteSets.map((routes, index) => {
  const startOrientation = orientations[(index * 17 + 4) % orientations.length];
  const correctIndex = index % 3;
  const finalOrientation = rollMany(startOrientation, routes[correctIndex]);
  return {
    id:`dice-l5-${String(index + 1).padStart(2, "0")}`, level:5, interaction:"route-answer",
    rows:4, cols:4, path:[[...reverseStarts[index]]], directions:[], startOrientation, finalOrientation,
    routeChoices:routes, choices:routes, answer:correctIndex,
    sourceRef:"attached-source extension; infer a dice route from its final faces"
  };
});

export const levels = [
  { id:1, band:"초급", title:"한 칸 굴리기", subtitle:"한 번 굴린 뒤 윗면 찾기", problems:level1 },
  { id:2, band:"초급", title:"이어 굴리기", subtitle:"두세 칸의 면 변화 따라가기", problems:level2 },
  { id:3, band:"초급", title:"시계 방향 돌기", subtitle:"시계·반시계 경로의 눈 변화", problems:level3 },
  { id:4, band:"중급", title:"격자 길 따라가기", subtitle:"긴 경로의 앞·오른쪽 면 추적", problems:level4 },
  { id:5, band:"중급", title:"거꾸로 경로 찾기", subtitle:"도착한 주사위를 보고 이동 추리", problems:level5 }
];

export function validateLevels() {
  if (orientations.length !== 24) throw new Error(`Expected 24 orientations, found ${orientations.length}`);
  const ids = new Set();
  levels.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`Level ${level.id} needs 10 problems`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate id ${problem.id}`);
      ids.add(problem.id);
      problem.path.slice(1).forEach(([row, col], index) => {
        const [previousRow, previousCol] = problem.path[index];
        if (Math.abs(row - previousRow) + Math.abs(col - previousCol) !== 1) throw new Error(`${problem.id}: broken path`);
        if (row < 0 || row >= problem.rows || col < 0 || col >= problem.cols) throw new Error(`${problem.id}: path outside board`);
      });
      if (problem.interaction === "face-answer" && !problem.choices.includes(problem.answer)) throw new Error(`${problem.id}: answer missing`);
      if (problem.interaction === "orientation-answer" && problem.answer < 0) throw new Error(`${problem.id}: orientation answer missing`);
      if (problem.interaction === "route-answer") {
        const target = visibleKey(problem.finalOrientation);
        const matches = problem.routeChoices.filter((route) => visibleKey(rollMany(problem.startOrientation, route)) === target).length;
        if (matches !== 1) throw new Error(`${problem.id}: reverse route has ${matches} visible answers`);
      }
    });
  });
  return true;
}
