'use strict';
const assert=require('node:assert/strict');
global.window={};require('../data/threads.js');const {NM_COURSES:c}=require('../data/courses.js');
const plan=require('../app/learning-plan.js');
const before=JSON.stringify(c),s={courseKey:'C1',sessionIndex:2,speed:1,amount:1,cadence:'w1',entryYear:2028,startDate:'2026-10-21'};
const p=plan.project(c,s,{months:18,now:new Date('2026-10-21T00:00:00Z')});
assert.equal(p.rows.length,18);assert.equal(p.rows[0].month,'2026-10');assert.equal(p.rows[0].schoolLabel,'6세 10월');
assert.equal(p.rows.find(r=>r.month==='2027-03').schoolLabel,'7세 3월');
assert.equal(p.rows.find(r=>r.month==='2028-03').schoolLabel,'초1 3월');
assert(/^2(–|\D)/.test(p.rows[0].sessionLabels[0]));
assert.equal(plan.schoolLabel(2027,new Date('2027-02-01T00:00Z'),'ko'),'8세 2월');
assert.equal(plan.schoolLabel(2027,new Date('2027-03-01T00:00Z'),'ko'),'초1 3월');
assert.equal(plan.schoolLabel(null,new Date('2027-03-01T00:00Z'),'ko'),'학년 입력 필요');
for(const lang of ['ko','en','zh']){
 const rows=plan.project(c,s,{months:12,lang,now:new Date('2026-10-21T00:00Z')}).rows;
 assert(rows.every(r=>r.schoolLabel&&r.courseKeys.length===r.sessionLabels.length));
 assert(plan.recommend(c,s,{lang}).sources.every(x=>/^https:\/\//.test(x.url)));
}
const slow=plan.project(c,{...s,speed:0.7},{months:12,now:new Date('2026-10-21T00:00Z')});
const fast=plan.project(c,{...s,speed:1.5,cadence:'w2'},{months:12,now:new Date('2026-10-21T00:00Z')});
const last=p=>Math.max(...p.rows.flatMap(r=>r.courseKeys.map(k=>+k.slice(1))));
assert(last(fast)>last(slow));
assert.equal(JSON.stringify(c),before,'projection cannot change content or completed records');
assert.throws(()=>plan.project(c,{...s,courseKey:'C999'}));
assert.throws(()=>plan.project(c,{...s,startDate:'2026-02-30'}));
console.log('LEARNING_PLAN_OK calendar/grade boundaries, partial sessions, speed/frequency, 3 languages, source links and immutability');
/* 월별 회차 표시(2026-11-01): 한 회차가 두 달에 걸쳐도 이전 달 끝 번호와 다음 달 첫 번호가 겹쳐 나오지 않고,
   과정의 회차 수를 넘지 않으며, 한 과정을 시작부터 끝까지 이으면 1..N 이 빠짐없이 한 번씩 나온다. */
(function(){
  const cs={courseKey:'C17',sessionIndex:1,speed:1,amount:1,cadence:'w1',pace:'p2',entryYear:2025,startDate:'2026-11-01'};
  const q=plan.project(c,cs,{months:36,now:new Date('2026-11-01T00:00:00Z')});
  const seen={};
  q.rows.forEach(r=>r.courseKeys.forEach((k,i)=>{
    const m=/^(\d+)(?:–(\d+))?/.exec(r.sessionLabels[i]);assert(m,'label '+r.sessionLabels[i]);
    const a=+m[1],b=+(m[2]||m[1]),n=c[k].sessions.length;
    assert(a>=1&&b>=a&&b<=n,k+' range '+a+'-'+b+' of '+n);
    (seen[k]=seen[k]||[]).push([a,b,/이어서 마무리$/.test(r.sessionLabels[i])]);
  }));
  Object.keys(seen).forEach(k=>{
    const n=c[k].sessions.length,rows=seen[k];
    /* 새로 시작하는 회차는 이전 달과 겹치지 않는다. 다만 한 회차를 달 끝에 시작해 다음 달에 마무리하는 달은 그 한 회차만 되풀이된다(이어서 하는 중). */
    for(let i=1;i<rows.length;i++){const [a,b]=rows[i],prev=rows[i-1][1];const carry=rows[i][2];assert(a>prev||(carry&&a===b&&a===prev),k+' rows overlap: ');assert(!carry||a===prev,k+' carry label without a carried session: '+JSON.stringify(rows.slice(i-1,i+1)));}
    if(rows[0][0]===1&&rows[rows.length-1][1]===n){
      const covered=new Set();rows.forEach(([a,b])=>{for(let x=a;x<=b;x++)covered.add(x);});
      assert.equal(covered.size,n,k+' skipped a session');
    }
  });
})();

(()=>{ /* 전 과정 · 두 횟수 · 세 속도: 지난달 번호를 다시 쓰는 달은 반드시 「이어서 마무리」로 적는다(2026-11-02 검수 C0 3월 16–19 · 4월 19) */
  let carries=0;
  for(const key of Object.keys(c))for(const cadence of ['w1','w2'])for(const speed of [0.7,1,1.5]){
    const r=plan.project(c,{courseKey:key,sessionIndex:1,pace:'p2',speed,cadence,entryYear:2030,startDate:'2026-11-02'},{months:24,now:new Date('2026-11-02T00:00:00Z'),lang:'ko'});
    const last={};
    r.rows.forEach(row=>row.courseKeys.forEach((k,i)=>{const L=row.sessionLabels[i],m=/^(\d+)(?:–(\d+))?/.exec(L);if(!m)return;const a=+m[1],b=+(m[2]||m[1]),carry=/이어서 마무리$/.test(L);
      if(last[k]!=null&&a<=last[k]){assert(carry&&a===b&&a===last[k],key+'/'+cadence+'/'+speed+' '+k+' '+row.month+' repeats without carry label: '+L);carries++;}
      else assert(!carry,key+' '+k+' '+row.month+' carry label on a new session: '+L);
      last[k]=b;}));
  }
  assert(carries>0,'carry case exercised');
})();
