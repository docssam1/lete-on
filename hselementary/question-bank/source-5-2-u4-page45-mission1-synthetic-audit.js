"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission1.js');
function compare(s,n,d){const [a,b='']=s.split('.');assert.equal(BigInt(a+b)*BigInt(d),BigInt(n)*10n**BigInt(b.length))}
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),a=p.a,b=p.b,c=p.c,d=p.d;
 assert.equal(b[1],b[3]);assert.equal(c[2],c[4]);assert.equal(d[0],d[2]);
 const values=[a[0]*a[1]*a[2],b[0]*b[1]-b[2]*b[3],(c[0]-c[1])*c[2]*100+c[3]*c[4],(d[0]*d[1]-d[2]*d[3])*d[4]];
 values.forEach((n,j)=>compare(q.answerModel.orderedAnswers[j],n,[1000000,10000,10000,1000000][j]));
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
 assert.equal((q.prompt.match(/<li>/g)||[]).length,4);assert.equal((q.solution.match(/<li>/g)||[]).length,4);
}
assert.throws(()=>m.build(3,0));
console.log('Mission 1: four expressions independently checked with exact scaled integers');
