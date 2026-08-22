"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u5");
const types = unit.subunits.flatMap(subunit => subunit.types);
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").filter(Boolean).map(Number);
const triples = value => {
  const out = [];
  for (let a = 1; a <= value; a += 1) for (let b = 1; b <= a; b += 1) for (let c = 1; c <= b; c += 1) if (a * b * c === value) out.push([a, b, c]);
  return out;
};
const orientation = (top, front, right) => ({ top, bottom: 7 - top, north: 7 - front, south: front, east: right, west: 7 - right });
const moves = "NSEW";
const roll = (o, code) => {
  const move = moves[code];
  const { top, bottom, north, south, east, west } = o;
  if (move === "N") return { top: south, bottom: north, north: top, south: bottom, east, west };
  if (move === "S") return { top: north, bottom: south, north: bottom, south: top, east, west };
  if (move === "E") return { top: west, bottom: east, north, south, east: top, west: bottom };
  return { top: east, bottom: west, north, south, east: bottom, west: top };
};
const pathSum = (start, path) => {
  let state = start;
  return path.reduce((sum, code) => { state = roll(state, code); return sum + state.top; }, 0);
};

function expected(generated) {
  const kind = attr(generated.prompt, "cuboid-kind");
  const v = values(generated.prompt);
  if (kind === "strip-height") return v[1];
  if (kind === "cube-cut") return v[1] * v[2] * v[3] * (1 + 12 * v[0]);
  if (kind === "cut-edge-sum") return v[0] * 4 * (v[1] + v[2] + v[3]);
  if (kind === "full-cube-cut") return v[0] ** 3;
  if (kind === "joined-edge-sum") return 4 * (v[0] * v[1] + v[2] + v[3]);
  if (kind === "invalid-face") return v[3];
  if (kind === "largest-net") return Math.min(Math.floor(v[0] / 4), Math.floor(v[1] / 3));
  if (kind === "net-paper") return 12 * v[0] ** 2;
  if (kind === "net-waste") return v[0] * v[1] - 6 * v[2] ** 2;
  if (kind === "face-paper-cube") return Math.min(...v);
  if (kind === "opposite-face") return v[[2, 3, 0, 1, 5, 4][v[6]]];
  if (kind === "perpendicular-edges") return 4;
  if (kind === "vertex-face-sum") return v[v[6]] + v[v[7]] + v[v[8]];
  if (kind === "opposite-product") return v[v[6]] * v[[2, 3, 0, 1, 5, 4][v[6]]];
  if (kind === "surface-shortest") return Math.min(Math.hypot(v[0] + v[1], v[2]), Math.hypot(v[0] + v[2], v[1]), Math.hypot(v[1] + v[2], v[0]));
  if (kind === "smallest-box") return triples(v[0]).sort((x, y) => (x[0] * x[1] + x[1] * x[2] + x[2] * x[0]) - (y[0] * y[1] + y[1] * y[2] + y[2] * y[0]))[0].join(", ");
  if (kind === "three-loops") return 4 * v.reduce((a, b) => a + b, 0);
  if (kind === "max-pack") return Math.floor(v[0] / v[3]) * Math.floor(v[1] / v[4]) * Math.floor(v[2] / v[5]);
  if (kind === "stack-height") return (v[2] / 2 - v[0]) / v[1];
  if (kind === "edges-from-loops") return (v[0] + v[1] - v[2]) / 4;
  if (kind === "dice-bottom") return 7 - v[0];
  if (kind === "dice-net-missing") return 7 - v[2];
  if (kind === "dice-bottom-sum" || kind === "rolling-bottom-sum") return v.reduce((sum, n) => sum + 7 - n, 0);
  if (kind === "dice-touching") return 2 * (v[0] - 1) * v[1];
  if (kind === "dice-visible") return 42 - 2 * v[0] - v[1];
  if (kind === "dice-roll-top" || kind === "dice-roll-opposite" || kind === "dice-path-sum") {
    let state = orientation(v[0], v[1], v[2]);
    let sum = 0;
    v.slice(3).forEach(code => { state = roll(state, code); sum += state.top; });
    if (kind === "dice-roll-top") return state.top;
    if (kind === "dice-roll-opposite") return state.bottom;
    return sum;
  }
  if (kind === "dice-two-paths") {
    const [top, front, sumA, sumB] = v;
    const candidates = [1, 2, 3, 4, 5, 6].filter(right => ![top, 7 - top, front, 7 - front].includes(right)).filter(right => {
      const start = orientation(top, front, right);
      return pathSum(start, [2, 0, 2]) === sumA && pathSum(start, [0, 2, 0]) === sumB;
    });
    if (candidates.length !== 1) throw new Error(`두 경로 정답 후보가 ${candidates.length}개입니다: ${candidates.join(",")}`);
    return candidates[0];
  }
  throw new Error(`알 수 없는 검산 유형 ${kind}입니다.`);
}

const visual = new Set(["cube-cut", "cut-edge-sum", "joined-edge-sum", "largest-net", "net-paper", "net-waste", "opposite-face", "vertex-face-sum", "opposite-product", "surface-shortest", "three-loops", "dice-bottom", "dice-net-missing", "dice-roll-top", "dice-roll-opposite", "dice-path-sum"]);
const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 350; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    const kind = attr(generated.prompt, "cuboid-kind");
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (visual.has(kind) && !generated.prompt.includes("<svg")) throw new Error("그림이 필요한 문제에 SVG가 없습니다.");
    if (generated.prompt.includes("<svg") && !/aria-label="[^"]+"/.test(generated.prompt)) throw new Error("그림 설명이 없습니다.");
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값이 있습니다.");
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}
if (failures.length) {
  console.error(`직육면체 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}
console.log(`직육면체 감사 통과: ${types.length}유형, ${count}개 생성`);
