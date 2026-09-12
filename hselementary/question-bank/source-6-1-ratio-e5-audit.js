"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE5";
const sourceIds = [
  "6-1-u4-e5-exploration-5-1", "6-1-u4-e5-example-5-1", "6-1-u4-e5-example-5-2", "6-1-u4-e5-example-5-3",
  "6-1-u4-e5-example-5-4", "6-1-u4-e5-mission-1", "6-1-u4-e5-mission-2", "6-1-u4-e5-mission-3",
  "6-1-u4-e5-mission-4", "6-1-u4-e5-mission-5", "6-1-u4-e5-mission-6"
];
const kinds = [
  "successive-price-rise", "whole-from-fraction-relations", "empty-container-weight", "equal-area-perimeter-ratio",
  "two-pole-lengths", "remaining-broth", "resized-rectangle-ratio", "trapezoid-area-ratio",
  "double-points-days", "three-money-ratio", "oil-drum-weight"
];
const expectedPools = [
  [[32000, 35, 25, 325], [30000, 30, 20, 260], [40000, 25, 15, 210]],
  [[5, 9, 2, 3, 7, 1], [4, 7, 1, 3, 8, 2], [5, 8, 3, 2, 7, 2]],
  [[72, 84, 184, 208], [60, 80, 140, 180], [35, 65, 105, 165]],
  [[15, 3, 9, 5], [12, 3, 9, 4], [6, 4, 8, 3]],
  [[35, 264, 13], [40, 240, 10], [30, 180, 15]],
  [[14, 4, 9, 32, 30], [20, 1, 4, 42, 40], [10, 1, 3, 30, 40]],
  [[30, 20, 30, 117], [40, 25, 20, 104], [50, 24, 25, 150]],
  [[10, 20, 60, 5, 3], [8, 16, 60, 5, 3], [12, 24, 75, 4, 3]],
  [[30, 5000, 4, 7200], [31, 4000, 5, 7000], [30, 6000, 3, 5940]],
  [[75, 2, 3], [80, 3, 4], [70, 4, 7]],
  [[5, 12, 113, 20, 3, 10, 17, 4, 3, 8, 14], [2, 5, 7, 1, 1, 5, 4, 1, 1, 2, 10], [1, 2, 11, 1, 1, 3, 8, 1, 3, 4, 16]]
];

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
};
const add = (a, b) => rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
const subtract = (a, b) => rational(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
const multiply = (a, b) => rational(a.numerator * b.numerator, a.denominator * b.denominator);
const divide = (a, b) => rational(a.numerator * b.denominator, a.denominator * b.numerator);
const plain = value => {
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  return remainder ? `${whole ? `${whole} ` : ""}${remainder}/${value.denominator}` : String(whole);
};
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const markerValues = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const visible = markup => String(markup || "").replace(/<span hidden[^>]*><\/span>/g, "");

function expectedAnswer(variant, values) {
  if (variant === 0) {
    const [lastTotal, steakRise, juiceRise, combinedRiseTenths] = values;
    const steakLast = lastTotal * (combinedRiseTenths - juiceRise * 10) / (10 * (steakRise - juiceRise));
    const juiceLast = lastTotal - steakLast;
    const steakNext = steakLast * (100 + steakRise) ** 2 / 10000;
    const juiceNext = juiceLast * (100 + juiceRise) ** 2 / 10000;
    return `스테이크 ${steakNext}원, 주스 ${juiceNext}원`;
  }
  if (variant === 1) {
    const [boyN, boyD, boyPlus, girlN, girlD, girlPlus] = values;
    const denominator = subtract(rational(1), add(rational(boyN, boyD), rational(girlN, girlD)));
    const totalValue = divide(rational(boyPlus + girlPlus), denominator);
    const boysValue = add(multiply(totalValue, rational(boyN, boyD)), rational(boyPlus));
    const girlsValue = add(multiply(totalValue, rational(girlN, girlD)), rational(girlPlus));
    if (boysValue.denominator !== 1 || girlsValue.denominator !== 1) throw new Error("학생 수가 자연수가 아닙니다.");
    const boys = boysValue.numerator;
    const girls = girlsValue.numerator;
    const divisor = gcd(boys, girls);
    return `${boys / divisor}:${girls / divisor}`;
  }
  if (variant === 2) {
    const [fillA, fillB, weightATenths, weightBTenths] = values;
    const fullPaint = rational((weightBTenths - weightATenths) * 10, fillB - fillA);
    return `${plain(subtract(rational(weightATenths, 10), multiply(fullPaint, rational(fillA, 100))))}kg`;
  }
  if (variant === 3) {
    const [aw, ah, bw, bh] = values;
    const pa = 2 * (aw + ah);
    const pb = 2 * (bw + bh);
    const divisor = gcd(pa, pb);
    return `${pa / divisor}:${pb / divisor}`;
  }
  if (variant === 4) {
    const [buriedRate, buriedDepthTenths, exposedGapRate] = values;
    const lengths = [
      buriedDepthTenths * 10 / (buriedRate + exposedGapRate),
      buriedDepthTenths * 10 / (buriedRate - exposedGapRate)
    ].sort((a, b) => a - b);
    return `${lengths[0]}cm, ${lengths[1]}cm`;
  }
  if (variant === 5) {
    const [day1Rate, day2N, day2D, day3Tenths, finalRate] = values;
    const beforeThird = rational((100 - day1Rate) * (day2D - day2N), 100 * day2D);
    return `${plain(divide(rational(day3Tenths, 10), subtract(beforeThird, rational(finalRate, 100))))}L`;
  }
  if (variant === 6) {
    const [oldWidth, oldHeight, decreaseRate, areaDrop] = values;
    const newWidth = oldWidth * (100 - decreaseRate) / 100;
    const newHeight = (oldWidth * oldHeight - areaDrop) / newWidth;
    const divisor = gcd(newHeight, oldHeight);
    return `${newHeight / divisor}:${oldHeight / divisor}`;
  }
  if (variant === 7) {
    const [topLeft, topRight, topToBottomRate, areaLeft, areaRight] = values;
    const top = topLeft + topRight;
    const bottom = top * 100 / topToBottomRate;
    return `${(areaRight * (topLeft + bottom) - areaLeft * topRight) / (areaLeft + areaRight)}cm`;
  }
  if (variant === 8) {
    const [days, dailySpend, basicRate, totalPoints] = values;
    const basicPoints = dailySpend * basicRate / 100;
    return `${(totalPoints - basicPoints * days) / basicPoints}일`;
  }
  if (variant === 9) {
    const [middleRate, lastN, lastD] = values;
    return plain(rational(middleRate * lastN, 100 * lastD));
  }
  const [f1n, f1d, w1n, w1d, f2n, f2d, w2n, w2d, dailyN, dailyD, days] = values;
  const f1 = rational(f1n, f1d), f2 = rational(f2n, f2d), w1 = rational(w1n, w1d), w2 = rational(w2n, w2d);
  const fullOil = divide(subtract(w1, w2), subtract(f1, f2));
  const empty = subtract(w1, multiply(fullOil, f1));
  const remaining = subtract(add(empty, fullOil), multiply(rational(dailyN, dailyD), rational(days)));
  return `${plain(multiply(remaining, rational(100)))}kg`;
}

const failures = [];
const fail = message => failures.push(message);
let checked = 0;
if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE5 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 11 || expectedPools.length !== 11 || expectedPools.some(pool => pool.length !== 3)) fail("11유형×3pool 계약이 다릅니다.");
if (expectedAnswer(0, expectedPools[0][0]) !== "스테이크 43740원, 주스 12500원") fail("개념탐구 5 원문 답 정정이 43740원·12500원이 아닙니다.");
if (expectedAnswer(10, expectedPools[10][0]) !== "740kg") fail("Mission 6 원문 답 정정이 740kg이 아닙니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 615000 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      let generated;
      try {
        generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      } catch (error) {
        fail(`${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}: 생성 예외 ${error.message}`);
        continue;
      }
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e5-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = markerValues(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      const problemVisible = visible(generated?.prompt);
      const problemSvgs = problemVisible.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const answerSvgs = generated?.answerVisual?.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const expectedContract = variant === 0 || variant === 4 ? "two-values" : "single-value";
      seenPools.add(poolIndex);
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      if (attr(marker, "data-source61-ratio-e5-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex]?.join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, values)}`);
      if (/[<>]|&lt;|&gt;/.test(String(generated.answer))) fail(`${label}: 정답 데이터에 화면용 HTML이 들어갔습니다.`);
      if (problemSvgs.length !== 1 || answerSvgs.length !== 1) fail(`${label}: 문제·답 SVG 수가 1개가 아님`);
      if (problemVisible.includes("data-result-highlight") || problemVisible.includes("source61-ratio-e5-answer")) fail(`${label}: 문제에 답 표시가 섞임`);
      const problemValues = attr(problemSvgs[0], "data-source61-ratio-e5-values");
      if (!generated.answerVisual?.includes("source61-ratio-e5-diagram") || !generated.answerVisual.includes("data-result-highlight") || !generated.answerVisual.includes(`data-source61-ratio-e5-values="${problemValues}"`)) fail(`${label}: 답 그림·정답 강조·문제 자료 재현 누락`);
      if (!generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 source 연결 누락`);
      if (/<span\b|&lt;span\b/.test(answerSvgs[0] || "") || /<span\b|&lt;span\b/.test(problemSvgs[0] || "")) fail(`${label}: SVG 안에 HTML 수식 문자열이 들어감`);
      if (attr(marker, "data-result-contract") !== expectedContract) fail(`${label}: result-contract ${attr(marker, "data-result-contract")} / 기대 ${expectedContract}`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      const allMarkup = `${generated.prompt} ${generated.solution} ${generated.answerVisual}`;
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(allMarkup)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (variant === 0 && poolIndex === 0 && (!allMarkup.includes("43740") || !allMarkup.includes("12500") || allMarkup.includes("21600") || allMarkup.includes("20000"))) fail(`${label}: 원문 가격 답 정정 불일치`);
      if (variant === 3 && (!problemVisible.includes('data-equal-area-model="true"') || !problemVisible.includes("source61-e5-equal-area-a") || !problemVisible.includes("source61-e5-equal-area-b"))) fail(`${label}: 같은 넓이를 실제 치수로 검사할 직사각형 모형이 없습니다.`);
      if (variant === 4 && (!problemVisible.includes("두 말뚝") || !generated.solution.includes("두 경우") || expectedAnswer(variant, values).split(",").length !== 2)) fail(`${label}: 두 말뚝의 두 해 근거 누락`);
      if (variant === 4 && (!problemVisible.includes('data-pole-condition-schematic="true"') || problemVisible.includes("source61-e5-pole-case") || (generated.answerVisual.match(/source61-e5-pole-case/g) || []).length !== 2)) fail(`${label}: 문제의 조건 모형과 답의 두 실제 경우가 분리되지 않았습니다.`);
      if (variant === 7 && (!problemVisible.includes("사다리꼴") || !problemVisible.includes("ㅁㄷ") || !problemVisible.includes("trapezoid-area-ratio"))) fail(`${label}: 사다리꼴 구조·선분 이름 누락`);
      if (variant === 10 && poolIndex === 0 && (!allMarkup.includes("740") || allMarkup.includes("1190"))) fail(`${label}: Mission 6 원문 답 정정 불일치`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

console.log(`비와 비율 E5 독립 감사: ${checked}회, 11유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`검사 대상: ${sourceIds.join(", ")}`);
if (failures.length) {
  console.error(failures.slice(0, 200).join("\n"));
  if (failures.length > 200) console.error(`... ${failures.length - 200}건 더 있음`);
  process.exitCode = 1;
} else {
  console.log("통과: 독립 계산·답 개수·고정 pool·문제/답 그림 동일 자료·SVG 수식·원문 정정 회귀 검사");
}
