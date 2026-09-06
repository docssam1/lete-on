"use strict";

const fs = require("fs");
const path = require("path");

const inventoryPath = path.join(__dirname, "source-inventory", "6-1-u6-source-readiness-review.json");
const raw = fs.readFileSync(inventoryPath, "utf8");
const inventory = JSON.parse(raw);
const items = inventory.items;
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const count = predicate => items.filter(predicate).length;
const requiredFields = [
  "sourceItemId", "normalizedTypeId", "sourceSection", "sourceItemLabel", "sourcePdfPage",
  "childFriendlyTypeLabel", "commonTypeId", "originalStructure", "conditions", "visualRequirement",
  "independentCalculation", "independentAnswer", "candidateAnswerCount", "singleAnswer",
  "sourceVerified", "calculationStatus", "implementationStatus", "publicDecision",
  "releaseStatus", "lockReason", "resultContract"
];
const publicE3Ids = new Set([
  "6-1-u6-e3-exploration", "6-1-u6-e3-example-1", "6-1-u6-e3-example-2", "6-1-u6-e3-example-3",
  "6-1-u6-e3-example-4", "6-1-u6-e3-mission-2", "6-1-u6-e3-mission-4", "6-1-u6-e3-mission-5", "6-1-u6-e3-mission-6"
]);
const lockedE3Ids = new Set(["6-1-u6-e3-mission-1", "6-1-u6-e3-mission-3"]);

assert(inventory.semester === "6-1" && inventory.unit === "6-1-u6", "6-1 6단원 분류표가 아닙니다.");
assert(items.length === 46, `원문 문항 수가 46이 아닙니다: ${items.length}`);
assert(new Set(items.map(item => item.sourceItemId)).size === 46, "중복 sourceItemId가 있습니다.");
assert(new Set(items.map(item => item.normalizedTypeId)).size === 46, "중복 normalizedTypeId가 있습니다.");
assert(items.every(item => item.sourcePdfPage >= 47 && item.sourcePdfPage <= 54), "원본 확인 쪽이 47~54쪽을 벗어납니다.");
assert(!/[A-Z]:\\\\/i.test(raw), "비공개 절대 경로가 분류표에 들어 있습니다.");

items.forEach(item => {
  requiredFields.forEach(field => assert(Object.hasOwn(item, field), `${item.sourceItemId}: ${field} 필드가 없습니다.`));
  assert(item.sourceVerified === true, `${item.sourceItemId}: 원본 확인 표시가 없습니다.`);
  if (publicE3Ids.has(item.sourceItemId)) {
    assert(item.implementationStatus === "fixed-verified-pool", `${item.sourceItemId}: 공개 구현 상태가 fixed-verified-pool이 아닙니다.`);
    assert(item.publicDecision === "public" && item.releaseStatus === "verified", `${item.sourceItemId}: 공개 검증 상태가 아닙니다.`);
    assert(item.lockReason === "", `${item.sourceItemId}: 공개 유형에 잠금 사유가 남아 있습니다.`);
  } else {
    assert(item.implementationStatus === "review-locked", `${item.sourceItemId}: 잠금 유형 상태가 review-locked가 아닙니다.`);
    assert(item.publicDecision === "locked" && item.releaseStatus === "locked", `${item.sourceItemId}: 잠금 유형의 공개 잠금이 빠졌습니다.`);
    assert(item.lockReason, `${item.sourceItemId}: 잠금 사유가 없습니다.`);
  }
  assert(Array.isArray(item.conditions) && item.conditions.length > 0, `${item.sourceItemId}: 원문 조건이 없습니다.`);
  assert(item.visualRequirement && item.visualRequirement !== "none", `${item.sourceItemId}: 입체 문항의 시각 조건이 없습니다.`);
  if (item.singleAnswer === true) {
    assert(item.candidateAnswerCount === 1, `${item.sourceItemId}: 단일 정답 후보 수가 1이 아닙니다.`);
    assert(item.independentAnswer !== null && item.independentAnswer !== "", `${item.sourceItemId}: 단일 정답 값이 없습니다.`);
    assert(item.calculationStatus === "checked", `${item.sourceItemId}: 독립 계산 확인이 빠졌습니다.`);
  } else {
    assert(item.independentAnswer === null, `${item.sourceItemId}: 확정되지 않은 답이 기록됐습니다.`);
    assert(item.calculationStatus === "needs-clarification", `${item.sourceItemId}: 추가 확인 상태가 아닙니다.`);
    assert(item.resultContract === "provisional", `${item.sourceItemId}: 미확정 문항의 답 계약이 provisional이 아닙니다.`);
  }
});

