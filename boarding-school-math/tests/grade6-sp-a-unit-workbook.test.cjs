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

test("each locale uses Grade 6 curriculum language rather than literal translation", function () {
  assert.equal(source.pack.title.ko, "6.SP.A 통계 질문과 자료의 분포");
  assert.equal(source.pack.strands["anticipated-variability"].ko, "질문에 필요한 자료 찾기");
  assert.doesNotMatch(source.pack.strands["anticipated-variability"].ko, /예상되는 변이/);
  assert.match(source.pack.conceptPages[1].body.en, /mean absolute deviation \(MAD\).*variability/);
  assert.match(source.pack.scopeNotice.en, /US Grade 6 standards 6\.SP\.A\.1-3/);
  assert.match(source.pack.scopeNotice["zh-Hans"], /美国六年级数学标准6\.SP\.A\.1-3/);
  assert.doesNotMatch(source.pack.strands["anticipated-variability"]["zh-Hans"], /预期变异/);
  assert.match(source.pack.strands["center-vs-variation"]["zh-Hans"], /中心位置.*离散程度/);
  const measurePrompts = source.pack.workbookItems.filter(function (item) { return item.kind === "measure-role"; }).map(function (item) { return item.prompt.ko; });
  assert.ok(measurePrompts.includes("범위는 자료의 중심과 퍼짐 중 어느 것을 나타냅니까?"));
  assert.ok(measurePrompts.includes("중앙값은 자료의 중심과 퍼짐 중 어느 것을 나타냅니까?"));
  measurePrompts.forEach(function (prompt) { assert.doesNotMatch(prompt, /은\(는\)|범위은|편차은/); });
  const dataPrompts = source.pack.workbookItems.filter(function (item) { return item.kind === "variability-source"; }).map(function (item) { return item.prompt; });
  dataPrompts.forEach(function (prompt) {
    assert.equal(prompt.ko, "이 질문에 답하려면 어떤 자료를 모아야 하나요?");
    assert.equal(prompt.en, "What data should you collect to answer this question?");
    assert.equal(prompt["zh-Hans"], "要回答这个问题，应该收集什么数据？");
  });
});
