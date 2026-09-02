import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";
import { levels } from "./levels.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const gameUrl = (level) => `${baseUrl}/geometry/games/mirror-manor/?level=${level}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
const cellKey = (cell) => cell.join(",");

page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-mirror-manor-tutorial-v1", "done");
  for (let level = 1; level <= 5; level += 1) localStorage.setItem(`gfield-pool-mirror-manor-${level}`, "0");
});

function normalizedShape(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]).map(cellKey).join("|");
}

async function openLevel(level) {
  await page.goto(gameUrl(level), { waitUntil: "networkidle" });
  await page.locator(".manor-shell").waitFor({ state: "visible" });
  assert.match(await page.locator("#levelLabel").textContent(), new RegExp(`${level}$`));
  assert.equal(await page.locator("#board .cell, #board .distance-choice, #board .symbol-choice").count() > 0, true);
}

async function solveProblem(problem, targetPage = page) {
  if (problem.interaction === "paint-reflection" || problem.interaction === "double-mirror") {
    for (const [x, y] of problem.targetCells) await targetPage.locator(`.cell[data-x="${x}"][data-y="${y}"]`).click();
  } else if (problem.interaction === "drag-reflection") {
    const used = new Set();
    for (const target of problem.targets) {
      const shape = normalizedShape(target.cells);
      const trayIndex = problem.tray.findIndex((piece, index) => !used.has(index) && normalizedShape(piece.shape) === shape);
      assert.ok(trayIndex >= 0, `${problem.id} has no matching tray piece`);
      used.add(trayIndex);
      const minX = Math.min(...target.cells.map(([x]) => x));
      const minY = Math.min(...target.cells.map(([, y]) => y));
      await targetPage.locator(`.tray-piece[data-index="${trayIndex}"]`).click();
      await targetPage.locator(`.cell[data-x="${minX}"][data-y="${minY}"]`).click();
    }
  } else if (problem.interaction === "distance-match") {
    const [x, y] = problem.targetCell;
    const box = await targetPage.locator(`.distance-choice[data-x="${x}"][data-y="${y}"]`).boundingBox();
    await targetPage.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  } else {
    const answer = problem.choices.find((choice) => choice.kind === "mirror");
    const box = await targetPage.locator(`.symbol-choice[data-choice="${answer.id}"]`).boundingBox();
    await targetPage.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await targetPage.locator("#answerPrompt.solved").waitFor({ state: "visible" });
}

async function solveAndAwaitAdvance(level) {
  const before = await page.locator("#problemLabel").textContent();
  const started = Date.now();
  await solveProblem(levels[level - 1].problems[0]);
  await page.waitForFunction((label) => document.querySelector("#problemLabel")?.textContent !== label || !document.querySelector("#completeDialog")?.hidden, before);
  return { before, after: await page.locator("#problemLabel").textContent(), elapsed: Date.now() - started };
}

await openLevel(1);
const firstPaint = levels[0].problems[0].targetCells[0];
const focusCell = page.locator(`.cell[data-x="${firstPaint[0]}"][data-y="${firstPaint[1]}"]`);
await focusCell.focus();
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => `${document.activeElement?.dataset?.x},${document.activeElement?.dataset?.y}`), cellKey(firstPaint));
await page.locator("#retryButton").click();

await openLevel(3);
const keyboardProblem = levels[2].problems[0];
const keyboardTarget = keyboardProblem.targets[0];
const keyboardTray = keyboardProblem.tray.findIndex((piece) => normalizedShape(piece.shape) === normalizedShape(keyboardTarget.cells));
const anchor = [Math.min(...keyboardTarget.cells.map(([x]) => x)), Math.min(...keyboardTarget.cells.map(([, y]) => y))];
await page.locator(`.tray-piece[data-index="${keyboardTray}"]`).focus();
await page.keyboard.press("Enter");
assert.equal(await page.locator(`.tray-piece[data-index="${keyboardTray}"]`).getAttribute("aria-pressed"), "true");
await page.locator(`.cell[data-x="${anchor[0]}"][data-y="${anchor[1]}"]`).focus();
await page.keyboard.press("Enter");
assert.match(await page.locator("#answerPrompt").textContent(), /1/);

const advances = [];
for (const level of [1, 2, 3, 4]) {
  await openLevel(level);
  advances.push({ level, ...(await solveAndAwaitAdvance(level)) });
}

