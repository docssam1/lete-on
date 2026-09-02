import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const browser = await chromium.launch({ headless: true });
const expectedOfflineError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function auditViewport(viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !expectedOfflineError(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  let lessonCount = 0;
  for (let bookNumber = 1; bookNumber <= 10; bookNumber += 1) {
    const bookId = `book-${String(bookNumber).padStart(2, "0")}`;
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BROWSER-AUDIT&book=${bookId}`, { waitUntil: "networkidle" });
    const lessons = await page.locator(".lesson-button").evaluateAll((nodes) => nodes.map((node) => node.dataset.lesson));
    assert.equal(lessons.length, 4, `${label}/${bookId}: expected four lessons`);
    for (const lessonId of lessons) {
      await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
      assert.equal(await page.locator(".concept-tutorial").count(), 1, `${label}/${bookId}/${lessonId}: tutorial missing`);
      assert.ok(await page.locator(".tutorial-steps li").count() >= 2, `${label}/${bookId}/${lessonId}: tutorial steps missing`);
      assert.equal(await page.locator(".tutorial-steps li p:empty").count(), 0, `${label}/${bookId}/${lessonId}: empty tutorial step`);
      assert.ok((await page.locator(".tutorial-check span").innerText()).trim(), `${label}/${bookId}/${lessonId}: tutorial check missing`);
      const originalStep = page.locator('.stage-step[data-phase="original"]');
      if (!(await originalStep.isDisabled())) {
        await originalStep.click();
        const itemCount = await page.locator("[data-original-item]").count();
        assert.ok(itemCount >= 1, `${label}/${bookId}/${lessonId}: source question missing`);
        assert.equal(await page.locator("[data-original-answer]").count(), itemCount, `${label}/${bookId}/${lessonId}: per-question answer view missing`);
        assert.equal(await page.locator("[data-original-skip]").count(), itemCount, `${label}/${bookId}/${lessonId}: per-question skip missing`);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      assert.equal(overflow, false, `${label}/${bookId}/${lessonId}: horizontal overflow`);
      lessonCount += 1;
    }
  }

  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
  return lessonCount;
}

async function auditGeometryAndPrint() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BROWSER-AUDIT&book=book-06`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="rectangle-missing-side"]').click();
  await page.locator('.stage-step[data-phase="original"]').click();
  const labelSizes = await page.locator(".b6-geometry .measure-label, .b6-geometry .note").evaluateAll((nodes) => nodes.map((node) => ({
    text: node.textContent.trim(),
    size: Number.parseFloat(getComputedStyle(node).fontSize)
  })));
  assert.ok(labelSizes.length >= 4, "book-06 rectangle measurement labels missing");
  assert.ok(labelSizes.every(({ size }) => size >= 14), `book-06 rectangle labels too small: ${JSON.stringify(labelSizes)}`);

  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printBookButton").click();
  assert.equal(await page.locator(".gold-print-page").count(), 8, "book print must contain eight pages");
  await page.close();
  return labelSizes.length;
}

async function openExtension(page, student) {
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=${student}&book=book-06`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="rectangle-missing-side"]').click();
  await page.locator('.stage-step[data-phase="original"]').click();
  const answerButtons = page.locator("[data-original-answer]");
  const itemCount = await answerButtons.count();
  assert.ok(itemCount >= 1, "extension audit source questions missing");
  for (let index = 0; index < itemCount; index += 1) await page.locator("[data-original-answer]").nth(index).click();
  await page.locator('[data-check="original"]').click();
  await page.locator('[data-check="original"]').click();
  assert.equal(await page.locator("[data-extension-answer]").count(), 1, "extension answer view missing");
  assert.equal(await page.locator("[data-extension-skip]").count(), 1, "extension skip control missing");
  assert.match(await page.locator(".quiz-head span").innerText(), /추가 학습/u, "extension stage label missing");
  return itemCount;
}

async function auditExtensionControls() {
  const answerPage = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const answerSourceItems = await openExtension(answerPage, "EXTENSION-ANSWER-AUDIT");
  await answerPage.locator("[data-extension-answer]").click();
  assert.equal(await answerPage.locator(".extension-solution").count(), 1, "extension solution missing after answer view");
  assert.match(await answerPage.locator(".extension-solution").innerText(), /풀이[\s\S]*답/u, "extension solution needs explanation and answer");
  assert.equal(await answerPage.locator('[data-check="extension"]').isDisabled(), false, "extension completion stayed disabled after answer view");
  await answerPage.locator('[data-check="extension"]').click();
  assert.match(await answerPage.locator(".complete-panel>p").innerText(), /다시 연습/u, "answer-assisted completion was presented as mastery");
  assert.match(await answerPage.locator(".learning-record").innerText(), new RegExp(`답 확인\\s*${answerSourceItems + 1}`, "u"), "extension answer view was not recorded");
  await answerPage.close();

  const skipPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const skipSourceItems = await openExtension(skipPage, "EXTENSION-SKIP-AUDIT");
  await skipPage.locator("[data-extension-skip]").click();
  assert.equal(await skipPage.locator(".extension-solution").count(), 0, "skipping exposed the approved answer");
  assert.match(await skipPage.locator(".quiz-item-assist.skipped").innerText(), /넘어간 문제/u, "extension skip note missing");
  assert.equal(await skipPage.locator('[data-check="extension"]').isDisabled(), false, "extension completion stayed disabled after skip");
  assert.equal(await skipPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "extension controls overflow mobile viewport");
  await skipPage.locator('[data-check="extension"]').click();
  assert.match(await skipPage.locator(".learning-record").innerText(), new RegExp(`답 확인\\s*${skipSourceItems}`, "u"), "source answer views were not preserved");
  assert.match(await skipPage.locator(".learning-record").innerText(), /넘어감\s*1/u, "extension skip was not recorded");
  await skipPage.evaluate(() => { window.print = () => {}; });
  await skipPage.locator("#printLessonButton").click();
  await skipPage.waitForTimeout(100);
  assert.equal(await skipPage.locator('.gold-print-page[data-print-part="story"] h2').innerText(), "추가 학습", "print extension title mismatch");
  assert.equal(await skipPage.locator(".gold-print-page button, .gold-print-page input").count(), 0, "print extension contains interactive controls");
  await skipPage.close();
}

async function auditInteractiveClock() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=CLOCK-AUDIT&book=book-01`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="clock-turning"]').click();
  assert.equal(await page.locator(".concept-experience").count(), 1, "clock experience missing");
  const interactiveClock = page.locator("#lessonContent .experience-clock");
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "0", "clock must start from the blank-board starting state");
  await page.locator('[data-experience-action="next"]').click();
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "1", "clock next control failed");
  await page.locator('[data-experience-action="restart"]').click();
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "0", "clock replay must return to the first state");
  await page.keyboard.press("ArrowRight");
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "1", "clock keyboard next control failed");
  await page.keyboard.press("End");
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "4", "clock keyboard final-step control failed");
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printLessonButton").click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".gold-print-experience").count(), 1, "clock print final still must work from the final interactive step");
  await page.keyboard.press("Home");
  assert.equal(await interactiveClock.getAttribute("data-experience-step"), "0", "clock keyboard restart control failed");
  await page.locator('[data-experience-choice="8"]').click();
  assert.match(await page.locator(".experience-check .feedback").innerText(), /맞아요/, "clock concept check rejected the approved answer");
  await page.locator("#printLessonButton").click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".gold-print-experience").count(), 1, "clock print final still missing");
  assert.equal(await page.locator(".gold-print-experience button, .gold-print-experience select").count(), 0, "clock print must not include interactive controls");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, "clock experience mobile overflow");
  await page.close();
}

