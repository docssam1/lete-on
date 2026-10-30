"use strict";
const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const practice = require("./source-5-2-u5-page53-mission3-synthetic.js");
const unit = window.HSE_CURRICULUM.semesters.find(s=>s.id==="5-2").units.find(u=>u.id==="5-2-u5");
const type = unit.subunits.flatMap(s=>s.types).find(t=>t.id===practice.id);
assert(type && type.sourceParentItemId === "5-2-u5-e3-mission-3" && !type.reviewLocked);

// Derive opposite faces by folding the net, independently of the generator's pairs.
const neg=v=>v.map(x=>-x), cells=practice.cells, frames=new Map([["1,1",[[1,0,0],[0,1,0],[0,0,1]]]]), queue=[[1,1]];
while(queue.length){const [x,y]=queue.shift(),[r,d,n]=frames.get(`${x},${y}`);
  for(const [dx,dy,basis] of [[1,0,[neg(n),d,r]],[-1,0,[n,d,neg(r)]],[0,1,[r,neg(n),d]],[0,-1,[r,n,neg(d)]]]){
    const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;
    if(cells.some(([a,b])=>a===nx&&b===ny)&&!frames.has(k)){frames.set(k,basis);queue.push([nx,ny]);}
  }
}
assert.equal(frames.size,6);
const normals=cells.map(([x,y])=>frames.get(`${x},${y}`)[2]);
const opposite=[];
for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(normals[i].every((v,k)=>v===-normals[j][k]))opposite.push([i,j]);
assert.deepEqual(opposite,[[0,5],[1,3],[2,4]]);
const gcd=(a,b)=>b?gcd(b,a%b):a;
for(let i=0;i<3;i++){
  const question=window.HSE_GENERATORS.generate(type,1,0,100+i,i);
  assert(question && question.sourceValuesExcluded && question.publisherAnswerVerified===false);
  const values=question.answerModel.values, products=[];
  for(let a of opposite[0])for(let b of opposite[1])for(let c of opposite[2])products.push(values[a]*values[b]*values[c]);
  products.sort((a,b)=>a-b);
  assert.equal(new Set(products).size,8);
  assert.deepEqual(question.answerModel.products,products);
  assert.equal(question.answer,String(gcd(products[1],products[4])));
  assert.match(question.prompt,/<svg/);
  assert.doesNotMatch(question.prompt,/data-source-answer/);
  assert.match(question.solution,/data-source-answer/);
  assert(!values.join(",").includes("2,6,8,12,10,4"));
}
console.log("Grade 5-2 Mission 3 practice: three distinct pools, independently folded net, eight products and GCD checked.");
