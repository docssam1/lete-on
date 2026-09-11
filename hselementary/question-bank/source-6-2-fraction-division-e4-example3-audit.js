"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-example-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Example3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["13:1:8:5:23:3", { burnedLength: "16:3", burnPerHour: "10:3", remainingTime: "23:10", totalBurnTime: "39:10", minutes: 138, answer: "2시간 18분" }],
  ["12:1:3:2:15:2", { burnedLength: "9:2", burnPerHour: "3:1", remainingTime: "5:2", totalBurnTime: "4:1", minutes: 150, answer: "2시간 30분" }],
  ["14:1:9:4:67:8", { burnedLength: "45:8", burnPerHour: "5:2", remainingTime: "67:20", totalBurnTime: "28:5", minutes: 201, answer: "3시간 21분" }]
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
  const initialLength = fraction(values[0], values[1]);
  const elapsedTime = fraction(values[2], values[3]);
  const remainingLength = fraction(values[4], values[5]);
  const burnedLength = subtract(initialLength, remainingLength);
  const burnPerHour = divide(burnedLength, elapsedTime);
  const remainingTime = divide(remainingLength, burnPerHour);
  const totalBurnTime = divide(initialLength, burnPerHour);
  const alternateRemainingTime = subtract(totalBurnTime, elapsedTime);
  const minuteValue = multiply(remainingTime, fraction(60));
  return { initialLength, elapsedTime, remainingLength, burnedLength, burnPerHour, remainingTime, totalBurnTime, alternateRemainingTime, minuteValue };
};

check(Boolean(type), "예제 4-3 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "예제 4-3 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("1 3/5시간") && readinessItem?.conditions?.includes("타는 빠르기가 일정함") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "2시간 18분" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-duration", "예제 4-3 검토표의 원본 조건·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-duration-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 4-3 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-example3-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.burnedLength) === expectedItem.burnedLength && signature(calculated.burnPerHour) === expectedItem.burnPerHour && signature(calculated.remainingTime) === expectedItem.remainingTime && signature(calculated.totalBurnTime) === expectedItem.totalBurnTime && signature(calculated.alternateRemainingTime) === expectedItem.remainingTime && calculated.minuteValue.denominator === 1 && calculated.minuteValue.numerator === expectedItem.minutes && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 남은 시간 방식과 전체 시간 방식의 독립 계산이 다릅니다.`);
  check([calculated.initialLength, calculated.elapsedTime, calculated.remainingLength, calculated.burnedLength, calculated.burnPerHour, calculated.remainingTime, calculated.totalBurnTime].every(value => value.numerator > 0), `${difficulty}/${seed}: 양초 길이·시간이 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-example3-kind") === "constant-candle-burn" && attr(generated.prompt, "data-result-contract") === "single-duration" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-example3-structure") === "constant-candle-burn" && attr(generated.prompt, "data-burn-per-hour") === expectedItem?.burnPerHour && attr(generated.prompt, "data-remaining-time") === expectedItem?.remainingTime && Number(attr(generated.prompt, "data-answer-minutes")) === expectedItem?.minutes && !generated.prompt.includes("source62-candle-time-board is-solved") && (generated.prompt.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 문제의 처음 길이·지난 시간·남은 길이 조건이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-example3-values") === sourceSignature && attr(generated.answerVisual, "data-burn-per-hour") === expectedItem?.burnPerHour && attr(generated.answerVisual, "data-remaining-time") === expectedItem?.remainingTime && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-candle-time-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 10, `${difficulty}/${seed}: 답의 탄 길이·1시간에 타는 길이·남은 시간·전체 시간 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 6 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 6, `${difficulty}/${seed}: 분수와 단위가 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("일정한 빠르기") && !visibleText(generated.prompt).includes(expectedItem?.answer || "답 없음"), `${difficulty}/${seed}: 일정한 빠르기 조건이 없거나 문제에 답이 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 4-3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 4-3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 남은 시간과 전체 시간 독립 계산 일치 · 답 후보 1개`);
