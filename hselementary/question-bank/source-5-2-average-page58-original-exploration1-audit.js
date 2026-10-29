"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs");
global.window = {}; require("./source-inventory-4-1.js"); require("./source-inventory-grade6.js"); require("./curriculum.js"); require("./generators.js");
const source = require("./source-5-2-average-page58-original-exploration1.js");
const unit = window.HSE_CURRICULUM.semesters.find(s => s.id === "5-2").units.find(u => u.id === "5-2-u6");
const type = unit.subunits.flatMap(s => s.types).find(t => t.sourceItemId === source.sourceItemId);
assert(type && !type.reviewLocked && type.sourceVerified); assert.equal(type.verifiedVariantCount,3);
const prompts=new Set();
for(let i=0;i<3;i++) {
 const q=window.HSE_GENERATORS.generate(type,2,0,54,i), values=q.questionModel.heightTenths;
 assert.equal(values.length,7);const sum=values.reduce((a,b)=>a+b,0);assert.equal(sum/7,q.answerModel.meanTenths);assert.equal(q.answer,`${sum/70}cm`);
 assert.equal(q.variantProvenance,"synthetic-source-structure");assert.equal(q.publisherKeyVerified,false);assert.equal((q.prompt.match(/<tr>/g)||[]).length,8);assert(q.solution.includes(`data-source-answer="${source.sourceItemId}"`));prompts.add(q.prompt);
}
assert.equal(prompts.size,3);for(const bad of [{reviewLocked:true},{sourceVerified:false},{id:"wrong"},{sourceItemId:"wrong"},{generatorKey:"wrong"}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,54,0),null);
const body=fs.readFileSync(require.resolve("./source-5-2-average-page58-original-exploration1.js"),"utf8");assert(!body.includes("source-original-fixed"));
console.log("Synthetic height-table variants, exact mean, unique prompts and release guards passed");
