"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-example-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Example4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["8:7:2:5:21:5:7:2:10:1", { firstSpeed: "20:7", secondSpeed: "6:5", firstArrival: "7:2", secondArrival: "25:3", difference: "29:6", minutes: 290, answer: "지선이 4시간 50분 먼저" }],
  ["5:3:1:4:18:5:3:2:10:1", { firstSpeed: "20:3", secondSpeed: "12:5", firstArrival: "3:2", secondArrival: "25:6", difference: "8:3", minutes: 160, answer: "지선이 2시간 40분 먼저" }],
  ["15:8:1:2:4:1:3:2:12:1", { firstSpeed: "15:4", secondSpeed: "8:3", firstArrival: "16:5", secondArrival: "9:2", difference: "13:10", minutes: 78, answer: "지선이 1시간 18분 먼저" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fraction = (numerator, denominator = 1) => {
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
};
const subtract = (left, right) => fraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => fraction(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "")
  .replace(/<span hidden[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const calculate = raw => {
  const values = raw.split(":").map(Number);
  const firstDistance = fraction(values[0], values[1]);
  const firstTime = fraction(values[2], values[3]);
  const secondDistance = fraction(values[4], values[5]);
  const secondTime = fraction(values[6], values[7]);
  const targetDistance = fraction(values[8], values[9]);
  const firstSpeed = divide(firstDistance, firstTime);
  const secondSpeed = divide(secondDistance, secondTime);
  const firstArrival = divide(targetDistance, firstSpeed);
  const secondArrival = divide(targetDistance, secondSpeed);
  const firstByScale = multiply(firstTime, divide(targetDistance, firstDistance));
  const secondByScale = multiply(secondTime, divide(targetDistance, secondDistance));
  const difference = subtract(secondArrival, firstArrival);
  const firstMinutes = multiply(firstArrival, fraction(60));
  const secondMinutes = multiply(secondArrival, fraction(60));
  const differenceMinutes = subtract(secondMinutes, firstMinutes);
  return { firstSpeed, secondSpeed, firstArrival, secondArrival, firstByScale, secondByScale, difference, firstMinutes, secondMinutes, differenceMinutes };
};

check(Boolean(type), "예제 4-4 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "예제 4-4 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("동시에 출발") && readinessItem?.conditions?.includes("두 사람의 빠르기가 각각 일정함") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "지선이 4시간 50분 먼저" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-person-duration", "예제 4-4 검토표의 원본 조건·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-person-duration-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 4-4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-example4-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.firstSpeed) === expectedItem.firstSpeed && signature(calculated.secondSpeed) === expectedItem.secondSpeed && signature(calculated.firstArrival) === expectedItem.firstArrival && signature(calculated.secondArrival) === expectedItem.secondArrival && signature(calculated.firstByScale) === expectedItem.firstArrival && signature(calculated.secondByScale) === expectedItem.secondArrival && signature(calculated.difference) === expectedItem.difference && calculated.differenceMinutes.denominator === 1 && calculated.differenceMinutes.numerator === expectedItem.minutes && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 속력 방식과 거리의 배수 방식의 독립 계산이 다릅니다.`);
  check(calculated.firstArrival.numerator * calculated.secondArrival.denominator < calculated.secondArrival.numerator * calculated.firstArrival.denominator && calculated.firstMinutes.denominator === 1 && calculated.secondMinutes.denominator === 1, `${difficulty}/${seed}: 먼저 도착하는 사람 또는 시간·분 변환이 하나로 정해지지 않습니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-example4-kind") === "compare-constant-speeds" && attr(generated.prompt, "data-result-contract") === "single-person-duration" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-example4-structure") === "compare-constant-speeds" && attr(generated.prompt, "data-first-speed") === expectedItem?.firstSpeed && attr(generated.prompt, "data-second-speed") === expectedItem?.secondSpeed && attr(generated.prompt, "data-first-arrival") === expectedItem?.firstArrival && attr(generated.prompt, "data-second-arrival") === expectedItem?.secondArrival && Number(attr(generated.prompt, "data-answer-minutes")) === expectedItem?.minutes && !generated.prompt.includes("source62-travel-time-board is-solved") && (generated.prompt.match(/source61-math-row/g) || []).length === 5, `${difficulty}/${seed}: 문제의 두 사람 거리·시간·목표 거리 조건이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-example4-values") === sourceSignature && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-travel-time-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 15, `${difficulty}/${seed}: 답의 두 속력·두 도착 시간·시간 차·배수 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 10 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 10, `${difficulty}/${seed}: 분수와 단위가 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("동시에 출발") && visibleText(generated.prompt).includes("일정한 빠르기") && !visibleText(generated.prompt).includes(expectedItem?.answer || "답 없음"), `${difficulty}/${seed}: 원문 조건이 없거나 문제에 답이 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 4-4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 4-4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 빠르기와 거리의 배수 독립 계산 일치 · 답 후보 1개`);
