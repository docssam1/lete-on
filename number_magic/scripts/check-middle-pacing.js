#!/usr/bin/env node
'use strict';
// Canonical sessions remain intact; only their scheduling view contains 20 bundles.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
['data/middle-pacing.js','data/threads.js','data/wordable.js','data/courses.js','data/high-pacing.js'].forEach(load);
const data=w.NM_MIDDLE_PACING,C=w.NM_COURSES,original=JSON.stringify(Object.values(C).map(c=>c.sessions));
assert.equal(data.derivedFrom,'NM_COURSES');assert.equal(data.version,'20261023-middle25');
const modes=new Set(),summary=[];
for(const plan of Object.values(data.grades)){
 assert.equal(plan.sessions.length,20);assert.equal(plan.weeksStandard,20);assert.equal(plan.weeksAccelerated,10);
 const expected=plan.courseKeys.flatMap(k=>C[k].sessions.map((s,i)=>k+'-'+i)),actual=[];
 for(const [i,s]of plan.sessions.entries()){
  assert(s.bundle&&s.blocks.length&&s.estimatedMinutes>0);assert.equal(s.week,Math.floor(i/2)+1);assert.equal(s.standardWeek,i+1);
  assert.equal(data.getSession(plan.grade,s.id),s);
  for(const source of s.sourceIndices)actual.push(s.course+'-'+source);
  for(const b of s.blocks){
   assert(b.n>0);
   if(b.kind==='drawing'){assert.equal(b.n,6);modes.add(b.mode);}
   else {assert(w.NM_THREADS[b.t],s.id+' '+b.t);assert(w.NM_THREADS[b.t].levels.some(l=>l.id===b.lv));}
  }
 }
 assert.equal(JSON.stringify(actual),JSON.stringify(expected),'source coverage and ordering');
 summary.push({grade:plan.grade,bundles:plan.sessions.length,weeksStandard:plan.weeksStandard,weeksAccelerated:plan.weeksAccelerated,questions:plan.sessions.reduce((n,s)=>n+s.blocks.reduce((n,b)=>n+b.n,0),0)});
}
for(const mode of ['direct','inverse','linear','quadratic'])assert(modes.has(mode));
for(const id of data.legacyIds)assert(data.getSession(+id[1],id),'legacy '+id);
for(const [grade,id]of [[1,'C29-S01'],[1,'C31-S01'],[2,'C32-S01'],[2,'C34-S01'],[3,'C35-S01'],[3,'C37-S01']])assert(!data.getSession(grade,id).bundle,'canonical legacy '+id);
const extra=data.grades[3].sessions.filter(s=>s.extraPractice.length);
assert.equal(extra.length,1);assert.equal(extra[0].course,'C36');assert.deepEqual(JSON.parse(JSON.stringify(extra[0].extraPractice)),[{t:'MD25',lv:1,n:12},{t:'MD25',lv:2,n:12}]);
assert.equal(JSON.stringify(Object.values(C).map(c=>c.sessions)),original,'source sessions immutable');
for(const page of ['index.html','drill.html','ws.html']){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 for(const file of ['data/middle-pacing.js','data/graph-drawing.js','data/high-pacing.js']){
  assert.equal((html.match(new RegExp('src="'+file.replace(/\./g,'\\.')+'(?:[?][^"]*)?"','g'))||[]).length,1,page+' '+file);
  assert(html.indexOf('src="'+file)<html.indexOf('src="app/exam.js'));
 }
}
console.log(JSON.stringify({ok:true,bundles:60,legacyIds:data.legacyIds.length,drawingModes:[...modes],summary},null,2));
