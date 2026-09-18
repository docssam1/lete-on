import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const captureDir = process.env.FIELDS_CAPTURE_DIR || "";
if (captureDir) await fs.mkdir(captureDir, { recursive: true });

const lessons = [
  ["unit-area-and-half", "book09-area"],
  ["cube-map-total", "book09-cube"],
  ["magic-square-missing", "book09-magic"],
  ["consecutive-sum-pairing", "book09-consecutive"]
];
const phases = ["problem", "organize", "calculate", "verify"];
const browser = await chromium.launch({ headless: true });

async function auditViewport(viewport, label) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=BOOK09-${label}&book=book-09`, { waitUntil: "networkidle" });

  for (const [lessonId, family] of lessons) {
    await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
    const snapshots = [];
    for (let step = 0; step < phases.length; step += 1) {
      const experience = page.locator(`.guided-concept[data-guided-family="${family}"]`);
      assert.equal(await experience.count(), 1, `${label}/${lessonId}: guided concept missing`);
      const frame = experience.locator(`.guided-book09-source[data-book09-phase="${phases[step]}"]`);
      assert.equal(await frame.count(), 1, `${label}/${lessonId}: ${phases[step]} frame missing`);
      assert.equal(await experience.locator("[data-book09-answer]").count(), step === phases.length - 1 ? 1 : 0, `${label}/${lessonId}: answer visibility changed at step ${step + 1}`);
      snapshots.push((await frame.innerHTML()).replace(/\s+/gu, " "));
      const box = await experience.boundingBox();
      assert.ok(box && box.x >= -1 && box.x + box.width <= viewport.width + 1, `${label}/${lessonId}: concept crosses the viewport`);
      if (step < phases.length - 1) await experience.locator('[data-experience-action="next"]').click();
    }
    assert.equal(new Set(snapshots).size, phases.length, `${label}/${lessonId}: repeated animation frame`);
    if (captureDir) {
      await page.locator(`.guided-concept[data-guided-family="${family}"]`).screenshot({ path: path.join(captureDir, `${lessonId}-${label}.png`) });
    }
  }

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}: horizontal overflow`);
  assert.deepEqual(errors, [], `${label}: browser errors: ${errors.join(" | ")}`);
  await page.close();
}

try {
  await auditViewport({ width: 1440, height: 1050 }, "desktop");
  await auditViewport({ width: 390, height: 844 }, "mobile");
} finally {
  await browser.close();
}

console.log("GOLDEN_BELL_BOOK09_GUIDED_BROWSER_OK lessons=4 phases=4 desktop=pass mobile=pass answerHiddenBeforeVerify=pass");
