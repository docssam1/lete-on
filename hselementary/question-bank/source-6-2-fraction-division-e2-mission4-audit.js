"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["3:4:9:4:6:30", { perDay: 3, total: 90, answer: "90개" }],
  ["2:3:8:3:4:30", { perDay: 4, total: 120, answer: "120개" }],
  ["5:6:10:3:2:28", { perDay: 4, total: 112, answer: "112개" }]
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
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission4-kind="daily-rate-month-total"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 4 독립 검산 자료가 없습니다.");
  check(values.length === 9 && values.every(Number.isFinite), `Mission 4 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission4-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [unitN, unitD, workN, workD, month, days, perDayN, perDayD, total] = values;
  const perDay = rational(workN * unitD, workD * unitN);
  const candidates = Array.from({ length: 20 }, (_, index) => index + 1).filter(count => {
    const used = rational(unitN * count, unitD);
    return used.numerator === rational(workN, workD).numerator && used.denominator === rational(workN, workD).denominator;
  });
  check([2, 4, 6].includes(month) && days === ({ 2: 28, 4: 30, 6: 30 })[month], `달과 날 수가 맞지 않습니다: ${month}월 ${days}일`);
  check(perDay.denominator === 1 && perDay.numerator === perDayN && perDayD === 1, "하루 생산량의 독립 나눗셈 결과가 다릅니다.");
  check(candidates.length === 1 && candidates[0] === perDay.numerator, `하루 생산량 후보가 ${candidates.length}개입니다.`);
  check(perDay.numerator * days === total, "하루 생산량과 날 수로 다시 구한 한 달 생산량이 다릅니다.");
  return { perDay: perDay.numerator, total, candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 4 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "한 개 만드는 시간으로 한 달 동안 만든 수 구하기", "Mission 4 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "Mission 4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 21 && readiness.integrity.lockedCount === 45, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "90개" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 4 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission4-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission4-expression");
  const calculated = independentSolution(evidence.values);
  const expectedRow = expected.get(signature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "daily-rate-month-total" && evidence.contract === "single-whole-number" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(expectedRow?.perDay === calculated.perDay && expectedRow?.total === calculated.total && generated.answer === expectedRow?.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 생산량이 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 제작 일정 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-doll-production-facts/g) || []).length === 1 && (generated.prompt.match(/class="source62-doll-production-flow/g) || []).length === 1, `${difficulty}/${seed}: 제작 시간과 한 달 흐름 자료가 없습니다.`);
  check(!generated.prompt.includes("source62-doll-production-solution") && !generated.prompt.includes("source62-doll-production-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-doll-production-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답 자료판의 하루와 한 달 세 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 하루 생산량 후보 1개 · 달력 독립 검산`);
