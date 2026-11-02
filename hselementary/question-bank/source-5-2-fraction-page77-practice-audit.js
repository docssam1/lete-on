'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-fraction-page76-practice.js');const after=1025-1025/5,remaining=after-after*3/10;assert.equal(remaining/2,287);assert.equal((7*5-8*3)*75,55*15);
const hits=[];for(let n=1;n<=99;n++)if((5*n)%14===0)hits.push(n);assert.deepEqual(hits,[14,28,42,56,70,84,98]);const choices=[[4*3,5*10,'㉠'],[3*5,4*9,'㉡'],[5*4,8*7,'㉢'],[9*7,11*12,'㉣']];choices.sort((a,b)=>b[0]*a[1]-a[0]*b[1]);assert.deepEqual(choices.map(x=>x[2]),['㉣','㉡','㉢','㉠']);
for(const n of [17,18,20,21]){assert.equal(api.build(n).sourcePdfPage,73);assert.equal(api.build(n).sourcePrintedPage,77)}console.log('PASS: remaining groups, speed difference, multiples and exact fraction ordering');
