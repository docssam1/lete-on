// 시험 시기 — 학생이 공부하는 시기가 아니라 그 시험지가 실제로 치러지는 시기다.
// id는 URL 파라미터와 EXAMS의 stage 참조에 쓰이므로 바꾸지 않는다.
export const AGE_STAGES = [
  { id: "k6_winter", label: "6세 12월~2월" },
  { id: "k7_spring", label: "7세 3월~5월" },
  { id: "k7_summer", label: "7세 6월~8월" },
  { id: "k7_november", label: "7세 11월" },
  { id: "k7_to_g1", label: "7세 12월~초1 2월" },
  { id: "g1_spring", label: "초1 3월~5월" },
  { id: "g1_summer", label: "초1 6월~8월" },
  { id: "g1_fall", label: "초1 8월~10월" },
  { id: "g1_winter", label: "초1 11월~1월" }
];

export const DOMAINS = [
  { id: "number", label: "수와 연산", color: "#e36557" },
  { id: "pattern", label: "규칙과 관계", color: "#d99b24" },
  { id: "logic", label: "논리와 문제해결", color: "#2f8f73" },
  { id: "geometry", label: "도형과 공간", color: "#4779b8" }
];

const type = (id, domain, middle, label, options = {}) => ({
  id, domain, middle, label, difficulty: "actual", status: "classified", ...options
});

// Geometry World의 검산된 학습지 엔진을 그대로 쓰는 유형이다. 필즈 쪽에
// 비슷한 생성기나 SVG를 다시 만들지 않고, worksheetCode 하나로 수학·그림·정답을
// 함께 가져온다. worksheetLevel은 이 문제은행에서 "같게"를 만들 때의 기준 단계다.
const geometryWorksheet = (worksheetCode, worksheetLevel, options = {}) => ({
  // Geometry World에서 수학·그림·정답을 독립 검산한 공용 문제은행 유형이다.
  // 실제 필즈 시험지와 1:1 대조했다는 뜻의 sourceMatched와는 구분한다.
  bankApproved: true,
  worksheetCode,
  worksheetLevel,
  worksheetSource: "지오메트리 공용 문제은행",
  geometryGame: `worksheet:${worksheetCode}`,
  ...options
});

