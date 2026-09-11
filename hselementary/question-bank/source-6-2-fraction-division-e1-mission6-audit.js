"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-mission-6";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Mission6";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["10:9:106:9:25:9:2:5", "26500/729"],
  ["3:2:13:2:4:1:3:8", "39"],
  ["8:5:28:5:14:5:4:7", "3136/125"]
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
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => {
  if (!right.numerator) throw new Error("0으로 나눌 수 없습니다.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
};
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-mission6-kind="difference-ratio-sum-three-values"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 6 독립 검산 자료가 없습니다.");
  check(values.length === 14 && values.every(Number.isFinite), `Mission 6 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-mission6-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [aN, aD, bN, bD, cN, cD, multiplier, ratioResult, differenceN, differenceD, sumN, sumD, answerN, answerD] = values;
  const storedA = rational(aN, aD);
  const storedB = rational(bN, bD);
  const storedC = rational(cN, cD);
  const difference = rational(differenceN, differenceD);
  const sum = rational(sumN, sumD);
  const ratio = rational(ratioResult, multiplier);
  const ratioMinusOne = subtract(ratio, rational(1));
  check(ratioMinusOne.numerator !== 0, "비 조건의 계수가 1이라 차 조건과 함께 세 수를 하나로 정할 수 없습니다.");
  const a = divide(difference, ratioMinusOne);
  const c = multiply(ratio, a);
  const b = subtract(subtract(sum, a), c);
  const product = multiply(multiply(a, b), c);
  const storedProduct = rational(answerN, answerD);
  check([a, b, c].every(value => value.numerator > 0), "독립 계산한 세 수가 모두 양수가 아닙니다.");
  check(equal(storedA, a) && equal(storedB, b) && equal(storedC, c), "생성 자료의 세 수와 조건에서 독립적으로 구한 세 수가 다릅니다.");
  check(equal(subtract(c, a), difference), "차 조건을 다시 넣었을 때 성립하지 않습니다.");
  check(equal(divide(multiply(rational(multiplier), c), a), rational(ratioResult)), "비 조건을 다시 넣었을 때 성립하지 않습니다.");
  check(equal(add(add(a, b), c), sum), "합 조건을 다시 넣었을 때 성립하지 않습니다.");
  check(equal(product, storedProduct), "독립 계산한 곱과 생성 자료의 곱이 다릅니다.");
  return { a, b, c, product };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 6 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 6 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 25 && readiness.integrity.lockedCount === 41, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "26500/729" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 6 비공개 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 6 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e1-mission6-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e1-mission6-expression");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "difference-ratio-sum-three-values" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && print(calculated.product) === expectedAnswer && generated.answer === expectedAnswer, `${difficulty}/${seed}: 표시 답·독립 연립 계산·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e1-mission6-structure") === "difference-ratio-sum-three-values" && signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 세 식 자료가 다릅니다.`);
  check((generated.prompt.match(/source62-three-value-equation/g) || []).length === 4 && (generated.answerVisual.match(/source62-three-value-equation/g) || []).length === 4, `${difficulty}/${seed}: 세 조건식 표시가 다릅니다.`);
  check(!visibleText(generated.prompt).includes(`㉠=${print(calculated.a)}`) && !generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-three-value-solution"), `${difficulty}/${seed}: 문제에 세 수나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-three-value-solution") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답 화면의 원문 연결·세 수 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|연립방정식/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 6 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 26500/729 · 차·비·합 독립 풀이와 세 식 재대입`);
