import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { getDocument } = await import(pathToFileURL(path.join(modules, "pdfjs-dist/legacy/build/pdf.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8796").replace(/\/$/, "");
const output = process.env.DICE_SHEET_OUTPUT || path.join(os.tmpdir(), "gfield-dice-generator-audit");
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(`${baseUrl}/geometry/worksheet/dice-roll/?activity=all&level=5&count=20&cover=1&seed=20260910`, { waitUntil: "networkidle" });

assert.equal(new URL(await page.locator(".maker-bar > a").getAttribute("href"), page.url()).pathname, "/geometry/lab/");
assert.equal(await page.locator("#coverSheet").count(), 1);
assert.equal(await page.locator(".sheet").count(), 10);
assert.equal(await page.locator(".problem").count(), 20);
assert.equal(await page.locator("#countInput").getAttribute("max"), "20");
await page.locator("#countInput").fill("25");
await page.locator("#countInput").dispatchEvent("change");
assert.equal(await page.locator("#countInput").inputValue(), "20");
assert.equal(await page.locator(".problem").count(), 20);
assert.deepEqual(await page.locator(".sheet .problem-grid").evaluateAll((nodes) => nodes.map((node) => node.children.length)), Array(10).fill(2));
assert.deepEqual(await page.locator(".problem").evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.activity))].sort()), ["paired", "sequence", "sum", "target", "visible"]);
for (const activity of ["paired", "sequence", "sum", "target", "visible"]) assert.equal(await page.locator(`.problem[data-activity="${activity}"]`).count(), 4);

const selectionPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await selectionPage.goto(`${baseUrl}/geometry/worksheet/dice-roll/?activities=sequence.visible&level=4&count=20&cover=0&seed=20260910`, { waitUntil: "networkidle" });
assert.equal(await selectionPage.locator("#activitySelect").inputValue(), "sequence.visible");
assert.equal(await selectionPage.locator("#activitySelect option:checked").textContent(), "선택한 2개 활동 섞기");
assert.deepEqual(await selectionPage.locator(".problem").evaluateAll((nodes) => [...new Set(nodes.map((node) => node.dataset.activity))].sort()), ["sequence", "visible"]);
assert.equal(await selectionPage.locator('.problem[data-activity="sequence"]').count(), 10);
assert.equal(await selectionPage.locator('.problem[data-activity="visible"]').count(), 10);
assert.equal(new URL(selectionPage.url()).searchParams.get("activities"), "sequence.visible");
await selectionPage.close();

const numberedProblems = await page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => {
  const directChildren = [...node.children];
  const headers = directChildren.filter((child) => child.matches("header"));
  const visuals = directChildren.filter((child) => child.classList.contains("problem-visual"));
  const numberNodes = headers[0] ? [...headers[0].children].filter((child) => child.matches("b")) : [];
  const responseSelector = ".sequence-slots,.roll-sketches,.sum-slots,.write-answer,.answer-box";
  const responses = visuals[0] ? [...visuals[0].children].filter((child) => child.matches(responseSelector)) : [];
  return { id: node.dataset.problemId, number: numberNodes[0]?.textContent.trim(), headers: headers.length, numberNodes: numberNodes.length, prompts: headers[0]?.querySelectorAll("p").length || 0, visuals: visuals.length, responses: responses.length, nestedProblems: node.querySelectorAll(".problem").length };
}));
assert.equal(new Set(numberedProblems.map((problem) => problem.id)).size, 20);
assert.deepEqual(numberedProblems.map((problem) => problem.number), Array.from({ length: 20 }, (_, index) => String(index + 1)));
for (const problem of numberedProblems) assert.deepEqual({ headers: problem.headers, numberNodes: problem.numberNodes, prompts: problem.prompts, visuals: problem.visuals, responses: problem.responses, nestedProblems: problem.nestedProblems }, { headers: 1, numberNodes: 1, prompts: 1, visuals: 1, responses: 1, nestedProblems: 0 }, JSON.stringify(problem));

