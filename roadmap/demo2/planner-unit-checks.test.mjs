import test from 'node:test';
import assert from 'node:assert/strict';
import './planner-weekly-model.js';
import './planner-unit-checks.js';

const M = globalThis.PlannerUnitChecks;
const week = '2026-11-08', next = '2026-11-15';
const algebra = {kind:'book', track:'curriculum', id:'book-1:c1-poly', unitId:'c1-poly', title:'기본정석 · 다항식', unitLabel:'다항식', detail:'현재 교재 범위'};
const question = {kind:'mock', track:'curriculum', id:'mock-2025-3:7', unitId:'c1-poly', title:'2025 고1 3월 7번', unitLabel:'다항식', questionNumber:7, paperId:'2025-3', url:'https://example.org/math.pdf'};
const arithmetic = {kind:'book', track:'arithmetic', id:'calc-1:div', unitId:'calc-div', title:'나눗셈', unitLabel:'나눗셈'};
const mark = (state, item, field, value = true, when = week) => M.update(state, {weekStart:when, item, field, value});
const inspect = (raw, when = week, items = [algebra, question, arithmetic]) => M.view(raw, {weekStart:when,items});
const copy = data => JSON.parse(JSON.stringify(data));

test('checklist weeks follow the family start date; an unset date uses Monday', () => {
  assert.equal(M.weekStart('2026-11-08'), '2026-11-02');
  assert.equal(M.weekStart('2026-11-09'), '2026-11-09');
  assert.equal(M.weekStart('2026-11-15',week), next);
  assert.equal(M.weekStart('2026-11-07',week), week);
  assert.equal(M.weekStart('2027-01-01','2026-11-05'), '2026-12-31');
  assert.equal(M.weekStart('2028-03-01','2028-02-23'), '2028-03-01');
  assert.equal(M.weekStart('2026-02-31'), null);
});

test('only explicit marks schedule work; the two flags can be changed independently', () => {
  assert.deepEqual(inspect(null).nextReview, []);
  let state = mark(null, algebra, 'solo');
  assert.deepEqual([inspect(state).rows[0].studied, inspect(state).rows[0].solo], [false,true]);
  assert.deepEqual(inspect(state).nextReview, []);
  state = mark(state, algebra, 'studied');
  const before = copy(state);
  state = mark(state, algebra, 'solo', false);
  assert.deepEqual(M.mastered(before, week), []);
  assert.deepEqual(M.mastered(before, next), [algebra.id]);
  assert.deepEqual(M.mastered(state, next), []);
  assert.deepEqual(inspect(state).nextReview, [{unitId:'c1-poly',unitLabel:'다항식',dueWeek:next,items:[algebra]}]);
  state = mark(state, algebra, 'studied', false);
  assert.deepEqual(state, M.restore(null));
  assert.deepEqual(inspect(state).nextReview, []);
});

test('related book and exam questions are grouped but checking one never resolves others', () => {
  let state = mark(null, algebra, 'studied');
  state = mark(state, question, 'studied');
  state = mark(state, arithmetic, 'studied');
  const planned = inspect(state).nextReview;
  assert.deepEqual(planned.map(x => [x.unitId,x.items.map(i => i.id)]), [
    ['c1-poly',[algebra.id,question.id]], ['calc-div',[arithmetic.id]]
  ]);
  assert.deepEqual(inspect(state, next, []).rows.map(i=>[i.id,i.studied,i.solo,i.review,i.dueWeek]), [
    [algebra.id,false,false,true,next],[question.id,false,false,true,next],[arithmetic.id,false,false,true,next]
  ]);
  state = mark(state, algebra, 'solo', true, next);
  assert.deepEqual(inspect(state, next, []).nextReview[0].items,[question]);
  const later = inspect(copy(state), '2026-12-13', []);
  assert.deepEqual(later.rows.map(i=>i.id),[question.id,arithmetic.id]);
  assert.equal(later.rows[0].url,question.url);
  assert.equal(later.rows[0].dueWeek,next);
  assert.deepEqual(later.nextReview.map(g=>g.dueWeek),['2026-12-20','2026-12-20']);
});

test('undoing a next-week mastery or study mark restores the outstanding remediation', () => {
  const first = mark(null, question, 'studied');
  let remedial = mark(first, question, 'solo', true, next);
  const clicked = inspect(remedial, next, []).rows[0];
  assert.equal(clicked.solo,true);
  assert.equal(clicked.review,true);
  remedial = mark(remedial, question, 'solo', false, next);
  assert.deepEqual(remedial,first);
  remedial = mark(remedial, question, 'studied', true, next);
  assert.equal(inspect(remedial, next).nextReview[0].dueWeek,'2026-11-22');
  assert.equal(inspect(remedial, '2026-12-13', []).rows[0].dueWeek,'2026-11-22');
  remedial = mark(remedial, question, 'studied', false, next);
  assert.deepEqual(remedial,first);
});

