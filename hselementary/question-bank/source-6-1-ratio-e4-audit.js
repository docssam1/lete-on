"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
require("./generators.js");
require("./source-inventory-grade6.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE4";
const sourceIds = [
  "6-1-u4-e4-exploration-4-1", "6-1-u4-e4-exploration-4-2", "6-1-u4-e4-example-4-1", "6-1-u4-e4-example-4-2",
  "6-1-u4-e4-example-4-3", "6-1-u4-e4-example-4-4", "6-1-u4-e4-mission-1", "6-1-u4-e4-mission-2",
  "6-1-u4-e4-mission-3", "6-1-u4-e4-mission-4", "6-1-u4-e4-mission-5", "6-1-u4-e4-mission-6"
];
const kinds = [
  "profit-and-discount", "mixture-concentration", "profit-rate", "maximum-no-loss-discount",
  "evaporation-concentration", "mixture-sample-salt-mass", "discount-table-order", "mixed-discount-total",
  "multi-price-profit", "mixture-concentration", "mixture-sample-remainder", "refill-concentration"
];
const expectedPools = [
  [[20, 2400000, 60, 12, 2, 30], [18, 1800000, 50, 10, 2, 20], [24, 3000000, 40, 15, 2, 25]],
  [[20, 150, 5, 300, 100, 250], [30, 200, 10, 400, 150, 250], [20, 200, 10, 300, 100, 200]],
  [[14, 2, 70000, 2800], [12, 3, 90000, 3000], [18, 2, 144000, 10000]],
  [[12000, 35, 15], [10000, 30, 20], [15000, 25, 10]],
  [[15, 200, 150], [12, 250, 200], [20, 250, 200]],
  [[20, 200, 10, 300, 150], [15, 240, 5, 360, 100], [30, 180, 10, 420, 200]],
  [[24000, 19200, 28000, 25200, 16000, 14080, 12000, 10200], [30000, 24000, 25000, 22500, 18000, 15120, 16000, 14080], [36000, 28800, 22000, 19360, 18000, 15120, 14000, 12600]],
  [[2500, 3, 5, 4500, 16, 19650], [1800, 4, 6, 4200, 18, 18000], [3200, 2, 4, 3600, 12, 15920]],
  [[100, 800, 75, 60, 4, 20, 50], [120, 600, 50, 72, 4, 25, 50], [90, 1000, 60, 54, 3, 30, 50]],
  [[14, 250, 20, 125], [10, 300, 25, 100], [8, 250, 20, 150]],
  [[40, 150, 25, 300, 200], [25, 240, 10, 360, 125], [20, 300, 30, 200, 100]],
  [[8, 500, 200, 200], [10, 600, 150, 150], [12, 400, 100, 100]]
];

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const rational = (numerator, denominator = 1) => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const multiply = (left, right) => rational(left.numerator * right.numerator, left.denominator * right.denominator);
const subtract = (left, right) => rational(left.numerator * right.denominator - right.numerator * left.denominator, left.denominator * right.denominator);
const mixedPlain = value => {
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator % value.denominator;
  return remainder ? `${whole ? `${whole} ` : ""}${remainder}/${value.denominator}` : String(whole);
};
const decimalPlain = (value, places = 2) => String(Math.round(value.numerator * 10 ** places / value.denominator) / 10 ** places);
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^\"]*)"`))?.[1] || "";
const markerValues = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const visible = markup => String(markup || "").replace(/<span hidden[^>]*><\/span>/g, "");
const stripTags = markup => String(markup || "").replace(/<[^>]+>/g, "");

function expectedAnswer(variant, values) {
  if (variant === 0) {
    const [count, totalCost, profitRate, regularSold, costSold, discountRate] = values;
    const costEach = totalCost / count;
    const listEach = costEach * (100 + profitRate) / 100;
    const discountedSold = count - regularSold - costSold - 1;
    return `${regularSold * listEach + costSold * costEach + discountedSold * listEach * (100 - discountRate) / 100 - totalCost}원`;
  }
  if (variant === 1) {
    const [rateA, massA, rateB, massB, used, addedWater] = values;
    const totalMass = massA + massB;
    const totalSalt = rational(massA * rateA + massB * rateB, 100);
    const usedSalt = multiply(totalSalt, rational(used, totalMass));
    const remainingSalt = subtract(totalSalt, usedSalt);
    return `${mixedPlain(rational(remainingSalt.numerator * 100, remainingSalt.denominator * (totalMass - used + addedWater)))}%`;
  }
  if (variant === 2) {
    const [perBox, boxes, totalCost, saleEach] = values;
    return `${mixedPlain(rational((perBox * boxes * saleEach - totalCost) * 100, totalCost))}%`;
  }
  if (variant === 3) {
    const [cost, initialProfitRate, raiseRate] = values;
    const raisedList = cost * (100 + initialProfitRate) * (100 + raiseRate) / 10000;
    return `${Math.floor((raisedList - cost) * 100 / raisedList + 1e-9)}%`;
  }
  if (variant === 4) {
    const [rate, initialMass, finalMass] = values;
    return `${mixedPlain(rational(initialMass * rate, finalMass))}%`;
  }
  if (variant === 5) {
    const [rateA, massA, rateB, massB, used] = values;
    const totalMass = massA + massB;
    return `${mixedPlain(rational((massA * rateA + massB * rateB) * used, 100 * totalMass))}g`;
  }
  if (variant === 6) {
    const labels = ["가", "나", "다", "라"];
    const rates = [];
    for (let index = 0; index < 4; index += 1) rates.push({ label: labels[index], rate: rational((values[index * 2] - values[index * 2 + 1]) * 100, values[index * 2]) });
    return rates.sort((left, right) => right.rate.numerator * left.rate.denominator - left.rate.numerator * right.rate.denominator).map(item => item.label).join(", ");
  }
  if (variant === 7) {
    const [pencilPack, pencilPacks, notebookPack, notebookPackPrice, notebooks, paid] = values;
    const pencilList = pencilPack * pencilPacks;
    const notebookList = notebooks / notebookPack * notebookPackPrice;
    return `${mixedPlain(rational((pencilList + notebookList - paid) * 100, pencilList))}%`;
  }
  if (variant === 8) {
    const [count, costEach, profitRate, regularSold, partialDenominator, discountRate, finalRate] = values;
    const listEach = costEach * (100 + profitRate) / 100;
    const remaining = count - regularSold;
    const discountedCount = remaining / partialDenominator;
    const finalCount = remaining - discountedCount;
    const saleTotal = regularSold * listEach + discountedCount * listEach * (100 - discountRate) / 100 + finalCount * listEach * finalRate / 100;
    return `${saleTotal - count * costEach}원`;
  }
  if (variant === 9) {
    const [rateA, massA, rateB, massB] = values;
    return `${mixedPlain(rational(massA * rateA + massB * rateB, massA + massB))}%`;
  }
  if (variant === 10) {
    const [rateA, massA, rateB, massB, used] = values;
    const totalMass = massA + massB;
    return `${mixedPlain(rational((massA * rateA + massB * rateB) * (totalMass - used), 100 * totalMass))}g`;
  }
  const [initialRate, initialMass, poured, addedWater] = values;
  const finalMass = initialMass - poured + addedWater;
  return `${decimalPlain(rational(initialRate * (initialMass - poured) * 100, 100 * finalMass), 2)}%`;
}

const failures = [];
const fail = message => failures.push(message);
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-1-u4-source-readiness-review.json"), "utf8"));
const rawInventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-1-source-items.json"), "utf8"));
const publicInventory = window.HSE_SOURCE_INVENTORY_GRADE6;
const findItem = (items, id) => items.find(item => item.sourceItemId === id);
const assertSourceWord = (label, item, required, forbidden) => {
  const text = JSON.stringify(item || {});
  if (!item || !text.includes(required) || text.includes(forbidden)) fail(`${label}: 원본 낱말은 '${required}'이어야 하며 '${forbidden}'이 남으면 안 됩니다.`);
};
let checked = 0;
if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE4 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 12 || expectedPools.length !== 12 || expectedPools.some(pool => pool.length !== 3)) fail("12유형×3pool 계약이 다릅니다.");
if (expectedPools[1][0].join(",") !== "20,150,5,300,100,250") fail("개념탐구 4-(2) 원문 pool이 바뀌었습니다.");
if (expectedPools[9][0].join(",") !== "14,250,20,125") fail("Mission 4 원문 pool이 바뀌었습니다.");
if (expectedPools[11][0].join(",") !== "8,500,200,200") fail("Mission 6 원문 pool이 바뀌었습니다.");
assertSourceWord("예제 4-3 공개 분류", findItem(publicInventory.items, "6-1-u4-e4-example-4-3"), "설탕물", "소금물");
assertSourceWord("예제 4-3 검수 기록", findItem(readiness.items, "6-1-u4-e4-example-4-3"), "설탕", "소금");
assertSourceWord("예제 4-3 원문 색인", findItem(rawInventory.items, "6-1-u4-e4-example-3"), "설탕", "소금");
assertSourceWord("Mission 2 공개 분류", findItem(publicInventory.items, "6-1-u4-e4-mission-2"), "노트", "공책");
assertSourceWord("Mission 2 검수 기록", findItem(readiness.items, "6-1-u4-e4-mission-2"), "노트", "공책");
assertSourceWord("Mission 2 원문 색인", findItem(rawInventory.items, "6-1-u4-e4-mission-2"), "노트", "공책");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 614000 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      let generated;
      try {
        generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      } catch (error) {
        fail(`${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}: 생성 예외 ${error.message}`);
        continue;
      }
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e4-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = markerValues(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      const problemVisible = visible(generated?.prompt);
      const problemSvg = problemVisible.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const answerSvgs = generated?.answerVisual?.match(/<svg[\s\S]*?<\/svg>/g) || [];
      seenPools.add(poolIndex);
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      if (attr(marker, "data-source61-ratio-e4-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex]?.join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, values)}`);
      if (/[<>]|&lt;|&gt;/.test(String(generated.answer))) fail(`${label}: 정답 데이터에 화면용 HTML이 들어갔습니다.`);
      if (problemSvg.length !== 1 || answerSvgs.length !== 1) fail(`${label}: 문제·답 SVG 수가 1개가 아님`);
      if (problemVisible.includes("data-result-highlight") || problemVisible.includes("source61-ratio-e4-answer")) fail(`${label}: 문제에 답 그림 표시가 섞임`);
      if (!generated.answerVisual?.includes("source61-ratio-e4-diagram") || !generated.answerVisual.includes("data-result-highlight") || !generated.answerVisual.includes(`data-source61-ratio-e4-values="${attr(problemSvg[0], "data-source61-ratio-e4-values")}"`)) fail(`${label}: 답 그림·정답 강조·자료 재연결 누락`);
      if (!generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 source 연결 누락`);
      if (/<span\b|&lt;span\b/.test(answerSvgs[0] || "") || /<span\b|&lt;span\b/.test(problemSvg[0] || "")) fail(`${label}: SVG 안에 HTML 수식 문자열이 들어감`);
      if (attr(marker, "data-result-contract") !== "single-value") fail(`${label}: result-contract 누락`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      const allMarkup = `${generated.prompt} ${generated.solution} ${generated.answerVisual}`;
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(allMarkup)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (variant === 2 && !stripTags(generated.prompt).includes(`배 ${values[1]}상자의`)) fail(`${label}: 자료와 다른 상자 수가 보입니다.`);
      if (variant === 1 && !stripTags(generated.prompt).includes(`${values[4]}g을 사용한 후`)) fail(`${label}: 원문 표현 '100g을 사용한 후'가 보존되지 않았습니다.`);
      if (variant === 1 && allMarkup.includes("20/7")) fail(`${label}: 정정 전 20/7% 답이 남아 있습니다.`);
      if (variant === 9) {
        if (!allMarkup.includes("설탕") || allMarkup.includes("소금")) fail(`${label}: Mission 4의 설탕물 표기가 오염되었습니다.`);
      }
      if (variant === 4 && (!allMarkup.includes("설탕") || allMarkup.includes("소금"))) fail(`${label}: 예제 4-3의 설탕물 표기가 오염되었습니다.`);
      if (variant === 7 && (!allMarkup.includes("노트") || allMarkup.includes("공책"))) fail(`${label}: Mission 2의 노트 표기가 오염되었습니다.`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

console.log(`비와 비율 E4 독립 감사: ${checked}회, 12유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`검사 대상: ${sourceIds.join(", ")}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("통과: 독립 계산·단일 정답·고정 pool·문제값 누출·답 그림 재현·SVG 수식 표기·원문 표현 회귀 검사");
}
