"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bank = __dirname;
const context = vm.createContext({ window: {} });
for (const file of [
  "source-inventory-4-1.js", "source-inventory-4-2-quadrilateral.js", "source-inventory-grade6.js",
  "curriculum.js", "generators.js", "source-5-2-range-e1.js", "source-5-2-range-missions.js",
  "source-5-2-rounding-e2.js", "source-5-2-rounding-missions.js", "source-5-2-rounding-application-e3.js"
]) vm.runInContext(fs.readFileSync(path.join(bank, file), "utf8"), context, { filename: file });

const api = context.window.HSE_SOURCE_52_ROUNDING_APPLICATION_E3;
const generators = context.window.HSE_GENERATORS;
const allTypes = context.window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types)));
const strip = html => String(html).replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const parseInteger = value => Number(value.replaceAll(",", ""));
const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
assert.deepEqual([...api.ids], [
  "5-2-u1-e3-exploration-round-up",
  "5-2-u1-e3-exploration-round-down",
  "5-2-u1-e3-exploration-round-nearest"
]);

const configurations = [];
for (let index = 0; index < api.ids.length; index += 1) {
  const sourceItemId = api.ids[index];
  const type = allTypes.find(entry => entry.id === sourceItemId);
  assert(type, `${sourceItemId} must be catalogued`);
  assert.equal(type.sourceItemId, sourceItemId);
  assert.equal(type.sourcePdfPage, 6);
  assert.equal(type.sourcePrintedPage, 8);
  assert.equal(type.sourceVerified, true);
  assert.equal(type.reviewLocked, false);
  assert.equal(type.publisherKeyVerified, false);
  assert.equal(generators.generatorKey(type), type.generatorKey);

  for (let variant = 0; variant < 3; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
    const question = api.getQuestion(sourceItemId, variant, difficultyOffset);
    assert(question, `${sourceItemId} v${variant} d${difficultyOffset} must generate`);
    const prompt = strip(question.prompt);
    let expected, input;
    if (index === 0) {
      input = parseInteger(prompt.match(/[\d,]+/)[0]);
      expected = Math.ceil(input / 1000) * 1000;
      assert.match(prompt, /올림하여 천의 자리까지/);
      assert.equal(question.answer, expected.toLocaleString("en-US"));
      assert.equal(question.questionModel.remainder, input % 1000);
    } else if (index === 1) {
      input = parseInteger(prompt.match(/[\d,]+/)[0]);
      expected = Math.floor(input / 10) * 10;
      assert.match(prompt, /버림하여 십의 자리까지/);
      assert.equal(question.answer, expected.toLocaleString("en-US"));
      assert.equal(question.questionModel.remainder, input % 10);
    } else {
      const [whole, decimals] = prompt.match(/\d+\.\d{2}/)[0].split(".");
      input = Number(whole) * 100 + Number(decimals);
      const expectedHundredths = Math.floor((input + 5) / 10) * 10;
      expected = `${Math.floor(expectedHundredths / 100)}.${Math.floor(expectedHundredths / 10) % 10}`;
      assert.match(prompt, /반올림하여 소수 첫째 자리까지/);
      assert.equal(question.answer, expected);
      assert.equal(question.questionModel.hundredthsDigit, input % 10);
    }
    assert.equal(question.answerModel.value, question.answer);
    const answerToken = new RegExp(`(?<![\\d,.])${escapeRegExp(question.answer)}(?![\\d,.])`);
    assert(!answerToken.test(prompt), "The answer must not leak into the prompt as a numeric token");
    assert(strip(question.solution).length > 30);
    assert.equal(question.sourceItemId, sourceItemId);
    assert.equal(question.verifiedPoolIndex, variant);
    assert.equal(question.verifiedVariantCount, 3);
    assert.equal(question.sourceStructurePreserved, true);
    assert.equal(question.publisherKeyVerified, false);
    assert.equal(question.answerVerification, "independent-calculation-user-authorized");

    const routed = generators.generate(type, 0, difficultyOffset, 11 + variant, variant);
    assert.equal(routed.answer, question.answer, "Central generator routing must preserve the verified result");
    configurations.push({ sourceItemId, variant, difficultyOffset, answer: question.answer, expected });
  }
}

for (const id of api.ids) {
  assert.equal(api.getQuestion(id, -1, 0), null);
  assert.equal(api.getQuestion(id, 0, 2), null);
  assert.equal(api.getQuestion(id, 3, 0).verifiedPoolIndex, 0, "Only three fixed variants are exposed");
}
assert.equal(configurations.length, 27);
console.log(JSON.stringify({
  status: "passed", types: api.ids.length, configurations: configurations.length,
  variants: 3, difficultyOffsets: 3, visiblePromptAnswersRecomputed: true,
  centralRouting: true, answerLeakChecks: configurations.length, publisherKeyVerified: false
}));
