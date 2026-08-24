import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { book08Markup } from "./book08-renderers.js";

const iterations = Number(process.env.BOOK08_ITERATIONS || 1000);
const book = CURRICULUM.find((item) => item.id === "book-08");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const expectedUnitCounts = [41, 42, 42, 39];
const expectedGuideFallback = "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";

function fail(id, difficulty, message) {
  throw new Error(`BOOK08_AUDIT_FAILED [${id}] [difficulty=${difficulty}]: ${message}`);
}

function assert(condition, id, difficulty, message) {
  if (!condition) fail(id, difficulty, message);
}

const sum = (items) => items.reduce((total, value) => total + value, 0);
const same = (first, second) => JSON.stringify(first) === JSON.stringify(second);
const numericAnswer = (problem) => Number(String(problem.answer).match(/-?\d+/)?.[0]);

function primitiveStrings(value, output = []) {
  if (Array.isArray(value)) value.forEach((item) => primitiveStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => primitiveStrings(item, output));
  else output.push(String(value));
  return output;
}

function hasWrongNumberParticle(text) {
  const checks = [
    /\d*[2459]을(?=\s)/, /\d*[013678]를(?=\s)/,
    /\d*[2459]이(?=\s+되)/, /\d*[013678]가(?=\s+되)/,
    /\d*[2459]은(?=\s)/, /\d*[013678]는(?=\s)/,
    /\d*[2459]과(?=\s)/, /\d*[013678]와(?=\s)/
  ];
  return checks.some((pattern) => pattern.test(text));
}

function cardEquationSolutions(cards, target) {
  const solutions = [];
  const largest = Math.max(...cards);
  const smallest = Math.min(...cards);
  for (const a of cards) for (const b of cards) for (const c of cards) for (const d of cards) {
    if (new Set([a, b, c, d]).size !== 4 || !cards.every((value) => [a, b, c, d].includes(value))) continue;
    if (a !== largest || b !== smallest || c === 0) continue;
    const first = 10 * a + b;
    const second = 10 * c + d;
    if (first > second && first + second === target) solutions.push([first, second]);
  }
  return solutions;
}

function orderedCandidates(total) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
    if (a > b && b > c && 10 * a + b + c === total) candidates.push([a, b, c]);
  }
  return candidates;
}

function multiSymbolCandidates(total) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
    if (new Set([a, b, c]).size < 3 || !(a > b && b > c)) continue;
    if ((10 * a + b) + (10 * b + c) === total) candidates.push([a, b, c]);
  }
  return candidates;
}

function subtractCandidates(total, gap) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 1; d <= 9; d += 1) {
    if (a === c + gap && 10 * a + b - c === 11 * d && 11 * d === total) candidates.push([a, b, c, d]);
  }
  return candidates;
}

