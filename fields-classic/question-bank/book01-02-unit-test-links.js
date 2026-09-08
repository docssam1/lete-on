const link = ({
  number,
  typeId = null,
  label,
  sourceLocator,
  sourceVisualSignature,
  verified,
  difficulty = 2,
  reason = null
}) => Object.freeze({
  number,
  typeId,
  label,
  sourceLocator,
  difficulty,
  sourceFidelity: "classified",
  sourceVisualSignature,
  verified,
  ...(reason ? { reason } : {})
});

const contract = (responseKind, answerShape, visualShape, conditionSignature = null) => Object.freeze({
  responseKind,
  answerShape,
  visualShape,
  ...(conditionSignature ? { conditionSignature } : {})
});

const SOURCE_CONTRACTS = Object.freeze({
  "book-01": Object.freeze({
    1: contract("drawing", "draw-partition-multi", "symbol-balanced-partition", "two-source-boards"),
    2: contract("text", "multi-direct-write", "two-digit-horizontal-flip", "two-subproblems"),
    3: contract("text", "multi-direct-write", "two-digit-related-addition", "two-subproblems"),
    4: contract("text", "single-target", "board-two-step-flip-sum", "right-then-down-flip"),
    5: contract("drawing", "draw-symbol-balanced-partition", "four-congruent-regions", "equal-symbol-count"),
    6: contract("text", "multi-target", "diagonal-fold-number-grid", "two-subproblems"),
    7: contract("text", "single-target", "orthogonal-two-fold-number-grid", "two-fold-cut-sum"),
    8: contract("drawing", "draw-unfolded-shape", "two-fold-cut-unfold", "two-fold"),
    9: contract("text", "single-target", "diagonal-fold-number-grid", "diagonal-fold"),
    10: contract("text", "multi-target", "fold-piece-two-shapes", "triangle-and-diamond"),
    11: contract("drawing", "draw-unfolded-punch-shapes", "fold-punch", "two-fold"),
    12: contract("drawing-plus-text", "fill-three-diagrams-and-three-targets", "cross-magic", "three-subproblems"),
    13: contract("drawing-plus-text", "fill-three-diagrams-and-three-targets", "seven-card-magic", "three-subproblems"),
    14: contract("drawing", "fill-all-grid", "eight-card-sum-grid", "all-blanks"),
    15: contract("drawing", "fill-two-triangles", "triangle-edge-sum", "two-subproblems"),
    16: contract("drawing", "fill-all-irregular-gakuro", "irregular-gakuro", "seven-source-cards"),
    17: contract("drawing", "fill-all-ring", "polygon-ring", "ten-cards-line-sum-14"),
    18: contract("text", "multi-target", "ellipse-four-lines", "two-targets"),
    19: contract("text", "single-target", "two-digit-range-and-digit-sum", "range-50-70-sum-8"),
    20: contract("text", "single-target", "even-two-digit-tens-minus-ones", "above-70-tens-minus-ones-4"),
    21: contract("text", "single-target", "fixed-three-digit-condition", "place-conditions-single-answer"),
    22: contract("text", "single-target", "three-person-three-fruit", "three-people"),
    23: contract("text", "single-target", "four-child-four-color", "four-children"),
    24: contract("text", "single-target", "three-job-three-place", "three-people"),
    25: contract("text", "single-target", "four-person-height-third", "four-people-third-tallest")
  }),
  "book-02": Object.freeze({
    1: contract("text", "single-target", "shape-matrix-3x3", "last-column-target"),
    2: contract("text", "single-target", "shape-matrix-4x4", "first-row-target"),
    3: contract("text", "multi-target", "total-difference-two-counts", "sum-and-difference"),
    4: contract("text", "single-target", "equalize-transfer", "transfer-to-equal"),
    5: contract("text", "multi-target", "total-difference-two-counts", "total-and-difference"),
    6: contract("text", "single-target", "distinct-shape-equations", "values-2-5"),
    7: contract("text", "single-target", "balance-given-unit", "substitute-then-divide-then-add"),
    8: contract("text", "single-target", "distinct-shape-equations", "values-2-5"),
    9: contract("text", "single-target", "balance-given-unit", "substitute-divide-add-divide"),
    10: contract("drawing", "single-visual-target", "repeating-symbol", "two-subproblems"),
    11: contract("drawing", "single-visual-target", "repeating-symbol", "single-target-shape"),
    12: contract("text", "multi-target", "two-independent-sequences", "two-subproblems"),
    13: contract("text", "single-target", "house-matchstick-stage", "stage-7"),
    14: contract("text", "single-target", "colored-triangle-stage", "stage-8"),
    15: contract("text", "single-target", "pieces-to-fold-count", "reverse-direction"),
    16: contract("text", "single-target", "row-rule", "fixed-rule"),
    17: contract("text", "single-target", "row-rule", "fixed-minus-middle-rule"),
    18: contract("text", "single-target", "triangle-center-rule", "triangle-layout"),
    19: contract("drawing", "fill-all-sudoku", "sudoku-three-region", "all-blanks"),
    20: contract("drawing", "fill-all-sudoku", "sudoku-four-square-region", "all-blanks"),
    21: contract("text", "single-target", "diamond-center-rule", "fixed-rule"),
    22: contract("text", "single-target", "shape-matrix-3x4", "second-row-target"),
    23: contract("text", "single-target", "distinct-shape-equations-four-shapes", "values-1-9-three-relations"),
    24: contract("text", "single-target", "reverse-transfer", "initial-value-from-final"),
    25: contract("text", "single-target", "first-white-exceeds-black-stage", "first-stage-white-exceeds-black")
  })
});

