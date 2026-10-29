"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js"); require("./source-inventory-grade6.js"); require("./curriculum.js"); require("./generators.js");
const source = require("./source-5-2-average-page58-original-exploration1.js");
const unit = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units.find(u => u.id === "5-2-u6");
const type = unit.subunits.flatMap(s => s.types).find(t => t.sourceItemId === source.sourceItemId);
assert(type && !type.reviewLocked && type.sourceVerified);
assert.deepEqual(source.names, ["효근", "동민", "석기", "예슬", "영수", "한별", "한초"]);
assert.deepEqual(source.tenths, [1528,1404,1486,1420,1492,1418,1542]);
assert.equal(source.tenths.reduce((a,b) => a+b, 0), 10290);
assert.equal(source.tenths.reduce((a,b) => a+b, 0)/7/10, 147);
const question = window.HSE_GENERATORS.generate(type, 2, 0, 54, 0);
assert.equal(question.answer, "147cm"); assert.equal(question.publisherKeyVerified, false);
assert.match(question.prompt, /예슬이네 모둠의 키/); assert.match(question.solution, /1029 ÷ 7/);
assert.equal(window.HSE_GENERATORS.generate(type, 2, 0, 54, 1), null);
assert.equal(window.HSE_GENERATORS.generate({...type, reviewLocked:true}, 2, 0, 54, 0), null);
for (const [file, key, id] of [["5-2-source-items.json", "sourceItems", source.sourceItemId], ["5-2-u6-readiness-review.json", "items", source.sourceItemId+"-1"]]) {
  const doc=JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory", file), "utf8"));
  const row=doc[key].find(x => x.sourceItemId === id); assert(row.sourceVerified); assert.equal(row.publisherKeyVerified, false); assert.equal(row.publicDecision, "public");
}
console.log(JSON.stringify({ status:"passed", sourceItemId:source.sourceItemId, sum:1029, average:147, publisherKeyVerified:false }));
