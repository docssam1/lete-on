"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { chromium } = require("playwright");
const ids = ["exploration-1", "exploration-2", "example-1", "example-2", "example-4", "mission-1", "mission-2", "mission-3", "mission-4", "mission-6"].map(s => `6-2-u2-e3-${s}`);
const chosen = process.env.HSE_TYPE_FILTER ? ids.filter(id => process.env.HSE_TYPE_FILTER.split(",").includes(id)) : ids;
const levels = process.env.HSE_DIFFICULTY_FILTER ? process.env.HSE_DIFFICULTY_FILTER.split(",").map(Number) : [-1, 0, 1];
assert(chosen.length && levels.every(d => [-1, 0, 1].includes(d)));
const output = process.env.HSE_SCREENSHOT_DIR;
assert(output && /^[EG]:[/\\]/i.test(output), "검수 결과는 E: 또는 G:에 저장합니다.");
fs.mkdirSync(output, { recursive: true });
const assets = ["index.html", "generators.js", "source-6-2-decimal-e3.js", "source-6-2-decimal-e3.css", "source-6-2-e3-digit-count.css", "source-6-2-e3-card-maximum.css", "source-inventory-grade6.js", "app.js"];
const hashes = () => Object.fromEntries(assets.map(f => [f, crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, f))).digest("hex")]));
const initial = hashes();
const base = process.env.HSE_BASE_URL || "http://127.0.0.1:8897/hselementary/question-bank/";
const pages = file => Number(execFileSync(process.env.HSE_PDFINFO_EXECUTABLE || "pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)[1]);
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE });
  let checked = 0;
  const pdfs = [];
  try {
    for (const id of chosen) for (const difficulty of levels) for (const width of [1280, 390, 320]) {
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
          for (const expression of root.querySelectorAll(".math-inline-expression, .source62-e3-digit-expression, .source62-card-max__expression")) {
            const r = expression.getBoundingClientRect(), p = expression.closest(".question-item, .solution-item").getBoundingClientRect();
            if (r.left < p.left - 1 || r.right > p.right + 1 || expression.getClientRects().length !== 1) failures.push(`수식 잘림/줄바꿈: ${expression.textContent}`);
          }
          for (const el of root.querySelectorAll(".source62-e3-answer-table th, .source62-e3-answer-table td, .source62-e3-digit-expression, .source62-card-max__card, .source62-card-max__expression")) {
            const style = getComputedStyle(el);
            if (+style.fontWeight > 500) failures.push(`글씨 굵기: ${el.textContent}`);
            if (!/^rgb\((0|17|32), \1, \1\)$/.test(style.color)) failures.push(`글씨 색: ${el.textContent}/${style.color}`);
          }
          return {
            count: root.querySelectorAll(phase === "problem" ? ".question-item" : ".solution-item").length,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            innerOverflow: [...root.querySelectorAll(".source62-e3-answer-table, .source62-e3-digit-grid, .source62-card-max__cards")].some(el => el.scrollWidth > el.clientWidth + 1),
            answers: root.querySelectorAll(`[data-answer-source="${id}"]`).length,
            cards: root.querySelectorAll("[data-card-digit]").length,
            figures: root.querySelectorAll("svg, img, canvas").length,
            leak: phase === "problem" && !!root.querySelector("[data-answer-source], [data-matches], [data-phase=answer]"), failures
          };
        }, { id, phase });
        assert.equal(state.count, 3, `${id}/${difficulty}/${width}/${phase}: 서로 다른 고정 문항 세 개`);
        assert(!state.overflow && !state.innerOverflow && !state.leak, `${id}/${difficulty}/${width}/${phase}: ${JSON.stringify(state)}`);
        assert.equal(state.figures, 0, "원문에 없는 설명 그림을 추가하지 않음");
        assert.equal(state.cards, phase === "problem" && id.endsWith("mission-2") ? 18 : 0);
        assert.equal(state.answers, phase === "solution" ? 3 : 0);
        assert.deepEqual(state.failures, [], `${id}/${difficulty}/${width}/${phase}`);
        if (width !== 320 && difficulty !== -1) await page.screenshot({ path: path.join(output, `${id}-d${difficulty}-${width}-${phase}.png`), fullPage: true });
        if (width === 1280) {
          await page.emulateMedia({ media: "print" });
          const file = path.join(output, `${id}-d${difficulty}-${phase}-a4.pdf`);
          await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
          const count = pages(file);
          assert(count >= 1 && count <= (phase === "problem" ? 1 : 2), `${id}/${difficulty}/${phase}: A4 ${count}장`);
          pdfs.push({ id, difficulty, phase, pages: count });
          await page.emulateMedia({ media: "screen" });
        }
      }
      assert.deepEqual(errors, []);
      await page.close();
      checked++;
      if (checked % 9 === 0) console.log(`E3 화면 ${checked}상태 완료: ${id}`);
    }
  } finally { await browser.close(); }
  assert.deepEqual(hashes(), initial, "검사 중 코드가 바뀌면 다시 검수해야 함");
  fs.writeFileSync(path.join(output, "browser-result.json"), JSON.stringify({ checked, pdfs, assetHashes: initial }, null, 2));
  console.log(`E3 ${chosen.length}유형, PC/390px/320px ${checked}상태와 A4 ${pdfs.length}파일 검사 통과`);
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
