'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u3-palindrome-synthetic.js');
const source=require('./source-inventory/5-2-source-items.json').sourceItems.find(x=>x.sourceItemId==='5-2-u3-e6-example-3');
assert.equal(source.sourceVerified,true);assert.equal(source.implementationStatus,'review-locked');assert.equal(source.publisherKeyVerified,false);assert.equal(source.syntheticRuntimeTypeId,api.id);
for(let i=0;i<3;i++){for(let difficulty of [-1,0,1]){let q=api.makeQuestion(i,difficulty),{lo,hi}=q.questionModel,count=0;for(let n=lo;n<=hi;n++){let s=String(n);if(s===s.split('').reverse().join(''))count++}assert.equal(count,[189,180,990][i]);assert.equal(q.answerModel.count,count);assert.equal(q.answer,`${count}개`);assert.ok(q.solution.includes(q.answer));assert.equal(q.answerVisualRequired,false);}}
console.log('3 independent palindrome enumerations × 3 difficulties passed; original remains locked');
