'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const min=(need,capacity)=>Array.from({length:200},(_,i)=>i).find(n=>n*capacity>=need);
assert.equal(min(736,6),123);assert.equal(min(3980,50)*800,64000);assert.equal(min(130*80,500),21);assert.equal(min(35*80,500),6);
const feasible=Array.from({length:30},(_,i)=>i).filter(n=>120*2+90*3+25*n<=600);assert.equal(Math.max(...feasible),3);
for(const [n,page,pdf] of [[29,71,67],[30,71,67],[31,71,67],[33,72,68]]){const q=api.build(n);assert.equal(q.sourcePdfPage,pdf);assert.equal(q.sourcePrintedPage,page)}assert.equal(api.build(31).automaticGrading,false);
console.log('PASS: minimal seats, boxes, ingredients and maximum truck load');
