"use strict";

// E1's public variants are checked through visible evidence tags, but every answer
// below is recalculated from the tag rather than accepted from the generator.
const fs = require("node:fs");
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const curriculum = window.HSE_CURRICULUM;
const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u3");
const types = unit?.subunits.flatMap(item => item.types) || [];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);

const readyIds = [
  "5-1-u3-e1-exploration",
  "5-1-u3-e1-example-1-1",
  "5-1-u3-e1-example-1-2",
  "5-1-u3-e1-mission-1",
  "5-1-u3-e1-mission-2",
  "5-1-u3-e1-mission-4",
  "5-1-u3-e1-mission-5"
];
const lockedIds = [
  "5-1-u3-e1-example-1-3",
  "5-1-u3-e1-example-1-4",
  "5-1-u3-e1-mission-3",
  "5-1-u3-e1-mission-6"
];
const expectedVariants = new Map([
  ["5-1-u3-e1-exploration", 0],
  ["5-1-u3-e1-example-1-1", 1],
  ["5-1-u3-e1-example-1-2", 2],
  ["5-1-u3-e1-example-1-3", 3],
  ["5-1-u3-e1-example-1-4", 4],
  ["5-1-u3-e1-mission-1", 5],
  ["5-1-u3-e1-mission-2", 6],
  ["5-1-u3-e1-mission-3", 7],
  ["5-1-u3-e1-mission-4", 8],
  ["5-1-u3-e1-mission-5", 9],
  ["5-1-u3-e1-mission-6", 10]
]);
const contracts = new Map([
  [0, "single-value"], [1, "single-value"], [2, "single-value"],
  [5, "single-value"], [6, "single-value"], [8, "single-value"], [9, "single-value"]
]);

const gcd = (left, right) => right ? gcd(right, left % right) : Math.abs(left);
const normalized = value => String(value).replaceAll(" ", "");
const koreanConsonants = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const koreanVowels = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"];
const onsetIndex = { "ㄱ": 0, "ㄴ": 2, "ㄷ": 3, "ㄹ": 5, "ㅁ": 6, "ㅂ": 7, "ㅅ": 9, "ㅇ": 11, "ㅈ": 12, "ㅊ": 14, "ㅋ": 15, "ㅌ": 16, "ㅍ": 17, "ㅎ": 18 };
const vowelIndex = { "ㅏ": 0, "ㅑ": 2, "ㅓ": 4, "ㅔ": 5, "ㅕ": 6, "ㅗ": 8, "ㅛ": 12, "ㅜ": 13, "ㅠ": 17, "ㅡ": 18, "ㅣ": 20 };
const finalIndex = { "ㄱ": 1, "ㄴ": 4, "ㄷ": 7, "ㄹ": 8, "ㅁ": 16, "ㅂ": 17, "ㅅ": 19, "ㅇ": 21, "ㅈ": 22, "ㅊ": 23, "ㅋ": 24, "ㅌ": 25, "ㅍ": 26, "ㅎ": 27 };

function decodeCaesar(code, shift) {
  return code.replaceAll("_", " ").split("").map(letter => {
    if (letter === " ") return letter;
    if (!/[A-Z]/.test(letter)) throw new Error("Caesar 암호에 알파벳 이외의 문자가 있습니다.");
    return String.fromCharCode(65 + (letter.charCodeAt(0) - 65 - shift + 26) % 26);
  }).join("");
}

function decodeKorean(code) {
  const tokens = [];
  let index = 0;
  while (index < code.length) {
    const initialCode = code[index++];
    const initial = koreanConsonants[initialCode.charCodeAt(0) - 65];
    if (!initial) throw new Error(`알 수 없는 자음 코드 ${initialCode}`);
    let vowel;
    if (code.slice(index, index + 3) === "310") {
      vowel = "ㅔ";
      index += 3;
    } else {
      const numberStart = index;
      if (code[index] === "1" && code[index + 1] === "0") index += 2;
      else if (/\d/.test(code[index] || "")) index += 1;
      const number = Number(code.slice(numberStart, index));
      if (!Number.isInteger(number) || number < 1 || number > koreanVowels.length) throw new Error(`알 수 없는 모음 코드 ${number}`);
      vowel = koreanVowels[number - 1];
    }
    let final = "";
    if (/[A-N]/.test(code[index] || "") && !/\d/.test(code[index + 1] || "")) final = koreanConsonants[code[index++].charCodeAt(0) - 65];
    tokens.push({ initial, vowel, final });
  }
  return tokens.map(({ initial, vowel, final }) => String.fromCharCode(0xAC00 + (onsetIndex[initial] * 21 + vowelIndex[vowel]) * 28 + (final ? finalIndex[final] : 0))).join("");
}