const GENERATOR_CONTRACTS = Object.freeze({
  "symbol-balanced-congruent-partition": contract("drawing", "draw-partition", "symbol-balanced-partition", "one-source-board"),
  "digital-two-digit-transform": contract("text", "choice-single", "two-digit-half-turn", "one-subproblem"),
  "digital-transform-addition": contract("text", "single-target", "two-digit-related-addition", "one-subproblem"),
  "digital-transform-board-sum": contract("text", "single-target", "board-one-turn-sum", "right-quarter-turn"),
  "rotational-partition-four": contract("drawing", "draw-partition", "four-congruent-regions", "no-symbol-count"),
  "fold-number-cut-sum-textbook": contract("text", "single-target", "orthogonal-two-fold-number-grid", "two-fold-cut-sum"),
  "fold-cut-piece-count": contract("text", "single-target", "fold-piece-total", "one-total"),
  "fold-punch-shape-count": contract("text", "multi-target", "fold-punch", "count-shapes"),
  "cross-shape-magic-sum": contract("drawing-plus-text", "fill-one-diagram-and-one-target", "cross-magic", "one-subproblem"),
  "circular-magic-seven-line-sum": contract("drawing-plus-text", "fill-one-diagram-and-one-target", "seven-card-magic", "one-subproblem"),
  "equal-line-sum-eight-cards": contract("text", "single-target", "eight-card-target", "one-target"),
  "triangle-edge-sum-six": contract("drawing", "fill-one-triangle", "triangle-edge-sum", "one-subproblem"),
  "gakuro-grid-irregular-sum": contract("drawing", "fill-all-irregular-gakuro", "irregular-gakuro", "six-generated-cards"),
  "polygon-ring-equal-sum": contract("drawing", "fill-all-ring", "polygon-ring", "ten-cards-line-sum-14"),
  "circle-line-ring-equal-sum": contract("text", "single-target", "ellipse-four-lines", "one-target"),
  "two-digit-condition": contract("text", "single-target", "sum-and-difference", "sum-and-gap"),
  "two-digit-even-ones-greater-gap": contract("text", "single-target", "even-two-digit-ones-minus-tens", "ones-minus-tens"),
  "three-digit-step-sequence": contract("text", "multi-target", "sequence-blanks", "blank-sequence"),
  "person-item-logic": contract("text", "single-target", "four-person-four-fruit", "four-people"),
  "relative-order-logic": contract("text", "single-target", "five-person-order", "five-people"),
  "shape-sum-table": contract("text", "single-target", "shape-matrix-2x2", "second-row-target"),
  "total-difference": contract("text", "single-target", "total-difference-one-count", "sum-and-difference"),
  "equalize-transfer": contract("text", "single-target", "equalize-transfer", "transfer-to-equal"),
  "distinct-shape-value-equation": contract("text", "single-target", "distinct-shape-equations-five-shapes", "values-1-9-four-relations"),
  "balance-given-unit-weight": contract("text", "single-target", "balance-given-unit", "multiply-multiply-add"),
  "repeating-symbol-sequence": contract("text", "single-visual-target", "repeating-symbol", "one-subproblem"),
  "interleaved-number-sequence": contract("text", "multi-target", "interleaved-two-strands", "one-interleaved-problem"),
  "matchstick-shared-polygon-growth": contract("text", "single-target", "square-matchstick-stage", "variable-stage"),
  "colored-triangle-growth": contract("text", "single-target", "colored-triangle-stage", "variable-stage"),
  "repeated-fold-cut-count": contract("text", "single-target", "fold-stage-to-pieces", "stage-to-pieces"),
  "number-grid-row-rule": contract("text", "single-target", "row-rule", "variable-family"),
  "four-number-center-rule": contract("text", "single-target", "diamond-center-rule", "variable-family"),
  "sudoku-three-region": contract("text", "single-target", "sudoku-target-cell", "one-target"),
  "sudoku-four-square-region": contract("text", "single-target", "sudoku-target-cell", "one-target"),
  "reverse-transfer-total": contract("text", "single-target", "reverse-transfer", "initial-value-from-final"),
  "triangular-stone-growth": contract("text", "single-target", "stage-to-difference", "stage-to-difference")
});

