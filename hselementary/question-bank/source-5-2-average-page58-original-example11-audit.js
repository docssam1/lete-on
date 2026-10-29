"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js"); require("./source-inventory-grade6.js"); require("./curriculum.js"); require("./generators.js");
const source = require("./source-5-2-average-page58-original-example11.js");
const unit = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units.find(u => u.id === "5-2-u6");
const type = unit.subunits.flatMap(s => s.types).find(t => t.sourceItemId === source.sourceItemId);
assert(type && !type.reviewLocked && type.sourceVerified);
const independentlyEnumerated = [];
for(let korean=90;korean<=99;korean++) for(let math=0;math<=100;math++) if(math%10===4 && (korean+math+78+90+80)===430) independentlyEnumerated.push([korean,math]);
assert.deepEqual(independentlyEnumerated, [[98,84]]); assert.deepEqual(source.candidates(), independentlyEnumerated);
const q = window.HSE_GENERATORS.generate(type, 2, 0, 54, 0);
assert.equal(q.answer, "국어 98점, 수학 84점"); assert.equal(q.publisherKeyVerified, false);
for(const text of ["국어", "수학", "사회", "과학", "영어", ">9</text>", ">4</text>", ">78</text>", ">90</text>", ">80</text>"]) assert(q.prompt.includes(text), text);
assert(!q.prompt.includes("98점") && !q.prompt.includes("84점")); assert.match(q.solution,/182/);
assert.equal(window.HSE_GENERATORS.generate(type,2,0,54,1),null);
assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},2,0,54,0),null);
for(const [file,key,id] of [["5-2-source-items.json","sourceItems",source.sourceItemId],["5-2-u6-readiness-review.json","items",source.sourceItemId+"-1"]]) {
 const doc=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory",file),"utf8")); const row=doc[key].find(x=>x.sourceItemId===id);
 assert(row.sourceVerified); assert.equal(row.publisherKeyVerified,false); assert.equal(row.publicDecision,"public");
}
console.log(JSON.stringify({status:"passed",sourceItemId:source.sourceItemId,independentlyEnumerated,publisherKeyVerified:false}));
