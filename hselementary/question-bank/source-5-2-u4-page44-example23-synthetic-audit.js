"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page44-example23.js');
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const q=m.getQuestion(i,difficulty),p=q.questionModel;
 let digit=p.repeatCount%10;for(let n=0;n<p.repeatCount;n++)digit=(digit*p.repeatedDigit)%10;
 assert.equal(p.firstAnswer,digit);
 let numerator=1n;for(let k=1;k<=p.lastHundredth;k++)numerator*=BigInt(k);
 let power=2*p.lastHundredth+1;while(numerator%10n===0n){numerator/=10n;power--}
 assert.equal(p.decimalPlaces,power);assert.equal(q.answer,`(${digit}, ${power})`);
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.equal(m.getQuestion(3,0),null);
console.log('Example 2-3: repeated modular product and independent decimal factor count verified');
