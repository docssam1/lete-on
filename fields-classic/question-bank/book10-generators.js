// 더클래식 1과정 10권 전용 생성기.
// 교재의 인쇄 문제 번호로 대조한 풀이 구조를 유지하고, 답은 독립 계산이 가능하도록
// 모든 원자료를 meta에 함께 둔다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function combinations(items, count, start = 0, chosen = [], output = []) {
  if (chosen.length === count) {
    output.push([...chosen]);
    return output;
  }
  for (let index = start; index <= items.length - (count - chosen.length); index += 1) {
    chosen.push(items[index]);
    combinations(items, count, index + 1, chosen, output);
    chosen.pop();
  }
  return output;
}

function permutations(items, count = items.length, chosen = [], output = []) {
  if (chosen.length === count) {
    output.push([...chosen]);
    return output;
  }
  items.forEach((value, index) => {
    chosen.push(value);
    permutations(items.slice(0, index).concat(items.slice(index + 1)), count, chosen, output);
    chosen.pop();
  });
  return output;
}

const digitCount = (value) => String(value).length;
const countDigit = (from, to, digit) => range(from, to)
  .reduce((total, value) => total + [...String(value)].filter((item) => item === String(digit)).length, 0);
const writtenDigits = (from, to) => range(from, to).reduce((total, value) => total + digitCount(value), 0);

function book10Problem({ prompt, subtype, visual = {}, answer, solution, family, meta = {}, answerVisual = null }) {
  return {
    prompt,
    visual: { kind: "book10", subtype, ...visual },
    ...(answerVisual ? { answerVisual: { kind: "book10", subtype, ...answerVisual } } : {}),
    answer: String(answer),
    solution,
    meta: { family, difficulty: meta.difficulty, result: answer, ...meta }
  };
}

function multiMethodMultiplicationBook10({ difficulty = 2 }) {
  const limits = { 1: [12, 29], 2: [21, 59], 3: [32, 89] }[difficulty];
  const first = randomInt(...limits);
  const second = randomInt(difficulty === 1 ? 11 : 16, difficulty === 3 ? 49 : 35);
  const result = first * second;
  return book10Problem({
    prompt: "네 가지 그림은 모두 같은 곱셈을 나타냅니다. 계산한 값을 쓰세요.",
    subtype: "multiplication-methods", visual: { first, second }, answer: result,
    solution: `${first}을 ${Math.floor(first / 10) * 10}과 ${first % 10}으로 나누어 ${second}을 각각 곱해 더하면 ${result}입니다.`,
    family: "multi-method-multiplication-b10", meta: { difficulty, first, second, result }
  });
}

function sameTensComplementProductBook10({ difficulty = 2 }) {
  const tens = randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 8 : 6);
  const firstOnes = randomInt(1, 4);
  const secondOnes = 10 - firstOnes;
  const first = tens * 10 + firstOnes;
  const second = tens * 10 + secondOnes;
  const result = first * second;
  return book10Problem({
    prompt: "십의 자리 숫자가 같고 일의 자리 숫자의 합이 10인 두 수의 곱을 구하세요.",
    subtype: "operation", visual: { expression: `${first} × ${second}` }, answer: result,
    solution: `십의 자리 ${tens}에 바로 다음 수 ${tens + 1}을 곱하고 뒤에 ${firstOnes} × ${secondOnes}을 두 자리로 쓰면 ${result}입니다.`,
    family: "same-tens-complement-product-b10", meta: { difficulty, tens, firstOnes, secondOnes, first, second, result }
  });
}

function sameOnesComplementProductBook10({ difficulty = 2 }) {
  const firstTens = randomInt(1, difficulty === 3 ? 8 : 6);
  const secondTens = 10 - firstTens;
  const ones = randomInt(1, 9);
  const first = firstTens * 10 + ones;
  const second = secondTens * 10 + ones;
  const result = first * second;
  const front = firstTens * secondTens + ones;
  const back = String(ones * ones).padStart(2, "0");
  return book10Problem({
    prompt: "일의 자리 숫자가 같고 십의 자리 숫자의 합이 10인 두 수의 곱을 구하세요.",
    subtype: "operation", visual: { expression: `${first} × ${second}` }, answer: result,
    solution: `앞부분은 ${firstTens} × ${secondTens} + ${ones} = ${front}, 뒷부분은 ${ones} × ${ones} = ${back}입니다. 두 부분을 이어 쓰면 ${result}입니다.`,
    family: "same-ones-complement-product-b10", meta: { difficulty, firstTens, secondTens, ones, first, second, result }
  });
}

function factorPairDivisorCountBook10({ difficulty = 2 }) {
  const pools = {
    1: [12, 18, 20, 24, 28, 30],
    2: [36, 40, 42, 48, 54, 60],
    3: [72, 84, 90, 96, 108, 120]
  }[difficulty];
  const target = sample(pools);
  const divisors = range(1, target).filter((value) => target % value === 0);
  const pairs = divisors.filter((value) => value <= target / value).map((value) => [value, target / value]);
  return book10Problem({
    prompt: `${target}을 나누어떨어지게 하는 수는 모두 몇 개인가요?`,
    subtype: "factor-pairs", visual: { target, pairs: pairs.map(([left]) => [left, null]) }, answer: `${divisors.length}개`,
    solution: `곱해서 ${target}이 되는 두 수의 짝은 ${pairs.map((pair) => `${pair[0]}×${pair[1]}`).join(", ")}입니다. 짝에 든 수를 세면 ${divisors.length}개입니다.`,
    family: "factor-pair-divisor-count-b10", meta: { difficulty, target, divisors, pairs, result: divisors.length }
  });
}

function consecutiveRuns(target, maxLength = 12, minLength = 2) {
  const found = [];
  for (let length = minLength; length <= maxLength; length += 1) {
    for (let start = 1; start <= target; start += 1) {
      const values = range(start, start + length - 1);
      const total = sum(values);
      if (total === target) found.push(values);
      if (total >= target) break;
    }
  }
  return found;
}

