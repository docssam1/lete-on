import assert from 'node:assert/strict';
import test from 'node:test';
import './planner-weekly-model.js';
import './planner-weekly-trend.js';

const weekly = globalThis.PlannerWeeklyModel;
const {build} = globalThis.PlannerWeeklyTrend;
const startDate = '2026-09-01';
const counts = (curriculum, arithmetic = 0, thinking = 0) => ({curriculum, arithmetic, thinking});
const plan = (targets = counts(5)) => weekly.start(startDate, targets);
const week = (n, offset = 0) => weekly.addDays(startDate, n * 7 + offset);
const submit = (state, n, completed, nextTargets = counts(5), daysLate = 0) =>
  weekly.review(state, {dueDate: week(n), completed, nextTargets}, week(n, daysLate));

test('confirmed over- and under-target sessions can lead, fall behind, catch up and pass the plan', () => {
  let program = plan();
  [7, 1, 7, 6].forEach((count, i) => { program = submit(program, i + 1, counts(count)); });
  const trend = build({program, day: week(4)});
  assert.deepEqual(trend.points.map(p => p.gap), [2, -2, 0, 1, null]);
  assert.deepEqual(trend.points.map(p => p.change), [2, -4, 2, 1, null]);
  assert.equal(trend.latest.gap, 1);
  assert.equal(trend.previous.gap, 0);
  assert.equal(trend.points[0].start, startDate);
  assert.equal(trend.points[0].end, '2026-09-07');
  const recent = build({program, day: week(4), limit: 2});
  assert.deepEqual(recent.points.map(p => p.gap), [1, null]);
});

test('historic targets survive pace changes, and the three axes can be inspected separately', () => {
  let program = plan(counts(4, 2, 1));
  program = submit(program, 1, counts(1, 4, 1), counts(2, 0, 1));
  program = submit(program, 2, counts(4, 0, 0), counts(1, 4, 3));
  const points = track => build({program, day: week(2), track}).points;
  assert.deepEqual(points('all').map(p => p.target), [7, 3, 8]);
  assert.deepEqual(points('all').map(p => p.gap), [-1, 0, null]);
  assert.deepEqual(points('curriculum').map(p => p.gap), [-3, -1, null]);
  assert.deepEqual(points('arithmetic').map(p => p.gap), [2, 2, null]);
  assert.deepEqual(points('thinking').map(p => p.gap), [0, -1, null]);
});

test('missed and unfinished weeks have no point; an explicit zero is a real observation', () => {
  let program = submit(plan(), 1, counts(7), counts(2));
  program = submit(program, 3, counts(0), counts(2), 2);
  const beforeSubmission = build({program, day: week(3, 1)});
  assert.equal(beforeSubmission.phase, 'due');
  assert.deepEqual(beforeSubmission.points.map(p => p.gap), [2, null, null, null]);
  const result = build({program, day: week(3, 2)});
  assert.equal(result.phase, 'active');
  assert.deepEqual(result.points.map(p => p.gap), [2, null, 0, null]);
  assert.deepEqual(result.points.map(p => p.status), ['recorded','unrecorded','recorded','ongoing']);
  assert.deepEqual(result.points.map(p => p.completed), [7, null, 0, null]);
  assert.deepEqual(result.points.map(p => p.target), [5, 2, 2, 2]);
  const afterLongAbsence = build({program, day: week(25)});
  assert.equal(afterLongAbsence.latest.weekNumber, 3);
  assert.equal(afterLongAbsence.points.length, 8);
  assert.ok(afterLongAbsence.points.every(p => p.gap === null));
});

test('no synthetic baseline before the family starts or reports, including a future start', () => {
  assert.equal(build({}).phase, 'unconfigured');
  const later = build({program: plan(), day: '2026-08-31'});
  assert.equal(later.phase, 'scheduled');
  assert.deepEqual(later.points, []);
  const active = build({program: plan(), day: startDate});
  assert.equal(active.latest, null);
  assert.equal(active.points[0].status, 'ongoing');
  assert.equal(active.points[0].gap, null);
  assert.equal(build({program: plan(), day: '2026-02-30'}).phase, 'unconfigured');
});

test('history trimming cannot move the line; a legacy archive never invents past targets', () => {
  let program = plan();
  const max = weekly.HISTORY_LIMIT;
  for (let n = 1; n <= max + 1; n++) program = submit(program, n, counts(7));
  assert.equal(program.prior.trend.gap.curriculum, 2);
  let trend = build({program: JSON.parse(JSON.stringify(program)), day: week(max + 1)});
  assert.equal(trend.latest.gap, 2 * (max + 1));
  assert.equal(trend.archived, false);
  const legacy = structuredClone(program);
  delete legacy.prior.trend;
  trend = build({program: legacy, day: week(max + 1)});
  assert.equal(trend.latest.gap, 2 * max);
  assert.equal(trend.archived, true);
  const repaired = submit(legacy, max + 2, counts(3));
  trend = build({program: repaired, day: week(max + 2)});
  assert.equal(trend.previous.gap, 2 * max);
  assert.equal(trend.latest.gap, 2 * max - 2);
  assert.equal(trend.archived, true);
});
