"use strict";

// Regression checks for 5-1 unit 2 answers. Every type is generated at all three difficulty levels.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  "약수와 배수", "소인수분해 1", "소인수분해 2", "소인수분해의 활용",
  "공약수와 최대공약수", "공배수와 최소공배수", "배수판정법", "세 수의 최대공약수와 최소공배수",
  "약수의 개수", "공약수의 활용", "공배수의 활용", "최대공약수와 최소공배수의 관계"
].map((name, index) => ({ id: `5-1-u2-t${index + 1}`, name, semesterId: "5-1", unitId: "5-1-u2", unitName: "약수와 배수" }));

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const divisors = value => {
  const output = [];
  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor) continue;
    output.push(divisor);
    if (divisor * divisor !== value) output.push(value / divisor);
  }
  return output.sort((left, right) => left - right);
};
const clean = text => text.replace(/,/g, "");
const factorProduct = text => text.split(" × ").reduce((total, term) => {
  const [base, power = "1"] = term.split("^");
  return total * Number(base) ** Number(power);
}, 1);
const factorPowers = value => {
  const output = new Map();
  let remaining = value;
  for (let divisor = 2; divisor * divisor <= remaining; divisor += divisor === 2 ? 1 : 2) {
    while (remaining % divisor === 0) {
      output.set(divisor, (output.get(divisor) || 0) + 1);
      remaining /= divisor;
    }
  }
  if (remaining > 1) output.set(remaining, (output.get(remaining) || 0) + 1);
  return output;
};

