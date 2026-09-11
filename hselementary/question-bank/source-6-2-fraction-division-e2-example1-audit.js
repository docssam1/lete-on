"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-example-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Example1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["85:6:12:1:136:3", "28/5cm"],
  ["25:2:11:1:75:2", "5cm"],
  ["44:3:13:1:44:1", "7cm"]
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
const divide = (left, right) => {
  if (!right.numerator) throw new Error("0으로 나눌 수 없습니다.");
  return rational(left.numerator * right.denominator, left.denominator * right.numerator);
};
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-example1-kind="rectangle-triangle-area-segment"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 2-1 독립 검산 자료가 없습니다.");
  check(values.length === 10 && values.every(Number.isFinite), `예제 2-1 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-example1-kind"),
    contract: attr(markup, "data-result-contract"),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const width = rational(values[0], values[1]);
  const totalHeight = rational(values[2], values[3]);
  const triangleArea = rational(values[4], values[5]);
  const storedTriangleHeight = rational(values[6], values[7]);
  const storedTarget = rational(values[8], values[9]);
  const triangleHeight = divide(multiply(triangleArea, rational(2)), width);
  const target = subtract(totalHeight, triangleHeight);
  const restoredArea = divide(multiply(width, triangleHeight), rational(2));
  check(width.numerator > 0 && totalHeight.numerator > 0 && triangleArea.numerator > 0 && target.numerator > 0, "넓이 또는 길이가 양수가 아닙니다.");
  check(equal(triangleHeight, storedTriangleHeight) && equal(target, storedTarget), "저장한 삼각형 높이·선분 길이와 독립 계산값이 다릅니다.");
  check(equal(restoredArea, triangleArea), "구한 높이를 넓이식에 다시 넣은 값이 주어진 넓이와 다릅니다.");
  check(width.numerator !== 0, "삼각형 넓이식의 계수가 0이라 높이가 하나로 정해지지 않습니다.");
  return { width, totalHeight, triangleArea, triangleHeight, target };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 2-1 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "예제 2-1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 21 && readiness.integrity.lockedCount === 45, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "28/5cm" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "예제 2-1 비공개 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 2-1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-example1-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-example1-expression");
  const problemPoints = attr(generated.prompt, "data-geometry-points");
  const answerPoints = attr(generated.answerVisual, "data-geometry-points");
  const problemSegments = attr(generated.prompt, "data-geometry-segments");
  const answerSegments = attr(generated.answerVisual, "data-geometry-segments");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "rectangle-triangle-area-segment" && evidence.contract === "single-value" && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && `${print(calculated.target)}cm` === expectedAnswer && generated.answer === expectedAnswer, `${difficulty}/${seed}: 표시 답·독립 선분 길이·고정 답이 다릅니다.`);
  check(signature === answerSignature && problemPoints === answerPoints && problemSegments === answerSegments, `${difficulty}/${seed}: 문제와 답의 점·선분 모델이 다릅니다.`);
  check(problemSegments === "0-1:top;1-2:target;2-3:right-lower;3-4:bottom;4-0:left;4-2:diagonal", `${difficulty}/${seed}: 원본의 직사각형·대각선 선분 관계가 다릅니다.`);
  check((generated.prompt.match(/class="source62-area-point"/g) || []).length === 5 && ["ㄱ", "ㄹ", "ㅁ", "ㄷ", "ㄴ"].every(label => generated.prompt.includes(`>${label}</text>`)), `${difficulty}/${seed}: 원본 꼭짓점 다섯 개가 정확히 표시되지 않았습니다.`);
  check(!generated.prompt.includes("is-solved") && generated.prompt.includes("source62-area-target-question") && !generated.prompt.includes("source62-area-solution"), `${difficulty}/${seed}: 문제 그림에 답 길이나 풀이가 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-area-solution") && generated.answerVisual.includes("source62-area-target is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 2, `${difficulty}/${seed}: 답 그림의 강조 선분·두 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 2-1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 2-1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 원본 답 28/5cm · 점·선분 모델과 넓이식 독립 계산`);
