"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-5-2.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source52 = require("./source-5-2-e1.js");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const types = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-2")
  .units.slice(0, 2)
  .flatMap(unit => unit.subunits.flatMap(subunit => subunit.types));
const ready = types.filter(type => source52.sourceItemIds.includes(type.sourceItemId));
const locked = types.filter(type => !source52.sourceItemIds.includes(type.sourceItemId));

check(types.length === 106, `5-2 1·2단원 원문 유형은 106개여야 하나 ${types.length}개입니다.`);
check(ready.length === 30, `1차 공개 유형은 30개여야 하나 ${ready.length}개입니다.`);
check(locked.length === 76, `검수 대기 유형은 76개여야 하나 ${locked.length}개입니다.`);
check(new Set(types.map(type => type.sourceItemId)).size === 106, "5-2 원문 ID가 중복됩니다.");
check(types.every(type => type.sourceItemId && type.sourceItemLabel && type.sourceVerified), "5-2 유형의 원문 근거 필드가 비었습니다.");
check(locked.every(type => type.reviewLocked && !window.HSE_GENERATORS.generatorKey(type)), "미구현 5-2 유형이 공개 상태입니다.");
check(types.find(type => type.sourceItemId === "5-2-u2-e1-exploration-1")?.reviewLocked, "설명형 개념탐구 문항이 잠기지 않았습니다.");

let verifiedPools = 0;
let generated = 0;
for (const type of ready) {
  check(!type.reviewLocked, `${type.sourceItemId}: 공개 유형이 잠겨 있습니다.`);
  check(window.HSE_GENERATORS.generatorKey(type) === source52.generatorKey, `${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
  check(type.generationMode === "fixed-verified-pool", `${type.sourceItemId}: 고정 검증 문항 계약이 아닙니다.`);
  check(type.verifiedVariantCount === 3, `${type.sourceItemId}: 검증 변형 수가 3개가 아닙니다.`);

  for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
    const result = source52.verify(type.sourceItemId, poolIndex);
    verifiedPools += 1;
    check(result?.candidateCount === 1, `${type.sourceItemId}/${poolIndex}: 독립 계산의 정답 후보가 하나가 아닙니다.`);
    check(result?.answer !== undefined && result?.answer !== "", `${type.sourceItemId}/${poolIndex}: 검산 답이 비었습니다.`);
  }

  const observedPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 30; seed += 1) {
      let item;
      try {
        item = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${type.sourceItemId}/${difficulty}/${seed}: ${error.message}`);
        break;
      }
      generated += 1;
      check(Boolean(item?.prompt && item?.solution && item?.answer !== undefined), `${type.sourceItemId}/${difficulty}/${seed}: 문제·정답·풀이가 비었습니다.`);
      check(item?.sourceItemId === type.sourceItemId, `${type.sourceItemId}/${difficulty}/${seed}: 생성 결과의 원문 ID가 다릅니다.`);
      check(item?.generationMode === "fixed-verified-pool", `${type.sourceItemId}/${difficulty}/${seed}: 생성 방식이 다릅니다.`);
      check(Number.isInteger(item?.verifiedPoolIndex), `${type.sourceItemId}/${difficulty}/${seed}: 검증 문항 번호가 없습니다.`);
      observedPools.add(item?.verifiedPoolIndex);
      const visible = `${item?.prompt} ${item?.answer} ${item?.solution} ${item?.answerVisual || ""}`;
      check(!/undefined|null|NaN|Infinity/.test(visible), `${type.sourceItemId}/${difficulty}/${seed}: 잘못된 값이 노출됩니다.`);
      check(/data-answer-candidate-count="1"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 단일 정답 증거가 없습니다.`);
      if (type.answerVisualRequired) {
        check(Boolean(item?.answerVisual), `${type.sourceItemId}/${difficulty}/${seed}: 필수 정답 그림이 없습니다.`);
        check(/data-answer-source="5-2-/.test(item?.answerVisual || ""), `${type.sourceItemId}/${difficulty}/${seed}: 정답 그림의 출처 연결이 없습니다.`);
      }
      for (const svg of visible.match(/<svg\b[\s\S]*?<\/svg>/g) || []) {
        check(/viewBox="[^"]+"/.test(svg), `${type.sourceItemId}/${difficulty}/${seed}: SVG viewBox가 없습니다.`);
      }
    }
  }
  check(observedPools.size === 3, `${type.sourceItemId}: 시드 생성에서 세 검증 문항이 모두 나오지 않았습니다.`);
}

if (failures.length) {
  console.error(`5-2 개념탐구 1 원문형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`5-2 개념탐구 1 원문형 감사 통과: 106유형 · 공개 30 · 검수 대기 76 · 독립 검산 ${verifiedPools}문항 · 런타임 ${generated.toLocaleString()}회`);
