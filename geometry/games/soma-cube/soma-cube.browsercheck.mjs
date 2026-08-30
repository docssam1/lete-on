import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const gameUrl = (level) => `${baseUrl}/geometry/games/soma-cube/?level=${level}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  localStorage.setItem("gfield-soma-tutorial-v1", "done");
  localStorage.setItem("gfield-sound-muted", "1");
});

async function openLevel(level) {
  await page.goto(gameUrl(level), { waitUntil: "networkidle" });
  await page.locator(".game-shell").waitFor({ state: "visible" });
}

async function canvasEvidence(selector) {
  const canvas = page.locator(selector);
  const box = await canvas.boundingBox();
  assert.ok(box && box.width >= 220 && box.height >= 150, `${selector} has an invalid canvas box`);
  const image = await canvas.screenshot();
  const stats = await sharp(image).stats();
  const deviation = Math.max(...stats.channels.slice(0, 3).map((channel) => channel.stdev));
  assert.ok(deviation >= 12, `${selector} appears blank: stdev=${deviation}`);
  return { width: Math.round(box.width), height: Math.round(box.height), deviation: Number(deviation.toFixed(2)) };
}

await openLevel(1);
assert.equal(await page.locator(".game-shell").getAttribute("data-mode"), "recognize");
const choiceCount = await page.locator(".choice-card").count();
assert.ok(choiceCount === 2 || choiceCount === 3);
assert.deepEqual(await page.locator(".choice-card").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("aria-label"))), Array.from({ length: choiceCount }, (_, index) => `보기 ${index + 1}`));
assert.match(await page.locator("#targetViewer").getAttribute("aria-label"), /단위정육면체/);
const recognitionCanvas = await canvasEvidence("#targetViewer canvas");
await page.locator("#hintButton").click();
const hintedChoice = page.locator(".choice-card.correct");
assert.equal(await hintedChoice.count(), 1);
await hintedChoice.click();
assert.ok(await page.locator("#hintButton").isDisabled());

await openLevel(2);
assert.equal(await page.locator(".game-shell").getAttribute("data-stage"), "Pre");
assert.equal(await page.locator(".piece-card").count(), 2);
assert.ok((await page.locator(".piece-card").first().getAttribute("aria-label"))?.includes("소마 조각"));
const targetCanvas = await canvasEvidence("#targetViewer canvas");
const buildCanvas = await canvasEvidence("#buildViewer canvas");
await page.locator("#hintButton").click();
assert.equal(await page.locator(".piece-card.hint").count(), 1);
assert.ok(Number(await page.locator("#buildViewer").getAttribute("data-candidate-count")) > 0);
await page.keyboard.press("Enter");
await page.locator("#pieceStatus").filter({ hasText: "1/2조각" }).waitFor();
await page.locator("#hintButton").click();
await page.keyboard.press("Enter");
await page.locator("#hintButton:disabled").waitFor();
assert.match(await page.locator("#guideBubble").textContent(), /빈틈없이/);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-soma-browsercheck-desktop.png", fullPage: true });

await page.setViewportSize({ width: 844, height: 390 });
for (const language of ["ko", "en", "zh", "ja"]) {
  await page.addInitScript((lang) => localStorage.setItem("gfield-profile", JSON.stringify({ language: lang })), language);
  await openLevel(4);
  const layout = await page.evaluate(() => {
    const tool = document.querySelector(".tool-rail").getBoundingClientRect();
    const panels = [...document.querySelectorAll(".viewer-host canvas")].map((canvas) => canvas.getBoundingClientRect().toJSON());
    return {
      lang: document.documentElement.lang,
      scrollWidth: document.documentElement.scrollWidth,
      width: innerWidth,
      height: innerHeight,
      toolRight: tool.right,
      toolBottom: tool.bottom,
      panels
    };
  });
  assert.equal(layout.lang, language);
  assert.ok(layout.scrollWidth <= layout.width + 1, JSON.stringify(layout));
  assert.ok(layout.toolRight <= layout.width + 1 && layout.toolBottom <= layout.height + 1, JSON.stringify(layout));
  assert.ok(layout.panels.every((panel) => panel.width >= 250 && panel.height >= 100), JSON.stringify(layout));
  assert.ok(await page.locator("#soundButton").getAttribute("aria-label"));
}
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-soma-browsercheck-mobile.png", fullPage: true });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(gameUrl(5), { waitUntil: "networkidle" });
assert.ok(await page.locator(".portrait-guard").isVisible());
assert.ok(await page.locator(".game-shell").isHidden());

assert.equal(errors.length, 0, errors.join("\n"));
console.log(JSON.stringify({
  baseUrl,
  recognitionCanvas,
  targetCanvas,
  buildCanvas,
  levelsChecked: [1, 2, 4, 5],
  languagesChecked: ["ko", "en", "zh", "ja"],
  keyboardAssembly: "2 pieces completed with hint + Enter",
  portraitGuard: true
}, null, 2));
await browser.close();
