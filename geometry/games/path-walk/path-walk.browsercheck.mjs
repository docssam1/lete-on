import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const gameUrl = (level) => `${baseUrl}/geometry/games/path-walk/?level=${level}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.removeItem("gfield-path-walk-recent");
});

async function openLevel(level) {
  await page.goto(gameUrl(level), { waitUntil: "networkidle" });
  await page.locator(".walk-shell").waitFor({ state: "visible" });
}

async function solveCurrent() {
  const interaction = await page.evaluate(() => {
    if (!document.querySelector("#choiceTray")?.hidden) return "hidden";
    if (document.querySelector(".grid-cell")) return "shortest";
    return "rotate";
  });
  if (interaction === "hidden") {
    await page.locator("#hintButton").click();
    assert.equal(await page.locator(".tile-choice.eliminated").count(), 1);
    await page.locator("#hintButton").click();
    await page.locator(".tile-choice.hinted").click();
  } else if (interaction === "shortest") {
    for (let step = 0; step < 40; step += 1) {
      if ((await page.locator("#routeStatus").textContent()) !== "연결 전") break;
      await page.locator("#hintButton").click();
      await page.locator("#hintButton").click();
      const choices = page.locator(".grid-cell.hint:not(:disabled)");
      assert.ok(await choices.count(), "shortest-path hint should expose at least one valid next cell");
      await choices.first().click();
    }
  } else {
    for (let step = 0; step < 50; step += 1) {
      if ((await page.locator("#routeStatus").textContent()) !== "연결 전") break;
      await page.locator("#hintButton").click();
      assert.equal(await page.locator(".route-cell.hint").count(), 1);
      await page.locator("#hintButton").click();
    }
  }
  await page.locator("#routeStatus.connected").waitFor({ state: "visible" });
}

async function solveAndAwaitAdvance() {
  const before = await page.locator("#problemLabel").textContent();
  const started = Date.now();
  await solveCurrent();
  await page.waitForFunction((label) => document.querySelector("#problemLabel")?.textContent !== label || !document.querySelector("#completeDialog")?.hidden, before);
  return { before, after: await page.locator("#problemLabel").textContent(), elapsed: Date.now() - started };
}

await openLevel(1);
const firstTile = page.locator(".route-cell.editable").first();
await firstTile.focus();
const focusedIndex = await firstTile.getAttribute("data-index");
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => document.activeElement?.dataset?.index), focusedIndex, "keyboard focus should survive a tile rerender");
await page.locator("#retryButton").click();

const levelAdvances = [];
for (const level of [1, 2, 3, 4]) {
  await openLevel(level);
  levelAdvances.push({ level, ...(await solveAndAwaitAdvance()) });
}

await page.setViewportSize({ width: 844, height: 390 });
await openLevel(2);
const landscape = await page.evaluate(() => {
  const panel = document.querySelector(".board-panel").getBoundingClientRect();
  const board = document.querySelector("#gameBoard").getBoundingClientRect();
  const action = document.querySelector(".action-bar").getBoundingClientRect();
  const choices = [...document.querySelectorAll(".tile-choice")].map((element) => element.getBoundingClientRect().toJSON());
  return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, panel: panel.toJSON(), board: board.toJSON(), action: action.toJSON(), choices };
});
assert.equal(landscape.scrollWidth, landscape.width);
assert.ok(landscape.board.top >= landscape.panel.top && landscape.board.bottom <= landscape.panel.bottom);
assert.equal(landscape.choices.length, 3);
assert.ok(landscape.choices.every((choice) => choice.top >= landscape.panel.top && choice.bottom <= landscape.panel.bottom && choice.bottom < landscape.action.top));
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-path-walk-landscape.png", fullPage: true });

await openLevel(5);
const shortestBoard = await page.locator("#gameBoard").boundingBox();
const shortestPanel = await page.locator(".board-panel").boundingBox();
assert.ok(shortestBoard.height > 150 && shortestBoard.y + shortestBoard.height <= shortestPanel.y + shortestPanel.height);

await page.setViewportSize({ width: 390, height: 844 });
await openLevel(2);
const portrait = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, levelButtonVisible: getComputedStyle(document.querySelector("#levelButton")).display !== "none" }));
assert.equal(portrait.scrollWidth, portrait.width);
assert.equal(portrait.scrollHeight, portrait.height);
assert.equal(portrait.levelButtonVisible, true);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-path-walk-portrait.png", fullPage: true });

await page.setViewportSize({ width: 1280, height: 900 });
await openLevel(5);
for (let problem = 0; problem < 5; problem += 1) {
  await solveCurrent();
  await page.waitForFunction(() => !document.querySelector("#completeDialog")?.hidden || document.querySelector("#routeStatus")?.textContent === "연결 전");
}
await page.locator("#completeDialog").waitFor({ state: "visible" });
assert.equal(await page.locator("#nextLevelButton").isVisible(), false);
assert.equal(await page.locator("#practiceButton").isVisible(), true);

for (const language of ["ko", "en", "zh", "ja"]) {
  await page.evaluate((value) => localStorage.setItem("gfield-language", value), language);
  await page.goto(gameUrl(3), { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 1280);
}

const reducedPage = await browser.newPage({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
await reducedPage.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.removeItem("gfield-path-walk-recent");
});
await reducedPage.goto(gameUrl(2), { waitUntil: "networkidle" });
await reducedPage.locator("#hintButton").click();
assert.equal(await reducedPage.locator(".tile-choice.eliminated").count(), 1);
const animationName = await reducedPage.locator(".tile-choice").first().evaluate((element) => getComputedStyle(element).animationName);
assert.equal(animationName, "none");
const reducedBefore = await reducedPage.locator("#problemLabel").textContent();
const reducedStarted = Date.now();
await reducedPage.locator("#hintButton").click();
await reducedPage.locator(".tile-choice.hinted").click();
await reducedPage.waitForFunction((label) => document.querySelector("#problemLabel")?.textContent !== label, reducedBefore);
const reducedMotionMs = Date.now() - reducedStarted;
assert.ok(reducedMotionMs < 700, `reduced-motion auto advance took ${reducedMotionMs}ms`);
await reducedPage.close();

await page.setViewportSize({ width: 1280, height: 900 });
await page.evaluate(() => localStorage.setItem("gfield-language", "ko"));
await openLevel(1);
const screenshotPath = "C:/Users/user/AppData/Local/Temp/gfield-path-walk-desktop.png";
await page.screenshot({ path: screenshotPath, fullPage: true });
const stats = await sharp(screenshotPath).stats();
const pixelDeviation = Number((stats.channels.slice(0, 3).reduce((sum, channel) => sum + channel.stdev, 0) / 3).toFixed(2));
assert.ok(pixelDeviation > 18, `visual scene is too flat or blank: ${pixelDeviation}`);
const material = await page.evaluate(() => ({ roadFilter: getComputedStyle(document.querySelector(".route-cell svg")).filter, tileShadow: getComputedStyle(document.querySelector(".route-cell.editable")).boxShadow, boardShadow: getComputedStyle(document.querySelector("#gameBoard")).boxShadow }));
assert.notEqual(material.roadFilter, "none");
assert.ok(material.tileShadow !== "none" && material.boardShadow !== "none");

assert.deepEqual(errors, []);
await browser.close();
console.log(JSON.stringify({ baseUrl, levelAdvances, landscape, portrait, reducedMotionMs, pixelDeviation, material, levelsChecked: [1, 2, 3, 4, 5], languagesChecked: ["ko", "en", "zh", "ja"] }, null, 2));
