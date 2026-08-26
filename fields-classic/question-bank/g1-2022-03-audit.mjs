import { EXAMS, TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";

// 원본 구조와 공식 답의 수동 대조 근거는 SOURCE-AUDIT.md의
// "2022.03.07 초1 1차 선발시험" 절에 둔다. 이 파일은 그 확정 연결이
// 이후 코드 변경으로 깨지지 않는지 계산·단일해·표시값을 회귀 검사한다.

const RUNS = Math.max(1, Number.parseInt(process.argv[2] || "1000", 10));
const failures = [];
const typeById = new Map(TYPES.map((item) => [item.id, item]));

const expected = [
  [1, "g1-bus-two-stops", "g1BusTwoStops"],
  [2, "g1-height-order-four", "g1HeightOrderFour"],
  [3, "equalize-transfer", "equalizeTransfer"],
  [4, "g1-two-digit-ones-greater", "g1TwoDigitOnesGreater"],
  [5, "total-difference", "totalDifference"],
  [6, "g1-front-back-between", "g1FrontBackBetween"],
  [7, "g1-shape-add-subtract-chain", "g1ShapeAddSubtractChain"],
  [8, "g1-fold-cut-piece-count", "g1FoldCutPieceCount"],
  [9, "g1-repeated-digit-addition", "g1RepeatedDigitAddition"],
  [10, "g1-multiplicative-symbol-chain", "g1MultiplicativeSymbolChain"],
  [11, "g1-balance-three-relations", "g1BalanceThreeRelations"],
  [12, "g1-stacked-shape-dual-cycle", "g1StackedShapeDualCycle"],
  [13, "g1-triangle-color-difference", "g1TriangleColorDifference"],
  [14, "g1-shape-sum-grid-four", "g1ShapeSumGridFour"],
  [15, "g1-rod-ratio-total", "g1RodRatioTotal"],
  [16, "g1-four-symbol-relation", "g1FourSymbolRelation"],
  [17, "g1-polygon-stone-rearrangement", "g1PolygonStoneRearrangement"],
  [18, "g1-paired-sequences", "g1PairedSequences"],
  [19, "g1-ratio-distribution", "g1RatioDistribution"],
  [20, "g1-odd-even-sum-difference", "g1OddEvenSumDifference"]
];

function fail(message) {
  if (failures.length < 80) failures.push(message);
}

function numberAnswer(problem) {
  const match = String(problem?.answer || "").match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, itemIndex) => itemIndex !== index)).map((rest) => [value, ...rest]));
}

function conditionMatchesOrder(condition, order) {
  const subject = order.find((name) => condition.startsWith(`${name}은 `) || condition.startsWith(`${name}는 `));
  const compared = order.find((name) => condition.includes(` ${name}보다 `));
  if (!subject || !compared) return false;
  const subjectRank = order.indexOf(subject);
  const comparedRank = order.indexOf(compared);
  return condition.endsWith("큽니다.") ? subjectRank > comparedRank : condition.endsWith("작습니다.") ? subjectRank < comparedRank : false;
}

function heightOrderSolutions(names, conditions) {
  return permutations(names).filter((order) => conditions.every((condition) => conditionMatchesOrder(condition, order)));
}

function countShapeGridSolutions(meta) {
  let count = 0;
  for (let circle = 1; circle <= 9; circle += 1) for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let black = 1; black <= 9; black += 1) {
    if (new Set([circle, square, diamond, black]).size < 4) continue;
    const rows = [circle * 2 + diamond * 2, square + black + diamond * 2, square + circle * 3];
    const columns = [circle * 2 + square * 2, circle * 2 + black * 2, diamond * 2 + circle + square, diamond * 3 + circle];
    if (same(rows, meta.rowSums) && same(columns, meta.columnSums)) count += 1;
  }
  return count;
}

function countFourSymbolSolutions(meta) {
  let count = 0;
  for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let circle = 1; circle <= 9; circle += 1) for (let star = 1; star <= 9; star += 1) {
    if (new Set([square, diamond, circle, star]).size < 4) continue;
    if (meta.leftCount * square === meta.rightCount * diamond && meta.thirdSquare * square === circle + diamond && square + star === circle * 2) count += 1;
  }
  return count;
}

