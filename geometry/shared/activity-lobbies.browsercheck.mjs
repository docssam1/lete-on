import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8877").replace(/\/$/, "");
const cases = [
  { path: "mirror-manor", bands: ["초등팩토 1", "초등팩토 1", "초등팩토 1", "1031 입문 · 입문", "1031 입문 · 입문"] },
  { path: "geoboard", bands: ["1031 입문 · 입문", "1031 입문 · 입문", "1031 초급", "1031 초급", "1031 초급"] }
];
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

const browser = await chromium.launch({ headless: true });
const errors = [];

try {
  for (const item of cases) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      page.on("console", (message) => { if (message.type() === "error") errors.push(`${item.path}: ${message.text()}`); });
      page.on("pageerror", (error) => errors.push(`${item.path}: ${error.message}`));
      await page.addInitScript(() => {
        localStorage.setItem("gfield-language", "ko");
        localStorage.setItem("gfield-audio-muted", "true");
      });
      await page.goto(`${baseUrl}/geometry/${item.path}/`, { waitUntil: "networkidle" });
      await page.locator(".type-card").first().waitFor({ state: "visible" });

      assert.equal(await page.locator(".type-card").count(), 5, `${item.path} should expose five activity types`);
      assert.deepEqual(await page.locator(".type-band").allTextContents(), item.bands);
      assert.equal(await page.locator('.type-card[href*="level="]').count(), 5);

      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".type-card")];
        const contained = cards.every((card) => {
          const outer = card.getBoundingClientRect();
          return [...card.querySelectorAll(".type-band, h3, p, .type-difficulty, .type-start")].every((node) => {
            const inner = node.getBoundingClientRect();
            return inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
          });
        });
        return {
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          contained
        };
      });
      assert.ok(layout.horizontalOverflow <= 1, `${item.path} ${viewport.name} has horizontal overflow`);
      assert.equal(layout.contained, true, `${item.path} ${viewport.name} has card text overflow`);

      const screenshot = `C:/Users/user/AppData/Local/Temp/${item.path}-${viewport.name}-curriculum.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      const stats = await sharp(screenshot).stats();
      assert.ok(stats.channels.some((channel) => channel.stdev > 10), `${item.path} ${viewport.name} screenshot is blank`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}

assert.deepEqual(errors, []);
console.log("Activity lobby browser check passed: 2 lobbies, desktop and mobile, exact curriculum bands, no overflow.");
