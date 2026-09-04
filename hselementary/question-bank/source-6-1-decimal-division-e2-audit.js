"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const readiness = require("./source-inventory/6-1-u3-source-readiness-review.json");
const generatorKey = "sourceGrade6DecimalDivisionE2";
const sourceIds = [
  "6-1-u3-e2-exploration-1", "6-1-u3-e2-example-1", "6-1-u3-e2-example-3", "6-1-u3-e2-mission-1",
  "6-1-u3-e2-mission-2", "6-1-u3-e2-mission-3", "6-1-u3-e2-mission-4", "6-1-u3-e2-mission-5"
];
const lockedIds = ["6-1-u3-e2-example-2", "6-1-u3-e2-example-4", "6-1-u3-e2-mission-6"];
const kinds = [
  "catch-up-distance", "rounded-quotient-range", "fuel-efficiency-transfer", "equal-interval-number-line",
  "lap-time", "pencil-case-weight", "same-direction-distance-gap", "fuel-cost-gap"
];
const pools = [
  [[8.4, 12, 33.6, 30, 23, 70, 13.3], [9.6, 12, 37.8, 30, 18, 60, 13.2], [10.8, 15, 42, 28, 25, 65, 32.7]],
  [[12, 4.39, 52.62, 52.74, 12], [8, 3.27, 26.12, 26.2, 8], [16, 5.84, 93.36, 93.52, 16]],
  [[12.4, 15.3, 18, 1600, 16864], [13.5, 14.4, 18, 1700, 18360], [14.4, 12.5, 20, 1800, 16200]],
  [[14, 51.45, 7, 5, 40.75], [12.6, 44.1, 7, 5, 35.1], [7.25, 29.65, 7, 5, 23.25]],
  [[4, 276, 3, 207], [5, 375, 4, 300], [8, 624, 5, 390]],
  [[12, 142.48, 5, 112.28, 9, 124.36], [10, 132.5, 4, 108.5, 8, 120.5], [15, 188.75, 6, 147.35, 12, 168.05]],
  [[18.85, 13, 7.48, 4, 25, 10.5], [17.28, 12, 12.48, 8, 35, 4.2], [21.42, 14, 13.86, 9, 60, 0.6]],
  [[4, 64, 3, 72, 272.64, 1500, 8520], [5, 75, 4, 96, 360, 1600, 14400], [6, 84, 5, 100, 420, 1700, 15300]]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-8;
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const fmt = value => Number(value).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
const fixedMoney = value => String(Math.round(Number(value)));
const timeText = seconds => { const minutes = Math.floor(seconds / 60), rest = seconds % 60; return rest ? `${minutes}분 ${rest}초` : `${minutes}분`; };
const evidenceFrom = markup => {
  const match = String(markup).match(/<span hidden[^>]*data-source61-decimal-e2-kind="[^"]+"[^>]*><\/span>/);
  if (!match) return null;
  const span = match[0];
  return { kind: attr(span, "data-source61-decimal-e2-kind"), sourceItemId: attr(span, "data-source-item"), values: (attr(span, "data-values") || "").split(",").filter(Boolean).map(Number), contract: attr(span, "data-result-contract"), difficulty: attr(span, "data-difficulty-design") };
};
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-decimal-e2-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const independentAnswer = (variant, values) => {
  if (variant === 0) return `${fmt(values[2] / values[3] * values[5] - values[0] / values[1] * (values[5] + values[4]))}km`;
  if (variant === 1) {
    const lower = Math.round(values[2] * 100), upper = Math.round(values[3] * 100);
    let count = 0;
    for (let cents = lower; cents < upper; cents += 1) count += 1;
    return `${count}개`;
  }
  if (variant === 2) return `${fixedMoney(values[0] * values[1] / values[2] * values[3])}원`;
  if (variant === 3) return fmt(values[0] + (values[1] - values[0]) / values[2] * values[3]);
  if (variant === 4) return timeText(values[1] / values[0] * values[2]);
  if (variant === 5) {
    const remaining = values[0] - values[2];
    const pencil = (values[1] - values[3]) / values[2];
    return `${fmt(values[3] + (values[4] - remaining) * pencil)}g`;
  }
  if (variant === 6) {
    const faster = values[0] / values[1] > values[2] / values[3] ? "자동차" : "기차";
    return `${faster}, ${fmt(Math.abs(values[0] / values[1] - values[2] / values[3]) * values[4])}km`;
  }
  return `${fixedMoney(Math.abs(values[0] / values[1] * values[4] - values[2] / values[3] * values[4]) * values[5])}원`;
};

if (!api?.names?.includes(generatorKey)) fail("sourceGrade6DecimalDivisionE2 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 8 || pools.length !== 8 || pools.some(pool => pool.length !== 3)) fail("E2는 8유형×3 pool 계약이 아닙니다.");
const readinessById = new Map(readiness.items.map(item => [item.sourceItemId, item]));
sourceIds.forEach(sourceId => {
  const item = readinessById.get(sourceId);
  if (!item || item.sourcePdfPage !== 18 && item.sourcePdfPage !== 19 || item.sourcePrintedPage !== 22 && item.sourcePrintedPage !== 23) fail(`${sourceId}: 원문 페이지 연결이 다릅니다.`);
  if (api.generatorKey({ sourceItemId: sourceId, reviewLocked: false }) !== generatorKey) fail(`${sourceId}: 공개 8유형 라우팅이 없습니다.`);
});
lockedIds.forEach(sourceId => {
  if (api.generatorKey({ sourceItemId: sourceId, reviewLocked: true }) !== "") fail(`${sourceId}: 잠금 유형이 라우팅되었습니다.`);
});

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 0; seedIndex < 200; seedIndex += 1) {
      const seed = 610320 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      const generated = api.generate({ sourceItemId: sourceIds[variant], reviewLocked: false }, 0, difficulty, seed, variant);
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      const evidence = evidenceFrom(generated?.prompt);
      const problemSvg = svgFrom(generated?.prompt);
      const answerSvg = svgFrom(generated?.answerVisual);
      const answerEvidence = evidenceFrom(generated?.answerVisual);
      const poolIndex = generated?.verifiedPoolIndex;
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·원문 연결 누락`);
      if (generated?.generationMode !== "fixed-verified-pool" || generated?.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      if (Number.isInteger(poolIndex)) seenPools.add(poolIndex);
      const expectedValues = pools[variant][poolIndex] || [];
      if (variant === 3 && (expectedValues[2] !== 7 || expectedValues[3] !== 5)) fail(`${label}: 원본 수직선의 7칸·다섯 번째 눈금 구조가 바뀌었습니다.`);
      if (!evidence || evidence.kind !== kinds[variant] || evidence.sourceItemId !== sourceIds[variant] || !sameValues(evidence.values, expectedValues)) fail(`${label}: 문제 evidence가 pool 자료와 다릅니다.`);
      if (variant === 1 && evidence) {
        const lowerBoundary = (evidence.values[1] - 0.005) * evidence.values[0];
        const upperBoundary = (evidence.values[1] + 0.005) * evidence.values[0];
        if (!close(lowerBoundary, evidence.values[2]) || !close(upperBoundary, evidence.values[3])) fail(`${label}: target±0.005로 다시 계산한 반올림 경계가 pool과 다릅니다.`);
        const lowerCents = Math.round(evidence.values[2] * 100), upperCents = Math.round(evidence.values[3] * 100);
        let enumerated = 0;
        for (let cents = lowerCents; cents < upperCents; cents += 1) enumerated += 1;
        if (enumerated !== evidence.values[4] || lowerCents >= upperCents) fail(`${label}: 정수 hundredths 전수열거 개수가 다릅니다.`);
      }
      if (!answerEvidence || answerEvidence.kind !== kinds[variant] || answerEvidence.sourceItemId !== sourceIds[variant] || !sameValues(answerEvidence.values, evidence?.values || [])) fail(`${label}: 문제·답 source/pool 자료가 다릅니다.`);
      if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e2-structure") !== attr(answerSvg, "data-source61-e2-structure") || attr(problemSvg, "data-source61-e2-values") !== attr(answerSvg, "data-source61-e2-values")) fail(`${label}: 문제와 답의 SVG 자료가 다릅니다.`);
      if (!answerSvg.includes("data-result-highlight=") || !String(generated?.answerVisual).includes(`data-answer-source="${sourceIds[variant]}"`) || !String(generated?.answerVisual).includes(`data-verified-pool-index="${poolIndex}"`)) fail(`${label}: 답 SVG·결과 강조·source/pool 연결이 없습니다.`);
      if (String(generated?.answer) !== independentAnswer(variant, evidence?.values || [])) fail(`${label}: 표시 답 '${generated?.answer}' / evidence 독립 계산 '${independentAnswer(variant, evidence?.values || [])}'`);
      if (difficulty === -1 && evidence?.difficulty !== "guided") fail(`${label}: 안내 지원 표시가 없습니다.`);
      if (difficulty === 0 && evidence?.difficulty !== "source") fail(`${label}: 원본 기준 표시가 없습니다.`);
      if (difficulty === 1 && evidence?.difficulty !== "independent-reasoning") fail(`${label}: 이유 설명 표시가 없습니다.`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 문구가 없습니다.`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 난이도에 추가 안내가 있습니다.`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 이유 설명 문구가 없습니다.`);
      const allText = `${generated?.prompt}\n${generated?.answer}\n${generated?.solution}\n${generated?.answerVisual}`;
      if (/undefined|null|NaN|Infinity|순열|조합|일차식|절댓값|\$\{[^}]+\}/.test(allText)) fail(`${label}: 깨진 값 또는 학년 밖 표현이 있습니다.`);
      if (/\b\d+\s*\/\s*\d+\b/.test(allText)) fail(`${label}: 슬래시 분수 표기가 있습니다.`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0/1/2가 모두 출현하지 않습니다.`);
}

console.log(`6-1 소수의 나눗셈 개념탐구 2 수학 감사: ${checked}회, 8유형×3난이도×200회`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: pool 자료·정수 hundredths 전수열거·독립 계산·단일 답·문제/답 동일 SVG·결과 강조·난이도·학년 언어·잠금 라우팅");
}
