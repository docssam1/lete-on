import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { currentCourses } from '../home-courses.js';
import { READY } from '../units-index.js';
import { CLASSROOM_VISIT_KEY, classroomViewDescriptor, recordClassroomView } from '../classroom-visit.js';
import { revisedClassroom, classroomQuestions } from '../revised-lesson.js';
import { buildSlides } from '../deck.js';

const root = path.resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const currentIds = new Set(currentCourses.map(c => c.id));
const state = Object.fromEntries(currentCourses.map(c => [c.id, { passed: true, done: [1, 2, 3, 4, 5], step: 5 }]));
state['s42-u02'] = { passed: true, done: [1, 2, 3, 4, 5] };
state['s42-u03'] = { done: [1, 2], step: 2 };
const originalState = JSON.stringify(state);
let currentReads = 0, storageReads = 0, storageWrites = 0, focused = 0;
const anchors = currentCourses.map(course => ({ dataset: { pos: course.position }, handlers: {}, addEventListener(k, v) { this.handlers[k] = v; } }));
let close;
const bg = { hidden: true, addEventListener() {} };
const sheet = { hidden: true, innerHTML: '', querySelector: selector => selector === '[data-close]' ? { addEventListener: (_k, v) => { close = v; } } : { focus: () => { focused++; } } };
const app = { innerHTML: '', querySelector: selector => selector === '.sheet' ? sheet : selector === '.sheet-bg' ? bg : {}, querySelectorAll: selector => selector === '.h-stop a[data-pos]' ? anchors : [] };
const context = vm.createContext({ addEventListener() {}, scrollTo() {}, setTimeout, clearTimeout, localStorage: {
  getItem() { storageReads++; throw Error('actual student storage forbidden'); },
  setItem() { storageWrites++; throw Error('actual student storage forbidden'); },
} });
async function mock(exports) {
  const mod = new vm.SyntheticModule(Object.keys(exports), function () { for (const [k, v] of Object.entries(exports)) this.setExport(k, v); }, { context });
  await mod.link(() => {}); await mod.evaluate(); return mod;
}
const home = new vm.SourceTextModule(fs.readFileSync(root + '/science-lab/v2/home.js', 'utf8'), { context });
await home.link(async spec => spec === './check.js' ? mock({ countNeeds: () => 0 }) : mock(await import(pathToFileURL(path.resolve(root + '/science-lab/v2', spec.split('?')[0])))));
await home.evaluate();
home.namespace.pageHome(app, { get(id) { if (currentIds.has(id)) currentReads++; return state[id] || {}; }, set() { throw Error('home must not write'); } }, () => {});
const currentHtml = app.innerHTML.split('id="h-labs"')[1].split('id="h-map"')[0];
assert.equal((currentHtml.match(/<article class="h-lab/g) || []).length, 32);
assert(!/3D 실험실|이어서 공부|progressbar|h-badge done|100%/.test(currentHtml));
assert(currentHtml.includes('object-fit:contain;background:#000'));
assert(!/실험 한 장씩|저절로 넘어가요|AI 실사형 설명 이미지|두 팀 배틀까지/.test(app.innerHTML));
for (const course of currentCourses) {
  for (const suffix of ['start', 'lab-class/self/1', 'lab-class/teach/1', 'lab-book/student']) assert(currentHtml.includes('#/' + course.id + '/' + suffix), course.id + suffix);
}
assert(app.innerHTML.includes('<dt>교과 연결 수업</dt><dd>32<small>개</small>'));
assert(app.innerHTML.includes('<dt>함께 보는 교재</dt><dd>32<small>권</small>'));
assert(app.innerHTML.includes('#/s31-u01/workbook/teacher'));
const legacyHtml = app.innerHTML.split('id="h-old"')[1].split('id="h-modes"')[0];
assert(legacyHtml.includes('h-badge done') && legacyHtml.includes('40% 진행'));
let sheets = 0;
for (let i = 0; i < anchors.length; i++) {
  const course = currentCourses[i];
  anchors[i].handlers.click({ preventDefault() {} });
  assert(!sheet.hidden && !bg.hidden);
  assert(sheet.innerHTML.includes(course.title));
  for (const sub of READY[course.id].subs) {
    assert(sheet.innerHTML.includes(sub.name), course.id + sub.id);
    assert(sheet.innerHTML.includes('#/' + course.id + '/sub/' + sub.id), course.id + sub.id);
  }
  close(); assert(sheet.hidden && bg.hidden); sheets++;
}
assert.equal(focused, 32);
assert.equal(JSON.stringify(state), originalState);
assert.equal(currentReads, 32); assert.equal(storageReads, 0); assert.equal(storageWrites, 0);
const firstRenderReads = currentReads;
let latestTotal;
for (const [unit, at] of [['c22-s51-u02', 100], ['c22-s62-u04', 200]]) {
  const mod = await revisedClassroom(unit, await import(`../../data/book/${unit}.book.js`)), raw = await import(`../../data/units/${unit}.js`), paired = await import(`../../data/units/${unit}.similar.js`);
  const slides = buildSlides(mod.chapter, mod.art, mod.plan, classroomQuestions(mod, [...paired.similar, ...raw.items]), 'self');
  state[unit][CLASSROOM_VISIT_KEY] = recordClassroomView(classroomViewDescriptor(unit, slides), null, slides.length - 1, at);
  if (at === 200) latestTotal = slides.length;
}
const withVisits = JSON.stringify(state); currentReads = 0;
home.namespace.pageHome(app, { get(id) { if (currentIds.has(id)) currentReads++; return state[id] || {}; }, set() { throw Error('home must not write'); } }, () => {});
const withProgress = app.innerHTML.split('id="h-labs"')[1].split('id="h-map"')[0];
assert(app.innerHTML.includes('href="#/c22-s62-u04/lab-class/self/resume">지난 화면부터'));
assert(withProgress.split('</article>')[0].includes('#/c22-s62-u04/lab-class/self/resume'));
assert(withProgress.includes(`지난번 ${latestTotal}/${latestTotal}화면`));
assert(!/progressbar|100%|h-badge done/.test(withProgress));
anchors.find(a => a.dataset.pos === 's62-u04').handlers.click({ preventDefault() {} });
assert(sheet.innerHTML.includes('#/c22-s62-u04/lab-class/self/resume')); close();
assert.equal(JSON.stringify(state), withVisits); assert.equal(currentReads, 32);
console.log(JSON.stringify({ currentCards: 32, openedSheets: sheets, allCurrentClassAndBookLinks: true, fourStudyModes: true, existingLegacyProgressPreserved: true, oldCompletionNotAppliedToCurrent: true, originalStatePreserved: true, latestVisitSelected: true, lastScreenShownWithoutCompletion: true, currentStoreReads: firstRenderReads, perRenderCurrentReads: currentReads, actualStudentStorageReads: storageReads, actualStudentStorageWrites: storageWrites, domAndTeacherAudioStubbed: true, browserVerified: false }));
