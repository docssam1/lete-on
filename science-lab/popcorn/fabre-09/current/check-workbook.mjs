// Workbook regression: one real Chromium instance, independent serial contexts.
// Select cases with PILOT_CASES (comma-separated); evidence is retained on failure.
import assert from 'node:assert/strict';
import {STUDENT_PAGE_COUNT} from './workbook-pages.js';
import {TEACHER_PAGE_COUNT} from './workbook-teacher.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.env.PILOT_URL || 'http://127.0.0.1:39247/science-lab/popcorn/fabre-09/current/';
const out = process.env.PILOT_SHOTS || 'E:/Codex/visualizations/2026/10/06/popcorn-fabre09/workbook-qa';
const key = 'popcorn.fabre09.current.v1';
const timeout = Number(process.env.PILOT_TIMEOUT) || 45000;
const ids = ['one', 'series', 'parallel', 'series-remove', 'parallel-remove'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 }
];
const teacherTitles = ['관찰을 설명으로 잇는 수업', '기대 관찰과 설명의 예', '설명을 듣고 다음 질문 고르기'];
const marker = 'WORKBOOK_PRIVATE_STUDENT_61006';
const payload = '<script>window.__workbookXSS=1</script></textarea><img data-workbook-xss src="x" onerror="window.__workbookXSS=2"> & "학생의 글"';
const defaultSeed = () => ({ index: 3, furthest: 19, done: {}, prediction: '', report: '', records: {}, recordKind: 'screen', checks: [], screenChecks: [], practice: 'screen', observations: [], tested: [] });
const tests = [];
function add(name, flow, seed = {}, mode = 'self', viewport = viewports[0]) {
  tests.push({ name, flow, seed, mode, viewport, status: 'not-run', checks: [] });
}
function pass(test, message) { test.checks.push(message); console.log(`PASS [${test.name}] ${message}`); }
function check(test, condition, message, actual) {
  assert.ok(condition, actual === undefined ? message : `${message}\nActual: ${JSON.stringify(actual)}`);
  pass(test, message);
}
function equal(test, actual, expected, message) { assert.deepEqual(actual, expected, message); pass(test, message); }
const stored = page => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}'), key);
const rawStored = page => page.evaluate(key => localStorage.getItem(key), key);
const stageNumber = page => page.locator('.step-number').innerText();
const persist = async () => writeFile(join(out, 'workbook-qa.json'), JSON.stringify(report, null, 2));
async function screenshot(page, test, suffix, force = false) {
  if (!force && process.env.PILOT_CAPTURE === '0') return;
  const file = `${test.name}-${suffix}.png`;
  await page.screenshot({ path: join(out, file), timeout });
  (test.screenshots ||= []).push(file);
}
async function start(page, mode = 'self') {
  await page.locator(`[data-start="${mode}"]`).click();
  await page.locator('.lesson-head h1').waitFor();
  // A fallback must fail this suite: the real 3D model is part of the contract.
  await page.waitForFunction(async () => {
    const { Stage } = await import('../../../engine.js');
    return [...Stage.live].some(stage => stage.canvas?.id === 'model' && stage.canvas.isConnected);
  });
}
async function jump(page, index) {
  if (!await page.locator('#lesson-steps').isVisible()) await page.locator('[data-action="steps"]').click();
  await page.locator(`[data-step="${index}"]`).click();
  await page.waitForFunction(index => document.querySelector('.step-number')?.textContent.trim() === `${index + 1} / 20`, index);
}
async function expandField(page, selector) {
  const field = page.locator(selector);
  const details = field.locator('xpath=ancestor::details[1]');
  if (await details.count() && !await details.evaluate(element => element.open)) await details.locator('summary').click();
  await field.waitFor({ state: 'visible' });
  return field;
}
async function selectObservation(page, id) {
  await page.locator(`[data-observation="${id}"]`).click();
  await page.locator(`#comparison-brightness[data-comparison-brightness="${id}"]`).waitFor({ state: 'attached' });
  await expandField(page, '#comparison-brightness');
}
async function snapshot(page, remember = false) {
  return page.evaluate(async remember => {
    const { Stage } = await import('../../../engine.js');
    const stage = [...Stage.live].find(item => item.canvas?.id === 'model' && item.canvas.isConnected);
    if (remember) window.__workbookOriginalStage = stage;
    const physicalCells = [], pointLights = [];
    stage?.root.traverse(object => {
      if (object.userData.cellParts) physicalCells.push({ visible: object.visible, parts: object.userData.cellParts.map(cell => cell.visible) });
      if (object.isPointLight) pointLights.push(object.intensity);
    });
    return {
      step: document.querySelector('.step-number')?.textContent,
      title: document.querySelector('.lesson-head h1')?.textContent,
      compare: document.querySelector('[data-compare][aria-pressed="true"]')?.dataset.compare,
      cells: [...document.querySelectorAll('[data-cell]')].map(cell => ({ id: cell.dataset.cell, checked: cell.checked })),
      reading: document.querySelector('#reading')?.textContent || '',
      physicalCells, pointLights, stageCount: Stage.live.size,
      rootUuid: stage?.root.uuid || null, sameStage: !!stage && stage === window.__workbookOriginalStage,
      storage: Object.fromEntries(Object.keys(localStorage).sort().map(name => [name, localStorage.getItem(name)]))
    };
  }, remember);
}

