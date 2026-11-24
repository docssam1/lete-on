"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto"),contracts=require("./source-6-2-pentacube-mission4-contracts.js"),presentation=require("./source-6-2-pentacube-mission4-presentation.js"),models=require("./source-6-2-pentacube-mission4-models.js");
const code=fs.readFileSync(path.join(__dirname,"source-6-2-pentacube-mission4-questions.js"),"utf8"),id=contracts.sourceItemId,key="sourceGrade6SecondSpaceE4FourCubeAddition",type={sourceItemId:id,generatorKey:key,reviewLocked:false};
const copy=q=>JSON.parse(JSON.stringify(q));let accepted=0,rejected=0;
function runtime(p=presentation){const api={names:["legacy"],generatorKey:()=>"legacy",generate:()=>"legacy"};vm.runInNewContext(code,{window:{HSE_GENERATORS:api,HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS:contracts,HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION:p}});return api;}
const api=runtime();
for(let offset=-1;offset<=1;offset++)for(const variant of[0,1,2,10,119]){
 const pool=variant%3,q=api.generate(type,1,offset,123,variant),expected=presentation.render(id,pool,offset+1);assert(q);assert.equal(q.prompt,expected.prompt);assert.equal(q.answerVisual,expected.answerVisual);assert.equal(q.answer,expected.answer);assert.equal(q.solution,expected.solution);
 assert.equal(q.variant,pool);assert.equal(q.verifiedVariantCount,3);assert.equal(q.verifiedVariantTarget,3);assert.equal(q.verifiedPoolIndex,pool);assert.equal(q.verifiedVariantId,`${id}:v${pool}`);assert.equal(q.variantProvenance,pool!==0?"source-structure-variant":offset===0?"source-original-wording":"source-conditions-clarified");assert.equal(/<img\b/.test(q.prompt),pool===0);assert.equal(/<svg\b[^>]*source62-iso-cubes/.test(q.prompt),pool!==0);assert.equal(q.originalSourceReleaseStatus,"locked");assert.equal(q.learnerReleaseVerified,false);accepted++;
 const poisons=[
  q=>{q.prompt+='<table><tr><td>1층 4개</td></tr></table>';},q=>{q.prompt+='<svg data-layer="1"></svg>';},q=>{q.prompt+=q.answerVisual;},q=>{q.prompt+=q.solution;},
  q=>{q.prompt=q.prompt.includes("/given.png")?q.prompt.replace("/given.png","/shape-1.png"):q.prompt.replace(/data-cell="[^"]+"/,'data-cell="9,9,9"');},q=>{q.answerVisual=q.answerVisual.includes(' data-marked="true"')?q.answerVisual.replace(' data-marked="true"',""):q.answerVisual.replace(/shape-(\d+)\.png/,"given.png");},q=>{q.answer="0가지";},q=>{q.answerVisual=q.answerVisual.replace(/<figure[\s\S]*?<\/figure>/,"");},
  q=>{q.model.classes[0].positions[0]=[99,99,99];},q=>{q.studentGiven.layerCue={count:4};},q=>{q.sourceExact=true;},q=>{q.model.originalSourceReleaseStatus="verified";},
  q=>{q.difficultyDesign.empiricallyCalibrated=true;},q=>{q.gluedRigid=!q.gluedRigid;},q=>{q.shapeCount=99;},q=>{q.equivalenceMode="rotation-and-reflection";},q=>{q.solution="잘못된 풀이";}
 ];
 for(const poison of poisons){const poisoned={...presentation,render:(...args)=>{const q=copy(presentation.render(...args));poison(q);return q;}};assert.equal(runtime(poisoned).generate(type,1,offset,123,variant),null);rejected++;}
}
for(const t of[{...type,reviewLocked:true},{...type,generatorKey:"another"},{...type,sourceItemId:"another"},Object.create(type)]){assert.equal(api.generate(t,1,0,123,0),null);rejected++;}
assert.equal(api.generate({sourceItemId:"unrelated",generatorKey:"legacy"},1,0,123,0),"legacy");accepted++;
for(const offset of[-2,2,1.5,null,"0",NaN]){assert.throws(()=>api.generate(type,1,offset,123,0));rejected++;}
for(const variant of[-1,1.5,null,"0",NaN,Infinity]){assert.throws(()=>api.generate(type,1,0,123,variant));rejected++;}
for(const variant of[3,-1,NaN,"0",null,1.5]){assert.throws(()=>presentation.zoomFigure(variant,1,"given","problem"));rejected++;}
for(const level of[-1,3,NaN,null,"1"]){assert.throws(()=>presentation.zoomFigure(0,level,"given","problem"));rejected++;}
for(const variant of[0,1,2])for(const[index,role]of[[0,"problem"],["given","teacher"],[-1,"teacher"],[99,"teacher"],[null,"teacher"],["given","unknown"]]){assert.throws(()=>presentation.zoomFigure(variant,1,index,role));rejected++;}
for(let level=0;level<3;level++){const q=contracts.generate(id,0,level);assert(presentation.zoomFigure(0,level,"given","problem").source.endsWith("/given.png"));for(const g of q.model.classes)assert(presentation.zoomFigure(0,level,g.index,"teacher").source.endsWith(".png"));accepted++;}
// pool 1·2: SVG 그림. 확대 그림은 화면의 SVG와 같은 그림 열쇠를 갖고, 정답 그림은 쌓기나무 다섯 개가 모두 읽히며(보통 난이도는 받침 쌓기나무만 가려질 수 있음) 검은 쌓기나무가 두 면 이상 보인다.
const iso=require("./source-6-2-iso-cube-svg.js");
for(const variant of[1,2])for(let level=0;level<3;level++){
 const q=contracts.generate(id,variant,level),r=presentation.render(id,variant,level),given=presentation.zoomFigure(variant,level,"given","problem");
 assert(given.inlineSvg&&given.source.startsWith("data:image/svg+xml")&&r.prompt.includes(`data-figure-key="${given.figureKey}"`));assert.equal(iso.visibility(q.model.cells).readableCubeCount,4);
 for(const g of q.model.classes){const z=presentation.zoomFigure(variant,level,g.index,"teacher"),pose=presentation.svgPose(q,g.index),vis=iso.visibility(pose.cells),keys=new Set(pose.cells.map(c=>c.join(",")));
  assert(z.inlineSvg&&r.answerVisual.includes(`data-figure-key="${z.figureKey}"`));assert(vis.counts[pose.addedIndex]>=18);assert.equal(pose.cells.length,5);
  vis.readable.forEach((ok,i)=>{if(!ok)assert(level===1&&i!==pose.addedIndex&&keys.has([pose.cells[i][0],pose.cells[i][1]+1,pose.cells[i][2]].join(",")));});
  assert.equal(models.canonical(pose.cells),models.canonical([...q.model.cells,pose.addedPosition]));accepted++;}
}
const sha=file=>crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,file))).digest("hex"),report={status:"passed-finite-three-pool-wrapper",accepted,rejected,sourceOriginalLocked:true,bankRegistered:false,runtimeHashes:Object.fromEntries(["models.js","contracts.js","assets.js","presentation.js","questions.js"].map(s=>{const f=`source-6-2-pentacube-mission4-${s}`;return[f,sha(f)];}))};
const root="E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",out=process.env.HSE_SCREENSHOT_DIR||path.join(root,"mission-4-4-supported-questions");assert(path.isAbsolute(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"result.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,accepted,rejected}));
