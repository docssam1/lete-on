"use strict";
const assert = require("node:assert/strict");
const api = require("./source-5-2-range-page04-originals.js");
const starts = [];
for (let lo=100;lo<=999;lo++) for(let hi=lo;hi<=999;hi++) if(hi-lo+1===567) starts.push(lo);
assert.equal(Math.max(...starts),433);
const students=[];
for(let n=1;n<=500;n++) if(Math.ceil(n/6)===70 && Math.ceil(n/8)===52) students.push(n);
assert.deepEqual(students,[415,416]);
const overlaps=[];
for(let both=0;both<=21;both++) if(33+21-both<=40) overlaps.push(both);
assert.deepEqual(overlaps,[14,15,16,17,18,19,20,21]);
const boxes=[];
for(let n=1;n<=20;n++) if(33*n<=365 && 42*n>=365) boxes.push(n);
assert.deepEqual(boxes,[9,10,11]);
for(const contents of [[41,41,41,41,41,41,41,41,37],[36,36,36,36,36,36,36,36,36,41],[33,33,33,33,33,33,33,33,33,33,35]]) {
  assert.equal(contents.reduce((a,b)=>a+b,0),365);
  assert.ok(contents.every(n=>33<=n&&n<43));
}
for(const q of api.data){const type={id:api.id(q.n),sourceItemId:api.id(q.n),generatorKey:api.key(q.n),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.n).publisherKeyVerified,false);}
console.log('PASS: four original answers, boundaries and feasible allocations');
