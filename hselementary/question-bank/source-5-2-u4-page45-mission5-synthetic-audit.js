"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission5.js');
function fraction(s){let[a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)]}
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),r=m.calculate(p);const possibilities=[];
 for(let a=1;a<r.sumHundredths;a++){let b=r.sumHundredths-a;if(100*a-b===r.omittedDifferenceHundredths)possibilities.push([a,b])}
 assert.deepEqual(possibilities,[[p.aHundredths,p.bHundredths]]);
 const [n,d]=fraction(q.answer);assert.equal(n*10000n,BigInt(p.aHundredths)*BigInt(p.bHundredths)*d);
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.throws(()=>m.build(3,0));
console.log('Mission 5: unique decimal pair and product verified by enumeration');
