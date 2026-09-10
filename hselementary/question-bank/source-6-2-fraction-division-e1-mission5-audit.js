"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-mission-5";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Mission5";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["44:4:5:10:2:24:1:3", { candidates: "12,13,14", sum: 39 }],
  ["24:2:3:12:3:26:1:2", { candidates: "10,11,12", sum: 33 }],
  ["30:1:2:18:3:21:1:4", { candidates: "11,12,13", sum: 36 }]
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
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const divide = (left, right) => {
  if (right.numerator === 0) throw new Error("0으로 나눌 수 없습니다.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
};
const lessThan = (left, right) => left.numerator * right.denominator < right.numerator * left.denominator;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-mission5-kind="fraction-division-natural-number-range"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 5 독립 검산 자료가 없습니다.");
  check(values.length === 8 && values.every(Number.isFinite), `Mission 5 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-mission5-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    candidates: attr(markup, "data-candidates"),
    sum: Number(attr(markup, "data-sum")),
    values
  };
}

function independentSolution(values) {
  const [leftDividend, leftNumerator, leftDenominator, middleDividend, middleNumerator, rightDividend, rightNumerator, rightDenominator] = values;
  const left = divide(rational(leftDividend), rational(leftNumerator, leftDenominator));
  const right = divide(rational(rightDividend), rational(rightNumerator, rightDenominator));
  const candidates = [];
  for (let number = 1; number <= 100; number += 1) {
    const middle = divide(rational(middleDividend), rational(middleNumerator, number));
    if (lessThan(left, middle) && lessThan(middle, right)) candidates.push(number);
  }
  const sum = candidates.reduce((total, number) => total + number, 0);
  for (const number of candidates) {
    const middle = divide(rational(middleDividend), rational(middleNumerator, number));
    check(lessThan(left, middle) && lessThan(middle, right), `${number}: 원래 부등식에 대입하면 성립하지 않습니다.`);
  }
  return { candidates: candidates.join(","), sum };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 5 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 5 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 11 && readiness.integrity.lockedCount === 55, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "39" && readinessItem?.calculationStatus === "checked-exhaustive", "Mission 5 비공개 검토표의 원본 답·전수 확인 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 5 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e1-mission5-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e1-mission5-expression");
  const expectedResult = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "fraction-division-natural-number-range" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expectedResult) && evidence.candidates === expectedResult.candidates && calculated.candidates === expectedResult.candidates && evidence.sum === expectedResult.sum && calculated.sum === expectedResult.sum && generated.answer === String(expectedResult.sum), `${difficulty}/${seed}: 표시 답·전수 나열·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e1-mission5-structure") === "fraction-division-natural-number-range" && signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 세 나눗셈식 자료가 다릅니다.`);
  check((generated.prompt.match(/source62-range-blank-fraction/g) || []).length === 1 && (generated.answerVisual.match(/source62-range-blank-fraction/g) || []).length === 1, `${difficulty}/${seed}: □가 분모인 분수 표시가 다릅니다.`);
  check(!visibleText(generated.prompt).includes(expectedResult?.candidates || "없음") && !generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-natural-range-solution"), `${difficulty}/${seed}: 문제에 가능한 수나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-natural-range-solution") && visibleText(generated.answerVisual).includes("가능한 수"), `${difficulty}/${seed}: 답 화면의 원문 연결·전수 나열이 없습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 5 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 39 · 자연수 1~100 전수 대입`);
