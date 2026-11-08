import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const g = {};
for (const name of ['pace','pace-sources','pace-plan']) {
  runInNewContext(readFileSync(new URL('planner-book-'+name+'.js',import.meta.url),'utf8'),{window:g});
}
g.PlannerMockFeedback = {dayOK:g.PlannerBookPace.validDay};
const plan = g.PlannerBookPacePlan;
const goal = {unit:'page',startDate:'2026-11-01',endDate:'2026-11-21',startPosition:0,endPosition:100};
const day = '2026-11-08';
const book = {id:'A',title:'교재',today:day,chapters:['하나','둘'],ranges:[{date:day,start:1,end:26,unit:'page',solo:true}],defaultGoal:goal};
const books = [book,{...book,id:'B',defaultGoal:null,ranges:[]}];
const point=(date,position)=>({bookId:'A',unit:'page',date,position});
test('separate volumes and scales, override and remove a dated record, reload and compare moving goals',()=>{
  let state = plan.restore(null);
  state = plan.apply(state,book,'observe',point('2026-11-04',5),day);
  state = plan.apply(state,book,'observe',point(day,29),day);
  let view=plan.model(books,'A',plan.restore(JSON.stringify(state)),day);
  assert.equal(view.goalSource,'roadmap');assert.equal(view.pace.currentGap,-6);assert.equal(view.pace.forecast.date,'2026-11-14');
  assert.equal(view.observations.at(-1).manual,true);
  assert.equal(plan.model(books,'B',state,day).pace.latest,null);
  state=plan.apply(state,book,'observe',{...point(day,1),unit:'chapter'},day);
  view=plan.model(books,'A',state,day);assert.equal(view.unit,'chapter');assert.equal(view.goal,null);
  state=plan.apply(state,book,'remove',point(day,29),day);
  view=plan.model(books,'A',state,day);assert.equal(view.pace.latest.position,26);assert.equal(view.observations.at(-1).manual,false);
  state=plan.apply(state,book,'goal',{...goal,bookId:'A',endPosition:80},day);
  assert.equal(plan.model(books,'A',state,day).goalSource,'manual');
  assert.equal(state.books.A.observations.chapter[day],1);
});
test('invalid dates, future records, out-of-range chapter and zero-length goals never save',()=>{
  const state=plan.restore('{');
  for(const data of [point('2026-11-09',1),point('2026-02-30',1),point(day,-1),{...point(day,3),unit:'chapter'}]) {
    assert.throws(()=>plan.apply(state,book,'observe',data,day));
  }
  assert.throws(()=>plan.apply(state,book,'goal',{...goal,bookId:'A',endDate:goal.startDate},day));
  assert.deepEqual(Object.keys(state.books),[]);
});
