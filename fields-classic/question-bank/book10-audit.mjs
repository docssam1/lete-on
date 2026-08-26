import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { BOOK10_GENERATORS, BOOK10_UNIT_TEST_GENERATORS, BOOK10_UNIT_TEST_REUSED_GENERATORS } from "./book10-generators.js";
import { book10Markup } from "./book10-renderers.js";

const iterations = Number(process.env.BOOK10_ITERATIONS || 1000);
const unitTestIterations = Math.max(100, Number(process.env.BOOK10_UNIT_TEST_ITERATIONS || 120));
const book = CURRICULUM.find((item) => item.id === "book-10");
const units = book?.units || [];
const typeIds = [...new Set(units.flatMap((unit) => unit.typeIds))];
const book10TypeIds = typeIds.filter((id) => id.endsWith("-b10"));
const expectedUnitCounts = [61, 38, 40, 43];
const fallbackGuide = "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";
const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

const fail = (id, difficulty, message) => { throw new Error(`BOOK10_AUDIT_FAILED [${id}] [difficulty=${difficulty}]: ${message}`); };
const assert = (condition, id, difficulty, message) => { if (!condition) fail(id, difficulty, message); };
const sum = (items) => items.reduce((total, value) => total + value, 0);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const same = (first, second) => JSON.stringify(first) === JSON.stringify(second);
const numericAnswer = (problem) => Number(String(problem.answer).match(/-?\d+(?:\.\d+)?/)?.[0]);

function combinations(items, count, start = 0, chosen = [], output = []) {
  if (chosen.length === count) { output.push([...chosen]); return output; }
  for (let index = start; index <= items.length - (count - chosen.length); index += 1) {
    chosen.push(items[index]);
    combinations(items, count, index + 1, chosen, output);
    chosen.pop();
  }
  return output;
}

function permutations(items, count = items.length, chosen = [], output = []) {
  if (chosen.length === count) { output.push([...chosen]); return output; }
  items.forEach((value, index) => {
    chosen.push(value);
    permutations(items.slice(0, index).concat(items.slice(index + 1)), count, chosen, output);
    chosen.pop();
  });
  return output;
}

function consecutiveRuns(target, maxLength = 12) {
  const found = [];
  for (let length = 2; length <= maxLength; length += 1) {
    for (let start = 1; start <= target; start += 1) {
      const values = range(start, start + length - 1);
      const total = sum(values);
      if (total === target) found.push(values);
      if (total >= target) break;
    }
  }
  return found;
}

function baseballScore(secret, guess) {
  let strikes = 0;
  let balls = 0;
  guess.forEach((digit, index) => {
    if (secret[index] === digit) strikes += 1;
    else if (secret.includes(digit)) balls += 1;
  });
  return [strikes, balls];
}

const baseballCandidates = permutations(range(1, 9), 3);
const countDigit = (from, to, digit) => range(from, to).reduce((total, value) => total + [...String(value)].filter((item) => item === String(digit)).length, 0);
const writtenDigits = (from, to) => range(from, to).reduce((total, value) => total + String(value).length, 0);

function cardNumbers(cards, length, repeat = false) {
  const output = [];
  const visit = (chosen) => {
    if (chosen.length === length) {
      if (chosen[0] !== 0) output.push(Number(chosen.join("")));
      return;
    }
    cards.forEach((digit) => {
      if (!repeat && chosen.includes(digit)) return;
      visit([...chosen, digit]);
    });
  };
  visit([]);
  return output;
}

const unitTestMapping = Object.freeze({
  1: BOOK10_UNIT_TEST_GENERATORS.q01,
  2: BOOK10_UNIT_TEST_GENERATORS.q02,
  3: BOOK10_UNIT_TEST_GENERATORS.q03,
  4: BOOK10_UNIT_TEST_GENERATORS.q04,
  5: BOOK10_UNIT_TEST_GENERATORS.q05,
  6: BOOK10_UNIT_TEST_GENERATORS.q06,
  7: BOOK10_UNIT_TEST_GENERATORS.q07,
  8: BOOK10_UNIT_TEST_GENERATORS.q08,
  9: BOOK10_UNIT_TEST_GENERATORS.q09,
  10: BOOK10_UNIT_TEST_GENERATORS.q10,
  11: BOOK10_UNIT_TEST_GENERATORS.q11,
  12: BOOK10_UNIT_TEST_GENERATORS.q12,
  13: BOOK10_UNIT_TEST_GENERATORS.q13,
  14: BOOK10_UNIT_TEST_GENERATORS.q14,
  15: BOOK10_UNIT_TEST_GENERATORS.q15,
  16: BOOK10_UNIT_TEST_GENERATORS.q16,
  17: BOOK10_UNIT_TEST_GENERATORS.q17,
  18: BOOK10_UNIT_TEST_GENERATORS.q18,
  19: BOOK10_UNIT_TEST_GENERATORS.q19,
  20: BOOK10_UNIT_TEST_GENERATORS.q20,
  21: BOOK10_UNIT_TEST_GENERATORS.q21,
  22: BOOK10_UNIT_TEST_GENERATORS.q22,
  23: BOOK10_UNIT_TEST_GENERATORS.q23,
  24: BOOK10_UNIT_TEST_GENERATORS.q24,
  25: BOOK10_UNIT_TEST_GENERATORS.q25
});

