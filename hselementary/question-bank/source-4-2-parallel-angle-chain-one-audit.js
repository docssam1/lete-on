"use strict";

const path = require("node:path");

const GENERATOR_FILE = "source-4-2-parallel-angle-chain-one.js";
const GENERATOR_KEY = "sourceGrade4AdvancedParallelAngleChainOne";
const SOURCE_IDS = Object.freeze([
  "4-2-u4-e3-exploration",
  "4-2-u4-e3-example-3-1",
  "4-2-u4-e3-example-3-2",
  "4-2-u4-e3-example-3-3",
  "4-2-u4-e3-example-3-4",
  "4-2-u4-e3-mission-1",
  "4-2-u4-e3-mission-2",
  "4-2-u4-e3-mission-3",
  "4-2-u4-e3-mission-4",
  "4-2-u4-e3-mission-5",
  "4-2-u4-e3-mission-6"
]);
const KINDS = Object.freeze([
  "exploration",
  "example-3-1",
  "example-3-2",
  "example-3-3",
  "example-3-4",
  "mission-1",
  "mission-2",
  "mission-3",
  "mission-4",
  "mission-5",
  "mission-6"
]);
const ANSWERS = Object.freeze([122, 10, 235, 40, 25, 30, 36, 144, 18, 120, 105]);
const REQUIRED_FIELDS = Object.freeze({
  exploration: ["apex", "bottom"],
  "example-3-1": ["top", "bend", "bottom", "middle"],
  "example-3-2": ["exterior", "bottom", "middle"],
  "example-3-3": ["top", "bend", "aux"],
  "example-3-4": ["given"],
  "mission-1": ["top", "internal", "bottom"],
  "mission-2": ["top", "bend"],
  "mission-3": ["top", "bottomLeft", "bottomRight"],
  "mission-4": ["top", "bottom", "ratio"],
  "mission-5": ["given"],
  "mission-6": ["upper", "exterior"]
});
const SOURCE_CORE = Object.freeze({
  exploration: { apex: 70, bottom: 38 },
  "example-3-1": { top: 15, bend: 50, bottom: 45 },
  "example-3-2": { exterior: 162, bottom: 37 },
  "example-3-3": { top: 20, bend: 60, aux: 120 },
  "example-3-4": { given: 70 },
  "mission-1": { top: 40, internal: 100, bottom: 30 },
  "mission-2": { top: 22, bend: 32 },
  "mission-3": { top: 42, bottomLeft: 32, bottomRight: 35 },
  "mission-4": { top: 36, bottom: 54, ratio: 4 },
  "mission-5": { given: 60 },
  "mission-6": { upper: 95, exterior: 80 }
});
const EXAMPLE_3_3_POOLS = Object.freeze([
  { top: 20, bend: 60, aux: 120 },
  { top: 24, bend: 68, aux: 116 },
  { top: 18, bend: 64, aux: 124 }
]);
const MISSION_6_SOURCE_ANSWER_CONFLICT = Object.freeze({
  independentlyComputedAnswer: 105,
  previousWrittenAnswer: 125,
  resolution: "independently-computed-answer-105"
});

const failures = [];
let generatedCount = 0;
let independentCount = 0;
let freeAngleChecks = 0;
let coordinateAngleChecks = 0;
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const sourceIdFor = kind => `4-2-u4-e3-${kind}`;
const kindFor = sourceItemId => {
  const index = SOURCE_IDS.indexOf(sourceItemId);
  return index < 0 ? undefined : KINDS[index];
};
const numericAnswer = value => Number(String(value).replace(/[^0-9.-]/g, ""));
const sameJson = (first, second) => JSON.stringify(first) === JSON.stringify(second);
const requiredKeySet = kind => [...REQUIRED_FIELDS[kind]].sort();
const attr = (markup, name) => {
  const match = String(markup).match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : undefined;
};
const decodeModel = (markup, name) => {
  const value = attr(markup, name);
  if (value === undefined) return null;
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (error) {
    return null;
  }
};
const svgTags = markup => [...String(markup).matchAll(/<svg\b[^>]*>/g)].map(match => match[0]);
const hasCoordinate = value => Array.isArray(value)
  && value.length === 2
  && value.every(component => Number.isFinite(Number(component)));
