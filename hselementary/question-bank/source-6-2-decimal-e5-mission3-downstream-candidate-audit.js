"use strict";

// 2026-11-23 사용자 결정 "원본대로 바꿔"로 공개 생성기(이름은 그대로)가 원문 문장·수치를 냅니다.
// 원문에 없는 해석(93.6km는 물이 흐르지 않는 곳에서의 빠르기)은 문제에 넣지 않고 풀이 기준으로만 둡니다.
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
const record = review.sourceRestoration;
assert.equal(record.sourceRelationship, "source-original-still-water-reading");
assert.equal(record.publicReleaseStatus, "verified-as-source");
assert.equal(review.downstreamCandidateVerification.publicReleaseStatus, "superseded-by-source-restoration");
assert(!type.reviewLocked && type.generatorKey === record.generator, "원문 복원 생성기만 공개(생성기 이름 유지)");
assert.equal(type.sourceRelationship, record.sourceRelationship);

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

const source = window.HSE_GENERATORS.generate(type, 0, 0, 1, 0);
assert.equal(source.prompt, "한 시간 동안 47.5km를 가는 빠르기로 흐르는 강이 있습니다. 일정한 빠르기로 1시간 48분 동안 93.6km를 가는 연어가 강물이 흐르는 반대 방향으로 18km를 가는 데 걸리는 시간을 구하세요.");
assert(!source.prompt.includes("물이 흐르는 방향으로") && !source.prompt.includes("21.5"), "원문에 없는 방향·보정 수치 없음");
assert.equal(source.answer, "4시간");
assert(source.solution.startsWith("풀이 기준:"));
// 물이 흐르는 방향으로 읽으면 거슬러 갈 수 없음을 따로 확인(풀이 기준을 쓴 이유)
assert(hourly(hundredths("93.6"), 108n) - 2n * hundredths("47.5") < 0n);

let checked = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, variant);
    const directStill = item.prompt.match(/일정한 빠르기로 1시간 동안 ([\d.]+)km를 가는 연어가/);
    const measuredStill = item.prompt.match(/일정한 빠르기로 (\d+)시간 (\d+)분 동안 ([\d.]+)km를 가는 연어가/);
    const directCurrent = item.prompt.match(/한 시간 동안 ([\d.]+)km를 가는 빠르기로 흐르는 강/);
    const timedCurrent = item.prompt.match(/(\d+)분 동안 ([\d.]+)km를 가는 빠르기로 흐르는 강/);
    const target = item.prompt.match(/반대 방향으로 ([\d.]+)km를 가는 데 걸리는 시간을 구하세요\./);
    assert.equal(Boolean(directStill), level === 0);
    assert.equal(Boolean(measuredStill), level !== 0);
    assert.equal(Boolean(directCurrent), level !== 2);
    assert.equal(Boolean(timedCurrent), level === 2);
    assert(target, "거슬러 갈 거리가 지문에 있음");
    const still = directStill ? hundredths(directStill[1])
      : hourly(hundredths(measuredStill[3]), BigInt(measuredStill[1]) * 60n + BigInt(measuredStill[2]));
    const current = directCurrent ? hundredths(directCurrent[1])
      : hourly(hundredths(timedCurrent[2]), BigInt(timedCurrent[1]));
    const upstream = still - current;
    const distance = hundredths(target[1]);
    assert(upstream > 0n && distance % upstream === 0n, "거슬러 갈 수 있고 시간이 정확히 정해짐");
    const expected = `${distance / upstream}시간`;
    assert.equal(item.answer, expected, "지문에서 독립 계산한 답과 일치");
    assert(item.solution.startsWith("풀이 기준:") && item.solution.includes(expected) && item.answerVisual.includes(expected));
    assert(item.answerVisual.includes('data-source-relationship="source-original-still-water-reading"'));
    assert(item.answerVisual.includes(`data-difficulty-design="${record.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    checked += 1;
  }
  assert.deepEqual(
    window.HSE_GENERATORS.generate(type, 0, difficulty, 1, variant),
    window.HSE_GENERATORS.generate(type, 0, difficulty, 41, variant),
    "검증 묶음은 시드에 따라 바뀌지 않음"
  );
}
assert.equal(checked, 18);
assert.deepEqual([0, 1, 2].map(variant => window.HSE_GENERATORS.generate(type, 0, 0, 1, variant).answer),
  ["4시간", "3시간", "5시간"]);
console.log(`6-2 Mission 3 원문 복원 공개 문항: 3난이도 × 3문항 × 2시드 독립 계산 ${checked}회 통과`);
