# Source Question DB Audit

- 실행 명령: `node fields-classic/question-bank/source-question-db-audit.mjs`
- 원본 참조 레코드: 2198
- 고유 예상 sourceKey: 2198
- 실제 SOURCE_QUESTION_INDEX 레코드: 2198
- 참조된 세부 유형: 782 / 전체 TYPES: 832
- 결과: PASS (미검증 3문항은 의도적으로 선택 잠금)

## 누락·중복 대조

- 색인 누락: 0건
- 예상 밖 색인: 0건
- 색인 중복 sourceKey: 0건

## 필수 메타데이터 오류

- 없음

## 미검증 원본 문항

- unit-test:book-03:q3
- unit-test:book-03:q4
- unit-test:book-03:q5

## 미사용·미연결 분류 자리

현재 어떤 시험·단원 테스트·교재 본문에도 참조되지 않고 생성기 또는 학습지 경로도 없는 TYPES입니다. 삭제하지 않고 다음 원본 대조 대상 후보로 보존합니다.

- adjacent-product-pentagon
- argument-logic
- calendar-weekday-sum
- catch-up
- colored-triangle-difference
- congruent-partition
- consecutive-number-addition
- cryptarithm
- custom-operation
- fold-diagonal-unfold
- function-machine
- gakuro
- height-order
- latin-square
- magic-card
- multi-person-transfer
- multiplication-matrix
- multiplicative-symbol-equation
- number-baseball
- number-line-distance
- number-table-rule
- odd-even-sum-difference
- operator-insertion
- palindrome
- polygon-stone-rearrangement
- ratio-distribution
- rectilinear-perimeter
- rod-length-ratio
- segment-count
- shape-equation
- shape-transform
- shortest-path
- square-side-composition
- step-game
- three-digit-card-count
- tree-planting
- unit-area-fraction
- unit-length-multiple
- venn-count
- weight-order

## 판정

원본 문항 키와 필수 메타데이터는 모두 들어 있습니다. unit-test:book-03:q3, unit-test:book-03:q4, unit-test:book-03:q5은 공식 답 그림 또는 교사용 해설이 확보되지 않아 `verified: false`로 유지하며, 문제은행 선택 화면에서는 계속 잠급니다.
