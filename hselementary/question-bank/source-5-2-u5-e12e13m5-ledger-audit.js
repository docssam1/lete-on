"use strict";
const assert=require("node:assert/strict");
const common=require("./source-inventory/5-2-source-items.json");
const detailed=require("./source-inventory/5-2-u5-readiness-review.json");
for(const [id,detailId,printed] of [
 ["5-2-u5-e1-example-2","5-2-u5-e1-example-1-2",48],
 ["5-2-u5-e1-example-3","5-2-u5-e1-example-1-3",48],
 ["5-2-u5-e1-mission-5","5-2-u5-e1-mission-5",49]
]){
 const a=common.sourceItems.filter(i=>i.sourceItemId===id),b=detailed.items.filter(i=>i.sourceItemId===detailId);
 assert.equal(a.length,1);assert.equal(b.length,1);
 assert.equal(a[0].printedPage,printed);assert.equal(b[0].sourcePrintedPage,printed);
 assert.equal(a[0].sourceVerified,true);assert.equal(a[0].implementationStatus,"verified-local");
 assert.equal(a[0].runtimeTypeId,id);assert.equal(b[0].publicDecision,"public");
 if(detailId!==id)assert.equal(b[0].runtimeTypeId,id);
}
for(const key of ["publicCandidateCount","lockedCount"]){const decision=key==="publicCandidateCount"?"public":"locked",count=detailed.items.filter(i=>i.publicDecision===decision).length;assert.equal(detailed.integrity[key],count);assert.equal(detailed.summary[key],count);}
console.log("PASS: three source rows, explicit ID aliases and readiness counts agree; publisher keys remain unverified.");
