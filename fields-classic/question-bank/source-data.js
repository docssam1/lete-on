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
  type("target-score-combinations", "logic", "경우의 수", "과녁 점수의 가능한 조합 세기", { generator: "targetScoreCombinations", sourceMatched: true }),
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
  type("equalize-transfer", "number", "합과 차 문장제", "주고받아 같게 만들기", { generator: "equalizeTransfer", sourceMatched: true }),
  type("number-pyramid", "number", "수 배열과 합", "수 카드로 모으기·수 피라미드", { generator: "numberPyramid", sourceMatched: true }),
  type("five-card-sum-pyramid", "number", "수 배열과 합", "다섯 수 카드 합 피라미드", { generator: "fiveCardSumPyramid", sourceMatched: true }),
  type("grid-number-placement", "logic", "조건 배치", "위·아래·좌우 조건에 맞게 수 배치하기", { generator: "stairGridPlacement", sourceMatched: true, legacyId: 17 }),
  type("l-grid-placement", "logic", "조건 배치", "ㄱ자 칸의 왼쪽·아래 조건에 맞게 수 배치하기", { generator: "lGridPlacement", sourceMatched: true }),
  type("grid-number-placement-five", "logic", "조건 배치", "다섯 수의 위·아래·좌우 조건 배치"),
  type("nonadjacent-placement", "logic", "조건 배치", "같은 수가 이웃하지 않게 배치하기", { generator: "sourceNonadjacentPyramid", sourceMatched: true }),
  type("order-position", "logic", "순서와 비교", "줄의 순서와 사이 사람 수", { generator: "raceOrder", sourceMatched: true }),
  type("order-position-from-back", "logic", "순서와 비교", "뒤에서의 순서와 사이 사람 수", { generator: "orderPositionFromBack", sourceMatched: true }),
  type("order-position-from-front", "logic", "순서와 비교", "앞에서의 순서와 사이 사람 수", { generator: "orderPositionFromFront", sourceMatched: true }),
  type("order-position-seven-people", "logic", "순서와 비교", "일곱 명의 앞·뒤 순서와 사이 사람 수"),
  type("number-table-rule", "pattern", "수 규칙", "수 배열표의 규칙 찾기", { legacyId: 11 }),
  type("addition-table-grid", "pattern", "수 규칙", "가로와 세로로 일정하게 커지는 수 표", { generator: "additionTableGrid", sourceMatched: true }),
  type("disc-number-rule", "pattern", "수 규칙", "원판에 적힌 수의 규칙", { generator: "discNumberRule", sourceMatched: true }),
  type("repeat-pattern", "pattern", "반복 규칙", "모양과 색의 반복 규칙", { generator: "repeatShapeSequence", sourceMatched: true }),
  type("repeat-three-shapes", "pattern", "반복 규칙", "세 가지 도형의 순서 반복", { generator: "threeShapeCycle", sourceMatched: true }),
  type("repeat-four-shapes", "pattern", "반복 규칙", "네 가지 도형의 순서 반복", { generator: "fourShapeCycle", sourceMatched: true }),
  type("shape-sum-table", "number", "매트릭스", "도형의 가로·세로 합 매트릭스", { generator: "shapeSumTable", sourceMatched: true }),
  type("shape-sum-table-bottom-target", "number", "매트릭스", "도형의 가로·세로 합 표", { generator: "shapeSumBottomTarget", sourceMatched: true }),
  type("shape-sum-table-column-target", "number", "매트릭스", "두 줄 도형표의 세로 합 구하기", { generator: "shapeSumColumnTarget", sourceMatched: true }),
  type("arrow-number-grid", "pattern", "수 규칙", "화살표 방향 수 배열", { generator: "arrowNumberGrid", sourceMatched: true }),
  type("arrow-number-path-seven", "pattern", "수 규칙", "화살표 7번 이동 수 경로", { generator: "arrowNumberPathSeven", sourceMatched: true }),
  type("bus-change", "number", "합과 차 문장제", "버스에서 타고 내린 사람 수", { generator: "sourceBusStops", sourceMatched: true }),
  type("bus-board-then-leave", "number", "합과 차 문장제", "버스에서 먼저 타고 다음에 내린 사람 수", { generator: "busBoardThenLeave", sourceMatched: true }),
  type("fold-number-cut-sum", "geometry", "색종이 접기", "번호 색종이를 접고 자른 수의 합", { generator: "foldNumberCutSum", sourceMatched: true }),
  type("fold-number-cut-sum-l-shape", "geometry", "색종이 접기", "L자 부분을 자른 번호 색종이의 합", { generator: "foldNumberCutSumLShape", sourceMatched: true }),
  type("equal-line-sum", "number", "수 배열과 합", "가로·세로 각 줄의 합 같게 만들기", { generator: "sourceEqualLineCross", sourceMatched: true }),
  type("equal-line-sum-eight-cards", "number", "수 배열과 합", "1부터 8까지 한 번씩 써서 줄의 합 만들기", { generator: "equalLineSumEightCards", sourceMatched: true }),
  type("equal-line-sum-eight-cards-twelve", "number", "수 배열과 합", "1부터 8까지 써서 각 줄의 합을 12로 만들기", { generator: "equalLineSumEightCardsTwelve", sourceMatched: true }),
  type("symbol-sum-grid", "number", "매트릭스", "도형 매트릭스의 빈 합 구하기", { generator: "sourceSymbolSumGrid", sourceMatched: true }),
  type("shape-sum-grid-top-target", "number", "매트릭스", "도형 합 표의 첫째 줄 합 구하기", { generator: "shapeSumGridTopTarget", sourceMatched: true }),
  type("symbol-sum-grid-square-top", "number", "매트릭스", "네모 세 개로 시작하는 도형 합 매트릭스", { generator: "symbolSumGridSquareTop", sourceMatched: true }),
  type("shape-equation", "number", "복면산과 식", "도형이 나타내는 수와 식", { legacyId: 20 }),
  type("shape-equation-add-subtract", "number", "복면산과 식", "더하기와 빼기로 도형 수 구하기", { generator: "shapeEquationAddSubtract", sourceMatched: true }),
  type("two-digit-condition", "number", "조건에 맞는 수", "조건에 맞는 두 자리 수", { generator: "sourceTwoDigitSumDifference", sourceMatched: true }),
  type("two-digit-parity-gap", "number", "조건에 맞는 수", "짝수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitParityGap", sourceMatched: true }),
  type("two-digit-odd-gap", "number", "조건에 맞는 수", "홀수와 자릿수 차 조건의 두 자리 수", { generator: "twoDigitOddGap", sourceMatched: true }),
  type("growing-shape-count", "pattern", "도형 규칙", "구슬 배열의 개수 규칙", { generator: "sourceGrowingDotSquare", sourceMatched: true }),
  type("triangle-tile-growth", "pattern", "도형 규칙", "정삼각형 조각 수의 성장 규칙", { generator: "triangleTileGrowth", sourceMatched: true }),
  type("square-tile-growth", "pattern", "수열의 활용", "정사각형 배열의 수 규칙", { generator: "squareTileGrowth", sourceMatched: true }),
  type("balance-scale", "logic", "무게 비교", "양팔저울의 균형 관계", { generator: "sourceBalanceRelations", sourceMatched: true }),
  type("balance-scale-three-objects", "logic", "무게 비교", "세 물건 양팔저울 관계", { generator: "balanceScaleThreeObjects", sourceMatched: true }),
  type("balance-scale-four-objects", "logic", "무게 비교", "네 물건을 잇는 세 양팔저울", { generator: "balanceScaleFourObjects", sourceMatched: true }),
  type("symbol-relation", "number", "복면산과 식", "여러 기호의 관계로 값 구하기", { generator: "sourceSymbolRelations", sourceMatched: true }),
  type("symbol-relation-2to3", "number", "복면산과 식", "별 두 개와 원 세 개의 관계식", { generator: "symbolRelationTwoToThree", sourceMatched: true }),
  type("symbol-relation-3to4", "number", "복면산과 식", "별 세 개와 원 네 개의 관계식", { generator: "symbolRelationThreeToFour", sourceMatched: true }),
  type("number-line-distance", "geometry", "길이와 측정", "수직선에서 두 점 사이의 거리", { legacyId: 1 }),
  type("number-line-six-points", "geometry", "길이와 측정", "여섯 점 수직선의 겹친 거리", { generator: "numberLineSixPoints", sourceMatched: true }),
  type("go-stone-difference", "pattern", "도형 규칙", "흑백 바둑돌의 개수 차이", { generator: "sourceGoStoneDifference", sourceMatched: true }),
  type("go-stone-difference-inverse", "pattern", "도형 규칙", "흑백 바둑돌 차로 번째 찾기", { generator: "goStoneDifferenceInverse", sourceMatched: true }),
  type("number-card-plus-minus", "number", "수 카드와 식", "수 카드로 덧셈·뺄셈 식 완성", { generator: "numberCardEquation", sourceMatched: true }),
  type("number-card-mixed-operations", "number", "수 카드와 식", "수 카드를 혼합 계산식에 한 번씩 넣기", { generator: "mixedOperationCardEquation", sourceMatched: true }),
  type("two-digit-even-count", "number", "수 카드와 식", "수 카드로 만든 두 자리 짝수의 개수", { generator: "twoDigitEvenCount", sourceMatched: true }),
  type("two-digit-card-enumeration", "number", "수 카드와 식", "조건에 맞는 두 자리 수 모두 쓰기", { generator: "twoDigitCardEnumeration", sourceMatched: true }),
  type("erase-expression-target", "number", "수 카드와 식", "식의 일부를 지워 목표값 만들기", { generator: "eraseExpressionTarget", sourceMatched: true }),
  type("piano-bounce", "pattern", "반복 규칙", "피아노 건반 왕복 순서", { generator: "sourcePianoBounce", sourceMatched: true }),
  type("colored-shape-number", "pattern", "도형 수 표현", "색칠한 도형이 나타내는 수", { generator: "sourceColoredShapeNumber", sourceMatched: true }),
  type("height-order", "logic", "순서와 비교", "키의 크고 작은 순서"),
  type("hidden-score-ranking", "logic", "순서와 비교", "순위표의 가려진 서로 다른 숫자 찾기", { generator: "hiddenScoreRanking", sourceMatched: true }),
  type("total-difference", "number", "합과 차 문장제", "전체 수와 차이로 두 수 구하기", { generator: "totalDifferenceShare", sourceMatched: true }),
  type("multi-person-transfer", "number", "합과 차 문장제", "여러 사람의 합과 주고받기"),
  type("fold-cut-piece-count", "geometry", "색종이 접기", "접고 자른 조각의 개수"),
  type("cryptarithm", "number", "복면산과 식", "세로셈 복면산"),
  type("multiplicative-symbol-equation", "number", "복면산과 식", "곱셈이 있는 도형 식"),
  type("rod-length-ratio", "geometry", "길이와 측정", "막대의 배수 관계와 전체 길이"),
  type("colored-triangle-difference", "pattern", "도형 규칙", "칠한 삼각형과 흰 삼각형의 차이"),
  type("polygon-stone-rearrangement", "geometry", "둘레와 배열", "다각형 바둑돌을 다른 모양으로 늘어놓기"),
  type("ratio-distribution", "number", "합과 차 문장제", "서로 다른 기준으로 전체 나누기"),
  type("paired-sequences", "pattern", "수 규칙", "두 수열의 대응 규칙"),
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
  type("venn-count", "logic", "집합과 포함", "두 조건에 모두 해당하는 사람 수"),
  type("congruent-partition", "geometry", "도형 분할", "합이 같은 합동 도형으로 나누기"),
  type("triangle-count", "geometry", "도형 세기", "크고 작은 삼각형 세기"),
  type("square-count", "geometry", "도형 세기", "크고 작은 사각형 세기"),
  type("calendar-weekday-sum", "pattern", "달력과 시간", "달력에서 같은 요일 날짜의 합"),
  type("person-item-logic", "logic", "조건 연결", "사람과 동물·음식 조건 연결"),
  type("set-union-count", "logic", "집합과 포함", "두 종류를 선택한 전체 사람 수"),
  type("custom-operation", "number", "연산 약속", "새 기호의 계산 약속"),
  type("operator-insertion", "number", "수 카드와 식", "+와 -를 넣어 식 완성하기"),
  type("cut-recut-pieces", "number", "과정 추론", "자르고 먹고 다시 잘라 남은 조각 수"),
  type("reverse-initial-count", "logic", "과정 추론", "여러 번 오고 간 뒤 처음 수 거꾸로 찾기", { generator: "reverseInitialCount", sourceMatched: true }),
  type("function-machine", "pattern", "수 규칙", "수 변환 기계의 규칙"),
  type("collection-repeat-gap", "pattern", "수 규칙", "모으기 반복 수열에서 같은 수 사이 개수", { generator: "collectionRepeatGap", sourceMatched: true }),
  type("magic-square", "number", "수 배열과 합", "가로·세로·대각선 합이 같은 마방진", { legacyId: 14 }),
  type("fold-hole-count", "geometry", "색종이 접기", "접은 색종이의 구멍 개수", { generator: "paperFoldHoleCount", legacyId: 4 }),
  type("fold-diagonal-unfold", "geometry", "색종이 접기", "대각선으로 접고 자른 뒤 펼친 선 그리기"),
  type("fold-number-remaining-sum", "geometry", "색종이 접기", "번호 색종이를 접고 자른 뒤 남은 수의 합"),
  type("cube-count-solid", "geometry", "쌓기나무", "입체를 이루는 쌓기나무 전체 개수", { geometryGame: "count-heights" }),
  type("cube-different-shape", "geometry", "쌓기나무", "같은 개수로 만든 입체 중 다른 모양", { geometryGame: "find-shape" }),
  type("cube-add-to-match", "geometry", "쌓기나무", "목표 입체까지 더 필요한 쌓기나무", { geometryGame: "copy-build" }),
  type("cube-fill-box", "geometry", "쌓기나무", "정육면체 상자를 채우는 데 필요한 개수", { geometryGame: "fill-box" }),
  type("cube-hidden-count", "geometry", "쌓기나무", "보이지 않는 쌓기나무의 개수", { geometryGame: "hidden-count" }),
  type("cube-three-views", "geometry", "쌓기나무", "앞·옆·위에서 본 쌓기나무", { geometryGame: "three-views", status: "curriculum" }),
  type("cube-tunnel", "geometry", "쌓기나무", "구멍이 뚫린 쌓기나무의 남은 개수", { geometryGame: "cube-tunnel", status: "curriculum" }),
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
  type("reverse-thinking", "logic", "과정 추론", "거꾸로 생각하기", { status: "curriculum" }),
  type("argument-logic", "logic", "조건 추리", "조건을 따져 옳고 그름 판단하기", { status: "curriculum" })
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
    id: "k6-2023-02", stage: "k6_winter", label: "더 클래식 7세 1차 선발시험 (2023.02.06)",
    file: "더_클래식_7세_1차_선발시험(230206).pdf", layout: "two",
    typeIds: ["edge-sum-grid","equalize-transfer","number-pyramid","nonadjacent-placement","order-position","disc-number-rule","shape-sum-table","repeat-pattern","arrow-number-grid","bus-change","number-card-plus-minus","equal-line-sum","two-digit-condition","growing-shape-count","symbol-sum-grid","piano-bounce","balance-scale","symbol-relation","colored-shape-number","go-stone-difference"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-04", stage: "k7_spring", label: "더 클래식 7세 2차 선발시험 (2022.04.18)",
    file: "(최종)더_클래식_7세_2차_선발시험(220418).pdf", layout: "two",
    typeIds: ["edge-sum-grid","equalize-transfer","five-card-sum-pyramid","grid-number-placement","order-position-from-back","addition-table-grid","shape-sum-table-bottom-target","repeat-three-shapes","arrow-number-path-seven","bus-change","fold-number-cut-sum","equal-line-sum-eight-cards","symbol-sum-grid-square-top","shape-equation-add-subtract","two-digit-parity-gap","triangle-tile-growth","balance-scale-three-objects","symbol-relation-2to3","number-line-six-points","go-stone-difference-inverse"],
    verifiedQuestionNumbers: Array.from({ length: 20 }, (_, index) => index + 1)
  }),
  makeExam({
    id: "k7-2022-06", stage: "k7_summer", label: "더 클래식 7세 3차 선발시험 (2022.06.22)",
    file: "더_클래식_7세_3차_선발시험(220622).pdf", layout: "two",
    typeIds: ["edge-sum-grid","repeat-four-shapes","l-grid-placement","order-position-from-front","total-difference","five-card-sum-pyramid","addition-table-grid","shape-sum-table-column-target","arrow-number-path-seven","bus-board-then-leave","shape-sum-grid-top-target","equal-line-sum-eight-cards-twelve","shape-equation-add-subtract","two-digit-odd-gap","square-tile-growth","fold-number-cut-sum-l-shape","balance-scale-four-objects","symbol-relation-3to4","number-line-six-points","go-stone-difference-inverse"],
    verifiedQuestionNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
  }),
  makeExam({
    id: "k7-2022-08", stage: "k7_november", label: "더 클래식 7세 4차 선발시험 (2022.08.12)",
    file: "더_클래식_7세_4차_선발시험(220812).pdf", layout: "two",
    typeIds: ["edge-sum-grid","grid-number-placement","repeat-pattern","five-card-sum-pyramid","order-position-from-front","addition-table-grid","arrow-number-grid","shape-sum-table","equal-line-sum-eight-cards","equalize-transfer","symbol-sum-grid","two-digit-parity-gap","bus-change","shape-equation-add-subtract","square-tile-growth","fold-number-cut-sum","balance-scale-three-objects","symbol-relation-3to4","number-line-six-points","go-stone-difference-inverse"]
  }),
  makeExam({
    id: "k7-2022-12", stage: "k7_to_g1", label: "더 클래식 7세 6차 선발시험 (2022.12.15)",
    file: "더_클래식_7세_6차_선발시험(221215).pdf", layout: "two",
    typeIds: ["edge-sum-grid","grid-number-placement-five","addition-table-grid","number-pyramid","arrow-number-grid","order-position-seven-people","equal-line-sum-eight-cards","shape-sum-table","bus-change","shape-equation-add-subtract","repeat-pattern","equalize-transfer","two-digit-parity-gap","symbol-sum-grid","triangle-tile-growth","balance-scale-three-objects","fold-number-cut-sum","symbol-relation-3to4","go-stone-difference-inverse","number-line-six-points"]
  }),
  makeExam({
    id: "g1-2022-03", stage: "g1_spring", label: "더 클래식 초1 1차 선발시험 (2022.03.07)",
    file: "더_클래식_1학년_1차_선발시험(20220307).pdf", layout: "four",
    typeIds: ["bus-change","height-order","equalize-transfer","two-digit-condition","total-difference","order-position","shape-equation","fold-cut-piece-count","cryptarithm","multiplicative-symbol-equation","balance-scale","repeat-pattern","colored-triangle-difference","shape-sum-table","rod-length-ratio","symbol-relation","polygon-stone-rearrangement","paired-sequences","ratio-distribution","odd-even-sum-difference"]
  }),
  makeExam({
    id: "g1-2022-05", stage: "g1_summer", label: "더 클래식 초1 2차 선발시험 (2022.05.30)",
    file: "더_클래식_1학년_2차_선발시험(20220530).pdf", layout: "four",
    typeIds: ["equalize-transfer","height-order","two-digit-condition","balance-scale","weight-order","shape-equation","adjacent-product-pentagon","shape-sum-table","segment-count","shape-sum-table","cryptarithm","rod-length-ratio","colored-triangle-difference","square-side-composition","fold-cut-piece-count","symbol-relation","repeat-pattern","ratio-distribution","rectilinear-perimeter","paired-sequences"]
  }),
  makeExam({
    id: "g1-2019-08", stage: "g1_fall", label: "더 클래식 초1 3차 선발시험 (2019.08.28)",
    file: "더_클래식_1학년_3차_선발시험(20190828).pdf", layout: "four",
    typeIds: ["multi-person-transfer","height-order","balance-scale","two-digit-condition","chained-number-condition","grid-number-placement","adjacent-product-pentagon","shape-sum-table","rod-length-ratio","square-side-composition","cryptarithm","colored-triangle-difference","fold-cut-piece-count","vertical-addition","vertical-addition","rectilinear-perimeter","number-table-rule","repeat-pattern","cryptarithm","consecutive-number-addition"]
  }),
  makeExam({
    id: "g1-2022-02", stage: "g1_winter", label: "더 클래식 초1 4차 선발시험 (2022.02.15)",
    file: "더_클래식_1학년_4차_선발시험(20220215).pdf", layout: "four",
    typeIds: ["magic-square","multiplication-matrix","shape-sum-table","step-game","latin-square","cryptarithm","repeat-pattern","two-digit-condition","total-difference","order-position","height-order","multiplication-matrix","three-digit-card-count","balance-scale","chained-number-condition","venn-count","polygon-stone-rearrangement","ratio-distribution","ratio-distribution","odd-even-sum-difference"]
  })
];

