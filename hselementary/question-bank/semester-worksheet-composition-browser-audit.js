"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const runtime = path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || path.join(runtime, "playwright"));
const output = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-semester-composition");
const root = path.resolve(__dirname, "../..");

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

  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));

  try {
    const url = `http://127.0.0.1:${server.address().port}/hselementary/question-bank/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.locator("input[data-select-scope='semester']").check();
    assert.equal(await page.locator("#selectedTypeCount").textContent(), "309");

    await page.locator("button[data-count='120']").click();
    await page.locator("#questionCountInput").fill("130");
    assert.equal(await page.locator("#questionCountInput").inputValue(), "120");
    await page.locator("button[data-difficulty-mode='ratio']").click();
    await page.locator("input[data-difficulty-ratio='0']").fill("55");
    assert.equal(await page.locator("#generateButton").isDisabled(), true);
    assert.equal(await page.locator("#difficultyRatioError").isVisible(), true);
    await page.locator("input[data-difficulty-ratio='1']").fill("25");
    assert.equal(await page.locator("#difficultyRatioTotal").textContent(), "100%");
    assert.equal(await page.locator("#generateButton").isDisabled(), false);
    await page.locator(".composition-pane").screenshot({ path: path.join(output, "ratio-desktop.png") });

    await page.setViewportSize({ width: 390, height: 900 });
    await page.locator(".composition-pane").scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.locator(".composition-pane").screenshot({ path: path.join(output, "ratio-mobile.png") });
    await page.setViewportSize({ width: 1440, height: 1100 });

    await page.locator("#generateButton").click();
    await page.waitForSelector("#problemView .question-item");
    assert.equal(await page.locator("#problemView .question-item").count(), 120);

    const snapshot = await page.locator("#problemView .question-item").evaluateAll(items => {
      const normalizedStructure = item => {
        const prompt = item.querySelector(".question-prompt");
        const text = (prompt?.innerText || "")
          .replace(/[0-9０-９][0-9０-９,.\/%°]*/g, "#")
          .replace(/\s+/g, " ")
          .trim();
        const classes = [...new Set([...(prompt?.querySelectorAll("[class]") || [])]
          .flatMap(node => [...node.classList])
          .filter(name => /graph|chart|diagram|table|card|sequence|grid/.test(name)))]
          .sort();
        return `${text}|${classes.join(",")}`;
      };
      return items.map(item => ({
        number: Number(item.id.replace("question-", "")),
        typeId: item.dataset.typeId,
        sourceItemId: item.dataset.sourceItemId,
        title: item.querySelector("header span")?.textContent.trim(),
        difficulty: item.querySelector("header em")?.textContent.trim(),
        structure: normalizedStructure(item),
        hasBarGraph: Boolean(item.querySelector(".source41-bar-graph"))
      }));
    });
    const difficultyCounts = Object.fromEntries(["조금 쉬운", "같은 난이도", "조금 어려운"].map(label => [label, snapshot.filter(item => item.difficulty === label).length]));
    assert.deepEqual(difficultyCounts, { "조금 쉬운": 24, "같은 난이도": 66, "조금 어려운": 30 });

    const five = snapshot.find(item => item.number === 5);
    const eleven = snapshot.find(item => item.number === 11);
    assert.equal(five.sourceItemId, "4-1-u5-e1-exploration");
    assert.equal(eleven.sourceItemId, "4-1-u5-e1-example-1-1");
    assert.equal(five.hasBarGraph, true);
    assert.equal(eleven.hasBarGraph, false);

    const structures = new Map();
    snapshot.forEach(item => {
      const group = structures.get(item.structure) || [];
      group.push(item);
      structures.set(item.structure, group);
    });
    const repeats = [...structures.values()].filter(group => new Set(group.map(item => item.typeId)).size > 1);
    assert.deepEqual(repeats, []);
    await page.locator("#question-5").screenshot({ path: path.join(output, "question-5.png") });
    await page.locator("#question-11").screenshot({ path: path.join(output, "question-11.png") });

    await page.locator("#solutionTab").click();
    assert.equal(await page.locator(".classification-detail tbody tr").count(), 120);
    assert.equal(await page.locator(".classification-matrix tbody tr").count(), 4);
    const stageCounts = await page.locator(".classification-matrix tbody tr").evaluateAll(rows => [1, 2, 3].map(column => rows.reduce((sum, row) => sum + (row.cells[column].textContent.trim() === "-" ? 0 : row.cells[column].textContent.split(",").length), 0)));
    assert(stageCounts.every(count => count > 0));

    await page.emulateMedia({ media: "print" });
    const pdfPath = path.join(output, "semester-120-solutions.pdf");
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
    const pdfjs = await import(pathToFileURL(process.env.HSE_PDFJS_PATH || path.join(runtime, "pdfjs-dist/legacy/build/pdf.mjs")));
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
    const pdfPageCount = pdf.numPages;
    assert(pdfPageCount > 1);
    const firstPageText = (await (await pdf.getPage(1)).getTextContent()).items.map(item => item.str).join(" ");
    assert(firstPageText.includes("이원목적분류표"));
    assert(firstPageText.includes("120문항"));
    await pdf.destroy();
    assert.deepEqual(errors, []);

    fs.writeFileSync(path.join(output, "summary.json"), JSON.stringify({ questionCount: snapshot.length, difficultyCounts, five, eleven, repeatedStructures: repeats.length }, null, 2));
    console.log(`학기 연습지 구성 감사 통과: 120문항 · 비율 24/66/30 · 중복 구조 0 · PDF ${pdfPageCount}쪽`);
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
