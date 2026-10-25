import assert from "node:assert/strict";
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
      await page.locator("#tutorialSkip").click();
      assert.equal(await page.locator("#tutorial").isVisible(), false, `${game.name}/${language} skip did not close`);
      assert.ok(await page.locator(game.board).first().isVisible(), `${game.name}/${language} board did not open`);
      assert.deepEqual(errors, [], `${game.name}/${language} page error`);
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await page.locator("#tutorial").isVisible(), false, `${game.name}/${language} tutorial returned after reload`);
      await context.close();
    }
    console.log(`${game.name}: first-visit start and 4 locales passed`);
  }
} finally {
  await browser.close();
}
