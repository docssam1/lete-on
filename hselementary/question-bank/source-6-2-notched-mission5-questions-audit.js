"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const contracts=require("./source-6-2-notched-mission5-contracts.js"),presentation=require("./source-6-2-notched-mission5-presentation.js"),id=contracts.sourceItemId,key="sourceGrade6SecondSpaceE2NotchedVisibility";
const code=fs.readFileSync(path.join(__dirname,"source-6-2-notched-mission5-questions.js"),"utf8"),manifest=require("./assets/source-6-2-notched-mission5/manifest.json");
let generated=0,rects=0,negatives=0;
const api={names:["legacy"],generatorKey(){return "legacy-key";},generate(){return "legacy-unchanged";}},window={HSE_GENERATORS:api,HSE_SOURCE_GRADE6_NOTCHED_MISSION5_PRESENTATION:presentation};
vm.runInNewContext(code,{window});
assert.equal(api.generatorKey({sourceItemId:id,generatorKey:key,reviewLocked:true}),"");assert.equal(api.generate({sourceItemId:id,generatorKey:key,reviewLocked:true}),null);negatives+=2;
for(const type of [{sourceItemId:id,generatorKey:"other"},{sourceItemId:"other",generatorKey:key},{generatorKey:key}]){assert.equal(api.generatorKey(type),"");assert.equal(api.generate(type),null);negatives++;}
for(const unrelated of [{sourceItemId:"other",generatorKey:"other"},{},null]){assert.equal(api.generatorKey(unrelated),"legacy-key");assert.equal(api.generate(unrelated),"legacy-unchanged");}
for(const variant of [0,1,2])for(const level of [0,1,2]){
  const q=contracts.generate(id,variant,level),p=api.generate({sourceItemId:id,generatorKey:key,reviewLocked:false},1,level-1,123,variant);
  assert.equal(p.generator,key);assert.equal(p.verifiedVariantCount,3);assert.equal(p.difficultyLevel,level);assert.equal(p.verifiedPoolIndex,variant);
  assert.equal(p.sourceExact,false);assert.equal(p.originalSourceReleaseStatus,"locked");assert.equal(p.publisherAnswerVerified,false);assert.equal(p.learnerReleaseVerified,false);
  assert(!/<svg|<table|math-inline-expression|어두운 칸|정답은|층에는 \d+개/.test(p.prompt));assert(q.learnerConditions.every(c=>p.prompt.includes(c)));
  assert(p.prompt.includes(`v${variant}-given.png`));assert(!/-full\.png|-filled\.png/.test(p.prompt));
  assert.equal((p.prompt.match(/<img /g)||[]).length,1);assert.equal((p.answerVisual.match(/<img /g)||[]).length,level===2?2:1);
  const expectedAnswer=Array.isArray(q.answer)?q.answer.map((n,index)=>`(${index+1}) ${n}개`).join("; "):`${q.answer}개`;assert.equal(p.answer,expectedAnswer);for(const equation of q.solutionEquations)assert(p.solution.includes(equation));
  assert.deepEqual(p.solutionEquations,[...p.solution.matchAll(/<span class="math-inline-expression"[^>]*>[^<]+<\/span>/g)].map(m=>m[0]));
  assert.deepEqual([...p.solutionEquations].sort(),[...p.sourceSolutionEquations].sort());
  for(const phase of level===2?["original","filled"]:["original"])for(const layer of (phase==="filled"?q.filledModel:q.model).layers){
    const svg=presentation.layerSvg(q,layer.layer,phase),tags=[...svg.matchAll(/<rect\b([^>]*)\/>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]])));
    assert.deepEqual(tags.map(a=>[Number(a["data-x"]),Number(a["data-z"])]),layer.cells);assert.deepEqual(tags.filter(a=>a["data-hidden"]==="true").map(a=>[Number(a["data-x"]),Number(a["data-z"])]),layer.hiddenCells);
    for(const a of tags){assert.equal(Number(a.x),6+20*Number(a["data-x"]));assert.equal(Number(a.y),6+20*Number(a["data-z"]));assert.equal(a.fill,a["data-hidden"]==="true"?"#555":"#fff");}rects+=tags.length;
  }
  for(const invalid of [0,-1,q.model.n+1,1.5,"1",NaN]){assert.throws(()=>presentation.layerSvg(q,invalid));negatives++;}
  if(level!==2){assert.throws(()=>presentation.layerSvg(q,1,"filled"));negatives++;}
  generated++;
}
for(const asset of manifest.assets){const bytes=fs.readFileSync(path.join(__dirname,"assets/source-6-2-notched-mission5",asset.file));assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),asset.sha256);assert.equal(bytes.readUInt32BE(16),asset.width);assert.equal(bytes.readUInt32BE(20),asset.height);}
for(const value of [-1,1.5,"0",NaN,Infinity]){assert.throws(()=>api.generate({sourceItemId:id,generatorKey:key},1,0,1,value));negatives++;}
console.log(JSON.stringify({status:"passed",generated,rects,negatives,unrelatedDelegations:3,originalSourceReleaseStatus:"locked",learnerReleaseVerified:false}));
