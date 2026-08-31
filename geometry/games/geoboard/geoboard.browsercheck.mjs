import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";
import { levels } from "./levels.js";
import {
  squareBoardPoints, triangularBoardPoints, squareDistanceSquared, triangularDistanceSquared,
  enumerateSquares, enumerateEquilateralTriangles
} from "./lattice-enumerator.js";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8771").replace(/\/$/, "");
const gameUrl = (level) => `${baseUrl}/geometry/games/geoboard/?level=${level}`;
const screenshotRoot = "C:/Users/user/AppData/Local/Temp";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];

page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  if (!localStorage.getItem("gfield-language")) localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-geoboard-tutorial-v1", "done");
  for (let level = 1; level <= 5; level += 1) localStorage.setItem(`gfield-pool-geoboard-${level}`, "0");
});

async function openLevel(level, targetPage = page) {
  await targetPage.goto(gameUrl(level), { waitUntil: "networkidle" });
  await targetPage.locator(".yard-shell").waitFor({ state: "visible" });
  assert.match(await targetPage.locator("#levelLabel").textContent(), new RegExp(`${level}`));
  assert.ok(await targetPage.locator("#board").isVisible());
}

async function tapPeg([x, y], targetPage = page) {
  await targetPage.locator(`.peg-hit[data-x="${x}"][data-y="${y}"]`).click();
}

function countRepresentatives(problem) {
  const placements = problem.kind === "square-count"
    ? enumerateSquares(squareBoardPoints(problem.boardSize), squareDistanceSquared)
    : enumerateEquilateralTriangles(triangularBoardPoints(problem.boardSize), triangularDistanceSquared);
  const byType = new Map();
  const screenPoint = ([x, y]) => problem.kind === "triangle-count"
    ? [x + y / 2, y * Math.sqrt(3) / 2]
    : [x, y];
  const clockwise = (vertices) => {
    const projected = vertices.map((point) => ({ point, projected: screenPoint(point) }));
    const center = projected.reduce((sum, item) => [sum[0] + item.projected[0], sum[1] + item.projected[1]], [0, 0]).map((value) => value / projected.length);
    return projected.sort((a, b) => Math.atan2(a.projected[1] - center[1], a.projected[0] - center[0]) - Math.atan2(b.projected[1] - center[1], b.projected[0] - center[0])).map((item) => item.point);
  };
  placements.forEach((placement) => { if (!byType.has(placement.typeKey)) byType.set(placement.typeKey, clockwise(placement.vertices)); });
  return [...byType.values()];
}

async function solve(problem, targetPage = page) {
  if (problem.kind === "open") {
    for (const point of problem.vertices) await tapPeg(point, targetPage);
  } else if (problem.kind === "closed") {
    for (const point of problem.vertices) await tapPeg(point, targetPage);
    await tapPeg(problem.vertices[0], targetPage);
  } else if (problem.kind === "square-count" || problem.kind === "triangle-count") {
    if (problem.questionMode === "placements") {
      await targetPage.locator(`.count-choice[data-value="${problem.answerValue}"]`).click();
    } else {
      for (const vertices of countRepresentatives(problem).slice(0, problem.targetKindCount)) {
        for (const point of vertices) await tapPeg(point, targetPage);
        await tapPeg(vertices[0], targetPage);
      }
    }
  } else {
    for (const [from, to] of problem.acceptedSolutions[0]) {
      await tapPeg(problem.outline[from], targetPage);
      await tapPeg(problem.outline[to], targetPage);
    }
  }
  await targetPage.locator("#success.show").waitFor({ state: "visible" });
}

async function solveAndAwaitAdvance(level) {
  const before = await page.locator("#problemLabel").textContent();
  const started = Date.now();
  await solve(levels[level - 1].problems[0]);
  assert.equal(await page.locator("#nextButton").isVisible(), true);
  await page.waitForFunction((label) => document.querySelector("#problemLabel")?.textContent !== label || !document.querySelector("#completeDialog")?.hidden, before);
  return { level, before, after: await page.locator("#problemLabel").textContent(), elapsed: Date.now() - started };
}

