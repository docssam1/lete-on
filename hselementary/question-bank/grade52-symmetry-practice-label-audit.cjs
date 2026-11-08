'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:18767';
const practice = [
  '5-2-u3-e7-example-4-shaded-parallelogram-synthetic',
  '5-2-u3-e7-mission-3-parallelogram-overlap-synthetic',
  '5-2-u3-e7-mission-4-grid-construction-synthetic',
  '5-2-u3-e7-example-3-letter-rotation-synthetic',
  '5-2-u3-e7-example-2-dotboard-area-synthetic',
  '5-2-u3-e7-mission-5-rotating-triangle-synthetic',
  '5-2-u3-e7-mission-2-arrow-overlap-synthetic',
  '5-2-u3-e7-mission-1-rotated-addition-synthetic',
  '5-2-u3-e7-mission-6-triangle-area-synthetic',
  '5-2-u3-e7-example-1-quadrilateral-synthetic',
  '5-2-u3-e8-exploration-staircase-half-synthetic',
  '5-2-u3-e8-example-1-circle-difference-synthetic'
];
const original = '5-2-u3-e7-mission-1-original';
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => { window.print = () => {}; });
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: 'load' });
      await page.locator("#gradeFilter [data-grade='5']").click();
      await page.locator("#termFilter [data-term='2']").click();
      await page.locator('#unitFilter').selectOption('5-2-u3');
      for (const id of practice) {
        const row = page.locator(`[data-preview-type-id="${id}"]`);
        assert.match(await row.locator('strong').innerText(), /^연습 ·/, id);
      }
      const missing = await page.evaluate(() => window.HSE_CURRICULUM.semesters.find(s => s.id === '5-2').units.flatMap(u => u.subunits.flatMap(g => g.types)).filter(t => !t.reviewLocked && /구조 연습/.test(t.sourceItemLabel || '') && !/유사문항|연습|조건변형/.test(t.label || t.name)).map(t => t.id));
      assert.deepEqual(missing, [], 'source-derived practice must be labeled in its title');
      const originalRow = page.locator(`[data-preview-type-id="${original}"]`);
      assert.match(await originalRow.locator('strong').innerText(), /원문/);
      const selected = [practice[0], practice[1], practice[6], original];
      for (const id of selected) await page.locator(`#typeList input[data-type-id="${id}"]`).check();
      await page.locator('#questionCountInput').fill('4');
      await page.locator('#generateButton').click();
      await page.waitForFunction(() => !document.querySelector('#worksheet').hidden);
      const items = page.locator('#problemView .question-item');
      assert.equal(await items.count(), 4);
      for (const item of await items.all()) {
        const id = await item.locator('[data-source-item-id]').first().getAttribute('data-source-item-id');
        const header = await item.locator('header').innerText();
        assert.match(header, id === original ? /원문/ : /연습 ·/, id);
      }
      assert.equal(await page.locator('#solutionView .solution-item').count(), 4);
      if (width === 1280 && process.env.MAC_CHECK_OUTPUT) {
        await page.locator('#printMenuButton').click();
        await page.locator('#printMenuList [data-print-mode="problem"]').click();
        await page.emulateMedia({ media: 'print' });
        const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, 'problem.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
        assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 1);
      }
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
  console.log('PASS: twelve practice labels and original are distinguished on screen and A4');
})().catch(error => { console.error(error); process.exitCode = 1; });
