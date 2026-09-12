"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE1";
const sourceIds = [
  "6-1-u4-e1-example-1-2", "6-1-u4-e1-example-1-3", "6-1-u4-e1-example-1-4",
  "6-1-u4-e1-mission-1", "6-1-u4-e1-mission-2", "6-1-u4-e1-mission-3",
  "6-1-u4-e1-mission-4", "6-1-u4-e1-mission-5", "6-1-u4-e1-mission-6"
];
const lockedSourceIds = [
  "6-1-u4-e1-exploration-1-1", "6-1-u4-e1-exploration-1-2", "6-1-u4-e1-example-1-1"
];
const kinds = [
  "base-comparison-ratio", "trapezoid-area-move", "same-time-distance-ratio", "rectangle-ratio-area",
  "ball-count-ratio", "trapezoid-midpoint-ratio", "give-away-ratio", "chained-ratio-decimal",
  "overlapping-groups-ratio"
];
const expectedPools = [
  [[7, 4, 21, 28, 49], [8, 5, 24, 40, 64], [3, 2, 18, 36, 54]],
  [[6, 28, 30, 16, 2, 3, 4], [8, 26, 27, 14, 2, 3, 5], [8, 30, 32, 14, 3, 4, 4]],
  [[6, 5, 7, 12, 35, 72], [8, 6, 5, 9, 5, 12], [7, 5, 4, 7, 20, 49]],
  [[7, 4, 20, 700], [9, 5, 15, 405], [11, 8, 24, 792]],
  [[8, 25, 34, 50], [2, 5, 27, 45], [5, 8, 21, 56]],
  [[10, 7, 3, 14], [11, 8, 3, 16], [13, 9, 2, 9]],
  [[85, 41, 4, 3, 13], [96, 44, 3, 2, 12], [78, 42, 7, 5, 8]],
  [[4, 5, 5, 8, 32, 25], [3, 4, 3, 5, 5, 4], [9, 10, 3, 4, 6, 5]],
  [[48, 1, 8, 2, 1, 17, 10], [60, 1, 5, 3, 1, 2, 1], [64, 3, 8, 1, 4, 4, 7]]
];
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-9;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const ratio = (a, b) => {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
};
const fraction = (a, b) => {
  const divisor = gcd(a, b);
  return b / divisor === 1 ? String(a / divisor) : `${a / divisor}/${b / divisor}`;
};
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const valuesOf = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const answerFor = (variant, values) => {
  if (variant === 0) return ratio(values[1], values[0]);
  if (variant === 1) return `${values[6]}cm`;
  if (variant === 2) return fraction(values[4], values[5]);
  if (variant === 3) return String(values[3]);
  if (variant === 4) return String(values[3]);
  if (variant === 5) return fraction(values[2], values[3]);
  if (variant === 6) return String(values[4]);
  if (variant === 7) return String(Number(values[4] / values[5]).toFixed(2)).replace(/0$/, "");
  return fraction(values[5], values[6]);
};
const failures = [];
const fail = message => failures.push(message);
let checked = 0;

if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE1 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 9 || expectedPools.length !== 9 || expectedPools.some(pool => pool.length !== 3)) fail("9유형×3pool 계약이 다릅니다.");

