"use strict";

// Regression checks for 5-1 unit 4 answers. Comparisons use integer cross-products.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = ["크기가 같은 분수", "약분과 기약분수", "통분과 분수의 크기 비교", "조건에 맞는 분수 찾기"]
  .map((name, index) => ({ id: `5-1-u4-t${index + 1}`, name, semesterId: "5-1", unitId: "5-1-u4", unitName: "약분과 통분" }));
const check = (condition, message) => { if (!condition) throw new Error(message); };
const textOnly = text => text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const parseFraction = value => value.split("/").map(Number);
const phi = value => Array.from({ length: value - 1 }, (_, index) => index + 1).filter(numerator => gcd(numerator, value) === 1).length;

function verify(generated, type, context) {
  const prompt = textOnly(generated.prompt);
  const answer = String(generated.answer);
  check(generated.generator && generated.answer !== "" && generated.solution, context + ": 결과가 비어 있습니다.");
  check(!/NaN|undefined|Infinity/.test(generated.prompt + answer + generated.solution), context + ": 계산값이 깨졌습니다.");
  if (type.id === "5-1-u4-t1") {
    if (prompt.includes("어떤 진분수")) {
      const [, add, firstText, subtract, secondText] = prompt.match(/분자에 (\d+)을 더하면 (\d+\/\d+).*?분모에서 (\d+)을 빼면 (\d+\/\d+)/) || [];
      const [r, s] = parseFraction(firstText); const [u, v] = parseFraction(secondText);
      const numerator = u * (s * Number(add) - Number(subtract) * r) / (r * v - u * s);
      const denominator = s * (numerator + Number(add)) / r;
      check(Number(answer) === denominator - numerator, context + ": 같은 크기 분수 조건식이 틀렸습니다.");
    } else {
      const step = Number(prompt.match(/분모에는 (\d+)씩/)[1]);
      const fractions = [...prompt.matchAll(/(\d+\/\d+)/g)].map(match => parseFraction(match[1]));
      const [firstN, firstD] = fractions[0]; const [targetN, targetD] = fractions.at(-1);
      let position = 1;
      while ((firstN + position - 1) * targetD !== targetN * (firstD + (position - 1) * step)) position += 1;
      check(Number(answer) === position, context + ": 분수 수열 위치가 틀렸습니다.");
    }
    return;
  }
  if (type.id === "5-1-u4-t2") {
    if (prompt.includes("크기가 같고")) {
      const [, numerator, denominator, limit] = prompt.match(/(\d+)\/(\d+)와 크기가 같고 분모가 (\d+)보다/) || [];
      check(Number(answer) === Math.floor((Number(limit) - 1) / Number(denominator)), context + ": 동치분수 개수가 틀렸습니다.");
    } else {
      const denominator = Number(prompt.match(/분모가 (\d+)인/)[1]);
      check(Number(answer) === phi(denominator), context + ": 기약진분수 개수가 틀렸습니다.");
    }
    return;
  }
  if (type.id === "5-1-u4-t3") {
    const labelled = [...prompt.matchAll(/([가나다]): (\d+)\/(\d+)/g)].map(match => ({ label: match[1], numerator: Number(match[2]), denominator: Number(match[3]) }));
    const expected = labelled.sort((left, right) => right.numerator * left.denominator - left.numerator * right.denominator).map(item => item.label).join(", ");
    check(answer === expected, context + ": 통분 비교 순서가 틀렸습니다.");
    return;
  }
  if (prompt.includes("보다 크고")) {
    const [, numerator, lowerN, lowerD, upperN, upperD] = prompt.match(/분자가 (\d+)인.*?(\d+)\/(\d+)보다 크고 (\d+)\/(\d+)보다/) || [];
    const candidates = [];
    for (let denominator = Number(numerator) + 1; denominator <= 300; denominator += 1) {
      if (Number(lowerN) * denominator < Number(numerator) * Number(lowerD) && Number(numerator) * Number(upperD) < Number(upperN) * denominator && gcd(Number(numerator), denominator) === 1) candidates.push(denominator);
    }
    check(Number(answer) === candidates.length, context + ": 조건 기약분수 개수가 틀렸습니다.");
  } else {
    const [, numerator, limit, targetN, targetD] = prompt.match(/분자가 (\d+)이고 분모가 (\d+) 이하.*?(\d+)\/(\d+)에/) || [];
    const candidates = [];
    for (let denominator = Number(numerator) + 1; denominator <= Number(limit); denominator += 1) if (gcd(Number(numerator), denominator) === 1) candidates.push(denominator);
    candidates.sort((left, right) => Math.abs(Number(numerator) * Number(targetD) - Number(targetN) * left) * right - Math.abs(Number(numerator) * Number(targetD) - Number(targetN) * right) * left || left - right);
    check(answer === `${numerator}/${candidates[0]}`, context + ": 가장 가까운 조건 분수가 틀렸습니다.");
  }
}

let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 350; seed += 1) {
  verify(api.generate(type, 0, difficulty, seed, seed % 9), type, `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`);
  count += 1;
}
console.log(`약분과 통분 감사 통과: 4유형, ${count}개 생성`);
