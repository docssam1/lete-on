"use strict";

// Regression check for readable, numerically faithful graph generators.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester41 = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-1");
const barGraphUnit = semester41.units.find(unit => unit.id === "4-1-u5");
const barGraphTypes = barGraphUnit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester41.id,
  unitId: barGraphUnit.id,
  unitName: barGraphUnit.name,
  subunitName: subunit.name
})));
const semester42 = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2");
const lineGraphUnit = semester42.units.find(unit => unit.id === "4-2-u5");
const lineGraphTypes = lineGraphUnit.subunits.flatMap(subunit => subunit.types.filter(type => !type.reviewLocked).map(type => ({
  ...type,
  semesterId: semester42.id,
  unitId: lineGraphUnit.id,
  unitName: lineGraphUnit.name,
  subunitName: subunit.name
})));
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const numberList = value => (value || "").split(",").filter(Boolean).map(Number);
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const type of barGraphTypes) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 450; seed += 1) {
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      const svg = generated.prompt.match(/<svg class="bar-chart"[^>]*>/)?.[0];
      check(Boolean(svg), `${type.id} / 시드 ${seed}: 막대그래프 SVG가 없습니다.`);
      if (!svg) continue;

      const step = Number(attribute(svg, "data-chart-step"));
      const scaleMax = Number(attribute(svg, "data-chart-scale-max"));
      const tickCount = Number(attribute(svg, "data-chart-tick-count"));
      const unit = attribute(svg, "data-chart-unit");
      const values = numberList(attribute(svg, "data-chart-values")).concat(numberList(attribute(svg, "data-chart-second-values")));
      check(values.length > 0 && values.every(value => Number.isInteger(value / step)), `${type.id} / 시드 ${seed}: 눈금 단위와 값이 맞지 않습니다.`);
      check(tickCount >= 2 && tickCount <= 10, `${type.id} / 시드 ${seed}: 눈금 수 ${tickCount}개가 허용 범위를 벗어났습니다.`);
      check(scaleMax === step * (tickCount - 1), `${type.id} / 시드 ${seed}: 눈금 최대값이 일치하지 않습니다.`);
      check(generated.prompt.includes(`세로 눈금 한 칸은 ${step}${unit}입니다.`), `${type.id} / 시드 ${seed}: 눈금 한 칸 안내가 없습니다.`);

      const tickLabels = generated.prompt.match(/class="chart-tick"/g)?.length || 0;
      const gridLines = generated.prompt.match(/class="chart-grid"/g)?.length || 0;
      check(tickLabels === tickCount && gridLines === tickCount, `${type.id} / 시드 ${seed}: 눈금 글자 또는 격자선이 빠졌습니다.`);

      const top = Number(attribute(svg, "data-chart-top"));
      const plotHeight = Number(attribute(svg, "data-chart-plot-height"));
      const bars = generated.prompt.match(/<rect class="chart-bar(?: chart-bar-secondary)?"[^>]*>/g) || [];
      for (const bar of bars) {
        const value = Number(attribute(bar, "data-chart-value"));
        const y = Number(attribute(bar, "y"));
        const recovered = Math.round(((top + plotHeight - y) / plotHeight * scaleMax) / step) * step;
        check(recovered === value, `${type.id} / 시드 ${seed}: 렌더 좌표 ${recovered}와 원자료 ${value}가 다릅니다.`);
      }
    }
  }
}

for (const type of lineGraphTypes) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 450; seed += 1) {
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      const svgBlocks = generated.prompt.match(/<svg class="line-chart"[\s\S]*?<\/svg>/g) || [];
      check(svgBlocks.length > 0, `${type.id} / 시드 ${seed}: 꺾은선그래프 SVG가 없습니다.`);
      if (!svgBlocks.length) continue;
      check(generated.prompt.includes(`data-source42-line-item="${type.sourceItemId}"`), `${type.id} / 시드 ${seed}: 세부 유형과 원문 ID가 다릅니다.`);

      for (const svg of svgBlocks) {
        const step = Number(attribute(svg, "data-chart-step"));
        const scaleMin = Number(attribute(svg, "data-chart-scale-min"));
        const scaleMax = Number(attribute(svg, "data-chart-scale-max"));
        const tickCount = Number(attribute(svg, "data-chart-tick-count"));
        const unit = attribute(svg, "data-chart-unit");
        const values = (attribute(svg, "data-chart-values") || "").split(";").flatMap(numberList);
        check(values.length > 0 && values.every(value => Math.abs((value - scaleMin) / step - Math.round((value - scaleMin) / step)) < 1e-9), `${type.id} / 시드 ${seed}: 눈금 단위와 값이 맞지 않습니다.`);
        check(tickCount >= 2 && tickCount <= 12, `${type.id} / 시드 ${seed}: 눈금 수 ${tickCount}개가 허용 범위를 벗어났습니다.`);
        check(Math.abs(scaleMax - (scaleMin + step * (tickCount - 1))) < 1e-9, `${type.id} / 시드 ${seed}: 눈금 최대값이 일치하지 않습니다.`);
        check(generated.prompt.includes(`세로 눈금 한 칸은 ${step}${unit}입니다.`), `${type.id} / 시드 ${seed}: 눈금 한 칸 안내가 없습니다.`);

        const tickLabels = svg.match(/class="chart-tick"/g)?.length || 0;
        const gridLines = svg.match(/class="chart-grid"/g)?.length || 0;
        check(tickLabels === tickCount && gridLines >= tickCount, `${type.id} / 시드 ${seed}: 눈금 글자 또는 격자선이 빠졌습니다.`);

        const top = Number(attribute(svg, "data-chart-top"));
        const plotHeight = Number(attribute(svg, "data-chart-plot-height"));
        const points = svg.match(/<circle class="chart-point chart-line-\d"[^>]*>/g) || [];
        const hiddenCount = (attribute(svg, "data-chart-hidden") || "").split(";").flatMap(numberList).length;
        check(points.length === values.length - hiddenCount, `${type.id} / 시드 ${seed}: 보이는 점 수가 원자료와 다릅니다.`);
        for (const point of points) {
          const value = Number(attribute(point, "data-chart-value"));
          const y = Number(attribute(point, "cy"));
          const rawRecovered = scaleMin + (top + plotHeight - y) / plotHeight * (scaleMax - scaleMin);
          const recovered = scaleMin + Math.round((rawRecovered - scaleMin) / step) * step;
          check(Math.abs(recovered - value) < 1e-9, `${type.id} / 시드 ${seed}: 렌더 좌표 ${recovered}와 원자료 ${value}가 다릅니다.`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`그래프 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log(`그래프 감사 통과: 막대그래프 ${barGraphTypes.length}유형·꺾은선그래프 ${lineGraphTypes.length}유형, ${(barGraphTypes.length + lineGraphTypes.length) * 3 * 450}개 생성`);
