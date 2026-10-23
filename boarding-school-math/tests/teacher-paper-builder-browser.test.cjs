"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const url = pathToFileURL(path.resolve(__dirname, "../teacher-paper-builder.html")).href;
let browser;
test.before(async () => { browser = await chromium.launch({ headless: true }); });
test.after(async () => { if (browser) await browser.close(); });

test("teacher can find, preview, select, order, and set points on released Grade 7 questions", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".item-row").count(), 36);
  await page.locator("#item-search").fill("단위율");
  assert.equal(await page.locator(".item-row").count(), 8);
  await page.getByRole("button", { name: "2번 미리보기", exact: true }).click();
  assert.match(await page.locator("#preview-index").innerText(), /원본 2번/);
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "2번 미리보기");
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "1번 시험지에 추가");
  await page.getByRole("checkbox", { name: "2번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".sheet-question").count(), 2);
  await page.getByRole("checkbox", { name: "3번 시험지에 추가", exact: true }).click();
  assert.equal(await page.locator(".sheet-question").count(), 2);
  assert.match(await page.locator("#builder-message").innerText(), /2문항까지/);
  await page.locator("#paper-title").fill("7학년 단위율 확인");
  await page.getByRole("spinbutton", { name: "1번 배점", exact: true }).fill("7");
  await page.getByRole("spinbutton", { name: "1번 배점", exact: true }).dispatchEvent("change");
  assert.match(await page.locator("#sheet-title").innerText(), /7학년 단위율 확인/);
  assert.match(await page.locator("#sheet-points").innerText(), /12점/);
  await page.getByRole("button", { name: "2번 위로", exact: true }).click();
  assert.equal(await page.locator(".sheet-question").first().getAttribute("data-item-id"), "g7rpa-w02");
  await page.locator("#level-filter").selectOption("advanced");
  assert.match(await page.locator("#selection-status").innerText(), /현재 결과 밖 2개/);
  assert.equal(await page.locator(".sheet-question").count(), 2);
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("a crowded A4 page cannot be printed with clipped working space", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  for (const number of [27, 28]) await page.getByRole("checkbox", { name: `${number}번 시험지에 추가`, exact: true }).check();
  for (const number of [27, 28]) {
    const lines = page.getByRole("spinbutton", { name: `${number}번 풀이 줄`, exact: true });
    await lines.fill("5"); await lines.dispatchEvent("change");
  }
  assert.equal(await page.locator("#print-paper").isDisabled(), true);
  assert.match(await page.locator("#print-status").innerText(), /한 장에 들어가지 않습니다/);
  for (const number of [27, 28]) {
    const lines = page.getByRole("spinbutton", { name: `${number}번 풀이 줄`, exact: true });
    await lines.fill("1"); await lines.dispatchEvent("change");
  }
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  await page.close();
});

test("paper builder fits mobile and tablet widths without page overflow", async () => {
  for (const width of [375, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, sheet: document.querySelector(".print-sheet").getBoundingClientRect().width, available: document.querySelector("#sheet-section").clientWidth }));
    assert.equal(size.scroll, size.client, `page overflow at ${width}px`);
    assert.ok(size.sheet <= size.available + 1, `paper preview overflow at ${width}px`);
    await page.close();
  }
});
