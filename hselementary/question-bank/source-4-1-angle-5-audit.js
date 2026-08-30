"use strict";

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41AngleFive";
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;

const sourceItems = [
  ["4-1-u2-e5-exploration", 0, false, "두 번 접은 직사각형을 펼쳐 접은 선 사이의 각 구하기"],
  ["4-1-u2-e5-example-5-1", 1, true, "겹친 두 직각삼각형에서 한 직각 안의 빈 각 구하기"],
  ["4-1-u2-e5-example-5-2", 2, false, "직각삼각형을 한 꼭짓점에서 돌린 뒤 벌어진 각 구하기"],
  ["4-1-u2-e5-example-5-3", 3, false, "삼각형을 접어 생긴 두 각의 차 구하기"],
  ["4-1-u2-e5-example-5-4", 4, false, "정사각형을 접었을 때 한 꼭짓점의 큰 각 구하기"],
  ["4-1-u2-e5-mission-1", 5, false, "겹친 두 직각삼각형의 바깥각으로 위쪽 각 구하기"],
  ["4-1-u2-e5-mission-2", 6, false, "두 삼각형의 비스듬한 선 사이의 큰 각 구하기"],
  ["4-1-u2-e5-mission-3", 7, false, "직각삼각형의 한 꼭짓점을 고정해 돌린 각 구하기"],
  ["4-1-u2-e5-mission-4", 8, true, "삼각형을 접은 선과 늘인 선에서 두 각의 합 구하기"],
  ["4-1-u2-e5-mission-5", 9, false, "직사각형의 양쪽을 접어 생긴 두 모서리각의 합 구하기"],
  ["4-1-u2-e5-mission-6", 10, false, "직사각형을 두 번 접어 겹친 선 사이의 각 구하기"]
];

const expectedKinds = new Map([
  [0, "two-fold-rectangle-crease-angle"],
  [2, "rotated-right-triangle-opening"],
  [3, "folded-triangle-two-angle-difference"],
  [4, "folded-square-reflex-angle"],
  [5, "overlapping-right-triangles-upper-angle"],
  [6, "two-triangle-slope-exterior-angle"],
  [7, "rotated-right-triangle-turn"],
  [9, "double-side-rectangle-fold-sum"],
  [10, "twice-folded-rectangle-center-angle"]
]);

