"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e1 = types.filter(type => type.sourceItemId?.startsWith("5-1-u4-e1-"));
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const gcd = (left, right) => {
  left = Math.abs(left);
  right = Math.abs(right);
  while (right) [left, right] = [right, left % right];
  return left || 1;
};
const rationalText = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  return denominator / divisor === 1 ? String(numerator / divisor) : `${numerator / divisor}/${denominator / divisor}`;
};
const sourceIds = [
  "5-1-u4-e1-exploration",
  "5-1-u4-e1-example-1-1",
  "5-1-u4-e1-example-1-2",
  "5-1-u4-e1-example-1-3",
  "5-1-u4-e1-example-1-4",
  "5-1-u4-e1-mission-1",
  "5-1-u4-e1-mission-2",
  "5-1-u4-e1-mission-3",
  "5-1-u4-e1-mission-4",
  "5-1-u4-e1-mission-5",
  "5-1-u4-e1-mission-6"
];
const kinds = [
  "two-digit-add-pairs",
  "shared-symbol-fraction",
  "grouped-fraction-position",
  "denominator-plus-minus",
  "unchanged-after-subtraction",
  "same-add-target",
  "sum-and-changed-fraction",
  "denominator-plus-minus",
  "ordered-factor-pair-count",
  "constant-sum-sequence"
];

function parseTag(prompt) {
  const match = prompt.match(/data-equal-fraction-e1-kind="([^"]+)"\s+data-values="([^"]*)"\s+data-result-contract="([^"]+)"/);
  if (!match) throw new Error("독립 검산 태그가 없습니다.");
  const values = match[2].split(",").filter(Boolean).map(Number);
  if (!values.length || values.some(value => !Number.isFinite(value) || !Number.isInteger(value))) throw new Error("검산 값이 정수가 아닙니다.");
  return { kind: match[1], values, contract: match[3] };
}

function numericAnswer(answer) {
  const values = String(answer).replaceAll(",", "").match(/-?\d+/g) || [];
  if (values.length !== 1) throw new Error(`한 개의 수로 된 답이 아닙니다: ${answer}`);
  return Number(values[0]);
}

