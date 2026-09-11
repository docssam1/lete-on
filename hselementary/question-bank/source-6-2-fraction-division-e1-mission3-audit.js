"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e1-mission-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE1Mission3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expectedAnswers = new Map([
  ["3:5:7", "16/15"],
  ["4:3:6", "28/25"],
  ["5:4:8", "99/91"]
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
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e1-mission3-kind="fraction-expression-sequence-quotient"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 3 독립 검산 자료가 없습니다.");
  check(values.length === 9 && values.every(Number.isFinite), `Mission 3 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e1-mission3-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [startNumerator, firstTarget, secondTarget] = values;
  const storedFirst = rational(values[3], values[4]);
  const storedSecond = rational(values[5], values[6]);
  const storedAnswer = rational(values[7], values[8]);
  check(startNumerator >= 3 && firstTarget >= 1 && secondTarget > firstTarget, "수열 시작값이나 목표 위치가 잘못되었습니다.");
  const terms = [];
  for (let position = 1; position <= secondTarget; position += 1) {
    const numerator = startNumerator + position - 1;
    terms.push(divide(rational(numerator, numerator - 1), rational(numerator, numerator + 1)));
  }
  const first = terms[firstTarget - 1];
  const second = terms[secondTarget - 1];
  const answer = divide(first, second);
  check(equal(first, storedFirst) && equal(second, storedSecond), "직접 나열한 두 목표 식의 값이 생성 자료와 다릅니다.");
  check(equal(answer, storedAnswer), "직접 계산한 두 결과의 몫이 생성 자료와 다릅니다.");
  return text(answer);
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 24 && readiness.integrity.lockedCount === 42, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "16/15", "Mission 3 비공개 검토표의 원본 답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 3 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const sequence = attr(generated.prompt, "data-source62-e1-mission3-sequence");
  const answerSequence = attr(generated.answerVisual, "data-source62-e1-mission3-sequence");
  const expected = expectedAnswers.get(sequence);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "fraction-expression-sequence-quotient" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expected) && generated.answer === expected && calculated === expected, `${difficulty}/${seed}: 표시 답·직접 나열 계산·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e1-mission3-structure") === "same-numerator-neighbor-denominators" && sequence === answerSequence, `${difficulty}/${seed}: 문제와 답의 분수식 수열 자료가 다릅니다.`);
  check((generated.prompt.match(/source62-expression-sequence-term/g) || []).length === 3 && (generated.answerVisual.match(/source62-expression-sequence-term/g) || []).length === 3, `${difficulty}/${seed}: 문제나 답에 원본의 처음 세 식이 없습니다.`);
  check(!generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-expression-sequence-solution"), `${difficulty}/${seed}: 문제에 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-expression-sequence-solution"), `${difficulty}/${seed}: 답 화면의 원문 연결·풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 16/15 · 목표 위치까지 직접 나열`);
