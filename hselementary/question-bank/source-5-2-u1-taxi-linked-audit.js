'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u1-taxi-linked.js');
const expected=[12820,12850,11750,14600];
api.cases.forEach((c,i)=>{let fare=c.base,position=1000,steps=0;while(position<c.distance){position+=c.step;fare+=c.price;steps++;}assert.equal(fare,expected[i]);const item=api.build(i);assert.equal(item.answer,`${fare.toLocaleString('en-US')}원`);assert(item.solution.includes(`${steps}구간`));});
assert.equal(api.build(-1),null);assert.equal(api.build(4),null);
console.log('PASS: taxi fare intervals independently counted');
