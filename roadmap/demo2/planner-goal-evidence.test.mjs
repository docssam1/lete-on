import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-learning-evidence.js','planner-goal-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const {PlannerGoalCurriculum:G,PlannerCurriculum:C,PlannerLearningEvidence:E,PlannerIntake:I}=window;
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const base=()=>({grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'mid',schoolBook:'원리해설',schoolExact:'16',schoolStatus:'progress',deepCourse:'mid',deepBook:'A급',deepStage:'15',deepStatus:'progress',calc:'none'});
const state=(goal,values={},shared={})=>G.restore({version:1,...shared,goals:{[goal]:values}});
const lane=(m,id)=>m.lanes.find(l=>l.id===id);
const plain=v=>JSON.parse(JSON.stringify(v));
test('medicine and both science-school goals use actual math progress without an age cutoff or compulsory KMO',()=>{
 for(const goal of Object.keys(G.GOALS)){
  const s=state(goal),a=base(),slow=G.model(a,fields,s,goal),later=G.model({...a,grade:'10'},fields,s,goal);
  assert.equal(lane(slow,'school').blocks[0].stage,'중2-1');
  assert.deepEqual(plain(lane(slow,'school')),plain(lane(later,'school')));
  assert.ok(!slow.lanes.some(l=>l.id==='kmo'));
  const fast=G.model({...a,schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'미적분Ⅰ'},fields,s,goal);
  assert.equal(lane(fast,'school').blocks[0].stage,'미적분Ⅰ');
  assert.ok(!lane(fast,'school').blocks.some(b=>b.stage==='공통수학1'));
 }
 const m=G.model(base(),fields,state('medicine'),'medicine');
 assert.ok(!lane(m,'school').blocks.some(b=>b.stage==='기하'));
 const current=G.model({...base(),schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'기하'},fields,state('medicine'),'medicine');
 assert.equal(lane(current,'school').blocks[0].stage,'기하');
 const optional=G.model(base(),fields,state('medicine',{includeContest:true,extendedMath:true}),'medicine');
 assert.ok(lane(optional,'kmo'));assert.ok(lane(optional,'school').blocks.some(b=>b.stage==='기하'));
});
test('science is independently reported, has exact remaining fractions, and unknown science stays undated',()=>{
 const s=state('scienceHigh',{}, {science:'middle',scienceDone:3,scienceTotal:4});
 const m=G.model(base(),fields,s,'scienceHigh'),first=lane(m,'scienceCore').blocks[0];
 assert.equal(first.start,0);assert.equal(first.end,3.25);
 assert.equal(lane(m,'scienceCore').blocks[1].end-first.end,6,'bridge includes review without a second duplicate cycle');
 const unknown=G.model(base(),fields,state('scienceHigh'),'scienceHigh');
 assert.equal(lane(unknown,'scienceCore').blocks.length,0);
 assert.equal(lane(unknown,'goalPreparation').blocks.length,1,'questions can begin while experiments await science');
 assert.ok(unknown.warnings.some(t=>t.includes('과학은 수학 진도로 추정')));
 const currentHigh=G.model({...base(),schoolCourse:'unknown'},fields,state('giftedSchool',{}, {science:'high',scienceDone:1,scienceTotal:2}),'giftedSchool');
 assert.equal(lane(currentHigh,'scienceCore').blocks[0].end,3,'current science is not rewound by lagging math');
});
test('current preparation skips prior steps, target months never compress prerequisites, and absent targets invent no interview dates',()=>{
 const current=G.model(base(),fields,state('medicine',{prep:'record',prepDone:1,prepTotal:2}, {science:'complete'}),'medicine');
 const b=lane(current,'goalPreparation').blocks;
 assert.equal(b[0].id,'goal-prep-record');assert.equal(b[0].end,1.5);assert.equal(b.length,1);
 const target=G.model(base(),fields,state('medicine',{goalMonth:'2027-01'},{science:'middle'}),'medicine');
 const prep=lane(target,'goalPreparation').blocks,science=lane(target,'scienceCore').blocks;
 assert.ok(prep.find(b=>b.id==='goal-prep-experiment').start>=science[0].end);
 assert.ok(prep.at(-1).end>2);assert.match(prep.at(-1).title,/MMI/);assert.ok(target.warnings.some(t=>t.includes('자동 압축')));
 assert.ok(C.render(target,'map').includes(C.period(target,prep[0])));
 assert.ok(C.render(target,'graph').includes(C.period(target,prep[0])));
 assert.ok(C.render(target,'table').includes('2026년 11월'));
});
test('accepted and enrolled learners connect college mathematics without treating it as high-school calculus',()=>{
 const s=state('giftedSchool',{phase:'accepted',entryMonth:'2026-12'}),m=G.model(base(),fields,s,'giftedSchool');
 const blocks=lane(m,'goalPreparation').blocks,math=lane(m,'school').blocks;
 assert.match(blocks[0].title,/입학 전/);assert.ok(blocks[1].start>=math.find(b=>b.stage==='기하').end);
 assert.ok(m.warnings.some(t=>t.includes('입학 예정월 이후')));
 const current=G.model(base(),fields,state('giftedSchool',{phase:'enrolled',post:'calculus',postDone:3,postTotal:4}),'giftedSchool');
 const b=lane(current,'goalPreparation').blocks;
 assert.equal(b[0].start,0);assert.equal(b[0].end,1.5);assert.match(b[0].title,/대학 수준 미적분학/);
 assert.ok(!b.some(x=>x.id==='goal-post-review'));assert.match(C.detail(current,b[0].id).html,/고등 미적분과 대학/);
});
test('goal state preserves separate preparation, shared science, route and adjustable math periods',()=>{
 const s=state('medicine',{goalMonth:'2028-11',mathPeriods:{midMonths:4}},{science:'bridge',activeRoute:'medicine'});
 const original=JSON.stringify(s),m=G.model(base(),fields,s,'medicine');assert.equal(lane(m,'school').blocks[0].end,4);
 assert.equal(JSON.stringify(s),original);
 const r=G.restore({...s,activeRoute:'contest',goals:{...s.goals,giftedSchool:{phase:'enrolled',post:'linear'}}});
 assert.equal(r.activeRoute,'contest');assert.equal(r.science,'bridge');assert.equal(r.goals.medicine.goalMonth,'2028-11');assert.equal(r.goals.giftedSchool.post,'linear');
 const input={startMonth:'2027-01',science:'middle',scienceStatus:'progress',scienceDone:'1',scienceTotal:'4',language:'middle',prep:'none',prepStatus:'progress',prepDone:'',prepTotal:'',post:'none',postStatus:'progress',postDone:'',postTotal:'',...Object.fromEntries(G.periodKeys.map(([k,,n])=>[k,n])),...Object.fromEntries(C.PERIODS.slice(0,5).map(([k])=>['math-'+k,3]))};
 const updated=G.update(r,'medicine',input);assert.equal(updated.errors.length,0);assert.equal(updated.state.scienceDone,1);
 assert.ok(G.update(r,'medicine',{...input,scienceDone:'4'}).errors.length);
 assert.ok(G.update(r,'medicine',{...input,'math-midMonths':0}).errors.length);
});
test('concept observations are whitelisted, never mastery scores, and selected weaknesses add an independent review lane',()=>{
 assert.equal(new Set(E.TOPICS.map(t=>t.id)).size,E.TOPICS.length);
 const id=E.TOPICS[0].id,initial=E.restore(null),s=E.choose(initial,id,'review');
 assert.equal(E.summary(s).counts.review,1);assert.equal(E.summary(initial).recorded,0);
 const rejected=E.restore({version:1,concepts:{bad:'independent',[id]:'score100'}});assert.equal(E.summary(rejected).recorded,0);
 const m=C.model(base(),fields),withReview=E.attachReviews(m,{...s,reviewMonths:2});
 assert.equal(lane(withReview,'conceptReview').blocks[0].end,2);
 assert.deepEqual(plain(lane(withReview,'school')),plain(lane(m,'school')));
 assert.deepEqual(plain(lane(withReview,'kmo')),plain(lane(m,'kmo')));
 assert.match(E.render(s),/테스트 점수나 자동 승급 판정이 아닙니다/);
});
test('manual performance is real completed over planned, grouped by identical units and month, without fabricated test results',()=>{
 const course='중2-1 원리해설',input={course,month:'2026-11',unit:'session',planned:'20',completed:'15'};
 const r=E.saveWork(null,input,[course]);assert.equal(r.error,null);assert.equal(E.workSummary(r.state,'2026-11')[0].percent,75);
 const s=E.saveWork(r.state,{...input,unit:'page',planned:'100',completed:'40'},[course]).state;
 assert.equal(E.workSummary(s,'2026-11').length,2);assert.equal(E.workSummary(s,'2026-12').length,0);
 assert.equal(s.workMonth,'2026-11');assert.ok(E.saveWork(s,{...input,planned:'0'},[course]).error);
 assert.ok(E.saveWork(s,{...input,course:'unknown'},[course]).error);
 assert.match(E.renderWork(s,[course],'2026-11'),/연동 준비 중/);assert.match(E.renderWork(s,[course],'2026-11'),/75%/);
 assert.equal(E.workSummary(E.saveWork(s,{...input,completed:'25'},[course]).state,'2026-11').find(x=>x.unit==='session').percent,125);
});
