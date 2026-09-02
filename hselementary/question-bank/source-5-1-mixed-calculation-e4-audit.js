"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-1-mixed-calculation.json"), "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u1");
const types = unit?.subunits.find(item => item.name === "혼합 계산식 만들기")?.types || [];
const sourceItems = inventory.items.filter(item => item.exploration === 4);
const failures = [];
const distinct = new Map();
const difficultyDistinct = new Map();
const difficultyPrompts = new Map();
const maximumFiveCache = new Map();
let checked = 0;

const natural = value => Number.isInteger(value) && value > 0;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  if (!denominator) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const operate = (left, right, operator) => {
  if (!left || !right) return null;
  if (operator === "+") return rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "-") return rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
  if (operator === "×") return rational(left.numerator * right.numerator, left.denominator * right.denominator);
  if (operator === "÷") return right.numerator ? rational(left.numerator * right.denominator, left.denominator * right.numerator) : null;
  return null;
};
const isNaturalRational = value => Boolean(value && value.denominator === 1 && value.numerator > 0);
const flat = (numbers, operators) => {
  const terms = [rational(numbers[0])];
  const plusMinus = [];
  for (let index = 0; index < operators.length; index += 1) {
    const next = rational(numbers[index + 1]);
    if (operators[index] === "×" || operators[index] === "÷") terms[terms.length - 1] = operate(terms[terms.length - 1], next, operators[index]);
    else { plusMinus.push(operators[index]); terms.push(next); }
  }
  return terms.slice(1).reduce((total, value, index) => operate(total, value, plusMinus[index]), terms[0]);
};
const permutations = values => {
  const output = [];
  const visit = (chosen, rest) => {
    if (!rest.length) { output.push(chosen); return; }
    rest.forEach((value, index) => visit([...chosen, value], [...rest.slice(0, index), ...rest.slice(index + 1)]));
  };
  visit([], values);
  return output;
};
const fail = (type, difficulty, seed, message) => failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${message}`);
const metadata = prompt => {
  const match = String(prompt).match(/data-mixed-e4-kind="([^"]+)"\s+data-mixed-e4-values="([^"]+)"\s+data-result-contract="([^"]+)"/);
  if (!match) throw new Error("E4 검수용 계산 계약이 없습니다.");
  return { kind: match[1], values: match[2].split(",").map(Number), contract: match[3] };
};

function maximumFourCards(cards) {
  const candidates = permutations(cards).map(([a, b, c, d]) => {
    const difference = a - b;
    return difference > 0 && (difference * c) % d === 0 ? { order: [a, b, c, d], value: difference * c / d } : null;
  }).filter(Boolean);
  const maximum = Math.max(...candidates.map(candidate => candidate.value));
  const ranking = [...new Set(candidates.map(candidate => candidate.value))].sort((left, right) => right - left);
  return { maximum, second: ranking[1], winners: candidates };
}

function allParenthesizedValues(numbers, operators) {
  if (numbers.length === 1) return [rational(numbers[0])];
  const values = [];
  for (let pivot = 1; pivot < numbers.length; pivot += 1) {
    const left = allParenthesizedValues(numbers.slice(0, pivot), operators.slice(0, pivot - 1));
    const right = allParenthesizedValues(numbers.slice(pivot), operators.slice(pivot));
    for (const first of left) for (const second of right) {
      const value = operate(first, second, operators[pivot - 1]);
      if (isNaturalRational(value)) values.push(value);
    }
  }
  return values;
}

function flatNatural(numbers, operators) {
  const values = numbers.map(number => rational(number));
  const signs = [...operators];
  for (let index = 0; index < signs.length;) {
    if (signs[index] !== "×" && signs[index] !== "÷") { index += 1; continue; }
    const value = operate(values[index], values[index + 1], signs[index]);
    if (!isNaturalRational(value)) return null;
    values.splice(index, 2, value);
    signs.splice(index, 1);
  }
  let total = values[0];
  for (let index = 0; index < signs.length; index += 1) {
    total = operate(total, values[index + 1], signs[index]);
    if (!isNaturalRational(total)) return null;
  }
  return total;
}

function maximumFiveCards(cards) {
  const key = [...cards].sort((left, right) => left - right).join(",");
  if (maximumFiveCache.has(key)) return maximumFiveCache.get(key);
  const values = [];
  for (const numbers of permutations(cards)) for (const operators of permutations(["+", "-", "×", "÷"])) {
    for (let first = 0; first < numbers.length - 1; first += 1) for (let last = first + 1; last < numbers.length; last += 1) {
      const inside = flatNatural(numbers.slice(first, last + 1), operators.slice(first, last));
      if (!inside) continue;
      const groupedNumbers = [...numbers.slice(0, first), inside.numerator, ...numbers.slice(last + 1)];
      const groupedOperators = [...operators.slice(0, first), ...operators.slice(last)];
      const value = flatNatural(groupedNumbers, groupedOperators);
      if (value) values.push(value.numerator);
    }
  }
  const maximum = Math.max(...values);
  maximumFiveCache.set(key, maximum);
  return maximum;
}

function maximumTwoDigit(digits) {
  const candidates = [];
  for (const first of digits) for (const second of digits) {
    if (first === second) continue;
    const rest = digits.filter(value => value !== first && value !== second);
    for (const [subtract, divisor, multiplier] of permutations(rest)) {
      const leading = first * 10 + second;
      if (leading <= subtract || (leading - subtract) % divisor) continue;
      candidates.push({ order: [first, second, subtract, divisor, multiplier], value: (leading - subtract) / divisor * multiplier });
    }
  }
  const maximum = Math.max(...candidates.map(candidate => candidate.value));
  const ranking = [...new Set(candidates.map(candidate => candidate.value))].sort((left, right) => right - left);
  return { maximum, second: ranking[1], winners: candidates };
}

function parenthesizedResults() {
  const numbers = [4, 16, 8, 6, 2];
  const operators = ["×", "+", "-", "÷"];
  const values = new Set();
  for (let first = 0; first < numbers.length - 1; first += 1) for (let last = first + 1; last < numbers.length; last += 1) {
    const inside = flat(numbers.slice(first, last + 1), operators.slice(first, last));
    if (!isNaturalRational(inside)) continue;
    const groupedNumbers = [...numbers.slice(0, first), inside.numerator, ...numbers.slice(last + 1)];
    const groupedOperators = [...operators.slice(0, first), ...operators.slice(last)];
    const result = flat(groupedNumbers, groupedOperators);
    if (isNaturalRational(result)) values.add(result.numerator);
  }
  return [...values].sort((left, right) => left - right);
}

function onePairResults(numbers, operators) {
  const output = [];
  for (let first = 0; first < numbers.length - 1; first += 1) for (let last = first + 1; last < numbers.length; last += 1) {
    const inside = flat(numbers.slice(first, last + 1), operators.slice(first, last));
    if (!isNaturalRational(inside)) continue;
    const groupedNumbers = [...numbers.slice(0, first), inside, ...numbers.slice(last + 1)];
    const groupedOperators = [...operators.slice(0, first), ...operators.slice(last)];
    const value = flat(groupedNumbers, groupedOperators);
    if (isNaturalRational(value)) output.push({ first, last, value: value.numerator });
  }
  return output;
}

const codeOperator = code => ["+", "-", "×", "÷"][code - 1] || null;
const expressionText = (numbers, operators, first = -1, last = -1) => numbers.map((number, index) => `${index === first ? "(" : ""}${number}${index === last ? ")" : ""}${index < operators.length ? ` ${operators[index]} ` : ""}`).join("");
const answerNumbers = answer => (String(answer).match(/\d+/g) || []).map(Number);
const textLines = text => String(text).replace(/<br\s*\/?>/g, "\n").replace(/\s+;\s+/g, "\n").replace(/<[^>]+>/g, "").split("\n").map(line => line.trim()).filter(Boolean);

function parseExpression(text) {
  const source = String(text).replace(/\s+/g, "");
  const tokens = source.match(/\d+|[()+\-×÷]/g) || [];
  if (tokens.join("") !== source) throw new Error(`식에 허용되지 않은 문자가 있습니다: ${text}`);
  let cursor = 0;
  const primary = () => {
    const token = tokens[cursor++];
    if (token === "(") { const node = additive(); if (tokens[cursor++] !== ")") throw new Error("괄호가 닫히지 않았습니다."); return node; }
    if (/^\d+$/.test(token || "")) return { value: rational(Number(token)), numbers: [Number(token)], operators: [], pairs: 0, natural: true };
    throw new Error("수 또는 여는 괄호가 필요합니다.");
  };
  const combine = (left, operator, right) => {
    const value = operate(left.value, right.value, operator);
    return { value, numbers: [...left.numbers, ...right.numbers], operators: [...left.operators, operator, ...right.operators], pairs: left.pairs + right.pairs, natural: left.natural && right.natural && isNaturalRational(value) };
  };
  const multiplicative = () => {
    let node = primary();
    while (["×", "÷"].includes(tokens[cursor])) node = combine(node, tokens[cursor++], primary());
    return node;
  };
  const additive = () => {
    let node = multiplicative();
    while (["+", "-"].includes(tokens[cursor])) node = combine(node, tokens[cursor++], multiplicative());
    return node;
  };
  const root = additive();
  if (cursor !== tokens.length) throw new Error("식 끝에 남은 토큰이 있습니다.");
  root.pairs = (tokens.filter(token => token === "(").length);
  return root;
}

function visibleEquations(answer) {
  return textLines(answer).filter(line => line.includes("=")).map(line => {
    const normalized = line.replace(/^예시 답:\s*/, "").replace(/^\(\d+\)\s*/, "").replace(/^\d+\.\s*/, "");
    const [left, right] = normalized.split("=").map(part => part.trim());
    const parsed = parseExpression(left);
    if (!/^\d+$/.test(right || "") || !parsed.value || parsed.value.denominator !== 1 || parsed.value.numerator !== Number(right)) throw new Error(`보이는 식 계산이 맞지 않습니다: ${line}`);
    return parsed;
  });
}

function sameNumbers(left, right) {
  return [...left].sort((a, b) => a - b).join(",") === [...right].sort((a, b) => a - b).join(",");
}

function sourceFourFoursResults() {
  const tree = item => typeof item === "number" ? rational(item) : operate(tree(item[1]), tree(item[2]), item[0]);
  return [
    ["÷", ["+", 4, 4], ["+", 4, 4]],
    ["+", ["÷", 4, 4], ["÷", 4, 4]],
    ["÷", ["+", ["+", 4, 4], 4], 4],
    ["+", 4, ["×", ["-", 4, 4], 4]],
    ["÷", ["+", ["×", 4, 4], 4], 4],
    ["+", 4, ["÷", ["+", 4, 4], 4]],
    ["-", ["+", 4, 4], ["÷", 4, 4]],
    ["-", ["+", ["+", 4, 4], 4], 4],
    ["+", ["+", 4, 4], ["÷", 4, 4]],
    ["÷", ["-", 44, 4], 4]
  ].map(item => tree(item)?.numerator);
}

function decodeThreeParentheses(values) {
  const rows = [];
  let cursor = 0;
  for (let row = 0; row < 3; row += 1) {
    const count = values[cursor++];
    if (!Number.isInteger(count) || count < 4 || count > 5) throw new Error("세 괄호 식의 수 개수가 올바르지 않습니다.");
    const numbers = values.slice(cursor, cursor + count); cursor += count;
    const operators = values.slice(cursor, cursor + count - 1).map(codeOperator); cursor += count - 1;
    const first = values[cursor++];
    const last = values[cursor++];
    const target = values[cursor++];
    if (operators.some(operator => !operator) || !natural(target)) throw new Error("세 괄호 식 계약값이 올바르지 않습니다.");
    rows.push({ numbers, operators, first, last, target });
  }
  if (cursor !== values.length) throw new Error("세 괄호 식 계약에 남은 값이 있습니다.");
  return rows;
}

function verifyGenerated(type, generated, difficulty) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 비었습니다.");
  if (/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("잘못된 값이 화면에 있습니다.");
  const { kind, values, contract } = metadata(generated.prompt);
  const expectedContract = inventory.resultContracts[type.sourceItemId];
  if (contract !== expectedContract) throw new Error(`답 형식 계약이 ${expectedContract}가 아닙니다.`);
  if (["rubric", "set", "ordered"].includes(contract) && !String(generated.answer).trim()) throw new Error("여러 답 형식의 예시 답이 비었습니다.");
  if (contract === "rubric" && !String(generated.answer).startsWith("예시 답:")) throw new Error("열린 식에 예시 답 표시가 없습니다.");
  distinct.get(type.id).add(`${kind}:${values.join(",")}`);
  const visiblePrompt = String(generated.prompt).replace(/<span hidden[^>]*><\/span>/g, "").replace(/\s+/g, " ").trim();
  difficultyDistinct.get(type.id).get(difficulty).add(visiblePrompt);
  difficultyPrompts.get(type.id).get(difficulty).add(visiblePrompt);
  if (kind === "four-fours") {
    const [mode, ...targets] = values;
    const expected = mode === 1 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (![1, 2, 3].includes(mode) || targets.join(",") !== expected.join(",")) throw new Error("네 개의 4 과업량이 난이도 기준과 다릅니다.");
    if (mode === 3 && !String(generated.prompt).includes("붙여 쓰지 마세요")) throw new Error("높음 난이도의 붙여 쓰기 조건이 없습니다.");
    for (const target of targets) if (!String(generated.answer).includes(`= ${target}`)) throw new Error(`네 개의 4에서 ${target} 식이 없습니다.`);
  } else if (kind === "four-operators") {
    const [mode, a, b, c, d, e, target] = values;
    if (!(a > b * c && d % e === 0 && a - b * c + d / e === target && natural(target))) throw new Error("네 기호 식의 자연수 계산 조건이 다릅니다.");
    const [equation] = visibleEquations(generated.answer);
    if (!equation || !sameNumbers(equation.numbers, [a, b, c, d, e]) || equation.operators.sort().join(",") !== ["+", "-", "×", "÷"].sort().join(",")) throw new Error("보이는 네 기호 답 식이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("둘째 빈칸")) throw new Error("낮음 난이도 힌트가 없습니다.");
    if (mode === 3 && (!generated.prompt.includes("모두 자연수") || !equation.natural)) throw new Error("높음 자연수 조건이 다릅니다.");
  } else if (kind === "parenthesized-four-operators") {
    const [mode, a, b, c, d, e, target] = values;
    if (!((b + c) % d === 0 && (a * (b + c)) % d === 0 && a * (b + c) / d - e === target && natural(target))) throw new Error("괄호가 있는 네 기호 식의 자연수 계산 조건이 다릅니다.");
    const [equation] = visibleEquations(generated.answer);
    if (!equation || equation.pairs !== 1 || !sameNumbers(equation.numbers, [a, b, c, d, e]) || equation.operators.sort().join(",") !== ["+", "-", "×", "÷"].sort().join(",")) throw new Error("보이는 괄호 네 기호 답 식이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("괄호 안 빈칸")) throw new Error("낮음 난이도 힌트가 없습니다.");
    if (mode === 3 && (!generated.prompt.includes("모두 자연수") || !equation.natural)) throw new Error("높음 자연수 조건이 다릅니다.");
  } else if (kind === "multiply-divide-parentheses") {
    const [mode, a, b, c, d, e, target] = values;
    const equations = visibleEquations(generated.answer);
    if (!equations.length || equations.some(equation => !sameNumbers(equation.numbers, [a, b, c, d, e]) || equation.pairs !== 1 || equation.operators.some(operator => !["×", "÷"].includes(operator)) || !equation.natural)) throw new Error("보이는 곱셈·나눗셈 답 식이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("힌트")) throw new Error("낮음 난이도 괄호 힌트가 없습니다.");
    if (mode === 2 && equations.length !== 1) throw new Error("표준 난이도는 한 식이어야 합니다.");
    if (mode === 3 && equations.length !== 2) throw new Error("높음 난이도는 모든 두 식을 써야 합니다.");
  } else if (kind === "maximum-four-cards") {
    const [mode, ...rest] = values; const cards = rest.slice(0, 4); const { maximum, second, winners } = maximumFourCards(cards);
    const placed = answerNumbers(generated.answer);
    if (winners.filter(candidate => candidate.value === maximum).length !== 1 || (mode === 3 && winners.filter(candidate => candidate.value === second).length !== 1) || rest[4] !== maximum || (mode === 3 && rest[5] !== second) || !String(generated.solution).includes(`= ${maximum}`)) throw new Error("네 카드 최대 자연수 전수 결과가 다릅니다.");
    if (mode === 3 ? placed.join(",") !== [...winners.find(candidate => candidate.value === maximum).order, ...winners.find(candidate => candidate.value === second).order].join(",") : placed.join(",") !== winners.find(candidate => candidate.value === maximum).order.join(",")) throw new Error("보이는 네 카드 순서 답이 전수 winner와 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("첫째 칸")) throw new Error("낮음 난이도 카드 힌트가 없습니다.");
  } else if (kind === "maximum-five-cards") {
    const [mode, ...rest] = values; const cards = rest.slice(0, 5);
    const maximum = maximumFiveCards(cards);
    const equations = visibleEquations(generated.answer);
    if (rest[5] !== maximum || equations.length !== (mode === 3 ? 2 : 1)) throw new Error("다섯 카드 최대 자연수 전수 결과가 다릅니다.");
    if (equations.some(equation => equation.pairs !== 1 || !equation.natural || !sameNumbers(equation.numbers, cards) || equation.operators.sort().join(",") !== ["+", "-", "×", "÷"].sort().join(","))) throw new Error("보이는 다섯 카드 답 식 조건이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("괄호 안")) throw new Error("낮음 난이도 괄호 힌트가 없습니다.");
    if (mode === 3 && new Set(textLines(generated.answer)).size < 2) throw new Error("높음 난이도 식 두 개가 다르지 않습니다.");
  } else if (kind === "five-same-numbers") {
    const [mode, value, answer] = values;
    const equations = visibleEquations(generated.answer);
    if (!(value >= 2 && value <= 9 && answer === 1 && equations.length === (mode === 3 ? 2 : 1))) throw new Error("같은 수 다섯 개 과업량이 다릅니다.");
    if (equations.some(equation => equation.numbers.length !== 5 || equation.numbers.some(number => number !== value) || equation.operators.sort().join(",") !== ["+", "-", "×", "÷"].sort().join(","))) throw new Error("보이는 같은 수 다섯 개 식이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("꼴로")) throw new Error("낮음 난이도 식 틀 힌트가 없습니다.");
  } else if (kind === "two-operators") {
    const [mode] = values;
    const [equation] = visibleEquations(generated.answer);
    if (!(equation && equation.value.numerator === 12 && equation.operators.join(",") === "÷,+,×,-")) throw new Error("Mission 2 기호 배치가 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("÷ 또는 +")) throw new Error("낮음 난이도 기호 후보 힌트가 없습니다.");
    if (mode === 3 && !generated.prompt.includes("서로 달라야")) throw new Error("높음 난이도 서로 다른 기호 조건이 없습니다.");
  } else if (kind === "three-parentheses") {
    const [mode, count] = values;
    const equations = visibleEquations(generated.answer);
    if (count !== mode || equations.length !== count || equations.some(equation => equation.pairs !== 1)) throw new Error("Mission 3 난이도별 괄호 과업량이 다릅니다.");
  } else if (kind === "maximum-two-digit") {
    const [mode, ...rest] = values; const cards = rest.slice(0, 5); const { maximum, second, winners } = maximumTwoDigit(cards);
    const placed = answerNumbers(generated.answer);
    if (winners.filter(candidate => candidate.value === maximum).length !== 1 || (mode === 3 && winners.filter(candidate => candidate.value === second).length !== 1) || rest[5] !== maximum || (mode === 3 && rest[6] !== second) || !String(generated.solution).includes(`= ${maximum}`)) throw new Error("두 자리 수 카드 최대값 전수 결과가 다릅니다.");
    const top = winners.find(candidate => candidate.value === maximum); const next = winners.find(candidate => candidate.value === second);
    if (mode === 3 ? placed.join(",") !== [...top.order, ...next.order].join(",") : placed.join(",") !== top.order.join(",")) throw new Error("보이는 두 자리 카드 순서 답이 전수 winner와 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("십의 자리")) throw new Error("낮음 난이도 첫 숫자 힌트가 없습니다.");
  } else if (kind === "impossible-parentheses") {
    const [mode, ...choices] = values;
    const possible = parenthesizedResults();
    const expected = choices.filter(choice => !possible.includes(choice)).sort((left, right) => left - right);
    if (answerNumbers(generated.answer).sort((left, right) => left - right).join(",") !== expected.join(",") || expected.length !== mode) throw new Error("Mission 5 난이도별 불가능 답 집합이 다릅니다.");
  } else if (kind === "four-cards-one") {
    const [mode, first, second, third, fourth, answer] = values;
    const equations = visibleEquations(generated.answer);
    if (!(second === first + 1 && third === first + 2 && fourth === first + 3 && answer === 1 && equations.length === (mode === 3 ? 2 : 1) && String(generated.prompt).includes("붙여 쓰지는 않습니다"))) throw new Error("연속 카드 한 번씩·붙여 쓰기 금지 계약이 다릅니다.");
    if (equations.some(equation => !sameNumbers(equation.numbers, [first, second, third, fourth]) || equation.pairs !== 2 || equation.value.numerator !== 1)) throw new Error("보이는 연속 카드 답 식이 다릅니다.");
    if (mode === 1 && !generated.prompt.includes("꼴로")) throw new Error("낮음 난이도 식 틀 힌트가 없습니다.");
  } else throw new Error(`알 수 없는 E4 계약 ${kind}`);
}

if (types.length !== 12 || sourceItems.length !== 12) failures.push(`개념탐구 4는 본문 2개·예제 4개·Mission 6개인 12유형이어야 합니다: ${types.length}, ${sourceItems.length}`);
if (unit?.subunits.flatMap(item => item.types).length !== 45 || inventory.items.length !== 45) failures.push("5-1 1단원은 45유형이어야 합니다.");
const sourceById = new Map(sourceItems.map(item => [item.sourceItemId, item]));
for (const type of types) {
  const source = sourceById.get(type.sourceItemId);
  if (!source || source.implementationStatus !== "ready" || type.reviewLocked || api.generatorKey(type) !== "mixedCalculationE4") failures.push(`${type.id}: E4 원문 상태 또는 생성기 연결이 다릅니다.`);
  if (!inventory.resultContracts[type.sourceItemId]) failures.push(`${type.id}: E4 답 형식 계약이 없습니다.`);
  distinct.set(type.id, new Set());
  difficultyDistinct.set(type.id, new Map([-1, 0, 1].map(difficulty => [difficulty, new Set()])));
  difficultyPrompts.set(type.id, new Map([-1, 0, 1].map(difficulty => [difficulty, new Set()])));
}
if (sourceFourFoursResults().join(",") !== "1,2,3,4,5,6,7,8,9,10" || maximumFourCards([2, 3, 6, 8]).maximum !== 15 || maximumFiveCards([1, 3, 4, 5, 7]) !== 60 || maximumTwoDigit([1, 3, 5, 7, 8]).maximum !== 576 || parenthesizedResults().join(",") !== "33,36,65,69,84,93") failures.push("원문 기준 식·최대값 또는 괄호 결과 전수 계산이 다릅니다.");

for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try { verifyGenerated(type, api.generate(type, 0, difficulty, seed, type.variant), difficulty); checked += 1; }
  catch (error) { fail(type, difficulty, seed, error.message); }
}

for (const type of types) {
  const minimum = type.variant === 0 ? 2 : [7, 8, 10].includes(type.variant) ? 1 : 3;
  if (distinct.get(type.id).size < minimum) failures.push(`${type.id}: 실제 생성 사례 수가 부족합니다 (${distinct.get(type.id).size}개).`);
  const difficultyMinimum = [0, 3, 7, 8, 10].includes(type.variant) ? 1 : 3;
  for (const difficulty of [-1, 0, 1]) if (difficultyDistinct.get(type.id).get(difficulty).size < difficultyMinimum) failures.push(`${type.id} / 난이도 ${difficulty}: 실제 생성 사례 수가 부족합니다 (${difficultyDistinct.get(type.id).get(difficulty).size}개, 기준 ${difficultyMinimum}개).`);
  const representatives = [-1, 0, 1].map(difficulty => [...difficultyPrompts.get(type.id).get(difficulty)][0]);
  if (new Set(representatives).size !== 3) failures.push(`${type.id}: 난이도별 보이는 과업 또는 조건이 서로 달라야 합니다.`);
}

if (failures.length) {
  console.error(`5-1 자연수의 혼합 계산 개념탐구 4 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`5-1 자연수의 혼합 계산 개념탐구 4 감사 통과: 원문 12유형 · ${checked.toLocaleString()}회 자연수 계산·전수 열거·답 형식·실제 다양성 검사`);
