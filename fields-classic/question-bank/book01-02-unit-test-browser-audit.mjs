import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { BOOK01_02_UNIT_TEST_LINKS } from "./book01-02-unit-test-links.js";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR;
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const [bookId, inventory] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum`, { waitUntil: "networkidle" });
      await page.locator(`[data-curriculum-book="${bookId}"]`).click();
      const expected = inventory.filter((entry) => entry.verified);
      const rows = page.locator("input[data-unit-test-key]");
      assert.equal(await rows.count(), 25, "The entire source inventory must be visible, including held items");
      const enabledKeys = await rows.evaluateAll((nodes) => nodes.filter((node) => !node.disabled).map((node) => node.dataset.unitTestKey));
      assert.deepEqual(enabledKeys, expected.map((entry) => `${bookId}:${entry.number}`));
      assert.equal(await page.locator(".unit-test-question.not-ready").count(), inventory.length - expected.length);
      const list = page.locator(".unit-test-question-list");
      await list.scrollIntoViewIfNeeded();
      if (bookId === "book-02") {
        const matrixCases = [
          { number: 1, rows: 3, columns: 3, target: "column", strategy: /같은 도형 3개인 줄/ },
          { number: 2, rows: 4, columns: 4, target: "row", strategy: /같은 도형 4개인 줄/ },
          { number: 22, rows: 3, columns: 4, target: "row", cross: true, strategy: /두 가로줄을 비교/ }
        ];
        for (const sourceCase of matrixCases) {
          const key = `${bookId}:${sourceCase.number}`;
          const input = page.locator(`[data-unit-test-key="${key}"]`);
          const row = input.locator("xpath=..");
          await row.scrollIntoViewIfNeeded();
          if (width === 390) {
            await row.locator("[data-touch-preview]").click();
            assert.equal(await input.isChecked(), false, "Opening a touch preview must not select the question");
          } else {
            await row.hover();
          }
          const preview = page.locator("#typePreview");
          await preview.waitFor({ state: "visible" });
          assert.match(await preview.locator(".representative-concept>strong").textContent(), sourceCase.strategy);
          assert.equal(await preview.locator(".b2-matrix>span").count(), sourceCase.rows * sourceCase.columns);
          assert.equal(await preview.locator(".b2-row-sums>b").count(), sourceCase.rows);
          assert.equal(await preview.locator(".b2-column-sums>b").count(), sourceCase.columns);
          assert.equal(await preview.locator(sourceCase.target === "row" ? ".b2-row-sums>b" : ".b2-column-sums>b").filter({ hasText: "?" }).count(), 1);
          if (sourceCase.cross) assert.equal(await preview.locator(".cross-shape").count(), 1);
          if (output) await preview.screenshot({ path: path.join(output, `book-02-q${String(sourceCase.number).padStart(2, "0")}-preview-${width}.png`) });
          await page.keyboard.press("Escape");
        }
      }
      if (output) await page.screenshot({ path: path.join(output, `${bookId}-unit-links-${width}.png`) });
      for (const key of enabledKeys) await page.locator(`[data-unit-test-key="${key}"]`).check();
      await page.locator("#questionCount").fill(String(expected.length));
      await page.locator("#questionCount").dispatchEvent("change");
      await page.locator("#buildButton").click();
      await page.locator("#worksheetSection").waitFor({ state: "visible" });
      const cards = page.locator(".question-card");
      assert.equal(await cards.count(), expected.length);
      const types = await cards.evaluateAll((nodes) => nodes.map((node) => node.dataset.typeId).sort());
      assert.deepEqual(types, expected.map((entry) => entry.typeId).sort(), "Only the reviewed source links may reach the worksheet");
      assert.doesNotMatch(await cards.allTextContents().then((texts) => texts.join(" ")), /undefined|NaN|\[object Object\]/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      assert.equal(await page.locator("#worksheetPrintMode").inputValue(), "questions-with-compact", "Unit tests must default to questions followed by quick answers");
      assert.equal(await page.locator(".compact-answer-page").count(), 2, "A complete unit test needs about two quick-answer pages");
      assert.deepEqual(
        await page.locator(".compact-answer-item").evaluateAll((nodes) => nodes.map((node) => Number(node.dataset.compactAnswerNumber))),
        Array.from({ length: expected.length }, (_, index) => index + 1),
        "Quick answers must use the same uninterrupted print numbering as the worksheet"
      );
      await page.locator("#compactAnswerSheets").evaluate((node) => node.classList.add("measuring"));
      const compactLayout = await page.evaluate(() => ({
        columnOverflow: [...document.querySelectorAll(".compact-answer-column")].filter((node) => node.scrollHeight > node.clientHeight + 2).length,
        itemOverflow: [...document.querySelectorAll(".compact-answer-item")].filter((node) => node.scrollWidth > node.clientWidth + 2).length,
        visiblePictures: [...document.querySelectorAll(".compact-answer-item.has-visual .visual")].filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 20 && rect.height > 20;
        }).length
      }));
      await page.locator("#compactAnswerSheets").evaluate((node) => node.classList.remove("measuring"));
      assert.equal(compactLayout.columnOverflow, 0, "Quick-answer columns must not clip vertically");
      assert.equal(compactLayout.itemOverflow, 0, "Quick-answer rows must not clip horizontally");
      if (bookId === "book-01") assert.ok(compactLayout.visiblePictures >= 3, "Drawing answers must keep their grading pictures on the quick answer sheet");
      if (width === 1440) {
        await page.evaluate(() => {
          window.__nativePrint = window.print;
          window.print = () => {
            document.body.dataset.capturedPrintClasses = document.body.className;
          };
        });
        await page.locator("#printButton").click();
        await page.waitForFunction(() => document.body.dataset.capturedPrintClasses);
        assert.match(await page.locator("body").getAttribute("data-captured-print-classes"), /printing-with-compact/, "The visible print button must honor the selected combined mode");
        assert.equal(await page.locator("#printStatus").textContent(), "", "A prepared print job must not leave an error message");
        await page.evaluate(() => {
          window.print = window.__nativePrint;
          delete window.__nativePrint;
          delete document.body.dataset.capturedPrintClasses;
          document.body.classList.remove("printing-compact", "printing-with-compact");
        });
      }
      if (bookId === "book-02") {
        const card = (number) => cards.nth(number - 1);
        assert.equal(await card(6).locator(".b2-equation-stack").count(), 1);
        assert.equal(await card(7).locator(".b2-scale").count(), 3);
        assert.equal(await card(10).locator(".multi-part-visuals>figure").count(), 2);
        assert.equal(await card(10).locator(".b2-sequence").count(), 2);
        assert.equal(await card(11).locator(".b2-sequence").count(), 1);
        assert.equal(await card(13).locator(".b2-house-growth figure").count(), 3);
        assert.equal(await card(14).locator(".b2-triangle-growth figure").count(), 4);
        assert.equal(await card(15).locator(".b2-fold-growth figure").count(), 3);
        assert.equal(await card(16).locator(".b2-number-rule-rows.table>div").count(), 4);
        assert.equal(await card(17).locator(".b2-number-rule-rows.equation>div").count(), 4);
        assert.equal(await card(18).locator(".b2-promise-set.triangle figure").count(), 4);
        assert.equal(await card(19).locator(".b2-sudoku>span").count(), 9);
        assert.equal(await card(20).locator(".b2-sudoku>span").count(), 16);
        assert.equal(await card(20).getAttribute("data-type-id"), "sudoku-four-irregular-region");
        assert.equal(await card(21).locator(".b2-promise-set.diamond figure").count(), 4);
        assert.equal(await card(23).locator(".b2-equation-stack").count(), 1);
        assert.equal(await card(25).locator(".b2-stone-growth figure").count(), 6);
        assert.match(await card(19).locator(".drawing-answer-note").textContent(), /빈칸에 수/);
        assert.match(await card(20).locator(".drawing-answer-note").textContent(), /빈칸에 수/);
        await page.locator("#answerButton").click();
        await page.locator("#answerDialog").waitFor({ state: "visible" });
        assert.equal(await page.locator("#answerBody>tr").count(), 25);
        assert.equal(await page.locator("#answerDialog .b2-sudoku").count(), 2);
        assert.ok(await page.locator("#answerDialog .answer-part-visuals").count() >= 1);
        assert.doesNotMatch(await page.locator("#answerDialog").textContent(), /undefined|NaN|\[object Object\]/);
        if (output) await page.locator("#answerDialog").screenshot({ path: path.join(output, `book-02-unit-answers-${width}.png`) });
        await page.locator("#closeAnswer").click();
      }
      if (bookId === "book-01") {
        const card = (number) => {
          const index = expected.findIndex((entry) => entry.number === number);
          assert.ok(index >= 0, `Book 1 source question ${number} must be enabled before checking its card`);
          return cards.nth(index);
        };
        assert.equal(await card(1).locator(".b1-unit-set>section").count(), 2);
        assert.equal(await card(1).locator(".b1-partition-grid").count(), 2);
        assert.equal(await card(2).locator(".b1-digital-direct-set>section").count(), 2);
        assert.equal(await card(3).locator(".b1-digital-direct-set>section").count(), 2);
        assert.equal(await card(4).locator(".b1-two-step-board>div>span").count(), 9);
        assert.equal(await card(5).locator(".b1-partition-grid").count(), 1);
        assert.equal(await card(6).locator(".b1-diagonal-fold-set>section").count(), 2);
        const folding = card(7).locator(".fold-number-steps");
        assert.equal(await folding.locator("figure").count(), 4);
        const directions = await folding.evaluate((node) => ({ h: node.dataset.foldHorizontal, v: node.dataset.foldVertical }));
        assert.match(await folding.locator("figcaption").nth(0).textContent(), directions.h === "up" ? /아래쪽을 위로/ : /위쪽을 아래로/);
        assert.match(await folding.locator("figcaption").nth(1).textContent(), directions.v === "left" ? /오른쪽을 왼쪽으로/ : /왼쪽을 오른쪽으로/);
        assert.equal(await card(8).locator(".b1-fold-unfold-draw>.unfold-target").count(), 1);
        assert.equal(await card(9).locator(".b1-diagonal-fold-set>section").count(), 1);
        assert.equal(await card(10).locator(".b1-fold-piece-types").count(), 1);
        assert.equal(await card(11).locator(".b1-fold-punch-total").count(), 1);
        assert.equal(await card(12).locator(".b1-unit-set>section").count(), 3);
        assert.equal(await card(12).locator(".b1-line-card-board").count(), 3);
        assert.equal(await card(13).locator(".b1-unit-set>section").count(), 3);
        assert.equal(await card(13).locator(".b1-line-card-board").count(), 3);
        assert.equal(await card(14).locator(".b1-border-magic .grid>span").count(), 9);
        assert.equal(await card(15).locator(".b1-triangle-magic").count(), 2);
        assert.equal(await card(16).locator(".b1-irregular-gakuro .puzzle>span").count(), 7);
        assert.equal(await card(17).locator(".b1-polygon-ring circle").count(), 10);
        assert.equal(await card(18).locator(".b1-ellipse-magic circle").count(), 5);
        for (const number of [19, 20, 21]) assert.equal(await card(number).locator(".b1-condition-card").count(), 1);
        assert.equal(await card(21).locator(".b1-place-condition>span").count(), 3);
        assert.equal(await card(22).locator(".b1-logic-clues").count(), 1);
        assert.equal(await card(24).locator(".b1-logic-clues").count(), 1);
        assert.equal(await card(25).locator(".b1-height-order").count(), 1);
        const diagramSelectors = new Map([
          [6, ".b1-diagonal-fold-set svg"], [7, ".fold-number-steps svg"], [8, ".unfold-target"],
          [9, ".b1-diagonal-fold-set svg"], [10, ".b1-fold-piece-types svg"], [11, ".b1-fold-punch-total svg"],
          [15, ".b1-triangle-magic svg"], [17, ".b1-polygon-ring svg"], [18, ".b1-ellipse-magic svg"]
        ]);
        for (const [number, selector] of diagramSelectors) {
          const svg = card(number).locator(selector).first();
          const bounds = await svg.boundingBox();
          assert.ok(bounds && bounds.width > 70 && bounds.height > 45, `Book 1 q${number} diagram must be visible`);
        }
        await page.locator("#answerButton").click();
        await page.locator("#answerDialog").waitFor({ state: "visible" });
        assert.equal(await page.locator("#answerBody>tr").count(), expected.length);
        assert.equal(await page.locator("#answerDialog .b1-digital-direct-set").count(), 2);
        assert.equal(await page.locator("#answerDialog .b1-unit-set").count(), 4);
        assert.equal(await page.locator("#answerDialog .b1-polygon-ring").count(), 1);
        assert.doesNotMatch(await page.locator("#answerDialog").textContent(), /undefined|NaN|\[object Object\]/);
        if (output) await page.locator("#answerDialog").screenshot({ path: path.join(output, `book-01-unit-answers-${width}.png`) });
        await page.locator("#closeAnswer").click();
      }
      if (output) await page.screenshot({ path: path.join(output, `${bookId}-unit-worksheet-${width}.png`), fullPage: true });
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfPages = (await PDFDocument.load(pdf)).getPageCount();
      if (output) await writeFile(path.join(output, `${bookId}-unit-worksheet-${width}.pdf`), pdf);
      assert.equal(pdfPages, Math.ceil(expected.length / 2), "The print layout must keep two questions per A4 page without an extra page");
      let quickAnswerPages = null;
      let combinedPages = null;
      if (width === 1440) {
        await page.evaluate(() => document.body.classList.add("printing-compact"));
        const quickPdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
        quickAnswerPages = (await PDFDocument.load(quickPdf)).getPageCount();
        assert.equal(quickAnswerPages, 2, "A complete unit test quick answer must print on two A4 pages");
        if (output) await writeFile(path.join(output, `${bookId}-unit-quick-answers.pdf`), quickPdf);
        await page.evaluate(() => document.body.classList.remove("printing-compact"));

        await page.evaluate(() => document.body.classList.add("printing-with-compact"));
        const combinedPdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
        combinedPages = (await PDFDocument.load(combinedPdf)).getPageCount();
        assert.equal(combinedPages, pdfPages + quickAnswerPages, "Quick answers must start after the final problem page without an extra blank page");
        if (output) await writeFile(path.join(output, `${bookId}-unit-worksheet-with-quick-answers.pdf`), combinedPdf);
        await page.evaluate(() => document.body.classList.remove("printing-with-compact"));
      }
      await page.emulateMedia({ media: "screen" });
      await page.locator("#backToBuilder").click();
      for (const key of enabledKeys) assert.ok(await page.locator(`[data-unit-test-key="${key}"]`).isChecked());
      assert.deepEqual(errors, []);
      results.push({ bookId, width, inventory: inventory.length, enabled: expected.length, held: inventory.length - expected.length, pdfPages, quickAnswerPages, combinedPages });
      await page.close();
    }
  }
  if (output) await writeFile(path.join(output, "unit-test-links-browser-audit.json"), JSON.stringify({ results }, null, 2));
  console.log(`UNIT_TEST_LINKS_BROWSER_OK ${JSON.stringify({ results })}`);
} finally {
  await browser.close();
}
