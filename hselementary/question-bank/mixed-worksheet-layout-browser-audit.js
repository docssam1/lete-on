"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const runtime = path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || path.join(runtime, "playwright"));
const output = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-mixed-worksheet-layout");
const root = path.resolve(__dirname, "../..");
const errors = [];
const types = [
  ["4", "2", "4-2-u4-t2-7", "평행선과 나란한 선분을 이용해 각 구하기"],
  ["5", "1", "5-1-u4-t3-2", "두 분수 사이를 똑같이 나눈 네 분수 찾기"],
  ["5", "1", "5-1-u4-t4-7", "두 분수 사이에서 분모가 정해진 분수 세기"],
  ["5", "1", "5-1-u4-t4-6", "두 분수 사이에 들어가는 분모의 합 구하기"]
];

async function inspect(page, label, columns) {
  const result = await page.evaluate(() => {
    const box = element => {
      const r = element.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
    };
    const sheets = [...document.querySelectorAll("#problemView .print-page")].map(sheet => ({
      paired: sheet.classList.contains("print-page--paired"),
      columns: getComputedStyle(sheet.querySelector(".question-grid")).gridTemplateColumns.split(" ").length,
      questions: [...sheet.querySelectorAll(".question-item")].map(item => {
        const prompt = item.querySelector(".question-prompt");
        const style = getComputedStyle(prompt);
        const svg = prompt.querySelector(".source42-pa");
        return {
          number: Number(item.querySelector("header b").textContent),
          box: box(item), prompt: box(prompt), answer: box(item.querySelector(".answer-line")),
          overflow: item.scrollWidth > item.clientWidth + 1,
          color: style.color, weight: style.fontWeight, family: style.fontFamily,
          diagram: svg ? box(svg) : null,
          minDiagramText: svg ? Math.min(...[...svg.querySelectorAll("text")].map(text => Number.parseFloat(getComputedStyle(text).fontSize) * svg.getScreenCTM().a)) : null
        };
      })
    }));
    const fractions = [...document.querySelectorAll("#problemView .math-fraction")].map(fraction => {
      const [a, b] = [...fraction.children].map(box);
      return Math.abs((a.left + a.right - b.left - b.right) / 2);
    });
    return { sheets, fractions, answers: document.querySelectorAll('#problemView [data-phase="answer"]').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
  });
  assert.equal(result.overflow, false, `${label}: document overflow`);
  assert.equal(result.answers, 0, `${label}: answer diagram in problem sheet`);
  assert(result.fractions.every(error => error < 1), `${label}: fraction centering`);
  for (const sheet of result.sheets) {
    if (sheet.paired) assert.equal(sheet.columns, columns, `${label}: worksheet columns`);
    for (const item of sheet.questions) {
      assert(!item.overflow, `${label} Q${item.number}: overflow`);
      assert.equal(item.weight, "400", `${label} Q${item.number}: inconsistent body weight`);
      assert.equal(item.color, "rgb(17, 17, 17)", `${label} Q${item.number}: inconsistent body color`);
      assert(item.family.includes("Batang"), `${label} Q${item.number}: inconsistent body font`);
      assert(item.answer.top >= item.prompt.bottom - 1, `${label} Q${item.number}: answer line collision`);
      if (item.diagram) {
        assert(item.diagram.left >= item.box.left - 1 && item.diagram.right <= item.box.right + 1, `${label}: diagram leaves column`);
        assert(item.minDiagramText >= 10, `${label}: diagram labels below 10px`);
      }
    }
    if (sheet.paired && columns === 2) {
      for (let i = 0; i + 1 < sheet.questions.length; i += 2) {
        const [left, right] = sheet.questions.slice(i, i + 2);
        assert(Math.abs(left.box.top - right.box.top) < 1, `${label}: row start mismatch`);
        assert(left.box.right < right.box.left, `${label}: diagram spans both columns`);
        assert(Math.abs(left.answer.bottom - right.answer.bottom) < 1, `${label}: answer lines do not align`);
      }
    }
  }
  return result;
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((request, response) => {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const target = path.resolve(root, "." + relative + (relative.endsWith("/") ? "index.html" : ""));
    if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(target, (error, bytes) => {
      if (error) { response.writeHead(404).end(); return; }
      response.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css" })[path.extname(target)] || "application/octet-stream");
      response.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", error => errors.push(error.message));
  const snapshots = [];
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/hselementary/question-bank/`);
    for (const [grade, term, id, name] of types) {
      await page.locator(`[data-grade="${grade}"]`).click();
      await page.locator(`[data-term="${term}"]`).click();
      await page.locator("#typeSearchInput").fill(name);
      await page.locator(`input[data-type-id="${id}"]`).check();
    }
    await page.locator("#questionCountInput").fill("12");
    await page.locator("#generateButton").click();
    await page.evaluate(() => document.fonts.ready);
    snapshots.push(await inspect(page, "desktop", 2));
    await page.locator("#problemView").screenshot({ path: path.join(output, "mixed-desktop.png") });
    await page.setViewportSize({ width: 390, height: 844 });
    snapshots.push(await inspect(page, "mobile", 1));
    await page.locator("#problemView").screenshot({ path: path.join(output, "mixed-mobile.png") });
    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: "print" });
    snapshots.push(await inspect(page, "A4", 2));
    const pdfPath = path.join(output, "mixed-a4.pdf");
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
    const pdfjs = await import(pathToFileURL(process.env.HSE_PDFJS_PATH || path.join(runtime, "pdfjs-dist/legacy/build/pdf.mjs")));
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
    assert.equal(pdf.numPages, snapshots[2].sheets.length, "PDF inserted a spill/blank page");
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const content = await (await pdf.getPage(i)).getTextContent();
      const text = content.items.map(item => item.str).join(" ");
      assert(text.includes("구하") || text.includes("나타내"), `PDF page ${i}: no substantive question`);
      assert(text.includes("LETE-ON"), `PDF page ${i}: missing watermark`);
    }
    await pdf.destroy();
    assert.equal(snapshots[0].sheets.flatMap(sheet => sheet.questions).length, 12);
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, "mixed-layout-summary.json"), JSON.stringify(snapshots, null, 2));
    console.log(`Mixed worksheet passed: 12 questions, desktop/mobile/A4, ${snapshots[2].sheets.length} PDF pages`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
