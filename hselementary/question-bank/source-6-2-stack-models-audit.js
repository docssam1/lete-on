"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const models = require("./source-6-2-stack-models.js");
function projectionByCubes(h) {
  const front=h[0].map(()=>new Set()), side=h.map(()=>new Set());
  h.forEach((row,z)=>row.forEach((n,x)=>{for(let y=0;y<n;y++){front[x].add(y);side[z].add(y);}}));
  return {front:front.map(s=>s.size),right:side.map(s=>s.size).reverse()};
}
function enumerate({top,front,right,total}) {
  const caps=[...right].reverse(), rows=top.length, cols=top[0].length;
  const h=Array.from({length:rows},()=>Array(cols).fill(0)), occupied=[], answers=[];
  top.forEach((row,z)=>row.forEach((v,x)=>{if(v)occupied.push([z,x]);}));
  let visited=0;
  function walk(i,sum) {
    if(i===occupied.length) {
      visited++;
      const projections=projectionByCubes(h);
      if((total===undefined||sum===total)&&projections.front.every((v,x)=>v===front[x])&&projections.right.every((v,x)=>v===right[x]))answers.push(h.map(r=>[...r]));
      return;
    }
    const [z,x]=occupied[i], bound=Math.min(caps[z],front[x]);
    for(let n=1;n<=bound;n++){h[z][x]=n;walk(i+1,sum+n);}
    h[z][x]=0;
  }
  walk(0,0);
  return {visited,answers};
}
const fixtures=[
  {top:[[1,0,0],[1,1,1],[0,1,0]],front:[3,1,2],right:[1,2,3],total:8,heights:[[3,0,0],[1,1,2],[0,1,0]]},
  {top:[[1,1],[1,0],[1,0]],front:[3,2],right:[1,2,3],heights:[[3,2],[2,0],[1,0]]}
];
const records=[];
models.definitions.forEach((def,index)=>{
  assert.equal(def.releaseStatus,"locked");
  assert.equal(def.publisherAnswerVerified,false);
  assert.deepEqual(def.pools[0],fixtures[index],"Independent exact source fixture");
  for(const [variant,pool] of def.pools.entries()) {
    assert.equal(Object.hasOwn(pool,"total"),def.countGiven,"Mission 3 has no total condition");
    const {heights,...given}=pool, result=enumerate(given);
    assert.equal(result.answers.length,1,`${def.sourceItemId}/${variant} unique full stack`);
    assert.deepEqual(result.answers[0],heights);
    assert.deepEqual(heights.map(r=>r.map(v=>+!!v)),pool.top);
    const cubes=models.cubes(heights);
    assert.equal(new Set(cubes.map(c=>c.join(','))).size,cubes.length);
    assert(cubes.every(([x,y,z])=>x>=0&&z>=0&&y>=0&&y<heights[z][x]));
    const wrongView={...given,front:given.front.map((n,x)=>x===0?Math.max(...given.right)+1:n)};
    assert.equal(enumerate(wrongView).answers.length,0);
    records.push({id:def.sourceItemId,variant,visited:result.visited,answers:result.answers.length,cubes:cubes.length});
  }
});
const withoutTotal={...fixtures[0]};delete withoutTotal.total;
assert.equal(enumerate(withoutTotal).answers.length,2);
const ambiguous={top:fixtures[1].top,front:[2,3],right:[1,2,3]};
assert.equal(enumerate(ambiguous).answers.length,2,"Reject tempting but non-unique Mission 3 variant");
for(const invalid of [null,[],[[0,0]],[[1],[1,2]],[[1,-1]],[[1,1.5]],[[7]],[[NaN]],[[Infinity]],[[1,,1]],[[1],,]])assert.throws(()=>models.cubes(invalid));
global.window={};
for(const name of ['source-inventory-4-1.js','source-inventory-grade6.js','curriculum.js','generators.js','source-6-2-height-views.js'])require(`./${name}`);
for(const def of models.definitions){
  const type=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item=>item.sourceItemId===def.sourceItemId);
  assert(type.reviewLocked);
  assert.equal(window.HSE_GENERATORS.generatorKey(type),'');
  assert.equal(window.HSE_GENERATORS.generate(type,0,0,1),null,'Renderer review must not accidentally release a source type');
}
if(process.env.HSE_STACK_AUDIT_OUTPUT){assert(/^[EG]:[/\\]/i.test(process.env.HSE_STACK_AUDIT_OUTPUT));fs.writeFileSync(process.env.HSE_STACK_AUDIT_OUTPUT,JSON.stringify({records,missingTotalModels:2,ambiguousVariantModels:2,releaseStatus:"locked"},null,2));}
console.log(`Cube reconstruction: ${records.length} fixed conditions, ${records.reduce((s,r)=>s+r.visited,0)} independent arrangements; unique full stacks, missing-total and ambiguous-variant negatives passed. Both types remain locked.`);
