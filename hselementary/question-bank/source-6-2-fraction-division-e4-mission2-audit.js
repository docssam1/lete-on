"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e4-mission-2";
const generatorKey = "sourceGrade6SecondFractionDivisionE4Mission2";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["9:20:97:12:13:5:90:1", { passage: "128:15", perMinute: "128:39", multiplier: "450:13", target: "3840:13", answer: "3840/13km" }],
  ["7:20:25:6:5:2:90:1", { passage: "271:60", perMinute: "271:150", multiplier: "36:1", target: "813:5", answer: "813/5km" }],
  ["5:12:27:4:10:3:90:1", { passage: "43:6", perMinute: "43:20", multiplier: "27:1", target: "387:2", answer: "387/2km" }]
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
const multiply = (left, right) => fraction(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => fraction(left.numerator * right.denominator, left.denominator * right.numerator);
const signature = value => `${value.numerator}:${value.denominator}`;
const attr = (html, name) => String(html || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const visibleText = html => String(html || "").replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const check = (condition, message) => { if (!condition) failures.push(message); };
const calculate = raw => {
  const values = raw.split(":").map(Number);
  const train = fraction(values[0], values[1]);
  const bridge = fraction(values[2], values[3]);
  const passageTime = fraction(values[4], values[5]);
  const targetTime = fraction(values[6], values[7]);
  const passage = add(train, bridge);
  const perMinute = divide(passage, passageTime);
  const target = multiply(perMinute, targetTime);
  const multiplier = divide(targetTime, passageTime);
  const alternate = multiply(passage, multiplier);
  return { train, bridge, passageTime, targetTime, passage, perMinute, target, multiplier, alternate };
};

check(Boolean(type), "Mission 2 공개 유형이 없습니다.");
check(type?.generatorKey === generatorKey && type?.reviewLocked === false && type?.answerVisualStatus === "verified" && type?.verifiedVariantCount === 3 && type?.variant === 0, "Mission 2 공개 유형의 생성기·잠금·답 그림·고정 문항 연결이 다릅니다.");
check(readiness.integrity.publicCandidateCount === 44 && readiness.integrity.lockedCount === 22 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개·잠금 요약이 다릅니다.");
check(readinessItem?.originalStructure.includes("다리를 완전히 통과") && readinessItem?.conditions?.includes("다리 길이 8 1/12km") && readinessItem?.answerCandidates?.[0] === "3840/13km" && readinessItem?.candidateAnswerCount === 1 && readinessItem?.resultContract === "single-improper-fraction-distance" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.releaseStatus === "verified", "Mission 2 검토표의 원문 조건·기약분수 답·공개 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-improper-fraction-distance-fixed-pool" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "Mission 2 원자료 장부의 원문 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const sourceSignature = attr(generated.prompt, "data-source62-e4-mission2-values");
  const calculated = calculate(sourceSignature);
  const expectedItem = expected.get(sourceSignature);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && attr(generated.prompt, "data-source-item") === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(expectedItem && signature(calculated.passage) === expectedItem.passage && signature(calculated.perMinute) === expectedItem.perMinute && signature(calculated.multiplier) === expectedItem.multiplier && signature(calculated.target) === expectedItem.target && signature(calculated.alternate) === expectedItem.target && generated.answer === expectedItem.answer, `${difficulty}/${seed}: 완전 통과 거리·1분 거리·시간 배수의 독립 계산이 다릅니다.`);
  check(gcd(calculated.target.numerator, calculated.target.denominator) === 1 && calculated.target.numerator > calculated.target.denominator, `${difficulty}/${seed}: 답이 기약 가분수가 아닙니다.`);
  check(attr(generated.prompt, "data-source62-fraction-e4-mission2-kind") === "train-bridge-complete-passage" && attr(generated.prompt, "data-result-contract") === "single-improper-fraction-distance" && Number(attr(generated.prompt, "data-candidate-count")) === 1 && attr(generated.prompt, "data-difficulty-design") === difficultyNames[String(difficulty)], `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(attr(generated.prompt, "data-source62-e4-mission2-structure") === "train-completely-crosses-bridge" && attr(generated.prompt, "data-passage-distance") === expectedItem?.passage && attr(generated.prompt, "data-distance-per-minute") === expectedItem?.perMinute && attr(generated.prompt, "data-target-distance") === expectedItem?.target, `${difficulty}/${seed}: 열차·다리 완전 통과 자료가 다릅니다.`);
  check(attr(generated.answerVisual, "data-source62-e4-mission2-values") === sourceSignature && attr(generated.answerVisual, "data-target-distance") === expectedItem?.target && generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`) && generated.answerVisual.includes("source62-train-bridge-board is-solved") && (generated.answerVisual.match(/source61-math-row/g) || []).length === 12, `${difficulty}/${seed}: 답 계산판 또는 두 독립 계산이 문제 자료와 다릅니다.`);
  check((generated.prompt.match(/class="math-unit"/g) || []).length >= 6 && (generated.prompt.match(/class="math-inline-expression"/g) || []).length >= 7 && (generated.answerVisual.match(/class="math-fraction"/g) || []).length >= 8, `${difficulty}/${seed}: 세로 분수·단위 또는 줄바꿈되지 않는 수식 묶음이 빠졌습니다.`);
  check(!/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 학생 글에 가로 분수가 남았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항|단위율/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학생에게 어려운 표현이 있습니다.`);
  check(visibleText(generated.prompt).includes("다리를 완전히 통과") && visibleText(generated.prompt).includes("열차 길이 + 다리 길이") && !visibleText(generated.prompt).includes(expectedItem?.answer || "답 없음") && !/분홍|손글씨|낙서/.test(visibleText(generated.prompt)), `${difficulty}/${seed}: 원문 완전 통과 조건이 없거나 문제에 답·스캔 표시가 노출되었습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 Mission 2 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 Mission 2 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 완전 통과 거리 · 두 독립 계산 일치 · 기약분수 답 후보 1개`);