async function legacyMigration(page, test) {
  await start(page);
  equal(test, await stageNumber(page), '4 / 20', 'legacy current step is restored');
  const original = await stored(page);
  equal(test, original.observations, ids, 'legacy completion IDs remain intact');
  for (const id of ids) {
    await selectObservation(page, id);
    equal(test, await page.locator('#comparison-brightness').inputValue(), '', `${id}: completion does not prefill observed brightness`);
    equal(test, await page.locator('#comparison-reason').inputValue(), '', `${id}: completion does not prefill a reason`);
  }
  equal(test, (await stored(page)).comparisonNotes || {}, {}, 'legacy completion creates no invented written observations');
  await jump(page, 15);
  equal(test, await page.locator('[data-record="low"]').inputValue(), 'other', 'legacy single-source observation loads as entered');
  await page.locator('[data-record="off"]').selectOption('dim');
  const migrated = await stored(page);
  equal(test, migrated.recordSets.screen, { low: 'other', off: 'dim' }, 'first save migrates the existing source without inventing missing positions');
  equal(test, migrated.recordSets.real || {}, {}, 'legacy screen observations are not copied to real observations');
  equal(test, migrated.legacySentinel, 'keep-legacy-value', 'unrelated legacy state is preserved');
  await page.reload({ waitUntil: 'networkidle' });
  await start(page);
  equal(test, await page.locator('[data-record="low"]').inputValue(), 'other', 'migrated observation survives reload');
  equal(test, await page.locator('[data-record="high"]').inputValue(), '', 'unentered legacy position remains blank after reload');
  await screenshot(page, test, 'legacy-records');
}

