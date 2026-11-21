import fs from 'node:fs';
import { withThink } from '../think-merge.js';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { revisedTextbookUnits } from '../revised-textbook.js';
import { revisedClassroom, classroomQuestions } from '../revised-lesson.js';
import { buildSlides, deckSlideIndex } from '../deck.js';
import { classroomViewDescriptor, recordClassroomView, classroomVisitHandlers, CLASSROOM_VISIT_KEY } from '../classroom-visit.js';

const production = fs.readFileSync(new URL('../v2.js', import.meta.url), 'utf8');
const source = fs.readFileSync(new URL('../deck.js', import.meta.url), 'utf8');
const fn = source.slice(source.indexOf('export function renderDeck('), source.indexOf('// 말로 쓰기:')).replace('export function', 'function');
let count = 0, teacherReads = 0, teacherWrites = 0, detachedWrites = 0;
async function renderer(connected = true) {
  const controls = new Map(), stage = { isConnected: connected, querySelector: () => null, querySelectorAll: () => [], addEventListener() {} };
  const app = { isConnected: connected, innerHTML: '', querySelector(selector) {
    if (selector === '.dk-stage') return stage;
    if (!controls.has(selector)) controls.set(selector, { classList: { add() {}, remove() {}, toggle() {} }, style: { setProperty() {} }, addEventListener() {}, setAttribute() {} });
    return controls.get(selector);
  } };
  const context = vm.createContext({ buildSlides, deckSlideIndex, location: { hash: '' }, addEventListener() {}, removeEventListener() {}, esc: String, guideFor: () => new Promise(() => {}), performance: { now: () => 0 }, judgeTable: () => Promise.resolve({}), clearTimeout() {}, setTimeout() { throw Error('unexpected automatic action'); } });
  const docssam = new vm.SyntheticModule(['dropGuide'], function () { this.setExport('dropGuide', () => {}); }, { context }); await docssam.link(() => {}); await docssam.evaluate();
  const render = new vm.Script('let battle=false,notesOn=false,recog=null,guideAvoid=null;const memo={get:()=>""};\n' + fn + '\nrenderDeck', { importModuleDynamically: async spec => { assert.equal(spec, './docssam.js'); return docssam; } }).runInContext(context);
  return { app, render };
}
for (const unit of revisedTextbookUnits) {
  const mod = await revisedClassroom(unit, await import(`../../data/book/${unit}.book.js`)), raw = await import(`../../data/units/${unit}.js`), paired = await import(`../../data/units/${unit}.similar.js`);
  const data = production.includes(`withThink('${unit}'`) ? await withThink(unit, { ...raw, ...paired }) : { ...raw, ...paired };
  const pool = classroomQuestions(mod, [...(data.similar || []), ...data.items]), slides = buildSlides(mod.chapter, mod.art, mod.plan, pool, 'self');
  const index = Math.floor(slides.length / 2), descriptor = classroomViewDescriptor(unit, slides);
  let state = { [CLASSROOM_VISIT_KEY]: recordClassroomView(descriptor, null, index, 10), report: { keep: true } }, writes = 0;
  const handlers = classroomVisitHandlers(unit, { get: () => state, set(_u, patch) { writes++; state = { ...state, ...patch }; } }, () => true, () => 20);
  const student = await renderer();
  student.render(student.app, { u: unit, ch: mod.chapter, art: mod.art, plan: mod.plan, similar: pool, mode: 'self', idx: 'resume', ...handlers });
  assert.equal(writes, 1, unit); assert.equal(state[CLASSROOM_VISIT_KEY].current.lastNumber, index + 1, unit); assert.deepEqual(state.report, { keep: true });
  assert(student.app.innerHTML.includes(`${index + 1} / ${slides.length}`), unit);
  const teacher = await renderer(), forbidden = classroomVisitHandlers(unit, { get() { teacherReads++; throw Error('teacher read'); }, set() { teacherWrites++; throw Error('teacher write'); } }, () => true);
  teacher.render(teacher.app, { u: unit, ch: mod.chapter, art: mod.art, plan: mod.plan, similar: pool, mode: 'teach', idx: 'resume', ...forbidden });
  const detached = await renderer(false), detachedHandlers = classroomVisitHandlers(unit, { get() { throw Error('detached read'); }, set() { detachedWrites++; } }, () => true);
  detached.render(detached.app, { u: unit, ch: mod.chapter, art: mod.art, plan: mod.plan, similar: pool, mode: 'self', idx: 'resume', ...detachedHandlers });
  count++;
}
assert.equal(teacherReads, 0); assert.equal(teacherWrites, 0); assert.equal(detachedWrites, 0);
console.log(JSON.stringify({ currentUnits: count, studentResumeChecks: count, teacherReads, teacherWrites, detachedWrites, actualStudentStorageReads: 0, actualStudentStorageWrites: 0, domAndTeacherAudioStubbed: true, browserVerified: false }));
