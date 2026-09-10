'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const provider=require('../challenge/variant-provider.js');
const root=path.resolve(__dirname,'..');
const rows=provider.list().filter(r=>['priority-fold-holes','r4-main-12'].includes(r.typeId));
let checked=0;
function verify(q){
 const p=q.payload,diagram=q.solutionDiagram;assert(diagram&&diagram.includes('<svg'));
 if(p.kind==='geo-fold'){
  const blocks=diagram.split(/<g data-fold-remaining="/).slice(1);assert.equal(blocks.length,p.folds.length+1);
  let positions=new Set(p.holes.map(([x,y])=>y*p.size+x));
  blocks.forEach((block,i)=>{const remain=Number(block.split('"')[0]);assert.equal(remain,p.folds.length-i);
   if(i){const direction=p.folds[remain];for(const n of [...positions]){const x=n%p.size,y=Math.floor(n/p.size),reflected=direction.startsWith('diag-main-')?[y,x]:direction.startsWith('diag-anti-')?[p.size-1-y,p.size-1-x]:direction==='right-to-left'||direction==='left-to-right'?[p.size-1-x,y]:[x,p.size-1-y];positions.add(reflected[1]*p.size+reflected[0]);}}
   const drawn=[...block.matchAll(/data-hole="(\d+)"/g)].map(m=>+m[1]);assert.deepEqual(drawn.sort((a,b)=>a-b),[...positions].sort((a,b)=>a-b));
  });assert.deepEqual([...positions].sort((a,b)=>a-b),q.answer.slice().sort((a,b)=>a-b));assert(q.solution.includes(String(q.answer.length)+'개'));
 }else{
  assert.equal(p.kind,'geo-stack');const layers=diagram.split(/<g data-solution-layer="/).slice(1);assert.equal(layers.length,Math.max(...p.heights.flat()));let volume=0;
  layers.forEach((block,z)=>{const cells=[...block.matchAll(/data-layer-cell="(\d+),(\d+)" data-filled="(true|false)"/g)];assert.equal(cells.length,p.heights.length*p.heights[0].length);for(const m of cells){const expected=p.heights[+m[2]][+m[1]]>z;assert.equal(m[3]==='true',expected);if(expected)volume++;}});
  assert.equal(volume,q.answer*2);assert.equal(volume,p.bricks.reduce((s,b)=>s+b[3]*b[4]*b[5],0));
 }checked++;
}
for(const row of rows)for(const difficulty of ['easy','same','hard']){
 for(let seed=10;seed<70;seed++){const result=provider.generate({...row,difficulty,seed});assert.equal(result.status,'verified');verify(result.question);}
}
const report={passed:true,diagramChecks:checked,legacyPrivatePackageComparisons:0,scope:'current fold unfolding positions and stack layer occupancy; legacy private package is outside this concept-PDF revision and remains untouched',remoteWrites:0};
const out=path.join(root,'output/qa/challenge-fold-stack-solutions');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
