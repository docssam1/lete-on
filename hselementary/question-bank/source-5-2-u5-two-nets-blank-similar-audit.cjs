'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-two-nets-blank-similar.js');
const neg=v=>v.map(x=>-x),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function fold(cells){const origin=cells[0],frames=new Map([[origin.join(','),[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[origin];while(queue.length){const [x,y]=queue.shift(),[r,d,n]=frames.get(`${x},${y}`);for(const [dx,dy,basis] of [[1,0,[neg(n),d,r]],[-1,0,[n,d,neg(r)]],[0,1,[r,neg(n),d]],[0,-1,[r,n,neg(d)]]]){const nx=x+dx,ny=y+dy,k=`${nx},${ny}`;if(cells.some(([a,b])=>a===nx&&b===ny)&&!frames.has(k)){frames.set(k,basis);queue.push([nx,ny]);}}}assert.equal(frames.size,6);return cells.map(([x,y])=>frames.get(`${x},${y}`)[2]);}
const first=fold(bank.firstCells),second=fold(bank.secondCells),axes=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],rotations=[];
for(const ex of axes)for(const ey of axes)if(dot(ex,ey)===0)rotations.push([ex,ey,cross(ex,ey)]);assert.equal(rotations.length,24);
for(const [index,values] of bank.cases.entries()){
 const candidates=[];for(const [ex,ey,ez] of rotations){const rotated=first.map(v=>v.map((_,i)=>v[0]*ex[i]+v[1]*ey[i]+v[2]*ez[i])),placed=second.map(n=>{const i=rotated.findIndex(r=>r.every((x,j)=>x===n[j]));return values[i];});if(placed[0]===values[4]&&placed[4]===values[0])candidates.push(placed);}
 assert(candidates.length>0);assert.deepEqual([...new Set(candidates.map(x=>x[2]))],[values[1]]);assert.equal(bank.build(index).answer,String(values[1]));
}
assert.equal(bank.build(4),null);console.log('PASS: independently folded both nets and checked all 24 cube rotations for each blank');
