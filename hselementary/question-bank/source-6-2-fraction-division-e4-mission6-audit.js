"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-6";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission6";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["5:6:7:4:8:3:24:19:20", { totalTime: "21:4", totalProblems: 63, smallDenominator: 12, slots: "10:21:32", totalSlots: 63, average: 12 }],
  ["3:4:3:2:9:4:10:26:36", { totalTime: "9:2", totalProblems: 72, smallDenominator: 4, slots: "3:6:9", totalSlots: 18, average: 16 }],
  ["5:6:4:3:5:2:18:21:45", { totalTime: "14:3", totalProblems: 84, smallDenominator: 6, slots: "5:8:15", totalSlots: 28, average: 18 }]
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
const add = (left, right) => fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const check = (condition, message) => { if (!condition) failures.push(message); };

function calculate(raw) {
  const values = raw.split(":").map(Number);
  const times = [fraction(values[0], values[1]), fraction(values[2], values[3]), fraction(values[4], values[5])];
  const problems = values.slice(6, 9);
  const totalTime = times.reduce(add, fraction(0));
  const totalProblems = problems.reduce((sum, value) => sum + value, 0);
  const average = divide(fraction(totalProblems), totalTime);
  const smallDenominator = times.map(value => value.denominator).reduce(lcm);
  const slots = times.map(value => value.numerator * smallDenominator / value.denominator);
  const totalSlots = slots.reduce((sum, value) => sum + value, 0);
  const averageBySlots = fraction(totalProblems * smallDenominator, totalSlots);
  return { totalTime, totalProblems, average, smallDenominator, slots, totalSlots, averageBySlots };
}

check(Boolean(type), "Mission 6 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 6 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === 43 && readiness.integrity.lockedCount === 23 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("5/6시간 동안 24문제") && readinessItem?.conditions?.includes("3일 전체의 시간당 평균") && readinessItem?.answerCandidates?.[0] === "12문제" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-whole-number-average" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.releaseStatus === "verified", "Mission 6 검토표의 세 날·전체 평균·정답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 6 원자료 장부의 원문 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission6-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.totalTime) === expectedItem.totalTime && calculated.totalProblems === expectedItem.totalProblems && calculated.smallDenominator === expectedItem.smallDenominator && calculated.slots.join(":") === expectedItem.slots && calculated.totalSlots === expectedItem.totalSlots && calculated.average.denominator === 1 && calculated.average.numerator === expectedItem.average && calculated.averageBySlots.denominator === 1 && calculated.averageBySlots.numerator === expectedItem.average && generated.answer === `${expectedItem.average}문제`, `${difficulty}/${seed}: 전체 시간 방식과 작은 시간 칸 방식의 독립 계산이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission6-kind") === "three-day-hourly-average" && attr(generated.prompt, "data-result-contract") === "single-whole-number-average" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission6-structure") === "three-day-hourly-average" && attr(generated.prompt, "data-total-time") === expectedItem?.totalTime && Number(attr(generated.prompt, "data-total-problems")) === expectedItem?.totalProblems && Number(attr(generated.prompt, "data-small-time-denominator")) === expectedItem?.smallDenominator && Number(attr(generated.prompt, "data-total-time-slots")) === expectedItem?.totalSlots && Number(attr(generated.prompt, "data-answer-average")) === expectedItem?.average, `${difficulty}/${seed}: 문제와 답의 세 날·전체 시간·문제 수 자료가 다릅니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission6-values") === sourceSignature && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-study-table is-solved") && generated.answerVisual.includes("source62-study-average-solution") && (generated.answerVisual.match(/source62-study-row/g) || []).length === 5 && (generated.answerVisual.match(/source61-math-row/g) || []).length === 7, `${difficulty}/${seed}: 답의 3일 표와 두 계산 방법이 없습니다.`);
  check((generated.prompt.match(/class="math-fraction"/g) || []).length >= 6 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 5 && (generated.answerVisual.match(/class="math-unit"/g) || []).length >= 8, `${difficulty}/${seed}: 세로 분수·시간·문제 단위 또는 답 표가 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율|비례식/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("3일 동안") && visibleText(generated.prompt).includes("한 시간에 평균") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 전체 평균 질문이 없거나 스캔 표시가 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 6 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 6 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 전체 시간과 작은 시간 칸 계산 일치 · 답 후보 1개`);
