"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["5:4:3:2", "157:30"],
  ["4:3:2:3", "103:24"],
  ["6:5:4:3", "421:68"]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

function reduce(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function calculateByExpansion(outer, middle, inner, tail) {
  const innerExpanded = inner * tail + 1;
  const middleExpanded = middle * innerExpanded + tail;
  return {
    inner: reduce(innerExpanded, tail),
    middle: reduce(middleExpanded, innerExpanded),
    outerFraction: reduce(innerExpanded, middleExpanded),
    result: reduce(outer * middleExpanded + innerExpanded, middleExpanded)
  };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 1 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 26 && readiness.integrity.lockedCount === 40, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "157/30" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-fraction", "Mission 1 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const signature = attr(generated.prompt, "data-expression");
  const values = signature.split(":").map(Number);
  const calculated = calculateByExpansion(...values);
  const answer = `${calculated.result.numerator}:${calculated.result.denominator}`;
  const answerSlash = `${calculated.result.numerator}/${calculated.result.denominator}`;
  const expectedAnswer = expected.get(signature);
  const answerSignature = attr(generated.prompt, "data-answer").replace("/", ":");
  const answerVisualSignature = attr(generated.answerVisual, "data-source62-e3-mission1-expression");
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(values.length === 4 && values.every(Number.isInteger) && expectedAnswer === answer && answerSignature === answer && generated.answer === answerSlash, `${difficulty}/${seed}: 전개식으로 따로 계산한 기약분수와 답이 다릅니다.`);
  check(calculated.inner.denominator > 0 && calculated.middle.denominator > 0 && calculated.outerFraction.denominator > 0, `${difficulty}/${seed}: 안쪽부터 계산한 중간 분수가 올바르지 않습니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission1-kind") === "three-level-nested-fraction" && attr(generated.prompt, "data-result-contract") === "single-fraction" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission1-structure") === "three-level-nested-fraction" && (generated.prompt.match(/class="source62-deep-fraction"/g) || []).length === 3 && !generated.prompt.includes("source62-deep-calculation-board is-solved"), `${difficulty}/${seed}: 문제의 세 겹 분수선 구조가 정확하지 않습니다.`);
  check(answerVisualSignature === signature && attr(generated.answerVisual, "data-answer-fraction") === answerSlash && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-deep-calculation-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답의 같은 식·네 단계 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 전개식 독립 계산 · 답 후보 1개`);
