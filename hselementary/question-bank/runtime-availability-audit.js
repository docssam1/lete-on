"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
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
const sourceGrade6 = types.filter(type => type.normalizedTypeId && /^6-[12]-/.test(type.sourceItemId));

if (types.length !== 1893) failures.push(`런타임 유형은 1893개여야 하나 ${types.length}개입니다.`);
if (ready.length !== 1201) failures.push(`생성 가능 유형은 1201개여야 하나 ${ready.length}개입니다.`);
if (locked.length !== 692) failures.push(`검수 대기 유형은 692개여야 하나 ${locked.length}개입니다.`);
if (sourceGrade6.length !== 633) failures.push(`6학년 원문 세부 유형은 633개여야 하나 ${sourceGrade6.length}개입니다.`);
if (sourceGrade6.filter(type => !type.reviewLocked).length !== 32 || sourceGrade6.filter(type => type.reviewLocked).length !== 601) failures.push("6학년 원문 세부 유형의 생성 가능·잠금 수가 다릅니다.");
if (!sourceGrade6.every(type => type.answerVisualRequired && type.generationMode === "fixed-verified-pool" && type.verifiedVariantTarget === 3)) failures.push("6학년 원문 세부 유형의 정답 그림·고정 3문항 계약이 다릅니다.");

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

console.log(`런타임 생성 가능성 감사 통과: 전체 1893 · 생성 가능 1201 · 검수 대기 692(6학년 원문 601 포함) · ${generatedCount.toLocaleString()}회 생성`);
