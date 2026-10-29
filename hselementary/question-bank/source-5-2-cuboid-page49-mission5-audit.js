"use strict";
const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const item = require("./source-5-2-cuboid-page49-mission5.js");
const model = item.verifyModel();
const type = window.HSE_CURRICULUM.semesters.find(row => row.id === "5-2")
  .units.find(unit => unit.id === "5-2-u5").subunits.find(subunit => subunit.name === "직육면체의 성질")
  .types.find(row => row.sourceItemId === item.definition.sourceItemId);
assert(type, "curriculum type exists");
assert.equal(type.reviewLocked, false);
assert.equal(type.sourceVerified, true);
assert.equal(type.publisherKeyVerified, false);
assert.equal(window.HSE_GENERATORS.generatorKey(type), item.definition.generatorKey);
const generated = window.HSE_GENERATORS.generate(type, 2, 0, 49, 0);
assert(generated, "fixed source item generates");
assert.equal(window.HSE_GENERATORS.generate(type, 2, 0, 49, 1), null, "no invented variant");
assert.equal(model.answer, 10);
assert.deepEqual(model.groups, [3, 6, 1]);
assert.equal(new Set(item.arrangements.map(row => row.canonicalDimensions)).size, 10);
const independentlyEnumerated = new Set();
for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) for (let c = 1; c <= 8; c++) {
  if (a * b * c === 8) independentlyEnumerated.add([5 * a, 3 * b, c].sort((x, y) => y - x).join("×"));
}
assert.deepEqual([...new Set(item.arrangements.map(row => row.canonicalDimensions))].sort(), [...independentlyEnumerated].sort(), "table includes every distinct factor allocation");
assert.equal((generated.prompt.match(/class="source52-p49m5-diagram"/g) || []).length, 1);
assert.equal((generated.solution.match(/class="source52-p49m5-table"/g) || []).length, 1);
assert.equal((generated.solution.match(/<tr>/g) || []).length, 11, "header plus all ten arrangements");
assert.match(generated.prompt, /5cm, 3cm, 1cm/);
assert.match(generated.solution, /a×b×c=8/);
assert.match(generated.solution, /3\+6\+1=10가지/);
assert.match(generated.solution, /답: 10가지/);
assert.equal(generated.answer, "10가지");
assert.equal(generated.handwrittenAnswerVerified, false);
assert.equal(generated.generationMode, "fixed-verified-pool");
assert.equal(type.reviewLocked, false);
const review = require("./source-inventory/5-2-u5-readiness-review.json").items.find(row => row.sourceItemId === item.definition.sourceItemId);
assert.equal(review.implementationStatus, "verified-local");
assert.equal(review.publicDecision, "public");
console.log("5-2 U5 p.49 Mission 5 source, ten distinct dimension triples, fixed item, detailed solution table, and release status audit passed.");