const boardCount = await page.locator(".route-board").count();
assert.equal(boardCount, 24);
assert.equal(await page.locator('.route-board marker[markerWidth="5"][markerHeight="5"]').count(), boardCount);
const routeStrokeWidths = await page.locator(".route-board line[data-direction]").evaluateAll((lines) => lines.map((line) => Number.parseFloat(getComputedStyle(line).strokeWidth)));
assert.ok(routeStrokeWidths.length > 0 && routeStrokeWidths.every((width) => Math.abs(width - 2) < .01), JSON.stringify(routeStrokeWidths));
assert.equal(await page.locator(".route-board .board-die").count(), boardCount);
assert.equal(await page.locator(".route-board .board-die .die-face").count(), boardCount * 3);
assert.equal(await page.locator('.route-board[data-viewpoint="southeast-diagonal"]').count(), boardCount);
assert.equal(await page.locator(".paired-problem .unknown-face").count(), 4);
assert.equal(await page.locator(".visible-problem .face-slots").count(), 0);
assert.equal(await page.locator(".visible-problem .finish-die").count(), 0);
const visibleStudentWork = await page.locator(".visible-problem").evaluateAll((problems) => problems.map((problem) => ({
  moves: problem.querySelectorAll('.route-board line[data-direction]').length,
  declaredSteps: Number(problem.querySelector(".roll-sketches")?.dataset.stepCount),
  sketches: problem.querySelectorAll(".roll-sketch").length,
  finalSketches: problem.querySelectorAll(".roll-sketch.is-final").length,
  prompt: problem.querySelector("header p")?.textContent || "",
  layout: (() => {
    const visual = problem.querySelector(".problem-visual").getBoundingClientRect();
    const board = problem.querySelector(".route-board").getBoundingClientRect();
    const sketches = problem.querySelector(".roll-sketches").getBoundingClientRect();
    return { visualTop: visual.top, visualBottom: visual.bottom, boardTop: board.top, boardBottom: board.bottom, sketchesTop: sketches.top, sketchesBottom: sketches.bottom };
  })(),
  guides: [...problem.querySelectorAll(".five-face-guide")].map((guide) => ({
    faces: guide.querySelectorAll("polygon.five-face-region").length,
    outerSquares: guide.querySelectorAll("rect.five-face-outer").length,
    innerSquares: guide.querySelectorAll("rect.five-face-inner").length,
    connectors: guide.querySelectorAll("line.five-face-connector").length,
    pips: guide.querySelectorAll("circle.five-face-pip").length,
    width: guide.getBBox().width,
    height: guide.getBBox().height
  }))
})));
for (const problem of visibleStudentWork) {
  assert.equal(problem.declaredSteps, problem.moves, JSON.stringify(problem));
  assert.equal(problem.sketches, problem.moves, JSON.stringify(problem));
  assert.equal(problem.finalSketches, 1, JSON.stringify(problem));
  assert.ok(!/(윗면|앞면|오른쪽 면)/.test(problem.prompt), problem.prompt);
  assert.ok(problem.layout.boardTop >= problem.layout.visualTop - 1 && problem.layout.boardBottom <= problem.layout.sketchesTop + 1 && problem.layout.sketchesBottom <= problem.layout.visualBottom + 1, JSON.stringify(problem.layout));
  assert.ok(problem.guides.every((guide) => guide.faces === 5 && guide.outerSquares === 1 && guide.innerSquares === 1 && guide.connectors === 4 && guide.pips === 0 && guide.width > 75 && guide.height > 75), JSON.stringify(problem.guides));
}
assert.equal(await page.locator(".answer-box").count(), 0);

const alignments = await page.locator(".board-die").evaluateAll((nodes) => nodes.map((node) => {
  const transform = node.getAttribute("transform").match(/translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/);
  const [contactX, contactY] = node.dataset.contactCenter.split(",").map(Number);
  const [baseX, baseY] = node.dataset.localBase.split(",").map(Number);
  return Math.max(Math.abs(Number(transform[1]) + baseX * Number(transform[3]) - contactX), Math.abs(Number(transform[2]) + baseY * Number(transform[3]) - contactY));
}));
assert.ok(alignments.every((difference) => difference < .001), JSON.stringify(alignments));

const projectedRoutes = await page.locator(".route-board line[data-direction]").evaluateAll((lines) => lines.map((line) => {
  const [dx, dy] = line.dataset.vector.split(",").map(Number);
  return { direction: line.dataset.direction, dx, dy };
}));
for (const route of projectedRoutes) {
  const expected = { N: [69.282, -40], E: [69.282, 40], S: [-69.282, 40], W: [-69.282, -40] }[route.direction];
  assert.ok(Math.abs(route.dx - expected[0]) < .01 && Math.abs(route.dy - expected[1]) < .01, JSON.stringify(route));
}

const desktop = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, blankBoards: [...document.querySelectorAll(".route-board")].filter((svg) => svg.getBBox().width < 50 || svg.getBBox().height < 50).length }));
assert.ok(desktop.scrollWidth <= desktop.width + 1, JSON.stringify(desktop));
assert.equal(desktop.blankBoards, 0);
await page.screenshot({ path: path.join(output, "desktop.png"), fullPage: true });

