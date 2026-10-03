import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-library.js";
import { book01Markup } from "./book01-renderers.js";

const transform = book01Markup({ kind: "book1", subtype: "shape-transform", size: 2, source: [[0, 0]], operations: ["rotate-left", "rotate-right"], options: [] });
assert.doesNotMatch(transform, /¼|1\s*\/\s*4/u);
assert.match(transform, /시계 방향으로 반의 반 바퀴/u);

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8797";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
const output = process.env.FIELDS_CAPTURE_DIR;
assert.ok(output && process.env.FIELDS_PRIVATE_ANSWER_BANK);
await fs.mkdir(output, { recursive: true });
const bank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
const report = { viewports: [], prints: [], clock: [] };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
    await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: bank.books["book-01"] }) }));
    await page.addInitScript(() => { sessionStorage.setItem("gfield_fields_session", "cover-test-fixture"); window.print = () => {}; });
    await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=COVER-QA&book=book-01`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    const dialog = page.locator("#coverDialog");
    const pick = async (style) => {
      await page.locator("#printCoverButton").click();
      await dialog.locator(`[value="${style}"]`).check();
      assert.equal(await dialog.locator(`[value="${style}"]`).isChecked(), true);
      if (style !== "none") {
        const cover = dialog.locator(".gold-print-cover");
        assert.equal(await cover.getAttribute("data-cover-style"), style);
        assert.equal(await cover.locator(".gold-print-cover-concepts li").count(), GOLDEN_BELL_BOOKS[0].lessons.length);
        await page.waitForTimeout(120);
        assert.equal(await dialog.evaluate((node) => node.scrollWidth > node.clientWidth + 1), false);
        const bounds = await cover.evaluate((node) => {
          const a = node.getBoundingClientRect(), b = node.parentElement.getBoundingClientRect();
          return a.left >= b.left - 1 && a.right <= b.right + 1 && a.bottom <= b.bottom + 1;
        });
        assert.equal(bounds, true);
        await dialog.screenshot({ path: path.join(output, `cover-${style}-${width}.png`) });
      }
      await dialog.locator("#coverDialogApply").click();
      assert.equal(await dialog.isVisible(), false);
      assert.equal(await page.evaluate(() => localStorage.getItem("fields-classic-golden-bell-print-cover")), style);
    };
    await page.locator("#printCoverButton").click();
    await dialog.locator('[value="simple"]').focus();
    await page.keyboard.press("Space");
    assert.equal(await dialog.locator('[value="simple"]').isChecked(), true);
    await page.keyboard.press("Escape");
    assert.match(await page.locator("#printCoverButton").innerText(), /도형 배경/u, "Cancelling must not apply a draft selection");
    await pick("simple");
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
    assert.match(await page.locator("#printCoverButton").innerText(), /모눈 배경/u);
    for (const style of ["concept", "simple", "none"]) {
      await pick(style);
      if (width !== 1440) continue;
      await page.selectOption("#coursePrintMode", "study");
      await page.locator("#printBookButton").click();
      await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled);
      assert.match(await page.locator("#printStatus").innerText(), /^A4 /u);
      const root = page.locator("#goldPrintRoot");
      assert.equal(await root.locator(".gold-print-cover").count(), style === "none" ? 0 : 1);
      if (style !== "none") assert.equal(await root.locator(".gold-print-cover").getAttribute("data-cover-style"), style);
      await page.emulateMedia({ media: "print" });
      const expectedPages = await root.locator(".gold-print-page").count();
      const pdf = await page.pdf({ path: path.join(output, `book01-${style}-study.pdf`), format: "A4", printBackground: true });
      assert.equal((await PDFDocument.load(pdf)).getPageCount(), expectedPages);
      report.prints.push({ style, mode: "study", pages: expectedPages });
      await page.emulateMedia({ media: "screen" });
    }
    for (const mode of ["answers", "quick"]) {
      await page.selectOption("#coursePrintMode", mode);
      assert.equal(await page.locator("#printCoverButton").isDisabled(), true);
      if (width !== 1440) continue;
      await page.locator("#printBookButton").click();
      await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled);
      assert.equal(await page.locator("#goldPrintRoot .gold-print-cover,#goldPrintRoot .gold-print-duplex-blank").count(), 0);
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ path: path.join(output, `book01-${mode}.pdf`), format: "A4", printBackground: true });
      const count = await page.locator("#goldPrintRoot .gold-print-page").count();
      assert.equal((await PDFDocument.load(pdf)).getPageCount(), count);
      report.prints.push({ mode, pages: count });
      await page.emulateMedia({ media: "screen" });
    }
    await page.selectOption("#coursePrintMode", "both");
    assert.equal(await page.locator("#printCoverButton").isDisabled(), false);
    if (width === 1440) {
      for (const style of ["concept", "none"]) {
        await pick(style);
        await page.locator("#printBookButton").click();
        await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled);
        const parts = await page.locator("#goldPrintRoot .gold-print-page").evaluateAll((nodes) => nodes.map((node) => node.dataset.printPart));
        assert.equal(parts.findIndex((part) => part.startsWith("answers-")) % 2, 0);
        await page.emulateMedia({ media: "print" });
        const pdf = await page.pdf({ path: path.join(output, `book01-${style}-both.pdf`), format: "A4", printBackground: true });
        assert.equal((await PDFDocument.load(pdf)).getPageCount(), parts.length);
        report.prints.push({ style, mode: "both", pages: parts.length, answerPage: parts.findIndex((part) => part.startsWith("answers-")) + 1 });
        await page.emulateMedia({ media: "screen" });
      }
    }
    await page.locator('[data-hand-open="turn-clock"]').click();
    const hand = page.locator(".gold-hands-on dialog");
    const clockwise = hand.locator('[data-hand-action="turn"][data-value="1"]');
    assert.equal(await clockwise.getAttribute("aria-label"), "시계 방향으로 반의 반 바퀴");
    assert.match(await hand.locator(".hand-guide-copy").innerText(), /반의 반 바퀴씩 돌려/u);
    assert.doesNotMatch(await hand.innerText(), /¼|\d\s*\/\s*4\s*바퀴/u);
    await clockwise.click();
    assert.match(await hand.locator(".hand-measure").innerText(), /반의 반 바퀴/u);
    await hand.screenshot({ path: path.join(output, `clock-words-${width}.png`) });
    for (let turns = 2; turns <= 8; turns++) {
      await clockwise.click();
      assert.doesNotMatch(await hand.innerText(), /¼|\d\s*\/\s*4\s*바퀴|undefined/u);
    }
    assert.equal(await clockwise.isDisabled(), true);
    await hand.locator('[data-hand-action="undo"]').click();
    assert.equal(await clockwise.isDisabled(), false);
    report.clock.push({ width, fractionalLabels: false, rotations: 8 });
    assert.deepEqual(errors, []);
    report.viewports.push(width);
    await page.close();
  }
  const largest = GOLDEN_BELL_BOOKS.filter((book) => book.lessons.length).sort((a, b) => b.lessons.length - a.lessons.length)[0];
  const crowded = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await crowded.addInitScript(() => { window.print = () => {}; });
  await crowded.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=COVER-QA&book=${largest.id}`, { waitUntil: "networkidle" });
  for (const style of ["concept", "simple"]) {
    await crowded.locator("#printCoverButton").click();
    await crowded.locator(`#coverDialog [value="${style}"]`).check();
    assert.equal(await crowded.locator("#coverPreview .gold-print-cover-concepts li").count(), largest.lessons.length);
    await crowded.evaluate(() => {
      const root = document.getElementById("goldPrintRoot");
      root.replaceChildren(document.querySelector("#coverPreview .gold-print-cover").cloneNode(true));
      root.setAttribute("aria-hidden", "false");
      document.getElementById("coverDialog").close();
    });
    await crowded.emulateMedia({ media: "print" });
    const pdf = await crowded.pdf({ path: path.join(output, `${largest.id}-${style}-cover.pdf`), format: "A4", printBackground: true });
    assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1);
    const contentFits = await crowded.locator("#goldPrintRoot .gold-print-cover").evaluate((node) => {
      const footer = node.querySelector(".gold-print-footer").getBoundingClientRect();
      return [...node.querySelectorAll(".gold-print-cover-concepts li")].every((row) => row.getBoundingClientRect().bottom < footer.top);
    });
    assert.equal(contentFits, true);
    report.prints.push({ book: largest.id, style, mode: "cover-only", pages: 1, concepts: largest.lessons.length });
    await crowded.emulateMedia({ media: "screen" });
  }
  await crowded.close();
} finally { await browser.close(); }
await fs.writeFile(path.join(output, "cover-picker-audit.json"), JSON.stringify(report, null, 2));
console.log(`COVER_PICKER_OK viewports=${report.viewports.length} printCases=${report.prints.length} clock=${report.clock.length}`);
