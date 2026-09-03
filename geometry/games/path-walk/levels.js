export const directionBits = { N: 1, E: 2, S: 4, W: 8 };

const directionOrder = ["N", "E", "S", "W"];
const opposite = { N: "S", E: "W", S: "N", W: "E" };
const delta = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };

export function rotateMask(mask, turns = 1) {
  let result = mask;
  for (let turn = 0; turn < ((turns % 4) + 4) % 4; turn += 1) {
    result = ((result << 1) & 15) | ((result & 8) >> 3);
  }
  return result;
}

function indexOf(cols, row, col) { return row * cols + col; }
function coordKey(row, col) { return `${row},${col}`; }

function distinctRotations(mask) {
  return [...new Set([0, 1, 2, 3].map((turn) => rotateMask(mask, turn)))];
}

function firstDifferentRotation(mask, offset) {
  for (let step = 0; step < 4; step += 1) {
    const candidate = rotateMask(mask, offset + step);
    if (candidate !== mask) return candidate;
  }
  return mask;
}

function rotationDistance(from, to) {
  for (let turns = 0; turns < 4; turns += 1) if (rotateMask(from, turns) === to) return turns;
  return 4;
}

const transforms = [
  { coord: (r, c, n) => [r, c], dir: (dir) => dir },
  { coord: (r, c, n) => [c, n - 1 - r], dir: (dir) => ({ N: "E", E: "S", S: "W", W: "N" })[dir] },
  { coord: (r, c, n) => [n - 1 - r, n - 1 - c], dir: (dir) => ({ N: "S", E: "W", S: "N", W: "E" })[dir] },
  { coord: (r, c, n) => [n - 1 - c, r], dir: (dir) => ({ N: "W", E: "N", S: "E", W: "S" })[dir] },
  { coord: (r, c, n) => [r, n - 1 - c], dir: (dir) => ({ N: "N", E: "W", S: "S", W: "E" })[dir] }
];

function transformed(spec, variant) {
  const transform = transforms[variant % transforms.length];
  const mapCoord = ([row, col]) => transform.coord(row, col, spec.rows);
  return {
    ...spec,
    paths: spec.paths.map((path) => path.map(mapCoord)),
    endpoints: spec.endpoints.map((endpoint) => ({ ...endpoint, cell: mapCoord(endpoint.cell), dir: transform.dir(endpoint.dir) })),
    editable: spec.editable.map(mapCoord),
    hidden: spec.hidden ? mapCoord(spec.hidden) : null
  };
}

function graphMasks(spec) {
  const masks = Array(spec.rows * spec.cols).fill(0);
  const addEdge = (a, b) => {
    const [ar, ac] = a;
    const [br, bc] = b;
    const dr = br - ar;
    const dc = bc - ac;
    const dir = directionOrder.find((name) => delta[name][0] === dr && delta[name][1] === dc);
    if (!dir) throw new Error(`Non-adjacent path edge: ${a} -> ${b}`);
    masks[indexOf(spec.cols, ar, ac)] |= directionBits[dir];
    masks[indexOf(spec.cols, br, bc)] |= directionBits[opposite[dir]];
  };
  spec.paths.forEach((path) => path.slice(1).forEach((cell, index) => addEdge(path[index], cell)));
  spec.endpoints.forEach((endpoint) => {
    masks[indexOf(spec.cols, endpoint.cell[0], endpoint.cell[1])] |= directionBits[endpoint.dir];
  });
  return masks;
}

function makeTileProblem(id, spec, variant, sourceRef) {
  const shape = transformed(spec, variant);
  const solved = graphMasks(shape);
  const editable = shape.editable.map(([row, col]) => indexOf(shape.cols, row, col));
  const initial = [...solved];
  editable.forEach((cellIndex, editIndex) => {
    initial[cellIndex] = firstDifferentRotation(solved[cellIndex], 1 + ((variant + editIndex) % 3));
  });
  return {
    id,
    interaction: "rotate-tiles",
    rows: shape.rows,
    cols: shape.cols,
    solved,
    initial,
    editable,
    endpoints: shape.endpoints.map((endpoint) => ({ ...endpoint, index: indexOf(shape.cols, endpoint.cell[0], endpoint.cell[1]) })),
    sourceRef,
    sourceKind: "source-backed-variation",
    reasoningSteps: editable.length + editable.reduce((sum, cellIndex) => sum + rotationDistance(initial[cellIndex], solved[cellIndex]), 0)
  };
}

