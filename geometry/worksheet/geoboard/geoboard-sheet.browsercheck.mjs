import { strict as assert } from "node:assert";
import { createRequire } from "node:module";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";

const require = createRequire(import.meta.url);
const { PDFDocument } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib/cjs/index.js");

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8771").replace(/\/$/, "");
const output = "C:/Users/user/AppData/Local/Temp/gfield-geoboard-worksheet-a4.png";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(`${baseUrl}/geometry/worksheet/geoboard/`, { waitUntil: "networkidle" });
assert.equal(await page.locator("#coverToggle").isChecked(), true);
assert.equal(await page.locator("#coverSheet").isVisible(), true);
assert.match(await page.locator("#coverLevel").textContent(), /1031 입문/);
await page.locator("#coverToggle").uncheck();
assert.equal(await page.locator("#coverSheet").isVisible(), false);
await page.locator("#coverToggle").check();

for (const level of [1, 2, 3, 4, 5]) {
  await page.locator("#levelSelect").selectOption(String(level));
  await page.locator("#countInput").fill("6");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator(".problem").count(), 6, `level ${level} problem count`);
  assert.equal(await page.locator(".problem[data-problem-id]").count(), 6, `level ${level} source ids`);
  assert.equal(await page.locator(".pegboard-svg").count() >= 6, true, `level ${level} source diagrams`);
}

await page.locator("#levelSelect").selectOption("1");
assert.equal(await page.locator(".model-pair").count(), 6);
assert.equal(await page.locator(".answer-band").count(), 0);
await page.locator("#answerToggle").check();
assert.equal(await page.locator(".answer-band").count(), 6);

await page.locator("#levelSelect").selectOption("3");
assert.ok(await page.locator(".type-solution").count() >= 1, "square type solutions must be visible");
assert.ok(await page.locator(".count-answer").count() >= 1, "square placement total must be visible");

await page.locator("#levelSelect").selectOption("4");
assert.ok(await page.locator(".triangular-board").count() >= 6, "triangular boards must render");
assert.ok(await page.locator(".type-solution").count() >= 1, "triangle type solutions must be visible");

await page.locator("#levelSelect").selectOption("5");
assert.equal(await page.locator(".partition-answer-line").count() >= 12, true, "outline and answer chords must render");
assert.ok(await page.locator(".required-ring").count() >= 1, "required vertex must be marked");
assert.match(await page.locator(".problem").first().locator(".answer-line").textContent(), /가능한 답/);

await page.locator("#levelSelect").selectOption("all");
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
const printSheets = [];
for (const [pageIndex, locator] of (await page.locator(".sheet").all()).entries()) {
  const sheet = await locator.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return { width: box.width, height: box.height, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight };
  });
  assert.ok(Math.abs(sheet.width - 793.7) < 2.5, `page ${pageIndex + 1}: ${JSON.stringify(sheet)}`);
  assert.ok(Math.abs(sheet.height - 1122.5) < 2.5, `page ${pageIndex + 1}: ${JSON.stringify(sheet)}`);
  assert.ok(sheet.scrollWidth <= sheet.width + 1, `page ${pageIndex + 1}: ${JSON.stringify(sheet)}`);
  assert.ok(sheet.scrollHeight <= sheet.height + 1, `page ${pageIndex + 1}: ${JSON.stringify(sheet)}`);
  printSheets.push({ page: pageIndex + 1, ...sheet });
}
const cover = await page.locator("#coverSheet").evaluate((node) => {
  const box = node.getBoundingClientRect();
  return { x: box.x, y: box.y, width: box.width, height: box.height, scrollWidth: node.scrollWidth, scrollHeight: node.scrollHeight };
});
const question = await page.locator(".sheet").first().evaluate((node) => {
  const box = node.getBoundingClientRect();
  return { x: box.x, y: box.y, width: box.width, height: box.height };
});
assert.ok(Math.abs(cover.width - 793.7) < 2.5, JSON.stringify(cover));
assert.ok(Math.abs(cover.height - 1122.5) < 2.5, JSON.stringify(cover));
assert.ok(cover.scrollWidth <= cover.width + 1 && cover.scrollHeight <= cover.height + 1, JSON.stringify(cover));
assert.ok(Math.abs(cover.x - question.x) < 1, "cover and question page are not aligned");
assert.ok(question.y >= cover.y + cover.height - 1, "question page must follow the cover");
const pdfBytes = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
const pdf = await PDFDocument.load(pdfBytes);
assert.equal(pdf.getPageCount(), 5, "표지 1장과 20문항 학습지 4장이 출력되어야 합니다.");
await page.locator(".sheet").first().screenshot({ path: output });
const metadata = await sharp(output).metadata();
const stats = await sharp(output).stats();
assert.ok(Math.abs(metadata.width - 794) <= 2, JSON.stringify(metadata));
assert.ok(Math.abs(metadata.height - 1123) <= 2, JSON.stringify(metadata));
assert.ok(stats.entropy > 0.7, `worksheet screenshot is too blank: ${stats.entropy}`);
assert.ok(stats.channels.slice(0, 3).some((channel) => channel.stdev > 18), "worksheet lacks visible tonal detail");

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
for (const level of [1, 2, 3, 4, 5]) {
  await page.locator("#levelSelect").selectOption(String(level));
  await page.locator("#countInput").fill("6");
  await page.locator("#countInput").dispatchEvent("change");
  const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, coverWidth: document.querySelector("#coverSheet").getBoundingClientRect().width, sheetWidth: document.querySelector(".sheet").getBoundingClientRect().width }));
  assert.ok(mobile.scrollWidth <= mobile.width + 1, `level ${level}: ${JSON.stringify(mobile)}`);
  assert.ok(Math.abs(mobile.coverWidth - mobile.sheetWidth) < 1, `level ${level}: ${JSON.stringify(mobile)}`);
  assert.equal(await page.locator(".problem").count(), 6);
  const widest = await page.locator(".pegboard-svg").evaluateAll((nodes) => Math.max(...nodes.map((node) => node.getBoundingClientRect().right)));
  assert.ok(widest <= 390.5, `level ${level} SVG overflow: ${widest}`);
}
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-geoboard-worksheet-mobile.png", fullPage: true });

assert.equal(errors.length, 0, errors.join("\n"));
console.log(JSON.stringify({ baseUrl, levels: 5, problemsPerLevel: 6, bankSelection, printSheets, cover, pdfPages: pdf.getPageCount(), screenshot: { ...metadata, entropy: stats.entropy }, mobileWidth: 390 }, null, 2));
await browser.close();
