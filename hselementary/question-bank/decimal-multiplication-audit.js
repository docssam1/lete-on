"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u4");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const attribute = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const numbers = value => value.split(",").map(Number);
const fixed = (value, places) => (value / 10 ** places).toFixed(places);

function exactOverlapCellCount(count, sideUnits, target) {
  let cells = 0;
  for (let row = 0; row < count + sideUnits - 1; row += 1) {
    for (let column = 0; column < count + sideUnits - 1; column += 1) {
      let layers = 0;
      for (let sheet = 0; sheet < count; sheet += 1) {
        if (column >= sheet && column < sheet + sideUnits && row >= sheet && row < sheet + sideUnits) layers += 1;
      }
      if (layers === target) cells += 1;
    }
  }
  return cells;
}

if (exactOverlapCellCount(100, 4, 3) !== 198) throw new Error("원본 100장 겹침 구조의 작은 정사각형 수가 198개가 아닙니다.");

function expectedAnswer(generated) {
  const kind = attribute(generated.prompt, "decimal-kind");
  const values = numbers(attribute(generated.prompt, "values"));
  if (kind === "repeated-sum") return fixed(values[0] * values[1], 2);
  if (kind === "factor-pair") return fixed(values[0] * values[1], 1);
  if (kind === "common-factor") return fixed(values[0] * (3 * values[1] - 4 * values[2] + values[3] - 2 * values[4]), 2);
  if (kind === "missing-point") return String(values[2] / values[0]);
  if (kind === "rounded-fraction-sum") {
    const [d1, d2, d3, target] = values;
    const candidates = [];
    for (let a = 1; a < d1; a += 1) for (let b = 1; b < d2; b += 1) for (let c = 1; c < d3; c += 1) {
      if (Math.round((a / d1 + b / d2 + c / d3) * 100 + 1e-9) === target) candidates.push([a, b, c]);
    }
    if (candidates.length !== 1) throw new Error(`반올림 분수합 정답 후보가 ${candidates.length}개입니다.`);
    return candidates[0].join(", ");
  }
  if (kind === "conditioned-decimal") {
    const [firstDigit, digitSum, modulus, remainder] = values;
    const candidates = [];
    for (let value = 100; value <= 999; value += 1) {
      const digits = String(value).split("").map(Number);
      if (new Set(digits).size === 3 && digits[0] === firstDigit && digits.reduce((sum, digit) => sum + digit, 0) === digitSum && value % modulus === remainder) candidates.push(value);
    }
    return fixed(candidates.reduce((sum, value) => sum + value, 0), 3);
  }
  if (kind === "decimal-sequence") return fixed(values[0] + values[1] * (values[2] - 1), 2);
  if (kind === "rectangle-area-difference") return fixed((values[0] * values[1] + values[3]) / values[2], 2);
  if (kind === "tunnel-length") return String(values[3] * 5 * values[4] / 3 - values[0] - values[1] * values[2]);
  if (kind === "natural-product-range") {
    const [valueScale, step] = values;
    const candidates = Array.from({ length: 90 }, (_, index) => index + 10).filter(value => value % step === 0);
    return String(valueScale * (candidates[candidates.length - 1] - candidates[0]) / 100);
  }
  if (kind === "rounded-quotient-naturals") {
    const [divisor, targetScale] = values;
    const candidates = Array.from({ length: divisor * 8 }, (_, index) => index + 1).filter(value => Math.round(value / divisor * 10 + 1e-9) === targetScale);
    return String(candidates.reduce((sum, value) => sum + value, 0));
  }
  if (kind === "missing-product-digits") {
    const [first, second, , ...positions] = values;
    const fractionPart = fixed(first * second, 4).split(".")[1];
    return positions.map(position => fractionPart[position]).join(", ");
  }
  if (kind === "rounded-decimal-range") {
    const [divisorScale, targetScale] = values;
    const candidates = Array.from({ length: 8000 }, (_, index) => index + 1).filter(value => Math.round(value / divisorScale + 1e-9) === targetScale);
    return `${fixed(candidates[0], 2)}, ${fixed(candidates[candidates.length - 1], 2)}`;
  }
  if (kind === "square-area-increase") {
    const [side, widthAdd, heightAdd, increase] = values;
    if ((side + widthAdd) * (side + heightAdd) - side * side !== increase) throw new Error("넓이 증가량 조건이 맞지 않습니다.");
    return fixed(side, 1);
  }
  if (kind === "digit-product-relation") {
    const [product, difference] = values;
    const sums = new Set();
    for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 0; d <= 9; d += 1) {
      if (new Set([a, b, c, d]).size !== 4) continue;
      const first = 10 * a + b;
      const second = 10 * c + d;
      if (first >= second || first * second !== product) continue;
      if (Math.abs((10 * a + c) * (10 * b + d) - product) === difference) sums.add(a + b + c + d);
    }
    if (sums.size !== 1) throw new Error(`숫자 합 후보가 ${sums.size}개입니다.`);
    return String([...sums][0]);
  }
  if (kind === "product-digit-count") {
    const factors = values.slice(0, -1);
    const product = factors.reduce((total, factor) => total * factor / 100, 1);
    return String(Math.floor(Math.log10(product)) + 1);
  }
  if (kind === "decimal-distributive") return fixed((values[0] - values[1] + values[2]) * values[3], 3);
  if (kind === "decimal-l-area") {
    const [width, height, topWidth, rightHeight] = values;
    return fixed(width * height - (width - topWidth) * (height - rightHeight), 4);
  }
  if (kind === "wrong-decimal-operation") return fixed((values[0] * values[1] + values[2]) * values[0], 3);
  if (kind === "relative-distance") return fixed((values[0] - values[1]) * values[2] / 6, 2);
  if (kind === "missing-factor-digit") {
    const [a, b, d, e, product] = values;
    const candidates = Array.from({ length: 10 }, (_, digit) => digit).filter(digit => (100 * a + 10 * b + digit) * (10 * d + e) === product);
    if (candidates.length !== 1) throw new Error(`빈칸 숫자 후보가 ${candidates.length}개입니다.`);
    return String(candidates[0]);
  }
  if (kind === "exact-three-overlap-squares") {
    const [sideScale, count, offsetScale, target] = values;
    if (sideScale % offsetScale !== 0) throw new Error("한 변이 이동 간격의 정수배가 아닙니다.");
    const cells = exactOverlapCellCount(count, sideScale / offsetScale, target);
    return String(Number(fixed(cells * offsetScale * offsetScale, 2)));
  }
  throw new Error(`알 수 없는 검산 유형 ${kind}입니다.`);
}

