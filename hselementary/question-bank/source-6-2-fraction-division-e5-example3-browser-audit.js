"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(questionBankDir, "tmp", "source-6-2-fraction-division-e5-example3-browser-audit");
const sourceItemId = "6-2-u1-e5-example-3";
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const expected = new Map([
  ["7:3:4:3:28:16", { segments: "6:14:8:8", positions: "0:6:20:28:36", answer: "36m" }],
  ["7:4:3:2:34:22", { segments: "8:14:12:10", positions: "0:8:22:34:44", answer: "44m" }],
  ["12:5:8:5:50:25", { segments: "10:24:16:9", positions: "0:10:34:50:59", answer: "59m" }]
]);
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
const fail = message => failures.push(message);

function safePath(urlPath) {
  const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  const file = path.resolve(repoRoot, relative || "index.html");
  return file === repoRoot || file.startsWith(`${repoRoot}${path.sep}`) ? file : null;
}

async function startServer() {
  const server = http.createServer((request, response) => {
    let file = safePath(request.url || "/");
    if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const type = ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}

function inkPixels(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let count = 0;
  for (let offset = 0; offset < png.data.length; offset += 4) {
    if (png.data[offset] < 190 || png.data[offset + 1] < 190 || png.data[offset + 2] < 190) count += 1;
  }
  return count;
}

function renderPdf(pdf, label) {
  const pages = Number(execFileSync("pdfinfo", [pdf], { encoding: "utf8" }).match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
  const prefix = pdf.replace(/\.pdf$/, "-page");
  execFileSync("pdftoppm", ["-png", pdf, prefix], { stdio: "ignore" });
  const rendered = fs.readdirSync(outputDir).filter(name => name.startsWith(path.basename(prefix)) && name.endsWith(".png")).sort();
  if (!pages || rendered.length !== pages) fail(`${label}: A4 ${pages}쪽 중 ${rendered.length}쪽만 렌더했습니다.`);
  for (const name of rendered) {
    const file = path.join(outputDir, name);
    if (fs.statSync(file).size < 15000 || inkPixels(file) < 5000) fail(`${label}: ${name}가 비었거나 수직선이 충분히 인쇄되지 않았습니다.`);
  }
  renderedPages += rendered.length;
}

function overlaps(left, right) {
  return left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1;
}

async function inspect(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(answer => {
    const items = [...document.querySelectorAll(answer ? "#solutionView .solution-item" : "#problemView .question-item")];
    const visible = element => element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
    const outside = element => {
      const box = element?.getBoundingClientRect();
      return !box || box.left < -2 || box.right > document.documentElement.clientWidth + 2 || box.top < -2;
    };
    const rect = element => {
      const box = element?.getBoundingClientRect();
      return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null;
    };
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      answerLeak: answer ? 0 : document.querySelectorAll("#problemView [data-answer-source],#problemView .source62-distance-measure,#problemView .source62-distance-total,#problemView .source62-distance-answer").length,
      items: items.map(item => {
        const svg = item.querySelector(".source62-distance-line");
        const evidence = item.querySelector("[data-source62-fraction-e5-example3-kind]");
        const labels = [...item.querySelectorAll(".source62-distance-point text")];
        const segmentLines = [...item.querySelectorAll(".source62-distance-segment")];
        const measures = [...item.querySelectorAll(".source62-distance-measure")];
        const points = [...item.querySelectorAll(".source62-distance-point")].map(point => ({ label: point.dataset.pointLabel || "", distance: point.dataset.pointDistance || "", transform: point.getAttribute("transform") || "", labelBox: rect(point.querySelector("text")) }));
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          itemVisible: visible(item), itemOutside: outside(item), svgVisible: visible(svg), svgOutside: outside(svg), svgBox: rect(svg), svgOverflow: svg ? svg.scrollWidth > svg.clientWidth + 1 : true,
          structure: svg?.dataset.source62E5Example3Structure || "", signature: svg?.dataset.source62E5Example3Values || "", pointOrder: svg?.dataset.pointOrder || "", segments: svg?.dataset.segmentLengths || "", positions: svg?.dataset.pointPositions || "", answerDistance: svg?.dataset.answerDistance || "", candidateCount: Number(svg?.dataset.candidateCount || 0),
          source: evidence?.dataset.sourceItem || "", kind: evidence?.dataset.source62FractionE5Example3Kind || "", evidenceCandidateCount: Number(evidence?.dataset.candidateCount || 0), difficulty: evidence?.dataset.difficultyDesign || "",
          pointCount: points.length, points, segmentLines: segmentLines.map(line => ({ index: line.dataset.segmentIndex || "", length: line.dataset.segmentLength || "", x1: Number(line.getAttribute("x1")), x2: Number(line.getAttribute("x2")) })),
          measureCount: measures.length, measureValues: measures.map(measure => (measure.textContent || "").trim()), totalCount: item.querySelectorAll(".source62-distance-total").length, answerCount: item.querySelectorAll(".source62-distance-answer").length, answerSource: item.querySelector(".source62-e5-example3-answer")?.dataset.answerSource || "",
          fractionCount: item.querySelectorAll(".math-fraction").length, font: svg ? getComputedStyle(svg).fontFamily : "", text, rawFraction: /\b\d+\s*\/\s*\d+\b/.test(text), invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(text), labelBoxes: labels.map(rect)
        };
      })
    };
  }, answerView);
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    const row = expected.get(item.signature);
    if (!item.itemVisible || item.itemOutside || !item.svgVisible || item.svgOutside || !item.svgBox || item.svgBox.width < 270 || item.svgBox.height < 90 || item.svgOverflow) fail(`${label}/${index + 1}: 수직선 그림이 화면 밖이거나 잘렸습니다.`);
    if (item.structure !== "five-point-segment-distance" || !row || item.pointOrder !== "가,나,다,라,마" || item.segments !== row?.segments || item.positions !== row?.positions || item.answerDistance !== row?.answer.replace("m", "") || item.candidateCount !== 1) fail(`${label}/${index + 1}: 점·선분 자료 또는 단일 답 계약이 다릅니다.`);
    if (item.source !== sourceItemId || item.kind !== "five-point-segment-distance" || item.evidenceCandidateCount !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·난이도·분수 표시가 다릅니다.`);
    if (!item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial")) fail(`${label}/${index + 1}: 수직선의 공통 글꼴이 아닙니다.`);
    if (item.pointCount !== 5 || item.points.map(point => point.label).join(",") !== "가,나,다,라,마" || item.points.map(point => point.distance).join(":") !== row.positions) fail(`${label}/${index + 1}: 다섯 점의 순서 또는 실제 위치가 다릅니다.`);
    if (item.segmentLines.length !== 4 || item.segmentLines.map(segment => segment.index).join(",") !== "0,1,2,3" || item.segmentLines.map(segment => segment.length).join(":") !== row.segments || item.segmentLines.some(segment => !Number.isFinite(segment.x1) || !Number.isFinite(segment.x2) || segment.x2 - segment.x1 < 40)) fail(`${label}/${index + 1}: 네 구간의 실제 길이 또는 최소 간격이 다릅니다.`);
    if (item.points.some(point => !/^translate\([\d.]+ 0\)$/.test(point.transform)) || item.points.some(point => !point.labelBox || point.labelBox.width < 5 || point.labelBox.height < 7) || item.labelBoxes.some((box, boxIndex) => item.labelBoxes.slice(boxIndex + 1).some(next => overlaps(box, next)))) fail(`${label}/${index + 1}: 점 이름이 겹치거나 보이지 않습니다.`);
    if (answerView) {
      if (item.measureCount !== 4 || item.measureValues.join(":") !== row.segments.split(":").map(value => `${value}m`).join(":") || item.totalCount !== 1 || item.answerCount !== 1 || item.answerSource !== sourceItemId || !item.text.includes(`가마 = ${row.answer}`)) fail(`${label}/${index + 1}: 답에 네 구간 또는 전체 거리가 표시되지 않았습니다.`);
    } else if (item.measureCount || item.totalCount || item.answerCount || item.answerSource || state.answerLeak || item.text.includes(row.answer)) {
      fail(`${label}/${index + 1}: 문제에 측정값 또는 답이 노출되었습니다.`);
    }
  }
  return state;
}

async function capture(page, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`);
  await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${viewportLabel}/${difficulty}/${view}: 캡처가 비었습니다.`);
  screenshots += 1;
}

function sameModel(problem, answer, label) {
  for (let index = 0; index < 3; index += 1) {
    const left = problem.items[index];
    const right = answer.items[index];
    if (!left || !right || left.signature !== right.signature || left.segments !== right.segments || left.positions !== right.positions || left.pointOrder !== right.pointOrder || left.segmentLines.map(segment => `${segment.x1}:${segment.x2}`).join(",") !== right.segmentLines.map(segment => `${segment.x1}:${segment.x2}`).join(",") || left.points.map(point => point.transform).join(",") !== right.points.map(point => point.transform).join(",")) fail(`${label}/${index + 1}: 문제와 답의 SVG 좌표·구간 길이·점 위치가 다릅니다.`);
  }
}

async function inspectType(browser, baseUrl, difficulty, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  page.on("pageerror", error => fail(`${viewportLabel}/${difficulty}: ${error.message}`));
  await page.route("**/*", route => /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url()) ? route.abort() : route.continue());
  try {
    await page.goto(`${baseUrl}?type=${sourceItemId}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspect(page, difficulty, false, viewportLabel);
    await capture(page, difficulty, viewportLabel, "problem");
    await page.locator("#solutionTab").click();
    await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
    const answer = await inspect(page, difficulty, true, viewportLabel);
    await capture(page, difficulty, viewportLabel, "answer");
    sameModel(problem, answer, `${viewportLabel}/${difficulty}`);
    if (difficulty === 0 && viewportLabel === "desktop") for (const [view, tab] of [["problem", "problemTab"], ["answer", "solutionTab"]]) {
      await page.locator(`#${tab}`).click();
      await page.emulateMedia({ media: "print" });
      const pdf = path.join(outputDir, `${sourceItemId}-${view}-a4.pdf`);
      await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
      renderPdf(pdf, view);
      pdfs += 1;
      await page.emulateMedia({ media: "screen" });
    }
  } catch (error) {
    fail(`${viewportLabel}/${difficulty}: 화면 검사 실패 (${error.message})`);
  } finally {
    await page.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || path.join(process.env.PROGRAMFILES || "C:/Program Files", "Google", "Chrome", "Application", "chrome.exe"), args: ["--disable-quic"] });
    for (const difficulty of [-1, 0, 1]) {
      await inspectType(browser, baseUrl, difficulty, { width: 1440, height: 900 }, "desktop");
      await inspectType(browser, baseUrl, difficulty, { width: 390, height: 844 }, "mobile");
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  if (screenshots !== 12) fail(`화면 캡처가 ${screenshots}장입니다.`);
  if (pdfs !== 2 || renderedPages < 2) fail(`A4 검사가 부족합니다: PDF ${pdfs}개, 그림 ${renderedPages}쪽.`);
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: 예제 5-3 점 순서·좌표 비례·구간 길이·답 노출·분수·A4; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n"));
  console.log(`6-2 예제 5-3 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
