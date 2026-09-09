"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-grade6-volume-e3-mission3.js");

const api = window.HSE_GENERATORS;
const sourceItemId = "6-1-u6-e3-mission-3";
const generatorKey = "sourceGrade6VolumeE3Mission3";
const difficulties = [-1, 0, 1];
const viewports = { pc1440: { width: 1440, height: 1000 }, mobile390: { width: 390, height: 844 } };
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").replace(/\.\d{3}Z$/, "");
const outputDir = path.resolve(process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), `lete-on-6-1-u6-e3-m3-${stamp}`));
const styles = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const markup = (generated, view) => {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div><div class="solution-answer">답: ${generated.answer}</div></section></main>`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${styles}</style><style>
    html,body{margin:0;background:#fff;color:#183b56;font-family:Pretendard,"Malgun Gothic",Arial,sans-serif}
    body{padding:24px;box-sizing:border-box}.question-item,.solution-item{max-width:1040px;margin:0 auto;padding:24px;box-sizing:border-box}
    .question-prompt,.solution-answer-visual,.solution-explanation,.solution-answer{max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}.solution-explanation{line-height:1.65}.solution-answer{margin-top:16px;font-weight:900}
    @media(max-width:720px){body{padding:8px}.question-item,.solution-item{padding:12px}}
    @media print{body{padding:10mm}.question-item,.solution-item{max-width:none;padding:4mm;break-inside:avoid;page-break-inside:avoid}}
  </style></head><body>${content}</body></html>`;
};