const SOURCE_GENERATOR_CONTRACTS = Object.freeze({
  "book-02:1": contract("text", "single-target", "shape-matrix-3x3", "last-column-target"),
  "book-02:2": contract("text", "single-target", "shape-matrix-4x4", "first-row-target"),
  "book-02:22": contract("text", "single-target", "shape-matrix-3x4", "second-row-target")
});

const withContracts = (bookId, links) => links.map((entry) => Object.freeze({
  ...entry,
  sourceContract: SOURCE_CONTRACTS[bookId][entry.number],
  generatorContract: entry.typeId ? SOURCE_GENERATOR_CONTRACTS[`${bookId}:${entry.number}`] || GENERATOR_CONTRACTS[entry.typeId] || null : null,
  generationCaseMode: entry.sourceFidelity === "exact-generator" ? "source" : "variant-from-source"
}));

export const LEARNER_STAGE = "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정";

export const BOOK01_UNIT_TEST_LINKS = Object.freeze(withContracts("book-01", [
  link({ number: 1, typeId: "symbol-balanced-congruent-partition", label: "1·2·3·4가 한 개씩 들어가게 네 조각으로 나누기", sourceLocator: "book01-unit-test:q01", sourceVisualSignature: "4x4-grid-four-symbols-congruent-four-way-partition", verified: false, reason: "원본은 두 문제를 모두 그리는 응답인데 현재 generator는 한 문제만 생성합니다." }),
  link({ number: 2, typeId: "digital-two-digit-transform", label: "두 자리 수 오른쪽 뒤집기 두 칸 쓰기", sourceLocator: "book01-unit-test:q02", sourceVisualSignature: "two-digit-right-flip-two-direct-write-blanks", verified: false, reason: "원본은 오른쪽으로 뒤집은 결과를 두 칸에 직접 쓰지만 현재 generator는 반 바퀴 결과를 고르는 단일 choice 계약입니다." }),
  link({ number: 3, typeId: "digital-transform-addition", label: "두 자리 수 반 바퀴와 덧셈 두 문항", sourceLocator: "book01-unit-test:q03", sourceVisualSignature: "two-digit-half-turn-related-addition-two-subproblems", verified: false, reason: "원본은 두 개의 덧셈식을 직접 완성하지만 현재 generator는 한 개의 단일 target만 반환합니다." }),
  link({ number: 4, typeId: "digital-transform-board-sum", label: "숫자판 두 단계 뒤집기와 합", sourceLocator: "book01-unit-test:q04", sourceVisualSignature: "three-by-three-board-right-then-down-flip-sum", verified: false, reason: "원본은 오른쪽·아래 두 단계 뒤집기인데 현재 generator는 오른쪽 반의 반 바퀴 한 단계만 지원합니다." }),
  link({ number: 5, typeId: "rotational-partition-four", label: "기호 개수 조건 네 조각 분할", sourceLocator: "book01-unit-test:q05", sourceVisualSignature: "symbol-count-balanced-four-congruent-regions", verified: false, reason: "원본은 각 영역의 기호 개수 조건을 포함하지만 현재 generator는 기호 균형 조건 없이 네 합동 영역만 생성합니다." }),
  link({ number: 6, label: "대각선 접기 숫자 합", sourceLocator: "book01-unit-test:q06", sourceVisualSignature: "diagonal-fold-number-grid-cut-sum", verified: false, reason: "원본은 대각선 한 번 접기 숫자판 합 구조이며 현재 CURRICULUM[0]에 동일 응답 계약의 typeId가 없습니다." }),
  link({ number: 7, typeId: "fold-number-cut-sum-textbook", label: "두 번 접은 수의 합", sourceLocator: "book01-unit-test:q07", sourceVisualSignature: "orthogonal-two-fold-number-grid-cut-sum", verified: true }),
  link({ number: 8, label: "두 번 접은 모양 펼쳐 그리기", sourceLocator: "book01-unit-test:q08", sourceVisualSignature: "two-fold-cut-unfold-drawing", verified: false, reason: "원본은 펼친 모양을 그리는 drawing 응답인데 현재 CURRICULUM[0]의 유사 후보 fold-cut-shape-choice는 객관식 선택 응답이라 연결하지 않았습니다." }),
  link({ number: 9, label: "대각선 접기 숫자 합", sourceLocator: "book01-unit-test:q09", sourceVisualSignature: "diagonal-fold-number-grid-cut-sum", verified: false, reason: "원본은 대각선 한 번 접기 숫자판 합 구조이며 현재 CURRICULUM[0]에 동일 응답 계약의 typeId가 없습니다." }),
  link({ number: 10, typeId: "fold-cut-piece-count", label: "접어 자른 두 종류 조각 수", sourceLocator: "book01-unit-test:q10", sourceVisualSignature: "two-fold-cut-triangle-and-diamond-piece-count", verified: false, reason: "원본은 삼각형과 마름모 두 종류의 개수를 모두 쓰지만 현재 generator는 전체 조각 수 한 값만 반환합니다." }),
  link({ number: 11, typeId: "fold-punch-shape-count", label: "펀치 후 펼친 모양 그리기", sourceLocator: "book01-unit-test:q11", sourceVisualSignature: "two-fold-punch-unfolded-shape-drawing", verified: false, reason: "원본은 펼친 구멍 모양을 그리는 drawing 응답인데 현재 generator는 반원·원 개수를 텍스트로 반환합니다." }),
  link({ number: 12, typeId: "cross-shape-magic-sum", label: "세 개의 십자 수 퍼즐 채우기", sourceLocator: "book01-unit-test:q12", sourceVisualSignature: "three-cross-diagrams-and-three-line-sums", verified: false, reason: "원본은 세 도형과 세 합을 채우지만 현재 generator는 한 십자 도형과 한 합만 생성합니다." }),
  link({ number: 13, typeId: "circular-magic-seven-line-sum", label: "세 개의 일곱 수 퍼즐 채우기", sourceLocator: "book01-unit-test:q13", sourceVisualSignature: "three-seven-card-magic-diagrams-and-three-sums", verified: false, reason: "원본은 세 도형과 세 합을 채우지만 현재 generator는 한 도형과 한 합만 생성합니다." }),
  link({ number: 14, typeId: "equal-line-sum-eight-cards", label: "8장 수 배열 전체 채우기", sourceLocator: "book01-unit-test:q14", sourceVisualSignature: "eight-card-three-by-three-fill-all-blanks", verified: false, reason: "원본은 여러 빈칸을 전부 채우는 drawing/grid 응답인데 현재 generator는 한 target 수만 반환합니다." }),
  link({ number: 15, typeId: "triangle-edge-sum-six", label: "두 삼각형 전체 채우기", sourceLocator: "book01-unit-test:q15", sourceVisualSignature: "two-six-card-triangle-fill-all-blanks", verified: false, reason: "원본은 두 삼각형을 모두 채우지만 현재 generator는 한 삼각형만 생성합니다." }),
  link({ number: 16, typeId: "gakuro-grid-irregular-sum", label: "불규칙한 수 퍼즐 전체 채우기", sourceLocator: "book01-unit-test:q16", sourceVisualSignature: "seven-card-irregular-gakuro-fill-all", verified: false, reason: "원본은 일곱 원본 카드를 쓰는 전체 채우기인데 현재 generator는 다른 카드 범위의 여섯 카드 변형을 생성합니다." }),
  link({ number: 17, typeId: "polygon-ring-equal-sum", label: "오각형 둘레의 수 채우기", sourceLocator: "book01-unit-test:q17", sourceVisualSignature: "ten-card-polygon-ring-three-number-line-sum", verified: true }),
  link({ number: 18, typeId: "circle-line-ring-equal-sum", label: "타원 직선 네 줄 합 두 답", sourceLocator: "book01-unit-test:q18", sourceVisualSignature: "five-card-ellipse-four-line-two-targets", verified: false, reason: "원본은 두 개의 합을 답하지만 현재 generator는 한 target만 반환합니다." }),
  link({ number: 19, typeId: "two-digit-condition", label: "50~70 범위와 자리 합 조건", sourceLocator: "book01-unit-test:q19", sourceVisualSignature: "two-digit-range-50-70-digit-sum-8", verified: false, reason: "원본은 50~70 범위와 자리 합 조건인데 현재 generator는 자리 합과 자리 차 조건입니다." }),
  link({ number: 20, typeId: "two-digit-even-ones-greater-gap", label: "짝수·십의 자리 큰 차 조건", sourceLocator: "book01-unit-test:q20", sourceVisualSignature: "even-two-digit-tens-minus-ones-4", verified: false, reason: "원본은 십의 자리가 일의 자리보다 4 큰 조건인데 현재 generator는 반대 방향인 일의 자리 큰 차를 생성합니다." }),
  link({ number: 21, typeId: "three-digit-step-sequence", label: "자리 조건에 맞는 세 자리 수", sourceLocator: "book01-unit-test:q21", sourceVisualSignature: "fixed-three-digit-place-conditions", verified: false, reason: "원본은 자리 조건을 만족하는 한 수를 찾지만 현재 generator는 연속 수열의 빈칸 여러 개를 반환합니다." }),
  link({ number: 22, typeId: "person-item-logic", label: "세 사람과 과일 조건", sourceLocator: "book01-unit-test:q22", sourceVisualSignature: "three-person-three-fruit-logic-clues", verified: false, reason: "원본은 세 사람·세 과일인데 현재 generator는 네 사람·네 과일 조건표입니다." }),
  link({ number: 23, typeId: "person-item-logic", label: "네 아이와 색 조건", sourceLocator: "book01-unit-test:q23", sourceVisualSignature: "four-child-four-color-logic-clues", verified: false, reason: "원본은 네 아이·네 색인데 현재 generator는 네 사람·네 과일 조건표입니다." }),
  link({ number: 24, typeId: "person-item-logic", label: "직업과 장소 조건", sourceLocator: "book01-unit-test:q24", sourceVisualSignature: "three-job-three-place-logic-clues", verified: false, reason: "원본은 세 직업·세 장소인데 현재 generator는 네 사람·네 과일 조건표입니다." }),
  link({ number: 25, typeId: "relative-order-logic", label: "네 사람 키 순서로 셋째 찾기", sourceLocator: "book01-unit-test:q25", sourceVisualSignature: "four-person-height-third-tallest", verified: false, reason: "원본은 네 사람의 키에서 셋째를 찾지만 현재 generator는 다섯 사람의 줄 순서를 묻습니다." })
]));

