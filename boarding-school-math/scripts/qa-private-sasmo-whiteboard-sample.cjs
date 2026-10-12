#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const crypto = require("node:crypto");
const { chromium } = require("playwright");
const intake = require("./validate-private-sasmo-diagnostic.cjs");

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("WHITEBOARD_QA_COMMAND_INVALID"); return args[index + 1]; }
function fileEvidence(file) {
  const buffer = fs.readFileSync(file);
  return { file: path.basename(file), byteLength: buffer.length, sha256: crypto.createHash("sha256").update(buffer).digest("hex") };
}

async function settlePage(page) {
  await page.evaluate(async function () {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    await Promise.all(Array.from(document.images).map(function (image) {
      if (!image.complete || !image.decode) return Promise.resolve();
      return image.decode().catch(function () {});
    }));
    window.scrollTo(0,0);
    await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
  });
}
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

async function inspectNoSpeechFallback(browser, file) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.addInitScript(function () {
      Object.defineProperty(window,"speechSynthesis",{ configurable: true, value: null });
      Object.defineProperty(window,"SpeechSynthesisUtterance",{ configurable: true, value: undefined });
    });
    await page.goto(pathToFileURL(file).href,{ waitUntil: "load" });
    await settlePage(page);
    const panel = page.locator('[data-panel="concept"]');
    await panel.locator('[data-action="play"]').click();
    const firstCaption = await panel.locator('[data-caption="concept"]').innerText();
    if (!/part|ratio/iu.test(firstCaption) || !/Voice playback is unavailable/u.test(firstCaption) || !/^1 \/ 7$/u.test(await panel.locator('[data-progress="concept"]').innerText())) fail("WHITEBOARD_QA_NO_SPEECH_FALLBACK_INVALID");
    await panel.locator('[data-action="next"]').click();
    if (!/^2 \/ 7$/u.test(await panel.locator('[data-progress="concept"]').innerText())) fail("WHITEBOARD_QA_NO_SPEECH_NEXT_INVALID");
  } finally { await page.close(); }
}

async function inspectQ6Geometry(panel) {
  const svg = panel.locator(".q6-board svg");
  if (await svg.count() !== 1) fail("WHITEBOARD_Q06_SVG_MISSING");
  const report = await svg.evaluate(function (node) {
    const viewBox = node.viewBox.baseVal;
    const semantic = Array.from(node.querySelectorAll("[data-layout-role]"));
    const clipped = semantic.filter(function (entry) {
      const box = entry.getBBox();
      return box.x < viewBox.x - 0.5 || box.y < viewBox.y - 0.5 || box.x + box.width > viewBox.x + viewBox.width + 0.5 || box.y + box.height > viewBox.y + viewBox.height + 0.5;
    }).map(function (entry) { return entry.id || entry.getAttribute("data-label-for") || entry.getAttribute("data-owner-id"); });
    const angleLabels = Array.from(node.querySelectorAll('[data-layout-role="angle-sector"] text'));
    const labelBoxes = angleLabels.map(function (entry) {
      const box = entry.getBoundingClientRect();
      return { id: entry.getAttribute("data-label-for"), left: box.left, top: box.top, right: box.right, bottom: box.bottom, height: box.height };
    });
    const collisions = [];
    labelBoxes.forEach(function (first, index) {
      labelBoxes.slice(index + 1).forEach(function (second) {
        const gap = 1;
        if (first.left < second.right + gap && first.right + gap > second.left && first.top < second.bottom + gap && first.bottom + gap > second.top) collisions.push(`${first.id}:${second.id}`);
      });
    });
    const board = node.closest(".geometry-board");
    return {
      pointLabels: node.querySelectorAll('[data-layout-role="point-label"]').length,
      segments: node.querySelectorAll('[data-layout-role="segment"]').length,
      angleSectors: node.querySelectorAll('[data-layout-role="angle-sector"]').length,
      equalMarks: node.querySelectorAll('[data-layout-role="equal-mark"]').length,
      clipped,
      collisions,
      minimumAngleLabelHeight: Math.min.apply(null, labelBoxes.map(function (entry) { return entry.height; })),
      boardClientWidth: board.clientWidth,
      boardScrollWidth: board.scrollWidth,
      angles: Array.from(node.querySelectorAll('[data-layout-role="angle-sector"]')).map(function (entry) {
        return {
          id: entry.id,
          vertex: entry.getAttribute("data-owner-id"),
          start: entry.getAttribute("data-angle-start"),
          end: entry.getAttribute("data-angle-end"),
          degrees: Number(entry.getAttribute("data-angle-degrees"))
        };
      })
    };
  });
  if (report.pointLabels !== 7 || report.segments !== 11 || report.angleSectors !== 6 || report.equalMarks !== 2) fail("WHITEBOARD_Q06_SEMANTIC_OBJECTS_INVALID");
  if (report.clipped.length) fail("WHITEBOARD_Q06_SVG_CLIPPED");
  if (report.collisions.length) fail("WHITEBOARD_Q06_ANGLE_LABEL_COLLISION");
  if (report.minimumAngleLabelHeight < 12) fail("WHITEBOARD_Q06_ANGLE_LABEL_TOO_SMALL");
  if (report.boardScrollWidth > report.boardClientWidth + 1) fail("WHITEBOARD_Q06_MOBILE_SCROLL_INVALID");
  const target = report.angles.find(function (entry) { return entry.id === "angle-eac"; });
  if (!target || target.vertex !== "A" || target.start !== "E" || target.end !== "C" || target.degrees !== 30) fail("WHITEBOARD_Q06_TARGET_ANGLE_INVALID");
  const expected = new Map([["angle-adc",90],["angle-cde",60],["angle-ade",150],["angle-ead",15],["angle-dac",45],["angle-eac",30]]);
  if (report.angles.some(function (entry) { return expected.get(entry.id) !== entry.degrees; })) fail("WHITEBOARD_Q06_ANGLE_LEDGER_INVALID");
}

