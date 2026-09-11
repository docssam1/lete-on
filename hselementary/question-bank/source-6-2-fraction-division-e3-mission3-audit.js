"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2:3:4:5:7", { order: "5:3:4:2:7", answer: "20 1/8" }],
  ["2:4:5:7:9", { order: "7:4:5:2:9", answer: "35 1/10" }],
  ["2:3:5:8:9", { order: "8:3:5:2:9", answer: "38 7/10" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

function permutations(values) {
  if (values.length === 1) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, itemIndex) => itemIndex !== index)).map(rest => [value, ...rest]));
}

function mixed(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  const whole = Math.floor(reducedNumerator / reducedDenominator);
  const remainder = reducedNumerator % reducedDenominator;
  return remainder ? `${whole} ${remainder}/${reducedDenominator}` : String(whole);
}

function enumerate(cards) {
  const arrangements = permutations(cards).filter(order => order[1] < order[2] && order[3] < order[4]).map(order => {
    const numerator = (order[0] * order[2] + order[1]) * order[4];
    const denominator = order[2] * order[3];
    return { order, numerator, denominator, answer: mixed(numerator, denominator) };
  }).sort((left, right) => right.numerator * left.denominator - left.numerator * right.denominator);
  const maximum = arrangements[0];
  const winners = arrangements.filter(item => item.numerator * maximum.denominator === maximum.numerator * item.denominator);
  return { arrangements, maximum, winners };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "20 1/8" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-mixed-number", "Mission 3 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-mixed-number-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 3 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const cardsSignature = attr(generated.prompt, "data-cards");
  const expectedItem = expected.get(cardsSignature);
  const calculated = enumerate(cardsSignature.split(":").map(Number));
  const bestOrder = calculated.maximum.order.join(":");
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(calculated.arrangements.length === 30 && calculated.winners.length === 1 && expectedItem?.order === bestOrder && expectedItem?.answer === calculated.maximum.answer && attr(generated.prompt, "data-best-order") === bestOrder && generated.answer === calculated.maximum.answer, `${difficulty}/${seed}: 120개 카드 배치 중 조건에 맞는 30개 전수 비교 결과가 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission3-kind") === "five-cards-largest-mixed-proper-quotient" && attr(generated.prompt, "data-result-contract") === "single-mixed-number" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && Number(attr(generated.prompt, "data-valid-arrangements")) === 30 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission3-structure") === "five-cards-largest-mixed-proper-quotient" && (generated.prompt.match(/source41-number-card/g) || []).length === 5 && (generated.prompt.match(/class="math-fraction/g) || []).length === 2 && !generated.prompt.includes("source62-mixed-card-board is-solved"), `${difficulty}/${seed}: 카드 다섯 장과 대분수÷진분수 틀이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-mission3-cards") === cardsSignature && attr(generated.answerVisual, "data-best-order") === bestOrder && attr(generated.answerVisual, "data-answer-fraction") === calculated.maximum.answer && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-mixed-card-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답의 같은 카드·최댓값 배치·네 단계 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 카드 120배치 중 올바른 30개 전수 비교 · 최댓값 후보 1개`);
