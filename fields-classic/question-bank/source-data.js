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
  type("equal-line-sum-eight-cards", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 줄의 합 만들기", { generator: "equalLineSumEightCards", sourceMatched: true }),
  type("equal-line-sum-eight-cards-fifteen-top-left", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 네 변의 합을 같게 만들기", { generator: "equalLineSumEightCardsFifteenTopLeft", sourceMatched: true }),
  type("equal-line-sum-eight-cards-twelve", "number", "수 배열과 합", "1부터 8까지 써서 각 줄의 합을 같게 만들기", { generator: "equalLineSumEightCardsTwelve", sourceMatched: true }),
  type("symbol-sum-grid", "number", "매트릭스", "도형 매트릭스의 빈 합 구하기", { generator: "sourceSymbolSumGrid", sourceMatched: true }),
  type("shape-sum-grid-triangle-top", "number", "매트릭스", "세모 세 개로 시작하는 도형 합 표", { generator: "shapeSumGridTriangleTop", sourceMatched: true }),
  type("shape-sum-grid-top-target", "number", "매트릭스", "도형 합 표의 첫째 줄 합 구하기", { generator: "shapeSumGridTopTarget", sourceMatched: true }),
  type("shape-sum-grid-triangle-column-target", "number", "매트릭스", "세모 세 개가 놓인 도형 합 표", { generator: "shapeSumGridTriangleColumnTarget", sourceMatched: true }),
  type("symbol-sum-grid-square-top", "number", "매트릭스", "네모 세 개로 시작하는 도형 합 매트릭스", { generator: "symbolSumGridSquareTop", sourceMatched: true }),
  type("shape-equation", "number", "복면산과 식", "도형이 나타내는 수와 식", { legacyId: 20 }),
  type("shape-equation-add-subtract", "number", "복면산과 식", "더하기와 빼기로 도형 수 구하기", { generator: "shapeEquationAddSubtract", sourceMatched: true }),
  type("two-digit-condition", "number", "조건에 맞는 수", "조건에 맞는 두 자리 수", { generator: "sourceTwoDigitSumDifference", sourceMatched: true }),
  type("two-digit-parity-gap", "number", "조건에 맞는 수", "짝수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitParityGap", sourceMatched: true }),
  type("two-digit-even-ones-greater-gap", "number", "조건에 맞는 수", "일의 자리 숫자가 더 큰 짝수 찾기", { generator: "twoDigitEvenOnesGreaterGap", sourceMatched: true }),
  type("two-digit-odd-gap", "number", "조건에 맞는 수", "홀수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitOddGap", sourceMatched: true }),
  type("two-digit-odd-bounded-gap", "number", "조건에 맞는 수", "범위와 자릿수 차로 홀수 찾기", { generator: "twoDigitOddBoundedGap", sourceMatched: true }),
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
  type("number-line-six-points", "geometry", "길이와 측정", "여섯 점 수직선의 겹친 거리", { generator: "numberLineSixPoints", sourceMatched: true }),
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
  type("fold-cut-piece-count", "geometry", "색종이 접기", "접고 자른 조각의 개수", { generator: "foldCutPieceCount", sourceMatched: true, textbookSource: "더클래식 1과정 1권 39·43·48쪽" }),
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
  type("person-item-logic", "logic", "조건 연결", "사람과 동물·음식 조건 연결"),
  type("set-union-count", "logic", "집합과 포함", "두 종류를 선택한 전체 사람 수", { generator: "setUnionCount", sourceMatched: true }),
  type("custom-operation", "number", "연산 약속", "새 기호의 계산 약속"),
  type("operator-insertion", "number", "수 카드와 식", "+와 -를 넣어 식 완성하기"),
  type("cut-recut-pieces", "number", "과정 추론", "자르고 먹고 다시 잘라 남은 조각 수"),
  type("alternating-line-total", "logic", "순서와 비교", "두 종류를 번갈아 세운 전체 인원"),
  type("reverse-initial-count", "logic", "과정 추론", "여러 번 오고 간 뒤 처음 수 거꾸로 찾기", { generator: "reverseInitialCount", sourceMatched: true }),
  type("function-machine", "pattern", "수 규칙", "수 변환 기계의 규칙"),
  type("collection-repeat-gap", "pattern", "수 규칙", "모으기 반복 수열에서 같은 수 사이 개수", { generator: "collectionRepeatGap", sourceMatched: true }),
  type("magic-square", "number", "수 배열과 합", "가로·세로·대각선 합이 같은 마방진", { legacyId: 14, generator: "magicSquare", sourceMatched: true }),
  type("fold-hole-count", "geometry", "색종이 접기", "접은 색종이의 구멍 개수", { generator: "paperFoldHoleCount", legacyId: 4 }),
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
  type("triangle-max-edge-sum", "number", "수 배열과 합", "삼각형 세 변의 합을 같게 만들고 그 합을 가장 크게", { generator: "triangleMaxEdgeSum", sourceMatched: true }),
  type("split-merge-tree", "number", "수 배열과 합", "가르기·모으기 나무의 부모·자식 관계", { generator: "overlappingNumberBonds", sourceMatched: true }),
  type("border-go-stone-difference", "pattern", "도형 규칙", "테두리가 커지는 바둑돌의 흑백 차이", { generator: "borderGoStoneDifference", sourceMatched: true }),
  type("fold-diagonal-unfold", "geometry", "색종이 접기", "대각선으로 접고 자른 뒤 펼친 선 그리기"),
  type("fold-number-remaining-sum", "geometry", "색종이 접기", "번호 색종이를 접고 자른 뒤 남은 수의 합", { generator: "foldNumberRemainingSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 41·50쪽" }),
  // 교재 41·50쪽의 '뒤로 접은 2x2' 잘린 합. 실전 시험 검증본 fold-number-cut-sum(대각선 접기)과 이름이
  // 비슷하지만 구조가 다르다 — 합치지 말 것.
  type("fold-number-cut-sum-textbook", "geometry", "색종이 접기", "번호 색종이를 접고 자른 수의 합 (교재)", { generator: "foldNumberCutSumTextbook", sourceMatched: true, textbookSource: "더클래식 1과정 1권 41·50쪽" }),
  type("fold-diagonal-number-sum", "geometry", "색종이 접기", "대각선 한 번 접기 숫자판의 잘린·남은 합", { generator: "foldDiagonalNumberSum", sourceMatched: true, textbookSource: "실전 1회 18번·2회 15번 유형" }),
  type("fold-target-sum-coloring", "geometry", "색종이 접기", "목표 합이 되게 색칠할 칸 고르기", { generator: "foldTargetSumColoring", sourceMatched: true, textbookSource: "더클래식 1과정 1권 41·50쪽 역방향" }),
  type("fold-punch-shape-count", "geometry", "색종이 접기", "반원·원 펀치를 펼친 모양 개수", { generator: "foldPunchShapeCount", sourceMatched: true, textbookSource: "더클래식 1과정 1권 51쪽" }),
  type("fold-stack-find", "geometry", "색종이 접기", "겹친 색종이의 가장 밑·위 찾기", { generator: "foldStackFind", sourceMatched: true, textbookSource: "더클래식 1과정 1권 35~36·44~46쪽" }),
  type("fold-stack-order", "geometry", "색종이 접기", "겹친 색종이를 위에서부터 순서대로", { generator: "foldStackOrder", sourceMatched: true, textbookSource: "더클래식 1과정 1권 35~36·44~46쪽" }),
  type("fold-cut-shape-choice", "geometry", "색종이 접기", "접어 자르고 펼친 모양 고르기", { generator: "foldCutShapeChoice", sourceMatched: true, textbookSource: "더클래식 1과정 1권 37~38·47쪽" }),
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
  "number-baseball": "자리와 숫자가 모두 맞는 것과 숫자만 맞는 것을 나누어 후보를 지웁니다."
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

