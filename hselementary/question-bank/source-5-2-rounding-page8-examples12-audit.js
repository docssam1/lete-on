'use strict';
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const source=require('./source-5-2-rounding-page8-examples12.js');
const unit=window.HSE_CURRICULUM.semesters.find(s=>s.id==='5-2').units.find(u=>u.id==='5-2-u1');let checked=0;
for(let i=0;i<2;i++){
 const t=unit.subunits.flatMap(s=>s.types).find(x=>x.sourceItemId===source.ids[i]);assert(t&&!t.reviewLocked&&t.sourceVerified);assert.equal(t.verifiedVariantCount,3);
 const prompts=new Set();for(let v=0;v<3;v++)for(const d of [-1,0,1]){
  const q=window.HSE_GENERATORS.generate(t,2,d,54,v),m=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);assert.equal(q.verifiedPoolIndex,v);prompts.add(q.prompt);
  if(i===0){const results=[];for(const place of [1,10,100,1000,10000,100000])for(const [name,fn] of [['버림',Math.floor],['올림',Math.ceil],['반올림',Math.round]])if(fn(m.value/place)*place===m.target)results.push(`${name}:${place}`);assert.deepEqual(results,['버림:100','버림:1000','반올림:1000']);assert.equal(q.answer,'버림하여 백의 자리, 버림하여 천의 자리, 반올림하여 천의 자리');}
  else{const red=Array.from({length:100},(_,n)=>n).find(n=>n*m.redUnit>=m.red),yellow=Array.from({length:100},(_,n)=>n).find(n=>n*m.yellowUnit>=m.yellow);assert.equal(m.redCount,red);assert.equal(m.yellowCount,yellow);assert.equal(m.total,red*m.redPrice+yellow*m.yellowPrice);assert.equal(q.answer,`${m.total.toLocaleString('en-US')}원`);assert.ok(q.prompt.includes(`${(m.red/100).toFixed(2)}m`)&&q.prompt.includes(`${(m.yellow/100).toFixed(2)}m`));}
  checked++;
 }
 assert.equal(prompts.size,3);assert.equal(window.HSE_GENERATORS.generate({...t,reviewLocked:true},2,0,54,0),null);
}
assert.equal(checked,18);console.log('two types: all three synthetic variants × three difficulty offsets independently verified');