const bySourceSection = Object.fromEntries(["exploration", "example", "mission"].map(section => [section, count(item => item.sourceSection === section)]));
const beforeSplitIds = items.map(item => item.sourceItemId.replace(/-e4-exploration-[123]$/, "-e4-exploration"));
const actual = {
  sourceBlockCountBeforeSubquestionSplit: new Set(beforeSplitIds).size,
  sourceProblemCount: items.length,
  normalizedTypeCount: items.length,
  directlyReviewedCount: count(item => item.sourceVerified === true),
  sourceVerifiedCount: count(item => item.sourceVerified === true),
  bySourceSection,
  duplicateSourceItemIds: items.length - new Set(items.map(item => item.sourceItemId)).size,
  duplicateNormalizedTypeIds: items.length - new Set(items.map(item => item.normalizedTypeId)).size,
  unclassifiedItems: count(item => !item.commonTypeId || !item.childFriendlyTypeLabel),
  calculationCheckedCount: count(item => item.calculationStatus === "checked"),
  calculationNeedsClarificationCount: count(item => item.calculationStatus === "needs-clarification"),
  singleAnswerTrueCount: count(item => item.singleAnswer === true),
  singleAnswerFalseCount: count(item => item.singleAnswer === false),
  singleAnswerNullCount: count(item => item.singleAnswer === null),
  publicCandidateCount: count(item => item.publicDecision === "public"),
  lockedCount: count(item => item.releaseStatus === "locked"),
  allImplementationLocked: items.every(item => item.implementationStatus === "review-locked"),
  allReleaseLocked: items.every(item => item.releaseStatus === "locked")
};
Object.entries(actual).forEach(([key, value]) => {
  assert(JSON.stringify(inventory.integrity[key]) === JSON.stringify(value), `integrity.${key}가 실제 문항 집계와 다릅니다.`);
});

const cellsFromHeights = heights => {
  const cells = [];
  heights.forEach((row, y) => row.forEach((height, x) => {
    for (let z = 0; z < height; z += 1) cells.push([x, y, z]);
  }));
  return cells;
};
const exposedFaces = cells => {
  const occupied = new Set(cells.map(cell => cell.join(",")));
  const directions = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  return cells.reduce((sum, [x, y, z]) => sum + directions.filter(([dx, dy, dz]) => !occupied.has(`${x + dx},${y + dy},${z + dz}`)).length, 0);
};
const centeredThreeWayTunnel = [];
for (let x = 0; x < 3; x += 1) for (let y = 0; y < 3; y += 1) for (let z = 0; z < 3; z += 1) {
  if (!((y === 1 && z === 1) || (x === 1 && z === 1) || (x === 1 && y === 1))) centeredThreeWayTunnel.push([x, y, z]);
}
assert(exposedFaces(centeredThreeWayTunnel) === 72, "세 방향 구멍의 노출 면 수가 72가 아닙니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e1-example-3")?.independentAnswer === "648cm²", "세 방향 구멍의 겉넓이 답이 648cm²가 아닙니다.");

const factorTriples = value => {
  const triples = [];
  for (let a = 1; a <= value; a += 1) for (let b = a; b <= value; b += 1) {
    const c = value / (a * b);
    if (Number.isInteger(c) && c >= b) triples.push([a, b, c]);
  }
  return triples;
};
assert(factorTriples(12).length === 4, "정육면체 12개의 직육면체 모양 수가 4가 아닙니다.");
assert(factorTriples(48).length === 9, "정육면체 48개의 직육면체 모양 수가 9가 아닙니다.");
assert(Math.sqrt(48 * 84 * 112) === 672, "세 면 넓이로 구한 부피가 672cm³가 아닙니다.");
assert(30 + 12 === 3.5 * 12, "두 그릇의 같은 물 높이 42cm 계산이 맞지 않습니다.");
assert((16 * 16 * 10 + 1280) / (16 * 16) === 15, "돌을 넣은 뒤 물 높이 15cm 계산이 맞지 않습니다.");

const detachedSurface = 6 * (1 ** 2 + 2 ** 2 + 3 ** 2);
const candidateSurfaces = [detachedSurface - 2 * (1 + 1), detachedSurface - 2 * (1 + 4)];
assert(new Set(candidateSurfaces).size === 2 && candidateSurfaces.includes(80) && candidateSurfaces.includes(74), "크기가 다른 세 정육면체의 서로 다른 겉넓이 후보를 확인하지 못했습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e1-example-1")?.independentAnswer === "가장 큰 경우 80cm², 가장 작은 경우 74cm²", "서로 다른 세 정육면체의 겉넓이 극값 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e1-exploration")?.independentAnswer === "16개", "정육면체를 떼어 내는 최대 개수 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e1-example-2")?.independentAnswer === "216cm²", "3cm 계단 쌓기의 겉넓이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e1-mission-2")?.independentAnswer === "1536cm²", "8cm 계단 쌓기의 겉넓이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-exploration-1")?.independentAnswer === "6cm", "기울인 수조의 선분 길이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-exploration-2")?.independentAnswer === "16cm", "수조를 되돌린 뒤 물높이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-exploration-3")?.independentAnswer === "160/13cm", "막은 수조의 물높이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-example-2")?.independentAnswer === "144/17cm", "세 칸 수조의 물높이 답이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-example-3")?.independentAnswer === "375/23cm", "막대를 세운 그릇의 물높이 답이 375/23cm가 아닙니다.");
assert((40 * 20 * 15) / (40 * 20 - 8 * 8) === 375 / 23, "막대 밑면 8×8cm²를 뺀 물높이 계산이 375/23cm가 아닙니다.");
assert(20 * 40 * (50 - 45) + 2.5 * 1000 === 6500, "E4 예제 4-1의 수면 위 빈 공간과 넘친 물을 합한 돌 부피 계산이 6500cm³가 아닙니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-example-1")?.independentAnswer === "6500cm³", "E4 예제 4-1의 독립 답이 6500cm³가 아닙니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-mission-3")?.independentAnswer === "3600mL", "기울인 수조에서 쏟아진 물의 양이 맞지 않습니다.");
assert(items.find(item => item.sourceItemId === "6-1-u6-e4-mission-6")?.independentAnswer === "11.25cm", "두 칸 수조의 최종 물높이 답이 맞지 않습니다.");
assert(6750 / (25 * 9) === 30 && 13500 / ((15 + 25) * 30) === 11.25, "두 칸 수조의 공통 깊이와 최종 물높이 계산이 맞지 않습니다.");

