"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright";
const { chromium } = require(playwrightPath);
const { PNG } = require(path.join(path.dirname(playwrightPath), "pngjs"));

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const runStamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").replace(/\.\d{3}Z$/, "");
const requestedOutputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), `lete-on-grade6-u6-e3-browser-results-${runStamp}`);
function freshOutputDir(requested) {
  if (!fs.existsSync(requested)) return requested;
  for (let suffix = 2; suffix < 10000; suffix += 1) {
    const candidate = `${requested}-${suffix}`;
    if (!fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`새 브라우저 감사 결과 폴더를 만들 수 없습니다: ${requested}`);
}
const outputDir = freshOutputDir(path.resolve(requestedOutputDir));
const sourceIds = [
  "6-1-u6-e3-exploration", "6-1-u6-e3-example-1", "6-1-u6-e3-example-2", "6-1-u6-e3-example-3",
  "6-1-u6-e3-example-4", "6-1-u6-e3-mission-2", "6-1-u6-e3-mission-4", "6-1-u6-e3-mission-5", "6-1-u6-e3-mission-6"
];
const kinds = ["notched-cuboid-volume", "cuboid-net-volume", "alternating-chain-surface", "three-face-volume", "staircase-unpainted-surface", "seven-cube-cross-surface", "parallel-cut-volume", "top-front-volume", "incremental-stair-layers"];
const difficulties = [-1, 0, 1];
const viewports = { pc1440: { width: 1440, height: 1000 }, mobile390: { width: 390, height: 844 } };
const failures = [];
let screenshots = 0;
let pdfs = 0;
let renderedPages = 0;
let checkedViews = 0;
const fail = message => failures.push(message);
const chainProblemAnswerPhrase = /(?:7개(?:의)?\s*(?:공유|접촉)(?:하는)?\s*면|(?:공유|접촉)(?:하는)?\s*면(?:은|이)?\s*7개|접촉면\s*7개|7곳)/;

function findPool(sourceItemId, difficulty, variant, poolIndex) {
  const type = { sourceItemId, generatorKey: "sourceGrade6VolumeSurfaceE3", reviewLocked: false, variant };
  for (let seed = 1000 + poolIndex; seed < 100000; seed += 3) {
    const generated = api.generate(type, 1, difficulty - 1, seed, variant);
    if (generated.verifiedPoolIndex === poolIndex) return generated;
  }
  throw new Error(`${sourceItemId}: pool ${poolIndex} 시드를 찾지 못했습니다.`);
}
function pageMarkup(generated, view) {
  const content = view === "problem"
    ? `<main class="question-pages"><section class="question-item"><div class="question-prompt">${generated.prompt}</div></section></main>`
    : `<main class="answer-pages"><section class="solution-item"><div class="solution-answer-visual">${generated.answerVisual}</div><div class="solution-explanation">${generated.solution}</div><div class="solution-answer">답: ${generated.answer}</div></section></main>`;
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${fs.readFileSync(path.join(__dirname, "styles.css"), "utf8")}</style><style>
    html,body{margin:0;padding:0;background:#fff;color:#183b56;font-family:Pretendard,"Malgun Gothic",Arial,sans-serif}
    body{padding:24px;box-sizing:border-box}.question-item,.solution-item{max-width:1040px;margin:0 auto;padding:24px;box-sizing:border-box}
    .question-prompt,.solution-answer-visual,.solution-explanation,.solution-answer{max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}.solution-explanation{word-break:break-word;line-height:1.65}.solution-answer{margin-top:16px;font-weight:900}
    @media print{body{padding:10mm}.question-item,.solution-item{max-width:none;padding:4mm}.question-item,.solution-item{break-inside:avoid;page-break-inside:avoid}}
  </style></head><body>${content}</body></html>`;
}
function bodyInkPixels(file) {
  const png = PNG.sync.read(fs.readFileSync(file));
  let count = 0;
  for (let y = Math.floor(png.height * .05); y < Math.floor(png.height * .95); y += 2) for (let x = Math.floor(png.width * .03); x < Math.floor(png.width * .97); x += 2) {
    const i = (y * png.width + x) * 4;
    if (png.data[i] < 210 || png.data[i + 1] < 210 || png.data[i + 2] < 210) count += 1;
  }
  return count;
}
function renderPdf(pdfPath, label) {
  try {
    const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
    const pages = Number(info.match(/^Pages:\s+(\d+)$/m)?.[1] || 0);
    if (pages !== 1) fail(`${label}: A4 PDF ${pages}쪽, 1쪽이어야 합니다.`);
    const prefix = pdfPath.replace(/\.pdf$/, "-page");
    execFileSync("pdftoppm", ["-png", pdfPath, prefix], { stdio: "ignore" });
    const pageFile = `${prefix}-1.png`;
    if (!fs.existsSync(pageFile) || fs.statSync(pageFile).size < 5000 || bodyInkPixels(pageFile) < 300) fail(`${label}: A4 렌더가 비었거나 너무 작습니다.`);
    renderedPages += pages;
  } catch (error) { fail(`${label}: A4 렌더 실패 ${error.message}`); }
}
function svgAttribute(svg, name) { return svg.getAttribute(`data-${name}`) || ""; }
async function inspect(page, generated, sourceItemId, variant, difficulty, pool, view, viewportName) {
  await page.setContent(pageMarkup(generated, view), { waitUntil: "load", timeout: 120000 });
  await page.emulateMedia({ media: "screen" });
  await page.waitForTimeout(20);
  const state = await page.evaluate(({ expectedSource, expectedKind, expectedPool, expectedAnswer, currentView, currentVariant, currentPool, currentViewport }) => {
    const root = document.querySelector(".question-item,.solution-item");
    const diagram = document.querySelector("svg.source61-vs-e3-diagram");
    const readable = node => { const style = getComputedStyle(node); const box = node.getBoundingClientRect(); return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0; };
    const box = diagram?.getBoundingClientRect();
    let drawing = { width: 0, height: 0 };
    try { const b = diagram?.getBBox(); drawing = { width: b?.width || 0, height: b?.height || 0 }; } catch (_) {}
    const textClips = [...document.querySelectorAll("svg text")].filter(readable).filter(node => {
      const item = node.getBoundingClientRect(), svg = node.closest("svg")?.getBoundingClientRect();
      return svg && (item.left < svg.left - 2 || item.right > svg.right + 2 || item.top < svg.top - 2 || item.bottom > svg.bottom + 2);
    }).map(node => (node.textContent || "").trim());
    const majorGeometrySelector = currentVariant === 2
      ? "[data-chain-index] polygon,[data-contact-face],[data-contact-edge]"
      : currentVariant === 4 ? "[data-stair-cube] polygon" : "";
    const majorGeometry = majorGeometrySelector ? [...document.querySelectorAll(majorGeometrySelector)].filter(readable) : [];
    const intersects = (left, right, allowance = 1) => left.left < right.right - allowance && left.right > right.left + allowance && left.top < right.bottom - allowance && left.bottom > right.top + allowance;
    const geometryTextOverlaps = majorGeometry.length ? [...document.querySelectorAll("svg text")].filter(readable).flatMap(node => {
      const textBox = node.getBoundingClientRect();
      const hits = majorGeometry.filter(shape => intersects(textBox, shape.getBoundingClientRect())).length;
      return hits ? [`${(node.textContent || "").trim()}(${hits})`] : [];
    }) : [];
    const undersizedStairTexts = currentVariant === 4 && currentViewport === "mobile390"
      ? [...document.querySelectorAll("svg text")].filter(readable).filter(node => node.getBoundingClientRect().height < 10).map(node => `${(node.textContent || "").trim()}:${node.getBoundingClientRect().height.toFixed(1)}px`)
      : [];
    const problemLeak = currentView === "problem" && document.querySelectorAll("[data-answer-source],.is-solved,.source61-vs-e3-result-label,.solution-answer").length > 0;
    const problemTextLeak = currentView === "problem" && (document.body.innerText || "").includes(expectedAnswer);
    const sameEvidence = [...document.querySelectorAll(`[data-source61-vs-e3-kind="${expectedKind}"][data-source-item="${expectedSource}"][data-pool="${expectedPool}"]`)].length === 1;
      const coords = [...document.querySelectorAll("[data-cross-coordinate]")].map(node => node.getAttribute("data-cross-coordinate"));
      const stairCoords = [...document.querySelectorAll("[data-stair-cube][data-coordinate]")].map(node => node.getAttribute("data-coordinate"));
      const stairLayerCounts = [0, 1, 2, 3].map(layer => stairCoords.filter(coordinate => coordinate.endsWith(`,${layer}`)).length);
      const visibleText = [...document.querySelectorAll("svg text")].map(node => node.textContent || "").join(" ");
    return {
      root: root ? { left: root.getBoundingClientRect().left, right: root.getBoundingClientRect().right, width: root.clientWidth, scrollWidth: root.scrollWidth } : null,
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 2,
      svg: diagram ? { visible: readable(diagram), width: box.width, height: box.height, drawingWidth: drawing.width, drawingHeight: drawing.height, structure: diagram.getAttribute("data-source61-vs-e3-structure") || "", model: diagram.getAttribute("data-source61-vs-e3-model") || "", phase: diagram.getAttribute("data-phase") || "", pool: document.querySelector("[data-source61-vs-e3-kind]")?.getAttribute("data-pool") || "" } : null,
      textClips, geometryTextOverlaps, undersizedStairTexts, problemLeak, problemTextLeak, sameEvidence,
        chainPieces: document.querySelectorAll("[data-chain-index]").length, chainDepthFaces: document.querySelectorAll(".source61-vs-e3-chain-side,.source61-vs-e3-chain-cube-side").length, contactFaces: document.querySelectorAll("[data-contact-face]").length,
      cutFaces: document.querySelectorAll(".source61-vs-e3-cut-face").length, cutPosition: document.querySelectorAll(`[data-cut-position="top-front-right-corner"]`).length,
        stairCoordinates: stairCoords.length, stairUnique: new Set(stairCoords).size, stairLayerCounts, crossCoordinates: coords.length, crossUnique: new Set(coords).size,
        visibleText,
      viewFaces: document.querySelectorAll(".source61-vs-e3-view-face").length, cutPlanes: document.querySelectorAll(".source61-vs-e3-cut-plane").length,
      netFaces: document.querySelectorAll("[data-net-face]").length, netMarks: document.querySelectorAll(".source61-vs-e3-net-edge").length,
      answer: currentView === "answer" ? [...document.querySelectorAll(".solution-answer")].some(node => (node.textContent || "").includes(expectedAnswer)) : true,
      currentVariant, currentPool
    };
  }, { expectedSource: sourceItemId, expectedKind: kinds[variant], expectedPool: String(pool), expectedAnswer: generated.answer, currentView: view, currentVariant: variant, currentPool: pool, currentViewport: viewportName });
  checkedViews += 1;
  const label = `${sourceItemId}/pool${pool}/difficulty${difficulty}/${view}/${viewportName}`;
  if (!state.root || state.pageOverflow || state.root.scrollWidth > state.root.width + 2 || state.root.left < -2 || state.root.right > (viewportName === "pc1440" ? 1440 : 390) + 2) fail(`${label}: 화면 밖 또는 가로 넘침`);
  if (!state.svg || !state.svg.visible || state.svg.width <= 0 || state.svg.height <= 0 || state.svg.drawingWidth <= 0 || state.svg.drawingHeight <= 0) fail(`${label}: 빈 SVG 또는 보이지 않는 SVG`);
  if (state.textClips.length) fail(`${label}: SVG 글자 잘림 ${state.textClips.join(",")}`);
  if (state.geometryTextOverlaps.length) fail(`${label}: SVG 글자와 주요 도형 경계 겹침 ${state.geometryTextOverlaps.join(",")}`);
  if (state.undersizedStairTexts.length) fail(`${label}: 390px 계단 보조 글자 10px 미만 ${state.undersizedStairTexts.join(",")}`);
  if (!state.sameEvidence || state.svg?.structure !== kinds[variant] || state.svg?.pool !== String(pool)) fail(`${label}: source ID·유형·pool 메타데이터 누락`);
  if (state.svg?.phase !== view) fail(`${label}: problem/answer phase가 맞지 않습니다.`);
  if (view === "problem" && (state.problemLeak || state.problemTextLeak)) fail(`${label}: 문제 화면에 답 또는 답 강조가 노출되었습니다.`);
  if (view === "answer" && !state.answer) fail(`${label}: 답 텍스트가 없습니다.`);
  if (variant === 0 && (state.cutFaces !== 3 || state.cutPosition !== 3)) fail(`${label}: 모서리 홈 절단면 3개 또는 위치 모델 누락`);
  if (variant === 1 && (state.netFaces !== 6 || state.netMarks !== 3)) fail(`${label}: 전개도 면/대응 변 누락`);
   if (variant === 2 && (state.chainPieces !== 8 || state.chainDepthFaces !== 8 || state.contactFaces !== 7)) fail(`${label}: 8조각/깊이면/7접촉면 누락`);
   if (variant === 2 && view === "problem" && /(?:7개(?:의)?\s*(?:공유|접촉)(?:하는)?\s*면|(?:공유|접촉)(?:하는)?\s*면(?:은|이)?\s*7개|접촉면\s*7개|7곳)/.test(state.visibleText)) fail(`${label}: 문제 그림 DOM 글자에 7개 공유면 정답 노출`);
   if (variant === 4 && (state.stairCoordinates !== 30 || state.stairUnique !== 30 || String(state.stairLayerCounts) !== "16,9,4,1")) fail(`${label}: 3D 계단 좌표 30개 또는 층별 16·9·4·1 누락`);
  if (variant === 5 && (state.crossCoordinates !== 7 || state.crossUnique !== 7)) fail(`${label}: 십자 7개 위치 누락`);
  if (variant === 6 && state.cutPlanes !== 1) fail(`${label}: 평행 절단면 누락`);
  if (variant === 7 && state.viewFaces !== 2) fail(`${label}: 위/앞 두 그림 누락`);
  await page.screenshot({ path: path.join(outputDir, `${variant}-d${difficulty}-p${pool}-${view}-${viewportName}.png`), fullPage: true, timeout: 120000 });
  screenshots += 1;
}
async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--disable-quic"] });
  try {
    for (let variant = 0; variant < sourceIds.length; variant += 1) for (const difficulty of difficulties) for (let pool = 0; pool < 3; pool += 1) {
      const generated = findPool(sourceIds[variant], difficulty, variant, pool);
      const problemSvg = (generated.prompt.match(/<svg\b[\s\S]*?<\/svg>/g) || [])[0] || "";
      const answerSvg = (generated.answerVisual.match(/<svg\b[\s\S]*?<\/svg>/g) || [])[0] || "";
      if (!problemSvg || !answerSvg) fail(`${sourceIds[variant]}/pool${pool}: 문제/답 SVG 준비 실패`);
      if (variant === 2 && chainProblemAnswerPhrase.test(problemSvg)) fail(`${sourceIds[variant]}/pool${pool}: 문제 SVG 원문에 7개 공유면 정답 문구가 있습니다.`);
      if (problemSvg.match(/data-source61-vs-e3-model="([^"]+)"/)?.[1] !== answerSvg.match(/data-source61-vs-e3-model="([^"]+)"/)?.[1]) fail(`${sourceIds[variant]}/pool${pool}: 문제/답 model이 다릅니다.`);
      for (const [viewportName, viewport] of Object.entries(viewports)) {
        const page = await browser.newPage({ viewport });
        try { await inspect(page, generated, sourceIds[variant], variant, difficulty, pool, "problem", viewportName); await inspect(page, generated, sourceIds[variant], variant, difficulty, pool, "answer", viewportName); }
        catch (error) { fail(`${sourceIds[variant]}/pool${pool}/difficulty${difficulty}/${viewportName}: 브라우저 감사 실패 ${error.message}`); }
        finally { await page.close(); }
      }
      const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
      for (const view of ["problem", "answer"]) {
        await page.setContent(pageMarkup(generated, view), { waitUntil: "load", timeout: 120000 });
        await page.emulateMedia({ media: "print" });
        const pdf = path.join(outputDir, `${variant}-d${difficulty}-p${pool}-${view}.pdf`);
        await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
        pdfs += 1;
        renderPdf(pdf, `${sourceIds[variant]}/pool${pool}/difficulty${difficulty}/${view}`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
  const summary = `${failures.length ? "실패" : "통과"}: 9유형 × 3풀 × 3난이도 = 81생성물, PC1440·모바일390 문제/답 ${screenshots}장, A4 문제/답 PDF ${pdfs}개·${renderedPages}쪽, 확인 뷰 ${checkedViews}개\n최신 결과 경로: ${outputDir}\n${failures.join("\n")}\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) { console.error(`6-1 6단원 E3 브라우저 감사 실패: ${failures.length}건`); console.error(failures.slice(0, 120).join("\n")); process.exit(1); }
  console.log(`6-1 6단원 E3 브라우저 감사 통과: 9유형 × 3풀 × 3난이도 = 81생성물 · PC1440/모바일390 문제·답 ${screenshots}장 · A4 ${pdfs}개/${renderedPages}쪽 · 확인 뷰 ${checkedViews}개`);
  console.log(`최신 결과 경로: ${outputDir}`);
}
main().catch(error => { console.error(error.stack || error.message); process.exit(1); });
