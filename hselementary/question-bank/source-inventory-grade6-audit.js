"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const catalogPath = path.join(__dirname, "source-inventory-grade6.js");
const curriculumPath = path.join(__dirname, "curriculum.js");
const rawInventoryPath = path.join(__dirname, "source-inventory", "6-1-source-items.json");
const readinessPath = path.join(__dirname, "source-inventory", "6-1-u4-source-readiness-review.json");
const readinessU5Path = path.join(__dirname, "source-inventory", "6-1-u5-source-readiness-review.json");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(catalogPath), "6학년 공개 분류표 파일이 없습니다.");
if (!fs.existsSync(catalogPath)) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const sourceText = fs.readFileSync(catalogPath, "utf8");
check(!/independentAnswer|independentCalculation|conditions|originalStructure|sourcePdfPage|sourcePrintedPage|[A-Z]:\\|private-pdf/.test(sourceText), "공개 분류표에 답·조건·원본 쪽·비공개 경로가 들어갔습니다.");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(sourceText, context, { filename: catalogPath });
vm.runInContext(fs.readFileSync(curriculumPath, "utf8"), context, { filename: curriculumPath });

const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6;
const curriculum = context.window.HSE_CURRICULUM;
const rawInventory = JSON.parse(fs.readFileSync(rawInventoryPath, "utf8"));
const readiness = JSON.parse(fs.readFileSync(readinessPath, "utf8"));
const readinessU5 = JSON.parse(fs.readFileSync(readinessU5Path, "utf8"));
const items = catalog?.items || [];
const readyGeneratorKeys = [
  "sourceGrade6FractionDivisionE1", "sourceGrade6FractionDivisionE2",
  "sourceGrade6PrismsPyramidsE1", "sourceGrade6PrismsPyramidsE2", "sourceGrade6PrismsPyramidsE3", "sourceGrade6PrismsPyramidsE4",
  "sourceGrade6DecimalDivisionE1", "sourceGrade6DecimalDivisionE2", "sourceGrade6DecimalDivisionE3", "sourceGrade6DecimalDivisionE4",
  "sourceGrade6RatioE1", "sourceGrade6RatioE2", "sourceGrade6RatioE3", "sourceGrade6RatioE4", "sourceGrade6RatioE5", "sourceGrade6RatioE6"
  , "sourceGrade6GraphsE1"
];
check(rawInventory.items.length === 266, `6-1 원자료 장부는 번호가 붙은 개념탐구 소문항을 나눈 266개여야 하나 ${rawInventory.items.length}개입니다.`);
check(new Set(rawInventory.items.map(item => item.sourceItemId)).size === rawInventory.items.length, "6-1 원자료 장부의 항목 ID가 중복되었습니다.");
check(rawInventory.integrity?.actualTotalItems === rawInventory.items.length, "6-1 원자료 장부의 실제 항목 수 요약이 다릅니다.");
Object.entries(rawInventory.integrity?.expectedByUnit || {}).forEach(([unitId, expectedCount]) => {
  const actualCount = rawInventory.items.filter(item => item.unitId === unitId).length;
  const summary = rawInventory.integrity?.actualByUnit?.[unitId];
  check(actualCount === expectedCount, `${unitId}: 원자료 장부의 실제 ${actualCount}개와 예상 ${expectedCount}개가 다릅니다.`);
  check(summary?.expectedItems === expectedCount && summary?.actualItems === actualCount, `${unitId}: 단원별 원자료 수 요약이 실제 목록과 다릅니다.`);
});
check(catalog?.oneSourceItemOneType === true, "원문 한 문제를 한 유형으로 다루는 표시가 없습니다.");
check(catalog?.totals?.items === items.length && items.length > 0, "공개 분류표의 유형 수가 실제와 다릅니다.");
check(new Set(items.map(item => item.sourceItemId)).size === items.length, "6학년 전체에서 원문 유형 ID가 중복되었습니다.");
check(items.every(item => item.normalizedTypeId === item.sourceItemId), "원문 한 문제와 고유 유형의 연결이 깨졌습니다.");
const readyItems = items.filter(item => !item.reviewLocked);
const lockedItems = items.filter(item => item.reviewLocked);
for (const [generatorKey, expectedCount, label] of [
  ["sourceGrade6RatioE3", 11, "개념탐구 3"],
  ["sourceGrade6RatioE4", 12, "개념탐구 4"],
  ["sourceGrade6RatioE5", 11, "개념탐구 5"],
  ["sourceGrade6RatioE6", 11, "개념탐구 6"],
  ["sourceGrade6GraphsE1", 9, "개념탐구 1 그림그래프 공개 유형"]
]) {
  const mappedItems = items.filter(item => item.generatorKey === generatorKey);
  check(mappedItems.length === expectedCount, `6-1 비와 비율 ${label}의 공개 유형이 ${expectedCount}개가 아닙니다: ${mappedItems.length}`);
  mappedItems.forEach(item => {
    const rawItem = rawInventory.items.find(candidate => candidate.publicSourceItemId === item.sourceItemId);
    const readinessItem = (generatorKey === "sourceGrade6GraphsE1" ? readinessU5 : readiness).items.find(candidate => candidate.sourceItemId === item.sourceItemId);
    check(Boolean(item.rawSourceItemId && rawItem && readinessItem), `${item.sourceItemId}: 원자료·검수표·공개 유형의 ID 연결이 없습니다.`);
    check(rawItem?.sourceItemId === item.rawSourceItemId && readinessItem?.rawSourceItemId === item.rawSourceItemId, `${item.sourceItemId}: 원자료 ID가 양쪽 연결표에서 다릅니다.`);
  });
}
check(catalog.totals?.unlocked === readyItems.length, `6학년 공개 분류표 요약의 생성 가능 수가 실제 항목과 다릅니다: ${catalog.totals?.unlocked}/${readyItems.length}`);
check(readyItems.length === 148 && lockedItems.length === 485, `6학년 원문 유형의 공개 148개·잠금 485개 구성이 다릅니다: ${readyItems.length}/${lockedItems.length}`);
check(readyItems.every(item => readyGeneratorKeys.includes(item.generatorKey) && Number.isInteger(item.variant) && item.answerVisualStatus === "verified" && item.verifiedVariantCount === (item.sourceItemId === "6-1-u2-e4-example-4-1" ? 1 : 3)), "검증 완료한 6-1 원문 148유형의 생성기·답 그림·고정 문항 연결이 다릅니다.");
check(lockedItems.every(item => item.generatorKey === "" && item.answerVisualStatus === "not-implemented" && item.verifiedVariantCount === 0), "검수 대기인 6학년 원문 유형이 생성 가능 상태입니다.");
check(items.every(item => item.problemVisualRequired === true && item.answerVisualRequired === true), "6학년 원문 유형의 문제·정답 화면 계약이 빠졌습니다.");
check(items.every(item => {
  if (item.generationMode === "review-locked") {
    return item.reviewLocked && item.verifiedVariantTarget === 0 && item.verifiedVariantCount === 0;
  }
  return item.generationMode === "fixed-verified-pool"
    && item.verifiedVariantTarget === (item.sourceItemId === "6-1-u2-e4-example-4-1" ? 1 : 3);
}), "원문 유형별 고정 검증 문항 계약이 다릅니다.");

