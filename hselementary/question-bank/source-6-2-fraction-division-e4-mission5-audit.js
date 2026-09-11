"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-5";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission5";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["9:3:4:4:15:5:12", { firstRate: "1:12", secondRate: "1:36", firstDone: "1:3", remaining: "2:3", wholeUnits: 36, answerDays: 24, answer: "24일" }],
  ["10:2:3:5:18:3:5", { firstRate: "1:15", secondRate: "1:30", firstDone: "1:3", remaining: "2:3", wholeUnits: 30, answerDays: 20, answer: "20일" }],
  ["9:3:5:3:20:2:3", { firstRate: "1:15", secondRate: "1:30", firstDone: "1:5", remaining: "4:5", wholeUnits: 30, answerDays: 24, answer: "24일" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const fraction = (numerator, denominator = 1) => {
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: Math.abs(denominator / divisor) };
};
const subtract = (left, right) => fraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => fraction(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const same = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const check = (condition, message) => { if (!condition) failures.push(message); };

function calculate(raw) {
  const [firstDays, firstNumerator, firstDenominator, firstWorkDays, secondDays, secondNumerator, secondDenominator] = raw.split(":").map(Number);
  const firstFraction = fraction(firstNumerator, firstDenominator);
  const secondFraction = fraction(secondNumerator, secondDenominator);
  const firstRate = divide(firstFraction, fraction(firstDays));
  const secondRate = divide(secondFraction, fraction(secondDays));
  const firstDone = multiply(firstRate, fraction(firstWorkDays));
  const remaining = subtract(fraction(1), firstDone);
  const answerDays = divide(remaining, secondRate);
  const firstDoneDirect = multiply(firstFraction, fraction(firstWorkDays, firstDays));
  const remainingDirect = subtract(fraction(1), firstDoneDirect);
  const secondWholeDays = divide(fraction(secondDays), secondFraction);
  const answerDirect = multiply(remainingDirect, secondWholeDays);
  const wholeUnits = [firstRate.denominator, secondRate.denominator, remaining.denominator].reduce(lcm);
  return { firstRate, secondRate, firstDone, remaining, answerDays, firstDoneDirect, remainingDirect, answerDirect, wholeUnits };
}

check(Boolean(type), "Mission 5 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 5 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === 41 && readiness.integrity.lockedCount === 25 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("영명이는 9일") && readinessItem?.conditions?.includes("민구는 15일 동안 전체의 5/12를 함") && readinessItem?.answerCandidates?.[0] === "24일" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-natural-day-count" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.releaseStatus === "verified", "Mission 5 검토표의 두 사람·남은 일·정답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-natural-day-count-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 5 원자료 장부의 원문 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission5-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.firstRate) === expectedItem.firstRate && signature(calculated.secondRate) === expectedItem.secondRate && signature(calculated.firstDone) === expectedItem.firstDone && signature(calculated.remaining) === expectedItem.remaining && calculated.wholeUnits === expectedItem.wholeUnits && calculated.answerDays.denominator === 1 && calculated.answerDays.numerator === expectedItem.answerDays && same(calculated.firstDone, calculated.firstDoneDirect) && same(calculated.remaining, calculated.remainingDirect) && same(calculated.answerDays, calculated.answerDirect) && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 하루에 한 일과 전체 칸 수의 독립 계산이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission5-kind") === "remaining-work-days" && attr(generated.prompt, "data-result-contract") === "single-natural-day-count" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission5-structure") === "remaining-work-days" && attr(generated.prompt, "data-first-rate") === expectedItem?.firstRate && attr(generated.prompt, "data-second-rate") === expectedItem?.secondRate && attr(generated.prompt, "data-first-done") === expectedItem?.firstDone && attr(generated.prompt, "data-remaining") === expectedItem?.remaining && Number(attr(generated.prompt, "data-whole-units")) === expectedItem?.wholeUnits && Number(attr(generated.prompt, "data-answer-days")) === expectedItem?.answerDays, `${difficulty}/${seed}: 문제와 답의 기간·분수·남은 일 자료가 다릅니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission5-values") === sourceSignature && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-work-rate-board is-solved") && generated.answerVisual.includes("source62-work-strip") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 10, `${difficulty}/${seed}: 답의 전체 막대와 두 계산 방법이 없습니다.`);
  check((generated.prompt.match(/class="math-fraction"/g) || []).length >= 4 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 4 && (generated.answerVisual.match(/class="math-unit"/g) || []).length >= 1, `${difficulty}/${seed}: 세로 분수·일 단위 또는 답 그림이 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율|비례식|민규/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값·어려운 말 또는 잘못 읽은 이름이 있습니다.`);
  check(visibleText(generated.prompt).includes("나머지 일") && visibleText(generated.prompt).includes("며칠") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 순서·질문이 없거나 스캔 표시가 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 5 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 5 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 하루에 한 일과 전체 칸 수 계산 일치 · 답 후보 1개`);
