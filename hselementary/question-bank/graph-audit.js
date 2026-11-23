"use strict";

// 2026-11-23 감사 정비: 지금 앱은 index.html 순서로 원문 풀·유사문항 래퍼를 generators.js 위에 덧씌워 문제를 만든다.
// generators.js만으로는 만들 수 없게 된 유형은 앱과 같은 순서로 불러온 생성 경로에서 빈 값·깨진 값을 확인하고,
// 이 감사의 세부 검산은 지금도 generators.js의 같은 생성기를 쓰는 유형에만 적용한다.
function loadAppGenerators() {
  const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1].replace(/^\.\//, "").replace(/\?.*$/, ""))
    .filter(file => !["app.js", "bank-access.js"].includes(file));
  const context = { console };
  context.window = context;
  vm.createContext(context);
  for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context, { filename: file });
  return context;
}
function appTypesOf(appContext, unitId) {
  return appContext.HSE_CURRICULUM.semesters.flatMap(semester => semester.units).filter(unit => unit.id === unitId)
    .flatMap(unit => unit.subunits.flatMap(subunit => subunit.types));
}
function usesLegacyGenerator(bareApi, appApi, type) {
  const key = bareApi.generatorKey(type);
  return Boolean(key) && appApi.generatorKey(type) === key && Boolean(bareApi.generate(type, 0, 0, 1, type.variant ?? 0));
}
function appVariants(type) {
  return type.generationMode === "fixed-verified-pool"
    ? Array.from({ length: Math.max(1, Number(type.verifiedVariantCount) || 0) }, (_, index) => index)
    : [type.variant ?? 0];
}
function checkAppGenerated(appApi, type, difficulty, seed, variant) {
  const generated = appApi.generate(type, 0, difficulty, seed, variant);
  if (!generated || typeof generated.prompt !== "string" || !generated.prompt.trim() || generated.answer === undefined || generated.answer === null
    || String(generated.answer) === "" || !generated.solution) throw new Error("앱 생성 경로: 문제·정답·풀이 중 빠진 값이 있습니다.");
  if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("앱 생성 경로: 계산값이 깨졌습니다.");
  return generated;
}
function auditAppTypes(appApi, types, failures, seeds = 20) {
  let count = 0;
  for (const type of types) for (const variant of appVariants(type)) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= seeds; seed += 1) {
    try { checkAppGenerated(appApi, type, difficulty, seed, variant); count += 1; }
    catch (error) { failures.push(`${type.id} / 앱 경로 / 변형 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`); }
  }
  return count;
}

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
const appContext = loadAppGenerators();
const appApi = appContext.HSE_GENERATORS;
const appGraphTypes = [...appTypesOf(appContext, barGraphUnit.id), ...appTypesOf(appContext, lineGraphUnit.id).filter(type => !type.reviewLocked)];
const appTypeById = new Map(appGraphTypes.map(type => [type.id, type]));
const keepLegacy = type => appTypeById.has(type.id) && usesLegacyGenerator(api, appApi, appTypeById.get(type.id));
const asAppType = type => ({ ...type, ...appTypeById.get(type.id) }); // 앱 공개 등록이 고친 유형 속성(변형 번호 등)을 쓴다.
// 같은 생성기 이름이라도 2026-11 이후 원문 구조 그래프(source41-bar-graph 등)를 만드는 유형이 많다. 예전 그래프 SVG를 만드는 유형만 세부 검산한다.
const drawsLegacyChart = (type, pattern) => pattern.test(api.generate(type, 0, 0, 1, type.variant)?.prompt || "");
const legacyBarGraphTypes = barGraphTypes.filter(keepLegacy).map(asAppType).filter(type => drawsLegacyChart(type, /<svg class="bar-chart"/));
const legacyLineGraphTypes = lineGraphTypes.filter(keepLegacy).map(asAppType).filter(type => drawsLegacyChart(type, /<svg class="line-chart"/));
const legacyIds = new Set([...legacyBarGraphTypes, ...legacyLineGraphTypes].map(type => type.id));
const appOnlyTypes = appGraphTypes.filter(type => !legacyIds.has(type.id));
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const numberList = value => (value || "").split(",").filter(Boolean).map(Number);
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const type of legacyBarGraphTypes) {
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

for (const type of legacyLineGraphTypes) {
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
        const gridCount = Number(attribute(svg, "data-chart-grid-count"));
        const tickCount = Number(attribute(svg, "data-chart-tick-count"));
        const unit = attribute(svg, "data-chart-unit");
        const values = (attribute(svg, "data-chart-values") || "").split(";").flatMap(numberList);
        check(values.length > 0 && values.every(value => Math.abs((value - scaleMin) / step - Math.round((value - scaleMin) / step)) < 1e-9), `${type.id} / 시드 ${seed}: 눈금 단위와 값이 맞지 않습니다.`);
        check(gridCount >= 2 && tickCount >= 2 && tickCount <= 12, `${type.id} / 시드 ${seed}: 눈금 글자 수 ${tickCount}개가 허용 범위를 벗어났습니다.`);
        check(Math.abs(scaleMax - (scaleMin + step * (gridCount - 1))) < 1e-9, `${type.id} / 시드 ${seed}: 눈금 최대값이 일치하지 않습니다.`);
        check(generated.prompt.includes(`세로 눈금 한 칸은 ${step}${unit}입니다.`), `${type.id} / 시드 ${seed}: 눈금 한 칸 안내가 없습니다.`);

        const tickLabels = svg.match(/class="chart-tick"/g)?.length || 0;
        const gridLines = svg.match(/class="chart-grid"/g)?.length || 0;
        check(tickLabels === tickCount && gridLines >= gridCount, `${type.id} / 시드 ${seed}: 눈금 글자 또는 격자선이 빠졌습니다.`);

        const top = Number(attribute(svg, "data-chart-top"));
        const plotHeight = Number(attribute(svg, "data-chart-plot-height"));
        const points = svg.match(/<circle class="chart-point chart-line-\d[^\"]*"[^>]*>/g) || [];
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

const appCount = auditAppTypes(appApi, appOnlyTypes, failures);
if (failures.length) {
  console.error(`그래프 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log(`그래프 감사 통과: generators.js 생성기 막대그래프 ${legacyBarGraphTypes.length}유형·꺾은선그래프 ${legacyLineGraphTypes.length}유형, ${(legacyBarGraphTypes.length + legacyLineGraphTypes.length) * 3 * 450}개 검산 · 앱 래퍼 ${appOnlyTypes.length}유형 ${appCount}개 생성 확인`);
