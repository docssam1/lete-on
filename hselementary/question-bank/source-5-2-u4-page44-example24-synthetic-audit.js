"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page44-example24.js');
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const q=m.getQuestion(i,difficulty),p=q.questionModel;
 const before=p.sideTenths*p.sideTenths;
 const after=(p.sideTenths+p.widthIncreaseTenths)*(p.sideTenths+p.heightIncreaseTenths);
 assert.equal(after-before,p.areaIncreaseHundredths);
 assert.equal((p.areaIncreaseHundredths-p.widthIncreaseTenths*p.heightIncreaseTenths)/(p.widthIncreaseTenths+p.heightIncreaseTenths),p.sideTenths);
 assert.equal(q.answer,`${p.side}m`);assert(!q.prompt.includes('<svg'));
 assert(q.answerVisual.includes('data-figure-role="answer"'));assert(q.answerVisual.includes('fill="none"'));
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.equal(m.getQuestion(3,0),null);
console.log('Example 2-4: expanded rectangle areas and reconstructed side verified');
