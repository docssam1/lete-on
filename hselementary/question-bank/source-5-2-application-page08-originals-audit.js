"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-application-page08-originals.js");
const methods=[];for(const unit of [10,100,1000,10000,100000])for(const [name,fn] of [['up',Math.ceil],['down',Math.floor],['nearest',Math.round]])if(fn(56074/unit)*unit===56000)methods.push([name,unit]);
assert.deepEqual(methods,[['down',100],['down',1000],['nearest',1000]]);
assert.equal(Math.ceil(946/50),19);assert.equal(Math.ceil(638/40),16);assert.equal(19*560+16*480,18320);
assert.equal(436+436/4+436/2,763);assert.equal(Math.ceil(763/50),16);
assert.equal(Math.ceil(23400/1000)*1000,24000);assert.equal(Math.floor(569/10)*10,560);assert.equal(Math.round(1246/10)/10,12.5);
for(const q of api.data){const type={id:api.id(q.suffix),sourceItemId:api.id(q.suffix),generatorKey:api.key(q.suffix),sourceVerified:true,reviewLocked:false};assert.ok(api.resolves(type,q));assert.ok(!api.resolves({...type,reviewLocked:true},q));assert.equal(api.build(q.suffix).publisherKeyVerified,false);}
assert.ok(api.build('mission-1').prompt.includes('aria-label="4분의 1"'));assert.ok(api.build('mission-1').prompt.includes('aria-label="2분의 1"'));
console.log('PASS: source rounding methods, ribbon purchases, book fractions and open examples');
