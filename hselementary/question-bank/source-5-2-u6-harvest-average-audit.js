'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u6-harvest-average-linked.js');
const expected=[44,43,52,65];
api.cases.forEach((p,i)=>{const matches=Array.from({length:250},(_,n)=>n).filter(n=>p.first+p.second+n===3*p.mean);assert.deepEqual(matches,[expected[i]]);assert.equal(api.build(i).answer,`${matches[0]}개`);});
console.log('PASS: all missing harvest amounts uniquely satisfy the averages');