await openLevel(1);
const firstPoint = levels[0].problems[0].vertices[0];
const firstPeg = page.locator(`.peg-hit[data-x="${firstPoint[0]}"][data-y="${firstPoint[1]}"]`);
await firstPeg.focus();
await page.keyboard.press("ArrowRight");
assert.notEqual(await page.evaluate(() => `${document.activeElement?.dataset?.x},${document.activeElement?.dataset?.y}`), firstPoint.join(","));
assert.equal(await page.locator('.peg-hit[tabindex="0"]').count(), 1);
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("Enter");
assert.equal(await page.evaluate(() => `${document.activeElement?.dataset?.x},${document.activeElement?.dataset?.y}`), firstPoint.join(","));
await page.locator("#retryButton").click();

const advances = [];
for (let level = 1; level <= 4; level += 1) {
  console.error(`Checking level ${level} automatic advance...`);
  await openLevel(level);
  advances.push(await solveAndAwaitAdvance(level));
}

await page.setViewportSize({ width: 844, height: 390 });
await openLevel(4);
await page.locator("#hintButton").click();
await page.waitForTimeout(250);
const landscape = await page.evaluate(() => ({
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  scrollHeight: document.documentElement.scrollHeight,
  board: document.querySelector("#board").getBoundingClientRect().toJSON(),
  dock: document.querySelector(".answer-dock").getBoundingClientRect().toJSON(),
  bubbleDisplay: getComputedStyle(document.querySelector("#guideBubble")).display,
  bubbleText: document.querySelector("#guideBubble").textContent,
  bubbleClientHeight: document.querySelector("#guideBubble").clientHeight,
  bubbleScrollHeight: document.querySelector("#guideBubble").scrollHeight,
  firstPegSize: document.querySelector(".peg-hit").getBoundingClientRect().width,
  hinted: document.querySelector("#board").classList.contains("hinted")
}));
assert.equal(landscape.scrollWidth, 844);
assert.equal(landscape.scrollHeight, 390);
assert.equal(landscape.bubbleDisplay, "block");
assert.ok(landscape.bubbleText.length > 10 && landscape.hinted && landscape.bubbleScrollHeight <= landscape.bubbleClientHeight + 1);
assert.ok(landscape.firstPegSize >= 44);
await page.screenshot({ path: `${screenshotRoot}/gfield-geoboard-landscape.png` });

await page.setViewportSize({ width: 390, height: 844 });
await openLevel(5);
await page.locator("#hintButton").click();
await page.waitForTimeout(250);
const portrait = await page.evaluate(() => {
  const toolRects = [...document.querySelectorAll("#toolPanel > *")].map((node) => node.getBoundingClientRect().toJSON());
  return {
    width: innerWidth,
    height: innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    buildWidth: document.querySelector("#board").getBoundingClientRect().width,
    levelButtonVisible: getComputedStyle(document.querySelector("#levelButton")).display !== "none",
    bubbleBottom: document.querySelector("#guideBubble").getBoundingClientRect().bottom,
    dockTop: document.querySelector(".answer-dock").getBoundingClientRect().top,
    firstPegSize: document.querySelector(".peg-hit").getBoundingClientRect().width,
    toolRects
  };
});
assert.deepEqual([portrait.scrollWidth, portrait.scrollHeight], [390, 844]);
assert.ok(portrait.buildWidth >= 230 && portrait.levelButtonVisible);
assert.ok(portrait.bubbleBottom <= portrait.dockTop && portrait.firstPegSize >= 44);
assert.equal(new Set(portrait.toolRects.map((rect) => Math.round(rect.y))).size, 1);
await page.screenshot({ path: `${screenshotRoot}/gfield-geoboard-portrait.png` });

