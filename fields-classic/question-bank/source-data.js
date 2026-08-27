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

// 한 세부 유형은 여러 학원·교재 스타일에서 함께 나타날 수 있다. 유형을 복제하지 않고
// academyStyleIds에 출처 스타일을 누적해 다대다로 연결한다.
export const ACADEMY_STYLES = [
  { id: "fields-classic", label: "필즈 더 클래식" }
];

const type = (id, domain, middle, label, options = {}) => ({
  id,
  domain,
  middle,
  label,
  difficulty: "actual",
  status: "classified",
  ...options,
  academyStyleIds: [...new Set(options.academyStyleIds || ["fields-classic"])]
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
  type("equal-line-sum-eight-cards-complete-book3", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 사각 둘레 완성하기", { generator: "equalLineSumEightCardsCompleteBook3", sourceMatched: true, textbookSource: "더클래식 1과정 3권 119쪽 연습 16번" }),
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
  type("balance-scale-star-target", "logic", "무게 비교", "기호 양팔저울 관계", { generator: "balanceScaleStarTarget", sourceMatched: true }),
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
  type("g1-height-order-four", "logic", "순서와 비교", "네 사람의 키 순서 비교", { generator: "g1HeightOrderFour", sourceMatched: true }),
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
  type("g1-summer-equalize-transfer", "number", "합과 차 문장제", "두 사람의 수를 같게 만드는 주고받기", { generator: "g1SummerEqualizeTransfer", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 1번" }),
  type("g1-summer-height-order-five", "logic", "순서와 비교", "다섯 사람의 키 순서와 등수", { generator: "g1SummerHeightOrderFive", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 2번" }),
  type("g1-summer-two-digit-sum-gap", "number", "조건에 맞는 수", "자리 합과 차로 두 자리 수 찾기", { generator: "g1SummerTwoDigitSumGap", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 3번" }),
  type("g1-summer-balance-shape-chain", "logic", "무게 비교", "저울의 도형을 바꾸어 같은 무게 찾기", { generator: "g1SummerBalanceShapeChain", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 4번·초1 3차 3번" }),
  type("g1-summer-five-box-weight-order", "logic", "순서와 비교", "다섯 상자의 무게 순서", { generator: "g1SummerFiveBoxWeightOrder", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 5번" }),
  type("g1-summer-four-shape-add-subtract", "number", "복면산과 식", "네 도형의 덧셈·뺄셈 관계", { generator: "g1SummerFourShapeAddSubtract", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 6번" }),
  type("g1-summer-pentagon-adjacent-product", "number", "수 배열과 곱", "오각형 이웃 수의 곱", { generator: "g1SummerPentagonAdjacentProduct", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 7번" }),
  type("g1-summer-four-by-four-shape-sum", "number", "매트릭스", "4×4 도형표의 가로·세로 합", { generator: "g1SummerFourByFourShapeSum", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 8번" }),
  type("g1-summer-circle-point-segments", "geometry", "도형 세기", "원 위의 점을 이은 선분 수", { generator: "g1SummerCirclePointSegments", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 9번" }),
  type("g1-summer-four-by-four-shape-sum-bottom", "number", "매트릭스", "4×4 도형표의 아래 합 구하기", { generator: "g1SummerFourByFourShapeSumBottom", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 10번" }),
  type("g1-summer-vertical-shape-addition", "number", "복면산과 식", "도형으로 된 세로 덧셈", { generator: "g1SummerVerticalShapeAddition", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 11번" }),
  type("g1-summer-one-three-rods", "geometry", "길이와 측정", "한 칸 막대와 세 칸 막대의 길이", { generator: "g1SummerOneToThreeRods", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 12번" }),
  type("g1-summer-triangular-color-difference", "pattern", "도형 규칙", "삼각형 배열의 색칠 조각 차", { generator: "g1SummerTriangularColorDifference", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 13번" }),
  type("g1-summer-square-side-composition", "geometry", "길이와 측정", "붙인 정사각형의 한 변 길이", { generator: "g1SummerSquareSideComposition", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 14번" }),
  type("g1-summer-fold-cut-triangle-count", "geometry", "색종이 접기", "접고 자른 뒤 생기는 삼각형 수", { generator: "g1SummerFoldCutTriangleCount", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 15번" }),
  type("g1-summer-four-symbol-relation", "number", "복면산과 식", "네 도형 관계식으로 값 찾기", { generator: "g1SummerFourSymbolRelation", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 16번" }),
  type("g1-summer-shape-height-dual-cycle", "pattern", "반복 규칙", "도형 종류와 높이의 이중 주기", { generator: "g1SummerShapeHeightDualCycle", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 17번·초1 3차 18번" }),
  type("g1-summer-orange-ratio-distribution", "number", "합과 차 문장제", "어른과 어린이의 서로 다른 귤 수", { generator: "g1SummerOrangeRatioDistribution", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 18번·초1 4차 19번" }),
  type("g1-summer-rectilinear-perimeter", "geometry", "둘레와 배열", "직각으로 꺾인 도형의 둘레", { generator: "g1SummerRectilinearPerimeter", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 19번" }),
  type("g1-summer-opposite-step-sequences", "pattern", "수 규칙", "반대 방향으로 뛰는 두 수열", { generator: "g1SummerOppositeStepSequences", sourceMatched: true, textbookSource: "더 클래식 초1 2차 선발시험 20번·초1 4차 18번" }),
  type("g1-fall-three-person-total-transfer", "number", "합과 차 문장제", "세 사람의 전체 수와 주고받기", { generator: "g1FallThreePersonTotalTransfer", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 1번" }),
  type("g1-fall-number-set-offset-chain", "logic", "조건에 맞는 수", "기준 수와 차이가 이어지는 수 조건", { generator: "g1FallNumberSetOffsetChain", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 5번" }),
  type("g1-fall-four-by-four-latin-two-target", "logic", "수 배치", "4×4 수 배열에서 두 칸의 수 찾기", { generator: "g1FallFourByFourLatinTwoTarget", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 6번" }),
  type("g1-fall-pentagon-adjacent-products-all", "number", "수 배열과 곱", "오각형의 모든 이웃 곱으로 수 찾기", { generator: "g1FallPentagonAdjacentProductsAll", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 7번" }),
  type("g1-fall-four-by-four-shape-sum-four-targets", "number", "매트릭스", "4×4 도형표의 네 줄 합 구하기", { generator: "g1FallFourByFourShapeSumFourTargets", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 8번" }),
  type("g1-fall-four-short-one-long-rods", "geometry", "길이와 측정", "짧은 막대 네 개와 긴 막대 한 개", { generator: "g1FallFourShortOneLongRods", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 9번" }),
  type("g1-fall-stacked-square-side-chain", "geometry", "길이와 측정", "겹쳐 쌓인 정사각형 변의 길이", { generator: "g1FallStackedSquareSideChain", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 10번" }),
  type("g1-fall-aa-ab-ccc-shape-addition", "number", "복면산과 식", "AA와 AB를 더해 CCC가 되는 도형 덧셈", { generator: "g1FallAaAbCccShapeAddition", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 11번" }),
  type("g1-fall-three-fold-crease-cut-count", "geometry", "색종이 접기", "세 번 접은 선을 자른 조각 수", { generator: "g1FallThreeFoldCreaseCutCount", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 13번" }),
  type("g1-fall-total-triple-share", "number", "합과 차 문장제", "전체를 3대1로 나누기", { generator: "g1FallTotalTripleShare", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 14번" }),
  type("g1-fall-paired-four-blank-additions", "number", "복면산과 식", "짝지은 네 빈칸 세로 덧셈", { generator: "g1FallFourBlankAddition", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 15번" }),
  type("g1-fall-square-chain-shaded-perimeter", "geometry", "둘레와 배열", "붙인 정사각형에서 색칠한 정사각형 둘레", { generator: "g1FallSquareChainShadedPerimeter", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 16번" }),
  type("g1-fall-linear-input-output-table", "pattern", "대응 규칙", "일정하게 늘어나는 입력·출력표", { generator: "g1FallLinearInputOutputTable", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 17번" }),
  type("g1-fall-alternating-result-cryptarithm", "number", "복면산과 식", "네 자리 교대 모양이 되는 세로 덧셈", { generator: "g1FallAlternatingResultCryptarithm", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 19번" }),
  type("g1-fall-consecutive-three-sum-completion", "number", "연속수와 합", "합으로 세 연속수 세로셈 완성하기", { generator: "g1FallConsecutiveThreeSumCompletion", sourceMatched: true, textbookSource: "더 클래식 초1 3차 선발시험 20번" }),
  type("g1-winter-shared-box-multiplication", "number", "곱셈 관계", "공유한 상자의 수를 이용해 두 단계 곱셈 거꾸로 풀기", { generator: "g1WinterSharedBoxMultiplication", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 2번" }),
  type("g1-winter-shape-sum-target-row", "number", "매트릭스", "4×4 그림값의 가로·세로 합으로 목표 줄 구하기", { generator: "g1WinterShapeSumGridTargetRow", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 3번" }),
  type("g1-winter-opponent-step-game", "logic", "이동 규칙", "승패에 따라 반대로 움직이는 두 사람의 계단 위치", { generator: "g1WinterOpponentStepGame", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 4번" }),
  type("g1-winter-sudoku-four-full", "logic", "수 배치", "4×4 행·열·2×2 구역 숫자판 완성하기", { generator: "g1WinterSudokuFourFullGrid", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 5번" }),
  type("g1-winter-two-digit-odd-sum-order", "number", "조건에 맞는 수", "자리 합·홀수·자리 크기로 두 자리 수 찾기", { generator: "g1WinterTwoDigitOddSumOrder", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 8번" }),
  type("g1-winter-product-placement-four", "number", "수 배열과 곱", "4×4 색칠 칸에 수를 놓아 가로·세로 곱 맞추기", { generator: "g1WinterProductPlacementFourGrid", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 10번" }),
  type("g1-winter-three-digit-cards-above", "number", "수 카드와 식", "세 숫자 카드로 기준보다 큰 세 자리 수 세기", { generator: "g1WinterThreeDigitCardsAbove", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 13번" }),
  type("g1-winter-three-balance-substitution", "logic", "무게 비교", "세 저울의 관계를 차례로 바꾸어 같은 무게 찾기", { generator: "g1WinterThreeBalanceSubstitution", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 14번" }),
  type("g1-winter-three-cards-parity-chain", "logic", "조건에 맞는 수", "세 수 카드의 차와 짝수 조건으로 합 구하기", { generator: "g1WinterThreeCardsParityChain", sourceMatched: true, textbookSource: "더 클래식 초1 4차 선발시험 15번" }),
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
  type("chained-number-condition", "logic", "조건 배치", "차이가 이어지는 수 카드 조건", { generator: "chainedNumberCondition", sourceMatched: true, textbookSource: "실전 모의고사 3회 3번" }),
  type("latin-square", "logic", "조건 배치", "가로·세로·굵은 칸 수 퍼즐"),
  type("vertical-addition", "number", "복면산과 식", "빈칸이 있는 세로 덧셈", { generator: "maskedVerticalAdditions", sourceMatched: true, textbookSource: "실전 모의고사 3회 6번" }),
  type("consecutive-number-addition", "number", "연속수와 합", "연속하는 수의 세로 덧셈"),
  type("step-game", "logic", "과정 추론", "승패 규칙에 따른 계단 위치"),
  type("multiplication-matrix", "number", "매트릭스", "곱에 맞게 수 매트릭스 채우기"),
  type("three-digit-card-count", "number", "수 카드와 식", "조건에 맞는 세 자리 수의 개수"),
  type("unused-number-card-equations", "number", "수 카드와 식", "여러 식에 수 카드를 한 번씩 쓰고 남는 수 찾기", { generator: "practiceUnusedNumberCardEquations", sourceMatched: true, textbookSource: "실전 모의고사 5회 3번" }),
  type("two-digit-card-threshold-count", "number", "수 카드와 식", "수 카드로 기준보다 큰 두 자리 수의 개수", { generator: "practiceTwoDigitCardThresholdCount", sourceMatched: true, textbookSource: "실전 모의고사 5회 15번" }),
  type("venn-count", "logic", "집합과 포함", "두 조건에 모두 해당하는 사람 수"),
  type("congruent-partition", "geometry", "도형 분할", "합이 같은 합동 도형으로 나누기"),
  type("triangle-count", "geometry", "도형 세기", "크고 작은 삼각형 세기", { generator: "triangleFanCount", sourceMatched: true, textbookSource: "실전 모의고사 3회 12번" }),
  type("square-count", "geometry", "도형 세기", "크고 작은 사각형 세기", { generator: "squareCountShape", sourceMatched: true }),
  type("calendar-weekday-sum", "pattern", "달력과 시간", "달력에서 같은 요일 날짜의 합"),
  type("person-item-logic", "logic", "조건 연결", "사람과 동물·음식 조건 연결", { generator: "personItemLogicBook1", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("set-union-count", "logic", "집합과 포함", "두 종류를 선택한 전체 사람 수", { generator: "setUnionCount", sourceMatched: true }),
  type("custom-operation", "number", "연산 약속", "새 기호의 계산 약속"),
  type("operator-insertion", "number", "수 카드와 식", "+와 -를 넣어 식 완성하기"),
  type("cut-recut-pieces", "number", "과정 추론", "자르고 먹고 다시 잘라 남은 조각 수", { generator: "cutReCutPieces", sourceMatched: true, textbookSource: "실전 모의고사 3회 10번" }),
  type("alternating-line-total", "logic", "순서와 비교", "두 종류를 번갈아 세운 전체 인원", { generator: "practiceAlternatingLineTotal", sourceMatched: true, textbookSource: "실전 모의고사 5회 19번" }),
  type("reverse-initial-count", "logic", "과정 추론", "여러 번 오고 간 뒤 처음 수 거꾸로 찾기", { generator: "reverseInitialCount", sourceMatched: true }),
  type("function-machine", "pattern", "수 규칙", "수 변환 기계의 규칙"),
  type("collection-repeat-gap", "pattern", "수 규칙", "모으기 반복 수열에서 같은 수 사이 개수", { generator: "collectionRepeatGap", sourceMatched: true }),
  type("magic-square", "number", "수 배열과 합", "가로·세로·대각선 합이 같은 마방진", { legacyId: 14, generator: "magicSquare", sourceMatched: true }),
  type("fold-hole-count", "geometry", "색종이 접기", "접은 색종이의 구멍 개수", { generator: "paperFoldHoleCount", legacyId: 4, sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  // 실전 모의고사 3~6회 원본 전용 세부 유형. 비슷한 범용 유형과 구조가 달라 합치지 않는다.
  type("given-shape-expression", "number", "복면산과 식", "주어진 도형 값으로 혼합식 계산하기", { generator: "givenShapeExpression", sourceMatched: true, textbookSource: "실전 모의고사 3회 8번" }),
  type("paired-growing-sequences", "pattern", "수 규칙", "증가폭 수열과 배수 수열을 함께 완성하기", { generator: "pairedGrowingSequences", sourceMatched: true, textbookSource: "실전 모의고사 3회 9번" }),
  type("reverse-operation-ladder", "number", "거꾸로 계산", "사다리 경로의 계산을 거꾸로 적용하기", { generator: "reverseOperationLadder", sourceMatched: true, textbookSource: "실전 모의고사 3회 13번" }),
  type("plus-minus-multi-target", "number", "수 카드와 식", "같은 수 사이에 더하기와 빼기를 넣어 여러 목표 만들기", { generator: "plusMinusMultiTarget", sourceMatched: true, textbookSource: "실전 모의고사 3회 14번" }),
  type("two-custom-operations", "number", "연산 약속", "두 가지 새 연산 약속을 각각 계산하기", { generator: "twoCustomOperations", sourceMatched: true, textbookSource: "실전 모의고사 3회 15번" }),
  type("practice-three-fold-hole-count", "geometry", "색종이 접기", "세 번 반으로 접고 뚫은 구멍 수 구하기", { generator: "practiceThreeFoldHoleCount", sourceMatched: true, textbookSource: "실전 모의고사 3회 16번·더클래식 1과정 4권 도전 2번" }),
  type("aligned-rod-common-length", "geometry", "길이와 측정", "양 끝이 맞는 여러 막대의 길이 구하기", { generator: "practiceAlignedRodLengths", sourceMatched: true, textbookSource: "실전 모의고사 4회 2번" }),
  type("interleaved-pair-sequence", "pattern", "수 규칙", "두 수열이 번갈아 놓인 수열의 빈칸", { generator: "practiceInterleavedPairSequence", sourceMatched: true, textbookSource: "실전 모의고사 4회 9번" }),
  type("two-function-machine-chain", "pattern", "대응 규칙", "두 수 변환 규칙을 차례로 적용하기", { generator: "practiceTwoFunctionMachines", sourceMatched: true, textbookSource: "실전 모의고사 4회 10번" }),
  type("calendar-all-weekday-sum", "pattern", "달력과 시간", "달력에서 같은 요일의 날짜를 모두 더하기", { generator: "practiceCalendarWeekdaySum", sourceMatched: true, textbookSource: "실전 모의고사 4회 13번" }),
  type("vertical-shape-cryptarithm-values", "number", "복면산과 식", "두 자리 도형 세로셈에서 각 도형 값 구하기", { generator: "practiceVerticalShapeCryptarithm", sourceMatched: true, textbookSource: "실전 모의고사 4회 15번" }),
  type("square-symbol-chain", "number", "복면산과 식", "네모 값에서 이어지는 기호식 계산하기", { generator: "practiceSquareSymbolChain", sourceMatched: true, textbookSource: "실전 모의고사 4회 16번" }),
  type("height-extremes-chain", "logic", "순서와 비교", "여러 사람의 키 조건으로 가장 큰 사람과 작은 사람 찾기", { generator: "practiceHeightExtremes", sourceMatched: true, textbookSource: "실전 모의고사 4회 19번" }),
  type("two-digit-letter-cryptarithm", "number", "복면산과 식", "두 자리 글자 세로셈 복면산", { generator: "practiceTwoDigitLetterCryptarithm", sourceMatched: true, textbookSource: "실전 모의고사 5회 6번" }),
  type("recorder-matchstick-length", "geometry", "길이와 측정", "성냥과 연필의 관계로 리코더 길이 구하기", { generator: "practiceRecorderMatchstickLength", sourceMatched: true, textbookSource: "실전 모의고사 5회 10번" }),
  type("shape-rotate-flip-grid", "geometry", "도형 움직이기", "여러 도형을 뒤집고 돌린 결과 그리기", { generator: "practiceShapeRotateFlipGrid", sourceMatched: true, textbookSource: "실전 모의고사 5회 12번" }),
  type("overlapping-run-sequence", "pattern", "수 규칙", "끝이 겹치며 이어지는 연속수 묶음의 빈칸", { generator: "practiceOverlappingRunSequence", sourceMatched: true, textbookSource: "실전 모의고사 5회 18번" }),
  type("congruent-equal-sum-partition-draw", "geometry", "도형 분할", "합이 같은 합동 도형 네 개로 나누어 그리기", { generator: "practiceCongruentEqualSumPartition", sourceMatched: true, textbookSource: "실전 모의고사 6회 1번" }),
  type("paired-magic-square-colored-sum", "number", "마방진", "두 마방진에서 색칠한 두 칸의 합 구하기", { generator: "practiceTwoMagicColoredSums", sourceMatched: true, textbookSource: "실전 모의고사 6회 2번" }),
  type("distinct-zero-one-shape-values", "number", "복면산과 식", "0과 1을 포함한 서로 다른 도형 값 구하기", { generator: "practiceDistinctZeroOneShapeValues", sourceMatched: true, textbookSource: "실전 모의고사 6회 4번" }),
  type("shape-value-matrix-all", "number", "매트릭스", "도형 매트릭스의 모든 도형 값 구하기", { generator: "practiceShapeValueMatrix", sourceMatched: true, textbookSource: "실전 모의고사 6회 5번" }),
  type("repeated-two-digit-shape-addition", "number", "복면산과 식", "반복되는 두 자리 도형 세로 덧셈", { generator: "practiceRepeatedTwoDigitShapeAddition", sourceMatched: true, textbookSource: "실전 모의고사 6회 6번" }),
  type("five-person-photo-order", "logic", "순서와 비교", "사진 속 다섯 사람의 좌우 순서 정하기", { generator: "practiceFivePersonPhotoLine", sourceMatched: true, textbookSource: "실전 모의고사 6회 7번" }),
  type("food-preference-logic-four", "logic", "조건 연결", "네 사람과 네 음식 선호 조건 연결하기", { generator: "practiceFoodPreferenceLogic", sourceMatched: true, textbookSource: "실전 모의고사 6회 8번" }),
  type("relative-position-number-grid-nine", "logic", "수 배치", "1부터 9까지 상대 위치 조건으로 수 배열하기", { generator: "practiceRelativeNumberGridNine", sourceMatched: true, textbookSource: "실전 모의고사 6회 9번" }),
  type("three-fold-line-unfold", "geometry", "색종이 접기", "세 방향으로 접은 선을 펼쳐 완성하기", { generator: "practiceThreeFoldLineUnfold", sourceMatched: true, textbookSource: "실전 모의고사 6회 10번" }),
  type("directional-triangle-sum-grid", "number", "수 배열과 합", "삼각형 바깥 합에 맞게 수 배치하기", { generator: "practiceDirectionalTriangleSums", sourceMatched: true, textbookSource: "실전 모의고사 6회 12번" }),
  type("two-class-total-difference", "number", "합과 차 문장제", "두 반의 전체와 차이로 많은 반 구하기", { generator: "practiceTwoClassTotalDifference", sourceMatched: true, textbookSource: "실전 모의고사 6회 14번" }),
  type("number-ball-pair-targets", "number", "수 카드와 식", "수 공 두 개와 더하기·빼기로 여러 목표 만들기", { generator: "practiceNumberBallPairTargets", sourceMatched: true, textbookSource: "실전 모의고사 6회 16번" }),
  type("diagonal-sum-difference-square", "number", "수 배열과 합", "네 모서리의 두 대각선 합 차 구하기", { generator: "practiceDiagonalDifferenceSquare", sourceMatched: true, textbookSource: "실전 모의고사 6회 17번" }),
  type("three-person-book-chain", "number", "합과 차 문장제", "세 사람이 읽은 책 수의 연속 조건", { generator: "practiceThreePersonBookChain", sourceMatched: true, textbookSource: "실전 모의고사 6회 18번" }),
  type("grid-color-count-sequence", "pattern", "도형 규칙", "3×3 칸의 색칠 개수 변화 규칙", { generator: "practiceGridColorCountSequence", sourceMatched: true, textbookSource: "실전 모의고사 6회 20번" }),
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
  type("fold-cut-unfold-one-draw", "geometry", "색종이 접어 자르기", "한 번 접어 자르고 펼친 모양 그리기", { generator: "foldCutUnfoldOneDraw", sourceMatched: true, textbookSource: "더클래식 1과정 4권 활동 1번·연습 2번" }),
  type("fold-cut-unfold-two-draw", "geometry", "색종이 접어 자르기", "두 번 접어 자르고 펼친 모양 그리기", { generator: "foldCutUnfoldTwoDraw", sourceMatched: true, textbookSource: "더클래식 1과정 4권 연습 1번" }),
  // Geometry worksheet 13유형. 이름이 비슷해도 묻는 정보가 다르면 합치지 않는다.
  type("cube-top-number-grid", "geometry", "쌓기나무 바탕그림", "위에서 본 바탕그림의 수로 앞·옆 모양 그리기", geometryWorksheet("TC", "L3", { worksheetOptions: { promptMode: "draw-views" }, sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 확인 1번·연습 7번" })),
  type("cube-three-views", "geometry", "쌓기나무 바탕그림", "위·앞·옆 모양을 보고 쌓기나무 개수 구하기", geometryWorksheet("VC", "L3", { worksheetOptions: { promptMode: "count-only", showSolveTable: false }, sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 활동 2번·연습 11~12번" })),
  type("cube-three-view-minmax", "geometry", "쌓기나무 바탕그림", "위·앞·옆 모양으로 가능한 최대·최소 개수 구하기", geometryWorksheet("VM", "L3", { worksheetOptions: { showSolveTable: false }, sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 확인 2번·연습 13~14번·도전 1~2번" })),
  type("cube-missing-view", "geometry", "쌓기나무 바탕그림", "두 방향의 모양을 보고 나머지 방향 그리기", geometryWorksheet("VP", "L3", { sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 확인 2~3번·연습 8번" })),
  type("cube-count-solid", "geometry", "쌓기나무 개수", "입체 그림에서 쌓기나무 전체 개수 세기", geometryWorksheet("IC", "L2", { worksheetOptions: { promptMode: "total" }, sourceMatched: true, textbookSource: "더클래식 1과정 4권·9권 · 문제 번호별 대조" })),
  type("cube-minimum-from-solid", "geometry", "쌓기나무 개수", "입체 그림에서 필요한 쌓기나무의 최소 개수", geometryWorksheet("IC", "L2", { worksheetOptions: { promptMode: "minimum" }, sourceMatched: true, textbookSource: "더클래식 1과정 4권 활동 3번·연습 14번" })),
  type("cube-different-shape", "geometry", "쌓기나무", "같은 개수로 만든 입체 중 다른 모양", { geometryGame: "find-shape", generator: "cubeDifferentShape", sourceMatched: true, textbookSource: "실전 모의고사 3회 4번" }),
  type("cube-add-to-match", "geometry", "쌓기나무", "목표 입체까지 더 필요한 쌓기나무", { geometryGame: "copy-build", generator: "practiceCubeAddToMatch", sourceMatched: true, textbookSource: "실전 모의고사 5회 16번" }),
  type("cube-fill-rectangular-box", "geometry", "쌓기나무 채우기", "직육면체 상자를 채우는 데 필요한 개수", geometryWorksheet("FB", "L3", { sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 확인 3번·연습 17번" })),
  type("cube-fill-box", "geometry", "쌓기나무 채우기", "정육면체를 완성하는 데 필요한 개수", geometryWorksheet("CU", "L3", { generator: "cubeFillBoxWorksheet", sourceMatched: true })),
  type("cube-hidden-count", "geometry", "숨은 쌓기나무", "벽 없이 어느 쪽에서도 보이지 않는 쌓기나무의 개수", geometryWorksheet("IN", "L3", { sourceMatched: true, textbookSource: "더클래식 1과정 4권·9권 · 문제 번호별 대조" })),
  type("cube-painted-faces", "geometry", "쌓기나무 색칠", "겉면을 칠한 뒤 색칠된 면의 전체 수", geometryWorksheet("PN", "L4", { worksheetOptions: { variant: "faces" } })),
  type("cube-painted-cube-count", "geometry", "쌓기나무 색칠", "색칠된 면의 수에 맞는 낱개 쌓기나무 개수", geometryWorksheet("PN", "L4", { worksheetOptions: { variant: "count" } })),
  type("cube-black-white-alternating", "geometry", "쌓기나무 색칠", "같은 색이 맞닿지 않게 쌓은 흰색·검은색 개수", geometryWorksheet("BW", "L3", { sourceMatched: true, textbookSource: "더클래식 1과정 4권 도전 3번·9권 · 문제 번호별 대조" })),
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
  // 진단 모의고사 원본의 구조를 그대로 유지하는 전용 유형이다.
  type("diagnostic-part-whole-bar", "number", "수의 구성", "부분 막대의 길이로 전체와 남은 부분 구하기", { generator: "diagnosticPartWholeBar", sourceMatched: true, textbookSource: "필즈 대비 선발 진단 모의고사 1번" }),
  type("diagnostic-dialogue-condition-number", "number", "조건에 맞는 수", "대화 속 여러 조건으로 수 구하기", { generator: "diagnosticDialogueConditionNumber", sourceMatched: true, textbookSource: "필즈 대비 선발 진단 모의고사 2번" }),
  type("diagnostic-number-relation", "number", "수 사이의 약속", "여러 수의 관계로 빈칸 구하기", { generator: "diagnosticNumberRelation", sourceMatched: true, textbookSource: "필즈 대비 선발 진단 모의고사 9번" }),
  type("diagnostic-two-digit-cryptarithm", "number", "복면산과 식", "두 자리 수 덧셈 복면산", { generator: "diagnosticTwoDigitCryptarithm", sourceMatched: true, textbookSource: "필즈 대비 선발 진단 모의고사 20번" }),
  type("diagnostic-animal-balance-order", "logic", "양팔저울", "동물 양팔저울로 무게 순서 정하기", { generator: "diagnosticAnimalBalanceOrder", sourceMatched: true, textbookSource: "필즈 대비 선발 진단 모의고사 8번" }),

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
  type("digital-transform-board-sum", "number", "디지털 숫자", "숫자판을 반의 반 바퀴 돌려 바로 선 수의 합", { generator: "digitalTransformBoardSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-board-half-turn-sum", "number", "디지털 숫자", "숫자판을 반 바퀴 돌려 바로 선 수의 합", { generator: "digitalBoardHalfTurnSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-flip-addition-horizontal", "number", "디지털 숫자", "원래 수와 오른쪽으로 뒤집은 수의 가로 덧셈", { generator: "digitalFlipAdditionHorizontal", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digital-transform-addition", "number", "디지털 숫자", "원래 수와 반 바퀴 돌린 수의 세로 덧셈", { generator: "digitalTransformAddition", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circular-magic-line-sum", "number", "원형진", "1부터 9까지로 네 줄 원형진 완성하기", { generator: "circularMagicLineSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circular-magic-seven-line-sum", "number", "원형진", "1부터 7까지로 세 줄 원형진 완성하기", { generator: "circularMagicSevenLineSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circular-magic-eleven-line-sum", "number", "원형진", "1부터 11까지로 다섯 줄 원형진 완성하기", { generator: "circularMagicElevenLineSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("cross-shape-magic-sum", "number", "모양 마방진", "다섯 수 카드로 십자 마방진 완성하기", { generator: "crossShapeMagicSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("t-shape-magic-sum", "number", "모양 마방진", "다섯 수 카드로 T자 마방진 완성하기", { generator: "tShapeMagicSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-card-placement", "number", "가쿠로", "네 수 카드로 2×2 가쿠로 채우기", { generator: "gakuroCardPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-card-rectangle-placement", "number", "가쿠로", "수 카드로 3×2 가쿠로 채우기", { generator: "gakuroCardRectanglePlacement", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-card-irregular-placement", "number", "가쿠로", "수 카드로 계단 모양 가쿠로 채우기", { generator: "gakuroCardIrregularPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-grid-sum", "number", "가쿠로", "서로 다른 여섯 수로 3×2 가쿠로 채우기", { generator: "gakuroGridSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-grid-nine-sum", "number", "가쿠로", "1부터 9까지로 3×3 가쿠로 채우기", { generator: "gakuroGridNineSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("gakuro-grid-irregular-sum", "number", "가쿠로", "서로 다른 수로 계단 모양 가쿠로 채우기", { generator: "gakuroGridIrregularSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("circle-line-ring-equal-sum", "number", "수 배열과 합", "원 둘레와 지름의 수 합 같게 만들기", { generator: "circleLineRingEqualSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("digit-sum-enumeration", "number", "조건에 맞는 수", "각 자리 숫자의 합이 같은 수 모두 찾기", { generator: "digitSumEnumeration", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("three-digit-step-sequence", "pattern", "수 추리", "같은 수만큼 변하는 세 자리 수열", { generator: "threeDigitStepSequence", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("place-value-condition-three", "number", "조건에 맞는 수", "자릿값 조건으로 세 자리 수 찾기", { generator: "placeValueConditionThree", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("place-value-condition-four", "number", "조건에 맞는 수", "자릿값 조건으로 네 자리 수 찾기", { generator: "placeValueConditionFour", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),
  type("relative-order-logic", "logic", "순서와 비교", "여러 사람의 앞뒤·크기 순서 추리", { generator: "relativeOrderLogicBook1", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 문제 번호별 대조" }),

  // 더클래식 1과정 3권: 페이지가 아니라 단원·단계·문항 번호로 원본을 대조했다.
  // 같은 단원 안에서도 풀이 구조가 달라지는 지점마다 별도 생성기로 나눈다.
  type("tangram-shape-composition", "geometry", "칠교와 넓이", "칠교 조각으로 같은 모양 완성하기", { generator: "tangramShapeComposition", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 활동1 1~3" }),
  type("tangram-piece-area", "geometry", "칠교와 넓이", "칠교 조각과 만든 도형의 넓이", { generator: "tangramPieceArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 연습 1" }),
  type("unit-grid-area", "geometry", "단위넓이", "모눈에서 온칸과 반칸을 세어 넓이 구하기", { generator: "unitGridArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 활동1 4~5, 확인1 1~2, 연습 2~5" }),
  type("growing-shape-area-sum", "pattern", "넓이 규칙", "커지는 정사각형·정삼각형 넓이의 합", { generator: "growingShapeAreaSum", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("nested-square-outer-area", "pattern", "넓이 규칙", "겹쳐 커지는 가장 바깥 정사각형의 넓이", { generator: "nestedSquareOuterArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-part-shaded-fraction", "geometry", "도형의 분할과 분수", "똑같이 나눈 도형의 색칠한 부분을 분수로 나타내기", { generator: "equalPartShadedFraction", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 활동2 1~3, 연습 8~12" }),
  type("equal-partition-drawing", "geometry", "도형의 분할과 분수", "도형을 주어진 수만큼 똑같이 나누어 색칠하기", { generator: "equalPartitionDrawing", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 활동2 4, 연습 14~15" }),
  type("incomplete-partition-fraction", "geometry", "도형의 분할과 분수", "빠진 선을 그어 같은 조각으로 나눈 뒤 분수 구하기", { generator: "incompletePartitionFraction", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 확인2 1~4, 연습 13·16~20" }),
  type("oblique-square-grid-area", "geometry", "단위넓이", "모눈 위 기울어진 정사각형의 넓이", { generator: "obliqueSquareGridArea", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  type("folded-strip-length", "geometry", "단위길이", "모눈 위 접힌 테이프·리본의 전체 길이", { generator: "foldedStripLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("midpoint-number-line", "geometry", "수직선과 길이", "수직선에서 두 수의 중간수 찾기", { generator: "midpointNumberLine", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("segment-chain-distance", "geometry", "수직선과 길이", "겹쳐 주어진 여러 점 사이의 거리", { generator: "segmentChainDistance", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equal-interval-length", "geometry", "수직선과 길이", "똑같이 나눈 한 칸의 거리", { generator: "equalIntervalLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("walking-step-ratio", "number", "배수 문장제", "한 걸음 길이의 배수로 걸음 수 구하기", { generator: "walkingStepRatio", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("route-distance-multiple", "number", "배수 문장제", "이어진 두 길의 거리 배수 구하기", { generator: "routeDistanceMultiple", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("rod-ratio-total-book3", "geometry", "막대와 배수", "막대의 묶음 수와 전체 길이로 각각의 길이 구하기", { generator: "rodRatioTotalBook3", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("rod-comparison-total-unit-test", "geometry", "막대와 배수", "한 막대의 배수 관계와 두 막대의 합으로 길이 구하기", { generator: "rodComparisonTotalUnitTest", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 9번" }),
  type("overlapping-rod-common-unit-test", "geometry", "막대와 배수", "어긋나게 놓은 막대의 공통 눈금으로 길이 구하기", { generator: "overlappingRodCommonUnitTest", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 10번" }),
  type("unit-object-length", "geometry", "단위길이", "같은 물건 여러 개로 잰 한 개의 길이", { generator: "unitObjectLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("equivalent-object-length", "geometry", "단위길이", "여러 물건을 늘어놓은 같은 길이 관계", { generator: "equivalentObjectLength", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("object-combination-equivalent-count", "geometry", "단위길이", "물건의 조합을 한 가지 단위 개수로 바꾸기", { generator: "objectCombinationEquivalentCount", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("proportional-rods-common-total", "geometry", "막대와 배수", "같은 전체 길이를 이루는 막대들의 길이", { generator: "proportionalRodsCommonTotal", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("meeting-distance-ratio", "number", "거리와 배수", "속도의 배수로 만날 때까지 간 거리 나누기", { generator: "meetingDistanceRatio", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("mixed-interval-distance", "geometry", "수직선과 길이", "서로 다른 간격으로 나눈 수직선의 거리", { generator: "mixedIntervalDistance", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("difference-unit-measure", "geometry", "단위길이", "두 단위길이의 차로 전체 길이 재기", { generator: "differenceUnitMeasure", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),

  type("cryptarithm-single-double", "number", "복면산", "한 자리 같은 도형을 두 번 더하는 복면산", { generator: "cryptarithmSingleDouble", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-repeated-number-double", "number", "복면산", "같은 도형으로 만든 두 자리 수를 두 번 더하기", { generator: "cryptarithmRepeatedNumberDouble", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-fixed-digit-addition", "number", "복면산", "도형과 주어진 숫자가 섞인 덧셈", { generator: "cryptarithmFixedDigitAddition", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-missing-digit-column", "number", "복면산", "두 도형이 반복되는 세로 덧셈", { generator: "cryptarithmMissingDigitColumn", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-multi-symbol-carry", "number", "복면산", "여러 도형과 받아올림이 함께 있는 복면산", { generator: "verticalCryptarithmShapeSum", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-linked-equations", "number", "복면산", "서로 이어진 두 복면산으로 도형 값 찾기", { generator: "cryptarithmLinkedEquations", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("cryptarithm-unit-test-q13", "number", "복면산", "두 자리 두 수의 합에서 세 도형 값 찾기", { generator: "unitTestCryptarithmQ13", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 13번" }),
  type("cryptarithm-unit-test-q14", "number", "복면산", "세 자리 수와 두 자리 수를 더해 같은 도형 세 자리 만들기", { generator: "unitTestCryptarithmQ14", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 14번" }),
  type("cryptarithm-unit-test-q15", "number", "복면산", "다섯 도형 세로셈에서 네 자리 합 만들기", { generator: "unitTestCryptarithmQ15", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 15번" }),

  type("binary-weight-selection", "number", "마법카드와 도형수", "1·2·4·8 무게추로 목표 무게 만들기", { generator: "binaryWeightSelection", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("colored-cell-number-code", "pattern", "마법카드와 도형수", "색칠한 칸의 자리값을 더해 수 나타내기", { generator: "coloredCellNumberCode", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 활동1 2~3, 확인1 1~2, 연습 2~7, 심화 4" }),
  type("four-cell-binary-code", "pattern", "마법카드와 도형수", "네 칸 색칠 규칙으로 비밀 수 찾기", { generator: "fourCellBinaryCode", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 23번" }),
  type("symbol-value-code", "number", "마법카드와 도형수", "도형 묶음의 수를 비교해 비밀 수 찾기", { generator: "symbolValueCode", sourceMatched: true, textbookSource: "더클래식 1과정 3권 98·113쪽 · 도형 묶음 상자 4개 구조" }),
  type("symbol-value-code-unit-test", "number", "마법카드와 도형수", "네 개의 도형 묶음을 비교해 비밀 수 찾기", { generator: "symbolValueCodeUnitTest", sourceMatched: true, textbookSource: "더클래식 1과정 3권 단원 테스트 19번" }),
  type("magic-square-three-complete", "number", "마방진", "주어진 아홉 수로 3×3 마방진 완성하기", { generator: "magicSquareThreeComplete", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-three-target", "number", "마방진", "3×3 마방진의 색칠한 한 칸 구하기", { generator: "magicSquareThreeTarget", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-four-target", "number", "마방진", "4×4 마방진의 색칠한 한 칸 구하기", { generator: "magicSquareFourTarget", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("polygon-ring-equal-sum", "number", "수 배열과 합", "오각진의 다섯 줄 합을 같게 만들기", { generator: "polygonRingEqualSum", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("triangle-edge-sum-six", "number", "수 배열과 합", "1부터 6까지로 삼각형 세 변의 합 맞추기", { generator: "triangleEdgeSumSix", sourceMatched: true, textbookSource: "더클래식 1과정 1권 · 더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("triangle-edge-sum-nine", "number", "수 배열과 합", "1부터 9까지로 삼각형 세 변의 합 맞추기", { generator: "triangleEdgeSumNine", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 문제 번호별 대조" }),
  type("magic-square-four-complete", "number", "마방진", "1부터 16까지로 4×4 마방진 완성하기", { generator: "magicSquareFourComplete", sourceMatched: true, textbookSource: "더클래식 1과정 3권 · 연습 19, 심화 3" }),

  // 더클래식 1과정 4권: 153문항을 단계와 인쇄 문제 번호로 직접 대조했다.
  // 기존 검증 유형과 풀이 구조가 같은 문항은 재사용하고, 다른 구조만 새 유형으로 둔다.
  type("tetromino-family-choice", "geometry", "도형 분할", "정사각형 네 칸을 이어 만든 테트로미노 찾기", { generator: "tetrominoFamilyChoice", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("tetromino-square-composition", "geometry", "도형 분할", "돌려서 빈자리에 맞는 네 칸 조각 고르기", { generator: "tetrominoSquareComposition", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("digital-grid-transform", "pattern", "디지털 숫자", "숫자 배열판을 돌리거나 뒤집은 자리 찾기", { generator: "digitalGridTransform", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("digital-transform-arithmetic", "number", "디지털 숫자", "움직인 디지털 두 자리 수의 덧셈·뺄셈", { generator: "digitalTransformArithmetic", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("fold-number-grid-one", "geometry", "색종이 접어 자르기", "한 번 접어 잘린 수의 합 구하기", { generator: "foldDiagonalNumberSum", sourceMatched: true, textbookSource: "더클래식 1과정 4권 활동 2번·연습 3번" }),
  type("fold-number-grid-two-orthogonal", "geometry", "색종이 접어 자르기", "가로·세로로 두 번 접어 잘린 수의 합", { generator: "foldNumberGridTwo", sourceMatched: true, textbookSource: "더클래식 1과정 4권 활동 3번·연습 4~5번" }),
  type("fold-number-grid-two-diagonal", "geometry", "색종이 접어 자르기", "대각선으로 두 번 접어 잘린 수의 합", { generator: "foldNumberGridTwoDiagonal", sourceMatched: true, textbookSource: "더클래식 1과정 4권 활동 4번·연습 6~7번" }),
  type("fold-surface-top-trace", "geometry", "색종이 접기", "여러 번 접은 색종이의 맨 위 색 찾기", { generator: "foldSurfaceTopTrace", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("pair-sum-card-completion", "number", "합과 차", "합이 같은 두 수 카드의 빈 카드 찾기", { generator: "pairSumCardCompletion", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("shape-difference-chain", "number", "비교와 차", "도형 사이의 차를 이어 새로운 차 구하기", { generator: "shapeDifferenceChain", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("measurement-order-chain", "logic", "순서와 비교", "키·나이·거리의 차를 이어 값과 순서 구하기", { generator: "measurementOrderChain", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("balance-unit-ratio", "logic", "양팔저울", "저울의 물건 개수 관계를 이어 같은 무게 구하기", { generator: "balanceUnitRatio", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("directional-seat-placement", "logic", "자리 배치", "위·아래·좌우 조건으로 자리 정하기", { generator: "directionalSeatPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("circular-seat-placement", "logic", "자리 배치", "시계 방향 조건으로 원탁 자리 정하기", { generator: "circularSeatPlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("ordinal-line-placement", "logic", "자리 배치", "앞·뒤 순서와 사이 사람 수로 줄의 자리 정하기", { generator: "ordinalLinePlacement", sourceMatched: true, textbookSource: "더클래식 1과정 4권 · 문제 번호별 대조" }),
  type("star-congruent-partition-draw-book4", "geometry", "도형 분할", "별을 하나씩 가진 네 합동 도형으로 나누어 그리기", { generator: "starCongruentPartitionDrawBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 1번" }),
  type("forest-congruent-partition-draw-book4", "geometry", "도형 분할", "나무를 하나씩 가진 네 합동 영역으로 나누어 그리기", { generator: "forestCongruentPartitionDrawBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 2번" }),
  type("digital-grid-upright-after-moves", "pattern", "디지털 숫자", "숫자판을 움직인 뒤 똑바른 수의 합", { generator: "digitalGridUprightAfterMoves", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 3·19번" }),
  type("digital-self-half-turn-calculation", "number", "디지털 숫자", "두 자리 수와 반 바퀴 돌린 수 계산", { generator: "digitalSelfHalfTurnCalculation", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 4번" }),
  type("overlapping-paper-bottom", "geometry", "색종이 겹치기", "겹친 색종이를 차례로 빼며 맨 아래 찾기", { generator: "overlappingPaperBottom", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 7번" }),
  type("measurement-age-difference-book4", "logic", "순서와 비교", "나이 차를 이어 두 사람의 차 구하기", { generator: "measurementAgeDifferenceBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 11번" }),
  type("measurement-distance-difference-book4", "logic", "순서와 비교", "앞뒤 거리 차를 이어 두 사람의 차 구하기", { generator: "measurementDistanceDifferenceBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 12번" }),
  type("measurement-time-difference-book4", "logic", "순서와 비교", "들어온 시각 차를 이어 두 사람의 차 구하기", { generator: "measurementTimeDifferenceBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 23번" }),
  type("race-third-place-book4", "logic", "순서와 비교", "여러 순서 조건으로 세 번째 사람 찾기", { generator: "raceThirdPlaceBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 15번" }),
  type("directional-landmark-placement-book4", "logic", "위치 관계", "동서남북 조건으로 표시한 장소 찾기", { generator: "directionalLandmarkPlacementBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 16번" }),
  type("circular-seat-blank-book4", "logic", "자리 배치", "원탁 조건으로 표시한 자리의 사람 찾기", { generator: "circularSeatBlankBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 17·24번" }),
  type("three-fold-cut-line-book4", "geometry", "색종이 접기", "세 번 접어 자른 선을 펼쳐 그리기", { generator: "threeFoldCutLineBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 21번" }),
  type("front-back-two-order-totals-book4", "logic", "순서와 비교", "두 사람의 앞선 순서에 따른 전체 인원 두 경우", { generator: "frontBackTwoOrderTotalsBook4", sourceMatched: true, textbookSource: "더클래식 1과정 4권 단원 테스트 25번" }),

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

  // 더클래식 1과정 5권 단원 테스트: 원본 25문항과 공식 답안을 1:1 대조했다.
  type("row-major-grid-two-target-sum-book5", "pattern", "수 배열 경로", "가로로 이어 쓴 수 배열의 두 빈칸 합", { generator: "rowMajorGridTwoTargetSumBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 1번" }),
  type("radial-line-cycle-two-part-book5", "pattern", "수 배열 경로", "여러 줄 순환 수의 값과 자리 찾기", { generator: "radialLineCycleTwoPartBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 2번" }),
  type("calendar-weekday-list-ordinal-book5", "pattern", "달력 규칙", "한 달의 같은 요일 날짜와 몇 번째 요일", { generator: "calendarWeekdayListOrdinalBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 3번" }),
  type("calendar-special-date-offset-book5", "pattern", "달력 규칙", "알려진 날짜로 다른 날짜의 요일 찾기", { generator: "calendarSpecialDateOffsetBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 4번" }),
  type("calendar-weekday-sum-year-boundary-book5", "pattern", "달력 규칙", "같은 요일 날짜의 합으로 다음 해 1월 1일 찾기", { generator: "calendarWeekdaySumYearBoundaryBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 5번" }),
  type("shortest-path-diagonal-shortcut-book5", "logic", "최단거리", "사선 지름길이 있는 최단거리 방법 수", { generator: "shortestPathDiagonalShortcutBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 8번" }),
  type("square-product-cycle-fill-book5", "number", "곱셈 매트릭스", "사각형 네 꼭짓점의 수 모두 채우기", { generator: "squareProductCycleFillBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 11번" }),
  type("checkerboard-product-matrix-book5", "logic", "곱셈 매트릭스", "4×4 엇갈린 칸에 수 카드를 놓아 곱 맞추기", { generator: "checkerboardProductMatrixBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 12·22번" }),
  type("symbol-zero-one-network-book5", "number", "도형 곱셈식", "0부터 4까지 도형 곱셈식", { generator: "symbolZeroOneNetworkBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 13번" }),
  type("symbol-cross-network-book5", "number", "도형 곱셈식", "여섯 수 카드의 교차 도형식", { generator: "symbolCrossNetworkBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 14번" }),
  type("symbol-square-product-network-book5", "number", "도형 곱셈식", "같은 도형끼리 곱한 도형식", { generator: "symbolSquareProductNetworkBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 15번" }),
  type("square-paper-growth-book5", "pattern", "삼각수와 사각수", "정사각형 색종이 배열의 수 규칙", { generator: "squarePaperGrowthBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 19번" }),
  type("square-row-two-boundaries-book5", "pattern", "삼각수와 사각수", "홀수 개씩 늘어나는 두 줄의 처음과 끝", { generator: "squareRowTwoBoundariesBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 20번" }),
  type("calendar-ordinal-sum-infer-weekday-book5", "pattern", "달력 규칙", "몇 번째 같은 요일 날짜의 합으로 1일 찾기", { generator: "calendarOrdinalSumInferWeekdayBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 21번" }),
  type("regular-triangle-grid-count-book5", "geometry", "도형 세기", "정삼각형 모눈의 크고 작은 삼각형 세기", { generator: "regularTriangleGridCountBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 23번" }),
  type("square-border-stone-growth-book5", "pattern", "바둑돌 규칙", "커지는 네모의 테두리와 안쪽 바둑돌 차", { generator: "squareBorderStoneGrowthBook5", sourceMatched: true, textbookSource: "더클래식 1과정 5권 단원 테스트 25번" }),

  // 더클래식 1과정 6권: 159문항을 네 단계와 인쇄 문제 번호로 직접 대조했다.
  // 같은 단원 안에서도 풀이 구조가 달라지면 별도 유형으로 분리한다.
  type("number-line-midpoint-book6", "geometry", "수직선과 길이", "수직선에서 두 점의 중간 수 찾기", { generator: "numberLineMidpointBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("number-line-unit-distance-book6", "geometry", "수직선과 길이", "똑같이 나눈 수직선 한 칸의 거리", { generator: "numberLineUnitDistanceBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("number-line-two-part-distance", "geometry", "수직선과 길이", "서로 다르게 나눈 두 구간의 거리", { generator: "numberLineTwoPartDistance", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("rod-difference-measure-count", "number", "비와 측정", "두 막대의 차이로 같은 길이를 재는 횟수", { generator: "rodDifferenceMeasureCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("equivalent-fraction-chain", "number", "분수와 비", "크기가 같은 분수의 빈칸 완성", { generator: "equivalentFractionChain", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("equivalent-ratio-chain", "number", "분수와 비", "크기가 같은 비의 빈칸 완성", { generator: "equivalentRatioChain", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("bar-ratio-read", "geometry", "분수와 비", "막대 조각의 개수로 두 길이의 비 읽기", { generator: "barRatioRead", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("bar-ratio-total-length", "number", "분수와 비", "막대의 비와 전체 길이로 각각의 길이 구하기", { generator: "barRatioTotalLength", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("balance-ratio-book6", "logic", "비와 양팔저울", "수평인 저울에서 두 물건 무게의 비", { generator: "balanceRatioBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("balance-weight-ratio", "logic", "비와 양팔저울", "저울의 비와 전체 무게로 각 물건 무게 구하기", { generator: "balanceWeightRatio", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("symbol-sum-card-deduction", "number", "도형 수 추리", "서로 다른 수 카드와 도형 합으로 값 찾기", { generator: "symbolSumCardDeduction", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("stride-ratio-total", "number", "비 문장제", "같은 거리의 걸음 수와 보폭의 합으로 보폭 구하기", { generator: "strideRatioTotal", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("repeated-unit-length-total", "number", "비 문장제", "두 막대 개수와 길이의 합으로 전체 길이 구하기", { generator: "repeatedUnitLengthTotal", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),

  type("quadrilateral-perimeter", "geometry", "도형의 둘레", "직사각형·평행사변형의 둘레와 한 변", { generator: "quadrilateralPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("equal-sided-quadrilateral-perimeter", "geometry", "도형의 둘레", "정사각형·마름모의 둘레와 한 변", { generator: "equalSidedQuadrilateralPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("joined-quadrilateral-dimensions", "geometry", "붙인 도형의 둘레", "붙인 사각형의 둘레로 가로·세로 찾기", { generator: "joinedQuadrilateralDimensions", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("joined-quadrilateral-side", "geometry", "붙인 도형의 둘레", "붙인 두 사각형의 공통 변 길이 찾기", { generator: "joinedQuadrilateralSide", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("joined-regular-shape-side", "geometry", "붙인 도형의 둘레", "정다각형과 사각형을 붙여 모르는 변 찾기", { generator: "joinedRegularShapeSide", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("diagonal-triangle-perimeter", "geometry", "도형의 둘레", "직사각형의 대각선으로 나눈 삼각형 둘레", { generator: "diagonalTrianglePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("square-composition-side", "geometry", "정사각형 분할", "크기가 다른 정사각형을 붙여 한 변 찾기", { generator: "squareCompositionSide", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("square-composition-perimeter", "geometry", "정사각형 분할", "정사각형으로 나눈 도형의 색칠 부분 둘레", { generator: "squareCompositionPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("fold-cut-rectangle-perimeter", "geometry", "접기와 둘레", "직사각형을 접어 자른 뒤 처음 둘레 찾기", { generator: "foldCutRectanglePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("rectilinear-route-perimeter", "geometry", "직각 도형의 둘레", "서로 다른 직각 경로의 둘레 비교", { generator: "rectilinearRoutePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("rectilinear-perimeter-book6", "geometry", "직각 도형의 둘레", "모눈과 직각으로 꺾인 도형의 둘레", { generator: "rectilinearPerimeterBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("concave-perimeter", "geometry", "직각 도형의 둘레", "안으로 들어간 부분이 있는 도형의 둘레", { generator: "concavePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("grid-cutout-perimeter", "geometry", "잘라낸 도형의 둘레", "모눈 정사각형을 잘라낸 뒤 남은 둘레", { generator: "gridCutoutPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("polyomino-outer-perimeter", "geometry", "단위 도형의 둘레", "같은 정사각형을 붙인 도형의 바깥 둘레", { generator: "polyominoOuterPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("attached-regular-shape-perimeter", "geometry", "붙인 도형의 둘레", "여러 정다각형을 붙인 도형의 전체 둘레", { generator: "attachedRegularShapePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("perimeter-unit-edge-inverse", "geometry", "단위 도형의 둘레", "붙인 도형의 둘레로 한 변의 길이 찾기", { generator: "perimeterUnitEdgeInverse", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("cutout-perimeter-change", "geometry", "잘라낸 도형의 둘레", "정사각형을 잘라내거나 옮긴 뒤 둘레 변화", { generator: "cutoutPerimeterChange", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("square-partition-lengths", "geometry", "정사각형 분할", "정사각형을 나눈 작은 정사각형의 길이", { generator: "squarePartitionLengths", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("nested-square-perimeter", "geometry", "정사각형 분할", "겹쳐 나눈 정사각형의 색칠 부분 둘레", { generator: "nestedSquarePerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),

  type("napier-multiplication", "number", "곱셈을 간편하게", "네이피어 격자로 두 자리·세 자리 수 곱하기", { generator: "napierMultiplication", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("area-model-multiplication", "number", "곱셈을 간편하게", "타일 넓이로 곱셈을 나누어 계산하기", { generator: "areaModelMultiplication", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("round-pair-addition", "number", "덧셈을 간편하게", "합이 둥근 수가 되는 수끼리 짝지어 더하기", { generator: "roundPairAddition", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("round-pair-missing-addend", "number", "덧셈을 간편하게", "짝의 합으로 빠진 더하는 수 찾기", { generator: "roundPairMissingAddend", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("common-factor-sum", "number", "곱셈을 간편하게", "같은 수를 묶어 곱셈의 합 계산하기", { generator: "commonFactorSum", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("near-round-multiplication", "number", "곱셈을 간편하게", "99번·999번 더한 값을 한 묶음 빼서 계산하기", { generator: "nearRoundMultiplication", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("near-round-addition", "number", "덧셈을 간편하게", "9·99·999에 가까운 수의 합을 고쳐 계산하기", { generator: "nearRoundAddition", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("inclusive-range-count", "number", "연속수", "처음 수와 끝 수를 포함한 수의 개수", { generator: "inclusiveRangeCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("consecutive-sum-even-count", "number", "연속수의 합", "개수가 짝수인 연속수의 합", { generator: "consecutiveSumEvenCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("consecutive-sum-odd-count", "number", "연속수의 합", "개수가 홀수인 연속수의 합", { generator: "consecutiveSumOddCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("nth-even-odd", "number", "홀수와 짝수", "몇 번째 짝수·홀수 구하기", { generator: "nthEvenOdd", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("even-odd-position", "number", "홀수와 짝수", "주어진 짝수·홀수가 몇 번째인지 찾기", { generator: "evenOddPosition", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("facing-page-number", "number", "책의 쪽수", "펼친 책의 마주 보는 두 쪽수", { generator: "facingPageNumber", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("alternating-pair-sum", "number", "덧셈을 간편하게", "더하기와 빼기를 짝지어 빠르게 계산하기", { generator: "alternatingPairSum", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("common-factor-missing-term", "number", "곱셈을 간편하게", "같은 수를 묶은 곱셈식의 빈칸 찾기", { generator: "commonFactorMissingTerm", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("consecutive-numbers-from-sum", "number", "연속수의 합", "연속수의 개수와 합으로 각 수 찾기", { generator: "consecutiveNumbersFromSum", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("newspaper-page-pair", "logic", "책의 쪽수", "접힌 신문의 마주 보는 쪽수로 빠진 쪽 찾기", { generator: "newspaperPagePair", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),

  type("range-number-digit-count", "number", "수와 숫자", "범위 안의 수 개수와 쓰인 숫자 개수", { generator: "rangeNumberDigitCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("total-written-digits", "number", "수와 숫자", "1부터 어떤 수까지 쓴 숫자의 전체 개수", { generator: "totalWrittenDigits", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("digit-occurrence-count", "number", "숫자 포함", "범위에서 특정 숫자의 개수나 포함된 수 세기", { generator: "digitOccurrenceCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("digit-exclusion-count", "number", "숫자 포함", "특정 숫자가 들어간 수를 제외한 개수", { generator: "digitExclusionCount", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("consecutive-sign-insertion", "number", "연산 기호 넣기", "이어진 수 사이에 더하기·빼기 넣기", { generator: "consecutiveSignInsertion", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("odd-sequence-sign-insertion", "number", "연산 기호 넣기", "홀수 수열 사이에 더하기·빼기 넣기", { generator: "oddSequenceSignInsertion", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("doubling-sequence-sign-insertion", "number", "연산 기호 넣기", "두 배씩 커지는 수 사이에 더하기·빼기 넣기", { generator: "doublingSequenceSignInsertion", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("plus-concatenation-evaluate", "number", "수 이어 붙이기", "숫자를 이어 붙인 여러 덧셈식 계산하기", { generator: "plusConcatenationEvaluate", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("plus-concatenation-target", "number", "수 이어 붙이기", "더하기와 이어 붙이기로 목표 수 만들기", { generator: "plusConcatenationTarget", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("mixed-sign-concatenation", "number", "수 이어 붙이기", "더하기·빼기와 이어 붙이기로 목표 수 만들기", { generator: "mixedSignConcatenation", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("remove-plus-concatenation", "number", "수 이어 붙이기", "더하기 하나를 빼 수를 이어 붙여 목표값 만들기", { generator: "removePlusConcatenation", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("last-number-from-digit-total", "number", "수와 숫자", "쓴 숫자의 전체 개수로 마지막 수 찾기", { generator: "lastNumberFromDigitTotal", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),
  type("repeated-digit-concatenation", "number", "수 이어 붙이기", "같은 숫자를 이어 붙이고 더해 목표 수 만들기", { generator: "repeatedDigitConcatenation", sourceMatched: true, textbookSource: "더클래식 1과정 6권 · 문제 번호별 대조" }),

  // 더클래식 1과정 6권 단원 테스트: 원본 25문항과 공식 답안을 1:1 대조했다.
  type("midpoint-pair-unit-test-book6", "geometry", "수직선과 길이", "두 수직선의 중간 수 각각 구하기", { generator: "unitTestMidpointPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 1번" }),
  type("split-target-distance-unit-test-book6", "geometry", "수직선과 길이", "서로 다르게 나눈 수직선의 두 점 거리", { generator: "unitTestSplitTargetsBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 2번" }),
  type("rod-difference-ratio-unit-test-book6", "number", "비와 측정", "같은 길이를 잰 횟수로 두 끈의 차 구하기", { generator: "unitTestRodDifferenceRatioBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 3·25번" }),
  type("equal-bar-pieces-unit-test-book6", "number", "분수와 비", "같은 길이의 조각 수와 합으로 두 길이 구하기", { generator: "unitTestEqualBarsBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 4번" }),
  type("two-object-weight-unit-test-book6", "logic", "비와 양팔저울", "두 물건의 개수 관계와 합으로 각각의 무게 구하기", { generator: "unitTestTwoWeightBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 5번" }),
  type("symbol-card-chain-unit-test-book6", "number", "도형 수 추리", "다섯 수 카드와 이어진 도형식", { generator: "unitTestSymbolCardChainBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 6번" }),
  type("rectangle-rhombus-side-unit-test-book6", "geometry", "붙인 도형의 둘레", "직사각형 둘레로 붙인 마름모 한 변 찾기", { generator: "unitTestRectangleRhombusBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 7번" }),
  type("rectangle-triangle-square-unit-test-book6", "geometry", "붙인 도형의 둘레", "직사각형·정삼각형·정사각형을 붙인 둘레", { generator: "unitTestAttachedThreeShapesBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 8번" }),
  type("three-square-shaded-perimeter-unit-test-book6", "geometry", "정사각형 분할", "크기가 다른 세 정사각형의 색칠 부분 둘레", { generator: "unitTestThreeSquaresBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 9번" }),
  type("scattered-side-perimeter-unit-test-book6", "geometry", "직각 도형의 둘레", "흩어진 네 변으로 직각 도형 둘레 구하기", { generator: "unitTestScatteredPerimeterBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 10번" }),
  type("square-triangle-strip-unit-test-book6", "geometry", "붙인 도형의 둘레", "정사각형 둘과 정삼각형 넷을 붙인 둘레", { generator: "unitTestSquareTriangleStripBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 11번" }),
  type("square-tiling-shaded-unit-test-book6", "geometry", "정사각형 분할", "여러 정사각형으로 나눈 색칠한 작은 정사각형 둘레", { generator: "unitTestSquareTilingBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 12번" }),
  type("round-pair-eight-addends-unit-test-book6", "number", "덧셈을 간편하게", "여덟 수를 네 쌍의 둥근 수로 묶어 더하기", { generator: "unitTestRoundPairEightBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 13번" }),
  type("even-odd-position-pair-unit-test-book6", "number", "홀수와 짝수", "짝수와 홀수의 순서를 각각 구하기", { generator: "unitTestEvenOddPositionPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 14번" }),
  type("facing-page-sum-unit-test-book6", "number", "책의 쪽수", "마주 보는 두 쪽수의 합으로 왼쪽 쪽 찾기", { generator: "unitTestFacingPageSumBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 15번" }),
  type("range-number-digit-pair-unit-test-book6", "number", "수와 숫자", "두 범위의 수 개수와 숫자 개수 함께 구하기", { generator: "unitTestRangeDigitPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 16번" }),
  type("consecutive-even-sum-pair-unit-test-book6", "number", "연속수의 합", "개수가 짝수인 두 연속수의 합", { generator: "unitTestConsecutiveEvenPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 17번" }),
  type("consecutive-odd-sum-pair-unit-test-book6", "number", "연속수의 합", "개수가 홀수인 두 연속수의 합", { generator: "unitTestConsecutiveOddPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 18번" }),
  type("sign-insertion-triple-unit-test-book6", "number", "연산 기호 넣기", "같은 네 수로 세 가지 목표값 만들기", { generator: "unitTestSignTripleBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 19번" }),
  type("plus-concatenation-pair-unit-test-book6", "number", "수 이어 붙이기", "같은 다섯 수로 이어 붙인 두 식 만들기", { generator: "unitTestPlusConcatenationPairBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 21번" }),
  type("balance-chain-equivalence-unit-test-book6", "logic", "비와 양팔저울", "세 저울의 관계로 같은 무게 개수 구하기", { generator: "unitTestBalanceChainBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 22번" }),
  type("fold-cut-open-perimeter-unit-test-book6", "geometry", "접기와 둘레", "두 번 접어 자른 뒤 처음 직사각형 둘레 찾기", { generator: "unitTestFoldCutOpenPerimeterBook6", sourceMatched: true, textbookSource: "더클래식 1과정 6권 단원 테스트 23번" }),

  // 더클래식 1과정 7권: 180문항을 네 단계와 인쇄 문제 번호로 직접 대조했다.
  // 달력·시계, 우기기, 가로수, 팔린드롬·벤다이어그램을 풀이 구조별로 나눈다.
  type("calendar-month-shift-weekday-b7", "pattern", "달력과 시계", "다음 달 같은 날짜·1일의 요일 찾기", { generator: "calendarMonthShiftWeekdayBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("calendar-cross-month-weekday-b7", "pattern", "달력과 시계", "여러 달을 건너 특정 날짜의 요일 찾기", { generator: "calendarCrossMonthKnownWeekday", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("weekday-after-days-b7", "pattern", "달력과 시계", "오늘부터 며칠 뒤의 요일 찾기", { generator: "weekdayAfterDaysBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("time-unit-conversion-b7", "number", "달력과 시계", "일·시간·분·초 단위 바꾸기", { generator: "timeUnitConversionBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("analog-clock-reading-b7", "number", "달력과 시계", "시침과 분침을 보고 시각 읽기", { generator: "analogClockReadingBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("elapsed-time-analog-b7", "number", "달력과 시계", "두 시계 사이의 지난 시간 구하기", { generator: "elapsedTimeAnalogBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("time-add-subtract-base60-b7", "number", "달력과 시계", "60분 받아올림·받아내림 시간 계산", { generator: "timeAddSubtractBase60Book7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("find-end-time-b7", "number", "달력과 시계", "시작 시각과 걸린 시간으로 끝 시각 찾기", { generator: "findEndTimeBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("find-start-time-b7", "number", "달력과 시계", "끝 시각과 걸린 시간으로 시작 시각 찾기", { generator: "findStartTimeBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("consecutive-full-month-reverse-b7", "logic", "달력과 시계", "31일이 연달아 있는 두 달을 거꾸로 추리하기", { generator: "consecutiveFullMonthReverse", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("leap-year-cross-month-weekday-b7", "pattern", "달력과 시계", "윤년을 포함해 여러 달 뒤 요일 찾기", { generator: "leapYearCrossMonthWeekday", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("mirror-clock-reading-b7", "geometry", "거울 시계", "거울에 비친 시계를 뒤집어 원래 시각 읽기", { generator: "mirrorClockReadingBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("mirror-clock-elapsed-b7", "logic", "거울 시계", "거울 시계 두 개로 밤사이 지난 시간 구하기", { generator: "mirrorClockElapsed", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("mirror-symmetric-clock-b7", "logic", "거울 시계", "거울에 비친 모양이 같은 시각 찾기", { generator: "mirrorSymmetricClock", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),

  type("arithmetic-sequence-nth-b7", "pattern", "차가 같은 수열", "첫 수와 뛰는 수로 몇 번째 수 구하기", { generator: "arithmeticSequenceNthBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("shared-polygon-matchsticks-b7", "pattern", "수열의 활용", "맞닿은 정다각형의 성냥개비 수 구하기", { generator: "sharedPolygonMatchsticksBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("division-fill-long-form-b7", "number", "거꾸로 풀기", "나눗셈 세로식의 빈칸 완성하기", { generator: "divisionFillLongForm", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reverse-linear-equation-b7", "number", "거꾸로 풀기", "더하고 곱한 식을 거꾸로 풀어 빈칸 찾기", { generator: "reverseLinearEquationBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("arithmetic-sequence-position-b7", "pattern", "차가 같은 수열", "마지막 수가 몇 번째인지 거꾸로 찾기", { generator: "arithmeticSequencePositionBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("sparse-arithmetic-sequence-b7", "pattern", "차가 같은 수열", "띄엄띄엄 주어진 수로 첫 수·빈칸 찾기", { generator: "sparseArithmeticSequenceBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("indexed-arithmetic-sequence-b7", "pattern", "차가 같은 수열", "순서표의 대응 규칙으로 먼 번째 수 구하기", { generator: "indexedArithmeticSequenceBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-leg-animal-assumption-b7", "logic", "가정하여 풀기", "동물 수와 다리 수로 두 동물 수 구하기", { generator: "twoLegAnimalAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-wheel-vehicle-assumption-b7", "logic", "가정하여 풀기", "탈것 수와 바퀴 수로 각각의 수 구하기", { generator: "twoWheelVehicleAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-card-value-assumption-b7", "logic", "가정하여 풀기", "두 숫자 카드의 장수와 합 구하기", { generator: "twoCardValueAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-score-value-assumption-b7", "logic", "가정하여 풀기", "두 배점의 문제 수 구하기", { generator: "twoScoreValueAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-coin-value-assumption-b7", "logic", "가정하여 풀기", "두 동전·우표의 개수와 금액 구하기", { generator: "twoCoinValueAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("correct-wrong-score-assumption-b7", "logic", "가정하여 풀기", "맞고 틀린 점수로 맞힌 문제 수 구하기", { generator: "correctWrongScoreAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("constant-step-object-growth-b7", "pattern", "수열의 활용", "일정하게 늘어나는 바둑돌의 먼 번째 개수", { generator: "constantStepObjectGrowthBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("bounded-symbol-sum-extrema-b7", "logic", "조건에 맞는 수", "두 수의 관계와 합의 범위에서 최댓값·최솟값 구하기", { generator: "boundedSymbolSumExtrema", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("win-loss-net-zero-b7", "logic", "가정하여 풀기", "이기고 진 횟수와 이동 결과로 승리 횟수 구하기", { generator: "winLossNetZero", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("shared-consumption-assumption-b7", "logic", "가정하여 풀기", "먹는 양이 다른 두 집단의 수 구하기", { generator: "sharedConsumptionAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("count-difference-assumption-b7", "logic", "가정하여 풀기", "두 종류의 개수 차와 단위 수 차로 각각 구하기", { generator: "countDifferenceAssumption", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("linked-sequence-correspondence-b7", "pattern", "차가 같은 수열", "두 수열의 같은 순서에 놓인 수 구하기", { generator: "linkedSequenceCorrespondence", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),

  type("climb-slip-days-b7", "logic", "재치 있게 풀기", "낮에 오르고 밤에 미끄러지는 날짜 구하기", { generator: "climbSlipDays", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("exchange-container-total-b7", "logic", "재치 있게 풀기", "빈 병·쿠폰을 바꾸어 먹는 전체 개수", { generator: "exchangeContainerTotal", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reverse-doubling-target-day-b7", "pattern", "두 배 규칙", "마지막 크기에서 거꾸로 두 배 전의 날짜 찾기", { generator: "reverseDoublingTargetDay", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("doubling-fraction-start-count-b7", "pattern", "두 배 규칙", "가득 찬 날보다 앞선 양과 시작 개수 함께 구하기", { generator: "doublingFractionStartCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("doubling-start-count-b7", "pattern", "두 배 규칙", "더 이른 날 가득 채우기 위한 처음 개수", { generator: "doublingStartCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("doubling-half-full-day-b7", "pattern", "두 배 규칙", "가득 차기 하루 전 절반이 되는 날", { generator: "doublingHalfFullDay", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("doubling-two-start-earlier-b7", "pattern", "두 배 규칙", "처음 수가 두 배일 때 가득 차는 날짜", { generator: "doublingTwoStartEarlier", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("polygon-border-point-count-b7", "geometry", "가로수 심기", "정다각형 둘레의 점·바둑돌 전체 개수", { generator: "polygonBorderPointCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("polygon-border-side-count-inverse-b7", "geometry", "가로수 심기", "둘레의 점 개수로 한 변의 점 개수 구하기", { generator: "polygonBorderSideCountInverse", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("polygon-stakes-from-side-b7", "geometry", "가로수 심기", "정다각형 한 변의 말뚝 수로 전체 말뚝 수 구하기", { generator: "polygonStakesFromSide", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("closed-perimeter-object-count-b7", "number", "가로수 심기", "닫힌 둘레와 간격으로 나무·가로등 수 구하기", { generator: "closedPerimeterObjectCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("closed-perimeter-from-spacing-count-b7", "number", "가로수 심기", "나무 수와 간격으로 닫힌 둘레 구하기", { generator: "closedPerimeterFromSpacingCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("between-objects-subdivision-count-b7", "number", "가로수 심기", "나무 사이를 더 작은 간격으로 나눈 꽃의 수", { generator: "betweenObjectsSubdivisionCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("perimeter-capacity-b7", "number", "가로수 심기", "둘레의 가로등 사이 의자와 앉는 사람 수", { generator: "perimeterCapacity", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("between-object-perimeter-b7", "number", "가로수 심기", "가로등 사이 나무 수로 연못 둘레 거꾸로 찾기", { generator: "betweenObjectPerimeter", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("inner-outer-path-object-count-b7", "geometry", "가로수 심기", "직사각형 산책로 안쪽·바깥쪽 가로등 수", { generator: "innerOuterPathObjectCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("polygon-border-shape-conversion-b7", "geometry", "가로수 심기", "같은 바둑돌로 다른 정다각형의 한 변 만들기", { generator: "polygonBorderShapeConversion", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),

  type("palindrome-length-count-b7", "number", "팔린드롬", "자릿수별 대칭수의 개수 구하기", { generator: "palindromeLengthCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("three-digit-palindrome-digit-sum-b7", "number", "팔린드롬", "각 자리 합에 맞는 세 자리 대칭수 모두 찾기", { generator: "threeDigitPalindromeDigitSum", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("calendar-date-palindrome-b7", "pattern", "팔린드롬", "월·일을 이어 쓴 날짜 대칭수 찾기", { generator: "calendarDatePalindrome", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("clock-time-palindrome-b7", "pattern", "팔린드롬", "시와 분을 이어 쓴 시각 대칭수 세기", { generator: "clockTimePalindrome", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reversed-two-digit-difference-enumeration-b7", "number", "자리 바꾸기", "앞뒤를 바꾼 두 자리 수의 차로 모든 수 찾기", { generator: "reversedTwoDigitDifferenceEnumeration", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reversed-two-digit-difference-extreme-b7", "number", "자리 바꾸기", "앞뒤를 바꾼 수의 차로 가장 큰·작은 수 찾기", { generator: "reversedTwoDigitDifferenceExtreme", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reversed-digit-given-tens-b7", "number", "자리 바꾸기", "십의 자리와 바꾼 수의 차로 처음 수 찾기", { generator: "reversedDigitGivenTens", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reversed-digit-pair-range-b7", "logic", "자리 바꾸기", "합의 범위와 자리 바꿈 관계로 두 수 찾기", { generator: "reversedDigitPairRange", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("four-point-distance-chain-b7", "geometry", "거리와 집합", "네 점·여섯 점 사이의 겹친 거리 찾기", { generator: "fourPointDistanceChain", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("venn-overlap-all-b7", "logic", "벤다이어그램", "모두 두 집합에 속할 때 겹치는 수 구하기", { generator: "vennOverlapAll", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("venn-union-total-b7", "logic", "벤다이어그램", "두 집합과 겹치는 수로 전체 수 구하기", { generator: "vennUnionTotal", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("venn-exactly-one-b7", "logic", "벤다이어그램", "두 조건 중 한 가지만 좋아하는 수 구하기", { generator: "vennExactlyOne", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("venn-neither-b7", "logic", "벤다이어그램", "두 조건에 모두 해당하지 않는 수 구하기", { generator: "vennNeitherBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("venn-overlap-with-neither-b7", "logic", "벤다이어그램", "전체와 둘 다 아닌 수를 이용해 겹치는 수 구하기", { generator: "vennOverlapWithNeither", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("two-way-table-count-b7", "logic", "두 기준 분류", "두 가지 기준으로 나눈 표의 빠진 수 구하기", { generator: "twoWayTableCount", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("palindrome-adjacent-digit-difference-b7", "number", "팔린드롬", "이웃한 자리 차 조건의 세 자리 대칭수 찾기", { generator: "palindromeAdjacentDigitDifference", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("complement-groups-total-b7", "logic", "집합과 포함", "두 집단에 속하지 않는 수와 합으로 전체 구하기", { generator: "complementGroupsTotal", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("four-group-complement-total-b7", "logic", "집합과 포함", "네 모둠의 여집합 합으로 전체 구하기", { generator: "fourGroupComplementTotal", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reverse-add-palindrome-b7", "number", "팔린드롬", "수를 거꾸로 읽어 더하며 대칭수 만들기", { generator: "reverseAddPalindrome", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("minimum-stone-moves-b7", "logic", "도형 옮기기", "바둑돌을 가장 적게 옮겨 목표 모양 만들기", { generator: "minimumStoneMoves", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("kaprekar-495-b7", "number", "수의 규칙", "세 자리 수의 큰 수와 작은 수를 빼 495 만들기", { generator: "kaprekar495", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("three-circle-equal-sum-b7", "number", "수 배열과 합", "세 원 안의 합이 같도록 색칠한 수 찾기", { generator: "threeCircleEqualSum", sourceMatched: true, textbookSource: "더클래식 1과정 7권 · 문제 번호별 대조" }),
  type("reversed-difference-largest-unit-test-book7", "number", "자리 바꾸기", "자리 바꾼 수와의 차로 가장 큰 두 자리 수 찾기", { generator: "unitTestLargestReversedDifferenceBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 단원 테스트 18번" }),
  type("clock-palindrome-unpadded-unit-test-book7", "pattern", "팔린드롬", "시와 분을 그대로 이어 쓴 대칭 시각 세기", { generator: "unitTestUnpaddedClockPalindromeBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 단원 테스트 19번" }),
  type("four-group-three-clues-unit-test-book7", "logic", "집합과 포함", "네 모둠의 세 여집합 조건으로 전체 학생 수 구하기", { generator: "unitTestFourGroupThreeCluesBook7", sourceMatched: true, textbookSource: "더클래식 1과정 7권 단원 테스트 24번" }),

  // 더클래식 1과정 8권: 164문항을 네 단계와 인쇄 문제 번호로 직접 대조했다.
  // 곱셈 매트릭스처럼 풀이 구조가 완전히 같은 유형만 기존 공용 유형을 재사용한다.
  type("balance-difference-deduction-b8", "number", "묶음수와 매트릭스", "저울의 두 묶음 차이로 도형 무게 구하기", { generator: "balanceDifferenceDeductionBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("overlap-circle-sum-b8", "number", "묶음수와 매트릭스", "겹친 두 원의 합으로 색칠한 수 구하기", { generator: "overlapCircleSumBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("symbol-additive-chain-b8", "number", "묶음수와 매트릭스", "도형 덧셈식을 이어 각 도형 수 구하기", { generator: "symbolAdditiveChainBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("addition-matrix-target-b8", "number", "덧셈 매트릭스", "묶음수로 덧셈 매트릭스의 색칠한 합 구하기", { generator: "additionMatrixTargetBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("addition-matrix-complete-b8", "number", "덧셈 매트릭스", "도형값을 찾아 덧셈 매트릭스의 빈 합 완성하기", { generator: "additionMatrixCompleteBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("symbol-operation-deduction-b8", "number", "도형이 나타내는 수", "0·1과 곱셈 성질로 도형 수 구하기", { generator: "symbolOperationDeductionBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("symbol-cross-equation-b8", "number", "도형이 나타내는 수", "가로·세로 도형 계산식을 함께 풀기", { generator: "symbolCrossEquationBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("conditional-symbol-chain-b8", "logic", "도형이 나타내는 수", "서로 다른 한 자리 수 조건을 이어 표 완성하기", { generator: "conditionalSymbolChainBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("conditional-two-digit-symbol-b8", "logic", "도형이 나타내는 수", "도형 관계와 자리수 조건으로 두 자리 수 찾기", { generator: "conditionalTwoDigitSymbolBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("cyclic-pair-sums-b8", "number", "도형이 나타내는 수", "세 도형의 두 개씩 합으로 각 값 구하기", { generator: "cyclicPairSumsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),

  type("pyramid-cryptarithm-b8", "number", "복면산", "피라미드 모양 세로셈의 받아올림 추리", { generator: "pyramidCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("blank-digit-vertical-addition-b8", "number", "복면산", "세로 덧셈의 여러 빈 숫자 합 구하기", { generator: "blankDigitVerticalAdditionBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("all-digits-once-cryptarithm-b8", "number", "복면산", "주어진 숫자를 한 번씩 써서 세로셈 완성하기", { generator: "allDigitsOnceCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("ordered-symbol-cryptarithm-b8", "number", "복면산", "서로 다른 도형의 크기 조건까지 맞추기", { generator: "orderedSymbolCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("repeated-symbol-cryptarithm-b8", "number", "복면산", "한 도형이 반복되는 세로 덧셈", { generator: "repeatedSymbolCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("multi-symbol-cryptarithm-b8", "number", "복면산", "여러 도형과 받아올림이 있는 세로 덧셈", { generator: "multiSymbolCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("doubled-symbol-result-b8", "number", "복면산", "도형 수를 두 배해 나온 결과로 값 찾기", { generator: "doubledSymbolResultBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("letter-pyramid-cryptarithm-b8", "number", "복면산", "문자 피라미드 세로셈으로 네 자리 수 만들기", { generator: "letterPyramidCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("repeated-number-multiple-answers-b8", "number", "복면산", "같은 숫자로 만든 수의 가능한 값 모두 찾기", { generator: "repeatedNumberMultipleAnswersBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("linked-cryptarithm-b8", "number", "복면산", "서로 이어진 두 복면산으로 도형 값 찾기", { generator: "linkedCryptarithmBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("subtract-to-repeated-number-b8", "number", "복면산", "두 한 자리 수를 빼 같은 숫자 두 자리 수 만들기", { generator: "subtractToRepeatedNumberBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),

  type("equalize-transfer-b8", "number", "합차와 배수", "두 사람이 같아지도록 옮기는 수 구하기", { generator: "equalizeTransferBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("chained-equalize-transfer-b8", "number", "합차와 배수", "세 사람의 차를 이어 양을 같게 만들기", { generator: "chainedEqualizeTransferBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("total-difference-bars-b8", "number", "합차와 배수", "합과 차를 막대로 나타내 두 수 구하기", { generator: "totalDifferenceBarsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("future-age-sum-b8", "number", "합차와 배수", "몇 년 뒤 두 사람 나이의 합으로 나이 구하기", { generator: "futureAgeSumBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("table-total-difference-b8", "number", "합차와 배수", "표의 전체 합과 두 사람의 차로 빈칸 구하기", { generator: "tableTotalDifferenceBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-transfer-three-b8", "number", "합차와 배수", "세 사람의 합과 주고받은 뒤의 관계 거꾸로 풀기", { generator: "reverseTransferThreeBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("sum-multiple-bars-b8", "number", "합차와 배수", "두 수의 합과 몇 배 관계로 각각 구하기", { generator: "sumMultipleBarsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("difference-multiple-bars-b8", "number", "합차와 배수", "두 수의 차와 몇 배 관계로 각각 구하기", { generator: "differenceMultipleBarsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("sum-multiple-offset-b8", "number", "합차와 배수", "전체 합과 몇 배보다 많고 적은 관계 풀기", { generator: "sumMultipleOffsetBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("three-person-difference-b8", "logic", "합차와 배수", "세 사람의 차와 두 사람의 합으로 값 구하기", { generator: "threePersonDifferenceBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("transfer-to-multiple-b8", "number", "합차와 배수", "한쪽에서 옮긴 뒤 몇 배가 되게 만들기", { generator: "transferToMultipleBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("conditional-three-share-b8", "logic", "합차와 배수", "세 사람의 주고받기 조건으로 처음 수 구하기", { generator: "conditionalThreeShareBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-double-offset-b8", "number", "합차와 배수", "더한 뒤 처음 수의 두 배보다 작은 관계 거꾸로 풀기", { generator: "reverseDoubleOffsetBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),

  type("reverse-arithmetic-chain-b8", "number", "거꾸로 생각하기", "더하기와 빼기 과정을 마지막에서 거꾸로 풀기", { generator: "reverseArithmeticChainBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-transfer-events-b8", "number", "거꾸로 생각하기", "여러 사람에게 주고받은 수를 거꾸로 찾기", { generator: "reverseTransferEventsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-multiply-divide-b8", "number", "거꾸로 생각하기", "곱하고 더하고 나눈 과정을 거꾸로 풀기", { generator: "reverseMultiplyDivideBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-split-equal-b8", "number", "거꾸로 생각하기", "똑같이 나눈 뒤 주고받은 처음 수 구하기", { generator: "reverseSplitEqualBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("give-as-much-once-b8", "number", "거꾸로 생각하기", "상대가 가진 만큼 한 번 준 처음 수 구하기", { generator: "giveAsMuchOnceBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("give-as-much-return-b8", "number", "거꾸로 생각하기", "상대가 가진 만큼 준 뒤 일부를 돌려받기", { generator: "giveAsMuchReturnBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("shaded-fraction-count-b8", "number", "분수로 거꾸로 풀기", "색칠한 분수만큼의 구슬 수 구하기", { generator: "shadedFractionCountBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("fraction-given-away-original-b8", "number", "분수로 거꾸로 풀기", "일부를 쓰고 남은 수로 처음 수 구하기", { generator: "fractionGivenAwayOriginalBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("sequential-fraction-remains-b8", "number", "분수로 거꾸로 풀기", "일부를 쓰고 남은 것의 일부를 다시 준 처음 수", { generator: "sequentialFractionRemainsBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("fraction-difference-whole-b8", "number", "분수로 거꾸로 풀기", "두 분수만큼의 양 차이로 전체 구하기", { generator: "fractionDifferenceWholeBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("fraction-share-difference-b8", "number", "분수로 거꾸로 풀기", "두 모둠의 분수와 인원 차이로 각각 구하기", { generator: "fractionShareDifferenceBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("reverse-two-container-transfers-b8", "logic", "거꾸로 생각하기", "두 상자에서 두 번 주고받은 처음 수", { generator: "reverseTwoContainerTransfersBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("three-container-condition-b8", "logic", "거꾸로 생각하기", "세 주머니의 합과 같은 수 조건으로 처음 수", { generator: "threeContainerConditionBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("sequential-fraction-consumption-b8", "number", "분수로 거꾸로 풀기", "남은 것의 일정한 분수를 차례로 먹은 처음 수", { generator: "sequentialFractionConsumptionBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),
  type("fraction-subgroup-count-b8", "number", "분수로 거꾸로 풀기", "두 집단의 일부에 해당하는 사람 수 합하기", { generator: "fractionSubgroupCountBook8", sourceMatched: true, textbookSource: "더클래식 1과정 8권 · 문제 번호별 대조" }),

  // 더클래식 1과정 8권 단원 테스트: 원본 식·표·이동 조건을 문항 번호별로 보존한다.
  type("unit-test-book08-q01", "logic", "무게 추리", "두 계수식으로 두 도형의 무게 구하기", { generator: "unitTestBook08Q01", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 1번" }),
  type("unit-test-book08-q02", "number", "도형 매트릭스", "4×4 도형표의 숨은 세로 합", { generator: "unitTestBook08Q02", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 2번" }),
  type("unit-test-book08-q03", "number", "곱셈 매트릭스", "2부터 9까지 한 번씩 놓는 곱셈표", { generator: "unitTestBook08Q03", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 3번" }),
  type("unit-test-book08-q04", "number", "도형이 나타내는 수", "곱셈 도형식 네 개로 목표 도형 찾기", { generator: "unitTestBook08Q04", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 4번" }),
  type("unit-test-book08-q05", "number", "도형이 나타내는 수", "세 도형의 두 개씩 합", { generator: "unitTestBook08Q05", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 5번" }),
  type("unit-test-book08-q06", "number", "복면산", "세 자리 수와 두 자리 수의 도형 복면산", { generator: "unitTestBook08Q06", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 6번" }),
  type("unit-test-book08-q07", "number", "복면산", "세 수를 더한 세로셈의 빈 숫자 합", { generator: "unitTestBook08Q07", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 7번" }),
  type("unit-test-book08-q08", "number", "복면산", "이어 붙인 네 도형의 세로 덧셈", { generator: "unitTestBook08Q08", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 8번" }),
  type("unit-test-book08-q09", "number", "복면산", "다섯 도형의 받아올림 복면산", { generator: "unitTestBook08Q09", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 9번" }),
  type("unit-test-book08-q10", "number", "복면산", "반복 도형으로 같은 숫자 세 자리 수 만들기", { generator: "unitTestBook08Q10", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 10번" }),
  type("unit-test-book08-q11", "number", "주고받기", "두 사람이 같아지도록 준 구슬 수", { generator: "unitTestBook08Q11", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 11번" }),
  type("unit-test-book08-q12", "number", "합과 차", "두 나이의 합과 차", { generator: "unitTestBook08Q12", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 12번" }),
  type("unit-test-book08-q13", "number", "합과 차", "표의 전체와 두 빈칸의 차", { generator: "unitTestBook08Q13", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 13번" }),
  type("unit-test-book08-q14", "number", "차와 배수", "두 수의 차와 몇 배 관계", { generator: "unitTestBook08Q14", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 14번" }),
  type("unit-test-book08-q15", "number", "합과 배수", "전체와 몇 배보다 많은 관계", { generator: "unitTestBook08Q15", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 15번" }),
  type("unit-test-book08-q16", "number", "거꾸로 생각하기", "여러 번 주고받은 뒤 처음 수", { generator: "unitTestBook08Q16", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 16번" }),
  type("unit-test-book08-q17", "number", "거꾸로 생각하기", "가진 만큼 준 뒤의 처음 수", { generator: "unitTestBook08Q17", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 17번" }),
  type("unit-test-book08-q18", "number", "분수로 거꾸로 풀기", "일부를 쓰고 남은 수로 처음 수", { generator: "unitTestBook08Q18", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 18번" }),
  type("unit-test-book08-q19", "number", "분수로 거꾸로 풀기", "일부를 준 뒤 남은 수로 처음 수", { generator: "unitTestBook08Q19", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 19번" }),
  type("unit-test-book08-q20", "number", "분수로 거꾸로 풀기", "두 집단의 분수와 인원 차", { generator: "unitTestBook08Q20", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 20번" }),
  type("unit-test-book08-q21", "number", "도형 매트릭스", "4×4 도형표의 두 숨은 세로 합", { generator: "unitTestBook08Q21", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 21번" }),
  type("unit-test-book08-q22", "number", "복면산", "문자 수 네 개를 더한 네 자리 수", { generator: "unitTestBook08Q22", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 22번" }),
  type("unit-test-book08-q23", "number", "주고받기", "세 사람의 두 이동과 합 조건", { generator: "unitTestBook08Q23", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 23번" }),
  type("unit-test-book08-q24", "number", "주고받기", "세 주머니에서 하나 옮긴 뒤의 조건", { generator: "unitTestBook08Q24", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 24번" }),
  type("unit-test-book08-q25", "number", "분수와 집단", "남녀의 분수 관계와 일부 인원", { generator: "unitTestBook08Q25", sourceMatched: true, textbookSource: "더클래식 1과정 8권 단원 테스트 25번" }),

  // 더클래식 1과정 9권: 교재에 인쇄된 문제 번호로 개념·유형·연습·심화를 대조했다.
  type("latin-square-congruent-partition-b9", "geometry", "합동 도형 분할", "각 조각에 1부터 4까지 한 번씩 들어가는 합동 분할", { generator: "latinSquareCongruentPartitionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("equal-sum-congruent-partition-b9", "geometry", "합동 도형 분할", "각 조각의 수의 합이 같은 합동 분할", { generator: "equalSumCongruentPartitionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("landmark-congruent-partition-b9", "geometry", "합동 도형 분할", "표식이 같은 위치에 놓이는 합동 분할", { generator: "landmarkCongruentPartitionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("congruent-composite-partition-b9", "geometry", "합동 도형 분할", "복합 도형을 네 합동 도형으로 나누기", { generator: "congruentCompositePartitionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("triangle-equal-subdivision-b9", "geometry", "도형의 등분", "정삼각형을 같은 크기의 조각으로 나누어 세기", { generator: "triangleEqualSubdivisionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("hexagon-equal-subdivision-b9", "geometry", "도형의 등분", "정육각형을 같은 크기의 조각으로 나누어 세기", { generator: "hexagonEqualSubdivisionBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("tetromino-cover-count-b9", "geometry", "도형 채우기", "표식 칸을 제외하고 네 칸 블록으로 채우기", { generator: "tetrominoCoverCountBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("quadrilateral-grid-area-b9", "geometry", "모눈 넓이", "모눈 위 사각형의 넓이 구하기", { generator: "quadrilateralGridAreaBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("shaded-composite-grid-area-b9", "geometry", "모눈 넓이", "모눈 위 복합 색칠 도형의 넓이 구하기", { generator: "shadedCompositeGridAreaBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("parallelogram-grid-area-b9", "geometry", "모눈 넓이", "모눈 위 평행사변형의 넓이 구하기", { generator: "parallelogramGridAreaBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),

  type("cube-solid-to-views-b9", "geometry", "쌓기나무 바탕그림", "입체 모양을 앞·옆 모양으로 나타내기", { generator: "cubeSolidToViewsBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("cube-layer-views-b9", "geometry", "쌓기나무 바탕그림", "층별 모양을 앞·옆 모양으로 나타내기", { generator: "cubeLayerViewsBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("cube-shell-interior-b9", "geometry", "쌓기나무 채우기", "직육면체의 겉면을 걷어 낸 안쪽 개수", { generator: "cubeShellInteriorBook9", sourceMatched: true, textbookSource: "더클래식 1과정 4권 도전 4번·9권 · 문제 번호별 대조" }),
  type("cube-view-model-choice-b9", "geometry", "쌓기나무 바탕그림", "위·앞·옆 모양과 맞는 입체 고르기", { generator: "cubeViewModelChoiceBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),

  type("magic-square-swap-pair-b9", "number", "마방진", "두 수의 자리를 바꾸어 마방진 고치기", { generator: "magicSquareSwapPairBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("magic-square-four-pair-sum-b9", "number", "마방진", "4×4 마방진에서 두 빈칸의 합 구하기", { generator: "magicSquareFourPairSumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("triangle-edge-extreme-six-b9", "number", "수 배열과 합", "1부터 6까지로 삼각형 한 변 합의 가장 큰·작은 값", { generator: "triangleEdgeExtremeSixBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("triangle-edge-extreme-nine-b9", "number", "수 배열과 합", "1부터 9까지로 삼각형 한 변 합의 가장 큰·작은 값", { generator: "triangleEdgeExtremeNineBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("heptagon-ring-equal-sum-b9", "number", "수 배열과 합", "칠각형 일곱 줄의 세 수 합 같게 만들기", { generator: "heptagonRingEqualSumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("overlap-region-equal-sum-b9", "number", "수 배열과 합", "겹친 두 도형 안의 수 합 같게 만들기", { generator: "overlapRegionEqualSumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("grid-line-sum-minimum-b9", "number", "수 배열과 합", "가로·세로 합을 맞추는 가운데 수의 최솟값", { generator: "gridLineSumMinimumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("circle-chain-equal-sum-b9", "number", "수 배열과 합", "이어진 원의 세 수 합 같게 만들기", { generator: "circleChainEqualSumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("triangle-line-equal-sum-b9", "number", "수 배열과 합", "삼각형과 직선의 세 수 합 같게 만들기", { generator: "triangleLineEqualSumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("circular-magic-maximum-b9", "number", "마방진", "원형 마방진의 한 줄 합을 가장 크게 만들기", { generator: "circularMagicMaximumBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),

  type("fixed-value-order-assignment-b9", "logic", "순서와 비교", "주어진 값과 차이 조건으로 사람의 값 정하기", { generator: "fixedValueOrderAssignmentBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("line-ranking-constraints-b9", "logic", "순서와 비교", "여러 앞뒤 조건으로 줄의 순위 정하기", { generator: "lineRankingConstraintsBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("exclusion-grid-ranking-b9", "logic", "조건표 추리", "가능하지 않은 등수를 지워 순위 정하기", { generator: "exclusionGridRankingBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("exact-one-ranking-predictions-b9", "logic", "참말과 거짓말", "두 예상 중 하나만 맞는 순위 추리", { generator: "exactOneRankingPredictionsBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("exact-one-answer-assignment-b9", "logic", "참말과 거짓말", "두 답 중 하나만 맞는 정답 추리", { generator: "exactOneAnswerAssignmentBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("pair-group-inference-b9", "logic", "모둠 추리", "회의 참석 기록으로 같은 모둠 짝 찾기", { generator: "pairGroupInferenceBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("all-false-circular-seating-b9", "logic", "자리 배치", "모두 거짓인 조건으로 원탁 자리 정하기", { generator: "allFalseCircularSeatingBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("preference-count-matrix-b9", "logic", "조건표 추리", "선호 표와 열 합으로 빠진 표시 찾기", { generator: "preferenceCountMatrixBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("apartment-neighbor-logic-b9", "logic", "자리 배치", "위·아래·옆집 조건으로 아파트 자리 정하기", { generator: "apartmentNeighborLogicBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("profession-assignment-b9", "logic", "조건표 추리", "가능한 직업 표로 사람의 직업 정하기", { generator: "professionAssignmentBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),
  type("activity-enrollment-b9", "logic", "조건표 추리", "활동 선택표와 인원수로 빠진 활동 찾기", { generator: "activityEnrollmentBook9", sourceMatched: true, textbookSource: "더클래식 1과정 9권 · 문제 번호별 대조" }),

  // 더클래식 1과정 9권 단원 테스트: 그리기 답과 복수 소문항을 원본 번호별로 보존한다.
  type("book09-unit-test-q01", "number", "스도쿠", "네 영역 스도쿠 완성", { generator: "book09-unit-test-q01", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 1번" }),
  type("book09-unit-test-q02", "geometry", "합동 도형 분할", "수의 합이 같은 합동 도형으로 나누기", { generator: "book09-unit-test-q02", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 2번" }),
  type("book09-unit-test-q03", "geometry", "합동 도형 분할", "두 복합 도형을 각각 합동으로 나누기", { generator: "book09-unit-test-q03", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 3번" }),
  type("book09-unit-test-q04", "geometry", "모눈 넓이", "두 색칠 도형의 넓이", { generator: "book09-unit-test-q04", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 4번" }),
  type("book09-unit-test-q05", "geometry", "모눈 넓이", "두 복합 색칠 도형의 넓이", { generator: "book09-unit-test-q05", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 5번" }),
  type("book09-unit-test-q06", "geometry", "모눈 넓이", "기울어진 정사각형의 넓이", { generator: "book09-unit-test-q06", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 6번" }),
  type("book09-unit-test-q07", "geometry", "쌓기나무", "직육면체를 가득 채우는 쌓기나무", { generator: "book09-unit-test-q07", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 7번" }),
  type("book09-unit-test-q08", "geometry", "쌓기나무", "보이지 않는 쌓기나무의 개수", { generator: "book09-unit-test-q08", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 8번" }),
  type("book09-unit-test-q09", "geometry", "쌓기나무", "층별 모양을 세 방향에서 보기", { generator: "book09-unit-test-q09", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 9번" }),
  type("book09-unit-test-q10", "geometry", "쌓기나무", "세 방향 그림과 위에서 본 수 쓰기", { generator: "book09-unit-test-q10", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 10번" }),
  type("book09-unit-test-q11", "geometry", "쌓기나무", "두 세 방향 그림의 쌓기나무 수", { generator: "book09-unit-test-q11", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 11번" }),
  type("book09-unit-test-q12", "geometry", "쌓기나무", "세 방향 그림의 최대·최소 개수", { generator: "book09-unit-test-q12", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 12번" }),
  type("book09-unit-test-q13", "number", "마방진", "두 3×3 마방진 완성", { generator: "book09-unit-test-q13", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 13번" }),
  type("book09-unit-test-q14", "number", "마방진", "4×4 마방진의 두 빈칸 합", { generator: "book09-unit-test-q14", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 14번" }),
  type("book09-unit-test-q15", "number", "마방진", "두 수를 바꾸어 마방진 고치기", { generator: "book09-unit-test-q15", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 15번" }),
  type("book09-unit-test-q16", "number", "삼각진", "네 가지 합의 삼각진 완성", { generator: "book09-unit-test-q16", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 16번" }),
  type("book09-unit-test-q17", "number", "다각형 수 배열", "오각진의 세 수 합 같게 만들기", { generator: "book09-unit-test-q17", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 17번" }),
  type("book09-unit-test-q18", "number", "원형 수 배열", "직선과 원 둘레의 합 같게 만들기", { generator: "book09-unit-test-q18", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 18번" }),
  type("book09-unit-test-q19", "logic", "길이 비교", "막대 길이 조건으로 두 막대의 차", { generator: "book09-unit-test-q19", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 19번" }),
  type("book09-unit-test-q20", "logic", "원탁 자리", "시계 방향 조건으로 사이 사람 찾기", { generator: "book09-unit-test-q20", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 20번" }),
  type("book09-unit-test-q21", "logic", "순서와 비교", "높이뛰기 말 조건으로 순위 완성", { generator: "book09-unit-test-q21", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 21번" }),
  type("book09-unit-test-q22", "logic", "조건표 추리", "좋아하는 운동 조건표 완성", { generator: "book09-unit-test-q22", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 22번" }),
  type("book09-unit-test-q23", "logic", "참말과 거짓말", "예상 하나만 맞는 우승팀", { generator: "book09-unit-test-q23", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 23번" }),
  type("book09-unit-test-q24", "logic", "조건표 추리", "가능하지 않은 등수를 지워 순위 찾기", { generator: "book09-unit-test-q24", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 24번" }),
  type("book09-unit-test-q25", "number", "삼각진", "1부터 9까지로 네 수의 합 맞추기", { generator: "book09-unit-test-q25", sourceMatched: true, textbookSource: "더클래식 1과정 9권 단원 테스트 25번" }),

  // 더클래식 1과정 10권: 182문항을 교재에 인쇄된 문제 번호와 네 단계로 직접 대조했다.
  type("multi-method-multiplication-b10", "number", "곱셈을 간편하게", "같은 곱셈을 넓이·격자·세로셈으로 계산하기", { generator: "multiMethodMultiplicationBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("same-tens-complement-product-b10", "number", "곱셈을 간편하게", "십의 자리가 같고 일의 자리 합이 10인 곱셈", { generator: "sameTensComplementProductBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("same-ones-complement-product-b10", "number", "곱셈을 간편하게", "일의 자리가 같고 십의 자리 합이 10인 곱셈", { generator: "sameOnesComplementProductBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("factor-pair-divisor-count-b10", "number", "약수와 곱셈", "곱이 되는 두 수의 짝으로 약수 개수 구하기", { generator: "factorPairDivisorCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("multi-count-consecutive-decomposition-b10", "number", "연속수의 합", "한 수를 여러 개수의 연속수 합으로 나타내기", { generator: "multiCountConsecutiveDecompositionBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("calendar-consecutive-sum-weekday-b10", "number", "연속수의 활용", "달력에서 이어진 날짜의 합으로 요일 찾기", { generator: "calendarConsecutiveSumWeekdayBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("consecutive-page-range-b10", "number", "연속수의 활용", "연속한 쪽수의 합으로 처음과 끝 찾기", { generator: "consecutivePageRangeBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("same-parity-consecutive-sum-b10", "number", "연속수의 합", "연속한 홀수 또는 짝수의 합 구하기", { generator: "sameParityConsecutiveSumBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("rectangular-number-grid-sum-b10", "number", "연속수의 활용", "직사각형 수 배열표의 합 구하기", { generator: "rectangularNumberGridSumBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("shaped-number-grid-sum-b10", "number", "연속수의 활용", "수 배열표에서 색칠한 모양의 합 구하기", { generator: "shapedNumberGridSumBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("calendar-block-sum-b10", "number", "연속수의 활용", "달력 3×3 날짜 묶음의 합과 가운데 수", { generator: "calendarBlockSumBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("all-consecutive-decompositions-b10", "number", "연속수의 합", "한 수를 연속수의 합으로 나타내는 방법 모두 찾기", { generator: "allConsecutiveDecompositionsBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("consecutive-tens-digit-condition-b10", "number", "연속수의 활용", "자리 숫자 합 조건으로 세 연속수 찾기", { generator: "consecutiveTensDigitConditionBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("consecutive-vertical-addition-b10", "number", "연속수의 활용", "세 연속수 세로셈의 가려진 숫자 찾기", { generator: "consecutiveVerticalAdditionBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),

  type("two-symbol-coefficient-weight-b10", "number", "대응 관계", "두 종류 물건의 개수를 바꾼 식으로 무게 구하기", { generator: "twoSymbolCoefficientWeightBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("two-symbol-score-difference-b10", "number", "대응 관계", "두 과녁의 횟수를 바꾼 점수로 차 구하기", { generator: "twoSymbolScoreDifferenceBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("shared-term-equation-b10", "number", "대응 관계", "두 식의 공통 묶음을 지워 남은 값 구하기", { generator: "sharedTermEquationBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("container-double-content-b10", "number", "대응 관계", "빈 통과 가득 찬 통의 차로 내용물 구하기", { generator: "containerDoubleContentBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("three-pair-sums-values-b10", "number", "대응 관계", "세 대상의 두 개씩 합으로 각각의 값 구하기", { generator: "threePairSumsValuesBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("closed-perimeter-spacing-difference-b10", "number", "간격과 개수", "닫힌 둘레의 서로 다른 간격에서 개수 차 구하기", { generator: "closedPerimeterSpacingDifferenceBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("same-budget-price-count-b10", "number", "대응 관계", "같은 돈으로 가격이 다른 물건의 개수 비교하기", { generator: "sameBudgetPriceCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("new-participants-equal-share-b10", "number", "대응 관계", "사람 수가 늘어난 뒤 똑같이 나누는 수 비교하기", { generator: "newParticipantsEqualShareBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("catch-up-growing-amount-b10", "number", "따라잡기", "서로 다르게 늘어나는 양이 같아지는 때", { generator: "catchUpGrowingAmountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("catch-up-shrinking-amount-b10", "number", "따라잡기", "서로 다르게 줄어드는 양이 같아지는 때", { generator: "catchUpShrinkingAmountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("catch-up-distance-b10", "number", "따라잡기", "거리와 빠르기의 차로 따라잡는 시간 구하기", { generator: "catchUpDistanceBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("four-object-weight-system-b10", "logic", "대응 관계", "네 물건의 여러 무게 식을 이어 각각 구하기", { generator: "fourObjectWeightSystemBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("delayed-start-catch-up-b10", "number", "따라잡기", "늦게 시작한 저금액이 같아지는 달 구하기", { generator: "delayedStartCatchUpBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),

  type("repeated-digit-number-count-b10", "number", "조건에 맞는 수", "숫자를 여러 번 써서 만들 수 있는 수의 개수", { generator: "repeatedDigitNumberCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("binary-switch-count-b10", "number", "경우의 수", "켜기와 끄기의 서로 다른 모습 수 세기", { generator: "binarySwitchCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("monotone-digit-enumeration-b10", "number", "조건에 맞는 수", "자리 숫자가 커지거나 작아지는 수 세기", { generator: "monotoneDigitEnumerationBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("monotone-digit-rank-b10", "number", "조건에 맞는 수", "자리 숫자가 한 방향으로 변하는 수의 순서", { generator: "monotoneDigitRankBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("distinct-card-target-sum-b10", "number", "숫자 카드", "서로 다른 카드를 골라 목표 합 만들기", { generator: "distinctCardTargetSumBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("digit-sum-three-digit-count-b10", "number", "조건에 맞는 수", "자리 숫자의 합이 같은 세 자리 수 세기", { generator: "digitSumThreeDigitCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("digit-sum-ranked-number-b10", "number", "조건에 맞는 수", "자리 숫자 합이 같은 수의 순서 찾기", { generator: "digitSumRankedNumberBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("three-digit-step-count-b10", "number", "조건에 맞는 수", "이웃한 자리 숫자의 차가 같은 세 자리 수", { generator: "threeDigitStepCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("monotone-digit-count-b10", "number", "조건에 맞는 수", "자리 숫자가 차례로 작아지는 세 자리 수", { generator: "monotoneDigitCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("route-product-count-b10", "number", "경우의 수", "여러 구간에서 길을 하나씩 고르는 방법 수", { generator: "routeProductCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("lineup-count-b10", "number", "경우의 수", "여러 사람이 한 줄로 서는 순서의 수", { generator: "lineupCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),

  type("number-baseball-b10", "logic", "숫자 야구", "S와 B 단서로 서로 다른 세 자리 수 찾기", { generator: "numberBaseballBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("most-frequent-digit-b10", "number", "수와 숫자", "범위에서 가장 많이 쓰인 숫자 찾기", { generator: "mostFrequentDigitBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("digit-occurrence-range-b10", "number", "수와 숫자", "양의 수 범위에서 특정 숫자가 쓰인 횟수", { generator: "digitOccurrenceRangeBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  type("positive-range-number-digit-count-b10", "number", "수와 숫자", "양의 수 구간을 이어 쓸 때 전체 숫자 수", { generator: "positiveRangeNumberDigitCountBook10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 · 문제 번호별 대조" }),
  // 더클래식 1과정 10권 단원 테스트: 복수 소문항과 출력 형식을 원본 번호별로 보존한다.
  type("unit-test-book10-q01", "number", "연속수의 합", "짝수 개 연속수의 합 네 문항", { generator: "unitTestBook10Q01", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 1번" }),
  type("unit-test-book10-q02", "number", "연속수의 합", "홀수 개 연속수의 합 네 문항", { generator: "unitTestBook10Q02", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 2번" }),
  type("unit-test-book10-q03", "number", "연속수의 합", "주어진 수를 연속한 여러 수의 합으로 나타내기", { generator: "unitTestBook10Q03", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 3번" }),
  type("unit-test-book10-q04", "number", "연속수의 합", "두 수를 정해진 개수의 연속수 합으로 나타내기", { generator: "unitTestBook10Q04", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 4번" }),
  type("unit-test-book10-q05", "pattern", "달력과 수 배열", "달력 3×3 묶음의 합과 가장 큰 수", { generator: "unitTestBook10Q05", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 5번" }),
  type("unit-test-book10-q06", "number", "점수와 식", "두 영역 과녁의 점수 구하기", { generator: "unitTestBook10Q06", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 6번" }),
  type("unit-test-book10-q07", "number", "합과 차", "세 수의 두 수씩 합으로 한 수 구하기", { generator: "unitTestBook10Q07", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 7번" }),
  type("unit-test-book10-q08", "number", "나누어 갖기", "사람 수가 늘어난 뒤 똑같이 나누기", { generator: "unitTestBook10Q08", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 8번" }),
  type("unit-test-book10-q09", "number", "따라잡기", "서로 다른 속도로 채우는 두 양이 같아지는 때", { generator: "unitTestBook10Q09", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 9번" }),
  type("unit-test-book10-q10", "logic", "무게 추리", "두 물건의 계수식으로 한 물건 무게 구하기", { generator: "unitTestBook10Q10", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 10번" }),
  type("unit-test-book10-q11", "logic", "무게 추리", "네 물건의 저울식으로 각각의 무게 구하기", { generator: "unitTestBook10Q11", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 11번" }),
  type("unit-test-book10-q12", "number", "수 카드", "다섯 카드 중 세 장으로 세 자리 수 만들기", { generator: "unitTestBook10Q12", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 12번" }),
  type("unit-test-book10-q13", "number", "수 카드", "0이 포함된 네 카드로 네 자리 수 만들기", { generator: "unitTestBook10Q13", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 13번" }),
  type("unit-test-book10-q14", "number", "수 카드", "같은 카드를 다시 써서 세 자리 수 만들기", { generator: "unitTestBook10Q14", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 14번" }),
  type("unit-test-book10-q15", "number", "조건에 맞는 수", "자리 숫자가 차례로 작아지는 수 모두 쓰기", { generator: "unitTestBook10Q15", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 15번" }),
  type("unit-test-book10-q16", "number", "수 카드", "서로 다른 세 카드로 목표 합 모두 찾기", { generator: "unitTestBook10Q16", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 16번" }),
  type("unit-test-book10-q17", "number", "조건에 맞는 수", "자리 합이 같은 수를 큰 수부터 세기", { generator: "unitTestBook10Q17", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 17번" }),
  type("unit-test-book10-q18", "number", "숫자의 개수", "1부터 정한 수까지 특정 숫자 세기", { generator: "unitTestBook10Q18", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 18번" }),
  type("unit-test-book10-q19", "number", "숫자의 개수", "세 자리 수 구간에서 특정 숫자 세기", { generator: "unitTestBook10Q19", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 19번" }),
  type("unit-test-book10-q20", "number", "수와 숫자", "1부터 70까지 쓴 숫자의 개수", { generator: "unitTestBook10Q20", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 20번" }),
  type("unit-test-book10-q21", "number", "수와 숫자", "1부터 200까지 쓴 숫자의 개수", { generator: "unitTestBook10Q21", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 21번" }),
  type("unit-test-book10-q22", "number", "수와 숫자", "쓴 숫자의 개수로 마지막 수 찾기", { generator: "unitTestBook10Q22", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 22번" }),
  type("unit-test-book10-q23", "number", "수와 숫자", "많이 쓴 숫자의 개수로 마지막 수 찾기", { generator: "unitTestBook10Q23", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 23번" }),
  type("unit-test-book10-q24", "number", "세로셈", "연속한 세 수의 세로 덧셈 두 문항", { generator: "unitTestBook10Q24", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 24번" }),
  type("unit-test-book10-q25", "number", "홀수와 짝수", "홀수 합과 짝수 합의 차로 마지막 수 찾기", { generator: "unitTestBook10Q25", sourceMatched: true, textbookSource: "더클래식 1과정 10권 단원 테스트 25번" }),

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
const domainById = Object.fromEntries(DOMAINS.map((item) => [item.id, item]));

// 원본 문항 하나가 문제은행에서 독립적으로 검색될 수 있도록 분류값을 문항에도
// 고정한다. 세부 유형의 기본 분류를 물려받되, 학원 스타일은 문항별로 추가할 수 있다.
// 대표 개념은 여러 유형이 공유하는 노드이므로 설명을 한 번 고치면 연결된 문항에 모두
// 반영된다. 학원 스타일과 대표 개념 때문에 유형 자체를 복제하지 않는다.
export const questionClassificationForType = (typeId, options = {}) => {
  const item = byId[typeId];
  if (!item) return null;
  const academyStyleIds = [...new Set(options.academyStyleIds || item.academyStyleIds || [])];
  return Object.freeze({
    majorDomainId: item.domain,
    majorDomainLabel: domainById[item.domain]?.label || item.domain,
    minorDomain: item.middle,
    detailedTypeId: item.id,
    detailedTypeLabel: item.label,
    representativeConceptId: item.conceptId || `concept:${item.domain}:${item.middle}`,
    representativeConceptLabel: item.conceptLabel || item.middle,
    academyStyleIds: Object.freeze(academyStyleIds)
  });
};

const classifySourceQuestion = (entry, options = {}) => ({
  ...entry,
  classification: questionClassificationForType(entry.typeId, options)
});

const EXAM_PAGE_COUNTS = {
  "k6-2023-02": 12, "k7-2022-04": 12, "k7-2022-06": 12, "k7-2022-08": 12, "k7-2022-12": 12,
  "g1-2022-03": 7, "g1-2022-05": 7, "g1-2019-08": 7, "g1-2022-02": 7
};
const question = (number, typeId, note = "", options = {}) => classifySourceQuestion({
  number,
  typeId,
  note: note || byId[typeId]?.label || "",
  difficulty: "actual",
  verified: false
}, options);

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
    typeIds: ["g1-summer-equalize-transfer","g1-summer-height-order-five","g1-summer-two-digit-sum-gap","g1-summer-balance-shape-chain","g1-summer-five-box-weight-order","g1-summer-four-shape-add-subtract","g1-summer-pentagon-adjacent-product","g1-summer-four-by-four-shape-sum","g1-summer-circle-point-segments","g1-summer-four-by-four-shape-sum-bottom","g1-summer-vertical-shape-addition","g1-summer-one-three-rods","g1-summer-triangular-color-difference","g1-summer-square-side-composition","g1-summer-fold-cut-triangle-count","g1-summer-four-symbol-relation","g1-summer-shape-height-dual-cycle","g1-summer-orange-ratio-distribution","g1-summer-rectilinear-perimeter","g1-summer-opposite-step-sequences"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "g1-2019-08", stage: "g1_fall", label: "더 클래식 초1 3차 선발시험",
    file: "더_클래식_1학년_3차_선발시험(20190828).pdf", layout: "four",
    typeIds: ["g1-fall-three-person-total-transfer","g1-height-order-four","g1-summer-balance-shape-chain","g1-two-digit-ones-greater","g1-fall-number-set-offset-chain","g1-fall-four-by-four-latin-two-target","g1-fall-pentagon-adjacent-products-all","g1-fall-four-by-four-shape-sum-four-targets","g1-fall-four-short-one-long-rods","g1-fall-stacked-square-side-chain","g1-fall-aa-ab-ccc-shape-addition","g1-triangle-color-difference","g1-fall-three-fold-crease-cut-count","g1-fall-total-triple-share","g1-fall-paired-four-blank-additions","g1-fall-square-chain-shaded-perimeter","g1-fall-linear-input-output-table","g1-summer-shape-height-dual-cycle","g1-fall-alternating-result-cryptarithm","g1-fall-consecutive-three-sum-completion"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "g1-2022-02", stage: "g1_winter", label: "더 클래식 초1 4차 선발시험",
    file: "더_클래식_1학년_4차_선발시험(20220215).pdf", layout: "four",
    typeIds: ["magic-square-three-complete","g1-winter-shared-box-multiplication","g1-winter-shape-sum-target-row","g1-winter-opponent-step-game","g1-winter-sudoku-four-full","g1-repeated-digit-addition","g1-stacked-shape-dual-cycle","g1-winter-two-digit-odd-sum-order","total-difference","g1-winter-product-placement-four","g1-height-order-four","g1-front-back-between","g1-winter-three-digit-cards-above","g1-winter-three-balance-substitution","g1-winter-three-cards-parity-chain","set-union-count","g1-polygon-stone-rearrangement","g1-summer-opposite-step-sequences","g1-summer-orange-ratio-distribution","g1-odd-even-sum-difference"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  })
];

export const PRACTICE_EXAM_TYPES = [
  { id: "mock-1", label: "실전 모의고사 1회", questions: ["repeat-shape-color-dual","edge-sum-grid","grid-number-placement-five","five-card-sum-pyramid","order-position-seven-people","arrow-number-grid","addition-table-grid-offset","total-difference","shape-sum-table-bottom-target","equal-line-sum-eight-cards-twelve","bus-board-then-leave","shape-sum-table-bottom-target","shape-equation-add-subtract","two-digit-parity-gap","balance-scale-star-target","square-tile-growth","symbol-relation","fold-number-cut-sum-main-diagonal","go-stone-difference-inverse","number-line-six-points"] },
  { id: "mock-2", label: "실전 모의고사 2회", questions: ["edge-sum-grid","l-grid-placement","repeat-four-items-with-duplicate","five-card-sum-pyramid","order-position","addition-table-grid-offset","arrow-number-grid","shape-sum-table-bottom-target","equal-line-sum-eight-cards-fifteen-top-left","total-difference","two-digit-even-ones-greater-gap","shape-sum-table-bottom-target","bus-board-then-leave","shape-equation-add-subtract","fold-number-cut-sum-main-diagonal","square-tile-growth","balance-scale-star-target","symbol-relation","number-line-six-points","go-stone-difference-inverse-white"] },
  { id: "mock-3", label: "실전 모의고사 3회", questions: ["cube-count-solid","set-union-count","chained-number-condition","cube-different-shape","shape-sum-table","vertical-addition","person-item-logic","given-shape-expression","paired-growing-sequences","cut-recut-pieces","repeat-pattern","triangle-count","reverse-operation-ladder","plus-minus-multi-target","two-custom-operations","practice-three-fold-hole-count","two-digit-card-enumeration","erase-expression-target","collection-repeat-gap","magic-square"] },
  { id: "mock-4", label: "실전 모의고사 4회", questions: ["balance-scale","aligned-rod-common-length","number-card-mixed-operations","fold-number-remaining-sum","equal-line-sum","magic-square","hidden-score-ranking","two-digit-even-count","interleaved-pair-sequence","two-function-machine-chain","square-count","reverse-initial-count","calendar-all-weekday-sum","growing-shape-count","vertical-shape-cryptarithm-values","square-symbol-chain","shape-sum-table","shape-sum-table","height-extremes-chain","person-item-logic"] },
  { id: "mock-5", label: "실전 모의고사 5회", questions: ["shape-sum-table","colored-shape-number","unused-number-card-equations","magic-square","edge-sum-grid","two-digit-letter-cryptarithm","repeat-shape-color-dual","go-stone-difference-inverse","balance-scale","recorder-matchstick-length","fold-diagonal-hole-count","shape-rotate-flip-grid","set-union-count","equalize-transfer","two-digit-card-threshold-count","cube-add-to-match","order-position","overlapping-run-sequence","alternating-line-total","split-merge-tree"] },
  { id: "mock-6", label: "실전 모의고사 6회", questions: ["congruent-equal-sum-partition-draw","paired-magic-square-colored-sum","triangle-max-edge-sum","distinct-zero-one-shape-values","shape-value-matrix-all","repeated-two-digit-shape-addition","five-person-photo-order","food-preference-logic-four","relative-position-number-grid-nine","three-fold-line-unfold","cube-fill-box","directional-triangle-sum-grid","sudoku-four-square-region","two-class-total-difference","set-union-count","number-ball-pair-targets","diagonal-sum-difference-square","three-person-book-chain","cube-hidden-count","grid-color-count-sequence"] }
].map((exam) => ({ ...exam, questions: exam.questions.map((typeId, index) => ({
  ...question(index + 1, typeId),
  verified: true
})) }));

// 진단 화면(`mock/index.html`)의 QS 25문항을 문제은행 시험지 탭에도 연결한다.
// 진단·처방 화면의 유사문제 로직은 여기서 재사용하거나 수정하지 않는다. 이 목록은
// 원본 문항의 구조와 문제은행 세부 유형을 잇는 색인이다. 전용 생성기가 없는 문항은
// `isReady` 게이트에서 잠긴 채 보이며, 이름만 비슷한 다른 유형을 대신 열지 않는다.
export const DIAGNOSTIC_EXAM_TYPES = [
  {
    id: "diagnostic-mock",
    stage: "diagnostic",
    label: "필즈 대비 선발 진단 모의고사",
    file: "필즈 대비 선발 진단 모의고사 · 25문항",
    sourceViewer: false,
    questions: [
      question(1, "diagnostic-part-whole-bar", "부분 막대의 길이로 전체와 남은 부분 구하기"),
      question(2, "diagnostic-dialogue-condition-number", "대화 속 조건에 맞는 수 구하기"),
      question(3, "equalize-transfer", "주고받아 같게 만들기"),
      question(4, "fold-hole-count", "한 번 접은 색종이의 구멍 개수"),
      question(5, "total-difference", "더 많이 가진 수와 전체 수로 두 수 구하기"),
      question(6, "order-position", "줄 세우기에서 등수 정하기"),
      question(7, "set-union-count", "집합과 포함 관계"),
      question(8, "diagnostic-animal-balance-order", "동물 양팔저울로 무게 순서 정하기"),
      question(9, "diagnostic-number-relation", "수의 관계 조건으로 빈칸 구하기"),
      question(10, "shape-sum-table", "같은 두 도형의 수가 있는 표"),
      question(11, "paired-sequences", "두 수열의 규칙"),
      question(12, "repeat-pattern", "도형 패턴의 규칙"),
      question(13, "symbol-relation", "도형으로 수 나타내기"),
      question(14, "magic-square", "마방진의 합 일정"),
      question(15, "bus-change", "타고 내린 승객의 수"),
      question(16, "number-pyramid", "두 번 모으는 수 피라미드"),
      question(17, "grid-number-placement", "이웃 조건에 맞는 숫자 배치"),
      question(18, "two-digit-condition", "조건에 맞는 두 자리 수"),
      question(19, "symbol-sum-grid", "같은 세 도형의 수가 있는 표"),
      question(20, "diagnostic-two-digit-cryptarithm", "두 자리 수 덧셈 복면산"),
      question(21, "arrow-number-grid", "화살표 수 배열 규칙"),
      question(22, "triangle-tile-growth", "삼각형 도형 증가 규칙"),
      question(23, "go-stone-difference-inverse", "바둑돌 차이로 번째 찾기"),
      question(24, "symbol-relation", "도형이 나타내는 수"),
      question(25, "cube-pattern-sequence", "쌓기나무 규칙")
    ].map((entry) => ({ ...entry, verified: true }))
  }
];

export const FINAL_EXAM_TYPES = [
  {
    id: "final-1",
    stage: "final",
    label: "파이널 모의고사 1회",
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
    label: "파이널 모의고사 2회",
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
    label: "파이널 모의고사 3회",
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

const detailedStagedUnit = (label, typeIds, activities, checks, advanced, practice, typeStudyRefs, options = {}) => ({
  ...stagedUnit(label, typeIds, activities, checks, advanced, practice),
  // 세부 유형마다 실제 등장하는 단계와 문항 번호가 다르다. 이 표가 있으면 단원 전체
  // 범위를 모든 유형에 붙이지 않고, 현재 선택한 단계의 근거 문항만 사용한다.
  typeStudyRefs,
  ...options
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
  "practice-three-fold-hole-count": "접은 순서의 반대로 세 번 펼치며 구멍이 대칭으로 늘어나는 자리를 셉니다.",
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
  "fold-cut-unfold-one-draw": "접은 선을 거울처럼 한 번 되펼쳐 잘린 부분을 대칭으로 그립니다.",
  "fold-cut-unfold-two-draw": "나중에 접은 선부터 거꾸로 두 번 되펼쳐 잘린 부분을 네 자리에 그립니다.",
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
  "digital-transform-board-sum": "숫자판 전체를 반의 반 바퀴 돌린 뒤 똑바로 선 숫자만 골라 더합니다.",
  "digital-board-half-turn-sum": "숫자판 전체를 반 바퀴 돌린 뒤 똑바로 선 숫자만 골라 더합니다.",
  "digital-flip-addition-horizontal": "원래 두 자리 수를 오른쪽으로 뒤집어 읽은 수를 찾고 가로 덧셈을 완성합니다.",
  "digital-transform-addition": "원래 두 자리 수를 반 바퀴 돌려 읽은 수를 찾고 세로셈의 자리를 맞추어 더합니다.",
  "circular-magic-line-sum": "가운데 수를 정하고, 마주 보는 두 수의 합이 모두 같도록 1부터 9까지의 수를 짝지어 놓습니다.",
  "circular-magic-seven-line-sum": "가운데 수를 정하고, 마주 보는 세 쌍의 합이 같도록 1부터 7까지의 수를 놓습니다.",
  "circular-magic-eleven-line-sum": "가운데 수를 정하고, 마주 보는 다섯 쌍의 합이 같도록 1부터 11까지의 수를 놓습니다.",
  "cross-shape-magic-sum": "가운데 칸을 함께 쓰는 가로줄과 세로줄의 합이 같도록 다섯 수 카드를 놓습니다.",
  "t-shape-magic-sum": "T자의 꺾이는 칸을 함께 쓰는 두 줄의 합이 같도록 다섯 수 카드를 놓습니다.",
  "gakuro-card-placement": "네 수 카드를 2×2 빈칸에 한 번씩 넣어 두 가로 합과 두 세로 합을 동시에 맞춥니다.",
  "gakuro-card-rectangle-placement": "수 카드를 3×2 빈칸에 한 번씩 넣고, 가로와 세로의 합 조건을 함께 확인합니다.",
  "gakuro-card-irregular-placement": "계단 모양에서 연결된 가로줄과 세로줄의 합을 보며 수 카드의 자리를 정합니다.",
  "gakuro-grid-sum": "서로 다른 여섯 수로 3×2 칸을 채우며 가로 합과 세로 합을 동시에 맞춥니다.",
  "gakuro-grid-nine-sum": "1부터 9까지를 한 번씩 써서 3×3의 세 가로 합과 세 세로 합을 모두 맞춥니다.",
  "gakuro-grid-irregular-sum": "계단 모양의 각 줄에서 보이는 합을 이용해 서로 다른 수를 한 칸씩 정합니다.",
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
  "cube-top-number-grid": "위에서 본 각 칸의 수는 그 자리에 쌓인 층수입니다. 앞과 옆에서는 각 줄에서 가장 높은 층만 보이도록 그립니다.",
  "cube-count-solid": "위에서 보이는 꼭대기마다 아래에 받치는 쌓기나무가 있는지 층별로 셉니다.",
  "cube-minimum-from-solid": "보이는 꼭대기 아래에 반드시 받쳐야 하는 쌓기나무만 줄별로 세어 더합니다.",
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
  "tangram-shape-composition": "이미 놓인 조각의 변에 맞추어 정사각형, 두 작은 삼각형, 중간 삼각형, 평행사변형을 빈틈없이 놓습니다.",
  "tangram-piece-area": "4×4 칠교판에서 한 칸을 기준으로 조각 넓이를 세고, 모아 만든 정사각형은 사용한 조각의 넓이를 더합니다.",
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
  "object-combination-equivalent-count": "연필 한 자루를 성냥개비 개수로 바꾸고, 처음부터 있던 성냥개비를 더합니다.",
  "proportional-rods-common-total": "같은 전체 길이를 이루는 막대 수를 보고 한 막대의 길이를 거꾸로 구합니다.",
  "number-line-six-points": "겹친 긴 거리에서 이미 아는 구간을 차례로 빼 작은 구간을 찾습니다.",
  "meeting-distance-ratio": "두 사람이 간 거리를 속도의 배수와 같은 묶음으로 나누어 전체 묶음 수를 셉니다.",
  "mixed-interval-distance": "각 구간의 전체 길이를 그 구간의 칸 수로 나누어 한 칸씩 따로 구합니다.",
  "difference-unit-measure": "두 단위막대가 같은 전체 길이를 만드는 그림을 맞춘 뒤 남는 길이를 한 단위로 봅니다.",
  "cryptarithm-single-double": "같은 도형 두 개를 더한 수를 똑같이 두 수로 가릅니다.",
  "cryptarithm-repeated-number-double": "일의 자리부터 같은 숫자를 두 번 더하고 받아올림을 십의 자리에 보냅니다.",
  "cryptarithm-fixed-digit-addition": "보이는 숫자부터 계산해 같은 자리의 도형 값을 찾습니다.",
  "cryptarithm-missing-digit-column": "일의 자리부터 계산해 반복되는 두 도형의 값을 차례로 찾습니다.",
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
  "equal-line-sum-eight-cards-complete-book3": "한 변의 합에서 이미 놓인 수를 빼며 빈칸을 채우고, 1부터 8까지를 한 번씩 썼는지 확인합니다.",
  "triangle-max-edge-sum": "세 꼭짓점의 수가 두 줄씩 세어진다는 점을 이용해 큰 수나 작은 수를 꼭짓점에 놓습니다.",
  "triangle-edge-sum-six": "한 변의 목표 합에서 이미 놓인 두 수를 빼 남은 원의 수를 찾습니다.",
  "triangle-edge-sum-nine": "네 수가 놓이는 한 변씩 목표 합을 맞추고 쓴 수는 카드에서 지웁니다.",
  "magic-square-four-complete": "마주 보는 자리의 두 수를 짝지어 합이 17이 되도록 놓습니다.",
  "tetromino-family-choice": "네 정사각형이 모두 변으로 이어져 한 덩어리가 되는지 확인합니다.",
  "tetromino-square-composition": "빈자리의 꺾인 방향과 네 칸의 이어진 모양을 조각과 비교합니다.",
  "digital-grid-transform": "숫자 하나만 보지 말고 배열판의 네 모서리부터 옮긴 자리를 표시합니다.",
  "digital-transform-arithmetic": "각 디지털 수를 먼저 움직여 새 수를 적은 뒤 덧셈이나 뺄셈을 합니다.",
  "fold-surface-top-trace": "접을 때 움직이는 쪽이 위로 올라간다는 것을 접는 순서마다 표시합니다.",
  "pair-sum-card-completion": "한 쌍의 목표 합에서 보이는 카드 수를 빼 빈 카드의 수를 찾습니다.",
  "shape-difference-chain": "이웃한 도형 사이의 차를 같은 방향으로 이어 더합니다.",
  "measurement-order-chain": "기준값에서 크고 작은 차를 순서대로 더하거나 빼며 값을 적습니다.",
  "balance-unit-ratio": "저울 한 줄을 같은 물건 개수로 바꾸어 다음 저울의 관계와 이어 봅니다.",
  "directional-seat-placement": "확실한 한 자리부터 정하고 위·아래·좌우 조건을 한 칸씩 이어 놓습니다.",
  "circular-seat-placement": "맨 위 자리를 고정한 뒤 시계 방향 조건을 차례로 이어 놓습니다.",
  "ordinal-line-placement": "앞에서의 순서와 두 사람 사이의 수를 한 줄에 표시합니다.",
  "star-congruent-partition-draw-book4": "별이 하나씩 들어가도록 네 칸짜리 같은 모양을 하나씩 찾아 경계선을 긋습니다.",
  "forest-congruent-partition-draw-book4": "나무 하나를 포함한 세 칸 조각을 먼저 찾고 돌려서 같은 모양이 되는지 확인합니다.",
  "digital-grid-upright-after-moves": "숫자의 자리와 방향을 판과 함께 움직여 마지막에 똑바로 놓인 수만 더합니다.",
  "digital-self-half-turn-calculation": "두 자리 수를 반 바퀴 돌릴 때 숫자의 순서도 거꾸로 바뀌는지 확인합니다.",
  "fold-number-grid-one": "한 번 접은 선을 되펼쳐 칠한 부분과 대칭인 칸의 수를 함께 더합니다.",
  "fold-number-grid-two-orthogonal": "가로와 세로 접은 선을 거꾸로 펼쳐 같은 자리에 겹친 네 칸의 수를 더합니다.",
  "fold-number-grid-two-diagonal": "두 대각선을 접은 순서의 반대로 펼쳐 같은 자리에 겹친 네 칸의 수를 더합니다.",
  "overlapping-paper-bottom": "맨 위 색종이를 한 장씩 지우며 마지막까지 남는 글자를 따라갑니다.",
  "measurement-age-difference-book4": "나이 차를 같은 방향으로 이어 더해 두 사람의 차를 구합니다.",
  "measurement-distance-difference-book4": "앞뒤 위치의 차를 한 줄에 표시하고 두 사람 사이의 차를 더합니다.",
  "measurement-time-difference-book4": "먼저 들어온 순서부터 시간 차를 이어 표시합니다.",
  "race-third-place-book4": "먼저 들어온 사람을 왼쪽에 놓고 모든 조건을 만족하는 세 번째 자리를 찾습니다.",
  "directional-landmark-placement-book4": "기준 장소를 먼저 찾고 북·남·동·서 방향으로 한 칸씩 옮깁니다.",
  "circular-seat-blank-book4": "보이는 자리를 기준으로 시계 방향과 마주 보는 조건을 차례로 적용합니다.",
  "three-fold-cut-line-book4": "접은 선을 거울처럼 되펼치며 잘린 사선을 같은 위치에 복사합니다.",
  "front-back-two-order-totals-book4": "두 사람 중 누가 앞서는지 두 경우로 나누어 앞·사이·뒤 인원을 더합니다.",
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
  "cube-tetrahedral-growth": "각 층의 삼각수만큼 쌓인 개수를 아래층부터 차례로 더합니다.",
  "row-major-grid-two-target-sum-book5": "한 줄에 놓인 수의 개수를 확인하고 다음 줄에서 그만큼 커지는 규칙을 씁니다.",
  "radial-line-cycle-two-part-book5": "줄의 수만큼 뛰어세어 같은 줄의 몇 번째 수인지 함께 확인합니다.",
  "calendar-weekday-list-ordinal-book5": "같은 요일은 7일씩 차이 나므로 첫 날짜에서 7씩 더합니다.",
  "calendar-special-date-offset-book5": "두 날짜 사이의 날 수를 세고 7일씩 묶은 나머지만큼 요일을 옮깁니다.",
  "calendar-weekday-sum-year-boundary-book5": "7일 차이인 두 날짜를 합으로 찾은 뒤 12월 31일 다음 요일을 구합니다.",
  "shortest-path-diagonal-shortcut-book5": "각 점의 길 수를 더하되 사선 시작점의 길 수도 사선 끝점에 더합니다.",
  "square-product-cycle-fill-book5": "변의 곱을 만들 수 있는 두 수를 찾고 이웃한 변과 동시에 맞는지 확인합니다.",
  "checkerboard-product-matrix-book5": "각 가로줄의 곱을 두 수로 가르고 세로줄의 곱과 함께 맞는 카드만 남깁니다.",
  "symbol-zero-one-network-book5": "더해도 같은 수가 되는 0과 곱해도 같은 수가 되는 1부터 찾습니다.",
  "symbol-cross-network-book5": "같은 도형끼리 곱한 식부터 풀고 찾은 값을 덧셈식에 넣습니다.",
  "symbol-square-product-network-book5": "같은 수를 두 번 곱한 값이 되는 수 카드 짝부터 찾습니다.",
  "square-paper-growth-book5": "몇 번째 모양인지와 한 줄의 장수가 같으므로 줄별로 빠짐없이 셉니다.",
  "square-row-two-boundaries-book5": "앞줄까지 쓴 수의 개수를 이용해 다음 줄의 첫 수와 마지막 수를 찾습니다.",
  "calendar-ordinal-sum-infer-weekday-book5": "둘째와 넷째 같은 요일은 14일 차이이므로 합과 차로 날짜를 찾습니다.",
  "regular-triangle-grid-count-book5": "삼각형의 크기와 위아래 방향을 나누어 빠짐없이 셉니다.",
  "square-border-stone-growth-book5": "검은 돌은 테두리, 흰 돌은 안쪽 정사각형으로 나누어 각각 셉니다.",
  "number-line-midpoint-book6": "양 끝 수를 더해 두 수로 똑같이 나누면 가운데 수가 됩니다.",
  "number-line-unit-distance-book6": "두 끝 수의 차를 같은 간격 수로 나누어 한 칸의 거리를 구합니다.",
  "number-line-two-part-distance": "각 구간의 한 칸 거리를 따로 구한 뒤 물음표 사이의 칸 수만큼 더합니다.",
  "rod-difference-measure-count": "전체 길이를 두 막대의 재는 횟수로 나눈 뒤 두 막대 길이의 차를 찾습니다.",
  "equivalent-fraction-chain": "분자와 분모에 같은 수를 곱하거나 나누어 같은 크기의 분수를 만듭니다.",
  "equivalent-ratio-chain": "비의 두 수에 같은 수를 곱해 같은 비를 차례로 만듭니다.",
  "bar-ratio-read": "각 막대를 같은 길이 조각으로 나누고 조각 수를 앞뒤 순서에 맞게 씁니다.",
  "bar-ratio-total-length": "비의 두 수를 더해 전체 묶음 수를 찾고 전체 길이를 한 묶음씩 나눕니다.",
  "balance-ratio-book6": "수평인 저울의 양쪽 개수를 비교하고 가장 간단한 비로 줄입니다.",
  "balance-weight-ratio": "저울에서 물건의 개수 비를 찾은 뒤 알려진 전체 무게를 같은 묶음으로 나눕니다.",
  "symbol-sum-card-deduction": "도형을 수 카드 후보에 하나씩 넣어 모든 식이 맞고 서로 다른 수가 되는 경우만 남깁니다.",
  "stride-ratio-total": "같은 거리를 걸었으므로 걸음 수가 적은 사람의 보폭이 더 큽니다. 거꾸로 된 비로 나눕니다.",
  "repeated-unit-length-total": "같은 전체 길이를 만드는 막대 개수의 관계와 두 막대 길이의 합을 함께 이용합니다.",
  "quadrilateral-perimeter": "마주 보는 두 변의 길이가 같으므로 가로와 세로를 두 번씩 더합니다.",
  "equal-sided-quadrilateral-perimeter": "네 변의 길이가 모두 같으므로 한 변을 네 번 더하거나 둘레를 네 등분합니다.",
  "joined-quadrilateral-dimensions": "각 도형의 둘레에서 한 변씩 구하고 붙어 있는 공통 변을 표시합니다.",
  "joined-quadrilateral-side": "알고 있는 도형의 둘레로 공통 변을 먼저 구해 옆 도형에 옮깁니다.",
  "joined-regular-shape-side": "정사각형과 정삼각형처럼 변이 같은 도형부터 한 변을 구해 이어진 도형에 씁니다.",
  "diagonal-triangle-perimeter": "직사각형의 한 변과 대각선을 이용해 색칠한 삼각형의 세 변만 더합니다.",
  "square-composition-side": "가장 작은 정사각형의 한 변부터 같은 높이·너비를 따라 큰 정사각형의 변을 만듭니다.",
  "square-composition-perimeter": "정사각형들의 한 변을 차례로 구한 뒤 색칠한 부분의 바깥 네 변만 더합니다.",
  "fold-cut-rectangle-perimeter": "접은 그림의 겹친 길이와 잘라낸 길이를 거꾸로 되돌려 처음 가로와 세로를 찾습니다.",
  "rectilinear-route-perimeter": "오른쪽으로 간 전체 길이는 왼쪽으로 돌아온 전체 길이와 같고 위아래도 같습니다.",
  "rectilinear-perimeter-book6": "가로 방향 길이와 세로 방향 길이를 각각 모아 도형의 바깥선을 한 바퀴 더합니다.",
  "concave-perimeter": "안으로 들어간 선을 바깥으로 평행 이동해 같은 가로·세로 길이로 바꾸어 셉니다.",
  "grid-cutout-perimeter": "잘라낸 한 칸마다 사라진 바깥 변과 새로 생긴 안쪽 변을 비교합니다.",
  "polyomino-outer-perimeter": "낱개 정사각형 둘레의 합에서 서로 맞닿은 변을 두 번씩 뺍니다.",
  "attached-regular-shape-perimeter": "붙은 공통 변은 바깥 둘레에서 빠지므로 각 도형 둘레의 합에서 두 번 뺍니다.",
  "perimeter-unit-edge-inverse": "도형의 바깥에 드러난 같은 길이 변의 개수를 세어 전체 둘레를 나눕니다.",
  "cutout-perimeter-change": "잘라내거나 옮긴 조각 때문에 없어진 변과 새로 생긴 변의 길이를 비교합니다.",
  "square-partition-lengths": "한쪽 전체 길이를 이루는 작은 정사각형 변들을 같은 방향끼리 더합니다.",
  "nested-square-perimeter": "가장 작은 정사각형에서 시작해 맞닿은 변의 길이를 이용해 다음 정사각형의 변을 구합니다.",
  "napier-multiplication": "곱해지는 수를 자릿값으로 나누어 각각 곱한 뒤 같은 자리의 값을 더합니다.",
  "area-model-multiplication": "한 수를 십의 자리와 일의 자리로 나누어 두 직사각형의 넓이를 더합니다.",
  "round-pair-addition": "둘을 더해 10·100·1000이 되는 수끼리 먼저 짝지어 계산합니다.",
  "round-pair-missing-addend": "목표 합에서 이미 짝지은 둥근 수들의 합을 빼 빠진 수를 찾습니다.",
  "common-factor-sum": "같은 수가 몇 번씩 더해지는지 묶음 수만 먼저 더한 뒤 곱합니다.",
  "near-round-multiplication": "99번은 100번에서 한 번을 빼고, 999번은 1000번에서 한 번을 뺍니다.",
  "near-round-addition": "각 수를 가까운 10·100·1000으로 올린 뒤 더 올린 만큼 마지막에 뺍니다.",
  "inclusive-range-count": "끝 수에서 처음 수를 빼고 처음 수까지 포함하도록 1을 더합니다.",
  "consecutive-sum-even-count": "첫 수와 끝 수를 짝지어 같은 합을 만들고 짝의 개수만큼 곱합니다.",
  "consecutive-sum-odd-count": "가운데 수를 찾아 연속수의 개수만큼 곱합니다.",
  "nth-even-odd": "몇 번째 짝수는 순서의 두 배, 몇 번째 홀수는 순서의 두 배에서 1을 뺀 수입니다.",
  "even-odd-position": "짝수는 2로 나누고, 홀수는 1을 더한 뒤 2로 나누어 순서를 찾습니다.",
  "facing-page-number": "펼친 책의 왼쪽은 짝수, 오른쪽은 바로 다음 홀수라는 점을 이용합니다.",
  "alternating-pair-sum": "앞에서부터 더하는 수와 빼는 수를 한 쌍으로 묶어 같은 차를 셉니다.",
  "common-factor-missing-term": "같은 수로 묶은 전체 묶음 수를 찾고 보이는 묶음 수를 뺍니다.",
  "consecutive-numbers-from-sum": "합을 수의 개수로 나누어 가운데 수를 찾고 앞뒤로 1씩 이어 씁니다.",
  "newspaper-page-pair": "같은 종이의 두 면 합은 첫 면과 마지막 면의 합과 같습니다.",
  "range-number-digit-count": "범위의 수를 자릿수별로 나누고 각 구간의 수 개수에 자릿수를 곱합니다.",
  "total-written-digits": "한 자리, 두 자리, 세 자리 수 구간을 나누어 쓰인 숫자 개수를 더합니다.",
  "digit-occurrence-count": "목표 숫자가 십의 자리와 일의 자리에 오는 경우를 나누어 겹치는 수를 확인합니다.",
  "digit-exclusion-count": "전체 수에서 금지된 숫자가 하나라도 들어간 수를 빼거나 허용된 자리만 직접 셉니다.",
  "consecutive-sign-insertion": "모두 더한 값에서 빼기로 바꾼 수의 두 배만큼 줄어든다는 점을 이용합니다.",
  "odd-sequence-sign-insertion": "홀수를 모두 더한 값과 목표값의 차를 보고 빼야 할 홀수의 합을 찾습니다.",
  "doubling-sequence-sign-insertion": "모두 더한 값에서 목표값까지 줄여야 하는 수를 두 배 묶음으로 찾습니다.",
  "plus-concatenation-evaluate": "더하기 기호가 없는 이웃 숫자는 한 수로 이어 읽은 뒤 각 항을 더합니다.",
  "plus-concatenation-target": "오른쪽부터 이어 붙일지 나눌지 정하며 목표 합과 비교합니다.",
  "mixed-sign-concatenation": "이어 붙인 수를 먼저 적고 더하기와 빼기를 왼쪽부터 계산합니다.",
  "remove-plus-concatenation": "더하기 하나를 없애면 양옆 수가 한 수로 이어져 값이 얼마나 커지는지 비교합니다.",
  "last-number-from-digit-total": "한 자리 수에 쓴 9개를 먼저 빼고 남은 숫자 개수를 두 자리씩 묶습니다.",
  "repeated-digit-concatenation": "같은 숫자를 한 자리·두 자리·세 자리 묶음으로 나누어 목표 합을 만듭니다.",
  "calendar-month-shift-weekday-b7": "한 달의 날짜 수를 7로 나눈 나머지만큼 다음 달의 요일을 옮깁니다.",
  "calendar-cross-month-weekday-b7": "달마다 남은 날짜 수를 차례로 더하고 7일씩 묶어 요일을 찾습니다.",
  "weekday-after-days-b7": "지난 날 수를 7로 나눈 나머지만큼 오늘의 요일에서 옮깁니다.",
  "time-unit-conversion-b7": "1일=24시간, 1시간=60분, 1분=60초를 기준으로 바꿉니다.",
  "analog-clock-reading-b7": "짧은 바늘은 시, 긴 바늘은 작은 눈금 한 칸을 1분으로 읽습니다.",
  "elapsed-time-analog-b7": "두 시각을 분으로 바꾸어 빼고 다시 시간과 분으로 나눕니다.",
  "time-add-subtract-base60-b7": "분이 60 이상이면 1시간을 올리고, 부족하면 1시간을 60분으로 바꿉니다.",
  "find-end-time-b7": "시작 시각에 걸린 시간을 더하고 60분마다 1시간으로 바꿉니다.",
  "find-start-time-b7": "끝 시각에서 걸린 시간을 빼며 필요하면 1시간을 60분으로 바꿉니다.",
  "consecutive-full-month-reverse-b7": "31일인 달이 연달아 나오는 곳은 7월과 8월뿐임을 먼저 찾습니다.",
  "leap-year-cross-month-weekday-b7": "윤년의 2월은 29일까지 있다는 점을 포함해 지난 날 수를 셉니다.",
  "mirror-clock-reading-b7": "거울 시각을 12시에서 빼 원래 시각으로 되돌립니다.",
  "mirror-clock-elapsed-b7": "두 거울 시각을 원래 시각으로 고친 뒤 밤 12시를 지나간 시간을 셉니다.",
  "mirror-symmetric-clock-b7": "좌우로 뒤집어도 시침과 분침의 자리가 같은 시각을 찾습니다.",
  "arithmetic-sequence-nth-b7": "첫 수에서 같은 수를 순서보다 한 번 적게 더합니다.",
  "shared-polygon-matchsticks-b7": "첫 다각형의 변 수에서 시작해 한 도형마다 공통 변 하나를 뺀 만큼 더합니다.",
  "division-fill-long-form-b7": "나누는 수와 몫을 곱하고 남는 수가 나누는 수보다 작은지 확인합니다.",
  "reverse-linear-equation-b7": "마지막 수에서 먼저 더한 수를 빼고 곱한 수로 나눕니다.",
  "arithmetic-sequence-position-b7": "마지막 수와 첫 수의 차를 뛰는 수로 나눈 뒤 첫째 수를 포함해 1을 더합니다.",
  "sparse-arithmetic-sequence-b7": "보이는 두 수 사이의 칸 수로 차를 나누어 한 칸의 변화를 찾습니다.",
  "indexed-arithmetic-sequence-b7": "순서가 1 커질 때 아래 수가 얼마나 변하는지 찾아 먼 순서까지 이어갑니다.",
  "two-leg-animal-assumption-b7": "모두 다리가 적은 동물이라고 놓고 남은 다리를 한 마리씩 바꿔 셉니다.",
  "two-wheel-vehicle-assumption-b7": "모두 두 바퀴라고 놓고 남은 바퀴를 네 바퀴 탈것으로 바꿉니다.",
  "two-card-value-assumption-b7": "모든 카드를 작은 수 카드라고 놓고 부족한 합을 두 카드의 차로 나눕니다.",
  "two-score-value-assumption-b7": "모두 낮은 배점이라고 놓고 부족한 점수를 두 배점의 차로 나눕니다.",
  "two-coin-value-assumption-b7": "모두 작은 금액이라고 놓고 부족한 금액을 두 금액의 차로 나눕니다.",
  "correct-wrong-score-assumption-b7": "모두 맞았다고 놓고 실제 점수와의 차를 한 문제를 틀릴 때 줄어드는 점수로 나눕니다.",
  "constant-step-object-growth-b7": "처음 개수와 매번 늘어나는 개수를 찾아 순서보다 한 번 적게 더합니다.",
  "bounded-symbol-sum-extrema-b7": "두 수의 관계를 만족하는 자연수를 차례로 적고 합의 범위 안에서 끝값을 찾습니다.",
  "win-loss-net-zero-b7": "모두 이겼다고 놓은 이동량에서 한 번 질 때 줄어드는 칸 수를 이용합니다.",
  "shared-consumption-assumption-b7": "모두 적게 먹는 집단이라고 놓고 남은 양을 집단을 바꿀 때의 차로 나눕니다.",
  "count-difference-assumption-b7": "개수 차만큼 먼저 놓고 한 쌍씩 늘릴 때 단위 수의 차가 어떻게 변하는지 봅니다.",
  "linked-sequence-correspondence-b7": "첫 수열에서 목표의 순서를 찾고 같은 순서의 둘째 수열 값을 구합니다.",
  "climb-slip-days-b7": "마지막 날에는 미끄러지지 않으므로 목표에서 낮에 오르는 높이를 먼저 뺍니다.",
  "exchange-container-total-b7": "처음 산 수와 바꾸어 받은 수를 더하고 새 빈 병도 다시 바꿀 수 있는지 확인합니다.",
  "reverse-doubling-target-day-b7": "마지막 크기에서 하루 전으로 갈 때마다 2로 나눕니다.",
  "doubling-fraction-start-count-b7": "가득 찬 양을 1로 보고 하루 전마다 절반이 되며, 더 일찍 채우려면 시작 개수가 두 배가 됩니다.",
  "doubling-start-count-b7": "가득 차는 날을 하루 앞당길 때마다 처음 개수를 두 배로 늘립니다.",
  "doubling-half-full-day-b7": "매일 두 배이므로 가득 차기 바로 전날에는 정확히 절반입니다.",
  "doubling-two-start-earlier-b7": "처음 개수가 두 배이면 가득 차는 날이 하루 빨라집니다.",
  "polygon-border-point-count-b7": "닫힌 정다각형에서는 꼭짓점이 겹치므로 한 변의 간격 수에 변 수를 곱합니다.",
  "polygon-border-side-count-inverse-b7": "전체 점 수를 변 수로 나누어 한 변의 간격 수를 찾고 꼭짓점 하나를 더합니다.",
  "polygon-stakes-from-side-b7": "한 변의 말뚝 수에서 겹치는 꼭짓점 하나를 빼 변 수만큼 곱합니다.",
  "closed-perimeter-object-count-b7": "닫힌 둘레에서는 간격 수와 물건 수가 같으므로 둘레를 간격으로 나눕니다.",
  "closed-perimeter-from-spacing-count-b7": "닫힌 둘레는 물건 수와 간격 수가 같으므로 개수와 간격을 곱합니다.",
  "between-objects-subdivision-count-b7": "큰 간격 하나 안에 들어가는 작은 간격 수에서 양끝을 빼 중간 물건 수를 구합니다.",
  "perimeter-capacity-b7": "둘레의 간격 수를 구하고 간격마다 놓는 의자 수와 한 의자 정원을 차례로 곱합니다.",
  "between-object-perimeter-b7": "중간 물건 수로 큰 간격의 개수를 찾고 가로등 간격을 곱합니다.",
  "inner-outer-path-object-count-b7": "안쪽과 바깥쪽 직사각형의 둘레를 각각 구해 간격으로 나눈 뒤 더합니다.",
  "polygon-border-shape-conversion-b7": "첫 정다각형의 전체 점 수를 구해 새 정다각형의 변 수로 나눕니다.",
  "palindrome-length-count-b7": "첫 자리에는 0이 올 수 없고 앞 절반을 정하면 뒤 절반은 거울처럼 정해집니다.",
  "three-digit-palindrome-digit-sum-b7": "백의 자리와 일의 자리를 같게 놓고 두 배한 값과 가운데 수의 합을 맞춥니다.",
  "calendar-date-palindrome-b7": "월과 일을 문제의 방식대로 이어 쓴 뒤 앞뒤가 같은 날짜만 고릅니다.",
  "clock-time-palindrome-b7": "시와 분을 이어 쓴 수가 거꾸로 읽어도 같은지 분마다 확인합니다.",
  "reversed-two-digit-difference-enumeration-b7": "자리 바꿈 전후의 차는 두 자리 숫자의 차에 9를 곱한 값입니다.",
  "reversed-two-digit-difference-extreme-b7": "두 자리 숫자의 차를 정한 뒤 가능한 수 중 조건에 맞는 가장 큰 수나 작은 수를 고릅니다.",
  "reversed-digit-given-tens-b7": "자리 바꿈 전후의 차를 9로 나누어 두 자리 숫자의 차를 찾습니다.",
  "reversed-digit-pair-range-b7": "자리 숫자 차와 합의 범위를 함께 만족하는 뒤집힌 두 수를 찾습니다.",
  "four-point-distance-chain-b7": "겹친 두 점 사이 거리는 큰 구간에서 이미 아는 작은 구간을 빼서 구합니다.",
  "venn-overlap-all-b7": "모두 적어도 한 조건에 속하므로 두 집합의 합에서 전체를 빼 겹친 수를 구합니다.",
  "venn-union-total-b7": "두 집합의 수를 더하고 겹쳐서 두 번 센 수를 한 번 뺍니다.",
  "venn-exactly-one-b7": "각 집합에서 겹친 수를 뺀 두 부분만 더합니다.",
  "venn-neither-b7": "두 집합의 합집합을 구한 뒤 전체에서 뺍니다.",
  "venn-overlap-with-neither-b7": "전체에서 둘 다 아닌 수를 빼 합집합을 구한 뒤 두 집합의 합과 비교합니다.",
  "two-way-table-count-b7": "행과 열의 합을 이용해 네 칸을 하나씩 채우고 필요한 전체나 분류 수를 더합니다.",
  "palindrome-adjacent-digit-difference-b7": "세 자리 대칭수의 양끝을 같게 놓고 가운데 숫자와의 차를 맞춥니다.",
  "complement-groups-total-b7": "각 집단에 속하지 않는 수를 더하면 전체가 몇 번 세어지는지 확인합니다.",
  "four-group-complement-total-b7": "각 모둠을 제외한 수들의 합은 전체 학생을 세 번 센 값입니다.",
  "reverse-add-palindrome-b7": "수를 거꾸로 읽은 수와 더하고, 앞뒤가 같아질 때까지 같은 과정을 반복합니다.",
  "minimum-stone-moves-b7": "처음과 목표에서 같은 자리에 있는 돌은 그대로 두고 다른 자리의 돌만 셉니다.",
  "kaprekar-495-b7": "세 숫자로 가장 큰 수와 가장 작은 수를 만들어 빼는 과정을 495가 될 때까지 반복합니다.",
  "three-circle-equal-sum-b7": "완성된 원의 합을 기준으로 다른 원에서 알고 있는 수를 빼 색칠한 수를 구합니다.",
  "balance-difference-deduction-b8": "수평인 저울 두 개에서 양쪽에 함께 있는 묶음을 지우고 남은 차이로 한 도형의 수를 찾습니다.",
  "overlap-circle-sum-b8": "겹친 부분을 두 원에서 모두 센다는 점을 표시하고, 한 원의 합에서 보이는 수를 뺍니다.",
  "symbol-additive-chain-b8": "같은 도형끼리 모인 가장 간단한 식부터 풀고, 찾은 값을 다음 식에 차례로 넣습니다.",
  "addition-matrix-target-b8": "가로 묶음과 세로 묶음의 수를 먼저 구한 뒤 만나는 칸에서는 두 수를 더합니다.",
  "addition-matrix-complete-b8": "완성된 칸에서 가로·세로 도형 값을 찾고 같은 규칙으로 빈칸을 채웁니다.",
  "symbol-operation-deduction-b8": "0을 더하거나 곱한 결과와 1을 곱한 결과를 먼저 이용해 확실한 도형부터 찾습니다.",
  "symbol-cross-equation-b8": "가로식과 세로식에서 같은 도형이 만나는 곳을 표시하고 한 식씩 이어 풉니다.",
  "conditional-symbol-chain-b8": "도형마다 가능한 한 자리 수를 적고 서로 다른 수 조건에 어긋나는 후보를 지웁니다.",
  "conditional-two-digit-symbol-b8": "십의 자리와 일의 자리 조건을 나누어 적고 도형 관계를 모두 만족하는 두 자리 수만 남깁니다.",
  "cyclic-pair-sums-b8": "세 도형을 두 개씩 더한 식을 모두 더해 전체를 두 번 센 값임을 이용합니다.",
  "pyramid-cryptarithm-b8": "피라미드 아래쪽 일의 자리부터 더하고 받아올림을 바로 위 자리에 표시합니다.",
  "blank-digit-vertical-addition-b8": "일의 자리부터 빈칸을 하나씩 채우고 받아올림을 포함해 빈 숫자의 합을 구합니다.",
  "all-digits-once-cryptarithm-b8": "각 자리의 합과 받아올림을 맞추면서 이미 쓴 숫자는 후보에서 지웁니다.",
  "ordered-symbol-cryptarithm-b8": "세로셈을 만족하는 후보를 만든 뒤 도형의 크기 순서 조건으로 하나만 남깁니다.",
  "repeated-symbol-cryptarithm-b8": "반복되는 같은 도형에는 같은 숫자를 넣고 일의 자리에서 생긴 받아올림을 십의 자리에 보냅니다.",
  "multi-symbol-cryptarithm-b8": "각 자리에서 가능한 도형값과 받아올림을 적고 다른 자리의 같은 도형과 맞춰 봅니다.",
  "doubled-symbol-result-b8": "같은 도형 두 개를 더한 값부터 찾고 결과의 각 자리 숫자를 거꾸로 확인합니다.",
  "letter-pyramid-cryptarithm-b8": "아랫자리의 문자부터 더해 받아올림을 기록하고 위 자리의 문자값을 차례로 정합니다.",
  "repeated-number-multiple-answers-b8": "같은 숫자로 이루어진 수를 하나씩 대입해 세로셈이 맞는 경우를 빠짐없이 찾습니다.",
  "linked-cryptarithm-b8": "첫 번째 세로셈에서 정해진 도형값을 두 번째 세로셈의 같은 도형에 그대로 넣습니다.",
  "subtract-to-repeated-number-b8": "일의 자리에서 받아내림 여부를 확인하고 결과의 십의 자리와 일의 자리가 같은지 맞춥니다.",
  "equalize-transfer-b8": "두 양의 차이는 옮긴 수의 두 배만큼 줄어드므로 차를 똑같이 두 수로 가릅니다.",
  "chained-equalize-transfer-b8": "한 번 옮길 때 준 사람과 받은 사람의 수를 함께 바꾸어 세 사람의 수가 같아지는지 확인합니다.",
  "total-difference-bars-b8": "큰 수에서 차이를 떼어 놓고 남은 합을 똑같이 두 수로 가릅니다.",
  "future-age-sum-b8": "몇 년 뒤에는 두 사람 모두 같은 해 수만큼 나이가 늘므로 늘어난 합을 먼저 뺍니다.",
  "table-total-difference-b8": "표의 이미 아는 수를 전체에서 빼 두 빈칸의 합을 구하고, 차를 이용해 나눕니다.",
  "reverse-transfer-three-b8": "마지막 상태에서 받은 수는 빼고 준 수는 더하며 세 사람의 처음 수로 돌아갑니다.",
  "sum-multiple-bars-b8": "작은 수를 한 묶음으로 놓고 큰 수의 묶음 수까지 더한 전체 묶음으로 합을 나눕니다.",
  "difference-multiple-bars-b8": "큰 수와 작은 수의 겹치는 한 묶음을 지우고 남은 묶음 수로 차를 나눕니다.",
  "sum-multiple-offset-b8": "몇 배보다 더 많거나 적은 양을 먼저 합에서 떼어 낸 뒤 같은 묶음으로 나눕니다.",
  "three-person-difference-b8": "두 사람씩의 차를 한 줄 순서로 잇고 주어진 합에 맞는 값을 거꾸로 찾습니다.",
  "transfer-to-multiple-b8": "옮긴 뒤 두 사람의 수를 식이나 막대로 나타내고 몇 배 관계가 맞는 수를 찾습니다.",
  "conditional-three-share-b8": "주고받은 뒤의 세 사람 관계를 먼저 정리하고 마지막 상태에서 처음 상태로 되돌아갑니다.",
  "reverse-double-offset-b8": "결과가 처음 수의 두 배에서 얼마 작은지 식으로 나타내 반대 계산으로 처음 수를 찾습니다.",
  "reverse-arithmetic-chain-b8": "마지막 수에서 시작해 더하기는 빼기, 빼기는 더하기로 바꾸어 거꾸로 계산합니다.",
  "reverse-transfer-events-b8": "마지막 사건부터 받은 수는 빼고 준 수는 더하며 사건 순서를 거꾸로 따라갑니다.",
  "reverse-multiply-divide-b8": "마지막 계산부터 나누기는 곱하기, 곱하기는 나누기로 바꾸어 처음 수를 찾습니다.",
  "reverse-split-equal-b8": "똑같이 나눈 뒤의 한 몫에서 주고받은 수를 되돌리고 몫의 개수만큼 합칩니다.",
  "give-as-much-once-b8": "준 뒤 상대의 수가 두 배가 되는 점을 이용해 마지막 두 수에서 처음 수를 되돌립니다.",
  "give-as-much-return-b8": "마지막에 돌려준 수부터 되돌린 뒤 상대가 가진 만큼 주었던 순간을 찾아 처음 수를 구합니다.",
  "shaded-fraction-count-b8": "전체를 분모만큼 똑같이 나누고 색칠한 조각 수인 분자만큼 묶습니다.",
  "fraction-given-away-original-b8": "남은 양이 전체의 몇 분의 몇인지 찾고 남은 수를 그 조각 수만큼 거꾸로 늘립니다.",
  "sequential-fraction-remains-b8": "두 번째로 남은 양부터 거꾸로 한 단계씩 전체 조각 수로 복원합니다.",
  "fraction-difference-whole-b8": "두 분수의 차가 전체를 똑같이 나눈 몇 조각인지 찾고 한 조각의 수를 구합니다.",
  "fraction-share-difference-b8": "두 모둠의 전체를 같은 분모 조각으로 나타내고 알려진 사람 수 차와 맞춥니다.",
  "reverse-two-container-transfers-b8": "두 번째로 옮긴 수부터 반대로 옮기고 첫 번째 이동도 되돌려 처음 두 상자를 찾습니다.",
  "three-container-condition-b8": "마지막 세 상자의 관계와 전체 합을 함께 맞춘 뒤 이동을 거꾸로 되돌립니다.",
  "sequential-fraction-consumption-b8": "마지막에 남은 양에서 시작해 먹기 전의 조각 수를 단계마다 거꾸로 복원합니다.",
  "fraction-subgroup-count-b8": "각 집단의 전체를 분모만큼 나누어 해당 분자만큼의 사람 수를 각각 구한 뒤 더합니다.",
  "latin-square-congruent-partition-b9": "각 조각의 모양을 먼저 맞추고 1, 2, 3, 4가 한 번씩 들어가는지 확인합니다.",
  "equal-sum-congruent-partition-b9": "모양이 같은 조각끼리 나눈 뒤 각 조각 안의 수를 더해 모두 같은지 확인합니다.",
  "landmark-congruent-partition-b9": "조각을 돌려 겹쳤을 때 표식도 같은 자리에 오는지 확인합니다.",
  "congruent-composite-partition-b9": "칸 수만 보지 말고 조각을 돌리거나 뒤집어 완전히 포개지는지 확인합니다.",
  "triangle-equal-subdivision-b9": "전체 조각 수에서 표시된 조각 수를 빼 남은 조각을 셉니다.",
  "hexagon-equal-subdivision-b9": "가운데에서 같은 크기로 나뉜 조각을 한 바퀴 차례로 세어 봅니다.",
  "tetromino-cover-count-b9": "나무가 있는 칸을 빼고 남은 칸 수를 네 칸씩 묶습니다.",
  "quadrilateral-grid-area-b9": "모눈의 온칸과 반칸을 짝지어 사각형의 넓이를 구합니다.",
  "shaded-composite-grid-area-b9": "큰 직사각형 넓이에서 비어 있는 작은 직사각형 넓이를 뺍니다.",
  "parallelogram-grid-area-b9": "평행사변형을 잘라 옮겨 같은 밑변과 높이의 직사각형으로 생각합니다.",
  "cube-solid-to-views-b9": "앞과 옆에서 같은 줄에 보이는 쌓기나무 중 가장 높은 층을 적습니다.",
  "cube-layer-views-b9": "각 층의 칸을 포개어 앞과 옆의 세로줄별 최고 층을 찾습니다.",
  "cube-shell-interior-b9": "가로·세로·높이에서 겉의 두 층을 각각 빼고 안쪽 개수를 곱합니다.",
  "cube-view-model-choice-b9": "위에서 본 자리와 앞·옆의 최고 층을 세 조건 모두 맞춰 봅니다.",
  "magic-square-swap-pair-b9": "가로와 세로 합이 어긋난 두 줄을 찾아 두 수의 자리를 한 번 바꿉니다.",
  "magic-square-four-pair-sum-b9": "한 줄의 전체 합에서 같은 줄에 보이는 두 수를 빼 A와 B의 합을 구합니다.",
  "triangle-edge-extreme-six-b9": "세 꼭짓점의 수가 두 번씩 더해지는 점을 이용해 한 변 합을 가장 크게 또는 작게 만듭니다.",
  "triangle-edge-extreme-nine-b9": "꼭짓점에 놓을 세 수를 먼저 정하고 각 변의 남은 칸을 같은 합으로 맞춥니다.",
  "heptagon-ring-equal-sum-b9": "한 줄씩 겹쳐 쓰는 꼭짓점 수를 보며 일곱 줄의 합을 차례로 맞춥니다.",
  "overlap-region-equal-sum-b9": "겹친 부분은 양쪽에 함께 있으므로 겹치지 않은 부분끼리의 합을 맞춥니다.",
  "grid-line-sum-minimum-b9": "가로 합과 세로 합을 모두 만족하는 가운데 수를 작은 수부터 넣어 봅니다.",
  "circle-chain-equal-sum-b9": "한 줄의 합에서 같은 줄에 이미 보이는 두 수를 빼 빈 원의 수를 찾습니다.",
  "triangle-line-equal-sum-b9": "빈칸이 있는 줄과 완성된 줄의 합을 비교해 모자란 수를 찾습니다.",
  "circular-magic-maximum-b9": "가장 큰 수를 가운데 두고 바깥 수를 작은 수와 큰 수끼리 짝지어 봅니다.",
  "fixed-value-order-assignment-b9": "가장 작은 값부터 차이 조건을 이어 붙여 사람마다 값을 정합니다.",
  "line-ranking-constraints-b9": "누가 누구보다 앞인지 화살표로 이어 한 줄 순서를 만듭니다.",
  "exclusion-grid-ranking-b9": "될 수 없는 칸을 지우고 한 칸만 남은 사람부터 등수를 정합니다.",
  "exact-one-ranking-predictions-b9": "각 사람의 두 예상 중 하나만 맞도록 표시해 가능한 순위를 하나로 좁힙니다.",
  "exact-one-answer-assignment-b9": "각 줄에서 맞는 답을 하나만 남기며 모든 문제의 답이 겹치지 않게 맞춥니다.",
  "pair-group-inference-b9": "회의에 함께 나온 두 사람은 같은 모둠이 아니므로 가능한 짝에서 지웁니다.",
  "all-false-circular-seating-b9": "모든 말을 반대로 바꾼 뒤 원탁을 한 자리씩 채웁니다.",
  "preference-count-matrix-b9": "각 열의 전체 표시 수를 맞추며 비어 있는 칸을 하나씩 채웁니다.",
  "apartment-neighbor-logic-b9": "오른쪽 옆집 조건으로 각 층을 만들고 위아래 조건으로 두 층을 맞춥니다.",
  "profession-assignment-b9": "가능한 직업이 하나뿐인 사람부터 정하고 같은 직업 칸을 다른 사람에게서 지웁니다.",
  "activity-enrollment-b9": "활동별 전체 인원에 맞게 표시를 채운 뒤 컴퓨터 칸이 비는 학생을 찾습니다.",
  "g1-odd-even-sum-difference": "홀수와 짝수를 차례로 한 쌍씩 묶어 각 쌍에서 생기는 차이를 더합니다.",
  "g1-summer-equalize-transfer": "두 수의 차를 반으로 나누면 같게 만들기 위해 옮길 수가 됩니다.",
  "g1-summer-height-order-five": "조건마다 더 큰 사람을 위에 적어 다섯 사람의 순서를 한 줄로 잇습니다.",
  "g1-summer-two-digit-sum-gap": "두 자리의 합과 차를 함께 만족하는 십의 자리와 일의 자리를 찾습니다.",
  "g1-summer-balance-shape-chain": "첫 저울에서 한 도형의 무게를 찾고 다음 저울의 같은 도형을 바꾸어 넣습니다.",
  "g1-summer-five-box-weight-order": "무겁다와 가볍다 조건을 화살표로 이어 다섯 상자의 순서를 정합니다.",
  "g1-summer-four-shape-add-subtract": "같은 도형끼리 지워 한 도형의 값을 먼저 찾고 나머지 식에 넣습니다.",
  "g1-summer-pentagon-adjacent-product": "이웃한 두 꼭짓점의 수를 곱해 변의 수와 맞는지 차례로 확인합니다.",
  "g1-summer-four-by-four-shape-sum": "같은 그림이 반복되는 줄부터 그림값을 찾고 목표 줄을 더합니다.",
  "g1-summer-circle-point-segments": "새 점 하나를 추가할 때 앞의 모든 점과 이어지는 선분을 더합니다.",
  "g1-summer-four-by-four-shape-sum-bottom": "가로와 세로의 같은 그림 구성을 찾아 이미 아는 합을 옮겨 씁니다.",
  "g1-summer-vertical-shape-addition": "일의 자리부터 같은 도형의 숫자와 받아올림을 차례로 찾습니다.",
  "g1-summer-one-three-rods": "긴 막대 한 개를 짧은 막대 몇 개와 같은지 바꾸어 전체 길이를 셉니다.",
  "g1-summer-triangular-color-difference": "한 단계씩 늘어나는 흰 조각과 색칠 조각을 따로 세어 차를 구합니다.",
  "g1-summer-square-side-composition": "겹친 길이를 빼고 바깥에 남은 같은 길이 조각을 더합니다.",
  "g1-summer-fold-cut-triangle-count": "접은 횟수와 잘린 위치를 따라 펼칠 때 대칭으로 늘어나는 조각을 셉니다.",
  "g1-summer-four-symbol-relation": "가장 단순한 식에서 도형값을 찾고 같은 도형을 다음 식에 넣습니다.",
  "g1-summer-shape-height-dual-cycle": "도형의 반복 마디와 높이의 반복 마디를 따로 찾은 뒤 같은 번째에서 합칩니다.",
  "g1-summer-orange-ratio-distribution": "어린이 한 묶음과 어른 한 묶음이 먹는 양을 비교해 사람 수를 나눕니다.",
  "g1-summer-rectilinear-perimeter": "오목하게 들어간 변을 바깥쪽으로 옮겨 같은 길이의 큰 직사각형처럼 계산합니다.",
  "g1-summer-opposite-step-sequences": "위 수열의 이동 횟수를 먼저 찾고 아래 수열도 같은 횟수만큼 반대 방향으로 움직입니다.",
  "g1-fall-three-person-total-transfer": "주고받은 뒤의 차이를 거꾸로 되돌려 처음 세 사람의 수를 찾습니다.",
  "g1-fall-number-set-offset-chain": "기준 수 하나를 정하고 모든 조건의 차를 더하거나 빼 후보를 확인합니다.",
  "g1-fall-four-by-four-latin-two-target": "각 가로줄과 세로줄에 같은 수가 한 번씩만 오도록 빈칸을 채웁니다.",
  "g1-fall-pentagon-adjacent-products-all": "변의 곱을 이웃한 꼭짓점끼리 나누어 다섯 수를 한 바퀴 정합니다.",
  "g1-fall-four-by-four-shape-sum-four-targets": "같은 그림이 반복되는 줄부터 그림값을 구한 뒤 네 목표 줄을 각각 더합니다.",
  "g1-fall-four-short-one-long-rods": "긴 막대를 짧은 막대 네 개로 바꾸어 같은 단위로 전체 길이를 계산합니다.",
  "g1-fall-stacked-square-side-chain": "큰 정사각형의 변을 작은 정사각형 몇 칸과 같은지 단계별로 바꿉니다.",
  "g1-fall-aa-ab-ccc-shape-addition": "일의 자리에서 같은 숫자의 합과 받아올림을 찾고 왼쪽 자리로 이동합니다.",
  "g1-fall-three-fold-crease-cut-count": "접힌 선이 펼칠 때마다 대칭으로 복사되는 위치를 순서대로 표시합니다.",
  "g1-fall-total-triple-share": "작은 몫 한 개와 큰 몫 세 개, 모두 네 묶음으로 전체를 나눕니다.",
  "g1-fall-paired-four-blank-additions": "완성된 자리의 합에서 보이는 숫자를 빼 각 빈칸을 차례로 채웁니다.",
  "g1-fall-square-chain-shaded-perimeter": "색칠한 정사각형의 네 변 중 다른 정사각형과 맞닿지 않은 변만 셉니다.",
  "g1-fall-linear-input-output-table": "입력이 한 칸 늘 때 출력이 얼마나 늘어나는지 찾아 목표 입력까지 이어갑니다.",
  "g1-fall-alternating-result-cryptarithm": "일의 자리부터 받아올림을 표시하며 같은 도형에 같은 숫자를 넣습니다.",
  "g1-fall-consecutive-three-sum-completion": "가운데 수를 전체 합을 3으로 나눈 값으로 잡고 앞뒤 연속수를 찾습니다.",
  "g1-winter-shared-box-multiplication": "아래 곱셈에서 함께 쓰는 가운데 수를 먼저 찾고, 그 수로 위 곱셈을 거꾸로 풉니다.",
  "g1-winter-shape-sum-target-row": "같은 그림이 여러 번 나온 줄부터 그림값을 찾고 목표 줄의 그림값을 모두 더합니다.",
  "g1-winter-opponent-step-game": "한 사람이 올라가면 다른 사람은 내려간다는 규칙으로 상대의 움직임만 차례로 표시합니다.",
  "g1-winter-sudoku-four-full": "각 가로줄·세로줄·굵은 네 칸에서 아직 쓰지 않은 수를 하나씩 찾습니다.",
  "g1-winter-two-digit-odd-sum-order": "일의 자리가 홀수인지 먼저 보고, 자리 합과 두 자리의 크기 조건을 함께 확인합니다.",
  "g1-winter-product-placement-four": "가로의 두 수를 곱해 가능한 짝을 찾고, 세로 곱까지 맞는 순서로 놓습니다.",
  "g1-winter-three-digit-cards-above": "백의 자리부터 카드를 바꾸어 수를 빠짐없이 만든 뒤 기준 수와 비교합니다.",
  "g1-winter-three-balance-substitution": "첫째 저울의 물건을 마름모로 바꾸고, 그 값을 다음 저울에 차례로 넣습니다.",
  "g1-winter-three-cards-parity-chain": "짝수인 ㄱ의 후보부터 놓고 차 조건을 거꾸로 따라 ㄴ과 ㄷ을 찾습니다.",
  "multi-method-multiplication-b10": "한 수를 십의 자리와 일의 자리로 나누어 각각 곱한 뒤 두 값을 더합니다.",
  "same-tens-complement-product-b10": "같은 십의 자리와 합이 10인 일의 자리를 표시해 빠른 곱셈 규칙을 적용합니다.",
  "same-ones-complement-product-b10": "같은 일의 자리와 합이 10인 십의 자리를 표시해 두 부분으로 계산합니다.",
  "factor-pair-divisor-count-b10": "곱해서 목표 수가 되는 두 수를 작은 수부터 짝지어 빠짐없이 씁니다.",
  "multi-count-consecutive-decomposition-b10": "연속수의 개수를 2개부터 바꾸며 첫 수가 자연수가 되는 경우를 찾습니다.",
  "calendar-consecutive-sum-weekday-b10": "날짜 합을 연속수로 나눈 뒤 마지막 날짜가 놓인 요일 칸을 찾습니다.",
  "consecutive-page-range-b10": "쪽수 합을 쪽 수로 나누어 가운데 쪽을 찾고 앞뒤로 이어 씁니다.",
  "same-parity-consecutive-sum-b10": "홀수나 짝수를 2씩 이어 쓰고 양끝을 짝지어 더합니다.",
  "rectangular-number-grid-sum-b10": "가운데 수를 기준으로 같은 거리의 두 수를 짝지어 합을 구합니다.",
  "shaped-number-grid-sum-b10": "색칠한 칸을 가로·세로의 같은 간격끼리 묶어 더합니다.",
  "calendar-block-sum-b10": "달력 3×3 묶음은 가운데 날짜를 중심으로 앞뒤 수가 짝을 이룹니다.",
  "all-consecutive-decompositions-b10": "연속수의 개수를 하나씩 늘리며 가능한 첫 수를 빠짐없이 확인합니다.",
  "consecutive-tens-digit-condition-b10": "십의 자리 합과 일의 자리 합을 따로 맞춘 뒤 세 수가 연속인지 확인합니다.",
  "consecutive-vertical-addition-b10": "전체 합을 세 연속수로 나누어 각 수를 찾은 뒤 가려진 숫자를 읽습니다.",
  "two-symbol-coefficient-weight-b10": "두 식에서 개수가 하나씩 바뀐 부분을 비교해 두 물건의 차를 먼저 찾습니다.",
  "two-symbol-score-difference-b10": "두 식을 나란히 놓고 서로 바뀐 과녁 한 개씩의 점수 차를 찾습니다.",
  "shared-term-equation-b10": "두 식에 똑같이 들어 있는 묶음을 지우고 남은 도형의 값을 구합니다.",
  "container-double-content-b10": "가득 찬 통의 무게에서 같은 수의 빈 통 무게를 뺍니다.",
  "three-pair-sums-values-b10": "세 짝의 합을 모두 더해 둘로 가른 뒤 각 짝의 합을 빼 값을 찾습니다.",
  "closed-perimeter-spacing-difference-b10": "닫힌 둘레에서는 전체 길이를 간격으로 나눈 수가 세운 개수와 같습니다.",
  "same-budget-price-count-b10": "가진 돈을 각 물건의 가격으로 나누어 살 수 있는 개수를 비교합니다.",
  "new-participants-equal-share-b10": "나중 사람 수와 한 사람 몫으로 전체를 구한 뒤 처음 사람 수로 나눕니다.",
  "catch-up-growing-amount-b10": "처음 차이를 찾고 한 번마다 줄어드는 차로 나누어 같아지는 때를 찾습니다.",
  "catch-up-shrinking-amount-b10": "두 양의 처음 차이와 한 번마다 줄어드는 양의 차를 비교합니다.",
  "catch-up-distance-b10": "두 사람의 빠르기 차만큼 매분 가까워지는 거리를 표시합니다.",
  "four-object-weight-system-b10": "공통 물건을 지울 수 있는 두 식부터 비교하고 찾은 값을 다음 식에 넣습니다.",
  "delayed-start-catch-up-b10": "먼저 시작한 달 수와 늦게 시작한 달 수를 나란히 적어 저금액을 비교합니다.",
  "repeated-digit-number-count-b10": "첫 자리에는 0을 빼고, 각 자리에 놓을 수 있는 카드 수를 차례로 셉니다.",
  "binary-switch-count-b10": "전등을 하나 늘릴 때마다 앞의 각 모습에 켠 모습과 끈 모습이 생깁니다.",
  "monotone-digit-enumeration-b10": "첫 자리부터 정하고 그보다 크거나 작은 카드만 다음 자리에 놓습니다.",
  "monotone-digit-rank-b10": "조건에 맞는 수를 첫 자리부터 작은 순서로 묶어 목표 순서를 찾습니다.",
  "distinct-card-target-sum-b10": "가장 작은 카드부터 짝을 바꾸며 목표 합이 되는 묶음을 빠짐없이 확인합니다.",
  "digit-sum-three-digit-count-b10": "백의 자리를 먼저 정하고 남은 합을 십의 자리와 일의 자리에 나눕니다.",
  "digit-sum-ranked-number-b10": "백의 자리와 십의 자리를 작은 순서로 정하며 조건에 맞는 수를 씁니다.",
  "three-digit-step-count-b10": "백의 자리와 십의 자리 차를 일의 자리에도 똑같이 이어 봅니다.",
  "monotone-digit-count-b10": "백의 자리보다 작은 숫자, 다시 그보다 작은 숫자를 차례로 놓습니다.",
  "route-product-count-b10": "첫 구간의 각 길마다 다음 구간에서 이어 갈 수 있는 길을 모두 셉니다.",
  "lineup-count-b10": "첫 자리부터 설 수 있는 사람을 정하고 다음 자리의 사람 수를 하나씩 줄입니다.",
  "number-baseball-b10": "0S 0B인 숫자를 먼저 지우고, 자리까지 맞는 숫자와 자리만 다른 숫자를 나눕니다.",
  "most-frequent-digit-b10": "각 숫자가 일·십·백의 자리에 나타나는 횟수를 따로 세어 더합니다.",
  "digit-occurrence-range-b10": "목표 숫자가 각 자리에 오는 수를 세고 두 자리에 함께 오는 수도 확인합니다.",
  "positive-range-number-digit-count-b10": "한 자리·두 자리·세 자리 구간으로 나누어 쓰인 숫자 수를 더합니다."
});

const CONCEPT_SUMMARY_BY_DOMAIN = Object.freeze({
  number: (middle) => `${middle}에서 수와 식의 관계를 이해하고 여러 표현을 서로 연결합니다.`,
  pattern: (middle) => `${middle}에서 반복과 변화를 찾아 같은 규칙을 다음 단계에 적용합니다.`,
  logic: (middle) => `${middle}에서 주어진 조건을 빠짐없이 정리해 가능한 경우를 좁힙니다.`,
  geometry: (middle) => `${middle}에서 모양·위치·공간 관계를 관찰하고 변화를 정확히 나타냅니다.`
});

export const REPRESENTATIVE_CONCEPTS = Object.freeze([...TYPES.reduce((concepts, item) => {
  const classification = questionClassificationForType(item.id);
  if (!concepts.has(classification.representativeConceptId)) {
    concepts.set(classification.representativeConceptId, Object.freeze({
      id: classification.representativeConceptId,
      label: classification.representativeConceptLabel,
      summary: item.conceptSummary
        || CONCEPT_SUMMARY_BY_DOMAIN[item.domain]?.(item.middle)
        || `${item.middle}의 핵심 관계를 이해하고 같은 원리를 적용합니다.`
    }));
  }
  return concepts;
}, new Map()).values()]);

const representativeConceptById = Object.fromEntries(REPRESENTATIVE_CONCEPTS.map((concept) => [concept.id, concept]));

export const representativeConceptForType = (id) => {
  const item = byId[id];
  if (!item) return null;
  const classification = questionClassificationForType(id);
  const sharedConcept = representativeConceptById[classification.representativeConceptId];
  const typeSpecificPrinciple = TEXTBOOK_CONCEPT_GUIDES[id];
  return Object.freeze({
    ...sharedConcept,
    principle: typeSpecificPrinciple
      || `${item.label} 문제에서 ${item.middle}의 관계를 찾아 말·그림·식으로 나타내고 같은 원리를 적용합니다.`,
    specificity: typeSpecificPrinciple ? "type-specific" : "shared-middle"
  });
};

export const textbookGuideForType = (id) => representativeConceptForType(id)?.principle
  || "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";

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
    type: [problemNumbers("check", 2, [2])], practice: [problemNumbers("practice", 1, [15])]
  }),
  "digital-board-half-turn-sum": stageReferences({
    type: [problemNumbers("check", 2, [1])], practice: [problemNumbers("practice", 1, [16])], advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "digital-flip-addition-horizontal": stageReferences({
    type: [problemNumbers("check", 2, [3])], practice: [problemNumbers("practice", 1, [17])]
  }),
  "digital-transform-addition": stageReferences({
    type: [problemNumbers("check", 2, [4])], practice: [problemNumbers("practice", 1, [18])]
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
    concept: [problemNumbers("activity", 1, [1])]
  }),
  "circular-magic-seven-line-sum": stageReferences({
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "circular-magic-eleven-line-sum": stageReferences({
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "cross-shape-magic-sum": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])], practice: [problemNumbers("practice", 1, [3, 4])]
  }),
  "t-shape-magic-sum": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5])], practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "equal-line-sum-eight-cards": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])], practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "triangle-edge-sum-six": stageReferences({
    type: [problemNumbers("check", 1, [3])], practice: [problemNumbers("practice", 1, [9])]
  }),
  "gakuro-card-placement": stageReferences({
    type: [problemNumbers("check", 2, [1])], practice: [problemNumbers("practice", 1, [12])]
  }),
  "gakuro-card-rectangle-placement": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])], type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [13, 16])]
  }),
  "gakuro-card-irregular-placement": stageReferences({
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [10, 14, 15, 17])], advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "gakuro-grid-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [4])]
  }),
  "gakuro-grid-nine-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [3])], practice: [problemNumbers("practice", 1, [11])]
  }),
  "gakuro-grid-irregular-sum": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
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
    practice: [problemNumbers("practice", 1, [15])]
  }),
  "object-combination-equivalent-count": stageReferences({
    practice: [problemNumbers("practice", 1, [12])]
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
  "equal-line-sum-eight-cards-complete-book3": stageReferences({
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
  "fold-cut-unfold-one-draw": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "fold-cut-unfold-two-draw": stageReferences({
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "fold-number-grid-one": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "fold-number-grid-two-orthogonal": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [4, 5])]
  }),
  "fold-number-grid-two-diagonal": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [6, 7])]
  }),
  "fold-surface-top-trace": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [8, 9, 10, 11])]
  }),
  "cube-count-solid": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [12])]
  }),
  "cube-minimum-from-solid": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "cube-step-sequence": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "cube-hidden-count-walled": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [15])]
  }),
  "cube-hidden-count": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "cube-fill-rectangular-box": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "three-fold-cut-line-book4": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "practice-three-fold-hole-count": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "cube-black-white-alternating": stageReferences({
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "cube-shell-interior-b9": stageReferences({
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

// 6권도 페이지가 아니라 활동·확인·연습·도전의 인쇄 문제 번호를 기준으로 한다.
// 네 단원의 합집합은 159문항이며, 한 문항은 주된 풀이 구조 한 곳에만 배정한다.
const BOOK06_UNIT01_REFS = Object.freeze({
  "number-line-midpoint-book6": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "number-line-unit-distance-book6": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])],
    practice: [problemNumbers("practice", 1, [2, 3])]
  }),
  "number-line-two-part-distance": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5])],
    practice: [problemNumbers("practice", 1, [4, 5])]
  }),
  "rod-difference-measure-count": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [6, 7])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "equivalent-fraction-chain": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "equivalent-ratio-chain": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "bar-ratio-read": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])]
  }),
  "bar-ratio-total-length": stageReferences({
    concept: [problemNumbers("activity", 2, [5, 6])],
    practice: [problemNumbers("practice", 1, [10, 11])]
  }),
  "balance-ratio-book6": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [12])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "balance-weight-ratio": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "symbol-sum-card-deduction": stageReferences({
    type: [problemNumbers("check", 2, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [14, 15])]
  }),
  "stride-ratio-total": stageReferences({
    practice: [problemNumbers("practice", 1, [16])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "repeated-unit-length-total": stageReferences({
    practice: [problemNumbers("practice", 1, [17])],
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

const BOOK06_UNIT02_REFS = Object.freeze({
  "quadrilateral-perimeter": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [2, 3])]
  }),
  "equal-sided-quadrilateral-perimeter": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "joined-quadrilateral-dimensions": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "joined-quadrilateral-side": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "joined-regular-shape-side": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "diagonal-triangle-perimeter": stageReferences({
    concept: [problemNumbers("activity", 1, [6])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "square-composition-side": stageReferences({
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "square-composition-perimeter": stageReferences({
    type: [problemNumbers("check", 1, [2])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "fold-cut-rectangle-perimeter": stageReferences({
    type: [problemNumbers("check", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "rectilinear-route-perimeter": stageReferences({
    concept: [problemNumbers("activity", 2, [1])]
  }),
  "rectilinear-perimeter-book6": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [1, 13, 14])]
  }),
  "concave-perimeter": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5])],
    practice: [problemNumbers("practice", 1, [15, 16, 17])]
  }),
  "grid-cutout-perimeter": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [18])]
  }),
  "polyomino-outer-perimeter": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [19])]
  }),
  "attached-regular-shape-perimeter": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [20])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "perimeter-unit-edge-inverse": stageReferences({
    type: [problemNumbers("check", 2, [4])]
  }),
  "cutout-perimeter-change": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2, 3])]
  }),
  "square-partition-lengths": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "nested-square-perimeter": stageReferences({
    advanced: [problemNumbers("advanced", 1, [5])]
  })
});

const BOOK06_UNIT03_REFS = Object.freeze({
  "napier-multiplication": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "area-model-multiplication": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "round-pair-addition": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "round-pair-missing-addend": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "common-factor-sum": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "near-round-multiplication": stageReferences({
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "near-round-addition": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "inclusive-range-count": stageReferences({
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "consecutive-sum-even-count": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [10, 11])]
  }),
  "consecutive-sum-odd-count": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [12, 13])]
  }),
  "nth-even-odd": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "even-odd-position": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [15])]
  }),
  "facing-page-number": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [16, 17])]
  }),
  "alternating-pair-sum": stageReferences({
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "common-factor-missing-term": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "consecutive-numbers-from-sum": stageReferences({
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  }),
  "newspaper-page-pair": stageReferences({
    practice: [problemNumbers("practice", 1, [18, 19])],
    advanced: [problemNumbers("advanced", 1, [5, 6])]
  })
});

const BOOK06_UNIT04_REFS = Object.freeze({
  "range-number-digit-count": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "total-written-digits": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "digit-occurrence-count": stageReferences({
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "digit-exclusion-count": stageReferences({
    type: [problemNumbers("check", 1, [2])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "consecutive-sign-insertion": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [7, 8])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "odd-sequence-sign-insertion": stageReferences({
    concept: [problemNumbers("activity", 2, [5])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "doubling-sequence-sign-insertion": stageReferences({
    concept: [problemNumbers("activity", 2, [6])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "plus-concatenation-evaluate": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "plus-concatenation-target": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [12])]
  }),
  "mixed-sign-concatenation": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "remove-plus-concatenation": stageReferences({
    type: [problemNumbers("check", 2, [4])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "last-number-from-digit-total": stageReferences({
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "repeated-digit-concatenation": stageReferences({
    advanced: [problemNumbers("advanced", 1, [4])]
  })
});

// 7권은 교사용 지도서의 정답 표기와 수업용 교재의 인쇄 문제 번호를 함께 대조했다.
// 설명 예시를 제외하고 현재 권의 활동·확인·연습·도전 180문항만 한 유형에 한 번씩 배정한다.
// 책 뒤 리뷰는 이 집계와 분리해 6권 유형의 재출제 근거로 연결한다.
const BOOK07_UNIT01_REFS = Object.freeze({
  "calendar-month-shift-weekday-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [2, 3])]
  }),
  "calendar-cross-month-weekday-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4, 5, 6])],
    type: [problemNumbers("check", 1, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [4, 5, 6, 7, 8])]
  }),
  "weekday-after-days-b7": stageReferences({ practice: [problemNumbers("practice", 1, [1])] }),
  "time-unit-conversion-b7": stageReferences({ practice: [problemNumbers("practice", 1, [9])] }),
  "analog-clock-reading-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "elapsed-time-analog-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [2, 3])],
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [11, 12, 15, 16])]
  }),
  "time-add-subtract-base60-b7": stageReferences({ concept: [problemNumbers("activity", 2, [4])] }),
  "find-end-time-b7": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "find-start-time-b7": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "consecutive-full-month-reverse-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "leap-year-cross-month-weekday-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "mirror-clock-reading-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "mirror-clock-elapsed-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "mirror-symmetric-clock-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] })
});

const BOOK07_UNIT02_REFS = Object.freeze({
  "arithmetic-sequence-nth-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "shared-polygon-matchsticks-b7": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "division-fill-long-form-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "reverse-linear-equation-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "arithmetic-sequence-position-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "sparse-arithmetic-sequence-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [6])],
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [9, 12, 13])]
  }),
  "indexed-arithmetic-sequence-b7": stageReferences({
    type: [problemNumbers("check", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [2, 10, 11])]
  }),
  "two-leg-animal-assumption-b7": stageReferences({
    concept: [problemNumbers("activity", 3, [1, 5])],
    practice: [problemNumbers("practice", 1, [14, 15])]
  }),
  "two-wheel-vehicle-assumption-b7": stageReferences({
    concept: [problemNumbers("activity", 3, [2])],
    practice: [problemNumbers("practice", 1, [18])]
  }),
  "two-card-value-assumption-b7": stageReferences({
    concept: [problemNumbers("activity", 3, [3])],
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "two-score-value-assumption-b7": stageReferences({
    concept: [problemNumbers("activity", 3, [4])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "two-coin-value-assumption-b7": stageReferences({
    concept: [problemNumbers("activity", 3, [6])],
    practice: [problemNumbers("practice", 1, [19])]
  }),
  "correct-wrong-score-assumption-b7": stageReferences({
    type: [problemNumbers("check", 3, [1, 2, 3])],
    practice: [problemNumbers("practice", 1, [20, 21])]
  }),
  "constant-step-object-growth-b7": stageReferences({ practice: [problemNumbers("practice", 1, [4])] }),
  "bounded-symbol-sum-extrema-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "win-loss-net-zero-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "shared-consumption-assumption-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "count-difference-assumption-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "linked-sequence-correspondence-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] })
});

const BOOK07_UNIT03_REFS = Object.freeze({
  "climb-slip-days-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2, 3])]
  }),
  "exchange-container-total-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [4, 5, 6])]
  }),
  "reverse-doubling-target-day-b7": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "doubling-fraction-start-count-b7": stageReferences({ type: [problemNumbers("check", 1, [3])] }),
  "doubling-start-count-b7": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "doubling-half-full-day-b7": stageReferences({
    type: [problemNumbers("check", 1, [6])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "doubling-two-start-earlier-b7": stageReferences({
    type: [problemNumbers("check", 1, [5])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "polygon-border-point-count-b7": stageReferences({ concept: [problemNumbers("activity", 2, [1, 3, 5])] }),
  "polygon-border-side-count-inverse-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [2, 4, 6])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "polygon-stakes-from-side-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [7])],
    practice: [problemNumbers("practice", 1, [13])]
  }),
  "closed-perimeter-object-count-b7": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "closed-perimeter-from-spacing-count-b7": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [15, 18])]
  }),
  "between-objects-subdivision-count-b7": stageReferences({
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [16, 17])]
  }),
  "perimeter-capacity-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "between-object-perimeter-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "inner-outer-path-object-count-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "polygon-border-shape-conversion-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] })
});

const BOOK07_UNIT04_REFS = Object.freeze({
  "palindrome-length-count-b7": stageReferences({ concept: [problemNumbers("activity", 1, [1])] }),
  "three-digit-palindrome-digit-sum-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 3])],
    practice: [problemNumbers("practice", 1, [3, 4])]
  }),
  "calendar-date-palindrome-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "clock-time-palindrome-b7": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "reversed-two-digit-difference-enumeration-b7": stageReferences({ type: [problemNumbers("check", 1, [1])] }),
  "reversed-two-digit-difference-extreme-b7": stageReferences({
    type: [problemNumbers("check", 1, [2, 3])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "reversed-digit-given-tens-b7": stageReferences({
    type: [problemNumbers("check", 1, [4, 5])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "reversed-digit-pair-range-b7": stageReferences({
    type: [problemNumbers("check", 1, [6, 7])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "four-point-distance-chain-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [12])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "venn-overlap-all-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [2, 3])],
    practice: [problemNumbers("practice", 1, [13, 14])]
  }),
  "venn-union-total-b7": stageReferences({
    concept: [problemNumbers("activity", 2, [4, 5])],
    practice: [problemNumbers("practice", 1, [15, 16])]
  }),
  "venn-exactly-one-b7": stageReferences({ type: [problemNumbers("check", 2, [1])] }),
  "venn-neither-b7": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [18])]
  }),
  "venn-overlap-with-neither-b7": stageReferences({ practice: [problemNumbers("practice", 1, [17])] }),
  "two-way-table-count-b7": stageReferences({
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [20])]
  }),
  "palindrome-adjacent-digit-difference-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "complement-groups-total-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "four-group-complement-total-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "reverse-add-palindrome-b7": stageReferences({
    practice: [problemNumbers("practice", 1, [1, 2])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "minimum-stone-moves-b7": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] }),
  "kaprekar-495-b7": stageReferences({ practice: [problemNumbers("practice", 1, [11])] }),
  "three-circle-equal-sum-b7": stageReferences({ practice: [problemNumbers("practice", 1, [19])] })
});

const BOOK08_UNIT01_REFS = Object.freeze({
  "balance-difference-deduction-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1, 3])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "overlap-circle-sum-b8": stageReferences({ practice: [problemNumbers("practice", 1, [2])] }),
  "symbol-additive-chain-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [2, 4])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "addition-matrix-target-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    type: [problemNumbers("check", 1, [1, 3])],
    practice: [problemNumbers("practice", 1, [4, 6])]
  }),
  "addition-matrix-complete-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    type: [problemNumbers("check", 1, [2, 4])],
    practice: [problemNumbers("practice", 1, [5, 7])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "symbol-operation-deduction-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [8, 9, 10, 11])]
  }),
  "symbol-cross-equation-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [12, 13, 15])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "multiplication-matrix-products": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "multiplication-matrix-placement": stageReferences({
    type: [problemNumbers("check", 2, [2, 3])],
    practice: [problemNumbers("practice", 1, [16, 17])]
  }),
  "conditional-symbol-chain-b8": stageReferences({ practice: [problemNumbers("practice", 1, [18])] }),
  "conditional-two-digit-symbol-b8": stageReferences({ practice: [problemNumbers("practice", 1, [19])] }),
  "cyclic-pair-sums-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] })
});

const BOOK08_UNIT02_REFS = Object.freeze({
  "pyramid-cryptarithm-b8": stageReferences({ concept: [problemNumbers("activity", 1, [1, 2, 3, 4])] }),
  "blank-digit-vertical-addition-b8": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "all-digits-once-cryptarithm-b8": stageReferences({
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [9])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "ordered-symbol-cryptarithm-b8": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [10])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "repeated-symbol-cryptarithm-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2, 13, 14, 15, 16, 17, 18])]
  }),
  "multi-symbol-cryptarithm-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5, 6])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4, 5, 6])]
  }),
  "doubled-symbol-result-b8": stageReferences({ practice: [problemNumbers("practice", 1, [11, 12])] }),
  "letter-pyramid-cryptarithm-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "repeated-number-multiple-answers-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "linked-cryptarithm-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "subtract-to-repeated-number-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] })
});

const BOOK08_UNIT03_REFS = Object.freeze({
  "equalize-transfer-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    type: [problemNumbers("check", 1, [3])],
    practice: [problemNumbers("practice", 1, [1, 10])]
  }),
  "chained-equalize-transfer-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "total-difference-bars-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [3, 4, 5, 6])]
  }),
  "future-age-sum-b8": stageReferences({
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "table-total-difference-b8": stageReferences({
    type: [problemNumbers("check", 1, [2])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "reverse-transfer-three-b8": stageReferences({
    type: [problemNumbers("check", 1, [4])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "sum-multiple-bars-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "difference-multiple-bars-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [13, 14])]
  }),
  "sum-multiple-offset-b8": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [15, 16, 17, 18])]
  }),
  "three-person-difference-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [1, 2])] }),
  "transfer-to-multiple-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [3, 4])] }),
  "conditional-three-share-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "reverse-double-offset-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] })
});

const BOOK08_UNIT04_REFS = Object.freeze({
  "reverse-arithmetic-chain-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1, 3, 4])]
  }),
  "reverse-transfer-events-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "reverse-multiply-divide-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "reverse-split-equal-b8": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [6])]
  }),
  "give-as-much-once-b8": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "give-as-much-return-b8": stageReferences({
    type: [problemNumbers("check", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [9, 10])]
  }),
  "shaded-fraction-count-b8": stageReferences({ practice: [problemNumbers("practice", 1, [11])] }),
  "fraction-given-away-original-b8": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [12, 13, 14, 15])]
  }),
  "sequential-fraction-remains-b8": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "fraction-difference-whole-b8": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "fraction-share-difference-b8": stageReferences({
    type: [problemNumbers("check", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [18, 19])]
  }),
  "reverse-two-container-transfers-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "three-container-condition-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "sequential-fraction-consumption-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "fraction-subgroup-count-b8": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] })
});

const BOOK09_UNIT01_REFS = Object.freeze({
  "rotational-partition-two": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    type: [problemNumbers("check", 1, [2])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "rotational-partition-four": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 6, 7])],
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [9, 10])]
  }),
  "symbol-balanced-congruent-partition": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [6, 7])],
    advanced: [problemNumbers("advanced", 1, [3, 4])]
  }),
  "latin-square-congruent-partition-b9": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "equal-sum-congruent-partition-b9": stageReferences({
    concept: [problemNumbers("activity", 1, [5])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "congruent-composite-partition-b9": stageReferences({ practice: [problemNumbers("practice", 1, [8])] }),
  "triangle-equal-subdivision-b9": stageReferences({ type: [problemNumbers("check", 1, [3])] }),
  "hexagon-equal-subdivision-b9": stageReferences({
    type: [problemNumbers("check", 1, [4, 5])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "landmark-congruent-partition-b9": stageReferences({
    practice: [problemNumbers("practice", 1, [4])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "tetromino-cover-count-b9": stageReferences({ practice: [problemNumbers("practice", 1, [5])] }),
  "unit-grid-area": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [13, 14])]
  }),
  "oblique-square-grid-area": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [19])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "quadrilateral-grid-area-b9": stageReferences({
    concept: [problemNumbers("activity", 2, [4])],
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [15, 16])]
  }),
  "shaded-composite-grid-area-b9": stageReferences({
    concept: [problemNumbers("activity", 2, [5, 6])],
    type: [problemNumbers("check", 2, [4])],
    practice: [problemNumbers("practice", 1, [17, 18, 20, 22])],
    advanced: [problemNumbers("advanced", 1, [6])]
  }),
  "parallelogram-grid-area-b9": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [21])]
  })
});

const BOOK09_UNIT02_REFS = Object.freeze({
  "cube-count-solid": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "cube-fill-rectangular-box": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "cube-hidden-count-walled": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "cube-hidden-count": stageReferences({ practice: [problemNumbers("practice", 1, [4])] }),
  "cube-solid-to-views-b9": stageReferences({
    concept: [problemNumbers("activity", 1, [4, 5])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "cube-top-number-grid": stageReferences({
    type: [problemNumbers("check", 1, [1])],
    practice: [problemNumbers("practice", 1, [7])]
  }),
  "cube-missing-view": stageReferences({
    type: [problemNumbers("check", 1, [2, 3])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "cube-layer-views-b9": stageReferences({
    type: [problemNumbers("check", 1, [4, 5])],
    practice: [problemNumbers("practice", 1, [9, 10])]
  }),
  "cube-three-views": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [11, 12])]
  }),
  "cube-three-view-minmax": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4, 5])],
    practice: [problemNumbers("practice", 1, [13, 14])],
    advanced: [problemNumbers("advanced", 1, [1, 2])]
  }),
  "cube-fill-box": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "cube-black-white-alternating": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "cube-shell-interior-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "cube-view-model-choice-b9": stageReferences({ practice: [problemNumbers("practice", 1, [6])] })
});

const BOOK09_UNIT03_REFS = Object.freeze({
  "magic-square-three-complete": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "magic-square-three-target": stageReferences({ concept: [problemNumbers("activity", 1, [3])] }),
  "magic-square-four-pair-sum-b9": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "magic-square-swap-pair-b9": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "triangle-edge-extreme-six-b9": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [8])]
  }),
  "triangle-edge-sum-six": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [9])]
  }),
  "triangle-edge-extreme-nine-b9": stageReferences({
    concept: [problemNumbers("activity", 2, [3])],
    practice: [problemNumbers("practice", 1, [10, 11])]
  }),
  "triangle-edge-sum-nine": stageReferences({ concept: [problemNumbers("activity", 2, [4])] }),
  "polygon-ring-equal-sum": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [12, 13])]
  }),
  "heptagon-ring-equal-sum-b9": stageReferences({
    type: [problemNumbers("check", 2, [2])],
    practice: [problemNumbers("practice", 1, [14])]
  }),
  "overlap-region-equal-sum-b9": stageReferences({
    practice: [problemNumbers("practice", 1, [15])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "circle-line-ring-equal-sum": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "grid-line-sum-minimum-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "circle-chain-equal-sum-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "triangle-line-equal-sum-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "magic-square-four-target": stageReferences({ practice: [problemNumbers("practice", 1, [2])] }),
  "magic-square-four-complete": stageReferences({ practice: [problemNumbers("practice", 1, [3])] }),
  "circular-magic-line-sum": stageReferences({ practice: [problemNumbers("practice", 1, [6])] }),
  "circular-magic-maximum-b9": stageReferences({ practice: [problemNumbers("practice", 1, [7])] })
});

const BOOK09_UNIT04_REFS = Object.freeze({
  "shape-difference-chain": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [1, 2])]
  }),
  "measurement-order-chain": stageReferences({
    concept: [problemNumbers("activity", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [3, 4])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "fixed-value-order-assignment-b9": stageReferences({
    concept: [problemNumbers("activity", 1, [5, 6])],
    practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "ordinal-line-placement": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [10])]
  }),
  "line-ranking-constraints-b9": stageReferences({
    type: [problemNumbers("check", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [7, 8, 9, 11, 12])]
  }),
  "circular-seat-placement": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [13, 14, 16])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "exclusion-grid-ranking-b9": stageReferences({ concept: [problemNumbers("activity", 2, [3])] }),
  "exact-one-ranking-predictions-b9": stageReferences({
    type: [problemNumbers("check", 2, [1])],
    practice: [problemNumbers("practice", 1, [19, 20])]
  }),
  "exact-one-answer-assignment-b9": stageReferences({ type: [problemNumbers("check", 2, [2])] }),
  "pair-group-inference-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "all-false-circular-seating-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "preference-count-matrix-b9": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "apartment-neighbor-logic-b9": stageReferences({ practice: [problemNumbers("practice", 1, [15])] }),
  "profession-assignment-b9": stageReferences({ practice: [problemNumbers("practice", 1, [17])] }),
  "activity-enrollment-b9": stageReferences({ practice: [problemNumbers("practice", 1, [18])] })
});

const BOOK10_UNIT01_REFS = Object.freeze({
  "napier-multiplication": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1])]
  }),
  "area-model-multiplication": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [2])]
  }),
  "multi-method-multiplication-b10": stageReferences({ concept: [problemNumbers("activity", 1, [3])] }),
  "same-tens-complement-product-b10": stageReferences({
    type: [problemNumbers("check", 1, [1, 2])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "same-ones-complement-product-b10": stageReferences({
    type: [problemNumbers("check", 1, [3, 4])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "factor-pair-divisor-count-b10": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [5, 6])]
  }),
  "consecutive-sum-even-count": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [7, 8])]
  }),
  "consecutive-sum-odd-count": stageReferences({
    concept: [problemNumbers("activity", 3, [1, 2])],
    practice: [problemNumbers("practice", 1, [15, 16])]
  }),
  "consecutive-numbers-from-sum": stageReferences({
    concept: [problemNumbers("activity", 2, [5, 6]), problemNumbers("activity", 3, [3, 4, 5])],
    type: [problemNumbers("check", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [9, 10, 11, 17, 18, 19])]
  }),
  "multi-count-consecutive-decomposition-b10": stageReferences({
    concept: [problemNumbers("activity", 3, [6])],
    practice: [problemNumbers("practice", 1, [12, 20, 26])]
  }),
  "calendar-consecutive-sum-weekday-b10": stageReferences({
    concept: [problemNumbers("activity", 3, [7])],
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [13, 21])]
  }),
  "consecutive-page-range-b10": stageReferences({
    concept: [problemNumbers("activity", 3, [8])],
    type: [problemNumbers("check", 2, [4])],
    practice: [problemNumbers("practice", 1, [14, 22])]
  }),
  "same-parity-consecutive-sum-b10": stageReferences({
    type: [problemNumbers("check", 3, [1])],
    practice: [problemNumbers("practice", 1, [23])]
  }),
  "rectangular-number-grid-sum-b10": stageReferences({ type: [problemNumbers("check", 3, [2])] }),
  "shaped-number-grid-sum-b10": stageReferences({
    type: [problemNumbers("check", 3, [3])],
    practice: [problemNumbers("practice", 1, [24])],
    advanced: [problemNumbers("advanced", 1, [2])]
  }),
  "calendar-block-sum-b10": stageReferences({
    type: [problemNumbers("check", 3, [4])],
    practice: [problemNumbers("practice", 1, [25])]
  }),
  "g1-odd-even-sum-difference": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "all-consecutive-decompositions-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [3, 4])] }),
  "consecutive-tens-digit-condition-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [5])] }),
  "consecutive-vertical-addition-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [6])] })
});

const BOOK10_UNIT02_REFS = Object.freeze({
  "two-symbol-coefficient-weight-b10": stageReferences({
    concept: [problemNumbers("activity", 1, [1])],
    practice: [problemNumbers("practice", 1, [1, 2])],
    advanced: [problemNumbers("advanced", 1, [1])]
  }),
  "two-symbol-score-difference-b10": stageReferences({
    concept: [problemNumbers("activity", 1, [2])],
    practice: [problemNumbers("practice", 1, [3])]
  }),
  "shared-term-equation-b10": stageReferences({
    concept: [problemNumbers("activity", 1, [3])],
    practice: [problemNumbers("practice", 1, [4])]
  }),
  "container-double-content-b10": stageReferences({
    concept: [problemNumbers("activity", 1, [4])],
    practice: [problemNumbers("practice", 1, [5])]
  }),
  "three-pair-sums-values-b10": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [6, 7, 8, 9])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "closed-perimeter-spacing-difference-b10": stageReferences({
    concept: [problemNumbers("activity", 2, [1])],
    practice: [problemNumbers("practice", 1, [10])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "same-budget-price-count-b10": stageReferences({
    concept: [problemNumbers("activity", 2, [2])],
    practice: [problemNumbers("practice", 1, [11])]
  }),
  "new-participants-equal-share-b10": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4])],
    practice: [problemNumbers("practice", 1, [12, 13])]
  }),
  "catch-up-growing-amount-b10": stageReferences({
    type: [problemNumbers("check", 2, [1, 2])],
    practice: [problemNumbers("practice", 1, [14, 15])]
  }),
  "catch-up-shrinking-amount-b10": stageReferences({
    type: [problemNumbers("check", 2, [3])],
    practice: [problemNumbers("practice", 1, [16])]
  }),
  "catch-up-distance-b10": stageReferences({
    type: [problemNumbers("check", 2, [4])],
    practice: [problemNumbers("practice", 1, [17])]
  }),
  "four-object-weight-system-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "delayed-start-catch-up-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] })
});

const BOOK10_UNIT03_REFS = Object.freeze({
  "digit-card-number-enumeration": stageReferences({ concept: [problemNumbers("activity", 1, [1, 2, 3, 4, 5, 6, 7, 8])], practice: [problemNumbers("practice", 1, [3, 4, 5, 6])] }),
  "repeated-digit-number-count-b10": stageReferences({ type: [problemNumbers("check", 1, [1, 2])], practice: [problemNumbers("practice", 1, [7, 8])] }),
  "binary-switch-count-b10": stageReferences({ type: [problemNumbers("check", 1, [3, 4])], practice: [problemNumbers("practice", 1, [9, 10])] }),
  "monotone-digit-enumeration-b10": stageReferences({ concept: [problemNumbers("activity", 2, [1, 2])], practice: [problemNumbers("practice", 1, [11, 12, 13])] }),
  "monotone-digit-rank-b10": stageReferences({ concept: [problemNumbers("activity", 2, [3])] }),
  "distinct-card-target-sum-b10": stageReferences({
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [14, 15, 16])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "digit-sum-three-digit-count-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [1])] }),
  "digit-sum-ranked-number-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [2])] }),
  "three-digit-step-count-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [3])] }),
  "monotone-digit-count-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [4])] }),
  "route-product-count-b10": stageReferences({ practice: [problemNumbers("practice", 1, [1])] }),
  "lineup-count-b10": stageReferences({ practice: [problemNumbers("practice", 1, [2])] })
});

const BOOK10_UNIT04_REFS = Object.freeze({
  "number-baseball-b10": stageReferences({
    concept: [problemNumbers("activity", 1, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [1, 2, 3, 4])],
    advanced: [problemNumbers("advanced", 1, [5])]
  }),
  "digit-occurrence-count": stageReferences({
    type: [problemNumbers("check", 1, [1, 2, 4])],
    practice: [problemNumbers("practice", 1, [5, 6, 7, 8])]
  }),
  "most-frequent-digit-b10": stageReferences({ type: [problemNumbers("check", 1, [3])] }),
  "total-written-digits": stageReferences({
    concept: [problemNumbers("activity", 2, [1, 2])],
    type: [problemNumbers("check", 2, [1, 2, 3, 4])],
    practice: [problemNumbers("practice", 1, [10, 11, 12, 17, 18, 19, 20])],
    advanced: [problemNumbers("advanced", 1, [3])]
  }),
  "last-number-from-digit-total": stageReferences({
    concept: [problemNumbers("activity", 2, [3, 4, 5, 6])],
    practice: [problemNumbers("practice", 1, [13, 14, 15, 16])],
    advanced: [problemNumbers("advanced", 1, [4])]
  }),
  "digit-occurrence-range-b10": stageReferences({ advanced: [problemNumbers("advanced", 1, [1, 2])] }),
  "positive-range-number-digit-count-b10": stageReferences({ practice: [problemNumbers("practice", 1, [9])] })
});

const reviewQuestionLinks = (rows) => Object.freeze(rows.flatMap(([group, numbers, typeId]) =>
  numbers.map((number) => Object.freeze({ group, number, typeId }))
));

export const CURRICULUM_REVIEW_CROSSWALK = Object.freeze({
  "book-02": Object.freeze({
    sourceBookId: "book-01",
    verified: true,
    links: reviewQuestionLinks([
      [1, [1], "shape-mirror-direction"],
      [1, [2, 3], "shape-quarter-half-turn"],
      [1, [4, 10], "symbol-balanced-congruent-partition"],
      [1, [5], "digital-digit-transform"],
      [1, [6, 7], "digital-two-digit-transform"],
      [1, [8], "digital-transform-board-sum"],
      [1, [9], "rotational-partition-two"],
      [2, [1, 4, 5], "fold-cut-shape-choice"],
      [2, [2, 3, 6], "fold-number-cut-sum-textbook"],
      [2, [7], "fold-punch-shape-count"],
      [2, [8], "fold-hole-count"],
      [2, [9], "fold-cut-piece-count"],
      [3, [1], "circular-magic-line-sum"],
      [3, [2, 3], "cross-shape-magic-sum"],
      [3, [4], "equal-line-sum-eight-cards"],
      [3, [5], "triangle-edge-sum-six"],
      [3, [6, 7], "gakuro-grid-sum"],
      [3, [8], "circle-line-ring-equal-sum"],
      [4, [1, 2], "two-digit-condition"],
      [4, [3, 4], "place-value-condition-three"],
      [4, [5, 9], "person-item-logic"],
      [4, [6, 7], "relative-order-logic"],
      [4, [8], "place-value-condition-four"]
    ])
  }),
  "book-03": Object.freeze({
    sourceBookId: "book-02",
    verified: true,
    links: reviewQuestionLinks([
      [1, [1], "equal-partition-four"],
      [1, [2], "equal-partition-three"],
      [1, [3, 4, 5, 10], "shape-sum-table"],
      [1, [6], "equalize-transfer"],
      [1, [7, 8, 9], "total-difference"],
      [2, [1], "balance-order-chain"],
      [2, [2, 3, 4], "balance-given-unit-weight"],
      [2, [5, 6, 7, 8, 9, 10], "distinct-shape-value-equation"],
      [3, [1], "interleaved-number-sequence"],
      [3, [2, 3], "repeating-symbol-sequence"],
      [3, [4], "square-border-stone-growth"],
      [3, [5], "matchstick-shared-polygon-growth"],
      [3, [6], "staircase-tile-growth"],
      [3, [7], "repeated-fold-cut-count"],
      [3, [8], "triangular-stone-growth"],
      [4, [1, 8], "four-number-center-rule"],
      [4, [2, 4], "number-grid-row-rule"],
      [4, [3], "two-digit-compose-rule"],
      [4, [5], "sudoku-three-row-column"],
      [4, [6], "sudoku-three-region"],
      [4, [7], "sudoku-four-square-region"],
      [4, [9], "sudoku-four-irregular-region"]
    ])
  })
});

const CURRICULUM_UNIT_TEST_QUESTIONS = Object.freeze({
  "book-03": Object.freeze([
    { number: 1, typeId: "unit-grid-area", label: "모눈 도형의 넓이", verified: true, difficulty: 2 },
    { number: 2, typeId: "nested-square-outer-area", label: "커지는 정사각형 넓이의 합", verified: true, difficulty: 1 },
    { number: 3, typeId: "equal-part-shaded-fraction", label: "같은 조각으로 나타낸 분수", verified: false, difficulty: 2 },
    { number: 4, typeId: "incomplete-partition-fraction", label: "도형 분할과 분수", verified: false, difficulty: 2 },
    { number: 5, typeId: "incomplete-partition-fraction", label: "도형 분할과 분수", verified: false, difficulty: 2 },
    { number: 6, typeId: "folded-strip-length", label: "접힌 리본의 전체 길이", verified: true, difficulty: 2 },
    { number: 7, typeId: "midpoint-number-line", label: "두 수의 중간수", verified: true, difficulty: 2 },
    { number: 8, typeId: "segment-chain-distance", label: "A·B·C·D 사이의 거리", verified: true, difficulty: 2 },
    { number: 9, typeId: "rod-comparison-total-unit-test", label: "막대의 배수 관계와 전체 길이", verified: true, difficulty: 2 },
    { number: 10, typeId: "overlapping-rod-common-unit-test", label: "어긋나게 놓은 막대의 길이", verified: true, difficulty: 2 },
    { number: 11, typeId: "equal-interval-length", label: "똑같이 나눈 한 칸의 거리", verified: true, difficulty: 2 },
    { number: 12, typeId: "difference-unit-measure", label: "두 단위길이의 차", verified: true, difficulty: 2 },
    { number: 13, typeId: "cryptarithm-unit-test-q13", label: "두 자리 두 수의 도형 복면산", verified: true, difficulty: 2 },
    { number: 14, typeId: "cryptarithm-unit-test-q14", label: "같은 도형 세 자리 복면산", verified: true, difficulty: 2 },
    { number: 15, typeId: "cryptarithm-unit-test-q15", label: "다섯 도형 네 자리 복면산", verified: true, difficulty: 3 },
    { number: 16, typeId: "cryptarithm-missing-digit-column", label: "두 도형 세로 덧셈", verified: true, difficulty: 2 },
    { number: 17, typeId: "cryptarithm-missing-digit-column", label: "같은 두 자리 수 세 번 더하기", verified: true, difficulty: 3 },
    { number: 18, typeId: "cryptarithm-linked-equations", label: "이어진 복면산", verified: true, difficulty: 3 },
    { number: 19, typeId: "symbol-value-code-unit-test", label: "도형 묶음의 비밀 수", verified: true, difficulty: 2 },
    { number: 20, typeId: "magic-square-three-complete", label: "3×3 마방진 완성", verified: true, difficulty: 2 },
    { number: 21, typeId: "magic-square-four-target", label: "4×4 마방진의 한 칸", verified: true, difficulty: 2 },
    { number: 22, typeId: "polygon-ring-equal-sum", label: "오각진의 같은 합", verified: true, difficulty: 2 },
    { number: 23, typeId: "four-cell-binary-code", label: "네 칸 색칠의 비밀 수", verified: true, difficulty: 2 },
    { number: 24, typeId: "triangle-max-edge-sum", label: "삼각형 세 변의 합", verified: true, difficulty: 2 },
    { number: 25, typeId: "number-line-six-points", label: "여섯 점 사이의 거리", verified: true, difficulty: 2 }
  ]),
  "book-04": Object.freeze([
    { number: 1, typeId: "star-congruent-partition-draw-book4", label: "별을 하나씩 가진 네 합동 도형", verified: true, difficulty: 2 },
    { number: 2, typeId: "forest-congruent-partition-draw-book4", label: "나무를 하나씩 가진 네 합동 영역", verified: true, difficulty: 2 },
    { number: 3, typeId: "digital-grid-upright-after-moves", label: "숫자판을 두 번 뒤집은 뒤 똑바른 수", verified: true, difficulty: 2 },
    { number: 4, typeId: "digital-self-half-turn-calculation", label: "두 자리 수와 반 바퀴 돌린 수 계산", verified: true, difficulty: 2 },
    { number: 5, typeId: "rotational-partition-two", label: "두 개의 같은 테트로미노로 나누기", verified: true, difficulty: 2 },
    { number: 6, typeId: "fold-number-grid-two-orthogonal", label: "가로·세로로 두 번 접어 자른 수의 합", verified: true, difficulty: 2 },
    { number: 7, typeId: "overlapping-paper-bottom", label: "겹친 색종이의 가장 밑 찾기", verified: true, difficulty: 2 },
    { number: 8, typeId: "cube-count-solid", label: "입체 그림의 쌓기나무 개수", verified: true, difficulty: 2 },
    { number: 9, typeId: "cube-fill-rectangular-box", label: "직육면체 상자에 더 필요한 쌓기나무", verified: true, difficulty: 3 },
    { number: 10, typeId: "shape-difference-chain", label: "도형 사이의 차 이어 구하기", verified: true, difficulty: 2 },
    { number: 11, typeId: "measurement-age-difference-book4", label: "나이 차를 이어 두 사람의 차 구하기", verified: true, difficulty: 2 },
    { number: 12, typeId: "measurement-distance-difference-book4", label: "앞뒤 거리 차를 이어 구하기", verified: true, difficulty: 2 },
    { number: 13, typeId: "balance-unit-ratio", label: "세 저울을 이어 같은 무게 구하기", verified: true, difficulty: 2 },
    { number: 14, typeId: "balance-unit-ratio", label: "여러 물건 저울 관계 이어 구하기", verified: true, difficulty: 3 },
    { number: 15, typeId: "race-third-place-book4", label: "달리기 시합의 세 번째 사람", verified: true, difficulty: 2 },
    { number: 16, typeId: "directional-landmark-placement-book4", label: "동서남북 조건으로 장소 찾기", verified: true, difficulty: 2 },
    { number: 17, typeId: "circular-seat-blank-book4", label: "원탁의 표시한 자리에 앉은 사람", verified: true, difficulty: 2 },
    { number: 18, typeId: "g1-front-back-between", label: "앞과 뒤의 순서로 사이 사람 수", verified: true, difficulty: 2 },
    { number: 19, typeId: "digital-grid-upright-after-moves", label: "숫자판을 움직인 뒤 똑바른 수", verified: true, difficulty: 3 },
    { number: 20, typeId: "cube-shell-interior-b9", label: "겉면을 걷어 낸 안쪽 쌓기나무", verified: true, difficulty: 2 },
    { number: 21, typeId: "three-fold-cut-line-book4", label: "세 번 접어 자른 선 펼치기", verified: true, difficulty: 2 },
    { number: 22, typeId: "balance-unit-ratio", label: "저울 관계로 같은 무게 개수 구하기", verified: true, difficulty: 2 },
    { number: 23, typeId: "measurement-time-difference-book4", label: "들어온 시각 차 이어 구하기", verified: true, difficulty: 2 },
    { number: 24, typeId: "circular-seat-blank-book4", label: "원탁 조건으로 표시한 자리 찾기", verified: true, difficulty: 2 },
    { number: 25, typeId: "front-back-two-order-totals-book4", label: "앞선 순서가 다른 두 경우의 전체 인원", verified: true, difficulty: 2 }
  ]),
  "book-05": Object.freeze([
    { number: 1, typeId: "row-major-grid-two-target-sum-book5", label: "가로 수 배열의 두 빈칸 합", verified: true, difficulty: 2 },
    { number: 2, typeId: "radial-line-cycle-two-part-book5", label: "여러 줄 순환 수의 값과 자리", verified: true, difficulty: 2 },
    { number: 3, typeId: "calendar-weekday-list-ordinal-book5", label: "같은 요일 날짜와 몇 번째 요일", verified: true, difficulty: 2 },
    { number: 4, typeId: "calendar-special-date-offset-book5", label: "알려진 날짜로 다른 날짜 요일 찾기", verified: true, difficulty: 2 },
    { number: 5, typeId: "calendar-weekday-sum-year-boundary-book5", label: "날짜 합으로 다음 해 1월 1일 찾기", verified: true, difficulty: 2 },
    { number: 6, typeId: "shortest-path-rectangle", label: "직사각형 길의 최단거리", verified: true, difficulty: 2 },
    { number: 7, typeId: "shortest-path-via-waypoint", label: "정해진 점을 지나는 최단거리", verified: true, difficulty: 2 },
    { number: 8, typeId: "shortest-path-diagonal-shortcut-book5", label: "사선 지름길이 있는 최단거리", verified: true, difficulty: 2 },
    { number: 9, typeId: "digit-card-ranked-number", label: "숫자 카드로 만든 수의 크기 순서", verified: true, difficulty: 2 },
    { number: 10, typeId: "two-digit-digit-sum-rank", label: "자리 숫자의 합과 크기 순서", verified: true, difficulty: 2 },
    { number: 11, typeId: "square-product-cycle-fill-book5", label: "사각형 네 꼭짓점 수 채우기", verified: true, difficulty: 2 },
    { number: 12, typeId: "checkerboard-product-matrix-book5", label: "4×4 엇갈린 칸의 곱 맞추기", verified: true, difficulty: 2 },
    { number: 13, typeId: "symbol-zero-one-network-book5", label: "0부터 4까지 도형 곱셈식", verified: true, difficulty: 2 },
    { number: 14, typeId: "symbol-cross-network-book5", label: "여섯 수 카드의 교차 도형식", verified: true, difficulty: 2 },
    { number: 15, typeId: "symbol-square-product-network-book5", label: "같은 도형끼리 곱한 도형식", verified: true, difficulty: 2 },
    { number: 16, typeId: "pair-selection-count", label: "다섯 명에서 두 명 고르기", verified: true, difficulty: 2 },
    { number: 17, typeId: "inverse-pair-count", label: "악수 횟수로 사람 수 찾기", verified: true, difficulty: 2 },
    { number: 18, typeId: "pair-selection-count", label: "일곱 수 카드에서 두 장 고르기", verified: true, difficulty: 2 },
    { number: 19, typeId: "square-paper-growth-book5", label: "정사각형 색종이 배열 규칙", verified: true, difficulty: 2 },
    { number: 20, typeId: "square-row-two-boundaries-book5", label: "두 줄의 처음과 끝 수", verified: true, difficulty: 2 },
    { number: 21, typeId: "calendar-ordinal-sum-infer-weekday-book5", label: "몇 번째 요일 날짜의 합으로 1일 찾기", verified: true, difficulty: 2 },
    { number: 22, typeId: "checkerboard-product-matrix-book5", label: "4×4 엇갈린 칸의 곱 맞추기", verified: true, difficulty: 2 },
    { number: 23, typeId: "regular-triangle-grid-count-book5", label: "정삼각형 모눈의 삼각형 세기", verified: true, difficulty: 2 },
    { number: 24, typeId: "two-digit-digit-difference-rank", label: "자리 숫자의 차와 크기 순서", verified: true, difficulty: 2 },
    { number: 25, typeId: "square-border-stone-growth-book5", label: "네모 테두리와 안쪽 바둑돌 차", verified: true, difficulty: 2 }
  ]),
  "book-06": Object.freeze([
    { number: 1, typeId: "midpoint-pair-unit-test-book6", label: "두 수직선의 중간 수", verified: true, difficulty: 2 },
    { number: 2, typeId: "split-target-distance-unit-test-book6", label: "서로 다르게 나눈 수직선의 두 점 거리", verified: true, difficulty: 2 },
    { number: 3, typeId: "rod-difference-ratio-unit-test-book6", label: "두 끈의 차이로 재는 횟수", verified: true, difficulty: 2 },
    { number: 4, typeId: "equal-bar-pieces-unit-test-book6", label: "같은 길이의 조각 수와 두 막대 길이", verified: true, difficulty: 2 },
    { number: 5, typeId: "two-object-weight-unit-test-book6", label: "두 도형의 개수 관계와 각각의 무게", verified: true, difficulty: 2 },
    { number: 6, typeId: "symbol-card-chain-unit-test-book6", label: "다섯 수 카드와 이어진 도형식", verified: true, difficulty: 3 },
    { number: 7, typeId: "rectangle-rhombus-side-unit-test-book6", label: "직사각형에 붙인 마름모 한 변", verified: true, difficulty: 2 },
    { number: 8, typeId: "rectangle-triangle-square-unit-test-book6", label: "세 도형을 붙인 둘레", verified: true, difficulty: 3 },
    { number: 9, typeId: "three-square-shaded-perimeter-unit-test-book6", label: "세 정사각형의 색칠 부분 둘레", verified: true, difficulty: 2 },
    { number: 10, typeId: "scattered-side-perimeter-unit-test-book6", label: "흩어진 변으로 직각 도형 둘레 구하기", verified: true, difficulty: 2 },
    { number: 11, typeId: "square-triangle-strip-unit-test-book6", label: "정사각형과 정삼각형을 붙인 둘레", verified: true, difficulty: 2 },
    { number: 12, typeId: "square-tiling-shaded-unit-test-book6", label: "나눈 정사각형의 색칠 부분 둘레", verified: true, difficulty: 3 },
    { number: 13, typeId: "round-pair-eight-addends-unit-test-book6", label: "여덟 수를 둥근 수로 묶어 더하기", verified: true, difficulty: 2 },
    { number: 14, typeId: "even-odd-position-pair-unit-test-book6", label: "짝수와 홀수의 순서", verified: true, difficulty: 2 },
    { number: 15, typeId: "facing-page-sum-unit-test-book6", label: "마주 보는 쪽수의 합", verified: true, difficulty: 2 },
    { number: 16, typeId: "range-number-digit-pair-unit-test-book6", label: "두 범위의 수 개수와 숫자 개수", verified: true, difficulty: 3 },
    { number: 17, typeId: "consecutive-even-sum-pair-unit-test-book6", label: "개수가 짝수인 연속수의 합", verified: true, difficulty: 2 },
    { number: 18, typeId: "consecutive-odd-sum-pair-unit-test-book6", label: "개수가 홀수인 연속수의 합", verified: true, difficulty: 2 },
    { number: 19, typeId: "sign-insertion-triple-unit-test-book6", label: "같은 네 수로 세 목표값 만들기", verified: true, difficulty: 2 },
    { number: 20, typeId: "consecutive-sign-insertion", label: "이어진 수 사이에 더하기·빼기 넣기", verified: true, difficulty: 2 },
    { number: 21, typeId: "plus-concatenation-pair-unit-test-book6", label: "이어 붙이기로 두 식 만들기", verified: true, difficulty: 2 },
    { number: 22, typeId: "balance-chain-equivalence-unit-test-book6", label: "세 저울의 무게 관계", verified: true, difficulty: 3 },
    { number: 23, typeId: "fold-cut-open-perimeter-unit-test-book6", label: "접어 자른 뒤 처음 둘레", verified: true, difficulty: 3 },
    { number: 24, typeId: "last-number-from-digit-total", label: "쓴 숫자의 개수로 마지막 수 찾기", verified: true, difficulty: 2 },
    { number: 25, typeId: "rod-difference-ratio-unit-test-book6", label: "두 끈의 차이로 재는 횟수", verified: true, difficulty: 2 }
  ]),
  "book-07": Object.freeze([
    { number: 1, typeId: "calendar-month-shift-weekday-b7", label: "다음 달 같은 날짜의 요일", verified: true, difficulty: 2 },
    { number: 2, typeId: "calendar-cross-month-weekday-b7", label: "여러 달 뒤 날짜의 요일", verified: true, difficulty: 2 },
    { number: 3, typeId: "elapsed-time-analog-b7", label: "두 시계 사이의 지난 시간", verified: true, difficulty: 2 },
    { number: 4, typeId: "find-end-time-b7", label: "시작 시각과 걸린 시간으로 끝 시각 찾기", verified: true, difficulty: 2 },
    { number: 5, typeId: "consecutive-full-month-reverse-b7", label: "연속된 큰달의 요일 거꾸로 찾기", verified: true, difficulty: 3 },
    { number: 6, typeId: "arithmetic-sequence-nth-b7", label: "차가 같은 수열의 먼 번째 수", verified: true, difficulty: 2 },
    { number: 7, typeId: "arithmetic-sequence-position-b7", label: "차가 같은 수열의 순서", verified: true, difficulty: 2 },
    { number: 8, typeId: "shared-polygon-matchsticks-b7", label: "맞닿은 정다각형의 성냥개비", verified: true, difficulty: 2 },
    { number: 9, typeId: "two-score-value-assumption-b7", label: "두 점수 문제의 개수", verified: true, difficulty: 2 },
    { number: 10, typeId: "correct-wrong-score-assumption-b7", label: "맞고 틀린 점수로 맞힌 횟수", verified: true, difficulty: 2 },
    { number: 11, typeId: "climb-slip-days-b7", label: "오르고 미끄러지는 날짜", verified: true, difficulty: 2 },
    { number: 12, typeId: "doubling-half-full-day-b7", label: "두 배가 되는 양의 절반 날짜", verified: true, difficulty: 2 },
    { number: 13, typeId: "polygon-border-side-count-inverse-b7", label: "정다각형 한 변의 바둑돌 수", verified: true, difficulty: 2 },
    { number: 14, typeId: "polygon-stakes-from-side-b7", label: "정다각형 둘레의 말뚝 수", verified: true, difficulty: 2 },
    { number: 15, typeId: "between-objects-subdivision-count-b7", label: "나무 사이에 심은 꽃의 수", verified: true, difficulty: 2 },
    { number: 16, typeId: "linked-sequence-correspondence-b7", label: "두 수열의 같은 순서 대응", verified: true, difficulty: 2 },
    { number: 17, typeId: "venn-overlap-with-neither-b7", label: "둘 다 좋아하는 학생 수", verified: true, difficulty: 2 },
    { number: 18, typeId: "reversed-difference-largest-unit-test-book7", label: "자리 바꾼 수와 차로 가장 큰 수 찾기", verified: true, difficulty: 2 },
    { number: 19, typeId: "clock-palindrome-unpadded-unit-test-book7", label: "시각을 이어 쓴 대칭수 세기", verified: true, difficulty: 3 },
    { number: 20, typeId: "three-digit-palindrome-digit-sum-b7", label: "자리 합에 맞는 세 자리 대칭수", verified: true, difficulty: 2 },
    { number: 21, typeId: "mirror-clock-elapsed-b7", label: "거울 시계로 밤사이 시간 구하기", verified: true, difficulty: 3 },
    { number: 22, typeId: "shared-consumption-assumption-b7", label: "난쟁이와 거인의 수", verified: true, difficulty: 3 },
    { number: 23, typeId: "polygon-border-shape-conversion-b7", label: "정육각형 바둑돌을 정사각형으로 바꾸기", verified: true, difficulty: 2 },
    { number: 24, typeId: "four-group-three-clues-unit-test-book7", label: "네 모둠의 세 조건으로 전체 수 구하기", verified: true, difficulty: 3 },
    { number: 25, typeId: "reversed-digit-pair-range-b7", label: "자리 바꾼 두 수의 범위와 차", verified: true, difficulty: 3 }
  ]),
  "book-08": Object.freeze([
    { number: 1, typeId: "unit-test-book08-q01", label: "두 계수식으로 도형 무게 구하기", verified: true, difficulty: 2 },
    { number: 2, typeId: "unit-test-book08-q02", label: "4×4 도형표의 숨은 세로 합", verified: true, difficulty: 2 },
    { number: 3, typeId: "unit-test-book08-q03", label: "2부터 9까지 한 번씩 놓는 곱셈표", verified: true, difficulty: 3 },
    { number: 4, typeId: "unit-test-book08-q04", label: "곱셈 도형식 네 개", verified: true, difficulty: 3 },
    { number: 5, typeId: "unit-test-book08-q05", label: "세 도형의 두 개씩 합", verified: true, difficulty: 2 },
    { number: 6, typeId: "unit-test-book08-q06", label: "세 자리 수와 두 자리 수의 복면산", verified: true, difficulty: 2 },
    { number: 7, typeId: "unit-test-book08-q07", label: "세 수 세로셈의 빈 숫자 합", verified: true, difficulty: 3 },
    { number: 8, typeId: "unit-test-book08-q08", label: "이어 붙인 네 도형의 세로 덧셈", verified: true, difficulty: 3 },
    { number: 9, typeId: "unit-test-book08-q09", label: "다섯 도형의 받아올림 복면산", verified: true, difficulty: 3 },
    { number: 10, typeId: "unit-test-book08-q10", label: "반복 도형 세 자리 복면산", verified: true, difficulty: 2 },
    { number: 11, typeId: "unit-test-book08-q11", label: "두 사람이 같아지도록 주고받기", verified: true, difficulty: 2 },
    { number: 12, typeId: "unit-test-book08-q12", label: "두 나이의 합과 차", verified: true, difficulty: 2 },
    { number: 13, typeId: "unit-test-book08-q13", label: "표의 전체와 두 빈칸의 차", verified: true, difficulty: 2 },
    { number: 14, typeId: "unit-test-book08-q14", label: "두 수의 차와 몇 배 관계", verified: true, difficulty: 2 },
    { number: 15, typeId: "unit-test-book08-q15", label: "전체와 몇 배보다 많은 관계", verified: true, difficulty: 2 },
    { number: 16, typeId: "unit-test-book08-q16", label: "여러 번 주고받은 뒤 처음 수", verified: true, difficulty: 2 },
    { number: 17, typeId: "unit-test-book08-q17", label: "가진 만큼 준 뒤 처음 수", verified: true, difficulty: 2 },
    { number: 18, typeId: "unit-test-book08-q18", label: "일부를 쓰고 남은 수로 처음 수", verified: true, difficulty: 2 },
    { number: 19, typeId: "unit-test-book08-q19", label: "일부를 준 뒤 남은 수로 처음 수", verified: true, difficulty: 2 },
    { number: 20, typeId: "unit-test-book08-q20", label: "두 집단의 분수와 인원 차", verified: true, difficulty: 3 },
    { number: 21, typeId: "unit-test-book08-q21", label: "4×4 도형표의 두 숨은 세로 합", verified: true, difficulty: 3 },
    { number: 22, typeId: "unit-test-book08-q22", label: "문자 수 네 개를 더한 네 자리 수", verified: true, difficulty: 3 },
    { number: 23, typeId: "unit-test-book08-q23", label: "세 사람의 두 이동과 합 조건", verified: true, difficulty: 3 },
    { number: 24, typeId: "unit-test-book08-q24", label: "세 주머니에서 하나 옮긴 뒤의 조건", verified: true, difficulty: 3 },
    { number: 25, typeId: "unit-test-book08-q25", label: "남녀의 분수 관계와 일부 인원", verified: true, difficulty: 3 }
  ]),
  "book-09": Object.freeze([
    { number: 1, typeId: "book09-unit-test-q01", label: "네 영역 스도쿠 완성", verified: true, difficulty: 2 },
    { number: 2, typeId: "book09-unit-test-q02", label: "수의 합이 같은 합동 도형 분할", verified: true, difficulty: 3 },
    { number: 3, typeId: "book09-unit-test-q03", label: "두 복합 도형을 합동으로 나누기", verified: true, difficulty: 3 },
    { number: 4, typeId: "book09-unit-test-q04", label: "두 색칠 도형의 넓이", verified: true, difficulty: 2 },
    { number: 5, typeId: "book09-unit-test-q05", label: "두 복합 색칠 도형의 넓이", verified: true, difficulty: 2 },
    { number: 6, typeId: "book09-unit-test-q06", label: "기울어진 정사각형의 넓이", verified: true, difficulty: 2 },
    { number: 7, typeId: "book09-unit-test-q07", label: "직육면체를 채우는 쌓기나무", verified: true, difficulty: 2 },
    { number: 8, typeId: "book09-unit-test-q08", label: "보이지 않는 쌓기나무의 개수", verified: true, difficulty: 2 },
    { number: 9, typeId: "book09-unit-test-q09", label: "층별 모양을 세 방향에서 보기", verified: true, difficulty: 2 },
    { number: 10, typeId: "book09-unit-test-q10", label: "세 방향 그림과 위에서 본 수", verified: true, difficulty: 3 },
    { number: 11, typeId: "book09-unit-test-q11", label: "두 세 방향 그림의 쌓기나무 수", verified: true, difficulty: 2 },
    { number: 12, typeId: "book09-unit-test-q12", label: "세 방향 그림의 최대·최소 개수", verified: true, difficulty: 3 },
    { number: 13, typeId: "book09-unit-test-q13", label: "두 3×3 마방진 완성", verified: true, difficulty: 2 },
    { number: 14, typeId: "book09-unit-test-q14", label: "4×4 마방진의 두 빈칸 합", verified: true, difficulty: 3 },
    { number: 15, typeId: "book09-unit-test-q15", label: "두 수를 바꾸어 마방진 고치기", verified: true, difficulty: 3 },
    { number: 16, typeId: "book09-unit-test-q16", label: "네 가지 합의 삼각진 완성", verified: true, difficulty: 3 },
    { number: 17, typeId: "book09-unit-test-q17", label: "오각진의 세 수 합 맞추기", verified: true, difficulty: 3 },
    { number: 18, typeId: "book09-unit-test-q18", label: "직선과 원 둘레의 합 맞추기", verified: true, difficulty: 3 },
    { number: 19, typeId: "book09-unit-test-q19", label: "막대 길이 조건과 차", verified: true, difficulty: 2 },
    { number: 20, typeId: "book09-unit-test-q20", label: "원탁에서 사이에 앉은 사람", verified: true, difficulty: 2 },
    { number: 21, typeId: "book09-unit-test-q21", label: "말 조건으로 순위 완성", verified: true, difficulty: 2 },
    { number: 22, typeId: "book09-unit-test-q22", label: "좋아하는 운동 조건표", verified: true, difficulty: 3 },
    { number: 23, typeId: "book09-unit-test-q23", label: "예상 하나만 맞는 우승팀", verified: true, difficulty: 3 },
    { number: 24, typeId: "book09-unit-test-q24", label: "가능하지 않은 등수를 지워 순위 찾기", verified: true, difficulty: 3 },
    { number: 25, typeId: "book09-unit-test-q25", label: "1부터 9까지로 삼각진 완성", verified: true, difficulty: 3 }
  ]),
  "book-10": Object.freeze([
    { number: 1, typeId: "unit-test-book10-q01", label: "짝수 개 연속수의 합 네 문항", verified: true, difficulty: 2 },
    { number: 2, typeId: "unit-test-book10-q02", label: "홀수 개 연속수의 합 네 문항", verified: true, difficulty: 2 },
    { number: 3, typeId: "unit-test-book10-q03", label: "주어진 수를 연속수의 합으로 나타내기", verified: true, difficulty: 2 },
    { number: 4, typeId: "unit-test-book10-q04", label: "두 수를 연속수의 합으로 나타내기", verified: true, difficulty: 2 },
    { number: 5, typeId: "unit-test-book10-q05", label: "달력 3×3 묶음의 합과 가장 큰 수", verified: true, difficulty: 2 },
    { number: 6, typeId: "unit-test-book10-q06", label: "두 영역 과녁의 점수", verified: true, difficulty: 2 },
    { number: 7, typeId: "unit-test-book10-q07", label: "세 수의 두 수씩 합", verified: true, difficulty: 2 },
    { number: 8, typeId: "unit-test-book10-q08", label: "사람 수가 늘어난 뒤 똑같이 나누기", verified: true, difficulty: 2 },
    { number: 9, typeId: "unit-test-book10-q09", label: "두 양이 같아지는 때", verified: true, difficulty: 2 },
    { number: 10, typeId: "unit-test-book10-q10", label: "두 물건의 계수식과 무게", verified: true, difficulty: 2 },
    { number: 11, typeId: "unit-test-book10-q11", label: "네 물건의 저울식", verified: true, difficulty: 3 },
    { number: 12, typeId: "unit-test-book10-q12", label: "다섯 카드 중 세 장으로 세 자리 수 만들기", verified: true, difficulty: 2 },
    { number: 13, typeId: "unit-test-book10-q13", label: "0이 포함된 네 카드로 네 자리 수 만들기", verified: true, difficulty: 2 },
    { number: 14, typeId: "unit-test-book10-q14", label: "같은 카드를 다시 써서 세 자리 수 만들기", verified: true, difficulty: 2 },
    { number: 15, typeId: "unit-test-book10-q15", label: "자리 숫자가 차례로 작아지는 수 모두 쓰기", verified: true, difficulty: 2 },
    { number: 16, typeId: "unit-test-book10-q16", label: "세 카드의 합이 같은 모든 경우", verified: true, difficulty: 3 },
    { number: 17, typeId: "unit-test-book10-q17", label: "자리 합이 같은 수의 순서", verified: true, difficulty: 3 },
    { number: 18, typeId: "unit-test-book10-q18", label: "1부터 130까지 숫자 1 세기", verified: true, difficulty: 2 },
    { number: 19, typeId: "unit-test-book10-q19", label: "300부터 500까지 숫자 3 세기", verified: true, difficulty: 3 },
    { number: 20, typeId: "unit-test-book10-q20", label: "1부터 70까지 쓴 숫자의 개수", verified: true, difficulty: 2 },
    { number: 21, typeId: "unit-test-book10-q21", label: "1부터 200까지 쓴 숫자의 개수", verified: true, difficulty: 2 },
    { number: 22, typeId: "unit-test-book10-q22", label: "숫자 167개를 썼을 때 마지막 수", verified: true, difficulty: 2 },
    { number: 23, typeId: "unit-test-book10-q23", label: "숫자 642개를 썼을 때 마지막 수", verified: true, difficulty: 3 },
    { number: 24, typeId: "unit-test-book10-q24", label: "연속한 세 수의 세로 덧셈 두 문항", verified: true, difficulty: 2 },
    { number: 25, typeId: "unit-test-book10-q25", label: "홀수 합과 짝수 합의 차", verified: true, difficulty: 3 }
  ])
});

export const CURRICULUM = [
  { id: "book-01", label: "1권", title: "도형 움직이기와 마방진", units: [
    detailedStagedUnit("도형 움직이기", [
      "shape-mirror-direction", "shape-quarter-half-turn", "shape-flip-composition",
      "rotational-partition-two", "rotational-partition-four", "symbol-balanced-congruent-partition",
      "digital-digit-transform", "digital-two-digit-transform", "digital-transform-board-sum", "digital-board-half-turn-sum",
      "digital-flip-addition-horizontal", "digital-transform-addition"
    ], [6,4], [5,4], 4, 18, BOOK01_UNIT01_REFS),
    detailedStagedUnit("색종이 접기", [
      "fold-cut-shape-choice", "fold-number-cut-sum-textbook", "fold-cut-piece-count",
      "fold-punch-shape-count", "fold-hole-count"
    ], [3,4], [3,6], 4, 20, BOOK01_UNIT02_REFS),
    detailedStagedUnit("마방진과 가쿠로 퍼즐", [
      "circular-magic-line-sum", "circular-magic-seven-line-sum", "circular-magic-eleven-line-sum",
      "cross-shape-magic-sum", "t-shape-magic-sum", "equal-line-sum-eight-cards",
      "triangle-edge-sum-six", "gakuro-card-placement", "gakuro-card-rectangle-placement",
      "gakuro-card-irregular-placement", "gakuro-grid-sum", "gakuro-grid-nine-sum", "gakuro-grid-irregular-sum",
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
      "rod-ratio-total-book3", "unit-object-length", "equivalent-object-length", "object-combination-equivalent-count",
      "proportional-rods-common-total", "number-line-six-points", "meeting-distance-ratio",
      "mixed-interval-distance", "difference-unit-measure"
    ], [4,4], [2,2], 4, 16, BOOK03_UNIT02_REFS, {
      sourceAuditBlockedStages: { "number-line-six-points": ["advanced"] }
    }),
    detailedStagedUnit("복면산", [
      "cryptarithm-single-double", "cryptarithm-repeated-number-double",
      "cryptarithm-fixed-digit-addition", "cryptarithm-missing-digit-column",
      "cryptarithm-multi-symbol-carry", "cryptarithm-linked-equations"
    ], [4,4], [4,4], 4, 17, BOOK03_UNIT03_REFS),
    detailedStagedUnit("마법카드와 마방진", [
      "binary-weight-selection", "colored-cell-number-code", "symbol-value-code",
      "magic-square-three-complete", "magic-square-three-target", "magic-square-four-target",
      "polygon-ring-equal-sum", "equal-line-sum-eight-cards-complete-book3", "triangle-max-edge-sum",
      "triangle-edge-sum-six", "triangle-edge-sum-nine", "magic-square-four-complete"
    ], [3,3], [3,4], 4, 19, BOOK03_UNIT04_REFS, {
      sourceAuditBlockedStages: {
        "magic-square-three-complete": ["concept"],
      }
    })
  ] },
  { id: "book-04", label: "4권", title: "도형분할과 쌓기나무", units: [
    detailedStagedUnit("도형 분할과 움직이기", [
      "tetromino-family-choice", "tetromino-square-composition", "rotational-partition-two",
      "rotational-partition-four", "symbol-balanced-congruent-partition", "shape-quarter-half-turn",
      "shape-mirror-direction", "digital-digit-transform", "digital-grid-transform", "digital-transform-arithmetic"
    ], [4,6], [4,4], 4, 20, BOOK04_UNIT01_REFS),
    detailedStagedUnit("색종이 접기와 쌓기나무", [
      "fold-cut-unfold-one-draw", "fold-cut-unfold-two-draw", "fold-number-grid-one",
      "fold-number-grid-two-orthogonal", "fold-number-grid-two-diagonal", "fold-surface-top-trace",
      "cube-count-solid", "cube-minimum-from-solid", "cube-step-sequence", "cube-hidden-count-walled",
      "cube-hidden-count", "cube-fill-rectangular-box", "three-fold-cut-line-book4",
      "practice-three-fold-hole-count", "cube-black-white-alternating", "cube-shell-interior-b9"
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
    detailedStagedUnit("수직선의 분할과 비", [
      "number-line-midpoint-book6", "number-line-unit-distance-book6", "number-line-two-part-distance",
      "rod-difference-measure-count", "equivalent-fraction-chain", "equivalent-ratio-chain",
      "bar-ratio-read", "bar-ratio-total-length", "balance-ratio-book6", "balance-weight-ratio",
      "symbol-sum-card-deduction", "stride-ratio-total", "repeated-unit-length-total"
    ], [5,6], [2,6], 4, 17, BOOK06_UNIT01_REFS),
    detailedStagedUnit("도형의 둘레", [
      "quadrilateral-perimeter", "equal-sided-quadrilateral-perimeter", "joined-quadrilateral-dimensions",
      "joined-quadrilateral-side", "joined-regular-shape-side", "diagonal-triangle-perimeter",
      "square-composition-side", "square-composition-perimeter", "fold-cut-rectangle-perimeter",
      "rectilinear-route-perimeter", "rectilinear-perimeter-book6", "concave-perimeter",
      "grid-cutout-perimeter", "polyomino-outer-perimeter", "attached-regular-shape-perimeter",
      "perimeter-unit-edge-inverse", "cutout-perimeter-change", "square-partition-lengths",
      "nested-square-perimeter"
    ], [6,5], [4,4], 5, 20, BOOK06_UNIT02_REFS),
    detailedStagedUnit("연속수의 합", [
      "napier-multiplication", "area-model-multiplication", "round-pair-addition",
      "round-pair-missing-addend", "common-factor-sum", "near-round-multiplication",
      "near-round-addition", "inclusive-range-count", "consecutive-sum-even-count",
      "consecutive-sum-odd-count", "nth-even-odd", "even-odd-position", "facing-page-number",
      "alternating-pair-sum", "common-factor-missing-term", "consecutive-numbers-from-sum",
      "newspaper-page-pair"
    ], [5,4], [4,3], 6, 19, BOOK06_UNIT03_REFS),
    detailedStagedUnit("수와 숫자의 개수", [
      "range-number-digit-count", "total-written-digits", "digit-occurrence-count",
      "digit-exclusion-count", "consecutive-sign-insertion", "odd-sequence-sign-insertion",
      "doubling-sequence-sign-insertion", "plus-concatenation-evaluate", "plus-concatenation-target",
      "mixed-sign-concatenation", "remove-plus-concatenation", "last-number-from-digit-total",
      "repeated-digit-concatenation"
    ], [4,6], [2,4], 4, 14, BOOK06_UNIT04_REFS)
  ] },
  { id: "book-07", label: "7권", title: "달력과 우기기", units: [
    detailedStagedUnit("달력과 시계", [
      "calendar-month-shift-weekday-b7", "calendar-cross-month-weekday-b7", "weekday-after-days-b7",
      "time-unit-conversion-b7", "analog-clock-reading-b7", "elapsed-time-analog-b7",
      "time-add-subtract-base60-b7", "find-end-time-b7", "find-start-time-b7",
      "consecutive-full-month-reverse-b7", "leap-year-cross-month-weekday-b7",
      "mirror-clock-reading-b7", "mirror-clock-elapsed-b7", "mirror-symmetric-clock-b7"
    ], [6,4], [3,4], 5, 16, BOOK07_UNIT01_REFS),
    detailedStagedUnit("규칙 찾기와 우기기", [
      "arithmetic-sequence-nth-b7", "shared-polygon-matchsticks-b7", "division-fill-long-form-b7",
      "reverse-linear-equation-b7", "arithmetic-sequence-position-b7", "sparse-arithmetic-sequence-b7",
      "indexed-arithmetic-sequence-b7", "two-leg-animal-assumption-b7", "two-wheel-vehicle-assumption-b7",
      "two-card-value-assumption-b7", "two-score-value-assumption-b7", "two-coin-value-assumption-b7",
      "correct-wrong-score-assumption-b7", "constant-step-object-growth-b7", "bounded-symbol-sum-extrema-b7",
      "win-loss-net-zero-b7", "shared-consumption-assumption-b7", "count-difference-assumption-b7",
      "linked-sequence-correspondence-b7"
    ], [4,6,6], [2,4,3], 6, 21, BOOK07_UNIT02_REFS),
    detailedStagedUnit("가로수 심기", [
      "climb-slip-days-b7", "exchange-container-total-b7", "reverse-doubling-target-day-b7",
      "doubling-fraction-start-count-b7", "doubling-start-count-b7", "doubling-half-full-day-b7",
      "doubling-two-start-earlier-b7", "polygon-border-point-count-b7",
      "polygon-border-side-count-inverse-b7", "polygon-stakes-from-side-b7",
      "closed-perimeter-object-count-b7", "closed-perimeter-from-spacing-count-b7",
      "between-objects-subdivision-count-b7", "perimeter-capacity-b7", "between-object-perimeter-b7",
      "inner-outer-path-object-count-b7", "polygon-border-shape-conversion-b7"
    ], [4,7], [6,4], 4, 18, BOOK07_UNIT03_REFS),
    detailedStagedUnit("팔린드롬과 벤다이어그램", [
      "palindrome-length-count-b7", "three-digit-palindrome-digit-sum-b7", "calendar-date-palindrome-b7",
      "clock-time-palindrome-b7", "reversed-two-digit-difference-enumeration-b7",
      "reversed-two-digit-difference-extreme-b7", "reversed-digit-given-tens-b7",
      "reversed-digit-pair-range-b7", "four-point-distance-chain-b7", "venn-overlap-all-b7",
      "venn-union-total-b7", "venn-exactly-one-b7", "venn-neither-b7",
      "venn-overlap-with-neither-b7", "two-way-table-count-b7",
      "palindrome-adjacent-digit-difference-b7", "complement-groups-total-b7",
      "four-group-complement-total-b7", "reverse-add-palindrome-b7", "minimum-stone-moves-b7",
      "kaprekar-495-b7", "three-circle-equal-sum-b7"
    ], [5,5], [7,4], 6, 20, BOOK07_UNIT04_REFS)
  ] },
  { id: "book-08", label: "8권", title: "매트릭스와 복면산", units: [
    detailedStagedUnit("묶음수와 매트릭스", [
      "balance-difference-deduction-b8", "overlap-circle-sum-b8", "symbol-additive-chain-b8",
      "addition-matrix-target-b8", "addition-matrix-complete-b8", "symbol-operation-deduction-b8",
      "symbol-cross-equation-b8", "multiplication-matrix-products", "multiplication-matrix-placement",
      "conditional-symbol-chain-b8", "conditional-two-digit-symbol-b8", "cyclic-pair-sums-b8"
    ], [5,4], [4,3], 6, 19, BOOK08_UNIT01_REFS),
    detailedStagedUnit("복면산", [
      "pyramid-cryptarithm-b8", "blank-digit-vertical-addition-b8", "all-digits-once-cryptarithm-b8",
      "ordered-symbol-cryptarithm-b8", "repeated-symbol-cryptarithm-b8", "multi-symbol-cryptarithm-b8",
      "doubled-symbol-result-b8", "letter-pyramid-cryptarithm-b8", "repeated-number-multiple-answers-b8",
      "linked-cryptarithm-b8", "subtract-to-repeated-number-b8"
    ], [4,6], [4,4], 6, 18, BOOK08_UNIT02_REFS),
    detailedStagedUnit("합차와 배수문제", [
      "equalize-transfer-b8", "chained-equalize-transfer-b8", "total-difference-bars-b8",
      "future-age-sum-b8", "table-total-difference-b8", "reverse-transfer-three-b8",
      "sum-multiple-bars-b8", "difference-multiple-bars-b8", "sum-multiple-offset-b8",
      "three-person-difference-b8", "transfer-to-multiple-b8", "conditional-three-share-b8",
      "reverse-double-offset-b8"
    ], [6,4], [4,4], 6, 18, BOOK08_UNIT03_REFS),
    detailedStagedUnit("거꾸로 생각하기", [
      "reverse-arithmetic-chain-b8", "reverse-transfer-events-b8", "reverse-multiply-divide-b8",
      "reverse-split-equal-b8", "give-as-much-once-b8", "give-as-much-return-b8",
      "shaded-fraction-count-b8", "fraction-given-away-original-b8", "sequential-fraction-remains-b8",
      "fraction-difference-whole-b8", "fraction-share-difference-b8", "reverse-two-container-transfers-b8",
      "three-container-condition-b8", "sequential-fraction-consumption-b8", "fraction-subgroup-count-b8"
    ], [4,4], [4,4], 4, 19, BOOK08_UNIT04_REFS)
  ] },
  { id: "book-09", label: "9권", title: "도형분할과 논리", units: [
    detailedStagedUnit("도형의 분할과 넓이", [
      "rotational-partition-two", "rotational-partition-four", "symbol-balanced-congruent-partition",
      "latin-square-congruent-partition-b9", "equal-sum-congruent-partition-b9",
      "landmark-congruent-partition-b9", "congruent-composite-partition-b9",
      "triangle-equal-subdivision-b9", "hexagon-equal-subdivision-b9", "tetromino-cover-count-b9",
      "unit-grid-area", "oblique-square-grid-area", "quadrilateral-grid-area-b9",
      "shaded-composite-grid-area-b9", "parallelogram-grid-area-b9"
    ], [7,6], [5,4], 6, 22, BOOK09_UNIT01_REFS),
    detailedStagedUnit("쌓기나무의 개수", [
      "cube-count-solid", "cube-fill-rectangular-box", "cube-hidden-count-walled", "cube-hidden-count",
      "cube-solid-to-views-b9", "cube-top-number-grid", "cube-missing-view", "cube-layer-views-b9",
      "cube-three-views", "cube-three-view-minmax", "cube-fill-box", "cube-black-white-alternating",
      "cube-shell-interior-b9", "cube-view-model-choice-b9"
    ], [5,2], [5,5], 5, 14, BOOK09_UNIT02_REFS),
    detailedStagedUnit("마방진", [
      "magic-square-three-complete", "magic-square-three-target", "magic-square-four-target",
      "magic-square-four-complete", "magic-square-swap-pair-b9", "magic-square-four-pair-sum-b9",
      "triangle-edge-extreme-six-b9", "triangle-edge-sum-six", "triangle-edge-extreme-nine-b9",
      "triangle-edge-sum-nine", "polygon-ring-equal-sum", "heptagon-ring-equal-sum-b9",
      "overlap-region-equal-sum-b9", "circle-line-ring-equal-sum", "grid-line-sum-minimum-b9",
      "circle-chain-equal-sum-b9", "triangle-line-equal-sum-b9", "circular-magic-line-sum",
      "circular-magic-maximum-b9"
    ], [4,4], [2,2], 5, 15, BOOK09_UNIT03_REFS),
    detailedStagedUnit("논리 추리", [
      "shape-difference-chain", "measurement-order-chain", "fixed-value-order-assignment-b9",
      "ordinal-line-placement", "line-ranking-constraints-b9", "circular-seat-placement",
      "exclusion-grid-ranking-b9", "exact-one-ranking-predictions-b9", "exact-one-answer-assignment-b9",
      "pair-group-inference-b9", "all-false-circular-seating-b9", "preference-count-matrix-b9",
      "apartment-neighbor-logic-b9", "profession-assignment-b9", "activity-enrollment-b9"
    ], [6,3], [4,2], 5, 20, BOOK09_UNIT04_REFS)
  ] },
  { id: "book-10", label: "10권", title: "연속수와 따라잡기", units: [
    detailedStagedUnit("연속수의 합", [
      "napier-multiplication", "area-model-multiplication", "multi-method-multiplication-b10",
      "same-tens-complement-product-b10", "same-ones-complement-product-b10", "factor-pair-divisor-count-b10",
      "consecutive-sum-even-count", "consecutive-sum-odd-count", "consecutive-numbers-from-sum",
      "multi-count-consecutive-decomposition-b10", "calendar-consecutive-sum-weekday-b10",
      "consecutive-page-range-b10", "same-parity-consecutive-sum-b10", "rectangular-number-grid-sum-b10",
      "shaped-number-grid-sum-b10", "calendar-block-sum-b10", "g1-odd-even-sum-difference",
      "all-consecutive-decompositions-b10", "consecutive-tens-digit-condition-b10", "consecutive-vertical-addition-b10"
    ], [3,6,8], [4,4,4], 6, 26, BOOK10_UNIT01_REFS),
    detailedStagedUnit("따라잡기", [
      "two-symbol-coefficient-weight-b10", "two-symbol-score-difference-b10", "shared-term-equation-b10",
      "container-double-content-b10", "three-pair-sums-values-b10", "closed-perimeter-spacing-difference-b10",
      "same-budget-price-count-b10", "new-participants-equal-share-b10", "catch-up-growing-amount-b10",
      "catch-up-shrinking-amount-b10", "catch-up-distance-b10", "four-object-weight-system-b10",
      "delayed-start-catch-up-b10"
    ], [4,4], [4,4], 5, 17, BOOK10_UNIT02_REFS),
    detailedStagedUnit("조건에 맞는 수", [
      "digit-card-number-enumeration", "repeated-digit-number-count-b10", "binary-switch-count-b10",
      "monotone-digit-enumeration-b10", "monotone-digit-rank-b10", "distinct-card-target-sum-b10",
      "digit-sum-three-digit-count-b10", "digit-sum-ranked-number-b10", "three-digit-step-count-b10",
      "monotone-digit-count-b10", "route-product-count-b10", "lineup-count-b10"
    ], [8,3], [4,4], 5, 16, BOOK10_UNIT03_REFS),
    detailedStagedUnit("숫자 야구게임", [
      "number-baseball-b10", "digit-occurrence-count", "most-frequent-digit-b10", "total-written-digits",
      "last-number-from-digit-total", "digit-occurrence-range-b10", "positive-range-number-digit-count-b10"
    ], [4,6], [4,4], 5, 20, BOOK10_UNIT04_REFS)
  ] }
].map((book, index) => {
  const review = CURRICULUM_REVIEW_CROSSWALK[book.id];
  return {
    ...book,
    source: {
      textbook: `더클래식 1과정 ${index + 1}권 수업용 교재`,
      unitTest: CURRICULUM_TEST_FILES[book.id],
      unitTestQuestionCount: 25,
      unitTestPageCount: CURRICULUM_TEST_PAGE_COUNTS[book.id],
      unitTestQuestions: (CURRICULUM_UNIT_TEST_QUESTIONS[book.id] || []).map((entry) => classifySourceQuestion(entry)),
      goldenBellIncluded: false,
      reviewIncluded: index > 0,
      reviewSourceBookId: index > 0 ? `book-${String(index).padStart(2, "0")}` : null,
      reviewSourceBookLabel: index > 0 ? `${index}권` : null,
      reviewRole: index > 0 ? "previous-book-review" : null,
      reviewQuestionCount: review?.links.length || 0,
      reviewVerified: Boolean(review?.verified)
    }
  };
});

export const typeById = (id) => byId[id];

const sourceQuestionRecord = (sourceKind, sourceId, sourceLabel, entry, extra = {}) => {
  const typeIds = [...new Set(entry.typeIds || [entry.typeId, ...(entry.relatedTypeIds || [])].filter(Boolean))];
  const classifications = typeIds.map((typeId) => questionClassificationForType(typeId)).filter(Boolean);
  return Object.freeze({
    sourceKey: `${sourceKind}:${sourceId}:q${entry.number}`,
    sourceKind,
    sourceId,
    sourceLabel,
    number: entry.number,
    typeId: typeIds[0],
    typeIds: Object.freeze(typeIds),
    label: entry.note || entry.label || byId[typeIds[0]]?.label || "",
    difficulty: entry.difficulty,
    verified: entry.verified === true,
    classification: entry.classification || classifications[0],
    classifications: Object.freeze(classifications),
    ...extra
  });
};

const referenceNumbers = (reference) => reference.numbers
  || Array.from({ length: reference.to - (reference.from || 1) + 1 }, (_, index) => (reference.from || 1) + index);

const mergeQuestionRecords = (records) => [...records.reduce((index, record) => {
  const previous = index.get(record.sourceKey);
  if (!previous) {
    index.set(record.sourceKey, record);
    return index;
  }
  const typeIds = [...new Set([...previous.typeIds, ...record.typeIds])];
  const classifications = typeIds.map((typeId) => questionClassificationForType(typeId)).filter(Boolean);
  index.set(record.sourceKey, Object.freeze({
    ...previous,
    typeId: typeIds[0],
    typeIds: Object.freeze(typeIds),
    classification: classifications[0],
    classifications: Object.freeze(classifications),
    verified: previous.verified && record.verified
  }));
  return index;
}, new Map()).values()];

const textbookQuestionRecords = mergeQuestionRecords(CURRICULUM.flatMap((book) => book.units.flatMap((unitEntry, unitIndex) =>
  unitEntry.typeIds.flatMap((typeId) => {
    const typeReferences = unitEntry.typeStudyRefs?.[typeId] || unitEntry.studyRefs || {};
    return TEXTBOOK_STAGES.flatMap((stage) => (typeReferences[stage.id] || []).flatMap((reference) =>
      referenceNumbers(reference).map((number) => sourceQuestionRecord(
        "textbook",
        book.id,
        `${book.label} ${unitEntry.label}`,
        {
          number,
          typeId,
          label: byId[typeId]?.label || "",
          difficulty: stage.difficulty,
          verified: Boolean(unitEntry.typeStudyRefs?.[typeId])
        },
        {
          sourceKey: `textbook:${book.id}:u${unitIndex + 1}:${stage.id}:${reference.section}:${reference.group}:q${number}`,
          bookId: book.id,
          unitIndex,
          unitLabel: unitEntry.label,
          textbookStageId: stage.id,
          textbookStageLabel: stage.label,
          section: reference.section,
          group: reference.group
        }
      ))
    ));
  })
)));

// 시험지·단원 테스트의 각 문항을 한 배열로 제공한다. 이후 통합 사고력 문제은행은
// 이 색인에서 대단원, 소단원, 세부 유형, 대표 개념, 학원 스타일을 함께 검색한다.
// 같은 유형이 여러 학원 스타일에 해당해도 문항을 복제하지 않고 style ID만 누적한다.
export const SOURCE_QUESTION_INDEX = Object.freeze([
  ...[...EXAMS, ...DIAGNOSTIC_EXAM_TYPES, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES]
    .flatMap((exam) => exam.questions.map((entry) => sourceQuestionRecord(
      "exam", exam.id, exam.label, entry, { stage: exam.stage || null }
    ))),
  ...CURRICULUM.flatMap((book) => book.source.unitTestQuestions.map((entry) => sourceQuestionRecord(
    "unit-test", book.id, `${book.label} 단원 테스트`, entry, { bookId: book.id }
  ))),
  ...textbookQuestionRecords
]);
