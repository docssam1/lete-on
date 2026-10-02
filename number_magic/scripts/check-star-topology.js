#!/usr/bin/env node
/* N-08: check rendered SVG geometry independently of the drawing's line lists. */
'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const ROOT=path.join(__dirname,'..');
const comic=require(path.join(ROOT,'data/story-comics-src/N-08.js'))(require('./comic-helpers.js'));
const hero=fs.readFileSync(path.join(ROOT,'assets/images/story/N-08.svg'),'utf8');
function attrs(tag){return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));}
function inspect(svg,label){
  const nodes=[...svg.matchAll(/<circle\b[^>]*data-star-node="[^>]*>/g)].map(m=>attrs(m[0]));
  const lines=[...svg.matchAll(/<line\b[^>]*data-star-line="[^>]*>/g)].map(m=>attrs(m[0]));
  assert.equal(nodes.length,12,label+': twelve spots');
  assert.equal(lines.length,6,label+': six straight lines');
  const points=nodes.map(n=>[+n.cx,+n.cy]);
  assert.equal(new Set(points.map(p=>p.join(','))).size,12,label+': unique spots');
  const degree=Array(12).fill(0),endpoints=new Set();
  lines.forEach((line,index)=>{
    const a=[+line.x1,+line.y1],b=[+line.x2,+line.y2];
    endpoints.add(a.join(','));endpoints.add(b.join(','));
    const onLine=points.map((p,i)=>({i,cross:(p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]),
      between:(p[0]-a[0])*(p[0]-b[0])+(p[1]-a[1])*(p[1]-b[1])<=0})).filter(v=>Math.abs(v.cross)<1e-8&&v.between);
    assert.equal(onLine.length,4,label+': line '+index+' must pass through four spots');
    onLine.forEach(v=>degree[v.i]++);
  });
  assert.equal(endpoints.size,6,label+': six distinct outer tips');
  assert(degree.every(n=>n===2),label+': each spot must belong to two lines');
  assert([...endpoints].every(p=>points.some(n=>n.join(',')===p)),label+': a spot at every tip');
  const sum=Array.from({length:12},(_,i)=>i+1).reduce((a,b)=>a+b,0);
  assert.equal(sum*2/lines.length,26,label+': common-sum constraint');
  return points.map(p=>p.join(',')).sort().join('|');
}
const reference=inspect(hero,'hero');
comic.panels.slice(0,3).forEach((p,i)=>assert.equal(inspect(p.art,'panel '+(i+1)),reference,'Hero/comic geometry mismatch'));
console.log('PASS N-08: hero + three panels; 12 spots, 6 tips, 6 lines × 4 spots, every spot on 2 lines. No example answer inserted.');
