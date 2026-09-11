"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-6";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission6";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const wrongSlot = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === "6-2-u1-e4-mission-6");
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const correctedLockedItem = readiness.items.find(item => item.sourceItemId === "6-2-u1-e4-mission-6");
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const correctedLockedLedgerItem = sourceLedger.items.find(item => item.sourceItemId === "6-2-u1-e4-mission-6");
const expected = new Map([
  ["27:2:27:32:275:9", { side: [27, 8], intervals: 4, treesPerSide: 5, treeCount: 25, answer: [11, 9], answerText: "1 2/9m" }],
  ["63:5:21:20:26:1", { side: [63, 20], intervals: 3, treesPerSide: 4, treeCount: 16, answer: [13, 8], answerText: "1 5/8m" }],
  ["22:1:11:10:42:1", { side: [11, 2], intervals: 5, treesPerSide: 6, treeCount: 36, answer: [7, 6], answerText: "1 1/6m" }]
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
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission6-kind="whole-square-lattice-to-closed-circle-spacing"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 6 독립 검산 자료가 없습니다.");
  check(values.length === 11 && values.every(Number.isFinite), `Mission 6 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission6-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [perimeterN, perimeterD, spacingN, spacingD, intervals, treesPerSide, treeCount, lakeN, lakeD, answerN, answerD] = values;
  const perimeter = rational(perimeterN, perimeterD);
  const spacing = rational(spacingN, spacingD);
  const side = divide(perimeter, rational(4));
  const intervalValue = divide(side, spacing);
  const candidates = Array.from({ length: 12 }, (_, index) => index + 1).filter(candidate => {
    const candidateSide = multiply(spacing, rational(candidate));
    return candidateSide.numerator === side.numerator && candidateSide.denominator === side.denominator;
  });
  const independentlyCountedTrees = (intervalValue.numerator + 1) ** 2;
  const answer = divide(rational(lakeN, lakeD), rational(independentlyCountedTrees));
  check(intervalValue.denominator === 1 && intervalValue.numerator === intervals, "한 변의 간격 수를 독립 계산한 값이 다릅니다.");
  check(treesPerSide === intervals + 1 && treeCount === treesPerSide ** 2 && treeCount === independentlyCountedTrees, "땅 전체의 격자 나무 수가 다릅니다.");
  check(candidates.length === 1 && candidates[0] === intervals, `한 변 간격 수 후보가 ${candidates.length}개입니다.`);
  check(answer.numerator === answerN && answer.denominator === answerD, "호숫가 나무 사이 간격을 독립 계산한 값이 다릅니다.");
  return { side, intervals, treesPerSide, treeCount, answer, candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 6 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "정사각형 땅 전체에 심은 나무 수로 호숫가의 간격 구하기", "Mission 6 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "Mission 6 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length && readiness.integrity.calculationCheckedCount === 63 && readiness.integrity.calculationNeedsClarificationCount === 3 && readiness.integrity.singleAnswerTrueCount === 61 && readiness.integrity.singleAnswerFalseCount === 5, "6-2 1단원 검토표 요약이 실제 교정 결과와 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "1 2/9m" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 6 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 6 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");
check(wrongSlot?.reviewLocked && wrongSlot?.typeLabel === "3일 동안 한 시간에 평균 몇 문제를 풀었는지 구하기", "개념탐구 4 Mission 6의 잘못 연결된 나무 유형이 교정되지 않았습니다.");
check(correctedLockedItem?.sourceVerified && correctedLockedItem?.answerCandidates?.[0] === "12문제" && correctedLockedItem?.candidateAnswerCount === 1 && correctedLockedItem?.calculationStatus === "checked-exhaustive" && correctedLockedItem?.releaseStatus === "locked", "개념탐구 4 Mission 6의 원문·답·잠금 상태가 다릅니다.");
check(correctedLockedLedgerItem?.sourceVerified && correctedLockedLedgerItem?.implementationStatus === "review-locked" && correctedLockedLedgerItem?.answerContract === "single-whole-number", "개념탐구 4 Mission 6 원자료 장부의 교정 상태가 다릅니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission6-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission6-expression");
  const row = expected.get(signature);
  const calculated = independentlyCalculate(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "whole-square-lattice-to-closed-circle-spacing" && evidence.contract === "single-fraction" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(row) && row.side[0] === calculated.side.numerator && row.side[1] === calculated.side.denominator && row.intervals === calculated.intervals && row.treesPerSide === calculated.treesPerSide && row.treeCount === calculated.treeCount && row.answer[0] === calculated.answer.numerator && row.answer[1] === calculated.answer.denominator && generated.answer === row.answerText, `${difficulty}/${seed}: 표시 답과 독립 계산한 나무 수·간격이 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 땅·호수 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-tree-marker source62-square-tree"/g) || []).length === 9 && !generated.prompt.includes("source62-lake-tree") && generated.prompt.includes("source62-lattice-continuation"), `${difficulty}/${seed}: 원문형 3×3 격자와 이어짐 표시가 없습니다.`);
  check((generated.answerVisual.match(/class="source62-tree-marker source62-square-tree"/g) || []).length === row.treeCount && (generated.answerVisual.match(/class="source62-tree-marker source62-lake-tree"/g) || []).length === row.treeCount, `${difficulty}/${seed}: 답 그림의 땅과 호숫가 나무 수가 다릅니다.`);
  check(!generated.prompt.includes("source62-tree-spacing-solution") && !generated.prompt.includes("source62-tree-spacing-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-tree-spacing-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 5, `${difficulty}/${seed}: 답 그림과 다섯 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 6 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 전체 격자 나무 수 전수 확인 · 답 후보 1개`);
