import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const here = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const assetDir = path.join(here, "assets", "intro");
const browser = await chromium.launch({ headless: true });

async function captureProductImages(page) {
  fs.mkdirSync(assetDir, { recursive: true });
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=DEMO&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="practice"]').click();
  const type = page.locator('.curriculum-type[data-preview-type="symbol-balanced-congruent-partition"]').first();
  await type.scrollIntoViewIfNeeded();
  await type.hover();
  await page.screenshot({ path: path.join(assetDir, "question-bank-selector.webp"), type: "webp", quality: 86 });
  await type.locator("input").check();
  await page.locator("#questionCount").fill("4");
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click();
  await page.locator("#worksheetSection").screenshot({ path: path.join(assetDir, "question-bank-sheet.webp"), type: "webp", quality: 86 });
}

async function auditIntro(page, viewportName) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/intro.html?student=DEMO`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("h1").innerText(), "필즈 더 클래식\n사고력 문제은행", `${viewportName}: hero title mismatch`);
  assert.equal(await page.locator(".cycle-list li").count(), 4, `${viewportName}: learning cycle mismatch`);
  assert.equal(await page.locator(".difference-grid article").count(), 3, `${viewportName}: proof section mismatch`);
  assert.equal(await page.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true, `${viewportName}: product image missing`);
  assert.equal(await page.locator('[data-preserve-student="bank"]').first().getAttribute("href").then((href) => new URL(href).searchParams.get("student")), "DEMO", `${viewportName}: student query not preserved`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${viewportName}: horizontal overflow`);
  assert.deepEqual(errors, [], `${viewportName}: browser errors: ${errors.join(" | ")}`);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  if (process.env.CAPTURE_INTRO_ASSETS === "1") await captureProductImages(desktop);
  await auditIntro(desktop, "desktop");
  if (process.env.INTRO_SCREENSHOT) await desktop.screenshot({ path: process.env.INTRO_SCREENSHOT, fullPage: true });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await auditIntro(mobile, "mobile");
  if (process.env.INTRO_MOBILE_SCREENSHOT) await mobile.screenshot({ path: process.env.INTRO_MOBILE_SCREENSHOT, fullPage: true });
  await mobile.goto(`${baseUrl}/fields-classic/question-bank/?student=DEMO`, { waitUntil: "networkidle" });
  assert.equal(new URL(await mobile.locator("#introLink").getAttribute("href"), mobile.url()).searchParams.get("student"), "DEMO", "question bank intro link lost student query");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "question bank header overflows on mobile");
  console.log("QUESTION_BANK_INTRO_OK cycle=4 proof=3 images=2 desktop=1440 mobile=390");
} finally {
  await browser.close();
}
