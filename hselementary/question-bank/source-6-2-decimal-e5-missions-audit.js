"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const source = require("./source-inventory/6-2-source-items.json").items;
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json");
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

assert.equal(review.sourceIdentity.pdfPage, 25);
assert.equal(review.sourceIdentity.printedPage, 27);
assert.equal(review.sourceIdentity.originalChecked, true);
assert.equal(review.sourceIdentity.handwrittenMarksExcluded, true);
assert.equal(review.secondarySourceIdentity.pdfPage, 31);
assert.equal(review.secondarySourceIdentity.printedPage, 27);
assert.equal(review.secondarySourceIdentity.samePrintedWording, true);
assert.equal(review.secondarySourceIdentity.handwrittenMarksPresent, false);
assert.match(review.secondarySourceIdentity.sha256, /^[A-F0-9]{64}$/);
assert.equal(review.officialAnswerEvidence, "not-available-for-these-items");
assert.equal(review.publicReleaseStatus, "partial");
assert.equal(review.independentAnswerEvidence.officialAnswerClaimed, false);
assert.deepEqual(review.missions.map(item => item.sourceItemId), Array.from({ length: 6 }, (_, i) => `6-2-u2-e5-mission-${i + 1}`));
assert.equal(new Set(review.missions.map(item => item.answerContract)).size, 6);

for (const [index, reviewed] of review.missions.entries()) {
  const id = reviewed.sourceItemId;
  const original = source.find(item => item.sourceItemId === id);
  const publicType = types.find(item => item.sourceItemId === id);
  const inventoryType = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === id);
  assert(original && publicType && inventoryType, `${id}: 원문·공개 유형 연결`);
  assert.equal(original.pdfPage, 25);
  assert.equal(original.printedPage, 27);
  assert.equal(original.ordinal, index + 1);
  assert.equal(original.answerContract, reviewed.answerContract);
  assert.equal(original.sourceVerified, true);
  assert.equal(inventoryType.problemVisualRequired, false, `${id}: 원문은 그림 없는 서술형`);
  assert.equal(inventoryType.answerVisualRequired, true);
  const verified = reviewed.candidateVerification?.publicReleaseStatus === "verified";
  assert.equal(publicType.reviewLocked, !verified, `${id}: 검수 상태와 공개 잠금 일치`);
  assert.equal(publicType.generatorKey, verified ? reviewed.candidateVerification.generator : "");
  assert.equal(original.implementationStatus, verified ? "fixed-verified-pool" : original.implementationStatus);
  if (!verified) assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 잠금 항목 출제 금지`);
  if (reviewed.candidateVerification) {
    assert(["locked", "verified"].includes(reviewed.candidateVerification.publicReleaseStatus));
    assert.equal(reviewed.candidateVerification.fixedPoolCount, 3);
    assert.equal(reviewed.candidateVerification.difficultyDesign.length, 3);
    const candidate = verified ? publicType : { ...publicType, reviewLocked: false, generatorKey: reviewed.candidateVerification.generator };
    for (const difficulty of [-1, 0, 1]) {
      const generated = window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, 0);
      assert.equal(generated.sourceItemId, id, `${id}: 후보 문항이 원본 Mission을 가리킴`);
      assert(generated.prompt && generated.answer && generated.solution && generated.answerVisual, `${id}: 문제·정답·풀이·답 그림 존재`);
    }
  }
}

assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").implementationStatus, "ambiguity-locked");
assert.equal(review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").candidateVerification.sourceRelationship,
  "condition-clarified-adaptation", "원문에 없는 물살 조건을 더한 후보임을 명시");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").implementationStatus, "fixed-verified-pool");
assert.match(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").visualRisk, /손글씨/);
assert.equal(review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").overlapWith, "6-2-u2-e5-example-1");
assert(!review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").candidateVerification, "중복 풀이 구조는 별도 후보 생성 전 검수");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").commonPublicTypeId, "6-2-u2-e5-example-1");
const candleExample = types.find(item => item.sourceItemId === "6-2-u2-e5-example-1");
assert(!candleExample?.reviewLocked && candleExample.generatorKey === "sourceGrade6SecondDecimalDivisionE5Example1", "겹치는 양초 유형을 공통 출제");
const burnedHundredthsCm = 2170n - 970n;
assert.equal(burnedHundredthsCm % 24n, 0n, "Mission 5: 0.24cm씩 탄 횟수가 정수");
const elapsedMinutes = burnedHundredthsCm / 24n * 10n;
assert.equal(elapsedMinutes, 8n * 60n + 20n, "Mission 5: 독립 계산한 시간은 8시간 20분");
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").reviewReason, /기준 빠르기/);
assert.equal(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").reviewReason, "");
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").name, /참기름/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-6").name, /갤런/);
console.log("6-2 개념탐구 5 Mission 6문항: 1·2·4 공개, 3 잠금, 5 공통 유형 연결, 6 잠금 검사 통과");
