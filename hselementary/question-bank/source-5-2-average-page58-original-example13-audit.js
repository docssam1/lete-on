"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
global.window = {}; require("./source-inventory-4-1.js"); require("./source-inventory-grade6.js"); require("./curriculum.js"); require("./generators.js");
const source = require("./source-5-2-average-page58-original-example13.js");
const unit=window.HSE_CURRICULUM.semesters.find(s=>s.id==="5-2").units.find(u=>u.id==="5-2-u6");const type=unit.subunits.flatMap(s=>s.types).find(t=>t.sourceItemId===source.sourceItemId);assert(type&&!type.reviewLocked&&type.sourceVerified);
assert.deepEqual(source.months,[2,4,6,8,10,12]); assert.deepEqual(source.air,[4,7,11,21,16,7]);assert.deepEqual(source.water,[7,9,10,14,16,12]);
assert.equal(source.air.reduce((a,b)=>a+b),66);assert.equal(source.water.reduce((a,b)=>a+b),68);assert.equal((68-66)/6,1/3);
const q=window.HSE_GENERATORS.generate(type,2,0,54,0);assert.equal(q.answer,"⅓℃");assert.equal(q.publisherKeyVerified,false);assert(q.prompt.includes("꺾은선그래프"));
assert.equal(window.HSE_GENERATORS.generate(type,2,0,54,1),null);assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},2,0,54,0),null);
for(const [file,key,id] of [["5-2-source-items.json","sourceItems",source.sourceItemId],["5-2-u6-readiness-review.json","items","5-2-u6-e1-example-1-3"]]) {const d=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory",file),"utf8"));const row=d[key].find(x=>x.sourceItemId===id);assert(row.sourceVerified);assert.equal(row.publisherKeyVerified,false);assert.equal(row.publicDecision,"public");}
console.log(JSON.stringify({status:"passed",sourceItemId:source.sourceItemId,airSum:66,waterSum:68,exactDifference:"1/3",publisherKeyVerified:false}));
