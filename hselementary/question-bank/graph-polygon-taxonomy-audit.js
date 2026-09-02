"use strict";

global.window = {};
const polygonInventory = require("./source-inventory/4-2-unit-6-polygon.json");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const failures = [];
let generatedCount = 0;

const fail = message => failures.push(message);
const typeContext = (type, semesterId, unitId, unitName, subunitId, subunitName) => ({
  ...type,
  semesterId,
  unitId,
  unitName,
  subunitId,
  subunitName
});
const invalidOutputPattern = /\b(?:undefined|null|NaN|Infinity)\b|(?:^|[^\d])\d+(?:\.\d+)?\/0(?:[^\d]|$)/;

function auditSvgMetadata(type, generated, seed) {
  const output = `${generated.prompt} ${generated.solution}`;
  const svgTags = [...output.matchAll(/<svg\b([^>]*)>/g)];
  for (const match of svgTags) {
    const attributes = match[1];
    if (!/\bviewBox\s*=\s*["'][^"']+["']/.test(attributes)) {
      fail(`${type.id} / 시드 ${seed}: SVG viewBox 메타데이터가 없습니다.`);
    }
    if (!/\baria-label\s*=\s*["'][^"']+\S[^"']*["']/.test(attributes)) {
      fail(`${type.id} / 시드 ${seed}: SVG aria-label 메타데이터가 없습니다.`);
    }
  }
}

function auditCommonOutput(type, generated, seed) {
  if (!generated || typeof generated.prompt !== "string" || !generated.prompt.trim()
    || generated.answer === undefined || generated.answer === null
    || String(generated.answer).trim() === ""
    || typeof generated.solution !== "string" || !generated.solution.trim()) {
    fail(`${type.id} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
  }
  const visible = `${generated.prompt} ${generated.answer} ${generated.solution}`;
  if (invalidOutputPattern.test(visible)) {
    fail(`${type.id} / 시드 ${seed}: 잘못된 숫자 또는 계산 토큰이 노출됩니다.`);
  }
  auditSvgMetadata(type, generated, seed);
}

function auditLocked(type) {
  try {
    api.generate(type, 0, 0, 910000 + type.typeNumber, type.variant);
    fail(`${type.id}: 검수 대기 유형이 직접 생성되었습니다.`);
  } catch (error) {
    if (!/검수 대기/.test(String(error?.message || error))) {
      fail(`${type.id}: 잠금 오류 문구에 '검수 대기'가 없습니다.`);
    }
  }
}

function auditReady(type, expectedAnswer, sourceAttribute, seedLimit) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= seedLimit; seed += 1) {
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
        generatedCount += 1;
      } catch (error) {
        fail(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      auditCommonOutput(type, generated, seed);
      if (String(generated.answer) !== String(expectedAnswer)) {
        fail(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 정답 ${JSON.stringify(generated.answer)}가 원문 정답 ${JSON.stringify(expectedAnswer)}와 다릅니다.`);
      }
      if (!generated.prompt.includes(`data-source42-${sourceAttribute}="${type.sourceItemId}"`)) {
        fail(`${type.id} / 시드 ${seed}: 원문 문항 ID 표식이 생성기 분기와 일치하지 않습니다.`);
      }
      auditRegularPolygonAngleMetadata(type, generated.prompt, `${type.id} / 시드 ${seed}`);
    }
  }
}

function auditRegularPolygonAngleMetadata(type, output, label) {
  if (type.generatorKey !== "regularPolygonApplication") return;
  const contract = regularPolygonAngleContracts.get(type.variant);
  if (!contract) return;
  const values = name => [...output.matchAll(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "g"))].map(match => match[1]);
  const compact = value => String(value).replace(/[\s,\/]/g, "");
  const has = (name, expected) => expected === true
    ? values(name).some(value => String(value).trim())
    : values(name).some(value => compact(value) === compact(expected));
  const checks = [
    ["data-angle", contract.angle],
    ["data-adjacent-angle", contract.adjacentAngle],
    ["data-angle-rays", contract.angleRays],
    ["data-marked-vertex", contract.markedVertex],
    ["data-not-to-scale", contract.notToScale],
    ["data-given-angle", contract.givenAngle],
    ["data-coordinate-given-angle", contract.coordinateGivenAngle],
    ["data-coordinate-target-angle", contract.coordinateTargetAngle],
    ["data-intersection-segments", contract.intersectionSegments],
    ["data-polygon-orientation", contract.polygonOrientation],
    ["data-given-angle-rays", contract.givenAngleRays],
    ["data-right-angle", contract.rightAngle]
  ];
  for (const [name, expected] of checks) {
    if (expected !== undefined && !has(name, expected)) fail(`${label}: ${name} 메타데이터가 독립 기하 계약과 다릅니다.`);
  }
}