function validate(problem, id, difficulty) {
  assert(problem && typeof problem === "object", id, difficulty, "문제 객체 없음");
  assert(typeof problem.prompt === "string" && problem.prompt.length >= 12, id, difficulty, "지문 없음");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "지문 물음표 중복");
  assert(typeof problem.answer === "string" && problem.answer.trim(), id, difficulty, "정답 없음");
  assert(typeof problem.solution === "string" && problem.solution.length >= 12, id, difficulty, "풀이 없음");
  assert(problem.visual?.kind === "book8", id, difficulty, "8권 시각 자료 아님");
  assert(book08Markup(problem.visual).length > 20, id, difficulty, `렌더링 없음: ${problem.visual?.subtype}`);
  assert(problem.meta?.family, id, difficulty, "검산 family 없음");
  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  assert(!hasWrongNumberParticle(`${problem.prompt} ${problem.solution}`), id, difficulty, "숫자 뒤 조사 오류");
  assert(!`${problem.prompt} ${problem.solution}`.includes("--"), id, difficulty, "이중 음수 표기");
  assert(!primitiveStrings(problem.visual).includes(String(numeric)), id, difficulty, "정답값이 시각 자료에 직접 노출됨");

  switch (meta.family) {
    case "balance-difference-b8":
      assert(meta.rightKnown - meta.leftKnown === meta.result && meta.common + meta.result === meta.common + numeric, id, difficulty, "저울 차 오류"); return;
    case "overlap-circle-b8":
      assert(sum(meta.left) + meta.overlap === sum(meta.visibleRight) + meta.result + meta.overlap && numeric === meta.result, id, difficulty, "겹친 원 합 오류"); return;
    case "symbol-additive-chain-b8":
      assert(meta.values.length === 3 && sum(meta.values) === meta.result && numeric === meta.result, id, difficulty, "도형 덧셈 연결 오류"); return;
    case "addition-matrix-target-b8":
    case "addition-matrix-complete-b8":
      assert(meta.rows[meta.targetRow] + meta.columns[meta.targetColumn] === meta.result && numeric === meta.result, id, difficulty, "덧셈 매트릭스 오류"); return;
    case "symbol-operation-b8":
      assert(meta.first !== meta.second && meta.first + meta.second === meta.pairTotal && meta.second === meta.result && numeric === meta.result, id, difficulty, "도형 연산 오류"); return;
    case "symbol-cross-b8":
      assert(same(meta.pairSums, [meta.values[0] + meta.values[1], meta.values[1] + meta.values[2], meta.values[0] + meta.values[2]]), id, difficulty, "교차식 합 오류");
      assert((meta.pairSums[0] + meta.pairSums[1] - meta.pairSums[2]) / 2 === meta.result && numeric === meta.result, id, difficulty, "교차식 답 오류"); return;
    case "conditional-symbol-chain-b8": {
      const [a, b, c] = meta.values;
      assert(new Set(meta.values).size === 3 && (a + b + b + c - (a + c)) / 2 === meta.result && numeric === meta.result, id, difficulty, "조건 도형 연결 오류"); return;
    }
    case "conditional-two-digit-b8":
      assert(meta.ones - meta.tens === meta.gap && meta.tens * 10 + meta.ones === meta.result && numeric === meta.result, id, difficulty, "두 자리 도형 조건 오류"); return;
    case "cyclic-pair-sums-b8":
      assert(sum(meta.pairSums) / 2 === meta.result && sum(meta.values) === meta.result && numeric === meta.result, id, difficulty, "두 개씩 합 오류"); return;
    case "pyramid-cryptarithm-b8":
      assert(meta.digit * 11 === meta.repeated && meta.repeated + meta.addend === meta.total && numeric === meta.digit, id, difficulty, "피라미드 복면산 오류"); return;
    case "blank-digit-addition-b8":
      assert(meta.missing + meta.known === meta.total && sum(meta.digits) === meta.result && numeric === meta.result, id, difficulty, "빈 숫자 세로셈 오류"); return;
    case "all-digits-once-b8": {
      const solutions = cardEquationSolutions(meta.cards, meta.target);
      const expected = `${solutions[0][0]}+${solutions[0][1]}=${meta.target}`;
      assert(solutions.length === 1 && same(solutions, meta.solutions) && problem.answer === expected, id, difficulty, "수 카드 식 유일성 오류"); return;
    }
    case "ordered-symbol-b8": {
      const candidates = orderedCandidates(meta.total);
      assert(candidates.length === 1 && same(candidates, meta.candidates) && same(candidates[0], meta.values), id, difficulty, "크기 순서 복면산 유일성 오류");
      assert(sum(meta.values) === meta.result && numeric === meta.result, id, difficulty, "크기 순서 복면산 답 오류"); return;
    }
    case "repeated-symbol-b8":
      assert(meta.digit * 12 === meta.total && numeric === meta.digit, id, difficulty, "반복 도형 복면산 오류"); return;
    case "multi-symbol-b8": {
      const candidates = multiSymbolCandidates(meta.total);
      assert(candidates.length === 1 && same(candidates, meta.candidates) && same(candidates[0], meta.values), id, difficulty, "여러 도형 복면산 유일성 오류");
      assert(sum(meta.values) === meta.result && numeric === meta.result, id, difficulty, "여러 도형 복면산 답 오류"); return;
    }
    case "doubled-symbol-b8":
      assert(meta.digit * 22 === meta.total && numeric === meta.digit, id, difficulty, "두 배 도형 오류"); return;
    case "letter-pyramid-b8":
      assert(meta.value * 2 === meta.total && sum(meta.digits) === meta.result && numeric === meta.result, id, difficulty, "문자 피라미드 오류"); return;
    case "repeated-number-list-b8": {
      const valid = [];
      for (let digit = 1; digit <= 9 - meta.fixed; digit += 1) {
        const resultDigit = digit + meta.fixed;
        if (digit !== meta.fixed && resultDigit !== meta.fixed && resultDigit !== digit) valid.push(digit);
      }
      assert(same(valid, meta.valid) && problem.answer === valid.join(", "), id, difficulty, "복수 가능값 목록 오류"); return;
    }
    case "linked-cryptarithm-b8":
      assert(meta.digit * 12 === meta.firstTotal && meta.firstTotal + meta.known === meta.finalTotal && numeric === meta.digit, id, difficulty, "연결 복면산 오류"); return;
    case "subtract-repeated-b8": {
      const candidates = subtractCandidates(meta.total, meta.gap);
      assert(candidates.length === 1 && same(candidates, meta.candidates) && candidates[0][3] === meta.result && numeric === meta.result, id, difficulty, "반복수 뺄셈 유일성 오류"); return;
    }
    case "equalize-transfer-b8":
      assert((meta.larger - meta.smaller) / 2 === meta.result && numeric === meta.result, id, difficulty, "같게 옮기기 오류"); return;
    case "chained-equalize-b8": {
      const final = [meta.initial[0] - meta.firstTransfer, meta.initial[1] + meta.firstTransfer - meta.secondTransfer, meta.initial[2] + meta.secondTransfer];
      assert(final.every((value) => value === meta.final) && meta.initial[1] === meta.result && numeric === meta.result, id, difficulty, "이어 옮기기 오류"); return;
    }
    case "total-difference-bars-b8":
      assert(meta.larger + meta.smaller === meta.total && meta.larger - meta.smaller === meta.difference, id, difficulty, "합차 막대 조건 오류");
      assert(meta.result === (meta.askLarger ? meta.larger : meta.smaller) && numeric === meta.result, id, difficulty, "합차 막대 답 오류"); return;
    case "future-age-sum-b8":
      assert(meta.older - meta.younger === meta.difference && meta.younger + meta.older + meta.years * 2 === meta.futureTotal && numeric === meta.younger, id, difficulty, "몇 년 뒤 나이 오류"); return;
    case "table-total-difference-b8":
      assert(meta.first + meta.second + meta.other === meta.total && meta.second - meta.first === meta.difference && numeric === meta.second, id, difficulty, "표 합차 오류"); return;
    case "reverse-transfer-three-b8": {
      const rebuilt = [meta.initial[0] - meta.fromA, meta.initial[1] + meta.fromA + meta.fromC, meta.initial[2] - meta.fromC];
      assert(same(rebuilt, meta.final) && meta.initial[1] === meta.result && numeric === meta.result, id, difficulty, "세 사람 주고받기 오류"); return;
    }
    case "sum-multiple-bars-b8":
      assert(meta.larger === meta.smaller * meta.multiplier && meta.total === meta.larger + meta.smaller && meta.result === (meta.askLarger ? meta.larger : meta.smaller) && numeric === meta.result, id, difficulty, "합과 배수 오류"); return;
    case "difference-multiple-bars-b8":
      assert(meta.larger === meta.smaller * meta.multiplier && meta.difference === meta.larger - meta.smaller && meta.result === (meta.askLarger ? meta.larger : meta.smaller) && numeric === meta.result, id, difficulty, "차와 배수 오류"); return;
    case "sum-multiple-offset-b8":
      assert(meta.larger === meta.smaller * meta.multiplier + meta.sign * meta.offset && meta.total === meta.larger + meta.smaller && numeric === meta.smaller, id, difficulty, "배수보다 많고 적음 오류"); return;
    case "three-person-difference-b8":
      assert(meta.first === meta.middle + meta.above && meta.third === meta.middle - meta.below && meta.first + meta.third === meta.pairTotal && numeric === meta.middle, id, difficulty, "세 사람 차 오류"); return;
    case "transfer-to-multiple-b8":
      assert(meta.initialLarge - meta.moved === meta.afterLarge && meta.initialSmall + meta.moved === meta.afterSmall && meta.afterLarge === meta.afterSmall * meta.multiplier && meta.initialLarge + meta.initialSmall === meta.total && numeric === meta.initialLarge, id, difficulty, "옮긴 뒤 배수 오류"); return;
    case "conditional-three-share-b8": {
      const final = [meta.initial[0] - meta.firstMove, meta.initial[1] + meta.firstMove - meta.secondMove, meta.initial[2] + meta.secondMove];
      assert(final.every((value) => value === meta.final) && numeric === meta.initial[0], id, difficulty, "세 사람 조건 나누기 오류"); return;
    }
    case "reverse-double-offset-b8":
      assert(meta.final === meta.result + meta.added && meta.final === meta.result * 2 - meta.offset && numeric === meta.result, id, difficulty, "두 배 관계 거꾸로 오류"); return;
    case "reverse-arithmetic-chain-b8":
      assert(meta.start + meta.add - meta.subtract === meta.final && numeric === meta.start, id, difficulty, "덧뺄셈 거꾸로 오류"); return;
    case "reverse-transfer-events-b8":
      assert(meta.start - meta.gave + meta.received === meta.final && numeric === meta.start, id, difficulty, "주고받기 거꾸로 오류"); return;
    case "reverse-multiply-divide-b8":
      assert((meta.start * meta.multiplier + meta.added) / meta.divisor === meta.final && numeric === meta.start, id, difficulty, "곱셈 나눗셈 거꾸로 오류"); return;
    case "reverse-split-equal-b8":
      assert(meta.start / meta.parts === meta.share && meta.share - meta.given === meta.afterGive && numeric === meta.start, id, difficulty, "똑같이 나눈 수 거꾸로 오류"); return;
    case "give-as-much-once-b8":
      assert(same(meta.after, [meta.first - meta.second, meta.second * 2]) && numeric === meta.first, id, difficulty, "가진 만큼 주기 오류"); return;
    case "give-as-much-return-b8":
      assert(same(meta.afterFirst, [meta.first - meta.second, meta.second * 2]), id, difficulty, "가진 만큼 준 뒤 오류");
      assert(same(meta.final, [meta.afterFirst[0] + meta.returned, meta.afterFirst[1] - meta.returned]) && numeric === meta.first, id, difficulty, "돌려받기 오류"); return;
    case "shaded-fraction-count-b8":
      assert(problem.prompt.includes(`${meta.numerator}/${meta.denominator}`), id, difficulty, "그림과 분수 표기 불일치");
      assert(meta.whole === meta.denominator * meta.unit && meta.result === meta.numerator * meta.unit && numeric === meta.result, id, difficulty, "색칠한 분수 개수 오류"); return;
    case "fraction-given-away-b8":
      assert(problem.prompt.includes(`${meta.numerator}/${meta.denominator}`), id, difficulty, "준 분수 표기 불일치");
      assert(meta.original === meta.denominator * meta.unit && meta.given === meta.numerator * meta.unit && meta.remaining === meta.original - meta.given && numeric === meta.original, id, difficulty, "분수만큼 준 처음 수 오류"); return;
    case "sequential-fraction-remains-b8":
      assert(meta.afterFirst === meta.original * (meta.firstDenominator - meta.firstNumerator) / meta.firstDenominator, id, difficulty, "첫 분수 사용 오류");
      assert(meta.final === meta.afterFirst * (meta.secondDenominator - meta.secondNumerator) / meta.secondDenominator && numeric === meta.original, id, difficulty, "두 번째 분수 사용 오류"); return;
    case "fraction-difference-whole-b8":
      assert(problem.prompt.includes(`${meta.high}/${meta.denominator}`) && problem.prompt.includes(`${meta.low}/${meta.denominator}`), id, difficulty, "분수 차 표기 불일치");
      assert(meta.difference === (meta.high - meta.low) * meta.unit && meta.whole === meta.denominator * meta.unit && numeric === meta.whole, id, difficulty, "분수 차 전체 오류"); return;
    case "fraction-share-difference-b8":
      assert(problem.prompt.includes(`${meta.firstNumerator}/${meta.denominator}`) && problem.prompt.includes(`${meta.secondNumerator}/${meta.denominator}`), id, difficulty, "두 모둠 분수 표기 불일치");
      assert(meta.first === meta.firstNumerator * meta.unit && meta.second === meta.secondNumerator * meta.unit && meta.difference === Math.abs(meta.first - meta.second) && meta.result === meta.first + meta.second && numeric === meta.result, id, difficulty, "두 모둠 분수 차 오류"); return;
    case "reverse-two-containers-b8": {
      const afterFirst = [meta.initial[0] - meta.firstMove, meta.initial[1] + meta.firstMove];
      const final = [afterFirst[0] + meta.secondMove, afterFirst[1] - meta.secondMove];
      assert(same(afterFirst, meta.afterFirst) && same(final, meta.final) && numeric === meta.initial[0], id, difficulty, "두 상자 이동 오류"); return;
    }
    case "three-container-condition-b8":
      assert(same(meta.values, [meta.middle + meta.firstGap, meta.middle, meta.middle - meta.thirdGap]) && sum(meta.values) === meta.total && numeric === meta.middle, id, difficulty, "세 주머니 조건 오류"); return;
    case "sequential-fraction-consumption-b8":
      assert(meta.afterFirst === meta.original * (meta.firstDenominator - 1) / meta.firstDenominator, id, difficulty, "첫 분수 소비 오류");
      assert(meta.final === meta.afterFirst * (meta.secondDenominator - 1) / meta.secondDenominator && numeric === meta.original, id, difficulty, "두 번째 분수 소비 오류"); return;
    case "fraction-subgroup-count-b8":
      assert(meta.firstTotal === meta.firstDenominator * meta.firstUnit && meta.secondTotal === meta.secondDenominator * meta.secondUnit, id, difficulty, "모둠 전체 오류");
      assert(meta.firstCount === meta.firstNumerator * meta.firstUnit && meta.secondCount === meta.secondNumerator * meta.secondUnit && meta.result === meta.firstCount + meta.secondCount && numeric === meta.result, id, difficulty, "모둠 일부 합 오류"); return;
    default:
      fail(id, difficulty, `검산 분기 없음: ${meta.family}`);
  }
}

