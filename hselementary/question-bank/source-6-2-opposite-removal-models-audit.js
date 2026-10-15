"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const api=require("./source-6-2-opposite-removal-models.js"),out=process.env.HSE_SCREENSHOT_DIR;
assert(out&&/^E:[/\\]/i.test(out)&&path.win32.isAbsolute(out));fs.mkdirSync(out,{recursive:true});
const key=c=>c.join(","),keys=c=>c.map(key).sort(),clone=x=>JSON.parse(JSON.stringify(x));
const source={top:[[1,2],[2,2],[3,2],[2,1]],front:[[1,3],[2,2],[3,1]],right:[[2,3],[2,2],[1,1],[3,1]]};
function oracle(variant,level){
 const faces=clone(source);if(variant===1)faces.top=faces.top.map(([x,z])=>[4-z,x]);if(variant===2){faces.front=faces.front.map(([x,y])=>[x,x===3?2:y]);faces.right=faces.right.map(([z,y])=>[z===2&&y===2?3:z,y]);}
 const axes=level===0?["top","right"]:["top","front","right"],remaining=[],removed=[],overlapping=[],coverage=[];
 for(let x=0;x<5;x++)for(let y=0;y<5;y++)for(let z=0;z<5;z++){
  const cell=[x,y,z],hits=[];
  if(axes.includes("top")&&faces.top.some(([a,b])=>a===x&&b===z))hits.push("top");
  if(axes.includes("front")&&faces.front.some(([a,b])=>a===x&&b===y))hits.push("front");
  if(axes.includes("right")&&faces.right.some(([a,b])=>a===z&&b===y))hits.push("right");
  (hits.length?removed:remaining).push(cell);if(hits.length>=2)overlapping.push(cell);coverage.push({cell,axes:hits.sort(),count:hits.length});
 }
 return {faces,axes,remaining,removed,overlapping,coverage};
}
function validate(m,expected){
 assert.equal(m.n,5);assert.deepEqual(m.faces,expected.faces);assert.deepEqual(m.axes,expected.axes);assert.equal(new Set(keys(m.cells)).size,125);assert.equal(m.cells.length,125);
 for(const name of["remaining","removed","overlapping"])assert.deepEqual(keys(m[name]),keys(expected[name]));
 for(const cell of m.coverage){const match=expected.coverage.find(c=>key(c.cell)===key(cell.cell));assert(match);assert.deepEqual([...cell.axes].sort(),match.axes);assert.equal(cell.count,match.count);}
 for(const [field,list]of[["remainingCount","remaining"],["removedCount","removed"],["overlapCount","overlapping"]])assert.equal(m[field],expected[list].length);
 assert.equal(m.totalCount,125);assert.equal(m.remainingCount+m.removedCount,125);
 assert.deepEqual(m.answer,m.level===2?[expected.remaining.length,expected.overlapping.length]:expected.remaining.length);
 assert.equal(m.paintCells.length,11);assert.equal(new Set(keys(m.paintCells)).size,11);
 for(const ray of m.rays){
  assert.equal(ray.cells.length,5);const [a,b]=ray.mark,first=ray.axis==="top"?[a,4,b]:ray.axis==="front"?[a,b,0]:[4,b,a],last=ray.axis==="top"?[a,0,b]:ray.axis==="front"?[a,b,4]:[0,b,a];
  assert.deepEqual(ray.cells[0],first);assert.deepEqual(ray.cells[4],last);assert(m.paintCells.some(c=>key(c)===key(first)));
 }
 for(let y=0;y<5;y++){
  const row=m.layers[y];assert.equal(row.layer,y+1);assert.equal(row.cells.length,25);
  for(const name of["remaining","removed","overlapping"])assert.deepEqual(keys(row[name]),keys(expected[name].filter(c=>c[1]===y).map(([x,,z])=>[x,z])));
 }
 assert.equal(m.registrationOnly,true);assert.equal(m.learnerReleaseVerified,false);assert.equal(m.originalSourceReleaseStatus,"locked");for(const flag of["sourceExact","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","empiricallyCalibrated"])assert.equal(m[flag],false);
}
const report={status:"running",cases:[],negatives:[],modelSha256:crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname,"source-6-2-opposite-removal-models.js"))).digest("hex"),originalApproval:false,catalogUnlocked:false};
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
 const model=api.solve(api.sourceItemId,variant,level),expected=oracle(variant,level);validate(model,expected);
 report.cases.push({variant,level,axes:model.axes,answer:model.answer,remaining:model.remaining,removed:model.removed,overlapping:model.overlapping,layers:model.layers.map(r=>r.remaining.length)});
 for(const [name,change]of[
  ["wrong-answer",m=>{m.answer=0;}],["duplicate-union-count",m=>{m.removedCount=m.rays.reduce((s,r)=>s+r.cells.length,0);}],
  ["same-count-wrong-cell",m=>{m.remaining[0]=m.removed[0];}],["wrong-ray-start",m=>m.rays[0].cells.reverse()],
  ["wrong-layer-cell",m=>{m.layers[0].remaining[0]=[4,4];}],["changed-front-mark",m=>{m.faces.front[0]=[0,0];}],
  ["original-source-promoted",m=>{m.sourceExact=true;}],["rendered-approved",m=>{m.learnerReleaseVerified=true;}]
 ]){const bad=clone(model);change(bad);assert.throws(()=>validate(bad,expected),undefined,name);report.negatives.push(`${variant}/${level}:${name}`);}
}
for(const bad of[-1,3,1.5,"1",null,NaN,Infinity]){assert.throws(()=>api.solve(api.sourceItemId,bad,1));assert.throws(()=>api.solve(api.sourceItemId,0,bad));report.negatives.push(`invalid-input:${String(bad)}`);}
assert.throws(()=>api.solve("unknown",0,1));assert.deepEqual(api.solve(api.sourceItemId,0,1).layers.map(r=>r.remaining.length),[21,10,16,15,21]);
for(let level=0;level<3;level++){
 const signatures=[0,1,2].map(variant=>{const m=api.solve(api.sourceItemId,variant,level);return JSON.stringify(m.axes.map(axis=>[axis,keys(m.faces[axis])]));});
 assert.equal(new Set(signatures).size,3,"A variant must change an active direction, not only an unused face");
}
report.status="passed-model-candidate-only";report.cellsComparedPerMethod=1125;report.independenceScope="Reference cell-membership predicate is separate from production ray expansion; both share source face coordinates. Independent source-image reading and actual geometry/bank/print approval are separate.";
fs.writeFileSync(path.join(out,"models-audit.json"),JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify({status:report.status,cases:report.cases.length,cells:1125,negatives:report.negatives.length,catalogUnlocked:false}));
