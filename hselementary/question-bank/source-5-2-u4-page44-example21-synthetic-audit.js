"use strict";
const assert=require('node:assert/strict'), m=require('./source-5-2-u4-page44-example21.js');
function frac(s){s=String(s).replace(/,/g,'');const [a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)]}
function eq(a,b,c){const [an,ad]=frac(a),[bn,bd]=frac(b),[cn,cd]=frac(c);assert.equal(an*bn*cd,cn*ad*bd)}
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const q=m.getQuestion(i,difficulty),p=q.questionModel,v=p.answerValues;
 eq(p.multiplicand,p.multiplier,p.product);
 eq(p.multiplicandHundredths,p.multiplier,v[0]);
 eq(p.multiplicandHundredths,v[1],p.productTenths);
 eq(p.multiplicandThousandths,v[2],p.productTenThousandths);
 eq(v[3],p.multiplierHundredThousandths,p.productHundredThousandths);
 assert.equal(q.answer,`(${v.join(', ')})`);
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
 for(const item of v)assert(q.solution.includes(item));
}
assert.equal(m.getQuestion(3,0),null);
console.log('Example 2-1: four equations independently verified by rational arithmetic');
