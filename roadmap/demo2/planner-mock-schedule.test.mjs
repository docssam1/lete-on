import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-mock-schedule.js','planner-learning-evidence.js','planner-goal-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const {PlannerMockSchedule:S,PlannerMockEvidence:E,PlannerLearningEvidence:L,PlannerCurriculum:C,PlannerGoalCurriculum:G,PlannerStandard:T,PlannerIntake:I}=window;
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const a=(stage='中')=>({grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:stage==='中'?'mid':'high',schoolBook:stage==='中'?'원리해설':'개념원리 고등',schoolExact:'16',schoolHigh:stage==='中'?undefined:stage,schoolStatus:'progress',deepCourse:'mid',deepBook:'A급',deepStage:'15',deepStatus:'progress',calc:'none'});
const plain=v=>JSON.parse(JSON.stringify(v));
const plan=(answers=a(),state)=>S.attach(C.model(answers,fields),answers,fields,state);
const row=(m,id)=>m.mockCheckPlan.rows.find(p=>p.id===id);
const input=(extra={})=>({enabled:'on',spacing:'1',boundary:'',...extra});
test('verified 2026 scopes identify real paper year, grade and month; no invented November assessment',()=>{
 assert.equal(S.PAPERS.length,8);assert.deepEqual(plain(S.PAPERS.map(p=>p.month)),[3,6,9,10,3,6,9,10]);assert.ok(S.PAPERS.every(p=>p.year===2026));
 assert.match(S.PAPERS.find(p=>p.id==='h1-06').scope,/방정식·부등식/);assert.match(S.PAPERS.find(p=>p.id==='h2-09').scope,/함수의 극한/);assert.match(S.PAPERS.find(p=>p.id==='h2-10').scope,/미분계수/);
 assert.ok(S.PAPERS.every(p=>p.source.includes('go.kr')));
});
test('slow and fast learners start from actual course, not age, and middle test waits for both reported math and depth',()=>{
 const slow=plan(),mature=S.attach(C.model({...a(),grade:'10'},fields),{...a(),grade:'10'},fields);
 assert.equal(row(slow,'h1-03').start,row(mature,'h1-03').start);
 const original=C.model(a(),fields),school=original.lanes.find(l=>l.id==='school').blocks.find(b=>b.stage==='중3-2').end,deep=original.lanes.find(l=>l.id==='deep').blocks.find(b=>b.stage==='중3-2').end;
 assert.equal(row(slow,'h1-03').start,Math.ceil(Math.max(school,deep)));
 const fast=plan(a('대수'));assert.equal(row(fast,'h2-03').start,0);assert.equal(row(fast,'h1-03').start,null);
 assert.ok(row(fast,'h2-06').start>=6);assert.ok(row(fast,'h2-10').start>=12);
});
test('book completion fraction changes finish dates without fabricating unit mastery',()=>{
 const answers=a('공통수학1');answers.schoolProgress={course:I.progressCourse(answers,'schoolStatus'),unit:'session',done:3,total:4};
 const m=plan(answers);assert.equal(row(m,'h1-06').ready,2);assert.notEqual(row(m,'h1-06').start,0);
 const next=plan(answers,S.update(null,input({boundary:'c1-equations'}),answers).state);assert.equal(row(next,'h1-06').start,0);assert.equal(row(next,'h1-09').ready,2);
 const old=S.update(null,input({boundary:'c1-all'}),answers).state,changed=plan(a('공통수학2'),old);
 assert.equal(changed.mockCheckPlan.boundary,null,'old unit evidence is tied to its exact current course');
});
test('explicit trigonometry and limit readiness select higher grade papers immediately',()=>{
 const algebra=a('대수'),u=S.update(null,input({boundary:'alg-trig'}),algebra);assert.equal(u.errors.length,0);assert.equal(row(plan(algebra,u.state),'h2-06').start,0);
 const calc=a('미적분Ⅰ'),c=S.update(null,input({boundary:'cal-limit'}),calc).state,m=plan(calc,c);
 assert.equal(row(m,'h2-09').start,0);assert.ok(row(m,'h2-10').start>=6);assert.equal(row(m,'h2-03').start,null);
 assert.ok(S.update(c,input({boundary:'alg-trig'}),calc).errors.length);
});
test('standard high-school current course receives its own actual remaining calendar; unavailable or clipped endings stay undated',()=>{
 const answers=a('공통수학1'),standard=T.model(answers,fields),current=standard.lanes.find(l=>l.id==='school').blocks[0];assert.equal(current.stage,'공통수학1');assert.equal(current.end,6);
 const m=S.attach({year:2026,month:11,lanes:standard.lanes,horizon:24,warnings:[]},answers,fields);
 assert.equal(row(m,'h1-06').ready,6);assert.equal(row(m,'h1-10').ready,null);
 const clipped=S.attach({year:2026,month:11,lanes:[{id:'school',blocks:[{stage:'공통수학1',start:0,end:24,endClipped:true}]}],horizon:24,warnings:[]},answers,fields);assert.equal(row(clipped,'h1-06').ready,null);
 const unknown=plan({...answers,schoolBook:'unknown'});assert.ok(unknown.mockCheckPlan.rows.every(p=>p.start===null));
});
test('overrides cannot move a test before its scope or before paper availability; spacing and completed/excluded states persist',()=>{
 const answers=a('공통수학1'),s=S.update(null,input({'h1-06-month':'2026-11','h1-03-status':'skip',spacing:'2'}),answers).state,m=plan(answers,s);
 assert.ok(row(m,'h1-06').start>=6);assert.ok(m.mockCheckPlan.warnings.length);assert.ok(row(m,'h1-09').start-row(m,'h1-06').start>=2);
 const done=S.update(s,input({'h1-06-status':'done','h1-06-month':'2027-05'}),answers).state;assert.equal(row(plan(answers,done),'h1-06').start,null);assert.equal(row(plan(answers,done),'h1-06').suggested,'2027-05');
 const early=S.attach(C.model(a('미적분Ⅰ'),{...fields,mon:'3'}),a('미적분Ⅰ'),{...fields,mon:'3'},S.update(null,input({boundary:'cal-all'}),a('미적분Ⅰ')).state);
 assert.ok(row(early,'h2-09').start>=6);assert.ok(row(early,'h2-10').start>=7);
 const disabled=plan(answers,S.update(s,{spacing:'1',boundary:''},answers).state);assert.ok(!disabled.lanes.some(l=>l.id==='mockCheck'));
});
test('same dates feed all displays, progress changes recalculate, and goals retain the existing study lanes untouched',()=>{
 for(const goal of ['medicine','giftedSchool','scienceHigh']){const old=G.model(a(),fields,null,goal),m=S.attach(old,a(),fields);assert.deepEqual(plain(m.lanes.filter(l=>l.id!=='mockCheck')),plain(old.lanes));
 const r=row(m,'h1-03'),b=m.lanes.find(l=>l.id==='mockCheck').blocks.find(b=>b.paperId===r.id);assert.equal(C.date(m,b.start).label,C.date(m,r.start).label);
 for(const v of ['map','graph','table'])assert.match(S.render(m,v),new RegExp(C.date(m,r.start).label));assert.match(C.detail(m,b.id).html,new RegExp(C.date(m,r.start).label));}
 const slow=plan(),fast=plan(a('공통수학2'));assert.ok(row(slow,'h2-03').start>row(fast,'h2-03').start);
});
test('schedule restoration does not erase previous results, workload or concept records, and prefill identifies the chosen paper',()=>{
 const schedule=S.update(null,input({boundary:'alg-trig'}),a('대수')).state,record={id:'first',exam:'연습',level:'1',date:'2026-11-05',scope:'함수',attempt:'first',timing:'untimed',minutes:10,limit:0,total:10,unlearned:2,correct:6,helped:1,cause:'strategy',review:'none',startMonth:'2026-11',months:1};
 const state=L.restore({version:1,mock:{version:1,records:[record],schedule},concepts:{[L.TOPICS[0].id]:'review'}}),restored=L.restore(JSON.parse(JSON.stringify(state)));
 assert.equal(restored.mock.records.length,1);assert.equal(restored.mock.schedule.boundary,'alg-trig');assert.equal(restored.concepts[L.TOPICS[0].id],'review');
 const saved=E.save(restored.mock,{...record,id:'',total:'10',correct:'7'});assert.equal(saved.error,null);assert.equal(saved.state.schedule.boundary,'alg-trig');assert.equal(S.prefill('h2-09').level,'2');assert.match(S.prefill('h2-09').exam,/9월/);
});
