"use strict";

const fs = require("node:fs");
const os = require("node:os");
const http = require("node:http");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const questionBankDir = __dirname;
const repoRoot = path.resolve(questionBankDir, "..", "..");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
const { chromium } = require(playwrightPath);
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "lete-on-audit", "source-6-2-fraction-division-e5-mission1");
const sourceItemId = "6-2-u1-e5-mission-1";
const expected = new Map([
  ["2:9:3:4:187:8", { answer: "38 1/4cm", units: "4:3:11", total: "18" }],
  ["3:10:2:3:57:4", { answer: "28 1/2cm", units: "3:2:5", total: "10" }],
  ["3:11:4:5:14:1", { answer: "27 1/2cm", units: "15:12:28", total: "55" }]
]);
const difficultyNames = { "-1": "guided", "0": "source", "1": "independent-reasoning" };
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
function safePath(urlPath) { const relative = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, ""); const file = path.resolve(repoRoot, relative || "index.html"); return file === repoRoot || file.startsWith(`${repoRoot}${path.sep}`) ? file : null; }
async function startServer() {
  const server = http.createServer((request, response) => { let file = safePath(request.url || "/"); if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end("Not found"); return; } const type = ({ ".css": "text/css", ".html": "text/html", ".js": "application/javascript", ".json": "application/json" })[path.extname(file)] || "application/octet-stream"; response.writeHead(200, { "Content-Type": `${type}; charset=utf-8`, "Cache-Control": "no-store" }); fs.createReadStream(file).pipe(response); });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); }); return { server, baseUrl: `http://127.0.0.1:${server.address().port}/hselementary/question-bank/` };
}
async function inspect(page, difficulty, answerView, viewportLabel) {
  const state = await page.evaluate(answer => {
    const rect = element => { const box = element?.getBoundingClientRect(); return box ? { width: box.width, height: box.height } : null; };
    const visible = element => Boolean(element && getComputedStyle(element).display !== "none" && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0);
    return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2, items: [...document.querySelectorAll(answer ? "#solutionView .solution-item" : "#problemView .question-item")].map(item => { const board = item.querySelector(".source62-fish-length-board"); const solution = item.querySelector(".source62-fish-length-solution"); const evidence = item.querySelector("[data-source62-fraction-e5-mission1-kind]"); const rowLabels = [...item.querySelectorAll(".source62-fish-length-board .source61-math-row>span,.source62-fish-length-solution .source61-math-row>span")]; const rowValues = [...item.querySelectorAll(".source62-fish-length-board .source61-math-row>b,.source62-fish-length-solution .source61-math-row>b")]; return { visible: visible(item), board: visible(board), boardBox: rect(board), signature: board?.dataset.source62E5Mission1Values || "", partition: board?.dataset.unitPartition || "", total: board?.dataset.totalUnits || "", candidates: Number(board?.dataset.candidateCount || 0), source: evidence?.dataset.sourceItem || "", kind: evidence?.dataset.source62FractionE5Mission1Kind || "", contract: evidence?.dataset.resultContract || "", difficulty: evidence?.dataset.difficultyDesign || "", evidenceCandidates: Number(evidence?.dataset.candidateCount || 0), answerSource: item.querySelector(".source62-e5-mission1-answer")?.dataset.answerSource || "", fractions: item.querySelectorAll(".math-fraction").length, minRowLabelFont: Math.min(...rowLabels.map(element => parseFloat(getComputedStyle(element).fontSize)), 999), minRowValueFont: Math.min(...rowValues.map(element => parseFloat(getComputedStyle(element).fontSize)), 999), solutionVisible: !answer || visible(solution), rawFraction: /\b\d+\s*\/\s*\d+\b/.test((item.innerText || "").replace(/\s+/g, " ")), invalid: /undefined|null|NaN|Infinity|SyntaxError/.test(item.innerText || ""), text: (item.innerText || "").replace(/\s+/g, " ").trim(), font: board ? getComputedStyle(board).fontFamily : "" }; }) };
  }, answerView);
  const label = `${viewportLabel}/${difficulty}/${answerView ? "답" : "문제"}`;
  if (state.overflow || state.items.length !== 3) fail(`${label}: 화면 넘침 또는 고정 문항 수 오류입니다.`);
  for (const [index, item] of state.items.entries()) {
    const row = expected.get(item.signature);
    if (!item.visible || !item.board || !item.boardBox || item.boardBox.width < 230 || item.boardBox.height < 100) fail(`${label}/${index + 1}: 머리·몸통·꼬리 관계표가 보이지 않거나 잘렸습니다.`);
    if (!row || item.partition !== row.units || item.total !== row.total || item.candidates !== 1 || item.source !== sourceItemId || item.kind !== "fish-head-body-tail-length" || item.contract !== "single-positive-centimeter-length" || item.evidenceCandidates !== 1 || item.difficulty !== difficultyNames[String(difficulty)] || item.invalid || !item.font.includes("Pretendard") || !item.solutionVisible) fail(`${label}/${index + 1}: 관계표·원문·단일 답·글꼴 자료가 다릅니다.`);
    if (viewportLabel === "mobile" && (item.minRowLabelFont < 14 || item.minRowValueFont < 15)) fail(`${label}/${index + 1}: 모바일 관계표·풀이 글자가 읽기 기준보다 작습니다.`);
    if (/\$\{/.test(item.text)) fail(`${label}/${index + 1}: 치환되지 않은 계산 표시가 남아 있습니다.`);
    if (!answerView && (/23\s*3\/4|95\/4|38\s*19\/22|855\/22|38\s*1\/4/.test(item.text) || item.answerSource)) fail(`${label}/${index + 1}: 문제에 잘못된 수치 또는 답이 노출되었습니다.`);
    if (answerView && (item.answerSource !== sourceItemId || item.fractions < 5)) fail(`${label}/${index + 1}: 답의 세로 분수 또는 같은 자료 관계표가 부족합니다.`);
    if (item.rawFraction) fail(`${label}/${index + 1}: 보이는 가로 분수가 남아 있습니다.`);
  }
  return state;
}
async function capture(page, difficulty, viewportLabel, view) { const file = path.join(outputDir, `${sourceItemId}-${difficulty}-${viewportLabel}-${view}.png`); await page.screenshot({ path: file, fullPage: true, timeout: 120000 }); if (fs.statSync(file).size < 5000) fail(`${viewportLabel}/${difficulty}/${view}: 캡처가 비었습니다.`); screenshots += 1; }
async function inspectType(browser, baseUrl, difficulty, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 }); page.setDefaultTimeout(60000);
  try { await page.goto(`${baseUrl}?type=${sourceItemId}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 }); await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" }); const problem = await inspect(page, difficulty, false, label); await capture(page, difficulty, label, "problem"); await page.locator("#solutionTab").click(); await page.locator("#solutionView:not([hidden])").waitFor({ state: "visible" }); const answer = await inspect(page, difficulty, true, label); await capture(page, difficulty, label, "answer"); for (let index = 0; index < 3; index += 1) if (problem.items[index]?.signature !== answer.items[index]?.signature || problem.items[index]?.partition !== answer.items[index]?.partition) fail(`${label}/${difficulty}/${index + 1}: 문제와 답의 관계표 자료가 다릅니다.`); if (difficulty === 0 && label === "desktop") for (const [view, tab] of [["problem", "problemTab"], ["answer", "solutionTab"]]) { await page.locator(`#${tab}`).click(); await page.emulateMedia({ media: "print" }); const pdf = path.join(outputDir, `${sourceItemId}-${view}-a4.pdf`); await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true }); const pages = Number(execFileSync("pdfinfo", [pdf], { encoding: "utf8" }).match(/^Pages:\s+(\d+)$/m)?.[1] || 0); if (!pages) fail(`A4 ${view}: PDF 페이지가 없습니다.`); pdfs += 1; await page.emulateMedia({ media: "screen" }); } } catch (error) { fail(`${label}/${difficulty}: 화면 검사 실패 (${error.message})`); } finally { await page.close(); }
}
(async () => { fs.mkdirSync(outputDir, { recursive: true }); const { server, baseUrl } = await startServer(); let browser; try { browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || path.join(process.env.PROGRAMFILES || "C:/Program Files", "Google", "Chrome", "Application", "chrome.exe"), args: ["--disable-quic"] }); for (const difficulty of [-1, 0, 1]) { await inspectType(browser, baseUrl, difficulty, { width: 1440, height: 900 }, "desktop"); await inspectType(browser, baseUrl, difficulty, { width: 390, height: 844 }, "mobile"); } } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); } if (screenshots !== 12 || pdfs !== 2) fail(`화면 또는 A4 검사가 부족합니다: ${screenshots}장, PDF ${pdfs}개.`); fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}: Mission 1 붕어 관계표·세로 분수·A4; 화면 ${screenshots}장, A4 ${pdfs}개\n${failures.join("\n")}\n`, "utf8"); if (failures.length) throw new Error([...new Set(failures)].join("\n")); console.log(`6-2 Mission 1 브라우저·인쇄 감사 통과: 화면 ${screenshots}장 · A4 ${pdfs}개`); })().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
