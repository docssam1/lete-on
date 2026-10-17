"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-opposite-removal-models.js"),presentation=require("./source-6-2-opposite-removal-presentation.js"),assets=require("./source-6-2-opposite-removal-assets.js");
const id=models.sourceItemId,key="sourceGrade6SecondSpaceE4OppositeFaceRemoval",code=fs.readFileSync(path.join(__dirname,"source-6-2-opposite-removal-questions.js"),"utf8"),type={sourceItemId:id,generatorKey:key,reviewLocked:false};
function setup(renderer=presentation,assetApi=assets){
 const calls=[],api={names:["old"],generatorKey(){calls.push({kind:"key",receiver:this,args:[...arguments]});return"old-key";},generate(){calls.push({kind:"generate",receiver:this,args:[...arguments]});return"old-question";}};
 vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_MODELS:models,HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_PRESENTATION:renderer,HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_ASSETS:assetApi}});
 return{api,calls};
}
const report={status:"running",cases:0,rejections:0,legacyDelegations:0,assets:0,catalogUnlocked:false};
const{api,calls}=setup();
for(let v=0;v<3;v++)for(let l=0;l<3;l++){
 const q=api.generate(type,1,l-1,55,v),p=presentation.render(id,v,l);assert(q);assert(q.prompt.includes(p.prompt));assert.equal(q.answer,p.answer);assert(q.answerVisual.includes(p.answerVisual));assert.equal(q.verifiedPoolIndex,v);assert.equal(q.difficultyLevel,l);assert.equal(q.sourceExact,false);assert.equal(q.originalSourceReleaseStatus,"locked");
 const mutators=[
  q=>({...q,prompt:q.prompt+'<table><tr><td>1층 25개</td></tr></table>'}),
  q=>({...q,prompt:q.prompt+q.answerVisual}),q=>({...q,prompt:q.prompt+q.solution}),
  q=>({...q,prompt:q.prompt.replace(`v${v}-given.png`,`v${v}-after-three-directions.png`)}),
  q=>({...q,layerCue:{rows:[25]}}),q=>({...q,answer:"0개"}),
  q=>({...q,model:{...q.model,remaining:q.model.remaining.slice(1)}}),
  q=>({...q,studentGiven:{...q.studentGiven,paintedFaces:{}}}),
  q=>({...q,studentGiven:{...q.studentGiven,activeDirections:[]}}),
  ...["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].map(name=>q=>({...q,[name]:true}))
 ];
 for(const change of mutators){const bad=setup({render:(...args)=>change(presentation.render(...args))}).api;assert.equal(bad.generate(type,1,l-1,55,v),null);report.rejections++;}
 report.cases++;
}
for(const bad of[-1,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,55,bad));report.rejections++;}
for(const bad of[-2,2,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,bad,55,0));report.rejections++;}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"other"},{sourceItemId:"other",generatorKey:key},{generatorKey:key}]){assert.equal(api.generatorKey(t),"");assert.equal(api.generate(t),null);report.rejections+=2;}
for(const t of[null,{}, {sourceItemId:"unrelated",generatorKey:"unrelated"}]){assert.equal(api.generatorKey(t),"old-key");assert.equal(api.generate(t,2,0,55,7),"old-question");report.legacyDelegations+=2;}
assert(calls.every(c=>c.receiver===api));assert.equal(api.names.filter(n=>n===key).length,1);
assert.equal(new Set(Array.from({length:120},(_,v)=>api.generate(type,1,0,1,v).verifiedVariantId)).size,3);
for(const record of assets.assets){const bytes=fs.readFileSync(path.join(__dirname,"assets/source-6-2-opposite-removal",record.file));assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),record.sha256);assert.equal(bytes.readUInt32BE(16),record.width);assert.equal(bytes.readUInt32BE(20),record.height);report.assets++;}
for(const patch of[{sha256:"wrong"},{kind:"after-three-directions"},{heightColumnCompressionUsed:true},{variant:8},{width:100}]){
 const bad=setup(presentation,{image:file=>({...assets.image(file),...patch})}).api;assert.equal(bad.generate(type,1,0,1,0),null);report.rejections++;
}
report.status="passed-candidate-wrapper";
const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"questions-audit.json"),JSON.stringify(report,null,2)+"\n");}
console.log(JSON.stringify(report));
