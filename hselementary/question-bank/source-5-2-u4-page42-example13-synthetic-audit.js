"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page42-example13.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty), matches=[];
  for(let k=0;k<2000;k++) {
    const truncated=Math.floor(k/10)*10,rounded=Math.floor((k+5)/10)*10;
    if(truncated===p.truncatedTens && rounded===p.roundedTens && (k*p.multiplierTenths)%10===p.targetHundredthsDigit)matches.push(k);
  }
  assert.equal(matches.length,1);assert.equal(Number(q.answer)*10,matches[0]);
  assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
console.log('Example 1-3: rounding boundaries and unique decimal candidates verified');