async function comparisonNotes(page, test) {
  await start(page);
  const values = { one: 'other', series: 'dim', parallel: 'bright', 'series-remove': 'bright', 'parallel-remove': 'off' };
  const expected = {};
  for (const id of ids) {
    await selectObservation(page, id);
    equal(test, await page.locator('#comparison-brightness').inputValue(), '', `${id}: new observation starts without an answer`);
    await page.locator('#comparison-brightness').selectOption(values[id]);
    await page.locator('#comparison-reason').fill(`직접 쓴 관찰 ${id}: 예상과 달라도 남겨요.`);
    expected[id] = { brightness: values[id], reason: `직접 쓴 관찰 ${id}: 예상과 달라도 남겨요.` };
    const saved = await stored(page);
    equal(test, saved.comparisonNotes, expected, `${id}: typed observation is saved separately and is not corrected to a model answer`);
    equal(test, saved.observations, [], `${id}: a written note does not mark the observation complete`);
    check(test, !saved.done.compare && await page.locator('[data-action="next"]').isDisabled(), `${id}: a written note does not unlock the lesson`);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await start(page);
  for (const id of ids) {
    await selectObservation(page, id);
    equal(test, await page.locator('#comparison-brightness').inputValue(), values[id], `${id}: chosen brightness survives reload`);
    equal(test, await page.locator('#comparison-reason').inputValue(), expected[id].reason, `${id}: own reason survives reload`);
  }
  await page.locator('[data-action="observe"]').click();
  equal(test, (await stored(page)).observations, ['parallel-remove'], 'only the explicit Observe button records completion');
  equal(test, (await stored(page)).comparisonNotes, expected, 'recording completion preserves the learner notes');
  check(test, await page.locator('[data-action="next"]').isDisabled(), 'one observed result still does not replace all five observations');
  await screenshot(page, test, 'separate-comparison-notes');
}

async function thinkingNotes(page, test) {
  await start(page);
  const fields = [['predictionReason', 2], ['trouble', 14], ['changedThought', 16], ['nextQuestion', 19]];
  const expected = {};
  for (const [name, index] of fields) {
    await jump(page, index);
    const before = await stored(page);
    const text = `학생이 직접 쓴 ${name} 메모 — 돌아보고 다시 생각해요.`;
    const field = await expandField(page, `[data-workbook-note="${name}"]`);
    await field.fill(text);
    expected[name] = text;
    const saved = await stored(page);
    equal(test, saved.workbookNotes, expected, `${name}: learner-written thought is stored`);
    equal(test, saved.done, before.done, `${name}: optional notes do not complete a required activity`);
    if (index !== 19) check(test, await page.locator('[data-action="next"]').isDisabled(), `${name}: note alone cannot bypass its stage requirement`);
  }
  await page.reload({ waitUntil: 'networkidle' });
  await start(page);
  for (const [name, index] of fields) {
    await jump(page, index);
    equal(test, await (await expandField(page, `[data-workbook-note="${name}"]`)).inputValue(), expected[name], `${name}: text is restored after reload`);
  }
  await screenshot(page, test, 'thinking-notes-restored');
}

async function sourceSeparation(page, test) {
  await start(page);
  const screen = { off: 'other', low: 'bright', high: 'dim' };
  const real = { off: 'dim', low: 'other', high: 'off' };
  for (const [position, value] of Object.entries(screen)) await page.locator(`[data-record="${position}"]`).selectOption(value);
  await page.locator('#record-kind').selectOption('real');
  equal(test, await stageNumber(page), '2 / 20', 'real recording redirects to safety when equipment has not been checked');
  equal(test, await page.locator('[data-safe]:checked').count(), 0, 'screen safety acknowledgements cannot approve real equipment');
  check(test, await page.locator('[data-action="next"]').isDisabled(), 'real safety blocks return until all three checks are complete');
  equal(test, (await stored(page)).records, screen, 'redirecting to safety preserves the screen observations');
  const boxes = await page.locator('[data-safe]').all();
  equal(test, boxes.length, 3, 'physical safety exposes exactly three preparation checks');
  for (let i = 0; i < boxes.length; i++) {
    await boxes[i].check();
    if (i < 2) check(test, await page.locator('[data-action="next"]').isDisabled(), `${i + 1} preparation checks cannot approve physical observation`);
  }
  await page.locator('[data-action="next"]').click();
  equal(test, await stageNumber(page), '16 / 20', 'safety returns to the interrupted observation-record step');
  await page.locator('#record-kind').selectOption('real');
  for (const position of Object.keys(real)) equal(test, await page.locator(`[data-record="${position}"]`).inputValue(), '', `${position}: real record starts blank`);
  for (const [position, value] of Object.entries(real)) await page.locator(`[data-record="${position}"]`).selectOption(value);
  await page.locator('#record-kind').selectOption('screen');
  for (const [position, value] of Object.entries(screen)) equal(test, await page.locator(`[data-record="${position}"]`).inputValue(), value, `${position}: switching back restores the screen result`);
  equal(test, (await stored(page)).recordSets, { screen, real }, 'screen and real observations persist as independent records');
  await page.reload({ waitUntil: 'networkidle' });
  await start(page);
  await page.locator('#record-kind').selectOption('real');
  for (const [position, value] of Object.entries(real)) equal(test, await page.locator(`[data-record="${position}"]`).inputValue(), value, `${position}: real observations survive reload`);
  await screenshot(page, test, 'physical-records-restored');
}

async function openWorkbook(page) {
  const opener = page.locator('.top-actions [data-action="workbook"]');
  await opener.focus();
  await opener.click();
  const dialog = page.locator('dialog.science-workbook');
  await dialog.waitFor({ state: 'visible' });
  await page.locator('dialog.science-workbook[data-workbook-ready="true"]').waitFor({ state: 'attached' });
  await dialog.locator('.workbook-view-pages .workbook-page').first().waitFor({ state: 'attached' });
  return dialog;
}
async function workbookMode(dialog, mode) {
  await dialog.locator(`[data-workbook-mode="${mode}"]`).click();
  await dialog.locator('[data-workbook-print]:enabled').waitFor({ state: 'attached' });
  await dialog.locator('.workbook-view-pages .workbook-page').first().waitFor({ state: 'attached' });
}
async function closeWorkbook(page) {
  await page.locator('dialog.science-workbook [data-workbook-close]').first().click();
  await page.locator('dialog.science-workbook').waitFor({ state: 'detached' });
}
async function assertStudentPages(page, test, expected = STUDENT_PAGE_COUNT) {
  const dialog = page.locator('dialog.science-workbook');
  equal(test, await dialog.locator('.workbook-view-pages .workbook-page').count(), expected, `${expected} student pages are rendered`);
  equal(test, await dialog.locator('.workbook-teacher-page').count(), 0, 'student workbook DOM contains no teacher pages');
  const text = await dialog.textContent();
  check(test, teacherTitles.every(title => !text.includes(title)), 'teacher explanation titles are absent from the student DOM');
}
async function assertNoHorizontalOverflow(page, test, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth },
    containers: [...document.querySelectorAll('dialog.science-workbook,.workbook-scroll,.workbook-view-pages,.workbook-page,.notebook-fields')]
      .filter(element => element.getClientRects().length && getComputedStyle(element).display !== 'none')
      .map(element => ({ selector: element.className, page: element.dataset.page, scroll: element.scrollWidth, client: element.clientWidth }))
  }));
  check(test, dimensions.document.scroll <= dimensions.viewport + 2 && dimensions.containers.every(item => item.scroll <= item.client + 2), `${label}: no horizontal overflow`, dimensions);
}
async function assertTabTrap(page, test, dialog) {
  const focusable = dialog.locator('button:visible:not(:disabled),a[href]:visible,summary:visible,input:visible:not(:disabled),select:visible:not(:disabled),textarea:visible:not(:disabled)');
  await focusable.first().focus();
  await page.keyboard.press('Shift+Tab');
  check(test, await dialog.evaluate(element => element.contains(document.activeElement)), 'reverse Tab stays in the native workbook dialog');
  await focusable.last().focus();
  await page.keyboard.press('Tab');
  check(test, await dialog.evaluate(element => element.contains(document.activeElement)), 'forward Tab stays in the native workbook dialog');
}
async function observePrint(page) {
  await page.evaluate(() => {
    if (window.__workbookPrintObserver) return;
    window.__workbookPrintObserver = true;
    window.__workbookPrintEvents = [];
    addEventListener('beforeprint', () => {
      const root = document.querySelector('body > .workbook-print-root');
      const pages = [...(root?.querySelectorAll('.workbook-page') || [])];
      window.__workbookPrintEvents.push({
        type: 'beforeprint', present: !!root, printing: document.body.classList.contains('workbook-printing'),
        printMedia: matchMedia('print').matches,
        pages: pages.map(element => element.dataset.page),
        teacherPages: root?.querySelectorAll('.workbook-teacher-page').length || 0,
        filled: [...(root?.querySelectorAll('.wb-writing.wb-filled') || [])].map(element => element.textContent),
        statuses: [...(root?.querySelectorAll('.wb-record-status') || [])].map(element => element.textContent),
        continuations: [...(root?.querySelectorAll('.wb-continuation-text') || [])].map(element => element.textContent),
        text: root?.textContent || '',
        appDisplay: document.querySelector('#app') ? getComputedStyle(document.querySelector('#app')).display : null,
        workbookDisplay: document.querySelector('dialog.science-workbook') ? getComputedStyle(document.querySelector('dialog.science-workbook')).display : null,
        overflowing: pages.filter(element => element.scrollWidth > element.clientWidth + 2).map(element => element.dataset.page)
      });
    });
    addEventListener('afterprint', () => window.__workbookPrintEvents.push({ type: 'afterprint' }));
  });
}
async function printWorkbook(page, test, label) {
  await observePrint(page);
  const count = await page.evaluate(() => window.__workbookPrintEvents.filter(event => event.type === 'beforeprint').length);
  // Headless Chromium throttles repeated native jobs after cancelling its dialog.
  await page.waitForTimeout(3000);
  // Invoke the real user button and native print function, never a print stub.
  await page.locator('dialog.science-workbook [data-workbook-print]').click();
  await page.waitForFunction(count => window.__workbookPrintEvents.filter(event => event.type === 'beforeprint').length > count, count);
  const printed = await page.evaluate(() => window.__workbookPrintEvents.filter(event => event.type === 'beforeprint').at(-1));
  (test.prints ||= []).push({ label, ...printed });
  check(test, printed.present && printed.printing, `${label}: the print button prepares an isolated printable workbook`);
  // Native beforeprint can precede the print-media switch in headless Chromium.
  // In that case retain the observed DOM, and leave actual PDF layout to root QA.
  if (printed.printMedia) {
    equal(test, printed.appDisplay, 'none', `${label}: lesson and 3D are excluded from workbook printing`);
    equal(test, printed.workbookDisplay, 'none', `${label}: dialog chrome is excluded from workbook printing`);
    equal(test, printed.overflowing, [], `${label}: printed pages have no horizontal overflow`);
  } else {
    (test.limitations ||= []).push(`${label}: native beforeprint preceded print media; actual PDF must verify hidden lesson/dialog and page overflow.`);
  }
  await page.waitForFunction(() => !document.querySelector('.workbook-print-root') && !document.body.classList.contains('workbook-printing'));
  pass(test, `${label}: native afterprint removes temporary print content`);
  return printed;
}

