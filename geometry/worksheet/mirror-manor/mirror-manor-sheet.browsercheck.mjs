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
assert.match(await page.locator("#coverLevel").textContent(), /초등팩토 1/);
await page.locator("#coverToggle").uncheck();
assert.equal(await page.locator("#coverSheet").isVisible(), false);
await page.locator("#coverToggle").check();
const levelsChecked = [];
for (let level = 1; level <= 5; level += 1) {
  await page.selectOption("#levelSelect", String(level));
  await page.locator("#countInput").fill("6");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator(".problem").count(), 6);
  assert.equal(await page.locator(".problem[data-problem-id]").count(), 6);
  assert.equal(await page.locator(".problem-board, .mirror-board, .dot-board, .symbol-question").count() >= 6, true);
  await page.locator("#answerToggle").uncheck();
  await page.locator("#answerToggle").check();
  if (level === 2) assert.ok(await page.locator(".dot-choice.correct").count());
  else if (level === 4) assert.equal(await page.locator(".symbol-question li.correct").count(), 6);
  else assert.ok(await page.locator(".sheet-cell.answer").count());
  levelsChecked.push({ level, title: await page.locator(".sheet-title").textContent() });
}

await page.selectOption("#levelSelect", "all");
await page.locator("#countInput").fill("20");
await page.locator("#countInput").dispatchEvent("change");
assert.equal(await page.locator(".problem").count(), 20);
assert.equal(await page.locator(".sheet").count(), 4);
const bankSelection = await page.locator(".problem").evaluateAll((nodes) => ({
  ids: nodes.map((node) => node.dataset.problemId),
  levels: nodes.reduce((counts, node) => ({ ...counts, [node.dataset.level]: (counts[node.dataset.level] || 0) + 1 }), {})
}));
assert.equal(new Set(bankSelection.ids).size, 20, "20문항에 중복 문항이 없어야 합니다.");
assert.deepEqual(bankSelection.levels, { 1: 4, 2: 4, 3: 4, 4: 4, 5: 4 });
assert.equal(await page.locator("#coverCount").textContent(), "20 QUESTIONS");
await page.emulateMedia({ media: "print" });
const printCover = await page.locator("#coverSheet").boundingBox();
const printSheets = await page.locator(".sheet").evaluateAll((nodes) => nodes.map((node) => {
  const box = node.getBoundingClientRect();
  return { x: box.x, y: box.y, width: box.width, height: box.height, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight };
}));
const printSheet = printSheets[0];
assert.ok(Math.abs(printCover.width - 793.7) < 2, `cover A4 width drifted to ${printCover.width}`);
assert.ok(Math.abs(printCover.height - 1122.5) < 2, `cover A4 height drifted to ${printCover.height}`);
assert.ok(Math.abs(printSheet.width - 793.7) < 2, `A4 width drifted to ${printSheet.width}`);
assert.ok(Math.abs(printSheet.height - 1122.5) < 2, `A4 height drifted to ${printSheet.height}`);
assert.ok(Math.abs(printCover.x - printSheet.x) < 1, "cover and question page are not aligned");
assert.ok(printSheet.y >= printCover.y + printCover.height - 1, "question page must follow the cover");
for (const sheet of printSheets) {
  assert.ok(Math.abs(sheet.width - 793.7) < 2, JSON.stringify(sheet));
  assert.ok(Math.abs(sheet.height - 1122.5) < 2, JSON.stringify(sheet));
  assert.ok(sheet.scrollWidth <= sheet.width + 1 && sheet.scrollHeight <= sheet.height + 1, JSON.stringify(sheet));
}
const pdfBytes = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
const pdf = await PDFDocument.load(pdfBytes);
assert.equal(pdf.getPageCount(), 5, "표지 1장과 20문항 학습지 4장이 출력되어야 합니다.");
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-sheet.png", fullPage: true });

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.locator("#countInput").fill("20");
await page.locator("#countInput").dispatchEvent("change");
const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, problems: document.querySelectorAll(".problem").length, sheets: document.querySelectorAll(".sheet").length, coverWidth: document.querySelector("#coverSheet").getBoundingClientRect().width, sheetWidth: document.querySelector(".sheet").getBoundingClientRect().width }));
assert.equal(mobile.scrollWidth, mobile.width);
assert.equal(mobile.problems, 20);
assert.equal(mobile.sheets, 4);
assert.ok(Math.abs(mobile.coverWidth - mobile.sheetWidth) < 1, JSON.stringify(mobile));
assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, levelsChecked, bankSelection, printCover, printSheets, pdfPages: pdf.getPageCount(), mobile }, null, 2));
