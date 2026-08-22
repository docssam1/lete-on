"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2").units.find(item => item.id === "6-2-u3");
const types = unit.subunits.flatMap(subunit => subunit.types);
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);
const heights = (prompt, name = "heights") => attr(prompt, name).split(";").map(row => row.split(".").map(Number));

const cellsFromHeights = map => {
  const cells = [];
  map.forEach((row, y) => row.forEach((height, x) => {
    for (let z = 0; z < height; z += 1) cells.push([x, y, z]);
  }));
  return cells;
};

const projections = map => ({
  top: map.flat().map(value => value > 0 ? 1 : 0),
  front: Array.from({ length: map[0].length }, (_, x) => Math.max(...map.map(row => row[x] || 0))),
  right: map.map(row => Math.max(...row))
});

const projectionTotal = views => Object.values(views).flat().reduce((sum, value) => sum + value, 0);
const sameProjection = (left, right) => ["top", "front", "right"].every(key => left[key].join(",") === right[key].join(","));

const exposedHistogram = cells => {
  const occupied = new Set(cells.map(cell => cell.join(",")));
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const histogram = Array(7).fill(0);
  cells.forEach(([x, y, z]) => {
    histogram[directions.filter(([dx, dy, dz]) => !occupied.has(`${x + dx},${y + dy},${z + dz}`)).length] += 1;
  });
  return histogram;
};

const enumerateMaps = ({ top, front, right, maxHeight, total = null }) => {
  const rows = right.length;
  const columns = front.length;
  const occupied = top.map((value, index) => value ? index : -1).filter(index => index >= 0);
  const map = Array.from({ length: rows }, () => Array(columns).fill(0));
  const output = [];
  const visit = index => {
    if (index === occupied.length) {
      if (total !== null && map.flat().reduce((sum, value) => sum + value, 0) !== total) return;
      const view = projections(map);
      if (view.front.join(",") === front.join(",") && view.right.join(",") === right.join(",")) output.push(map.map(row => [...row]));
      return;
    }
    const position = occupied[index];
    const y = Math.floor(position / columns), x = position % columns;
    for (let height = 1; height <= Math.min(maxHeight, front[x], right[y]); height += 1) {
      map[y][x] = height;
      visit(index + 1);
    }
    map[y][x] = 0;
  };
  visit(0);
  return output;
};

const boundedCompositions = (parts, total, maximum) => {
  const visit = (count, sum) => {
    if (!count) return sum === 0 ? 1 : 0;
    let answer = 0;
    for (let value = 1; value <= maximum; value += 1) answer += visit(count - 1, sum - value);
    return answer;
  };
  return visit(parts, total);
};

const rotationTransforms = (() => {
  const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const even = permutation => ["012", "120", "201"].includes(permutation.join(""));
  const output = [];
  permutations.forEach(permutation => [-1, 1].forEach(a => [-1, 1].forEach(b => [-1, 1].forEach(c => {
    if ((even(permutation) ? 1 : -1) * a * b * c === 1) output.push(point => [a * point[permutation[0]], b * point[permutation[1]], c * point[permutation[2]]]);
  }))));
  return output;
})();

const normalized = cells => {
  const minima = [0, 1, 2].map(axis => Math.min(...cells.map(cell => cell[axis])));
  return cells.map(cell => cell.map((value, axis) => value - minima[axis]).join(",")).sort().join(";");
};
const canonical = cells => rotationTransforms.map(transform => normalized(cells.map(transform))).sort()[0];
const addOneCount = base => {
  const occupied = new Set(base.map(cell => cell.join(",")));
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const shapes = new Set();
  base.forEach(([x, y, z]) => directions.forEach(([dx, dy, dz]) => {
    const next = [x + dx, y + dy, z + dz];
    if (!occupied.has(next.join(","))) shapes.add(canonical([...base, next]));
  }));
  return shapes.size;
};

