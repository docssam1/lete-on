"use strict";

const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "5-1-unit-2-factor-multiple.json"), "utf8"));
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1").units.find(item => item.id === "5-1-u2");
const types = unit.subunits.flatMap(item => item.types);
const e4 = types.filter(type => type.sourceItemId.startsWith("5-1-u2-e4-"));
const failures = [];
let checked = 0;

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const normalizeSet = values => values.map(String).sort((left, right) => (/^\d+$/.test(left) && /^\d+$/.test(right) ? Number(left) - Number(right) : left.localeCompare(right, "ko")));
const setAnswer = answer => normalizeSet(String(answer).split(",").map(value => value.trim()).filter(Boolean));
const sameSet = (actual, expected) => actual.length === expected.length && actual.every((value, index) => value === String(expected[index]));
const plainPrompt = prompt => prompt.replace(/<span hidden[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const evidence = prompt => {
  const match = prompt.match(/data-factor-multiple-e4-kind="([^"]+)" data-factor-multiple-e4-values="([^"]*)" data-result-contract="([^"]+)"/);
  if (!match) throw new Error("검산용 근거가 없습니다.");
  return { kind: match[1], values: match[2] ? match[2].split(",").map(Number) : [], contract: match[3] };
};
const permutations = (cards, length) => {
  const values = [];
  const visit = (picked, rest) => {
    if (picked.length === length) { values.push(Number(picked.join(""))); return; }
    rest.forEach((card, index) => visit([...picked, card], [...rest.slice(0, index), ...rest.slice(index + 1)]));
  };
  visit([], cards);
  return values;
};

function expected(type, prompt) {
  const { kind, values, contract } = evidence(prompt);
  const text = plainPrompt(prompt);
  if (type.variant === 0) {
    if (!/축구공 \d+개.*□\d{4}□원/.test(text)) throw new Error("가격 빈칸 구조가 화면에 보이지 않습니다.");
    const [count, ...totals] = values;
    return { contract, value: totals.map(total => total / count) };
  }
  if (type.variant === 1) {
    if (!/㉠ = \d+ \+ \d+.*9로 나눈 나머지/.test(text)) throw new Error("9로 나눈 나머지 구조가 화면에 보이지 않습니다.");
    return { contract, value: (values[0] + values[1]) % 9 };
  }
  if (type.variant === 2) {
    if (!/과 0으로만.*75로 나누어떨어지는 가장 작은/.test(text)) throw new Error("0과 한 숫자로 만든 수 구조가 화면에 보이지 않습니다.");
    const [digit, divisor] = values;
    for (let length = 1; length <= 8; length += 1) for (let mask = 0; mask < 2 ** (length - 1); mask += 1) {
      const value = Number(`${digit}${mask.toString(2).padStart(length - 1, "0").replaceAll("1", String(digit))}`);
      if (value % divisor === 0) return { contract, value };
    }
  }
  if (type.variant === 3) {
    if (!/세 장을 사용.*12의 배수/.test(text)) throw new Error("수 카드와 12의 배수 구조가 화면에 보이지 않습니다.");
    return { contract, value: permutations(values, 3).filter(value => value % 12 === 0).length };
  }
  if (type.variant === 4) {
    if (!/ABABA꼴.*6의 배수/.test(text)) throw new Error("되풀이 자리 구조가 화면에 보이지 않습니다.");
    const [first] = values;
    return { contract, value: range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`${first}${a}${b}${a}${b}${a}`) % 6 === 0)).length };
  }
  if (type.variant === 5) {
    if (!/36의 배수를 모두/.test(text)) throw new Error("목록에서 36의 배수 찾기 구조가 화면에 보이지 않습니다.");
    return { contract, value: values.map((value, index) => ({ value, label: "①②③④⑤⑥⑦⑧"[index] })).filter(item => item.value % 36 === 0).map(item => item.label) };
  }
  if (type.variant === 6) {
    if (!/3의 배수이거나 4의 배수/.test(text)) throw new Error("3 또는 4의 배수 구조가 화면에 보이지 않습니다.");
    return { contract, value: permutations(values, 3).filter(value => value >= 100 && (value % 3 === 0 || value % 4 === 0)).length };
  }
  if (type.variant === 7) {
    if (!/네 자리 수 \d□\d□.*9의 배수/.test(text)) throw new Error("두 빈칸과 9의 배수 구조가 화면에 보이지 않습니다.");
    const [first, third] = values;
    return { contract, value: range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`${first}${a}${third}${b}`) % 9 === 0)).length };
  }
  if (type.variant === 8) {
    if (!/BABAB.*12의 배수/.test(text)) throw new Error("일곱 자리 되풀이 구조가 화면에 보이지 않습니다.");
    const [edge] = values;
    return { contract, value: range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`${edge}${b}${a}${b}${a}${b}${edge}`) % 12 === 0)).length };
  }
  if (type.variant === 9) {
    if (!/여섯 자리 자연수 중에서 \d+번째로 큰 3의 배수/.test(text)) throw new Error("순위와 3의 배수 구조가 화면에 보이지 않습니다.");
    const [low, high, rank] = values;
    const candidates = range(0, 63).map(mask => mask.toString(2).padStart(6, "0").replaceAll("0", String(low)).replaceAll("1", String(high))).map(Number).filter(value => value % 3 === 0).sort((left, right) => right - left);
    return { contract, value: candidates[rank - 1] };
  }
  if (!/두 자리 수 □□\d.*36의 배수/.test(text)) throw new Error("가장 큰 두 자리 빈칸 구조가 화면에 보이지 않습니다.");
  const [last, addend] = values;
  return { contract, value: range(10, 99).filter(value => (Number(`${value}${last}`) + addend) % 36 === 0).at(-1) };
}

