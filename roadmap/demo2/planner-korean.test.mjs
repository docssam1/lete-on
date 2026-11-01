import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {exportGrade5} from './print/export-grade5.mjs';
const w={};const ctx=vm.createContext({window:w,console});
for(const f of ['planner-korean.js','planner-language.js','planner-report.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const K=w.PlannerKorean,L=w.PlannerLanguage;
const c={grade:8,year:2026,mon:11};
const row={current:'balanced',focus:'evidence',book:'koreanSumma',rhythm:'keep'};
const plain=v=>JSON.parse(JSON.stringify(v));
test('every start month and middle-school grade has six contiguous months and all concurrent areas',()=>{
 for(const grade of [7,8,9])for(let mon=1;mon<=12;mon++){
  const p=K.build(row,{grade,year:2026,mon});assert.deepEqual(plain(p.issues),[]);
  assert.equal(p.months.length,6);assert.equal(p.standardStages.at(-1).end,6);
  assert.equal(p.standardStages.reduce((n,s)=>n+s.end-s.start,0),6);
  for(const d of p.months)assert.deepEqual(Object.keys(d.areas),['vocabulary','grammar','evidence','literature','writing','school']);
 }
});
test('academic year advances in March, not January; no invented dates',()=>{
 assert.equal(K.at({grade:9,year:2026,mon:11},2).grade,9);
 assert.equal(K.at({grade:9,year:2026,mon:11},4).grade,10);
 assert.equal(K.at({grade:7,year:2027,mon:2},1).grade,8);
 assert.equal(K.at({grade:8,year:2026,mon:0}),null);
 assert.ok(K.build(row,{grade:8}).issues.length);assert.equal(K.build(row,{...c,foreignCalendar:true}),null);
});
test('exam selection affects this month only; subsequent months return to regular/vacation work',()=>{
 const p=K.build({...row,period:'exam'},c);
 assert.equal(p.months[0].period,'exam');assert.equal(p.months[1].period,'regular');assert.equal(p.months[2].period,'vacation');
 assert.match(p.months[0].areas.literature.material,/학교 시험 범위/);
 assert.doesNotMatch(p.months[1].areas.literature.material,/학교 시험 범위/);
 assert.equal(K.build({...row,rhythm:'exam'},c).months[0].period,'exam');
});
test('transition is selectable only for middle3 late year; foundation is not silently accelerated',()=>{
 assert.ok(!K.periodOptions(c).includes('transition'));
 assert.ok(K.periodOptions({...c,grade:9}).includes('transition'));
 const p=K.build({...row,current:'starting',period:'transition'},{grade:9,year:2026,mon:11});
 assert.doesNotMatch(p.months[0].areas.evidence.material,/나비효과/);
 assert.match(p.months[0].areas.evidence.material,/짧은 독해/);
 assert.match(K.build({...row,period:'transition'},{grade:9,year:2026,mon:11}).months[0].areas.evidence.material,/나비효과/);
});
test('choice and restore preserve Korean period/books without leaking into English or changing input',()=>{
 let s=L.empty();const original=JSON.stringify(s);
 const next=L.choose(s,'korean','current','balanced',c);assert.equal(JSON.stringify(s),original);s=next;
 for(const [kind,v] of [['focus','evidence'],['book','koreanSumma'],['period','exam'],['rhythm','keep']])s=L.choose(s,'korean',kind,v,c);
 const copy=L.restore(JSON.parse(JSON.stringify(s)));assert.equal(copy.subjects.korean.book,'koreanSumma');assert.equal(copy.subjects.korean.period,'exam');
 const before=JSON.stringify(copy),m=L.model(copy,'korean',c);assert.equal(JSON.stringify(copy),before);
 assert.equal(m.koreanPlan.months[0].period,'exam');assert.match(m.koreanPlan.months[1].areas.evidence.material,/숨마주니어/);
 assert.ok(!L.bookOptions('english',c,'evidence').some(b=>b.id==='koreanSumma'));
 assert.equal(L.choose(copy,'korean','period','transition',c).subjects.korean.period,'exam');
 assert.match(L.choices(copy,'korean','rhythm',c),/지금은 어떤 시기/);
});
test('book choice, map, table, questions and printed report share the computed curriculum',()=>{
 const s=L.restore({version:1,subjects:{korean:{enabled:true,...row,period:'exam'}}});
 const m=L.model(s,'korean',c);
 for(const view of ['map','table','graph','records']){
  const html=L.render(s,'korean',c,view);assert.match(html,/숨마주니어/);assert.match(html,/2027년 1월/);assert.match(html,/정답을 가리고/);
 }
 assert.ok(L.questions(s,'korean',c).some(q=>q.q.includes('강의를 전부')));
 const report=w.PlannerReport.render(w.PlannerReport.model({grade:8,fields:{year:2026,mon:11},languages:[m],lanes:[]}));
 assert.match(report,/숨마주니어/);assert.match(report,/문법/);assert.match(report,/학교 내신/);assert.match(report,/같은 강좌/);
});
test('validation detects gaps and missing mastery checks',()=>{
 const p=plain(K.build(row,c));p.standardStages[0].start=1;delete p.standardStages[0].areas.grammar.check;
 const issues=K.validate(p);assert.ok(issues.some(x=>x.includes('빈칸')));assert.ok(issues.some(x=>x.includes('확인 기준')));
});
test('grade5 sample uses middle-school Korean books and exam pauses without changing math dates',()=>{
 const d=exportGrade5();assert.equal(d.plan.middle12End,12);assert.equal(d.plan.highEnd,45);
 const kr=d.plan.lanes.find(l=>l.id==='korean'),literature=d.plan.lanes.find(l=>l.id==='reading');
 assert.ok(kr.blocks.some(b=>b.start===16&&b.book.includes('생각독해')));
 for(const e of d.plan.exams){const b=kr.blocks.find(b=>b.start<=e.start&&b.end>e.start);assert.ok(b?.examFocus);}
 assert.ok(literature.blocks.some(b=>b.book.includes('필독 문학')));
 assert.equal(d.report.lanes.length,9);
});
