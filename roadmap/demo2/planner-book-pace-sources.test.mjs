import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const g = {}, cx = vm.createContext({window:g,Date});
for (const script of ['planner-levels','planner','demo-content','planner-intake','planner-progression',
  'planner-book-catalog','planner-book-checks','planner-high-study','planner-curriculum','planner-mock-matching',
  'planner-mock-items-data','planner-mock-items','planner-mock-feedback','planner-weekly-model',
  'planner-unit-sources','planner-unit-checks','planner-book-pace-sources']) {
  vm.runInContext(readFileSync(new URL(script+'.js',import.meta.url),'utf8'),cx,{filename:script});
}
const {PlannerBookPaceSources: adapter, PlannerBookChecks: catalog, PlannerUnitSources: sources,PlannerIntake: intake} = g;
const today = '2026-11-21';
const answers = {grade:'5',gradeInput:'current',thinkingExperience:'yes',thinking:'1031 초급',thinkingStatus:'progress',
  schoolCourse:'elem',schoolBook:'디딤돌 기본+응용',school:'5-1',schoolStatus:'progress',deepCourse:'none',deepBook:'none',
  calc:'기적의 계산법 4권',calcStatus:'progress'};
const fields = {grade:'5',year:'2026',mon:'11',band:'B',speed:'2'};
const context = {answers,fields};
const courses = {version:1,tracks:{curriculum:{current:'디딤돌 기본+응용 5-1',
  blocks:[{title:'5-1 디딤돌 기본+응용',start:0,end:2},{title:'5-2 디딤돌 기본+응용',start:2,end:5}]},
  arithmetic:{current:'기적의 계산법 4권',blocks:[{title:'기적의 계산법 4권',start:0,end:3}]}}};
const toPlain = v => JSON.parse(JSON.stringify(v));
const build = (overrides={}) => adapter.build({context,courses,today,...overrides}).books;
const saved = (overrides={}) => sources.build({...context,weekStart:today,today,...overrides});
const goalIntake = (a,unit='page',done=17,total=140) => ({...a,schoolProgress:{unit,done,total,course:intake.progressCourse(intake.effective(a),'schoolStatus')}});
const record = (item,date,bits=2,when=date) => ({item,marks:[[date,bits,when]]});
const loc = (book,unit='page',manual) => toPlain(adapter.observations(book,unit,manual)).map(x=>[x.date,x.position]);
const manualItem = (book,range,extra={}) => saved({...extra,manualRanges:{[book.id]:range}}).items.find(i=>i.track===book.track);
const log = entries => ({version:1,entries});

test('goals come from measured intake and a calendar block; elapsed weeks do not move the goal or imply mastery',()=>{
  const ctx={...context,answers:goalIntake(answers)};
  const first = build({context:ctx})[0];
  assert.equal(first.calendarSource,'monthly');
  assert.deepEqual(toPlain(first.defaultGoal),{unit:'page',total:140,startPosition:17,endPosition:140,startDate:'2026-11-01',endDate:'2026-12-31'});
  assert.deepEqual(loc(first),[]);
  const next = build({today:'2026-12-16',context:ctx})[0];
  assert.deepEqual(toPlain(first.defaultGoal),toPlain(next.defaultGoal));
  const initiated = build({context:ctx,program:{startDate:'2026-01-31'}})[0];
  assert.equal(initiated.suggested.endDate,'2026-03-30');
  const changed = build({context:ctx,program:{startDate:'2026-01-31'},
    courses:{tracks:{curriculum:{...courses.tracks.curriculum,changedOn:'2026-02-10'}}}})[0];
  assert.equal(changed.suggested.startDate,'2026-02-10');
  const missing = build()[0];
  assert.equal(missing.defaultGoal,null);assert.equal(missing.suggested.startPosition,null);
});

test('the current volume stays selectable when the assigned week has advanced; goals never use the next book range',()=>{
  const week={tracks:{curriculum:{pace:4,items:[{title:'5-2 디딤돌 기본+응용'}]}}};
  const list=build({context:{...context,answers:goalIntake(answers)},source:saved({week})});
  assert.equal(list.filter(b=>b.track==='curriculum').length,2);
  const next=list.find(b=>b.title.includes('5-2'));
  assert.equal(next.suggested.startDate,'2027-01-01');assert.equal(next.defaultGoal,null);
  assert.equal(list[0].defaultGoal.startPosition,17);
});

