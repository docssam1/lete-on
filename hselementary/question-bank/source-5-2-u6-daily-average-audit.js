'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u6-daily-average-linked.js');
const expected=[600,650,700,800];
api.cases.forEach((p,i)=>{const distances=Array.from({length:p.days},(_,n)=>expected[i]+n*p.increment);assert.equal(distances.reduce((a,b)=>a+b,0),p.mean*p.days);assert.equal(new Date(2025,p.month,0).getDate(),p.days);assert.equal(api.build(i).answer,`${expected[i]}m`);});
console.log('PASS: all daily distances and calendar lengths reproduce the stated averages');
