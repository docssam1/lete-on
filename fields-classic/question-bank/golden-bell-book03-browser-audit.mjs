import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const runtimeModules = process.env.CODEX_NODE_MODULES || process.env.NODE_PATH;
assert.ok(runtimeModules, "Set CODEX_NODE_MODULES to the shared Node dependency directory");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const qaDirectory = process.env.BOOK03_QA_DIR || "";
const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-03");
assert.ok(book, "book-03 is missing");
assert.equal(book.lessons.length, 13, "Book3 must expose 13 lessons");
const expectedSourceItems = book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0);
const heldConflictCount = book.sourceCoverage.filter((entry) => entry.status === "implemented-with-hold").reduce((sum, entry) => sum + entry.holdCount, 0);
const qaFractionItems = new Set(["fraction-8", "fraction-11", "fraction-17", "fraction-18", "partition-3", "partition-9"]);
assert.ok(heldConflictCount >= 1, "Book3 must retain source conflicts as held items");

function errorsFor(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  return errors;
}

async function unlockConcept(page, lesson) {
  const experience = page.locator(".progressive-concept, .guided-concept");
  assert.equal(await experience.count(), 1, `${lesson.id}: concept experience missing`);
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), true, `${lesson.id}: source opened before concept completion`);
  const steps = lesson.experience.beats.length;
  for (let index = 1; index < steps; index += 1) {
    const next = experience.locator('[data-experience-action="next"]');
    assert.equal(await next.count(), 1, `${lesson.id}: concept next action missing at ${index}`);
    await next.click();
  }
  assert.equal(await experience.locator(".progressive-check, .guided-check").count(), 1, `${lesson.id}: final concept check missing`);
  assert.equal(await experience.locator("[data-experience-answer]").count(), 1, `${lesson.id}: concept answer-view missing`);
  await experience.locator("[data-experience-answer]").click();
  assert.match(await experience.locator(".feedback").innerText(), /답:/u, `${lesson.id}: concept answer feedback missing`);
  assert.equal(await page.locator('.stage-step[data-phase="original"]').isDisabled(), false, `${lesson.id}: source did not unlock`);
}

async function auditLesson(page, lesson, label) {
  await page.locator(`.lesson-button[data-lesson="${lesson.id}"]`).click();
  await unlockConcept(page, lesson);
  const concept = page.locator(".progressive-concept, .guided-concept");
  assert.equal(await concept.locator(".progressive-visual, .guided-concept-scene").count(), 1, `${label}/${lesson.id}: concept visual missing`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${lesson.id}: page horizontal overflow after concept`);
  await page.locator('.stage-step[data-phase="original"]').click();
  const sourceItems = page.locator("[data-original-item]");
  assert.equal(await sourceItems.count(), 1, `${label}/${lesson.id}: current source item count mismatch`);
  for (const [index, item] of lesson.original.items.entries()) {
    const sourceCard = page.locator(".source-question-card");
    assert.equal(await sourceCard.count(), 1, `${label}/${lesson.id}/${item.id}: source question card missing`);
    const card = page.locator(`[data-original-item="${item.id}"]`);
    assert.equal(await card.count(), 1, `${label}/${lesson.id}/${item.id}: item missing`);
    assert.ok((await card.innerText()).trim().length > 12, `${label}/${lesson.id}/${item.id}: item text missing`);
    assert.equal(await card.locator('[data-answer-scope="original"]').count(), item.parts?.length || 1, `${label}/${lesson.id}/${item.id}: individual answer field missing`);
    assert.equal(await card.locator("[data-original-answer]").count(), 1, `${label}/${lesson.id}/${item.id}: answer-view missing`);
    assert.equal(await card.locator("[data-original-skip]").count(), 1, `${label}/${lesson.id}/${item.id}: skip action missing`);
    assert.equal(await card.locator(".quiz-item-solution").count(), 0, `${label}/${lesson.id}/${item.id}: solution leaked before request`);
    const visual = sourceCard.locator(".quiz-visual");
    assert.equal(await visual.count(), 1, `${label}/${lesson.id}/${item.id}: item visual missing`);
    assert.equal(await visual.evaluate((node) => node.scrollWidth > node.clientWidth + 1), false, `${label}/${lesson.id}/${item.id}: item visual overflow`);
    assert.ok((await visual.innerHTML()).trim().length > 40, `${label}/${lesson.id}/${item.id}: item visual rendered empty`);
    if (qaDirectory && label === "desktop" && qaFractionItems.has(item.id)) {
      await mkdir(qaDirectory, { recursive: true });
      await sourceCard.screenshot({ path: path.join(qaDirectory, `book03-${item.id}.png`) });
    }
    await card.locator("[data-original-answer]").click();
    assert.equal(await card.locator(".quiz-item-solution").count(), 1, `${label}/${lesson.id}/${item.id}: solution did not open`);
    assert.ok((await card.locator(".quiz-item-solution").innerText()).trim().length >= 20, `${label}/${lesson.id}/${item.id}: solution is too short`);
    if (index < lesson.original.items.length - 1) {
      const next = page.locator('[data-check="original"]');
      assert.equal(await next.isDisabled(), false, `${label}/${lesson.id}/${item.id}: next source item remains locked`);
      await next.click();
    }
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}/${lesson.id}: source horizontal overflow`);
}

