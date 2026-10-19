"use strict";
const assert=require("node:assert/strict"),models=require("./source-6-2-plane-cut-models.js");
const fs=require("node:fs"),path=require("node:path");
const evidence=process.env.HSE_PLANE_CUT_EVIDENCE_DIR;
assert(evidence&&/^E:[/\\]/i.test(evidence));
const independent=JSON.parse(fs.readFileSync(path.join(evidence,"independent/results.json"),"utf8"));
const rects=JSON.parse(fs.readFileSync(path.join(evidence,"concept-source-review/rectangular-variants-polygon-results.json"),"utf8"));
const rectSigns=JSON.parse(fs.readFileSync(path.join(evidence,"concept-source-review/rectangular-variants-vertex-results.json"),"utf8"));
let cases=0,cells=0;
for(const id of models.sourceItemIds)for(let variant=0;variant<3;variant++){
 const m=models.solve(id,variant),rect=id.endsWith("exploration"),prior=rect?rects.cases.find(r=>r.dimensionsXYZ.every((n,i)=>n===m.dimensions[i])):independent.results.find(r=>r.n===m.n);
 const cuts=rect?prior.cutCells:prior.by2dVoxelList,touches=rect?prior.touchOnlyCells:prior.boundaryTouchesExcluded.map(t=>t.voxel);
 if(rect){const other=rectSigns.cases.find(r=>r.id===prior.id),keys=a=>a.map(c=>c.join(",")).sort();assert.deepEqual(keys(cuts),keys(other.cutCells));assert.deepEqual(keys(touches),keys(other.touchOnlyCells));assert.equal(prior.enumeratedCellCount,m.cubes.length);assert.deepEqual(m.plane,{normal:other.plane.normal,constant:other.plane.rhs*2,coordinateScale:2});}
 else{assert.equal(prior.allCoordinatesEqual,true);assert.equal(prior.allLayerCoordinatesEqual,true);assert.equal(prior.twoDCubesEvaluated,m.cubes.length);assert.deepEqual(m.plane,{normal:[1,1,-1],constant:2*m.n,coordinateScale:2});}
 assert.deepEqual(m.cutCells.map(c=>c.join(",")).sort(),cuts.map(c=>c.join(",")).sort());
 assert.deepEqual(m.touchCells.map(c=>c.join(",")).sort(),touches.map(c=>c.join(",")).sort());
 assert.equal(m.cutCount,cuts.length);
 assert.deepEqual(m.layers.map(l=>l.cutCount),prior.layers.map(l=>rect?l.cutCells.length:l.twoDCount));
 assert.equal(m.planeSection.length,3);
 assert.deepEqual(m.planeSection.map(p=>p.join(",")).sort(),Object.values(m.points).map(p=>p.join(",")).sort());
 for(const p of m.planeSection)assert.equal(p.reduce((s,n,i)=>s+2*n*m.plane.normal[i],0),m.plane.constant);
 assert.equal(m.boundaryContactIsCut,false);assert.equal(m.sourceExact,false);assert.equal(m.originalSourceReleaseStatus,"locked");
 assert(Object.isFrozen(m)&&Object.isFrozen(m.cutCells));cells+=m.cubes.length;cases++;
}
for(const n of [0,1,5,6,2.5,"2",null,NaN])assert.throws(()=>models.build(n));
assert.throws(()=>models.planeFromPoints([[0,0,0],[1,1,1],[2,2,2]]));
assert.throws(()=>models.solve("other",0));assert.throws(()=>models.solve(models.sourceItemIds[0],3));
console.log(JSON.stringify({status:"passed",cases,cells,independentCoordinateLists:true,originalSourceLocked:true}));
