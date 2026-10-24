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
for (const filename of [
  "source-5-2-range-e1.js", "source-5-2-range-missions.js", "source-5-2-rounding-e2.js",
  "source-5-2-rounding-missions.js", "source-5-2-rounding-application-e3.js",
  "source-5-2-rounding-examples-e3.js", "source-5-2-packing-mission1.js",
  "source-5-2-perimeter-mission2.js", "source-5-2-cube-box-mission3.js", "source-5-2-supply-cost-mission4.js",
  "source-5-2-population-bar-length.js", "source-5-2-citrus-sales-mission6.js", "source-5-2-rounded-range-e4.js", "source-5-2-rounded-range-e42.js", "source-5-2-rounded-range-e43.js", "source-5-2-rounded-range-e44.js"
]) require(`./${filename}`);

const ids = ["5-2-u1-e4-exploration-rounded-range", "5-2-u1-e4-example-1"];
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u1-readiness-review.json"), "utf8"));
const records = Object.fromEntries(readiness.items.filter(item => ids.includes(item.sourceItemId)).map(item => [item.sourceItemId, item]));
const pageImage = process.env.HSE_PAGE8_IMAGE || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008.png";
const ocrFile = process.env.HSE_PAGE8_OCR || "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/source/source-page-008-apple-vision.txt";
assert(fs.existsSync(pageImage), "Original page-8 image should remain in the local review archive");
assert(fs.existsSync(ocrFile), "Apple Vision OCR transcription should remain in the local review archive");
const ocr = fs.readFileSync(ocrFile, "utf8");
for (const required of ["개념탐구 4", "4500", "4400", "예제 4-1", "7000"]) assert(ocr.includes(required), `OCR misses ${required}`);
assert.equal(records[ids[0]].sourcePdfPage, 8);
assert.equal(records[ids[0]].sourcePrintedPage, 10);
assert.equal(records[ids[1]].sourcePdfPage, 8);
assert.equal(records[ids[1]].sourcePrintedPage, 10);
const generator = window.HSE_SOURCE_52_ROUNDED_RANGE_E4;
assert(generator && generator.install(window));
const observations = [];
for (let sourceIndex = 0; sourceIndex < ids.length; sourceIndex++) {
  const id = ids[sourceIndex];
  const type = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units[0].subunits[11].types[sourceIndex];
  assert.equal(type.sourceItemId, id);
  assert.equal(type.reviewLocked, false);
  assert.equal(type.answerVisualRequired, false);
  assert.equal(type.publisherKeyVerified, false);
  assert.equal(window.HSE_GENERATORS.generatorKey(type), type.generatorKey);
  for (let variant = 0; variant < 3; variant++) for (const difficulty of [-1, 0, 1]) {
    const q = window.HSE_GENERATORS.generate(type, 1, difficulty, 1, variant);
    assert(q && q.sourceItemId === id);
    assert.equal(q.verifiedPoolIndex, variant);
    assert.equal(q.verifiedVariantCount, 3);
    assert.equal(q.answerVisualRequired, false);
    assert.equal(q.publisherKeyVerified, false);
    assert.equal(q.handwrittenAnswerVerified, false);
    assert(!/\b4,500\b|\b4,400\b|\b7,000\b/.test(q.prompt), "Source numbers must not be reused in synthetic prompts");
    if (sourceIndex === 0) {
      const { ceil, floor, round, intersectionStart, intersectionEnd, count } = q.answerModel;
      const ranges = [[ceil - 99, ceil], [floor, floor + 99], [round - 50, round + 49]];
      const expectedStart = Math.max(...ranges.map(r => r[0]));
      const expectedEnd = Math.min(...ranges.map(r => r[1]));
      assert.equal(intersectionStart, expectedStart);
      assert.equal(intersectionEnd, expectedEnd);
      assert.equal(count, expectedEnd - expectedStart + 1);
      assert.equal(count, 50);
      assert.equal(q.answer, "50개");
      assert.match(q.solution, /50개/);
    } else {
      const { target, minimum, maximum, hundredFloor, hundredRound, tenCeil, tenRound } = q.answerModel;
      assert.equal(minimum, target - 500);
      assert.equal(maximum, target + 499);
      assert.equal(hundredFloor, hundredRound);
      assert.equal(tenCeil, tenRound);
      assert.equal(Number(q.answer.replaceAll(",", "")), minimum);
      assert.match(q.solution, new RegExp(minimum.toLocaleString("en-US")));
    }
    observations.push({ sourceItemId: id, variant, difficulty, answer: q.answer });
  }
}
assert.equal(window.HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types))).length, 2056);
console.log(JSON.stringify({ status: "passed", sourceItemIds: ids, sourcePdfPage: 8, sourcePrintedPage: 10, sourceNumbersReused: false, sourceIllustrationRequired: false, checkedConfigurations: observations.length, answers: observations }, null, 2));
