"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const ids = [4, 6].map(n => `6-2-u2-e2-mission-${n}`);
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "Evidence output must stay on E: or G:.");
fs.mkdirSync(output, { recursive: true });
const base = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const assets = ["index.html", "generators.js", "app.js", "source-inventory-grade6.js", "source-6-2-e2-geometry.js", "source-6-2-e2-geometry.css"];
const hashes = () => Object.fromEntries(assets.map(file => [file, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, file))).digest("hex")]));
const before = hashes();

async function inspect(page, id, phase) {
  const state = await page.evaluate(({ id, phase }) => {
    const root = document.querySelector(phase === "problem" ? "#problemView" : "#solutionView");
    const failures = [];
    const svgs = [...root.querySelectorAll('svg[data-renderer="source62-e2-model"]')];
    const overlaps = (a, b) => a.left < b.right + 1 && a.right + 1 > b.left && a.top < b.bottom + 1 && a.bottom + 1 > b.top;
    for (const svg of svgs) {
      const frame = svg.getBoundingClientRect(), matrix = svg.getScreenCTM();
      if (svg.hasAttribute("data-model")) failures.push("Hidden numeric model on learner SVG");
      const screen = (x, y) => new DOMPoint(x, y).matrixTransform(matrix);
      for (const shape of svg.querySelectorAll("line,path,rect")) {
        const style = getComputedStyle(shape);
        if (style.stroke !== "rgb(0, 0, 0)" || Math.abs(parseFloat(style.strokeWidth) - 1.4) > 0.001) failures.push(`Stroke typography: ${shape.tagName}`);
      }
      const labels = [...svg.querySelectorAll("text")].map(el => ({ el, text: el.textContent, box: el.getBoundingClientRect() }));
      for (const unit of svg.querySelectorAll(".source62-four-rect-unit")) {
        if (unit.hasAttribute("dy") || unit.hasAttribute("x")) failures.push("Area number and unit must share one line");
      }
      for (const [index, label] of labels.entries()) {
        const r = label.box, style = getComputedStyle(label.el);
        if (r.left < frame.left || r.right > frame.right || r.top < frame.top || r.bottom > frame.bottom) failures.push(`Label outside SVG: ${label.text}`);
        if (+style.fontWeight !== 400 || !/^rgb\((0|17|32), \1, \1\)$/.test(style.fill)) failures.push(`Label typography: ${label.text}`);
        if (r.height < 10) failures.push(`Small rendered label: ${label.text}/${r.height}`);
        for (const other of labels.slice(index + 1)) if (overlaps(r, other.box)) failures.push(`Label collision: ${label.text}/${other.text}`);
        const inside = p => p.x > r.left - 1 && p.x < r.right + 1 && p.y > r.top - 1 && p.y < r.bottom + 1;
        for (const shape of svg.querySelectorAll("line,path,rect")) {
          if (shape.matches("[data-layout-ignore], [data-layout-overlap-ok]")) continue;
          let samples = [];
          if (shape.tagName.toLowerCase() === "line") {
            const a = screen(+shape.getAttribute("x1"), +shape.getAttribute("y1"));
            const b = screen(+shape.getAttribute("x2"), +shape.getAttribute("y2"));
            const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y)));
            samples = Array.from({ length: steps + 1 }, (_, i) => ({ x: a.x + (b.x - a.x) * i / steps, y: a.y + (b.y - a.y) * i / steps }));
          } else if (typeof shape.getTotalLength === "function") {
            const length = shape.getTotalLength(), steps = Math.max(1, Math.ceil(length * Math.max(Math.abs(matrix.a), Math.abs(matrix.d))));
            samples = Array.from({ length: steps + 1 }, (_, i) => { const p = shape.getPointAtLength(length * i / steps); return screen(p.x, p.y); });
          }
          if (samples.some(inside)) failures.push(`Label/stroke: ${label.text}/${shape.getAttribute("class") || shape.dataset.layoutRole || shape.tagName}`);
        }
      }
      if (svg.dataset.sourceItem !== id) failures.push("Wrong source item on figure");
    }
    const expressions = [...root.querySelectorAll(".math-inline-expression")];
    for (const el of expressions) {
      const r = el.getBoundingClientRect(), parent = el.closest(".question-item, .solution-item").getBoundingClientRect();
      if (el.getClientRects().length !== 1 || r.left < parent.left - 1 || r.right > parent.right + 1) failures.push(`Broken expression: ${el.textContent}`);
      const style = getComputedStyle(el);
      if (+style.fontWeight !== 400 || style.color !== "rgb(0, 0, 0)") failures.push(`Expression typography: ${el.textContent}`);
    }
    return {
      count: root.querySelectorAll(phase === "problem" ? ".question-item" : ".solution-item").length,
      figures: svgs.length, failures,
      answers: root.querySelectorAll(`[data-answer-source="${id}"]`).length,
      leak: phase === "problem" && !!root.querySelector("[data-answer-source], [data-phase=answer]"),
      overflow: document.documentElement.scrollWidth > innerWidth + 1
    };
  }, { id, phase });
  assert.equal(state.count, 3);
  assert.equal(state.figures, 3);
  assert.equal(state.answers, phase === "solution" ? 3 : 0);
  assert(!state.leak && !state.overflow, JSON.stringify(state));
  assert.deepEqual(state.failures, [], `${id}/${phase}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE });
  const pdfs = [];
  let checked = 0;
  try {
    for (const id of ids) for (const difficulty of [-1, 0, 1]) for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.setDefaultNavigationTimeout(60000);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      for (const phase of ["problem", "solution"]) {
        if (phase === "solution") await page.locator("#solutionTab").click();
        await inspect(page, id, phase);
        if (width !== 320) await page.screenshot({ path: path.join(output, `${id}-d${difficulty}-${width}-${phase}.png`), fullPage: true });
        if (width === 1280) {
          await page.emulateMedia({ media: "print" });
          await inspect(page, id, phase);
          const file = path.join(output, `${id}-d${difficulty}-${phase}-a4.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          const pages = Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)[1]);
          assert(pages >= 1 && pages <= 2, `${id}/${difficulty}/${phase}: ${pages} pages`);
          pdfs.push({ id, difficulty, phase, pages });
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
      checked++;
      console.log(`E2 geometry ${checked}/18: ${id}/${difficulty}/${width}`);
    }
  } finally { await browser.close(); }
  assert.deepEqual(hashes(), before, "Rendered code changed: repeat the final audit.");
  fs.writeFileSync(path.join(output, "browser-result.json"), JSON.stringify({ checked, ids, pdfs, assetHashes: before }, null, 2));
  console.log(`E2 geometry passed ${checked} real-page states and ${pdfs.length} A4 files.`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
