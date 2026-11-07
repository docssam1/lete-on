// Weekly session counts are self-reported. Only submitted reviews create actuals.
(function (global) {
  'use strict';
  const TRACKS = Object.freeze(['curriculum', 'arithmetic', 'thinking']);
  const MAX_TARGET = 21;
  const MAX_COMPLETED = 99;
  const HISTORY_LIMIT = 52;
  const DAY_MS = 86400000;
  const koreaDate = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  });

  function today(instant = new Date()) {
    return koreaDate.format(instant);
  }

  function validDay(day) {
    if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
    const timestamp = Date.parse(day + 'T00:00:00Z');
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === day;
  }

  function addDays(day, days) {
    const timestamp = Date.parse(day + 'T00:00:00Z') + days * DAY_MS;
    return new Date(timestamp).toISOString().slice(0, 10);
  }

  function daysBetween(from, to) {
    return (Date.parse(to + 'T00:00:00Z') - Date.parse(from + 'T00:00:00Z')) / DAY_MS;
  }

  function trackMap(get) {
    return Object.fromEntries(TRACKS.map(key => [key, get(key)]));
  }

  function counts(value, max) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (!TRACKS.every(key => Object.hasOwn(value, key) &&
      Number.isInteger(value[key]) && value[key] >= 0 && value[key] <= max)) return null;
    return trackMap(key => value[key]);
  }

  function start(startDate, targets) {
    const initialTargets = counts(targets, MAX_TARGET);
    if (!validDay(startDate) || !/^(?:20|21)\d{2}-/.test(startDate) || !initialTargets) return null;
    return {version: 1, startDate, initialTargets, prior: null, history: []};
  }

  function validBoundary(startDate, date) {
    return validDay(date) && date > startDate && daysBetween(startDate, date) % 7 === 0;
  }

  function restorePrior(startDate, prior) {
    if (!validBoundary(startDate, prior?.dueDate)) return null;
    const nextTargets = counts(prior.nextTargets, MAX_TARGET);
    const backlog = counts(prior.backlog, MAX_TARGET);
    const weeks = daysBetween(startDate, prior.dueDate) / 7;
    const completedTotals = counts(prior.completedTotals, MAX_COMPLETED * weeks);
    if (!nextTargets || !backlog || !completedTotals) return null;
    const firstTargets = counts(prior.firstTargets, MAX_TARGET) || {...nextTargets};
    return {dueDate: prior.dueDate, nextTargets, backlog, completedTotals, firstTargets};
  }

  function append(state, dueDate, recordedOn, completed, nextTargets) {
    const previous = state.history.at(-1) || state.prior;
    const targets = previous?.nextTargets || state.initialTargets;
    // Unfinished sessions take the first slots in the next week's capacity.
    // A reduced target can leave some older work deferred for a later week.
    const backlog = trackMap(key =>
      Math.max(0, Math.max(previous?.backlog[key] || 0, targets[key]) - completed[key]));
    state.history.push({dueDate, recordedOn, targets: {...targets}, completed, nextTargets, backlog});
  }

  function restore(raw) {
    if (raw?.version !== 1) return null;
    const state = start(raw.startDate, raw.initialTargets);
    if (!state) return null;
    state.prior = restorePrior(state.startDate, raw.prior);
    // A valid writer always compacts the boundary before adding a 53rd entry.
    if (!Array.isArray(raw.history) || raw.history.length > HISTORY_LIMIT) return null;
    for (const entry of raw.history) {
      const date = entry?.dueDate;
      const previousDate = state.history.at(-1)?.dueDate || state.prior?.dueDate || state.startDate;
      if (!validBoundary(state.startDate, date) || date <= previousDate ||
        !validDay(entry.recordedOn) || entry.recordedOn < date ||
        daysBetween(date, entry.recordedOn) >= 7) continue;
      const completed = counts(entry.completed, MAX_COMPLETED);
      const nextTargets = counts(entry.nextTargets, MAX_TARGET);
      if (completed && nextTargets) append(state, date, entry.recordedOn, completed, nextTargets);
    }
    return state;
  }

  function weekView(state, day) {
    const age = daysBetween(state.startDate, day);
    const elapsed = Math.max(0, Math.floor(age / 7));
    const liveWeekStart = addDays(state.startDate, elapsed * 7);
    const liveWeekEnd = addDays(liveWeekStart, 6);
    const previous = state.history.at(-1) || state.prior;
    const lastBoundary = previous?.dueDate || state.startDate;
    const due = elapsed > 0 && liveWeekStart > lastBoundary;
    const weekStart = due ? addDays(liveWeekStart, -7) : liveWeekStart;
    const targets = previous?.nextTargets || state.initialTargets;
    const backlog = previous?.backlog || trackMap(() => 0);
    return {
      phase: age < 0 ? 'scheduled' : due ? 'due' : 'active',
      weekNumber: due ? elapsed : elapsed + 1,
      weekStart, weekEnd: addDays(weekStart, 6),
      dueDate: addDays(weekStart, 7),
      nextDueDate: addDays(liveWeekStart, 7),
      liveWeekStart, liveWeekEnd, targets: {...targets}, backlog: {...backlog},
      carry: trackMap(key => Math.min(backlog[key], targets[key])),
      skippedWeeks: due ? daysBetween(lastBoundary, weekStart) / 7 : 0
    };
  }

  function view(raw, day = today()) {
    const state = restore(raw);
    return state && validDay(day) ? weekView(state, day) : null;
  }

  function review(raw, form, day = today()) {
    const state = restore(raw);
    if (!state || !validDay(day)) return state;
    const week = weekView(state, day);
    if (week.phase !== 'due' || form?.dueDate !== week.dueDate) return state;
    const completed = counts(form.completed, MAX_COMPLETED);
    const nextTargets = counts(form.nextTargets, MAX_TARGET);
    if (!completed || !nextTargets) return state;
    append(state, week.dueDate, day, completed, nextTargets);
    if (state.history.length > HISTORY_LIMIT) {
      const first = state.history.shift();
      const completedTotals = trackMap(key => (state.prior?.completedTotals[key] || 0) + first.completed[key]);
      const firstTargets = trackMap(key => state.initialTargets[key] || state.prior?.firstTargets[key] || first.nextTargets[key]);
      state.prior = {dueDate: first.dueDate, nextTargets: first.nextTargets, backlog: first.backlog, completedTotals, firstTargets};
    }
    return state;
  }

  function totals(raw) {
    const state = restore(raw);
    return trackMap(key => (state?.history || []).reduce(
      (total, entry) => total + entry.completed[key], state?.prior?.completedTotals[key] || 0));
  }

  // When an area starts paused, its first positive target sets the reference
  // pace for converting planned course lengths into study sessions.
  function baseTargets(raw) {
    const state = restore(raw);
    if (!state) return trackMap(() => 0);
    return trackMap(key => state.initialTargets[key] || state.prior?.firstTargets[key] ||
      state.history.find(entry => entry.nextTargets[key] > 0)?.nextTargets[key] || 0);
  }

  function suggest(targets, completed) {
    if (!counts(targets, MAX_TARGET) || !counts(completed, MAX_COMPLETED)) return null;
    return trackMap(key => Math.min(targets[key], Math.max(1, completed[key])));
  }

  global.PlannerWeeklyModel = Object.freeze({
    TRACKS, MAX_TARGET, MAX_COMPLETED, HISTORY_LIMIT, today, addDays, start, restore, view, review, totals, baseTargets, suggest
  });
})(typeof window === 'undefined' ? globalThis : window);
