const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const outputRoot = path.resolve(__dirname, "..", "..", "tmp", "clinic-practice-qa");
fs.mkdirSync(outputRoot, { recursive: true });

function contentType(file) {
  if (file.endsWith(".html")) return "text/html; charset=utf-8";
  if (file.endsWith(".css")) return "text/css; charset=utf-8";
  if (file.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

(async function () {
  const server = http.createServer(function (request, response) {
    const file = path.resolve(repoRoot, "." + decodeURIComponent(request.url.split("?")[0]));
    if (!file.startsWith(repoRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "content-type": contentType(file) }); fs.createReadStream(file).pipe(response);
  });
  await new Promise(function (resolve) { server.listen(0, "127.0.0.1", resolve); });
  const base = `http://127.0.0.1:${server.address().port}/boarding-school-math/clinic-practice.html`;
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await desktop.goto(`${base}?cluster=6.RP.A&mode=workbook&audience=student&locale=ko`, { waitUntil: "networkidle" });
    await desktop.screenshot({ path: path.join(outputRoot, "student-desktop.png"), fullPage: true });
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 1 });
    await mobile.goto(`${base}?cluster=6.RP.A&mode=workbook&audience=student&locale=en`, { waitUntil: "networkidle" });
    await mobile.screenshot({ path: path.join(outputRoot, "student-mobile.png"), fullPage: true });
    const teacher = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await teacher.goto(`${base}?cluster=6.RP.A&mode=workbook&audience=teacher&locale=zh-Hans`, { waitUntil: "networkidle" });
    await teacher.screenshot({ path: path.join(outputRoot, "teacher-desktop-zh.png"), fullPage: true });
    await teacher.pdf({ path: path.join(outputRoot, "teacher-a4.pdf"), format: "A4", printBackground: true });
    console.log(outputRoot);
  } finally {
    await browser.close(); await new Promise(function (resolve) { server.close(resolve); });
  }
})().catch(function (error) { console.error(error); process.exitCode = 1; });
