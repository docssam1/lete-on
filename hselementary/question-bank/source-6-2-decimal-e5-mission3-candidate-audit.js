"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-3";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json").missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert.equal(review.candidateVerification.sourceRelationship, "condition-clarified-adaptation");
assert.equal(review.candidateVerification.publicReleaseStatus, "locked", "물살 없는 곳으로 읽은 후보는 잠금 유지");
assert(!type.reviewLocked && type.generatorKey !== review.candidateVerification.generator,
  "공개 생성기는 물살 없는 곳 해석 후보를 사용하지 않음");
const candidate = { ...type, reviewLocked: false, generatorKey: review.candidateVerification.generator };

const hundredths = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 2, `거리의 소수 자리 초과: ${text}`);
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
};
const speed = (distanceHundredths, minutes) => {
  const scaled = distanceHundredths * 60n;
  assert(minutes > 0n && scaled % minutes === 0n, "1시간 거리가 정확히 정해짐");
  return scaled / minutes;
};

const originalStillSpeed = speed(hundredths("93.6"), 108n);
const originalUpstreamSpeed = originalStillSpeed - hundredths("47.5");
assert.equal(originalStillSpeed, hundredths("52"));
assert.equal(originalUpstreamSpeed, hundredths("4.5"));
assert.equal(hundredths("18") / originalUpstreamSpeed, 4n);
const downstreamReferenceStillSpeed = originalStillSpeed - hundredths("47.5");
assert.equal(downstreamReferenceStillSpeed, hundredths("4.5"));
assert(downstreamReferenceStillSpeed - hundredths("47.5") < 0n,
  "93.6km가 물살 방향의 이동 거리였다면 인쇄된 반대 방향으로는 나아갈 수 없음");
assert.notEqual(hundredths("18") * 60n / 20n, originalUpstreamSpeed, "손글씨 20분은 이 해석의 거슬러 가는 빠르기와 맞지 않음");
const clarified = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(clarified.prompt.includes("물이 흐르지 않는 곳에서 1시간 48분 동안 93.6km"));
assert(clarified.prompt.includes("1시간에 47.5km"));
assert(clarified.prompt.includes("반대 방향으로 18km"));
assert.equal(clarified.answer, "4시간");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    assert(item.prompt.includes("물이 흐르지 않는 곳에서"), "후보는 원문의 빠진 조건을 명시");
    const directStill = item.prompt.match(/물이 흐르지 않는 곳에서 1시간에 ([\d.]+)km/);
    const measuredStill = item.prompt.match(/물이 흐르지 않는 곳에서 (\d+)시간 (\d+)분 동안 ([\d.]+)km/);
    const directCurrent = item.prompt.match(/강물은 1시간에 ([\d.]+)km 흐릅니다/);
    const timedCurrent = item.prompt.match(/강물은 (\d+)분 동안 ([\d.]+)km 흐릅니다/);
    const target = item.prompt.match(/반대 방향으로 ([\d.]+)km를 가는 데/);
    assert.equal(Boolean(directStill), level === 0);
    assert.equal(Boolean(measuredStill), level !== 0);
    assert.equal(Boolean(directCurrent), level !== 2);
    assert.equal(Boolean(timedCurrent), level === 2);
    assert(!item.prompt.includes("나뭇잎"), "원문에 없는 과장된 장면을 추가하지 않음");
    assert(target, "거슬러 갈 거리가 지문에 있음");
    const still = directStill ? hundredths(directStill[1])
      : speed(hundredths(measuredStill[3]), BigInt(measuredStill[1]) * 60n + BigInt(measuredStill[2]));
    const current = directCurrent ? hundredths(directCurrent[1])
      : speed(hundredths(timedCurrent[2]), BigInt(timedCurrent[1]));
    const upstream = still - current;
    const distance = hundredths(target[1]);
    assert(upstream > 0n && distance % upstream === 0n, "거슬러 갈 수 있고 시간이 정확히 정해짐");
    const expected = `${distance / upstream}시간`;
    assert.equal(item.answer, expected, "지문만으로 독립 계산한 시간과 일치");
    assert(item.solution.includes(expected) && item.answerVisual.includes(expected));
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    checks += 1;
  }
  assert.deepEqual(
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant),
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 41, variant),
    "고정 묶음은 시드에 따라 바뀌지 않음"
  );
}
assert.equal(checks, 18);
assert.equal(new Set([0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, 0, 1, variant).answer)).size, 3,
  "세 고정 묶음은 답도 다름");
console.log(`6-2 개념탐구 5 Mission 3 조건 명시 잠금 후보: 3난이도 × 3고정 묶음 × 2시드 독립 계산 ${checks}회 통과`);
