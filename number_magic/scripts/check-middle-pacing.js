#!/usr/bin/env node
'use strict';
/* 데이터 계약/기존 과정 보존/페이지 등록 검사. 시간 적합성은 실제 수업에서 별도 검증. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;
const context=vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
load('data/threads.js');load('data/courses.js');
const before=JSON.stringify(w.NM_COURSES);
load('data/middle-pacing.js');
assert.equal(JSON.stringify(w.NM_COURSES),before,'pacing must not replace legacy courses/sessions');
const data=w.NM_MIDDLE_PACING;
assert.equal(data.weeks,7);assert.equal(data.sessionsPerWeek,2);
assert.deepEqual(Object.keys(data.grades),['1','2','3']);
const ids=new Set(),summary=[];
for(const plan of Object.values(data.grades)){
  assert.equal(plan.semester,1);assert.equal(plan.sessions.length,14);
  const types=new Set(),taught=new Set();let total=0,drawCount=0;
  plan.sessions.forEach((s,i)=>{
    assert(!ids.has(s.id));ids.add(s.id);
    assert.equal(s.week,Math.floor(i/2)+1);assert.equal(s.day,i%2+1);
    assert.equal(data.getSession(plan.grade,s.id),s);
    assert(s.title&&s.blocks.length>=1&&s.blocks.length<=3,s.id+' block count');
    assert.equal(s.minutes,null);assert(s.timeNote.includes('개인차'),'time must not claim a guaranteed short session');
    const seen=new Set();let count=0;
    s.blocks.forEach(b=>{
      assert((b.kind==='drawing'?[6]:[12,24,36]).includes(b.n),s.id+' drill count must be 12/24/36; drawing is 6');count+=b.n;
      if(b.kind==='drawing'){
        assert(['direct','inverse','linear','quadratic'].includes(b.mode));
        assert.equal(b.role,'graph-drawing');assert.equal(b.n,6);drawCount+=b.n;
        assert(!seen.has('draw:'+b.mode));seen.add('draw:'+b.mode);
      }else{
        const th=w.NM_THREADS[b.t];assert(th,s.id+' unknown type '+b.t);
        assert(th.levels.some(l=>l.id===b.lv),s.id+' invalid level '+b.t+'@'+b.lv);
        assert(!seen.has(b.t+'@'+b.lv),s.id+' duplicate type/level');seen.add(b.t+'@'+b.lv);
        assert(['practice','review','check'].includes(b.role));types.add(b.t);
        if(b.role==='review'||b.role==='check') assert(taught.has(b.t+'@'+b.lv),s.id+' cannot hide a new concept as review/check');
        taught.add(b.t+'@'+b.lv);
      }
    });
    assert(count>=30&&count<=60,s.id+' session count');total+=count;
  });
  if(plan.grade===1) assert(plan.sessions[13].checkpoint,'middle1 final repeats previously taught levels');
  else assert(!plan.sessions[13].checkpoint,'middle2/3 final applications are new lessons, not concept-free checks');
  for(const b of plan.supplementary||[]) assert(w.NM_THREADS[b.t].levels.some(l=>l.id===b.lv)&&b.reason,'supplementary type must exist and explain its purpose');
  summary.push({grade:plan.grade,semester:plan.semester,weeks:7,sessions:14,questions:total,drawingQuestions:drawCount,selectedTypes:types.size});
}
assert.equal(data.getSession(9,'missing'),null);
for(const page of ['index.html','drill.html','ws.html']){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  for(const file of ['data/middle-pacing.js','data/graph-drawing.js']){
    assert.equal(html.split('src="'+file+'"').length-1,1,page+' must load '+file+' exactly once');
    assert(html.indexOf('src="'+file+'"')<html.indexOf('src="app/exam.js"'),page+' data must load before exam');
  }
}
console.log(JSON.stringify({ok:true,legacyCoursesUnchanged:true,summary},null,2));