const safeVariants = [...expectedKinds.keys()];
const lockedVariants = [1, 8];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attribute(tag, name) {
  return String(tag).match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function tags(html, tagName) {
  return String(html).match(new RegExp(`<${tagName}\\b[^>]*>`, "g")) || [];
}

function pointDistance(first, second) {
  return Math.hypot(first[0] - second[0], first[1] - second[1]);
}

function pointsAttribute(tag) {
  return (attribute(tag, "points") || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(pair => pair.split(",").map(Number));
}

function polygonArea(points) {
  if (points.length < 3 || points.some(point => point.length !== 2 || point.some(value => !Number.isFinite(value)))) return 0;
  return Math.abs(points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0)) / 2;
}

function rectanglePoints(tag) {
  const x = Number(attribute(tag, "x"));
  const y = Number(attribute(tag, "y"));
  const width = Number(attribute(tag, "width"));
  const height = Number(attribute(tag, "height"));
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return [];
  return [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
}

function shapePolygons(fullSvg) {
  return [
    ...tags(fullSvg, "polygon").map(tag => ({ tag, points: pointsAttribute(tag) })),
    ...tags(fullSvg, "rect").map(tag => ({ tag, points: rectanglePoints(tag) }))
  ].filter(shape => shape.points.length >= 3);
}

function shapeSegments(fullSvg) {
  const segments = [];
  for (const tag of tags(fullSvg, "line")) {
    const points = [[Number(attribute(tag, "x1")), Number(attribute(tag, "y1"))], [Number(attribute(tag, "x2")), Number(attribute(tag, "y2"))]];
    if (points.every(point => point.every(Number.isFinite))) segments.push(points);
  }
  for (const shape of shapePolygons(fullSvg)) {
    for (let index = 0; index < shape.points.length; index += 1) segments.push([shape.points[index], shape.points[(index + 1) % shape.points.length]]);
  }
  return segments;
}

function pointOnSegment(point, segment, tolerance = 1.2) {
  const [start, end] = segment;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return false;
  const position = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
  return pointDistance(point, [start[0] + position * dx, start[1] + position * dy]) <= tolerance;
}

function segmentAngle(segment) {
  const [start, end] = segment;
  return normalizeAngle(Math.atan2(-(end[1] - start[1]), end[0] - start[0]) * 180 / Math.PI);
}

function lineAngleDistance(first, second) {
  const difference = angleDistance(first, second);
  return Math.min(difference, Math.abs(180 - difference));
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let first = 0, second = polygon.length - 1; first < polygon.length; second = first, first += 1) {
    const [firstX, firstY] = polygon[first];
    const [secondX, secondY] = polygon[second];
    if (pointOnSegment(point, [[firstX, firstY], [secondX, secondY]], 0.8)) return true;
    const crosses = (firstY > point[1]) !== (secondY > point[1])
      && point[0] < (secondX - firstX) * (point[1] - firstY) / (secondY - firstY) + firstX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function rightMarkGeometry(tag) {
  const values = (attribute(tag, "d") || "").match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  assert(values.length === 6, "직각 표시의 좌표를 읽을 수 없습니다.");
  const first = [values[0], values[1]];
  const corner = [values[2], values[3]];
  const second = [values[4], values[5]];
  const firstAngle = Number(attribute(tag, "data-ray-a"));
  const secondAngle = Number(attribute(tag, "data-ray-b"));
  const size = pointDistance(first, corner);
  const radians = firstAngle * Math.PI / 180;
  const origin = [first[0] - size * Math.cos(radians), first[1] + size * Math.sin(radians)];
  return { firstAngle, secondAngle, origin, corner };
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readEvidence(prompt) {
  const tag = String(prompt).match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(attribute(tag, "data-source41-payload"))),
    declared: decodeURIComponent(attribute(tag, "data-source41-expected"))
  };
}

function numberAnswer(value) {
  assert(Number.isFinite(value), `계산 결과가 유한한 수가 아닙니다: ${value}`);
  assert(Number.isInteger(value), `계산 결과가 정수가 아닙니다: ${value}`);
  assert(value > 0 && value < 360, `계산 결과 ${value}°가 학생용 각 범위를 벗어났습니다.`);
  return String(value);
}

function independentAnswer(variant, payload) {
  let value;
  let accepts;
  if (variant === 0) {
    assert(payload.split > 0 && payload.split < 90, "두 번 접은 그림의 나뉜 각이 직각 안에 있지 않습니다.");
    value = 360 - payload.large - 90;
    accepts = candidate => candidate + payload.large + 90 === 360;
  } else if (variant === 2) {
    assert(payload.pivotAngle === 90 - payload.a, "직각삼각형의 나머지 예각이 다릅니다.");
    value = 90 - payload.a + payload.rotation;
    accepts = candidate => candidate - payload.rotation + payload.a === 90;
  } else if (variant === 3) {
    const first = 180 - payload.c + payload.p;
    const second = 2 * first - 180;
    assert(payload.first === first && payload.second === second, "접은 삼각형의 두 중간각 자료가 다릅니다.");
    value = first - second;
    accepts = candidate => candidate === (180 - payload.c + payload.p) - (2 * (180 - payload.c + payload.p) - 180);
  } else if (variant === 4) {
    assert(payload.distractor >= 30 && payload.distractor < 90, "다른 꼭짓점에 제시된 각이 예각이 아닙니다.");
    value = 360 - 90 - 2 * payload.t;
    accepts = candidate => candidate + 90 + 2 * payload.t === 360;
  } else if (variant === 5) {
    assert(payload.intermediate === 180 - payload.e - payload.a, "겹친 직각삼각형의 중간각 자료가 다릅니다.");
    value = payload.e + payload.a - payload.b;
    accepts = candidate => candidate + payload.b === payload.e + payload.a;
  } else if (variant === 6) {
    assert(payload.gap === payload.inner - payload.outer, "두 비스듬한 선 사이의 작은 각 자료가 다릅니다.");
    value = 180 - payload.gap;
    accepts = candidate => candidate + payload.inner - payload.outer === 180;
  } else if (variant === 7) {
    value = 90 - payload.shown;
    accepts = candidate => candidate + payload.shown === 90;
  } else if (variant === 9) {
    assert(payload.gap % 2 === 0 && payload.halfGap === payload.gap / 2, "가운데 각을 양쪽에 똑같이 나눈 값이 다릅니다.");
    assert(payload.leftCornerAngle + payload.rightCornerAngle === payload.answerNumber, "양쪽 모서리각의 합 자료가 다릅니다.");
    value = 90 + payload.gap / 2;
    accepts = candidate => 2 * (candidate - 90) === payload.gap;
  } else if (variant === 10) {
    value = 180 - 4 * payload.gap;
    accepts = candidate => candidate + 4 * payload.gap === 180;
  } else {
    throw new Error(`공개하면 안 되는 variant ${variant}입니다.`);
  }
  assert(payload.answerNumber === value, `payload 답 ${payload.answerNumber}과 독립 계산 ${value}가 다릅니다.`);
  const candidates = Array.from({ length: 359 }, (_, index) => index + 1).filter(accepts);
  assert(candidates.length === 1 && candidates[0] === value, `정답 후보가 ${candidates.join(", ") || "없음"}입니다.`);
  return numberAnswer(value);
}

function normalizeAngle(value) {
  return (value % 360 + 360) % 360;
}

function angleDistance(first, second) {
  const difference = Math.abs(normalizeAngle(first) - normalizeAngle(second));
  return Math.min(difference, 360 - difference);
}

function auditRayCoordinates(svgRoot, fullSvg) {
  const declaredRoot = (attribute(svgRoot, "data-ray-angles") || "").split(",").filter(Boolean).map(Number);
  assert(declaredRoot.length >= 2 && declaredRoot.every(Number.isFinite), "SVG root의 광선 각도 자료가 두 개 이상 필요합니다.");
  const rayTags = tags(fullSvg, "line").filter(tag => attribute(tag, "data-ray-angle") !== undefined);
  assert(rayTags.length >= declaredRoot.length, `좌표로 검산할 광선이 ${rayTags.length}개뿐입니다.`);
  const actualDeclarations = [];
  for (const tag of rayTags) {
    const x1 = Number(attribute(tag, "x1"));
    const y1 = Number(attribute(tag, "y1"));
    const x2 = Number(attribute(tag, "x2"));
    const y2 = Number(attribute(tag, "y2"));
    const declared = Number(attribute(tag, "data-ray-angle"));
    assert([x1, y1, x2, y2, declared].every(Number.isFinite), "광선 좌표 또는 선언 각도가 깨졌습니다.");
    assert(Math.hypot(x2 - x1, y2 - y1) >= 26, "광선 길이가 너무 짧아 방향을 읽기 어렵습니다.");
    const actual = normalizeAngle(Math.atan2(-(y2 - y1), x2 - x1) * 180 / Math.PI);
    assert(angleDistance(actual, declared) <= 0.5, `광선 좌표 ${actual.toFixed(2)}°와 선언 ${declared}°가 다릅니다.`);
    actualDeclarations.push(declared);
  }
  for (const declared of declaredRoot) {
    assert(actualDeclarations.some(actual => angleDistance(actual, declared) <= 0.01), `root 광선 ${declared}°와 같은 실제 선이 없습니다.`);
  }
  for (const tag of tags(fullSvg, "path").filter(tag => attribute(tag, "data-right-angle") === "true")) {
    const first = Number(attribute(tag, "data-ray-a"));
    const second = Number(attribute(tag, "data-ray-b"));
    assert(Number.isFinite(first) && Number.isFinite(second), "직각 표시에 두 광선의 방향 자료가 없습니다.");
    assert(Math.abs(angleDistance(first, second) - 90) <= 0.01, `직각 표시의 두 선이 ${angleDistance(first, second)}°를 이룹니다.`);
  }
}

function auditRightAnglePlacement(fullSvg) {
  const segments = shapeSegments(fullSvg);
  const shapes = shapePolygons(fullSvg).filter(shape => polygonArea(shape.points) >= 60);
  for (const tag of tags(fullSvg, "path").filter(pathTag => attribute(pathTag, "data-right-angle") === "true")) {
    const geometry = rightMarkGeometry(tag);
    for (const angle of [geometry.firstAngle, geometry.secondAngle]) {
      assert(segments.some(segment => pointOnSegment(geometry.origin, segment) && lineAngleDistance(segmentAngle(segment), angle) <= 0.8), `직각 표시 ${angle}° 방향에 실제 도형의 변이 없습니다.`);
    }
    const interiorPoint = [
      geometry.origin[0] + (geometry.corner[0] - geometry.origin[0]) * 0.72,
      geometry.origin[1] + (geometry.corner[1] - geometry.origin[1]) * 0.72
    ];
    assert(shapes.some(shape => pointInPolygon(interiorPoint, shape.points)), "직각 표시가 실제 도형의 안쪽에 놓이지 않았습니다.");
  }
}

function auditReflectionPairs(fullSvg, variant) {
  const pairs = new Map();
  for (const tag of tags(fullSvg, "line")) {
    const pair = attribute(tag, "data-reflection-pair");
    const role = attribute(tag, "data-reflection-role");
    if (!pair || !role) continue;
    if (!pairs.has(pair)) pairs.set(pair, {});
    pairs.get(pair)[role] = Number(attribute(tag, "data-ray-angle"));
  }
  if (variant === 3 || variant === 9) assert(pairs.size >= (variant === 9 ? 2 : 1), "접기 전 선·접는 선·접힌 뒤 선의 반사쌍 자료가 부족합니다.");
  for (const [pair, roles] of pairs) {
    assert([roles.original, roles.crease, roles.reflected].every(Number.isFinite), `반사쌍 ${pair}에 원래선·접는 선·접힌 뒤 선 방향이 모두 없습니다.`);
    const expected = normalizeAngle(2 * roles.crease - roles.original);
    assert(angleDistance(expected, roles.reflected) <= 0.5, `반사쌍 ${pair}의 접힌 뒤 선 ${roles.reflected}°가 접는 선 기준 반사각 ${expected}°와 다릅니다.`);
  }
}

function auditSourceGeometry(fullSvg, variant) {
  const polygons = tags(fullSvg, "polygon");
  for (const tag of polygons) {
    const area = polygonArea(pointsAttribute(tag));
    assert(area >= 60, `넓이가 ${area.toFixed(2)}인 찌그러진 다각형이 있습니다.`);
  }
  auditRightAnglePlacement(fullSvg);
  auditReflectionPairs(fullSvg, variant);

  if (variant === 3) {
    assert(polygons.length >= 2, "삼각형 접기에는 접기 전과 접은 뒤의 실제 삼각형이 모두 필요합니다.");
    const labelOrigins = tags(fullSvg, "text").map(tag => attribute(tag, "data-label-origin")).filter(Boolean);
    assert(new Set(labelOrigins).size >= 2, "서로 다른 위치의 두 주어진 각이 한 꼭짓점으로 합쳐졌습니다.");
  } else if (variant === 4) {
    const square = tags(fullSvg, "rect").find(tag => attribute(tag, "data-source-shape") === "square");
    assert(square, "접은 정사각형의 실제 정사각형 바깥선이 없습니다.");
    assert(Math.abs(Number(attribute(square, "width")) - Number(attribute(square, "height"))) <= 0.1, "정사각형 바깥선의 가로와 세로가 다릅니다.");
    assert(fullSvg.includes('data-source-shape="distractor-folded-corner"'), "원문에 함께 제시된 다른 꼭짓점의 접힌 모서리가 없습니다.");
  } else if (variant === 5) {
    assert(polygons.filter(tag => /right-triangle/.test(attribute(tag, "data-source-shape") || "")).length === 2, "겹친 두 직각삼각형이 각각 그려지지 않았습니다.");
  } else if (variant === 6) {
    assert(polygons.length >= 2, "서로 다른 위치의 두 삼각형이 그려지지 않았습니다.");
    const vertexGroups = [...tags(fullSvg, "line"), ...polygons].map(tag => attribute(tag, "data-vertex-group")).filter(Boolean);
    assert(new Set(vertexGroups).size >= 2, "두 삼각형의 서로 다른 꼭짓점 구조를 확인할 수 없습니다.");
  } else if (variant === 9) {
    assert(fullSvg.includes('data-gap-role="reflected-edge-gap"'), "가운데 각이 접힌 뒤 생긴 두 선 사이의 각으로 표시되지 않았습니다.");
  } else if (variant === 10) {
    assert(fullSvg.includes('data-source-shape="rectangle"'), "두 번 접는 원래 직사각형이 없습니다.");
    assert(fullSvg.includes('data-source-shape="folded-piece"'), "두 번 접은 뒤의 종이 조각이 없습니다.");
    assert((fullSvg.match(/data-fold-role="crease"/g) || []).length >= 2, "두 번 접은 접는 선이 각각 표시되지 않았습니다.");
  }
}

function sourceShapeSignature(fullSvg) {
  const shapeTags = [...tags(fullSvg, "polygon"), ...tags(fullSvg, "rect")]
    .filter(tag => attribute(tag, "data-source-shape"));
  return shapeTags.map(tag => [
    attribute(tag, "data-source-shape"),
    attribute(tag, "points"),
    attribute(tag, "x"),
    attribute(tag, "y"),
    attribute(tag, "width"),
    attribute(tag, "height")
  ].join(":" )).sort().join("|");
}

function auditLabelSpacing(fullSvg) {
  const textTags = tags(fullSvg, "text").filter(tag => /source41-(?:given|target)-label/.test(attribute(tag, "class") || ""));
  const points = textTags.map(tag => [Number(attribute(tag, "x")), Number(attribute(tag, "y"))]);
  assert(points.length >= 2 && points.every(point => point.every(Number.isFinite)), "각도 숫자 또는 목표 표시 위치가 없습니다.");
  for (let first = 0; first < points.length; first += 1) {
    for (let second = first + 1; second < points.length; second += 1) {
      assert(Math.hypot(points[first][0] - points[second][0], points[first][1] - points[second][1]) >= 14, "각도 숫자와 목표 표시 위치가 너무 가깝습니다.");
    }
  }
}

function auditViewBoxBounds(fullSvg) {
  const root = fullSvg.match(/<svg\b[^>]*>/)?.[0] || "";
  const viewBox = (attribute(root, "viewBox") || "").split(/\s+/).map(Number);
  assert(viewBox.length === 4 && viewBox.every(Number.isFinite), "SVG의 화면 범위를 읽을 수 없습니다.");
  const [minimumX, minimumY, width, height] = viewBox;
  const maximumX = minimumX + width;
  const maximumY = minimumY + height;
  const inside = (value, minimum, maximum) => Number.isFinite(value) && value >= minimum - 0.2 && value <= maximum + 0.2;
  const checkPoint = (point, role) => {
    assert(inside(point[0], minimumX, maximumX) && inside(point[1], minimumY, maximumY), `${role} 좌표 (${point.map(value => value.toFixed(1)).join(", ")})가 그림 범위를 벗어났습니다.`);
  };

  for (const tag of tags(fullSvg, "line")) {
    checkPoint([Number(attribute(tag, "x1")), Number(attribute(tag, "y1"))], "선의 시작점");
    checkPoint([Number(attribute(tag, "x2")), Number(attribute(tag, "y2"))], "선의 끝점");
  }
  for (const tag of tags(fullSvg, "polygon")) {
    for (const point of pointsAttribute(tag)) checkPoint(point, "다각형 꼭짓점");
  }
  for (const tag of tags(fullSvg, "rect")) {
    const points = rectanglePoints(tag);
    assert(points.length === 4, "사각형 좌표를 읽을 수 없습니다.");
    for (const point of points) checkPoint(point, "사각형 꼭짓점");
  }
  for (const tag of tags(fullSvg, "circle")) {
    const centerX = Number(attribute(tag, "cx"));
    const centerY = Number(attribute(tag, "cy"));
    const radius = Number(attribute(tag, "r"));
    assert([centerX, centerY, radius].every(Number.isFinite) && radius >= 0, "원 표시 좌표를 읽을 수 없습니다.");
    checkPoint([centerX - radius, centerY - radius], "원 표시의 왼쪽 위");
    checkPoint([centerX + radius, centerY + radius], "원 표시의 오른쪽 아래");
  }
  for (const tag of tags(fullSvg, "text")) {
    const x = Number(attribute(tag, "x"));
    const y = Number(attribute(tag, "y"));
    assert(inside(x, minimumX + 10, maximumX - 10) && inside(y, minimumY + 13, maximumY - 8), `글자 위치 (${x.toFixed(1)}, ${y.toFixed(1)})가 잘리기 쉬운 그림 가장자리에 있습니다.`);
  }
}

function auditSvg(prompt, variant, payload) {
  const fullSvg = String(prompt).match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
  const root = fullSvg.match(/<svg\b[^>]*>/)?.[0] || "";
  assert(root.includes("geometry-diagram") && root.includes("source41-angle-five"), "각도 개념탐구 5 전용 SVG가 없습니다.");
  assert(Number(attribute(root, "data-source41-angle-five-variant")) === variant, "SVG variant가 원문 문항과 다릅니다.");
  assert(!/NaN|undefined|null|Infinity/.test(fullSvg), "SVG에 깨진 계산값이 있습니다.");
  assert(tags(fullSvg, "text").some(tag => /source41-target-label/.test(attribute(tag, "class") || "")), "그림에 목표각 표시가 없습니다.");
  auditRayCoordinates(root, fullSvg);
  auditLabelSpacing(fullSvg);
  auditViewBoxBounds(fullSvg);
  auditSourceGeometry(fullSvg, variant);

  const rightMarks = tags(fullSvg, "path").filter(tag => attribute(tag, "data-right-angle") === "true").length;
  const equalMarks = (fullSvg.match(/data-equal-sector=/g) || []).length;
  const rotationArrows = (fullSvg.match(/data-rotation-arrow=/g) || []).length;
  if (variant === 0) {
    assert(rightMarks >= 1 && (fullSvg.match(/data-fold-ray=|data-ray-role="crease-/g) || []).length === 4, "두 번 접은 직사각형의 직각·접기 표시가 부족합니다.");
    assert(equalMarks === 0, "서로 다른 두 각에 같은 각 표시를 사용했습니다.");
    assert(!tags(fullSvg, "text").some(tag => attribute(tag, "data-label-role") === "right-complement"), "원문에 없는 보충각 숫자를 미리 보여 주고 있습니다.");
    assert(Number(attribute(root, "data-target-angle")) === payload.answerNumber, "두 번 접은 직사각형의 목표각 자료가 다릅니다.");
  } else if (variant === 2) {
    assert(rightMarks >= 1 && rotationArrows >= 1 && tags(fullSvg, "polygon").length === 2, "돌린 직각삼각형의 직각·회전 전후 표시가 부족합니다.");
  } else if (variant === 3) {
    assert((fullSvg.match(/class="[^"]*source41-fold-line/g) || []).length >= 1 && (fullSvg.match(/class="[^"]*source41-reflected-line/g) || []).length >= 1 && equalMarks >= 2, "접은 삼각형의 접은 선·포개진 선 표시가 부족합니다.");
  } else if (variant === 4) {
    assert(rightMarks >= 1 && equalMarks >= 2 && (fullSvg.match(/class="[^"]*source41-fold-line/g) || []).length >= 2, "접은 정사각형의 직각·같은 각 표시가 부족합니다.");
    assert(Number(attribute(root, "data-distractor-angle")) === payload.distractor, "다른 꼭짓점의 제시각 자료가 원문 구조와 다릅니다.");
    assert(tags(fullSvg, "text").some(tag => attribute(tag, "data-label-role") === "distractor"), "다른 꼭짓점의 제시각이 그림에 보이지 않습니다.");
    assert(tags(fullSvg, "text").filter(tag => /^fold-/.test(attribute(tag, "data-label-role") || "")).length === 1, "같은 표시로 알아내야 할 각의 숫자를 두 번 보여 주고 있습니다.");
  } else if (variant === 5) {
    assert(rightMarks >= 2 && (fullSvg.match(/data-triangle=/g) || []).length === 2, "겹친 두 직각삼각형의 삼각형·직각 표시가 부족합니다.");
  } else if (variant === 6) {
    assert(tags(fullSvg, "line").length >= 3 && fullSvg.includes("data-small-gap"), "두 비스듬한 선의 작은 각 근거가 없습니다.");
  } else if (variant === 7) {
    assert(rightMarks >= 1 && rotationArrows >= 1 && tags(fullSvg, "polygon").length === 1 && (fullSvg.match(/class="[^"]*source41-reflected-line/g) || []).length >= 1, "돌린 직각삼각형의 직각·회전 표시가 부족합니다.");
  } else if (variant === 9) {
    assert((fullSvg.match(/data-fold-side=/g) || []).length === 2 && (fullSvg.match(/data-reflection=/g) || []).length === 2 && equalMarks >= 4 && (fullSvg.match(/data-fold-correspondence=/g) || []).length === 2, "양쪽 접기의 접는 선·포개지는 선 표시가 부족합니다.");
  } else if (variant === 10) {
    assert((fullSvg.match(/data-ray-role="fold-/g) || []).length >= 5 && equalMarks >= 4, "두 번 접기의 네 접는 선·같은 각 표시가 부족합니다.");
  }
  return fullSvg;
}

function auditSourceAnchors() {
  const anchors = [
    [0, { large: 128, split: 44, answerNumber: 142 }],
    [2, { a: 30, rotation: 50, pivotAngle: 60, answerNumber: 110 }],
    [3, { p: 24, c: 100, first: 104, second: 28, answerNumber: 76 }],
    [4, { t: 62, distractor: 56, answerNumber: 146 }],
    [5, { a: 45, b: 30, e: 110, intermediate: 25, answerNumber: 125 }],
    [6, { outer: 30, inner: 45, gap: 15, answerNumber: 165 }],
    [7, { shown: 58, answerNumber: 32 }],
    [9, { gap: 30, halfGap: 15, leftCornerAngle: 50, rightCornerAngle: 55, answerNumber: 105 }],
    [10, { gap: 25, answerNumber: 80 }]
  ];
  for (const [variant, payload] of anchors) {
    try {
      assert(independentAnswer(variant, payload) === String(payload.answerNumber), `원문 기준 variant ${variant}의 답이 다릅니다.`);
    } catch (error) {
      failures.push(`원문 기준 variant ${variant}: ${error.message}`);
    }
  }
  check(180 - 100 + 24 === 104 && 2 * 104 - 180 === 28 && 104 - 28 === 76, "예제 5-3의 104°·28°·76° 계산이 다릅니다.");
}

auditSourceAnchors();

const inventoryItems = inventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 5);
const runtimeItems = runtimeInventory.items.filter(item => Number(item.unit) === 2 && Number(item.exploration) === 5);
check(inventoryItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${inventoryItems.length}`);
check(runtimeItems.length === 11, `브라우저용 원문 목록 항목 수가 11개가 아닙니다: ${runtimeItems.length}`);
check(inventoryItems.map(item => item.sourceItemId).join("|") === sourceItems.map(item => item[0]).join("|"), "원문 목록 순서와 source ID가 다릅니다.");
check(inventoryItems.map(item => item.typeLabel).join("|") === sourceItems.map(item => item[3]).join("|"), "원문 11문항의 쉬운 한글 유형명이 다릅니다.");
check(new Set(inventoryItems.map(item => item.typeLabel)).size === 11, "원문 11문항의 유형명이 서로 다르지 않습니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);

for (const [sourceId, variant, locked] of sourceItems) {
  const item = runtimeItems.find(entry => entry.sourceItemId === sourceId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceId);
  if (locked) {
    check(item?.reviewLocked === true && !item?.generatorKey, `${sourceId}가 검수 대기로 잠겨 있지 않습니다.`);
    check(!mapping, `${sourceId}가 공개 생성기 목록에 들어갔습니다.`);
    try {
      api.generate({ id: sourceId, name: item?.typeLabel || sourceId, generatorKey, variant }, 0, 0, 1, variant);
      failures.push(`${sourceId} 직접 생성이 차단되지 않았습니다.`);
    } catch (error) {
      check(/검수 대기|답이 하나/.test(error.message), `${sourceId} 잠금 오류 문구가 분명하지 않습니다: ${error.message}`);
    }
  } else {
    check(item?.reviewLocked === false && item?.generatorKey === generatorKey && item?.variant === variant, `${sourceId} 공개 연결이 다릅니다.`);
    check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceId} 전용 생성기 목록 연결이 다릅니다.`);
  }
}

const promptSets = new Map(safeVariants.map(variant => [variant, difficulties.map(() => new Set())]));
const shapeSets = new Map(safeVariants.map(variant => [variant, difficulties.map(() => new Set())]));
const complexitySums = new Map(safeVariants.map(variant => [variant, difficulties.map(() => 0)]));
let generatedCount = 0;

for (const variant of safeVariants) {
  const sourceId = sourceItems.find(item => item[1] === variant)?.[0];
  const sourceItem = runtimeItems.find(item => item.sourceItemId === sourceId && item.generatorKey === generatorKey);
  const type = { id: sourceItem.sourceItemId, name: sourceItem.typeLabel, generatorKey, variant };
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    const difficulty = difficulties[difficultyIndex];
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      const context = `variant ${variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey, "다른 생성기가 호출되었습니다.");
        assert(generated.prompt && generated.answer !== "" && generated.solution, "문제·정답·풀이가 비었습니다.");
        const visible = visibleText(`${generated.prompt} ${generated.answer} ${generated.solution}`);
        assert(/[가-힣]/.test(visible), "학생용 한글 문장이 없습니다.");
        assert(!/undefined|null|NaN|Infinity/.test(visible), "깨진 계산값이 보입니다.");
        assert(!/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(visible), "학생용 문장에 어려운 한자가 보입니다.");
        assert(!/[A-Za-z]/.test(visible), "학생용 문장에 불필요한 영문이 보입니다.");
        for (const term of [/순열/, /조합/, /방정식/, /미지수/, /삼각함수/, /라디안/, /보각/, /맞꼭지각/]) assert(!term.test(visible), `초등학생에게 어려운 표현 ${term}이 보입니다.`);
        assert(/^\d+$/.test(String(generated.answer)), `답이 한 개의 각도가 아닙니다: ${generated.answer}`);

        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds.get(variant), `검산 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant && evidence.payload.level === difficulty + 1, "variant 또는 난이도 자료가 다릅니다.");
        assert(Number.isFinite(evidence.payload.complexity), "난이도 복잡도 자료가 없습니다.");
        const independent = independentAnswer(variant, evidence.payload);
        assert(independent === evidence.declared && independent === String(generated.answer), `독립 답 ${independent}과 표시 답 ${generated.answer}이 다릅니다.`);
        assert(visibleText(generated.solution).length >= 40 && generated.solution.includes(independent), "풀이 단계 또는 최종 답이 부족합니다.");
        const fullSvg = auditSvg(generated.prompt, variant, evidence.payload);

        promptSets.get(variant)[difficultyIndex].add(generated.prompt);
        shapeSets.get(variant)[difficultyIndex].add(sourceShapeSignature(fullSvg));
        complexitySums.get(variant)[difficultyIndex] += evidence.payload.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
}

