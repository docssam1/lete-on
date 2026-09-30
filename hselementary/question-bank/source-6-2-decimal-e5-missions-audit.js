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
assert.match(review.nonMatchingAnswerSource.sha256, /^[A-F0-9]{64}$/);
assert.match(review.nonMatchingAnswerSource.reason, /not an answer key/);
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
  const publicCandidate = reviewed.downstreamCandidateVerification?.publicReleaseStatus === "verified-as-adaptation"
    ? reviewed.downstreamCandidateVerification
    : reviewed.candidateVerification?.publicReleaseStatus === "verified" ? reviewed.candidateVerification : null;
  const verified = Boolean(publicCandidate);
  assert.equal(publicType.reviewLocked, !verified, `${id}: 검수 상태와 공개 잠금 일치`);
  assert.equal(publicType.generatorKey, verified ? publicCandidate.generator : "");
  assert.equal(original.implementationStatus, verified ? "fixed-verified-pool" : original.implementationStatus);
  if (!verified) assert.equal(window.HSE_GENERATORS.generate(publicType, 0, 0, 1), null, `${id}: 잠금 항목 출제 금지`);
  if (reviewed.candidateVerification) {
    assert(["locked", "verified"].includes(reviewed.candidateVerification.publicReleaseStatus));
    assert.equal(reviewed.candidateVerification.fixedPoolCount, 3);
    assert.equal(reviewed.candidateVerification.difficultyDesign.length, 3);
    const candidate = publicCandidate === reviewed.candidateVerification ? publicType
      : { ...publicType, reviewLocked: false, generatorKey: reviewed.candidateVerification.generator };
    for (const difficulty of [-1, 0, 1]) {
      const generated = window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, 0);
      assert.equal(generated.sourceItemId, id, `${id}: 후보 문항이 원본 Mission을 가리킴`);
      assert(generated.prompt && generated.answer && generated.solution && generated.answerVisual, `${id}: 문제·정답·풀이·답 그림 존재`);
    }
  }
}

assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").implementationStatus, "fixed-verified-pool");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").originalPrintStatus, "ambiguity-locked");
assert.equal(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").sourceRelationship, "downstream-number-corrected-adaptation");
assert.equal(review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").candidateVerification.sourceRelationship,
  "condition-clarified-adaptation", "원문에 없는 물살 조건을 더한 후보임을 명시");
const mission3Downstream = review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").downstreamCandidateVerification;
assert.equal(mission3Downstream.sourceRelationship, "downstream-number-corrected-adaptation");
assert.equal(mission3Downstream.publicReleaseStatus, "verified-as-adaptation", "하류 보정 문제만 원문과 구분해 공개");
assert.equal(mission3Downstream.fixedPoolCount, 3);
const referenceMinutes = 108n;
const downstreamSpeedHundredths = 9360n * 60n / referenceMinutes;
const currentSpeedHundredths = 4750n;
assert.equal(downstreamSpeedHundredths, 5200n, "Mission 3: 93.6km를 1시간 48분에 간 빠르기");
const stillWaterSpeedIfDownstream = downstreamSpeedHundredths - currentSpeedHundredths;
assert.equal(stillWaterSpeedIfDownstream, 450n);
assert(stillWaterSpeedIfDownstream - currentSpeedHundredths <= 0n,
  "Mission 3: 앞선 이동이 하류라면 인쇄된 상류 이동은 불가능");
const upstreamSpeedIfStillWater = downstreamSpeedHundredths - currentSpeedHundredths;
assert.equal(1800n * 60n / upstreamSpeedIfStillWater, 240n,
  "Mission 3: 앞선 빠르기가 물살 없는 곳의 빠르기라면 4시간이지만 원문 조건에는 없음");
const mission3Interpretation = review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").interpretationAudit;
assert.equal(mission3Interpretation.firstLegDirectionPrinted, false);
assert.equal(mission3Interpretation.referenceSpeedKmh, Number(downstreamSpeedHundredths) / 100);
assert.equal(mission3Interpretation.downstreamReadingUpstreamSpeedKmh,
  Number(stillWaterSpeedIfDownstream - currentSpeedHundredths) / 100);
assert.equal(mission3Interpretation.stillWaterReadingUpstreamSpeedKmh, Number(upstreamSpeedIfStillWater) / 100);
assert.equal(mission3Interpretation.stillWaterReadingTimeHours, 4);
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").implementationStatus, "fixed-verified-pool");
assert.match(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").visualRisk, /손글씨/);
assert.equal(review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").overlapWith, "6-2-u2-e5-example-1");
assert(!review.missions.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").candidateVerification, "중복 풀이 구조는 별도 후보 생성 전 검수");
assert.equal(source.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").commonPublicTypeId, "6-2-u2-e5-example-1");
assert.equal(window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").commonPublicTypeId,
  "6-2-u2-e5-example-1", "원문 공통 유형 연결이 공개 분류표에도 남아 있음");
assert.equal(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-5").commonPublicTypeId,
  "6-2-u2-e5-example-1", "원문 공통 유형 연결이 화면 유형에도 전달됨");
const candleExample = types.find(item => item.sourceItemId === "6-2-u2-e5-example-1");
assert(!candleExample?.reviewLocked && candleExample.generatorKey === "sourceGrade6SecondDecimalDivisionE5Example1", "겹치는 양초 유형을 공통 출제");
const burnedHundredthsCm = 2170n - 970n;
assert.equal(burnedHundredthsCm % 24n, 0n, "Mission 5: 0.24cm씩 탄 횟수가 정수");
const elapsedMinutes = burnedHundredthsCm / 24n * 10n;
assert.equal(elapsedMinutes, 8n * 60n + 20n, "Mission 5: 독립 계산한 시간은 8시간 20분");
assert.equal(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-3").reviewReason, "");
assert.equal(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").reviewReason, "");
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-4").name, /참기름/);
assert.match(types.find(item => item.sourceItemId === "6-2-u2-e5-mission-6").name, /갤런/);
console.log("6-2 개념탐구 5 Mission 6문항: 1·2·4 공개, 3 원문 잠금·보정 유사문항 공개, 5 공통 유형 연결, 6 잠금 검사 통과");
