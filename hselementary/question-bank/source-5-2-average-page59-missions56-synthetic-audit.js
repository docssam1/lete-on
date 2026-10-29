"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page59-original-missions56.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const [id,key] of Object.entries(mod.definitions)){
 const type=types.find(t=>t.id===id);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,key);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${id}"`));
  if(id.endsWith('-5')){const before=Array(7).fill(p.mean),after=before.map((x,j)=>x+p.start+j),actual=after.reduce((a,b)=>a+b,0)/7;assert.equal(q.answerModel.result,actual);assert.equal(q.answer,String(actual));assert(Number.isInteger(actual));}
  else{const mean=v=>(v.reduce((a,b)=>a+b,0)-Math.min(...v)-Math.max(...v))/(v.length-2),a=mean(p.a),b=mean(p.b),diff=Math.abs(a-b),winner=a>b?'가 팀':'나 팀';assert(diff>0);assert.deepEqual(q.answerModel,{a,b,difference:diff,winner});assert.equal(q.answer,`${winner}, ${diff}점`);for(const row of [p.a,p.b])assert(row.every(v=>Number.isInteger(v)&&v>=0&&v<=10));const cells=[...q.prompt.matchAll(/<td>(\d+)<\/td>/g)].map(m=>Number(m[1]));assert.deepEqual(cells,[...p.a,...p.b]);}
 }
 assert.equal(prompts.size,3);
}
console.log('Mission 5–6: six synthetic variants, independent average calculations, table cells and guards passed');
