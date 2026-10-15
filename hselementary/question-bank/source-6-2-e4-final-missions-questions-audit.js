"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const presentation=require("./source-6-2-e4-final-missions-presentation.js"),assets=require("./source-6-2-e4-final-missions-assets.js"),script=fs.readFileSync(path.join(__dirname,"source-6-2-e4-final-missions-questions.js"),"utf8"),root=process.env.HSE_FINAL_MISSIONS_EVIDENCE_DIR||"E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",oracle=JSON.parse(fs.readFileSync(path.join(root,"mission-4-5-6-variant-independent/oracle.json"))),sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const ids=Object.keys(presentation.profiles),keys=["sourceGrade6SecondSpaceE4RectangularColoredRemoval","sourceGrade6SecondSpaceE4TransparentRightView"],clone=o=>JSON.parse(JSON.stringify(o)),cellKeys=ps=>ps.map(p=>p.join(",")).sort();let checked=0,negative=0;
function apiWith(render=presentation.render){const window={HSE_GENERATORS:{generatorKey:()=>"unrelated",generate:()=>({unrelated:true}),names:[]},HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_PRESENTATION:{...presentation,render}};vm.runInNewContext(script,{window});return window.HSE_GENERATORS;}
const api=apiWith();
for(let index=0;index<2;index++){const id=ids[index],type={sourceItemId:id,generatorKey:keys[index],reviewLocked:false};
 assert.equal(api.generatorKey(type),keys[index]);assert.equal(api.generate({...type,reviewLocked:true},1,0,0,0),null);negative++;
 for(const mismatch of[{sourceItemId:id},{...type,generatorKey:keys[1-index]},{...type,sourceItemId:"other"}]){assert.equal(api.generate(mismatch,1,0,0,0),null);assert.equal(api.generatorKey(mismatch),"");negative++;}
 for(const variant of presentation.profiles[id].pool)for(let level=0;level<3;level++){
  const q=api.generate(type,1,level-1,0,variant);assert(q,`${id} ${variant} ${level}`);assert.equal(q.verifiedVariantCount,index?3:1);assert.equal(q.generationMode,"fixed-verified-pool");assert.equal(q.verifiedVariantId,`${id}:v${variant}`);
  const expected=oracle[index?"mission6":"mission5"].cases.find(c=>c.variant===variant&&c.level===level);assert(expected);
  if(index===0){assert.deepEqual(cellKeys(q.model.remaining),cellKeys(expected.remainingCellsXYZ));assert.deepEqual(cellKeys(q.model.overlapping),cellKeys(expected.overlapAtLeastTwoCellsXYZ));assert.equal(q.model.remainingCount,expected.remainingCount);}else{assert.deepEqual(q.model.requestedRows,expected.expectedResponseRows);assert.equal(q.requiresDrawing,true);assert.equal(q.numericAnswerDoesNotValidateDrawing,true);assert(!q.prompt.includes('data-projection-role="answer"'));assert.equal((q.prompt.match(/data-projection-role="given"/g)||[]).length,2);assert.equal((q.prompt.match(/data-projection-role="response"/g)||[]).length,1);}
  assert(!/<table\b|data-layer=/.test(q.prompt));assert(!/<table\b|data-layer=/.test(q.answerVisual));assert.equal(q.learner_stage,"초등 6학년 2학기 · 황소 심화 · 공간과 입체");
  const given=presentation.zoomFigure(id,variant,level,"given","problem");assert(q.prompt.includes(`src="${given.source}"`));
  assert.throws(()=>presentation.zoomFigure(id,variant,level,"remaining-three","problem"));negative++;
  const mutations=[r=>{r.answer="wrong";},r=>{r.prompt+="<table></table>";},r=>{r.answerVisual="";},r=>{r.solution="wrong";},r=>{r.officialAnswerVerified=true;},r=>{r.sourceExact=true;},r=>{r.studentGiven.layerCue={answer:1};},r=>{r.model={};},r=>{r.requestedAnswerUnique=false;}];
  for(const mutate of mutations){const bad=apiWith((...args)=>{const r=clone(presentation.render(...args));mutate(r);return r;});assert.equal(bad.generate(type,1,level-1,0,variant),null);negative++;}
  checked++;
 }
 for(const offset of[-2,2,NaN,"0"]){assert.throws(()=>api.generate(type,1,offset,0,0));negative++;}
 for(const variant of[-1,.5,NaN,"0"]){assert.throws(()=>api.generate(type,1,0,0,variant));negative++;}
}
for(const asset of assets.assets)assert.equal(sha(fs.readFileSync(path.join(__dirname,"assets/source-6-2-e4-final-missions",asset.file))),asset.sha256);
assert.deepEqual(api.generate({sourceItemId:"unrelated",generatorKey:"old"}),{unrelated:true});
console.log(JSON.stringify({status:"passed-wrapper-independent-oracle",cases:checked,negative,assets:assets.assets.length,catalogUnlocked:false}));
