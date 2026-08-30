import { strict as assert } from "node:assert";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=3", { waitUntil: "networkidle" });
assert.equal(await page.locator(".route-board").count(), 1);
assert.ok(await page.locator("#dieView .pip").count() >= 3);
assert.equal(await page.locator("#choiceTray button").count(), 3);
assert.equal(await page.locator(".route-3d-host canvas").count(), 1);
const sceneMetrics = await page.locator(".route-3d-host").evaluate((host) => ({
  dieSize: Number(host.dataset.dieSize), tileSize: Number(host.dataset.tileSize), tileRatio: Number(host.dataset.tileRatio),
  step: Number(host.dataset.step), top: Number(host.dataset.top), rolling: host.dataset.rolling,
  width: host.getBoundingClientRect().width, height: host.getBoundingClientRect().height
}));
assert.equal(sceneMetrics.dieSize, 1);
assert.ok(sceneMetrics.tileRatio > 1 && sceneMetrics.tileRatio <= 1.12, JSON.stringify(sceneMetrics));
assert.ok(sceneMetrics.width >= 300 && sceneMetrics.height >= 250, JSON.stringify(sceneMetrics));
const canvasShot = await page.locator(".route-3d-host canvas").screenshot();
const pixelStats = await sharp(canvasShot).stats();
assert.ok(pixelStats.channels.slice(0, 3).some((channel) => channel.stdev > 18), JSON.stringify(pixelStats.channels));
await page.locator('#methodSwitch button[data-method="flat"]').click();
assert.equal(await page.locator(".flat-number-palette button").count(), 6);
assert.equal(await page.locator(".flat-die-marker").count(), 1);
assert.equal(await page.locator(".flat-die-marker .flat-face").count(), 5);
assert.equal(await page.locator(".flat-die-marker .flat-face.is-empty").count(), 5);
assert.ok(await page.locator(".route-board").evaluate((node) => node.classList.contains("is-flat")));
assert.ok(await page.locator(".route-lines line").count() >= 3);
const nextDirection = await page.locator('.route-lines line[data-step="1"]').getAttribute("data-direction");
await page.locator('.flat-number-palette button[data-flat-number="3"]').click();
await page.locator('.flat-die-marker[data-step="0"] .flat-face.east').click();
assert.equal(await page.locator('.flat-die-marker[data-step="0"] .flat-value').textContent(), "3");
await page.locator("#hintButton").click();
assert.equal(await page.locator('.flat-die-marker[data-step="0"] .flat-value').textContent(), "3");
await page.locator(`#directionPad button[data-direction="${nextDirection}"]`).click();
assert.equal(await page.locator(".flat-die-marker").count(), 2);
assert.equal(await page.locator('.flat-die-marker[data-step="0"] .flat-value').textContent(), "3");
assert.equal(await page.locator('.flat-die-marker[data-step="1"] .flat-face.is-empty').count(), 5);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-flat.png", fullPage: true });
await page.locator("#resetButton").click();
await page.locator('#methodSwitch button[data-method="solid"]').click();
assert.equal(await page.locator(".route-3d-host canvas").count(), 1);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-level3.png", fullPage: true });
const beforeRoll = await page.locator(".route-3d-host").evaluate((host) => ({ step: host.dataset.step, top: host.dataset.top }));
const firstDirection = await page.locator('.route-lines line[data-step="1"]').getAttribute("data-direction");
const rollPromise = page.locator(`#directionPad button[data-direction="${firstDirection}"]`).click();
await page.waitForFunction(() => document.querySelector(".route-3d-host")?.dataset.rolling === "true");
assert.equal(await page.locator("#directionPad button:enabled").count(), 0);
await page.waitForTimeout(220);
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-midroll.png", fullPage: true });
await rollPromise;
await page.waitForFunction(() => document.querySelector(".route-3d-host")?.dataset.rolling === "false");
const afterRoll = await page.locator(".route-3d-host").evaluate((host) => ({ step: host.dataset.step, top: host.dataset.top }));
assert.equal(Number(afterRoll.step), Number(beforeRoll.step) + 1);
assert.notEqual(afterRoll.top, beforeRoll.top);
while (await page.locator("#directionPad button:enabled").count()) {
  const step = Number((await page.locator("#stepLabel").textContent()).match(/^\d+/)?.[0] || 0) + 1;
  const direction = await page.locator(`.route-lines line[data-step="${step}"]`).getAttribute("data-direction");
  await page.locator(`#directionPad button[data-direction="${direction}"]`).click();
  await page.waitForFunction(() => document.querySelector(".route-3d-host")?.dataset.rolling === "false");
}
assert.match(await page.locator("#stepLabel").textContent(), /\d+ \/ \d+칸/);
assert.equal(await page.locator(".route-3d-host canvas").count(), 1);
const problemBeforeAuto=await page.locator("#problemLabel").textContent();
for(const button of await page.locator("#choiceTray button").all()){await button.click();if(await button.evaluate((node)=>node.classList.contains("correct")))break;}
await page.waitForFunction((before)=>document.querySelector("#problemLabel")?.textContent!==before,problemBeforeAuto);
const problemAfterAuto=await page.locator("#problemLabel").textContent();