function independent(tag) {
  const { kind, values } = tag;
  if (kind === "two-digit-add-pairs") {
    const [numerator, denominator] = values;
    const candidates = [];
    for (let addDenominator = 10; addDenominator <= 99; addDenominator += 1) {
      for (let addNumerator = 10; addNumerator <= 99; addNumerator += 1) {
        if ((numerator + addNumerator) * denominator === numerator * (denominator + addDenominator)) candidates.push([addDenominator, addNumerator]);
      }
    }
    return { mode: "number", answer: candidates.length, candidates };
  }
  if (kind === "shared-symbol-fraction") {
    const [denominator, numerator, firstAdd, secondAdd] = values;
    const candidates = [];
    for (let candidateDenominator = 1; candidateDenominator <= denominator * 2; candidateDenominator += 1) {
      for (let candidateNumerator = 1; candidateNumerator <= numerator * 2; candidateNumerator += 1) {
        if (candidateNumerator * (denominator + firstAdd) !== numerator * (candidateDenominator + firstAdd)) continue;
        if (candidateNumerator * (denominator + secondAdd) !== numerator * (candidateDenominator + secondAdd)) continue;
        candidates.push([candidateNumerator, candidateDenominator]);
      }
    }
    if (candidates.length !== 1) throw new Error(`기호 분수 후보가 ${candidates.length}개입니다.`);
    return { mode: "fraction", answer: rationalText(numerator, denominator), candidates };
  }
  if (kind === "grouped-fraction-position") {
    const [numerator, denominator] = values;
    const candidates = [];
    let position = 0;
    for (let group = 1; group <= denominator; group += 1) {
      for (let term = 1; term <= group; term += 1) {
        position += 1;
        if (term * denominator === numerator * group) candidates.push(position);
      }
    }
    if (!candidates.length) throw new Error("같은 크기의 분수가 나오지 않습니다.");
    return { mode: "number", answer: candidates[0], candidates: [candidates[0]] };
  }
  if (kind === "denominator-plus-minus") {
    const [numerator, denominator, addValue, subtractValue] = values;
    const candidates = [];
    for (let candidateDenominator = subtractValue + 1; candidateDenominator <= denominator * 2; candidateDenominator += 1) {
      for (let candidateNumerator = 1; candidateNumerator < candidateDenominator; candidateNumerator += 1) {
        if (candidateNumerator * (denominator + addValue) !== numerator * (candidateDenominator + addValue)) continue;
        if (candidateNumerator * (denominator - subtractValue) !== numerator * (candidateDenominator - subtractValue)) continue;
        candidates.push([candidateNumerator, candidateDenominator]);
      }
    }
    if (candidates.length !== 1) throw new Error(`처음 분수 후보가 ${candidates.length}개입니다.`);
    return { mode: "fraction", answer: rationalText(numerator, denominator), candidates };
  }
  if (kind === "unchanged-after-subtraction") {
    const [reducedNumerator, reducedDenominator, common, removedScale] = values;
    const numerator = reducedNumerator * common;
    const denominator = reducedDenominator * common;
    if (gcd(numerator, denominator) !== common) throw new Error("최대공약수 조건이 다릅니다.");
    if ((numerator - reducedNumerator * removedScale) * denominator !== numerator * (denominator - reducedDenominator * removedScale)) throw new Error("수를 뺀 뒤 크기가 달라집니다.");
    return { mode: "ordered", answer: [numerator, denominator], candidates: [[numerator, denominator]] };
  }
  if (kind === "same-add-target") {
    const [numerator, denominator, added] = values;
    const candidates = [];
    for (let value = 1; value <= added * 2; value += 1) if ((numerator + value) * (denominator + added) === (numerator + added) * (denominator + value)) candidates.push(value);
    if (candidates.length !== 1) throw new Error(`같이 더한 수 후보가 ${candidates.length}개입니다.`);
    return { mode: "number", answer: added, candidates };
  }
  if (kind === "sum-and-changed-fraction") {
    const [numerator, denominator, addNumerator, subtractDenominator] = values;
    const sum = numerator + denominator;
    const candidates = [];
    for (let candidateNumerator = 1; candidateNumerator < sum; candidateNumerator += 1) {
      const candidateDenominator = sum - candidateNumerator;
      if ((candidateNumerator + addNumerator) * (denominator - subtractDenominator) === (numerator + addNumerator) * (candidateDenominator - subtractDenominator)) candidates.push([candidateNumerator, candidateDenominator]);
    }
    if (candidates.length !== 1) throw new Error(`합과 바뀐 분수 후보가 ${candidates.length}개입니다.`);
    return { mode: "literal-fraction", answer: `${numerator}/${denominator}`, candidates };
  }
  if (kind === "ordered-factor-pair-count") {
    const [fractionNumerator, fractionDenominator, otherDenominator, product] = values;
    if (fractionNumerator * otherDenominator !== product * fractionDenominator) throw new Error("두 분수의 크기가 다릅니다.");
    const candidates = [];
    for (let smaller = 1; smaller * smaller < product; smaller += 1) if (product % smaller === 0) candidates.push([product / smaller, smaller]);
    return { mode: "number", answer: candidates.length, candidates };
  }
  if (kind === "constant-sum-sequence") {
    const [sum, target] = values;
    const candidates = [];
    for (let position = 1; position < sum; position += 1) if (position * (sum - target) === target * (sum - position)) candidates.push(position);
    if (candidates.length !== 1) throw new Error(`수열 자리 후보가 ${candidates.length}개입니다.`);
    return { mode: "number", answer: target, candidates };
  }
  throw new Error(`알 수 없는 검산 종류 ${kind}`);
}

function checkAnswer(calculated, shown) {
  if (calculated.mode === "number" && numericAnswer(shown) !== calculated.answer) throw new Error(`독립 계산 ${calculated.answer}과 표시 답 ${shown}가 다릅니다.`);
  if (calculated.mode === "fraction" && rationalText(...String(shown).split("/").map(Number)) !== calculated.answer) throw new Error(`독립 계산 ${calculated.answer}과 표시 답 ${shown}가 다릅니다.`);
  if (calculated.mode === "literal-fraction" && String(shown) !== calculated.answer) throw new Error(`원래 분수 ${calculated.answer}와 표시 답 ${shown}가 다릅니다.`);
  if (calculated.mode === "ordered") {
    const values = String(shown).replaceAll(",", " ").match(/\d+/g)?.map(Number) || [];
    if (values.length !== 2 || values[0] !== calculated.answer[0] || values[1] !== calculated.answer[1]) throw new Error(`순서 있는 답 ${calculated.answer.join(", ")}와 표시 답 ${shown}가 다릅니다.`);
  }
}

