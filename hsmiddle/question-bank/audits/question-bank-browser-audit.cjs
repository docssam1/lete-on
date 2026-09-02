#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const sourcePageIndex = require("../data/source-page-index.js");

const url = process.env.HSMIDDLE_URL || "http://127.0.0.1:8892/hsmiddle/question-bank/";
const outputDir = process.env.HSMIDDLE_BROWSER_OUTPUT || path.resolve(__dirname, "..", "..", "..", "tmp", "hsmiddle-question-bank-browser-audit");
fs.mkdirSync(outputDir, { recursive: true });

const failures = [];
const releaseLockedNumbers = new Set();
const releaseEligibleNumbers = Array.from({ length: 40 }, function (_, index) { return index + 1; }).filter(function (number) {
  return !releaseLockedNumbers.has(number);
});

function fail(message) {
  failures.push(message);
}

function watch(page, label) {
  page.on("pageerror", error => fail(`${label} page error: ${error.message}`));
  page.on("requestfailed", request => {
    const requestUrl = request.url();
    if (!requestUrl.includes("cdn.jsdelivr.net")) fail(`${label} request failed: ${requestUrl}`);
  });
}

async function enter(page, destination) {
  await page.goto(destination || url, { waitUntil: "domcontentloaded" });
  await page.evaluate(function () {
    localStorage.setItem("hs-student", "DEMO");
    localStorage.setItem("hs-code", "HS-DEMO");
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#app:not([hidden])").waitFor({ state: "visible" });
}

async function enterAsAdmin(page, destination) {
  await page.goto(destination || url, { waitUntil: "domcontentloaded" });
  await page.evaluate(function () {
    const name = window.HSMIDDLE_DATA.admins[0];
    localStorage.setItem("hs-student", name);
    localStorage.setItem("hs-code", window.HSMIDDLE_DATA.studentCode[name]);
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#app:not([hidden])").waitFor({ state: "visible" });
}

async function noOverflow(page, label) {
  const dimensions = await page.evaluate(function () {
    return {
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    };
  });
  if (dimensions.document > dimensions.viewport + 1) {
    fail(`${label} horizontal overflow: ${dimensions.document} > ${dimensions.viewport}`);
  }
}

function card(page, number) {
  return page.locator(".type-card").filter({ has: page.locator(".q-number", { hasText: new RegExp(`^${number}$`) }) }).first();
}

async function waitForImages(page) {
  await page.waitForFunction(function () {
    const images = [...document.querySelectorAll("#pageStream img")];
    return images.length > 0 && images.every(image => image.complete && image.naturalWidth > 0);
  });
}

async function openAndCheckType(page, number, count, problemPages, answerSolutionPages, screenshotPrefix) {
  await card(page, number).locator("input[type=checkbox]").check();
  await page.click("#buildButton");
  await page.locator("#worksheetView:not([hidden])").waitFor({ state: "visible" });
  await waitForImages(page);
  await noOverflow(page, `q${number} problem`);
  const problemSources = await page.locator("#pageStream img").evaluateAll(images => images.map(image => image.getAttribute("src")));
  const expectedProblem = problemPages.map(pageNumber => `../assets/similar/q${String(number).padStart(2, "0")}/page-${pageNumber}.png`).join("|");
  if (problemSources.join("|") !== expectedProblem) fail(`q${number} problem pages are wrong: ${problemSources.join(", ")}`);
  if (!(await page.locator(".set-heading").innerText()).includes(`문제 ${count}문항`)) fail(`q${number} worksheet count is not ${count}`);
  if (screenshotPrefix) await page.screenshot({ path: path.join(outputDir, `${screenshotPrefix}-problem.png`), fullPage: true });

  await page.click('.view-tabs button[data-view="solution"]');
  await waitForImages(page);
  const solutionSources = await page.locator("#pageStream img").evaluateAll(images => images.map(image => image.getAttribute("src")));
  const expectedSolution = answerSolutionPages.map(pageNumber => `../assets/similar/q${String(number).padStart(2, "0")}/page-${pageNumber}.png`).join("|");
  if (solutionSources.join("|") !== expectedSolution) fail(`q${number} answer/solution pages are wrong: ${solutionSources.join(", ")}`);
  if (screenshotPrefix) await page.screenshot({ path: path.join(outputDir, `${screenshotPrefix}-solution.png`), fullPage: true });
}

async function returnAndClear(page, number) {
  await page.click("#backToBuilder");
  await page.locator("#builderView:not([hidden])").waitFor({ state: "visible" });
  await card(page, number).locator("input[type=checkbox]").uncheck();
}

async function auditVisualSource(browser, number, problemPageNumbers) {
  const folder = `q${String(number).padStart(2, "0")}`;
  const sourceUrl = new URL(`../assets/similar/${folder}/page-1.png`, url).href;
  for (const config of [
    { label: "desktop", width: 1440, height: 1000 },
    { label: "mobile", width: 390, height: 844 }
  ]) {
    const page = await browser.newPage({ viewport: { width: config.width, height: config.height }, deviceScaleFactor: 1 });
    watch(page, `${folder}-source-${config.label}`);
    await page.setContent(`<style>html,body{margin:0;background:#eef3f6}main{width:min(100%,1075px);margin:0 auto;background:white}img{display:block;width:100%;height:auto}</style><main><img src="${sourceUrl}" alt="${number}번 원본 문제 1쪽"></main>`);
    await page.locator("img").evaluate(image => image.complete ? true : new Promise(resolve => image.addEventListener("load", () => resolve(true), { once: true })));
    const imageMetrics = await page.locator("img").evaluate(image => {
      const box = image.getBoundingClientRect();
      return { naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, left: box.left, right: box.right, width: box.width };
    });
    if (imageMetrics.naturalWidth !== 1075 || imageMetrics.naturalHeight !== 1521) fail(`${folder} ${config.label} source dimensions changed`);
    if (imageMetrics.left < -0.5 || imageMetrics.right > config.width + 0.5 || imageMetrics.width <= 0) fail(`${folder} ${config.label} source page is clipped`);
    await page.screenshot({ path: path.join(outputDir, `${folder}-source-${config.label}.png`), fullPage: true });
    await page.close();
  }

  const printPage = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
  watch(printPage, `${folder}-source-a4`);
  const sourcePages = problemPageNumbers.map(pageNumber => new URL(`../assets/similar/${folder}/page-${pageNumber}.png`, url).href);
  await printPage.setContent(`<style>@page{size:A4;margin:0}html,body{margin:0}.sheet{width:210mm;height:297mm;break-after:page;display:grid;place-items:center;overflow:hidden}.sheet:last-child{break-after:auto}.sheet img{display:block;width:100%;height:100%;object-fit:contain}</style>${sourcePages.map((source, index) => `<section class="sheet"><img src="${source}" alt="${number}번 원본 문제 ${index + 1}쪽"></section>`).join("")}`);
  await printPage.locator("img").evaluateAll(images => Promise.all(images.map(image => {
    if (image.complete) return true;
    return new Promise(resolve => image.addEventListener("load", () => resolve(true), { once: true }));
  })));
  const pdfPath = path.join(outputDir, `${folder}-problem-a4.pdf`);
  await printPage.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfPageCount = (pdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  if (pdfPageCount !== problemPageNumbers.length) fail(`${folder} A4 source PDF has a blank or missing page: ${pdfPageCount} pages`);
  await printPage.close();
}

(async function () {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSMIDDLE_CHROMIUM_EXECUTABLE || undefined });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    watch(desktop, "desktop");
    await enter(desktop);
    await noOverflow(desktop, "desktop catalog");

    const bodyText = await desktop.locator("body").innerText();
    if (!bodyText.includes("40개 유형 · 원본 확인 302문항 · 출제 가능 302문항")) fail("catalog summary does not show all confirmed items as eligible");
    if (bodyText.includes("400문제") || bodyText.includes("검수된 10문제")) fail("legacy fixed ten-question claim is still visible");

    for (const number of releaseEligibleNumbers) {
      const eligibleCard = card(desktop, number);
      if (!(await eligibleCard.innerText()).includes("원본·답안 확인")) fail(`q${String(number).padStart(2, "0")} complete source bundle is not shown as verified`);
      if (!(await eligibleCard.locator("input[type=checkbox]").isEnabled())) fail(`q${String(number).padStart(2, "0")} complete source type is not selectable`);
    }
    for (const number of [6, 25, 39]) {
      if (!(await card(desktop, number).locator("input[type=checkbox]").isEnabled())) fail(`q${String(number).padStart(2, "0")} resolved type is not selectable`);
      if (!(await card(desktop, number).innerText()).includes("원본·답안 확인")) fail(`q${String(number).padStart(2, "0")} resolved type is not shown as verified`);
    }
    if (!(await card(desktop, 13).innerText()).includes("수 카드로 배수를 만들고 조건에 맞는 수 찾기")) fail("q13 normalized Korean type name is missing");
    if (!(await card(desktop, 14).innerText()).includes("배열 순서와 도형·점·타일 수의 대응 관계 찾기")) fail("q14 normalized Korean type name is missing");
    if (!(await card(desktop, 15).innerText()).includes("주어진 대응쌍과 기계의 규칙을 식으로 나타내기")) fail("q15 normalized Korean type name is missing");
    if (!(await card(desktop, 16).innerText()).includes("같은 모양·글자에 숨은 숫자를 찾는 나눗셈")) fail("q16 normalized Korean type name is missing");
    if (!(await card(desktop, 17).innerText()).includes("가려진 자리에 수를 넣어 여러 배수 조건 맞추기")) fail("q17 normalized Korean type name is missing");
    if (!(await card(desktop, 18).innerText()).includes("두 톱니바퀴가 처음 위치에서 다시 만나는 회전 수와 시간 구하기")) fail("q18 normalized Korean type name is missing");
    if (!(await card(desktop, 19).innerText()).includes("전개도를 접어 마주 보는 면과 보이지 않는 뒤 면의 수 구하기")) fail("q19 normalized Korean type name is missing");
    if (!(await card(desktop, 20).innerText()).includes("분수와 대분수를 비교해 순서와 조건에 맞는 값 찾기")) fail("q20 normalized Korean type name is missing");
    if (!(await card(desktop, 21).innerText()).includes("분자와 분모의 범위에 맞는 크기가 같은 분수의 개수 구하기")) fail("q21 normalized Korean type name is missing");
    if (!(await card(desktop, 22).innerText()).includes("분수의 규칙을 찾아 정해진 두 항의 차 구하기")) fail("q22 normalized Korean type name is missing");
    if (!(await card(desktop, 23).innerText()).includes("전체를 1로 보고 남은 양과 처음 양 구하기")) fail("q23 normalized Korean type name is missing");
    if (!(await card(desktop, 24).innerText()).includes("분수의 크기 비교와 계산 규칙을 이용해 식 계산하기")) fail("q24 normalized Korean type name is missing");
    if (!(await card(desktop, 25).innerText()).includes("가로와 세로에서 길의 폭을 빼 남은 땅의 넓이 구하기")) fail("q25 normalized Korean type name is missing");
    if (!(await card(desktop, 26).innerText()).includes("넓이의 배와 밑변 길이의 배를 이용해 삼각형 넓이 구하기")) fail("q26 normalized Korean type name is missing");
    if (!(await card(desktop, 27).innerText()).includes("하루에 빨라지거나 느려지는 시간으로 며칠 뒤 시각 구하기")) fail("q27 normalized Korean type name is missing");
    if (!(await card(desktop, 28).innerText()).includes("시계의 두 바늘이 이루는 각과 움직인 각 구하기")) fail("q28 normalized Korean type name is missing");
    if (!(await card(desktop, 28).innerText()).includes("4-1") || !(await card(desktop, 28).innerText()).includes("2단원 각도")) fail("q28 source curriculum link is wrong");
    if (!(await card(desktop, 29).innerText()).includes("수도꼭지에서 나오는 물의 양과 걸리는 시간 구하기")) fail("q29 normalized Korean type name is missing");
    if (!(await card(desktop, 30).innerText()).includes("합동인 도형의 수 구하기")) fail("q30 normalized Korean type name is missing");
    if (!(await card(desktop, 31).innerText()).includes("두 터널의 길이와 통과 시간으로 열차의 길이 구하기")) fail("q31 normalized Korean type name is missing");
    if (!(await card(desktop, 32).innerText()).includes("잘못 계산한 소수의 나눗셈에서 어떤 수와 몫 구하기")) fail("q32 normalized Korean type name is missing");
    if (!(await card(desktop, 33).innerText()).includes("소수의 나눗셈에서 몫·나머지와 반올림한 몫 구하기")) fail("q33 normalized Korean type name is missing");
    if (!(await card(desktop, 34).innerText()).includes("백분율로 실제 수와 겹치는 수, 원가 구하기")) fail("q34 normalized Korean type name is missing");
    if (!(await card(desktop, 35).innerText()).includes("굴러간 원의 이동 거리와 지나간 자리 넓이 구하기")) fail("q35 normalized Korean type name is missing");
    if (!(await card(desktop, 36).innerText()).includes("칸막이와 나무토막이 있는 수조의 물 높이와 부피 구하기")) fail("q36 normalized Korean type name is missing");
    if (!(await card(desktop, 37).innerText()).includes("삼각기둥 옆면을 따라 그은 45° 선으로 높이 구하기")) fail("q37 normalized Korean type name is missing");
    if (!(await card(desktop, 38).innerText()).includes("분수를 자연수와 겹분수로 나타내고 계산하기")) fail("q38 normalized Korean type name is missing");
    if (!(await card(desktop, 39).innerText()).includes("한 자리 소수를 여러 번 곱한 수의 특정 소수 자리 숫자 구하기")) fail("q39 normalized Korean type name is missing");
    if (!(await card(desktop, 40).innerText()).includes("전자 숫자를 180° 돌려도 같은 수가 되는 수의 개수 구하기")) fail("q40 normalized Korean type name is missing");

    for (let number = 1; number <= 40; number += 1) {
      const problemPageNumbers = sourcePageIndex.pages
        .filter(function (page) { return page.diagnosticNumber === number && page.role === "problem"; })
        .map(function (page) { return page.pageNumber; });
      if (!problemPageNumbers.length) fail(`q${String(number).padStart(2, "0")} has no indexed problem page`);
      await auditVisualSource(browser, number, problemPageNumbers);
    }

    await desktop.click("#toggleVisible");
    const bulkSelected = await desktop.locator('.type-card input[type="checkbox"]:checked').evaluateAll(function (inputs) {
      return inputs.map(function (input) {
        return Number(input.closest(".type-card").querySelector(".q-number").textContent);
      });
    });
    if (bulkSelected.join("|") !== releaseEligibleNumbers.join("|")) fail(`bulk selection bypassed release locks: ${bulkSelected.join(",")}`);
    await desktop.click("#toggleVisible");
    if (await desktop.locator('.type-card input[type="checkbox"]:checked').count()) fail("bulk selection did not clear eligible types");
    await desktop.screenshot({ path: path.join(outputDir, "catalog-desktop.png"), fullPage: true });

    await openAndCheckType(desktop, 2, 8, [1, 2], [3, 4], "q02-desktop");

    await desktop.emulateMedia({ media: "print" });
    const pdfPath = path.join(outputDir, "q02-answer-solution-a4.pdf");
    await desktop.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const pdfBytes = fs.readFileSync(pdfPath);
    if (pdfBytes.length < 100000 || pdfBytes.subarray(0, 4).toString() !== "%PDF") fail("A4 PDF was not rendered correctly");
    const pdfPageCount = (pdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (pdfPageCount !== 2) fail(`A4 PDF has a blank cover or missing source page: ${pdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 2);
    await openAndCheckType(desktop, 13, 10, [1, 2, 3], [4, 5, 6]);
    await returnAndClear(desktop, 13);
    await openAndCheckType(desktop, 17, 6, [1, 2], [3, 4]);
    await returnAndClear(desktop, 17);
    await openAndCheckType(desktop, 27, 4, [1], [3], "q27-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q27PdfPath = path.join(outputDir, "q27-answer-solution-a4.pdf");
    await desktop.pdf({ path: q27PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q27PdfBytes = fs.readFileSync(q27PdfPath);
    const q27PdfPageCount = (q27PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q27PdfPageCount !== 1) fail(`q27 A4 answer/solution PDF has duplicate or blank pages: ${q27PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 27);
    await openAndCheckType(desktop, 28, 15, [1, 2, 3], [5, 6, 7], "q28-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q28PdfPath = path.join(outputDir, "q28-answer-solution-a4.pdf");
    await desktop.pdf({ path: q28PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q28PdfBytes = fs.readFileSync(q28PdfPath);
    const q28PdfPageCount = (q28PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q28PdfPageCount !== 3) fail(`q28 A4 answer/solution PDF has duplicate or blank pages: ${q28PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 28);
    await openAndCheckType(desktop, 29, 7, [1, 2], [3, 4], "q29-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q29PdfPath = path.join(outputDir, "q29-answer-solution-a4.pdf");
    await desktop.pdf({ path: q29PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q29PdfBytes = fs.readFileSync(q29PdfPath);
    const q29PdfPageCount = (q29PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q29PdfPageCount !== 2) fail(`q29 A4 answer/solution PDF has a blank or missing page: ${q29PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 29);
    await openAndCheckType(desktop, 30, 13, [1, 2, 3], [5, 6, 7], "q30-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q30PdfPath = path.join(outputDir, "q30-answer-solution-a4.pdf");
    await desktop.pdf({ path: q30PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q30PdfBytes = fs.readFileSync(q30PdfPath);
    const q30PdfPageCount = (q30PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q30PdfPageCount !== 3) fail(`q30 A4 answer/solution PDF has a blank or missing page: ${q30PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 30);
    await openAndCheckType(desktop, 31, 2, [1], [2, 3], "q31-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q31PdfPath = path.join(outputDir, "q31-answer-solution-a4.pdf");
    await desktop.pdf({ path: q31PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q31PdfBytes = fs.readFileSync(q31PdfPath);
    const q31PdfPageCount = (q31PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q31PdfPageCount !== 2) fail(`q31 A4 answer/solution PDF has a blank or missing page: ${q31PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 31);
    await openAndCheckType(desktop, 32, 15, [1, 2, 3, 4], [5, 6, 7], "q32-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q32PdfPath = path.join(outputDir, "q32-answer-solution-a4.pdf");
    await desktop.pdf({ path: q32PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q32PdfBytes = fs.readFileSync(q32PdfPath);
    const q32PdfPageCount = (q32PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q32PdfPageCount !== 3) fail(`q32 A4 answer/solution PDF has a blank or missing page: ${q32PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 32);
    await openAndCheckType(desktop, 33, 12, [1, 2], [3, 4], "q33-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q33PdfPath = path.join(outputDir, "q33-answer-solution-a4.pdf");
    await desktop.pdf({ path: q33PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q33PdfBytes = fs.readFileSync(q33PdfPath);
    const q33PdfPageCount = (q33PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q33PdfPageCount !== 2) fail(`q33 A4 answer/solution PDF has a blank or missing page: ${q33PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 33);
    await openAndCheckType(desktop, 34, 5, [1, 2], [3, 4], "q34-desktop");

    await desktop.emulateMedia({ media: "print" });
    const q34PdfPath = path.join(outputDir, "q34-answer-solution-a4.pdf");
    await desktop.pdf({ path: q34PdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const q34PdfBytes = fs.readFileSync(q34PdfPath);
    const q34PdfPageCount = (q34PdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (q34PdfPageCount !== 2) fail(`q34 A4 answer/solution PDF has a blank or missing page: ${q34PdfPageCount} pages`);
    await desktop.emulateMedia({ media: "screen" });

    await returnAndClear(desktop, 34);
    await openAndCheckType(desktop, 40, 6, [1, 2], [3, 4], "q40-desktop");
    await returnAndClear(desktop, 40);

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    watch(mobile, "mobile");
    await enter(mobile);
    await noOverflow(mobile, "mobile catalog");
    const mobileQ02 = card(mobile, 2);
    const cardBox = await mobileQ02.boundingBox();
    if (!cardBox || cardBox.x < 0 || cardBox.x + cardBox.width > 390) fail("q02 mobile card is clipped");
    await mobile.screenshot({ path: path.join(outputDir, "catalog-mobile.png"), fullPage: true });

    await mobileQ02.locator("input[type=checkbox]").check();
    await mobile.click("#buildButton");
    await mobile.locator("#worksheetView:not([hidden])").waitFor({ state: "visible" });
    await waitForImages(mobile);
    await noOverflow(mobile, "mobile problem");
    const mobileSources = await mobile.locator("#pageStream img").evaluateAll(images => images.map(image => image.getAttribute("src")));
    if (mobileSources.join("|") !== "../assets/similar/q02/page-1.png|../assets/similar/q02/page-2.png") fail("q02 mobile problem pages are not separated from answers");
    await mobile.screenshot({ path: path.join(outputDir, "q02-problem-mobile.png"), fullPage: true });

    await returnAndClear(mobile, 2);
    await openAndCheckType(mobile, 28, 15, [1, 2, 3], [5, 6, 7], "q28-mobile");

    await returnAndClear(mobile, 28);
    await openAndCheckType(mobile, 29, 7, [1, 2], [3, 4], "q29-mobile");

    await returnAndClear(mobile, 29);
    await openAndCheckType(mobile, 30, 13, [1, 2, 3], [5, 6, 7], "q30-mobile");

    await returnAndClear(mobile, 30);
    await openAndCheckType(mobile, 31, 2, [1], [2, 3], "q31-mobile");

    await returnAndClear(mobile, 31);
    await openAndCheckType(mobile, 32, 15, [1, 2, 3, 4], [5, 6, 7], "q32-mobile");

    await returnAndClear(mobile, 32);
    await openAndCheckType(mobile, 33, 12, [1, 2], [3, 4], "q33-mobile");

    await returnAndClear(mobile, 33);
    await openAndCheckType(mobile, 34, 5, [1, 2], [3, 4], "q34-mobile");
    await returnAndClear(mobile, 34);
    await openAndCheckType(mobile, 40, 6, [1, 2], [3, 4], "q40-mobile");
    await returnAndClear(mobile, 40);

    const directLink = await browser.newPage({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
    watch(directLink, "direct-link");
    await enter(directLink, `${url}?qs=${Array.from({ length: 40 }, function (_, index) { return index + 1; }).join(",")}`);
    const directSelected = await directLink.locator('.type-card input[type="checkbox"]:checked').evaluateAll(function (inputs) {
      return inputs.map(function (input) {
        return Number(input.closest(".type-card").querySelector(".q-number").textContent);
      });
    });
    if (directSelected.join("|") !== releaseEligibleNumbers.join("|")) fail(`direct-link selection bypassed release locks: ${directSelected.join(",")}`);
    if (!(await directLink.locator("#worksheetMeta").innerText()).includes("확인된 302문항")) fail("direct-link worksheet eligible count is wrong");

    const correctionLink = await browser.newPage({ viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 });
    watch(correctionLink, "correction-link");
    await enterAsAdmin(correctionLink, `${url}?qs=6,25,39`);
    if (await correctionLink.locator('.type-card input[type="checkbox"]:checked').count() !== 3) fail("resolved types were not selected from a direct link");
    if (await correctionLink.locator("#worksheetView").evaluate(element => element.hidden)) fail("resolved types did not open as a worksheet");
    await correctionLink.click('.view-tabs button[data-view="solution"]');
    await waitForImages(correctionLink);
    const correctionText = await correctionLink.locator("#pageStream").innerText();
    if (!correctionText.includes("정답은 228m²") || !correctionText.includes("80÷2=40")) fail("resolved source corrections are not visible in the solution view");
    await noOverflow(correctionLink, "correction solution");
    await correctionLink.screenshot({ path: path.join(outputDir, "q06-q25-q39-resolved-solution.png"), fullPage: true });
    await correctionLink.emulateMedia({ media: "print" });
    const correctionPdfPath = path.join(outputDir, "q06-q25-q39-resolved-solution-a4.pdf");
    await correctionLink.pdf({ path: correctionPdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    const correctionPdfBytes = fs.readFileSync(correctionPdfPath);
    const correctionPdfPageCount = (correctionPdfBytes.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
    if (correctionPdfPageCount !== 5) fail(`resolved correction A4 output has an extra or missing page: ${correctionPdfPageCount} pages`);
    await correctionLink.emulateMedia({ media: "screen" });

    if (failures.length) {
      console.error(`FAIL question-bank browser audit (${failures.length})`);
      failures.forEach(message => console.error(`- ${message}`));
      process.exitCode = 1;
      return;
    }
    console.log(`PASS question-bank browser audit: desktop=1440x1000 mobile=390x844 A4=all-40-source-types confirmed=302 eligible=302 lockedType=0 q06=learner-fit-verified q25=unit-correction-visible q39=solution-cycle-correction-visible q40=desktop-mobile-worksheet-verified bulk=40types directLink=40types output=${outputDir}`);
  } finally {
    await browser.close();
  }
})().catch(function (error) {
  console.error(error.stack || error);
  process.exit(1);
});
