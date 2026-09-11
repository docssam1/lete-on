"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["9:10:9:5:2:3:12:5", { firstRate: "1:2", secondRate: "5:18", firstTotal: "2:1", secondTotal: "18:5", difference: "8:5", minutes: 96, answer: "1시간 36분" }],
  ["3:4:3:2:5:8:5:2", { firstRate: "1:2", secondRate: "1:4", firstTotal: "2:1", secondTotal: "4:1", difference: "2:1", minutes: 120, answer: "2시간" }],
  ["7:8:7:3:5:6:10:3", { firstRate: "3:8", secondRate: "1:4", firstTotal: "8:3", secondTotal: "4:1", difference: "4:3", minutes: 80, answer: "1시간 20분" }]
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
const visibleText = html => String(html || "").replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const check = (condition, message) => { if (!condition) failures.push(message); };
const calculate = raw => {
  const values = raw.split(":").map(Number);
  const firstFraction = fraction(values[0], values[1]);
  const firstTime = fraction(values[2], values[3]);
  const secondFraction = fraction(values[4], values[5]);
  const secondTime = fraction(values[6], values[7]);
  const firstRate = divide(firstFraction, firstTime);
  const secondRate = divide(secondFraction, secondTime);
  const firstTotal = divide(fraction(1), firstRate);
  const secondTotal = divide(fraction(1), secondRate);
  const firstDirect = divide(firstTime, firstFraction);
  const secondDirect = divide(secondTime, secondFraction);
  const difference = subtract(secondTotal, firstTotal);
  const directDifference = subtract(secondDirect, firstDirect);
  const minutes = multiply(difference, fraction(60));
  return { firstRate, secondRate, firstTotal, secondTotal, firstDirect, secondDirect, difference, directDifference, minutes };
};

check(Boolean(type), "Mission 4 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 4 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === 46 && readiness.integrity.lockedCount === 20 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("산 전체 높이") && readinessItem?.conditions?.includes("동시에 출발") && readinessItem?.answerCandidates?.[0] === "1시간36분" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-duration-difference" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.releaseStatus === "verified", "Mission 4 검토표의 같은 산·시간 차·정답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-duration-difference-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 4 원자료 장부의 원문 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission4-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.firstRate) === expectedItem.firstRate && signature(calculated.secondRate) === expectedItem.secondRate && signature(calculated.firstTotal) === expectedItem.firstTotal && signature(calculated.secondTotal) === expectedItem.secondTotal && signature(calculated.firstDirect) === expectedItem.firstTotal && signature(calculated.secondDirect) === expectedItem.secondTotal && signature(calculated.difference) === expectedItem.difference && signature(calculated.directDifference) === expectedItem.difference && calculated.minutes.denominator === 1 && calculated.minutes.numerator === expectedItem.minutes && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 1시간 높이 방식과 전체 높이의 배수 방식의 독립 계산이 다릅니다.`);
  check(calculated.firstTotal.numerator * calculated.secondTotal.denominator < calculated.secondTotal.numerator * calculated.firstTotal.denominator, `${difficulty}/${seed}: 두 사람의 정상 도착 시간 차가 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission4-kind") === "mountain-climb-time-difference" && attr(generated.prompt, "data-result-contract") === "single-duration-difference" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission4-structure") === "mountain-climb-time-difference" && attr(generated.prompt, "data-first-per-hour") === expectedItem?.firstRate && attr(generated.prompt, "data-second-per-hour") === expectedItem?.secondRate && attr(generated.prompt, "data-first-total") === expectedItem?.firstTotal && attr(generated.prompt, "data-second-total") === expectedItem?.secondTotal && Number(attr(generated.prompt, "data-answer-minutes")) === expectedItem?.minutes, `${difficulty}/${seed}: 산 높이 비와 정상까지 걸리는 시간 자료가 다릅니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission4-values") === sourceSignature && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-climb-time-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 14, `${difficulty}/${seed}: 답의 두 사람 전체 시간과 두 독립 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 4 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 6 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 12, `${difficulty}/${seed}: 세로 분수·시간 단위 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율|비례식/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("동시에") && visibleText(generated.prompt).includes("정상") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 동시 출발·정상 조건이 없거나 스캔 표시가 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 정상까지 걸리는 시간 두 방법 일치 · 답 후보 1개`);
