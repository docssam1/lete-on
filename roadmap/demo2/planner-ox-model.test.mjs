import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInThisContext} from 'node:vm';

for (const name of ['planner-book-pace','planner-weekly-model','planner-assessment-trend','planner-assessment-records','planner-ox-model']) {
  runInThisContext(readFileSync(new URL(name+'.js',import.meta.url),'utf8'));
}
const {state, apply, itemId} = globalThis.PlannerOxModel;
const R = globalThis.PlannerAssessmentRecords, trend = globalThis.PlannerAssessmentTrend;
const unitId = 'didimdol22-1-1-u1';
const q = (number, typeId, ref, variant) => ({number, typeId, ref, variant});
const unit = {
  id:unitId, semester:'1-1', number:1, title:'9까지의 수', types:{t01:'수 세기',t02:'순서',t03:'비교'},
  sets:{
    m:[q(1,'t01',1,false),q(2,'t01',2,false),q(3,'t02',3,false),q(4,'t03',4,false),q(5,'t02',3,true)],
    h:[q(1,'t01',2,true),q(2,'t01',1,true),q(3,'t02',6,false)],
    x:[q(1,'t01',1,true)]}};
const catalog = {units:[unit]};
const start = '2026-12-26', next = '2027-01-02', week2 = '2027-01-09';
const id = (set,n) => itemId(unit,set,n);
const initial = (set,marks,date=start,extra={}) => ({kind:'initial', unitId, set, marks, date, ...extra});
const recheck = (itemId, mark, date=next, extra={}) => ({kind:'recheck', unitId, itemId, mark, date, ...extra});
const scores = (items, date=start) => ({id:'legacy',track:'curriculum',semester:'1-1',unitId,unitTitle:unit.title,date,items});
const item = (id,outcome,phase='initial') => ({id,phase,outcome,typeId:'t01'});
const task = (rows,day=week2) => state(catalog,rows,day).tasks[0];
const add = (rows,change,day=change.date) => apply(catalog,rows,change,day);

test('a partial O/X entry schedules one next-week task per weak type with a fresh printed set and number',()=>{
  const rows = add([],initial('m',{1:'X',2:'X',3:'O'}));
  assert.deepEqual(rows, R.validate({schema:R.schema, attempts:rows},start));
  assert.equal(rows[0].items.length,3);
  const {marks,tasks} = state(catalog,rows,start);
  assert.equal(marks[id('m',1)].mark,'X');
  assert.equal(marks[id('m',3)].mark,'O');
  assert.equal(marks[id('m',4)],undefined);
  assert.equal(tasks.length,1);
  assert.deepEqual(tasks[0],{unitId,typeId:'t01',typeTitle:'수 세기',sourceSet:'m',sourceIds:[id('m',1),id('m',2)],
    due:next, status:'scheduled',itemId:id('h',2),set:'h',number:2,variant:true});
  assert.deepEqual(trend.build({attempts:rows,day:start}).points[0].initial,{eligible:3, submitted:3, independent:1,paper:{eligible:25,submitted:3}});
});

test('distinct days within the same set preserve earlier graph points and weekly due dates; correction edits its original date',()=>{
  const first = add([],initial('m',{1:'X'}));
  const later = add(first,initial('m',{3:'X'},next));
  const s=state(catalog,later,next);
  assert.deepEqual(s.tasks.map(t=>t.due),[next,week2]);
  assert.deepEqual(trend.build({attempts:later,day:next}).points.map(p=>p.initial.eligible),[1,2]);
  const corrected = add(later,initial('m',{1:'O'},next));
  assert.equal(state(catalog,corrected,next).marks[id('m',1)].date,start);
  assert.deepEqual(state(catalog,corrected,next).tasks.map(t=>t.typeId),['t02']);
  assert.deepEqual(add(corrected,initial('m',{1:'O'},week2)),corrected);
  assert.equal(state(catalog,first,next).marks[id('m',1)].mark,'X');
});

test('recheck X schedules a distinct question seven days later; O closes the type without changing the initial score',()=>{
  let rows = add([],initial('m',{1:'X'}));
  const first = task(rows);
  assert.throws(()=>add(rows,recheck(first.itemId,'X',start)),/예정일/);
  const didOnPaper=add(rows,initial(first.set,{[first.number]:'O'},next));
  assert.notEqual(task(didOnPaper).itemId,first.itemId);
  assert.throws(()=>add(didOnPaper,recheck(first.itemId,'O')),/다른 평가/);
  rows=add(rows,recheck(first.itemId,'X'));
  const second=task(rows);
  assert.equal(second.due,week2); assert.notEqual(second.itemId,first.itemId);
  rows=add(rows,recheck(second.itemId,'O',week2));
  assert.equal(task(rows),undefined);
  const days=trend.build({attempts:rows,day:week2}).points;
  assert.deepEqual(days.map(p=>p.initial.independent),[0,0,0]);
  assert.deepEqual(days.at(-1).recheck,{eligible:2, submitted:2, independent:1,recordedOnly:true});
  const fix=add(rows,recheck(second.itemId,'X',week2));
  assert.equal(task(fix).due,'2027-01-16'); assert.notEqual(task(fix).itemId,first.itemId);
  const reopened=add(rows,initial('m',{2:'X'},'2027-01-10'));
  assert.equal(task(reopened,'2027-01-10').due,'2027-01-17');
});

