// Isolated local-browser QA. Does not use the user's browser profile or learner data.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT || 'playwright');
const base = process.env.SCIENCE_QA_URL || 'http://127.0.0.1:18765/science-lab/v2/';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const output = process.env.SCIENCE_READING_OUTPUT || await mkdtemp(join(tmpdir(), 'science-reading-qa-'));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.SCIENCE_CHROME ? { executablePath: process.env.SCIENCE_CHROME } : {}) });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [], missing = [], metrics = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) missing.push(`${r.status()} ${r.url()}`); });
const go = async (route, selector = '.sl-reading') => {
  await page.goto(`${base}#/${route}`);
  await page.locator(selector).first().waitFor();
  await page.evaluate(() => document.fonts.ready);
};
const photoReady = () => page.locator('.sl-reading-hero > img').evaluate(async img => { await img.decode(); return img.naturalWidth > 0; });
const noOverflow = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), label);
const magazineFits = async label => {
  const m = await page.locator('.bk-magazine').evaluate(pg => {
    const main = pg.querySelector('.bk-main'), article = pg.querySelector('.sl-reading'), foot = pg.querySelector('.bk-foot');
    return { articleBottom: article.getBoundingClientRect().bottom, footerTop: foot.getBoundingClientRect().top,
      mainClient: main.clientHeight, mainScroll: main.scrollHeight, columns: getComputedStyle(article.querySelector('.sl-reading-columns')).gridTemplateColumns };
  });
  metrics.push({ label, ...m });
  assert.ok(m.articleBottom <= m.footerTop + 1, `${label}: article overlaps footer ${JSON.stringify(m)}`);
  assert.ok(m.mainScroll <= m.mainClient + 1, `${label}: article is clipped ${JSON.stringify(m)}`);
};
try {
  await go('s41-u03b/4');
  assert.equal(await page.locator('.sl-reading-section').count(), 4);
  assert.equal(await page.locator('.item').count(), 3);
  assert.equal(await page.locator('.sl-reading-teacher').count(), 0);
  assert.ok(await photoReady());
  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  await page.locator('.reading-open').click();
  await page.locator('.reading-tools').waitFor();
  await page.locator('.sl-reading').screenshot({ path: join(output, 'reading-desktop.png') });
  await noOverflow('desktop reading overflow');
  await page.evaluate(() => { window.print = () => { window.__printRequested = true; }; });
  await page.getByRole('button', { name: 'A4 인쇄', exact: true }).click();
  assert.ok(await page.evaluate(() => window.__printRequested));
  await page.getByRole('link', { name: '교사용 보기', exact: true }).click();
  await page.locator('.sl-reading-teacher').waitFor();
  await page.getByRole('link', { name: '학생용 보기', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.sl-reading-teacher'));
  assert.equal(await page.evaluate(() => JSON.stringify(localStorage)), storage, 'reading must not change learner records');
  const video = page.locator('.sl-reading-actions a').first();
  assert.match(await video.getAttribute('href'), /^https:\/\/commons.wikimedia.org\//);
  assert.equal(await video.getAttribute('target'), '_blank');
  assert.equal(await page.locator('.sl-reading-printlink').isVisible(), false);
  await page.locator('.sl-reading-online').click();
  await page.locator('.sl-lab-workspace canvas').first().waitFor();
  assert.match(await page.evaluate(() => location.hash), /\/reading/);
  await page.getByRole('button', { name: '책으로 돌아가기', exact: true }).click();
  await page.locator('.sl-lab-workspace').waitFor({ state: 'hidden' });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await go('s41-u03b/reading');
    assert.ok(await photoReady());
    await noOverflow(`reading ${width} overflow`);
    assert.equal(await page.locator('.sl-reading-columns').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
    assert.ok(await page.locator('.sl-reading-actions a').first().evaluate(el => el.getBoundingClientRect().height >= 44));
    await page.screenshot({ path: join(output, `reading-${width}.png`), fullPage: true });
    await go('s41-u03b/4');
    await noOverflow(`lesson ${width} overflow`);
    await go('s41-u03b/lab-book/student', '.bk-magazine');
    await noOverflow(`book ${width} overflow`);
    await page.locator('.bk-magazine').screenshot({ path: join(output, `book-${width}.png`) });
  }
  await page.setViewportSize({ width: 1280, height: 1500 });
  for (const mode of ['student', 'teacher']) {
    await go(`s41-u03b/lab-book/${mode}`, '.bk-magazine');
    assert.equal(await page.locator('.bk-page').count(), 12);
    assert.equal(await page.locator('.bk-magazine .bk-pn').textContent(), '7');
    assert.equal(await page.locator('.sl-reading-teacher').count(), mode === 'teacher' ? 1 : 0);
    assert.ok(await photoReady());
    await magazineFits(`book-${mode}`);
    await page.locator('.bk-magazine').screenshot({ path: join(output, `book-${mode}.png`) });
    await page.emulateMedia({ media: 'print' });
    await magazineFits(`print-book-${mode}`);
    await page.emulateMedia({ media: 'screen' });
  }
  // Small-viewport advertising books retain a fixed A4/two-column layout.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.bk').evaluate(el => el.classList.add('a4'));
  assert.equal(await page.locator('.bk-magazine .sl-reading-columns').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2);
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const mode of ['student', 'teacher']) {
    await go(`s41-u03b/reading/${mode}`);
    await photoReady();
    await page.emulateMedia({ media: 'print' });
    const height = await page.locator('.reading-page').evaluate(el => el.getBoundingClientRect().height);
    metrics.push({ label: `standalone-print-${mode}`, height });
    assert.ok(height <= 1122.52, `A4 one-page height exceeded: ${height}`);
    assert.equal(await page.locator('.reading-tools').evaluate(el => getComputedStyle(el).display), 'none');
    assert.equal(await page.locator('.sl-reading-online').isVisible(), false);
    assert.equal(await page.locator('.sl-reading-printlink').getAttribute('href'), 'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u03b/2/lab');
    assert.equal(await page.locator('.sl-reading-printlink').isVisible(), true);
    if (mode === 'student' && process.argv.includes('--pdf')) {
      const pdfDir = join(output, 'output', 'pdf');
      await mkdir(pdfDir, { recursive: true });
      await page.pdf({ path: join(pdfDir, 'docssam-volcano-reading.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: true });
    }
    await page.screenshot({ path: join(output, `print-${mode}.png`), fullPage: true });
    await page.emulateMedia({ media: 'screen' });
  }
  await go('s41-u01/4', '.card.reading');
  assert.equal(await page.locator('.sl-reading').count(), 0);
  // Actual introduction flipbook, including its fixed-A4 layout on phones.
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(new URL('../intro/', base).href);
    await page.locator('.it-book .bk-magazine').waitFor({ state: 'attached' });
    await page.locator('.it-sound').click();
    await page.locator(width <= 760 ? '.it-demo' : '.cv-demo').click();
    for (let turn = 0; turn < 8; turn++) {
      if (await page.locator('.bk-magazine').evaluate(el => el.closest('.face')?.getAttribute('aria-hidden') === 'false')) break;
      await page.locator('.it-arrow.next').click();
    }
    assert.equal(await page.locator('.bk-magazine').evaluate(el => el.closest('.face')?.getAttribute('aria-hidden')), 'false');
    assert.equal(await page.locator('.bk-magazine .sl-reading-columns').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2);
    await photoReady();
    await magazineFits(`intro-${width}`);
    await page.screenshot({ path: join(output, `intro-${width}.png`) });
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  await writeFile(join(output, 'qa-results.json'), JSON.stringify({ status: 'passed', metrics, errors, missing }, null, 2));
  console.log(JSON.stringify({ status: 'passed', output: resolve(output), metrics }, null, 2));
} catch (error) {
  await page.screenshot({ path: join(output, 'failure.png') });
  throw error;
} finally { await browser.close(); }
