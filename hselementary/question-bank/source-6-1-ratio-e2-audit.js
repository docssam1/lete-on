"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE2";
const sourceIds = [
  "6-1-u4-e2-exploration-2-1", "6-1-u4-e2-example-2-1", "6-1-u4-e2-example-2-2", "6-1-u4-e2-example-2-3",
  "6-1-u4-e2-example-2-4", "6-1-u4-e2-mission-1", "6-1-u4-e2-mission-2", "6-1-u4-e2-mission-3",
  "6-1-u4-e2-mission-4", "6-1-u4-e2-mission-5", "6-1-u4-e2-mission-6"
];
const kinds = [
  "parallelogram-area-increase", "nested-percentage", "bundle-discount-rounding", "bonus-discount-unit-price",
  "gender-change-percentage", "chained-ratio-percent", "price-increase-difference", "forecast-hit-rate",
  "winner-count-from-composition", "pencil-bundle-unit-price", "nested-population-percentage"
];
const expectedPools = [
  [[15, 10, 20, 15, 38], [20, 12, 25, 20, 50], [25, 20, 12, 25, 40]],
  [[300, 64, 75, 48], [400, 70, 60, 42], [250, 72, 50, 36]],
  [[2, 4000, 5, 8250, 3, 10500, 5, 14560, 10, 17], [3, 6000, 4, 6800, 2, 5000, 6, 12750, 12, 15], [4, 7200, 5, 7650, 5, 12500, 10, 21000, 20, 16]],
  [[300, 20, 10, 5000, 12, 6000, 25], [400, 25, 20, 5000, 15, 10000, 20], [250, 40, 25, 5000, 15, 10000, 20]],
  [[500, 14, 11, 20, 10, 48], [600, 3, 2, 25, 20, 48], [700, 4, 3, 10, 20, 50]],
  [[4, 3, 8, 9.375], [5, 2, 5, 8], [2, 3, 5, 30]],
  [[700, 840, 1200, 1500, 20, 25, 5, 1], [800, 1000, 1500, 1770, 25, 18, 7, 0], [1200, 1380, 900, 1080, 15, 20, 5, 1]],
  [[40, 85, 60, 95, 37], [50, 80, 50, 90, 45], [30, 70, 70, 80, 35]],
  [[800, 47.5, 10, 5, 61], [600, 40, 15, 10, 78], [1000, 55, 8, 12, 102]],
  [[250, 12, 3, 10, 25, 1], [300, 10, 2, 20, 10, 1], [400, 10, 2, 15, 20, 3]],
  [[500000, 1.4, 47, 40, 2226], [200000, 2.5, 52, 25, 1800], [750000, 1.6, 45, 20, 5280]]
];
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-9;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const fraction = (a, b) => {
  const divisor = gcd(a, b);
  return b / divisor === 1 ? String(a / divisor) : `${a / divisor}/${b / divisor}`;
};
const mixedFraction = (a, b) => {
  const divisor = gcd(a, b);
  const numerator = a / divisor;
  const denominator = b / divisor;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (!remainder) return String(whole);
  if (!whole) return `${remainder}/${denominator}`;
  return `${whole} ${remainder}/${denominator}`;
};
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const valuesOf = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const visibleMarkup = markup => String(markup || "").replace(/<span hidden[^>]*><\/span>/g, "");
const expectedAnswer = (variant, values) => {
  if (variant === 0) {
    const original = values[0] * values[1];
    const changed = values[0] * (100 + values[2]) / 100 * values[1] * (100 + values[3]) / 100;
    return `${Math.round((changed - original) / original * 100)}%`;
  }
  if (variant === 1) return `${values[1] * values[2] / 100}%`;
  if (variant === 2) {
    const normal = values[8] / values[0] * values[1] + values[8] / values[4] * values[5];
    const sale = values[8] / values[2] * values[3] + values[8] / values[6] * values[7];
    return `${Math.round((normal - sale) / normal * 100)}%`;
  }
  if (variant === 3) {
    const firstNumerator = values[0] * 100;
    const firstDenominator = 100 + values[2];
    const secondNumerator = values[0] * (100 - values[4]);
    const secondDenominator = 100;
    const numerator = Math.abs(firstNumerator * secondDenominator - secondNumerator * firstDenominator);
    const denominator = firstDenominator * secondDenominator;
    return `${mixedFraction(numerator, denominator)}원`;
  }
  if (variant === 4) {
    const oldMale = values[0] * values[1] / (values[1] + values[2]);
    const oldFemale = values[0] - oldMale;
    return `${Math.round(oldMale * (100 - values[3]) / 100 / (oldMale * (100 - values[3]) / 100 + oldFemale * (100 + values[4]) / 100) * 100)}%`;
  }
  if (variant === 5) return `${Number((values[1] / (values[0] * values[2]) * 100).toFixed(6))}%`;
  if (variant === 6) return `${values[7] === 0 ? "과자" : "음료수"}, ${Math.abs((values[3] - values[2]) / values[2] * 100 - (values[1] - values[0]) / values[0] * 100)}%`;
  if (variant === 7) return `${(values[0] * values[1] / 100 + values[2] * (100 - values[3]) / 100) / (values[0] + values[2]) * 100}%`;
  if (variant === 8) return `${values[0] * (100 - values[1]) / 100 * values[2] / 100 + values[0] * values[1] / 100 * values[3] / 100}명`;
  if (variant === 9) {
    const firstNumerator = values[0] * values[1] * 100;
    const firstDenominator = (values[1] + values[2]) * 100;
    const secondNumerator = values[0] * (100 - values[3]);
    const secondDenominator = 100;
    const numerator = Math.abs(firstNumerator * secondDenominator - secondNumerator * firstDenominator);
    const denominator = firstDenominator * secondDenominator;
    return `${mixedFraction(numerator, denominator)}원`;
  }
  return `${(values[0] * values[1] / 100 * (100 - values[2]) / 100 * (100 - values[3]) / 100).toLocaleString()}명`;
};
const failures = [];
const fail = message => failures.push(message);
let checked = 0;