export const TYPES = [
  type("hidden-number-card-conditions", "logic", "조건 추리", "숫자 카드 포함·제외 조건으로 숨은 수 찾기", { generator: "hiddenCardCondition", sourceMatched: true }),
  type("closest-two-digit-card-sum", "number", "수 카드와 식", "두 자리 수 두 개의 합을 목표 수에 가장 가깝게 만들기", { generator: "closestTwoDigitCardSum", sourceMatched: true }),
  type("front-back-total", "logic", "순서와 비교", "앞·뒤 순서로 줄 선 전체 인원 구하기", { generator: "frontBackTotal", sourceMatched: true }),
  type("wrong-operation-correction", "logic", "과정 추론", "잘못 적용한 덧셈·뺄셈을 바르게 고치기", { generator: "wrongOperationCorrection", sourceMatched: true }),
  type("shape-matrix-rule", "pattern", "도형 규칙", "겹친 도형과 칠한 위치의 행렬 규칙 완성", { generator: "shapeMatrixRule", sourceMatched: true }),
  type("delayed-date-promise", "pattern", "달력과 시간", "전에 들은 며칠 뒤 약속의 실제 날짜 구하기", { generator: "delayedDatePromise", sourceMatched: true }),
  type("calendar-date-weekday", "pattern", "달력과 시간", "달력에서 특정 날짜의 요일 찾기", { generator: "tornCalendarWeekday", sourceMatched: true }),
  type("two-type-unit-total", "number", "합과 차 문장제", "두 종류의 전체 개수와 단위 수로 각각의 개수 구하기", { generator: "twoTypeUnitTotal", sourceMatched: true }),
  type("row-column-count-placement", "logic", "조건 배치", "가로·세로 개수 조건에 맞게 칸 표시하기", { generator: "rowColumnCountPlacement", sourceMatched: true }),
  type("truth-lie-ranking", "logic", "조건 추리", "참말과 거짓말로 경기 순위 찾기", { generator: "truthLieRanking", sourceMatched: true }),
  type("target-score-combinations", "logic", "경우의 수", "과녁에 여러 번 쏘아 만들 수 있는 점수 세기", { generator: "targetScoreCombinations", sourceMatched: true }),
  type("matchstick-square-growth", "pattern", "수열의 활용", "성냥개비 도형 수열", {
    generator: "matchstickShapeSequence",
    sourceMatched: true,
    variants: ["삼각형", "사각형", "오각형", "육각형"]
  }),
  type("connected-line-degree-sum", "geometry", "연결 관계", "각 점에 연결된 선의 개수 합", { generator: "connectedLineDegreeSum", sourceMatched: true }),
  type("letter-block-transform", "geometry", "도형 움직이기", "글자 블록을 움직인 결과 그리기", { generator: "letterBlockTransform", sourceMatched: true }),
  type("mixed-sequences", "pattern", "수 규칙", "세 가지 규칙의 복합 수열", { generator: "mixedSequences", sourceMatched: true }),
  type("neither-set-count", "logic", "집합과 포함", "두 조건에 모두 해당하지 않는 수", { generator: "neitherSetCount", sourceMatched: true }),
  type("edge-sum-grid", "number", "수 배열과 합", "주변의 합에 맞게 수 배치하기", { generator: "edgeSumCycle", sourceMatched: true }),
  type("equalize-transfer", "number", "합과 차 문장제", "주고받아 같게 만들기", { generator: "equalizeTransfer", sourceMatched: true, textbookSource: "더클래식 1과정 2권 15~17쪽·단원 테스트 4번" }),
  type("number-pyramid", "number", "수 배열과 합", "수 카드로 모으기·수 피라미드", { generator: "numberPyramid", sourceMatched: true }),
  type("five-card-sum-pyramid", "number", "수 배열과 합", "다섯 수 카드 합 피라미드", { generator: "fiveCardSumPyramid", sourceMatched: true }),
  type("grid-number-placement", "logic", "조건 배치", "위·아래·좌우 조건에 맞게 수 배치하기", { generator: "stairGridPlacement", sourceMatched: true, legacyId: 17 }),
  type("vertical-stair-grid-placement", "logic", "조건 배치", "세로 계단형 네 칸의 위치 조건 배치", { generator: "verticalStairGridPlacement", sourceMatched: true }),
  type("l-grid-placement", "logic", "조건 배치", "ㄱ자 칸의 왼쪽·아래 조건에 맞게 수 배치하기", { generator: "lGridPlacement", sourceMatched: true }),
  type("grid-number-placement-five", "logic", "조건 배치", "다섯 수의 위·아래·좌우 조건 배치", { generator: "gridNumberPlacementFive", sourceMatched: true }),
  type("nonadjacent-placement", "logic", "조건 배치", "같은 수가 이웃하지 않게 배치하기", { generator: "sourceNonadjacentPyramid", sourceMatched: true }),
  type("order-position", "logic", "순서와 비교", "줄의 순서와 사이 사람 수", { generator: "raceOrder", sourceMatched: true }),
  type("order-position-from-back", "logic", "순서와 비교", "뒤에서의 순서와 사이 사람 수", { generator: "orderPositionFromBack", sourceMatched: true }),
  type("order-position-from-front", "logic", "순서와 비교", "앞에서의 순서와 사이 사람 수", { generator: "orderPositionFromFront", sourceMatched: true }),
  type("order-position-seven-people", "logic", "순서와 비교", "일곱 명의 앞·뒤 순서와 사이 사람 수", { generator: "orderPositionSevenPeople", sourceMatched: true }),
  type("number-table-rule", "pattern", "수 규칙", "수 배열표의 규칙 찾기", { legacyId: 11 }),
  type("addition-table-grid", "pattern", "수 규칙", "수 규칙 표의 오른쪽 아래 빈칸", { generator: "additionTableGrid", sourceMatched: true }),
  type("addition-table-grid-bottom-left", "pattern", "수 규칙", "수 규칙 표의 왼쪽 아래 빈칸", { generator: "additionTableGridBottomLeft", sourceMatched: true }),
  type("addition-table-grid-offset", "pattern", "수 규칙", "띄엄띄엄 주어진 수 규칙 표의 빈칸", { generator: "additionTableGridOffset", sourceMatched: true }),
  type("disc-number-rule", "pattern", "수 규칙", "원판에 적힌 수의 규칙", { generator: "discNumberRule", sourceMatched: true }),
  type("repeat-pattern", "pattern", "반복 규칙", "모양과 색의 반복 규칙", { generator: "repeatShapeSequence", sourceMatched: true }),
  type("shape-repeat-ordinal", "pattern", "반복 규칙", "모양 반복마디와 순서수", { generator: "shapeRepeatOrdinal", sourceMatched: true }),
  type("repeat-shape-color-dual", "pattern", "반복 규칙", "모양 주기와 색 주기를 함께 찾기", { generator: "repeatShapeColorDual", sourceMatched: true }),
  type("repeat-three-shapes", "pattern", "반복 규칙", "세 가지 도형의 순서 반복", { generator: "threeShapeCycle", sourceMatched: true }),
  type("repeat-four-shapes", "pattern", "반복 규칙", "네 가지 도형의 순서 반복", { generator: "fourShapeCycle", sourceMatched: true }),
  type("repeat-four-items-with-duplicate", "pattern", "반복 규칙", "같은 모양이 두 번 들어간 네 칸 반복", { generator: "fourItemCycleWithDuplicate", sourceMatched: true }),
  type("shape-sum-table", "number", "매트릭스", "도형의 가로·세로 합 매트릭스", { generator: "shapeSumTable", sourceMatched: true, textbookSource: "더클래식 1과정 2권 10~14·23쪽·단원 테스트 1·2·22번" }),
  type("shape-sum-table-row-target", "number", "매트릭스", "같은 도형을 이용해 가로 합 구하기", { generator: "shapeSumRowTarget", sourceMatched: true }),
  type("shape-sum-table-bottom-target", "number", "매트릭스", "도형의 가로·세로 합 표", { generator: "shapeSumBottomTarget", sourceMatched: true }),
  type("shape-sum-table-column-target", "number", "매트릭스", "두 줄 도형표의 세로 합 구하기", { generator: "shapeSumColumnTarget", sourceMatched: true }),
  type("shape-sum-table-repeated-column-target", "number", "매트릭스", "같은 도형이 놓인 세로줄의 합으로 다른 세로줄 구하기", { generator: "shapeSumRepeatedColumnTarget", sourceMatched: true }),
  type("arrow-number-grid", "pattern", "수 규칙", "화살표 방향 수 배열", { generator: "arrowNumberGrid", sourceMatched: true }),
  type("arrow-number-horizontal-tens", "pattern", "수 규칙", "화살표로 10과 1 더하고 빼기", { generator: "arrowNumberHorizontalTens", sourceMatched: true }),
  type("arrow-number-path-seven", "pattern", "수 규칙", "화살표 7번 이동 수 경로", { generator: "arrowNumberPathSeven", sourceMatched: true }),
  type("bus-change", "number", "합과 차 문장제", "버스에서 타고 내린 사람 수", { generator: "sourceBusStops", sourceMatched: true }),
  type("bus-board-then-leave", "number", "합과 차 문장제", "버스에서 먼저 타고 다음에 내린 사람 수", { generator: "busBoardThenLeave", sourceMatched: true }),
  type("fold-number-cut-sum", "geometry", "색종이 접기", "번호 색종이를 접고 자른 수의 합", { generator: "foldNumberCutSum", sourceMatched: true }),
  type("fold-number-cut-sum-main-diagonal", "geometry", "색종이 접기", "왼쪽 위에서 오른쪽 아래로 접은 번호 색종이", { generator: "foldNumberCutSumMainDiagonal", sourceMatched: true }),
  type("fold-number-cut-sum-l-shape", "geometry", "색종이 접기", "L자 부분을 자른 번호 색종이의 합", { generator: "foldNumberCutSumLShape", sourceMatched: true }),
  type("equal-line-sum", "number", "수 배열과 합", "가로·세로 각 줄의 합 같게 만들기", { generator: "sourceEqualLineCross", sourceMatched: true }),
  type("equal-line-sum-eight-cards", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 줄의 합 만들기", { generator: "equalLineSumEightCards", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-line-sum-eight-cards-fifteen-top-left", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 네 변의 합을 같게 만들기", { generator: "equalLineSumEightCardsFifteenTopLeft", sourceMatched: true }),
  type("equal-line-sum-eight-cards-twelve", "number", "수 배열과 합", "1부터 8까지 써서 각 줄의 합을 같게 만들기", { generator: "equalLineSumEightCardsTwelve", sourceMatched: true }),
  type("symbol-sum-grid", "number", "매트릭스", "도형 매트릭스의 빈 합 구하기", { generator: "sourceSymbolSumGrid", sourceMatched: true }),
  type("shape-sum-grid-triangle-top", "number", "매트릭스", "세모 세 개로 시작하는 도형 합 표", { generator: "shapeSumGridTriangleTop", sourceMatched: true }),
  type("shape-sum-grid-top-target", "number", "매트릭스", "도형 합 표의 첫째 줄 합 구하기", { generator: "shapeSumGridTopTarget", sourceMatched: true }),
  type("shape-sum-grid-triangle-column-target", "number", "매트릭스", "세모 세 개가 놓인 도형 합 표", { generator: "shapeSumGridTriangleColumnTarget", sourceMatched: true }),
  type("symbol-sum-grid-square-top", "number", "매트릭스", "네모 세 개로 시작하는 도형 합 매트릭스", { generator: "symbolSumGridSquareTop", sourceMatched: true }),
  type("shape-equation", "number", "복면산과 식", "도형이 나타내는 수와 식", { legacyId: 20 }),
  type("shape-equation-add-subtract", "number", "복면산과 식", "더하기와 빼기로 도형 수 구하기", { generator: "shapeEquationAddSubtract", sourceMatched: true }),
  type("two-digit-condition", "number", "조건에 맞는 수", "조건에 맞는 두 자리 수", { generator: "sourceTwoDigitSumDifference", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("two-digit-parity-gap", "number", "조건에 맞는 수", "짝수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitParityGap", sourceMatched: true }),
  type("two-digit-even-ones-greater-gap", "number", "조건에 맞는 수", "일의 자리 숫자가 더 큰 짝수 찾기", { generator: "twoDigitEvenOnesGreaterGap", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("two-digit-odd-gap", "number", "조건에 맞는 수", "홀수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitOddGap", sourceMatched: true }),
  type("two-digit-odd-bounded-gap", "number", "조건에 맞는 수", "범위와 자릿수 차로 홀수 찾기", { generator: "twoDigitOddBoundedGap", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("growing-shape-count", "pattern", "도형 규칙", "구슬 배열의 개수 규칙", { generator: "sourceGrowingDotSquare", sourceMatched: true }),
  type("triangle-tile-growth", "pattern", "도형 규칙", "정삼각형 조각 수의 성장 규칙", { generator: "triangleTileGrowth", sourceMatched: true }),
  type("square-tile-growth", "pattern", "수열의 활용", "정사각형 배열의 수 규칙", { generator: "squareTileGrowth", sourceMatched: true }),
  type("balance-scale", "logic", "무게 비교", "양팔저울의 균형 관계", { generator: "sourceBalanceRelations", sourceMatched: true }),
  type("balance-scale-three-objects", "logic", "무게 비교", "세 물건 양팔저울 관계", { generator: "balanceScaleThreeObjects", sourceMatched: true }),
  type("balance-scale-circle-target", "logic", "무게 비교", "세 저울의 관계로 필요한 원 개수 구하기", { generator: "balanceScaleCircleTarget", sourceMatched: true }),
  type("balance-scale-star-target", "logic", "무게 비교", "두 저울의 관계로 필요한 별 개수 구하기", { generator: "balanceScaleStarTarget", sourceMatched: true }),
  type("balance-scale-four-objects", "logic", "무게 비교", "네 물건을 잇는 세 양팔저울", { generator: "balanceScaleFourObjects", sourceMatched: true }),
  type("symbol-relation", "number", "복면산과 식", "여러 기호의 관계로 값 구하기", { generator: "symbolRelationThreeToFour", sourceMatched: true }),
  type("symbol-relation-2to3", "number", "복면산과 식", "별 두 개와 원 세 개의 관계식", { generator: "symbolRelationTwoToThree", sourceMatched: true }),
  type("symbol-relation-3to4", "number", "복면산과 식", "별과 원의 개수 관계식", { generator: "symbolRelationThreeToFour", sourceMatched: true }),
  type("number-line-distance", "geometry", "길이와 측정", "수직선에서 두 점 사이의 거리", { legacyId: 1 }),
  type("number-line-six-points", "geometry", "길이와 측정", "여섯 점 수직선의 겹친 거리", { generator: "numberLineSixPoints", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("go-stone-difference", "pattern", "도형 규칙", "흑백 바둑돌의 개수 차이", { generator: "sourceGoStoneDifference", sourceMatched: true }),
  type("go-stone-difference-inverse", "pattern", "도형 규칙", "흑백 바둑돌 차로 번째 찾기", { generator: "goStoneDifferenceInverse", sourceMatched: true }),
  type("go-stone-difference-inverse-white", "pattern", "수열의 활용", "흰 돌이 더 많은 때의 번째 찾기", { generator: "goStoneDifferenceInverseWhite", sourceMatched: true }),
  type("number-card-plus-minus", "number", "수 카드와 식", "수 카드로 덧셈·뺄셈 식 완성", { generator: "numberCardEquation", sourceMatched: true }),
  type("number-card-mixed-operations", "number", "수 카드와 식", "수 카드를 혼합 계산식에 한 번씩 넣기", { generator: "mixedOperationCardEquation", sourceMatched: true }),
  type("two-digit-even-count", "number", "수 카드와 식", "수 카드로 만든 두 자리 짝수의 개수", { generator: "twoDigitEvenCount", sourceMatched: true }),
  type("two-digit-card-enumeration", "number", "수 카드와 식", "조건에 맞는 두 자리 수 모두 쓰기", { generator: "twoDigitCardEnumeration", sourceMatched: true }),
  type("erase-expression-target", "number", "수 카드와 식", "식의 일부를 지워 목표값 만들기", { generator: "eraseExpressionTarget", sourceMatched: true }),
  type("piano-bounce", "pattern", "반복 규칙", "피아노 건반 왕복 순서", { generator: "sourcePianoBounce", sourceMatched: true }),
  type("colored-shape-number", "pattern", "도형 수 표현", "색칠한 도형이 나타내는 수", { generator: "sourceColoredShapeNumber", sourceMatched: true }),
  type("height-order", "logic", "순서와 비교", "키의 크고 작은 순서"),
  type("g1-bus-two-stops", "number", "합과 차 문장제", "두 정류장에서 타고 내린 승객 수", { generator: "g1BusTwoStops", sourceMatched: true }),
  type("g1-height-order-four", "logic", "순서와 비교", "여러 사람의 키 순서 비교", { generator: "g1HeightOrder", sourceMatched: true }),
  type("g1-two-digit-ones-greater", "number", "조건에 맞는 수", "일의 자리 숫자가 더 큰 두 자리 수", { generator: "g1TwoDigitOnesGreater", sourceMatched: true }),
  type("g1-front-back-between", "logic", "순서와 비교", "앞·뒤 순서로 사이 사람 수 구하기", { generator: "g1FrontBackBetween", sourceMatched: true }),
  type("g1-shape-add-subtract-chain", "number", "복면산과 식", "도형 덧셈·뺄셈 관계를 차례로 풀기", { generator: "g1ShapeAddSubtractChain", sourceMatched: true }),
  type("g1-fold-cut-piece-count", "geometry", "색종이 접기", "두 번 접고 자른 색종이 조각 수", { generator: "g1FoldCutPieceCount", sourceMatched: true }),
  type("g1-repeated-digit-addition", "number", "복면산과 식", "같은 숫자가 반복된 세로 덧셈", { generator: "g1RepeatedDigitAddition", sourceMatched: true }),
  type("g1-multiplicative-symbol-chain", "number", "복면산과 식", "곱셈이 이어지는 도형 관계식", { generator: "g1MultiplicativeSymbolChain", sourceMatched: true }),
  type("g1-balance-three-relations", "logic", "무게 비교", "세 저울의 관계로 긴 네모 수 구하기", { generator: "g1BalanceThreeRelations", sourceMatched: true }),
  type("g1-stacked-shape-dual-cycle", "pattern", "반복 규칙", "도형 종류와 쌓인 개수의 이중 주기", { generator: "g1StackedShapeDualCycle", sourceMatched: true }),
  type("g1-triangle-color-difference", "pattern", "도형 규칙", "삼각형 배열의 흰 조각과 색칠 조각 차", { generator: "g1TriangleColorDifference", sourceMatched: true }),
  type("g1-shape-sum-grid-four", "number", "매트릭스", "네 도형의 4×4 가로·세로 합", { generator: "g1ShapeSumGridFour", sourceMatched: true }),
  type("g1-rod-ratio-total", "geometry", "길이와 측정", "두 막대의 칸 수 비와 합한 길이", { generator: "g1RodRatioTotal", sourceMatched: true }),
  type("g1-four-symbol-relation", "number", "복면산과 식", "네 도형의 세 관계식", { generator: "g1FourSymbolRelation", sourceMatched: true }),
  type("g1-polygon-stone-rearrangement", "geometry", "둘레와 배열", "다각형 둘레의 바둑돌 다시 늘어놓기", { generator: "g1PolygonStoneRearrangement", sourceMatched: true }),
  type("g1-paired-sequences", "pattern", "수 규칙", "두 줄 수열의 같은 번째 수", { generator: "g1PairedSequences", sourceMatched: true }),
  type("g1-ratio-distribution", "number", "합과 차 문장제", "서로 다른 먹는 양으로 사람 수 나누기", { generator: "g1RatioDistribution", sourceMatched: true }),
  type("g1-odd-even-sum-difference", "number", "연속수와 합", "1부터 어떤 수까지 홀짝 합의 차", { generator: "g1OddEvenSumDifference", sourceMatched: true }),
  type("hidden-score-ranking", "logic", "순서와 비교", "순위표의 가려진 서로 다른 숫자 찾기", { generator: "hiddenScoreRanking", sourceMatched: true }),
  type("total-difference", "number", "합과 차 문장제", "전체 수와 차이로 두 수 구하기", { generator: "totalDifference", sourceMatched: true, textbookSource: "더클래식 1과정 2권 18~21쪽·단원 테스트 3·5번" }),
  type("total-difference-candy", "number", "합과 차 문장제", "전체 사탕 수와 차이로 두 수 구하기", { generator: "totalDifferenceCandyShare", sourceMatched: true }),
  type("multi-person-transfer", "number", "합과 차 문장제", "여러 사람의 합과 주고받기"),
  type("fold-cut-piece-count", "geometry", "색종이 접기", "접고 자른 조각의 개수", { generator: "foldCutPieceCount", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("cryptarithm", "number", "복면산과 식", "세로셈 복면산"),
  type("multiplicative-symbol-equation", "number", "복면산과 식", "곱셈이 있는 도형 식"),
  type("rod-length-ratio", "geometry", "길이와 측정", "막대의 배수 관계와 전체 길이"),
  type("colored-triangle-difference", "pattern", "도형 규칙", "칠한 삼각형과 흰 삼각형의 차이"),
  type("polygon-stone-rearrangement", "geometry", "둘레와 배열", "다각형 바둑돌을 다른 모양으로 늘어놓기"),
  type("ratio-distribution", "number", "합과 차 문장제", "서로 다른 기준으로 전체 나누기"),
  type("paired-sequences", "pattern", "수 규칙", "두 수열의 대응 규칙", { generator: "pairedSequences", sourceMatched: true }),
  type("odd-even-sum-difference", "number", "연속수와 합", "홀수 합과 짝수 합의 차이"),
  type("weight-order", "logic", "순서와 비교", "무게 조건으로 순서 정하기"),
  type("adjacent-product-pentagon", "number", "수 배열과 곱", "이웃한 두 수의 곱으로 오각형 채우기"),
  type("segment-count", "geometry", "도형 세기", "원 위의 두 점을 이은 선분 개수"),
  type("square-side-composition", "geometry", "길이와 측정", "붙인 정사각형의 변의 길이"),
  type("rectilinear-perimeter", "geometry", "둘레와 배열", "직각으로 꺾인 도형의 둘레"),
  type("chained-number-condition", "logic", "조건 배치", "차이가 이어지는 수 카드 조건"),
  type("latin-square", "logic", "조건 배치", "가로·세로·굵은 칸 수 퍼즐"),
  type("vertical-addition", "number", "복면산과 식", "빈칸이 있는 세로 덧셈"),
  type("consecutive-number-addition", "number", "연속수와 합", "연속하는 수의 세로 덧셈"),
  type("step-game", "logic", "과정 추론", "승패 규칙에 따른 계단 위치"),
  type("multiplication-matrix", "number", "매트릭스", "곱에 맞게 수 매트릭스 채우기"),
  type("three-digit-card-count", "number", "수 카드와 식", "조건에 맞는 세 자리 수의 개수"),
  type("unused-number-card-equations", "number", "수 카드와 식", "여러 식에 수 카드를 한 번씩 쓰고 남는 수 찾기"),
  type("two-digit-card-threshold-count", "number", "수 카드와 식", "수 카드로 기준보다 큰 두 자리 수의 개수"),
  type("venn-count", "logic", "집합과 포함", "두 조건에 모두 해당하는 사람 수"),
  type("congruent-partition", "geometry", "도형 분할", "합이 같은 합동 도형으로 나누기"),
  type("triangle-count", "geometry", "도형 세기", "크고 작은 삼각형 세기"),
  type("square-count", "geometry", "도형 세기", "크고 작은 사각형 세기", { generator: "squareCountShape", sourceMatched: true }),
  type("calendar-weekday-sum", "pattern", "달력과 시간", "달력에서 같은 요일 날짜의 합"),
  type("person-item-logic", "logic", "조건 연결", "사람과 동물·음식 조건 연결", { generator: "personItemLogicBook1", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("set-union-count", "logic", "집합과 포함", "두 종류를 선택한 전체 사람 수", { generator: "setUnionCount", sourceMatched: true }),
  type("custom-operation", "number", "연산 약속", "새 기호의 계산 약속"),
  type("operator-insertion", "number", "수 카드와 식", "+와 -를 넣어 식 완성하기"),
  type("cut-recut-pieces", "number", "과정 추론", "자르고 먹고 다시 잘라 남은 조각 수"),
  type("alternating-line-total", "logic", "순서와 비교", "두 종류를 번갈아 세운 전체 인원"),
  type("reverse-initial-count", "logic", "과정 추론", "여러 번 오고 간 뒤 처음 수 거꾸로 찾기", { generator: "reverseInitialCount", sourceMatched: true }),
  type("function-machine", "pattern", "수 규칙", "수 변환 기계의 규칙"),
  type("collection-repeat-gap", "pattern", "수 규칙", "모으기 반복 수열에서 같은 수 사이 개수", { generator: "collectionRepeatGap", sourceMatched: true }),
  type("magic-square", "number", "수 배열과 합", "가로·세로·대각선 합이 같은 마방진", { legacyId: 14, generator: "magicSquare", sourceMatched: true }),
  type("fold-hole-count", "geometry", "색종이 접기", "접은 색종이의 구멍 개수", { generator: "paperFoldHoleCount", legacyId: 4, sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  // F24~F31: 파이널 2·3회 연결 재검토(FINAL-SOURCE-AUDIT.md)에서 분리된 유형.
  // 기존 유형과 이름이 비슷하지만 구조가 달라 새로 등록한다. 생성기가 검산을 통과하기 전까지 잠금.
  type("fold-diagonal-hole-count", "geometry", "색종이 접기", "대각선으로 여러 번 접은 색종이의 구멍 개수", { generator: "diagonalFoldHoleCount", sourceMatched: true }),
  type("row-column-sum-placement", "number", "수 배열과 합", "삼각형의 합에 맞게 1부터 차례로 놓기", { generator: "triangleSumPlacement", sourceMatched: true }),
  type("two-by-two-sum-fill", "number", "수 배열과 합", "2x2 칸을 행·열 합과 서로 다른 조건으로 채우기", { generator: "twoByTwoSumFill", sourceMatched: true }),
  type("shape-sum-grid-4", "number", "매트릭스", "4x4 도형표의 행·열 합으로 빈 합 구하기", { generator: "shapeSumGrid", sourceMatched: true }),
  type("vertical-cryptarithm-shape-sum", "number", "복면산과 식", "세로셈 복면산에서 세 도형이 나타내는 수의 합", { generator: "verticalCryptarithmShapeSum", sourceMatched: true }),
  // main 갈래에서 이식(2026-08-18). 파이널 2·3회 원본 전용 세부 유형이다.
  // 이름이 비슷한 기존 유형(symbol-relation·shape-matrix-rule·repeat-pattern·cube-hidden-count)과
  // 구조가 달라 별도로 둔다 — 합치지 말 것.
  type("symbol-chain-arithmetic", "number", "복면산과 식", "연속된 기호식으로 마지막 값 구하기", { generator: "symbolChainArithmetic", sourceMatched: true }),
  type("shape-matrix-three-features", "pattern", "도형 규칙", "바깥·안쪽 도형과 칠하기의 행렬 규칙", { generator: "shapeMatrixThreeFeatures", sourceMatched: true }),
  type("triangle-position-cycle", "pattern", "도형 규칙", "삼각형 안에서 칠한 위치가 반복되는 규칙", { generator: "trianglePositionCycle", sourceMatched: true }),
  type("cube-step-sequence", "geometry", "쌓기나무 규칙", "삼각 계단으로 커지는 쌓기나무의 전체 개수", geometryWorksheet("SQ", "L4", { generator: "cubeStepSequence", sourceMatched: true })),
  type("cube-hidden-count-walled", "geometry", "숨은 쌓기나무", "벽 모서리에서 보이지 않는 쌓기나무의 개수", geometryWorksheet("IH", "L3", { generator: "cubeHiddenCountWalled", sourceMatched: true })),
  type("triangle-max-edge-sum", "number", "수 배열과 합", "삼각형 세 변의 합을 같게 만들고 그 합을 가장 크거나 작게", { generator: "triangleMaxEdgeSum", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("split-merge-tree", "number", "수 배열과 합", "가르기·모으기 나무의 부모·자식 관계", { generator: "overlappingNumberBonds", sourceMatched: true }),
  type("border-go-stone-difference", "pattern", "도형 규칙", "테두리가 커지는 바둑돌의 흑백 차이", { generator: "borderGoStoneDifference", sourceMatched: true }),
  type("fold-diagonal-unfold", "geometry", "색종이 접기", "대각선으로 접고 자른 뒤 펼친 선 그리기"),
  type("fold-number-remaining-sum", "geometry", "색종이 접기", "번호 색종이를 접고 자른 뒤 남은 수의 합", { generator: "foldNumberRemainingSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 41·50쪽" }),
  // 교재 41·50쪽의 '뒤로 접은 2x2' 잘린 합. 실전 시험 검증본 fold-number-cut-sum(대각선 접기)과 이름이
  // 비슷하지만 구조가 다르다 — 합치지 말 것.
  type("fold-number-cut-sum-textbook", "geometry", "색종이 접기", "번호 색종이를 접고 자른 수의 합 (교재)", { generator: "foldNumberCutSumTextbook", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("fold-diagonal-number-sum", "geometry", "색종이 접기", "대각선 한 번 접기 숫자판의 잘린·남은 합", { generator: "foldDiagonalNumberSum", sourceMatched: true, textbookSource: "실전 1회 18번·2회 15번 유형" }),
  type("fold-target-sum-coloring", "geometry", "색종이 접기", "목표 합이 되게 색칠할 칸 고르기", { generator: "foldTargetSumColoring", sourceMatched: true, textbookSource: "더클래식 1과정 1권 41·50쪽 역방향" }),
  type("fold-punch-shape-count", "geometry", "색종이 접기", "반원·원 펀치를 펼친 모양 개수", { generator: "foldPunchShapeCount", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("fold-stack-find", "geometry", "색종이 접기", "겹친 색종이의 가장 밑·위 찾기", { generator: "foldStackFind", sourceMatched: true, textbookSource: "더클래식 1과정 1권 35~36·44~46쪽" }),
  type("fold-stack-order", "geometry", "색종이 접기", "겹친 색종이를 위에서부터 순서대로", { generator: "foldStackOrder", sourceMatched: true, textbookSource: "더클래식 1과정 1권 35~36·44~46쪽" }),
  type("fold-cut-shape-choice", "geometry", "색종이 접기", "접어 자르고 펼친 모양 고르기", { generator: "foldCutShapeChoice", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  // Geometry worksheet 13유형. 이름이 비슷해도 묻는 정보가 다르면 합치지 않는다.
  type("cube-top-number-grid", "geometry", "쌓기나무 바탕그림", "위에서 본 바탕그림의 수로 전체 개수와 앞·옆 모양 구하기", geometryWorksheet("TC", "L2")),
  type("cube-three-views", "geometry", "쌓기나무 바탕그림", "위·앞·옆 모양을 보고 쌓기나무 개수 구하기", geometryWorksheet("VC", "L3")),
  type("cube-three-view-minmax", "geometry", "쌓기나무 바탕그림", "위·앞·옆 모양으로 가능한 최대·최소 개수 구하기", geometryWorksheet("VM", "L3")),
  type("cube-missing-view", "geometry", "쌓기나무 바탕그림", "두 방향의 모양을 보고 나머지 방향 그리기", geometryWorksheet("VP", "L3")),
  type("cube-count-solid", "geometry", "쌓기나무 개수", "입체 그림에서 쌓기나무 전체 개수 세기", geometryWorksheet("IC", "L2", { sourceMatched: true })),
  type("cube-different-shape", "geometry", "쌓기나무", "같은 개수로 만든 입체 중 다른 모양", { geometryGame: "find-shape" }),
  type("cube-add-to-match", "geometry", "쌓기나무", "목표 입체까지 더 필요한 쌓기나무", { geometryGame: "copy-build" }),
  type("cube-fill-rectangular-box", "geometry", "쌓기나무 채우기", "직육면체 상자를 채우는 데 필요한 개수", geometryWorksheet("FB", "L3")),
  type("cube-fill-box", "geometry", "쌓기나무 채우기", "정육면체를 완성하는 데 필요한 개수", geometryWorksheet("CU", "L3", { generator: "cubeFillBoxWorksheet", sourceMatched: true })),
  type("cube-hidden-count", "geometry", "숨은 쌓기나무", "벽 없이 어느 쪽에서도 보이지 않는 쌓기나무의 개수", geometryWorksheet("IN", "L3", { sourceMatched: true })),
  type("cube-painted-faces", "geometry", "쌓기나무 색칠", "겉면을 칠한 뒤 색칠된 면의 전체 수", geometryWorksheet("PN", "L4", { worksheetOptions: { variant: "faces" } })),
  type("cube-painted-cube-count", "geometry", "쌓기나무 색칠", "색칠된 면의 수에 맞는 낱개 쌓기나무 개수", geometryWorksheet("PN", "L4", { worksheetOptions: { variant: "count" } })),
  type("cube-black-white-alternating", "geometry", "쌓기나무 색칠", "같은 색이 맞닿지 않게 쌓은 흰색·검은색 개수", geometryWorksheet("BW", "L3")),
  type("cube-tunnel", "geometry", "쌓기나무 구멍", "여러 방향으로 구멍을 뚫은 뒤 남은 개수", geometryWorksheet("HL", "L3")),
  type("cube-pattern-sequence", "geometry", "쌓기나무 규칙", "규칙에 따라 커지는 쌓기나무의 n번째 개수", geometryWorksheet("SQ", "L3", { worksheetOptions: { mode: "nth", excludeKinds: ["triangular-stair"] } })),
  type("cube-pattern-stage-from-count", "geometry", "쌓기나무 규칙", "쌓기나무 개수로 몇 번째 모양인지 찾기", geometryWorksheet("SQ", "L3", { worksheetOptions: { mode: "which", excludeKinds: ["triangular-stair"] } })),
  type("cube-pattern-next-increase", "geometry", "쌓기나무 규칙", "다음 모양에 더 필요한 쌓기나무 개수", geometryWorksheet("SQ", "L5", { worksheetOptions: { mode: "increment", excludeKinds: ["triangular-stair"] } })),
  type("shape-transform", "geometry", "도형 움직이기", "도형 돌리기·뒤집기·거울 보기", { status: "curriculum" }),
  type("gakuro", "number", "수 배열과 합", "가쿠로 퍼즐", { status: "curriculum" }),
  type("shortest-path", "geometry", "길과 위치", "최단거리와 길 찾기", { status: "curriculum" }),
  type("tree-planting", "number", "간격과 개수", "가로수 심기", { status: "curriculum" }),
  type("palindrome", "pattern", "수 규칙", "거꾸로 읽어도 같은 수", { status: "curriculum" }),
  type("catch-up", "number", "시간과 거리", "따라잡기", { status: "curriculum" }),
  type("number-baseball", "logic", "조건 추리", "숫자 야구게임", { status: "curriculum" }),
  type("unit-area-fraction", "geometry", "넓이와 분수", "단위넓이와 분수", { status: "curriculum" }),
  type("unit-length-multiple", "geometry", "길이와 측정", "단위길이와 배수", { status: "curriculum" }),
  type("magic-card", "number", "수 카드와 식", "마법카드로 수 찾기", { status: "curriculum" }),
  type("reverse-thinking", "logic", "과정 추론", "거꾸로 생각하기", { generator: "halfGiveReverse", sourceMatched: true }),
  type("argument-logic", "logic", "조건 추리", "조건을 따져 옳고 그름 판단하기", { status: "curriculum" }),

  // 더클래식 1과정 1권: 단원 안에서도 실제 문항의 풀이 구조가 바뀌는 곳마다
  // 별도 유형으로 나눈다. 페이지는 판본마다 달라질 수 있어 문제 번호만 런타임에 쓴다.
  type("shape-mirror-direction", "geometry", "도형 움직이기", "거울에 비친 도형의 방향 찾기", { generator: "shapeMirrorDirection", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("shape-quarter-half-turn", "geometry", "도형 움직이기", "도형을 반의 반 바퀴·반 바퀴 돌리기", { generator: "shapeQuarterHalfTurn", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("shape-flip-composition", "geometry", "도형 움직이기", "뒤집기와 돌리기를 차례로 적용하기", { generator: "shapeFlipComposition", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("rotational-partition-two", "geometry", "도형 분할", "돌려 겹치는 두 도형으로 나누기", { generator: "rotationalPartitionTwo", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("rotational-partition-four", "geometry", "도형 분할", "돌려 겹치는 네 도형으로 나누기", { generator: "rotationalPartitionFour", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("symbol-balanced-congruent-partition", "geometry", "도형 분할", "기호를 똑같이 가진 합동 도형으로 나누기", { generator: "symbolBalancedCongruentPartition", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-digit-transform", "pattern", "디지털 숫자", "디지털 숫자를 뒤집거나 돌린 결과", { generator: "digitalDigitTransform", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-two-digit-transform", "pattern", "디지털 숫자", "두 자리 디지털 수를 움직인 결과", { generator: "digitalTwoDigitTransform", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-transform-board-sum", "number", "디지털 숫자", "숫자판을 움직여 나온 수의 합", { generator: "digitalTransformBoardSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-transform-addition", "number", "디지털 숫자", "디지털 수를 움직여 덧셈 완성하기", { generator: "digitalTransformAddition", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circular-magic-line-sum", "number", "마방진", "원 모양에서 마주 보는 두 수의 합 같게 만들기", { generator: "circularMagicLineSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("cross-shape-magic-sum", "number", "마방진", "십자·T자 모양의 줄 합 같게 만들기", { generator: "crossShapeMagicSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-card-placement", "number", "가쿠로", "수 카드를 가로·세로 합에 맞게 놓기", { generator: "gakuroCardPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-grid-sum", "number", "가쿠로", "가쿠로 칸을 줄의 합에 맞게 채우기", { generator: "gakuroGridSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circle-line-ring-equal-sum", "number", "수 배열과 합", "원 둘레와 지름의 수 합 같게 만들기", { generator: "circleLineRingEqualSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digit-sum-enumeration", "number", "조건에 맞는 수", "각 자리 숫자의 합이 같은 수 모두 찾기", { generator: "digitSumEnumeration", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("three-digit-step-sequence", "pattern", "수 추리", "같은 수만큼 변하는 세 자리 수열", { generator: "threeDigitStepSequence", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("place-value-condition-three", "number", "조건에 맞는 수", "자릿값 조건으로 세 자리 수 찾기", { generator: "placeValueConditionThree", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("place-value-condition-four", "number", "조건에 맞는 수", "자릿값 조건으로 네 자리 수 찾기", { generator: "placeValueConditionFour", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("relative-order-logic", "logic", "순서와 비교", "여러 사람의 앞뒤·크기 순서 추리", { generator: "relativeOrderLogicBook1", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),

  // 더클래식 1과정 3권: 페이지가 아니라 단원·단계·문항 번호로 원본을 대조했다.
  // 같은 단원 안에서도 풀이 구조가 달라지는 지점마다 별도 생성기로 나눈다.
  type("tangram-shape-composition", "geometry", "칠교와 넓이", "칠교 조각으로 같은 모양 완성하기", { generator: "tangramShapeComposition", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("tangram-piece-area", "geometry", "칠교와 넓이", "칠교 조각과 만든 도형의 넓이", { generator: "tangramPieceArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("unit-grid-area", "geometry", "단위넓이", "모눈에서 온칸과 반칸을 세어 넓이 구하기", { generator: "unitGridArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("growing-shape-area-sum", "pattern", "넓이 규칙", "커지는 정사각형·정삼각형 넓이의 합", { generator: "growingShapeAreaSum", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("nested-square-outer-area", "pattern", "넓이 규칙", "겹쳐 커지는 가장 바깥 정사각형의 넓이", { generator: "nestedSquareOuterArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-part-shaded-fraction", "geometry", "도형의 분할과 분수", "똑같이 나눈 도형의 색칠한 부분을 분수로 나타내기", { generator: "equalPartShadedFraction", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-partition-drawing", "geometry", "도형의 분할과 분수", "도형을 주어진 수만큼 똑같이 나누어 색칠하기", { generator: "equalPartitionDrawing", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("incomplete-partition-fraction", "geometry", "도형의 분할과 분수", "빠진 선을 그어 같은 조각으로 나눈 뒤 분수 구하기", { generator: "incompletePartitionFraction", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("oblique-square-grid-area", "geometry", "단위넓이", "모눈 위 기울어진 정사각형의 넓이", { generator: "obliqueSquareGridArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  type("folded-strip-length", "geometry", "단위길이", "모눈 위 접힌 테이프·리본의 전체 길이", { generator: "foldedStripLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("midpoint-number-line", "geometry", "수직선과 길이", "수직선에서 두 수의 중간수 찾기", { generator: "midpointNumberLine", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("segment-chain-distance", "geometry", "수직선과 길이", "겹쳐 주어진 여러 점 사이의 거리", { generator: "segmentChainDistance", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-interval-length", "geometry", "수직선과 길이", "똑같이 나눈 한 칸의 거리", { generator: "equalIntervalLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("walking-step-ratio", "number", "배수 문장제", "한 걸음 길이의 배수로 걸음 수 구하기", { generator: "walkingStepRatio", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("route-distance-multiple", "number", "배수 문장제", "이어진 두 길의 거리 배수 구하기", { generator: "routeDistanceMultiple", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("rod-ratio-total-book3", "geometry", "막대와 배수", "막대의 묶음 수와 전체 길이로 각각의 길이 구하기", { generator: "rodRatioTotalBook3", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("unit-object-length", "geometry", "단위길이", "같은 물건 여러 개로 잰 한 개의 길이", { generator: "unitObjectLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equivalent-object-length", "geometry", "단위길이", "여러 물건을 늘어놓은 같은 길이 관계", { generator: "equivalentObjectLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("proportional-rods-common-total", "geometry", "막대와 배수", "같은 전체 길이를 이루는 막대들의 길이", { generator: "proportionalRodsCommonTotal", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("meeting-distance-ratio", "number", "거리와 배수", "속도의 배수로 만날 때까지 간 거리 나누기", { generator: "meetingDistanceRatio", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("mixed-interval-distance", "geometry", "수직선과 길이", "서로 다른 간격으로 나눈 수직선의 거리", { generator: "mixedIntervalDistance", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("difference-unit-measure", "geometry", "단위길이", "두 단위길이의 차로 전체 길이 재기", { generator: "differenceUnitMeasure", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  type("cryptarithm-single-double", "number", "복면산", "한 자리 같은 도형을 두 번 더하는 복면산", { generator: "cryptarithmSingleDouble", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-repeated-number-double", "number", "복면산", "같은 도형으로 만든 두 자리 수를 두 번 더하기", { generator: "cryptarithmRepeatedNumberDouble", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-fixed-digit-addition", "number", "복면산", "도형과 주어진 숫자가 섞인 덧셈", { generator: "cryptarithmFixedDigitAddition", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-missing-digit-column", "number", "복면산", "자리별 빈 숫자를 채우는 세로 덧셈", { generator: "cryptarithmMissingDigitColumn", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-multi-symbol-carry", "number", "복면산", "여러 도형과 받아올림이 함께 있는 복면산", { generator: "verticalCryptarithmShapeSum", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-linked-equations", "number", "복면산", "서로 이어진 두 복면산으로 도형 값 찾기", { generator: "cryptarithmLinkedEquations", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  type("binary-weight-selection", "number", "마법카드와 도형수", "1·2·4·8 무게추로 목표 무게 만들기", { generator: "binaryWeightSelection", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("colored-cell-number-code", "pattern", "마법카드와 도형수", "색칠한 칸의 자리값을 더해 수 나타내기", { generator: "coloredCellNumberCode", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("symbol-value-code", "number", "마법카드와 도형수", "도형 기호마다 정해진 값을 더해 비밀 수 찾기", { generator: "symbolValueCode", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-three-complete", "number", "마방진", "주어진 아홉 수로 3×3 마방진 완성하기", { generator: "magicSquareThreeComplete", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-three-target", "number", "마방진", "3×3 마방진의 색칠한 한 칸 구하기", { generator: "magicSquareThreeTarget", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-four-target", "number", "마방진", "4×4 마방진의 색칠한 한 칸 구하기", { generator: "magicSquareFourTarget", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("polygon-ring-equal-sum", "number", "수 배열과 합", "오각진의 다섯 줄 합을 같게 만들기", { generator: "polygonRingEqualSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("triangle-edge-sum-six", "number", "수 배열과 합", "1부터 6까지로 삼각형 세 변의 합 맞추기", { generator: "triangleEdgeSumSix", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("triangle-edge-sum-nine", "number", "수 배열과 합", "1부터 9까지로 삼각형 세 변의 합 맞추기", { generator: "triangleEdgeSumNine", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-four-complete", "number", "마방진", "1부터 16까지로 4×4 마방진 완성하기", { generator: "magicSquareFourComplete", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  // 더클래식 1과정 4권: 153문항을 단계와 인쇄 문제 번호로 직접 대조했다.
  // 기존 검증 유형과 풀이 구조가 같은 문항은 재사용하고, 다른 구조만 새 유형으로 둔다.
  type("tetromino-family-choice", "geometry", "도형 분할", "정사각형 네 칸을 이어 만든 테트로미노 찾기", { generator: "tetrominoFamilyChoice", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("tetromino-square-composition", "geometry", "도형 분할", "돌려서 빈자리에 맞는 네 칸 조각 고르기", { generator: "tetrominoSquareComposition", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("digital-grid-transform", "pattern", "디지털 숫자", "숫자 배열판을 돌리거나 뒤집은 자리 찾기", { generator: "digitalGridTransform", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("digital-transform-arithmetic", "number", "디지털 숫자", "움직인 디지털 두 자리 수의 덧셈·뺄셈", { generator: "digitalTransformArithmetic", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("fold-number-grid-multi", "geometry", "색종이 접기", "번호판을 한두 번 접어 잘린 수의 합 구하기", { generator: "foldNumberGridMulti", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("fold-surface-top-trace", "geometry", "색종이 접기", "여러 번 접은 색종이의 맨 위 색 찾기", { generator: "foldSurfaceTopTrace", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("pair-sum-card-completion", "number", "합과 차", "합이 같은 두 수 카드의 빈 카드 찾기", { generator: "pairSumCardCompletion", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("shape-difference-chain", "number", "비교와 차", "도형 사이의 차를 이어 새로운 차 구하기", { generator: "shapeDifferenceChain", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("measurement-order-chain", "logic", "순서와 비교", "키·나이·거리의 차를 이어 값과 순서 구하기", { generator: "measurementOrderChain", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("balance-unit-ratio", "logic", "양팔저울", "저울의 물건 개수 관계를 이어 같은 무게 구하기", { generator: "balanceUnitRatio", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("directional-seat-placement", "logic", "자리 배치", "위·아래·좌우 조건으로 자리 정하기", { generator: "directionalSeatPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("circular-seat-placement", "logic", "자리 배치", "시계 방향 조건으로 원탁 자리 정하기", { generator: "circularSeatPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("ordinal-line-placement", "logic", "자리 배치", "앞·뒤 순서와 사이 사람 수로 줄의 자리 정하기", { generator: "ordinalLinePlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),

  // 더클래식 1과정 5권: 154문항을 단계와 인쇄 문제 번호로 직접 대조했다.
  // 같은 수 규칙처럼 보여도 이동 경로·대각선 채우기·줄 순환처럼 풀이가 다르면 분리한다.
  type("sequential-path-number-grid", "pattern", "수 배열 경로", "선을 따라 차례로 이어지는 수 배열", { generator: "sequentialPathNumberGrid", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("diagonal-fill-number-grid", "pattern", "수 배열 경로", "대각선 방향으로 채우는 수 배열", { generator: "diagonalFillNumberGrid", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("line-cycle-number-table", "pattern", "수 배열 경로", "여러 줄에 번갈아 놓은 수의 규칙", { generator: "lineCycleNumberTable", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("finger-bounce-sequence", "pattern", "수열의 활용", "손가락을 왕복하며 세는 수의 위치", { generator: "fingerBounceSequence", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("calendar-month-position", "pattern", "달력 규칙", "한 달 달력에서 날짜와 요일 찾기", { generator: "calendarMonthPosition", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("calendar-cross-month-weekday", "pattern", "달력 규칙", "달을 건너간 날짜와 요일 찾기", { generator: "calendarCrossMonthWeekday", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("calendar-same-weekday-sum", "pattern", "달력 규칙", "같은 요일 두 날짜의 합으로 날짜 찾기", { generator: "calendarSameWeekdaySum", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),

  type("shortest-path-rectangle", "logic", "최단거리", "직사각형 길의 가장 짧은 방법 수", { generator: "shortestPathRectangle", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("shortest-path-irregular-grid", "logic", "최단거리", "막힌 곳이 있는 길의 가장 짧은 방법 수", { generator: "shortestPathIrregularGrid", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("shortest-path-via-waypoint", "logic", "최단거리", "정해진 점을 꼭 지나는 가장 짧은 방법 수", { generator: "shortestPathViaWaypoint", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("digit-card-number-enumeration", "number", "숫자 카드", "숫자 카드로 만들 수 있는 수의 개수", { generator: "digitCardNumberEnumeration", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("digit-card-ranked-number", "number", "숫자 카드", "숫자 카드로 만든 수의 크기 순서", { generator: "digitCardRankedNumber", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("two-digit-digit-sum-rank", "number", "숫자 카드", "두 자리 숫자의 합 조건과 크기 순서", { generator: "twoDigitDigitSumRank", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("two-digit-digit-difference-rank", "number", "숫자 카드", "두 자리 숫자의 차 조건과 크기 순서", { generator: "twoDigitDigitDifferenceRank", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),

  type("multiplication-table-pattern", "number", "곱셈 매트릭스", "가로와 세로 머리수의 곱셈표", { generator: "multiplicationTablePattern", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("product-cycle-completion", "number", "곱셈 매트릭스", "다각형 이웃한 꼭짓점의 곱 완성", { generator: "productCycleCompletion", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("multiplication-matrix-products", "number", "곱셈 매트릭스", "가로·세로의 곱으로 빈칸 찾기", { generator: "multiplicationMatrixProducts", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("multiplication-matrix-placement", "logic", "곱셈 매트릭스", "수 카드를 놓아 가로·세로의 곱 맞추기", { generator: "multiplicationMatrixPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("symbol-product-pair", "number", "도형 곱셈식", "두 도형의 곱과 합으로 값 찾기", { generator: "symbolProductPair", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("symbol-multiplication-chain", "number", "도형 곱셈식", "이어진 도형 곱셈식으로 값 찾기", { generator: "symbolMultiplicationChain", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("symbol-mixed-operation-grid", "number", "도형 곱셈식", "곱셈·덧셈·뺄셈이 섞인 도형식", { generator: "symbolMixedOperationGrid", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),

  type("handshake-pair-count", "logic", "두 명씩 짝짓기", "모든 사람이 한 번씩 악수한 횟수", { generator: "handshakePairCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("pair-selection-count", "logic", "두 명씩 짝짓기", "서로 다른 두 개를 고르는 방법 수", { generator: "pairSelectionCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("complete-graph-segment-count", "geometry", "선분 세기", "여러 점을 서로 이은 선분 수", { generator: "completeGraphSegmentCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("inverse-pair-count", "logic", "두 명씩 짝짓기", "악수 횟수로 사람 수 거꾸로 찾기", { generator: "inversePairCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("square-number-odd-sum", "pattern", "삼각수와 사각수", "연속한 홀수의 합으로 사각수 만들기", { generator: "squareNumberOddSum", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("pascal-row-sum", "pattern", "수 배열 규칙", "위의 두 수를 더해 만든 줄의 합", { generator: "pascalRowSum", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("triangle-figure-count", "geometry", "도형 세기", "크고 작은 삼각형의 전체 개수", { generator: "triangleFigureCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("square-grid-count-book5", "geometry", "도형 세기", "모눈에서 크고 작은 정사각형의 전체 개수", { generator: "squareGridCount", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("triangular-row-boundary-number", "pattern", "삼각수와 사각수", "줄마다 하나씩 늘어나는 수 배열의 첫 수·끝 수", { generator: "triangularRowBoundaryNumber", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("square-row-boundary-number", "pattern", "삼각수와 사각수", "줄마다 홀수 개씩 늘어나는 수 배열의 첫 수·끝 수", { generator: "squareRowBoundaryNumber", sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" }),
  type("cube-triangular-wall-growth", "geometry", "쌓기나무 규칙", "한 줄 계단으로 커지는 쌓기나무의 전체 개수", geometryWorksheet("SQ", "L3", { worksheetOptions: { kind: "stair", mode: "nth" }, sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" })),
  type("cube-tetrahedral-growth", "geometry", "쌓기나무 규칙", "삼각 계단으로 커지는 쌓기나무의 전체 개수", geometryWorksheet("SQ", "L4", { worksheetOptions: { kind: "triangular-stair", mode: "nth" }, sourceMatched: true, textbookSource: "더클래식 1과정 5권 · 문제 번호별 대조" })),

  // 더클래식 1과정 2권: 단원 이름이 아니라 실제 풀이 구조로 나눈 세부 유형이다.
  // 원본 페이지와 단원 테스트를 대조한 항목만 sourceMatched로 기록한다. 생성기가 없는
  // 유형은 커리큘럼 화면에 보이되, 검증이 끝날 때까지 선택할 수 없다.
  type("equal-partition-two", "number", "똑같이 가르기", "짝수를 두 수로 똑같이 가르기", { generator: "equalPartitionTwo", sourceMatched: true, textbookSource: "더클래식 1과정 2권 6~7쪽" }),
  type("equal-partition-four", "number", "똑같이 가르기", "반의 반으로 네 수를 똑같이 가르기", { generator: "equalPartitionFour", sourceMatched: true, textbookSource: "더클래식 1과정 2권 8쪽" }),
  type("equal-partition-three", "number", "똑같이 가르기", "세 수로 똑같이 가르기", { generator: "equalPartitionThree", sourceMatched: true, textbookSource: "더클래식 1과정 2권 9쪽" }),
  type("reverse-transfer-total", "number", "주고받기", "준 뒤의 수로 처음 가진 수 거꾸로 찾기", { generator: "reverseTransferTotal", sourceMatched: true, textbookSource: "더클래식 1과정 2권 22쪽·단원 테스트 24번" }),
  type("balance-order-chain", "logic", "양팔저울", "여러 양팔저울로 물건의 무게 순서 정하기", { generator: "balanceOrderChain", sourceMatched: true, textbookSource: "더클래식 1과정 2권 40~42쪽" }),
  type("balance-given-unit-weight", "logic", "양팔저울", "한 물건의 무게로 다른 물건의 무게 구하기", { generator: "balanceGivenUnitWeight", sourceMatched: true, textbookSource: "더클래식 1과정 2권 43~44쪽·단원 테스트 7·9번" }),
  type("distinct-shape-value-equation", "number", "도형이 나타내는 수", "서로 다른 수를 나타내는 도형 식", { generator: "distinctShapeValueEquation", sourceMatched: true, textbookSource: "더클래식 1과정 2권 45~50쪽·단원 테스트 6·8·23번" }),
  type("constant-step-number-sequence", "pattern", "수열", "같은 수만큼 늘거나 줄어드는 수열", { generator: "constantStepNumberSequence", sourceMatched: true, textbookSource: "더클래식 1과정 2권 64·69·78쪽" }),
  type("interleaved-number-sequence", "pattern", "수열", "두세 수열이 번갈아 나오는 징검다리 수열", { generator: "bookInterleavedNumberSequence", sourceMatched: true, textbookSource: "더클래식 1과정 2권 64~68·78·81쪽·단원 테스트 12번" }),
  type("previous-two-sum-sequence", "pattern", "수열", "앞의 두 수를 더해 만드는 수열", { generator: "previousTwoSumSequence", sourceMatched: true, textbookSource: "더클래식 1과정 2권 68·69·82쪽" }),
  type("repeating-number-sequence", "pattern", "반복 수열", "수 반복마디의 빈칸 찾기", { generator: "repeatingNumberSequence", sourceMatched: true, textbookSource: "더클래식 1과정 2권 65·78~79쪽" }),
  type("repeating-symbol-sequence", "pattern", "반복 규칙", "모양·색·개수 반복마디의 다음 모양", { generator: "repeatingSymbolSequence", sourceMatched: true, textbookSource: "더클래식 1과정 2권 66·79~80쪽·단원 테스트 10·11번" }),
  type("progressive-number-table", "pattern", "수 배열 규칙", "단계별 수 표의 규칙으로 빈 단계 완성하기", { generator: "progressiveNumberTable", sourceMatched: true, textbookSource: "더클래식 1과정 2권 82쪽" }),
  type("matchstick-shared-polygon-growth", "pattern", "성냥개비 규칙", "맞닿은 변을 함께 쓰는 다각형의 성냥개비 수", { generator: "matchstickSharedPolygonGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 70·83쪽·단원 테스트 13번" }),
  type("triangular-stone-growth", "pattern", "바둑돌 규칙", "삼각형으로 늘어나는 흑백 바둑돌의 개수 차", { generator: "triangularStoneGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 71·75·84쪽·단원 테스트 25번" }),
  type("square-border-stone-growth", "pattern", "바둑돌 규칙", "네모 테두리로 늘어나는 흑백 바둑돌의 개수 차", { generator: "squareBorderStoneGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 72·84~85쪽" }),
  type("staircase-tile-growth", "pattern", "도형 개수 규칙", "계단 모양 타일의 단계별 전체 개수", { generator: "staircaseTileGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 73쪽" }),
  type("repeated-fold-cut-count", "pattern", "접기와 개수 규칙", "계속 반으로 접고 선대로 자른 종이 수", { generator: "repeatedFoldCutCount", sourceMatched: true, textbookSource: "더클래식 1과정 2권 73·76쪽·단원 테스트 15번" }),
  type("colored-triangle-growth", "pattern", "도형 개수 규칙", "늘어나는 삼각형에서 두 색의 개수 차", { generator: "coloredTriangleGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 74·85쪽·단원 테스트 14번" }),
  type("nested-circle-count", "geometry", "도형 개수 규칙", "겹쳐 그린 원에서 찾을 수 있는 원의 개수", { generator: "nestedCircleCount", sourceMatched: true, textbookSource: "더클래식 1과정 2권 75쪽" }),
  type("cube-square-layer-growth", "geometry", "쌓기나무", "홀수 정사각형 층을 쌓은 쌓기나무의 전체 개수", { generator: "cubeSquareLayerGrowth", sourceMatched: true, textbookSource: "더클래식 1과정 2권 77쪽" }),
  type("growing-segment-count", "pattern", "선분 규칙", "단계가 커지는 그림의 선분 개수", { generator: "growingSegmentCount", sourceMatched: true, textbookSource: "더클래식 1과정 2권 86쪽" }),
  type("fold-punch-doubling", "geometry", "접기와 개수 규칙", "계속 반으로 접어 뚫은 구멍의 전체 개수", { generator: "foldPunchDoubling", sourceMatched: true, textbookSource: "더클래식 1과정 2권 86쪽" }),
  type("four-number-center-rule", "number", "수 사이의 약속", "바깥 네 수의 관계로 가운데 수 구하기", { generator: "fourNumberCenterRule", sourceMatched: true, textbookSource: "더클래식 1과정 2권 90~93·95~96·103~108쪽·단원 테스트 18·21번" }),
  type("number-grid-row-rule", "number", "수 사이의 약속", "각 줄의 같은 계산 규칙으로 수 표 완성하기", { generator: "numberGridRowRule", sourceMatched: true, textbookSource: "더클래식 1과정 2권 90·93~94·103~108쪽·단원 테스트 16·17번" }),
  type("two-digit-compose-rule", "number", "수 사이의 약속", "두 자리 수를 만들고 더하거나 빼는 약속", { generator: "twoDigitComposeRule", sourceMatched: true, textbookSource: "더클래식 1과정 2권 90·95쪽" }),
  type("sudoku-three-row-column", "logic", "스도쿠", "1부터 3까지 가로·세로에 한 번씩 넣기", { generator: "sudokuThreeRowColumn", sourceMatched: true, textbookSource: "더클래식 1과정 2권 98·109쪽" }),
  type("sudoku-three-region", "logic", "스도쿠", "1부터 3까지 가로·세로·굵은 칸에 한 번씩 넣기", { generator: "sudokuThreeRegion", sourceMatched: true, textbookSource: "더클래식 1과정 2권 97·109쪽·단원 테스트 19번" }),
  type("sudoku-four-square-region", "logic", "스도쿠", "1부터 4까지 2×2 굵은 칸에 한 번씩 넣기", { generator: "sudokuFourSquareRegion", sourceMatched: true, textbookSource: "더클래식 1과정 2권 99~100·110쪽·단원 테스트 20번" }),
  type("sudoku-four-irregular-region", "logic", "스도쿠", "1부터 4까지 굵은 불규칙 칸에 한 번씩 넣기", { generator: "sudokuFourIrregularRegion", sourceMatched: true, textbookSource: "더클래식 1과정 2권 101~104·110~111쪽" })
];

const byId = Object.fromEntries(TYPES.map((item) => [item.id, item]));
const EXAM_PAGE_COUNTS = {
  "k6-2023-02": 12, "k7-2022-04": 12, "k7-2022-06": 12, "k7-2022-08": 12, "k7-2022-12": 12,
  "g1-2022-03": 7, "g1-2022-05": 7, "g1-2019-08": 7, "g1-2022-02": 7
};
const question = (number, typeId, note = "") => ({
  number,
  typeId,
  note: note || byId[typeId]?.label || "",
  difficulty: "actual",
  verified: false
});

const makeExam = ({ id, stage, label, file, layout, typeIds, verifiedQuestionNumbers = [] }) => ({
  id, stage, label, file, sourcePageCount: EXAM_PAGE_COUNTS[id], verified: verifiedQuestionNumbers.length === typeIds.length,
  questions: typeIds.map((typeId, index) => ({ ...question(index + 1, typeId), verified: verifiedQuestionNumbers.includes(index + 1) })),
  pageFor(number) {
    return layout === "four" ? Math.floor((number - 1) / 4) + 3 : Math.floor((number - 1) / 2) + 3;
  }
});

export const EXAMS = [
  makeExam({
    id: "k6-2023-02", stage: "k6_winter", label: "더 클래식 7세 1차 선발시험",
    file: "더_클래식_7세_1차_선발시험(230206).pdf", layout: "two",
    typeIds: ["edge-sum-grid","equalize-transfer","number-pyramid","nonadjacent-placement","order-position","disc-number-rule","shape-sum-table","shape-repeat-ordinal","arrow-number-grid","bus-change","number-card-plus-minus","equal-line-sum","two-digit-condition","growing-shape-count","symbol-sum-grid","piano-bounce","balance-scale","symbol-relation","colored-shape-number","go-stone-difference"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-04", stage: "k7_spring", label: "더 클래식 7세 2차 선발시험",
    file: "(최종)더_클래식_7세_2차_선발시험(220418).pdf", layout: "two",
    typeIds: ["edge-sum-grid","equalize-transfer","five-card-sum-pyramid","grid-number-placement","order-position-from-back","addition-table-grid","shape-sum-table-bottom-target","repeat-three-shapes","arrow-number-path-seven","bus-change","fold-number-cut-sum","equal-line-sum-eight-cards","symbol-sum-grid-square-top","shape-equation-add-subtract","two-digit-parity-gap","triangle-tile-growth","balance-scale-three-objects","symbol-relation-2to3","number-line-six-points","go-stone-difference-inverse"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-06", stage: "k7_summer", label: "더 클래식 7세 3차 선발시험",
    file: "더_클래식_7세_3차_선발시험(220622).pdf", layout: "two",
    typeIds: ["edge-sum-grid","repeat-four-shapes","l-grid-placement","order-position-from-front","total-difference","five-card-sum-pyramid","addition-table-grid","shape-sum-table-column-target","arrow-number-path-seven","bus-board-then-leave","shape-sum-grid-top-target","equal-line-sum-eight-cards-twelve","shape-equation-add-subtract","two-digit-odd-gap","square-tile-growth","fold-number-cut-sum-l-shape","balance-scale-four-objects","symbol-relation-3to4","number-line-six-points","go-stone-difference-inverse"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-08", stage: "k7_november", label: "더 클래식 7세 4차 선발시험",
    file: "더_클래식_7세_4차_선발시험(220812).pdf", layout: "two",
    typeIds: ["edge-sum-grid","vertical-stair-grid-placement","repeat-four-items-with-duplicate","five-card-sum-pyramid","order-position-from-front","addition-table-grid-offset","arrow-number-path-seven","shape-sum-table-repeated-column-target","equal-line-sum-eight-cards-fifteen-top-left","total-difference","two-digit-even-ones-greater-gap","shape-sum-grid-triangle-column-target","bus-board-then-leave","shape-equation-add-subtract","fold-number-cut-sum-main-diagonal","square-tile-growth","balance-scale-star-target","symbol-relation-3to4","number-line-six-points","go-stone-difference-inverse-white"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-12", stage: "k7_to_g1", label: "더 클래식 7세 6차 선발시험",
    file: "더_클래식_7세_6차_선발시험(221215).pdf", layout: "two",
    typeIds: ["edge-sum-grid","grid-number-placement-five","number-pyramid","addition-table-grid-bottom-left","arrow-number-horizontal-tens","order-position-seven-people","equal-line-sum-eight-cards-twelve","shape-sum-table-row-target","bus-board-then-leave","shape-equation-add-subtract","repeat-shape-color-dual","total-difference-candy","two-digit-odd-bounded-gap","shape-sum-grid-triangle-top","triangle-tile-growth","balance-scale-circle-target","fold-number-cut-sum","symbol-relation-3to4","go-stone-difference-inverse","number-line-six-points"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "g1-2022-03", stage: "g1_spring", label: "더 클래식 초1 1차 선발시험",
    file: "더_클래식_1학년_1차_선발시험(20220307).pdf", layout: "four",
    typeIds: ["g1-bus-two-stops","g1-height-order-four","equalize-transfer","g1-two-digit-ones-greater","total-difference","g1-front-back-between","g1-shape-add-subtract-chain","g1-fold-cut-piece-count","g1-repeated-digit-addition","g1-multiplicative-symbol-chain","g1-balance-three-relations","g1-stacked-shape-dual-cycle","g1-triangle-color-difference","g1-shape-sum-grid-four","g1-rod-ratio-total","g1-four-symbol-relation","g1-polygon-stone-rearrangement","g1-paired-sequences","g1-ratio-distribution","g1-odd-even-sum-difference"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "g1-2022-05", stage: "g1_summer", label: "더 클래식 초1 2차 선발시험",
    file: "더_클래식_1학년_2차_선발시험(20220530).pdf", layout: "four",
    typeIds: ["equalize-transfer","height-order","two-digit-condition","balance-scale","weight-order","shape-equation","adjacent-product-pentagon","shape-sum-table","segment-count","shape-sum-table","cryptarithm","rod-length-ratio","colored-triangle-difference","square-side-composition","fold-cut-piece-count","symbol-relation","repeat-pattern","ratio-distribution","rectilinear-perimeter","paired-sequences"]
  }),
  makeExam({
    id: "g1-2019-08", stage: "g1_fall", label: "더 클래식 초1 3차 선발시험",
    file: "더_클래식_1학년_3차_선발시험(20190828).pdf", layout: "four",
    typeIds: ["multi-person-transfer","height-order","balance-scale","two-digit-condition","chained-number-condition","grid-number-placement","adjacent-product-pentagon","shape-sum-table","rod-length-ratio","square-side-composition","cryptarithm","colored-triangle-difference","fold-cut-piece-count","vertical-addition","vertical-addition","rectilinear-perimeter","number-table-rule","repeat-pattern","cryptarithm","consecutive-number-addition"]
  }),
  makeExam({
    id: "g1-2022-02", stage: "g1_winter", label: "더 클래식 초1 4차 선발시험",
    file: "더_클래식_1학년_4차_선발시험(20220215).pdf", layout: "four",
    typeIds: ["magic-square","multiplication-matrix","shape-sum-table","step-game","latin-square","cryptarithm","repeat-pattern","two-digit-condition","total-difference","order-position","height-order","multiplication-matrix","three-digit-card-count","balance-scale","chained-number-condition","venn-count","polygon-stone-rearrangement","ratio-distribution","ratio-distribution","odd-even-sum-difference"]
  })
];

export const PRACTICE_EXAM_TYPES = [
  { id: "mock-1", label: "필즈 대비 실전 1회", questions: ["repeat-shape-color-dual","edge-sum-grid","grid-number-placement-five","five-card-sum-pyramid","order-position-seven-people","arrow-number-grid","addition-table-grid-offset","total-difference","shape-sum-table-bottom-target","equal-line-sum-eight-cards-twelve","bus-board-then-leave","shape-sum-table-bottom-target","shape-equation-add-subtract","two-digit-parity-gap","balance-scale-star-target","square-tile-growth","symbol-relation","fold-number-cut-sum-main-diagonal","go-stone-difference-inverse","number-line-six-points"] },
  { id: "mock-2", label: "필즈 대비 실전 2회", questions: ["edge-sum-grid","l-grid-placement","repeat-four-items-with-duplicate","five-card-sum-pyramid","order-position","addition-table-grid-offset","arrow-number-grid","shape-sum-table-bottom-target","equal-line-sum-eight-cards-fifteen-top-left","total-difference","two-digit-even-ones-greater-gap","shape-sum-table-bottom-target","bus-board-then-leave","shape-equation-add-subtract","fold-number-cut-sum-main-diagonal","square-tile-growth","balance-scale-star-target","symbol-relation","number-line-six-points","go-stone-difference-inverse-white"] },
  { id: "mock-3", label: "필즈 대비 실전 3회", questions: ["cube-count-solid","set-union-count","chained-number-condition","cube-different-shape","shape-sum-table","vertical-addition","person-item-logic","shape-equation","number-table-rule","cut-recut-pieces","repeat-pattern","triangle-count","function-machine","operator-insertion","custom-operation","fold-hole-count","two-digit-card-enumeration","erase-expression-target","collection-repeat-gap","magic-square"] },
  { id: "mock-4", label: "필즈 대비 실전 4회", questions: ["balance-scale","rod-length-ratio","number-card-mixed-operations","fold-number-remaining-sum","equal-line-sum","magic-square","hidden-score-ranking","two-digit-even-count","number-table-rule","function-machine","square-count","reverse-initial-count","calendar-weekday-sum","growing-shape-count","cryptarithm","shape-equation","shape-sum-table","shape-sum-table","height-order","person-item-logic"] },
  { id: "mock-5", label: "필즈 대비 실전 5회", questions: ["shape-sum-table","colored-shape-number","unused-number-card-equations","magic-square","edge-sum-grid","cryptarithm","repeat-shape-color-dual","go-stone-difference-inverse","balance-scale","rod-length-ratio","fold-diagonal-hole-count","fold-diagonal-unfold","set-union-count","equalize-transfer","two-digit-card-threshold-count","cube-add-to-match","order-position","number-table-rule","alternating-line-total","split-merge-tree"] },
  { id: "mock-6", label: "필즈 대비 실전 6회", questions: ["congruent-partition","magic-square","edge-sum-grid","shape-equation","shape-sum-table","symbol-relation","order-position","person-item-logic","latin-square","fold-diagonal-unfold","cube-fill-box","edge-sum-grid","latin-square","total-difference","set-union-count","number-card-plus-minus","function-machine","chained-number-condition","cube-hidden-count","repeat-pattern"] }
].map((exam) => ({ ...exam, questions: exam.questions.map((typeId, index) => ({
  ...question(index + 1, typeId),
  verified: true
})) }));

export const FINAL_EXAM_TYPES = [
  {
    id: "final-1",
    stage: "final",
    label: "파이널 모의고사 1회 교체본",
    file: "검증된 20유형 기반 교체 시험지 (기존 중복 원본 제외)",
    sourceViewer: false,
    replacement: true,
    questions: [
      "edge-sum-grid", "equalize-transfer", "number-pyramid", "nonadjacent-placement",
      "order-position", "disc-number-rule", "shape-sum-table", "repeat-pattern",
      "arrow-number-grid", "bus-change", "number-card-plus-minus", "equal-line-sum",
      "two-digit-condition", "growing-shape-count", "symbol-sum-grid", "piano-bounce",
      "balance-scale", "symbol-relation", "colored-shape-number", "go-stone-difference"
    ].map((typeId, index) => ({
      ...question(index + 1, typeId),
      verified: true,
      fixedSeed: `final-1-replacement-v1-q${String(index + 1).padStart(2, "0")}`
    }))
  },
  {
    id: "final-2",
    stage: "final",
    label: "필즈선발대비 실전 모의고사 파이널 2회",
    file: "필즈선발대비 실전 모의고사 파이널 2회.pdf",
    sourceViewer: false,
    questions: [
      "hidden-number-card-conditions", "cube-hidden-count-walled", "closest-two-digit-card-sum", "front-back-total",
      "set-union-count", "wrong-operation-correction", "symbol-chain-arithmetic", "paired-sequences",
      "shape-matrix-three-features", "delayed-date-promise", "triangle-position-cycle", "calendar-date-weekday",
      // 14~17·19번은 연결 재검토(2026-08-12)로 분리된 유형이다. 이름이 비슷한 기존 유형에
      // 다시 붙이지 말 것 — 구조가 다르다는 대조 기록이 FINAL-SOURCE-AUDIT.md에 있다.
      "two-type-unit-total", "vertical-cryptarithm-shape-sum", "fold-diagonal-hole-count", "row-column-sum-placement", "two-by-two-sum-fill",
      "total-difference", "shape-sum-grid-4", "magic-square"
    ].map((typeId, index) => ({
      ...question(index + 1, typeId),
      // 2026-08-19: 2·7·9·11번을 열어 20문항이 되었다. 넷 다 원본 PDF 그림을 대조한
      // 기록이 있고(2번은 3쪽 그림 = 벽 모서리 계단형이라 IH), 생성기를 옮겨 온 뒤
      // 난이도별 독립 재계산을 다시 돌렸다. 근거는 FINAL-SOURCE-AUDIT.md.
      verified: true
    }))
  },
  {
    id: "final-3",
    stage: "final",
    label: "필즈선발대비 실전 모의고사 파이널 3회",
    file: "필즈선발대비 실전 모의고사 파이널 3회.pdf",
    sourceViewer: false,
    questions: [
      // 3·5·8·15·19번은 연결 재검토(2026-08-13)로 분리·정정된 유형이다. 15번은 파이널 2회
      // 19번과 수치까지 같은 문항(F27). 근거는 FINAL-SOURCE-AUDIT.md의 재검토 표.
      "row-column-count-placement", "truth-lie-ranking", "triangle-max-edge-sum", "cube-step-sequence",
      "split-merge-tree", "reverse-thinking", "order-position-seven-people", "fold-diagonal-hole-count",
      "target-score-combinations", "matchstick-square-growth", "connected-line-degree-sum", "letter-block-transform",
      "go-stone-difference-inverse", "square-count", "shape-sum-grid-4", "cube-fill-box",
      "mixed-sequences", "two-type-unit-total", "border-go-stone-difference", "neither-set-count"
    ].map((typeId, index) => ({
      ...question(index + 1, typeId),
      // 2026-08-19: 4·5·16번을 열어 20문항이 되었다. 4·16번은 Geometry Worksheet의
      // `TS`(삼각 계단)·`CU`를 그대로 쓰고, 5번은 원본 PDF 그림 대조 기록이 있는
      // 가르기·모으기 나무다. 3번은 2026-08-18 원본 문항 전문을 확인해 열었다.
      verified: true
    }))
  }
];

const unit = (label, typeIds, options = {}) => ({ label, typeIds, ...options });

const problemRange = (section, group, to) => ({ section, group, from: 1, to });
const problemNumbers = (section, group, numbers) => ({ section, group, numbers: [...numbers] });
const stagedUnit = (label, typeIds, activities, checks, advanced, practice) => unit(label, typeIds, {
  // 분류 기준은 페이지가 아니라 권-단원-섹션-문항번호다. 페이지는 판본마다
  // 달라질 수 있으므로 원본 감사 문서에서만 보조 위치로 기록한다.
  studyRefs: {
    concept: activities.map((to, index) => problemRange("activity", index + 1, to)),
    type: checks.map((to, index) => problemRange("check", index + 1, to)),
    practice: [problemRange("practice", 1, practice)],
    advanced: [problemRange("advanced", 1, advanced)]
  }
});

const detailedStagedUnit = (label, typeIds, activities, checks, advanced, practice, typeStudyRefs) => ({
  ...stagedUnit(label, typeIds, activities, checks, advanced, practice),
  // 세부 유형마다 실제 등장하는 단계와 문항 번호가 다르다. 이 표가 있으면 단원 전체
  // 범위를 모든 유형에 붙이지 않고, 현재 선택한 단계의 근거 문항만 사용한다.
  typeStudyRefs
});

const stageReferences = ({ concept = [], type: typeRefs = [], practice = [], advanced = [] }) => ({
  concept,
  type: typeRefs,
  practice,
  advanced
});

// 교재 안의 단계는 시험 문항을 기준으로 한 쉬움·같게·어렵게와 다른 축이다.
// 개념과 유형은 같은 수 범위를 쓰더라도, 개념에는 활동·예시 발판을 제공하고
// 유형에서는 그 발판 없이 직접 적용하게 한다. 연습과 심화는 구조 난이도를 높인다.
export const TEXTBOOK_STAGES = Object.freeze([
  { id: "concept", label: "개념", sourceLabel: "활동·예시", difficulty: 1, description: "핵심 원리와 풀이 발판을 보고 시작합니다." },
  { id: "type", label: "유형", sourceLabel: "더클 확인", difficulty: 1, description: "같은 원리를 발판 없이 직접 적용합니다." },
  { id: "practice", label: "연습", sourceLabel: "더클 연습", difficulty: 2, description: "수와 표현이 달라진 누적 문제를 풉니다." },
  { id: "advanced", label: "심화", sourceLabel: "더클 도전", difficulty: 3, description: "조건과 풀이 단계를 결합한 문제를 풉니다." }
]);

const TEXTBOOK_CONCEPT_GUIDES = Object.freeze({
  "shape-transform": "가운데 점이나 거울의 위치를 표시하고, 도형의 꼭짓점을 하나씩 옮겨 그립니다.",
  "fold-hole-count": "접은 횟수마다 겹친 장수가 어떻게 늘어나는지 먼저 셉니다.",
  "fold-diagonal-hole-count": "대각선 접은 선을 기준으로 구멍의 짝이 생기는 위치를 찾습니다.",
  "fold-diagonal-unfold": "접은 선을 기준으로 잘린 선을 같은 거리의 반대쪽에 옮겨 그립니다.",
  "fold-cut-piece-count": "접힌 종이의 겹 수와 자르는 선이 지나가는 횟수를 나누어 생각합니다.",
  "fold-number-remaining-sum": "접은 선을 기준으로 잘려 나갈 칸을 먼저 찾고, 남은 수만 더합니다.",
  "fold-number-cut-sum-textbook": "접은 선을 기준으로 서로 겹치는 칸을 찾고, 잘린 칸의 수만 더합니다.",
  "fold-diagonal-number-sum": "대각선 양쪽에서 서로 마주 겹치는 번호를 짝지어 봅니다.",
  "fold-target-sum-coloring": "접었을 때 겹치는 번호의 합을 먼저 구한 뒤 목표 합과 같은 칸을 고릅니다.",
  "fold-stack-find": "접는 순서대로 종이 조각의 위아래가 어떻게 바뀌는지 한 단계씩 표시합니다.",
  "fold-stack-order": "마지막 접기부터 거꾸로 펼쳐 각 조각의 위아래 순서를 찾습니다.",
  "fold-punch-shape-count": "접힌 겹 수와 펀치 모양이 펼쳐질 때 생기는 짝을 함께 셉니다.",
  "fold-cut-shape-choice": "접은 선을 기준으로 잘린 모양을 뒤집어 붙여 펼친 모양을 만듭니다.",
  "magic-square": "가로·세로·대각선의 합이 같다는 조건으로 한 줄의 합부터 찾습니다.",
  "gakuro": "삼각형 옆에 적힌 합을 보며 한 줄에 같은 수가 겹치지 않게 채웁니다.",
  "grid-number-placement": "위·아래·왼쪽·오른쪽 조건을 하나씩 표시하고 확실한 자리부터 채웁니다.",
  "person-item-logic": "사람과 조건을 표에 적고, 될 수 없는 곳을 지운 뒤 남은 한 곳을 찾습니다.",
  "shape-mirror-direction": "거울선을 기준으로 같은 거리의 반대편 칸을 하나씩 찾습니다.",
  "shape-quarter-half-turn": "회전의 중심을 표시하고 꼭짓점을 같은 방향으로 같은 칸만큼 옮깁니다.",
  "shape-flip-composition": "첫 번째 움직임의 결과를 그린 뒤 그 그림에 두 번째 움직임을 적용합니다.",
  "rotational-partition-two": "한 조각을 돌렸을 때 다른 조각과 모양과 크기가 정확히 겹치는지 살펴봅니다.",
  "rotational-partition-four": "같은 작은 조각 네 개가 돌려서 서로 겹치는지 확인합니다.",
  "symbol-balanced-congruent-partition": "각 조각의 모양과 크기뿐 아니라 들어 있는 기호의 종류와 개수도 비교합니다.",
  "digital-digit-transform": "디지털 숫자의 막대를 움직인 뒤 켜진 막대가 어느 숫자인지 다시 읽습니다.",
  "digital-two-digit-transform": "두 자리 수의 각 숫자를 움직이고 자리의 순서가 바뀌는지도 확인합니다.",
  "digital-transform-board-sum": "각 숫자판을 따로 움직여 나온 수를 적은 뒤 모두 더합니다.",
  "digital-transform-addition": "움직인 뒤의 두 수를 정확히 읽고 세로로 맞추어 더합니다.",
  "circular-magic-line-sum": "가운데를 지나는 줄마다 양쪽 끝 두 수의 합이 같아야 합니다.",
  "cross-shape-magic-sum": "완성된 한 줄의 합을 먼저 찾고 빈 줄의 보이는 수를 뺍니다.",
  "gakuro-card-placement": "한 줄의 목표 합에서 보이는 수를 빼고, 쓰지 않은 수 카드 중 맞는 수를 고릅니다.",
  "gakuro-grid-sum": "가로 합과 세로 합이 동시에 맞는 칸부터 채웁니다.",
  "circle-line-ring-equal-sum": "둘레의 합과 가운데를 지나는 줄의 합이 같아지는지 줄마다 확인합니다.",
  "digit-sum-enumeration": "십의 자리부터 차례로 정하고, 목표 합에서 그 숫자를 뺀 값을 일의 자리에 씁니다.",
  "three-digit-step-sequence": "이웃한 두 수의 차를 자릿값별로 확인하고 같은 차를 이어갑니다.",
  "place-value-condition-three": "백의 자리, 십의 자리, 일의 자리 조건을 따로 표시하고 모두 맞는 수만 남깁니다.",
  "place-value-condition-four": "천의 자리부터 조건을 하나씩 적용하고 이미 쓴 숫자 조건도 함께 확인합니다.",
  "relative-order-logic": "앞선 사람과 뒤선 사람을 화살표로 잇고 하나의 순서로 정리합니다.",
  "equal-partition-two": "전체를 같은 두 묶음으로 나누어 두 칸에 같은 수를 씁니다.",
  "equal-partition-four": "먼저 반으로 나누고, 두 묶음을 다시 반으로 나누면 네 묶음이 같습니다.",
  "equal-partition-three": "같은 수를 세 번 모아 전체가 되는 수를 찾습니다.",
  "shape-sum-table": "같은 모양은 같은 수입니다. 같은 모양만 있는 줄부터 값을 찾습니다.",
  "equalize-transfer": "준 뒤와 받은 뒤의 수를 적고, 두 수가 같아지는지 확인합니다.",
  "total-difference": "더 많은 쪽의 차이를 먼저 떼어 놓고, 남은 수를 똑같이 나눕니다.",
  "reverse-transfer-total": "마지막 수에서 거꾸로 생각해, 준 만큼 더하고 받은 만큼 뺍니다.",
  "balance-order-chain": "아래로 내려간 쪽이 더 무겁습니다. 저울마다 비교한 결과를 한 줄로 잇습니다.",
  "balance-given-unit-weight": "수평인 양쪽의 무게는 같습니다. 아는 물건의 무게부터 바꾸어 적습니다.",
  "distinct-shape-value-equation": "같은 모양에는 같은 수, 다른 모양에는 다른 수가 들어갑니다. 같은 모양만 있는 식부터 풉니다.",
  "constant-step-number-sequence": "이웃한 두 수의 차이가 늘 같은지 살펴봅니다.",
  "interleaved-number-sequence": "한 칸씩 건너뛴 수끼리 따로 읽어 두세 가지 규칙을 찾습니다.",
  "previous-two-sum-sequence": "앞의 두 수를 더해 다음 수를 만듭니다.",
  "repeating-number-sequence": "처음부터 다시 되풀이되는 가장 짧은 수 묶음을 찾습니다.",
  "repeating-symbol-sequence": "모양, 색, 개수를 따로 살펴 되풀이되는 가장 짧은 묶음을 찾습니다.",
  "progressive-number-table": "각 단계에서 가로와 세로로 무엇이 하나씩 늘어나는지 비교합니다.",
  "matchstick-shared-polygon-growth": "첫 도형을 센 뒤, 새 도형 하나를 붙일 때 늘어나는 성냥개비만 더합니다.",
  "triangular-stone-growth": "각 단계에서 새로 늘어난 바둑돌의 줄과 색을 따로 셉니다.",
  "square-border-stone-growth": "안쪽과 테두리를 나누어 흰돌과 검은돌을 각각 셉니다.",
  "staircase-tile-growth": "첫째 줄부터 계단의 각 줄에 놓인 타일 수를 차례로 더합니다.",
  "repeated-fold-cut-count": "한 번 접을 때 겹 수가 어떻게 늘어나는지 먼저 적습니다.",
  "colored-triangle-growth": "전체 삼각형 수와 두 색의 배치 규칙을 나누어 셉니다.",
  "nested-circle-count": "작은 원부터 큰 원까지 크기별로 빠짐없이 셉니다.",
  "cube-square-layer-growth": "위층부터 각 정사각형 층의 쌓기나무 수를 세어 모두 더합니다.",
  "growing-segment-count": "한 단계 커질 때 새로 생기는 선분 수를 먼저 찾습니다.",
  "fold-punch-doubling": "한 번 펼칠 때 구멍이 접은 선을 기준으로 같은 위치에 하나 더 생깁니다.",
  "four-number-center-rule": "윗줄과 아랫줄, 왼쪽과 오른쪽의 계산이 같은지 비교합니다.",
  "number-grid-row-rule": "답이 보이는 줄에서 계산 순서를 찾고, 같은 순서를 빈 줄에 씁니다.",
  "two-digit-compose-rule": "두 수로 만든 두 자리 수를 먼저 적은 뒤 약속된 계산을 합니다.",
  "sudoku-three-row-column": "한 줄에 1, 2, 3이 한 번씩만 들어가도록 빠진 수를 찾습니다.",
  "sudoku-three-region": "가로·세로와 굵은 칸 안에 1, 2, 3이 한 번씩 들어갑니다.",
  "sudoku-four-square-region": "가로·세로와 2×2 굵은 칸 안에 1부터 4까지 한 번씩 들어갑니다.",
  "sudoku-four-irregular-region": "굵은 칸 모양이 네모가 아니어도 같은 영역 안에 1부터 4까지 한 번씩 들어갑니다.",
  "unit-area-fraction": "작은 정사각형 한 칸을 단위넓이 1로 놓고, 전체 칸과 색칠한 칸을 각각 셉니다.",
  "unit-length-multiple": "기준 막대 한 개의 길이를 정하고 다른 막대가 몇 개만큼인지 셉니다.",
  "rod-length-ratio": "가장 짧은 막대를 한 묶음으로 보고 각 막대가 몇 묶음인지 표시합니다.",
  "cryptarithm": "일의 자리부터 계산하고, 받아올림이나 받아내림을 다음 자리에 표시합니다.",
  "magic-card": "각 카드에 나타난 수의 공통점을 찾아 선택한 카드가 뜻하는 수를 좁혀 갑니다.",
  "congruent-partition": "전체 칸 수를 같은 조각 수로 나누고, 각 조각의 모양과 넓이가 같은지 확인합니다.",
  "cube-top-number-grid": "위에서 본 각 칸의 수는 그 자리에 쌓인 층수입니다. 칸의 수를 더해 전체를 구합니다.",
  "cube-count-solid": "위에서 보이는 꼭대기마다 아래에 받치는 쌓기나무가 있는지 층별로 셉니다.",
  "cube-three-views": "위에서 본 자리와 앞·옆에서 본 가장 높은 층을 함께 맞춥니다.",
  "cube-missing-view": "두 방향에서 보이는 높이를 위에서 본 자리에 표시한 뒤 남은 방향을 읽습니다.",
  "cube-pattern-sequence": "각 단계의 층별 개수를 적고, 단계가 하나 늘 때 추가되는 수를 찾습니다.",
  "cube-step-sequence": "위층부터 1개, 2개, 3개처럼 늘어나는 각 층의 수를 차례로 더합니다.",
  "cube-pattern-stage-from-count": "단계별 전체 개수를 차례로 적어 주어진 개수와 같은 단계를 찾습니다.",
  "cube-pattern-next-increase": "현재 단계와 다음 단계의 층별 차이를 세어 새로 필요한 개수만 더합니다.",
  "balance-scale": "수평이면 양쪽 무게가 같고, 아래로 내려간 쪽이 더 무겁습니다.",
  "height-order": "두 사람씩 비교한 결과를 화살표나 한 줄 순서로 이어 봅니다.",
  "number-table-rule": "가로로 갈 때와 세로로 갈 때 수가 얼마씩 바뀌는지 따로 찾습니다.",
  "calendar-weekday-sum": "같은 요일은 날짜가 7씩 차이 납니다. 필요한 날짜만 차례로 적습니다.",
  "shortest-path": "출발점에서 갈 수 있는 길의 수를 가까운 점부터 차례로 더해 표시합니다.",
  "three-digit-card-count": "백·십·일의 자리에 올 수 있는 카드를 조건별로 나누어 빠짐없이 적습니다.",
  "multiplication-matrix": "가로와 세로의 두 수를 곱해 만나는 칸의 수를 만듭니다.",
  "growing-shape-count": "각 단계에서 새로 붙는 구슬의 수를 찾고 앞 단계의 전체에 더합니다.",
  "number-line-distance": "두 점 사이의 같은 간격 수를 세고 한 간격의 길이만큼 더합니다.",
  "ratio-distribution": "각 대상이 차지하는 같은 크기 묶음 수를 먼저 세고 전체를 묶음 수로 나눕니다.",
  "rectilinear-perimeter": "가로 길이와 세로 길이를 방향별로 모아 도형의 바깥 둘레만 더합니다.",
  "polygon-stone-rearrangement": "전체 바둑돌 수는 그대로 두고 새 도형의 한 변에 놓일 수를 찾아 배열합니다.",
  "consecutive-number-addition": "가운데 수를 기준으로 앞뒤 수를 같은 거리만큼 작고 크게 적습니다.",
  "odd-even-sum-difference": "홀수와 짝수를 차례로 짝지어 각 짝에서 생기는 차이를 셉니다.",
  "argument-logic": "문장의 조건을 한 줄씩 확인하고, 어긋나는 경우를 지워 남는 답을 찾습니다.",
  "repeat-pattern": "모양과 색을 따로 읽어 가장 짧게 되풀이되는 묶음을 찾습니다.",
  "tree-planting": "처음과 끝에 나무가 있는지 확인한 뒤 나무 사이의 간격 수를 셉니다.",
  "palindrome": "앞에서 읽은 숫자와 뒤에서 읽은 숫자가 같은 자리끼리 짝을 이룹니다.",
  "venn-count": "두 조건에 모두 맞는 수는 한 번만 세도록 겹친 곳에 먼저 적습니다.",
  "reverse-thinking": "마지막에 한 일을 반대 계산으로 바꾸어 뒤에서부터 거꾸로 풉니다.",
  "cube-hidden-count-walled": "벽과 바닥에 가려진 자리도 위에 놓인 쌓기나무를 받치도록 채워 셉니다.",
  "cube-hidden-count": "보이는 꼭대기 아래와 뒤쪽에 반드시 있어야 하는 쌓기나무만 층별로 셉니다.",
  "cube-fill-rectangular-box": "가로 칸 수, 세로 칸 수, 층수를 차례로 묶어 상자 전체 칸을 셉니다.",
  "cube-fill-box": "한 층의 칸 수를 세고 같은 층이 몇 층인지 확인해 전체를 구합니다.",
  "cube-three-view-minmax": "세 방향의 가장 높은 층은 지키면서 겹쳐 놓을 수 있는 높이를 비교합니다.",
  "cube-painted-faces": "겉에서 보이는 윗면·앞면·옆면을 방향별로 나누어 중복 없이 셉니다.",
  "cube-painted-cube-count": "모서리·테두리·가운데에 있는 쌓기나무가 각각 몇 면 칠해지는지 나눕니다.",
  "cube-black-white-alternating": "한 칸 옆으로 갈 때마다 색이 바뀌도록 층별로 흰색과 검은색을 셉니다.",
  "cube-tunnel": "구멍마다 빠지는 칸을 표시하고 여러 구멍이 겹치는 칸은 한 번만 뺍니다.",
  "chained-number-condition": "첫 조건으로 가능한 수를 줄인 뒤, 남은 수에 다음 조건을 차례로 적용합니다.",
  "catch-up": "한 번 움직일 때 줄어드는 거리 차를 찾고, 처음 거리만큼 몇 번 필요한지 셉니다.",
  "two-digit-condition": "십의 자리와 일의 자리 조건을 따로 적고 두 조건을 모두 만족하는 수만 남깁니다.",
  "two-digit-even-ones-greater-gap": "일의 자리에는 짝수를 놓고, 십의 자리와의 차가 조건에 맞는지 확인합니다.",
  "two-digit-odd-bounded-gap": "주어진 범위 안의 홀수를 먼저 적고 두 자리 숫자의 차를 하나씩 확인합니다.",
  "number-baseball": "자리와 숫자가 모두 맞는 것과 숫자만 맞는 것을 나누어 후보를 지웁니다.",
  "tangram-shape-composition": "빈자리의 변과 꼭짓점을 살펴 같은 모양의 칠교 조각을 돌려 맞춥니다.",
  "tangram-piece-area": "모눈 한 칸을 1로 보고 선택한 칠교 조각이 차지한 온칸과 반칸을 더합니다.",
  "unit-grid-area": "온칸을 먼저 세고 반칸 두 개를 온칸 하나로 묶습니다.",
  "growing-shape-area-sum": "각 모양의 가로와 세로 또는 작은 삼각형 수를 세어 단계별 넓이를 적습니다.",
  "nested-square-outer-area": "가장 바깥 정사각형의 한 변이 단계마다 얼마나 늘어나는지 먼저 찾습니다.",
  "equal-part-shaded-fraction": "전체 조각 수를 아래에, 색칠한 조각 수를 위에 씁니다.",
  "equal-partition-drawing": "도형의 가운데와 꼭짓점을 이용해 모양과 크기가 같은 조각으로 나눕니다.",
  "incomplete-partition-fraction": "이미 그어진 선을 이어 같은 크기의 작은 조각을 모두 만든 뒤 셉니다.",
  "oblique-square-grid-area": "기울어진 정사각형을 둘러싼 큰 사각형에서 바깥 삼각형 넓이를 뺍니다.",
  "folded-strip-length": "접힌 길을 가로와 세로의 모눈 칸으로 나누어 모든 구간을 더합니다.",
  "midpoint-number-line": "두 끝 수를 더해 똑같이 두 수로 가르면 중간수가 됩니다.",
  "segment-chain-distance": "겹쳐 표시된 긴 거리를 작은 구간으로 나누어 같은 구간끼리 빼고 더합니다.",
  "equal-interval-length": "두 끝 수의 차를 구하고 똑같이 나눈 칸 수만큼 가릅니다.",
  "walking-step-ratio": "한 걸음 길이가 몇 배인지 보고 같은 거리에서 걸음 수가 반대로 몇 배인지 셉니다.",
  "route-distance-multiple": "전체 길이에서 앞 구간을 빼 뒤 구간을 구한 뒤 기준 구간과 비교합니다.",
  "rod-ratio-total-book3": "두 막대가 차지하는 같은 크기 묶음을 모두 세고 전체 길이를 묶음 수로 나눕니다.",
  "unit-object-length": "전체 길이를 똑같은 물건의 개수만큼 가르면 한 개의 길이가 됩니다.",
  "equivalent-object-length": "양쪽에서 같은 물건을 같은 수만큼 지우고 남은 물건끼리 비교합니다.",
  "proportional-rods-common-total": "같은 전체 길이를 이루는 막대 수를 보고 한 막대의 길이를 거꾸로 구합니다.",
  "number-line-six-points": "겹친 긴 거리에서 이미 아는 구간을 차례로 빼 작은 구간을 찾습니다.",
  "meeting-distance-ratio": "두 사람이 간 거리를 속도의 배수와 같은 묶음으로 나누어 전체 묶음 수를 셉니다.",
  "mixed-interval-distance": "각 구간의 전체 길이를 그 구간의 칸 수로 나누어 한 칸씩 따로 구합니다.",
  "difference-unit-measure": "두 단위막대가 같은 전체 길이를 만드는 그림을 맞춘 뒤 남는 길이를 한 단위로 봅니다.",
  "cryptarithm-single-double": "같은 도형 두 개를 더한 수를 똑같이 두 수로 가릅니다.",
  "cryptarithm-repeated-number-double": "일의 자리부터 같은 숫자를 두 번 더하고 받아올림을 십의 자리에 보냅니다.",
  "cryptarithm-fixed-digit-addition": "보이는 숫자부터 계산해 같은 자리의 도형 값을 찾습니다.",
  "cryptarithm-missing-digit-column": "일의 자리에서 시작해 빈칸과 받아올림을 차례로 채웁니다.",
  "cryptarithm-multi-symbol-carry": "일의 자리의 받아올림을 표시하고, 같은 도형에는 같은 숫자를 넣습니다.",
  "cryptarithm-linked-equations": "첫 번째 식에서 찾은 도형 값을 두 번째 식의 같은 도형에 넣습니다.",
  "binary-weight-selection": "목표 수보다 크지 않은 가장 큰 추부터 골라 남은 무게를 만듭니다.",
  "colored-cell-number-code": "각 칸의 자리값을 적고 색칠된 칸의 값만 더합니다.",
  "symbol-value-code": "두 보기에서 같은 기호를 지워 한 기호의 값을 먼저 찾습니다.",
  "magic-square-three-complete": "가운데에는 아홉 수의 가운데 수를 놓고, 마주 보는 두 수의 합을 같게 맞춥니다.",
  "magic-square-three-target": "완성된 한 줄의 합을 먼저 찾고 색칠한 줄의 나머지 두 수를 뺍니다.",
  "magic-square-four-target": "1부터 16까지를 쓰면 한 줄의 합이 34임을 이용해 색칠한 칸을 찾습니다.",
  "polygon-ring-equal-sum": "오각형 한 변의 세 수를 보고 목표 합에서 두 수를 빼 다음 원을 채웁니다.",
  "equal-line-sum-eight-cards": "완성된 가로나 세로 한 줄의 합을 기준으로 빈칸을 차례로 채웁니다.",
  "triangle-max-edge-sum": "세 꼭짓점의 수가 두 줄씩 세어진다는 점을 이용해 큰 수나 작은 수를 꼭짓점에 놓습니다.",
  "triangle-edge-sum-six": "한 변의 목표 합에서 이미 놓인 두 수를 빼 남은 원의 수를 찾습니다.",
  "triangle-edge-sum-nine": "네 수가 놓이는 한 변씩 목표 합을 맞추고 쓴 수는 카드에서 지웁니다.",
  "magic-square-four-complete": "마주 보는 자리의 두 수를 짝지어 합이 17이 되도록 놓습니다.",
  "tetromino-family-choice": "네 정사각형이 모두 변으로 이어져 한 덩어리가 되는지 확인합니다.",
  "tetromino-square-composition": "빈자리의 꺾인 방향과 네 칸의 이어진 모양을 조각과 비교합니다.",
  "digital-grid-transform": "숫자 하나만 보지 말고 배열판의 네 모서리부터 옮긴 자리를 표시합니다.",
  "digital-transform-arithmetic": "각 디지털 수를 먼저 움직여 새 수를 적은 뒤 덧셈이나 뺄셈을 합니다.",
  "fold-number-grid-multi": "접은 선을 하나씩 거꾸로 펼쳐 잘린 칸과 짝이 되는 번호를 모두 찾습니다.",
  "fold-surface-top-trace": "접을 때 움직이는 쪽이 위로 올라간다는 것을 접는 순서마다 표시합니다.",
  "pair-sum-card-completion": "한 쌍의 목표 합에서 보이는 카드 수를 빼 빈 카드의 수를 찾습니다.",
  "shape-difference-chain": "이웃한 도형 사이의 차를 같은 방향으로 이어 더합니다.",
  "measurement-order-chain": "기준값에서 크고 작은 차를 순서대로 더하거나 빼며 값을 적습니다.",
  "balance-unit-ratio": "저울 한 줄을 같은 물건 개수로 바꾸어 다음 저울의 관계와 이어 봅니다.",
  "directional-seat-placement": "확실한 한 자리부터 정하고 위·아래·좌우 조건을 한 칸씩 이어 놓습니다.",
  "circular-seat-placement": "맨 위 자리를 고정한 뒤 시계 방향 조건을 차례로 이어 놓습니다.",
  "ordinal-line-placement": "앞에서의 순서와 두 사람 사이의 수를 한 줄에 표시합니다.",
  "sequential-path-number-grid": "출발 칸을 찾고 선을 따라 한 칸마다 1씩 이어 씁니다.",
  "diagonal-fill-number-grid": "같은 대각선에 놓이는 칸을 묶고 화살표 순서대로 수를 이어 씁니다.",
  "line-cycle-number-table": "한 줄씩 번갈아 수를 놓은 뒤 같은 줄의 수끼리 얼마씩 커지는지 봅니다.",
  "finger-bounce-sequence": "엄지에서 새끼손가락까지 갔다가 돌아오는 여덟 자리 반복을 표시합니다.",
  "calendar-month-position": "1일의 요일을 찾고 같은 요일 칸에서 7씩 더하거나 뺍니다.",
  "calendar-cross-month-weekday": "이번 달에 남은 날을 먼저 세고 나머지를 다음 달에서 셉니다.",
  "calendar-same-weekday-sum": "같은 요일 날짜는 7씩 차이 난다는 점으로 가능한 날짜를 확인합니다.",
  "shortest-path-rectangle": "각 점까지 오는 길의 수를 왼쪽 수와 위쪽 수를 더해 적습니다.",
  "shortest-path-irregular-grid": "막힌 점에는 0을 쓰고 갈 수 있는 점만 왼쪽과 위쪽 수를 더합니다.",
  "shortest-path-via-waypoint": "출발점에서 별표까지와 별표에서 도착점까지를 나누어 셉니다.",
  "digit-card-number-enumeration": "맨 앞자리부터 작은 카드로 정하고 이미 쓴 카드는 지우며 빠짐없이 씁니다.",
  "digit-card-ranked-number": "첫자리가 같은 수끼리 묶고 다음 자리의 작은 순서로 정리합니다.",
  "two-digit-digit-sum-rank": "십의 자리부터 정하고 목표 합에서 그 수를 뺀 값을 일의 자리에 씁니다.",
  "two-digit-digit-difference-rank": "두 자리 숫자의 차가 맞는 수를 빠짐없이 쓴 뒤 크기 순서로 놓습니다.",
  "multiplication-table-pattern": "왼쪽 수와 위쪽 수를 곱해 만나는 칸에 씁니다.",
  "product-cycle-completion": "보이는 꼭짓점에서 시작해 변의 수를 이웃한 수로 나누며 따라갑니다.",
  "multiplication-matrix-products": "가로 또는 세로의 곱에서 이미 아는 수를 차례로 나눕니다.",
  "multiplication-matrix-placement": "가로·세로의 곱을 동시에 맞추고 사용한 수 카드는 지웁니다.",
  "symbol-product-pair": "곱이 되는 두 수를 찾아 합과 크기 조건까지 확인합니다.",
  "symbol-multiplication-chain": "아는 모양부터 시작해 곱을 이웃한 모양의 수로 차례로 나눕니다.",
  "symbol-mixed-operation-grid": "같은 모양만 있는 곱셈식부터 풀고 찾은 값을 다른 식에 넣습니다.",
  "handshake-pair-count": "한 사람씩 새로 악수하는 횟수를 겹치지 않게 줄여 가며 더합니다.",
  "pair-selection-count": "첫째 것과 짝지을 수 있는 경우부터 이미 센 짝을 빼며 셉니다.",
  "complete-graph-segment-count": "한 점에서 새로 그을 선을 세고 이미 그은 선은 다시 세지 않습니다.",
  "inverse-pair-count": "1부터 차례로 더해 주어진 짝의 수가 되는 때를 찾습니다.",
  "square-number-odd-sum": "정사각형 둘레에 새로 늘어나는 홀수 개를 차례로 더합니다.",
  "pascal-row-sum": "양 끝에 1을 쓰고 가운데는 바로 위의 두 수를 더해 다음 줄을 만듭니다.",
  "triangle-figure-count": "가장 작은 삼각형부터 크기와 방향을 바꾸어 겹치지 않게 셉니다.",
  "square-grid-count-book5": "한 칸짜리부터 가장 큰 정사각형까지 크기별로 나누어 셉니다.",
  "square-tile-growth": "한 줄에 놓인 정사각형 수와 줄 수가 함께 하나씩 늘어나는지 확인합니다.",
  "triangle-tile-growth": "한 변의 작은 삼각형 수가 늘 때 전체 조각 수를 줄별로 나누어 셉니다.",
  "triangular-row-boundary-number": "앞줄까지 놓인 수의 개수를 더해 다음 줄의 첫 수와 끝 수를 찾습니다.",
  "square-row-boundary-number": "각 줄에 1개, 3개, 5개씩 놓인 수를 누적해 첫 수와 끝 수를 찾습니다.",
  "cube-triangular-wall-growth": "각 층의 1개, 2개, 3개를 위에서부터 차례로 더합니다.",
  "cube-tetrahedral-growth": "각 층의 삼각수만큼 쌓인 개수를 아래층부터 차례로 더합니다."
});

export const textbookGuideForType = (id) => TEXTBOOK_CONCEPT_GUIDES[id] || "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";

const CURRICULUM_TEST_FILES = {
  "book-01": "N30_1과정-1_테스트.pptx",
  "book-02": "N30_1과정-2_테스트.pptx",
  "book-03": "N30_1과정-3_테스트.pptx",
  "book-04": "N30_1과정-4_테스트.pptx",
  "book-05": "N30_1과정-5_테스트.pptx",
  "book-06": "N30_1과정-6_테스트.pptx",
  "book-07": "N30_1과정-7_테스트.pptx",
  "book-08": "N30_1과정-8_테스트 (2).pptx",
  "book-09": "N30_1과정-9_테스트 (1).pptx",
  "book-10": "1과정_10권_N30_테스트 (2).pptx"
};

const CURRICULUM_TEST_PAGE_COUNTS = {
  "book-01": 7, "book-02": 6, "book-03": 6, "book-04": 7, "book-05": 7,
  "book-06": 7, "book-07": 7, "book-08": 7, "book-09": 7, "book-10": 7
};

// 1권 163문항을 페이지가 아닌 단원·섹션·인쇄 문항번호로 전부 분류했다.
// 한 문항은 한 세부 유형에만 속하며, 복합 문항은 주된 풀이 구조를 기준으로 정한다.
const BOOK01_UNIT01_REFS = Object.freeze({
  "shape-mirror-direction": stageReferences({
    concept: [problemNumbers("activity", 1, [1])], practice: [problemNumbers("practice", 1, [1])]
  }),
  "shape-quarter-half-turn": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 5, 6])], practice: [problemNumbers("practice", 1, [2, 4, 5])]
  }),
  "shape-flip-composition": stageReferences({
    concept: [problemNumbers("activity", 1, [4])], practice: [problemNumbers("practice", 1, [3])]
  }),
  "rotational-partition-two": stageReferences({
    type: [problemNumbers("check", 1, [1])], practice: [problemNumbers("practice", 1, [6])], advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "rotational-partition-four": stageReferences({
    type: [problemNumbers("check", 1, [2])], practice: [problemNumbers("practice", 1, [7])], advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "symbol-balanced-congruent-partition": stageReferences({
    type: [problemNumbers("check", 1, [3, 4, 5])], practice: [problemNumbers("practice", 1, [8, 9])], advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "digital-digit-transform": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])], practice: [problemNumbers("practice", 1, [10, 11, 12])]
  }),
  "digital-two-digit-transform": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])], practice: [problemNumbers("practice", 1, [13, 14])]
  }),
  "digital-transform-board-sum": stageReferences({
    type: [problemNumbers("check", 2, [1, 2])], practice: [problemNumbers("practice", 1, [15, 16])], advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "digital-transform-addition": stageReferences({
    type: [problemNumbers("check", 2, [3, 4])], practice: [problemNumbers("practice", 1, [17, 18])]
  })
});

const BOOK01_UNIT02_REFS = Object.freeze({
  "fold-cut-shape-choice": stageReferences({
    concept: [problemNumbers("activity", 1, [1]), problemNumbers("activity", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 8, 9, 10, 11, 18])]
  }),
  "fold-number-cut-sum-textbook": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])],
    type: [problemNumbers("check", 1, [1, 2, 3]), problemNumbers("check", 2, [1, 2, 3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17])]
  }),
  "fold-cut-piece-count": stageReferences({
    practice: [problemNumbers("practice", 1, [19, 20])], advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "fold-punch-shape-count": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "fold-hole-count": stageReferences({ advanced: [problemNumbers("advanced", 1, [3, 4])] })
});

const BOOK01_UNIT03_REFS = Object.freeze({
  "circular-magic-line-sum": stageReferences({
    concept: [problemNumbers("activity", 1, [1])], practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "cross-shape-magic-sum": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 4, 5])], practice: [problemNumbers("practice", 1, [3, 4, 5, 6])]
  }),
  "equal-line-sum-eight-cards": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])], practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "triangle-edge-sum-six": stageReferences({
    type: [problemNumbers("check", 1, [3])], practice: [problemNumbers("practice", 1, [9])]
  }),
  "gakuro-card-placement": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3])], type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [10, 12, 13, 14, 15, 16, 17])], advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "gakuro-grid-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [4])], practice: [problemNumbers("practice", 1, [11])], advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "polygon-ring-equal-sum": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "circle-line-ring-equal-sum": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] })
});

const BOOK01_UNIT04_REFS = Object.freeze({
  "digit-sum-enumeration": stageReferences({ practice: [problemNumbers("practice", 1, [1, 11])] }),
  "three-digit-step-sequence": stageReferences({
    concept: [problemNumbers("activity", 1, [1])], practice: [problemNumbers("practice", 1, [2])]
  }),
  "two-digit-condition": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 4])], practice: [problemNumbers("practice", 1, [3, 4, 5])]
  }),
  "two-digit-even-ones-greater-gap": stageReferences({ concept: [problemNumbers("activity", 1, [5])] }),
  "two-digit-odd-bounded-gap": stageReferences({ practice: [problemNumbers("practice", 1, [6])] }),
  "place-value-condition-three": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])], practice: [problemNumbers("practice", 1, [7, 8, 9, 10, 12, 13, 14])]
  }),
  "place-value-condition-four": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "person-item-logic": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])], practice: [problemNumbers("practice", 1, [15, 16, 17, 18, 19, 20])],
    advanced: [problemNumbers("advanced", 1, [2, 3])]
  }),
  "relative-order-logic": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])], practice: [problemNumbers("practice", 1, [21, 22, 23, 24])],
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

// 2권도 3권과 같은 방식으로 단원 전체를 한 유형에 통째로 연결하지 않는다.
// 각 배열은 교재의 활동·확인·연습·도전 구역에 인쇄된 문제 번호이며, 페이지는
// 판본마다 달라질 수 있으므로 런타임 선택 근거로 사용하지 않는다.
const BOOK02_UNIT01_REFS = Object.freeze({
  "equal-partition-two": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "equal-partition-four": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "equal-partition-three": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "shape-sum-table": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5])],
    type: [problemNumbers("check", 1, [1, 2, 3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [4, 5, 6, 7, 8, 9, 10, 11, 12])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  }),
  "equalize-transfer": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [13, 14, 15])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "total-difference": stageReferences({
    concept: [problemNumbers("activity", 2, [4, 5])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [16, 17, 18, 19, 20, 21])]
  }),
  "reverse-transfer-total": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  })
});

const BOOK02_UNIT02_REFS = Object.freeze({
  "balance-order-chain": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "balance-given-unit-weight": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [5, 6, 7, 8])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "distinct-shape-value-equation": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  })
});

const BOOK02_UNIT03_REFS = Object.freeze({
  "constant-step-number-sequence": stageReferences({
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "interleaved-number-sequence": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [6, 7])]
  }),
  "previous-two-sum-sequence": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [8, 9])]
  }),
  "repeating-number-sequence": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "repeating-symbol-sequence": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4])]
  }),
  "progressive-number-table": stageReferences({
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "matchstick-shared-polygon-growth": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "triangular-stone-growth": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    practice: [problemNumbers("practice", 1, [11, 12])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "square-border-stone-growth": stageReferences({
    concept: [problemNumbers("activity", 2, [4])],
    practice: [problemNumbers("practice", 1, [13, 15])]
  }),
  "staircase-tile-growth": stageReferences({
    type: [problemNumbers("check", 2, [1])]
  }),
  "repeated-fold-cut-count": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "colored-triangle-growth": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "nested-circle-count": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "cube-square-layer-growth": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "growing-segment-count": stageReferences({
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "fold-punch-doubling": stageReferences({
    practice: [problemNumbers("practice", 1, [16])]
  })
});

const BOOK02_UNIT04_REFS = Object.freeze({
  "four-number-center-rule": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4])]
  }),
  "number-grid-row-rule": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5, 6])],
    type: [problemNumbers("check", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [5, 6, 7, 8])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "two-digit-compose-rule": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])],
    type: [problemNumbers("check", 1, [2])]
  }),
  "sudoku-three-row-column": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "sudoku-three-region": stageReferences({
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "sudoku-four-square-region": stageReferences({
    concept: [problemNumbers("activity", 2, [2, 3])],
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "sudoku-four-irregular-region": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [12, 13, 14])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  })
});

// 3권은 단원명으로 묶지 않고, 실제 문제 번호를 풀이 구조별로 다시 분류했다.
// 배열의 숫자는 각 섹션 안에 인쇄된 문제 번호다. 페이지 번호는 판본에 따라 달라질 수
// 있으므로 런타임 데이터에 넣지 않는다. 자세한 대조 근거는 BOOK03-SOURCE-AUDIT.md에 둔다.
const BOOK03_UNIT01_REFS = Object.freeze({
  "tangram-shape-composition": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3])]
  }),
  "tangram-piece-area": stageReferences({
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "unit-grid-area": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5])],
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [2, 3, 4, 5])]
  }),
  "growing-shape-area-sum": stageReferences({
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "nested-square-outer-area": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "equal-part-shaded-fraction": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [8, 9, 10, 11, 12])]
  }),
  "equal-partition-drawing": stageReferences({
    concept: [problemNumbers("activity", 2, [4])],
    practice: [problemNumbers("practice", 1, [14, 15])]
  }),
  "incomplete-partition-fraction": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [13, 16, 17, 18, 19, 20])],
    advanced: [problemNumbers("advanced", 1, [1, 2, 3])]
  }),
  "oblique-square-grid-area": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

const BOOK03_UNIT02_REFS = Object.freeze({
  "folded-strip-length": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "midpoint-number-line": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4])]
  }),
  "segment-chain-distance": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "equal-interval-length": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "walking-step-ratio": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "route-distance-multiple": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "rod-ratio-total-book3": stageReferences({
    concept: [problemNumbers("activity", 2, [4])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "unit-object-length": stageReferences({
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "equivalent-object-length": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [12, 15])]
  }),
  "proportional-rods-common-total": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [13, 14, 16])]
  }),
  "number-line-six-points": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "meeting-distance-ratio": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "mixed-interval-distance": stageReferences({
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "difference-unit-measure": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

const BOOK03_UNIT03_REFS = Object.freeze({
  "cryptarithm-single-double": stageReferences({
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "cryptarithm-repeated-number-double": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [2, 3])]
  }),
  "cryptarithm-fixed-digit-addition": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [4, 5])]
  }),
  "cryptarithm-missing-digit-column": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [6, 7, 8])]
  }),
  "cryptarithm-multi-symbol-carry": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [9, 10, 11, 12, 13, 14, 15, 16, 17])],
    advanced: [problemNumbers("advanced", 1, [1, 2, 3])]
  }),
  "cryptarithm-linked-equations": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

const BOOK03_UNIT04_REFS = Object.freeze({
  "binary-weight-selection": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "colored-cell-number-code": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])],
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [2, 3, 4, 5, 6, 7])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "symbol-value-code": stageReferences({
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "magic-square-three-complete": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [9, 10])]
  }),
  "magic-square-three-target": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    type: [problemNumbers("check", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [11, 12, 13])]
  }),
  "magic-square-four-target": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "polygon-ring-equal-sum": stageReferences({
    type: [problemNumbers("check", 2, [4])],
    practice: [problemNumbers("practice", 1, [15])]
  }),
  "equal-line-sum-eight-cards": stageReferences({
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "triangle-max-edge-sum": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "triangle-edge-sum-six": stageReferences({
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "triangle-edge-sum-nine": stageReferences({
    practice: [problemNumbers("practice", 1, [18])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "magic-square-four-complete": stageReferences({
    practice: [problemNumbers("practice", 1, [19])],
    advanced: [problemNumbers("advanced", 1, [3])]
  })
});

// 4권도 페이지가 아니라 각 활동·확인·연습·도전 안에 인쇄된 문제 번호를 쓴다.
// 네 표의 합집합은 교재 본문 153문항과 정확히 일치하며 한 문항의 중복 배정은 없다.
const BOOK04_UNIT01_REFS = Object.freeze({
  "tetromino-family-choice": stageReferences({
    concept: [problemNumbers("activity", 1, [1])]
  }),
  "tetromino-square-composition": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2, 3])]
  }),
  "rotational-partition-two": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [1, 4, 5])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "rotational-partition-four": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [6])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "symbol-balanced-congruent-partition": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 4])],
    practice: [problemNumbers("practice", 1, [7, 8, 9, 10])]
  }),
  "shape-quarter-half-turn": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [12])]
  }),
  "shape-mirror-direction": stageReferences({
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "digital-digit-transform": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "digital-grid-transform": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [14, 15, 16])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "digital-transform-arithmetic": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [17, 18, 19, 20])]
  })
});

const BOOK04_UNIT02_REFS = Object.freeze({
  "fold-cut-shape-choice": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "fold-number-grid-multi": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 4])],
    practice: [problemNumbers("practice", 1, [2, 3, 4, 5, 6, 7])]
  }),
  "fold-surface-top-trace": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [8, 9, 10, 11])]
  }),
  "cube-count-solid": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 3])],
    practice: [problemNumbers("practice", 1, [12, 14])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "cube-step-sequence": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "cube-hidden-count-walled": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [15])]
  }),
  "cube-top-number-grid": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "cube-fill-rectangular-box": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "cube-painted-cube-count": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

const BOOK04_UNIT03_REFS = Object.freeze({
  "pair-sum-card-completion": stageReferences({
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "shape-difference-chain": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4, 5, 6])]
  }),
  "measurement-order-chain": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [7, 8, 9, 10])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "balance-unit-ratio": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])],
    type: [problemNumbers("check", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [11, 12, 13, 14, 15, 16])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  })
});

const BOOK04_UNIT04_REFS = Object.freeze({
  "person-item-logic": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4])]
  }),
  "ordinal-line-placement": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4]), problemNumbers("check", 2, [1, 2, 3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [5, 6, 7, 8, 15, 16, 17, 18])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  }),
  "directional-seat-placement": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [9, 10, 11, 12])]
  }),
  "circular-seat-placement": stageReferences({
    practice: [problemNumbers("practice", 1, [13, 14])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "grid-number-placement": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  })
});

