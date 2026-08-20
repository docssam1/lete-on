"use strict";

// Independent regression check for 5-1 unit 5 fraction addition/subtraction.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  { id: "5-1-u5-t1", name: "분수의 덧셈" },
  { id: "5-1-u5-t2", name: "분수의 뺄셈" },
  { id: "5-1-u5-t3", name: "식 세워 풀기" },
  { id: "5-1-u5-t4", name: "단위분수와 부분분수" }
];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const normalize = (numerator, denominator) => {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const add = (left, right) => normalize(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => normalize(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const parseImproper = text => {
  const parts = String(text).trim().split(/\s+/);
  if (parts.length === 2 && parts[1].includes("/")) {
    const [remainder, denominator] = parts[1].split("/").map(Number);
    return normalize(Number(parts[0]) * denominator + remainder, denominator);
  }
  if (parts[0].includes("/")) {
    const [numerator, denominator] = parts[0].split("/").map(Number);
    return normalize(numerator, denominator);
  }
  return normalize(Number(parts[0]), 1);
};
const equal = (left, right) => left.numerator === right.numerator && left.denominator === right.denominator;

for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      for (let variant = 0; variant < 3; variant += 1) {
        const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed} / 변형 ${variant}`;
        let generated;
        try {
          generated = api.generate({ ...type, semesterId: "5-1", unitId: "5-1-u5" }, 0, difficulty, seed, variant);
        } catch (error) {
          failures.push(`${context}: ${error.message}`);
          continue;
        }
        check(generated?.generator && generated.answer && generated.solution, `${context}: 결과가 비어 있습니다.`);
        check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 계산값이 깨졌습니다.`);
        const equation = generated.prompt.match(/<div class="equation"[^>]*data-fraction-kind="[^"]+"[^>]*>/)?.[0];
        if (!equation) {
          check(type.id === "5-1-u5-t3" && variant === 2, `${context}: 검산용 분수 식이 없습니다.`);
          continue;
        }
        const kind = attribute(equation, "data-fraction-kind");
        const expected = parseImproper(attribute(equation, "data-fraction-expected"));
        const actual = parseImproper(generated.answer);
        check(equal(expected, actual), `${context}: 표시 정답과 내부 정답이 다릅니다.`);
        const terms = (attribute(equation, "data-fraction-terms") || "").split(";").filter(Boolean).map(parseImproper);
        if (kind === "add") check(equal(expected, add(terms[0], terms[1])), `${context}: 덧셈 계산이 틀렸습니다.`);
        if (kind === "subtract") check(equal(expected, subtract(terms[0], terms[1])), `${context}: 뺄셈 계산이 틀렸습니다.`);
        if (kind === "add-blank") check(equal(expected, terms[0]), `${context}: 덧셈 빈칸 정답이 틀렸습니다.`);
        if (kind === "subtract-blank") check(equal(expected, terms[0]), `${context}: 뺄셈 빈칸 정답이 틀렸습니다.`);
        if (kind === "add-word") check(equal(expected, add(add(terms[0], terms[1]), terms[2])), `${context}: 덧셈 문장제 계산이 틀렸습니다.`);
        if (kind === "subtract-word") check(equal(expected, subtract(subtract(terms[0], terms[1]), terms[2])), `${context}: 뺄셈 문장제 계산이 틀렸습니다.`);
        if (kind === "equation-blank") check(equal(expected, subtract(add(terms[0], terms[1]), terms[2])), `${context}: 식 세워 풀기 빈칸 계산이 틀렸습니다.`);
        if (kind === "unit-add") check(equal(expected, add(terms[0], terms[1])), `${context}: 단위분수 합이 틀렸습니다.`);
        if (kind === "unit-blank-right") check(equal(expected, subtract(terms[0], terms[1])), `${context}: 부분분수 오른쪽 빈칸이 틀렸습니다.`);
        if (kind === "unit-blank-left") check(equal(expected, subtract(terms[0], terms[1])), `${context}: 부분분수 왼쪽 빈칸이 틀렸습니다.`);
      }
    }
  }
}

if (failures.length) {
  console.error(`분수 덧셈·뺄셈 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log("분수의 덧셈과 뺄셈 감사 통과: 4유형, 12,600개 생성");
