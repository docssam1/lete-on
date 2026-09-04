"use strict";

// Independent audit for the 11 source-level types in 5-1 U5 E3.
// This file deliberately treats the generator as an untrusted producer:
// answers are recomputed from the hidden evidence tag only.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const fs = require("fs");
const path = require("path");
const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const inventoryPath = path.join(__dirname, "source-inventory", "5-1-u5-e3-readiness-review.json");
const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
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
const divide = (left, right) => right && right.numerator !== 0
  ? rational(left.numerator * right.denominator, left.denominator * right.numerator)
  : null;
const compare = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;
const key = value => `${value.numerator}/${value.denominator}`;
const sum = values => values.reduce((total, value) => add(total, value), integer(0));
const proper = (value, context) => {
  check(Boolean(value) && value.denominator > 0, `${context}: 분모가 0 이하입니다.`);
  check(Boolean(value) && value.numerator > 0 && value.numerator < value.denominator, `${context}: 진분수 범위를 벗어났습니다.`);
  check(Boolean(value) && gcd(value.numerator, value.denominator) === 1, `${context}: 기약분수로 정리되지 않았습니다.`);
  return value;
};
const requireValues = (values, length, context) => {
  check(values.length === length, `${context}: 숨은 값의 개수가 ${length}개가 아닙니다: ${values.length}`);
  check(values.every(value => Number.isInteger(value) && Number.isFinite(value)), `${context}: 숨은 값에 정수가 아닌 값이 있습니다.`);
};
const parseAnswer = text => {
  const cleaned = String(text).replace(/<[^>]*>/g, " ").replace(/,/g, " ").trim();
  const mixed = cleaned.match(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return rational(Number(mixed[1]) * Number(mixed[3]) + Number(mixed[2]), Number(mixed[3]));
  const fraction = cleaned.match(/(-?\d+)\s*\/\s*(\d+)/);
  if (fraction) return rational(Number(fraction[1]), Number(fraction[2]));
  const number = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!number) return null;
  if (number[0].includes(".")) {
    const decimals = number[0].split(".")[1].length;
    return rational(Math.round(Number(number[0]) * 10 ** decimals), 10 ** decimals);
  }
  return integer(Number(number[0]));
};
const parseTupleAnswer = text => String(text).split(",").map(item => parseAnswer(item.trim())).filter(Boolean);
const answerMatches = (answer, expected, context) => {
  const shown = parseTupleAnswer(answer);
  check(shown.length === expected.length, `${context}: 표시 답의 항목 수가 ${expected.length}개가 아닙니다: ${answer}`);
  if (shown.length !== expected.length) return;
  expected.forEach((value, index) => check(compare(shown[index], value) === 0, `${context}: 표시 답 ${index + 1}번 ${key(shown[index])}과 독립 계산 ${key(value)}가 다릅니다.`));
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const parseEvidence = prompt => {
  const tag = prompt.match(/<span hidden data-fraction-application-e3-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!tag) throw new Error("독립 검산 태그가 없습니다.");
  const valuesText = attribute(tag, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("검산 값이 정수가 아닙니다.");
  return {
    kind: attribute(tag, "data-fraction-application-e3-kind"),
    sourceItemId: attribute(tag, "data-source-item"),
    values,
    contract: attribute(tag, "data-result-contract")
  };
};
const visibleText = html => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const noElementaryOutOfScope = /√|제곱근|순열|조합|방정식|미지수|9P4/;

const expected = [
  ["5-1-u5-e3-exploration", "cube-equal-face-sums", "single-tuple", 55, 56, false],
  ["5-1-u5-e3-example-3-1", "diophantus-age", "single-value", 55, 56, false],
  ["5-1-u5-e3-example-3-2", "three-values-from-differences-and-sum", "single-tuple", 55, 56, false],
  ["5-1-u5-e3-example-3-3", "sold-fractions-to-initial-total", "single-value", 55, 56, false],
  ["5-1-u5-e3-example-3-4", "wet-rods-and-pond-depth", "single-value", 55, 56, false],
  ["5-1-u5-e3-mission-1", "candy-share-initial-total", "single-value", 56, 57, false],
  ["5-1-u5-e3-mission-2", "same-natural-number-in-fractions", "single-value", 56, 57, false],
  ["5-1-u5-e3-mission-3", "apple-pear-total", "single-value", 56, 57, false],
  ["5-1-u5-e3-mission-4", "travel-total-from-end-walks", "single-value", 56, 57, false],
  ["5-1-u5-e3-mission-5", "inclusion-exclusion-total", "single-value", 56, 57, false],
  ["5-1-u5-e3-mission-6", "four-distinct-digits-fraction-equation", "unique-permutation", 56, 57, false]
];

const unit = curriculum.semesters.find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u5");
const subunit = unit?.subunits.find(item => item.id === "5-1-u5-s3");
const types = subunit?.types || [];
check(Boolean(unit), "5-1 5단원을 찾을 수 없습니다.");
check(Boolean(subunit), "5-1 5단원 세 번째 소단원(분수의 덧셈과 뺄셈 활용)을 찾을 수 없습니다.");
check(types.length === expected.length, `E3 유형 수가 ${expected.length}개가 아닙니다: ${types.length}`);
check(new Set(types.map(type => type.sourceItemId)).size === expected.length, "E3 출처 ID가 중복됩니다.");
check(inventory.summary?.sourceItemCount === expected.length && inventory.items.length === expected.length, "E3 원장 문항 수가 11개가 아닙니다.");

expected.forEach(([sourceItemId, kind, contract, sourcePdfPage, sourcePrintedPage, expectedLocked], index) => {
  const type = types[index];
  const source = inventory.items.find(item => item.sourceItemId === sourceItemId);
  check(Boolean(type), `유형 ${index + 1}이 없습니다: ${sourceItemId}`);
  check(Boolean(source), `원장에 출처가 없습니다: ${sourceItemId}`);
  if (!type || !source) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}가 아닙니다: ${type.variant}`);
  check(type.generatorKey === "fractionApplicationE3" && api.generatorKey({ ...type, reviewLocked: false }) === "fractionApplicationE3", `${type.id}: E3 생성기 연결이 아닙니다.`);
  check(type.sourceItemId === sourceItemId && type.sourceVerified === true && type.sourceTier === "advanced", `${type.id}: 원문·심화 확인 정보가 부족합니다.`);
  check(type.difficultyBand === 1, `${type.id}: 심화 난이도 띠가 아닙니다: ${type.difficultyBand}`);
  check(type.sourcePdfPage === sourcePdfPage && type.sourcePrintedPage === sourcePrintedPage, `${type.id}: 원문 쪽 정보가 다릅니다.`);
  check(type.sourceEvidence.includes("심화") && type.sourceEvidence.includes(`PDF p.${sourcePdfPage}`) && type.sourceEvidence.includes(`교재 p.${sourcePrintedPage}`) && type.sourceEvidence.includes(sourceItemId), `${type.id}: 원문 근거가 완전하지 않습니다.`);
  check(source.sourcePdfPage === sourcePdfPage && source.sourcePrintedPage === sourcePrintedPage && source.sourceVerified === true, `${sourceItemId}: 원장 쪽·확인 정보가 다릅니다.`);
  check(Boolean(type.name && type.label && source.typeLabel && source.childFriendlyTypeLabel), `${type.id}: 유형명이 비어 있습니다.`);
  check(type.reviewLocked === expectedLocked, `${type.id}: 잠금 기대값이 ${expectedLocked}가 아닙니다: ${type.reviewLocked}`);
  check(type.reviewReason.includes("독립"), `${type.id}: 독립 검산 근거가 없습니다.`);
  check(kind && contract, `${type.id}: 감사 계약이 비어 있습니다.`);
});

function permutations(values) {
  const output = [];
  const visit = (picked, rest) => {
    if (!rest.length) return output.push(picked);
    rest.forEach((value, index) => visit([...picked, value], [...rest.slice(0, index), ...rest.slice(index + 1)]));
  };
  visit([], values);
  return output;
}

// The face equations are solved from the eight hidden vertices. The three
// unknowns are C=(가), G=(나), and F=(다), in that order.
function solveCube(values) {
  requireValues(values, 16, "정육면체");
  const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const vertices = Object.fromEntries(names.map((name, index) => [name, rational(values[index * 2], values[index * 2 + 1])]));
  names.forEach(name => check(Boolean(vertices[name]) && vertices[name].denominator > 0, `정육면체 ${name}의 분모가 올바르지 않습니다.`));
  const faces = [["A", "B", "D", "C"], ["E", "F", "H", "G"], ["A", "C", "E", "G"], ["B", "D", "F", "H"], ["C", "D", "F", "E"], ["A", "B", "H", "G"]];
  const unknowns = ["C", "F", "G"];
  const rows = faces.slice(1).map(face => {
    const base = faces[0];
    const coefficients = unknowns.map(name => (face.includes(name) ? 1 : 0) - (base.includes(name) ? 1 : 0));
    const constant = sum(face.filter(name => !unknowns.includes(name)).map(name => vertices[name]));
    const baseConstant = sum(base.filter(name => !unknowns.includes(name)).map(name => vertices[name]));
    return { coefficients, right: subtract(baseConstant, constant) };
  });
  const matrix = rows.map(row => [...row.coefficients.map(value => rational(value)), row.right]);
  for (let pivot = 0; pivot < 3; pivot += 1) {
    let pivotRow = pivot;
    while (pivotRow < matrix.length && matrix[pivotRow][pivot].numerator === 0) pivotRow += 1;
    if (pivotRow === matrix.length) throw new Error("정육면체 빈칸의 연립 조건이 하나로 정해지지 않습니다.");
    [matrix[pivot], matrix[pivotRow]] = [matrix[pivotRow], matrix[pivot]];
    const divisor = matrix[pivot][pivot];
    matrix[pivot] = matrix[pivot].map(value => divide(value, divisor));
    for (let row = 0; row < matrix.length; row += 1) {
      if (row === pivot) continue;
      const factor = matrix[row][pivot];
      matrix[row] = matrix[row].map((value, column) => subtract(value, multiply(factor, matrix[pivot][column])));
    }
  }
  matrix.forEach(row => check(row.slice(0, 3).every(value => value.numerator === 0) ? row[3].numerator === 0 : true, "정육면체 면합 조건이 서로 모순됩니다."));
  const solvedInVertexOrder = [matrix[0][3], matrix[1][3], matrix[2][3]];
  const calculatedFaces = faces.map(face => sum(face.map(name => unknowns.includes(name) ? solvedInVertexOrder[unknowns.indexOf(name)] : vertices[name])));
  check(calculatedFaces.every(face => compare(face, calculatedFaces[0]) === 0), "정육면체 여섯 면의 합이 같지 않습니다.");
  // The vertex unknowns are C,F,G, while the printed answer order is 가,나,다.
  const answerOrder = [solvedInVertexOrder[0], solvedInVertexOrder[2], solvedInVertexOrder[1]];
  return { value: answerOrder, candidates: [answerOrder], vertices, faces, common: calculatedFaces[0] };
}

function independent(evidence) {
  const { kind, values } = evidence;
  if (kind === "cube-equal-face-sums") return solveCube(values);
  if (kind === "diophantus-age") {
    requireValues(values, 10, kind);
    const [oneA, denA, oneB, denB, oneC, denC, firstGap, oneD, denD, secondGap] = values;
    const coefficient = subtract(integer(1), sum([rational(oneA, denA), rational(oneB, denB), rational(oneC, denC), rational(oneD, denD)]));
    const value = divide(integer(firstGap + secondGap), coefficient);
    check(value && value.denominator === 1 && value.numerator > 0, `${kind}: 전체 나이가 자연수가 아닙니다.`);
    return { value, candidates: value ? [value] : [] };
  }
  if (kind === "three-values-from-differences-and-sum") {
    requireValues(values, 8, kind);
    const [aN, aD, d1N, d1D, d2N, d2D, totalN, totalD] = values;
    const a = rational(aN, aD);
    const b = subtract(a, rational(d1N, d1D));
    const c = subtract(a, rational(d2N, d2D));
    const total = rational(totalN, totalD);
    check(b.numerator > 0 && c.numerator > 0 && compare(add(add(a, b), c), total) === 0, `${kind}: 세 수의 차·합 조건이 맞지 않습니다.`);
    return { value: [a, b, c], candidates: [[a, b, c]] };
  }
  if (kind === "sold-fractions-to-initial-total") {
    requireValues(values, 7, kind);
    const [d1, d2, d3, d4, remaining, totalN, totalD] = values;
    const sold = sum([rational(1, d1), rational(1, d2), rational(5, d3), rational(1, d4)]);
    const leftRate = subtract(integer(1), sold);
    const value = divide(integer(remaining), leftRate);
    check(value && value.denominator === 1 && value.numerator > 0 && compare(sold, integer(1)) < 0, `${kind}: 남은 양으로 자연수 전체가 하나로 정해지지 않습니다.`);
    return { value, candidates: value ? [value] : [] };
  }
  if (kind === "wet-rods-and-pond-depth") {
    requireValues(values, 11, kind);
    const [difference, longLength, shortLength, longN, longD, shortN, shortD, depthCmN, depthCmD, depthMN, depthMD] = values;
    const longWet = rational(longLength * longN, longD);
    const shortWet = rational(shortLength * shortN, shortD);
    const depthCm = rational(depthCmN, depthCmD);
    const depthM = rational(depthMN, depthMD);
    check(longLength - shortLength === difference && compare(longWet, shortWet) === 0 && compare(shortWet, depthCm) === 0 && compare(depthM, divide(depthCm, integer(100))) === 0, `${kind}: 막대 길이·젖은 길이·단위 변환이 맞지 않습니다.`);
    check(longWet.numerator > 0 && shortWet.numerator > 0, `${kind}: 젖은 길이가 양수가 아닙니다.`);
    return { value: depthM, candidates: [depthM] };
  }
  if (kind === "candy-share-initial-total") {
    requireValues(values, 12, kind);
    const [total, firstN, firstD, extraFirst, extraSecond, thirdN, thirdD, lessThird, leftover, first, second, third] = values;
    const expectedFirst = add(multiply(integer(total), rational(firstN, firstD)), integer(extraFirst)).numerator;
    const expectedSecond = expectedFirst + extraSecond;
    const expectedThird = subtract(multiply(integer(total), rational(thirdN, thirdD)), integer(lessThird)).numerator;
    check(first === expectedFirst && second === expectedSecond && third === expectedThird && first + second + third + leftover === total, `${kind}: 사람별 분배와 처음 개수가 맞지 않습니다.`);
    return { value: integer(total), candidates: [integer(total)] };
  }
  if (kind === "same-natural-number-in-fractions") {
    requireValues(values, 13, kind);
    const [x, fixedN, fixedD, oneN, oneD, twoN, twoD, threeN, threeD, lastN, lastD, targetN, targetD] = values;
    const fixed = add(rational(fixedN, fixedD), rational(lastN, lastD));
    const coefficient = sum([rational(oneN, oneD), rational(twoN, twoD), rational(threeN, threeD)]);
    const target = rational(targetN, targetD);
    const candidate = divide(subtract(target, fixed), coefficient);
    check(candidate && candidate.denominator === 1 && candidate.numerator > 0 && candidate.numerator === x, `${kind}: 같은 자연수 조건의 답이 맞지 않습니다.`);
    return { value: integer(x), candidates: candidate ? [candidate] : [] };
  }
  if (kind === "apple-pear-total") {
    requireValues(values, 9, kind);
    const [appleExtra, pearExtra, appleN, appleD, pearN, pearD, apples, pears, total] = values;
    const expectedApples = multiply(integer(total), rational(appleN, appleD)).numerator + appleExtra;
    const expectedPears = multiply(integer(total), rational(pearN, pearD)).numerator + pearExtra;
    check(apples === expectedApples && pears === expectedPears && apples + pears === total, `${kind}: 사과·배의 수와 전체가 맞지 않습니다.`);
    const coefficient = subtract(integer(1), add(rational(appleN, appleD), rational(pearN, pearD)));
    const candidate = divide(integer(appleExtra + pearExtra), coefficient);
    check(candidate && candidate.denominator === 1 && candidate.numerator === total, `${kind}: 전체 과일의 후보가 하나가 아닙니다.`);
    return { value: integer(total), candidates: candidate ? [candidate] : [] };
  }
  if (kind === "travel-total-from-end-walks") {
    requireValues(values, 8, kind);
    const [firstWalk, lastWalk, trainN, trainD, busN, busD, totalN, totalD] = values;
    const walkRate = subtract(integer(1), add(rational(trainN, trainD), rational(busN, busD)));
    const value = divide(integer(firstWalk + lastWalk), walkRate);
    const declared = rational(totalN, totalD);
    check(value && value.denominator === 1 && value.numerator > 0 && compare(value, declared) === 0, `${kind}: 이동 비율과 전체 거리가 맞지 않습니다.`);
    return { value, candidates: value ? [value] : [] };
  }
  if (kind === "inclusion-exclusion-total") {
    requireValues(values, 11, kind);
    const [mathN, mathD, englishN, englishD, neitherN, neitherD, both, bothRateN, bothRateD, totalN, totalD] = values;
    const union = subtract(integer(1), rational(neitherN, neitherD));
    const bothRate = subtract(add(rational(mathN, mathD), rational(englishN, englishD)), union);
    const value = divide(integer(both), bothRate);
    const declaredBothRate = rational(bothRateN, bothRateD);
    const declaredTotal = rational(totalN, totalD);
    check(compare(bothRate, declaredBothRate) === 0 && value && value.denominator === 1 && compare(value, declaredTotal) === 0, `${kind}: 겹치는 비율과 전체 학생 수가 맞지 않습니다.`);
    return { value, candidates: value ? [value] : [] };
  }
  if (kind === "four-distinct-digits-fraction-equation") {
    requireValues(values, 6, kind);
    const [a, b, c, d, targetN, targetD] = values;
    check([a, b, c, d].every(digit => digit >= 1 && digit <= 9) && new Set([a, b, c, d]).size === 4, `${kind}: 1~9 서로 다른 숫자 조건이 아닙니다.`);
    const target = rational(targetN, targetD);
    const allCandidates = [];
    for (let first = 1; first <= 9; first += 1) for (let second = 1; second <= 9; second += 1) for (let third = 1; third <= 9; third += 1) for (let fourth = 1; fourth <= 9; fourth += 1) {
      const denominator = 10 * third + fourth;
      if (new Set([first, second, third, fourth]).size !== 4) continue;
      if (gcd(first, 18) !== 1 || gcd(second, denominator) !== 1) continue;
      const candidateTarget = add(rational(first, 18), rational(second, denominator));
      allCandidates.push({ digits: [first, second, third, fourth], target: candidateTarget });
    }
    const matching = allCandidates.filter(candidate => compare(candidate.target, target) === 0);
    check(matching.length === 1, `${kind}: 같은 식의 해가 ${matching.length}개입니다.`);
    check(matching[0]?.digits.join(",") === [a, b, c, d].join(","), `${kind}: 숨은 숫자와 전수 열거 결과가 다릅니다.`);
    const answer = integer(a * b * c * d);
    return { value: answer, candidates: matching.map(candidate => integer(candidate.digits.reduce((product, digit) => product * digit, 1))) };
  }
  throw new Error(`알 수 없는 검산 종류: ${kind}`);
}

let checked = 0;
const promptVariants = new Map();
const answerVariants = new Map();

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
        // Keep generation independent from the UI lock gate while the audit
        // checks the source and answer contracts directly.
        const auditType = { ...type, reviewLocked: false };
        const generated = api.generate(auditType, 0, difficulty, seed, type.variant);
        check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), "문제·정답·풀이가 비어 있습니다.");
        if (!generated) continue;
        check(generated.generator === "fractionApplicationE3", `실제 생성기가 다릅니다: ${generated.generator}`);
        check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), "깨진 값이 있습니다.");
        const evidence = parseEvidence(generated.prompt);
        check(evidence.kind === expectedKind && evidence.sourceItemId === sourceItemId && evidence.contract === expectedContract, `숨은 출처·검산 계약이 다릅니다: ${JSON.stringify(evidence)}`);
        const recomputed = independent(evidence);
        check(recomputed.candidates.length === 1, `정답 후보가 ${recomputed.candidates.length}개입니다.`);
        const expectedValues = Array.isArray(recomputed.value) ? recomputed.value : [recomputed.value];
        answerMatches(generated.answer, expectedValues, context);
        check(recomputed.value.every ? recomputed.value.every(Boolean) : Boolean(recomputed.value), "독립 계산 결과가 비어 있습니다.");
        const visible = visibleText(`${generated.prompt}\n${generated.solution}`);
        check(!/\d+\s*\/\s*\d+/.test(visible), "본문에 raw 숫자/숫자 형태 분수가 남아 있습니다.");
        check((generated.prompt + generated.solution).includes("math-fraction") || (generated.prompt + generated.solution).includes("math-mixed-number"), "구조화된 분수 표시가 없습니다.");
        check(!noElementaryOutOfScope.test(visible), "풀이에 초등 교육과정 밖 표현이 있습니다.");
        if (expectedKind === "cube-equal-face-sums") {
          check(generated.prompt.includes("정육면체") && generated.prompt.includes("각 면") && generated.prompt.includes("(가)") && generated.prompt.includes("(나)") && generated.prompt.includes("(다)"), "정육면체 조건 또는 세 빈칸 표시가 없습니다.");
          if (difficulty === -1 && seed === 1) {
            check(key(recomputed.common) === "83/12", `원문 기본 공통합이 83/12가 아닙니다: ${key(recomputed.common)}`);
            check(recomputed.value.map(key).join(",") === "25/12,5/6,7/12", `원문 기본 답이 25/12,5/6,7/12가 아닙니다: ${recomputed.value.map(key).join(",")}`);
          }
        }
        if (expectedKind === "four-distinct-digits-fraction-equation") check(generated.prompt.includes("0이 아닌 서로 다른 한 자리 수") && generated.prompt.includes("기약분수") && generated.prompt.includes("두 자리 수"), "v10의 숫자·기약분수·두 자리 수 조건이 분명하지 않습니다.");
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
    check(prompts.size >= 1 && answers.size >= 1, `${type.id} / 난이도 ${difficulty}: 생성 결과가 없습니다.`);
  }
}

if (failures.length) {
  console.error(`5-1 분수의 덧셈과 뺄셈 활용 E3 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 160).join("\n"));
  console.error(`확인 생성 수: ${checked.toLocaleString()}회 / 목표 33,000회`);
  console.error(`실패 분포: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.count])))}`);
  console.error(`첫 실패: ${JSON.stringify(Object.fromEntries([...failureSummary.entries()].map(([bucket, value]) => [bucket, value.first])))}`);
  console.error(`문제 변형 수: ${JSON.stringify(Object.fromEntries(promptVariants))}`);
  console.error(`답 변형 수: ${JSON.stringify(Object.fromEntries(answerVariants))}`);
  process.exit(1);
}

console.log(`5-1 분수의 덧셈과 뺄셈 활용 E3 독립 감사 통과: 원문 11유형 · ${checked.toLocaleString()}회 독립 계산·정육면체 면합·전수 후보·수식·언어·잠금 상태 검사`);
