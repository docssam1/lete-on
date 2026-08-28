"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const allTypes = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
const types = allTypes.filter(type => api.generatorKey(type) && !type.reviewLocked);

// These terms indicate a method outside the elementary-bank explanation policy.
const prohibited = [
  { pattern: /√/, label: "제곱근 기호" },
  { pattern: /제곱근/, label: "제곱근 용어" },
  { pattern: /순열/, label: "순열 용어" },
  { pattern: /조합/, label: "조합 용어" },
];

const failures = [];
let count = 0;
if (types.length !== 745) failures.push(`공개 검수 대상은 745개여야 하나 ${types.length}개입니다.`);
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 100; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const visible = `${generated.prompt}\n${generated.solution}\n${generated.answer}`.replace(/<[^>]*>/g, " ");
    for (const rule of prohibited) if (rule.pattern.test(visible)) throw new Error(`${rule.label}가 화면 문장에 남아 있음`);
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`초등 풀이 언어 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}

console.log(`초등 풀이 언어 감사 통과: ${types.length}유형, ${count}개 생성`);
