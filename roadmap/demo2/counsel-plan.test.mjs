import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import './planner-weekly-model.js';
import './planner-unit-checks.js';
import './planner-unit-checklist-view.js';
import './counsel-plan.js';

const model=globalThis.RoadmapCounselPlan;
const weekly=globalThis.PlannerWeeklyModel;
const checks=globalThis.PlannerUnitChecks;
const day=weekly.today();
const add=n=>weekly.addDays(day,n);
const input={book:'쎈 공통수학1',unit:'이차방정식',track:'curriculum',practice:day,practiceCount:3,recheck:add(7),recheckCount:2};
const plan={...input,id:'example'};
const item=step=>model.item(plan,step);

function memory(){
  const values=new Map();
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}
function setupStudent(owner) {
  globalThis.RoadmapMember={user_id:owner};
  const ctx={RoadmapMember:globalThis.RoadmapMember,localStorage:memory(),sessionStorage:memory()};
  const scope=vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(new URL('planner-storage.js',import.meta.url),'utf8'),scope);
  globalThis.PlannerStorage=ctx.PlannerStorage;
  return ctx;
}
const week='2026-11-09', next='2026-11-16';
const fixed={...plan,practice:'2026-11-12',recheck:'2026-11-19'};
const mark=(records,when,task,field,value=true)=>checks.update(records,{item:task,field,value,weekStart:when,day:when});

test('real dates follow the weekly anchor, an explicit book and unit override school grade, no invented pages',()=>{
  const ctx={question:'중1인데 쎈 공통수학1 이차방정식에서 힌트를 봐요. 이번 주 어떻게 복습할까요?',progress:'쎈 공통수학1 이차방정식',sources:[{title:'교과 보완'}]};
  globalThis.PlannerMockItems={UNITS:[{title:'이차방정식',course:'공통수학1'}]};
  globalThis.PlannerIntake={highSubjects:['공통수학1']};
  assert.equal(model.obviousLearning(ctx),true);
  assert.equal(model.obviousLearning({...ctx,question:'상산고 경쟁률과 면접은?'}),false);
  assert.equal(model.obviousLearning({...ctx,sources:[]}),false);
  const proposal=model.draft(ctx,null,week,next);
  assert.equal(proposal.book,'쎈 공통수학1');
  assert.equal(proposal.unit,'이차방정식');
  assert.equal(proposal.practice,next);
  assert.equal(proposal.recheck,'2026-11-23');
  assert.equal(model.draft({question:'다음 주 복습할까요?',progress:''},null,week).unit,'');
  delete globalThis.PlannerIntake;
});

test('dated items use the real weekly checklist, including unmet work after a missed week',()=>{
  const first=model.weekItems([fixed],week,null);
  assert.equal(first.length,1);
  assert.equal(first[0].date,'2026-11-12');
  assert.match(first[0].detail,/3문제/);
  assert.deepEqual(model.weekItems([fixed],'2026-11-02',null),[]);
  let records=mark(null,week,first[0],'studied');
  const tasks=model.weekItems([fixed],next,records);
  assert.equal(tasks.length,1);
  assert.deepEqual(tasks[0].reviewOf,[first[0].id]);
  assert.match(tasks[0].detail,/처음 푸는 유사문제 2개/);
  let view=checks.view(records,{weekStart:next,items:tasks});
  assert.deepEqual(view.nextReview[0].items.map(i=>i.id),[first[0].id]);
  records=mark(records,next,tasks[0],'solo');
  view=checks.view(records,{weekStart:next,items:tasks});
  assert.equal(view.nextReview.length,0);
  records=mark(records,next,tasks[0],'solo',false);
  assert.equal(checks.view(records,{weekStart:next,items:tasks}).nextReview.length,1);
  const markup=globalThis.PlannerUnitChecklistView.markup({...checks.view(records,{weekStart:week,items:first}),counselUpcoming:tasks});
  for(const label of ['공부했어요','혼자 풀 수 있어요','상담에서 정한 공부','예정된 상담 학습','2026-11-19','2개']) assert.ok(markup.includes(label),label);
  assert.deepEqual(model.weekItems([fixed],'2026-11-23',records).map(i=>i.counselStep),['recheck']);
});

test('a different plan on the same unit cannot settle the original practice',()=>{
  const first=item('practice');
  const wrong=model.item({...plan,id:'another'},'recheck');
  let records=mark(null,week,first,'studied');
  records=mark(records,next,{...wrong,reviewOf:[first.id]},'solo');
  assert.equal(checks.view(records,{weekStart:next}).nextReview.length,1);
});

test('save survives reopening; same-week duplicate and cross-account edits cannot overwrite the member plan',async()=>{
  const scope=setupStudent('alpha');
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{locks:{request:(_key,fn)=>Promise.resolve().then(fn)}}});
  const first=await model.save(input,'alpha');
  const duplicate=await model.save({...input,unit:' 이차방정식 ',practiceCount:1},'alpha');
  assert.equal(first.duplicate,false);
  assert.equal(duplicate.duplicate,true);
  assert.equal(model.saved().length,1);
  assert.equal(duplicate.plan.id,first.plan.id);
  assert.equal(duplicate.plan.practiceCount,3);
  assert.equal(JSON.stringify(model.saved()).includes('question'),false);
  const task=model.item(first.plan,'practice');
  const start=checks.weekStart(day);
  const stored=checks.update(null,{weekStart:start,item:task,field:'studied',value:true,day});
  globalThis.PlannerStorage.setItem('gfield.demo2.unit-checklist.v1',JSON.stringify({records:stored}));
  assert.ok(model.previousSummary().includes('공부했어요 · 혼자 풀기는 미확인'));
  assert.ok(model.previousSummary().includes('재점검 2문제 · 미기록'));
  await model.save({...input,unit:'나머지정리'},'alpha');
  assert.match(model.previousSummary(),/이차방정식/);
  scope.sessionStorage=memory();
  assert.equal(model.saved()[0].id,first.plan.id);
  scope.RoadmapMember=globalThis.RoadmapMember={user_id:'beta'};
  assert.equal(model.previousSummary(),'');
  await assert.rejects(model.save(input,'alpha'),/학생 계정/);
  assert.deepEqual(model.saved(),[]);
  scope.RoadmapMember=globalThis.RoadmapMember={user_id:'alpha'};
  await assert.rejects(model.save({...input,recheck:add(14)},'alpha'),/다음 주/);
  await assert.rejects(model.save({...input,practice:add(-1)},'alpha'),/보완일/);
  await assert.rejects(model.save({...input,practiceCount:0},'alpha'),/문제 수/);
});
