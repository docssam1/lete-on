"use strict";

const fs = require("node:fs");
const path = require("node:path");

const directory = path.join(__dirname, "source-inventory");
const outputPath = path.join(__dirname, "source-inventory-5-2.js");
const reviewFiles = [
  { unit: 1, file: "5-2-u1-readiness-review.json" },
  { unit: 2, file: "5-2-u2-readiness-review.json" }
];
const sectionOrder = { exploration: 0, example: 1, mission: 2 };
const publicLockReason = "원문 구조·그림·독립 검산·학습자 적합성 및 공개 승인 검토가 완료되기 전입니다.";

const readReview = ({ unit, file }) => {
  const review = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  const items = review.items || [];
  const directlyReviewed = review.summary?.directlyReviewedCount === items.length;
  if (!items.length || !directlyReviewed) {
    throw new Error(`${file}: 직접 대조 완료 항목 수와 실제 항목 수가 일치하지 않습니다.`);
  }

  const unitName = review.unitName || review.metadata?.unitName;
  if (!unitName) throw new Error(`${file}: 단원명이 없습니다.`);

  let unitOrdinal = 0;
  return items.map(item => {
    const sourceItemId = item.sourceItemId || item.id;
    const parsed = sourceItemId?.match(/^5-2-u(\d+)-e(\d+)-(exploration|example|mission)(?:-|$)/);
    if (!parsed) throw new Error(`${file}: 탐구 번호와 구간을 ID에서 읽을 수 없습니다: ${sourceItemId}`);
    if (Number(parsed[1]) !== unit) throw new Error(`${sourceItemId}: 파일 단원과 ID 단원이 다릅니다.`);

    const visual = item.visualAssetNeeded;
    const visualRequired = visual ? visual.required === true : item.visualRequirement !== "none";
    const visualKind = visual?.kind || null;
    const sourceVerified = item.sourceVerified === true || directlyReviewed;
    const normalizedTypeId = item.normalizedTypeId || `u${unit}-t${String(++unitOrdinal).padStart(2, "0")}`;

    if (!sourceItemId || !item.sourcePdfPage && !item.sourcePage || !item.sourcePrintedPage) {
      throw new Error(`${sourceItemId || file}: 공개 색인에 필요한 출처 식별 정보가 없습니다.`);
    }
    if (!item.typeLabel && !item.typeName) throw new Error(`${sourceItemId}: 어린이용 유형명이 없습니다.`);

    return {
      semester: "5-2",
      unit,
      unitName,
      exploration: Number(parsed[2]),
      sourceItemId,
      sourceItemLabel: item.sourceItemLabel || item.sourceBlock,
      typeLabel: item.typeLabel || item.typeName,
      typeLanguageVerified: true,
      normalizedTypeId,
      sourceSection: parsed[3],
      sourcePdfPage: item.sourcePdfPage ?? item.sourcePage,
      sourcePrintedPage: item.sourcePrintedPage,
      sourceVerified,
      difficultyBand: 1,
      sourceTier: "advanced",
      problemVisualRequired: visualRequired,
      answerVisualRequired: visualRequired,
      visualRequirement: {
        required: visualRequired,
        kind: visualKind,
        status: visualRequired ? "source-visual-review-required" : "text-and-equation-only"
      },
      generatorKey: "",
      reviewLocked: true,
      reviewReason: publicLockReason,
      generationMode: "review-locked",
      verifiedVariantTarget: 0,
      verifiedVariantCount: 0,
      answerVisualStatus: "locked"
    };
  });
};

const items = reviewFiles.flatMap(readReview).sort((a, b) =>
  a.unit - b.unit ||
  a.exploration - b.exploration ||
  sectionOrder[a.sourceSection] - sectionOrder[b.sourceSection] ||
  a.sourceItemId.localeCompare(b.sourceItemId, "en", { numeric: true })
);

const ids = new Set(items.map(item => item.sourceItemId));
if (items.length !== 106) throw new Error(`5-2 원자 항목은 106개여야 하나 ${items.length}개입니다.`);
if (items.filter(item => item.unit === 1).length !== 50) throw new Error("5-2 1단원 원자 항목은 50개여야 합니다.");
if (items.filter(item => item.unit === 2).length !== 56) throw new Error("5-2 2단원 원자 항목은 56개여야 합니다.");
if (ids.size !== items.length) throw new Error("5-2 원자 항목 ID가 중복됩니다.");
if (items.some(item => !/[가-힣]/.test(item.typeLabel) || !item.typeLabel.trim())) {
  throw new Error("어린이용 한국어 유형명이 없는 항목이 있습니다.");
}
if (items.some(item => !item.sourceVerified || item.difficultyBand !== 1 || item.sourceTier !== "advanced")) {
  throw new Error("공개 인벤토리 공통 출처·난이도 필드가 일치하지 않습니다.");
}
if (items.some(item => !item.reviewLocked || item.generationMode !== "review-locked" || item.verifiedVariantTarget !== 0 || item.verifiedVariantCount !== 0)) {
  throw new Error("모든 5-2 항목은 잠금 생성 계약을 가져야 합니다.");
}
if (items.some(item => item.reviewReason !== publicLockReason)) {
  throw new Error("공개 잠금 사유가 일반화되지 않았습니다.");
}

const byUnit = unit => items.filter(item => item.unit === unit);
const bySection = section => items.filter(item => item.sourceSection === section).length;
const inventory = {
  version: "2026-09-16",
  schemaVersion: 1,
  policy: "public-taxonomy-only-no-source-answer-calculation-or-private-path",
  oneSourceItemOneType: true,
  totals: {
    semester: "5-2",
    units: 2,
    items: items.length,
    unit1: byUnit(1).length,
    unit2: byUnit(2).length,
    exploration: bySection("exploration"),
    example: bySection("example"),
    mission: bySection("mission"),
    normalizedTypeIds: new Set(items.map(item => item.normalizedTypeId)).size,
    reviewLocked: items.filter(item => item.reviewLocked).length,
    visualRequired: items.filter(item => item.problemVisualRequired).length
  },
  items
};

const output = `window.HSE_SOURCE_INVENTORY_52 = ${JSON.stringify(inventory, null, 2)};\n`;
if (/independentAnswer|independentCalculation|answerFormula|originalStructure|keyConditions|sourceSha256|[A-Z]:\\/.test(output)) {
  throw new Error("공개 출력에 보호된 답·계산·원문·경로 필드가 남았습니다.");
}
fs.writeFileSync(outputPath, output, "utf8");
console.log(`5-2 브라우저 원문 목록 생성: ${items.length}개 · 1단원 ${byUnit(1).length}개 · 2단원 ${byUnit(2).length}개 · 잠금 ${inventory.totals.reviewLocked}개`);
