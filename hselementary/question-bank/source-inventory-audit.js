"use strict";

const fs = require("node:fs");
const path = require("node:path");

const inventoryPath = path.join(__dirname, "source-inventory", "4-1-source-items.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const items = inventory.items || inventory.records || [];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(items.length === 329, `4-1 원문 항목은 329개여야 하나 ${items.length}개입니다.`);

const ids = new Set();
const sections = { exploration: 0, example: 0, mission: 0 };
const groups = new Map();

for (const item of items) {
  check(Number.isInteger(item.unit) && item.unit >= 1 && item.unit <= 6, `${item.sourceItemId || "항목"}: 대단원이 올바르지 않습니다.`);
  check(Boolean(item.unitName), `${item.sourceItemId || "항목"}: 대단원명이 없습니다.`);
  check(Number.isInteger(item.exploration) && item.exploration >= 1, `${item.sourceItemId || "항목"}: 개념탐구 번호가 없습니다.`);
  check(Boolean(item.groupTitle), `${item.sourceItemId || "항목"}: 개념탐구 묶음명이 없습니다.`);
  check(Boolean(item.sourceItemId), "고유 원문 문항 ID가 없는 항목이 있습니다.");
  check(!ids.has(item.sourceItemId), `${item.sourceItemId}: 원문 문항 ID가 중복됩니다.`);
  ids.add(item.sourceItemId);
  check(Object.hasOwn(sections, item.sourceSection), `${item.sourceItemId}: 구간 값이 올바르지 않습니다.`);
  if (Object.hasOwn(sections, item.sourceSection)) sections[item.sourceSection] += 1;
  check(Boolean(item.sourceItemLabel), `${item.sourceItemId}: 원문 문항 표기가 없습니다.`);
  check(Number.isInteger(item.sourcePdfPage) && item.sourcePdfPage >= 8 && item.sourcePdfPage <= 77, `${item.sourceItemId}: PDF 쪽이 범위를 벗어납니다.`);
  check(Number.isInteger(item.sourcePrintedPage) && item.sourcePrintedPage >= 4 && item.sourcePrintedPage <= 73, `${item.sourceItemId}: 교재 쪽이 범위를 벗어납니다.`);
  check(Boolean(item.typeLabel && item.typeLabel.trim()), `${item.sourceItemId}: 유형명이 비었습니다.`);
  check(item.sourceVerified === true, `${item.sourceItemId}: 시각 대조 확인 표시가 없습니다.`);

  const groupKey = `${item.unit}-${item.exploration}`;
  if (!groups.has(groupKey)) groups.set(groupKey, []);
  groups.get(groupKey).push(item);
}

check(ids.size === 329, `고유 원문 문항 ID는 329개여야 하나 ${ids.size}개입니다.`);
check(sections.exploration === 30, `개념탐구는 30개여야 하나 ${sections.exploration}개입니다.`);
check(sections.example === 119, `유제는 119개여야 하나 ${sections.example}개입니다.`);
check(sections.mission === 180, `Mission은 180개여야 하나 ${sections.mission}개입니다.`);
check(groups.size === 30, `개념탐구 묶음은 30개여야 하나 ${groups.size}개입니다.`);

for (const [groupKey, groupItems] of groups) {
  const expected = groupKey === "3-6" ? 10 : 11;
  const groupSections = { exploration: 0, example: 0, mission: 0 };
  for (const item of groupItems) groupSections[item.sourceSection] += 1;
  check(groupItems.length === expected, `${groupKey}: 원문 항목은 ${expected}개여야 하나 ${groupItems.length}개입니다.`);
  check(groupSections.exploration === 1, `${groupKey}: 개념탐구 본문은 1개여야 합니다.`);
  check(groupSections.example === (groupKey === "3-6" ? 3 : 4), `${groupKey}: 유제 수가 원문과 다릅니다.`);
  check(groupSections.mission === 6, `${groupKey}: Mission은 6개여야 합니다.`);
}

const exceptions = inventory.exceptions || inventory.missingSourceSlots || [];
const missingExample = exceptions.find(item => item.sourceItemId === "4-1-u3-e6-example-6-4");
check(Boolean(missingExample), "원문에 없는 예제 6-4 결번 기록이 없습니다.");

if (failures.length) {
  console.error(`4-1 원문 문항 목록 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log("4-1 원문 문항 목록 감사 통과: 개념탐구 30 + 유제 119 + Mission 180 = 329유형");
