"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-grade6-decimal-e1-mission4.js");

const readiness = require("./source-inventory/6-1-u3-source-readiness-review.json");
const rawInventory = require("./source-inventory/6-1-source-items.json");
const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u3-e1-mission-4";
const generatorKey = "sourceGrade6DecimalDivisionE1Mission4";
const expectedPools = [
  [8, 58.8, 7.35, 56, 28, 24, 40, 40],
  [8, 51.6, 6.45, 48, 36, 32, 40, 40],
  [6, 52.5, 8.75, 48, 45, 42, 30, 30]
];
const failures = [];
let checked = 0;

const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const evidence = prompt => String(prompt).match(/<span hidden[^>]*data-source61-division-kind="masked-decimal-long-division"[^>]*><\/span>/)?.[0] || "";
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-9;
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const independentFacts = ([divisor, dividend]) => {
  const dividendTenths = Math.round(dividend * 10);
  const dividendDigits = [Math.floor(dividendTenths / 100), Math.floor(dividendTenths / 10) % 10, dividendTenths % 10];
  const quotientHundredths = Math.round(dividend * 100 / divisor);
  const quotientDigits = [Math.floor(quotientHundredths / 100), Math.floor(quotientHundredths / 10) % 10, quotientHundredths % 10];
  const firstPartial = dividendDigits[0] * 10 + dividendDigits[1];
  const product1 = divisor * quotientDigits[0];
  const remainder1 = firstPartial - product1;
  const secondPartial = remainder1 * 10 + dividendDigits[2];
  const product2 = divisor * quotientDigits[1];
  const remainder2 = secondPartial - product2;
  const thirdPartial = remainder2 * 10;
  const product3 = divisor * quotientDigits[2];
  const remainder3 = thirdPartial - product3;
  const candidates = [];
  for (let hundredths = 1; hundredths <= 999; hundredths += 1) {
    if (divisor * hundredths === Math.round(dividend * 100)) candidates.push((hundredths / 100).toFixed(2));
  }
  return { quotient: (quotientHundredths / 100).toFixed(2), product1, secondPartial, product2, thirdPartial, product3, remainder3, candidates };
};

if (!api?.names?.includes(generatorKey)) fail("Mission 4 전용 생성기가 등록되지 않았습니다.");
const catalogItem = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const curriculumItem = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units).flatMap(unit => unit.subunits).flatMap(subunit => subunit.types).find(type => type.sourceItemId === sourceItemId);
const readinessItem = readiness.items.find(item => item.sourceItemId === sourceItemId);
const rawItem = rawInventory.items.find(item => item.sourceItemId === sourceItemId);
if (!catalogItem || catalogItem.reviewLocked || catalogItem.generatorKey !== generatorKey || catalogItem.answerVisualStatus !== "verified" || catalogItem.verifiedVariantCount !== 3) fail("공개 분류표의 Mission 4 생성 계약이 다릅니다.");
if (!curriculumItem || curriculumItem.reviewLocked || curriculumItem.generatorKey !== generatorKey) fail("교육과정 화면의 Mission 4 연결이 다릅니다.");
if (!readinessItem || readinessItem.implementationStatus !== "fixed-verified-pool" || readinessItem.publicDecision !== "confirmed" || readinessItem.releaseStatus !== "verified" || !readinessItem.singleAnswer) fail("원문 준비도 기록의 Mission 4 공개 상태가 다릅니다.");
if (!rawItem || rawItem.implementationStatus !== "fixed-verified-pool" || rawItem.answerContract !== "single-answer-fixed-pool" || rawItem.publicSourceItemId !== sourceItemId) fail("원자료 장부의 Mission 4 연결이 다릅니다.");

for (const difficulty of [-1, 0, 1]) {
  const seenPools = new Set();
  for (let seed = 610300; seed < 610900; seed += 1) {
    const generated = api.generate({ sourceItemId, generatorKey, variant: 0 }, 0, difficulty, seed, 0);
    const label = `난이도 ${difficulty} / seed ${seed}`;
    const hidden = evidence(generated?.prompt);
    const values = (attr(hidden, "data-values") || "").split(",").filter(Boolean).map(Number);
    const poolIndex = Number(generated?.verifiedPoolIndex);
    const expected = expectedPools[poolIndex];
    seenPools.add(poolIndex);
    if (!expected || !sameValues(values, expected)) fail(`${label}: 검산 자료와 고정 문항 자료가 다릅니다.`);
    const facts = independentFacts(values);
    if (facts.quotient !== String(generated?.answer) || facts.remainder3 !== 0 || facts.candidates.length !== 1 || facts.candidates[0] !== facts.quotient) fail(`${label}: 독립 계산 또는 단일 정답 검사가 실패했습니다.`);
    if (!sameValues([facts.product1, facts.secondPartial, facts.product2, facts.thirdPartial, facts.product3], expected?.slice(3) || [])) fail(`${label}: 세로셈 단계가 독립 계산과 다릅니다.`);
    if (generated?.generator !== generatorKey || generated?.sourceItemId !== sourceItemId || generated?.generationMode !== "fixed-verified-pool" || generated?.verifiedVariantCount !== 3) fail(`${label}: 생성기 공개 계약이 다릅니다.`);
    if (attr(generated.prompt, "data-source61-division-phase") !== "problem" || attr(generated.answerVisual, "data-source61-division-phase") !== "answer" || attr(generated.prompt, "data-pool") !== attr(generated.answerVisual, "data-pool")) fail(`${label}: 문제와 답의 세로셈 자료가 다릅니다.`);
    if ((generated.prompt.match(/is-symbol/g) || []).length !== 13 || generated.prompt.includes("is-solved")) fail(`${label}: 문제의 기호 자리 13개가 정확하지 않습니다.`);
    if ((generated.answerVisual.match(/is-symbol/g) || []).length || !generated.answerVisual.includes("is-solved") || !generated.answerVisual.includes(`data-answer-source="${sourceItemId}"`)) fail(`${label}: 답 세로셈이 같은 자리를 모두 채우지 않았습니다.`);
    if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내가 없습니다.`);
    if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 추가 안내가 섞였습니다.`);
    if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움의 설명 요구가 없습니다.`);
    if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt} ${generated.answer} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
    checked += 1;
  }
  if (seenPools.size !== 3) fail(`난이도 ${difficulty}: 세 고정 문항이 모두 생성되지 않았습니다.`);
}

if (failures.length) {
  console.error(`6-1 소수의 나눗셈 E1 Mission 4 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`6-1 소수의 나눗셈 E1 Mission 4 감사 통과: ${checked.toLocaleString()}회 · 3문항×3난이도 · 독립 계산·단일 정답·문제/답 같은 자리·13개 기호 확인`);
