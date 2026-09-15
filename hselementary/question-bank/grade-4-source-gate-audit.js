"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-parallel-angle.js");

const api = window.HSE_GENERATORS;
const failures = [];
const expected = {
  "4-1": {
    total: 329,
    ready: 309,
    locked: 20,
    sourceLinked: 329,
    units: [[66, 66, 0, 66], [66, 63, 3, 66], [65, 64, 1, 65], [44, 35, 9, 44], [22, 18, 4, 22], [66, 63, 3, 66]]
  },
  "4-2": {
    total: 263,
    ready: 196,
    locked: 67,
    sourceLinked: 239,
    units: [[66, 66, 0, 66], [44, 32, 12, 44], [44, 26, 18, 44], [45, 19, 26, 21], [20, 18, 2, 20], [44, 35, 9, 44]]
  }
};

const flatten = semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitNumber: unit.number,
  unitName: unit.name,
  subunitName: subunit.name
}))));

let generatedCount = 0;
const allSourceIds = new Set();

for (const semesterId of Object.keys(expected)) {
  const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === semesterId);
  const contract = expected[semesterId];
  if (!semester) {
    failures.push(`${semesterId}: 학기가 없습니다.`);
    continue;
  }
  const types = flatten(semester);
  const ready = types.filter(type => !type.reviewLocked && api.generatorKey(type));
  const locked = types.filter(type => type.reviewLocked || !api.generatorKey(type));
  const sourceLinked = types.filter(type => type.sourceItemId);
  if (types.length !== contract.total || ready.length !== contract.ready || locked.length !== contract.locked || sourceLinked.length !== contract.sourceLinked) {
    failures.push(`${semesterId}: 전체·공개·잠금·원본 연결 수가 ${types.length}·${ready.length}·${locked.length}·${sourceLinked.length}입니다.`);
  }

  semester.units.forEach((unit, index) => {
    const unitTypes = unit.subunits.flatMap(subunit => subunit.types);
    const actual = [
      unitTypes.length,
      unitTypes.filter(type => !type.reviewLocked && api.generatorKey(type)).length,
      unitTypes.filter(type => type.reviewLocked || !api.generatorKey(type)).length,
      unitTypes.filter(type => type.sourceItemId).length
    ];
    if (actual.join(",") !== contract.units[index].join(",")) failures.push(`${unit.id}: 전체·공개·잠금·원본 연결 수 ${actual.join("·")}가 기준과 다릅니다.`);
  });

  for (const type of types) {
    if (type.sourceItemId) {
      const sourceKey = `${semesterId}:${type.sourceItemId}`;
      if (allSourceIds.has(sourceKey)) failures.push(`${type.sourceItemId}: 원본 문항 ID가 중복됩니다.`);
      allSourceIds.add(sourceKey);
    }
    if (!type.reviewLocked && (!type.sourceItemId || !type.sourceVerified || !type.sourceEvidence)) {
      failures.push(`${type.id}: 원본 문항 번호와 대조 근거 없이 공개되어 있습니다.`);
    }
    if (type.reviewLocked && api.generate(type, 0, 0, 4100, type.variant) !== null) {
      failures.push(`${type.id}: 검수 대기 유형에서 문항이 생성됩니다.`);
    }
  }

  for (const type of ready) {
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 5; seed += 1) {
        const question = api.generate(type, 0, difficulty, seed, type.variant);
        generatedCount += 1;
        const visible = `${question?.prompt || ""} ${question?.answer ?? ""} ${question?.solution || ""}`.replace(/<[^>]*>/g, " ");
        if (!question?.prompt || question.answer === undefined || !question?.solution || /undefined|null|NaN|Infinity/.test(visible)) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이 생성 계약이 깨졌습니다.`);
          break;
        }
      }
    }
  }
}

const genericQuadrilaterals = flatten(window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2"))
  .filter(type => type.unitNumber === 4 && !type.sourceItemId);
if (genericQuadrilaterals.length !== 24 || genericQuadrilaterals.some(type => !type.reviewLocked || type.sourceVerified || type.generationMode !== "review-locked" || type.answerVisualStatus !== "locked")) {
  failures.push("4-2 사각형의 원본 미연결 24유형이 모두 검수 대기로 차단되지 않았습니다.");
}

if (failures.length) {
  console.error(`4학년 원본 공개 문턱 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}

console.log(`4학년 원본 공개 문턱 감사 통과: 592유형 · 공개 505 · 검수 대기 87 · 원본 연결 568 · ${generatedCount.toLocaleString()}회 생성`);
