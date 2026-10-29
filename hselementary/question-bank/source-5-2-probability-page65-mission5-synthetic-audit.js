"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
for(let i=0;i<3;i++) {
  const q=source.makeQuestion(4,i), {n,w}=q.questionModel, pairs=[];
  for(let a=0;a<n;a++) for(let b=0;b<n;b++) if(a!==b) pairs.push([a,b]);
  const good=pairs.filter(([a,b])=>a<w&&b<w).length;
  assert.equal(q.answerModel.total,pairs.length);assert.equal(q.answerModel.good,good);
  const [num,den]=q.answer.split('/').map(Number);assert.equal(num*pairs.length,den*good);
  assert.equal(q.answer,['3/14','1/11','5/18'][i]);
  assert.equal(q.publisherKeyVerified,false);assert.equal(q.variantProvenance,'synthetic-source-structure');
}
console.log('Mission 5: all ordered ticket pairs without replacement verified');
