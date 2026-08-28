"use strict";

const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(__dirname, "source-inventory");
const inventoryPath = path.join(directory, "4-1-source-items.json");
const partial = JSON.parse(fs.readFileSync(path.join(directory, "4-1-source-items.partial.json"), "utf8"));
const typeLanguage = JSON.parse(fs.readFileSync(path.join(directory, "4-1-type-language.json"), "utf8"));
const componentNames = ["4-1-units-1-2.json", "4-1-units-3-4.json", "4-1-units-5-6.json"];
const components = componentNames.map(name => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8")));
const sectionOrder = { exploration: 0, example: 1, mission: 2 };
const typeLabelOverrides = new Map(Object.entries(typeLanguage.overrides || {}));

const items = components.flatMap(component => component.items || []).map(item => ({
  ...item,
  typeLabel: typeLabelOverrides.get(item.sourceItemId) || item.typeLabel,
  typeLanguageVerified: true
})).sort((a, b) =>
  a.unit - b.unit ||
  a.exploration - b.exploration ||
  sectionOrder[a.sourceSection] - sectionOrder[b.sourceSection] ||
  a.sourceItemLabel.localeCompare(b.sourceItemLabel, "ko", { numeric: true })
);
const itemIds = new Set(items.map(item => item.sourceItemId));
for (const sourceItemId of typeLabelOverrides.keys()) {
  if (!itemIds.has(sourceItemId)) throw new Error(`쉬운 한글 유형명에 존재하지 않는 원문 ID가 있습니다: ${sourceItemId}`);
}
const exceptions = components.flatMap(component => component.exceptions || partial.missingSourceSlots || []);
const uniqueExceptions = [...new Map(exceptions.map(item => [item.sourceItemId, item])).values()];

const inventory = {
  schemaVersion: 1,
  status: "verified-source-inventory",
  source: {
    title: partial.source.title,
    fileName: partial.source.fileName,
    reviewMethod: partial.source.reviewMethod,
    ocrAcceptedAsEvidence: false
  },
  countingRule: {
    oneExplorationBlockIsOneType: true,
    oneNumberedExampleIsOneType: true,
    oneNumberedMissionIsOneType: true,
    splitSubquestions: false
  },
  languagePolicy: {
    audience: "elementary-student-parent-teacher",
    sourceLocationIsNotTypeName: true,
    childReadableKoreanTypeNameRequired: true,
    description: typeLanguage.policy
  },
  totals: {
    units: 6,
    groups: 30,
    items: items.length,
    exploration: items.filter(item => item.sourceSection === "exploration").length,
    example: items.filter(item => item.sourceSection === "example").length,
    mission: items.filter(item => item.sourceSection === "mission").length
  },
  exceptions: uniqueExceptions,
  items
};

fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);

const lines = [
  "# 4-1 원문 문항별 유형 목록",
  "",
  "- 기준: 개념탐구 본문 1개, 번호가 붙은 예제 1개, 번호가 붙은 Mission 1개를 각각 한 유형으로 기록",
  "- 소문항은 하나의 원문 번호 안에서 분리하지 않음",
  `- 합계: ${inventory.totals.items}유형 (개념탐구 ${inventory.totals.exploration}, 유제 ${inventory.totals.example}, Mission ${inventory.totals.mission})`,
  "- 예외: 3단원 개념탐구 6에는 원문 예제 6-4가 없음",
  ""
];

let activeGroup = "";
const groupsWithReviewLocks = new Set(items.filter(item => item.implementationStatus === "review-locked" || item.reviewReason || item.reviewLockReason).map(item => `${item.unit}-${item.exploration}`));
for (const item of items) {
  const group = `${item.unit}-${item.exploration}`;
  if (group !== activeGroup) {
    activeGroup = group;
    const header = groupsWithReviewLocks.has(group)
      ? ["| 원문 항목 | 유형명 | 상태 | PDF | 교재 |", "| --- | --- | --- | ---: | ---: |"]
      : ["| 원문 항목 | 유형명 | PDF | 교재 |", "| --- | --- | ---: | ---: |"];
    lines.push(`## ${item.unit}. ${item.unitName} - 개념탐구 ${item.exploration}. ${item.groupTitle}`, "", ...header);
  }
  if (groupsWithReviewLocks.has(group)) {
    const reason = item.reviewReason || item.reviewLockReason;
    const status = item.implementationStatus === "review-locked" || reason ? `잠금: ${reason || "검수 대기"}` : "공개";
    lines.push(`| ${item.sourceItemLabel} | ${item.typeLabel} | ${status} | ${item.sourcePdfPage} | ${item.sourcePrintedPage} |`);
  } else {
    lines.push(`| ${item.sourceItemLabel} | ${item.typeLabel} | ${item.sourcePdfPage} | ${item.sourcePrintedPage} |`);
  }
}

fs.writeFileSync(path.join(directory, "4-1-source-items.md"), `${lines.join("\n")}\n`);
console.log(`4-1 원문 목록 생성: ${inventory.totals.items}유형`);
