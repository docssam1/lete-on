"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const contracts=require("./source-6-2-opposite-removal-contracts.js"),presentation=require("./source-6-2-opposite-removal-presentation.js");
const sort=cells=>cells.map(c=>c.join(",")).sort(),id=contracts.sourceItemId;
const source={top:[[1,2],[2,2],[3,2],[2,1]],front:[[1,3],[2,2],[3,1]],right:[[2,3],[2,2],[1,1],[3,1]]};
function independent(v,l){
 const faces=JSON.parse(JSON.stringify(source));if(v===1)faces.top=faces.top.map(([x,z])=>[4-z,x]);
 if(v===2){faces.front[2]=[3,2];faces.right[1]=[3,2];}
 const remaining=[],overlap=[];
 for(let x=0;x<5;x++)for(let y=0;y<5;y++)for(let z=0;z<5;z++){
  const hits=+faces.top.some(c=>c[0]===x&&c[1]===z)+ +faces.right.some(c=>c[0]===z&&c[1]===y)+ +(l!==0&&faces.front.some(c=>c[0]===x&&c[1]===y));
  if(!hits)remaining.push([x,y,z]);if(hits>=2)overlap.push([x,y,z]);
 }
 return{faces,remaining,overlap};
}
const report={status:"running",cases:[],cellsCompared:0,answerGridCells:0,negativeCases:0,catalogUnlocked:false,officialApproval:false};
for(let v=0;v<3;v++)for(let l=0;l<3;l++){
 const q=contracts.generate(id,v,l),p=presentation.render(id,v,l),expected=independent(v,l);
 assert.deepEqual(q.model.faces,expected.faces);assert.deepEqual(sort(q.model.remaining),sort(expected.remaining));assert.deepEqual(sort(q.model.overlapping),sort(expected.overlap));
 assert.deepEqual(q.answer,l===2?[expected.remaining.length,expected.overlap.length]:expected.remaining.length);report.cellsCompared+=125;
 assert(q.promptText.includes("各面")===false);assert(q.promptText.includes("빈틈없이"));assert(q.promptText.includes("각 면에 수직"));assert(q.promptText.includes("반대쪽 끝까지"));assert(q.promptText.includes("옮기지 않습니다"));
 assert.equal(q.promptText.includes("윗면과 오른쪽 면"),l===0);assert.equal(q.promptText.includes("두 방향 이상"),l===2);
 assert.equal(q.studentGiven.solidFilled,true);assert.equal(q.studentGiven.layerCue,null);assert.deepEqual(q.studentGiven.responseLayers,[]);assert.equal(q.requiresLayerDrawing,false);
 assert(!/<table|<svg|data-layer=|math-inline-expression|after-two-directions|after-three-directions/.test(p.prompt));assert.equal((p.prompt.match(/<img\b/g)||[]).length,1);assert(p.prompt.includes(`v${v}-given.png`));
 assert(p.answerVisual.includes(`v${v}-after-${l===0?"two":"three"}-directions.png`));
 const svgs=[...p.answerVisual.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(m=>m[0]);assert.equal(svgs.length,l===2?10:5);
 for(const svg of svgs){
  const layer=Number(/data-layer="(\d+)"/.exec(svg)[1]),kind=/data-kind="([^"]+)"/.exec(svg)[1];
  const rects=[...svg.matchAll(/<rect\b[^>]*>/g)].map(m=>Object.fromEntries([...m[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]])));
  const cells=(kind==="remaining"?expected.remaining:expected.overlap).filter(c=>c[1]===layer-1).map(([x,,z])=>[x,z]);
  assert.equal(rects.length,25);assert.deepEqual(sort(rects.filter(r=>r["data-selected"]==="true").map(r=>[Number(r["data-x"]),Number(r["data-z"])])),sort(cells));
  for(const r of rects){assert.equal(Number(r.x),8+24*Number(r["data-x"]));assert.equal(Number(r.y),8+24*(4-Number(r["data-z"])));assert.equal(r.fill,r["data-selected"]==="true"?"#cedfcf":"#fff");}
  report.answerGridCells+=25;
 }
 for(const html of q.solutionEquations){
  const expression=html.replace(/<[^>]+>/g,""),[left,right]=expression.split("=");assert(/^\d+(?:[+-]\d+)*$/.test(left));
  const sum=left.match(/[+-]?\d+/g).reduce((a,b)=>a+Number(b),0);assert.equal(sum,Number(right));assert(p.solution.includes(html));
 }
 for(const name of["sourceExact","publisherAnswerVerified","officialAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"])assert.equal(q[name],false);
 assert.equal(q.originalSourceReleaseStatus,"locked");assert.equal(q.difficultyDesign.adoptionStatus,"pending");assert.equal(q.difficultyDesign.sourceGeometryMatches,v===0);
 for(const bad of[0,6,-1,1.5,"1",null]){assert.throws(()=>presentation.layerSvg(q,{layer:bad},"remaining"));report.negativeCases++;}
 if(l!==2){assert.throws(()=>presentation.layerSvg(q,q.model.layers[0],"overlapping"));report.negativeCases++;}
 report.cases.push({variant:v,level:l,answer:q.answer,modelRemaining:expected.remaining.length,modelOverlap:expected.overlap.length,studentOnlyGiven:true});
}
for(const bad of[-1,3,1.5,"1",null,NaN,Infinity]){assert.throws(()=>contracts.generate(id,bad,1));assert.throws(()=>contracts.generate(id,0,bad));report.negativeCases+=2;}
assert.throws(()=>contracts.generate("unknown",0,1));report.negativeCases++;
for(let level=0;level<3;level++)assert.equal(new Set([0,1,2].map(v=>contracts.generate(id,v,level).structuralFingerprint)).size,3);
report.status="passed-contract-and-presentation-candidate";
report.hashes=Object.fromEntries(["models","contracts","presentation"].map(s=>{const file=`source-6-2-opposite-removal-${s}.js`;return[file,crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,file))).digest("hex")];}));
const out=process.env.HSE_SCREENSHOT_DIR;if(out){assert(/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"contracts-audit.json"),JSON.stringify(report,null,2)+"\n");}
console.log(JSON.stringify({status:report.status,cases:report.cases.length,cells:report.cellsCompared,answerGridCells:report.answerGridCells,negativeCases:report.negativeCases,catalogUnlocked:false}));