export const PRACTICE_EXAM_TYPES = [
  { id: "mock-3", label: "필즈 대비 실전 3회", questions: ["cube-count-solid","set-union-count","chained-number-condition","cube-different-shape","shape-sum-table","vertical-addition","person-item-logic","shape-equation","number-table-rule","cut-recut-pieces","repeat-pattern","triangle-count","function-machine","operator-insertion","custom-operation","fold-hole-count","two-digit-card-enumeration","erase-expression-target","collection-repeat-gap","magic-square"] },
  { id: "mock-4", label: "필즈 대비 실전 4회", questions: ["balance-scale","rod-length-ratio","number-card-mixed-operations","fold-number-remaining-sum","equal-line-sum","magic-square","hidden-score-ranking","two-digit-even-count","number-table-rule","function-machine","square-count","reverse-initial-count","calendar-weekday-sum","growing-shape-count","cryptarithm","shape-equation","shape-sum-table","shape-sum-table","height-order","person-item-logic"] },
  { id: "mock-5", label: "필즈 대비 실전 5회", questions: ["shape-sum-table","colored-shape-number","operator-insertion","magic-square","edge-sum-grid","cryptarithm","repeat-pattern","go-stone-difference","balance-scale","rod-length-ratio","fold-hole-count","fold-diagonal-unfold","set-union-count","equalize-transfer","three-digit-card-count","cube-add-to-match","order-position","number-table-rule","order-position","number-pyramid"] },
  { id: "mock-6", label: "필즈 대비 실전 6회", questions: ["congruent-partition","magic-square","edge-sum-grid","shape-equation","shape-sum-table","symbol-relation","order-position","person-item-logic","latin-square","fold-diagonal-unfold","cube-fill-box","edge-sum-grid","latin-square","total-difference","set-union-count","number-card-plus-minus","function-machine","multi-person-transfer","cube-hidden-count","repeat-pattern"] }
].map((exam) => ({ ...exam, questions: exam.questions.map((typeId, index) => ({
  ...question(index + 1, typeId),
  verified: (exam.id === "mock-4" && (index === 2 || index === 6 || index === 7 || index === 11)) || (exam.id === "mock-3" && (index === 16 || index === 17 || index === 18))
})) }));

