"use strict";

// E8 is intentionally audited before it is connected to the live catalog.
// The evidence contract below is the small, numeric interface the generator must expose.
const fs = require("node:fs");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventoryPath = "hselementary/question-bank/source-inventory/5-1-unit-2-factor-multiple.json";
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u2");
const types = unit?.subunits.flatMap(item => item.types) || [];
const expectedIds = [
  "5-1-u2-e8-exploration",
  "5-1-u2-e8-example-8-1",
  "5-1-u2-e8-example-8-2",
  "5-1-u2-e8-example-8-3",
  "5-1-u2-e8-example-8-4",
  "5-1-u2-e8-mission-1",
  "5-1-u2-e8-mission-2",
  "5-1-u2-e8-mission-3",
  "5-1-u2-e8-mission-4",
  "5-1-u2-e8-mission-5",
  "5-1-u2-e8-mission-6"
];
const contracts = {
  "5-1-u2-e8-exploration": "ordered",
  "5-1-u2-e8-example-8-1": "set",
  "5-1-u2-e8-example-8-2": "single-value",
  "5-1-u2-e8-example-8-3": "single-value",
  "5-1-u2-e8-example-8-4": "single-value",
  "5-1-u2-e8-mission-1": "single-value",
  "5-1-u2-e8-mission-2": "single-value",
  "5-1-u2-e8-mission-3": "set",
  "5-1-u2-e8-mission-4": "ordered",
  "5-1-u2-e8-mission-5": "single-value"
};
const sourceAnchors = {
  "5-1-u2-e8-exploration": { kind: "closest-pair-from-product-gcd", values: [1200, 5], answer: "15,80,240" },
  "5-1-u2-e8-example-8-1": { kind: "all-sums-from-gcd-lcm", values: [6, 72], answer: "42,78" },
  "5-1-u2-e8-example-8-2": { kind: "common-divisor-sum-from-product-lcm", values: [2700, 180], answer: "24" },
  "5-1-u2-e8-example-8-3": { kind: "larger-from-gcd-lcm-difference", values: [15, 90, 15], answer: "45" },
  "5-1-u2-e8-example-8-4": { kind: "third-from-linked-gcd-lcm", values: [15, 75, 450, 1050], answer: "105" },
  "5-1-u2-e8-mission-1": { kind: "other-number-from-known-gcd-lcm", values: [70, 14, 420], answer: "84" },
  "5-1-u2-e8-mission-2": { kind: "rectangle-side-from-gcd-lcm", values: [30, 6, 210], answer: "42" },
  "5-1-u2-e8-mission-3": { kind: "all-sums-from-gcd-lcm", values: [32, 192], answer: "160,224" },
  "5-1-u2-e8-mission-4": { kind: "ordered-pair-from-gcd-lcm-difference", values: [5, 75, 10], answer: "25,15" },
  "5-1-u2-e8-mission-5": { kind: "three-number-sum-from-linked-pairs", values: [14, 84, 21, 126], answer: "133" }
};
const failures = [];
let checked = 0;

const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const lcm = (left, right) => Math.abs(left * right) / gcd(left, right);
const normalized = value => String(value).replaceAll(" ", "");
const fail = message => failures.push(message);

