"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u5");
const types = unit.subunits.flatMap(subunit => subunit.types);

const expectedKinds = new Map([
  ["5-2-u5-t1", "grid-cube-count"],
  ["5-2-u5-t1-2", "max-cube-cut"],
  ["5-2-u5-t1-3", "cut-edge-sum-2d"],
  ["5-2-u5-t1-4", "grid-cuboid-types"],
  ["5-2-u5-t1-5", "cuboid-assembly-count"],
  ["5-2-u5-t2", "net-paper-fit"],
  ["5-2-u5-t2-2", "corner-cut-edge-sum"],
  ["5-2-u5-t2-3", "minimum-cuboid-net-paper"],
  ["5-2-u5-t2-4", "net-waste"],
  ["5-2-u5-t2-5", "cube-net-completion-positions"],
  ["5-2-u5-t3", "invalid-vertex-triple"],
  ["5-2-u5-t3-2", "edge-relation-count"],
  ["5-2-u5-t3-3", "vertex-product-rank"],
  ["5-2-u5-t3-4", "opposite-product-max"],
  ["5-2-u5-t3-5", "edge-route-shortest"],
  ["5-2-u5-t4", "minimum-cover-box"],
  ["5-2-u5-t4-2", "three-loops"],
  ["5-2-u5-t4-3", "max-pack-rotations"],
  ["5-2-u5-t4-4", "stack-height"],
  ["5-2-u5-t4-5", "edges-from-loops"],
  ["5-2-u5-t5", "dice-labeling-count"],
  ["5-2-u5-t5-2", "dice-net-missing"],
  ["5-2-u5-t5-3", "dice-view-sums"],
  ["5-2-u5-t5-4", "dice-contact-sum"],
  ["5-2-u5-t5-5", "dice-visible"],
  ["5-2-u5-t6", "dice-roll-top"],
  ["5-2-u5-t6-2", "dice-opposite-record"],
  ["5-2-u5-t6-3", "rolling-bottom-paths"],
  ["5-2-u5-t6-4", "dice-path-sum"],
  ["5-2-u5-t6-5", "dice-two-paths"]
]);

const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").filter(Boolean).map(Number);
const vectorKey = vector => vector.join(",");
const sameVector = (left, right) => left.every((value, index) => value === right[index]);
const oppositeVector = vector => vector.map(value => -value);
const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const gcdAll = items => items.reduce(gcd);
const factorial = value => Array.from({ length: value }, (_, index) => index + 1).reduce((product, item) => product * item, 1);

function foldNet(cells) {
  const positions = new Map(cells.map((cell, index) => [cell.join(","), index]));
  if (positions.size !== cells.length) throw new Error("전개도 칸이 겹칩니다.");
  const frames = Array(cells.length).fill(null);
  frames[0] = { normal: [0, 0, 1], up: [0, 1, 0], right: [1, 0, 0] };
  const queue = [0];
  const fold = (frame, dx, dy) => {
    if (dx === 1) return { normal: frame.right, up: frame.up, right: oppositeVector(frame.normal) };
    if (dx === -1) return { normal: oppositeVector(frame.right), up: frame.up, right: frame.normal };
    if (dy === -1) return { normal: frame.up, up: oppositeVector(frame.normal), right: frame.right };
    return { normal: oppositeVector(frame.up), up: frame.normal, right: frame.right };
  };
  while (queue.length) {
    const index = queue.shift();
    const [x, y] = cells[index];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1], [0, 1]]) {
      const neighbor = positions.get(`${x + dx},${y + dy}`);
      if (neighbor === undefined) continue;
      const candidate = fold(frames[index], dx, dy);
      if (frames[neighbor]) {
        if (!["normal", "up", "right"].every(key => sameVector(frames[neighbor][key], candidate[key]))) {
          throw new Error("전개도 접힘 방향이 서로 충돌합니다.");
        }
      } else {
        frames[neighbor] = candidate;
        queue.push(neighbor);
      }
    }
  }
  if (frames.some(frame => !frame)) throw new Error("전개도가 연결되어 있지 않습니다.");
  if (new Set(frames.map(frame => vectorKey(frame.normal))).size !== 6) throw new Error("접었을 때 두 면이 겹칩니다.");
  return frames;
}