const originalUnitTestAnswers = Object.freeze({
  1: "(1) 136, (2) 820, (3) 69, (4) 145",
  2: "(1) 120, (2) 1770, (3) 30, (4) 72",
  3: "(1) 7 + 8 + 9 + 10 + 11 + 12 = 57 / (2) 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 = 92",
  4: "(1) 9 + 10 + 11 + 12 + 13 = 55 / (2) 9 + 10 + 11 + 12 + 13 + 14 + 15 = 84",
  5: "(1) 126, (2) 24",
  6: "5점",
  7: "4",
  8: "9명, 72개",
  9: "8분 후",
  10: "5g",
  11: "●=4g, ◇=8g, ■=2g, ★=6g",
  12: "60개",
  13: "18개",
  14: "64개",
  15: "543, 542, 541, 532, 531, 521, 432, 431, 421, 321",
  16: "8+2+1, 7+3+1, 6+4+1, 6+3+2, 5+4+2",
  17: "431",
  18: "64번",
  19: "140번",
  20: "131개",
  21: "492개",
  22: "88",
  23: "250",
  24: "2, 1",
  25: "홀수 39, 짝수 40"
});

function solveLinear(equations) {
  const matrix = equations.map((row) => row.map(Number));
  const variableCount = matrix[0].length - 1;
  let pivotRow = 0;
  for (let column = 0; column < variableCount && pivotRow < matrix.length; column += 1) {
    const swap = matrix.findIndex((row, index) => index >= pivotRow && Math.abs(row[column]) > 1e-9);
    if (swap < 0) continue;
    [matrix[pivotRow], matrix[swap]] = [matrix[swap], matrix[pivotRow]];
    const pivot = matrix[pivotRow][column];
    matrix[pivotRow] = matrix[pivotRow].map((value) => value / pivot);
    matrix.forEach((row, index) => {
      if (index === pivotRow) return;
      const factor = row[column];
      matrix[index] = row.map((value, item) => value - factor * matrix[pivotRow][item]);
    });
    pivotRow += 1;
  }
  if (pivotRow !== variableCount) return null;
  return matrix.slice(0, variableCount).map((row) => row.at(-1));
}

