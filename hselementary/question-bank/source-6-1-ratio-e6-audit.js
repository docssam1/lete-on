"use strict";

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const generatorKey = "sourceGrade6RatioE6";
const sourceIds = [
  "6-1-u4-e6-exploration-6-1", "6-1-u4-e6-example-6-1", "6-1-u4-e6-example-6-2", "6-1-u4-e6-example-6-3",
  "6-1-u4-e6-example-6-4", "6-1-u4-e6-mission-1", "6-1-u4-e6-mission-2", "6-1-u4-e6-mission-3",
  "6-1-u4-e6-mission-4", "6-1-u4-e6-mission-5", "6-1-u4-e6-mission-6"
];
const kinds = [
  "discounted-quantity-from-total-profit", "mixture-needed-mass", "two-concentrations-from-ratio", "cost-from-markup-and-discount",
  "downhill-uphill-distances", "mixture-part-mass", "evaporated-water-mass", "added-water-mass",
  "original-markup-rate", "clothes-list-price", "shoe-count-from-split-sales"
];
const expectedPools = [
  [[200, 6000, 50, 30, 465000], [150, 8000, 25, 20, 220000], [240, 5000, 40, 25, 340000]],
  [[10, 100, 20, 12], [8, 150, 20, 14], [12, 240, 30, 18]],
  [[2, 3, 400, 600, 13], [3, 5, 300, 500, 17], [4, 7, 600, 600, 11]],
  [[25, 2000, 1500], [30, 1800, 2400], [30, 2400, 3000]],
  [[5.2, 4.8, 15, 10, 15, 50, 552, 648], [5.2, 6, 20, 20, 12, 40, 720, 480], [4.5, 5.4, 10, 10, 10, 40, 495, 405]],
  [[5, 13, 11, 400], [8, 20, 14, 500], [4, 16, 10, 360]],
  [[8, 600, 12], [10, 500, 20], [6, 900, 9]],
  [[4, 200, 12, 100, 5], [6, 300, 18, 100, 8], [5, 400, 15, 200, 8]],
  [[18000, 1800, 40], [24000, 2400, 30], [16000, 2400, 35]],
  [[30, 20, 56000, 77000], [25, 10, 64500, 80000], [40, 20, 62000, 90000]],
  [[20000, 40, 20, 40, 345600], [15000, 50, 25, 20, 255000], [24000, 25, 25, 40, 216000]]
];

const won = value => `${Number(value).toLocaleString("ko-KR")}원`;
const attr = (markup, name) => String(markup || "").match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
const markerValues = markup => (attr(markup, "data-values") || "").split(",").filter(Boolean).map(Number);
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const visible = markup => String(markup || "").replace(/<span hidden[^>]*><\/span>/g, "");

