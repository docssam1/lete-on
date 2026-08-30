"use strict";

const fs = require("fs");
const path = require("path");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const failures = [];
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const targetUnits = semester.units.filter(unit => ["삼각형", "소수의 덧셈과 뺄셈"].includes(unit.name));
const quadrilateralUnit = semester.units.find(unit => unit.name === "사각형");
const lineGraphUnit = semester.units.find(unit => unit.name === "꺾은선그래프");
const lineGraphInventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "4-2-unit-5-line-graph.json"), "utf8"));
const sourceIds = new Set();
const reviewedTriangleIds = new Set([
  "4-2-triangle-1-exploration",
  "4-2-triangle-1-example-1",
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
  "4-2-triangle-3-mission-6",
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
const reviewedDecimalIds = new Set([
  "4-2-decimal-1-exploration",
  "4-2-decimal-4-exploration"
]);
const reviewedQuadrilateralIds = new Set([
  "4-2-quad-1-exploration-1",
  "4-2-quad-1-exploration-3",
  "4-2-quad-1-example-1-4",
  "4-2-quad-1-example-1-3",
  "4-2-quad-1-mission-6",
  "4-2-quad-1-example-1-2",
  "4-2-quad-1-mission-3",
  "4-2-quad-1-mission-1",
  "4-2-quad-1-mission-4",
  "4-2-quad-2-example-2-1"
]);

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(targetUnits.length === 2, "4-2 삼각형·소수 단원을 모두 찾을 수 없습니다.");

for (const unit of targetUnits) {
  check(unit.subunits.length === 4, `${unit.name}: 개념탐구 묶음은 4개여야 합니다.`);
  for (const subunit of unit.subunits) {
    check(subunit.types.length === 11, `${unit.name} / ${subunit.name}: 개념탐구 1 + 예제 4 + Mission 6 = 11유형이어야 합니다.`);
    const sections = { exploration: 0, example: 0, mission: 0 };
    const variants = [];
    for (const type of subunit.types) {
      check(Boolean(type.sourceVerified), `${type.id}: 원본 확인 표시가 없습니다.`);
      check(Boolean(type.sourceItemId), `${type.id}: 고유 원문 문항 ID가 없습니다.`);
      check(!sourceIds.has(type.sourceItemId), `${type.id}: 원문 문항 ID ${type.sourceItemId}가 중복됩니다.`);
      sourceIds.add(type.sourceItemId);
      check(["exploration", "example", "mission"].includes(type.sourceSection), `${type.id}: 원문 구간이 올바르지 않습니다.`);
      if (sections[type.sourceSection] !== undefined) sections[type.sourceSection] += 1;
      check(Number.isInteger(type.sourcePdfPage) && Number.isInteger(type.sourcePrintedPage), `${type.id}: PDF·교재 페이지가 없습니다.`);
      check(type.sourceEvidence.includes(type.sourceItemId), `${type.id}: 근거 문구에 원문 문항 ID가 없습니다.`);
      variants.push(type.variant);
      const shouldBePublic = unit.name === "삼각형"
        ? reviewedTriangleIds.has(type.sourceItemId)
        : type.sourceSection === "mission" || reviewedDecimalIds.has(type.sourceItemId);
      if (shouldBePublic) {
        check(!type.reviewLocked, `${type.id}: 원문 일치 검산 완료 유형이 잠겨 있습니다.`);
        const generated = window.HSE_GENERATORS.generate({
          ...type,
          semesterId: semester.id,
          unitId: unit.id,
          unitName: unit.name,
          subunitName: subunit.name
        }, 0, 0, 17, type.variant);
        check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), `${type.id}: 공개 생성 결과가 완전하지 않습니다.`);
      } else {
        check(type.reviewLocked, `${type.id}: 원문 그림·조건 일치 검수 전까지 잠겨야 합니다.`);
      }
    }
    check(sections.exploration === 1, `${unit.name} / ${subunit.name}: 개념탐구 본문은 1유형이어야 합니다.`);
    check(sections.example === 4, `${unit.name} / ${subunit.name}: 예제는 4유형이어야 합니다.`);
    check(sections.mission === 6, `${unit.name} / ${subunit.name}: Mission은 6유형이어야 합니다.`);
    check(variants.join(",") === "0,1,2,3,4,5,6,7,8,9,10", `${unit.name} / ${subunit.name}: variant는 0~10이 각각 한 번이어야 합니다.`);
  }
}

