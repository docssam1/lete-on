"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-example-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Example2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expectedAnswers = new Map([
  ["12:5:1:4:5:6:5:3:4:5", "3/2"],
  ["10:3:3:10:9:10:3:4:1:2", "5/3"],
  ["21:8:2:7:5:6:5:4:9:14", "7/4"]
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
const rational = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-example2-kind="equal-results-blank-divisor"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 1-2 독립 검산 자료가 없습니다.");
  check(values.length === 14 && values.every(Number.isFinite), `예제 1-2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-example2-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentAnswer(values) {
  const left = rational(values[0], values[1]);
  const leftFactor = rational(values[2], values[3]);
  const rightFirst = rational(values[4], values[5]);
  const rightDivisor = rational(values[6], values[7]);
  const rightFactor = rational(values[8], values[9]);
  const rightResult = multiply(divide(rightFirst, rightDivisor), rightFactor);
  const answer = divide(multiply(left, leftFactor), rightResult);
  check(values.slice(10, 12).join(",") === [rightResult.numerator, rightResult.denominator].join(","), "독립 계산한 오른쪽 식과 생성 자료가 다릅니다.");
  check(values.slice(12, 14).join(",") === [answer.numerator, answer.denominator].join(","), "독립 계산한 빈칸과 생성 자료가 다릅니다.");
  return `${answer.numerator}/${answer.denominator}`;
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 1-2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 1-2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "3/2", "예제 1-2 비공개 검토표의 답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 1-2 원자료 장부의 원본 확인·단일 정답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const geometry = attr(generated.prompt, "data-source62-e1-example2-geometry");
  const answerGeometry = attr(generated.answerVisual, "data-source62-e1-example2-geometry");
  const expected = expectedAnswers.get(geometry);
  const calculated = independentAnswer(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "equal-results-blank-divisor" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expected) && generated.answer === expected && calculated === expected, `${difficulty}/${seed}: 표시 답·독립 계산·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e1-example2-structure") === "equal-result-blank-divisor" && attr(generated.prompt, "data-source62-e1-example2-structure") === attr(generated.answerVisual, "data-source62-e1-example2-structure") && geometry === answerGeometry, `${difficulty}/${seed}: 문제와 답의 두 식 자료가 다릅니다.`);
  check((generated.prompt.match(/class="math-fraction"/g) || []).length >= 5 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 8, `${difficulty}/${seed}: 세로 분수 표시가 부족합니다.`);
  check(!generated.prompt.includes("data-answer-source") && !generated.prompt.includes("is-solved"), `${difficulty}/${seed}: 문제에 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("is-solved"), `${difficulty}/${seed}: 답 화면의 원문 연결·완성 표시가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱근/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 1-2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 1-2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 3/2 · 두 식 독립 계산`);