async function inspectQ16Geometry(panel) {
  const board = panel.locator(".q16-board");
  if (await board.count() !== 1 || await board.locator('[data-layout-role="triangle-count-panel"]').count() !== 3) fail("WHITEBOARD_Q16_BOARD_MISSING");
  const reports = await board.locator('[data-layout-role="triangle-count-panel"]').evaluateAll(function (cards) {
    return cards.map(function (card) {
      const svg = card.querySelector("svg");
      const viewBox = svg.viewBox.baseVal;
      const labels = Array.from(svg.querySelectorAll('[data-layout-role="counted-triangle"] text')).map(function (entry) {
        const box = entry.getBoundingClientRect();
        return { index: entry.parentElement.getAttribute("data-count-index"), left: box.left, top: box.top, right: box.right, bottom: box.bottom, height: box.height };
      });
      const collisions = [];
      labels.forEach(function (first, index) {
        labels.slice(index + 1).forEach(function (second) {
          if (first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top) collisions.push(`${first.index}:${second.index}`);
        });
      });
      const clipped = Array.from(svg.querySelectorAll('[data-layout-role="segment"],[data-layout-role="counted-triangle"]')).filter(function (entry) {
        const box = entry.getBBox();
        return box.x < viewBox.x - 0.5 || box.y < viewBox.y - 0.5 || box.x + box.width > viewBox.x + viewBox.width + 0.5 || box.y + box.height > viewBox.y + viewBox.height + 0.5;
      }).map(function (entry) { return entry.id || entry.getAttribute("data-vertices"); });
      return {
        sizeClass: Number(card.getAttribute("data-size-class")),
        segments: svg.querySelectorAll('[data-layout-role="segment"]').length,
        triangles: svg.querySelectorAll('[data-layout-role="counted-triangle"]').length,
        minimumLabelHeight: Math.min.apply(null, labels.map(function (entry) { return entry.height; })),
        collisions,
        clipped
      };
    });
  });
  const expected = new Map([[1,19],[2,10],[3,3]]);
  if (reports.some(function (entry) { return entry.segments !== 36 || expected.get(entry.sizeClass) !== entry.triangles; })) fail("WHITEBOARD_Q16_COUNT_LEDGER_INVALID");
  if (reports.some(function (entry) { return entry.clipped.length || entry.collisions.length || entry.minimumLabelHeight < 11; })) fail("WHITEBOARD_Q16_LABEL_LAYOUT_INVALID");
  const overflow = await board.evaluate(function (node) { return node.scrollWidth > node.clientWidth + 1; });
  if (overflow) fail("WHITEBOARD_Q16_MOBILE_SCROLL_INVALID");
}

