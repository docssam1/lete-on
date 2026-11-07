import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const window = {}, context = vm.createContext({window});
for (const file of ['planner-weekly-model.js','planner-weekly-schedule.js'])
  vm.runInContext(readFileSync(new URL(file,import.meta.url),'utf8'), context, {filename: file});
const W = window.PlannerWeeklyModel, S = window.PlannerWeeklySchedule;
const targets = {curriculum:4, arithmetic:5, thinking:2};
const start = () => W.start('2026-11-01', targets);
const sources = [{id:'school', current:'현재 교과', blocks:[
  {title:'교과 1', start:0, end:1}, {title:'교과 2', start:1, end:3}
]}, {id:'calc', blocks:[
  {title:'연산 1', start:0, end:.5, studyDays:8}, {title:'연산 2', start:.5, end:3, studyDays:50}
]}, {id:'thinking', blocks:[{title:'사고력 1', start:0, end:1},{title:'사고력 2',start:1,end:3}]}];
const courses = S.snapshot(sources);

test('each axis uses its own accepted pace, real dated weeks and confirmed actuals', () => {
  const baseline = S.model(start(), courses, '2026-11-08');
  const recorded = W.review(start(), {dueDate:'2026-11-08',completed:{curriculum:2,arithmetic:5,thinking:2},
    nextTargets:{curriculum:2,arithmetic:5,thinking:0}}, '2026-11-08');
  const m = S.model(recorded, courses, '2026-11-08');
  assert.equal(m.weeks[0].start, '2026-11-08');
  assert.equal(m.weeks[0].tracks.curriculum.carry, 2);
  assert.equal(m.weeks[1].tracks.curriculum.carry, 0);
  assert.equal(m.weeks[0].tracks.curriculum.pace, 2);
  assert.equal(m.weeks[0].tracks.thinking.items.length, 0);
  assert.ok(!m.transitions.thinking);
  assert.ok(m.transitions.curriculum.weekStart > baseline.transitions.curriculum.weekStart);
  assert.equal(m.transitions.arithmetic.weekStart, '2026-11-08');
  assert.equal(m.weeks[0].tracks.arithmetic.items[0].sessions, 3);
  assert.equal(m.weeks[0].tracks.arithmetic.items[1].sessions, 2);
  assert.equal(m.weeks[3].end,'2026-12-05');
});

test('overdue and future programs neither move through books nor create catch-up load', () => {
  const overdue = S.model(start(), courses, '2027-01-20');
  assert.equal(overdue.phase,'due');
  assert.equal(overdue.weeks[0].start,'2027-01-17');
  assert.equal(overdue.weeks[0].tracks.arithmetic.items[0].title,'연산 1');
  assert.equal(overdue.weeks[0].tracks.arithmetic.carry,0);
  const future = S.model(start(), courses, '2026-10-01');
  assert.equal(future.phase,'scheduled');
  assert.equal(future.weeks[0].start,'2026-11-01');
});

test('the snapshot uses selected personal courses, excludes unrelated lanes and survives new intake', () => {
  const path = {lanes:[{id:'school', blocks:[{title:'맞춤 교과',start:0,end:1}]},
    {id:'goalPreparation', blocks:[{title:'학교 전형일',start:0,end:1}]}]};
  const rows = S.lanes({lanes:sources}, path, null);
  const saved = S.snapshot(rows);
  path.lanes[0].blocks[0].title = '다른 자녀의 교재';
  assert.equal(saved.tracks.curriculum.blocks[0].title,'맞춤 교과');
  assert.equal(saved.tracks.arithmetic.blocks[0].title,'연산 1');
  assert.equal(Object.keys(saved.tracks).length,3);
  assert.equal(S.render(null,saved,'map'),'');
  assert.doesNotMatch(S.render(start(),saved,'map','2026-11-01'), /학교 전형일|다른 자녀/);
  assert.match(S.render(start(),saved,'table','2026-11-01'), /2026-11-22/);
});

test('a paused track gains a usable date estimate when first resumed and missing courses stay explicit', () => {
  const s = W.start('2026-11-01',{...targets,curriculum:0});
  const revised = W.review(s, {dueDate:'2026-11-08',completed:{...targets,curriculum:0},
    nextTargets:targets},'2026-11-08');
  const m = S.model(revised,courses,'2026-11-08');
  assert.equal(m.weeks[0].tracks.curriculum.items[0].title,'교과 1');
  assert.equal(m.transitions.curriculum.title,'교과 2');
  assert.equal(m.transitions.curriculum.weekStart,'2026-12-06');
  const safe = S.restore({version:1, tracks:{curriculum:{blocks:[{title:'x', start:'1',end:4}]}}});
  assert.ok(!safe.tracks.curriculum.blocks.length);
  assert.match(S.render(start(),safe,'table','2026-11-01'), /공부할 범위 확인/);
});

test('turning on an inactive track requests its study range and never schedules intake placeholders as books', () => {
  for (const current of ['아직 시작 전', '잘 모르겠어요', '미선택', '공부한 경험 없음', '확인 대기', '—']) {
    const saved = S.snapshot([{id:'calc', current, blocks:[{title:current,start:0,end:1}]}]);
    assert.equal(saved.tracks.arithmetic.current,'');
    assert.equal(saved.tracks.arithmetic.blocks.length,0);
    const m = S.model(start(),saved,'2026-11-01');
    assert.equal(m.weeks[0].tracks.arithmetic.items[0].title,'공부할 범위 확인');
    assert.ok(!m.transitions.arithmetic);
  }
  assert.equal(S.snapshot([{id:'thinking', current:'미정인 공부',status:'pending'}]).tracks.thinking.current,'');
  assert.equal(S.restore({version:1,tracks:{arithmetic:{current:'아직 시작 전'}}}).tracks.arithmetic.current,'');
});
