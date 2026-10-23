#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const P = require('../data/high-pacing');
const w = {console};
w.window = w;
vm.createContext(w);
// Use the page's real engine/thread order, rather than an empty thread registry.
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
for(const tag of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file = tag[1].split(/[?#]/)[0];
  if(!/^(engine\/|data\/)/.test(file) || file === 'data/high-pacing.js') continue;
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), w, {filename:file, timeout:5000});
  if(file === 'data/courses.js') break;
}
assert(w.NM_THREADS && Object.keys(w.NM_THREADS).length > 100, 'load real threads');
const courses = w.NM_COURSES;
assert.equal(courses.C31.sessions.length, 11, 'real thread-dependent course packing');
const before = JSON.stringify(courses);
const arrays = new Map(Object.values(courses).map(course => [course, course.sessions]));
function freeze(value){
  if(!value || typeof value !== 'object' || Object.isFrozen(value)) return;
  Object.values(value).forEach(freeze);
  Object.freeze(value);
}
Object.values(courses).forEach(course => Object.values(course).forEach(freeze));
assert.equal(P.attach(courses), courses);
const jsonWithoutPlans = () => JSON.stringify(courses, (key, value) => key === 'studyPlan' ? undefined : value);
assert.equal(jsonWithoutPlans(), before, 'canonical course fields and nested sessions are unchanged');
let cases = 0;
let estimatedTests = 0;
const near = (actual, expected, message) => assert(Math.abs(actual - expected) < 1e-8, message || `${actual} != ${expected}`);
function checkTime(course, lesson){
  const selected = lesson.sourceIndices.map(i => course.sessions[i]);
  const seconds = course.tier === 'algebra' ? 65 : 60;
  const missingTests = selected.filter(session => session.test && session.minutes == null);
  const expectedTestMinutes = missingTests.reduce((n, session) => n
    + (session.pool || []).reduce((count, item) => count + (item.n || 8), 0) * seconds / 60, 0);
  near(lesson.estimatedTestMinutes, expectedTestMinutes, 'test estimate uses pool question counts and tier seconds');
  near(lesson.estimatedMinutes, lesson.minutes + expectedTestMinutes, 'estimate includes the missing test duration');
  assert.equal(lesson.minutesComplete, selected.every(session => session.minutes != null));
  assert.equal(lesson.timeEstimateMethod, missingTests.length ? 'tier-seconds-pool-v1' : 'source-minutes');
}
for(const [tier, courseCount, expectedFour] of [['highmath1', 11, 1], ['highmath2', 9, 3], ['algebra', 12, 0]]){
  const band = Object.values(courses).filter(course => course.tier === tier);
  assert.equal(band.length, courseCount);
  assert.equal(band.reduce((n, course) => n + P.length(course), 0), 24, tier + ': 24 lessons');
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 2), 0), 12, tier + ': 12 weeks at twice a week');
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 1), 0), 24, tier + ': 24 weeks at once a week');
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 'w2'), 0), 12, tier + ': w2 cadence');
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 'w1'), 0), 24, tier + ': w1 cadence');
  assert.equal(band.filter(course => P.length(course) === 4).length, expectedFour);
  for(const course of band){
    const {lessons} = course.studyPlan, source = course.sessions;
    assert.equal(course.studyPlan.version, '20261023-high3m');
    assert([2, 4].includes(lessons.length));
    assert.equal(course.studyPlan.weeksW2, lessons.length / 2);
    assert.equal(course.sessions, arrays.get(course), 'preserve session array identity');
    assert.deepEqual(lessons.flatMap(lesson => lesson.sourceIndices), Array.from({length:source.length}, (_, i) => i), 'every legacy session exactly once, in order');
    assert.equal(lessons.reduce((n, lesson) => n + lesson.minutes, 0), source.reduce((n, session) => n + (session.minutes || 0), 0));
    for(const lesson of lessons){
      assert.equal(lesson.startSession, lesson.sourceIndices[0] + 1);
      assert.equal(lesson.endSession, lesson.sourceIndices.at(-1) + 1);
      assert.equal(lesson.minutes, lesson.sourceIndices.reduce((n, i) => n + (source[i].minutes || 0), 0));
      checkTime(course, lesson);
      estimatedTests += lesson.sourceIndices.filter(i => source[i].test).length;
      assert.deepEqual(P.select(course, {lesson:lesson.index, k:1}), lesson);
      const next = P.select(course, {lesson:lesson.index, k:2});
      assert.deepEqual(next, lessons[lesson.index + 1] || null, 'next lesson has no wrapping');
      for(const index of lesson.sourceIndices){
        assert.equal(P.lessonIndex(course, index + 1), lesson.index);
        const partial = P.select(course, {startSession:index + 1, k:1});
        assert.deepEqual(partial.sourceIndices, lesson.sourceIndices.filter(i => i >= index), 'trim only already completed legacy sessions');
        assert.equal(partial.startSession, index + 1);
        assert.equal(partial.minutes, partial.sourceIndices.reduce((n, i) => n + (source[i].minutes || 0), 0));
        checkTime(course, partial);
        assert.deepEqual(P.select(course, {startSession:index + 1, k:2}), lessons[lesson.index + 1] || null, 'partial start keeps next lesson whole');
        assert.equal(P.weeks(course, 1, index + 1), lessons.length - lesson.index);
        assert.equal(P.weeks(course, 2, index + 1), Math.ceil((lessons.length - lesson.index) / 2));
        assert.equal(P.weeks(course, 'w1', index + 1), P.weeks(course, 1, index + 1));
        assert.equal(P.weeks(course, 'w2', index + 1), P.weeks(course, 2, index + 1));
        cases++;
      }
    }
    assert(source.at(-1).test, 'fixture includes canonical test');
    assert(lessons.at(-1).sourceIndices.includes(source.length - 1), 'canonical test is retained');
    assert.equal(P.lessonIndex(course, -100), 0);
    assert.equal(P.lessonIndex(course, 99999), lessons.length - 1);
    assert.equal(P.select(course, {lesson:lessons.length}), null);
    assert.equal(P.weeks(course, 2, source.length + 1), 0);
  }
}
assert.equal(estimatedTests, 32, 'all canonical high-school tests have a time estimate');
for(const [tier, expected] of [['highmath1', 2304], ['highmath2', 2004], ['algebra', 3030]]){
  near(Object.values(courses).filter(course => course.tier === tier)
    .reduce((n, course) => n + course.studyPlan.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0), 0), expected,
    tier + ': estimated subject minutes include every test');
}
for(const course of Object.values(courses).filter(course => !['middle1', 'middle2', 'middle3', 'highmath1', 'highmath2', 'algebra', 'calculus1'].includes(course.tier))){
  assert.equal(course.studyPlan, undefined, 'other stages are untouched');
  assert.equal(P.length(course), course.sessions.length);
}
const plans = new Map(Object.values(courses).map(course => [course, course.studyPlan]));
const once = JSON.stringify(courses);
P.attach(courses);
assert.equal(JSON.stringify(courses), once, 'attach is idempotent');
Object.values(courses).forEach(course => assert.equal(course.studyPlan, plans.get(course), 'idempotence preserves plan identity'));
assert.equal(jsonWithoutPlans(), before);
// Browser-style initialization attaches to existing courses, with identical output.
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/high-pacing.js'), 'utf8'), w, {filename:'data/high-pacing.js'});
assert.equal(JSON.stringify(courses), once);
assert.equal(w.NM_HIGH_PACING.length(courses.C58), 2);
const fallback = {sessions:[{minutes:10}, {minutes:20}, {test:true}]};
assert.deepEqual(P.select(fallback, {startSession:2, k:1}).sourceIndices, [1]);
assert.deepEqual(P.select(fallback, {startSession:2, k:2}).sourceIndices, [2]);
assert.equal(P.select(fallback, {startSession:3, k:2}), null);
assert.equal(P.weeks(fallback, 2, 2), 1);
assert.equal(P.weeks(fallback, 'w1', 2), 2);
assert.equal(P.weeks(fallback, 'w2', 2), 1);
assert.equal(P.length({sessions:[]}), 0);
assert.equal(P.select({sessions:[]}, {k:1}), null);
assert.equal(P.weeks({sessions:[]}, 2), 0);
const testTimeFixture = {tier:'algebra', sessions:[{minutes:10}, {test:true, pool:[{n:12}, {}]}],
  studyPlan:{lessons:[{index:0, sourceIndices:[0, 1]}]}};
