'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-opposite-products-similar.js');
const neg=v=>v.map(x=>-x);
for(const shape of Object.values(bank.shapes)){
 const cells=shape.cells,origin=cells[0],frames=new Map([[origin.join(','),[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[origin];
 while(queue.length){const [x,y]=queue.shift(),[r,d,n]=frames.get(`${x},${y}`);for(const [dx,dy,basis] of [[1,0,[neg(n),d,r]],[-1,0,[n,d,neg(r)]],[0,1,[r,neg(n),d]],[0,-1,[r,n,neg(d)]]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(cells.some(([a,b])=>a===nx&&b===ny)&&!frames.has(k)){frames.set(k,basis);queue.push([nx,ny]);}}}
 assert.equal(frames.size,6);const normals=cells.map(([x,y])=>frames.get(`${x},${y}`)[2]),pairs=[];for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if(normals[i].every((v,k)=>v===-normals[j][k]))pairs.push([i,j]);assert.deepEqual(shape.pairs,pairs);
}
for(const [i,c] of bank.cases.entries()){const products=bank.shapes[c.shape].pairs.map(([a,b])=>c.values[a]*c.values[b]);assert.equal(+bank.build(i).answer,Math.max(...products));assert.equal(new Set(c.values).size,6);}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['56','32','42','72']);assert.equal(bank.build(4),null);console.log('PASS: both nets folded independently in 3D and all opposite-face products checked');
