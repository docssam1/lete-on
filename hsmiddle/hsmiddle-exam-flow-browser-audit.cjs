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

    // ── 맞은 문제 체크 방식 ──────────────────────────────────────────
    const pressed = n => page.locator(`#ck-${n}`).getAttribute('aria-pressed');
    const stored = key => page.evaluate(k => localStorage.getItem(k), key);
    assert.equal(await page.locator('.ck').count(), 40, 'forty check cells must be rendered');
    assert.equal(await page.locator('.answer-grid input').count(), 0, 'typing answers must no longer be required');
    assert.match(await page.locator('#live').textContent(), /맞은 문제 0개 · 0점/);

    // 아무것도 체크하지 않고 채점하면 확정하지 않는다 (확인 창은 자동으로 취소됨)
    await page.evaluate(() => grade());
    assert.match(await page.locator('#result').textContent(), /먼저 맞은 문제의 번호를 눌러/);
    assert.equal(await stored('hs-mock-1-graded'), null, 'grading with nothing checked must not finalize anything');
    assert.equal(await stored('hs-mock-1-3'), null);

    // 2번(일반), 23번(자기 채점 문항), 1번(복수·수동)을 맞음으로 체크
    await page.locator('#ck-2').click();
    await page.locator('#ck-23').click();
    await page.locator('#ck-1').click();
    assert.equal(await pressed(2), 'true');
    assert.match(await page.locator('#live').textContent(), /맞은 문제 3개 · 7\.5점/);
    assert.equal(await stored('hs-mock-1-2'), 'o');
    assert.equal(await stored('hs-mock-1-3'), null, 'unchecked questions stay empty until grading');
    await page.locator('#ck-2').click();
    assert.equal(await stored('hs-mock-1-2'), null, 'unchecking before grading clears the mark');
    await page.locator('#ck-2').click();

    // 채점하기: 체크하지 않은 37문항이 오답으로 확정된다
    await page.evaluate(() => grade());
    assert.match(await page.locator('#result').textContent(), /맞은 문제 3\/40문항 · 7\.5점/);
    assert.equal(await stored('hs-mock-1-3'), 'x', 'grading must finalize unchecked questions as wrong');
    assert.equal(await stored('hs-mock-1-graded'), '1');
    assert.equal(await page.locator('.wrong-list .fb').count(), 37);
    assert.equal(await page.locator('#fb-3 .ans').textContent(), '정답 68765');
    assert.equal(await page.locator('#ck-3').evaluate(el => el.classList.contains('is-wrong')), true);
    assert.equal(await page.locator('#ck-2').evaluate(el => el.classList.contains('is-wrong')), false);
    assert.equal(await page.locator('#fb-2').count(), 0, 'correct questions get no feedback row');
    assert.equal(await page.locator('#fb-1').count(), 0);
    assert.equal(await page.getByRole('button', { name: '분석지에서 확인·저장' }).count(), 1);

    // 채점 뒤에도 번호를 눌러 고치면 즉시 반영된다 (수동 채점 문항 포함)
    await page.locator('#ck-1').click();
    assert.equal(await page.locator('#fb-1 .ans').textContent(), '직접 채점 문항');
    assert.match(await page.locator('#result').textContent(), /맞은 문제 2\/40문항 · 5점/);
    assert.equal(await stored('hs-mock-1-1'), 'x');

    // 틀린 문항의 영상은 페이지를 떠나지 않고 문항 시점부터 재생된다
    const start3 = await page.evaluate(() => HSMIDDLE_EXAM_META['mock-1'][3].t);
    await page.locator('#fb-3 button', { hasText: '▶ 영상' }).click();
    const playerSrc = await page.locator('.hsm-player-back iframe').getAttribute('src');
    assert.ok(playerSrc.includes(`embed/x5h7yA7Qq48?start=${start3}&`), `player must start at the question time, got ${playerSrc}`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.hsm-player-back iframe').count(), 0, 'closing the player must remove the iframe');

    // 답안 보기 목록에서도 체크할 수 있고, 번호판과 항상 같은 상태를 유지한다
    await page.evaluate(() => showAnswers());
    assert.equal(await page.locator('.ans-ck').count(), 40);
    await page.locator('.ans-ck[data-n="5"]').click();
    assert.equal(await pressed(5), 'true', 'checking in the answer list must update the grid');
    await page.locator('#ck-6').click();
    assert.equal(await page.locator('.ans-ck[data-n="6"]').getAttribute('aria-pressed'), 'true', 'grid and answer list must stay in sync');
    await page.getByRole('button', { name: '전체 체크', exact: true }).click();
    assert.match(await page.locator('#live').textContent(), /맞은 문제 40개 · 100점/);
    await page.getByRole('button', { name: '전체 해제', exact: true }).click();
    assert.match(await page.locator('#live').textContent(), /맞은 문제 0개 · 0점/);

    // 분석지와 연결: 2번, 5번만 맞은 것으로 두고 채점
    await page.locator('#ck-2').click();
    await page.locator('#ck-5').click();
    await page.evaluate(() => grade());
    const popupPromise = context.waitForEvent('page');
    await page.getByRole('button', { name: '분석지에서 확인·저장' }).click();
    const report = await popupPromise;
    await report.waitForLoadState('domcontentloaded');
    assert.match(report.url(), /report\.html\?exam=mock-1$/, 'grading must link to the matching report');
    await report.waitForFunction(() => document.querySelector('#whoName')?.textContent.includes('시험학생'));
    await report.waitForFunction(() => typeof examAnalyze === 'function');
    const reportAnalysis = await report.evaluate(() => examAnalyze());
    assert.equal(reportAnalysis.states[2], 'o', 'report and exam must agree on a checked question');
    assert.equal(reportAnalysis.states[5], 'o');
    assert.equal(reportAnalysis.states[3], 'x', 'report and exam must agree on an unchecked question');
    assert.equal(reportAnalysis.checked, 40, 'every question is decided once grading has run');
    assert.equal(reportAnalysis.correct, 2);
    assert.equal(reportAnalysis.manual, 0, 'self-checked manual questions are decided by the student');
    const directIncomplete = await report.evaluate(() => HSMIDDLE_CLOUD.addAttempt('시험학생', 'mock-1', { score: 0, correct: 0, answered: 0, states: {} }));
    assert.equal(directIncomplete.reason, 'invalid', 'direct incomplete saves must be blocked before network access');
    assert.equal(addAttemptCalls, 0, 'direct incomplete saves must not reach the server');

    // 채점이 끝나지 않은 기록(7번이 비어 있음)은 저장되지 않는다
    await report.evaluate(() => localStorage.removeItem('hs-mock-1-7'));
    await report.reload({ waitUntil: 'networkidle' });
    await report.waitForFunction(() => document.querySelector('#whoName')?.textContent.includes('시험학생'));
    let incompleteMessage = '';
    report.once('dialog', async dialog => { incompleteMessage = dialog.message(); await dialog.dismiss(); });
    await report.locator('#recordBtn').click();
    assert.match(incompleteMessage, /40문항을 모두 채점/);
    assert.match(incompleteMessage, /채점하기/, 'the message must tell students how to finish grading');
    assert.equal(addAttemptCalls, 0, 'an incomplete exam must not be saved');

    // 모두 채점된 기록은 한 번만 저장된다
    await report.evaluate(() => localStorage.setItem('hs-mock-1-7', 'x'));
    await report.reload({ waitUntil: 'networkidle' });
    await report.waitForFunction(() => document.querySelector('#whoName')?.textContent.includes('시험학생'));
    await report.locator('#recordBtn').click();
    await report.waitForTimeout(1000);
    assert.equal(addAttemptCalls, 1, 'a complete exam must be saved once');
    assert.match(await report.locator('#recordBtn').textContent(), /\(1\/3\)/, 'saved attempt count must refresh');
    assert.equal(savedAttempt.answered, 40, 'self-checked answers are all confirmed');
    assert.equal(savedAttempt.correct, 2);
    assert.equal(Object.values(savedAttempt.states).every(value => value === 'o' || value === 'x'), true, 'saved states must be o or x only');
    assert.equal(savedAttempt.states['2'], 'o');
    assert.equal(savedAttempt.states['3'], 'x');
    await report.locator('[data-saved-attempt="0"]').click();
    const reopenedAnalysis = await report.evaluate(() => examAnalyze());
    assert.equal(reopenedAnalysis.checked, 40, 'reopened reports must count every question');
    assert.equal(reopenedAnalysis.manual, 0);
    assert.equal(reopenedAnalysis.states[2], 'o');
    assert.equal(reopenedAnalysis.states[3], 'x');
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

    // 정답이 여러 칸으로 나뉜 문항(final 26번)도 한 번의 체크로 채점한다
    await page.goto(`${base}/exam.html?exam=final`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.locator('#ck-26').click();
    await page.evaluate(() => grade());
    assert.equal(await stored('hs-final-26'), 'o', 'a multi-part question is checked as one question');
    assert.equal(await page.locator('#fb-26').count(), 0);
    const answer25 = await page.evaluate(() => HSMIDDLE_EXAMS.final.answers[24]);
    assert.equal(await page.locator('#fb-25 .ans').textContent(), `정답 ${answer25}`, 'a wrong question shows its answer key');

    // 직접 채점이 필요한 문항(mock-2의 30번)도 같은 방식으로 체크한다
    await page.goto(`${base}/exam.html?exam=mock-2`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.locator('#ck-30').click();
    await page.evaluate(() => grade());
    assert.equal(await stored('hs-mock-2-30'), 'o', 'manual-grading questions are checkable too');

    // 예전 방식(답을 직접 입력)으로 저장된 기록은 정답과 일치하는 문항만 '맞음'으로 옮겨 온다
    await page.goto(`${base}/exam.html?exam=mock-3`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('hs-mock-3-4', '11700');
      localStorage.setItem('hs-mock-3-5', '999');
      localStorage.setItem('hs-mock-3-39', '직접 확인');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    assert.equal(await pressed(4), 'true', 'an alternative answer after 또는 must migrate as correct');
    assert.equal(await pressed(5), 'false', 'a wrong legacy answer must not become correct');
    assert.equal(await pressed(39), 'false', 'a manual legacy answer must stay unchecked');
    assert.equal(await stored('hs-mock-3-5'), '999', 'legacy wrong answers must not be overwritten before grading');
    assert.match(await page.locator('#live').textContent(), /맞은 문제 1개 · 2\.5점/);
    await page.goto(`${base}/exam.html?exam=final`, { waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('hs-final-26-0', '34');
      localStorage.setItem('hs-final-26-1', '26');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#gate').waitFor({ state: 'hidden' });
    assert.equal(await pressed(26), 'true', 'legacy multi-part answers migrate when every part is correct');

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
      showAnswers(); grade(); markAll(true); printPaper(); printAnswers(); watch(); openReport();
      return { opened, printed, enterExamType: typeof enterExam };
    });
    assert.deepEqual(blockedCalls, { opened: 0, printed: 0, enterExamType: 'undefined' }, 'unverified visitors must not invoke protected actions');
    assert.equal(await mobilePage.evaluate(() => localStorage.getItem('hs-mock-1-1')), null, 'unverified visitors must not mark answers');
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