export const FINAL_EXAM_TYPES = [
  {
    id: "final-2",
    stage: "final",
    label: "필즈선발대비 실전 모의고사 파이널 2회",
    file: "필즈선발대비 실전 모의고사 파이널 2회.pdf",
    sourceViewer: false,
    questions: [
      "hidden-number-card-conditions", "cube-hidden-count", "closest-two-digit-card-sum", "front-back-total",
      "set-union-count", "wrong-operation-correction", "symbol-relation", "paired-sequences",
      "shape-matrix-rule", "delayed-date-promise", "repeat-pattern", "calendar-date-weekday",
      "two-type-unit-total", "cryptarithm", "fold-hole-count", "edge-sum-grid", "equal-line-sum",
      "total-difference", "symbol-sum-grid", "magic-square"
    ].map((typeId, index) => ({ ...question(index + 1, typeId), verified: index === 0 || index === 2 || index === 3 || index === 5 || index === 8 || index === 9 || index === 11 || index === 12 }))
  },
  {
    id: "final-3",
    stage: "final",
    label: "필즈선발대비 실전 모의고사 파이널 3회",
    file: "필즈선발대비 실전 모의고사 파이널 3회.pdf",
    sourceViewer: false,
    questions: [
      "row-column-count-placement", "truth-lie-ranking", "edge-sum-grid", "cube-count-solid",
      "number-pyramid", "reverse-thinking", "order-position-seven-people", "fold-hole-count",
      "target-score-combinations", "matchstick-square-growth", "connected-line-degree-sum", "letter-block-transform",
      "go-stone-difference-inverse", "square-count", "symbol-sum-grid", "cube-fill-box",
      "mixed-sequences", "two-type-unit-total", "go-stone-difference", "neither-set-count"
    ].map((typeId, index) => ({ ...question(index + 1, typeId), verified: index <= 1 || index === 8 || index === 9 || index === 10 || index === 11 || index === 16 || index === 19 }))
  }
];

