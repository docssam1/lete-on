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

  // A native first mark starts a printed 25-question paper. A recheck or a
  // generated supplement never opens a paper by itself.
  function nativeSet(attempt, item) {
    if (attempt.bookId || attempt.track !== 'curriculum' || !['independent','wrong'].includes(item.outcome)) return '';
    const match = /^(didimdol22-([1-6]-[12])-u[1-6])-([mhxs])-(\d+)$/.exec(item.id);
    if (!match || match[1] !== attempt.unitId || match[2] !== attempt.semester) return '';
    const set = match[3], num = Number(match[4]);
    if (num < 1 || (set !== 's' && num > 25) || (set === 's' && item.phase === 'initial')) return '';
    return attempt.id === match[1]+'-'+set+'-ox-'+item.phase+'-'+attempt.date ? set : '';
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
        if (!id || !phases.includes(item.phase) || !outcomes.has(item.outcome)) continue;
        const question = scopedKey(attempt,id);
        batch[item.phase].push({question,attempt,set:nativeSet(attempt,item),outcome:item.outcome});
      }
    }

    const total = {initial: counts(), recheck: counts()};
    const seen = new Map();
    const started = new Set(), allocated = new Set(), assigned = new Set(), excluded = new Set(), submitted = new Set();
    let paperDone = 0, savedRecheck = false;
    function assign(id) {
      allocated.add(id);
      if (!assigned.has(id) && !excluded.has(id)) {
        assigned.add(id);
        if (submitted.has(id)) paperDone++;
      }
    }
    for (const date of [...days.keys()].sort()) {
      let changed = false;
      const priorAssigned = assigned.size, priorDone = paperDone;
      // On a given day the first assessment precedes its recheck. New O/X
      // evidence can also grade an old teacher worksheet placeholder.
      for (const phase of phases) {
        for (const {question, set, attempt, outcome} of days.get(date)[phase]) {
          if (outcome === 'unlearned') {
            if (!seen.has(question)) {
              excluded.add(question);
              if (assigned.delete(question) && submitted.has(question)) paperDone--;
            }
            continue;
          }
          if (excluded.delete(question) && allocated.has(question)) assign(question);
          if (phase === 'initial') {
            if (!seen.has(question) || seen.get(question).phase === 'initial' || set) assign(question);
            if (set) {
              const prefix = attempt.unitId+'-'+set+'-';
              const key = scopedKey(attempt,prefix);
              if (!started.has(key)) {
                started.add(key);
                for (let n=1;n<=25;n++) assign(scopedKey(attempt,prefix+n));
                changed = true;
              }
            }
          } else if (set) {
            savedRecheck = true;
          }
          const previous = seen.get(question);
          if (previous) {
            const gradedPlaceholder = set && previous.phase === phase && ['unanswered','pending'].includes(previous.outcome);
            if (!gradedPlaceholder) continue;
            if (previous.outcome === 'pending') total[phase].submitted--;
          } else {
            total[phase].eligible++;
          }
          seen.set(question,{phase,outcome});
          if (outcome !== 'unanswered') {
            total[phase].submitted++;
            if (!submitted.has(question)) {
              submitted.add(question);
              if (assigned.has(question)) paperDone++;
            }
          }
          if (outcome === 'independent') total[phase].independent++;
          changed = true;
        }
      }
      if (changed || (started.size && (priorDone !== paperDone || priorAssigned !== assigned.size))) {
        const initial = {...total.initial}, recheck = {...total.recheck};
        if (started.size) initial.paper = {eligible:assigned.size,submitted:paperDone};
        // Native O/X only saves rechecks once a learner marks them. The
        // recorded count cannot be used as the total number of assigned tasks.
        if (savedRecheck) recheck.recordedOnly = true;
        points.push({date,initial,recheck});
      }
    }
    return {points};
  }

  global.PlannerAssessmentTrend = Object.freeze({build});
})(typeof window === 'object' ? window : globalThis);
