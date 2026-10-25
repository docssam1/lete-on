#!/usr/bin/env node
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
let code=fs.readFileSync(path.join(__dirname,'../data/magazine.js'),'utf8');
const marker='window.NM_MAGAZINE = {';assert(code.includes(marker));
code=code.replace(marker,'window.__mesh=solid();\n'+marker);
const w={};w.window=w;vm.runInNewContext(code,w);
const m=w.__mesh,faces=[...m.pent,...m.hex];
assert.equal(m.icoV.length,12);assert.equal(m.icoF.length,20);assert.equal(m.pts.length,60);assert.equal(m.pent.length,12);assert.equal(m.hex.length,20);
assert(m.pent.every(p=>p.length===5)&&m.hex.every(p=>p.length===6));
const edges=new Map(),lens=[];
for(const f of faces)for(let i=0;i<f.length;i++){const a=f[i],b=f[(i+1)%f.length],key=[a,b].sort((a,b)=>a-b).join(',');edges.set(key,(edges.get(key)||0)+1);lens.push(Math.hypot(...m.pts[a].map((x,j)=>x-m.pts[b][j])));}
assert.equal(edges.size,90);assert([...edges.values()].every(n=>n===2));assert(lens.every(l=>Math.abs(l-2/3)<1e-9));assert.equal(m.pts.length-edges.size+faces.length,2);
// Exact integer recurrence, independent of the illustrative percentage string.
let counts=[0n,2n,0n,0n,0n,0n];for(let toss=1;toss<200;toss++){const next=[0n,counts.reduce((a,b)=>a+b),0n,0n,0n,0n];for(let k=1;k<5;k++)next[k+1]=counts[k];counts=next;}
const p=1-Number(counts.reduce((a,b)=>a+b))/2**200;assert(Math.abs(p-.965312801115764)<1e-14);
const mobius=(u,v)=>[(46+v*Math.cos(u/2))*Math.cos(u),(46+v*Math.cos(u/2))*Math.sin(u),v*Math.sin(u/2)];
assert(Math.hypot(...mobius(0,14).map((x,j)=>x-mobius(4*Math.PI,14)[j]))<1e-9);assert(Math.abs(mobius(0,14)[0]-mobius(2*Math.PI,14)[0])>20);
assert.equal(w.NM_MAGAZINE.articles.length,14);
console.log('MAGAZINE_MODELS_OK convexMesh={vertices:60,edges:90,faces:32,edgeLength:2/3} coinRun200='+p+' mobiusBoundary=true');