const sourceAnswers = [
  [2085, 3474], 1, 77700, 12, 20,
  ["①", "③", "⑤", "⑥", "⑧"], 11, 11, 15, 998898, 82
];
if (e4.length !== 11 || types.length !== 96 || inventory.items.filter(item => item.implementationStatus === "ready").length !== 81 || inventory.items.filter(item => item.implementationStatus === "review-locked").length !== 15) failures.push("원문 96유형과 공개 81/잠금 15 수가 다릅니다.");
for (const type of types) if (!type.sourceVerified || (!type.reviewLocked && !["factorMultipleE1", "factorMultipleE2", "factorMultipleE3", "factorMultipleE4", "factorMultipleE5", "factorMultipleE6", "factorMultipleE7"].includes(api.generatorKey(type))) || (type.reviewLocked && api.generatorKey(type))) failures.push(`${type.id}: 원본·잠금·생성기 연결이 다릅니다.`);

const sourceComputed = [
  [150120, 250128].map(value => value / 72),
  (13579 + 246810) % 9,
  77700,
  permutations([3, 4, 5, 6, 7, 8], 3).filter(value => value % 12 === 0).length,
  range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`3${a}${b}${a}${b}${a}`) % 6 === 0)).length,
  [363636, 1000036, 3366336636, 333366636, 36036036036036, 12345678900, 1212121212, 121212121212].map((value, index) => ({ value, label: "①②③④⑤⑥⑦⑧"[index] })).filter(item => item.value % 36 === 0).map(item => item.label),
  permutations([0, 2, 4, 5], 3).filter(value => value >= 100 && (value % 3 === 0 || value % 4 === 0)).length,
  range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`7${a}4${b}`) % 9 === 0)).length,
  range(0, 9).flatMap(a => range(0, 9).filter(b => Number(`2${b}${a}${b}${a}${b}2`) % 12 === 0)).length,
  range(0, 63).map(mask => mask.toString(2).padStart(6, "0").replaceAll("0", "8").replaceAll("1", "9")).map(Number).filter(value => value % 3 === 0).sort((left, right) => right - left)[3],
  range(10, 99).filter(value => (Number(`${value}9`) + 107) % 36 === 0).at(-1)
];
for (const [index, answer] of sourceAnswers.entries()) if (JSON.stringify(answer) !== JSON.stringify(sourceComputed[index])) failures.push(`원본 ${index + 1}번의 독립 계산값이 다릅니다.`);
for (const type of e4) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
    const recalculated = expected(type, generated.prompt);
    if (inventory.resultContracts[type.sourceItemId] !== recalculated.contract) throw new Error("답 형식 계약이 다릅니다.");
    const actual = recalculated.contract === "set" ? setAnswer(generated.answer) : Number(String(generated.answer).replaceAll(",", ""));
    const expectedValue = recalculated.contract === "set" ? normalizeSet(recalculated.value) : recalculated.value;
    if (recalculated.contract === "set" ? !sameSet(actual, expectedValue) : actual !== expectedValue) throw new Error(`독립 계산값 ${expectedValue}과 정답 ${generated.answer}이 다릅니다.`);
    if (/NaN|undefined|Infinity|순열|조합|제곱/.test(`${plainPrompt(generated.prompt)} ${generated.solution}`)) throw new Error("화면 오류 또는 초등 범위를 벗어난 표현이 있습니다.");
    checked += 1;
  } catch (error) { failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); }
}

if (failures.length) { console.error(`5-1 약수와 배수 개념탐구 4 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`); process.exit(1); }
console.log(`5-1 약수와 배수 개념탐구 4 감사 통과: 원문 96유형 · 공개 81/잠금 15 · ${checked.toLocaleString()}회 독립 계산·답 형식·화면 조건 검사`);