async function auditReducedMotionClock() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=REDUCED-MOTION&book=book-01`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="clock-turning"]').click();
  await page.locator('[data-experience-action="next"]').click();
  assert.equal(await page.locator("#lessonContent .experience-clock").getAttribute("data-experience-step"), "1", "reduced-motion clock step failed");
  const duration = await page.locator("#lessonContent .experience-clock-hand").evaluate((node) => Number.parseFloat(getComputedStyle(node).animationDuration));
  assert.ok(duration <= 0.02, `reduced-motion clock animation was not disabled: ${duration}s`);
  await page.close();
}

async function auditBookOneGuidedConcepts() {
  const cases = [
    { id: "fold-one-cut", family: "fold-symmetry", wrong: "한쪽에만 남아요", answer: "접은 선에서 같은 거리에 마주 봐요" },
    { id: "equal-line-sums", family: "equal-line", wrong: "5", answer: "7" },
    { id: "preference-logic", family: "one-to-one-logic", wrong: "빨강", answer: "노랑" }
  ];

  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=GUIDED-${item.id}&book=book-01`, { waitUntil: "networkidle" });
    await page.locator(`.lesson-button[data-lesson="${item.id}"]`).click();
    const experience = page.locator(`.guided-concept[data-guided-family="${item.family}"]`);
    assert.equal(await experience.count(), 1, `${item.id}: guided concept missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: original problem must start locked`);
    assert.equal(await experience.locator(".experience-check").count(), 0, `${item.id}: check appeared before the final scene`);
    const next = experience.locator('[data-experience-action="next"]');
    for (let step = 0; step < 3; step += 1) await next.click();
    assert.equal(await experience.locator(".experience-check").count(), 1, `${item.id}: final check missing`);
    assert.equal(await experience.locator(`[data-experience-choice="${item.answer}"]`).count(), 1, `${item.id}: approved answer is not unique`);
    await experience.locator(`[data-experience-choice="${item.wrong}"]`).click();
    assert.match(await experience.locator(".feedback").innerText(), /다시 살펴/u, `${item.id}: wrong-answer feedback missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: wrong answer unlocked the original problem`);
    await experience.locator("[data-experience-answer]").click();
    assert.match(await experience.locator(".feedback").innerText(), new RegExp(`답:\\s*${item.answer}`, "u"), `${item.id}: approved answer view missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${item.id}: answer view did not unlock the original problem`);

    const typography = await experience.locator(".experience-caption, .guided-check>p, .guided-check .answer-choices button, .guided-answer, .concept-hint").evaluateAll((nodes) => nodes.map((node) => ({
      text: node.textContent.trim(),
      fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
      height: node.matches("button") ? node.getBoundingClientRect().height : null
    })));
    assert.ok(typography.every(({ fontSize }) => fontSize >= 14), `${item.id}: course-1 guided text is too small: ${JSON.stringify(typography)}`);
    assert.ok(typography.filter(({ height }) => height != null).every(({ height }) => height >= 40), `${item.id}: guided touch control is too small: ${JSON.stringify(typography)}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false, `${item.id}: mobile horizontal overflow`);

    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printLessonButton").click();
    await page.waitForTimeout(100);
    const printSummary = page.locator(".guided-print-summary");
    assert.equal(await printSummary.count(), 1, `${item.id}: guided print summary missing`);
    assert.equal(await printSummary.locator("button, input, select").count(), 0, `${item.id}: print summary contains interactive controls`);
    await page.close();
  }
  return cases.length;
}

async function auditBookTwoGuidedConcepts() {
  const cases = [
    { id: "addition-matrix", family: "shape-substitution", wrong: "5", answer: "11", visual: ".guided-substitution-visual" },
    { id: "balance-order", family: "balance-order-chain", wrong: "오리", answer: "고양이", visual: ".guided-balance-visual" },
    { id: "dual-shape-color-pattern", family: "dual-shape-color-cycle", wrong: "빈 네모 □", answer: "빈 동그라미 ○", visual: ".guided-pattern-visual" },
    { id: "diamond-number-promise", family: "four-number-promise", wrong: "9", answer: "11", visual: ".guided-promise-visual" }
  ];

  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=GUIDED-BOOK2-${item.id}&book=book-02`, { waitUntil: "networkidle" });
    await page.locator(`.lesson-button[data-lesson="${item.id}"]`).click();
    const experience = page.locator(`.guided-concept[data-guided-family="${item.family}"]`);
    assert.equal(await experience.count(), 1, `${item.id}: Book 2 guided concept missing`);
    assert.equal(await experience.locator(item.visual).count(), 1, `${item.id}: Book 2 guided visual missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: Book 2 original must start locked`);
    assert.equal(await experience.locator(".guided-check").count(), 0, `${item.id}: Book 2 check appeared early`);
    for (let step = 0; step < 3; step += 1) await experience.locator('[data-experience-action="next"]').click();
    assert.equal(await experience.locator(".guided-check").count(), 1, `${item.id}: Book 2 final check missing`);

    if (item.id === "balance-order") {
      assert.equal(await experience.locator(".guided-order-chain span").count(), 3, "Book 2 balance order chain is incomplete");
      const verticalPositions = await experience.locator(".guided-balance-unit").first().locator(".guided-balance-load").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
      assert.ok(verticalPositions[0] > verticalPositions[1] + 10, `Book 2 balance heavy side is not visibly lower: ${verticalPositions.join(",")}`);
    }
    if (item.id === "dual-shape-color-pattern") {
      assert.equal(await experience.locator(".guided-pattern-row span").count(), 6, "Book 2 dual pattern needs six visible positions");
      assert.equal(await experience.locator(".guided-cycle-key span").count(), 2, "Book 2 dual pattern cycles are not separated");
    }
    if (item.id === "diamond-number-promise") assert.match(await experience.locator(".guided-reverse-rule").innerText(), /위.*왼쪽.*아래.*오른쪽/u, "Book 2 reverse promise rule missing");

    assert.equal(await experience.locator(`[data-experience-choice="${item.answer}"]`).count(), 1, `${item.id}: Book 2 approved answer is not unique`);
    await experience.locator(`[data-experience-choice="${item.wrong}"]`).click();
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: Book 2 wrong answer unlocked original`);
    await experience.locator("[data-experience-answer]").click();
    assert.match(await experience.locator(".feedback").innerText(), new RegExp(`답:\\s*${item.answer}`, "u"), `${item.id}: Book 2 answer view missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${item.id}: Book 2 answer view did not unlock original`);

    const typography = await experience.locator(".experience-caption, .guided-check>p, .guided-check .answer-choices button, .guided-answer, .concept-hint").evaluateAll((nodes) => nodes.map((node) => ({
      fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
      height: node.matches("button") ? node.getBoundingClientRect().height : null
    })));
    assert.ok(typography.every(({ fontSize }) => fontSize >= 14), `${item.id}: Book 2 guided text is too small: ${JSON.stringify(typography)}`);
    assert.ok(typography.filter(({ height }) => height != null).every(({ height }) => height >= 40), `${item.id}: Book 2 guided touch target is too small: ${JSON.stringify(typography)}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false, `${item.id}: Book 2 mobile horizontal overflow`);

    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printLessonButton").click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator(".guided-print-summary").count(), 1, `${item.id}: Book 2 guided print summary missing`);
    assert.equal(await page.locator(".guided-print-summary button, .guided-print-summary input, .guided-print-summary select").count(), 0, `${item.id}: Book 2 print contains controls`);
    await page.close();
  }
  return cases.length;
}

