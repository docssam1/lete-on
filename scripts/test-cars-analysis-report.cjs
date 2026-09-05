const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.env.CARS_REPORT_URL || 'http://127.0.0.1:8877/reading-world/print.html';

async function openCourse(page, course) {
  await page.goto(`${base}#c=${course}`, { waitUntil: 'load' });
  await page.waitForTimeout(250);
  await page.evaluate(() => {
    const modal = document.getElementById('brandModal');
    if (modal) modal.hidden = true;
  });
  await page.locator('[data-wt="grade"]').click();
}

async function clickLevel(page, id) {
  await page.locator(`[data-glv="${id}"]`).click();
}

async function answerLevel(page, id, misses = []) {
  const keys = await page.evaluate((levelId) => {
    const level = window.DIAGNOSTIC.levels.find((item) => item.id === levelId);
    return level.questions.map((question) => question[3]);
  }, id);
  for (let i = 0; i < keys.length; i += 1) {
    const answer = misses.includes(i) ? (keys[i] === 'A' ? 'B' : 'A') : keys[i];
    await page.locator(`[data-ga="${id}|${i}:${answer}"]`).click();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  try {
    await page.goto(`${base}#c=c`, { waitUntil: 'load' });
    await page.waitForTimeout(250);
    assert.equal(
      await page.locator('[data-part-cb="c:original"]').isChecked(),
      true,
      'the direct CARS C link must show the licensed original by default'
    );
    assert.equal(
      await page.locator('[data-part-cb="c:extra"]').isChecked(),
      false,
      'extra reading must remain an explicit selection'
    );

    await openCourse(page, 'diag');

    // The default P chip is removed, then levels are deliberately clicked backwards.
    for (const id of ['P', 'D', 'AA', 'B']) await clickLevel(page, id);
    assert.deepEqual(
      (await page.locator('[data-glv].on').allTextContents()).map((text) => text.trim().split(/\s+/)[0]),
      ['AA', 'B', 'D'],
      'selected levels must remain in canonical easy-to-hard order'
    );
    assert.deepEqual(await page.locator('.grade-src .ans-h').allTextContents(), ['레벨 AA', '레벨 B', '레벨 D']);
    assert.deepEqual(
      await page.locator('.grade-src').evaluateAll((groups) => groups.map((group) => group.querySelectorAll('.ansrow').length)),
      [6, 12, 12],
      'each level heading and its answers must stay in one grade-src group'
    );
    assert.ok(
      (await page.locator('[data-glv="AA"]').evaluate((el) => getComputedStyle(el).backgroundColor)) !== 'rgba(0, 0, 0, 0)',
      'selected level chip must visibly change colour'
    );

    assert.match(await page.locator('.rp-verdict > b').first().innerText(), /^임시 분석 · 0\/30 입력$/);
    assert.equal(await page.locator('.rp-books').count(), 0, 'books must not be recommended from blank answers');
    assert.equal(await page.locator('.rp-road').count(), 0, 'roadmap must not be final before completion');
    assert.equal(await page.locator('#autoRemedy').isDisabled(), true);
    assert.equal(
      await page.locator('.rt tbody td:last-child').evaluateAll((cells) => cells.every((cell) => cell.textContent.trim() === '—')),
      true,
      'blank answers must remain ungraded rather than becoming wrong answers'
    );

    await page.locator('[data-ga="AA|0:A"]').click();
    assert.match(await page.locator('.rp-verdict > b').first().innerText(), /^임시 분석 · 1\/30 입력$/);
    assert.match(await page.locator('.rp-verdict p').first().innerText(), /미입력 답은 오답으로 처리하지 않았으며/);

    // Complete Level D with two targeted misses so the prescription path is exercised.
    await clickLevel(page, 'AA');
    await clickLevel(page, 'B');
    await answerLevel(page, 'D', [0, 3]);
    assert.equal((await page.locator('#gScore').innerText()).startsWith('12/12 입력'), true);
    assert.doesNotMatch(await page.locator('.rp-verdict > b').first().innerText(), /임시 분석/);
    assert.equal(await page.locator('#autoRemedy').isEnabled(), true);
    assert.equal(await page.locator('.rp-qref tbody tr').count(), 6, 'two weak skills should map to three D lessons each');
    assert.equal(await page.locator('.rp-road > div').count(), 4, 'the teaching roadmap must contain four weeks');
    assert.equal(await page.locator('.rp-books .rp-book').count(), 3, 'three comparable-book options should be shown');
    assert.match(await page.locator('.rp-dx').first().innerText(), /오류 가능성:|수업 처방:|교사 발문:|성공 기준:/);

    // Counselling sections are independent and removed from the report DOM when disabled.
    await page.locator('[data-rsec="books"]').uncheck();
    assert.equal(await page.locator('.rp-books').count(), 0);
    await page.locator('[data-rsec="books"]').check();
    assert.equal(await page.locator('.rp-books').count(), 1);

    await page.locator('[data-rlang="en"]').click();
    assert.match(await page.locator('.rp-h').filter({ hasText: 'Automated diagnostic comment' }).first().innerText(), /Automated/);

    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('.rp-score').first().evaluate((el) => getComputedStyle(el).flexDirection), 'column');
    const mobileRows = await page.locator('.grade-src .ansrow').evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().width));
    assert.ok(Math.min(...mobileRows) >= 150, 'mobile answer cards must remain readable');

    // Every CARS book must expose its own unit sources and unit-report semantics.
    for (const course of ['b', 'c', 'd']) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await openCourse(page, course);
      assert.equal(await page.locator('#gPickLabel').innerText(), '교재 단원');
      assert.ok(await page.locator('#gLevel option').count() > 0, `CARS ${course.toUpperCase()} needs unit sources`);
      assert.match(await page.locator('.sheet.report .sh-tag').first().innerText(), /UNIT REPORT/i);
      assert.match(await page.locator('.rp-verdict > b').first().innerText(), /^(임시 분석|Provisional analysis)/);
    }

    assert.deepEqual(pageErrors, [], `page errors: ${pageErrors.join('; ')}`);
    console.log('PASS CARS analysis report QA: ordering, grouping, provisional state, prescription, sections, languages, mobile, B/C/D units');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
