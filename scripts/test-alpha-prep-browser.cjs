#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'tmp', 'alpha-prep-qa');
const python = process.env.PYTHON || 'python';
const port = Number(process.env.PORT || 8000);
fs.mkdirSync(outDir, { recursive: true });

function mockScores() {
  return {
    comprehension: 3, evidence: 3, organization: 3, opinion: 3,
    vocabulary: 3, interaction: 3, delivery: 3,
  };
}

function mockResponse(payload) {
  if (payload.mode === 'report') {
    return {
      summary: 'You remembered the central ideas, answered follow-up questions, and responded fairly to a peer. Your strongest next move is to name more exact passage evidence while using target vocabulary naturally.',
      priorities: [
        { title: 'Exact evidence', action: 'Attach one precise passage fact to each claim.', drill: 'Claim, detail, meaning in thirty seconds.' },
        { title: 'Listen and add', action: 'Restate the peer’s idea before adding a different point.', drill: 'Mina thinks… I would add…' },
        { title: 'Vocabulary transfer', action: 'Use target words in situations beyond the passage.', drill: 'Meaning, clue, new sentence.' },
      ],
      roadmap: Array.from({ length: 7 }, (_, index) => ({
        title: `Focus ${index + 1}`,
        task: 'Read briefly, cover the text, and give one complete evidence-based response.',
      })),
      turnFeedback: payload.turns.map((turn, index) => ({
        turnIndex: index,
        strength: 'The response gives a relevant idea and stays connected to the question.',
        focus: 'Use one exact passage detail to make the explanation more convincing.',
        skill: index % 2 ? 'Text evidence' : 'Response structure',
        improvedAnswer: turn.answer.charAt(0).toUpperCase() + turn.answer.slice(1).replace(/[.!?]?$/, '.'),
        languageNote: 'Keep the main claim first, then connect the reason with because.',
      })),
    };
  }
  return {
    followUp: 'Which result in the passage best proves the reason you gave?',
    feedback: {
      strength: 'You gave a direct answer and a relevant reason.',
      focus: 'Name one exact passage detail before your conclusion.',
      skill: 'Text evidence',
      improvedAnswer: payload.answer.charAt(0).toUpperCase() + payload.answer.slice(1).replace(/[.!?]?$/, '.'),
      languageNote: 'Keep the claim first and connect the detail with because.',
      scores: mockScores(),
    },
  };
}

async function waitForServer(url, timeout = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (_) { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`server did not start: ${url}`);
}

async function submit(page, answer) {
  const field = page.locator('#answer-draft');
  await field.fill(answer);
  await page.locator('[data-action="submit-answer"]').click();
  await page.waitForFunction(() => !document.querySelector('[data-action="submit-answer"]')?.disabled, null, { timeout: 9000 }).catch(() => {});
  await page.waitForTimeout(120);
}

async function runPassageInterview(page, passageIndex) {
  const submitStartedAt = Date.now();
  await submit(page, 'The passage is mainly about solving a problem carefully. It explains the problem and shows a useful solution with important details.');
  if (passageIndex === 0) {
    assert.ok(Date.now() - submitStartedAt < 1500, 'typed submission must advance without waiting for the delayed coaching server');
  }
  await assertVisibleText(page, 'FOLLOW-UP 1 OF 2');
  if (passageIndex === 0) await assertVisibleText(page, 'Which exact detail from the passage best supports what you just said?');
  await submit(page, 'The exact detail makes the idea convincing because it shows what changed and why the result mattered.');
  await assertVisibleText(page, 'FOLLOW-UP 2 OF 2');
  await submit(page, 'That detail matters most because it connects the problem to the solution.');
  await submit(page, 'One important detail is that the characters or people tested a solution before deciding what to do.');
  await page.locator('[data-action="hear-peer"]').click();
  await assertVisibleText(page, 'Keep the idea in mind.');
  await page.locator('[data-action="after-peer"]').click();
  await assertVisibleText(page, 'SURPRISE LISTENING QUESTION');
  const ambushPrompt = await page.locator('.question-block h1').textContent();
  assert.match(ambushPrompt, /said, “.+” What do you think about that specific idea\?/);
  assert.doesNotMatch(ambushPrompt, /where you agree or disagree/i, 'surprise question must name the peer content, not ask only for agreement');
  if (passageIndex === 0) assert.match(ambushPrompt, /Communities should support seed banks before a disaster happens/);
  if (passageIndex === 1) assert.match(ambushPrompt, /Wren was wise to share because she saved part of the harvest first/);
  if (passageIndex === 0) await page.screenshot({ path: path.join(outDir, 'desktop-ambush.png'), fullPage: true });
  await submit(page, 'Mina gives a clear reason, and I agree with the main idea because the passage supports it. I would add another detail about responsibility.');
  await submit(page, 'The target word means taking in or understanding something. The surrounding sentence gives a clue, and I can use the word in a new example.');
}

