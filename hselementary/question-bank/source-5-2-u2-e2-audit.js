"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-5-2.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-e1.js");
const source52e2 = require("./source-5-2-u2-e2.js");

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const unitTwo = window.HSE_CURRICULUM.semesters
  .find(semester => semester.id === "5-2")
  .units.find(unit => unit.id === "5-2-u2");
const types = unitTwo.subunits.flatMap(subunit => subunit.types);
const ready = types.filter(type => source52e2.sourceItemIds.includes(type.sourceItemId));
const missionSix = types.find(type => type.sourceItemId === "5-2-u2-e2-mission-6");
const visualIds = new Set([
  "5-2-u2-e2-example-2",
  "5-2-u2-e2-example-4",
  "5-2-u2-e2-mission-5"
]);
const expectedIds = [
  "5-2-u2-e2-exploration-1",
  "5-2-u2-e2-exploration-2",
  "5-2-u2-e2-example-1",
  "5-2-u2-e2-example-2",
  "5-2-u2-e2-example-3",
  "5-2-u2-e2-example-4",
  "5-2-u2-e2-mission-1-1",
  "5-2-u2-e2-mission-1-2",
  "5-2-u2-e2-mission-1-3",
  "5-2-u2-e2-mission-1-4",
  "5-2-u2-e2-mission-1-5",
  "5-2-u2-e2-mission-1-6",
  "5-2-u2-e2-mission-2",
  "5-2-u2-e2-mission-3",
  "5-2-u2-e2-mission-4",
  "5-2-u2-e2-mission-5"
];
const fraction = (n, d = 1) => {
  const divisor = (left, right) => right ? divisor(right, left % right) : Math.abs(left) || 1;
  const sign = d < 0 ? -1 : 1;
  const common = divisor(n, d);
  return { n: sign * n / common, d: Math.abs(d) / common };
};
const product = (left, right) => fraction(left.n * right.n, left.d * right.d);
const sum = (left, right) => fraction(left.n * right.d + right.n * left.d, left.d * right.d);
const difference = (left, right) => fraction(left.n * right.d - right.n * left.d, left.d * right.d);
const equal = (left, right) => left.n === right.n && left.d === right.d;
const asFraction = answer => {
  const match = String(answer).match(/(-?\d+)(?:\s+(\d+)\/(\d+)|\/(\d+))?/);
  if (!match) return null;
  if (match[2]) return fraction(Number(match[1]) * Number(match[3]) + Number(match[2]), Number(match[3]));
  if (match[4]) return fraction(Number(match[1]), Number(match[4]));
  return fraction(Number(match[1]));
};
const multiplyAll = values => values.reduce(product, fraction(1));
const expectedFromWitness = (sourceItemId, witness) => {
  if (sourceItemId === "5-2-u2-e2-exploration-1") return product(witness.capacity, witness.filled);
  if (sourceItemId === "5-2-u2-e2-exploration-2") return sum(multiplyAll(witness.first), multiplyAll(witness.second));
  if (sourceItemId === "5-2-u2-e2-example-1") return fraction((witness.end + 1) * (witness.end + 2), 12);
  if (sourceItemId === "5-2-u2-e2-example-2") return product(product(witness.width, witness.height), fraction(witness.leftRatio, witness.leftRatio + witness.rightRatio));
  if (sourceItemId === "5-2-u2-e2-example-3") {
    const first = product(witness.initial, witness.ratio);
    return sum(sum(witness.initial, product(fraction(2), first)), product(first, witness.ratio));
  }
  if (sourceItemId === "5-2-u2-e2-example-4") return witness.reduce(sum, fraction(0));
  if (sourceItemId.includes("mission-1-3")) return product(witness[0], sum(witness[1], witness[2]));
  if (sourceItemId.includes("mission-1-4")) return product(difference(witness[0], witness[1]), witness[2]);
  if (sourceItemId.includes("mission-1-")) return multiplyAll(witness);
  if (sourceItemId === "5-2-u2-e2-mission-2") return product(product(witness.school, witness.cityRatio), witness.fireRatio);
  if (sourceItemId === "5-2-u2-e2-mission-3") return product(witness.term, witness.multiplier);
  if (sourceItemId === "5-2-u2-e2-mission-4") {
    const last = witness.start + 6 + 3 * (witness.count - 1);
    return fraction(witness.start * (witness.start + 3), (last - 3) * last);
  }
  if (sourceItemId === "5-2-u2-e2-mission-5") {
    const first = product(witness.initial, witness.ratio);
    const second = product(first, witness.ratio);
    const third = product(second, witness.ratio);
    return sum(sum(sum(witness.initial, product(fraction(2), first)), product(fraction(2), second)), third);
  }
  return null;
};
const bounceHeights = witness => {
  const first = product(witness.initial, witness.ratio);
  const second = product(first, witness.ratio);
  const third = product(second, witness.ratio);
  return [witness.initial, first, second, third];
};

