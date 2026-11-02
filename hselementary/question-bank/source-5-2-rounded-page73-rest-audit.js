'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i),ceil=(n,p)=>Math.ceil(n/p)*p,floor=(n,p)=>Math.floor(n/p)*p,round=(n,p)=>Math.floor((n+p/2)/p)*p;
const m45=range(400,700).filter(n=>ceil(n,100)===600&&round(n,100)===500);assert.equal(m45.length,49);assert.equal(m45[0],501);assert.equal(m45.at(-1),549);
const men=range(13800,14100).filter(n=>ceil(n,100)===14000),women=range(13900,14100).filter(n=>floor(n,10)===14000);assert.equal(Math.max(...men.flatMap(a=>women.map(b=>Math.abs(a-b)))),108);
assert.deepEqual(range(2300,2600).filter(n=>ceil(n,100)===2500&&floor(n,100)===2400&&round(n,10)===2500),[2495,2496,2497,2498,2499]);
const m48=range(7810000,7840000).filter(n=>ceil(n,10000)===7830000&&floor(n,10000)===7820000&&round(n,10000)===7820000);assert.equal(m48.length,4999);assert.equal(m48[0],7820001);assert.equal(m48.at(-1),7824999);
for(const n of [45,46,47,48]){assert.equal(api.build(n).sourcePdfPage,69);assert.equal(api.build(n).sourcePrintedPage,73)}console.log('PASS: all rounding cases, largest population difference and excluded endpoint');