function factorCandidatesFromSamples(samples, predicate) {
  const candidates = [];
  for (let multiplier = -100; multiplier <= 100; multiplier += 1) {
    for (let addend = -200; addend <= 200; addend += 1) if (predicate(multiplier, addend, samples)) candidates.push([multiplier, addend]);
  }
  return candidates;
}

function calculate(kind, values) {
  if (!values.length || values.some(value => typeof value !== "number" && typeof value !== "string")) throw new Error("계산 태그 값이 비어 있거나 잘못되었습니다.");
  if (kind === "caesar-decode") return decodeCaesar(String(values[0]), Number(values[1]));
  if (kind === "affine-rule") return String(Number(values[0]) * Number(values[2]) + Number(values[1]));
  if (kind === "divide-add-rule") {
    const [divisor, addend, target] = values.map(Number);
    if (!Number.isInteger(target / divisor)) throw new Error("나누어떨어지지 않는 입력입니다.");
    return String(target / divisor + addend);
  }
  if (kind === "repeat-even-odd-rule") {
    const presses = Number(values[0]);
    let possible = new Set([1]);
    for (let count = 0; count < presses; count += 1) {
      const previous = new Set();
      for (const value of possible) {
        previous.add(value * 2);
        if (value % 2 === 0) previous.add(value + 1);
      }
      possible = previous;
    }
    return String([...possible].reduce((sum, value) => sum + value, 0));
  }
  if (kind === "korean-letter-code") return decodeKorean(String(values[0]));
  throw new Error(`알 수 없는 대응 규칙 ${kind}`);
}

function readEvidence(prompt) {
  const match = prompt.match(/data-correspondence-e1-kind="([^"\\]+)" data-correspondence-e1-values="([^"\\]*)" data-result-contract="([^"\\]+)"/);
  if (!match) throw new Error("규칙과 대응 독립 계산 태그가 없습니다.");
  const values = match[2].split(",").filter(Boolean).map(value => /^-?\d+$/.test(value) ? Number(value) : value);
  return { kind: match[1], values, contract: match[3] };
}

function assertUniqueRule(prompt, kind) {
  if (kind === "affine-rule") {
    const samples = [...prompt.matchAll(/(\d+)→(-?\d+)/g)].map(match => [Number(match[1]), Number(match[2])]);
    const candidates = factorCandidatesFromSamples(samples, (multiplier, addend, pairs) => pairs.length >= 3 && pairs.every(([input, output]) => multiplier * input + addend === output));
    if (candidates.length !== 1) throw new Error(`곱셈과 덧셈 규칙 후보가 ${candidates.length}개입니다.`);
  }
  if (kind === "divide-add-rule") {
    const samples = [...prompt.matchAll(/(\d+)→(-?\d+)/g)].map(match => [Number(match[1]), Number(match[2])]);
    const candidates = [];
    for (let divisor = 1; divisor <= 100; divisor += 1) for (let addend = -100; addend <= 100; addend += 1) {
      if (samples.every(([input, output]) => input % divisor === 0 && input / divisor + addend === output)) candidates.push([divisor, addend]);
    }
    if (candidates.length !== 1) throw new Error(`나누기와 덧셈 규칙 후보가 ${candidates.length}개입니다.`);
  }
}

function checkSourceReferences() {
  const sourceAnchors = [
    { kind: "caesar-decode", values: ["ORYH", 3], answer: "LOVE" },
    { kind: "affine-rule", values: [7, 3, 41], answer: "290" },
    { kind: "divide-add-rule", values: [4, -1, 100], answer: "24" },
    { kind: "affine-rule", values: [2, -7, 15], answer: "23" },
    { kind: "divide-add-rule", values: [8, 3, 72], answer: "12" },
    { kind: "repeat-even-odd-rule", values: [4], answer: "54" },
    { kind: "korean-letter-code", values: ["G1DD4I7G310H6"], answer: "살려주세요" }
  ];
  for (const [index, anchor] of sourceAnchors.entries()) {
    try {
      const calculated = calculate(anchor.kind, anchor.values);
      if (normalized(calculated) !== normalized(anchor.answer)) fail(`원문 기준 ${index + 1} ${anchor.kind}: 독립 계산 ${calculated}가 기준 답 ${anchor.answer}과 다릅니다.`);
    } catch (error) {
      fail(`원문 기준 ${index + 1} ${anchor.kind}: 기준 코드·조건을 독립 계산할 수 없습니다: ${error.message}`);
    }
  }
}

