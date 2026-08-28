"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const generatorApi = window.HSE_GENERATORS;
const failures = [];
let generatedCount = 0;

const types = window.HSE_CURRICULUM.semesters.flatMap(semester =>
  semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    unitId: unit.id,
    unitName: unit.name,
    subunitName: subunit.name
  }))))
);
const ready = types.filter(type => generatorApi.generatorKey(type) && !type.reviewLocked);
const locked = types.filter(type => !generatorApi.generatorKey(type) || type.reviewLocked);

if (types.length !== 914) failures.push(`런타임 유형은 914개여야 하나 ${types.length}개입니다.`);
if (ready.length !== 763) failures.push(`생성 가능 유형은 763개여야 하나 ${ready.length}개입니다.`);
if (locked.length !== 151) failures.push(`검수 대기 유형은 151개여야 하나 ${locked.length}개입니다.`);

for (const type of ready) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 20; seed += 1) {
      let generated;
      try {
        generated = generatorApi.generate(type, 0, difficulty, seed, type.variant);
        generatedCount += 1;
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
      if (!generated?.prompt || generated.answer === undefined || !generated?.solution) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
        break;
      }
      const visible = `${generated.prompt} ${generated.answer} ${generated.solution}`.replace(/<[^>]*>/g, " ");
      if (/undefined|null|NaN|Infinity/.test(visible)) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 잘못된 값이 노출됩니다.`);
        break;
      }
    }
  }
}

if (failures.length) {
  console.error(`런타임 생성 가능성 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`런타임 생성 가능성 감사 통과: 전체 914 · 생성 가능 763 · 검수 대기 151 · ${generatedCount.toLocaleString()}회 생성`);
