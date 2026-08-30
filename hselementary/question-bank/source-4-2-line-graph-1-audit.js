"use strict";

const fs = require("fs");
const path = require("path");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u5");
const subunit = unit.subunits.find(item => item.types.some(type => type.generatorKey === "lineGraphUnderstanding"));
const types = subunit.types;
const ready = types.filter(type => !type.reviewLocked);
const locked = types.filter(type => type.reviewLocked);
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "4-2-unit-5-line-graph.json"), "utf8"));
const sourceItems = inventory.items.filter(item => item.exploration === 1);
const failures = [];
let generatedCount = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (html, name) => html.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || "";
const numbers = value => value.split(",").filter(Boolean).map(Number);
const charts = html => html.match(/<svg class="line-chart"[^>]*>/g) || [];

check(sourceItems.length === 11, `개념탐구 1 원문 문항은 11개여야 하나 ${sourceItems.length}개입니다.`);
check(new Set(sourceItems.map(item => item.sourceItemId)).size === 11, "개념탐구 1 원문 문항 ID가 겹칩니다.");
check(sourceItems.filter(item => item.implementationStatus === "ready").length === 10, "개념탐구 1 공개 원문 문항은 10개여야 합니다.");
check(sourceItems.filter(item => item.implementationStatus === "review-locked").length === 0, "개념탐구 1에는 검수 대기 문항이 없어야 합니다.");
check(sourceItems.filter(item => item.implementationStatus === "excluded").length === 1, "개념탐구 1 중복 제외 문항은 1개여야 합니다.");
check(types.length === 10, `개념탐구 1 런타임 유형은 중복 1개를 제외한 10개여야 하나 ${types.length}개입니다.`);
check(ready.length === 10, `생성 가능 유형은 10개여야 하나 ${ready.length}개입니다.`);
check(locked.length === 0, `검수 대기 유형은 0개여야 하나 ${locked.length}개입니다.`);
check(new Set(types.map(type => type.sourceItemId)).size === 10, "런타임 원문 ID가 겹칩니다.");

for (const item of sourceItems.filter(item => item.implementationStatus !== "excluded")) {
  const type = types.find(candidate => candidate.sourceItemId === item.sourceItemId);
  check(Boolean(type), `${item.sourceItemId}가 분류표에 없습니다.`);
  if (!type) continue;
  check(type.sourcePdfPage === item.sourcePdfPage && type.sourcePrintedPage === item.sourcePrintedPage, `${item.sourceItemId}의 쪽수가 다릅니다.`);
  check(type.reviewLocked === (item.implementationStatus === "review-locked"), `${item.sourceItemId}의 공개 상태가 다릅니다.`);
}

