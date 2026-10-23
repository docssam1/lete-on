#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..'), w = {console}; w.window = w; vm.createContext(w);
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
for(const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){
  const file = match[1].split(/[?#]/)[0];
  if(!/^(engine\/|data\/)/.test(file)) continue;
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), w, {filename:file});
  if(file === 'data/high-pacing.js') break;
}
const {project, standard} = require('../app/learning-plan.js');
const courses = w.NM_COURSES, H = w.NM_HIGH_PACING;
const original = JSON.stringify(courses), startDate = '2026-10-26', start = Date.parse(startDate), WEEK = 7 * 86400000;
function weekKey(offset){
  const monday = new Date(start + offset * WEEK), year = new Date(+monday + 3 * 86400000).getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4)), first = +jan4 - ((jan4.getUTCDay() + 6) % 7) * 86400000;
  return year + '-W' + String(1 + Math.round((+monday - first) / WEEK)).padStart(2, '0');
}
const settings = {courseKey:'C29', sessionIndex:1, startDate, entryYear:2020, cadence:'w2', speed:1.5, pace:'p4'};
const savedSettings = JSON.stringify(settings);
const opts = {now:startDate, months:24};
const weekOf = milestone => (Date.parse(milestone.date) - start) / WEEK;
const find = (p, key) => p.milestones.find(m => m.key === key);
let cases = 0, assignedEnvelopes = 0, partialStarts = 0;
// Standard is one factual baseline from the current source position. A saved
// custom cadence/speed does not silently turn that baseline into acceleration.
const baseline = standard(courses, settings, opts);
for(const [key, weeks] of [['C31', 10], ['C34', 20], ['C37', 30], ['C48', 42], ['C57', 54], ['C69', 66]]){
  assert.equal(weekOf(find(baseline, key)), weeks, key + ': explicit cumulative standard duration'); cases++;
}
for(const [from, end, weeks] of [['C29', 'C31', 10], ['C32', 'C34', 10], ['C35', 'C37', 10],
  ['C38', 'C48', 12], ['C49', 'C57', 12], ['C58', 'C69', 12]]){
  const standardPlan = standard(courses, {...settings, courseKey:from}, opts);
  const direct = project(courses, {...settings, courseKey:from, speed:1, cadence:'w1', pace:'p2'}, {...opts, standard:true});
  assert.equal(weekOf(find(standardPlan, end)), weeks, 'one middle arithmetic scope is ten weeks; one high subject is twelve weeks');
  assert.deepEqual(standardPlan, direct, 'the public standard API and explicit standard projection agree');
  for(const speed of [.7, .85, 1, 1.25, 1.5]) for(const cadence of ['w1', 'w2']){
    assert.deepEqual(standard(courses, {...settings, courseKey:from, speed, cadence, pace:'p0'}, opts), standardPlan,
      'standard ignores custom frequency/speed/early-childhood pace');
    cases++;
  }
}
const highOnly = standard(courses, {...settings, courseKey:'C38'}, opts);
assert.equal(weekOf(find(highOnly, 'C69')), 36, 'the three high-school subjects remain thirty-six weeks');
for(const [speed, cadence, weeks] of [[1.25, 'w2', 8], [1, 'w1', 20]]){
  const p = project(courses, {...settings, courseKey:'C29', speed, cadence}, opts);
  assert.equal(weekOf(find(p, 'C31')), weeks, cadence === 'w1' ? 'saved once-weekly individual setting is twenty weeks, not the standard' : 'faster option is eight weeks');
  cases++;
}
const speedKey = speed => speed < 1 ? String(speed).slice(1) : String(speed);
const gradeWeeks = {w1:{'.7':29, '.85':24, '1':20, '1.25':16, '1.5':14},
  w2:{'.7':15, '.85':12, '1':10, '1.25':8, '1.5':7}};
