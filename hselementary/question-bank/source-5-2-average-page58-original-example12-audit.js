"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js"); require("./source-inventory-grade6.js"); require("./curriculum.js"); require("./generators.js");
const source = require("./source-5-2-average-page58-original-example12.js");
const unit = window.HSE_CURRICULUM.semesters.find(s=>s.id==="5-2").units.find(u=>u.id==="5-2-u6");
const type=unit.subunits.flatMap(s=>s.types).find(t=>t.sourceItemId===source.sourceItemId); assert(type && !type.reviewLocked && type.sourceVerified);
const witness=[1480,1490,1560,1670,1690]; assert(witness.every((n,i)=>i===0 || witness[i-1]<=n));
assert.equal(witness.slice(0,3).reduce((a,b)=>a+b),1510*3); assert.equal(witness.slice(2).reduce((a,b)=>a+b),1640*3); assert.equal(witness.reduce((a,b)=>a+b),1578*5);
assert.equal(1510*3+1640*3-1578*5,1560);
const q=window.HSE_GENERATORS.generate(type,2,0,54,0); assert.equal(q.answer,"15.6초"); assert.equal(q.publisherKeyVerified,false);
for(const t of ["100m", "먼저 들어온", "15.1초", "16.4초", "15.78초"]) assert(q.prompt.includes(t)); assert.match(q.solution,/45.3.*49.2.*78.9/s);
assert.equal(window.HSE_GENERATORS.generate(type,2,0,54,1),null); assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},2,0,54,0),null);
for(const [file,key,id] of [["5-2-source-items.json","sourceItems",source.sourceItemId],["5-2-u6-readiness-review.json","items","5-2-u6-e1-example-1-2"]]) {const d=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory",file),"utf8")); const row=d[key].find(x=>x.sourceItemId===id);assert(row.sourceVerified);assert.equal(row.publisherKeyVerified,false);assert.equal(row.publicDecision,"public");}
console.log(JSON.stringify({status:"passed",sourceItemId:source.sourceItemId,witness:witness.map(x=>x/100),middle:15.6,publisherKeyVerified:false}));