function validate(problem, id, difficulty) {
  assert(problem && typeof problem === "object", id, difficulty, "문제 객체 없음");
  assert(typeof problem.prompt === "string" && problem.prompt.length >= 12, id, difficulty, "지문 없음");
  assert((problem.prompt.match(/\?/g) || []).length <= 1, id, difficulty, "지문 물음표 중복");
  assert(typeof problem.answer === "string" && problem.answer.trim(), id, difficulty, "정답 없음");
  assert(typeof problem.solution === "string" && problem.solution.length >= 12, id, difficulty, "풀이 없음");
  assert(problem.visual?.kind === "book10", id, difficulty, "10권 시각 자료 아님");
  assert(book10Markup(problem.visual).length > 20, id, difficulty, `렌더링 없음: ${problem.visual?.subtype}`);
  assert(problem.meta?.family, id, difficulty, "검산 family 없음");
  const allText = `${problem.prompt} ${problem.solution}`;
  assert(!/(은\(는\)|이\(가\)|을\(를\)|와\(과\)|과\(와\))/.test(allText), id, difficulty, "괄호 조사 남음");
  assert(!/(순열|퍼뮤테이션|조합|컴비네이션|제곱)/.test(allText), id, difficulty, "연령 부적합 용어");
  assert(!/(NaN|Infinity|undefined)/.test(JSON.stringify(problem)), id, difficulty, "잘못된 값 노출");

  const meta = problem.meta;
  const numeric = numericAnswer(problem);
  switch (meta.family) {
    case "multi-method-multiplication-b10":
      assert(meta.first * meta.second === meta.result && numeric === meta.result, id, difficulty, "곱셈 결과 오류"); return;
    case "same-tens-complement-product-b10":
      assert(Math.floor(meta.first / 10) === Math.floor(meta.second / 10) && meta.first % 10 + meta.second % 10 === 10, id, difficulty, "십의 자리 곱셈 조건 오류");
      assert(meta.first * meta.second === meta.result && numeric === meta.result, id, difficulty, "십의 자리 곱셈 답 오류"); return;
    case "same-ones-complement-product-b10":
      assert(meta.first % 10 === meta.second % 10 && Math.floor(meta.first / 10) + Math.floor(meta.second / 10) === 10, id, difficulty, "일의 자리 곱셈 조건 오류");
      assert(meta.first * meta.second === meta.result && numeric === meta.result, id, difficulty, "일의 자리 곱셈 답 오류"); return;
    case "factor-pair-divisor-count-b10": {
      const divisors = range(1, meta.target).filter((value) => meta.target % value === 0);
      assert(same(divisors, meta.divisors) && numeric === divisors.length, id, difficulty, "약수 개수 오류"); return;
    }
    case "multi-count-consecutive-decomposition-b10":
    case "all-consecutive-decompositions-b10": {
      const runs = consecutiveRuns(meta.target);
      assert(same(runs, meta.runs), id, difficulty, "연속수 표현 누락 또는 중복");
      if (meta.family.startsWith("multi-count")) assert(numeric === runs.length, id, difficulty, "연속수 방법 수 오류");
      else assert(problem.answer === runs.map((values) => values.join("+")).join(" / "), id, difficulty, "연속수 전체 답 표기 오류");
      return;
    }
    case "calendar-consecutive-sum-weekday-b10":
      assert(meta.dates.every((value, index) => index === 0 || value === meta.dates[index - 1] + 1), id, difficulty, "달력 날짜가 연속이 아님");
      assert(sum(meta.dates) === meta.total && meta.last === meta.dates.at(-1), id, difficulty, "달력 날짜 합 오류");
      assert(problem.answer === WEEKDAYS[(meta.dayOne + meta.last - 1) % 7], id, difficulty, "요일 오류"); return;
    case "consecutive-page-range-b10":
      assert(meta.pages.length === meta.count && sum(meta.pages) === meta.total && meta.pages.every((value, index) => index === 0 || value === meta.pages[index - 1] + 1), id, difficulty, "연속 쪽수 오류");
      assert(problem.answer === `${meta.pages[0]}쪽부터 ${meta.pages.at(-1)}쪽`, id, difficulty, "쪽수 답 오류"); return;
    case "same-parity-consecutive-sum-b10":
      assert(meta.values.every((value, index) => index === 0 || value === meta.values[index - 1] + 2), id, difficulty, "홀짝 연속수 간격 오류");
      assert(meta.values.every((value) => value % 2 === meta.values[0] % 2) && sum(meta.values) === numeric, id, difficulty, "홀짝 연속수 합 오류"); return;
    case "rectangular-number-grid-sum-b10":
    case "shaped-number-grid-sum-b10": {
      const expected = Array.from({ length: meta.rows }, (_, row) => Array.from({ length: meta.cols }, (_, column) => meta.start + row * meta.rowStep + column));
      const total = sum(meta.highlighted.map((index) => expected[Math.floor(index / meta.cols)][index % meta.cols]));
      assert(same(expected, meta.values) && total === numeric, id, difficulty, "수 배열표 합 오류"); return;
    }
    case "calendar-block-sum-b10": {
      const expected = [meta.center - 8, meta.center - 7, meta.center - 6, meta.center - 1, meta.center, meta.center + 1, meta.center + 6, meta.center + 7, meta.center + 8];
      assert(same(expected, meta.values) && sum(expected) === meta.total, id, difficulty, "달력 3×3 값 오류");
      assert(numeric === (meta.askCenter ? meta.center : meta.total), id, difficulty, "달력 3×3 답 오류"); return;
    }
    case "consecutive-tens-digit-condition-b10": {
      const candidates = range(10, 96).map((start) => [start, start + 1, start + 2]).filter((values) => sum(values.map((value) => Math.floor(value / 10))) === meta.tensSum && sum(values.map((value) => value % 10)) === meta.onesSum);
      assert(candidates.length === 1 && same(candidates[0], meta.values), id, difficulty, "자리 합 조건 답이 유일하지 않음"); return;
    }
    case "consecutive-vertical-addition-b10":
      assert(meta.values.every((value, index) => value === meta.start + index) && sum(meta.values) === meta.total, id, difficulty, "연속수 세로셈 합 오류");
      assert(sum(meta.hidden) === numeric && meta.hidden.length === 3, id, difficulty, "가려진 숫자 합 오류"); return;
    case "two-symbol-coefficient-weight-b10":
    case "two-symbol-score-difference-b10":
      assert(meta.equations.every(([a, b, total]) => a * meta.firstValue + b * meta.secondValue === total), id, difficulty, "두 도형 식 오류");
      assert(numeric === (meta.family.includes("difference") ? meta.firstValue - meta.secondValue : meta.firstValue), id, difficulty, "두 도형 답 오류"); return;
    case "shared-term-equation-b10":
      assert(meta.values[0] + meta.values[1] === meta.pair && sum(meta.values) === meta.all && numeric === meta.values[2], id, difficulty, "공통 묶음 식 오류"); return;
    case "container-double-content-b10":
      assert(meta.emptyTotal === meta.container * 2 && meta.fullTotal === (meta.container + meta.content) * 2 && numeric === meta.content * 2, id, difficulty, "통과 내용물 계산 오류"); return;
    case "three-pair-sums-values-b10":
      assert(same(meta.pairSums, [meta.values[0] + meta.values[1], meta.values[1] + meta.values[2], meta.values[0] + meta.values[2]]), id, difficulty, "세 짝의 합 오류");
      assert(problem.answer === `원=${meta.values[0]}, 세모=${meta.values[1]}, 네모=${meta.values[2]}`, id, difficulty, "세 도형 답 오류"); return;
    case "closed-perimeter-spacing-difference-b10":
      assert(meta.perimeter % meta.firstGap === 0 && meta.perimeter % meta.secondGap === 0, id, difficulty, "둘레 간격이 나누어떨어지지 않음");
      assert(meta.firstCount === meta.perimeter / meta.firstGap && meta.secondCount === meta.perimeter / meta.secondGap && numeric === Math.abs(meta.firstCount - meta.secondCount), id, difficulty, "둘레 개수 차 오류"); return;
    case "same-budget-price-count-b10":
      assert(meta.budget % meta.firstPrice === 0 && meta.budget % meta.secondPrice === 0, id, difficulty, "예산이 가격으로 나누어떨어지지 않음");
      assert(meta.firstCount === meta.budget / meta.firstPrice && meta.secondCount === meta.budget / meta.secondPrice && numeric === meta.secondCount - meta.firstCount, id, difficulty, "가격별 개수 차 오류"); return;
    case "new-participants-equal-share-b10":
      assert(meta.newPeople === meta.oldPeople + meta.added && meta.oldPeople * meta.oldShare === meta.newPeople * meta.newShare && numeric === meta.oldShare, id, difficulty, "나눔 인원 변화 오류"); return;
    case "catch-up-growing-amount-b10":
      assert(meta.slowStart + meta.slowRate * meta.days === meta.fastStart + meta.fastRate * meta.days && numeric === meta.days, id, difficulty, "늘어나는 양 따라잡기 오류"); return;
    case "catch-up-shrinking-amount-b10":
      assert(meta.shortStart - meta.slowRate * meta.days === meta.longStart - meta.fastRate * meta.days && numeric === meta.days, id, difficulty, "줄어드는 양 따라잡기 오류"); return;
    case "catch-up-distance-b10":
      assert((meta.fastSpeed - meta.slowSpeed) * meta.minutes === meta.distance && numeric === meta.minutes, id, difficulty, "거리 따라잡기 오류"); return;
    case "four-object-weight-system-b10": {
      assert(meta.equations.every((row) => sum(row.slice(0, 4).map((coefficient, index) => coefficient * meta.values[index])) === row[4]), id, difficulty, "네 물건 식 오류");
      const solved = solveLinear(meta.equations);
      assert(solved && solved.every((value, index) => Math.abs(value - meta.values[index]) < 1e-8), id, difficulty, "네 물건 값이 유일하지 않음"); return;
    }
    case "delayed-start-catch-up-b10":
      assert(meta.totalMonths === meta.delay + meta.afterStart && meta.earlyRate * meta.totalMonths === meta.lateRate * meta.afterStart && numeric === meta.totalMonths, id, difficulty, "늦게 시작한 따라잡기 오류"); return;
    case "repeated-digit-number-count-b10": {
      const candidates = range(0, 10 ** meta.length - 1).map((value) => String(value).padStart(meta.length, "0")).filter((text) => text[0] !== "0" && [...text].every((digit) => meta.digits.includes(Number(digit))));
      assert(same(candidates, meta.candidates) && numeric === candidates.length, id, difficulty, "숫자 반복 경우 수 오류"); return;
    }
    case "binary-switch-count-b10": {
      let count = 1;
      for (let index = 0; index < meta.switchCount; index += 1) count *= 2;
      if (meta.excludeAllOff) count -= 1;
      assert(numeric === count && meta.candidates.length === count, id, difficulty, "전등 모습 수 오류"); return;
    }
    case "monotone-digit-enumeration-b10":
    case "monotone-digit-rank-b10": {
      const candidates = combinations([...meta.digits].sort((a, b) => a - b), meta.length).map((chosen) => meta.direction === "increasing" ? chosen : [...chosen].reverse()).filter((chosen) => chosen[0] !== 0).map((chosen) => Number(chosen.join(""))).sort((a, b) => a - b);
      assert(same(candidates, meta.candidates), id, difficulty, "자리 숫자 순서 후보 오류");
      assert(numeric === (meta.rank ? candidates[meta.rank - 1] : candidates.length), id, difficulty, "자리 숫자 순서 답 오류"); return;
    }
    case "distinct-card-target-sum-b10": {
      const solutions = combinations(meta.cards, meta.pickCount).filter((chosen) => sum(chosen) === meta.target);
      assert(solutions.length === 1 && same(solutions, meta.solutions), id, difficulty, "목표 합 카드 답이 유일하지 않음");
      assert(problem.answer === solutions[0].join(", "), id, difficulty, "목표 합 카드 답 오류"); return;
    }
    case "digit-sum-three-digit-count-b10":
    case "digit-sum-ranked-number-b10": {
      const candidates = range(100, 999).filter((value) => sum([...String(value)].map(Number)) === meta.target);
      assert(same(candidates, meta.candidates), id, difficulty, "자리 숫자 합 후보 오류");
      assert(numeric === (meta.rank ? candidates[meta.rank - 1] : candidates.length), id, difficulty, "자리 숫자 합 답 오류"); return;
    }
    case "three-digit-step-count-b10": {
      const candidates = range(100, meta.limit).filter((value) => { const [a, b, c] = [...String(value)].map(Number); return a - b === b - c && a !== b; });
      assert(same(candidates, meta.candidates) && numeric === candidates.length, id, difficulty, "같은 자리 차 수 오류"); return;
    }
    case "monotone-digit-count-b10": {
      const candidates = range(100, meta.limit - 1).filter((value) => { const [a, b, c] = [...String(value)].map(Number); return a > b && b > c; });
      assert(same(candidates, meta.candidates) && numeric === candidates.length, id, difficulty, "작아지는 자리 숫자 수 오류"); return;
    }
    case "route-product-count-b10":
      assert(numeric === meta.choices.reduce((total, value) => total * value, 1), id, difficulty, "길 선택 수 오류"); return;
    case "lineup-count-b10": {
      let count = 1;
      for (let value = meta.active; value >= 1; value -= 1) count *= value;
      assert(numeric === count && meta.active === meta.people - (meta.fixedFirst ? 1 : 0), id, difficulty, "줄 세우기 수 오류"); return;
    }
    case "number-baseball-b10": {
      const matches = baseballCandidates.filter((candidate) => meta.clues.every((clue) => {
        const score = baseballScore(candidate, clue.guess);
        return score[0] === clue.strikes && score[1] === clue.balls;
      }));
      assert(matches.length === 1 && same(matches[0], meta.secret), id, difficulty, `숫자 야구 후보 ${matches.length}개`);
      assert(problem.answer === meta.secret.join(""), id, difficulty, "숫자 야구 답 오류"); return;
    }
    case "most-frequent-digit-b10": {
      const counts = range(0, 9).map((digit) => countDigit(meta.from, meta.to, digit));
      const maximum = Math.max(...counts);
      const winners = counts.map((count, digit) => ({ count, digit })).filter((item) => item.count === maximum);
      assert(same(counts, meta.counts) && winners.length === 1 && numeric === winners[0].digit, id, difficulty, "가장 많이 쓰인 숫자 오류"); return;
    }
    case "digit-occurrence-range-b10":
      assert(numeric === countDigit(meta.from, meta.to, meta.digit), id, difficulty, "구간 숫자 등장 횟수 오류"); return;
    case "positive-range-number-digit-count-b10":
      assert(numeric === writtenDigits(meta.from, meta.to), id, difficulty, "구간 전체 숫자 수 오류"); return;
    case "book10-unit-q01":
    case "book10-unit-q02": {
      const expectedParity = meta.questionNumber === 1 ? 0 : 1;
      assert(meta.parts.length === 4 && meta.counts.length === 4, id, difficulty, "연속수 복수 소문항 구조 오류");
      assert(meta.parts.every((part, index) => part.count === meta.counts[index]
        && part.values.length === part.count
        && part.values.every((value, valueIndex) => valueIndex === 0 || value === part.values[valueIndex - 1] + 1)
        && sum(part.values) === part.total
        && part.count % 2 === expectedParity), id, difficulty, "연속수 복수 소문항 검산 오류");
      assert(problem.answer === meta.resultValues.map((value, index) => `(${index + 1}) ${value}`).join(", "), id, difficulty, "연속수 복수 답 표기 오류");
      return;
    }
    case "book10-unit-q03":
    case "book10-unit-q04": {
      assert(meta.parts.length === 2 && meta.parts.every((part) => part.values.length === part.count && sum(part.values) === part.target), id, difficulty, "연속수 표현 소문항 검산 오류");
      const expectedAnswer = meta.parts.map((part, index) => `(${index + 1}) ${part.values.join(" + ")} = ${part.total}`).join(" / ");
      assert(problem.answer === expectedAnswer, id, difficulty, "연속수 표현 답 표기 오류");
      return;
    }
    case "book10-unit-q05": {
      const expected = Array.from({ length: meta.size }, (_, row) => Array.from({ length: meta.size }, (_, column) => meta.start + row * 7 + column)).flat();
      const alternative = Array.from({ length: meta.size }, (_, row) => Array.from({ length: meta.size }, (_, column) => meta.alternativeStart + row * 7 + column)).flat();
      assert(same(meta.values, expected) && sum(meta.values) === meta.total, id, difficulty, "단원 달력 블록 합 오류");
      assert(same(meta.alternativeValues, alternative) && sum(alternative) === meta.alternativeTotal && meta.alternativeMaximum === alternative.at(-1), id, difficulty, "단원 달력 두 번째 조건 오류");
      assert(problem.answer === `(1) ${meta.total}, (2) ${meta.alternativeMaximum}`, id, difficulty, "단원 달력 답 표기 오류");
      return;
    }
    case "book10-unit-q06": {
      const solved = solveLinear(meta.equations);
      assert(solved && Math.abs(solved[0] - meta.values["가"]) < 1e-8 && Math.abs(solved[1] - meta.values["나"]) < 1e-8, id, difficulty, "두 영역 점수 해가 유일하지 않음");
      assert(meta.equations.every(([first, second, total]) => first * meta.values["가"] + second * meta.values["나"] === total), id, difficulty, "두 영역 점수 식 오류");
      assert(problem.answer === `${meta.values["나"]}점`, id, difficulty, "두 영역 점수 답 오류");
      return;
    }
    case "book10-unit-q07": {
      const { A, B, C } = meta.values;
      assert(A + B === meta.pairSums[0] && B + C === meta.pairSums[1] && C + A === meta.pairSums[2], id, difficulty, "세 쌍의 합 식 오류");
      const solved = solveLinear([[1, 1, 0, meta.pairSums[0]], [0, 1, 1, meta.pairSums[1]], [1, 0, 1, meta.pairSums[2]]]);
      assert(solved && solved.every((value, index) => Math.abs(value - [A, B, C][index]) < 1e-8), id, difficulty, "세 쌍의 합 해가 유일하지 않음");
      assert(problem.answer === String(C), id, difficulty, "세 쌍의 합 답 오류");
      return;
    }
    case "book10-unit-q08":
      assert(meta.oldPeople * meta.oldShare === meta.newPeople * meta.newShare && meta.newPeople === meta.oldPeople + meta.added, id, difficulty, "단원 나눔 식 오류");
      assert(numericAnswer(problem) === meta.oldPeople && meta.total === meta.oldPeople * meta.oldShare && problem.answer === `${meta.oldPeople}명, ${meta.total}개`, id, difficulty, "단원 나눔 답 오류");
      return;
    case "book10-unit-q09":
      assert(meta.slowStart + meta.slowRate * meta.minutes === meta.fastStart + meta.fastRate * meta.minutes && Number.isInteger(meta.minutes), id, difficulty, "단원 따라잡기 식 오류");
      assert(numericAnswer(problem) === meta.minutes, id, difficulty, "단원 따라잡기 답 오류");
      return;
    case "book10-unit-q10":
      assert(meta.equations.every(([first, second, total]) => first * meta.values[0] + second * meta.values[1] === total), id, difficulty, "단원 두 물건 식 오류");
      assert(numericAnswer(problem) === meta.values[0], id, difficulty, "단원 두 물건 답 오류");
      return;
    case "book10-unit-q11": {
      assert(meta.equations.every((row) => sum(row.slice(0, 4).map((coefficient, index) => coefficient * meta.values[index])) === row[4]), id, difficulty, "단원 네 모양 식 오류");
      const solved = solveLinear(meta.equations);
      assert(solved && solved.every((value, index) => Math.abs(value - meta.values[index]) < 1e-8), id, difficulty, "단원 네 모양 해가 유일하지 않음");
      assert(problem.answer === `●=${meta.values[0]}g, ◇=${meta.values[1]}g, ■=${meta.values[2]}g, ★=${meta.values[3]}g`, id, difficulty, "단원 네 모양 답 오류");
      return;
    }
    case "book10-unit-q12":
    case "book10-unit-q13":
    case "book10-unit-q14": {
      const expected = cardNumbers(meta.cards, meta.length, meta.repeat);
      assert(same(meta.candidates, expected) && numericAnswer(problem) === expected.length, id, difficulty, "단원 숫자 카드 개수 오류");
      return;
    }
    case "book10-unit-q15": {
      const expected = permutations(meta.cards, meta.length).filter((digits) => digits.every((digit, index) => index === 0 || digits[index - 1] > digit))
        .map((digits) => Number(digits.join(""))).sort((first, second) => second - first);
      assert(same(meta.candidates, expected) && new Set(meta.candidates).size === expected.length, id, difficulty, "내림차순 전체 목록 오류");
      assert(problem.answer === expected.join(", "), id, difficulty, "내림차순 전체 답 표기 오류");
      return;
    }
    case "book10-unit-q16": {
      const expected = combinations(meta.cards, meta.pickCount).filter((chosen) => sum(chosen) === meta.target);
      const expectedAnswer = expected.map((chosen) => [...chosen].sort((first, second) => second - first).join("+"));
      assert(expected.length === meta.solutions.length && same(meta.solutions, expected), id, difficulty, "목표 합 전체 목록 누락");
      assert(expected.every((chosen) => sum(chosen) === meta.target) && new Set(expectedAnswer).size === expectedAnswer.length, id, difficulty, "목표 합 목록 중복 또는 오답");
      assert(same(meta.answerList, expectedAnswer) && problem.answer === expectedAnswer.join(", "), id, difficulty, "목표 합 전체 답 표기 오류");
      return;
    }
    case "book10-unit-q17": {
      const expected = range(100, 999).filter((value) => sum([...String(value)].map(Number)) === meta.target)
        .sort((first, second) => second - first);
      assert(same(meta.candidates, expected) && meta.resultValue === expected[meta.rank - 1], id, difficulty, "내림차순 자리 합 목록 오류");
      assert(problem.answer === String(expected[meta.rank - 1]), id, difficulty, "내림차순 자리 합 답 오류");
      return;
    }
    case "book10-unit-q18":
    case "book10-unit-q19":
      assert(meta.result === countDigit(meta.from, meta.to, meta.digit) && numericAnswer(problem) === meta.result, id, difficulty, "단원 숫자 등장 횟수 오류");
      return;
    case "book10-unit-q20":
    case "book10-unit-q21":
      assert(meta.result === writtenDigits(meta.from, meta.to) && numericAnswer(problem) === meta.result, id, difficulty, "단원 전체 숫자 수 오류");
      return;
    case "book10-unit-q22":
    case "book10-unit-q23":
      assert(meta.last !== null && writtenDigits(1, meta.last) === meta.target && writtenDigits(1, meta.last - 1) < meta.target, id, difficulty, "단원 마지막 수 조건 오류");
      assert(problem.answer === String(meta.last), id, difficulty, "단원 마지막 수 답 오류");
      return;
    case "book10-unit-q24":
      assert(meta.parts.length === 2 && meta.parts.every((part) => part.addends.length === 3
        && part.addends[1] === part.addends[0] + 1
        && part.addends[2] === part.addends[1] + 1
        && sum(part.addends) === part.total
        && String(part.total).endsWith(part.ending)
        && Number(`${part.blank}${part.ending}`) === part.total), id, difficulty, "두 세로셈 전체 검산 오류");
      assert(problem.answer === meta.parts.map((part) => part.blank).join(", "), id, difficulty, "두 세로셈 빈칸 답 오류");
      return;
    case "book10-unit-q25": {
      const expected = meta.cases.map((item) => {
        let even = 0;
        let odd = 0;
        for (let value = 1; value <= item.max; value += 1) {
          if (value % 2 === 0) even += value;
          else odd += value;
        }
        return { ...item, even, odd, difference: Math.abs(even - odd) };
      });
      assert(same(meta.cases, expected) && expected.every((item) => item.difference === meta.targetDifference), id, difficulty, "짝수 홀수 합 차 오류");
      assert(problem.answer === `홀수 ${expected[0].max}, 짝수 ${expected[1].max}`, id, difficulty, "짝수 홀수 답 오류");
      return;
    }
    default: fail(id, difficulty, `알 수 없는 family ${meta.family}`);
  }
}