function collectTypes(unit) {
  return unit.subunits.flatMap(subunit => subunit.types.map(type =>
    typeContext(type, semester.id, unit.id, unit.name, subunit.id, subunit.name)));
}

function auditLineGraphUnit() {
  const unit = semester.units.find(item => item.id === "4-2-u5");
  const expectedCount = 20;
  const types = collectTypes(unit);
  if (types.length !== expectedCount) fail(`${unit.name}: ${types.length}유형이며 예상 ${expectedCount}유형과 다릅니다.`);
  for (const subunit of unit.subunits) {
    const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b);
    if (subunit.types.length !== 10 || variants.join(",") !== "0,1,2,3,4,5,6,7,8,9") {
      fail(`${subunit.name}: 원문 중복을 뺀 10개 분기와 다릅니다.`);
    }
  }
  for (const type of types) {
    if (!type.sourceVerified || !type.sourceEvidence.includes(type.label)) fail(`${type.id}: 유형별 원본 근거가 없습니다.`);
    if (![-1, 0, 1].includes(type.difficultyBand)) fail(`${type.id}: 심화 난이도 층이 없습니다.`);
    if (type.reviewLocked) {
      auditLocked(type);
      continue;
    }
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 20; seed += 1) {
        let generated;
        try {
          generated = api.generate(type, 0, difficulty, seed, type.variant);
          generatedCount += 1;
        } catch (error) {
          fail(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          continue;
        }
        auditCommonOutput(type, generated, seed);
        if (!generated.prompt.includes(`data-source42-line-item="${type.sourceItemId}"`)) {
          fail(`${type.id} / 시드 ${seed}: 원문 문항 ID와 생성기 분기가 다릅니다.`);
        }
      }
    }
  }
}

const expectedPolygonAnswers = new Map([
  ["polygonDiagonals", new Map([[0, 35], [1, 18], [2, 54], [3, 54], [4, "정10각형, 정12각형"], [5, 24], [6, 20], [7, 450], [8, 84], [9, "정15각형, 정18각형"], [10, "36cm, 27개"]])],
  ["regularPolygonApplication", new Map([[0, 36], [1, 15], [2, "60°, 453cm"], [3, 66], [4, 112.5], [5, 135], [6, 52], [7, 36], [8, 15], [9, 66], [10, 54]])],
  ["tessellationCover", new Map([[0, 8], [1, 12], [2, 4], [3, 7], [4, 8], [5, 36], [6, 4], [7, "상희"], [8, 24], [9, 16], [10, 34]])],
  ["shapePartitionCompose", new Map([[4, 9], [8, 48]])]
]);
const regularPolygonAngleContracts = new Map([
  [3, { angle: "66", adjacentAngle: "114", angleRays: "144210", markedVertex: "Q" }],
  [4, { angle: "112.5", adjacentAngle: "67.5", angleRays: true, markedVertex: "ㅂ", givenAngle: "45", givenAngleRays: "N-D;G-D", intersectionSegments: "G-N;G-R;G-D;G-M;N-D;R-M", polygonOrientation: "flat-top", rightAngle: "G-R-M" }],
  [5, { angle: "135", adjacentAngle: "45", angleRays: true, markedVertex: true }],
  [8, { angle: "15", adjacentAngle: "165", angleRays: true, markedVertex: true, notToScale: "true", givenAngle: "27", coordinateGivenAngle: "26.8725668", coordinateTargetAngle: "14.8725668" }],
  [9, { angle: "66", adjacentAngle: "114", angleRays: "144210", markedVertex: "ㅈ" }],
  [10, { angle: "54", adjacentAngle: "126", angleRays: true, markedVertex: "ㅂ" }]
]);
const expectedPolygonGenerators = new Map([
  ["정다각형과 대각선", "polygonDiagonals"],
  ["정다각형의 활용", "regularPolygonApplication"],
  ["평면 덮기", "tessellationCover"],
  ["도형 나누기와 만들기", "shapePartitionCompose"]
]);

