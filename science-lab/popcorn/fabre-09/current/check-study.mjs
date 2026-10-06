// Optional-reading and self-study regression. Run serially beside the existing flow checks.
// SCIENCE_PLAYWRIGHT points to the shared browser runtime; PILOT_SHOTS keeps evidence.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT || 'playwright');
const base = process.env.PILOT_URL || 'http://127.0.0.1:39247/science-lab/popcorn/fabre-09/current/';
const out = process.env.PILOT_SHOTS;
const key = 'popcorn.fabre09.current.v1';
const observations = ['one', 'series', 'parallel', 'series-remove', 'parallel-remove'];
const timeout = Number(process.env.PILOT_TIMEOUT) || 45000;
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 }
];
const cases = [
  { name: 'safety-and-observation-records', viewport: viewports[0], mode: 'self', status: 'not-run', checks: [] },
  ...viewports.flatMap(viewport => ['self', 'teacher'].map(mode => ({ name: `${viewport.name}-${mode}-reading`, viewport, mode, status: 'not-run', checks: [] })))
].filter(test => !process.env.PILOT_CASES || process.env.PILOT_CASES.split(',').includes(test.name));
assert.ok(cases.length, 'PILOT_CASES must select at least one case');
const report = { started: new Date().toISOString(), base, cases, passed: 0, failed: 0, fatal: null };
let browser;
if (out) await mkdir(out, { recursive: true });
const persist = async () => { if (out) await writeFile(join(out, 'study-qa.json'), JSON.stringify(report, null, 2)); };

function check(test, condition, message, actual) {
  assert.ok(condition, actual === undefined ? message : `${message}\nActual: ${JSON.stringify(actual)}`);
  test.checks.push(message);
  console.log(`PASS [${test.name}] ${message}`);
}
function equal(test, actual, expected, message) {
  assert.deepEqual(actual, expected, message);
  test.checks.push(message);
  console.log(`PASS [${test.name}] ${message}`);
}
async function screenshot(page, test, suffix, force = false) {
  if (!out || (!force && process.env.PILOT_CAPTURE === '0')) return;
  const file = `${test.name}-${suffix}.png`;
  await page.screenshot({ path: join(out, file), timeout });
  (test.screenshots ||= []).push(file);
}
const stored = page => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}'), key);
const stageNumber = page => page.locator('.step-number').innerText();
const jump = async (page, index) => {
  await page.locator('[data-action=steps]').click();
  await page.locator(`[data-step="${index}"]`).click();
  await page.locator('.step-number').filter({ hasText: `${index + 1} / 20` }).waitFor();
};
async function start(page, mode) {
  await page.locator(`[data-start=${mode}]`).click();
  await page.locator('.lesson-head h1').waitFor();
  await page.waitForFunction(() => !!document.querySelector('#model') || !!document.querySelector('.fallback'));
}

async function snapshot(page, remember = false) {
  return page.evaluate(async remember => {
    const { Stage } = await import('../../../engine.js');
    const stage = [...Stage.live].find(s => s.canvas?.id === 'model' && s.canvas.isConnected);
    if (remember) window.__studyOriginalStage = stage;
    const physicalCells = [], pointLights = [];
    stage?.root.traverse(object => {
      if (object.userData.cellParts) physicalCells.push({ holder: object.visible, parts: object.userData.cellParts.map(cell => cell.visible) });
      if (object.isPointLight) pointLights.push(object.intensity);
    });
    const reading = document.querySelector('#reading')?.textContent || '';
    return {
      step: document.querySelector('.step-number')?.textContent,
      title: document.querySelector('.lesson-head h1')?.textContent,
      compare: document.querySelector('[data-compare][aria-pressed=true]')?.dataset.compare,
      cells: [...document.querySelectorAll('[data-cell]')].map(cell => ({ id: cell.dataset.cell, checked: cell.checked })),
      volts: reading.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*V\b/)?.[1] || null,
      reading,
      physicalCells,
      pointLights,
      stageCount: Stage.live.size,
      rootUuid: stage?.root.uuid || null,
      sameStage: !!stage && stage === window.__studyOriginalStage,
      storage: Object.fromEntries(Object.keys(localStorage).sort().map(key => [key, localStorage.getItem(key)]))
    };
  }, remember);
}