assert(book, "book-10", 0, "10권 커리큘럼 없음");
assert(units.length === 4, "book-10", 0, `단원 수 ${units.length}`);
assert(same(units.map((unit) => Object.values(unit.studyRefs).flat().reduce((total, reference) => total + reference.to - reference.from + 1, 0)), expectedUnitCounts), "book-10", 0, "단원 문항 수 오류");
assert(typeIds.length === 52, "book-10", 0, `유형 수 ${typeIds.length}`);
assert(book10TypeIds.length === 42, "book-10", 0, `10권 전용 유형 수 ${book10TypeIds.length}`);
assert(Object.keys(BOOK10_GENERATORS).length === 42, "book-10", 0, `전용 생성기 수 ${Object.keys(BOOK10_GENERATORS).length}`);
assert(same(Object.keys(unitTestMapping), range(1, 25).map((number) => String(number))), "book-10-unit-test", 0, "단원 테스트 25문항 매핑 누락");
assert(Object.values(unitTestMapping).every((generator) => typeof generator === "function"), "book-10-unit-test", 0, "단원 테스트 생성기 연결 오류");
assert(Object.keys(BOOK10_UNIT_TEST_REUSED_GENERATORS).length === 6
  && Object.values(BOOK10_UNIT_TEST_REUSED_GENERATORS).every((generator) => typeof generator === "function"), "book-10-unit-test", 0, "재사용 생성기 export 오류");