await page.setViewportSize({ width: 844, height: 390 });
await openLevel(4);
await page.locator("#hintButton").click();
const landscape = await page.evaluate(() => {
  const panel = document.querySelector(".room-panel").getBoundingClientRect();
  const board = document.querySelector("#board").getBoundingClientRect();
  const dock = document.querySelector(".answer-dock").getBoundingClientRect();
  const bubble = document.querySelector(".guide-bubble");
  return {
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    panel: panel.toJSON(), board: board.toJSON(), dock: dock.toJSON(),
    axisHinted: document.querySelector("#board").classList.contains("hint-axis"),
    bubbleDisplay: getComputedStyle(bubble).display,
    bubbleText: bubble.textContent
  };
});
assert.equal(landscape.scrollWidth, 844);
assert.equal(landscape.scrollHeight, 390);
assert.ok(landscape.board.top >= landscape.panel.top && landscape.board.bottom <= landscape.panel.bottom);
assert.equal(landscape.axisHinted, true);
assert.notEqual(landscape.bubbleDisplay, "none");
assert.ok(landscape.bubbleText.length > 5);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-landscape.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await openLevel(2);
const portrait = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, levelButtonVisible: getComputedStyle(document.querySelector("#levelButton")).display !== "none" }));
assert.equal(portrait.scrollWidth, portrait.width);
assert.equal(portrait.scrollHeight, portrait.height);
assert.equal(portrait.levelButtonVisible, true);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-portrait.png", fullPage: true });

await page.setViewportSize({ width: 1280, height: 900 });
await openLevel(5);
for (const problem of levels[4].problems.slice(0, 5)) {
  await solveProblem(problem);
  await page.waitForFunction(() => !document.querySelector("#completeDialog")?.hidden || !document.querySelector("#answerPrompt")?.classList.contains("solved"));
}
await page.locator("#completeDialog").waitFor({ state: "visible" });
assert.equal(await page.locator("#nextLevelButton").isVisible(), false);
assert.equal(await page.locator("#practiceButton").isVisible(), true);
assert.equal(await page.evaluate(() => document.activeElement?.id), "practiceButton");

for (const language of ["ko", "en", "zh", "ja"]) {
  await page.evaluate((value) => localStorage.setItem("gfield-language", value), language);
  await page.goto(gameUrl(3), { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 1280);
}

const reducedPage = await browser.newPage({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
await reducedPage.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-mirror-manor-tutorial-v1", "done");
  localStorage.setItem("gfield-pool-mirror-manor-3", "0");
});
await reducedPage.goto(gameUrl(3), { waitUntil: "networkidle" });
const reducedProblem = levels[2].problems[0];
const reducedBefore = await reducedPage.locator("#problemLabel").textContent();
const reducedStarted = Date.now();
await solveProblem(reducedProblem, reducedPage);
await reducedPage.waitForFunction((label) => document.querySelector("#problemLabel")?.textContent !== label, reducedBefore);
const reducedMotionMs = Date.now() - reducedStarted;
assert.ok(reducedMotionMs >= 600 && reducedMotionMs < 1100, `reduced-motion auto advance took ${reducedMotionMs}ms`);
assert.equal(await reducedPage.locator(".success").evaluate((element) => getComputedStyle(element).animationName), "none");
await reducedPage.close();

await page.evaluate(() => localStorage.setItem("gfield-language", "ko"));
await openLevel(1);
const screenshotPath = "C:/Users/user/AppData/Local/Temp/gfield-mirror-manor-desktop.png";
await page.screenshot({ path: screenshotPath, fullPage: true });
const stats = await sharp(screenshotPath).stats();
const pixelDeviation = Number((stats.channels.slice(0, 3).reduce((sum, channel) => sum + channel.stdev, 0) / 3).toFixed(2));
assert.ok(pixelDeviation > 18, `visual scene is too flat or blank: ${pixelDeviation}`);
const material = await page.evaluate(() => ({ boardShadow: getComputedStyle(document.querySelector("#board")).boxShadow, mirrorShadow: getComputedStyle(document.querySelector(".mirror-line")).boxShadow, tileBackground: getComputedStyle(document.querySelector(".cell.given")).backgroundImage }));
assert.notEqual(material.boardShadow, "none");
assert.notEqual(material.mirrorShadow, "none");
assert.notEqual(material.tileBackground, "none");

assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, advances, landscape, portrait, reducedMotionMs, pixelDeviation, material, levelsChecked: [1, 2, 3, 4, 5], languagesChecked: ["ko", "en", "zh", "ja"] }, null, 2));
