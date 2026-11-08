import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import test from 'node:test';

const context = {window:{}};
runInNewContext(readFileSync(new URL('planner-assessment-trend.js',import.meta.url),'utf8'),context);
const build = options => structuredClone(context.window.PlannerAssessmentTrend.build(options)).points;
const q = (id,outcome,phase = 'initial') => ({id,outcome,phase});
const run = (id,date,items,extra = {}) => ({id,date,track:'curriculum',semester:'1-1',unitId:'1',unitTitle:'수',items,...extra});
const counts = (eligible,submitted,independent) => ({eligible,submitted,independent});

test('cumulative counts use eligible question volume, keep assisted and pending separate from independent, and skip days without new work',() => {
  const attempts = [
    run('first','2026-11-01',[q('중-1','independent'),q('중-2','assisted'),q('중-3','wrong'),
      q('중-4','pending'),q('중-5','unanswered'),q('중-6','unlearned')]),
    run('repeat','2026-11-03',[q('중-3','independent','recheck')]),
    run('new','2026-11-07',[q('상-3','independent','recheck'),q('중-6','independent')]),
    run('future','2026-12-01',[q('상-4','wrong','recheck')])
  ];
  const points=build({attempts,day:'2026-11-08'});
  assert.deepEqual(points,[
    {date:'2026-11-01',initial:counts(5,4,1),recheck:counts(0,0,0)},
    {date:'2026-11-07',initial:counts(6,5,2),recheck:counts(1,1,1)}
  ]);
});

test('same day coalesces across books, tracks and units with shared question numbers; filters preserve those identities',()=>{
  const date='2026-11-01', items=[q('1','independent')];
  const attempts=[
    run('a',date,items,{bookId:'A'}),run('a',date,items,{bookId:'B'}),
    run('c',date,items,{bookId:'A',unitId:'2'}),run('d',date,items,{bookId:'A',semester:'1-2'}),
    run('a',date,items,{bookId:'A',track:'thinking'})
  ];
  assert.equal(build({attempts})[0].initial.eligible,5);
  assert.equal(build({attempts,track:'curriculum',semester:'1-1',unitId:'1'})[0].initial.eligible,2);
  assert.equal(build({attempts,track:'thinking'})[0].initial.eligible,1);
  assert.deepEqual(build({attempts,semester:'3-2'}),[]);
});

test('a corrected record supersedes its old date and outcome; a separate attempt cannot inflate a score',()=>{
  const attempts=[
    run('retake','2026-11-04',[q('중-1','independent','recheck'),q('상-1','wrong','recheck')]),
    run('first','2026-11-01',[q('중-1','wrong')]),
    run('first','2026-11-02',[q('중-1','assisted'),q('중-2','independent')]),
    run('retake-again','2026-11-05',[q('상-1','independent','recheck'),q('중-1','independent')])
  ];
  const points=build({attempts});
  assert.deepEqual(points.map(p=>p.date),['2026-11-02','2026-11-04']);
  assert.deepEqual(points.at(-1).initial,counts(2,2,1));
  assert.deepEqual(points.at(-1).recheck,counts(1,1,0));
  assert.deepEqual(build({attempts,day:'2026-11-01'}),[]);
});

test('initial exposure has priority over a duplicate recheck on the same date regardless of import order',()=>{
  const initial=run('a','2026-11-04',[q('1','wrong'),q('new','unlearned')]);
  const recheck=run('b','2026-11-04',[q('1','independent','recheck'),q('new','assisted','recheck')]);
  const a=build({attempts:[recheck,initial]}), b=build({attempts:[initial,recheck]});
  assert.deepEqual(a,b);
  assert.deepEqual(a[0].initial,counts(1,1,0));
  assert.deepEqual(a[0].recheck,counts(1,1,0));
});

test('empty, ineligible, corrupt and impossible dates provide no measured point',()=>{
  const attempts=[null,run('bad','2026-02-31',[q('1','independent')]),
    run('skip','2026-11-01',[null,q('1','unlearned'),q('','wrong'),q('2','unknown')]),
    run('retry','2026-11-02',[q('1','wrong','invalid')]),
    run('off','2026-11-03',[q('1','independent')],{track:'other'})];
  assert.deepEqual(build({attempts}),[]);
  assert.deepEqual(build({attempts,day:'bad'}),[]);
});

test('a selected unit can be restricted to an exact book, including legacy records without a book ID',()=>{
  const attempts=[undefined,'A','B'].map(bookId=>run('same','2026-11-01',
    [q('1',bookId === 'A' ? 'independent' : 'wrong')],{bookId}));
  assert.deepEqual(build({attempts,unitId:'1'})[0].initial,counts(3,3,1));
  assert.deepEqual(build({attempts,unitId:'1',bookId:'A'})[0].initial,counts(1,1,1));
  assert.deepEqual(build({attempts,unitId:'1',bookId:''})[0].initial,counts(1,1,0));
  assert.deepEqual(build({attempts,unitId:'1',bookId:'C'}),[]);
});