const fullEstimate = P.select(testTimeFixture, {k:1});
assert.equal(fullEstimate.minutes, 10, 'canonical sum does not acquire an invented test duration');
near(fullEstimate.estimatedTestMinutes, 20 * 65 / 60, 'missing question count defaults to eight');
near(fullEstimate.estimatedMinutes, 10 + 20 * 65 / 60);
assert.equal(fullEstimate.minutesComplete, false);
const testOnly = P.select(testTimeFixture, {k:1, startSession:2});
assert.equal(testOnly.minutes, 0, 'test-only partial selection has no recorded source duration');
near(testOnly.estimatedMinutes, 20 * 65 / 60, 'test-only partial selection still has a duration estimate');
assert.equal(testOnly.timeEstimateMethod, 'tier-seconds-pool-v1');
assert.equal(testOnly.minutesComplete, false);
const recordedTest = P.select({tier:'highmath1', sessions:[{test:true, minutes:25, pool:[{n:40}]}]}, {k:1});
assert.equal(recordedTest.minutes, 25);
assert.equal(recordedTest.estimatedMinutes, 25, 'an explicit source duration takes precedence over a formula');
assert.equal(recordedTest.estimatedTestMinutes, 0);
assert.equal(recordedTest.minutesComplete, true);
// Calendar assignments consume the flattened references, rather than repeatedly
// returning the base course. Every source session must appear exactly once.
const WEEK_MS = 7 * 86400000;
const scheduleStart = Date.parse('2026-10-26T00:00:00Z');
function keyAt(offset, start = scheduleStart){
  const monday = new Date(start + offset * WEEK_MS);
  const thursday = new Date(monday.getTime() + 3 * 86400000);
  const year = thursday.getUTCFullYear(), jan4 = new Date(Date.UTC(year, 0, 4));
  const firstMonday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000;
  return year + '-W' + String(1 + Math.round((monday.getTime() - firstMonday) / WEEK_MS)).padStart(2, '0');
}
const orderedHigh = Object.entries(courses).filter(([, course]) => ['highmath1', 'highmath2', 'algebra'].includes(course.tier))
  .sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)));
