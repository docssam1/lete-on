import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels } from "../../games/shape-transform/levels.js";
import { pathData, drawingQuota } from "./workbook-core.js";
import { deriveDrawing } from "./drawing-problems.js";
import { rotationArc } from "../../games/shape-transform/rotation-cue.js";

const require = createRequire(import.meta.url);
const { PDFDocument } = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib/cjs/index.js");
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = fileURLToPath(new URL("./qa-artifacts/drawing/", import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(10000);
const errors = [], results = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
const bank = new Map(levels.flatMap((level) => level.problems).map((problem) => [problem.id, problem]));
const snapshot = () => page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => ({ id: node.dataset.problemId, mode: node.dataset.responseMode, target: node.querySelector(".target .shape-line").getAttribute("d") })));

async function assertLayout() {
  const layout = await page.evaluate(() => {
    const issues = [];
    const rect = (node) => node.getBoundingClientRect();
    for (const problem of document.querySelectorAll(".problem")) {
      const box = rect(problem);
      const diagrams = [...problem.querySelectorAll(".shape-svg")].map(rect);
      const drawing = problem.dataset.responseMode === "draw";
      if (diagrams.length !== (drawing ? 2 : 4)) issues.push("Wrong diagram count");
      if (diagrams.some((d) => Math.abs(d.width - diagrams[0].width) > .1 || Math.abs(d.height - d.width) > .1)) issues.push("Unequal diagram scales");
      if (drawing && diagrams.some((d) => d.width < 200)) issues.push("Drawing board too small");
      for (const child of problem.querySelectorAll(".problem-heading, .visual, .evidence, .shape-svg")) {
        const c = rect(child);
        if (c.left < box.left - 1 || c.right > box.right + 1 || c.bottom > box.bottom + 1) issues.push(`Overflow ${problem.dataset.problemId} ${child.classList[0]}`);
      }
      const heading = rect(problem.querySelector(".problem-heading"));
      const visual = rect(problem.querySelector(".visual"));
      const evidence = rect(problem.querySelector(".evidence"));
      if (heading.bottom > visual.top + 1 || visual.bottom > evidence.top + 1) issues.push(`Overlap ${problem.dataset.problemId}`);
    }
    for (const sheet of document.querySelectorAll(".sheet")) {
      const domains = new Set([...sheet.querySelectorAll(".problem")].map((p) => p.dataset.level));
      if (domains.size !== 1 || !domains.has(sheet.dataset.level)) issues.push("Mixed domain page");
      if (rect(sheet.querySelector(".problem-grid")).bottom > rect(sheet.querySelector("footer")).top + 1) issues.push("Footer overlap");
      if (sheet.scrollHeight > sheet.clientHeight + 1 || sheet.scrollWidth > sheet.clientWidth + 1) issues.push("Page overflow");
    }
    for (const paper of document.querySelectorAll(".sheet, #coverSheet:not([hidden])")) {
      const watermark = paper.querySelector(".page-watermark");
      if (!watermark || !watermark.textContent.includes("GFIELD") || rect(watermark).bottom > rect(paper).bottom) issues.push("Missing or overflowing watermark");
    }
    return { viewport: innerWidth, width: document.documentElement.scrollWidth, questions: document.querySelectorAll(".problem").length, issues };
  });
  assert.deepEqual(layout.issues, [], JSON.stringify(layout));
  assert.equal(layout.width, layout.viewport, JSON.stringify(layout));
  return layout;
}

