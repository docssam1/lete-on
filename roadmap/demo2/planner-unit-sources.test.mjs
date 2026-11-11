import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const window = {}, cx = vm.createContext({window, Date});
for (const script of ['planner-levels','planner','demo-content','planner-intake','planner-progression',
  'planner-book-catalog','planner-book-checks','planner-high-study','planner-curriculum','planner-mock-evidence',
  'planner-mock-schedule','planner-mock-library-data','planner-mock-library','planner-mock-scopes','planner-mock-matching',
  'planner-mock-items-data','planner-mock-items','planner-mock-feedback','planner-mock-books','planner-weekly-model','planner-unit-sources']) {
  vm.runInContext(readFileSync(new URL(script+'.js',import.meta.url),'utf8'),cx,{filename:script});
}
const {PlannerUnitSources: adapter, PlannerBookChecks: books, PlannerMockItems: q, PlannerMockLibrary: papers,
  PlannerMockEvidence: evidence,PlannerMockSchedule: schedule,PlannerMockFeedback: feedback,PlannerCurriculum: curriculum} = window;
const a={grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'공통수학1',schoolStatus:'progress',deepCourse:'none',deepBook:'none',calc:'none'};
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const start='2026-11-08';
const build=(input={})=>adapter.build({answers:a,fields,weekStart:start,today:start,...input});
const mock=(rows, learned=['c1-poly','c1-remainder'])=>({mockCheckPlan:{enabled:true,rows,state:{},knowledge:{learned}},mockFeedback:{plans:[],records:[]}});
const row=(date,extra={})=>({id:'h1-06',selectedPaperId:'h1-06',start:0,practiceDate:date,...extra});
const mockRows=m=>m.items.filter(i=>i.kind==='mock');
const elem={...a,schoolCourse:'elem',schoolBook:'디딤돌 기본+응용',school:'5-1',schoolHigh:undefined,thinkingExperience:'yes',thinking:'1031 입문',thinkingStatus:'progress',calc:'기적의 계산법 4권',calcStatus:'progress'};

test('edition selection prioritises an observed weak chapter and honours independent chapters',()=>{
  const d=books.descriptor('school',elem,fields),b=books.candidates(d)[0];
  let state=books.choose(null,d,'edition',b.id);
  state=books.choose(state,d,'confirm','yes');
  state=books.choose(state,d,'observe','1:independent');
  state=books.choose(state,d,'observe','3:help');
  const made=build({answers:elem,bookChecks:state});
  const item=made.items.find(r=>r.track==='curriculum');
  assert.equal(item.unitLabel,b.units[2].title);
  assert.equal(item.url,b.sourceUrl);
  assert.match(item.detail,/3단원/);
  const next=build({answers:elem,bookChecks:state,mastered:[item.id]}).items.find(r=>r.track==='curriculum');
  assert.equal(next.unitLabel,b.units[1].title);
  assert.equal(made.items.find(i=>i.track==='arithmetic').unitLabel,'구구단 종합 · 세 자리 덧셈·뺄셈');
});
test('unknown editions use stage-specific topics and manual ranges are scoped to the book',()=>{
  const input=build({answers:elem});
  assert.match(input.items.find(r=>r.track==='curriculum').detail,/학기 범위/);
  assert.ok(!input.items[0].url && !input.items[0].detail.includes('1단원'));
  const book=input.manualBooks.find(b=>b.track==='thinking');
  const ranges={[book.id]:'규칙 찾기 21~24쪽'};
  const manual=build({answers:elem,manualRanges:ranges});
  assert.equal(manual.items.find(i=>i.track==='thinking').unitLabel,'규칙 찾기 21~24쪽');
  const changed=build({answers:{...elem,thinking:'1031 초급'},manualRanges:ranges});
  assert.ok(!changed.items.some(i=>i.unitLabel.includes('21~24쪽')));
  assert.ok(changed.notices.some(n=>n.includes('1031 초급')));
});
test('paused subjects supply no new book rows; mid-level units do not depend on chronological grade',()=>{
  const week={tracks:{curriculum:{pace:1,items:[{title:'중2-1 개념원리',sessions:1}]},arithmetic:{pace:0,items:[]},thinking:{pace:0,items:[]}}};
  const result=build({answers:{...elem,grade:'3'},week});
  assert.equal(result.items.length,1);
  assert.equal(result.items[0].unitId,'m-rational');
  assert.equal(result.manualBooks.length,1);
});
test('only this anchored week includes real published question numbers, with all prerequisites freshly checked',()=>{
  const m=mock([row('2026-11-07'),row('2026-11-15'),row('2026-11-14'),row(start,{status:'skip'}),row(start,{start:null})],['c1-poly']);
  const checked=mockRows(build({mock:m}));
  const want=q.select('h1-06',['c1-poly']).selected;
  assert.ok(want.length);
  assert.deepEqual(Array.from(checked,r=>r.questionNumber),Array.from(want));
  assert.ok(checked.every(r=>r.date==='2026-11-14' && r.unitLabel && r.url===papers.find('h1-06').files.problem));
  assert.ok(!mockRows(build({mock:m,today:'2024-01-01'})).length);
  m.mockCheckPlan.state.seenPaperIds=['h1-06'];
  assert.ok(!mockRows(build({mock:m})).length);
});
test('different-year recheck includes only verified remedial-unit questions on its assigned week',()=>{
  const partial=schedule.update(null,{enabled:'on',spacing:'1',boundary:'',knowledgeEdited:'on','learned-unit-c1-poly':'on','learned-unit-c1-remainder':'on'},a).state;
  const base=schedule.attach(curriculum.model(a,fields),a,fields,partial);
  const selection=q.select('h1-06',['c1-poly','c1-remainder']);
  const paper=papers.find('h1-06'),weak=selection.selected[0];
  const record={exam:paper.exam,level:paper.level,scope:'다항식',date:'2026-11-06',attempt:'first',timing:'untimed',
    minutes:'30',total:'99',unlearned:'99',correct:'99',helped:'0',cause:'concept',review:'none',startMonth:'2026-11',months:'1',questionSelection:JSON.stringify(selection),...Object.fromEntries(selection.selected.map(n=>['question-'+n,n===weak?'wrong':'correct']))};
  const saved=evidence.save(null,record);
  assert.equal(saved.error,null);
  const m=feedback.attach(base,saved.state);
  const remedial=m.mockFeedback.plans[0];
  const items=mockRows(build({mock:m,weekStart:remedial.recheck,today:remedial.recheck})).filter(i=>i.date===remedial.recheck);
  assert.ok(items.length && remedial.paper.year!==paper.year);
  assert.ok(items.every(i=>i.paperId===remedial.paper.id && i.unitId===remedial.topics[0].unitId));
  assert.ok(!mockRows(build({mock:m,weekStart:window.PlannerWeeklyModel.addDays(remedial.recheck,1)})).some(i=>i.paperId===remedial.paper.id));
});

