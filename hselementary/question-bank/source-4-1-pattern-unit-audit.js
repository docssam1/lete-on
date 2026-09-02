"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const unit = semester.units.find(item => item.id === "4-1-u6");
const types = unit.subunits.flatMap(subunit => subunit.types);
const failures = [];
let generatedCount = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const groups = [
  ["e1", "source41LinePatternOne"],
  ["e2", "source41ArrayPatternTwo"],
  ["e3", "source41ArraySumThree"],
  ["e4", "source41OperationRuleFour"],
  ["e6", "source41NumberCardSix"]
];
const locked = new Set([
  "4-1-u6-e5-example-5-2",
  "4-1-u6-e5-example-5-4",
  "4-1-u6-e5-mission-3"
]);

check(types.length === 66, `규칙 찾기는 원문 66유형이어야 하나 ${types.length}유형입니다.`);
for (const [exploration, generatorKey] of groups) {
  const sourceTypes = types.filter(type => type.sourceItemId?.startsWith(`4-1-u6-${exploration}`));
  check(sourceTypes.length === 11, `${exploration}은 원문 11유형이어야 하나 ${sourceTypes.length}유형입니다.`);
  sourceTypes.forEach((type, variant) => {
    check(type.generatorKey === generatorKey, `${type.sourceItemId}: 전용 생성기 연결이 다릅니다.`);
    check(type.variant === variant, `${type.sourceItemId}: 원문 문제 순서와 분기가 다릅니다.`);
    check(!type.reviewLocked, `${type.sourceItemId}: 검증한 유형이 잠겨 있습니다.`);
  });
}

for (const type of types.filter(type => type.sourceItemId?.startsWith("4-1-u6-e5"))) {
  check(Boolean(type.reviewLocked) === locked.has(type.sourceItemId), `${type.sourceItemId}: 공개·잠금 상태가 감사 기록과 다릅니다.`);
}

for (const type of types.filter(type => !type.reviewLocked && groups.some(([exploration]) => type.sourceItemId?.startsWith(`4-1-u6-${exploration}`)))) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 200; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed);
      generatedCount += 1;
      check(Boolean(generated?.prompt && generated?.solution && generated.answer !== undefined), `${type.sourceItemId}: 문제·정답·풀이가 비었습니다.`);
      check(!/undefined|null|NaN|Infinity/.test(`${generated?.prompt}${generated?.answer}${generated?.solution}`), `${type.sourceItemId}: 잘못된 값이 노출됩니다.`);
    } catch (error) {
      failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      break;
    }
  }
}

// 연산의 규칙 원문 고정값을 생성기와 별개의 산술식으로 다시 계산한다.
const digitSum = value => [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
check(30 * 10 / 3 === 100, "연산의 규칙 본문 기준값은 100이어야 합니다.");
check((3 - 1) * (3 - 1) === 4 && (8 - 1) * (4 - 1) === 21 && (4 + 1) * (21 + 1) === 110, "예제 4-2 기준값은 110이어야 합니다.");
check((9 + 10) * (11 + 12) === 437, "예제 4-3 기준값은 437이어야 합니다.");
check(digitSum(15) + digitSum(19) === 16, "예제 4-4 기준값은 16이어야 합니다.");
check((6 % 3) + 2 * 6 === 12, "Mission 1 기준값은 12이어야 합니다.");
check((5 ** 2 + 2) ** 2 + 2 === 731, "Mission 2 빈칸은 5이어야 합니다.");
check((3 ** 2 - 3) ** 2 - 8 === 28, "Mission 3 빈칸은 3이어야 합니다.");
check(11 * 4 - 1 === 43, "Mission 4 기준값은 43이어야 합니다.");
check(77 - 7 * 7 === 28, "Mission 5 기준값은 28이어야 합니다.");
check(6 * (2 + 10) === 72, "Mission 6 기준값은 72이어야 합니다.");

// 수 카드 원문은 모든 배열과 모든 숫자 사용 횟수를 전수 조사한다.
const permutations = (values, length = values.length) => {
  const output = new Set();
  const visit = (left, picked) => {
    if (picked.length === length) { output.add(picked.join("")); return; }
    left.forEach((value, index) => visit(left.filter((_, next) => next !== index), [...picked, value]));
  };
  visit(values, []);
  return [...output];
};
const naturalNumbers = (values, length = values.length) => permutations(values, length).filter(text => text[0] !== "0").map(Number);
const counts = (start, end) => {
  const output = Array(10).fill(0);
  for (let value = start; value <= end; value += 1) for (const digit of String(value)) output[Number(digit)] += 1;
  return output;
};
const decimals = permutations([0, 1, 3, 4]).map(Number).filter(value => Math.floor(value / 1000) < 3);
check(decimals.reduce((sum, value) => sum + value, 0) === 9330, "개념탐구 6 본문 소수의 합은 9.330이어야 합니다.");
check(new Set(naturalNumbers([0, 1, 1, 2, 3, 4], 3)).size === 59, "예제 6-1 기준값은 59개여야 합니다.");
const gapFor = value => {
  const values = permutations([3, 6, 8, value]).map(Number).sort((left, right) => left - right);
  return values[1] - values[0];
};
check(JSON.stringify([0, 1, 2, 4, 5, 7, 9].filter(value => gapFor(value) === 9)) === JSON.stringify([7, 9]), "예제 6-2 기준 답은 7, 9여야 합니다.");
check(Math.max(...counts(465, 776)) === 167, "예제 6-3 기준값은 167번이어야 합니다.");
check(counts(1, 9999)[7] === 4000, "예제 6-4 기준값은 4000번이어야 합니다.");
let fiveCards = 0;
for (let value = 5; value <= 555; value += 5) fiveCards += [...String(value)].filter(digit => digit === "5").length;
check(fiveCards === 80, "Mission 1 기준값은 80장이어야 합니다.");
check(naturalNumbers([0, 3, 4, 5, 8]).filter(value => value % 2 === 0).length === 60, "Mission 2 기준값은 60개여야 합니다.");
const hiddenCandidates = [0, 1, 2, 5, 8, 9].filter(value => {
  const values = naturalNumbers([3, 6, 4, value, 7]);
  return Math.max(...values) - Math.min(...values) === 41976;
});
check(JSON.stringify(hiddenCandidates) === JSON.stringify([5]), "Mission 3의 숨은 카드는 5 하나여야 합니다.");
const ranged = new Set();
for (let length = 1; length <= 4; length += 1) naturalNumbers([0, 1, 3, 4], length).forEach(value => { if (value > 40 && value < 400) ranged.add(value); });
check(ranged.size === 14, "Mission 4 기준값은 14개여야 합니다.");
const oneTo999 = counts(1, 999);
check(oneTo999[0] === 189 && Math.min(...oneTo999) === 189, "Mission 5 기준 답은 숫자 0, 189번이어야 합니다.");
check(Math.max(...counts(521, 879)) === 176, "Mission 6 기준값은 176번이어야 합니다.");

if (failures.length) {
  console.error(`4-1 규칙 찾기 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-1 규칙 찾기 감사 통과: 원문 66유형 · 공개 63 · 검수 대기 3 · 새 전용 생성 ${generatedCount.toLocaleString()}회 · 연산/수 카드 원문 기준값 독립 검산`);
