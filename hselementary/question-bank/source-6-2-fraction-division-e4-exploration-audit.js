"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-exploration";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Exploration";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["7:10:18:5:13:5:64:5:965:8", { distancePerLitre: "36:7", totalDistance: "5337:40", totalFuel: "4151:160", used: "112:45", remaining: "1:9", futureFuel: "6755:288", answer: "747:32", shownAnswer: "23 11/32L" }],
  ["3:4:9:2:7:3:11:1:273:4", { distancePerLitre: "6:1", totalDistance: "317:4", totalFuel: "317:24", used: "11:6", remaining: "1:2", futureFuel: "91:8", answer: "87:8", shownAnswer: "10 7/8L" }],
  ["7:8:25:6:18:5:90:7:585:7", { distancePerLitre: "100:21", totalDistance: "675:7", totalFuel: "81:4", used: "27:10", remaining: "9:10", futureFuel: "351:20", answer: "333:20", shownAnswer: "16 13/20L" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const value = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const op = (left, right, operator) => {
  if (operator === "+") return value(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "-") return value(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "×") return value(left.numerator * right.numerator, left.denominator * right.denominator);
  return value(left.numerator * right.denominator, left.denominator * right.numerator);
};
const signature = item => `${item.numerator}:${item.denominator}`;

function calculate(sourceSignature) {
  const numbers = sourceSignature.split(":").map(Number);
  const [unitFuel, unitDistance, initialFuel, drivenDistance, additionalDistance] = Array.from({ length: 5 }, (_, index) => value(numbers[index * 2], numbers[index * 2 + 1]));
  const distancePerLitre = op(unitDistance, unitFuel, "÷");
  const totalDistance = op(drivenDistance, additionalDistance, "+");
  const totalFuel = op(totalDistance, distancePerLitre, "÷");
  const answer = op(totalFuel, initialFuel, "-");
  const used = op(drivenDistance, distancePerLitre, "÷");
  const remaining = op(initialFuel, used, "-");
  const futureFuel = op(additionalDistance, distancePerLitre, "÷");
  const alternateAnswer = op(futureFuel, remaining, "-");
  return { distancePerLitre, totalDistance, totalFuel, used, remaining, futureFuel, answer, alternateAnswer };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "개념탐구 4 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "개념탐구 4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("7/10L") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "747/32L" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-value", "개념탐구 4 검토표의 원본 조건·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-value-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "개념탐구 4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-exploration-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.distancePerLitre) === expectedItem.distancePerLitre && signature(calculated.totalDistance) === expectedItem.totalDistance && signature(calculated.totalFuel) === expectedItem.totalFuel && signature(calculated.used) === expectedItem.used && signature(calculated.remaining) === expectedItem.remaining && signature(calculated.futureFuel) === expectedItem.futureFuel && signature(calculated.answer) === expectedItem.answer && signature(calculated.alternateAnswer) === expectedItem.answer && generated.answer === expectedItem.shownAnswer, `${difficulty}/${seed}: 전체 거리 방식과 남은 기름 방식의 독립 계산이 다릅니다.`);
  check(calculated.remaining.numerator > 0 && calculated.answer.numerator > 0, `${difficulty}/${seed}: 주유소 도착 전 기름이 모자라거나 주유량이 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-exploration-kind") === "fuel-distance-unit-rate" && attr(generated.prompt, "data-result-contract") === "single-value" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-exploration-structure") === "fuel-distance-unit-rate" && attr(generated.prompt, "data-distance-per-litre") === expectedItem?.distancePerLitre && attr(generated.prompt, "data-added-fuel") === expectedItem?.answer && !generated.prompt.includes("source62-unit-rate-trip-board is-solved") && (generated.prompt.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 문제의 기름·거리 네 조건이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-exploration-values") === sourceSignature && attr(generated.answerVisual, "data-distance-per-litre") === expectedItem?.distancePerLitre && attr(generated.answerVisual, "data-added-fuel") === expectedItem?.answer && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-unit-rate-trip-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 9, `${difficulty}/${seed}: 답의 같은 자료·1L당 거리·전체 거리·주유량 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 9 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 9, `${difficulty}/${seed}: 분수와 단위가 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(!visibleText(generated.prompt).includes(expectedItem?.shownAnswer || "답 없음"), `${difficulty}/${seed}: 문제에 답이 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 전체 거리와 남은 기름 독립 계산 일치 · 답 후보 1개`);