function numbersInReference(reference) {
  if (Array.isArray(reference.numbers)) return reference.numbers;
  return Array.from({ length: reference.to - reference.from + 1 }, (_, index) => reference.from + index);
}

function referenceKeys(stage, references) {
  return references.flatMap((reference) => numbersInReference(reference).map((number) => `${stage}:${reference.section}:${reference.group}:${number}`));
}

if (!book) throw new Error("book-08 missing");
if (units.length !== 4) throw new Error(`book-08 unit count ${units.length}`);
if (typeIds.length !== 51) throw new Error(`book-08 type count ${typeIds.length}`);

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const expected = TEXTBOOK_STAGES.flatMap((stage) => referenceKeys(stage.id, unit.studyRefs[stage.id] || []));
  const actual = [];
  unit.typeIds.forEach((typeId) => {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!GENERATORS[type.generator]) throw new Error(`missing generator ${type.generator}`);
    if (textbookGuideForType(typeId) === expectedGuideFallback) throw new Error(`generic guide ${typeId}`);
    const refs = unit.typeStudyRefs?.[typeId];
    if (!refs) throw new Error(`missing study refs ${typeId}`);
    TEXTBOOK_STAGES.forEach((stage) => actual.push(...referenceKeys(stage.id, refs[stage.id] || [])));
  });
  const duplicate = actual.find((key, index) => actual.indexOf(key) !== index);
  if (duplicate) throw new Error(`${unit.label} duplicate source question ${duplicate}`);
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.find((key) => !actualSet.has(key));
  const extra = actual.find((key) => !expectedSet.has(key));
  if (missing || extra || actual.length !== expected.length) throw new Error(`${unit.label} coverage mismatch missing=${missing || "-"} extra=${extra || "-"} ${actual.length}/${expected.length}`);
  if (actual.length !== expectedUnitCounts[unitIndex]) throw new Error(`${unit.label} source count ${actual.length}`);
  sourceQuestionCount += actual.length;
});
if (sourceQuestionCount !== 164) throw new Error(`book-08 source count ${sourceQuestionCount}`);

let generated = 0;
for (const typeId of typeIds) {
  const type = typeById(typeId);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1, 2, 3]) {
    for (let index = 0; index < iterations; index += 1) {
      const problem = generator({ difficulty });
      // 5권에서 이미 검산된 공용 곱셈 매트릭스 두 유형은 해당 권 감사에서 확인한다.
      if (problem.visual?.kind === "book8") validate(problem, typeId, difficulty);
      generated += 1;
    }
  }
}

console.log(`book-08 audit passed: ${sourceQuestionCount} source questions, ${typeIds.length} types, ${generated.toLocaleString("en-US")} generated checks`);
