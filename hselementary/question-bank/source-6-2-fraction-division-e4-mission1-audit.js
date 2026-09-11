"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["7:3:19:6:2:1:3:2:90:1:12:1", { wall: "11:2", perLitre: "11:3", multiplier: "8:1", painted: "44:1", remaining: "46:1", answer: "46m²" }],
  ["9:4:15:4:5:2:5:4:67:2:9:2", { wall: "15:2", perLitre: "6:1", multiplier: "18:5", painted: "27:1", remaining: "13:2", answer: "6 1/2m²" }],
  ["11:6:10:3:3:1:5:2:20:1:3:1", { wall: "31:4", perLitre: "31:10", multiplier: "6:5", painted: "93:10", remaining: "107:10", answer: "10 7/10m²" }]
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
const add = (left, right) => fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => fraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => fraction(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const check = (condition, message) => { if (!condition) failures.push(message); };
const calculate = raw => {
  const values = raw.split(":").map(Number);
  const top = fraction(values[0], values[1]);
  const bottom = fraction(values[2], values[3]);
  const height = fraction(values[4], values[5]);
  const referencePaint = fraction(values[6], values[7]);
  const targetArea = fraction(values[8], values[9]);
  const availablePaint = fraction(values[10], values[11]);
  const wall = divide(multiply(add(top, bottom), height), fraction(2));
  const rectangle = multiply(top, height);
  const triangle = divide(multiply(subtract(bottom, top), height), fraction(2));
  const decomposed = add(rectangle, triangle);
  const perLitre = divide(wall, referencePaint);
  const painted = multiply(perLitre, availablePaint);
  const multiplier = divide(availablePaint, referencePaint);
  const paintedByMultiplier = multiply(wall, multiplier);
  const remaining = subtract(targetArea, painted);
  return { top, bottom, height, wall, decomposed, perLitre, painted, multiplier, paintedByMultiplier, remaining };
};

check(Boolean(type), "Mission 1 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 1 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("직각사다리꼴") && readinessItem?.conditions?.includes("같은 방법으로 칠함") && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "46m²" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-area", "Mission 1 검토표의 원본 도형·답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-area-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission1-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  const points = attr(generated.prompt, "data-geometry-points").split(";").map(point => point.split(",").map(Number));
  const topPixels = points[1]?.[0] - points[0]?.[0];
  const bottomPixels = points[2]?.[0] - points[3]?.[0];
  const heightPixels = points[3]?.[1] - points[0]?.[1];
  const scale = Number(attr(generated.prompt, "data-scale"));
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.wall) === expectedItem.wall && signature(calculated.decomposed) === expectedItem.wall && signature(calculated.perLitre) === expectedItem.perLitre && signature(calculated.multiplier) === expectedItem.multiplier && signature(calculated.painted) === expectedItem.painted && signature(calculated.paintedByMultiplier) === expectedItem.painted && signature(calculated.remaining) === expectedItem.remaining && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 사다리꼴 공식·도형 분해·두 페인트 계산의 독립 답이 다릅니다.`);
  check(calculated.painted.numerator * calculated.remaining.denominator > 0 && calculated.remaining.numerator > 0, `${difficulty}/${seed}: 칠한 넓이와 칠하지 못한 넓이가 양수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission1-kind") === "painted-right-trapezoid-proportion" && attr(generated.prompt, "data-result-contract") === "single-area" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission1-structure") === "right-trapezoid-painted-wall" && attr(generated.prompt, "data-geometry-segments") === "0-1:top-base;1-2:right-slant;2-3:bottom-base;3-0:left-height" && Number(attr(generated.prompt, "data-right-angle-count")) === 2 && Number(attr(generated.prompt, "data-dimension-count")) === 3 && points.length === 4, `${difficulty}/${seed}: 원문의 직각사다리꼴 점·선분·직각·치수 구조가 다릅니다.`);
  check(Math.abs(topPixels - scale * calculated.top.numerator / calculated.top.denominator) < 0.05 && Math.abs(bottomPixels - scale * calculated.bottom.numerator / calculated.bottom.denominator) < 0.05 && Math.abs(heightPixels - scale * calculated.height.numerator / calculated.height.denominator) < 0.05 && points[0][0] === points[3][0] && points[0][1] === points[1][1] && points[2][1] === points[3][1] && points[2][0] > points[1][0], `${difficulty}/${seed}: 도형 좌표가 실제 윗변·아랫변·높이의 비로 계산되지 않았습니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission1-values") === sourceSignature && attr(generated.answerVisual, "data-geometry-points") === attr(generated.prompt, "data-geometry-points") && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-painted-wall-diagram is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 11, `${difficulty}/${seed}: 답 그림 또는 두 독립 계산이 문제 자료와 다릅니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 6 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 6 && (generated.prompt.match(/class="svg-measurement"/g) || []).length >= 2, `${difficulty}/${seed}: 세로 분수·단위 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("같은 방법") && !visibleText(generated.prompt).includes(expectedItem?.answer || "답 없음") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 조건이 없거나 문제에 답·스캔 표시가 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 직각사다리꼴 비례 좌표 · 두 독립 계산 일치 · 답 후보 1개`);
