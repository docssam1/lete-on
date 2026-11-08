/* Compare each submitted week with the goal that applied to that week. */
(function (global) {
  'use strict';
  const weekly = global.PlannerWeeklyModel;
  const weekMs = 7 * 86400000;

  function build({program, day = weekly.today(), track = 'all', limit = 8} = {}) {
    if (!weekly.TRACKS.includes(track)) track = 'all';
    const result = {phase: 'unconfigured', track, points: [], latest: null, previous: null, archived: false};
    const state = weekly.restore(program);
    const calendar = weekly.view(state, day);
    if (!calendar) return result;
    if (calendar.phase === 'scheduled') return {...result, phase: 'scheduled'};

    const {startDate, prior} = state;
    const weekNumber = start => 1 + (Date.parse(start) - Date.parse(startDate)) / weekMs;
    const total = counts => track === 'all' ? weekly.TRACKS.reduce((sum, key) => sum + counts[key], 0) : counts[track];
    const liveWeek = weekNumber(calendar.liveWeekStart);
    const firstAvailableWeek = prior ? weekNumber(prior.dueDate) : 1;
    const windowSize = Number.isInteger(limit) ? Math.min(weekly.HISTORY_LIMIT, Math.max(1, limit)) : 8;
    const firstVisibleWeek = Math.max(firstAvailableWeek, liveWeek - windowSize + 1);
    const records = state.history.filter(row => row.recordedOn <= day);
    const lastBoundary = records.at(-1)?.dueDate || prior?.dueDate || startDate;
    result.phase = calendar.liveWeekStart > lastBoundary ? 'due' : 'active';
    result.archived = !!prior && prior.trend?.from !== startDate;

    // Do not infer a loss for a missed check-in, or a gain simply because a
    // past observation scrolled off the screen. Carry only confirmed differences.
    let gap = prior?.trend ? total(prior.trend.gap) : 0;
    const observed = new Map();
    for (const row of records) {
      const start = weekly.addDays(row.dueDate, -7);
      const target = total(row.targets), completed = total(row.completed);
      const change = completed - target;
      gap += change;
      const point = {weekNumber: weekNumber(start), start, end: weekly.addDays(start, 6), target,
        completed, change, gap, status: 'recorded'};
      observed.set(point.weekNumber, point);
      result.previous = result.latest;
      result.latest = point;
    }

    // The weekly model keeps the most recently chosen pace for all following
    // weeks until a family submits another review and selects a new pace.
    let pace = prior?.nextTargets || state.initialTargets;
    let nextReview = 0;
    for (let n = firstVisibleWeek; n <= liveWeek; n++) {
      const start = weekly.addDays(startDate, (n - 1) * 7);
      while (nextReview < records.length && records[nextReview].dueDate <= start) {
        pace = records[nextReview++].nextTargets;
      }
      result.points.push(observed.get(n) || {weekNumber: n, start, end: weekly.addDays(start, 6), target: total(pace),
        completed: null, change: null, gap: null, status: n === liveWeek ? 'ongoing' : 'unrecorded'});
    }
    return result;
  }
  global.PlannerWeeklyTrend = Object.freeze({build});
})(typeof window === 'undefined' ? globalThis : window);
