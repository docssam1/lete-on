"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const source = require("../learning/grade6-sp-a-unit-workbook.js");

function mean(values) { return values.reduce(function (sum,value) { return sum+value; },0)/values.length; }
function spread(values) { return Math.max.apply(null,values)-Math.min.apply(null,values); }

test("6.SP.A is a printable unit workbook rather than a 12-item clinic", function () {
  assert.equal(source.validatePack(), true);
  assert.equal(source.pack.workbookItems.length, 36);
  assert.equal(source.pack.recheckItems.length, 8);
  assert.deepEqual(source.pack.printPlan.paperSizes, ["A4","Letter"]);
  assert.equal(source.pack.printPlan.studentPages, 12);
  assert.equal(source.pack.printPlan.itemsPerPracticePage, 4);
  assert.equal(source.pack.contentOrigin, "gfield-original-authored-public-unit-workbook");
  assert.equal(source.pack.rights.containsThirdPartyAssets, false);
});

test("every public item has one independently recoverable answer in all three locales", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    const answer = source.solveItem(item);
    assert.equal(item.choices.filter(function (choice) { return choice.id === answer; }).length, 1, item.id);
    ["ko","en","zh-Hans"].forEach(function (locale) {
      assert.ok(item.prompt[locale], item.id+" prompt "+locale);
      assert.ok(item.question[locale], item.id+" question "+locale);
      assert.ok(source.choiceLabel(item,answer,locale), item.id+" answer label "+locale);
      assert.ok(source.solutionFor(item,locale), item.id+" solution "+locale);
    });
  });
});

test("distribution answers are recomputed from values rather than copied from labels", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.kind === "distribution-comparison"; }).forEach(function (item) {
    const left = item.data.ask === "spread" ? spread(item.data.valuesA) : mean(item.data.valuesA);
    const right = item.data.ask === "spread" ? spread(item.data.valuesB) : mean(item.data.valuesB);
    const independent = left > right ? "A" : (right > left ? "B" : "E");
    assert.equal(source.solveItem(item), independent, item.id);
  });
  source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.kind === "same-center-spread"; }).forEach(function (item) {
    const independent = mean(item.data.valuesA) !== mean(item.data.valuesB) ? "DIFFERENT_CENTER" : (spread(item.data.valuesA) > spread(item.data.valuesB) ? "A_MORE" : "B_MORE");
    assert.equal(source.solveItem(item), independent, item.id);
  });
});

test("recheck covers every 6.SP.A strand with new IDs", function () {
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })).size, 5);
  const workbookIds = new Set(source.pack.workbookItems.map(function (item) { return item.id; }));
  source.pack.recheckItems.forEach(function (item) { assert.equal(workbookIds.has(item.id), false); });
});