for(const [courseKey, gradeEnd] of [['C29', 'C31'], ['C32', 'C34'], ['C35', 'C37']]){
  const remainingBundles = Object.values(courses).filter(course => course.studyPlan && course.order >= +courseKey.slice(1)
    && course.order <= 69).reduce((n, course) => n + H.length(course), 0);
  for(const cadence of ['w1', 'w2']) for(const speed of [.7, .85, 1, 1.25, 1.5]){
    const perWeek = cadence === 'w1' ? 1 : 2, completionWeeks = Math.ceil(remainingBundles / (perWeek * speed));
    const assignedCourseEnd = {}, seenSources = [];
    let bridges = 0;
    for(let week = 0; week < completionWeeks; week++) for(const k of [1, 2]){
      const assigned = H.assignment(courses, {courseKey, startSession:1, startDate, weekKey:weekKey(week), cadence, speed, k});
      if(!assigned) continue;
      assignedEnvelopes++;
      for(const ref of assigned.lessons){
        assignedCourseEnd[ref.courseKey] = week + 1;
        ref.sourceIndices.forEach(index => seenSources.push(ref.courseKey + '-S' + index));
        if(ref.extraPractice) bridges++;
      }
    }
    assert.equal(assignedCourseEnd[gradeEnd], gradeWeeks[cadence][speedKey(speed)], 'explicit five-speed grade duration');
    const expectedSources = Object.entries(courses).filter(([key, course]) => course.studyPlan && +key.slice(1) >= +courseKey.slice(1)
      && +key.slice(1) <= 69).sort(([a], [b]) => +a.slice(1) - +b.slice(1))
      .flatMap(([key, course]) => course.sessions.map((_, index) => key + '-S' + index));
    assert.deepEqual(seenSources, expectedSources, 'custom speed preserves the entire middle-to-high source sequence');
    assert.equal(bridges, 1, 'middle-three cube factoring occurs once throughout the complete sequence');
    for(const pace of ['p0', 'p2', 'p4']){
      const p = project(courses, {...settings, courseKey, cadence, speed, pace}, opts);
      for(const milestone of p.milestones.filter(m => courses[m.key].studyPlan)){
        assert.equal(weekOf(milestone), assignedCourseEnd[milestone.key],
          `${courseKey}/${cadence}/${speed}/${pace}/${milestone.key}: projected dates match actual weekly assignment`);
      }
      assert(p.rows.flatMap(row => row.sessionLabels).some(label => label.includes('학습 묶음')));
      cases++;
    }
  }
}
// Standard begins at each saved legacy source session, including a position
// inside a merged bundle, instead of restarting the grade or replacing it with
// the selected custom schedule. Compare actual assignments by arithmetic scope.
for(let from = 29; from <= 37; from++){
  const courseKey = 'C' + from, gradeStart = 29 + Math.floor((from - 29) / 3) * 3, gradeEnd = gradeStart + 2;
  const bandCourses = Object.fromEntries(Object.entries(courses).filter(([key]) => +key.slice(1) >= from && +key.slice(1) <= gradeEnd));
  for(let source = 1; source <= courses[courseKey].sessions.length; source++){
    const input = {...settings, courseKey, sessionIndex:source};
    const inputSnapshot = JSON.stringify(input);
    const p = standard(courses, input, opts), lastAssigned = {};
    const seenSources = [];
    for(let week = 0; week < 10; week++) for(const k of [1, 2]){
      const assigned = H.assignment(bandCourses, {courseKey, startSession:source, startDate,
        weekKey:weekKey(week), cadence:'w2', speed:1, k});
      if(!assigned) continue;
      assigned.lessons.forEach(ref => {
        lastAssigned[ref.courseKey] = week + 1;
        ref.sourceIndices.forEach(index => seenSources.push(ref.courseKey + '-S' + index));
      });
    }
    assert.equal(weekOf(find(p, 'C' + gradeEnd)), lastAssigned['C' + gradeEnd], 'partial standard date follows the first remaining bundle');
    assert.equal(seenSources[0], courseKey + '-S' + (source - 1), 'partial baseline starts at the exact saved source session');
    assert(p.rows[0].sessionLabels[0].startsWith((H.lessonIndex(courses[courseKey], source) + 1) + '–'), 'monthly labels start with the current bundle');
    assert.equal(JSON.stringify(input), inputSnapshot, 'baseline does not rewrite saved settings');
    partialStarts++;
  }
}
// For ordinary courses the established rounding and custom pace stay intact.
const ordinary = {C1:{title:{ko:'첫 과정'}, sessions:[{},{},{}]}, C2:{title:{ko:'다음 과정'}, sessions:[{},{},{},{},{}]}};
for(const [speed, days] of [[1, [14, 35]], [1.5, [7, 21]]]){
  const p = project(ordinary, {courseKey:'C1', sessionIndex:1, startDate, cadence:'w2', speed, pace:'p0'}, opts);
  assert.deepEqual(p.milestones.map(m => (Date.parse(m.date) - start) / 86400000), days, 'ordinary per-course rounding is unchanged'); cases++;
}
assert.equal(JSON.stringify(courses), original, 'calendar and baseline preserve all canonical data and study plans');
assert.equal(JSON.stringify(settings), savedSettings, 'standard baseline does not apply settings');
console.log('MIDDLE_CALENDAR_OK standardMiddleWeeks=10 fasterMiddleWeeks=8 individualW1Weeks=20 highSubjectWeeks=12 speeds=5 customCases=' + cases
  + ' partialStarts=' + partialStarts + ' assignedEnvelopes=' + assignedEnvelopes + ' ordinaryRoundingPreserved=true sourceMutation=0');
