"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),vm=require("node:vm");
const api=require("./source-6-2-painted-stacks-models.js"),out=process.env.HSE_PAINT_EVIDENCE_DIR;
assert(out && /^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});
const expectedSources=[[[0,5,0,0],[0,3,0,0],[3,3,3,3],[0,2,2,2],[0,2,0,2]],[[0,2,3],[1,2,1],[2,0,2]],[[3,2,0],[2,1,0],[3,2,1]],Array.from({length:4},()=>[4,4,4,4])];
const protectedFiles=["index.html","source-inventory-grade6.js","source-inventory/6-2-source-items.json","source-6-2-stack-renderer.mjs"];
const digest=file=>crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),hashes=()=>Object.fromEntries(protectedFiles.map(file=>[file,digest(path.join(__dirname,file))])),before=hashes();
const result={status:"passed",variants:[],sourceVerifiedByThisAudit:false,learnerReleaseVerified:false,negative:[],protectedHashes:before};
let checked=0;
for(const [index,d] of api.definitions.entries()){
  assert.deepEqual(d.pools[0].heights,expectedSources[index]);
  for(let v=0;v<3;v++){
    const m=api.solve(d.sourceItemId,v),H=m.heights,distribution=Array(7).fill(0),directions={right:0,left:0,top:0,bottom:0,front:0,back:0};
    let total=0,contacts=0;
    for(let z=0;z<H.length;z++)for(let x=0;x<H[z].length;x++){
      const h=H[z][x];total+=h;contacts+=Math.max(0,h-1);
      if(x+1<H[z].length)contacts+=Math.min(h,H[z][x+1]);if(z+1<H.length)contacts+=Math.min(h,H[z+1][x]);
      for(let y=0;y<h;y++){
        const sides={right:(H[z][x+1]||0)<=y,left:(H[z][x-1]||0)<=y,top:y===h-1,bottom:y===0,front:(H[z+1]?.[x]||0)<=y,back:(H[z-1]?.[x]||0)<=y};
        const names=Object.entries(sides).filter(([,value])=>value).map(([name])=>name);distribution[names.length]++;names.forEach(name=>directions[name]++);
        const actual=m.colored.find(c=>c.cell.join(",")===[x,y,z].join(","));assert(actual);assert.deepEqual([...actual.faces].sort(),names.sort());checked+=6;
        assert.equal(m.layerGrids[y][z][x],names.length);
      }
    }
    assert.equal(total,m.cells.length);assert.deepEqual(m.histogram,distribution);assert.deepEqual(m.faceCounts,directions);assert.equal(distribution.reduce((a,b)=>a+b,0),total);
    assert.equal(m.paintedFaces,6*total-2*contacts);assert.equal(m.paintedArea,m.paintedFaces*m.edge*m.edge);
    assert.equal(m.withoutBottomArea,m.paintedArea-H.flat().filter(h=>h>0).length*m.edge*m.edge);
    assert.equal(distribution[6],0,"Only source-backed 0..5 painted-face tables are supported");
    for(const field of ["learnerReleaseVerified","officialAnswerVerified","difficultyVerified"])assert.equal(m[field],false);
    assert.equal(m.conditionPolicy.bottomFacesPainted,true);assert.equal(m.conditionPolicy.cutAfterPainting,false);
    if(m.kind==="unpainted-inner-cubes"){
      const n=[4,3,5][v];assert.equal(m.cells.length,n*n*n);
      assert.deepEqual(distribution,[(n-2)*(n-2)*(n-2),6*(n-2)*(n-2),12*(n-2),8,0,0,0]);
      assert.equal(m.conditionPolicy.separatedAfterPainting,true);assert.equal(m.sourceRef.learnerDiagramPresent,false);
    }
    assert.throws(()=>m.histogram[0]++,TypeError);assert.throws(()=>m.layerGrids[0][0][0]=99,TypeError);
    result.variants.push({sourceItemId:d.sourceItemId,variant:v,total,histogram:distribution,paintedFaces:m.paintedFaces,paintedArea:m.paintedArea,withoutBottomArea:m.withoutBottomArea});
  }
}
assert.deepEqual(api.solve(api.definitions[0].sourceItemId).histogram,[1,2,10,7,9,1,0]);
assert.deepEqual(api.solve(api.definitions[1].sourceItemId).histogram,[0,0,1,5,4,3,0]);
assert.equal(api.solve(api.definitions[2].sourceItemId).paintedArea,414);
for(const variant of [-1,3,1.5,NaN,Infinity,"0",null,{},()=>0]){assert.throws(()=>api.solve(api.definitions[0].sourceItemId,variant));result.negative.push("invalid-variant");}
assert.throws(()=>api.solve("6-2-u3-e3-example-4"));result.negative.push("unreviewed-source");
const sentinel={generate:()=>"unchanged"},context={window:{HSE_GENERATORS:sentinel}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-6-2-painted-stacks-models.js"),"utf8"),context);
assert.equal(context.window.HSE_GENERATORS,sentinel);assert.equal(context.window.HSE_SOURCE_GRADE6_PAINTED_STACKS_MODELS.solve(api.definitions[2].sourceItemId).paintedArea,414);
assert.deepEqual(hashes(),before);result.faceChecks=checked;
fs.writeFileSync(path.join(out,"painted-model-result.json"),JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({status:result.status,variants:result.variants.length,faceChecks:checked,negative:result.negative.length,sourceAnswers:result.variants.filter(v=>v.variant===0),learnerReleaseVerified:false}));