function makeHiddenProblem(id, spec, variant) {
  const shape = transformed(spec, variant);
  const solved = graphMasks(shape);
  const hiddenIndex = indexOf(shape.cols, shape.hidden[0], shape.hidden[1]);
  const answerMask = solved[hiddenIndex];
  const rotations = distinctRotations(answerMask);
  if (rotations.length < 3) throw new Error(`${id}: hidden tile needs at least three orientations`);
  const answer = (Number(id.match(/\d+$/)?.[0]) - 1) % 3;
  const choices = [rotations[1], rotations[2]];
  choices.splice(answer, 0, answerMask);
  const visible = [...solved];
  visible[hiddenIndex] = 0;
  return {
    id,
    interaction: "hidden-tile",
    rows: shape.rows,
    cols: shape.cols,
    solved,
    initial: visible,
    editable: [],
    hiddenIndex,
    choices,
    answer,
    endpoints: shape.endpoints.map((endpoint) => ({ ...endpoint, index: indexOf(shape.cols, endpoint.cell[0], endpoint.cell[1]) })),
    sourceRef: "GFIELD-path-extension-hidden-tile",
    sourceKind: "internal-extension",
    reasoningSteps: 7
  };
}

export function validateNetwork(problem, masks) {
  const endpointKeys = new Set(problem.endpoints.map((endpoint) => `${endpoint.index}:${endpoint.dir}`));
  for (let index = 0; index < masks.length; index += 1) {
    const row = Math.floor(index / problem.cols);
    const col = index % problem.cols;
    for (const dir of directionOrder) {
      if (!(masks[index] & directionBits[dir])) continue;
      const [dr, dc] = delta[dir];
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= problem.rows || nc < 0 || nc >= problem.cols) {
        if (!endpointKeys.has(`${index}:${dir}`)) return false;
        continue;
      }
      const neighbor = masks[indexOf(problem.cols, nr, nc)];
      if (!(neighbor & directionBits[opposite[dir]])) return false;
    }
  }
  if (problem.endpoints.some((endpoint) => !(masks[endpoint.index] & directionBits[endpoint.dir]))) return false;
  const start = problem.endpoints.find((endpoint) => endpoint.kind === "start");
  if (!start) return false;
  const active = masks.map((mask, index) => mask ? index : -1).filter((index) => index >= 0);
  const seen = new Set([start.index]);
  const queue = [start.index];
  while (queue.length) {
    const index = queue.shift();
    const row = Math.floor(index / problem.cols);
    const col = index % problem.cols;
    for (const dir of directionOrder) {
      if (!(masks[index] & directionBits[dir])) continue;
      const [dr, dc] = delta[dir];
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= problem.rows || nc < 0 || nc >= problem.cols) continue;
      const next = indexOf(problem.cols, nr, nc);
      if (!seen.has(next)) { seen.add(next); queue.push(next); }
    }
  }
  return active.every((index) => seen.has(index)) && problem.endpoints.filter((endpoint) => endpoint.kind === "target").every((endpoint) => seen.has(endpoint.index));
}

function solutionCount(problem, limit = 2) {
  const masks = [...problem.initial];
  let count = 0;
  const visit = (position) => {
    if (count >= limit) return;
    if (position === problem.editable.length) {
      if (validateNetwork(problem, masks)) count += 1;
      return;
    }
    const index = problem.editable[position];
    for (const mask of distinctRotations(problem.solved[index])) {
      masks[index] = mask;
      visit(position + 1);
    }
  };
  visit(0);
  return count;
}

export function shortestGridPath(rows, cols, blocked, start, goal) {
  const blockedSet = new Set(blocked);
  const previous = new Map([[start, null]]);
  const queue = [start];
  while (queue.length) {
    const current = queue.shift();
    if (current === goal) break;
    const row = Math.floor(current / cols);
    const col = current % cols;
    for (const [dr, dc] of Object.values(delta)) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const next = indexOf(cols, nr, nc);
      if (blockedSet.has(next) || previous.has(next)) continue;
      previous.set(next, current);
      queue.push(next);
    }
  }
  if (!previous.has(goal)) return null;
  const path = [];
  for (let cursor = goal; cursor !== null; cursor = previous.get(cursor)) path.push(cursor);
  return path.reverse();
}

