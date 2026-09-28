// Isolated browser lifecycle checks; set SCIENCE_PLAYWRIGHT and SCIENCE_CHROME.
// All browser requests are fulfilled locally in memory or blocked. No user profile or learner data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('lab workspace lifecycle in an isolated browser', { skip: !process.env.SCIENCE_PLAYWRIGHT }, async (t) => {
  const { chromium } = await import(process.env.SCIENCE_PLAYWRIGHT);
  const browser = await chromium.launch({ headless: true, ...(process.env.SCIENCE_CHROME ? { executablePath: process.env.SCIENCE_CHROME } : {}) });
  const js = await readFile(new URL('./lab-workspace.js', import.meta.url), 'utf8');
  const css = await readFile(new URL('./lab-workspace.css', import.meta.url), 'utf8');
  const origin = 'http://127.0.0.1:18967';
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname === '/lab-workspace.js') return route.fulfill({ contentType: 'text/javascript', body: js });
    if (url.pathname === '/lab-workspace.css') return route.fulfill({ contentType: 'text/css', body: css });
    return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html lang="ko"><head><link rel="stylesheet" href="/lab-workspace.css"></head><body style="margin:0"><div id="already-inert" inert="keep-me">기존 잠금</div><main id="book"><button id="trigger">실험 열기</button><div style="height:2400px">책 본문</div></main><script type="module">import {createLabWorkspace} from '/lab-workspace.js'; window.createLabWorkspace=createLabWorkspace;</script></body></html>` });
  });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const fresh = async () => { await page.goto(origin); await page.waitForFunction(() => !!window.createLabWorkspace); };
  try {
    await t.test('lazy mount, retained DOM, pause, focus trap, exact inert/overflow/scroll restoration', async () => {
      await fresh();
      await page.evaluate(() => {
        document.documentElement.style.setProperty('overflow-y', 'scroll', 'important');
        document.body.style.setProperty('overflow-x', 'clip');
        window.scrollTo(0, 410);
        window.calls = { mount: 0, pause: 0, dispose: 0, open: 0 };
        document.addEventListener('science:lab-open', () => calls.open++);
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount: (body, { isActive }) => {
          calls.mount++; window.active = isActive;
          body.innerHTML = '<label>관찰 <input value="처음"></label><button id="lab-last">기록</button>';
          return { pause() { calls.pause++; }, dispose() { calls.dispose++; } };
        } });
        window.stylesBefore = [document.documentElement, document.body].map((element) => ['overflow', 'overflow-x', 'overflow-y'].map((name) => [element.style.getPropertyValue(name), element.style.getPropertyPriority(name)]));
        window.scrollBefore = scrollY;
      });
      assert.equal(await page.evaluate(() => calls.mount), 0);
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      await page.waitForFunction(() => calls.mount === 1 && !!window.active);
      assert.equal(await page.evaluate(() => active()), true);
      assert.equal(await page.locator('#book').getAttribute('inert'), '');
      await page.locator('.sl-lab-workspace input').fill('내 실험 기록');
      await page.locator('[data-lab-fullscreen]').focus();
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'lab-last');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-lab-fullscreen')), true);
      await page.keyboard.press('Escape');
      const restored = await page.evaluate(() => ({
        active: active(), mount: calls.mount, pause: calls.pause,
        bookInert: document.querySelector('#book').getAttribute('inert'), previousInert: document.querySelector('#already-inert').getAttribute('inert'),
        styles: [document.documentElement, document.body].map((element) => ['overflow', 'overflow-x', 'overflow-y'].map((name) => [element.style.getPropertyValue(name), element.style.getPropertyPriority(name)])),
        expectedStyles: stylesBefore, scroll: scrollY, expectedScroll: scrollBefore, focus: document.activeElement.id,
      }));
      assert.equal(restored.active, false); assert.ok(restored.pause >= 1);
      assert.equal(restored.bookInert, null); assert.equal(restored.previousInert, 'keep-me');
      assert.deepEqual(restored.styles, restored.expectedStyles); assert.equal(restored.scroll, restored.expectedScroll); assert.equal(restored.focus, 'trigger');
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      assert.equal(await page.locator('.sl-lab-workspace input').inputValue(), '내 실험 기록');
      assert.equal(await page.evaluate(() => calls.mount), 1);
      await page.evaluate(() => ws.dispose());
      assert.equal(await page.locator('.sl-lab-workspace').count(), 0);
      assert.equal(await page.evaluate(() => calls.dispose), 1);
    });

    await t.test('closing before animation prevents mount; late async mount pauses and later disposes once', async () => {
      await fresh();
      await page.evaluate(() => {
        window.calls = { mount: 0, pause: 0, dispose: 0 };
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount: (body) => {
          calls.mount++; body.innerHTML = '<input value="보존">';
          return new Promise((resolve) => { window.finishMount = () => resolve({ pause() { calls.pause++; }, dispose() { calls.dispose++; } }); });
        } });
        ws.open(document.querySelector('#trigger')); ws.close();
      });
      await page.waitForTimeout(60);
      assert.equal(await page.evaluate(() => calls.mount), 0);
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      await page.waitForFunction(() => !!window.finishMount);
      await page.evaluate(() => { ws.close(); finishMount(); });
      await page.waitForFunction(() => calls.pause === 1);
      assert.equal(await page.locator('.sl-lab-workspace input').inputValue(), '보존');
      await page.evaluate(() => { ws.open(document.querySelector('#trigger')); ws.dispose(); ws.dispose(); });
      assert.equal(await page.evaluate(() => calls.mount), 1);
      assert.equal(await page.evaluate(() => calls.dispose), 1);
    });

    await t.test('failed preparation retries on reentry, including a rejection after close, then retains success', async () => {
      await fresh();
      await page.evaluate(() => {
        window.calls = { mount: 0, dispose: 0 };
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount: (body) => {
          calls.mount++;
          if (calls.mount === 1) throw new Error('initial preparation failed');
          if (calls.mount === 2) return new Promise((resolve, reject) => { window.failMount = reject; });
          body.innerHTML = '<input value="다시 열린 실험">';
          return { dispose() { calls.dispose++; } };
        } });
        ws.open(document.querySelector('#trigger'));
      });
      await page.waitForFunction(() => document.querySelector('.sl-lab-workspace-status').textContent.includes('불러오지 못했어요'));
      assert.equal(await page.locator('.sl-lab-workspace-body').getAttribute('aria-busy'), null);
      await page.locator('[data-lab-close]').click();
      assert.equal(await page.locator('#book').getAttribute('inert'), null);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'trigger');
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      await page.waitForFunction(() => calls.mount === 2 && !!window.failMount);
      await page.evaluate(() => { ws.close(); failMount(new Error('late preparation failed')); });
      await page.waitForFunction(() => !document.querySelector('.sl-lab-workspace-body').hasAttribute('aria-busy'));
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      await page.waitForFunction(() => calls.mount === 3 && !!document.querySelector('.sl-lab-workspace input'));
      assert.equal(await page.locator('.sl-lab-workspace-status').textContent(), '');
      await page.locator('.sl-lab-workspace input').fill('재시도 후 내 기록');
      await page.evaluate(() => { ws.close(); ws.open(document.querySelector('#trigger')); });
      await page.waitForTimeout(40);
      assert.equal(await page.evaluate(() => calls.mount), 3);
      assert.equal(await page.locator('.sl-lab-workspace input').inputValue(), '재시도 후 내 기록');
      await page.evaluate(() => ws.dispose());
      assert.equal(await page.evaluate(() => calls.dispose), 1);
    });

    await t.test('moving the owner is safe; removing it disposes even when mount is pending', async () => {
      await fresh();
      await page.evaluate(() => {
        window.disposals = 0;
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount: () => new Promise((resolve) => { window.finishMount = () => resolve({ dispose() { disposals++; } }); }) });
        ws.open(document.querySelector('#trigger'));
      });
      await page.waitForFunction(() => !!window.finishMount);
      await page.evaluate(() => { const root = document.querySelector('#book'); root.remove(); document.body.appendChild(root); });
      await page.waitForTimeout(20);
      assert.equal(await page.locator('.sl-lab-workspace').count(), 1);
      await page.evaluate(() => document.querySelector('#book').remove());
      await page.waitForFunction(() => !document.querySelector('.sl-lab-workspace'));
      await page.evaluate(() => finishMount());
      await page.waitForFunction(() => disposals === 1);
      assert.equal(await page.locator('#already-inert').getAttribute('inert'), 'keep-me');
    });

    await t.test('only one workspace stays active and hidden-tab/print pauses do not destroy state', async () => {
      await fresh();
      await page.evaluate(() => {
        window.calls = { a: 0, b: 0 };
        const root = document.querySelector('#book');
        window.a = createLabWorkspace(root, { title: '실험 A', mount: () => ({ pause() { calls.a++; } }) });
        window.b = createLabWorkspace(root, { title: '실험 B', mount: () => ({ pause() { calls.b++; } }) });
        a.open(document.querySelector('#trigger'));
      });
      await page.waitForTimeout(40);
      await page.evaluate(() => b.open(document.querySelector('#trigger')));
      await page.waitForTimeout(40);
      assert.equal(await page.locator('.sl-lab-workspace:not([hidden])').count(), 1);
      assert.ok(await page.evaluate(() => calls.a >= 1));
      await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
      assert.ok(await page.evaluate(() => calls.b >= 1));
      await page.evaluate(() => { window.dispatchEvent(new Event('beforeprint')); a.dispose(); b.dispose(); });
      assert.equal(await page.locator('.sl-lab-workspace').count(), 0);
      assert.equal(await page.locator('#book').getAttribute('inert'), null);
    });

    await t.test('fullscreen failure retains viewport; a late fullscreen result is exited after close', async () => {
      await fresh();
      await page.evaluate(() => {
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount() {} });
        ws.open(document.querySelector('#trigger'));
        document.querySelector('.sl-lab-workspace').requestFullscreen = () => Promise.reject(new Error('blocked'));
      });
      await page.locator('[data-lab-fullscreen]').click();
      await page.waitForFunction(() => document.querySelector('.sl-lab-workspace-status').textContent.includes('전체 화면을 열지 못했어요'));
      assert.equal(await page.locator('.sl-lab-workspace').isVisible(), true);
      await page.evaluate(() => {
        window.fakeFullscreen = null; window.exits = 0;
        Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => fakeFullscreen });
        document.exitFullscreen = async () => { exits++; fakeFullscreen = null; document.dispatchEvent(new Event('fullscreenchange')); };
        const workspace = document.querySelector('.sl-lab-workspace');
        workspace.requestFullscreen = () => new Promise((resolve) => { window.finishFullscreen = () => { fakeFullscreen = workspace; document.dispatchEvent(new Event('fullscreenchange')); resolve(); }; });
      });
      await page.locator('[data-lab-fullscreen]').click();
      await page.evaluate(() => { ws.close(); finishFullscreen(); });
      await page.waitForFunction(() => exits === 1 && document.fullscreenElement === null);
      assert.equal(await page.locator('.sl-lab-workspace').isVisible(), false);
      await page.evaluate(() => ws.dispose());
    });

    await t.test('native fullscreen is opt-in and an existing user fullscreen is never exited', async () => {
      await fresh();
      await page.evaluate(() => {
        window.ws = createLabWorkspace(document.querySelector('#book'), { mount() {} });
        ws.open(document.querySelector('#trigger'));
      });
      assert.equal(await page.evaluate(() => document.fullscreenElement), null);
      await page.locator('[data-lab-fullscreen]').click();
      await page.waitForFunction(() => document.fullscreenElement?.classList.contains('sl-lab-workspace'));
      await page.locator('[data-lab-close]').click();
      await page.waitForFunction(() => !document.fullscreenElement);
      await page.evaluate(() => { document.querySelector('#trigger').onclick = () => document.querySelector('#book').requestFullscreen(); });
      await page.locator('#trigger').click();
      await page.waitForFunction(() => document.fullscreenElement?.id === 'book');
      await page.evaluate(() => ws.open(document.querySelector('#trigger')));
      assert.equal(await page.evaluate(() => document.querySelector('.sl-lab-workspace').parentElement.id), 'book');
      await page.locator('[data-lab-fullscreen]').click();
      assert.equal(await page.evaluate(() => document.fullscreenElement.id), 'book');
      await page.locator('[data-lab-close]').click();
      assert.equal(await page.evaluate(() => document.fullscreenElement.id), 'book');
      await page.evaluate(async () => { ws.dispose(); await document.exitFullscreen(); });
    });
    assert.deepEqual(errors, []);
  } finally { await context.close(); await browser.close(); }
});
