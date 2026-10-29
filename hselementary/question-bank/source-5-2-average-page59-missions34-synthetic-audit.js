"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page59-original-missions34.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const [id,key] of Object.entries(mod.definitions)){
 const type=types.find(t=>t.id===id);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,key);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${id}"`));
  if(id.endsWith('-3')){const sum=p.days.reduce((a,b)=>a+b,0),c=[];for(let x=1;x<=1000;x++)if(5*(x-p.extra)===sum+x)c.push(x);assert.deepEqual(c,[q.answerModel.last]);assert.equal(q.answer,`${c[0]}쪽`);assert.equal((sum+c[0])/5,q.answerModel.mean);}
  else{const c=[];for(let x=1;x<=1000;x++)if(p.beforeMean*p.count-x+p.replacement===p.afterMean*p.count)c.push(x);assert.deepEqual(c,[q.answerModel.original]);assert.equal(q.answer,String(c[0]));const rem=p.beforeMean*p.count-c[0],others=[rem-(p.count-2),...Array(p.count-2).fill(1)];assert(others.every(x=>x>0));assert.equal((others.reduce((a,b)=>a+b,0)+p.replacement)/p.count,p.afterMean);}
 }
 assert.equal(prompts.size,3);
}
console.log('Mission 3–4: six synthetic variants, unique answers, natural-number feasibility and release guards passed');
