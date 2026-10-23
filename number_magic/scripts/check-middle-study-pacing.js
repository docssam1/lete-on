#!/usr/bin/env node
'use strict';
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const P = require('../data/high-pacing');
const w = {console}; w.window = w; vm.createContext(w);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
for(const tag of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file = tag[1].split(/[?#]/)[0];
  if(!/^(engine\/|data\/)/.test(file) || file === 'data/high-pacing.js') continue;
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), w, {filename:file, timeout:5000});
  if(file === 'data/courses.js') break;
}
assert(w.NM_THREADS && Object.keys(w.NM_THREADS).length > 100);
const courses = w.NM_COURSES;
const before = JSON.stringify(courses);
const sourceArrays = new Map(Object.values(courses).map(course => [course, course.sessions]));
function freeze(value){
  if(!value || typeof value !== 'object' || Object.isFrozen(value)) return;
  Object.values(value).forEach(freeze); Object.freeze(value);
}
Object.values(courses).forEach(course => Object.values(course).forEach(freeze));
P.attach(courses);
assert.equal(P.version, '20261023-high3m', 'the established high-school API version is preserved');
const withoutPlans = () => JSON.stringify(courses, (key, value) => key === 'studyPlan' ? undefined : value);
assert.equal(withoutPlans(), before, 'all canonical fields, source sessions and tests are unchanged');
const near = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-8, label || `${actual} != ${expected}`);
const bands = [
  {tier:'middle1', from:29, source:31, practice:28, seconds:40, minutes:1041, drawing:30},
  {tier:'middle2', from:32, source:24, practice:21, seconds:45, minutes:922, drawing:12},
  {tier:'middle3', from:35, source:31, practice:28, seconds:50, minutes:1280, drawing:18}
];
const WEEK_MS = 7 * 86400000;
const startMs = Date.parse('2026-10-26T00:00:00Z');
function weekAt(offset){
  const monday = new Date(startMs + offset * WEEK_MS), thursday = new Date(monday.getTime() + 3 * 86400000);
  const year = thursday.getUTCFullYear(), jan4 = new Date(Date.UTC(year, 0, 4));
  const firstMonday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000;
  return year + '-W' + String(1 + Math.round((monday.getTime() - firstMonday) / WEEK_MS)).padStart(2, '0');
}
let checkedStarts = 0, checkedTests = 0, checkedEnvelopes = 0, bridges = 0;
const drawingModes = new Set();
for(const expected of bands){
  const entries = [0, 1, 2].map(offset => ['C' + (expected.from + offset), courses['C' + (expected.from + offset)]]);
  const band = entries.map(([, course]) => course);
  assert.deepEqual(band.map(course => P.length(course)), [6, 6, 8], expected.tier + ': 20 common bundles');
  assert.equal(band.reduce((n, course) => n + course.sessions.length, 0), expected.source);
  assert.equal(band.reduce((n, course) => n + course.sessions.filter(s => !s.test).length, 0), expected.practice);
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 'w1'), 0), 20, 'standard: two and a half months per semester / twenty weeks per grade');
  assert.equal(band.reduce((n, course) => n + P.weeks(course, 'w2'), 0), 10, 'accelerated: two and a half months per grade');
  near(band.reduce((n, course) => n + course.studyPlan.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0), 0), expected.minutes);
  let drawingQuestions = 0;
  for(const [courseKey, course] of entries){
    assert.equal(course.tier, expected.tier);
    assert.equal(course.studyPlan.version, '20261023-middle25');
    assert.equal(course.sessions, sourceArrays.get(course), 'saved source array identity');
    assert.deepEqual(course.studyPlan.lessons.flatMap(lesson => lesson.sourceIndices), Array.from({length:course.sessions.length}, (_, i) => i), 'all sources occur once and in order');
    for(const lesson of course.studyPlan.lessons){
      assert(lesson.sourceIndices.length > 0, 'no empty invented source bundle');
      const source = lesson.sourceIndices.map(i => course.sessions[i]);
      near(lesson.minutes, source.reduce((n, session) => n + (session.minutes || 0), 0), 'recorded minute sum remains separate');
      const tests = source.filter(session => session.test);
      const testMinutes = tests.filter(session => session.minutes == null).reduce((n, session) => n
        + session.pool.reduce((count, item) => count + (item.n || 8), 0) * expected.seconds / 60, 0);
      near(lesson.estimatedTestMinutes, testMinutes);
      near(lesson.estimatedMinutes, lesson.minutes + testMinutes + (lesson.estimatedExtraMinutes || 0));
      checkedTests += tests.length;
      if(lesson.extraPractice){
        bridges++;
        assert.equal(courseKey, 'C36', 'the bridge belongs to middle-three factoring');
        assert.equal(lesson.index, course.studyPlan.lessons.length - 1, 'the bridge follows the established factoring sequence');
        assert.deepEqual(lesson.extraPractice, [{t:'MD25', lv:1, n:12}, {t:'MD25', lv:2, n:12}]);
        assert.equal(lesson.estimatedExtraMinutes, 20);
        for(const item of lesson.extraPractice){
          assert(w.NM_THREADS[item.t].levels.some(level => level.id === item.lv), 'existing registered thread/level');
          assert(w.NM_THREADS[item.t].prereq.includes('MD20'), 'middle factoring is the prerequisite');
          assert(item.lv < 3, 'quartic substitution is not silently added');
        }
      }
      assert.deepEqual(P.select(course, {lesson:lesson.index}), lesson, 'direct selection retains all metadata');
      for(const index of lesson.sourceIndices){
        const selected = P.select(course, {startSession:index + 1, k:1});
        assert.deepEqual(selected.sourceIndices, lesson.sourceIndices.filter(i => i >= index), 'legacy start trims only old source indices');
        assert.deepEqual(selected.extraPractice, lesson.extraPractice, 'partial selection retains the bridge exactly once');
        if(selected.extraPractice){
          selected.extraPractice[0].n = 99;
          assert.equal(lesson.extraPractice[0].n, 12, 'the caller cannot mutate a saved plan through selected metadata');
        }
        checkedStarts++;
      }
    }
    for(const session of course.sessions){
      if(session.test) continue;
      for(const item of session.application || []) if(item.kind === 'drawing'){
        assert.equal(item.count || item.n, 6);
        drawingQuestions += item.count || item.n;
        drawingModes.add(item.mode);
      }
    }
  }
  assert.equal(drawingQuestions, expected.drawing, 'all graph drawing activities survive grouping');
  const expectedLessons = entries.flatMap(([key, course]) => course.studyPlan.lessons.map(lesson => key + '-B' + lesson.index));
  const expectedSources = entries.flatMap(([key, course]) => course.sessions.map((_, index) => key + '-S' + index));
  const bandCourses = Object.fromEntries(entries);
  for(const cadence of ['w1', 'w2']) for(const speed of [0.7, 0.85, 1, 1.25, 1.5]){
    const perWeek = cadence === 'w1' ? 1 : 2, completionWeeks = Math.ceil(20 / (perWeek * speed));
    const seenLessons = [], seenSources = [];
    let minutes = 0, bridgeCount = 0;
    for(let week = 0; week < completionWeeks; week++){
      const opts = {courseKey:entries[0][0], startSession:1, startDate:'2026-10-28', cadence, speed, weekKey:weekAt(week)};
      const first = P.assignment(bandCourses, {...opts, k:1});
      const second = P.assignment(bandCourses, {...opts, k:2});
      if(cadence === 'w1') assert.equal(second, null, 'standard cadence does not duplicate a second weekly envelope');
      for(const result of [first, second].filter(Boolean)){
        minutes += result.estimatedMinutes;
        for(const ref of result.lessons){
          seenLessons.push(ref.courseKey + '-B' + ref.lessonIndex);
          ref.sourceIndices.forEach(index => seenSources.push(ref.courseKey + '-S' + index));
          if(ref.extraPractice){
            bridgeCount++;
            assert.deepEqual(ref.extraPractice, [{t:'MD25', lv:1, n:12}, {t:'MD25', lv:2, n:12}]);
            assert.equal(ref.estimatedExtraMinutes, 20);
          }
        }
        checkedEnvelopes++;
      }
    }
    assert.deepEqual(seenLessons, expectedLessons, 'all five speeds preserve bundle order and assign each once');
    assert.deepEqual(seenSources, expectedSources, 'all five speeds preserve every original session once');
    near(minutes, expected.minutes, 'a faster schedule changes duration, not the total content');
    assert.equal(bridgeCount, expected.tier === 'middle3' ? 1 : 0, 'bridge is assigned once at every speed');
    assert.equal(P.assignment(bandCourses, {courseKey:entries[0][0], startDate:'2026-10-28', cadence, speed, weekKey:weekAt(completionWeeks)}), null, 'completed grade has no wraparound');
    if(speed === 1) assert.equal(completionWeeks, cadence === 'w1' ? 20 : 10);
  }
}
assert.equal(checkedTests, 9, 'all nine canonical middle-school checks remain in the common path');
assert.equal(bridges, 1);
assert.deepEqual([...drawingModes].sort(), ['direct', 'inverse', 'linear', 'quadratic']);
const crossing = P.assignment(courses, {courseKey:'C37', startSession:courses.C37.sessions.length,
  startDate:'2026-10-26', weekKey:weekAt(0), cadence:'w2', speed:1});
