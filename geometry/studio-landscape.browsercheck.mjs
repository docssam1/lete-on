import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(playwrightModule ? pathToFileURL(playwrightModule).href : "playwright");
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8771").replace(/\/$/, "");
const output = mkdtempSync(join(tmpdir(), "geometry-studio-landscape-"));
const games = [
  { name: "angle-studio", control: "#answer", kind: "number" },
  { name: "circle-studio", control: "#choices input", kind: "radio" },
  { name: "perimeter", control: "#answer", kind: "number" },
  { name: "unit-area", control: "#answer", kind: "number" },
  { name: "quadrilateral", control: "#choices input", kind: "radio" }
];
const browser = await chromium.launch({ headless: true });
const landscapeViewports = [
  { width: 844, height: 390 },
  { width: 667, height: 375 },
  { width: 640, height: 360 },
  { width: 600, height: 320 }
];

try {
  for (const viewport of landscapeViewports) {
    const context = await browser.newContext({ viewport, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    const failedRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`));
    for (const game of games) {
      for (const language of ["ko", "en", "zh", "ja"]) {
        errors.length = 0;
        failedRequests.length = 0;
        await page.goto(`${baseUrl}/geometry/games/${game.name}/?lang=${language}`, { waitUntil: "domcontentloaded" });
        try {
          await page.locator("#board svg").first().waitFor({ state: "visible", timeout: 10000 });
        } catch (error) {
          const state = await page.evaluate(() => ({ readyState: document.readyState, board: document.querySelector("#board")?.innerHTML.slice(0, 160) }));
          await page.screenshot({ path: join(output, `${game.name}-${language}-${viewport.width}x${viewport.height}-load-error.png`) });
          throw new Error(`${game.name}/${language}/${viewport.width}x${viewport.height} board did not load: ${JSON.stringify({ state, errors, failedRequests })}`, { cause: error });
        }
        const layout = await page.evaluate((selector) => {
          const board = document.querySelector("#board").getBoundingClientRect();
          const input = document.querySelector(selector).getBoundingClientRect();
          const check = document.querySelector("#check").getBoundingClientRect();
          const rail = document.querySelector(".domain-tabs").getBoundingClientRect();
          const question = document.querySelector(".question").getBoundingClientRect();
          return {
            board: { top: board.top, bottom: board.bottom, width: board.width, height: board.height },
            boardVisibleHeight: Math.max(0, Math.min(innerHeight, board.bottom) - Math.max(0, board.top)),
            input: { top: input.top, bottom: input.bottom, left: input.left, right: input.right },
            check: { top: check.top, bottom: check.bottom },
            rail: { left: rail.left, right: rail.right, bottom: rail.bottom },
            questionLeft: question.left,
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: innerWidth,
            viewportHeight: innerHeight
          };
        }, game.control);
        assert.ok(layout.rail.right <= layout.questionLeft + 1, `${game.name}/${language}/${viewport.width} rail overlaps question: ${JSON.stringify(layout)}`);
        assert.ok(layout.boardVisibleHeight >= 150, `${game.name}/${language}/${viewport.width} board is below the fold: ${JSON.stringify(layout)}`);
        assert.ok(layout.input.top >= 0 && layout.input.bottom <= viewport.height, `${game.name}/${language}/${viewport.width} first input is below the fold: ${JSON.stringify(layout)}`);
        assert.ok(layout.check.top >= 0 && layout.check.bottom <= viewport.height, `${game.name}/${language}/${viewport.width} check button is below the fold: ${JSON.stringify(layout)}`);
        assert.ok(layout.scrollWidth <= layout.viewportWidth + 1, `${game.name}/${language}/${viewport.width} horizontal overflow: ${JSON.stringify(layout)}`);
        if (game.kind === "number") {
          await page.locator(game.control).fill("1");
          assert.equal(await page.locator(game.control).inputValue(), "1");
        } else {
          await page.locator(game.control).first().check();
          assert.ok(await page.locator(game.control).first().isChecked());
        }
        assert.deepEqual(errors, [], `${game.name}/${language} page errors`);
        if (language === "ko") {
          await page.screenshot({ path: join(output, `${game.name}-${viewport.width}x${viewport.height}.png`) });
          console.log(`${game.name} ${viewport.width}x${viewport.height}: board ${Math.round(layout.boardVisibleHeight)}px visible, check bottom ${Math.round(layout.check.bottom)}px`);
        }
      }
    }
    await context.close();
  }
  for (const game of games) {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
      const context = await browser.newContext({ viewport, serviceWorkers: "block" });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/geometry/games/${game.name}/`, { waitUntil: "domcontentloaded" });
      await page.locator("#board svg").first().waitFor({ state: "visible" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${game.name} ${viewport.width}x${viewport.height} overflow`);
      await page.screenshot({ path: join(output, `${game.name}-${viewport.width}x${viewport.height}.png`) });
      await context.close();
    }
  }
  const offlineContext = await browser.newContext({ viewport: { width: 844, height: 390 } });
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${baseUrl}/geometry/shape-garden/`, { waitUntil: "networkidle" });
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.reload({ waitUntil: "networkidle" });
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.goto(`${baseUrl}/geometry/games/angle-studio/`, { waitUntil: "domcontentloaded" });
  await offlinePage.locator("#board svg").first().waitFor({ state: "visible" });
  assert.equal(await offlinePage.locator(".studio").evaluate((element) => getComputedStyle(element).display), "grid", "offline landscape stylesheet was not cached");
  await offlineContext.close();
  console.log(`Studio landscape browser check passed: 5 games, 4 locales, 4 landscape sizes, screenshots ${output}`);
} finally {
  await browser.close();
}
