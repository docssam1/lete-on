"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-audit", "source-6-2-fraction-division-e5-example4");
const sourceItemId = "6-2-u1-e5-example-4";
const expected = new Map([
  ["1:5:4:7:7:8", { areas: "336,384", answer: "2 1/2배" }],
  ["2:9:3:5:5:6", { areas: "360,432", answer: "2 1/4배" }],
  ["1:4:3:8:4:3", { areas: "432,324", answer: "2배" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
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
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; }
    const type = ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".png": "image/png" })[path.extname(file)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" }); fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}
function inkPixels(file) {
  const png = PNG.sync.read(fs.readFileSync(file)); let count = 0;
  for (let offset = 0; offset < png.data.length; offset += 4) if (png.data[offset] < 190 || png.data[offset + 1] < 190 || png.data[offset + 2] < 190) count += 1;
  return count;
}
function renderPdf(pdf, label) {
  const pages = Number(execFileSync("pdfinfo", [pdf], { encoding: "utf8" }).match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
  const prefix = pdf.replace(/\.pdf$/, "-page"); execFileSync("pdftoppm", ["-png", pdf, prefix], { stdio: "ignore" });
  const rendered = fs.readdirSync(outputDir).filter(name => name.startsWith(path.basename(prefix)) && name.endsWith(".png")).sort();
  if (!pages || rendered.length !== pages) fail(`${label}: A4 ${pages}쪽 중 ${rendered.length}쪽만 렌더했습니다.`);
  rendered.forEach(name => { const file = path.join(outputDir, name); if (fs.statSync(file).size < 15000 || inkPixels(file) < 5000) fail(`${label}: ${name}가 비었거나 인쇄 내용이 부족합니다.`); });
  renderedPages += rendered.length;
}
const overlaps = (left, right) => left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1;

async function inspect(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(answer => {
    const rect = element => { const box = element?.getBoundingClientRect(); return box ? { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height } : null; };
    const visible = element => Boolean(element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      items: [...document.querySelectorAll(answer ? "#solutionView .solution-item" : "#problemView .question-item")].map(item => {
        const svg = item.querySelector(".source62-overlap-triangles"); const evidence = item.querySelector("[data-source62-fraction-e5-example4-kind]");
        const labels = [...item.querySelectorAll(".source62-overlap-label,.source62-overlap-shade-label")];
        const shadeStyles = [...item.querySelectorAll(".source62-overlap-shade")].map(shade => ({ fill: getComputedStyle(shade).fill, opacity: Number(getComputedStyle(shade).fillOpacity) }));
        const text = (item.innerText || "").replace(/\s+/g, " ").trim();
        return {
          visible: visible(item), svgVisible: visible(svg), svgBox: rect(svg), svgOverflow: svg ? svg.scrollWidth > svg.clientWidth + 1 : true,
          signature: svg?.dataset.source62E5Example4Values || "", model: svg?.dataset.modelFingerprint || "", intersection: svg?.dataset.intersectionFingerprint || "", structure: svg?.dataset.source62E5Example4Structure || "", shapes: svg?.dataset.shapeOrder || "", shades: svg?.dataset.shadeOrder || "", vertices: svg?.dataset.intersectionVertexCounts || "", areas: svg?.dataset.intersectionAreas || "", candidates: Number(svg?.dataset.candidateCount || 0),
          source: evidence?.dataset.sourceItem || "", kind: evidence?.dataset.source62FractionE5Example4Kind || "", contract: evidence?.dataset.resultContract || "", evidenceCandidates: Number(evidence?.dataset.candidateCount || 0), difficulty: evidence?.dataset.difficultyDesign || "",
          outerLines: item.querySelectorAll(".source62-overlap-edge").length, baseline: item.querySelectorAll(".source62-overlap-baseline").length, shadePolygons: item.querySelectorAll(".source62-overlap-shade").length, shadeStyles, labels: labels.map(label => ({ text: (label.textContent || "").trim(), box: rect(label) })),
          answerSource: item.querySelector(".source62-e5-example4-answer")?.dataset.answerSource || "", answerBoard: item.querySelectorAll(".source62-overlap-solution").length, fractionCount: item.querySelectorAll(".math-fraction").length, rawFraction: /\b\d+\s*\/\s*\d+\b/.test(text), invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(text), text, font: svg ? getComputedStyle(svg).fontFamily : ""
        };
      })
    };
  }, answerView);
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    const key = item.signature.split(":").slice(0, 6).join(":"); const row = expected.get(key);
    if (!item.visible || !item.svgVisible || !item.svgBox || item.svgBox.width < 260 || item.svgBox.height < 120 || item.svgOverflow) fail(`${label}/${index + 1}: 도형이 보이지 않거나 잘렸습니다.`);
    if (!row || item.structure !== "three-overlapping-triangles-area-ratio" || item.shapes !== "가,나,다" || item.shades !== "㉠,㉡" || item.vertices !== "3,3" || item.areas !== row.areas || item.candidates !== 1) fail(`${label}/${index + 1}: 세 삼각형·교집합·단일 답 자료가 다릅니다.`);
    if (item.source !== sourceItemId || item.kind !== "three-overlapping-triangles-area-ratio" || item.contract !== "single-positive-area-ratio" || item.evidenceCandidates !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.rawFraction || item.invalid) fail(`${label}/${index + 1}: 원문·분수·난이도 자료가 다릅니다.`);
    const labelNames = item.labels.map(value => value.text).sort().join(",");
    const tinyLabels = item.labels.filter(value => !value.box || value.box.width < 5 || value.box.height < 7).map(value => value.text);
    const overlappingLabels = item.labels.flatMap((value, labelIndex) => item.labels.slice(labelIndex + 1).filter(next => overlaps(value.box, next.box)).map(next => `${value.text}:${next.text}`));
    const visualIssues = [
      !item.font.includes("Pretendard") || !item.font.includes("Malgun Gothic") || !item.font.includes("Arial") ? `글꼴=${item.font}` : "",
      item.outerLines !== 6 ? `바깥선=${item.outerLines}` : "",
      item.baseline !== 1 ? `밑변=${item.baseline}` : "",
      item.shadePolygons !== 2 ? `음영=${item.shadePolygons}` : "",
      item.shadeStyles.length !== 2 || item.shadeStyles.some(shade => !shade.fill || shade.fill === "none" || shade.fill === "rgba(0, 0, 0, 0)" || shade.opacity < 0.9) ? `음영색=${JSON.stringify(item.shadeStyles)}` : "",
      labelNames !== "(가),(나),(다),㉠,㉡" ? `라벨=${labelNames}` : "",
      tinyLabels.length ? `작은 라벨=${tinyLabels.join(",")}` : "",
      overlappingLabels.length ? `겹친 라벨=${overlappingLabels.join(",")}` : ""
    ].filter(Boolean);
    if (visualIssues.length) fail(`${label}/${index + 1}: ${visualIssues.join("; ")}`);
    if (answerView) {
      if (item.answerSource !== sourceItemId || item.answerBoard !== 1 || item.fractionCount < 3) fail(`${label}/${index + 1}: 답의 세로 분수 또는 풀이 관계가 보이지 않습니다.`);
    } else if (item.answerSource || item.answerBoard || /1680|672|336|384|1620|720|360|432|1728|864/.test(item.text) || item.text.includes(row.answer.replace("/", " "))) fail(`${label}/${index + 1}: 문제에 넓이 값 또는 답이 노출되었습니다.`);
  }
  return state;
}
async function capture(page, difficulty, viewportLabel, view) {
  const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`); await page.screenshot({ path: file, fullPage: true, timeout: 120000 });
  if (fs.statSync(file).size < 5000 || inkPixels(file) < 1200) fail(`${viewportLabel}/${difficulty}/${view}: 캡처가 비었습니다.`); screenshots += 1;
}
function sameModel(problem, answer, label) {
  for (let index = 0; index < 3; index += 1) { const left = problem.items[index], right = answer.items[index]; if (!left || !right || left.signature !== right.signature || left.model !== right.model || left.intersection !== right.intersection || left.areas !== right.areas) fail(`${label}/${index + 1}: 문제와 답의 도형 좌표·교집합이 다릅니다.`); }
}
async function inspectType(browser, baseUrl, difficulty, viewport, viewportLabel) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 }); page.setDefaultTimeout(60000); page.on("pageerror", error => fail(`${viewportLabel}/${difficulty}: ${error.message}`));
  await page.route("**/*", route => /fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(route.request().url()) ? route.abort() : route.continue());
  try {
    await page.goto(`${baseUrl}?type=${sourceItemId}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 }); await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 20000 });
    const problem = await inspect(page, difficulty, false, viewportLabel); await capture(page, difficulty, viewportLabel, "problem"); await page.locator("#solutionTab").click(); await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" });
    const answer = await inspect(page, difficulty, true, viewportLabel); await capture(page, difficulty, viewportLabel, "answer"); sameModel(problem, answer, `${viewportLabel}/${difficulty}`);
    if (difficulty === 0 && viewportLabel === "desktop") for (const [view, tab] of [["problem", "problemTab"], ["answer", "solutionTab"]]) { await page.locator(`#${tab}`).click(); await page.emulateMedia({ media: "print" }); const pdf = path.join(outputDir, `${sourceItemId}-${view}-a4.pdf`); await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true }); renderPdf(pdf, view); pdfs += 1; await page.emulateMedia({ media: "screen" }); }
  } catch (error) { fail(`${viewportLabel}/${difficulty}: 화면 검사 실패 (${error.message})`); } finally { await page.close(); }
}
(async () => {
  fs.mkdirSync(outputDir, { recursive: true }); const { server, baseUrl } = await startServer(); let browser;
  try { browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || path.join(process.env.PROGRAMFILES || "C:/Program Files", "Google", "Chrome", "Application", "chrome.exe"), args: ["--disable-quic"] }); for (const difficulty of [-1, 0, 1]) { await inspectType(browser, baseUrl, difficulty, { width: 1440, height: 900 }, "desktop"); await inspectType(browser, baseUrl, difficulty, { width: 390, height: 844 }, "mobile"); } } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
  if (screenshots !== 12) fail(`화면 캡처가 ${screenshots}장입니다.`); if (pdfs !== 2 || renderedPages < 2) fail(`A4 검사가 부족합니다: PDF ${pdfs}개, 그림 ${renderedPages}쪽.`);
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: 예제 5-4 세 삼각형·교집합·음영·분수·A4; 화면 ${screenshots}장, A4 ${pdfs}개 ${renderedPages}쪽\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) throw new Error([...new Set(failures)].join("\n")); console.log(`6-2 예제 5-4 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개 전 ${renderedPages}쪽`);
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
