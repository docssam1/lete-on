"use strict";

// Independent audit for the 16 source-level types in 5-1 U5 E1.
// The generator is only a producer here: all answers are recomputed from its hidden data.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const failures = [];
const fail = message => failures.push(message);
const check = (condition, message) => { if (!condition) fail(message); };

const gcd = (left, right) => {
  left = Math.abs(left);
  right = Math.abs(right);
  while (right) [left, right] = [right, left % right];
  return left || 1;
};
const rational = (numerator, denominator = 1) => {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) return null;
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const divide = (left, right) => rational(left.numerator * right.denominator, left.denominator * right.numerator);
const compare = (left, right) => left.numerator * right.denominator - right.numerator * left.denominator;
const key = value => `${value.numerator}/${value.denominator}`;
const integer = value => rational(value);
const sum = values => values.reduce((total, value) => add(total, value), integer(0));
const fromPairList = values => {
  const result = [];
  for (let index = 0; index < values.length; index += 2) result.push(rational(values[index], values[index + 1]));
  return result;
};
const lcm = (left, right) => Math.abs(left * right) / gcd(left, right);

const expected = [
  ["5-1-u5-e1-exploration-proper-addition", "proper-addition", "single-value", "exploration", 51, 52],
  ["5-1-u5-e1-exploration-mixed-addition", "mixed-addition", "single-value", "exploration", 51, 52],
  ["5-1-u5-e1-example-1-1-1", "mixed-four-term-addition", "single-value", "example", 51, 52],
  ["5-1-u5-e1-example-1-1-2", "regroup-same-denominators", "single-value", "example", 51, 52],
  ["5-1-u5-e1-example-1-1-3", "grouped-fraction-series", "single-value", "example", 51, 52],
  ["5-1-u5-e1-example-1-2", "digit-card-max-mixed-sum", "maximum", "example", 51, 52],
  ["5-1-u5-e1-example-1-3", "two-tap-target-time", "single-value", "example", 51, 52],
  ["5-1-u5-e1-example-1-4", "irreducible-pair-sum-count", "single-value", "example", 51, 52],
  ["5-1-u5-e1-mission-1-proper-two-term", "proper-two-term-practice", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-1-mixed-two-term", "mixed-two-term-practice", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-1-proper-three-term", "proper-three-term-practice", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-2", "ten-part-inner-endpoint-sum", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-3", "mixed-sum-natural-count", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-4", "four-prime-digit-min-sum", "minimum", "mission", 52, 53],
  ["5-1-u5-e1-mission-5", "missing-fraction-for-smallest-natural-sum", "single-value", "mission", 52, 53],
  ["5-1-u5-e1-mission-6", "grouped-series-with-ones", "single-value", "mission", 52, 53]
];

const unit = curriculum.semesters.find(semester => semester.id === "5-1")?.units.find(item => item.id === "5-1-u5");
const subunit = unit?.subunits.find(item => item.id === "5-1-u5-s1");
const types = subunit?.types || [];
check(Boolean(unit), "5-1 5단원을 찾을 수 없습니다.");
check(Boolean(subunit), "5-1 5단원 첫 소단원(분수의 덧셈)을 찾을 수 없습니다.");
check(types.length === expected.length, `분수의 덧셈 유형 수가 ${expected.length}개가 아닙니다: ${types.length}`);
check(new Set(types.map(type => type.sourceItemId)).size === expected.length, "16개 출처 ID가 중복됩니다.");

expected.forEach(([sourceItemId, kind, contract, sourceSection, sourcePdfPage, sourcePrintedPage], index) => {
  const type = types[index];
  check(Boolean(type), `유형 ${index + 1}이 없습니다: ${sourceItemId}`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호 ${index}가 아닙니다: ${type.variant}`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.generatorKey === "fractionAdditionE1", `${type.id}: 등록 생성기가 다릅니다: ${type.generatorKey}`);
  check(api.generatorKey(type) === "fractionAdditionE1", `${type.id}: 실제 생성기 연결이 다릅니다: ${api.generatorKey(type)}`);
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
  check(type.label && type.name, `${type.id}: 유형 이름이 비어 있습니다.`);
  check(type.difficultyBand === 1, `${type.id}: 심화 난이도 띠가 아닙니다: ${type.difficultyBand}`);
  check(kind && contract, `${type.id}: 감사 기준이 비어 있습니다.`);
});

const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
function parseEvidence(prompt, context) {
  const tag = prompt.match(/<span hidden data-fraction-addition-e1-kind="[^"]+"[^>]*><\/span>/)?.[0];
  if (!tag) throw new Error("독립 검산 태그가 없습니다.");
  const valuesText = attribute(tag, "data-values");
  const values = valuesText ? valuesText.split(",").map(Number) : [];
  if (!values.length || values.some(value => !Number.isInteger(value) || !Number.isFinite(value))) throw new Error("검산 값이 정수가 아닙니다.");
  return {
    kind: attribute(tag, "data-fraction-addition-e1-kind"),
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
  if (["proper-addition", "proper-two-term-practice", "proper-three-term-practice"].includes(kind)) {
    return { value: sum(fromPairList(values)), candidates: ["single"] };
  }
  if (["mixed-addition", "mixed-two-term-practice"].includes(kind)) {
    const terms = [];
    for (let index = 0; index < values.length; index += 3) terms.push(rational(values[index] * values[index + 2] + values[index + 1], values[index + 2]));
    return { value: sum(terms), candidates: ["single"] };
  }
  if (kind === "mixed-four-term-addition") return { value: sum(fromPairList(values)), candidates: ["single"] };
  if (kind === "regroup-same-denominators") {
    const [firstDenominator, secondDenominator, firstA, firstB, secondA, secondB, firstWhole, secondWhole] = values;
    const terms = [
      rational(firstA, firstDenominator), rational(firstWhole * secondDenominator + secondA, secondDenominator),
      rational(secondWhole * firstDenominator + firstB, firstDenominator), rational(secondB, secondDenominator)
    ];
    return { value: sum(terms), candidates: ["single"] };
  }
  if (["grouped-fraction-series", "grouped-series-with-ones"].includes(kind)) {
    const [lastDenominator, extraOnes] = values;
    const grouped = rational(lastDenominator * (lastDenominator - 1), 4);
    return { value: add(grouped, integer(extraOnes)), candidates: ["single"] };
  }
  if (kind === "digit-card-max-mixed-sum") {
    const candidates = permutations(values).filter(cards => cards[1] < cards[2] && cards[4] < cards[5]).map(cards => add(
      rational(cards[0] * cards[2] + cards[1], cards[2]),
      rational(cards[3] * cards[5] + cards[4], cards[5])
    ));
    if (!candidates.length) throw new Error("대분수 카드 배치 후보가 없습니다.");
    const optimum = candidates.reduce((best, candidate) => compare(candidate, best) > 0 ? candidate : best, candidates[0]);
    const winners = candidates.filter(candidate => compare(candidate, optimum) === 0);
    const optimumValues = new Set(winners.map(key));
    if (optimumValues.size !== 1) throw new Error(`최댓값 후보의 값이 ${optimumValues.size}개입니다.`);
    return { value: optimum, candidates, optimumCandidates: winners };
  }
  if (kind === "two-tap-target-time") {
    const [firstMinutes, secondMinutes, targetNumerator, targetDenominator] = values;
    const rate = add(rational(1, firstMinutes), rational(1, secondMinutes));
    const value = divide(rational(targetNumerator, targetDenominator), rate);
    if (!value || value.numerator <= 0) throw new Error("수도꼭지 시간의 답이 양수가 아닙니다.");
    return { value, candidates: ["single"] };
  }
  if (kind === "irreducible-pair-sum-count") {
    const [targetNumerator, targetDenominator, limit] = values;
    const candidates = [];
    for (let firstDenominator = 10; firstDenominator <= 99; firstDenominator += 1) {
      for (let secondDenominator = firstDenominator + 1; secondDenominator <= 99; secondDenominator += 1) {
        if (lcm(firstDenominator, secondDenominator) >= limit) continue;
        for (let firstNumerator = 1; firstNumerator < firstDenominator; firstNumerator += 1) {
          if (gcd(firstNumerator, firstDenominator) !== 1) continue;
          const needed = subtract(rational(targetNumerator, targetDenominator), rational(firstNumerator, firstDenominator));
          if (!needed || needed.numerator <= 0 || needed.numerator >= needed.denominator) continue;
          if (needed.denominator !== secondDenominator || gcd(needed.numerator, needed.denominator) !== 1) continue;
          candidates.push([firstNumerator, firstDenominator, needed.numerator, secondDenominator]);
        }
      }
    }
    if (!candidates.length) throw new Error("기약분수 덧셈식 후보가 0개입니다.");
    return { value: integer(candidates.length), candidates };
  }
  if (kind === "ten-part-inner-endpoint-sum") {
    const [leftNumerator, leftDenominator, rightNumerator, rightDenominator] = values;
    const left = rational(leftNumerator, leftDenominator);
    const right = rational(rightNumerator, rightDenominator);
    const step = divide(subtract(right, left), integer(10));
    const first = add(left, step);
    const last = subtract(right, step);
    return { value: add(first, last), candidates: ["single"] };
  }
  if (kind === "mixed-sum-natural-count") {
    const [firstWhole, firstNumerator, firstDenominator, secondNumerator, secondDenominator, upper, declaredCount, declaredWhole] = values;
    const fixed = add(rational(firstWhole * firstDenominator + firstNumerator, firstDenominator), rational(secondNumerator, secondDenominator));
    const candidates = [];
    for (let whole = 1; whole < upper; whole += 1) {
      const lower = add(fixed, integer(whole));
      let count = 0;
      for (let natural = 1; natural < upper; natural += 1) if (compare(integer(natural), lower) > 0) count += 1;
      if (count === declaredCount) candidates.push(whole);
    }
    if (!candidates.length) throw new Error("자연수 개수 조건을 만족하는 자연수 부분 후보가 0개입니다.");
    if (candidates.length !== 1) throw new Error(`자연수 개수 조건의 후보가 ${candidates.length}개입니다: ${candidates.join(", ")}`);
    return { value: integer(candidates[0]), candidates, declaredWhole };
  }
  if (kind === "four-prime-digit-min-sum") {
    const candidates = permutations(values).filter(digits => digits[0] < digits[1] && digits[2] < digits[3]).map(digits => add(
      rational(digits[0], digits[1]), rational(digits[2], digits[3])
    ));
    if (!candidates.length) throw new Error("네 소수 카드의 진분수 후보가 없습니다.");
    const optimum = candidates.reduce((best, candidate) => compare(candidate, best) < 0 ? candidate : best, candidates[0]);
    const winners = candidates.filter(candidate => compare(candidate, optimum) === 0);
    if (new Set(winners.map(key)).size !== 1) throw new Error("최솟값 후보의 값이 하나로 정해지지 않습니다.");
    return { value: optimum, candidates, optimumCandidates: winners };
  }
  if (kind === "missing-fraction-for-smallest-natural-sum") {
    const [numerator, firstDenominator, secondDenominator, thirdDenominator, missingNumerator, missingDenominator] = values;
    const fixed = sum([
      rational(numerator, firstDenominator), rational(numerator, secondDenominator), rational(numerator, thirdDenominator)
    ]);
    const nextNatural = Math.floor(fixed.numerator / fixed.denominator) + 1;
    const missing = subtract(integer(nextNatural), fixed);
    const candidates = [];
    for (let denominator = 1; denominator <= 1000; denominator += 1) {
      for (let candidateNumerator = 1; candidateNumerator < denominator; candidateNumerator += 1) {
        if (compare(rational(candidateNumerator, denominator), missing) === 0 && gcd(candidateNumerator, denominator) === 1) candidates.push([candidateNumerator, denominator]);
      }
    }
    if (candidates.length !== 1) throw new Error(`빈 분수의 기약 표현 후보가 ${candidates.length}개입니다.`);
    const answer = missingNumerator + missingDenominator;
    return { value: integer(answer), candidates, missing, declared: [missingNumerator, missingDenominator] };
  }
  throw new Error(`알 수 없는 검산 종류: ${kind}`);
}

function parseAnswer(answer) {
  const text = String(answer).replace(/<[^>]*>/g, " ").replace(/,/g, " ").trim();
  const mixed = text.match(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return rational(Number(mixed[1]) * Number(mixed[3]) + Number(mixed[2]), Number(mixed[3]));
  const fraction = text.match(/(-?\d+)\s*\/\s*(\d+)/);
  if (fraction) return rational(Number(fraction[1]), Number(fraction[2]));
  const number = text.match(/-?\d+/);
  return number ? integer(Number(number[0])) : null;
}

function solutionMentions(solution, value) {
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  if (!remainder) return new RegExp(`\\b${value.numerator}\\b`).test(String(solution).replace(/<[^>]*>/g, " "));
  const aria = remainder && whole
    ? `${whole}와 ${value.denominator}분의 ${remainder}`
    : `${value.denominator}분의 ${remainder}`;
  return String(solution).includes(aria);
}

const visibleText = html => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const noElementaryOutOfScope = /√|제곱근|순열|조합|방정식|미지수/;
const deterministicVariants = new Set([13]);
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
      const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        check(Boolean(generated?.prompt && generated.answer !== undefined && generated.solution), `${context}: 문제·정답·풀이가 비어 있습니다.`);
        if (!generated) continue;
        check(generated.generator === "fractionAdditionE1", `${context}: 실제 생성기 표시가 다릅니다: ${generated.generator}`);
        check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 깨진 값이 있습니다.`);
        const evidence = parseEvidence(generated.prompt, context);
        check(evidence.kind === expectedKind, `${context}: 검산 분기가 다릅니다: ${evidence.kind}`);
        check(evidence.sourceItemId === sourceItemId, `${context}: 숨은 출처 ID가 다릅니다: ${evidence.sourceItemId}`);
        check(evidence.contract === expectedContract, `${context}: 답 계약이 다릅니다: ${evidence.contract}`);
        const recomputed = independent(evidence);
        check(recomputed.candidates.length > 0, `${context}: 정답 후보가 0개입니다.`);
        const shown = parseAnswer(generated.answer);
        check(Boolean(shown) && compare(shown, recomputed.value) === 0, `${context}: 표시 답 ${generated.answer}와 독립 계산 ${key(recomputed.value)}가 다릅니다.`);
        check(solutionMentions(generated.solution, recomputed.value), `${context}: 풀이가 독립 계산 답을 가리키지 않습니다.`);

        const problemAndSolution = `${generated.prompt}\n${generated.solution}`;
        check(!/\d+\s*\/\s*\d+/.test(problemAndSolution), `${context}: 문제·풀이에 raw 숫자/숫자 분수가 남아 있습니다.`);
        check((generated.prompt.match(/class="math-fraction"/g) || []).length > 0 || evidence.kind === "digit-card-max-mixed-sum", `${context}: 구조화된 분수 표시가 없습니다.`);
        check(!noElementaryOutOfScope.test(visibleText(problemAndSolution)), `${context}: 초등 교육과정 밖 표현이 있습니다.`);
        if (evidence.kind === "digit-card-max-mixed-sum") check(generated.prompt.includes("한 번씩 모두 사용") && generated.prompt.includes("가장 클 때"), `${context}: 카드 최댓값 조건이 분명하지 않습니다.`);
        if (evidence.kind === "irreducible-pair-sum-count") check(generated.prompt.includes("더하는 순서만 다른 식은 하나로"), `${context}: 순서가 다른 식의 처리 조건이 없습니다.`);
        if (evidence.kind === "mixed-sum-natural-count") check(generated.prompt.includes("자연수가") && generated.prompt.includes("자연수 부분"), `${context}: 자연수 개수와 빈칸 조건이 분명하지 않습니다.`);
        if (evidence.kind === "four-prime-digit-min-sum") check(generated.prompt.includes("서로 다른 한 자리 수") && generated.prompt.includes("약수는 2개") && generated.prompt.includes("가장 작을 때"), `${context}: 네 수의 조건과 최솟값 조건이 분명하지 않습니다.`);
        if (evidence.kind === "missing-fraction-for-smallest-natural-sum") check(generated.prompt.includes("기약분수") && generated.prompt.includes("가장 작을 때"), `${context}: 빈 분수의 유일성 조건이 부족합니다.`);

        prompts.add(visibleText(generated.prompt));
        answers.add(String(generated.answer));
        checked += 1;
      } catch (error) {
        fail(`${context}: ${error.message}`);
      }
    }
    promptVariants.set(`${type.id}/${difficulty}`, prompts.size);
    answerVariants.set(`${type.id}/${difficulty}`, answers.size);
    if (!deterministicVariants.has(type.variant)) {
      check(prompts.size >= 2, `${type.id} / 난이도 ${difficulty}: 문제 변형이 ${prompts.size}개뿐입니다.`);
      check(answers.size >= 2, `${type.id} / 난이도 ${difficulty}: 답 변형이 ${answers.size}개뿐입니다.`);
    }
  }
}

if (failures.length) {
  console.error(`5-1 분수의 덧셈 개념탐구 1 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  console.error(`확인 생성 수: ${checked.toLocaleString()}회`);
  console.error(`문제 변형 수: ${JSON.stringify(Object.fromEntries(promptVariants))}`);
  console.error(`답 변형 수: ${JSON.stringify(Object.fromEntries(answerVariants))}`);
  process.exit(1);
}

console.log(`5-1 분수의 덧셈 개념탐구 1 독립 감사 통과: 원문 16유형 · 공개 16/잠금 0 · ${checked.toLocaleString()}회 독립 계산·전수 후보·수식·언어·다양성 검사`);
