import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels } from "./levels.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = process.env.GFIELD_SCREENSHOT_DIR || "E:/Codex/visualizations/2026/07/14/019f6069-3d4e-7503-8438-a193bbe6c30a/paper-fold-restore";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];

async function makePage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("gfield-audio-muted", "true");
    localStorage.setItem("gfield-language", "ko");
    localStorage.setItem("gfield-paper-fold-tutorial-v2", "done");
    localStorage.removeItem("gfield-paper-fold-recent");
  });
  return page;
}

function problemById(level, id) {
  const problem = levels[level - 1].problems.find((item) => item.id === id);
  assert.ok(problem, `missing level ${level} problem ${id}`);
  return problem;
}

async function currentProblem(page, level) {
  const recent = JSON.parse(await page.evaluate(() => localStorage.getItem("gfield-paper-fold-recent")));
  return problemById(level, recent[level][0]);
}

async function inspectVisualLevel(page, level) {
  await page.goto(`${baseUrl}/geometry/games/paper-fold/?level=${level}`, { waitUntil: "networkidle" });
  await page.locator(".paper.is-visual-choice").waitFor();
  const problem = await currentProblem(page, level);
  assert.equal(await page.locator(".result-choice").count(), 2, `level ${level} should show two whole-picture choices`);
  assert.equal(await page.locator("[data-region]").count(), 0, `level ${level} must not use cell tapping`);
  assert.equal(await page.locator(".crease-control").count(), 0, `level ${level} must not ask for a crease tap`);
  assert.equal(await page.locator(".fold-arrow").count(), 0, `level ${level} must not show abstract arrow chips`);
  assert.equal(await page.locator(".visual-paper-grid.main-paper").count(), 1);
  assert.equal(await page.locator(".visual-crease-line").count(), problem.folds.length, `level ${level} crease guide is missing`);
  assert.equal(await page.locator(".visual-direction-arrow").count(), problem.folds.length, `level ${level} direction arrow is missing`);
  const beforeMarks = await page.locator(".main-paper .visual-mark").count();
  assert.equal(beforeMarks, level === 2 ? problem.targetRegions.length : problem.sourceRegions.length);
  if (level !== 2) {
    const foldedBox = await page.locator(".main-paper.folded-paper").boundingBox();
    let rows = 4;
    let columns = 4;
    problem.folds.forEach((step) => { if (step.axis === "vertical") columns /= 2; else if (step.axis === "horizontal") rows /= 2; });
    assert.ok(Math.abs((foldedBox.width / foldedBox.height) - (columns / rows)) < .08, `level ${level} folded paper has the wrong proportions`);
  }
  if (level === 2) assert.match(await page.locator("#prompt").textContent(), /접기 전/);
  await page.screenshot({ path: `${output}/level-${level}-before-answer.png`, fullPage: true });
  await page.locator(`[data-choice="${problem.answer}"]`).click();
  await page.waitForTimeout(60);
  assert.equal(await page.locator(level === 2 ? ".paper.folding-back" : ".paper.unfolding").count(), 1, `level ${level} result animation did not start`);
  await page.waitForTimeout(1400);
  assert.equal(await page.locator(level === 2 ? ".paper.is-backtracked" : ".paper.is-unfolded").count(), 1);
  const afterMarks = await page.locator(".main-paper .visual-mark").count();
  assert.equal(afterMarks, level === 2 ? problem.sourceRegions.length : problem.targetRegions.length);
  return problem;
}

const desktop = await makePage({ width: 1280, height: 820 });
await inspectVisualLevel(desktop, 1);
await desktop.screenshot({ path: `${output}/level-1-desktop.png`, fullPage: true });
await inspectVisualLevel(desktop, 2);
await desktop.screenshot({ path: `${output}/level-2-desktop.png`, fullPage: true });
const level3 = await inspectVisualLevel(desktop, 3);
assert.equal(level3.action.type, "punch");
assert.ok(await desktop.locator(".main-paper .visual-mark.punch").count() > 0);
await desktop.screenshot({ path: `${output}/level-3-desktop.png`, fullPage: true });

for (const level of [4, 5]) {
  await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=${level}`, { waitUntil: "networkidle" });
  const problem = await currentProblem(desktop, level);
  assert.equal(await desktop.locator(".crease-control").count(), 1, `level ${level} fold control is missing`);
  assert.equal(await desktop.locator(".fold-arrow").count(), 0);
  for (let step = 0; step < problem.folds.length; step += 1) {
    await desktop.locator(".crease-control").evaluate((button) => button.click());
    await desktop.waitForTimeout(580);
  }
  assert.equal(await desktop.locator(".paper.is-folded").count(), 1);
  assert.ok(await desktop.locator(level === 4 ? ".board-grid.number-board" : ".top-choices").count() > 0);
}

for (const [name, viewport] of [["portrait", { width: 390, height: 844 }], ["landscape", { width: 844, height: 390 }]]) {
  const page = await makePage(viewport);
  await page.goto(`${baseUrl}/geometry/games/paper-fold/?level=2`, { waitUntil: "networkidle" });
  await page.locator(".paper.is-visual-choice").waitFor();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} horizontal overflow: ${overflow}px`);
  const choiceBoxes = await page.locator(".result-choice").evaluateAll((items) => items.map((item) => item.getBoundingClientRect()).map((box) => ({ width: box.width, height: box.height })));
  assert.ok(choiceBoxes.every((box) => box.width >= 80 && box.height >= 42), `${name} choices are too small`);
  await page.screenshot({ path: `${output}/level-2-${name}.png`, fullPage: true });
  await page.close();
}

const worksheet = await makePage({ width: 1440, height: 1000 });
for (const level of [1, 2, 3]) {
  await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l${level}&count=10`, { waitUntil: "networkidle" });
  await worksheet.locator(".sheet-page").first().waitFor();
  assert.match(await worksheet.locator("#info").textContent(), new RegExp(`paper-l${level}-`));
  assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
  assert.ok(await worksheet.locator(".problem-card img").first().evaluate((image) => image.complete && image.naturalWidth > 0));
}
await worksheet.screenshot({ path: `${output}/worksheet-level-3-preview.png`, fullPage: false });
await worksheet.emulateMedia({ media: "print" });
await worksheet.pdf({ path: `${output}/worksheet-level-3-a4.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
await worksheet.close();

assert.deepEqual(errors, []);
await browser.close();
console.log("Paper Fold browser check passed: visual choices, reverse flow, and responsive layouts verified.");
