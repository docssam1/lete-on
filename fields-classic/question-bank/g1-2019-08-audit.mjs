import { EXAMS, TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";

const RUNS = 3000;
const failures = [];
const typeById = new Map(TYPES.map((item) => [item.id, item]));
const expected = [
  [1, "g1-fall-three-person-total-transfer", "g1FallThreePersonTotalTransfer"],
  [2, "g1-height-order-four", "g1HeightOrderFour"],
  [3, "g1-summer-balance-shape-chain", "g1SummerBalanceShapeChain"],
  [4, "g1-two-digit-ones-greater", "g1TwoDigitOnesGreater"],
  [5, "g1-fall-number-set-offset-chain", "g1FallNumberSetOffsetChain"],
  [6, "g1-fall-four-by-four-latin-two-target", "g1FallFourByFourLatinTwoTarget"],
  [7, "g1-fall-pentagon-adjacent-products-all", "g1FallPentagonAdjacentProductsAll"],
  [8, "g1-fall-four-by-four-shape-sum-four-targets", "g1FallFourByFourShapeSumFourTargets"],
  [9, "g1-fall-four-short-one-long-rods", "g1FallFourShortOneLongRods"],
  [10, "g1-fall-stacked-square-side-chain", "g1FallStackedSquareSideChain"],
  [11, "g1-fall-aa-ab-ccc-shape-addition", "g1FallAaAbCccShapeAddition"],
  [12, "g1-triangle-color-difference", "g1TriangleColorDifference"],
  [13, "g1-fall-three-fold-crease-cut-count", "g1FallThreeFoldCreaseCutCount"],
  [14, "g1-fall-total-triple-share", "g1FallTotalTripleShare"],
  [15, "g1-fall-paired-four-blank-additions", "g1FallFourBlankAddition"],
  [16, "g1-fall-square-chain-shaded-perimeter", "g1FallSquareChainShadedPerimeter"],
  [17, "g1-fall-linear-input-output-table", "g1FallLinearInputOutputTable"],
  [18, "g1-summer-shape-height-dual-cycle", "g1SummerShapeHeightDualCycle"],
  [19, "g1-fall-alternating-result-cryptarithm", "g1FallAlternatingResultCryptarithm"],
  [20, "g1-fall-consecutive-three-sum-completion", "g1FallConsecutiveThreeSumCompletion"]
];

function fail(message) { failures.push(message); }
function numeric(problem) { return Number(String(problem.answer).match(/\d+/)?.[0]); }
function sum(values) { return values.reduce((total, value) => total + value, 0); }

function checkMapping() {
  const exam = EXAMS.find((item) => item.id === "g1-2019-08");
  if (!exam) return fail("초1 3차 시험 등록 누락");
  for (const [number, typeId, generator] of expected) {
    const question = exam.questions.find((item) => item.number === number);
    const type = typeById.get(typeId);
    if (question?.typeId !== typeId || !type?.sourceMatched || type.generator !== generator) fail(`${number}번 유형 연결 오류`);
  }
  const verified = exam.questions.filter((item) => item.verified).map((item) => item.number);
  if (verified.join(",") !== Array.from({ length: 20 }, (_, index) => index + 1).join(",")) fail("1~20번 공개 상태 오류");
}

function checkProblem(number, problem) {
  if (!problem?.prompt || !problem.answer || !problem.solution || !problem.visual?.kind) return fail(`${number}번 빈 생성 결과`);
  const m = problem.meta || {};
  if (number === 1 && (m.total !== m.fixed + m.higher + m.lower || m.higher - m.lower !== m.transfer * 2 || numeric(problem) !== m.higher)) fail("1번 계산 오류");
  if (number === 2 && (m.count !== 4 || m.names.length !== 4 || new Set(m.ordered).size !== 4 || problem.answer !== m.ordered[m.targetRank - 1])) fail("2번 순서 오류");
  if (number === 3 && (m.squares !== m.circles * m.squaresPerCircle || numeric(problem) !== m.squaresPerCircle * m.triangles)) fail("3번 저울 오류");
  if (number === 4 && (m.ones - m.tens !== m.gap || m.ones + m.tens !== m.sum || numeric(problem) !== m.tens * 10 + m.ones)) fail("4번 자리수 오류");
  if (number === 5 && (m.candidateCount !== 1 || !m.offsets.every((offset, index) => m.values[index] === m.values[0] + offset) || numeric(problem) !== m.values[0] + m.values[3])) fail("5번 조건 수 오류");
  if (number === 6) {
    const rows = Array.from({ length: 4 }, (_, row) => m.grid.slice(row * 4, row * 4 + 4));
    const columns = Array.from({ length: 4 }, (_, column) => m.grid.filter((_, index) => index % 4 === column));
    if (![...rows, ...columns].every((line) => [...line].sort().join("") === "1234") || Number(m.answerDigits.join("")) !== numeric(problem)) fail("6번 라틴방진 오류");
  }
  if (number === 7 && (m.products?.some((value, index) => value !== m.values[index] * m.values[(index + 1) % 5]) || problem.answer !== m.values.join(", "))) fail("7번 오각형 곱 오류");
  if (number === 8) {
    const rows = Array.from({ length: 4 }, (_, row) => sum(m.cells.slice(row * 4, row * 4 + 4)));
    const columns = Array.from({ length: 4 }, (_, column) => sum(m.cells.filter((_, index) => index % 4 === column)));
    if (rows.join() !== m.rowSums.join() || columns.join() !== m.columnSums.join() || problem.answer !== [rows[1], rows[3], columns[1], columns[3]].join(", ")) fail("8번 도형표 오류");
  }
  if (number === 9 && (m.long !== m.short * 4 || m.total !== m.short + m.long)) fail("9번 막대 오류");
  if (number === 10 && (m.big !== m.unit * 3 || m.medium !== m.unit * 2)) fail("10번 정사각형 변 오류");
  if (number === 11 && (m.values.a !== 5 || m.values.b !== 6 || m.values.c !== 1 || 55 + 56 !== 111)) fail("11번 복면산 오류");
  if (number === 12 && (m.white - m.filled !== numeric(problem))) fail("12번 삼각형 차 오류");
  if (number === 13 && (m.folds !== problem.meta.difficulty + 1 || m.pieces !== 2 ** m.folds || numeric(problem) !== m.pieces)) fail("13번 접기 조각 오류");
  if (number === 14 && (m.larger !== m.smaller * 3 || m.total !== m.larger + m.smaller || numeric(problem) !== m.larger)) fail("14번 3대1 오류");
  if (number === 15) {
    const values = m.fullRows.map((row) => Number(row.join("")));
    const hidden = m.masks.map(([row, column]) => m.fullRows[row][column]);
    if (values[0] + values[1] !== values[2] || m.candidateCount !== 1 || hidden.join() !== m.hiddenDigits.join() || problem.answer !== hidden.join(", ")) fail("15번 빈칸 세로셈 오류");
  }
  if (number === 16 && (m.totalWidth !== m.unit * 7 || m.perimeter !== m.unit * 4 || numeric(problem) !== m.perimeter)) fail("16번 둘레 오류");
  if (number === 17 && (m.answer !== m.startOutput + (m.targetInput - 1) * m.step || numeric(problem) !== m.answer)) fail("17번 대응표 오류");
  if (number === 18 && (m.shape !== m.shapes[(m.target - 1) % m.shapes.length] || m.height !== (m.target - 1) % 4 + 1)) fail("18번 이중 주기 오류");
  if (number === 19 && (m.first + m.second !== 1010 || m.candidateCount !== 1 || problem.answer !== `${m.first}+${m.second}=1010`)) fail("19번 복면산 오류");
  if (number === 20 && (m.values[1] - m.values[0] !== 1 || m.values[2] - m.values[1] !== 1 || sum(m.values) !== m.total || problem.answer !== `${m.values.join("+")}=${m.total}`)) fail("20번 연속수 오류");
}

checkMapping();
for (const difficulty of [1, 2, 3]) {
  for (let round = 0; round < RUNS; round += 1) {
    expected.forEach(([number, , generator]) => checkProblem(number, GENERATORS[generator]({ difficulty })));
  }
}

if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exit(1);
}
console.log(`초1 3차 1~20번 검산 완료: 난이도별 ${RUNS}회, 총 ${RUNS * 3 * 20}문항`);
