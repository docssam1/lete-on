#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("WHITEBOARD_QA_COMMAND_INVALID"); return args[index + 1]; }
function safeHtml(rootValue, fileName) {
  const root = intake.assertExternalPrivateRoot(rootValue);
  const file = path.resolve(root, fileName);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative) || path.extname(file).toLowerCase() !== ".html") fail("WHITEBOARD_QA_FILE_INVALID");
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size < 10_000 || stat.size > 20 * 1024 * 1024) fail("WHITEBOARD_QA_FILE_INVALID");
  return file;
}

async function assertNoPageOverflow(page) {
  const overflows = await page.evaluate(function () { return document.documentElement.scrollWidth > window.innerWidth + 1; });
  if (overflows) fail("WHITEBOARD_QA_HORIZONTAL_OVERFLOW");
}

async function inspectConcept(page) {
  const panel = page.locator('[data-panel="concept"]');
  if (!await panel.isVisible()) fail("WHITEBOARD_QA_CONCEPT_HIDDEN");
  if (await page.locator(".sample-panel:visible").count() !== 1) fail("WHITEBOARD_QA_PANEL_COUNT_INVALID");
  if (await panel.locator(".concept-board .board-beat").count() !== 7) fail("WHITEBOARD_QA_CONCEPT_BEATS_INVALID");
  if (await panel.locator('[data-action="play"]').count() !== 1) fail("WHITEBOARD_QA_AUDIO_CONTROL_MISSING");
  await panel.locator('[data-action="play"]').click();
  if (await panel.locator(".speaking-target").count() !== 1) fail("WHITEBOARD_QA_SYNC_HIGHLIGHT_FAILED");
  if (!/ratio|part/i.test(await panel.locator('[data-caption="concept"]').innerText())) fail("WHITEBOARD_QA_CAPTION_FAILED");
  await panel.locator('[data-action="stop"]').click();
}

async function inspectProblem(page, questionNumber) {
  const id = `q${String(questionNumber).padStart(2, "0")}`;
  await page.locator(`[data-show="${id}"]`).click();
  const panel = page.locator(`[data-panel="${id}"]`);
  if (!await panel.isVisible() || await page.locator(".sample-panel:visible").count() !== 1) fail("WHITEBOARD_QA_NAVIGATION_FAILED");
  const image = panel.locator(".question-image-frame img");
  if (!await image.isVisible()) fail("WHITEBOARD_QA_SOURCE_IMAGE_MISSING");
  const natural = await image.evaluate(function (node) { return { width: node.naturalWidth, height: node.naturalHeight, complete: node.complete }; });
  if (!natural.complete || natural.width < 700 || natural.height < 200) fail("WHITEBOARD_QA_SOURCE_IMAGE_INVALID");
  const answer = panel.locator(".answer strong");
  if (await answer.isVisible()) fail("WHITEBOARD_QA_ANSWER_PREEXPOSED");
  await panel.locator(".answer-button").click();
  if (!await answer.isVisible()) fail("WHITEBOARD_QA_ANSWER_REVEAL_FAILED");
  await panel.locator('[data-action="play"]').click();
  if (await panel.locator(".speaking-target").count() !== 1) fail("WHITEBOARD_QA_SYNC_HIGHLIGHT_FAILED");
  await panel.locator('[data-action="stop"]').click();
}

async function run(options) {
  const inputRoot = intake.assertExternalPrivateRoot(options.inputRoot);
  const outputRoot = path.resolve(options.outputRoot);
  fs.mkdirSync(outputRoot, { recursive: true });
  intake.assertExternalPrivateRoot(outputRoot);
  const file = safeHtml(inputRoot, options.fileName);
  const plan = [
    { kind: "concept", width: 1440, height: 1000, name: "gmap-concept-desktop.png" },
    { kind: "problem", question: 6, width: 1440, height: 1000, name: "gmap-q06-desktop.png" },
    { kind: "problem", question: 16, width: 390, height: 844, name: "gmap-q16-mobile.png" },
    { kind: "problem", question: 20, width: 390, height: 844, name: "gmap-q20-mobile.png" }
  ];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const entry of plan) {
      const page = await browser.newPage({ viewport: { width: entry.width, height: entry.height } });
      try {
        await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
        if (entry.kind === "concept") await inspectConcept(page); else await inspectProblem(page, entry.question);
        await assertNoPageOverflow(page);
        const target = entry.kind === "concept" ? page.locator('[data-panel="concept"]') : page.locator(`[data-panel="q${String(entry.question).padStart(2, "0")}"]`);
        await target.screenshot({ path: path.join(outputRoot, entry.name) });
      } finally { await page.close(); }
    }
  } finally { if (browser) await browser.close(); }
  return Object.freeze({ screenshots: plan.map(function (entry) { return path.join(outputRoot, entry.name); }) });
}

if (require.main === module) {
  run({ inputRoot: arg(process.argv, "--input-root"), fileName: arg(process.argv, "--file"), outputRoot: arg(process.argv, "--output-root") })
    .then(function (result) { console.log(`PASS G·MAP whiteboard browser QA: ${result.screenshots.length} screenshots`); })
    .catch(function (error) { console.error(`BLOCKED G·MAP whiteboard browser QA: ${error.code || error.message || "INVALID"}`); process.exitCode = 2; });
}

module.exports = Object.freeze({ run });
