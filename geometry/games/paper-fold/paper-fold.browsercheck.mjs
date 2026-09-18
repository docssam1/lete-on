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
  if (problem.interaction !== "connect-match") {
    assert.equal(await page.locator(".fold-sequence-view figure").count(), problem.interaction === "piece-count" && problem.folds.length === 2 ? 4 : 3);
    assert.equal(await page.locator(".paper-fold-arrow").count(), problem.folds.length);
    const marker = page.locator(".fold-sequence-view marker").first();
    assert.equal(await marker.getAttribute("markerUnits"), "userSpaceOnUse");
    assert.ok(Number(await marker.getAttribute("markerWidth")) <= 9, "fold arrow head is too large");
    for (const step of problem.placementSteps) {
      assert.equal(await page.locator("[data-side]").count(), 2);
      await page.locator(`[data-side="${step.answer}"]`).click();
      await page.waitForTimeout(220);
    }
    assert.equal(await page.locator("[data-choice]").count(), 3);
    await page.locator(`[data-choice="${problem.answer}"]`).click();
  } else {
    assert.equal(await page.locator("[data-left]").count(), 3);
    assert.equal(await page.locator("[data-right]").count(), 3);
    assert.equal(await page.locator(".check-button").count(), 0);
    for (const pair of problem.pairs) {
      await page.locator(`[data-left="${pair.key}"]`).click();
      await page.locator(`[data-right="${pair.key}"]`).click();
    }
    assert.equal(await page.locator("#connectionLines path").count(), 3);
  }
  await page.locator("#nextButton:not([hidden])").waitFor();
  return problem;
}

async function advance(page) {
  await page.waitForTimeout(660);
  await page.locator("#nextButton").click();
}

async function verifyImmediateWrongRecovery(page) {
  const problem = await currentProblem(page);
  assert.equal(problem.interaction, "connect-match");
  const rightKeys = problem.pairs.map((pair) => pair.key);
  for (let index = 0; index < problem.pairs.length; index += 1) {
    const pair = problem.pairs[index];
    const wrongRight = rightKeys[(index + 1) % rightKeys.length];
    await page.locator(`[data-left="${pair.key}"]`).click();
    await page.locator(`[data-right="${wrongRight}"]`).click();
  }
  await page.locator(".connect-card.wrong").first().waitFor();
  assert.equal(await page.locator(".check-button").count(), 0);
  await page.waitForTimeout(620);
  assert.equal(await page.locator("#connectionLines path").count(), 0);
}

const desktop = await makePage({ width: 1280, height: 820 });
await desktop.goto(`${baseUrl}/geometry/games/paper-fold/?level=1`, { waitUntil: "networkidle" });
assert.equal(await desktop.locator("#problemLabel").textContent(), "1 / 10");
assert.equal(await desktop.locator("#levelLabel").textContent(), "색종이 접어 자르기");
await desktop.locator("#levelButton").click();
assert.equal(await desktop.locator(".level-card").count(), 2);
await desktop.locator("#closeLevels").click();

const interactions = new Set();
for (let index = 0; index < 10; index += 1) {
  if (index === 1) await verifyImmediateWrongRecovery(desktop);
  const solved = await solveCurrent(desktop);
  interactions.add(solved.interaction);
  if (index === 0) await desktop.screenshot({ path: `${output}/choice-desktop.png`, fullPage: true });
  if (index === 1) await desktop.screenshot({ path: `${output}/connect-desktop.png`, fullPage: true });
  await advance(desktop);
}
assert.ok(interactions.has("connect-match"));
assert.ok(interactions.has("piece-count"));
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
const doubleFold = await currentProblem(desktop);
assert.ok([1, 2].includes(doubleFold.folds.length));
assert.ok(doubleFold.kind.includes("holes"));
await solveCurrent(desktop);
await desktop.screenshot({ path: `${output}/double-fold-desktop.png`, fullPage: true });

const forcedDoubleCut = levels[0].problems.find((item) => item.interaction === "piece-count" && item.folds.length === 2);
assert.ok(forcedDoubleCut, "missing a two-fold cut problem");
const forcedQueue = [forcedDoubleCut.id, ...levels[0].problems.filter((item) => item.id !== forcedDoubleCut.id).slice(0, 9).map((item) => item.id)];
const doubleCutPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
doubleCutPage.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
doubleCutPage.on("pageerror", (error) => errors.push(error.message));
await doubleCutPage.addInitScript(({ queue }) => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 1, index: 0, queue }));
}, { queue: forcedQueue });
await doubleCutPage.goto(`${baseUrl}/geometry/games/paper-fold/`, { waitUntil: "networkidle" });
assert.equal((await currentProblem(doubleCutPage)).id, forcedDoubleCut.id);
assert.equal(await doubleCutPage.locator(".fold-sequence-view figure").count(), 4);
assert.ok(await doubleCutPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 1);
await doubleCutPage.screenshot({ path: `${output}/double-cut-portrait.png`, fullPage: true });
await doubleCutPage.close();

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
assert.equal(await studio.locator("#foldLevelGrid .level-card strong").first().textContent(), "색종이 접어 자르기");
assert.equal(await studio.locator("#foldLevelGrid .level-card strong").nth(1).textContent(), "색종이 접어 구멍 뚫기");
assert.equal(await studio.locator("#applicationGrid .level-card").count(), 2);
assert.equal(await studio.locator("#applicationGrid .level-card strong").first().textContent(), "접어 계산하기");
assert.equal(await studio.locator("#applicationGrid .level-card strong").nth(1).textContent(), "겹친 색종이 순서");
assert.match(await studio.locator("#applicationGrid .level-card").first().getAttribute("href"), /modes=numcut,numsum,numinv,foldtop/);
assert.match(await studio.locator("#applicationGrid .level-card").nth(1).getAttribute("href"), /modes=stackfind,stackorder/);
assert.match(await studio.locator("[data-i18n='fiveEach']").first().textContent(), /10문제/);
await studio.screenshot({ path: `${output}/origami-studio-two-types.png`, fullPage: true });
await studio.close();

const worksheet = await makePage({ width: 1440, height: 1000 });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l1&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#mode option[value^='game-l']").count(), 2);
assert.match(await worksheet.locator("#mode option[value='game-l1']").textContent(), /접어 자르기/);
assert.match(await worksheet.locator("#info").textContent(), /paper-cut/);
assert.ok(await worksheet.locator(".problem-card img").count() >= 10);
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?mode=game-l2&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.match(await worksheet.locator("#info").textContent(), /paper-(double-hole|holes)/);
await worksheet.screenshot({ path: `${output}/worksheet-double-fold-preview.png`, fullPage: false });
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?modes=numcut,numsum,numinv,foldtop&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").count(), 4);
for (const label of ["잘려나간 수들의 합", "남은 수들의 합", "목표 합", "가장 위의 수"]){
  assert.match(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").allTextContents().then((items)=>items.join(" ")), new RegExp(label));
}
await worksheet.goto(`${baseUrl}/geometry/worksheet/paper-fold/?modes=stackfind,stackorder&count=10`, { waitUntil: "networkidle" });
await worksheet.locator(".sheet-page").first().waitFor();
assert.equal(await worksheet.locator("#modeButtons .mode-button[aria-pressed='true']").count(), 2);
await worksheet.close();

assert.deepEqual(errors, []);
await browser.close();
console.log("Paper Fold browser check passed: separated cut/hole activities, forced two-fold cuts, immediate choices, responsive layouts, and grouped worksheet links verified.");
