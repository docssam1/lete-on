// Compare cumulative independent solving with the dated target for a single textbook.
(function (global) {
  'use strict';

  const DAY = 86400000;
  const EPSILON = 1e-8;
  const units = ['page', 'chapter'];

  function validDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const time = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
  }

  function dayNumber(date) { return Date.parse(date + 'T00:00:00Z') / DAY; }
  function calendarDay(value) {
    if (!Number.isFinite(value) || value < dayNumber('0000-01-01') || value > dayNumber('9999-12-31')) return null;
    return new Date(Math.ceil(value - EPSILON) * DAY).toISOString().slice(0, 10);
  }
  function validPosition(value) { return Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER; }

  function normalizeGoal(raw) {
    if (!raw || !units.includes(raw.unit) || !validDay(raw.startDate) || !validDay(raw.endDate) ||
      raw.startDate >= raw.endDate || !validPosition(raw.startPosition) || !validPosition(raw.endPosition) ||
      raw.startPosition >= raw.endPosition || (raw.milestones != null && !Array.isArray(raw.milestones))) return null;

    const byDate = new Map([[raw.startDate, raw.startPosition], [raw.endDate, raw.endPosition]]);
    for (const mark of raw.milestones || []) {
      if (!validDay(mark?.date) || !validPosition(mark.position) || mark.date < raw.startDate ||
        mark.date > raw.endDate || (byDate.has(mark.date) && byDate.get(mark.date) !== mark.position)) return null;
      byDate.set(mark.date, mark.position);
    }
    const milestones = [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, position]) => ({date, position}));
    if (milestones.some((mark, i) => i && mark.position < milestones[i - 1].position)) return null;
    return {startDate: raw.startDate, endDate: raw.endDate, startPosition: raw.startPosition,
      endPosition: raw.endPosition, unit: raw.unit, milestones};
  }

  function plannedPosition(goal, date) {
    if (!goal || date < goal.startDate) return null;
    if (date >= goal.endDate) return goal.endPosition;
    const index = goal.milestones.findIndex(mark => mark.date > date);
    const a = goal.milestones[index - 1], b = goal.milestones[index];
    const fraction = (dayNumber(date) - dayNumber(a.date)) / (dayNumber(b.date) - dayNumber(a.date));
    return a.position + (b.position - a.position) * fraction;
  }

  // A target can pause at one position. Use the nearest matching day instead
  // of turning that planned pause into a lead or lag for an on-schedule child.
  function equivalentDays(goal, day, position, gap) {
    if (gap == null || position < goal.startPosition || position > goal.endPosition) return null;
    if (Math.abs(gap) < EPSILON) return 0;
    const matches = [];
    for (let i = 1; i < goal.milestones.length; i++) {
      const a = goal.milestones[i - 1], b = goal.milestones[i];
      if (position < a.position || position > b.position) continue;
      if (a.position === b.position) {
        matches.push(dayNumber(a.date), dayNumber(b.date));
      } else {
        const fraction = (position - a.position) / (b.position - a.position);
        matches.push(dayNumber(a.date) + (dayNumber(b.date) - dayNumber(a.date)) * fraction);
      }
    }
    const equivalent = gap > 0 ? Math.min(...matches) : Math.max(...matches);
    return equivalent - dayNumber(day);
  }

  function forecast(goal, day, latest, currentGap, actualRate) {
    const result = (status, date = null, finishDate = null) => ({status, date, finishDate, asOf: latest?.date || null});
    if (!goal) return result('no-goal');
    if (day < goal.startDate) return result('not-started');
    if (!latest) return result('no-record');
    if (currentGap > EPSILON) return result('ahead');
    if (Math.abs(currentGap) < EPSILON) return result('on-plan');
    if (latest.target == null || (latest.date < day && latest.gap >= -EPSILON)) return result('check-again');
    if (actualRate == null) return result('need-records');
    if (actualRate <= 0) return result('no-gain');

    // Intersect a continuation of recent independent solving with each remaining
    // segment of the moving plan. Reaching the final page after the end date is
    // a finish estimate for this book alone, not a catch-up with the whole route.
    const lastDay = dayNumber(latest.date);
    let from = lastDay, balance = latest.gap;
    for (const mark of goal.milestones) {
      const until = dayNumber(mark.date);
      if (until <= from) continue;
      const next = latest.position + (until - lastDay) * actualRate - mark.position;
      if (next >= -EPSILON) {
        const meeting = calendarDay(from + (until - from) * -balance / (next - balance));
        if (meeting && meeting >= day) return result('catch', meeting);
        return result('check-again');
      }
      from = until;
      balance = next;
    }
    const finish = calendarDay(lastDay + (goal.endPosition - latest.position) / actualRate);
    if (finish && finish < day) return result('check-again');
    return result('after-goal', null, finish);
  }

  function build({goal: raw, observations = [], day = global.PlannerWeeklyModel.today(), unit} = {}) {
    const goal = normalizeGoal(raw);
    const points = [];
    const byDate = new Map();
    let scale = goal?.unit || unit;
    if (validDay(day)) for (const observation of Array.isArray(observations) ? observations : []) {
      if (!validDay(observation?.date) || observation.date > day || !validPosition(observation.position)) continue;
      if (observation.unit != null && (!units.includes(observation.unit) || (scale && observation.unit !== scale))) continue;
      if (!scale && observation.unit) scale = observation.unit;
      byDate.set(observation.date, observation);
    }
    for (const date of [...byDate.keys()].sort()) {
      const {position, label} = byDate.get(date);
      const target = plannedPosition(goal, date);
      points.push({date, position, label: typeof label === 'string' ? label : '', target,
        gap: target == null ? null : position - target});
    }
    const latest = points.at(-1) || null, previous = points.at(-2) || null;
    const currentTarget = validDay(day) ? plannedPosition(goal, day) : null;
    const currentGap = currentTarget != null && latest ? latest.position - currentTarget : null;
    const gapDays = currentGap == null ? null : equivalentDays(goal, day, latest.position, currentGap);
    let direction = 'unknown', actualRate = null, targetRate = null;
    if (latest && previous) {
      const elapsed = dayNumber(latest.date) - dayNumber(previous.date);
      actualRate = (latest.position - previous.position) / elapsed;
      if (latest.target != null && previous.target != null) {
        targetRate = (latest.target - previous.target) / elapsed;
        const delta = latest.gap - previous.gap;
        direction = Math.abs(delta) < EPSILON ? 'steady' : delta > 0 ? 'gaining' : 'losing';
      }
    }
    return {goal, day, points, latest, previous, currentTarget, currentGap, gapDays, direction, actualRate, targetRate,
      forecast: forecast(goal, day, latest, currentGap, actualRate)};
  }

  global.PlannerBookPace = Object.freeze({build, validDay, validGoal: raw => !!normalizeGoal(raw), normalizeGoal});
})(typeof window === 'undefined' ? globalThis : window);
