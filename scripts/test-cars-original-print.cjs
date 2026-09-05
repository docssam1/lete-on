const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const base = process.env.CARS_PRINT_URL || 'http://127.0.0.1:8877/reading-world/print.html';
const outDir = process.env.CARS_PRINT_QA_DIR || '';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  const sourceCalls = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (!response.url().includes('/lesson_content?')) return;
    const lesson = response.url().match(/lesson_id=eq\.([^&]+)/)?.[1] || '';
    sourceCalls.push({ lesson, status: response.status() });
  });

  try {
    await page.goto(`${base}#c=c`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const modal = document.getElementById('brandModal');
      if (modal) modal.hidden = true;
    });

    assert.equal(await page.locator('[data-part-cb="c:original"]').isChecked(), true);
    assert.equal(await page.locator('[data-part-cb="c:extra"]').isChecked(), false);

    try {
      await page.waitForFunction(() => {
        const sheets = document.getElementById('sheets');
        const sources = new Set(Array.from(document.querySelectorAll('#sheets .sheet.paper'))
          .filter((sheet) => /Original/.test(sheet.querySelector('.sh-top h1')?.textContent || '')
            && sheet.querySelector('.psg'))
          .map((sheet) => sheet.querySelector('.sh-src')?.textContent.trim() || '')
          .filter((text) => text.startsWith('CARS Level C · Lesson ')));
        return sources.size === 10
          && !sheets.innerText.includes('불러오는 중');
      }, null, { timeout: 20000 });
    } catch (error) {
      const state = await page.evaluate(() => ({
        originalBlocks: Array.from(document.querySelectorAll('#sheets .sheet.paper'))
          .filter((sheet) => /Original/.test(sheet.querySelector('.sh-top h1')?.textContent || '')
            && sheet.querySelector('.psg')).length,
        sheets: document.querySelectorAll('#sheets .sheet').length,
        loading: document.getElementById('sheets').innerText.includes('불러오는 중'),
        preview: document.getElementById('sheets').innerText.slice(0, 180),
      }));
      console.error(JSON.stringify({ state, sourceCalls }, null, 2));
      throw error;
    }

    const result = await page.evaluate(() => {
      const originals = Array.from(document.querySelectorAll('#sheets .sheet.paper'))
        .filter((sheet) => /Original/.test(sheet.querySelector('.sh-top h1')?.textContent || '')
          && sheet.querySelector('.psg'));
      const sources = originals.map((sheet) => sheet.querySelector('.sh-src')?.textContent.trim() || '');
      return {
        distinctSources: Array.from(new Set(sources)).sort(),
        originalBlocks: originals.length,
        originalTextBlocks: originals.filter((sheet) => sheet.querySelector('.psg').textContent.trim().length > 0).length,
        emptyState: document.querySelector('#sheets .empty')?.textContent.trim() || '',
      };
    });

    assert.deepEqual(
      result.distinctSources,
      Array.from({ length: 10 }, (_, index) => `CARS Level C · Lesson ${index + 1}`).sort(),
      'all ten CARS C originals must appear in the print preview'
    );
    assert.ok(result.originalBlocks >= 10, 'each CARS C lesson needs an original passage block');
    assert.equal(result.originalTextBlocks, result.originalBlocks, 'original passage blocks cannot be blank');
    assert.equal(result.emptyState, '');
    assert.equal(sourceCalls.length, 10, 'the preview should request each CARS C original once');
    assert.equal(sourceCalls.every((call) => call.status === 200), true, JSON.stringify(sourceCalls));
    assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join('; ')}`);

    if (outDir) {
      fs.mkdirSync(outDir, { recursive: true });
      const firstOriginalSheet = page.locator('#sheets .sheet.paper').filter({
        has: page.locator('.psg'),
      }).filter({ hasText: 'Original' }).first();
      await firstOriginalSheet.screenshot({ path: path.join(outDir, 'cars-c-original-desktop.png') });
      await page.setViewportSize({ width: 390, height: 844 });
      await firstOriginalSheet.screenshot({ path: path.join(outDir, 'cars-c-original-mobile.png') });
    }

    console.log(`PASS CARS C original print QA: ${result.distinctSources.length} lessons, ${result.originalBlocks} rendered passage blocks`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
