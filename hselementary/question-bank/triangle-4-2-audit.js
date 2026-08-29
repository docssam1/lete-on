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
  "4-2-triangle-1-exploration",
  "4-2-triangle-1-mission-1",
  "4-2-triangle-1-mission-2",
  "4-2-triangle-1-mission-3",
  "4-2-triangle-1-mission-4",
  "4-2-triangle-1-mission-5",
  "4-2-triangle-1-mission-6",
  "4-2-triangle-1-example-2",
  "4-2-triangle-1-example-3",
  "4-2-triangle-2-exploration",
  "4-2-triangle-2-mission-2",
  "4-2-triangle-2-mission-3",
  "4-2-triangle-2-mission-4",
  "4-2-triangle-2-mission-5",
  "4-2-triangle-2-example-2",
  "4-2-triangle-2-example-4",
  "4-2-triangle-3-mission-1",
  "4-2-triangle-3-mission-3",
  "4-2-triangle-3-example-2",
  "4-2-triangle-4-mission-1",
  "4-2-triangle-4-mission-2",
  "4-2-triangle-4-mission-3",
  "4-2-triangle-4-mission-4",
  "4-2-triangle-4-mission-5",
  "4-2-triangle-4-mission-6",
  "4-2-triangle-4-exploration",
  "4-2-triangle-4-example-1",
  "4-2-triangle-4-example-2",
  "4-2-triangle-4-example-3",
  "4-2-triangle-4-example-4"
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
const matchstickPointKey = point => point.join(",");
const matchstickParsePoint = value => value.split(",").map(Number);
const matchstickEdgeKey = (first, second) => {
  const a = matchstickPointKey(first);
  const b = matchstickPointKey(second);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
};
const matchstickDirections = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
const matchstickRing = matchstickDirections.map(direction => direction);
const matchstickInitialEdges = new Set();
matchstickRing.forEach(point => matchstickInitialEdges.add(matchstickEdgeKey([0, 0], point)));
matchstickRing.forEach((point, index) => matchstickInitialEdges.add(matchstickEdgeKey(point, matchstickRing[(index + 1) % matchstickRing.length])));
const matchstickRotate = (point, times) => {
  let [x, y] = point;
  for (let index = 0; index < times; index += 1) [x, y] = [-y, x + y];
  return [x, y];
};
const matchstickReflect = ([x, y]) => [x + y, -y];
const matchstickCanonical = edges => {
  const decoded = [...edges].map(edge => edge.split("|").map(matchstickParsePoint));
  const forms = [];
  for (let reflected = 0; reflected < 2; reflected += 1) for (let turn = 0; turn < 6; turn += 1) {
    const transformed = decoded.map(([first, second]) => [
      matchstickRotate(reflected ? matchstickReflect(first) : first, turn),
      matchstickRotate(reflected ? matchstickReflect(second) : second, turn)
    ]);
    const points = transformed.flat();
    const minX = Math.min(...points.map(point => point[0]));
    const minY = Math.min(...points.map(point => point[1]));
    forms.push(transformed.map(([first, second]) => matchstickEdgeKey(
      [first[0] - minX, first[1] - minY],
      [second[0] - minX, second[1] - minY]
    )).sort().join(";"));
  }
  return forms.sort()[0];
};
const matchstickConnected = edges => {
  const adjacent = new Map();
  for (const edge of edges) {
    const [first, second] = edge.split("|");
    if (!adjacent.has(first)) adjacent.set(first, new Set());
    if (!adjacent.has(second)) adjacent.set(second, new Set());
    adjacent.get(first).add(second);
    adjacent.get(second).add(first);
  }
  const start = adjacent.keys().next().value;
  const seen = new Set([start]);
  const pending = [start];
  while (pending.length) for (const next of adjacent.get(pending.pop())) if (!seen.has(next)) {
    seen.add(next);
    pending.push(next);
  }
  return seen.size === adjacent.size;
};
const enumerateMatchstickShapes = radius => {
  const candidateEdges = new Set();
  for (let x = -radius; x <= radius; x += 1) for (let y = -radius; y <= radius; y += 1) {
    for (const [dx, dy] of matchstickDirections.slice(0, 3)) {
      const next = [x + dx, y + dy];
      if (Math.abs(next[0]) <= radius && Math.abs(next[1]) <= radius) candidateEdges.add(matchstickEdgeKey([x, y], next));
    }
  }
  const additions = [...candidateEdges].filter(edge => !matchstickInitialEdges.has(edge));
  const triangles = [];
  for (let x = -radius; x <= radius; x += 1) for (let y = -radius; y <= radius; y += 1) {
    const shapes = [
      [[x, y], [x + 1, y], [x, y + 1]],
      [[x + 1, y], [x, y + 1], [x + 1, y + 1]]
    ];
    for (const points of shapes) if (points.every(point => Math.abs(point[0]) <= radius && Math.abs(point[1]) <= radius)) {
      triangles.push(points.map((point, index) => matchstickEdgeKey(point, points[(index + 1) % 3])));
    }
  }
  const initial = [...matchstickInitialEdges];
  const classes = new Map();
  let rawCount = 0;
  for (let firstRemoved = 0; firstRemoved < initial.length - 1; firstRemoved += 1) for (let secondRemoved = firstRemoved + 1; secondRemoved < initial.length; secondRemoved += 1) {
    const remaining = new Set(initial);
    remaining.delete(initial[firstRemoved]);
    remaining.delete(initial[secondRemoved]);
    for (let firstAdded = 0; firstAdded < additions.length - 1; firstAdded += 1) for (let secondAdded = firstAdded + 1; secondAdded < additions.length; secondAdded += 1) {
      const finalEdges = new Set(remaining);
      finalEdges.add(additions[firstAdded]);
      finalEdges.add(additions[secondAdded]);
      if (finalEdges.size !== 12) continue;
      const madeTriangles = triangles.filter(triangle => triangle.every(edge => finalEdges.has(edge)));
      if (madeTriangles.length !== 5) continue;
      const usedEdges = new Set(madeTriangles.flat());
      if ([...finalEdges].some(edge => !usedEdges.has(edge))) continue;
      rawCount += 1;
      const canonical = matchstickCanonical(finalEdges);
      if (!classes.has(canonical)) classes.set(canonical, matchstickConnected(finalEdges));
    }
  }
  return { rawCount, classes: classes.size, connectedClasses: [...classes.values()].filter(Boolean).length };
};
const matchstickAudits = [2, 3, 4].map(enumerateMatchstickShapes);
matchstickAudits.forEach((audit, index) => {
  check(audit.rawCount === 48, `성냥개비 탐색 반경 ${index + 2}의 유효 배치는 48개여야 합니다.`);
  check(audit.classes === 5, `성냥개비 탐색 반경 ${index + 2}의 서로 다른 모양은 5개여야 합니다.`);
  check(audit.connectedClasses === 5, `성냥개비 탐색 반경 ${index + 2}의 다섯 모양은 모두 연결되어야 합니다.`);
});
const obtuseDotShapeClassCount = (columns, rows) => {
  const points = Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => [column, row])).flat();
  const signatures = new Set();
  for (let first = 0; first < points.length - 2; first += 1) for (let second = first + 1; second < points.length - 1; second += 1) for (let third = second + 1; third < points.length; third += 1) {
    if (pointKind(points[first], points[second], points[third]) !== "obtuse") continue;
    const squaredSides = [[first, second], [second, third], [third, first]]
      .map(([a, b]) => (points[a][0] - points[b][0]) ** 2 + (points[a][1] - points[b][1]) ** 2)
      .sort((a, b) => a - b);
    signatures.add(squaredSides.join("-"));
  }
  return signatures.size;
};
check(obtuseDotShapeClassCount(4, 3) === 9, "개념탐구 2의 4×3 점판에는 서로 다른 둔각삼각형이 9가지여야 합니다.");
check(obtuseDotShapeClassCount(3, 4) === 9, "개념탐구 2의 회전한 점판에도 서로 다른 둔각삼각형이 9가지여야 합니다.");
const obtuseAnglePairCount = angles => {
  let count = 0;
  for (let first = 0; first < angles.length - 1; first += 1) for (let second = first + 1; second < angles.length; second += 1) {
    const sum = angles[first] + angles[second];
    if (sum < 180 && (angles[first] > 90 || angles[second] > 90 || sum < 90)) count += 1;
  }
  return count;
};
check(obtuseAnglePairCount([15, 25, 45, 65, 95, 145]) === 10, "예제 2-4 원문 여섯 각에서 둔각삼각형을 만드는 방법은 10가지여야 합니다.");
check(obtuseAnglePairCount([20, 35, 40, 70, 100, 135]) === 10, "Mission 3 원문 여섯 각에서 둔각삼각형을 만드는 방법은 10가지여야 합니다.");
const pentagramAngleCounts = () => {
  const epsilon = 1e-8;
  const points = Array.from({ length: 5 }, (_, index) => {
    const angle = (-90 + index * 72) * Math.PI / 180;
    return [Math.cos(angle), Math.sin(angle)];
  });
  const segments = [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]];
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
  const connected = (first, second) => segments.some(([a, b]) => Math.abs(cross(points[a], points[b], first)) < epsilon && Math.abs(cross(points[a], points[b], second)) < epsilon && within(first, points[a], points[b]) && within(second, points[a], points[b]));
  const totals = { acute: 0, right: 0, obtuse: 0 };
  for (let first = 0; first < vertices.length - 2; first += 1) for (let second = first + 1; second < vertices.length - 1; second += 1) for (let third = second + 1; third < vertices.length; third += 1) {
    if (Math.abs(cross(vertices[first], vertices[second], vertices[third])) < epsilon || !connected(vertices[first], vertices[second]) || !connected(vertices[second], vertices[third]) || !connected(vertices[third], vertices[first])) continue;
    const kind = pointKind(vertices[first], vertices[second], vertices[third]);
    totals[kind] += 1;
  }
  return totals;
};
const sourcePentagramTotals = pentagramAngleCounts();
check(sourcePentagramTotals.acute === 5 && sourcePentagramTotals.right === 0 && sourcePentagramTotals.obtuse === 5, "별 모양에는 예각삼각형 5개와 둔각삼각형 5개가 있어야 합니다.");
const segmentGraphAngleCounts = (points, segments) => {
  const epsilon = 1e-8;
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const within = (point, first, second) => point[0] >= Math.min(first[0], second[0]) - epsilon && point[0] <= Math.max(first[0], second[0]) + epsilon && point[1] >= Math.min(first[1], second[1]) - epsilon && point[1] <= Math.max(first[1], second[1]) + epsilon;
  const vertices = points.map(point => [...point]);
  const addVertex = point => { if (point && !vertices.some(existing => Math.hypot(existing[0] - point[0], existing[1] - point[1]) < epsilon)) vertices.push(point); };
  for (let first = 0; first < segments.length - 1; first += 1) for (let second = first + 1; second < segments.length; second += 1) {
    const [a, b] = segments[first].map(index => points[index]);
    const [c, d] = segments[second].map(index => points[index]);
    const denominator = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    if (Math.abs(denominator) < epsilon) continue;
    const ab = a[0] * b[1] - a[1] * b[0];
    const cd = c[0] * d[1] - c[1] * d[0];
    const point = [(ab * (c[0] - d[0]) - (a[0] - b[0]) * cd) / denominator, (ab * (c[1] - d[1]) - (a[1] - b[1]) * cd) / denominator];
    if (within(point, a, b) && within(point, c, d)) addVertex(point);
  }
  const connected = (first, second) => segments.some(([startIndex, endIndex]) => {
    const start = points[startIndex];
    const end = points[endIndex];
    return Math.abs(cross(start, end, first)) < epsilon && Math.abs(cross(start, end, second)) < epsilon && within(first, start, end) && within(second, start, end);
  });
  const totals = { acute: 0, right: 0, obtuse: 0 };
  for (let first = 0; first < vertices.length - 2; first += 1) for (let second = first + 1; second < vertices.length - 1; second += 1) for (let third = second + 1; third < vertices.length; third += 1) {
    const triangle = [vertices[first], vertices[second], vertices[third]];
    if (Math.abs(cross(...triangle)) < epsilon || !connected(triangle[0], triangle[1]) || !connected(triangle[1], triangle[2]) || !connected(triangle[2], triangle[0])) continue;
    const squared = [[0, 1], [1, 2], [2, 0]].map(([a, b]) => (triangle[a][0] - triangle[b][0]) ** 2 + (triangle[a][1] - triangle[b][1]) ** 2).sort((a, b) => a - b);
    totals[Math.abs(squared[0] + squared[1] - squared[2]) < epsilon ? "right" : squared[0] + squared[1] > squared[2] ? "acute" : "obtuse"] += 1;
  }
  return totals;
};
const sourceMission4Points = [[1, 5], [3, 1], [7, 5], [2, 3], [5, 3]];
const sourceMission4Segments = [[0, 1], [1, 2], [0, 2], [0, 4], [3, 2], [3, 4]];
const sourceMission4Totals = segmentGraphAngleCounts(sourceMission4Points, sourceMission4Segments);
check(sourceMission4Totals.acute === 4 && sourceMission4Totals.right === 0 && sourceMission4Totals.obtuse === 8, "Mission 4 모눈 도형에는 예각삼각형 4개와 둔각삼각형 8개가 있어야 합니다.");
const sourceMission5Points = [[0, 0], [3, 0], [0, 0.5], [3, 0.5], [0, 1], [3, 1], [1, 0], [1, 1], [2, 0], [2, 1]];
const sourceMission5Segments = [[0, 1], [2, 3], [4, 5], [0, 4], [6, 7], [8, 9], [1, 5], [2, 6], [2, 7], [6, 9], [7, 8], [8, 5], [9, 1]];
const sourceMission5Totals = segmentGraphAngleCounts(sourceMission5Points, sourceMission5Segments);
check(sourceMission5Totals.acute === 1 && sourceMission5Totals.right === 32 && sourceMission5Totals.obtuse === 2, "Mission 5 띠 도형에는 예각삼각형 1개, 직각삼각형 32개, 둔각삼각형 2개가 있어야 합니다.");
check(36 + 22 - 10 * 2 === 38, "이등변삼각형 Mission 1 원문 색칠 도형의 둘레는 38cm여야 합니다.");
check(50 * 6 + 10 * 2 === 320, "이등변삼각형 Mission 3 원문 띠 도형의 둘레는 320cm여야 합니다.");
check((40 - 13) / (10 - 1) === 3, "이등변삼각형 예제 3-2 원문 짧은 변은 3cm여야 합니다.");
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
const markedSquareGridTriangleCount = markedIndex => {
  const points = [];
  for (let y = 0; y <= 4; y += 1) for (let x = 0; x <= 4; x += 1) points.push([x, y]);
  const index = (x, y) => y * 5 + x;
  const segments = [];
  for (let y = 0; y <= 4; y += 1) segments.push([index(0, y), index(4, y)]);
  for (let x = 0; x <= 4; x += 1) segments.push([index(x, 0), index(x, 4)]);
  segments.push(
    [index(0, 0), index(4, 4)],
    [index(2, 0), index(0, 2)],
    [index(2, 0), index(4, 2)],
    [index(4, 0), index(0, 4)],
    [index(0, 2), index(2, 4)],
    [index(4, 2), index(2, 4)]
  );
  const markedCells = [
    [[1, 1], [1, 2], [2, 2]],
    [[3, 1], [2, 2], [3, 2]],
    [[2, 2], [1, 3], [2, 3]],
    [[2, 2], [2, 3], [3, 3]]
  ];
  const marked = markedCells[markedIndex];
  const epsilon = 1e-9;
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const within = (point, first, second) => point[0] >= Math.min(first[0], second[0]) - epsilon && point[0] <= Math.max(first[0], second[0]) + epsilon && point[1] >= Math.min(first[1], second[1]) - epsilon && point[1] <= Math.max(first[1], second[1]) + epsilon;
  const connected = (first, second) => segments.some(([startIndex, endIndex]) => {
    const start = points[startIndex];
    const end = points[endIndex];
    return Math.abs(cross(start, end, first)) < epsilon && Math.abs(cross(start, end, second)) < epsilon && within(first, start, end) && within(second, start, end);
  });
  const contains = (point, first, second, third) => {
    const signs = [cross(first, second, point), cross(second, third, point), cross(third, first, point)];
    return signs.every(value => value >= -epsilon) || signs.every(value => value <= epsilon);
  };
  let count = 0;
  for (let first = 0; first < points.length - 2; first += 1) for (let second = first + 1; second < points.length - 1; second += 1) for (let third = second + 1; third < points.length; third += 1) {
    const triangle = [points[first], points[second], points[third]];
    if (Math.abs(cross(...triangle)) < epsilon || !connected(triangle[0], triangle[1]) || !connected(triangle[1], triangle[2]) || !connected(triangle[2], triangle[0])) continue;
    if (marked.every(point => contains(point, ...triangle))) count += 1;
  }
  return count;
};
for (let markedIndex = 0; markedIndex < 4; markedIndex += 1) check(markedSquareGridTriangleCount(markedIndex) === 16, `예제 1-2 대칭 위치 ${markedIndex}의 답은 16개여야 합니다.`);
const pairedLineArraysTriangleCount = (rayCount, horizontalCount, descendingCount, ascendingCount) => `${rayCount * (rayCount - 1) / 2 * horizontalCount}, ${2 * descendingCount * ascendingCount}`;
check(pairedLineArraysTriangleCount(7, 3, 3, 2) === "63, 12", "예제 1-3 원문 구조의 답은 (1) 63개, (2) 12개여야 합니다.");
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
const irregularSourceTriangleCount = (points, segments, requiredIndex = -1, excludedIndex = -1) => {
  const epsilon = 1e-7;
  const cross = (first, second, third) => (second[0] - first[0]) * (third[1] - first[1]) - (second[1] - first[1]) * (third[0] - first[0]);
  const within = (point, first, second) => point[0] >= Math.min(first[0], second[0]) - epsilon && point[0] <= Math.max(first[0], second[0]) + epsilon && point[1] >= Math.min(first[1], second[1]) - epsilon && point[1] <= Math.max(first[1], second[1]) + epsilon;
  const vertices = points.map(point => [...point]);
  const addVertex = point => { if (!vertices.some(existing => Math.hypot(existing[0] - point[0], existing[1] - point[1]) < epsilon)) vertices.push(point); };
  for (let first = 0; first < segments.length - 1; first += 1) for (let second = first + 1; second < segments.length; second += 1) {
    const [a, b] = segments[first].map(index => points[index]);
    const [c, d] = segments[second].map(index => points[index]);
    const denominator = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    if (Math.abs(denominator) < epsilon) continue;
    const ab = a[0] * b[1] - a[1] * b[0];
    const cd = c[0] * d[1] - c[1] * d[0];
    const point = [(ab * (c[0] - d[0]) - (a[0] - b[0]) * cd) / denominator, (ab * (c[1] - d[1]) - (a[1] - b[1]) * cd) / denominator];
    if (within(point, a, b) && within(point, c, d)) addVertex(point);
  }
  const connected = (first, second) => segments.some(([startIndex, endIndex]) => {
    const start = points[startIndex];
    const end = points[endIndex];
    return Math.abs(cross(start, end, first)) < epsilon && Math.abs(cross(start, end, second)) < epsilon && within(first, start, end) && within(second, start, end);
  });
  let count = 0;
  for (let first = 0; first < vertices.length - 2; first += 1) for (let second = first + 1; second < vertices.length - 1; second += 1) for (let third = second + 1; third < vertices.length; third += 1) {
    const indices = [first, second, third];
    if (requiredIndex >= 0 && !indices.includes(requiredIndex)) continue;
    if (excludedIndex >= 0 && indices.includes(excludedIndex)) continue;
    if (Math.abs(cross(vertices[first], vertices[second], vertices[third])) > epsilon && connected(vertices[first], vertices[second]) && connected(vertices[second], vertices[third]) && connected(vertices[third], vertices[first])) count += 1;
  }
  return count;
};
const irregularSourceLineTripleCount = (points, segments) => {
  const epsilon = 1e-7;
  const within = (point, first, second) => point[0] >= Math.min(first[0], second[0]) - epsilon && point[0] <= Math.max(first[0], second[0]) + epsilon && point[1] >= Math.min(first[1], second[1]) - epsilon && point[1] <= Math.max(first[1], second[1]) + epsilon;
  const intersection = (firstSegment, secondSegment) => {
    const [a, b] = firstSegment.map(index => points[index]);
    const [c, d] = secondSegment.map(index => points[index]);
    const denominator = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]);
    if (Math.abs(denominator) < epsilon) return null;
    const ab = a[0] * b[1] - a[1] * b[0];
    const cd = c[0] * d[1] - c[1] * d[0];
    const point = [(ab * (c[0] - d[0]) - (a[0] - b[0]) * cd) / denominator, (ab * (c[1] - d[1]) - (a[1] - b[1]) * cd) / denominator];
    return within(point, a, b) && within(point, c, d) ? point : null;
  };
  let count = 0;
  for (let first = 0; first < segments.length - 2; first += 1) for (let second = first + 1; second < segments.length - 1; second += 1) for (let third = second + 1; third < segments.length; third += 1) {
    const pointsOfTriangle = [intersection(segments[first], segments[second]), intersection(segments[second], segments[third]), intersection(segments[third], segments[first])];
    if (pointsOfTriangle.some(point => !point)) continue;
    if (Math.hypot(pointsOfTriangle[0][0] - pointsOfTriangle[1][0], pointsOfTriangle[0][1] - pointsOfTriangle[1][1]) < epsilon) continue;
    if (Math.hypot(pointsOfTriangle[1][0] - pointsOfTriangle[2][0], pointsOfTriangle[1][1] - pointsOfTriangle[2][1]) < epsilon) continue;
    if (Math.hypot(pointsOfTriangle[2][0] - pointsOfTriangle[0][0], pointsOfTriangle[2][1] - pointsOfTriangle[0][1]) < epsilon) continue;
    count += 1;
  }
  return count;
};
const sourceExplorationPoints = [[0, 0], [1.5, 3], [3, 6], [3, 0], [5, 0], [4.2, 2.4], [15, 0]];
const sourceExplorationSegments = [[0, 6], [0, 2], [2, 3], [2, 4], [1, 3], [1, 4], [1, 6], [0, 5]];
check(irregularSourceTriangleCount(sourceExplorationPoints, sourceExplorationSegments) === 40, "개념탐구 1의 인쇄선에는 삼각형이 40개여야 합니다.");
check(irregularSourceTriangleCount(sourceExplorationPoints, sourceExplorationSegments, 1) === 21, "개념탐구 1에서 왼쪽 빗변의 갈림점을 꼭짓점으로 하는 삼각형은 21개여야 합니다.");
check(irregularSourceTriangleCount(sourceExplorationPoints, sourceExplorationSegments, -1, 1) === 19, "개념탐구 1에서 왼쪽 빗변의 갈림점을 쓰지 않는 삼각형은 19개여야 합니다.");
check(irregularSourceLineTripleCount(sourceExplorationPoints, sourceExplorationSegments) === 40, "개념탐구 1의 여덟 연속선 조합도 삼각형 40개와 일치해야 합니다.");
const answerFor = (kind, values) => {
  if (kind === "fan-count" || kind === "dot-fan-count") return String(values[0] * (values[0] + 1) / 2);
  if (kind === "square-diagonal-grid-count") return String(squareDiagonalGridTriangleCount(values[0]));
  if (kind === "marked-triangle-lattice-count") return String(markedTriangleLatticeCount(values[0], values[1], values[2], values[3]));
  if (kind === "joined-fans-count") return String(joinedFansTriangleCount(values[0], values[1]));
  if (kind === "crossing-segment-count") return String(crossingSegmentTriangleCount(values[0], values[1]));
  if (kind === "crossed-fans-count") return String((values[0] - 1) ** 3);
  if (kind === "irregular-source-segment-count") return String(irregularSourceTriangleCount(values[0], values[1]));
  if (kind === "marked-square-grid-count") return String(markedSquareGridTriangleCount(values[0]));
  if (kind === "paired-line-arrays-count") return pairedLineArraysTriangleCount(...values);
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
    return String(obtuseAnglePairCount(values));
  }
  if (kind === "obtuse-dot-shape-classes") return String(obtuseDotShapeClassCount(values[0], values[1]));
  if (kind === "pentagram-angle-count") {
    const totals = pentagramAngleCounts();
    return `${totals.acute}, ${totals.obtuse}`;
  }
  if (kind === "segment-angle-count") {
    const [points, segments, mode] = values;
    const totals = segmentGraphAngleCounts(points, segments);
    return mode === "acute-obtuse-difference" ? String(Math.abs(totals.acute - totals.obtuse)) : String(totals[mode]);
  }
  if (kind === "isosceles-concave-perimeter") return String(values[0] + values[1] - values[2] * 2);
  if (kind === "isosceles-strip-perimeter") return String(values[0] * values[2] + values[1] * 2);
  if (kind === "isosceles-strip-short-side") return String((values[2] - values[1]) / (values[0] - 1));
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
  if (kind === "equilateral-three-equal-angle") {
    const [givenAngle, equilateralAngle] = values;
    const outerBaseAngle = (180 - (givenAngle - equilateralAngle)) / 2;
    const innerBaseAngle = (180 - givenAngle) / 2;
    return String(outerBaseAngle - innerBaseAngle);
  }
  if (kind === "equilateral-equal-right-angle") {
    const [equalSide, vertical] = values;
    if (vertical * 2 !== equalSide) return "invalid";
    const middleAngle = 30;
    return String((180 - (180 - middleAngle)) / 2);
  }
  if (kind === "equilateral-angle-trapezoid-length") return String(values[1] - values[0] * 2);
  if (kind === "equilateral-spiral-side") {
    const [small, large] = values;
    const difference = large - small;
    return difference > 0 && difference % 3 === 0 ? String(difference / 3) : "invalid";
  }
  if (kind === "equilateral-matchstick-shapes") {
    return values[0] === 12 && values[1] === 2 ? String(matchstickAudits.at(-1).classes) : "invalid";
  }
  if (kind === "equilateral-shaded-chain-side") {
    const [total, known] = values;
    const difference = total - known;
    return difference > 0 && difference % 3 === 0 ? String(known + difference / 3) : "invalid";
  }
  if (kind === "folded-equilateral-length-sum") {
    const [side, total] = values;
    const answer = total - side * 3 / 2;
    return Number.isInteger(answer) && answer > 0 ? String(answer) : "invalid";
  }
  if (kind === "equilateral-square-inscribed-angle") {
    const square = values[0];
    const triangleSide = square * (1 + 2 / Math.sqrt(3));
    const height = triangleSide * Math.sqrt(3) / 2;
    const run = triangleSide / 2 - square / Math.sqrt(3);
    return String(Math.round(Math.atan2(height, run) * 180 / Math.PI));
  }
  if (kind === "equilateral-three-side-angle") {
    const [equilateralAngle, cornerAngle] = values;
    const largeBaseAngle = (180 - (cornerAngle - equilateralAngle)) / 2;
    const smallBaseAngle = (180 - cornerAngle) / 2;
    return String(largeBaseAngle - smallBaseAngle);
  }
  if (kind === "equilateral-right-three-side-angle") {
    const [rightAngle, givenAngle] = values;
    const outerDiagonalAngle = rightAngle / 2;
    const equalTriangleBaseAngle = (180 - givenAngle) / 2;
    const smallAngle = rightAngle - equalTriangleBaseAngle;
    const upperAngle = outerDiagonalAngle - smallAngle;
    const lowerAngle = outerDiagonalAngle - givenAngle;
    return String(180 - upperAngle - lowerAngle);
  }
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
  check(!/순열|조합|피타고라스|제곱/.test(`${generated.prompt}${generated.solution}`), `${context}: 초등 과정 밖 표현이 있습니다.`);
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
check(types.length === 30, `원문 일치 공개 유형 수가 30개가 아닙니다: ${types.length}`);
check(locked.length === 14, `검수 대기 유형 수가 14개가 아닙니다: ${locked.length}`);
check(seenKinds.size === 27, `공개 검산 구조 수가 27개가 아닙니다: ${seenKinds.size}`);
check(types.every(type => publicSourceIds.has(type.sourceItemId)), "공개 허용 목록에 없는 삼각형 유형이 열려 있습니다.");
check([...publicSourceIds].every(sourceItemId => types.some(type => type.sourceItemId === sourceItemId)), "원문 일치 공개 유형이 빠졌습니다.");
if (failures.length) {
  console.error(`4-2 삼각형 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`4-2 삼각형 원문 일치 공개 감사 통과: ${types.length}유형, 검수 대기 ${locked.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종`);
