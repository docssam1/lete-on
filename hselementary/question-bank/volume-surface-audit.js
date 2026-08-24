global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    unitId: unit.id,
    unitName: unit.name,
    subunitId: subunit.id,
    subunitName: subunit.name,
  })))))
  .filter(type => type.id.startsWith("6-1-u6-"));

const attribute = (prompt, name) => prompt.match(new RegExp(`${name}="([^"]+)"`))?.[1] || "";
const decimal = (value, places = 3) => Number(Number(value).toFixed(places)).toString();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const ratioText = (a, b) => {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
};
const factorTriples = value => {
  const output = [];
  for (let a = 1; a <= value; a += 1) for (let b = 1; b <= a; b += 1) for (let c = 1; c <= b; c += 1) if (a * b * c === value) output.push([a, b, c]);
  return output;
};
const cellsFromHeights = heights => {
  const cells = [];
  heights.forEach((row, y) => row.forEach((height, x) => {
    for (let z = 0; z < height; z += 1) cells.push([x, y, z]);
  }));
  return cells;
};
const voxelSurface = cells => {
  const occupied = new Set(cells.map(cell => cell.join(",")));
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  return cells.reduce((surface, [x, y, z]) => surface + directions.filter(([dx, dy, dz]) => !occupied.has(`${x + dx},${y + dy},${z + dz}`)).length, 0);
};
const centeredTunnelCells = (size, hole, directionCount) => {
  const directions = ["x", "y", "z"].slice(0, directionCount), start = (size - hole) / 2, cells = [];
  const inBand = value => value >= start && value < start + hole;
  for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (let z = 0; z < size; z += 1) {
    const removed = (directions.includes("x") && inBand(y) && inBand(z))
      || (directions.includes("y") && inBand(x) && inBand(z))
      || (directions.includes("z") && inBand(x) && inBand(y));
    if (!removed) cells.push([x, y, z]);
  }
  return cells;
};
const heightMapValues = values => {
  const rows = values.at(-2), columns = values.at(-1), flat = values.slice(1, -2);
  return Array.from({ length: rows }, (_, row) => flat.slice(row * columns, (row + 1) * columns));
};

