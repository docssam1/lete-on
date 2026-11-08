// Dated unit assessments share item IDs across the first test and its practice/rechecks.
// Results contain counts only. A type, answer text or original-reference number is not a question ID.
(function (global) {
  'use strict';

  const phases = ['initial', 'recheck'];
  const tracks = new Set(['curriculum', 'thinking']);
  const outcomes = new Set(['independent', 'assisted', 'wrong', 'pending', 'unanswered', 'unlearned']);
  const counts = () => ({eligible: 0, submitted: 0, independent: 0});

  function validDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\d$/.test(value)) return false;
    const ms = Date.parse(value + 'T00:00:00Z');
    return Number.isFinite(ms) && new Date(ms).toISOString().slice(0,10) === value;
  }

  function identifier(value) {
    return typeof value === 'string' ? value.trim() : Number.isSafeInteger(value) ? String(value) : '';
  }

  function scopedKey(attempt, id) {
    return JSON.stringify([attempt.track, identifier(attempt.bookId), identifier(attempt.semester), identifier(attempt.unitId), id]);
  }

  function matches(filter, value) {
    return !filter || filter === 'all' || filter === value;
  }

  function build({attempts = [], track, semester, unitId, bookId, day} = {}) {
    const points = [];
    if (!Array.isArray(attempts) || (day != null && !validDay(day))) return {points};

    // Saving the same assessment again corrects it. A new assessment cannot
    // rewrite how the child did on the first encounter with a question.
    const revisions = new Map();
    for (const attempt of attempts) {
      if (!identifier(attempt?.id) || !validDay(attempt.date) || !tracks.has(attempt.track) ||
          !identifier(attempt.unitId) || !Array.isArray(attempt.items)) continue;
      revisions.set(scopedKey(attempt,identifier(attempt.id)), attempt);
    }

    const days = new Map();
    for (const attempt of revisions.values()) {
      if ((day && attempt.date > day) || (bookId !== undefined && identifier(attempt.bookId) !== bookId) ||
          !matches(track,attempt.track) ||
          !matches(semester,attempt.semester) || !matches(unitId,attempt.unitId)) continue;
      if (!days.has(attempt.date)) days.set(attempt.date,{initial: [], recheck: []});
      const batch = days.get(attempt.date);
      for (const item of attempt.items) {
        const id = identifier(item?.id);
        if (!id || !phases.includes(item.phase) || !outcomes.has(item.outcome) || item.outcome === 'unlearned') continue;
        const question = scopedKey(attempt,id);
        batch[item.phase].push({question,outcome:item.outcome});
      }
    }

    const total = {initial: counts(), recheck: counts()};
    const seen = new Set();
    for (const date of [...days.keys()].sort()) {
      const before = seen.size;
      // Data has calendar-day precision. On the same day, initial exposure
      // takes precedence if an item was also mistakenly assigned for recheck.
      for (const phase of phases) {
        for (const {question,outcome} of days.get(date)[phase]) {
          if (seen.has(question)) continue;
          seen.add(question);
          total[phase].eligible++;
          if (outcome !== 'unanswered') total[phase].submitted++;
          if (outcome === 'independent') total[phase].independent++;
        }
      }
      if (seen.size !== before) points.push({date,initial:{...total.initial},recheck:{...total.recheck}});
    }
    return {points};
  }

  global.PlannerAssessmentTrend = Object.freeze({build});
})(typeof window === 'object' ? window : globalThis);