const unit = (label, typeIds) => ({ label, typeIds });

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
  { id: "book-01", label: "1권", title: "도형 움직이기와 마방진", units: [unit("도형 움직이기",["shape-transform"]),unit("색종이 접기",["fold-hole-count","fold-diagonal-unfold","fold-cut-piece-count"]),unit("마방진과 가쿠로 퍼즐",["magic-square","gakuro"]),unit("수 추리와 논리 추리",["grid-number-placement","person-item-logic"])] },
  { id: "book-02", label: "2권", title: "규칙찾기와 매트릭스", units: [unit("매트릭스와 주고받기",["shape-sum-table","equalize-transfer"]),unit("양팔저울",["balance-scale"]),unit("규칙찾기와 수열",["repeat-pattern","number-table-rule"]),unit("약속과 스도쿠",["custom-operation","latin-square"])] },
  { id: "book-03", label: "3권", title: "단위넓이와 복면산", units: [unit("단위넓이와 분수",["unit-area-fraction"]),unit("단위길이와 배수",["unit-length-multiple","rod-length-ratio"]),unit("복면산",["cryptarithm"]),unit("마법카드와 마방진",["magic-card","magic-square"])] },
  { id: "book-04", label: "4권", title: "도형분할과 쌓기나무", units: [unit("도형 분할과 움직이기",["congruent-partition","shape-transform"]),unit("색종이 접기와 쌓기나무",["fold-hole-count","cube-count-solid","cube-three-views"]),unit("양팔저울과 비교하기",["balance-scale","height-order"]),unit("논리추리와 자리배치",["person-item-logic","grid-number-placement"])] },
  { id: "book-05", label: "5권", title: "곱셈매트릭스와 삼각수", units: [unit("수 배열표와 달력",["number-table-rule","calendar-weekday-sum"]),unit("최단거리와 숫자 카드",["shortest-path","three-digit-card-count"]),unit("곱셈 매트릭스",["multiplication-matrix"]),unit("삼각수와 사각수",["growing-shape-count"])] },
  { id: "book-06", label: "6권", title: "도형의 둘레와 연속수", units: [unit("수직선의 분할과 비",["number-line-distance","ratio-distribution"]),unit("도형의 둘레",["rectilinear-perimeter","polygon-stone-rearrangement"]),unit("연속수의 합",["consecutive-number-addition","odd-even-sum-difference"]),unit("수와 숫자의 개수",["three-digit-card-count"])] },
  { id: "book-07", label: "7권", title: "달력과 우기기", units: [unit("달력과 시계",["calendar-weekday-sum"]),unit("규칙 찾기와 우기기",["argument-logic","repeat-pattern"]),unit("가로수 심기",["tree-planting"]),unit("팔린드롬과 벤다이어그램",["palindrome","venn-count"])] },
  { id: "book-08", label: "8권", title: "매트릭스와 복면산", units: [unit("묶음수와 매트릭스",["shape-sum-table"]),unit("복면산",["cryptarithm"]),unit("합차와 배수문제",["total-difference","unit-length-multiple"]),unit("거꾸로 생각하기",["reverse-thinking"])] },
  { id: "book-09", label: "9권", title: "도형분할과 논리", units: [unit("도형의 분할과 넓이",["congruent-partition","unit-area-fraction"]),unit("쌓기나무의 개수",["cube-count-solid","cube-hidden-count","cube-fill-box"]),unit("마방진",["magic-square"]),unit("논리 추리",["person-item-logic","chained-number-condition"])] },
  { id: "book-10", label: "10권", title: "연속수와 따라잡기", units: [unit("연속수의 합",["consecutive-number-addition","odd-even-sum-difference"]),unit("따라잡기",["catch-up"]),unit("조건에 맞는 수",["two-digit-condition","chained-number-condition"]),unit("숫자 야구게임",["number-baseball"])] }
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
