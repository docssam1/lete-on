"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const allTypes = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
const types = allTypes.filter(type => api.generatorKey(type) && !type.reviewLocked);
const floatingTail = /\b\d+\.\d{10,}\b/;
const failures = [];
let count = 0;
if (types.length !== 770) failures.push(`공개 검수 대상은 770개여야 하나 ${types.length}개입니다.`);

for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 100; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const visible = `${generated.prompt}\n${generated.solution}\n${generated.answer}`.replace(/<[^>]*>/g, " ");
    const match = visible.match(floatingTail);
    if (match) throw new Error(`긴 소수 꼬리 ${match[0]}가 화면에 표시됨`);
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`숫자 표시 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`숫자 표시 감사 통과: ${types.length}유형, ${count}개 생성`);
