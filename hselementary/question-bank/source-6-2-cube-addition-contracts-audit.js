"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),crypto=require("node:crypto"),models=require("./source-6-2-cube-addition-models.js"),contracts=require("./source-6-2-cube-addition-contracts.js");
const root=process.env.HSE_CUBE_ADDITION_EVIDENCE_DIR,out=process.env.HSE_SCREENSHOT_DIR;assert(root&&out&&[root,out].every(p=>/^E:[/\\]/i.test(p)));
const oracle=JSON.parse(fs.readFileSync(path.join(root,"example-4-4-variant-independent/result.json"),"utf8")),point=c=>c.join(","),points=c=>c.map(point).sort(),groups=cs=>cs.map(c=>points(c.positions||c.memberAdditionCells).join(";")).sort(),copy=x=>JSON.parse(JSON.stringify(x));
assert.equal(oracle.decision,"pass-bounded-independent-coordinate-oracle");assert.equal(oracle.parentModelRead,false);assert.equal(oracle.checks.directPointSetPairsChecked,1800);
const report={status:"running",cases:[],negativeCases:0,classes:0,positions:0,catalogUnlocked:false,officialAnswerVerified:false};
function verify(model,expected){
 assert.deepEqual(points(model.cells),points(expected.baseCells));assert.deepEqual(points(model.positions),points(expected.candidateCells));
 assert.equal(new Set(points(model.positions)).size,model.positions.length);assert.deepEqual(groups(model.classes),groups(expected.classes));assert.equal(model.shapeCount,expected.distinctShapeCount);assert.equal(model.placementCount,expected.fixedBaseAttachmentPositionCount);assert.deepEqual(model.answer,expected.answer);
 assert.equal(model.baseCubeCount,6);assert.equal(model.resultCubeCount,7);assert.equal(model.equivalenceMode,"translation-and-24-proper-rotations");assert.equal(model.addedCubeDistinguishedInComparison,false);assert.equal(model.groundRestriction,false);
 const occupied=new Set(points(model.cells));
 for(const group of model.classes){assert.equal(group.placementCount,group.positions.length);assert.equal(group.witnesses.length,group.positions.length);
  for(const witness of group.witnesses){assert.deepEqual(points(witness.cells),points([...model.cells,witness.added]));assert(group.positions.some(c=>point(c)===point(witness.added)));assert(!occupied.has(point(witness.added)));assert.equal(models.canonical(witness.cells),group.canonical);
   const contacts=model.cells.filter(c=>c.reduce((sum,n,i)=>sum+Math.abs(n-witness.added[i]),0)===1).length;assert.equal(witness.faceContacts,contacts);assert(contacts>0);
  }
 }
 for(const flag of["sourceExact","publisherAnswerVerified","officialAnswerVerified","handwrittenAnswerVerified","humanApproved","empiricallyCalibrated","learnerReleaseVerified"])assert.equal(model[flag],false);assert.equal(model.originalSourceReleaseStatus,"locked");
}
for(const expected of oracle.cases){
 const{variant,level}=expected,q=contracts.generate(models.sourceItemId,variant,level),model=q.model;verify(model,expected);
 assert.equal(q.studentGiven.cells.length,6);assert.equal(q.studentGiven.layerCue,null);assert.deepEqual(q.studentGiven.responseLayers,[]);assert.equal(q.requiresLayerDrawing,false);assert.equal(q.requestedAnswerUnique,true);assert.equal(q.sourceConditionsClarified,true);
 assert(q.promptText.includes("6개"));assert(q.promptText.includes("1개"));assert(q.promptText.includes("면끼리 꼭 맞게"));assert(q.promptText.includes("손으로 돌리거나 뒤집어"));assert.equal(q.promptText.includes("납작한"),level===0);assert.equal(q.promptText.includes("움직이지 않을 때"),level===2);
 assert(!/회전행렬|순열|조합|정규화|거울상|동형|제곱|<table|<svg|[=×]/.test(q.promptText));assert.equal(q.difficultyDesign.adoptionStatus,"pending");
 for(const mutation of[
  m=>{m.positions[0]=m.positions[1];},m=>{m.classes[0].positions[0]=m.classes[1].positions[0];},
  m=>{m.classes[0].witnesses[0].cells[0]=[50,50,50];},m=>{m.classes[0].witnesses[0].faceContacts=9;},
  m=>{m.equivalenceMode="rotation-and-reflection-48";},m=>{m.addedCubeDistinguishedInComparison=true;},
  m=>{m.answer=0;},m=>{m.sourceExact=true;},m=>{m.cells[0]=[20,20,20];}
 ]){const bad=copy(model);mutation(bad);assert.throws(()=>verify(bad,expected));report.negativeCases++;}
 report.classes+=model.classes.length;report.positions+=model.positions.length;report.cases.push({variant,level,answer:q.answer,classes:model.classes.length,positions:model.positions.length});
}
for(const bad of[-1,3,1.5,"1",null,NaN,Infinity]){assert.throws(()=>contracts.generate(models.sourceItemId,bad,1));assert.throws(()=>contracts.generate(models.sourceItemId,0,bad));report.negativeCases+=2;}
assert.throws(()=>contracts.generate("unknown",0,1));report.negativeCases++;
const code=fs.readFileSync(path.join(__dirname,"generators.js"),"utf8"),sentinel={value:"preserved"},context={window:{HSE_GENERATORS:sentinel},module:{exports:{}}};vm.runInNewContext(code,context);assert.equal(context.window.HSE_GENERATORS,sentinel);assert.equal(context.module.exports.rotationTransforms.length,24);
assert.equal(new Set(models.definitions.map(d=>models.canonical(d.cells))).size,3);assert.equal(models.rotations.length,24);assert(models.rotations.every(r=>r.determinant===1));
const sha=bytes=>crypto.createHash("sha256").update(bytes).digest("hex");report.runtimeHashes=Object.fromEntries(["generators.js","source-6-2-cube-addition-models.js","source-6-2-cube-addition-contracts.js"].map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))]));report.independentResultSha256=sha(fs.readFileSync(path.join(root,"example-4-4-variant-independent/result.json")));report.status="passed-model-contract-independent-partitions";fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,"contracts-audit.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,cases:report.cases.length,classes:report.classes,positions:report.positions,negativeCases:report.negativeCases,catalogUnlocked:false}));
