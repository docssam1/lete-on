'use strict';
const assert=require('node:assert/strict'),base=require('./source-5-2-u5-opposite-products-similar.js'),bank=require('./source-5-2-u5-vertex-impossible-similar.js');
const neg=v=>v.map(x=>-x),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
for(const [index,c] of base.cases.entries()){
 const cells=base.shapes[c.shape].cells,origin=cells[0],frames=new Map([[origin.join(','),[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[origin];
 while(queue.length){const [x,y]=queue.shift(),[r,d,n]=frames.get(`${x},${y}`);for(const [dx,dy,basis] of [[1,0,[neg(n),d,r]],[-1,0,[n,d,neg(r)]],[0,1,[r,neg(n),d]],[0,-1,[r,n,neg(d)]]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(cells.some(([a,b])=>a===nx&&b===ny)&&!frames.has(k)){frames.set(k,basis);queue.push([nx,ny]);}}}
 assert.equal(frames.size,6);const normals=cells.map(([x,y])=>frames.get(`${x},${y}`)[2]),q=bank.build(index),impossible=q.answerModel.options.map((values,i)=>{const v=values.map(n=>normals[c.values.indexOf(n)]);return [i,!(dot(v[0],v[1])===0&&dot(v[0],v[2])===0&&dot(v[1],v[2])===0)];}).filter(([,bad])=>bad).map(([i])=>i);
 assert.deepEqual(impossible,[index]);assert.equal(q.answer,['①','②','③','④'][index]);assert.equal((q.prompt.match(/<svg/g)||[]).length,1);
}
assert.equal(bank.build(4),null);console.log('PASS: 3D-folded face normals independently show exactly one impossible vertex per question');
