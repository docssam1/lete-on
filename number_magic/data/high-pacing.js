/* Middle/high-school pacing is a view over canonical sessions. Source indices, tests,
 * and saved legacy session links keep their original meaning. */
(function(){
  'use strict';
  const W = typeof window !== 'undefined' ? window : globalThis;
  const VERSION = '20261023-high3m';
  const MIDDLE_VERSION = '20261023-middle25';
  const CALCULUS_VERSION = '20261024-calculus3m';
  const HIGH_TIERS = ['highmath1', 'highmath2', 'algebra'];
  const MIDDLE_TIERS = ['middle1', 'middle2', 'middle3'];
  const TIERS = [...MIDDLE_TIERS, ...HIGH_TIERS, 'calculus1'];
  const TEST_SECONDS = {middle1:40, middle2:45, middle3:50, highmath1:60, highmath2:60, algebra:65, calculus1:70};
  // The existing bands use five scheduling ticks per lesson. Calculus keeps
  // each of its 20 source sessions whole and uses six ticks: 24 units in total,
  // or 12 weeks at two units/week. No source lesson is split or repeated.
  const UNIT_TICKS = 5;
  const own = (o, key) => Object.prototype.hasOwnProperty.call(o, key);
  const sessions = course => course && Array.isArray(course.sessions) ? course.sessions : [];
  const minutesOf = session => {
    const n = Number(session && session.minutes);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const hasMinutes = session => session && session.minutes != null
    && Number.isFinite(Number(session.minutes)) && Number(session.minutes) >= 0;
  function timeEstimate(course, sourceIndices){
    const selected = sourceIndices.map(i => sessions(course)[i]);
    const minutes = selected.reduce((n, session) => n + minutesOf(session), 0);
    const missingTests = selected.filter(session => session && session.test && !hasMinutes(session));
    const seconds = TEST_SECONDS[course && course.tier];
    // The canonical source sum stays intact. Tests without a recorded duration
    // receive the same per-question tier estimate as the course count model.
    const estimatedTestMinutes = seconds ? missingTests.reduce((n, session) => n
      + (session.pool || []).reduce((count, item) => {
        const questions = Number(item.n);
        return count + (Number.isFinite(questions) && questions > 0 ? questions : 8);
      }, 0) * seconds / 60, 0) : 0;
    const minutesComplete = selected.every(hasMinutes);
    return {
      minutes,
      estimatedMinutes:minutes + estimatedTestMinutes,
      estimatedTestMinutes,
      timeEstimateMethod:missingTests.length && seconds ? 'tier-seconds-pool-v1'
        : minutesComplete ? 'source-minutes' : 'source-minutes-incomplete',
      minutesComplete
    };
  }
  const totalMinutes = course => sessions(course).reduce((n, session) => n + minutesOf(session), 0);
  const contentSize = course => sessions(course).reduce((n, session) => n
    + (session.magic || []).length + (session.drills || []).length
    + (session.creative || []).length + (session.pool || []).length, 0);
  function integer(value, fallback){
    const n = Number(value);
    return Number.isNaN(n) ? fallback : Math.trunc(n);
  }
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function makeLesson(course, index, sourceIndices, extraPractice){
    const lesson = {
      index,
      startSession:sourceIndices[0] + 1,
      endSession:sourceIndices[sourceIndices.length - 1] + 1,
      sourceIndices:sourceIndices.slice(),
      ...timeEstimate(course, sourceIndices)
    };
    if(Array.isArray(extraPractice) && extraPractice.length){
      // The bridge is appended to this view, never inserted into saved source
      // sessions. Its time is separate from their recorded minute sum.
      lesson.extraPractice = extraPractice.map(item => ({...item}));
      lesson.estimatedExtraMinutes = lesson.extraPractice.reduce((n, item) => n
        + Number(item.n || 0) * (TEST_SECONDS[course && course.tier] || 50) / 60, 0);
      lesson.estimatedMinutes += lesson.estimatedExtraMinutes;
      lesson.timeEstimateMethod += '+extension-tier-seconds-v1';
    }
    return lesson;
  }
  function makeLessons(course, count){
    const source = sessions(course), n = source.length;
    if(!n) return [];
    count = Math.min(count, n);
    const minuteWeights = source.map(minutesOf);
    const weights = minuteWeights.some(Boolean) ? minuteWeights : source.map(() => 1);
    const prefix = [0];
    weights.forEach(weight => prefix.push(prefix[prefix.length - 1] + weight));
    const lessons = [];
    let from = 0;
    for(let group = 0; group < count; group++){
      let to = n;
      if(group < count - 1){
        const latest = n - (count - group - 1);
        const target = prefix[n] * (group + 1) / count;
        let distance = Infinity;
        for(let cut = from + 1; cut <= latest; cut++){
          const candidate = Math.abs(prefix[cut] - target);
          if(candidate <= distance){ to = cut; distance = candidate; }
        }
      }
      lessons.push(makeLesson(course, group, Array.from({length:to - from}, (_, i) => from + i)));
      from = to;
    }
    return lessons;
  }
  function attach(courses){
    const list = Object.values(courses || {});
    HIGH_TIERS.forEach(tier => {
      const band = list.filter(course => course && course.tier === tier && sessions(course).length)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      if(!band.length) return;
      // Two lessons per course; the largest courses receive the extra pairs.
      const extraPairs = Math.max(0, Math.min(band.length, (24 - band.length * 2) / 2));
      const larger = band.slice().sort((a, b) => sessions(b).length - sessions(a).length
        || totalMinutes(b) - totalMinutes(a) || contentSize(b) - contentSize(a)
        || (Number(a.order) || 0) - (Number(b.order) || 0));
      const four = new Set(larger.slice(0, Math.floor(extraPairs)));
      band.forEach(course => {
        const lessons = makeLessons(course, four.has(course) ? 4 : 2);
        const plan = {version:VERSION, lessons, weeksW2:lessons.length / 2};
        if(JSON.stringify(course.studyPlan) !== JSON.stringify(plan)) course.studyPlan = plan;
      });
    });
    MIDDLE_TIERS.forEach(tier => {
      const band = list.filter(course => course && course.tier === tier && sessions(course).length)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      band.forEach((course, index) => {
        // One common sequence: 20 bundles per grade. The saved cadence chooses
        // 20 weeks at one/week or 10 weeks at two/week, with the same content.
        const lessons = makeLessons(course, index === 2 ? 8 : 6);
        if(tier === 'middle3' && Number(course.order) === 36 && lessons.length){
          const last = lessons[lessons.length - 1];
          lessons[lessons.length - 1] = makeLesson(course, last.index, last.sourceIndices,
            [{t:'MD25', lv:1, n:12}, {t:'MD25', lv:2, n:12}]);
        }
        const plan = {version:MIDDLE_VERSION, lessons, weeksW2:lessons.length / 2};
        if(JSON.stringify(course.studyPlan) !== JSON.stringify(plan)) course.studyPlan = plan;
      });
    });
    list.filter(course => course && course.tier === 'calculus1' && sessions(course).length)
      .forEach(course => {
        const lessons = sessions(course).map((_, index) => ({
          ...makeLesson(course, index, [index]), scheduleUnits:6 / UNIT_TICKS
        }));
        const plan = {version:CALCULUS_VERSION, lessons,
          weeksW2:lessons.length * 6 / UNIT_TICKS / 2};
        if(JSON.stringify(course.studyPlan) !== JSON.stringify(plan)) course.studyPlan = plan;
      });
    return courses;
  }
  function lessonsOf(course){
    const plan = course && course.studyPlan;
    return plan && Array.isArray(plan.lessons) && plan.lessons.length ? plan.lessons : null;
  }
  function length(course){
    const lessons = lessonsOf(course);
    return lessons ? lessons.length : sessions(course).length;
  }
  function lessonUnits(course, index){
    const lesson = (lessonsOf(course) || [])[index == null ? 0 : index];
    const units = Number(lesson && lesson.scheduleUnits);
    return Number.isFinite(units) && units > 0 ? units : 1;
  }
  function durationUnits(course, legacyFrom){
    const n = sessions(course).length;
    if(!n || legacyFrom != null && Number(legacyFrom) > n) return 0;
    const first = lessonIndex(course, legacyFrom == null ? 1 : legacyFrom);
    const lessons = lessonsOf(course);
    return lessons ? lessons.slice(first).reduce((ticks, _, index) => ticks
      + Math.round(lessonUnits(course, first + index) * UNIT_TICKS), 0) / UNIT_TICKS
      : n - first;
  }
  function lessonIndex(course, oneBasedLegacySession){
    const n = sessions(course).length;
    if(!n) return 0;
    const legacy = clamp(integer(oneBasedLegacySession, 1), 1, n) - 1;
    const lessons = lessonsOf(course);
    if(!lessons) return legacy;
    const index = lessons.findIndex(lesson => lesson.sourceIndices.includes(legacy));
    return index < 0 ? 0 : index;
  }
  function select(course, options){
    const opts = options || {}, n = sessions(course).length;
    if(!n) return null;
    const lessons = lessonsOf(course);
    const explicitStart = own(opts, 'startSession') && opts.startSession != null;
    const start = clamp(integer(opts.startSession, 1), 1, n);
    const first = opts.lesson != null ? integer(opts.lesson, 0) : lessonIndex(course, start);
    const index = first + (Number(opts.k) === 2 ? 1 : 0);
    if(index < 0 || index >= length(course)) return null;
    const lesson = lessons ? lessons[index] : makeLesson(course, index, [index]);
    const sourceIndices = explicitStart && Number(opts.k) !== 2
      ? lesson.sourceIndices.filter(sourceIndex => sourceIndex >= start - 1)
      : lesson.sourceIndices;
    return sourceIndices.length ? {...makeLesson(course, lesson.index, sourceIndices, lesson.extraPractice),
      ...(lesson.scheduleUnits != null ? {scheduleUnits:lesson.scheduleUnits} : {})} : null;
  }
  function weeks(course, cadence, legacyFrom){
    const n = sessions(course).length;
    if(!n) return 0;
    const from = legacyFrom == null ? 1 : integer(legacyFrom, 1);
    if(from > n) return 0;
    const perWeek = cadence === 'w1' ? 1 : cadence === 'w2' ? 2
      : Number(cadence) > 0 && Number.isFinite(Number(cadence)) ? Number(cadence) : 2;
    return Math.ceil(durationUnits(course, from) / perWeek - 1e-9);
  }
  const DAY_MS = 86400000;
  function mondayOfDate(date){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))) return null;
    const ms = Date.parse(date + 'T00:00:00Z');
    if(!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== date) return null;
    return ms - ((new Date(ms).getUTCDay() + 6) % 7) * DAY_MS;
  }
  function mondayOfWeek(weekKey){
    const match = /^(\d{4})-W(\d{2})$/.exec(String(weekKey || ''));
    if(!match || +match[2] < 1 || +match[2] > 53) return null;
    const year = +match[1], jan4 = new Date(0);
    jan4.setUTCFullYear(year, 0, 4);
    jan4.setUTCHours(0, 0, 0, 0);
    const monday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * DAY_MS
      + (+match[2] - 1) * 7 * DAY_MS;
    // The Thursday belongs to the ISO week-year; this rejects a spurious W53.
    return new Date(monday + 3 * DAY_MS).getUTCFullYear() === year ? monday : null;
  }
  function assignment(courses, options){
    const opts = options || {}, weekMonday = mondayOfWeek(opts.weekKey);
    if(weekMonday == null) return null;
    const startMonday = opts.startDate ? mondayOfDate(opts.startDate) : weekMonday;
    if(startMonday == null || weekMonday < startMonday) return null;
    const ordered = Object.entries(courses || {}).filter(([key, course]) => {
      const number = /^C(\d+)$/.exec(key);
      return number && +number[1] <= 73 && TIERS.includes(course && course.tier) && lessonsOf(course);
    }).sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)));
    const base = ordered.findIndex(([key]) => key === opts.courseKey);
    if(base < 0) return null;
    const baseCourse = ordered[base][1], legacyStart = clamp(integer(opts.startSession, 1), 1, sessions(baseCourse).length);
    const firstLesson = lessonIndex(baseCourse, legacyStart), flat = [];
    ordered.slice(base).forEach(([courseKey, course], courseIndex) => {
      const lessons = lessonsOf(course);
      for(let i = courseIndex === 0 ? firstLesson : 0; i < lessons.length; i++){
        const selected = select(course, {lesson:i, k:1,
          ...(courseIndex === 0 && i === firstLesson ? {startSession:legacyStart} : {})});
        if(selected) flat.push({courseKey, lessonIndex:selected.index,
          startSession:selected.startSession, endSession:selected.endSession,
          sourceIndices:selected.sourceIndices, estimatedMinutes:selected.estimatedMinutes,
          ...(selected.scheduleUnits != null ? {scheduleUnits:selected.scheduleUnits} : {}),
          ...(selected.extraPractice ? {
            extraPractice:selected.extraPractice.map(item => ({...item})),
            estimatedExtraMinutes:selected.estimatedExtraMinutes
          } : {})});
      }
    });
    const weekOffset = (weekMonday - startMonday) / (7 * DAY_MS);
    const perWeek = opts.cadence === 'w1' ? 1 : 2;
    const speed = [0.7, 0.85, 1, 1.25, 1.5].includes(Number(opts.speed)) ? Number(opts.speed) : 1;
    // The five speeds are exact percentages. Integer multiplication avoids an
    // artificial extra week when, for example, 180 * 0.7 becomes 125.999… .
    const percent = Math.round(speed * 100);
    const begin = weekOffset * perWeek * percent * UNIT_TICKS;
    const end = (weekOffset + 1) * perWeek * percent * UNIT_TICKS;
    let cumulativeTicks = 0;
    const weekLessons = flat.filter(lesson => {
      cumulativeTicks += Math.round((lesson.scheduleUnits || 1) * UNIT_TICKS);
      const boundary = cumulativeTicks * 100;
      return boundary > begin && boundary <= end;
    });
    if(!weekLessons.length) return null;
    const k = Number(opts.k) === 2 ? 2 : 1;
    if(perWeek === 1 && k === 2) return null;
    const split = Math.ceil(weekLessons.length / 2);
    const lessons = perWeek === 1 ? weekLessons
      : k === 2 ? weekLessons.slice(split) : weekLessons.slice(0, split);
    if(!lessons.length) return null;
    return {lessons, weekLessons, weekOffset,
      estimatedMinutes:lessons.reduce((n, lesson) => n + lesson.estimatedMinutes, 0),
      weeklyMinutes:weekLessons.reduce((n, lesson) => n + lesson.estimatedMinutes, 0)};
  }
  const api = {version:VERSION, attach, length, lessonUnits, durationUnits, lessonIndex, select, weeks, assignment};
  W.NM_HIGH_PACING = api;
  if(W.NM_COURSES) attach(W.NM_COURSES);
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})();
