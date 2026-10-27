#!/usr/bin/env node
'use strict';
/* 실제 앱의 다음 과정 선택 함수를 작은 학습 기록으로 실행한다. 학생 저장소는 건드리지 않는다. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app/main.js'),'utf8');
const begin=source.indexOf('function nextCourseUnit(allowedIds){');
const end=source.indexOf('\nfunction enterRoadUnit(',begin);
assert(begin>=0&&end>begin,'nextCourseUnit source is present');
const nextSource=source.slice(begin,end);
const stagesStart=source.indexOf('const ROAD_COGNITIVE_STAGES=[');
const stagesEnd=source.indexOf('\nfunction roadTierInfo(',stagesStart);
assert(stagesStart>=0&&stagesEnd>stagesStart,'cognitive stage source is present');
const stageRows=vm.runInNewContext(source.slice(stagesStart,stagesEnd)+'\nROAD_COGNITIVE_STAGES');
for(let n=0;n<=25;n++)assert.equal(stageRows.filter(s=>n>=s.from&&n<=s.to).length,1,'course '+n+' belongs to exactly one stage');
assert.equal(stageRows.find(s=>4>=s.from&&4<=s.to)?.key,'groups','times tables get their own step');
assert.equal(stageRows.find(s=>5>=s.from&&5<=s.to)?.key,'place','three-digit carrying follows times tables');
const courses={
  C0:{sessions:[{magic:['N-01']},{magic:['N-02']}]},
  C4:{sessions:[{magic:['B-01']},{magic:['B-02']}]},
  C5:{sessions:[{magic:['A-16']}]}
};
function next({placement=null,recent=null,plan=null,admin=null,done=[],allowed=null}={}){
  const S={placement,learningPlan:plan,adminPlan:admin};
  const context={S,NM_COURSES:courses,
    UNITS:Object.fromEntries(['N-01','N-02','B-01','B-02','A-16'].map(id=>[id,{}])),
    mostRecentTouchedUnit:()=>recent,
    currentCourseKey:()=>admin?.courseKey||plan?.courseKey||(recent?'C0':'C1'),
    roadCourseList:()=>Object.entries(courses).map(([key,c])=>({key,num:Number(key.slice(1)),c})),
    stepDone:uid=>done.includes(uid)
  };
  vm.createContext(context);
  return vm.runInContext(nextSource+'\nnextCourseUnit(allowedIds)',Object.assign(context,{allowedIds:allowed?new Set(allowed):undefined}));
}
assert.equal(next().key,'C0','new learner starts at preschool course, not default C1');
assert.equal(next({placement:{course:'C4'},recent:'N-01'}).key,'C4','chosen start outranks exploratory history');
assert.equal(next({placement:{course:'C4'},done:['B-01']}).uid,'B-02','continue within the same course');
assert.equal(next({placement:{course:'C4'},done:['B-01','B-02']}).key,'C5','times tables precede three-digit carrying');
assert.equal(next({placement:{course:'C4'},admin:{courseKey:'C5'}}).key,'C5','academy plan keeps its assigned starting point');
assert.equal(next({placement:{course:'C4'},allowed:['A-16']}).key,'C5','story-only filter follows course order');
console.log('통과 — C0~25 단계 겹침0, 신규 C0, 선택 C4, 구구단 완료 후 C5, 학원 지정과 이야기 필터');
