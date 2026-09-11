"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-example-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Example1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["4:5:14:15:48:49", { referenceArea: "16:25", weightPerArea: "35:24", areaRatio: "75:49", answer: "10:7", shownAnswer: "1 3/7kg" }],
  ["3:4:9:10:25:36", { referenceArea: "9:16", weightPerArea: "8:5", areaRatio: "100:81", answer: "10:9", shownAnswer: "1 1/9kg" }],
  ["5:6:7:12:7:6", { referenceArea: "25:36", weightPerArea: "21:25", areaRatio: "42:25", answer: "49:50", shownAnswer: "49/50kg" }]
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
  const side = fraction(values[0], values[1]);
  const referenceWeight = fraction(values[2], values[3]);
  const targetArea = fraction(values[4], values[5]);
  const referenceArea = multiply(side, side);
  const weightPerArea = divide(referenceWeight, referenceArea);
  const targetWeight = multiply(weightPerArea, targetArea);
  const areaRatio = divide(targetArea, referenceArea);
  const alternateTargetWeight = multiply(referenceWeight, areaRatio);
  return { side, referenceWeight, targetArea, referenceArea, weightPerArea, targetWeight, areaRatio, alternateTargetWeight };
};

check(Boolean(type), "예제 4-1 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "예제 4-1 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("4/5m") && readinessItem?.conditions?.includes("두 철판의 두께가 같음") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "10/7kg" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-value", "예제 4-1 검토표의 원본 조건·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-value-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 4-1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-example1-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.referenceArea) === expectedItem.referenceArea && signature(calculated.weightPerArea) === expectedItem.weightPerArea && signature(calculated.areaRatio) === expectedItem.areaRatio && signature(calculated.targetWeight) === expectedItem.answer && signature(calculated.alternateTargetWeight) === expectedItem.answer && generated.answer === expectedItem.shownAnswer, `${difficulty}/${seed}: 1m² 무게 방식과 넓이 비 방식의 독립 계산이 다릅니다.`);
  check([calculated.side, calculated.referenceWeight, calculated.targetArea, calculated.referenceArea, calculated.weightPerArea, calculated.targetWeight, calculated.areaRatio].every(value => value.numerator > 0), `${difficulty}/${seed}: 길이·넓이·무게가 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-example1-kind") === "same-thickness-sheet-weight" && attr(generated.prompt, "data-result-contract") === "single-value" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-example1-structure") === "same-thickness-sheet-weight" && attr(generated.prompt, "data-reference-area") === expectedItem?.referenceArea && attr(generated.prompt, "data-target-weight") === expectedItem?.answer && !generated.prompt.includes("source62-sheet-weight-board is-solved") && (generated.prompt.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 문제의 한 변·기준 무게·새 넓이 조건이 정확하지 않습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-example1-values") === sourceSignature && attr(generated.answerVisual, "data-reference-area") === expectedItem?.referenceArea && attr(generated.answerVisual, "data-target-weight") === expectedItem?.answer && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-sheet-weight-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 9, `${difficulty}/${seed}: 답의 정사각형 넓이·1m² 무게·넓이 비·새 무게 계산이 없습니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 6 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 6, `${difficulty}/${seed}: 분수와 단위가 줄바꿈되지 않는 공통 수식 묶음으로 표시되지 않았습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("같은 두께") && !visibleText(generated.prompt).includes(expectedItem?.shownAnswer || "답 없음"), `${difficulty}/${seed}: 같은 두께 조건이 없거나 문제에 답이 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 4-1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 4-1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 1m² 무게와 넓이 비 독립 계산 일치 · 답 후보 1개`);
