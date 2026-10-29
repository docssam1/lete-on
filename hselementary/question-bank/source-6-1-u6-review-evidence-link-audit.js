"use strict";
// Check links to existing records; this does not revalidate the source or answer.
const assert=require("node:assert/strict");
const common=require("./source-inventory/6-1-source-items.json");
const detail=require("./source-inventory/6-1-u6-source-readiness-review.json");
const prefix="6-1-u6-source-readiness-review.json#";
const linked=common.items.filter(row=>typeof row.reviewEvidenceRef==="string"&&row.reviewEvidenceRef.startsWith(prefix));
assert.equal(linked.length,20);
const seen=new Set();
for(const row of linked){
 assert(!seen.has(row.sourceItemId));seen.add(row.sourceItemId);
 assert.equal(row.reviewEvidenceRef,prefix+row.sourceItemId);
 const matching=detail.items.filter(item=>item.sourceItemId===row.sourceItemId);assert.equal(matching.length,1);
 const item=matching[0];assert.equal(row.pdfPage,item.sourcePdfPage);
 assert.equal(row.sourceVerified,true);assert.equal(row.implementationStatus,"implemented");
 assert.equal(item.sourceVerified,true);assert.equal(item.calculationStatus,"checked");assert.equal(item.singleAnswer,true);
 assert.equal(typeof item.independentCalculation,"string");assert(item.independentCalculation.trim());
 assert.match(row.reviewReason,/출판사 답안은 사용하지 않았습니다/);
}
assert.equal(detail.sourceIdentity.answerKeyUsed,false);
console.log("PASS: 20 common rows reference matching existing detailed calculations and page numbers; source and answers were not re-reviewed.");
