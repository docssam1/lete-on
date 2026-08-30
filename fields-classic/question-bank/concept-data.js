// Source-backed concept lessons are intentionally separate from the broad
// curriculum taxonomy. These records contain only public-safe source locators,
// never scans, answers, local paths, or reproducing seeds.
const beat = (id, label, text) => Object.freeze({ id, label, text });

const sourceEvidence = (bookId, bookNumber, unitLabel, group, numbers) => Object.freeze({
  source: `Fields the Classic Course 1 Book ${bookNumber}`,
  bookId,
  unitLabel,
  stage: "concept",
  section: "activity",
  group,
  numbers: Object.freeze(numbers),
  verificationState: "source-confirmed",
  visibility: "public-safe"
});

const evidence = (unitLabel, group, numbers) => sourceEvidence("book-01", 1, unitLabel, group, numbers);
const book2Evidence = (unitLabel, group, numbers) => sourceEvidence("book-02", 2, unitLabel, group, numbers);
const book3Evidence = (unitLabel, group, numbers) => sourceEvidence("book-03", 3, unitLabel, group, numbers);
const sourceLesson = (conceptId, beats, misconception, evidenceItems) => Object.freeze({
  conceptId,
  scope: "global-type-id",
  sharedByDesign: true,
  beats: Object.freeze(beats),
  misconception,
  sourceEvidence: Object.freeze(evidenceItems),
  verificationState: "source-confirmed"
});

