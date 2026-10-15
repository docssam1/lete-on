"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict"),crypto=require("node:crypto"),api=require("./source-6-2-painted-mission6-models.js");
const root=process.env.HSE_MISSION6_EVIDENCE_DIR;assert(root&&/^E:[/\\]/i.test(root));
const evidence=JSON.parse(fs.readFileSync(path.join(root,"independent/result.json"),"utf8")),pool=JSON.parse(fs.readFileSync(path.join(root,"variant-pool-result.json"),"utf8"));
assert.equal(evidence.status,"PASS_INDEPENDENT_SOURCE_GEOMETRY_AND_MATH_PRIVATE_ONLY");assert.equal(pool.status,"passed-private-candidate-math-only");
assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,"mission6-source.png"))).digest("hex"),evidence.sourceIntegrity.imageSha256);
assert.deepEqual(api.solve().sourceHeights,evidence.geometry.H);
for(let v=0;v<3;v++){const m=api.solve(v),candidate=pool.candidates[v];assert.equal(m.cells.length,candidate.cubeCount);assert.deepEqual(m.histogram,candidate.histogram);assert.deepEqual(m.heights,candidate.rendererHeightGrid);assert.deepEqual(m.horizontalExposureCounts,[4,12,12,0,0]);assert.deepEqual(m.sourceHeights.slice().reverse(),m.heights);assert.deepEqual(api.rendererModel(v).cubes(m.heights),m.cells);assert(m.conditionPolicy.bottomFacesPainted);assert.equal(m.paintedFaces,56+36*m.height);assert.equal(m.groupedLayers.length,2);
  for(const group of m.groupedLayers)for(const layer of group.layers)assert.deepEqual(group.matrix,m.layerGrids[layer-1]);}
assert.deepEqual(api.fittedCamera.u,evidence.projection.camera.u.slice(0,3));assert.deepEqual(api.fittedCamera.v,evidence.projection.camera.v.slice(0,3));
for(const bad of [-1,3,.5,NaN,"0",null])assert.throws(()=>api.solve(bad));
assert(Object.isFrozen(api.solve().heights));
console.log(JSON.stringify({status:"passed",variants:3,sourceCubes:140,sourceAnswers:[api.solve().histogram[1],api.solve().histogram[0]],coordinateFrameChecked:true,groupedLayersChecked:true,learnerReleaseVerified:false}));
