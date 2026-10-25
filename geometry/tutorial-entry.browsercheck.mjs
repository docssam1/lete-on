import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(playwrightModule ? pathToFileURL(playwrightModule).href : "playwright");
const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8771").replace(/\/$/, "");
const browser = await chromium.launch({ headless: true });
const games = [
  { name: "equal-partition", path: "?level=1", board: "#boardStage .partition-svg" },
  { name: "paper-turn", path: "?level=1", board: "#choiceGrid button" },
  { name: "polyomino", path: "?level=1", board: "#targetSlot" }
];

try {
  for (const game of games) {
    for (const language of ["ko", "en", "zh", "ja"]) {
      const context = await browser.newContext({ viewport: { width: 844, height: 390 } });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript((lang) => localStorage.setItem("gfield-language", lang), language);
      await page.goto(`${baseUrl}/geometry/games/${game.name}/${game.path}`, { waitUntil: "networkidle" });
      await page.locator("#tutorial").waitFor({ state: "visible" });
      const buttons = await page.locator("#tutorialSkip, #tutorialNext").evaluateAll((nodes) => nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { text: node.textContent.trim(), left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      }));
      assert.equal(buttons.length, 2);
      buttons.forEach((button) => {
        assert.ok(button.text && button.left >= 0 && button.right <= 844 && button.top >= 0 && button.bottom <= 390,
          `${game.name}/${language} tutorial button clipped: ${JSON.stringify(button)}`);
      });
      if (game.name === "polyomino") {
        await page.evaluate(() => {
          const speech = window.speechSynthesis;
          const cancel = speech.cancel.bind(speech);
          window.__speechCancelCalls = 0;
          Object.defineProperty(speech, "cancel", { configurable: true, value: () => {
            window.__speechCancelCalls += 1;
            cancel();
          } });
        });
      }
      await page.locator("#tutorialSkip").click();
      assert.equal(await page.locator("#tutorial").isVisible(), false, `${game.name}/${language} skip did not close`);
      if (game.name === "polyomino") {
        assert.ok(await page.evaluate(() => window.__speechCancelCalls > 0), `${game.name}/${language} narration did not stop`);
      }
      assert.ok(await page.locator(game.board).first().isVisible(), `${game.name}/${language} board did not open`);
      if (game.name === "equal-partition") {
        const boardFits = await page.locator(".partition-svg").evaluate((svg) => {
          const art = svg.getBBox();
          const matrix = svg.getScreenCTM();
          const stage = document.querySelector("#boardStage").getBoundingClientRect();
          return [[art.x, art.y], [art.x + art.width, art.y], [art.x, art.y + art.height], [art.x + art.width, art.y + art.height]]
            .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix))
            .every((point) => point.x >= stage.left - 2 && point.x <= stage.right + 2 && point.y >= stage.top - 2 && point.y <= stage.bottom + 2);
        });
        assert.ok(boardFits, `${game.name}/${language} board artwork clipped`);
      }
      if (language === "ko") await page.screenshot({ path: join(tmpdir(), `geometry-${game.name}-after-start.png`) });
      assert.deepEqual(errors, [], `${game.name}/${language} page error`);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await page.locator("#tutorial").isVisible(), false, `${game.name}/${language} tutorial returned after reload`);
      await context.close();
    }
    console.log(`${game.name}: first-visit start and 4 locales passed`);
  }
  const portrait = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await portrait.goto(`${baseUrl}/geometry/games/paper-turn/?level=1`, { waitUntil: "networkidle" });
  await portrait.locator("#tutorialSkip").click();
  assert.ok(await portrait.locator("#choiceGrid button").first().isVisible(), "paper-turn portrait board did not open");
  assert.ok(await portrait.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "paper-turn portrait overflow");
  await portrait.screenshot({ path: join(tmpdir(), "geometry-paper-turn-portrait-after-start.png") });
  await portrait.close();
} finally {
  await browser.close();
}