async function assertVisibleText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 });
}

async function assertNoViewportOverflow(page, label) {
  const result = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    clippedButtons: Array.from(document.querySelectorAll('button')).filter((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && (button.scrollWidth > button.clientWidth + 2 || button.scrollHeight > button.clientHeight + 2);
    }).map((button) => button.textContent.trim().slice(0, 60)),
  }));
  assert.ok(result.document <= result.viewport + 1, `${label} horizontal overflow: ${JSON.stringify(result)}`);
  assert.deepEqual(result.clippedButtons, [], `${label} clipped buttons`);
}

async function assertMobileActionVisible(page, selector, label) {
  const result = await page.locator(selector).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height, viewport: window.innerHeight };
  });
  assert.ok(result.top >= 0 && result.bottom <= result.viewport + 1, `${label} action outside viewport: ${JSON.stringify(result)}`);
  assert.ok(result.height >= 44, `${label} action is too small: ${JSON.stringify(result)}`);
}

async function assertMobileTouchTargets(page, label) {
  const shortTargets = await page.evaluate(() => Array.from(document.querySelectorAll('button')).filter((button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && rect.height < 44;
  }).map((button) => ({ text: button.textContent.trim().slice(0, 50), height: button.getBoundingClientRect().height })));
  assert.deepEqual(shortTargets, [], `${label} short touch targets`);
}

async function assertHeaderAtTop(page, label) {
  const top = await page.locator('.studio-header').evaluate((node) => node.getBoundingClientRect().top);
  assert.ok(Math.abs(top) <= 1, `${label} header is displaced: ${top}`);
}

async function installMockMediaRecorder(page) {
  await page.addInitScript(() => {
    const fakeStream = { getTracks: () => [{ stop() {} }] };
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: async () => fakeStream },
    });
    window.MediaRecorder = class MockMediaRecorder {
      static isTypeSupported(type) { return type.startsWith('audio/webm'); }

      constructor(stream, options = {}) {
        this.stream = stream;
        this.mimeType = options.mimeType || 'audio/webm';
        this.state = 'inactive';
      }

      start() { this.state = 'recording'; }

      stop() {
        if (this.state === 'inactive') return;
        this.state = 'inactive';
        const data = new Blob([new Uint8Array(256)], { type: this.mimeType });
        setTimeout(() => {
          if (this.ondataavailable) this.ondataavailable({ data });
          if (this.onstop) this.onstop();
        }, 0);
      }
    };
  });
}

