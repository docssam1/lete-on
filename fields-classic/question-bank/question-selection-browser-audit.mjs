import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR;
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = { builds: [], replacements: [], pdf: [] };
const fixedNumbers = [6, 8, 10, 11, 13, 14, 15, 23, 25];

async function content(page) {
  return page.locator(".question-card").evaluateAll((cards) => cards.map((card) =>
    [...card.querySelectorAll(":scope > .question-prompt, :scope > .visual, :scope > .multi-part-visuals, :scope > img")]
      .map((node) => node.outerHTML).join("")
  ));
}

async function select(page, numbers, count) {
  await page.locator("input[data-unit-test-key]:checked").evaluateAll((nodes) => nodes.forEach((node) => node.click()));
  for (const number of numbers) await page.locator(`[data-unit-test-key="book-02:${number}"]`).check();
  await page.locator("#questionCount").fill(String(count));
  await page.locator("#questionCount").dispatchEvent("change");
}

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
    const errors = [];
    const dialogs = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("dialog", async (dialog) => { dialogs.push(dialog.message()); await dialog.accept(); });
    await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-curriculum-book="book-02"]').click();
    await select(page, fixedNumbers, 45);
    for (const order of ["exam", "domain", "mixed"]) {
      await page.locator(`[data-order="${order}"]`).click();
      await page.locator("#buildButton").click();
      await page.locator("#worksheetSection").waitFor({ state: "visible" });
      const initial = await content(page);
      assert.equal(initial.length, fixedNumbers.length);
      assert.equal(new Set(initial).size, initial.length, "No duplicate student problem may survive selection");
      assert.match(await page.locator("#generationStatus").textContent(), /45문항.*9문항.*36문항/);
      assert.equal(await page.locator("#worksheetCount").textContent(), "실제 9문항 · 요청 45문항");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      assert.deepEqual(await page.locator(".question-number").allTextContents(), fixedNumbers.map((_, index) => String(index + 1).padStart(2, "0")));
      await page.locator('[data-question-action="replace"]').first().click();
      assert.match(dialogs.at(-1), /현재 문항을 유지/);
      assert.deepEqual(await content(page), initial);
      await page.locator("#answerButton").click();
      assert.equal(await page.locator("#answerBody tr").count(), initial.length);
      await page.locator("#closeAnswer").click();
      if (output && order === "mixed") await page.screenshot({ path: path.join(output, `fixed-mixed-${width}.png`) });
      report.builds.push({ width, order, requested: 45, actual: initial.length, missing: 36 });
      if (width === 1440 && order === "mixed") {
        await page.evaluate(() => { window.print = () => { document.body.dataset.printClasses = document.body.className; }; });
        for (const mode of ["questions", "questions-with-compact", "compact"]) {
          await page.evaluate(() => { delete document.body.dataset.printClasses; });
          await page.locator("#worksheetPrintMode").selectOption(mode);
          await page.locator("#printButton").click();
          await page.waitForFunction(() => document.body.dataset.printClasses !== undefined);
          const classes = await page.locator("body").getAttribute("data-print-classes");
          await page.waitForTimeout(450);
          await page.locator("body").evaluate((body, saved) => { body.className = saved; }, classes);
          await page.emulateMedia({ media: "print" });
          assert.equal(await page.locator("#generationStatus").evaluate((node) => getComputedStyle(node).display), "none");
          const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
          assert.ok(pdf.length > 1000);
          const pages = (await PDFDocument.load(pdf)).getPageCount();
          if (output) await writeFile(path.join(output, `fixed-mixed-${mode}.pdf`), pdf);
          report.pdf.push({ mode, pages });
          await page.locator("body").evaluate((body) => body.classList.remove("printing-compact", "printing-with-compact"));
          await page.emulateMedia({ media: "screen" });
          assert.deepEqual(await content(page), initial, "Printing must not redraw fixed questions");
        }
      }
      if (order === "mixed") {
        const beforeRegeneration = await content(page);
        await page.locator("#regenerateButton").click();
        assert.match(dialogs.at(-1), /기존 학습지는 유지/);
        assert.deepEqual(await content(page), beforeRegeneration);
        await page.locator('[data-question-action="remove"]').first().click();
        assert.equal(await page.locator("#generationStatus").textContent(), "");
        assert.equal(await page.locator("#worksheetCount").textContent(), "8문항");
        await page.locator("#answerButton").click();
        assert.equal(await page.locator("#answerBody tr").count(), 8);
        await page.locator("#closeAnswer").click();
      }
      await page.locator("#backToBuilder").click();
    }

    // This real generator has exactly two variants. Replacing A -> B must not allow B -> A.
    await select(page, [7], 1);
    await page.locator("#buildButton").click();
    const first = await content(page);
    await page.locator('[data-question-action="replace"]').click();
    const second = await content(page);
    assert.notDeepEqual(second, first);
    await page.locator('[data-question-action="replace"]').click();
    assert.deepEqual(await content(page), second);
    assert.match(dialogs.at(-1), /現在|현재 문항을 유지/);
    assert.equal(await page.locator("#generationStatus").textContent(), "");
    report.replacements.push({ width, firstReplacement: "new", secondReplacement: "kept-current" });

    await page.locator("#backToBuilder").click();
    await select(page, [12], 6);
    await page.locator("#buildButton").click();
    assert.equal((await content(page)).length, 6, "Different subproblem figures must not collapse to one question");
    assert.equal(new Set(await content(page)).size, 6);
    assert.equal(await page.locator("#generationStatus").textContent(), "");
    assert.deepEqual(errors, []);
    await page.close();
  }
  const pagesByMode = Object.fromEntries(report.pdf.map((entry) => [entry.mode, entry.pages]));
  assert.equal(pagesByMode["questions-with-compact"], pagesByMode.questions + pagesByMode.compact);
  if (output) await writeFile(path.join(output, "selection-review.json"), JSON.stringify(report, null, 2));
  console.log(`QUESTION_SELECTION_BROWSER_OK mixedBuilds=${report.builds.length} history=${report.replacements.length} pdf=${report.pdf.length}`);
  console.log(JSON.stringify(report.pdf));
} finally {
  await browser.close();
}
