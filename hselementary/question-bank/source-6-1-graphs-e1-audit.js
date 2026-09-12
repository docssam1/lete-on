"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./generators.js");
require("./source-inventory-grade6.js");

const api = window.HSE_GENERATORS;
const catalog = window.HSE_SOURCE_INVENTORY_GRADE6;
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-1-u5-source-readiness-review.json"), "utf8"));
const failures = [];
const sourceIds = [
  "6-1-u5-e1-example-1", "6-1-u5-e1-example-2", "6-1-u5-e1-example-3",
  "6-1-u5-e1-mission-1", "6-1-u5-e1-mission-2", "6-1-u5-e1-mission-3",
  "6-1-u5-e1-mission-4", "6-1-u5-e1-mission-5", "6-1-u5-e1-mission-6"
];
const denominationContracts = [
  "1000,100", "100,10,1", "1000,100", "100,50,10,1", "100,10",
  "10000,1000,100", "10000,1000", "10000,1000", "1000,100"
];
const layoutContracts = [
  "row-table", "four-area", "three-region", "paired-grade", "row-table",
  "factory-columns", "district-map", "inline-symbols", "row-table"
];
const shapeContracts = [
  "bag,bag", "leaf,leaf,leaf", "face,face", "diamond,diamond,diamond,diamond", "face,face",
  "pencil,pencil,pencil", "face,face", "square,circle", "face,face"
];
const valuesFrom = html => {
  const match = String(html).match(/data-source61-graphs-e1-kind="[^"]+"[^>]*data-values="([^"]*)"/);
  if (!match) throw new Error("고정 자료의 독립 값 속성이 없습니다.");
  return match[1].split(",").map(Number);
};
const plain = value => String(value).replace(/,/g, "").replace(/\s/g, "");
const answerFor = (variant, values) => {
  if (variant === 3) return `라${((values[0] + values[1] + values[2]) / 3 + values[3])}가마`;
  if (variant === 4) return `${["가", "나", "다", "라"][values.slice(0, 4).indexOf(Math.min(...values.slice(0, 4)))]}${Math.min(...values.slice(0, 4)) + values[4] * 4}kg`;
  if (variant === 5) return `${values.reduce((sum, value) => sum + value + 49, 0)}명`;
  if (variant === 6) {
    const second = (values[0] + values[1] + values[2]) / 3;
    const fifth = (second + values[1] + values[3]) / 3;
    return `2학년${second}명,5학년${fifth}명`;
  }
  if (variant === 7) {
    const pairSum = values[0] * 4 - values[1] - values[2];
    const second = (pairSum - values[3]) / 2;
    return `나${second}명,다${second + values[3]}명`;
  }
  if (variant === 8) {
    const rates = values.slice(0, 5).map((value, index) => value / values[index + 5]);
    return `${Math.max(...rates) - Math.min(...rates)}자루`;
  }
  if (variant === 9) {
    const difference = Math.max(...values) - Math.min(...values);
    const average = values.reduce((sum, value) => sum + value, 0) / 4;
    return `(1)${difference}명,(2)${average}명`;
  }
  if (variant === 10) return `${values[0] + 499 - (values[1] - 500)}명`;
  if (variant === 11) return `${values.slice(0, 4).reduce((sum, value) => sum + value, 0) * (100 - values[5]) / 100 / 4}명`;
  throw new Error(`지원하지 않는 variant ${variant}`);
};

const openSourceIds = [
  "6-1-u5-e1-exploration-1-1",
  "6-1-u5-e1-exploration-1-2",
  "6-1-u5-e1-exploration-2"
];
openSourceIds.forEach(sourceItemId => {
  if (api.generatorKey({ sourceItemId, reviewLocked: true }) !== "") failures.push(`${sourceItemId}: 열린 활동이 생성 경로를 가집니다.`);
  const catalogItem = catalog.items.find(item => item.sourceItemId === sourceItemId);
  if (!catalogItem || catalogItem.generationMode !== "review-locked" || catalogItem.verifiedVariantTarget !== 0 || catalogItem.verifiedVariantCount !== 0) failures.push(`${sourceItemId}: 열린 활동의 잠금 계약이 다릅니다.`);
});

const readinessById = new Map(readiness.items.map(item => [item.sourceItemId, item]));
const sourceChecks = [
  ["6-1-u5-e1-example-1", item => item.conditions?.includes("가2300가마, 나3000가마, 다3100가마") && item.independentAnswer === "3200가마; 라는 큰 그림3개와 작은 그림2개"],
  ["6-1-u5-e1-example-2", item => item.conditions?.includes("가241kg, 나215kg, 다323kg, 라246kg") && item.originalStructure?.includes("이튿날") && item.independentAnswer === "나 동네, 223kg"],
  ["6-1-u5-e1-mission-2", item => item.independentCalculation?.includes("다-나=110명") && item.independentAnswer === "나220명, 다330명"],
  ["6-1-u5-e1-mission-4", item => item.independentAnswer === "(1) 20000명 (2) 27750명"],
  ["6-1-u5-e1-mission-6", item => item.conditions?.includes("A2800명, B5200명, C2400명, D3800명") && item.independentAnswer === "3195명"]
];
sourceChecks.forEach(([sourceItemId, check]) => {
  const item = readinessById.get(sourceItemId);
  if (!item || !check(item)) failures.push(`${sourceItemId}: 원본 수치·물음·독립 답 기록이 다릅니다.`);
});

let generatedCount = 0;
for (let variant = 3; variant <= 11; variant += 1) {
  const pools = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 200; seed += 1) {
    const type = { sourceItemId: sourceIds[variant - 3], generatorKey: "sourceGrade6GraphsE1", reviewLocked: false, variant };
    let generated;
    try {
      generated = api.generate(type, 0, difficulty, seed + variant * 100000, variant);
      generatedCount += 1;
    } catch (error) {
      failures.push(`${sourceIds[variant - 3]} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      continue;
    }
    pools.add(generated.verifiedPoolIndex);
    try {
      const problemValues = valuesFrom(generated.prompt);
      const answerValues = valuesFrom(generated.answerVisual);
      if (problemValues.join(",") !== answerValues.join(",")) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 문제·답 data-values가 다릅니다.`);
      if (/data-result-highlight=/.test(generated.prompt)) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 문제 그림에 정답 강조가 있습니다.`);
      if (!/data-result-highlight=/.test(generated.answerVisual)) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 답 그림의 정답 강조가 없습니다.`);
      if (!generated.answerVisual || !/source61-graphs-e1-answer/.test(generated.answerVisual)) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 답 그림이 없습니다.`);
      if (!/data-symbol-denominations="[^"]+"/.test(generated.prompt) || !/data-symbol-value="[^"]+"/.test(generated.prompt)) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 큰·중간·작은 기호의 값과 범례가 없습니다.`);
      const denominations = generated.prompt.match(/data-symbol-denominations="([^"]+)"/)?.[1];
      if (denominations !== denominationContracts[variant - 3]) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 원본 범례가 다릅니다 (${denominations}/${denominationContracts[variant - 3]}).`);
      const layout = generated.prompt.match(/data-source61-graphs-e1-layout="([^"]+)"/)?.[1];
      if (layout !== layoutContracts[variant - 3]) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 원본 그림 배치가 다릅니다 (${layout}/${layoutContracts[variant - 3]}).`);
      const shapes = generated.prompt.match(/data-symbol-shapes="([^"]+)"/)?.[1];
      if (shapes !== shapeContracts[variant - 3]) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 원본 그림 기호가 다릅니다 (${shapes}/${shapeContracts[variant - 3]}).`);
      if (plain(generated.answer).replace(/[()·]/g, "") !== plain(answerFor(variant, problemValues)).replace(/[()·]/g, "")) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 독립 계산 답과 공개 답이 다릅니다 (${generated.answer} / ${answerFor(variant, problemValues)}).`);
      if (variant === 3 && generated.verifiedPoolIndex === 0 && problemValues.join(",") !== "2300,3000,3100,400") failures.push(`${sourceIds[variant - 3]}: 원본 pool 값이 다릅니다.`);
      if (variant === 4 && (!generated.prompt.includes("이튿날") || generated.prompt.includes("이틀 동안"))) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 원문의 '이튿날' 물음이 바뀌었습니다.`);
      if (variant === 4) {
        const labels = ["가", "나", "다", "라"];
        const leastIndex = problemValues.slice(0, 4).indexOf(Math.min(...problemValues.slice(0, 4)));
        if (!generated.solution.includes(`가장 적은 ${labels[leastIndex]} 동네`)) failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 풀이의 동네 이름이 자료와 다릅니다.`);
      }
      if (variant === 11 && generated.verifiedPoolIndex === 0 && problemValues.join(",") !== "2800,5200,2400,3800,30,10") failures.push(`${sourceIds[variant - 3]}: 원본 그림그래프의 동별 인구가 다릅니다.`);
    } catch (error) {
      failures.push(`${sourceIds[variant - 3]} / 시드 ${seed}: 자료 검사 실패 ${error.message}`);
    }
  }
  if (![0, 1, 2].every(index => pools.has(index))) failures.push(`${sourceIds[variant - 3]}: 고정 pool 0/1/2가 모두 출현하지 않았습니다 (${[...pools].join(",")}).`);
}

if (failures.length) {
  console.error(`여러 가지 그래프 E1 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 50).join("\n"));
  process.exit(1);
}
console.log(`여러 가지 그래프 E1 독립 감사 통과: 공개 9유형 × 3난이도 × 200회 = ${generatedCount.toLocaleString()}회, 각 유형 pool 0/1/2 출현, 독립 답·문제/답 자료 계약 확인`);
