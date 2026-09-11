"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-example-4";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Example4";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["6:15:1:4", { time: "15/2", minutes: 450, answer: "7시간 30분" }],
  ["8:24:1:3", { time: "8", minutes: 480, answer: "8시간" }],
  ["10:15:2:5", { time: "18", minutes: 1080, answer: "18시간" }]
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
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-example4-kind="simultaneous-fill-and-drain"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 2-4 독립 검산 자료가 없습니다.");
  check(values.length === 15 && values.every(Number.isFinite), `예제 2-4 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-example4-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [fillHours, drainHours, initialN, initialD, fillN, fillD, drainN, drainD, netN, netD, neededN, neededD, elapsedN, elapsedD, storedMinutes] = values;
  const initial = rational(initialN, initialD);
  const fillRate = rational(1, fillHours);
  const drainRate = rational(1, drainHours);
  const netRate = subtract(fillRate, drainRate);
  const needed = subtract(rational(1), initial);
  const elapsed = divide(needed, netRate);
  const candidates = Array.from({ length: elapsed.numerator * 2 }, (_, index) => rational(index + 1, elapsed.denominator)).filter(time => equal(add(initial, multiply(netRate, time)), rational(1)));
  const minutes = elapsed.numerator * 60 / elapsed.denominator;
  check(netRate.numerator > 0 && needed.numerator > 0, "채우는 양이 빠지는 양보다 많고 처음 물이 가득 차지 않아야 합니다.");
  check(equal(fillRate, rational(fillN, fillD)) && equal(drainRate, rational(drainN, drainD)) && equal(netRate, rational(netN, netD)) && equal(needed, rational(neededN, neededD)) && equal(elapsed, rational(elapsedN, elapsedD)) && minutes === storedMinutes, "저장된 속도·남은 양·시간과 독립 계산값이 다릅니다.");
  check(equal(add(initial, multiply(netRate, elapsed)), rational(1)), "구한 시간을 원래 물의 양에 넣었을 때 가득 차지 않습니다.");
  check(candidates.length === 1 && equal(candidates[0], elapsed), `가득 차는 시간 후보가 ${candidates.length}개입니다.`);
  return { elapsed, minutes, candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 2-4 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 2-4 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 20 && readiness.integrity.lockedCount === 46, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "7시간 30분" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "예제 2-4 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 2-4 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-example4-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-example4-expression");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "simultaneous-fill-and-drain" && evidence.contract === "single-value" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 후보·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && print(calculated.elapsed) === expectedAnswer.time && calculated.minutes === expectedAnswer.minutes && generated.answer === expectedAnswer.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 시간이 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 물탱크 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-tank-state/g) || []).length === 2 && (generated.prompt.match(/class="source62-tank-rates"/g) || []).length === 1 && (generated.prompt.match(/<b>\?<\/b>/g) || []).length === 1, `${difficulty}/${seed}: 처음 물탱크·두 속도·가득 찰 시간 물음이 다릅니다.`);
  check(!generated.prompt.includes("source62-tank-rate-solution") && !generated.prompt.includes("source62-tank-rate-board is-solved"), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-tank-rate-board is-solved") && generated.answerVisual.includes("source62-tank-water is-full") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 5, `${difficulty}/${seed}: 답 그림의 가득 찬 물탱크와 다섯 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 2-4 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 2-4 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 가득 차는 시간 후보 1개 · 원래 양 역대입`);