function multiCountConsecutiveDecompositionBook10({ difficulty = 2 }) {
  const pools = {
    1: [15, 21, 27, 33],
    2: [45, 55, 63, 75],
    3: [105, 120, 135, 165]
  }[difficulty];
  const candidates = pools.map((target) => ({ target, runs: consecutiveRuns(target) })).filter((item) => item.runs.length >= 2);
  const { target, runs } = sample(candidates);
  return book10Problem({
    prompt: `${target}을 두 개 이상의 연속수의 합으로 나타내는 방법은 모두 몇 가지인가요?`,
    subtype: "consecutive-target", visual: { target, slots: difficulty + 2 }, answer: `${runs.length}가지`,
    solution: `${runs.map((values) => values.join(" + ")).join(" / ")}로 나타낼 수 있으므로 모두 ${runs.length}가지입니다.`,
    family: "multi-count-consecutive-decomposition-b10", meta: { difficulty, target, runs, result: runs.length }
  });
}

const WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function calendarConsecutiveSumWeekdayBook10({ difficulty = 2 }) {
  const dayOne = randomInt(0, 6);
  const count = difficulty === 1 ? 5 : difficulty === 2 ? 6 : 7;
  const start = randomInt(2, 30 - count);
  const dates = range(start, start + count - 1);
  const total = sum(dates);
  const last = dates.at(-1);
  const result = WEEKDAYS[(dayOne + last - 1) % 7];
  return book10Problem({
    prompt: `달력에서 가로로 이어진 ${count}일의 날짜 합이 ${total}입니다. 마지막 날은 무슨 요일인가요?`,
    subtype: "calendar", visual: { dayOne, days: 31, highlighted: [] }, answer: result,
    solution: `${total}을 ${count}일에 알맞게 연속수로 나누면 ${dates.join(", ")}입니다. 마지막 날짜 ${last}일은 ${result}입니다.`,
    family: "calendar-consecutive-sum-weekday-b10", meta: { difficulty, dayOne, count, start, dates, total, last, result }
  });
}

function consecutivePageRangeBook10({ difficulty = 2 }) {
  const count = difficulty === 1 ? randomInt(3, 4) : difficulty === 2 ? randomInt(5, 6) : randomInt(7, 9);
  const start = randomInt(8, difficulty === 3 ? 72 : 45);
  const pages = range(start, start + count - 1);
  const total = sum(pages);
  const answer = `${start}쪽부터 ${pages.at(-1)}쪽`;
  return book10Problem({
    prompt: `연속한 ${count}쪽의 쪽수 합이 ${total}입니다. 처음과 마지막 쪽을 쓰세요.`,
    subtype: "page-strip", visual: { count, total }, answer,
    solution: `${total}을 ${count}개의 연속수로 나누면 ${pages.join(", ")}이므로 ${answer}입니다.`,
    family: "consecutive-page-range-b10", meta: { difficulty, count, start, pages, total, result: answer }
  });
}

function sameParityConsecutiveSumBook10({ difficulty = 2 }) {
  const parity = sample(["홀수", "짝수"]);
  const count = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 7;
  let start = randomInt(1, difficulty === 3 ? 35 : 21);
  if ((start % 2 === 0) !== (parity === "짝수")) start += 1;
  const values = Array.from({ length: count }, (_, index) => start + index * 2);
  const result = sum(values);
  return book10Problem({
    prompt: `${start}부터 차례로 이어지는 ${parity} ${count}개의 합을 구하세요.`,
    subtype: "number-strip", visual: { values: values.map((value, index) => index === count - 1 ? value : value), step: 2 }, answer: result,
    solution: `${values.join(" + ")} = ${result}입니다.`,
    family: "same-parity-consecutive-sum-b10", meta: { difficulty, parity, count, start, values, result }
  });
}

function numberGridValues(rows, cols, start, rowStep = 10) {
  return Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, column) => start + row * rowStep + column));
}

