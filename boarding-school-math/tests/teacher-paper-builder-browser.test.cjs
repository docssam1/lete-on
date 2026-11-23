"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const url = pathToFileURL(path.resolve(__dirname, "../teacher-paper-builder.html")).href;
let browser;
test.before(async () => {
  const launchOptions = { headless: true };
  if (process.env.GFIELD_CHROME_EXECUTABLE) launchOptions.executablePath = process.env.GFIELD_CHROME_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
});
test.after(async () => { if (browser) await browser.close(); });

test("teacher can find, preview, select, order, and set points on released Grade 7 questions", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.locator("body").evaluate((node) => getComputedStyle(node).getPropertyValue("--primary").trim()), "#60418f", "the teacher tool follows the GFIELD plum palette");
  assert.equal(await page.locator("#strand-filter-disclosure").evaluate((node) => node.open), true, "desktop keeps the full topic filter visible");
  assert.equal(await page.locator("#sheet-section").isHidden(), true);
  assert.equal(await page.locator("#jump-to-sheet").isDisabled(), true);
  assert.equal(await page.locator(".item-row").count(), 36);
  assert.equal(await page.locator(".item-preview .question-choices .math-fraction").count(), 4);
  assert.equal((await page.locator(".item-preview .question-choices").innerText()).includes("3/8"), false);
  const mathText = await page.evaluate(() => {
    const probe = document.createElement("p");
    window.GFIELDMathText.append(probe, "날짜 2026/11/03 · 분수 3/8 · 계수 3/2x");
    return { labels: [...probe.querySelectorAll(".math-fraction")].map((fraction) => fraction.getAttribute("aria-label")), keepsDate: probe.innerText.includes("2026/11/03"), preservesCoefficientVariable: probe.textContent.endsWith("x") };
  });
  assert.deepEqual(mathText, { labels: ["8분의 3", "2분의 3"], keepsDate: true, preservesCoefficientVariable: true });
  await page.locator("#item-search").fill("단위율");
  assert.equal(await page.locator(".item-row").count(), 8);
  await page.getByRole("button", { name: "2번 미리보기", exact: true }).click();
  assert.match(await page.locator("#preview-index").innerText(), /7\.RP\.A 2번/);
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "2번 미리보기");
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator("#sheet-section").isVisible(), true);
  assert.deepEqual(await page.locator(".sheet-question .g7rpa-rate-model .math-fraction").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label"))), ["4분의 3", "2분의 1"]);
  assert.equal(await page.locator(".sheet-question .g7rpa-rate-model .g7rpa-quantity strong").evaluateAll((nodes) => nodes.some((node) => node.innerText.includes("/"))), false);
  assert.equal(await page.locator("#jump-to-sheet").isEnabled(), true);
  assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "1번 시험지에 추가");
  await page.getByRole("checkbox", { name: "2번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".sheet-question").count(), 2);
  assert.equal(await page.locator("#mobile-builder-action").isVisible(), false);
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
  assert.equal(await page.locator("#unit-filter option").count(), 7);
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

test("mobile selection keeps a fixed count and a keyboard-accessible shortcut to paper settings", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  const strandFilters = page.locator("#strand-filter-disclosure");
  assert.equal(await strandFilters.evaluate((node) => node.open), false, "mobile starts with the topic list collapsed to keep question search close");
  assert.equal(await page.locator("#strand-filter-current").innerText(), "전체 · 36문항");
  await strandFilters.locator("summary").click();
  await page.getByRole("button", { name: "분수의 비율과 단위율 8", exact: true }).click();
  assert.equal(await strandFilters.evaluate((node) => node.open), false);
  assert.equal(await page.locator("#result-count").innerText(), "8문항");
  assert.equal(await page.evaluate(() => document.activeElement.id), "list-title", "after applying a mobile topic filter, focus moves to the results");
  assert.equal(await page.locator("#strand-filter-current").innerText(), "분수의 비율과 단위율 · 8문항");
  await strandFilters.locator("summary").click();
  await page.getByRole("button", { name: "전체 36", exact: true }).click();
  assert.equal(await page.locator("#result-count").innerText(), "36문항");
  assert.equal(await page.locator("#item-list .item-row").count(), 36);
  assert.deepEqual(await page.locator("#item-list").evaluate((element) => ({
    heightMatchesContent: element.clientHeight === element.scrollHeight,
    maxHeight: getComputedStyle(element).maxHeight,
    overflowY: getComputedStyle(element).overflowY
  })), { heightMatchesContent: true, maxHeight: "none", overflowY: "visible" });
  const action = page.locator("#mobile-builder-action");
  assert.equal(await action.isHidden(), true);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await action.isVisible(), true);
  assert.equal(await action.innerText(), "시험지 편집 · 1문항");
  assert.equal(await action.getAttribute("aria-label"), "담은 문제 1개 편집하기");
  const geometry = await action.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { position: getComputedStyle(element).position, height: rect.height, bottom: rect.bottom, viewport: innerHeight };
  });
  assert.equal(geometry.position, "fixed");
  assert.ok(geometry.height >= 44);
  assert.ok(geometry.bottom <= geometry.viewport);
  await action.click();
  assert.equal(await page.evaluate(() => document.activeElement.id), "selected-items-heading");
  assert.equal(await page.locator("#selected-items-heading").evaluate((element) => getComputedStyle(element).outlineWidth), "3px");
  await page.waitForFunction(() => document.getElementById("mobile-builder-action").hidden);
  const headingBounds = await page.locator("#selected-items-heading").evaluate((element) => {
    const rect = element.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom, visibleBottom: innerHeight - 88 };
  });
  assert.ok(headingBounds.top >= 0 && headingBounds.bottom <= headingBounds.visibleBottom);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); });
  await page.waitForFunction(() => !document.getElementById("mobile-builder-action").hidden);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).uncheck();
  assert.equal(await action.isHidden(), true);
  assert.deepEqual(errors, []);
  await page.close();
});

