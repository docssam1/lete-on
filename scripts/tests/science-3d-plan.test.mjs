import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { science3DPlan, SCIENCE_CHECK_UNITS, RETAINED_3D_UNITS, classifyClassroomSlide, science3DCases, science3DFullscreenCases } from '../science-3d-plan.mjs';
import { revisedTextbookUnits } from '../../science-lab/v2/revised-textbook.js';
import { revisedClassroom } from '../../science-lab/v2/revised-lesson.js';

const plan = await science3DPlan();
const threeD = ['s31-u01', 's41-u01', 's41-u02', 's41-u03', 's41-u04'];
const script = fileURLToPath(new URL('../check-science-3d.mjs', import.meta.url));

test('기존24대상과 현행32수업을44단원으로 합치고3D5단원·31비교를 구별한다', () => {
  assert.equal(RETAINED_3D_UNITS.length, 24); assert.equal(plan.units, 44); assert.equal(SCIENCE_CHECK_UNITS.length, 44);
  assert.deepEqual(plan.surfaces, { ordinary: 272, fullscreen: 65, legacyDecksNeedBrowserLookup: 12 });
  for (const t of plan.targets.filter(t => t.retainedLegacy3D)) assert.equal(t.retainedPaths.lab, `#/${t.unit}/2/lab`);
  assert.deepEqual(new Set(plan.targets.filter(t => t.current).map(t => t.unit)), new Set(revisedTextbookUnits));
  assert.deepEqual(new Set(plan.targets.filter(t => t.retainedLegacy3D).map(t => t.unit)), new Set(RETAINED_3D_UNITS));
  assert.deepEqual(plan.targets.filter(t => t.classroomCases.some(c => c.type === 'lab3d')).map(t => t.unit).sort(), threeD);
  const counts = plan.targets.flatMap(t => t.classroomCases).reduce((out, c) => ({ ...out, [c.type]: (out[c.type] || 0) + 1 }), {});
  assert.deepEqual(counts, { comparison2d: 62, scene3d: 10, lab3d: 10 });
});

test('화면 제목 대신 실제mount·modelLab·수업의 대결 조건을 읽는다', () => {
  assert.equal(classifyClassroomSlide({ id: 'model', mount: 'lab', modelLab: true, title: '제목 변경' }, { fieldwork: true }, 'magnet-compare').type, 'lab3d');
  assert.equal(classifyClassroomSlide({ id: 'lab', mount: 'lab', title: '3D 실험실이라는 옛 제목' }, { fieldwork: true }, 'career-compare').type, 'comparison2d');
  assert.equal(classifyClassroomSlide({ mount: 'lab', modelLab: true }, { classroomBattle: false }, 'magnet-compare').battle, false);
  assert.equal(classifyClassroomSlide({ mount: 'lab', modelLab: true }, {}, 'magnet-compare').battle, true);
  assert.throws(() => classifyClassroomSlide({ id: 'unknown', mount: 'lab' }, {}, undefined), /연결 종류/);
  assert.equal(classifyClassroomSlide({ mount: 'scene' }, {}, undefined).type, 'scene3d');
});

test('실제 비교 모듈이 계획한 조작부를 만들고 학생·교사 주소와 화면 번호가 맞는다', async () => {
  let widgets = 0;
  for (const target of plan.targets.filter(t => t.current)) {
    const mod = await revisedClassroom(target.unit, await import(`../../science-lab/data/book/${target.unit}.book.js`));
    for (const c of target.classroomCases) assert.equal(c.hash, `#/${target.unit}/lab-class/${c.mode}/${c.n}`);
    const comparison = target.classroomCases.find(c => c.type === 'comparison2d');
    if (!comparison) continue;
    const host = { innerHTML: '', addEventListener() {}, removeEventListener() {}, querySelector: () => ({ focus() {} }) };
    const controller = await mod.classroomLab.mount(host, { personal: false, rows: [], isActive: () => true });
    const classes = [...host.innerHTML.matchAll(/class="([^"]+)"/g)].flatMap(m => m[1].split(/\s+/));
    assert(classes.includes(comparison.widget.slice(1)), target.unit); controller.dispose(); widgets++;
  }
  assert.equal(widgets, 31);
  const career = plan.targets.find(t => t.unit === 'c22-s62-u04'); assert.deepEqual(career.classroomCases.map(c => c.n), [40, 41]);
  const ring = plan.targets.find(t => t.unit === 's41-u01'); assert.deepEqual(ring.classroomCases.filter(c => c.type === 'lab3d').map(c => c.n), [4, 5]);
});

test('실제 검사표는 기존PC·폰·장면·전체화면을 유지하고 모든 현행 화면을 더한다', () => {
  let current = 0, legacy = 0, legacyDecks = 0, fullscreen = 0;
  for (const t of plan.targets) {
    const n = t.current ? t.classroomCases.find(c => c.mode === 'teach' && c.type === 'lab3d')?.n || 0 : 9;
    const cases = science3DCases(t, n), full = science3DFullscreenCases(t, n);
    const prior = cases.filter(c => c[0].startsWith('5단계') || c[0].startsWith('장면'));
    assert.equal(prior.length, t.retainedLegacy3D ? 4 : 0, t.unit);
    assert.equal(cases.filter(c => c[4]).length, t.classroomCases.length * 2, t.unit);
    assert(full.every(c => c[0] !== '전체 화면(덱)' || c[3]), t.unit);
    current += cases.filter(c => c[4]).length; legacy += prior.length; legacyDecks += cases.filter(c => c[0] === '덱 실험 슬라이드').length; fullscreen += full.length;
  }
  assert.deepEqual({ current, legacy, legacyDecks, fullscreen }, { current: 164, legacy: 96, legacyDecks: 12, fullscreen: 65 });
  assert.equal(science3DCases({ unit: 'legacy', current: false, retainedLegacy3D: true, classroomCases: [] }, 0)[0][2], null); // 실제 실행은 누락 덱을 실패로 처리한다.
});

test('--plan은Playwright가 없어도 서버·브라우저 없이 계획만 내고 잘못된 단원을 거부한다', () => {
  const env = { ...process.env, SCIENCE_LAB_PLAYWRIGHT: '/nonexistent/forbidden-playwright.mjs' };
  const output = JSON.parse(execFileSync(process.execPath, [script, '--plan', 'c22-s62-u04'], { encoding: 'utf8', env, timeout: 15000 }));
  assert.equal(output.units, 1); assert.equal(output.runtimeChecks, 0); assert.equal(output.runtimeVerified, false); assert(!output.browserStarted && !output.serverStarted);
  const bad = spawnSync(process.execPath, [script, '--plan', 'unknown-unit'], { encoding: 'utf8', env, timeout: 15000 }); assert.notEqual(bad.status, 0); assert(bad.stderr.includes('등록되지 않은 검사 단원'));
  const source = fs.readFileSync(script, 'utf8'), early = source.indexOf('process.exit(0)');
  assert(early < source.indexOf("import('playwright')") && early < source.indexOf('server.listen') && early < source.indexOf('chromium.launch'));
  assert(source.includes('finally {') && source.includes('process.exitCode = 1'));
});
