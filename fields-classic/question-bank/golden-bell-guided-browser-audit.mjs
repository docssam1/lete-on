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

const targets = new Map([
  ["book-04", [
    ["fold-hole-count", "book4-fold-hole-count"],
    ["cube-box-fill", "book4-cube-box-fill"],
    ["multiplication-matrix", "book4-multiplication-matrix"],
    ["table-logic-source", "book4-table-logic-source"],
    ["circle-logic-source", "book4-circle-logic-source"],
    ["row-logic-source", "book4-row-logic-source"]
  ]],
  ["book-07", [
    ["shared-polygon-matchsticks", "shape-sequence"],
    ["closed-loop-planting", "closed-loop"],
    ["venn-overlap-all", "venn-diagram"],
    ["calendar-weekday", "calendar-weekday"],
    ["clock-reading", "clock-reading"],
    ["multiplication-equation", "multiplication-equation"],
    ["arithmetic-sequence", "arithmetic-sequence"],
    ["assumption-score", "assumption-score"],
    ["reverse-growth", "reverse-growth"],
    ["reverse-digits", "reverse-digits"]
  ]],
  ["book-08", [
    ["shape-equation-targets", "book08-shape-equation-targets"],
    ["pyramid-cryptarithm", "book08-pyramid-cryptarithm"],
    ["picture-division", "book08-picture-division"]
  ]]
]);
const requestedBooks = (process.env.GUIDED_AUDIT_BOOKS || [...targets.keys()].join(",")).split(",").map((value) => value.trim()).filter(Boolean);
assert.ok(requestedBooks.every((bookId) => targets.has(bookId)), "GUIDED_AUDIT_BOOKS contains an unknown book");
const activeTargets = new Map(requestedBooks.map((bookId) => [bookId, targets.get(bookId)]));

function normalizedFrame(html) {
  return String(html).replace(/\s+/gu, " ").trim();
}

const browser = await chromium.launch({ headless: true });

async function auditViewport(viewport, label) {
  for (const [bookId, lessons] of activeTargets) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=GUIDED-${label}&book=${bookId}`, { waitUntil: "networkidle" });

    for (const [lessonId, family] of lessons) {
      await page.locator(`.lesson-button[data-lesson="${lessonId}"]`).click();
      const experience = page.locator(`.guided-concept[data-guided-family="${family}"]`);
      assert.equal(await experience.count(), 1, `${label}/${lessonId}: guided concept missing`);
      const stepCount = Number((await experience.locator(".experience-progress").innerText()).split("/")[1].trim());
      assert.ok(stepCount >= 3, `${label}/${lessonId}: fewer than three concept stages`);
      const frames = [];

      for (let step = 0; step < stepCount; step += 1) {
        const current = page.locator(`.guided-concept[data-guided-family="${family}"]`);
        const visual = current.locator(".guided-concept-scene > :not(.experience-caption)").first();
        assert.equal(await visual.count(), 1, `${label}/${lessonId}: stage ${step + 1} visual missing`);
        const html = normalizedFrame(await visual.evaluate((node) => node.outerHTML));
        assert.doesNotMatch(html, /\b(?:NaN|undefined)\b/u, `${label}/${lessonId}: invalid value at stage ${step + 1}`);
        frames.push(html);
        const scene = await current.locator(".guided-concept-scene").evaluate((node) => ({
          clientWidth: node.clientWidth,
          scrollWidth: node.scrollWidth,
          children: [...node.children].map((child) => ({ clientWidth: child.clientWidth, scrollWidth: child.scrollWidth }))
        }));
        assert.ok(scene.scrollWidth <= scene.clientWidth + 2, `${label}/${lessonId}: scene overflows at stage ${step + 1}`);
        assert.ok(scene.children.every((child) => child.scrollWidth <= child.clientWidth + 2), `${label}/${lessonId}: visual child overflows at stage ${step + 1}`);
        if (step < stepCount - 1) await current.locator('[data-experience-action="next"]').click();
      }

      assert.equal(new Set(frames).size, stepCount, `${label}/${lessonId}: repeated concept frame`);
      if (captureDir) {
        await page.locator(`.guided-concept[data-guided-family="${family}"]`).screenshot({ path: path.join(captureDir, `${bookId}-${lessonId}-${label}.png`) });
      }
    }

    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2), false, `${label}/${bookId}: document overflow`);
    assert.deepEqual(errors, [], `${label}/${bookId}: browser errors: ${errors.join(" | ")}`);
    await page.close();
  }
}

try {
  await auditViewport({ width: 1440, height: 1050 }, "desktop");
  await auditViewport({ width: 390, height: 844 }, "mobile");
} finally {
  await browser.close();
}

const lessonCount = [...activeTargets.values()].reduce((sum, lessons) => sum + lessons.length, 0);
console.log(`GOLDEN_BELL_GUIDED_BROWSER_OK books=${requestedBooks.join(",")} lessons=${lessonCount} desktop=pass mobile=pass distinctFrames=pass overflow=pass`);