function rectangularNumberGridSumBook10({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 2 : 3;
  const cols = difficulty === 3 ? 4 : 3;
  const start = randomInt(1, 9);
  const values = numberGridValues(rows, cols, start);
  const highlighted = range(0, rows * cols - 1);
  const result = sum(values.flat());
  return book10Problem({
    prompt: "수 배열표에서 색칠한 칸에 적힌 수의 합을 구하세요.",
    subtype: "number-grid", visual: { values, highlighted }, answer: result,
    solution: `가운데 줄과 같은 간격의 수끼리 묶어 더하면 전체 합은 ${result}입니다.`,
    family: "rectangular-number-grid-sum-b10", meta: { difficulty, rows, cols, start, rowStep: 10, values, highlighted, result }
  });
}

function shapedNumberGridSumBook10({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 3 : 4;
  const cols = difficulty === 3 ? 5 : 4;
  const start = randomInt(1, 8);
  const values = numberGridValues(rows, cols, start);
  const shapes = {
    1: [1, cols, cols + 1, cols + 2, cols * 2 + 1],
    2: [1, 2, cols, cols + 1, cols * 2 + 1, cols * 2 + 2],
    3: [2, cols + 1, cols + 2, cols + 3, cols * 2 + 2, cols * 3 + 1, cols * 3 + 2, cols * 3 + 3]
  };
  const highlighted = shapes[difficulty];
  const result = sum(highlighted.map((index) => values[Math.floor(index / cols)][index % cols]));
  return book10Problem({
    prompt: "수 배열표에서 색칠한 모양 안의 수를 모두 더하세요.",
    subtype: "number-grid", visual: { values, highlighted }, answer: result,
    solution: `색칠한 칸의 수 ${highlighted.map((index) => values[Math.floor(index / cols)][index % cols]).join(", ")}을 더하면 ${result}입니다.`,
    family: "shaped-number-grid-sum-b10", meta: { difficulty, rows, cols, start, rowStep: 10, values, highlighted, result }
  });
}

function calendarBlockSumBook10({ difficulty = 2 }) {
  const center = randomInt(9, 22);
  const values = [center - 8, center - 7, center - 6, center - 1, center, center + 1, center + 6, center + 7, center + 8];
  const askCenter = difficulty === 3;
  const total = sum(values);
  return book10Problem({
    prompt: askCenter
      ? `달력의 3×3 칸에 적힌 날짜 합이 ${total}입니다. 가운데 날짜를 구하세요.`
      : "달력에서 색칠한 3×3 칸의 날짜 합을 구하세요.",
    subtype: "calendar-block", visual: { values: askCenter ? values.map((value, index) => index === 4 ? null : value) : values },
    answer: askCenter ? center : total,
    solution: askCenter ? `${total}을 9로 똑같이 가르면 가운데 날짜는 ${center}일입니다.` : `가운데 날짜 ${center}의 9배이므로 합은 ${total}입니다.`,
    family: "calendar-block-sum-b10", meta: { difficulty, center, values, askCenter, total, result: askCenter ? center : total }
  });
}

function allConsecutiveDecompositionsBook10({ difficulty = 2 }) {
  const targets = difficulty === 1 ? [15, 21, 27] : difficulty === 2 ? [45, 55, 63, 75] : [105, 120, 135, 165];
  const choices = targets.map((target) => ({ target, runs: consecutiveRuns(target) })).filter((item) => item.runs.length >= (difficulty === 1 ? 2 : 3));
  const { target, runs } = sample(choices);
  const answer = runs.map((values) => values.join("+" )).join(" / ");
  return book10Problem({
    prompt: `${target}을 두 개 이상의 연속수의 합으로 나타내는 방법을 모두 쓰세요.`,
    subtype: "consecutive-target", visual: { target, slots: runs.length }, answer,
    solution: `첫 수를 1부터 바꾸어 합을 확인하면 ${answer}입니다.`,
    family: "all-consecutive-decompositions-b10", meta: { difficulty, target, runs, result: answer }
  });
}

function consecutiveTensDigitConditionBook10({ difficulty = 2 }) {
  const starts = range(10, 96);
  const signatures = new Map();
  starts.forEach((start) => {
    const values = [start, start + 1, start + 2];
    const tensSum = sum(values.map((value) => Math.floor(value / 10)));
    const onesSum = sum(values.map((value) => value % 10));
    const key = `${tensSum}:${onesSum}`;
    if (!signatures.has(key)) signatures.set(key, []);
    signatures.get(key).push(values);
  });
  const unique = [...signatures.entries()].filter(([, values]) => values.length === 1 && values[0][0] >= (difficulty === 1 ? 10 : 20));
  const [key, [values]] = sample(unique);
  const [tensSum, onesSum] = key.split(":").map(Number);
  const answer = values.join(", ");
  return book10Problem({
    prompt: `연속한 두 자리 수 세 개의 십의 자리 숫자 합은 ${tensSum}, 일의 자리 숫자 합은 ${onesSum}입니다. 세 수를 쓰세요.`,
    subtype: "place-value-condition", visual: { tensSum, onesSum, count: 3 }, answer,
    solution: `십의 자리와 일의 자리 합을 함께 맞추는 연속수는 ${answer}입니다.`,
    family: "consecutive-tens-digit-condition-b10", meta: { difficulty, tensSum, onesSum, values, candidateCount: 1, result: answer }
  });
}

function consecutiveVerticalAdditionBook10({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 12 : 24, difficulty === 3 ? 87 : 64);
  const values = [start, start + 1, start + 2];
  const total = sum(values);
  const hiddenPlaces = difficulty === 1 ? [1, 0, 1] : difficulty === 2 ? [0, 1, 0] : [1, 0, 1];
  const hidden = values.map((value, index) => hiddenPlaces[index] === 1 ? Math.floor(value / 10) : value % 10);
  const shown = values.map((value, index) => {
    const digits = String(value).split("");
    digits[hiddenPlaces[index]] = "□";
    return digits.join("");
  });
  const result = sum(hidden);
  return book10Problem({
    prompt: "세로셈의 세 수는 연속수입니다. 네모에 들어갈 숫자의 합을 구하세요.",
    subtype: "vertical-addition", visual: { addends: shown, total }, answer: result,
    solution: `합 ${total}을 세 연속수로 나누면 ${values.join(", ")}입니다. 가려진 숫자 ${hidden.join(", ")}의 합은 ${result}입니다.`,
    family: "consecutive-vertical-addition-b10", meta: { difficulty, start, values, total, hiddenPlaces, hidden, result }
  });
}

function twoSymbolCoefficientWeightBook10({ difficulty = 2 }) {
  const firstValue = randomInt(2, difficulty === 3 ? 15 : 10);
  let secondValue = randomInt(2, difficulty === 3 ? 15 : 10);
  if (secondValue === firstValue) secondValue += 1;
  const equations = [[2, 3, 2 * firstValue + 3 * secondValue], [3, 2, 3 * firstValue + 2 * secondValue]];
  return book10Problem({
    prompt: "두 식을 모두 만족할 때 주황 블록 한 개의 무게를 구하세요.",
    subtype: "symbol-equations", visual: { symbols: ["주황", "파랑"], equations }, answer: firstValue,
    solution: `두 식의 차는 주황 블록 한 개와 파랑 블록 한 개의 차입니다. 이를 이용해 다시 넣으면 주황 블록은 ${firstValue}입니다.`,
    family: "two-symbol-coefficient-weight-b10", meta: { difficulty, firstValue, secondValue, equations, result: firstValue }
  });
}

function twoSymbolScoreDifferenceBook10({ difficulty = 2 }) {
  const firstValue = randomInt(3, difficulty === 3 ? 18 : 12);
  let secondValue = randomInt(1, firstValue - 1);
  if (firstValue === secondValue) secondValue -= 1;
  const equations = [[2, 1, 2 * firstValue + secondValue], [1, 2, firstValue + 2 * secondValue]];
  const result = firstValue - secondValue;
  return book10Problem({
    prompt: "두 과녁 점수의 차를 구하세요.",
    subtype: "symbol-equations", visual: { symbols: ["별", "원"], equations }, answer: result,
    solution: `첫째 식에서 둘째 식을 빼면 별 점수와 원 점수의 차가 바로 ${result}입니다.`,
    family: "two-symbol-score-difference-b10", meta: { difficulty, firstValue, secondValue, equations, result }
  });
}

function sharedTermEquationBook10({ difficulty = 2 }) {
  const values = [randomInt(2, 12), randomInt(2, 12), randomInt(2, difficulty === 3 ? 18 : 12)];
  const pair = values[0] + values[1];
  const all = sum(values);
  return book10Problem({
    prompt: "두 식에서 공통으로 묶인 두 도형을 이용해 세모의 값을 구하세요.",
    subtype: "shared-equations", visual: { pair, all }, answer: values[2],
    solution: `세 도형의 합 ${all}에서 공통인 두 도형의 합 ${pair}을 빼면 ${values[2]}입니다.`,
    family: "shared-term-equation-b10", meta: { difficulty, values, pair, all, result: values[2] }
  });
}

function containerDoubleContentBook10({ difficulty = 2 }) {
  const container = randomInt(2, 8);
  const content = randomInt(3, difficulty === 3 ? 18 : 12);
  const emptyTotal = container * 2;
  const fullTotal = (container + content) * 2;
  return book10Problem({
    prompt: "같은 통 두 개에 든 내용물의 무게는 모두 얼마인가요?",
    subtype: "containers", visual: { emptyTotal, fullTotal, count: 2 }, answer: content * 2,
    solution: `가득 찬 통 두 개 ${fullTotal}에서 빈 통 두 개 ${emptyTotal}을 빼면 내용물은 모두 ${content * 2}입니다.`,
    family: "container-double-content-b10", meta: { difficulty, container, content, emptyTotal, fullTotal, result: content * 2 }
  });
}

function threePairSumsValuesBook10({ difficulty = 2 }) {
  const values = shuffle(range(2, difficulty === 3 ? 16 : 12)).slice(0, 3);
  const pairSums = [values[0] + values[1], values[1] + values[2], values[0] + values[2]];
  const answer = `원=${values[0]}, 세모=${values[1]}, 네모=${values[2]}`;
  return book10Problem({
    prompt: "세 도형을 두 개씩 더한 값을 보고 각 도형의 수를 구하세요.",
    subtype: "pair-sums", visual: { labels: ["원", "세모", "네모"], pairSums }, answer,
    solution: `세 합을 모두 더해 둘로 가르면 세 도형의 합입니다. 여기서 각 짝의 합을 빼면 ${answer}입니다.`,
    family: "three-pair-sums-values-b10", meta: { difficulty, values, pairSums, result: answer }
  });
}

function closedPerimeterSpacingDifferenceBook10({ difficulty = 2 }) {
  const firstGap = sample(difficulty === 1 ? [2, 3, 4] : [3, 4, 5, 6]);
  const secondGap = sample([firstGap + 1, firstGap + 2, firstGap * 2]);
  let perimeter = firstGap * secondGap * randomInt(2, difficulty === 3 ? 5 : 3);
  if (perimeter > 180) perimeter = firstGap * secondGap * 2;
  const firstCount = perimeter / firstGap;
  const secondCount = perimeter / secondGap;
  const result = Math.abs(firstCount - secondCount);
  return book10Problem({
    prompt: `둘레가 ${perimeter}m인 운동장에 처음에는 ${firstGap}m마다, 다음에는 ${secondGap}m마다 깃발을 세웠습니다. 깃발 수의 차는 몇 개인가요?`,
    subtype: "spacing-ring", visual: { perimeter, firstGap, secondGap }, answer: `${result}개`,
    solution: `닫힌 둘레이므로 ${perimeter}을 간격으로 나눕니다. ${firstCount}개와 ${secondCount}개의 차는 ${result}개입니다.`,
    family: "closed-perimeter-spacing-difference-b10", meta: { difficulty, perimeter, firstGap, secondGap, firstCount, secondCount, result }
  });
}

function sameBudgetPriceCountBook10({ difficulty = 2 }) {
  const firstPrice = sample([4, 5, 6, 8]);
  const secondPrice = sample([2, 3, 4].filter((value) => value < firstPrice));
  const budget = firstPrice * secondPrice * randomInt(3, difficulty === 3 ? 9 : 6);
  const firstCount = budget / firstPrice;
  const secondCount = budget / secondPrice;
  const result = secondCount - firstCount;
  return book10Problem({
    prompt: `같은 돈으로 한 개에 ${firstPrice}천 원인 물건과 ${secondPrice}천 원인 물건을 살 수 있습니다. 싼 물건을 몇 개 더 살 수 있나요?`,
    subtype: "budget-table", visual: { budget, firstPrice, secondPrice }, answer: `${result}개`,
    solution: `${budget}천 원으로 각각 ${firstCount}개와 ${secondCount}개를 살 수 있으므로 ${result}개 더 살 수 있습니다.`,
    family: "same-budget-price-count-b10", meta: { difficulty, budget, firstPrice, secondPrice, firstCount, secondCount, result }
  });
}

function newParticipantsEqualShareBook10({ difficulty = 2 }) {
  const oldPeople = randomInt(3, difficulty === 3 ? 9 : 7);
  const added = randomInt(1, difficulty === 1 ? 2 : 4);
  const newPeople = oldPeople + added;
  const newShare = randomInt(2, difficulty === 3 ? 8 : 6);
  const total = newPeople * newShare;
  if (total % oldPeople !== 0) return newParticipantsEqualShareBook10({ difficulty });
  const oldShare = total / oldPeople;
  return book10Problem({
    prompt: `${oldPeople}명이 물건을 똑같이 나누려다 ${added}명이 더 왔습니다. 한 사람당 ${newShare}개씩 가지면 처음에는 한 사람당 몇 개씩 가지려 했나요?`,
    subtype: "share-change", visual: { oldPeople, added, newPeople, oldShare, newShare }, answer: `${oldShare}개`,
    solution: `전체는 ${newPeople} × ${newShare} = ${total}개이고, 이를 처음 ${oldPeople}명에게 똑같이 나누면 ${oldShare}개입니다.`,
    family: "new-participants-equal-share-b10", meta: { difficulty, oldPeople, added, newPeople, oldShare, newShare, total, result: oldShare }
  });
}

function catchUpGrowingAmountBook10({ difficulty = 2 }) {
  const days = randomInt(3, difficulty === 3 ? 12 : 8);
  const slowRate = randomInt(2, 6);
  const rateGap = randomInt(1, difficulty === 3 ? 5 : 3);
  const fastRate = slowRate + rateGap;
  const slowStart = randomInt(3, 18);
  const fastStart = slowStart - rateGap * days;
  if (fastStart < 0) return catchUpGrowingAmountBook10({ difficulty });
  return book10Problem({
    prompt: `민수는 처음 ${slowStart}개에서 하루에 ${slowRate}개씩, 지우는 처음 ${fastStart}개에서 하루에 ${fastRate}개씩 모읍니다. 두 사람의 수가 같아지는 것은 며칠 뒤인가요?`,
    subtype: "catch-up-table", visual: { labels: ["민수", "지우"], starts: [slowStart, fastStart], changes: [slowRate, fastRate], unit: "개씩 늘어남" }, answer: `${days}일 뒤`,
    solution: `처음 차이는 ${slowStart - fastStart}개이고 하루마다 ${rateGap}개씩 줄어드므로 ${days}일 뒤에 같습니다.`,
    family: "catch-up-growing-amount-b10", meta: { difficulty, days, slowRate, fastRate, rateGap, slowStart, fastStart, result: days }
  });
}

function catchUpShrinkingAmountBook10({ difficulty = 2 }) {
  const days = randomInt(2, difficulty === 3 ? 10 : 7);
  const slowRate = randomInt(1, 3);
  const rateGap = randomInt(1, 3);
  const fastRate = slowRate + rateGap;
  const shortStart = randomInt(12, 25);
  const longStart = shortStart + rateGap * days;
  const equal = shortStart - slowRate * days;
  if (equal <= 0) return catchUpShrinkingAmountBook10({ difficulty });
  return book10Problem({
    prompt: `짧은 초는 ${shortStart}cm에서 하루에 ${slowRate}cm씩, 긴 초는 ${longStart}cm에서 하루에 ${fastRate}cm씩 짧아집니다. 길이가 같아지는 것은 며칠 뒤인가요?`,
    subtype: "catch-up-table", visual: { labels: ["짧은 초", "긴 초"], starts: [shortStart, longStart], changes: [-slowRate, -fastRate], unit: "cm씩 짧아짐" }, answer: `${days}일 뒤`,
    solution: `처음 차이는 ${longStart - shortStart}cm이고 하루마다 ${rateGap}cm씩 줄어드므로 ${days}일 뒤에 같습니다.`,
    family: "catch-up-shrinking-amount-b10", meta: { difficulty, days, slowRate, fastRate, rateGap, shortStart, longStart, equal, result: days }
  });
}

function catchUpDistanceBook10({ difficulty = 2 }) {
  const minutes = randomInt(3, difficulty === 3 ? 12 : 8);
  const slowSpeed = randomInt(3, 7);
  const speedGap = randomInt(1, difficulty === 3 ? 5 : 3);
  const fastSpeed = slowSpeed + speedGap;
  const distance = speedGap * minutes;
  return book10Problem({
    prompt: `앞사람은 1분에 ${slowSpeed}m, 뒷사람은 1분에 ${fastSpeed}m를 갑니다. 두 사람 사이가 ${distance}m일 때 몇 분 뒤에 따라잡나요?`,
    subtype: "distance-line", visual: { distance, slowSpeed, fastSpeed }, answer: `${minutes}분 뒤`,
    solution: `1분마다 ${fastSpeed} - ${slowSpeed} = ${speedGap}m씩 가까워지므로 ${distance}m를 따라잡는 데 ${minutes}분이 걸립니다.`,
    family: "catch-up-distance-b10", meta: { difficulty, minutes, slowSpeed, fastSpeed, speedGap, distance, result: minutes }
  });
}

function fourObjectWeightSystemBook10({ difficulty = 2 }) {
  const values = shuffle(range(2, difficulty === 3 ? 14 : 10)).slice(0, 4);
  const equations = [
    [1, 1, 0, 0, values[0] + values[1]],
    [0, 1, 1, 0, values[1] + values[2]],
    [0, 0, 1, 1, values[2] + values[3]],
    [1, 0, 0, 2, values[0] + values[3] * 2]
  ];
  const answer = ["원", "세모", "네모", "별"].map((label, index) => `${label}=${values[index]}`).join(", ");
  return book10Problem({
    prompt: "네 도형의 무게가 모두 다를 때 각 도형의 무게를 구하세요.",
    subtype: "four-weight-system", visual: { labels: ["원", "세모", "네모", "별"], equations }, answer,
    solution: `각 식에서 공통 도형을 차례로 없애고 값을 다시 넣으면 ${answer}입니다.`,
    family: "four-object-weight-system-b10", meta: { difficulty, values, equations, result: answer }
  });
}

function delayedStartCatchUpBook10({ difficulty = 2 }) {
  const delay = randomInt(2, difficulty === 3 ? 6 : 4);
  const afterStart = randomInt(2, difficulty === 3 ? 8 : 5);
  const totalMonths = delay + afterStart;
  const divisor = (() => {
    for (let value = Math.min(totalMonths, afterStart); value >= 1; value -= 1) if (totalMonths % value === 0 && afterStart % value === 0) return value;
    return 1;
  })();
  const unit = randomInt(2, 5);
  const earlyRate = afterStart / divisor * unit;
  const lateRate = totalMonths / divisor * unit;
  return book10Problem({
    prompt: `민수는 매달 ${earlyRate}만 원씩 저금하고, 지우는 ${delay}개월 뒤부터 매달 ${lateRate}만 원씩 저금합니다. 민수가 시작한 뒤 몇 개월째에 두 사람의 저금액이 같아지나요?`,
    subtype: "delayed-catch-up", visual: { delay, earlyRate, lateRate }, answer: `${totalMonths}개월째`,
    solution: `${totalMonths}개월째 민수는 ${earlyRate * totalMonths}만 원, 지우는 ${lateRate * afterStart}만 원으로 같아집니다.`,
    family: "delayed-start-catch-up-b10", meta: { difficulty, delay, afterStart, totalMonths, earlyRate, lateRate, result: totalMonths }
  });
}

function repeatedDigitNumberCountBook10({ difficulty = 2 }) {
  const length = difficulty === 1 ? 2 : 3;
  const digits = shuffle(range(0, 9)).slice(0, difficulty === 3 ? 5 : 4).sort((a, b) => a - b);
  if (!digits.includes(0) && difficulty >= 2) digits[0] = 0;
  const candidates = Array.from({ length: 10 ** length }, (_, value) => String(value).padStart(length, "0"))
    .filter((text) => text[0] !== "0" && [...text].every((digit) => digits.includes(Number(digit))));
  return book10Problem({
    prompt: `숫자 카드를 여러 번 사용할 수 있습니다. ${length}자리 수를 모두 몇 개 만들 수 있나요?`,
    subtype: "digit-slots", visual: { digits, length, repeat: true }, answer: `${candidates.length}개`,
    solution: `첫 자리에는 0을 놓지 않고, 각 자리에 놓을 수 있는 카드를 차례로 세면 ${candidates.length}개입니다.`,
    family: "repeated-digit-number-count-b10", meta: { difficulty, length, digits, candidates, result: candidates.length }
  });
}

function binarySwitchCountBook10({ difficulty = 2 }) {
  const switchCount = sample(difficulty === 1 ? [2, 3, 4] : difficulty === 2 ? [3, 4, 5] : [4, 5, 6]);
  const excludeAllOff = difficulty === 1 ? false : difficulty === 3 ? true : Math.random() < 0.5;
  const states = Array.from({ length: 2 ** switchCount }, (_, value) => value.toString(2).padStart(switchCount, "0"));
  const candidates = states.filter((state) => !excludeAllOff || state.includes("1"));
  return book10Problem({
    prompt: `${switchCount}개의 전등을 각각 켜거나 끌 수 있습니다.${excludeAllOff ? " 모두 끈 경우는 빼고" : ""} 서로 다른 모습은 몇 가지인가요?`,
    subtype: "switches", visual: { switchCount, excludeAllOff }, answer: `${candidates.length}가지`,
    solution: `전등을 하나 늘릴 때마다 앞의 모습마다 켠 모습과 끈 모습이 생깁니다.${excludeAllOff ? " 모두 끈 한 가지를 빼면" : " 따라서"} ${candidates.length}가지입니다.`,
    family: "binary-switch-count-b10", meta: { difficulty, switchCount, excludeAllOff, candidates, result: candidates.length }
  });
}

function monotoneNumbers(digits, length, direction) {
  return combinations([...digits].sort((a, b) => a - b), length)
    .map((chosen) => direction === "increasing" ? chosen : [...chosen].reverse())
    .filter((chosen) => chosen[0] !== 0)
    .map((chosen) => Number(chosen.join("")))
    .sort((a, b) => a - b);
}

function monotoneDigitEnumerationBook10({ difficulty = 2 }) {
  const length = difficulty === 1 ? 2 : 3;
  const digits = shuffle(range(difficulty === 3 ? 0 : 1, 9)).slice(0, difficulty === 3 ? 6 : 5).sort((a, b) => a - b);
  const direction = sample(["increasing", "decreasing"]);
  const candidates = monotoneNumbers(digits, length, direction);
  return book10Problem({
    prompt: `왼쪽부터 숫자가 ${direction === "increasing" ? "점점 커지는" : "점점 작아지는"} ${length}자리 수는 모두 몇 개인가요?`,
    subtype: "digit-slots", visual: { digits, length, direction }, answer: `${candidates.length}개`,
    solution: `맨 앞 숫자부터 작은 순서로 정하고 뒤에 올 수 있는 카드만 이어 적으면 모두 ${candidates.length}개입니다.`,
    family: "monotone-digit-enumeration-b10", meta: { difficulty, length, digits, direction, candidates, result: candidates.length }
  });
}

function monotoneDigitRankBook10({ difficulty = 2 }) {
  const length = 3;
  const digits = shuffle(range(1, 9)).slice(0, difficulty === 3 ? 7 : 6).sort((a, b) => a - b);
  const direction = sample(["increasing", "decreasing"]);
  const candidates = monotoneNumbers(digits, length, direction);
  const rank = randomInt(2, Math.max(2, candidates.length - 1));
  const result = candidates[rank - 1];
  return book10Problem({
    prompt: `왼쪽부터 숫자가 ${direction === "increasing" ? "점점 커지는" : "점점 작아지는"} 세 자리 수를 작은 수부터 쓸 때 ${rank}번째 수를 구하세요.`,
    subtype: "digit-slots", visual: { digits, length, direction, rank }, answer: result,
    solution: `첫 자리부터 가능한 카드를 차례로 정해 작은 순서로 쓰면 ${rank}번째 수는 ${result}입니다.`,
    family: "monotone-digit-rank-b10", meta: { difficulty, length, digits, direction, candidates, rank, result }
  });
}

function distinctCardTargetSumBook10({ difficulty = 2 }) {
  const cardCount = difficulty === 1 ? 5 : difficulty === 2 ? 6 : 7;
  const pickCount = difficulty === 3 ? 4 : 3;
  const cards = shuffle(range(1, 12)).slice(0, cardCount).sort((a, b) => a - b);
  const grouped = new Map();
  combinations(cards, pickCount).forEach((chosen) => {
    const total = sum(chosen);
    if (!grouped.has(total)) grouped.set(total, []);
    grouped.get(total).push(chosen);
  });
  const unique = [...grouped.entries()].filter(([, options]) => options.length === 1);
  if (!unique.length) return distinctCardTargetSumBook10({ difficulty });
  const [target, [chosen]] = sample(unique);
  const answer = chosen.join(", ");
  return book10Problem({
    prompt: `서로 다른 카드 ${pickCount}장을 골라 합이 ${target}이 되게 하세요.`,
    subtype: "target-cards", visual: { cards, pickCount, target }, answer,
    solution: `작은 카드부터 짝을 바꾸어 합을 확인하면 ${answer}만 조건에 맞습니다.`,
    family: "distinct-card-target-sum-b10", meta: { difficulty, cards, pickCount, target, solutions: [chosen], result: answer }
  });
}

function digitSumCandidates(target) {
  return range(100, 999).filter((value) => [...String(value)].reduce((total, digit) => total + Number(digit), 0) === target);
}

function digitSumThreeDigitCountBook10({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 4 : 7, difficulty === 3 ? 22 : 16);
  const candidates = digitSumCandidates(target);
  return book10Problem({
    prompt: `각 자리 숫자의 합이 ${target}인 세 자리 수는 모두 몇 개인가요?`,
    subtype: "place-value-sum", visual: { target, rank: null }, answer: `${candidates.length}개`,
    solution: `백의 자리부터 가능한 수를 정하고 남은 합을 십의 자리와 일의 자리에 나누어 쓰면 ${candidates.length}개입니다.`,
    family: "digit-sum-three-digit-count-b10", meta: { difficulty, target, candidates, result: candidates.length }
  });
}

function digitSumRankedNumberBook10({ difficulty = 2 }) {
  const target = randomInt(6, difficulty === 3 ? 20 : 15);
  const candidates = digitSumCandidates(target);
  const rank = randomInt(2, Math.min(candidates.length - 1, difficulty === 3 ? 18 : 10));
  const result = candidates[rank - 1];
  return book10Problem({
    prompt: `각 자리 숫자의 합이 ${target}인 세 자리 수를 작은 수부터 쓸 때 ${rank}번째 수를 구하세요.`,
    subtype: "place-value-sum", visual: { target, rank }, answer: result,
    solution: `백의 자리, 십의 자리 순서로 작은 수부터 적으면 ${rank}번째는 ${result}입니다.`,
    family: "digit-sum-ranked-number-b10", meta: { difficulty, target, candidates, rank, result }
  });
}

function threeDigitStepCandidates(limit = 999) {
  return range(100, limit).filter((value) => {
    const [a, b, c] = String(value).split("").map(Number);
    return a - b === b - c && a !== b;
  });
}

function threeDigitStepCountBook10({ difficulty = 2 }) {
  const limit = sample(difficulty === 1 ? [450, 500, 550] : difficulty === 2 ? [650, 700, 750] : [850, 900, 999]);
  const candidates = threeDigitStepCandidates(limit);
  return book10Problem({
    prompt: `이웃한 자리 숫자의 차가 같은 세 자리 수 중 ${limit} 이하인 수는 모두 몇 개인가요?`,
    subtype: "step-digits", visual: { limit }, answer: `${candidates.length}개`,
    solution: `백의 자리와 십의 자리 차를 정하고 같은 차로 일의 자리를 이어 쓰면 ${candidates.length}개입니다.`,
    family: "three-digit-step-count-b10", meta: { difficulty, limit, candidates, result: candidates.length }
  });
}

function monotoneDigitCountBook10({ difficulty = 2 }) {
  const limit = sample(difficulty === 1 ? [400, 500, 600] : difficulty === 2 ? [600, 700, 800] : [800, 900, 950]);
  const candidates = range(100, limit - 1).filter((value) => {
    const [a, b, c] = String(value).split("").map(Number);
    return a > b && b > c;
  });
  return book10Problem({
    prompt: `백의 자리부터 숫자가 점점 작아지는 세 자리 수 중 ${limit}보다 작은 수는 모두 몇 개인가요?`,
    subtype: "step-digits", visual: { limit, direction: "decreasing" }, answer: `${candidates.length}개`,
    solution: `백의 자리부터 정한 뒤 그보다 작은 숫자만 다음 자리에 놓아 세면 ${candidates.length}개입니다.`,
    family: "monotone-digit-count-b10", meta: { difficulty, limit, candidates, result: candidates.length }
  });
}

function routeProductCountBook10({ difficulty = 2 }) {
  const stageCount = difficulty === 1 ? 2 : 3;
  const choices = Array.from({ length: stageCount }, () => randomInt(2, difficulty === 3 ? 4 : 3));
  const result = choices.reduce((total, value) => total * value, 1);
  return book10Problem({
    prompt: "출발지에서 도착지까지 각 구간의 길 가운데 하나씩 고를 때 서로 다른 길은 모두 몇 개인가요?",
    subtype: "route-stages", visual: { choices }, answer: `${result}가지`,
    solution: `첫 구간의 각 길마다 다음 구간의 길을 차례로 이어 세면 모두 ${result}가지입니다.`,
    family: "route-product-count-b10", meta: { difficulty, choices, result }
  });
}

function lineupCountBook10({ difficulty = 2 }) {
  const people = randomInt(difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5, difficulty === 1 ? 5 : 6);
  const fixedFirst = difficulty === 3 ? Math.random() < 0.7 : difficulty === 2 && Math.random() < 0.35;
  const active = fixedFirst ? people - 1 : people;
  let result = 1;
  for (let value = active; value >= 1; value -= 1) result *= value;
  return book10Problem({
    prompt: `${people}명의 어린이가 한 줄로 섭니다.${fixedFirst ? " 민수는 맨 앞에 설 때" : ""} 서로 다른 순서는 모두 몇 가지인가요?`,
    subtype: "lineup-slots", visual: { people, fixedFirst }, answer: `${result}가지`,
    solution: `첫 자리부터 설 수 있는 사람 수를 하나씩 줄여 가며 세면 ${result}가지입니다.`,
    family: "lineup-count-b10", meta: { difficulty, people, fixedFirst, active, result }
  });
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

const BASEBALL_CANDIDATES = permutations(range(1, 9), 3);

function numberBaseballBook10({ difficulty = 2 }) {
  const secret = sample(BASEBALL_CANDIDATES);
  const decoys = range(1, 9).filter((digit) => !secret.includes(digit));
  const [x, y, z] = decoys;
  const guesses = difficulty === 3
    ? [[secret[1], secret[0], x], [x, secret[2], secret[1]], [secret[0], x, secret[2]]]
    : [[secret[0], x, y], [x, secret[1], y], [x, y, secret[2]]];
  if (difficulty === 1) guesses.unshift([x, y, z]);
  const clues = guesses.map((guess) => {
    const [strikes, balls] = baseballScore(secret, guess);
    return { guess, strikes, balls };
  });
  const remaining = BASEBALL_CANDIDATES.filter((candidate) => clues.every((clue) => {
    const score = baseballScore(candidate, clue.guess);
    return score[0] === clue.strikes && score[1] === clue.balls;
  }));
  if (remaining.length !== 1) return numberBaseballBook10({ difficulty });
  const answer = secret.join("");
  return book10Problem({
    prompt: "서로 다른 숫자 세 개로 만든 비밀 수를 찾으세요. 자리와 숫자가 모두 맞으면 S, 숫자만 맞으면 B입니다.",
    subtype: "number-baseball", visual: { clues }, answer,
    solution: `각 단서와 맞지 않는 수를 차례로 지우면 남는 비밀 수는 ${answer}입니다.`,
    family: "number-baseball-b10", meta: { difficulty, secret, clues, candidateCount: 1, result: answer }
  });
}

function mostFrequentDigitBook10({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const end = randomInt(difficulty === 1 ? 18 : 35, difficulty === 3 ? 240 : 130);
    const counts = range(0, 9).map((digit) => countDigit(1, end, digit));
    const maximum = Math.max(...counts);
    const winners = counts.map((count, digit) => ({ count, digit })).filter((item) => item.count === maximum);
    if (winners.length !== 1) continue;
    const result = winners[0].digit;
    return book10Problem({
      prompt: `1부터 ${end}까지의 수를 모두 쓸 때 가장 많이 쓰이는 숫자는 무엇인가요?`,
      subtype: "digit-range", visual: { from: 1, to: end, digit: null }, answer: result,
      solution: `각 숫자가 일의 자리와 십의 자리에 쓰인 횟수를 나누어 세면 ${result}이 가장 많이 쓰입니다.`,
      family: "most-frequent-digit-b10", meta: { difficulty, from: 1, to: end, counts, maximum, winnerCount: 1, result }
    });
  }
  return mostFrequentDigitBook10({ difficulty: 1 });
}

function digitOccurrenceRangeBook10({ difficulty = 2 }) {
  const from = randomInt(difficulty === 1 ? 1 : 12, difficulty === 3 ? 120 : 70);
  const to = from + randomInt(difficulty === 1 ? 20 : 35, difficulty === 3 ? 120 : 70);
  const digit = randomInt(difficulty === 1 ? 1 : 0, 9);
  const result = countDigit(from, to, digit);
  return book10Problem({
    prompt: `${from}부터 ${to}까지의 수를 모두 쓸 때 숫자 ${digit}은 모두 몇 번 쓰이나요?`,
    subtype: "digit-range", visual: { from, to, digit }, answer: `${result}번`,
    solution: `숫자 ${digit}이 각 자리에 오는 경우를 나누어 세면 모두 ${result}번입니다.`,
    family: "digit-occurrence-range-b10", meta: { difficulty, from, to, digit, result }
  });
}

function positiveRangeNumberDigitCountBook10({ difficulty = 2 }) {
  const from = randomInt(1, difficulty === 3 ? 140 : 70);
  const to = from + randomInt(difficulty === 1 ? 15 : 30, difficulty === 3 ? 130 : 80);
  const result = writtenDigits(from, to);
  return book10Problem({
    prompt: `${from}부터 ${to}까지의 수를 모두 이어 쓸 때 숫자는 모두 몇 개 쓰이나요?`,
    subtype: "digit-range", visual: { from, to, digit: "전체" }, answer: `${result}개`,
    solution: `한 자리, 두 자리, 세 자리 구간으로 나누어 숫자 수를 더하면 ${result}개입니다.`,
    family: "positive-range-number-digit-count-b10", meta: { difficulty, from, to, result }
  });
}

export const BOOK10_GENERATORS = Object.freeze({
  multiMethodMultiplicationBook10,
  sameTensComplementProductBook10,
  sameOnesComplementProductBook10,
  factorPairDivisorCountBook10,
  multiCountConsecutiveDecompositionBook10,
  calendarConsecutiveSumWeekdayBook10,
  consecutivePageRangeBook10,
  sameParityConsecutiveSumBook10,
  rectangularNumberGridSumBook10,
  shapedNumberGridSumBook10,
  calendarBlockSumBook10,
  allConsecutiveDecompositionsBook10,
  consecutiveTensDigitConditionBook10,
  consecutiveVerticalAdditionBook10,
  twoSymbolCoefficientWeightBook10,
  twoSymbolScoreDifferenceBook10,
  sharedTermEquationBook10,
  containerDoubleContentBook10,
  threePairSumsValuesBook10,
  closedPerimeterSpacingDifferenceBook10,
  sameBudgetPriceCountBook10,
  newParticipantsEqualShareBook10,
  catchUpGrowingAmountBook10,
  catchUpShrinkingAmountBook10,
  catchUpDistanceBook10,
  fourObjectWeightSystemBook10,
  delayedStartCatchUpBook10,
  repeatedDigitNumberCountBook10,
  binarySwitchCountBook10,
  monotoneDigitEnumerationBook10,
  monotoneDigitRankBook10,
  distinctCardTargetSumBook10,
  digitSumThreeDigitCountBook10,
  digitSumRankedNumberBook10,
  threeDigitStepCountBook10,
  monotoneDigitCountBook10,
  routeProductCountBook10,
  lineupCountBook10,
  numberBaseballBook10,
  mostFrequentDigitBook10,
  digitOccurrenceRangeBook10,
  positiveRangeNumberDigitCountBook10
});