for (const sourceId of lockedSourceIds) {
  const blocked = api.generate({ sourceItemId: sourceId, generatorKey, reviewLocked: true }, 0, 0, 610900, 0);
  if (blocked !== null) fail(`${sourceId}: 잠금 유형이 공개 생성되었습니다.`);
}

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 610500 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      const generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e1-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = valuesOf(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      seenPools.add(poolIndex);
      if (attr(marker, "data-source61-ratio-e1-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex].join(",")})`);
      if (String(generated.answer) !== answerFor(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${answerFor(variant, values)}`);
      if (variant === 0) {
        if (generated.prompt.includes(`>${values[3]}</text>`) || generated.prompt.includes(`>${values[4]}</text>`)) fail(`${label}: 문제 그림에 구해야 할 기준량 또는 비교하는 양이 노출됨`);
        if (!generated.answerVisual.includes(`>${values[3]}</text>`) || !generated.answerVisual.includes(`>${values[4]}</text>`)) fail(`${label}: 답 그림에 계산한 두 양이 표시되지 않음`);
      }
      if (variant === 2) {
        const expectedNumerator = values[1] * values[2];
        const expectedDenominator = values[0] * values[3];
        if (generated.answer !== fraction(expectedNumerator, expectedDenominator)) fail(`${label}: 같은 시간·같은 거리 조건을 독립 계산한 값과 다름`);
        if (!generated.prompt.includes(`형이 ${values[0]}걸음을 걷는 동안 동생은 ${values[1]}걸음`) || !generated.prompt.includes(`형이 ${values[2]}걸음에 가는 거리를 동생은 ${values[3]}걸음`)) fail(`${label}: 원본의 같은 시간·같은 거리 조건 방향이 바뀜`);
      }
      if (variant === 1) {
        if (!generated.prompt.includes('data-point-b-state="initial"') || generated.prompt.includes('data-point-b-state="moved"')) fail(`${label}: 문제 그림에서 점 ㅂ의 처음 위치와 옮긴 위치가 섞임`);
        if (!generated.answerVisual.includes('data-point-b-state="initial"') || !generated.answerVisual.includes('data-point-b-state="moved"') || !generated.answerVisual.includes('data-divider-state="initial"') || !generated.answerVisual.includes('data-divider-state="moved"')) fail(`${label}: 답 그림에서 점 ㅂ의 이동 전후가 분리되지 않음`);
        if (!generated.prompt.includes(`${values[2]}cm`) || !generated.prompt.includes(`${values[3]}cm`)) fail(`${label}: 원래 아랫변 두 길이 표시가 바뀜`);
      }
      if (variant === 4) {
        const ratioDecimal = String(Number((values[0] / values[1]).toFixed(3)));
        if (!generated.prompt.includes(`비율이 ${ratioDecimal}`)) fail(`${label}: 원본과 같은 소수 비율 표현이 아님`);
      }
      if (variant === 5) {
        for (const pointName of ["ㄱ", "ㄹ", "ㄴ", "ㄷ", "ㅁ"]) if (!generated.prompt.includes(`>${pointName}</text>`)) fail(`${label}: 원본 사다리꼴의 점 ${pointName} 표시 누락`);
      }
      if (variant === 7) {
        const chained = (values[0] / values[1]) / (values[2] / values[3]);
        if (!close(chained, values[4] / values[5])) fail(`${label}: 이어진 두 비율의 pool 계산이 맞지 않음`);
        if (!generated.prompt.includes("가에 대한 나의 비율") || !generated.prompt.includes("다에 대한 나의 비율") || !generated.prompt.includes("가에 대한 다의 비율")) fail(`${label}: 비율의 기준량과 비교하는 양이 문장에 분명하지 않음`);
      }
      if (variant === 8) {
        const ratioDecimal = String(Number((values[1] / values[2]).toFixed(3)));
        if (!generated.prompt.includes(`비율은 ${ratioDecimal}`) || !generated.prompt.includes(`K와 힙합 모두의 비율</span><b>${ratioDecimal}</b>`)) fail(`${label}: 원본의 겹치는 학생 비율을 소수로 나타내지 않음`);
      }
      if (attr(marker, "data-result-contract") !== "single-value") fail(`${label}: result-contract 누락`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      if (!generated.answerVisual?.includes("source61-ratio-e1-answer") || !generated.answerVisual.includes("data-result-highlight=")) fail(`${label}: 답 그림 또는 정답 강조 누락`);
      if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (variant === 7 && (!generated.prompt.includes("math-fraction") || generated.prompt.includes("가/나") || generated.prompt.includes("다/나"))) fail(`${label}: Mission 5 공통 분수 마크업 또는 방향이 잘못됨`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

console.log(`비와 비율 E1 독립 감사: ${checked}회, 9유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`정답 기준: ${sourceIds.map((id, index) => `${id}=${expectedPools[index].map(answerFor.bind(null, index)).join(" | ")}`).join(" / ")}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 잠금 3유형·고정 pool·독립 계산·result-contract·난이도·문제/답 그림·원본 점 이름·소수 비율·초등 언어 검사");
}