for (const variant of safeVariants) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets.get(variant)[difficultyIndex].size >= 10, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 ${promptSets.get(variant)[difficultyIndex].size}개뿐입니다.`);
    if ([3, 4, 5, 6, 10].includes(variant)) check(shapeSets.get(variant)[difficultyIndex].size >= 10, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 원문 구조 도형 좌표 다양성이 ${shapeSets.get(variant)[difficultyIndex].size}개뿐입니다.`);
  }
  const averages = complexitySums.get(variant).map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 복잡도 평균이 증가하지 않습니다 (${averages.map(value => value.toFixed(1)).join(", ")}).`);
}

check(generatedCount === safeVariants.length * difficulties.length * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 각도 개념탐구 5 전용 감사 실패: ${failures.length}건`);
  const grouped = new Map();
  for (const failure of failures) {
    const reason = failure.replace(/^variant \d+ \/ 난이도 -?\d+ \/ 시드 \d+: /, "");
    grouped.set(reason, (grouped.get(reason) || 0) + 1);
  }
  console.error([...grouped.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([reason, count]) => `${count}건: ${reason}`).join("\n"));
  console.error(failures.slice(0, 160).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 5 전용 감사 통과: 원문 11항목 · 공개 9 · 검수 대기 2 · ${generatedCount.toLocaleString()}회 독립 검산 · SVG 광선 좌표/직각/답/풀이/한글/다양성 확인`);
console.log("원문 기준 답: 142° · 잠금 · 110° · 76° · 146° · 125° · 165° · 32° · 잠금 · 105° · 80°");