test('a changed book or a different year and question does not inherit checked boxes', () => {
  const original = mark(null, question, 'studied');
  const fresh = {...question,id:'mock-2024-3:9',questionNumber:9,paperId:'2024-3',title:'2024 고1 3월 9번'};
  const result = inspect(original,next,[fresh,fresh]);
  assert.deepEqual(result.rows.map(i=>[i.id,i.review,i.studied]), [[question.id,true,false],[fresh.id,false,false]]);
  assert.equal(result.nextReview[0].items[0].paperId,'2025-3');
  assert.deepEqual(inspect(original, week, []).rows.map(x=>x.id),[question.id]);
  assert.deepEqual(inspect(original, '2026-11-01', []).rows,[]);
});

test('old or malformed saves are normalized, and user-provided wrong fields are never executed', () => {
  assert.deepEqual(M.restore({version:0,entries:[]}),{version:1,entries:[]});
  const raw = {version:1,entries:[{item:{...question,url:'javascript:alert(1)'}, marks:[[week,1], ['2026-02-31',1], [next,'1']]}]};
  const saved = M.restore(raw);
  assert.equal(saved.entries[0].item.url,undefined);
  assert.deepEqual(saved.entries[0].marks,[[week,1]]);
  assert.deepEqual(mark(saved,question,'solo','yes'),saved);
  assert.deepEqual(mark(saved,question,'bad'),saved);
  assert.deepEqual(mark(saved,question,'solo',true,'2026-02-31'),saved);
  assert.deepEqual(M.restore(copy(saved)),saved);
});

test('changing the learning-start weekday keeps observations made during the newly displayed week editable', () => {
  const monday = '2026-11-02';
  let state = M.update(null,{weekStart:monday,item:algebra,field:'studied',value:true,day:week});
  assert.equal(inspect(state,week,[]).rows[0].studied,true);
  assert.equal(inspect(state,week,[]).rows[0].review,false);
  assert.equal(inspect(state,week,[]).nextReview[0].dueWeek,next);
  state = M.update(state,{weekStart:week,item:algebra,field:'studied',value:false,day:week});
  assert.deepEqual(state,M.restore(null));
});

test('an alternate-year independent check closes only the originally linked weak question and can be undone', () => {
  const other = {...question,id:'2025-3:8',questionNumber:8};
  const otherUnit = {...question,id:'2025-3:2',unitId:'c1-matrix'};
  const fresh = {...question,id:'mock-2024-3:9',questionNumber:9,paperId:'2024-3',reviewOf:[question.id,otherUnit.id]};
  let state = mark(null,question,'studied');
  state = mark(state,other,'studied');
  state = mark(state,otherUnit,'studied');
  state = mark(state,fresh,'solo',true,next);
  const carried = inspect(copy(state),'2026-11-22',[]).rows.map(row=>row.id);
  assert.deepEqual(carried,[other.id,otherUnit.id]);
  assert.deepEqual(M.mastered(state,'2026-11-22'),[fresh.id]);
  state = mark(state,fresh,'solo',false,next);
  assert.deepEqual(inspect(state,'2026-11-22',[]).rows.map(row=>row.id),[question.id,other.id,otherUnit.id]);
});

test('a past solo check on a question does not close a later assignment linked to a new weak original', () => {
  const fresh = {...question,id:'mock-2024-3:9',questionNumber:9,paperId:'2024-3'};
  let state = mark(null,fresh,'solo');
  state = mark(state,question,'studied',true,week);
  state = mark(state,{...fresh,reviewOf:[question.id]},'studied',true,next);
  assert.deepEqual(inspect(state,next,[]).nextReview[0].items.map(item=>item.id).sort(),[question.id,fresh.id].sort());
});

test('a recheck already scheduled as practice keeps its remediation links and appears once', () => {
  const before = mark(null,question,'studied');
  const fresh = {...question,id:'mock-2024-3:9',paperId:'2024-3'};
  const rows = inspect(before,next,[fresh,{...fresh,reviewOf:[question.id]}]).rows;
  const same = rows.filter(row=>row.id===fresh.id);
  assert.equal(same.length,1);
  assert.deepEqual(same[0].reviewOf,[question.id]);
  const after = mark(before,same[0],'solo',true,next);
  assert.deepEqual(inspect(after,'2026-11-22',[]).rows,[]);
});