for (const unit of units) {
  assert(unit.typeStudyRefs && Object.keys(unit.typeStudyRefs).length === unit.typeIds.length, "book-10", 0, `${unit.label} 세부 번호표 누락`);
  for (const typeId of unit.typeIds) {
    const type = typeById(typeId);
    assert(type?.generator && GENERATORS[type.generator], typeId, 0, "연결 생성기 없음");
    assert(textbookGuideForType(typeId) !== fallbackGuide, typeId, 0, "개념 풀이 안내 없음");
    for (const stage of TEXTBOOK_STAGES) assert(Array.isArray(unit.typeStudyRefs[typeId][stage.id]), typeId, 0, `${stage.label} 번호표 없음`);
  }
}

let unitDifficultyFingerprints = 0;
for (const [questionNumber, generator] of Object.entries(unitTestMapping)) {
  const byDifficulty = [1, 2, 3].map((difficulty) => {
    const problem = generator({ difficulty });
    validate(problem, `book10-unit-q${String(questionNumber).padStart(2, "0")}`, difficulty);
    assert(problem.meta?.difficulty === difficulty, `book10-unit-q${String(questionNumber).padStart(2, "0")}`, difficulty, "난이도 메타 누락");
    return problem;
  });
  const fingerprints = byDifficulty.map((problem) => JSON.stringify({
    prompt: problem.prompt,
    visual: problem.visual,
    answer: problem.answer,
    structure: Object.fromEntries(Object.entries(problem.meta).filter(([key]) => key !== "difficulty"))
  }));
  assert(new Set(fingerprints).size === 3, `book10-unit-q${String(questionNumber).padStart(2, "0")}`, 0, "난이도별 구조 fingerprint 중복");
  assert(byDifficulty[1].answer === originalUnitTestAnswers[Number(questionNumber)], `book10-unit-q${String(questionNumber).padStart(2, "0")}`, 2, "원본 중간 난이도 공식 답 변경");
  unitDifficultyFingerprints += 3;
}

