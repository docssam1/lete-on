import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = { navigation: [], vocabulary: [], print: null, scope: "Navigation and concept presentation, not a source/answer audit of every question" };

try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const book of GOLDEN_BELL_BOOKS) {
      await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=${book.id}`, { waitUntil: "networkidle" });
      for (const lesson of book.lessons) {
        await page.locator(`[data-lesson="${lesson.id}"]`).click();
        assert.equal(await page.locator('[data-phase="original"]').isEnabled(), true, `${book.id}/${lesson.id}: top navigation is blocked`);
        const next = page.locator('[data-next-phase="original"]');
        assert.equal(await next.isEnabled(), true, `${book.id}/${lesson.id}: concept-to-question button is blocked`);
        await next.click();
        assert.equal(await page.locator('[data-phase="original"]').getAttribute("aria-current"), "step");
        assert.ok(await page.locator("[data-original-item]").count() > 0, `${lesson.id}: no question rendered`);
        assert.equal(await page.locator('[data-phase="extension"]').isDisabled(), true, "Opening a question must not mark it completed");
        const answerButton = page.locator("[data-original-answer]").first();
        assert.equal(await answerButton.isDisabled(), true, "Guest solution controls must stay locked");
        assert.equal(await page.locator('.protected-answer-notice').count(), 1, "Guest answer protection must remain in place");
        assert.equal(await page.locator(".original-solution,.source-solution").count(), 0, "Navigation must not reveal a worked answer");
        await page.locator('[data-phase="concept"]').click();
        await page.locator('[data-phase="original"]').click();
        assert.ok(await page.locator("[data-original-item]").count() > 0, "Top navigation must work too");
      }
      report.navigation.push({ book: book.id, width, lessons: book.lessons.length });
    }
    assert.deepEqual(errors, []);
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-04`, { waitUntil: "networkidle" });
    await page.locator('[data-lesson="polyomino-family-count"]').click();
    const terms = await page.locator("#lessonContent .polyomino-term").evaluateAll((nodes) => nodes.map((node) => ({
      count: Number(node.dataset.polyominoCount),
      name: node.querySelector("dt strong").textContent,
      squares: node.querySelectorAll(".polyomino-shape i").length,
      fontSize: parseFloat(getComputedStyle(node.querySelector("dt strong")).fontSize)
    })));
    assert.deepEqual(terms.map((item) => item.name), ["모노미노", "도미노", "트리미노", "테트로미노"]);
    assert.ok(terms.every((item) => item.count === item.squares && item.fontSize >= 20));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    if (output) await page.locator("#lessonContent .polyomino-vocabulary").screenshot({ path: path.join(output, `polyomino-${width}.png`) });
    report.vocabulary.push({ width, terms });
    if (width === 1440) {
      await page.evaluate(() => { window.print = () => {}; });
      await page.locator("#printLessonButton").click();
      await page.waitForFunction(() => document.querySelector("#printStatus").textContent.startsWith("A4 "));
      await page.waitForSelector(".polyomino-vocabulary-page", { state: "attached" });
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".polyomino-vocabulary-page .polyomino-term").count(), 4);
      const badPages = await page.locator(".gold-print-page").evaluateAll((pages) => pages.flatMap((node) => {
        const outer = node.getBoundingClientRect();
        const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
        const bottom = Math.max(...[...node.children].filter((child) => !child.classList.contains("gold-print-footer")).map((child) => child.getBoundingClientRect().bottom));
        return bottom >= footer.top || outer.height > 1022 ? [node.dataset.printPart] : [];
      }));
      assert.deepEqual(badPages, [], "Vocabulary print page overflows A4");
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfDoc = await PDFDocument.load(pdf);
      assert.equal(pdfDoc.getPageCount(), await page.locator(".gold-print-page").count());
      const lesson = GOLDEN_BELL_BOOKS.find((item) => item.id === "book-04").lessons.find((item) => item.id === "polyomino-family-count");
      assert.equal(await page.locator(".gold-print-source-item").count(), lesson.original.items.length);
      assert.equal(await page.locator('.gold-print-story').count(), 1 + (lesson.similarPractice || []).length);
      if (output) await fs.writeFile(path.join(output, "polyomino-learning.pdf"), pdf);
      report.print = { pages: pdfDoc.getPageCount(), terms: 4, questions: lesson.original.items.length };
    }
    await context.close();
  }
  if (output) await fs.writeFile(path.join(output, "learning-access-audit.json"), JSON.stringify(report, null, 2));
  console.log(`LEARNING_ACCESS_BROWSER_OK ${JSON.stringify(report)}`);
} finally {
  await browser.close();
}
