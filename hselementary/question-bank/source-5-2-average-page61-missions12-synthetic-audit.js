"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page61-original-missions12.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const [id,key] of Object.entries(mod.definitions)){
 const type=types.find(t=>t.id===id);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,key);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${id}"`));
  if(id.endsWith('-1')){let total=0;for(let j=0;j<p.days.length;j++)for(let d=0;d<p.days[j];d++)total+=p.people[j];const candidates=[];for(let n=1;n<=total;n++)if(n*p.newPeople===total)candidates.push(n);assert.deepEqual(candidates,[q.answerModel.days]);assert.equal(q.answer,`${candidates[0]}일`);}
  else{const c=[];for(let x=10;x<=99;x++)if(p.mean*6-x+(2*x-p.subtract)===p.newMean*6)c.push(x);assert.deepEqual(c,[q.answerModel.largest]);const w=p.witness;assert.equal(w.length,6);assert.equal(new Set(w).size,6);assert(w.every(x=>x>=10&&x<=99));assert.equal(Math.max(...w),c[0]);assert.equal(w.reduce((a,b)=>a+b,0),6*p.mean);const transformed=w.map(x=>x===c[0]?2*x-p.subtract:x);assert.equal(transformed.reduce((a,b)=>a+b,0),6*p.newMean);assert.equal(q.answer,String(c[0]));}
 }
 assert.equal(prompts.size,3);
}
console.log('Missions 1–2: six unique answers, work totals, two-digit constructive witnesses and guards passed');
