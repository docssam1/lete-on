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

test("public SASMO landing retires the synthetic showcase and routes to the original paper", function () {
  const html = fs.readFileSync(path.resolve(__dirname, "../sasmo.html"), "utf8");
  assert.match(html, /id="source-first"/);
  assert.match(html, /id="workbook-preview"/);
  assert.match(html, /SASMO 합성 10유형 문제집/);
  assert.match(html, /공개 사용 중단 · 원본 대조 재구성/);
  assert.match(html, /36문항 워크북과 8문항 재확인/);
  assert.match(html, /진단별 자동 처방 팩/);
  assert.match(html, /검수 진행 중/);
  assert.match(html, /주최기관 제공 자료와 제3자 공개 보관본의 출처 상태를 구분/);
  assert.match(html, /href="\.\/sasmo-real-paper\.html"/);
  assert.doesNotMatch(html, /competition-practice\.html\?program=sasmo/);
  assert.doesNotMatch(html, /src="\.\/sasmo-showcase\.js/);
  assert.doesNotMatch(html, /src="\.\/competition\/grade6-competition-type-bank\.js/);
  assert.match(html, /unit-workbook\.html\?audience=student&amp;mode=workbook&amp;locale=ko&amp;paper=A4&amp;cluster=6\.G\.A/);
  assert.doesNotMatch(html, /id="mini-experience"/);
});