if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE2 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 11 || expectedPools.length !== 11 || expectedPools.some(pool => pool.length !== 3)) fail("11유형×3pool 계약이 다릅니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 611200 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      const generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e2-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = valuesOf(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      seenPools.add(poolIndex);
      if (attr(marker, "data-source61-ratio-e2-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex].join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, values)}`);
      const promptVisible = visibleMarkup(generated.prompt);
      if (promptVisible.includes("data-result-highlight") || promptVisible.includes("source61-ratio-e2-answer")) fail(`${label}: 문제에 답 그림 표시가 섞임`);
      if (generated.prompt.match(/<svg[\s\S]*?\/svg>/g)?.length !== 1) fail(`${label}: 문제 SVG가 정확히 한 개가 아님`);
      if (!generated.answerVisual?.includes("source61-ratio-e2-diagram") || !generated.answerVisual.includes("data-result-highlight") || !generated.answerVisual.includes(`data-source61-ratio-e2-values="${values.join(",")}"`)) fail(`${label}: 답 그림·정답 강조·자료 재연결 누락`);
      if (!generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 source 연결 누락`);
      const answerSvg = generated.answerVisual.match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
      if (/<span\b|&lt;span\b/.test(answerSvg)) fail(`${label}: SVG 안에 HTML 분수 문자열이 들어감`);
      if (attr(marker, "data-result-contract") !== "single-value") fail(`${label}: result-contract 누락`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (/\d+\/\d+/.test(`${promptVisible} ${generated.solution} ${generated.answerVisual.replace(/data-values="[^"]*"/g, "")}`)) fail(`${label}: 보이는 수식에 일반 슬래시 분수가 남음`);
      if (variant === 0) {
        const original = values[0] * values[1];
        const newBase = values[0] * (100 + values[2]) / 100;
        const newHeight = values[1] * (100 + values[3]) / 100;
        const problemSvg = promptVisible.match(/<svg[\s\S]*?<\/svg>/)?.[0] || "";
        if (new RegExp(`x="278"[^>]*>${newBase}cm<\\/text>`).test(problemSvg) || new RegExp(`y="145"[^>]*>${newHeight}cm<\\/text>`).test(problemSvg) || problemSvg.includes(`넓이 ${newBase * newHeight}cm`)) fail(`${label}: 문제 그림에 계산한 새 길이·넓이가 노출됨`);
        if (!generated.answerVisual.includes(`${newBase}cm`) || !generated.answerVisual.includes(`${newHeight}cm`) || !generated.answerVisual.includes(`${newBase * newHeight}cm`)) fail(`${label}: 답 그림에 계산한 도형 정보가 없음`);
        if (!close(original * (1 + values[2] / 100) * (1 + values[3] / 100) - original, original * Number(generated.answer.replace("%", "")) / 100)) fail(`${label}: 넓이 증가율 독립 검산 실패`);
      }
      if (variant === 2) {
        const normal = values[8] / values[0] * values[1] + values[8] / values[4] * values[5];
        const sale = values[8] / values[2] * values[3] + values[8] / values[6] * values[7];
        if (promptVisible.includes(`${normal}원`) || promptVisible.includes(`${sale}원`)) fail(`${label}: 문제 표에 합계 금액이 노출됨`);
        if (!generated.answerVisual.includes(`${normal}원`) || !generated.answerVisual.includes(`${sale}원`)) fail(`${label}: 답 표에 합계 금액이 없음`);
      }
      if (variant === 3 && !generated.answerVisual.includes("math-fraction")) fail(`${label}: 과일 가격 차의 분수 표시 누락`);
      if (variant === 5 && !generated.answerVisual.includes("math-fraction")) fail(`${label}: 이어진 비의 분수 표시 누락`);
      if (variant === 9 && values[5] !== 1 && !generated.answerVisual.includes("math-fraction")) fail(`${label}: 연필 가격 차의 분수 표시 누락`);
      if (variant === 6) {
        const firstRate = (values[1] - values[0]) / values[0] * 100;
        const secondRate = (values[3] - values[2]) / values[2] * 100;
        const expectedIndex = firstRate > secondRate ? 0 : 1;
        if (values[7] !== expectedIndex) fail(`${label}: 더 많이 오른 물건의 색인과 실제 상승률이 다름`);
        if (!generated.answerVisual.includes(`${expectedIndex === 0 ? "과자" : "음료수"}가 ${Math.abs(firstRate - secondRate)}% 더 큼`)) fail(`${label}: 답 그림의 물건 이름과 상승률 차가 다름`);
        if (!generated.solution.includes("더 많이 올랐습니다")) fail(`${label}: 상승률 차와 더 오른 물건의 의미 누락`);
      }
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

console.log(`백분율 E2 독립 감사: ${checked}회, 11유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`정답 기준: ${sourceIds.map((id, index) => `${id}=${expectedPools[index].map(expectedAnswer.bind(null, index)).join(" | ")}`).join(" / ")}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 고정 pool·독립 계산·result-contract·난이도·문제값 누출·답 그림 재현·분수 표기·초등 언어 검사");
}