const FOLD_TEMPLATE_RESULTS = new Map([
  ["아래로|diagonal", { pieces: 7, cutLines: 2, cuts: "접힌 직사각형의 두 대각선" }],
  ["위로|diagonal", { pieces: 7, cutLines: 2, cuts: "접힌 직사각형의 두 대각선" }],
  ["왼쪽으로|cross", { pieces: 6, cutLines: 2, cuts: "가운데 가로선과 세로선" }],
  ["오른쪽으로|cross", { pieces: 6, cutLines: 2, cuts: "가운데 가로선과 세로선" }],
  ["아래로>왼쪽으로|diagonal", { pieces: 12, cutLines: 2, cuts: "접힌 정사각형의 두 대각선" }],
  ["위로>오른쪽으로|diagonal", { pieces: 12, cutLines: 2, cuts: "접힌 정사각형의 두 대각선" }],
  ["아래로>오른쪽으로|cross", { pieces: 9, cutLines: 2, cuts: "가운데 가로선과 세로선" }],
  ["위로>왼쪽으로|cross", { pieces: 9, cutLines: 2, cuts: "가운데 가로선과 세로선" }],
  ["오른쪽으로>아래로|diagonal-middle", { pieces: 18, cutLines: 3, cuts: "두 대각선과 가운데 선" }],
  ["왼쪽으로>위로|diagonal-middle", { pieces: 18, cutLines: 3, cuts: "두 대각선과 가운데 선" }],
  ["아래로>오른쪽으로|cross-diagonal", { pieces: 16, cutLines: 3, cuts: "가운데 십자선과 대각선" }],
  ["위로>왼쪽으로|cross-diagonal", { pieces: 16, cutLines: 3, cuts: "가운데 십자선과 대각선" }]
]);

function assertBase(problem, number, difficulty, visualKind) {
  if (!problem || !problem.prompt || !problem.solution || problem.answer === undefined || problem.answer === "") {
    fail(`${number}번 난이도 ${difficulty}: 문제·정답·풀이 누락`);
    return false;
  }
  if (problem.meta?.difficulty !== difficulty) fail(`${number}번 난이도 ${difficulty}: 난이도 메타 오류`);
  if (visualKind && problem.visual?.kind !== visualKind) fail(`${number}번 난이도 ${difficulty}: 그림 구조 오류`);
  return true;
}

function checkMapping() {
  const exam = EXAMS.find((item) => item.id === "g1-2022-03");
  if (!exam) return fail("초1 1차 시험지 등록 누락");
  if (!exam.verified || exam.questions.length !== 20) fail("초1 1차 공개 문항 수 또는 검증 상태 오류");
  for (const [number, typeId, generator] of expected) {
    const question = exam.questions.find((item) => item.number === number);
    const type = typeById.get(question?.typeId);
    if (!question?.verified || question.typeId !== typeId || !type?.sourceMatched || type.generator !== generator) {
      fail(`${number}번 원본 유형 연결 오류`);
    }
    if (typeof GENERATORS[generator] !== "function") fail(`${number}번 생성기 누락: ${generator}`);
  }
}

