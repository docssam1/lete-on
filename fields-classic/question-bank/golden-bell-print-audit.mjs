import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const require = createRequire(import.meta.url);
const { PDFDocument } = require(path.join(runtimeModules, "pdf-lib"));
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const requestedBook = process.env.GOLDEN_BELL_BOOK || "book-02";
const bookIds = requestedBook === "all"
  ? Array.from({ length: 10 }, (_, index) => `book-${String(index + 1).padStart(2, "0")}`)
  : [requestedBook];

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });

  for (const bookId of bookIds) {
    await page.emulateMedia({ media: "screen" });
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=PRINT-AUDIT&book=${bookId}`, { waitUntil: "networkidle" });
    await page.evaluate(() => { window.print = () => {}; });
    await page.locator("#printBookButton").click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator(".gold-print-page").count(), 8, `${bookId}: print DOM must contain eight lesson pages`);

    await page.emulateMedia({ media: "print" });
    const pageBounds = await page.locator(".gold-print-page").evaluateAll((nodes) => nodes.map((node) => {
      const pageRect = node.getBoundingClientRect();
      const footer = node.querySelector(":scope > .gold-print-footer");
      const footerTop = footer?.getBoundingClientRect().top ?? pageRect.bottom;
      const contentBottom = Array.from(node.children)
        .filter((child) => !child.classList.contains("gold-print-footer"))
        .reduce((bottom, child) => Math.max(bottom, child.getBoundingClientRect().bottom), pageRect.top);
      return {
        lesson: node.dataset.printLesson,
        part: node.dataset.printPart,
        pageHeight: Math.round(pageRect.height),
        contentBottom: Math.round(contentBottom - pageRect.top),
        footerTop: Math.round(footerTop - pageRect.top),
        children: Array.from(node.children).map((child) => ({
          className: child.className,
          height: Math.round(child.getBoundingClientRect().height)
        }))
      };
    }));
    if (process.env.GOLDEN_BELL_PRINT_BOUNDS === "1") console.log(`${bookId} ${JSON.stringify(pageBounds)}`);
    const oversized = pageBounds.filter(({ pageHeight }) => pageHeight > 1022);
    assert.deepEqual(oversized, [], `${bookId}: printable page expanded beyond one A4 content sheet: ${JSON.stringify(oversized)}`);
    const overlaps = pageBounds.filter(({ contentBottom, footerTop }) => contentBottom > footerTop - 2);
    assert.deepEqual(overlaps, [], `${bookId}: printable content overlaps the footer: ${JSON.stringify(overlaps)}`);

    const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
    if (process.env.GOLDEN_BELL_PDF_PATH && bookIds.length === 1) await writeFile(process.env.GOLDEN_BELL_PDF_PATH, pdfBytes);
    const pdf = await PDFDocument.load(pdfBytes);
    assert.equal(pdf.getPageCount(), 8, `${bookId}: physical PDF must contain exactly eight pages`);
    console.log(`GOLDEN_BELL_PRINT_OK book=${bookId} pages=${pdf.getPageCount()} footerClear=pass`);
  }
  assert.deepEqual(errors, [], `print browser errors: ${errors.join(" | ")}`);
} finally {
  await browser.close();
}