export const CONCEPT_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "concept:geometry:rotation-center-turn",
    label: "회전 중심과 회전량",
    definition: "회전은 한 점을 중심으로 도형의 모양과 크기를 그대로 둔 채 방향과 위치를 바꾸는 움직임입니다.",
    invariant: "모든 꼭짓점은 같은 중심을 기준으로 같은 방향, 같은 회전량만큼 움직이며 중심까지의 거리가 유지됩니다.",
    representationKinds: Object.freeze(["grid-shape", "rotation-center", "direction-arrow"])
  }),
  Object.freeze({
    id: "concept:geometry:fold-reflection-unfold",
    label: "접은 선과 대칭으로 펼치기",
    definition: "접은 선을 거울선으로 보면 자른 자리는 펼칠 때 반대쪽 같은 거리의 대칭 위치에 나타납니다.",
    invariant: "펼친 두 자국은 접은 선의 양쪽에서 같은 모양이고 접은 선까지의 거리가 같습니다.",
    representationKinds: Object.freeze(["fold-line", "cut-mark", "reflected-shape"])
  }),
  Object.freeze({
    id: "concept:number:common-center-equal-line-sum",
    label: "공통 중심과 같은 줄의 합",
    definition: "여러 줄이 공통점을 지날 때 공통 수를 함께 보고, 나머지 수의 짝을 맞추면 모든 줄의 합을 같게 만들 수 있습니다.",
    invariant: "공통 중심을 제외한 마주 보는 두 수의 합은 어느 줄에서도 같습니다.",
    representationKinds: Object.freeze(["line-intersection", "center-value", "opposite-pairs"])
  }),
  Object.freeze({
    id: "concept:logic:one-to-one-elimination",
    label: "하나씩 대응시키는 소거 추리",
    definition: "사람과 항목을 하나씩만 연결할 때 확정된 관계를 표시하고 불가능한 관계를 지우면 남은 한 곳을 찾을 수 있습니다.",
    invariant: "각 사람과 각 항목은 정확히 한 번씩만 연결되고 모든 조건을 동시에 만족해야 합니다.",
    representationKinds: Object.freeze(["logic-grid", "confirmed-mark", "eliminated-cell"])
  }),
  Object.freeze({
    id: "concept:geometry:mirror-line-reflection",
    label: "거울선과 대칭 위치",
    definition: "거울에 비친 도형은 거울선을 기준으로 각 점이 반대편의 같은 거리에 놓이도록 옮겨진 모양입니다.",
    invariant: "서로 대응하는 점은 거울선에 수직인 한 직선 위에 있고 거울선까지의 거리가 같으며 좌우 방향은 서로 바뀝니다.",
    representationKinds: Object.freeze(["mirror-line", "paired-points", "reflected-direction"])
  }),
  Object.freeze({
    id: "concept:geometry:folded-number-cut-sum",
    label: "접힌 칸과 잘린 수의 합",
    definition: "번호가 적힌 종이를 접어 자르면 접힌 자리에서 겹친 원래 칸들이 함께 잘리므로 펼친 위치를 모두 찾아야 합니다.",
    invariant: "접힌 종이의 한 자리는 접는 선을 따라 대응하는 원래 칸들과 연결되며, 자른 뒤에는 그 칸들만 사라집니다.",
    representationKinds: Object.freeze(["numbered-grid", "fold-line", "cut-cell-map"])
  }),
  Object.freeze({
    id: "concept:number:cross-center-equal-sum",
    label: "십자 모양의 같은 줄 합",
    definition: "십자 모양에서 가로줄과 세로줄이 가운데 칸을 함께 쓸 때 양쪽 줄의 합이 같도록 수를 놓는 원리입니다.",
    invariant: "가운데 수는 두 줄에 똑같이 들어가므로 가운데를 뺀 가로 양끝의 합과 세로 양끝의 합이 같아야 합니다.",
    representationKinds: Object.freeze(["cross-grid", "shared-center", "opposite-arm-pairs"])
  }),
  Object.freeze({
    id: "concept:number:two-digit-place-conditions",
    label: "두 자리 수의 자리 조건",
    definition: "두 자리 수는 십의 자리와 일의 자리로 나누어 보고 합, 차, 짝홀과 같은 조건을 각 자리에 연결해 찾습니다.",
    invariant: "십의 자리에는 0이 올 수 없고, 고른 두 숫자는 주어진 모든 자리 조건을 동시에 만족해야 합니다.",
    representationKinds: Object.freeze(["tens-ones-table", "condition-list", "candidate-elimination"])
  }),
  Object.freeze({
    id: "concept:geometry:sequential-rigid-transforms",
    label: "움직임을 차례로 합성하기",
    definition: "뒤집기와 돌리기가 이어질 때 앞 움직임으로 만든 중간 모양에 다음 움직임을 순서대로 적용합니다.",
    invariant: "각 움직임에서 도형의 칸 수와 연결 관계는 유지되고, 움직임의 순서를 바꾸면 다른 결과가 될 수 있습니다.",
    representationKinds: Object.freeze(["start-shape", "ordered-actions", "intermediate-shape"])
  }),
  Object.freeze({
    id: "concept:pattern:seven-segment-transform",
    label: "디지털 막대의 움직임과 자리 순서",
    definition: "디지털 숫자는 켜진 막대의 모임이므로 숫자판을 뒤집거나 돌린 뒤 남은 막대 모양을 다시 숫자로 읽습니다.",
    invariant: "숫자판의 막대 연결은 그대로 움직이며 좌우 뒤집기와 반 바퀴 돌리기에서는 여러 자리 숫자의 자리 순서도 함께 바뀔 수 있습니다.",
    representationKinds: Object.freeze(["seven-segment-digit", "transform-action", "place-order"])
  }),
  Object.freeze({
    id: "concept:number:shared-junction-equal-sum",
    label: "T자 모양의 공통 칸과 같은 합",
    definition: "T자 모양의 두 줄이 한 칸에서 만날 때 그 공통 칸을 함께 사용하여 두 줄의 합을 같게 만드는 원리입니다.",
    invariant: "공통 칸의 수는 두 줄에 똑같이 들어가므로 공통 칸을 제외한 두 수씩의 합이 서로 같아야 합니다.",
    representationKinds: Object.freeze(["t-grid", "shared-junction", "two-number-pairs"])
  }),
  Object.freeze({
    id: "concept:number:row-column-sum-constraints",
    label: "가로·세로 합으로 수 배열하기",
    definition: "가쿠로는 각 수를 한 번씩 사용하면서 모든 가로줄과 세로줄의 합 조건을 동시에 만족하도록 칸을 채우는 퍼즐입니다.",
    invariant: "한 칸의 수는 그 칸이 속한 가로 합과 세로 합에 함께 영향을 주며, 사용할 수 있는 수는 중복 없이 정해진 범위나 카드에서 골라야 합니다.",
    representationKinds: Object.freeze(["sum-grid", "row-targets", "column-targets"])
  }),
  Object.freeze({
    id: "concept:pattern:constant-step-sequence",
    label: "이웃한 수의 일정한 차",
    definition: "수열에서 이웃한 두 수의 차가 계속 같으면 그 차를 반복해 앞이나 뒤의 수를 찾을 수 있습니다.",
    invariant: "커지거나 작아지는 방향과 한 번에 변하는 양이 모든 이웃한 수 사이에서 같습니다.",
    representationKinds: Object.freeze(["number-sequence", "difference-arrows", "missing-terms"])
  }),
  Object.freeze({
    id: "concept:number:equal-partition-two",
    label: "전체를 같은 두 수로 가르기",
    definition: "전체 수를 크기가 같은 두 부분으로 가르면 각 부분은 전체의 반이 되고 두 수를 더하면 다시 전체가 됩니다.",
    invariant: "두 부분의 수는 서로 같고 두 부분의 합은 처음 전체 수와 같습니다.",
    representationKinds: Object.freeze(["partition-tree", "equal-parts", "addition-check"])
  }),
  Object.freeze({
    id: "concept:number:nested-halving-four",
    label: "반으로 두 번 갈라 네 수 만들기",
    definition: "전체를 먼저 반으로 가르고 두 반을 다시 각각 반으로 가르면 크기가 같은 네 부분을 만들 수 있습니다.",
    invariant: "첫 가르기의 두 수가 같고, 두 번째 가르기의 네 수가 모두 같으며 네 수의 합은 처음 전체와 같습니다.",
    representationKinds: Object.freeze(["two-level-tree", "halving-steps", "four-equal-parts"])
  }),
  Object.freeze({
    id: "concept:number:equal-partition-three",
    label: "전체를 같은 세 수로 가르기",
    definition: "전체 수를 같은 세 부분으로 가를 때는 같은 수를 세 번 더해 전체가 되는 수를 찾습니다.",
    invariant: "세 부분의 수는 모두 같고 그 수를 세 번 더한 값은 처음 전체와 같습니다.",
    representationKinds: Object.freeze(["three-branch-tree", "repeated-addition", "equal-groups"])
  }),
  Object.freeze({
    id: "concept:number:shape-sum-matrix-elimination",
    label: "도형값을 이어 찾는 가로·세로 합",
    definition: "같은 도형이 같은 수를 나타내는 표에서는 한 도형만 반복된 줄부터 값을 구하고 다른 줄로 옮겨 갑니다.",
    invariant: "한 도형의 값은 표 전체에서 같고 각 가로줄과 세로줄의 도형값 합은 표시된 줄의 합과 일치합니다.",
    representationKinds: Object.freeze(["shape-matrix", "row-sums", "column-sums"])
  }),
  Object.freeze({
    id: "concept:number:transfer-equalization",
    label: "옮겨서 두 수를 같게 만들기",
    definition: "큰 쪽에서 작은 쪽으로 한 개를 옮기면 두 수의 차가 두 개 줄어드므로 처음 차이의 반만큼 옮깁니다.",
    invariant: "옮긴 뒤 큰 쪽에서 뺀 수와 작은 쪽에 더한 수가 같고 두 결과가 정확히 일치합니다.",
    representationKinds: Object.freeze(["two-quantities", "transfer-arrow", "difference-halving"])
  }),
  Object.freeze({
    id: "concept:number:sum-difference-split",
    label: "전체와 차이로 두 수 나누기",
    definition: "두 수의 전체에서 차이를 먼저 떼어 내면 같은 두 몫이 남으므로 남은 수를 반으로 나누어 작은 수를 찾습니다.",
    invariant: "구한 두 수의 합은 주어진 전체이고 큰 수에서 작은 수를 뺀 값은 주어진 차이입니다.",
    representationKinds: Object.freeze(["bar-model", "sum-value", "difference-part"])
  }),
  Object.freeze({
    id: "concept:logic:balance-transitive-order",
    label: "여러 저울의 무게 관계 이어 보기",
    definition: "양팔저울마다 아래로 내려간 쪽을 더 무겁다고 기록하고 서로 이어지는 비교를 한 줄의 순서로 정리합니다.",
    invariant: "각 저울의 무거운 쪽 관계가 최종 순서와 모두 맞고 같은 물건이 한 번씩만 순서에 나타납니다.",
    representationKinds: Object.freeze(["balance-scales", "comparison-arrows", "ordered-chain"])
  }),
  Object.freeze({
    id: "concept:number:distinct-symbol-equation-chain",
    label: "서로 다른 도형값을 식으로 이어 찾기",
    definition: "같은 도형끼리만 있는 가장 쉬운 식에서 첫 값을 구하고 그 값을 다음 식에 차례로 바꾸어 넣습니다.",
    invariant: "같은 도형은 언제나 같은 수이고 서로 다른 도형의 값은 서로 다르며 모든 식을 동시에 만족합니다.",
    representationKinds: Object.freeze(["symbol-equations", "substitution-chain", "distinct-values"])
  }),
  Object.freeze({
    id: "concept:pattern:shortest-number-repeat-unit",
    label: "가장 짧은 수 반복마디",
    definition: "수들이 되풀이될 때 처음부터 같은 순서로 다시 나타나는 가장 짧은 수 묶음을 반복마디로 정합니다.",
    invariant: "정한 반복마디를 계속 이어 쓰면 주어진 모든 수의 위치와 빈칸의 수가 정확히 맞습니다.",
    representationKinds: Object.freeze(["number-strip", "repeat-brackets", "missing-position"])
  }),
  Object.freeze({
    id: "concept:pattern:multi-attribute-repeat-unit",
    label: "모양·색·개수의 이중 반복마디",
    definition: "그림 규칙은 모양, 색, 개수를 따로 읽은 뒤 각 반복마디가 다시 함께 시작되는 위치를 찾습니다.",
    invariant: "고른 다음 그림은 모양 순서와 색 또는 개수 순서를 모두 동시에 만족합니다.",
    representationKinds: Object.freeze(["symbol-strip", "color-cycle", "combined-period"])
  }),
  Object.freeze({
    id: "concept:pattern:shared-edge-linear-growth",
    label: "맞닿은 변을 함께 쓰는 도형 성장",
    definition: "다각형을 이어 붙이면 맞닿은 변은 새로 만들지 않으므로 첫 모양의 수에 한 개씩 붙을 때 늘어나는 수만 더합니다.",
    invariant: "처음 모양의 성냥개비 수와 추가 모양마다 늘어나는 성냥개비 수가 전체 단계에서 일정합니다.",
    representationKinds: Object.freeze(["joined-polygons", "shared-edge", "growth-table"])
  }),
  Object.freeze({
    id: "concept:pattern:triangular-two-color-count",
    label: "삼각형 바둑돌을 색별로 세기",
    definition: "삼각형으로 커지는 바둑돌은 각 줄의 길이와 색 배치를 나누어 보고 검은 돌과 흰 돌을 각각 셉니다.",
    invariant: "두 색의 개수를 더하면 해당 단계의 전체 바둑돌 수가 되고 두 수의 차가 묻는 값과 일치합니다.",
    representationKinds: Object.freeze(["triangular-grid", "color-layers", "count-difference"])
  }),
  Object.freeze({
    id: "concept:pattern:square-border-interior-count",
    label: "네모 테두리와 안쪽을 나누어 세기",
    definition: "네모 모양의 바둑돌은 겹치지 않게 테두리 네 변과 안쪽 정사각형을 나누어 색별 개수를 셉니다.",
    invariant: "모서리는 한 번씩만 세며 테두리와 안쪽의 합은 전체 칸 수와 같아야 합니다.",
    representationKinds: Object.freeze(["square-border", "interior-grid", "color-counts"])
  }),
  Object.freeze({
    id: "concept:number:four-outer-center-operation",
    label: "바깥 네 수와 가운데 수의 약속",
    definition: "답이 보이는 여러 그림에서 바깥 네 수를 어느 순서로 더하고 빼 가운데 수를 만드는지 같은 계산을 찾습니다.",
    invariant: "찾은 계산 순서를 모든 보기 그림에 적용했을 때 각 가운데 수가 빠짐없이 맞습니다.",
    representationKinds: Object.freeze(["center-number-diagram", "outer-values", "operation-rule"])
  }),
  Object.freeze({
    id: "concept:number:uniform-row-operation",
    label: "모든 줄에 같은 계산 약속 적용하기",
    definition: "완성된 줄의 수들을 같은 순서로 계산해 공통 규칙을 찾고 그 규칙을 빈칸이 있는 줄에도 그대로 적용합니다.",
    invariant: "하나의 계산 순서가 주어진 모든 완성 줄을 만족하고 마지막 줄의 빈칸도 같은 규칙으로 결정됩니다.",
    representationKinds: Object.freeze(["number-row-grid", "operation-order", "hidden-cell"])
  }),
  Object.freeze({
    id: "concept:number:compose-two-digit-operation",
    label: "숫자를 두 자리 수로 만든 뒤 계산하기",
    definition: "두 숫자의 위아래나 좌우 순서를 확인해 두 자리 수를 먼저 만들고 정해진 덧셈이나 뺄셈을 합니다.",
    invariant: "십의 자리와 일의 자리의 순서를 유지해 만든 두 수와 계산 결과가 같은 약속을 만족합니다.",
    representationKinds: Object.freeze(["digit-pairs", "place-value", "arithmetic-rule"])
  }),
  Object.freeze({
    id: "concept:logic:latin-row-column-three",
    label: "1·2·3 가로세로 스도쿠",
    definition: "3×3 표의 각 가로줄과 세로줄에 1, 2, 3이 한 번씩 들어가도록 이미 있는 수를 보고 빈칸을 좁힙니다.",
    invariant: "각 가로줄과 세로줄에는 1, 2, 3이 중복이나 빠짐없이 정확히 한 번씩 들어갑니다.",
    representationKinds: Object.freeze(["three-grid", "row-candidates", "column-candidates"])
  }),
  Object.freeze({
    id: "concept:logic:latin-row-column-region-four",
    label: "1~4 가로세로·굵은 칸 스도쿠",
    definition: "4×4 표에서 가로줄, 세로줄, 2×2 굵은 영역을 함께 확인해 1부터 4까지의 빠진 수를 찾습니다.",
    invariant: "각 가로줄과 세로줄과 굵은 영역마다 1, 2, 3, 4가 정확히 한 번씩 들어갑니다.",
    representationKinds: Object.freeze(["four-grid", "square-regions", "candidate-elimination"])
  }),
  Object.freeze({
    id: "concept:geometry:tangram-composition",
    label: "칠교 조각으로 도형 합성하기",
    definition: "크기와 모양이 서로 다른 칠교 조각을 돌리거나 뒤집어 바깥선에 맞추고, 겹치거나 빈틈이 생기지 않게 하나의 도형으로 합칩니다.",
    invariant: "각 조각의 모양과 넓이는 그대로이며 지정된 조각을 모두 사용하고 전체 도형에 빈틈과 겹침이 없습니다.",
    representationKinds: Object.freeze(["tangram-pieces", "shape-outline", "piece-placement"])
  }),
  Object.freeze({
    id: "concept:geometry:unit-grid-area",
    label: "단위 정사각형으로 넓이 세기",
    definition: "도형을 같은 크기의 단위 정사각형으로 나누어 온 칸과 부분 칸을 합해 넓이를 비교합니다.",
    invariant: "넓이는 모양의 방향이나 놓인 위치와 관계없이 들어 있는 단위 넓이의 합으로 정해집니다.",
    representationKinds: Object.freeze(["unit-grid", "covered-cells", "area-count"])
  }),
  Object.freeze({
    id: "concept:geometry:equal-parts-fraction",
    label: "같은 부분 중 색칠한 부분의 분수",
    definition: "전체를 같은 크기로 나눈 뒤 색칠한 부분의 수를 세어 전체 부분 수를 분모로 하는 분수로 나타냅니다.",
    invariant: "분모는 전체의 같은 부분 수이고 분자는 그중 색칠한 부분 수이며 두 수는 같은 단위로 셉니다.",
    representationKinds: Object.freeze(["partitioned-shape", "shaded-parts", "fraction-label"])
  }),
  Object.freeze({
    id: "concept:geometry:equal-partition-construction",
    label: "도형을 같은 넓이로 나누어 그리기",
    definition: "주어진 도형 안에 경계선을 그어 넓이가 같은 부분을 만들고, 각 부분이 같은 단위로 나뉘었는지 확인합니다.",
    invariant: "나뉜 모든 부분의 넓이가 같고 경계선은 도형 밖으로 벗어나지 않으며 전체를 빠짐없이 덮습니다.",
    representationKinds: Object.freeze(["shape-outline", "partition-lines", "equal-regions"])
  }),
  Object.freeze({
    id: "concept:geometry:folded-strip-total-length",
    label: "꺾인 띠의 전체 길이",
    definition: "모눈 위에서 꺾여 보이는 띠를 구간별로 나누고, 각 가로·세로 구간의 단위 길이를 모두 더해 곧게 펼친 전체 길이를 구합니다.",
    invariant: "띠를 접거나 꺾어도 길이는 변하지 않으며 전체 길이는 지나간 모든 구간 길이의 합입니다.",
    representationKinds: Object.freeze(["folded-strip", "unit-lengths", "overlap-region"])
  }),
  Object.freeze({
    id: "concept:number:number-line-midpoint",
    label: "수직선의 가운데와 같은 거리",
    definition: "두 수 사이의 가운데를 찾을 때 양 끝의 차이를 같은 간격으로 나누고 수직선에서 양쪽 거리를 비교합니다.",
    invariant: "가운데 점은 두 끝점에서 같은 거리에 있고 양쪽 구간의 길이는 같습니다.",
    representationKinds: Object.freeze(["number-line", "endpoint-pair", "midpoint-marker"])
  }),
  Object.freeze({
    id: "concept:geometry:equal-interval-unit-length",
    label: "같은 간격의 길이와 칸 수",
    definition: "두 지점 사이를 같은 간격으로 나누었을 때 전체 길이를 간격 수로 나누어 한 칸의 길이를 구합니다.",
    invariant: "연속한 눈금 사이의 길이는 모두 같고 전체 구간은 같은 간격들의 합입니다.",
    representationKinds: Object.freeze(["number-line", "equal-intervals", "length-total"])
  }),
  Object.freeze({
    id: "concept:number:step-length-ratio",
    label: "걸음 수와 한 걸음 길이",
    definition: "한쪽의 한 걸음이 다른 쪽의 몇 배인지 알면, 같은 거리를 갈 때 긴 한 걸음마다 짧은 걸음이 그 배수만큼 필요합니다.",
    invariant: "같은 거리를 걸으면 걸음 수와 한 걸음 길이의 곱이 같고, 걸음 수가 많을수록 한 걸음은 짧습니다.",
    representationKinds: Object.freeze(["distance-strip", "step-count", "ratio-table"])
  }),
  Object.freeze({
    id: "concept:number:route-distance-multiple",
    label: "전체 거리에서 한 구간 빼기",
    definition: "세 장소가 한 길 위에 있을 때 전체 거리에서 한쪽 구간을 빼 나머지 구간을 구하고, 두 구간을 같은 단위로 비교해 몇 배인지 찾습니다.",
    invariant: "첫 구간과 둘째 구간의 합은 전체 거리이며 배수 비교는 같은 단위의 두 구간으로 해야 합니다.",
    representationKinds: Object.freeze(["route-path", "equal-segments", "multiple-calculation"])
  }),
  Object.freeze({
    id: "concept:number:rod-ratio-shared-unit",
    label: "막대 칸 수와 전체 길이",
    definition: "두 막대를 같은 길이의 칸으로 나타내어 전체 칸 수를 세고, 전체 길이를 그 칸 수로 나누어 한 칸과 각 막대의 길이를 구합니다.",
    invariant: "모든 칸의 길이는 같고 두 막대의 칸 수 합에 한 칸 길이를 곱하면 주어진 전체 길이가 됩니다.",
    representationKinds: Object.freeze(["length-rods", "unit-comparison", "total-length"])
  }),
  Object.freeze({
    id: "concept:number:repeated-two-digit-doubling",
    label: "같은 숫자를 반복하는 복면산",
    definition: "같은 숫자나 도형이 여러 자리에서 반복되는 복면산은 자리값을 나누어 보고 같은 기호를 같은 숫자로 유지하며 식을 풉니다.",
    invariant: "같은 기호는 모든 자리에서 같은 숫자이고 각 자리는 일의 자리부터 받아올림을 포함해 계산됩니다.",
    representationKinds: Object.freeze(["cryptarithm-vertical", "place-values", "repeated-symbol"])
  }),
  Object.freeze({
    id: "concept:number:fixed-digit-cryptarithm",
    label: "고정된 숫자가 있는 세로 복면산",
    definition: "이미 정해진 숫자와 기호를 일의 자리부터 세로로 더하며, 각 자리의 합과 받아올림을 다음 자리 조건에 연결합니다.",
    invariant: "한 기호는 하나의 숫자만 나타내고 같은 열의 합은 결과 숫자와 받아올림을 함께 만족합니다.",
    representationKinds: Object.freeze(["cryptarithm-vertical", "fixed-digit", "carry-chain"])
  }),
  Object.freeze({
    id: "concept:number:multi-symbol-carry",
    label: "여러 기호와 받아올림 복면산",
    definition: "여러 기호가 있는 세로 복면산은 일의 자리에서 시작해 각 열의 합, 받아올림, 서로 다른 숫자 조건을 차례로 좁힙니다.",
    invariant: "모든 기호값은 서로 다른 숫자 조건을 지키며 각 열의 계산과 마지막 받아올림이 동시에 맞습니다.",
    representationKinds: Object.freeze(["cryptarithm-vertical", "multi-symbol", "carry-chain"])
  }),
  Object.freeze({
    id: "concept:number:binary-weight-decomposition",
    label: "카드의 두 배 묶음으로 수 만들기",
    definition: "카드의 값이 앞 카드의 두 배로 커질 때 필요한 카드를 골라 각 카드의 값을 더해 목표 수를 만듭니다.",
    invariant: "각 카드는 한 번만 사용하고 선택한 카드값의 합이 목표 수와 정확히 같아야 합니다.",
    representationKinds: Object.freeze(["value-cards", "doubling-sequence", "target-sum"])
  }),
  Object.freeze({
    id: "concept:pattern:colored-cell-place-value",
    label: "색칠한 칸의 자리값 더하기",
    definition: "각 열에 정해진 자리값을 찾고 색칠된 칸의 값을 모두 더해 수를 읽거나, 목표 수가 되도록 필요한 칸을 색칠합니다.",
    invariant: "같은 열의 칸은 같은 값을 가지며 한 열에 여러 칸이 색칠되면 그 열의 값을 색칠한 수만큼 더합니다.",
    representationKinds: Object.freeze(["colored-grid", "place-code", "cell-pattern"])
  }),
  Object.freeze({
    id: "concept:number:magic-square-target",
    label: "3×3 마방진의 목표 합",
    definition: "3×3 마방진은 가로, 세로, 대각선의 세 수를 더한 값이 모두 같도록 남은 수와 목표 합을 함께 확인합니다.",
    invariant: "가로, 세로, 대각선의 모든 세 칸 줄은 같은 목표 합이며 목표 칸은 그 칸을 지나는 모든 줄의 조건을 만족합니다.",
    representationKinds: Object.freeze(["magic-square-3", "line-sums", "missing-value"])
  })
]);

