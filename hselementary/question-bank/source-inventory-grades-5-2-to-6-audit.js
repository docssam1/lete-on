"use strict";

const fs = require("fs");
const path = require("path");

const root = process.env.HSE_SOURCE_INVENTORY_ROOT || __dirname;
const specs = [
  {
    semester: "5-2",
    file: "5-2-source-items.json",
    arrayKey: "sourceItems",
    total: 286,
    units: [44, 44, 88, 22, 44, 44],
    sections: { exploration: 26, example: 104, mission: 156 }
  },
  {
    semester: "6-1",
    file: "6-1-source-items.json",
    arrayKey: "items",
    total: 264,
    units: [22, 44, 44, 67, 43, 44],
    sections: { exploration: 27, example: 93, mission: 144 },
    statuses: { "review-locked": 38, "fixed-verified-pool": 206, implemented: 20 }
  },
  {
    semester: "6-2",
    file: "6-2-source-items.json",
    arrayKey: "items",
    total: 355,
    units: [66, 69, 44, 66, 66, 44],
    sections: { exploration: 35, example: 128, mission: 192 },
    statuses: { "review-locked": 200, "fixed-verified-pool": 148, "verified-fixed-pool": 2,
      "source-rebuilt-answer-reading-locked": 1, "handwriting-conflict-locked": 2,
      "source-condition-ambiguity-locked": 1, "source-decimal-place-ambiguity-locked": 1 }
  }
];

// A blank hold reason is valid only when every corresponding public type is released.
// Four source blocks are intentionally represented by two independent runtime types.
global.window = global.window || {};
require("./source-inventory-grade6.js");
const publicGrade6Items = window.HSE_SOURCE_INVENTORY_GRADE6.items;
require("./curriculum.js");
const runtimeTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units).flatMap(unit => unit.subunits).flatMap(subunit => subunit.types);
function verifiedLockedPractice(item) {
  const matches = runtimeTypes.filter(type => type.id === item.syntheticRuntimeTypeId);
  return item.sourceVerified === true && item.publicDecision === "locked" && item.publisherKeyVerified === false &&
    item.syntheticRuntimeTypeId === item.sourceItemId && matches.length === 1 && matches[0].sourceItemId === item.syntheticRuntimeTypeId &&
    matches[0].reviewLocked === false && matches[0].sourceVerified === true &&
    typeof matches[0].generatorKey === "string" && matches[0].generatorKey.length > 0 &&
    matches[0].verifiedVariantTarget === 3 && matches[0].verifiedVariantCount === 3;
}

const splitPublicIds = {
  "6-2-u3-e2-exploration": ["6-2-u3-e2-exploration-1", "6-2-u3-e2-exploration-2"],
  "6-2-u3-e3-example-3": ["6-2-u3-e3-example-3-1", "6-2-u3-e3-example-3-2"],
  "6-2-u3-e3-mission-5": ["6-2-u3-e3-mission-5-1", "6-2-u3-e3-mission-5-2"],
  "6-2-u3-e3-mission-6": ["6-2-u3-e3-mission-6-1", "6-2-u3-e3-mission-6-2"]
};
function releasedPublicCounterparts(item) {
  if (!["fixed-verified-pool", "verified-fixed-pool"].includes(item.implementationStatus) || item.sourceVerified !== true) return false;
  const ids = splitPublicIds[item.sourceItemId] || [item.publicSourceItemId || item.sourceItemId];
  return ids.every(id => {
    const matches = publicGrade6Items.filter(publicItem => publicItem.sourceItemId === id);
    return matches.length === 1 && (id === item.sourceItemId || splitPublicIds[item.sourceItemId]?.includes(id) || matches[0].rawSourceItemId === item.sourceItemId) &&
      matches[0].reviewLocked === false && matches[0].sourceVerified === true &&
      typeof matches[0].generatorKey === "string" && matches[0].generatorKey.length > 0 &&
      matches[0].verifiedVariantTarget > 0 && matches[0].verifiedVariantCount === matches[0].verifiedVariantTarget &&
      matches[0].answerVisualStatus === "verified";
  });
}

