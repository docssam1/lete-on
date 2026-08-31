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

async function auditInteractiveTriangularStair() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=TRIANGULAR-AUDIT&book=book-05`, { waitUntil: "networkidle" });
  await page.locator('.lesson-button[data-lesson="cube-tetrahedral-growth"]').click();
  const experience = page.locator(".concept-experience-stair");
  assert.equal(await experience.count(), 1, "triangular stair experience missing");
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "1", "triangular stair must start at the first layer");
  assert.equal(await experience.locator('[data-experience-action="next"]').isDisabled(), true, "triangular stair must require the current layer check before advancing");
  await experience.locator('[data-experience-choice="1"]').click();
  assert.match(await experience.locator(".experience-check .feedback").innerText(), /맞아요/, "first triangular layer rejected the approved answer");
  assert.equal(await experience.locator(".experience-success-burst.show").count(), 1, "triangular layer success burst missing");
  assert.equal(await experience.locator('[data-experience-action="next"]').isDisabled(), false, "triangular stair did not unlock after the current layer answer");
  await experience.locator('[data-experience-action="next"]').click();
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "2", "triangular stair did not build the second layer");
  await page.keyboard.press("End");
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "2", "triangular stair keyboard navigation bypassed the required check");
  await experience.locator('[data-experience-choice="2"]').click();
  assert.match(await experience.locator(".experience-check .feedback").innerText(), /다시 세어/, "wrong layer answer did not keep the learner in the current step");
  assert.equal(await experience.locator('[data-experience-action="next"]').isDisabled(), true, "wrong layer answer unlocked the next step");
  await experience.locator('[data-experience-choice="3"]').click();
  await experience.locator('[data-experience-action="next"]').click();
  assert.equal(await experience.locator(".experience-stair").getAttribute("data-stage"), "3", "triangular stair did not build the third layer");
  await experience.locator('[data-experience-choice="6"]').click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, "original source problem unlocked before concept practice");
  const practiceCards = experience.locator(".concept-practice-card");
  assert.equal(await practiceCards.count(), 3, "triangular and square concept practice cards missing");
  for (let index = 0; index < 3; index += 1) await practiceCards.nth(index).locator("[data-concept-practice-answer]").click();
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, "answer-view completion did not unlock the original source problem");
  assert.equal(await practiceCards.nth(0).locator(".feedback").innerText().then((text) => text.includes("답: 6")), true, "concept answer view did not reveal the approved practice answer");
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printLessonButton").click();
  await page.waitForTimeout(100);
  const printedConcept = page.locator(".gold-print-triangular-experience");
  assert.equal(await printedConcept.count(), 1, "triangular instructional print still missing");
  assert.equal(await printedConcept.locator("button, select, input").count(), 0, "triangular print must not contain interactive controls");
  assert.equal((await printedConcept.innerText()).includes("20개"), false, "triangular print leaked the original fourth-stage answer");
  const fontSizes = await experience.locator(".experience-check>p, .concept-practice-card>p, .concept-practice-card .answer-choices button").evaluateAll((nodes) => nodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)));
  assert.ok(fontSizes.every((size) => size >= 14), `course-1 triangular learning text is too small: ${fontSizes.join(",")}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  assert.equal(overflow, false, "triangular concept experience mobile overflow");
  await page.close();
}

try {
  const desktopLessons = await auditViewport({ width: 1440, height: 1050 }, "desktop");
  const mobileLessons = await auditViewport({ width: 390, height: 844 }, "mobile");
  const geometryLabels = await auditGeometryAndPrint();
  await auditInteractiveClock();
  await auditReducedMotionClock();
  await auditInteractiveTriangularStair();
  console.log(`GOLDEN_BELL_BROWSER_OK desktop=${desktopLessons} mobile=${mobileLessons} geometryLabels=${geometryLabels} clockExperience=pass triangularExperience=pass reducedMotion=pass printPages=8`);
} finally {
  await browser.close();
}
