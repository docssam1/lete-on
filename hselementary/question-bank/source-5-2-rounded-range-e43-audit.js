"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-5-2-rounded-range-e4.js");
require("./source-5-2-rounded-range-e42.js");
require("./source-5-2-rounded-range-e43.js");
require("./source-5-2-rounded-range-e44.js");

const id = "5-2-u1-e4-example-3";
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u1-readiness-review.json"), "utf8"));
const record = readiness.items.find(item => item.sourceItemId === id);
assert(record);
assert.equal(record.sourcePdfPage, 8);
assert.equal(record.sourcePrintedPage, 10);
assert.equal(record.visualRequirement, "원문에 그림이나 그래프가 없는 텍스트 문항입니다. 합과 차의 어림 범위를 식으로 정리해 큰 수의 범위를 구합니다.");
const image = process.env.HSE_PAGE8_IMAGE || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008.png";
const ocrPath = process.env.HSE_PAGE8_OCR || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008-apple-vision.txt";
assert(fs.existsSync(image));
const ocr = fs.readFileSync(ocrPath, "utf8");
for (const text of ["4-3", "합을 반올림", "900", "차를 반올림", "400", "더 큰 수가 될 수 있는 수의 범위"]) assert(ocr.includes(text), `OCR must include ${text}`);

const module = window.HSE_SOURCE_52_ROUNDED_RANGE_E43;
assert(module && module.install(window));
const types = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units[0].subunits[10].types;
const type = types.find(item => item.sourceItemId === id);
assert(type);
assert.equal(type.reviewLocked, false);
assert.equal(type.answerVisualRequired, false);
assert.equal(type.publisherKeyVerified, false);
assert.equal(window.HSE_GENERATORS.generatorKey(type), module.generatorKey);

const sourceSum = [850, 950];
const sourceDifference = [350, 450];
const sourceMin = (sourceSum[0] + sourceDifference[0]) / 2;
const sourceUpper = (sourceSum[1] + sourceDifference[1]) / 2;
assert.equal(sourceMin, 600);
assert.equal(sourceUpper, 700);
const sourceIntegerValues = new Set();
for (let sum = 850; sum < 950; sum++) for (let difference = 350; difference < 450; difference++) {
  if (sum > difference && (sum + difference) % 2 === 0) sourceIntegerValues.add((sum + difference) / 2);
}
assert.equal(Math.min(...sourceIntegerValues), 600);
assert.equal(Math.max(...sourceIntegerValues), 699);
assert.equal(sourceIntegerValues.size, 100);

const observations = [];
for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
  const q = window.HSE_GENERATORS.generate(type, 1, difficulty, 1, variant);
  assert(q && q.sourceItemId === id);
  assert.equal(q.verifiedPoolIndex, variant);
  assert.equal(q.publisherKeyVerified, false);
  assert.equal(q.answerVisualRequired, false);
  const m = q.answerModel;
  assert.notEqual(m.sumTarget, 900);
  assert.notEqual(m.differenceTarget, 400);
  const possibleLarger = new Set();
  for (let sum = m.sumRange[0]; sum < m.sumRange[1]; sum++) for (let difference = m.differenceRange[0]; difference < m.differenceRange[1]; difference++) {
    if (sum > difference && (sum + difference) % 2 === 0) possibleLarger.add((sum + difference) / 2);
  }
  assert.equal(Math.min(...possibleLarger), m.minimum);
  assert.equal(Math.max(...possibleLarger) + 1, m.upperExclusive);
  assert.equal(possibleLarger.size, m.upperExclusive - m.minimum);
  assert.equal(q.answer, `${m.minimum.toLocaleString("en-US")} 이상 ${m.upperExclusive.toLocaleString("en-US")} 미만`);
  assert(q.solution.includes(q.answer));
  observations.push({ variant, difficulty, answer: q.answer, possibleIntegerValues: possibleLarger.size });
}
assert.equal(window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).length, 2054);
console.log(JSON.stringify({ status: "passed", id, originalSumRange: "850 이상 950 미만", originalDifferenceRange: "350 이상 450 미만", originalAnswer: "600 이상 700 미만", originalIntegerCandidates: sourceIntegerValues.size, syntheticConfigurations: observations.length, observations }, null, 2));