const failures = [];
const verified5_2Page49 = new Set([...([2, 3, 4, 5, 6].map(n => `5-2-u5-e1-mission-${n}`)), "5-2-u5-e1-example-2", "5-2-u5-e1-example-3", ...([1, 2, 3, 4].map(n => `5-2-u5-e2-example-${n}`)), ...([1, 2, 3, 4, 5, 6].map(n => `5-2-u5-e2-mission-${n}`)), ...([1, 2, 3, 4].map(n => `5-2-u5-e4-example-${n}`)), "5-2-u5-e4-exploration", "5-2-u6-e1-exploration", "5-2-u6-e1-example-1", "5-2-u6-e1-example-2", "5-2-u6-e1-example-3", "5-2-u6-e1-example-4", "5-2-u6-e1-mission-1", "5-2-u6-e1-mission-2", "5-2-u6-e1-mission-3", "5-2-u6-e1-mission-4", "5-2-u6-e1-mission-5", "5-2-u6-e1-mission-6", "5-2-u6-e2-exploration", "5-2-u6-e2-example-1", "5-2-u6-e2-example-2", "5-2-u6-e2-example-4", "5-2-u6-e2-mission-1", "5-2-u6-e2-mission-2", "5-2-u6-e2-mission-3", "5-2-u6-e2-mission-5", "5-2-u6-e2-mission-6", "5-2-u1-e3-example-1", "5-2-u1-e3-example-2", "5-2-u6-e4-exploration", ...([1,2,3,4,5,6].map(n => `5-2-u6-e4-mission-${n}`)), ...([1,2,4].map(n => `5-2-u6-e4-example-${n}`)), "5-2-u6-e3-exploration", ...([1,2,3,4,6].map(n => `5-2-u6-e3-mission-${n}`)), ...([1,2,3,4].map(n => `5-2-u6-e3-example-${n}`)), ...([1, 2, 3, 4, 5, 6].map(n => `5-2-u5-e4-mission-${n}`))]);
// These records were source-reviewed locally while their original release remains locked.
// The registered practice must remain separately verified; this list is not a release grant.
const verified5_2LockedPractice = new Set([
  "5-2-u3-e1-exploration",
  ...[1, 2].flatMap(e => [`5-2-u4-e${e}-exploration`, ...[1, 2, 3, 4].map(n => `5-2-u4-e${e}-example-${n}`), ...[1, 2, 3, 4, 5, 6].map(n => `5-2-u4-e${e}-mission-${n}`)])
]);
const reviewed5_2Releases = new Set(["5-2-u1-e4-mission-1", "5-2-u3-e4-example-2", "5-2-u3-e4-mission-4", "5-2-u3-e4-mission-5", "5-2-u3-e4-mission-6"]);
const allIds = new Set();
const semesterCounts = {};

function fail(message) {
  failures.push(message);
}

function isNonEmpty(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0 && value.every(isNonEmpty);
  return value !== null && value !== undefined;
}

function isPrivateMetadata(metadata) {
  const text = JSON.stringify(metadata).toLowerCase();
  return (
    (text.includes("private") || text.includes("비공개")) &&
    (text.includes("public") || text.includes("공개"))
  );
}

function matchesSourceId(item, semester) {
  if (item.section === "exploration") {
    return new RegExp(`^${semester}-u\\d+-e\\d+-exploration(?:-\\d+(?:-\\d+)?)?$`).test(item.sourceItemId);
  }
  return new RegExp(`^${semester}-u\\d+-e\\d+-(example|mission)-\\d+(?:-\\d+)?$`).test(item.sourceItemId);
}

