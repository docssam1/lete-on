"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u5");
const subunit = unit.subunits.find(item => item.types.some(type => type.generatorKey === "lineGraphApplication"));
const types = subunit.types;
const ready = types.filter(type => !type.reviewLocked);
const locked = types.filter(type => type.reviewLocked);
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "4-2-unit-5-line-graph.json"), "utf8"));
const sourceItems = inventory.items.filter(item => item.exploration === 2);
const failures = [];
let generatedCount = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => html.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || "";
const numbers = value => value.split(",").filter(Boolean).map(Number);
const charts = html => html.match(/<svg class="line-chart"[^>]*>[\s\S]*?<\/svg>/g) || [];
const near = (actual, expected, tolerance = .11) => Math.abs(actual - expected) <= tolerance;

check(sourceItems.length === 11, `개념탐구 2 원문 문항은 11개여야 하나 ${sourceItems.length}개입니다.`);
check(sourceItems.filter(item => item.implementationStatus === "ready").length === 8, "개념탐구 2 공개 원문 문항은 8개여야 합니다.");
check(sourceItems.filter(item => item.implementationStatus === "review-locked").length === 2, "개념탐구 2 검수 대기 원문 문항은 2개여야 합니다.");
check(sourceItems.filter(item => item.implementationStatus === "excluded").length === 1, "개념탐구 2 중복 제외 문항은 1개여야 합니다.");
check(types.length === 10, `개념탐구 2 런타임 유형은 10개여야 하나 ${types.length}개입니다.`);
check(ready.length === 8, `개념탐구 2 생성 가능 유형은 8개여야 하나 ${ready.length}개입니다.`);
check(locked.length === 2, `개념탐구 2 검수 대기 유형은 2개여야 하나 ${locked.length}개입니다.`);

for (const item of sourceItems.filter(item => item.implementationStatus !== "excluded")) {
  const type = types.find(candidate => candidate.sourceItemId === item.sourceItemId);
  check(Boolean(type), `${item.sourceItemId}가 분류표에 없습니다.`);
  if (type) check(type.reviewLocked === (item.implementationStatus === "review-locked"), `${item.sourceItemId}의 공개 상태가 다릅니다.`);
}

for (const type of locked) {
  try {
    api.generate(type, 0, 0, 810000 + type.typeNumber, type.variant);
    failures.push(`${type.sourceItemId}: 검수 대기 유형이 생성되었습니다.`);
  } catch (error) {
    check(/검수 대기/.test(error.message), `${type.sourceItemId}: 잠금 오류 문구가 분명하지 않습니다.`);
  }
}