async function safetyAndObservations(page, test) {
  await start(page, 'self');
  equal(test, await stageNumber(page), '2 / 20', 'seeded learner opens the safety stage');
  check(test, await page.locator('[data-practice=screen]').getAttribute('aria-pressed') === 'true', 'screen practice is selected');
  const screenWords = await page.locator('.checks label').allTextContents();
  for (const checkbox of await page.locator('[data-safe]').all()) await checkbox.check();
  let saved = await stored(page);
  equal(test, saved.screenChecks, [0, 1, 2], 'three screen safety promises are saved');
  equal(test, saved.checks, [], 'screen promises do not claim real equipment checks');
  check(test, await page.locator('[data-action=next]').isEnabled(), 'screen promises allow screen practice');
  await screenshot(page, test, 'screen-safety');
  await page.locator('[data-practice=real]').click();
  check(test, await page.locator('[data-safe]:checked').count() === 0, 'real equipment checks begin unchecked');
  check(test, await page.locator('[data-action=next]').isDisabled(), 'real experiment still requires its own checks');
  check(test, JSON.stringify(screenWords) !== JSON.stringify(await page.locator('.checks label').allTextContents()), 'screen promises and real checks use different wording');
  await page.locator('[data-practice=screen]').click();
  check(test, await page.locator('[data-safe]:checked').count() === 3, 'returning to screen practice restores its promises');

  await jump(page, 15);
  await page.locator('#record-kind').selectOption('real');
  equal(test, await stageNumber(page), '2 / 20', 'real observation records first require physical preparation checks');
  check(test, await page.locator('[data-action=next]').isDisabled(), 'screen promises cannot approve physical preparation');
  await jump(page, 4);
  await page.locator('[data-action=confirm][data-kind=real]').click();
  equal(test, await stageNumber(page), '2 / 20', 'real assembly confirmation requires physical preparation checks');
  for (const checkbox of await page.locator('[data-safe]').all()) await checkbox.check();
  check(test, (await page.locator('#task-next').innerText()).includes('준비물 찾기'), 'safety completion explains the return destination');
  await page.locator('[data-action=next]').click();
  equal(test, await stageNumber(page), '5 / 20', 'physical preparation returns to the interrupted assembly step');
  await page.locator('[data-action=confirm][data-kind=real]').click();
  equal(test, (await stored(page)).done.parts, 'real', 'physical completion records only after its own safety checks');

  await jump(page, 3);
  check(test, await page.locator('[data-observation]').count() === 5, 'comparison has five distinct observations');
  check(test, await page.locator('[data-action=next]').isDisabled(), 'unrecorded comparison cannot advance');
  await page.locator('[data-action=observe]').click();
  await page.locator('[data-action=observe]').click();
  equal(test, (await stored(page)).observations, ['one'], 'repeating one observation counts once');
  await page.locator('[data-compare=parallel]').click();
  await page.locator('[data-cell="1"]').uncheck();
  await page.locator('[data-cell="2"]').uncheck();
  await page.locator('[data-action=observe]').click();
  equal(test, (await stored(page)).observations, ['one'], 'zero batteries cannot be saved as a removal observation');
  check(test, (await page.locator('#observe-feedback').innerText()).includes('전지 한 개'), 'zero-battery attempt provides an actionable hint');
  const expectedVolts = { series: '3', parallel: '1.5', 'series-remove': '0', 'parallel-remove': '1.5' };
  for (const id of observations.slice(1)) {
    const before = (await stored(page)).observations;
    await page.locator(`[data-observation="${id}"]`).click();
    equal(test, (await stored(page)).observations, before, `selecting ${id} alone does not record it`);
    equal(test, (await snapshot(page)).volts, expectedVolts[id], `${id} shows the expected voltage`);
    await page.locator('[data-action=observe]').click();
    if (id !== 'parallel-remove') check(test, await page.locator('[data-action=next]').isDisabled(), `${id}: unfinished observations still block Next`);
  }
  equal(test, (await stored(page)).observations, observations, 'all five distinct observations persist');
  check(test, await page.locator('[data-action=next]').isEnabled(), 'five observations unlock Next');
  await page.reload({ waitUntil: 'networkidle' });
  await start(page, 'self');
  equal(test, (await stored(page)).observations, observations, 'all five observations survive reload');
  check(test, (await page.locator('#compare-plan').innerText()).includes('5/5'), 'restored progress is visible as 5/5');
  check(test, await page.locator('#compare-plan button').evaluateAll(buttons => buttons.every(b => b.textContent.includes('관찰함'))), 'each restored observation is visibly marked');
  check(test, await page.locator('[data-action=next]').isEnabled(), 'restored comparison remains complete');
  await screenshot(page, test, 'observations-restored');

  await page.locator('[data-action=help]').click();
  await page.locator('[data-helper="3"]').click();
  await page.locator('[data-close]').click();
  const stopped = await snapshot(page, true);
  equal(test, stopped.volts, '0', 'hot battery warning removes power');
  check(test, stopped.cells.every(cell => !cell.checked), 'hot battery warning removes both batteries');
  check(test, await page.locator('[data-observation], [data-compare], [data-cell]').evaluateAll(items => items.every(item => item.disabled)), 'hot stop disables observation choices, connection choices and batteries');
  check(test, await page.locator('[data-action=next]').isDisabled(), 'closing the warning does not resume the experiment');
  // A stray delegated click must not reactivate controls after the safety stop.
  await page.locator('[data-observation=parallel]').dispatchEvent('click');
  await page.locator('[data-compare=series]').dispatchEvent('click');
  await page.locator('[data-action=observe]').click();
  equal(test, await snapshot(page), stopped, 'observation and comparison events cannot resume a hot-stopped experiment');
  await screenshot(page, test, 'hot-stop');
}

