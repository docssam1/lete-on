"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-example-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Example2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["3:14:316:349", { increase: 33, previousGirls: 154, currentGirls: 187, boys: 162, answer: "162명" }],
  ["3:11:284:317", { increase: 33, previousGirls: 121, currentGirls: 154, boys: 163, answer: "163명" }],
  ["5:16:392:432", { increase: 40, previousGirls: 128, currentGirls: 168, boys: 264, answer: "264명" }]
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
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-example2-kind="unchanged-boys-girls-fraction-increase"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 5-2 독립 검산 자료가 없습니다.");
  check(values.length === 8 && values.every(Number.isFinite), `예제 5-2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e5-example2-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [rateN, rateD, previousTotal, currentTotal, storedIncrease, storedPreviousGirls, storedCurrentGirls, storedBoys] = values;
  const increase = currentTotal - previousTotal;
  const candidates = Array.from({ length: previousTotal - 1 }, (_, index) => index + 1).filter(previousGirls => {
    const change = rational(previousGirls * rateN, rateD);
    return change.denominator === 1 && change.numerator === increase && previousTotal - previousGirls > 0;
  });
  const previousGirls = candidates[0];
  const boys = previousTotal - previousGirls;
  const currentGirls = previousGirls + increase;
  check(increase === storedIncrease, "전체 학생 수의 증가분이 다릅니다.");
  check(candidates.length === 1 && previousGirls === storedPreviousGirls, `작년 여학생 수 후보가 ${candidates.length}개입니다.`);
  check(currentGirls === storedCurrentGirls && boys === storedBoys, "여학생 수 또는 남학생 수를 다시 계산한 값이 다릅니다.");
  check(boys + currentGirls === currentTotal, "올해 남녀 학생 수의 합이 올해 전체와 다릅니다.");
  return { increase, previousGirls, currentGirls, boys };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 5-2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "학생 수의 분수 관계로 남학생 수 구하기", "예제 5-2 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "예제 5-2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 47 && readiness.integrity.lockedCount === 19 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "162명" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.candidateAnswerCount === 1, "예제 5-2 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 5-2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e5-example2-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e5-example2-expression");
  const calculated = independentlyCalculate(evidence.values);
  const expectedRow = expected.get(signature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "unchanged-boys-girls-fraction-increase" && evidence.contract === "single-whole-number" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(expectedRow?.increase === calculated.increase && expectedRow?.previousGirls === calculated.previousGirls && expectedRow?.currentGirls === calculated.currentGirls && expectedRow?.boys === calculated.boys && generated.answer === expectedRow?.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 학생 수가 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 작년·올해 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-student-change-years/g) || []).length === 1 && (generated.prompt.match(/class="source62-student-change-rows/g) || []).length === 1, `${difficulty}/${seed}: 전체 학생 수와 남녀 변화 비교표가 없습니다.`);
  check(!generated.prompt.includes("source62-student-change-solution") && !generated.prompt.includes("source62-student-change-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-student-change-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답 비교표와 네 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 5-2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 5-2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 작년 여학생 후보 1개 · 올해 남학생 수 역산`);
