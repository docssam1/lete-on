"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE3";
const sourceIds = [
  "6-1-u4-e3-exploration-3-1", "6-1-u4-e3-example-3-1", "6-1-u4-e3-example-3-2", "6-1-u4-e3-example-3-3",
  "6-1-u4-e3-example-3-4", "6-1-u4-e3-mission-1", "6-1-u4-e3-mission-2", "6-1-u4-e3-mission-3",
  "6-1-u4-e3-mission-4", "6-1-u4-e3-mission-5", "6-1-u4-e3-mission-6"
];
const kinds = [
  "population-density-area-difference", "rejected-count-difference", "simple-compound-interest-sum", "target-batting-average",
  "fuel-distance-multiple", "stagewise-applicant-count", "invalid-vote-rate", "population-density-table",
  "defect-rate-maximum", "monthly-interest-rate", "engel-index-food-cost"
];
const expectedPools = [
  [[360, 7.5, 4, 63, 297, 52], [420, 7, 5, 70, 70, 13], [540, 9, 6, 72, 78, 11]],
  [[40, 23, 35, 480], [30, 21, 31, 300], [50, 18, 27, 450]],
  [[50000, 3, 2, 3, 107560.4], [40000, 4, 5, 2, 87300], [100000, 2, 3, 2, 210090]],
  [[150, 24, 50, 27, 9, 25], [120, 25, 80, 30, 3, 8], [200, 28, 50, 30, 19, 50]],
  [[1500, 45000, 34500, 13, 12, 33, 33, 10], [1600, 48000, 32000, 10, 14, 28, 2, 1], [1800, 54000, 36000, 15, 15, 30, 7, 3]],
  [[80, 75, 120, 12800], [60, 80, 144, 10800], [50, 60, 150, 12500]],
  [[500, 25, 15, 46], [600, 30, 30, 45], [750, 30, 60, 44]],
  [[800, 780, 820, 10296000, 10168000, 696000, 12000], [600, 640, 625, 8000000, 7500000, 1400000, 11000], [900, 840, 880, 12600000, 12320000, 900000, 13000]],
  [[2000, 70, 2600, 90], [1500, 45, 2400, 71], [2000, 60, 2750, 82]],
  [[60000, 8, 6480, 40000, 6, 6000, 135, 250], [80000, 10, 12000, 50000, 5, 5000, 150, 200], [75000, 6, 6750, 120000, 8, 11520, 150, 120]],
  [[150, 400, 280, 60, 1, 2, 5, 4, 80], [300, 120, 400, 60, 1, 2, 3, 2, 12], [400, 300, 200, 80, 1, 2, 3, 2, 30]]
];
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-9;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const add = (left, right) => rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
const fractionMarkup = (numerator, denominator) => {
  const value = rational(numerator, denominator);
  if (value.denominator === 1) return String(value.numerator);
  return `<span class="math-fraction" role="img" aria-label="${value.denominator}분의 ${value.numerator}"><span>${value.numerator}</span><span>${value.denominator}</span></span>`;
};
const mixedMarkup = (numerator, denominator) => {
  const value = rational(numerator, denominator);
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  if (!remainder) return String(whole);
  if (!whole) return fractionMarkup(remainder, value.denominator);
  return `<span class="math-mixed-number" role="img" aria-label="${whole}와 ${value.denominator}분의 ${remainder}"><span>${whole}</span>${fractionMarkup(remainder, value.denominator)}</span>`;
};
const mixedPlain = (numerator, denominator) => {
  const value = rational(numerator, denominator);
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  if (!remainder) return String(whole);
  return `${whole ? `${whole} ` : ""}${remainder}/${value.denominator}`;
};
const decimal = (value, places = 1) => String(Math.round(value.numerator * 10 ** places / value.denominator) / 10 ** places);
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^\"]*)"`))?.[1] || "";
const markerValues = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => close(value, right[index]));
const visibleMarkup = markup => String(markup || "").replace(/<span hidden[^>]*><\/span>/g, "");

function expectedAnswer(variant, values) {
  if (variant === 0) {
    const nArea = rational(values[0] * 2, Math.round(values[1] * 2));
    const aArea = add(nArea, rational(values[2]));
    return `1 km²당 ${mixedPlain((values[0] - values[3]) * aArea.denominator, aArea.numerator)}명`;
  }
  if (variant === 1) return `${values[0] * (values[2] - values[1])}명`;
  if (variant === 2) {
    const simple = rational(values[0] * values[1] * values[3], 100);
    const simplePrincipal = add(rational(values[0]), simple);
    const compound = rational(values[0] * (100 + values[2]) ** values[3], 100 ** values[3]);
    return `${decimal(add(simplePrincipal, compound), 1)}원`;
  }
  if (variant === 3) {
    const currentHits = rational(values[0] * values[1], 100);
    const targetHits = rational((values[0] + values[2]) * values[3], 100);
    const requiredFutureHits = rational(targetHits.numerator * currentHits.denominator - currentHits.numerator * targetHits.denominator, targetHits.denominator * currentHits.denominator);
    return `${decimal(rational(requiredFutureHits.numerator, requiredFutureHits.denominator * values[2]), 3)} 이상`;
  }
  if (variant === 4) {
    const normalDistance = rational(values[1] * values[4], values[0]);
    const hybridDistance = rational((values[3] * values[0] + values[2]) * values[5], values[0]);
    return `${mixedPlain(hybridDistance.numerator * normalDistance.denominator, hybridDistance.denominator * normalDistance.numerator)}배`;
  }
  if (variant === 5) return `${values[2] * 100 / values[1] * values[0]}명`;
  if (variant === 6) return `${(values[0] - values[1] - values[2]) / 2 / values[0] * 100}%`;
  if (variant === 7) {
    const popA = values[3] - values[5];
    return `1 km²당 ${popA / values[0]}명`;
  }
  if (variant === 8) return `${Math.floor(values[2] * values[1] / values[0] - 1e-9)}개 이하`;
  if (variant === 9) {
    const rateA = rational(values[2] * 100, values[0] * values[1]);
    const rateB = rational(values[5] * 100, values[3] * values[4]);
    return `가 ${decimal(rateA, 2)}%, 나 ${decimal(rateB, 2)}%`;
  }
  const totals = values.slice(0, 3);
  const indexA = rational(values[3], totals[0]);
  const indexB = multiply(indexA, rational(values[4], values[5]));
  const indexC = multiply(indexB, rational(values[6], values[7]));
  const foodB = rational(totals[1] * indexB.numerator, indexB.denominator);
  const foodC = rational(totals[2] * indexC.numerator, indexC.denominator);
  return `${foodB.numerator / foodB.denominator}만원`;
}

const failures = [];
const fail = message => failures.push(message);
let checked = 0;
if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE3 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 11 || expectedPools.length !== 11 || expectedPools.some(pool => pool.length !== 3)) fail("11유형×3pool 계약이 다릅니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 611300 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      let generated;
      try {
        generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      } catch (error) {
        fail(`${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}: 생성 예외 ${error.message}`);
        continue;
      }
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e3-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = markerValues(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      seenPools.add(poolIndex);
      if (attr(marker, "data-source61-ratio-e3-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex]?.join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, values)}`);
      if (/[<>]|&lt;|&gt;/.test(String(generated.answer))) fail(`${label}: 정답 데이터에 화면용 HTML이 들어갔습니다.`);
      const promptVisible = visibleMarkup(generated.prompt);
      const problemSvg = promptVisible.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const answerSvgs = generated.answerVisual?.match(/<svg[\s\S]*?<\/svg>/g) || [];
      if (promptVisible.includes("data-result-highlight") || promptVisible.includes("source61-ratio-e3-answer")) fail(`${label}: 문제에 답 그림 표시가 섞임`);
      if (problemSvg.length !== 1 || answerSvgs.length !== 1) fail(`${label}: 문제·답 SVG 수가 1개가 아님`);
      if (!generated.answerVisual?.includes("source61-ratio-e3-diagram") || !generated.answerVisual.includes("data-result-highlight") || !generated.answerVisual.includes(`data-source61-ratio-e3-values="${attr(problemSvg[0], "data-source61-ratio-e3-values")}"`)) fail(`${label}: 답 그림·정답 강조·자료 재연결 누락`);
      if (!generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 source 연결 누락`);
      if (/<span\b|&lt;span\b/.test(answerSvgs[0] || "") || /<span\b|&lt;span\b/.test(problemSvg[0] || "")) fail(`${label}: SVG 안에 HTML 분수 문자열이 들어감`);
      if (attr(marker, "data-result-contract") !== (variant === 9 ? "two-values" : "single-value")) fail(`${label}: result-contract 누락`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      if (variant === 4) {
        const [price, normalCost, hybridExtraCost, hybridStartLiters] = values;
        const normalLiters = normalCost / price;
        const hybridLiters = hybridStartLiters + hybridExtraCost / price;
        if (promptVisible.includes(`${normalCost}÷${price}=`) || promptVisible.includes(`${hybridStartLiters}+${hybridExtraCost}÷${price}=`) || promptVisible.includes(`전체 ${normalLiters}L`) || promptVisible.includes(`전체 ${hybridLiters}L`)) fail(`${label}: 문제 화면에 계산된 기름 양이 먼저 노출되었습니다.`);
      }
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|제곱|일차식|절댓값/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

console.log(`여러 가지 비율 E3 독립 감사: ${checked}회, 11유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`검사 대상: ${sourceIds.join(", ")}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 고정 pool·독립 계산·단일 정답·문제값 누출·답 그림 재현·SVG 수식 표기·초등 언어 검사");
}
