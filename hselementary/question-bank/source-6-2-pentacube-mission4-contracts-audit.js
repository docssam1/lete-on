"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const contracts=require("./source-6-2-pentacube-mission4-contracts.js"),models=require("./source-6-2-pentacube-mission4-models.js");
const root="E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014",oracleFile=path.join(root,"mission-4-4-independent/result.json"),sha=bytes=>crypto.createHash("sha256").update(bytes).digest("hex");
assert.equal(sha(fs.readFileSync(oracleFile)),"90b3fbbdba899ac82154d51c3f99a15b0526700200abb15fd81eb3fa2f39fc62");
const oracle=JSON.parse(fs.readFileSync(oracleFile)),point=p=>p.join(","),points=ps=>ps.map(point).sort(),copy=q=>JSON.parse(JSON.stringify(q));
// 기준 난이도는 원문 문장·바닥 위 회전 기준(10가지).
const floorRots=[[[1,0,0],[0,1,0],[0,0,1]],[[0,0,1],[0,1,0],[-1,0,0]],[[-1,0,0],[0,1,0],[0,0,-1]],[[0,0,-1],[0,1,0],[1,0,0]]],floorCanon=cells=>floorRots.map(m=>{const r=cells.map(c=>m.map(row=>row.reduce((s,n,i)=>s+n*c[i],0))),mn=[0,1,2].map(i=>Math.min(...r.map(c=>c[i])));return r.map(c=>c.map((n,i)=>n-mn[i]).join(",")).sort().join(";");}).sort()[0];
let checks=0,negative=0;const eq=(a,b)=>{assert.deepEqual(a,b);checks++;};
const rigid=oracle.scenarios.find(s=>s.name==="rigid-whole-face-attachment"),natural=oracle.scenarios.find(s=>s.name==="natural-fixed-floor-stacking");
function check(q,level){
 const m=q.model,legal=level===0?rigid.addedPositions.filter(p=>p[1]===0):level===1?natural.addedPositions:rigid.addedPositions,legalSet=new Set(points(legal));
 eq(q.sourceItemId,contracts.sourceItemId);eq(q.variant,0);eq(q.level,level);eq(points(m.cells),points(oracle.sourceCellsXYZ));eq(points(m.positions),points(legal));
 const expected=level===1?(()=>{const g=new Map();for(const p of legal){const c=floorCanon([...m.cells,p]);if(!g.has(c))g.set(c,[]);g.get(c).push(p);}return[...g].map(([canonical,members])=>({canonical,members}));})():oracle.classes24.map(g=>({canonical:g.canonicalNormalizedFiveCells.map(point).sort().join(";"),members:g.memberCandidates.map(c=>c.addedPositionXYZ).filter(p=>legalSet.has(point(p)))})).filter(g=>g.members.length);
 eq(m.classes.map(g=>g.canonical).sort(),expected.map(g=>g.canonical).sort());eq(m.classes.length,[6,10,8][level]);eq(m.placementCount,[7,10,16][level]);eq(q.answer,level===2?[8,16]:[6,10][level]);
 eq(m.classes.reduce((n,g)=>n+g.placementCount,0),legal.length);eq(m.finiteVariantCount,3);eq(m.baseRigid,true);eq(m.gluedRigid,level===2);
 eq(m.scope,["ground-addition-only","natural-fixed-floor-stacking","rigid-whole-face-attachment"][level]);eq(m.groundRestriction,["added-cube-on-fixed-ground","supported-on-fixed-ground-or-original-cube","none"][level]);
 eq(m.equivalenceMode,level===1?"translation-and-4-floor-rotations":"translation-and-24-proper-rotations");eq(m.addedCubeDistinguishedInComparison,false);
 for(const g of m.classes){const e=expected.find(c=>c.canonical===g.canonical);eq(points(g.positions),points(e.members));eq(g.placementCount,e.members.length);eq(points(g.witnesses.map(w=>w.added)),points(e.members));
  for(const w of g.witnesses){eq(points(w.cells),points([...m.cells,w.added]));eq((level===1?floorCanon:models.canonical)(w.cells),g.canonical);eq(w.faceContacts,m.cells.filter(c=>c.reduce((sum,n,i)=>sum+Math.abs(n-w.added[i]),0)===1).length);}
 }
 eq(q.studentGiven,{promptText:q.promptText,cells:m.cells,scope:m.scope,baseRigid:true,allowedAttachment:"aligned-whole-square-face",groundRestriction:m.groundRestriction,layerCue:null,responseLayers:[]});
 eq(q.answerDrawing,m.classes.map(g=>({canonical:g.canonical,placements:g.positions,placementCount:g.placementCount})));eq(q.answerVisualRequired,true);eq(q.requiresLayerDrawing,false);eq(q.requestedAnswerUnique,true);eq(q.sourceConditionsClarified,level!==1);eq(q.sourceWordingExact,level===1);
 for(const flag of["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"])eq(q[flag],false);
 eq(q.originalSourceReleaseStatus,"locked");eq(q.difficultyDesign.sourceConditionsExact,level===1);eq(q.difficultyDesign.empiricallyCalibrated,false);eq(q.difficultyDesign.adoptionStatus,"pending");
 assert(!/<table|<svg|회전행렬|동형|순열|조합|정규화|거울상|제곱|[=×]/.test(q.promptText));checks++;
 eq(q.promptText.includes("밑면 전체"),false);eq(q.promptText.includes("돌렸을 때 같은 모양은 한 가지"),level===1);eq(q.promptText.includes("움직이지 않을 때"),level===2);eq(q.promptText.includes("손에 들고"),level===2);
 eq(q.promptText.includes("더 붙이는 쌓기나무도 바닥에 닿게"),level===0);assert(level===1?q.promptText.startsWith("다음 그림과 같이 쌓기나무 4개로 만든 모양에 쌓기나무 1개를 더 쌓아서"):q.promptText.includes("정사각형 면끼리 꼭 맞게")&&q.promptText.includes("통째로 돌려서"));checks++;
}
for(let level=0;level<3;level++){
 const q=contracts.generate(contracts.sourceItemId,0,level);check(q,level);assert(Object.isFrozen(q)&&Object.isFrozen(q.model.classes));checks++;
 for(const mutate of[
  q=>q.model.positions.splice(0,1),q=>{q.model.classes[0].positions[0]=q.model.classes[1].positions[0];},
  q=>{q.model.classes[0].witnesses[0].cells[0]=[50,50,50];},q=>{q.model.equivalenceMode="rotations-and-reflections";},
  q=>{q.model.groundRestriction="unrestricted";},q=>{q.answer=0;},q=>{q.sourceExact=true;},q=>{q.difficultyDesign.empiricallyCalibrated=true;},
  q=>{q.answerDrawing[0].canonical="another-five-cube-shape";},q=>{q.studentGiven.layerCue={layer:1,count:4};}
 ]){const bad=copy(q);mutate(bad);assert.throws(()=>check(bad,level));negative++;}
}
for(const level of[-1,3,1.5,null,"1",NaN,Infinity]){assert.throws(()=>contracts.generate(contracts.sourceItemId,0,level));negative++;}
for(const variant of[-1,3,null,"0",NaN,Infinity]){assert.throws(()=>contracts.generate(contracts.sourceItemId,variant,1));negative++;}
// pool 1·2(2026-11-24, SVG 변형): 같은 문장·조건에 다른 처음 모양.
for(const[variant,answers]of[[1,[4,6,[8,16]]],[2,[3,7,[3,18]]]])for(let level=0;level<3;level++){const q=contracts.generate(contracts.sourceItemId,variant,level),v0=contracts.generate(contracts.sourceItemId,0,level);eq(q.answer,answers[level]);eq(q.promptText,v0.promptText);eq(q.variant,variant);eq(q.difficultyDesign.sourceGeometryMatches,false);eq(q.sourceWordingExact,level===1);eq(q.originalSourceReleaseStatus,"locked");assert(Object.isFrozen(q));checks++;}
assert.throws(()=>contracts.generate("6-2-u3-e4-example-4",0,1));negative++;
const report={status:"passed-supported-conditions-contract",checks,negative,variantCapacity:3,answers:[6,10,[8,16]],oracleSha256:sha(fs.readFileSync(oracleFile)),runtimeHashes:Object.fromEntries(["source-6-2-pentacube-mission4-models.js","source-6-2-pentacube-mission4-contracts.js"].map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))])),sourceOriginalLocked:true,bankRegistered:false};
const out=process.env.HSE_SCREENSHOT_DIR||path.join(root,"mission-4-4-supported-contracts");assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"result.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