function calculate(kind, values) {
  if (!values.every(Number.isFinite)) throw new Error("계산 태그에 숫자가 아닌 값이 있습니다.");
  const factorPairs = value => Array.from({ length: value }, (_, index) => index + 1)
    .filter(left => left <= value / left && value % left === 0 && gcd(left, value / left) === 1)
    .map(left => [left, value / left]);
  if (kind === "closest-pair-from-product-gcd") {
    if (values.length !== 2) throw new Error("곱과 최대공약수 조건이 필요합니다.");
    const [product, greatest] = values;
    const reducedProduct = product / (greatest * greatest);
    const pairs = factorPairs(reducedProduct).sort((left, right) => (left[1] - left[0]) - (right[1] - right[0]));
    if (!pairs.length || product % (greatest * greatest) !== 0) throw new Error("서로소인 두 수의 짝을 찾을 수 없습니다.");
    return `${greatest * pairs[0][0]},${greatest * pairs[0][1]},${greatest * reducedProduct}`;
  }
  if (kind === "all-sums-from-gcd-lcm") {
    if (values.length !== 2) throw new Error("최대공약수와 최소공배수 조건이 필요합니다.");
    const [greatest, least] = values;
    const reducedLeast = least / greatest;
    return factorPairs(reducedLeast).map(([left, right]) => greatest * (left + right)).sort((left, right) => left - right).join(",");
  }
  if (kind === "common-divisor-sum-from-product-lcm") {
    if (values.length !== 2 || values[1] === 0 || values[0] % values[1] !== 0) throw new Error("곱과 최소공배수 조건이 맞지 않습니다.");
    const greatest = values[0] / values[1];
    return String(Array.from({ length: greatest }, (_, index) => index + 1).filter(value => greatest % value === 0).reduce((sum, value) => sum + value, 0));
  }
  if (kind === "larger-from-gcd-lcm-difference") {
    if (values.length !== 3) throw new Error("최대공약수·최소공배수·차 조건이 필요합니다.");
    const [greatest, least, difference] = values;
    const reducedProduct = least / greatest;
    const candidates = factorPairs(reducedProduct).filter(([left, right]) => greatest * (right - left) === difference);
    if (candidates.length !== 1) throw new Error("큰 수가 하나로 정해지지 않습니다.");
    return String(greatest * candidates[0][1]);
  }
  if (kind === "third-from-linked-gcd-lcm") {
    if (values.length !== 4) throw new Error("세 수의 연결된 조건이 필요합니다.");
    const [tripleGreatest, firstSecondGreatest, firstSecondLeast, secondThirdLeast] = values;
    const pairCandidates = Array.from({ length: firstSecondLeast + 1 }, (_, value) => value)
      .filter(first => first > 0 && first % firstSecondGreatest === 0 && firstSecondLeast % first === 0)
      .flatMap(first => Array.from({ length: firstSecondLeast + 1 }, (_, second) => second)
        .filter(second => second > 0 && first > second && gcd(first, second) === firstSecondGreatest && lcm(first, second) === firstSecondLeast)
        .map(second => [first, second]));
    const candidates = pairCandidates.flatMap(([first, second]) => Array.from({ length: secondThirdLeast + 1 }, (_, third) => third)
      .filter(third => third > 0 && second > third && lcm(second, third) === secondThirdLeast && gcd(gcd(first, second), third) === tripleGreatest)
      .map(third => ({ first, second, third })));
    if (candidates.length !== 1) throw new Error(`다시 구한 세 수 후보가 ${candidates.length}개입니다.`);
    return String(candidates[0].third);
  }
  if (kind === "other-number-from-known-gcd-lcm") {
    if (values.length !== 3 || values[0] === 0) throw new Error("알려진 수와 최대공약수·최소공배수 조건이 필요합니다.");
    const other = values[1] * values[2] / values[0];
    if (!Number.isInteger(other) || gcd(values[0], other) !== values[1] || lcm(values[0], other) !== values[2]) throw new Error("알려진 수와 계산한 수가 최대공약수·최소공배수 조건을 만족하지 않습니다.");
    return String(other);
  }
  if (kind === "rectangle-side-from-gcd-lcm") {
    if (values.length !== 3 || values[0] === 0) throw new Error("직사각형 조건이 필요합니다.");
    const other = values[1] * values[2] / values[0];
    if (!Number.isInteger(other) || gcd(values[0], other) !== values[1] || lcm(values[0], other) !== values[2]) throw new Error("직사각형 두 변이 최대공약수·최소공배수 조건을 만족하지 않습니다.");
    return String(other);
  }
  if (kind === "ordered-pair-from-gcd-lcm-difference") {
    if (values.length !== 3) throw new Error("순서 있는 두 수 조건이 필요합니다.");
    const [greatest, least, difference] = values;
    const pair = factorPairs(least / greatest).find(([left, right]) => greatest * (right - left) === difference);
    if (!pair) throw new Error("순서 있는 두 수를 찾을 수 없습니다.");
    return `${greatest * pair[1]},${greatest * pair[0]}`;
  }
  if (kind === "three-number-sum-from-linked-pairs") {
    if (values.length !== 4) throw new Error("세 수의 두 연결 조건이 필요합니다.");
    const [firstSecondGreatest, firstSecondLeast, secondThirdGreatest, secondThirdLeast] = values;
    const candidates = [];
    for (let second = 1; second <= Math.max(firstSecondLeast, secondThirdLeast); second += 1) {
      for (let first = 1; first <= firstSecondLeast; first += 1) {
        if (gcd(first, second) !== firstSecondGreatest || lcm(first, second) !== firstSecondLeast) continue;
        for (let third = 1; third <= secondThirdLeast; third += 1) {
          if (gcd(second, third) === secondThirdGreatest && lcm(second, third) === secondThirdLeast) candidates.push([first, second, third]);
        }
      }
    }
    if (candidates.length !== 1) throw new Error(`이어진 두 쌍을 만족하는 세 수가 ${candidates.length}개입니다.`);
    return String(candidates[0].reduce((sum, value) => sum + value, 0));
  }
  throw new Error(`알 수 없는 E8 계산 종류 ${kind}`);
}

function evidence(prompt) {
  const match = prompt.match(/data-factor-multiple-e8-kind="([^"\\]+)" data-factor-multiple-e8-values="([^"\\]*)" data-result-contract="([^"\\]+)"/);
  if (!match) throw new Error("독립 계산용 E8 태그가 없습니다.");
  const values = match[2].split(",").filter(Boolean).map(Number);
  return { kind: match[1], values, contract: match[3] };
}

