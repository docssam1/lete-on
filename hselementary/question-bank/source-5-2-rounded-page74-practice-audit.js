'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i),round=(n,p)=>Math.floor((n+p/2)/p)*p,floor=(n,p)=>Math.floor(n/p)*p,ceil=(n,p)=>Math.ceil(n/p)*p;
const crowd=range(1,1000).filter(n=>round(n,100)===600);assert.equal(Math.max(...crowd)*2-1200,98);
const nums=range(1,2000).filter(n=>round(n,100)===1400&&floor(n,10)===1370&&n%10===2*(Math.floor(n/100)%10));assert.deepEqual(nums,[1376]);
for(const [n,expected] of [[26,false],[26.1,true],[29.9,true],[30,true],[30.01,false],[33,false]])assert.equal(n>26&&n<33&&ceil(n,10)+ceil(42,10)===80,expected);
const possible=range(1,1200).filter(n=>floor(n/8,10)===120);assert.equal(possible[0],960);assert.equal(possible.at(-1),1039);assert.equal(possible.at(-1)-possible[0],79);
for(const n of [49,50,51,52]){assert.equal(api.build(n).sourcePdfPage,70);assert.equal(api.build(n).sourcePrintedPage,74)}console.log('PASS: crowd maximum, digit constraints, real endpoints and quotient range');
