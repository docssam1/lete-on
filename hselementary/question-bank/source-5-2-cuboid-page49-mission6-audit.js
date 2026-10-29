"use strict";
const assert=require("node:assert/strict");global.window={};require("./source-inventory-4-1.js");require("./source-inventory-grade6.js");require("./curriculum.js");require("./generators.js");
const item=require("./source-5-2-cuboid-page49-mission6.js"),model=item.verifyModel();
const type=window.HSE_CURRICULUM.semesters.find(s=>s.id==="5-2").units.find(u=>u.id==="5-2-u5").subunits.find(s=>s.name==="직육면체의 성질").types.find(t=>t.sourceItemId===item.sourceItemId);
assert(type);assert.equal(type.reviewLocked,false);assert.equal(type.sourceVerified,true);assert.equal(type.publisherKeyVerified,false);assert.equal(window.HSE_GENERATORS.generatorKey(type),item.generatorKey);
const q=window.HSE_GENERATORS.generate(type,2,0,49,0);assert(q);assert.equal(window.HSE_GENERATORS.generate(type,2,0,49,1),null);assert.equal(model.answer,360);assert.deepEqual([model.sumWidths,model.sumDepths,model.sumHeights],[18,18,54]);assert.equal(model.pieces,9);assert.equal(q.answer,"360cm");assert.match(q.solution,/4×\(18\+18\+54\)=360cm/);assert.doesNotMatch(q.solution,/3등분|2cm × 2cm/);assert.equal((q.prompt.match(/class="source52-p49m6-diagram"/g)||[]).length,1);assert.equal(q.generationMode,"fixed-verified-pool");assert.equal(q.handwrittenAnswerVerified,false);
for (const [widths, depths] of [[[2,2,2],[2,2,2]], [[1,2,3],[0.5,1.5,4]]]) {
  const total = widths.flatMap(w => depths.map(d => 4 * (w + d + 6))).reduce((a,b) => a+b, 0);
  assert.equal(total,360,"edge sum holds for both equal and unequal cuts");
}
const review=require("./source-inventory/5-2-u5-readiness-review.json").items.find(i=>i.sourceItemId===item.sourceItemId);assert.equal(review.implementationStatus,"verified-local");assert.equal(review.publicDecision,"public");
console.log("5-2 U5 p.49 Mission 6 source diagram, nine pieces with equal or unequal cuts, edge sum 360cm, and fixed pool audit passed.");
