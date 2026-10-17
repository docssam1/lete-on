"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-colored-cut-mission1-models.js"),presentation=require("./source-6-2-colored-cut-mission1-presentation.js"),assets=require("./source-6-2-colored-cut-mission1-assets.js");
const root=process.env.HSE_COLORED_CUT_EVIDENCE_DIR;assert(root&&/^E:[/\\]/i.test(root));
const id=models.sourceItemId,key="sourceGrade6SecondSpaceE4ColoredPlaneCut",baseline=path.join(root,"mission-4-1-prototype-presentation-before-bank.json"),sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const prototypeHashes=()=>Array.from({length:9},(_,i)=>{const variant=Math.floor(i/3),level=i%3;return{variant,level,sha256:sha(JSON.stringify(presentation.render(id,variant,level)))};});
if(process.argv.includes("--checkpoint")){
 assert(!fs.existsSync(baseline),"Preserve the existing prototype checkpoint");
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8"),ctx);const catalog=JSON.parse(JSON.stringify(ctx.window.HSE_SOURCE_INVENTORY_GRADE6)),raw=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory/6-2-source-items.json"),"utf8"));
 assert.equal(catalog.items.find(t=>t.sourceItemId===id).reviewLocked,true);fs.writeFileSync(baseline,JSON.stringify({prototypeHashes:prototypeHashes(),normalized:catalog.items,raw:raw.items,totals:catalog.totals},null,2)+"\n");console.log("Saved locked catalog and prototype-output checkpoint");process.exit(0);
}
assert.deepEqual(prototypeHashes(),JSON.parse(fs.readFileSync(baseline,"utf8")).prototypeHashes,"Bank extension must preserve the tested prototype outputs");
const code=fs.readFileSync(path.join(__dirname,"source-6-2-colored-cut-mission1-questions.js"),"utf8"),type={sourceItemId:id,generatorKey:key,reviewLocked:false};
function setup(renderer=presentation,assetApi=assets){const calls=[],api={names:["old"],generatorKey(){calls.push(this);return"old-key";},generate(){calls.push(this);return"old-question";}};vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_MODELS:models,HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_PRESENTATION:renderer,HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_ASSETS:assetApi}});return{api,calls};}
const report={status:"running",cases:0,rejections:0,assets:0,legacyDelegations:0,prototypeOutputsPreserved:true,catalogUnlocked:false},{api,calls}=setup();
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
 const p=presentation.renderBank(id,variant,level),q=api.generate(type,1,level-1,9,variant);assert(q);assert(q.prompt.includes(p.prompt));assert(q.answerVisual.includes(p.answerVisual));assert.equal(q.answer,p.answer);assert.equal(q.originalSourceReleaseStatus,"locked");assert.equal(q.verifiedPoolIndex,variant);
 const mutators=[q=>({...q,prompt:q.prompt+'<table><tr><td>1층 15개</td></tr></table>'}),q=>({...q,prompt:q.prompt+q.answerVisual}),q=>({...q,prompt:q.prompt+'<svg data-layer="1"></svg>'}),q=>({...q,prompt:q.prompt.replace(`v${variant}-given.png`,`v${variant}-answer.png`)}),q=>({...q,answer:"0개"}),q=>({...q,layerCue:{count:15}}),q=>({...q,studentGiven:{...q.studentGiven,frontRows:[]}}),q=>({...q,model:{...q.model,dimensions:[5,5,5]}}),
  q=>({...q,prompt:q.prompt.replace(`src="./assets/source-6-2-colored-cut-mission1/v${variant}-given.png"`,`src="./assets/source-6-2-colored-cut-mission1/v${variant}-answer.png" data-src="./assets/source-6-2-colored-cut-mission1/v${variant}-given.png"`)}),
  q=>({...q,prompt:q.prompt.replace('<img src=',`<img src="./assets/source-6-2-colored-cut-mission1/v${variant}-answer.png" src=`)}),
  q=>({...q,difficultyDesign:{...q.difficultyDesign,empiricallyCalibrated:true}}),q=>({...q,difficultyDesign:{}}),
  ...["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].map(name=>q=>({...q,[name]:true}))];
 for(const change of mutators){assert.equal(setup({...presentation,renderBank:(...a)=>change(presentation.renderBank(...a))}).api.generate(type,1,level-1,9,variant),null);report.rejections++;}
 for(const phase of["given","answer","front"]){const role=phase==="given"?"problem":"teacher",z=presentation.zoomFigure(variant,level,phase,role);assert(z.source);assert(z.width>0&&z.height>0);}
 for(const[phase,role]of[["answer","problem"],["front","problem"],["given","teacher"],["other","teacher"]]){assert.throws(()=>presentation.zoomFigure(variant,level,phase,role));report.rejections++;}
 report.cases++;
}
for(const bad of[-1,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,9,bad));report.rejections++;}
for(const bad of[-2,2,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,bad,9,0));report.rejections++;}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"other"},{sourceItemId:"other",generatorKey:key},{generatorKey:key}]){assert.equal(api.generatorKey(t),"");assert.equal(api.generate(t),null);report.rejections+=2;}
for(const t of[null,{}, {sourceItemId:"unrelated",generatorKey:"unrelated"}]){assert.equal(api.generatorKey(t),"old-key");assert.equal(api.generate(t,2,0,9,7),"old-question");report.legacyDelegations+=2;}
assert(calls.every(receiver=>receiver===api));assert.equal(api.names.filter(n=>n===key).length,1);assert.equal(new Set(Array.from({length:120},(_,v)=>api.generate(type,1,0,9,v).verifiedVariantId)).size,3);
for(const a of assets.assets){const bytes=fs.readFileSync(path.join(__dirname,"assets/source-6-2-colored-cut-mission1",a.file));assert.equal(sha(bytes),a.sha256);assert.equal(bytes.readUInt32BE(16),a.width);assert.equal(bytes.readUInt32BE(20),a.height);report.assets++;}
for(const patch of[{sha256:"bad"},{kind:"answer"},{sourceDarkPatternPreserved:false},{variant:8},{width:100},{dimensions:[5,5,5]}]){assert.equal(setup(presentation,{image:v=>({...assets.image(v,"given"),...patch})}).api.generate(type,1,0,9,0),null);report.rejections++;}
report.prototypeCheckpointSha256=sha(fs.readFileSync(baseline));report.runtimeHashes=Object.fromEntries(["source-6-2-painted-mission3-presentation.js",...["models.js","contracts.js","presentation.js","assets.js","questions.js","questions.css"].map(s=>`source-6-2-colored-cut-mission1-${s}`)].map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
report.status="passed-candidate-wrapper";const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"questions-audit.json"),JSON.stringify(report,null,2)+"\n");}console.log(JSON.stringify({status:report.status,cases:report.cases,rejections:report.rejections,assets:report.assets,prototypeOutputsPreserved:true,catalogUnlocked:false}));