// 5권도 페이지 번호가 아니라 활동·확인·연습·도전의 인쇄 문제 번호를 기준으로 한다.
// 네 단원의 합집합은 154문항이며, 한 문항은 주된 풀이 구조 한 곳에만 배정한다.
const BOOK05_UNIT01_REFS = Object.freeze({
  "sequential-path-number-grid": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4, 6])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "diagonal-fill-number-grid": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "line-cycle-number-table": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "finger-bounce-sequence": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "calendar-month-position": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [9, 10])]
  }),
  "calendar-cross-month-weekday": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "calendar-same-weekday-sum": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [13, 14, 15, 16])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  })
});

const BOOK05_UNIT02_REFS = Object.freeze({
  "shortest-path-rectangle": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "shortest-path-irregular-grid": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [3])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "shortest-path-via-waypoint": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [4, 5, 6, 7])]
  }),
  "digit-card-number-enumeration": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [12, 13])]
  }),
  "digit-card-ranked-number": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [8, 9, 10, 11, 14, 15])]
  }),
  "two-digit-digit-sum-rank": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [16, 17, 18, 19])]
  }),
  "two-digit-digit-difference-rank": stageReferences({
    type: [problemNumbers("check", 2, [5, 6])],
    practice: [problemNumbers("practice", 1, [20, 21])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  })
});