check(ready.length === 16, `개념탐구 2 공개 유형은 16개여야 하나 ${ready.length}개입니다.`);
check(new Set(ready.map(type => type.sourceItemId)).size === 16, "개념탐구 2 공개 원문 ID가 중복됩니다.");
check(expectedIds.every(id => source52e2.sourceItemIds.includes(id)) && source52e2.sourceItemIds.length === expectedIds.length, "개념탐구 2 생성기 원문 ID가 PDF p.12~13의 16개 문항과 정확히 일치하지 않습니다.");
check(missionSix?.reviewLocked, "Mission 6은 조건 부족으로 잠금 상태여야 합니다.");
check(!window.HSE_GENERATORS.generatorKey(missionSix), "Mission 6이 생성기에 연결되었습니다.");
check(!source52e2.sourceItemIds.includes("5-2-u2-e2-mission-6"), "Mission 6이 전용 생성기에 포함되었습니다.");

let verifiedPools = 0;
let generated = 0;
for (const type of ready) {
  check(!type.reviewLocked, `${type.sourceItemId}: 공개 유형이 잠겨 있습니다.`);
  check(window.HSE_GENERATORS.generatorKey(type) === source52e2.generatorKey, `${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
  check(type.generationMode === "fixed-verified-pool", `${type.sourceItemId}: 고정 검증 문항 계약이 아닙니다.`);
  check(type.verifiedVariantCount === 3, `${type.sourceItemId}: 검증 변형 수가 3개가 아닙니다.`);
  check(type.problemVisualRequired === visualIds.has(type.sourceItemId), `${type.sourceItemId}: 문제 그림 필수 계약이 원문 구조와 다릅니다.`);
  check(type.answerVisualRequired === visualIds.has(type.sourceItemId), `${type.sourceItemId}: 정답 그림 필수 계약이 원문 구조와 다릅니다.`);

  for (let poolIndex = 0; poolIndex < 3; poolIndex += 1) {
    const result = source52e2.verify(type.sourceItemId, poolIndex);
    verifiedPools += 1;
    check(result?.candidateCount === 1, `${type.sourceItemId}/${poolIndex}: 독립 계산의 정답 후보가 하나가 아닙니다.`);
    check(Boolean(result?.answer), `${type.sourceItemId}/${poolIndex}: 독립 계산 답이 비었습니다.`);
    check(!/undefined|null|NaN|Infinity/.test(JSON.stringify(result)), `${type.sourceItemId}/${poolIndex}: 검산 결과에 잘못된 값이 있습니다.`);
    const independentlyCalculated = expectedFromWitness(type.sourceItemId, result?.proof?.witness);
    const generatedAnswer = asFraction(result?.answer);
    check(Boolean(independentlyCalculated && generatedAnswer && equal(independentlyCalculated, generatedAnswer)), `${type.sourceItemId}/${poolIndex}: 별도 계산 결과와 생성 답이 다릅니다.`);
    if (type.sourceItemId === "5-2-u2-e2-mission-5") {
      const heights = bounceHeights(result.proof.witness);
      check(heights.every((height, index) => index === 0 || height.n * heights[index - 1].d < heights[index - 1].n * height.d), `${type.sourceItemId}/${poolIndex}: 공의 반등 높이가 앞 높이보다 작지 않습니다.`);
    }
  }

  const observedPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 40; seed += 1) {
      let item;
      try {
        item = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${type.sourceItemId}/${difficulty}/${seed}: ${error.message}`);
        break;
      }
      generated += 1;
      const visible = `${item?.prompt} ${item?.answer} ${item?.solution} ${item?.answerVisual || ""}`;
      check(Boolean(item?.prompt && item?.solution && item?.answer !== undefined), `${type.sourceItemId}/${difficulty}/${seed}: 문제·정답·풀이가 비었습니다.`);
      check(item?.sourceItemId === type.sourceItemId, `${type.sourceItemId}/${difficulty}/${seed}: 생성 결과의 원문 ID가 다릅니다.`);
      check(item?.generationMode === "fixed-verified-pool", `${type.sourceItemId}/${difficulty}/${seed}: 생성 방식이 다릅니다.`);
      check(/data-answer-candidate-count="1"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 단일 정답 증거가 없습니다.`);
      check(!/undefined|null|NaN|Infinity/.test(visible), `${type.sourceItemId}/${difficulty}/${seed}: 잘못된 값이 노출됩니다.`);
      check(!/Mission 6|원 10개/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 잠금 문제 내용이 공개 경로에 섞였습니다.`);
      observedPools.add(item?.verifiedPoolIndex);
      if (visualIds.has(type.sourceItemId)) {
        check(/<svg\b[\s\S]*?viewBox="[^"]+"/.test(item?.prompt || ""), `${type.sourceItemId}/${difficulty}/${seed}: 필수 문제 그림의 viewBox가 없습니다.`);
        check(Boolean(item?.answerVisual), `${type.sourceItemId}/${difficulty}/${seed}: 필수 정답 그림이 없습니다.`);
        check(/data-answer-source="5-2-u2-e2-/.test(item?.answerVisual || ""), `${type.sourceItemId}/${difficulty}/${seed}: 정답 그림의 원문 연결이 없습니다.`);
        check(/stroke="#161616"/.test(visible), `${type.sourceItemId}/${difficulty}/${seed}: 그림 선이 얇은 검정선 계약을 따르지 않습니다.`);
        if (type.sourceItemId === "5-2-u2-e2-example-4") {
          const squares = [...String(item?.prompt || "").matchAll(/data-source52-square-index="(\d+)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
            .map(match => ({ index: Number(match[1]), x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }));
          check(squares.length >= 4, `${type.sourceItemId}/${difficulty}/${seed}: 반복 정사각형 좌표가 충분하지 않습니다.`);
          for (let index = 1; index < squares.length; index += 1) {
            const previous = squares[index - 1];
            const current = squares[index];
            check(Math.abs((previous.y) - (current.y + current.height)) < 0.01, `${type.sourceItemId}/${difficulty}/${seed}: ${current.index}번째 정사각형이 앞 정사각형 위에 맞닿지 않습니다.`);
            check(Math.abs((previous.x + previous.width) - (current.x + current.width)) < 0.01, `${type.sourceItemId}/${difficulty}/${seed}: ${current.index}번째 정사각형의 오른쪽 변이 어긋납니다.`);
          }
        }
      } else {
        check(!item?.answerVisual, `${type.sourceItemId}/${difficulty}/${seed}: 필요 없는 정답 그림이 추가되었습니다.`);
      }
    }
  }
  check(observedPools.size === 3, `${type.sourceItemId}: 다중 시드에서 세 검증 변형이 모두 나오지 않았습니다.`);
}

if (failures.length) {
  console.error(`5-2 개념탐구 2 원문형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-2 개념탐구 2 원문형 감사 통과: 공개 16유형 · Mission 6 잠금 · 독립 검산 ${verifiedPools}개 풀 · 난이도별 다중 시드 ${generated.toLocaleString()}회 · 그림 계약 ${visualIds.size}유형`);
