"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const failures = [];
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const targetUnits = semester.units.filter(unit => ["삼각형", "소수의 덧셈과 뺄셈"].includes(unit.name));
const sourceIds = new Set();
const reviewedTriangleIds = new Set([
  "4-2-triangle-1-mission-1",
  "4-2-triangle-1-mission-2",
  "4-2-triangle-4-mission-1"
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
        : type.sourceSection === "mission";
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

check(sourceIds.size === 88, `원문 문항 ID는 88개여야 하나 ${sourceIds.size}개입니다.`);
check(reviewedTriangleIds.size === 3, "삼각형 공개 허용 원문은 3개여야 합니다.");

if (failures.length) {
  console.error(`원문 문항 단위 분류 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log("원문 문항 단위 분류 감사 통과: 4-2 삼각형 44유형 + 소수 44유형 = 88개 고유 문항");