await page.setViewportSize({ width: 1280, height: 900 });
await openLevel(5);
for (let index = 0; index < 5; index += 1) {
  if (index === 3) {
    await tapPeg(levels[4].problems[index].outline[1]);
    await tapPeg(levels[4].problems[index].outline[3]);
    await page.locator("#toast.show").waitFor({ state: "visible" });
    assert.match(await page.locator("#toast").textContent(), /표시된 못/);
    await page.waitForTimeout(1050);
  }
  await solve(levels[4].problems[index]);
  if (index < 4) await page.waitForFunction((value) => document.querySelector("#problemLabel")?.textContent === `${value} / 5`, index + 2);
}
await page.locator("#completeDialog").waitFor({ state: "visible" });
assert.equal(await page.locator("#nextLevelButton").isHidden(), true);
assert.equal(await page.evaluate(() => document.activeElement?.id), "practiceButton");

for (const lang of ["ko", "en", "zh", "ja"]) {
  await page.evaluate((value) => localStorage.setItem("gfield-language", value), lang);
  await openLevel(2);
  assert.equal(await page.locator("html").getAttribute("lang"), lang === "zh" ? "zh-CN" : lang);
}

const reducedPage = await browser.newPage({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
await reducedPage.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-geoboard-tutorial-v1", "done");
  localStorage.setItem("gfield-pool-geoboard-1", "0");
});
await openLevel(1, reducedPage);
const reducedStart = Date.now();
await solve(levels[0].problems[0], reducedPage);
await reducedPage.waitForFunction(() => document.querySelector("#problemLabel")?.textContent === "2 / 5");
const reducedMotionMs = Date.now() - reducedStart;
assert.ok(reducedMotionMs >= 600 && reducedMotionMs <= 1100);
assert.ok(["0.01ms", "1e-05s"].includes(await reducedPage.locator("#success").evaluate((node) => getComputedStyle(node).animationDuration)));
await reducedPage.close();

const tutorialPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await tutorialPage.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.removeItem("gfield-geoboard-tutorial-v1");
});
await openLevel(1, tutorialPage);
await tutorialPage.locator("#tutorial").waitFor({ state: "visible" });
const tutorial = await tutorialPage.evaluate(() => ({
  copyWidth: document.querySelector(".tutorial-copy").getBoundingClientRect().width,
  card: document.querySelector(".tutorial-card").getBoundingClientRect().toJSON(),
  viewport: [innerWidth, innerHeight],
  scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight]
}));
assert.ok(tutorial.copyWidth >= 230);
assert.deepEqual(tutorial.scroll, tutorial.viewport);
await tutorialPage.screenshot({ path: `${screenshotRoot}/gfield-geoboard-tutorial-portrait.png` });
await tutorialPage.close();

await page.setViewportSize({ width: 1280, height: 900 });
await openLevel(1);
await page.screenshot({ path: `${screenshotRoot}/gfield-geoboard-desktop.png` });
const imageStats = await sharp(`${screenshotRoot}/gfield-geoboard-desktop.png`).stats();
const pixelDeviation = Number((imageStats.channels.slice(0, 3).reduce((sum, channel) => sum + channel.stdev, 0) / 3).toFixed(2));
const material = await page.evaluate(() => ({
  boardFilter: getComputedStyle(document.querySelector("#board")).filter,
  pegFill: getComputedStyle(document.querySelector("#pegLayer .peg")).fill,
  toolShadow: getComputedStyle(document.querySelector("#hintButton")).boxShadow
}));
assert.ok(pixelDeviation > 20);
assert.notEqual(material.boardFilter, "none");
assert.match(material.pegFill, /url/);
assert.notEqual(material.toolShadow, "none");
assert.deepEqual(errors, []);

console.log(JSON.stringify({ baseUrl, advances, landscape, portrait, reducedMotionMs, pixelDeviation, material, levelsChecked: [1, 2, 3, 4, 5], languagesChecked: ["ko", "en", "zh", "ja"] }, null, 2));
await browser.close();
