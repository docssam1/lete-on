"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page59-original-missions12.js');
const types=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types);
for(const [id,key] of Object.entries(mod.definitions)){
 const type=types.find(t=>t.id===id);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,key);
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
 const prompts=new Set();for(let i=0;i<3;i++){
  const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);
  if(id.endsWith('-1')){const candidates=[];for(let x=0;x<=1000;x++)if(p.left+x+2*p.right===4*p.target)candidates.push(x);assert.deepEqual(candidates,[q.answerModel.blank]);assert.equal(q.answer,String(candidates[0]));}
  else{const candidates=[];for(let x=p.tens*10;x<p.tens*10+10;x++)for(let y=p.ones;y<=99;y+=10)if(x+y+p.known[0]+p.known[1]===4*p.mean)candidates.push([x,y]);assert.deepEqual(candidates,[[q.answerModel.math,q.answerModel.social]]);assert(q.prompt.includes('source52-p59m2-table'));}
 }
 assert.equal(prompts.size,3);
}
console.log('Mission 1–2 synthetic variants: exact equations, unique digit pairs and release guards passed');