async function inspectQ7UnitBars(panel) {
  const board = panel.locator(".q7-board");
  if (await board.count() !== 1) fail("WHITEBOARD_Q07_BOARD_MISSING");
  const report = await board.evaluate(function (node) {
    const bars = Array.from(node.querySelectorAll('[data-layout-role="unit-bar"]')).map(function (entry) {
      return {
        person: entry.getAttribute("data-person-id"),
        halfUnits: Number(entry.getAttribute("data-half-units")),
        blocks: entry.querySelectorAll('[data-layout-role="unit-block"]').length,
        widths: Array.from(entry.querySelectorAll('[data-layout-role="unit-block"]')).map(function (block) { return block.getBoundingClientRect().width; })
      };
    });
    const allWidths = bars.flatMap(function (entry) { return entry.widths; });
    return {
      bars,
      differenceBlocks: node.querySelectorAll('[data-difference-block="true"]').length,
      fractionCount: node.querySelectorAll(".stacked-fraction").length,
      widthSpread: Math.max(...allWidths) - Math.min(...allWidths),
      horizontalOverflow: node.scrollWidth > node.clientWidth + 1
    };
  });
  const expected = new Map([["A",2],["B",4],["C",3],["D",4]]);
  if (report.bars.length !== 4 || report.bars.some(function (entry) { return expected.get(entry.person) !== entry.halfUnits || entry.blocks !== entry.halfUnits; })) fail("WHITEBOARD_Q07_BAR_LEDGER_INVALID");
  if (report.differenceBlocks !== 1 || report.fractionCount !== 1 || report.widthSpread > 1 || report.horizontalOverflow) fail("WHITEBOARD_Q07_LAYOUT_INVALID");
}

async function inspectQ20CommonTotal(panel) {
  const board = panel.locator(".q20-board");
  if (await board.count() !== 1) fail("WHITEBOARD_Q20_BOARD_MISSING");
  const report = await board.evaluate(function (node) {
    const bars = Array.from(node.querySelectorAll('[data-layout-role="common-total-bar"]')).map(function (bar) {
      const width = bar.clientWidth;
      return Array.from(bar.querySelectorAll('[data-layout-role="share-segment"]')).map(function (entry) {
        return { person: entry.getAttribute("data-person-id"), units: Number(entry.getAttribute("data-share-units")), ratio: entry.getBoundingClientRect().width / width, unresolved: entry.classList.contains("is-unresolved") };
      });
    });
    const comparison = Array.from(node.querySelectorAll(".q20-scale>div>b")).map(function (entry) { return entry.getBoundingClientRect().width; });
    return {
      bars,
      fractionCount: node.querySelectorAll(".q20-fraction-card .stacked-fraction").length,
      comparisonRatio: comparison[1] / comparison[0],
      horizontalOverflow: node.scrollWidth > node.clientWidth + 1
    };
  });
  const expected = new Map([["A",35],["B",28],["C",40],["D",37]]);
  if (report.bars.length !== 2 || report.bars.some(function (bar) { return bar.length !== 4 || bar.some(function (entry) { return expected.get(entry.person) !== entry.units || Math.abs(entry.ratio - entry.units / 140) > 0.01; }); })) fail("WHITEBOARD_Q20_SHARE_LEDGER_INVALID");
  if (report.bars[0].filter(function (entry) { return entry.unresolved; }).length !== 1 || report.bars[1].some(function (entry) { return entry.unresolved; })) fail("WHITEBOARD_Q20_REMAINDER_STATE_INVALID");
  if (report.fractionCount !== 3 || Math.abs(report.comparisonRatio - 0.925) > 0.01 || report.horizontalOverflow) fail("WHITEBOARD_Q20_LAYOUT_INVALID");
}

