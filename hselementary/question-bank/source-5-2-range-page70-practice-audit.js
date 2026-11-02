'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const totals=[];for(let overlap=0;overlap<=10;overlap++)totals.push(17+10-overlap+5);assert.equal(Math.min(...totals),22);assert.equal(Math.max(...totals),32);assert.equal(new Set(totals).size,11);
const boxes=[];for(let n=1;n<=100;n++)if(15*n<=749&&749<=25*n)boxes.push(n);assert.deepEqual(boxes,Array.from({length:20},(_,i)=>i+30));
const eggs=[];for(let n=123;n<145;n++)if(n%8===3&&(n+4)%11===0)eggs.push(n);assert.deepEqual(eggs,[139]);
const ceil100=Math.ceil(74805/100)*100,floor1000=Math.floor(74805/1000)*1000;assert.equal(ceil100-floor1000,900);
assert.equal(api.build(20).answer,'139개');assert.equal(api.build(22).answer,'900');for(const n of [18,19,20,22]){assert.equal(api.build(n).sourcePdfPage,66);assert.equal(api.build(n).sourcePrintedPage,70)}
console.log('PASS: overlap, every feasible box count, packaging and rounding');