const coordinateCount = value => {
  if (hasCoordinate(value)) return 1;
  if (value && typeof value === "object" && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y))) return 1;
  if (!value || typeof value !== "object") return 0;
  return Object.values(value).reduce((count, child) => count + coordinateCount(child), 0);
};

// Independent direction-angle reconstruction. This intentionally does not call deriveCase.
const independentAnswer = (kind, data) => {
  if (kind === "exploration") return 90 + data.apex - data.bottom;
  if (kind === "example-3-1") return Math.abs(data.top + data.bottom - data.bend);
  if (kind === "example-3-2") return 360 + data.bottom - data.exterior;
  if (kind === "example-3-3") return data.aux - data.bend - data.top;
  if (kind === "example-3-4") return data.given - 45;
  if (kind === "mission-1") return data.internal - data.top - data.bottom;
  if (kind === "mission-2") return 90 - data.top - data.bend;
  if (kind === "mission-3") return data.top + data.bottomLeft + 2 * data.bottomRight;
  if (kind === "mission-4") return (data.top + data.bottom) / (data.ratio + 1);
  if (kind === "mission-5") return 2 * data.given;
  if (kind === "mission-6") return data.upper + 90 - data.exterior;
  return NaN;
};
const independentFormula = kind => ({
  exploration: "90 + apex - bottom",
  "example-3-1": "abs(top + bottom - bend)",
  "example-3-2": "360 + bottom - exterior",
  "example-3-3": "aux - bend - top",
  "example-3-4": "given - 45",
  "mission-1": "internal - top - bottom",
  "mission-2": "90 - top - bend",
  "mission-3": "top + bottomLeft + 2 * bottomRight",
  "mission-4": "(top + bottom) / (ratio + 1)",
  "mission-5": "2 * given",
  "mission-6": "upper + 90 - exterior"
}[kind]);

// The two unknown angles need not be individually determined: the requested
// sum/difference must stay constant throughout their admissible direction range.
const verifyFreeAngle = (kind, data, expected, label) => {
  if (!["example-3-1", "example-3-2"].includes(kind)) return;
  const answers = new Set();
  for (let quarterDegree = 1; quarterDegree < 720; quarterDegree += 1) {
    const direction = quarterDegree / 4;
    const first = kind === "example-3-1"
      ? data.bend - data.top + direction
      : 360 - data.exterior - direction;
    const second = data.bottom + direction;
    if (first <= 0 || first >= 180 || second <= 0 || second >= 180) continue;
    answers.add(kind === "example-3-1" ? Math.abs(first - second) : first + second);
    freeAngleChecks += 1;
  }
  check(answers.size === 1 && answers.has(expected), `${label}: free-angle candidates do not give one requested answer.`);
};

const coordinateAngle = (vertex, first, second) => {
  const a = { x: first.x - vertex.x, y: first.y - vertex.y };
  const b = { x: second.x - vertex.x, y: second.y - vertex.y };
  return Math.acos(Math.max(-1, Math.min(1,
    (a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y))
  ))) * 180 / Math.PI;
};

let moduleApi;
let runtimeApi;
let curriculum;
try {
  global.window = {};
  require("./curriculum.js");
  curriculum = window.HSE_CURRICULUM;
  require("./generators.js");
  runtimeApi = window.HSE_GENERATORS;
  require("./source-4-2-parallel-angle.js");
  moduleApi = require(path.join(__dirname, GENERATOR_FILE));
} catch (error) {
  failures.push(`${GENERATOR_FILE} 로드 실패: ${error.message}`);
}

check(moduleApi && moduleApi.GENERATOR_KEY === GENERATOR_KEY, "새 generator key가 계약과 다릅니다.");
check(moduleApi && sameJson(moduleApi.SOURCE_IDS, SOURCE_IDS), "SOURCE_IDS 11개 또는 순서가 계약과 다릅니다.");
check(moduleApi && typeof moduleApi.deriveCase === "function", "deriveCase가 export되지 않았습니다.");
check(moduleApi && typeof moduleApi.buildGenerated === "function", "buildGenerated가 export되지 않았습니다.");
check(moduleApi && typeof moduleApi.install === "function" && typeof moduleApi.markReady === "function", "install/markReady가 export되지 않았습니다.");

