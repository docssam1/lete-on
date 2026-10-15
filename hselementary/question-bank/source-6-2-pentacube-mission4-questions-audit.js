"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto"),contracts=require("./source-6-2-pentacube-mission4-contracts.js"),presentation=require("./source-6-2-pentacube-mission4-presentation.js");
const code=fs.readFileSync(path.join(__dirname,"source-6-2-pentacube-mission4-questions.js"),"utf8"),id=contracts.sourceItemId,key="sourceGrade6SecondSpaceE4FourCubeAddition",type={sourceItemId:id,generatorKey:key,reviewLocked:false};
const copy=q=>JSON.parse(JSON.stringify(q));let accepted=0,rejected=0;
function runtime(p=presentation){const api={names:["legacy"],generatorKey:()=>"legacy",generate:()=>"legacy"};vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS:contracts,HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION:p}});return api;}
const api=runtime();
for(let offset=-1;offset<=1;offset++)for(const variant of[0,1,2,10,119]){
 const q=api.generate(type,1,offset,123,variant),expected=presentation.render(id,0,offset+1);assert(q);assert.equal(q.prompt,expected.prompt);assert.equal(q.answerVisual,expected.answerVisual);assert.equal(q.answer,expected.answer);assert.equal(q.solution,expected.solution);
 assert.equal(q.verifiedVariantCount,1);assert.equal(q.verifiedVariantTarget,1);assert.equal(q.verifiedPoolIndex,0);assert.equal(q.verifiedVariantId,`${id}:v0`);assert.equal(q.variantProvenance,"source-conditions-clarified");assert.equal(q.originalSourceReleaseStatus,"locked");assert.equal(q.learnerReleaseVerified,false);accepted++;
 const poisons=[
  q=>{q.prompt+='<table><tr><td>1층 4개</td></tr></table>';},q=>{q.prompt+='<svg data-layer="1"></svg>';},q=>{q.prompt+=q.answerVisual;},q=>{q.prompt+=q.solution;},
  q=>{q.prompt=q.prompt.replace("/given.png","/shape-1.png");},q=>{q.answer="0가지";},q=>{q.answerVisual=q.answerVisual.replace(/<figure[\s\S]*?<\/figure>/,"");},
  q=>{q.model.classes[0].positions[0]=[99,99,99];},q=>{q.studentGiven.layerCue={count:4};},q=>{q.sourceExact=true;},q=>{q.model.originalSourceReleaseStatus="verified";},
  q=>{q.difficultyDesign.empiricallyCalibrated=true;},q=>{q.gluedRigid=!q.gluedRigid;},q=>{q.shapeCount=99;},q=>{q.equivalenceMode="rotation-and-reflection";},q=>{q.solution="잘못된 풀이";}
 ];
 for(const poison of poisons){const poisoned={...presentation,render:(...args)=>{const q=copy(presentation.render(...args));poison(q);return q;}};assert.equal(runtime(poisoned).generate(type,1,offset,123,variant),null);rejected++;}
}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"another"},{...type,sourceItemId:"another"},Object.create(type)]){assert.equal(api.generate(t,1,0,123,0),null);rejected++;}
assert.equal(api.generate({sourceItemId:"unrelated",generatorKey:"legacy"},1,0,123,0),"legacy");accepted++;
for(const offset of[-2,2,1.5,null,"0",NaN]){assert.throws(()=>api.generate(type,1,offset,123,0));rejected++;}
for(const variant of[-1,1.5,null,"0",NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,123,variant));rejected++;}
for(const variant of[1,2,-1,NaN,"0",null]){assert.throws(()=>presentation.zoomFigure(variant,1,"given","problem"));rejected++;}
for(const level of[-1,3,NaN,null,"1"]){assert.throws(()=>presentation.zoomFigure(0,level,"given","problem"));rejected++;}
for(const[index,role]of[[0,"problem"],["given","teacher"],[-1,"teacher"],[99,"teacher"],[null,"teacher"],["given","unknown"]]){assert.throws(()=>presentation.zoomFigure(0,1,index,role));rejected++;}
for(let level=0;level<3;level++){const q=contracts.generate(id,0,level);assert(presentation.zoomFigure(0,level,"given","problem").source.endsWith("/given.png"));for(const g of q.model.classes)assert(presentation.zoomFigure(0,level,g.index,"teacher").source.endsWith(".png"));accepted++;}
const sha=file=>crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,file))).digest("hex"),report={status:"passed-finite-one-wrapper",accepted,rejected,sourceOriginalLocked:true,bankRegistered:false,runtimeHashes:Object.fromEntries(["models.js","contracts.js","assets.js","presentation.js","questions.js"].map(s=>{const f=`source-6-2-pentacube-mission4-${s}`;return[f,sha(f)];}))};
const root="E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",out=process.env.HSE_SCREENSHOT_DIR||path.join(root,"mission-4-4-supported-questions");assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"result.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,accepted,rejected}));
