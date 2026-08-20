#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const sourcePath = path.resolve(process.argv[2] || path.join(root, 'reading-world/private/bricks-250-levels-2-3.normalized.json'));
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const baseUrl = process.argv[4] || process.env.BASE_URL || 'http://127.0.0.1:8765/reading-world/index.html';
const level2Audio = path.join(root, 'reading-world/private/bricks-250-level-2-audio');
const level3Audio = process.argv[3] || process.env.BRICKS_LEVEL3_AUDIO_DIR;

const originals = new Map();
for (const level of [2, 3]) {
  for (const unit of source.levels[String(level)]) {
    const lessonId = `brl${level}-${String(unit.unit).padStart(2, '0')}`;
    originals.set(`bricks-reading-250-${level}:${lessonId}`, unit.original.paragraphs);
  }
}

async function verifyBook(browser, level, viewport, screenshotName) {
  const bookId = `bricks-reading-250-${level}`;
  const lessonId = `brl${level}-01`;
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const browserErrors = [];
  let audioRequests = 0;
  page.on('pageerror', error => browserErrors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400 && !response.url().endsWith('/data/lesson1.original.js')) {
      browserErrors.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) browserErrors.push(message.text());
  });
  await page.route('**/rest/v1/**', async route => {
    const requestUrl = new URL(route.request().url());
    if (!requestUrl.pathname.endsWith('/lesson_content')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
    const requestedBook = (requestUrl.searchParams.get('book_id') || '').replace(/^eq\./, '');
    const requestedLesson = (requestUrl.searchParams.get('lesson_id') || '').replace(/^eq\./, '');
    const passage = originals.get(`${requestedBook}:${requestedLesson}`);
    const body = passage ? [{ original_passage: passage, original_questions: [] }] : [];
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.route('**/storage/v1/object/public/audio/bricks-reading-250-*/**-original.mp3', async route => {
    audioRequests += 1;
    const match = route.request().url().match(/brl([23])-(\d{2})-original\.mp3$/);
    if (!match) return route.abort();
    const audioLevel = Number(match[1]);
    const unit = Number(match[2]);
    const dir = audioLevel === 2 ? level2Audio : level3Audio;
    const filePath = dir && path.join(dir, `Track${String(unit + 1).padStart(2, '0')}.mp3`);
    if (!filePath || !fs.existsSync(filePath)) return route.abort();
    return route.fulfill({ status: 200, contentType: 'audio/mpeg', path: filePath });
  });
  await page.addInitScript(selectedBook => {
    const now = Date.now();
    localStorage.setItem('leteon:students', JSON.stringify([{ id: 'bricks-test', name: 'Bricks QA', createdAt: now, lastAt: now }]));
    localStorage.setItem('leteon:current', 'bricks-test');
    localStorage.setItem('leteon:student:bricks-test:cars:lesson1', JSON.stringify({
      currentBookId: selectedBook,
      lessons: {},
      points: 0,
      lang: 'en',
      avatar: { picked: true, equipped: {}, owned: [] },
    }));
    localStorage.setItem('gfield.pendingBook', selectedBook);
  }, bookId);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const boot = await page.evaluate(selectedBook => {
    const book = (window.BOOK_CATALOG || []).find(item => item.id === selectedBook);
    if (book) book.available = true;
    return {
      bookFound: Boolean(book),
      lessonCount: Object.values(window.LESSONS || {}).filter(item => item.bookId === selectedBook).length,
    };
  }, bookId);
  if (!boot.bookFound || boot.lessonCount !== 20) throw new Error(`${bookId}: bad boot ${JSON.stringify(boot)}`);

  await page.locator('[data-pick="bricks-test"]').click();
  await page.locator('[data-act="resume-lesson"]').click();
  await page.locator('[data-view="words"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('.word-card').length === 10);
  await page.locator('[data-view="originalRead"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('.sentence-line').length >= 8);
  const originalText = await page.locator('.reading-card').innerText();
  if (!originalText.includes(source.levels[String(level)][0].title)) throw new Error(`${bookId}: original title missing`);
  await page.locator('[data-act="listen-all"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('.sentence-line.reading-now').length > 0, null, { timeout: 10000 });
  if (audioRequests < 1) throw new Error(`${bookId}: publisher audio was not requested`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) throw new Error(`${bookId}: horizontal overflow at ${viewport.width}px`);
  const shot = path.join(root, 'reading-world/private/test-artifacts', screenshotName);
  fs.mkdirSync(path.dirname(shot), { recursive: true });
  await page.screenshot({ path: shot, fullPage: true });
  await context.close();
  return { bookId, lessonId, words: 10, audioRequests, viewport, browserErrors };
}

(async () => {
  if (!level3Audio) throw new Error('BRICKS_LEVEL3_AUDIO_DIR is required');
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [
      await verifyBook(browser, 2, { width: 1440, height: 1000 }, 'bricks-250-level-2-desktop.png'),
      await verifyBook(browser, 3, { width: 390, height: 844 }, 'bricks-250-level-3-mobile.png'),
    ];
    const errors = results.flatMap(result => result.browserErrors);
    if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
