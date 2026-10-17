"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),models=require("./source-6-2-painted-mission5-models.js");
const folder=process.env.HSE_MISSION5_INDEPENDENT_DIR;
assert(folder&&/^E:[/\\]/i.test(folder),"An independently sealed source report is required");
const sealed=JSON.parse(fs.readFileSync(path.join(folder,"result.json"))),independent=JSON.parse(fs.readFileSync(path.join(folder,"model.json")));
for(const [file,hash] of Object.entries(sealed.seal.files))assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(folder,file))).digest("hex").toUpperCase(),hash);
assert.equal(sealed.gate.geometryPass,true);assert.equal(sealed.gate.mathPass,true);assert.equal(sealed.gate.unlock,false);
for(let variant=0;variant<3;variant++){
  const m=models.solve(variant),edge=models.edges[variant];
  assert.equal(m.cells.length,35);assert.deepEqual(m.histogram,[5,10,8,9,3,0,0]);assert.equal(m.faceCounts.bottom,21);assert.equal(m.paintedFaces,65);assert.equal(m.externalFaceCount,86);
  assert.equal(m.volume,35*edge*edge*edge);assert.equal(m.surfaceArea,86*edge*edge);assert.equal(m.paintedArea,65*edge*edge);assert.equal(m.areaOfExactlyTwoPaintedFaces,16*edge*edge);
  assert.equal(m.surfaceArea-m.paintedArea,m.floorArea);assert.equal(m.learnerReleaseVerified,false);assert(Object.isFrozen(m.layerGrids[0][0]));
}
const m=models.solve(),direct=sealed.directSixNeighbor;
assert.equal(m.volume,sealed.arithmetic.originalVolumeCm3);assert.equal(m.surfaceArea,sealed.arithmetic.originalTotalSurfaceAreaCm2);
assert.deepEqual(m.heights,independent.H);assert.deepEqual(m.histogram,direct.histogram||direct.paintedFaceHistogram);
const rotated=models.rendererModel(),cells=rotated.cubes(rotated.heights);
assert.deepEqual(cells.map(([x,y,z])=>[5-z,y,x]),m.cells);assert.equal(cells.length,35);
for(const value of [-1,3,1.5,null,NaN,Infinity])assert.throws(()=>models.solve(value));
assert.throws(()=>rotated.cubes(models.heights));
const raw=JSON.parse(fs.readFileSync(path.join(__dirname,"source-inventory/6-2-source-items.json")));
assert(["review-locked","fixed-verified-pool"].includes(raw.items.find(i=>i.sourceItemId===m.sourceItemId).implementationStatus));
console.log(JSON.stringify({status:"passed",variants:3,sourceCubes:35,twoPainted:8,totalFaces:86,paintedFaces:65,sourceVolume:m.volume,sourceSurface:m.surfaceArea,rendererCells:35,pureModelOnly:true}));
