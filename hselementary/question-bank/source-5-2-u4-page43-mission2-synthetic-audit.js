"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page43-mission2.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty), area=BigInt(p.length)*BigInt(p.width);
  const cabbage=area*BigInt(p.cabbageHundredths)*100n;
  const sweet=area*(100n-BigInt(p.cabbageHundredths))*BigInt(p.sweetPotatoHundredths);
  const diff=sweet>=cabbage?sweet-cabbage:cabbage-sweet;
  assert.equal(BigInt(q.answerModel.differenceTenThousandths),diff);
  assert.equal(q.answerModel.cabbageTenThousandths,Number(cabbage));
  assert.equal(q.answerModel.sweetPotatoTenThousandths,Number(sweet));
  assert(q.prompt.includes('남은 넓이의'));assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
}
console.log('Mission 2: whole and remainder bases verified with exact arithmetic');
