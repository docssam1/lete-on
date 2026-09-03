"use strict";

const fs = require("fs");
const path = require("path");

const root = __dirname;
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
    units: [22, 44, 44, 66, 44, 44],
    sections: { exploration: 24, example: 96, mission: 144 }
  },
  {
    semester: "6-2",
    file: "6-2-source-items.json",
    arrayKey: "items",
    total: 352,
    units: [66, 66, 44, 66, 66, 44],
    sections: { exploration: 32, example: 128, mission: 192 }
  }
];

const failures = [];
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
    return new RegExp(`^${semester}-u\\d+-e\\d+-exploration$`).test(item.sourceItemId);
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
    for (const field of ["sourceShape", "reviewReason", "visualRisk"]) {
      if (!isNonEmpty(item[field])) fail(`${label}: ${field}가 비어 있습니다.`);
    }
    if (item.implementationStatus !== "review-locked") fail(`${label}: implementationStatus가 review-locked가 아닙니다.`);
    if (item.sourceVerified === false && item.implementationStatus !== "review-locked") {
      fail(`${label}: sourceVerified false인데 잠금이 아닙니다.`);
    }
    if (item.sourceVerified === true) verifiedCount += 1;
    if (allIds.has(item.sourceItemId)) fail(`${label}: sourceItemId 중복 ${item.sourceItemId}`);
    allIds.add(item.sourceItemId);
    byUnit.set(item.unitId, (byUnit.get(item.unitId) || 0) + 1);
    bySection[item.section] += 1;
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
  }
  if (spec.semester === "5-2" && verifiedCount !== 22) {
    fail(`5-2: sourceVerified true 항목은 22개여야 합니다 (${verifiedCount}).`);
  }
  if (spec.semester === "5-2" && items.some(item => item.sourceVerified === true && item.implementationStatus !== "review-locked")) {
    fail("5-2: sourceVerified true 항목 중 잠금이 아닌 항목이 있습니다.");
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
