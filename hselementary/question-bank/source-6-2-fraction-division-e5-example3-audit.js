"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-grade6.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-2-u1-e5-example-3";
const generatorKey = "sourceGrade6SecondFractionDivisionE5Example3";
const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-u1-source-readiness-review.json"), "utf8"));
const sourceLedger = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const sourceLedgerItem = sourceLedger.items.find(item => item.sourceItemId === sourceItemId);
const expected = new Map([
  ["7:3:4:3:28:16", { segments: [6, 14, 8, 8], positions: [0, 6, 20, 28, 36], answer: "36m" }],
  ["7:4:3:2:34:22", { segments: [8, 14, 12, 10], positions: [0, 8, 22, 34, 44], answer: "44m" }],
  ["12:5:8:5:50:25", { segments: [10, 24, 16, 9], positions: [0, 10, 34, 50, 59], answer: "59m" }]
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
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const same = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;

function parseEvidence(prompt) {
  const markup = String(prompt).match(/<span\s+hidden[\s\S]*?data-source62-fraction-e5-example3-kind="five-point-segment-distance"[\s\S]*?<\/span>/)?.[0] || "";
  const values = attr(markup, "data-values").split(",").map(Number);
  check(Boolean(markup), "예제 5-3 독립 검산 자료가 없습니다.");
  check(values.length === 16 && values.every(Number.isFinite), `예제 5-3 검산 자료가 깨졌습니다: ${values.join(",")}`);
  return {
    source: attr(markup, "data-source-item"),
    kind: attr(markup, "data-source62-fraction-e5-example3-kind"),
    contract: attr(markup, "data-result-contract"),
    candidateCount: Number(attr(markup, "data-candidate-count")),
    difficulty: attr(markup, "data-difficulty-design"),
    values
  };
}

function independentlyCalculate(values) {
  const [naDaN, naDaD, daRaN, daRaD, gaRaValue, daMaValue, ...rest] = values;
  const storedSegments = rest.slice(0, 4);
  const storedPositions = rest.slice(4, 9);
  const storedAnswer = rest[9];
  const naDaRatio = rational(naDaN, naDaD);
  const daRaRatio = rational(daRaN, daRaD);
  const totalFactor = add(add(rational(1), naDaRatio), daRaRatio);
  const gaNa = divide(rational(gaRaValue), totalFactor);
  const naDa = multiply(gaNa, naDaRatio);
  const daRa = multiply(gaNa, daRaRatio);
  const raMa = subtract(rational(daMaValue), daRa);
  const gaDa = add(gaNa, naDa);
  const gaMaFromDa = add(gaDa, rational(daMaValue));
  const gaMaFromRa = add(rational(gaRaValue), raMa);
  const segments = [gaNa, naDa, daRa, raMa];
  const positions = [rational(0), gaNa, gaDa, rational(gaRaValue), gaMaFromDa];
  const naturalGaNaCandidates = Array.from({ length: gaRaValue }, (_, index) => rational(index + 1)).filter(candidate => same(multiply(candidate, totalFactor), rational(gaRaValue)));
  check(segments.every(value => value.denominator === 1 && value.numerator > 0), "네 구간이 모두 양의 자연수 길이가 아닙니다.");
  check(positions.every((value, index) => index === 0 || value.numerator / value.denominator > positions[index - 1].numerator / positions[index - 1].denominator), "가-나-다-라-마의 실제 점 위치가 차례대로 증가하지 않습니다.");
  check(naturalGaNaCandidates.length === 1 && same(naturalGaNaCandidates[0], gaNa), `자연수 가나 후보가 ${naturalGaNaCandidates.length}개입니다.`);
  check(same(gaMaFromDa, gaMaFromRa), "가다+다마와 가라+라마의 독립 계산 답이 다릅니다.");
  check(storedSegments.join(":") === segments.map(value => value.numerator).join(":"), "기록된 네 구간 길이가 독립 분수 계산과 다릅니다.");
  check(storedPositions.join(":") === positions.map(value => value.numerator).join(":"), "기록된 다섯 점 위치가 독립 분수 계산과 다릅니다.");
  check(storedAnswer === gaMaFromDa.numerator, "기록된 가마 거리가 독립 분수 계산과 다릅니다.");
  return { signature: [naDaN, naDaD, daRaN, daRaD, gaRaValue, daMaValue].join(":"), segments: segments.map(value => value.numerator), positions: positions.map(value => value.numerator), answer: gaMaFromDa.numerator, candidateCount: naturalGaNaCandidates.length };
}

check(Boolean(type) && type.generatorKey === generatorKey && !type.reviewLocked, "예제 5-3 공개 원장이 전용 생성기에 연결되지 않았습니다.");
check(type?.typeLabel === "수직선의 거리 관계로 두 점 사이 거리 구하기", "예제 5-3 유형명이 원문 질문을 쉬운 말로 나타내지 않습니다.");
check(api.names.includes(generatorKey), "예제 5-3 전용 생성기가 등록되지 않았습니다.");
check(readiness.integrity.publicCandidateCount === 47 && readiness.integrity.lockedCount === 19 && readiness.integrity.publicCandidateCount === readiness.items.filter(item => item.publicDecision === "public").length && readiness.integrity.lockedCount === readiness.items.filter(item => item.publicDecision === "locked").length, "6-2 1단원 검토표의 공개 47개·잠금 19개 요약이 다릅니다.");
check(readinessItem?.implementationStatus === "fixed-verified-pool" && readinessItem?.publicDecision === "public" && readinessItem?.releaseStatus === "verified" && readinessItem?.answerCandidates?.[0] === "36m" && readinessItem?.calculationStatus === "checked-independent" && readinessItem?.candidateAnswerCount === 1, "예제 5-3 검토표의 원본 답·단일 답 상태가 완결되지 않았습니다.");
check(sourceLedgerItem?.sourceVerified === true && sourceLedgerItem?.implementationStatus === "fixed-verified-pool" && sourceLedgerItem?.answerContract === "single-natural-meter" && sourceLedgerItem?.publicSourceItemId === sourceItemId, "예제 5-3 원자료 장부의 원본 확인·단일 답·공개 연결이 완결되지 않았습니다.");

for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1500; seed += 1) {
  const generated = api.generate(type, 0, difficulty, seed, type.variant);
  const evidence = parseEvidence(generated.prompt);
  const calculated = independentlyCalculate(evidence.values);
  const expectedRow = expected.get(calculated.signature);
  const promptSvg = String(generated.prompt).match(/<svg\s+class="geometry-diagram source62-distance-line"[\s\S]*?<\/svg>/)?.[0] || "";
  const answerSvg = String(generated.answerVisual).match(/<svg\s+class="geometry-diagram source62-distance-line is-solved"[\s\S]*?<\/svg>/)?.[0] || "";
  const promptSignature = attr(promptSvg, "data-source62-e5-example3-values");
  const answerSignature = attr(answerSvg, "data-source62-e5-example3-values");
  const promptSegments = attr(promptSvg, "data-segment-lengths");
  const answerSegments = attr(answerSvg, "data-segment-lengths");
  const promptPositions = attr(promptSvg, "data-point-positions");
  const answerPositions = attr(answerSvg, "data-point-positions");
  const promptText = visibleText(generated.prompt);
  const answerText = visibleText(generated.answerVisual);
  seenPools.add(generated.verifiedPoolIndex);
  check(generated.generator === generatorKey && generated.sourceItemId === sourceItemId && evidence.source === sourceItemId, `${difficulty}/${seed}: 전용 생성기·원문 연결이 다릅니다.`);
  check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${difficulty}/${seed}: 고정 문항 3개 계약이 다릅니다.`);
  check(evidence.kind === "five-point-segment-distance" && evidence.contract === "single-natural-meter" && evidence.candidateCount === 1 && evidence.difficulty === difficultyNames[String(difficulty)] && calculated.candidateCount === 1, `${difficulty}/${seed}: 유형·단일 답·난이도 계약이 다릅니다.`);
  check(Boolean(expectedRow) && expectedRow.segments.join(":") === calculated.segments.join(":") && expectedRow.positions.join(":") === calculated.positions.join(":") && generated.answer === expectedRow?.answer && calculated.answer === Number(expectedRow?.answer.replace("m", "")), `${difficulty}/${seed}: 고정 풀의 구간·점 위치·답이 다릅니다.`);
  check(promptSvg && answerSvg && promptSignature === calculated.signature && answerSignature === calculated.signature && promptSegments === calculated.segments.join(":") && answerSegments === calculated.segments.join(":") && promptPositions === calculated.positions.join(":") && answerPositions === calculated.positions.join(":"), `${difficulty}/${seed}: 문제와 답이 같은 점·선분 자료를 쓰지 않습니다.`);
  check(attr(promptSvg, "data-point-order") === "가,나,다,라,마" && attr(answerSvg, "data-point-order") === "가,나,다,라,마" && (promptSvg.match(/data-point-label="[가나다라마]"/g) || []).join("") === 'data-point-label="가"data-point-label="나"data-point-label="다"data-point-label="라"data-point-label="마"', `${difficulty}/${seed}: 점 순서 가-나-다-라-마가 다릅니다.`);
  check((promptSvg.match(/source62-distance-measure/g) || []).length === 0 && !promptSvg.includes("source62-distance-total") && !promptSvg.includes("source62-distance-answer") && !promptText.includes(generated.answer), `${difficulty}/${seed}: 문제에 구간 측정값 또는 답이 노출되었습니다.`);
  check((answerSvg.match(/source62-distance-measure/g) || []).length === 4 && (answerSvg.match(/data-measure-segment="[0-3]"/g) || []).length === 4 && answerSvg.includes("source62-distance-total") && answerSvg.includes("source62-distance-answer") && answerText.includes(generated.answer), `${difficulty}/${seed}: 답에 네 구간 또는 전체 거리가 모두 표시되지 않았습니다.`);
  check((generated.prompt.match(/class="math-fraction"/g) || []).length >= 2 && !/\b\d+\s*\/\s*\d+\b/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 분수 조건이 세로 분수로 표시되지 않았습니다.`);
  check(!/undefined|null|NaN|Infinity|순열|조합|제곱|일반항/.test(visibleText(`${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`)), `${difficulty}/${seed}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
  if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${difficulty}/${seed}: 쉬움 안내가 없습니다.`);
  if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${difficulty}/${seed}: 원본 단계에 추가 안내가 섞였습니다.`);
  if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${difficulty}/${seed}: 어려움 단계 표시가 없습니다.`);
  checked += 1;
}

check([...seenPools].sort().join(",") === "0,1,2", `세 고정 문항을 모두 확인하지 못했습니다: ${[...seenPools].sort().join(",")}`);
if (failures.length) {
  console.error(`6-2 분수의 나눗셈 예제 5-3 감사 실패: ${failures.length}건`);
  console.error([...new Set(failures)].slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 예제 5-3 감사 통과: ${checked}개 생성 · 고정 문항 3개 · 자연수 가나 후보 1개 · 점·선분 두 방법 역산`);
