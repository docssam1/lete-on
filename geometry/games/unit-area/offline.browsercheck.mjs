import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { domains } from "./core.js";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
try {
  await page.goto(base + "/geometry/games/unit-area/");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  for (const domain of domains) {
    await page.goto(`${base}/geometry/games/unit-area/?domain=${domain.id}`);
    await page.waitForSelector("#board svg");
  }
  await page.goto(base + "/geometry/worksheet/unit-area/");
  await page.waitForSelector(".problem");
  await context.setOffline(true);
  for (const domain of domains) {
    await page.goto(`${base}/geometry/games/unit-area/?domain=${domain.id}&level=${domain.level}&practice=1&lang=ko`);
    await page.waitForSelector("#board svg");
    assert.equal(await page.locator("#title").textContent(), domain.names.ko);
  }
  await page.goto(base + "/geometry/worksheet/unit-area/?domain=all&count=20");
  await page.waitForSelector(".problem");
  assert.equal(await page.locator(".problem").count(), 20);
  console.log(JSON.stringify({ offlineDomains: domains.length, offlineWorksheet: true }));
} finally { await browser.close(); }
