"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-unit1-remaining-originals.js");
const down=(x,k)=>Math.floor(x/k)*k,up=(x,k)=>Math.ceil(x/k)*k,near=(x,k)=>Math.floor((x+k/2)/k)*k;
const boxes=[];for(let n=1;n<=50;n++)if(23*n<=1000&&1000<=33*n){boxes.push(n);let remaining=1000-23*n;const items=Array(n).fill(23);for(let i=0;i<n;i++){const add=Math.min(10,remaining);items[i]+=add;remaining-=add;}assert.equal(remaining,0);assert.equal(items.reduce((a,b)=>a+b,0),1000);assert.ok(items.every(x=>23<=x&&x<=33));}
assert.deepEqual(boxes,Array.from({length:13},(_,i)=>31+i));
let count4=0;for(let x=1000;x<=9999;x++)if(up(x,100)===down(x,100)&&down(x,100)===near(x,100))count4++;assert.equal(count4,90);
let count3=0;for(let x=100;x<=999;x++)if(up(x,10)===near(x,10)&&up(x,100)!==near(x,100))count3++;assert.equal(count3,261);
assert.ok(!api.line(false).includes('u1remaining-answer-marks'));
assert.ok(api.line(true).includes('cx="68" cy="36" r="5" fill="#fff"'));
assert.ok(api.line(true).includes('cx="264" cy="36" r="5" fill="#191511"'));
for(const q of api.data){const type={id:q.id,sourceItemId:q.id,generatorKey:q.key,sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.id).publisherKeyVerified,false);}
console.log('PASS: continuous endpoints, feasible box allocations and rounding enumeration');
