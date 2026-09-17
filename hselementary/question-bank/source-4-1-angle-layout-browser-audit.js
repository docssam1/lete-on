"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { auditSvgLayouts } = require("./geometry-layout-browser-audit-lib.js");

const runtime = path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || path.join(runtime, "playwright"));
const output = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-4-1-angle-layout-audit");
const root = path.resolve(__dirname, "../..");
const visualReviewSourceIds = [
  "4-1-u2-e2-example-2-1",
  "4-1-u2-e2-example-2-3",
  "4-1-u2-e3-example-3-1",
  "4-1-u2-e3-example-3-2",
  "4-1-u2-e3-mission-2",
  "4-1-u2-e5-example-5-2",
  "4-1-u2-e5-example-5-3",
  "4-1-u2-e5-mission-1",
  "4-1-u2-e4-mission-3",
  "4-1-u2-e4-mission-4",
  "4-1-u2-e4-mission-5",
  "4-1-u2-e4-exploration",
  "4-1-u2-e2-mission-6"
];

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((request, response) => {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const target = path.resolve(root, "." + relative + (relative.endsWith("/") ? "index.html" : ""));
    if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(target, (error, bytes) => {
      if (error) { response.writeHead(404).end(); return; }
      response.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css" })[path.extname(target)] || "application/octet-stream");
      response.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  const applyLayout = () => page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return window.GFieldGeometryLayout.apply(document);
  });
  const captureVisualReview = async (view, profile) => {
    if (process.env.HSE_VISUAL_REVIEW !== "1") return;
    for (const sourceItemId of visualReviewSourceIds) {
      const item = page.locator(`${view} [data-source-item-id="${sourceItemId}"]`).first();
      if (await item.count()) await item.screenshot({ path: path.join(output, `${sourceItemId}-${profile}.png`) });
    }
  };

  try {
    const url = `http://127.0.0.1:${server.address().port}/hselementary/question-bank/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const unit = page.locator("input[data-select-scope='unit'][data-scope-id='4-1-u2']");
    await unit.check();
    assert.equal(await page.locator("#selectedTypeCount").textContent(), "63");
    await page.locator("#questionCountInput").fill("63");
    await page.locator("#generateButton").click();
    await page.waitForSelector("#problemView .question-item");
    assert.equal(await page.locator("#problemView .question-item").count(), 63);

    const snapshot = await page.locator("#problemView .question-item").evaluateAll(items => items.map(item => ({
      number: Number(item.id.replace("question-", "")),
      typeId: item.dataset.typeId,
      sourceItemId: item.dataset.sourceItemId,
      title: item.querySelector("header span")?.textContent.trim() || "",
      svgClasses: [...item.querySelectorAll("svg")].map(svg => svg.getAttribute("class") || "")
    })));
    const five = snapshot.find(item => item.number === 5);
    const eleven = snapshot.find(item => item.number === 11);
    assert.equal(five.typeId, "4-1-u2-t3");
    assert.equal(five.sourceItemId, "4-1-u2-e3-exploration");
    assert(five.svgClasses.some(value => value.includes("source41-polygon-collection")));
    assert.equal(eleven.typeId, "4-1-u2-t6");
    assert.equal(eleven.sourceItemId, "4-1-u2-e6-exploration");
    assert(eleven.svgClasses.some(value => value.includes("source41-clock")));
    assert.notDeepEqual(five.svgClasses, eleven.svgClasses);

    const failures = [];
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#problemView .geometry-diagram"), "desktop-problem"));
    await page.locator("#question-5").screenshot({ path: path.join(output, "question-5-desktop.png") });
    await page.locator("#question-11").screenshot({ path: path.join(output, "question-11-desktop.png") });
    await captureVisualReview("#problemView", "desktop-problem");

    await page.locator("#solutionTab").evaluate(element => element.click());
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#solutionView .geometry-diagram"), "desktop-solution"));
    await captureVisualReview("#solutionView", "desktop-solution");

    await page.setViewportSize({ width: 390, height: 900 });
    await page.locator("#problemTab").evaluate(element => element.click());
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#problemView .geometry-diagram"), "mobile-390-problem"));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.locator("#question-5").screenshot({ path: path.join(output, "question-5-mobile.png") });
    await page.locator("#question-11").screenshot({ path: path.join(output, "question-11-mobile.png") });
    await captureVisualReview("#problemView", "mobile-problem");

    await page.locator("#solutionTab").evaluate(element => element.click());
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#solutionView .geometry-diagram"), "mobile-390-solution"));
    await captureVisualReview("#solutionView", "mobile-solution");

    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: "print" });
    await page.locator("#problemTab").evaluate(element => element.click());
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#problemView .geometry-diagram"), "a4-problem"));
    await page.pdf({ path: path.join(output, "4-1-angle-problem.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.locator("#solutionTab").evaluate(element => element.click());
    await applyLayout();
    failures.push(...await auditSvgLayouts(page.locator("#solutionView .geometry-diagram"), "a4-solution"));
    await page.pdf({ path: path.join(output, "4-1-angle-solution.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });

    if (failures.length) {
      await page.emulateMedia({ media: "screen" });
      await page.setViewportSize({ width: 1440, height: 1100 });
      await page.locator("#problemTab").evaluate(element => element.click());
      await applyLayout();
      const failedQuestions = [...new Set(failures.map(failure => failure.question).filter(Boolean))];
      for (const questionId of failedQuestions) {
        await page.locator(`#${questionId}`).screenshot({ path: path.join(output, `${questionId}-failed.png`) });
      }
    }
    const report = { questionCount: snapshot.length, five, eleven, failures, pageErrors };
    fs.writeFileSync(path.join(output, "summary.json"), JSON.stringify(report, null, 2));
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(failures, [], `도형 조판 충돌 ${failures.length}건: ${path.join(output, "summary.json")}`);
    console.log(`4-1 2단원 도형 조판 감사 통과: 63유형 · PC/390px/A4 문제·풀이 · 충돌 0 · 5번/11번 원본 구조 분리`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
