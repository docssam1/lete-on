"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const showcase = require("../sasmo-showcase.js");
const bank = require("../competition/grade6-competition-type-bank.js");

function byId(id) {
  return bank.items.find(function (item) { return item.id === id; });
}

test("SASMO introduction samples are three valid, distinct evidence axes", function () {
  assert.deepEqual(showcase.validate(), { valid: true, errors: [] });
  assert.deepEqual(showcase.sampleIds, [
    "sasmo-g6-pattern-01",
    "sasmo-g6-logic-01",
    "sasmo-g6-cube-01"
  ]);
  assert.equal(showcase.items().length, 3);
  assert.equal(new Set(showcase.items().map(function (item) { return item.axis; })).size, 3);
});

test("showcase diagrams are calculated from the same checked question models", function () {
  assert.deepEqual(showcase.patternTerms(byId("sasmo-g6-pattern-01").model), [2, 6, 5, 15, 14, 42, 41]);
  assert.deepEqual(showcase.logicRanks(byId("sasmo-g6-logic-01").model), {
    Hana: 0,
    Min: 1,
    Jun: 2,
    Yuri: 1
  });
  const cube = bank.renderVisual(byId("sasmo-g6-cube-01"), "ko");
  assert.match(cube, /data-layout-role="painted-cube"/);
  assert.match(cube, /data-cube-size="3"/);
});

test("workbook preview separates the live SASMO type book, curriculum repair, and pending auto-prescription", function () {
  const html = fs.readFileSync(path.resolve(__dirname, "../sasmo.html"), "utf8");
  assert.match(html, /id="workbook-preview"/);
  assert.match(html, /SASMO Grade 6 · 10유형 워크북/);
  assert.match(html, /36문항 워크북과 8문항 재확인/);
  assert.match(html, /진단별 자동 처방 팩/);
  assert.match(html, /검수 진행 중/);
  assert.match(html, /competition-practice\.html\?program=sasmo&amp;audience=student&amp;locale=ko/);
  assert.match(html, /competition-practice\.html\?program=sasmo&amp;audience=teacher&amp;locale=ko/);
  assert.match(html, /competition-practice\.html\?program=sasmo&amp;audience=student&amp;locale=en"/);
  assert.match(html, /competition-practice\.html\?program=sasmo&amp;audience=student&amp;locale=en-SG"/);
  assert.match(html, /Singapore · Primary 6/);
  assert.match(html, /competition-practice\.html\?program=sasmo&amp;audience=student&amp;locale=zh-Hans"/);
  assert.match(html, /unit-workbook\.html\?audience=student&amp;mode=workbook&amp;locale=ko&amp;paper=A4&amp;cluster=6\.G\.A/);
  assert.doesNotMatch(html, /진단별 자동 처방 팩<\/strong><p>[^<]*(완료|체험 가능)/);
});
