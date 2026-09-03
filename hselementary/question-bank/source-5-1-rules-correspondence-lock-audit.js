"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u3");
const types = unit.subunits.flatMap(item => item.types);
const failures = [];
const expectedByExploration = new Map([[1, 11], [2, 10], [3, 10], [4, 10]]);

if (types.length !== 41) failures.push("규칙과 대응 원문은 현재 확인된 41개 문제 단위 유형이어야 합니다.");
for (const [exploration, expected] of expectedByExploration) {
  const current = types.filter(type => type.sourceItemId.startsWith(`5-1-u3-e${exploration}-`));
  if (current.length !== expected) failures.push(`개념탐구 ${exploration}의 원문 유형 수가 ${expected}개가 아닙니다.`);
  for (const type of current) {
    const isMission = type.sourceSection === "mission";
    const sourcePdfPage = 31 + (exploration - 1) * 2 + (isMission ? 1 : 0);
    const sourcePrintedPage = sourcePdfPage + 1;
    if (!type.reviewLocked || window.HSE_GENERATORS.generatorKey(type)) failures.push(`${type.sourceItemId}: 검산 전에는 잠금 상태여야 합니다.`);
    if (type.sourcePdfPage !== sourcePdfPage || type.sourcePrintedPage !== sourcePrintedPage) failures.push(`${type.sourceItemId}: 원문 쪽수 연결이 다릅니다.`);
    if (!type.reviewReason.includes("독립 계산") || !type.reviewReason.includes("답 하나")) failures.push(`${type.sourceItemId}: 잠금 사유가 부족합니다.`);
  }
}

if (failures.length) {
  console.error(`5-1 규칙과 대응 원문 유형표 감사 실패: ${failures.join(" ")}`);
  process.exit(1);
}

console.log("5-1 규칙과 대응 원문 유형표 감사 통과: 개념탐구 1~4 · 41문제 단위 유형 · 검산 전 전항목 잠금 유지");
