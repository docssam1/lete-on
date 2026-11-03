"use strict";
const assert = require("node:assert/strict");
const api = require("./source-5-2-range-page05-originals.js");
const a=Array.from({length:10},(_,i)=>17+i),b=Array.from({length:16},(_,i)=>23+i);
assert.equal(new Set([...a,...b]).size,22);
assert.equal(a.filter(n=>b.includes(n)).reduce((x,y)=>x+y,0),98);
assert.deepEqual([...new Set(a.flatMap(x=>b.map(y=>x+y)))].sort((x,y)=>x-y),Array.from({length:25},(_,i)=>40+i));
const ends=[];for(let x=25;x<=100;x++)if(Array.from({length:x-25},(_,i)=>25+i).filter(n=>n%3===0).length===15)ends.push(x);
assert.deepEqual(ends,[70,71,72]);
const pairs=[];for(let a=10;a<=99;a++)for(let b=10;b<=99;b++)if(b-a-1===81)pairs.push([a,b]);
assert.equal(pairs.length,8);assert.deepEqual(pairs[0],[10,92]);assert.deepEqual(pairs.at(-1),[17,99]);
const digits=[0,2,3,5,7,9], counts={3:0,5:0,7:0};
for(const a of digits)for(const b of digits)for(const c of digits){if(new Set([a,b,c]).size!==3)continue;const v=100*a+10*b+c;if(v>320&&v<=750)counts[a]++;}
assert.deepEqual(counts,{3:15,5:20,7:13});assert.equal(Object.values(counts).reduce((x,y)=>x+y,0),48);
for(const q of api.data){const type={id:api.id(q.n),sourceItemId:api.id(q.n),generatorKey:api.key(q.n),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.n).publisherKeyVerified,false);}
console.log('PASS: source intervals, endpoint candidates, pairs and all 48 card arrangements');
