import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const url = `${baseUrl}/geometry/worksheet/mirror-manor/`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(url, { waitUntil: "networkidle" });
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
const printSheet = await page.locator("#sheet").boundingBox();
assert.ok(Math.abs(printSheet.width - 793.7) < 2, `A4 width drifted to ${printSheet.width}`);
assert.ok(Math.abs(printSheet.height - 1122.5) < 2, `A4 height drifted to ${printSheet.height}`);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-sheet.png", fullPage: true });

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, problems: document.querySelectorAll(".problem").length }));
assert.equal(mobile.scrollWidth, mobile.width);
assert.equal(mobile.problems, 6);
assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, levelsChecked, printSheet, mobile }, null, 2));