async function workbookContract(page, test) {
  await start(page);
  await selectObservation(page, 'parallel-remove');
  const before = await snapshot(page, true);
  check(test, before.stageCount === 1 && !!before.rootUuid, 'workbook opens over the existing real 3D stage');
  const scrollBefore = await page.evaluate(() => ({ body: document.body.style.overflow, root: document.documentElement.style.overflow }));
  const dialog = await openWorkbook(page);
  check(test, await dialog.evaluate(element => element.matches(':modal') && element.parentElement === document.documentElement), 'workbook is a native modal in the fullscreen document');
  equal(test, await snapshot(page), before, 'opening the workbook preserves current step, batteries, real 3D identity and all storage');
  await assertStudentPages(page, test);
  equal(test, await dialog.locator('.wb-record-status').count(), 5, 'completion-only observations are labelled as content not yet recorded');
  equal(test, await dialog.locator('.wb-writing.wb-filled').count(), 0, 'completion-only observations generate no model answers in writing spaces');
  equal(test, await dialog.locator('[data-workbook-mode="teacher"]').count(), 0, 'student mode exposes no teacher-material switch');
  const locked = dialog.locator('[data-workbook-step="18"]').first();
  check(test, await locked.isDisabled(), 'workbook cannot jump to an unreached lesson step');
  check(test, await dialog.locator('.wb-locked-note').count() > 0, 'locked experiment links have an explanation');
  await assertTabTrap(page, test, dialog);
  await dialog.locator('[data-workbook-mode="record"]').focus();
  for (const name of ['ArrowRight', 'ArrowLeft', 'PageDown']) await page.keyboard.press(name);
  equal(test, await snapshot(page), before, 'workbook keyboard navigation cannot advance or change the experiment');

  await workbookMode(dialog, 'blank');
  equal(test, await dialog.locator('.wb-record-status').count(), 0, 'blank workbook removes observation-completion labels');
  equal(test, await dialog.locator('.wb-writing.wb-filled').count(), 0, 'blank workbook has no learner-filled writing spaces');
  const blank = await printWorkbook(page, test, 'blank');
  equal(test, blank.pages, Array.from({length:STUDENT_PAGE_COUNT}, (_,i)=>String(i+1)), 'blank print contains the complete student page set');
  equal(test, blank.teacherPages, 0, 'blank student print contains no teacher explanations');
  equal(test, blank.statuses, [], 'blank print does not imply observations have been made');
  await workbookMode(dialog, 'record');
  const record = await printWorkbook(page, test, 'completion-only-record');
  equal(test, record.statuses.length, 5, 'own-record print distinguishes completion from written content');
  equal(test, record.filled, [], 'own-record print never fabricates answers from completion IDs');
  equal(test, record.teacherPages, 0, 'own-record student print contains no teacher explanations');
  equal(test, await snapshot(page), before, 'mode switches and native printing preserve the experiment and saved records');
  await screenshot(page, test, 'completion-only-workbook');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  equal(test, await snapshot(page), before, 'Escape restores the unchanged experiment and same 3D object');
  check(test, await page.locator('.top-actions [data-action="workbook"]').evaluate(element => element === document.activeElement), 'Escape returns keyboard focus to the workbook opener');
  equal(test, await page.evaluate(() => ({ body: document.body.style.overflow, root: document.documentElement.style.overflow })), scrollBefore, 'Escape restores previous scrolling');
  await openWorkbook(page);
  await closeWorkbook(page);
  equal(test, await snapshot(page), before, 'visible close button also preserves the experiment after reopening');
}

