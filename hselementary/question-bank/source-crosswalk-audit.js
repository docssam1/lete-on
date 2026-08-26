"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const crosswalks = [
  require("./source-inventory/4-1-crosswalk-units-1-2.json"),
  require("./source-inventory/4-1-crosswalk-units-3-4.json"),
  require("./source-inventory/4-1-crosswalk-units-5-6.json")
];
const generatorApi = window.HSE_GENERATORS;
const sourceIds = new Set(inventory.items.map(item => item.sourceItemId));
const mappedSourceIds = new Set();
const currentTypeIds = new Set();
const failures = [];
let generatedCount = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(crosswalks.reduce((sum, item) => sum + item.currentTypesTotal, 0) === 95, "기존 4-1 유형 합계는 95개여야 합니다.");
check(crosswalks.reduce((sum, item) => sum + item.verifiedMappings, 0) === 13, "검증된 원문 매핑은 13개여야 합니다.");
check(crosswalks.reduce((sum, item) => sum + item.unmatchedCurrentTypes.length, 0) === 82, "미매칭 기존 유형은 82개여야 합니다.");

for (const crosswalk of crosswalks) {
  check(crosswalk.status === "verified-crosswalk", `${crosswalk.units.join("-")}: 교차표가 검증 상태가 아닙니다.`);
  check(crosswalk.mappings.length === crosswalk.verifiedMappings, `${crosswalk.units.join("-")}: 매핑 집계가 다릅니다.`);
  check(crosswalk.mappings.length + crosswalk.unmatchedCurrentTypes.length === crosswalk.currentTypesTotal, `${crosswalk.units.join("-")}: 기존 유형 전수가 포함되지 않았습니다.`);
  check(crosswalk.duplicateSourceIds === 0, `${crosswalk.units.join("-")}: 중복 원문 ID가 보고됐습니다.`);

  for (const mapping of crosswalk.mappings) {
    check(!currentTypeIds.has(mapping.currentTypeId), `${mapping.currentTypeId}: 기존 유형 ID가 중복됩니다.`);
    currentTypeIds.add(mapping.currentTypeId);
    check(sourceIds.has(mapping.sourceItemId), `${mapping.currentTypeId}: 원문 ID ${mapping.sourceItemId}가 목록에 없습니다.`);
    check(!mappedSourceIds.has(mapping.sourceItemId), `${mapping.sourceItemId}: 둘 이상의 생성기가 연결됐습니다.`);
    mappedSourceIds.add(mapping.sourceItemId);
    check(mapping.status === "verified" && Boolean(mapping.evidence), `${mapping.currentTypeId}: 시각 대조 근거가 없습니다.`);
    check(Number.isInteger(mapping.variant), `${mapping.currentTypeId}: 생성기 분기가 없습니다.`);
    check([-1, 0, 1].includes(mapping.difficultyBand), `${mapping.currentTypeId}: 난이도 층이 올바르지 않습니다.`);
    check(Boolean(generatorApi.generatorKey(mapping)), `${mapping.currentTypeId}: 생성기 키가 등록되지 않았습니다.`);

    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 100; seed += 1) {
        let generated;
        try {
          generated = generatorApi.generate(mapping, 0, difficulty, seed, mapping.variant);
          generatedCount += 1;
        } catch (error) {
          failures.push(`${mapping.currentTypeId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          break;
        }
        check(Boolean(generated?.prompt && generated?.solution && generated?.answer !== undefined), `${mapping.currentTypeId} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
        check(!/undefined|null|NaN|Infinity/.test(`${generated?.prompt} ${generated?.answer} ${generated?.solution}`), `${mapping.currentTypeId} / 시드 ${seed}: 잘못된 값이 노출됩니다.`);
      }
    }
  }

  for (const unmatched of crosswalk.unmatchedCurrentTypes) {
    check(!currentTypeIds.has(unmatched.currentTypeId), `${unmatched.currentTypeId}: 기존 유형 ID가 중복됩니다.`);
    currentTypeIds.add(unmatched.currentTypeId);
    check(Boolean(unmatched.reason), `${unmatched.currentTypeId}: 미매칭 사유가 없습니다.`);
  }
}

check(currentTypeIds.size === 95, `기존 유형 ID는 95개여야 하나 ${currentTypeIds.size}개입니다.`);
check(mappedSourceIds.size === 13, `활성화 가능한 원문 유형은 13개여야 하나 ${mappedSourceIds.size}개입니다.`);

if (failures.length) {
  console.error(`4-1 생성기-원문 교차표 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-1 생성기-원문 교차표 감사 통과: 기존 95개 중 정확 일치 13개 · 보류 82개 · ${generatedCount.toLocaleString()}회 생성`);
