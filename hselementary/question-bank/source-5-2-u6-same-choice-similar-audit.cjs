'use strict';
const assert=require('node:assert/strict');
const bank=require('./source-5-2-u6-same-choice-similar.js');
for(let i=0;i<bank.cases.length;i++){
 const {people:n,colors:k}=bank.cases[i];let all=[[]];for(let j=0;j<n;j++)all=all.flatMap(row=>Array.from({length:k},(_,c)=>[...row,c]));
 const good=all.filter(v=>new Set(v).size===1);assert.equal(good.length,k);assert.equal(bank.build(i).answer,`1/${all.length/k}`);
}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['1/4','1/8','1/9','1/27']);assert.equal(bank.build(4),null);console.log('PASS: all choices enumerated independently for each group and color count');
