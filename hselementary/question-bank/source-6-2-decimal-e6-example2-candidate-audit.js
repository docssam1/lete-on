"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e6-example-2";
const sourceItem = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"))
  .items.find(item => item.sourceItemId === sourceItemId);
assert.equal(sourceItem?.candidateVerification?.generator, "sourceGrade6SecondDecimalDivisionE6Example2Candidate");
assert.equal(sourceItem?.candidateVerification?.publicReleaseStatus, "locked-pending-matching-publisher-key-and-live-worksheet-review");
assert.equal(sourceItem?.nonMatchingAnswerSource?.sha256, "3B71EDCF9C234B180A08A73905B16F6065F833160E499223D413ED65792BACF0");
const lockedType = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(type => type.sourceItemId === sourceItemId);
assert(lockedType?.reviewLocked, "원본 답과 화면 검수 전에는 잠금 유지");
assert.equal(lockedType.generatorKey, "");
const candidateType = { ...lockedType, reviewLocked: false, generatorKey: "sourceGrade6SecondDecimalDivisionE6Example2Candidate" };

const hundredths = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 2, `소수 둘째 자리 초과: ${text}`);
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
};

let checks = 0;
for (const difficulty of [-1, 0, 1]) {
  const level = difficulty + 1;
  const prompts = new Set();
  for (let variant = 0; variant < 3; variant += 1) {
    for (const seed of [1, 41]) {
      const item = window.HSE_GENERATORS.generate(candidateType, 0, difficulty, seed, variant);
      const distances = [...item.prompt.matchAll(/([\d.]+)m/g)].map(match => hundredths(match[1]));
      assert.equal(distances.length, 3, "기준 거리·1℃당 증가량·목표 거리가 모두 있어야 함");
      const [baselineSpeed, increasePerDegree, observed] = distances;
      const baselineTemperature = level === 2 ? 5n : 0n;
      const seconds = level === 0 ? 1n : BigInt(item.prompt.match(/(\d+)초 동안/)?.[1] || 0);
      assert(seconds > 0n && increasePerDegree > 0n);
      assert.equal(observed % seconds, 0n, "1초 거리가 정확해야 함");
      const speed = observed / seconds;
      assert(speed > baselineSpeed && (speed - baselineSpeed) % increasePerDegree === 0n);
      const expectedTemperature = baselineTemperature + (speed - baselineSpeed) / increasePerDegree;
      assert.equal(item.answer, `${expectedTemperature}℃`, "지문만으로 재계산한 답");
      assert.equal((baselineSpeed + (expectedTemperature - baselineTemperature) * increasePerDegree) * seconds, observed, "거리 역산");
      assert(item.answerVisual.includes(item.answer));
      assert(!item.prompt.includes("따라서") && !item.prompt.includes("정답"), "문제에 풀이가 들어가면 안 됨");
      assert.equal(item.verifiedPoolIndex, variant);
      assert.equal(item.verifiedVariantCount, 3);
      assert.equal(item.sourceItemId, sourceItemId);
      prompts.add(item.prompt);
      checks += 1;
    }
    assert.deepEqual(
      window.HSE_GENERATORS.generate(candidateType, 0, difficulty, 1, variant),
      window.HSE_GENERATORS.generate(candidateType, 0, difficulty, 41, variant),
      "고정 문항은 시드가 달라도 같아야 함"
    );
  }
  assert.equal(prompts.size, 3, "세 고정 문항은 서로 달라야 함");
}

const original = window.HSE_GENERATORS.generate(candidateType, 0, 0, 1, 0);
assert(original.prompt.includes("0℃") && original.prompt.includes("331.5m")
  && original.prompt.includes("0.61m") && original.prompt.includes("5초")
  && original.prompt.includes("1736.8m"));
assert.equal(original.answer, "26℃");
console.log(`6-2 개념탐구 6 예제 6-2: 원본 수치·독립 역산 ${checks}회 통과, 공개 잠금 유지`);