async function teacherIsolation(page, test) {
  const before = await rawStored(page);
  await start(page, 'teacher');
  await jump(page, 15);
  await page.locator('#record-kind').selectOption('real');
  await page.locator('[data-record="low"]').selectOption('bright');
  await page.locator('#record-kind').selectOption('screen');
  await page.locator('[data-record="off"]').selectOption('dim');
  equal(test, await rawStored(page), before, 'teacher source switching and observations do not write to learner storage');
  await jump(page, 3);
  equal(test, await page.locator('#comparison-note').count(), 0, 'teacher comparison does not expose student note inputs');
  await page.locator('[data-observation="parallel-remove"]').click();
  const stage = await snapshot(page, true);
  const dialog = await openWorkbook(page);
  equal(test, await dialog.locator('.workbook-view-pages .workbook-teacher-page').count(), TEACHER_PAGE_COUNT, 'teacher workbook renders the complete teacher page set');
  equal(test, await dialog.locator('.workbook-view-pages .workbook-page').count(), TEACHER_PAGE_COUNT, 'teacher mode selects teacher material as its own print set');
  equal(test, await dialog.locator('[data-workbook-mode="record"]').count(), 0, 'teacher workbook cannot select private student records');
  check(test, !(await dialog.textContent()).includes(marker), 'teacher workbook contains no saved private student text');
  const printedTeacher = await printWorkbook(page, test, 'teacher-guide');
  equal(test, printedTeacher.pages, Array.from({length:TEACHER_PAGE_COUNT}, (_,i)=>`T${i+1}`), 'teacher print includes only its selected teacher pages');
  check(test, !printedTeacher.text.includes(marker), 'teacher print excludes saved private learner text');
  await workbookMode(dialog, 'blank');
  await assertStudentPages(page, test);
  equal(test, await dialog.locator('.wb-writing.wb-filled').count(), 0, 'teacher blank student handout contains no private records');
  const printedBlank = await printWorkbook(page, test, 'teacher-blank-handout');
  equal(test, printedBlank.pages.length, STUDENT_PAGE_COUNT, 'teacher can print an complete blank student handout');
  equal(test, printedBlank.teacherPages, 0, 'blank student handout excludes teacher explanations');
  check(test, !printedBlank.text.includes(marker), 'blank student handout excludes private learner text');
  await closeWorkbook(page);
  equal(test, await snapshot(page), stage, 'teacher workbook preserves its current live experiment');
  equal(test, await rawStored(page), before, 'teacher workbook and printing leave original learner storage byte-for-byte unchanged');
  await page.locator('[data-action="home"]').click();
  equal(test, await rawStored(page), before, 'returning from teacher mode still preserves original learner storage');
  await screenshot(page, test, 'teacher-return');
}