export const BOOK02_UNIT_TEST_LINKS = Object.freeze(withContracts("book-02", [
  link({ number: 1, typeId: "shape-sum-table", label: "같은 도형 3개인 세로줄부터 마지막 세로 합 구하기", sourceLocator: "book02-unit-test:q01", sourceVisualSignature: "shape-matrix-3x3-last-column", verified: true }),
  link({ number: 2, typeId: "shape-sum-table", label: "같은 도형 4개인 세로줄부터 첫 가로 합 구하기", sourceLocator: "book02-unit-test:q02", sourceVisualSignature: "shape-matrix-4x4-first-row", verified: true }),
  link({ number: 3, typeId: "total-difference", label: "합과 차로 두 양 모두 구하기", sourceLocator: "book02-unit-test:q03", sourceVisualSignature: "two-person-total-and-difference-two-targets", verified: false, reason: "원본은 두 사람의 수를 모두 구하지만 현재 generator는 한 사람의 수만 반환합니다." }),
  link({ number: 4, typeId: "equalize-transfer", label: "주고받아 똑같이 만들기", sourceLocator: "book02-unit-test:q04", sourceVisualSignature: "two-quantity-equalization-transfer", verified: true }),
  link({ number: 5, typeId: "total-difference", label: "전체와 차로 두 반 모두 구하기", sourceLocator: "book02-unit-test:q05", sourceVisualSignature: "two-group-total-and-difference-two-targets", verified: false, reason: "원본은 두 반의 학생 수를 모두 구하지만 현재 generator는 한 값만 반환합니다." }),
  link({ number: 6, typeId: "distinct-shape-value-equation", label: "2~5 도형 값", sourceLocator: "book02-unit-test:q06", sourceVisualSignature: "distinct-shape-equations-values-2-5", verified: false, reason: "원본 조건 범위는 2~5인데 현재 generator는 1~9 서로 다른 값 범위입니다." }),
  link({ number: 7, typeId: "balance-given-unit-weight", label: "저울에서 바꾸고 등분해 별의 무게 찾기", sourceLocator: "book02-unit-test:q07", sourceVisualSignature: "balance-substitute-divide-add", verified: false, reason: "원본은 두 물건의 합을 등분하는 단계가 필요하지만 현재 생성기는 단위 무게를 곱하고 더하기만 합니다." }),
  link({ number: 8, typeId: "distinct-shape-value-equation", label: "2~5 도형 값 식", sourceLocator: "book02-unit-test:q08", sourceVisualSignature: "distinct-shape-equations-values-2-5", verified: false, reason: "원본 조건 범위는 2~5인데 현재 generator는 1~9 서로 다른 값 범위입니다." }),
  link({ number: 9, typeId: "balance-given-unit-weight", label: "저울에서 두 번 등분해 별의 무게 찾기", sourceLocator: "book02-unit-test:q09", sourceVisualSignature: "balance-substitute-divide-add-divide", verified: false, reason: "원본에는 네모와 별을 구할 때 각각 등분하는 단계가 있지만 현재 생성기에는 등분이 없습니다." }),
  link({ number: 10, typeId: "repeating-symbol-sequence", label: "반복 도형 다음 모양 두 문항", sourceLocator: "book02-unit-test:q10", sourceVisualSignature: "repeating-symbol-pattern-two-subproblems-visual-write", verified: false, reason: "원본은 두 문항의 모양을 직접 쓰는 visual 응답인데 현재 generator는 한 문항의 텍스트 target입니다." }),
  link({ number: 11, typeId: "repeating-symbol-sequence", label: "반복 도형 다음 모양 쓰기", sourceLocator: "book02-unit-test:q11", sourceVisualSignature: "repeating-symbol-pattern-visual-write", verified: false, reason: "원본은 빈 상자에 모양을 쓰는 visual 응답인데 현재 generator는 텍스트 답을 반환합니다." }),
  link({ number: 12, typeId: "interleaved-number-sequence", label: "독립 수열 두 문항", sourceLocator: "book02-unit-test:q12", sourceVisualSignature: "two-independent-number-sequences-two-targets", verified: false, reason: "원본은 독립된 두 수열이고 현재 generator는 한 수열 안의 두 interleaved strand입니다." }),
  link({ number: 13, typeId: "matchstick-shared-polygon-growth", label: "성냥개비 집 7번째", sourceLocator: "book02-unit-test:q13", sourceVisualSignature: "shared-side-house-growth-stage-7", verified: false, reason: "원본은 집 도형 7번째 조건인데 현재 generator는 네모 도형의 가변 단계입니다." }),
  link({ number: 14, typeId: "colored-triangle-growth", label: "색칠 삼각형 8번째 차", sourceLocator: "book02-unit-test:q14", sourceVisualSignature: "black-white-triangle-growth-stage-8", verified: false, reason: "원본은 8번째 단계인데 현재 generationCase의 difficulty 2 generator 범위는 5~7번째입니다." }),
  link({ number: 15, typeId: "repeated-fold-cut-count", label: "조각 수에서 접은 횟수 역산", sourceLocator: "book02-unit-test:q15", sourceVisualSignature: "fold-pieces-to-fold-count-reverse", verified: false, reason: "원본은 결과 조각 수에서 접은 횟수를 역산하지만 현재 generator는 접은 횟수에서 조각 수를 계산합니다." }),
  link({ number: 16, typeId: "number-grid-row-rule", label: "수 표 규칙 한 칸 찾기", sourceLocator: "book02-unit-test:q16", sourceVisualSignature: "four-by-four-row-rule-fixed-family", verified: false, reason: "원본의 고정된 행 계산 약속을 현재 generator가 source별로 고정하지 않고 family와 빈칸 위치를 변형합니다." }),
  link({ number: 17, typeId: "number-grid-row-rule", label: "수열 줄 규칙 한 칸 찾기", sourceLocator: "book02-unit-test:q17", sourceVisualSignature: "four-row-minus-middle-fixed-rule", verified: false, reason: "원본은 고정된 minus-middle 규칙인데 현재 generator는 difficulty 2에서 sum/minus family를 무작위 선택합니다." }),
  link({ number: 18, typeId: "four-number-center-rule", label: "삼각형 가운데 규칙", sourceLocator: "book02-unit-test:q18", sourceVisualSignature: "triangle-center-rule", verified: false, reason: "원본은 삼각형 배치의 가운데 값인데 현재 generator는 다이아몬드 네 수 규칙입니다." }),
  link({ number: 19, typeId: "sudoku-three-region", label: "3×3 숫자 퍼즐 모두 채우기", sourceLocator: "book02-unit-test:q19", sourceVisualSignature: "three-by-three-irregular-region-fill-all", verified: false, reason: "원본은 숫자 퍼즐 빈칸 전체를 채우는 drawing 응답인데 현재 generator는 한 target cell만 묻습니다." }),
  link({ number: 20, typeId: "sudoku-four-square-region", label: "4×4 숫자 퍼즐 모두 채우기", sourceLocator: "book02-unit-test:q20", sourceVisualSignature: "four-by-four-square-region-fill-all", verified: false, reason: "원본은 숫자 퍼즐 빈칸 전체를 채우는 drawing 응답인데 현재 generator는 한 target cell만 묻습니다." }),
  link({ number: 21, typeId: "four-number-center-rule", label: "네 수 가운데 규칙", sourceLocator: "book02-unit-test:q21", sourceVisualSignature: "diamond-center-fixed-rule", verified: false, reason: "원본의 다이아몬드별 고정 규칙을 현재 generator가 difficulty 2에서 두 family 중 무작위로 선택합니다." }),
  link({ number: 22, typeId: "shape-sum-table", label: "두 가로줄을 비교하고 세로 합으로 가운데 가로 합 구하기", sourceLocator: "book02-unit-test:q22", sourceVisualSignature: "shape-matrix-3x4-second-row", verified: true }),
  link({ number: 23, typeId: "distinct-shape-value-equation", label: "서로 다른 네 도형의 세 식으로 값 찾기", sourceLocator: "book02-unit-test:q23", sourceVisualSignature: "four-distinct-shapes-three-relations-values-1-9", verified: false, reason: "원본은 네 도형의 세 식에서 묶음을 맞추는 구조인데 현재 생성기는 다섯 도형의 네 식을 두 배씩 연결합니다." }),
  link({ number: 24, typeId: "reverse-transfer-total", label: "받은 뒤의 수에서 처음 수 역산", sourceLocator: "book02-unit-test:q24", sourceVisualSignature: "reverse-transfer-two-person-story", verified: true }),
  link({ number: 25, typeId: "triangular-stone-growth", label: "흰 돌이 검은 돌보다 처음 많아지는 단계", sourceLocator: "book02-unit-test:q25", sourceVisualSignature: "first-stage-white-exceeds-black", verified: false, reason: "원본은 흰 돌이 검은 돌보다 처음 많아지는 단계를 찾지만 현재 generator는 주어진 단계에서 두 색 돌의 차이를 계산합니다." })
]));

export const BOOK01_02_UNIT_TEST_LINKS = Object.freeze({
  "book-01": BOOK01_UNIT_TEST_LINKS,
  "book-02": BOOK02_UNIT_TEST_LINKS
});
