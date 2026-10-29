"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page43-mission4.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty);
  let term=p.firstHundredths;for(let n=1;n<p.termNumber;n++)term+=p.differenceHundredths;
  assert.equal(q.answerModel.answerHundredths,term);assert.equal(q.answerModel.jumps,p.termNumber-1);
  assert.notEqual(term,p.firstHundredths+p.termNumber*p.differenceHundredths);
  for(let j=0;j<5;j++){const [whole,frac]=q.answerModel.firstTerms[j].split('.');assert.equal(Number(whole)*100+Number(frac),p.firstHundredths+j*p.differenceHundredths);}
  assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
console.log('Mission 4: sequence terms verified by repeated addition');