function checkProblem(number, problem, difficulty) {
  const meta = problem?.meta || {};
  switch (number) {
    case 1: {
      if (!assertBase(problem, number, difficulty, "g1-bus-two-stops")) break;
      const answer = (meta.events || []).reduce((value, event) => value - event.left + event.boarded, meta.start);
      if (answer !== meta.answer || numberAnswer(problem) !== answer || meta.events.length !== difficulty || problem.visual.start !== meta.start || !same(problem.visual.events, meta.events)) fail(`${number}번 난이도 ${difficulty}: 승하차 계산·그림 오류`);
      break;
    }
    case 2:
      if (assertBase(problem, number, difficulty, "g1-condition-list")) {
        const solutions = heightOrderSolutions(meta.names, meta.conditions);
        if (meta.count !== 4 || new Set(meta.ordered).size !== 4 || solutions.length !== 1 || !same(solutions[0], meta.ordered) || meta.answer !== meta.ordered[meta.targetRank - 1] || problem.answer !== meta.answer || !same([...problem.visual.conditions].sort(), [...meta.conditions].sort())) fail(`${number}번 난이도 ${difficulty}: 키 순서 단일해·그림 오류`);
      }
      break;
    case 3:
      if (assertBase(problem, number, difficulty, "equalize-bags") && (meta.higher - meta.lower !== meta.transfer * 2 || numberAnswer(problem) !== meta.transfer || problem.visual.higher !== meta.higher || problem.visual.lower !== meta.lower)) fail(`${number}번 난이도 ${difficulty}: 주고받기 계산·그림 오류`);
      break;
    case 4:
      if (assertBase(problem, number, difficulty, "g1-condition-list")) {
        const conditions = ["두 자리 수입니다.", `각 자리 숫자의 합이 ${meta.sum}입니다.`, `십의 자리 숫자가 일의 자리 숫자보다 ${meta.gap} 작습니다.`];
        if (meta.ones - meta.tens !== meta.gap || meta.ones + meta.tens !== meta.sum || meta.answer !== meta.tens * 10 + meta.ones || numberAnswer(problem) !== meta.answer || !same(problem.visual.conditions, conditions)) fail(`${number}번 난이도 ${difficulty}: 두 자리 수 조건·표시 오류`);
      }
      break;
    case 5:
      if (assertBase(problem, number, difficulty, null) && (meta.older + meta.younger !== meta.sum || meta.older - meta.younger !== meta.gap || numberAnswer(problem) !== meta.older)) fail(`${number}번 난이도 ${difficulty}: 전체와 차 계산 오류`);
      break;
    case 6:
      if (assertBase(problem, number, difficulty, "g1-condition-list") && (meta.firstFromBack !== meta.total - meta.firstPosition + 1 || meta.secondFromBack !== meta.total - meta.secondPosition + 1 || meta.between !== Math.abs(meta.firstPosition - meta.secondPosition) - 1 || numberAnswer(problem) !== meta.between || !same(problem.visual.conditions, meta.conditions) || meta.names?.length < 2)) fail(`${number}번 난이도 ${difficulty}: 앞뒤 순서 계산·그림 오류`);
      break;
    case 7:
      if (assertBase(problem, number, difficulty, "g1-equation-panel")) {
        const equations = [`☆ + ○ = ${meta.star + meta.circle}`, `◇ - ☆ = ${meta.diamond - meta.star}`, `◇ + ◇ = ${meta.diamond * 2}`, `○ - □ = ${meta.circle - meta.square}`];
        if (new Set([meta.diamond, meta.star, meta.circle, meta.square]).size !== 4 || numberAnswer(problem) !== meta.square || !same(problem.visual.equations, equations)) fail(`${number}번 난이도 ${difficulty}: 도형식 답·표시 오류`);
      }
      break;
    case 8:
      if (assertBase(problem, number, difficulty, "g1-fold-cut-pieces")) {
        const lockedResult = FOLD_TEMPLATE_RESULTS.get(`${meta.folds?.join(">")}|${meta.cutPattern}`);
        if (!lockedResult || meta.cutLines !== lockedResult.cutLines || meta.cuts !== lockedResult.cuts || meta.pieces !== lockedResult.pieces || numberAnswer(problem) !== lockedResult.pieces || !same(problem.visual.folds, meta.folds) || problem.visual.cutPattern !== meta.cutPattern || problem.visual.cutLines !== meta.cutLines || problem.visual.cuts !== meta.cuts || problem.visual.pieces !== meta.pieces) fail(`${number}번 난이도 ${difficulty}: 원본 대조 접기 템플릿·그림 오류`);
      }
      break;
    case 9: {
      if (!assertBase(problem, number, difficulty, "g1-repeated-digit-addition")) break;
      const expectedAnswer = meta.ask === "ones" ? `□=${meta.ones}` : meta.ask === "sum" ? String(meta.tens + meta.ones) : `○=${meta.tens}, □=${meta.ones}`;
      if (meta.addend !== meta.tens * 10 + meta.ones || meta.result !== meta.addend * 2 || problem.answer !== expectedAnswer || problem.visual.result !== meta.result) fail(`${number}번 난이도 ${difficulty}: 반복 숫자 세로셈·그림 오류`);
      break;
    }
    case 10: {
      if (!assertBase(problem, number, difficulty, "g1-equation-panel")) break;
      const answer = meta.asksSum ? meta.star + meta.triangle : meta.star;
      const equations = [`${meta.symbols.square} × ${meta.symbols.circle} = ${meta.symbols.square}`, `${Array.from({ length: meta.repeat }, () => meta.symbols.circle).join(" + ")} = ${meta.symbols.triangle}`, `${meta.symbols.triangle} × ${meta.symbols.triangle} = ${meta.symbols.square}`, `${meta.symbols.circle} + ${meta.symbols.triangle} + ${meta.symbols.square} = ${meta.symbols.star}`];
      if (meta.circle !== 1 || meta.triangle !== meta.repeat || meta.square !== meta.triangle * meta.triangle || meta.star !== meta.circle + meta.triangle + meta.square || numberAnswer(problem) !== answer || !same(problem.visual.equations, equations)) fail(`${number}번 난이도 ${difficulty}: 곱셈 도형식·표시 오류`);
      break;
    }
    case 11: {
      if (!assertBase(problem, number, difficulty, "g1-balance-three-relations")) break;
      const answer = meta.triangleRectangles + meta.circleRectangles + meta.circleTriangles * meta.triangleRectangles;
      if (meta.answer !== answer || numberAnswer(problem) !== answer || problem.visual.triangleRectangles !== meta.triangleRectangles || problem.visual.circleRectangles !== meta.circleRectangles || problem.visual.circleTriangles !== meta.circleTriangles) fail(`${number}번 난이도 ${difficulty}: 저울 치환 계산·그림 오류`);
      break;
    }
    case 12:
      if (assertBase(problem, number, difficulty, "g1-stacked-shape-cycle")) {
        const expectedItems = Array.from({ length: 10 }, (_, index) => ({ shape: meta.shapes[index % meta.shapes.length], count: meta.counts[index % meta.counts.length] }));
        if (meta.shape !== meta.shapes[(meta.target - 1) % meta.shapes.length] || meta.count !== meta.counts[(meta.target - 1) % meta.counts.length] || problem.answer !== `${meta.shape} ${meta.count}개` || !same(problem.visual.items, expectedItems) || problem.visual.target !== meta.target) fail(`${number}번 난이도 ${difficulty}: 이중 주기·그림 오류`);
      }
      break;
    case 13:
      if (assertBase(problem, number, difficulty, "g1-triangle-color-difference") && (meta.white !== meta.target * (meta.target + 1) / 2 || meta.filled !== meta.target * (meta.target - 1) / 2 || meta.answer !== meta.white - meta.filled || numberAnswer(problem) !== meta.answer || problem.visual.target !== meta.target)) fail(`${number}번 난이도 ${difficulty}: 삼각형 수 차·그림 오류`);
      break;
    case 14: {
      if (!assertBase(problem, number, difficulty, "g1-shape-sum-grid-four")) break;
      const rows = [meta.circle * 2 + meta.diamond * 2, meta.square + meta.black + meta.diamond * 2, meta.square + meta.circle * 3];
      const columns = [meta.circle * 2 + meta.square * 2, meta.circle * 2 + meta.black * 2, meta.diamond * 2 + meta.circle + meta.square, meta.diamond * 3 + meta.circle];
      const answer = meta.circle + meta.black + meta.square + meta.diamond;
      if (rows.join() !== meta.rowSums?.join() || columns.join() !== meta.columnSums?.join() || countShapeGridSolutions(meta) !== 1 || numberAnswer(problem) !== answer || problem.visual.circle !== meta.circle || problem.visual.square !== meta.square || problem.visual.diamond !== meta.diamond || problem.visual.black !== meta.black || !same(problem.visual.rowSums, meta.rowSums) || !same(problem.visual.columnSums, meta.columnSums)) fail(`${number}번 난이도 ${difficulty}: 4×4 도형 합 단일해·그림 오류`);
      break;
    }
    case 15:
      if (assertBase(problem, number, difficulty, "g1-rod-ratio-total") && (meta.topLength !== meta.bottomUnits * meta.scale || meta.bottomLength !== meta.topUnits * meta.scale || meta.total !== meta.topLength + meta.bottomLength || problem.answer !== `㉠=${meta.topLength}cm, ㉡=${meta.bottomLength}cm` || problem.visual.topUnits !== meta.topUnits || problem.visual.bottomUnits !== meta.bottomUnits || problem.visual.total !== meta.total)) fail(`${number}번 난이도 ${difficulty}: 막대 비와 길이·그림 오류`);
      break;
    case 16:
      if (assertBase(problem, number, difficulty, "g1-equation-panel") && (new Set([meta.square, meta.diamond, meta.circle, meta.star]).size !== 4 || meta.leftCount * meta.square !== meta.rightCount * meta.diamond || meta.thirdSquare * meta.square !== meta.circle + meta.diamond || meta.square + meta.star !== meta.circle * 2 || numberAnswer(problem) !== meta.star || countFourSymbolSolutions(meta) !== 1 || !same(problem.visual.equations, meta.equations))) fail(`${number}번 난이도 ${difficulty}: 네 도형 관계식 단일해·표시 오류`);
      break;
    case 17:
      if (assertBase(problem, number, difficulty, "g1-polygon-stones") && (meta.total !== meta.sourceSides * (meta.sourcePerSide - 1) || meta.total !== meta.targetSides * (meta.targetPerSide - 1) || numberAnswer(problem) !== meta.targetPerSide || problem.visual.sourceSides !== meta.sourceSides || problem.visual.sourcePerSide !== meta.sourcePerSide || problem.visual.targetSides !== meta.targetSides || problem.visual.targetPerSide !== meta.targetPerSide || problem.visual.total !== meta.total)) fail(`${number}번 난이도 ${difficulty}: 다각형 바둑돌 재배치·그림 오류`);
      break;
    case 18:
      if (assertBase(problem, number, difficulty, "g1-paired-sequences") && (meta.topLast !== meta.topStart + (meta.terms - 1) * meta.topStep || meta.answer !== meta.bottomStart + (meta.terms - 1) * meta.bottomStep || numberAnswer(problem) !== meta.answer || problem.visual.terms !== meta.terms || problem.visual.topStart !== meta.topStart || problem.visual.topStep !== meta.topStep || problem.visual.topLast !== meta.topLast || problem.visual.bottomStart !== meta.bottomStart || problem.visual.bottomStep !== meta.bottomStep)) fail(`${number}번 난이도 ${difficulty}: 두 줄 수열·그림 오류`);
      break;
    case 19:
      if (assertBase(problem, number, difficulty, "g1-ratio-distribution") && (meta.people !== meta.children + meta.adults || meta.items !== meta.children / meta.childGroup + meta.adults * meta.adultItems || problem.answer !== `어린이 ${meta.children}명, 어른 ${meta.adults}명` || problem.visual.people !== meta.people || problem.visual.items !== meta.items || problem.visual.childGroup !== meta.childGroup || problem.visual.adultItems !== meta.adultItems)) fail(`${number}번 난이도 ${difficulty}: 사람·귤 배분·그림 오류`);
      break;
    case 20:
      if (assertBase(problem, number, difficulty, "g1-odd-even-difference") && (meta.oddEnd !== meta.difference * 2 - 1 || meta.evenEnd !== meta.difference * 2 || problem.answer !== `${meta.oddEnd}, ${meta.evenEnd}` || problem.visual.difference !== meta.difference || problem.visual.oddEnd !== meta.oddEnd || problem.visual.evenEnd !== meta.evenEnd)) fail(`${number}번 난이도 ${difficulty}: 홀짝 합 차·그림 오류`);
      break;
    default:
      fail(`알 수 없는 문항 번호 ${number}`);
  }
}

checkMapping();
for (const difficulty of [1, 2, 3]) {
  for (let round = 0; round < RUNS; round += 1) {
    for (const [number, , generator] of expected) {
      checkProblem(number, GENERATORS[generator]({ difficulty }), difficulty);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`초1 1차 1~20번 등록·계산·그림 회귀 검산 완료: 난이도별 ${RUNS}회, 총 ${RUNS * expected.length * 3}문항`);
