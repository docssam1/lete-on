'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:18769';
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1280, 375]) {
      for (const mode of ['problem', 'answer-key', 'solution', 'all']) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
        await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
        const page = await context.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => { window.print = () => {}; });
        await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: 'load' });
        await page.locator("#gradeFilter [data-grade='5']").click();
        await page.locator("#termFilter [data-term='2']").click();
        await page.locator('#unitFilter').selectOption('5-2-u5');
        for (const n of [34, 37, 38, 39]) await page.locator(`#typeList input[data-type-id='5-2-u5-practice-${n}-original']`).check();
        await page.locator('#questionCountInput').fill('4');
        await page.locator('#generateButton').click();
        await page.waitForFunction(() => !document.querySelector('#worksheet').hidden);
        await page.locator('#printMenuButton').click();
        await page.locator(`#printMenuList [data-print-mode='${mode}']`).click();
        await page.waitForFunction(mode => document.body.dataset.printMode === mode, mode);
        await page.emulateMedia({ media: 'print' });
        const visible = await page.evaluate(() => ['problemView', 'answerKeyView', 'solutionView'].map(id => !document.getElementById(id).hidden));
        assert.deepEqual(visible, { problem: [true, false, false], 'answer-key': [false, true, false], solution: [false, false, true], all: [true, false, true] }[mode]);
        if (mode === 'answer-key') {
          const mark = page.locator('#answerKeyView .watermark');
          assert.equal(await mark.count(), 1);
          assert.equal(await mark.locator('span').first().evaluate(el => getComputedStyle(el).color), 'rgba(0, 0, 0, 0.035)');
          assert.equal(await mark.locator('span').first().evaluate(el => getComputedStyle(el).fontWeight), '500');
          assert((await mark.boundingBox()).height > 900, 'watermark is spread over the A4 page');
          assert.equal(await page.locator('#answerKeyView .answer-key-grid > div').count(), 4);
        }
        if (process.env.MAC_CHECK_OUTPUT && width === 1280) {
          const pdf = await page.pdf({ path: path.join(process.env.MAC_CHECK_OUTPUT, `${mode}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
          const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
          assert.equal(pages, { problem: 1, 'answer-key': 1, solution: 2, all: 3 }[mode]);
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
  } finally { await browser.close(); }
  console.log('PASS: four print modes and a legible A4 answer-key watermark');
})().catch(error => { console.error(error); process.exitCode = 1; });
