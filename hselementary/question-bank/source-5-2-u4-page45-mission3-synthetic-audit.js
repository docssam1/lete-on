"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission3.js');
function fraction(s){let[a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)]}
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),[n,d]=fraction(q.answer);
 assert(p.remainderHundredths<p.divisorHundredths);
 const restored=BigInt(p.divisorHundredths)*BigInt(p.quotientTenths)+10n*BigInt(p.remainderHundredths);
 assert.equal(n*100000n,restored*BigInt(p.divisorHundredths)*d);
 assert.equal(q.answerModel.product,q.answer);assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.throws(()=>m.build(3,0));
console.log('Mission 3: quotient/remainder reconstruction and corrected product verified');
