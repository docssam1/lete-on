"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const types = semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types))
  .filter(type => type.sourceItemId?.startsWith("4-1-u3-e6"));
const failures = [];
let generatedCount = 0;

const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const normalize = value => String(value).replace(/\s+/g, "");
const attributes = prompt => {
  const tag = prompt.match(/<span class="source-completion-meta" ([^>]*)><\/span>/)?.[1] || "";
  return Object.fromEntries([...tag.matchAll(/data-([a-zA-Z]+)="([^"]*)"/g)].map(match => [match[1], match[2].replace(/&quot;/g, "\"")]));
};
const trace = (dividend, divisor) => {
  const steps = [];
  let carried = 0;
  let started = false;
  for (const digitText of String(dividend)) {
    carried = carried * 10 + Number(digitText);
    const quotientDigit = Math.floor(carried / divisor);
    if (!started && quotientDigit === 0) continue;
    started = true;
    const product = quotientDigit * divisor;
    const remainder = carried - product;
    steps.push({ carried, product, remainder });
    carried = remainder;
  }
  return steps;
};
const canonicalSignature = (multiplicand, multiplier) => {
  const rows = [
    String(multiplicand),
    String(multiplier),
    String(multiplicand * (multiplier % 10)),
    String(multiplicand * Math.floor(multiplier / 10)),
    String(multiplicand * multiplier)
  ];
  const map = new Map();
  let next = 0;
  return rows.map(row => [...row].map(digit => {
    if (digit === "3" || digit === "6") return digit;
    if (!map.has(digit)) map.set(digit, String.fromCharCode(65 + next++));
    return map.get(digit);
  }).join("")).join("|");
};
const symbolSignatureCounts = new Map();
for (let multiplicand = 306; multiplicand <= 396; multiplicand += 10) for (let multiplier = 10; multiplier <= 99; multiplier += 1) {
  const signature = canonicalSignature(multiplicand, multiplier);
  symbolSignatureCounts.set(signature, (symbolSignatureCounts.get(signature) || 0) + 1);
}
const zeroOneEquations = (leftDigits, rightDigits, productDigits) => {
  const values = digits => Array.from({ length: 2 ** (digits - 1) }, (_, index) => Number(`1${index.toString(2).padStart(digits - 1, "0")}`));
  const equations = [];
  values(leftDigits).forEach(left => values(rightDigits).forEach(right => {
    const product = left * right;
    if (String(product).length === productDigits && /^[01]+$/.test(String(product))) equations.push(`${left}×${right}=${product}`);
  }));
  return equations;
};
const cardAnswers = ({ digits, fixedLast, multiplier }) => {
  const output = [];
  for (const hundreds of digits) for (const tens of digits) {
    if (hundreds === tens) continue;
    const multiplicand = 100 * hundreds + 10 * tens + fixedLast;
    const productText = String(multiplicand * multiplier);
    if (productText.length !== 4 || productText[3] !== String((fixedLast * multiplier) % 10)) continue;
    const productDigits = [...productText.slice(0, 3)].map(Number);
    const symbolicDigits = [hundreds, tens, ...productDigits];
    if (!productDigits.every(digit => digits.includes(digit)) || new Set(symbolicDigits).size !== 5) continue;
    output.push(Number(productText.slice(0, 3)));
  }
  return [...new Set(output)].sort((left, right) => left - right);
};

