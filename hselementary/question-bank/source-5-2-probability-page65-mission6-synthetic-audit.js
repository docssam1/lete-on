"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
for(let i=0;i<3;i++) {
  const q=source.makeQuestion(5,i), n=q.questionModel.n, total=6**n;let good=0,different=0,threeOrMore=0;
  for(let mask=0;mask<total;mask++) {let x=mask;const row=[];for(let j=0;j<n;j++){row.push(x%6);x=Math.floor(x/6);}const counts=Array.from({length:6},(_,v)=>row.filter(k=>k===v).length);if(counts.some(k=>k>=2))good++;else different++;if(counts.some(k=>k>=3))threeOrMore++;}
  assert.equal(q.answerModel.total,total);assert.equal(q.answerModel.good,good);assert.equal(q.answerModel.different,different);assert(threeOrMore>0);
  const [num,den]=q.answer.split('/').map(Number);assert.equal(num*total,den*good);
  assert.equal(q.answer,['13/18','49/54','319/324'][i]);
  assert.equal(q.publisherKeyVerified,false);assert.equal(q.variantProvenance,'synthetic-source-structure');
}
console.log('Mission 6: all dice outcomes including three equal faces verified');
