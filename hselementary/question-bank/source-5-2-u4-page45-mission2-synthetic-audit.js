"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission2.js');
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),lo=p.lowerHundredths*p.lowerFactor,hi=p.upperHundredths*p.upperFactor;
 let count=0,first=null,last=null;for(let n=8;n<hi;n+=10)if(n>lo){count++;if(first===null)first=n;last=n}
 assert.equal(q.answerModel.count,count);assert.equal(q.questionModel.firstCandidate,first);assert.equal(q.questionModel.lastCandidate,last);
 assert.equal(q.answer,`${count}개`);assert(q.prompt.includes('양 끝값은 포함하지 않습니다.'));
 assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
const edge=m.calculate({lowerHundredths:108,lowerFactor:1,upperHundredths:138,upperFactor:1});
assert.deepEqual(edge.candidates,[118,128]);
assert.throws(()=>m.build(3,0));
console.log('Mission 2: strict endpoints and hundredths enumeration independently verified');
