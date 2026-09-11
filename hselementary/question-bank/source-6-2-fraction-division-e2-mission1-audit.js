"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e2-mission-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE2Mission1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["16:5:1:4:4:9", { rectangle: "64/5", triangle: "36/5", total: "20", answer: "20cm²" }],
  ["15:4:3:8:5:12", { rectangle: "10", triangle: "9", total: "19", answer: "19cm²" }],
  ["14:3:2:7:7:12", { rectangle: "49/3", triangle: "8", total: "73/3", answer: "24 1/3cm²" }]
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
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;
const print = value => value.denominator === 1 ? String(value.numerator) : `${value.numerator}/${value.denominator}`;
const parsePoints = raw => raw.split(" ").filter(Boolean).map(token => token.split(",").map(Number));
const polygonArea = points => Math.abs(points.reduce((sum, point, index) => {
  const next = points[(index + 1) % points.length];
  return sum + point[0] * next[1] - point[1] * next[0];
}, 0) / 2);
const pointInsideConvex = (point, polygon) => {
  const orientation = Math.sign(polygon.reduce((sum, first, index) => {
    const second = polygon[(index + 1) % polygon.length];
    return sum + first[0] * second[1] - first[1] * second[0];
  }, 0)) || 1;
  return polygon.every((first, index) => {
    const second = polygon[(index + 1) % polygon.length];
    const cross = (second[0] - first[0]) * (point[1] - first[1]) - (second[1] - first[1]) * (point[0] - first[0]);
    return orientation * cross >= -2;
  });
};

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e2-mission1-kind="overlap-area-relations"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "Mission 1 독립 검산 자료가 없습니다.");
  check(values.length === 12 && values.every(Number.isFinite), `Mission 1 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e2-mission1-kind"),
    contract: attr(markup, "data-result-contract"),
    rectangleCandidates: Number(attr(markup, "data-rectangle-candidates")),
    triangleCandidates: Number(attr(markup, "data-triangle-candidates")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentSolution(values) {
  const [coloredN, coloredD, rectanglePartN, rectanglePartD, trianglePartN, trianglePartD, storedRectangleN, storedRectangleD, storedTriangleN, storedTriangleD, storedTotalN, storedTotalD] = values;
  const colored = rational(coloredN, coloredD);
  const rectanglePart = rational(rectanglePartN, rectanglePartD);
  const trianglePart = rational(trianglePartN, trianglePartD);
  const rectangle = rational(colored.numerator * rectanglePart.denominator, colored.denominator * rectanglePart.numerator);
  const triangle = rational(colored.numerator * trianglePart.denominator, colored.denominator * trianglePart.numerator);
  const total = add(rectangle, triangle);
  check(equal(rectangle, rational(storedRectangleN, storedRectangleD)) && equal(triangle, rational(storedTriangleN, storedTriangleD)) && equal(total, rational(storedTotalN, storedTotalD)), "저장된 두 넓이와 합이 독립 계산값과 다릅니다.");
  check(equal(multiply(rectangle, rectanglePart), colored) && equal(multiply(triangle, trianglePart), colored), "두 도형의 넓이에 주어진 분수를 곱해도 색칠한 넓이로 돌아오지 않습니다.");
  return { rectangle, triangle, total };
}

function inspectPointModel(markup, label) {
  const rectangle = parsePoints(attr(markup, "data-rectangle-points"));
  const triangle = parsePoints(attr(markup, "data-triangle-points"));
  const overlap = parsePoints(attr(markup, "data-overlap-points"));
  check(rectangle.length === 4 && triangle.length === 3 && overlap.length >= 3 && Number(attr(markup, "data-overlap-vertex-count")) === overlap.length, `${label}: 점·선분 모델의 꼭짓점 수가 다릅니다.`);
  check([rectangle, triangle, overlap].every(points => points.flat().every(Number.isFinite) && polygonArea(points) > 1), `${label}: 도형이나 겹친 부분의 넓이가 없습니다.`);
  check(overlap.every(point => pointInsideConvex(point, rectangle) && pointInsideConvex(point, triangle)), `${label}: 색칠한 점이 두 도형의 공통 부분 밖에 있습니다.`);
  return { rectangle: attr(markup, "data-rectangle-points"), triangle: attr(markup, "data-triangle-points"), overlap: attr(markup, "data-overlap-points") };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "Mission 1 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(api.names.includes(generatorKey), "Mission 1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 24 && readiness.integrity.lockedCount === 42, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "20cm²" && readinessItem?.calculationStatus === "checked-exhaustive" && readinessItem?.candidateAnswerCount === 1, "Mission 1 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-answer-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e2-mission1-expression");
  const answerSignature = attr(generated.answerVisual, "data-source62-e2-mission1-expression");
  const expectedAnswer = expected.get(signature);
  const calculated = independentSolution(evidence.values);
  const problemModel = inspectPointModel(generated.prompt, `${difficulty}/${seed}/문제`);
  const answerModel = inspectPointModel(generated.answerVisual, `${difficulty}/${seed}/답`);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "overlap-area-relations" && evidence.contract === "single-value" && evidence.rectangleCandidates === 1 && evidence.triangleCandidates === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 후보·난이도 계약이 다릅니다.`);
  check(Boolean(expectedAnswer) && print(calculated.rectangle) === expectedAnswer.rectangle && print(calculated.triangle) === expectedAnswer.triangle && print(calculated.total) === expectedAnswer.total && generated.answer === expectedAnswer.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 넓이가 다릅니다.`);
  check(signature === answerSignature && problemModel.rectangle === answerModel.rectangle && problemModel.triangle === answerModel.triangle && problemModel.overlap === answerModel.overlap, `${difficulty}/${seed}: 문제와 답의 겹친 도형 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source62-overlap-colored"/g) || []).length === 1 && generated.prompt.includes("source62-overlap-relation") && !generated.prompt.includes("source62-overlap-area is-solved"), `${difficulty}/${seed}: 문제의 두 도형·색칠·관계 표시가 다릅니다.`);
  check(!generated.prompt.includes("source62-overlap-area-solution") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-overlap-area is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 3, `${difficulty}/${seed}: 답 그림의 색칠 강조와 세 계산 단계가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
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
console.log(`6-2 분수의 나눗셈 Mission 1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 두 넓이 후보 각 1개 · 점·선분 교집합 검증`);
