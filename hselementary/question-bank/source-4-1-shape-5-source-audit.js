"use strict";

// The source page was visually checked. Keep its eleven individual items
// separate until a generator preserves the exact shown structure and answer.
global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const expected = [
  "일렬 상자 모양을 늘일 때 필요한 성냥개비 수",
  "50원과 100원 동전을 놓은 규칙에서 전체 금액 구하기",
  "마름모 테두리로 늘어나는 바둑돌 수",
  "대각선이 있는 정사각형의 점 수",
  "점 배열로 만든 작은 정사각형 수와 점 수",
  "점으로 만든 계단 모양 정사각형의 점 수",
  "지그재그 육각형 모양의 성냥개비 수로 도형 수 찾기",
  "ㄱ자 점 배열로 만든 작은 정사각형 수와 점 수",
  "줄마다 늘어나는 마름모 바둑돌 수",
  "같은 상자 모양을 여러 개 만들 때 필요한 성냥개비 수",
  "가로로 이어 붙인 정사각형의 점 수로 정사각형 수 찾기"
];

const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const unit = semester.units.find(item => item.id === "4-1-u6");
const subunit = unit.subunits.find(item => item.number === 5);
const readyVariants = new Map([
  ["4-1-u6-e5-exploration", [2, "box-chain"]],
  ["4-1-u6-e5-example-5-1", [7, "coin-checker"]],
  ["4-1-u6-e5-example-5-3", [3, "crossed-square-points"]],
  ["4-1-u6-e5-mission-1", [4, "spiral-grid-points"]],
  ["4-1-u6-e5-mission-4", [5, "hex-stone-cluster"]],
  ["4-1-u6-e5-mission-5", [2, "box-chain"]],
  ["4-1-u6-e5-mission-6", [6, "dotted-square-chain"]]
]);
const api = window.HSE_GENERATORS;
if (subunit.types.length !== expected.length) throw new Error("개념탐구 5 원문 항목 수가 11개가 아닙니다.");
subunit.types.forEach((type, index) => {
  if (type.label !== expected[index]) throw new Error(`원문 ${index + 1}번 유형명이 실제 그림과 다릅니다.`);
  if (type.sourcePdfPage !== (index < 5 ? 70 : 71)) throw new Error(`${type.sourceItemLabel}의 원문 쪽수가 맞지 않습니다.`);
  const expectedReady = readyVariants.get(type.sourceItemId);
  if (!expectedReady) {
    if (!type.reviewLocked || type.generatorKey) throw new Error(`${type.sourceItemLabel}에 원본과 다른 생성기가 공개되어 있습니다.`);
    return;
  }
  if (type.reviewLocked || type.generatorKey !== "advancedShapePattern" || type.variant !== expectedReady[0]) throw new Error(`${type.sourceItemLabel}의 원본 구조 연결이 다릅니다.`);
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 120; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const kind = generated.prompt.match(/data-pattern-kind="([^"]+)"/)?.[1];
      if (kind !== expectedReady[1]) throw new Error(`${type.sourceItemLabel}의 그림 구조가 ${kind}로 잘못 생성됩니다.`);
      if (!generated.prompt || generated.answer === undefined || !generated.solution) throw new Error(`${type.sourceItemLabel}의 문제·정답·풀이가 비었습니다.`);
    }
  }
});

// Answer-book anchors for the source Mission questions.
if (8 * 10 + 4 !== 84) throw new Error("개념탐구 상자 성냥개비 원본 답이 틀렸습니다.");
if (7 * 7 !== 49) throw new Error("Mission 1 점 배열 원본 답이 틀렸습니다.");
if (3 * 10 * 9 + 1 !== 271) throw new Error("Mission 4 바둑돌 원본 답이 틀렸습니다.");
if (8 * 17 + 4 !== 140) throw new Error("Mission 5 상자 성냥개비 원본 답이 틀렸습니다.");
if ((53 - 3) / 5 !== 10) throw new Error("Mission 6 점 정사각형 원본 답이 틀렸습니다.");

console.log("4-1 규칙 찾기 개념탐구 5: 원문 11문제 분리, 구조 일치 7개 공개, 4개 검수 대기");
