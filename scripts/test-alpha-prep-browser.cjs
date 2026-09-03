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
    followUp: 'Which exact detail from the passage makes that reason convincing?',
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
  await submit(page, 'The passage is mainly about solving a problem carefully. It explains the problem and shows a useful solution with important details.');
  await submit(page, 'The exact detail makes the idea convincing because it shows what changed and why the result mattered.');
  await submit(page, 'One important detail is that the characters or people tested a solution before deciding what to do.');
  await page.locator('[data-action="hear-peer"]').click();
  await assertVisibleText(page, 'Keep the idea in mind.');
  await page.locator('[data-action="after-peer"]').click();
  await assertVisibleText(page, 'SURPRISE LISTENING QUESTION');
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
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    await page.route('**/functions/v1/alpha-prep-coach', async (route) => {
      const payload = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponse(payload)) });
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    await assertVisibleText(page, 'Walk in ready to listen.');
    await page.screenshot({ path: path.join(outDir, 'desktop-lobby.png'), fullPage: true });
    await assertNoViewportOverflow(page, 'desktop lobby');
    await page.locator('#student-name').fill('Alex');
    await page.locator('[data-action="seat"][data-seat="3"]').click();
    await page.locator('[data-action="enter-room"]').click();
    await assertVisibleText(page, 'Good afternoon, everyone.');
    await page.locator('[data-action="prepare-reading"]').click();
    await page.locator('[data-action="start-reading"]').click();
    await assertVisibleText(page, '1:00');
    await page.screenshot({ path: path.join(outDir, 'desktop-reading.png'), fullPage: true });
    const firstParagraph = await page.locator('.passage-copy p').first().textContent();
    await page.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await assertVisibleText(page, 'PASSAGE COLLECTED');
    assert.equal((await page.locator('body').innerText()).includes(firstParagraph.slice(0, 40)), false, 'passage text remained visible after collection');
    await page.locator('[data-action="begin-interview"]').click();
    await runPassageInterview(page, 0);
    await assertVisibleText(page, 'PASSAGE 1 COMPLETE');

    await page.locator('[data-action="next-passage"]').click();
    await page.locator('[data-action="start-reading"]').click();
    await page.evaluate(() => window.__ALPHA_PREP_TEST__.expireReading());
    await page.locator('[data-action="begin-interview"]').click();
    await runPassageInterview(page, 1);
    await assertVisibleText(page, 'INTERVIEW COACH REPORT');
    await assertVisibleText(page, 'Seven interview skills');
    await assertVisibleText(page, 'Henry’s vocabulary check');
    await assertVisibleText(page, 'Seven-day interview route');
    await page.screenshot({ path: path.join(outDir, 'desktop-report.png'), fullPage: true });
    await assertNoViewportOverflow(page, 'desktop report');
    const apiCalls = await page.evaluate(() => window.__ALPHA_PREP_TEST__.state.apiCalls);
    assert.equal(apiCalls, 3, 'economy mode should use one adaptive call per passage plus one report call');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    await assertNoViewportOverflow(page, 'mobile report');
    await page.screenshot({ path: path.join(outDir, 'mobile-report.png'), fullPage: true });
    await page.locator('[data-action="retry-set"]').click();
    await assertVisibleText(page, 'Walk in ready to listen.');
    await assertNoViewportOverflow(page, 'mobile lobby');
    await page.screenshot({ path: path.join(outDir, 'mobile-lobby.png'), fullPage: true });

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
    await voicePage.addInitScript(() => {
      window.SpeechRecognition = class MockSpeechRecognition {
        start() {
          setTimeout(() => {
            if (this.onstart) this.onstart();
            const result = [{ transcript: 'I think the tree needs room because its roots need water and air.' }];
            result.isFinal = true;
            if (this.onresult) this.onresult({ resultIndex: 0, results: [result] });
            if (this.onend) this.onend();
          }, 20);
        }
        stop() { if (this.onend) this.onend(); }
        abort() { if (this.onend) this.onend(); }
      };
    });
    await voicePage.goto(url, { waitUntil: 'domcontentloaded' });
    await voicePage.evaluate(() => {
      const api = window.__ALPHA_PREP_TEST__;
      api.state.stage = 'collected';
      api.render();
    });
    await voicePage.locator('[data-action="begin-interview"]').click();
    await voicePage.locator('[data-action="start-mic"]').click();
    await voicePage.locator('#answer-draft').waitFor({ state: 'visible' });
    await voicePage.waitForFunction(() => document.querySelector('#answer-draft')?.value.includes('roots need water and air'));
    assert.match(await voicePage.locator('#answer-draft').inputValue(), /roots need water and air/);
    await voicePage.close();

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