async function savedTextEscaping(page, test) {
  await start(page);
  await expandField(page, '[data-workbook-note="predictionReason"]');
  equal(test, await page.locator('[data-workbook-note="predictionReason"]').inputValue(), payload, 'saved markup remains literal text in the prediction note');
  await jump(page, 3);
  await selectObservation(page, 'one');
  equal(test, await page.locator('#comparison-reason').inputValue(), payload, 'saved markup remains literal text in an observation note');
  await jump(page, 18);
  equal(test, await page.locator('#draft').inputValue(), payload, 'saved markup remains literal text in the report textarea');
  const dialog = await openWorkbook(page);
  check(test, (await dialog.textContent()).includes('<script>window.__workbookXSS=1</script>'), 'workbook displays saved angle-bracket text without interpreting it');
  equal(test, await page.locator('[data-workbook-xss]').count(), 0, 'saved image markup does not create an element');
  equal(test, await dialog.locator('script').count(), 0, 'saved script markup does not create a script node');
  equal(test, await page.evaluate(() => window.__workbookXSS), 0, 'saved HTML does not execute');
  const record = await printWorkbook(page, test, 'escaped-record');
  check(test, record.text.includes('<script>window.__workbookXSS=1</script>'), 'print preserves literal learner text');
  equal(test, await page.evaluate(() => window.__workbookXSS), 0, 'native printing does not execute saved markup');
  await workbookMode(dialog, 'blank');
  check(test, !(await dialog.textContent()).includes('__workbookXSS'), 'blank rendering excludes malicious saved text entirely');
  const blank = await printWorkbook(page, test, 'escaped-state-blank');
  check(test, !blank.text.includes('__workbookXSS'), 'blank printing excludes all saved markup');
  await screenshot(page, test, 'escaped-text-blank');
}

async function viewportLayout(page, test) {
  await start(page);
  await selectObservation(page, 'parallel-remove');
  await page.locator('#comparison-reason').fill('화면에서 남은 길을 따라가 보았어요.');
  await assertNoHorizontalOverflow(page, test, 'comparison inputs');
  const inputBounds = await page.locator('#comparison-reason').boundingBox();
  check(test, inputBounds && inputBounds.x >= -1 && inputBounds.x + inputBounds.width <= test.viewport.width + 2, 'the optional observation textarea fits the viewport');
  const before = await snapshot(page, true);
  const dialog = await openWorkbook(page);
  await assertStudentPages(page, test);
  for (const number of Array.from({length:STUDENT_PAGE_COUNT},(_,i)=>i+1)) {
    await dialog.locator(`[data-workbook-page="${number}"]`).click();
    await assertNoHorizontalOverflow(page, test, `workbook page ${number}`);
  }
  await dialog.locator('[data-workbook-page="1"]').click();
  equal(test, await dialog.locator('.workbook-page:visible').count(), 1, 'living book shows one page at a time');
  check(test, await dialog.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), 'all real photographs decode before printing is enabled');
  const photoButton = dialog.locator('[data-workbook-photo="stand-off"]').first();
  await photoButton.click();
  const zoom = page.locator('.wb-photo-dialog');
  await zoom.waitFor();
  check(test, await zoom.evaluate(element => element.matches(':modal')), 'photograph opens in an accessible native modal');
  const zoomBounds = await zoom.boundingBox();
  check(test, zoomBounds && zoomBounds.x >= -1 && zoomBounds.y >= -1 && zoomBounds.x + zoomBounds.width <= test.viewport.width + 2 && zoomBounds.y + zoomBounds.height <= test.viewport.height + 2, 'expanded photograph fits the viewport');
  await page.keyboard.press('Escape');
  await zoom.waitFor({state:'detached'});
  check(test, await dialog.isVisible() && await photoButton.evaluate(element => element === document.activeElement), 'Escape closes only the photograph and restores its opener');
  await dialog.locator('[data-workbook-next]').click();
  equal(test, await dialog.locator('.workbook-page:visible').getAttribute('data-page'), '2', 'next page moves within the book');
  await dialog.locator('[data-workbook-prev]').click();
  equal(test, await dialog.locator('.workbook-page:visible').getAttribute('data-page'), '1', 'previous page returns within the book');
  await dialog.locator('[data-workbook-view]').click();
  equal(test, await dialog.locator('.workbook-page:visible').count(), STUDENT_PAGE_COUNT, 'collection view can show every student page');
  await dialog.locator('[data-workbook-view]').click();
  await dialog.locator('[data-workbook-page="8"]').click();
  check(test, await dialog.locator('.wb-reference-lock').isVisible() && !await dialog.locator('.wb-reference-photos').isVisible(), 'original glow photographs stay hidden before the five observations');
  await dialog.locator('[data-workbook-page="8"]').click();
  const closeBounds = await dialog.locator('[data-workbook-close]').first().boundingBox();
  check(test, closeBounds && closeBounds.y >= -1 && closeBounds.y + closeBounds.height <= test.viewport.height + 2, 'workbook close control remains on screen while reading');
  await assertTabTrap(page, test, dialog);
  await screenshot(page, test, 'workbook-responsive');
  const printed = await printWorkbook(page, test, `${test.viewport.name}-student-record`);
  equal(test, printed.teacherPages, 0, 'responsive student workbook print excludes teacher notes');
  equal(test, printed.pages.length, STUDENT_PAGE_COUNT, 'short student records retain the base page count');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  equal(test, await snapshot(page), before, 'responsive workbook and printing leave the live model and saved record unchanged');
  await jump(page, 15);
  await assertNoHorizontalOverflow(page, test, 'record-source controls');
  await page.locator('#record-kind').focus();
  await page.keyboard.press('Tab');
  check(test, await page.locator('[data-record="off"]').evaluate(element => element === document.activeElement), 'keyboard proceeds from source selection to the first observation');
  await screenshot(page, test, 'record-controls-responsive');
}