function checkAnchors() {
  const anchors = [
    [{ kind: "two-digit-add-pairs", values: [27, 48, 9, 16] }, "number", 5],
    [{ kind: "shared-symbol-fraction", values: [53, 40, 11, 17] }, "fraction", "40/53"],
    [{ kind: "grouped-fraction-position", values: [17, 33] }, "number", 545],
    [{ kind: "denominator-plus-minus", values: [18, 67, 5, 4] }, "fraction", "18/67"],
    [{ kind: "unchanged-after-subtraction", values: [13, 4, 572, 4] }, "ordered", [7436, 2288]],
    [{ kind: "same-add-target", values: [4, 13, 50] }, "number", 50],
    [{ kind: "sum-and-changed-fraction", values: [48, 94, 6, 10] }, "literal-fraction", "48/94"],
    [{ kind: "denominator-plus-minus", values: [3, 17, 4, 2] }, "fraction", "3/17"],
    [{ kind: "ordered-factor-pair-count", values: [60, 72, 48, 40] }, "number", 4],
    [{ kind: "constant-sum-sequence", values: [88, 32] }, "number", 32]
  ];
  for (const [tag, mode, answer] of anchors) {
    try {
      const calculated = independent(tag);
      if (calculated.mode !== mode || JSON.stringify(calculated.answer) !== JSON.stringify(answer)) throw new Error(`계산값 ${JSON.stringify(calculated.answer)}`);
    } catch (error) {
      fail(`원문 앵커 ${tag.kind}: ${error.message}`);
    }
  }
  const impossible = [];
  for (let value = 10; value <= 99; value += 1) if ((4 - value) * (7 - value) !== 0 && (4 - value) * 4 === 7 - value) impossible.push(value);
  if (impossible.length) fail(`Mission 6 두 자리 해가 없어야 하나 ${impossible.join(", ")}가 나옵니다.`);
}

if (!unit) fail("5-1 약분과 통분 단원을 찾을 수 없습니다.");
if (e1.length !== 11 || types.length !== 44) fail(`개념탐구 1 또는 현재 단원 유형 수가 다릅니다: ${e1.length}/${types.length}`);
if (sourceIds.some((id, index) => e1[index]?.sourceItemId !== id)) fail("개념탐구 1 원문 순서 또는 ID가 다릅니다.");
if (new Set(e1.map(type => type.sourceItemId)).size !== 11) fail("개념탐구 1 원문 ID가 중복됩니다.");
for (const type of e1) {
  const isLocked = type.sourceItemId.endsWith("mission-6");
  const expectedPage = type.sourceSection === "mission" ? 42 : 41;
  if (type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${type.sourceItemId}: 원문 쪽수가 다릅니다.`);
  if (isLocked) {
    if (!type.reviewLocked || api.generatorKey(type) || !type.reviewReason.includes("두 자리 자연수가 없습니다")) fail("Mission 6 잠금 상태·사유·생성기 차단이 다릅니다.");
  } else if (type.reviewLocked || api.generatorKey(type) !== "equalFractionE1" || kinds[type.variant] === undefined) {
    fail(`${type.sourceItemId}: 공개 상태·생성기·분기가 다릅니다.`);
  }
}
checkAnchors();

for (const type of e1.filter(item => !item.reviewLocked)) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1000; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 비었습니다.");
      const tag = parseTag(generated.prompt);
      if (tag.kind !== kinds[type.variant]) throw new Error(`분기 ${type.variant}의 검산 종류가 다릅니다.`);
      if (tag.contract !== (type.variant === 4 ? "ordered" : type.variant === 8 ? "pair-count" : "single-value")) throw new Error(`답 계약 ${tag.contract}이 다릅니다.`);
      const calculated = independent(tag);
      checkAnswer(calculated, generated.answer);
      if (!calculated.candidates.length) throw new Error("정답 후보가 없습니다.");
      const text = `${generated.prompt} ${generated.solution}`;
      if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("심화 쉬움 안내가 없습니다.");
      if (difficulty === 0 && (text.includes("풀이 도움:") || text.includes("교차해 곱한"))) throw new Error("심화 기준에 다른 단계 안내가 섞였습니다.");
      if (difficulty === 1 && !generated.prompt.includes("교차해 곱한")) throw new Error("심화 어려움 확인 안내가 없습니다.");
      if (/undefined|null|NaN|Infinity|순열|조합|방정식|미지수|제곱근/.test(text)) throw new Error("깨진 값 또는 학년 밖 표현이 있습니다.");
      checked += 1;
    } catch (error) {
      fail(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`5-1 크기가 같은 분수 개념탐구 1 독립 감사 실패: ${failures.length}건\n${failures.slice(0, 80).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 크기가 같은 분수 개념탐구 1 독립 감사 통과: 원문 11항목 · 공개 10/잠금 1 · ${checked.toLocaleString()}회 독립 계산·전수 열거·수식·난이도 검사`);
