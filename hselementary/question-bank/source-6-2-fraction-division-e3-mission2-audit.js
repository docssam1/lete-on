"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-mission-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Mission2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["2:17:15", "111:64"],
  ["3:19:17", "224:81"],
  ["2:23:19", "177:100"]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

function calculateIndependently(outer, denominator, last) {
  const terms = Array.from({ length: (last + 1) / 2 }, (_, index) => index * 2 + 1);
  const loopSum = terms.reduce((sum, value) => sum + value, 0);
  const squareSum = terms.length * terms.length;
  const numerator = outer * loopSum - denominator;
  const divisor = gcd(numerator, loopSum);
  return { terms, loopSum, squareSum, numerator: numerator / divisor, denominator: loopSum / divisor };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "Mission 2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "111/64" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-fraction", "Mission 2 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const signature = attr(generated.prompt, "data-expression");
  const [outer, denominator, last] = signature.split(":").map(Number);
  const values = attr(generated.prompt, "data-values").split(",").map(Number);
  const calculated = calculateIndependently(outer, denominator, last);
  const answer = `${calculated.numerator}:${calculated.denominator}`;
  const answerSlash = `${calculated.numerator}/${calculated.denominator}`;
  const expectedAnswer = expected.get(signature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(calculated.loopSum === calculated.squareSum && values.slice(0, 5).join(":") === `${outer}:${denominator}:${last}:${calculated.terms.length}:${calculated.loopSum}` && expectedAnswer === answer && attr(generated.prompt, "data-answer").replace("/", ":") === answer && generated.answer === answerSlash, `${difficulty}/${seed}: 홀수 전수 합과 한 번에 전개한 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-mission2-kind") === "reciprocal-of-odd-fraction-sum" && attr(generated.prompt, "data-result-contract") === "single-fraction" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e3-mission2-structure") === "reciprocal-of-odd-fraction-sum" && Number(attr(generated.prompt, "data-term-count")) === calculated.terms.length && Number(attr(generated.prompt, "data-odd-sum")) === calculated.loopSum && (generated.prompt.match(/class="math-fraction/g) || []).length === 4 && generated.prompt.includes("source62-odd-sum-dots") && !generated.prompt.includes("source62-odd-sum-board is-solved"), `${difficulty}/${seed}: 원문 겹분수와 줄임표 구조가 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-mission2-expression") === signature && attr(generated.answerVisual, "data-answer-fraction") === answerSlash && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-odd-sum-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답의 같은 식·네 단계 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 3 Mission 2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 3 Mission 2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 홀수 전수 합과 제곱합 교차 검산 · 답 후보 1개`);