function auditPolygonInventoryContract() {
  const unit = semester.units.find(item => item.id === "4-2-u6");
  const types = collectTypes(unit);
  const inventoryById = new Map();
  for (const item of polygonInventory.items) {
    if (inventoryById.has(item.sourceItemId)) fail(`원본 목록에 중복 sourceItemId가 있습니다: ${item.sourceItemId}`);
    inventoryById.set(item.sourceItemId, item);
  }
  if (polygonInventory.items.length !== 44) fail(`다각형 원본 목록은 44개여야 하나 ${polygonInventory.items.length}개입니다.`);
  const readyInventory = polygonInventory.items.filter(item => item.implementationStatus === "ready");
  const lockedInventory = polygonInventory.items.filter(item => item.implementationStatus === "review-locked");
  if (readyInventory.length !== 35) fail(`다각형 공개 원본은 35개여야 하나 ${readyInventory.length}개입니다.`);
  if (lockedInventory.length !== 9) fail(`다각형 검수 대기 원본은 9개여야 하나 ${lockedInventory.length}개입니다.`);
  if (types.length !== 44) fail(`다각형 단원은 44유형이어야 하나 ${types.length}개입니다.`);

  const curriculumBySourceId = new Map();
  for (const type of types) {
    if (curriculumBySourceId.has(type.sourceItemId)) fail(`교육과정에 중복 sourceItemId가 있습니다: ${type.sourceItemId}`);
    curriculumBySourceId.set(type.sourceItemId, type);
    const inventoryItem = inventoryById.get(type.sourceItemId);
    if (!inventoryItem) {
      fail(`${type.id}: 원본 목록에 없는 sourceItemId입니다.`);
      continue;
    }
    for (const [field, label] of [["sourceSection", "문제 구분"], ["sourcePdfPage", "PDF 쪽"], ["sourcePrintedPage", "교재 쪽"]]) {
      if (type[field] !== inventoryItem[field]) fail(`${type.id}: ${label}이 원본 목록과 다릅니다.`);
    }
    const inventoryLocked = inventoryItem.implementationStatus === "review-locked";
    if (Boolean(type.reviewLocked) !== inventoryLocked) fail(`${type.id}: 교육과정과 원본 목록의 잠금 상태가 다릅니다.`);
    if (inventoryLocked && (!type.reviewReason || !String(type.reviewReason).trim())) fail(`${type.id}: 검수 대기 사유가 없습니다.`);
    if (!type.sourceVerified || !type.sourceEvidence.includes(type.label)) fail(`${type.id}: 유형별 원본 근거가 없습니다.`);
    if (type.label !== inventoryItem.typeLabel || type.name !== inventoryItem.typeLabel) fail(`${type.id}: 평면 유형명이 원본 목록과 다릅니다.`);
    if (![-1, 0, 1].includes(type.difficultyBand)) fail(`${type.id}: 심화 난이도 층이 없습니다.`);
    if (expectedPolygonGenerators.get(type.subunitName) !== type.generatorKey) fail(`${type.id}: 소단원과 생성기 연결이 다릅니다.`);
    if (!Number.isInteger(type.variant) || type.variant < 0 || type.variant > 10) fail(`${type.id}: 변형 번호가 0~10이 아닙니다.`);
  }
  for (const item of polygonInventory.items) {
    if (!curriculumBySourceId.has(item.sourceItemId)) fail(`${item.sourceItemId}: 원본 목록 항목이 교육과정에 없습니다.`);
  }
  for (const subunit of unit.subunits) {
    const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b);
    if (subunit.types.length !== 11 || variants.join(",") !== "0,1,2,3,4,5,6,7,8,9,10") {
      fail(`${subunit.name}: 원문 기준 11개 변형 0~10이 아닙니다.`);
    }
  }

  for (const type of types) {
    const answerMap = expectedPolygonAnswers.get(type.generatorKey);
    const expectedAnswer = answerMap?.get(type.variant);
    if (type.reviewLocked) {
      auditLocked(type);
    } else if (!answerMap || !answerMap.has(type.variant)) {
      fail(`${type.id}: 공개 유형의 원문 정답 계약이 없습니다.`);
    } else {
      auditReady(type, expectedAnswer, "polygon-item", 200);
    }
  }
}

