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

test("every item is aligned to 6.SP.A while 6.SP.B remains an explicit bridge", function () {
  assert.deepEqual(source.pack.standardsAlignment.assessed, ["6.SP.A.1","6.SP.A.2","6.SP.A.3"]);
  assert.deepEqual(source.pack.standardsAlignment.bridgeOnly, ["6.SP.B.4","6.SP.B.5"]);
  const expectedByKind = {
    "question-classification": ["6.SP.A.1"],
    "variability-source": ["6.SP.A.1"],
    "distribution-comparison": ["6.SP.A.2"],
    "measure-role": ["6.SP.A.3"],
    "same-center-spread": ["6.SP.A.2","6.SP.A.3"]
  };
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(item.standardIds, expectedByKind[item.kind], item.id);
  });
  assert.match(source.pack.scopeNotice.ko, /평가 범위.*6\.SP\.A\.1-3/);
  assert.match(source.pack.scopeNotice.ko, /6\.SP\.B\.4-5로 이어지는 연결 연습/);
  assert.match(source.pack.scopeNotice.ko, /그래프 작성과 맥락 설명을 마쳤다는 증거로 사용하지 않습니다/);
});

test("each locale uses Grade 6 curriculum language rather than literal translation", function () {
  assert.equal(source.pack.title.ko, "6.SP.A 통계적 질문과 자료의 분포");
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
  const koreanStudentCopy = JSON.stringify({
    subtitle: source.pack.subtitle.ko,
    concepts: source.pack.conceptPages.map(function (page) { return [page.title.ko,page.body.ko,page.example.ko]; }),
    sections: source.pack.ui.sectionLabels,
    items: source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) {
      return [item.prompt.ko,item.question.ko,item.choices.map(function (choice) { return choice.label.ko; })];
    })
  });
  assert.doesNotMatch(koreanStudentCopy, /6학년이라는 학년|지난 토요일이라는 날짜|4주라는 기간|이번 시즌이라는 기간|관찰한 14일|예상되는 변이|학생이나 관측마다 달라질 양/);
  assert.match(source.pack.conceptPages[0].body.ko, /여러 사람에게 묻거나 여러 번 관찰했을 때 서로 다른 답/);
  assert.match(source.pack.conceptPages[1].body.ko, /평균 절대 편차는 각 값이 평균에서 떨어진 거리의 평균/);
  assert.equal(source.pack.ui.sectionLabels.distributions.ko, "3 · 평균과 범위로 두 자료 비교하기");
  assert.equal(source.pack.ui.sectionLabels.measures.ko, "4 · 중심을 나타낼까, 퍼짐을 나타낼까");
});