const checkChart = (type, output, evidence) => {
  const svg = charts(output.prompt)[0] || "";
  check(Boolean(svg), `${type.sourceItemId}: 꺾은선그래프가 없습니다.`);
  if (!svg) return;
  const xValues = numbers(attr(evidence, "data-source42-x-values"));
  const chartXValues = numbers(attr(svg, "data-chart-x-values"));
  const chartXDomain = numbers(attr(svg, "data-chart-x-domain"));
  const chartXGridValues = numbers(attr(svg, "data-chart-x-grid-values"));
  const chartXTickValues = numbers(attr(svg, "data-chart-x-tick-values"));
  const step = Number(attr(svg, "data-chart-step"));
  const min = Number(attr(svg, "data-chart-scale-min"));
  const max = Number(attr(svg, "data-chart-scale-max"));
  const gridCount = Number(attr(svg, "data-chart-grid-count"));
  const tickCount = Number(attr(svg, "data-chart-tick-count"));
  const left = Number(attr(svg, "data-chart-left"));
  const plotWidth = Number(attr(svg, "data-chart-plot-width"));
  const lineWeights = attr(svg, "data-chart-line-weights");
  check(xValues.length >= 3 && xValues.every(Number.isFinite), `${type.sourceItemId}: 원문 가로 수치가 없습니다.`);
  check(chartXValues.join(",") === xValues.join(","), `${type.sourceItemId}: SVG 가로 수치가 원자료와 다릅니다.`);
  check(Number.isFinite(step) && gridCount >= 2 && tickCount >= 2 && tickCount <= 12 && near(min + step * (gridCount - 1), max, 1e-8), `${type.sourceItemId}: 세로 눈금 정보가 다릅니다.`);
  const circles = [...svg.matchAll(/<circle class="[^"]*chart-point[^"]*"[^>]*cx="([^"]+)"/g)].map(match => Number(match[1]));
  const seriesCount = attr(svg, "data-chart-values").split(";").filter(Boolean).length;
  check(circles.length === xValues.length * seriesCount, `${type.sourceItemId}: 점 수가 가로 눈금 수와 다릅니다.`);
  const xDomain = chartXDomain.length === 2 ? chartXDomain : [xValues[0], xValues.at(-1)];
  check(xDomain[0] <= xValues[0] && xDomain[1] >= xValues.at(-1), `${type.sourceItemId}: 자료점이 가로축 범위를 벗어납니다.`);
  const xFor = value => left + plotWidth * (value - xDomain[0]) / (xDomain[1] - xDomain[0]);
  circles.forEach((x, index) => check(near(x, xFor(xValues[index % xValues.length])), `${type.sourceItemId}: ${index + 1}번째 점의 가로 좌표가 실제 수치 비율과 다릅니다.`));
  const evidenceWeights = attr(evidence, "data-source42-line-weights");
  if (evidenceWeights) check(lineWeights === evidenceWeights, `${type.sourceItemId}: 자료선 굵기 순서가 다릅니다.`);
  if (type.sourceItemId === "4-2-u5-e2-mission-6") {
    check(chartXDomain.join(",") === "0,25", `${type.sourceItemId}: 원본 가로축 범위가 0~25분이 아닙니다.`);
    check(chartXGridValues.join(",") === attr(evidence, "data-source42-x-grid-values"), `${type.sourceItemId}: 2분 30초 보조 눈금이 원자료와 다릅니다.`);
    check(chartXTickValues.join(",") === attr(evidence, "data-source42-x-tick-values"), `${type.sourceItemId}: 5분 숫자 눈금이 원자료와 다릅니다.`);
    check(step === 20 && min === 0 && max === 400 && gridCount === 21 && tickCount === 5, `${type.sourceItemId}: 20L 보조 눈금과 100L 숫자 눈금이 원자료와 다릅니다.`);
  }
};

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      let output;
      try {
        output = api.generate(type, 0, difficulty, 900000 + seed, type.variant);
      } catch (error) {
        failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      generatedCount += 1;
      const evidence = output.prompt.match(/<span hidden data-source42-line-item="[^"]+"[^>]*>/)?.[0] || "";
      check(attr(evidence, "data-source42-line-item") === type.sourceItemId, `${type.sourceItemId}: 원문 근거 ID가 다릅니다.`);
      checkChart(type, output, evidence);
      const values = numbers(attr(evidence, "data-source42-values"));

      if (type.variant === 1) {
        const target = Number(attr(evidence, "data-source42-target"));
        const period = Number(attr(evidence, "data-source42-period"));
        const fromGa = Number(attr(evidence, "data-source42-from-ga"));
        const fromNa = Number(attr(evidence, "data-source42-from-na"));
        check(target === 150 && period === 40 && fromGa === 10 && fromNa === 10, `${type.sourceItemId}: 왕복 공의 원자료가 다릅니다.`);
        check(output.answer === "나, 10m", `${type.sourceItemId}: 150초 공의 위치 답이 다릅니다.`);
      } else if (type.variant === 2) {
        const firstPrice = Number(attr(evidence, "data-source42-first-price"));
        const changes = numbers(attr(evidence, "data-source42-changes"));
        const prices = numbers(attr(evidence, "data-source42-prices"));
        const independent = [firstPrice];
        changes.forEach(change => independent.push(independent.at(-1) + change / 10));
        check(values.join(",") === "350,500,400,200", `${type.sourceItemId}: TV 판매량이 다릅니다.`);
        check(changes.every(change => change % 10 === 0) && prices.join(",") === independent.join(",") && Number(output.answer) === 85, `${type.sourceItemId}: TV 가격 변화 계산이 다릅니다.`);
      } else if (type.variant === 3) {
        const sameTimes = numbers(attr(evidence, "data-source42-same-times"));
        check(values.join(",") === "0,200,600,600,200,200,200,600", `${type.sourceItemId}: 작은 수조가 가득 찰 때까지 큰 수조의 물이 200L로 유지되지 않습니다.`);
        check(sameTimes.join(",") === "10,50" && output.answer === "10분, 50분", `${type.sourceItemId}: 두 수조가 같은 시각이 다릅니다.`);
      } else if (type.variant === 5) {
        const distances = numbers(attr(evidence, "data-source42-distances"));
        const fuel = numbers(attr(evidence, "data-source42-fuel"));
        check(distances.join(",") === "270,210" && fuel.join(",") === "18,15" && Number(output.answer) === 3, `${type.sourceItemId}: 자동차 연료 차가 다릅니다.`);
      } else if (type.variant === 6) {
        check(Number(attr(evidence, "data-source42-walking-speed")) === 40 && Number(attr(evidence, "data-source42-walk-only-time")) === 30 && Number(output.answer) === 10, `${type.sourceItemId}: 걷기 시간 차가 다릅니다.`);
      } else if (type.variant === 7) {
        const faucets = numbers(attr(evidence, "data-source42-faucets"));
        check(Number(attr(evidence, "data-source42-leak")) === 4 && faucets.join(",") === "28,52" && Number(output.answer) === 540, `${type.sourceItemId}: 욕조 물의 양이 다릅니다.`);
      } else if (type.variant === 8) {
        const rates = numbers(attr(evidence, "data-source42-rates"));
        check(rates.join(",") === "10,8,2" && Number(output.answer) === 60, `${type.sourceItemId}: 수도꼭지 시간 계산이 다릅니다.`);
      } else if (type.variant === 9) {
        const fullTimes = numbers(attr(evidence, "data-source42-full-times"));
        check(fullTimes.join(",") === "12.5,20" && Number(attr(evidence, "data-source42-answer-seconds")) === 450 && Number(output.answer) === 450, `${type.sourceItemId}: 두 그릇의 가득 찬 시각 차가 다릅니다.`);
        check(attr(evidence, "data-source42-line-weights") === "thin,thick", `${type.sourceItemId}: B 얇은선과 A 굵은선 순서가 다릅니다.`);
      } else {
        failures.push(`${type.sourceItemId}: 공개하지 않아야 할 활용 유형입니다.`);
      }
    }
  }
}

if (failures.length) {
  console.error(`4-2 꺾은선그래프 개념탐구 2 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4-2 꺾은선그래프 개념탐구 2 원문 11문항 분류 · 공개 8 · 검수 대기 2 · 중복 제외 1 · ${generatedCount.toLocaleString()}회 독립 검산 통과`);
