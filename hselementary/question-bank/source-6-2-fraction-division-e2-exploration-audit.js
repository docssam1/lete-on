"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-exploration";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Exploration";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["9:1:3:4:1:4:8:4", "48/11"],
  ["12:1:4:6:1:3:9:6", "72/11"],
  ["15:2:5:5:1:3:10:5", "50/9"]
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
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => {
  if (!right.numerator) throw new Error("0으로 나눌 수 없습니다.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
};
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-exploration-kind="remaining-distance-average-speed"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "개념탐구 2 독립 검산 자료가 없습니다.");
  check(values.length === 18 && values.every(Number.isFinite), `개념탐구 2 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-exploration-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [totalNumber, firstN, firstD, firstSpeed, secondN, secondD, secondSpeed, lastSpeed] = values;
  const total = rational(totalNumber);
  const firstFraction = rational(firstN, firstD);
  const secondFraction = rational(secondN, secondD);
  check(firstFraction.numerator > 0 && firstFraction.numerator < firstFraction.denominator, "처음 이동 비율이 0보다 크고 1보다 작은 분수가 아닙니다.");
  check(secondFraction.numerator > 0 && secondFraction.numerator < secondFraction.denominator, "다음 이동 비율이 0보다 크고 1보다 작은 분수가 아닙니다.");
  const firstDistance = multiply(total, firstFraction);
  const afterFirst = subtract(total, firstDistance);
  const secondDistance = multiply(afterFirst, secondFraction);
  const lastDistance = subtract(afterFirst, secondDistance);
  const firstTime = divide(firstDistance, rational(firstSpeed));
  const secondTime = divide(secondDistance, rational(secondSpeed));
  const lastTime = divide(lastDistance, rational(lastSpeed));
  const totalTime = add(add(firstTime, secondTime), lastTime);
  const averageSpeed = divide(total, totalTime);
  const stored = values.slice(8).reduce((pairs, value, index, tail) => index % 2 ? pairs : [...pairs, rational(value, tail[index + 1])], []);
  const calculated = [firstDistance, secondDistance, lastDistance, totalTime, averageSpeed];
  check(stored.length === calculated.length && stored.every((value, index) => equal(value, calculated[index])), "생성 자료의 거리·전체 시간·평균 속력과 독립 계산값이 다릅니다.");
  check(equal(add(add(firstDistance, secondDistance), lastDistance), total), "세 구간의 거리 합이 전체 거리와 다릅니다.");
  check([firstTime, secondTime, lastTime, totalTime, averageSpeed].every(value => value.numerator > 0), "시간 또는 평균 속력이 양수가 아닙니다.");
  return { firstDistance, secondDistance, lastDistance, totalTime, averageSpeed };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "개념탐구 2 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "개념탐구 2 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 14 && readiness.integrity.lockedCount === 52, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "48/11km/시" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "개념탐구 2 비공개 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "개념탐구 2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-exploration-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-exploration-expression");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "remaining-distance-average-speed" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && print(calculated.averageSpeed) === expectedAnswer && generated.answer === expectedAnswer, `${difficulty}/${seed}: 표시 답·독립 평균 속력·고정 답이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e2-exploration-structure") === "remaining-distance-average-speed" && signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 세 이동 구간 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-average-speed-row"/g) || []).length === 3 && (generated.answerVisual.match(/class="source62-average-speed-row"/g) || []).length === 3, `${difficulty}/${seed}: 세 이동 구간 표시가 다릅니다.`);
  check(!generated.prompt.includes("data-answer-source") && !generated.prompt.includes("source62-average-speed-solution") && !generated.prompt.includes("<em>거리"), `${difficulty}/${seed}: 문제에 중간 거리나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-average-speed-solution") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 5, `${difficulty}/${seed}: 답 화면의 구간별 거리·시간 풀이표가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 개념탐구 2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 48/11 · 세 거리와 세 시간 독립 계산`);
