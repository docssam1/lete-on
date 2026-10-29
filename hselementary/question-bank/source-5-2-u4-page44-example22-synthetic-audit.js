"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page44-example22.js');
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const q=m.getQuestion(i,difficulty),p=q.questionModel,d=BigInt(p.divisorTenths),t=BigInt(p.targetTenths);
 assert.equal(2n*BigInt(p.lowerCents),d*(2n*t-1n));
 assert.equal(2n*BigInt(p.upperCents),d*(2n*t+1n));
 assert.equal(p.upperCents-p.lowerCents,p.divisorTenths);
 assert.equal(q.answer,`${p.lower}≤x<${p.upper}`);
 assert(q.solution.includes(`${p.lower}≤x&lt;${p.upper}`));
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.equal(m.getQuestion(3,0),null);
console.log('Example 2-2: exact scaled half-open rounding boundaries verified');
