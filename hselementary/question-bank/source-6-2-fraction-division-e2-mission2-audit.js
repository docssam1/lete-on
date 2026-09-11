"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["4:7:4:5:580:420", 380],
  ["3:5:3:4:690:510", 450],
  ["5:8:7:10:780:570", 480]
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
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission2-kind="two-weighings-after-drinking"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 2 독립 검산 자료가 없습니다.");
  check(values.length === 14 && values.every(Number.isFinite), `Mission 2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission2-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [fillN, fillD, drinkN, drinkD, firstWeight, secondWeight, diffN, diffD, waterN, waterD, remainingN, remainingD, emptyN, emptyD] = values;
  const drinkPart = rational(drinkN, drinkD);
  const remainingPart = subtract(rational(1), drinkPart);
  const difference = rational(firstWeight - secondWeight);
  const firstWater = divide(difference, drinkPart);
  const remainingWater = multiply(firstWater, remainingPart);
  const emptyBottle = subtract(rational(firstWeight), firstWater);
  const candidates = [];
  for (let bottleMass = 1; bottleMass < firstWeight; bottleMass += 1) {
    const waterMass = rational(firstWeight - bottleMass);
    if (equal(add(rational(bottleMass), multiply(waterMass, remainingPart)), rational(secondWeight))) candidates.push(bottleMass);
  }
  check(fillN > 0 && fillN < fillD, "병에 넣은 물의 비가 전체 들이보다 작아야 합니다.");
  check(drinkN > 0 && drinkN < drinkD, "마신 물의 비가 처음 넣은 물보다 작아야 합니다.");
  check(equal(difference, rational(diffN, diffD)) && equal(firstWater, rational(waterN, waterD)) && equal(remainingWater, rational(remainingN, remainingD)) && equal(emptyBottle, rational(emptyN, emptyD)), "저장된 무게와 독립 계산값이 다릅니다.");
  check(equal(add(emptyBottle, firstWater), rational(firstWeight)) && equal(add(emptyBottle, remainingWater), rational(secondWeight)), "두 번 잰 무게를 거꾸로 확인한 값이 다릅니다.");
  check(candidates.length === 1 && candidates[0] === emptyBottle.numerator && emptyBottle.denominator === 1, `빈 물병 무게 후보가 ${candidates.length}개입니다.`);
  return { emptyBottle };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "분수만큼 마신 뒤 남은 무게로 빈 병 무게 구하기", "Mission 2 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "Mission 2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 20 && readiness.integrity.lockedCount === 46, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "380g" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 2 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission2-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission2-expression");
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "two-weighings-after-drinking" && evidence.contract === "single-value" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 후보·난이도 계약이 다릅니다.`);
  check(expected.get(signature) === calculated.emptyBottle.numerator && generated.answer === `${calculated.emptyBottle.numerator}g`, `${difficulty}/${seed}: 표시 답과 독립 계산한 빈 물병 무게가 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 물병 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-bottle-state"/g) || []).length === 2 && (generated.prompt.match(/class="source62-bottle-water"/g) || []).length === 2, `${difficulty}/${seed}: 두 번의 물병 상태가 다릅니다.`);
  check(!generated.prompt.includes("source62-bottle-weight-solution") && !generated.prompt.includes("source62-bottle-weight-board is-solved"), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-bottle-weight-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답 그림의 두 물 무게와 세 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 빈 물병 무게 후보 1개 · 두 무게 역산 확인`);
