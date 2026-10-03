"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-6";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json")
  .missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator);

const tenths = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 1, `소수 한 자리 초과: ${text}`);
  return BigInt(whole) * 10n + BigInt(fraction.padEnd(1, "0"));
};

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, variant);
    const easy = item.prompt.match(/1갤런으로 (\d+)마일, 즉 ([\d.]+)km를 달립니다\. 휘발유 1L로는 ([\d.]+)km를 달립니다/);
    const source = item.prompt.match(/1갤런에 (\d+)마일을 달리고, 휘발유 1L에 ([\d.]+)km를 달립니다\. 1마일은 ([\d.]+)km입니다/);
    const single = item.prompt.match(/휘발유 (\d+)갤런은 몇 L입니까/);
    const split = item.prompt.match(/휘발유 (\d+)갤런과 (\d+)갤런을 사용했다면, 사용한 휘발유는 모두 몇 L입니까/);
    assert.equal(Boolean(easy), level === 0);
    assert.equal(Boolean(source), level !== 0);
    assert.equal(Boolean(split), level === 2);
    assert.equal(Boolean(single), level !== 2);
    const gallons = split ? BigInt(split[1]) + BigInt(split[2]) : BigInt(single[1]);
    const kmPerGallonTenths = easy ? tenths(easy[2]) : BigInt(source[1]) * tenths(source[3]);
    const kmPerLiterTenths = tenths(easy ? easy[3] : source[2]);
    assert(kmPerGallonTenths > 0n && kmPerLiterTenths > 0n && gallons > 0n);
    if (easy) assert.equal(kmPerGallonTenths, BigInt(easy[1]) * 16n, "쉬움의 괄호 속 거리도 원본의 마일 환산과 일치");
    const totalDistanceTenths = gallons * kmPerGallonTenths;
    assert.equal(totalDistanceTenths % kmPerLiterTenths, 0n, "정수 L로 떨어지는 고정 문항");
    const expectedLiters = totalDistanceTenths / kmPerLiterTenths;
    assert.equal(item.answer, `${expectedLiters}L`, "지문 수치로 독립 계산한 답과 일치");
    assert.equal(expectedLiters * kmPerLiterTenths, totalDistanceTenths, "거리로 역산한 연료량 일치");
    assert(item.answerVisual.includes(`${expectedLiters}L`));
    assert(item.answerVisual.includes(`data-difficulty-design="${review.candidateVerification.difficultyDesign[level]}"`));
    assert.equal(item.sourceItemId, sourceItemId);
    assert.equal(item.verifiedPoolIndex, variant);
    assert.equal(item.verifiedVariantCount, 3);
    checks += 1;
  }
  assert.deepEqual(
    window.HSE_GENERATORS.generate(type, 0, difficulty, 1, variant),
    window.HSE_GENERATORS.generate(type, 0, difficulty, 41, variant),
    "고정 문항은 시드에 따라 바뀌지 않음"
  );
}
const original = window.HSE_GENERATORS.generate(type, 0, 0, 1, 0);
assert(original.prompt.includes("1갤런에 30마일") && original.prompt.includes("1L에 12.8km")
  && original.prompt.includes("1마일은 1.6km") && original.prompt.includes("100갤런"));
assert.equal(original.answer, "375L");
assert.equal(checks, 18);
console.log(`6-2 개념탐구 5 Mission 6: 원문 375L, 지문 독립 계산·역산 ${checks}회 통과`);
