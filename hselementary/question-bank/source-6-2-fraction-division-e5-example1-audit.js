"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-example-1";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Example1";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["13:19:24", { totalParts: 32, onePart: [3, 4], day: [39, 4], night: [57, 4], dayMinutes: 585, nightMinutes: 855, answer: "14시간 15분" }],
  ["7:9:24", { totalParts: 16, onePart: [3, 2], day: [21, 2], night: [27, 2], dayMinutes: 630, nightMinutes: 810, answer: "13시간 30분" }],
  ["11:13:24", { totalParts: 24, onePart: [1, 1], day: [11, 1], night: [13, 1], dayMinutes: 660, nightMinutes: 780, answer: "13시간" }]
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
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const same = (value, pair) => value.numerator === pair[0] && value.denominator === pair[1];

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-example1-kind="night-duration-from-day-fraction"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(":").map(Number);
  check(Boolean(markup), "예제 5-1 독립 검산 자료가 없습니다.");
  check(values.length === 11 && values.every(Number.isFinite), `예제 5-1 검산 자료가 깨졌습니다: ${values.join(":")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e5-example1-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [dayParts, nightParts] = values;
  const totalParts = dayParts + nightParts;
  const onePart = rational(24, totalParts);
  const day = rational(onePart.numerator * dayParts, onePart.denominator);
  const night = rational(onePart.numerator * nightParts, onePart.denominator);
  const dayMinutes = day.numerator * 60 / day.denominator;
  const nightMinutes = night.numerator * 60 / night.denominator;
  const candidates = Array.from({ length: 1439 }, (_, index) => index + 1)
    .filter(minutes => (1440 - minutes) * nightParts === minutes * dayParts);
  return { totalParts, onePart, day, night, dayMinutes, nightMinutes, candidates };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 5-1 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "하루의 분수로 밤의 시간 구하기", "예제 5-1 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "예제 5-1 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 44 && readiness.integrity.lockedCount === 22 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "14시간 15분" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.candidateAnswerCount === 1, "예제 5-1 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(!readinessItem?.answerCandidates?.includes("9시간45분") && readinessItem?.independentCalculation?.includes("낮은 9시간 45분"), "예제 5-1에서 낮 9시간 45분이 밤의 답으로 남아 있습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-duration" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 5-1 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const signature = attr(generated.prompt, "data-source62-e5-example1-values");
  const answerSignature = attr(generated.answerVisual, "data-source62-e5-example1-values");
  const row = expected.get(signature);
  const calculated = independentlyCalculate(evidence.values);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "night-duration-from-day-fraction" && evidence.contract === "single-duration" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(row) && calculated.totalParts === row.totalParts && same(calculated.onePart, row.onePart) && same(calculated.day, row.day) && same(calculated.night, row.night) && calculated.dayMinutes === row.dayMinutes && calculated.nightMinutes === row.nightMinutes && calculated.candidates.length === 1 && calculated.candidates[0] === row.nightMinutes && generated.answer === row.answer, `${difficulty}/${seed}: 표시 답과 독립 계산한 낮·밤 길이가 다릅니다.`);
  check(signature === answerSignature, `${difficulty}/${seed}: 문제와 답의 낮·밤 비 자료가 다릅니다.`);
  check((generated.prompt.match(/class="source61-math-row"/g) || []).length === 2, `${difficulty}/${seed}: 문제의 낮·밤 관계표가 다릅니다.`);
  check((generated.answerVisual.match(/class="source61-math-row"/g) || []).length === 10 && generated.answerVisual.includes("source62-day-night-board is-solved") && generated.answerVisual.includes("source62-day-night-solution") && generated.answerVisual.includes("source62-day-night-strip"), `${difficulty}/${seed}: 답의 낮·밤 띠와 독립 계산표가 없습니다.`);
  check(!generated.prompt.includes("source62-day-night-board is-solved") && !generated.prompt.includes("source62-day-night-solution") && !generated.prompt.includes("source62-day-night-strip") && !visibleText(generated.prompt).includes(generated.answer), `${difficulty}/${seed}: 문제에 계산 과정이나 답이 노출되었습니다.`);
  check(generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes('data-candidate-count="1"'), `${difficulty}/${seed}: 답 그림의 원문·단일 답 표시가 없습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생이 보는 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 5-1 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 5-1 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 낮과 밤 합 24시간 · 밤 후보 1개`);
