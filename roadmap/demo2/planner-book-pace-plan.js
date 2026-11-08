// Manual confirmations belong to one account, volume/edition and measurement unit.
(function (g) {
  'use strict';
  const key = 'gfield.demo2.book-pace.v1';
  const units = ['page', 'chapter'];
  const pace = g.PlannerBookPace;

  function restore(text) {
    let value;
    try { value = JSON.parse(text); } catch {}
    return value?.version === 1 && value.books && typeof value.books === 'object' && !Array.isArray(value.books)
      ? value : {version:1, books:{}};
  }

  function model(books, bookId, state, day, message) {
    const book = books.find(b => b.id === bookId) || books[0] || null;
    const saved = book && state.books[book.id];
    const unit = units.includes(saved?.unit) ? saved.unit :
      book?.defaultGoal?.unit || book?.suggested?.unit || book?.observations?.at(-1)?.unit || 'page';
    const ownGoal = pace.normalizeGoal(saved?.goals?.[unit]);
    const goal = ownGoal || (book?.defaultGoal?.unit === unit ? pace.normalizeGoal(book.defaultGoal) : null);
    const manualObservations = Object.entries(saved?.observations?.[unit] || {}).map(([date, position]) =>
      ({date, position, unit, manual:true})).filter(p => pace.validDay(p.date) && p.date <= day && Number.isInteger(p.position) && p.position >= 0);
    const manualDays = new Set(manualObservations.map(point => point.date));
    const observations = book ? g.PlannerBookPaceSources.observations(book,unit,manualObservations)
      .map(point => ({...point,manual:manualDays.has(point.date)})) : [];
    return {books, book, unit, goal, goalSource:ownGoal ? 'manual' : goal ? 'roadmap' : null,
      observations, manualObservations, pace:pace.build({goal,observations,day,unit}), day, message};
  }

  function apply(state, book, action, input, day) {
    const unit = input.unit;
    if (!book || input.bookId !== book.id || !units.includes(unit)) throw Error('기록할 교재와 단위를 확인해 주세요.');
    const previous = state.books[book.id] || {};
    const next = {...previous, unit};
    const limit = unit === 'chapter' && book.chapters?.length ? book.chapters.length : 99999;
    const positionOK = n => Number.isInteger(n) && n >= 0 && n <= limit;
    if (action === 'goal') {
      const goal = pace.normalizeGoal(input);
      if (!goal || !positionOK(goal.startPosition) || !positionOK(goal.endPosition)) throw Error('목표 날짜와 교재 범위를 확인해 주세요.');
      next.goals = {...previous.goals, [unit]:goal};
    } else {
      if (!['observe','remove'].includes(action) || !pace.validDay(input.date) || input.date > day ||
        (action === 'observe' && !positionOK(input.position))) throw Error('확인한 날짜와 교재 범위를 다시 확인해 주세요.');
      const points = {...previous.observations?.[unit]};
      if (action === 'observe') points[input.date] = input.position;
      else delete points[input.date];
      next.observations = {...previous.observations, [unit]:points};
    }
    return {...state, books:{...state.books,[book.id]:next}};
  }
  g.PlannerBookPacePlan = Object.freeze({key,restore,model,apply});
})(typeof window === 'object' ? window : globalThis);
