"use strict";
// Verify pointers to prior review records; does not re-review original answers.
const assert=require("node:assert/strict");
const common=require("./source-inventory/6-2-source-items.json");
const groups=[
 {filename:"6-2-u2-e3-exploration-source-review.json",data:require("./source-inventory/6-2-u2-e3-exploration-source-review.json"),key:"sourceItems",ids:["6-2-u2-e3-exploration-1","6-2-u2-e3-exploration-2"]},
 {filename:"6-2-u2-e5-source-review.json",data:require("./source-inventory/6-2-u2-e5-source-review.json"),key:"items",ids:["6-2-u2-e5-exploration-1",...[1,2,3,4].map(n=>`6-2-u2-e5-example-${n}`)]}
];
for(const {filename,data,key,ids} of groups){
 assert.equal(data.sourceIdentity.originalChecked,true);
 assert.match(data.officialAnswerEvidence,/^not-available/);
 for(const id of ids){
  const rows=common.items.filter(row=>row.sourceItemId===id),items=data[key].filter(item=>item.sourceItemId===id);
  assert.equal(rows.length,1);assert.equal(items.length,1);
  const [row]=rows,[item]=items;
  assert.equal(row.reviewEvidenceRef,`${filename}#${id}`);assert.equal(row.pdfPage,data.sourceIdentity.pdfPage);
  assert.equal(row.sourceVerified,true);assert.equal(row.implementationStatus,"fixed-verified-pool");
  assert.equal(item.publicReleaseStatus||item.candidateVerification?.publicReleaseStatus,"verified");
  assert(item.independentCheck||item.independentRounded);
  assert.match(row.reviewReason,/공식 출판사 답안은 확인되지 않았습니다/);
 }
}
const conflict=common.items.find(row=>row.sourceItemId==="6-2-u2-e3-exploration-3");
assert.equal(conflict.implementationStatus,"handwriting-conflict-locked");
console.log("PASS: seven prior review links match source IDs and pages; the handwriting-conflict item remains locked.");
