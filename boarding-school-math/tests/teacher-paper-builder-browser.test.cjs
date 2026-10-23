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
  assert.match(await page.locator("#preview-index").innerText(), /7\.RP\.A 2번/);
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "2번 미리보기");
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "1번 시험지에 추가");
  await page.getByRole("checkbox", { name: "2번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".sheet-question").count(), 2);
  await page.locator("#paper-title").fill("7학년 단위율 확인");
  await page.getByRole("spinbutton", { name: "7.RP.A 1번 배점", exact: true }).fill("7");
  await page.getByRole("spinbutton", { name: "7.RP.A 1번 배점", exact: true }).dispatchEvent("change");
  assert.match(await page.locator(".sheet-title").first().innerText(), /7학년 단위율 확인/);
  assert.match(await page.locator(".sheet-points").first().innerText(), /12점/);
  await page.getByRole("button", { name: "7.RP.A 2번 위로", exact: true }).click();
  assert.equal(await page.locator(".sheet-question").first().getAttribute("data-item-id"), "7.RP.A:g7rpa-w02");
  await page.locator("#level-filter").selectOption("advanced");
  assert.match(await page.locator("#selection-status").innerText(), /현재 결과 밖 2개/);
  assert.equal(await page.locator(".sheet-question").count(), 2);
  await page.locator('input[name="cover-style"][value="formal"]').check();
  assert.equal(await page.locator(".cover-page").count(), 1);
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("public Grade 6–7 units keep selections across filters and print mixed answer formats", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#unit-filter option").count(), 2);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  await page.locator("#unit-filter").selectOption("7.NS.A");
  assert.equal(await page.locator(".item-row").count(), 36);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  await page.locator("#grade-filter").selectOption("6");
  assert.equal(await page.locator("#unit-filter option").count(), 10);
  assert.equal(await page.locator(".item-row").count(), 36);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".sheet-question").count(), 3);
  assert.equal(await page.locator(".sheet-question .written-answer").count(), 1);
  assert.equal(await page.locator(".sheet-question .question-choices").count(), 2);
  assert.match(await page.locator("#paper-title").inputValue(), /Grade 6–7 단원 확인 평가/);
  assert.match(await page.locator("#selection-status").innerText(), /현재 결과 밖 2개/);
  assert.match(await page.locator(".sheet-course-code").first().innerText(), /3개 단원/);
  assert.deepEqual(errors, []);
  await page.close();
});

test("all 432 released workbook items load without private diagnostics", async () => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const inventory = await page.evaluate(() => {
    const sources = Object.keys(window).filter((name) => /^GFIELDGrade[67].*UnitWorkbook$/.test(name)).map((name) => window[name]);
    const errors = [];
    const ids = new Set();
    for (const api of sources) for (const item of api.pack.workbookItems) {
      const key = `${api.pack.clusterId}:${item.id}`;
      if (ids.has(key)) errors.push(`duplicate ${key}`);
      ids.add(key);
      try { api.renderVisual(item, "ko", "student"); } catch (error) { errors.push(`${key}: ${error.message}`); }
      if (!item.prompt?.ko) errors.push(`missing prompt ${key}`);
    }
    return { sources: sources.length, items: ids.size, errors,
      publicOnly: sources.every((api) => api.pack.contentOrigin === "gfield-original-authored-public-unit-workbook" &&
        api.pack.rights?.publication === "public" && api.pack.rights?.assetRights === "original" &&
        api.pack.rights?.containsThirdPartyAssets === false) };
  });
  assert.deepEqual(inventory, { sources: 12, items: 432, errors: [], publicOnly: true });
  await page.close();
});

test("print waits for the rendered sheet and fonts", async () => {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  await page.evaluate(() => {
    window.__printSnapshot = null;
    window.print = () => { window.__printSnapshot = {
      pageCount: document.querySelectorAll(".question-page").length,
      itemCount: document.querySelectorAll(".sheet-question").length,
      fontsReady: document.fonts.status === "loaded"
    }; };
  });
  await page.locator("#print-paper").click();
  await page.waitForFunction(() => window.__printSnapshot !== null);
  assert.deepEqual(await page.evaluate(() => window.__printSnapshot), { pageCount: 1, itemCount: 1, fontsReady: true });
  assert.equal(await page.locator("#print-paper").isEnabled(), true);
  await page.close();
});

test("each released unit can make a full A4 question sheet", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  let checked = 0;
  for (const grade of ["6", "7"]) {
    await page.locator("#grade-filter").selectOption(grade);
    const units = await page.locator("#unit-filter option").evaluateAll((options) => options.map((option) => option.value));
    for (const unit of units) {
      await page.locator("#unit-filter").selectOption(unit);
      await page.locator("#select-visible").click();
      assert.equal(await page.locator(".sheet-question").count(), 36, unit);
      assert.equal(await page.locator("#print-paper").isEnabled(), true, unit);
      assert.equal(await page.locator(".is-overflow").count(), 0, unit);
      await page.locator("#clear-selected").click();
      checked += 1;
    }
  }
  assert.equal(checked, 12);
  assert.deepEqual(errors, []);
  await page.close();
});

test("long questions and working lines flow to another A4 page without clipping", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "networkidle" });
  for (const number of [27, 28]) await page.getByRole("checkbox", { name: `${number}번 시험지에 추가`, exact: true }).check();
  for (const number of [27, 28]) {
    const lines = page.getByRole("spinbutton", { name: `7.RP.A ${number}번 풀이 줄`, exact: true });
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