export const CONCEPT_DEFINITION_BY_ID = Object.freeze(Object.fromEntries(
  CONCEPT_DEFINITIONS.map((definition) => [definition.id, definition])
));

export const TYPE_CONCEPT_LESSONS = Object.freeze({
  "shape-quarter-half-turn": Object.freeze({
    conceptId: "concept:geometry:rotation-center-turn",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("rotation-center", "중심을 찾아요", "도형이 돌아가는 중심을 먼저 표시합니다."),
      beat("rotation-amount", "회전량을 정해요", "반의 반 바퀴인지 반 바퀴인지, 어느 방향으로 도는지 확인합니다."),
      beat("move-vertices", "꼭짓점을 옮겨요", "각 꼭짓점을 중심에서 같은 거리로 같은 회전량만큼 옮긴 뒤 차례로 잇습니다.")
    ]),
    misconception: "도형 전체를 밀거나 회전 방향을 반대로 잡지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("도형 움직이기", 1, [2, 3, 5, 6])
    ]),
    verificationState: "source-confirmed"
  }),
  "fold-cut-shape-choice": Object.freeze({
    conceptId: "concept:geometry:fold-reflection-unfold",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("fold-line", "접은 선을 찾아요", "종이가 어느 선을 따라 겹쳐졌는지 먼저 표시합니다."),
      beat("reflect-cut", "자른 자리를 비춰요", "접힌 상태의 자른 자리를 접은 선 반대쪽 같은 거리로 옮깁니다."),
      beat("complete-unfold", "펼친 모양을 완성해요", "원래 자리와 대칭 자리를 함께 그려 전체 모양을 확인합니다.")
    ]),
    misconception: "펼친 뒤에도 자른 모양을 한쪽에만 두지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("색종이 접기", 1, [1]),
      evidence("색종이 접기", 2, [1, 2, 3, 4])
    ]),
    verificationState: "source-confirmed"
  }),
  "circular-magic-line-sum": Object.freeze({
    conceptId: "concept:number:common-center-equal-line-sum",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("common-center", "공통 중심을 찾아요", "여러 줄에 함께 들어가는 가운데 수를 표시합니다."),
      beat("pair-sum", "필요한 짝의 합을 구해요", "한 줄의 합에서 가운데 수를 빼 마주 보는 두 수의 합을 찾습니다."),
      beat("opposite-pairs", "마주 보는 수를 짝지어요", "남은 수를 같은 합이 되는 짝으로 놓고 모든 줄을 다시 더합니다.")
    ]),
    misconception: "가운데 수가 여러 줄에 공통으로 들어간다는 점을 빼먹지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 1, [1])
    ]),
    verificationState: "source-confirmed"
  }),
  "person-item-logic": Object.freeze({
    conceptId: "concept:logic:one-to-one-elimination",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("make-grid", "표를 만들어요", "사람은 가로, 동물이나 음식은 세로에 놓아 조건을 한눈에 볼 수 있게 합니다."),
      beat("confirm-eliminate", "확정하고 지워요", "맞는 관계를 표시하고 같은 행과 열의 다른 가능성을 지웁니다."),
      beat("check-last", "남은 한 곳을 확인해요", "마지막 후보를 정한 뒤 처음부터 모든 조건에 다시 대입합니다.")
    ]),
    misconception: "한 조건만 보고 바로 정하지 말고 하나씩 대응 조건과 모든 문장을 함께 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("수 추리와 논리 추리", 2, [1, 2, 3, 4])
    ]),
    verificationState: "source-confirmed"
  }),
  "shape-mirror-direction": Object.freeze({
    conceptId: "concept:geometry:mirror-line-reflection",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("find-mirror-line", "거울선을 찾아요", "도형과 거울 사이의 선을 기준으로 어느 쪽에 비치는지 먼저 확인합니다."),
      beat("pair-points", "같은 거리로 옮겨요", "각 꼭짓점에서 거울선에 수직으로 가서 반대편 같은 거리의 점을 표시합니다."),
      beat("connect-reflection", "방향을 확인해 이어요", "대응하는 점을 원래 순서대로 잇고 좌우 방향이 바뀌었는지 확인합니다.")
    ]),
    misconception: "도형을 그대로 평행 이동하거나 거울선까지의 거리를 다르게 잡지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("도형 움직이기", 1, [1])
    ]),
    verificationState: "source-confirmed"
  }),
  "fold-number-cut-sum-textbook": Object.freeze({
    conceptId: "concept:geometry:folded-number-cut-sum",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("trace-folds", "접는 방향을 따라가요", "접는 선과 화살표를 차례로 보고 어느 칸이 어느 쪽으로 이동하는지 표시합니다."),
      beat("map-overlap", "겹친 원래 칸을 찾아요", "접힌 종이에서 자른 자리와 겹치는 원래 번호 칸을 펼치는 순서의 반대로 모두 찾습니다."),
      beat("sum-cut-cells", "잘린 칸의 수만 더해요", "표시한 번호가 빠짐없이 잘린 칸인지 다시 확인한 뒤 그 수들만 더합니다.")
    ]),
    misconception: "접힌 그림에서 보이는 한 칸만 보거나 잘리지 않은 이웃 칸까지 더하지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("색종이 접기", 1, [2, 3])
    ]),
    verificationState: "source-confirmed"
  }),
  "cross-shape-magic-sum": Object.freeze({
    conceptId: "concept:number:cross-center-equal-sum",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("mark-shared-center", "함께 쓰는 가운데를 표시해요", "가로줄과 세로줄에 모두 들어가는 가운데 칸을 먼저 표시합니다."),
      beat("match-arm-pairs", "양끝을 같은 합으로 짝지어요", "가운데 수를 제외하고 가로 양끝과 세로 양끝의 합이 같아지도록 수 카드를 짝지어 봅니다."),
      beat("check-two-lines", "두 줄을 다시 더해요", "카드를 놓은 뒤 가로줄과 세로줄을 각각 더해 두 합이 같은지 확인합니다.")
    ]),
    misconception: "가운데 수를 한 줄에만 넣거나 같은 수 카드를 두 번 사용하지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 1, [2, 3])
    ]),
    verificationState: "source-confirmed"
  }),
  "two-digit-condition": Object.freeze({
    conceptId: "concept:number:two-digit-place-conditions",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("separate-conditions", "조건을 자리별로 나눠요", "십의 자리 조건과 일의 자리 조건, 두 숫자의 합이나 차 조건을 따로 적습니다."),
      beat("list-candidates", "가능한 숫자쌍을 만들어요", "십의 자리가 0이 아닌 숫자쌍 가운데 먼저 만족하는 조건에 맞는 후보를 모두 적습니다."),
      beat("apply-all-conditions", "모든 조건으로 다시 걸러요", "남은 후보를 다른 조건에 하나씩 대입해 모두 만족하는 두 자리 수만 남깁니다.")
    ]),
    misconception: "조건 하나만 맞는 수를 고르거나 십의 자리에 0을 두지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("수 추리와 논리 추리", 1, [2, 3, 4])
    ]),
    verificationState: "source-confirmed"
  }),
  "shape-flip-composition": Object.freeze({
    conceptId: "concept:geometry:sequential-rigid-transforms",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("read-action-order", "움직임의 순서를 읽어요", "화살표와 문장을 보고 먼저 할 뒤집기나 돌리기부터 번호를 붙입니다."),
      beat("draw-intermediate", "중간 모양을 그려요", "첫 움직임으로 옮겨진 각 칸을 표시해 중간 모양을 완성합니다."),
      beat("apply-next-action", "다음 움직임을 이어서 해요", "중간 모양에 다음 움직임을 적용하고 칸 수와 연결이 그대로인지 확인합니다.")
    ]),
    misconception: "처음 모양에 두 움직임을 따로 적용하거나 움직임의 순서를 바꾸지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("도형 움직이기", 1, [4])
    ]),
    verificationState: "source-confirmed"
  }),
  "digital-digit-transform": Object.freeze({
    conceptId: "concept:pattern:seven-segment-transform",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("mark-lit-segments", "켜진 막대를 표시해요", "처음 숫자를 이루는 위·아래·양옆·가운데 막대를 빠짐없이 확인합니다."),
      beat("move-segments", "막대를 함께 움직여요", "각 막대를 제자리 모양 그대로 주어진 방향으로 뒤집거나 돌립니다."),
      beat("read-new-digit", "새 막대 모양을 읽어요", "움직인 뒤 켜진 막대의 위치를 보고 완성된 한 자리 숫자를 찾습니다.")
    ]),
    misconception: "숫자 모양을 외워서 바꾸거나 막대 하나만 따로 움직이지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("도형 움직이기", 2, [1, 2])
    ]),
    verificationState: "source-confirmed"
  }),
  "digital-two-digit-transform": Object.freeze({
    conceptId: "concept:pattern:seven-segment-transform",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("transform-each-digit", "두 숫자의 막대를 옮겨요", "십의 자리와 일의 자리 숫자를 이루는 막대를 각각 같은 움직임으로 옮깁니다."),
      beat("check-place-order", "자리 순서를 확인해요", "좌우 뒤집기나 반 바퀴 돌리기라면 왼쪽과 오른쪽 자리의 순서도 바뀌는지 확인합니다."),
      beat("read-two-digit-number", "십의 자리부터 다시 읽어요", "움직인 숫자판을 바로 세워 왼쪽을 십의 자리, 오른쪽을 일의 자리로 읽습니다.")
    ]),
    misconception: "각 숫자의 막대만 바꾸고 두 자리의 위치가 함께 바뀌는 경우를 놓치지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("도형 움직이기", 2, [3, 4])
    ]),
    verificationState: "source-confirmed"
  }),
  "t-shape-magic-sum": Object.freeze({
    conceptId: "concept:number:shared-junction-equal-sum",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("mark-shared-junction", "두 줄이 만나는 칸을 찾아요", "가로줄과 세로줄에 모두 들어가는 T자의 꺾이는 칸을 표시합니다."),
      beat("pair-remaining-cards", "나머지 네 수를 짝지어요", "공통 칸을 제외한 가로 두 칸과 세로 두 칸의 합이 같도록 수 카드를 두 쌍으로 나눕니다."),
      beat("verify-t-lines", "T자의 두 줄을 더해요", "카드를 놓은 뒤 가로 세 수와 세로 세 수를 각각 더해 두 합이 같은지 확인합니다.")
    ]),
    misconception: "T자의 꺾이는 칸을 두 번 놓거나 공통 칸이 아닌 다른 칸을 함께 세지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 1, [4, 5])
    ]),
    verificationState: "source-confirmed"
  }),
  "gakuro-card-rectangle-placement": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("list-card-values", "쓸 수 카드를 확인해요", "주어진 수 카드를 한 번씩만 쓰도록 사용 전 목록을 적고 놓은 카드는 지웁니다."),
      beat("complete-tight-row", "조건이 적은 줄부터 채워요", "빈칸이 적거나 가능한 두 수가 바로 정해지는 가로줄부터 합에 맞게 채웁니다."),
      beat("cross-check-columns", "세로 합과 함께 확인해요", "놓은 수가 세로 합에도 맞는지 확인하고 남은 카드를 다음 칸에 넣습니다.")
    ]),
    misconception: "가로 합만 맞추거나 같은 수 카드를 두 칸에 반복해서 쓰지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 2, [1, 2])
    ]),
    verificationState: "source-confirmed"
  }),
  "gakuro-grid-sum": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("write-number-range", "사용할 수를 모두 적어요", "주어진 범위의 서로 다른 여섯 수를 적어 각 수를 한 번씩 쓸 준비를 합니다."),
      beat("intersect-row-column", "가로와 세로 조건을 겹쳐 봐요", "한 칸에 들어갈 수를 그 칸의 가로 합과 세로 합을 모두 만족하는 후보로 좁힙니다."),
      beat("check-six-values", "여섯 칸을 함께 검산해요", "모든 줄의 합과 여섯 수의 중복 여부를 처음부터 다시 확인합니다.")
    ]),
    misconception: "한 줄을 완성한 뒤 다른 줄의 합이 달라지거나 범위의 수를 빠뜨리지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 2, [4])
    ]),
    verificationState: "source-confirmed"
  }),
  "gakuro-grid-nine-sum": Object.freeze({
    conceptId: "concept:number:row-column-sum-constraints",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("track-nine-values", "아홉 수의 사용표를 만들어요", "주어진 서로 다른 아홉 수를 적고 격자에 놓을 때마다 사용 표시를 합니다."),
      beat("use-completed-lines", "거의 완성된 줄부터 계산해요", "이미 수가 많이 보이는 가로줄이나 세로줄에서 목표 합에 부족한 수를 먼저 찾습니다."),
      beat("verify-all-lines", "모든 가로·세로를 확인해요", "아홉 칸을 채운 뒤 각 수를 한 번씩 썼는지와 모든 줄의 합을 차례로 검산합니다.")
    ]),
    misconception: "한 칸을 가로 계산과 세로 계산에서 서로 다른 수로 생각하거나 같은 수를 다시 쓰지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("마방진과 가쿠로 퍼즐", 2, [3])
    ]),
    verificationState: "source-confirmed"
  }),
  "three-digit-step-sequence": Object.freeze({
    conceptId: "concept:pattern:constant-step-sequence",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("find-neighbor-difference", "이웃한 두 수의 차를 구해요", "연달아 보이는 두 수에서 뒤 수와 앞 수의 차를 계산합니다."),
      beat("check-direction-step", "같은 방향과 크기인지 봐요", "다른 이웃한 수도 같은 만큼 커지거나 작아지는지 확인해 규칙을 정합니다."),
      beat("continue-step", "빈칸까지 같은 차를 이어요", "앞뒤에서 같은 수만큼 더하거나 빼 빈칸의 수를 채우고 다시 차를 확인합니다.")
    ]),
    misconception: "각 자리 숫자만 따로 보거나 커지는 수열과 작아지는 수열의 부호를 바꾸지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("수 추리와 논리 추리", 1, [1])
    ]),
    verificationState: "source-confirmed"
  }),
  "two-digit-even-ones-greater-gap": Object.freeze({
    conceptId: "concept:number:two-digit-place-conditions",
    scope: "global-type-id",
    sharedByDesign: true,
    beats: Object.freeze([
      beat("choose-even-ones", "일의 자리 짝수를 골라요", "두 자리 짝수의 일의 자리에는 0, 2, 4, 6, 8만 올 수 있음을 먼저 사용합니다."),
      beat("apply-ones-gap", "일의 자리가 더 큰 차를 맞춰요", "일의 자리에서 십의 자리를 뺀 값이 주어진 차와 같은 숫자쌍을 찾습니다."),
      beat("check-range-conditions", "범위와 다른 조건을 확인해요", "만든 두 자리 수가 주어진 범위와 나머지 조건을 모두 만족하는지 확인합니다.")
    ]),
    misconception: "짝수 조건을 십의 자리에 적용하거나 자리 숫자의 차를 반대 순서로 계산하지 않았는지 확인합니다.",
    sourceEvidence: Object.freeze([
      evidence("수 추리와 논리 추리", 1, [5])
    ]),
    verificationState: "source-confirmed"
  }),
  "equal-partition-two": sourceLesson(
    "concept:number:equal-partition-two",
    [
      beat("read-whole-two", "전체와 두 부분을 확인해요", "맨 위의 전체 수와 아래로 갈라지는 두 빈칸을 확인합니다."),
      beat("make-equal-halves", "같은 두 수를 찾아요", "두 빈칸에 같은 수를 넣어 더했을 때 전체가 되는 수를 찾습니다."),
      beat("check-two-sum", "두 수를 더해 확인해요", "찾은 수를 두 번 더해 처음 전체 수가 되는지 확인합니다.")
    ],
    "한쪽에만 전체의 반을 쓰거나 서로 다른 두 수로 나누지 않았는지 확인합니다.",
    [book2Evidence("매트릭스와 주고받기", 1, [1])]
  ),
  "equal-partition-four": sourceLesson(
    "concept:number:nested-halving-four",
    [
      beat("first-halving", "먼저 반으로 갈라요", "전체 수를 같은 두 수로 나누어 가운데 두 칸을 채웁니다."),
      beat("second-halving", "각 반을 다시 갈라요", "가운데의 한 수를 다시 반으로 나누어 맨 아래 네 칸을 같은 수로 채웁니다."),
      beat("check-four-parts", "네 수의 합을 확인해요", "맨 아래 같은 네 수를 모두 더해 처음 전체와 같은지 확인합니다.")
    ],
    "전체를 한 번만 반으로 나눈 수를 맨 아래에 그대로 쓰지 않았는지 확인합니다.",
    [book2Evidence("매트릭스와 주고받기", 1, [2])]
  ),
  "equal-partition-three": sourceLesson(
    "concept:number:equal-partition-three",
    [
      beat("read-whole-three", "세 갈래를 확인해요", "전체 수에서 같은 크기의 세 갈래로 나뉘는 모양을 확인합니다."),
      beat("find-repeated-addend", "세 번 더할 수를 찾아요", "같은 수를 세 번 더했을 때 전체가 되는 수를 찾습니다."),
      beat("check-three-sum", "세 부분을 다시 더해요", "세 빈칸의 수가 모두 같고 합이 처음 전체인지 확인합니다.")
    ],
    "전체를 두 부분으로만 나누거나 세 빈칸에 서로 다른 수를 쓰지 않았는지 확인합니다.",
    [book2Evidence("매트릭스와 주고받기", 1, [3])]
  ),
  "shape-sum-table": sourceLesson(
    "concept:number:shape-sum-matrix-elimination",
    [
      beat("find-single-shape-line", "같은 도형만 있는 줄을 찾아요", "한 종류의 도형이 반복되어 값이 바로 정해지는 가로줄이나 세로줄부터 찾습니다."),
      beat("substitute-shape-values", "찾은 값을 다른 줄에 넣어요", "알아낸 도형값을 다른 줄의 같은 도형 자리에 바꾸어 넣어 다음 도형값을 구합니다."),
      beat("check-row-column-sums", "가로와 세로 합을 검산해요", "구한 도형값으로 모든 가로 합과 세로 합이 표시된 수와 맞는지 확인합니다.")
    ],
    "같은 도형에 줄마다 다른 값을 주거나 가로 합만 확인하지 않았는지 살펴봅니다.",
    [book2Evidence("매트릭스와 주고받기", 1, [4, 5])]
  ),
  "equalize-transfer": sourceLesson(
    "concept:number:transfer-equalization",
    [
      beat("find-starting-gap", "두 수의 차이를 구해요", "많이 가진 수에서 적게 가진 수를 빼 처음 차이를 구합니다."),
      beat("halve-transfer-gap", "차이의 반을 옮겨요", "한 개를 옮길 때 차이가 두 개 줄어드므로 처음 차이를 같은 두 수로 가릅니다."),
      beat("check-equal-results", "준 뒤와 받은 뒤를 비교해요", "큰 수에서는 옮긴 수를 빼고 작은 수에는 더해 두 결과가 같은지 확인합니다.")
    ],
    "처음 차이만큼 모두 옮겨 두 수의 크기가 서로 뒤바뀌지 않았는지 확인합니다.",
    [book2Evidence("매트릭스와 주고받기", 2, [1, 2, 3])]
  ),
  "total-difference": sourceLesson(
    "concept:number:sum-difference-split",
    [
      beat("separate-difference", "전체에서 차이를 떼어요", "전체 수에서 큰 수가 더 가진 차이만큼을 먼저 빼냅니다."),
      beat("halve-equal-remainder", "남은 수를 반으로 나눠요", "차이를 뺀 나머지는 두 수의 같은 부분이므로 똑같이 둘로 가릅니다."),
      beat("restore-larger-value", "큰 수에 차이를 붙여요", "작은 수에 차이를 더해 큰 수를 만들고 합과 차를 모두 다시 확인합니다.")
    ],
    "전체를 바로 반으로 나누거나 작은 수에 차이를 더하지 않고 답을 정하지 않았는지 확인합니다.",
    [book2Evidence("매트릭스와 주고받기", 2, [4, 5])]
  ),
  "balance-order-chain": sourceLesson(
    "concept:logic:balance-transitive-order",
    [
      beat("read-lower-pan", "내려간 접시를 찾아요", "각 저울에서 더 아래로 내려간 접시의 물건을 더 무겁다고 기록합니다."),
      beat("link-comparisons", "같은 물건을 이어요", "서로 다른 저울에 함께 나온 물건을 기준으로 무겁고 가벼운 관계를 연결합니다."),
      beat("verify-balance-order", "모든 저울로 순서를 확인해요", "만든 순서를 각 저울에 다시 대입해 어느 관계도 거꾸로 되지 않는지 확인합니다.")
    ],
    "접시의 높이를 반대로 읽거나 서로 이어지지 않은 비교를 바로 순서로 정하지 않았는지 확인합니다.",
    [book2Evidence("양팔저울", 1, [1, 2, 3, 4])]
  ),
  "distinct-shape-value-equation": sourceLesson(
    "concept:number:distinct-symbol-equation-chain",
    [
      beat("solve-repeated-symbol", "같은 도형 식부터 풀어요", "한 도형이 여러 번 더해진 식에서 그 도형 하나의 값을 먼저 구합니다."),
      beat("substitute-next-symbol", "찾은 값을 다음 식에 넣어요", "이미 구한 도형을 수로 바꾸어 쓰고 새 도형의 값을 차례로 찾습니다."),
      beat("check-distinct-values", "서로 다른 값인지 확인해요", "모든 식이 맞는지와 서로 다른 도형의 값이 겹치지 않는지 함께 확인합니다.")
    ],
    "그림 모양이 다른데 같은 값을 주거나 아직 모르는 도형을 먼저 계산하지 않았는지 확인합니다.",
    [book2Evidence("양팔저울", 2, [1, 2, 3, 4])]
  ),
  "repeating-number-sequence": sourceLesson(
    "concept:pattern:shortest-number-repeat-unit",
    [
      beat("find-cycle-restart", "처음 수가 다시 나오는 곳을 찾아요", "수열의 처음 수가 같은 순서로 다시 나타나는 위치를 표시합니다."),
      beat("choose-shortest-number-cycle", "가장 짧은 반복마디를 묶어요", "되풀이되는 수들을 필요 이상 길지 않은 가장 짧은 묶음으로 정합니다."),
      beat("continue-number-cycle", "빈칸까지 반복해 써요", "반복마디를 처음부터 차례로 이어 빈칸 위치의 수를 찾습니다.")
    ],
    "우연히 같은 수 하나만 보고 반복마디를 정하거나 묶음의 시작 위치를 바꾸지 않았는지 확인합니다.",
    [book2Evidence("규칙찾기와 수열", 1, [1])]
  ),
  "repeating-symbol-sequence": sourceLesson(
    "concept:pattern:multi-attribute-repeat-unit",
    [
      beat("separate-pattern-features", "모양·색·개수를 따로 봐요", "그림마다 모양, 색, 개수가 어떤 순서로 변하는지 각각 한 줄로 적습니다."),
      beat("align-feature-cycles", "두 반복마디를 함께 맞춰요", "각 반복마디가 처음 상태로 함께 돌아오는 위치를 찾아 하나의 큰 마디로 묶습니다."),
      beat("compose-next-symbol", "다음 그림을 합쳐 만들어요", "다음 위치의 모양과 색 또는 개수를 각각 찾은 뒤 한 그림으로 합칩니다.")
    ],
    "모양 규칙만 맞고 색이나 개수 규칙은 틀린 그림을 고르지 않았는지 확인합니다.",
    [book2Evidence("규칙찾기와 수열", 1, [2, 3, 4])]
  ),
  "matchstick-shared-polygon-growth": sourceLesson(
    "concept:pattern:shared-edge-linear-growth",
    [
      beat("count-first-polygon", "첫 모양의 성냥개비를 세어요", "다각형 하나를 만드는 데 필요한 성냥개비 수를 빠짐없이 셉니다."),
      beat("count-added-edges", "하나 붙을 때 늘어나는 수를 찾아요", "맞닿아 함께 쓰는 변을 제외하고 새 다각형에서 추가되는 변만 셉니다."),
      beat("extend-growth-count", "늘어나는 수를 단계만큼 더해요", "첫 모양에서 시작해 추가되는 수를 필요한 횟수만큼 더하고 작은 단계로 검산합니다.")
    ],
    "다각형마다 모든 변을 다시 세어 맞닿은 변을 두 번 세지 않았는지 확인합니다.",
    [book2Evidence("규칙찾기와 수열", 2, [1, 2])]
  ),
  "triangular-stone-growth": sourceLesson(
    "concept:pattern:triangular-two-color-count",
    [
      beat("read-triangle-rows", "삼각형의 줄 수를 확인해요", "해당 단계에서 위부터 각 줄에 놓인 바둑돌 수를 차례로 적습니다."),
      beat("count-triangle-colors", "두 색을 따로 세어요", "줄마다 검은 돌과 흰 돌을 구분해 각각의 개수를 모두 더합니다."),
      beat("compare-triangle-colors", "두 개수의 차를 구해요", "더 많은 색의 수에서 적은 색의 수를 빼고 두 색의 합이 전체와 같은지도 확인합니다.")
    ],
    "삼각형의 전체 수만 세고 색의 배치를 무시하거나 두 색의 차를 반대로 쓰지 않았는지 확인합니다.",
    [book2Evidence("규칙찾기와 수열", 2, [3])]
  ),
  "square-border-stone-growth": sourceLesson(
    "concept:pattern:square-border-interior-count",
    [
      beat("find-square-side", "네모의 한 변 길이를 찾아요", "단계가 커질 때 한 변에 놓이는 바둑돌 수가 어떻게 늘어나는지 확인합니다."),
      beat("count-border-interior", "테두리와 안쪽을 나눠 세어요", "모서리를 한 번씩만 세어 테두리 돌 수를 구하고 안쪽 정사각형의 돌을 따로 셉니다."),
      beat("compare-square-colors", "두 색의 수를 비교해요", "테두리와 안쪽의 색별 개수를 비교하고 둘을 더해 전체 칸 수와 같은지 확인합니다.")
    ],
    "테두리 네 변의 모서리를 두 번 세거나 안쪽 칸까지 테두리로 세지 않았는지 확인합니다.",
    [book2Evidence("규칙찾기와 수열", 2, [4])]
  ),
  "four-number-center-rule": sourceLesson(
    "concept:number:four-outer-center-operation",
    [
      beat("compare-outer-center-examples", "완성된 그림을 비교해요", "앞의 그림마다 바깥 네 수와 가운데 수가 어떻게 연결되는지 계산을 여러 가지로 시도합니다."),
      beat("confirm-one-center-rule", "모두 맞는 약속 하나를 정해요", "한 그림에만 맞는 계산은 지우고 모든 완성 그림에 같은 순서로 맞는 계산을 남깁니다."),
      beat("apply-center-rule", "마지막 그림에 적용해요", "정한 계산 순서에 마지막 바깥 네 수를 넣어 가운데 수를 구하고 보기에도 다시 적용합니다.")
    ],
    "첫 번째 그림 하나에만 맞는 계산을 약속으로 정하거나 덧셈과 뺄셈의 순서를 바꾸지 않았는지 확인합니다.",
    [book2Evidence("약속과 스도쿠", 1, [1])]
  ),
  "number-grid-row-rule": sourceLesson(
    "concept:number:uniform-row-operation",
    [
      beat("test-complete-rows", "완성된 줄의 계산을 찾아요", "답이 보이는 줄에서 앞의 수들을 더하거나 빼 마지막 수가 되는 계산을 찾아봅니다."),
      beat("distinguish-row-rules", "모든 줄로 규칙을 가려요", "둘 이상의 줄에 같은 계산 순서를 적용해 우연히 맞는 다른 규칙을 지웁니다."),
      beat("solve-hidden-row-cell", "빈 줄에도 같은 순서를 써요", "남은 한 계산 순서를 마지막 줄에 적용해 빈칸의 수를 구하고 전체 줄을 검산합니다.")
    ],
    "줄마다 다른 계산을 사용하거나 수의 순서를 바꿔 우연히 맞는 답을 고르지 않았는지 확인합니다.",
    [book2Evidence("약속과 스도쿠", 1, [4, 5, 6])]
  ),
  "two-digit-compose-rule": sourceLesson(
    "concept:number:compose-two-digit-operation",
    [
      beat("compose-place-values", "숫자로 두 자리 수를 만들어요", "그림의 순서를 읽어 앞 숫자는 십의 자리, 뒤 숫자는 일의 자리에 놓습니다."),
      beat("identify-compose-operation", "보기의 계산 약속을 찾아요", "완성된 보기에서 두 자리 수끼리 더하는지 빼는지와 계산 순서를 확인합니다."),
      beat("calculate-composed-numbers", "새 두 수를 계산해요", "마지막 그림의 두 자리 수를 정확히 적고 같은 계산을 한 뒤 자리별로 검산합니다.")
    ],
    "두 숫자를 더한 값을 두 자리 수로 잘못 읽거나 십의 자리와 일의 자리를 바꾸지 않았는지 확인합니다.",
    [book2Evidence("약속과 스도쿠", 1, [2, 3])]
  ),
  "sudoku-three-row-column": sourceLesson(
    "concept:logic:latin-row-column-three",
    [
      beat("list-three-candidates", "1·2·3 후보를 적어요", "빈칸마다 들어갈 수 있는 1, 2, 3을 준비하고 같은 줄에 이미 있는 수를 지웁니다."),
      beat("use-row-column-three", "가로와 세로를 함께 봐요", "가로줄에서 남은 후보와 세로줄에서 남은 후보가 같은 한 수인 칸부터 채웁니다."),
      beat("verify-three-grid", "모든 줄의 중복을 확인해요", "표를 채운 뒤 각 가로줄과 세로줄에 1, 2, 3이 한 번씩 있는지 확인합니다.")
    ],
    "가로줄만 보고 수를 넣거나 같은 세로줄에 같은 수를 두 번 쓰지 않았는지 확인합니다.",
    [book2Evidence("약속과 스도쿠", 2, [1])]
  ),
  "sudoku-four-square-region": sourceLesson(
    "concept:logic:latin-row-column-region-four",
    [
      beat("list-four-candidates", "1부터 4까지 후보를 적어요", "빈칸마다 1, 2, 3, 4 가운데 가로줄과 세로줄에 없는 수를 남깁니다."),
      beat("use-square-region", "2×2 굵은 칸도 확인해요", "가로·세로 후보 가운데 같은 굵은 영역에 이미 있는 수를 지워 한 칸의 수를 정합니다."),
      beat("verify-four-constraints", "세 가지 조건을 모두 검산해요", "각 가로줄, 세로줄, 2×2 굵은 영역에 1부터 4까지 한 번씩 있는지 확인합니다.")
    ],
    "가로와 세로만 맞추고 2×2 굵은 영역 안의 중복을 놓치지 않았는지 확인합니다.",
    [book2Evidence("약속과 스도쿠", 2, [2, 3])]
  ),
  "tangram-shape-composition": sourceLesson(
    "concept:geometry:tangram-composition",
    [
      beat("read-piece-boundaries", "조각의 모양과 경계를 살펴봐요", "각 조각의 변과 꼭짓점을 보고 어느 조각이 빈 모양의 어느 부분에 맞을지 확인합니다."),
      beat("transform-and-fit-pieces", "돌리거나 뒤집어 맞춰요", "조각의 크기는 바꾸지 않고 돌리거나 뒤집어 바깥선과 맞닿는 변을 맞춥니다."),
      beat("check-complete-composition", "겹침과 빈틈을 확인해요", "모든 조각을 사용했는지, 서로 겹치지 않는지, 바깥선 안에 빈틈없이 들어갔는지 검산합니다.")
    ],
    "조각의 크기를 늘리거나 줄여 모양에 맞추거나, 빈틈과 겹침을 확인하지 않고 완성했다고 하지 않았는지 살펴봅니다.",
    [book3Evidence("단위넓이와 분수", 1, [1, 2, 3])]
  ),
  "unit-grid-area": sourceLesson(
    "concept:geometry:unit-grid-area",
    [
      beat("identify-unit-square", "한 단위 칸을 정해요", "격자에서 같은 크기의 정사각형 한 칸이 무엇인지 확인하고 도형 안에 들어간 칸을 표시합니다."),
      beat("count-full-and-partial", "온 칸과 부분 칸을 나눠 세요", "온전히 들어간 칸을 먼저 세고 잘린 부분은 서로 합쳐 한 칸이 되는지 살펴봅니다."),
      beat("compare-unit-area", "단위 넓이의 합으로 비교해요", "센 칸의 넓이를 모두 더해 도형의 넓이를 구하고 다른 도형도 같은 단위로 비교합니다.")
    ],
    "도형의 테두리 길이나 눈에 보이는 크기만 비교하거나 부분 칸을 임의로 한 칸으로 세지 않았는지 확인합니다.",
    [book3Evidence("단위넓이와 분수", 1, [4, 5])]
  ),
  "equal-part-shaded-fraction": sourceLesson(
    "concept:geometry:equal-parts-fraction",
    [
      beat("count-equal-whole", "전체를 같은 부분으로 세요", "도형 전체가 몇 개의 같은 크기 부분으로 나뉘었는지 먼저 셉니다."),
      beat("count-shaded-parts", "색칠한 부분을 세요", "전체와 같은 단위로 색칠된 부분의 수를 세어 분자에 해당하는 수를 정합니다."),
      beat("write-fraction-order", "전체와 색칠한 부분을 분수로 써요", "전체 부분 수를 아래에, 색칠한 부분 수를 위에 써서 분수로 나타내고 그림과 다시 대조합니다.")
    ],
    "색칠한 부분을 분모에 쓰거나 크기가 서로 다른 부분을 같은 한 부분으로 세지 않았는지 확인합니다.",
    [book3Evidence("단위넓이와 분수", 2, [1, 2, 3])]
  ),
  "equal-partition-drawing": sourceLesson(
    "concept:geometry:equal-partition-construction",
    [
      beat("read-whole-shape", "나눌 전체 모양을 확인해요", "경계선 안의 전체 도형과 몇 부분으로 나누어야 하는지 확인합니다."),
      beat("draw-equal-regions", "같은 넓이의 경계선을 그어요", "도형 안에서 각 부분이 같은 넓이가 되도록 경계선을 긋고 한 부분의 크기를 비교합니다."),
      beat("check-cover-and-equality", "전체를 빠짐없이 덮는지 확인해요", "선을 따라 나뉜 부분이 서로 겹치지 않고 전체를 덮으며 모든 부분의 넓이가 같은지 확인합니다.")
    ],
    "부분의 개수만 맞추고 넓이가 다른 부분을 만들거나 경계선을 도형 밖으로 그리지 않았는지 확인합니다.",
    [book3Evidence("단위넓이와 분수", 2, [4])]
  ),
  "folded-strip-length": sourceLesson(
    "concept:geometry:folded-strip-total-length",
    [
      beat("mark-strip-turns", "띠가 꺾이는 점을 표시해요", "모눈 위에서 띠의 방향이 바뀌는 점을 찾아 가로 구간과 세로 구간으로 나눕니다."),
      beat("count-each-strip-segment", "각 구간의 칸 수를 세요", "구간마다 지나간 모눈 칸 수를 세고, 같은 자리를 다시 지나더라도 띠의 서로 다른 구간이면 각각 기록합니다."),
      beat("sum-strip-segments", "모든 구간 길이를 더해요", "처음부터 끝까지 기록한 구간 길이를 모두 더하고 꺾인 구간을 빠뜨리지 않았는지 다시 따라갑니다.")
    ],
    "두 끝점 사이의 곧은 거리만 구하거나 화면에서 겹쳐 보이는 서로 다른 구간을 한 번만 세지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 1, [1, 2])]
  ),
  "midpoint-number-line": sourceLesson(
    "concept:number:number-line-midpoint",
    [
      beat("read-endpoints", "수직선의 양 끝 수를 읽어요", "두 점의 수를 확인하고 양 끝 사이가 몇 칸인지 셉니다."),
      beat("split-distance-equally", "차이를 같은 두 구간으로 나눠요", "큰 수와 작은 수의 차이를 구한 뒤 그 차이를 반으로 나누어 가운데까지의 거리를 찾습니다."),
      beat("locate-midpoint", "양쪽에서 같은 거리인지 확인해요", "작은 끝 수에 가운데까지의 거리를 더하고 큰 끝 수에서 같은 거리를 빼 두 계산이 같은지 확인합니다.")
    ],
    "수직선에서 눈금의 위치만 보고 가운데를 정하거나 양 끝의 차이를 한 번만 나누지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 1, [3, 4])]
  ),
  "equal-interval-length": sourceLesson(
    "concept:geometry:equal-interval-unit-length",
    [
      beat("count-intervals", "두 점 사이의 간격 수를 세요", "양 끝 점이 아니라 그 사이에 있는 같은 간격의 개수를 정확히 셉니다."),
      beat("divide-total-length", "전체 길이를 간격 수로 나눠요", "두 점의 전체 길이를 같은 간격 수로 나누어 한 간격의 길이를 구합니다."),
      beat("rebuild-endpoint", "간격을 반복해 끝점을 확인해요", "한 간격의 길이를 필요한 횟수만큼 더해 처음의 끝점과 다른 끝점이 맞는지 검산합니다.")
    ],
    "눈금의 개수와 간격의 개수를 혼동하거나 전체 길이를 간격 수가 아닌 눈금 수로 나누지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 2, [3])]
  ),
  "walking-step-ratio": sourceLesson(
    "concept:number:step-length-ratio",
    [
      beat("match-one-long-step", "긴 한 걸음에 짧은 걸음을 맞춰요", "한 아이의 한 걸음 동안 다른 대상이 몇 걸음을 걷는지 배수 관계를 그림이나 식으로 나타냅니다."),
      beat("repeat-step-group", "긴 걸음 수만큼 묶음을 반복해요", "짧은 걸음 묶음을 아이의 걸음 수만큼 반복해 전체 걸음 수를 구합니다."),
      beat("verify-same-distance", "두 이동 거리가 같은지 확인해요", "긴 걸음 수와 배수를 곱한 값이 짧은 걸음 수인지 확인하고 두 쪽의 이동 거리가 같은지 검산합니다.")
    ],
    "걸음 수가 많은 사람이 한 걸음도 더 길다고 생각하거나 두 사람의 전체 거리가 같다는 조건을 빼먹지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 2, [1])]
  ),
  "route-distance-multiple": sourceLesson(
    "concept:number:route-distance-multiple",
    [
      beat("order-three-places", "세 장소의 순서를 확인해요", "집과 중간 장소와 도착 장소가 한 길 위에서 어떤 순서인지 표시합니다."),
      beat("subtract-first-route", "전체에서 첫 구간을 빼요", "집에서 도착 장소까지의 전체 거리에서 집에서 중간 장소까지의 거리를 빼 나머지 구간을 구합니다."),
      beat("compare-route-multiple", "두 구간이 몇 배인지 비교해요", "나머지 구간을 첫 구간의 같은 단위 묶음으로 나누고 더해서 전체 거리로 돌아오는지 검산합니다.")
    ],
    "전체 거리를 바로 배수로 답하거나, 전체에서 첫 구간을 빼지 않고 서로 다른 구간을 비교하지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 2, [2])]
  ),
  "rod-ratio-total-book3": sourceLesson(
    "concept:number:rod-ratio-shared-unit",
    [
      beat("count-rod-units", "두 막대의 같은 칸을 세요", "㉠과 ㉡을 이루는 같은 길이 칸의 수를 각각 세고 두 칸 수를 더합니다."),
      beat("find-one-rod-unit", "전체 길이로 한 칸을 구해요", "두 막대의 전체 길이를 모든 칸 수로 똑같이 나누어 한 칸의 길이를 구합니다."),
      beat("scale-each-rod", "각 막대의 길이를 구해요", "한 칸 길이에 각 막대의 칸 수를 곱하고 두 길이의 합이 주어진 전체 길이인지 확인합니다.")
    ],
    "서로 다른 단위의 길이를 바로 더하거나 비의 앞뒤를 바꾸어 막대 길이를 정하지 않았는지 확인합니다.",
    [book3Evidence("단위길이와 배수", 2, [4])]
  ),
  "cryptarithm-repeated-number-double": sourceLesson(
    "concept:number:repeated-two-digit-doubling",
    [
      beat("align-place-values", "세로셈의 자리를 맞춰요", "각 기호가 십의 자리인지 일의 자리인지 확인하고 수를 세로로 맞춥니다."),
      beat("keep-repeated-symbol", "같은 기호는 같은 숫자로 읽어요", "여러 자리에 반복된 기호를 하나의 같은 숫자로 두고 식을 자리별로 살펴봅니다."),
      beat("check-column-sum", "각 열의 계산을 검산해요", "일의 자리부터 계산해 결과의 각 자리와 맞는지, 필요한 받아올림이 있는지 확인합니다.")
    ],
    "같은 기호에 자리마다 다른 숫자를 주거나 가로로 보이는 수만 계산하고 세로 자리값을 확인하지 않았는지 살펴봅니다.",
    [book3Evidence("복면산", 1, [1, 2])]
  ),
  "cryptarithm-fixed-digit-addition": sourceLesson(
    "concept:number:fixed-digit-cryptarithm",
    [
      beat("use-fixed-digit", "정해진 숫자를 먼저 표시해요", "문제에서 이미 알려 준 숫자를 해당 자리에 적고 같은 기호가 반복되는 위치를 표시합니다."),
      beat("start-from-ones-column", "일의 자리부터 더해요", "일의 자리 합을 계산하고 결과의 일의 자리와 받아올림을 확인합니다."),
      beat("carry-to-next-column", "받아올림을 다음 자리로 이어요", "십의 자리와 그다음 자리에서 받아올림을 더해 결과와 일치하는지 끝까지 검산합니다.")
    ],
    "정해진 숫자를 다른 기호처럼 바꾸거나 일의 자리의 받아올림을 다음 열에 더하지 않았는지 확인합니다.",
    [book3Evidence("복면산", 1, [3, 4])]
  ),
  "cryptarithm-multi-symbol-carry": sourceLesson(
    "concept:number:multi-symbol-carry",
    [
      beat("list-symbol-constraints", "기호와 자리 조건을 정리해요", "기호마다 가능한 숫자를 적고 같은 기호의 반복, 서로 다른 기호의 중복 금지 조건을 표시합니다."),
      beat("solve-from-right", "오른쪽 열부터 받아올림을 따라가요", "일의 자리부터 각 열의 합을 계산하고 결과 숫자와 다음 열로 넘어가는 받아올림을 함께 기록합니다."),
      beat("verify-all-symbols", "모든 기호와 열을 한 번에 검산해요", "정한 숫자를 전체 세로식에 넣어 각 열의 합과 마지막 받아올림이 모두 맞는지 확인합니다.")
    ],
    "한 열만 맞는 숫자를 고르거나 서로 다른 기호에 같은 숫자를 주고, 받아올림을 한 열 건너뛰지 않았는지 확인합니다.",
    [book3Evidence("복면산", 2, [1, 2, 3, 4])]
  ),
  "binary-weight-selection": sourceLesson(
    "concept:number:binary-weight-decomposition",
    [
      beat("read-doubling-card-values", "카드값이 두 배로 커지는지 읽어요", "카드가 어떤 값에서 시작해 다음 카드마다 어떻게 커지는지 순서대로 확인합니다."),
      beat("decompose-target", "목표 수를 카드값으로 나눠 봐요", "목표 수에서 큰 카드부터 빼 보며 남은 수가 다음 카드값으로 만들 수 있는지 확인합니다."),
      beat("check-one-use-sum", "카드를 한 번씩 써서 합을 확인해요", "선택한 카드만 한 번씩 더해 목표 수가 되는지, 선택하지 않은 카드가 섞이지 않았는지 검산합니다.")
    ],
    "카드값의 두 배 규칙을 무시하고 아무 카드나 고르거나 한 카드를 두 번 사용하지 않았는지 확인합니다.",
    [book3Evidence("마법카드와 마방진", 1, [1])]
  ),
  "colored-cell-number-code": sourceLesson(
    "concept:pattern:colored-cell-place-value",
    [
      beat("infer-column-values", "보기에서 각 열의 값을 찾아요", "한 칸씩 색칠된 보기와 두 칸이 색칠된 보기를 비교해 오른쪽부터 각 열의 값이 어떻게 커지는지 찾습니다."),
      beat("sum-colored-cell-values", "색칠한 칸의 값을 더해요", "색칠된 칸마다 그 열의 값을 적고 같은 열에 여러 칸이 있으면 각각 한 번씩 더합니다."),
      beat("apply-cell-code", "수를 읽거나 필요한 칸을 색칠해요", "구한 합으로 색칠 그림의 수를 읽고, 목표 수가 주어지면 필요한 열의 값을 골라 같은 규칙으로 색칠합니다.")
    ],
    "색칠한 칸의 개수만 세거나 같은 열의 값을 임의로 바꾸고, 여러 칸이 있는 열의 값을 한 번만 더하지 않았는지 확인합니다.",
    [book3Evidence("마법카드와 마방진", 1, [2, 3])]
  ),
  "magic-square-three-target": sourceLesson(
    "concept:number:magic-square-target",
    [
      beat("read-three-cell-lines", "가로·세로·대각선 줄을 찾아요", "3×3 표에서 세 칸씩 이어지는 가로줄, 세로줄, 대각선을 빠짐없이 표시합니다."),
      beat("use-known-line-sum", "완성된 줄에서 목표 합을 찾아요", "수가 모두 보이는 줄을 더해 공통 목표 합을 정하고 다른 줄에도 같은 값이 적용되는지 확인합니다."),
      beat("fill-and-check-target", "남은 수를 넣고 모든 줄을 검산해요", "빈칸에 들어갈 수를 줄의 목표 합으로 좁힌 뒤 세 방향의 모든 줄이 같은 합인지 확인합니다.")
    ],
    "가로줄만 확인하거나 대각선을 빠뜨리고, 한 줄의 합을 목표로 정한 뒤 다른 줄에 적용하지 않았는지 확인합니다.",
    [book3Evidence("마법카드와 마방진", 2, [3])]
  )
});
