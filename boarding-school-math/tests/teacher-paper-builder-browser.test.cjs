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
  await page.locator("#paper-title").fill("7학년 단위율 확인");
  await page.getByRole("spinbutton", { name: "1번 배점", exact: true }).fill("7");
  await page.getByRole("spinbutton", { name: "1번 배점", exact: true }).dispatchEvent("change");
  assert.match(await page.locator(".sheet-title").first().innerText(), /7학년 단위율 확인/);
  assert.match(await page.locator(".sheet-points").first().innerText(), /12점/);
  await page.getByRole("button", { name: "2번 위로", exact: true }).click();
  assert.equal(await page.locator(".sheet-question").first().getAttribute("data-item-id"), "g7rpa-w02");
  await page.locator("#level-filter").selectOption("advanced");
  assert.match(await page.locator("#selection-status").innerText(), /현재 결과 밖 2개/);
  assert.equal(await page.locator(".sheet-question").count(), 2);
  await page.locator('input[name="cover-style"][value="formal"]').check();
  assert.equal(await page.locator(".cover-page").count(), 1);
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("long questions and working lines flow to another A4 page without clipping", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  for (const number of [27, 28]) await page.getByRole("checkbox", { name: `${number}번 시험지에 추가`, exact: true }).check();
  for (const number of [27, 28]) {
    const lines = page.getByRole("spinbutton", { name: `${number}번 풀이 줄`, exact: true });
    await lines.fill("5"); await lines.dispatchEvent("change");
  }
  assert.equal(await page.locator(".question-page").count(), 2);
  assert.equal(await page.locator(".sheet-question").count(), 2);
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  const overflow = await page.evaluate(() => [...document.querySelectorAll(".question-page")].some((paper) => {
    const article = paper.querySelector(".sheet-question:last-child");
    return article && article.getBoundingClientRect().bottom > paper.querySelector(".sheet-footer").getBoundingClientRect().top - 12;
  }));
  assert.equal(overflow, false);
  assert.equal(await page.locator(".sheet-page-number").allInnerTexts().then((values) => values.join(",")), "1 / 2,2 / 2");
  await page.close();
});

test("three covers use the entered paper details and the full public set paginates", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  await page.locator("#paper-course").fill("Grade 7 · 비율 단원");
  await page.locator("#paper-round").fill("3");
  for (const style of ["formal", "blue", "geometry"]) {
    await page.locator(`input[name="cover-style"][value="${style}"]`).check();
    assert.equal(await page.locator(`.cover-${style}`).count(), 1);
    assert.equal(await page.locator(".cover-course").innerText(), "Grade 7 · 비율 단원");
    assert.equal(await page.locator(".cover-round").innerText(), "3회차");
  }
  await page.locator('input[name="cover-style"][value="none"]').check();
  await page.locator("#select-visible").click();
  assert.equal(await page.locator(".sheet-question").count(), 36);
  assert.ok(await page.locator(".question-page").count() > 1);
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  await page.locator("#clear-selected").click();
  assert.equal(await page.locator(".sheet-question").count(), 0);
  assert.equal(await page.locator("#print-paper").isDisabled(), true);
  await page.close();
});

test("paper builder fits mobile and tablet widths without page overflow", async () => {
  const pageCounts = [];
  for (const width of [375, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator('input[name="cover-style"][value="geometry"]').check();
    const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, sheets: [...document.querySelectorAll(".print-sheet")].map((sheet) => sheet.getBoundingClientRect().width), available: document.querySelector("#sheet-section").clientWidth }));
    assert.equal(size.scroll, size.client, `page overflow at ${width}px`);
    assert.ok(size.sheets.every((widthOfSheet) => widthOfSheet <= size.available + 1), `paper preview overflow at ${width}px`);
    await page.locator("#select-visible").click();
    pageCounts.push(await page.locator(".question-page").count());
    await page.close();
  }
  assert.equal(new Set(pageCounts).size, 1, "A4 pagination must not depend on viewport width");
});
