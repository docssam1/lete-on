import { readdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Entry smoke only: a rendered first frame does not prove a level can be solved.
const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const playwrightImport = playwrightModule
  ? playwrightModule.startsWith("file:") ? playwrightModule : pathToFileURL(playwrightModule).href
  : "playwright";
const { chromium } = await import(playwrightImport);
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8771").replace(/\/$/, "");
const gameRoot = resolve("geometry/games");
const games = readdirSync(gameRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const output = mkdtempSync(join(tmpdir(), "geometry-all-games-"));
const browser = await chromium.launch({ headless: true });
const results = [];

for (const game of games) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`script: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  const result = { game, url: `${baseUrl}/geometry/games/${game}/`, views: [], errors };
  try {
    const response = await page.goto(result.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    result.httpStatus = response?.status() ?? null;
    await page.waitForTimeout(1500);
    for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(250);
      const view = await page.evaluate(() => {
        const body = document.body;
        const visible = (element) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return box.width > 0 && box.height > 0 && style.visibility !== "hidden" && style.display !== "none";
        };
        const visibleDialogs = [...document.querySelectorAll("[role='dialog']")]
          .filter(visible).map((element) => ({ id: element.id || element.closest("[id]")?.id || "", text: element.innerText.trim().slice(0, 120) }));
        const rotationGuard = [...document.querySelectorAll(".portrait-guide, .portrait-guard, .rotate-device")]
          .some(visible);
        const firstControls = [...document.querySelectorAll("button, input, select, [role='button']")]
          .filter((element) => visible(element) && !element.disabled)
          .slice(0, 8).map((element) => ({ id: element.id || "", text: (element.innerText || element.getAttribute("aria-label") || "").trim().slice(0, 48) }));
        const onScreen = (element) => {
          const box = element.getBoundingClientRect();
          return visible(element) && box.left < innerWidth && box.right > 0 && box.top < innerHeight && box.bottom > 0;
        };
        return {
          title: document.title,
          finalPath: location.pathname,
          textLength: body.innerText.trim().length,
          controlCount: [...document.querySelectorAll("button, input, select, [role='button']")].filter(visible).length,
          onScreenControlCount: [...document.querySelectorAll("button, input, select, [role='button']")].filter(onScreen).length,
          visibleDialogs,
          rotationGuard,
          firstControls,
          canvasCount: [...document.querySelectorAll("canvas")].filter(visible).length,
          svgCount: [...document.querySelectorAll("svg")].filter(visible).length,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight
        };
      });
      view.viewport = viewport;
      view.horizontalOverflow = view.scrollWidth > viewport.width + 2;
      view.empty = view.textLength < 8 && view.controlCount === 0 && view.canvasCount === 0 && view.svgCount === 0;
      await page.screenshot({ path: join(output, `${game}-${viewport.width}x${viewport.height}.png`), fullPage: false });
      result.views.push(view);
    }
  } catch (error) {
    errors.push(`navigation: ${error.message}`);
  } finally {
    results.push(result);
    await context.close();
  }
  console.log(`${game}: ${errors.length ? `${errors.length} errors` : "opened"}${result.views.some((view) => view.horizontalOverflow) ? ", horizontal overflow" : ""}`);
}

await browser.close();
const summary = {
  baseUrl, output, gameCount: games.length,
  errorGames: results.filter((result) => result.errors.length || result.httpStatus !== 200).map((result) => result.game),
  overflowGames: results.filter((result) => result.views.some((view) => view.horizontalOverflow)).map((result) => result.game),
  emptyGames: results.filter((result) => result.views.some((view) => view.empty)).map((result) => result.game),
  noLandscapeControls: results.filter((result) => !result.views.at(-1)?.controlCount).map((result) => result.game),
  landscapeScrollGames: results.filter((result) => result.views.at(-1)?.scrollHeight > 392).map((result) => result.game),
  dialogGames: results.filter((result) => result.views.some((view) => view.visibleDialogs.length)).map((result) => result.game),
  rotationGuardGames: results.filter((result) => result.views[0]?.rotationGuard).map((result) => result.game),
  results
};
writeFileSync(join(output, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ output, gameCount: summary.gameCount, errorGames: summary.errorGames, overflowGames: summary.overflowGames, emptyGames: summary.emptyGames, noLandscapeControls: summary.noLandscapeControls, landscapeScrollGames: summary.landscapeScrollGames, dialogGames: summary.dialogGames, rotationGuardGames: summary.rotationGuardGames }, null, 2));
if (summary.errorGames.length || summary.overflowGames.length || summary.emptyGames.length || summary.noLandscapeControls.length) process.exitCode = 1;