const visualKinds = new Set(["decimal-l-area", "exact-three-overlap-squares"]);
const failures = [];
let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant ?? 0);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이 중 빠진 값이 있습니다.");
        if (generated.generator !== type.generatorKey) throw new Error(`생성기 연결이 ${generated.generator}입니다.`);
        if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값이 생성되었습니다.");
        const kind = attribute(generated.prompt, "decimal-kind");
        const expected = expectedAnswer(generated);
        if (String(generated.answer) !== expected) throw new Error(`정답 ${generated.answer}, 독립 검산 ${expected}`);
        if (kind === "exact-three-overlap-squares") {
          const [sideScale, count, offsetScale, target] = numbers(attribute(generated.prompt, "values"));
          const stackValues = numbers(attribute(generated.prompt, "square-stack"));
          if (`${sideScale / 10},${count},${offsetScale / 10},${target}` !== stackValues.join(",")) throw new Error("그림의 정사각형 조건이 지문과 다릅니다.");
          if (generated.prompt.includes("작은 정사각형") || generated.prompt.includes("198개")) throw new Error("그림이나 지문에 풀이 핵심이 노출되었습니다.");
        }
        if (visualKinds.has(kind) && !generated.prompt.includes("<svg")) throw new Error("그림이 필요한 문제에 SVG가 없습니다.");
        if (generated.prompt.includes("<svg") && !/aria-label="[^"]+"/.test(generated.prompt)) throw new Error("그림의 설명이 없습니다.");
        generatedCount += 1;
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`소수의 곱셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`소수의 곱셈 감사 통과: ${types.length}유형, ${generatedCount}개 생성`);
