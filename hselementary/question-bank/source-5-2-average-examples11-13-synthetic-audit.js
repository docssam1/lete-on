"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const n of [11,13]){
 const mod=require(`./source-5-2-average-page58-original-example${n}.js`),type=types.find(t=>t.id===mod.sourceItemId);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i);assert.equal(q.variantProvenance,'synthetic-source-structure');prompts.add(q.prompt);
  if(n===11){const p=q.questionModel,solutions=[];for(let a=10*p.tens;a<10*(p.tens+1);a++)for(let b=p.ones;b<=99;b+=10)if(a+b+p.known.reduce((x,y)=>x+y,0)===p.mean*5)solutions.push([a,b]);assert.deepEqual(solutions,[[q.answerModel.korean,q.answerModel.math]]);assert(q.prompt.includes('source52-p58ex11-table'));}
  else{const p=q.questionModel,air=p.air.reduce((x,y)=>x+y,0),water=p.water.reduce((x,y)=>x+y,0);assert.equal(q.answer,`${Math.abs(air-water)/6}℃`);for(const name of ['air','water']){const re=new RegExp(`<circle class="source52-p58ex13-point ${name}" data-month="(\\d+)" data-value="(\\d+)" cx="(\\d+)" cy="(\\d+)"`,'g');const points=[...q.prompt.matchAll(re)];assert.equal(points.length,6);points.forEach((m,j)=>{assert.equal(+m[1],p.months[j]);assert.equal(+m[2],p[name][j]);assert.equal(+m[3],65+j*75);assert.equal(+m[4],250-10*p[name][j]);});}}
 }
 assert.equal(prompts.size,3);
}
console.log('Synthetic score table and line charts: exhaustive answers, plotted points and release guards passed');
