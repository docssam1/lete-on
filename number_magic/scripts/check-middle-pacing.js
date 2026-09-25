#!/usr/bin/env node
'use strict';
/* 중등 진도 보기 검사 (2026-09-25 통합판).
   NM_MIDDLE_PACING 은 이제 정규 과정 C29~C37 에서 **계산되는 보기**다(두 번째 편성 금지).
   2026-09-24 판(GPT)의 계약 가운데 편성 자체에 대한 것(학년별 14회·7주·블록 12/24/36)은 정본이 바뀌어
   없앴고, 여전히 옳은 것은 그대로 둔다: 유형·레벨 실존, 한 회차 안 중복 금지, 그리기 4종·6문항,
   복습 블록은 앞에서 배운 것만, 세 페이지가 데이터를 exam.js 보다 먼저 싣는다.
   회차·블록이 정규 과정과 똑같은지는 check-session-roles 의 G 가 한 줄씩 대조한다. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;
const context=vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context,{filename:f});
/* 페이지와 같은 순서 — 보기가 과정보다 먼저 실려도 처음 읽을 때 만들어져야 한다 */
load('data/middle-pacing.js');load('data/threads.js');load('data/wordable.js');load('data/courses.js');
const data=w.NM_MIDDLE_PACING;
assert.equal(data.derivedFrom,'NM_COURSES','보기는 정규 과정에서 계산돼야 한다');
assert.equal(data.sessionsPerWeek,2);
assert.deepEqual(Object.keys(data.grades),['1','2','3']);
const ids=new Set(),summary=[],taught=new Set();
for(const plan of Object.values(data.grades)){
  const reg=plan.courseKeys.reduce((n,k)=>n+w.NM_COURSES[k].sessions.filter(s=>!s.test).length,0);
  assert.equal(plan.sessions.length,reg,`중${plan.grade}: 보기 회차 수 = 정규 과정 회차 수`);
  assert.equal(plan.weeks,Math.ceil(reg/2));
  let total=0,drawCount=0;const modes=new Set();
  plan.sessions.forEach((s,i)=>{
    assert(!ids.has(s.id),s.id+' 중복 번호');ids.add(s.id);
    assert.equal(s.week,Math.floor(i/2)+1);assert.equal(s.day,i%2+1);
    assert.equal(data.getSession(plan.grade,s.id),s);
    assert(s.title&&s.blocks.length>=3,s.id+' 교과·창의·적용 블록');
    assert(s.minutes>=20&&s.minutes<=38,s.id+' 30분 안팎');
    const seen=new Set();let count=0;
    s.blocks.forEach(b=>{
      assert(b.n>0,s.id+' 문항 수');count+=b.n;
      if(b.kind==='drawing'){
        assert(['direct','inverse','linear','quadratic'].includes(b.mode));
        assert.equal(b.role,'graph-drawing');assert.equal(b.n,6);drawCount+=b.n;modes.add(b.mode);
      }else{
        const th=w.NM_THREADS[b.t];assert(th,s.id+' 없는 유형 '+b.t);
        assert(th.levels.some(l=>l.id===b.lv),s.id+' 없는 레벨 '+b.t+'@'+b.lv);
        assert(!seen.has(b.t+'@'+b.lv),s.id+' 같은 유형·레벨 두 번');seen.add(b.t+'@'+b.lv);
        assert(['practice','review','creative','application'].includes(b.role));
        if(b.role==='review') assert([...taught].some(k=>k.startsWith(b.t+'@')),s.id+' 복습 '+b.t+' 는 앞에서 배운 유형이어야 한다');
      }
    });
    s.blocks.forEach(b=>{ if(b.t) taught.add(b.t+'@'+b.lv); });
    total+=count;
  });
  summary.push({grade:plan.grade,courses:plan.courseKeys.join('·'),sessions:plan.sessions.length,weeks:plan.weeks,questions:total,drawingQuestions:drawCount,drawing:[...modes].join(',')});
}
/* 그래프 직접 그리기 네 가지가 모두 정규 과정에 들어 있다 */
const allModes=new Set(Object.values(data.grades).flatMap(p=>p.sessions.flatMap(s=>s.blocks.filter(b=>b.kind==='drawing').map(b=>b.mode))));
['direct','inverse','linear','quadratic'].forEach(m=>assert(allModes.has(m),'그래프 직접 그리기 '+m+' 가 정규 과정에 없다'));
/* 옛 번호는 모두 정규 회차로 */
(data.legacyIds||[]).forEach(id=>assert(data.getSession(+id[1],id),'옛 번호 '+id));
assert.equal(data.getSession(9,'missing'),null);
for(const page of ['index.html','drill.html','ws.html']){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  for(const file of ['data/middle-pacing.js','data/graph-drawing.js']){
    assert.equal(html.split('src="'+file+'"').length-1,1,page+' must load '+file+' exactly once');
    assert(html.indexOf('src="'+file+'"')<html.indexOf('src="app/exam.js"'),page+' data must load before exam');
  }
}
console.log(JSON.stringify({ok:true,derivedFrom:'NM_COURSES',legacyIds:(data.legacyIds||[]).length,summary},null,2));
