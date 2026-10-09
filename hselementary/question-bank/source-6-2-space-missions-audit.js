"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
for (const name of ["source-inventory-4-1.js", "source-inventory-grade6.js", "curriculum.js", "generators.js", "source-6-2-height-views.js"]) require(`./${name}`);
const api = window.HSE_GENERATORS;
const ids = ["6-2-u3-e1-mission-2", "6-2-u3-e1-mission-4"];
function figures(html) { return [...html.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)].map(m=>m[1]); }
function dimensions(body) {
  const lines = [...body.matchAll(/<line class="height-grid" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)];
  const xs = [...new Set(lines.filter(m=>m[1]===m[3]).map(m=>+m[1]))].sort((a,b)=>a-b);
  const ys = [...new Set(lines.filter(m=>m[2]===m[4]).map(m=>+m[2]))].sort((a,b)=>a-b);
  assert(xs.length>1 && ys.length>1);
  return {xs,ys};
}
function sixFaces(h) {
  const cubes = h.flatMap((row,y)=>row.flatMap((n,x)=>Array.from({length:n},(_,z)=>[x,y,z])));
  const occupied = new Set(cubes.map(c=>c.join(",")));
  return cubes.reduce((s,[x,y,z])=>s+[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].filter(([dx,dy,dz])=>!occupied.has([x+dx,y+dy,z+dz].join(","))).length,0);
}
function frontFromCubes(h) {
  const seen = h[0].map(()=>new Set());
  h.forEach(row=>row.forEach((n,x)=>{ for(let z=0;z<n;z++) seen[x].add(z); }));
  return seen.map(s=>s.size);
}
function profileHeights(body) {
  const {xs} = dimensions(body), values = Array(xs.length-1).fill(0);
  for (const [,x] of body.matchAll(/<rect class="height-answer-cell"[^>]* x="([\d.]+)"/g)) {
    const index = xs.indexOf(+x); assert(index>=0 && index<values.length); values[index]++;
  }
  return values;
}
function readFootprint(body) {
  const {xs,ys}=dimensions(body), h=Array.from({length:ys.length-1},()=>Array(xs.length-1).fill(0)), givens=[];
  for (const [,y,x,px,py] of body.matchAll(/<rect class="height-answer-cell height-footprint-cell" data-owner-id="floor-(\d+)-(\d+)" x="([\d.]+)" y="([\d.]+)"/g)) {
    assert.equal(xs[+x],+px); assert.equal(ys[+y],+py); h[+y][+x]=1;
  }
  for (const [,y,x,v] of body.matchAll(/<text[^>]*data-owner-id="given-(\d+)-(\d+)"[^>]*>(\d+)<\/text>/g)) givens.push([+y,+x,+v]);
  return {h,givens};
}
function enumerateFront(footprint,right,count,givens=[]) {
  const caps=[...right].reverse(), cells=[], h=footprint.map(row=>row.map(()=>0)), answers=[];
  footprint.forEach((row,y)=>row.forEach((v,x)=>{if(v)cells.push([y,x]);}));
  function walk(i,used) {
    if (used>count) return;
    if (i===cells.length) {
      if (used===count && h.every((row,y)=>Math.max(...row)===caps[y])) answers.push(h.map(r=>[...r]));
      return;
    }
    const [y,x]=cells[i], given=givens.find(g=>g[0]===y&&g[1]===x);
    for(let n=1;n<=caps[y];n++) if(!given || given[2]===n) { h[y][x]=n; walk(i+1,used+n); }
    h[y][x]=0;
  }
  walk(0,0); return answers;
}
function readBlankChart(body) {
  const {xs,ys}=dimensions(body), h=Array.from({length:ys.length-1},()=>Array(xs.length-1).fill(0)), blanks=[];
  for(const [,y,x,v] of body.matchAll(/<text[^>]*data-owner-id="cell-(\d+)-(\d+)"[^>]*>([^<]+)<\/text>/g)) {
    if(v==="□") blanks.push([+y,+x]); else h[+y][+x]=+v;
  }
  return {h,blanks};
}
function verify(id,q) {
  const f=figures(q.prompt);
  assert(!/data-model|data-stack-heights|data-answer-source|data-phase="answer"/.test(q.prompt));
  if(id.endsWith("mission-2")) {
    assert.equal(f.length,3);
    const {h,givens}=readFootprint(f[0]), right=profileHeights(f[1]);
    assert.equal(profileHeights(f[2]).reduce((s,n)=>s+n,0),0,"Question answer grid must be empty");
    let count;
    if(q.prompt.includes("바닥에 한 층")) count=h.flat().filter(Boolean).length + +q.prompt.match(/그 위에 (\d+)개를 더/)[1];
    else count=+q.prompt.match(/모두 (\d+)개입니다/)[1];
    const models=enumerateFront(h,right,count,givens);
    assert.equal(models.length,1,"Source and these fixed variants require one stack, not only one front view");
    const expected=frontFromCubes(models[0]);
    assert.equal(q.answer,"그림 참조");
    assert.deepEqual(profileHeights(figures(q.answerVisual)[0]),expected);
    const caps=[...right].reverse(), terms=h.map((row,y)=>`${row.filter(Boolean).length}×${caps[y]}`).join("+");
    assert(q.solution.includes(`${terms}=${count}</span>개`),"Solution count must follow the supplied footprint and right view");
    if(givens.length) {
      const maximum=h.reduce((s,row,y)=>s+row.filter(Boolean).length*caps[y],0), before=[], after=[];
      for(let n=h.flat().filter(Boolean).length;n<=maximum;n++) { before.push(...enumerateFront(h,right,n)); after.push(...enumerateFront(h,right,n,givens)); }
      assert(after.length<before.length,"Easier scaffold must eliminate some view-compatible arrangements before the total is applied");
    }
    return {count,models:models.length,expected,heights:models[0]};
  }
  assert.equal(f.length,1); assert(q.prompt.includes("바닥에 닿는 면도 포함"));
  const {h,blanks}=readBlankChart(f[0]); assert.equal(blanks.length,2);
  const edge=q.prompt.match(/한 모서리의 길이는 (\d+)cm/);
  const unitArea=edge ? +edge[1]*+edge[1] : +q.prompt.match(/한 면의 넓이는 <span class="math-inline-expression">(\d+)cm²/)[1];
  const target=+q.prompt.match(/넓이가 <span class="math-inline-expression">(\d+)cm²/)[1]/unitArea;
  assert(Number.isInteger(target));
  const given=q.prompt.match(/아래쪽 □에 들어갈 수는 (\d+)/), models=[];
  // Opposing exposed vertical directions bound any column height by target/2.
  for(let a=1;a<=target/2;a++) for(let b=1;b<=target/2;b++) {
    if(given && b!==+given[1]) continue;
    const k=h.map(r=>[...r]); k[blanks[0][0]][blanks[0][1]]=a; k[blanks[1][0]][blanks[1][1]]=b;
    if(sixFaces(k)===target) models.push({h:k,answer:a+b});
  }
  assert.equal(models.length,1,"These fixed sum conditions must determine both blank heights");
  assert.equal(q.answer,String(models[0].answer));
  const solved=readBlankChart(figures(q.answerVisual)[0]);
  assert.equal(solved.blanks.length,0); assert.deepEqual(solved.h,models[0].h);
  assert(q.solution.includes(`<span class="math-inline-expression">${models[0].h[0][1]}+1=${models[0].answer}</span>`));
  assert(q.solution.includes(`(${target}-30)÷4+2=${models[0].h[0][1]}`));
  assert.equal(target%4,2);
  return {target,unitArea,models:models.length,expected:models[0].answer,heights:models[0].h};
}
let conditions=0, negatives=0; const results=[];
for(const id of ids) {
  const type=window.HSE_SOURCE_INVENTORY_GRADE6.items.find(t=>t.sourceItemId===id);
  assert(!type.reviewLocked); assert.equal(api.generate({...type,reviewLocked:true},0,0,1),null);
  for(const offset of [-1,0,1]) for(let variant=0;variant<3;variant++) {
    const q=api.generate(type,0,offset,1,variant), result=verify(id,q);
    const poisoned={...q,model:{wrong:true},answer:"wrong"}; assert.throws(()=>verify(id,poisoned)); negatives++;
    assert.deepEqual(verify(id,{...q,model:{wrong:true}}),result,"Independent calculation must ignore producer model");
    if(id.endsWith("mission-4")) { assert.throws(()=>verify(id,{...q,prompt:q.prompt.replace(/(넓이가 <span class="math-inline-expression">)(\d+)/,(_,p,n)=>p+(+n+1))})); negatives++; }
    assert.equal(api.generate(type,0,offset,1,variant+3).prompt,q.prompt);
    assert.equal(api.generate(type,0,offset,1,Number.MAX_SAFE_INTEGER).prompt,api.generate(type,0,offset,1,Number.MAX_SAFE_INTEGER%3).prompt);
    if(offset===0 && variant===0) assert.deepEqual(result.heights,id.endsWith("mission-2") ? [[1,1,0,0],[3,3,3,0],[0,2,0,0],[0,1,1,1]] : [[1,3,2],[1,2,2]]);
    results.push({id,offset,variant,...result}); conditions++;
  }
  for(const bad of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]) { assert.throws(()=>api.generate(type,0,0,1,bad)); negatives++; }
  for(const bad of [-2,2,"0",NaN]) { assert.throws(()=>api.generate(type,0,bad,1,0)); negatives++; }
}
const original=[[1,1,0,0],[1,1,1,0],[0,1,0,0],[0,1,1,1]], right=[1,2,3,1];
const withoutTotal=[];for(let n=9;n<=16;n++) withoutTotal.push(...enumerateFront(original,right,n));
assert.equal(withoutTotal.length,19);assert.equal(new Set(withoutTotal.map(h=>frontFromCubes(h).join(","))).size,14);
assert.equal(enumerateFront(original,[...right].reverse(),16).length,0);
const zeroAllowed=[];for(let a=0;a<=17;a++)for(let b=0;b<=17;b++)if(sixFaces([[1,a,2],[b,2,2]])===34)zeroAllowed.push([a,b]);
assert.deepEqual(zeroAllowed,[[3,1]]);
// Check the elementary remainder explanation independently over the full bound.
for(let a=1;a<=21;a++) for(let b=1;b<=21;b++) {
  const area=sixFaces([[1,a,2],[b,2,2]]);
  if(b>=2) assert.equal(area%4,0);
  else assert.equal(area,a<=2 ? 30 : 30+4*(a-2));
}
if(process.env.HSE_SPACE_AUDIT_OUTPUT){assert(/^[EG]:[/\\]/i.test(process.env.HSE_SPACE_AUDIT_OUTPUT));fs.writeFileSync(process.env.HSE_SPACE_AUDIT_OUTPUT,JSON.stringify({conditions,negatives,results,missingTotalModels:19,missingTotalFrontAnswers:14,zeroAllowed},null,2));}
console.log(`Space missions: ${conditions} prompt-derived exhaustive conditions, ${negatives} rejected answers/conditions/inputs; original missing-total ambiguity and zero-allowed surface enumeration checked.`);
