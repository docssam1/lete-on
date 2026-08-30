import { strict as assert } from "node:assert";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:8765/geometry/worksheet/net-observatory/", { waitUntil: "networkidle" });
await page.locator("#levelSelect").selectOption("2");
assert.match(await page.locator("#sheetTitle").textContent(), /그림 면 마주보기/);
assert.equal(await page.locator(".interaction-net-opposite").count(), 3);
assert.equal(await page.locator(".interaction-net-opposite .net-svg").count(), 3);
assert.equal(await page.locator(".interaction-net-opposite .face-option").count(), 9);

await page.locator("#answerToggle").check();
assert.equal(await page.locator(".interaction-net-opposite .face-option.correct").count(), 3);
await page.emulateMedia({ media: "print" });
const sheet = await page.locator(".sheet").evaluate((node) => {
  const box = node.getBoundingClientRect();
  return { width: box.width, height: box.height, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight };
});
assert.ok(Math.abs(sheet.width - 793.7) < 3, JSON.stringify(sheet));
assert.ok(Math.abs(sheet.height - 1122.5) < 3, JSON.stringify(sheet));
assert.ok(sheet.scrollWidth <= sheet.width + 1, JSON.stringify(sheet));
assert.ok(sheet.scrollHeight <= sheet.height + 1, JSON.stringify(sheet));
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-net-opposite-sheet.png", fullPage: true });

await page.emulateMedia({ media: "screen" });
await page.goto("http://127.0.0.1:8765/geometry/solid-vista/", { waitUntil: "networkidle" });
assert.match(await page.locator("#netLevelGrid .level-card").nth(1).textContent(), /그림 면 마주보기/);
assert.equal(errors.length, 0, errors.join("\n"));
console.log(JSON.stringify({ problems: 3, pictureChoices: 9, correctChoices: 3, sheet }, null, 2));
await browser.close();