export const CURRICULUM = [
  { id: "book-01", label: "1권", title: "도형 움직이기와 마방진", units: [
    stagedUnit("도형 움직이기", ["shape-transform"], [6,4], [5,4], 4, 18),
    stagedUnit("색종이 접기", ["fold-hole-count","fold-diagonal-hole-count","fold-diagonal-unfold","fold-cut-piece-count","fold-number-remaining-sum","fold-number-cut-sum-textbook","fold-diagonal-number-sum","fold-target-sum-coloring","fold-stack-find","fold-stack-order","fold-punch-shape-count","fold-cut-shape-choice"], [3,4], [3,6], 4, 20),
    stagedUnit("마방진과 가쿠로 퍼즐", ["magic-square","gakuro"], [5,4], [3,4], 4, 17),
    stagedUnit("수 추리와 논리 추리", ["grid-number-placement","person-item-logic"], [5,4], [4,4], 4, 24)
  ] },
  { id: "book-02", label: "2권", title: "규칙찾기와 매트릭스", units: [
    stagedUnit("매트릭스와 주고받기", ["equal-partition-two","equal-partition-four","equal-partition-three","shape-sum-table","equalize-transfer","total-difference","reverse-transfer-total"], [5,5], [6,4], 4, 21),
    stagedUnit("양팔저울", ["balance-order-chain","balance-given-unit-weight","distinct-shape-value-equation"], [4,4], [4,4], 4, 18),
    stagedUnit("규칙찾기와 수열", ["constant-step-number-sequence","interleaved-number-sequence","previous-two-sum-sequence","repeating-number-sequence","repeating-symbol-sequence","progressive-number-table","matchstick-shared-polygon-growth","triangular-stone-growth","square-border-stone-growth","staircase-tile-growth","repeated-fold-cut-count","colored-triangle-growth","nested-circle-count","cube-square-layer-growth","growing-segment-count","fold-punch-doubling"], [4,4], [4,3], 4, 17),
    stagedUnit("약속과 스도쿠", ["four-number-center-rule","number-grid-row-rule","two-digit-compose-rule","sudoku-three-row-column","sudoku-three-region","sudoku-four-square-region","sudoku-four-irregular-region"], [6,3], [4,4], 4, 14)
  ] },
  { id: "book-03", label: "3권", title: "단위넓이와 복면산", units: [
    stagedUnit("단위넓이와 분수", ["unit-area-fraction"], [5,4], [4,4], 4, 20),
    stagedUnit("단위길이와 배수", ["unit-length-multiple","rod-length-ratio"], [4,4], [2,2], 4, 16),
    stagedUnit("복면산", ["cryptarithm"], [4,4], [4,4], 4, 17),
    stagedUnit("마법카드와 마방진", ["magic-card","magic-square"], [3,3], [3,4], 4, 19)
  ] },
  { id: "book-04", label: "4권", title: "도형분할과 쌓기나무", units: [
    stagedUnit("도형 분할과 움직이기", ["congruent-partition","shape-transform"], [4,6], [4,4], 4, 20),
    stagedUnit("색종이 접기와 쌓기나무", ["fold-hole-count","cube-top-number-grid","cube-count-solid","cube-three-views","cube-missing-view","cube-pattern-sequence","cube-pattern-stage-from-count","cube-pattern-next-increase"], [4,3], [4,3], 4, 17),
    stagedUnit("양팔저울과 비교하기", ["balance-scale","height-order"], [4,4], [4,2], 4, 16),
    stagedUnit("논리추리와 자리배치", ["person-item-logic","grid-number-placement"], [4,6], [4,6], 4, 18)
  ] },
  { id: "book-05", label: "5권", title: "곱셈매트릭스와 삼각수", units: [
    stagedUnit("수 배열표와 달력", ["number-table-rule","calendar-weekday-sum"], [4,4], [2,4], 4, 16),
    stagedUnit("최단거리와 숫자 카드", ["shortest-path","three-digit-card-count"], [6,6], [4,6], 4, 21),
    stagedUnit("곱셈 매트릭스", ["multiplication-matrix"], [4,5], [3,4], 5, 15),
    stagedUnit("삼각수와 사각수", ["growing-shape-count"], [6,2], [5,3], 5, 16)
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
