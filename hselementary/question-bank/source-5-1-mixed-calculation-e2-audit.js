"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-1-mixed-calculation.json"), "utf8"));
const failures = [];
let checked = 0;
const e2Ids = new Set(inventory.items.filter(item => item.exploration === 2).map(item => item.sourceItemId));
const sourceById = new Map(inventory.items.map(item => [item.sourceItemId, item]));
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u1");
const unitTypes = unit?.subunits.flatMap(subunit => subunit.types) || [];
const types = unit?.subunits.find(subunit => subunit.name === "하나의 식으로 나타내기")?.types || [];

const fail = (type, difficulty, seed, message) => failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${message}`);
const isNatural = value => Number.isInteger(value) && value > 0;
const attributes = prompt => {
  const match = String(prompt).match(/data-mixed-kind="([^"]+)"\s+data-values="([^"]+)"/);
  if (!match) throw new Error("data-mixed-kind 또는 data-values가 없습니다.");
  return { kind: match[1], values: match[2] };
};
const integers = value => String(value).split(",").map(part => Number(part));
const answerNumber = answer => Number(String(answer).replace(/[^0-9-]/g, ""));

if (unitTypes.length !== 45 || inventory.items.length !== 45) failures.push("5-1 1단원은 45유형이어야 합니다.");
const e4Types = unitTypes.filter(type => type.sourceItemId.startsWith("5-1-u1-e4-"));
if (e4Types.length !== 12 || e4Types.some(type => type.reviewLocked || api.generatorKey(type) !== "mixedCalculationE4" || !inventory.resultContracts[type.sourceItemId])) failures.push("개념탐구 4 생성기 또는 답 형식 연결이 다릅니다.");

function calculate(kind, values) {
  if (kind === "e2-reverse-halves") {
    const [last, secondExtra, firstExtra] = integers(values);
    return { answer: ((last + secondExtra) * 2 + firstExtra) * 2, numbers: [last, secondExtra, firstExtra] };
  }
  if (kind === "e2-distribute-balls") {
    const [prepared, totalPeople, firstPeople, firstEach, secondEach] = integers(values);
    const secondPeople = totalPeople - firstPeople;
    return { answer: prepared - (firstPeople * firstEach + secondPeople * secondEach), numbers: [prepared, totalPeople, firstPeople, secondPeople, firstEach, secondEach] };
  }
  if (kind === "e2-union") {
    const [total, first, second, overlap] = integers(values);
    return { answer: total - (first + second - overlap), numbers: [total, first, second, overlap], union: first + second - overlap };
  }
  if (kind === "e2-factory") {
    const [firstWorkers, firstHours, firstBags, secondWorkers, secondHours, secondBags, compareWorkers, compareHours] = integers(values);
    const firstUnit = firstBags / (firstWorkers * firstHours);
    const secondUnit = secondBags / (secondWorkers * secondHours);
    const firstCompare = firstUnit * compareWorkers * compareHours;
    const secondCompare = secondUnit * compareWorkers * compareHours;
    return { answer: `${firstCompare > secondCompare ? "가" : "나"} 공장, ${Math.abs(firstCompare - secondCompare)}개`, numbers: [firstWorkers, firstHours, firstBags, secondWorkers, secondHours, secondBags, compareWorkers, compareHours, firstUnit, secondUnit, firstCompare, secondCompare] };
  }
  if (kind === "e2-shipping") {
    const [weightText, terms] = String(values).split(";");
    const weightGroups = integers(weightText);
    const [freeWeight, step, price] = integers(terms);
    if (weightGroups.length !== 8) throw new Error("배송 물건은 무게와 개수 네 묶음이어야 합니다.");
    const total = weightGroups.reduce((sum, value, index) => index % 2 === 0 ? sum + value * weightGroups[index + 1] : sum, 0);
    return { answer: (total - freeWeight) / step * price, numbers: [...weightGroups, freeWeight, step, price, total], extraWeight: total - freeWeight };
  }
  if (kind === "e2-change") {
    const [paid, singlePrice, singleCount, bundlePrice, bundleCount, bundleAmount] = integers(values);
    return { answer: paid - (singlePrice * singleCount + bundlePrice / bundleCount * bundleAmount), numbers: [paid, singlePrice, singleCount, bundlePrice, bundleCount, bundleAmount] };
  }
  if (kind === "e2-fruit-multiple") {
    const [orangesPerBox, orangeBoxes, discarded, applesPerBox, appleBoxes] = integers(values);
    const oranges = orangesPerBox * orangeBoxes - discarded;
    const apples = applesPerBox * appleBoxes;
    return { answer: oranges / apples, numbers: [orangesPerBox, orangeBoxes, discarded, applesPerBox, appleBoxes, oranges, apples] };
  }
  if (kind === "e2-basket") {
    const [light, heavy, initialCount, extraCount] = integers(values);
    const bread = (heavy - light) / extraCount;
    return { answer: light - initialCount * bread, numbers: [light, heavy, initialCount, extraCount, bread] };
  }
  if (kind === "e2-boat") {
    const [capacity, minutes, price, people, duration] = integers(values);
    return { answer: people / capacity * (duration / minutes) * price, numbers: [capacity, minutes, price, people, duration] };
  }
  if (kind === "e2-tape-perimeter") {
    const [length, width, overlap, count, overlapCount, totalLength] = integers(values);
    const segments = Array.from({ length: count }, (_, index) => ({ start: index * (length - overlap), end: index * (length - overlap) + length }));
    const calculatedLength = segments.at(-1).end;
    return { answer: 2 * (calculatedLength + width), numbers: [length, width, overlap, count, overlapCount, totalLength, calculatedLength], segments };
  }
  throw new Error(`알 수 없는 원문 구조 ${kind}`);
}

if (types.length !== 11) failures.push(`개념탐구 2 유형은 11개여야 하나 ${types.length}개입니다.`);
const readyTypes = types.filter(type => !type.reviewLocked && api.generatorKey(type) === "mixedCalculationE2");
const lockedTypes = types.filter(type => type.reviewLocked || !api.generatorKey(type));
if (readyTypes.length !== 10 || lockedTypes.length !== 1) failures.push(`개념탐구 2는 공개 10개·잠금 1개여야 하나 ${readyTypes.length}, ${lockedTypes.length}개입니다.`);

const sourceAnswers = [
  ((120 + 280) * 2 + 150) * 2,
  200 - (21 * 5 + (38 - 21) * 4),
  45 - (8 + 12 - 4),
  `나 공장, ${154 / 7 * 16 - 216 / (3 * 4) * 16}개`,
  (320 * 6 + 160 * 4 + 840 * 3 + 1240 * 3 - 7000) / 100 * 500,
  10000 - (600 * 4 + 6000 / 5 * 6),
  (25 * 24 - 40) / (16 * 5),
  800 - (1340 - 800) / 6 * 8,
  20 / 4 * (90 / 15) * 2000,
  (30 * 17 - 3 * 16 + 5) * 2
];
const expectedSourceAnswers = [1900, 27, 29, "나 공장, 64개", 9000, 400, 7, 80, 60000, 934];
if (JSON.stringify(sourceAnswers) !== JSON.stringify(expectedSourceAnswers)) failures.push(`원문 기준값 재계산이 다릅니다: ${JSON.stringify(sourceAnswers)}`);
for (const type of types) {
  const source = sourceById.get(type.sourceItemId);
  if (!source || !e2Ids.has(type.sourceItemId)) failures.push(`${type.id}: 개념탐구 2 원문 분류표 연결이 없습니다.`);
  if (type.variant === 7) {
    if (!type.reviewLocked || api.generatorKey(type)) failures.push(`${type.id}: Mission 3은 잠금이고 생성기 연결이 없어야 합니다.`);
    continue;
  }
  if (type.reviewLocked || api.generatorKey(type) !== "mixedCalculationE2") failures.push(`${type.id}: 공개 생성기 연결이 다릅니다.`);
  if (!inventory.resultContracts[type.sourceItemId]) failures.push(`${type.id}: 답 형식 계약이 없습니다.`);
}

for (const type of readyTypes) {
  for (const difficulty of [-1, 0, 1]) {
    const distinctAnswers = new Set();
    const distinctPrompts = new Set();
    for (let seed = 1; seed <= 500; seed += 1) {
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
        const { kind, values } = attributes(generated.prompt);
        const calculated = calculate(kind, values);
        if (!calculated.numbers.every(isNatural)) throw new Error("양의 자연수가 아닌 조건값이 있습니다.");
        if (!isNatural(typeof calculated.answer === "number" ? calculated.answer : answerNumber(calculated.answer))) throw new Error("정답이 양의 자연수가 아닙니다.");
        if (kind === "e2-distribute-balls" && calculated.answer < 0) throw new Error("남은 공이 음수입니다.");
        if (kind === "e2-union") {
          const [, first, second, overlap] = integers(values);
          if (overlap > first || overlap > second || calculated.union > integers(values)[0]) throw new Error("두 활동의 겹치는 수 또는 합친 수 조건이 맞지 않습니다.");
        }
        if (kind === "e2-factory") {
          const n = calculated.numbers;
          if (!Number.isInteger(n[8]) || !Number.isInteger(n[9]) || n[8] === n[9] || n[10] === n[11]) throw new Error("공장 단위 생산량 또는 비교 답이 유일하지 않습니다.");
        }
        if (kind === "e2-shipping" && calculated.extraWeight % 100 !== 0) throw new Error("배송 초과 무게가 100g의 배수가 아닙니다.");
        if (kind === "e2-change") {
          const [, , , bundlePrice, bundleCount] = integers(values);
          if (bundlePrice % bundleCount !== 0) throw new Error("묶음 가격이 낱개 가격으로 나누어떨어지지 않습니다.");
        }
        if (kind === "e2-fruit-multiple") {
          const n = calculated.numbers;
          if (n[5] % n[6] !== 0) throw new Error("남은 귤 수가 사과 수의 자연수 배가 아닙니다.");
        }
        if (kind === "e2-basket" && !Number.isInteger(calculated.numbers.at(-1))) throw new Error("빵 한 개 무게가 자연수가 아닙니다.");
        if (kind === "e2-boat") {
          const [capacity, minutes, , people, duration] = integers(values);
          if (people % capacity || duration % minutes) throw new Error("오리배 인원 또는 시간이 묶음 단위로 나누어떨어지지 않습니다.");
        }
        if (kind === "e2-tape-perimeter") {
          const [length, width, overlap, count, overlapCount, totalLength] = integers(values);
          if (!(0 < overlap && overlap < length) || count - 1 !== overlapCount || calculated.segments.length !== count || calculated.segments.at(-1).end !== totalLength || !isNatural(width)) throw new Error("테이프 점·선분 모델 또는 겹친 곳 조건이 맞지 않습니다.");
          if (!/data-tape-model=/.test(generated.prompt)) throw new Error("테이프 그림 모델 속성이 없습니다.");
        }
        if (String(generated.answer).replaceAll(" ", "") !== String(typeof calculated.answer === "number" ? (kind === "e2-fruit-multiple" ? `${calculated.answer}배` : ["e2-shipping", "e2-change", "e2-boat"].includes(kind) ? `${calculated.answer}원` : ["e2-basket", "e2-tape-perimeter"].includes(kind) ? `${calculated.answer}${kind === "e2-basket" ? "g" : "cm"}` : calculated.answer) : calculated.answer).replaceAll(" ", "")) throw new Error(`독립 계산 답 ${calculated.answer}과 생성 답 ${generated.answer}이 다릅니다.`);
        distinctAnswers.add(String(generated.answer));
        distinctPrompts.add(String(generated.prompt));
        checked += 1;
      } catch (error) {
        fail(type, difficulty, seed, error.message);
      }
    }
    if (distinctAnswers.size < 8 || distinctPrompts.size < 40) failures.push(`${type.id} / 난이도 ${difficulty}: 답 또는 문제 다양성이 부족합니다. 답 ${distinctAnswers.size}개, 문제 ${distinctPrompts.size}개`);
  }
}

if (failures.length) {
  console.error(`5-1 자연수의 혼합 계산 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`5-1 자연수의 혼합 계산 개념탐구 2 감사 통과: 공개 10유형 · Mission 3 잠금 · ${checked.toLocaleString()}회 독립 계산·전수 검사`);