check(types.length === 10, `계산식 완성하기는 원문 10유형이어야 하나 ${types.length}유형입니다.`);
types.forEach((type, index) => {
  check(type.generatorKey === "source41CalculationCompletionSix", `${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
  check(type.variant === index, `${type.sourceItemId}: 원문 순서와 생성기 분기가 다릅니다.`);
  check(!type.reviewLocked, `${type.sourceItemId}: 검증된 유형이 잠겨 있습니다.`);
});

for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  let generated;
  try {
    generated = api.generate(type, 0, difficulty, seed, type.variant);
    generatedCount += 1;
  } catch (error) {
    failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    continue;
  }
  const meta = attributes(generated.prompt);
  const variant = Number(meta.variant);
  check(variant === type.variant, `${type.sourceItemId}: 화면 검산 정보의 분기가 다릅니다.`);
  check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${type.sourceItemId}: 잘못된 값이 노출됩니다.`);

  if ([0, 1, 3, 4, 5].includes(variant)) {
    const multiplicand = Number(meta.a);
    const multiplier = Number(meta.b);
    check(Number.isInteger(multiplicand) && Number.isInteger(multiplier), `${type.sourceItemId}: 곱셈 검산값이 없습니다.`);
    check(generated.solution.includes(String(multiplicand * multiplier)), `${type.sourceItemId}: 풀이의 전체 곱이 다릅니다.`);
    if (variant === 0) check(symbolSignatureCounts.get(canonicalSignature(multiplicand, multiplier)) === 1, `${type.sourceItemId}: 복면산 답이 하나가 아닙니다.`);
    if (variant === 3 || variant === 5) {
      check(multiplicand * multiplier === Number([...String(multiplicand)].reverse().join("")), `${type.sourceItemId}: 곱의 숫자 배열이 거꾸로 되지 않습니다.`);
      const expected = [...String(multiplicand)].reduce((total, digit) => total * Number(digit), 1);
      check(Number(generated.answer) === expected, `${type.sourceItemId}: 기호 숫자의 곱이 다릅니다.`);
    }
  } else if (variant === 2) {
    const divisor = Number(meta.divisor);
    const dividend = Number(meta.dividend);
    const quotient = Number(meta.quotient);
    check(divisor * quotient === dividend, `${type.sourceItemId}: 나눗셈이 나누어떨어지지 않습니다.`);
    const expected = `㉠=${String(divisor).at(-1)},㉡=${String(dividend)[1]},㉢=${String(quotient)[0]}`;
    check(normalize(generated.answer) === expected, `${type.sourceItemId}: 숨은 숫자 답이 다릅니다.`);
  } else if (variant === 6) {
    const divisor = Number(meta.divisor);
    const dividend = Number(meta.dividend);
    const quotient = Number(meta.quotient);
    const remainder = Number(meta.remainder);
    check(divisor * quotient + remainder === dividend && remainder < divisor, `${type.sourceItemId}: 몫과 나머지 조건이 틀립니다.`);
    const expected = Number(String(divisor)[0]) + Number(String(quotient)[0]) + remainder % 10;
    check(Number(generated.answer) === expected, `${type.sourceItemId}: 기호 합이 다릅니다.`);
  } else if (variant === 7) {
    const expected = zeroOneEquations(Number(meta.leftDigits), Number(meta.rightDigits), Number(meta.productDigits)).length;
    check(Number(generated.answer) === expected, `${type.sourceItemId}: 0과 1 곱셈식 개수가 다릅니다.`);
  } else if (variant === 8) {
    const divisor = Number(meta.divisor);
    const dividend = Number(meta.dividend);
    const quotient = Number(meta.quotient);
    const steps = trace(dividend, divisor);
    check(divisor * quotient === dividend && steps.length === 3 && steps.at(-1).remainder === 0, `${type.sourceItemId}: 나눗셈 세로셈 단계가 맞지 않습니다.`);
  } else if (variant === 9) {
    const expected = cardAnswers({
      digits: meta.digits.split(",").map(Number),
      fixedLast: Number(meta.fixedLast),
      multiplier: Number(meta.multiplier)
    });
    check(normalize(generated.answer) === expected.join(","), `${type.sourceItemId}: 수 카드 곱셈식 전수 결과가 다릅니다.`);
  }
}

check(21978 * 4 === 87912 && [2, 1, 9, 7, 8].reduce((total, digit) => total * digit, 1) === 1008, "Mission 2 원본 기준값이 다릅니다.");
check(zeroOneEquations(3, 2, 4).length === 6, "Mission 4 원본 조건의 곱셈식은 6개여야 합니다.");
check(cardAnswers({ digits: [1, 3, 5, 6, 7, 9], fixedLast: 2, multiplier: 4 }).join(",") === "156,316", "Mission 6 원본 기준 답은 156, 316이어야 합니다.");

if (failures.length) {
  console.error(`4-1 계산식 완성하기 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 계산식 완성하기 감사 통과: 원문 10유형 · ${generatedCount.toLocaleString()}회 생성 · 복면산/나눗셈/전수 나열 독립 검산`);
