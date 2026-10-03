"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const ids = ["exploration-1", "example-3", "example-4", ...Array.from({ length: 6 }, (_, i) => `mission-${i + 1}`)].map(s => `6-2-u2-e6-${s}`);
const selectedIds = process.env.HSE_TYPE_FILTER ? ids.filter(id => process.env.HSE_TYPE_FILTER.split(",").includes(id)) : ids;
const difficulties = process.env.HSE_DIFFICULTY_FILTER ? process.env.HSE_DIFFICULTY_FILTER.split(",").map(Number) : [-1, 0, 1];
assert(selectedIds.length && difficulties.every(d => [-1, 0, 1].includes(d)));
const assetFiles = ["source-6-2-decimal-e6-geometry.js", "source-6-2-decimal-e6-text.js", "source-6-2-decimal-e6-geometry.css", "source-inventory-grade6.js", "app.js"];
const assetHashes = () => Object.fromEntries(assetFiles.map(file => [file, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, file))).digest("hex")]));
const startHashes = assetHashes();
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "검수 결과는 E: 또는 G: 경로여야 합니다.");
fs.mkdirSync(output, { recursive: true });
const base = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const pageCount = file => Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)[1]);
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE });
  let checked = 0;
  const pdfs = [];
  try {
    for (const id of selectedIds) for (const difficulty of difficulties) for (const width of [1280, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", e => errors.push(e.message));
      await page.goto(`${base}?type=${id}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded" });
      await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
      await page.evaluate(() => document.fonts.ready);
      for (const phase of ["problem", "solution"]) {
        if (phase === "solution") await page.locator("#solutionTab").click();
        const result = await page.evaluate(({ phase, id }) => {
          const root = document.querySelector(phase === "problem" ? "#problemView" : "#solutionView");
          const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
          const labelFailures = [];
          for (const svg of root.querySelectorAll(".e6-geometry")) {
            const bounds = svg.getBoundingClientRect();
            const labels = [...svg.querySelectorAll("text")];
            for (const label of labels) {
              const r = label.getBoundingClientRect();
              if (r.left < bounds.left - 1 || r.right > bounds.right + 1 || r.top < bounds.top - 1 || r.bottom > bounds.bottom + 1) labelFailures.push(`잘림: ${label.textContent}`);
              if (+getComputedStyle(label).fontWeight > 500) labelFailures.push(`굵기: ${label.textContent}`);
              for (const shape of svg.querySelectorAll("path:not(.e6-guide), line:not(.e6-guide), rect, circle")) {
                if (shape.dataset.ownerId === label.dataset.labelFor || !shape.getTotalLength) continue;
                const length = shape.getTotalLength(), transform = shape.getScreenCTM();
                for (let sample = 0; sample <= 160; sample++) {
                  const position = shape.getPointAtLength(length * sample / 160);
                  const point = new DOMPoint(position.x, position.y).matrixTransform(transform);
                  if (point.x > r.left + 1 && point.x < r.right - 1 && point.y > r.top + 1 && point.y < r.bottom - 1) {
                    labelFailures.push(`선 겹침: ${label.textContent}/${shape.dataset.ownerId || shape.tagName}`);
                    break;
                  }
                }
              }
            }
            labels.forEach((a, i) => labels.slice(i + 1).forEach(b => {
              const x = rect(a), y = rect(b);
              if (Math.min(x.x + x.w, y.x + y.w) - Math.max(x.x, y.x) > 1 && Math.min(x.y + x.h, y.y + y.h) - Math.max(x.y, y.y) > 1) labelFailures.push(`겹침: ${a.textContent}/${b.textContent}`);
            }));
          }
          return { count: root.querySelectorAll(phase === "problem" ? ".question-item" : ".solution-item").length,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            rowOverflow: [...root.querySelectorAll(".source61-math-row, .problem-table")].some(row => row.scrollWidth > row.clientWidth + 1),
            leaks: phase === "problem" && !!root.querySelector("[data-phase=answer], .source61-math-board"),
            answers: root.querySelectorAll(`[data-answer-source="${id}"]`).length,
            diagrams: root.querySelectorAll(".e6-geometry").length, labelFailures };
        }, { phase, id });
        assert.equal(result.count, 3, `${id}/${difficulty}/${width}/${phase}: 3문항`);
        assert(!result.overflow && !result.rowOverflow && !result.leaks, `${id}/${difficulty}/${width}/${phase}: ${JSON.stringify(result)}`);
        assert.deepEqual(result.labelFailures, [], `${id}/${difficulty}/${width}/${phase}`);
        if (phase === "solution") assert.equal(result.answers, 3);
        const geometry = id.endsWith("exploration-1") || id.endsWith("example-3");
        assert.equal(result.diagrams, geometry ? 3 : 0, "원문에만 있는 그림");
        if (width !== 320 && (difficulty === 0 || geometry)) await page.screenshot({ path: path.join(output, `${id}-d${difficulty}-${width}-${phase}.png`), fullPage: true });
        if (width === 1280 && difficulty === 0) {
          await page.emulateMedia({ media: "print" });
          const file = path.join(output, `${id}-${phase}-a4.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          const pages = pageCount(file);
          assert(pages >= 1 && pages <= 2, `${id}/${phase}: ${pages}장`);
          pdfs.push({ id, phase, pages });
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
      checked++;
      if (checked % 9 === 0) console.log(`검수 ${checked}개 상태 완료: ${id}`);
    }
  } finally { await browser.close(); }
  assert.deepEqual(assetHashes(), startHashes, "검사 중 코드가 변경되어 결과를 다시 확인해야 합니다.");
  fs.writeFileSync(path.join(output, "browser-result.json"), JSON.stringify({ checked, pdfs, assetHashes: startHashes }, null, 2));
  console.log(`E6 ${selectedIds.length}유형 ${checked}개 PC/390px/320px 상태, 문제/풀이 및 ${pdfs.length}개 A4 검사 통과`);
})().catch(e => { console.error(e.stack); process.exitCode = 1; });