async function createProblemA4Pdf(browser, file, outputRoot, questionNumber) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const id = `q${String(questionNumber).padStart(2, "0")}`;
  const pdfPath = path.join(outputRoot, `gmap-${id}-a4.pdf`);
  try {
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await settlePage(page);
    await inspectProblem(page, questionNumber);
    const panel = page.locator(`[data-panel="${id}"]`);
    await panel.locator("details").evaluateAll(function (nodes) { nodes.forEach(function (node) { node.open = true; }); });
    await page.emulateMedia({ media: "print" });
    await settlePage(page);
    const printReport = await page.evaluate(function (panelId) {
      const panelNode = document.querySelector(`[data-panel="${panelId}"]`);
      const board = panelNode.querySelector(".teaching-board");
      const boardBeat = board.querySelector(".board-beat");
      const head = panelNode.querySelector(".panel-head").getBoundingClientRect();
      const actual = panelNode.querySelector(".actual-problem").getBoundingClientRect();
      const sectionTitle = panelNode.querySelector(".actual-problem .section-title").getBoundingClientRect();
      const questionFrame = panelNode.querySelector(".question-image-frame").getBoundingClientRect();
      return {
        visiblePanels: Array.from(document.querySelectorAll(".sample-panel")).filter(function (entry) { return getComputedStyle(entry).display !== "none"; }).length,
        railDisplay: getComputedStyle(document.querySelector(".rail")).display,
        controlsDisplay: getComputedStyle(panelNode.querySelector(".player-controls")).display,
        answerDisplay: getComputedStyle(panelNode.querySelector(".answer")).display,
        boardOpacity: Number(getComputedStyle(boardBeat).opacity),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        headActualGap: actual.top - head.bottom,
        titleFrameGap: questionFrame.top - sectionTitle.bottom
      };
    }, id);
    if (printReport.visiblePanels !== 1 || printReport.railDisplay !== "none" || printReport.controlsDisplay !== "none" || printReport.answerDisplay !== "none") fail(`WHITEBOARD_${id.toUpperCase()}_A4_VISIBILITY_INVALID`);
    if (printReport.boardOpacity !== 1 || printReport.horizontalOverflow) fail(`WHITEBOARD_${id.toUpperCase()}_A4_LAYOUT_INVALID`);
    if (printReport.headActualGap < -0.5 || printReport.titleFrameGap < -0.5) fail(`WHITEBOARD_${id.toUpperCase()}_A4_SECTION_COLLISION`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
    const stat = fs.statSync(pdfPath);
    if (!stat.isFile() || stat.size < 50_000) fail(`WHITEBOARD_${id.toUpperCase()}_A4_PDF_INVALID`);
  } finally { await page.close(); }
  return pdfPath;
}

async function openProblemInitialState(page, questionNumber) {
  const id = `q${String(questionNumber).padStart(2, "0")}`;
  await page.locator(`[data-show="${id}"]`).click();
  const panel = page.locator(`[data-panel="${id}"]`);
  if (!await panel.isVisible() || await page.locator(".sample-panel:visible").count() !== 1) fail("WHITEBOARD_QA_NAVIGATION_FAILED");
  const image = panel.locator(".question-image-frame img");
  if (!await image.isVisible()) fail("WHITEBOARD_QA_SOURCE_IMAGE_MISSING");
  const initialSolutionExposure = await panel.locator(".teaching-board .board-beat").evaluateAll(function (nodes) {
    return nodes.filter(function (node) {
      const style = getComputedStyle(node);
      return style.visibility !== "hidden" && Number(style.opacity) > 0.01;
    }).length;
  });
  if (initialSolutionExposure !== 0) fail("WHITEBOARD_QA_SOLUTION_PREEXPOSED");
  if (await panel.locator(".teaching-board").evaluate(function (node) { return getComputedStyle(node).display; }) !== "none") fail("WHITEBOARD_QA_SOLUTION_BOARD_NOT_COLLAPSED");
  if (await panel.locator(".step-study details[open]").count() !== 0) fail("WHITEBOARD_QA_SOLUTION_DETAIL_PREOPENED");
  const natural = await image.evaluate(function (node) { return { width: node.naturalWidth, height: node.naturalHeight, complete: node.complete }; });
  if (!natural.complete || natural.width < 700 || natural.height < 200) fail("WHITEBOARD_QA_SOURCE_IMAGE_INVALID");
  const answer = panel.locator(".answer strong");
  if (await answer.isVisible()) fail("WHITEBOARD_QA_ANSWER_PREEXPOSED");
  return panel;
}

