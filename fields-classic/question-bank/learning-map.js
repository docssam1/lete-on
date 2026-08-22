export const LEARNING_MAP_SOURCE = Object.freeze({
  id: "kr-elementary-learning-map",
  title: "Korean Elementary Learning Map",
  repository: "https://github.com/DECK6/korean-elementary-learning-map",
  license: "MIT",
  release: "kr-full-depth-v0.4",
  commit: "3ef0563084aa2a9baaa47da2c1ec0ebf5d7edc5c",
  retrievedAt: "2026-08-21",
  scope: "2022 개정 교육과정의 초1~2 수학 학습 요소를 바탕으로 한 비공식 관련 위치",
  disclaimer: "학습 내용의 관련 위치를 안내하며 공식 성취기준 판정이나 학생 개인 진단을 의미하지 않습니다."
});

const LEARNING_FLOW = Object.freeze([
  "개념 확인",
  "표현과 연결",
  "적용과 설명"
]);

const TOPIC_SUFFIXES = Object.freeze(["concept", "representation", "application"]);

function sequence(prefix, start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => `${prefix}${String(start + index).padStart(2, "0")}`);
}

function topicIds(path, standardIds) {
  return standardIds.flatMap((standardId) => TOPIC_SUFFIXES.map((suffix) => `kr.mt.math.${path}.g1-2.s2-${standardId}.${suffix}`));
}

function group({ id, nationalDomain, strand, standardPrefix, path, start, end, note }) {
  const standardIds = sequence(standardPrefix, start, end);
  const standards = standardIds.map((standardId) => `[2수${standardId}]`);
  return Object.freeze({
    id,
    nationalDomain,
    strand,
    gradeBand: "초1~2",
    standards: Object.freeze(standards),
    standardRange: standards.length === 1 ? standards[0] : `${standards[0]}~${standards.at(-1)}`,
    topicIds: Object.freeze(topicIds(path, standardIds)),
    flow: LEARNING_FLOW,
    alignment: "related",
    note
  });
}

export const LEARNING_MAP_GROUPS = Object.freeze({
  numberConcept: group({
    id: "number-concept",
    nationalDomain: "수와 연산",
    strand: "네 자리 이하의 수",
    standardPrefix: "01-",
    path: "number-operations",
    start: 1,
    end: 4,
    note: "수의 크기, 자릿값, 수의 관계를 바탕으로 조건을 해석합니다."
  }),
  additionSubtraction: group({
    id: "addition-subtraction",
    nationalDomain: "수와 연산",
    strand: "두 자리 수 범위의 덧셈과 뺄셈",
    standardPrefix: "01-",
    path: "number-operations",
    start: 5,
    end: 9,
    note: "덧셈과 뺄셈의 뜻, 관계, 계산 전략을 문제 상황에 적용합니다."
  }),
  multiplication: group({
    id: "multiplication",
    nationalDomain: "수와 연산",
    strand: "한 자리 수의 곱셈",
    standardPrefix: "01-",
    path: "number-operations",
    start: 10,
    end: 11,
    note: "묶음과 배열을 곱셈으로 나타내고 곱셈구구와 연결합니다."
  }),
  rule: group({
    id: "rule",
    nationalDomain: "변화와 관계",
    strand: "규칙 찾기",
    standardPrefix: "02-",
    path: "change-relationships",
    start: 1,
    end: 2,
    note: "수, 모양, 색, 위치의 반복과 변화를 찾아 말이나 식으로 나타냅니다."
  }),
  solid: group({
    id: "solid-shape",
    nationalDomain: "도형과 측정",
    strand: "입체도형의 모양",
    standardPrefix: "03-",
    path: "geometry-measurement",
    start: 1,
    end: 2,
    note: "입체도형의 모양과 쌓은 구조를 관찰하고 여러 방향의 표현과 연결합니다."
  }),
  plane: group({
    id: "plane-shape",
    nationalDomain: "도형과 측정",
    strand: "평면도형과 구성 요소",
    standardPrefix: "03-",
    path: "geometry-measurement",
    start: 3,
    end: 5,
    note: "평면도형의 모양과 구성 요소를 관찰하고 이동, 분할, 구성 활동으로 확장합니다."
  }),
  quantityCompare: group({
    id: "quantity-compare",
    nationalDomain: "도형과 측정",
    strand: "양의 비교",
    standardPrefix: "03-",
    path: "geometry-measurement",
    start: 6,
    end: 6,
    note: "여러 양을 직접 비교하고 비교 결과를 설명합니다."
  }),
  time: group({
    id: "time",
    nationalDomain: "도형과 측정",
    strand: "시각과 시간",
    standardPrefix: "03-",
    path: "geometry-measurement",
    start: 7,
    end: 9,
    note: "시각과 시간의 관계를 달력과 생활 속 문제에 적용합니다."
  }),
  length: group({
    id: "length",
    nationalDomain: "도형과 측정",
    strand: "길이",
    standardPrefix: "03-",
    path: "geometry-measurement",
    start: 10,
    end: 13,
    note: "길이를 비교하고 재며, 단위와 길이의 관계를 활용합니다."
  }),
  data: group({
    id: "data",
    nationalDomain: "자료와 가능성",
    strand: "자료의 정리",
    standardPrefix: "04-",
    path: "data-probability",
    start: 1,
    end: 3,
    note: "분류한 자료를 표나 그래프로 나타내고 자료에서 알 수 있는 내용을 설명합니다."
  })
});

