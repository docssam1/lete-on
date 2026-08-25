import { EXAMS, TYPES } from "./source-data.js";
import { GENERATORS } from "./generators.js";

const RUNS = 3000;
const failures = [];
const typeById = new Map(TYPES.map((item) => [item.id, item]));

function numberAnswer(problem) {
  const match = String(problem.answer).match(/\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

function fail(message) {
  failures.push(message);
}

function checkMapping() {
  const exam = EXAMS.find((item) => item.id === "g1-2022-05");
  if (!exam) return fail("초1 2차 시험지 등록 오류");
  const expected = [
    [1, "g1-summer-equalize-transfer", "g1SummerEqualizeTransfer"],
    [2, "g1-summer-height-order-five", "g1SummerHeightOrderFive"],
    [3, "g1-summer-two-digit-sum-gap", "g1SummerTwoDigitSumGap"],
    [4, "g1-summer-balance-shape-chain", "g1SummerBalanceShapeChain"],
    [5, "g1-summer-five-box-weight-order", "g1SummerFiveBoxWeightOrder"],
    [6, "g1-summer-four-shape-add-subtract", "g1SummerFourShapeAddSubtract"],
    [7, "g1-summer-pentagon-adjacent-product", "g1SummerPentagonAdjacentProduct"],
    [8, "g1-summer-four-by-four-shape-sum", "g1SummerFourByFourShapeSum"],
    [9, "g1-summer-circle-point-segments", "g1SummerCirclePointSegments"],
    [10, "g1-summer-four-by-four-shape-sum-bottom", "g1SummerFourByFourShapeSumBottom"],
    [11, "g1-summer-vertical-shape-addition", "g1SummerVerticalShapeAddition"],
    [12, "g1-summer-one-three-rods", "g1SummerOneToThreeRods"],
    [13, "g1-summer-triangular-color-difference", "g1SummerTriangularColorDifference"],
    [14, "g1-summer-square-side-composition", "g1SummerSquareSideComposition"],
    [15, "g1-summer-fold-cut-triangle-count", "g1SummerFoldCutTriangleCount"],
    [16, "g1-summer-four-symbol-relation", "g1SummerFourSymbolRelation"],
    [17, "g1-summer-shape-height-dual-cycle", "g1SummerShapeHeightDualCycle"],
    [18, "g1-summer-orange-ratio-distribution", "g1SummerOrangeRatioDistribution"],
    [19, "g1-summer-rectilinear-perimeter", "g1SummerRectilinearPerimeter"],
    [20, "g1-summer-opposite-step-sequences", "g1SummerOppositeStepSequences"]
  ];
  for (const [number, typeId, generator] of expected) {
    const question = exam.questions.find((item) => item.number === number);
    const type = typeById.get(question?.typeId);
    if (!question?.verified || question.typeId !== typeId || !type?.sourceMatched || type.generator !== generator) {
      fail(`${number}번 원본 연결 오류`);
    }
  }
  if (exam.questions.filter((item) => item.verified).map((item) => item.number).join(",") !== Array.from({ length: 20 }, (_, index) => index + 1).join(",")) {
    fail("검수 완료 문항 공개 오류");
  }
}

function checkEqualize(problem, difficulty) {
  const { higher, lower, transfer } = problem.meta || {};
  if (!Number.isInteger(higher) || higher - lower !== transfer * 2 || numberAnswer(problem) !== transfer) {
    fail(`1번 난이도 ${difficulty} 주고받기 계산 오류`);
  }
  if (problem.visual?.kind !== "equalize-bags" || !problem.prompt || !problem.solution) {
    fail(`1번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkDigitGap(problem, difficulty) {
  const { tens, ones, sum, gap, answer } = problem.meta || {};
  if (tens + ones !== sum || tens - ones !== gap || tens * 10 + ones !== answer || numberAnswer(problem) !== answer) {
    fail(`3번 난이도 ${difficulty} 자리수 조건 계산 오류`);
  }
  if (problem.visual?.kind !== "number-conditions" || !problem.prompt || !problem.solution) {
    fail(`3번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkHeightOrder(problem, difficulty) {
  const { tallest, target, middle, fourth, shortest, conditions, answer } = problem.meta || {};
  if (new Set([tallest, target, middle, fourth, shortest]).size !== 5 || answer !== 2 || numberAnswer(problem) !== 2) {
    fail(`2번 난이도 ${difficulty} 순서 계산 오류`);
  }
  if (!Array.isArray(conditions) || !conditions.length || problem.visual?.kind !== "g1-summer-height-order" || !problem.prompt || !problem.solution) {
    fail(`2번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkBalance(problem, difficulty) {
  const { circles, squares, triangles, squaresPerCircle, answer } = problem.meta || {};
  if (squares !== circles * squaresPerCircle || answer !== squaresPerCircle * triangles || numberAnswer(problem) !== answer) {
    fail(`4번 난이도 ${difficulty} 양팔저울 관계 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-balance-chain" || !problem.prompt || !problem.solution) {
    fail(`4번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkFiveBoxWeightOrder(problem, difficulty) {
  const { answerOrder, relations, conditions } = problem.meta || {};
  const expected = Array.isArray(answerOrder) ? answerOrder.join(" > ") : "";
  const rank = new Map((answerOrder || []).map((box, index) => [box, index]));
  const isOrdered = Array.isArray(relations) && relations.length === 4 && relations.every(({ heavier, lighter }) => rank.get(heavier) < rank.get(lighter));
  if (!Array.isArray(answerOrder) || answerOrder.length !== 5 || new Set(answerOrder).size !== 5 || !isOrdered || problem.answer !== expected) {
    fail(`5번 난이도 ${difficulty} 상자 무게 순서 계산 오류`);
  }
  if (!Array.isArray(conditions) || !conditions.length || problem.visual?.kind !== "g1-summer-five-box-weight" || !problem.prompt || !problem.solution) {
    fail(`5번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkFourShapeAddSubtract(problem, difficulty) {
  const { star, circle, diamond, square, sum, difference } = problem.meta || {};
  if (star + circle !== sum || diamond - star !== difference || diamond * 2 <= 0 || circle - square !== difference || numberAnswer(problem) !== square) {
    fail(`6번 난이도 ${difficulty} 네 도형 관계 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-four-shape-chain" || !problem.prompt || !problem.solution) {
    fail(`6번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkPentagonAdjacentProduct(problem, difficulty) {
  const { values, products, top } = problem.meta || {};
  const expectedProducts = Array.isArray(values) ? values.map((value, index) => value * values[(index + 1) % values.length]) : [];
  if (!Array.isArray(values) || values.length !== 5 || !values.every((value) => value >= 2 && value <= 9) || products?.join(",") !== expectedProducts.join(",") || top !== values[0] || numberAnswer(problem) !== top) {
    fail(`7번 난이도 ${difficulty} 오각형 곱 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-pentagon-product" || !problem.prompt || !problem.solution) {
    fail(`7번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkFourByFourShapeSum(problem, difficulty) {
  const { values, rowSums, columnSums, answer } = problem.meta || {};
  const { square, triangle, diamond, star, circle } = values || {};
  const calculatedRows = [square * 4, triangle + diamond + star + circle, triangle + star * 2 + circle, triangle * 2 + diamond * 2];
  const calculatedColumns = [square + triangle * 3, square + diamond + star + triangle, square + star * 2 + diamond, square + circle * 2 + diamond];
  if (rowSums?.join(",") !== calculatedRows.join(",") || columnSums?.join(",") !== calculatedColumns.join(",") || answer !== rowSums?.[2] || numberAnswer(problem) !== answer) {
    fail(`8번 난이도 ${difficulty} 4x4 도형표 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-four-by-four-sum" || !problem.prompt || !problem.solution) {
    fail(`8번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkCirclePointSegments(problem, difficulty) {
  const { points, answer } = problem.meta || {};
  if (!Number.isInteger(points) || answer !== points * (points - 1) / 2 || numberAnswer(problem) !== answer) {
    fail(`9번 난이도 ${difficulty} 선분 개수 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-circle-points" || !problem.prompt || !problem.solution) {
    fail(`9번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkFourByFourShapeSumBottom(problem, difficulty) {
  const { values, rowSums, columnSums, answer } = problem.meta || {};
  const { circle, diamond, square, blackDiamond } = values || {};
  const calculatedRows = [circle * 2 + diamond * 2, square + blackDiamond + diamond * 2, square * 2 + circle * 2, circle + blackDiamond + diamond * 2];
  const calculatedColumns = [circle * 2 + square * 2, circle * 2 + blackDiamond * 2, diamond * 3 + circle, diamond * 3 + square];
  if (rowSums?.join(",") !== calculatedRows.join(",") || columnSums?.join(",") !== calculatedColumns.join(",") || answer !== rowSums?.[3] || numberAnswer(problem) !== answer) {
    fail(`10번 난이도 ${difficulty} 4x4 도형표 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-four-by-four-sum" || problem.visual?.targetRow !== 3 || !problem.prompt || !problem.solution) {
    fail(`10번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkVerticalShapeAddition(problem, difficulty) {
  const { circle, diamond, square, finalDigit, firstNumber, secondNumber, total } = problem.meta || {};
  if (firstNumber !== circle * 10 + square || secondNumber !== diamond * 10 + square || total !== diamond * 100 + diamond * 10 + finalDigit || firstNumber + secondNumber !== total || numberAnswer(problem) !== circle) {
    fail(`11번 난이도 ${difficulty} 도형 세로셈 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-vertical-shape-addition" || !problem.prompt || !problem.solution) {
    fail(`11번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkOneToThreeRods(problem, difficulty) {
  const { total, longLength, shortLength } = problem.meta || {};
  if (longLength !== shortLength * 3 || total !== longLength + shortLength || problem.answer !== `㉠=${longLength}cm, ㉡=${shortLength}cm`) {
    fail(`12번 난이도 ${difficulty} 막대 길이 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-one-three-rods" || !problem.prompt || !problem.solution) {
    fail(`12번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkTriangularColorDifference(problem, difficulty) {
  const { target, white, filled } = problem.meta || {};
  if (white !== target * (target + 1) / 2 || filled !== target * (target - 1) / 2 || numberAnswer(problem) !== white - filled) {
    fail(`13번 난이도 ${difficulty} 삼각형 색칠 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-triangle-color-difference" || !problem.prompt || !problem.solution) {
    fail(`13번 난이도 ${difficulty} 가시성 데이터 오류`);
  }
}

function checkSquareSideComposition(problem, difficulty) {
  const { targetUnits, unit, answer } = problem.meta || {};
  if (!Number.isInteger(targetUnits) || !Number.isInteger(unit) || answer !== targetUnits * unit || numberAnswer(problem) !== answer) {
    fail(`14번 난이도 ${difficulty} 정사각형 변 길이 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-square-composition" || !problem.prompt || !problem.solution) fail(`14번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkFoldCutTriangles(problem, difficulty) {
  const { triangles, diagonal } = problem.meta || {};
  if (triangles !== 6 || diagonal !== "left" || numberAnswer(problem) !== triangles) {
    fail(`15번 난이도 ${difficulty} 접고 자른 삼각형 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-fold-cut-triangles" || !problem.prompt || !problem.solution) fail(`15번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkFourSymbolRelation(problem, difficulty) {
  const { star, square, diamond, circle } = problem.meta || {};
  if (new Set([star, square, diamond, circle]).size !== 4 || star + square !== diamond || star * 3 !== circle * 4 || star * 2 !== diamond + circle || numberAnswer(problem) !== square) {
    fail(`16번 난이도 ${difficulty} 네 도형 관계 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-four-symbol-relation" || !problem.prompt || !problem.solution) fail(`16번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkShapeHeightCycle(problem, difficulty) {
  const { shapes, target, shape, height } = problem.meta || {};
  if (!Array.isArray(shapes) || shape !== shapes[(target - 1) % shapes.length] || height !== (target - 1) % 4 + 1 || problem.answer !== `${shape} ${height}개`) {
    fail(`17번 난이도 ${difficulty} 이중 반복 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-shape-height-cycle" || !problem.prompt || !problem.solution) fail(`17번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkOrangeRatio(problem, difficulty) {
  const { children, adults, people, oranges } = problem.meta || {};
  if (children !== adults * 3 || people !== children + adults || oranges !== children / 3 + adults * 3 || problem.answer !== `어린이 ${children}명, 어른 ${adults}명`) {
    fail(`18번 난이도 ${difficulty} 귤 나누기 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-orange-ratio" || !problem.prompt || !problem.solution) fail(`18번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkRectilinearPerimeter(problem, difficulty) {
  const { height, top, inner, lower, notch, answer } = problem.meta || {};
  if (notch !== inner - lower + top || answer !== 2 * (height + top + inner) || numberAnswer(problem) !== answer || notch <= 0) {
    fail(`19번 난이도 ${difficulty} 직각 도형 둘레 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-rectilinear-perimeter" || !problem.prompt || !problem.solution) fail(`19번 난이도 ${difficulty} 가시성 데이터 오류`);
}

function checkOppositeSequences(problem, difficulty) {
  const { topStart, topStep, topLast, bottomStart, bottomStep, moves, answer } = problem.meta || {};
  if (topStart + topStep * moves !== topLast || answer !== bottomStart + bottomStep * moves || numberAnswer(problem) !== answer) {
    fail(`20번 난이도 ${difficulty} 짝 수열 계산 오류`);
  }
  if (problem.visual?.kind !== "g1-summer-opposite-sequences" || !problem.prompt || !problem.solution) fail(`20번 난이도 ${difficulty} 가시성 데이터 오류`);
}

checkMapping();
for (const difficulty of [1, 2, 3]) {
  for (let round = 0; round < RUNS; round += 1) {
    checkEqualize(GENERATORS.g1SummerEqualizeTransfer({ difficulty }), difficulty);
    checkHeightOrder(GENERATORS.g1SummerHeightOrderFive({ difficulty }), difficulty);
    checkDigitGap(GENERATORS.g1SummerTwoDigitSumGap({ difficulty }), difficulty);
    checkBalance(GENERATORS.g1SummerBalanceShapeChain({ difficulty }), difficulty);
    checkFiveBoxWeightOrder(GENERATORS.g1SummerFiveBoxWeightOrder({ difficulty }), difficulty);
    checkFourShapeAddSubtract(GENERATORS.g1SummerFourShapeAddSubtract({ difficulty }), difficulty);
    checkPentagonAdjacentProduct(GENERATORS.g1SummerPentagonAdjacentProduct({ difficulty }), difficulty);
    checkFourByFourShapeSum(GENERATORS.g1SummerFourByFourShapeSum({ difficulty }), difficulty);
    checkCirclePointSegments(GENERATORS.g1SummerCirclePointSegments({ difficulty }), difficulty);
    checkFourByFourShapeSumBottom(GENERATORS.g1SummerFourByFourShapeSumBottom({ difficulty }), difficulty);
    checkVerticalShapeAddition(GENERATORS.g1SummerVerticalShapeAddition({ difficulty }), difficulty);
    checkOneToThreeRods(GENERATORS.g1SummerOneToThreeRods({ difficulty }), difficulty);
    checkTriangularColorDifference(GENERATORS.g1SummerTriangularColorDifference({ difficulty }), difficulty);
    checkSquareSideComposition(GENERATORS.g1SummerSquareSideComposition({ difficulty }), difficulty);
    checkFoldCutTriangles(GENERATORS.g1SummerFoldCutTriangleCount({ difficulty }), difficulty);
    checkFourSymbolRelation(GENERATORS.g1SummerFourSymbolRelation({ difficulty }), difficulty);
    checkShapeHeightCycle(GENERATORS.g1SummerShapeHeightDualCycle({ difficulty }), difficulty);
    checkOrangeRatio(GENERATORS.g1SummerOrangeRatioDistribution({ difficulty }), difficulty);
    checkRectilinearPerimeter(GENERATORS.g1SummerRectilinearPerimeter({ difficulty }), difficulty);
    checkOppositeSequences(GENERATORS.g1SummerOppositeStepSequences({ difficulty }), difficulty);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`초1 2차 1~20번 검산 완료: 원본 구조별 20유형을 난이도별 ${RUNS}회 검산`);