async function auditViewport(browser, viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK03-${label}&book=book-03`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".lesson-button").count(), 13, `${label}: lesson navigation count mismatch`);
  for (const lesson of book.lessons) await auditLesson(page, lesson, label);
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  if (qaDirectory) {
    await mkdir(qaDirectory, { recursive: true });
    await page.locator("#lessonContent").screenshot({ path: path.join(qaDirectory, `book03-${label}.png`) });
  }
  await page.close();
}

async function auditPrint(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = errorsFor(page);
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK03-PRINT&book=book-03`, { waitUntil: "networkidle" });
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printBookButton").click();
  await page.waitForTimeout(120);
  const pages = page.locator(".gold-print-page");
  const expected = book.lessons.reduce((sum, lesson) => sum + (lesson.original.mode === "paged" ? new Set(lesson.original.items.map((item) => item.printGroup)).size : 1) + 2, 0);
  assert.equal(await pages.count(), expected, "Book3 print page count mismatch");
  await page.emulateMedia({ media: "screen" });
  const bounds = await pages.evaluateAll((nodes) => nodes.map((node) => {
    const pageRect = node.getBoundingClientRect();
    const footer = node.querySelector(":scope > .gold-print-footer");
    const contentBottom = Array.from(node.children).filter((child) => !child.classList.contains("gold-print-footer")).reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom), pageRect.top);
    return { lesson: node.dataset.printLesson, part: node.dataset.printPart, width: node.scrollWidth, clientWidth: node.clientWidth, height: pageRect.height, footerTop: (footer?.getBoundingClientRect().top ?? pageRect.bottom) - pageRect.top, contentBottom: contentBottom - pageRect.top };
  }));
  const visibleBounds = bounds.filter(({ width, clientWidth, height }) => width > 0 && clientWidth > 0 && height > 0);
  assert.deepEqual(visibleBounds.filter(({ width, clientWidth }) => width > clientWidth + 1), [], "Book3 print page horizontal overflow");
  assert.deepEqual(visibleBounds.filter(({ height }) => height > 1022), [], "Book3 print page exceeds A4 content height");
  assert.deepEqual(visibleBounds.filter(({ contentBottom, footerTop }) => contentBottom > footerTop - 2), [], "Book3 print content overlaps footer");
  await page.emulateMedia({ media: "print" });
  const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
  assert.ok(pdfBytes.length > 10000, "Book3 print PDF is empty");
  assert.deepEqual(errors, [], `print browser errors: ${errors.join(" | ")}`);
  if (qaDirectory) {
    await mkdir(qaDirectory, { recursive: true });
    await pages.first().screenshot({ path: path.join(qaDirectory, "book03-a4.png") });
  }
  const pageCount = await pages.count();
  await page.close();
  return { pages: pageCount, pdfBytes: pdfBytes.length };
}

const browser = await chromium.launch({ headless: true });
try {
  await auditViewport(browser, { width: 1440, height: 1000 }, "desktop");
  await auditViewport(browser, { width: 390, height: 844 }, "mobile");
  const print = await auditPrint(browser);
  console.log(`BOOK03_GOLDEN_BELL_BROWSER_OK lessons=13 sourceItems=${expectedSourceItems} held=${heldConflictCount} desktop=pass mobile=pass printPages=${print.pages} pdfBytes=${print.pdfBytes} controls=pass overflow=pass errors=0`);
} finally {
  await browser.close();
}
