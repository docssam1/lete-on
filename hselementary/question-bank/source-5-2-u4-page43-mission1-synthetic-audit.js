"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page43-mission1.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty);
  assert.equal(p.length,4);assert.deepEqual(p.map(x=>x.naturalFirst),[false,false,false,true]);
  p.forEach((item,j)=>{
    const [whole,frac='']=q.answerModel.orderedAnswers[j].split('.');
    const n=BigInt(whole+frac),d=10n**BigInt(frac.length);
    assert.equal(n*100n,BigInt(item.hundredths)*BigInt(item.natural)*d);
  });
  assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
console.log('Mission 1: four ordered decimal products verified exactly');
