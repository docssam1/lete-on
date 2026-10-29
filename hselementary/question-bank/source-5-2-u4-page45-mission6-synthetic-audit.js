"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u4-page45-mission6.js');
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
 const p=m.pools[i],q=m.build(i,difficulty),found=[];
 for(let n=1;n<1000;n++){const z=p.factorTenths*n;if(z>=p.upperProduct*100)break;if(n%10!==0&&z>p.lowerProduct*100&&z%10===0&&z%100!==0)found.push(n)}
 assert(found.every(n=>n<100));assert.deepEqual(m.enumerate(p).map(x=>x.n),found);
 assert.equal(q.answer,`${found.length}개`);assert(!q.prompt.includes('${'));assert(!q.solution.includes('/10'));
 assert(q.prompt.includes('정수가 아닌 소수 한 자리'));assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
assert.throws(()=>m.build(3,0));
console.log('Mission 6: complete non-integer tenths and product enumeration verified');
