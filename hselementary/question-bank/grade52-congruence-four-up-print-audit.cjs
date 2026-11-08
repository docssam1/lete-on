'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:8932';
const ids = ['5-2-u3-e3-example-1', '5-2-u3-e3-mission-2', '5-2-u3-e3-mission-1', '5-2-u3-e3-mission-3'];
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [1280, 375]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, serviceWorkers: 'block' });
      await context.addInitScript(() => { window.print = () => {}; });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: 'load' });
      await page.locator('#gradeFilter [data-grade="5"]').click();
      await page.locator('#termFilter [data-term="2"]').click();
      await page.locator('#unitFilter').selectOption('5-2-u3');
      for (const id of ids) await page.locator(`#typeList input[data-type-id="${id}"]`).check();
      await page.locator('#questionCountInput').fill('4');
      await page.locator('#difficultyFilter [data-difficulty="0"]').click();
      await page.locator('#generateButton').click();
      await page.waitForFunction(() => !document.querySelector('#worksheet').hidden);
      assert.equal(await page.locator('#problemView .question-item').count(), 4);
      assert.equal(await page.locator('#problemView svg').count(), 4);
      assert.equal(await page.locator('#solutionView .solution-item').count(), 4);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await page.locator('#printMenuButton').click();
      await page.locator('#printMenuList [data-print-mode="problem"]').click();
      await page.emulateMedia({ media: 'print' });
      const overlap = await page.locator('#problemView .question-item').evaluateAll(items => items.some(item => {
        const prompt = item.querySelector('.question-prompt').getBoundingClientRect();
        const answer = item.querySelector('.answer-line').getBoundingClientRect();
        const box = item.getBoundingClientRect();
        return prompt.bottom > answer.top + 1 || answer.bottom > box.bottom + 1;
      }));
      assert.equal(overlap, false, 'question or diagram overlaps answer line');
      const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
      assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 1, 'four questions must fit one A4 page');
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log('PASS: grade 5-2 congruence four-up A4 print, desktop and mobile');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
