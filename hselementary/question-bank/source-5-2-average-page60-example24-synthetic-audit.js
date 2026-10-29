"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');global.window={};require('./source-inventory-4-1.js');require('./source-inventory-grade6.js');require('./curriculum.js');require('./generators.js');const mod=require('./source-5-2-average-page60-original-example24.js');
const type=window.HSE_CURRICULUM.semesters.find(x=>x.id==='5-2').units.find(x=>x.id==='5-2-u6').subunits.flatMap(x=>x.types).find(x=>x.id===mod.sourceItemId);assert(type&&!type.reviewLocked&&type.verifiedVariantCount===3);assert.equal(type.generatorKey,mod.generatorKey);
for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{reviewLocked:true},{sourceVerified:false}])assert.equal(window.HSE_GENERATORS.generate({...type,...bad},2,0,0,0),null);
const prompts=new Set();for(let i=0;i<3;i++){
 const q=window.HSE_GENERATORS.generate(type,2,0,0,i),p=q.questionModel;assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);prompts.add(q.prompt);assert(q.solution.includes(`data-source-answer="${mod.sourceItemId}"`));
 const candidates=[];for(let male=1;male<p.adultCount;male++)for(let boys=1;boys<=male+p.extraChildren;boys++){
  const female=p.adultCount-male,children=male+p.extraChildren,girls=children-boys;if(!girls)continue;
  if(10*(male*p.adultMaleMean+female*p.adultFemaleMean)!==p.adultMean10*p.adultCount)continue;
  if(10*(boys*p.boyMean+girls*p.girlMean)!==(p.adultMean10-p.gap10)*children)continue;
  candidates.push({maleAdults:male,femaleAdults:female,children,childMean:(p.adultMean10-p.gap10)/10,boys,girls,ratio:girls/boys});
 }
 assert.deepEqual(candidates,[q.answerModel]);assert.equal(q.answer,`${candidates[0].ratio}배`);assert(p.adultMaleMean>=20&&p.adultFemaleMean>=20&&p.boyMean<20&&p.girlMean<20);
}
assert.equal(prompts.size,3);
const ledger=JSON.parse(fs.readFileSync(path.join(__dirname,'source-inventory/5-2-source-items.json'),'utf8'));const ambiguous=ledger.sourceItems.find(x=>x.sourceItemId==='5-2-u6-e2-example-3');assert.equal(ambiguous.implementationStatus,'review-locked');const possible=[];for(let pass=0;pass<=100;pass++)for(let fail=0;fail<=100;fail++)if(25*pass+75*fail===6200&&Math.abs(pass-fail)===40)possible.push([pass,fail]);assert.deepEqual(possible,[[32,72],[92,52]]);
console.log('Example 2-4: three uniquely enumerated group solutions and guards passed; example 2-3 remains locked with two possible answers');
