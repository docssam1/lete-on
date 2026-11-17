#!/usr/bin/env node
/* ============================================================
   8세 이하 소마·필즈 비교 그래프 검사기 — 2026-11-17
   data/academy-arith-lines.js · app/academy-compare.js 를 지킨다.
     1. 수의 마법 과정 → 연산 학년(courseEnd)이 기적의 계산법 단계표(data/consult-ladder.js)와 맞다:
        초등 N권의 새 계산이 모두 나온 과정(앞 권까지 누적 최댓값)의 끝 = N+1권 시작.
     2. 과정별 연산 학년은 C0 → C24 로 줄지 않는다(0.5 → 7).
     3. 학원 줄은 달이 앞으로만 가고 학년이 줄지 않는다. 계산 줄(shift)은 원표 줄을 정확히 그만큼 민 것이다.
     4. 그래프는 8세 이하(5·6·7세·초1)에만 붙는다.
     5. 주 2회는 주 1회보다 초등 연산을 먼저 끝낸다(앱 일정 계산 그대로).
   실패가 있으면 exit 1.
   ============================================================ */
'use strict';
const assert=require('node:assert/strict');
global.window=global;
require('../data/threads.js');require('../data/courses.js');require('../data/high-pacing.js');
require('../data/consult-ladder.js');require('../data/academy-arith-lines.js');
global.NM_LEARNING_PLAN=require('../app/learning-plan.js');
const A=require('../app/academy-compare.js'),D=window.NM_ACADEMY_LINES,R=require('../app/diagnostic-roadmap.js');

/* 1. 단계표와 맞추기 */
const steps=window.NM_CONSULT_LADDER.ladders.miracle.filter(s=>s.group==='elem-2021').sort((a,b)=>a.volume-b.volume);
assert.equal(steps.length,12,'기적의 계산법 초등 12권');
let run=0;const expect={};
for(const s of steps){run=Math.max(run,...s.skills.map(k=>+k.course.slice(1)));const lv=1+s.volume/2;/* N권까지 다 만남 = N+1권 시작 */
  expect['C'+run]=Math.max(expect['C'+run]||0,lv);}
for(const [k,v] of Object.entries(expect))assert.equal(D.courseEnd[k],v,'과정 '+k+' 끝의 연산 학년이 단계표와 다름: '+D.courseEnd[k]+' ≠ '+v);
assert.equal(D.courseEnd.C0,1,'C0 끝 = 1학년 시작');

/* 2. 과정별 연산 학년 */
const T=A.courseLevels();let prev=D.startLevel;
for(let n=0;n<=24;n++){const r=T['C'+n];assert.ok(r,'C'+n+' 없음');assert.ok(r.start>=prev-1e-9&&r.end>=r.start,'C'+n+' 학년이 줄어듦');prev=r.end;}
assert.equal(+T.C24.end.toFixed(6),7);

/* 3. 학원 줄 */
const byId=Object.fromEntries(D.classes.map(c=>[c.id,c]));
for(const c of D.classes){
  c.points.forEach((p,i)=>{if(i){assert.ok(p[0]>c.points[i-1][0],c.id+' 달 순서');assert.ok(p[1]>=c.points[i-1][1],c.id+' 학년이 줄어듦');}assert.ok(p[2]&&p[2].ko&&p[2].en&&p[2].zh,c.id+' 책 이름 3언어');});
  assert.ok(c.end>=c.points[c.points.length-1][0],c.id+' 끝 달');
  assert.ok(['table','shift'].includes(c.source));
}
const same=(a,b,d)=>a.points.forEach((p,i)=>{assert.equal(p[0],b.points[i][0]+d);assert.equal(p[1],b.points[i][1]);});
same(byId['fields-s'],byId['fields-e1'],-3);same(byId['fields-e2'],byId['fields-e1'],2);
same(byId['soma-premier'],byId['soma-challenge'],-3);same(byId['soma-b'],byId['soma-a'],2);

/* 4. 나이 */
for(const lv of R.levels)assert.equal(A.eligible(lv),['a5','a6','a7','e1'].includes(lv),lv);

/* 5. 주 1회 / 주 2회 */
const now='2026-11-17T03:00:00Z',prof=R.fromLevel('a7',now);
const plan=c=>window.NM_LEARNING_PLAN.project(window.NM_COURSES,{courseKey:'C5',sessionIndex:4,cadence:c,speed:1,pace:'p2',entryYear:prof.entryYear,birthYear:prof.birthYear,startDate:'2026-11-17'},{months:36,now});
const end=c=>plan(c).milestones.find(m=>m.key==='C24').date;
assert.ok(end('w2')<end('w1'),'주 2회가 더 빨라야 함');

console.log('ACADEMY_COMPARE_OK classes='+D.classes.length+' courseEnd='+Object.keys(D.courseEnd).length+' C24(w1)='+end('w1')+' C24(w2)='+end('w2'));
