"use strict";

const fs = require("node:fs");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync("hselementary/question-bank/source-inventory/5-1-unit-2-factor-multiple.json", "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u2");
const types = unit.subunits.flatMap(item => item.types);
const e6 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e6-"));
const failures = [];
let checked = 0;

const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const lcm = (left, right) => Math.abs(left * right) / gcd(left, right);
const lcmMany = values => values.reduce(lcm);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const normalized = value => String(value).replaceAll(" ", "").replaceAll(",", "");
const clockText = totalMinutes => {
  const minutes = ((totalMinutes % 1440) + 1440) % 1440;
  const period = minutes < 720 ? "오전" : "오후";
  const hour = Math.floor(minutes / 60) % 12 || 12;
  return `${period}${hour}시${minutes % 60}분`;
};

function evidence(prompt) {
  const match = prompt.match(/data-factor-multiple-e6-kind="([^"]+)" data-factor-multiple-e6-values="([^"]*)" data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 계산용 값 태그가 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number), contract: match[3] };
}

function expected(prompt) {
  const { kind, values, contract } = evidence(prompt);
  if (kind === "three-light-off-events") {
    const [onA, offA, onB, offB, onC, offC, duration] = values;
    return { contract, value: String(Math.floor(duration / lcmMany([onA + offA, onB + offB, onC + offC]))) };
  }
  if (kind === "next-shared-departure") {
    const [first, second, start] = values;
    return { contract, value: clockText(start + lcm(first, second)) };
  }
  if (kind === "smallest-plus-minus-multiples") {
    const [plusDivisor, minusDivisor, offset] = values;
    const candidates = range(offset + 1, lcm(plusDivisor, minusDivisor) * 3 + offset)
      .filter(value => (value + offset) % plusDivisor === 0 && (value - offset) % minusDivisor === 0);
    if (!candidates.length) throw new Error("더하고 뺀 두 수가 배수인 자연수가 없습니다.");
    return { contract, value: String(candidates[0]) };
  }
  if (kind === "smallest-shared-shortage") {
    const [first, second, third, short] = values;
    return { contract, value: String(lcmMany([first, second, third]) - short) };
  }
  if (kind === "first-gear-return-turns") return { contract, value: String(lcmMany(values) / values[0]) };
  if (kind === "nearest-shared-shortage") {
    const [first, second, third, short, target] = values;
    const base = lcmMany([first, second, third]);
    const candidates = range(1, Math.ceil((target + base) / base) + 1).map(scale => scale * base - short).filter(value => value > 0);
    const distances = candidates.map(value => Math.abs(value - target));
    const minimum = Math.min(...distances);
    const nearest = candidates.filter((value, index) => distances[index] === minimum);
    if (nearest.length !== 1) throw new Error("기준값에 가장 가까운 수가 하나가 아닙니다.");
    return { contract, value: String(nearest[0]) };
  }
  if (kind === "fixed-six-digit-two-blanks") {
    const [prefix, last, first, second, remainder] = values;
    const candidates = range(10, 99).filter(blank => (prefix * 1000 + blank * 10 + last) % first === remainder && (prefix * 1000 + blank * 10 + last) % second === remainder);
    if (candidates.length !== 1) throw new Error("두 자리 빈칸 답이 하나가 아닙니다.");
    return { contract, value: String(candidates[0]) };
  }
  if (kind === "fixed-hundreds-plus-minus") {
    const [hundreds, plusDivisor, minusDivisor, offset] = values;
    const candidates = range(hundreds * 100, hundreds * 100 + 99).filter(value => (value + offset) % plusDivisor === 0 && (value - offset) % minusDivisor === 0);
    if (candidates.length !== 1) throw new Error("세 자리 수 답이 하나가 아닙니다.");
    return { contract, value: String(candidates[0]) };
  }
  if (kind === "shared-watering-weekday") {
    const [first, second, today] = values;
    return { contract, value: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][(today + lcm(first, second)) % 7] };
  }
  if (kind === "ratio-gears-third-turns") {
    const [ratioB, ratioC, totalLcm] = values;
    const firstTeeth = totalLcm / lcmMany([1, ratioB, ratioC]);
    return { contract, value: String(totalLcm / (firstTeeth * ratioC)) };
  }
  if (kind === "shared-train-departure-count") {
    const [first, second, third, start, end] = values;
    const interval = lcmMany([first, second, third]);
    if ((end - start) % interval !== 0 || end >= 1440) throw new Error("처음과 마지막 출발 시각 조건이 맞지 않습니다.");
    return { contract, value: String((end - start) / interval + 1) };
  }
  throw new Error(`알 수 없는 E6 유형 ${kind}`);
}

const sourceAnswers = [
  Math.floor(3600 / lcmMany([12, 16, 20])),
  clockText(624 + lcm(30, 18)),
  range(28, 300).find(value => (value + 27) % 30 === 0 && (value - 27) % 24 === 0),
  lcmMany([8, 7, 6]) - 2,
  lcmMany([84, 36, 12]) / 84,
  333,
  range(10, 99).filter(blank => (986000 + blank * 10 + 8) % 17 === 2 && (986000 + blank * 10 + 8) % 29 === 2).join(","),
  range(400, 499).filter(value => (value + 10) % 11 === 0 && (value - 10) % 9 === 0).join(","),
  ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"][(2 + lcm(6, 15)) % 7],
  144 / ((144 / lcmMany([1, 3, 4])) * 4),
  (1302 - 390) / lcmMany([16, 12, 8]) + 1
].map(normalized);
const expectedSourceAnswers = ["15", "오전11시54분", "123", "166", "3", "333", "98", "496", "목요일", "3", "20"];

if (types.length !== 96 || e6.length !== 11 || e6.some(type => type.reviewLocked)) failures.push("원문 96유형 중 E6 11유형이 모두 공개 상태여야 합니다.");
if (types.filter(type => !type.reviewLocked).length !== 91 || types.filter(type => type.reviewLocked).length !== 5) failures.push("단원 공개 91·잠금 5 구성이 다릅니다.");
if (inventory.items.filter(item => item.implementationStatus === "ready").length !== 91 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 5) failures.push("원장 공개 91·잠금 5 구성이 다릅니다.");
for (const type of e6) {
  if (!type.sourceVerified || api.generatorKey(type) !== "factorMultipleE6") failures.push(`${type.sourceItemId}: 원문·생성기 연결이 다릅니다.`);
  if (inventory.resultContracts[type.sourceItemId] !== "single-value") failures.push(`${type.sourceItemId}: 한 답 계약이 없습니다.`);
  if (inventory.items.find(item => item.sourceItemId === type.sourceItemId)?.implementationStatus !== "ready") failures.push(`${type.sourceItemId}: 원장 공개 상태가 다릅니다.`);
}
sourceAnswers.forEach((answer, index) => { if (answer !== expectedSourceAnswers[index]) failures.push(`원문 ${index + 1}번 독립 계산값 ${answer}이 예상값 ${expectedSourceAnswers[index]}과 다릅니다.`); });

for (const type of e6) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
        const recalculated = expected(generated.prompt);
        if (recalculated.contract !== "single-value") throw new Error("답 형식이 한 값이 아닙니다.");
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
  console.error(`5-1 약수와 배수 개념탐구 6 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 약수와 배수 개념탐구 6 감사 통과: 원문 11항목 · 공개 11/잠금 0 · ${checked.toLocaleString()}회 독립 계산·단일 답 검사`);
