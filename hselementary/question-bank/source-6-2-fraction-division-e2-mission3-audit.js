"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["1:6:1:10:4:15:5:2:12", { days: 60, target: "7:1:12", answer: "7월 1일 낮 12시" }],
  ["1:8:1:12:1:6:3:14:9", { days: 48, target: "5:1:9", answer: "5월 1일 오전 9시" }],
  ["1:5:1:15:1:5:6:16:15", { days: 45, target: "7:31:15", answer: "7월 31일 오후 3시" }]
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
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission3-kind="opposite-clock-drift-calendar"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 3 독립 검산 자료가 없습니다.");
  check(values.length === 17 && values.every(Number.isFinite), `Mission 3 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission3-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [fastN, fastD, slowN, slowD, targetN, targetD, gapN, gapD, targetMinutesN, targetMinutesD, elapsedN, elapsedD, startMonth, startDay, startHour, targetMonth, targetDay] = values;
  const dailyGap = add(rational(fastN, fastD), rational(slowN, slowD));
  const targetMinutes = multiply(rational(targetN, targetD), rational(60));
  const elapsed = divide(targetMinutes, dailyGap);
  const candidateDays = Array.from({ length: 365 }, (_, index) => index + 1).filter(days => equal(multiply(dailyGap, rational(days)), targetMinutes));
  const start = new Date(Date.UTC(2025, startMonth - 1, startDay, startHour));
  const target = new Date(start.getTime() + elapsed.numerator * 24 * 60 * 60 * 1000);
  const calculatedTarget = `${target.getUTCMonth() + 1}:${target.getUTCDate()}:${target.getUTCHours()}`;
  check(equal(dailyGap, rational(gapN, gapD)) && equal(targetMinutes, rational(targetMinutesN, targetMinutesD)) && equal(elapsed, rational(elapsedN, elapsedD)), "하루 시계 차·목표 분·지난 날 수의 독립 계산값이 다릅니다.");
  check(elapsed.denominator === 1 && candidateDays.length === 1 && candidateDays[0] === elapsed.numerator, `목표 시계 차가 처음 생기는 날 후보가 ${candidateDays.length}개입니다.`);
  check(calculatedTarget === `${targetMonth}:${targetDay}:${startHour}`, `UTC 달력으로 다시 계산한 날짜가 다릅니다: ${calculatedTarget}`);
  return { elapsedDays: elapsed.numerator, target: calculatedTarget };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "빠르고 느린 시계의 차가 커지는 때 구하기", "Mission 3 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "Mission 3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 19 && readiness.integrity.lockedCount === 47, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "7월 1일 낮 12시" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 3 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-datetime-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 3 원자료 장부의 원본 확인·단일 날짜·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission3-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission3-expression");
  const calculated = independentSolution(evidence.values);
  const expectedRow = expected.get(signature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "opposite-clock-drift-calendar" && evidence.contract === "single-datetime" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 날짜·난이도 계약이 다릅니다.`);
  check(expectedRow?.days === calculated.elapsedDays && expectedRow?.target === calculated.target && generated.answer === expectedRow?.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 날짜·시각이 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 두 시계 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-clock-drift-card/g) || []).length === 2 && (generated.prompt.match(/class="source62-clock-face/g) || []).length === 2, `${difficulty}/${seed}: 빨라지는 시계와 늦어지는 시계가 모두 표시되지 않았습니다.`);
  check(!generated.prompt.includes("source62-clock-drift-solution") && !generated.prompt.includes("source62-clock-drift-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답 날짜가 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-clock-drift-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답 자료판의 두 시계와 네 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 목표 날짜 후보 1개 · UTC 달력 독립 검산`);
