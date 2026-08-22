"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2").units.find(item => item.id === "6-2-u2");
const types = unit.subunits.flatMap(subunit => subunit.types);
const labels = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉥"];
const fixed = (scaled, places) => (scaled / 10 ** places).toFixed(places);
const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
const clock = minutes => `${Math.floor(minutes / 60)}시 ${String(minutes % 60).padStart(2, "0")}분`;
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);

function cardQuotients(digits) {
  const output = [];
  for (const a of digits) for (const b of digits) for (const c of digits) for (const d of digits) {
    if (new Set([a, b, c, d]).size !== 4) continue;
    output.push((10 * a + b) / (10 * c + d));
  }
  return output;
}

function threeDigitDecimals(digits) {
  const output = [];
  for (const a of digits) for (const b of digits) for (const c of digits) {
    if (new Set([a, b, c]).size !== 3) continue;
    output.push((100 * a + 10 * b + c) / 100);
  }
  return output;
}

function expected(generated) {
  const kind = attr(generated.prompt, "decimal-division-kind");
  const v = values(generated.prompt);
  if (kind === "62d-compare-quotients") return v.slice(1).map((value, index) => value > v[0] ? labels[index] : "").filter(Boolean).join(", ");
  if (kind === "62d-common-natural-range") return Array.from({ length: 40 }, (_, index) => index + 1).filter(value => v[0] / 10 < value && value < v[1] / 10).length;
  if (kind === "62d-one-decimal-range") return Array.from({ length: 9 }, (_, index) => index + 1).filter(digit => v[1] < digit * v[0] && digit * v[0] < v[2]).length;
  if (kind === "62d-missing-division-digit") return fixed(v[2], 2)[v[3]];
  if (kind === "62d-card-largest-quotient") return decimal(Math.max(...cardQuotients(v)), 3);
  if (kind === "62d-card-range-count") {
    const [a, b, c, factor, divisor, low, high] = v;
    return threeDigitDecimals([a, b, c]).filter(number => low / 1000 < number * factor / divisor && number * factor / divisor < high / 1000).length;
  }
  if (kind === "62d-two-side-spacing") return v[0] / v[1] + v[0] / v[2];
  if (kind === "62d-overlapped-tape") return `${fixed(v[0] * v[1] - (v[0] - 1) * v[2], 1)}cm`;
  if (kind === "62d-area-ratio-height") return `${Math.round(v[2] / 100 / (v[1] / 10) * 2 / v[0])}cm`;
  if (kind === "62d-overlap-triangle") return `${Math.round(((v[0] + v[1] - v[2]) / 100) * 2 / v[3])}cm`;
  if (kind === "62d-opposite-walkers") return clock(v[3] + v[0] * 6 / (v[1] + v[2]));
  if (kind === "62d-four-rectangles") return `${v[0] * v[2]}cm²`;
  if (kind === "62d-rounded-difference") {
    const quotient = v[0] / v[1];
    return decimal(Math.abs(Number(quotient.toFixed(1)) - Number(quotient.toFixed(2))), 2);
  }
  if (kind === "62d-card-rounded-maximum") return decimal(Math.max(...cardQuotients(v)), 2);
  if (kind === "62d-rounded-missing-digit") {
    const candidates = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => Math.round((v[0] + digit * 100) / v[1]) === v[2]);
    if (candidates.length !== 1) throw new Error(`빠진 숫자 후보가 ${candidates.length}개`);
    return candidates[0];
  }
  if (kind === "62d-bridge-boxes") return Math.floor((v[0] - v[1]) * 10 / v[2]);
  if (kind === "62d-rounded-divisor-count") return Array.from({ length: 90 }, (_, index) => index + 10).filter(value => Math.round(v[0] / value) === v[1]).length;
  if (kind === "62d-cubes-in-box") return v.slice(1).reduce((total, dimension) => total * Math.floor(dimension / v[0]), 1);
  if (kind === "62d-remainder-order") return v.map((value, index) => ({ value, label: labels[index] })).sort((a, b) => b.value - a.value).map(item => item.label).join(", ");
  if (kind === "62d-dividend-from-remainder") return fixed(v[0] * v[1] + v[2], 2);
  if (kind === "62d-changed-divisor-remainder" || kind === "62d-same-number-new-remainder") return fixed((v[0] * v[1] + v[2]) % v[3], 2);
  if (kind === "62d-smallest-decimal-addend") return fixed(v[1] - v[0] % v[1], 2);
  if (kind === "62d-original-from-remainder") return fixed(v[0] * v[1] + v[2], 2);
  if (kind === "62d-unit-speed-time") {
    const speedTenth = v[0] * 6 / v[1];
    return `${decimal(v[2] / speedTenth, 1)}시간`;
  }
  if (kind === "62d-fuel-efficiency-ratio") return decimal((v[1] / v[0]) / (v[3] / v[2]), 2);
  if (kind === "62d-two-taps-cost") return `${((v[0] + v[1]) * v[2] * v[3]).toLocaleString()}원`;
  if (kind === "62d-river-round-trip") return `${v[2] / (v[0] + v[1]) + v[3] / (v[0] - v[1])}시간`;
  if (kind === "62d-container-unit-mass") {
    const densityHundred = (v[2] - v[3]) / v[1];
    return `${fixed((v[2] - densityHundred * v[0]) / 10, 2)}kg`;
  }
  if (kind === "62d-candle-time") return `${(v[0] * 10 - v[2]) / v[1]}분`;
  if (kind === "62d-bouncing-stairs") {
    let height = v[5] / 1000;
    for (const drop of [v[4], v[3], v[2]]) height = height / (v[0] / v[1]) - drop / 10;
    height /= v[0] / v[1];
    return `${fixed(Math.round(height * 10), 1)}m`;
  }
  if (kind === "62d-tank-capacity") return `${v[0] / 15 * 100 / 100}L`;
  if (kind === "62d-sound-temperature") return `${Math.round((v[1] / v[0] - 33150) / 61)}℃`;
  if (kind === "62d-submerged-sticks") return `${v[2] / (v[1] - v[0])}cm`;
  if (kind === "62d-student-change") {
    const boysLast = v[0] / 2.14;
    return `${Math.round(boysLast * 1.1)}명, ${Math.round(boysLast * 1.3 * 0.8)}명`;
  }
  if (kind === "62d-two-balls") return `${fixed(Math.round(v[0] / 0.54), 2)}m`;
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) {
  const answers = new Set();
  for (let seed = 1; seed <= 180; seed += 1) {
    const generated = api.generate(type, 0, 0, seed, type.variant);
    if (generated) answers.add(generated.answer);
  }
  if (answers.size < 3) failures.push(`${type.id}: 180개 표본의 정답 종류가 ${answers.size}개뿐임`);
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      if (!generated) throw new Error("생성 결과 없음");
      if (generated.generator !== type.generatorKey) throw new Error(`생성기 연결 ${generated.generator}`);
      const answer = expected(generated);
      if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
      if (/NaN|Infinity|undefined|\d+\.\d{6,}/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없거나 지나치게 긴 소수");
      if (!generated.solution || generated.solution.length < 20) throw new Error("풀이 근거 부족");
      count += 1;
    } catch (error) {
      failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`6-2 소수의 나눗셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}
console.log(`6-2 소수의 나눗셈 감사 통과: ${types.length}유형, ${count}개 생성`);
