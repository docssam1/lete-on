import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { CURRICULUM } from "./source-data.js";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR || "";
const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const book = CURRICULUM.find((item) => item.id === "book-06");
const inventory = book?.source?.unitTestQuestions || [];
const expected = inventory.filter((item) => item.verified);

assert.ok(book, "Book 6 curriculum is missing");
assert.equal(inventory.length, 25, "Book 6 source inventory must contain 25 questions");
assert.equal(expected.length, 25, "Book 6 unit-test questions must all be verified");
if (output) await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum`, { waitUntil: "networkidle" });
    await page.locator('[data-curriculum-book="book-06"]').click();

    const rows = page.locator('input[data-unit-test-key^="book-06:"]');
    assert.equal(await rows.count(), 25, "All Book 6 source questions must be listed");
    assert.equal(await page.locator(".unit-test-question.not-ready").count(), 0, "Book 6 must not expose held unit-test rows");

    const firstRow = page.locator('[data-unit-test-key="book-06:1"]').locator("xpath=..");
    await firstRow.scrollIntoViewIfNeeded();
    if (width === 390) {
      await firstRow.locator("[data-touch-preview]").click();
      assert.equal(await page.locator('[data-unit-test-key="book-06:1"]').isChecked(), false, "Opening a touch preview must not select its question");
    } else {
      await firstRow.hover();
    }
    await page.locator("#typePreview").waitFor({ state: "visible" });
    assert.ok(await page.locator("#typePreview .book06-visual").count(), "The source preview must contain its Book 6 diagram");
    await page.keyboard.press("Escape");

    const enabledKeys = await rows.evaluateAll((nodes) => nodes.map((node) => node.dataset.unitTestKey));
    for (const key of enabledKeys) await page.locator(`[data-unit-test-key="${key}"]`).check();
    await page.locator("#questionCount").fill(String(expected.length));
    await page.locator("#questionCount").dispatchEvent("change");
    await page.locator("#buildButton").click();
    await page.locator("#worksheetSection").waitFor({ state: "visible" });

    const cards = page.locator(".question-card");
    assert.equal(await cards.count(), 25, "Book 6 worksheet must contain all 25 selected questions");
    assert.deepEqual(
      await cards.evaluateAll((nodes) => nodes.map((node) => node.dataset.typeId)),
      expected.map((item) => item.typeId),
      "Book 6 worksheet order must follow the source test"
    );
    assert.doesNotMatch(await cards.allTextContents().then((texts) => texts.join(" ")), /undefined|NaN|\[object Object\]/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "The worksheet must not overflow the viewport");

    const layout = await cards.evaluateAll((nodes) => nodes.map((card, index) => {
      const visual = card.querySelector(".book06-visual");
      const cardRect = card.getBoundingClientRect();
      const visualRect = visual?.getBoundingClientRect();
      const visibleChild = visual?.querySelector("svg, .b6-ut, .b6-expression, .b6-book-pages, .b6-digit-range, .b6-digit-focus, .b6-operator-row");
      const childRect = visibleChild?.getBoundingClientRect();
      return {
        number: index + 1,
        prompt: card.querySelector(".question-prompt")?.textContent?.trim() || "",
        hasVisual: Boolean(visual),
        visualMarkup: visual?.innerHTML.trim().length || 0,
        visualWidth: visualRect?.width || 0,
        visualHeight: visualRect?.height || 0,
        visibleChild: Boolean(childRect && childRect.width > 20 && childRect.height > 20),
        horizontalOverflow: card.scrollWidth > card.clientWidth + 2,
        visualOutsideCard: Boolean(visualRect && (visualRect.left < cardRect.left - 2 || visualRect.right > cardRect.right + 2))
      };
    }));
    assert.deepEqual(layout.filter((item) => !item.prompt).map((item) => item.number), [], "Every Book 6 question needs a prompt");
    assert.deepEqual(layout.filter((item) => !item.hasVisual || item.visualMarkup < 10).map((item) => item.number), [], "Every Book 6 question needs a diagram");
    assert.deepEqual(layout.filter((item) => item.visualWidth < 100 || item.visualHeight < 70 || !item.visibleChild).map((item) => item.number), [], "Every Book 6 diagram must be visibly sized");
    assert.deepEqual(layout.filter((item) => item.horizontalOverflow || item.visualOutsideCard).map((item) => item.number), [], "Book 6 cards and diagrams must stay inside their columns");

    const card = (number) => cards.nth(number - 1);
    assert.equal(await card(1).locator(".b6-ut-lines svg").count(), 2);
    assert.equal(await card(2).locator(".b6-ut-split").count(), 1);
    assert.equal(await card(3).locator(".b6-ut-measure p").count(), 2);
    assert.equal(await card(6).locator(".b6-ut-symbol").count(), 1);
    for (const number of [7, 8, 9, 10, 11, 12]) assert.equal(await card(number).locator(".b6-ut-geometry").count(), 1, `Book 6 q${number} geometry is missing`);
    assert.equal(await card(19).locator(".b6-ut-signs p").count(), 3);
    assert.equal(await card(21).locator(".b6-ut-signs p").count(), 2);
    assert.equal(await card(22).locator(".b6-ut-scale").count(), 3);
    assert.equal(await card(22).locator(".b6-ut-scale .pan").count(), 6);
    assert.equal(await card(22).locator(".pan-token.star").count(), 1);
    assert.match(await card(22).locator(".question-prompt").innerText(), /별.*네모/);
    assert.match(await card(22).locator(".b6-ut-balance-chain>strong").innerText(), /★\s*=\s*■/);
    assert.equal(await card(23).locator(".b6-ut-fold-desktop").count(), 1);
    assert.equal(await card(23).locator(".b6-ut-fold-mobile").count(), 1);
    assert.match(await card(23).locator(".question-prompt").innerText(), /대각선/);
    assert.doesNotMatch(await card(23).locator(".question-prompt").innerText(), /가로와 세로로 반씩/);
    const openedSquare = await card(23).locator(".opened-square:visible").boundingBox();
    assert.ok(openedSquare && Math.abs(openedSquare.width - openedSquare.height) < 2, "Book 6 q23 must open into a square");
    assert.equal(await card(25).locator(".b6-ut-measure p").count(), 2);

    assert.equal(await page.locator("#worksheetPrintMode").inputValue(), "questions-with-compact");
    assert.equal(await page.locator(".compact-answer-page").count(), 2, "Book 6 quick answers must use two pages");
    assert.deepEqual(
      await page.locator(".compact-answer-item").evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.compactAnswerNumber))),
      Array.from({ length: 25 }, (_, index) => index + 1),
      "Book 6 quick-answer numbering must match the worksheet"
    );

    if (output) {
      await page.screenshot({ path: path.join(output, `book-06-unit-worksheet-${width}.png`), fullPage: true });
      await card(22).screenshot({ path: path.join(output, `book-06-q22-balance-${width}.png`) });
      await card(23).screenshot({ path: path.join(output, `book-06-q23-fold-cut-open-${width}.png`) });
    }
    await page.emulateMedia({ media: "print" });
    const questionPdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    const questionPages = (await PDFDocument.load(questionPdf)).getPageCount();
    assert.equal(questionPages, 13, "Book 6 problem-only print must keep two questions per A4 page");
    if (output && width === 1440) await writeFile(path.join(output, "book-06-unit-questions.pdf"), questionPdf);

    let quickAnswerPages = null;
    let combinedPages = null;
    if (width === 1440) {
      await page.evaluate(() => document.body.classList.add("printing-compact"));
      const quickPdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      quickAnswerPages = (await PDFDocument.load(quickPdf)).getPageCount();
      assert.equal(quickAnswerPages, 2, "Book 6 quick answers must print on two A4 pages");
      if (output) await writeFile(path.join(output, "book-06-unit-quick-answers.pdf"), quickPdf);
      await page.evaluate(() => document.body.classList.remove("printing-compact"));

      await page.evaluate(() => document.body.classList.add("printing-with-compact"));
      const combinedPdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      combinedPages = (await PDFDocument.load(combinedPdf)).getPageCount();
      assert.equal(combinedPages, 15, "Book 6 combined print must not add a blank page");
      if (output) await writeFile(path.join(output, "book-06-unit-with-quick-answers.pdf"), combinedPdf);
      await page.evaluate(() => document.body.classList.remove("printing-with-compact"));
    }
    assert.deepEqual(pageErrors, [], `Browser errors: ${pageErrors.join(" | ")}`);
    results.push({ width, questions: 25, questionPages, quickAnswerPages, combinedPages });
    await page.close();
  }
  if (output) await writeFile(path.join(output, "book06-browser-audit.json"), JSON.stringify({ results }, null, 2));
  console.log(`BOOK06_BROWSER_OK ${JSON.stringify({ results })}`);
} finally {
  await browser.close();
}
