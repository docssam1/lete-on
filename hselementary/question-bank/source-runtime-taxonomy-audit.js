"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const generatorApi = window.HSE_GENERATORS;
const failures = [];
const sourceIds = new Set();
const labels = new Set();
let readyCount = 0;
let lockedCount = 0;
let generatedCount = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

const types = semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
}))));
const sectionCounts = types.reduce((counts, type) => {
  counts[type.sourceSection] = (counts[type.sourceSection] || 0) + 1;
  return counts;
}, {});

check(semester.units.length === 6, "4-1 대단원은 6개여야 합니다.");
check(semester.units.reduce((sum, unit) => sum + unit.subunits.length, 0) === 30, "4-1 개념탐구 묶음은 30개여야 합니다.");
check(types.length === 329, `4-1 원문 유형은 329개여야 하나 ${types.length}개입니다.`);
check(sectionCounts.exploration === 30, "개념탐구 유형은 30개여야 합니다.");
check(sectionCounts.example === 119, "유제 유형은 119개여야 합니다.");
check(sectionCounts.mission === 180, "Mission 유형은 180개여야 합니다.");

for (const unit of semester.units) {
  for (const subunit of unit.subunits) {
    const expected = unit.number === 3 && subunit.number === 6 ? 10 : 11;
    check(subunit.types.length === expected, `${unit.name} / ${subunit.name}: ${expected}유형이어야 합니다.`);
  }
}

for (const type of types) {
  check(Boolean(type.sourceItemId), `${type.id}: 원문 ID가 없습니다.`);
  check(!sourceIds.has(type.sourceItemId), `${type.sourceItemId}: 원문 ID가 중복됩니다.`);
  sourceIds.add(type.sourceItemId);
  check(Boolean(type.sourceItemLabel), `${type.id}: 원문 항목명이 없습니다.`);
  check(Boolean(type.sourceEvidence), `${type.id}: PDF·교재 쪽 근거가 없습니다.`);
  check(type.sourceVerified, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(!labels.has(type.label), `${type.label}: 화면 유형명이 중복됩니다.`);
  labels.add(type.label);

  if (type.generatorKey && !type.reviewLocked) {
    readyCount += 1;
    check(Boolean(generatorApi.generatorKey(type)), `${type.sourceItemId}: 생성기 키가 등록되지 않았습니다.`);
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 100; seed += 1) {
        let generated;
        try {
          generated = generatorApi.generate(type, 0, difficulty, seed, type.variant);
          generatedCount += 1;
        } catch (error) {
          failures.push(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          break;
        }
        check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), `${type.sourceItemId}: 생성 결과가 완전하지 않습니다.`);
        const visible = `${generated?.prompt} ${generated?.answer} ${generated?.solution}`.replace(/<[^>]*>/g, " ");
        check(!/undefined|null|NaN|Infinity/.test(visible), `${type.sourceItemId}: 잘못된 값이 노출됩니다.`);
      }
    }
  } else {
    lockedCount += 1;
    check(type.reviewLocked, `${type.sourceItemId}: 미검증 유형이 잠기지 않았습니다.`);
    check(!type.generatorKey, `${type.sourceItemId}: 잠긴 유형에 미검증 생성기가 남아 있습니다.`);
  }
}

check(sourceIds.size === 329, "고유 원문 ID는 329개여야 합니다.");
check(readyCount === 233, `생성 가능 유형은 233개여야 하나 ${readyCount}개입니다.`);
check(lockedCount === 96, `검수 대기 유형은 96개여야 하나 ${lockedCount}개입니다.`);

if (failures.length) {
  console.error(`4-1 원문 기반 런타임 분류 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-1 원문 기반 런타임 분류 감사 통과: 329유형 · 생성 가능 233 · 검수 대기 96 · ${generatedCount.toLocaleString()}회 생성`);
