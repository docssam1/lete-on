"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e3-example-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE3Example2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["9:8|27:32|9:20", { denominator: 160, numerators: "180:135:72", answer: "9/160", quotients: "20:15:8" }],
  ["11:8|7:8|5:8", { denominator: 8, numerators: "11:7:5", answer: "1/8", quotients: "11:7:5" }],
  ["7:5|14:15|7:10", { denominator: 30, numerators: "42:28:21", answer: "7/30", quotients: "6:4:3" }]
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

function independent(valuesSignature) {
  const values = valuesSignature.split("|").map(value => value.split(":").map(Number));
  const denominator = values.reduce((total, value) => lcm(total, value[1]), 1);
  const numerators = values.map(value => value[0] * denominator / value[1]);
  const greatest = numerators.reduce((total, value) => gcd(total, value));
  const divisor = gcd(greatest, denominator);
  const answer = `${greatest / divisor}/${denominator / divisor}`;
  const quotients = numerators.map(value => value / greatest);
  const candidates = Array.from({ length: Math.max(...numerators) }, (_, index) => index + 1).filter(candidate => numerators.every(value => value % candidate === 0));
  return { denominator, numerators, greatest, answer, quotients, maximumCandidates: candidates.filter(candidate => !candidates.some(other => other > candidate)) };
}

check(type?.generatorKey === generatorKey && !type.reviewLocked, "예제 3-2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 3-2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 23 && readiness.integrity.lockedCount === 43, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "9/160" && readinessItem?.candidateAnswerCount === 1, "예제 3-2 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-fraction-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 3-2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const signature = attr(generated.prompt, "data-source62-e3-example2-values");
  const answerSignature = attr(generated.answerVisual, "data-source62-e3-example2-values");
  const row = expected.get(signature);
  const calculated = independent(signature);
  const evidenceAnswer = attr(generated.prompt, "data-answer");
  const quotientMatches = [...String(generated.answerVisual).matchAll(/data-quotient-index="\d+">.*?=(\d+)<\/span>/g)].map(match => Number(match[1]));
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e3-example2-kind") === "largest-common-fraction-divisor" && attr(generated.prompt, "data-result-contract") === "single-fraction" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(row && row.denominator === calculated.denominator && row.numerators === calculated.numerators.join(":") && row.answer === calculated.answer && row.quotients === calculated.quotients.join(":") && generated.answer === calculated.answer && evidenceAnswer === calculated.answer && calculated.maximumCandidates.length === 1 && calculated.maximumCandidates[0] === calculated.greatest, `${difficulty}/${seed}: 표시 답과 독립 최대공약수 계산이 다릅니다.`);
  check(signature === answerSignature && attr(generated.prompt, "data-common-numerators") === calculated.numerators.join(":") && quotientMatches.join(":") === calculated.quotients.join(":"), `${difficulty}/${seed}: 문제와 답의 세 분수 또는 자연수 몫이 다릅니다.`);
  check((generated.prompt.match(/class="source62-common-fraction-board/g) || []).length === 1 && (generated.prompt.match(/class="source62-common-fraction-values/g) || []).length === 1 && (generated.prompt.match(/class="math-fraction/g) || []).length >= 6, `${difficulty}/${seed}: 문제의 세 분수와 목표 조건판이 없습니다.`);
  check(!generated.prompt.includes("source62-common-fraction-quotients") && !generated.prompt.includes("source62-common-fraction-board is-solved") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 자연수 몫이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-common-fraction-board is-solved") && (generated.answerVisual.match(/data-quotient-index=/g) || []).length === 3 && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답의 같은 분모와 세 자연수 몫이 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 3-2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 3-2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 공통분모와 최대공약수 독립 계산 · 답 후보 1개`);
