"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u1");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));

const roundTo = (value, unit) => Math.round(value / unit) * unit;
const floorTo = (value, unit) => Math.floor(value / unit) * unit;
const ceilTo = (value, unit) => Math.ceil(value / unit) * unit;
const attribute = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const numbers = value => value.split(",").map(Number);
const permutations = digits => {
  const output = new Set();
  const visit = (chosen, remaining) => {
    if (!remaining.length) {
      if (chosen[0] !== 0) output.add(Number(chosen.join("")));
      return;
    }
    remaining.forEach((digit, index) => visit([...chosen, digit], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], digits);
  return [...output];
};

function expectedAnswer(generated) {
  const prompt = generated.prompt;
  if (prompt.includes("data-range-kind=")) {
    const kind = attribute(prompt, "range-kind");
    if (kind === "symmetric") {
      const aLow = Number(attribute(prompt, "a-low"));
      const aHigh = Number(attribute(prompt, "a-high"));
      const bLow = Number(attribute(prompt, "b-low"));
      const bHigh = Number(attribute(prompt, "b-high"));
      const first = new Set(Array.from({ length: aHigh - aLow }, (_, index) => aLow + index));
      const second = new Set(Array.from({ length: bHigh - bLow }, (_, index) => bLow + index + 1));
      return String([...new Set([...first, ...second])].filter(value => first.has(value) !== second.has(value)).length);
    }
    if (kind === "square") {
      const lower = Number(attribute(prompt, "lower"));
      const upper = Number(attribute(prompt, "upper"));
      const sideMin = Math.floor(lower / 4) + 1;
      const sideMax = Math.ceil(upper / 4) - 1;
      return `${sideMin ** 2} 이상 ${sideMax ** 2} 이하`;
    }
    if (kind === "boxes") {
      const total = Number(attribute(prompt, "total"));
      const minimum = Number(attribute(prompt, "minimum"));
      const maximum = Number(attribute(prompt, "maximum"));
      return `${Math.ceil(total / maximum)} 이상 ${Math.floor(total / minimum)} 이하`;
    }
  }
  if (prompt.includes("data-round-kind=")) {
    const kind = attribute(prompt, "round-kind");
    if (kind === "methods") {
      const value = Number(attribute(prompt, "value"));
      const unit = Number(attribute(prompt, "unit"));
      return String(ceilTo(value, unit * 10) + roundTo(value, unit) - floorTo(value, unit * 10));
    }
    if (kind === "conditions") {
      const candidates = numbers(attribute(prompt, "candidates"));
      return String(candidates.filter(value => ceilTo(value, 100) !== roundTo(value, 100) && floorTo(value, 10) !== roundTo(value, 10)).length);
    }
    if (kind === "cards") {
      const digits = numbers(attribute(prompt, "digits"));
      const unit = Number(attribute(prompt, "unit"));
      const sum = permutations(digits).reduce((total, value) => total + value, 0);
      return String(floorTo(sum, unit));
    }
  }
  if (prompt.includes("data-application-kind=")) {
    const kind = attribute(prompt, "application-kind");
    if (kind === "package") {
      const [firstLength, firstUnit, firstPrice] = numbers(attribute(prompt, "first"));
      const [secondLength, secondUnit, secondPrice] = numbers(attribute(prompt, "second"));
      return String(Math.ceil(firstLength / firstUnit) * firstPrice + Math.ceil(secondLength / secondUnit) * secondPrice);
    }
    if (kind === "units") {
      const width = Number(attribute(prompt, "width"));
      const height = Number(attribute(prompt, "height"));
      return String(Math.round(2 * (width + height) / 10));
    }
    if (kind === "fare") {
      const [baseDistance, baseFare] = numbers(attribute(prompt, "base"));
      const [step, stepFare] = numbers(attribute(prompt, "step"));
      const distance = Number(attribute(prompt, "distance"));
      return String(baseFare + Math.ceil((distance - baseDistance) / step) * stepFare);
    }
  }
  if (prompt.includes("data-rounded-kind=")) {
    const kind = attribute(prompt, "rounded-kind");
    if (kind === "intersection") {
      const [roundedTarget, flooredTarget, ceiledTarget] = numbers(attribute(prompt, "targets"));
      const lower = Math.max(roundedTarget - 500, flooredTarget, ceiledTarget - 9);
      const upper = Math.min(roundedTarget + 499, flooredTarget + 99, ceiledTarget);
      return `${lower} 이상 ${upper} 이하`;
    }
    if (kind === "multiples") {
      const [first, second] = numbers(attribute(prompt, "factors"));
      const [firstTarget, secondTarget] = numbers(attribute(prompt, "targets"));
      return String(Array.from({ length: 150 }, (_, index) => index + 1).filter(value => roundTo(first * value, 10) === firstTarget && roundTo(second * value, 10) === secondTarget).length);
    }
    if (kind === "sum") {
      const [firstTarget, firstUnit] = numbers(attribute(prompt, "first"));
      const [secondTarget, secondUnit] = numbers(attribute(prompt, "second"));
      return String(firstTarget + firstUnit / 2 - 1 + secondTarget + secondUnit - 1);
    }
  }
  throw new Error("알 수 없는 검산 유형입니다.");
}

const failures = [];
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant ?? 0);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이 중 빠진 값이 있습니다.");
        if (generated.generator !== type.generatorKey) throw new Error(`생성기 연결이 ${generated.generator}입니다.`);
        const expected = expectedAnswer(generated);
        if (String(generated.answer) !== expected) throw new Error(`정답 ${generated.answer}, 독립 검산 ${expected}`);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`수의 범위와 어림하기 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`수의 범위와 어림하기 감사 통과: ${types.length}유형, ${types.length * 3 * 500}개 생성`);
