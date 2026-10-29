"use strict";
// Verify pointers to prior review records; this does not re-review answers.
const assert=require("node:assert/strict");
const common=require("./source-inventory/6-2-source-items.json");
const detail=require("./source-inventory/6-2-u2-e1-readiness-review.json");
const prefix="6-2-u2-e1-readiness-review.json#";
const linked=common.items.filter(row=>typeof row.reviewEvidenceRef==="string"&&row.reviewEvidenceRef.startsWith(prefix));
assert.equal(linked.length,6);
assert.equal(detail.missionSourceIdentity.originalChecked,true);
assert.equal(detail.officialAnswerEvidence.status,"not-used");
for(let n=1;n<=6;n++){
 const id=`6-2-u2-e1-mission-${n}`,rows=linked.filter(row=>row.sourceItemId===id),items=detail.items.filter(item=>item.sourceItemId===id);
 assert.equal(rows.length,1);assert.equal(items.length,1);
 const [row]=rows,[item]=items;
 assert.equal(row.reviewEvidenceRef,prefix+id);assert.equal(row.pdfPage,detail.missionSourceIdentity.pdfPage);
 assert.equal(row.sourceVerified,true);assert.equal(row.implementationStatus,"fixed-verified-pool");
 assert.equal(item.releaseStatus,"verified");assert.equal(item.singleAnswer,true);
 assert.equal(typeof item.independentCalculation,"string");assert(item.independentCalculation.trim());
 assert.match(row.reviewReason,/출판사 답안은 사용하지 않았습니다/);
}
console.log("PASS: six common rows link to matching prior calculations and page; source and answers were not re-reviewed.");
