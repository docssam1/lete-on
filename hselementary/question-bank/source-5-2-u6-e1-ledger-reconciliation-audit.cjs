'use strict';
const assert=require('node:assert/strict');
const ledger=require('./source-inventory/5-2-source-items.json');
const review=require('./source-inventory/5-2-u6-readiness-review.json');
global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');
const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units).find(u=>u.id==='5-2-u6').subunits.flatMap(g=>g.types);
const ids=['5-2-u6-e1-exploration',...[1,2,3,4].map(n=>`5-2-u6-e1-example-${n}`),...[1,2,3,4,5,6].map(n=>`5-2-u6-e1-mission-${n}`)];
for(const id of ids){
 const row=ledger.sourceItems.find(x=>x.sourceItemId===id);const orig=id+'-original';
 const r=review.items.find(x=>x.runtimeTypeId===orig);const type=types.find(t=>t.id===orig);const variant=types.find(t=>t.id===id);
 assert(row&&r&&type&&variant,`missing ${id}`);assert.equal(row.publicDecision,'public');assert.equal(row.originalSourceReleaseStatus,'public');assert.equal(row.originalRuntimeTypeId,orig);assert.equal(row.syntheticRuntimeTypeId,id);
 assert.equal(r.publicDecision,'public');assert.equal(r.originalSourceReleaseStatus,'public');assert.equal(r.syntheticRuntimeTypeId,id);assert.equal(r.lockReason,null);assert.equal(type.reviewLocked,false);assert.equal(type.sourceVerified,true);assert.equal(type.publisherKeyVerified,false);assert.equal(row.publisherKeyVerified,false);assert.equal(r.publisherKeyVerified,false);
}
console.log(`PASS: ${ids.length} deployed original identifiers, review states, variants and publisher verification flags agree`);
