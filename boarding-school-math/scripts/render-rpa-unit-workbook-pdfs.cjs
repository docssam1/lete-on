"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const siteRoot = path.resolve(__dirname, "..", "..");
const outputDir = process.env.GFIELD_PDF_OUTPUT_DIR;
if (!outputDir) throw new Error("GFIELD_PDF_OUTPUT_DIR is required");

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

async function render(page, baseUrl, options) {
  await page.goto(baseUrl + "?" + new URLSearchParams({
    cluster:"6.RP.A",
    mode:"workbook",
    audience:options.audience,
    locale:options.locale,
    paper:options.paper
  }), { waitUntil:"networkidle" });
  await page.waitForFunction(function () { return document.getElementById("print-book").dataset.ready === "true"; });
  await page.emulateMedia({ media:"print" });
  await page.pdf({ path:options.output, format:options.paper, printBackground:true, preferCSSPageSize:true, margin:{top:"0",right:"0",bottom:"0",left:"0"} });
}

(async function () {
  fs.mkdirSync(outputDir, { recursive:true });
  const server = http.createServer(function (request,response) {
    const file = path.resolve(siteRoot, "." + decodeURIComponent(request.url.split("?")[0]));
    if (!file.startsWith(siteRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      response.writeHead(404); response.end("Not found"); return;
    }
    response.writeHead(200, { "content-type":contentType(file) });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0,"127.0.0.1",resolve); });
  const baseUrl = "http://127.0.0.1:" + server.address().port + "/boarding-school-math/unit-workbook.html";
  const browser = await chromium.launch({ headless:true });
  try {
    await render(await browser.newPage({ viewport:{width:1280,height:900} }), baseUrl, {
      audience:"student", locale:"ko", paper:"A4",
      output:path.join(outputDir,"gfield-grade6-rpa-student-ko-a4.pdf")
    });
    await render(await browser.newPage({ viewport:{width:1280,height:900} }), baseUrl, {
      audience:"teacher", locale:"zh-Hans", paper:"Letter",
      output:path.join(outputDir,"gfield-grade6-rpa-teacher-zh-letter.pdf")
    });
  } finally {
    await browser.close();
    await new Promise(function (resolve) { server.close(resolve); });
  }
  process.stdout.write(JSON.stringify({ outputDir:outputDir, files:fs.readdirSync(outputDir).filter(function (name) { return name.endsWith(".pdf"); }) },null,2));
})().catch(function (error) { console.error(error); process.exitCode=1; });
