"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const pdfJsPath = process.env.HSE_PDFJS_PATH
  || path.join(path.dirname(playwrightPath), "pdfjs-dist", "legacy", "build", "pdf.mjs");

const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-source-4-2-perpendicular-parallel-browser-audit");
const failures = [];
let screenStates = 0;
let pdfFiles = 0;

global.window = {};
require("./curriculum.js");
require("./generators.js");
const moduleApi = require("./source-4-2-perpendicular-parallel.js");

const allTypes = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units || [])
  .flatMap(unit => unit.subunits || [])
  .flatMap(subunit => subunit.types || []);
const types = moduleApi.SOURCE_IDS.map(sourceItemId => allTypes.find(type => type.sourceItemId === sourceItemId));

const fail = message => failures.push(message);
const safePath = urlPath => {
  const relative = decodeURIComponent(String(urlPath || "/").split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(repoRoot + path.sep) ? file : null;
};
const contentType = file => ({
  ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml"
})[path.extname(file)] || "application/octet-stream";

async function startReadOnlyServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url);
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType(file), "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

let pdfJsPromise;
async function inspectPdf(pdfPath, label, typeName) {
  if (!pdfJsPromise) pdfJsPromise = import(pathToFileURL(pdfJsPath).href);
  const pdfJs = await pdfJsPromise;
  const document = await pdfJs.getDocument({ data: new Uint8Array(fs.readFileSync(pdfPath)) }).promise;
  if (document.numPages < 1 || document.numPages > 4) fail(`${label}: A4가 ${document.numPages}쪽으로 나뉘었습니다.`);
  let joined = "";
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(" ");
    joined += ` ${text}`;
    if (text.replace(/LETE-ON|문제|정답|풀이|\s/g, "").length < 30) fail(`${label} ${pageNumber}쪽: 내용 없는 인쇄 쪽입니다.`);
  }
  const normalized = joined.replace(/\s/g, "");
  const target = String(typeName || "").replace(/\s/g, "");
  if (target && normalized.split(target).length - 1 !== 3) fail(`${label}: 유형명이 3번 들어가지 않아 세 문제가 모두 인쇄되었는지 확인할 수 없습니다.`);
}