async function longReport(page, test) {
  await start(page);
  const text = Array.from({ length: 72 }, (_, index) => `${String(index + 1).padStart(2, '0')}줄: 내가 살핀 전류의 길과 스위치의 연결을 내 말로 설명해요. 다음 줄까지 기록이 이어집니다.`).join('\n');
  await page.locator('#draft').fill(text);
  equal(test, (await stored(page)).report, text, 'a long typed report is saved without truncation');
  check(test, await page.locator('[data-action="next"]').isDisabled(), 'typing a long report does not automatically claim review');
  const before = await snapshot(page, true);
  const dialog = await openWorkbook(page);
  const continuationCount = await dialog.locator('.wb-continuation-page').count();
  check(test, continuationCount > 0, 'long learner text produces continuation pages');
  const chunks = await dialog.locator('.wb-continuation-text').allTextContents();
  equal(test, chunks.join(''), text, 'continuation pages retain every character and line in order');
  await dialog.locator(`[data-workbook-page="${STUDENT_PAGE_COUNT+1}"]`).click();
  await assertNoHorizontalOverflow(page, test, 'long-report continuation');
  await screenshot(page, test, 'continuation-page');
  const printed = await printWorkbook(page, test, 'long-report-record');
  check(test, printed.pages.length > STUDENT_PAGE_COUNT && printed.continuations.length === continuationCount, 'print includes all continuation pages');
  equal(test, printed.continuations.join(''), text, 'print retains the complete long report, including its final line');
  equal(test, printed.teacherPages, 0, 'long-report printing includes no teacher explanations');
  (test.limitations ||= []).push('Text completeness and print DOM verified; root must inspect actual PDF page breaks and clipping.');
  await workbookMode(dialog, 'blank');
  equal(test, await dialog.locator('.workbook-page').count(), STUDENT_PAGE_COUNT, 'blank mode returns to the base page count despite a long saved report');
  equal(test, await dialog.locator('.wb-continuation-page').count(), 0, 'blank mode includes no private continuation pages');
  await closeWorkbook(page);
  equal(test, await snapshot(page), before, 'printing and changing workbook views preserve the full saved report');
}

add('legacy-migration', legacyMigration, { observations: ids, done: { compare: 'screen' }, records: { low: 'other' }, legacySentinel: 'keep-legacy-value' });
add('comparison-notes', comparisonNotes);
add('thinking-notes', thinkingNotes, { index: 2 });
add('record-sources-safety', sourceSeparation, { index: 15, screenChecks: [0, 1, 2] });
add('workbook-modal-print', workbookContract, { furthest: 3, observations: ids, done: { compare: 'screen' } });
add('teacher-isolation', teacherIsolation, { prediction: marker, report: marker, comparisonNotes: { one: { brightness: 'other', reason: marker } }, workbookNotes: { predictionReason: marker, trouble: marker, changedThought: marker, nextQuestion: marker }, records: { low: 'other' }, recordSets: { screen: { low: 'other' }, real: { high: 'dim' } } }, 'teacher');
add('saved-text-escaping', savedTextEscaping, { index: 2, prediction: payload, report: payload, comparisonNotes: { one: { brightness: 'other', reason: payload } }, workbookNotes: { predictionReason: payload, trouble: payload, changedThought: payload, nextQuestion: payload } });
for (const viewport of viewports) add(`${viewport.name}-layout`, viewportLayout, {}, 'self', viewport);
add('long-report-print', longReport, { index: 18 });