// GFIELD 세부 유형을 국가 교육과정의 상위 위치와 느슨하게 연결한다.
// 이 표는 출제 유형의 이름이나 생성 규칙을 바꾸지 않으며, 관련성이 분명한
// 중분류만 연결한다. 연결하지 않은 유형은 사고력 확장으로 유지한다.
const MIDDLE_ALIGNMENT = Object.freeze({
  "number:수 카드와 식": { groups: ["numberConcept", "additionSubtraction"] },
  "number:합과 차 문장제": { groups: ["additionSubtraction"] },
  "number:조건에 맞는 수": { groups: ["numberConcept"] },
  "number:수 배열과 곱": { groups: ["multiplication"] },
  "number:과정 추론": { groups: ["additionSubtraction"] },
  "pattern:도형 규칙": { groups: ["rule"] },
  "pattern:달력과 시간": { groups: ["time"] },
  "pattern:수열의 활용": { groups: ["rule"] },
  "pattern:수 규칙": { groups: ["rule"] },
  "pattern:반복 규칙": { groups: ["rule"] },
  "pattern:도형 수 표현": { groups: ["rule"] },
  "geometry:도형 움직이기": { groups: ["plane"] },
  "geometry:색종이 접기": { groups: ["plane"] },
  "geometry:길이와 측정": { groups: ["length", "quantityCompare"] },
  "geometry:둘레와 배열": {
    groups: ["length"],
    note: "길이 학습 요소와 관련되며, 둘레 계산과 배열 추론은 사고력 확장 수준으로 다룹니다."
  },
  "geometry:도형 세기": { groups: ["plane"] },
  "geometry:도형 분할": { groups: ["plane"] },
  "geometry:쌓기나무 규칙": { groups: ["solid"] },
  "geometry:숨은 쌓기나무": { groups: ["solid"] },
  "geometry:쌓기나무 바탕그림": { groups: ["solid"] },
  "geometry:쌓기나무 개수": { groups: ["solid"] },
  "geometry:쌓기나무": { groups: ["solid"] },
  "geometry:쌓기나무 채우기": { groups: ["solid"] },
  "geometry:쌓기나무 색칠": { groups: ["solid"] },
  "geometry:쌓기나무 구멍": { groups: ["solid"] }
});

const EXTENSION_NOTES = Object.freeze({
  number: "수와 식의 관계를 여러 조건으로 조합하는 GFIELD 사고력 확장 유형입니다.",
  pattern: "교육과정의 규칙 찾기보다 더 복합적인 변화와 구조를 다루는 사고력 확장 유형입니다.",
  logic: "조건을 비교하고 가능한 경우를 좁혀 하나의 답을 찾는 GFIELD 논리 추리 유형입니다.",
  geometry: "도형의 관계와 공간 구조를 여러 단계로 해석하는 GFIELD 사고력 확장 유형입니다."
});

export function learningMapForType(item) {
  const alignment = MIDDLE_ALIGNMENT[`${item?.domain}:${item?.middle}`];
  if (alignment) {
    return {
      kind: "related",
      label: "교육과정 관련",
      relation: "관련 위치",
      groups: alignment.groups.map((groupId) => LEARNING_MAP_GROUPS[groupId]),
      note: alignment.note || "GFIELD 세부 유형을 바꾸지 않고 상위 학습 요소의 관련 위치만 표시합니다.",
      source: LEARNING_MAP_SOURCE
    };
  }

  return {
    kind: "extension",
    label: "사고력 확장",
    relation: "GFIELD 세부 유형",
    groups: [],
    note: EXTENSION_NOTES[item?.domain] || "국가 성취기준에 억지로 연결하지 않고 독립된 사고력 유형으로 관리합니다.",
    source: LEARNING_MAP_SOURCE
  };
}

export function learningMapInlineLabel(item) {
  const map = learningMapForType(item);
  if (map.kind === "extension") return map.label;
  const domains = [...new Set(map.groups.map((groupItem) => groupItem.nationalDomain))];
  return `${map.label} · ${domains.join(" · ")}`;
}
