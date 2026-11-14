(function (root) {
  'use strict';
  // Only actual released editions belong to a course; academy identity alone
  // must never attach a paper from another level or an unprepared course.
  const courseByExam = {
    'sh-selection-r01':'SH:high-selection', 'sh-selection-r02':'SH:high-selection',
    'sh-selection-r03':'SH:high-selection', 'sh-selection-r04':'SH:high-selection',
    'sh-selection-r05':'SH:high-selection',
    'dp-common1-v14-pilot':'DP:common1-basic', 'dp-common1-r02':'DP:common1-basic',
    'wm-middle21-basic-mixed-r01':'WM:middle21-basic', 'wm-middle21-basic-mixed-r02':'WM:middle21-basic',
    'wm-middle21-basic-mixed-r03':'WM:middle21-basic', 'wm-middle21-basic-mixed-r04':'WM:middle21-basic',
    'wm-common1-basic-r01':'WM:common1-basic', 'wm-common1-basic-r02':'WM:common1-basic',
    'wm-common1-basic-r03':'WM:common1-basic', 'wm-common1-basic-r04':'WM:common1-basic',
    'ed-common1-basic-r01':'ED:high-advance', 'ed-common1-basic-r02':'ED:high-advance',
    'dg-pre-high1-r01':'DG:pre-high1',
    'dg-middle1-entry-r01':'DG:middle1', 'dg-middle1-entry-r02':'DG:middle1',
    'sm-pre-middle-common1-r01':'SM:common1-basic', 'sm-pre-middle-common1-r02':'SM:common1-basic'
  };
  function examsFor(program, course, exams) {
    return exams.filter(e => e.programId === program &&
      courseByExam[e.id] === program + ':' + course && ['released','pilot'].includes(e.mode));
  }
  function coursesFor(program, exams) {
    return program.courses.map(course => ({...course, exams:examsFor(program.code,course.id,exams)}))
      .sort((a,b) => Number(b.exams.length > 0) - Number(a.exams.length > 0));
  }
  function roundLabel(exam) {
    return exam.title.includes('최종') ? '최종(마무리)' : exam.title.match(/\d+회$/)?.[0] || exam.title;
  }
  function selectionForExam(id){const value=courseByExam[id];if(!value)return null;const [program,course]=value.split(':');return {program,course};}
  root.HIGHSELECT_PROMO_NAV = Object.freeze({examsFor,coursesFor,roundLabel,selectionForExam});
  if (typeof module !== 'undefined' && module.exports) module.exports = root.HIGHSELECT_PROMO_NAV;
})(typeof window !== 'undefined' ? window : globalThis);
