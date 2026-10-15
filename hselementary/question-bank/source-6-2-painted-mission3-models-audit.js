"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const api=require("./source-6-2-painted-mission3-models.js"),out=process.env.HSE_MISSION3_EVIDENCE_DIR;
assert(out && /^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});
const compare=H=>{
  const histogram=Array(7).fill(0),layers=Array.from({length:3},()=>H.map(row=>row.map(()=>null)));let contacts=0,total=0;
  for(let z=0;z<H.length;z++)for(let x=0;x<H[z].length;x++){
    const h=H[z][x];total+=h;contacts+=Math.max(0,h-1);
    if(x+1<H[z].length)contacts+=Math.min(h,H[z][x+1]);if(z+1<H.length)contacts+=Math.min(h,H[z+1][x]);
    for(let y=0;y<h;y++){
      const count=Number(y===h-1)+Number((H[z]?.[x-1]||0)<=y)+Number((H[z]?.[x+1]||0)<=y)+Number((H[z-1]?.[x]||0)<=y)+Number((H[z+1]?.[x]||0)<=y);
      histogram[count]++;layers[y][z][x]=count;
    }
  }
  return {histogram,layers,total,paintedFaces:6*total-2*contacts-H.flat().filter(n=>n>0).length};
};
const results=[];
for(let v=0;v<3;v++){
  const m=api.solve(v),other=compare(m.heights);
  assert.deepEqual(m.histogram,other.histogram);assert.deepEqual(m.layerGrids,other.layers);assert.equal(m.cells.length,other.total);assert.equal(m.paintedFaces,other.paintedFaces);
  assert.equal(m.conditionPolicy.bottomFacesPainted,false);assert(m.colored.every(c=>!c.faces.includes("bottom")));
  assert.equal(m.answer,10*other.histogram[4]+other.histogram[3]);assert.deepEqual(m.layerCounts,[[10,5,1],[10,6,1],[10,6,2]][v]);
  assert.equal(m.learnerReleaseVerified,false);assert.equal(m.officialAnswerVerified,false);assert.equal(m.sourceFidelityVerified,false);
  assert.throws(()=>m.heights[0][2]++,TypeError);assert.throws(()=>api.rendererModel(v).cubes(m.heights.map(r=>r.slice(0,-1))));
  results.push({variant:v,cubes:m.cells.length,histogram:m.histogram,layerCounts:m.layerCounts,A:m.A,B:m.B,answer:m.answer,paintedFaces:m.paintedFaces});
}
assert.deepEqual(api.solve(0).heights,[[0,0,1,0,0,0],[2,3,2,0,0,0],[2,1,1,1,1,2]]);
const wrong=compare([[2,3,2,1,0,0],[2,1,1,1,1,2]]);assert.equal(10*wrong.histogram[4]+wrong.histogram[3],24);assert.notEqual(24,api.solve(0).answer);
for(const variant of [-1,3,.5,NaN,Infinity,"0",null,{},Number.MAX_SAFE_INTEGER+1])assert.throws(()=>api.solve(variant));
const report={status:"passed",variants:results,wrongRearPositionChangesAnswer:true,wrongRearAnswer:24,learnerReleaseVerified:false};
fs.writeFileSync(path.join(out,"model-audit-result.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report));
