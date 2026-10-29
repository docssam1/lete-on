"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission4.js');
function fraction(s){let[a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)]}
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),[n,d]=fraction(q.answer.replace('km',''));
 const gap=BigInt(p.busPer15Cents)*4n-BigInt(p.carSpeedCents);
 assert(gap>0n);assert.equal(n*6000n,gap*BigInt(p.durationMinutes)*d);
 assert(q.prompt.includes('각각 일정한 속력으로 달립니다.'));
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.throws(()=>m.build(3,0));
console.log('Mission 4: relative speed, duration and exact gap independently verified');