async function assertContent(showAnswers) {
  const items = await page.locator(".problem").evaluateAll((nodes) => nodes.map((node) => {
    const response = node.querySelector(".drawing-board svg");
    return {
      id: node.dataset.problemId, mode: node.dataset.responseMode, model: node.dataset.coordinateModel,
      target: node.querySelector(".target .shape-line").getAttribute("d"),
      choices: [...node.querySelectorAll(".mini-choice .shape-line")].map((p) => p.getAttribute("d")),
      correctCount: node.querySelectorAll(".mini-choice.correct").length,
      answer: response?.querySelector(".drawing-answer")?.getAttribute("d") || null,
      responseShapes: response?.querySelectorAll(".shape-line, .shape-fill, .ghost-line, .proof-line, .proof-edge, .proof-ray, .vertex-dot, .point-label").length || 0,
      responseLabels: response ? [...response.querySelectorAll("text")].map((n) => n.textContent) : [],
      responsePathClasses: response ? [...response.querySelectorAll("path")].map((n) => n.getAttribute("class")) : [],
      alt: response?.getAttribute("aria-label"),
      filled: [...node.querySelectorAll(".shape-fill")].map((n) => getComputedStyle(n).fill),
      pivotCount: response?.querySelectorAll(".pivot-dot").length || 0,
      dots: response?.querySelectorAll(".grid-point").length || 0,
      cue: node.querySelector(".rotation-arc")?.getAttribute("d") || null
    };
  }));
  for (const item of items) {
    const original = bank.get(item.id);
    assert.ok(original, item.id);
    assert.ok(new Set(item.filled).size <= 1, "Fill must not identify the answer");
    if (item.mode === "choice") {
      assert.equal(item.model, "bank-original");
      assert.equal(item.target, pathData(original.target, original.closed));
      assert.deepEqual(item.choices, original.choices.map((points) => pathData(points, original.closed)));
      assert.equal(item.correctCount, showAnswers ? 1 : 0);
    } else {
      const drawing = deriveDrawing(original);
      assert.equal(item.model, "ordered-whole-grid-v1");
      assert.equal(item.target, pathData(drawing.target, drawing.closed));
      assert.deepEqual(item.choices, []);
      assert.equal(item.dots, 121);
      assert.equal(item.answer, showAnswers ? pathData(drawing.answer, drawing.closed) : null);
      const hasPivot = original.level >= 3;
      assert.equal(item.pivotCount, hasPivot ? 1 : 0);
      if (!showAnswers) {
        assert.deepEqual(item.responseLabels, hasPivot ? ["O"] : []);
        assert.equal(item.responseShapes, hasPivot ? 1 : 0, "Student grid must have no answer, ghost, endpoint or hidden path");
        assert.deepEqual(item.responsePathClasses, ["grid-line"], "Only grid lines are allowed in a student response board");
        assert.equal(item.alt, "빈 그리기 격자");
      }
    }
    if (original.operation.kind === "rotate") assert.equal(item.cue, rotationArc(original.operation.angle).path);
  }
  const text = await page.locator("body").innerText();
  assert.doesNotMatch(text, /1\/2|0\.5|\\frac|축소|줄이기한/);
  if (!showAnswers) assert.equal(await page.locator(".problem .ghost-line, .problem .proof-line, .problem .proof-edge, .problem .proof-circle, .drawing-answer").count(), 0);
  return items.length;
}

async function assertProgression() {
  const data = await snapshot();
  for (const level of levels) {
    const domain = data.filter((entry) => bank.get(entry.id).level === level.id);
    const draws = drawingQuota(domain.length);
    assert.deepEqual(domain.map((entry) => entry.mode), [...Array(domain.length - draws).fill("choice"), ...Array(draws).fill("draw")]);
    if (draws) assert.ok(domain.slice(-draws).some((entry) => bank.get(entry.id).closed));
  }
  return data;
}

async function pdfCheck(name, expectedPages) {
  await page.emulateMedia({ media: "print" });
  await assertLayout();
  const bytes = await page.pdf({ printBackground: true, preferCSSPageSize: true });
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), expectedPages, name);
  for (const sheet of pdf.getPages()) {
    assert.ok(Math.abs(sheet.getWidth() - 595.28) < 1);
    assert.ok(Math.abs(sheet.getHeight() - 841.89) < 1);
  }
  await writeFile(`${output}/${name}.pdf`, bytes);
  results.push({ pdf: name, pages: expectedPages, entries: await snapshot() });
  await page.emulateMedia({ media: "screen" });
}

async function renderFixture(level, mode, answers) {
  await page.evaluate(async ({ level, mode, answers }) => {
    const { renderEntries } = await import("./app.js?v=workbook-5");
    const { levels } = await import("../../games/shape-transform/levels.js?v=shape-transform-3");
    const { deriveDrawing } = await import("./drawing-problems.js?v=draw-1");
    document.querySelector("#answerToggle").checked = answers;
    const domain = levels[level - 1];
    renderEntries(domain.problems.map((problem) => ({ level: domain, problem, responseMode: mode, ...(mode === "draw" ? { drawing: deriveDrawing(problem) } : {}) })));
  }, { level, mode, answers });
}

