import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { levels } from "./levels.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const output = process.env.GFIELD_SCREENSHOT_DIR || "E:/Codex/visualizations/2026/07/14/019f6069-3d4e-7503-8438-a193bbe6c30a/paper-fold-flexible-ten";
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
    localStorage.removeItem("gfield-paper-fold-progress-v4");
    localStorage.removeItem("gfield-paper-fold-recent-v4");
  });
  return page;
}

async function currentProblem(page) {
  const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("gfield-paper-fold-progress-v4")));
  const level = levels[saved.level - 1];
  const problem = level.problems.find((item) => item.id === saved.queue[saved.index]);
  assert.ok(problem, `missing current problem ${saved.queue[saved.index]}`);
  return problem;
}

async function solveCurrent(page) {
  const problem = await currentProblem(page);
  assert.equal(problem.folds.length, 1, `${problem.id} must fold exactly once`);
  if (problem.interaction === "result-choice") {
    assert.deepEqual(new Set(problem.choices.map((choice) => choice.profileId)), new Set([problem.profileId]));
    assert.deepEqual(new Set(problem.choices.map((choice) => choice.variant)), new Set(["correct", "shallow", "shifted"]));
    assert.equal(await page.locator(".fold-sequence-view figure").count(), 3);
    assert.equal(await page.locator(".paper-fold-arrow").count(), 1);
    const marker = page.locator(".fold-sequence-view marker").first();
    assert.equal(await marker.getAttribute("markerUnits"), "userSpaceOnUse");
    assert.ok(Number(await marker.getAttribute("markerWidth")) <= 9, "fold arrow head is too large");
    assert.equal(await page.locator(".paper-cut-line").count(), 1);
    assert.equal(await page.locator(".result-choice").count(), 3);
    await page.locator(`[data-choice="${problem.answer}"]`).click();
    await page.locator(".result-step .result-hole").waitFor();
  } else {
    assert.equal(await page.locator("[data-left]").count(), 3);
    assert.equal(await page.locator("[data-right]").count(), 3);
    for (const pair of problem.pairs) {
      await page.locator(`[data-left="${pair.key}"]`).click();
      await page.locator(`[data-right="${pair.key}"]`).click();
    }
    assert.equal(await page.locator("#connectionLines path").count(), 3);
    await page.locator(".check-button").click();
  }
  await page.locator("#nextButton:not([hidden])").waitFor();
  return problem;
}

async function advance(page) {
  await page.waitForTimeout(660);
  await page.locator("#nextButton").click();
}

const desktop = await makePage({ width: 1280, height: 820 });
await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=1`, { waitUntil: "networkidle" });
assert.equal(await desktop.locator("#problemLabel").textContent(), "1 / 10");
await desktop.locator("#levelButton").click();
assert.equal(await desktop.locator(".level-card").count(), 2);
await desktop.locator("#closeLevels").click();

const interactions = new Set();
for (let index = 0; index < 10; index += 1) {
  const solved = await solveCurrent(desktop);
  interactions.add(solved.interaction);
  if (index === 0) await desktop.screenshot({ path: `${output}/choice-desktop.png`, fullPage: true });
  if (index === 1) await desktop.screenshot({ path: `${output}/connect-desktop.png`, fullPage: true });
  await advance(desktop);
}
assert.deepEqual(interactions, new Set(["result-choice", "connect-match"]));
assert.equal(await desktop.locator("#completeDialog:not([hidden])").count(), 1);
assert.match(await desktop.locator("#completeTitle").textContent(), /10문제/);
assert.match(await desktop.locator("#nextLevelButton").textContent(), /10문제 더/);
await desktop.locator("#nextLevelButton").click();
assert.equal(await desktop.locator("#problemLabel").textContent(), "11 / 20");

for (let index = 10; index < 20; index += 1) {
  await solveCurrent(desktop);
  await advance(desktop);
}
assert.equal(await desktop.locator("#completeDialog:not([hidden])").count(), 1);
assert.match(await desktop.locator("#completeTitle").textContent(), /20문제/);

await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=2`, { waitUntil: "networkidle" });
const diagonal = await currentProblem(desktop);
assert.ok(diagonal.fold.axis.startsWith("diag"));
await solveCurrent(desktop);
await desktop.screenshot({ path: `${output}/diagonal-desktop.png`, fullPage: true });

for (const [name, viewport] of [["portrait", { width: 390, height: 844 }], ["landscape", { width: 844, height: 390 }]]) {
  const page = await makePage(viewport);
  await page.goto(`${baseUrl}/geometry/games/paper-fold/?level=1`, { waitUntil: "networkidle" });
  let overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} choice overflow: ${overflow}px`);
  await solveCurrent(page);
  await advance(page);
  assert.equal((await currentProblem(page)).interaction, "connect-match");
  overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} connect overflow: ${overflow}px`);
  await page.screenshot({ path: `${output}/connect-${name}.png`, fullPage: true });
  await page.close();
}

const studio = await makePage({ width: 1280, height: 900 });
await studio.goto(`${baseUrl}/geometry/origami-studio/`, { waitUntil: "networkidle" });
assert.equal(await studio.locator("#foldLevelGrid .level-card").count(), 2);
assert.match(await studio.locator("[data-i18n='fiveEach']").first().textContent(), /10문제/);
await studio.screenshot({ path: `${output}/origami-studio-two-types.png`, fullPage: true });
await studio.close();

const worksheet = await makePage({ width: 1440, height: 1000 });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l1&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#mode option[value^='game-l']").count(), 2);
assert.match(await worksheet.locator("#info").textContent(), /paper-straight/);
assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l2&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.match(await worksheet.locator("#info").textContent(), /paper-diagonal/);
await worksheet.screenshot({ path: `${output}/worksheet-diagonal-preview.png`, fullPage: false });
await worksheet.close();

assert.deepEqual(errors, []);
await browser.close();
console.log("Paper Fold browser check passed: 2 types, single folds, mixed interactions, 10+10 flow, responsive layouts, and worksheet links verified.");