const netCells = prompt => attr(prompt, "advanced-net").split(";").map(cell => cell.split(".").map(Number));
const netCandidateCells = prompt => attr(prompt, "net-candidates").split(";").filter(Boolean).map(cell => cell.split(".").map(Number));
const oppositePairs = cells => {
  const frames = foldNet(cells);
  const pairs = [];
  frames.forEach((frame, index) => {
    const opposite = frames.findIndex(candidate => sameVector(candidate.normal, oppositeVector(frame.normal)));
    if (opposite < 0) throw new Error("마주 보는 면을 찾지 못했습니다.");
    if (index < opposite) pairs.push([index, opposite]);
  });
  if (pairs.length !== 3) throw new Error(`마주 보는 면 쌍이 ${pairs.length}개입니다.`);
  return pairs;
};

const adjacentNetCandidates = cells => {
  if (cells.length !== 5) throw new Error(`완성 전개도는 다섯 칸이어야 하나 ${cells.length}칸입니다.`);
  const occupied = new Set(cells.map(cell => cell.join(",")));
  const candidates = new Map();
  cells.forEach(([x, y]) => {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const cell = [x + dx, y + dy];
      if (!occupied.has(cell.join(","))) candidates.set(cell.join(","), cell);
    }
  });
  return [...candidates.values()];
};
const netCompletionIndexes = (cells, candidates) => candidates.map((candidate, index) => {
  try { foldNet([...cells, candidate]); return index + 1; } catch { return null; }
}).filter(Boolean);

