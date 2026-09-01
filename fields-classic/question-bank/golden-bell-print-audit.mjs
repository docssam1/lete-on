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
const bookId = process.env.GOLDEN_BELL_BOOK || "book-02";

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });

  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=PRINT-AUDIT&book=${bookId}`, { waitUntil: "networkidle" });
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator("#printBookButton").click();
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".gold-print-page").count(), 8, `${bookId}: print DOM must contain eight lesson pages`);

  const pdfBytes = await page.pdf({ format: "A4", printBackground: true });
  if (process.env.GOLDEN_BELL_PDF_PATH) await writeFile(process.env.GOLDEN_BELL_PDF_PATH, pdfBytes);
  const pdf = await PDFDocument.load(pdfBytes);
  assert.equal(pdf.getPageCount(), 8, `${bookId}: physical PDF must contain exactly eight pages`);
  assert.deepEqual(errors, [], `${bookId}: browser errors: ${errors.join(" | ")}`);
  console.log(`GOLDEN_BELL_PRINT_OK book=${bookId} pages=${pdf.getPageCount()}`);
} finally {
  await browser.close();
}
