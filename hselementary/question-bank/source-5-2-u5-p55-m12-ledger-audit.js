"use strict";
const assert=require("node:assert/strict"),common=require("./source-inventory/5-2-source-items.json"),detailed=require("./source-inventory/5-2-u5-readiness-review.json");
for(let n=1;n<=4;n++){
 const id=`5-2-u5-e4-mission-${n}`,a=common.sourceItems.filter(i=>i.sourceItemId===id),b=detailed.items.filter(i=>i.sourceItemId===id);
 assert.equal(a.length,1);assert.equal(b.length,1);assert.equal(a[0].runtimeTypeId,id);assert.equal(a[0].printedPage,55);assert.equal(b[0].sourcePrintedPage,55);assert.equal(a[0].sourceVerified,true);assert.equal(b[0].sourceVerified,true);assert.equal(a[0].publicDecision,"public");assert.equal(b[0].publicDecision,"public");assert.equal(a[0].lockReason,"");assert.equal(b[0].publisherKeyVerified,false);
}
for(const key of ["publicCandidateCount","lockedCount"]){const decision=key==="publicCandidateCount"?"public":"locked",n=detailed.items.filter(i=>i.publicDecision===decision).length;assert.equal(detailed.integrity[key],n);assert.equal(detailed.summary[key],n);}
console.log("PASS: p55 missions 1–4 source, runtime, decision and count records agree.");
