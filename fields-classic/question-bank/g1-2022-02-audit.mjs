import { EXAMS, TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";

const RUNS = 3000;
const requireVerified = false;
const failures = new Set();
const typeById = new Map(TYPES.map((type) => [type.id, type]));
const expected = [
  [1, "magic-square-three-complete", "magicSquareThreeComplete"],
  [2, "g1-winter-shared-box-multiplication", "g1WinterSharedBoxMultiplication"],
  [3, "g1-winter-shape-sum-target-row", "g1WinterShapeSumGridTargetRow"],
  [4, "g1-winter-opponent-step-game", "g1WinterOpponentStepGame"],
  [5, "g1-winter-sudoku-four-full", "g1WinterSudokuFourFullGrid"],
  [6, "g1-repeated-digit-addition", "g1RepeatedDigitAddition"],
  [7, "g1-stacked-shape-dual-cycle", "g1StackedShapeDualCycle"],
  [8, "g1-winter-two-digit-odd-sum-order", "g1WinterTwoDigitOddSumOrder"],
  [9, "total-difference", "totalDifference"],
  [10, "g1-winter-product-placement-four", "g1WinterProductPlacementFourGrid"],
  [11, "g1-height-order-four", "g1HeightOrderFour"],
  [12, "g1-front-back-between", "g1FrontBackBetween"],
  [13, "g1-winter-three-digit-cards-above", "g1WinterThreeDigitCardsAbove"],
  [14, "g1-winter-three-balance-substitution", "g1WinterThreeBalanceSubstitution"],
  [15, "g1-winter-three-cards-parity-chain", "g1WinterThreeCardsParityChain"],
  [16, "set-union-count", "setUnionCount"],
  [17, "g1-polygon-stone-rearrangement", "g1PolygonStoneRearrangement"],
  [18, "g1-summer-opposite-step-sequences", "g1SummerOppositeStepSequences"],
  [19, "g1-summer-orange-ratio-distribution", "g1SummerOrangeRatioDistribution"],
  [20, "g1-odd-even-sum-difference", "g1OddEvenSumDifference"]
];
const visualQuestions = new Set(expected.map(([number]) => number).filter((number) => ![9, 16].includes(number)));
const PRODUCT_SHADED_INDICES = [0, 1, 6, 7, 9, 11, 12, 14];

function fail(message) {
  failures.add(message);
}

function check(number, difficulty, condition, label) {
  if (!condition) fail(`${number}번 난이도 ${difficulty} ${label}`);
}

function sameArray(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((value, index) => value === right[index]);
}

function text(value) {
  return String(value ?? "").trim();
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function checkMapping() {
  const exam = EXAMS.find((item) => item.id === "g1-2022-02");
  if (!exam) {
    fail("초1 4차 시험지 등록 오류");
    return;
  }
  for (const [number, typeId, generator] of expected) {
    const question = exam.questions.find((item) => item.number === number);
    const type = typeById.get(typeId);
    if (!question || question.typeId !== typeId || !type || type.generator !== generator || !GENERATORS[generator]) {
      fail(`${number}번 유형 또는 생성기 연결 오류`);
    }
    if (requireVerified && !question?.verified) fail(`${number}번 검수 상태 오류`);
  }
}

function checkCore(number, difficulty, problem) {
  check(number, difficulty, problem && text(problem.prompt) && text(problem.answer) && text(problem.solution), "문제·정답·풀이 누락");
  if (visualQuestions.has(number)) check(number, difficulty, text(problem?.visual?.kind), "그림 데이터 누락");
}

function checkMagicSquare(problem, difficulty) {
  const { solution, lineSum } = problem.meta || {};
  const rows = Array.isArray(solution) ? solution : [];
  const validGrid = rows.length === 3 && rows.every((row) => Array.isArray(row) && row.length === 3 && row.every(Number.isFinite));
  const lines = validGrid
    ? [...rows.map(sum), ...[0, 1, 2].map((column) => sum(rows.map((row) => row[column]))), sum([solution[0][0], solution[1][1], solution[2][2]]), sum([solution[0][2], solution[1][1], solution[2][0]])]
    : [];
  const answer = validGrid ? solution.map((row) => row.join(" ")).join(" / ") : "";
  check(1, difficulty, validGrid && lines.every((value) => value === lines[0]) && lines[0] === lineSum && problem.answer === answer, "마방진 계산 오류");
}

function checkSharedBox(problem, difficulty) {
  const { left, shared, right, topProduct, bottomProduct, answer } = problem.meta || {};
  check(2, difficulty, left * shared === topProduct && shared * right === bottomProduct && answer === left && problem.answer === String(left), "공통 상자 곱셈 오류");
}

function checkShapeSum(problem, difficulty) {
  const { values, grid, rowSums, columnSums, targetRow, uniqueSolutions, answer } = problem.meta || {};
  const numericGrid = Array.isArray(grid) && grid.map((row) => Array.isArray(row) && row.map((symbol) => values?.[symbol]));
  const validGrid = Array.isArray(numericGrid) && numericGrid.length === 4 && numericGrid.every((row) => Array.isArray(row) && row.length === 4 && row.every(Number.isFinite));
  const calculatedRows = validGrid ? numericGrid.map(sum) : [];
  const calculatedColumns = validGrid ? [0, 1, 2, 3].map((column) => sum(numericGrid.map((row) => row[column]))) : [];
  check(3, difficulty, validGrid && sameArray(rowSums, calculatedRows) && sameArray(columnSums, calculatedColumns) && answer === calculatedRows[targetRow] && problem.answer === String(answer) && Array.isArray(uniqueSolutions) && uniqueSolutions.length === 1, "도형 합 표 계산 오류");
}

function checkStepGame(problem, difficulty) {
  const { start, wins, losses, aEnd, bEnd, limit, answer } = problem.meta || {};
  check(4, difficulty, aEnd === start + wins - losses && bEnd === start - wins + losses && aEnd >= 1 && aEnd <= limit && bEnd >= 1 && bEnd <= limit && answer === bEnd && problem.answer === `${bEnd}번째 칸`, "상대 이동 계산 오류");
}

function checkSudoku(problem, difficulty) {
  const { puzzle, solution, solutionCount, answer } = problem.meta || {};
  const validGrid = Array.isArray(solution) && solution.length === 4 && solution.every((row) => Array.isArray(row) && row.length === 4);
  const expectedLine = [1, 2, 3, 4].join(",");
  const rows = validGrid ? solution : [];
  const columns = validGrid ? [0, 1, 2, 3].map((column) => solution.map((row) => row[column])) : [];
  const blocks = validGrid ? [0, 2].flatMap((top) => [0, 2].map((left) => [solution[top][left], solution[top][left + 1], solution[top + 1][left], solution[top + 1][left + 1]])) : [];
  const cluesMatch = validGrid && Array.isArray(puzzle) && puzzle.length === 4 && puzzle.every((row, rowIndex) => Array.isArray(row) && row.length === 4 && row.every((value, column) => value === null || value === solution[rowIndex][column]));
  const formatted = validGrid ? solution.map((row) => row.join(" ")).join(" / ") : "";
  check(5, difficulty, validGrid && [...rows, ...columns, ...blocks].every((line) => [...line].sort((a, b) => a - b).join(",") === expectedLine) && cluesMatch && solutionCount === 1 && answer === formatted && problem.answer === formatted, "스도쿠 계산 오류");
}

function checkRepeatedDigitAddition(problem, difficulty) {
  const { tens, ones, addend, result, ask, answer } = problem.meta || {};
  const expectedAnswer = ask === "ones" ? `□=${ones}` : ask === "sum" ? String(tens + ones) : `○=${tens}, □=${ones}`;
  const metaAnswer = ask === "sum" ? tens + ones : ones;
  check(6, difficulty, addend === tens * 10 + ones && addend * 2 === result && tens !== ones && answer === metaAnswer && problem.answer === expectedAnswer, "반복 숫자 덧셈 오류");
}

function checkDualCycle(problem, difficulty) {
  const { shapes, counts, target, shape, count } = problem.meta || {};
  const expectedShape = Array.isArray(shapes) ? shapes[(target - 1) % shapes.length] : undefined;
  const expectedCount = Array.isArray(counts) ? counts[(target - 1) % counts.length] : undefined;
  check(7, difficulty, shape === expectedShape && count === expectedCount && problem.answer === `${shape} ${count}개`, "이중 주기 계산 오류");
}

function checkTwoDigit(problem, difficulty) {
  const { digitSum, minimumTens, gap, candidates, candidateCount, answer } = problem.meta || {};
  const expected = [];
  for (let tens = 1; tens <= 9; tens += 1) for (const ones of [1, 3, 5, 7, 9]) {
    if (tens <= ones || tens + ones !== digitSum || (minimumTens && tens < minimumTens) || (gap && tens - ones !== gap)) continue;
    expected.push({ tens, ones, number: tens * 10 + ones });
  }
  check(8, difficulty, candidateCount === 1 && JSON.stringify(candidates) === JSON.stringify(expected) && answer === expected[0]?.number && problem.answer === String(answer), "두 자리 수 조건 오류");
}

function checkTotalDifference(problem, difficulty) {
  const { older, younger, sum: total, gap } = problem.meta || {};
  check(9, difficulty, older + younger === total && older - younger === gap && problem.answer === `${older}살`, "합과 차 계산 오류");
}

function checkProductPlacement(problem, difficulty) {
  const { shadedIndices, placement, rowProducts, columnProducts, solutionCount, answer } = problem.meta || {};
  const byIndex = new Map(PRODUCT_SHADED_INDICES.map((index, order) => [index, placement?.[order]]));
  const rows = [0, 1, 2, 3].map((row) => PRODUCT_SHADED_INDICES.filter((index) => Math.floor(index / 4) === row).map((index) => byIndex.get(index)));
  const columns = [0, 1, 2, 3].map((column) => PRODUCT_SHADED_INDICES.filter((index) => index % 4 === column).map((index) => byIndex.get(index))).filter((line) => line.length);
  const calculatedRows = rows.map((line) => line.reduce((product, value) => product * value, 1));
  const calculatedColumns = columns.map((line) => line.reduce((product, value) => product * value, 1));
  const formatted = rows.map((line) => line.join(" ")).join(" / ");
  check(10, difficulty, sameArray(shadedIndices, PRODUCT_SHADED_INDICES) && Array.isArray(placement) && placement.length === 8 && new Set(placement).size === 8 && sameArray([...placement].sort((a, b) => a - b), [2, 3, 4, 5, 6, 7, 8, 9]) && sameArray(rowProducts, calculatedRows) && sameArray(columnProducts, calculatedColumns) && solutionCount === 1 && answer === formatted && problem.answer === formatted, "곱 배치 계산 오류");
}

function checkHeight(problem, difficulty) {
  const { names, ordered, targetRank, answer, count } = problem.meta || {};
  check(11, difficulty, count === 4 && Array.isArray(names) && names.length === 4 && new Set(names).size === 4 && Array.isArray(ordered) && ordered.length === 4 && new Set(ordered).size === 4 && answer === ordered[targetRank - 1] && problem.answer === answer, "네 사람 키 순서 오류");
}

function checkFrontBack(problem, difficulty) {
  const { total, firstPosition, secondPosition, firstFromBack, secondFromBack, between } = problem.meta || {};
  check(12, difficulty, firstFromBack === total - firstPosition + 1 && secondFromBack === total - secondPosition + 1 && between === Math.abs(firstPosition - secondPosition) - 1 && between >= 0 && problem.answer === `${between}명`, "앞뒤 순서 계산 오류");
}

function checkCards(problem, difficulty) {
  const { digits, threshold, numbers, above, desiredAbove, answer } = problem.meta || {};
  const calculated = [];
  if (Array.isArray(digits)) for (const first of digits) for (const second of digits) for (const third of digits) {
    if (first === 0 || first === second || first === third || second === third) continue;
    calculated.push(first * 100 + second * 10 + third);
  }
  calculated.sort((a, b) => a - b);
  const calculatedAbove = calculated.filter((number) => number > threshold);
  check(13, difficulty, Array.isArray(digits) && digits.length === 3 && new Set(digits).size === 3 && sameArray(numbers, calculated) && sameArray(above, calculatedAbove) && desiredAbove === calculatedAbove.length && answer === calculatedAbove.length && problem.answer === `${answer}개`, "세 자리 카드 열거 오류");
}

function checkBalance(problem, difficulty) {
  const { relations, starInDiamonds, squareInDiamonds, answer } = problem.meta || {};
  const star = relations?.diamondCount / relations?.starCount;
  const square = relations?.squareStars * star + relations?.squareDiamonds;
  const expected = relations?.circleSquares * square + relations?.circleDiamonds;
  check(14, difficulty, starInDiamonds === star && squareInDiamonds === square && answer === expected && Number.isInteger(answer) && problem.answer === String(answer), "양팔저울 관계 계산 오류");
}

function checkParityChain(problem, difficulty) {
  const { cards, candidates, candidateCount, values, answer } = problem.meta || {};
  const expected = [];
  if (Array.isArray(cards)) for (const giyeok of cards) for (const nieun of cards) for (const digeut of cards) {
    if (new Set([giyeok, nieun, digeut]).size === 3 && giyeok === nieun + 1 && nieun === digeut + 2 && giyeok % 2 === 0) expected.push({ giyeok, nieun, digeut });
  }
  const total = values && values.giyeok + values.nieun + values.digeut;
  check(15, difficulty, Array.isArray(cards) && cards.length === 6 && new Set(cards).size === 6 && candidateCount === 1 && JSON.stringify(candidates) === JSON.stringify(expected) && JSON.stringify(values) === JSON.stringify(expected[0]) && answer === total && problem.answer === String(answer), "짝홀 카드 조건 오류");
}

function checkSetUnion(problem, difficulty) {
  const { first, second, both, total } = problem.meta || {};
  check(16, difficulty, first + second - both === total && problem.answer === `${total}명`, "집합 합집합 계산 오류");
}

function checkPolygonStones(problem, difficulty) {
  const { sourcePerSide, sourceSides, targetPerSide, targetSides, total, answer } = problem.meta || {};
  check(17, difficulty, (sourcePerSide - 1) * sourceSides === (targetPerSide - 1) * targetSides && total === (sourcePerSide - 1) * sourceSides && answer === targetPerSide && problem.answer === `${answer}개`, "다각형 바둑돌 계산 오류");
}

function checkOppositeSequence(problem, difficulty) {
  const { topStart, topStep, topLast, bottomStart, bottomStep, moves, answer } = problem.meta || {};
  check(18, difficulty, topStart + topStep * moves === topLast && answer === bottomStart + bottomStep * moves && problem.answer === String(answer), "반대 수열 계산 오류");
}

function checkOrangeRatio(problem, difficulty) {
  const { children, adults, people, oranges } = problem.meta || {};
  check(19, difficulty, children + adults === people && children / 3 + adults * 3 === oranges && problem.answer === `어린이 ${children}명, 어른 ${adults}명`, "귤 비율 계산 오류");
}

function checkOddEven(problem, difficulty) {
  const { difference, oddEnd, evenEnd, answer } = problem.meta || {};
  check(20, difficulty, oddEnd === difference * 2 - 1 && evenEnd === difference * 2 && sameArray(answer, [oddEnd, evenEnd]) && problem.answer === `${oddEnd}, ${evenEnd}`, "홀짝 합 차 계산 오류");
}

const checks = [
  checkMagicSquare, checkSharedBox, checkShapeSum, checkStepGame, checkSudoku,
  checkRepeatedDigitAddition, checkDualCycle, checkTwoDigit, checkTotalDifference, checkProductPlacement,
  checkHeight, checkFrontBack, checkCards, checkBalance, checkParityChain,
  checkSetUnion, checkPolygonStones, checkOppositeSequence, checkOrangeRatio, checkOddEven
];

checkMapping();
for (const difficulty of [1, 2, 3]) {
  for (let round = 0; round < RUNS; round += 1) {
    expected.forEach(([number, , generator], index) => {
      const problem = GENERATORS[generator]({ difficulty });
      checkCore(number, difficulty, problem);
      checks[index](problem, difficulty);
    });
  }
}

if (failures.size) {
  console.error([...failures].join("\n"));
  process.exit(1);
}

console.log(`초1 4차 1~20번 검산 완료: 난이도별 ${RUNS}회, 총 ${RUNS * 3 * 20}문항.`);
