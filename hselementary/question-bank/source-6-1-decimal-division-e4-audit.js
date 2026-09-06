"use strict";

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6DecimalDivisionE4";
const sourceIds = [
  "6-1-u3-e4-exploration-1", "6-1-u3-e4-example-2", "6-1-u3-e4-example-3",
  "6-1-u3-e4-example-4", "6-1-u3-e4-mission-1", "6-1-u3-e4-mission-2",
  "6-1-u3-e4-mission-3", "6-1-u3-e4-mission-5", "6-1-u3-e4-mission-6"
];
const kinds = [
  "family-weight-equations", "rectangle-area-scale", "two-tap-rate", "round-trip-second-meeting",
  "collinear-segments", "rectangle-area-increase", "park-border-area", "round-trip-houses", "circular-path-delay"
];
const pools = [
  [[35.8, 71.9, 53.1, 160.8, 36.1, 51.6, 18.8], [42.6, 78.4, 55.2, 176.2, 35.8, 44.6, 23.2], [40.7, 75.2, 58.6, 174.5, 34.5, 59.9, 16.6]],
  [[1.25, 8, 27.45, 3.05], [1.5, 4, 22.5, 4.5], [2.5, 3, 32.5, 5]],
  [[3, 5, 10.05, 2.75, 1.95, 1.4], [4, 6, 16.8, 4.8, 2.5, 1.7], [5, 4, 19, 2.4, 2.2, 1.6]],
  [[5.62, 4.148, 5, 16.28], [6.4, 4.1, 4.8, 16.8], [5.75, 4.45, 6, 20.4]],
  [[85.1, 170.6, 21.1, 117.3], [72.8, 151.4, 18.2, 103], [96.5, 194.7, 25.6, 132.8]],
  [[5, 1.2, 40.35, 8.07], [2.5, 2, 28.8, 7.2], [4, 1.5, 53.75, 10.75]],
  [[4, 660.8, 149.2], [3, 433.2, 132.4], [5, 924, 164.8]],
  [[4.2, 3.48, 1.8, 4.608], [5.4, 4.1, 2.4, 7.6], [3.75, 2.85, 2, 4.4]],
  [[38, 25.76, 14, 38.88, 18, 5, 7.2], [42, 16.8, 12, 27, 15, 6, 10.5], [34, 18, 12, 24, 12, 4, 8]]
];
const failures = [];
let checked = 0;
const fail = message => failures.push(message);
const attr = (markup, name) => String(markup).match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const close = (a, b) => Math.abs(Number(a) - Number(b)) < 1e-8;
const toOne = value => Number(value).toFixed(1).replace(/\.0$/, "");
const sourceValue = value => Number(value).toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
const familyRelations = [51.6, 44.6, 59.9];
const familyAnswers = [18.8, 23.2, 16.6];
const answerFor = (variant, pool) => {
  if (variant === 0) return `${toOne(pool[1] - pool[2])}kg`;
  if (variant === 1) return `${sourceValue(pool[2] / (pool[0] * pool[1] - 1))}m²`;
  if (variant === 2) { const sum = pool[2] / pool[0], difference = pool[3] / pool[1]; return `가 ${sourceValue((sum + difference) / 2)}L, 나 ${sourceValue((sum - difference) / 2)}L`; }
  if (variant === 3 || variant === 7) return `${sourceValue((pool[0] + pool[1]) * pool[2] / 3)}km`;
  if (variant === 4) return `${Number((pool[1] - pool[0] - pool[2]) / 2 + pool[0]).toFixed(1)}cm`;
  if (variant === 5) return `${sourceValue(pool[2] / (pool[0] * pool[1] - 1))}cm²`;
  if (variant === 6) return `${sourceValue((pool[1] - 4 * pool[0] * pool[0]) / pool[0])}m`;
  return `${sourceValue((pool[0] - (pool[1] / pool[2]) * pool[5]) / ((pool[1] / pool[2]) + (pool[3] / pool[4])))}분`;
};
const evidenceFrom = markup => {
  const match = String(markup).match(/<span hidden[^>]*data-source61-decimal-e4-kind="[^"]+"[^>]*><\/span>/);
  if (!match) return null;
  const span = match[0];
  return { kind: attr(span, "data-source61-decimal-e4-kind"), sourceItemId: attr(span, "data-source-item"), values: (attr(span, "data-values") || "").split(",").filter(Boolean).map(Number), difficulty: attr(span, "data-difficulty-design") };
};
const svgFrom = markup => String(markup).match(/<svg class="[^"]*source61-decimal-e4-diagram[\s\S]*?<\/svg>/)?.[0] || "";
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));