const BOOK05_UNIT03_REFS = Object.freeze({
  "multiplication-table-pattern": stageReferences({
    concept: [problemNumbers("activity", 1, [1])]
  }),
  "product-cycle-completion": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "multiplication-matrix-products": stageReferences({
    type: [problemNumbers("check", 1, [2])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "multiplication-matrix-placement": stageReferences({
    type: [problemNumbers("check", 1, [1, 3])],
    practice: [problemNumbers("practice", 1, [6, 7])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "symbol-product-pair": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "symbol-multiplication-chain": stageReferences({
    concept: [problemNumbers("activity", 2, [2])]
  }),
  "symbol-mixed-operation-grid": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [9, 10, 11, 12, 13, 14, 15])],
    advanced: [problemNumbers("advanced", 1, [2, 3, 4])]
  })
});

const BOOK05_UNIT04_REFS = Object.freeze({
  "handshake-pair-count": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "pair-selection-count": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    type: [problemNumbers("check", 1, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "complete-graph-segment-count": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "inverse-pair-count": stageReferences({
    concept: [problemNumbers("activity", 1, [6])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "square-number-odd-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [1])]
  }),
  "pascal-row-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "triangle-figure-count": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [7])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "square-grid-count-book5": stageReferences({
    type: [problemNumbers("check", 1, [5]), problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [8, 15])]
  }),
  "square-tile-growth": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "triangle-tile-growth": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [12])]
  }),
  "triangular-stone-growth": stageReferences({
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "cube-triangular-wall-growth": stageReferences({
    practice: [problemNumbers("practice", 1, [10])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "staircase-tile-growth": stageReferences({
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "square-border-stone-growth": stageReferences({
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "triangular-row-boundary-number": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "square-row-boundary-number": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "cube-tetrahedral-growth": stageReferences({
    advanced: [problemNumbers("advanced", 1, [5])]
  })
});

export const CURRICULUM = [
  { id: "book-01", label: "1권", title: "도형 움직이기와 마방진", units: [
    detailedStagedUnit("도형 움직이기", [
      "shape-mirror-direction", "shape-quarter-half-turn", "shape-flip-composition",
      "rotational-partition-two", "rotational-partition-four", "symbol-balanced-congruent-partition",
      "digital-digit-transform", "digital-two-digit-transform", "digital-transform-board-sum", "digital-transform-addition"
    ], [6,4], [5,4], 4, 18, BOOK01_UNIT01_REFS),
    detailedStagedUnit("색종이 접기", [
      "fold-cut-shape-choice", "fold-number-cut-sum-textbook", "fold-cut-piece-count",
      "fold-punch-shape-count", "fold-hole-count"
    ], [3,4], [3,6], 4, 20, BOOK01_UNIT02_REFS),
    detailedStagedUnit("마방진과 가쿠로 퍼즐", [
      "circular-magic-line-sum", "cross-shape-magic-sum", "equal-line-sum-eight-cards",
      "triangle-edge-sum-six", "gakuro-card-placement", "gakuro-grid-sum",
      "polygon-ring-equal-sum", "circle-line-ring-equal-sum"
    ], [5,4], [3,4], 4, 17, BOOK01_UNIT03_REFS),
    detailedStagedUnit("수 추리와 논리 추리", [
      "digit-sum-enumeration", "three-digit-step-sequence", "two-digit-condition",
      "two-digit-even-ones-greater-gap", "two-digit-odd-bounded-gap", "place-value-condition-three",
      "place-value-condition-four", "person-item-logic", "relative-order-logic"
    ], [5,4], [4,4], 4, 24, BOOK01_UNIT04_REFS)
  ] },
  { id: "book-02", label: "2권", title: "규칙찾기와 매트릭스", units: [
    detailedStagedUnit("매트릭스와 주고받기", ["equal-partition-two","equal-partition-four","equal-partition-three","shape-sum-table","equalize-transfer","total-difference","reverse-transfer-total"], [5,5], [6,4], 4, 21, BOOK02_UNIT01_REFS),
    detailedStagedUnit("양팔저울", ["balance-order-chain","balance-given-unit-weight","distinct-shape-value-equation"], [4,4], [4,4], 4, 18, BOOK02_UNIT02_REFS),
    detailedStagedUnit("규칙찾기와 수열", ["constant-step-number-sequence","interleaved-number-sequence","previous-two-sum-sequence","repeating-number-sequence","repeating-symbol-sequence","progressive-number-table","matchstick-shared-polygon-growth","triangular-stone-growth","square-border-stone-growth","staircase-tile-growth","repeated-fold-cut-count","colored-triangle-growth","nested-circle-count","cube-square-layer-growth","growing-segment-count","fold-punch-doubling"], [4,4], [4,3], 4, 17, BOOK02_UNIT03_REFS),
    detailedStagedUnit("약속과 스도쿠", ["four-number-center-rule","number-grid-row-rule","two-digit-compose-rule","sudoku-three-row-column","sudoku-three-region","sudoku-four-square-region","sudoku-four-irregular-region"], [6,3], [4,4], 4, 14, BOOK02_UNIT04_REFS)
  ] },
  { id: "book-03", label: "3권", title: "단위넓이와 복면산", units: [
    detailedStagedUnit("단위넓이와 분수", [
      "tangram-shape-composition", "tangram-piece-area", "unit-grid-area",
      "growing-shape-area-sum", "nested-square-outer-area", "equal-part-shaded-fraction",
      "equal-partition-drawing", "incomplete-partition-fraction", "oblique-square-grid-area"
    ], [5,4], [4,4], 4, 20, BOOK03_UNIT01_REFS),
    detailedStagedUnit("단위길이와 배수", [
      "folded-strip-length", "midpoint-number-line", "segment-chain-distance",
      "equal-interval-length", "walking-step-ratio", "route-distance-multiple",
      "rod-ratio-total-book3", "unit-object-length", "equivalent-object-length",
      "proportional-rods-common-total", "number-line-six-points", "meeting-distance-ratio",
      "mixed-interval-distance", "difference-unit-measure"
    ], [4,4], [2,2], 4, 16, BOOK03_UNIT02_REFS),
    detailedStagedUnit("복면산", [
      "cryptarithm-single-double", "cryptarithm-repeated-number-double",
      "cryptarithm-fixed-digit-addition", "cryptarithm-missing-digit-column",
      "cryptarithm-multi-symbol-carry", "cryptarithm-linked-equations"
    ], [4,4], [4,4], 4, 17, BOOK03_UNIT03_REFS),
    detailedStagedUnit("마법카드와 마방진", [
      "binary-weight-selection", "colored-cell-number-code", "symbol-value-code",
      "magic-square-three-complete", "magic-square-three-target", "magic-square-four-target",
      "polygon-ring-equal-sum", "equal-line-sum-eight-cards", "triangle-max-edge-sum",
      "triangle-edge-sum-six", "triangle-edge-sum-nine", "magic-square-four-complete"
    ], [3,3], [3,4], 4, 19, BOOK03_UNIT04_REFS)
  ] },
  { id: "book-04", label: "4권", title: "도형분할과 쌓기나무", units: [
    detailedStagedUnit("도형 분할과 움직이기", [
      "tetromino-family-choice", "tetromino-square-composition", "rotational-partition-two",
      "rotational-partition-four", "symbol-balanced-congruent-partition", "shape-quarter-half-turn",
      "shape-mirror-direction", "digital-digit-transform", "digital-grid-transform", "digital-transform-arithmetic"
    ], [4,6], [4,4], 4, 20, BOOK04_UNIT01_REFS),
    detailedStagedUnit("색종이 접기와 쌓기나무", [
      "fold-cut-shape-choice", "fold-number-grid-multi", "fold-surface-top-trace", "cube-count-solid",
      "cube-step-sequence", "cube-hidden-count-walled", "cube-top-number-grid", "cube-fill-rectangular-box",
      "cube-painted-cube-count"
    ], [4,3], [4,3], 4, 17, BOOK04_UNIT02_REFS),
    detailedStagedUnit("양팔저울과 비교하기", [
      "pair-sum-card-completion", "shape-difference-chain", "measurement-order-chain", "balance-unit-ratio"
    ], [4,4], [4,2], 4, 16, BOOK04_UNIT03_REFS),
    detailedStagedUnit("논리추리와 자리배치", [
      "person-item-logic", "ordinal-line-placement", "directional-seat-placement", "circular-seat-placement", "grid-number-placement"
    ], [4,6], [4,6], 4, 18, BOOK04_UNIT04_REFS)
  ] },
  { id: "book-05", label: "5권", title: "곱셈매트릭스와 삼각수", units: [
    detailedStagedUnit("수 배열표와 달력", [
      "sequential-path-number-grid", "diagonal-fill-number-grid", "line-cycle-number-table",
      "finger-bounce-sequence", "calendar-month-position", "calendar-cross-month-weekday",
      "calendar-same-weekday-sum"
    ], [4,4], [2,4], 4, 16, BOOK05_UNIT01_REFS),
    detailedStagedUnit("최단거리와 숫자 카드", [
      "shortest-path-rectangle", "shortest-path-irregular-grid", "shortest-path-via-waypoint",
      "digit-card-number-enumeration", "digit-card-ranked-number", "two-digit-digit-sum-rank",
      "two-digit-digit-difference-rank"
    ], [6,6], [4,6], 4, 21, BOOK05_UNIT02_REFS),
    detailedStagedUnit("곱셈 매트릭스", [
      "multiplication-table-pattern", "product-cycle-completion", "multiplication-matrix-products",
      "multiplication-matrix-placement", "symbol-product-pair", "symbol-multiplication-chain",
      "symbol-mixed-operation-grid"
    ], [4,5], [3,4], 5, 15, BOOK05_UNIT03_REFS),
    detailedStagedUnit("삼각수와 사각수", [
      "handshake-pair-count", "pair-selection-count", "complete-graph-segment-count",
      "inverse-pair-count", "square-number-odd-sum", "pascal-row-sum", "triangle-figure-count",
      "square-grid-count-book5", "square-tile-growth", "triangle-tile-growth", "triangular-stone-growth",
      "cube-triangular-wall-growth", "staircase-tile-growth", "square-border-stone-growth",
      "triangular-row-boundary-number", "square-row-boundary-number", "cube-tetrahedral-growth"
    ], [6,2], [5,3], 5, 16, BOOK05_UNIT04_REFS)
  ] },
  { id: "book-06", label: "6권", title: "도형의 둘레와 연속수", units: [
    stagedUnit("수직선의 분할과 비", ["number-line-distance","ratio-distribution"], [5,6], [2,6], 4, 17),
    stagedUnit("도형의 둘레", ["rectilinear-perimeter","polygon-stone-rearrangement"], [6,5], [4,4], 5, 20),
    stagedUnit("연속수의 합", ["consecutive-number-addition","odd-even-sum-difference"], [5,4], [4,3], 6, 19),
    stagedUnit("수와 숫자의 개수", ["three-digit-card-count"], [4,6], [2,4], 4, 14)
  ] },
  { id: "book-07", label: "7권", title: "달력과 우기기", units: [
    stagedUnit("달력과 시계", ["calendar-weekday-sum"], [6,4], [3,4], 5, 16),
    stagedUnit("규칙 찾기와 우기기", ["argument-logic","repeat-pattern"], [4,6,6], [2,4,3], 6, 21),
    stagedUnit("가로수 심기", ["tree-planting"], [4,7], [6,4], 4, 18),
    stagedUnit("팔린드롬과 벤다이어그램", ["palindrome","venn-count"], [5,5], [7,4], 6, 20)
  ] },
  { id: "book-08", label: "8권", title: "매트릭스와 복면산", units: [
    stagedUnit("묶음수와 매트릭스", ["shape-sum-table"], [5,4], [4,3], 6, 19),
    stagedUnit("복면산", ["cryptarithm"], [4,6], [4,4], 6, 18),
    stagedUnit("합차와 배수문제", ["total-difference","unit-length-multiple"], [6,4], [4,4], 6, 18),
    stagedUnit("거꾸로 생각하기", ["reverse-thinking"], [4,4], [4,4], 4, 19)
  ] },
  { id: "book-09", label: "9권", title: "도형분할과 논리", units: [
    stagedUnit("도형의 분할과 넓이", ["congruent-partition","unit-area-fraction"], [7,6], [5,4], 6, 22),
    stagedUnit("쌓기나무의 개수", ["cube-count-solid","cube-hidden-count-walled","cube-hidden-count","cube-fill-rectangular-box","cube-fill-box","cube-three-view-minmax","cube-painted-faces","cube-painted-cube-count","cube-black-white-alternating","cube-tunnel"], [5,2], [5,5], 5, 14),
    stagedUnit("마방진", ["magic-square"], [4,4], [2,3], 5, 15),
    stagedUnit("논리 추리", ["person-item-logic","chained-number-condition"], [6,4], [4,5], 5, 20)
  ] },
  { id: "book-10", label: "10권", title: "연속수와 따라잡기", units: [
    stagedUnit("연속수의 합", ["consecutive-number-addition","odd-even-sum-difference"], [3,6,8], [4,4,4], 6, 26),
    stagedUnit("따라잡기", ["catch-up"], [4,4], [4,4], 5, 17),
    stagedUnit("조건에 맞는 수", ["two-digit-condition","chained-number-condition"], [8,3], [4,4], 5, 16),
    stagedUnit("숫자 야구게임", ["number-baseball"], [4,6], [4,4], 5, 20)
  ] }
].map((book, index) => ({
  ...book,
  source: {
    textbook: `더클래식 1과정 ${index + 1}권 수업용 교재`,
    unitTest: CURRICULUM_TEST_FILES[book.id],
    unitTestQuestionCount: 25,
    unitTestPageCount: CURRICULUM_TEST_PAGE_COUNTS[book.id],
    goldenBellIncluded: false,
    reviewIncluded: index === 0
  }
}));

export const typeById = (id) => byId[id];