function verify(generated, type, context) {
  const prompt = generated.prompt.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const answer = String(generated.answer);
  check(generated.generator && generated.answer !== "" && generated.solution, context + ": 결과가 비어 있습니다.");
  check(!/NaN|undefined|Infinity/.test(generated.prompt + answer + generated.solution), context + ": 계산값이 깨졌습니다.");

  if (type.id === "5-1-u2-t1") {
    let match = prompt.match(/(\d+) \+ □가 (\d+)의 배수가 되도록 하는 (\d+) 이상 (\d+) 이하/);
    if (match) {
      const [, base, divisor, low, high] = match.map(Number);
      check(Number(answer) === Math.floor((base + high) / divisor) - Math.floor((base + low - 1) / divisor), context + ": 배수 개수가 틀렸습니다.");
      return;
    }
    match = prompt.match(/([\d,]+)의 약수 중 ([\d,]+) 이하/);
    if (match) {
      const value = Number(clean(match[1]));
      const upper = Number(clean(match[2]));
      const expected = divisors(value).filter(divisor => divisor <= upper).at(-1);
      check(Number(answer) === expected, context + ": 범위 안 최대 약수가 틀렸습니다.");
      return;
    }
    match = prompt.match(/곱이 ([\d,]+)일 때/);
    const value = Number(clean(match[1]));
    const expected = divisors(value).filter(divisor => divisor <= Math.sqrt(value)).at(-1);
    check(Number(answer) === expected + value / expected, context + ": 가장 가까운 약수쌍의 합이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t2") {
    if (prompt.includes("소수인 수")) {
      const candidates = (prompt.match(/([\d,]+(?:, [\d,]+){3})/)?.[1] || "").split(", ").map(value => Number(clean(value)));
      check(Number(answer) === candidates.filter(value => divisors(value).length === 2).length, context + ": 소수 판별이 틀렸습니다.");
    } else {
      const value = Number(clean(prompt.match(/([\d,]+)을 소인수/)?.[1] || "0"));
      check(factorProduct(answer) === value, context + ": 기본 소인수분해가 틀렸습니다.");
    }
    return;
  }

  if (type.id === "5-1-u2-t3") {
    const equation = prompt.match(/\(([^)]+)\) ([×÷]) \(([^)]+)\)/);
    if (equation) {
      const [, left, operator, right] = equation;
      const expected = operator === "×" ? factorProduct(left) * factorProduct(right) : factorProduct(left) / factorProduct(right);
      check(factorProduct(answer) === expected, context + ": 소인수 지수 계산이 틀렸습니다.");
    } else {
      const [, left, target] = prompt.match(/\(([^)]+)\) × □ = ([\d^× ]+)/) || [];
      check(left && target, context + ": 소인수 빈칸 식을 읽지 못했습니다.");
      check(factorProduct(left) * factorProduct(answer) === factorProduct(target), context + ": 소인수 빈칸 계산이 틀렸습니다.");
    }
    return;
  }

  if (type.id === "5-1-u2-t4") {
    if (prompt.includes("1부터")) {
      const n = Number(prompt.match(/1부터 (\d+)까지/)?.[1]);
      check(Number(answer) === Math.floor(n / 5) + Math.floor(n / 25) + Math.floor(n / 125), context + ": 계승의 0 개수가 틀렸습니다.");
    } else {
      const value = Number(clean(prompt.match(/([\d,]+)에 가장 작은/)?.[1] || "0"));
      const power = prompt.includes("세제곱수") ? 3 : 2;
      const combined = factorPowers(value * Number(answer));
      check([...combined.values()].every(exponent => exponent % power === 0), context + ": 완성된 수의 소인수 지수가 맞지 않습니다.");
      for (let multiplier = 1; multiplier < Number(answer); multiplier += 1) {
        const candidate = factorPowers(value * multiplier);
        check(![...candidate.values()].every(exponent => exponent % power === 0), context + ": 더 작은 완성 수가 존재합니다.");
      }
    }
    return;
  }

  if (type.id === "5-1-u2-t5") {
    const numbers = [...prompt.matchAll(/\d+/g)].map(match => Number(match[0]));
    const common = gcd(numbers[0], numbers[1]);
    if (prompt.includes("공약수는 모두")) check(Number(answer) === divisors(common).length, context + ": 공약수 개수가 틀렸습니다.");
    else check(factorProduct(answer) === common, context + ": 최대공약수의 소인수분해가 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t6") {
    const numbers = [...prompt.matchAll(/[\d,]+/g)].map(match => Number(clean(match[0])));
    if (prompt.includes("가장 가까운")) check(Number(answer) % lcm(numbers[0], numbers[1]) === 0, context + ": 가장 가까운 공배수가 공배수가 아닙니다.");
    else {
      const match = prompt.match(/([\d,]+) 이상 ([\d,]+) 이하.*?(\d+)과 (\d+)의 공배수/);
      const [, lowerRaw, upperRaw, firstRaw, secondRaw] = match || [];
      const lower = Number(clean(lowerRaw));
      const upper = Number(clean(upperRaw));
      const base = lcm(Number(firstRaw), Number(secondRaw));
      check(Number(answer) === Math.floor(upper / base) - Math.floor((lower - 1) / base), context + ": 공배수 개수가 틀렸습니다.");
    }
    return;
  }

  if (type.id === "5-1-u2-t7") {
    const [pattern, divisor] = prompt.match(/([0-9□]+)이 (\d+)의 배수/)?.slice(1) || [];
    const candidates = [];
    for (let digit = 0; digit <= 9; digit += 1) if (Number(pattern.replace("□", digit)) % Number(divisor) === 0) candidates.push(digit);
    check(Number(answer) === candidates.reduce((total, digit) => total + digit, 0), context + ": 배수 판정 숫자 합이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t8") {
    const values = (prompt.match(/세 수 ([\d, ]+)의 최대공약수/)?.[1] || "").split(",").map(value => Number(value.trim()));
    const [greatest, least] = answer.split(", ").map(Number);
    check(greatest === values.reduce(gcd) && least === values.reduce(lcm), context + ": 세 수의 최대공약수 또는 최소공배수가 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t9") {
    const value = Number(clean(prompt.match(/([\d,]+)의 약수/)?.[1] || "0"));
    if (prompt.includes("제곱수인")) check(divisors(value).filter(divisor => Math.sqrt(divisor) % 1 === 0).length === Number(answer), context + ": 제곱수 약수 개수가 틀렸습니다.");
    else check(divisors(value).length === Number(answer), context + ": 약수 개수가 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t10") {
    const values = (prompt.match(/세 수 ([\d, ]+)을/)?.[1] || "").split(",").map(value => Number(value.trim()));
    const remainders = (prompt.match(/차례로 ([\d, ]+)이었습니다/)?.[1] || "").split(",").map(value => Number(value.trim()));
    check(Number(answer) === gcd(gcd(values[0] - remainders[0], values[1] - remainders[1]), values[2] - remainders[2]), context + ": 나머지 공약수 활용이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t11") {
    const [first, second, after] = [...prompt.matchAll(/(\d+)분/g)].map(match => Number(match[1]));
    check(Number(answer) === Math.ceil(after / lcm(first, second)) * lcm(first, second), context + ": 주기 공배수 활용이 틀렸습니다.");
    return;
  }

  if (type.id === "5-1-u2-t12") {
    const [product, greatest] = [...prompt.matchAll(/([\d,]+)/g)].map(match => Number(clean(match[1])));
    check(Number(answer) === product / greatest, context + ": 최대공약수와 최소공배수 관계가 틀렸습니다.");
  }
}

let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed % 9);
      const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
      verify(generated, type, context);
      generatedCount += 1;
    }
  }
}

console.log(`약수와 배수 감사 통과: 12유형, ${generatedCount}개 생성`);
