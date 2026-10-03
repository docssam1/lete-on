"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const id = "6-2-u2-e6-example-1";
const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", "6-2-source-items.json"), "utf8"));
const source = inventory.items.find(item => item.sourceItemId === id);
const type = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2")
  .units.flatMap(item => item.subunits.flatMap(group => group.types)).find(item => item.sourceItemId === id);
assert.equal(source.independentAnswer, "16.8L");
assert.equal(source.handwrittenAnswer, source.independentAnswer);
assert.equal(source.publisherAnswerKeyVerified, false);
assert.equal(source.implementationStatus, "fixed-verified-pool");
assert.equal(source.candidateVerification.publicReleaseStatus, "verified-with-annotated-answer-and-independent-calculation");
assert.equal(type.generatorKey, "sourceGrade6SecondDecimalDivisionE6Example1");
assert(!type.reviewLocked);
const candidate = type;

// Parse only the student-facing conditions and use exact fractions independent of the generator.
const rational = (numerator, denominator = 1n) => ({ n: BigInt(numerator), d: BigInt(denominator) });
const subtract = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const multiply = (a, b) => rational(a.n * b.n, a.d * b.d);
const decimal = text => {
  const [whole, fraction = ""] = text.split(".");
  assert(fraction.length <= 2);
  return rational(BigInt(whole + fraction), 10n ** BigInt(fraction.length));
};
const one = rational(1);
const pretty = value => {
  assert.equal((value.n * 100n) % value.d, 0n);
  const hundredths = value.n * 100n / value.d;
  return `${Number(hundredths) / 100}L`;
};
let checks = 0;
for (const difficulty of [-1, 0, 1]) {
  const prompts = new Set();
  for (let variant = 0; variant < 3; variant += 1) {
    for (const seed of [1, 41, 77]) {
      const item = window.HSE_GENERATORS.generate(candidate, 0, difficulty, seed, variant);
      const prompt = item.prompt;
      assert(!prompt.includes("따라서") && !prompt.includes("정답"));
      assert(!item.visual, "원문에 없는 물통 그림을 문제에 추가하지 않음");
      const initial = decimal(prompt.match(/물통 들이의 ([\d.]+)만큼/)?.[1] || "0");
      const literValues = [...prompt.matchAll(/물 ([\d.]+)L/g)].map(match => decimal(match[1]));
      assert.equal(literValues.length, difficulty === 1 ? 2 : 1);
      const fraction = prompt.match(/class="math-fraction"[^>]*><span>(\d+)<\/span><span>(\d+)<\/span>/);
      const fillShare = fraction ? rational(fraction[1], fraction[2]) : rational(0);
      assert.equal(Boolean(fraction), difficulty !== -1);
      assert(fillShare.n >= 0n && fillShare.n < fillShare.d);
      const beforeAddition = add(initial, multiply(subtract(one, initial), fillShare));
      const finalFilled = difficulty === -1
        ? decimal(prompt.match(/더 넣었더니 물통 들이의 ([\d.]+)만큼/)?.[1] || "0")
        : subtract(one, rational(prompt.match(/전체 들이의 (\d+)%/)?.[1] || "0", 100));
      const delta = subtract(finalFilled, beforeAddition);
      const netAdded = subtract(literValues[0], literValues[1] || rational(0));
      assert(delta.n > 0n && delta.n < delta.d && netAdded.n > 0n, "양의 계수로 들이가 하나로 정해짐");
      const capacity = rational(netAdded.n * delta.d, netAdded.d * delta.n);
      assert.equal(item.answer, pretty(capacity), "지문 조건으로만 계산한 들이");
      const afterAddition = add(multiply(capacity, beforeAddition), literValues[0]);
      assert(afterAddition.n * capacity.d <= capacity.n * afterAddition.d, "중간에도 물이 넘치지 않음");
      const afterRemoval = subtract(afterAddition, literValues[1] || rational(0));
      const expectedWater = multiply(capacity, finalFilled);
      assert.equal(afterRemoval.n * expectedWater.d, expectedWater.n * afterRemoval.d, "최종 물의 양 역산");
      let solutions = 0;
      for (let hundredths = 1n; hundredths <= 5000n; hundredths += 1n) {
        if (hundredths * delta.n * netAdded.d === 100n * netAdded.n * delta.d) solutions += 1;
      }
      assert.equal(solutions, 1, "0.01L부터 50L까지 정답 후보 전수검사");
      assert(item.answerVisual.includes(item.answer) && item.answerVisual.includes(`data-answer-source="${id}"`));
      assert.equal(item.verifiedPoolIndex, variant);
      assert.equal(item.verifiedVariantCount, 3);
      assert.equal(item.sourceItemId, id);
      prompts.add(prompt);
      checks += 1;
    }
    assert.deepEqual(window.HSE_GENERATORS.generate(candidate, 0, difficulty, 1, variant),
      window.HSE_GENERATORS.generate(candidate, 0, difficulty, 77, variant));
  }
  assert.equal(prompts.size, 3);
}
const original = window.HSE_GENERATORS.generate(candidate, 0, 0, 1, 0);
assert(original.prompt.includes("0.2만큼") && original.prompt.includes("8분의 5")
  && original.prompt.includes("2.52L") && original.prompt.includes("15%"));
assert.equal(original.answer, "16.8L");
assert(!original.solution.includes("/" + "8"), "분수는 공통 수식 표시 사용");
console.log(`6-2 예제 6-1 물통: 지문 독립 계산·역산 ${checks}회, 정답 후보 135000개 검사 통과`);