test("all 432 public workbook items load without private diagnostics", async () => {
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

test("original Algebra 1 practice joins the teacher bank with a separate answer key", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("#unit-filter").selectOption("GFIELD-A1-U1");
  assert.equal(await page.locator("#item-list .item-row").count(), 14);
  assert.equal(await page.locator("#inventory-count").innerText(), "이 단원 14문항 · 전체 자체 제작 64문항");
  assert.match(await page.locator('label[for="level-filter"]').innerText(), /^자료 유형/);
  assert.match(await page.locator("#source-note").innerText(), /지필드 Algebra 1 수업에서 만든 연습 문제/);
  await page.getByRole("button", { name: "1번 미리보기", exact: true }).click();
  assert.match(await page.locator("#preview-index").innerText(), /Algebra 1 1\.1 · 수업 연습/);
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".key-answer").count(), 0);
  assert.match(await page.locator(".sheet-question").innerText(), /지필드 수업 연습/);
  await page.locator('input[name="output-kind"][value="answers"]').check();
  assert.match(await page.locator(".key-answer").innerText(), /7 \+ 2r; r = 5이면 17달러/);
  assert.match(await page.locator(".key-solution").innerText(), /입장료는 고정되어/);
  assert.match(await page.locator(".sheet-course-code").innerText(), /GFIELD Algebra 1/);
  await page.locator("#clear-selected").click();
  await page.locator("#unit-filter").selectOption("GFIELD-A1-U3");
  await page.locator("#item-search").fill("교점 좌표");
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".key-answer .math-fraction").count(), 2);
  assert.deepEqual(await page.locator(".key-answer .math-fraction").evaluateAll((fractions) => fractions.map((fraction) => fraction.getAttribute("aria-label"))), ["3분의 8", "3분의 14"]);
  assert.equal((await page.locator(".key-answer").innerText()).includes("8/3"), false);
  const unitCounts = [];
  for (let unit = 1; unit <= 5; unit += 1) {
    await page.locator("#clear-selected").click();
    await page.locator("#unit-filter").selectOption(`GFIELD-A1-U${unit}`);
    await page.locator("#select-visible").click();
    unitCounts.push(await page.locator(".sheet-question").count());
    assert.equal(await page.locator(".key-solution").count(), unitCounts.at(-1));
    assert.equal(await page.locator(".is-overflow").count(), 0);
  }
  assert.deepEqual(unitCounts, [14, 12, 12, 12, 14]);
  assert.deepEqual(errors, []);
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

