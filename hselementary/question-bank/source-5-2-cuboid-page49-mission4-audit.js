"use strict";
const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const item = require("./source-5-2-cuboid-page49-mission4.js");
const model = item.verifyModel();
const type = window.HSE_CURRICULUM.semesters.find(row => row.id === "5-2")
  .units.find(unit => unit.id === "5-2-u5").subunits.find(subunit => subunit.name === "직육면체의 성질")
  .types.find(row => row.sourceItemId === item.definition.sourceItemId);
assert(type, "curriculum type exists");
assert.equal(type.reviewLocked, false);
assert.equal(type.sourceVerified, true);
assert.equal(type.publisherKeyVerified, false);
assert.equal(type.publicDecision, undefined);
assert.equal(window.HSE_GENERATORS.generatorKey(type), item.definition.generatorKey);
const generated = window.HSE_GENERATORS.generate(type, 2, 0, 49, 0);
assert(generated, "fixed source item generates");
assert.equal(window.HSE_GENERATORS.generate(type, 2, 0, 49, 1), null, "no invented variant");
assert.deepEqual([model.width, model.height, model.depth, model.pieceCount, model.answer], [3, 3, 3, 27, 36]);
assert.equal((generated.prompt.match(/class="source52-p49m4-diagram"/g) || []).length, 1);
assert.match(generated.prompt, /class="source52-p49m4-outline" x1="215" y1="68" x2="215" y2="233"/, "visible edge separates the front and right faces");
const counts = [0,0,0,0];
for (let x0=0;x0<3;x0++) for (let x1=x0+1;x1<=3;x1++)
  for (let y0=0;y0<3;y0++) for (let y1=y0+1;y1<=3;y1++)
    for (let z0=0;z0<3;z0++) for (let z1=z0+1;z1<=3;z1++)
      if (x1-x0===y1-y0 && y1-y0===z1-z0) counts[x1-x0]++;
assert.deepEqual(counts.slice(1),[27,8,1],"independently count cube-shaped intervals only");

assert.equal((generated.solution.match(/class="source52-p49m4-diagram"/g) || []).length, 0, "solution does not duplicate answer visual");
assert.equal((generated.answerVisual.match(/class="source52-p49m4-diagram"/g) || []).length, 1, "one answer visual remains");
assert.deepEqual([1, 2, 3].map(size => (3 - size + 1) ** 3), [27, 8, 1]);
assert.match(generated.prompt, /선을 따라 잘라서 만들 수 있는/);
assert.match(generated.solution, /27\+8\+1=/);
assert.match(generated.solution, /36/);
assert.match(generated.solution, /답: 36개/);
assert.equal(generated.answer, "36개");
assert.equal(generated.handwrittenAnswerVerified, false);
assert.equal(generated.generationMode, "fixed-verified-pool");
console.log("5-2 U5 p.49 Mission 4 source grid, 36 possible cubes, fixed one-item pool, source diagram and public lock audit passed.");