async function inspectProblem(page, questionNumber) {
  const panel = await openProblemInitialState(page,questionNumber);
  const answer = panel.locator(".answer strong");
  await panel.locator(".answer-button").click();
  if (!await answer.isVisible()) fail("WHITEBOARD_QA_ANSWER_REVEAL_FAILED");
  await panel.locator(".answer-button").click();
  if (await answer.isVisible()) fail("WHITEBOARD_QA_ANSWER_REHIDE_FAILED");
  await panel.locator('[data-action="next"]').click();
  if (await panel.locator(".speaking-target").count() !== 1 || !/^1 \/ /u.test(await panel.locator('[data-progress]').innerText())) fail("WHITEBOARD_QA_NEXT_STEP_FAILED");
  await panel.locator('[data-action="next"]').click();
  if (!/^2 \/ /u.test(await panel.locator('[data-progress]').innerText()) || await panel.locator(".teaching-board").evaluate(function (node) { return getComputedStyle(node).display; }) === "none" || await panel.locator(".teaching-board .board-beat.is-current").count() !== 1) fail("WHITEBOARD_QA_SOLUTION_BOARD_START_FAILED");
  await panel.locator('[data-action="overview"]').click();
  if (await answer.isVisible() || !/Final overview/u.test(await panel.locator('[data-caption]').innerText())) fail("WHITEBOARD_QA_OVERVIEW_BOUNDARY_FAILED");
  if (questionNumber === 6) await inspectQ6Geometry(panel);
  if (questionNumber === 16) await inspectQ16Geometry(panel);
  if (questionNumber === 7) await inspectQ7UnitBars(panel);
  if (questionNumber === 20) await inspectQ20CommonTotal(panel);
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
    { kind: "problem", question: 6, width: 390, height: 844, name: "gmap-q06-mobile.png" },
    { kind: "problem", question: 16, width: 1440, height: 1000, name: "gmap-q16-desktop.png" },
    { kind: "problem", question: 16, width: 390, height: 844, name: "gmap-q16-mobile.png" },
    { kind: "problem", question: 7, width: 1440, height: 1000, name: "gmap-q07-desktop.png" },
    { kind: "problem", question: 7, width: 390, height: 844, name: "gmap-q07-mobile.png" },
    { kind: "problem", question: 20, width: 1440, height: 1000, name: "gmap-q20-desktop.png" },
    { kind: "problem", question: 20, width: 390, height: 844, name: "gmap-q20-mobile.png" },
    { kind: "problem-initial", question: 20, width: 390, height: 844, name: "gmap-q20-initial-mobile.png" }
  ];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const entry of plan) {
      const page = await browser.newPage({ viewport: { width: entry.width, height: entry.height } });
      try {
        await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
        await settlePage(page);
        if (entry.kind === "concept") await inspectConcept(page);
        else if (entry.kind === "problem-initial") await openProblemInitialState(page,entry.question);
        else await inspectProblem(page, entry.question);
        await settlePage(page);
        await assertNoPageOverflow(page);
        const target = entry.kind === "concept" ? page.locator('[data-panel="concept"]') : page.locator(`[data-panel="q${String(entry.question).padStart(2, "0")}"]`);
        await target.screenshot({ path: path.join(outputRoot, entry.name) });
      } finally { await page.close(); }
    }
    await inspectNoSpeechFallback(browser,file);
    const pdfs = [];
    for (const questionNumber of [6,16,7,20]) pdfs.push(await createProblemA4Pdf(browser, file, outputRoot, questionNumber));
    const screenshots = plan.map(function (entry) { return path.join(outputRoot, entry.name); });
    const reportPath = path.join(outputRoot,"whiteboard-qa-report.json");
    const report = {
      schemaVersion: "gfield-private-whiteboard-qa-v1",
      input: fileEvidence(file),
      viewports: plan.map(function (entry) { return { file: entry.name, kind: entry.kind, questionNumber: entry.question || null, width: entry.width, height: entry.height }; }),
      printContract: { questions: [6,16,7,20], format: "A4", preferCssPageSize: true, printBackground: true },
      checks: [
        "one-visible-panel",
        "source-image-loaded",
        "answer-hidden-until-explicit-reveal",
        "solution-board-hidden-until-explicit-action",
        "solution-board-opens-on-explicit-action",
        "lesson-controls-and-caption",
        "no-speech-caption-fallback",
        "no-horizontal-overflow",
        "geometry-semantic-object-ledger",
        "geometry-label-and-svg-clipping",
        "unit-bar-and-share-proportion-ledger",
        "print-role-visibility-boundary",
        "print-section-collision"
      ],
      artifacts: {
        screenshots: screenshots.map(fileEvidence),
        pdfs: pdfs.map(fileEvidence)
      }
    };
    fs.writeFileSync(reportPath,`${JSON.stringify(report,null,2)}\n`,{ encoding: "utf8", flag: "w" });
    return Object.freeze({ screenshots: Object.freeze(screenshots), pdfs: Object.freeze(pdfs), reportPath });
  } finally { if (browser) await browser.close(); }
}

if (require.main === module) {
  run({ inputRoot: arg(process.argv, "--input-root"), fileName: arg(process.argv, "--file"), outputRoot: arg(process.argv, "--output-root") })
    .then(function (result) { console.log(`PASS G·MAP whiteboard browser QA: ${result.screenshots.length} screenshots + ${result.pdfs.map(function (entry) { return path.basename(entry); }).join(", ")} + ${path.basename(result.reportPath)}`); })
    .catch(function (error) { console.error(`BLOCKED G·MAP whiteboard browser QA: ${error.code || error.message || "INVALID"}`); process.exitCode = 2; });
}

module.exports = Object.freeze({ run });
