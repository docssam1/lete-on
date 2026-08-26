import { GENERATORS } from "./generators.js";
import { book06Markup } from "./book06-renderers.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const book = CURRICULUM.find((item) => item.id === "book-06");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const unitTestQuestions = book?.source?.unitTestQuestions || [];
const expectedUnitTestTypes = [
  "midpoint-pair-unit-test-book6", "split-target-distance-unit-test-book6", "rod-difference-ratio-unit-test-book6",
  "equal-bar-pieces-unit-test-book6", "two-object-weight-unit-test-book6", "symbol-card-chain-unit-test-book6",
  "rectangle-rhombus-side-unit-test-book6", "rectangle-triangle-square-unit-test-book6", "three-square-shaded-perimeter-unit-test-book6",
  "scattered-side-perimeter-unit-test-book6", "square-triangle-strip-unit-test-book6", "square-tiling-shaded-unit-test-book6",
  "round-pair-eight-addends-unit-test-book6", "even-odd-position-pair-unit-test-book6", "facing-page-sum-unit-test-book6",
  "range-number-digit-pair-unit-test-book6", "consecutive-even-sum-pair-unit-test-book6", "consecutive-odd-sum-pair-unit-test-book6",
  "sign-insertion-triple-unit-test-book6", "consecutive-sign-insertion", "plus-concatenation-pair-unit-test-book6",
  "balance-chain-equivalence-unit-test-book6", "fold-cut-open-perimeter-unit-test-book6", "last-number-from-digit-total",
  "rod-difference-ratio-unit-test-book6"
];
const auditedTypeIds = [...new Set([...typeIds, ...unitTestQuestions.map((question) => question.typeId)])];
const expectedUnitCounts = [40, 44, 41, 34];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const product = (items) => items.reduce((total, value) => total * value, 1);
const numericAnswer = (problem) => Number(String(problem.answer).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0]);
const fail = (id, difficulty, message) => { throw new Error(`${id} / L${difficulty}: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };

function cellPerimeter(cells) {
  const occupied = new Set(cells.map(([x, y]) => `${x}:${y}`));
  let edges = 0;
  cells.forEach(([x, y]) => {
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      if (!occupied.has(`${x + dx}:${y + dy}`)) edges += 1;
    });
  });
  return edges;
}

function orthogonalPerimeter(vertices) {
  return vertices.reduce((total, [x, y], index) => {
    const [nextX, nextY] = vertices[(index + 1) % vertices.length];
    return total + Math.abs(nextX - x) + Math.abs(nextY - y);
  }, 0);
}

function countWrittenDigits(start, end) {
  let total = 0;
  for (let number = start; number <= end; number += 1) total += String(number).length;
  return total;
}

function countDigitOccurrences(start, end, digit) {
  let total = 0;
  for (let number = start; number <= end; number += 1) total += [...String(number)].filter((value) => value === String(digit)).length;
  return total;
}

function operatorPatterns(length, operators) {
  let patterns = [[]];
  for (let index = 0; index < length - 1; index += 1) patterns = patterns.flatMap((pattern) => operators.map((operator) => [...pattern, operator]));
  return patterns;
}

function evaluateJoinedExpression(digits, operators) {
  let total = 0;
  let current = String(digits[0]);
  let sign = 1;
  for (let index = 0; index < operators.length; index += 1) {
    const operator = operators[index];
    if (operator === "") current += String(digits[index + 1]);
    else {
      total += sign * Number(current);
      sign = operator === "+" ? 1 : -1;
      current = String(digits[index + 1]);
    }
  }
  return total + sign * Number(current);
}

function sameArray(first, second) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function validateSurface(problem, id, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  assert(problem.prompt?.trim(), id, difficulty, "지문 없음");
  assert(String(problem.answer ?? "").trim(), id, difficulty, "정답 없음");
  assert(problem.solution?.trim(), id, difficulty, "풀이 없음");
  assert(problem.meta?.family, id, difficulty, "검산 유형 없음");
  assert(problem.visual?.kind === "book6", id, difficulty, "6권 전용 그림 아님");
  assert(book06Markup(problem.visual), id, difficulty, "빈 그림");
  assert(!/undefined|NaN|null|\[object Object\]/.test(text), id, difficulty, "잘못된 출력 토큰");
  assert(!/퍼뮤테이션|컴비네이션|팩토리얼|제곱|\^/.test(text), id, difficulty, "아동 지문 금지 표현");
  assert(!/(몇 cm인가요\?){2}|([가-힣]+\?){2}/.test(problem.prompt), id, difficulty, "지문 중복 의심");
}

function validate(problem, id, difficulty) {
  validateSurface(problem, id, difficulty);
  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  switch (meta.family) {
    case "number-line-midpoint":
      assert((meta.left + meta.right) / 2 === meta.answer && numeric === meta.answer, id, difficulty, "중간 수 오류"); return;
    case "number-line-unit":
      assert((meta.end - meta.start) / meta.intervals === meta.answer && numeric === meta.answer, id, difficulty, "한 칸 거리 오류"); return;
    case "number-line-two-part":
      assert(meta.leftIntervals * meta.leftUnit + meta.rightIntervals * meta.rightUnit === meta.answer && numeric === meta.answer, id, difficulty, "두 구간 거리 오류"); return;
    case "rod-difference":
      assert(meta.long - meta.short === meta.difference && meta.target / meta.difference === meta.answer && numeric === meta.answer, id, difficulty, "막대 차이 오류"); return;
    case "equivalent-fraction":
      assert(meta.numerator * meta.factor === (meta.hideNumerator ? meta.answer : problem.visual.right[0]), id, difficulty, "분자 배수 오류");
      assert(meta.denominator * meta.factor === (meta.hideNumerator ? problem.visual.right[1] : meta.answer), id, difficulty, "분모 배수 오류"); return;
    case "equivalent-ratio":
      assert(meta.first * meta.factor === (meta.hideFirst ? meta.answer : problem.visual.right[0]), id, difficulty, "비 앞수 오류");
      assert(meta.second * meta.factor === (meta.hideFirst ? problem.visual.right[1] : meta.answer), id, difficulty, "비 뒷수 오류"); return;
    case "bar-ratio-read": {
      const common = (() => { let a = meta.first; let b = meta.second; while (b) [a, b] = [b, a % b]; return a; })();
      assert(common === meta.common && sameArray([meta.first / common, meta.second / common], meta.answer), id, difficulty, "막대 비 오류"); return;
    }
    case "bar-ratio-total":
      assert(meta.total === (meta.firstRatio + meta.secondRatio) * meta.unit, id, difficulty, "막대 합 오류");
      assert(meta.answer === (meta.askFirst ? meta.firstRatio : meta.secondRatio) * meta.unit && numeric === meta.answer, id, difficulty, "막대 길이 오류"); return;
    case "balance-ratio":
      assert(meta.leftCount * meta.answer[0] === meta.rightCount * meta.answer[1], id, difficulty, "저울 비 오류"); return;
    case "balance-weight":
      assert(meta.total === (meta.firstRatio + meta.secondRatio) * meta.unit, id, difficulty, "저울 전체 무게 오류");
      assert(meta.answer === (meta.askFirst ? meta.firstRatio : meta.secondRatio) * meta.unit && numeric === meta.answer, id, difficulty, "저울 한 개 무게 오류"); return;
    case "symbol-sum-deduction": {
      const [a, b, c] = meta.values;
      const [ab, bc, ac] = meta.equations.map((equation) => equation[2]);
      assert(a + b === ab && b + c === bc && a + c === ac, id, difficulty, "도형 합 식 오류");
      const solved = [(ab + ac - bc) / 2, (ab + bc - ac) / 2, (ac + bc - ab) / 2];
      assert(sameArray(solved, meta.values) && meta.answer === solved[meta.targetIndex] && numeric === meta.answer, id, difficulty, "도형 값 유일성 오류"); return;
    }
    case "stride-ratio":
      assert(meta.firstSteps * meta.firstStrideRatio === meta.secondSteps * meta.secondStrideRatio, id, difficulty, "보폭 거리 오류");
      assert(meta.strideSum === (meta.firstStrideRatio + meta.secondStrideRatio) * meta.unit, id, difficulty, "보폭 합 오류");
      assert(meta.answer === (meta.askFirst ? meta.firstStrideRatio : meta.secondStrideRatio) * meta.unit && numeric === meta.answer, id, difficulty, "보폭 정답 오류"); return;
    case "repeated-unit-total":
      assert(meta.firstLength * meta.firstCount + meta.secondLength * meta.secondCount === meta.answer && numeric === meta.answer, id, difficulty, "이어 붙인 길이 오류"); return;
    case "quadrilateral-perimeter":
      assert(meta.perimeter === 2 * (meta.width + meta.height), id, difficulty, "직사각형 둘레 오류");
      assert(meta.answer === (meta.mode === "inverse" ? meta.height : meta.perimeter) && numeric === meta.answer, id, difficulty, "직사각형 정답 오류"); return;
    case "equal-quadrilateral":
      assert(meta.perimeter === meta.side * 4 && meta.answer === (meta.inverse ? meta.side : meta.perimeter) && numeric === meta.answer, id, difficulty, "같은 변 사각형 오류"); return;
    case "joined-dimensions":
      assert(meta.totalWidth === meta.leftWidth + meta.rightWidth && meta.perimeter === 2 * (meta.totalWidth + meta.height), id, difficulty, "붙인 직사각형 크기 오류");
      assert(meta.answer === meta.rightWidth && numeric === meta.answer, id, difficulty, "붙인 직사각형 정답 오류"); return;
    case "joined-shared-side":
      assert(meta.unionPerimeter === meta.firstPerimeter + meta.secondPerimeter - 2 * meta.shared && numeric === meta.shared, id, difficulty, "공통 변 오류"); return;
    case "joined-regular":
      assert(meta.outsideEdges === meta.firstSides + meta.secondSides - 2 && meta.perimeter === meta.outsideEdges * meta.side && numeric === meta.side, id, difficulty, "붙인 정다각형 한 변 오류"); return;
    case "diagonal-triangle":
      assert(meta.width + meta.height + meta.diagonal === meta.answer && numeric === meta.answer, id, difficulty, "대각선 삼각형 오류"); return;
    case "square-composition-side":
      assert(meta.small * meta.count === meta.answer && numeric === meta.answer, id, difficulty, "정사각형 이어 붙이기 오류"); return;
    case "cell-perimeter":
      assert(cellPerimeter(meta.cells) === meta.edgeCount && meta.edgeCount * meta.side === meta.answer && numeric === meta.answer, id, difficulty, "모눈 둘레 오류"); return;
    case "fold-rectangle":
      assert(meta.originalWidth === (meta.foldWidth ? meta.foldedWidth * 2 : meta.foldedWidth), id, difficulty, "접기 가로 오류");
      assert(meta.originalHeight === (meta.foldWidth ? meta.foldedHeight : meta.foldedHeight * 2), id, difficulty, "접기 세로 오류");
      assert(2 * (meta.originalWidth + meta.originalHeight) === meta.answer && numeric === meta.answer, id, difficulty, "처음 둘레 오류"); return;
    case "rectilinear-route":
      assert(meta.width + meta.height === meta.answer && numeric === meta.answer, id, difficulty, "직각 경로 오류"); return;
    case "orthogonal-perimeter":
      assert(orthogonalPerimeter(meta.vertices) === meta.answer && numeric === meta.answer, id, difficulty, "오목 도형 좌표 둘레 오류"); return;
    case "attached-regular":
      assert(meta.outsideEdges === sum(meta.sides) - meta.sharedEdges * 2 && meta.outsideEdges * meta.side === meta.answer && numeric === meta.answer, id, difficulty, "여러 정다각형 둘레 오류"); return;
    case "unit-edge-inverse":
      assert(cellPerimeter(meta.cells) === meta.edgeCount && meta.perimeter / meta.edgeCount === meta.side && numeric === meta.side, id, difficulty, "한 변 역산 오류"); return;
    case "cutout-change":
      assert(cellPerimeter(meta.before) * meta.side === meta.beforePerimeter, id, difficulty, "자르기 전 둘레 오류");
      assert(cellPerimeter(meta.after) * meta.side === meta.afterPerimeter, id, difficulty, "자른 뒤 둘레 오류");
      assert(meta.afterPerimeter - meta.beforePerimeter === meta.answer && numeric === meta.answer, id, difficulty, "둘레 변화 오류"); return;
    case "square-partition":
      assert(meta.parts * meta.small === meta.total && numeric === meta.total, id, difficulty, "정사각형 분할 오류"); return;
    case "nested-square":
      assert(4 * (meta.outer + meta.inner) === meta.answer && numeric === meta.answer, id, difficulty, "겹친 정사각형 둘레 오류"); return;
    case "multiplication":
      assert(meta.first * meta.second === meta.answer && numeric === meta.answer, id, difficulty, "곱셈 오류");
      if (meta.mode === "area") assert(sum(meta.partials) === meta.answer, id, difficulty, "넓이 모형 부분곱 오류"); return;
    case "round-pair-addition":
      assert(meta.pairs.every((pair) => sum(pair) === meta.base), id, difficulty, "둥근 수 짝 오류");
      assert(meta.base * meta.pairCount === meta.answer && numeric === meta.answer, id, difficulty, "둥근 수 합 오류"); return;
    case "round-pair-missing":
      assert(meta.base - meta.shown === meta.answer && numeric === meta.answer, id, difficulty, "빠진 더하는 수 오류"); return;
    case "common-factor-sum":
      assert(meta.factor * sum(meta.multipliers) === meta.answer && numeric === meta.answer, id, difficulty, "공통 묶음 합 오류"); return;
    case "near-round-multiplication":
      assert(meta.value * meta.multiplier === meta.answer && meta.multiplier === meta.base - 1 && numeric === meta.answer, id, difficulty, "가까운 수 곱 오류"); return;
    case "near-round-addition":
      assert(meta.base * meta.count - sum(meta.gaps) === meta.answer && numeric === meta.answer, id, difficulty, "가까운 수 합 오류"); return;
    case "inclusive-range":
      assert(meta.end - meta.start + 1 === meta.answer && numeric === meta.answer, id, difficulty, "포함한 수 개수 오류"); return;
    case "consecutive-sum": {
      const rebuilt = Array.from({ length: meta.count }, (_, index) => meta.start + index);
      assert(sameArray(rebuilt, meta.values) && sum(rebuilt) === meta.answer && numeric === meta.answer, id, difficulty, "연속수 합 오류"); return;
    }
    case "nth-even-odd":
      assert((meta.odd ? meta.position * 2 - 1 : meta.position * 2) === meta.answer && numeric === meta.answer, id, difficulty, "몇 번째 짝홀수 오류"); return;
    case "even-odd-position":
      assert((meta.odd ? meta.position * 2 - 1 : meta.position * 2) === meta.value && numeric === meta.position, id, difficulty, "짝홀수 위치 오류"); return;
    case "facing-pages":
      assert(meta.left % 2 === 0 && meta.right === meta.left + 1 && meta.answer === (meta.showLeft ? meta.right : meta.left) && numeric === meta.answer, id, difficulty, "펼친 책 쪽수 오류"); return;
    case "alternating-pair":
      assert(meta.values.reduce((total, value, index) => total + (index % 2 ? -value : value), 0) === meta.answer && numeric === meta.answer, id, difficulty, "교대 합 오류"); return;
    case "common-factor-missing":
      assert(meta.totalMultiplier - meta.first === meta.answer && numeric === meta.answer, id, difficulty, "공통 묶음 빈칸 오류"); return;
    case "consecutive-from-sum":
      assert(meta.values.every((value, index) => value === meta.start + index) && sum(meta.values) === meta.total && sameArray(meta.values, meta.answer), id, difficulty, "연속수 역산 오류"); return;
    case "newspaper-pair":
      assert(meta.shown + meta.answer === meta.totalPages + 1 && numeric === meta.answer, id, difficulty, "신문 쪽수 오류"); return;
    case "range-digit-count":
      assert(meta.numberCount === meta.end - meta.start + 1 && countWrittenDigits(meta.start, meta.end) === meta.answer && numeric === meta.answer, id, difficulty, "범위 숫자 개수 오류"); return;
    case "total-written-digits":
      assert(countWrittenDigits(1, meta.end) === meta.answer && numeric === meta.answer, id, difficulty, "전체 숫자 개수 오류"); return;
    case "digit-occurrence":
      assert(countDigitOccurrences(meta.start, meta.end, meta.digit) === meta.answer && numeric === meta.answer, id, difficulty, "특정 숫자 횟수 오류"); return;
    case "digit-exclusion": {
      const valid = [];
      for (let number = meta.start; number <= meta.end; number += 1) if (!String(number).includes(String(meta.digit))) valid.push(number);
      assert(sameArray(valid, meta.valid) && valid.length === meta.answer && numeric === meta.answer, id, difficulty, "특정 숫자 제외 오류"); return;
    }
    case "sign-insertion":
    case "concat-target": {
      const matches = operatorPatterns(meta.values?.length || meta.digits.length, meta.operators).filter((pattern) => evaluateJoinedExpression(meta.values || meta.digits, pattern) === meta.target);
      assert(matches.length === 1, id, difficulty, `기호 답 ${matches.length}개`);
      assert(sameArray(matches[0], meta.pattern) && sameArray(meta.pattern, meta.answer), id, difficulty, "기호 순서 오류"); return;
    }
    case "concat-evaluate":
      assert(evaluateJoinedExpression(meta.digits, meta.operators) === meta.answer && numeric === meta.answer, id, difficulty, "이어 붙인 식 계산 오류"); return;
    case "remove-plus": {
      const targets = meta.digits.slice(0, -1).map((digit, index) => meta.baseSum + digit * 9);
      assert(targets.filter((value) => value === meta.target).length === 1, id, difficulty, "지울 더하기가 여러 개");
      assert(targets[meta.removedIndex] === meta.target && numeric === meta.answer, id, difficulty, "지울 더하기 위치 오류"); return;
    }
    case "last-number-digits":
      assert(countWrittenDigits(1, meta.end) === meta.total && numeric === meta.end, id, difficulty, "마지막 수 오류"); return;
    case "repeated-digit-concat":
      assert(meta.values.every((value, index) => value === Number(String(meta.digit).repeat(index + 1))), id, difficulty, "같은 숫자 이어 붙이기 오류");
      assert(sum(meta.values) === meta.answer && numeric === meta.answer, id, difficulty, "이어 붙인 수 합 오류"); return;
    case "unit-midpoint-pair":
      assert(meta.parts.length === 2 && meta.parts.every((part) => (part.left + part.right) / 2 === part.middle), id, difficulty, "두 중점 오류"); return;
    case "unit-split-targets":
      assert(meta.middle === meta.start + meta.leftIntervals * meta.leftUnit, id, difficulty, "왼쪽 분할 오류");
      assert(meta.end === meta.middle + meta.rightIntervals * meta.rightUnit, id, difficulty, "오른쪽 분할 오류");
      assert(meta.first === meta.start + meta.leftTarget * meta.leftUnit && meta.second === meta.middle + meta.rightTarget * meta.rightUnit, id, difficulty, "표시한 점 오류");
      assert(Math.abs(meta.second - meta.first) === meta.answer && numeric === meta.answer, id, difficulty, "두 점 거리 오류"); return;
    case "unit-rod-ratio":
      assert(Number.isInteger(meta.answer) && meta.answer * (meta.shortCount - meta.longCount) === meta.longCount * meta.shortCount && numeric === meta.answer, id, difficulty, "끈 차이 횟수 오류"); return;
    case "unit-equal-bars":
      assert(meta.firstCount * meta.first === meta.secondCount * meta.second, id, difficulty, "같은 막대 길이 오류");
      assert(meta.first + meta.second === meta.total && sameArray(meta.answer, [meta.first, meta.second]), id, difficulty, "두 막대 길이 오류"); return;
    case "unit-two-weight":
      assert(meta.circleCount * meta.circle === meta.squareCount * meta.square, id, difficulty, "두 물건 평형 오류");
      assert(meta.circle + meta.square === meta.total && sameArray(meta.answer, [meta.circle, meta.square]), id, difficulty, "두 물건 무게 오류"); return;
    case "unit-symbol-chain": {
      const { diamond, square, triangle, circle, cross } = meta.symbols;
      assert(meta.values[diamond] * 3 === meta.values[square] * 4, id, difficulty, "첫 도형식 오류");
      assert(meta.values[triangle] * 3 === meta.values[circle] * 4, id, difficulty, "둘째 도형식 오류");
      assert(meta.values[diamond] + meta.values[triangle] === meta.values[circle] * 2, id, difficulty, "셋째 도형식 오류");
      assert(meta.values[triangle] + meta.values[circle] === meta.values[cross] * 2 && numeric === meta.answer, id, difficulty, "마지막 도형식 오류"); return;
    }
    case "unit-rectangle-rhombus":
      assert(meta.rectanglePerimeter === 2 * (meta.width + meta.shared) && numeric === meta.shared, id, difficulty, "직사각형·마름모 오류"); return;
    case "unit-three-shapes":
      assert(meta.perimeter === 2 * meta.width + 5 * meta.side && numeric === meta.width, id, difficulty, "세 도형 둘레 오류"); return;
    case "unit-three-squares":
      assert(meta.small === meta.large - meta.middle && meta.answer === 2 * meta.middle && numeric === meta.answer, id, difficulty, "세 정사각형 색칠 둘레 오류"); return;
    case "unit-scattered-perimeter":
      assert(meta.answer === 2 * (sum(meta.horizontal) + sum(meta.vertical)) && numeric === meta.answer, id, difficulty, "흩어진 변 둘레 오류"); return;
    case "unit-square-triangle-strip":
      assert(meta.outsideEdges === 10 && meta.answer === meta.side * 10 && numeric === meta.answer, id, difficulty, "정사각형·정삼각형 둘레 오류"); return;
    case "unit-square-tiling":
      assert(meta.total === meta.unit * 7 && meta.answer === meta.unit * 4 && numeric === meta.answer, id, difficulty, "정사각형 분할 둘레 오류"); return;
    case "unit-round-pair-eight":
      assert(meta.pairs.length === 4 && meta.pairs.every((pair) => sum(pair) === meta.base), id, difficulty, "여덟 수 짝 오류");
      assert(meta.answer === meta.base * 4 && numeric === meta.answer, id, difficulty, "여덟 수 합 오류"); return;
    case "unit-even-odd-pair":
      assert(meta.evenValue === meta.evenPosition * 2 && meta.oddValue === meta.oddPosition * 2 - 1, id, difficulty, "짝홀수 순서 오류"); return;
    case "unit-facing-sum":
      assert(meta.left % 2 === 0 && meta.right === meta.left + 1 && meta.left + meta.right === meta.pageSum && numeric === meta.left, id, difficulty, "마주 보는 쪽수 합 오류"); return;
    case "unit-range-digit-pair":
      assert(meta.parts.length === 2 && meta.parts.every((part) => part.numberCount === part.end - part.start + 1 && part.digitCount === countWrittenDigits(part.start, part.end)), id, difficulty, "두 범위 숫자 개수 오류"); return;
    case "unit-consecutive-even-pair":
    case "unit-consecutive-odd-pair":
      assert(meta.parts.length === 2 && meta.parts.every((part) => sum(Array.from({ length: part.count }, (_, index) => part.start + index)) === part.answer), id, difficulty, "두 연속수 합 오류"); return;
    case "unit-sign-triple":
      assert(meta.patterns.length === 3 && meta.patterns.every((pattern, index) => meta.values.slice(1).reduce((total, value, itemIndex) => total + (pattern[itemIndex] === "+" ? value : -value), meta.values[0]) === meta.targets[index]), id, difficulty, "세 기호식 오류");
      assert(new Set(meta.targets).size === 3, id, difficulty, "세 목표값 중복"); return;
    case "unit-join-pair":
      assert(meta.patterns.length === 2 && meta.patterns.every((pattern, index) => evaluateJoinedExpression(meta.digits, pattern) === meta.targets[index]), id, difficulty, "두 이어 붙이기 식 오류"); return;
    case "unit-balance-chain":
      assert(meta.answer === 6 && numeric === 6, id, difficulty, "세 저울 등가 오류"); return;
    case "unit-fold-cut-open":
      assert(meta.openedPerimeter === meta.openedSide * 4, id, difficulty, "펼친 정사각형 둘레 오류");
      assert(meta.foldedWidth === meta.openedSide + meta.cut && meta.originalWidth === meta.foldedWidth * 2 && meta.originalHeight === meta.openedSide * 2, id, difficulty, "접기 전 길이 오류");
      assert(meta.answer === 2 * (meta.originalWidth + meta.originalHeight) && numeric === meta.answer, id, difficulty, "처음 색종이 둘레 오류"); return;
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

if (!book) throw new Error("book-06 missing");
if (units.length !== 4) throw new Error(`book-06 unit count ${units.length}`);
if (typeIds.length !== 62) throw new Error(`book-06 type count ${typeIds.length}`);
if (unitTestQuestions.length !== 25) throw new Error(`book-06 unit test count ${unitTestQuestions.length}`);
unitTestQuestions.forEach((question, index) => {
  if (question.number !== index + 1) throw new Error(`book-06 unit test number ${question.number}, expected ${index + 1}`);
  if (question.typeId !== expectedUnitTestTypes[index]) throw new Error(`book-06 unit test ${question.number} type ${question.typeId}, expected ${expectedUnitTestTypes[index]}`);
  if (!question.verified) throw new Error(`book-06 unit test ${question.number} is not verified`);
  if (!typeById(question.typeId)) throw new Error(`book-06 unit test ${question.number} unknown type ${question.typeId}`);
});

let sourceQuestionCount = 0;
units.forEach((unit, unitIndex) => {
  const expected = TEXTBOOK_STAGES.flatMap((stage) => referenceKeys(stage.id, unit.studyRefs[stage.id] || []));
  const actual = [];
  unit.typeIds.forEach((typeId) => {
    const type = typeById(typeId);
    if (!type) throw new Error(`unknown type ${typeId}`);
    if (!GENERATORS[type.generator]) throw new Error(`missing generator ${type.generator}`);
    if (!textbookGuideForType(typeId)) throw new Error(`missing guide ${typeId}`);
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
if (sourceQuestionCount !== 159) throw new Error(`book-06 source count ${sourceQuestionCount}`);

let generated = 0;
for (const typeId of auditedTypeIds) {
  const type = typeById(typeId);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1, 2, 3]) {
    for (let index = 0; index < iterations; index += 1) {
      const problem = generator({ difficulty });
      validate(problem, typeId, difficulty);
      generated += 1;
    }
  }
}

console.log(`BOOK06_AUDIT_OK bodyTypes=${typeIds.length} unitTestQuestions=${unitTestQuestions.length} auditedTypes=${auditedTypeIds.length} sourceQuestions=${sourceQuestionCount} generated=${generated.toLocaleString("en-US")}`);
