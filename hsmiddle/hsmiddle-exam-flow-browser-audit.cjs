const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = __dirname;
const source = fs.readFileSync(path.join(root, 'exam.html'), 'utf8');
const base = process.env.HSMIDDLE_BASE_URL || 'http://127.0.0.1:8894/hsmiddle';
const token = 'a'.repeat(64);
const expiresAt = new Date(Date.now() + 3600000).toISOString();
const access = ['diagnostic', 'mock-1', 'mock-2', 'mock-3', 'final'];
let addAttemptCalls = 0;
let savedAttempt = null;
let rejectForLimit = false;

assert.equal((source.match(/function grade\s*\(/g) || []).length, 1, 'grade must have one implementation');
assert.equal((source.match(/function showAnswers\s*\(/g) || []).length, 1, 'showAnswers must have one implementation');
assert.match(source, /await HSMIDDLE_AUTH\.refreshSession\(\)/, 'saved sessions must be verified by the server');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await context.route('**/functions/v1/hsmiddle-records', async route => {
      const body = JSON.parse(route.request().postData() || '{}');
      if (body.action === 'session') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, name: '시험학생', access, admin: false, expiresAt, startedAt: '2026-09-01T00:00:00.000Z' }) });
      }
      if (body.action === 'listAttempts') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, attempts: savedAttempt ? [savedAttempt] : [] }) });
      }
      if (body.action === 'addAttempt') {
        addAttemptCalls += 1;
        if (rejectForLimit) {
          return route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify({ error: 'attempt_limit' }) });
        }
        savedAttempt = { ...body.record, attempt: 1, created_at: new Date().toISOString() };
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, attempt: 1 }) });
      }
      return route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ error: 'unexpected_action' }) });
    });
    await page.addInitScript(({ token, expiresAt, access }) => {
      localStorage.setItem('hsm-session-token-v2', token);
      localStorage.setItem('hsm-session-profile-v2', JSON.stringify({ name: '시험학생', access, admin: false, expiresAt }));
    }, { token, expiresAt, access });
    await page.goto(`${base}/exam.html?exam=mock-1`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    assert.equal(await page.locator('#student').textContent(), '시험학생 · 시험지와 답안 검수 화면');
    assert.equal(await page.locator('.watermark span').first().textContent(), '시험학생 · GFIELD');

    await page.locator('#ox-23 button[data-value="o"]').click();
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-23').textContent(), 'O', 'O/X answer must be graded as correct');
    assert.equal(await page.locator('#m-23').getAttribute('class'), 'grade-mark good');
    assert.match(await page.locator('#result').textContent(), /입력 1\/40문항 · 정답 1문항/);
    assert.equal(await page.getByRole('button', { name: '분석지에서 확인·저장' }).count(), 1);
    await page.locator('#a-2').fill('6');
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-2').textContent(), 'O', 'ordinary answers must be graded');
    await page.locator('#ox-23 button[data-value="x"]').click();
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-23').textContent(), 'X', 'X answer must be graded as incorrect');
    assert.equal(await page.locator('#fb-23 .ans').textContent(), '자기 채점 X', 'self-marked X needs an accurate label');
    await page.evaluate(() => { HSMIDDLE_EXAMS['mock-1'].answers[22] = 'X'; grade(); });
    assert.equal(await page.locator('#m-23').textContent(), 'O', 'an explicit X answer key must accept X');
    await page.evaluate(() => { HSMIDDLE_EXAMS['mock-1'].answers[22] = '수동'; grade(); });
    await page.locator('#a-1').fill('직접 확인');
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-1').textContent(), '확인', 'manual answers must remain unscored');
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: '분석지에서 확인·저장' }).click();
    const report = await popupPromise;
    await report.waitForLoadState('domcontentloaded');
    assert.match(report.url(), /report\.html\?exam=mock-1$/, 'grading must link to the matching report');
    await report.waitForFunction(() => document.querySelector('#whoName')?.textContent.includes('시험학생'));
    await report.waitForFunction(() => typeof examAnalyze === 'function');
    const reportAnalysis = await report.evaluate(() => examAnalyze());
    assert.equal(reportAnalysis.states[2], 'o', 'report and exam must agree on an ordinary answer');
    assert.equal(reportAnalysis.states[23], 'x', 'report and exam must agree on self-marked X');
    const directIncomplete = await report.evaluate(() => HSMIDDLE_CLOUD.addAttempt('시험학생', 'mock-1', { score: 0, correct: 0, answered: 0, states: {} }));
    assert.equal(directIncomplete.reason, 'invalid', 'direct incomplete saves must be blocked before network access');
    assert.equal(addAttemptCalls, 0, 'direct incomplete saves must not reach the server');
    let incompleteMessage = '';
    report.once('dialog', async dialog => { incompleteMessage = dialog.message(); await dialog.dismiss(); });
    await report.locator('#recordBtn').click();
    assert.match(incompleteMessage, /40문항을 모두 입력/);
    assert.equal(addAttemptCalls, 0, 'an incomplete exam must not be saved');

    await report.evaluate(() => {
      const exam = HSMIDDLE_EXAMS['mock-1'];
      for (let n = 1; n <= exam.questions; n += 1) {
        if (exam.oxQuestions && exam.oxQuestions.includes(n)) {
          localStorage.setItem(`hs-mock-1-${n}`, 'o');
        } else if (exam.answerFields && exam.answerFields[n]) {
          exam.answerFields[n].forEach((field, index) => localStorage.setItem(`hs-mock-1-${n}-${index}`, field.answer));
        } else {
          const expected = String(exam.answers[n - 1] || '직접 확인').split('또는')[0].trim();
          localStorage.setItem(`hs-mock-1-${n}`, expected === '수동' || expected === '복수·수동' ? '직접 확인' : expected);
        }
      }
    });
    await report.reload({ waitUntil: 'networkidle' });
    await report.waitForFunction(() => document.querySelector('#whoName')?.textContent.includes('시험학생'));
    assert.equal((await report.evaluate(() => examAnalyze())).checked, 40, 'all forty responses must be recognized');
    await report.locator('#recordBtn').click();
    await report.waitForTimeout(1000);
    assert.equal(addAttemptCalls, 1, 'a complete exam must be saved once');
    assert.match(await report.locator('#recordBtn').textContent(), /\(1\/3\)/, 'saved attempt count must refresh');
    assert.equal(savedAttempt.answered, 39, 'manual-only answers must stay outside the confirmed score');
    assert.equal(savedAttempt.states['1'], 'manual', 'manual answers must remain visible after reopening a saved report');
    await report.locator('[data-saved-attempt="0"]').click();
    const reopenedAnalysis = await report.evaluate(() => examAnalyze());
    assert.equal(reopenedAnalysis.checked, 40, 'reopened reports must count manual responses as entered');
    assert.equal(reopenedAnalysis.manual, 1, 'reopened reports must restore the manual response count');
    assert.equal(reopenedAnalysis.states[1], 'manual', 'reopened reports must show the manual state');
    rejectForLimit = true;
    const limitResult = await report.evaluate(() => {
      const states = Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, 'x']));
      return HSMIDDLE_CLOUD.addAttempt('시험학생', 'mock-1', { score: 0, correct: 0, answered: 40, states });
    });
    assert.equal(limitResult.reason, 'full', 'server attempt limits must remain visible to the client');
    assert.equal(addAttemptCalls, 2, 'the limit response must come from the server');
    await report.close();
    await page.emulateMedia({ media: 'print' });
    assert.equal(await page.locator('.top').evaluate(element => getComputedStyle(element).display), 'none', 'print must hide the toolbar');
    assert.equal(await page.locator('.panel').evaluate(element => getComputedStyle(element).display), 'none', 'print must hide answer controls');

    await page.emulateMedia({ media: 'screen' });
    await page.goto(`${base}/exam.html?exam=final`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.locator('#a-26-0').fill('34');
    await page.locator('#a-26-1').fill('26');
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-26').textContent(), 'O', 'multi-part answers must be graded together');

    await page.goto(`${base}/exam.html?exam=mock-2`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.locator('#ox-30 button[data-value="o"]').click();
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-30').textContent(), 'O', 'mock-2 O/X answer must be graded');

    await page.goto(`${base}/exam.html?exam=mock-3`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.locator('#a-4').fill('11700');
    await page.locator('#ox-39 button[data-value="o"]').click();
    await page.evaluate(() => grade());
    assert.equal(await page.locator('#m-4').textContent(), 'O', 'an alternative answer after 또는 must be accepted');
    assert.equal(await page.locator('#m-39').textContent(), 'O', 'mock-3 O/X answer must be graded');

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobile.newPage();
    await mobilePage.route('**/functions/v1/hsmiddle-records', route => route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }));
    await mobilePage.goto(`${base}/exam.html?exam=mock-1`, { waitUntil: 'networkidle' });
    assert.equal(await mobilePage.locator('#gate').isVisible(), true, 'unverified visitors must remain at the gate');
    assert.equal(await mobilePage.locator('#viewer').isHidden(), true);
    const blockedCalls = await mobilePage.evaluate(() => {
      let opened = 0, printed = 0;
      window.open = () => { opened += 1; };
      window.print = () => { printed += 1; };
      showAnswers(); grade(); printPaper(); printAnswers(); watch(); openReport();
      return { opened, printed, enterExamType: typeof enterExam };
    });
    assert.deepEqual(blockedCalls, { opened: 0, printed: 0, enterExamType: 'undefined' }, 'unverified visitors must not invoke protected actions');
    assert.equal(await mobilePage.locator('#result').textContent(), '아직 채점하지 않았습니다.', 'unverified visitors must not invoke answer functions');
    assert.equal(await mobilePage.locator('.top').evaluate(element => getComputedStyle(element).position), 'static', 'mobile header must not cover the answer panel');
    assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, 'mobile page must not overflow');
    await mobile.close();
    await context.close();
    console.log('HSMIDDLE_EXAM_FLOW_AUDIT_OK');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
