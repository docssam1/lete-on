import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const base = process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const root = new URL('../../../', import.meta.url);
const output = fileURLToPath(new URL('./qa-artifacts/', import.meta.url));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let games = 0, worksheets = 0, offlineSheets = 0, gardenLinks = 0;
try {
  for (const lang of ['ko', 'en', 'zh', 'ja']) {
    await page.goto(`${base}/geometry/shape-garden/`);
    await page.evaluate(lang => localStorage.setItem('gfield-language', lang), lang);
    await page.reload();
    await page.waitForSelector('#quadrilateralLevels a');
    const links = await page.locator('#quadrilateralLevels a').evaluateAll(items => items.map(item => item.href));
    assert.equal(links.length, 4);
    for (const link of links) {
      assert.equal(new URL(link).searchParams.get('lang'), lang);
      await page.goto(link); await page.waitForSelector('#board svg'); games++;
      const sheet = await page.locator('#worksheet').getAttribute('href');
      assert.ok(sheet.includes(`lang=${lang}`));
      await page.goto(new URL(sheet, page.url()).href);
      await page.waitForFunction(() => document.body.dataset.ready === 'true');
      assert.equal(await page.locator('#countInput').inputValue(), '20'); worksheets++;
    }
    gardenLinks += links.length;
  }
  for (const module of ['angle-studio', 'unit-area', 'perimeter']) {
    await page.goto(`${base}/geometry/games/${module}/`);
    await page.waitForSelector('#board svg'); games++;
    await page.goto(`${base}/geometry/worksheet/${module}/`);
    await page.waitForFunction(() => document.body.dataset.ready === 'true'); worksheets++;
  }
  await page.goto(`${base}/geometry/shape-garden/`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const cache = await page.evaluate(() => caches.keys());
  assert.ok(cache.includes('gfield-geo-v35'), JSON.stringify(cache));
  await context.setOffline(true);
  for (const lang of ['ko', 'en', 'zh', 'ja']) for (const domain of ['parallel', 'right', 'classify', 'build']) {
    await page.goto(`${base}/geometry/worksheet/quadrilateral/?lang=${lang}&domain=${domain}&count=20`);
    await page.waitForFunction(() => document.body.dataset.ready === 'true');
    assert.equal(await page.locator('.problem').count(), 20); offlineSheets++;
  }
  await context.setOffline(false);
  assert.deepEqual(errors, []);
  const files = ['geometry/sw.js', 'geometry/shape-garden/index.html', 'geometry/shape-garden/quadrilateral-course.js'];
  for (const [dir, names] of [['games', ['index.html', 'app.js', 'core.js', 'render.js', 'i18n.js', 'styles.css']], ['worksheet', ['index.html', 'app.js', 'workbook-core.js', 'i18n.js', 'styles.css']]]) {
    files.push(...names.map(name => `geometry/${dir}/quadrilateral/${name}`));
  }
  for (const file of files) {
    const expected = await readFile(new URL(file, root));
    const response = await context.request.get(`${base}/${file}?release-check=${Date.now()}`);
    assert.equal(response.status(), 200, file);
    const digest = data => createHash('sha256').update(data).digest('hex');
    assert.equal(digest(await response.body()), digest(expected), `Runtime mismatch: ${file}`);
  }
  const result = { passed: true, base, gardenLinks, games, worksheets, offlineSheets, runtimeFiles: files.length, errors };
  await mkdir(output, { recursive: true });
  await writeFile(`${output}/integration-${new URL(base).hostname}.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally { await browser.close(); }
