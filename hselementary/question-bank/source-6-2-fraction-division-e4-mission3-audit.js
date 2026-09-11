"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["30:1:5:3:45:2:15:1", { burned: "15:2", rate: "9:2", after: "15:2", additional: "5:3", totalBurn: "15:1", totalTime: "10:3", minutes: 100, answer: "1시간 40분" }],
  ["36:1:3:2:27:1:18:1", { burned: "9:1", rate: "6:1", after: "9:1", additional: "3:2", totalBurn: "18:1", totalTime: "3:1", minutes: 90, answer: "1시간 30분" }],
  ["40:1:5:4:35:1:25:1", { burned: "5:1", rate: "4:1", after: "10:1", additional: "5:2", totalBurn: "15:1", totalTime: "15:4", minutes: 150, answer: "2시간 30분" }]
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
  const initial = fraction(values[0], values[1]);
  const elapsed = fraction(values[2], values[3]);
  const measured = fraction(values[4], values[5]);
  const target = fraction(values[6], values[7]);
  const burned = subtract(initial, measured);
  const rate = divide(burned, elapsed);
  const after = subtract(measured, target);
  const additional = divide(after, rate);
  const totalBurn = subtract(initial, target);
  const totalTime = divide(totalBurn, rate);
  const alternate = subtract(totalTime, elapsed);
  const minutes = multiply(additional, fraction(60));
  return { initial, elapsed, measured, target, burned, rate, after, additional, totalBurn, totalTime, alternate, minutes };
};

check(Boolean(type), "Mission 3 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 3 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === 43 && readiness.integrity.lockedCount === 23 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("몇 시간 몇 분이 더") && readinessItem?.conditions?.includes("측정한 때부터 더 걸리는 시간") && readinessItem?.answerCandidates?.[0] === "1시간40분" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-additional-duration" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.releaseStatus === "verified", "Mission 3 검토표의 더 걸리는 시간·정답·공개 상태가 완결되지 않았습니다.");
check(!readinessItem?.answerCandidates?.includes("3시간20분"), "Mission 3 검토표에 처음부터의 전체 시간이 정답으로 남아 있습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-additional-duration-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 3 원자료 장부의 원문 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission3-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.burned) === expectedItem.burned && signature(calculated.rate) === expectedItem.rate && signature(calculated.after) === expectedItem.after && signature(calculated.additional) === expectedItem.additional && signature(calculated.totalBurn) === expectedItem.totalBurn && signature(calculated.totalTime) === expectedItem.totalTime && signature(calculated.alternate) === expectedItem.additional && calculated.minutes.denominator === 1 && calculated.minutes.numerator === expectedItem.minutes && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 측정 뒤 시간·처음부터의 전체 시간의 독립 계산이 다릅니다.`);
  check(calculated.initial.numerator * calculated.measured.denominator > calculated.measured.numerator * calculated.initial.denominator && calculated.measured.numerator * calculated.target.denominator > calculated.target.numerator * calculated.measured.denominator, `${difficulty}/${seed}: 양초 길이의 순서가 올바르지 않습니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission3-kind") === "constant-candle-burn-to-target" && attr(generated.prompt, "data-result-contract") === "single-additional-duration" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission3-structure") === "constant-candle-burn-to-target" && attr(generated.prompt, "data-burn-per-hour") === expectedItem?.rate && attr(generated.prompt, "data-additional-time") === expectedItem?.additional && Number(attr(generated.prompt, "data-answer-minutes")) === expectedItem?.minutes, `${difficulty}/${seed}: 양초의 추가 시간 자료가 다릅니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission3-values") === sourceSignature && attr(generated.answerVisual, "data-additional-time") === expectedItem?.additional && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-candle-target-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 13, `${difficulty}/${seed}: 답 계산판 또는 두 독립 계산이 문제 자료와 다릅니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 8 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 8 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 3, `${difficulty}/${seed}: 세로 분수·단위 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("더 지나면") && !visibleText(generated.prompt).includes(expectedItem?.answer || "답 없음") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 추가 시간 조건이 없거나 문제에 답·스캔 표시가 노출되었습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 추가 시간과 전체 시간 독립 계산 일치 · 답 후보 1개`);
