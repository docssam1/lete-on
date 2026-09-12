"use strict";

// Independent audit for 5-1 U5 E4. The generator is treated as an
// untrusted producer: all answers are recomputed from the hidden evidence.
// This audit intentionally writes no files and does not change release state.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const fs = require("fs");
const path = require("path");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const inventoryPath = path.join(__dirname, "source-inventory", "5-1-u5-e4-readiness-review.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

const expected = [
  { variant: 0, sourceItemId: "5-1-u5-e4-exploration-1", kind: "three-unit-fractions-multiple", contract: "unordered-list", section: "exploration", pdf: 57, printed: 58, candidates: 6, locked: true },
  { variant: 1, sourceItemId: "5-1-u5-e4-exploration-2", kind: "telescoping-unit-sum", contract: "single-value", section: "exploration", pdf: 57, printed: 58, candidates: 1, locked: false },
  { variant: 2, sourceItemId: "5-1-u5-e4-example-4-1", kind: "three-unit-fractions-unique", contract: "single-tuple", section: "example", pdf: 57, printed: 58, candidates: 1, locked: false },
  { variant: 3, sourceItemId: "5-1-u5-e4-example-4-2", kind: "minimum-two-unit-sum", contract: "single-value", section: "example", pdf: 57, printed: 58, candidates: 1, locked: false },
  { variant: 4, sourceItemId: "5-1-u5-e4-example-4-3", kind: "paired-denominator-unit-sum", contract: "single-value", section: "example", pdf: 57, printed: 58, candidates: 1, locked: false },
  { variant: 5, sourceItemId: "5-1-u5-e4-example-4-4", kind: "fraction-sequence-first-count-sum", contract: "single-value", section: "example", pdf: 57, printed: 58, candidates: 1, locked: false },
  { variant: 6, sourceItemId: "5-1-u5-e4-mission-1", kind: "four-unit-fractions-rule-sum", contract: "single-value", section: "mission", pdf: 58, printed: 59, candidates: 1, locked: false },
  { variant: 7, sourceItemId: "5-1-u5-e4-mission-2", kind: "unit-fractions-between-strict-boundaries", contract: "single-value", section: "mission", pdf: 58, printed: 59, candidates: 1, locked: false },
  { variant: 8, sourceItemId: "5-1-u5-e4-mission-3", kind: "difference-of-two-unit-fractions", contract: "single-tuple", section: "mission", pdf: 58, printed: 59, candidates: 1, locked: false },
  { variant: 9, sourceItemId: "5-1-u5-e4-mission-4", kind: "bounded-two-unit-fractions", contract: "single-tuple", section: "mission", pdf: 58, printed: 59, candidates: 1, locked: false },
  { variant: 10, sourceItemId: "5-1-u5-e4-mission-5", kind: "three-unit-fractions-multiple-mission", contract: "unordered-list", section: "mission", pdf: 58, printed: 59, candidates: 2, locked: true },
  { variant: 11, sourceItemId: "5-1-u5-e4-mission-6", kind: "choose-four-unit-fractions-sum-one", contract: "single-set", section: "mission", pdf: 58, printed: 59, candidates: 1, locked: false }
];

const failures = [];
const failureSummary = new Map();
let activeContext = "";
let checked = 0;

function fail(message) {
  const formatted = activeContext ? `${activeContext}: ${message}` : message;
  failures.push(formatted);
  const bucket = activeContext ? activeContext.replace(/ \/ 시드 \d+$/, "") : "metadata";
  const current = failureSummary.get(bucket) || { count: 0, first: formatted };
  current.count += 1;
  failureSummary.set(bucket, current);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function gcd(left, right) {
  left = Math.abs(left);
  right = Math.abs(right);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function rational(numerator, denominator = 1) {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
}

const integer = value => rational(value, 1);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => right && right.numerator !== 0
  ? rational(left.numerator * right.denominator, left.denominator * right.numerator)
  : null;
const compare = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;
const equal = (left, right) => Boolean(left && right && compare(left, right) === 0);
const sum = values => values.reduce((total, value) => add(total, value), integer(0));
const key = value => `${value.numerator}/${value.denominator}`;

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function parseEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-unit-fraction-e4-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!tag) throw new Error("독립 검산 태그가 없습니다.");
  const valuesText = attribute(tag, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) {
    throw new Error("검산 값이 정수가 아닙니다.");
  }
  return {
    kind: attribute(tag, "data-unit-fraction-e4-kind"),
    sourceItemId: attribute(tag, "data-source-item"),
    values,
    contract: attribute(tag, "data-result-contract")
  };
}

function fractionTokens(html) {
  const tokens = [];
  const pattern = /<span class="math-fraction"[^>]*><span>([^<]+)<\/span><span>([^<]+)<\/span><\/span>/g;
  let match;
  while ((match = pattern.exec(String(html)))) tokens.push({ numerator: match[1], denominator: match[2] });
  return tokens;
}

function numericFractionTokens(html) {
  return fractionTokens(html)
    .filter(token => /^-?\d+$/.test(token.numerator) && /^-?\d+$/.test(token.denominator))
    .map(token => rational(Number(token.numerator), Number(token.denominator)));
}

function visibleText(html) {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parsePlainNumber(text) {
  const cleaned = String(text).replace(/<[^>]*>/g, " ").replace(/,/g, " ").trim();
  const mixed = cleaned.match(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return rational(Number(mixed[1]) * Number(mixed[3]) + Number(mixed[2]), Number(mixed[3]));
  const fraction = cleaned.match(/(-?\d+)\s*\/\s*(\d+)/);
  if (fraction) return rational(Number(fraction[1]), Number(fraction[2]));
  const number = cleaned.match(/-?\d+/);
  return number ? integer(Number(number[0])) : null;
}

function parseScalarAnswer(answer) {
  const mixed = String(answer).match(/class="math-mixed-number"[^>]*aria-label="(\d+)와 (\d+)분의 (\d+)"/);
  if (mixed) return rational(Number(mixed[1]) * Number(mixed[3]) + Number(mixed[4]), Number(mixed[3]));
  const tokens = numericFractionTokens(answer);
  if (tokens.length === 1 && !/\d+\s*\/\s*\d+/.test(String(answer))) return tokens[0];
  return parsePlainNumber(answer);
}

function parseTupleAnswer(answer) {
  const plain = visibleText(answer).split(",").map(item => item.trim()).filter(Boolean);
  return plain.map(parsePlainNumber);
}

function answerMatchesScalar(answer, expectedValue) {
  const parsed = parseScalarAnswer(answer);
  return Boolean(parsed && equal(parsed, expectedValue));
}

function requireValues(values, count, context) {
  check(values.length === count, `${context}: 숨은 값의 개수가 ${count}개가 아닙니다: ${values.length}`);
  check(values.every(value => Number.isInteger(value) && Number.isFinite(value)), `${context}: 숨은 값에 정수가 아닌 값이 있습니다.`);
}

function enumerateUnitTriples(target) {
  const candidates = [];
  const maxFirst = Math.floor((3 * target.denominator) / target.numerator);
  for (let first = 2; first <= maxFirst; first += 1) {
    const afterFirst = subtract(target, rational(1, first));
    if (!afterFirst || afterFirst.numerator <= 0) continue;
    const maxSecond = Math.floor((2 * afterFirst.denominator) / afterFirst.numerator);
    for (let second = first + 1; second <= maxSecond; second += 1) {
      const afterSecond = subtract(afterFirst, rational(1, second));
      if (afterSecond && afterSecond.numerator === 1 && afterSecond.denominator > second) {
        candidates.push([first, second, afterSecond.denominator]);
      }
    }
  }
  return candidates;
}

function enumerateDifferencePairs(target) {
  const candidates = [];
  const maxFirst = Math.floor(target.denominator / target.numerator);
  for (let first = 2; first <= maxFirst; first += 1) {
    const remainder = subtract(rational(1, first), target);
    if (remainder && remainder.numerator === 1 && remainder.denominator > first) {
      candidates.push([first, remainder.denominator]);
    }
  }
  return candidates;
}

function enumerateBoundedPairs(target, fixedDenominator, limit) {
  const candidates = [];
  const remainder = subtract(target, rational(1, fixedDenominator));
  for (let first = 2; first < limit; first += 1) {
    for (let second = 1; second < first; second += 1) {
      if (equal(add(rational(1, first), rational(1, second)), remainder)) candidates.push([first, second]);
    }
  }
  return candidates;
}

function allFourCombinations(values) {
  const output = [];
  for (let a = 0; a < values.length; a += 1) for (let b = a + 1; b < values.length; b += 1) {
    for (let c = b + 1; c < values.length; c += 1) for (let d = c + 1; d < values.length; d += 1) {
      output.push([values[a], values[b], values[c], values[d]]);
    }
  }
  return output;
}

function independent(evidence) {
  const { kind, values } = evidence;
  if (kind === "three-unit-fractions-multiple" || kind === "three-unit-fractions-multiple-mission") {
    requireValues(values, 3, kind);
    const target = rational(values[0], values[1]);
    const candidates = enumerateUnitTriples(target);
    return { value: candidates, candidates };
  }
  if (kind === "telescoping-unit-sum") {
    requireValues(values, 5, kind);
    const [gap, start, count, answerNumerator, answerDenominator] = values;
    const terms = Array.from({ length: count }, (_, index) => rational(gap, (start + index * gap) * (start + (index + 1) * gap)));
    const calculated = sum(terms);
    const telescoped = subtract(rational(1, start), rational(1, start + count * gap));
    check(equal(calculated, telescoped), `${kind}: 전수 합과 망원합이 다릅니다.`);
    check(equal(calculated, rational(answerNumerator, answerDenominator)), `${kind}: 숨은 답과 독립 계산이 다릅니다.`);
    return { value: calculated, candidates: [calculated] };
  }
  if (kind === "three-unit-fractions-unique") {
    requireValues(values, 5, kind);
    const target = rational(values[0], values[1]);
    const candidates = enumerateUnitTriples(target);
    check(candidates.length === 1, `${kind}: 전수 열거 결과가 ${candidates.length}개입니다.`);
    check(candidates[0]?.join(",") === values.slice(2).join(","), `${kind}: 유일한 분모와 숨은 분모가 다릅니다.`);
    return { value: candidates[0], candidates };
  }
  if (kind === "minimum-two-unit-sum") {
    requireValues(values, 5, kind);
    const [totalDenominator, bestFirst, bestSecond, answerNumerator, answerDenominator] = values;
    const pairs = [];
    for (let first = 1; first <= Math.floor(totalDenominator / 2); first += 1) {
      const second = totalDenominator - first;
      pairs.push({ pair: [first, second], value: add(rational(1, first), rational(1, second)) });
    }
    const smallest = pairs.reduce((best, current) => !best || compare(current.value, best.value) < 0 ? current : best, null);
    const winners = pairs.filter(current => equal(current.value, smallest.value));
    check(winners.length === 1, `${kind}: 최솟값을 만드는 쌍이 ${winners.length}개입니다.`);
    check(smallest.pair[0] === bestFirst && smallest.pair[1] === bestSecond, `${kind}: 최솟값 분모가 다릅니다.`);
    check(equal(smallest.value, rational(answerNumerator, answerDenominator)), `${kind}: 최솟값과 숨은 값이 다릅니다.`);
    return { value: integer(answerNumerator + answerDenominator), candidates: [smallest.value] };
  }
  if (kind === "paired-denominator-unit-sum") {
    requireValues(values, 4, kind);
    const [start, count, answerNumerator, answerDenominator] = values;
    const terms = Array.from({ length: count }, (_, index) => {
      const first = start + index * 2;
      return rational(1, first * (first + 2));
    });
    const calculated = sum(terms);
    const telescoped = divide(subtract(rational(1, start), rational(1, start + count * 2)), integer(2));
    check(equal(calculated, telescoped), `${kind}: 분모 곱의 전수 합과 망원합이 다릅니다.`);
    check(equal(calculated, rational(answerNumerator, answerDenominator)), `${kind}: 숨은 답과 독립 계산이 다릅니다.`);
    return { value: calculated, candidates: [calculated] };
  }
  if (kind === "fraction-sequence-first-count-sum") {
    requireValues(values, 3, kind);
    const [count, answerNumerator, answerDenominator] = values;
    const calculated = subtract(integer(count), subtract(integer(1), rational(1, count + 1)));
    check(equal(calculated, rational(answerNumerator, answerDenominator)), `${kind}: 분수열 합이 다릅니다.`);
    return { value: calculated, candidates: [calculated] };
  }
  if (kind === "four-unit-fractions-rule-sum") {
    requireValues(values, 5, kind);
    const [gap, start, count, answerNumerator, answerDenominator] = values;
    const terms = Array.from({ length: count }, (_, index) => rational(gap, (start + index * gap) * (start + (index + 1) * gap)));
    const calculated = sum(terms);
    const telescoped = subtract(rational(1, start), rational(1, start + count * gap));
    check(equal(calculated, telescoped), `${kind}: 네 항 전수 합과 망원합이 다릅니다.`);
    check(equal(calculated, rational(answerNumerator, answerDenominator)), `${kind}: 숨은 답과 독립 계산이 다릅니다.`);
    return { value: calculated, candidates: [calculated] };
  }
  if (kind === "unit-fractions-between-strict-boundaries") {
    requireValues(values, 5, kind);
    const [leftA, rightB, lower, upper, answer] = values;
    const left = subtract(rational(1, leftA), rational(1, leftA + 1));
    const right = subtract(rational(1, rightB), rational(1, rightB + 1));
    const calculatedLower = rightB * (rightB + 1);
    const calculatedUpper = leftA * (leftA + 1);
    check(equal(left, rational(1, calculatedUpper)) && equal(right, rational(1, calculatedLower)), `${kind}: 경계 계산이 다릅니다.`);
    const candidates = [];
    for (let denominator = 1; denominator <= calculatedUpper; denominator += 1) {
      const current = rational(1, denominator);
      if (compare(current, left) > 0 && compare(current, right) < 0) candidates.push(denominator);
    }
    check(candidates.length === answer, `${kind}: 가능한 분모 개수가 ${candidates.length}개입니다.`);
    return { value: integer(answer), candidates: [integer(answer)] };
  }
  if (kind === "difference-of-two-unit-fractions") {
    requireValues(values, 4, kind);
    const [targetNumerator, targetDenominator, expectedFirst, expectedSecond] = values;
    const target = rational(targetNumerator, targetDenominator);
    const candidates = enumerateDifferencePairs(target);
    check(candidates.length === 1, `${kind}: 전수 열거 결과가 ${candidates.length}개입니다.`);
    check(candidates[0]?.[0] === expectedFirst && candidates[0]?.[1] === expectedSecond, `${kind}: 유일한 분모와 숨은 분모가 다릅니다.`);
    return { value: [expectedFirst, expectedSecond], candidates };
  }
  if (kind === "bounded-two-unit-fractions") {
    requireValues(values, 6, kind);
    const [targetNumerator, targetDenominator, expectedFirst, expectedSecond, fixedDenominator, limit] = values;
    const target = rational(targetNumerator, targetDenominator);
    const candidates = enumerateBoundedPairs(target, fixedDenominator, limit);
    check(candidates.length === 1, `${kind}: 범위 안 후보가 ${candidates.length}개입니다.`);
    check(candidates[0]?.[0] === expectedFirst && candidates[0]?.[1] === expectedSecond, `${kind}: 유일한 분모와 숨은 분모가 다릅니다.`);
    return { value: [expectedFirst, expectedSecond], candidates };
  }
  if (kind === "choose-four-unit-fractions-sum-one") {
    requireValues(values, 6, kind);
    const denominators = values;
    const candidates = allFourCombinations(denominators).filter(candidate => equal(sum(candidate.map(denominator => rational(1, denominator))), integer(1)));
    check(candidates.length === 1, `${kind}: 합이 1인 선택이 ${candidates.length}개입니다.`);
    return { value: candidates[0], candidates };
  }
  throw new Error(`알 수 없는 E4 검산 분기: ${kind}`);
}

function expectedTypeMap() {
  const semester = curriculum.semesters.find(item => item.id === "5-1");
  const unit = semester?.units.find(item => item.id === "5-1-u5");
  const subunit = unit?.subunits.find(item => item.id === "5-1-u5-s4");
  check(Boolean(semester && unit && subunit), "5-1 5단원 네 번째 소단원(단위분수와 부분분수)을 찾을 수 없습니다.");
  const types = subunit?.types || [];
  check(types.length === expected.length, `E4 유형 수가 ${expected.length}개가 아닙니다: ${types.length}`);
  check(new Set(types.map(type => type.sourceItemId)).size === expected.length, "E4 출처 ID가 중복됩니다.");
  check(inventory.summary?.sourceItemCount === expected.length && inventory.items.length === expected.length, "E4 원장 문항 수가 12개가 아닙니다.");

  expected.forEach(spec => {
    const type = types.find(item => item.variant === spec.variant);
    const source = inventory.items.find(item => item.sourceItemId === spec.sourceItemId);
    check(Boolean(type), `변형 ${spec.variant} 유형이 없습니다: ${spec.sourceItemId}`);
    check(Boolean(source), `원장에 출처가 없습니다: ${spec.sourceItemId}`);
    if (!type || !source) return;
    check(type.variant === spec.variant, `${type.id}: 변형 번호가 다릅니다.`);
    check(type.generatorKey === "unitFractionE4" && api.generatorKey({ ...type, reviewLocked: false }) === "unitFractionE4", `${type.id}: E4 생성기 연결이 아닙니다.`);
    check(type.sourceItemId === spec.sourceItemId && type.sourceVerified === true && type.sourceTier === "advanced", `${type.id}: 원문·심화 확인 정보가 부족합니다.`);
    check(type.sourceSection === spec.section && type.sourcePdfPage === spec.pdf && type.sourcePrintedPage === spec.printed, `${type.id}: 원문 구역 또는 쪽 정보가 다릅니다.`);
    check(type.sourceEvidence.includes("5-1 심화") && type.sourceEvidence.includes(`PDF p.${spec.pdf}`) && type.sourceEvidence.includes(`교재 p.${spec.printed}`) && type.sourceEvidence.includes(spec.sourceItemId), `${type.id}: 원문 근거가 완전하지 않습니다.`);
    check(type.difficultyBand === 1, `${type.id}: 심화 난이도 띠가 아닙니다: ${type.difficultyBand}`);
    check(type.reviewLocked === spec.locked, `${type.id}: 잠금 상태가 ${spec.locked}가 아닙니다: ${type.reviewLocked}`);
    if (spec.locked) check(type.reviewReason.includes("원문") && (type.reviewReason.includes("여러 개") || type.reviewReason.includes("두 개")), `${type.id}: 잠금 사유가 원문 다답 근거를 설명하지 않습니다.`);
    else check(type.reviewReason.includes("독립 계산"), `${type.id}: 독립 계산 검수 근거가 없습니다.`);
    check(Boolean(type.name && type.label && source.typeLabel && source.childFriendlyTypeLabel), `${type.id}: 유형명이 비어 있습니다.`);
    check(source.sourceVerified === true && source.sourcePdfPage === spec.pdf && source.sourcePrintedPage === spec.printed, `${spec.sourceItemId}: 원장 쪽 확인 정보가 다릅니다.`);
    check(source.candidateAnswerCount === spec.candidates, `${spec.sourceItemId}: 원문 후보 답 수가 ${spec.candidates}가 아닙니다.`);
    check(source.resultContract === spec.contract, `${spec.sourceItemId}: 원문 답 계약이 ${spec.contract}가 아닙니다.`);
  });
  return types;
}

function auditSourceLockAndMultipleAnswers(types) {
  for (const spec of expected.filter(item => item.locked)) {
    const type = types.find(item => item.variant === spec.variant);
    const generated = api.generate({ ...type, reviewLocked: false }, 0, 0, 1000, spec.variant);
    const evidence = parseEvidence(generated.prompt);
    const recomputed = independent(evidence);
    check(recomputed.candidates.length === spec.candidates, `${spec.sourceItemId}: 잠금 다답 개수가 ${recomputed.candidates.length}개입니다.`);
    check(evidence.contract === "multiple" || evidence.contract === "unordered-list", `${spec.sourceItemId}: 다답 유형의 계약이 multiple/unordered-list가 아닙니다.`);
    const groups = fractionTokens(generated.answer).length / 3;
    check(groups === spec.candidates, `${spec.sourceItemId}: 다답 답안 표현 수가 ${groups}개입니다.`);
  }
}

function checkGeometryAndSourceContract(generated, evidence, spec, difficulty) {
  const { values } = evidence;
  if (evidence.kind === "telescoping-unit-sum" || evidence.kind === "four-unit-fractions-rule-sum") {
    const [gap, start, count] = values;
    const fractions = numericFractionTokens(generated.prompt);
    check(fractions.length === count, `${spec.sourceItemId}: 분수 항 수가 ${count}개가 아닙니다.`);
    fractions.forEach((fraction, index) => {
      const first = start + index * gap;
      check(fraction.numerator === gap && fraction.denominator === first * (first + gap), `${spec.sourceItemId}: ${index + 1}번째 분모가 규칙과 다릅니다.`);
    });
  }
  if (evidence.kind === "paired-denominator-unit-sum") {
    const [start, count] = values;
    const fractions = numericFractionTokens(generated.prompt);
    check(fractions.length === count, `${spec.sourceItemId}: 분수 항 수가 ${count}개가 아닙니다.`);
    fractions.forEach((fraction, index) => {
      const first = start + index * 2;
      check(fraction.numerator === 1 && fraction.denominator === first * (first + 2), `${spec.sourceItemId}: v4 분모가 (start+2i)(start+2i+2)가 아닙니다.`);
    });
  }
  if (evidence.kind === "fraction-sequence-first-count-sum") {
    const [count] = values;
    const fractions = numericFractionTokens(generated.prompt);
    check(fractions.length === 4, `${spec.sourceItemId}: 앞 세 항과 마지막 항 표시가 없습니다.`);
    const expectedTerms = [1, 2, 3, count].map(index => rational(index * index + index - 1, index * (index + 1)));
    fractions.forEach((fraction, index) => check(equal(fraction, expectedTerms[index]), `${spec.sourceItemId}: 분수열 ${index + 1}항이 원래 규칙과 다릅니다.`));
    check(generated.solution.includes(`${count}에서 1을 빼고`) && generated.solution.includes(`${count + 1}`), `${spec.sourceItemId}: 풀이가 count-1+1/(count+1) 구조가 아닙니다.`);
  }
  if (evidence.kind === "unit-fractions-between-strict-boundaries") {
    const [leftA, rightB] = values;
    const fractions = numericFractionTokens(generated.prompt);
    check(fractions.length === 4, `${spec.sourceItemId}: 두 경계의 원래 분수 네 개가 보이지 않습니다.`);
    const expectedFractions = [rational(1, leftA), rational(1, leftA + 1), rational(1, rightB), rational(1, rightB + 1)];
    fractions.forEach((fraction, index) => check(equal(fraction, expectedFractions[index]), `${spec.sourceItemId}: 원래 두 분수의 차 경계가 보이지 않거나 다릅니다.`));
  }
  if (evidence.kind === "choose-four-unit-fractions-sum-one") {
    const cardFractions = numericFractionTokens(generated.prompt);
    check(cardFractions.length === 6, `${spec.sourceItemId}: 여섯 선택 카드가 모두 보이지 않습니다.`);
    check(new Set(cardFractions.map(fraction => fraction.denominator)).size === 6, `${spec.sourceItemId}: 선택 카드 분모가 중복됩니다.`);
    const selected = independent(evidence).candidates[0];
    const answerFractions = numericFractionTokens(generated.answer);
    check(answerFractions.length === 4 && answerFractions.every(fraction => selected.includes(fraction.denominator)), `${spec.sourceItemId}: 유일 선택 답이 카드와 일치하지 않습니다.`);
  }
  if (difficulty === -1 && evidence.kind === "three-unit-fractions-unique") {
    const tokens = fractionTokens(generated.prompt);
    check(tokens.some(token => token.denominator === "가") && tokens.some(token => token.denominator === "나") && tokens.some(token => token.denominator === "다"), `${spec.sourceItemId}: 가·나·다 기호가 수식으로 보이지 않습니다.`);
  }
}

const types = expectedTypeMap();
auditSourceLockAndMultipleAnswers(types);

const noElementaryOutOfScope = /√|제곱근|순열|조합|방정식|미지수|시그마|Σ|9P4/;
const rawFraction = /\b\d+\s*\/\s*\d+\b/;
const promptVariants = new Map();
const answerVariants = new Map();

for (const spec of expected.filter(item => !item.locked)) {
  const type = types.find(item => item.variant === spec.variant);
  for (const difficulty of [-1, 0, 1]) {
    const prompts = new Set();
    const answers = new Set();
    for (let seed = 1; seed <= 1000; seed += 1) {
      activeContext = `${type.id} / 변형 ${spec.variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate({ ...type, reviewLocked: false }, 0, difficulty, seed, spec.variant);
        check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), "문제·정답·풀이가 비어 있습니다.");
        if (!generated) continue;
        check(generated.generator === "unitFractionE4", `실제 생성기가 다릅니다: ${generated.generator}`);
        check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), "깨진 값이 있습니다.");
        const evidence = parseEvidence(generated.prompt);
        const contractMatches = evidence.contract === spec.contract || (spec.contract === "unordered-list" && evidence.contract === "multiple");
        check(evidence.kind === spec.kind && evidence.sourceItemId === spec.sourceItemId && contractMatches, `출처·검산 종류·답 계약이 다릅니다: ${JSON.stringify(evidence)}`);
        const recomputed = independent(evidence);
        check(recomputed.candidates.length === 1, `정답 후보가 ${recomputed.candidates.length}개입니다.`);
        if (Array.isArray(recomputed.value)) {
          if (evidence.kind === "choose-four-unit-fractions-sum-one") {
            const shown = numericFractionTokens(generated.answer);
            check(shown.length === recomputed.value.length, `표시 답 분수 수가 ${recomputed.value.length}개가 아닙니다: ${generated.answer}`);
            if (shown.length === recomputed.value.length) recomputed.value.forEach((denominator, index) => check(shown[index].numerator === 1 && shown[index].denominator === denominator, `표시 답 ${index + 1}번이 독립 계산과 다릅니다.`));
          } else {
            const shown = parseTupleAnswer(generated.answer);
            check(shown.length === recomputed.value.length, `표시 답 항목 수가 ${recomputed.value.length}개가 아닙니다: ${generated.answer}`);
            if (shown.length === recomputed.value.length) recomputed.value.forEach((value, index) => check(shown[index] && compare(shown[index], integer(value)) === 0, `표시 답 ${index + 1}번이 독립 계산과 다릅니다.`));
          }
        } else {
          check(answerMatchesScalar(generated.answer, recomputed.value), `표시 답 ${generated.answer}와 독립 계산 ${key(recomputed.value)}가 다릅니다.`);
        }
        const learnerOutput = `${generated.prompt}\n${generated.solution}`;
        const allOutput = `${learnerOutput}\n${generated.answer}`;
        check(!rawFraction.test(learnerOutput), "문제·풀이에 raw 숫자/숫자 형태 분수가 남아 있습니다.");
        check(learnerOutput.includes("math-fraction") || learnerOutput.includes("math-mixed-number"), "구조화된 분수 표시가 없습니다.");
        check(!noElementaryOutOfScope.test(visibleText(allOutput)), "초등 교육과정 밖 표현이 있습니다.");
        check(fractionTokens(generated.prompt).every(token => token.denominator !== "undefined" && token.numerator !== "undefined"), "수식 분수 요소에 빈 값이 있습니다.");
        checkGeometryAndSourceContract(generated, evidence, spec, difficulty);
        prompts.add(visibleText(generated.prompt));
        answers.add(String(generated.answer));
        checked += 1;
      } catch (error) {
        fail(error.message);
      }
    }
    activeContext = "";
    promptVariants.set(`${spec.sourceItemId}/${difficulty}`, prompts.size);
    answerVariants.set(`${spec.sourceItemId}/${difficulty}`, answers.size);
    check(prompts.size >= 2 || answers.size >= 2, `${spec.sourceItemId} / 난이도 ${difficulty}: 문제 또는 답 변형이 2개 미만입니다.`);
  }
}

if (failures.length) {
  console.error(`5-1 5단원 E4 단위분수와 부분분수 독립 감사 실패: ${failures.length}건`);
  console.error(`확인 생성 수: ${checked.toLocaleString()}회 / 목표 30,000회`);
  console.error(`실패 분포: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.count])))}`);
  console.error(`첫 실패: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.first])))}`);
  console.error(`문제 변형 수: ${JSON.stringify(Object.fromEntries(promptVariants))}`);
  console.error(`답 변형 수: ${JSON.stringify(Object.fromEntries(answerVariants))}`);
  process.exit(1);
}

console.log("5-1 5단원 E4 단위분수와 부분분수 독립 감사 통과: 원문 12유형 · 공개 10/잠금 2 · 30,000회 독립 계산·전수 후보·수식·언어·다양성 검사");
