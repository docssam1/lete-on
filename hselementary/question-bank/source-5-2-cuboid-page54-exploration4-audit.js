"use strict";
const assert=require("node:assert/strict"),source=require("./source-5-2-cuboid-page54-exploration4.js");
const model=source.verifyModel();
assert.deepEqual(model.oppositePairs,[[1,5],[2,3],[4,6]]);
assert.deepEqual([...model.moves],["R","R","R","F","F","R"]);
assert.deepEqual([...model.bottoms],[6,3,4,2,1,3,6]);
assert.equal(model.sum,25);
assert.equal(source.pathCells.length,7);
const type={id:source.definition.sourceItemId,sourceItemId:source.definition.sourceItemId,generatorKey:source.definition.generatorKey,sourceVerified:true,reviewLocked:false};
const api={names:[],generatorKey:()=>"legacy",generate:()=>null};source.install({HSE_GENERATORS:api});
assert.equal(api.generatorKey(type),source.definition.generatorKey);
const item=api.generate(type,0,0,0,0);
assert.equal(item.answer,"25");assert.equal(item.answerModel.sum,25);assert.equal(item.verifiedVariantCount,1);
// Check the actual printed path, not just the separate list used by the model.
// The seven coordinates below were transcribed from the clean source figure;
// the first cell is underneath the starting die.
const expectedCells=[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[4,2]];
function inspectPath(html) {
  const svg=html.match(/<svg class="source52-p54e4-path"[\s\S]*?<\/svg>/)?.[0];
  assert.ok(svg,"path diagram missing");
  const cells=[...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="42" height="42"\/>/g)]
    .map(([,x,y])=>[(Number(x)-22)/42,(Number(y)-30)/42]);
  assert.deepEqual(cells,expectedCells,"rendered cells must match the source path");
  const arrows=svg.match(/<g class="arrows">([\s\S]*?)<\/g>/)?.[1];
  assert.ok(arrows,"movement arrows missing");
  const vectors=[...arrows.matchAll(/d="M(-?\d+) (-?\d+) L(-?\d+) (-?\d+)"/g)]
    .map(([,x1,y1,x2,y2])=>[Math.sign(x2-x1),Math.sign(y2-y1)]);
  assert.deepEqual(vectors,cells.slice(1).map(([x,y],i)=>[x-cells[i][0],y-cells[i][1]]),"arrows must follow adjacent cells");
  return svg;
}
inspectPath(item.prompt);
const answerPath=inspectPath(item.answerVisual);
// A separate face permutation follows the movements read from the drawn cells.
let die={top:4,bottom:6,front:1,back:5,right:3,left:2};
const independentlyTraced=[die.bottom];
for(let i=1;i<expectedCells.length;i++) {
  const dx=expectedCells[i][0]-expectedCells[i-1][0],dy=expectedCells[i][1]-expectedCells[i-1][1];
  if(dx===1&&dy===0) die={...die,top:die.left,bottom:die.right,right:die.top,left:die.bottom};
  else if(dx===0&&dy===1) die={...die,top:die.back,bottom:die.front,front:die.top,back:die.bottom};
  else assert.fail("unexpected movement in source path");
  independentlyTraced.push(die.bottom);
}
assert.deepEqual(independentlyTraced,[6,3,4,2,1,3,6]);
assert.deepEqual([...answerPath.matchAll(/<text class="bottom"[^>]*>(\d+)<\/text>/g)].map(m=>Number(m[1])),independentlyTraced,"answer diagram must show each independently traced bottom face");
assert.equal(independentlyTraced.reduce((a,b)=>a+b,0),Number(item.answer));
assert.equal((item.prompt.match(/<figure>/g)||[]).length,3);
assert.match(item.prompt,/2의 오른쪽에 5, 5의 아래에 4/);
assert.match(item.prompt,/오른쪽으로 세 칸, 앞쪽으로 두 칸/);
assert.match(item.prompt,/출발 칸을 포함해 모두 일곱 칸/);
assert.match(item.prompt,/<text class="start-label"[^>]*>출발<\/text>/);
assert.match(item.prompt,/<path class="start-arrow"/);
const markerIds=[...(`${item.prompt}${item.answerVisual}${item.solution}`).matchAll(/<marker id="([^"]+)"/g)].map(match=>match[1]);
assert.equal(markerIds.length,2);
assert.equal(new Set(markerIds).size,2,"problem and answer visual must not share SVG marker IDs");
assert.doesNotMatch(item.prompt,/바닥에 닿은 수는 차례로/);
assert.doesNotMatch(item.solution, /source52-p54e4-diagrams/);
assert.match(item.answerVisual, /source52-p54e4-diagrams/);
assert.match(item.solution,/바닥에 닿는 수는 6, 3, 4, 2, 1, 3, 6/);
assert.match(item.solution,/6\+3\+4\+2\+1\+3\+6=<strong>25<\/strong>/);
assert.equal(api.generate({...type,reviewLocked:true},0,0,0,0),null);
assert.equal(api.generate(type,0,0,0,1),null);
console.log("5-2 U5 p.54 Exploration 4 net fold, roll sequence, answer, and lock audit passed.");