const selected = process.env.PILOT_CASES?.split(',').map(name => name.trim()).filter(Boolean);
const cases = tests.filter(test => !selected || selected.includes(test.name));
const report = { started: new Date().toISOString(), base, evidence: out, cases, passed: 0, failed: 0, fatal: null };
let browser;

async function runCase(test) {
  let context, page;
  const errors = [];
  test.status = 'running';
  test.started = new Date().toISOString();
  await persist();
  try {
    context = await browser.newContext({ viewport: { width: test.viewport.width, height: test.viewport.height }, screen: { width: test.viewport.width, height: test.viewport.height } });
    page = await context.newPage();
    page.setDefaultTimeout(timeout);
    page.setDefaultNavigationTimeout(timeout * 2);
    page.on('pageerror', error => errors.push({ type: 'pageerror', message: error.message }));
    page.on('response', response => { if (response.status() >= 400) errors.push({ type: 'http', status: response.status(), url: response.url() }); });
    await page.addInitScript(({ key, seed }) => {
      globalThis.SL_QUALITY = 'low';
      globalThis.__workbookXSS = 0;
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
    }, { key, seed: { ...defaultSeed(), ...test.seed } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await test.flow(page, test);
    check(test, errors.length === 0, 'no browser exceptions or missing assets', errors);
    test.status = 'passed';
    report.passed++;
  } catch (error) {
    test.status = 'failed';
    report.failed++;
    test.error = { message: error.message, stack: error.stack };
    console.error(`FAIL [${test.name}] ${error.stack || error}`);
    if (page) {
      try {
        test.diagnostic = await page.evaluate(() => ({
          url: location.href, viewport: { width: innerWidth, height: innerHeight },
          fullscreen: document.fullscreenElement?.tagName || null,
          step: document.querySelector('.step-number')?.textContent,
          task: document.querySelector('#task-next')?.textContent,
          reading: document.querySelector('#reading')?.textContent,
          nextDisabled: document.querySelector('[data-action="next"]')?.disabled,
          focus: document.activeElement?.outerHTML?.slice(0, 600),
          dialogs: [...document.querySelectorAll('dialog')].map(element => ({ open: element.open, className: element.className })),
          comparison: document.querySelector('#comparison-note')?.innerText,
          workbook: document.querySelector('dialog.science-workbook')?.innerText.slice(0, 2500),
          printEvents: window.__workbookPrintEvents || [],
          storage: Object.fromEntries(Object.keys(localStorage).map(name => [name, localStorage.getItem(name)]))
        }));
      } catch (diagnosticError) { test.diagnosticError = diagnosticError.message; }
      try { await screenshot(page, test, 'failure', true); } catch (captureError) { test.captureError = captureError.message; }
    }
  } finally {
    test.browserErrors = errors;
    test.ended = new Date().toISOString();
    try { await context?.close(); } catch (error) { test.closeError = error.message; }
    await persist();
  }
}

try {
  await mkdir(out, { recursive: true });
  assert.ok(cases.length, 'PILOT_CASES must select at least one case');
  assert.ok(!selected || selected.every(name => tests.some(test => test.name === name)), 'PILOT_CASES contains an unknown case');
  await persist();
  const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT || 'playwright');
  browser = await chromium.launch({ args: process.env.PILOT_GPU === 'hardware' ? [] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const test of cases) await runCase(test);
} catch (error) {
  report.fatal = { message: error.message, stack: error.stack };
} finally {
  try { await browser?.close(); } catch (error) { report.closeError = error.message; }
  report.ended = new Date().toISOString();
  report.checksPassed = cases.reduce((count, test) => count + test.checks.length, 0);
  report.remaining = cases.filter(test => ['not-run', 'running'].includes(test.status)).map(test => test.name);
  try { await persist(); } catch (error) { report.evidenceError = error.message; }
  console.log(JSON.stringify({ base, evidence: out, passed: report.passed, failed: report.failed, checksPassed: report.checksPassed, remaining: report.remaining, fatal: report.fatal, evidenceError: report.evidenceError }, null, 2));
  if (report.failed || report.fatal || report.remaining.length || report.evidenceError) process.exitCode = 1;
}