if (!api.names.includes(generatorKey)) fail("E4 생성기가 등록되지 않았습니다.");
for (let variant = 0; variant < sourceIds.length; variant += 1) {
  if (api.generatorKey({ sourceItemId: sourceIds[variant], reviewLocked: false }) !== generatorKey) fail(`${sourceIds[variant]}: 공개 라우팅이 없습니다.`);
  const seen = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seedIndex = 0; seedIndex < 200; seedIndex += 1) {
    const seed = 610440 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
    const generated = api.generate({ sourceItemId: sourceIds[variant], reviewLocked: false }, 0, difficulty, seed, variant);
    const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
    const promptEvidence = evidenceFrom(generated?.prompt);
    const answerEvidence = evidenceFrom(generated?.answerVisual);
    const problemSvg = svgFrom(generated?.prompt);
    const answerSvg = svgFrom(generated?.answerVisual);
    const poolIndex = generated?.verifiedPoolIndex;
    const expected = pools[variant][poolIndex];
    seen.add(poolIndex);
    if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기 연결 오류`);
    if (generated?.generationMode !== "fixed-verified-pool" || generated?.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
    if (!promptEvidence || promptEvidence.kind !== kinds[variant] || promptEvidence.sourceItemId !== sourceIds[variant] || !answerEvidence || !sameValues(promptEvidence.values, answerEvidence.values)) fail(`${label}: 문제·답 자료 연결 오류`);
    if (!problemSvg || !answerSvg || attr(problemSvg, "data-source61-e4-structure") !== attr(answerSvg, "data-source61-e4-structure") || attr(problemSvg, "data-source61-e4-values") !== attr(answerSvg, "data-source61-e4-values")) fail(`${label}: 문제·답 SVG 구조 또는 자료 불일치`);
    if (!answerSvg.includes("source61-e4-result-label") || !String(generated.answerVisual).includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 그림 또는 source 표시 누락`);
    if (generated.answer !== answerFor(variant, expected)) fail(`${label}: 독립 계산 답 ${answerFor(variant, expected)} / 표시 답 ${generated.answer}`);
    if (variant === 0) {
      if (!close(expected[0] + expected[1] + expected[2], expected[3])) fail(`${label}: 가족 합계 관계 재검산 실패`);
      if (!close(expected[1] - expected[0], expected[4])) fail(`${label}: 가족 아버지-예훈 관계 재검산 실패`);
      if (!close(3 * expected[2] - (expected[1] + expected[0]), expected[5]) || !close(expected[5], familyRelations[poolIndex])) fail(`${label}: 가족 관계 3×어머니-(아버지+예훈) 재검산 실패`);
      if (generated.answer !== `${sourceValue(familyAnswers[poolIndex])}kg`) fail(`${label}: 가족 pool별 답 불일치`);
      if (expected[5] === 48.8 || expected[5] === 61.6) fail(`${label}: 잘못된 가족 관계값이 남아 있습니다.`);
    }
    if (variant === 2) {
      if (!close(expected[2] / expected[0], expected[4] + expected[5]) || !close(expected[3] / expected[1], expected[4] - expected[5])) fail(`${label}: 수도의 합·차를 각 시간으로 나눈 식이 아닙니다.`);
      if (generated.prompt.includes("남은") || generated.solution.includes("남은")) fail(`${label}: 수도 풀이에 잘못된 남은 시간 논리가 남아 있습니다.`);
      if (!generated.prompt.includes(`${expected[0]}시간 동안`) || !generated.prompt.includes(`${expected[1]}시간 동안`)) fail(`${label}: 수도 두 조건의 시간이 분리되지 않았습니다.`);
      if ((problemSvg.match(/1시간 →/g) || []).length !== 2 || !generated.prompt.includes("첫째 조건 · 합") || !generated.prompt.includes("둘째 조건 · 차")) fail(`${label}: 두 수도 카드·조건 표가 분리되지 않았습니다.`);
      if (generated.prompt.includes(`${expected[1]}-${expected[0]}`) || generated.solution.includes(`${expected[1]}-${expected[0]}`)) fail(`${label}: 수도 식에 남은 시간 차가 들어갔습니다.`);
      if (problemSvg.includes(`${expected[4]}L`) || problemSvg.includes(`${expected[5]}L`)) fail(`${label}: 수도 문제 그림에 답이 노출되었습니다.`);
    }
    if (variant === 3 || variant === 7) {
      if (!generated.prompt.includes(expected[2] % 1 ? `${Math.floor(expected[2])}시간 ${Math.round(expected[2] % 1 * 60)}분` : `${expected[2]}시간`)) fail(`${label}: 왕복 시간 표기가 잘못되었습니다.`);
      if (answerSvg.includes("source61-e4-midpoint") || answerSvg.includes('cx="180" cy="92"') || answerSvg.includes('cx="180" cy="100"')) fail(`${label}: 고정된 가운데 만남점이 남아 있습니다.`);
      if (!answerSvg.includes('data-source61-e4-model="three-segment-route"') || !answerSvg.includes('data-segment-count="3"') || (answerSvg.match(/source61-e4-measure/g) || []).length < 4) fail(`${label}: 세 구간 선분 모델이 없습니다.`);
    }
    if (variant === 7 && poolIndex === 0 && !generated.prompt.includes("1시간 48분")) fail(`${label}: 1.8시간이 시간·분으로 변환되지 않았습니다.`);
    if (variant === 4 && poolIndex === 1 && !generated.answer.includes("103.0cm")) fail(`${label}: 한 자리 정밀도 103.0 표기가 보존되지 않았습니다.`);
    if (variant === 6 && (!problemSvg.includes("폭") || !problemSvg.includes('data-source61-e4-width-dimension="both-ends"') || (problemSvg.match(/source61-e4-arrow/g) || []).length !== 4)) fail(`${label}: 공원 폭의 양끝 치수선·화살표가 없습니다.`);
    if (variant === 8) {
      if (!answerSvg.includes('data-source61-e4-model="unwrapped-circle-segment"') || !answerSvg.includes("source61-e4-section-highlight") || answerSvg.includes('cx="180" cy="100"') || answerSvg.includes("source61-e4-circle-path")) fail(`${label}: 펼친 원형 길의 실제 이동 구간 표시가 없습니다.`);
    }
    const plain = `${generated.prompt}\n${generated.solution}\n${generated.answerVisual}`.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ");
    if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(plain)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
    if (/\b\d+\s*\/\s*\d+\b/.test(plain)) fail(`${label}: 슬래시 분수 표기`);
    if (generated.prompt.includes("data-result-highlight") || generated.prompt.includes("source61-e4-result-label") || generated.prompt.includes("조건을 만족하는 답 표시")) fail(`${label}: 문제 화면에 답 결과가 노출되었습니다.`);
    if (difficulty === -1 && promptEvidence?.difficulty !== "guided") fail(`${label}: 안내 난이도 표기 누락`);
    if (difficulty === 0 && promptEvidence?.difficulty !== "source") fail(`${label}: 원문 난이도 표기 누락`);
    if (difficulty === 1 && promptEvidence?.difficulty !== "independent-reasoning") fail(`${label}: 스스로 생각하기 난이도 표기 누락`);
    checked += 1;
  }
  if (seen.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 나오지 않았습니다.`);
}

console.log(`6-1 식을 세워 풀기 개념탐구 4 수학 감사: ${checked}회, 9유형×3난이도×200회`);
if (failures.length) { console.error(failures.join("\n")); process.exitCode = 1; }
else console.log("통과: 원문 관계식·독립 계산·고정 pool·문제/답 동일 그림 자료·답 그림·문제 답 누출 차단·시간 단위·치수선·선분 모델");
