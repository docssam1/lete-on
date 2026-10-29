"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page42-example12.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty);
  const [whole,frac='']=String(p.difference).split('.');
  const expectedDifference=Number(whole)*100+Number(frac.padEnd(2,'0'));
  const matches=[];for(let n=1;n<=10000;n++)if(p.hundredths*n*99===expectedDifference)matches.push(n);
  assert.deepEqual(matches,[p.naturalNumber]);assert.equal(Number(q.answer),matches[0]);
  assert.equal(p.hundredths*p.naturalNumber*99,expectedDifference);
  assert(q.prompt.includes('소수 둘째 자리까지'));assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
}
console.log('Example 1-2: exact differences and unique natural numbers verified');
