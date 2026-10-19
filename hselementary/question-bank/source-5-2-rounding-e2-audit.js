"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const bank = __dirname;
const context = vm.createContext({ window: {} });
for (const file of ["source-inventory-4-1.js", "source-inventory-4-2-quadrilateral.js", "source-inventory-grade6.js", "curriculum.js", "generators.js", "source-5-2-rounding-e2.js"]) {
  vm.runInContext(fs.readFileSync(path.join(bank, file), "utf8"), context, { filename: file });
}
const api = context.window.HSE_SOURCE_52_ROUNDING_E2;
const generators = context.window.HSE_GENERATORS;
const allTypes = context.window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types)));
const text = value => String(value).replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const checkRound = (value, unit) => Math.floor(value / unit + 0.5) * unit;
const checkCeil = (value, unit) => Math.ceil(value / unit) * unit;
const checkFloor = (value, unit) => Math.floor(value / unit) * unit;

assert.deepEqual([...api.ids], ["5-2-u1-e2-exploration", "5-2-u1-e2-example-2-1", "5-2-u1-e2-example-2-2", "5-2-u1-e2-example-2-3"]);
const ambiguous = allTypes.find(type => type.id === "5-2-u1-e2-example-2-4");
assert(ambiguous && ambiguous.reviewLocked === true && !ambiguous.generatorKey, "Ambiguous Example 2-4 remains unconnected");
assert.match(ambiguous.reviewReason, /0 허용 여부/);
const ambiguityWitnesses = [[5, 2, 1], [5, 3, 0]].filter(([a, b, c]) => a + b + c === 8 && a > b && b > c && Math.round((2 + a / 10 + b / 100 + c / 1000) * 10) / 10 === 2.5);
assert.deepEqual(ambiguityWitnesses, [[5, 2, 1], [5, 3, 0]], "Original Example 2-4 has two answers if zero is an allowed digit");

let configurations = 0;
for (let index = 0; index < api.ids.length; index += 1) {
  const sourceItemId = api.ids[index];
  const type = allTypes.find(item => item.id === sourceItemId);
  assert(type, `${sourceItemId} is in the curriculum`);
  assert.equal(type.sourceItemId, sourceItemId);
  assert.equal(type.sourcePdfPage, 4);
  assert.equal(type.sourcePrintedPage, 6);
  assert.equal(type.reviewLocked, false);
  assert.equal(type.sourceVerified, true);
  assert.equal(generators.generatorKey(type), type.generatorKey);
  for (let variant = 0; variant < 3; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
    const question = generators.generate(type, 0, difficultyOffset, 1000 + variant, variant);
    assert(question, `${sourceItemId} variant ${variant} difficulty ${difficultyOffset} generates`);
    assert.equal(question.sourceItemId, sourceItemId);
    assert.equal(question.verifiedPoolIndex, variant);
    assert.equal(question.answerVisualRequired, false);
    const prompt = text(question.prompt);

    if (index === 0) {
      const [value] = prompt.match(/[\d,]+/g).map(value => Number(value.replaceAll(",", "")));
      const expected = [checkCeil(value, 100), checkFloor(value, 1000), checkRound(value, 10000)].map(number => number.toLocaleString("en-US")).join(", ");
      assert.equal(question.answer, expected);
      assert.match(prompt, /올림하여 백의 자리.*버림하여 천의 자리.*반올림하여 만의 자리/);
    } else if (index === 1) {
      const values = [...prompt.matchAll(/(?:㉠|㉡|㉢|㉣)\s([\d,]+)/g)].map(match => Number(match[1].replaceAll(",", "")));
      assert.equal(values.length, 4);
      const answer = values.map((value, position) => checkCeil(value, 100) === checkRound(value, 100) ? ["㉠", "㉡", "㉢", "㉣"][position] : null).filter(Boolean).join(", ");
      assert.equal(answer, question.answer);
      assert.equal(answer.split(", ").length, 2);
    } else if (index === 2) {
      const [male, female] = [...prompt.matchAll(/인구는\s([\d,]+)명/g)].map(match => Number(match[1].replaceAll(",", "")));
      assert.equal(male + female, question.questionModel.actualTotal);
      const floors = checkFloor(male, 10000) + checkFloor(female, 10000);
      const ceils = checkCeil(male, 10000) + checkCeil(female, 10000);
      const individuallyRounded = checkRound(male, 10000) + checkRound(female, 10000);
      assert.equal(question.answer, `${Math.abs(ceils - floors).toLocaleString("en-US")}명, ${Math.abs(checkRound(male + female, 10000) - individuallyRounded).toLocaleString("en-US")}명`);
    } else {
      const values = [...prompt.matchAll(/\b\d{1,3}(?:,\d{3})+\b/g)].map(match => Number(match[0].replaceAll(",", "")));
      assert.equal(values.length, 5);
      const valid = values.filter(value => checkCeil(value, 10) !== checkRound(value, 10) && checkFloor(value, 100) !== checkRound(value, 100));
      assert.equal(valid.length, 1);
      assert.equal(question.answer, "1");
    }
    assert(text(question.solution).length > 20);
    configurations += 1;
  }
}
assert.equal(configurations, 36);
console.log(JSON.stringify({ status: "passed", sourceItems: api.ids.length, fixedVariantsPerItem: 3, difficultyOffsets: 3, configurations, ambiguousItemsKeptLocked: 1, publisherKeyVerified: false }, null, 2));
