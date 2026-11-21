import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { currentCourses } from './home-courses.js';
import { SEMS_2022, contentId2022 } from './curriculum-2022.js';
import { revisedTextbookUnits } from './revised-textbook.js';
import { revisedClassroom } from './revised-lesson.js';

test('홈의 현행32단원은 교육과정 차례·연결한 전체 수업·워밍업과 일치한다', async () => {
  const expected = SEMS_2022.flatMap(s => s.units.map(u => ({ id: contentId2022(u.position), title: u.title, sem: s.sem })));
  assert.equal(currentCourses.length, 32);
  assert.equal(new Set(currentCourses.map(c => c.id)).size, 32);
  assert.deepEqual(currentCourses.map(({ id, title, sem }) => ({ id, title, sem })), expected);
  assert.deepEqual(new Set(currentCourses.map(c => c.id)), new Set(revisedTextbookUnits));
  for (const course of currentCourses) {
    const mod = await revisedClassroom(course.id, await import(`../data/book/${course.id}.book.js`));
    assert(mod.plan.phases.length > 0, course.id);
    const warmup = Object.values(mod.chapter).find(value => value?.predict?.q)?.predict.q;
    assert.equal(course.q, warmup.replace(/^워밍업\s*·\s*/, ''), course.id);
  }
});

test('현행 수업 사진은 실제 존재하는 로컬 자산과 내용 설명을 가진다', () => {
  assert.equal(currentCourses.find(c => c.id === 'c22-s42-u01').imageFit, 'contain');
  for (const course of currentCourses) {
    assert(!course.image.includes('..') && !course.image.includes('://'), course.id);
    const file = new URL('../assets/' + course.image, import.meta.url);
    assert(fs.statSync(file).size > 1000, course.id);
    assert(course.imageAlt.trim().length > 5, course.id);
    assert(!/AI 실사형|3D 실험실/.test(course.imageAlt), course.id);
  }
});

test('실제 홈은32수업·네 입구·32소단원 시트를 열며 옛 완료를 새 수업에 적용하지 않는다', () => {
  const result = JSON.parse(execFileSync(process.execPath, ['--experimental-vm-modules', fileURLToPath(new URL('./tests/home-courses-routes.mjs', import.meta.url))], { encoding: 'utf8', timeout: 15000, stdio: ['ignore', 'pipe', 'pipe'] }));
  assert.equal(result.currentCards, 32);
  assert.equal(result.openedSheets, 32);
  assert(result.allCurrentClassAndBookLinks && result.fourStudyModes && result.existingLegacyProgressPreserved);
  assert(result.oldCompletionNotAppliedToCurrent && result.originalStatePreserved);
  assert(result.latestVisitSelected && result.lastScreenShownWithoutCompletion);
  assert.equal(result.currentStoreReads, 32);
  assert.equal(result.actualStudentStorageReads, 0);
  assert.equal(result.actualStudentStorageWrites, 0);
});