for (const type of locked) {
  try {
    api.generate(type, 0, 0, 420000 + type.typeNumber, type.variant);
    failures.push(`${type.sourceItemId}는 검수 대기인데 직접 생성되었습니다.`);
  } catch (error) {
    check(/검수 대기/.test(error.message), `${type.sourceItemId} 잠금 오류 문구가 분명하지 않습니다: ${error.message}`);
  }
}

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 500; seed += 1) {
      let output;
      try {
        output = api.generate(type, 0, difficulty, 520000 + seed, type.variant);
      } catch (error) {
        failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      generatedCount += 1;
      const evidence = output.prompt.match(/<span hidden data-source42-line-item="[^"]+"[^>]*>/)?.[0] || "";
      check(attr(evidence, "data-source42-line-item") === type.sourceItemId, `${type.sourceItemId}: 원문 근거 ID가 다릅니다.`);
      const values = numbers(attr(evidence, "data-source42-values"));
      check(values.length >= 4 && values.every(Number.isFinite), `${type.sourceItemId}: 원자료 값이 없습니다.`);

      for (const svg of charts(output.prompt)) {
        const step = Number(attr(svg, "data-chart-step"));
        const scaleMin = Number(attr(svg, "data-chart-scale-min"));
        const scaleMax = Number(attr(svg, "data-chart-scale-max"));
        const gridCount = Number(attr(svg, "data-chart-grid-count"));
        const tickCount = Number(attr(svg, "data-chart-tick-count"));
        const graphValues = attr(svg, "data-chart-values").split(";").flatMap(numbers);
        check(gridCount >= 2 && tickCount >= 2 && tickCount <= 12, `${type.sourceItemId}: 세로 눈금 글자 수가 ${tickCount}개입니다.`);
        check(Math.abs(scaleMin + step * (gridCount - 1) - scaleMax) < 1e-9, `${type.sourceItemId}: 세로축 범위와 격자 수가 다릅니다.`);
        check(graphValues.every(value => Math.abs((value - scaleMin) / step - Math.round((value - scaleMin) / step)) < 1e-9), `${type.sourceItemId}: 점이 눈금과 맞지 않습니다.`);
        check((output.prompt.match(/class="chart-tick"/g) || []).length >= tickCount, `${type.sourceItemId}: 눈금 글자가 빠졌습니다.`);
      }

      if (type.variant === 0) {
        check(output.answer === values.join(", "), `${type.sourceItemId}: 네 번 되풀이한 값의 답이 다릅니다.`);
        check(values.every((value, index) => index === 0 || value - values[index - 1] === Number(attr(evidence, "data-source42-net"))), `${type.sourceItemId}: 한 차례 변화량이 일정하지 않습니다.`);
      } else if (type.variant === 1) {
        const total = Number(attr(evidence, "data-source42-total"));
        const hidden = Number(attr(evidence, "data-source42-hidden"));
        check(Number(output.answer) === total - values.filter((_, index) => index !== hidden).reduce((sum, value) => sum + value, 0), `${type.sourceItemId}: 가려진 달의 값이 다릅니다.`);
      } else if (type.variant === 2) {
        const start = Number(attr(evidence, "data-source42-start"));
        const changes = numbers(attr(evidence, "data-source42-changes"));
        check(Number(output.answer) === start + changes.reduce((sum, value) => sum + value, 0), `${type.sourceItemId}: 붙임딱지 수가 다릅니다.`);
      } else if (type.variant === 3) {
        check(Number(output.answer) === values[values.length - 1], `${type.sourceItemId}: 9월 입장객 수가 다릅니다.`);
      } else if (type.variant === 4) {
        const wins = numbers(attr(evidence, "data-source42-wins"));
        check(output.answer === ["가", "나", "다"].map((label, index) => `${label} ${wins[index] * 1000}만원`).join(", "), `${type.sourceItemId}: 해마다 생산량 증가 비교가 다릅니다.`);
      } else if (type.variant === 5) {
        const hidden = numbers(attr(evidence, "data-source42-hidden"));
        check(output.answer === hidden.map(index => values[index]).join(", "), `${type.sourceItemId}: 금·토·일의 값이 다릅니다.`);
        check(values.reduce((sum, value) => sum + value, 0) === Number(attr(evidence, "data-source42-total")), `${type.sourceItemId}: 한 주 합이 다릅니다.`);
      } else if (type.variant === 6) {
        const price = Number(attr(evidence, "data-source42-price"));
        check(Number(output.answer) === values[5] * price, `${type.sourceItemId}: 나 장난감 판매 금액이 다릅니다.`);
      } else if (type.variant === 7) {
        const targetLabel = attr(evidence, "data-source42-target");
        const target = ["2013", "2014", "2015", "2016", "2017"].indexOf(targetLabel);
        const tourists = values.slice(0, 5);
        const revenue = values.slice(5);
        const candidates = tourists.map((_, index) => index).filter(index => index > 0 && tourists[index] > tourists[index - 1] && revenue[index] < revenue[index - 1]);
        check(candidates.length === 1 && candidates[0] === target, `${type.sourceItemId}: 조건을 만족하는 해가 하나가 아닙니다.`);
        check(targetLabel === "2016", `${type.sourceItemId}: 원문에서 조건을 만족하는 2016년과 다릅니다.`);
        check(Number(output.answer) === 40, `${type.sourceItemId}: 원문 감소액 40만 달러와 다릅니다.`);
        check(Number(output.answer) === revenue[target - 1] - revenue[target], `${type.sourceItemId}: 관광 수입 감소액이 다릅니다.`);
      } else if (type.variant === 8) {
        check(Number(output.answer) === 2 + Number(attr(evidence, "data-source42-slower-days")), `${type.sourceItemId}: 연습 시간이 다릅니다.`);
      } else if (type.variant === 9) {
        const xValues = numbers(attr(evidence, "data-source42-x-values"));
        const september = numbers(attr(evidence, "data-source42-september"));
        const prices = numbers(attr(evidence, "data-source42-prices"));
        check(xValues.join(",") === "6,8,10,12", `${type.sourceItemId}: 실제 월 눈금이 다릅니다.`);
        check(september.join(",") === "320,230", `${type.sourceItemId}: 9월 보간값이 다릅니다.`);
        check(prices.join(",") === "700,600", `${type.sourceItemId}: 가격이 다릅니다.`);
        check(Number(output.answer) === september[0] * prices[0] - september[1] * prices[1] && Number(output.answer) === 86000, `${type.sourceItemId}: 9월 판매 금액 차가 다릅니다.`);
        check(attr(evidence, "data-source42-line-weights") === "thick,thin", `${type.sourceItemId}: 굵은선·얇은선 구분이 없습니다.`);
        const svg = charts(output.prompt)[0] || "";
        check(attr(svg, "data-chart-x-values") === "6,8,10,12", `${type.sourceItemId}: SVG 실제 가로 눈금이 없습니다.`);
        check(attr(svg, "data-chart-line-weights") === "thick,thin", `${type.sourceItemId}: SVG 선 굵기 정보가 없습니다.`);
      }
    }
  }
}

if (failures.length) {
  console.error(`4-2 꺾은선그래프 개념탐구 1 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 50).join("\n"));
  process.exit(1);
}

console.log(`4-2 꺾은선그래프 개념탐구 1 원문 11문항 분류 · 공개 10 · 검수 대기 0 · 중복 제외 1 · ${generatedCount.toLocaleString()}회 독립 검산 통과`);