let unitTestGenerated = 0;
for (const [questionNumber, generator] of Object.entries(unitTestMapping)) {
  for (let iteration = 0; iteration < unitTestIterations; iteration += 1) {
    const difficulty = (iteration % 3) + 1;
    const problem = generator({ difficulty });
    validate(problem, `book10-unit-q${String(questionNumber).padStart(2, "0")}`, difficulty);
    unitTestGenerated += 1;
  }
}

let reusedGenerated = 0;
for (const [questionNumber, generator] of Object.entries(BOOK10_UNIT_TEST_REUSED_GENERATORS)) {
  for (let iteration = 0; iteration < unitTestIterations; iteration += 1) {
    const difficulty = (iteration % 3) + 1;
    const problem = generator({ difficulty, max: 30 });
    validate(problem, `book10-unit-reuse-${questionNumber}`, difficulty);
    reusedGenerated += 1;
  }
}

let generated = 0;
for (const id of book10TypeIds) {
  const type = typeById(id);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1, 2, 3]) {
    const signatures = new Set();
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const problem = generator({ difficulty, max: 30 });
      validate(problem, id, difficulty);
      signatures.add(JSON.stringify([problem.prompt, problem.visual, problem.answer]));
      generated += 1;
    }
    assert(signatures.size >= Math.min(iterations, 3), id, difficulty, `출력 다양성 부족 ${signatures.size}`);
  }
}

console.log(`BOOK10_AUDIT_OK sourceQuestions=182 types=${typeIds.length} book10Types=${book10TypeIds.length} unitDifficultyFingerprints=${unitDifficultyFingerprints} unitTestGenerated=${unitTestGenerated} reusedGenerated=${reusedGenerated} generated=${generated}`);