assert.equal(crossing.weekLessons[0].courseKey, 'C37');
assert.equal(crossing.weekLessons[1].courseKey, 'C38', 'the same schedule continues into the high-school curriculum');
assert.equal(crossing.weekLessons[1].lessonIndex, 0);
const bridgeCourse = courses.C36, bridgeIndex = bridgeCourse.studyPlan.lessons.length - 1;
const bridgeStart = bridgeCourse.studyPlan.lessons[bridgeIndex].startSession;
const partialBridge = P.assignment(courses, {courseKey:'C36', startSession:bridgeStart,
  startDate:'2026-10-26', weekKey:weekAt(0), cadence:'w1', speed:1});
assert.deepEqual(partialBridge.lessons[0].extraPractice, [{t:'MD25', lv:1, n:12}, {t:'MD25', lv:2, n:12}]);
partialBridge.lessons[0].extraPractice[0].n = 1;
assert.equal(bridgeCourse.studyPlan.lessons[bridgeIndex].extraPractice[0].n, 12);
assert.equal(withoutPlans(), before, 'selection and assignment never write source data');
const plans = new Map(Object.values(courses).map(course => [course, course.studyPlan]));
const attached = JSON.stringify(courses); P.attach(courses);
assert.equal(JSON.stringify(courses), attached, 'reattaching is idempotent');
Object.values(courses).forEach(course => assert.equal(course.studyPlan, plans.get(course)));
console.log('MIDDLE_STUDY_PACING_OK grades=3 bundles=20x3 standardWeeks=20x3 acceleratedWeeks=10x3 speeds=5 legacyStarts=' + checkedStarts
  + ' checks=' + checkedTests + ' bridge=24questions/20minutes calendarEnvelopes=' + checkedEnvelopes + ' canonicalMutation=0');