await page.locator("#answerToggle").check();
assert.equal(await page.locator(".answer-box").count(), 20);
assert.equal(await page.locator(".unknown-face").count(), 0);
const visibleAnswerWork = await page.locator(".visible-problem").evaluateAll((problems) => problems.map((problem) => ({
  moves: problem.querySelectorAll('.route-board line[data-direction]').length,
  layout: (() => {
    const visual = problem.querySelector(".problem-visual").getBoundingClientRect();
    const board = problem.querySelector(".route-board").getBoundingClientRect();
    const sketches = problem.querySelector(".roll-sketches").getBoundingClientRect();
    const answer = problem.querySelector(".answer-box").getBoundingClientRect();
    return { visualTop: visual.top, visualBottom: visual.bottom, boardTop: board.top, boardBottom: board.bottom, sketchesTop: sketches.top, sketchesBottom: sketches.bottom, answerTop: answer.top, answerBottom: answer.bottom };
  })(),
  guides: [...problem.querySelectorAll(".five-face-guide")].map((guide) => ({
    faces: guide.querySelectorAll("polygon.five-face-region").length,
    pips: guide.querySelectorAll("circle.five-face-pip").length,
    state: guide.dataset.state.split(",").map(Number),
    pipsByFace: Object.fromEntries(["top", "north", "south", "east", "west"].map((face) => [face, guide.querySelectorAll(`circle.five-face-pip[data-face="${face}"]`).length]))
  }))
})));
for (const problem of visibleAnswerWork) {
  assert.equal(problem.guides.length, problem.moves, JSON.stringify(problem));
  assert.ok(problem.layout.boardTop >= problem.layout.visualTop - 1 && problem.layout.boardBottom <= problem.layout.sketchesTop + 1 && problem.layout.sketchesBottom <= problem.layout.answerTop + 1 && problem.layout.answerBottom <= problem.layout.visualBottom + 1, JSON.stringify(problem.layout));
  assert.ok(problem.guides.every((guide) => guide.faces === 5 && guide.pips >= 15 && guide.state.length === 6 && new Set(guide.state).size === 6 && guide.state.every((value) => value >= 1 && value <= 6)
    && guide.pipsByFace.top === guide.state[0] && guide.pipsByFace.north === guide.state[2] && guide.pipsByFace.south === guide.state[3] && guide.pipsByFace.east === guide.state[4] && guide.pipsByFace.west === guide.state[5]), JSON.stringify(problem.guides));
}
for (const lang of ["en", "zh", "ja", "ko"]) {
  await page.locator("#languageSelect").selectOption(lang);
  assert.equal(await page.locator(".problem").count(), 20);
  assert.equal(await page.locator(".answer-box").count(), 20);
}

const beforeRound = new URL(page.url()).searchParams.get("round");
const beforeRoutes = await page.locator(".route-board").evaluateAll((nodes) => nodes.map((node) => node.dataset.route).join("|"));
await page.locator("#refreshButton").click();
const afterRoutes = await page.locator(".route-board").evaluateAll((nodes) => nodes.map((node) => node.dataset.route).join("|"));
assert.notEqual(beforeRoutes, afterRoutes);
assert.equal(Number(new URL(page.url()).searchParams.get("round")), Number(beforeRound) + 1);

await page.emulateMedia({ media: "print" });
const answerPrintMetrics = await page.locator(".sheet").evaluateAll((nodes) => nodes.map((node) => ({ height: node.getBoundingClientRect().height, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight })));
assert.ok(answerPrintMetrics.every((item) => item.height <= 1124 && item.scrollHeight <= item.clientHeight + 1), JSON.stringify(answerPrintMetrics));
const answerPdfBytes = await page.pdf({ path: path.join(output, "worksheet-answers.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
const answerPdf = await PDFDocument.load(answerPdfBytes);
assert.equal(answerPdf.getPageCount(), 11);

await page.emulateMedia({ media: "screen" });
await page.locator("#answerToggle").uncheck();
await page.emulateMedia({ media: "print" });
const printMetrics = await page.locator(".sheet").evaluateAll((nodes) => nodes.map((node) => ({ height: node.getBoundingClientRect().height, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight })));
assert.ok(printMetrics.every((item) => item.height <= 1124 && item.scrollHeight <= item.clientHeight + 1), JSON.stringify(printMetrics));
const pdfBytes = await page.pdf({ path: path.join(output, "worksheet.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
const pdf = await PDFDocument.load(pdfBytes);
assert.equal(pdf.getPageCount(), 11);
const printed = await getDocument({ data: new Uint8Array(pdfBytes), disableWorker: true }).promise;
for (let pageNumber = 2; pageNumber <= printed.numPages; pageNumber += 1) {
  const printedPage = await printed.getPage(pageNumber);
  const textContent = await printedPage.getTextContent();
  assert.ok(textContent.items.some((item) => item.str.replace(/\s/g, "").includes("GFIELD") && item.transform[5] > 790), `Missing printed worksheet header on page ${pageNumber}`);
}

await page.emulateMedia({ media: "screen" });
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
const mobile = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, problems: document.querySelectorAll(".problem").length }));
assert.ok(mobile.scrollWidth <= mobile.width + 1, JSON.stringify(mobile));
assert.equal(mobile.problems, 20);
await page.screenshot({ path: path.join(output, "mobile.png"), fullPage: false });

assert.deepEqual(errors, []);
await browser.close();
console.log(`DICE_ROLL_SHEET_BROWSER_OK questions=20 sheets=10 cover=1 pdfPages=11 boards=${boardCount} output=${output}`);
