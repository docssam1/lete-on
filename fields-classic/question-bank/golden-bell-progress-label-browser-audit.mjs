import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { GOLDEN_BELL_BOOKS } from './golden-bell-data.js';

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = await import(pathToFileURL(path.join(modules, 'playwright/index.mjs')).href);
const base = process.env.FIELDS_BASE_URL || 'http://127.0.0.1:8794';
const browser = await chromium.launch();
const results = [];
const screenshots = [];
// Fresh guest contexts only: no answer fixtures, session injection, or grading.
try {
  for (const width of [1440, 390]) {
    for (const book of GOLDEN_BELL_BOOKS) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => errors.push(request.failure()?.errorText));
      await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${book.id}`, { waitUntil: 'networkidle' });
      let pagedLessons = 0;
      let markers = 0;
      for (const lesson of book.lessons) {
        const label = `${book.id}/${lesson.id}/${width}`;
        await page.locator(`[data-lesson="${lesson.id}"]`).click();
        await page.locator('[data-next-phase="original"]').click();
        assert.equal(await page.locator('[data-phase="original"]').getAttribute('aria-current'), 'step', label);
        assert.ok(await page.locator('[data-original-item]').first().isVisible(), label);
        if (lesson.original.mode === 'paged') {
          pagedLessons += 1;
          const dots = page.locator('.source-question-progress > span');
          const expected = lesson.original.items;
          assert.equal(await dots.count(), expected.length, label);
          assert.equal(await page.locator('[data-original-item]').getAttribute('data-original-item'), expected[0].id, label);
          const metadata = await dots.evaluateAll(nodes => nodes.map(node => ({
            text: node.textContent, title: node.title, label: node.getAttribute('aria-label'), current: node.getAttribute('aria-current')
          })));
          metadata.forEach((item, index) => {
            assert.equal(item.text, String(index + 1), label);
            assert.equal(item.title, String(expected[index].sourceNo || index + 1), label);
            assert.equal(item.label, `${index + 1}번째 문제 · 원문 번호 ${expected[index].sourceNo || index + 1}`, label);
            assert.equal(item.current, index === 0 ? 'step' : null, label);
          });
          markers += metadata.length;
          // Include off-screen markers and the horizontal scroll endpoint.
          for (const last of [false, true]) {
            await page.locator('.source-question-progress').evaluate((node, end) => { node.scrollLeft = end ? node.scrollWidth : 0; }, last);
            const bad = await dots.evaluateAll(nodes => nodes.flatMap((node, index) => {
              const range = document.createRange();
              range.selectNodeContents(node);
              const text = range.getBoundingClientRect();
              const box = node.getBoundingClientRect();
              const next = nodes[index + 1]?.getBoundingClientRect();
              return text.left < box.left - 1 || text.right > box.right + 1 || text.top < box.top - 1 || text.bottom > box.bottom + 1 || (next && box.right > next.left + 1) ? [index] : [];
            }));
            assert.deepEqual(bad, [], `${label}: marker overlap`);
          }
          await page.locator('.source-question-progress').evaluate(node => { node.scrollLeft = 0; });
          if (book.id === 'book-10' && lesson === book.lessons[0] && process.env.FIELDS_INLINE_SCREENSHOTS === '1') {
            screenshots.push({ width, base64: (await page.locator('.source-question-progress').screenshot()).toString('base64') });
          }
        }
        const input = page.locator('[data-original-item] input').first();
        if (await input.count()) {
          await input.fill('0');
          await input.fill('');
        }
        assert.equal(await page.locator('.protected-answer-notice').count(), 1, label);
        assert.equal(await page.locator('[data-original-answer]').first().isDisabled(), true, label);
        assert.equal(await page.locator('[data-original-check],[data-check="original"]').evaluateAll(nodes => nodes.length > 0 && nodes.every(node => node.disabled)), true, label);
        assert.equal(await page.locator('[data-phase="extension"]').isDisabled(), true, label);
        assert.equal(await page.locator('.quiz-item-solution,.original-solution,.source-solution').count(), 0, label);
        await page.locator('[data-phase="concept"]').click();
        await page.locator('[data-phase="original"]').click();
        assert.ok(await page.locator('[data-original-item]').first().isVisible(), label);
      }
      assert.deepEqual(errors, [], `${book.id}/${width}`);
      results.push({ book: book.id, width, lessons: book.lessons.length, pagedLessons, markers, status: 'PASS' });
      console.log(`PROGRESS_LABEL_BOOK_OK ${JSON.stringify(results.at(-1))}`);
      await context.close();
    }
  }
  console.log(`PROGRESS_LABEL_BROWSER_OK ${JSON.stringify({ results })}`);
  for (const screenshot of screenshots) console.log(`INLINE_SCREENSHOT ${JSON.stringify(screenshot)}`);
} finally {
  await browser.close();
}
