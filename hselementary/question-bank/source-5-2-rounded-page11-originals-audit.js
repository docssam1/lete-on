"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-rounded-page11-originals.js");
const down=(x,k)=>Math.floor(x/k)*k,up=(x,k)=>Math.ceil(x/k)*k,near=(x,k)=>Math.floor((x+k/2)/k)*k;
const candidates=[];for(let n=1;n<=5000;n++)if(near(n,100)===4000&&down(n,1000)===3000)candidates.push(n);
assert.equal(candidates.length,50);assert.equal(candidates[0],3950);assert.equal(candidates.at(-1),3999);
const students=[];for(let n=1;n<=100;n++)if(up(n,10)===50)students.push(n);
assert.equal(students[0],41);assert.equal(students.at(-1),50);assert.deepEqual(students.map(n=>160-3*n),[37,34,31,28,25,22,19,16,13,10]);
const works=x=>near(x,100000)===7900000&&down(x,100000)===7900000&&up(x,100000)===8000000;
assert.equal(works(7900000),false);assert.equal(works(7900000.1),true);assert.equal(works(7949999.9),true);assert.equal(works(7950000),false);
const values=[];for(let n=1;n<=1000;n++)if(near(n/9,10)===30&&down(n/6,10)===40)values.push(n);
assert.equal(values[0],240);assert.equal(values.at(-1),299);assert.equal(values.length,60);assert.equal(values.reduce((a,b)=>a+b,0),16170);
for(const q of api.data){const type={id:api.id(q.n),sourceItemId:api.id(q.n),generatorKey:api.key(q.n),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.n).publisherKeyVerified,false);}
console.log('PASS: count, discrete notebook values, continuous endpoints and quotient sum');
