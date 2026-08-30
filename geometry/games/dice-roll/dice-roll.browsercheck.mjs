import { strict as assert } from "node:assert";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=3", { waitUntil: "networkidle" });
assert.equal(await page.locator(".route-board").count(), 1);
assert.ok(await page.locator(".route-lines line").count() >= 3);
assert.ok(await page.locator("#dieView .pip").count() >= 3);
assert.equal(await page.locator("#choiceTray button").count(), 3);
assert.equal(await page.locator(".position-marker.solid .die-svg").count(), 1);
await page.locator('#methodSwitch button[data-method="flat"]').click();
assert.equal(await page.locator(".position-marker.flat .flat-face").count(), 5);
assert.equal(await page.locator(".position-marker.flat .flat-face.is-hidden").count(), 4);
const nextDirection = await page.locator('.route-lines line[data-step="1"]').getAttribute("data-direction");
const usefulFace = { N: "south", S: "north", E: "west", W: "east" }[nextDirection];
const manualFace = ["north", "east", "south", "west"].find((face) => face !== usefulFace);
await page.locator(`.position-marker.flat .flat-face.${manualFace}`).click();
assert.equal(await page.locator(".position-marker.flat .flat-face.is-hidden").count(), 3);
await page.locator("#hintButton").click();
assert.equal(await page.locator(".position-marker.flat .flat-face.is-hidden").count(), 2);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-flat.png", fullPage: true });
await page.locator('#methodSwitch button[data-method="solid"]').click();
assert.equal(await page.locator(".position-marker.solid .die-svg").count(), 1);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-level3.png", fullPage: true });
while (await page.locator("#directionPad button:enabled").count()) {
  const step = Number((await page.locator("#stepLabel").textContent()).match(/^\d+/)?.[0] || 0) + 1;
  const direction = await page.locator(`.route-lines line[data-step="${step}"]`).getAttribute("data-direction");
  await page.locator(`#directionPad button[data-direction="${direction}"]`).click();
}
assert.match(await page.locator("#stepLabel").textContent(), /\d+ \/ \d+칸/);
assert.equal(await page.locator(".position-marker.solid .die-svg").count(), 1);

await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=5", { waitUntil: "networkidle" });
assert.equal(await page.locator("#targetDie .die-svg").count(), 1);
assert.equal(await page.locator(".route-choice").count(), 3);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=3", { waitUntil: "networkidle" });
const mobile = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, board: document.querySelector(".route-board").getBoundingClientRect().toJSON() }));
assert.ok(mobile.scrollWidth <= mobile.width + 1, JSON.stringify(mobile));
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-mobile.png", fullPage: true });

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto("http://127.0.0.1:8765/geometry/solid-vista/", { waitUntil: "networkidle" });
assert.equal(await page.locator("#diceLevelGrid .dice-card").count(), 5);
assert.equal(errors.length, 0, errors.join("\n"));
console.log(JSON.stringify({ level3Routes: 3, level5Choices: 3, flatHint: { nextDirection, usefulFace, manualFace }, mobile, diceCards: 5 }, null, 2));
await browser.close();
