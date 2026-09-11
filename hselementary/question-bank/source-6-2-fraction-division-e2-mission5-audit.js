"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-5";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission5";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2:25:584:562", { decrease: 22, previousBoys: 275, currentBoys: 253, girls: 309, answer: "253명" }],
  ["3:40:720:696", { decrease: 24, previousBoys: 320, currentBoys: 296, girls: 400, answer: "296명" }],
  ["1:18:645:627", { decrease: 18, previousBoys: 324, currentBoys: 306, girls: 321, answer: "306명" }]
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
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission5-kind="unchanged-girls-boys-fraction-decrease"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 5 독립 검산 자료가 없습니다.");
  check(values.length === 8 && values.every(Number.isFinite), `Mission 5 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission5-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [rateN, rateD, previousTotal, currentTotal, totalDecrease, previousBoys, currentBoys, girls] = values;
  const calculatedDecrease = previousTotal - currentTotal;
  const candidates = Array.from({ length: previousTotal - 1 }, (_, index) => index + 1).filter(candidate => {
    const change = rational(candidate * rateN, rateD);
    return change.denominator === 1 && change.numerator === calculatedDecrease && candidate - change.numerator > 0;
  });
  check(calculatedDecrease === totalDecrease, "전체 학생 수의 감소분이 다릅니다.");
  check(candidates.length === 1 && candidates[0] === previousBoys, `작년 남학생 수 후보가 ${candidates.length}개입니다.`);
  check(previousBoys - totalDecrease === currentBoys, "올해 남학생 수를 다시 계산한 값이 다릅니다.");
  check(previousTotal - previousBoys === girls && currentTotal - currentBoys === girls, "작년과 올해 여학생 수가 같지 않습니다.");
  return { totalDecrease, previousBoys, currentBoys, girls };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 5 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "줄어든 전체 학생 수로 올해 남학생 수 구하기", "Mission 5 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "Mission 5 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 23 && readiness.integrity.lockedCount === 43, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "253명" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 5 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 5 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission5-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission5-expression");
  const calculated = independentSolution(evidence.values);
  const expectedRow = expected.get(signature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "unchanged-girls-boys-fraction-decrease" && evidence.contract === "single-whole-number" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(expectedRow?.decrease === calculated.totalDecrease && expectedRow?.previousBoys === calculated.previousBoys && expectedRow?.currentBoys === calculated.currentBoys && expectedRow?.girls === calculated.girls && generated.answer === expectedRow?.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 학생 수가 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 작년·올해 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-student-change-years/g) || []).length === 1 && (generated.prompt.match(/class="source62-student-change-rows/g) || []).length === 1, `${difficulty}/${seed}: 전체 학생 수와 남녀 변화 비교표가 없습니다.`);
  check(!generated.prompt.includes("source62-student-change-solution") && !generated.prompt.includes("source62-student-change-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-student-change-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답 비교표와 세 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 5 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 작년 남학생 후보 1개 · 여학생 수 역산`);
