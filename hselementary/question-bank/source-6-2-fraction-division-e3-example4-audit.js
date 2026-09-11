"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-example-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Example4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([[7, "8:7"], [13, "14:13"], [19, "20:19"]]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const add = (left, right) => {
  const numerator = left.numerator * right.denominator + right.numerator * left.denominator;
  const denominator = left.denominator * right.denominator;
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

function directCalculation(limit) {
  let sum = { numerator: 0, denominator: 1 };
  for (let number = 1; number <= limit; number += 1) sum = add(sum, { numerator: 1, denominator: number * number + number });
  return { sum, reciprocal: { numerator: sum.denominator, denominator: sum.numerator } };
}

function independentCandidates(target) {
  return Array.from({ length: 60 }, (_, index) => index + 1).filter(limit => {
    const calculated = directCalculation(limit).reciprocal;
    return `${calculated.numerator}:${calculated.denominator}` === target;
  });
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "예제 3-4 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 3-4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 26 && readiness.integrity.lockedCount === 40, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "13" && readinessItem?.candidateAnswerCount === 1, "예제 3-4 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-whole-number-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 3-4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const limit = Number(attr(generated.prompt, "data-source62-e3-example4-limit"));
  const target = attr(generated.prompt, "data-target-fraction");
  const directSum = attr(generated.prompt, "data-direct-sum");
  const calculated = directCalculation(limit);
  const candidates = independentCandidates(target);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expected.get(limit) === target && directSum === `${limit}:${limit + 1}` && calculated.sum.numerator === limit && calculated.sum.denominator === limit + 1 && `${calculated.reciprocal.numerator}:${calculated.reciprocal.denominator}` === target, `${difficulty}/${seed}: 직접 분수 합과 역수 계산이 다릅니다.`);
  check(candidates.length === 1 && candidates[0] === limit && Number(generated.answer) === limit, `${difficulty}/${seed}: 자연수 후보 전수 검사 결과가 하나가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-example4-kind") === "reciprocal-of-telescoping-fraction-sum" && attr(generated.prompt, "data-result-contract") === "single-whole-number" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(generated.prompt.includes("source62-series-reciprocal") && generated.prompt.includes("㉠×㉠+㉠") && (generated.prompt.match(/class="math-fraction/g) || []).length >= 5 && !generated.prompt.includes("source62-telescoping-board is-solved"), `${difficulty}/${seed}: 원문 겹분수 식이 문제에 정확히 표시되지 않았습니다.`);
  check(attr(generated.answerVisual, "data-source62-e3-example4-limit") === String(limit) && attr(generated.answerVisual, "data-target-fraction") === target && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-telescoping-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 답의 같은 식·망원합 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|\bn\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 3-4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 3-4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 자연수 1~60 직접 합산 · 답 후보 1개`);
