"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-congruence-page31.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u3");
const types = unit.subunits.flatMap(subunit => subunit.types);
const sourceIds = source.definitions.map(definition => definition.sourceItemId);
const legacyTypes = types.filter(type => !sourceIds.includes(type.sourceItemId));
const sourceTypes = source.definitions.map(definition => types.find(type => type.sourceItemId === definition.sourceItemId));

// 2026-11 이후 5-2 3단원의 나머지 유형은 원문 대조 유형(sourceItemId·generatorKey)으로 바뀌어 공개된다.
// 예전 24개 잠금 유형 고정 수 대신, 나머지 유형이 잠겨 있거나 원문 근거와 생성기를 함께 가졌는지 확인한다.
assert(legacyTypes.length > 0, "Unit 3 keeps its other types");
const lockedLegacyTypes = legacyTypes.filter(type => type.reviewLocked);
for (const type of legacyTypes.filter(type => !type.reviewLocked)) {
  assert(type.sourceItemId && type.generatorKey && type.sourceVerified === true, `${type.id}: public Unit 3 type must cite a verified source item and generator`);
}
// 2026-11 이후 이 파일은 31쪽 계열 유사문항 7개(예제 2 포함)와 원문 그대로 문항 7개(-original)를 함께 정의한다.
assert(source.definitions.length >= 6, "Page-31 definitions stay present");
assert.equal(sourceTypes.filter(Boolean).length, source.definitions.length, "All reviewed printed-page-31 items are mapped");

let legacyLockChecks = 0;
for (const type of lockedLegacyTypes) {
  assert.equal(api.generatorKey(type), "", `${type.id}: no generator key is exposed`);
  for (const difficulty of [-1, 0, 1]) {
    for (const seed of [1, 175, 350]) {
      assert.equal(api.generate(type, 0, difficulty, seed, type.variant ?? 0), null, `${type.id}: locked generation stays blocked`);
      legacyLockChecks += 1;
    }
  }
}

let availableConfigurations = 0;
let lockedConfigurations = 0;
for (let index = 0; index < sourceTypes.length; index += 1) {
  const type = sourceTypes[index];
  const definition = source.definitions[index];
  assert(type, `${definition.sourceItemId}: type exists`);
  assert.equal(type.generatorKey, definition.generatorKey);
  assert.equal(type.sourceVerified, true);
  assert.equal(type.publisherKeyVerified, false);
  const poolSize = /-original$/.test(definition.sourceItemId) ? 1 : type.verifiedVariantCount;
  assert(poolSize >= 1 && (/-original$/.test(definition.sourceItemId) ? type.verifiedVariantCount === 1 : poolSize >= 3), `${type.id}: verified pool size`);
  assert.equal(type.verifiedVariantTarget, type.verifiedVariantCount);
  assert.equal(type.reviewLocked, false);
  assert.equal(api.generatorKey(type), definition.generatorKey);

  for (const difficulty of [-1, 0, 1]) {
    for (let variant = 0; variant < poolSize; variant += 1) {
      const generated = api.generate(type, 0, difficulty, 1, variant);
      assert(generated?.prompt && generated.answer !== undefined && generated.solution, `${type.id}: complete generated content`);
      assert.equal(generated.sourceItemId, type.sourceItemId);
      assert.equal(generated.generator, type.generatorKey);
      assert.equal(generated.verifiedPoolIndex, variant);
      assert.equal(generated.publisherKeyVerified, false);
      assert.match(generated.prompt, /<svg[^>]+role="img"[^>]+aria-label="[^"]+"/);
      assert.doesNotMatch(`${generated.prompt}${generated.answer}${generated.solution}`, /NaN|Infinity|undefined/);
      availableConfigurations += 1;
    }
  }
}

const expectedConfigurations = sourceTypes.reduce((total, type) => total + 3 * type.verifiedVariantCount, 0);
assert.equal(availableConfigurations, expectedConfigurations);
assert.equal(lockedConfigurations, 0);
console.log(`합동·대칭 공개 경계 감사 통과: 다른 유형 ${legacyTypes.length}개(잠금 ${lockedLegacyTypes.length}개, 잠금 생성 차단 ${legacyLockChecks}회) · 인쇄 31쪽 계열 ${sourceTypes.length}유형 공개 ${availableConfigurations}조합`);
