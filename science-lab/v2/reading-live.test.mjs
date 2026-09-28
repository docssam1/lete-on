// Real media-element failure paths, with every request fulfilled locally in memory.
// No remote video, logged-in browser, or learner data; set SCIENCE_PLAYWRIGHT/SCIENCE_CHROME.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('reading video failure and teardown in an isolated browser', { skip: !process.env.SCIENCE_PLAYWRIGHT }, async (t) => {
  const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT);
  const browser = await chromium.launch({ headless: true, ...(process.env.SCIENCE_CHROME ? { executablePath: process.env.SCIENCE_CHROME } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const origin = 'http://127.0.0.1:18968', mediaOrigin = 'https://fixture-media.invalid';
  const files = new Map(await Promise.all(['reading-live.js', 'lab-workspace.js', 'media-session.js'].map(async (name) => [name, await readFile(new URL(name, import.meta.url), 'utf8')])));
  const requests = [], held = [], errors = [];
  let mode = 'all-fail';
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === mediaOrigin) {
      requests.push(url.pathname);
      if ((mode === 'hold-first' && url.pathname === '/one.webm') || (mode === 'hold-second' && url.pathname === '/two.mp4')) {
        await new Promise((resolve) => held.push(resolve));
      }
      return route.fulfill({ status: 404, headers: { 'cache-control': 'no-store' }, body: 'fixture unavailable' }).catch(() => {});
    }
    if (url.origin !== origin) return route.abort();
    const module = files.get(url.pathname.slice(1));
    if (module) return route.fulfill({ contentType: 'text/javascript', body: module });
    return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="ko"><body>
      <main id="root"><article class="sl-reading"><div class="sl-reading-player"
        data-src="${mediaOrigin}/one.webm" data-mp4="${mediaOrigin}/two.mp4" data-full="${mediaOrigin}/three.webm">
        <video controls playsinline preload="none" width="480" height="270"></video>
        <button type="button" data-reading-play>영상 재생</button>
        <p data-video-status hidden>영상을 불러오지 못했어요.</p>
      </div></article></main>
      <script type="module">
        import {wireReading} from '/reading-live.js';
        window.sourceFailures=[]; window.rejections=[];
        document.addEventListener('error',event=>{if(event.target.tagName==='SOURCE')sourceFailures.push(new URL(event.target.src).pathname);},true);
        addEventListener('unhandledrejection',event=>rejections.push(String(event.reason)));
        window.release=wireReading(document.querySelector('#root')); window.ready=true;
      </script></body></html>` });
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  const releaseHeld = () => { held.splice(0).forEach((resolve) => resolve()); };
  const fresh = async (nextMode) => {
    releaseHeld(); mode = nextMode; requests.length = 0;
    await page.goto(origin); await page.waitForFunction(() => window.ready);
  };
  const clickAndRequest = async (path) => Promise.all([
    page.waitForRequest((request) => request.url() === mediaOrigin + path),
    page.locator('[data-reading-play]').click(),
  ]);
  try {
    await t.test('sources and network remain lazy until an explicit play', async () => {
      await fresh('hold-first');
      assert.equal(await page.locator('video source').count(), 0);
      assert.deepEqual(requests, []);
      await clickAndRequest('/one.webm');
      assert.equal(await page.locator('video source').count(), 3);
      assert.deepEqual(requests, ['/one.webm']);
      await page.evaluate(() => release()); releaseHeld();
    });

    await t.test('all three failed sources display retry, and retry requests all three again', async () => {
      await fresh('all-fail');
      await clickAndRequest('/three.webm');
      await page.waitForFunction(() => !document.querySelector('[data-video-status]').hidden);
      assert.equal(await page.locator('[data-reading-play]').textContent(), '영상 다시 재생');
      assert.deepEqual(requests, ['/one.webm', '/two.mp4', '/three.webm']);
      assert.equal(await page.evaluate(() => document.querySelector('video').error), null, 'source-only failure must work without video.error');
      await clickAndRequest('/three.webm');
      await page.waitForFunction(() => sourceFailures.length === 6 && !document.querySelector('[data-video-status]').hidden);
      assert.deepEqual(requests, ['/one.webm', '/two.mp4', '/three.webm', '/one.webm', '/two.mp4', '/three.webm']);
      await page.evaluate(() => release());
    });

    await t.test('a failed first format leaves the second-format fallback intact', async () => {
      await fresh('hold-second');
      await clickAndRequest('/two.mp4');
      await page.waitForFunction(() => sourceFailures.includes('/one.webm'));
      assert.equal(await page.locator('[data-video-status]').isHidden(), true);
      assert.equal(await page.locator('video source').count(), 3);
      assert.deepEqual(requests, ['/one.webm', '/two.mp4']);
      await page.evaluate(() => release()); releaseHeld();
    });

    await t.test('disposing a pending play does not display its AbortError as a loading failure', async () => {
      await fresh('hold-first');
      await clickAndRequest('/one.webm');
      await page.evaluate(() => release()); releaseHeld();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-video-status]').isHidden(), true);
      assert.equal(await page.locator('video source').count(), 0);
      assert.equal(await page.locator('video').getAttribute('src'), null);
      assert.equal(await page.evaluate(() => document.querySelector('video').paused), true);
      assert.equal(await page.locator('.sl-reading.is-live').count(), 0);
      assert.deepEqual(await page.evaluate(() => rejections), []);
    });
    assert.deepEqual(errors, []);
  } finally { releaseHeld(); await context.close(); await browser.close(); }
});
