"use strict";

const fs = require("node:fs");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync("hselementary/question-bank/source-inventory/5-1-unit-2-factor-multiple.json", "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u2");
const types = unit.subunits.flatMap(item => item.types);
const e5 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e5-"));
const ready = e5.filter(type => !type.reviewLocked);
const locked = e5.filter(type => type.reviewLocked);
const failures = [];
let checked = 0;

const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const lcm = (left, right) => Math.abs(left * right) / gcd(left, right);
const gcdMany = values => values.reduce(gcd);
const lcmMany = values => values.reduce(lcm);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const normalized = value => String(value).replaceAll(" ", "").replaceAll(",", ",");
const ordered = values => values.join(",");
const set = values => [...values].sort((left, right) => left - right).join(",");

function evidence(prompt) {
  const match = prompt.match(/data-factor-multiple-e5-kind="([^"]+)" data-factor-multiple-e5-values="([^"]*)" data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 계산용 값 태그가 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number), contract: match[3] };
}

function expected(prompt) {
  const { kind, values, contract } = evidence(prompt);
  if (kind.includes("product-three-gcd-lcm")) {
    const numbers = [values[0] * values[1], values[2] * values[3], values[4] * values[5]];
    return { contract, value: ordered([gcdMany(numbers), lcmMany(numbers)]) };
  }
  if (kind.includes("three-gcd-lcm")) return { contract, value: ordered([gcdMany(values), lcmMany(values)]) };
  if (kind === "scaled-three-number-sum") {
    const [first, second, third, least] = values;
    const scale = least / lcmMany([first, second, third]);
    return { contract, value: String((first + second + third) * scale) };
  }
  if (kind === "largest-divisible-tail") {
    const [prefix, ...divisors] = values;
    return { contract, value: String(range(100, 999).filter(tail => (prefix * 1000 + tail) % lcmMany(divisors) === 0).at(-1)) };
  }
  if (kind === "nearest-same-remainder") {
    const [first, second, third, remainder, target] = values;
    const base = lcmMany([first, second, third]);
    const lower = remainder + Math.floor((target - remainder) / base) * base;
    const upper = lower + base;
    if (target - lower === upper - target) throw new Error("가장 가까운 후보가 둘입니다.");
    return { contract, value: String(target - lower < upper - target ? lower : upper) };
  }
  if (kind === "smallest-four-digit-common-multiple") {
    const base = lcmMany(values);
    return { contract, value: String(Math.ceil(1000 / base) * base) };
  }
  if (kind === "bounded-even-same-remainder-set") {
    const [lower, upper, first, second, remainder] = values;
    return { contract, value: set(range(lower + 1, upper - 1).filter(value => value % 2 === 0 && value % first === remainder && value % second === remainder)) };
  }
  if (kind === "all-divisible-three-digit-tails") {
    const [prefix, ...divisors] = values;
    return { contract, value: set(range(100, 999).filter(tail => (prefix * 1000 + tail) % lcmMany(divisors) === 0)) };
  }
  throw new Error(`알 수 없는 E5 유형 ${kind}`);
}

const sourceAnswers = {
  "5-1-u2-e5-exploration": "14,1260",
  "5-1-u2-e5-example-5-1-1": "6,51480",
  "5-1-u2-e5-example-5-1-2": "4,26460",
  "5-1-u2-e5-example-5-2": "225",
  "5-1-u2-e5-example-5-3": "924",
  "5-1-u2-e5-mission-1-1": "12,720",
  "5-1-u2-e5-mission-1-2": "14,840",
  "5-1-u2-e5-mission-1-3": "6,6300",
  "5-1-u2-e5-mission-2": "303",
  "5-1-u2-e5-mission-3": "1260",
  "5-1-u2-e5-mission-4": "128,170",
  "5-1-u2-e5-mission-5": "100,280,460,640,820"
};
const sourceComputed = {
  "5-1-u2-e5-exploration": ordered([gcdMany([84, 70, 126]), lcmMany([84, 70, 126])]),
  "5-1-u2-e5-example-5-1-1": ordered([gcdMany([156, 330, 360]), lcmMany([156, 330, 360])]),
  "5-1-u2-e5-example-5-1-2": ordered([gcdMany([108, 196, 180]), lcmMany([108, 196, 180])]),
  "5-1-u2-e5-example-5-2": String(60 + 75 + 90),
  "5-1-u2-e5-example-5-3": String(range(100, 999).filter(tail => (378000 + tail) % lcmMany([4, 6, 7]) === 0).at(-1)),
  "5-1-u2-e5-mission-1-1": ordered([gcdMany([48, 72, 180]), lcmMany([48, 72, 180])]),
  "5-1-u2-e5-mission-1-2": ordered([gcdMany([140, 210, 168]), lcmMany([140, 210, 168])]),
  "5-1-u2-e5-mission-1-3": ordered([gcdMany([126, 420, 300]), lcmMany([126, 420, 300])]),
  "5-1-u2-e5-mission-2": String(303),
  "5-1-u2-e5-mission-3": String(Math.ceil(1000 / lcmMany([21, 35, 63])) * lcmMany([21, 35, 63])),
  "5-1-u2-e5-mission-4": set(range(101, 199).filter(value => value % 2 === 0 && value % 3 === 2 && value % 7 === 2)),
  "5-1-u2-e5-mission-5": set(range(100, 999).filter(tail => (56789000 + tail) % lcmMany([4, 5, 9]) === 0))
};

if (types.length !== 96 || e5.length !== 14 || ready.length !== 12 || locked.length !== 2) failures.push("원문 96유형 중 E5 공개 12·잠금 2 구성이 다릅니다.");
if (types.filter(type => !type.reviewLocked).length !== 91 || types.filter(type => type.reviewLocked).length !== 5) failures.push("단원 공개 91·잠금 5 구성이 다릅니다.");
for (const type of ready) {
  if (!type.sourceVerified || api.generatorKey(type) !== "factorMultipleE5") failures.push(`${type.sourceItemId}: 원문·생성기 연결이 다릅니다.`);
  if (inventory.resultContracts[type.sourceItemId] === undefined) failures.push(`${type.sourceItemId}: 답 형식 계약이 없습니다.`);
  if (inventory.items.find(item => item.sourceItemId === type.sourceItemId)?.implementationStatus !== "ready") failures.push(`${type.sourceItemId}: 원장 공개 상태가 다릅니다.`);
}
for (const type of locked) {
  if (api.generatorKey(type)) failures.push(`${type.sourceItemId}: 답이 하나가 아닌 항목이 생성기에 연결되었습니다.`);
  if (!type.reviewReason.includes("하나로 정해지지")) failures.push(`${type.sourceItemId}: 수학적 잠금 사유가 없습니다.`);
}

for (const [id, answer] of Object.entries(sourceAnswers)) if (sourceComputed[id] !== answer) failures.push(`${id}: 원문 독립 계산값이 다릅니다.`);

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
        const recalculated = expected(generated.prompt);
        if (inventory.resultContracts[type.sourceItemId] !== recalculated.contract) throw new Error("답 형식 계약이 다릅니다.");
        if (normalized(generated.answer) !== normalized(recalculated.value)) throw new Error(`독립 계산값 ${recalculated.value}과 정답 ${generated.answer}이 다릅니다.`);
        if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(`${generated.prompt} ${generated.solution}`)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
        checked += 1;
      } catch (error) {
        failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`5-1 약수와 배수 개념탐구 5 감사 실패: ${failures.length}건\n${failures.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 5 감사 통과: 원문 14항목 · 공개 12/잠금 2 · ${checked.toLocaleString()}회 독립 계산·단일 답 검사`);
