// A unit's printed set and question number identify one physical question.
// Related variants share a source reference but keep their own assessment history.
(function (g) {
  'use strict';
  const indexes = new WeakMap();
  const itemId = (unit, set, number) => unit.id + '-' + set + '-' + number;
  const markOf = outcome => outcome === 'independent' ? 'O' : outcome === 'wrong' ? 'X' : null;
  const unattempted = outcome => outcome === 'unanswered' || outcome === 'unlearned';
  const sameUnit = (a, unit) => a.track === 'curriculum' && !a.bookId && a.unitId === unit.id && a.semester === unit.semester;

  function index(catalog) {
    if (indexes.has(catalog)) return indexes.get(catalog);
    const units = new Map(), questions = new Map(), byType = new Map();
    for (const unit of catalog.units) {
      units.set(unit.id, unit);
      const sets = Object.entries(unit.sets);
      if (unit.supplements?.length) {
        sets.push(['s', unit.supplements.map(s => ({number:Number(s.typeId.slice(1)), typeId:s.typeId, variant:true}))]);
      }
      for (const [set, rows] of sets) {
        for (const row of rows) {
          const id = itemId(unit, set, row.number);
          const group = unit.id + ':' + row.typeId;
          const question = {...row, id, group, set, unit};
          questions.set(id, question);
          if (!byType.has(group)) byType.set(group, []);
          byType.get(group).push(question);
        }
      }
    }
    const result = {units, questions, byType};
    indexes.set(catalog, result);
    return result;
  }

  function state(catalog, attempts, day) {
    const bank = index(catalog), marks = {}, used = new Set(), events = [];
    for (const [recordIndex, a] of attempts.entries()) {
      const unit = bank.units.get(a.unitId);
      if (!unit || !sameUnit(a, unit) || a.date > day) continue;
      for (const i of a.items) {
        const q = bank.questions.get(i.id);
        if (!q || q.unit !== unit) continue;
        // Keep prior worksheet assignments and explicitly unlearned items
        // out of the pool of fresh rechecks. They can still be marked later.
        used.add(q.id);
        events.push({q, recordIndex, date:a.date, phase:i.phase, outcome:i.outcome, mark:markOf(i.outcome)});
      }
    }
    // On a given date the first assessment precedes its recheck. This
    // matches the graph even if imported records were in reverse date order.
    events.sort((a,b) => a.date.localeCompare(b.date) || a.phase.localeCompare(b.phase));
    for (const e of events) {
      const first = marks[e.q.id];
      if (!first || (unattempted(first.outcome) && !unattempted(e.outcome))) {
        marks[e.q.id] = {mark:e.mark, outcome:e.outcome, phase:e.phase, date:e.date, recordIndex:e.recordIndex};
      }
    }

    const open = new Map();
    for (const e of events) {
      const q = e.q, first = marks[q.id];
      if (first.recordIndex !== e.recordIndex || first.outcome !== e.outcome || first.phase !== e.phase) continue;
      if (e.phase === 'recheck' && e.mark === 'O') {
        open.delete(q.group);
        continue;
      }
      if (e.mark !== 'X' && e.outcome !== 'assisted') continue;
      if (!open.has(q.group)) open.set(q.group, {source:q, since:e.date, ids:new Set()});
      const group = open.get(q.group);
      group.ids.add(q.id);
      if (e.phase === 'recheck') group.since = e.date;
    }

    const tasks = [];
    for (const [groupId, group] of open) {
      const {source, since, ids} = group;
      const eligible = bank.byType.get(groupId).filter(q => !used.has(q.id));
      // First use a new variant in another set, preferring the initial
      // question's source family. An unused original of the same type can
      // also serve as a transfer check. Preserve the printed classification.
      const rank = q => (q.set === 's' ? 8 : 0) + (q.set === source.set ? 4 : 0) + (q.variant ? 0 : 2) + (q.ref === source.ref ? 0 : 1);
      eligible.sort((a,b) => rank(a) - rank(b));
      const target = eligible[0];
      tasks.push({unitId:source.unit.id, typeId:source.typeId, typeTitle:source.unit.types[source.typeId],
        sourceSet:source.set, sourceIds:[...ids], due:g.PlannerWeeklyModel.addDays(since, 7),
        status:target ? 'scheduled' : 'exhausted', itemId:target?.id ?? null,
        set:target?.set ?? null, number:target?.number ?? null, variant:target?.variant ?? null});
    }
    tasks.sort((a,b) => a.due.localeCompare(b.due) || a.unitId.localeCompare(b.unitId) || a.typeId.localeCompare(b.typeId));
    return {marks, tasks};
  }

  function apply(catalog, attempts, change, day) {
    const bank = index(catalog), unit = bank.units.get(change?.unitId);
    const phase = change?.kind, date = change?.date ?? day;
    if (!unit || !['initial','recheck'].includes(phase) || !g.PlannerBookPace.validDay(date) ||
        !g.PlannerBookPace.validDay(day) || date > day) throw Error('단원 또는 기록 날짜를 확인해 주세요.');
    const current = state(catalog, attempts, day);
    const requested = phase === 'recheck' ? [[change.itemId, change.mark]] :
      Object.entries(change.marks || {}).map(([number, mark]) => [itemId(unit, change.set, number), mark]);
    if (!requested.length) throw Error('기록할 문항의 O 또는 X를 선택해 주세요.');

    const result = [...attempts];
    for (const [id, mark] of requested) {
      const q = bank.questions.get(id), prev = current.marks[id];
      if (!q || q.unit !== unit || (q.set === 's' && phase === 'initial') || !['O','X'].includes(mark)) throw Error('문항 번호와 O·X 표시를 확인해 주세요.');
      const expected = phase === 'initial' ? change.expected?.[q.number] : change.expected;
      if (expected !== undefined && expected !== (prev?.mark ?? null) && prev?.mark !== mark) {
        throw Error('다른 창에서 이 문항의 결과가 바뀌었어요. 새 기록을 확인해 주세요.');
      }
      const hasEncounter = prev && !unattempted(prev.outcome);
      const task = current.tasks.find(t => t.itemId === id);
      if (hasEncounter && prev.phase !== phase) throw Error('이미 다른 평가에 기록된 문항이에요.');
      // A learner may have already solved the scheduled number on paper.
      // Recording its first assessment moves the recheck to an unseen item.
      if (!hasEncounter && phase === 'recheck' && (!task || date < task.due)) {
        throw Error('현재 배정된 재점검 문항과 예정일을 확인해 주세요.');
      }
      if (hasEncounter && prev.mark === mark) continue;
      const item = {id, typeId:q.typeId, phase, outcome:mark === 'O' ? 'independent' : 'wrong'};
      if (hasEncounter) {
        // A correction edits the encounter on its actual date. For manual
        // grading this also preserves the original paper submission date.
        const old = result[prev.recordIndex];
        result[prev.recordIndex] = {...old, items:old.items.map(i => i.id === id ? item : i)};
        continue;
      }
      if (prev) {
        // A legacy worksheet includes placeholders for unanswered items.
        // Move the new observation to today instead of dating it to that sheet.
        for (const [n,a] of result.entries()) {
          if (sameUnit(a, unit) && a.items.some(i => i.id === id && unattempted(i.outcome))) {
            result[n] = {...a, items:a.items.filter(i => i.id !== id || !unattempted(i.outcome))};
          }
        }
      }
      const attemptId = unit.id + '-' + q.set + '-ox-' + phase + '-' + date;
      const n = result.findIndex(a => sameUnit(a, unit) && a.id === attemptId);
      if (n < 0) result.push({id:attemptId, date, track:'curriculum', semester:unit.semester,
        unitId:unit.id, unitTitle:unit.title, items:[item]});
      else result[n] = {...result[n], items:[...result[n].items, item]};
    }
    return result.filter(a => a.items.length);
  }

  g.PlannerOxModel = Object.freeze({state, apply, itemId});
})(typeof window === 'object' ? window : globalThis);