function expected(generated) {
  const kind = attribute(generated.prompt, "data-volume-kind");
  const v = attribute(generated.prompt, "data-values").split(",").map(Number);
  if (!kind || v.some(Number.isNaN)) throw new Error("검산 근거가 없음");

  if (kind === "cube-surface-extremes") {
    const minimum = Math.min(...factorTriples(v[0]).map(([a, b, c]) => 2 * (a * b + b * c + c * a)));
    return `${4 * v[0] + 2}cm², ${minimum}cm²`;
  }
  if (kind === "height-map-surface") return voxelSurface(cellsFromHeights(heightMapValues(v))) * v[0] ** 2;
  if (kind === "centered-tunnel-surface") return voxelSurface(centeredTunnelCells(v[0], v[1], v[2]));
  if (kind === "cut-cubes-surface-ratio") {
    const count = v[1] * v[2] * v[3], small = count * 6 * v[0] ** 2;
    const big = 2 * v[0] ** 2 * (v[1] * v[2] + v[2] * v[3] + v[3] * v[1]);
    return ratioText(small, big);
  }
  if (kind === "removed-face-centers") {
    const size = v[0], middle = Math.floor(size / 2);
    const removed = [[middle, middle, size - 1], [middle, middle, 0], [middle, 0, middle], [middle, size - 1, middle], [0, middle, middle], [size - 1, middle, middle]].slice(0, v[1]);
    const removedKeys = new Set(removed.map(cell => cell.join(","))), cells = [];
    for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (let z = 0; z < size; z += 1) if (!removedKeys.has(`${x},${y},${z}`)) cells.push([x, y, z]);
    return voxelSurface(cells);
  }
  if (kind === "partition-surface-ratio") {
    const piece = v.slice(0, 3).map((dimension, index) => dimension / v[index + 3]);
    const pieces = v.slice(3).reduce((total, value) => total * value, 1);
    const totalSurface = pieces * 2 * (piece[0] * piece[1] + piece[1] * piece[2] + piece[2] * piece[0]);
    const original = 2 * (v[0] * v[1] + v[1] * v[2] + v[2] * v[0]);
    return ratioText(totalSurface, original);
  }
  if (kind === "factor-cuboids") return factorTriples(v[0]).length;
  if (kind === "height-map-volume-surface") {
    const cells = cellsFromHeights(heightMapValues(v));
    return `${cells.length * v[0] ** 3}cm³, ${voxelSurface(cells) * v[0] ** 2}cm²`;
  }
  if (kind === "equalized-soil-height") return decimal((v[0] * v[2] + v[1] * v[3]) / (v[0] + v[1]), 2);
  if (kind === "three-loop-volume" || kind === "face-perimeter-volume") {
    const a = (v[0] + v[2] - v[1]) / 4, b = (v[0] + v[1] - v[2]) / 4, c = (v[1] + v[2] - v[0]) / 4;
    return a * b * c;
  }
  if (kind === "eighteen-piece-volume") return v.slice(0, 3).map((value, index) => value * v[index + 3]).reduce((total, value) => total * value, 1);
  if (kind === "notched-surface-volume") {
    const [width, depth, cutWidth, cutHeight, surface] = v;
    const height = (surface + 2 * cutWidth * cutHeight - 2 * width * depth) / (2 * (width + depth));
    return (width * height - cutWidth * cutHeight) * depth;
  }
  if (kind === "joined-cubes-volume-surface") {
    const side = Math.round(Math.cbrt(v[0] / v[1]));
    return v[2] * side ** 2;
  }
  if (kind === "three-face-areas-volume") return Math.round(Math.sqrt(v[0] * v[1] * v[2]));
  if (kind === "painted-pyramid-unpainted") return (6 * v[1] - v[2]) * v[0] ** 2;
  if (kind === "top-front-volume") return v[1] * v[2] / v[0];
  if (kind === "stair-surface-layers") {
    for (let layers = 1; layers <= 30; layers += 1) {
      const surface = voxelSurface(cellsFromHeights([Array.from({ length: layers }, (_, index) => layers - index)])) * v[0] ** 2;
      if (surface === v[1]) return layers;
    }
    throw new Error("층수를 역산하지 못함");
  }
  if (kind === "reoriented-water-height") return decimal(v[0] * v[1] * v[3] / (v[1] * v[2]), 2);
  if (kind === "thick-container-capacity") return decimal((v[0] - 2 * v[3]) * (v[1] - 2 * v[3]) * (v[2] - v[3]) / 1000, 3);
  if (kind === "tilted-spilled-volume") return Math.max(0, v[0] * v[1] * v[2] - v[3] * v[4]);
  if (kind === "submerged-object-height") return v[2] + v[3] / (v[0] * v[1]);
  if (kind === "vertical-rod-height") return decimal(v[0] * v[1] * v[2] / (v[0] * v[1] - v[3] * v[4]), 2);
  if (kind === "partition-final-height") return decimal((v[0] * v[2] + v[1] * v[3]) / (v[0] + v[1]), 2);
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
const answerSets = new Map(types.map(type => [type.id, new Set()]));
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 750; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (difficulty === 0 && seed <= 180) answerSets.get(type.id).add(String(generated.answer));
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}
for (const type of types) if (answerSets.get(type.id).size < 4) failures.push(`${type.id}: 180개 표본의 정답 종류가 ${answerSets.get(type.id).size}개뿐임`);
if (types.length !== 24) failures.push(`부피와 겉넓이 유형 수가 24가 아님: ${types.length}`);

if (failures.length) {
  console.error(`부피와 겉넓이 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 160).join("\n"));
  process.exit(1);
}
console.log(`부피와 겉넓이 감사 통과: ${types.length}유형, ${count}개 생성`);