function auditIndependentSourceGeometry() {
  const angleAt = (first, vertex, second) => {
    const a = [first[0] - vertex[0], first[1] - vertex[1]];
    const b = [second[0] - vertex[0], second[1] - vertex[1]];
    const cosine = (a[0] * b[0] + a[1] * b[1]) / Math.hypot(...a) / Math.hypot(...b);
    return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
  };
  const intersect = (first, second, third, fourth) => {
    const denominator = (first[0] - second[0]) * (third[1] - fourth[1]) - (first[1] - second[1]) * (third[0] - fourth[0]);
    const firstCross = first[0] * second[1] - first[1] * second[0];
    const secondCross = third[0] * fourth[1] - third[1] * fourth[0];
    return [
      (firstCross * (third[0] - fourth[0]) - (first[0] - second[0]) * secondCross) / denominator,
      (firstCross * (third[1] - fourth[1]) - (first[1] - second[1]) * secondCross) / denominator
    ];
  };
  const close = (actual, expected) => Math.abs(actual - expected) < 1e-9;

  const short = Math.sin(Math.PI / 8), long = Math.cos(Math.PI / 8);
  const g = [-short, long], r = [long, short], d = [long, -short], m = [short, -long], n = [-long, -short];
  const b = intersect(g, m, n, d);
  if (!close(angleAt(g, b, d), 112.5)) fail("예제 2-4 독립 좌표 계산에서 ∠ㄱㅂㄷ이 112.5°가 아닙니다.");
  if (!close(angleAt(g, r, m), 90)) fail("예제 2-4 독립 좌표 계산에서 ∠ㄱㄹㅁ이 직각이 아닙니다.");
  if (!close(angleAt(g, d, n), 45)) fail("예제 2-4 독립 좌표 계산에서 ∠ㄱㄷㄴ이 45°가 아닙니다.");

  const stepVectors = [[1, 0], [0, -1], [1, -1], [0, -1], [-1, 1], [-1, 0], [0, -1], [-1, 1], [0, 1]];
  const stepLengths = [1, 1, 2, 1, 1, 1, 1, 1, 3];
  const axial = [[0, 0]];
  stepVectors.forEach(([dq, dr], index) => {
    const previous = axial.at(-1), length = stepLengths[index];
    axial.push([previous[0] + dq * length, previous[1] + dr * length]);
  });
  if (axial.at(-1)[0] !== 0 || axial.at(-1)[1] !== 0) fail("Mission 3의 삼각 격자 바깥선이 닫히지 않습니다.");
  const cartesian = axial.slice(0, -1).map(([q, rValue]) => [q + rValue / 2, rValue * Math.sqrt(3) / 2]);
  const doubledArea = Math.abs(cartesian.reduce((sum, point, index) => {
    const next = cartesian[(index + 1) % cartesian.length];
    return sum + point[0] * next[1] - point[1] * next[0];
  }, 0));
  const unitTriangles = doubledArea / (Math.sqrt(3) / 2);
  const perimeterUnits = stepLengths.reduce((sum, length) => sum + length, 0);
  const reflexAngle = 360 - angleAt(cartesian[1], cartesian[2], cartesian[3]);
  if (!close(unitTriangles, 12) || perimeterUnits !== 12 || !close(reflexAngle, 240)) fail("Mission 3 독립 격자 계산의 조각 수·둘레·오목한 각이 12·12·240과 다릅니다.");
  const studentClaims = [close(unitTriangles, 11), close(reflexAngle, 240), perimeterUnits * 2 === 22];
  if (studentClaims.filter(Boolean).length !== 1 || !studentClaims[1]) fail("Mission 3에서 맞는 설명이 상희 하나로 정해지지 않습니다.");
}

auditLineGraphUnit();
auditPolygonInventoryContract();
auditIndependentSourceGeometry();

if (failures.length) {
  console.error(`4-2 그래프·다각형 유형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-2 꺾은선그래프 20개 + 다각형 원문 44개 · ${generatedCount.toLocaleString()}회 생성 검수 통과`);
