"use strict";
const assert=require("node:assert/strict");
const common=require("./source-inventory/5-2-source-items.json"),detailed=require("./source-inventory/5-2-u5-readiness-review.json");
const id="5-2-u5-e4-exploration",runtime=`${id}-1`,a=common.sourceItems.filter(i=>i.sourceItemId===id),b=detailed.items.filter(i=>i.sourceItemId===runtime);
assert.equal(a.length,1);assert.equal(b.length,1);assert.equal(a[0].runtimeTypeId,runtime);assert.equal(a[0].printedPage,54);assert.equal(b[0].sourcePrintedPage,54);assert.equal(a[0].sourceVerified,true);assert.equal(b[0].sourceVerified,true);assert.equal(a[0].publicDecision,"public");assert.equal(b[0].publicDecision,"public");assert.equal(a[0].lockReason,"");assert.equal(b[0].publisherKeyVerified,false);
for(const key of ["publicCandidateCount","lockedCount"]){const decision=key==="publicCandidateCount"?"public":"locked",n=detailed.items.filter(i=>i.publicDecision===decision).length;assert.equal(detailed.integrity[key],n);assert.equal(detailed.summary[key],n);}
console.log("PASS: p54 exploration source alias, decision, publisher status and counts agree.");
