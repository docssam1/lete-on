'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u6-group-average-linked.js');
const expected=[84,79,82,80];
api.cases.forEach((p,i)=>{const good=expected[i],other=good-p.diff;assert(other>=0&&good<=100);assert.equal(p.pass*good+p.fail*other,(p.pass+p.fail)*p.mean);assert.equal(api.build(i).answer,`${good}점`);});
console.log('PASS: both group averages independently reproduce the given weighted mean');
