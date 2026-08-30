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
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u1");
const types = unit?.subunits.find(item => item.name === "식 세워 풀기")?.types || [];
const e3Items = inventory.items.filter(item => item.exploration === 3);
const sourceAnswers = [
  3200 * 3 - 400,
  (5 * ((613 - 73) / (5 - 1)) + 73) + ((613 - 73) / (5 - 1)),
  (76 - 3 * (5 + 2)) / 5,
  100 * 30 / (250 - 100),
  (((6000 + 8000) * 2 - 9800) + 9400) / 3,
  (266 - 285 / 5 + (60 - 45)) / 56,
  24 / 6 * 4,
  (((1152 + 32) / 8) - 10) / 2,
  (422 - 30 * (140 / 10)) * 1000 / 40,
  8250 / (600 - 750 / 5 * 3),
  ((4 * 15 - 3 * 6) / 2) * (((4 * 15 - 3 * 6) / 2) + 6)
];

const natural = value => Number.isInteger(value) && value > 0;
const numberAnswer = answer => Number(String(answer).replace(/[^0-9-]/g, ""));
const fail = (type, difficulty, seed, message) => failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${message}`);
const attributes = prompt => {
  const match = String(prompt).match(/data-mixed-kind="([^"]+)"\s+data-values="([^"]+)"/);
  if (!match) throw new Error("data-mixed-kind 또는 data-values가 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number) };
};
const only = (candidates, message) => {
  if (candidates.length !== 1) throw new Error(`${message}: ${candidates.length}개`);
  return candidates[0];
};

function calculate(kind, values, prompt) {
  if (kind === "e3-price") {
    const [shoes, extra, discount, gap] = values;
    const answer = shoes * 3 - discount;
    if (answer !== shoes + extra + gap) throw new Error("세 물건 가격 관계가 일치하지 않습니다.");
    return answer;
  }
  if (kind === "e3-quotient-remainder") {
    const [difference, quotient, remainder] = values;
    const small = only(Array.from({ length: difference }, (_, index) => index + 1).filter(value => quotient * value + remainder - value === difference), "두 수 조건을 만족하는 작은 수");
    if (!(remainder > 0 && remainder < small)) throw new Error("나머지가 작은 수보다 작지 않습니다.");
    return small + quotient * small + remainder;
  }
  if (kind === "e3-age") {
    const [older, younger, grandmother] = values;
    if (older - younger !== 3) throw new Error("3살 어린 동생 조건이 아닙니다.");
    return only(Array.from({ length: grandmother + 1 }, (_, index) => index).filter(years => grandmother + years === 3 * (older + years + younger + years)), "나이 조건을 만족하는 해");
  }
  if (kind === "e3-chase") {
    const [headStart, walkingSpeed, bicycleSpeed] = values;
    return only(Array.from({ length: headStart * 4 + 1 }, (_, index) => index + 1).filter(minutes => walkingSpeed * (headStart + minutes) === bicycleSpeed * minutes), "추격 조건을 만족하는 시간");
  }
  if (kind === "e3-allowance") {
    const [last, current, lessFromSum, lessFromTriple] = values;
    const younghee = (last + current) * 2 - lessFromSum;
    return only(Array.from({ length: younghee + lessFromTriple }, (_, index) => index + 1).filter(junho => younghee === junho * 3 - lessFromTriple), "용돈 조건을 만족하는 준호의 용돈");
  }
  if (kind === "e3-reverse-expression") {
    const [multiplier, dividend, divisor, addend, subtractor, resultValue] = values;
    if (dividend % divisor) throw new Error("나눗셈이 자연수가 아닙니다.");
    if (addend <= subtractor) throw new Error("두 수의 차에서 앞 수가 뒤 수보다 크지 않습니다.");
    return only(Array.from({ length: resultValue + 1 }, (_, index) => index + 1).filter(value => multiplier * value + dividend / divisor - (addend - subtractor) === resultValue), "역산식을 만족하는 수");
  }
  if (kind === "e3-rectangle-square") {
    const [smallLong, smallShort, perimeter, side, rows, cols] = values;
    if (!(rows === 4 && cols === 2 && smallLong === smallShort * 2 && perimeter === 2 * (smallLong + smallShort) && side === smallLong * cols && side === smallShort * rows)) throw new Error("2열 4행 큰 정사각형 모델이 아닙니다.");
    const svg = String(prompt).match(/<svg\b[\s\S]*?<\/svg>/)?.[0] || "";
    for (const attribute of [`data-small-long="${smallLong}"`, `data-small-short="${smallShort}"`, `data-small-perimeter="${perimeter}"`, `data-big-side="${side}"`, `data-rows="4"`, `data-cols="2"`]) if (!svg.includes(attribute)) throw new Error(`Mission 2 SVG 모델 속성이 없습니다: ${attribute}`);
    if ((svg.match(/stroke-dasharray=/g) || []).length !== 4 || (svg.match(/<rect /g) || []).length !== 1 || !/aria-label=/.test(svg)) throw new Error("Mission 2 SVG의 실선·점선 또는 접근성 표시가 맞지 않습니다.");
    return side;
  }
  if (kind === "e3-students") {
    const [total, multiple, less, difference] = values;
    const fifth = (total + less) / multiple;
    if (!natural(fifth)) throw new Error("5학년 학생 수가 자연수가 아닙니다.");
    return only(Array.from({ length: fifth }, (_, index) => index + 1).filter(girls => girls + (girls + difference) === fifth), "학생 조건을 만족하는 여학생 수");
  }
  if (kind === "e3-train-walk") {
    const [totalKm, speedPerTen, trainMinutes, walkingSpeed] = values;
    if (trainMinutes % 10) throw new Error("기차 시간이 10분 단위가 아닙니다.");
    const walkingMeters = (totalKm - speedPerTen * (trainMinutes / 10)) * 1000;
    if (!(natural(walkingMeters) && walkingMeters % walkingSpeed === 0)) throw new Error("남은 거리 또는 걷는 시간이 자연수가 아닙니다.");
    return walkingMeters / walkingSpeed;
  }
  if (kind === "e3-candy") {
    const [buyCount, buyPrice, bagCount, sellPrice, profit] = values;
    if (buyPrice % buyCount) throw new Error("사탕 한 개 가격이 자연수가 아닙니다.");
    const profitPerBag = sellPrice - buyPrice / buyCount * bagCount;
    return only(Array.from({ length: profit }, (_, index) => index + 1).filter(bags => bags * profitPerBag === profit), "사탕 이익 조건을 만족하는 봉지 수");
  }
  if (kind === "e3-beads") {
    const [difference, transfer] = values;
    const upper = transfer * 4 + difference * 2;
    const hyunju = only(Array.from({ length: upper }, (_, index) => index + 1).filter(value => value + transfer === (value + difference - transfer) * 3), "구슬 조건을 만족하는 현주 구슬 수");
    return hyunju * (hyunju + difference);
  }
  throw new Error(`알 수 없는 개념탐구 3 검산 종류: ${kind}`);
}

if (!unit || types.length !== 11 || e3Items.length !== 11) failures.push("개념탐구 3 원문·교육과정 유형은 각각 11개여야 합니다.");
const ready = types.filter(type => !type.reviewLocked && api.generatorKey(type) === "mixedCalculationE3");
const locked = unit ? unit.subunits.flatMap(item => item.types).filter(type => type.reviewLocked || !api.generatorKey(type)) : [];
if (ready.length !== 11 || locked.length !== 12) failures.push(`개념탐구 3 공개 11유형·단원 잠금 12유형이어야 하나 ${ready.length}, ${locked.length}유형입니다.`);
for (const type of types) {
  const item = e3Items.find(candidate => candidate.sourceItemId === type.sourceItemId);
  if (!item || item.implementationStatus !== "ready" || type.reviewLocked || api.generatorKey(type) !== "mixedCalculationE3") failures.push(`${type.id}: 원문 공개 상태 또는 생성기 연결이 다릅니다.`);
  if (!inventory.resultContracts[type.sourceItemId]) failures.push(`${type.id}: 답 형식 계약이 없습니다.`);
}
if (JSON.stringify(sourceAnswers) !== JSON.stringify([9200, 883, 11, 20, 9200, 4, 16, 69, 50, 55, 567])) failures.push("원문 표본 답 검산이 다릅니다.");

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    const answers = new Set();
    const prompts = new Set();
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 비었습니다.");
        if (/NaN|undefined|Infinity/.test(`${generated.prompt} ${generated.answer} ${generated.solution}`)) throw new Error("잘못된 값이 노출됩니다.");
        const { kind, values } = attributes(generated.prompt);
        if (!values.every(natural)) throw new Error("양의 자연수가 아닌 조건값이 있습니다.");
        const answer = calculate(kind, values, generated.prompt);
        if (numberAnswer(generated.answer) !== answer) throw new Error(`독립 계산 답 ${answer}과 생성 답 ${generated.answer}이 다릅니다.`);
        answers.add(String(generated.answer));
        prompts.add(String(generated.prompt));
        checked += 1;
      } catch (error) {
        fail(type, difficulty, seed, error.message);
      }
    }
    const minimumPrompts = type.variant === 6 ? 16 : 40;
    if (answers.size < 8 || prompts.size < minimumPrompts) failures.push(`${type.id} / 난이도 ${difficulty}: 다양성이 부족합니다. 답 ${answers.size}개, 문제 ${prompts.size}개`);
  }
}

if (failures.length) {
  console.error(`5-1 자연수의 혼합 계산 개념탐구 3 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`5-1 자연수의 혼합 계산 개념탐구 3 감사 통과: 원문 표본 답 11개 · 공개 11유형 · ${checked.toLocaleString()}회 독립 계산·전수 열거·SVG 모델 검사`);
