"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-cube-addition-models.js"),presentation=require("./source-6-2-cube-addition-presentation.js"),assets=require("./source-6-2-cube-addition-assets.js");
const id=models.sourceItemId,key="sourceGrade6SecondSpaceE4SingleCubeAddition",code=fs.readFileSync(path.join(__dirname,"source-6-2-cube-addition-questions.js"),"utf8"),type={sourceItemId:id,generatorKey:key,reviewLocked:false};
function setup(renderer=presentation,assetApi=assets){
 const calls=[],api={names:["old"],generatorKey(){calls.push(this);return"old-key";},generate(){calls.push(this);return"old-question";}};
 vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_CUBE_ADDITION_MODELS:models,HSE_SOURCE_GRADE6_CUBE_ADDITION_PRESENTATION:renderer,HSE_SOURCE_GRADE6_CUBE_ADDITION_ASSETS:assetApi}});return{api,calls};
}
const report={status:"running",cases:0,rejections:0,assets:0,legacyDelegations:0,catalogUnlocked:false},{api,calls}=setup();
for(let v=0;v<3;v++)for(let l=0;l<3;l++){
 const q=api.generate(type,1,l-1,9,v),p=presentation.render(id,v,l);assert(q);assert(q.prompt.includes(p.prompt));assert(q.answerVisual.includes(p.answerVisual));assert.equal(q.answer,p.answer);assert.equal(q.originalSourceReleaseStatus,"locked");
 const mutators=[q=>({...q,prompt:q.prompt+'<table><tr><td>1층 21개</td></tr></table>'}),q=>({...q,prompt:q.prompt+q.answerVisual}),q=>({...q,prompt:q.prompt+'<svg data-layer="1"></svg>'}),
  q=>({...q,prompt:q.prompt.replace(`v${v}-given.png`,`v${v}-shape-1.png`)}),q=>({...q,answer:"0가지"}),q=>({...q,layerCue:{rows:[6]}}),q=>({...q,studentGiven:{...q.studentGiven,cells:[]}}),
  q=>({...q,model:{...q.model,shapeCount:0}}),...["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].map(name=>q=>({...q,[name]:true}))];
 for(const change of mutators){assert.equal(setup({render:(...a)=>change(presentation.render(...a))}).api.generate(type,1,l-1,9,v),null);report.rejections++;}
 for(const g of q.model.classes){const asset=assets.image(v,g.canonical);assert(asset);assert(p.answerVisual.includes(asset.file));const z=presentation.zoomFigure(v,l,g.index,"teacher");assert(z.source.endsWith(asset.file));}
 assert(presentation.zoomFigure(v,l,"given","problem").source.endsWith(`v${v}-given.png`));
 for(const [index,role]of[[0,"problem"],["given","teacher"],[-1,"teacher"],[q.model.classes.length,"teacher"]]){assert.throws(()=>presentation.zoomFigure(v,l,index,role));report.rejections++;}
 report.cases++;
}
for(const bad of[-1,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,9,bad));report.rejections++;}
for(const bad of[-2,2,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,bad,9,0));report.rejections++;}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"other"},{sourceItemId:"other",generatorKey:key},{generatorKey:key}]){assert.equal(api.generatorKey(t),"");assert.equal(api.generate(t),null);report.rejections+=2;}
for(const t of[null,{}, {sourceItemId:"unrelated",generatorKey:"unrelated"}]){assert.equal(api.generatorKey(t),"old-key");assert.equal(api.generate(t,2,0,9,7),"old-question");report.legacyDelegations+=2;}
assert(calls.every(receiver=>receiver===api));assert.equal(api.names.filter(n=>n===key).length,1);assert.equal(new Set(Array.from({length:120},(_,v)=>api.generate(type,1,0,9,v).verifiedVariantId)).size,3);
for(const a of assets.assets){const bytes=fs.readFileSync(path.join(__dirname,"assets/source-6-2-cube-addition",a.file));assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"),a.sha256);assert.equal(bytes.readUInt32BE(16),a.width);assert.equal(bytes.readUInt32BE(20),a.height);report.assets++;}
for(const patch of[{sha256:"wrong"},{kind:"class"},{heightColumnCompressionUsed:true},{variant:8},{width:100},{readableCubeCount:5}]){assert.equal(setup(presentation,{image:v=>({...assets.image(v),...patch})}).api.generate(type,1,0,9,0),null);report.rejections++;}
report.status="passed-candidate-wrapper";const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"questions-audit.json"),JSON.stringify(report,null,2)+"\n");}console.log(JSON.stringify(report));