const pathBaseA = {
  rows: 3, cols: 3,
  paths: [[[1, 0], [1, 1], [2, 1], [2, 2]]],
  endpoints: [{ kind: "start", cell: [1, 0], dir: "W" }, { kind: "target", cell: [2, 2], dir: "S" }],
  editable: [[1, 1], [2, 1]], hidden: [1, 1]
};
const pathBaseB = {
  rows: 3, cols: 3,
  paths: [[[0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2]]],
  endpoints: [{ kind: "start", cell: [0, 1], dir: "N" }, { kind: "target", cell: [2, 2], dir: "S" }],
  editable: [[1, 1], [1, 0]], hidden: [1, 1]
};

const avoidBaseA = {
  rows: 4, cols: 4,
  paths: [[[1, 0], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3]]],
  endpoints: [{ kind: "start", cell: [1, 0], dir: "W" }, { kind: "target", cell: [2, 3], dir: "E" }],
  editable: [[1, 1], [0, 1], [0, 2], [1, 2], [2, 2]], hidden: [0, 2]
};
const avoidBaseB = {
  rows: 4, cols: 4,
  paths: [[[0, 1], [1, 1], [1, 2], [2, 2], [2, 1], [3, 1], [3, 2]]],
  endpoints: [{ kind: "start", cell: [0, 1], dir: "N" }, { kind: "target", cell: [3, 2], dir: "S" }],
  editable: [[1, 1], [1, 2], [2, 2], [2, 1], [3, 1]], hidden: [2, 2]
};

const branchBaseA = {
  rows: 4, cols: 4,
  paths: [
    [[2, 0], [2, 1], [2, 2]],
    [[2, 2], [1, 2], [0, 2]],
    [[2, 2], [2, 3]]
  ],
  endpoints: [
    { kind: "start", cell: [2, 0], dir: "W" },
    { kind: "target", cell: [0, 2], dir: "N" },
    { kind: "target", cell: [2, 3], dir: "E" }
  ],
  editable: [[2, 1], [2, 2], [1, 2]], hidden: [2, 2]
};
const branchBaseB = {
  rows: 4, cols: 4,
  paths: [
    [[0, 1], [1, 1], [2, 1]],
    [[2, 1], [2, 0]],
    [[2, 1], [2, 2], [3, 2]]
  ],
  endpoints: [
    { kind: "start", cell: [0, 1], dir: "N" },
    { kind: "target", cell: [2, 0], dir: "W" },
    { kind: "target", cell: [3, 2], dir: "S" }
  ],
  editable: [[1, 1], [2, 1], [2, 2]], hidden: [2, 1]
};

const transformedSet = (prefix, bases, sourceRef, maker = makeTileProblem) => bases.flatMap((base, baseIndex) => transforms.map((_, variant) => maker(`${prefix}-${baseIndex * 5 + variant + 1}`, base, variant, sourceRef)));

const shortestSpecs = [
  [[0, 1, 3, 6, 7, 12, 15, 18, 22, 33], 30, 5],
  [[1, 4, 14, 18, 21, 23, 27, 28, 32, 35], 30, 5],
  [[0, 2, 8, 9, 11, 18, 21, 27, 32, 33], 30, 5],
  [[4, 7, 9, 12, 15, 17, 18, 23, 26, 32], 30, 5],
  [[1, 7, 10, 13, 22, 23, 28, 29, 32, 33], 30, 5],
  [[2, 4, 9, 11, 24, 27, 28, 30, 31, 33], 0, 35],
  [[0, 3, 4, 6, 7, 17, 22, 29, 32, 35], 30, 5],
  [[7, 11, 12, 14, 17, 19, 21, 28, 31, 32], 30, 5],
  [[2, 7, 8, 9, 11, 21, 22, 31, 33, 34], 0, 35],
  [[0, 2, 4, 13, 15, 19, 24, 25, 26, 34], 30, 5]
];

const shortestProblems = shortestSpecs.map(([blocked, start, goal], index) => {
  const answerPath = shortestGridPath(6, 6, blocked, start, goal);
  if (!answerPath) throw new Error(`path-shortest-${index + 1}: no route`);
  return {
    id: `path-shortest-${index + 1}`,
    interaction: "draw-shortest",
    rows: 6, cols: 6, blocked, start, goal, answerPath,
    shortest: answerPath.length - 1,
    sourceRef: "RAY-B4-2-book-p74-pdf-p64-shortest-grid-path",
    sourceKind: "source-backed-variation",
    reasoningSteps: answerPath.length + 5,
    answerPolicy: "any-shortest-path"
  };
});

