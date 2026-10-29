"use strict";
const assert=require('node:assert/strict');
const ledger=require('./source-inventory/5-2-source-items.json').sourceItems;
global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');
const types=window.HSE_CURRICULUM.semesters.find(s=>s.id==='5-2').units.find(u=>u.id==='5-2-u1').subunits.flatMap(s=>s.types);
for(let n=1;n<=6;n++){
 const row=ledger.find(x=>x.sourceItemId===`5-2-u1-e3-mission-${n}`);assert(row);assert.equal(row.sourceVerified,true);assert.equal(row.implementationStatus,'review-locked');assert.equal(row.publisherKeyVerified,false);
 const matches=types.filter(t=>t.id===row.syntheticRuntimeTypeId);assert.equal(matches.length,1);assert.equal(matches[0].sourceVerified,true);assert.equal(matches[0].reviewLocked,false);assert.equal(matches[0].verifiedVariantCount,3);assert.equal(matches[0].publisherKeyVerified,false);assert(!/\d/.test(matches[0].reviewReason));
}
console.log('Six canonical source rows reconcile with existing synthetic runtime types; originals remain locked');