async function auditBookThreeGuidedConcepts() {
  const readCryptarithmColumns = (experience) => experience.locator(".guided-cryptarithm-stack").evaluate((stack) => {
    const centerX = (node) => {
      const rect = node.getBoundingClientRect();
      return rect.left + rect.width / 2;
    };
    const addends = [...stack.querySelectorAll(".guided-cryptarithm-addend .guided-cryptarithm-cell")].map(centerX);
    const carry = centerX(stack.querySelector(".guided-cryptarithm-carry .guided-cryptarithm-cell"));
    const results = [...stack.querySelectorAll(".guided-cryptarithm-result .guided-cryptarithm-cell")].map(centerX);
    const plus = centerX([...stack.querySelectorAll(".guided-cryptarithm-addend b")].at(-1));
    return { addends, carry, results, plus };
  });
  const assertCryptarithmColumns = (columns, phase) => {
    const close = (a, b) => Math.abs(a - b) <= 1;
    assert.ok(columns.addends.every((x) => close(x, columns.results[1])), `Book 3 ${phase} addends are not aligned to the ones column: ${JSON.stringify(columns)}`);
    assert.ok(close(columns.carry, columns.results[0]), `Book 3 ${phase} carry is not aligned to the tens column: ${JSON.stringify(columns)}`);
    assert.ok(columns.plus < columns.results[0] - 10, `Book 3 ${phase} plus sign overlaps the tens column: ${JSON.stringify(columns)}`);
  };
  const cases = [
    { id: "six-multiple-equations", family: "six-bundle-equation", wrong: "14", answer: "16", visual: ".guided-six-bundle-visual" },
    { id: "multiple-comparison", family: "multiple-direction", wrong: "5", answer: "4", visual: ".guided-multiple-visual" },
    { id: "basic-vertical-cryptarithm", family: "vertical-cryptarithm-carry", wrong: "3", answer: "5", visual: ".guided-cryptarithm-visual" },
    { id: "magic-square-targets", family: "magic-line-target", wrong: "4", answer: "2", visual: ".guided-magic-visual" }
  ];

  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=GUIDED-BOOK3-${item.id}&book=book-03`, { waitUntil: "networkidle" });
    await page.locator(`.lesson-button[data-lesson="${item.id}"]`).click();
    const experience = page.locator(`.guided-concept[data-guided-family="${item.family}"]`);
    assert.equal(await experience.count(), 1, `${item.id}: Book 3 guided concept missing`);
    assert.equal(await experience.locator(item.visual).count(), 1, `${item.id}: Book 3 guided visual missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: Book 3 original must start locked`);
    assert.equal(await experience.locator(".guided-check").count(), 0, `${item.id}: Book 3 check appeared early`);
    if (item.id === "six-multiple-equations") {
      assert.equal(await experience.locator(".guided-six-bundle").count(), 4, "Book 3 six first beat needs four bundles");
      assert.equal(await experience.locator(".guided-six-bundle i").count(), 24, "Book 3 six first beat needs six dots in every bundle");
      const firstBeatOverflow = await experience.locator(".guided-six-bundle").evaluateAll((nodes) => nodes.filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1).length);
      assert.equal(firstBeatOverflow, 0, "Book 3 six first-beat dots overflow their bundle boxes");
    }
    if (item.id === "basic-vertical-cryptarithm") {
      for (let step = 0; step < 2; step += 1) await experience.locator('[data-experience-action="next"]').click();
      assertCryptarithmColumns(await readCryptarithmColumns(experience), "carry");
      await experience.locator('[data-experience-action="next"]').click();
    } else {
      for (let step = 0; step < 3; step += 1) await experience.locator('[data-experience-action="next"]').click();
    }
    assert.equal(await experience.locator(".guided-check").count(), 1, `${item.id}: Book 3 final check missing`);

    if (item.id === "six-multiple-equations") {
      assert.equal(await experience.locator(".guided-six-bundle").count(), 6, "Book 3 six visual needs six bundles");
      assert.equal(await experience.locator(".guided-six-bundle i").count(), 36, "Book 3 six final beat needs six dots in every bundle");
      const finalBeatOverflow = await experience.locator(".guided-six-bundle").evaluateAll((nodes) => nodes.filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1).length);
      assert.equal(finalBeatOverflow, 0, "Book 3 six final-beat dots overflow their bundle boxes");
      assert.match(await experience.innerText(), /24\s*\+\s*12\s*=\s*36/u, "Book 3 six final equation missing");
    }
    if (item.id === "multiple-comparison") {
      const widths = await experience.locator(".guided-multiple-unit, .guided-multiple-comparison").evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
      assert.ok(widths[1] > widths[0], `Book 3 comparison bar is not wider: ${widths.join(",")}`);
      assert.match(await experience.innerText(), /12\s*÷\s*3\s*=\s*4/u, "Book 3 multiple final equation missing");
    }
    if (item.id === "basic-vertical-cryptarithm") {
      assert.equal(await experience.locator(".guided-cryptarithm-addend").count(), 3, "Book 3 cryptarithm needs three addends");
      assert.match(await experience.innerText(), /4\s*\+\s*4\s*\+\s*4\s*=\s*12/u, "Book 3 cryptarithm equation missing");
      assertCryptarithmColumns(await readCryptarithmColumns(experience), "verify");
    }
    if (item.id === "magic-square-targets") {
      assert.equal(await experience.locator(".guided-magic-grid span").count(), 9, "Book 3 magic square needs nine cells");
      assert.match(await experience.innerText(), /3/u, "Book 3 magic target missing");
    }

    assert.equal(await experience.locator(`[data-experience-choice="${item.answer}"]`).count(), 1, `${item.id}: Book 3 approved answer is not unique`);
    await experience.locator(`[data-experience-choice="${item.wrong}"]`).click();
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${item.id}: Book 3 wrong answer unlocked original`);
    await experience.locator("[data-experience-answer]").click();
    assert.match(await experience.locator(".feedback").innerText(), new RegExp(`답:\\s*${item.answer}`, "u"), `${item.id}: Book 3 answer view missing`);
    assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${item.id}: Book 3 answer view did not unlock original`);

    const typography = await experience.locator(".experience-caption, .guided-check>p, .guided-check .answer-choices button, .guided-answer, .concept-hint").evaluateAll((nodes) => nodes.map((node) => ({
      fontSize: Number.parseFloat(getComputedStyle(node).fontSize),
      height: node.matches("button") ? node.getBoundingClientRect().height : null
    })));
    assert.ok(typography.every(({ fontSize }) => fontSize >= 14), `${item.id}: Book 3 guided text is too small: ${JSON.stringify(typography)}`);
    assert.ok(typography.filter(({ height }) => height != null).every(({ height }) => height >= 40), `${item.id}: Book 3 guided touch target is too small: ${JSON.stringify(typography)}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${item.id}: Book 3 mobile horizontal overflow`);

    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printLessonButton").click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator(".guided-print-summary").count(), 1, `${item.id}: Book 3 guided print summary missing`);
    assert.equal(await page.locator(".guided-print-summary button, .guided-print-summary input, .guided-print-summary select").count(), 0, `${item.id}: Book 3 print contains controls`);
    await page.close();
  }
  return cases.length;
}

async function auditInteractiveTriangularStair() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=TRIANGULAR-AUDIT&book=book-05`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="cube-tetrahedral-growth"]').click();
  const experience = page.locator(".concept-experience-stair");
  assert.equal(await experience.count(), 1, "triangular stair experience missing");
  const typeStudy = page.locator(".type-study");
  assert.equal(await typeStudy.count(), 1, "triangle and square type study missing");
  assert.equal(await typeStudy.locator("[data-type-track-select]").count(), 7, "source-backed number-rule types must stay separate");
  for (let index = 0; index < 7; index += 1) {
    const trackButton = typeStudy.locator("[data-type-track-select]").nth(index);
    await trackButton.click();
    const panel = page.locator(".type-track-panel");
    assert.ok((await panel.locator("h3").innerText()).trim(), `type track ${index + 1} label missing`);
    assert.equal(await panel.locator(".type-track-question").count(), 1, `type track ${index + 1} check missing`);
    await panel.locator('[data-type-track-answer][data-type-track-stage="check"]').click();
    assert.equal(await panel.locator(".type-track-question").count(), 2, `type track ${index + 1} practice did not unlock after check`);
    await panel.locator('[data-type-track-answer][data-type-track-stage="practice"]').click();
    assert.match(await panel.innerText(), /답:/u, `type track ${index + 1} approved answer view missing`);
  }
  assert.match(await typeStudy.locator("header").first().innerText(), /7\s*\/\s*7/, "type-study completion count missing");
  assert.equal((await typeStudy.innerText()).includes("20"), false, "type study leaked the original fourth-stage answer");
  assert.equal((await typeStudy.innerText()).includes("84"), false, "type study leaked the original seventh-stage answer");
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "1", "triangular stair must start at the first layer");
  assert.match(await experience.locator(":scope > header").innerText(), /개념 설명/, "triangular scene must be labelled as an explanation");
  assert.equal(await experience.locator(".experience-stair [data-experience-choice]").count(), 0, "triangular explanation must not contain a quiz");
  await page.waitForTimeout(2900);
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "3", "triangular explanation did not autoplay through the third layer");
  assert.match(await experience.locator(".experience-stair-ledger").innerText(), /10개/, "triangular explanation did not reveal the third-stage total");
  const stageCheck = experience.locator(".experience-stage-check");
  assert.match(await stageCheck.locator("header").innerText(), /1층/, "first separate layer check missing");
  await stageCheck.locator('[data-experience-choice="1"]').click();
  assert.match(await stageCheck.locator(".experience-check .feedback").innerText(), /맞아요/, "first triangular layer rejected the approved answer");
  assert.equal(await experience.locator(".experience-success-burst.show").count(), 1, "triangular layer success burst missing");
  await stageCheck.locator('[data-experience-action="next-check"]').click();
  assert.match(await stageCheck.locator("header").innerText(), /2층/, "second separate layer check missing");
  await stageCheck.locator('[data-experience-choice="2"]').click();
  assert.match(await stageCheck.locator(".experience-check .feedback").innerText(), /다시 세어/, "wrong layer answer did not keep the learner in the current check");
  assert.equal(await stageCheck.locator('[data-experience-action="next-check"]').count(), 0, "wrong layer answer unlocked the next check");
  await stageCheck.locator('[data-experience-choice="3"]').click();
  await stageCheck.locator('[data-experience-action="next-check"]').click();
  assert.match(await stageCheck.locator("header").innerText(), /3층/, "third separate layer check missing");
  await stageCheck.locator('[data-experience-choice="6"]').click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, "original source problem unlocked before concept practice");
  const practiceCards = experience.locator(".concept-practice-card");
  assert.equal(await practiceCards.count(), 3, "triangular and square concept practice cards missing");
  for (let index = 0; index < 3; index += 1) await practiceCards.nth(index).locator("[data-concept-practice-answer]").click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, "answer-view completion did not unlock the original source problem");
  assert.equal(await practiceCards.nth(0).locator(".feedback").innerText().then((text) => text.includes("답: 6")), true, "concept answer view did not reveal the approved practice answer");
  const fontSizes = await page.locator(".type-track-question>p, .type-track-question .answer-choices button, .experience-check>p, .concept-practice-card>p, .concept-practice-card .answer-choices button").evaluateAll((nodes) => nodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)));
  assert.ok(fontSizes.length > 0 && fontSizes.every((size) => size >= 14), `course-1 triangular learning text is too small: ${fontSizes.join(",")}`);
  await page.locator('.stage-step[data-phase="original"]').click();
  const originalItems = page.locator("[data-original-item]");
  assert.equal(await originalItems.count(), 2, "triangular source questions must stay as two separate items");
  assert.equal(await originalItems.locator("[data-original-answer]").count(), 2, "each source question needs its own answer-view action");
  assert.equal(await originalItems.locator("[data-original-skip]").count(), 2, "each source question needs its own skip action");
  await originalItems.nth(0).locator("[data-input-group]").fill("19");
  await originalItems.nth(1).locator("[data-original-skip]").click();
  const originalCheck = page.locator('[data-check="original"]');
  assert.equal(await originalCheck.isDisabled(), false, "manual answer and skip did not resolve the source questions");
  await originalCheck.click();
  assert.match(await page.locator(".feedback:not(.success)").innerText(), /1문제를 다시/u, "wrong manual answer incorrectly passed");
  assert.equal(await originalCheck.innerText(), "확인", "wrong manual answer unlocked the next step");
  await originalItems.nth(0).locator("[data-original-answer]").click();
  assert.equal(await originalItems.nth(0).locator("[data-input-group]").inputValue(), "20", "approved fourth-stage answer was not filled");
  assert.match(await originalItems.nth(0).locator(".quiz-item-assist").innerText(), /정답:\s*20/u, "approved answer note missing");
  assert.match(await originalItems.nth(1).locator(".quiz-item-assist").innerText(), /넘어간 문제/u, "skipped source question note missing");
  assert.equal((await originalItems.nth(1).innerText()).includes("84"), false, "skipping must not reveal the approved seventh-stage answer");
  assert.equal(await originalCheck.isDisabled(), false, "answer-view and skip did not resolve the source questions");
  await originalCheck.click();
  assert.match(await page.locator(".feedback.success").innerText(), /답을 본 1문제, 넘어간 1문제/u, "assisted completion summary missing");
  assert.equal(await originalCheck.innerText(), "다음", "resolved source questions did not unlock the next step");
  const originalProgress = await page.evaluate(() => JSON.parse(localStorage.getItem("fields-classic-golden-bell:TRIANGULAR-AUDIT")));
  const savedLesson = originalProgress["book-05"]["cube-tetrahedral-growth"];
  assert.equal(savedLesson.outcomes.original["stair-four"].status, "revealed", "answer-view outcome was not saved");
  assert.equal(savedLesson.outcomes.original["stair-four"].wrongCount, 1, "wrong attempt history was not preserved");
  assert.equal(savedLesson.outcomes.original["stair-seven"].status, "skipped", "skip outcome was not saved");
  const assistFontSizes = await page.locator(".quiz-item-actions button, .quiz-item-assist").evaluateAll((nodes) => nodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)));
  assert.ok(assistFontSizes.every((size) => size >= 14), `source-question assist text is too small: ${assistFontSizes.join(",")}`);
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printLessonButton").click();
  await page.waitForTimeout(100);
  const printedConcept = page.locator(".gold-print-triangular-experience");
  assert.equal(await printedConcept.count(), 1, "triangular instructional print still missing");
  assert.equal(await printedConcept.locator("button, select, input").count(), 0, "triangular print must not contain interactive controls");
  assert.equal((await printedConcept.innerText()).includes("20개"), false, "triangular print leaked the original fourth-stage answer");
  await originalCheck.click();
  const extensionInput = page.locator('[data-input-group="cube-tetrahedral-growth:extension"]');
  await extensionInput.fill("35");
  const extensionCheck = page.locator('[data-check="extension"]');
  await extensionCheck.click();
  assert.equal(await extensionCheck.innerText(), "완료", "correct extension answer did not unlock completion");
  await extensionCheck.click();
  const learningRecord = page.locator(".learning-record");
  assert.match(await learningRecord.innerText(), /혼자 해결\s*1/u, "independent completion count missing");
  assert.match(await learningRecord.innerText(), /답 확인\s*1/u, "answer-view completion count missing");
  assert.match(await learningRecord.innerText(), /넘어감\s*1/u, "skip completion count missing");
  assert.match(await learningRecord.innerText(), /다시 볼 문항\s*2/u, "review count missing");
  const reviewLink = learningRecord.locator("a");
  assert.equal(new URL(await reviewLink.getAttribute("href"), page.url()).searchParams.get("types"), "cube-tetrahedral-growth", "review type link missing the source type id");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, "triangular concept experience mobile overflow");
  await page.close();
}

try {
  const desktopLessons = await auditViewport({ width: 1440, height: 1050 }, "desktop");
  const mobileLessons = await auditViewport({ width: 390, height: 844 }, "mobile");
  const geometryLabels = await auditGeometryAndPrint();
  await auditExtensionControls();
  await auditInteractiveClock();
  await auditReducedMotionClock();
  const guidedConcepts = await auditBookOneGuidedConcepts();
  const bookTwoGuidedConcepts = await auditBookTwoGuidedConcepts();
  const bookThreeGuidedConcepts = await auditBookThreeGuidedConcepts();
  await auditInteractiveTriangularStair();
  console.log(`GOLDEN_BELL_BROWSER_OK desktop=${desktopLessons} mobile=${mobileLessons} geometryLabels=${geometryLabels} extensionControls=pass clockExperience=pass guidedConcepts=${guidedConcepts} bookTwoGuidedConcepts=${bookTwoGuidedConcepts} bookThreeGuidedConcepts=${bookThreeGuidedConcepts} triangularExperience=pass reducedMotion=pass printPages=8`);
} finally {
  await browser.close();
}
