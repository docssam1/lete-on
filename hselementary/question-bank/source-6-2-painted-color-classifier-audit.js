"use strict";
const assert=require("node:assert/strict"),api=require("./source-6-2-painted-color-classifier.js"),palette={right:"red",left:"blue",top:"red",bottom:null,front:"red",back:"blue"};
let cases=0;
for(let n=2;n<=8;n++){
  const m=api.classify(Array.from({length:n},()=>Array(n).fill(n)),palette);
  assert.equal(m.cells.length,n**3);assert.equal(m.redExactlyTwo,3*(n-1));assert.equal(m.atLeastOnePainted,n**3-(n-2)**2*(n-1));assert.equal(m.histograms.blue[2],n);
  for(const c of m.colored){const [x,y,z]=c.cell,red=Number(x===n-1)+Number(y===n-1)+Number(z===n-1),blue=Number(x===0)+Number(z===0);assert.equal(c.red,red);assert.equal(c.blue,blue);assert.equal(c.painted,red+blue);}cases++;
}
// In a notch, a face exposed towards the same direction keeps that direction's colour.
const notch=api.classify([[2,2],[2,0]],palette);assert.equal(notch.cells.length,6);assert(notch.colored.find(c=>c.cell.join(",")==="0,0,1").exposed.some(f=>f.direction==="right"&&f.color==="red"));assert(notch.colored.every(c=>!c.exposed.some(f=>f.direction==="bottom"&&f.color!==null)));
const full=api.classify([[3,3,3],[3,3,3],[3,3,3]],palette),wrongFloor=api.classify(full.heights,{...palette,bottom:"red"}),wrongBlue=api.classify(full.heights,{...palette,left:null,back:null});
assert.notEqual(full.atLeastOnePainted,wrongFloor.atLeastOnePainted);assert.notEqual(full.atLeastOnePainted,wrongBlue.atLeastOnePainted);
const bad=[()=>api.classify([],palette),()=>api.classify([[0]],palette),()=>api.classify([[1],[2,3]],palette),()=>api.classify([[1.5]],palette),()=>api.classify([[1]],{}),()=>api.classify([[1]],{...palette,top:"green"}),()=>api.classify([[1,...Array(1)]],palette),()=>api.classify([...[ [1] ],...Array(1)],palette)];bad.forEach(fn=>assert.throws(fn,{name:"RangeError"}));
assert(Object.isFrozen(full.colored[0].exposed));console.log(JSON.stringify({status:"passed",cubeSizes:cases,cellCrossChecks:Math.pow(36,2)-1,negativeCases:bad.length,sourceGeometryValidated:false}));
