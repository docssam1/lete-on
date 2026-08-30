"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const expectedCounts = new Map([["4-2-u5", 20], ["4-2-u6", 12]]);
const signatures = new Map([
  ["polygonDiagonals", ["한 꼭짓점에서", "모든 대각선을", "대각선의 개수 차"]],
  ["regularPolygonApplication", ["한 내각의 크기", "둘레를 구하세요", "한 꼭짓점에 맞대어"]],
  ["tessellationCover", ["정사각형 타일로", "파랑, 흰색이 번갈아", "직사각형 타일로"]],
  ["shapePartitionCompose", ["ㄴ자 모양 조각", "긴 막대 모양 조각", "ㅜ자 모양 조각"]]
]);
const failures = [];
let generatedCount = 0;

for (const [unitId, expectedCount] of expectedCounts) {
  const unit = semester.units.find(item => item.id === unitId);
  const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    unitId: unit.id,
    unitName: unit.name
  })));
  if (types.length !== expectedCount) failures.push(`${unit.name}: ${types.length}유형이며 예상 ${expectedCount}유형과 다릅니다.`);
  for (const subunit of unit.subunits) {
    const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b);
    if (unitId === "4-2-u5" && (subunit.types.length !== 10 || variants.join(",") !== "0,1,2,3,4,5,6,7,8,9")) failures.push(`${subunit.name}: 원문 중복을 뺀 10개 분기와 다릅니다.`);
    if (unitId === "4-2-u6" && (subunit.types.length !== 3 || variants.join(",") !== "0,1,2")) failures.push(`${subunit.name}: 분기가 0,1,2가 아닙니다.`);
  }
  for (const type of types) {
    if (!type.sourceVerified || !type.sourceEvidence.includes(type.label)) failures.push(`${type.id}: 유형별 원본 근거가 없습니다.`);
    if (![-1, 0, 1].includes(type.difficultyBand)) failures.push(`${type.id}: 심화 난이도 층이 없습니다.`);
    const expectedSignature = signatures.get(type.generatorKey)?.[type.variant];
    if (unitId === "4-2-u6" && !expectedSignature) failures.push(`${type.id}: 생성기 분기 서명이 없습니다.`);
    if (type.reviewLocked) {
      try {
        api.generate(type, 0, 0, 910000 + type.typeNumber, type.variant);
        failures.push(`${type.id}: 검수 대기 유형이 직접 생성되었습니다.`);
      } catch (error) {
        if (!/검수 대기/.test(error.message)) failures.push(`${type.id}: 잠금 오류 문구가 분명하지 않습니다.`);
      }
      continue;
    }
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 200; seed += 1) {
        let generated;
        try {
          generated = api.generate(type, 0, difficulty, seed, type.variant);
          generatedCount += 1;
        } catch (error) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          break;
        }
        if (!generated?.prompt || generated.answer === "" || !generated?.solution) {
          failures.push(`${type.id} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
          break;
        }
        if (/undefined|null|NaN|Infinity/.test(`${generated.prompt} ${generated.answer} ${generated.solution}`)) {
          failures.push(`${type.id} / 시드 ${seed}: 계산 결과가 깨졌습니다.`);
          break;
        }
        if (unitId === "4-2-u5" && !generated.prompt.includes(`data-source42-line-item="${type.sourceItemId}"`)) {
          failures.push(`${type.id} / 시드 ${seed}: 원문 문항 ID와 생성기 분기가 다릅니다.`);
          break;
        }
        if (expectedSignature && !generated.prompt.includes(expectedSignature)) {
          failures.push(`${type.id} / 시드 ${seed}: 유형명과 생성기 분기가 다릅니다.`);
          break;
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`4-2 그래프·다각형 유형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-2 꺾은선그래프·다각형 32개 세부 유형 · ${generatedCount.toLocaleString()}회 생성 검수 통과`);
