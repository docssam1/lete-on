#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? path.resolve(process.argv[index + 1]) : null;
}
function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".json")) return "application/json; charset=utf-8";
  return "text/javascript; charset=utf-8";
}
function assertFile(file, label) {
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`${label}_MISSING`);
}
async function fillVerifiedAnswers(page, pack) {
  for (let number = 1; number <= 15; number += 1) {
    const value = pack.items[number - 1].privateScoring.answerValue;
    await page.locator(`label:has(input[name=q${number}][value=${value}])`).click();
  }
  for (let number = 16; number <= 25; number += 1) {
    await page.locator(`input[name=q${number}]`).fill(pack.items[number - 1].privateScoring.answerValue);
  }
}

async function main() {
  const packFile = argument("--pack");
  const paperFile = argument("--paper");
  const outputRoot = argument("--out");
  assertFile(packFile, "PACK");
  assertFile(paperFile, "PAPER");
  if (!outputRoot) throw new Error("OUTPUT_ROOT_MISSING");
  fs.mkdirSync(outputRoot, { recursive: true });
  const pack = JSON.parse(fs.readFileSync(packFile, "utf8"));
  const repositoryRoot = path.resolve(__dirname, "..", "..");
  const server = http.createServer(function (request, response) {
    const file = path.resolve(repositoryRoot, `.${decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname)}`);
    if (!file.startsWith(repositoryRoot) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
    response.writeHead(200, { "content-type": contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  const baseUrl = `http://127.0.0.1:${server.address().port}/boarding-school-math/sasmo-real-paper.html`;
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await desktop.goto(baseUrl, { waitUntil: "networkidle" });
    await desktop.locator(".intro-shell").screenshot({ path: path.join(outputRoot, "desktop-intro.png") });
    await desktop.locator("#paper-file").setInputFiles(paperFile);
    await desktop.locator("#pack-file").setInputFiles(packFile);
    await desktop.locator("#source-state[data-state=ready]").waitFor();
    await desktop.locator("#pdf-stage[data-ready=true]").waitFor();
    await desktop.locator(".diagnostic-layout").screenshot({ path: path.join(outputRoot, "desktop-diagnostic.png") });
    await fillVerifiedAnswers(desktop, pack);
    await desktop.locator("#score-button").click();
    await desktop.locator("#results:not([hidden])").waitFor();
    await desktop.locator("#results").screenshot({ path: path.join(outputRoot, "desktop-results.png") });
    const printPath = path.join(outputRoot, "a4-results.pdf");
    await desktop.pdf({ path: printPath, format: "A4", printBackground: true, preferCSSPageSize: true });
    const printPageCount = await desktop.evaluate(async function (encoded) {
      const bytes = Uint8Array.from(atob(encoded), function (character) { return character.charCodeAt(0); });
      const printed = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      const count = printed.numPages;
      await printed.destroy();
      return count;
    }, fs.readFileSync(printPath).toString("base64"));
    if (printPageCount !== 1) throw new Error(`A4_REPORT_PAGE_COUNT_${printPageCount}`);
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await mobile.goto(baseUrl, { waitUntil: "networkidle" });
    await mobile.locator(".intro-shell").screenshot({ path: path.join(outputRoot, "mobile-intro.png") });
    await mobile.locator("#paper-file").setInputFiles(paperFile);
    await mobile.locator("#pack-file").setInputFiles(packFile);
    await mobile.locator("#source-state[data-state=ready]").waitFor();
    await mobile.locator(".answer-panel").screenshot({ path: path.join(outputRoot, "mobile-omr.png") });
    await mobile.locator("label:has(input[name=q1][value=" + pack.items[0].privateScoring.answerValue + "])").click();
    await mobile.locator("#score-button").click();
    await mobile.locator("#results:not([hidden])").waitFor();
    await mobile.locator("#results").screenshot({ path: path.join(outputRoot, "mobile-results.png") });
    const overflow = await mobile.evaluate(function () { return document.documentElement.scrollWidth - window.innerWidth; });
    if (overflow > 0) throw new Error(`MOBILE_HORIZONTAL_OVERFLOW_${overflow}`);
    console.log(JSON.stringify({ status: "PASS", outputRoot, desktop: ["desktop-intro.png", "desktop-diagnostic.png", "desktop-results.png"], mobile: ["mobile-intro.png", "mobile-omr.png", "mobile-results.png"], print: "a4-results.pdf", printPageCount, mobileOverflow: overflow }));
  } finally {
    await browser.close();
    await new Promise(function (resolve) { server.close(resolve); });
  }
}

main().catch(function (error) { console.error(`FAIL sasmo real-paper QA: ${error.message}`); process.exitCode = 2; });
