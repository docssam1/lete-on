// 1과정 교재 번호 → 그 문제 꼴에 맞는 유형으로 다시 잇는 표(원장 2026-11-25 「1권에서부터 전체를 확인해야지」).
// 권마다 수업용 원본(N30)을 펴서 번호마다 꼴(칸 수·빈칸·묻는 것·그리기/고르기)을 지금 생성기와 견준 결과,
// 이미 있는 유형이 더 맞는 번호만 여기서 옮긴다. 새 생성기가 필요한 번호는 여기 없다(따로 만든다).
// 행: [권 id, 단원 번호(1~4), 묶음("activity"|"check"|"practice"|"advanced"), 묶음 번호, 문항 번호들, 옮길 유형 id]
// 교재 문장·수는 적지 않는다. 같은 문제만 내는 생성기(권별 테스트 고정 재현)로는 옮기지 않는다.
export const TEXTBOOK_REMAPS = Object.freeze([
  // 1권 — 확인 2-1·2-2가 뒤바뀌어 있었다(반의 반 바퀴 / 두 번 뒤집기), 한 번 접기 번호가 두 번 접기 유형에, 대각선 접기가 곧은 접기 유형에
  ["book-01", 1, "check", 2, [1], "digital-transform-board-sum"],
  ["book-01", 1, "check", 2, [2], "digital-grid-upright-after-moves"],
  ["book-01", 1, "practice", 1, [16], "digital-grid-upright-after-moves"],
  ["book-01", 2, "activity", 1, [1], "fold-cut-unfold-one-draw"],
  ["book-01", 2, "activity", 2, [1, 2], "fold-cut-unfold-two-draw"],
  ["book-01", 2, "check", 2, [5, 6], "fold-number-grid-two-diagonal"],
  ["book-01", 2, "practice", 1, [1, 2], "fold-cut-unfold-one-draw"],
  ["book-01", 2, "practice", 1, [3, 4, 5, 6, 7], "fold-number-cut-sum-one"],
  ["book-01", 2, "practice", 1, [8, 9], "fold-cut-unfold-two-draw"],
  ["book-01", 2, "practice", 1, [16, 17], "fold-number-grid-two-diagonal"],
  ["book-01", 3, "activity", 2, [1, 2], "gakuro-card-irregular-placement"],
  ["book-01", 3, "activity", 2, [4], "gakuro-grid-irregular-sum"],
  ["book-01", 3, "check", 1, [1], "equal-line-sum-eight-cards-twelve"],
  ["book-01", 3, "advanced", 1, [2], "polygon-ring-equal-sum"],
  ["book-01", 4, "practice", 1, [24], "g1-height-order-four"],
  // 2권 2~4단원 — 연습 5·8이 한 칸 밀림, 스도쿠 연습 9·10 뒤바뀜, 성냥개비·바둑돌 모양이 다른 유형에
  ["book-02", 3, "activity", 1, [3], "repeat-pattern"],
  ["book-02", 3, "activity", 1, [4], "repeat-shape-color-dual"],
  ["book-02", 3, "practice", 1, [4], "repeat-pattern"],
  ["book-02", 3, "practice", 1, [5], "repeat-shape-color-dual"],
  ["book-02", 3, "practice", 1, [6], "interleaved-pair-sequence"],
  ["book-02", 3, "practice", 1, [8], "progressive-number-table"],
  ["book-02", 3, "practice", 1, [10], "matchstick-square-growth"],
  ["book-02", 3, "practice", 1, [11], "constant-step-object-growth-b7"],
  ["book-02", 3, "practice", 1, [15], "triangle-tile-growth"],
  ["book-02", 4, "practice", 1, [3], "two-digit-compose-rule"],
  ["book-02", 4, "practice", 1, [9], "sudoku-three-region"],
  ["book-02", 4, "practice", 1, [10], "sudoku-three-row-column"],
  ["book-02", 4, "practice", 1, [12], "sudoku-four-square-region"],
  ["book-02", 4, "advanced", 1, [1, 2], "four-number-center-rule"],
  // 3권 — 복면산 20번호가 한 꼴(모두 모양인 두 수)에 묶여 있던 것 중 맞는 유형이 있는 번호
  ["book-03", 3, "activity", 2, [4], "cryptarithm-unit-test-q14"],
  ["book-03", 3, "check", 1, [2], "diagnostic-two-digit-cryptarithm"],
  ["book-03", 3, "practice", 1, [9, 10, 11], "cryptarithm-missing-digit-column"],
  ["book-03", 3, "practice", 1, [12], "vertical-shape-cryptarithm-values"],
  ["book-03", 3, "practice", 1, [14], "cryptarithm-unit-test-q14"],
  ["book-03", 3, "advanced", 1, [2], "cryptarithm-unit-test-q15"],
  ["book-03", 4, "practice", 1, [2], "four-cell-binary-code"],
  // 4권 — 숫자판·디지털 계산·종이 겹치기·쌓기나무 도전 3↔4·줄 세우기
  ["book-04", 1, "activity", 2, [3], "digital-transform-board-sum"],
  ["book-04", 1, "activity", 2, [4], "digital-grid-upright-after-moves"],
  ["book-04", 1, "check", 1, [2], "star-congruent-partition-draw-book4"],
  ["book-04", 1, "check", 1, [4], "forest-congruent-partition-draw-book4"],
  ["book-04", 1, "check", 2, [1], "digital-flip-addition-horizontal"],
  ["book-04", 1, "check", 2, [2], "digital-transform-addition"],
  ["book-04", 1, "check", 2, [4], "digital-self-half-turn-calculation"],
  ["book-04", 1, "practice", 1, [8], "star-congruent-partition-draw-book4"],
  ["book-04", 1, "practice", 1, [10], "forest-congruent-partition-draw-book4"],
  ["book-04", 1, "practice", 1, [14], "digital-transform-board-sum"],
  ["book-04", 1, "practice", 1, [15], "digital-grid-upright-after-moves"],
  ["book-04", 1, "practice", 1, [17], "digital-flip-addition-horizontal"],
  ["book-04", 1, "practice", 1, [18], "digital-transform-addition"],
  ["book-04", 1, "practice", 1, [20], "digital-self-half-turn-calculation"],
  ["book-04", 2, "activity", 2, [2], "cube-triangular-wall-growth"],
  ["book-04", 2, "check", 1, [1, 2, 3, 4], "fold-stack-order"],
  ["book-04", 2, "practice", 1, [8, 11], "fold-stack-find"],
  ["book-04", 2, "practice", 1, [9, 10], "fold-stack-order"],
  ["book-04", 2, "advanced", 1, [2], "fold-diagonal-hole-count"],
  ["book-04", 2, "advanced", 1, [3], "cube-shell-interior-b9"],
  ["book-04", 2, "advanced", 1, [4], "cube-black-white-alternating"],
  ["book-04", 3, "practice", 1, [1, 2], "unused-number-card-equations"],
  ["book-04", 3, "advanced", 1, [1], "measurement-time-difference-book4"],
  ["book-04", 4, "activity", 2, [1, 2], "directional-landmark-placement-book4"],
  ["book-04", 4, "activity", 2, [5, 6], "circular-seat-blank-book4"],
  ["book-04", 4, "check", 1, [1, 2], "race-third-place-book4"],
  ["book-04", 4, "check", 2, [1], "front-back-total"],
  ["book-04", 4, "check", 2, [3, 4, 5, 6], "g1-front-back-between"],
  ["book-04", 4, "practice", 1, [11, 12], "directional-landmark-placement-book4"],
  ["book-04", 4, "practice", 1, [16, 17], "g1-front-back-between"],
  ["book-04", 4, "practice", 1, [18], "front-back-two-order-totals-book4"],
  ["book-04", 4, "advanced", 1, [1], "relative-position-number-grid-nine"],
  ["book-04", 4, "advanced", 1, [4], "front-back-two-order-totals-book4"],
  // 5권 — 권별 테스트용으로 만들어 두고 교재 번호에는 쓰지 않던 유형들, 곱셈 매트릭스 연습 5↔6
  ["book-05", 1, "activity", 1, [2], "row-major-grid-two-target-sum-book5"],
  ["book-05", 1, "activity", 2, [2], "calendar-weekday-list-ordinal-book5"],
  ["book-05", 1, "activity", 2, [3, 4], "calendar-special-date-offset-book5"],
  ["book-05", 1, "check", 1, [1, 2], "radial-line-cycle-two-part-book5"],
  ["book-05", 1, "check", 2, [3], "calendar-weekday-sum-year-boundary-book5"],
  ["book-05", 1, "practice", 1, [4], "row-major-grid-two-target-sum-book5"],
  ["book-05", 1, "practice", 1, [7, 8], "radial-line-cycle-two-part-book5"],
  ["book-05", 1, "practice", 1, [11, 12], "calendar-special-date-offset-book5"],
  ["book-05", 1, "advanced", 1, [4], "calendar-ordinal-sum-infer-weekday-book5"],
  ["book-05", 2, "activity", 1, [3, 4, 5, 6], "shortest-path-rectangle"],
  ["book-05", 2, "practice", 1, [3], "shortest-path-rectangle"],
  ["book-05", 2, "advanced", 1, [1, 2], "shortest-path-diagonal-shortcut-book5"],
  ["book-05", 3, "activity", 1, [3], "square-product-cycle-fill-book5"],
  ["book-05", 3, "activity", 2, [2], "symbol-zero-one-network-book5"],
  ["book-05", 3, "activity", 2, [3], "symbol-square-product-network-book5"],
  ["book-05", 3, "activity", 2, [5], "symbol-cross-network-book5"],
  ["book-05", 3, "check", 1, [3], "checkerboard-product-matrix-book5"],
  ["book-05", 3, "practice", 1, [5], "multiplication-matrix-placement"],
  ["book-05", 3, "practice", 1, [6], "multiplication-matrix-products"],
  ["book-05", 3, "practice", 1, [7], "checkerboard-product-matrix-book5"],
  ["book-05", 3, "advanced", 1, [2], "symbol-square-product-network-book5"],
  ["book-05", 3, "advanced", 1, [5], "checkerboard-product-matrix-book5"],
  ["book-05", 4, "practice", 1, [14], "square-border-stone-growth-book5"],
  ["book-05", 4, "advanced", 1, [3], "regular-triangle-grid-count-book5"],
  // 6권 — 막대·보폭 번호가 한 칸 밀림(연습 16·17, 도전 3·4), 연습 7↔8, 둘레 붙인 도형은 권별 테스트용 유형이 맞음
  ["book-06", 1, "activity", 1, [4, 5], "split-target-distance-unit-test-book6"],
  ["book-06", 1, "activity", 2, [5, 6], "equal-bar-pieces-unit-test-book6"],
  ["book-06", 1, "check", 2, [2], "two-object-weight-unit-test-book6"],
  ["book-06", 1, "practice", 1, [4, 5], "split-target-distance-unit-test-book6"],
  ["book-06", 1, "practice", 1, [10, 11, 16], "equal-bar-pieces-unit-test-book6"],
  ["book-06", 1, "practice", 1, [13], "two-object-weight-unit-test-book6"],
  ["book-06", 1, "practice", 1, [17], "stride-ratio-total"],
  ["book-06", 1, "advanced", 1, [3], "equal-bar-pieces-unit-test-book6"],
  ["book-06", 1, "advanced", 1, [4], "stride-ratio-total"],
  ["book-06", 2, "activity", 1, [4], "rectangle-rhombus-side-unit-test-book6"],
  ["book-06", 2, "activity", 1, [5], "rectangle-triangle-square-unit-test-book6"],
  ["book-06", 2, "activity", 2, [3], "scattered-side-perimeter-unit-test-book6"],
  ["book-06", 2, "check", 1, [2], "three-square-shaded-perimeter-unit-test-book6"],
  ["book-06", 2, "check", 2, [3], "square-triangle-strip-unit-test-book6"],
  ["book-06", 2, "practice", 1, [10], "three-square-shaded-perimeter-unit-test-book6"],
  ["book-06", 2, "advanced", 1, [3], "concave-perimeter"],
  ["book-06", 3, "check", 2, [3], "facing-page-sum-unit-test-book6"],
  ["book-06", 3, "practice", 1, [7], "near-round-multiplication"],
  ["book-06", 3, "practice", 1, [8], "near-round-addition"],
  ["book-06", 3, "practice", 1, [16, 17], "facing-page-sum-unit-test-book6"],
  // 7권 — 2단원 연습 3↔4·16↔17 뒤바뀜, 4단원은 권별 테스트용 유형이 교재 꼴과 같음
  ["book-07", 2, "activity", 1, [4], "indexed-arithmetic-sequence-b7"],
  ["book-07", 2, "practice", 1, [3], "constant-step-object-growth-b7"],
  ["book-07", 2, "practice", 1, [4], "shared-polygon-matchsticks-b7"],
  ["book-07", 2, "practice", 1, [16], "two-card-value-assumption-b7"],
  ["book-07", 2, "practice", 1, [17], "two-score-value-assumption-b7"],
  ["book-07", 2, "advanced", 1, [5], "linked-sequence-correspondence-b7"],
  ["book-07", 4, "activity", 1, [5], "clock-palindrome-unpadded-unit-test-book7"],
  ["book-07", 4, "check", 1, [2, 3], "reversed-difference-largest-unit-test-book7"],
  ["book-07", 4, "practice", 1, [6], "clock-palindrome-unpadded-unit-test-book7"],
  ["book-07", 4, "practice", 1, [7], "reversed-difference-largest-unit-test-book7"],
  ["book-07", 4, "advanced", 1, [4], "four-group-three-clues-unit-test-book7"],
  // 8권 — 덧셈 매트릭스 13번호가 2×2 덧셈표에(2권과 같은 문제), 3·4단원 뒤바뀐 짝
  ["book-08", 1, "activity", 1, [1], "unit-test-book08-q01"],
  ["book-08", 1, "activity", 1, [3], "shape-matrix-3x3-pair"],
  ["book-08", 1, "activity", 1, [5], "shape-matrix-4x4"],
  ["book-08", 1, "check", 1, [1], "shape-matrix-3x4"],
  ["book-08", 1, "check", 1, [2], "shape-matrix-4x4-five"],
  ["book-08", 1, "check", 1, [3, 4], "shape-matrix-4x4-compare"],
  ["book-08", 1, "check", 2, [2], "unit-test-book08-q03"],
  ["book-08", 1, "practice", 1, [3], "unit-test-book08-q01"],
  ["book-08", 1, "practice", 1, [4], "shape-matrix-3x3-pair"],
  ["book-08", 1, "practice", 1, [5, 7], "shape-matrix-4x4-multi"],
  ["book-08", 1, "practice", 1, [6], "shape-matrix-2x3-multi"],
  ["book-08", 1, "practice", 1, [16], "unit-test-book08-q03"],
  ["book-08", 1, "advanced", 1, [1], "unit-test-book08-q21"],
  ["book-08", 2, "activity", 1, [4], "unit-test-book08-q06"],
  ["book-08", 2, "activity", 2, [2], "unit-test-book08-q08"],
  ["book-08", 2, "check", 1, [2], "unit-test-book08-q07"],
  ["book-08", 2, "check", 2, [2], "unit-test-book08-q06"],
  ["book-08", 2, "check", 2, [4], "unit-test-book08-q10"],
  ["book-08", 2, "practice", 1, [8], "unit-test-book08-q07"],
  ["book-08", 2, "practice", 1, [13], "unit-test-book08-q08"],
  ["book-08", 2, "practice", 1, [18], "unit-test-book08-q06"],
  ["book-08", 2, "advanced", 1, [1], "unit-test-book08-q22"],
  ["book-08", 3, "check", 1, [1], "unit-test-book08-q13"],
  ["book-08", 3, "practice", 1, [7], "unit-test-book08-q13"],
  ["book-08", 3, "advanced", 1, [2], "unit-test-book08-q23"],
  ["book-08", 3, "advanced", 1, [5], "reverse-double-offset-b8"],
  ["book-08", 4, "check", 2, [3], "fraction-difference-whole-b8"],
  ["book-08", 4, "check", 2, [4], "unit-test-book08-q20"],
  ["book-08", 4, "practice", 1, [18, 19], "unit-test-book08-q20"],
  ["book-08", 4, "advanced", 1, [1], "unit-test-book08-q24"],
  // 9권 — 나누어 그리기가 뺄셈 문제로, 45° 그림 모양 넓이, 쌓기나무 활동, 4단원 도전 3↔4
  ["book-09", 1, "activity", 1, [3], "sudoku-four-irregular-region"],
  ["book-09", 1, "activity", 1, [4], "congruent-equal-sum-partition-draw"],
  ["book-09", 1, "activity", 1, [5], "star-congruent-partition-draw-book4"],
  ["book-09", 1, "activity", 2, [5, 6], "unit-grid-area"],
  ["book-09", 1, "check", 1, [3, 4, 5], "equal-partition-drawing"],
  ["book-09", 1, "practice", 1, [2], "sudoku-four-irregular-region"],
  ["book-09", 1, "practice", 1, [3], "congruent-equal-sum-partition-draw"],
  ["book-09", 1, "practice", 1, [11, 12], "equal-partition-drawing"],
  ["book-09", 1, "practice", 1, [17, 18], "unit-grid-area"],
  ["book-09", 1, "advanced", 1, [1], "forest-congruent-partition-draw-book4"],
  ["book-09", 2, "activity", 1, [1], "cube-fill-box"],
  ["book-09", 2, "activity", 1, [2], "cube-hidden-count-walled"],
  ["book-09", 2, "activity", 1, [3], "cube-hidden-count"],
  ["book-09", 2, "practice", 1, [1], "cube-minimum-from-solid"],
  ["book-09", 3, "practice", 1, [3], "magic-square-four-pair-sum-b9"],
  ["book-09", 4, "practice", 1, [20], "exact-one-answer-assignment-b9"],
  ["book-09", 4, "advanced", 1, [3], "all-false-circular-seating-b9"],
  ["book-09", 4, "advanced", 1, [4], "circular-seat-placement"]
]);

