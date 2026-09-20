import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const answerBookId = process.env.FIELDS_ANSWER_BOOK_ID || "";
const mode = answerBookId ? "curriculum" : "type";
const url = `${base}/fields-classic/question-bank/?student=DEMO&mode=${mode}`;
const output = process.env.FIELDS_CAPTURE_DIR || path.join(os.tmpdir(), "fields-answer-print-audit");
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, locale: "ko-KR" });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  let selected;
  if (answerBookId) {
    await page.locator('#builderTabs button[data-mode="curriculum"]').click();
    await page.locator(`[data-curriculum-book="${answerBookId}"]`).click();
    selected = await page.locator("input[data-unit-test-key]:not([disabled])").evaluateAll((inputs) => inputs.map((input) => {
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return input.dataset.unitTestKey;
    }));
  } else {
    await page.locator('#builderTabs button[data-mode="type"]').click();
    const candidates = process.env.FIELDS_ANSWER_TYPES
      ? process.env.FIELDS_ANSWER_TYPES.split(",").map((value) => value.trim()).filter(Boolean)
      : ["fold-number-grid-one", "shape-quarter-half-turn", "gakuro-grid-nine-sum"];
    selected = await page.evaluate((typeIds) => {
      const found = [];
      for (const typeId of typeIds) {
        const input = document.querySelector(`#bankTypeTree input[data-type-id="${typeId}"]:not([disabled])`);
        if (!input) continue;
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        found.push(typeId);
      }
      return found;
    }, candidates);
  }
  assert.ok(selected.length >= 2, `Not enough print stress questions were selectable: ${selected.join(", ")}`);

  const requestedCount = answerBookId ? selected.length : 20;
  await page.locator("#questionCount").fill(String(requestedCount));
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click();
  await page.locator("#worksheetSection").waitFor({ state: "visible", timeout: 30000 });
  assert.equal(await page.locator(".question-card").count(), requestedCount, "The stress worksheet must contain every requested question");

  await page.locator("#answerButton").click();
  await page.locator("#answerDialog[open]").waitFor({ state: "visible" });
  assert.equal(await page.locator("#answerBody tr").count(), requestedCount, "The answer sheet must contain every answer");
  if (answerBookId === "book-02") {
    assert.equal(await page.locator("#answerDialog .b2-sudoku").count(), 2, "Both full Sudoku answers must be drawn");
    assert.ok(await page.locator("#answerDialog .answer-part-visuals").count() >= 1, "Multipart drawing answers must be drawn");
  }

  await page.evaluate(() => document.body.classList.add("printing-answers"));
  await page.emulateMedia({ media: "print" });
  const layout = await page.evaluate(() => {
    const dialog = document.querySelector("#answerDialog");
    const table = dialog.querySelector("table");
    const visibleColumns = [...table.querySelectorAll("thead th")]
      .map((cell, index) => ({ index: index + 1, display: getComputedStyle(cell).display }))
      .filter((item) => item.display !== "none")
      .map((item) => item.index);
    const rows = [...dialog.querySelectorAll("tbody tr")];
    const escapedMedia = [...dialog.querySelectorAll("tbody svg, tbody img")].filter((node) => {
      const media = node.getBoundingClientRect();
      if (media.width < 1 || media.height < 1) return false;
      const cell = node.closest("td").getBoundingClientRect();
      return media.left < cell.left - 1 || media.right > cell.right + 1;
    });
    const escapedVisuals = [...dialog.querySelectorAll("tbody .b4-circle-seats, tbody .b2-promise-set")].filter((node) => {
      const visual = node.getBoundingClientRect();
      const cell = node.closest("td").getBoundingClientRect();
      return visual.left < cell.left - 1 || visual.right > cell.right + 1;
    });
    const dialogRect = dialog.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();
    return {
      visibleColumns,
      tableInsideDialog: tableRect.left >= dialogRect.left - 1 && tableRect.right <= dialogRect.right + 1,
      rowBreaks: [...new Set(rows.map((row) => getComputedStyle(row).breakInside))],
      tallestRow: Math.max(...rows.map((row) => row.getBoundingClientRect().height)),
      escapedMedia: escapedMedia.length,
      escapedMediaDetails: escapedMedia.map((node) => ({
        tag: node.tagName,
        typeId: node.closest("tr")?.querySelector("[data-answer-type]")?.dataset.answerType || node.closest("tr")?.querySelector("td")?.textContent?.trim().slice(0, 80) || "unknown",
        className: node.getAttribute("class") || ""
      })),
      escapedVisuals: escapedVisuals.length,
      scrollOverflow: dialog.scrollWidth > dialog.clientWidth + 1
    };
  });
  assert.deepEqual(layout.visibleColumns, [1, 4, 7, 8], "Printed answers must use the compact teaching columns");
  assert.equal(layout.tableInsideDialog, true, "The printed answer table must stay inside A4 width");
  assert.ok(layout.rowBreaks.every((value) => value === "avoid"), `Answer rows may split across pages: ${layout.rowBreaks.join(", ")}`);
  assert.ok(layout.tallestRow < 900, `An answer row is taller than a printable page: ${layout.tallestRow}`);
  assert.equal(layout.escapedMedia, 0, `Answer figures must stay inside their cells: ${JSON.stringify(layout.escapedMediaDetails)}`);
  assert.equal(layout.escapedVisuals, 0, "Answer layout visuals must stay inside their cells");
  assert.equal(layout.scrollOverflow, false, "The printed answer sheet must not overflow horizontally");

  const pdfBytes = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  const pdfPath = path.join(output, answerBookId ? `${answerBookId}-answer-sheet.pdf` : "answer-sheet-20.pdf");
  await fs.writeFile(pdfPath, pdfBytes);
  const pdf = await PDFDocument.load(pdfBytes);
  const maximumPages = Number(process.env.FIELDS_ANSWER_MAX_PAGES || 20);
  assert.ok(pdf.getPageCount() >= 2 && pdf.getPageCount() <= maximumPages, `Unexpected answer PDF page count: ${pdf.getPageCount()}`);
  for (const sheet of pdf.getPages()) {
    const { width, height } = sheet.getSize();
    assert.ok(Math.abs(width - 595.28) < 2 && Math.abs(height - 841.89) < 2, `Non-A4 page: ${width}x${height}`);
  }
  assert.deepEqual(pageErrors, [], `Browser errors: ${pageErrors.join(" | ")}`);
  console.log(`QUESTION_BANK_ANSWER_PRINT_OK questions=${requestedCount} pages=${pdf.getPageCount()} columns=${layout.visibleColumns.join(",")} tallestRow=${Math.round(layout.tallestRow)} pdf=${pdfPath}`);
} finally {
  await browser.close();
}
