/* Weekly observations belong to individual book ranges and exam questions.
 * Week keys are Seoul calendar dates. Counts in the weekly planner do not create observations. */
(function (g) {
  'use strict';
  const days = g.PlannerWeeklyModel;
  const STUDIED = 1, SOLO = 2;
  const textFields = ['title', 'detail', 'unitLabel', 'track', 'bookName', 'paperId'];
  const id = value => typeof value === 'string' && value.trim() && value.length <= 1024;

  function validDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && value === date.toISOString().slice(0, 10);
  }

  function weekStart(day = days.today(), anchor) {
    if (!validDay(day)) return null;
    if (validDay(anchor) && anchor > day) return anchor;
    const weekday = value => new Date(value + 'T00:00:00Z').getUTCDay();
    const firstWeekday = validDay(anchor) ? weekday(anchor) : 1;
    return days.addDays(day, -((weekday(day) - firstWeekday + 7) % 7));
  }

  function references(value, self) {
    return Array.isArray(value) ? [...new Set(value.filter(key => id(key) && key !== self))] : [];
  }

  function source(value) {
    if (!value || !id(value.id) || !id(value.unitId) || !['book', 'mock'].includes(value.kind) ||
      typeof value.title !== 'string' || !value.title.trim()) return null;
    const item = {id: value.id, unitId: value.unitId, kind: value.kind};
    for (const key of textFields) {
      if (typeof value[key] === 'string' && value[key]) item[key] = value[key].slice(0, 1600);
    }
    const parents = item.kind === 'mock' ? references(value.reviewOf, item.id) : [];
    if (parents.length) item.reviewOf = parents;
    if (validDay(value.date)) item.date = value.date;
    if (Number.isInteger(value.questionNumber) && value.questionNumber >= 1 && value.questionNumber <= 30) {
      item.questionNumber = value.questionNumber;
    }
    if (typeof value.url === 'string' && /^https:\/\//i.test(value.url)) item.url = value.url.slice(0, 4096);
    return item;
  }

  // Keep the actual input day so changing the family's weekday preserves a
  // check already made inside the newly selected week. Old pairs use the week key.
  function markedOn(mark) { return mark[2] || mark[0]; }
  function ordered(marks) { return [...marks].sort((a,b) => markedOn(a).localeCompare(markedOn(b))); }

  function restore(raw) {
    const entries = [];
    if (raw?.version !== 1 || !Array.isArray(raw.entries)) return {version: 1, entries};
    const seen = new Set();
    for (const row of raw.entries) {
      const item = source(row?.item);
      if (!item || seen.has(item.id) || !Array.isArray(row.marks)) continue;
      const marks = new Map();
      for (const mark of row.marks) {
        if (Array.isArray(mark) && validDay(mark[0]) && [STUDIED, SOLO, STUDIED | SOLO].includes(mark[1])) {
          const when = mark[2];
          const row = validDay(when) && when > mark[0] && when < days.addDays(mark[0], 7)
            ? [mark[0], mark[1], when] : [mark[0], mark[1]];
          const parents = item.kind === 'mock' ? references(mark[3], item.id) : [];
          if (parents.length) {
            row[2] = markedOn(row);
            row[3] = parents;
          }
          marks.set(row[0], row);
        }
      }
      if (marks.size) {
        seen.add(item.id);
        entries.push({item, marks: ordered(marks.values())});
      }
    }
    return {version: 1, entries};
  }

  function update(raw, {weekStart: start, item: input, field, value, day = days.today()} = {}) {
    const state = restore(raw), item = source(input);
    if (!validDay(start) || !item || !['studied', 'solo'].includes(field) || typeof value !== 'boolean') return state;
    const index = state.entries.findIndex(entry => entry.item.id === item.id);
    const entry = state.entries[index] || {item, marks: []};
    if (item.unitId !== entry.item.unitId || item.kind !== entry.item.kind) return state;
    const end = days.addDays(start, 7);
    const inWeek = mark => markedOn(mark) >= start && markedOn(mark) < end;
    const current = entry.marks.findLast(inWeek);
    const old = current?.[1] || 0;
    const bit = field === 'studied' ? STUDIED : SOLO;
    const bits = value ? old | bit : old & ~bit;
    if (bits === old) return state;
    const marks = entry.marks.filter(mark => !inWeek(mark));
    if (bits) {
      const when = validDay(day) && day > start && day < end ? day : start;
      const mark = when === start ? [start, bits] : [start, bits, when];
      // A success only resolves the questions this particular attempt retested.
      // Later assignments of the same published question can have other targets.
      const parents = item.reviewOf || current?.[3];
      if (parents?.length) {
        mark[2] = when;
        mark[3] = parents;
        entry.item.reviewOf = parents;
      }
      marks.push(mark);
    }
    if (!marks.length) {
      state.entries.splice(index, 1);
    } else {
      entry.marks = ordered(marks);
      if (index < 0) state.entries.push(entry);
    }
    return state;
  }

  function mastered(raw, beforeWeek) {
    if (!validDay(beforeWeek)) return [];
    return restore(raw).entries.filter(entry => {
      const previous = entry.marks.findLast(mark => markedOn(mark) < beforeWeek);
      return previous && !!(previous[1] & SOLO);
    }).map(entry => entry.item.id);
  }

  function view(raw, {weekStart: start, items = []} = {}) {
    if (!validDay(start)) return {weekStart: null, nextWeekStart: null, rows: [], nextReview: []};
    const nextWeekStart = days.addDays(start, 7);
    const sources = new Map(), past = new Map();
    for (const input of Array.isArray(items) ? items : []) {
      const item = source(input);
      if (!item) continue;
      const existing = sources.get(item.id);
      if (!existing || (item.reviewOf && existing.unitId === item.unitId)) sources.set(item.id, item);
    }
    const entries = restore(raw).entries;
    const settled = new Map();
    const byId = new Map(entries.map(entry => [entry.item.id, entry.item]));
    for (const {item, marks} of entries) {
      if (item.kind !== 'mock' || !item.paperId) continue;
      for (const mark of marks) {
        const day = markedOn(mark);
        if (!mark[3] || !(mark[1] & SOLO) || day >= nextWeekStart) continue;
        for (const id of mark[3]) {
          const original = byId.get(id);
          if (original?.kind !== 'mock' || original.unitId !== item.unitId || !original.paperId || original.paperId === item.paperId) continue;
          if (!settled.has(id) || day > settled.get(id)) settled.set(id, day);
        }
      }
    }
    for (const entry of entries) {
      const item = entry.item, live = sources.get(item.id);
      if (live && (live.unitId !== item.unitId || live.kind !== item.kind)) continue;
      const previous = entry.marks.findLast(mark => markedOn(mark) < start);
      const current = entry.marks.findLast(mark => markedOn(mark) >= start && markedOn(mark) < nextWeekStart);
      const weakMark = current || previous;
      const rechecked = weakMark?.[1] === STUDIED && settled.has(item.id) && settled.get(item.id) >= markedOn(weakMark);
      const dueWeek = previous?.[1] === STUDIED && !rechecked ? days.addDays(previous[0], 7) : '';
      const review = !!dueWeek && dueWeek < nextWeekStart;
      past.set(item.id, {bits: current?.[1] || 0, review, dueWeek, rechecked});
      // Keep due work and this week's checked rows visible even after intake changes.
      if (!live && (review || current)) sources.set(item.id, item);
    }
    const rows = [], groups = new Map();
    for (const item of sources.values()) {
      const {bits, review, dueWeek, rechecked} = past.get(item.id) || {bits: 0, review: false, dueWeek: ''};
      const solo = !!(bits & SOLO), studied = !!(bits & STUDIED);
      rows.push({...item, studied, solo, review, dueWeek});
      if (solo || rechecked || (!studied && !review)) continue;
      if (!groups.has(item.unitId)) {
        groups.set(item.unitId, {unitId: item.unitId, unitLabel: item.unitLabel || item.title, dueWeek: nextWeekStart, items: []});
      }
      groups.get(item.unitId).items.push(item);
    }
    rows.sort((a, b) => Number(b.review) - Number(a.review));
    return {weekStart: start, nextWeekStart, rows, nextReview: [...groups.values()]};
  }

  g.PlannerUnitChecks = Object.freeze({weekStart, restore, view, update, mastered});
})(typeof window === 'undefined' ? globalThis : window);
