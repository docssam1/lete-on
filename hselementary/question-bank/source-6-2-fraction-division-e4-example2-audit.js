"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-example-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Example2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["4:1:29:8:13:6:26:1", { referenceArea: "29:2", areaPerLitre: "87:13", paintRatio: "12:1", answer: "174:1", shownAnswer: "174m²" }],
  ["3:1:7:4:7:6:8:1", { referenceArea: "21:4", areaPerLitre: "9:2", paintRatio: "48:7", answer: "36:1", shownAnswer: "36m²" }],
  ["5:1:11:6:11:9:8:1", { referenceArea: "55:6", areaPerLitre: "15:2", paintRatio: "72:11", answer: "60:1", shownAnswer: "60m²" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
const seenPools = new Set();
let checked = 0;

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fraction = (numerator, denominator = 1) => {
  if (!denominator) throw new Error("분모는 0일 수 없습니다.");
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: Math.abs(denominator) / divisor };
};
const multiply = (left, right) => fraction(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "")
  .replace(/<span hidden[\s\S]*?<\/span>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&sup2;|&#178;/g, "²")
  .replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const calculate = raw => {
  const values = raw.split(":").map(Number);
  const width = fraction(values[0], values[1]);
  const height = fraction(values[2], values[3]);
  const referencePaint = fraction(values[4], values[5]);
  const targetPaint = fraction(values[6], values[7]);
  const referenceArea = multiply(width, height);
  const areaPerLitre = divide(referenceArea, referencePaint);
  const targetArea = multiply(areaPerLitre, targetPaint);
  const paintRatio = divide(targetPaint, referencePaint);
  const alternateTargetArea = multiply(referenceArea, paintRatio);
  return { width, height, referencePaint, targetPaint, referenceArea, areaPerLitre, targetArea, paintRatio, alternateTargetArea };
};

check(Boolean(type), "예제 4-2 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "예제 4-2 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("3 5/8m") && readinessItem?.conditions?.includes("같은 방법으로 칠함") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "174m²" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-value", "예제 4-2 검토표의 원본 조건·답·공개 상태가 완결되지 않았습니다.");
check(readinessItem?.independentCalculation.includes("174m²") && !readinessItem?.independentCalculation.includes("=1080m²") && !readinessItem?.answerCandidates?.includes("1080m²"), "예제 4-2 검토표에 잘못된 1080m² 답이 남았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-value-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 4-2 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-example2-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.referenceArea) === expectedItem.referenceArea && signature(calculated.areaPerLitre) === expectedItem.areaPerLitre && signature(calculated.paintRatio) === expectedItem.paintRatio && signature(calculated.targetArea) === expectedItem.answer && signature(calculated.alternateTargetArea) === expectedItem.answer && generated.answer === expectedItem.shownAnswer, `${difficulty}/${seed}: 1L당 넓이 방식과 페인트 양의 비 방식의 독립 계산이 다릅니다.`);
  check([calculated.width, calculated.height, calculated.referencePaint, calculated.targetPaint, calculated.referenceArea, calculated.areaPerLitre, calculated.targetArea, calculated.paintRatio].every(value => value.numerator > 0), `${difficulty}/${seed}: 길이·넓이·페인트 양이 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-example2-kind") === "paint-area-unit-rate" && attr(generated.prompt, "data-result-contract") === "single-value" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-example2-structure") === "paint-area-unit-rate" && attr(generated.prompt, "data-reference-area") === expectedItem?.referenceArea && attr(generated.prompt, "data-target-area") === expectedItem?.answer && !generated.prompt.includes("source62-paint-area-board is-solved") && (generated.prompt.match(/source61-math-row/g) || []).length === 4, `${difficulty}/${seed}: 문제의 가로·세로·두 페인트 양 조건이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-example2-values") === sourceSignature && attr(generated.answerVisual, "data-reference-area") === expectedItem?.referenceArea && attr(generated.answerVisual, "data-target-area") === expectedItem?.answer && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-paint-area-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 10, `${difficulty}/${seed}: 답의 기준 벽 넓이·1L당 넓이·페인트 양의 비·목표 넓이 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 8 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 8, `${difficulty}/${seed}: 분수와 단위가 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("같은 방법") && !visibleText(generated.prompt).includes(expectedItem?.shownAnswer || "답 없음"), `${difficulty}/${seed}: 같은 방법 조건이 없거나 문제에 답이 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 4-2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 4-2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 1L당 넓이와 페인트 양의 비 독립 계산 일치 · 답 후보 1개`);