function expectedAnswer(variant, values) {
  if (variant === 0) {
    const [count, cost, markupRate, discountRate, totalProfit] = values;
    const listPrice = cost * (100 + markupRate) / 100;
    const regularProfit = listPrice - cost;
    const saleProfit = listPrice * (100 - discountRate) / 100 - cost;
    return `${(count * regularProfit - totalProfit) / (regularProfit - saleProfit)}장`;
  }
  if (variant === 1) {
    const [lowRate, lowMass, highRate, targetRate] = values;
    return `${lowMass * (targetRate - lowRate) / (highRate - targetRate)}g`;
  }
  if (variant === 2) {
    const [ratioA, ratioB, massA, massB, mixedRate] = values;
    const unit = mixedRate * (massA + massB) / (ratioA * massA + ratioB * massB);
    return `가 ${ratioA * unit}%, 나 ${ratioB * unit}%`;
  }
  if (variant === 3) {
    const [markupRate, discountWon, remainingProfit] = values;
    return won((discountWon + remainingProfit) * 100 / markupRate);
  }
  if (variant === 4) {
    const [totalDistance, flatSpeed, downhillRise, uphillDrop, hillMinutes, flatMinutes, expectedDownhill, expectedUphill] = values;
    const hillDistance = totalDistance - flatSpeed * flatMinutes / 60;
    const downhillSpeed = flatSpeed * (100 + downhillRise) / 100;
    const uphillSpeed = flatSpeed * (100 - uphillDrop) / 100;
    const downhill = Math.round(((hillMinutes / 60 - hillDistance / uphillSpeed) / (1 / downhillSpeed - 1 / uphillSpeed)) * 1000);
    const uphill = Math.round(hillDistance * 1000 - downhill);
    if (downhill !== expectedDownhill || uphill !== expectedUphill) throw new Error("언덕 거리 고정 답이 독립 계산과 다릅니다.");
    return `내리막 ${downhill}m, 오르막 ${uphill}m`;
  }
  if (variant === 5) {
    const [lowRate, highRate, targetRate, totalMass] = values;
    return `${totalMass * (targetRate - lowRate) / (highRate - lowRate)}g`;
  }
  if (variant === 6) {
    const [initialRate, initialMass, finalRate] = values;
    return `${initialMass - initialMass * initialRate / finalRate}g`;
  }
  if (variant === 7) {
    const [rateA, massA, rateB, massB, targetRate] = values;
    return `${(rateA * massA + rateB * massB) / targetRate - massA - massB}g`;
  }
  if (variant === 8) {
    const [cost, discountWon, remainingRate] = values;
    return `${remainingRate + discountWon * 100 / cost}%`;
  }
  if (variant === 9) {
    const [shoeDiscount, clothesDiscount, paid, listTotal] = values;
    const shoeList = (paid - listTotal * (100 - clothesDiscount) / 100) * 100 / (clothesDiscount - shoeDiscount);
    return won(listTotal - shoeList);
  }
  const [cost, markupRate, discountShare, discountRate, totalProfit] = values;
  const listPrice = cost * (100 + markupRate) / 100;
  const regularProfit = listPrice - cost;
  const discountedProfit = listPrice * (100 - discountRate) / 100 - cost;
  const averageProfit = (100 - discountShare) / 100 * regularProfit + discountShare / 100 * discountedProfit;
  return `${totalProfit / averageProfit}켤레`;
}

const failures = [];
const fail = message => failures.push(message);
const longDecimalTail = /\d+\.\d{5,}/;
let checked = 0;
if (!api?.names?.includes(generatorKey)) fail("sourceGrade6RatioE6 생성기가 등록되지 않았습니다.");
if (sourceIds.length !== 11 || expectedPools.length !== 11 || expectedPools.some(pool => pool.length !== 3)) fail("11유형×3pool 계약이 다릅니다.");
if (expectedAnswer(0, expectedPools[0][0]) !== "50장") fail("개념탐구 6 원문 답이 50장이 아닙니다.");
if (expectedAnswer(4, expectedPools[4][0]) !== "내리막 552m, 오르막 648m") fail("예제 6-4 원문 답이 552m·648m가 아닙니다.");
if (expectedAnswer(10, expectedPools[10][0]) !== "60켤레") fail("Mission 6 원문 답이 60켤레가 아닙니다.");

