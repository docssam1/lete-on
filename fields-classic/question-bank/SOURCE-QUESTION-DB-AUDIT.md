# Source Question DB Audit

- 실행 명령: `node fields-classic/question-bank/source-question-db-audit.mjs`
- 원본 참조 레코드: 2198
- 고유 예상 sourceKey: 2198
- 실제 SOURCE_QUESTION_INDEX 레코드: 2198
- 참조된 세부 유형: 785 / 전체 TYPES: 835
- 결과: PASS

## 누락·중복 대조

- 색인 누락: 0건
- 예상 밖 색인: 0건
- 색인 중복 sourceKey: 0건

## 필수 메타데이터 오류

- 없음

## 미검증 원본 문항

- 없음

## 미사용·미연결 분류 자리

현재 어떤 시험·단원 테스트·교재 본문에도 참조되지 않고 생성기 또는 학습지 경로도 없는 TYPES입니다. 삭제하지 않고 다음 원본 대조 대상 후보로 보존합니다.

- 없음

## 구형 상위 유형 정본 연결

문제를 직접 만들지 않는 예전 상위명 40개를 검증된 세부 유형 목록에 연결했습니다. 일대다 상위명은 임의의 한 생성기로 축약하지 않습니다.

- number-table-rule → addition-table-grid, addition-table-grid-offset, arrow-number-grid
- shape-equation → shape-equation-add-subtract, symbol-relation, vertical-cryptarithm-shape-sum
- number-line-distance → number-line-six-points, number-line-unit-distance-book6, number-line-two-part-distance
- height-order → g1-height-order-four, g1-summer-height-order-five
- multi-person-transfer → g1-fall-three-person-total-transfer
- cryptarithm → two-digit-letter-cryptarithm, diagnostic-two-digit-cryptarithm, vertical-shape-cryptarithm-values
- multiplicative-symbol-equation → g1-multiplicative-symbol-chain, symbol-product-pair, symbol-mixed-operation-grid
- rod-length-ratio → g1-rod-ratio-total, rod-ratio-total-book3, rod-comparison-total-unit-test
- colored-triangle-difference → g1-triangle-color-difference, g1-summer-triangular-color-difference
- polygon-stone-rearrangement → g1-polygon-stone-rearrangement, polygon-border-shape-conversion-b7
- ratio-distribution → g1-ratio-distribution, g1-summer-orange-ratio-distribution, g1-fall-total-triple-share
- odd-even-sum-difference → g1-odd-even-sum-difference, unit-test-book10-q25
- weight-order → g1-summer-five-box-weight-order, measurement-order-chain
- adjacent-product-pentagon → g1-summer-pentagon-adjacent-product, g1-fall-pentagon-adjacent-products-all
- segment-count → g1-summer-circle-point-segments
- square-side-composition → g1-summer-square-side-composition, g1-fall-stacked-square-side-chain
- rectilinear-perimeter → g1-summer-rectilinear-perimeter, rectilinear-perimeter-book6
- latin-square → sudoku-three-row-column, sudoku-three-region, sudoku-four-square-region, sudoku-four-irregular-region
- consecutive-number-addition → consecutive-vertical-addition-b10, g1-fall-consecutive-three-sum-completion
- step-game → g1-winter-opponent-step-game
- multiplication-matrix → multiplication-table-pattern, multiplication-matrix-products, multiplication-matrix-placement
- three-digit-card-count → g1-winter-three-digit-cards-above
- venn-count → set-union-count, neither-set-count, venn-neither-b7
- congruent-partition → congruent-equal-sum-partition-draw, symbol-balanced-congruent-partition, star-congruent-partition-draw-book4
- calendar-weekday-sum → calendar-all-weekday-sum, calendar-same-weekday-sum, calendar-weekday-sum-year-boundary-book5
- custom-operation → two-custom-operations
- operator-insertion → plus-minus-multi-target, number-card-plus-minus
- function-machine → two-function-machine-chain, g1-fall-linear-input-output-table
- fold-diagonal-unfold → three-fold-line-unfold, fold-cut-unfold-one-draw, fold-cut-unfold-two-draw
- shape-transform → shape-flip-composition, shape-quarter-half-turn, shape-rotate-flip-grid
- gakuro → gakuro-card-placement, gakuro-card-rectangle-placement, gakuro-card-irregular-placement, gakuro-grid-sum, gakuro-grid-nine-sum, gakuro-grid-irregular-sum
- shortest-path → shortest-path-rectangle, shortest-path-irregular-grid, shortest-path-via-waypoint, shortest-path-diagonal-shortcut-book5
- tree-planting → closed-perimeter-object-count-b7, between-objects-subdivision-count-b7, inner-outer-path-object-count-b7
- palindrome → palindrome-length-count-b7, three-digit-palindrome-digit-sum-b7, calendar-date-palindrome-b7, clock-time-palindrome-b7, reverse-add-palindrome-b7
- catch-up → catch-up-growing-amount-b10, catch-up-shrinking-amount-b10, catch-up-distance-b10, delayed-start-catch-up-b10
- number-baseball → number-baseball-b10
- unit-area-fraction → unit-grid-area, equal-part-shaded-fraction, incomplete-partition-fraction, paired-hexagon-fractions, triangle-twelve-part-fraction, concentric-square-sixteen-fraction
- unit-length-multiple → aligned-rod-common-length, g1-summer-one-three-rods, rod-ratio-total-book3
- magic-card → binary-weight-selection, colored-cell-number-code, four-cell-binary-code
- argument-logic → truth-lie-ranking, exact-one-ranking-predictions-b9, exact-one-answer-assignment-b9

## 판정

모든 원본 참조가 문항 DB에 연결되고 필수 메타데이터가 확인되었습니다.
