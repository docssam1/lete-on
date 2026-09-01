import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const url = `${baseUrl}/geometry/worksheet/path-walk/`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(url, { waitUntil: "networkidle" });

const levelsChecked = [];
for (const level of [1, 2, 3, 4, 5]) {
  await page.locator("#levelSelect").selectOption(String(level));
  assert.equal(await page.locator(".problem").count(), 6);
  assert.equal(await page.locator(".problem-board").count(), 6);
  levelsChecked.push({ level, title: await page.locator("#sheetTitle").textContent() });
}

await page.locator("#answerToggle").check();
assert.ok((await page.locator(".grid-cell.path").count()) > 0);
const answerText = await page.locator(".problem").first().textContent();
assert.match(answerText, /출발·도착 칸을 빼고/);
assert.match(answerText, /정답:\s*\d+칸/);

await page.emulateMedia({ media: "print" });
const printSheet = await page.locator("#sheet").boundingBox();
assert.ok(Math.abs(printSheet.width / printSheet.height - 210 / 297) < 0.03);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-path-walk-sheet.png", fullPage: true });

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, problems: document.querySelectorAll(".problem").length }));
assert.equal(mobile.scrollWidth, mobile.width);
assert.equal(mobile.problems, 6);
assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, levelsChecked, printSheet, mobile }, null, 2));
