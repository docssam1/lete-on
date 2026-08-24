"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2").units.find(item => item.id === "6-2-u1");
const types = unit.subunits.flatMap(subunit => subunit.types);
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const rat = (n, d = 1) => {
  const sign = d < 0 ? -1 : 1;
  const divisor = gcd(n, d);
  return { n: sign * n / divisor, d: sign * d / divisor };
};
const op = (left, right, operator) => {
  if (operator === "+") return rat(left.n * right.d + right.n * left.d, left.d * right.d);
  if (operator === "-") return rat(left.n * right.d - right.n * left.d, left.d * right.d);
  if (operator === "×") return rat(left.n * right.n, left.d * right.d);
  return rat(left.n * right.d, left.d * right.n);
};
const fraction = value => value.d === 1 ? String(value.n) : `${value.n}/${value.d}`;
const mixed = value => {
  const whole = Math.floor(value.n / value.d);
  const remainder = value.n % value.d;
  if (!remainder) return String(whole);
  return whole ? `${whole} ${remainder}/${value.d}` : `${remainder}/${value.d}`;
};
const decimal = (value, places = 2) => Number(value.toFixed(places)).toString();
const clock = minutes => `${Math.floor(minutes / 60)}시 ${String(minutes % 60).padStart(2, "0")}분`;
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);

function cardExtremeDifference(digits) {
  const cases = [];
  for (const whole of digits) for (const numerator of digits) for (const denominator of digits) for (const divisor of digits) {
    if (new Set([whole, numerator, denominator, divisor]).size !== 4 || numerator >= denominator) continue;
    cases.push(rat(whole * denominator + numerator, denominator * divisor));
  }
  cases.sort((left, right) => left.n * right.d - right.n * left.d);
  return op(cases[cases.length - 1], cases[0], "-");
}

