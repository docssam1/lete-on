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
      if (bookId === "book-01") {
        const folding = page.locator(".fold-number-steps");
        assert.equal(await folding.locator("figure").count(), 4);
        const directions = await folding.evaluate((node) => ({ h: node.dataset.foldHorizontal, v: node.dataset.foldVertical }));
        assert.match(await folding.locator("figcaption").nth(0).textContent(), directions.h === "up" ? /아래쪽을 위로/ : /위쪽을 아래로/);
        assert.match(await folding.locator("figcaption").nth(1).textContent(), directions.v === "left" ? /오른쪽을 왼쪽으로/ : /왼쪽을 오른쪽으로/);
        for (const card of await cards.all()) {
          assert.ok(await card.locator("svg").count(), "Fold and ring questions need their diagrams");
          const bounds = await card.locator("svg").first().boundingBox();
          assert.ok(bounds.width > 100 && bounds.height > 50);
        }
      }
      if (output) await page.screenshot({ path: path.join(output, `${bookId}-unit-worksheet-${width}.png`), fullPage: true });
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfPages = (await PDFDocument.load(pdf)).getPageCount();
      if (output) await writeFile(path.join(output, `${bookId}-unit-worksheet-${width}.pdf`), pdf);
      assert.equal(pdfPages, Math.ceil(expected.length / 2), "The print layout must keep two questions per A4 page without an extra page");
      await page.emulateMedia({ media: "screen" });
      await page.locator("#backToBuilder").click();
      for (const key of enabledKeys) assert.ok(await page.locator(`[data-unit-test-key="${key}"]`).isChecked());
      assert.deepEqual(errors, []);
      results.push({ bookId, width, inventory: inventory.length, enabled: expected.length, held: inventory.length - expected.length, pdfPages });
      await page.close();
    }
  }
  if (output) await writeFile(path.join(output, "unit-test-links-browser-audit.json"), JSON.stringify({ results }, null, 2));
  console.log(`UNIT_TEST_LINKS_BROWSER_OK ${JSON.stringify({ results })}`);
} finally {
  await browser.close();
}
