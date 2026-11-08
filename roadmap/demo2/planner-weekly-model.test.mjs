import assert from 'node:assert/strict';
import test from 'node:test';
import './planner-weekly-model.js';

const M = globalThis.PlannerWeeklyModel;
const counts = (curriculum, arithmetic, thinking) => ({curriculum, arithmetic, thinking});
const initial = counts(3, 5, 2);
const start = () => M.start('2026-11-07', initial);
const review = (state, dueDate, completed, nextTargets, day = dueDate) =>
  M.review(state, {dueDate, completed, nextTargets}, day);

test('first check is after seven Seoul calendar days even across year/leap boundaries', () => {
  const state = M.start('2028-02-23', initial);
  assert.equal(M.view(state, '2028-02-22').phase, 'scheduled');
  assert.equal(M.view(state, '2028-02-23').phase, 'active');
  assert.equal(M.view(state, '2028-02-29').phase, 'active');
  const check = M.view(state, '2028-03-01');
  assert.equal(check.phase, 'due');
  assert.deepEqual([check.weekStart, check.weekEnd, check.dueDate, check.nextDueDate],
    ['2028-02-23', '2028-02-29', '2028-03-01', '2028-03-08']);
  assert.equal(M.today(new Date('2026-12-31T14:59:59Z')), '2026-12-31');
  assert.equal(M.today(new Date('2026-12-31T15:00:00Z')), '2027-01-01');
  assert.equal(M.view(M.start('2026-12-29', initial), '2027-01-05').phase, 'due');
});

test('independent paces carry old sessions inside capacity, including paused tracks', () => {
  const first = review(start(), '2026-11-14', counts(0, 4, 2), counts(1, 5, 3));
  let week = M.view(first, '2026-11-14');
  assert.deepEqual(week.targets, counts(1, 5, 3));
  assert.deepEqual(week.backlog, counts(3, 1, 0));
  assert.deepEqual(week.carry, counts(1, 1, 0));
  assert.equal(week.weekStart, '2026-11-14');
  assert.equal(week.phase, 'active');
  const second = review(first, '2026-11-21', counts(1, 3, 3), counts(0, 2, 3));
  week = M.view(second, '2026-11-21');
  assert.deepEqual(week.backlog, counts(2, 2, 0));
  assert.deepEqual(week.carry, counts(0, 2, 0));
  assert.deepEqual(week.targets, counts(0, 2, 3));
  const third = review(second, '2026-11-28', counts(0, 2, 3), counts(2, 2, 3));
  assert.deepEqual(M.view(third, '2026-11-28').carry, counts(2, 0, 0));
  assert.deepEqual(third.history[0].targets, initial);
  assert.deepEqual(third.history[1].targets, counts(1, 5, 3));
  assert.deepEqual(M.totals(third), counts(1, 9, 8));
  assert.deepEqual(M.restore(JSON.parse(JSON.stringify(third))), third);
});

test('unrecorded weeks stay unknown; only the most recent finished week can be recorded', () => {
  const state = start();
  const overdue = M.view(state, '2026-12-03');
  assert.equal(overdue.weekNumber, 3);
  assert.equal(overdue.weekStart, '2026-11-21');
  assert.equal(overdue.dueDate, '2026-11-28');
  assert.equal(overdue.nextDueDate, '2026-12-05');
  assert.equal(overdue.skippedWeeks, 2);
  assert.equal(overdue.liveWeekStart, '2026-11-28');
  const old = review(state, '2026-11-14', counts(0, 0, 0), initial, '2026-12-03');
  assert.deepEqual(old, state);
  const late = review(state, '2026-11-28', counts(2, 6, 1), counts(2, 5, 1), '2026-12-03');
  assert.equal(late.history.length, 1);
  assert.equal(late.history[0].recordedOn, '2026-12-03');
  assert.deepEqual(M.view(late, '2026-12-03').backlog, counts(1, 0, 1));
  assert.equal(M.view(late, '2026-12-03').dueDate, '2026-12-05');
  assert.deepEqual(review(late, '2026-11-28', counts(1, 1, 1), counts(0, 0, 0), '2026-12-04'), late);
});

test('invalid/partial or premature submissions leave prior data intact', () => {
  const state = start();
  assert.equal(M.start('2026-02-30', initial), null);
  assert.equal(M.start('2026-11-07', counts(-1, 0, 0)), null);
  assert.equal(M.start('2026-11-07', counts(22, 0, 0)), null);
  for (const completed of [counts('', 2, 1), counts(null, 2, 1), counts(0.1, 0, 0),
    counts(100, 2, 1), {arithmetic: 0, thinking: 0}]) {
    assert.deepEqual(review(state, '2026-11-14', completed, initial), state);
  }
  assert.deepEqual(review(state, '2026-11-14', counts(0, 0, 0), initial, '2026-11-13'), state);
  assert.deepEqual(review(state, '2026-11-14', counts(0, 0, 0), counts(2, 0, -1)), state);
  const paused = review(state, '2026-11-14', counts(0, 0, 0), counts(0, 0, 0));
  assert.deepEqual(paused.history[0].completed, counts(0, 0, 0));
  assert.deepEqual(state.history, []);
});

test('history compacts without changing real totals, pending work or later pace', () => {
  let state = start();
  for (let week = 1; week <= M.HISTORY_LIMIT + 4; week++) {
    state = review(state, M.addDays(state.startDate, week * 7), counts(1, 4, 2), initial);
  }
  assert.equal(state.history.length, M.HISTORY_LIMIT);
  assert.equal(state.prior.dueDate, M.addDays(state.startDate, 4 * 7));
  assert.deepEqual(state.prior.completedTotals, counts(4, 16, 8));
  assert.deepEqual(M.totals(state), counts(56, 224, 112));
  assert.deepEqual(M.restore(JSON.parse(JSON.stringify(state))), state);
  assert.deepEqual(state.history.at(-1).backlog, counts(2, 1, 0));
});

test('restore keeps only known fields and derives evidence from valid weekly boundaries', () => {
  const state = review(start(), '2026-11-14', counts(1, 2, 1), counts(2, 2, 1));
  const valid = state.history[0];
  const dirty = {...state, misc: 'ignored', history: [
    {...valid, dueDate: '2026-11-13'}, {...valid, backlog: counts(21, 21, 21), unrelated: '<bad>'},
    {...valid, dueDate: '2026-11-21', recordedOn: '2026-11-28'}
  ]};
  assert.deepEqual(M.restore(dirty), state);
});

test('a paused track uses its first active pace as the fixed course basis even after compaction', () => {
  let state = M.start('2026-11-07', counts(0, 4, 0));
  assert.deepEqual(M.baseTargets(state), counts(0, 4, 0));
  for (let week = 1; week <= 60; week++) {
    const targets = counts(week === 1 ? 0 : week === 2 ? 2 : 4, 6, 0);
    state = review(state, M.addDays(state.startDate, week * 7), counts(0, 0, 0), targets);
  }
  assert.deepEqual(state.history[0].nextTargets, counts(4, 6, 0));
  assert.deepEqual(M.baseTargets(state), counts(2, 4, 0));
  assert.deepEqual(M.baseTargets(M.restore(state)), counts(2, 4, 0));
});

test('a suggested lighter pace keeps each active area available and leaves paused areas at zero', () => {
  assert.deepEqual(M.suggest(initial, counts(0, 4, 5)), counts(1, 4, 2));
  assert.deepEqual(M.suggest(counts(0, 1, 0), counts(3, 0, 0)), counts(0, 1, 0));
  assert.equal(M.suggest(initial, counts(0, '', 0)), null);
});
