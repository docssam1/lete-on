import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath
  ? modulePath.startsWith("file:") ? modulePath : pathToFileURL(modulePath).href
  : "playwright");
const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const games = [
  "count-heights", "crystal-cubes", "cube-blueprint", "cube-memory",
  "cube-piece-lab", "cube-tunnel", "fill-box", "find-shape",
  "hidden-count", "minmax", "three-views"
];
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const game of games) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
    await context.addInitScript((name) => {
      localStorage.setItem("gfield-language", "ko");
      localStorage.setItem("gfield-audio-muted", "true");
      localStorage.setItem(`gfield-${name}-tutorial-v1`, "done");
    }, game);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const url = `${base}/geometry/games/${game}/`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelectorAll("#levelList button").length >= 2);
    const initialLevel = Number((await page.locator("#progress").textContent()).match(/\d+/)?.[0]);
    assert.ok(initialLevel > 0, `${game}: progress must expose the current level`);
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: entry must not block the problem with level selection`);
    assert.equal(await page.locator(".rail-level").isVisible(), true, `${game}: level choice must remain available in the rail`);
    if (game === "find-shape") await page.screenshot({ path: join(tmpdir(), "gfield-find-shape-direct-entry.png") });

    await page.locator(".rail-level").click();
    assert.equal(await page.locator("#levelDialog").isVisible(), true, `${game}: rail level button must open the list`);
    await page.locator("#closeLevels").click();
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: the level list must close`);

    await page.goto(`${url}?level=2`, { waitUntil: "networkidle" });
    await page.waitForFunction((level) => Number(document.querySelector("#progress")?.textContent.match(/\d+/)?.[0]) === level + 1, initialLevel);
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: a level link must go directly to that problem`);
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForFunction((level) => Number(document.querySelector("#progress")?.textContent.match(/\d+/)?.[0]) === level + 1, initialLevel);
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: returning must resume the saved level without another dialog`);
    assert.deepEqual(errors, [], `${game}: page errors`);
    results.push(game);
    await context.close();
    console.log(`${game}: current problem, rail level picker, and ?level=2 passed`);
  }

  for (const game of ["count-heights", "find-shape"]) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
    await context.addInitScript(() => localStorage.setItem("gfield-audio-muted", "true"));
    const page = await context.newPage();
    await page.goto(`${base}/geometry/games/${game}/`, { waitUntil: "networkidle" });
    await page.locator("#conceptTutorial").waitFor({ state: "visible" });
    for (let step = 0; step < 5 && await page.locator("#conceptTutorial").isVisible(); step += 1) {
      await page.locator("#conceptNext").click();
    }
    assert.equal(await page.locator("#conceptTutorial").isVisible(), false, `${game}: first-visit guide must finish`);
    await page.waitForTimeout(400);
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: finishing the guide must lead to the problem, not another dialog`);
    await context.close();
  }

  for (const game of games) {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
    await context.addInitScript(() => localStorage.setItem("gfield-audio-muted", "true"));
    const page = await context.newPage();
    await page.goto(`${base}/geometry/games/${game}/?level=2`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    assert.equal(await page.locator("#conceptTutorial").isVisible(), false, `${game}: a fresh level-2 link must not leave the level-1 guide over the problem`);
    assert.equal(await page.locator("#levelDialog").isVisible(), false, `${game}: a fresh level-2 link must not open the level list`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`Shared direct-entry flow passed: ${results.length} games.`);
