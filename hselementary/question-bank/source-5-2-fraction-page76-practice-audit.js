'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-fraction-page76-practice.js');
const mul=(whole,n,d)=>{assert.equal((whole*n)%d,0);return whole*n/d};
assert.equal(mul(180-mul(180,5,12),10,21),50);assert.equal(mul(300-mul(300,2,5),1,6),30);
const girls=mul(300,7,15),boys=300-girls;assert.equal(300-mul(boys,3,8)-mul(girls,3,14),210);assert.equal(mul(225-mul(225,3,5),4,9),40);
for(const [n,answer] of [[9,'50쪽'],[10,'30개'],[11,'210명'],[12,'40명']]){const q=api.build(n);assert.equal(q.answer,answer);assert.equal(q.sourcePrintedPage,76);assert.equal(q.sourcePdfPage,72)}console.log('PASS: fractions of the whole, remainders and group counts');