const STAGE_OF = Object.freeze({ activity: "concept", check: "type", practice: "practice", advanced: "advanced" });

// 단원의 typeStudyRefs·typeIds를 위 표대로 고친다. 고친 뒤에도 번호마다 유형이 꼭 하나인지 검사한다.
export function applyTextbookRemaps(curriculum, remaps = TEXTBOOK_REMAPS) {
  const problems = [];
  for (const [bookId, unitNo, section, group, numbers, to] of remaps) {
    const book = curriculum.find((item) => item.id === bookId);
    const unit = book?.units[unitNo - 1];
    if (!unit?.typeStudyRefs) { problems.push(`${bookId} ${unitNo}단원: 번호표 없음`); continue; }
    const stage = STAGE_OF[section];
    const refs = {};
    for (const [typeId, stages] of Object.entries(unit.typeStudyRefs)) {
      refs[typeId] = {};
      for (const [stageId, list] of Object.entries(stages)) refs[typeId][stageId] = (list || []).map((ref) => ({ ...ref, numbers: [...(ref.numbers || [])] }));
    }
    let from = null;
    for (const number of numbers) {
      let found = false;
      for (const [typeId, stages] of Object.entries(refs)) {
        for (const ref of stages[stage] || []) {
          if (ref.section !== section || ref.group !== group || !ref.numbers.includes(number)) continue;
          ref.numbers = ref.numbers.filter((value) => value !== number);
          found = true;
          from = from || typeId;
        }
      }
      if (!found) problems.push(`${bookId} ${unitNo}단원 ${section} ${group}-${number}: 지금 이어진 유형이 없음`);
    }
    for (const stages of Object.values(refs)) for (const stageId of Object.keys(stages)) stages[stageId] = stages[stageId].filter((ref) => ref.numbers.length);
    const target = refs[to] || (refs[to] = { concept: [], type: [], practice: [], advanced: [] });
    for (const stageId of ["concept", "type", "practice", "advanced"]) target[stageId] = target[stageId] || [];
    const slot = target[stage].find((ref) => ref.section === section && ref.group === group);
    if (slot) slot.numbers = [...new Set([...slot.numbers, ...numbers])].sort((a, b) => a - b);
    else target[stage].push({ section, group, numbers: [...numbers] });
    unit.typeStudyRefs = refs;
    if (!unit.typeIds.includes(to)) {
      const at = from ? unit.typeIds.indexOf(from) : -1;
      unit.typeIds = at >= 0 ? [...unit.typeIds.slice(0, at + 1), to, ...unit.typeIds.slice(at + 1)] : [...unit.typeIds, to];
    }
  }
  if (problems.length) throw new Error(`TEXTBOOK_REMAP_FAILED\n${problems.join("\n")}`);
  return curriculum;
}
