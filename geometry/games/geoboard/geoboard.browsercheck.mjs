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

const copyPortrait = [];
for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
  await page.setViewportSize(viewport);
  await openLevel(viewport.width === 390 ? 1 : 2);
  const layout = await page.evaluate(() => {
    const bounds = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
    return {
      copyMode: document.body.classList.contains("copy-mode"),
      model: bounds("#modelBoard"), board: bounds("#board"), tools: bounds("#toolPanel"), guide: bounds("#cubiGuide"),
      dock: bounds(".answer-dock"), scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight, viewportWidth: innerWidth, viewportHeight: innerHeight
    };
  });
  assert.ok(layout.copyMode);
  assert.equal(layout.scrollWidth, viewport.width);
  assert.ok(layout.model.width >= 130 && layout.board.width >= (viewport.width === 390 ? 330 : 260));
  assert.ok(layout.model.bottom < layout.board.top && layout.board.bottom < layout.tools.top && layout.tools.bottom <= layout.dock.top);
  assert.ok(layout.guide.top >= layout.dock.top);
  await page.screenshot({ path: `${screenshotRoot}/gfield-geoboard-copy-${viewport.width}.png`, fullPage: true });
  copyPortrait.push({ viewport, ...layout });
}

for (const lang of ["ko", "en", "zh", "ja"]) {
  await page.evaluate((value) => localStorage.setItem("gfield-language", value), lang);
  await page.setViewportSize({ width: 390, height: 844 });
  await openLevel(1);
  const labelsFit = await page.evaluate(() => [...document.querySelectorAll(".model-panel .board-heading, .build-panel .board-heading")]
    .every((node) => node.scrollWidth <= node.clientWidth + 1));
  assert.ok(labelsFit, `${lang} copy-mode headings overflow`);
}
await page.evaluate(() => localStorage.setItem("gfield-language", "ko"));

const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
await touchContext.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-language", "ko");
  localStorage.setItem("gfield-geoboard-tutorial-v1", "done");
  localStorage.setItem("gfield-pool-geoboard-1", "0");
});
const touchPage = await touchContext.newPage();
await openLevel(1, touchPage);
for (const [x, y] of levels[0].problems[0].vertices) {
  await touchPage.locator(`.peg-hit[data-x="${x}"][data-y="${y}"]`).tap();
}
await touchPage.locator("#success.show").waitFor({ state: "visible" });
await touchContext.close();

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
  localStorage.setItem("gfield-pool-geoboard-1", "0");
});
await openLevel(1, tutorialPage);
await tutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
const tutorial = await tutorialPage.evaluate(() => ({
  highlighted: document.querySelectorAll("#pegLayer .tutorial-target").length,
  skipVisible: !document.querySelector("#tutorialSkip").hidden,
  guide: document.querySelector("#answerPrompt").textContent,
  board: document.querySelector("#board").getBoundingClientRect().toJSON(),
  dock: document.querySelector(".answer-dock").getBoundingClientRect().toJSON(),
  viewport: [innerWidth, innerHeight],
  scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight]
}));
assert.equal(tutorial.highlighted, 2);
assert.ok(tutorial.skipVisible && tutorial.guide.includes("빛나는 못"));
assert.ok(tutorial.board.bottom < tutorial.dock.top && tutorial.scroll[0] === tutorial.viewport[0]);
await tutorialPage.screenshot({ path: `${screenshotRoot}/gfield-geoboard-tutorial-real-board.png`, fullPage: true });
const tutorialProblem = levels[0].problems[0];
await tapPeg([4, 4], tutorialPage);
assert.equal(await tutorialPage.locator("#pegLayer .tutorial-target").count(), 2);
assert.equal(await tutorialPage.locator("#bandLayer .band").count(), 0);
await tapPeg(tutorialProblem.vertices.at(-1), tutorialPage);
assert.equal(await tutorialPage.locator("#pegLayer .tutorial-target").count(), 1);
assert.equal(await tutorialPage.locator("#bandLayer .band-node").count(), 1);
await tutorialPage.screenshot({ path: `${screenshotRoot}/gfield-geoboard-tutorial-one-peg.png`, fullPage: true });
await tapPeg(tutorialProblem.vertices.at(-2), tutorialPage);
assert.equal(await tutorialPage.locator(".answer-dock.tutorial-active").count(), 0);
assert.equal(await tutorialPage.evaluate(() => localStorage.getItem("gfield-geoboard-tutorial-v1")), "done");
assert.ok(await tutorialPage.locator("#bandLayer .band").count() >= 1);
await tutorialPage.reload({ waitUntil: "networkidle" });
assert.equal(await tutorialPage.locator(".answer-dock.tutorial-active").count(), 0);
await tutorialPage.setViewportSize({ width: 320, height: 568 });
await tutorialPage.goto(`${gameUrl(1)}&tutorial=1`, { waitUntil: "networkidle" });
await tutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
await tutorialPage.screenshot({ path: `${screenshotRoot}/gfield-geoboard-tutorial-320.png`, fullPage: true });
await tutorialPage.locator("#tutorialSkip").click();
assert.equal(await tutorialPage.locator(".answer-dock.tutorial-active").count(), 0);
assert.equal(await tutorialPage.evaluate(() => localStorage.getItem("gfield-geoboard-tutorial-v1")), "done");
for (const lang of ["ko", "en", "zh", "ja"]) {
  await tutorialPage.evaluate((value) => localStorage.setItem("gfield-language", value), lang);
  await tutorialPage.goto(`${gameUrl(1)}&tutorial=1`, { waitUntil: "networkidle" });
  await tutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
  const layout = await tutorialPage.evaluate(() => {
    const dock = document.querySelector(".answer-dock").getBoundingClientRect();
    const skip = document.querySelector("#tutorialSkip").getBoundingClientRect();
    const avatar = document.querySelector("#cubiGuide").getBoundingClientRect();
    return { width: document.documentElement.scrollWidth, skipInside: skip.left >= dock.left && skip.right <= dock.right && skip.bottom <= dock.bottom, avatarClear: skip.right < avatar.left, text: document.querySelector("#answerPrompt").textContent };
  });
  assert.equal(layout.width, 320, `${lang} tutorial overflows horizontally`);
  assert.ok(layout.skipInside && layout.avatarClear && layout.text.length > 5, `${lang} tutorial controls overlap`);
}
await tutorialPage.evaluate(() => localStorage.setItem("gfield-language", "ko"));
await tutorialPage.goto(`${gameUrl(1)}&tutorial=1`, { waitUntil: "networkidle" });
await tutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
const firstGuidedPeg = tutorialPage.locator('.peg-hit[tabindex="0"]');
assert.deepEqual(await firstGuidedPeg.evaluate((node) => [Number(node.dataset.x), Number(node.dataset.y)]), tutorialProblem.vertices[0]);
assert.match(await firstGuidedPeg.getAttribute("aria-label"), /안내된 못/);
await firstGuidedPeg.focus();
await tutorialPage.keyboard.press("Enter");
assert.deepEqual(await tutorialPage.evaluate(() => [Number(document.activeElement.dataset.x), Number(document.activeElement.dataset.y)]), tutorialProblem.vertices[1]);
assert.match(await tutorialPage.locator('.peg-hit[tabindex="0"]').getAttribute("aria-label"), /안내된 못/);
await tutorialPage.keyboard.press("Enter");
assert.equal(await tutorialPage.locator(".answer-dock.tutorial-active").count(), 0);
await tutorialPage.setViewportSize({ width: 844, height: 390 });
await tutorialPage.goto(`${gameUrl(1)}&tutorial=1`, { waitUntil: "networkidle" });
await tutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
const tutorialLandscape = await tutorialPage.evaluate(() => {
  const dock = document.querySelector(".answer-dock").getBoundingClientRect();
  const skip = document.querySelector("#tutorialSkip").getBoundingClientRect();
  const prompt = document.querySelector("#answerPrompt").getBoundingClientRect();
  return { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, skipInside: skip.top >= dock.top && skip.bottom <= dock.bottom, promptInside: prompt.top >= dock.top && prompt.bottom <= dock.bottom };
});
assert.deepEqual([tutorialLandscape.width, tutorialLandscape.height], [844, 390]);
assert.ok(tutorialLandscape.skipInside && tutorialLandscape.promptInside);
await tutorialPage.close();

const tutorialTouchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
await tutorialTouchContext.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-pool-geoboard-1", "0");
});
const tutorialTouchPage = await tutorialTouchContext.newPage();
await openLevel(1, tutorialTouchPage);
await tutorialTouchPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
for (const [x, y] of tutorialProblem.vertices.slice(0, 2)) {
  await tutorialTouchPage.locator(`.peg-hit[data-x="${x}"][data-y="${y}"]`).tap();
}
assert.equal(await tutorialTouchPage.locator(".answer-dock.tutorial-active").count(), 0);
assert.equal(await tutorialTouchPage.evaluate(() => localStorage.getItem("gfield-geoboard-tutorial-v1")), "done");
await tutorialTouchContext.close();

const longerTutorialPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await longerTutorialPage.addInitScript(() => {
  localStorage.setItem("gfield-audio-muted", "true");
  localStorage.setItem("gfield-pool-geoboard-1", "1");
});
await openLevel(1, longerTutorialPage);
await longerTutorialPage.locator(".answer-dock.tutorial-active").waitFor({ state: "visible" });
const longerVertices = levels[0].problems[5].vertices;
assert.ok(longerVertices.length > 2);
await tapPeg(longerVertices.at(-1), longerTutorialPage);
await tapPeg(longerVertices.at(-2), longerTutorialPage);
assert.equal(await longerTutorialPage.locator(".answer-dock.tutorial-active").count(), 0);
assert.equal(await longerTutorialPage.locator("#success.show").count(), 0);
for (const point of longerVertices.slice(0, -2).reverse()) await tapPeg(point, longerTutorialPage);
await longerTutorialPage.locator("#success.show").waitFor({ state: "visible" });
await longerTutorialPage.close();

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

console.log(JSON.stringify({ baseUrl, advances, landscape, portrait, copyPortrait, reducedMotionMs, pixelDeviation, material, levelsChecked: [1, 2, 3, 4, 5], languagesChecked: ["ko", "en", "zh", "ja"] }, null, 2));
await browser.close();
