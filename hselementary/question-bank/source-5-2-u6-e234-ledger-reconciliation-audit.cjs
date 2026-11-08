'use strict';
const assert=require('node:assert/strict');
const ledger=require('./source-inventory/5-2-source-items.json');
const review=require('./source-inventory/5-2-u6-readiness-review.json');
global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');
const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units).find(u=>u.id==='5-2-u6').subunits.flatMap(g=>g.types);
const ids=[
 ...['exploration','example-1','example-2','example-4','mission-1','mission-2','mission-3','mission-5','mission-6'].map(x=>`5-2-u6-e2-${x}`),
 ...['exploration','example-1','example-2','example-3','example-4','mission-1','mission-2','mission-3','mission-4','mission-6'].map(x=>`5-2-u6-e3-${x}`),
 ...['exploration','example-1','example-2','example-4','mission-1','mission-2','mission-3','mission-4','mission-5','mission-6'].map(x=>`5-2-u6-e4-${x}`)
];
for(const id of ids){
 const orig=id+'-original',row=ledger.sourceItems.find(x=>x.sourceItemId===id),r=review.items.find(x=>x.runtimeTypeId===orig),type=types.find(t=>t.id===orig),variant=types.find(t=>t.id===id);
 assert(row&&r&&type&&variant,`missing ${id}`);assert.equal(row.publicDecision,'public');assert.equal(row.originalSourceReleaseStatus,'public');assert.equal(row.originalRuntimeTypeId,orig);assert.equal(row.syntheticRuntimeTypeId,id);
 assert.equal(r.publicDecision,'public');assert.equal(r.originalSourceReleaseStatus,'public');assert.equal(r.syntheticRuntimeTypeId,id);assert.equal(r.lockReason,null);assert.equal(type.reviewLocked,false);assert.equal(type.sourceVerified,true);assert.equal(type.publisherKeyVerified,false);assert.equal(row.publisherKeyVerified,false);assert.equal(r.publisherKeyVerified,false);
}
for(const suffix of ['exploration','example-1','example-2','example-4']){const id=`5-2-u6-e2-${suffix}`;assert.match(types.find(t=>t.id===id).name,/유사문항/);assert.match(types.find(t=>t.id===id+'-original').name,/원문/);}
for(const n of [1,2,3,5,6]){const id=`5-2-u6-e2-mission-${n}`;assert.match(types.find(t=>t.id===id).name,/유사문항/);assert.match(types.find(t=>t.id===id+'-original').name,/원문/);}
for(const suffix of ['exploration','example-1','example-2','example-4']){const id=`5-2-u6-e4-${suffix}`;assert.match(types.find(t=>t.id===id).name,/유사문항/);assert.match(types.find(t=>t.id===id+'-original').name,/원문/);}
for(const id of ['5-2-u6-e2-example-2-3','5-2-u6-e2-mission-4','5-2-u6-e3-mission-5','5-2-u6-e4-example-4-3']){const r=review.items.find(x=>x.sourceItemId===id);assert(r&&r.publicDecision==='locked',`must remain locked: ${id}`)}
console.log(`PASS: ${ids.length} deployed originals agree with both ledgers; four ambiguous originals remain locked`);
