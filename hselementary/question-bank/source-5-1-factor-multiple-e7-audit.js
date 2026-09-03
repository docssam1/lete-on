"use strict";

const fs = require("node:fs");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync("hselementary/question-bank/source-inventory/5-1-unit-2-factor-multiple.json", "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u2");
const types = unit.subunits.flatMap(item => item.types);
const e7 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e7-"));
const ready = e7.filter(type => !type.reviewLocked);
const locked = e7.filter(type => type.reviewLocked);
const failures = [];
let checked = 0;

const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const gcdMany = values => values.reduce(gcd);
const divisors = value => Array.from({ length: value }, (_, index) => index + 1).filter(divisor => value % divisor === 0);
const normalized = value => String(value).replaceAll(" ", "").replaceAll(",", "");
const fraction = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return denominator / divisor === 1 ? String(numerator / divisor) : `${numerator / divisor}/${denominator / divisor}`;
};

function evidence(prompt) {
  const match = prompt.match(/data-factor-multiple-e7-kind="([^"]+)" data-factor-multiple-e7-values="([^"]*)" data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 계산용 값 태그가 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number), contract: match[3] };
}

function expected(prompt) {
  const { kind, values, contract } = evidence(prompt);
  if (kind === "short-left-student-count") {
    const [rice, riceShort, acorns, acornLeft, peanuts, peanutShort] = values;
    const greatest = gcdMany([rice + riceShort, acorns - acornLeft, peanuts + peanutShort]);
    const minimum = Math.max(riceShort, acornLeft, peanutShort);
    const candidates = divisors(greatest).filter(value => value > minimum);
    if (candidates.length !== 1) throw new Error(`학생 수 후보가 ${candidates.join(",")}로 하나가 아닙니다.`);
    return { contract, value: String(candidates[0]) };
  }
  if (kind === "rectangle-perimeter-tree-count" || kind === "rectangle-perimeter-minimum-lights") {
    const [width, height] = values;
    return { contract, value: String(2 * (width + height) / gcd(width, height)) };
  }
  if (kind === "fraction-rectangle-largest-square") {
    const [widthNumerator, heightNumerator, denominator] = values;
    return { contract, value: fraction(gcd(widthNumerator, heightNumerator), denominator) };
  }
  if (kind === "foam-lined-largest-cube") {
    const [outerWidth, outerLength, height, foam] = values;
    return { contract, value: String(gcdMany([outerWidth - 2 * foam, outerLength - 2 * foam, height])) };
  }
  if (kind === "straight-road-minimum-signs") {
    const [first, second] = values;
    return { contract, value: String((first + second) / gcd(first, second) + 1) };
  }
  if (kind === "fruit-counts-per-person") {
    const [tangerines, peaches] = values;
    const people = gcd(tangerines, peaches);
    return { contract, value: `${tangerines / people}${peaches / people}` };
  }
  if (kind === "second-largest-grid-square-count") {
    const [width, height] = values;
    const common = divisors(gcd(width, height)).sort((left, right) => right - left);
    if (common.length < 2) throw new Error("두 번째로 큰 정사각형을 만들 수 없습니다.");
    return { contract, value: String(width / common[1] * (height / common[1])) };
  }
  if (kind === "maximum-equal-set-price") {
    const [apples, oranges, bananas, applePrice, orangePrice, bananaPrice] = values;
    const sets = gcdMany([apples, oranges, bananas]);
    return { contract, value: String(apples / sets * applePrice + oranges / sets * orangePrice + bananas / sets * bananaPrice) };
  }
  throw new Error(`알 수 없는 E7 유형 ${kind}`);
}

