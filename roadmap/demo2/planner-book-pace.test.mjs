import assert from 'node:assert/strict';
import test from 'node:test';
import './planner-weekly-model.js';
import './planner-book-pace.js';

const {build, normalizeGoal} = globalThis.PlannerBookPace;
const goal = {startDate:'2026-11-01',endDate:'2026-11-29',startPosition:0,endPosition:140,unit:'page'};
const obs = (date, position, unit = 'page') => ({date,position,unit});
const inspect = (observations, day, plan = goal) => build({goal:plan,observations,day});

test('a child can be behind and gaining; catch a moving 5-page/day target, not its current page', () => {
  const m = inspect([obs('2026-11-15',62),obs('2026-11-08',20)],'2026-11-15');
  assert.deepEqual(m.points.map(p=>[p.position,p.target,p.gap]),[[20,35,-15],[62,70,-8]]);
  assert.equal(m.direction,'gaining');
  assert.equal(m.actualRate,6);
  assert.equal(m.targetRate,5);
  assert.ok(Math.abs(m.gapDays+1.6)<1e-6);
  assert.deepEqual(m.forecast,{status:'catch',date:'2026-11-23',finishDate:null,asOf:'2026-11-15'});

  const late = inspect([obs('2026-11-08',20),obs('2026-11-15',62)],'2026-11-24');
  assert.equal(late.latest.gap,-8);
  assert.equal(late.currentGap,-53);
  assert.equal(late.direction,'gaining');
  assert.equal(late.forecast.status,'check-again');
  assert.equal(late.forecast.date,null);
});

test('a widening gap can yield a book finish date after deadline, but no route catch-up date', () => {
  const m = inspect([obs('2026-11-08',26),obs('2026-11-15',47)],'2026-11-15');
  assert.equal(m.currentGap,-23);
  assert.equal(m.direction,'losing');
  assert.deepEqual(m.forecast,{status:'after-goal',date:null,finishDate:'2026-12-16',asOf:'2026-11-15'});
  const closeTooLate = inspect([obs('2026-11-20',45),obs('2026-11-25',75)],'2026-11-25');
  assert.equal(closeTooLate.direction,'gaining');
  assert.equal(closeTooLate.forecast.status,'after-goal');
});

test('planned pauses and changing pace are honored, and fractions round up to an attainable calendar date', () => {
  const chapterGoal = {startDate:'2026-11-01',endDate:'2026-11-20',unit:'chapter',startPosition:0,endPosition:13,
    milestones:[{date:'2026-11-13',position:6},{date:'2026-11-07',position:6}]};
  const m = inspect([obs('2026-11-04',1,'chapter'),obs('2026-11-06',3,'chapter')],'2026-11-06',chapterGoal);
  assert.equal(m.latest.target,5);
  assert.equal(m.direction,'steady');
  assert.equal(m.forecast.date,'2026-11-09');
  assert.deepEqual(m.goal.milestones.map(p=>p.position),[0,6,6,13]);
  const onPause = inspect([obs('2026-11-09',6,'chapter')],'2026-11-09',chapterGoal);
  assert.equal(onPause.gapDays,0);
  const behind = inspect([obs('2026-11-15',6,'chapter')],'2026-11-15',chapterGoal);
  assert.equal(behind.gapDays,-2);
  const rounded = inspect([obs('2026-11-10',30),obs('2026-11-12',44)],'2026-11-12');
  assert.equal(rounded.forecast.date,'2026-11-18'); // 11-page deficit, 2 pages/day gain.
});

test('a single observation and stale last-on-plan are never evidence of widening or an ETA', () => {
  const one = inspect([obs('2026-11-08',24),obs('2026-12-03',140)],'2026-11-08');
  assert.equal(one.points.length,1);
  assert.equal(one.actualRate,null);
  assert.equal(one.direction,'unknown');
  assert.equal(one.forecast.status,'need-records');
  const seen = [obs('2026-11-08',35),obs('2026-11-15',70)];
  assert.equal(inspect(seen,'2026-11-15').forecast.status,'on-plan');
  const stale = inspect(seen,'2026-11-18');
  assert.equal(stale.forecast.status,'check-again');
  assert.equal(stale.latest.gap,0);
  assert.equal(stale.currentGap,-15);
  assert.equal(stale.direction,'steady');
  const early = inspect([obs('2026-11-08',40)],'2026-11-08');
  assert.equal(early.forecast.status,'ahead');
  assert.equal(early.gapDays,1);
});

test('same-day corrections, zero pace, mixed scales and invalid/future observations', () => {
  const m = inspect([obs('2026-11-08',15),obs('2026-11-08',12),obs('2026-11-11',12),obs('2026-11-13',50),
    obs('2026-11-10',2,'chapter'),obs('2026-13-01',23),obs('2026-11-09',Infinity)],'2026-11-11');
  assert.deepEqual(m.points.map(p=>p.position),[12,12]);
  assert.equal(m.forecast.status,'no-gain');
  assert.equal(m.direction,'losing');
  assert.equal(inspect([], '2026-11-01').forecast.status,'no-record');
  assert.equal(inspect([], '2026-10-25').forecast.status,'not-started');
  const unplanned = inspect([obs('2026-11-08',40)],'2026-11-12',{});
  assert.equal(unplanned.points[0].position,40);
  assert.equal(unplanned.latest.gap,null);
  assert.equal(unplanned.currentTarget,null);
  assert.equal(unplanned.forecast.status,'no-goal');
});

test('target knots validate, normalize round-trips and never invent target units before the goal starts', () => {
  assert.deepEqual(normalizeGoal(normalizeGoal(goal)),normalizeGoal(goal));
  assert.equal(normalizeGoal({...goal,endDate:'2026-11-31'}),null);
  assert.equal(normalizeGoal({...goal,milestones:[{date:goal.startDate,position:5}]}),null);
  assert.equal(normalizeGoal({...goal,milestones:[{date:'2026-11-11',position:80},{date:'2026-11-12',position:30}]}),null);
  assert.equal(normalizeGoal({...goal,unit:'percent'}),null);
  const before = inspect([obs('2026-10-25',30),obs('2026-10-29',40)],'2026-10-29');
  assert.equal(before.forecast.status,'not-started');
  assert.deepEqual(before.points.map(p=>p.target),[null,null]);
  assert.equal(before.direction,'unknown');
});
