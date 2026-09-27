"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const runtime = path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || path.join(runtime, "playwright"));
const output = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-worksheet-tools-audit");
const root = path.resolve(__dirname, "../..");
const pdfjsPath = process.env.HSE_PDFJS_PATH || path.join(runtime, "pdfjs-dist", "legacy", "build", "pdf.mjs");

function createServer() {
  return http.createServer((request, response) => {
    const relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const target = path.resolve(root, "." + relative + (relative.endsWith("/") ? "index.html" : ""));
    if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    fs.readFile(target, (error, bytes) => {
      if (error) { response.writeHead(404).end(); return; }
      response.setHeader("Content-Type", ({ ".html": "text/html", ".js": "text/javascript", ".css": "text/css" })[path.extname(target)] || "application/octet-stream");
      response.end(bytes);
    });
  });
}

async function setPrintMode(page, mode) {
  await page.evaluate(printMode => {
    document.body.dataset.printMode = printMode;
    document.querySelector("#problemView").hidden = printMode === "answer-key" || printMode === "solution";
    document.querySelector("#solutionView").hidden = printMode === "problem" || printMode === "answer-key";
    document.querySelector("#answerKeyView").hidden = printMode !== "answer-key";
  }, mode);
}

async function printVisibility(page) {
  return page.evaluate(() => {
    const visible = selector => getComputedStyle(document.querySelector(selector)).display !== "none";
    return {
      problem: visible("#problemView"),
      solution: visible("#solutionView"),
      answerKey: visible("#answerKeyView"),
      answerKeyPrompts: document.querySelectorAll("#answerKeyView .question-prompt").length,
      answerKeySolutions: document.querySelectorAll("#answerKeyView .solution-item, #answerKeyView .solution-viewer-solution").length
    };
  });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/hselementary/question-bank/?type=4-2-u4-t2-7&review=1`);
    await page.locator("#worksheet").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("#printMenuList").evaluate(element => getComputedStyle(element).display), "none", "closed print menu must be hidden");
    assert.equal(await page.locator("#printMenuList [data-print-mode]").count(), 4, "four print choices are required");
    await page.locator("#solutionViewerButton").click();
    await page.locator("#solutionViewer").waitFor({ state: "visible" });
    assert.equal(await page.locator("#solutionViewerJump button").count(), 3, "viewer needs every generated question");
    assert(await page.locator("#solutionViewerContent").innerText().then(text => text.includes("정답:")), "viewer needs the answer");
    assert(await page.locator("#solutionViewerContent .solution-viewer-answer-visual").count() > 0, "viewer needs answerVisual when supplied");
    await page.locator("#solutionViewerNext").click();
    assert.equal(await page.locator("#solutionViewerPosition").innerText(), "2 / 3", "next navigation");
    await page.locator("#solutionViewerPrevious").click();
    assert.equal(await page.locator("#solutionViewerPosition").innerText(), "1 / 3", "previous navigation");
    await page.locator('#solutionViewerJump button[data-solution-index="2"]').click();
    assert.equal(await page.locator("#solutionViewerPosition").innerText(), "3 / 3", "question jump navigation");
    await page.keyboard.press("Escape");
    await page.locator("#solutionViewer").waitFor({ state: "hidden" });
    await page.screenshot({ path: path.join(output, "desktop-tools.png"), fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#solutionViewerButton").click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "mobile overflow");
    await page.screenshot({ path: path.join(output, "mobile-viewer.png"), fullPage: true });
    await page.keyboard.press("Escape");

    await page.setViewportSize({ width: 794, height: 1123 });
    await page.emulateMedia({ media: "print" });
    const pdfjs = await import(pathToFileURL(pdfjsPath));
    for (const mode of ["problem", "answer-key", "solution", "all"]) {
      await setPrintMode(page, mode);
      const visibility = await printVisibility(page);
      if (mode === "problem") {
        assert.deepEqual(visibility, { problem: true, solution: false, answerKey: false, answerKeyPrompts: 0, answerKeySolutions: 0 }, "problem-only computed print visibility");
      }
      if (mode === "answer-key") {
        assert.deepEqual(visibility, { problem: false, solution: false, answerKey: true, answerKeyPrompts: 0, answerKeySolutions: 0 }, "answer-key computed print visibility");
      }
      if (mode === "solution") {
        assert.equal(visibility.problem, false, "solution print must hide problems");
        assert.equal(visibility.solution, true, "solution print must show solutions");
        assert.equal(visibility.answerKey, false, "solution print must hide answer key");
      }
      if (mode === "all") {
        assert.equal(visibility.problem, true, "all print must show problems");
        assert.equal(visibility.solution, true, "all print must show solutions");
        assert.equal(visibility.answerKey, false, "all print must hide answer key");
      }
      const pdfPath = path.join(output, `${mode}.pdf`);
      await page.pdf({ path: pdfPath, format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
      let text = "";
      for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
        const content = await (await pdf.getPage(pageIndex)).getTextContent();
        text += content.items.map(item => item.str).join(" ");
      }
      await pdf.destroy();
      if (mode === "problem") {
        assert(!text.includes("정답·풀이"), "problem-only print leaked solution heading");
        assert(!text.includes("정답표"), "problem-only print leaked answer key");
      }
      if (mode === "answer-key") {
        assert(text.includes("정답표"), "answer-key print is missing its title");
        assert(!text.includes("그림에서 직선"), "answer-key print leaked question body");
        assert(!text.includes("세 각은 한 평각"), "answer-key print leaked explanation");
      }
      if (mode === "solution") assert(text.includes("정답·풀이"), "solution print is missing solutions");
      if (mode === "all") assert(text.includes("문제 1") && text.includes("정답·풀이"), "all print needs both sections");
    }
    assert.deepEqual(pageErrors, []);
    console.log("Worksheet tools passed: desktop, 390px viewer, and four A4 print modes.");
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
