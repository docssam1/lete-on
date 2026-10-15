"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto"),api=require("./source-6-2-painted-exploration-models.js");
const dir=process.env.HSE_EXPLORATION_EVIDENCE_DIR;assert(dir&&/^E:[/\\]/i.test(dir));
const read=file=>JSON.parse(fs.readFileSync(path.join(dir,"independent",file),"utf8")),original=read("model.json"),r=read("result.json");
assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(dir,"independent/model.json"))).digest("hex"),r.modelFileSha256);
assert.equal(r.status.release,"locked");assert.equal(r.conclusions.originalOnlyUnique,false);assert.equal(r.conclusions.originalPlusGroundFilledOnlyUnique,false);assert.equal(r.conclusions.minimalStructuralRepair.candidateCount,1);
const initial=api.solve();assert.deepEqual(initial.sourceHeights,original.geometryFreeze.referenceHeightMapYFrontToBackXLeftToRight);assert.equal(initial.cells.length,44);assert.deepEqual(initial.histogram,r.witnesses[0].exteriorPaint.histogram);
for(let variant=0;variant<3;variant++){
  const m=api.solve(variant),occupied=new Set(m.cells.map(c=>c.join(","))),contacts=m.cells.reduce((n,c)=>n+[[1,0,0],[0,1,0],[0,0,1]].filter(d=>occupied.has(c.map((x,j)=>x+d[j]).join(","))).length,0);
  assert.equal(m.paintedFaces,6*m.cells.length-2*contacts);assert.equal(m.histogram.reduce((a,b)=>a+b,0),m.cells.length);assert.equal(m.histogram.reduce((n,count,faces)=>n+count*faces,0),m.paintedFaces);
  assert.equal(m.histogram[6],0);assert.equal(m.sourceHeights.flat().filter(Boolean).length,14);assert.equal(m.sourceConditionsClarified,true);assert.equal(m.originalAnswerDeterminate,false);assert.equal(m.originalSourceReleaseStatus,"locked");assert(m.conditionPolicy.allColumnTopsShown&&m.conditionPolicy.groundedColumns&&m.conditionPolicy.bottomFacesPainted);
  for(const [y,matrix]of m.layerGrids.entries())for(const row of m.colored.filter(c=>c.cell[1]===y))assert.equal(matrix[row.cell[2]][row.cell[0]],row.painted);
  assert.deepEqual(api.rendererModel(variant).cubes(m.heights),m.cells);assert.throws(()=>api.rendererModel(variant).cubes([]));
}
assert.deepEqual(api.fittedCamera.u,r.camera.coefficients.u.slice(1));assert.deepEqual(api.fittedCamera.v,r.camera.coefficients.v.slice(1));for(const v of [-1,3,.5,"0",NaN])assert.throws(()=>api.solve(v));
console.log(JSON.stringify({status:"passed",variants:3,conditionalSourceAnswer:initial.histogram.slice(0,6),originalSourceLocked:true,sourceCells:44}));
