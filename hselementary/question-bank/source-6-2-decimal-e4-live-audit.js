"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
global.window = {};
require("./source-inventory-grade6.js");
const ids = window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(item => item.sourceItemId.startsWith("6-2-u2-e4-") && !item.reviewLocked).map(item => item.sourceItemId);
assert.equal(ids.length, 11, "Only the eleven source-reviewed finite pools are ready.");
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "Audit output belongs on E: or G:.");
fs.mkdirSync(output, { recursive: true });
const assets = ["index.html", "generators.js", "source-6-2-decimal-e4.js", "source-6-2-decimal-e4.css", "source-inventory-grade6.js", "app.js"];
const hashes = () => Object.fromEntries(assets.map(file => [file, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, file))).digest("hex")]));
const before = hashes();
const base = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const pageCount = file => Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)[1]);
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE });
  let checked = 0;
  const pdfs = [];
  try {
    for (const id of ids) for (const difficulty of [-1, 0, 1]) for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      for (const phase of ["problem", "solution"]) {
        if (phase === "solution") await page.locator("#solutionTab").click();
        const state = await page.evaluate(({ id, phase }) => {
          const root = document.querySelector(phase === "problem" ? "#problemView" : "#solutionView");
          const failures = [];
          for (const el of root.querySelectorAll(".math-inline-expression, .source62-e4-expression")) {
            const r = el.getBoundingClientRect(), p = el.closest(".question-item, .solution-item").getBoundingClientRect();
            if (r.left < p.left - 1 || r.right > p.right + 1 || el.getClientRects().length !== 1) failures.push(`Expression bounds: ${el.textContent}`);
          }
          for (const el of root.querySelectorAll(".source62-e4-answer-table th, .source62-e4-answer-table td, .source62-e4-expression, .source62-e4-problem-table td, .source62-e4-problem-table th, .math-inline-expression")) {
            const style = getComputedStyle(el);
            if (+style.fontWeight > 500) failures.push(`Weight: ${el.textContent}`);
            if (!/^rgb\((0|17|32), \1, \1\)$/.test(style.color)) failures.push(`Color: ${el.textContent}/${style.color}`);
          }
          return {
            count: root.querySelectorAll(phase === "problem" ? ".question-item" : ".solution-item").length,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            innerOverflow: [...root.querySelectorAll(".source62-e4-answer-table, .source62-e4-problem-table")].some(el => el.scrollWidth > el.clientWidth + 1),
            answers: root.querySelectorAll(`[data-answer-source="${id}"]`).length,
            figures: root.querySelectorAll("svg, img, canvas").length,
            leak: phase === "problem" && !!root.querySelector("[data-answer-source], [data-phase=answer]"), failures
          };
        }, { id, phase });
        assert.equal(state.count, 3, `${id}/${difficulty}/${width}/${phase}: three finite variants`);
        assert(!state.overflow && !state.innerOverflow && !state.leak, JSON.stringify({ id, difficulty, width, phase, state }));
        assert.equal(state.figures, 0, "Text-only original must remain text-only.");
        assert.equal(state.answers, phase === "solution" ? 3 : 0);
        assert.deepEqual(state.failures, [], `${id}/${difficulty}/${width}/${phase}`);
        if (width !== 320 && difficulty !== -1) await page.screenshot({ path: path.join(output, `${id}-d${difficulty}-${width}-${phase}.png`), fullPage: true });
        if (width === 1280) {
          await page.emulateMedia({ media: "print" });
          const file = path.join(output, `${id}-d${difficulty}-${phase}-a4.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          const pages = pageCount(file);
          assert(pages >= 1 && pages <= (phase === "problem" ? 1 : 2), `${id}/${difficulty}/${phase}: ${pages} A4 pages`);
          pdfs.push({ id, difficulty, phase, pages });
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
      checked++;
      if (checked % 9 === 0) console.log(`E4 ${checked} states checked: ${id}`);
    }
  } finally { await browser.close(); }
  assert.deepEqual(hashes(), before, "Code changed during audit: rerun final assets.");
  fs.writeFileSync(path.join(output, "browser-result.json"), JSON.stringify({ checked, ids, pdfs, assetHashes: before }, null, 2));
  console.log(`E4 ${ids.length} types, ${checked} real browser states, ${pdfs.length} A4 files passed.`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
