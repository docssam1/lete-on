"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto"),models=require("./source-6-2-painted-example2-models.js"),removal=require("./source-6-2-painted-removal.js");
const root=process.env.HSE_EXAMPLE2_EVIDENCE_DIR;assert(root&&/^E:[/\\]/i.test(root));const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),"utf8")),independent=read("independent/result.json"),model=read("independent/model.json");
assert.equal(independent.failedChecks,0);assert.equal(independent.checkCount,30);assert.equal(independent.releaseStatus,"locked");assert.equal(independent.candidateSpace.candidateCount,128);
assert.deepEqual(independent.answers.sourceViewPossibleValues,[6,7,8,9]);const clarified=independent.clarificationAudit.conditions.find(c=>c.id==="C2");assert.equal(clarified.candidateCount,1);assert.equal(clarified.uniqueGeometry,true);assert.deepEqual(clarified.answerValues,[9]);
assert.equal(crypto.createHash("sha256").update(fs.readFileSync(model.source.path)).digest("hex"),model.source.sha256);assert.deepEqual(models.solve().sourceAfter,model.after.solidColumnCandidate.heights);
for(const candidate of independent.candidateSpace.allCandidates){const remaining=candidate.remaining.map(([x,depth,up])=>[x,up,2-depth]),m=removal.solve(3,remaining);assert.equal(m.histogram[2],candidate.answer);assert.deepEqual(m.histogram,candidate.histogram);}
for(let variant=0;variant<3;variant++){
  const m=models.solve(variant),histogram=Array(7).fill(0);for(let depth=0;depth<m.side;depth++)for(let x=0;x<m.side;x++)for(let up=0;up<m.sourceAfter[depth][x];up++){const painted=[x,depth,up].reduce((sum,n)=>sum+Number(n===0||n===m.side-1),0);histogram[painted]++;}
  assert.deepEqual(m.histogram,histogram);assert.deepEqual(m.sourceAfter.slice().reverse(),m.heights);assert.equal(m.before.cells.length,m.side**3);assert.equal(m.cells.length+m.removed.length,m.before.cells.length);
  assert.equal(m.conditionPolicy.repaintAfterRemoval,false);assert.equal(m.sourceOriginalAmbiguous,true);assert.equal(m.sourceConditionsClarified,true);for(const phase of ["before","after"]){const r=models.rendererModel(variant,phase);assert.equal(r.cubes(r.heights).length,phase==="before"?m.side**3:m.cells.length);assert.throws(()=>r.cubes([]));}
}
for(const bad of [-1,3,.5,NaN,"0",null])assert.throws(()=>models.solve(bad));assert.throws(()=>models.rendererModel(0,"repaint"));
console.log(JSON.stringify({status:"passed",sourceOriginalCandidates:128,clarifiedCandidates:1,variants:3,answers:[9,20,31],sourceOriginalLocked:true,learnerReleaseVerified:false}));
