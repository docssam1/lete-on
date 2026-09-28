// Real inline media + retained lab, isolated browser only. Tablet and PC are primary.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT || 'playwright');
const base = process.env.SCIENCE_QA_URL || 'http://127.0.0.1:18765/science-lab/v2/';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname));
const output = process.env.SCIENCE_LIVE_OUTPUT || await mkdtemp(join(tmpdir(), 'science-live-qa-'));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.SCIENCE_CHROME ? { executablePath: process.env.SCIENCE_CHROME } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
await context.addInitScript(() => {
  const OriginalAudio = window.Audio;
  window.__qaNarration = [];
  window.Audio = function (...args) { const audio = new OriginalAudio(...args); window.__qaNarration.push(audio); return audio; };
  window.Audio.prototype = OriginalAudio.prototype;
});
const page = await context.newPage();
const errors = [], missing = [], checks = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) missing.push(`${r.status()} ${r.url()}`); });
const workspace = page.locator('.sl-lab-workspace');
const close = async () => { await page.getByRole('button', { name: '책으로 돌아가기', exact: true }).click(); await workspace.waitFor({ state: 'hidden' }); };
const open = async () => {
  await page.locator('.sl-reading-online').tap();
  await workspace.locator('canvas').waitFor();
  await page.waitForFunction(() => document.querySelector('.sl-lab-workspace').getBoundingClientRect().left === 0);
};
try {
  await page.goto(`${base}#/s41-u03b/reading`);
  await page.locator('.sl-reading.is-live').waitFor();
  const video = page.locator('.sl-reading-player video');
  assert.equal(await video.locator('source').count(), 0, 'no eager video download');
  await page.locator('[data-reading-play]').tap();
  await page.waitForFunction(() => { const v = document.querySelector('.sl-reading-player video'); return v.readyState >= 2 && !v.paused && v.currentTime > .1; }, null, { timeout: 30000 });
  assert.equal(context.pages().length, 1, 'video stays in the book, no popup navigation');
  const videoSrc = await video.evaluate(v => v.currentSrc);
  assert.ok(videoSrc.startsWith('https://upload.wikimedia.org/'));
  // Show the actual lava footage after the source's opening title, not just its logo.
  await video.evaluate(v => { v.currentTime = 8; });
  await page.waitForFunction(() => { const v = document.querySelector('.sl-reading-player video'); return !v.seeking && v.currentTime >= 8 && v.readyState >= 2; });
  await page.screenshot({ path: join(output, 'inline-video-pc.png') });
  await page.locator('.sl-reading-online').scrollIntoViewIfNeeded();
  const returnY = await page.evaluate(() => scrollY);
  await open();
  assert.equal(await video.evaluate(v => v.paused), true);
  const beforeTime = await video.evaluate(v => v.currentTime);
  assert.match(await page.evaluate(() => location.hash), /reading/);
  assert.equal(await page.locator('#app').evaluate(el => el.inert), true);
  const main = workspace.locator('[data-act=main]');
  await main.click(); // mount the foil; stage 1 must survive closing and reopening
  assert.match(await main.textContent(), /불 붙이기/);
  await main.evaluate(el => { el.dataset.qaIdentity = 'retained'; });
  await close();
  assert.equal(await page.locator('#app').evaluate(el => el.inert), false);
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - returnY) < 2);
  assert.equal(await page.locator(':focus').getAttribute('class'), 'sl-reading-online');
  assert.equal(await video.evaluate(v => v.paused), true);
  assert.equal(await video.evaluate(v => v.currentTime), beforeTime);
  await open();
  assert.equal(await main.getAttribute('data-qa-identity'), 'retained');
  assert.match(await main.textContent(), /불 붙이기/);
  await main.click();
  await main.focus(); await page.keyboard.down('Space');
  await main.dispatchEvent('pointerleave'); // pointer movement must not cancel a keyboard hold
  assert.equal(await main.evaluate(el => el.classList.contains('on')), true);
  await page.waitForFunction(() => +document.querySelector('.sl-lab-workspace [data-r=temp]').textContent > 22);
  await page.keyboard.press('Escape'); await page.keyboard.up('Space');
  await workspace.waitFor({ state: 'hidden' });
  const closedTemp = await workspace.locator('[data-r=temp]').textContent();
  await page.waitForTimeout(350);
  assert.equal(await workspace.locator('[data-r=temp]').textContent(), closedTemp, 'hidden experiment must stop');
  await open();
  assert.equal(await main.evaluate(el => el.classList.contains('on')), false, 'held input is released on close');
  for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(100);
    const geometry = await workspace.evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, overflow: el.scrollWidth > innerWidth + 1, canvas: el.querySelector('canvas').getBoundingClientRect().height }));
    assert.equal(geometry.width, width); assert.equal(geometry.height, height); assert.equal(geometry.overflow, false);
    assert.ok(geometry.canvas >= 280);
    if (width >= 900) {
      const controls = await main.boundingBox();
      assert.ok(controls.y >= 0 && controls.y + controls.height <= height, 'PC / landscape tablet controls stay in view');
    }
    await workspace.locator('.sl-lab-workspace-body').evaluate(el => el.scrollTo(0, 0));
    checks.push({ width, height, ...geometry });
    await page.screenshot({ path: join(output, `lab-${width}x${height}.png`) });
  }
  await close();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await open();
  assert.equal(await workspace.evaluate(el => getComputedStyle(el).transitionDuration), '0.28s');
  await close();
  await page.emulateMedia({ reducedMotion: 'reduce', media: 'print' });
  assert.equal(await video.isVisible(), false);
  assert.equal(await page.locator('.sl-reading-hero > img').isVisible(), true);
  assert.equal(await page.locator('.sl-reading-qr').isVisible(), true);
  await page.screenshot({ path: join(output, 'print-static-poster.png'), fullPage: true });
  await page.emulateMedia({ media: 'screen' });
  await open();
  await page.evaluate(() => { location.hash = '#/s41-u01/4'; });
  await workspace.waitFor({ state: 'detached' });
  await page.locator('.card.reading').waitFor();
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('[inert]')].length), 0);
  // The introduction book contains the same player and opens the same viewport lab.
  await page.goto(new URL('../intro/', base).href);
  await page.locator('.it-book .bk-magazine').waitFor({ state: 'attached' });
  await page.locator('.it-sound').click(); await page.locator('.cv-demo').click();
  for (let i = 0; i < 8; i++) {
    if (await page.locator('.bk-magazine').evaluate(el => el.closest('.face')?.getAttribute('aria-hidden') === 'false')) break;
    await page.locator('.it-arrow.next').click();
  }
  await page.locator('.it-sound').click(); // restore real existing narration before competing media starts
  await page.waitForFunction(() => window.__qaNarration.some(a => !a.paused && a.currentTime > .1));
  await page.locator('.it-hide').click();
  await page.locator('[data-reading-play]').click();
  await page.waitForFunction(() => !document.querySelector('.sl-reading-player video').paused);
  assert.equal(await page.evaluate(() => window.__qaNarration.every(a => a.paused)), true, 'inline video pauses detached narration audio too');
  await page.locator('.it-arrow.next').click();
  assert.equal(await page.locator('.sl-reading-player video').evaluate(v => v.paused), true);
  await page.locator('.it-arrow.prev').click();
  const bookPage = await page.locator('.it-count').textContent();
  await open(); await close();
  assert.equal(await page.locator('.it-count').textContent(), bookPage);
  assert.deepEqual(errors, []); assert.deepEqual(missing, []);
  await writeFile(join(output, 'living-book-qa.json'), JSON.stringify({ status: 'passed', videoSrc, checks, errors, missing }, null, 2));
  console.log(JSON.stringify({ status: 'passed', output, videoSrc, checks }, null, 2));
} catch (error) {
  await page.screenshot({ path: join(output, 'live-failure.png') });
  console.error(JSON.stringify({ errors, missing })); throw error;
} finally { await browser.close(); }