async function inspectView(page, selector, sourceItemId, label) {
  const state = await page.evaluate(({ selector, sourceItemId }) => {
    const compact = value => String(value || "").replace(/\s+/g, " ").trim();
    const intersects = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1.5
      && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1.5;
    const inside = (point, rect, gap = 1.25) => point.x >= rect.left - gap && point.x <= rect.right + gap
      && point.y >= rect.top - gap && point.y <= rect.bottom + gap;
    const screenPoint = (element, x, y) => {
      const point = element.ownerSVGElement.createSVGPoint();
      point.x = x;
      point.y = y;
      return point.matrixTransform(element.getScreenCTM());
    };
    const sampleShape = element => {
      const tag = element.tagName.toLowerCase();
      if (tag === "line") {
        const a = screenPoint(element, Number(element.getAttribute("x1")), Number(element.getAttribute("y1")));
        const b = screenPoint(element, Number(element.getAttribute("x2")), Number(element.getAttribute("y2")));
        return Array.from({ length: 61 }, (_, index) => ({ x: a.x + (b.x - a.x) * index / 60, y: a.y + (b.y - a.y) * index / 60 }));
      }
      if (tag === "path" && typeof element.getTotalLength === "function") {
        const length = element.getTotalLength();
        const count = Math.max(18, Math.ceil(length / 2));
        return Array.from({ length: count + 1 }, (_, index) => {
          const point = element.getPointAtLength(length * index / count);
          return screenPoint(element, point.x, point.y);
        });
      }
      if (tag === "polyline") {
        const points = [...element.points].map(point => screenPoint(element, point.x, point.y));
        const samples = [];
        for (let index = 0; index < points.length - 1; index += 1) {
          const a = points[index];
          const b = points[index + 1];
          const count = Math.max(3, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
          for (let step = 0; step <= count; step += 1) samples.push({ x: a.x + (b.x - a.x) * step / count, y: a.y + (b.y - a.y) * step / count });
        }
        return samples;
      }
      return [];
    };
    const nodes = [...document.querySelectorAll(selector)];
    return {
      documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      bodyText: compact(document.body.innerText),
      items: nodes.map(node => {
        const svg = node.querySelector("svg.source42-pp");
        const svgBox = svg?.getBoundingClientRect();
        const itemBox = node.getBoundingClientRect();
        const viewBox = svg?.viewBox?.baseVal;
        const textNodes = svg ? [...svg.querySelectorAll("text")].map(text => ({ text: compact(text.textContent), box: text.getBoundingClientRect(), local: text.getBBox(), style: getComputedStyle(text), overlapAllowed: text.hasAttribute("data-layout-overlap-ok") })) : [];
        const shapes = svg ? [...svg.querySelectorAll("line,path,polyline")].filter(shape => !shape.matches("[data-layout-ignore], [data-layout-overlap-ok]")) : [];
        const overlaps = [];
        for (let first = 0; first < textNodes.length; first += 1) {
          for (let second = first + 1; second < textNodes.length; second += 1) {
            if (intersects(textNodes[first].box, textNodes[second].box)) overlaps.push(`${textNodes[first].text}/${textNodes[second].text}`);
          }
        }
        const strokeOverlaps = textNodes.flatMap(text => text.overlapAllowed ? [] : shapes
          .filter(shape => sampleShape(shape).some(point => inside(point, text.box)))
          .map(shape => `${text.text}/${shape.getAttribute("class") || shape.tagName.toLowerCase()}`));
        const graphicsOutside = svg ? [...svg.querySelectorAll("line,path,polyline,circle,text")].filter(element => {
          const box = element.getBBox();
          return box.x < (viewBox?.x || 0) - 3 || box.y < (viewBox?.y || 0) - 3
            || box.x + box.width > (viewBox?.x || 0) + (viewBox?.width || 0) + 3
            || box.y + box.height > (viewBox?.y || 0) + (viewBox?.height || 0) + 3;
        }).map(element => `${element.tagName}:${compact(element.textContent)}`) : ["svg 없음"];
        const lines = svg ? [...svg.querySelectorAll(".pp-line,.pp-dimension,.pp-right,.pp-answer,.pp-guide")].map(element => {
          const style = getComputedStyle(element);
          return { stroke: style.stroke, width: Number.parseFloat(style.strokeWidth) };
        }) : [];
        const textsClear = textNodes.every(item => item.text && item.style.fill === "rgb(17, 17, 17)" && item.style.stroke === "none" && item.box.height >= 10.5);
        return {
          sourceItemId: svg?.getAttribute("data-source-item") || "",
          phase: svg?.getAttribute("data-phase") || "",
          svgVisible: Boolean(svgBox && svgBox.width >= Math.min(280, innerWidth - 40) && svgBox.height >= 145),
          svgInside: Boolean(svgBox && svgBox.left >= itemBox.left - 2 && svgBox.right <= itemBox.right + 2),
          overflow: node.scrollWidth > node.clientWidth + 1,
          graphicsOutside,
          overlaps,
          strokeOverlaps,
          linesClear: lines.length > 0 && lines.every(line => line.stroke === "rgb(34, 34, 34)" || line.stroke === "rgb(17, 17, 17)" || line.stroke === "rgb(102, 102, 102)") && lines.every(line => line.width >= 0.8 && line.width <= 2.1),
          textsClear,
          badText: /undefined|null|NaN|Infinity/.test(compact(node.innerText)),
          expectedSource: sourceItemId
        };
      })
    };
  }, { selector, sourceItemId });

  if (state.documentOverflow) fail(`${label}: 문서 가로 넘침이 있습니다.`);
  if (state.items.length !== 3) fail(`${label}: 문항이 ${state.items.length}개입니다.`);
  state.items.forEach((item, index) => {
    if (item.sourceItemId !== sourceItemId) fail(`${label} ${index + 1}번: 원문 ID가 ${item.sourceItemId || "없음"}입니다.`);
    if (!item.svgVisible || !item.svgInside || item.overflow) fail(`${label} ${index + 1}번: 도형이 작거나 문항 밖으로 잘립니다.`);
    if (item.graphicsOutside.length) fail(`${label} ${index + 1}번: SVG 밖으로 나간 요소 ${item.graphicsOutside.slice(0, 4).join(", ")}`);
    if (item.overlaps.length) fail(`${label} ${index + 1}번: 그림 글자 겹침 ${item.overlaps.slice(0, 4).join(", ")}`);
    if (item.strokeOverlaps.length) fail(`${label} ${index + 1}번: 글자와 선 겹침 ${item.strokeOverlaps.slice(0, 4).join(", ")}`);
    if (!item.linesClear || !item.textsClear) fail(`${label} ${index + 1}번: 선 굵기·검정색·글꼴 기준이 다릅니다.`);
    if (item.badText) fail(`${label} ${index + 1}번: 잘못된 값이 보입니다.`);
  });
}

async function inspectType(browser, baseUrl, type, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(90000);
  page.on("pageerror", error => fail(`${type.id}/${viewportLabel}: 브라우저 오류 ${error.message}`));
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });

  const problemLabel = `${type.sourceItemId}-${viewportLabel}-problem`;
  await inspectView(page, "#problemView .question-item", type.sourceItemId, problemLabel);
  await page.screenshot({ path: path.join(outputDir, `${problemLabel}.png`), fullPage: true, timeout: 120000 });
  screenStates += 1;
  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const pdfPath = path.join(outputDir, `${problemLabel}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    pdfFiles += 1;
    await inspectPdf(pdfPath, problemLabel, type.name);
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
  const solutionLabel = `${type.sourceItemId}-${viewportLabel}-solution`;
  await inspectView(page, "#solutionView .solution-item", type.sourceItemId, solutionLabel);
  const answerCount = await page.locator("#solutionView .verified-answer-diagram").count();
  if (answerCount !== 3) fail(`${solutionLabel}: 정답 그림이 ${answerCount}개입니다.`);
  await page.screenshot({ path: path.join(outputDir, `${solutionLabel}.png`), fullPage: true, timeout: 120000 });
  screenStates += 1;
  if (viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    const pdfPath = path.join(outputDir, `${solutionLabel}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" } });
    pdfFiles += 1;
    await inspectPdf(pdfPath, solutionLabel, type.name);
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (types.length !== 10 || types.some(type => !type || type.reviewLocked)) fail("공개할 수선과 평행선 10유형이 런타임에 없습니다.");
  const { server, baseUrl } = await startReadOnlyServer();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const type of types) {
      await inspectType(browser, baseUrl, type, { width: 1280, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, type, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (failures.length) throw new Error(failures.slice(0, 80).join("\n"));
  console.log(`4-2 수선과 평행선 브라우저·인쇄 감사 통과: 10유형 · PC/390px 문제·풀이 ${screenStates}상태 · A4 ${pdfFiles}파일 · ${outputDir}`);
})().catch(error => {
  console.error(`4-2 수선과 평행선 브라우저·인쇄 감사 실패\n${error.stack || error}`);
  process.exit(1);
});
