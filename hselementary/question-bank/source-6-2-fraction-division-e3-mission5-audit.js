"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-5";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission5";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["12:4", { product: 48, count: 10, pairs: "48:1|24:2|16:3|12:4|8:6|6:8|4:12|3:16|2:24|1:48", answer: "10개" }],
  ["18:5", { product: 90, count: 12, pairs: "90:1|45:2|30:3|18:5|15:6|10:9|9:10|6:15|5:18|3:30|2:45|1:90", answer: "12개" }],
  ["20:6", { product: 120, count: 16, pairs: "120:1|60:2|40:3|30:4|24:5|20:6|15:8|12:10|10:12|8:15|6:20|5:24|4:30|3:40|2:60|1:120", answer: "16개" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function enumerate(expression) {
  const [whole, denominator] = expression.split(":").map(Number);
  const product = whole * denominator;
  const fromSecond = [];
  for (let second = 1; second <= product; second += 1) if (product % second === 0) fromSecond.push([product / second, second]);
  const fromFirst = [];
  for (let first = 1; first <= product; first += 1) if (product % first === 0) fromFirst.push([first, product / first]);
  fromFirst.sort((left, right) => left[1] - right[1]);
  return {
    product,
    fromSecond,
    fromFirst,
    pairs: fromSecond.map(pair => pair.join(":")).join("|"),
    reversePairs: fromFirst.map(pair => pair.join(":")).join("|")
  };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 5 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 5 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure === "12÷(㉡/4)=㉠을 만족하는 자연수 순서쌍의 개수를 구합니다." && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "10개" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-count", "Mission 5 검토표의 원본 식·순서·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-count-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 5 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const expression = attr(generated.prompt, "data-source62-e3-mission5-expression");
  const calculated = enumerate(expression);
  const expectedItem = expected.get(expression);
  const answer = `${calculated.fromSecond.length}개`;
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(calculated.pairs === calculated.reversePairs && expectedItem?.product === calculated.product && expectedItem?.count === calculated.fromSecond.length && expectedItem?.pairs === calculated.pairs && expectedItem?.answer === answer && generated.answer === answer, `${difficulty}/${seed}: 양쪽 수를 기준으로 전수 계산한 순서쌍 목록이나 개수가 다릅니다.`);
  check(calculated.fromSecond.every(([first, second]) => first > 0 && second > 0 && first * second === calculated.product), `${difficulty}/${seed}: 자연수가 아니거나 식을 만족하지 않는 순서쌍이 있습니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission5-kind") === "natural-pair-count-from-fraction-division" && attr(generated.prompt, "data-result-contract") === "single-count" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission5-structure") === "natural-pair-count-from-fraction-division" && Number(attr(generated.prompt, "data-product")) === calculated.product && Number(attr(generated.prompt, "data-pair-count")) === calculated.fromSecond.length && attr(generated.prompt, "data-pairs") === calculated.pairs && !generated.prompt.includes("source62-natural-pair-board is-solved"), `${difficulty}/${seed}: 원문 식과 문제 순서쌍 자료가 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-mission5-expression") === expression && attr(generated.answerVisual, "data-pairs") === calculated.pairs && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-natural-pair-board is-solved") && (generated.answerVisual.match(/data-first=/g) || []).length === calculated.fromSecond.length && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답의 전체 순서쌍 목록과 세 확인 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 원문 밖 어려운 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 5 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 5 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 양쪽 자연수 기준 전수 나열 · 답 후보 1개`);
