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
const lineGraphTypes = [
  { id: "4-2-u5-t1", name: "꺾은선그래프의 이해", semesterId: "4-2", unitId: "4-2-u5", unitName: "꺾은선그래프" },
  { id: "4-2-u5-t2", name: "꺾은선그래프의 활용", semesterId: "4-2", unitId: "4-2-u5", unitName: "꺾은선그래프" }
];

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
        generated = api.generate(type, 0, difficulty, seed, seed);
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
        generated = api.generate(type, 0, difficulty, seed, seed);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      const svg = generated.prompt.match(/<svg class="line-chart"[^>]*>/)?.[0];
      check(Boolean(svg), `${type.id} / 시드 ${seed}: 꺾은선그래프 SVG가 없습니다.`);
      if (!svg) continue;

      const step = Number(attribute(svg, "data-chart-step"));
      const scaleMax = Number(attribute(svg, "data-chart-scale-max"));
      const tickCount = Number(attribute(svg, "data-chart-tick-count"));
      const unit = attribute(svg, "data-chart-unit");
      const values = (attribute(svg, "data-chart-values") || "").split(";").flatMap(numberList);
      check(values.length > 0 && values.every(value => Number.isInteger(value / step)), `${type.id} / 시드 ${seed}: 눈금 단위와 값이 맞지 않습니다.`);
      check(tickCount >= 2 && tickCount <= 10, `${type.id} / 시드 ${seed}: 눈금 수 ${tickCount}개가 허용 범위를 벗어났습니다.`);
      check(scaleMax === step * (tickCount - 1), `${type.id} / 시드 ${seed}: 눈금 최대값이 일치하지 않습니다.`);
      check(generated.prompt.includes(`세로 눈금 한 칸은 ${step}${unit}입니다.`), `${type.id} / 시드 ${seed}: 눈금 한 칸 안내가 없습니다.`);

      const tickLabels = generated.prompt.match(/class="chart-tick"/g)?.length || 0;
      const gridLines = generated.prompt.match(/class="chart-grid"/g)?.length || 0;
      check(tickLabels === tickCount && gridLines >= tickCount, `${type.id} / 시드 ${seed}: 눈금 글자 또는 격자선이 빠졌습니다.`);

      const top = Number(attribute(svg, "data-chart-top"));
      const plotHeight = Number(attribute(svg, "data-chart-plot-height"));
      const points = generated.prompt.match(/<circle class="chart-point chart-line-\d"[^>]*>/g) || [];
      check(points.length === values.length, `${type.id} / 시드 ${seed}: 꺾은선의 점 수가 원자료와 다릅니다.`);
      for (const point of points) {
        const value = Number(attribute(point, "data-chart-value"));
        const y = Number(attribute(point, "cy"));
        const recovered = Math.round(((top + plotHeight - y) / plotHeight * scaleMax) / step) * step;
        check(recovered === value, `${type.id} / 시드 ${seed}: 렌더 좌표 ${recovered}와 원자료 ${value}가 다릅니다.`);
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
