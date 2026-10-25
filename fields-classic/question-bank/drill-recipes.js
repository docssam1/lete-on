// 연습 공방(drill.js) 차시별 유형 — 「책/차시」 → 문제은행 유형 id 목록. 단계마다 이 순서대로 번갈아 낸다.
// 유형은 그 단원 문제은행(source-data.js CURRICULUM의 typeIds)에서, 차시 개념과 같은 풀이를 쓰는 것만 골랐다.
// 답 꼴(수 하나 · 수 + 단위 · 쉼표로 쓴 수)과 그림 종류(bookN)는 검사기 drill-audit.mjs가 난이도마다 확인한다.
export const DRILL_RECIPES = Object.freeze({
  // 8권 — 묶음수와 매트릭스 · 복면산 · 합차와 배수 · 거꾸로 생각하기
  "book-08/addition-sum-matrix": ["addition-matrix-complete-b8", "addition-matrix-target-b8"],
  "book-08/bundle-number-source": ["balance-difference-deduction-b8", "symbol-additive-chain-b8", "cyclic-pair-sums-b8"],
  "book-08/product-matrix-source": ["multiplication-matrix-products", "multiplication-matrix-placement"],
  "book-08/pyramid-cryptarithm": ["pyramid-cryptarithm-b8", "letter-pyramid-cryptarithm-b8"],
  "book-08/vertical-shape-cryptarithm": ["multi-symbol-cryptarithm-b8", "blank-digit-vertical-addition-b8", "ordered-symbol-cryptarithm-b8"],
  "book-08/crypt-source": ["repeated-symbol-cryptarithm-b8", "doubled-symbol-result-b8", "linked-cryptarithm-b8"],
  "book-08/equalize-transfer": ["equalize-transfer-b8", "chained-equalize-transfer-b8"],
  "book-08/sum-difference-source": ["total-difference-bars-b8", "table-total-difference-b8", "future-age-sum-b8"],
  "book-08/sum-multiple-source": ["sum-multiple-bars-b8", "difference-multiple-bars-b8"],
  "book-08/sum-multiple-applied-source": ["sum-multiple-offset-b8", "transfer-to-multiple-b8"],
  "book-08/reverse-operation-chain": ["reverse-arithmetic-chain-b8", "reverse-multiply-divide-b8"],
  "book-08/give-same-source": ["give-as-much-once-b8", "give-as-much-return-b8"],
  "book-08/fraction-picture-source": ["shaded-fraction-count-b8", "fraction-subgroup-count-b8"],
  "book-08/fraction-reverse-source": ["fraction-given-away-original-b8", "sequential-fraction-remains-b8", "sequential-fraction-consumption-b8"]
});
