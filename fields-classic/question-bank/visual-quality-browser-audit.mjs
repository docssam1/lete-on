import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR || path.join(os.tmpdir(), "fields-visual-quality-audit");
await fs.mkdir(output, { recursive: true });

const defaultTypeIds = [
  "cube-count-solid",
  "cube-hidden-count-walled",
  "cube-hidden-count",
  "cube-fill-rectangular-box",
  "shape-sum-table",
  "symbol-sum-grid",
  "distinct-shape-value-equation",
  "given-shape-expression",
  "repeat-shape-color-dual",
  "shortest-path-rectangle",
  "rod-difference-measure-count",
  "diagnostic-part-whole-bar",
  "shape-matrix-three-features",
  "g1-summer-balance-shape-chain",
  "g1-summer-four-shape-add-subtract",
  "g1-summer-four-by-four-shape-sum",
  "g1-summer-vertical-shape-addition",
  "g1-summer-four-symbol-relation",
  "g1-summer-shape-height-dual-cycle",
  "g1-fall-four-by-four-shape-sum-four-targets",
  "g1-winter-shape-sum-target-row",
  "g1-winter-three-balance-substitution",
  "symbol-relation",
  "symbol-relation-2to3",
  "symbol-relation-3to4",
  "symbol-chain-arithmetic",
  "colored-triangle-growth",
  "overlapping-paper-bottom",
  "cube-shell-interior-b9",
  "three-fold-cut-line-book4"
];
const typeIds = process.env.FIELDS_VISUAL_TYPES
  ? process.env.FIELDS_VISUAL_TYPES.split(",").map((value) => value.trim()).filter(Boolean)
  : defaultTypeIds;
const questionCount = Math.max(1, Number(process.env.FIELDS_VISUAL_COUNT || 1));
const difficulty = process.env.FIELDS_VISUAL_DIFFICULTY || "";

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    for (const [index, typeId] of typeIds.entries()) {
      console.log(`VISUAL_QUALITY_CASE type=${typeId} width=${width}`);
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${base}/fields-classic/question-bank/?student=VISUAL-${width}-${index}-${Date.now()}&mode=type&types=${encodeURIComponent(typeId)}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.locator('#builderTabs button[data-mode="type"]').click();
      if (difficulty) await page.locator(`#difficultyChoices button[data-level="${difficulty}"]`).click();
      await page.locator("#questionCount").fill(String(questionCount));
      await page.locator("#questionCount").dispatchEvent("change");
      await page.locator("#buildButton").click();
      const cards = page.locator(`.question-card[data-type-id="${typeId}"]`);
      const card = cards.first();
      await card.waitFor({ state: "visible", timeout: 30000 });
      const visual = card.locator(".visual");
      assert.ok(await visual.count(), `${typeId}: visual is missing`);
      const overflow = Math.max(...await cards.evaluateAll((nodes) => nodes.map((node) => node.scrollWidth - node.clientWidth)));
      assert.ok(overflow <= 1, `${typeId}: card overflows by ${overflow}px at ${width}px`);
      assert.deepEqual(errors, [], `${typeId}: browser errors at ${width}px: ${errors.join(" | ")}`);
      await card.screenshot({ path: path.join(output, `${typeId}-${width}.png`) });
      if (width === 1440) {
        await page.emulateMedia({ media: "print" });
        await page.pdf({ path: path.join(output, `${typeId}-a4.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
      }
      await page.close();
    }
  }
  console.log(`VISUAL_QUALITY_BROWSER_OK types=${typeIds.length} viewports=1440,390 capture=${output}`);
} finally {
  await browser.close();
}
