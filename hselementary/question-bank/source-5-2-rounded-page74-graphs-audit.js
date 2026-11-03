'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i),round=(n,p)=>Math.floor((n+p/2)/p)*p,floor=(n,p)=>Math.floor(n/p)*p,ceil=(n,p)=>Math.ceil(n/p)*p;
const a=range(3000,3500).filter(n=>ceil(9*n,1000)===30000);assert.equal(a.length,111);assert.equal(a[0],3223);assert.equal(a.at(-1),3333);
const b=range(1,700).filter(n=>floor(n/15,10)===30&&round(n/11,10)===40);assert.equal(b.length,45);assert.equal(b[0],450);assert.equal(b.at(-1),494);
const digits=range(0,9).filter(d=>round(63507,1000)+round(48035+100*d,1000)+round(57304,1000)===170000);assert.deepEqual(digits,[5,6,7,8,9]);
const bottom=range(150000,170000).filter(n=>round(n,10000)===160000),top=range(270000,290000).filter(n=>round(n,10000)===280000);assert.equal(top.at(-1)-bottom[0],129999);
for(const [city,value] of [['가',16],['나',26],['다',20],['라',28]])assert(api.build(56).prompt.includes(`data-city="${city}" data-value="${value}"`));
console.log('PASS: product, quotients, table digits, graph heights and population extrema');