test('exact-type original in another set, same-set variant, then dated exhausted task; no unrelated or duplicate recheck',()=>{
  let rows=add([],initial('m',{3:'X',4:'X'}));
  const {tasks}=state(catalog,rows,start);
  const sparse=tasks.find(t=>t.typeId==='t02');
  assert.equal(sparse.itemId,id('h',3));assert.equal(sparse.variant,false);
  const noAlternative=tasks.find(t=>t.typeId==='t03');
  assert.deepEqual([noAlternative.status,noAlternative.due,noAlternative.itemId],['exhausted',next,null]);
  rows=add(rows,recheck(sparse.itemId,'X'));
  assert.equal(task(rows).typeId,'t03');
  const nextTask=state(catalog,rows,next).tasks.find(t=>t.typeId==='t02');
  assert.equal(nextTask.itemId,id('m',5));
  rows=add(rows,recheck(nextTask.itemId,'X',week2));
  assert.ok(state(catalog,rows,week2).tasks.every(t=>t.status==='exhausted' && !t.itemId));
});

test('legacy pending retains submission date, unanswered and unlearned first O/X use actual mark dates',()=>{
  const legacy=scores([item(id('m',1),'wrong'),item(id('m',2),'unanswered'),item(id('m',3),'pending'),item(id('m',4),'unlearned')]);
  const incoming=add([legacy],initial('m',{2:'O',3:'O',4:'X'},next));
  const marks=state(catalog,incoming,next).marks;
  assert.equal(marks[id('m',2)].date,next);assert.equal(marks[id('m',3)].date,start);assert.equal(marks[id('m',4)].date,next);
  assert.deepEqual(trend.build({attempts:incoming,day:next}).points.map(p=>p.initial.independent),[1,2]);
  const other={...legacy,track:'thinking',bookId:'other'};
  assert.deepEqual(state(catalog,[other],next).tasks,[]);
  assert.deepEqual(state(catalog,[{...legacy,bookId:'another-book'}],next).marks,{});
});

test('lock-time revalidation prevents stale overwrites, unrelated cells merge and retrying a save is idempotent',()=>{
  let rows=add([],initial('m',{1:'X'},start,{expected:{1:null}}));
  assert.throws(()=>add(rows,initial('m',{1:'O'},start,{expected:{1:null}})),/다른 창/);
  rows=add(rows,initial('m',{2:'O'},start,{expected:{2:null}}));
  rows=add(rows,initial('m',{1:'O'},start,{expected:{1:'X'}}));
  assert.deepEqual(add(rows,initial('m',{1:'O'},next,{expected:{1:'X'}})),rows);
  assert.equal(rows.length,1);assert.equal(rows[0].items.length,2);
  assert.throws(()=>add(rows,initial('m',{1:'X',50:'X'})),/문항 번호/);
  assert.equal(rows[0].items[0].outcome,'independent');
  assert.throws(()=>add(rows,recheck(id('h',2),'O')),/현재 배정/);
  assert.throws(()=>add(rows,initial('m',{1:'X'},'2026-12-32')),/날짜/);
  assert.throws(()=>add(rows,initial('m',{1:'X'},next),start),/날짜/);
});

test('each of the 5,325 printed rows can be marked; every fresh recheck matches its classified type and updates the graph',()=>{
  const actual=JSON.parse(readFileSync(new URL('planner-ox-catalog.json',import.meta.url),'utf8'));
  let verified=0, missing=0;
  for(const unit of actual.units){
    for(const [set,rows] of Object.entries(unit.sets)){
      for(const row of rows){
        const saved=apply(actual,[],{kind:'initial',unitId:unit.id,set,marks:{[row.number]:'X'},date:start},start);
        const [t]=state(actual,saved,start).tasks;
        assert.equal(t.due,next);assert.equal(t.typeId,row.typeId);
        if(t.status==='exhausted'){
          missing++;
        }else{
          const target=unit.sets[t.set].find(r=>r.number===t.number);
          assert.equal(target.typeId,row.typeId);assert.notEqual(t.itemId,itemId(unit,set,row.number));
          const reviewed=apply(actual,saved,{kind:'recheck',unitId:unit.id,itemId:t.itemId,mark:'O',date:next},next);
          assert.deepEqual(state(actual,reviewed,next).tasks,[]);
          const [before,after]=trend.build({attempts:reviewed,day:next}).points;
          assert.equal(after.initial.independent,before.initial.independent);assert.equal(after.initial.eligible,1);
          assert.equal(after.initial.paper.submitted,t.set===set ? 2 : 1);assert.equal(after.recheck.independent,1);
        }
        verified++;
      }
    }
  }
  assert.equal(actual.units.length,71);assert.equal(verified,5325);assert.equal(missing,162);
});

test('supplemental questions are recheck-only, follow printed choices, and store no question or answer content',()=>{
  const augmented={...unit,supplements:[{typeId:'t03',prompt:'content',check:'check'}]};
  const catalog={units:[augmented]};
  let rows=apply(catalog,[],initial('m',{4:'X'}),start);
  const [task]=state(catalog,rows,start).tasks;
  assert.deepEqual([task.set,task.number,task.itemId],['s',3,id('s',3)]);
  assert.throws(()=>apply(catalog,rows,initial('s',{3:'O'},next),next),/문항 번호/);
  rows=apply(catalog,rows,recheck(task.itemId,'X'),next);
  assert.equal(state(catalog,rows,next).tasks[0].status,'exhausted');
  assert.ok(!JSON.stringify(rows).includes('content'));
  assert.ok(!JSON.stringify(rows).includes('"check"'));
  assert.equal(trend.build({attempts:rows,day:next}).points.at(-1).recheck.eligible,1);
});
