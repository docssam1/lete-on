import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const window={},ctx=vm.createContext({window});
for(const file of [
 'planner-levels.js','planner.js','demo-content.js','planner-intake.js',
 'planner-progression.js','planner-standard-data.js','planner-high-study.js',
 'planner-standard.js','planner-curriculum.js','planner-mock-evidence.js',
 'planner-mock-schedule.js','planner-learning-evidence.js','planner-goal-curriculum.js'
])vm.runInContext(readFileSync(new URL(file,import.meta.url),'utf8'),ctx,{filename:file});
const {PlannerCurriculum:C,PlannerStandard:T,PlannerGoalCurriculum:G,PlannerMockSchedule:S,PlannerLearningEvidence:L}=window;
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const answers=(stage='공통수학1')=>({
 grade:'7',gradeInput:'current',thinkingExperience:'none',
 schoolCourse:'high',schoolBook:'기본정석',schoolHigh:stage,schoolStatus:'done',
 deepCourse:'none',deepBook:'none',calc:'none'
});
const highState=(stage='공통수학1',status='done',extra={})=>({
 version:1,subjects:{[stage]:{book:'쎈 고등',status,...extra}}
});
const curriculumState=(highStudy)=>({version:1,highStudy});
const lane=(m,id)=>m.lanes.find(l=>l.id===id);
const block=(m,id,stage)=>lane(m,id)?.blocks.find(b=>b.stage===stage);
const paper=(m,id)=>m.mockCheckPlan.rows.find(p=>p.id===id);
const plain=value=>JSON.parse(JSON.stringify(value));
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);

test('finishing 기본정석 alone leaves the current subject types before advancing the actual calendar',()=>{
 const m=C.model(answers(),fields),current=block(m,'school','공통수학1');
 assert.ok(current,'the completed concept book must not silently complete its types');
 assert.match(current.title,/쎈.*유형|유형.*쎈/);
 near(current.start,0);near(current.end,6);
 near(block(m,'school','공통수학2').start,6);
 near(block(m,'deep','공통수학1').start,6);
 assert.equal(C.date(m,current.start).label,'2026년 11월');
 assert.equal(C.date(m,block(m,'school','공통수학2').start).label,'2027년 5월');
});

test('confirmed concept and 쎈 completion starts the next subject and the preceding subject depth together',()=>{
 const m=C.model(answers(),fields,curriculumState(highState()));
 assert.equal(block(m,'school','공통수학1'),undefined);
 near(block(m,'school','공통수학2').start,0);
 near(block(m,'deep','공통수학1').start,0);
 near(block(m,'school','대수').start,6);
 near(block(m,'deep','공통수학2').start,6);
 const partial=C.model(answers(),fields,curriculumState(highState('공통수학1','progress',{done:3,total:4})));
 near(block(partial,'school','공통수학1').end,1.5);
 near(block(partial,'school','공통수학2').start,1.5);
 near(block(partial,'deep','공통수학1').start,1.5);
});

test('a student already studying 미적분Ⅰ keeps that starting point regardless of school grade',()=>{
 const a={...answers('미적분Ⅰ'),schoolStatus:'progress'};
 for(const grade of ['5','7','10']){
  const m=C.model({...a,grade},{...fields,grade});
  assert.equal(lane(m,'school').blocks[0].stage,'미적분Ⅰ');
  near(lane(m,'school').blocks[0].start,0);
  for(const prior of ['공통수학1','공통수학2','대수'])assert.equal(block(m,'school',prior),undefined);
 }
});

test('standard and custom plans share the high-school transition, including completed middle-school entry',()=>{
 const a=answers(),pending=T.model(a,fields,{highMonths:6}),done=T.model(a,fields,{highStudy:highState(),highMonths:6});
 near(block(pending,'school','공통수학1').end,6);
 near(block(pending,'school','공통수학2').start,6);
 near(block(done,'school','공통수학2').start,0);
 near(block(done,'deep','공통수학1').start,0);
 const middle={...a,schoolCourse:'mid',schoolBook:'개념원리',schoolExact:'19',schoolHigh:undefined};
 for(const m of [C.model(middle,fields),T.model(middle,fields,{highMonths:6})]){
  assert.equal(block(m,'school','중3-2'),undefined);
  near(block(m,'school','공통수학1').start,0);
  near(block(m,'school','공통수학1').end,6);
  near(block(m,'deep','공통수학1').start,6);
 }
});

test('medicine, gifted-school and science-high routes retain the same independent types evidence',()=>{
 for(const goal of ['medicine','giftedSchool','scienceHigh']){
  assert.ok(G.supports(goal));
  const pending=G.model(answers(),fields,null,goal);
  const done=G.model(answers(),fields,null,goal,curriculumState(highState()));
  near(block(pending,'school','공통수학1').end,6);
  near(block(pending,'school','공통수학2').start,6);
  near(block(done,'school','공통수학2').start,0);
  near(block(done,'deep','공통수학1').start,0);
 }
});

test('mock readiness waits for types completion and still respects the selected paper release month',()=>{
 const a=answers(),pending=S.attach(C.model(a,fields),a,fields);
 const completed=C.model(a,fields,curriculumState(highState()));
 const ready=S.attach(completed,a,fields);
 for(const id of ['h1-06','h1-09']){
  assert.equal(paper(pending,id).ready,6);
  near(paper(ready,id).ready,0);
 }
 const earlyFields={...fields,mon:'3'};
 const schedule=S.update(null,{enabled:'on',spacing:'1',boundary:'','h1-09-month':'2026-03'},a).state;
 const early=S.attach(C.model(a,earlyFields,curriculumState(highState())),a,earlyFields,schedule);
 near(paper(early,'h1-09').ready,0);
 assert.ok(paper(early,'h1-09').start>=6,'a September paper cannot be scheduled before it is available');
});

test('recalculating all routes leaves reported work, saved results and reference data unchanged',()=>{
 const a=answers(),highStudy=highState('공통수학1','progress',{done:3,total:4});
 const state=curriculumState(highStudy);
 const record={id:'prior-result',exam:'고1 6월 점검',level:'1',date:'2026-11-05',scope:'방정식·부등식',attempt:'first',timing:'untimed',minutes:45,limit:0,total:10,unlearned:2,correct:6,helped:1,cause:'strategy',review:'none',startMonth:'2026-11',months:1};
 const evidence=L.restore({version:1,mock:{version:1,records:[record]},concepts:{[L.TOPICS[0].id]:'review'}});
 const before=plain({a,state,evidence,levels:window.PLANNER_LEVELS});
 const models=[C.model(a,fields,state),T.model(a,fields,{highStudy,highMonths:6}),...['medicine','giftedSchool','scienceHigh'].map(goal=>G.model(a,fields,null,goal,state))];
 for(const m of models)S.attach(m,a,fields,evidence.mock.schedule);
 assert.deepEqual(plain({a,state,evidence,levels:window.PLANNER_LEVELS}),before);
 assert.equal(evidence.mock.records[0].id,'prior-result');
 assert.equal(evidence.concepts[L.TOPICS[0].id],'review');
});