test('enabling weekly targets keeps the same book, unit and custom-range identity',()=>{
  const before=build({mock:mock([])});
  const book=before.manualBooks[0],typed={[book.id]:'3단원 확인 문제 15~18쪽'};
  const week={tracks:{curriculum:{pace:4,items:[{title:'공통수학1 기본정석 + 쎈 고등',sessions:4}]}}};
  const after=build({mock:mock([]),week});
  assert.equal(after.manualBooks[0].id,book.id);
  assert.equal(after.items[0].id,before.items[0].id);
  assert.match(after.items[0].title,/쎈 고등/);
  assert.equal(build({week,manualRanges:typed}).items[0].id,build({manualRanges:typed}).items[0].id);
  assert.notEqual(build({answers:{...a,schoolBook:'쎈 고등'}}).manualBooks[0].id,book.id);
});

test('a studied but dependent question yields one fresh same-scope alternate and a matching current book',()=>{
  const m=mock([row(start)],['c1-poly']);
  const original=mockRows(build({mock:m}))[0];
  const groups=[{unitId:original.unitId,items:[original]}],ctx={answers:a,fields,mock:m,weekStart:'2026-11-15',today:start};
  const material=adapter.reviewWork(groups,ctx);
  const books=material.items.filter(i=>i.kind==='book'),alternates=mockRows(material);
  assert.equal(books.length,1);
  assert.match(books[0].detail,/현재 교재/);
  assert.equal(books[0].unitId,original.unitId);
  assert.ok(!books[0].reviewOf);
  assert.equal(alternates.length,1);
  const alt=alternates[0],scope=window.PlannerMockMatching;
  assert.deepEqual(Array.from(alt.reviewOf),[original.id]);
  assert.equal(alt.date,ctx.weekStart);
  assert.equal(alt.unitId,original.unitId);
  assert.ok(q.select(alt.paperId,['c1-poly'],{mode:'remedial',target:[original.unitId]}).selected.includes(alt.questionNumber));
  assert.notEqual(papers.find(alt.paperId).year,papers.find(original.paperId).year);
  assert.equal(scope.sourceFor(papers.find(alt.paperId)).scopeKey,scope.sourceFor(papers.find(original.paperId)).scopeKey);
  assert.ok(!adapter.reviewWork(groups,{...ctx,usedPaperIds:[alt.paperId]}).items.some(i=>i.id===alt.id));
  const changed=adapter.reviewWork(groups,{...ctx,answers:{...a,schoolHigh:'미적분Ⅰ'}});
  assert.ok(!changed.items.some(i=>i.kind==='book'));
  assert.equal(adapter.reviewWork([{unitId:'c1-poly',items:[books[0]]}],ctx).items.length,0);
});