if (!unit) fail("5-1 규칙과 대응 단원을 찾을 수 없습니다.");
if (types.length !== 41) fail(`5-1 규칙과 대응 원문 유형은 41개여야 하나 ${types.length}개입니다.`);
if (new Set(types.map(type => type.sourceItemId)).size !== types.length) fail("원문 유형 ID가 중복됩니다.");
const unitReady = types.filter(type => !type.reviewLocked && api.generatorKey(type));
const unitLocked = types.filter(type => type.reviewLocked || !api.generatorKey(type));
if (unitReady.length !== 15 || unitLocked.length !== 26) fail(`U3 전체 상태는 공개 15·잠금 26이어야 하나 공개 ${unitReady.length}·잠금 ${unitLocked.length}입니다.`);
for (const [id, variant] of expectedVariants) {
  const type = types.find(item => item.sourceItemId === id);
  if (!type) { fail(`${id}: 원문 유형이 없습니다.`); continue; }
  if (type.variant !== variant) fail(`${id}: variant가 ${variant}가 아닙니다.`);
  const expectedPage = 31 + (type.sourceSection === "mission" ? 1 : 0);
  if (type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${id}: 원문 PDF·교재 쪽수가 다릅니다.`);
}
for (const id of readyIds) {
  const type = types.find(item => item.sourceItemId === id);
  if (!type || type.reviewLocked || api.generatorKey(type) !== "correspondenceE1") fail(`${id}: 공개 상태 또는 생성기 연결이 다릅니다.`);
}
for (const id of lockedIds) {
  const type = types.find(item => item.sourceItemId === id);
  if (!type || !type.reviewLocked || api.generatorKey(type) || !type.reviewReason) fail(`${id}: 잠금 상태·사유·생성기 연결이 다릅니다.`);
}
checkSourceReferences();

for (const id of readyIds) {
  const type = types.find(item => item.sourceItemId === id);
  for (const level of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
    try {
      const generated = api.generate(type, 0, level, seed, type.variant);
      if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
      const evidence = readEvidence(generated.prompt);
      const calculated = calculate(evidence.kind, evidence.values);
      if (evidence.contract !== contracts.get(type.variant)) throw new Error(`답 형식 ${evidence.contract}가 원문 계약과 다릅니다.`);
      if (normalized(generated.answer) !== normalized(calculated)) throw new Error(`독립 계산 ${calculated}과 표시 답 ${generated.answer}가 다릅니다.`);
      if (evidence.contract !== "single-value" || String(generated.answer).includes(",")) throw new Error("단일 정답 유형에 여러 값이 있습니다.");
      assertUniqueRule(generated.prompt, evidence.kind);
      const difficultyText = `${generated.prompt} ${generated.solution}`;
      if (level === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("쉬움 문구가 없습니다.");
      if (level === 0 && (generated.prompt.includes("풀이 도움:") || generated.prompt.includes("다시 확인하세요."))) throw new Error("같게 문항에 난이도 안내가 섞였습니다.");
      if (level === 1 && !generated.prompt.includes("다시 확인하세요.")) throw new Error("어려움 문구가 없습니다.");
      if (/undefined|null|NaN|Infinity|순열|조합|제곱/.test(difficultyText)) throw new Error("화면 오류 또는 초등 범위를 벗어난 말이 있습니다.");
      checked += 1;
    } catch (error) {
      fail(`${id} / 난이도 ${level} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`5-1 규칙과 대응 개념탐구 1 감사 실패: ${failures.length}건\n${failures.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 규칙과 대응 개념탐구 1 감사 통과: 원문 41항목 · 공개 7/잠금 4 · ${checked.toLocaleString()}회 독립 계산·답 유일성·초등 언어 검사`);