if (moduleApi) {
  const sourceIdSet = new Set(moduleApi.SOURCE_IDS || []);
  check(sourceIdSet.size === 11, "SOURCE_IDS 중복 또는 누락이 있습니다.");
  check(SOURCE_IDS.every(sourceId => kindFor(sourceId) && moduleApi.POOLS?.[kindFor(sourceId)]), "source ID와 suffix kind 매핑이 다릅니다.");
  check(moduleApi.POOLS && KINDS.every(kind => Array.isArray(moduleApi.POOLS[kind]) && moduleApi.POOLS[kind].length === 3), "kind별 POOLS가 정확히 3개가 아닙니다.");

  KINDS.forEach((kind, kindIndex) => {
    const pool = moduleApi.POOLS?.[kind] || [];
    pool.forEach((data, poolIndex) => {
      const label = `${kind}/pool${poolIndex}`;
      check(data && typeof data === "object", `${label}: rawData가 객체가 아닙니다.`);
      if (!data || typeof data !== "object") return;
      check(sameJson(Object.keys(data).sort(), requiredKeySet(kind)), `${label}: rawData schema가 ${kind} 계약과 다릅니다.`);
      REQUIRED_FIELDS[kind].forEach(field => check(Number.isFinite(Number(data[field])), `${label}: ${field}가 숫자가 아닙니다.`));
      if (kind === "mission-4") check(Number.isInteger(data.ratio) && data.ratio > 0, `${label}: ratio가 양의 정수가 아닙니다.`);
      const expected = independentAnswer(kind, data);
      check(Number.isInteger(expected) && expected > 0 && expected < 360, `${label}: 독립 답 ${expected}가 유효한 각 합/차 범위가 아닙니다.`);
      check(independentFormula(kind), `${label}: 독립 수식이 없습니다.`);
      independentCount += 1;
      verifyFreeAngle(kind, data, expected, label);

      const expectedFacts = moduleApi.deriveCase(kind, data);
      check(expectedFacts && numericAnswer(expectedFacts.answer) === expected, `${label}: deriveCase 답과 독립 계산 ${expected}가 다릅니다.`);
      if (poolIndex === 0) {
        Object.entries(SOURCE_CORE[kind]).forEach(([field, value]) => check(data[field] === value, `${label}: 원본 ${field}=${value}가 보존되지 않았습니다.`));
        check(expected === ANSWERS[kindIndex], `${label}: 원본 답 ${ANSWERS[kindIndex]}가 독립 계산 ${expected}와 다릅니다.`);
      }
    });
  });

  const ex3Pools = moduleApi.POOLS["example-3-3"] || [];
  check(sameJson(ex3Pools, EXAMPLE_3_3_POOLS), "ex3-3의 상단 교점 내부각/아래 교점 바깥각 pool이 원본 구조와 다릅니다.");
  EXAMPLE_3_3_POOLS.forEach((data, index) => check(independentAnswer("example-3-3", data) === [40, 24, 42][index], `example-3-3/pool${index}: aux - bend - top 검산이 다릅니다.`));
  check(moduleApi.POOLS["example-3-4"]?.[2]?.given === 68, "ex3-4 pool2는 정사각형 변과 충돌하지 않는 given=68이어야 합니다.");
  check(independentAnswer("example-3-4", moduleApi.POOLS["example-3-4"]?.[2] || {}) === 23, "ex3-4 pool2의 독립 답은 given=68에서 23이어야 합니다.");

  const generatedMission6Source = moduleApi.buildGenerated(SOURCE_IDS[10], 0);
  const exportedConflict = moduleApi.sourceAnswerConflict || generatedMission6Source.sourceAnswerConflict;
  check(sameJson(MISSION_6_SOURCE_ANSWER_CONFLICT, {
    independentlyComputedAnswer: 105,
    previousWrittenAnswer: 125,
    resolution: "independently-computed-answer-105"
  }), "Mission 6의 독립 계산 105와 기존 필기 125 충돌 기록이 보존되지 않았습니다.");
  check(sameJson(exportedConflict, { handwritten: "125°", independentlyVerified: "105°", basis: "parallel-and-right-angle-direction-model" }), "Mission 6 sourceAnswerConflict 기록이 다릅니다.");

  const inspectGenerated = (sourceItemId, poolIndex) => {
    const kind = kindFor(sourceItemId);
    const data = moduleApi.POOLS[kind][poolIndex];
    let generated;
    try {
      generated = moduleApi.buildGenerated(sourceItemId, poolIndex);
    } catch (error) {
      failures.push(`${sourceItemId}/pool${poolIndex}: buildGenerated 실패: ${error.message}`);
      return;
    }
    const label = `${sourceItemId}/pool${poolIndex}`;
    ["answer", "prompt", "solution", "answerVisual", "verifiedPoolIndex", "verifiedVariantCount", "answerCandidateCount", "sourceItemId"].forEach(field => check(generated[field] !== undefined, `${label}: ${field}가 없습니다.`));
    check(generated.sourceItemId === sourceItemId, `${label}: sourceItemId가 다릅니다.`);
    check(generated.verifiedPoolIndex === poolIndex, `${label}: verifiedPoolIndex가 다릅니다.`);
    check(generated.verifiedVariantCount === 3, `${label}: verifiedVariantCount가 3이 아닙니다.`);
    check(generated.answerCandidateCount === 1, `${label}: answerCandidateCount가 1이 아닙니다.`);
    check(numericAnswer(generated.answer) === independentAnswer(kind, data), `${label}: buildGenerated 답이 독립 답과 다릅니다.`);
    check(!/undefined|null|NaN|Infinity/.test(`${generated.prompt} ${generated.solution} ${generated.answerVisual}`), `${label}: 생성 결과에 깨진 값이 있습니다.`);
    check(String(generated.prompt).includes("data-geometry-model="), `${label}: hidden geometry model이 없습니다.`);
    const geometryModel = decodeModel(generated.prompt, "data-geometry-model");
    check(geometryModel && geometryModel.sourceItemId === sourceItemId && geometryModel.kind === kind, `${label}: geometry model의 원문 ID/kind가 다릅니다.`);
    check(geometryModel && geometryModel.poolIndex === poolIndex && sameJson(geometryModel.data, data), `${label}: geometry model의 pool/rawData가 다릅니다.`);
    check(geometryModel && geometryModel.uniqueAnswerCount === 1, `${label}: geometry model의 유일 답 계약이 없습니다.`);
    check(geometryModel && numericAnswer(geometryModel.facts?.answer) === independentAnswer(kind, data), `${label}: geometry model facts가 독립 답과 다릅니다.`);

    [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => {
      const phase = phaseIndex === 0 ? "prompt" : "answerVisual";
      const tags = svgTags(markup);
      check(tags.length >= 1, `${label}/${phase}: SVG가 없습니다.`);
      tags.forEach(tag => {
        check(tag.includes("source42-pa") && tag.includes("source42-pac1"), `${label}/${phase}: source42-pa/source42-pac1 class가 없습니다.`);
        const model = decodeModel(tag, "data-direction-model");
        check(model && model.sourceItemId === sourceItemId && model.kind === kind && model.poolIndex === poolIndex, `${label}/${phase}: direction model의 원문 ID/kind/poolIndex가 다릅니다.`);
        check(model && sameJson(model.rawData ?? model.data, data), `${label}/${phase}: direction model rawData가 다릅니다.`);
        check(model && coordinateCount(model) >= 4, `${label}/${phase}: direction model에 실제 좌표가 부족합니다.`);
        if (model?.angles) {
          const targetAngles = [];
          model.angles.forEach(angle => {
            const measured = coordinateAngle(angle.vertex, angle.rayA, angle.rayB);
            check(Math.abs(measured - angle.value) < 1e-7, `${label}/${phase}/${angle.role}: coordinate angle differs from its label.`);
            if (angle.target) targetAngles.push(measured);
            coordinateAngleChecks += 1;
          });
          const measuredAnswer = kind === "example-3-1"
            ? Math.abs(targetAngles[0] - targetAngles[1])
            : targetAngles.reduce((sum, angle) => sum + angle, 0);
          check(Math.abs(measuredAnswer - independentAnswer(kind, data)) < 1e-7, `${label}/${phase}: diagram target differs from the independently solved answer.`);
        }
        if (kind === "example-3-3") {
          const viewBox = String(attr(tag, "viewBox") || "").split(/\s+/).map(Number);
          const [left, top, width, height] = viewBox;
          const inViewport = position => position && Number.isFinite(Number(position.x)) && Number.isFinite(Number(position.y))
            && Number(position.x) >= left && Number(position.x) <= left + width
            && Number(position.y) >= top && Number(position.y) <= top + height;
          check(viewBox.length === 4 && viewBox.every(Number.isFinite), `${label}/${phase}: ex3-3 viewBox가 잘못되었습니다.`);
          if (model?.points) Object.values(model.points).forEach(position => check(inViewport(position), `${label}/${phase}: ex3-3 점이 viewBox 밖에 있습니다.`));
          [...String(markup).matchAll(/<text\b[^>]*\bx="([^\"]+)"[^>]*\by="([^\"]+)"/g)].forEach(match => {
            check(inViewport({ x: Number(match[1]), y: Number(match[2]) }), `${label}/${phase}: ex3-3 라벨이 viewBox 밖에 있습니다.`);
          });
        }
      });
    });
    generatedCount += 1;
  };

  SOURCE_IDS.forEach(sourceItemId => [0, 1, 2].forEach(poolIndex => inspectGenerated(sourceItemId, poolIndex)));

  const allTypes = curriculum?.semesters?.flatMap(semester => semester.units || [])
    .flatMap(unit => unit.subunits || []).flatMap(subunit => subunit.types || []) || [];
  const typeFor = sourceItemId => allTypes.find(type => type.sourceItemId === sourceItemId);
  SOURCE_IDS.forEach(sourceItemId => {
    const type = typeFor(sourceItemId);
    check(type, `${sourceItemId}: curriculum type이 없습니다.`);
    if (!type) return;
    check(type.generatorKey === GENERATOR_KEY && type.reviewLocked === false, `${sourceItemId}: markReady 공개 상태가 아닙니다.`);
    const seenPools = new Set();
    for (let seed = 1; seed <= 100; seed += 1) {
      const difficulty = (seed % 3) - 1;
      let generated;
      try {
        generated = runtimeApi.generate(type, 0, difficulty, seed, seed - 1);
      } catch (error) {
        failures.push(`${sourceItemId}/seed${seed}: runtime generate 실패: ${error.message}`);
        break;
      }
      generatedCount += 1;
      check(generated && generated.sourceItemId === sourceItemId, `${sourceItemId}/seed${seed}: sourceItemId가 다릅니다.`);
      check(generated && generated.verifiedVariantCount === 3 && generated.answerCandidateCount === 1, `${sourceItemId}/seed${seed}: 반복 생성 계약이 다릅니다.`);
      if (generated) seenPools.add(generated.verifiedPoolIndex);
    }
    check(seenPools.size === 3, `${sourceItemId}: 100회 반복에서 3개 verified pool을 모두 확인하지 못했습니다.`);
  });

  const readyRoot = {
    HSE_CURRICULUM: {
      semesters: [{ units: [{ subunits: [{ types: SOURCE_IDS.map(sourceItemId => ({ sourceItemId })) }] }] }]
    }
  };
  const readyTypes = moduleApi.markReady(readyRoot);
  check(Array.isArray(readyTypes) && readyTypes.length === 11, "markReady가 11개 유형을 반환하지 않습니다.");
  check(readyRoot.HSE_CURRICULUM.semesters[0].units[0].subunits[0].types.every(type => type.generatorKey === GENERATOR_KEY && type.reviewLocked === false), "markReady가 공개 상태를 설정하지 못했습니다.");
  const isolatedRoot = {
    HSE_GENERATORS: { generatorKey: () => "base", generate: () => ({ sourceItemId: "other" }) },
    HSE_CURRICULUM: readyRoot.HSE_CURRICULUM
  };
  check(moduleApi.install(isolatedRoot) === true, "install이 유효한 runtime API에 설치되지 않았습니다.");
  check(isolatedRoot.HSE_GENERATORS.generatorKey({ sourceItemId: SOURCE_IDS[0] }) === GENERATOR_KEY, "install 후 generatorKey가 새 key를 반환하지 않습니다.");
}

if (failures.length) {
  console.error(`4-2 parallel-angle-chain-one audit failed: ${failures.length}`);
  failures.slice(0, 120).forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`4-2 parallel-angle-chain-one audit passed: 11 source IDs, ${independentCount} independent pool checks, ${generatedCount} generated checks, ${freeAngleChecks} free-angle candidates, ${coordinateAngleChecks} coordinate angles, Mission 6 independently computed answer 105 conflict recorded`);
