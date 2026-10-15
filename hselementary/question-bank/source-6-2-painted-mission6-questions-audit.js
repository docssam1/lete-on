"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),presentation=require("./source-6-2-painted-mission6-presentation.js");
const ids=presentation.sourceItemIds,keys=["sourceGrade6SecondSpaceE3PaintedOneFace","sourceGrade6SecondSpaceE3PaintedNoFace"],sourceAnswers=[[44,32,56],[12,8,16]],secondary=[60,48,72];
const delegated=[],window={HSE_GENERATORS:{names:["old"],generatorKey:t=>t?.old?"old":"",generate(...args){delegated.push(args);return "unchanged-old-generator";}},HSE_SOURCE_GRADE6_PAINTED_MISSION6_PRESENTATION:presentation};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-6-2-painted-mission6-questions.js"),"utf8"),{window});const api=window.HSE_GENERATORS;let generated=0,rejected=0;
for(let index=0;index<2;index++){const type={sourceItemId:ids[index],generatorKey:keys[index],reviewLocked:false};assert.equal(api.generatorKey(type),keys[index]);
  for(let variant=0;variant<3;variant++)for(let offset=-1;offset<=1;offset++){const q=api.generate(type,1,offset,17,variant);assert(q.prompt.includes(`/v${variant}-given.png`));assert.equal((q.answerVisual.match(/data-source-layers=/g)||[]).length,2);assert(!/<\/?span\b/.test(q.answer));assert.equal(q.answer,offset===1?`(1) ${sourceAnswers[index][variant]}개; (2) ${secondary[variant]}개`:`${sourceAnswers[index][variant]}개`);assert.equal(q.resultContract,offset===1?"ordered":"single-value");assert.equal(q.verifiedVariantCount,3);assert.equal(q.answerPageLayout,"two-column");assert.equal(q.verifiedVariantId,`${ids[index]}:v${variant}`);assert.equal(q.difficultyLevel,offset+1);generated++;}
  assert.equal(api.generatorKey({...type,reviewLocked:true}),"");assert.equal(api.generate({...type,reviewLocked:true},1,0,17),null);rejected++;
  for(const invalid of [-2,2,.5,"0",NaN]){assert.throws(()=>api.generate(type,1,invalid,17),{name:"RangeError"});rejected++;}
  for(const invalid of [-1,.5,"0",NaN,Number.MAX_SAFE_INTEGER+1]){assert.throws(()=>api.generate(type,1,0,17,invalid),{name:"RangeError"});rejected++;}
  assert.equal(api.generate({...type,generatorKey:keys[1-index]},1,0,17),null);assert.equal(api.generatorKey({...type,generatorKey:keys[1-index]}),"");rejected++;
  assert.equal(api.generate({sourceItemId:"unowned",generatorKey:keys[index]},1,0,17),null);rejected++;
  assert.equal(api.generate(type,1,null,17,0).difficultyLevel,1);assert.equal(api.generate(type,1,undefined,17,0).difficultyLevel,1);
  assert.equal(new Set(Array.from({length:120},(_,v)=>api.generate(type,1,0,17,v).verifiedVariantId)).size,3);
}
const other={old:true};assert.equal(api.generatorKey(other),"old");assert.equal(api.generate(other,7,-1,123,4),"unchanged-old-generator");assert.deepEqual(delegated,[[other,7,-1,123,4]]);
console.log(JSON.stringify({status:"passed",generatedCases:generated,routingRejections:rejected,finitePoolOnly:true,unownedGeneratorPreserved:true,learnerReleaseVerified:false}));
