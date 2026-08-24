#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const source = path.resolve(process.argv[2] || path.join(root, 'reading-world/private/vocabulary-workshop-purple-red.json'));
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765/reading-world/index.html';
const payload = JSON.parse(fs.readFileSync(source, 'utf8'));
const units = new Map();
for (const book of payload.books || []) {
  for (const unit of book.units || []) units.set(`${book.bookId}:${unit.lessonId}`, unit.words);
}

async function openPack(browser, bookId, viewport, screenshotName) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });
  await page.route('**/rest/v1/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    if (!requestUrl.pathname.endsWith('/lesson_content')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    }
    const requestedBook = (requestUrl.searchParams.get('book_id') || '').replace(/^eq\./, '');
    const lessonId = (requestUrl.searchParams.get('lesson_id') || '').replace(/^eq\./, '');
    const words = units.get(`${requestedBook}:${lessonId}`);
    const body = words ? [{ original_passage: [], original_questions: { kind: 'vocabulary-pack', words } }] : [];
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.addInitScript((selectedBook) => {
    const now = Date.now();
    localStorage.setItem('leteon:students', JSON.stringify([{ id: 'vocab-test', name: 'Vocabulary QA', createdAt: now, lastAt: now }]));
    localStorage.setItem('leteon:current', 'vocab-test');
    localStorage.setItem('leteon:student:vocab-test:cars:lesson1', JSON.stringify({
      currentBookId: selectedBook,
      lessons: {},
      points: 0,
      lang: 'en',
      avatar: { picked: true, equipped: {}, owned: [] },
    }));
    localStorage.setItem('gfield.pendingBook', selectedBook);
  }, bookId);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate((selectedBook) => {
    const book = (window.BOOK_CATALOG || []).find((item) => item.id === selectedBook);
    if (book) book.available = true;
  }, bookId);
  const boot = await page.evaluate(() => ({
    pendingBook: localStorage.getItem('gfield.pendingBook'),
    vocabularyLessons: Object.keys(window.LESSONS || {}).filter((id) => /^vw[pr]/.test(id)).length,
    vocabularyBooks: (window.BOOK_CATALOG || []).filter((book) => book.vocabularyOnly).map((book) => book.id),
  }));
  if (boot.pendingBook !== bookId || boot.vocabularyLessons !== 26 || !boot.vocabularyBooks.includes(bookId)) {
    throw new Error(`${bookId}: vocabulary boot manifest failed ${JSON.stringify(boot)}`);
  }
  await page.locator('[data-pick="vocab-test"]').click();
  const resumeText = await page.locator('[data-act="resume-lesson"]').innerText();
  if (!/Unit 1/.test(resumeText)) throw new Error(`${bookId}: wrong resume lesson: ${resumeText}`);
  await page.locator('[data-act="resume-lesson"]').click();
  await page.locator('[data-view="words"]').first().click();
  try {
    await page.waitForFunction(() => document.querySelectorAll('.word-card').length === 10, null, { timeout: 15000 });
  } catch (error) {
    const debugShot = path.join(root, 'reading-world/private/test-artifacts', `debug-${screenshotName}`);
    fs.mkdirSync(path.dirname(debugShot), { recursive: true });
    await page.screenshot({ path: debugShot, fullPage: true });
    const text = (await page.locator('body').innerText()).slice(0, 2500);
    throw new Error(`${bookId}: word cards did not load\nBrowser errors: ${browserErrors.join(' | ') || 'none'}\nPage text:\n${text}`);
  }

  const cards = await page.locator('.word-card').count();
  const navButtons = await page.locator('.nav-btn').count();
  if (cards !== 10) throw new Error(`${bookId}: expected 10 word cards, found ${cards}`);
  if (navButtons !== 2) throw new Error(`${bookId}: vocabulary navigation should have 2 buttons, found ${navButtons}`);

  await page.locator('[data-wordmode="game"]').first().click();
  await page.waitForFunction(() => document.querySelectorAll('.game-choice .choice').length === 4);
  const choices = await page.locator('.game-choice .choice').count();
  if (choices !== 4) throw new Error(`${bookId}: expected 4 game choices, found ${choices}`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) throw new Error(`${bookId}: page has horizontal overflow at ${viewport.width}px`);
  const shot = path.join(root, 'reading-world/private/test-artifacts', screenshotName);
  fs.mkdirSync(path.dirname(shot), { recursive: true });
  await page.screenshot({ path: shot, fullPage: true });
  await context.close();
  return { bookId, cards, navButtons, choices, viewport };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await openPack(browser, 'vocabulary-workshop-purple', { width: 1440, height: 1000 }, 'purple-desktop.png'));
    results.push(await openPack(browser, 'vocabulary-workshop-red', { width: 390, height: 844 }, 'red-mobile.png'));
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
