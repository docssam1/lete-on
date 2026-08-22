"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-1").units.find(item => item.id === "6-1-u3");
const types = unit.subunits.flatMap(subunit => subunit.types);
const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
const fixed = (scaled, places) => (scaled / 10 ** places).toFixed(places);
const duration = seconds => `${Math.floor(seconds / 60)}분${seconds % 60 ? ` ${seconds % 60}초` : ""}`;
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);
const permutations = values => {
  const output = [];
  const visit = (chosen, remaining) => {
    if (!remaining.length) return output.push(chosen);
    remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return output;
};
const decimalDigitAt = (numerator, denominator, position) => {
  let remainder = numerator % denominator;
  let digit = 0;
  for (let index = 0; index < position; index += 1) {
    remainder *= 10;
    digit = Math.floor(remainder / denominator);
    remainder %= denominator;
  }
  return digit;
};

function expected(generated) {
  const kind = attr(generated.prompt, "decimal-division-kind");
  const v = values(generated.prompt);
  if (kind === "closest-quotients") {
    const labels = ["ㄱ", "ㄴ", "ㄷ", "ㄹ"].slice(0, v.length - 1);
    return v.slice(1).map((value, index) => ({ label: labels[index], distance: Math.abs(value - v[0]) })).sort((a, b) => a.distance - b.distance).map(item => item.label).join(", ");
  }
  if (kind === "defined-operation") return decimal(Math.abs(v[1] - v[0]) / 10, 2);
  if (kind === "composite-missing-height") return (v[2] - v[1] ** 2) / v[0];
  if (kind === "missing-long-division-digit") return Number(fixed(v[2], 2)[v[3]]);
  if (kind === "linked-quotient-sum") return decimal(v[0] * 14 / 45 / 100, 2);
  if (kind === "digit-card-quotient-range") {
    const quotients = permutations(v).map(order => (10 * order[0] + order[1] + order[2] / 10) / order[3]);
    return decimal(Math.max(...quotients) - Math.min(...quotients), 3);
  }
  if (kind === "equal-number-line") return decimal((v[0] + (v[1] - v[0]) * v[3] / v[2]) / 100, 2);
  if (kind === "constant-lap-time") return duration(v[1] / v[0] * v[2]);
  if (kind === "container-item-mass") {
    const item = (v[3] - v[4]) / v[1];
    const container = v[3] - v[0] * item;
    return decimal((container + v[2] * item) / 100, 2);
  }
  if (kind === "two-speed-gap") return decimal((v[1] - v[0]) * v[4] / 60, 2);
  if (kind === "fuel-cost-difference") {
    const rateA = v[0] / 10, rateB = v[1] / 10, distance = v[2] / 100;
    return Math.round(Math.abs(distance / rateA - distance / rateB) * v[3]);
  }
  if (kind === "moving-overlap-area") return (((v[4] + v[5]) * v[6] - v[3]) / 10) * v[2];
  if (kind === "repeating-decimal-digit") return decimalDigitAt(v[0], v[1], v[2]);
  if (kind === "rounded-quotient-range") return decimal(Math.round(v[1] / v[2] * 100) / 100 - Math.round(v[0] / v[3] * 100) / 100, 2);
  if (kind === "three-number-quotient") return decimal(100 / (v[0] * v[1]), 3);
  if (kind === "natural-number-interval") {
    const low = v[0] / v[1], high = v[2] / v[3];
    const first = Math.floor(low / 100) + 1, last = Math.ceil(high / 100) - 1;
    return (first + last) * (last - first + 1) / 2;
  }
  if (kind === "smallest-rounding-addend") {
    const candidates = Array.from({ length: 999 }, (_, index) => index + 1).filter(add => Math.round(((v[0] + add / 100) / v[1]) * 1000) === v[2]);
    if (!candidates.length) throw new Error("반올림 조건 후보 없음");
    return decimal(Math.min(...candidates) / 100, 2);
  }
  if (kind === "two-rounded-quotients") return Array.from({ length: 160 }, (_, index) => index + 1).filter(value => Math.round(value / v[0]) === v[1] && Math.round(value / v[2]) === v[3]).join(", ");
  if (kind === "five-collinear-points") return decimal(((v[1] - v[0] - v[2]) / 2 + v[0]) / 10, 1);
  if (kind === "scaled-rectangle-area") return decimal((v[2] * 10000 / (v[0] * v[1] - 10000)) / 100, 2);
  if (kind === "rectangular-park-border") return (v[3] - 4 * v[2] ** 2) / v[2];
  if (kind === "equilateral-strip-side") return decimal(v[1] / v[0] / 10, 1);
  if (kind === "second-meeting-distance") return decimal(((v[0] + v[1]) / 10) * (v[2] / 60) / 3, 2);
  if (kind === "delayed-opposite-meeting") return Math.round((60 * (v[3] / 100) - v[0] * v[2]) / (v[0] + v[1]));
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    const solutionText = generated.solution.replace(/,(?=\d{3}(?:\D|$))/g, "");
    const answerToken = String(generated.answer).split(/,\s+/)[0].trim().replace(/,(?=\d{3}(?:\D|$))/g, "");
    if (!solutionText.includes(answerToken)) throw new Error("풀이에 정답 근거가 없음");
    const kind = attr(generated.prompt, "decimal-division-kind");
    if (kind === "two-rounded-quotients" && String(generated.answer).split(",").length < 2) throw new Error("반올림 교집합 후보가 너무 적음");
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`소수의 나눗셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`소수의 나눗셈 감사 통과: ${types.length}유형, ${count}개 생성`);
