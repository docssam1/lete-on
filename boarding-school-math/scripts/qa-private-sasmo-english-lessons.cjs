#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const intake = require("./validate-private-sasmo-diagnostic.cjs");
const mediaValidator = require("./validate-private-sasmo-question-media.cjs");

const EXPECTED_IMAGE_INDEX_SHA256 = mediaValidator.VERIFIED_IMAGE_INDEX_SHA256["sasmo-2019-g6-question-media-v1"];

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("LESSON_QA_COMMAND_INVALID"); return args[index + 1]; }
function fileEvidence(file) {
  const bytes = fs.readFileSync(file);
  return Object.freeze({ file: path.basename(file), byteLength: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") });
}
function safeFile(root, name) {
  const file = path.resolve(root, name);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) fail("LESSON_QA_FILE_INVALID");
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size <= 0 || stat.size > 3 * 1024 * 1024) fail("LESSON_QA_FILE_INVALID");
  return file;
}

async function inspect(page, audience, questionNumber, revealAnswer, reviewState) {
  if (await page.locator('meta[name="gfield-source-image-index-sha256"]').getAttribute("content") !== EXPECTED_IMAGE_INDEX_SHA256) fail("LESSON_QA_SOURCE_INDEX_MISMATCH");
  if (await page.locator(".question-image-frame img").count() !== 25 || await page.locator('.question-image-frame[data-source-sha256]').count() !== 25) fail("LESSON_QA_SOURCE_IMAGE_COUNT_INVALID");
  const active = page.locator(`.lesson[data-item="${questionNumber}"]`);
  if (!await active.isVisible() || new URL(page.url()).searchParams.get("q") !== String(questionNumber)) fail("LESSON_QA_DEEP_LINK_FAILED");
  const alternateQuestion = questionNumber === 25 ? 24 : questionNumber + 1;
  await page.locator(`[data-go="${alternateQuestion}"]`).click();
  if (!await page.locator(`.lesson[data-item="${alternateQuestion}"]`).isVisible() || new URL(page.url()).searchParams.get("q") !== String(alternateQuestion)) fail("LESSON_QA_ROUTE_SYNC_FAILED");
  await page.locator(`[data-go="${questionNumber}"]`).click();
  if (!await active.isVisible() || new URL(page.url()).searchParams.get("q") !== String(questionNumber)) fail("LESSON_QA_NAVIGATION_FAILED");
  if (await page.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("LESSON_QA_HORIZONTAL_OVERFLOW");
  const visibleLessons = await page.locator(".lesson:visible").count();
  if (visibleLessons !== 1) fail("LESSON_QA_VISIBLE_LESSON_COUNT_INVALID");
  const teacherNotes = await active.locator(".teacher-note").count();
  if (teacherNotes !== (audience === "teacher" ? 1 : 0)) fail("LESSON_QA_AUDIENCE_LEAK");
  const sourceBlock = active.locator(".actual-problem");
  const sourceFrame = sourceBlock.locator(".question-image-frame");
  const sourceImage = sourceFrame.locator("img");
  if (await sourceBlock.count() !== 1 || await sourceFrame.count() !== 1 || await sourceImage.count() !== 1) fail("LESSON_QA_SOURCE_IMAGE_MISSING");
  await sourceImage.waitFor({ state: "visible" });
  const sourceMetrics = await sourceImage.evaluate(function (node) {
    const frame = node.closest(".question-image-frame");
    const lesson = node.closest(".lesson");
    return {
      complete: node.complete,
      naturalWidth: node.naturalWidth,
      naturalHeight: node.naturalHeight,
      declaredWidth: Number(node.getAttribute("width")),
      declaredHeight: Number(node.getAttribute("height")),
      displayedWidth: node.getBoundingClientRect().width,
      frameClientWidth: frame.clientWidth,
      pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      sourceBeforeConcept: Boolean(lesson.querySelector(".actual-problem").compareDocumentPosition(lesson.querySelector(".opening-grid")) & Node.DOCUMENT_POSITION_FOLLOWING),
      sha256: frame.dataset.sourceSha256 || "",
      dataUri: node.getAttribute("src") || ""
    };
  });
  if (!sourceMetrics.complete || sourceMetrics.naturalWidth !== sourceMetrics.declaredWidth || sourceMetrics.naturalHeight !== sourceMetrics.declaredHeight || sourceMetrics.naturalWidth < 700 || sourceMetrics.naturalHeight < 300 || sourceMetrics.displayedWidth > sourceMetrics.frameClientWidth + 1 || sourceMetrics.pageOverflow || !sourceMetrics.sourceBeforeConcept || !/^[a-f0-9]{64}$/u.test(sourceMetrics.sha256) || !/^data:image\/png;base64,/u.test(sourceMetrics.dataUri)) fail("LESSON_QA_SOURCE_IMAGE_INVALID");
  const zoom = sourceBlock.locator(".zoom-control");
  await zoom.click();
  if (await zoom.getAttribute("aria-expanded") !== "true" || !await sourceFrame.evaluate(function (node) { return node.classList.contains("is-zoomed") && node.scrollWidth > node.clientWidth; })) fail("LESSON_QA_SOURCE_ZOOM_FAILED");
  if (await page.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("LESSON_QA_SOURCE_ZOOM_PAGE_OVERFLOW");
  await zoom.click();
  if (await zoom.getAttribute("aria-expanded") !== "false") fail("LESSON_QA_SOURCE_ZOOM_RESET_FAILED");
  const reviewBoundaries = await active.locator(".review-boundary").count();
  if (reviewBoundaries !== (reviewState ? 1 : 0)) fail("LESSON_QA_REVIEW_BOUNDARY_INVALID");
  if (reviewState && await active.locator(".review-boundary").getAttribute("data-review-state") !== reviewState) fail("LESSON_QA_REVIEW_STATE_INVALID");
  const answerPanel = active.locator(".answer-panel");
  if (await answerPanel.isVisible()) fail("LESSON_QA_ANSWER_PREEXPOSED");
  const collapsed = active.locator(".step-trigger").nth(1);
  if (await collapsed.getAttribute("aria-expanded") !== "false") fail("LESSON_QA_STEP_INITIAL_STATE_INVALID");
  await collapsed.click();
  if (await collapsed.getAttribute("aria-expanded") !== "true") fail("LESSON_QA_STEP_INTERACTION_FAILED");
  if (revealAnswer) {
    const trigger = active.locator(".answer-trigger");
    if (reviewState && !/^Reveal printed-key answer$/u.test(await trigger.innerText())) fail("LESSON_QA_REVIEW_ANSWER_LABEL_INVALID");
    await trigger.click();
    if (!await answerPanel.isVisible()) fail("LESSON_QA_ANSWER_REVEAL_FAILED");
    if (reviewState && !/historical printed-key answer/iu.test(await answerPanel.innerText())) fail("LESSON_QA_REVIEW_ANSWER_PANEL_INVALID");
  }
}

async function inspectPrint(page, questionNumber) {
  await page.locator(`[data-go="${questionNumber}"]`).click();
  await page.emulateMedia({ media: "print" });
  const metrics = await page.locator(`.lesson[data-item="${questionNumber}"]`).evaluate(function (lesson) {
    const lessonHead = lesson.querySelector(".lesson-head");
    const actualProblem = lesson.querySelector(".actual-problem");
    const actualProblemHead = actualProblem.querySelector(".actual-problem-head");
    const frame = lesson.querySelector(".question-image-frame");
    const image = frame.querySelector("img");
    const sourceNote = actualProblem.querySelector(".source-note");
    const openingGrid = lesson.querySelector(".opening-grid");
    const answerTrigger = lesson.querySelector(".answer-trigger");
    const zoom = lesson.querySelector(".zoom-control");
    const rect = function (node) {
      const box = node.getBoundingClientRect();
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
    };
    return {
      visible: getComputedStyle(lesson).display !== "none",
      imageComplete: image.complete,
      imageWidth: image.getBoundingClientRect().width,
      frameWidth: frame.getBoundingClientRect().width,
      frameOverflow: getComputedStyle(frame).overflow,
      answerTriggerHidden: getComputedStyle(answerTrigger).display === "none",
      zoomHidden: getComputedStyle(zoom).display === "none",
      lessonHead: rect(lessonHead),
      actualProblem: rect(actualProblem),
      actualProblemHead: rect(actualProblemHead),
      frame: rect(frame),
      sourceNote: rect(sourceNote),
      openingGrid: rect(openingGrid)
    };
  });
  const visibleLessons = await page.locator(".lesson:visible").count();
  const ordered = metrics.lessonHead.bottom <= metrics.actualProblem.top + 1
    && metrics.actualProblemHead.bottom <= metrics.frame.top + 1
    && metrics.frame.bottom <= metrics.sourceNote.top + 1
    && metrics.actualProblem.bottom <= metrics.openingGrid.top + 1;
  if (!metrics.visible || !metrics.imageComplete || metrics.imageWidth > metrics.frameWidth + 1 || metrics.frameOverflow !== "hidden" || !metrics.answerTriggerHidden || !metrics.zoomHidden || visibleLessons !== 1 || !ordered) fail("LESSON_QA_A4_LAYOUT_INVALID");
}

async function run(options) {
  const inputRoot = intake.assertExternalPrivateRoot(options.inputRoot);
  const outputRoot = path.resolve(options.outputRoot);
  fs.mkdirSync(outputRoot, { recursive: true });
  intake.assertExternalPrivateRoot(outputRoot);
  const plan = [
    { audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 6, reveal: true, width: 1440, height: 1000, name: "student-q06-desktop.png" },
    { audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 12, reveal: true, width: 1440, height: 1000, name: "teacher-q12-desktop.png" },
    { audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 24, reveal: true, width: 390, height: 844, name: "student-q24-mobile.png" },
    { audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 16, reveal: false, width: 1440, height: 1000, name: "teacher-q16-desktop.png" },
    { audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 25, reveal: false, width: 390, height: 844, name: "teacher-q25-mobile.png" }
    ,{ audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 9, reveal: true, reviewState: "review-required", width: 390, height: 844, name: "student-q09-review-mobile.png" }
    ,{ audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 15, reveal: true, reviewState: "review-required", width: 1440, height: 1000, name: "teacher-q15-review-desktop.png" }
    ,{ audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 19, reveal: true, reviewState: "score-only", width: 390, height: 844, name: "student-q19-score-only-mobile.png" }
    ,{ audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 21, reveal: true, reviewState: "review-required", width: 1440, height: 1000, name: "teacher-q21-review-desktop.png" }
  ];
  const printPlan = [
    { file: "sasmo-2019-g6-student-english-review.html", question: 6, name: "student-q06-a4.pdf" },
    { file: "sasmo-2019-g6-teacher-english-review.html", question: 21, name: "teacher-q21-review-a4.pdf" }
  ];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const entry of plan) {
      const page = await browser.newPage({ viewport: { width: entry.width, height: entry.height } });
      try {
        const url = pathToFileURL(safeFile(inputRoot, entry.file));
        url.searchParams.set("q", String(entry.question));
        await page.goto(url.href, { waitUntil: "load" });
        await inspect(page, entry.audience, entry.question, entry.reveal, entry.reviewState || null);
        await page.locator(`.lesson[data-item="${entry.question}"]`).screenshot({ path: path.join(outputRoot, entry.name) });
      } finally { await page.close(); }
    }
    for (const entry of printPlan) {
      const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });
      try {
        const url = pathToFileURL(safeFile(inputRoot, entry.file));
        url.searchParams.set("q", String(entry.question));
        await page.goto(url.href, { waitUntil: "load" });
        await inspectPrint(page, entry.question);
        await page.pdf({ path: path.join(outputRoot, entry.name), format: "A4", printBackground: true, margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" } });
      } finally { await page.close(); }
    }
  } finally { if (browser) await browser.close(); }
  const screenshots = plan.map(function (entry) { return path.join(outputRoot, entry.name); });
  const pdfs = printPlan.map(function (entry) { return path.join(outputRoot, entry.name); });
  const inputs = Array.from(new Set(plan.concat(printPlan).map(function (entry) { return entry.file; }))).map(function (fileName) { return safeFile(inputRoot, fileName); });
  const reportPath = path.join(outputRoot, "english-lessons-qa-report.json");
  const report = {
    schemaVersion: "gfield-private-sasmo-english-lessons-qa-v1",
    sourceImageIndexSha256: EXPECTED_IMAGE_INDEX_SHA256,
    inputs: inputs.map(fileEvidence),
    sourceImageContract: { itemCount: 25, delivery: "embedded-data-uri", order: "actual-problem-before-explanation", initialFit: "inside-frame", zoom: "internal-scroll-only" },
    viewports: plan.map(function (entry) { return { file: entry.name, audience: entry.audience, questionNumber: entry.question, reviewState: entry.reviewState || null, width: entry.width, height: entry.height }; }),
    printContract: { questions: printPlan.map(function (entry) { return entry.question; }), format: "A4", margin: "12mm", printBackground: true },
    checks: [
      "all-25-source-images-index-bound",
      "active-source-image-loaded-at-declared-dimensions",
      "source-before-concept-and-solution",
      "initial-image-fit-without-page-overflow",
      "full-size-zoom-uses-internal-scroll",
      "question-query-opens-exact-lesson",
      "question-navigation-keeps-query-in-sync",
      "one-visible-lesson",
      "student-teacher-audience-boundary",
      "answer-hidden-until-explicit-reveal",
      "review-boundary-state-and-label",
      "step-control-interaction",
      "a4-image-fit-and-print-control-hiding",
      "a4-source-block-order-without-overlap"
    ],
    artifacts: { screenshots: screenshots.map(fileEvidence), pdfs: pdfs.map(fileEvidence) }
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report,null,2)}\n`, { encoding: "utf8", flag: "w" });
  return Object.freeze({ screenshots: Object.freeze(screenshots), pdfs: Object.freeze(pdfs), reportPath });
}

if (require.main === module) {
  run({ inputRoot: arg(process.argv, "--input-root"), outputRoot: arg(process.argv, "--output-root") })
    .then(function (result) { console.log(`PASS private SASMO English lesson QA: ${result.screenshots.length} screenshots + ${result.pdfs.length} A4 PDFs + ${path.basename(result.reportPath)}`); })
    .catch(function (error) { console.error(`BLOCKED private SASMO English lesson QA: ${error.code || error.message || "INVALID"}`); process.exitCode = 2; });
}

module.exports = Object.freeze({ run });
