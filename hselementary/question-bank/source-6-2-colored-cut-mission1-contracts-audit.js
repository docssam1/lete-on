"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto");
const models=require("./source-6-2-colored-cut-mission1-models.js"),contracts=require("./source-6-2-colored-cut-mission1-contracts.js"),presentation=require("./source-6-2-colored-cut-mission1-presentation.js");
const root=process.env.HSE_COLORED_CUT_EVIDENCE_DIR,out=process.env.HSE_SCREENSHOT_DIR;assert(root&&out&&/^E:[/\\]/i.test(root)&&/^E:[/\\]/i.test(out));
const file=path.join(root,"mission-4-1-variant-independent/result.json"),oracle=JSON.parse(fs.readFileSync(file,"utf8"));assert.equal(oracle.decision,"pass-bounded-independent-variant-oracle");
const order=cells=>cells.map(c=>c.join(",")).sort(),copy=v=>JSON.parse(JSON.stringify(v)),report={status:"running",cases:[],cellChecks:0,negativeCases:0,catalogUnlocked:false};
function verify(q,expected){
 const m=q.model;assert.deepEqual(m.dimensions,[5,4,5]);assert.equal(m.cubes.length,100);assert.deepEqual(m.frontRows,oracle.patterns[q.variant].frontMaskTopToBottom);
 for(const[name,cells]of[["darkCells",expected.fullRodDarkCells],["cutCells",expected.allColorsCutCells],["touchCells",expected.allColorsContactOnlyCells],["darkCutCells",expected.darkCutCells],["darkUncutCells",expected.darkUncutCells]])assert.deepEqual(order(m[name]),order(cells),name);
 assert(models.matchesExactDarkPattern(m,m.darkCells));assert.deepEqual(q.answer,expected.expectedAnswer);assert.deepEqual(q.answerOrder,expected.answerOrder);assert.equal(q.requestedAnswerUnique,true);
 assert.equal(q.studentGiven.darkPatternScope,"exact-union-of-shown-face-dark-rods-no-hidden-extras");assert.equal(q.layerCue,null);assert.deepEqual(q.responseLayers,[]);assert.equal(q.requiresLayerDrawing,false);
 assert(q.promptText.includes("다른 곳에는 어두운 쌓기나무가 없습니다"));assert(q.promptText.includes("직육면체"));assert(!/큰 정육면체|회전행렬|순열|조합|정규화|제곱|<table|<svg|[=×]/.test(q.promptText));
 assert.equal(q.originalSourceReleaseStatus,"locked");for(const name of["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"])assert.equal(q[name],false);
 for(const cell of expected.all100Cells){const key=cell.cell.join(","),has=name=>m[name].some(c=>c.join(",")===key);assert.equal(has("darkCells"),cell.darkByRodSet);assert.equal(has("cutCells"),cell.cut);assert.equal(has("touchCells"),cell.touchOnly);}
 assert.equal(m.sectionEdges.length,0);assert.equal(m.answerSectionEdges.filter(edge=>edge.style==="dashed").length,1);
}
for(const expected of oracle.cases){
 const {variant,level}=expected,q=contracts.generate(models.sourceItemId,variant,level),p=presentation.render(models.sourceItemId,variant,level);verify(q,expected);report.cellChecks+=100;
 assert(!/<table|<svg|math-inline-expression|data-layer=/.test(p.prompt));assert(p.answerVisual.includes("source62-colored-cut-front"));assert.equal((p.answerVisual.match(/<rect\b/g)||[]).length,20);
 for(const change of[q=>q.model.dimensions[1]++,q=>q.model.darkCells.push([2,1,1]),q=>q.model.darkCutCells.pop(),q=>q.model.cutCells.pop(),q=>q.answer=0,q=>q.sourceExact=true,q=>q.layerCue={count:15}]){const bad=copy(q);change(bad);assert.throws(()=>verify(bad,expected));report.negativeCases++;}
 assert(!models.matchesExactDarkPattern(q.model,[...q.model.darkCells,[2,1,1]]));assert(!models.matchesExactDarkPattern({...q.model,variant:99},[]));report.negativeCases+=2;
 report.cases.push({variant,level,answer:q.answer,dark:q.model.darkCount,fullCut:q.model.cutCount,frontDarkCut:q.model.frontDarkCutCells.length});
}
for(const v of[-1,3,1.5,"1",null,NaN,Infinity]){assert.throws(()=>contracts.generate(models.sourceItemId,v,1));assert.throws(()=>contracts.generate(models.sourceItemId,0,v));report.negativeCases+=2;}
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");report.oracleSha256=sha(fs.readFileSync(file));report.runtimeHashes=Object.fromEntries(["source-6-2-plane-cut-models.js","source-6-2-colored-cut-mission1-models.js","source-6-2-colored-cut-mission1-contracts.js","source-6-2-colored-cut-mission1-presentation.js"].map(f=>[f,sha(fs.readFileSync(path.join(__dirname,f)))]));report.status="passed-independent-900-cell-contracts";fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"contracts-audit.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,cases:report.cases.length,cellChecks:report.cellChecks,negativeCases:report.negativeCases,catalogUnlocked:false}));
