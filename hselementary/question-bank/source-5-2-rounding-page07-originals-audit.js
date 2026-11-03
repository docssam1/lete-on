"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-rounding-page07-originals.js");
const down=(x,k)=>Math.floor(x/k)*k,up=(x,k)=>Math.ceil(x/k)*k,near=(x,k)=>Math.floor((x+k/2)/k)*k;
assert.deepEqual([4721,7698].map(n=>[10,100,1000].map(k=>up(n,k))),[[4730,4800,5000],[7700,7700,8000]]);
assert.deepEqual([72462,351716].map(n=>Math.abs(up(n,100)-near(n,1000))),[500,200]);
const values=[];function permute(left,used){if(!left.length){if(used[0]!==0)values.push(Number(used.join('')));return;}for(let i=0;i<left.length;i++)permute(left.slice(0,i).concat(left.slice(i+1)),used.concat(left[i]));}
permute([0,8,3,9,1,4],[]);const distance=Math.min(...values.map(n=>Math.abs(n-400000)));assert.deepEqual(values.filter(n=>Math.abs(n-400000)===distance),[401389]);assert.equal(near(401389,1000),401000);
const digits=[];for(let d=0;d<=9;d++){const x=465032+100*d;if(down(x,1000)===near(x,1000))digits.push(d);}assert.deepEqual(digits,[0,1,2,3,4]);
assert.equal((api.table(false).match(/&nbsp;/g)||[]).length,6);assert.ok(api.table(true).includes('4730'));
for(const q of api.data){const type={id:api.id(q.n),sourceItemId:api.id(q.n),generatorKey:api.key(q.n),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.n).publisherKeyVerified,false);}
console.log('PASS: source table, all card permutations, rounding differences and digits');