async function main() {
  const server = spawn(python, ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
    cwd: root,
    stdio: 'ignore',
    windowsHide: true,
  });
  let browser;
  try {
    const url = `http://127.0.0.1:${port}/reading-world/alpha-prep/?test=1`;
    await waitForServer(url);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    let delayedTurn = false;
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    await page.route('**/functions/v1/alpha-prep-coach', async (route) => {
      const headers = route.request().headers();
      assert.match(headers.apikey || '', /^sb_publishable_/);
      assert.equal(headers.authorization, undefined, 'opaque publishable key must not be sent as a bearer JWT');
      const payload = JSON.parse(route.request().postData() || '{}');
      if (payload.mode === 'turn' && !delayedTurn) {
        delayedTurn = true;
        await new Promise((resolve) => setTimeout(resolve, 7000));
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse(payload)) });
    });
    await page.route('**/functions/v1/alpha-prep-transcribe', async (route) => {
      assert.equal(route.request().method(), 'GET');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ available: true, model: 'gpt-transcribe' }) });
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    await assertVisibleText(page, 'Walk in ready to listen.');
    assert.equal(await page.locator('#set-select option').count(), 10, 'practice set selector should contain 10 sets');
    assert.ok(await page.locator('.director-photo').evaluate((image) => image.complete && image.naturalWidth >= 600), 'Korean male teacher image should load in the room');
    await page.screenshot({ path: path.join(outDir, 'desktop-lobby.png'), fullPage: true });
    await assertNoViewportOverflow(page, 'desktop lobby');
    await page.locator('#student-name').fill('Alex');
    await page.locator('#set-select').selectOption('9');
    assert.equal(await page.locator('#set-select').inputValue(), '9');
    await page.evaluate(() => {
      window.__printCalls = 0;
      window.print = () => { window.__printCalls += 1; };
    });
    await page.locator('[data-action="preview-print"]').click();
    await assertVisibleText(page, 'Print preview');
    assert.equal(await page.locator('.print-page-preview').count(), 2, 'full session preview should contain two passage sheets');
    assert.deepEqual(await page.locator('.print-passage-meta b').allTextContents(), ['Nonfiction', 'Fable']);
    await assertVisibleText(page, 'A Library Made of Seeds');
    await assertVisibleText(page, 'The Finch’s Favorite Seed');
    assert.equal(await page.locator('.question-block').count(), 0, 'print preview must not expose interview questions');
    await assertNoViewportOverflow(page, 'desktop print preview');
    await page.screenshot({ path: path.join(outDir, 'desktop-print-preview.png'), fullPage: true });
    await page.locator('[data-action="print-materials"]').click();
    assert.equal(await page.evaluate(() => window.__printCalls), 1, 'passage print command should open the browser print dialog');
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.studio-header').evaluate((node) => getComputedStyle(node).display), 'none');
    const printPageBoxes = await page.locator('.print-page-preview').evaluateAll((nodes) => nodes.map((node) => ({
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
      breakAfter: getComputedStyle(node).breakAfter,
    })));
    printPageBoxes.forEach((box) => {
      assert.ok(box.width >= 790 && box.width <= 796, `A4 width mismatch: ${JSON.stringify(box)}`);
      assert.ok(box.height >= 1121 && box.height <= 1124, `A4 height mismatch: ${JSON.stringify(box)}`);
    });
    await page.pdf({ path: path.join(outDir, 'passage-print-a4.pdf'), printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'screen' });
    await page.locator('[data-action="close-print-preview"]').click();
    await assertVisibleText(page, 'Walk in ready to listen.');
    await page.locator('[data-action="seat"][data-seat="3"]').click();
    await page.locator('[data-action="enter-room"]').click();
    await assertVisibleText(page, 'Good afternoon, everyone.');
    await assertVisibleText(page, 'Protecting Tomorrow');
    await assertVisibleText(page, 'two passages, one at a time');
    await assertVisibleText(page, '60 seconds for each passage');
    await assertVisibleText(page, '1. Nonfiction · 2. Fable');
    assert.ok(await page.locator('.director-photo').evaluate((image) => image.complete && image.naturalWidth >= 600));
    await assertNoViewportOverflow(page, 'desktop briefing');
    await page.screenshot({ path: path.join(outDir, 'desktop-briefing.png'), fullPage: true });
    await page.locator('[data-action="prepare-reading"]').click();
    await assertVisibleText(page, 'PASSAGE 1 OF 2');
    assert.equal(await page.locator('.genre-stamp').textContent(), 'Nonfiction');
    await page.locator('[data-action="start-reading"]').click();
    await assertVisibleText(page, '1:00');
    await assertNoViewportOverflow(page, 'desktop nonfiction reading');
    await page.screenshot({ path: path.join(outDir, 'desktop-reading.png'), fullPage: true });
    const firstParagraph = await page.locator('.passage-copy p').first().textContent();
    await page.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await assertVisibleText(page, 'PASSAGE COLLECTED');
    assert.equal((await page.locator('body').innerText()).includes(firstParagraph.slice(0, 40)), false, 'passage text remained visible after collection');
    await page.locator('[data-action="begin-interview"]').click();
    assert.ok(await page.locator('.teacher-portrait img').evaluate((image) => image.complete && image.naturalWidth >= 600));
    await runPassageInterview(page, 0);
    await assertVisibleText(page, 'PASSAGE 1 COMPLETE');

    await page.locator('[data-action="next-passage"]').click();
    await assertVisibleText(page, 'PASSAGE 2 OF 2');
    assert.equal(await page.locator('.genre-stamp').textContent(), 'Fable');
    assert.equal(await page.evaluate(() => window.__ALPHA_PREP_TEST__.state.secondsLeft), 60, 'second passage must receive a fresh 60-second timer');
    await page.locator('[data-action="start-reading"]').click();
    await assertVisibleText(page, '1:00');
    await assertNoViewportOverflow(page, 'desktop fable reading');
    await page.screenshot({ path: path.join(outDir, 'desktop-fable-reading.png'), fullPage: true });
    await page.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await page.locator('[data-action="begin-interview"]').click();
    await runPassageInterview(page, 1);
    await assertVisibleText(page, 'INTERVIEW COACH REPORT');
    await assertVisibleText(page, 'Seven interview skills');
    await assertVisibleText(page, 'Henry’s vocabulary check');
    await assertVisibleText(page, 'Seven-day interview route');
    await page.screenshot({ path: path.join(outDir, 'desktop-report.png'), fullPage: true });
    await assertNoViewportOverflow(page, 'desktop report');
    await page.evaluate(() => { window.__printCalls = 0; });
    await page.locator('[data-action="print-report"]').click();
    assert.equal(await page.evaluate(() => window.__printCalls), 1, 'report print command should open the browser print dialog');
    assert.equal(await page.locator('.correction-item:not([open])').count(), 0, 'report printing should expand every correction');
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.report-actions').evaluate((node) => getComputedStyle(node).display), 'none');
    assert.equal(await page.locator('.correction-item summary b').first().evaluate((node) => getComputedStyle(node).whiteSpace), 'normal');
    await page.pdf({ path: path.join(outDir, 'coach-report-a4.pdf'), printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: 'screen' });
    const apiCalls = await page.evaluate(() => window.__ALPHA_PREP_TEST__.state.apiCalls);
    assert.equal(apiCalls, 3, 'economy mode should use one adaptive call per passage plus one report call');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    await assertNoViewportOverflow(page, 'mobile report');
    await page.screenshot({ path: path.join(outDir, 'mobile-report.png'), fullPage: true });
    await page.locator('[data-action="retry-set"]').click();
    await assertVisibleText(page, 'Walk in ready to listen.');
    await page.waitForFunction(() => window.scrollY < 2);
    await assertNoViewportOverflow(page, 'mobile lobby');
    await assertMobileActionVisible(page, '[data-action="enter-room"]', 'mobile lobby');
    await assertMobileActionVisible(page, '[data-action="preview-print"]', 'mobile print preview shortcut');
    await assertMobileTouchTargets(page, 'mobile lobby');
    assert.ok(await page.locator('.director-photo').evaluate((image) => image.complete && image.getBoundingClientRect().width >= 70), 'teacher should remain visible on mobile');
    await page.screenshot({ path: path.join(outDir, 'mobile-lobby.png') });
    await page.locator('[data-action="preview-print"]').click();
    await assertNoViewportOverflow(page, 'mobile print preview');
    await assertMobileTouchTargets(page, 'mobile print preview');
    const mobilePrintPages = await page.locator('.print-page-preview').evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, clientHeight: node.clientHeight, scrollHeight: node.scrollHeight };
    }));
    assert.ok(mobilePrintPages[0].bottom + 20 <= mobilePrintPages[1].top, `mobile passage previews overlap: ${JSON.stringify(mobilePrintPages)}`);
    mobilePrintPages.forEach((box) => assert.ok(box.scrollHeight <= box.clientHeight + 1, `mobile passage preview clips content: ${JSON.stringify(box)}`));
    await page.screenshot({ path: path.join(outDir, 'mobile-print-preview.png'), fullPage: true });
    await page.locator('[data-action="close-print-preview"]').click();
    await page.locator('[data-action="enter-room"]').click();
    await assertVisibleText(page, 'one minute for each passage');
    await page.waitForFunction(() => window.scrollY < 2);
    await assertNoViewportOverflow(page, 'mobile briefing');
    await assertMobileActionVisible(page, '[data-action="prepare-reading"]', 'mobile briefing');
    await assertMobileTouchTargets(page, 'mobile briefing');
    await page.screenshot({ path: path.join(outDir, 'mobile-briefing.png') });
    await page.locator('[data-action="prepare-reading"]').click();
    await assertMobileActionVisible(page, '[data-action="start-reading"]', 'mobile reading ready');
    await page.locator('[data-action="start-reading"]').click();
    await assertNoViewportOverflow(page, 'mobile nonfiction reading');
    assert.equal(await page.locator('[data-action="finish-reading"]').evaluate((node) => getComputedStyle(node).position), 'static');
    await page.screenshot({ path: path.join(outDir, 'mobile-reading.png') });
    await page.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await assertMobileActionVisible(page, '[data-action="begin-interview"]', 'mobile collected passage');
    await page.locator('[data-action="begin-interview"]').click();
    await page.locator('#answer-draft').waitFor({ state: 'visible' });
    await page.waitForTimeout(120);
    await page.waitForFunction(() => {
      const question = document.querySelector('.question-block');
      const room = document.querySelector('.roundtable');
      return question && room && question.getBoundingClientRect().top < room.getBoundingClientRect().top;
    });
    await assertNoViewportOverflow(page, 'mobile interview');
    await assertMobileTouchTargets(page, 'mobile interview');
    await assertHeaderAtTop(page, 'mobile interview');
    assert.ok(await page.locator('#answer-draft').evaluate((node) => node.getBoundingClientRect().height <= 142), 'mobile answer field should stay compact');
    await page.screenshot({ path: path.join(outDir, 'mobile-interview.png') });
    await page.locator('#answer-draft').scrollIntoViewIfNeeded();
    await page.locator('#answer-draft').fill('I think the tree needs room because its roots need water and air.');
    await page.locator('[data-action="submit-answer"]').scrollIntoViewIfNeeded();
    await assertMobileActionVisible(page, '[data-action="submit-answer"]', 'mobile answer');
    await page.screenshot({ path: path.join(outDir, 'mobile-answer.png') });
    await page.setViewportSize({ width: 320, height: 568 });
    await page.locator('#answer-draft').scrollIntoViewIfNeeded();
    await assertNoViewportOverflow(page, '320px mobile answer');
    await assertMobileTouchTargets(page, '320px mobile answer');
    await page.screenshot({ path: path.join(outDir, 'mobile-320-answer.png') });

    const townPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const townPageErrors = [];
    townPage.on('pageerror', (error) => townPageErrors.push(error.message));
    await townPage.addInitScript(() => {
      sessionStorage.setItem('rw_intro_seen', '1');
      localStorage.setItem('leteon:students', JSON.stringify([{ id: 's_alpha_qa', name: 'Alex', createdAt: Date.now() }]));
      localStorage.setItem('leteon:student:s_alpha_qa:cars:lesson1', JSON.stringify({
        lessons: {}, points: 0, lang: 'en', avatar: { picked: true, equipped: {}, owned: [] },
      }));
    });
    await townPage.goto(`http://127.0.0.1:${port}/reading-world/`, { waitUntil: 'domcontentloaded' });
    await townPage.locator('[data-pick="s_alpha_qa"]').click();
    const entry = townPage.locator('a.alpha-prep-entry').first();
    await entry.waitFor({ state: 'visible', timeout: 8000 });
    assert.match(await entry.getAttribute('href'), /^alpha-prep\/$/);
    await assertNoViewportOverflow(townPage, 'Reading Town entry');
    assert.deepEqual(townPageErrors, [], `Reading Town page errors: ${townPageErrors.join('\n')}`);
    await townPage.close();

    const offlinePage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await offlinePage.route('**/functions/v1/alpha-prep-coach', (route) => route.abort('failed'));
    await offlinePage.route('**/functions/v1/alpha-prep-transcribe', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ available: false, model: 'gpt-transcribe' }),
    }));
    await offlinePage.goto(url, { waitUntil: 'domcontentloaded' });
    await offlinePage.locator('[data-action="mode"][data-mode="quick"]').click();
    await offlinePage.evaluate(() => {
      const api = window.__ALPHA_PREP_TEST__;
      api.state.entered = true;
      api.state.stage = 'briefing';
      api.render();
    });
    await offlinePage.locator('[data-action="prepare-reading"]').click();
    await offlinePage.locator('[data-action="start-reading"]').click();
    await offlinePage.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await offlinePage.locator('[data-action="begin-interview"]').click();
    await runPassageInterview(offlinePage, 2);
    await assertVisibleText(offlinePage, 'INTERVIEW COACH REPORT');
    assert.equal(await offlinePage.evaluate(() => window.__ALPHA_PREP_TEST__.state.apiStatus), 'local');
    assert.equal(await offlinePage.evaluate(() => window.__ALPHA_PREP_TEST__.state.apiCalls), 2);
    await offlinePage.close();

    const voicePage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await installMockMediaRecorder(voicePage);
    let transcriptionPosts = 0;
    await voicePage.route('**/functions/v1/alpha-prep-transcribe', async (route) => {
      const request = route.request();
      assert.match(request.headers().apikey || '', /^sb_publishable_/);
      if (request.method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ available: true, model: 'gpt-transcribe' }) });
        return;
      }
      transcriptionPosts += 1;
      assert.match(request.headers()['content-type'] || '', /^multipart\/form-data; boundary=/);
      const body = (request.postDataBuffer() || Buffer.alloc(0)).toString('utf8');
      assert.match(body, /alpha-prep-answer\.webm/);
      assert.match(body, /Why City Trees Need Room/);
      assert.match(body, /Please summarize the passage/);
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ text: 'I think about the tree because its roots need water and air.', model: 'gpt-transcribe' }),
      });
    });
    await voicePage.goto(url, { waitUntil: 'domcontentloaded' });
    await voicePage.evaluate(() => {
      const api = window.__ALPHA_PREP_TEST__;
      api.state.stage = 'collected';
      api.render();
    });
    await voicePage.locator('[data-action="begin-interview"]').click();
    await voicePage.locator('[data-action="start-mic"]').click();
    await assertVisibleText(voicePage, 'Recording');
    await voicePage.screenshot({ path: path.join(outDir, 'desktop-recording.png'), fullPage: true });
    await voicePage.waitForTimeout(650);
    await voicePage.locator('[data-action="stop-mic"]').click();
    await assertVisibleText(voicePage, 'Transcribing your answer');
    await voicePage.screenshot({ path: path.join(outDir, 'desktop-transcribing.png'), fullPage: true });
    await voicePage.waitForFunction(() => document.querySelector('#answer-draft')?.value.includes('roots need water and air'));
    const voiceAnswer = await voicePage.locator('#answer-draft').inputValue();
    assert.equal(voiceAnswer, 'I think about the tree because its roots need water and air.');
    assert.equal(transcriptionPosts, 1);
    await voicePage.setViewportSize({ width: 390, height: 844 });
    await voicePage.locator('[data-action="start-mic"]').click();
    await assertVisibleText(voicePage, 'Recording');
    await assertNoViewportOverflow(voicePage, 'mobile GPT recording');
    await assertMobileTouchTargets(voicePage, 'mobile GPT recording');
    await voicePage.screenshot({ path: path.join(outDir, 'mobile-recording.png'), fullPage: true });
    await voicePage.setViewportSize({ width: 320, height: 568 });
    await assertNoViewportOverflow(voicePage, '320px GPT recording');
    await assertMobileTouchTargets(voicePage, '320px GPT recording');
    await voicePage.screenshot({ path: path.join(outDir, 'mobile-320-recording.png'), fullPage: true });
    await voicePage.waitForTimeout(650);
    await voicePage.locator('[data-action="stop-mic"]').click();
    await voicePage.waitForFunction(() => (document.querySelector('#answer-draft')?.value.match(/roots need water and air/gi) || []).length === 2);
    assert.equal(transcriptionPosts, 2);
    await voicePage.close();

    const failedVoicePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await installMockMediaRecorder(failedVoicePage);
    await failedVoicePage.route('**/functions/v1/alpha-prep-transcribe', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ available: true, model: 'gpt-transcribe' }) });
        return;
      }
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'transcription_unavailable' }) });
    });
    await failedVoicePage.goto(url, { waitUntil: 'domcontentloaded' });
    await failedVoicePage.evaluate(() => {
      const api = window.__ALPHA_PREP_TEST__;
      api.state.stage = 'collected';
      api.render();
    });
    await failedVoicePage.locator('[data-action="begin-interview"]').click();
    await failedVoicePage.locator('[data-action="start-mic"]').click();
    await failedVoicePage.waitForTimeout(650);
    await failedVoicePage.locator('[data-action="stop-mic"]').click();
    await assertVisibleText(failedVoicePage, 'High-accuracy transcription is unavailable.');
    await assertNoViewportOverflow(failedVoicePage, 'mobile transcription failure');
    await failedVoicePage.screenshot({ path: path.join(outDir, 'mobile-transcription-failure.png'), fullPage: true });
    await failedVoicePage.locator('#answer-draft').fill('I remember the main idea because the passage explains the problem clearly.');
    await failedVoicePage.locator('[data-action="submit-answer"]').click();
    await assertVisibleText(failedVoicePage, 'FOLLOW-UP 1 OF 2');
    await failedVoicePage.close();

    const fallbackVoicePage = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await fallbackVoicePage.addInitScript(() => {
      window.__speechRecognitionInstances = [];
      window.SpeechRecognition = class MockSpeechRecognition {
        constructor() {
          window.__speechRecognitionInstances.push(this);
        }

        start() {
          setTimeout(() => {
            if (this.onstart) this.onstart();

            const interim = [{ transcript: 'I think' }];
            interim.isFinal = false;
            if (this.onresult) this.onresult({ resultIndex: 0, results: [interim] });

            const firstFinal = [{ transcript: 'I think' }];
            firstFinal.isFinal = true;
            if (this.onresult) this.onresult({ resultIndex: 0, results: [firstFinal] });

            const repeatedFinal = [{ transcript: 'I think about' }];
            repeatedFinal.isFinal = true;
            if (this.onresult) this.onresult({ resultIndex: 1, results: [firstFinal, repeatedFinal] });

            const fullFinal = [{ transcript: 'I think about the tree because its roots need water and air.' }];
            fullFinal.isFinal = true;
            if (this.onresult) this.onresult({ resultIndex: 2, results: [firstFinal, repeatedFinal, fullFinal] });
            if (this.onend) this.onend();
          }, 20);
        }
        stop() { if (this.onend) this.onend(); }
        abort() { if (this.onend) this.onend(); }
      };
    });
    await fallbackVoicePage.route('**/functions/v1/alpha-prep-transcribe', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ available: false, model: 'gpt-transcribe' }),
    }));
    await fallbackVoicePage.goto(url, { waitUntil: 'domcontentloaded' });
    await fallbackVoicePage.evaluate(() => {
      const api = window.__ALPHA_PREP_TEST__;
      api.state.stage = 'collected';
      api.render();
    });
    await fallbackVoicePage.locator('[data-action="begin-interview"]').click();
    await fallbackVoicePage.locator('[data-action="start-mic"]').click();
    await fallbackVoicePage.locator('#answer-draft').waitFor({ state: 'visible' });
    await fallbackVoicePage.waitForFunction(() => document.querySelector('#answer-draft')?.value.includes('roots need water and air'));
    const fallbackAnswer = await fallbackVoicePage.locator('#answer-draft').inputValue();
    assert.equal(fallbackAnswer, 'I think about the tree because its roots need water and air.');
    assert.equal((fallbackAnswer.match(/I think/gi) || []).length, 1);
    assert.equal(await fallbackVoicePage.evaluate(() => window.__speechRecognitionInstances[0].continuous), false);
    await fallbackVoicePage.close();

    assert.deepEqual(consoleErrors, [], `browser console errors: ${consoleErrors.join('\n')}`);
    console.log(`alpha-prep browser: ok (${apiCalls} mock API calls)`);
    console.log(`screenshots: ${outDir}`);
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
