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

const id = "5-2-u1-e4-example-2";
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u1-readiness-review.json"), "utf8"));
const record = readiness.items.find(item => item.sourceItemId === id);
assert(record, "Readiness record should exist");
assert.equal(record.sourcePdfPage, 8);
assert.equal(record.sourcePrintedPage, 10);
assert.equal(record.visualRequirement, "원문에 그림이나 그래프가 없는 텍스트 문항입니다. 몫의 가능한 구간을 표나 식으로 정리하고 공통 범위를 구합니다.");
const image = process.env.HSE_PAGE8_IMAGE || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008.png";
const ocrPath = process.env.HSE_PAGE8_OCR || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008-apple-vision.txt";
assert(fs.existsSync(image), "Page 8 source render is needed");
const ocr = fs.readFileSync(ocrPath, "utf8");
for (const text of ["4-2", "6으로 나눈 몫", "50", "4로 나눈 몫", "70", "이상과 미만"]) assert(ocr.includes(text), `OCR must include ${text}`);

const module = window.HSE_SOURCE_52_ROUNDED_RANGE_E42;
assert(module && module.install(window));
const type = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units[0].subunits[10].types[2];
assert.equal(type.sourceItemId, id);
assert.equal(type.reviewLocked, false);
assert.equal(type.answerVisualRequired, false);
assert.equal(type.publisherKeyVerified, false);
assert.equal(window.HSE_GENERATORS.generatorKey(type), type.generatorKey);

const roundTens = quotient => Math.floor((quotient + 5) / 10) * 10;
const allSolutions = [];
for (let n = 1; n <= 1000; n++) {
  if (roundTens(Math.floor(n / 6)) === 50 && roundTens(Math.floor(n / 4)) === 70) allSolutions.push(n);
}
assert.equal(allSolutions[0], 270);
assert.equal(allSolutions.at(-1), 299);
assert.equal(allSolutions.length, 30);

const observations = [];
for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
  const q = window.HSE_GENERATORS.generate(type, 1, difficulty, 1, variant);
  assert(q && q.sourceItemId === id);
  assert.equal(q.verifiedPoolIndex, variant);
  assert.equal(q.publisherKeyVerified, false);
  assert.equal(q.answerVisualRequired, false);
  const m = q.answerModel;
  assert.notEqual(m.firstTarget, 50, "Do not reuse the first source target");
  assert.notEqual(m.secondTarget, 70, "Do not reuse the second source target");
  const expectedFirst = [];
  const expectedSecond = [];
  for (let n = 1; n < 100000; n++) {
    if (roundTens(Math.floor(n / 6)) === m.firstTarget) expectedFirst.push(n);
    if (roundTens(Math.floor(n / 4)) === m.secondTarget) expectedSecond.push(n);
  }
  const intersection = expectedFirst.filter(n => expectedSecond.includes(n));
  assert(intersection.length > 0);
  assert.equal(m.minimum, intersection[0]);
  assert.equal(m.upperExclusive, intersection.at(-1) + 1);
  assert.equal(intersection.length, m.upperExclusive - m.minimum);
  assert.equal(q.answer, `${m.minimum.toLocaleString("en-US")} 이상 ${m.upperExclusive.toLocaleString("en-US")} 미만`);
  assert(q.solution.includes(q.answer));
  observations.push({ variant, difficulty, answer: q.answer, count: intersection.length });
}
assert.equal(window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).length, 2054);
console.log(JSON.stringify({ status: "passed", id, sourcePdfPage: 8, sourcePrintedPage: 10, originalAnswer: "270 이상 300 미만", exhaustiveOriginalCandidates: allSolutions.length, syntheticConfigurations: observations.length, observations }, null, 2));