async function readingCase(page, test) {
  await start(page, test.mode);
  if (test.mode === 'teacher') {
    if (test.viewport.name === 'desktop') {
      await jump(page, 4);
      const before = await page.evaluate(key => localStorage.getItem(key), key);
      await page.locator('[data-action=confirm][data-kind=real]').click();
      equal(test, await stageNumber(page), '5 / 20', 'teacher real-equipment confirmation stays on the current stage');
      equal(test, await page.evaluate(key => localStorage.getItem(key), key), before, 'teacher confirmation preserves learner storage');
    }
    await jump(page, 3);
  }
  await page.locator('[data-observation=parallel-remove]').click();
  check(test, (await page.locator('#reading').innerText()).includes('1.5 V'), 'comparison begins with one remaining parallel battery');
  const nativeFullscreen = await page.evaluate(() => document.fullscreenEnabled);
  if (nativeFullscreen) {
    await page.waitForFunction(() => document.fullscreenElement === document.documentElement);
    check(test, true, 'lesson uses native document fullscreen');
  } else {
    (test.limitations ||= []).push('Native fullscreen unsupported; fullscreen assertions skipped.');
  }

  if (test.mode === 'self' && test.viewport.name === 'desktop') {
    // Establish a known paused state before enabling real narration. During a
    // network load, audio can be playing before the speaking class appears;
    // clicking the play toggle in that interval would pause it accidentally.
    const mute = page.locator('#guide [data-guide=mute]');
    if (await mute.getAttribute('aria-pressed') === 'false') await mute.click();
    await mute.click();
    await page.waitForFunction(() => document.querySelector('#guide')?.classList.contains('speaking'));
    check(test, true, 'real narration is speaking before the magazine opens');
  }
  const opener = page.locator('.top-actions [data-action=magazine]');
  await opener.focus();
  const before = await snapshot(page, true);
  check(test, before.stageCount === 1 && !!before.rootUuid, 'one real 3D stage exists before reading');
  const scrollBefore = await page.evaluate(() => ({ body: document.body.style.overflow, root: document.documentElement.style.overflow }));
  await opener.click();
  const dialog = page.locator('dialog.science-magazine');
  await dialog.waitFor({ state: 'visible' });
  check(test, await dialog.evaluate(d => d.matches(':modal') && d.parentElement === document.documentElement), 'magazine is a native modal above the fullscreen lesson');
  equal(test, await snapshot(page), before, 'opening reading preserves stage, cells, voltage, 3D identity and all storage');
  check(test, await page.locator('#guide.speaking').count() === 0, 'reading pauses narration and speaking animation');
  equal(test, await page.locator('.magazine-article').count(), 3, 'three articles are available');
  equal(test, await page.locator('.magazine-videos > ul a').count(), 4, 'four source textbook videos remain available');
  equal(test, await page.locator('.magazine-teacher-note').count(), test.mode === 'teacher' ? 3 : 0, 'discussion notes appear only in teacher mode');
  check(test, await dialog.locator('a[href^="http"]').evaluateAll(links => links.length > 0 && links.every(link => link.target === '_blank' && link.relList.contains('noopener') && link.relList.contains('noreferrer'))), 'external readings and videos open protected new tabs');
  check(test, await dialog.evaluate(d => d.scrollWidth <= d.clientWidth + 1 && d.querySelector('.magazine-scroll').scrollWidth <= d.querySelector('.magazine-scroll').clientWidth + 1), 'magazine has no horizontal overflow');
  check(test, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'lesson has no horizontal overflow');
  await screenshot(page, test, 'cover');

  await page.locator('#magazine-battery-title').focus();
  for (const key of ['ArrowRight', ' ', 'ArrowLeft', 'PageDown']) await page.keyboard.press(key);
  equal(test, await snapshot(page), before, 'reading keyboard navigation cannot advance or alter the lesson');
  await page.locator('.magazine-close').focus();
  await page.keyboard.press('Shift+Tab');
  check(test, await page.evaluate(() => document.querySelector('.science-magazine').contains(document.activeElement)), 'reverse Tab stays in the modal');
  await page.locator('.magazine-ending button').focus();
  await page.keyboard.press('Tab');
  check(test, await page.evaluate(() => document.querySelector('.science-magazine').contains(document.activeElement)), 'forward Tab stays in the modal');
  await page.locator('[data-magazine-go=city]').click();
  check(test, await page.locator('.magazine-scroll').evaluate(el => el.scrollTop > 0), 'contents navigation scrolls within the magazine');
  const closeBounds = await page.locator('.magazine-close').boundingBox();
  check(test, closeBounds && closeBounds.y >= 0 && closeBounds.y + closeBounds.height <= test.viewport.height + 1, 'return button stays visible while reading');
  await page.locator('#magazine-city details summary').click();
  check(test, await page.locator('#magazine-city details').evaluate(details => details.open), 'thinking prompt can be expanded');
  await screenshot(page, test, 'article');
  await page.emulateMedia({ media: 'print' });
  check(test, await dialog.evaluate(d => getComputedStyle(d).display === 'none'), 'magazine is excluded from printed experiment records');
  await page.emulateMedia({ media: 'screen' });

  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  equal(test, await snapshot(page), before, 'Escape returns to the unchanged lesson and original 3D stage');
  check(test, await opener.evaluate(button => document.activeElement === button), 'Escape restores focus to the reading opener');
  equal(test, await page.evaluate(() => ({ body: document.body.style.overflow, root: document.documentElement.style.overflow })), scrollBefore, 'closing reading restores previous page scrolling');
  check(test, await page.locator('#guide.speaking').count() === 0, 'closing reading does not unexpectedly restart narration');
  await opener.click();
  await page.locator('.magazine-close').click();
  check(test, await page.locator('dialog.science-magazine').count() === 0, 'visible return button closes a reopened magazine');
  equal(test, await snapshot(page), before, 'repeated opening and closing preserves the experiment');

  if (nativeFullscreen) {
    await page.locator('[data-action=model-fullscreen]').click();
    await page.waitForFunction(() => document.fullscreenElement?.classList.contains('viewport'));
    check(test, await page.locator('.viewport').evaluate(view => view.clientHeight >= innerHeight * .97), 'enlarged 3D occupies the viewport');
    equal(test, await page.locator('.viewport #guide').count(), test.mode === 'self' ? 1 : 0, 'guide follows enlarged 3D only for the learner');
    await page.locator('[data-action=model-exit]').click();
    await page.waitForFunction(() => !document.fullscreenElement);
    equal(test, await snapshot(page), before, '3D enlargement and return preserve the same model and experiment');
    if (test.mode === 'self') check(test, await page.locator('.text-panel #guide').count() === 1, 'guide returns beside the lesson');
  }
}