export const levels = [
  {
    id: 1, difficulty: "입문",
    title: { ko: "한 길 잇기", zh: "连接一条路", ja: "一本の道", en: "Connect One Route" },
    description: { ko: "타일 1~2개를 돌려 출발점과 목적지를 이어요.", zh: "旋转1到2块拼片连接起点和终点。", ja: "1〜2枚を回して道をつなぎます。", en: "Turn one or two tiles to connect start and goal." },
    problems: transformedSet("path-one", [pathBaseA, pathBaseB], "RAY-B4-2-p68-69-path-cards")
  },
  {
    id: 2, difficulty: "초급",
    title: { ko: "숨은 타일 추론", zh: "推理隐藏拼片", ja: "かくれたタイル", en: "Infer the Hidden Tile" },
    description: { ko: "앞뒤 길 단서를 보고 가려진 타일의 방향을 찾아요.", zh: "根据两侧道路判断隐藏拼片的方向。", ja: "前後の道から隠れた向きを考えます。", en: "Use neighboring route clues to infer the hidden tile." },
    problems: transformedSet("path-hidden", [avoidBaseA, avoidBaseB], null, makeHiddenProblem)
  },
  {
    id: 3, difficulty: "초급",
    title: { ko: "두 곳에 닿기", zh: "到达两个终点", ja: "二つの場所へ", en: "Reach Two Places" },
    description: { ko: "갈림길 타일을 돌려 두 목적지에 모두 닿아요.", zh: "旋转岔路拼片，到达两个终点。", ja: "分かれ道を回して二つの目的地へ。", en: "Turn branch tiles so the route reaches both goals." },
    problems: transformedSet("path-branch", [branchBaseA, branchBaseB], "RAY-B4-2-p70-p73-multiple-destinations")
  },
  {
    id: 4, difficulty: "중급",
    title: { ko: "막힌 길 피하기", zh: "避开断路", ja: "行き止まりを避ける", en: "Avoid Broken Roads" },
    description: { ko: "빈칸과 막힌 곳을 피해 길이 끊기지 않게 이어요.", zh: "避开空格，让道路不断开。", ja: "空きマスを避けて道をつなぎます。", en: "Route around empty cells without any broken ends." },
    problems: transformedSet("path-avoid", [avoidBaseA, avoidBaseB], "RAY-B4-2-p68-71-path-cards")
  },
  {
    id: 5, difficulty: "중급",
    title: { ko: "가장 가까운 길", zh: "最短路线", ja: "いちばん近い道", en: "Shortest Walk" },
    description: { ko: "막힌 칸을 피해 같은 칸을 두 번 밟지 않고 최단 길을 그려요.", zh: "避开障碍，不重复格子，画出最短路线。", ja: "同じマスを通らず最短の道を描きます。", en: "Avoid blocks and draw a shortest route without revisiting cells." },
    problems: shortestProblems
  }
];

export function validateLevels() {
  const ids = new Set();
  if (levels.length !== 5) throw new Error("Path Walk requires five levels");
  levels.forEach((level) => {
    if (level.problems.length !== 10) throw new Error(`Level ${level.id} requires ten problems`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate problem id: ${problem.id}`);
      ids.add(problem.id);
      if (!problem.sourceRef) throw new Error(`${problem.id}: missing sourceRef`);
      if (!problem.sourceKind || !Number.isInteger(problem.reasoningSteps) || problem.reasoningSteps < 1) throw new Error(`${problem.id}: missing reasoning metadata`);
      if (problem.interaction === "draw-shortest") {
        const path = shortestGridPath(problem.rows, problem.cols, problem.blocked, problem.start, problem.goal);
        if (!path || path.length - 1 !== problem.shortest) throw new Error(`${problem.id}: shortest path mismatch`);
        return;
      }
      if (!validateNetwork(problem, problem.solved)) throw new Error(`${problem.id}: solved network is invalid`);
      if (problem.interaction === "rotate-tiles") {
        if (validateNetwork(problem, problem.initial)) throw new Error(`${problem.id}: starts solved`);
        const solutions = solutionCount(problem);
        if (solutions !== 1) throw new Error(`${problem.id}: expected one solution, got ${solutions}`);
      } else {
        const masks = [...problem.initial];
        const validChoices = problem.choices.filter((choice) => {
          masks[problem.hiddenIndex] = choice;
          return validateNetwork(problem, masks);
        });
        if (validChoices.length !== 1 || problem.choices[problem.answer] !== validChoices[0]) throw new Error(`${problem.id}: hidden choice is not unique`);
      }
    });
  });
  return true;
}

validateLevels();