for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seenPools = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seedIndex = 1; seedIndex <= 200; seedIndex += 1) {
      const seed = 616000 + variant * 100000 + (difficulty + 1) * 1000 + seedIndex;
      let generated;
      try {
        generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey, reviewLocked: false }, 0, difficulty, seed, variant);
      } catch (error) {
        fail(`${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}: 생성 예외 ${error.message}`);
        continue;
      }
      const marker = generated?.prompt.match(/<span hidden[^>]*data-source61-ratio-e6-kind="[^"]+"[^>]*><\/span>/)?.[0] || "";
      const values = markerValues(marker);
      const poolIndex = generated?.verifiedPoolIndex;
      const label = `${sourceIds[variant]} / 난이도 ${difficulty} / seed ${seed}`;
      const problemVisible = visible(generated?.prompt);
      const problemSvgs = problemVisible.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const answerSvgs = generated?.answerVisual?.match(/<svg[\s\S]*?<\/svg>/g) || [];
      const expectedContract = variant === 2 || variant === 4 ? "two-values" : "single-value";
      seenPools.add(poolIndex);
      if (!generated || generated.generator !== generatorKey || generated.sourceItemId !== sourceIds[variant]) fail(`${label}: 생성기·source 연결 누락`);
      if (generated.generationMode !== "fixed-verified-pool" || generated.verifiedVariantCount !== 3 || !Number.isInteger(poolIndex) || poolIndex < 0 || poolIndex > 2) fail(`${label}: 고정 pool 계약 오류`);
      if (attr(marker, "data-source61-ratio-e6-kind") !== kinds[variant] || attr(marker, "data-source-item") !== sourceIds[variant]) fail(`${label}: 검산 근거 연결 오류`);
      if (!sameArray(values, expectedPools[variant][poolIndex])) fail(`${label}: pool 값 불일치 (${values.join(",")} / ${expectedPools[variant][poolIndex]?.join(",")})`);
      if (String(generated.answer) !== expectedAnswer(variant, values)) fail(`${label}: 정답 ${generated.answer} / 독립 계산 ${expectedAnswer(variant, values)}`);
      if (/[<>]|&lt;|&gt;/.test(String(generated.answer))) fail(`${label}: 정답 데이터에 화면용 HTML이 들어갔습니다.`);
      if (problemSvgs.length !== 1 || answerSvgs.length !== 1) fail(`${label}: 문제·답 SVG 수가 1개가 아닙니다.`);
      if (problemVisible.includes("data-result-highlight") || problemVisible.includes("source61-e6-result-label") || problemVisible.includes("source61-ratio-e6-answer")) fail(`${label}: 문제에 답 표시가 섞였습니다.`);
      const problemValues = attr(problemSvgs[0], "data-source61-ratio-e6-values");
      if (!generated.answerVisual?.includes("source61-ratio-e6-diagram") || !generated.answerVisual.includes("data-result-highlight") || !generated.answerVisual.includes(`data-source61-ratio-e6-values="${problemValues}"`)) fail(`${label}: 답 그림·정답 강조·문제 자료 재현 누락`);
      if (!generated.answerVisual.includes(`data-answer-source="${sourceIds[variant]}"`)) fail(`${label}: 답 source 연결 누락`);
      if (attr(marker, "data-result-contract") !== expectedContract) fail(`${label}: result-contract ${attr(marker, "data-result-contract")} / 기대 ${expectedContract}`);
      if (difficulty === -1 && !generated.prompt.includes('data-step-evidence="guided"')) fail(`${label}: 쉬움 안내 누락`);
      if (difficulty === 0 && generated.prompt.includes("data-step-evidence=")) fail(`${label}: 기준 단계에 난이도 안내가 섞임`);
      if (difficulty === 1 && !generated.prompt.includes('data-step-evidence="independent-reasoning"')) fail(`${label}: 어려움 안내 누락`);
      const allMarkup = `${generated.prompt} ${generated.solution} ${generated.answerVisual}`;
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}|순열|조합|일차식|절댓값/.test(allMarkup)) fail(`${label}: 깨진 값 또는 학년 밖 표현`);
      if (longDecimalTail.test(allMarkup)) fail(`${label}: 긴 소수 꼬리가 표시되었습니다.`);
      if ([1, 5, 6, 7].includes(variant) && (!problemVisible.includes("source61-e6-flow") || !problemVisible.includes('data-not-to-scale="true"'))) fail(`${label}: 소금물 변화의 용기 그림 또는 축척 안내가 없습니다.`);
      if (variant === 4 && (!["평지", "내리막", "오르막", "학교", "공원"].every(text => problemVisible.includes(text)) || !problemVisible.includes("source61-e6-route"))) fail(`${label}: 세 구간 길 그림의 위치·방향 표시가 없습니다.`);
      if (variant === 2 && !generated.answer.includes("가 ") || variant === 2 && !generated.answer.includes("나 ")) fail(`${label}: 두 진하기의 이름·순서가 없습니다.`);
      if (variant === 10 && !problemVisible.includes(`${discountShareText(values[2])}만큼`)) fail(`${label}: 할인 판매 비율을 원문 방식으로 표시하지 않았습니다.`);
      checked += 1;
    }
  }
  if (seenPools.size !== 3) fail(`${sourceIds[variant]}: pool 0·1·2가 모두 출현하지 않음 (${[...seenPools].join(",")})`);
}

function discountShareText(percent) {
  return String(percent / 100);
}

console.log(`비와 비율 E6 독립 감사: ${checked}회, 11유형×3난이도×200회, 각 pool 0·1·2 출현`);
console.log(`검사 대상: ${sourceIds.join(", ")}`);
if (failures.length) {
  console.error(failures.slice(0, 200).join("\n"));
  if (failures.length > 200) console.error(`... ${failures.length - 200}건 더 있음`);
  process.exitCode = 1;
} else {
  console.log("통과: 독립 계산·답 개수·고정 pool·문제/답 같은 그림·원문 수치·단일 정답 회귀 검사");
}
