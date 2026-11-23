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

// Regression checks for 4-2 unit 6 drawings and answers.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u6");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));
const appContext = loadAppGenerators();
const appApi = appContext.HSE_GENERATORS;
const appTypeById = new Map(appTypesOf(appContext, unit.id).map(type => [type.id, type]));
const legacyTypes = types.filter(type => appTypeById.has(type.id) && usesLegacyGenerator(api, appApi, appTypeById.get(type.id)))
  .map(type => ({ ...type, ...appTypeById.get(type.id) })); // 앱 공개 등록이 고친 유형 속성(변형 번호 등)을 쓴다.
const legacyIds = new Set(legacyTypes.map(type => type.id));
const appOnlyTypes = [...appTypeById.values()].filter(type => !legacyIds.has(type.id));

const attribute = (tag, name) => tag.match(new RegExp("\\b" + name + "=\"([^\"]*)\""))?.[1];
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const normalize = cells => {
  const minX = Math.min(...cells.map(cell => cell[0]));
  const minY = Math.min(...cells.map(cell => cell[1]));
  return cells.map(cell => [cell[0] - minX, cell[1] - minY]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
const key = cells => normalize(cells).map(cell => cell.join(",")).join(";");
const rotations = cells => {
  const result = new Map();
  let current = cells;
  for (let index = 0; index < 4; index += 1) {
    current = normalize(current);
    result.set(key(current), current);
    current = current.map(cell => [cell[1], -cell[0]]);
  }
  return [...result.values()];
};
const placements = (rows, cols, cells) => rotations(cells).reduce((total, shape) => {
  const width = Math.max(...shape.map(cell => cell[0])) + 1;
  const height = Math.max(...shape.map(cell => cell[1])) + 1;
  return total + Math.max(0, cols - width + 1) * Math.max(0, rows - height + 1);
}, 0);

let generatedCount = 0;
let sourceDiagramCount = 0;
// 2026-11 이후 이 단원 생성기들은 같은 이름으로 원문 구조 문항(source42-* 그림)을 만든다. 예전 그림·문장이 나온 문항만 예전 방식으로 검산하고,
// 원문 구조 문항은 그림 설명(role·aria-label)이 있는지만 본다(원문 구조 문항의 정답은 각 원문 감사가 따로 검산한다).
const sourceDiagram = (generated, context) => {
  check(/<svg\b[^>]*(?:role="img"|aria-label="[^"]+")/.test(generated.prompt) || !/<svg\b/.test(generated.prompt), context + ": 원문 구조 그림의 설명이 없습니다.");
  sourceDiagramCount += 1;
};
for (const type of legacyTypes) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed % 9);
      const context = type.id + " / 난이도 " + difficulty + " / 시드 " + seed;
      check(generated && generated.answer && generated.solution, context + ": 결과가 비어 있습니다.");
      check(!/NaN|undefined/.test(generated.prompt + generated.answer + generated.solution), context + ": 계산값이 깨졌습니다.");

      if (type.generatorKey === "polygonDiagonals") {
        // 2026-11 이후 polygonDiagonals는 원문 구조별 그림(source42-*)도 만든다. 대각선 그림이 있는 변형만 대각선 수를 다시 센다.
        const svg = generated.prompt.match(/<svg class="geometry-diagram polygon-diagonal"[^>]*>/)?.[0];
        if (!svg) {
          sourceDiagram(generated, context);
        } else {
        const sides = Number(attribute(svg, "data-polygon-sides"));
        const mode = attribute(svg, "data-diagonal-mode");
        if (mode === "fan") check(Number(generated.answer) === sides - 3, context + ": 한 꼭짓점 대각선 수가 틀렸습니다.");
        else if (generated.prompt.includes("대각선이 ")) check(Number(generated.answer) * (Number(generated.answer) - 3) / 2 === sides * (sides - 3) / 2, context + ": 대각선 수와 꼭짓점 수가 맞지 않습니다.");
        else if (/모든 변의 길이의 합이 (\d+)cm/.test(generated.prompt)) {
          const perimeter = Number(generated.prompt.match(/모든 변의 길이의 합이 (\d+)cm/)[1]);
          check(Number(generated.answer) * sides === perimeter, context + ": 대각선 그림의 변 수와 한 변의 길이가 둘레와 맞지 않습니다.");
        }
        else {
          const values = [...generated.prompt.matchAll(/정(\d+)각형/g)].map(match => Number(match[1]));
          check(values.length >= 2 && Number(generated.answer) === Math.abs(values[0] * (values[0] - 3) / 2 - values[1] * (values[1] - 3) / 2), context + ": 두 다각형의 대각선 차가 틀렸습니다.");
        }
        }
      }

      if (type.generatorKey === "regularPolygonApplication") {
        const meet = generated.prompt.match(/<svg class="geometry-diagram regular-meet"[^>]*>/)?.[0];
        if (meet) {
          const angles = (attribute(meet, "data-angles") || "").split(",").map(Number);
          check(angles.reduce((sum, value) => sum + value, 0) === 360 && angles.includes(Number(generated.answer)), context + ": 한 점 둘레 각이 맞지 않습니다.");
        } else if (/class="geometry-diagram source42-/.test(generated.prompt)) {
          sourceDiagram(generated, context);
        } else if (generated.prompt.includes("한 내각의 크기")) {
          const interior = Number(generated.prompt.match(/한 내각의 크기가 (\d+)°/)?.[1]);
          check(Number(generated.answer) === 180 - interior, context + ": 내각과 외각 계산이 틀렸습니다.");
        } else {
          const sideLength = Number(generated.prompt.match(/한 변의 길이가 (\d+)cm/)?.[1]);
          const sides = Number(generated.prompt.match(/정(\d+)각형/)?.[1]);
          check(Number(generated.answer) === sideLength * sides, context + ": 정다각형 둘레가 틀렸습니다.");
        }
      }

      if (type.generatorKey === "tessellationCover") {
        const svg = generated.prompt.match(/<svg class="geometry-diagram tile-board"[^>]*>/)?.[0];
        if (!svg && /class="geometry-diagram source42-/.test(generated.prompt)) { sourceDiagram(generated, context); generatedCount += 1; continue; }
        check(Boolean(svg), context + ": 타일 그림이 없습니다.");
        const rows = Number(attribute(svg, "data-tile-rows"));
        const cols = Number(attribute(svg, "data-tile-cols"));
        const highlight = attribute(svg, "data-tile-highlight");
        const expected = highlight === "checker" ? Math.ceil(rows * cols / 2) : rows * cols;
        check(Number(generated.answer) === expected, context + ": 타일 수가 그림의 행·열과 맞지 않습니다.");
      }

      if (type.generatorKey === "shapePartitionCompose") {
        const svg = generated.prompt.match(/<svg class="geometry-diagram piece-placement"[^>]*>/)?.[0];
        if (!svg && /class="geometry-diagram source42-/.test(generated.prompt)) { sourceDiagram(generated, context); generatedCount += 1; continue; }
        check(Boolean(svg), context + ": 조각 그림이 없습니다.");
        const rows = Number(attribute(svg, "data-piece-rows"));
        const cols = Number(attribute(svg, "data-piece-cols"));
        const cells = (attribute(svg, "data-piece-cells") || "").split(";").filter(Boolean).map(value => value.split(",").map(Number));
        check(cells.length > 0 && Number(generated.answer) === placements(rows, cols, cells), context + ": 조각 배치 수가 틀렸습니다.");
      }
      generatedCount += 1;
    }
  }
}

const appFailures = [];
const appCount = auditAppTypes(appApi, appOnlyTypes, appFailures);
check(appFailures.length === 0, appFailures.slice(0, 20).join("\n"));
console.log("다각형 감사 통과: generators.js 생성기 " + legacyTypes.length + "유형 " + generatedCount + "개 검산(원문 구조 그림 " + sourceDiagramCount + "개는 그림 설명만 확인) · 앱 래퍼 " + appOnlyTypes.length + "유형 " + appCount + "개 생성 확인");
