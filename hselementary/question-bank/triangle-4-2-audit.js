"use strict";

// Independent answer and source-publication audit for the reviewed 4-2 triangle types.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2").units.find(item => item.id === "4-2-u2");
const sourceTypes = unit.subunits.flatMap(subunit => subunit.types).filter(type => type.sourceItemId?.startsWith("4-2-triangle-"));
const types = sourceTypes.filter(type => type.generatorKey && !type.reviewLocked);
const locked = sourceTypes.filter(type => type.reviewLocked);
const publicSourceIds = new Set([
  "4-2-triangle-1-mission-1",
  "4-2-triangle-1-mission-2",
  "4-2-triangle-1-mission-3",
  "4-2-triangle-1-mission-4",
  "4-2-triangle-1-mission-5",
  "4-2-triangle-1-mission-6",
  "4-2-triangle-4-mission-1"
]);
const failures = [];
const seenKinds = new Set();
const check = (condition, message) => { if (!condition) failures.push(message); };
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const pointKind = (first, second, third) => {
  const cross = (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  if (cross === 0) return "line";
  const squared = [[first, second], [second, third], [third, first]].map(([a, b]) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2).sort((a, b) => a - b);
  if (squared[0] + squared[1] === squared[2]) return "right";
  return squared[0] + squared[1] > squared[2] ? "acute" : "obtuse";
};
const pointCounts = (points, requiredIndex = -1) => {
  const totals = { acute: 0, right: 0, obtuse: 0 };
  for (let a = 0; a < points.length - 2; a += 1) for (let b = a + 1; b < points.length - 1; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    if (requiredIndex >= 0 && ![a, b, c].includes(requiredIndex)) continue;
    const kind = pointKind(points[a], points[b], points[c]);
    if (kind !== "line") totals[kind] += 1;
  }
  return totals;
};
const squareDiagonalGridTriangleCount = sideCells => {
  const points = [];
  const pointIndex = new Map();
  const addPoint = (x, y) => {
    const key = `${x},${y}`;
    if (!pointIndex.has(key)) {
      pointIndex.set(key, points.length);
      points.push([x, y]);
    }
    return pointIndex.get(key);
  };
  for (let y = 0; y <= sideCells * 2; y += 2) for (let x = 0; x <= sideCells * 2; x += 2) addPoint(x, y);
  for (let y = 1; y < sideCells * 2; y += 2) for (let x = 1; x < sideCells * 2; x += 2) addPoint(x, y);
  const edges = [];
  const addEdge = (first, second) => edges.push([pointIndex.get(first.join(",")), pointIndex.get(second.join(","))]);
  for (let y = 0; y <= sideCells * 2; y += 2) for (let x = 0; x < sideCells * 2; x += 2) addEdge([x, y], [x + 2, y]);
  for (let x = 0; x <= sideCells * 2; x += 2) for (let y = 0; y < sideCells * 2; y += 2) addEdge([x, y], [x, y + 2]);
  for (let centerY = 1; centerY < sideCells * 2; centerY += 2) for (let centerX = 1; centerX < sideCells * 2; centerX += 2) {
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) addEdge([centerX, centerY], [centerX + dx, centerY + dy]);
  }
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const between = (first, second, point) => point[0] >= Math.min(first[0], second[0]) && point[0] <= Math.max(first[0], second[0]) && point[1] >= Math.min(first[1], second[1]) && point[1] <= Math.max(first[1], second[1]);
  const sideCovered = (firstIndex, secondIndex) => {
    const first = points[firstIndex];
    const second = points[secondIndex];
    const adjacency = new Map();
    for (const [a, b] of edges) {
      if (cross(first, second, points[a]) !== 0 || cross(first, second, points[b]) !== 0 || !between(first, second, points[a]) || !between(first, second, points[b])) continue;
      if (!adjacency.has(a)) adjacency.set(a, []);
      if (!adjacency.has(b)) adjacency.set(b, []);
      adjacency.get(a).push(b);
      adjacency.get(b).push(a);
    }
    const visited = new Set([firstIndex]);
    const queue = [firstIndex];
    while (queue.length) {
      const current = queue.shift();
      if (current === secondIndex) return true;
      for (const next of adjacency.get(current) || []) if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
    return false;
  };
  let count = 0;
  for (let a = 0; a < points.length - 2; a += 1) for (let b = a + 1; b < points.length - 1; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    if (cross(points[a], points[b], points[c]) !== 0 && sideCovered(a, b) && sideCovered(b, c) && sideCovered(c, a)) count += 1;
  }
  return count;
};
const markedTriangleLatticeCount = (side, cellKind, row, column) => {
  const points = [];
  const pointIndex = new Map();
  for (let r = 0; r <= side; r += 1) for (let c = 0; c <= r; c += 1) {
    pointIndex.set(`${r},${c}`, points.length);
    points.push([c - r / 2, r * Math.sqrt(3) / 2]);
  }
  const index = (r, c) => pointIndex.get(`${r},${c}`);
  const edges = [];
  for (let r = 0; r < side; r += 1) for (let c = 0; c <= r; c += 1) edges.push([index(r, c), index(r + 1, c)], [index(r, c), index(r + 1, c + 1)]);
  for (let r = 1; r <= side; r += 1) for (let c = 0; c < r; c += 1) edges.push([index(r, c), index(r, c + 1)]);
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const between = (first, second, point) => point[0] >= Math.min(first[0], second[0]) - 1e-9 && point[0] <= Math.max(first[0], second[0]) + 1e-9 && point[1] >= Math.min(first[1], second[1]) - 1e-9 && point[1] <= Math.max(first[1], second[1]) + 1e-9;
  const sideCovered = (firstIndex, secondIndex) => {
    const first = points[firstIndex];
    const second = points[secondIndex];
    const adjacency = new Map();
    for (const [a, b] of edges) {
      if (Math.abs(cross(first, second, points[a])) > 1e-9 || Math.abs(cross(first, second, points[b])) > 1e-9 || !between(first, second, points[a]) || !between(first, second, points[b])) continue;
      if (!adjacency.has(a)) adjacency.set(a, []);
      if (!adjacency.has(b)) adjacency.set(b, []);
      adjacency.get(a).push(b);
      adjacency.get(b).push(a);
    }
    const visited = new Set([firstIndex]);
    const queue = [firstIndex];
    while (queue.length) {
      const current = queue.shift();
      if (current === secondIndex) return true;
      for (const next of adjacency.get(current) || []) if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
    return false;
  };
  const triangles = [];
  for (let a = 0; a < points.length - 2; a += 1) for (let b = a + 1; b < points.length - 1; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    if (Math.abs(cross(points[a], points[b], points[c])) > 1e-9 && sideCovered(a, b) && sideCovered(b, c) && sideCovered(c, a)) triangles.push([a, b, c]);
  }
  const cellVertices = cellKind === "up"
    ? [index(row - 1, column), index(row, column), index(row, column + 1)]
    : [index(row - 1, column), index(row - 1, column + 1), index(row, column + 1)];
  const marked = [cellVertices.reduce((sum, item) => sum + points[item][0], 0) / 3, cellVertices.reduce((sum, item) => sum + points[item][1], 0) / 3];
  const strictlyInside = triangle => {
    const signs = [cross(points[triangle[0]], points[triangle[1]], marked), cross(points[triangle[1]], points[triangle[2]], marked), cross(points[triangle[2]], points[triangle[0]], marked)];
    return signs.every(value => value > 1e-9) || signs.every(value => value < -1e-9);
  };
  return triangles.filter(strictlyInside).length;
};
const joinedFansTriangleCount = (lowerPointCount, upperPointCount) => {
  const points = [
    { x: 0, y: 0, groups: new Set(["base", "left", "ray"]) },
    { x: 4, y: 6, groups: new Set(["right", "left", "ray"]) },
    { x: 10, y: 0, groups: new Set(["base", "right", "ray"]) },
    { x: 2, y: 3, groups: new Set(["left", "ray"]) }
  ];
  const sharedIndex = 3;
  for (let index = 1; index < lowerPointCount - 1; index += 1) points.push({ x: 10 * index / (lowerPointCount - 1), y: 0, groups: new Set(["base", "ray"]) });
  for (let index = 1; index < upperPointCount - 1; index += 1) points.push({ x: 4 + 6 * index / (upperPointCount - 1), y: 6 - 6 * index / (upperPointCount - 1), groups: new Set(["right", "ray"]) });
  const cross = (first, second, third) => (second.x - first.x) * (third.y - first.y) - (second.y - first.y) * (third.x - first.x);
  const connected = (firstIndex, secondIndex) => {
    const first = points[firstIndex];
    const second = points[secondIndex];
    if ([...first.groups].some(group => second.groups.has(group) && group !== "ray")) return true;
    return firstIndex === sharedIndex && second.groups.has("ray") || secondIndex === sharedIndex && first.groups.has("ray");
  };
  let count = 0;
  for (let a = 0; a < points.length - 2; a += 1) for (let b = a + 1; b < points.length - 1; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    if (Math.abs(cross(points[a], points[b], points[c])) > 1e-9 && connected(a, b) && connected(b, c) && connected(c, a)) count += 1;
  }
  return count;
};
check(joinedFansTriangleCount(6, 7) === 37, "Mission 4 원문 고정 구조의 삼각형 수는 37개여야 합니다.");
const crossingSegmentTriangleCount = (templateIndex, level) => {
  const templates = [
    { top: [210, 18], right: [236, 150], upperLeft: [72, 58], ratio: 0.64 },
    { top: [202, 22], right: [236, 150], upperLeft: [64, 50], ratio: 0.61 },
    { top: [216, 24], right: [238, 150], upperLeft: [86, 50], ratio: 0.66 }
  ];
  const source = templates[templateIndex];
  const left = [18, 150];
  const upperMiddle = [left[0] + (source.top[0] - left[0]) * source.ratio, left[1] + (source.top[1] - left[1]) * source.ratio];
  const points = [left, source.top, source.right, [upperMiddle[0], 150], source.upperLeft, upperMiddle];
  const segments = [[0, 2], [0, 1], [1, 3], [4, 3], [4, 2], [5, 2], ...(level >= 0 ? [[5, 3]] : []), ...(level > 0 ? [[4, 1]] : [])];
  const epsilon = 1e-7;
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const within = (point, first, second) => point[0] >= Math.min(first[0], second[0]) - epsilon && point[0] <= Math.max(first[0], second[0]) + epsilon && point[1] >= Math.min(first[1], second[1]) - epsilon && point[1] <= Math.max(first[1], second[1]) + epsilon;
  const vertices = points.map(point => [...point]);
  const add = point => { if (!vertices.some(existing => Math.hypot(existing[0] - point[0], existing[1] - point[1]) < epsilon)) vertices.push(point); };
  for (let first = 0; first < segments.length - 1; first += 1) for (let second = first + 1; second < segments.length; second += 1) {
    const [a, b] = segments[first].map(index => points[index]);
    const [c, d] = segments[second].map(index => points[index]);
    const denominator = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    if (Math.abs(denominator) < epsilon) continue;
    const ab = a[0] * b[1] - a[1] * b[0];
    const cd = c[0] * d[1] - c[1] * d[0];
    const point = [(ab * (c[0] - d[0]) - (a[0] - b[0]) * cd) / denominator, (ab * (c[1] - d[1]) - (a[1] - b[1]) * cd) / denominator];
    if (within(point, a, b) && within(point, c, d)) add(point);
  }
  const edge = (first, second) => segments.some(segment => {
    const [start, end] = segment.map(index => points[index]);
    return Math.abs(cross(start, end, first)) < epsilon && Math.abs(cross(start, end, second)) < epsilon && within(first, start, end) && within(second, start, end);
  });
  let count = 0;
  for (let first = 0; first < vertices.length - 2; first += 1) for (let second = first + 1; second < vertices.length - 1; second += 1) for (let third = second + 1; third < vertices.length; third += 1) {
    if (Math.abs(cross(vertices[first], vertices[second], vertices[third])) > epsilon && edge(vertices[first], vertices[second]) && edge(vertices[second], vertices[third]) && edge(vertices[third], vertices[first])) count += 1;
  }
  return count;
};
check(crossingSegmentTriangleCount(0, -1) === 14, "Mission 5 쉬움 구조의 삼각형 수는 14개여야 합니다.");
check(crossingSegmentTriangleCount(0, 0) === 24, "Mission 5 원문 고정 구조의 삼각형 수는 24개여야 합니다.");
check(crossingSegmentTriangleCount(0, 1) === 28, "Mission 5 어려움 구조의 삼각형 수는 28개여야 합니다.");
const answerFor = (kind, values) => {
  if (kind === "fan-count" || kind === "dot-fan-count") return String(values[0] * (values[0] + 1) / 2);
  if (kind === "square-diagonal-grid-count") return String(squareDiagonalGridTriangleCount(values[0]));
  if (kind === "marked-triangle-lattice-count") return String(markedTriangleLatticeCount(values[0], values[1], values[2], values[3]));
  if (kind === "joined-fans-count") return String(joinedFansTriangleCount(values[0], values[1]));
  if (kind === "crossing-segment-count") return String(crossingSegmentTriangleCount(values[0], values[1]));
  if (kind === "crossed-fans-count") return String((values[0] - 1) ** 3);
  if (kind === "lattice-count") return String(Math.floor(values[0] * (values[0] + 2) * (2 * values[0] + 1) / 8));
  if (kind === "marked-fan-count") return String(values[0]);
  if (kind === "double-fan-count") return String(values[0] * (values[0] + 1) / 2 + values[1] * (values[1] + 1) / 2);
  if (kind === "angle-card-count") {
    const totals = { acute: 0, right: 0, obtuse: 0 };
    values.forEach(angles => {
      const largest = Math.max(...angles);
      totals[largest < 90 ? "acute" : largest === 90 ? "right" : "obtuse"] += 1;
    });
    return `${totals.acute}, ${totals.right}, ${totals.obtuse}`;
  }
  if (["star-angle-count", "grid-obtuse-count", "grid-angle-difference", "required-point-obtuse"].includes(kind)) {
    const [points, requiredIndex, mode] = values;
    const totals = pointCounts(points, requiredIndex);
    if (mode === "acute-obtuse") return `${totals.acute}, ${totals.obtuse}`;
    if (mode === "acute-obtuse-difference") return String(Math.abs(totals.acute - totals.obtuse));
    return String(totals[mode]);
  }
  if (kind === "obtuse-angle-pairs") {
    let count = 0;
    for (let first = 0; first < values.length - 1; first += 1) for (let second = first + 1; second < values.length; second += 1) if (values[first] + values[second] < 90) count += 1;
    return String(count);
  }
  if (kind === "isosceles-diamond-perimeter") return String(2 * values[0] + 2 * values[1]);
  if (kind === "isosceles-split-angle") return String(values[0] - (180 - values[0]) / 2);
  if (kind === "isosceles-chain-perimeter") return String(2 * values[1] + values[0] * values[2]);
  if (kind === "isosceles-rotation-angle") return String(values[0]);
  if (kind === "isosceles-fold-angle") return String((180 - values[0]) / 4);
  if (kind === "circle-isosceles-shapes") {
    const count = values[0];
    const signatures = new Set();
    for (let a = 0; a < count - 2; a += 1) for (let b = a + 1; b < count - 1; b += 1) for (let c = b + 1; c < count; c += 1) {
      const steps = [[a, b], [b, c], [c, a]].map(([first, second]) => Math.min(Math.abs(first - second), count - Math.abs(first - second))).sort((x, y) => x - y);
      if (steps[0] === steps[1] || steps[1] === steps[2]) signatures.add(steps.join("-"));
    }
    return String(signatures.size);
  }
  if (kind === "equilateral-chain-perimeter") return String((values[1] + 2) * values[0]);
  if (kind === "square-equilateral-angle") return String(values[0] + values[1]);
  if (kind === "overlap-equilateral-angle") return String(180 - 60 - values[0]);
  if (kind === "equilateral-right-length") return String(values[0] / 3 / 2);
  if (kind === "equilateral-chain-side") return String(values[1] / (values[0] + 2));
  if (kind === "thirty-sixty-segment") return String(values[0] * 2 - values[1]);
  return null;
};

let generatedCount = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 400; seed += 1) {
  const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
  let generated;
  try {
    generated = api.generate(type, 0, difficulty, seed, type.variant);
  } catch (error) {
    failures.push(`${context}: ${error.message}`);
    continue;
  }
  check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), `${context}: 문제·정답·풀이가 비어 있습니다.`);
  check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 깨진 계산값이 있습니다.`);
  const tag = generated.prompt.match(/<span hidden data-triangle42-kind="[^"]+"[^>]*>/)?.[0];
  check(Boolean(tag), `${context}: 독립 검산 데이터가 없습니다.`);
  if (!tag) continue;
  const kind = attribute(tag, "data-triangle42-kind");
  const values = JSON.parse(decodeURIComponent(attribute(tag, "data-triangle42-values")));
  const declared = decodeURIComponent(attribute(tag, "data-triangle42-expected"));
  const independent = answerFor(kind, values);
  seenKinds.add(kind);
  check(independent !== null, `${context}: 알 수 없는 검산 유형 ${kind}입니다.`);
  check(String(independent) === declared, `${context}: 선언 정답 ${declared}과 독립 계산 ${independent}이 다릅니다.`);
  check(String(generated.answer) === declared, `${context}: 표시 정답 ${generated.answer}과 선언 정답 ${declared}이 다릅니다.`);
  if (/count|point|circle|diamond|split|chain|angle|length|segment/.test(kind)) check(/<svg\b/.test(generated.prompt) || kind === "angle-card-count" || kind === "obtuse-angle-pairs", `${context}: 도형 정보가 필요한데 SVG가 없습니다.`);
  generatedCount += 1;
}

check(sourceTypes.length === 44, `원문 문항 연결 수가 44개가 아닙니다: ${sourceTypes.length}`);
check(types.length === 7, `원문 일치 공개 유형 수가 7개가 아닙니다: ${types.length}`);
check(locked.length === 37, `검수 대기 유형 수가 37개가 아닙니다: ${locked.length}`);
check(seenKinds.size === 7, `공개 검산 구조 수가 7개가 아닙니다: ${seenKinds.size}`);
check(types.every(type => publicSourceIds.has(type.sourceItemId)), "공개 허용 목록에 없는 삼각형 유형이 열려 있습니다.");
check([...publicSourceIds].every(sourceItemId => types.some(type => type.sourceItemId === sourceItemId)), "원문 일치 공개 유형이 빠졌습니다.");
if (failures.length) {
  console.error(`4-2 삼각형 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`4-2 삼각형 원문 일치 공개 감사 통과: ${types.length}유형, 검수 대기 ${locked.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종`);
