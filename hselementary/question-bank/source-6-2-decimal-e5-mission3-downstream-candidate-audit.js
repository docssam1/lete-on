"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-3";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json")
  .missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
const candidateRecord = review.downstreamCandidateVerification;
assert.equal(candidateRecord.sourceRelationship, "downstream-number-corrected-adaptation");
assert.equal(candidateRecord.publicReleaseStatus, "locked");
assert(type.reviewLocked && type.generatorKey === "", "원문 조건 오류 문항은 공개 잠금");
assert.equal(window.HSE_GENERATORS.generate(type, 0, 0, 1), null);
const candidate = { ...type, reviewLocked: false, generatorKey: candidateRecord.generator };

const hundredths = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 2, `소수 자릿수 초과: ${text}`);
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
};
const hourly = (distance, minutes) => {
  const scaled = distance * 60n;
  assert(minutes > 0n && scaled % minutes === 0n, "1시간 거리가 정확히 정해짐");
  return scaled / minutes;
};

const sourceLike = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(sourceLike.prompt.includes("1시간 48분 동안 93.6km"));
assert(sourceLike.prompt.includes("1시간에 21.5km"));
assert(sourceLike.prompt.includes("반대 방향으로 18km"));
assert.equal(sourceLike.answer, "2시간");

let checked = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const directDownstream = item.prompt.match(/물이 흐르는 방향으로 1시간에 ([\d.]+)km 갑니다/);
    const measuredDownstream = item.prompt.match(/물이 흐르는 방향으로 (\d+)시간 (\d+)분 동안 ([\d.]+)km 갔습니다/);
    const directCurrent = item.prompt.match(/강물은 1시간에 ([\d.]+)km 흐릅니다/);
    const timedCurrent = item.prompt.match(/강물은 (\d+)분 동안 ([\d.]+)km 흐릅니다/);
    const target = item.prompt.match(/반대 방향으로 ([\d.]+)km를 가는 데/);
    assert.equal(Boolean(directDownstream), level === 0);
    assert.equal(Boolean(measuredDownstream), level !== 0);
    assert.equal(Boolean(directCurrent), level !== 2);
    assert.equal(Boolean(timedCurrent), level === 2);
    assert(target && item.prompt.includes("헤엄치는 빠르기를 바꾸지 않고 같은 강에서"));
    const downstream = directDownstream ? hundredths(directDownstream[1])
      : hourly(hundredths(measuredDownstream[3]), BigInt(measuredDownstream[1]) * 60n + BigInt(measuredDownstream[2]));
    const current = directCurrent ? hundredths(directCurrent[1])
      : hourly(hundredths(timedCurrent[2]), BigInt(timedCurrent[1]));
    const stillWater = downstream - current;
    const upstream = stillWater - current;
    const distance = hundredths(target[1]);
    assert(stillWater > current && upstream > 0n, "연어가 강을 거슬러 갈 수 있음");
    assert.equal(distance % upstream, 0n, "상류 이동 시간이 정확히 정해짐");
    const expected = `${distance / upstream}시간`;
    assert.equal(item.answer, expected, "지문에서 독립 계산한 답과 일치");
    assert(item.solution.includes(expected) && item.answerVisual.includes(expected));
    assert(item.answerVisual.includes('data-source-relationship="downstream-number-corrected-adaptation"'));
    assert(item.answerVisual.includes(`data-difficulty-design="${candidateRecord.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    checked += 1;
  }
  assert.deepEqual(
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant),
    window.HSE_GENERATORS.generate(candidate, 0, difficulty, 41, variant),
    "검증 묶음은 시드에 따라 바뀌지 않음"
  );
}
assert.equal(checked, 18);
assert.deepEqual([0, 1, 2].map(variant => window.HSE_GENERATORS.generate(candidate, 0, 0, 1, variant).answer),
  ["2시간", "3시간", "4시간"]);
console.log(`6-2 Mission 3 하류 조건 보정 잠금 후보: 3난이도 × 3문항 × 2시드 독립 계산 ${checked}회 통과`);
