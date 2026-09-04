import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const qaDirectory = process.env.BOOK02_QA_DIR || "";
const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-02");
assert.ok(book, "book-02 is missing");

async function unlockConcept(page, lesson) {
  const experience = page.locator(".guided-concept");
  assert.equal(await experience.count(), 1, `${lesson.id}: guided concept missing`);
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${lesson.id}: source questions must begin locked`);
  for (let step = 1; step < lesson.experience.beats.length; step += 1) {
    await experience.locator('[data-experience-action="next"]').click();
  }
  assert.equal(await experience.locator(".guided-check").count(), 1, `${lesson.id}: final concept check missing`);
  await experience.locator("[data-experience-answer]").click();
  assert.match(await experience.locator(".feedback").innerText(), /답:/u, `${lesson.id}: concept answer view missing`);
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${lesson.id}: concept completion did not unlock questions`);
}

async function auditViewport(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK02-${label}&book=book-02`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".lesson-button").count(), 18, `${label}: lesson navigation must contain 18 source lessons`);

  let checkedItems = 0;
  for (const lesson of book.lessons) {
    await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
    await unlockConcept(page, lesson);
    const conceptOverflow = await page.locator(".guided-concept-scene").evaluate((node) => node.scrollWidth > node.clientWidth + 1);
    assert.equal(conceptOverflow, false, `${label}/${lesson.id}: concept visual overflows`);
    await page.locator('.stage-step[data-phase="original"]').click();

    for (const [index, item] of lesson.original.items.entries()) {
      const card = page.locator(`[data-original-item="${item.id}"]`);
      assert.equal(await card.count(), 1, `${label}/${lesson.id}/${item.id}: source item is not displayed in order`);
      const expectedInputs = item.parts?.length || 1;
      assert.equal(await card.locator('[data-answer-scope="original"]').count(), expectedInputs, `${label}/${lesson.id}/${item.id}: answer fields are not directly below the item`);
      assert.equal(await card.locator("[data-original-answer]").count(), 1, `${label}/${lesson.id}/${item.id}: worked-solution control missing`);
      assert.equal(await card.locator("[data-original-skip]").count(), 1, `${label}/${lesson.id}/${item.id}: skip control missing`);
      assert.equal(await card.locator(".quiz-item-solution").count(), 0, `${label}/${lesson.id}/${item.id}: solution leaked before request`);
      const visual = page.locator(".source-question-card .book02-visual");
      assert.equal(await visual.count(), 1, `${label}/${lesson.id}/${item.id}: visual missing`);
      const visualOverflow = await visual.evaluate((node) => node.scrollWidth > node.clientWidth + 1);
      assert.equal(visualOverflow, false, `${label}/${lesson.id}/${item.id}: source visual overflows horizontally`);
      await card.locator("[data-original-answer]").click();
      const solution = page.locator(".quiz-item-solution");
      assert.equal(await solution.count(), 1, `${label}/${lesson.id}/${item.id}: worked solution did not open`);
      assert.ok((await solution.locator("p").innerText()).trim().length >= 24, `${label}/${lesson.id}/${item.id}: worked solution is too short`);
      checkedItems += 1;
      if (index < lesson.original.items.length - 1) {
        const next = page.locator('[data-check="original"]');
        assert.equal(await next.isDisabled(), false, `${label}/${lesson.id}/${item.id}: next question remains locked after solution view`);
        await next.click();
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${lesson.id}: page overflows horizontally`);
  }
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
  return checkedItems;
}

async function captureEvidence(browser) {
  if (!qaDirectory) return;
  await mkdir(qaDirectory, { recursive: true });

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await desktop.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK02-QA-DESKTOP&book=book-02`, { waitUntil: "networkidle" });
  const matrix = book.lessons.find((lesson) => lesson.id === "addition-matrix");
  await desktop.locator('.lesson-button[data-lesson="addition-matrix"]').click();
  await unlockConcept(desktop, matrix);
  await desktop.locator('.stage-step[data-phase="original"]').click();
  await desktop.locator("#lessonContent").screenshot({ path: path.join(qaDirectory, "book02-desktop-matrix.png") });
  await desktop.evaluate(() => { window.print = () => {}; });
  await desktop.locator("#printLessonButton").click();
  await desktop.emulateMedia({ media: "print" });
  await desktop.locator(".gold-print-page").first().screenshot({ path: path.join(qaDirectory, "book02-a4-matrix.png") });
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK02-QA-MOBILE&book=book-02`, { waitUntil: "networkidle" });
  const sudoku = book.lessons.find((lesson) => lesson.id === "sudoku");
  await mobile.locator('.lesson-button[data-lesson="sudoku"]').click();
  await unlockConcept(mobile, sudoku);
  await mobile.locator('.stage-step[data-phase="original"]').click();
  for (let index = 0; index < 5; index += 1) {
    await mobile.locator("[data-original-skip]").click();
    await mobile.locator('[data-check="original"]').click();
  }
  await mobile.locator("#lessonContent").screenshot({ path: path.join(qaDirectory, "book02-mobile-sudoku.png") });
  await mobile.close();
}

const browser = await chromium.launch({ headless: true });
try {
  const desktopItems = await auditViewport(browser, { width: 1440, height: 1050 }, "desktop");
  const mobileItems = await auditViewport(browser, { width: 390, height: 844 }, "mobile");
  await captureEvidence(browser);
  console.log(`BOOK02_GOLDEN_BELL_BROWSER_OK lessons=18 desktopItems=${desktopItems} mobileItems=${mobileItems} controls=pass overflow=pass`);
} finally {
  await browser.close();
}
