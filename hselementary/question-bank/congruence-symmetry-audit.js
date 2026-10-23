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

assert.equal(legacyTypes.length, 24, "The 24 pre-existing Unit 3 types stay present");
assert.equal(sourceTypes.filter(Boolean).length, 3, "All three printed-page-31 items are mapped");

let legacyLockChecks = 0;
for (const type of legacyTypes) {
  assert.equal(type.reviewLocked, true, `${type.id}: legacy review lock stays enabled`);
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
  assert.equal(type.verifiedVariantTarget, 3);
  const shouldRemainLocked = index === 0;
  assert.equal(type.verifiedVariantCount, shouldRemainLocked ? 0 : 3);
  assert.equal(type.reviewLocked, shouldRemainLocked);
  assert.equal(api.generatorKey(type), shouldRemainLocked ? "" : definition.generatorKey);

  for (const difficulty of [-1, 0, 1]) {
    for (let variant = 0; variant < 3; variant += 1) {
      const generated = api.generate(type, 0, difficulty, 1, variant);
      if (shouldRemainLocked) {
        assert.equal(generated, null, `${type.id}: the unverified solution must stay unavailable`);
        lockedConfigurations += 1;
        continue;
      }
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

assert.equal(availableConfigurations, 18);
assert.equal(lockedConfigurations, 9);
console.log(`합동·대칭 공개 경계 감사 통과: 기존 24유형 잠금 ${legacyLockChecks}회 확인 · 인쇄 31쪽 신규 27조합 중 공개 후보 18 · 초등 풀이 미검증 잠금 9`);