await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=5", { waitUntil: "networkidle" });
assert.equal(await page.locator("#targetDie .die-svg").count(), 1);
assert.equal(await page.locator(".route-choice").count(), 3);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=3", { waitUntil: "networkidle" });
await page.locator('#methodSwitch button[data-method="flat"]').click();
assert.equal(await page.locator(".flat-number-palette button").count(), 6);
const flatMobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,palette:document.querySelector(".flat-number-palette").getBoundingClientRect().toJSON()}));
assert.ok(flatMobile.scrollWidth<=flatMobile.width+1,JSON.stringify(flatMobile));
await page.screenshot({path:"C:/Users/user/AppData/Local/Temp/gfield-dice-roll-flat-mobile.png",fullPage:true});
const mobile = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, board: document.querySelector(".route-board").getBoundingClientRect().toJSON() }));
assert.ok(mobile.scrollWidth <= mobile.width + 1, JSON.stringify(mobile));
assert.ok(mobile.board.width <= mobile.width - 18, JSON.stringify(mobile));
await page.screenshot({ path: "C:/Users/user/AppData/Local/Temp/gfield-dice-roll-mobile.png", fullPage: true });

await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:8765/geometry/games/dice-roll/?level=1", { waitUntil: "networkidle" });
await page.locator('#methodSwitch button[data-method="solid"]').click();
const reducedDirection = await page.locator('.route-lines line[data-step="1"]').getAttribute("data-direction");
const reducedStarted = Date.now();
await page.locator(`#directionPad button[data-direction="${reducedDirection}"]`).click();
await page.waitForFunction(() => document.querySelector(".route-3d-host")?.dataset.step === "1");
const reducedDuration = Date.now() - reducedStarted;
assert.ok(reducedDuration < 250, `Reduced motion took ${reducedDuration}ms`);
await page.emulateMedia({ reducedMotion: "no-preference" });

await page.setViewportSize({ width: 1280, height: 900 });
await page.goto("http://127.0.0.1:8765/geometry/solid-vista/", { waitUntil: "networkidle" });
assert.equal(await page.locator("#diceLevelGrid .dice-card").count(), 5);
assert.equal(errors.length, 0, errors.join("\n"));
console.log(JSON.stringify({ level3Routes: 3, level5Choices: 3, sceneMetrics, pixelStdev: pixelStats.channels.map((channel) => channel.stdev), roll: { firstDirection, beforeRoll, afterRoll }, autoAdvance:{before:problemBeforeAuto,after:problemAfterAuto}, reducedMotion: { direction: reducedDirection, duration: reducedDuration }, flatRecord: { nextDirection, value: 3, markers: 2, mobile:flatMobile }, mobile, diceCards: 5 }, null, 2));
await browser.close();