const expectedRefs = orderedHigh.flatMap(([courseKey, course]) => course.studyPlan.lessons.map(lesson => courseKey + '-H' + lesson.index));
const expectedSources = orderedHigh.flatMap(([key, course]) => course.sessions.map((_, i) => key + '-S' + i));
const scheduleOpts = {courseKey:'C38', startSession:1, startDate:'2026-10-28', cadence:'w2', speed:1};
// Keep the original three-subject regression independent of the newly appended
// Calculus I band. The calculus/cross-band calendar has its own full audit.
const threeSubjectCourses = Object.fromEntries(Object.entries(courses)
  .filter(([, course]) => course.tier !== 'calculus1'));
let calendarCases = 0;
for(const cadence of ['w1', 'w2']) for(const speed of [0.7, 0.85, 1, 1.25, 1.5]){
  const perWeek = cadence === 'w1' ? 1 : 2;
  const percent = Math.round(speed * 100);
  const completionWeeks = Math.ceil(72 / (perWeek * speed));
  const seenLessons = [], seenSources = [], subjectLastWeek = {};
  let assignedMinutes = 0;
  for(let week = 0; week < completionWeeks; week++){
    const opts = {...scheduleOpts, cadence, speed, weekKey:keyAt(week)};
    const first = P.assignment(threeSubjectCourses, {...opts, k:1});
    const second = P.assignment(threeSubjectCourses, {...opts, k:2});
    const expectedThisWeek = Math.min(72, Math.floor((week + 1) * perWeek * percent / 100))
      - Math.min(72, Math.floor(week * perWeek * percent / 100));
    assert.equal((first?.lessons.length || 0) + (second?.lessons.length || 0), expectedThisWeek, 'calendar allocates the cumulative budget exactly');
    if(expectedThisWeek === 0){ assert.equal(first, null); assert.equal(second, null); }
    if(cadence === 'w1') assert.equal(second, null, 'one weekly envelope cannot duplicate a second envelope');
    for(const result of [first, second].filter(Boolean)){
      assert.equal(result.weekOffset, week);
      assert.equal(result.weekLessons.length, expectedThisWeek);
      near(result.estimatedMinutes, result.lessons.reduce((n, lesson) => n + lesson.estimatedMinutes, 0));
      near(result.weeklyMinutes, result.weekLessons.reduce((n, lesson) => n + lesson.estimatedMinutes, 0));
      assignedMinutes += result.estimatedMinutes;
      for(const lesson of result.lessons){
        seenLessons.push(lesson.courseKey + '-H' + lesson.lessonIndex);
        lesson.sourceIndices.forEach(i => seenSources.push(lesson.courseKey + '-S' + i));
        subjectLastWeek[courses[lesson.courseKey].tier] = week + 1;
      }
      calendarCases++;
    }
  }
  assert.deepEqual(seenLessons, expectedRefs, 'every planned lesson appears once, in order across courses and subjects');
  assert.deepEqual(seenSources, expectedSources, 'every canonical session appears once over the entire calendar');
  near(assignedMinutes, 2304 + 2004 + 3030);
  assert.equal(subjectLastWeek.highmath1, Math.ceil(24 / (perWeek * speed)));
  assert.equal(subjectLastWeek.highmath2, Math.ceil(48 / (perWeek * speed)));
  assert.equal(subjectLastWeek.algebra, completionWeeks);
  assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, cadence, speed, weekKey:keyAt(completionWeeks), k:1}), null);
  assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, cadence, speed, weekKey:keyAt(completionWeeks), k:2}), null);
  if(cadence === 'w2' && speed === 1) assert.equal(completionWeeks, 36);
  if(cadence === 'w2' && speed === 1.5) assert.equal(subjectLastWeek.highmath1, 8);
  if(cadence === 'w2' && speed === 0.7) assert.equal(subjectLastWeek.highmath1, 18);
}
const fasterFirst = P.assignment(threeSubjectCourses, {...scheduleOpts, speed:1.5, weekKey:keyAt(0), k:1});
const fasterSecond = P.assignment(threeSubjectCourses, {...scheduleOpts, speed:1.5, weekKey:keyAt(0), k:2});
assert.equal(fasterFirst.weekLessons.length, 3);
assert.equal(fasterFirst.lessons.length, 2, '1.5 speed prints two lessons in the first envelope');
assert.equal(fasterSecond.lessons.length, 1, '1.5 speed prints the third lesson in the second envelope');
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, cadence:'w1', speed:0.7, weekKey:keyAt(0)}), null, 'a fractional first week does not skip the unassigned lesson');
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, cadence:'w1', speed:0.7, weekKey:keyAt(1)}).lessons[0].lessonIndex, 0);
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, weekKey:keyAt(-1)}), null, 'before the starting ISO week');
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, startDate:'2026-02-30', weekKey:keyAt(0)}), null);
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, weekKey:'2025-W53'}), null, 'invalid ISO week 53');
assert.equal(P.assignment(threeSubjectCourses, {...scheduleOpts, startDate:'2026-12-28', weekKey:'2027-W01'}).weekOffset, 1, 'ISO week-year rollover');
const manual = P.assignment(threeSubjectCourses, {courseKey:'C38', weekKey:'2027-W01', cadence:'w2', k:1});
assert.equal(manual.weekOffset, 0, 'a manual selection without startDate begins at the requested week');
assert.equal(manual.lessons[0].courseKey, 'C38');
assert.equal(manual.lessons[0].lessonIndex, 0);
const partialCalendar = P.assignment(threeSubjectCourses, {...scheduleOpts, courseKey:'C59', startSession:3, weekKey:keyAt(0), k:1});
assert.equal(partialCalendar.lessons[0].startSession, 3);
assert.equal(partialCalendar.lessons[0].sourceIndices[0], 2, 'trim the first calendar lesson to the saved legacy position');
const partialNext = P.assignment(threeSubjectCourses, {...scheduleOpts, courseKey:'C59', startSession:3, weekKey:keyAt(0), k:2});
assert.deepEqual(partialNext.lessons[0].sourceIndices, courses.C59.studyPlan.lessons[1].sourceIndices, 'only the first calendar lesson is trimmed');
assert.equal(jsonWithoutPlans(), before, 'calendar assignment never changes canonical data');
assert.equal(JSON.stringify(courses), once, 'calendar assignment does not change plans');
console.log('HIGH_PACING_OK legacyStarts=' + cases + ' subjects=3 lessons=24x3 weeksW2=12x3 weeksW1=24x3 estimatedTests=' + estimatedTests + ' calendarEnvelopes=' + calendarCases + ' canonicalMutation=0');
console.log(JSON.stringify(['highmath1', 'highmath2', 'algebra'].map(tier => ({
  tier,
  courses:Object.entries(courses).filter(([, course]) => course.tier === tier)
    .map(([id, course]) => ({id, source:course.sessions.length, lessons:P.length(course)}))
}))));
