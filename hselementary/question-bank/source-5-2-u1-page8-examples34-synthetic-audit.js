'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u1-page8-examples34-synthetic.js');
const inventory=require('./source-inventory/5-2-source-items.json');
const text=JSON.stringify(inventory);
for(const n of [3,4]){const row=(inventory.items||inventory.sourceItems||[]).find(x=>x.sourceItemId===`5-2-u1-e3-example-${n}`);assert(row,`source row ${n}`);assert.equal(row.publicDecision,'locked');assert.equal(row.publisherKeyVerified,false);}
for(let i=0;i<2;i++)for(let v=0;v<3;v++)for(const d of [-1,0,1]){const q=api.makeQuestion(i,v,d),p=q.questionModel;assert(q.prompt.includes('data-pool-index'));assert.equal(q.publisherKeyVerified,false);assert.equal(q.answerVerification,'independent-enumeration');let result;
if(i===0){let boxes=0;while((boxes+1)*p.boxSize<=p.total)boxes++;const remainder=p.total-boxes*p.boxSize;assert.equal(remainder%p.bundleSize,0);let count=0;for(let used=0;used<remainder;used+=p.bundleSize)count++;result=boxes*p.boxPrice+count*p.bundlePrice;assert.equal(p.boxes,boxes);assert.equal(p.bundles,count);}
else{let steps=0;for(let covered=p.baseDistance;covered<p.distance;covered+=p.step)steps++;result=p.basePrice+steps*p.stepPrice;assert.equal(p.steps,steps);}
assert.equal(q.answer,`${result.toLocaleString('en-US')}원`);assert(q.solution.includes(result.toLocaleString('en-US')));}
assert.equal(api.makeQuestion(0,0,2),null);console.log('PASS: 18 generated states independently enumerated; original rows locked');