for (const semesterId of ["6-1", "6-2"]) {
  const semester = curriculum?.semesters?.find(item => item.id === semesterId);
  const sourceSemesterItems = items.filter(item => item.semester === semesterId);
  check(Boolean(semester), `${semesterId}: 교육과정 자료가 없습니다.`);
  if (!semester) continue;
  semester.units.forEach(unit => {
    const expected = sourceSemesterItems.filter(item => item.unit === unit.number);
    const actual = unit.subunits.flatMap(subunit => subunit.types).filter(type => type.sourceItemId && type.normalizedTypeId);
    check(actual.length === expected.length, `${unit.id}: 화면 원문 유형 수 ${actual.length}개가 분류표 ${expected.length}개와 다릅니다.`);
    check(new Set(actual.map(type => type.sourceItemId)).size === actual.length, `${unit.id}: 화면에 같은 원문 유형이 두 번 나옵니다.`);
    check(actual.every(type => type.reviewLocked ? type.generatorKey === "" : readyGeneratorKeys.includes(type.generatorKey)), `${unit.id}: 원문 유형의 잠금과 생성기 연결이 다릅니다.`);
    check(unit.subunits.some(subunit => subunit.name === "기존 생성 문제" && subunit.types.length > 0), `${unit.id}: 기존 생성 문제 비교 묶음이 없습니다.`);
    const sourceGroups = unit.subunits.filter(subunit => subunit.id.includes("-source-e"));
    check(sourceGroups.every(group => /^개념탐구 \d+ 원문 유형$/.test(group.name)), `${unit.id}: 원문 유형이 개념탐구별로 묶이지 않았습니다.`);
  });
}

if (failures.length) {
  console.error(`6학년 공개 분류표·화면 연결 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6학년 공개 분류표·화면 연결 감사 통과: ${items.length}개 원문 문제 = ${items.length}개 세부 유형 · 생성 가능 148 · 검수 잠금 485 · 기존 생성 문제 보존`);
