"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-grade6-volume-e3-mission3.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u6-e3-mission-3";
const inputs = [
  { unknown: 3, drops: [6, 4, 10], runs: [10, 18], prismHeight: 12, volume: 4560 },
  { unknown: 4, drops: [5, 3, 8], runs: [8, 14], prismHeight: 10, volume: 2640 },
  { unknown: 5, drops: [7, 5, 12], runs: [12, 16], prismHeight: 15, volume: 7740 }
];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const baseArea = data => data.drops[0] * data.unknown
  + data.drops[1] * (data.unknown + data.runs[0])
  + data.drops[2] * (data.unknown + data.runs[0] + data.runs[1]);
const candidates = data => Array.from({ length: 100 }, (_, index) => index + 1).filter(candidate => {
  const area = data.drops[0] * candidate
    + data.drops[1] * (candidate + data.runs[0])
    + data.drops[2] * (candidate + data.runs[0] + data.runs[1]);
  return area * data.prismHeight === data.volume;
});
const svg = html => html.match(/<svg\b[\s\S]*?<\/svg>/)?.[0] || "";
const attr = (html, name) => html.match(new RegExp(`\\bdata-${name}="([^"]*)"`))?.[1] || "";

const catalogItem = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
check(catalogItem?.generatorKey === "sourceGrade6VolumeE3Mission3" && catalogItem.reviewLocked === false, "Mission 3 공개 분류표 연결이 열리지 않았습니다.");
check(catalogItem?.answerVisualStatus === "verified" && catalogItem.verifiedVariantCount === 3, "Mission 3 답 그림 또는 3문항 계약이 없습니다.");

let generated = 0;
for (let pool = 0; pool < inputs.length; pool += 1) {
  const input = inputs[pool];
  check(baseArea(input) * input.prismHeight === input.volume, `pool${pool}: 독립 밑넓이와 부피가 다릅니다.`);
  check(JSON.stringify(candidates(input)) === JSON.stringify([input.unknown]), `pool${pool}: 자연수 답 후보가 하나가 아닙니다: ${JSON.stringify(candidates(input))}`);
  for (const difficulty of [-1, 0, 1]) {
    const result = api.generate({ sourceItemId, generatorKey: "sourceGrade6VolumeE3Mission3", reviewLocked: false }, 1, difficulty, 1000 + pool, pool);
    generated += 1;
    check(result.answer === `${input.unknown}cm`, `pool${pool}/difficulty${difficulty}: 생성 답이 독립 답과 다릅니다.`);
    check(result.verifiedPoolIndex === pool && result.verifiedVariantCount === 3, `pool${pool}: 고정 3문항 연결이 다릅니다.`);
    check(result.difficultyDesign === ["guided", "source", "independent-reasoning"][difficulty + 1], `pool${pool}/difficulty${difficulty}: 난이도 설계 표시가 다릅니다.`);
    const problem = svg(result.prompt);
    const answer = svg(result.answerVisual);
    check(Boolean(problem && answer), `pool${pool}/difficulty${difficulty}: 문제 또는 답 SVG가 없습니다.`);
    check(attr(problem, "source61-vs-e3-structure") === "step-prism-net-unknown-edge", `pool${pool}: 원본 구조 서명이 없습니다.`);
    check(attr(problem, "source61-vs-e3-model") === attr(answer, "source61-vs-e3-model"), `pool${pool}: 문제와 답의 모델이 다릅니다.`);
    check(attr(problem, "phase") === "problem" && attr(answer, "phase") === "answer", `pool${pool}: 문제와 답 phase가 다릅니다.`);
    check((problem.match(/data-base-face=/g) || []).length === 2 && (answer.match(/data-base-face=/g) || []).length === 2, `pool${pool}: 계단 밑면이 문제와 답에 각각 두 개가 아닙니다.`);
    check((problem.match(/data-lateral-edge=/g) || []).length === 8 && (answer.match(/data-lateral-edge=/g) || []).length === 8, `pool${pool}: 옆면 띠의 여덟 모서리 대응이 없습니다.`);
    check(problem.includes("□ cm") && !/source61-vs-e3-result-label|data-answer-source=/.test(problem), `pool${pool}: 문제 그림에 빈칸 대신 답이 보입니다.`);
    check(answer.includes(`${input.unknown}cm`) && /data-answer-source=/.test(result.answerVisual), `pool${pool}: 답 그림에 길이 또는 답 근거가 없습니다.`);
  }
}

if (failures.length) {
  console.error(`6-1 부피 개념탐구 3 Mission 3 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-1 부피 개념탐구 3 Mission 3 감사 통과: 3풀 × 3난이도 = ${generated}생성물 · 자연수 후보 전수 검산 · 문제/답 전개도 일치`);
