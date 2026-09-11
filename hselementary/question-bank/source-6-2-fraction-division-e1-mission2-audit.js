"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-mission-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Mission2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expectedAnswers = new Map([
  ["8:5:1:10", "256"],
  ["3:2:1:6", "81"],
  ["9:4:1:12", "729"]
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
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new Error(`잘못된 분수 ${numerator}/${denominator}`);
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const divide = (left, right) => {
  if (right.numerator === 0) throw new Error("0으로 나눌 수 없습니다.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
};
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const text = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-mission2-kind="defined-operation-two-divisions"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 2 독립 검산 자료가 없습니다.");
  check(values.length === 10 && values.every(Number.isFinite), `Mission 2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-mission2-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const a = rational(values[0], values[1]);
  const b = rational(values[2], values[3]);
  const storedADivB = rational(values[4], values[5]);
  const storedBDivA = rational(values[6], values[7]);
  const storedAnswer = rational(values[8], values[9]);
  check(a.numerator > 0 && b.numerator > 0, "◆ 양쪽 수는 양수여야 합니다.");
  const aDivB = divide(a, b);
  const bDivA = divide(b, a);
  const answer = divide(aDivB, bDivA);
  check(equal(aDivB, storedADivB) && equal(bDivA, storedBDivA), "독립 계산한 가÷나 또는 나÷가가 생성 자료와 다릅니다.");
  check(equal(answer, storedAnswer), "독립 계산한 ◆의 값과 생성 자료가 다릅니다.");
  check(answer.denominator === 1 && answer.numerator > 0, "◆의 계산 결과가 양의 정수가 아닙니다.");
  check(equal(divide(divide(a, b), divide(b, a)), answer), "원래 ◆ 규칙에 다시 넣은 값이 답과 다릅니다.");
  return text(answer);
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 18 && readiness.integrity.lockedCount === 48, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "256", "Mission 2 비공개 검토표의 원본 답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const expression = attr(generated.prompt, "data-source62-e1-mission2-expression");
  const answerExpression = attr(generated.answerVisual, "data-source62-e1-mission2-expression");
  const expected = expectedAnswers.get(expression);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "defined-operation-two-divisions" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expected) && generated.answer === expected && calculated === expected, `${difficulty}/${seed}: 표시 답·독립 계산·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e1-mission2-structure") === "defined-operation-two-divisions" && expression === answerExpression, `${difficulty}/${seed}: 문제와 답의 ◆ 규칙 자료가 다릅니다.`);
  check((generated.prompt.match(/source62-defined-operation-board/g) || []).length === 1 && (generated.answerVisual.match(/source62-defined-operation-board/g) || []).length === 1, `${difficulty}/${seed}: 문제나 답의 ◆ 규칙판이 하나가 아닙니다.`);
  check(!generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-defined-operation-solution"), `${difficulty}/${seed}: 문제에 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-defined-operation-solution"), `${difficulty}/${seed}: 답 화면의 원문 연결·풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|제곱근/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 256 · ◆ 규칙 재대입`);
