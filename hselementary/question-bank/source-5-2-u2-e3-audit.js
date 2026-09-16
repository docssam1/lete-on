"use strict";

global.window = {};
require("./source-inventory-5-2.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-e1.js");
const sourceE3 = require("./source-5-2-u2-e3.js");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const containsBrokenValue = value => /undefined|null|NaN|Infinity|SyntaxError|\$\{/.test(String(value || ""));
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester?.units.find(item => item.id === "5-2-u2");
const sourceTypes = unit?.subunits
  .flatMap(subunit => subunit.types)
  .filter(type => String(type.sourceItemId || "").startsWith("5-2-u2-e3-")) || [];
const sourceIds = new Set(sourceE3.sourceItemIds);
const visualIds = new Set(["5-2-u2-e3-exploration", "5-2-u2-e3-mission-1"]);

check(sourceTypes.length === 11, `개념탐구 3 원문 유형은 11개여야 하나 ${sourceTypes.length}개입니다.`);
check(sourceIds.size === 11, `전용 생성기 원문 ID는 11개여야 하나 ${sourceIds.size}개입니다.`);
check(sourceTypes.every(type => sourceIds.has(type.sourceItemId)), "개념탐구 3 교육과정 유형과 전용 생성기 ID가 1:1로 맞지 않습니다.");
check(new Set(sourceTypes.map(type => type.sourceItemId)).size === 11, "개념탐구 3 원문 ID가 중복됩니다.");
check(sourceTypes.every(type => !type.reviewLocked), "개념탐구 3의 공개 대상 유형이 잠겨 있습니다.");

let verifiedPools = 0;
let generated = 0;
for (const type of sourceTypes) {
  check(window.HSE_GENERATORS.generatorKey(type) === sourceE3.generatorKey, `${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
  check(type.generationMode === "fixed-verified-pool", `${type.sourceItemId}: 고정 검증 문항 계약이 아닙니다.`);
  check(type.verifiedVariantCount === 3, `${type.sourceItemId}: 검증 변형 수가 3개가 아닙니다.`);
  check(type.problemVisualRequired === visualIds.has(type.sourceItemId), `${type.sourceItemId}: 문제 그림 계약이 원문 구조와 다릅니다.`);
  check(type.answerVisualRequired === visualIds.has(type.sourceItemId), `${type.sourceItemId}: 정답 그림 계약이 원문 구조와 다릅니다.`);

  for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
    const result = sourceE3.verify(type.sourceItemId, poolIndex);
    verifiedPools += 1;
    check(result?.candidateCount === 1, `${type.sourceItemId}/${poolIndex}: 독립 계산 정답 후보가 하나가 아닙니다.`);
    check(Boolean(result?.answer), `${type.sourceItemId}/${poolIndex}: 독립 계산 답이 비었습니다.`);
    check(!containsBrokenValue(JSON.stringify(result?.proof || {})), `${type.sourceItemId}/${poolIndex}: 검산 근거에 깨진 값이 있습니다.`);
  }

  const observedPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 45; seed += 1) {
      let item;
      try {
        item = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, type.variant || 0);
      } catch (error) {
        failures.push(`${type.sourceItemId}/${difficulty}/${seed}: ${error.message}`);
        continue;
      }
      generated += 1;
      const visible = `${item?.prompt} ${item?.answer} ${item?.solution} ${item?.answerVisual || ""}`;
      check(item?.sourceItemId === type.sourceItemId, `${type.sourceItemId}/${difficulty}/${seed}: 원문 ID가 달라졌습니다.`);
      check(item?.generationMode === "fixed-verified-pool", `${type.sourceItemId}/${difficulty}/${seed}: 생성 방식이 다릅니다.`);
      check(item?.verifiedVariantCount === 3, `${type.sourceItemId}/${difficulty}/${seed}: 검증 변형 수가 다릅니다.`);
      check(item?.answerCandidateCount === 1 && /data-answer-candidate-count="1"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 단일 정답 계약이 없습니다.`);
      check(Boolean(item?.prompt && item?.answer && item?.solution), `${type.sourceItemId}/${difficulty}/${seed}: 문제·답·풀이 중 빈 값이 있습니다.`);
      check(!containsBrokenValue(visible), `${type.sourceItemId}/${difficulty}/${seed}: 화면에 깨진 값이 있습니다.`);
      observedPools.add(item?.verifiedPoolIndex);
      if (visualIds.has(type.sourceItemId)) {
        check(/<svg\b[^>]*viewBox=/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 문제 그림 SVG가 없습니다.`);
        check(/source52-(pool-rods|rectangle)/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 원문 구조 그림이 아닙니다.`);
        check(/data-answer-source="5-2-u2-e3-/.test(item?.answerVisual || ""), `${type.sourceItemId}/${difficulty}/${seed}: 정답 그림의 원문 연결이 없습니다.`);
      } else {
        check(!item?.answerVisual, `${type.sourceItemId}/${difficulty}/${seed}: 필요 없는 정답 그림이 생성되었습니다.`);
      }
    }
  }
  check(observedPools.size === 3, `${type.sourceItemId}: 난이도별 다중 시드에서 세 고정 변형이 모두 나오지 않았습니다.`);
}

if (failures.length) {
  console.error(`5-2 2단원 개념탐구 3 원문형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-2 2단원 개념탐구 3 원문형 감사 통과: 공개 11유형 · 풀 검산 ${verifiedPools}문항 · 난이도별 다중 시드 ${generated.toLocaleString()}회 · 시각 계약 2유형`);
