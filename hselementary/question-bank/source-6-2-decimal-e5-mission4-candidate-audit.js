"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const sourceItemId = "6-2-u2-e5-mission-4";
const review = require("./source-inventory/6-2-u2-e5-missions-source-review.json").missions.find(item => item.sourceItemId === sourceItemId);
const type = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types)
  .find(item => item.sourceItemId === sourceItemId);
assert(!type.reviewLocked && type.generatorKey === review.candidateVerification.generator, "손글씨를 제외하고 독립 검산한 실제 유형 연결");
const candidate = type;

const thousandths = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 3, `소수 자리 초과: ${text}`);
  return BigInt(whole) * 1000n + BigInt(fraction.padEnd(3, "0"));
};
const kg = grams => `${grams / 1000n}${grams % 1000n ? `.${String(grams % 1000n).padStart(3, "0").replace(/0+$/, "")}` : ""}kg`;
const perLiter = (usedMl, massDifferenceG) => {
  assert(usedMl > 0n && massDifferenceG > 0n);
  assert.equal(massDifferenceG * 1000n % usedMl, 0n, "참기름 1L 무게가 g 단위로 정확히 정해짐");
  return massDifferenceG * 1000n / usedMl;
};
const oilMass = (volumeMl, densityGPerLiter) => {
  assert.equal(volumeMl * densityGPerLiter % 1000n, 0n, "참기름 무게가 g 단위로 정확히 정해짐");
  return volumeMl * densityGPerLiter / 1000n;
};

// 인쇄 수치로만 빈 통의 무게를 구하고, 두 번째 측정값에 다시 대입한다.
const sourceDensity = perLiter(thousandths("1.75"), thousandths("6.11") - thousandths("4.5"));
assert.equal(sourceDensity, 920n);
const sourceTare = thousandths("6.11") - oilMass(thousandths("6"), sourceDensity);
assert.equal(sourceTare, 590n);
assert.equal(sourceTare + oilMass(thousandths("6") - thousandths("1.75"), sourceDensity), thousandths("4.5"));
assert.notEqual(690n + oilMass(thousandths("6") - thousandths("1.75"), sourceDensity), thousandths("4.5"),
  "손풀이 0.69kg은 인쇄 조건과 충돌함");
const originalShape = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(originalShape.prompt.includes("참기름 6L가 들어 있는 통의 무게는 6.11kg"));
assert(originalShape.prompt.includes("참기름 1.75L를 사용한 뒤 무게는 4.5kg"));
assert.equal(originalShape.answer, "0.59kg");

let checks = 0;
for (const difficulty of [-1, 0, 1]) for (let variant = 0; variant < 3; variant += 1) {
  const level = difficulty + 1;
  for (const seed of [1, 41]) {
    const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
    const easy = item.prompt.match(/참기름 ([\d.]+)L가 들어 있는 통의 무게는 ([\d.]+)kg입니다\. 참기름 1L의 무게는 ([\d.]+)kg/);
    const source = item.prompt.match(/참기름 ([\d.]+)L가 들어 있는 통의 무게는 ([\d.]+)kg입니다\. 이 통에서 참기름 ([\d.]+)L를 사용한 뒤 무게는 ([\d.]+)kg/);
    const hard = item.prompt.match(/처음 참기름 ([\d.]+)L가 들어 있었습니다\. 참기름 ([\d.]+)L를 사용한 뒤 통의 무게는 ([\d.]+)kg, 참기름 ([\d.]+)L를 더 사용한 뒤 통의 무게는 ([\d.]+)kg/);
    assert.equal(Boolean(easy), level === 0);
    assert.equal(Boolean(source), level === 1);
    assert.equal(Boolean(hard), level === 2);
    let tare;
    if (easy) {
      tare = thousandths(easy[2]) - oilMass(thousandths(easy[1]), thousandths(easy[3]));
    } else if (source) {
      const fullMl = thousandths(source[1]);
      const fullG = thousandths(source[2]);
      const usedMl = thousandths(source[3]);
      const afterG = thousandths(source[4]);
      const density = perLiter(usedMl, fullG - afterG);
      tare = fullG - oilMass(fullMl, density);
      assert.equal(tare + oilMass(fullMl - usedMl, density), afterG, "두 측정값 모두 재대입 통과");
    } else {
      const fullMl = thousandths(hard[1]);
      const firstUsedMl = thousandths(hard[2]);
      const firstMassG = thousandths(hard[3]);
      const secondUsedMl = thousandths(hard[4]);
      const lastMassG = thousandths(hard[5]);
      const density = perLiter(secondUsedMl, firstMassG - lastMassG);
      const remainingMl = fullMl - firstUsedMl - secondUsedMl;
      assert(remainingMl > 0n);
      tare = lastMassG - oilMass(remainingMl, density);
      assert.equal(tare + oilMass(fullMl - firstUsedMl, density), firstMassG, "첫 측정값에도 다시 대입");
    }
    assert(tare > 0n, "빈 통의 무게가 양수");
    const expected = kg(tare);
    assert.equal(item.answer, expected, "지문에서 독립 계산한 빈 통의 무게와 일치");
    assert(item.answerVisual.includes(expected));
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
console.log(`6-2 개념탐구 5 Mission 4 잠금 후보: 원문 0.59kg 독립 계산·손풀이 충돌 확인과 3난이도 × 3고정 묶음 × 2시드 검산 ${checks}회 통과`);
