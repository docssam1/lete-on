"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const n of [12,14]){
 const mod=require(`./source-5-2-average-page58-original-example${n}.js`),type=types.find(t=>t.id===mod.sourceItemId);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i);assert.equal(q.variantProvenance,'synthetic-source-structure');prompts.add(q.prompt);
  if(n===12){const times=mod.pools[i];assert(times.every((v,k)=>!k||times[k-1]<=v));const first=times.slice(0,3).reduce((a,b)=>a+b),last=times.slice(2).reduce((a,b)=>a+b),total=times.reduce((a,b)=>a+b);assert.equal(first+last-total,times[2]);assert.equal(q.answer,`${times[2]/100}초`);}
  else {const p=q.questionModel,solutions=[];for(let a=0;a<=100;a++)for(let b=0;b<=100;b++){if(5*a!==p.a.reduce((x,y)=>x+y,0)+a||b+p.bKnown[0]!==p.a[3]+a)continue;for(let c=0;c<=100;c++)if(b+p.bKnown[0]+p.bKnown[1]+c+p.bKnown[2]===5*(a+p.difference))solutions.push([a,b,c]);}assert.deepEqual(solutions,[[q.answerModel.a,q.answerModel.b,q.answerModel.c]]);assert.equal(q.answer,`${solutions[0][2]}점`);}
 }
 assert.equal(prompts.size,3);
}
console.log('Two synthetic average types: exact arithmetic, unique solutions, order witnesses and release guards passed');
