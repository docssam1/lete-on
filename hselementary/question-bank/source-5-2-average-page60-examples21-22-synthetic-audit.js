"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page60-original-examples21-22.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const [id,key] of Object.entries(mod.definitions)){
 const type=types.find(t=>t.id===id);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,key);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${id}"`));
  if(id.endsWith('-1')){const minutes=p.people1*p.minutes1+p.people2*p.minutes2,candidates=[];for(let r=1;r<=1000;r++)if(r*minutes===p.area*60)candidates.push(r);assert.deepEqual(candidates,[q.answerModel.areaPerHour]);assert.equal(q.answer,`${candidates[0]}m²`);assert.equal(q.answerModel.personMinutes,minutes);}
  else{assert.equal(new Date(Date.UTC(2026,p.month,0)).getUTCDate(),p.days);const first=q.answerModel.first,seq=Array.from({length:p.days},(_,j)=>first+j*p.increment);assert(first>0);assert.equal(seq.reduce((a,b)=>a+b,0),p.mean*p.days);assert.equal(seq.at(-1),q.answerModel.last);assert.equal(q.answer,`${first}m`);const candidates=[];for(let n=1;n<=p.mean*2;n++)if(Array.from({length:p.days},(_,j)=>n+j*p.increment).reduce((a,b)=>a+b,0)===p.mean*p.days)candidates.push(n);assert.deepEqual(candidates,[first]);}
 }
 assert.equal(prompts.size,3);
}
console.log('Examples 2-1 and 2-2: six variants, independent person-minute and full-calendar sequence checks, unique answers and release guards passed');