for (const spec of specs) {
  const filePath = path.join(root, "source-inventory", spec.file);
  let document;
  try {
    document = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`${spec.semester}: JSON을 읽을 수 없습니다: ${error.message}`);
    continue;
  }

  if (document.schemaVersion !== 1) fail(`${spec.semester}: schemaVersion이 1이 아닙니다.`);
  if (typeof document.status !== "string" || !document.status.includes("private")) {
    fail(`${spec.semester}: private 장부 status가 없습니다.`);
  }
  if (!isPrivateMetadata(document.metadata)) {
    fail(`${spec.semester}: metadata에 private/non-public 보안 의미가 없습니다.`);
  }

  const items = document[spec.arrayKey];
  if (!Array.isArray(items)) {
    fail(`${spec.semester}: ${spec.arrayKey} 배열이 없습니다.`);
    continue;
  }
  semesterCounts[spec.semester] = items.length;
  if (items.length !== spec.total) fail(`${spec.semester}: 총 ${spec.total}개가 아닙니다 (${items.length}).`);

  const byUnit = new Map();
  const bySection = { exploration: 0, example: 0, mission: 0 };
  const byStatus = {};
  let verifiedCount = 0;
  for (const [index, item] of items.entries()) {
    const label = `${spec.semester}[${index}]`;
    const required = ["sourceItemId", "unitId", "exploration", "section", "ordinal", "pdfPage", "sourceShape", "reviewReason", "visualRisk", "implementationStatus", "sourceVerified"];
    for (const field of required) {
      if (!(field in item)) fail(`${label}: 필수 필드 ${field}가 없습니다.`);
    }
    if (typeof item.sourceItemId !== "string" || !matchesSourceId(item, spec.semester)) {
      fail(`${label}: sourceItemId 형식이 semester-unit-exploration-section-ordinal 규칙과 다릅니다.`);
    }
    if (typeof item.unitId !== "string" || !new RegExp(`^${spec.semester}-u[1-6]$`).test(item.unitId)) {
      fail(`${label}: unitId가 ${spec.semester}-u1~u6 형식이 아닙니다.`);
    }
    if (!Number.isInteger(item.exploration) || item.exploration < 1) fail(`${label}: exploration이 정수가 아닙니다.`);
    if (!["exploration", "example", "mission"].includes(item.section)) fail(`${label}: section 값이 잘못되었습니다.`);
    if (!Number.isInteger(item.ordinal) || item.ordinal < 1) fail(`${label}: ordinal이 정수가 아닙니다.`);
    if (!Number.isInteger(item.pdfPage) || item.pdfPage < 1) fail(`${label}: pdfPage가 양의 정수가 아닙니다.`);
    for (const field of ["sourceShape", "visualRisk"]) {
      if (!isNonEmpty(item[field])) fail(`${label}: ${field}가 비어 있습니다.`);
    }
    if (!isNonEmpty(item.reviewReason) && !(spec.semester === "6-2" && releasedPublicCounterparts(item))) {
      fail(`${label}: reviewReason가 비어 있으며 확인된 공개 유형 연결이 없습니다.`);
    }
    const status = item.implementationStatus;
    byStatus[status] = (byStatus[status] || 0) + 1;
    if (spec.semester === "5-2") {
      const expected = verified5_2Page49.has(item.sourceItemId) || verified5_2LockedPractice.has(item.sourceItemId) ? "verified-local" : reviewed5_2Releases.has(item.sourceItemId) ? "reviewed" : "review-locked";
      if (status !== expected) fail(`${label}: implementationStatus가 ${expected}가 아닙니다.`);
      if (verified5_2LockedPractice.has(item.sourceItemId) && !verifiedLockedPractice(item)) {
        fail(`${label}: 원문 잠금 또는 검증된 연습 유형 연결이 잘못되었습니다.`);
      }
    } else if (!(status in spec.statuses)) {
      fail(`${label}: 알 수 없는 implementationStatus ${status}`);
    }
    const locked = typeof status === "string" && status.includes("locked");
    if (typeof item.sourceVerified !== "boolean") fail(`${label}: sourceVerified가 참/거짓이 아닙니다.`);
    if (item.sourceVerified === false && !locked) {
      fail(`${label}: sourceVerified false인데 잠금이 아닙니다.`);
    }
    if (!locked && item.sourceVerified !== true) fail(`${label}: 생성 상태에 원문 확인이 없습니다.`);
    if (item.sourceVerified === true) verifiedCount += 1;
    if (allIds.has(item.sourceItemId)) fail(`${label}: sourceItemId 중복 ${item.sourceItemId}`);
    allIds.add(item.sourceItemId);
    byUnit.set(item.unitId, (byUnit.get(item.unitId) || 0) + 1);
    bySection[item.section] += 1;
  }

  if (spec.statuses) for (const [status,expected] of Object.entries(spec.statuses)) {
    if ((byStatus[status] || 0) !== expected) fail(`${spec.semester}: ${status} 수가 ${expected}가 아닙니다 (${byStatus[status] || 0}).`);
  }

  for (let unitNumber = 1; unitNumber <= 6; unitNumber += 1) {
    const unitId = `${spec.semester}-u${unitNumber}`;
    const actual = byUnit.get(unitId) || 0;
    if (actual !== spec.units[unitNumber - 1]) {
      fail(`${spec.semester} ${unitId}: ${spec.units[unitNumber - 1]}개가 아닙니다 (${actual}).`);
    }
  }
  for (const [section, expected] of Object.entries(spec.sections)) {
    if (bySection[section] !== expected) fail(`${spec.semester} ${section}: ${expected}개가 아닙니다 (${bySection[section]}).`);
    const recorded = document.integrity?.actualBySection?.[section];
    if (recorded !== undefined && recorded !== bySection[section]) fail(`${spec.semester} ${section}: 실제 항목 수와 장부에 기록한 실제 수가 다릅니다 (${bySection[section]} / ${recorded}).`);
  }
  if (spec.semester === "5-2" && verifiedCount !== 195) {
    fail(`5-2: sourceVerified true 항목은 195개여야 합니다 (${verifiedCount}).`);
  }
  if (spec.semester === "5-2" && items.some(item => item.implementationStatus === "reviewed" && (!reviewed5_2Releases.has(item.sourceItemId) || item.sourceVerified !== true))) {
    fail("5-2: reviewed 항목의 원문 확인 또는 명시 목록이 일치하지 않습니다.");
  }
  if (spec.semester === "5-2" && [...reviewed5_2Releases].some(id => items.filter(item => item.sourceItemId === id).length !== 1)) {
    fail("5-2: 검수 완료한 인쇄 30쪽 예제 4-2와 인쇄 31쪽 Mission 4–6 원문 항목이 각각 하나여야 합니다.");
  }
  if (spec.semester === "5-2") {
    const unit2 = document.units?.find(unit => unit.unitId === "5-2-u2");
    const unit2Items = items.filter(item => item.unitId === "5-2-u2");
    if (unit2?.sourcePdfContentPages?.join(",") !== "10,17" || unit2?.sourcePrintedContentPages?.join(",") !== "14,21" || unit2Items.length !== 44 || unit2Items.some(item => item.printedPage !== item.pdfPage + 4)) {
      fail("5-2 u2: 44개 원문 항목의 PDF/인쇄 페이지는 10–17 / 14–21과 일치해야 합니다.");
    }
    const unit3 = document.units?.find(unit => unit.unitId === "5-2-u3");
    if (unit3?.sourcePdfContentPages?.join(",") !== "20,35" || unit3?.sourcePrintedContentPages?.join(",") !== "24,39") {
      fail("5-2 u3: SHA-256 기준본의 PDF/인쇄 페이지 범위가 20–35 / 24–39가 아닙니다.");
    }
    const unit3Items = items.filter(item => item.unitId === "5-2-u3");
    if (unit3Items.length !== 88 || unit3Items.some(item => item.printedPage !== item.pdfPage + 4)) {
      fail("5-2 u3: 88개 항목의 인쇄 쪽이 기준 PDF의 실제 페이지 번호와 일치하지 않습니다.");
    }
    for (const [exploration, expectedLabel] of [[4, "합동의 활용 ②"], [5, "선대칭도형"]]) {
      const explorationItems = unit3Items.filter(item => item.exploration === exploration);
      if (explorationItems.length !== 11 || explorationItems.some(item => !item.sourceShape.includes(expectedLabel))) {
        fail(`5-2 u3 e${exploration}: 원문 단원명이 ${expectedLabel}로 일치하지 않습니다.`);
      }
    }
  }
}

const expectedTotal = specs.reduce((sum, spec) => sum + spec.total, 0);
if (allIds.size !== expectedTotal) fail(`전체 sourceItemId 고유 개수가 ${expectedTotal}가 아닙니다 (${allIds.size}).`);
if (failures.length) {
  console.error(`5-2~6 source inventory 감사 실패 (${failures.length}건)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`5-2~6 source inventory 감사 통과: ${expectedTotal} source items`);
console.log(`학기별: 5-2 ${semesterCounts["5-2"]}개 · 6-1 ${semesterCounts["6-1"]}개 · 6-2 ${semesterCounts["6-2"]}개`);
