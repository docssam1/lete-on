import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { chromium } from 'file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const base = process.env.GFIELD_BASE_URL || 'http://127.0.0.1:8765';
const root = new URL('../../../', import.meta.url);
const out = fileURLToPath(new URL('./qa-artifacts/', import.meta.url));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage(), errors = [];
page.on('pageerror', error => errors.push(error.message));
let gardenLinks = 0, gameScreens = 0, worksheetScreens = 0, offlineSheets = 0, coldOfflineGames = 0, coldOfflineSheets = 0;
try {
  for (const lang of ['ko', 'en', 'zh', 'ja']) {
    await page.goto(`${base}/geometry/shape-garden/`);
    await page.evaluate(lang => localStorage.setItem('gfield-language', lang), lang);
    await page.reload(); await page.waitForSelector('#circleLevels a');
    assert.equal(await page.locator('#quadrilateralLevels a').count(), 4);
    const links = await page.locator('#circleLevels a').evaluateAll(a => a.map(x => x.href));
    assert.equal(links.length, 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (const link of links) {
      assert.equal(new URL(link).searchParams.get('lang'), lang);
      await page.goto(link); await page.waitForSelector('#board svg'); gameScreens++;
      const sheet = await page.locator('#worksheet').getAttribute('href');
      assert.ok(sheet.includes(`lang=${lang}`));
      await page.goto(new URL(sheet, page.url()).href);
      await page.waitForFunction(() => document.body.dataset.ready === 'true');
      assert.equal(await page.locator('#countInput').inputValue(), '20'); worksheetScreens++;
    }
    gardenLinks += links.length;
  }
  for (const name of ['angle-studio', 'unit-area', 'perimeter', 'quadrilateral']) {
    await page.goto(`${base}/geometry/games/${name}/`); await page.waitForSelector('#board svg'); gameScreens++;
    await page.goto(`${base}/geometry/worksheet/${name}/`);
    await page.waitForFunction(() => document.body.dataset.ready === 'true'); worksheetScreens++;
  }
  await page.goto(`${base}/geometry/shape-garden/`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const sw = await readFile(new URL('geometry/sw.js', root), 'utf8');
  const expectedCache = sw.match(/const CACHE = "([^"]+)"/)[1];
  assert.ok((await page.evaluate(() => caches.keys())).includes(expectedCache));
  await context.setOffline(true);
  for (const lang of ['ko', 'en', 'zh', 'ja']) for (const domain of ['center', 'parts', 'measure', 'draw']) {
    await page.goto(`${base}/geometry/worksheet/circle-studio/?domain=${domain}&lang=${lang}&count=20`);
    await page.waitForFunction(() => document.body.dataset.ready === 'true');
    assert.equal(await page.locator('.problem').count(), 20); offlineSheets++;
  }
  await context.setOffline(false);
  // A first offline visit must work after only the garden installed the worker.
  const fresh = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const cold = await fresh.newPage(); cold.on('pageerror', error => errors.push(error.message));
  await cold.goto(`${base}/geometry/shape-garden/`);
  await cold.evaluate(() => navigator.serviceWorker.ready);
  await cold.waitForFunction(() => !!navigator.serviceWorker.controller);
  await fresh.setOffline(true);
  for (const lang of ['ko', 'en', 'zh', 'ja']) for (const domain of ['center', 'parts', 'measure', 'draw']) {
    await cold.goto(`${base}/geometry/games/circle-studio/?domain=${domain}&lang=${lang}`);
    await cold.waitForSelector('#board svg'); coldOfflineGames++;
    await cold.goto(`${base}/geometry/worksheet/circle-studio/?domain=${domain}&lang=${lang}&count=20`);
    await cold.waitForFunction(() => document.body.dataset.ready === 'true');
    assert.equal(await cold.locator('.problem').count(), 20); coldOfflineSheets++;
  }
  await fresh.close();
  assert.deepEqual(errors, []);
  const files = ['geometry/sw.js', 'geometry/shape-garden/index.html', 'geometry/shape-garden/circle-course.js'];
  for (const [dir, names] of [['games', ['index.html', 'app.js', 'core.js', 'render.js', 'i18n.js', 'styles.css']], ['worksheet', ['index.html', 'app.js', 'workbook-core.js', 'i18n.js', 'styles.css']]]) files.push(...names.map(name => `geometry/${dir}/circle-studio/${name}`));
  const digest = data => createHash('sha256').update(data.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');
  for (const file of files) {
    const response = await context.request.get(`${base}/${file}?verify=${Date.now()}`);
    assert.equal(response.status(), 200, file);
    assert.equal(digest(await response.body()), digest(await readFile(new URL(file, root))), file);
  }
  const report = { passed: true, base, gardenLinks, gameScreens, worksheetScreens, offlineSheets, coldOfflineGames, coldOfflineSheets, runtimeFiles: files.length, errors };
  await mkdir(out, { recursive: true }); await writeFile(`${out}/integration-${new URL(base).hostname}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
