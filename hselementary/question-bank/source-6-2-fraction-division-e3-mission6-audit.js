"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-6";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission6";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2", { pairs: "4:2|6:3|8:2|8:4", products: "8:18:16:32", sum: 74 }],
  ["3", { pairs: "6:2|9:3", products: "12:27", sum: 39 }],
  ["8", { pairs: "8:2", products: "16", sum: 16 }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const reduce = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

function enumerate(factorDenominator) {
  const direct = [];
  const fractionCalculation = [];
  for (let first = 2; first <= 9; first += 1) for (let second = 2; second <= 9; second += 1) {
    const directNumerator = first * first;
    const directDenominator = factorDenominator * second * second;
    if (directNumerator % directDenominator === 0) direct.push([first, second]);
    const left = reduce(first, second);
    const right = reduce(second, first);
    const afterDivision = reduce(left.numerator * right.denominator, left.denominator * right.numerator);
    const result = reduce(afterDivision.numerator, afterDivision.denominator * factorDenominator);
    if (result.denominator === 1) fractionCalculation.push([first, second]);
  }
  const signature = pairs => pairs.map(pair => pair.join(":")).join("|");
  const products = direct.map(([first, second]) => first * second);
  return { direct, fractionCalculation, pairs: signature(direct), checkedAgain: signature(fractionCalculation), products, sum: products.reduce((sum, value) => sum + value, 0) };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 6 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 6 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("(㉠/㉡)÷(㉡/㉠)×1/2") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "74" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-sum", "Mission 6 검토표의 원본 식·범위·곱의 합·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-sum-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 6 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const expression = attr(generated.prompt, "data-source62-e3-mission6-expression");
  const calculated = enumerate(Number(expression));
  const expectedItem = expected.get(expression);
  const products = calculated.products.join(":");
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(calculated.pairs === calculated.checkedAgain && expectedItem?.pairs === calculated.pairs && expectedItem?.products === products && expectedItem?.sum === calculated.sum && generated.answer === String(calculated.sum), `${difficulty}/${seed}: 64가지 직접 대입과 분수 계산으로 다시 확인한 순서쌍 또는 곱의 합이 다릅니다.`);
  check(calculated.direct.length > 0 && calculated.direct.every(([first, second]) => first >= 2 && first <= 9 && second >= 2 && second <= 9), `${difficulty}/${seed}: 한 자리 수 범위를 벗어난 순서쌍이 있습니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission6-kind") === "one-digit-fraction-expression-product-sum" && attr(generated.prompt, "data-result-contract") === "single-sum" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission6-structure") === "one-digit-fraction-expression-product-sum" && Number(attr(generated.prompt, "data-checked-pair-count")) === 64 && Number(attr(generated.prompt, "data-pair-count")) === calculated.direct.length && attr(generated.prompt, "data-pairs") === calculated.pairs && attr(generated.prompt, "data-products") === products && Number(attr(generated.prompt, "data-answer-sum")) === calculated.sum && !generated.prompt.includes("source62-natural-pair-board is-solved"), `${difficulty}/${seed}: 원문 식과 문제의 64가지 순서쌍 자료가 정확하지 않습니다.`);
  check((generated.prompt.match(/class="math-inline-expression"/g) || []).length === 2 && (generated.answerVisual.match(/class="math-inline-expression"/g) || []).length === 1, `${difficulty}/${seed}: 세 분수로 된 식이 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-mission6-expression") === expression && attr(generated.answerVisual, "data-pairs") === calculated.pairs && attr(generated.answerVisual, "data-products") === products && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-natural-pair-board is-solved") && (generated.answerVisual.match(/data-product=/g) || []).length === calculated.direct.length && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답의 조건에 맞는 순서쌍·각 곱·합이 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 원문 밖 어려운 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 6 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 6 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 순서쌍 64가지 직접 대입과 분수 계산 교차 검산 · 답 후보 1개`);
