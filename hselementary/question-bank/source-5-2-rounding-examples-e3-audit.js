"use strict";

const assert = require("node:assert/strict");
const source = require("./source-5-2-rounding-examples-e3.js");

const ids = ["5-2-u1-e3-example-1", "5-2-u1-e3-example-2"];
let checked = 0;
const check = (condition, message) => assert.ok(condition, message);

check(source.definitions.map(item => item.sourceItemId).join("|") === ids.join("|"), "두 검증 원문 ID만 연결되어야 합니다.");
check(source.getQuestion(ids[0], 3, 0) === null, "범위를 벗어난 변형 인덱스는 거부해야 합니다.");
check(source.getQuestion(ids[1], 0, 2) === null, "허용되지 않은 난이도는 거부해야 합니다.");
check(source.getQuestion("5-2-u1-e3-example-3", 0, 0) === null, "조건이 모순된 예제 3-3은 생성되지 않아야 합니다.");

for (const id of ids) for (let variant = 0; variant < 3; variant++) for (const difficultyOffset of [-1, 0, 1]) {
  const question = source.getQuestion(id, variant, difficultyOffset);
  check(question && question.sourceItemId === id, `${id}/${variant}/${difficultyOffset}: 출처 ID가 맞아야 합니다.`);
  check(question.sourceStructurePreserved && question.answerVerification === "independent-calculation-user-authorized", `${id}: 검증 메타데이터가 유지되어야 합니다.`);
  check(question.prompt.includes(`data-difficulty-offset="${difficultyOffset}"`), `${id}: 난이도 metadata가 표시되어야 합니다.`);
  check(!question.prompt.includes(question.answer), `${id}: 질문에 답이 노출되면 안 됩니다.`);
  if (id === ids[0]) {
    const model = question.questionModel;
    check(Object.keys(model).sort().join("|") === "kind|operations|places|target|value", "예제 3-1은 검증된 합성 모델만 노출해야 합니다.");
    const target = Math.floor(model.value / 1000) * 1000;
    const matches = source.places.flatMap(place => source.operations
      .filter(operation => operation.calculate(model.value, place.unit) === target)
      .map(operation => `${place.name} ${operation.name}`));
    check(model.target === target, "예제 3-1 목표값은 천 단위 버림으로 계산되어야 합니다.");
    check(matches.join("|") === "백의 자리 버림|천의 자리 버림|천의 자리 반올림", "예제 3-1은 모든 일치 방법을 정확히 제시해야 합니다.");
    check(question.answer === "백의 자리 버림 · 천의 자리 버림 · 천의 자리 반올림", "예제 3-1의 답 목록은 빠짐없고 중복이 없어야 합니다.");
  } else {
    const model = question.questionModel, answer = question.answerModel;
    check(Object.keys(model).sort().join("|") === "kind|redCm|redPrice|redUnitCm|yellowCm|yellowPrice|yellowUnitCm", "예제 3-2는 검증된 합성 모델만 노출해야 합니다.");
    const redBundles = Math.ceil(model.redCm / model.redUnitCm);
    const yellowBundles = Math.ceil(model.yellowCm / model.yellowUnitCm);
    check(answer.redBundles === redBundles && answer.yellowBundles === yellowBundles, "예제 3-2 묶음 수 계산이 올림과 일치해야 합니다.");
    check((redBundles - 1) * model.redUnitCm < model.redCm && redBundles * model.redUnitCm >= model.redCm, "빨간 리본 묶음이 필요량을 정확히 덮어야 합니다.");
    check((yellowBundles - 1) * model.yellowUnitCm < model.yellowCm && yellowBundles * model.yellowUnitCm >= model.yellowCm, "노란 리본 묶음이 필요량을 정확히 덮어야 합니다.");
    check(answer.redCost === redBundles * model.redPrice && answer.yellowCost === yellowBundles * model.yellowPrice, "예제 3-2 개별 비용을 다시 계산해야 합니다.");
    check(answer.total === answer.redCost + answer.yellowCost && question.answer === `${answer.total.toLocaleString("en-US")}원`, "예제 3-2 합계가 두 비용의 합이어야 합니다.");
  }
  checked++;
}

const previousKey = () => "previous-key";
const previousGenerate = () => ({ previous: true });
const fake = { HSE_GENERATORS: { names: [], generatorKey: previousKey, generate: previousGenerate } };
check(source.install(fake), "생성기 설치가 성공해야 합니다.");
for (const def of source.definitions) {
  const locked = { id: def.sourceItemId, sourceItemId: def.sourceItemId, generatorKey: def.generatorKey, sourceVerified: true, reviewLocked: true };
  const open = { ...locked, reviewLocked: false };
  check(fake.HSE_GENERATORS.generatorKey(locked) === "", `${def.sourceItemId}: 잠긴 문항은 생성기 key를 반환하면 안 됩니다.`);
  check(fake.HSE_GENERATORS.generate(locked, 1, 0, 0, 0) === null, `${def.sourceItemId}: 잠긴 문항은 생성하면 안 됩니다.`);
  check(fake.HSE_GENERATORS.generatorKey(open) === def.generatorKey, `${def.sourceItemId}: 검증된 문항 key가 연결되어야 합니다.`);
  check(fake.HSE_GENERATORS.generate(open, 1, 0, 0, 0)?.sourceItemId === def.sourceItemId, `${def.sourceItemId}: 열린 문항이 생성되어야 합니다.`);
}
check(fake.HSE_GENERATORS.generatorKey({ id: "unrelated" }) === "previous-key", "다른 생성기 동작은 보존해야 합니다.");
check(fake.HSE_GENERATORS.generate({ id: "unrelated" }).previous === true, "다른 생성 결과는 보존해야 합니다.");

console.log(`Grade 5-2 E3 source examples math audit passed: ${checked} synthetic settings; all rounding methods checked; bundle ceilings and totals recomputed; contradictory Example 3-3 stays unavailable.`);