async function runCase(test, flow) {
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
    const seed = {
      index: test.name === 'safety-and-observation-records' ? 1 : 3, furthest: 19,
      checks: [], screenChecks: [], practice: 'screen',
      observations: test.name === 'safety-and-observation-records' ? [] : observations,
      done: test.name === 'safety-and-observation-records' ? {} : { compare: 'screen' },
      prediction: '직렬이 더 밝을 것 같아요', report: '검수용 기존 학습 기록'
    };
    await page.addInitScript(({ key, seed }) => {
      globalThis.SL_QUALITY = 'low';
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(seed));
    }, { key, seed });
    await page.goto(base, { waitUntil: 'networkidle' });
    await flow(page, test);
    check(test, errors.length === 0, 'no browser errors or missing assets', errors);
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
          nextDisabled: document.querySelector('[data-action=next]')?.disabled,
          focus: document.activeElement?.outerHTML?.slice(0, 500),
          dialogs: [...document.querySelectorAll('dialog')].map(d => ({ open: d.open, className: d.className })),
          observations: document.querySelector('#compare-plan')?.innerText,
          storage: Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)]))
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
  browser = await chromium.launch({ args: process.env.PILOT_GPU === 'hardware' ? [] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const test of cases) await runCase(test, test.name === 'safety-and-observation-records' ? safetyAndObservations : readingCase);
} catch (error) {
  report.fatal = { message: error.message, stack: error.stack };
} finally {
  try { await browser?.close(); } catch (error) { report.closeError = error.message; }
  report.ended = new Date().toISOString();
  report.checksPassed = cases.reduce((total, test) => total + test.checks.length, 0);
  report.remaining = cases.filter(test => test.status === 'not-run' || test.status === 'running').map(test => test.name);
  await persist();
  console.log(JSON.stringify({base, passed:report.passed, failed:report.failed, checksPassed:report.checksPassed, remaining:report.remaining, fatal:report.fatal}, null, 2));
  if (report.failed || report.fatal || report.remaining.length) process.exitCode = 1;
}
