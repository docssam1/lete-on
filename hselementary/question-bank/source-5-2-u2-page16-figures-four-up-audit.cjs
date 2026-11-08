'use strict';
const assert = require('node:assert/strict');
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || 'playwright');
const origin = process.env.HSE_AUDIT_ORIGIN || 'http://127.0.0.1:8918';
const diagramIds = ['5-2-u2-e2-example-2-synthetic', '5-2-u2-e2-example-4-synthetic'];
(async () => {
  const browser = await chromium.launch();
  try {
    for (const level of [-1, 0, 1]) for (const variant of [0, 1, 2]) {
      const width = level === -1 ? 320 : level === 0 ? 375 : 1440;
      const page = await browser.newPage({ viewport: { width, height: 1100 }, serviceWorkers: 'block' });
      await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: 'networkidle' });
      await page.locator('#gradeFilter [data-grade="5"]').click();
      await page.locator('#termFilter [data-term="2"]').click();
      await page.locator('#unitFilter').selectOption('5-2-u2');
      for (const id of [...diagramIds, '5-2-u2-e2-example-3-synthetic', '5-2-u2-e2-exploration-1-synthetic']) {
        await page.locator(`#typeList input[data-type-id="${id}"]`).check();
      }
      await page.locator(`#difficultyFilter [data-difficulty="${level}"]`).click();
      await page.locator('#questionCountInput').fill('4');
      await page.evaluate(({ diagramIds, variant }) => {
        const generate = HSE_GENERATORS.generate.bind(HSE_GENERATORS);
        HSE_GENERATORS.generate = (type, unit, level, seed, index) =>
          generate(type, unit, level, seed, diagramIds.includes(type.id) ? variant : index);
      }, { diagramIds, variant });
      await page.locator('#generateButton').click();
      await page.waitForFunction(() => !document.querySelector('#worksheet').hidden);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `horizontal overflow at ${width}px`);
      assert.equal(await page.locator('#problemView .question-item').count(), 4);
      assert.doesNotMatch(await page.locator('#problemView').innerText(), /도움말|힌트/);
      await page.locator('#printMenuButton').click();
      await page.locator('[data-print-mode="problem"]').click();
      await page.emulateMedia({ media: 'print' });
      await page.setViewportSize({ width: 794, height: 1123 });
      for (const id of diagramIds) {
        const question = page.locator(`#problemView [data-source-item-id="${id}"]`).first();
        const svg = question.locator('svg');
        const figure = await svg.boundingBox();
        const answer = await question.locator('xpath=ancestor::*[contains(concat(" ",normalize-space(@class)," ")," question-item ")][1]').locator('.answer-line').boundingBox();
        assert(figure && answer && figure.height >= 200, `${id} figure too small`);
        assert(figure.y + figure.height <= answer.y + 1, `${id} overlaps answer line`);
        const geometry = await svg.evaluate(el => {
          const view = el.viewBox.baseVal;
          const labels = [...el.querySelectorAll('.source52-p16e22-label')].map(text => {
            const box = text.getBBox();
            return { text: text.textContent, x: box.x, y: box.y, right: box.x + box.width, bottom: box.y + box.height };
          });
          return { width: view.width, height: view.height, labels, squares: el.querySelectorAll('.source52-p16e24-square').length };
        });
        if (id === diagramIds[0]) {
          const clipped = await svg.evaluate(el => {
            const viewport = el.getBoundingClientRect();
            return [...el.querySelectorAll('text')].filter(text => {
              const box = text.getBoundingClientRect();
              return box.width && box.height && (box.left < viewport.left - 0.5 || box.right > viewport.right + 0.5 || box.top < viewport.top - 0.5 || box.bottom > viewport.bottom + 0.5);
            }).map(text => text.textContent);
          });
          assert.deepEqual(clipped, [], `variant ${variant} level ${level}: clipped dimension labels`);
          assert.deepEqual(geometry.labels.map(x => x.text), ['㉮', '㉯']);
          assert(geometry.labels.every(x => x.x >= 0 && x.y >= 0 && x.right <= geometry.width && x.bottom <= geometry.height));
        } else assert.equal(geometry.squares, 6);
      }
      const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
      assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length, 1);
      await page.close();
    }
    console.log('PASS: 9 four-up A4 cases; both figures legible, labels in bounds, six squares, no answer overlap');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
