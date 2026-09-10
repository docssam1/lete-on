(function(root){'use strict';
 const entries=[
 {
  "key": "challenge-concept-1",
  "label": "개념 교재 1권",
  "kind": "concept",
  "round": 1
 },
 {
  "key": "challenge-concept-2",
  "label": "개념 교재 2권",
  "kind": "concept",
  "round": 2
 },
 {
  "key": "challenge-mock-1",
  "label": "모의고사 1회",
  "kind": "mock",
  "round": 1
 },
 {
  "key": "challenge-mock-2",
  "label": "모의고사 2회",
  "kind": "mock",
  "round": 2
 },
 {
  "key": "challenge-mock-3",
  "label": "모의고사 3회",
  "kind": "mock",
  "round": 3
 },
 {
  "key": "challenge-mock-4",
  "label": "모의고사 4회",
  "kind": "mock",
  "round": 4
 },
 {
  "key": "challenge-bank-replace-count-constraints",
  "typeId": "replace-count-constraints",
  "label": "여러 수 조건을 함께 만족하기",
  "area": "수와 연산",
  "round": 1,
  "section": "main",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-split-merge-chain",
  "typeId": "split-merge-chain",
  "label": "수 가르기와 모으기",
  "area": "수와 연산",
  "round": 1,
  "section": "main",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-mock-balance-substitution-pictures",
  "typeId": "mock-balance-substitution-pictures",
  "label": "수평 저울의 무게 바꾸기",
  "area": "문제 해결",
  "round": 1,
  "section": "main",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-triangle-number-rule",
  "typeId": "triangle-number-rule",
  "label": "삼각형 수의 규칙",
  "area": "규칙",
  "round": 1,
  "section": "main",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-divided-square-cycle",
  "typeId": "replace-divided-square-cycle",
  "label": "반복되는 그림 규칙",
  "area": "규칙",
  "round": 1,
  "section": "main",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-total-difference",
  "typeId": "total-difference",
  "label": "합과 차로 두 수 찾기",
  "area": "문제 해결",
  "round": 1,
  "section": "main",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-rotated-grid-pair",
  "typeId": "rotated-grid-pair",
  "label": "돌려서 같은 그림 찾기",
  "area": "평면 지각",
  "round": 1,
  "section": "main",
  "number": 7,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-mountain-digit-count",
  "typeId": "mountain-digit-count",
  "label": "늘어나는 수 배열 세기",
  "area": "규칙",
  "round": 1,
  "section": "main",
  "number": 8,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-apartment-floor-order",
  "typeId": "apartment-floor-order",
  "label": "조건을 연결해 순서 찾기",
  "area": "논리 추리",
  "round": 1,
  "section": "main",
  "number": 9,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-house-between",
  "typeId": "replace-house-between",
  "label": "사이와 가운데 위치",
  "area": "논리 추리",
  "round": 1,
  "section": "main",
  "number": 10,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-card-sum-count",
  "typeId": "card-sum-count",
  "label": "합이 되는 카드 고르기",
  "area": "경우의 수",
  "round": 1,
  "section": "main",
  "number": 11,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-mock-dice-target-bottom",
  "typeId": "mock-dice-target-bottom",
  "label": "주사위 굴리기",
  "area": "공간 지각",
  "round": 1,
  "section": "main",
  "number": 12,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-arrow-number-move",
  "typeId": "arrow-number-move",
  "label": "방향에 따른 수 이동",
  "area": "규칙",
  "round": 1,
  "section": "main",
  "number": 13,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-mock-object-length-equivalence",
  "typeId": "mock-object-length-equivalence",
  "label": "물건으로 길이 비교",
  "area": "문제 해결",
  "round": 1,
  "section": "main",
  "number": 14,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-minimum-sum-pyramid",
  "typeId": "minimum-sum-pyramid",
  "label": "카드 배치에 따른 합 비교",
  "area": "문제 해결",
  "round": 1,
  "section": "main",
  "number": 15,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-paper-remainder",
  "typeId": "replace-paper-remainder",
  "label": "남은 양을 나누기",
  "area": "문제 해결",
  "round": 1,
  "section": "main",
  "number": 16,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-age-chain",
  "typeId": "replace-age-chain",
  "label": "나이 관계 연결하기",
  "area": "지문 이해",
  "round": 1,
  "section": "main",
  "number": 17,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-cube-count-fill",
  "typeId": "cube-count-fill",
  "label": "쌓기나무 채우기",
  "area": "공간 지각",
  "round": 1,
  "section": "main",
  "number": 18,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-rectangle-count",
  "typeId": "rectangle-count",
  "label": "선을 따라 사각형 세기",
  "area": "평면 지각",
  "round": 1,
  "section": "main",
  "number": 19,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-four-cell-code",
  "typeId": "four-cell-code",
  "label": "그림으로 나타낸 수",
  "area": "규칙",
  "round": 1,
  "section": "main",
  "number": 20,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-digit-multiselect",
  "typeId": "extra-digit-multiselect",
  "label": "여러 수 조건을 함께 만족하기",
  "area": "수와 연산",
  "round": 1,
  "section": "extra",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-priority-cube-top-view",
  "typeId": "priority-cube-top-view",
  "label": "위에서 본 모양",
  "area": "공간 지각",
  "round": 1,
  "section": "extra",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-priority-fold-holes",
  "typeId": "priority-fold-holes",
  "label": "접은 종이의 구멍",
  "area": "평면 지각",
  "round": 1,
  "section": "extra",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-congruent-partition",
  "typeId": "extra-congruent-partition",
  "label": "조건에 맞게 같은 모양으로 나누기",
  "area": "평면 지각",
  "round": 1,
  "section": "extra",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-inside-outside-analogy",
  "typeId": "extra-inside-outside-analogy",
  "label": "안팎 도형의 변화",
  "area": "평면 지각",
  "round": 1,
  "section": "extra",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-digital-mirror",
  "typeId": "extra-digital-mirror",
  "label": "거울 속 디지털 식",
  "area": "평면 지각",
  "round": 1,
  "section": "extra",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-fruit-equations",
  "typeId": "r2-fruit-equations",
  "label": "같은 기호의 수 찾기",
  "area": "수와 연산",
  "round": 2,
  "section": "main",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-number-machines",
  "typeId": "r2-number-machines",
  "label": "수 상자의 규칙과 역산",
  "area": "규칙",
  "round": 2,
  "section": "main",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-grid-mirror-polygon",
  "typeId": "r2-grid-mirror-polygon",
  "label": "모눈의 거울상",
  "area": "평면 지각",
  "round": 2,
  "section": "main",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-student-queue",
  "typeId": "replace-student-queue",
  "label": "조건을 연결해 순서 찾기",
  "area": "논리 추리",
  "round": 2,
  "section": "main",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-missing-star-combination",
  "typeId": "replace-missing-star-combination",
  "label": "빠진 색칠 조합 찾기",
  "area": "경우의 수",
  "round": 2,
  "section": "main",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-orange-reverse",
  "typeId": "r2-orange-reverse",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 2,
  "section": "main",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-digit-constraint",
  "typeId": "r2-digit-constraint",
  "label": "자리 숫자의 합과 차",
  "area": "수와 연산",
  "round": 2,
  "section": "main",
  "number": 7,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-compound-matrix",
  "typeId": "replace-compound-matrix",
  "label": "가로·세로 도형 규칙",
  "area": "규칙",
  "round": 2,
  "section": "main",
  "number": 8,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-circular-seating",
  "typeId": "r2-circular-seating",
  "label": "원탁의 방향과 이웃",
  "area": "논리 추리",
  "round": 2,
  "section": "main",
  "number": 9,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-magic-triangle",
  "typeId": "replace-magic-triangle",
  "label": "직선 위 수의 합",
  "area": "수와 연산",
  "round": 2,
  "section": "main",
  "number": 10,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-fruit-pair-cancel",
  "typeId": "replace-fruit-pair-cancel",
  "label": "같은 종류를 짝지어 없애기",
  "area": "문제 해결",
  "round": 2,
  "section": "main",
  "number": 11,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-priority-route-count",
  "typeId": "priority-route-count",
  "label": "조건이 있는 길의 가짓수",
  "area": "경우의 수",
  "round": 2,
  "section": "main",
  "number": 12,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-domino-side-sums",
  "typeId": "r2-domino-side-sums",
  "label": "도미노 테두리의 합",
  "area": "수와 연산",
  "round": 2,
  "section": "main",
  "number": 13,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-replace-line-rotation-series",
  "typeId": "replace-line-rotation-series",
  "label": "반복되는 그림 규칙",
  "area": "규칙",
  "round": 2,
  "section": "main",
  "number": 14,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-bird-departure",
  "typeId": "r2-bird-departure",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 2,
  "section": "main",
  "number": 15,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-number-reference-reading",
  "typeId": "r2-number-reference-reading",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 2,
  "section": "main",
  "number": 16,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-three-balance-order",
  "typeId": "r2-three-balance-order",
  "label": "기울어진 저울의 무게 순서",
  "area": "문제 해결",
  "round": 2,
  "section": "main",
  "number": 17,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-priority-diagonal-length",
  "typeId": "priority-diagonal-length",
  "label": "대각선이 있는 길이 비교",
  "area": "문제 해결",
  "round": 2,
  "section": "main",
  "number": 18,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-triangle-enumeration",
  "typeId": "r2-triangle-enumeration",
  "label": "선을 따라 삼각형 세기",
  "area": "평면 지각",
  "round": 2,
  "section": "main",
  "number": 19,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r2-fruit-logic-table",
  "typeId": "r2-fruit-logic-table",
  "label": "표를 그려 조건 추리",
  "area": "논리 추리",
  "round": 2,
  "section": "main",
  "number": 20,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-maximum-under-conditions",
  "typeId": "extra-maximum-under-conditions",
  "label": "여러 수 조건을 함께 만족하기",
  "area": "수와 연산",
  "round": 2,
  "section": "extra",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-priority-card-rank",
  "typeId": "priority-card-rank",
  "label": "카드로 수를 만들어 순서 정하기",
  "area": "경우의 수",
  "round": 2,
  "section": "extra",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-card-distribution",
  "typeId": "extra-card-distribution",
  "label": "카드를 한 번씩 나누기",
  "area": "경우의 수",
  "round": 2,
  "section": "extra",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-general-quadrilateral-count",
  "typeId": "extra-general-quadrilateral-count",
  "label": "선을 따라 사각형 세기",
  "area": "평면 지각",
  "round": 2,
  "section": "extra",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-independent-color-shape-period",
  "typeId": "extra-independent-color-shape-period",
  "label": "색과 모양의 다른 반복",
  "area": "규칙",
  "round": 2,
  "section": "extra",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-extra-circle-bar-code",
  "typeId": "extra-circle-bar-code",
  "label": "그림으로 나타낸 수",
  "area": "규칙",
  "round": 2,
  "section": "extra",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-1",
  "typeId": "r3-main-1",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 3,
  "section": "main",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-2",
  "typeId": "r3-main-2",
  "label": "양이 바뀌는 이야기",
  "area": "지문 이해",
  "round": 3,
  "section": "main",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-3",
  "typeId": "r3-main-3",
  "label": "늘어나는 묶음의 규칙",
  "area": "규칙",
  "round": 3,
  "section": "main",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-4",
  "typeId": "r3-main-4",
  "label": "전개도의 마주 보는 색",
  "area": "공간 지각",
  "round": 3,
  "section": "main",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-5",
  "typeId": "r3-main-5",
  "label": "서로 다른 세 수 고르기",
  "area": "경우의 수",
  "round": 3,
  "section": "main",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-6",
  "typeId": "r3-main-6",
  "label": "대각선이 있는 길이 비교",
  "area": "문제 해결",
  "round": 3,
  "section": "main",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-7",
  "typeId": "r3-main-7",
  "label": "나이 관계 연결하기",
  "area": "지문 이해",
  "round": 3,
  "section": "main",
  "number": 7,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-8",
  "typeId": "r3-main-8",
  "label": "도미노 점의 규칙",
  "area": "규칙",
  "round": 3,
  "section": "main",
  "number": 8,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-9-shortest-path-grid",
  "typeId": "r3-main-9-shortest-path-grid",
  "label": "조건이 있는 길의 가짓수",
  "area": "경우의 수",
  "round": 3,
  "section": "main",
  "number": 9,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-10",
  "typeId": "r3-main-10",
  "label": "조건을 연결해 순서 찾기",
  "area": "논리 추리",
  "round": 3,
  "section": "main",
  "number": 10,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-11",
  "typeId": "r3-main-11",
  "label": "기호를 넣어 참인 식 만들기",
  "area": "수와 연산",
  "round": 3,
  "section": "main",
  "number": 11,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-12",
  "typeId": "r3-main-12",
  "label": "조각으로 모양 채우기",
  "area": "평면 지각",
  "round": 3,
  "section": "main",
  "number": 12,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-13",
  "typeId": "r3-main-13",
  "label": "주사위 굴리기",
  "area": "공간 지각",
  "round": 3,
  "section": "main",
  "number": 13,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-14",
  "typeId": "r3-main-14",
  "label": "늘어나는 색의 배열",
  "area": "규칙",
  "round": 3,
  "section": "main",
  "number": 14,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-15-checker-stack-count",
  "typeId": "r3-main-15-checker-stack-count",
  "label": "쌓기나무 채우기",
  "area": "공간 지각",
  "round": 3,
  "section": "main",
  "number": 15,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-16",
  "typeId": "r3-main-16",
  "label": "남은 양을 나누기",
  "area": "문제 해결",
  "round": 3,
  "section": "main",
  "number": 16,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-17",
  "typeId": "r3-main-17",
  "label": "표를 그려 조건 추리",
  "area": "논리 추리",
  "round": 3,
  "section": "main",
  "number": 17,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-18-tetra-cube-hole-count",
  "typeId": "r3-main-18-tetra-cube-hole-count",
  "label": "길쭉한 블록 세기",
  "area": "공간 지각",
  "round": 3,
  "section": "main",
  "number": 18,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-19",
  "typeId": "r3-main-19",
  "label": "모든 칸을 한 번씩 지나기",
  "area": "경우의 수",
  "round": 3,
  "section": "main",
  "number": 19,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-main-20",
  "typeId": "r3-main-20",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 3,
  "section": "main",
  "number": 20,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-1-congruent-marked-partition",
  "typeId": "r3-extra-1-congruent-marked-partition",
  "label": "조건에 맞게 같은 모양으로 나누기",
  "area": "평면 지각",
  "round": 3,
  "section": "extra",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-2",
  "typeId": "r3-extra-2",
  "label": "전개도의 마주 보는 눈",
  "area": "공간 지각",
  "round": 3,
  "section": "extra",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-3-block-build-count",
  "typeId": "r3-extra-3-block-build-count",
  "label": "길쭉한 블록 세기",
  "area": "공간 지각",
  "round": 3,
  "section": "extra",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-4-object-length-equivalence",
  "typeId": "r3-extra-4-object-length-equivalence",
  "label": "물건으로 길이 비교",
  "area": "문제 해결",
  "round": 3,
  "section": "extra",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-5",
  "typeId": "r3-extra-5",
  "label": "서로 다른 수로 가르기",
  "area": "수와 연산",
  "round": 3,
  "section": "extra",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r3-extra-6-stack-box-fill",
  "typeId": "r3-extra-6-stack-box-fill",
  "label": "쌓기나무 채우기",
  "area": "공간 지각",
  "round": 3,
  "section": "extra",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-1",
  "typeId": "r4-main-1",
  "label": "같은 기호의 수 찾기",
  "area": "수와 연산",
  "round": 4,
  "section": "main",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-2",
  "typeId": "r4-main-2",
  "label": "양이 바뀌는 이야기",
  "area": "지문 이해",
  "round": 4,
  "section": "main",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-3",
  "typeId": "r4-main-3",
  "label": "늘어나는 묶음의 규칙",
  "area": "규칙",
  "round": 4,
  "section": "main",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-4",
  "typeId": "r4-main-4",
  "label": "조각으로 모양 채우기",
  "area": "평면 지각",
  "round": 4,
  "section": "main",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-5",
  "typeId": "r4-main-5",
  "label": "서로 다른 수로 가르기",
  "area": "수와 연산",
  "round": 4,
  "section": "main",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-6",
  "typeId": "r4-main-6",
  "label": "앞뒤 순서와 사이의 수",
  "area": "논리 추리",
  "round": 4,
  "section": "main",
  "number": 6,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-7",
  "typeId": "r4-main-7",
  "label": "도미노 점의 규칙",
  "area": "규칙",
  "round": 4,
  "section": "main",
  "number": 7,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-8",
  "typeId": "r4-main-8",
  "label": "전개도의 마주 보는 눈",
  "area": "공간 지각",
  "round": 4,
  "section": "main",
  "number": 8,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-9",
  "typeId": "r4-main-9",
  "label": "기호를 넣어 참인 식 만들기",
  "area": "수와 연산",
  "round": 4,
  "section": "main",
  "number": 9,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-10",
  "typeId": "r4-main-10",
  "label": "처음 수를 거꾸로 찾기",
  "area": "지문 이해",
  "round": 4,
  "section": "main",
  "number": 10,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-11",
  "typeId": "r4-main-11",
  "label": "겹치지 않게 같은 도형 연결",
  "area": "경우의 수",
  "round": 4,
  "section": "main",
  "number": 11,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-12-block-build-count",
  "typeId": "r4-main-12-block-build-count",
  "label": "길쭉한 블록 세기",
  "area": "공간 지각",
  "round": 4,
  "section": "main",
  "number": 12,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-13",
  "typeId": "r4-main-13",
  "label": "서로 다른 세 수 고르기",
  "area": "경우의 수",
  "round": 4,
  "section": "main",
  "number": 13,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-14",
  "typeId": "r4-main-14",
  "label": "카드를 한 번씩 나누기",
  "area": "경우의 수",
  "round": 4,
  "section": "main",
  "number": 14,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-15",
  "typeId": "r4-main-15",
  "label": "주사위 굴리기",
  "area": "공간 지각",
  "round": 4,
  "section": "main",
  "number": 15,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-16",
  "typeId": "r4-main-16",
  "label": "옮겨도 같은 전체",
  "area": "문제 해결",
  "round": 4,
  "section": "main",
  "number": 16,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-17-balance-substitution-pictures",
  "typeId": "r4-main-17-balance-substitution-pictures",
  "label": "수평 저울의 무게 바꾸기",
  "area": "문제 해결",
  "round": 4,
  "section": "main",
  "number": 17,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-18-congruent-marked-partition",
  "typeId": "r4-main-18-congruent-marked-partition",
  "label": "조건에 맞게 같은 모양으로 나누기",
  "area": "평면 지각",
  "round": 4,
  "section": "main",
  "number": 18,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-19",
  "typeId": "r4-main-19",
  "label": "표를 그려 조건 추리",
  "area": "논리 추리",
  "round": 4,
  "section": "main",
  "number": 19,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-main-20",
  "typeId": "r4-main-20",
  "label": "똑같이 나눈 뒤 처음 양 찾기",
  "area": "지문 이해",
  "round": 4,
  "section": "main",
  "number": 20,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-1-object-length-equivalence",
  "typeId": "r4-extra-1-object-length-equivalence",
  "label": "물건으로 길이 비교",
  "area": "문제 해결",
  "round": 4,
  "section": "extra",
  "number": 1,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-2-checker-stack-count",
  "typeId": "r4-extra-2-checker-stack-count",
  "label": "쌓기나무 채우기",
  "area": "공간 지각",
  "round": 4,
  "section": "extra",
  "number": 2,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-3-tetra-cube-hole-count",
  "typeId": "r4-extra-3-tetra-cube-hole-count",
  "label": "길쭉한 블록 세기",
  "area": "공간 지각",
  "round": 4,
  "section": "extra",
  "number": 3,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-4-shortest-path-grid",
  "typeId": "r4-extra-4-shortest-path-grid",
  "label": "조건이 있는 길의 가짓수",
  "area": "경우의 수",
  "round": 4,
  "section": "extra",
  "number": 4,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-5-stack-box-fill",
  "typeId": "r4-extra-5-stack-box-fill",
  "label": "쌓기나무 채우기",
  "area": "공간 지각",
  "round": 4,
  "section": "extra",
  "number": 5,
  "kind": "bank"
 },
 {
  "key": "challenge-bank-r4-extra-6-simple-path-network",
  "typeId": "r4-extra-6-simple-path-network",
  "label": "조건이 있는 길의 가짓수",
  "area": "경우의 수",
  "round": 4,
  "section": "extra",
  "number": 6,
  "kind": "bank"
 }
];
 const byKey=new Map(entries.map(e=>[e.key,e]));
 const api={version:'challenge-access-v1',parent:'hyperfocus',child:'challenge',list:()=>entries.map(e=>({...e})),has:key=>byKey.has(key),get:key=>byKey.has(key)?{...byKey.get(key)}:null};
 root.HFChallengeAccessCatalog=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
