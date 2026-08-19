"use strict";

// Regression checks for 5-1 unit 1 answers and unique operator puzzles.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  { id: "5-1-u1-t1", name: "혼합 계산의 순서" },
  { id: "5-1-u1-t2", name: "하나의 식으로 나타내기" },
  { id: "5-1-u1-t3", name: "식 세워 풀기" },
  { id: "5-1-u1-t4", name: "혼합 계산식 만들기" }
].map(type => ({ ...type, semesterId: "5-1", unitId: "5-1-u1", unitName: "자연수의 혼합 계산" }));

const attribute = (tag, name) => tag.match(new RegExp("\\b" + name + "=\"([^\"]*)\""))?.[1];
const values = (tag, name = "data-values") => (attribute(tag, name) || "").split(",").map(Number);
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fraction = (numerator, denominator = 1) => {
  if (!denominator) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const operation = (left, right, operator) => {
  if (!left || !right) return null;
  if (operator === "+") return fraction(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "-") return fraction(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "×") return fraction(left.numerator * right.numerator, left.denominator * right.denominator);
  return right.numerator ? fraction(left.numerator * right.denominator, left.denominator * right.numerator) : null;
};
const flat = (numbers, operators) => {
  const terms = [typeof numbers[0] === "number" ? fraction(numbers[0]) : numbers[0]];
  const additiveOperators = [];
  operators.forEach((operator, index) => {
    const number = typeof numbers[index + 1] === "number" ? fraction(numbers[index + 1]) : numbers[index + 1];
    if (operator === "×" || operator === "÷") terms[terms.length - 1] = operation(terms[terms.length - 1], number, operator);
    else {
      additiveOperators.push(operator);
      terms.push(number);
    }
  });
  return terms.slice(1).reduce((total, value, index) => operation(total, value, additiveOperators[index]), terms[0]);
};
const evaluate = (numbers, operators, parentheses) => {
  if (parentheses !== "middle") return flat(numbers, operators);
  const middle = operation(fraction(numbers[1]), fraction(numbers[2]), operators[1]);
  return flat([numbers[0], middle, numbers[3], numbers[4]], [operators[0], operators[2], operators[3]]);
};
const permutations = values => {
  const result = [];
  const visit = (picked, remaining) => {
    if (!remaining.length) return result.push(picked);
    remaining.forEach((value, index) => visit([...picked, value], [...remaining.slice(0, index), ...remaining.slice(index + 1)]));
  };
  visit([], values);
  return result;
};

let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed % 9);
      const context = type.id + " / 난이도 " + difficulty + " / 시드 " + seed;
      check(generated && generated.answer && generated.solution, context + ": 결과가 비어 있습니다.");
      check(!/NaN|undefined|Infinity/.test(generated.prompt + generated.answer + generated.solution), context + ": 계산값이 깨졌습니다.");
      const tag = generated.prompt.match(/<div class="equation"[^>]*data-mixed-kind="[^"]+"[^>]*>/)?.[0];
      check(Boolean(tag), context + ": 검산용 식 정보가 없습니다.");
      const kind = attribute(tag, "data-mixed-kind");

      if (kind === "order-calc") {
        const [head, addend, multiplier, dividend, divisor, outside, tail] = values(tag);
        check(Number(generated.answer) === head - (addend + multiplier * (dividend / divisor)) * outside + tail, context + ": 괄호 혼합 계산이 틀렸습니다.");
      } else if (kind === "order-blank") {
        const [start, addend, factor, divisor, target] = values(tag);
        const blank = Number(generated.answer);
        check(start - (addend + factor * blank) / divisor === target, context + ": 빈칸 혼합 계산이 틀렸습니다.");
      } else if (kind === "order-sequence") {
        const [head, left, right, multiplier, divisor, tail] = values(tag);
        check(Number(generated.answer) === head - (left + right) * multiplier / divisor + tail, context + ": 계산 순서 혼합 계산이 틀렸습니다.");
      } else if (kind === "one-expression-people") {
        const [total, boys, boyCount, girlCount] = values(tag);
        check(Number(generated.answer) === boys * boyCount + (total - boys) * girlCount, context + ": 학생 수 식이 틀렸습니다.");
      } else if (kind === "one-expression-money") {
        const [paid, firstPrice, firstCount, secondPrice, secondCount] = values(tag);
        check(Number(generated.answer) === paid - (firstPrice * firstCount + secondPrice * secondCount), context + ": 거스름돈 식이 틀렸습니다.");
      } else if (kind === "one-expression-stock") {
        const [rows, perRow, damagedRows, damagedPerRow] = values(tag);
        check(Number(generated.answer) === rows * perRow - damagedRows * damagedPerRow, context + ": 재고 식이 틀렸습니다.");
      } else if (kind === "word-price") {
        const [caseExtra, crayonExtra, difference] = values(tag);
        const pen = (difference - crayonExtra + caseExtra) / 2;
        check(Number.isInteger(pen) && Number(generated.answer) === pen * 3 + crayonExtra, context + ": 가격 관계식이 틀렸습니다.");
      } else if (kind === "word-quotient") {
        const [difference, quotient, remainder] = values(tag);
        const smaller = (difference - remainder) / (quotient - 1);
        const larger = smaller * quotient + remainder;
        check(Number.isInteger(smaller) && Number(generated.answer) === smaller + larger, context + ": 몫과 나머지 관계식이 틀렸습니다.");
      } else if (kind === "word-box") {
        const [boxes, total, difference] = values(tag);
        const pineNut = (total / (boxes * 2) - difference) / 2;
        check(Number.isInteger(pineNut) && Number(generated.answer) === pineNut, context + ": 묶음 가격 관계식이 틀렸습니다.");
      } else if (kind === "operator-puzzle") {
        const numbers = values(tag, "data-mixed-numbers");
        const parentheses = attribute(tag, "data-mixed-parentheses");
        const target = Number(attribute(tag, "data-mixed-target"));
        const solution = generated.answer.split(", ");
        const answerValue = evaluate(numbers, solution, parentheses);
        check(answerValue && answerValue.denominator === 1 && answerValue.numerator === target, context + ": 기호 답이 목표값을 만들지 못합니다.");
        const matching = permutations(["+", "-", "×", "÷"]).filter(operators => {
          const value = evaluate(numbers, operators, parentheses);
          return value && value.denominator === 1 && value.numerator === target;
        });
        check(matching.length === 1 && matching[0].join(",") === solution.join(","), context + ": 기호 답이 하나로 결정되지 않습니다.");
      } else {
        throw new Error(context + ": 알 수 없는 혼합 계산 유형입니다.");
      }
      generatedCount += 1;
    }
  }
}

console.log("혼합 계산 감사 통과: 4유형, " + generatedCount + "개 생성");
