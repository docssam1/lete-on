import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const require = createRequire(import.meta.url);
const { PDFDocument } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib/cjs/index.js");

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const url = `${baseUrl}/geometry/worksheet/mirror-manor/`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(url, { waitUntil: "networkidle" });
assert.equal(await page.locator("#coverToggle").isChecked(), true);
assert.equal(await page.locator("#coverSheet").isVisible(), true);
assert.equal(await page.locator("#coverLevel").textContent(), "초등팩토 1");
await page.locator("#coverToggle").uncheck();
assert.equal(await page.locator("#coverSheet").isVisible(), false);
await page.locator("#coverToggle").check();
const levelsChecked = [];
for (let level = 1; level <= 5; level += 1) {
  await page.selectOption("#levelSelect", String(level));
  assert.equal(await page.locator(".problem").count(), 6);
  assert.equal(await page.locator(".problem-board, .mirror-board, .dot-board, .symbol-question").count() >= 6, true);
  await page.locator("#answerToggle").uncheck();
  await page.locator("#answerToggle").check();
  if (level === 2) assert.ok(await page.locator(".dot-choice.correct").count());
  else if (level === 4) assert.equal(await page.locator(".symbol-question li.correct").count(), 6);
  else assert.ok(await page.locator(".sheet-cell.answer").count());
  levelsChecked.push({ level, title: await page.locator("#sheetTitle").textContent() });
}

await page.emulateMedia({ media: "print" });
const printCover = await page.locator("#coverSheet").boundingBox();
const printSheet = await page.locator("#sheet").boundingBox();
assert.ok(Math.abs(printCover.width - 793.7) < 2, `cover A4 width drifted to ${printCover.width}`);
assert.ok(Math.abs(printCover.height - 1122.5) < 2, `cover A4 height drifted to ${printCover.height}`);
assert.ok(Math.abs(printSheet.width - 793.7) < 2, `A4 width drifted to ${printSheet.width}`);
assert.ok(Math.abs(printSheet.height - 1122.5) < 2, `A4 height drifted to ${printSheet.height}`);
assert.ok(Math.abs(printCover.x - printSheet.x) < 1, "cover and question page are not aligned");
assert.ok(printSheet.y >= printCover.y + printCover.height - 1, "question page must follow the cover");
const pdfBytes = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
const pdf = await PDFDocument.load(pdfBytes);
assert.equal(pdf.getPageCount(), 2, "cover and questions must print as two A4 pages");
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-sheet.png", fullPage: true });

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, problems: document.querySelectorAll(".problem").length, coverWidth: document.querySelector("#coverSheet").getBoundingClientRect().width, sheetWidth: document.querySelector("#sheet").getBoundingClientRect().width }));
assert.equal(mobile.scrollWidth, mobile.width);
assert.equal(mobile.problems, 6);
assert.ok(Math.abs(mobile.coverWidth - mobile.sheetWidth) < 1, JSON.stringify(mobile));
assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, levelsChecked, printCover, printSheet, pdfPages: pdf.getPageCount(), mobile }, null, 2));
