import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR || path.join(os.tmpdir(), "fields-summer-balance-audit");
const viewportWidth = Number(process.env.FIELDS_VIEWPORT_WIDTH || 1440);
const viewportName = viewportWidth <= 400 ? "mobile" : "desktop";
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: viewportWidth, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=type`, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator('#builderTabs button[data-mode="type"]').click();
  await page.locator('#difficultyChoices button[data-level="advanced"]').click();
  await page.evaluate(() => {
    const input = document.querySelector('#bankTypeTree input[data-type-id="g1-summer-balance-shape-chain"]');
    if (!input || input.disabled) throw new Error("The summer balance type is unavailable");
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.locator("#questionCount").fill("20");
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click();
  await page.locator("#worksheetSection").waitFor({ state: "visible", timeout: 30000 });

  const result = await page.locator(".g1-summer-balance").evaluateAll((balances) => {
    const overlaps = [];
    const invalidLayers = [];
    let maxPieces = 0;
    for (const [balanceIndex, balance] of balances.entries()) {
      for (const [scaleIndex, svg] of [...balance.querySelectorAll("svg")].entries()) {
        const pieces = [...svg.querySelectorAll("text.balance-piece")];
        maxPieces = Math.max(maxPieces, pieces.length);
        const bySymbol = Object.groupBy(pieces, (piece) => piece.textContent);
        for (const [symbol, group] of Object.entries(bySymbol)) {
          const rows = new Set(group.map((piece) => piece.dataset.pieceRow));
          if (group.length >= 4 && rows.size !== 2) invalidLayers.push({ balanceIndex, scaleIndex, symbol, count: group.length, rows: [...rows] });
          if (group.length < 4 && rows.size !== 1) invalidLayers.push({ balanceIndex, scaleIndex, symbol, count: group.length, rows: [...rows] });
        }
        for (let leftIndex = 0; leftIndex < pieces.length; leftIndex += 1) {
          const a = pieces[leftIndex].getBoundingClientRect();
          for (let rightIndex = leftIndex + 1; rightIndex < pieces.length; rightIndex += 1) {
            const b = pieces[rightIndex].getBoundingClientRect();
            const intersectionWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const intersectionHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (intersectionWidth > 0.5 && intersectionHeight > 0.5) overlaps.push({
              balanceIndex,
              scaleIndex,
              leftIndex,
              rightIndex,
              a: { text: pieces[leftIndex].textContent, row: pieces[leftIndex].dataset.pieceRow, x: Math.round(a.x), y: Math.round(a.y), width: Math.round(a.width), height: Math.round(a.height) },
              b: { text: pieces[rightIndex].textContent, row: pieces[rightIndex].dataset.pieceRow, x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) }
            });
          }
        }
      }
    }
    return { balanceCount: balances.length, maxPieces, overlaps, invalidLayers };
  });
  assert.equal(result.balanceCount, 20, "The audit must render 20 balance questions");
  assert.ok(result.maxPieces >= 6, `The difficult case did not exercise six pieces: ${result.maxPieces}`);
  assert.deepEqual(result.invalidLayers, [], `Four or more pieces must use two layers: ${JSON.stringify(result.invalidLayers)}`);
  assert.deepEqual(result.overlaps, [], `Balance pieces overlap: ${JSON.stringify(result.overlaps)}`);
  assert.deepEqual(errors, [], `Browser errors: ${errors.join(" | ")}`);

  const worksheet = page.locator("#worksheetSection");
  await worksheet.screenshot({ path: path.join(output, `summer-balance-20-${viewportName}.png`), fullPage: false });
  await page.emulateMedia({ media: "print" });
  const overflow = await page.locator(".g1-summer-balance svg").evaluateAll((nodes) => nodes.filter((svg) => {
    const box = svg.getBoundingClientRect();
    return [...svg.querySelectorAll("text")].some((text) => {
      const rect = text.getBoundingClientRect();
      return rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1;
    });
  }).length);
  assert.equal(overflow, 0, "A balance label escapes its SVG in print mode");
  const pdfBytes = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  await fs.writeFile(path.join(output, `summer-balance-20-${viewportName}.pdf`), pdfBytes);
  const pdf = await PDFDocument.load(pdfBytes);
  assert.equal(pdf.getPageCount(), 10, `Twenty balance questions must print two per A4 page: ${pdf.getPageCount()}`);
  console.log(`G1_SUMMER_BALANCE_LAYOUT_OK viewport=${viewportWidth} questions=${result.balanceCount} pages=${pdf.getPageCount()} maxPieces=${result.maxPieces} overlaps=0 layers=pass capture=${output}`);
} finally {
  await browser.close();
}
