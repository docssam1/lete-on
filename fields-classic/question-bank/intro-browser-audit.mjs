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
  await page.goto(`${baseUrl}/fields-classic/question-bank/?audit=1&student=DEMO&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="practice"]').click();
  const type = page.locator('.curriculum-type[data-preview-type="symbol-balanced-congruent-partition"]').first();
  await type.scrollIntoViewIfNeeded();
  await type.hover();
  await page.screenshot({ path: path.join(assetDir, "question-bank-selector.webp"), type: "webp", quality: 86 });
  await type.locator("input").check();
  await page.locator("#questionCount").fill("4");
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click(); await page.locator("#edNext").click();   // 2단계 상세 편집을 지나 인쇄 화면으로
  await page.locator("#worksheetSection").screenshot({ path: path.join(assetDir, "question-bank-sheet.webp"), type: "webp", quality: 86 });
}

// 소개 화면(intro.html)은 대문(home.html)으로 넘기는 자리만 남았다 — 넘어가며 student 같은 주소 꼬리를 지키는지 본다
async function auditIntro(page, viewportName) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/intro.html?student=DEMO`, { waitUntil: "networkidle" });
  const landed = new URL(page.url());
  assert.equal(landed.pathname.endsWith("/home.html"), true, `${viewportName}: intro did not hand over to home.html (${landed.pathname})`);
  assert.equal(landed.searchParams.get("student"), "DEMO", `${viewportName}: student query not preserved`);
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
  await mobile.goto(`${baseUrl}/fields-classic/question-bank/?audit=1&student=DEMO`, { waitUntil: "networkidle" });
  assert.equal(new URL(await mobile.locator("#introLink").getAttribute("href"), mobile.url()).searchParams.get("student"), "DEMO", "question bank intro link lost student query");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "question bank header overflows on mobile");
  console.log("QUESTION_BANK_INTRO_OK redirect=home.html desktop=1440 mobile=390");
} finally {
  await browser.close();
}
