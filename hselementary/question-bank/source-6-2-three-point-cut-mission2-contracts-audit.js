"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-three-point-cut-mission2-models.js"),contracts=require("./source-6-2-three-point-cut-mission2-contracts.js"),presentation=require("./source-6-2-three-point-cut-mission2-presentation.js");
const root=process.env.HSE_THREE_POINT_EVIDENCE_DIR,out=process.env.HSE_SCREENSHOT_DIR;assert([root,out].every(p=>p&&/^E:[/\\]/i.test(p)));
const file=path.join(root,"mission-4-2-independent/variant-result.json"),oracle=JSON.parse(fs.readFileSync(file,"utf8")),source=JSON.parse(fs.readFileSync(path.join(root,"mission-4-2-independent/result.json"),"utf8"));
assert.equal(oracle.decision,"pass-independent-authored-variant-oracle");assert.equal(source.decision,"pass-independent-original-cut-count");assert.equal(source.occupancyAudit.everyCutCellForcedByVisibleFaces,true);assert.deepEqual(source.occupancyAudit.distinctCutAnswers,[12]);
const sha=b=>crypto.createHash("sha256").update(b).digest("hex"),copy=x=>JSON.parse(JSON.stringify(x)),order=cs=>cs.map(c=>c.join(",")).sort(),fraction=s=>String(s).split("/").map(Number).reduce((a,b)=>a/b),near=(a,b)=>assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const points=ps=>ps.map(p=>p.map(n=>Math.round(n*1e8)/1e8).join(",")).sort(),area=ps=>Math.abs(ps.reduce((s,p,i)=>s+p[0]*ps[(i+1)%ps.length][1]-p[1]*ps[(i+1)%ps.length][0],0))/2;
const answerNames={"top-layer-cut-cubes":"highest-layer-interior-cut","cut-cubes":"all-interior-cut","all-resulting-pieces":"all-retained-resulting-pieces"};
const report={status:"running",cases:[],cellChecks:0,polygonChecks:0,negativeCases:0,originalCutAnswerUniquenessVisibleBoxSubsets:64,catalogUnlocked:false};
function verify(q,c){
 const m=q.model,v=oracle.variants.find(v=>v.variant===q.variant);assert.deepEqual(m.dimensions,v.dimensionsXYZ);assert.deepEqual(Object.keys(m.points),["ㄱ","ㄴ","ㄷ"]);assert.deepEqual(Object.values(m.points),v.points);assert.deepEqual(order(m.cutCells),order(c.allCutCells));assert.deepEqual(order(m.touchCells),order(c.allTouchCells));assert.deepEqual(q.answer,c.expectedAnswer);assert.deepEqual(q.answerOrder.map(n=>answerNames[n]),c.answerOrder);
 assert.equal(m.cubes.length,v.totalFilledCells);assert.equal(m.cutCount,v.cutCount);assert.equal(m.touchCount,v.touchCount);assert.equal(m.splitPieceCount,v.totalFilledCells+v.cutCount);
 assert.deepEqual(m.sectionEdges.map(e=>[e.from,e.to,e.style]),[["ㄱ","ㄴ","dashed"],["ㄴ","ㄷ","dashed"],["ㄷ","ㄱ","dashed"]]);
 for(const cell of v.allCellRecords){const has=cs=>cs.some(p=>p.every((n,i)=>n===cell.cell[i]));assert.equal(has(m.cutCells),cell.cut);assert.equal(has(m.touchCells),cell.touchOnly);}
 for(const piece of m.sections){const expected=v.allCellRecords.find(c=>c.cell.every((n,i)=>n===piece.cell[i]));assert(expected?.cut);assert.deepEqual(points(piece.polygon),points(expected.polygonXYZ.map(p=>p.map(fraction))));near(area(piece.polygon.map(p=>[p[0],p[2]])),fraction(expected.projectedAreaXZ));near(area(piece.flatPolygon)**2,fraction(expected.actualPlanarAreaSquared));}
 near(m.sections.reduce((sum,s)=>sum+area(s.flatPolygon),0),area(m.flatSection));near(area(m.flatSection)**2,fraction(v.sectionMosaic.actualAreaSquared));
 assert.equal(q.requestedAnswerUnique,true);assert.equal(q.studentGiven.solidFilled,true);assert.equal(q.layerCue,null);assert.equal(q.studentGiven.layerCue,null);assert.deepEqual(q.responseLayers,[]);assert.deepEqual(q.studentGiven.responseLayers,[]);assert.equal(q.requiresLayerDrawing,false);
 assert.equal(q.originalSourceReleaseStatus,"locked");assert.equal(q.difficultyDesign.empiricallyCalibrated,false);for(const name of["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"])assert.equal(q[name],false);
 assert(!/回|순열|조합|벡터|행렬|제곱|[=×]|<table|<svg/.test(q.promptText));
}
for(const expected of oracle.cases){
 const {variant,level}=expected,q=contracts.generate(models.sourceItemId,variant,level),p=presentation.render(models.sourceItemId,variant,level);verify(q,expected);report.cellChecks+=q.model.cubes.length;report.polygonChecks+=q.model.sections.length;
 assert(!/<table|<svg|math-inline-expression|data-layer=/.test(p.prompt));assert.equal((p.answerVisual.match(/<polygon\b/g)||[]).length,q.model.cutCount);
 for(const change of[q=>q.model.dimensions[1]++,q=>q.model.cutCells.pop(),q=>q.model.touchCells.pop(),q=>q.model.sections[0].polygon[0][0]+=.1,q=>q.model.sections[0].flatPolygon[0][1]+=.1,q=>q.model.sectionEdges[0].style="solid",q=>q.answer=0,q=>q.sourceExact=true,q=>q.layerCue={count:12},q=>q.difficultyDesign.empiricallyCalibrated=true]){const bad=copy(q);change(bad);assert.throws(()=>verify(bad,expected));report.negativeCases++;}
 report.cases.push({variant,level,answer:q.answer,dimensions:q.model.dimensions,cut:q.model.cutCount,touch:q.model.touchCount,mosaicTiles:q.model.sections.length});
}
for(const bad of[-1,3,1.5,"1",null,NaN,Infinity]){assert.throws(()=>contracts.generate(models.sourceItemId,bad,1));assert.throws(()=>contracts.generate(models.sourceItemId,0,bad));report.negativeCases+=2;}
assert.throws(()=>contracts.generate("unrelated",0,1));report.negativeCases++;
report.oracleSha256=sha(fs.readFileSync(file));report.runtimeHashes=Object.fromEntries(["source-6-2-plane-cut-models.js",...["models.js","contracts.js","presentation.js"].map(s=>`source-6-2-three-point-cut-mission2-${s}`)].map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));
report.status="passed-independent-cell-and-section-contracts";fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"contracts-audit.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,cases:report.cases.length,cellChecks:report.cellChecks,polygonChecks:report.polygonChecks,negativeCases:report.negativeCases,catalogUnlocked:false}));
