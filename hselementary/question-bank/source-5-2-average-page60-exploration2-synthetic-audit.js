"use strict";
const assert=require('node:assert/strict');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page60-original-exploration2.js');
const type=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types).find(x=>x.id===mod.sourceItemId);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,mod.generatorKey);
for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
const prompts=new Set();for(let i=0;i<3;i++){
 const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel,c=p.counts;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${mod.sourceItemId}"`));
 const combinations=[];for(let mask=0;mask<8;mask++){const red=mask&1?1:0,white=mask&2?1:0,blue=mask&4?1:0;combinations.push({score:3*red+2*white+blue,red,white});}
 const answers=[];for(let four=0;four<=p.n;four++)for(let zero=0;zero<=p.n;zero++)for(let red3=0;red3<=c[3];red3++){
  const cc=[c[0],c[1],four,c[3],c[4],c[5],zero];if(cc.reduce((a,b)=>a+b,0)!==p.n||cc.reduce((a,v,j)=>a+v*(6-j),0)!==p.total)continue;
  const groups=cc.map((count,j)=>({count,options:combinations.filter(x=>x.score===6-j)}));assert.deepEqual(groups.map(g=>g.options.length),[1,1,1,2,1,1,1]);
  const redCount=groups.reduce((sum,g)=>sum+(g.options.length===1?g.count*g.options[0].red:red3),0);if(redCount!==p.red)continue;
  const white=groups.reduce((sum,g)=>sum+(g.options.length===1?g.count*g.options[0].white:g.count-red3),0);answers.push({four,zero,redOnlyAtThree:red3,white});
 }
 assert.deepEqual(answers,[q.answerModel]);const cells=[...q.prompt.matchAll(/<td>(.*?)<\/td>/g)].map(m=>m[1]);assert.deepEqual(cells,c.map((v,j)=>j===2||j===6?'□':String(v)));assert.equal(q.answer,`(1) 4점 ${c[2]}명, 0점 ${c[6]}명 (2) 흰 공 ${q.answerModel.white}개`);
}
assert.equal(prompts.size,3);console.log('Exploration 2: all three variants have unique enumerated solutions, matching table cells and release guards');