function checkContract(id, answer, contract) {
  const text = normalized(answer);
  const values = text.split(",").filter(Boolean);
  if (contract === "single-value" && values.length !== 1) throw new Error("한 값 계약인데 여러 값이 나왔습니다.");
  if ((contract === "ordered" || contract === "set") && values.length < 2) throw new Error("여러 값 답 계약인데 값이 하나뿐입니다.");
  if (contract === "set" && new Set(values).size !== values.length) throw new Error("집합 답에 중복값이 있습니다.");
  if (contract === "ordered" && id.endsWith("exploration") && values.length !== 3) throw new Error("exploration 순서 답은 세 값이어야 합니다.");
  if (contract === "ordered" && id.endsWith("mission-4") && values.length !== 2) throw new Error("Mission 4 순서 답은 두 값이어야 합니다.");
}

if (!unit) fail("5-1 약수와 배수 단원을 찾을 수 없습니다.");
if (types.length !== 96) fail(`5-1 약수와 배수 유형 수가 96이 아닙니다: ${types.length}`);
const e8 = expectedIds.map(id => types.find(type => type.sourceItemId === id));
if (e8.some(type => !type)) fail("E8 11개 유형 ID가 모두 원장에 연결되지 않았습니다.");
const ready = e8.filter(type => type && !type.reviewLocked);
const locked = e8.filter(type => type && type.reviewLocked);
if (ready.length !== 10 || locked.length !== 1 || locked[0]?.variant !== 10) fail("E8는 공개 10개, Mission 6(variant 10) 잠금 1개여야 합니다.");
if (e8.some((type, index) => type && type.variant !== index)) fail("E8 variant 순서가 exploration부터 Mission 6까지 0~10과 다릅니다.");
if (Object.values(contracts).length !== 10) fail("공개 10개 답 계약 정의가 누락되었습니다.");

for (const [id, anchor] of Object.entries(sourceAnchors)) {
  try {
    const calculated = calculate(anchor.kind, anchor.values);
    if (normalized(calculated) !== normalized(anchor.answer)) fail(`${id}: 원문 기준 독립 계산값 ${calculated}이 예상 답 ${anchor.answer}과 다릅니다.`);
  } catch (error) {
    fail(`${id}: 원문 기준 계산 실패: ${error.message}`);
  }
}
const enumeratedLocked = [];
for (let second = 1; second <= 210; second += 1) {
  if (210 % second !== 0) continue;
  const first = 210 / second;
  for (let third = 1; third <= 150; third += 1) {
    if (gcd(second, third) === 10 && lcm(second, third) === 150) enumeratedLocked.push([first, second, third].join(","));
  }
}
enumeratedLocked.sort();
if (enumeratedLocked.length !== 2 || enumeratedLocked[0] !== "21,10,150" || enumeratedLocked[1] !== "7,30,50") {
  fail("Mission 6의 두 후보 전수 열거 결과가 7,30,50과 21,10,150이 아닙니다.");
}

for (const type of ready) {
  const id = type.sourceItemId;
  const item = inventory.items.find(entry => entry.sourceItemId === id);
  if (!type.sourceVerified) fail(`${id}: 원문 확인 표시가 없습니다.`);
  if (api.generatorKey(type) !== "factorMultipleE8") fail(`${id}: factorMultipleE8 생성기 연결이 없습니다.`);
  if (!item || item.implementationStatus !== "ready") fail(`${id}: 원장 공개 상태가 ready가 아닙니다.`);
  if (inventory.resultContracts[id] !== contracts[id]) fail(`${id}: 원장 답 계약이 ${contracts[id]}이 아닙니다.`);
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
        const { kind, values, contract } = evidence(generated.prompt);
        const calculated = calculate(kind, values);
        if (contract !== contracts[id]) throw new Error(`숨은 답 계약 ${contract}가 원장 계약 ${contracts[id]}과 다릅니다.`);
        if (normalized(generated.answer) !== normalized(calculated)) throw new Error(`독립 계산값 ${calculated}과 정답 ${generated.answer}이 다릅니다.`);
        checkContract(id, generated.answer, contract);
        if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("쉬움 문항에 풀이 실마리가 없습니다.");
        if (difficulty === 0 && (generated.prompt.includes("풀이 도움:") || generated.prompt.includes("다시 확인하세요."))) throw new Error("같게 문항에 난이도 안내가 섞였습니다.");
        if (difficulty === 1 && !generated.prompt.includes("다시 확인하세요.")) throw new Error("어려움 문항에 조건 재확인 문구가 없습니다.");
        if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt} ${generated.solution}`)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
        checked += 1;
      } catch (error) {
        fail(`${id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}
for (const type of locked) {
  if (api.generatorKey(type)) fail(`${type.sourceItemId}: 잠금 유형이 생성기에 연결되어 있습니다.`);
  if (!type.reviewLocked || !type.reviewReason) fail(`${type.sourceItemId}: 잠금 상태 또는 사유가 없습니다.`);
  const item = inventory.items.find(entry => entry.sourceItemId === type.sourceItemId);
  if (!item || item.implementationStatus !== "review-locked") fail(`${type.sourceItemId}: 원장 잠금 상태가 아닙니다.`);
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 8 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 8 감사 통과: 원문 11항목 · 공개 10/잠금 1 · ${checked.toLocaleString()}회 독립 계산·답 계약·단일성 검사`);
