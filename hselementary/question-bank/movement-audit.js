"use strict";

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

const signatures = {
  planeTransform: ["오른쪽으로", "점선을 기준으로", "시계 방향으로 90°씩"],
  sequentialTransform: ["좌우로", "위아래로 한 번", "한 묶음으로"],
  movementPatternOne: ["번째 모양을 구하세요", "모양은 모두 몇 개인지", "차례로 쓰세요"],
  movementPatternTwo: ["시계 방향으로 180°", "거울에 비친 시계", "처음 수의 차를 구하세요"]
};

const failures = [];
for (const type of types) {
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
    }
  }
}

if (failures.length) {
  console.error(`평면도형 이동 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 20).join("\n"));
  process.exit(1);
}

console.log(`평면도형 이동 감사 통과: ${types.length}유형, ${types.length * 3 * 300}개 생성`);
