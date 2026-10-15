"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-three-point-cut-mission2-models.js"),contracts=require("./source-6-2-three-point-cut-mission2-contracts.js"),presentation=require("./source-6-2-three-point-cut-mission2-bank-presentation.js"),assets=require("./source-6-2-three-point-cut-mission2-assets.js");
const root=process.env.HSE_THREE_POINT_EVIDENCE_DIR;assert(root&&/^E:[/\\]/i.test(root));
const id=models.sourceItemId,key="sourceGrade6SecondSpaceE4ThreePointPrismCut",checkpoint=path.join(root,"three-point-cut-catalog-checkpoint.json"),sha=b=>crypto.createHash("sha256").update(b).digest("hex");
if(process.argv.includes("--checkpoint")){
 assert(!fs.existsSync(checkpoint),"Preserve the existing checkpoint");const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8"),ctx);const catalog=JSON.parse(JSON.stringify(ctx.window.HSE_SOURCE_INVENTORY_GRADE6)),raw=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory/6-2-source-items.json"),"utf8"));
 assert.equal(catalog.items.find(i=>i.sourceItemId===id).reviewLocked,true);fs.writeFileSync(checkpoint,JSON.stringify({normalized:catalog.items,raw:raw.items,totals:catalog.totals},null,2)+"\n");console.log("Saved locked-state catalog checkpoint");process.exit(0);
}
const code=fs.readFileSync(path.join(__dirname,"source-6-2-three-point-cut-mission2-questions.js"),"utf8"),type={sourceItemId:id,generatorKey:key,reviewLocked:false};
function setup(renderer=presentation){const calls=[],api={names:["old"],generatorKey(){calls.push(this);return"old-key";},generate(){calls.push(this);return"old-question";}};vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_MODELS:models,HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_CONTRACTS:contracts,HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_BANK_PRESENTATION:renderer}});return{api,calls};}
const {api,calls}=setup(),report={status:"running",cases:0,rejections:0,assets:0,legacyDelegations:0,catalogUnlocked:false};
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
 const q=api.generate(type,1,level-1,9,variant),p=presentation.render(id,variant,level);assert(q);assert.equal(q.prompt,p.prompt);assert.equal(q.answerVisual,p.answerVisual);assert.equal(q.answer,p.answer);assert.equal(q.originalSourceReleaseStatus,"locked");
 const mutators=[
  q=>({...q,prompt:q.prompt+'<table><tr><td>1층 3개</td></tr></table>'}),q=>({...q,prompt:q.prompt+'<p>먼저 아래층을 세어 보세요.</p>'}),q=>({...q,prompt:q.prompt+q.answerVisual}),q=>({...q,prompt:q.prompt+'<svg data-layer="1"></svg>'}),
  q=>({...q,prompt:q.prompt.replace(`v${variant}-given.png`,`v${variant}-answer-all.png`)}),q=>({...q,prompt:q.prompt.replace('<img src=',`<img data-src="./assets/source-6-2-three-point-cut-mission2/v${variant}-given.png" src=`).replace(`src="./assets/source-6-2-three-point-cut-mission2/v${variant}-given.png" width=`,`src="./assets/source-6-2-three-point-cut-mission2/v${variant}-answer-all.png" width=`)}),
  q=>({...q,prompt:q.prompt.replace('<img src=',`<img src="./assets/source-6-2-three-point-cut-mission2/v${variant}-answer-all.png" src=`)}),q=>({...q,answer:"0개"}),q=>({...q,answerOrder:["uncut-cubes"]}),q=>({...q,solution:"기호만 바꾼 잘못된 풀이"}),q=>({...q,layerCue:{count:12}}),q=>({...q,model:{...q.model,dimensions:[3,3,3]}}),q=>({...q,studentGiven:{...q.studentGiven,solidFilled:false}}),
  q=>({...q,difficultyDesign:{...q.difficultyDesign,empiricallyCalibrated:true}}),q=>({...q,difficultyDesign:{}}),
  ...["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].map(name=>q=>({...q,[name]:true}))];
 for(const change of mutators){assert.equal(setup({...presentation,render:(...args)=>change(presentation.render(...args))}).api.generate(type,1,level-1,9,variant),null);report.rejections++;}
 for(const phase of["given","answer","section"]){const z=presentation.zoomFigure(variant,level,phase,phase==="given"?"problem":"teacher");assert(z.source);assert(z.width>0&&z.height>0);}
 for(const[phase,role]of[["answer","problem"],["section","problem"],["given","teacher"],["other","teacher"]]){assert.throws(()=>presentation.zoomFigure(variant,level,phase,role));report.rejections++;}
 report.cases++;
}
for(const bad of[-1,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,9,bad));report.rejections++;}
for(const bad of[-2,2,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.generate(type,1,bad,9,0));report.rejections++;}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"other"},{sourceItemId:"other",generatorKey:key},{generatorKey:key}]){assert.equal(api.generatorKey(t),"");assert.equal(api.generate(t),null);report.rejections+=2;}
for(const t of[null,{}, {sourceItemId:"unrelated",generatorKey:"unrelated"}]){assert.equal(api.generatorKey(t),"old-key");assert.equal(api.generate(t,2,0,9,7),"old-question");report.legacyDelegations+=2;}
assert(calls.every(receiver=>receiver===api));assert.equal(api.names.filter(n=>n===key).length,1);assert.equal(new Set(Array.from({length:120},(_,v)=>api.generate(type,1,0,9,v).verifiedVariantId)).size,3);
for(const a of assets.assets){const bytes=fs.readFileSync(path.join(__dirname,"assets/source-6-2-three-point-cut-mission2",a.file));assert.equal(sha(bytes),a.sha256);assert.equal(bytes.readUInt32BE(16),a.width);assert.equal(bytes.readUInt32BE(20),a.height);report.assets++;}
report.checkpointSha256=sha(fs.readFileSync(checkpoint));report.runtimeHashes=Object.fromEntries(["source-6-2-painted-mission3-presentation.js",...["models.js","contracts.js","presentation.js","bank-presentation.js","assets.js","questions.js","questions.css"].map(s=>`source-6-2-three-point-cut-mission2-${s}`)].map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));report.status="passed-candidate-wrapper";
const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"questions-audit.json"),JSON.stringify(report,null,2)+"\n");}console.log(JSON.stringify({status:report.status,cases:report.cases,rejections:report.rejections,assets:report.assets,catalogUnlocked:false}));
