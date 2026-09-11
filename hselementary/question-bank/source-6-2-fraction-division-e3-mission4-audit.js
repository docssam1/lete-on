"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["27:14:18:7", { answer: "54/7", quotients: "4:3", matches: 30 }],
  ["11:6:11:4", { answer: "11/2", quotients: "3:2", matches: 40 }],
  ["13:8:39:20", { answer: "39/4", quotients: "6:5", matches: 20 }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

function reduce(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function enumerate(values) {
  const first = reduce(values[0], values[1]);
  const second = reduce(values[2], values[3]);
  const matches = [];
  for (let firstQuotient = 1; firstQuotient <= 120; firstQuotient += 1) for (let secondQuotient = 1; secondQuotient <= 120; secondQuotient += 1) {
    const left = reduce(first.numerator * firstQuotient, first.denominator);
    const right = reduce(second.numerator * secondQuotient, second.denominator);
    if (left.numerator === right.numerator && left.denominator === right.denominator) matches.push({ value: left, firstQuotient, secondQuotient });
  }
  matches.sort((left, right) => left.value.numerator * right.value.denominator - right.value.numerator * left.value.denominator);
  const minimum = matches[0];
  const winners = matches.filter(item => item.value.numerator * minimum.value.denominator === minimum.value.numerator * item.value.denominator);
  const formula = reduce(lcm(first.numerator, second.numerator), gcd(first.denominator, second.denominator));
  return { matches, minimum, winners, formula };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 4 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("2 4/7") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "54/7" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-fraction", "Mission 4 검토표의 둘째 대분수·원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const signature = attr(generated.prompt, "data-source62-e3-mission4-values");
  const values = signature.split(":").map(Number);
  const calculated = enumerate(values);
  const expectedItem = expected.get(signature);
  const answer = `${calculated.minimum.value.numerator}/${calculated.minimum.value.denominator}`;
  const quotients = `${calculated.minimum.firstQuotient}:${calculated.minimum.secondQuotient}`;
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(calculated.winners.length === 1 && calculated.minimum.value.numerator === calculated.formula.numerator && calculated.minimum.value.denominator === calculated.formula.denominator && expectedItem?.answer === answer && expectedItem?.quotients === quotients && expectedItem?.matches === calculated.matches.length && generated.answer === answer, `${difficulty}/${seed}: 자연수 몫 1부터 120까지 전수 비교한 가장 작은 공통 분수가 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission4-kind") === "least-fraction-with-natural-quotients" && attr(generated.prompt, "data-result-contract") === "single-fraction" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && Number(attr(generated.prompt, "data-matching-multiple-count")) === calculated.matches.length && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission4-structure") === "least-fraction-with-natural-quotients" && attr(generated.prompt, "data-answer-fraction") === answer && `${attr(generated.prompt, "data-first-quotient")}:${attr(generated.prompt, "data-second-quotient")}` === quotients && (generated.prompt.match(/source61-math-row/g) || []).length === 2 && !generated.prompt.includes("source62-common-fraction-board is-solved"), `${difficulty}/${seed}: 원문 두 대분수와 자연수 몫 조건판이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-mission4-values") === signature && attr(generated.answerVisual, "data-answer-fraction") === answer && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-common-fraction-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답의 같은 두 대분수·두 자연수 몫·가장 작은 분수가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|최소공배수|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 원문 밖 어려운 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 자연수 몫 1~120 전수 비교 · 답 후보 1개`);
