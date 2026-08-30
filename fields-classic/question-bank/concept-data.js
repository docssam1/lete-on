// Source-backed concept lessons are intentionally separate from the broad
// curriculum taxonomy. These records contain only public-safe source locators,
// never scans, answers, local paths, or reproducing seeds.
const beat = (id, label, text) => Object.freeze({ id, label, text });

const evidence = (unitLabel, group, numbers) => Object.freeze({
  source: "Fields the Classic Course 1 Book 1",
  bookId: "book-01",
  unitLabel,
  stage: "concept",
  section: "activity",
  group,
  numbers: Object.freeze(numbers),
  verificationState: "source-confirmed",
  visibility: "public-safe"
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
  })
});
