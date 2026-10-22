'use strict';
const assert=require('node:assert/strict');
global.window={};require('../data/threads.js');const {NM_COURSES:c}=require('../data/courses.js');
const plan=require('../app/learning-plan.js');
const before=JSON.stringify(c),s={courseKey:'C1',sessionIndex:2,speed:1,amount:1,cadence:'w1',entryYear:2028,startDate:'2026-10-21'};
const p=plan.project(c,s,{months:18,now:new Date('2026-10-21T00:00:00Z')});
assert.equal(p.rows.length,18);assert.equal(p.rows[0].month,'2026-10');assert.equal(p.rows[0].schoolLabel,'6세 10월');
assert.equal(p.rows.find(r=>r.month==='2027-03').schoolLabel,'7세 3월');
assert.equal(p.rows.find(r=>r.month==='2028-03').schoolLabel,'초1 3월');
assert(p.rows[0].sessionLabels[0].startsWith('2–'));
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
