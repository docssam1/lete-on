import assert from 'node:assert/strict';
import test from 'node:test';
import './planner-weekly-model.js';
import './planner-unit-checks.js';
import './planner-unit-trend.js';

const checks = globalThis.PlannerUnitChecks;
const weekly = globalThis.PlannerWeeklyModel;
const {build} = globalThis.PlannerUnitTrend;
const monday = '2026-10-05';
const week = n => weekly.addDays(monday, n * 7);
const mock = (id, unitId, paperId, reviewOf) => ({id, unitId, paperId, reviewOf, kind: 'mock', title: id});
const a = mock('polynomial-2', '다항식', '2026-06');
const b = mock('polynomial-9', '다항식', '2026-06');
const c = mock('matrix-7', '행렬', '2026-06');
const mark = (records, item, field, n, value = true, day = week(n)) =>
  checks.update(records, {weekStart: week(n), item, field, value, day});
const trace = (records, n) => build({records, day: week(n)});

test('multiple weak questions in a unit occupy one level and same-week marks update the current point', () => {
  let records = mark(null, a, 'studied', 0);
  records = mark(records, b, 'studied', 0);
  const first = trace(records, 0);
  assert.equal(first.latest.gap, -1);
  assert.equal(first.latest.change, null);
  assert.equal(first.previous, null);
  assert.equal(first.latest.status, 'recorded');
  records = mark(records, c, 'studied', 0);
  assert.equal(trace(records, 0).latest.gap, -2);
  records = mark(records, a, 'solo', 1);
  let trend = trace(records, 1);
  assert.deepEqual(trend.points.map(point => point.gap), [-2,-2]);
  assert.equal(trend.latest.completed, 1);
  records = mark(records, b, 'solo', 1);
  trend = trace(records, 1);
  assert.deepEqual(trend.points.map(point => point.gap), [-2,-1]);
  assert.equal(trend.latest.completed, 1);
  assert.equal(trend.latest.target, null);
  assert.equal(trend.latest.change, 1);
  records = mark(records, c, 'solo', 2);
  assert.equal(trace(records, 2).latest.gap, 0);
});

test('only actual observations produce points; unfinished units persist across silent weeks', () => {
  let records = mark(null, a, 'studied', 0);
  records = mark(records, c, 'studied', 3);
  const trend = trace(records, 15);
  assert.equal(trend.points.length, 8);
  assert.ok(trend.points.every(p => p.gap === null));
  assert.deepEqual([trend.previous.gap, trend.latest.gap], [-1,-2]);
  assert.deepEqual(trace(records, 4).points.map(p => p.status), ['recorded','unrecorded','unrecorded','recorded','ongoing']);
  const program = weekly.start(week(0), {curriculum: 5, arithmetic: 3, thinking: 2});
  const unknown = build({program, day: week(25)});
  assert.ok(unknown.points.every(p => p.gap === null));
  assert.equal(unknown.latest, null);
});

test('alternate-year mastery resolves only its original, and undo reopens the unit', () => {
  const fresh = mock('polynomial-2025-3', a.unitId, '2025-06', [a.id]);
  let records = mark(null, a, 'studied', 0);
  records = mark(records, fresh, 'solo', 2);
  records = mark(records, c, 'solo', 2);
  let trend = trace(records, 2);
  assert.deepEqual(trend.points.map(p => p.gap), [-1,null,0]);
  assert.equal(trend.latest.completed, 2);
  records = mark(records, fresh, 'solo', 2, false);
  assert.deepEqual(trace(records, 2).points.map(p => p.gap), [-1,null,-1]);
  records = mark(records, c, 'solo', 2, false);
  trend = trace(records, 2);
  assert.equal(trend.previous, null);
  assert.equal(trend.latest.gap, -1);
  assert.equal(trend.points.at(-1).status, 'ongoing');
});

test('a new start weekday re-groups original observation dates and preserves earlier checklists', () => {
  const sunday = '2026-10-11';
  const program = weekly.start(sunday, {curriculum: 5, arithmetic: 3, thinking: 2});
  let records = mark(null, a, 'studied', 0, true, '2026-10-10');
  records = mark(records, b, 'solo', 0, true, sunday);
  const saturday = build({records, program, day: '2026-10-10'});
  assert.equal(saturday.latest.start, '2026-10-04');
  assert.equal(saturday.latest.completed, 0);
  const changed = build({records, program, day: sunday});
  assert.deepEqual(changed.points.map(p => [p.start,p.gap,p.completed]), [
    ['2026-10-04',-1,0], ['2026-10-11',-1,1]
  ]);
  records = mark(records, c, 'studied', 1, true, '2026-10-14');
  assert.equal(build({records,program,day: sunday}).latest.gap, -1);
  assert.equal(build({records,program,day: '2026-10-14'}).latest.gap, -2);
  assert.equal(build({program,day: '2026-10-10'}).phase, 'scheduled');
});