async function inspect(page, generated, pool, difficulty, view, viewportName) {
  await page.setContent(markup(generated, view), { waitUntil: "load", timeout: 120000 });
  await page.emulateMedia({ media: "screen" });
  const state = await page.evaluate(({ currentView, expectedAnswer }) => {
    const root = document.querySelector(".question-item,.solution-item");
    const diagram = document.querySelector("svg.source61-vs-e3-diagram");
    const rootBox = root?.getBoundingClientRect();
    const diagramBox = diagram?.getBoundingClientRect();
    let drawing = null;
    try { drawing = diagram?.getBBox(); } catch (_) {}
    const visible = node => {
      const box = node.getBoundingClientRect();
      const css = getComputedStyle(node);
      return css.display !== "none" && css.visibility !== "hidden" && box.width > 0 && box.height > 0;
    };
    const clippedText = [...document.querySelectorAll("svg text")].filter(visible).filter(node => {
      const textBox = node.getBoundingClientRect();
      const svgBox = node.closest("svg")?.getBoundingClientRect();
      return svgBox && (textBox.left < svgBox.left - 2 || textBox.right > svgBox.right + 2 || textBox.top < svgBox.top - 2 || textBox.bottom > svgBox.bottom + 2);
    }).map(node => (node.textContent || "").trim());
    const texts = [...document.querySelectorAll("svg text")].filter(visible);
    const textOverlaps = [];
    for (let left = 0; left < texts.length; left += 1) for (let right = left + 1; right < texts.length; right += 1) {
      const a = texts[left].getBoundingClientRect();
      const b = texts[right].getBoundingClientRect();
      if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) {
        textOverlaps.push(`${(texts[left].textContent || "").trim()}/${(texts[right].textContent || "").trim()}`);
      }
    }
    const bodyText = document.body.innerText || "";
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      rootOverflow: Boolean(root && root.scrollWidth > root.clientWidth + 2),
      rootBox: rootBox ? { left: rootBox.left, right: rootBox.right } : null,
      diagram: diagramBox ? {
        width: diagramBox.width, height: diagramBox.height,
        drawingWidth: drawing?.width || 0, drawingHeight: drawing?.height || 0,
        model: diagram.getAttribute("data-source61-vs-e3-model"),
        structure: diagram.getAttribute("data-source61-vs-e3-structure"),
        phase: diagram.getAttribute("data-phase")
      } : null,
      baseFaces: document.querySelectorAll("[data-base-face]").length,
      lateralEdges: document.querySelectorAll("[data-lateral-edge]").length,
      callouts: document.querySelectorAll(".source61-vs-e3-callout").length,
      dimensionLines: document.querySelectorAll(".source61-vs-e3-dimension").length,
      resultLabels: document.querySelectorAll(".source61-vs-e3-result-label").length,
      answerSources: document.querySelectorAll("[data-answer-source]").length,
      unknownVisible: bodyText.includes("□ cm"),
      answerVisible: bodyText.includes(expectedAnswer),
      clippedText, textOverlaps,
      currentView
    };
  }, { currentView: view, expectedAnswer: generated.answer });
  const label = `pool${pool}/difficulty${difficulty}/${view}/${viewportName}`;
  const viewportWidth = viewports[viewportName].width;
  if (!state.rootBox || state.pageOverflow || state.rootOverflow || state.rootBox.left < -2 || state.rootBox.right > viewportWidth + 2) fail(`${label}: 화면 밖 또는 가로 넘침`);
  if (!state.diagram || state.diagram.width <= 0 || state.diagram.height <= 0 || state.diagram.drawingWidth <= 0 || state.diagram.drawingHeight <= 0) fail(`${label}: 빈 SVG 또는 보이지 않는 SVG`);
  if (state.diagram?.model !== "right-step-prism-net" || state.diagram?.structure !== "step-prism-net-unknown-edge" || state.diagram?.phase !== view) fail(`${label}: 전개도 모델 또는 problem/answer 단계가 다름`);
  if (state.baseFaces !== 2 || state.lateralEdges !== 8) fail(`${label}: 밑면 2개 또는 옆면 8개가 아님`);
  if (state.callouts !== 4 || state.dimensionLines !== 3) fail(`${label}: 짧은 변 연결선 4개 또는 옆면 치수선 3개가 아님`);
  if (state.clippedText.length) fail(`${label}: SVG 글자 잘림 ${state.clippedText.join(",")}`);
  if (state.textOverlaps.length) fail(`${label}: SVG 치수 글자 겹침 ${state.textOverlaps.join(",")}`);
  if (view === "problem" && (!state.unknownVisible || state.resultLabels || state.answerSources)) fail(`${label}: 빈칸이 없거나 답 표시가 노출됨`);
  if (view === "answer" && (!state.answerVisible || !state.resultLabels || state.answerSources !== 1)) fail(`${label}: 답 또는 답 근거가 보이지 않음`);
  await page.screenshot({ path: path.join(outputDir, `p${pool}-d${difficulty}-${view}-${viewportName}.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
}

function verifyPdf(file, label) {
  if (!fs.existsSync(file) || fs.statSync(file).size < 5000) return fail(`${label}: A4 PDF가 비었거나 너무 작음`);
  try {
    const info = execFileSync("pdfinfo", [file], { encoding: "utf8" });
    const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
    if (pages !== 1) fail(`${label}: A4 PDF가 ${pages}쪽임`);
  } catch (error) { fail(`${label}: A4 PDF 확인 실패 ${error.message}`); }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  try {
    for (let pool = 0; pool < 3; pool += 1) for (const difficulty of difficulties) {
      const generated = api.generate({ sourceItemId, generatorKey, reviewLocked: false }, 1, difficulty, 2000 + pool, pool);
      for (const [viewportName, viewport] of Object.entries(viewports)) {
        const page = await browser.newPage({ viewport });
        try {
          await inspect(page, generated, pool, difficulty, "problem", viewportName);
          await inspect(page, generated, pool, difficulty, "answer", viewportName);
        } catch (error) { fail(`pool${pool}/difficulty${difficulty}/${viewportName}: ${error.message}`); }
        finally { await page.close(); }
      }
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
      try {
        for (const view of ["problem", "answer"]) {
          await page.setContent(markup(generated, view), { waitUntil: "load", timeout: 120000 });
          await page.emulateMedia({ media: "print" });
          const pdf = path.join(outputDir, `p${pool}-d${difficulty}-${view}.pdf`);
          await page.pdf({ path: pdf, format: "A4", printBackground: true });
          verifyPdf(pdf, `pool${pool}/difficulty${difficulty}/${view}`);
          pdfs += 1;
        }
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), `${failures.length ? "실패" : "통과"}\n${failures.join("\n")}\n`, "utf8");
  if (failures.length) {
    console.error(`6-1 부피 Mission 3 브라우저 감사 실패: ${failures.length}건`);
    console.error(failures.join("\n"));
    process.exit(1);
  }
  console.log(`6-1 부피 Mission 3 브라우저 감사 통과: 3풀 × 3난이도 · PC/모바일 문제·답 ${screenshots}장 · A4 ${pdfs}개`);
  console.log(`최신 결과 경로: ${outputDir}`);
}

main().catch(error => { console.error(error.stack || error.message); process.exit(1); });
