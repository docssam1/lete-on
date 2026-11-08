/* Weekly snapshots of the same outstanding units shown by the checklist. */
(function (global) {
  'use strict';
  const weekly = global.PlannerWeeklyModel;
  const checks = global.PlannerUnitChecks;
  const weekMs = 7 * 86400000;
  const markDate = mark => mark[2] || mark[0];

  function build({records, program, day = weekly.today(), limit = 8} = {}) {
    const result = {phase: 'active', track: 'units', points: [], latest: null, previous: null, archived: false};
    if (!checks.weekStart(day)) return {...result, phase: 'unconfigured'};
    const startDate = weekly.restore(program)?.startDate;
    const snapshot = checks.restore(records);
    const dates = new Set();
    for (const entry of snapshot.entries) {
      entry.marks = entry.marks.filter(mark => markDate(mark) <= day);
      for (const mark of entry.marks) dates.add(markDate(mark));
    }
    if (!dates.size && startDate > day) return {...result, phase: 'scheduled'};

    // The family may have used the checklist before setting a weekly start
    // date. Extend its current weekday backwards to re-group those real marks.
    const earliest = [...dates].sort()[0] || day;
    const beforeStart = startDate ? Math.max(0, Math.ceil((Date.parse(startDate) - Date.parse(earliest)) / weekMs)) : 0;
    const anchor = startDate && weekly.addDays(startDate, -7 * beforeStart);
    const observedWeeks = [...new Set([...dates].map(date => checks.weekStart(date, anchor)))].sort();
    const current = checks.weekStart(day, anchor);
    const firstObserved = observedWeeks[0] || current;
    const origin = startDate && startDate < firstObserved ? startDate : firstObserved;
    const weekNumber = start => 1 + (Date.parse(start) - Date.parse(origin)) / weekMs;
    const windowSize = Number.isInteger(limit) ? Math.min(weekly.HISTORY_LIMIT, Math.max(1, limit)) : 8;
    const firstVisible = weekly.addDays(current, -7 * Math.min(weekNumber(current) - 1, windowSize - 1));

    // Resolve the window, its preceding observation, and the latest two real
    // observations even when a long gap has put both of them off screen.
    const index = observedWeeks.findIndex(start => start >= firstVisible);
    const firstVisibleIndex = index === -1 ? observedWeeks.length : index;
    const firstNeeded = Math.max(0, Math.min(firstVisibleIndex - 1, observedWeeks.length - 3));
    const observed = new Map();
    for (const start of observedWeeks.slice(firstNeeded)) {
      const view = checks.view(snapshot, {weekStart: start});
      const completed = new Set(view.rows.filter(row => row.solo).map(row => row.unitId)).size;
      const outstanding = view.nextReview.length;
      const gap = outstanding ? -outstanding : 0;
      const point = {weekNumber: weekNumber(start), start, end: weekly.addDays(start, 6), status: 'recorded',
        target: null, completed, gap, change: result.latest ? gap - result.latest.gap : null};
      observed.set(start, point);
      result.previous = result.latest;
      result.latest = point;
    }
    for (let start = firstVisible; start <= current; start = weekly.addDays(start, 7)) {
      result.points.push(observed.get(start) || {weekNumber: weekNumber(start), start, end: weekly.addDays(start, 6),
        target: null, completed: null, gap: null, change: null, status: start === current ? 'ongoing' : 'unrecorded'});
    }
    return result;
  }
  global.PlannerUnitTrend = Object.freeze({build});
})(typeof window === 'undefined' ? globalThis : window);