function expected(generated) {
  const prompt = generated.prompt;
  const kind = attr(prompt, "space-kind");
  const v = values(prompt);
  if (kind === "projection-area-sum") {
    const view = projections(heights(prompt));
    return String(view.front.reduce((a, b) => a + b, 0) + view.right.reduce((a, b) => a + b, 0));
  }
  if (kind === "projection-safe-removal") {
    const map = heights(prompt), original = projections(map);
    let count = 0;
    map.forEach((row, y) => row.forEach((height, x) => {
      if (!height) return;
      const changed = map.map(line => [...line]);
      changed[y][x] -= 1;
      if (sameProjection(original, projections(changed))) count += 1;
    }));
    return String(count);
  }
  if (["projection-candidate-count", "stack-method-count"].includes(kind)) {
    const top = attr(prompt, "top").split(".").map(Number);
    const front = attr(prompt, "front").split(".").map(Number);
    const right = attr(prompt, "right").split(".").map(Number);
    return String(enumerateMaps({ top, front, right, maxHeight: v[0] }).length);
  }
  if (kind === "height-map-surface") return `${exposedHistogram(cellsFromHeights(heights(prompt))).reduce((sum, count, faces) => sum + count * faces, 0)}cm²`;
  if (kind === "projection-removal-change") {
    const map = heights(prompt), before = projectionTotal(projections(map));
    map[v[0]][v[1]] -= 1;
    return String(before - projectionTotal(projections(map)));
  }
  if (kind === "layer-color-count") return String(heights(prompt).flat().reduce((sum, height) => sum + Math.ceil(height / 2), 0));
  if (kind === "hollow-cube-count") return String(v[0] ** 3 - (v[0] - 2) ** 3);
  if (kind === "projection-min-max") {
    const top = attr(prompt, "top").split(".").map(Number);
    const front = attr(prompt, "front").split(".").map(Number);
    const right = attr(prompt, "right").split(".").map(Number);
    const totals = enumerateMaps({ top, front, right, maxHeight: v[0] }).map(map => map.flat().reduce((sum, value) => sum + value, 0));
    return `${Math.min(...totals)}, ${Math.max(...totals)}`;
  }
  if (kind === "tunnel-count-surface") {
    const [size, directionCount] = v;
    const directions = directionCount === 1 ? ["y"] : directionCount === 2 ? ["x", "y"] : ["x", "y", "z"];
    const center = (size - 1) / 2;
    const cells = [];
    for (let x = 0; x < size; x += 1) for (let y = 0; y < size; y += 1) for (let z = 0; z < size; z += 1) {
      const removed = (directions.includes("x") && y === center && z === center)
        || (directions.includes("y") && x === center && z === center)
        || (directions.includes("z") && x === center && y === center);
      if (!removed) cells.push([x, y, z]);
    }
    const surface = exposedHistogram(cells).reduce((sum, count, faces) => sum + count * faces, 0);
    return `${cells.length}개, ${surface}cm²`;
  }
  if (kind === "hidden-interior-count") return String(exposedHistogram(cellsFromHeights(heights(prompt)))[0]);
  if (kind === "footprint-total-methods") return String(boundedCompositions(v[0], v[1], v[2]));
  if (kind === "painted-solid-interior") return String((v[0] - 2) ** 3);
  if (["painted-height-histogram", "painted-layer-histogram", "painted-composite-histogram"].includes(kind)) return String(exposedHistogram(cellsFromHeights(heights(prompt)))[v[0]]);
  if (kind === "painted-height-area") {
    const faces = exposedHistogram(cellsFromHeights(heights(prompt))).reduce((sum, count, faceCount) => sum + count * faceCount, 0);
    return `${faces * v[0] ** 2}cm²`;
  }
  if (kind === "painted-cuboid-two-faces") return String(4 * ((v[0] - 2) + (v[1] - 2) + (v[2] - 2)));
  if (kind === "single-layer-cut") return String(v[0] * v[1]);
  if (kind === "triple-center-cut") return String(3 * v[0] ** 2 - 3 * v[0] + 1);
  if (kind === "parallel-layer-cuts") return String(v[3] * v[1] * v[2]);
  if (kind === "add-one-polycube") return String(addOneCount(attr(prompt, "base-cells").split(";").map(cell => cell.split(".").map(Number))));
  if (kind === "parity-removal") {
    let removed = 0;
    for (let x = 0; x < v[0]; x += 1) for (let y = 0; y < v[1]; y += 1) for (let z = 0; z < v[2]; z += 1) if ((x + y + z) % 2 === 0) removed += 1;
    return String(v[0] * v[1] * v[2] - removed);
  }
  if (kind === "remove-then-front") return String(projections(heights(prompt, "heights-after")).front.reduce((sum, value) => sum + value, 0));
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (generated.answer !== answer) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (!generated.solution.includes(generated.answer)) throw new Error("풀이에 정답 근거가 없음");
    if (!/aria-label=|class="problem-table"/.test(generated.prompt)) throw new Error("그림 또는 표에 읽기 단서가 없음");
    if (/projection-candidate-count|stack-method-count|projection-min-max/.test(attr(generated.prompt, "space-kind")) && values(generated.prompt).at(-1) < 1) throw new Error("가능한 쌓기가 없음");
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`6-2 공간과 입체 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 공간과 입체 감사 통과: ${types.length}유형, ${count}개 생성`);