const e3 = id => items.find(item => item.sourceItemId === id);
assert(publicE3Ids.size === 9 && lockedE3Ids.size === 2, "E3 공개·잠금 대상 수가 계약과 다릅니다.");
assert(items.filter(item => publicE3Ids.has(item.sourceItemId)).length === 9, "E3 공개 대상이 9개가 아닙니다.");
assert(items.filter(item => lockedE3Ids.has(item.sourceItemId)).every(item => item.implementationStatus === "review-locked" && item.publicDecision === "locked"), "Mission 1·3 잠금이 풀렸습니다.");
assert(e3("6-1-u6-e3-exploration")?.independentAnswer === "2738cm³", "개념탐구 3의 독립 답이 2738cm³가 아닙니다.");
assert(e3("6-1-u6-e3-example-1")?.independentAnswer === "280cm³", "예제 3-1의 독립 답이 280cm³가 아닙니다.");
assert(e3("6-1-u6-e3-example-2")?.independentAnswer === "1888cm²", "예제 3-2의 독립 답이 1888cm²가 아닙니다.");
assert(e3("6-1-u6-e3-example-3")?.independentAnswer === "672cm³", "예제 3-3의 독립 답이 672cm³가 아닙니다.");
assert(!/제곱근|√|\^/.test(e3("6-1-u6-e3-example-3")?.independentCalculation || ""), "예제 3-3 풀이에 초등 과정 밖 제곱근·거듭제곱 표기가 있습니다.");
assert(e3("6-1-u6-e3-example-4")?.independentAnswer === "432cm²", "예제 3-4의 독립 답이 432cm²가 아닙니다.");
assert(e3("6-1-u6-e3-mission-2")?.independentAnswer === "1080cm²", "Mission 2의 독립 답이 1080cm²가 아닙니다.");
assert(e3("6-1-u6-e3-mission-4")?.independentAnswer === "588cm³", "Mission 4의 독립 답이 588cm³가 아닙니다.");
assert(e3("6-1-u6-e3-mission-5")?.independentAnswer === "224cm³", "Mission 5의 독립 답이 224cm³가 아닙니다.");
assert(e3("6-1-u6-e3-mission-6")?.independentAnswer === "12층", "Mission 6의 독립 답이 12층이 아닙니다.");
const stairCells = [];
for (let z = 0; z < 4; z += 1) for (let x = 0; x < 4 - z; x += 1) for (let y = 0; y < 4 - z; y += 1) stairCells.push([x, y, z]);
assert(stairCells.length === 30, "예제 3-4의 계단 좌표가 30칸이 아닙니다.");
assert(exposedFaces(stairCells) === 72, "예제 3-4의 계단 노출면 수가 72가 아닙니다.");
assert(30 * 6 - exposedFaces(stairCells) === 108, "예제 3-4의 안쪽 공유면 수가 108이 아닙니다.");
const faceCounts = stairCells.reduce((counts, [x, y, z]) => {
  [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach(([dx, dy, dz]) => {
    const neighbor = stairCells.some(cell => cell[0] === x + dx && cell[1] === y + dy && cell[2] === z + dz);
    if (!neighbor) counts.exposed += 1;
  });
  return counts;
}, { exposed: 0 });
assert(faceCounts.exposed === 72, "예제 3-4의 좌표별 노출면 전수 계산이 72가 아닙니다.");

if (failures.length) {
  console.error(`6-1 부피와 겉넓이 원문 분류 감사 실패: ${failures.length}건`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`6-1 부피와 겉넓이 원문 분류 감사 통과: ${items.length}문항 · 공개 ${actual.publicCandidateCount} · 잠금 ${actual.lockedCount} · 단일 정답 ${actual.singleAnswerTrueCount} · 추가 확인 ${actual.singleAnswerNullCount}`);
