"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page42-example14.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty);
  const spoiled=BigInt(p.fruitCount)*BigInt(p.spoiledPercent*10)/1000n;
  const sellable=BigInt(p.fruitCount)-spoiled;
  const revenue=BigInt(p.purchaseCost)*(1000n+BigInt(p.profitPercent*10))/1000n;
  assert.equal(revenue%sellable,0n);assert.equal(BigInt(q.answerModel.price),revenue/sellable);
  assert.equal(Number(q.answerModel.price),[500,460,495][i]);
  assert(q.prompt.includes('모두 같은 가격'));assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
}
console.log('Example 1-4: saleable quantity, target revenue and exact price verified');