test('only contiguous dated independent work extends a checked position, even for partial chapter assignments',()=>{
  const book=saved().manualBooks[0];
  const entries=[record(manualItem(book,'3단원 확인 문제 18~20쪽'),'2026-11-01'),
    record(manualItem(book,'3단원 확인 문제 11~17쪽'),'2026-11-08',3,'2026-11-09'),
    record(manualItem(book,'p.21~25'),'2026-11-10',1),
    record(manualItem(book,'22~25쪽'),'2026-11-10',2),record(manualItem(book,'21쪽'),'2026-12-01')];
  const b=build({records:log(entries)})[0];
  assert.deepEqual(loc(b),[]);assert.deepEqual(loc(b,'chapter'),[]);
  assert.deepEqual(loc(b,'page',[{date:'2026-11-02',position:10}]),[['2026-11-02',10],['2026-11-09',17]]);
  assert.deepEqual(loc(b,'page',[{date:'2026-10-31',position:10}]),[['2026-10-31',10],['2026-11-09',20]]);
  assert.deepEqual(loc(b,'page',[{date:'2026-10-31',position:10},{date:'2026-11-11',position:7}]).at(-1),['2026-11-11',7]);
  assert.deepEqual(loc(b,'chapter',[{date:'2026-11-05',position:1,unit:'page'}]),[]);
});

test('verified chapter observations stay with their edition and undated intake marks need dated confirmation',()=>{
  const d=catalog.descriptor('school',answers,fields),edition=catalog.candidates(d)[0];
  let s=catalog.choose(null,d,'edition',edition.id);
  s=catalog.choose(s,d,'confirm','yes');s=catalog.choose(s,d,'observe','1:independent');
  const ctx={...context,bookChecks:s};
  const raw=saved().manualBooks[0],weak=saved({bookChecks:s}).items[0];
  const data=log([record(weak,'2026-11-08'),record(manualItem(raw,'1~5쪽'),'2026-11-02'),
    record(manualItem(raw,'1~8쪽',{bookChecks:s}),'2026-11-09')]);
  const b=build({context:ctx,records:data})[0];
  assert.equal(b.undatedPosition,1);assert.equal(b.defaultGoal,null);assert.equal(b.suggested.total,edition.units.length);
  assert.deepEqual(loc(b,'chapter'),[]);
  assert.deepEqual(loc(b,'chapter',[{date:'2026-11-02',position:1,unit:'chapter'}]),[['2026-11-02',1],['2026-11-08',2]]);
  assert.deepEqual(loc(b,'page'),[['2026-11-09',8]]);
  const another=build({records:data})[0];
  assert.notEqual(another.id,b.id);assert.deepEqual(loc(another,'page'),[['2026-11-02',5]]);
  const changed=goalIntake(answers,'unit',1,99), descriptor=catalog.descriptor('school',changed,fields);
  let next=catalog.choose(s,descriptor,'edition',edition.id);next=catalog.choose(next,descriptor,'confirm','yes');
  const mismatch=build({context:{...ctx,answers:changed,bookChecks:next}})[0];
  assert.equal(mismatch.defaultGoal,null);
});

test('a truncated roadmap horizon is not a finish date and a companion book keeps its own scale',()=>{
  const ctx={...context,answers:goalIntake(answers),mock:{lanes:[{id:'school',blocks:[
    {...courses.tracks.curriculum.blocks[0],continues:true}
  ]}]}};
  const clipped=build({context:ctx})[0];
  assert.equal(clipped.suggested.endDate,null);assert.equal(clipped.defaultGoal,null);
  const hs={...answers,schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'공통수학1',school:undefined};
  const highCtx={answers:goalIntake(hs),fields};
  const highCourses={tracks:{curriculum:{blocks:[{title:'공통수학1 기본정석 + 쎈 고등',start:0,end:4}]}}};
  const week={tracks:{curriculum:{pace:3,items:[{title:'공통수학1 기본정석 + 쎈 고등'}]}}};
  const selected=build({context:highCtx,source:saved({...highCtx,week}),courses:highCourses})[0];
  assert.match(selected.title,/기본정석/);assert.doesNotMatch(selected.title,/쎈/);
  assert.equal(selected.defaultGoal.endDate,'2027-02-28');
});
