"use strict";
const assert = require("node:assert/strict"), m = require("./source-5-2-u4-page44-exploration2.js");
assert.equal(m.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const q=m.getQuestion(i,difficulty), p=q.questionModel;
  let sum=0;
  for(let j=0;j<p.multiplierHundredThousand;j++)sum+=p.multiplicandTenThousand;
  const digits=String(sum).padStart(9,'0');
  assert.equal(p.product,`0.${digits}`);
  assert.deepEqual(p.missingDigits,[Number(digits[3]),Number(digits[8])]);
  assert.equal(q.answer,`(${digits[3]}, ${digits[8]})`);
  assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
  assert(q.solution.includes(p.product));
}
assert.equal(m.getQuestion(3,0),null);
console.log('Exploration 2: exact products and missing digit positions independently verified');
