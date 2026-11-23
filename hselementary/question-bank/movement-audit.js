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

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const unit = semester.units.find(item => item.id === "4-1-u4");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));

const legacyMovementSignatures = {
  planeTransform: ["오른쪽으로", "점선을 기준으로", "시계 방향으로 90°씩"],
  sequentialTransform: ["좌우로", "위아래로 한 번", "한 묶음으로"],
  movementPatternOne: ["번째 모양을 구하세요", "모양은 모두 몇 개인지", "차례로 쓰세요"],
  movementPatternTwo: ["시계 방향으로 180°", "거울에 비친 시계", "처음 수의 차를 구하세요"]
};
const appContext = loadAppGenerators();
const appApi = appContext.HSE_GENERATORS;
const appTypeById = new Map(appTypesOf(appContext, unit.id).map(type => [type.id, type]));
const legacyTypes = types.filter(type => appTypeById.has(type.id) && usesLegacyGenerator(api, appApi, appTypeById.get(type.id)))
  .map(type => ({ ...type, ...appTypeById.get(type.id) })) // 앱 공개 등록이 고친 유형 속성(변형 번호 등)을 쓴다.
  // 같은 생성기 이름이라도 2026-11 이후 원문 구조 문항을 만드는 변형이 많다. 예전 세부 유형 문장(signatures)이 나오는 유형만 세부 검산한다.
  .filter(type => { const signature = legacyMovementSignatures[type.generatorKey]?.[type.variant]; return Boolean(signature) && (api.generate(type, 0, 0, 1, 18)?.prompt || "").includes(signature); });
const legacyIds = new Set(legacyTypes.map(type => type.id));
const appOnlyTypes = [...appTypeById.values()].filter(type => !legacyIds.has(type.id));

const signatures = {
  planeTransform: ["오른쪽으로", "점선을 기준으로", "시계 방향으로 90°씩"],
  sequentialTransform: ["좌우로", "위아래로 한 번", "한 묶음으로"],
  movementPatternOne: ["번째 모양을 구하세요", "모양은 모두 몇 개인지", "차례로 쓰세요"],
  movementPatternTwo: ["시계 방향으로 180°", "거울에 비친 시계", "처음 수의 차를 구하세요"]
};

const failures = [];
const movementShapesByType = new Map();
const parseGrid = prompt => {
  const svg = prompt.match(/<svg class="movement-grid"[^>]*>([\s\S]*?)<\/svg>/);
  if (!svg) return null;
  const tag = svg[0].match(/<svg class="movement-grid"[^>]*>/)?.[0] || "";
  const polygon = svg[1].match(/<polygon points="([^"]+)"\/>/)?.[1];
  if (!polygon) return null;
  const points = polygon.trim().split(/\s+/).map(pair => pair.split(",").map(Number)).map(([x, y]) => [(x - 18) / 18, 8 - (y - 18) / 18]);
  return { points, model: tag.match(/data-shape-model="([^"]+)"/)?.[1], vertices: Number(tag.match(/data-vertex-count="(\d+)"/)?.[1]) };
};
const parseCoordinateAnswer = answer => {
  const match = String(answer).match(/^(\d+),\s*(\d+)$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
};
const samePoint = (first, second) => first.length === second.length && first.every((value, index) => value === second[index]);
const rotateClockwise = ([x, y], turns) => {
  let point = [x, y];
  for (let count = 0; count < turns; count += 1) point = [4 + (point[1] - 4), 4 - (point[0] - 4)];
  return point;
};
for (const type of legacyTypes) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 300; seed += 1) {
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, seed + 17);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        continue;
      }
      if (!generated?.prompt || generated.answer === undefined || !generated.solution) {
        failures.push(`${type.id} / 시드 ${seed}: 문제·정답·풀이 중 빠진 값이 있습니다.`);
        continue;
      }
      if (generated.generator !== type.generatorKey) failures.push(`${type.id} / 시드 ${seed}: 생성기 연결이 다릅니다.`);
      const signature = signatures[type.generatorKey]?.[type.variant];
      if (!signature || !generated.prompt.includes(signature)) failures.push(`${type.id} / 시드 ${seed}: 세부 유형과 문제 구조가 다릅니다.`);
      if (type.generatorKey === "planeTransform") {
        const grid = parseGrid(generated.prompt);
        if (!grid || !grid.model || !Number.isInteger(grid.vertices) || grid.points.length !== grid.vertices) {
          failures.push(`${type.id} / 시드 ${seed}: 이동 도형의 SVG 메타데이터 또는 꼭짓점이 없습니다.`);
          continue;
        }
        if (grid.points.some(([x, y]) => !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x > 8 || y < 0 || y > 8)) failures.push(`${type.id} / 시드 ${seed}: 변환 전 꼭짓점이 격자 밖에 있습니다.`);
        if (!movementShapesByType.has(type.id)) movementShapesByType.set(type.id, new Set());
        movementShapesByType.get(type.id).add(`${grid.model}:${grid.vertices}`);
        const answer = parseCoordinateAnswer(generated.answer);
        if (!answer) {
          failures.push(`${type.id} / 시드 ${seed}: 점 A의 순서쌍 답 형식이 아닙니다.`);
          continue;
        }
        const [ax, ay] = grid.points[0];
        let expected;
        if (type.variant === 0) {
          const shifts = generated.prompt.match(/오른쪽으로 (\d+)칸, 위로 (\d+)칸/);
          expected = shifts ? [ax + Number(shifts[1]), ay + Number(shifts[2])] : null;
        } else if (type.variant === 1) {
          expected = generated.prompt.includes("좌우로 뒤집었습니다") ? [8 - ax, ay] : [ax, 8 - ay];
        } else {
          const turns = Number(generated.prompt.match(/90°씩 (\d+)번 돌렸습니다/)?.[1]);
          expected = Number.isInteger(turns) ? rotateClockwise([ax, ay], turns) : null;
        }
        if (!expected || expected.some(value => value < 0 || value > 8) || !samePoint(answer, expected)) failures.push(`${type.id} / 시드 ${seed}: 변환 뒤 점 A의 정답이 독립 계산과 다릅니다.`);
      }
    }
  }
}

for (const type of legacyTypes.filter(type => type.generatorKey === "planeTransform")) {
  const shapes = movementShapesByType.get(type.id) || new Set();
  if (shapes.size < 3) failures.push(`${type.id}: 삼각형만 반복되지 않도록 최소 3종의 이동 도형이 생성되어야 합니다.`);
}

const appCount = auditAppTypes(appApi, appOnlyTypes, failures);
if (failures.length) {
  console.error(`평면도형 이동 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log(`평면도형 이동 감사 통과: generators.js 생성기 ${legacyTypes.length}유형 ${legacyTypes.length * 3 * 300}개 검산 · 앱 래퍼 ${appOnlyTypes.length}유형 ${appCount}개 생성 확인`);
