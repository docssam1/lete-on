"use strict";
const assert=require("node:assert/strict"), fs=require("node:fs"), path=require("node:path"), vm=require("node:vm");
const api=require("./source-6-2-stack-operations.js");
const id=suffix=>`6-2-u3-e1-${suffix}`;
// These source coordinates were traced by the independent source reviewer, not derived from solve().
const sourceHeights={
  [id("example-2")]:[[2,3,1],[0,2,2],[0,2,1]],
  [id("mission-5")]:[[0,0,2],[3,2,1],[1,0,0]],
  [id("mission-6")]:[[0,2,2,1],[2,3,0,0],[0,1,0,0]]
};
function occupied(heights) {
  const cells=new Set();
  for(let z=0;z<heights.length;z++)for(let x=0;x<heights[z].length;x++)for(let y=0;y<heights[z][x];y++)cells.add(`${x},${y},${z}`);
  return cells;
}
function scan(cells,rows,cols) {
  const top=Array.from({length:rows},()=>Array(cols).fill(0)), front=Array(cols).fill(0), right=Array(rows).fill(0);
  for(let z=0;z<rows;z++)for(let x=0;x<cols;x++)for(let y=0;y<6;y++)if(cells.has(`${x},${y},${z}`)){
    top[z][x]=1;front[x]=Math.max(front[x],y+1);right[rows-z-1]=Math.max(right[rows-z-1],y+1);
  }
  return {top,front,right};
}
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let cases=0,trials=0;
for(const definition of api.definitions)for(let variant=0;variant<3;variant++){
  const result=api.solve(definition.sourceItemId,variant), heights=definition.pools[variant];
  if(!variant)assert.deepEqual(heights,sourceHeights[definition.sourceItemId]);
  const cells=occupied(heights), rows=heights.length, cols=heights[0].length, before=scan(cells,rows,cols);
  assert.deepEqual(result.original,before);
  if(definition.operation==="remove-one-labelled-top"){
    const labels=[];
    definition.labelledColumns.forEach(([x,z],index)=>{
      const target=`${x},${heights[z][x]-1},${z}`, after=new Set(cells);assert(after.delete(target));
      const projection=scan(after,rows,cols), qualifies=equal(before.front,projection.front)&&equal(before.right,projection.right);
      assert.deepEqual(result.trials[index].after,projection);assert.equal(result.trials[index].qualifies,qualifies);
      if(qualifies)labels.push(String.fromCodePoint(0x3260+index));trials++;
    });
    assert.deepEqual(result.answer,labels);
  }else{
    const after=new Set(cells);
    if(definition.additions)for(const {column:[x,z],count} of definition.additions)for(let y=heights[z][x];y<heights[z][x]+count;y++){
      assert(!after.has(`${x},${y},${z}`));after.add(`${x},${y},${z}`);
    }else for(const cell of definition.markedCells)assert(after.delete(cell.join(",")));
    assert.deepEqual(new Set(result.afterCells.map(c=>c.join(","))),after);
    assert.deepEqual(result.after,scan(after,rows,cols));
    for(const cell of after){const [x,y,z]=cell.split(",").map(Number);for(let support=0;support<y;support++)assert(after.has(`${x},${support},${z}`),"A marked removal must not leave unsupported blocks");}
  }
  cases++;
}
const example=api.solve(id("example-2"));
assert.deepEqual(example.answer,["\u3261","\u3263","\u3266"]);
assert.deepEqual(example.trials.map(t=>t.target),[[1,2,0],[2,0,0],[0,1,0],[1,1,1],[1,1,2],[2,1,1],[2,0,2]]);
assert.deepEqual(example.original.front,[2,3,2]);assert.deepEqual(example.original.right,[2,2,3]);
assert.deepEqual(example.trials.filter(t=>t.qualifies&&equal(t.after.top,example.original.top)).map(t=>t.label),["\u3263"],"Adding top-view preservation changes the original answer");
const allRemovals=example.cells.filter(cell=>{
  // Actual occupied silhouettes, not only maximum heights: a lower removal can expose a hole.
  const project=cells=>({front:new Set(cells.map(([x,y])=>`${x},${y}`)),right:new Set(cells.map(([,y,z])=>`${z},${y}`))});
  const before=project(example.cells), after=project(example.cells.filter(c=>c.join(",")!==cell.join(",")));
  const same=(a,b)=>a.size===b.size&&[...a].every(value=>b.has(value));
  return same(before.front,after.front)&&same(before.right,after.right);
});
assert.equal(allRemovals.length,8,"Unlabelled lower cubes must not be conflated with labelled top removals");
const mission5=api.solve(id("mission-5"));
assert.deepEqual(mission5.answer,{right:[3,3,2]});assert.equal(mission5.cells.length,9);assert.equal(mission5.afterCells.length,12);
const mission6=api.solve(id("mission-6"));
assert.deepEqual(mission6.answer,{top:[[0,1,1,1],[1,1,0,0],[0,0,0,0]],front:[1,2,2,1],right:[0,2,2]});
assert.equal(mission6.cells.length,11);assert.equal(mission6.afterCells.length,8);
const catalog={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-inventory-grade6.js"),"utf8"),catalog);
const releasedKeys={
  [id("example-2")]:"sourceGrade6SecondSpaceE1StackRemovalLabels",
  [id("mission-5")]:"sourceGrade6SecondSpaceE1StackAddViews",
  [id("mission-6")]:"sourceGrade6SecondSpaceE1StackRemoveBlackViews"
};
for(const definition of api.definitions){
  const item=catalog.window.HSE_SOURCE_INVENTORY_GRADE6.items.find(i=>i.sourceItemId===definition.sourceItemId);
  assert.equal(item.reviewLocked,false);assert.equal(item.generatorKey,releasedKeys[definition.sourceItemId]);
  assert.equal(item.answerVisualStatus,"verified");assert.equal(item.verifiedVariantCount,3);
}
for(const [source,variant] of [[id("example-2"),-1],[id("mission-5"),3],[id("mission-6"),.5],["unknown",0]])assert.throws(()=>api.solve(source,variant));
assert.throws(()=>api.remove(mission6.cells,[5,5,5]));
console.log(`Verified ${cases} fixed operation models, ${trials} labelled removals, original answer sets and projections; three audited finite learner releases match the catalog.`);