test("each eligible unit can make a full A4 question sheet", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  let checked = 0;
  for (const grade of ["6", "7"]) {
    await page.locator("#grade-filter").selectOption(grade);
    const units = await page.locator("#unit-filter option").evaluateAll((options) => options.map((option) => option.value));
    for (const unit of units) {
      if (unit.startsWith("GFIELD-A1-")) continue;
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
  assert.equal(await page.locator("#sheet-section").isHidden(), true);
  assert.equal(await page.locator("#print-paper").isDisabled(), true);
  await page.close();
});

test("teacher answer key is separate from the question sheet and keeps the selected order", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("checkbox", { name: "1번 시험지에 추가", exact: true }).check();
  await page.getByRole("checkbox", { name: "2번 시험지에 추가", exact: true }).check();
  assert.equal(await page.locator(".key-answer").count(), 0);
  await page.locator('input[name="output-kind"][value="answers"]').check();
  assert.equal(await page.locator(".answer-page").count(), 1);
  assert.equal(await page.locator(".key-answer").count(), 2);
  assert.equal(await page.locator("#paper-pages .question-choices").count(), 0);
  assert.match(await page.locator("#sheet-heading").innerText(), /정답지/);
  assert.match(await page.locator("#print-paper").innerText(), /정답지/);
  assert.equal(await page.locator(".sheet-question").first().getAttribute("data-item-id"), "7.RP.A:g7rpa-w01");
  const firstSolution = page.locator(".key-solution").first();
  assert.deepEqual(await firstSolution.locator(".math-fraction").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label"))), ["4분의 3", "2분의 1", "2분의 3"]);
  assert.match(await firstSolution.innerText(), /km\/h입니다\./);
  await page.getByRole("button", { name: "7.RP.A 2번 위로", exact: true }).click();
  assert.equal(await page.locator(".sheet-question").first().getAttribute("data-item-id"), "7.RP.A:g7rpa-w02");
  await page.locator('input[name="cover-style"][value="formal"]').check();
  assert.match(await page.locator(".cover-kicker").innerText(), /정답지/);
  await page.locator('input[name="output-kind"][value="questions"]').check();
  assert.equal(await page.locator(".answer-page").count(), 0);
  assert.equal(await page.locator(".key-answer").count(), 0);
  assert.equal(await page.locator(".sheet-question").count(), 2);
  assert.deepEqual(errors, []);
  await page.close();
});

test("every public unit can paginate a full teacher key", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator('input[name="output-kind"][value="answers"]').check();
  let checked = 0;
  for (const grade of ["6", "7"]) {
    await page.locator("#grade-filter").selectOption(grade);
    const units = await page.locator("#unit-filter option").evaluateAll((options) => options.map((option) => option.value));
    for (const unit of units) {
      if (unit.startsWith("GFIELD-A1-")) continue;
      await page.locator("#unit-filter").selectOption(unit);
      await page.locator("#select-visible").click();
      assert.equal(await page.locator(".key-answer").count(), 36, unit);
      assert.equal(await page.locator(".key-solution").count(), 36, unit);
      assert.equal(await page.locator(".is-overflow").count(), 0, unit);
      assert.equal(await page.locator("#print-paper").isEnabled(), true, unit);
      await page.locator("#clear-selected").click();
      checked += 1;
    }
  }
  assert.equal(checked, 12);
  assert.deepEqual(errors, []);
  await page.close();
});

test("paper builder fits mobile and tablet widths without page overflow", async () => {
  const pageCounts = [];
  const keyPageCounts = [];
  for (const width of [375, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator('input[name="cover-style"][value="geometry"]').check();
    const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, sheets: [...document.querySelectorAll(".print-sheet")].map((sheet) => sheet.getBoundingClientRect().width), available: document.querySelector("#sheet-section").clientWidth }));
    assert.equal(size.scroll, size.client, `page overflow at ${width}px`);
    assert.ok(size.sheets.every((widthOfSheet) => widthOfSheet <= size.available + 1), `paper preview overflow at ${width}px`);
    await page.locator("#select-visible").click();
    pageCounts.push(await page.locator(".question-page").count());
    assert.equal(await page.evaluate(() => [...document.querySelectorAll(".order-controls button, .selected-summary button, .item-settings input")].every((node) => {
      const bounds = node.getBoundingClientRect();
      return bounds.width >= 44 && bounds.height >= 44;
    })), true, `small editor control at ${width}px`);
    await page.locator('input[name="output-kind"][value="answers"]').check();
    keyPageCounts.push(await page.locator(".answer-page").count());
    assert.equal(await page.locator(".key-answer").count(), 36);
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [width, width]);
    assert.equal(await page.locator(".is-overflow").count(), 0);
    await page.close();
  }
  assert.equal(new Set(pageCounts).size, 1, "A4 pagination must not depend on viewport width");
  assert.equal(new Set(keyPageCounts).size, 1, "answer pagination must not depend on viewport width");
});