try {
  await page.goto(`${baseUrl}/geometry/worksheet/shape-transform/`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#levelSelect").inputValue(), "1");
  assert.equal(await page.locator("#countInput").getAttribute("max"), "20");
  await page.locator("#countInput").fill("20");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator("#levelSelect").inputValue(), "1");
  assert.equal(await page.locator("#countInput").inputValue(), "10");
  assert.match(await page.locator("#countNotice").textContent(), /10문항으로 조정.*선택 영역은 그대로/);
  const selected10 = await assertProgression();
  assert.equal(selected10.length, 10);
  await assertContent(false);
  await pdfCheck("selected10-student", 4);
  await page.locator("#answerToggle").check();
  assert.deepEqual(await snapshot(), selected10);
  await assertContent(true);
  await pdfCheck("selected10-answers", 4);

  let layoutQuestionChecks = 0;
  for (let level = 1; level <= 5; level += 1) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${baseUrl}/geometry/worksheet/shape-transform/?level=${level}`, { waitUntil: "networkidle" });
    const initial = await assertProgression();
    assert.equal(initial.length, 10);
    for (const answer of [true, false]) {
      await page.locator("#answerToggle").setChecked(answer);
      assert.deepEqual(await snapshot(), initial);
      await assertContent(answer);
    }
    await page.locator("#coverToggle").uncheck();
    assert.deepEqual(await snapshot(), initial);
    await page.locator("#refreshButton").click();
    assert.notDeepEqual(await snapshot(), initial);
    for (const count of [1, 2, 3, 4]) {
      await page.locator("#countInput").fill(String(count));
      await page.locator("#countInput").dispatchEvent("change");
      assert.equal((await assertProgression()).length, count);
    }
    // Layout fixtures cover all 50 originals AND all 50 derived drawings, not
    // just the random two drawings selected for a normal ten-question booklet.
    for (const mode of ["choice", "draw"]) {
      for (const width of [390, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        for (const answer of [false, true]) {
          await renderFixture(level, mode, answer);
          await assertContent(answer);
          layoutQuestionChecks += (await assertLayout()).questions;
        }
      }
      await page.emulateMedia({ media: "print" });
      await assertLayout();
      if (mode === "draw") await page.locator(".sheet").first().screenshot({ path: `${output}/domain-${level}-drawing-answers.png` });
      await page.emulateMedia({ media: "screen" });
    }
  }
  results.push({ layoutQuestionChecks, originalQuestions: 50, derivedQuestions: 50, viewports: [390, 768, 1280], studentAndAnswer: true });

  await page.goto(`${baseUrl}/geometry/worksheet/shape-transform/?level=all`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#countInput").inputValue(), "20");
  const all20 = await assertProgression();
  assert.equal(new Set(all20.map((entry) => entry.id)).size, 20);
  assert.equal(all20.filter((entry) => entry.mode === "draw").length, 10);
  await assertContent(false);
  await pdfCheck("all20-student", 6);
  await page.emulateMedia({ media: "print" });
  await page.locator("#coverSheet").screenshot({ path: `${output}/cover.png` });
  for (let index = 0; index < 5; index += 1) await page.locator(".sheet").nth(index).screenshot({ path: `${output}/mixed-domain-${index + 1}-student.png` });
  await page.emulateMedia({ media: "screen" });
  await page.locator("#answerToggle").check();
  assert.deepEqual(await snapshot(), all20);
  await assertContent(true);
  await pdfCheck("all20-answers", 6);
  await page.locator("#coverToggle").uncheck();
  assert.deepEqual(await snapshot(), all20);
  await pdfCheck("all20-no-cover", 5);
  await page.locator("#countInput").fill("99");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator("#countInput").inputValue(), "20");
  await page.locator("#countInput").fill("1");
  await page.locator("#countInput").dispatchEvent("change");
  assert.equal(await page.locator(".drawing-problem").count(), 0);
  await pdfCheck("single1-no-cover", 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/geometry/worksheet/shape-transform/?level=all`, { waitUntil: "networkidle" });
  await assertLayout();
  await page.locator(".drawing-problem").nth(5).screenshot({ path: `${output}/mobile-drawing.png` });
  assert.deepEqual(errors, []);
  await writeFile(`${output}/results.json`, JSON.stringify({ passed: true, baseUrl, results, errors }, null, 2));
  console.log(JSON.stringify({ passed: true, output, layoutQuestionChecks, pdfs: results.filter((result) => result.pdf).map(({ pdf, pages }) => ({ pdf, pages })), errors }, null, 2));
} finally {
  await browser.close();
}
