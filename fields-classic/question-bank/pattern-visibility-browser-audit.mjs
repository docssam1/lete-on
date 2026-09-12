import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR || path.join(os.tmpdir(), "fields-pattern-visibility-audit");
await fs.mkdir(output, { recursive: true });

const cases = [
  { typeId: "repeat-four-shapes", selector: ".cycle-items span", minimum: 9 },
  { typeId: "repeat-four-items-with-duplicate", selector: ".cycle-items span", minimum: 9 },
  { typeId: "triangle-position-cycle", selector: ".triangle-cycle figure:not(.target)", minimum: 9 },
  { typeId: "g1-stacked-shape-dual-cycle", selector: ".g1-stacked-cycle section", minimum: 11 },
  { typeId: "balance-scale", selector: ".balance-relations .weight-piece.rectangle", minimum: 1 },
  { typeId: "balance-scale-three-objects", selector: ".three-object-balances .weight-piece", minimum: 3 },
  { typeId: "balance-scale-circle-target", selector: ".three-object-balances .weight-piece", minimum: 3 },
  { typeId: "balance-scale-star-target", selector: ".three-object-balances .weight-piece", minimum: 3 },
  { typeId: "balance-scale-four-objects", selector: ".three-object-balances .weight-piece", minimum: 3 }
];

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    for (const [caseIndex, auditCase] of cases.entries()) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const student = `PATTERN-${width}-${caseIndex}-${Date.now()}`;
      await page.goto(`${base}/fields-classic/question-bank/?student=${student}&mode=type`, { waitUntil: "networkidle", timeout: 30000 });
      await page.locator('#builderTabs button[data-mode="type"]').click();
      await page.locator('#difficultyChoices button[data-level="advanced"]').click();
      await page.evaluate((typeId) => {
        const input = document.querySelector(`#bankTypeTree input[data-type-id="${typeId}"]`);
        if (!input || input.disabled) throw new Error(`${typeId}: type is unavailable`);
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, auditCase.typeId);
      await page.locator("#questionCount").fill("1");
      await page.locator("#questionCount").dispatchEvent("change");
      await page.locator("#buildButton").click();
      await page.locator("#worksheetSection").waitFor({ state: "visible", timeout: 30000 });

      const nodes = page.locator(`.question-card[data-type-id="${auditCase.typeId}"] ${auditCase.selector}`);
      assert.ok(await nodes.count() >= auditCase.minimum, `${auditCase.typeId}: too few visible items at ${width}px`);
      if (auditCase.typeId.startsWith("balance-scale")) {
        assert.equal(
          await page.locator(".weight-piece:not(:has(svg.pattern-shape-svg))").count(),
          0,
          `${auditCase.typeId}: a font glyph is still used instead of vector artwork`
        );
      }
      if (auditCase.typeId === "balance-scale") assert.equal(await page.locator(".balance-relations .weight-piece.square").count(), 0, "balance-scale: rectangle changed into square");
      if (["repeat-four-shapes", "repeat-four-items-with-duplicate"].includes(auditCase.typeId)) {
        assert.equal(await page.locator(".cycle-items svg.pattern-shape-svg").count(), 9, `${auditCase.typeId}: vector artwork is missing`);
      }
      if (auditCase.typeId === "g1-stacked-shape-dual-cycle") {
        assert.equal(
          await page.locator(".g1-stacked-cycle i:not(:has(svg.pattern-shape-svg))").count(),
          0,
          "g1-stacked-shape-dual-cycle: a font glyph is still used instead of vector artwork"
        );
      }

      const overflow = await page.locator(`.question-card[data-type-id="${auditCase.typeId}"]`).evaluate((card) => {
        const cardBox = card.getBoundingClientRect();
        return [...card.querySelectorAll(".visual *")].filter((node) => {
          const style = getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const box = node.getBoundingClientRect();
          return box.width > 0 && (box.left < cardBox.left - 1 || box.right > cardBox.right + 1);
        }).length;
      });
      assert.equal(overflow, 0, `${auditCase.typeId}: visual content escapes the card at ${width}px`);
      assert.deepEqual(errors, [], `${auditCase.typeId}: browser errors at ${width}px: ${errors.join(" | ")}`);

      await page.locator("#worksheetSection").screenshot({ path: path.join(output, `${auditCase.typeId}-${width}.png`) });
      await page.emulateMedia({ media: "print" });
      assert.ok(await nodes.count() >= auditCase.minimum, `${auditCase.typeId}: print CSS hides required items`);
      if (width === 1440) {
        const pdfPath = path.join(output, `${auditCase.typeId}-a4.pdf`);
        await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
        assert.ok((await fs.stat(pdfPath)).size > 5000, `${auditCase.typeId}: A4 PDF was not generated`);
      }
      await page.close();
    }
  }
  console.log(`PATTERN_VISIBILITY_BROWSER_OK cases=${cases.length} viewports=1440,390 capture=${output}`);
} finally {
  await browser.close();
}
