"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-rounding-page06-originals.js");
const down=(x,k)=>Math.floor(x/k)*k,up=(x,k)=>Math.ceil(x/k)*k,near=(x,k)=>Math.floor((x+k/2)/k)*k;
assert.deepEqual([up(735809,100),down(735809,1000),near(735809,10000)],[735900,735000,740000]);
assert.deepEqual([15209,37064,61325,78472].map(n=>up(n,100)===near(n,100)),[false,true,false,true]);
const [a,b]=[4772134,4993082];assert.equal(up(a,10000)+up(b,10000)-down(a,10000)-down(b,10000),20000);
assert.equal(near(a+b,10000)-(near(a,10000)+near(b,10000)),10000);
assert.deepEqual([1450,2542,3664,4705,5878].filter(n=>up(n,10)!==near(n,10)&&down(n,100)!==near(n,100)),[3664]);
const possible=[];for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)for(let c=0;c<=9;c++)if(a+b+c===8&&a>b&&b>c&&near(2000+100*a+10*b+c,100)===2500)possible.push([a,b,c]);
assert.deepEqual(possible,[[5,2,1],[5,3,0]]);
for(const q of api.data){const type={id:api.id(q.suffix),sourceItemId:api.id(q.suffix),generatorKey:api.key(q.suffix),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.suffix).publisherKeyVerified,false);}
console.log("PASS: original rounding calculations and retained ambiguous example");
