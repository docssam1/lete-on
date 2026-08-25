"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-1");
const expectedCounts = new Map([
  ["4-1-u4", 12],
  ["4-1-u5", 6],
  ["4-1-u6", 23]
]);
const expectedRuleVariants = new Map([
  ["advancedLinePattern", ["다음 수열의", "두 규칙이 번갈아", "분자와 분모의 규칙"]],
  ["arrayNumberRules", ["자연수를 한 줄에", "첫째 줄에 1개", "몇 번째 줄의 왼쪽에서 몇 번째 위치"]],
  ["advancedArraySum", ["씩 커지는 수를", "연속된 홀수를", "연속한 자연수 9개"]],
  ["advancedOperationRule", ["★의 규칙", "두 연산의 규칙", "세 꼭짓점의 수"]],
  ["conditionedNumberCount", ["수 카드", "자연수를 차례로 쓸 때 숫자", "차례로 썼습니다"]]
]);
const allowedTiers = new Set(["ability", "advanced", "advanced-contest-overlap"]);
const failures = [];
const seenIds = new Set();
let generatedCount = 0;

for (const [unitId, expectedCount] of expectedCounts) {
  const unit = semester.units.find(item => item.id === unitId);
  if (!unit) {
    failures.push(`${unitId}: 단원이 없습니다.`);
    continue;
  }
  const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    unitId: unit.id,
    unitName: unit.name,
    subunitName: subunit.name
  })));
  if (types.length !== expectedCount) failures.push(`${unit.name}: ${types.length}유형이며 예상 ${expectedCount}유형과 다릅니다.`);

  for (const subunit of unit.subunits) {
    if (subunit.types.length === 3) {
      const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b);
      if (variants.join(",") !== "0,1,2") failures.push(`${unit.name} / ${subunit.name}: 분기가 0,1,2가 아닙니다.`);
    }
  }

  for (const type of types) {
    if (seenIds.has(type.id)) failures.push(`${type.id}: 유형 ID가 중복됩니다.`);
    seenIds.add(type.id);
    if (![-1, 0, 1].includes(type.difficultyBand)) failures.push(`${type.id}: 심화 난이도 층이 없습니다.`);
    if (!allowedTiers.has(type.sourceTier)) failures.push(`${type.id}: 허용되지 않은 원본 층 ${type.sourceTier}`);
    if (!type.sourceVerified || !type.sourceEvidence) failures.push(`${type.id}: 원본 대조 근거가 없습니다.`);
    if (!type.sourceEvidence.includes(type.label)) failures.push(`${type.id}: 유형 구조명이 원본 대조 근거에 없습니다.`);
    if (type.sourceTier.includes("contest") && type.sourceTier !== "advanced-contest-overlap") {
      failures.push(`${type.id}: 중복 구조를 경시 고유로 표시했습니다.`);
    }
    if (!api.generatorKey(type)) failures.push(`${type.id}: 생성기가 연결되지 않았습니다.`);

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
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
          break;
        }
        if (/undefined|null|NaN|Infinity/.test(`${generated.prompt} ${generated.answer} ${generated.solution}`)) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 잘못된 계산 결과가 노출됩니다.`);
          break;
        }
        if (type.generatorKey === "advancedArraySum" && /²|제곱/.test(`${generated.prompt} ${generated.solution}`)) {
          failures.push(`${type.id} / 시드 ${seed}: 4학년 범위를 벗어난 제곱 표기가 노출됩니다.`);
          break;
        }
        const signatures = expectedRuleVariants.get(type.generatorKey);
        if (signatures && !generated.prompt.includes(signatures[type.variant])) {
          failures.push(`${type.id} / 시드 ${seed}: 유형명과 생성기 분기가 다릅니다.`);
          break;
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`4-1 나머지 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-1 평면도형 이동·막대그래프·규칙 찾기 41개 세부 유형 · ${generatedCount.toLocaleString()}회 생성 검수 통과`);
