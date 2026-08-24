"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u2");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const reduced = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};
const fractionText = (numerator, denominator = 1) => {
  const [n, d] = reduced(numerator, denominator);
  if (d === 1) return String(n);
  const whole = Math.floor(n / d);
  const remainder = n % d;
  return whole ? `${whole} ${remainder}/${d}` : `${n}/${d}`;
};
const simpleFractionText = (numerator, denominator = 1) => {
  const [n, d] = reduced(numerator, denominator);
  return d === 1 ? String(n) : `${n}/${d}`;
};
const attribute = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const numbers = value => value.split(",").map(Number);
const permutations = values => {
  const output = [];
  const visit = (chosen, remaining) => {
    if (!remaining.length) return output.push(chosen);
    remaining.forEach((value, index) => visit([...chosen, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return output;
};

function expectedAnswer(generated) {
  const kind = attribute(generated.prompt, "fmul-kind");
  const values = numbers(attribute(generated.prompt, "values"));
  if (kind === "sequential-share") {
    const [total, a, b, c, d] = values;
    return String(total * (b - a) / b * (d - c) / d);
  }
  if (kind === "day-seconds") {
    const [numerator, denominator] = values;
    return String(86400 * numerator / denominator);
  }
  if (kind === "natural-count") {
    const [numerator, denominator, limit] = values;
    return String(Array.from({ length: limit }, (_, index) => index + 1).filter(value => value * numerator % denominator === 0 && value * numerator / denominator >= 10 && value * numerator / denominator <= 99).length);
  }
  if (kind === "telescoping") {
    const [start, step, count] = values;
    return simpleFractionText(start + step * count, start);
  }
  if (kind === "bouncing") {
    const [height, numerator, denominator, bounceCount] = values;
    let commonDenominator = denominator ** bounceCount;
    let totalNumerator = height * commonDenominator;
    for (let bounce = 1; bounce <= bounceCount; bounce += 1) {
      const distanceNumerator = height * numerator ** bounce * denominator ** (bounceCount - bounce);
      totalNumerator += distanceNumerator * (bounce === bounceCount ? 1 : 2);
    }
    return fractionText(totalNumerator, commonDenominator);
  }
  if (kind === "remaining-product") {
    const [total, lastDivisor] = values;
    return String(total / lastDivisor);
  }
  if (kind === "reverse-total") {
    const [remaining, a, b, c, d] = values;
    return String(remaining * b * d / ((b - a) * (d - c)));
  }
  if (kind === "ratio-total") {
    const [total, firstRatio, secondRatio] = values;
    const unitValue = total / (firstRatio + secondRatio);
    return `${firstRatio * unitValue}, ${secondRatio * unitValue}`;
  }
  if (kind === "part-difference") {
    const [difference, a, b, c, d] = values;
    return String(difference * b * d / Math.abs(a * d - c * b));
  }
  if (kind === "least-multiplier") {
    const [numerator, ...denominators] = values;
    const common = denominators.reduce((total, denominator) => lcm(total, denominator));
    return fractionText(common, numerator);
  }
  if (kind === "pair-count") {
    const [firstDenominator, secondDenominator, targetNumerator, targetDenominator, maximum] = values;
    let count = 0;
    for (let first = 1; first <= maximum; first += 1) for (let second = 1; second <= maximum; second += 1) {
      if (gcd(first, firstDenominator) !== 1 || gcd(second, secondDenominator) !== 1) continue;
      const [n, d] = reduced(first * second, firstDenominator * secondDenominator);
      if (n === targetNumerator && d === targetDenominator) count += 1;
    }
    return String(count);
  }
  if (kind === "digit-arrangements") {
    const [targetNumerator, targetDenominator] = numbers(attribute(generated.prompt, "target"));
    return String(permutations(values).filter(items => {
      const [n, d] = reduced(items[0] * items[3] * items[4], items[1] * items[2] * items[5]);
      return n === targetNumerator && d === targetDenominator;
    }).length);
  }
  throw new Error(`알 수 없는 검산 유형 ${kind}입니다.`);
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
        if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값이 생성되었습니다.");
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`분수의 곱셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`분수의 곱셈 감사 통과: ${types.length}유형, ${types.length * 3 * 500}개 생성`);