const sourceAnswers = {
  "5-1-u2-e7-exploration": (() => {
    const greatest = gcdMany([82 + 8, 80 - 5, 101 + 4]);
    return divisors(greatest).filter(value => value > 8).join(",");
  })(),
  "5-1-u2-e7-example-7-2": String(2 * (24 + 32) / gcd(24, 32)),
  "5-1-u2-e7-example-7-3": fraction(gcd(40, 52), 7),
  "5-1-u2-e7-example-7-4": String(gcdMany([210 - 10, 370 - 10, 80])),
  "5-1-u2-e7-mission-1": String((42 + 70) / gcd(42, 70) + 1),
  "5-1-u2-e7-mission-2": `${40 / gcd(40, 56)},${56 / gcd(40, 56)}`,
  "5-1-u2-e7-mission-4": String(2 * (84 + 96) / gcd(84, 96)),
  "5-1-u2-e7-mission-5": (() => { const side = divisors(gcd(42, 12)).sort((a, b) => b - a)[1]; return String(42 / side * (12 / side)); })(),
  "5-1-u2-e7-mission-6": String(24 / 6 * 1000 + 30 / 6 * 800 + 48 / 6 * 500)
};
const expectedSourceAnswers = ["15", "14", "4/7", "40", "9", "5,7", "30", "56", "12000"];
const ambiguousExampleCandidates = divisors(gcdMany([60 - 4, 131 - 5, 100 - 2])).filter(value => value > 5);
const impossibleMissionCandidates = divisors(gcdMany([28 + 2, 48 - 3, 69 - 6])).filter(value => value > 6);

if (types.length !== 96 || e7.length !== 11 || ready.length !== 9 || locked.length !== 2) failures.push("원문 96유형 중 E7 공개 9·잠금 2 구성이 다릅니다.");
if (types.filter(type => !type.reviewLocked).length !== 81 || types.filter(type => type.reviewLocked).length !== 15) failures.push("단원 공개 81·잠금 15 구성이 다릅니다.");
if (inventory.items.filter(item => item.implementationStatus === "ready").length !== 81 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 15) failures.push("원장 공개 81·잠금 15 구성이 다릅니다.");
if (ambiguousExampleCandidates.join(",") !== "7,14") failures.push("예제 7-1의 복수 답 근거가 다릅니다.");
if (impossibleMissionCandidates.length !== 0) failures.push("Mission 3은 가능한 답이 없어야 합니다.");
for (const type of ready) {
  if (!type.sourceVerified || api.generatorKey(type) !== "factorMultipleE7") failures.push(`${type.sourceItemId}: 원문·생성기 연결이 다릅니다.`);
  if (!inventory.resultContracts[type.sourceItemId]) failures.push(`${type.sourceItemId}: 답 형식 계약이 없습니다.`);
  if (inventory.items.find(item => item.sourceItemId === type.sourceItemId)?.implementationStatus !== "ready") failures.push(`${type.sourceItemId}: 원장 공개 상태가 다릅니다.`);
}
for (const type of locked) {
  if (api.generatorKey(type)) failures.push(`${type.sourceItemId}: 잠금 항목이 생성기에 연결되었습니다.`);
  if (!type.reviewReason) failures.push(`${type.sourceItemId}: 잠금 사유가 없습니다.`);
}
Object.values(sourceAnswers).map(normalized).forEach((answer, index) => {
  if (answer !== normalized(expectedSourceAnswers[index])) failures.push(`원문 공개 ${index + 1}번 독립 계산값 ${answer}이 예상값 ${expectedSourceAnswers[index]}과 다릅니다.`);
});

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
        const recalculated = expected(generated.prompt);
        if (inventory.resultContracts[type.sourceItemId] !== recalculated.contract) throw new Error("답 형식 계약이 다릅니다.");
        if (normalized(generated.answer) !== normalized(recalculated.value)) throw new Error(`독립 계산값 ${recalculated.value}과 정답 ${generated.answer}이 다릅니다.`);
        if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("쉬움 문항에 풀이 실마리가 없습니다.");
        if (difficulty === 0 && (generated.prompt.includes("풀이 도움:") || generated.prompt.includes("다시 확인하세요."))) throw new Error("같게 문항에 난이도 안내가 섞였습니다.");
        if (difficulty === 1 && !generated.prompt.includes("다시 확인하세요.")) throw new Error("어려움 문항에 조건 재확인 단계가 없습니다.");
        if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt} ${generated.solution}`)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
        checked += 1;
      } catch (error) {
        failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 7 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 7 감사 통과: 원문 11항목 · 공개 9/잠금 2 · ${checked.toLocaleString()}회 독립 계산·단일 답 검사`);
