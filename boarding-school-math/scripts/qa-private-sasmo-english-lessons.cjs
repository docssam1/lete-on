#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("LESSON_QA_COMMAND_INVALID"); return args[index + 1]; }
function safeFile(root, name) {
  const file = path.resolve(root, name);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) fail("LESSON_QA_FILE_INVALID");
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size <= 0 || stat.size > 3 * 1024 * 1024) fail("LESSON_QA_FILE_INVALID");
  return file;
}

async function inspect(page, audience, questionNumber, revealAnswer) {
  await page.locator(`[data-go="${questionNumber}"]`).click();
  const active = page.locator(`.lesson[data-item="${questionNumber}"]`);
  if (!await active.isVisible()) fail("LESSON_QA_NAVIGATION_FAILED");
  if (await page.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; })) fail("LESSON_QA_HORIZONTAL_OVERFLOW");
  const visibleLessons = await page.locator(".lesson:visible").count();
  if (visibleLessons !== 1) fail("LESSON_QA_VISIBLE_LESSON_COUNT_INVALID");
  const teacherNotes = await active.locator(".teacher-note").count();
  if (teacherNotes !== (audience === "teacher" ? 1 : 0)) fail("LESSON_QA_AUDIENCE_LEAK");
  const answerPanel = active.locator(".answer-panel");
  if (await answerPanel.isVisible()) fail("LESSON_QA_ANSWER_PREEXPOSED");
  const collapsed = active.locator(".step-trigger").nth(1);
  if (await collapsed.getAttribute("aria-expanded") !== "false") fail("LESSON_QA_STEP_INITIAL_STATE_INVALID");
  await collapsed.click();
  if (await collapsed.getAttribute("aria-expanded") !== "true") fail("LESSON_QA_STEP_INTERACTION_FAILED");
  if (revealAnswer) {
    await active.locator(".answer-trigger").click();
    if (!await answerPanel.isVisible()) fail("LESSON_QA_ANSWER_REVEAL_FAILED");
  }
}

async function run(options) {
  const inputRoot = intake.assertExternalPrivateRoot(options.inputRoot);
  const outputRoot = path.resolve(options.outputRoot);
  fs.mkdirSync(outputRoot, { recursive: true });
  intake.assertExternalPrivateRoot(outputRoot);
  const plan = [
    { audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 6, reveal: true, width: 1440, height: 1000, name: "student-q06-desktop.png" },
    { audience: "student", file: "sasmo-2019-g6-student-english-review.html", question: 24, reveal: true, width: 390, height: 844, name: "student-q24-mobile.png" },
    { audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 16, reveal: false, width: 1440, height: 1000, name: "teacher-q16-desktop.png" },
    { audience: "teacher", file: "sasmo-2019-g6-teacher-english-review.html", question: 25, reveal: false, width: 390, height: 844, name: "teacher-q25-mobile.png" }
  ];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const entry of plan) {
      const page = await browser.newPage({ viewport: { width: entry.width, height: entry.height } });
      try {
        await page.goto(pathToFileURL(safeFile(inputRoot, entry.file)).href, { waitUntil: "load" });
        await inspect(page, entry.audience, entry.question, entry.reveal);
        await page.locator(`.lesson[data-item="${entry.question}"]`).screenshot({ path: path.join(outputRoot, entry.name) });
      } finally { await page.close(); }
    }
  } finally { if (browser) await browser.close(); }
  return Object.freeze({ screenshots: plan.map(function (entry) { return path.join(outputRoot, entry.name); }) });
}

if (require.main === module) {
  run({ inputRoot: arg(process.argv, "--input-root"), outputRoot: arg(process.argv, "--output-root") })
    .then(function (result) { console.log(`PASS private SASMO English lesson QA: ${result.screenshots.length} screenshots`); })
    .catch(function (error) { console.error(`BLOCKED private SASMO English lesson QA: ${error.code || error.message || "INVALID"}`); process.exitCode = 2; });
}

module.exports = Object.freeze({ run });