const parseChoices = prompt => {
  const block = prompt.match(/<div class="equation[^"]*">([\s\S]*?)<\/div>/)?.[1] || "";
  const choices = [];
  for (const match of block.matchAll(/(\d+)\.\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
    choices[Number(match[1]) - 1] = match.slice(2).map(Number);
  }
  return choices;
};

const parseHeightMap = prompt => attr(prompt, "height-map").split(";").map(row => row.split(".").map(Number));
const parsePaths = prompt => attr(prompt, "dice-grid-path").split(";").map(path => [...path]);
const orientationKey = state => [state.top, state.bottom, state.north, state.south, state.east, state.west].join(",");
const roll = (state, move) => {
  const { top, bottom, north, south, east, west } = state;
  if (move === "N") return { top: south, bottom: north, north: top, south: bottom, east, west };
  if (move === "S") return { top: north, bottom: south, north: bottom, south: top, east, west };
  if (move === "E") return { top: west, bottom: east, north, south, east: top, west: bottom };
  if (move === "W") return { top: east, bottom: west, north, south, east: bottom, west: top };
  throw new Error(`알 수 없는 굴림 방향 ${move}`);
};
const rotateAroundVertical = state => ({ top: state.top, bottom: state.bottom, north: state.west, south: state.east, east: state.north, west: state.south });
const allRotations = start => {
  const states = new Map([[orientationKey(start), start]]);
  const queue = [start];
  while (queue.length) {
    const state = queue.shift();
    for (const move of "NSEW") {
      const next = roll(state, move);
      const key = orientationKey(next);
      if (!states.has(key)) { states.set(key, next); queue.push(next); }
    }
  }
  return [...states.values()];
};
const standardStates = (() => {
  const clockwise = { top: 1, bottom: 6, north: 2, south: 5, east: 3, west: 4 };
  const counterclockwise = { top: 1, bottom: 6, north: 2, south: 5, east: 4, west: 3 };
  const states = [...allRotations(clockwise), ...allRotations(counterclockwise)];
  return [...new Map(states.map(state => [orientationKey(state), state])).values()];
})();
if (standardStates.length !== 48) throw new Error(`표준 주사위의 두 거울 배치가 ${standardStates.length}개 상태만 만들었습니다.`);

const runPath = (start, path) => path.reduce((state, move) => roll(state, move), start);
const pathTopSum = (start, path) => {
  let state = start;
  let sum = 0;
  path.forEach(move => { state = roll(state, move); sum += state.top; });
  return sum;
};
const visiblePrompt = prompt => prompt.replace(/<span hidden[\s\S]*?<\/span>/g, "");
const visibleText = prompt => visiblePrompt(prompt).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

function assemblySizes(brick, count) {
  const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const sizes = new Set();
  for (let x = 1; x <= count; x += 1) for (let y = 1; y <= count; y += 1) {
    if (count % (x * y)) continue;
    const z = count / (x * y);
    for (const order of permutations) {
      sizes.add([x * brick[order[0]], y * brick[order[1]], z * brick[order[2]]].sort((a, b) => a - b).join("x"));
    }
  }
  return sizes;
}

function expected(generated) {
  const prompt = generated.prompt;
  const kind = attr(prompt, "cuboid-kind");
  const v = values(prompt);
  if (kind === "grid-cube-count") return v[0] * v[1] * v[2];
  if (kind === "max-cube-cut") {
    const side = gcdAll(v.slice(0, 3));
    const count = v.slice(0, 3).reduce((product, length) => product * (length / side), 1);
    assert(v[3] === side && v[4] === count && v[5] === 12 * side, "최대 정육면체 근거값이 실제 최대공약수와 다릅니다.");
    return `${count}개, ${12 * side}cm`;
  }
  if (kind === "cut-edge-sum-2d") return v[0] * v[1] * 4 * (v[2] + v[3] + v[4]);
  if (kind === "grid-cuboid-types") {
    let count = 0;
    for (let a = 1; a <= v[0]; a += 1) for (let b = a; b <= v[0]; b += 1) for (let c = b; c <= v[0]; c += 1) count += 1;
    assert(v[1] === count, "직육면체 크기 수 근거값이 전수 열거와 다릅니다.");
    return count;
  }
  if (kind === "cuboid-assembly-count") {
    const count = assemblySizes(v.slice(0, 3), v[3]).size;
    assert(v[4] === count, "블록 조립 크기 수 근거값이 전수 열거와 다릅니다.");
    assert(prompt.includes("모두 같은 방향"), "블록 방향을 고정한다는 조건이 없습니다.");
    return count;
  }
  if (kind === "net-paper-fit") {
    const [a, b, c] = v;
    const netWidth = a + 2 * c;
    const netHeight = 2 * (b + c);
    assert(v[3] === netWidth && v[4] === netHeight, "전개도 경계 크기 근거값이 다릅니다.");
    const papers = Array.from({ length: 4 }, (_, index) => v.slice(5 + index * 2, 7 + index * 2));
    const fitting = papers.map(([width, height], index) => (width >= netWidth && height >= netHeight) || (width >= netHeight && height >= netWidth) ? index + 1 : null).filter(Boolean);
    assert(fitting.length > 0, "전개도가 들어가는 종이가 하나도 없습니다.");
    return fitting.join(", ");
  }
  if (kind === "corner-cut-edge-sum") {
    const [width, height, cut] = v;
    assert(width > 2 * cut && height > 2 * cut, "잘라 낸 뒤 상자의 밑면이 남지 않습니다.");
    return 4 * (width - 2 * cut + height - 2 * cut + cut);
  }
  if (kind === "minimum-cuboid-net-paper") return (v[0] + 2 * v[2]) * (2 * (v[1] + v[2]));
  if (kind === "net-waste") return v[3] * v[4] - 2 * (v[0] * v[1] + v[0] * v[2] + v[1] * v[2]);
  if (kind === "cube-net-completion-positions") {
    const cells = netCells(prompt);
    const candidates = netCandidateCells(prompt);
    const expectedCandidates = adjacentNetCandidates(cells);
    const listed = new Set(candidates.map(cell => cell.join(",")));
    assert(candidates.length === listed.size, "번호가 붙은 후보 칸에 중복이 있습니다.");
    assert(listed.size === expectedCandidates.length && expectedCandidates.every(cell => listed.has(cell.join(","))), "변에 맞닿는 후보 칸이 빠지거나 더해졌습니다.");
    const visibleCells = [...cells, ...candidates];
    const columns = Math.max(...visibleCells.map(cell => cell[0])) - Math.min(...visibleCells.map(cell => cell[0])) + 1;
    const rows = Math.max(...visibleCells.map(cell => cell[1])) - Math.min(...visibleCells.map(cell => cell[1])) + 1;
    const cellSize = Math.min(38, 220 / columns, 132 / rows);
    assert(Math.abs(Number(attr(prompt, "net-cell-size")) - cellSize) < 0.01, "전개도 칸 크기 근거값이 실제 배치와 다릅니다.");
    assert(cellSize >= 22, `두 자리 후보 번호를 구별하기에는 칸 크기 ${cellSize.toFixed(1)}가 너무 작습니다.`);
    const indexes = netCompletionIndexes(cells, candidates);
    assert(indexes.length === 4, `정육면체를 완성하는 위치가 ${indexes.length}개입니다.`);
    return indexes.join(", ");
  }
  if (kind === "invalid-vertex-triple") {
    const pairs = oppositePairs(netCells(prompt));
    const faceValues = v.slice(0, 6);
    const pairValues = pairs.map(pair => pair.map(index => faceValues[index]));
    const choices = parseChoices(prompt);
    assert(choices.length === 4 && choices.every(choice => choice?.length === 3), "세 면 보기 4개를 읽을 수 없습니다.");
    assert(new Set(choices.map(choice => [...choice].sort((a, b) => a - b).join(","))).size === 4, "세 면 보기에 중복이 있습니다.");
    const isPossible = choice => pairValues.every(pair => choice.filter(value => pair.includes(value)).length === 1);
    const invalid = choices.map((choice, index) => isPossible(choice) ? null : index + 1).filter(Boolean);
    assert(invalid.length === 1, `만날 수 없는 보기가 ${invalid.length}개입니다.`);
    return invalid[0];
  }
  if (kind === "edge-relation-count") return "3개, 4개";
  if (kind === "vertex-product-rank") {
    const faceValues = v.slice(0, 6);
    const pairs = oppositePairs(netCells(prompt));
    const products = [];
    for (let a = 0; a < 2; a += 1) for (let b = 0; b < 2; b += 1) for (let c = 0; c < 2; c += 1) {
      products.push(faceValues[pairs[0][a]] * faceValues[pairs[1][b]] * faceValues[pairs[2][c]]);
    }
    products.sort((left, right) => left - right);
    return products.at(-2) - products[1];
  }
  if (kind === "opposite-product-max") {
    const faceValues = v.slice(0, 6);
    return Math.max(...oppositePairs(netCells(prompt)).map(pair => faceValues[pair[0]] * faceValues[pair[1]]));
  }
  if (kind === "edge-route-shortest") {
    assert(prompt.includes("모서리만"), "이동 범위를 모서리로 제한하지 않았습니다.");
    return v[0] + v[1] + v[2];
  }
  if (kind === "minimum-cover-box") {
    const heights = parseHeightMap(prompt);
    const width = Math.max(...heights.map(row => row.length));
    const depth = heights.length;
    const height = Math.max(...heights.flat());
    return [width, depth, height].sort((left, right) => right - left).join(", ");
  }
  if (kind === "three-loops") return 4 * (v[0] + v[1] + v[2]);
  if (kind === "max-pack-rotations") {
    const box = v.slice(0, 3);
    const small = v.slice(3, 6);
    const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const counts = permutations.map(order => order.reduce((product, axis, index) => product * Math.floor(box[index] / small[axis]), 1));
    assert(prompt.includes("모두 한 방향"), "작은 직육면체의 공통 방향 조건이 없습니다.");
    return Math.max(...counts);
  }
  if (kind === "stack-height") {
    const [width, stack, knot, rope] = v;
    const height = ((rope - knot) / 2 - width) / stack;
    assert(Number.isInteger(height) && height > 0, "상자 한 개의 높이가 자연수가 아닙니다.");
    assert(attr(prompt, "loop-count") === "1", "한 고리 문제의 그림에 여러 고리가 표시됩니다.");
    assert(prompt.includes("data-stack-loop="), "쌓은 상자 전용 한 고리 그림이 없습니다.");
    assert(!new RegExp(`높이\\s*${height}cm`).test(visibleText(prompt)), "그림이 상자 한 개의 높이를 미리 알려 줍니다.");
    assert(!new RegExp(`높이\\s*${stack * height}cm`).test(visibleText(prompt)), "그림이 쌓은 상자의 전체 높이를 미리 알려 줍니다.");
    return height;
  }
  if (kind === "edges-from-loops") {
    const loops = v.slice(3, 6).sort((left, right) => left - right);
    const shortest = (loops[0] + loops[1] - loops[2]) / 4;
    assert(Number.isInteger(shortest) && shortest > 0, "끈 길이로 구한 모서리가 자연수가 아닙니다.");
    assert(attr(prompt, "loop-count") === "3", "세 방향 끈 그림이 아닙니다.");
    assert(!/(가로|세로|높이)\s*\d+cm/.test(visibleText(prompt)), "그림이 직육면체의 모서리 길이를 미리 알려 줍니다.");
    return shortest;
  }
  if (kind === "dice-labeling-count") return factorial(6) / 24;
  if (kind === "dice-net-missing") {
    const faceValues = v.slice(0, 6);
    const blank = v[6];
    const pairs = oppositePairs(netCells(prompt));
    assert(pairs.every(pair => faceValues[pair[0]] + faceValues[pair[1]] === 7), "전개도의 마주 보는 면 합이 7이 아닙니다.");
    const pair = pairs.find(item => item.includes(blank));
    const opposite = pair.find(index => index !== blank);
    return 7 - faceValues[opposite];
  }
  if (kind === "dice-view-sums") {
    const sums = v.slice(3, 6);
    const candidates = standardStates.filter(state => {
      const views = [state, rotateAroundVertical(state), rotateAroundVertical(rotateAroundVertical(state))];
      return views.every((view, index) => view.top + view.south + view.east === sums[index]);
    });
    assert(candidates.length === 1, `세 방향 합을 만족하는 주사위가 ${candidates.length}개입니다.`);
    assert(prompt.includes("시계 방향"), "주사위를 돌리는 방향이 고정되지 않았습니다.");
    assert(!visiblePrompt(prompt).includes("cuboid-diagram"), "세 방향 합 문제의 그림이 실제 면 수를 노출합니다.");
    return candidates[0].bottom;
  }
  if (kind === "dice-contact-sum") {
    assert(prompt.includes("같은 방향"), "주사위 줄의 놓인 방향 조건이 없습니다.");
    return 7 * (v[0] - 1);
  }
  if (kind === "dice-visible") {
    const touching = v[0];
    assert(!/아랫주사위의 바닥\s*\d/.test(visiblePrompt(prompt)), "그림이 보이지 않는 바닥면 수를 미리 알려 줍니다.");
    return 42 - 2 * touching - (7 - touching);
  }
  if (kind === "dice-roll-top") {
    const start = { top: v[0], bottom: v[1], north: v[2], south: v[3], east: v[4], west: v[5] };
    return runPath(start, parsePaths(prompt)[0]).top;
  }
  if (kind === "dice-opposite-record") {
    const paths = parsePaths(prompt);
    assert(paths.length === 1 && paths[0].join("") === "E", "동쪽 한 칸 굴림 기록이 아닙니다.");
    const start = { top: v[0], bottom: v[1], north: v[2], south: v[3], east: v[4], west: v[5] };
    const end = runPath(start, paths[0]);
    assert(prompt.includes("임의로 적은"), "표준 주사위가 아닌 면 배치라는 조건이 없습니다.");
    assert([...new Set(v.slice(0, 6))].sort((a, b) => a - b).join(",") === "1,2,3,4,5,6", "주사위 면에 1부터 6까지 한 번씩 적히지 않았습니다.");
    assert(end.top === v[6] && end.bottom === v[7], "굴림 기록과 숨은 검산값이 일치하지 않습니다.");
    return end.bottom;
  }
  if (kind === "rolling-bottom-paths") {
    const start = { top: v[0], bottom: v[1], north: v[2], south: v[3], east: v[4], west: v[5] };
    const paths = parsePaths(prompt);
    assert(paths.length === 3 && new Set(paths.map(path => path.join(""))).size === 3, "서로 다른 세 경로가 아닙니다.");
    return paths.reduce((sum, path) => sum + runPath(start, path).bottom, 0);
  }
  if (kind === "dice-path-sum") {
    const start = { top: v[0], bottom: v[1], north: v[2], south: v[3], east: v[4], west: v[5] };
    return pathTopSum(start, parsePaths(prompt)[0]);
  }
  if (kind === "dice-two-paths") {
    const [top, south, sumA, sumB] = v;
    const paths = parsePaths(prompt);
    assert(paths.length === 2, "두 경로를 읽을 수 없습니다.");
    const candidates = standardStates.filter(state => state.top === top && state.south === south && pathTopSum(state, paths[0]) === sumA && pathTopSum(state, paths[1]) === sumB);
    assert(candidates.length === 1, `두 경로 조건을 만족하는 오른쪽 면이 ${candidates.length}개입니다.`);
    return candidates[0].east;
  }
  throw new Error(`알 수 없는 검산 유형 ${kind}입니다.`);
}

const failures = [];
const counts = new Map();
const answerSets = new Map();
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 350; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    assert(generated, "생성 결과가 없습니다.");
    const kind = attr(generated.prompt, "cuboid-kind");
    assert(expectedKinds.get(type.id) === kind, `유형 계약은 ${expectedKinds.get(type.id)}이나 ${kind}가 생성됐습니다.`);
    const answer = expected(generated);
    assert(String(generated.answer) === String(answer), `정답 ${generated.answer}, 독립 검산 ${answer}`);
    assert(generated.prompt.includes("<svg"), "그림이 필요한 직육면체 유형에 SVG가 없습니다.");
    for (const opening of generated.prompt.match(/<svg\b[^>]*>/g) || []) assert(/aria-label="[^"]+"/.test(opening), "SVG 그림 설명이 없습니다.");
    const shown = `${visiblePrompt(generated.prompt)}${generated.solution}`;
    assert(!/NaN|Infinity|undefined/.test(`${shown}${generated.answer}`), "표시할 수 없는 값이 있습니다.");
    assert(!/(순열|조합|제곱근|\*\*)/.test(shown), "초등 과정 밖 표현이 노출됩니다.");
    counts.set(kind, (counts.get(kind) || 0) + 1);
    if (!answerSets.has(kind)) answerSets.set(kind, new Set());
    answerSets.get(kind).add(String(generated.answer));
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

for (const [typeId, kind] of expectedKinds) {
  if ((counts.get(kind) || 0) !== 1050) failures.push(`${typeId}: ${kind} 생성 통과 수가 ${counts.get(kind) || 0}/1050입니다.`);
}
if ((answerSets.get("cube-net-completion-positions")?.size || 0) < 4) failures.push("전개도 완성 위치 정답이 4가지 이상으로 다양하지 않습니다.");

if (failures.length) {
  console.error(`직육면체 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`직육면체 독립 감사 통과: ${types.length}유형, ${types.length * 3 * 350}개 생성, 표준 주사위 48방향 전수 검산, 전개도 위치 정답 ${answerSets.get("cube-net-completion-positions").size}종`);
