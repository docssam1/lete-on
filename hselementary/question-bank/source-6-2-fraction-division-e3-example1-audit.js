"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-example-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Example1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["6:16", { product: 96, pairs: [[1, 96], [2, 48], [3, 32], [4, 24], [6, 16], [8, 12], [12, 8]] }],
  ["5:18", { product: 90, pairs: [[1, 90], [2, 45], [3, 30], [5, 18], [6, 15], [9, 10], [10, 9], [15, 6]] }],
  ["8:15", { product: 120, pairs: [[1, 120], [2, 60], [3, 40], [4, 30], [5, 24], [6, 20], [8, 15], [10, 12], [12, 10]] }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const pairSignature = pairs => pairs.map(pair => pair.join(":")).join("|");

function enumerate(whole, denominator) {
  const product = whole * denominator;
  return Array.from({ length: denominator - 1 }, (_, index) => index + 1)
    .filter(square => product % square === 0 && square !== product / square)
    .map(square => [square, product / square]);
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "예제 3-1 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "분수 나눗셈 조건을 만족하는 자연수 쌍 세기", "예제 3-1 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "예제 3-1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "7쌍" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "예제 3-1 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 3-1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const expression = attr(generated.prompt, "data-source62-e3-example1-expression");
  const answerExpression = attr(generated.answerVisual, "data-source62-e3-example1-expression");
  const values = attr(generated.prompt, "data-values").split(",").map(Number);
  const [whole, denominator, product, pairCount] = values;
  const pairs = enumerate(whole, denominator);
  const row = expected.get(expression);
  const expectedPairSignature = pairSignature(pairs);
  const evidencePairSignature = attr(generated.prompt, "data-pairs");
  const answerPairSignature = attr(generated.answerVisual, "data-pairs");
  const answerText = visibleText(generated.answerVisual);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-example1-kind") === "proper-fraction-natural-pair-count" && attr(generated.prompt, "data-result-contract") === "single-whole-number" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(row && row.product === product && pairSignature(row.pairs) === expectedPairSignature && pairCount === pairs.length && generated.answer === `${pairs.length}쌍`, `${difficulty}/${seed}: 표시 답과 독립 전수 열거가 다릅니다.`);
  check(expression === answerExpression && evidencePairSignature === expectedPairSignature && answerPairSignature === expectedPairSignature, `${difficulty}/${seed}: 문제와 답의 식 또는 순서쌍 자료가 다릅니다.`);
  check(pairs.every(([square, triangle]) => square < denominator && square !== triangle && whole / (square / denominator) === triangle), `${difficulty}/${seed}: 진분수·서로 다른 자연수 조건을 어긴 순서쌍이 있습니다.`);
  check((generated.prompt.match(/class="source62-natural-pair-board/g) || []).length === 1 && (generated.prompt.match(/class="math-fraction/g) || []).length >= 3, `${difficulty}/${seed}: 문제의 식·진분수 조건판이 없습니다.`);
  check(!generated.prompt.includes("source62-natural-pair-list") && !generated.prompt.includes("source62-natural-pair-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 순서쌍 목록이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-natural-pair-board is-solved") && (generated.answerVisual.match(/data-square=/g) || []).length === pairs.length && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3 && answerText.includes(`모두 ${pairs.length}쌍`), `${difficulty}/${seed}: 답의 전체 순서쌍 표와 세 확인 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 3-1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 3-1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 자연수 전수 대입 · 답 후보 1개`);