function expected(generated) {
  const kind = attr(generated.prompt, "fraction-division-kind");
  const v = values(generated.prompt);
  if (kind === "62-inverse-blank") return v[1] * v[0] - v[4] / v[2];
  if (kind === "62-defined-operations") return mixed(op(rat(v[0] * v[3], v[1] * v[2]), rat(v[4] * v[7], v[5] * v[6]), "+"));
  if (kind === "62-sequence-difference") {
    const n = v[0];
    return fraction(op(rat((n + 2) * (n + 5), (n + 3) * (n + 4)), rat(n * (n + 3), (n + 1) * (n + 2)), "-"));
  }
  if (kind === "62-symbolic-quotient") return mixed(op(rat(v[0] * v[3], v[1] * v[2]), rat(v[4] * v[7], v[5] * v[6]), "÷"));
  if (kind === "62-between-mixed") return Array.from({ length: v[3] - 1 }, (_, index) => index + 1).filter(value => value * v[0] > v[1] * v[3] && value * v[0] < v[2] * v[3]).reduce((sum, value) => sum + value, 0);
  if (kind === "62-linked-symbols") {
    const first = rat(v[0] * 2, v[1] * 3), second = rat(v[2] * 4, v[3] * 3), third = rat(v[4] * 5, v[5] * 6);
    if (first.d !== 1 || second.d !== 1 || third.d !== 1) throw new Error("기호값이 자연수가 아님");
    return first.n * second.n * third.n;
  }
  if (kind === "62-area-chain") return v[0] * v[1] * v[3] / (v[2] * v[4]);
  if (kind === "62-tank-backsolve") return op(rat(v[2] - v[3]), op(rat(v[4], v[5]), rat(v[0], v[1]), "-"), "÷").n;
  if (kind === "62-work-rest-clock") return clock(v[0] + v[1] * v[3] + v[2] * (v[3] - 1));
  if (kind === "62-decreasing-machines") {
    const remaining = rat(v[1] - v[0] * v[2], v[1]);
    return mixed(op(rat(v[2]), op(remaining, rat(v[0] - v[3], v[1]), "÷"), "+"));
  }
  if (kind === "62-seat-ratio") {
    const unitSeats = v[2] / (v[0] + v[1]);
    return `${v[0] * unitSeats}석, ${v[1] * unitSeats}석`;
  }
  if (kind === "62-square-beds") return Math.sqrt(v[0] ** 2 * (v[2] - v[1]) / v[2] / v[3]);
  if (kind === "62-continued-fraction") return mixed(op(rat(v[0]), rat(v[2], v[1] * v[2] + 1), "+"));
  if (kind === "62-odd-fraction-sum") return mixed(rat(v[0] * v[1] + v[2] ** 2 - 2, v[1]));
  if (kind === "62-card-extremes") return mixed(cardExtremeDifference(v));
  if (kind === "62-natural-divisions") return lcm(v[0], v[2]);
  if (kind === "62-symbol-system") {
    const first = rat(v[0] * 12, v[1] * 5);
    const second = rat(v[2] * 3 * first.n, v[3] * 2 * first.d);
    const third = rat(v[4] * 5 * second.n, v[5] * 6 * second.d);
    if (first.d !== 1 || second.d !== 1 || third.d !== 1) throw new Error("연립 기호값이 자연수가 아님");
    return first.n + second.n + third.n;
  }
  if (kind === "62-two-natural-conditions") return Array.from({ length: v[4] - 1 }, (_, index) => index + 2).filter(value => value % v[0] === 0 && v[2] * v[3] % value === 0).reduce((sum, value) => sum + value, 0);
  if (kind === "62-paint-unit-rate") return `${mixed(rat((v[0] + v[1]) * v[2] * v[3] * v[4], 2 * v[5]))}L`;
  if (kind === "62-two-speed-time") return `${op(rat(v[0], v[1] * v[2]), rat(v[3], v[4] * v[5]), "+").n * 60 / op(rat(v[0], v[1] * v[2]), rat(v[3], v[4] * v[5]), "+").d}분`;
  if (kind === "62-candle-unit-rate") return `${op(rat(v[0], v[1]), rat(v[2], v[3]), "÷").n / op(rat(v[0], v[1]), rat(v[2], v[3]), "÷").d}시간`;
  if (kind === "62-same-arrival") return `${clock(v[4] + v[1] - v[2])}, ${clock(v[4] + v[1] - v[3])}`;
  if (kind === "62-split-work") {
    const done = op(rat(v[2], v[0]), rat(v[2], v[1]), "+");
    const alone = op(op(rat(1), done, "-"), rat(1, v[0]), "÷");
    return `${mixed(op(rat(v[2]), alone, "+"))}일`;
  }
  if (kind === "62-staggered-pipes") return `${v[0] * v[5] + v[1] * (v[5] - v[3]) - v[2] * (v[5] - v[4])}L`;
  if (kind === "62-wire-shapes") return `${rat(v[4] * v[1], 12 * v[0] + 6 * v[1]).n}cm`;
  if (kind === "62-related-scores") return `${v[0] + v[0] * v[1] / v[2] + v[0] * v[1] * v[3] / (v[2] * v[4])}점`;
  if (kind === "62-field-backsolve") return `${op(rat(v[4]), op(rat(v[1] - v[0], v[1]), rat(v[3] - v[2], v[3]), "×"), "÷").n}m²`;
  if (kind === "62-rectangle-change") {
    const length = rat((v[4] - v[2] * v[3]) * v[1], v[3] * v[1] + v[0] * v[2]);
    return `${length.n * length.n * v[0] / (length.d * length.d * v[1])}cm²`;
  }
  if (kind === "62-three-part-route") {
    const down = op(op(rat(1), rat(v[1], v[2]), "-"), rat(v[3], v[4]), "-");
    const total = op(op(rat(v[0] * v[1], v[2] * v[5]), rat(v[0] * v[3], v[4] * v[6]), "+"), rat(v[0] * down.n, down.d * v[7]), "+");
    return `${mixed(total)}시간`;
  }
  if (kind === "62-tank-height") return `${op(rat(v[4], v[5]), op(rat(v[2], v[3]), rat(v[0], v[1]), "-"), "÷").n}cm`;
  if (kind === "62-mixed-calculation") {
    const value = op(op(op(rat(v[0], 100), rat(v[1], v[2]), "+"), rat(v[3], v[4]), "÷"), rat(v[5], 100), "-");
    return mixed(value);
  }
  if (kind === "62-fuel-efficiency") return `${decimal(v[0] * v[2] / (10 * v[1]), 2)}km`;
  if (kind === "62-quotient-range") return Array.from({ length: v[6] }, (_, index) => index + 1).filter(number => v[0] * v[3] > v[2] * v[1] * number && v[0] * v[5] < v[4] * v[1] * number).reduce((sum, value) => sum + value, 0);
  if (kind === "62-track-difference") return `${decimal(Math.abs(v[0] * v[1] / 10 - v[2] * v[4] / v[3]), 3)}km`;
  if (kind === "62-bottle-weight") {
    const full = rat(v[0], v[1]), after = rat(v[2], v[3]), drink = op(op(full, after, "-"), rat(v[4], v[5]), "÷");
    return `${mixed(op(full, drink, "-"))}kg`;
  }
  if (kind === "62-trapezoid-height") {
    const sum = op(rat(v[0], 10), rat(v[1], v[2]), "+");
    return `${mixed(op(rat(2 * v[3], v[4]), sum, "÷"))}cm`;
  }
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) {
  const answers = new Set();
  for (let seed = 1; seed <= 180; seed += 1) answers.add(api.generate(type, 0, 0, seed, type.variant).answer);
  if (answers.size < 4) failures.push(`${type.id}: 180개 표본의 정답 종류가 ${answers.size}개뿐임`);
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const answer = expected(generated);
      if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
      if (/NaN|Infinity|undefined|\d+\.\d{5,}/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없거나 지나치게 긴 소수");
      if (!generated.solution.includes(String(generated.answer).split(",")[0].replace(/(석|점|cm²|cm|km|kg|L|m²|시간|일|분)$/, "").trim())) throw new Error("풀이에 정답 근거가 없음");
      count += 1;
    } catch (error) {
      failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`6-2 분수의 나눗셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 분수의 나눗셈 감사 통과: ${types.length}유형, ${count}개 생성`);