check(Boolean(quadrilateralUnit), "4-2 사각형 단원을 찾을 수 없습니다.");
if (quadrilateralUnit) {
  const mappedTypes = quadrilateralUnit.subunits.flatMap(subunit => subunit.types).filter(type => type.sourceItemId);
  check(mappedTypes.length === reviewedQuadrilateralIds.size, `사각형 문제별 출처 연결은 ${reviewedQuadrilateralIds.size}개여야 하나 ${mappedTypes.length}개입니다.`);
  for (const type of mappedTypes) {
    check(reviewedQuadrilateralIds.has(type.sourceItemId), `${type.id}: 아직 승인하지 않은 사각형 원문 ID입니다.`);
    check(!sourceIds.has(type.sourceItemId), `${type.id}: 원문 문항 ID ${type.sourceItemId}가 중복됩니다.`);
    sourceIds.add(type.sourceItemId);
    check(Boolean(type.sourceVerified), `${type.id}: 사각형 원본 확인 표시가 없습니다.`);
    check(["exploration", "example", "mission"].includes(type.sourceSection), `${type.id}: 사각형 원문 구간이 올바르지 않습니다.`);
    check(Number.isInteger(type.sourcePdfPage) && Number.isInteger(type.sourcePrintedPage), `${type.id}: 사각형 PDF·교재 페이지가 없습니다.`);
    check(type.sourceEvidence.includes(type.sourceItemId), `${type.id}: 사각형 근거 문구에 원문 문항 ID가 없습니다.`);
    check(type.sourceEvidence.includes("2026 생각하는 황소 실력 4-2"), `${type.id}: 사각형 출처 교재 이름이 정확하지 않습니다.`);
    check(!type.reviewLocked, `${type.id}: 검산 완료한 사각형 유형이 잠겨 있습니다.`);
    const generated = window.HSE_GENERATORS.generate({
      ...type,
      semesterId: semester.id,
      unitId: quadrilateralUnit.id,
      unitName: quadrilateralUnit.name
    }, 0, 0, 17, type.variant);
    check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), `${type.id}: 사각형 공개 생성 결과가 완전하지 않습니다.`);
  }
  const unmappedRatioType = quadrilateralUnit.subunits[0].types.find(type => type.label === "비로 주어진 평행선 사이 거리");
  check(Boolean(unmappedRatioType?.reviewLocked && !unmappedRatioType.sourceItemId), "원본과 겹치지 않는 거리의 비 유형은 잠금 상태여야 합니다.");
}

check(Boolean(lineGraphUnit), "4-2 꺾은선그래프 단원을 찾을 수 없습니다.");
check(lineGraphInventory.items.length === 22, "꺾은선그래프 원문 항목은 22개여야 합니다.");
check(new Set(lineGraphInventory.items.map(item => item.sourceItemId)).size === 22, "꺾은선그래프 원문 ID가 겹칩니다.");
if (lineGraphUnit) {
  const mappedTypes = lineGraphUnit.subunits.flatMap(subunit => subunit.types);
  const inventoryById = new Map(lineGraphInventory.items.map(item => [item.sourceItemId, item]));
  check(mappedTypes.length === 20, `꺾은선그래프 런타임 유형은 중복 2개를 뺀 20개여야 하나 ${mappedTypes.length}개입니다.`);
  check(lineGraphInventory.items.filter(item => item.implementationStatus === "excluded").length === 2, "꺾은선그래프 중복 제외 항목은 2개여야 합니다.");
  for (const type of mappedTypes) {
    const item = inventoryById.get(type.sourceItemId);
    check(Boolean(item), `${type.id}: 꺾은선그래프 근거표에 원문 ID가 없습니다.`);
    check(!sourceIds.has(type.sourceItemId), `${type.id}: 원문 문항 ID ${type.sourceItemId}가 중복됩니다.`);
    sourceIds.add(type.sourceItemId);
    check(Boolean(type.sourceVerified), `${type.id}: 꺾은선그래프 원본 확인 표시가 없습니다.`);
    check(type.sourceEvidence.includes(type.sourceItemId), `${type.id}: 꺾은선그래프 근거 문구에 원문 문항 ID가 없습니다.`);
    check(type.sourcePdfPage === item?.sourcePdfPage && type.sourcePrintedPage === item?.sourcePrintedPage, `${type.id}: 꺾은선그래프 원문 쪽수가 근거표와 다릅니다.`);
    check(type.reviewLocked === (item?.implementationStatus === "review-locked"), `${type.id}: 꺾은선그래프 공개 상태가 근거표와 다릅니다.`);
    if (!type.reviewLocked) {
      const generated = window.HSE_GENERATORS.generate({ ...type, semesterId: semester.id, unitId: lineGraphUnit.id, unitName: lineGraphUnit.name }, 0, 0, 17, type.variant);
      check(generated?.prompt.includes(`data-source42-line-item="${type.sourceItemId}"`), `${type.id}: 꺾은선그래프 생성 결과의 원문 ID가 다릅니다.`);
    } else {
      try {
        window.HSE_GENERATORS.generate(type, 0, 0, 17, type.variant);
        failures.push(`${type.id}: 검수 대기 꺾은선그래프가 직접 생성되었습니다.`);
      } catch (error) {
        check(/검수 대기/.test(error.message), `${type.id}: 꺾은선그래프 잠금 오류 문구가 분명하지 않습니다.`);
      }
    }
  }
}

check(sourceIds.size === 118, `런타임에 연결된 원문 문항 ID는 118개여야 하나 ${sourceIds.size}개입니다.`);
check(reviewedTriangleIds.size === 32, "삼각형 공개 허용 원문은 32개여야 합니다.");
check(reviewedDecimalIds.size === 2, "소수 공개 허용 개념탐구는 2개여야 합니다.");
check(reviewedQuadrilateralIds.size === 10, "사각형 공개 허용 원문은 10개여야 합니다.");

if (failures.length) {
  console.error(`원문 문항 단위 분류 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log("원문 문항 단위 분류 감사 통과: 4-2 삼각형 44 + 소수 44 + 사각형 10 + 꺾은선그래프 22 = 120개 원문 항목, 중복 제외 2개");
