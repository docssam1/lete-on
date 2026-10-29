"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page42-example11.js');
const rat=s=>{let [w,f='']=String(s).split('.');return [BigInt(w+f),10n**BigInt(f.length)];};
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i], q=source.build(i,difficulty);
  let num=BigInt(p.base)*BigInt(p.number),den=1n;
  for(const d of p.decimals){let [a,b]=rat(d);num*=a;den*=b;}
  assert.equal(num,BigInt(q.answerModel.first)*den);
  const [commonNum,commonDen]=rat(p.common);
  let sum=0n;for(let j=0;j<4;j++)sum+=(j%2?-1n:1n)*BigInt(p.coefficients[j])*BigInt(p.values[j]);
  const [actualNum,actualDen]=rat(q.answerModel.second);
  assert.equal(commonNum*sum*actualDen,actualNum*commonDen);
  assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
}
console.log('Example 1-1: both expressions verified with exact rational arithmetic');
