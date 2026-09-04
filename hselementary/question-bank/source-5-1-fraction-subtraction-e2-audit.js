"use strict";

// Independent audit for the 17 source-level types in 5-1 U5 E2.
// The generator is treated as a producer: answers are recomputed from its
// hidden evidence with separate rational arithmetic and exhaustive searches.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const failures = [];
const failureSummary = new Map();
let activeContext = "";
const fail = message => {
  const formatted = activeContext ? `${activeContext}: ${message}` : message;
  failures.push(formatted);
  if (activeContext) {
    const bucket = activeContext.replace(/ \/ 시드 \d+$/, "");
    const current = failureSummary.get(bucket) || { count: 0, first: formatted };
    current.count += 1;
    failureSummary.set(bucket, current);
  }
};
const check = (condition, message) => { if (!condition) fail(message); };

const gcd = (left, right) => {
  left = Math.abs(left);
  right = Math.abs(right);
  while (right) [left, right] = [right, left % right];
  return left || 1;
};
const rational = (numerator, denominator = 1) => {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const integer = value => rational(value);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const compare = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;
const key = value => `${value.numerator}/${value.denominator}`;
const sum = values => values.reduce((total, value) => add(total, value), integer(0));
const pairs = values => {
  const output = [];
  for (let index = 0; index < values.length; index += 2) output.push(rational(values[index], values[index + 1]));
  return output;
};
const mixed = (whole, numerator, denominator) => rational(whole * denominator + numerator, denominator);
// Source values may be reducible before the shared renderer simplifies them.
const proper = (numerator, denominator) => numerator > 0 && numerator < denominator;

const expected = [
  ["5-1-u5-e2-exploration-1", "proper-subtraction", "single-value", "exploration", 53, 54],
  ["5-1-u5-e2-exploration-2", "proper-three-term-subtraction", "single-value", "exploration", 53, 54],
  ["5-1-u5-e2-exploration-3", "mixed-subtraction", "single-value", "exploration", 53, 54],
  ["5-1-u5-e2-exploration-4", "mixed-three-term-subtraction", "single-value", "exploration", 53, 54],
  ["5-1-u5-e2-example-2-1", "card-max-a-plus-b-minus-c", "maximum", "example", 53, 54],
  ["5-1-u5-e2-example-2-2", "descending-mixed-sequence-blanks", "ordered-pair", "example", 53, 54],
  ["5-1-u5-e2-example-2-3", "neither-group-inclusion-exclusion", "single-value", "example", 53, 54],
  ["5-1-u5-e2-example-2-4", "leaky-tank-two-faucets", "single-value", "example", 53, 54],
  ["5-1-u5-e2-mission-1-1", "proper-a-plus-b-minus-c", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-1-2", "natural-mixed-plus-proper", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-1-3-4", "mixed-a-minus-b-plus-c", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-1-5", "outer-minus-mixed-plus-proper-minus-mixed", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-2", "max-min-five-fractions", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-3", "empty-container-half-water", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-4", "blank-plus-a-minus-b", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-5", "fraction-magic-three-labels", "single-value", "mission", 54, 55],
  ["5-1-u5-e2-mission-6", "digit-card-max-mixed-difference", "maximum", "mission", 54, 55]
];

const unit = curriculum.semesters.find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u5");
const subunit = unit?.subunits.find(item => item.id === "5-1-u5-s2");
const types = subunit?.types || [];
check(Boolean(unit), "5-1 5단원을 찾을 수 없습니다.");
check(Boolean(subunit), "5-1 5단원 두 번째 소단원(분수의 뺄셈)을 찾을 수 없습니다.");
check(types.length === expected.length, `분수의 뺄셈 유형 수가 ${expected.length}개가 아닙니다: ${types.length}`);
check(new Set(types.map(type => type.sourceItemId)).size === expected.length, "17개 출처 ID가 중복됩니다.");

expected.forEach(([sourceItemId, kind, contract, sourceSection, sourcePdfPage, sourcePrintedPage], index) => {
  const type = types[index];
  check(Boolean(type), `유형 ${index + 1}이 없습니다: ${sourceItemId}`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호 ${index}가 아닙니다: ${type.variant}`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.generatorKey === "fractionSubtractionE2", `${type.id}: 등록 생성기가 다릅니다: ${type.generatorKey}`);
  check(api.generatorKey(type) === "fractionSubtractionE2", `${type.id}: 실제 생성기 연결이 다릅니다: ${api.generatorKey(type)}`);
  check(type.sourceTier === "advanced", `${type.id}: 심화 출처 층이 아닙니다.`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 공개 대상인데 잠겨 있습니다.`);
  check(type.reviewReason.includes("독립 계산"), `${type.id}: 독립 계산 검수 근거가 없습니다.`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === sourcePdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === sourcePrintedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceEvidence.includes(`PDF p.${sourcePdfPage}`), `${type.id}: PDF 쪽 근거가 없습니다.`);
  check(type.sourceEvidence.includes(`교재 p.${sourcePrintedPage}`), `${type.id}: 교재 쪽 근거가 없습니다.`);
  check(type.sourceEvidence.includes(sourceItemId), `${type.id}: 출처 ID 근거가 없습니다.`);
  check(Boolean(type.label && type.name), `${type.id}: 유형 이름이 비어 있습니다.`);
  check(type.difficultyBand === 1, `${type.id}: 심화 난이도 띠가 아닙니다: ${type.difficultyBand}`);
  check(kind && contract, `${type.id}: 감사 기준이 비어 있습니다.`);
});

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
function parseEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-fraction-subtraction-e2-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!tag) throw new Error("독립 검산 태그가 없습니다.");
  const valuesText = attribute(tag, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("검산 값이 정수가 아닙니다.");
  return {
    kind: attribute(tag, "data-fraction-subtraction-e2-kind"),
    sourceItemId: attribute(tag, "data-source-item"),
    values,
    contract: attribute(tag, "data-result-contract")
  };
}

function permutations(values) {
  const output = [];
  const visit = (picked, rest) => {
    if (!rest.length) return output.push(picked);
    rest.forEach((value, index) => visit([...picked, value], [...rest.slice(0, index), ...rest.slice(index + 1)]));
  };
  visit([], values);
  return output;
}

function independent(evidence) {
  const { kind, values } = evidence;
  if (kind === "proper-subtraction") {
    check(values.length === 4, "진분수 두 항의 자료 길이가 다릅니다.");
    check(proper(values[0], values[1]) && proper(values[2], values[3]), "진분수 조건이 아닙니다.");
    const value = subtract(rational(values[0], values[1]), rational(values[2], values[3]));
    check(compare(rational(values[0], values[1]), rational(values[2], values[3])) > 0, "진분수 뺄셈의 차가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "proper-three-term-subtraction") {
    check(values.length === 6, "진분수 세 항의 자료 길이가 다릅니다.");
    check(pairs(values).every(value => proper(value.numerator, value.denominator)), "진분수 세 항 조건이 아닙니다.");
    const [first, second, third] = pairs(values);
    const value = subtract(subtract(first, second), third);
    check(value.numerator > 0, "진분수 세 항의 차가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "mixed-subtraction") {
    check(values.length === 6 && proper(values[1], values[2]) && proper(values[4], values[5]), "대분수 두 항 조건이 아닙니다.");
    const first = mixed(values[0], values[1], values[2]);
    const second = mixed(values[3], values[4], values[5]);
    const value = subtract(first, second);
    check(compare(first, second) > 0, "대분수 뺄셈의 차가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "mixed-three-term-subtraction") {
    check(values.length === 9, "대분수 세 항의 자료 길이가 다릅니다.");
    const terms = [mixed(values[0], values[1], values[2]), mixed(values[3], values[4], values[5]), mixed(values[6], values[7], values[8])];
    check([values[1], values[4], values[7]].every((numerator, index) => proper(numerator, values[index * 3 + 2])), "대분수 세 항의 분수 부분이 올바르지 않습니다.");
    const value = subtract(subtract(terms[0], terms[1]), terms[2]);
    check(value.numerator > 0, "대분수 세 항의 차가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "card-max-a-plus-b-minus-c") {
    check(values.length === 8 && values.every(Number.isInteger), "네 분수 카드 자료가 올바르지 않습니다.");
    const cards = pairs(values);
    check(cards.every(card => proper(card.numerator, card.denominator)), "네 분수 카드가 진분수가 아닙니다.");
    const allCandidates = [];
    for (let first = 0; first < cards.length; first += 1) for (let second = 0; second < cards.length; second += 1) for (let third = 0; third < cards.length; third += 1) {
      if (first === second || first === third || second === third) continue;
      const value = subtract(add(cards[first], cards[second]), cards[third]);
      allCandidates.push(value);
    }
    check(allCandidates.length === 24, `네 카드 4P3 전수 후보가 24개가 아닙니다: ${allCandidates.length}`);
    const candidates = allCandidates.filter(value => value.numerator > 0);
    check(candidates.length > 0, "네 카드로 만들 수 있는 양의 결과가 없습니다.");
    const best = candidates.reduce((current, value) => compare(value, current) > 0 ? value : current, candidates[0]);
    const winners = candidates.filter(value => compare(value, best) === 0);
    check(new Set(winners.map(key)).size === 1, "네 카드 최댓값이 하나로 정해지지 않습니다.");
    return { value: best, candidates, winners };
  }
  if (kind === "descending-mixed-sequence-blanks") {
    check(values.length === 5 && values[1] > 0 && values[2] > 0, "내림차순 수열 자료가 올바르지 않습니다.");
    const [startNumerator, denominator, stepNumerator, firstBlank, secondBlank] = values;
    const start = rational(startNumerator, denominator);
    const step = rational(stepNumerator, denominator);
    check(compare(start, step) > 0 && firstBlank === 3 && secondBlank === 5, "수열의 시작값·차·빈칸 순서가 올바르지 않습니다.");
    const sequence = Array.from({ length: 6 }, (_, index) => subtract(start, rational(stepNumerator * index, denominator)));
    check(sequence.every(value => value.numerator > 0), "수열에 양수가 아닌 항이 있습니다.");
    return { value: [sequence[firstBlank], sequence[secondBlank]], candidates: [[sequence[firstBlank], sequence[secondBlank]]] };
  }
  if (kind === "neither-group-inclusion-exclusion") {
    check(values.length === 6 && pairs(values).every(value => value.numerator > 0 && value.numerator < value.denominator), "두 집단 비율 자료가 올바르지 않습니다.");
    const [first, second, both] = pairs(values);
    check(compare(both, first) <= 0 && compare(both, second) <= 0, "두 집단 모두에 해당하는 비율이 더 큽니다.");
    const union = subtract(add(first, second), both);
    const value = subtract(integer(1), union);
    check(value.numerator > 0 && compare(union, integer(1)) <= 0, "어느 집단도 아닌 비율이 범위를 벗어났습니다.");
    return { value, candidates: [value] };
  }
  if (kind === "leaky-tank-two-faucets") {
    check(values.length === 4 && values.every(value => Number.isInteger(value) && value > 0), "물통·수도꼭지 자료가 올바르지 않습니다.");
    const [firstMinutes, secondMinutes, extraMinutes, togetherMinutes] = values;
    const changedSecondMinutes = secondMinutes + extraMinutes;
    const rate = add(rational(1, firstMinutes), rational(1, changedSecondMinutes));
    const value = multiply(integer(togetherMinutes), rate);
    check(value.numerator > 0 && compare(value, integer(1)) <= 0, "두 수도꼭지로 채워지는 양이 범위를 벗어났습니다.");
    check(changedSecondMinutes > secondMinutes, "구멍으로 늘어난 수도꼭지 시간이 반영되지 않았습니다.");
    return { value, candidates: [value] };
  }
  if (kind === "proper-a-plus-b-minus-c") {
    check(values.length === 6 && pairs(values).every(value => proper(value.numerator, value.denominator)), "진분수 덧셈·뺄셈 자료가 올바르지 않습니다.");
    const [first, second, third] = pairs(values);
    const value = subtract(add(first, second), third);
    check(value.numerator > 0, "진분수 덧셈·뺄셈의 결과가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "natural-mixed-plus-proper") {
    check(values.length === 6 && values[0] > 0 && values[1] > 0 && proper(values[2], values[3]) && proper(values[4], values[5]), "자연수·대분수·진분수 자료가 올바르지 않습니다.");
    const value = add(subtract(integer(values[0]), mixed(values[1], values[2], values[3])), rational(values[4], values[5]));
    check(value.numerator > 0, "자연수·대분수·진분수 계산 결과가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "mixed-a-minus-b-plus-c") {
    check(values.length === 9 && proper(values[1], values[2]) && proper(values[4], values[5]) && proper(values[7], values[8]), "대분수 덧셈·뺄셈 자료가 올바르지 않습니다.");
    const value = add(subtract(mixed(values[0], values[1], values[2]), mixed(values[3], values[4], values[5])), mixed(values[6], values[7], values[8]));
    check(value.numerator > 0, "대분수 덧셈·뺄셈의 결과가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "outer-minus-mixed-plus-proper-minus-mixed") {
    check(values.length === 11 && proper(values[1], values[2]) && proper(values[4], values[5]) && proper(values[6], values[7]) && proper(values[9], values[10]), "괄호 계산 자료가 올바르지 않습니다.");
    const outer = mixed(values[0], values[1], values[2]);
    const inner = subtract(add(mixed(values[3], values[4], values[5]), rational(values[6], values[7])), mixed(values[8], values[9], values[10]));
    const value = subtract(outer, inner);
    check(inner.numerator > 0 && value.numerator > 0, "괄호 계산의 중간값 또는 결과가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "max-min-five-fractions") {
    check(values.length === 10 && pairs(values).every(value => proper(value.numerator, value.denominator)), "다섯 분수 자료가 올바르지 않습니다.");
    const valuesAsRationals = pairs(values);
    const largest = valuesAsRationals.reduce((current, value) => compare(value, current) > 0 ? value : current, valuesAsRationals[0]);
    const smallest = valuesAsRationals.reduce((current, value) => compare(value, current) < 0 ? value : current, valuesAsRationals[0]);
    check(valuesAsRationals.filter(value => compare(value, largest) === 0).length === 1, "가장 큰 분수가 하나로 정해지지 않습니다.");
    check(valuesAsRationals.filter(value => compare(value, smallest) === 0).length === 1, "가장 작은 분수가 하나로 정해지지 않습니다.");
    return { value: subtract(largest, smallest), candidates: [subtract(largest, smallest)] };
  }
  if (kind === "empty-container-half-water") {
    check(values.length === 8, "물통 무게 자료의 길이가 다릅니다.");
    const [empty, water, full, after] = [rational(values[0], values[1]), rational(values[2], values[3]), rational(values[4], values[5]), rational(values[6], values[7])];
    const recomputedFull = add(empty, water);
    const recomputedAfter = add(empty, divide(water, integer(2)));
    check(compare(full, recomputedFull) === 0 && compare(after, recomputedAfter) === 0, "물통 전체 무게와 반 사용 후 무게가 일치하지 않습니다.");
    const value = subtract(multiply(after, integer(2)), full);
    check(value.numerator > 0 && empty.numerator > 0, "빈 물통의 무게가 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "blank-plus-a-minus-b") {
    check(values.length === 9 && proper(values[1], values[2]) && proper(values[4], values[5]) && proper(values[7], values[8]), "빈칸 식 자료가 올바르지 않습니다.");
    const value = add(subtract(mixed(values[6], values[7], values[8]), mixed(values[0], values[1], values[2])), mixed(values[3], values[4], values[5]));
    check(value.numerator > 0, "빈칸 식의 답이 양수가 아닙니다.");
    return { value, candidates: [value] };
  }
  if (kind === "fraction-magic-three-labels") {
    check(values.length === 6 && values[0] > 0 && values[1] > 0, "분수 마방진 자료가 올바르지 않습니다.");
    const [denominator, scale, offset, firstBlank, secondBlank, thirdBlank] = values;
    check(firstBlank === 0 && secondBlank === 4 && thirdBlank === 8, "마방진 빈칸 위치가 원문과 다릅니다.");
    const base = [8, 1, 6, 3, 5, 7, 4, 9, 2];
    const grid = base.map(value => rational(value * scale + offset, denominator));
    check(grid.every(value => value.numerator > 0 && value.numerator < value.denominator), "마방진의 수가 진분수 범위를 벗어났습니다.");
    const rowRemainders = [add(grid[1], grid[2]), add(grid[3], grid[5]), add(grid[6], grid[7])];
    const colRemainders = [add(grid[3], grid[6]), add(grid[1], grid[7]), add(grid[2], grid[5])];
    check(rowRemainders.every((value, index) => compare(value, colRemainders[index]) === 0), "마방진의 대응하는 행·열 고정 합 조건이 다릅니다.");
    const common = divide(sum(rowRemainders), integer(2));
    const blanks = [subtract(common, rowRemainders[0]), subtract(common, rowRemainders[1]), subtract(common, rowRemainders[2])];
    const completed = [...grid];
    completed[0] = blanks[0];
    completed[4] = blanks[1];
    completed[8] = blanks[2];
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ].map(line => sum(line.map(index => completed[index])));
    check(lines.every(value => compare(value, common) === 0), "마방진의 모든 행·열·대각선 합이 같지 않습니다.");
    check(new Set(blanks.map(key)).size === 3, "마방진 빈칸 값이 서로 겹칩니다.");
    // Every valid common sum forces each blank to common sum minus its two visible neighbours.
    const candidateTriples = [blanks].filter(candidate => candidate.length === 3 && candidate.every(Boolean));
    check(candidateTriples.length === 1, `마방진 빈칸 후보가 ${candidateTriples.length}개입니다.`);
    return { value: sum(blanks), candidates: candidateTriples, blanks };
  }
  if (kind === "digit-card-max-mixed-difference") {
    check(values.length === 6 && values.every(value => Number.isInteger(value) && value > 0), "여섯 수 카드 자료가 올바르지 않습니다.");
    check(new Set(values).size === 6, "여섯 수 카드가 서로 다르지 않습니다.");
    const candidates = [];
    permutations(values).forEach(chosen => {
      if (chosen[1] >= chosen[2] || chosen[4] >= chosen[5]) return;
      const first = mixed(chosen[0], chosen[1], chosen[2]);
      const second = mixed(chosen[3], chosen[4], chosen[5]);
      const value = subtract(first, second);
      if (value.numerator > 0) candidates.push(value);
    });
    check(candidates.length > 0, "여섯 카드로 만들 수 있는 양의 대분수 차가 없습니다.");
    const best = candidates.reduce((current, value) => compare(value, current) > 0 ? value : current, candidates[0]);
    const winners = candidates.filter(value => compare(value, best) === 0);
    check(new Set(winners.map(key)).size === 1, "여섯 카드 최댓값이 하나로 정해지지 않습니다.");
    return { value: best, candidates, winners };
  }
  throw new Error(`알 수 없는 검산 종류: ${kind}`);
}

function parseValue(text) {
  const cleaned = String(text).replace(/<[^>]*>/g, " ").replace(/,/g, " ").trim();
  const mixedMatch = cleaned.match(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixedMatch) return mixed(Number(mixedMatch[1]), Number(mixedMatch[2]), Number(mixedMatch[3]));
  const fractionMatch = cleaned.match(/(-?\d+)\s*\/\s*(\d+)/);
  if (fractionMatch) return rational(Number(fractionMatch[1]), Number(fractionMatch[2]));
  const numberMatch = cleaned.match(/-?\d+/);
  return numberMatch ? integer(Number(numberMatch[0])) : null;
}
function parsePairAnswer(text) {
  const parts = String(text).split(",").map(part => part.trim()).filter(Boolean);
  return parts.length === 2 ? parts.map(parseValue) : null;
}
function answerMatches(answer, value) {
  if (Array.isArray(value)) {
    const parsed = parsePairAnswer(answer);
    return Boolean(parsed && parsed.length === value.length && parsed.every((item, index) => item && compare(item, value[index]) === 0));
  }
  const parsed = parseValue(answer);
  return Boolean(parsed && value && compare(parsed, value) === 0);
}
const visibleText = html => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const noElementaryOutOfScope = /√|제곱근|순열|조합|방정식|미지수/;

const promptVariants = new Map();
const answerVariants = new Map();
let checked = 0;

for (let index = 0; index < expected.length; index += 1) {
  const type = types[index];
  if (!type) continue;
  const [sourceItemId, expectedKind, expectedContract] = expected[index];
  for (const difficulty of [-1, 0, 1]) {
    const prompts = new Set();
    const answers = new Set();
    for (let seed = 1; seed <= 1000; seed += 1) {
      const context = `${type.id} / 변형 ${type.variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      activeContext = context;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), `${context}: 문제·정답·풀이가 비어 있습니다.`);
        if (!generated) continue;
        check(generated.generator === "fractionSubtractionE2", `${context}: 실제 생성기 표시가 다릅니다: ${generated.generator}`);
        check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 깨진 값이 있습니다.`);
        const evidence = parseEvidence(generated.prompt);
        check(evidence.kind === expectedKind, `${context}: 검산 분기가 다릅니다: ${evidence.kind}`);
        check(evidence.sourceItemId === sourceItemId, `${context}: 숨은 출처 ID가 다릅니다: ${evidence.sourceItemId}`);
        check(evidence.contract === expectedContract, `${context}: 답 계약이 다릅니다: ${evidence.contract}`);
        const recomputed = independent(evidence);
        check(recomputed.candidates.length > 0, `${context}: 정답 후보가 0개입니다.`);
        check(answerMatches(generated.answer, recomputed.value), `${context}: 표시 답 ${generated.answer}와 독립 계산 ${Array.isArray(recomputed.value) ? recomputed.value.map(key).join(",") : key(recomputed.value)}가 다릅니다.`);
        const visible = visibleText(`${generated.prompt}\n${generated.solution}`);
        check(!/\d+\s*\/\s*\d+/.test(visible), `${context}: 본문에 raw 숫자/숫자 형태 분수가 남아 있습니다.`);
        check((generated.prompt + generated.solution).includes("math-fraction") || (generated.prompt + generated.solution).includes("math-mixed-number"), `${context}: 구조화된 분수 표시가 없습니다.`);
        check(!noElementaryOutOfScope.test(visible), `${context}: 초등 교육과정 밖 표현이 있습니다.`);
        if (expectedKind === "card-max-a-plus-b-minus-c") check(generated.prompt.includes("네 분수") && generated.prompt.includes("가장 크게"), `${context}: 네 카드 최댓값 조건이 분명하지 않습니다.`);
        if (expectedKind === "digit-card-max-mixed-difference") check(generated.prompt.includes("한 번씩 모두 사용") && generated.prompt.includes("가장 클 때"), `${context}: 여섯 카드 최댓값 조건이 분명하지 않습니다.`);
        if (expectedKind === "descending-mixed-sequence-blanks") check(generated.prompt.includes("차례로"), `${context}: 수열 두 답의 순서 조건이 없습니다.`);
        if (expectedKind === "leaky-tank-two-faucets") check(generated.prompt.includes("구멍") && generated.prompt.includes("두 수도꼭지"), `${context}: 물통·수도꼭지 조건이 분명하지 않습니다.`);
        if (expectedKind === "fraction-magic-three-labels") check(generated.prompt.includes("가로, 세로, 대각선") && generated.prompt.includes("㉠+㉡+㉢"), `${context}: 마방진 조건 또는 빈칸 표시가 없습니다.`);
        prompts.add(visibleText(generated.prompt));
        answers.add(String(generated.answer));
        checked += 1;
      } catch (error) {
        fail(error.message);
      }
    }
    activeContext = "";
    promptVariants.set(`${type.id}/${difficulty}`, prompts.size);
    answerVariants.set(`${type.id}/${difficulty}`, answers.size);
    check(prompts.size >= 2, `${type.id} / 난이도 ${difficulty}: 문제 변형이 ${prompts.size}개뿐입니다.`);
    check(answers.size >= 2, `${type.id} / 난이도 ${difficulty}: 답 변형이 ${answers.size}개뿐입니다.`);
  }
}

if (failures.length) {
  console.error(`5-1 분수의 뺄셈 개념탐구 2 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  console.error(`확인 생성 수: ${checked.toLocaleString()}회 / 목표 51,000회`);
  console.error(`실패 분포: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.count])))}`);
  console.error(`첫 실패: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.first])))}`);
  console.error(`문제 변형 수: ${JSON.stringify(Object.fromEntries(promptVariants))}`);
  console.error(`답 변형 수: ${JSON.stringify(Object.fromEntries(answerVariants))}`);
  process.exit(1);
}

console.log(`5-1 분수의 뺄셈 개념탐구 2 독립 감사 통과: 원문 17유형 · 공개 17/잠금 0 · ${checked.toLocaleString()}회 독립 계산·전수 후보·수식·언어·다양성 검사`);
