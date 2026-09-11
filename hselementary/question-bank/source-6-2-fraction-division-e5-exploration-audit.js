"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-exploration";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Exploration";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["3:7:5:8:127:116", { firstFactor: [7, 3], thirdFactor: [8, 5], factorDifference: [11, 15], sumDifference: 11, height: 15, lengths: [35, 92, 24] }],
  ["2:5:3:7:123:120", { firstFactor: [5, 2], thirdFactor: [7, 3], factorDifference: [1, 6], sumDifference: 3, height: 18, lengths: [45, 78, 42] }],
  ["4:9:5:12:128:131", { firstFactor: [9, 4], thirdFactor: [12, 5], factorDifference: [3, 20], sumDifference: 3, height: 20, lengths: [45, 83, 48] }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = markup => String(markup).replace(/<span\s+hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (left, right) => {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const rational = (numerator, denominator = 1) => {
  if (!denominator) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
};
const same = (left, right) => Boolean(left && right && left.numerator === right.numerator && left.denominator === right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-exploration-kind="three-rods-submerged-water-height"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(":").map(Number);
  check(Boolean(markup), "개념탐구 5 독립 검산 자료가 없습니다.");
  check(values.length === 17 && values.every(Number.isFinite), `개념탐구 5 검산 자료가 깨졌습니다: ${values.join(":")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e5-exploration-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [firstN, firstD, thirdN, thirdD, firstSecondSum, secondThirdSum] = values;
  const firstSubmerged = rational(firstN, firstD);
  const thirdSubmerged = rational(thirdN, thirdD);
  const firstFactor = divide(rational(1), firstSubmerged);
  const thirdFactor = divide(rational(1), thirdSubmerged);
  const firstIsLonger = firstFactor.numerator * thirdFactor.denominator > thirdFactor.numerator * firstFactor.denominator;
  const factorDifference = firstIsLonger ? subtract(firstFactor, thirdFactor) : subtract(thirdFactor, firstFactor);
  const sumDifference = rational(Math.abs(firstSecondSum - secondThirdSum));
  const height = divide(sumDifference, factorDifference);
  const firstLength = multiply(height, firstFactor);
  const thirdLength = multiply(height, thirdFactor);
  const secondFromFirst = subtract(rational(firstSecondSum), firstLength);
  const secondFromThird = subtract(rational(secondThirdSum), thirdLength);
  const candidates = Array.from({ length: 200 }, (_, index) => index + 1).filter(candidate => same(multiply(rational(candidate), factorDifference), sumDifference));
  check(same(secondFromFirst, secondFromThird), "두 길이 합에서 구한 ㉡ 막대 길이가 다릅니다.");
  check(same(divide(height, firstLength), firstSubmerged) && same(divide(height, thirdLength), thirdSubmerged), "물 높이와 두 잠긴 비를 다시 계산한 값이 다릅니다.");
  check(candidates.length === 1 && candidates[0] === height.numerator, `물 높이 후보가 ${candidates.length}개입니다.`);
  return { firstFactor, thirdFactor, factorDifference, sumDifference, height, lengths: [firstLength, secondFromFirst, thirdLength], candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "개념탐구 5 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "분수만큼 잠긴 막대의 길이로 물 높이 구하기", "개념탐구 5 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "개념탐구 5 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 46 && readiness.integrity.lockedCount === 20 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "15cm" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.candidateAnswerCount === 1, "개념탐구 5 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-natural-centimeter" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "개념탐구 5 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e5-exploration-values");
  const answerSignature = attr(generated.answerVisual, "data-source62-e5-exploration-values");
  const row = expected.get(signature);
  const calculated = independentlyCalculate(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "three-rods-submerged-water-height" && evidence.contract === "single-natural-centimeter" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(row) && same(calculated.firstFactor, rational(...row.firstFactor)) && same(calculated.thirdFactor, rational(...row.thirdFactor)) && same(calculated.factorDifference, rational(...row.factorDifference)) && calculated.sumDifference.numerator === row.sumDifference && calculated.height.numerator === row.height && calculated.lengths.every((value, index) => value.numerator === row.lengths[index] && value.denominator === 1) && generated.answer === `${row.height}cm`, `${difficulty}/${seed}: 표시 답과 독립 계산한 물 높이·세 막대 길이가 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 잠긴 비·길이 합 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source61-math-row"/g) || []).length === 4 && generated.prompt.includes("㉠") && generated.prompt.includes("㉡") && generated.prompt.includes("㉢"), `${difficulty}/${seed}: 문제의 세 막대 관계표가 다릅니다.`);
  check((generated.answerVisual.match(/class="source61-math-row"/g) || []).length === 13 && generated.answerVisual.includes("source62-rod-water-board is-solved") && generated.answerVisual.includes("source62-rod-water-solution"), `${difficulty}/${seed}: 답의 세 막대 길이와 독립 계산표가 없습니다.`);
  check(!generated.prompt.includes("source62-rod-water-board is-solved") && !generated.prompt.includes("source62-rod-water-solution") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes(`data-candidate-count="1"`), `${difficulty}/${seed}: 답 그림의 원문·단일 답 표시가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 5 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 5 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 세 막대 길이 역대입 · 물 높이 후보 1개`);
