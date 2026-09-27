"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-5-1-area-e4-examples-4-3-4-4");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const types = unit.subunits.flatMap(item => item.types).filter(item => ["5-1-u6-e4-example-4-3", "5-1-u6-e4-example-4-4"].includes(item.sourceItemId));

function listen(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|ERR_QUIC_PROTOCOL_ERROR|Failed to load resource:.*404/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
}

async function state(page, selector, className, solutionMode) {
  return page.evaluate(({ selector, className, solutionMode }) => {
    const items = [...document.querySelectorAll(selector)];
    const figures = items.flatMap(item => [...item.querySelectorAll(`svg.${className}`)]);
    const clipped = element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      itemCount: items.length,
      figureCount: figures.length,
      hidden: items.some(item => item.hidden || getComputedStyle(item).display === "none"),
      clipped: items.some(clipped) || figures.some(clipped),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      answerLeak: !solutionMode && figures.some(figure => figure.dataset.resultHighlight || figure.dataset.longDiagonal || figure.dataset.timeAnswer),
      figures: figures.map(figure => ({
        width: figure.getBoundingClientRect().width,
        height: figure.getBoundingClientRect().height,
        sourceItem: figure.dataset.sourceItem,
        candidates: figure.dataset.answerCandidateCount,
        hasOverlap: Boolean(figure.querySelector('[data-layout-role="overlap-region"]')),
        hasMotion: Boolean(figure.querySelector('[data-layout-role="moving-segment"]')),
        pointLabels: [...figure.querySelectorAll('[data-layout-role="point-label"]')].map(node => node.textContent.trim()),
        result: figure.dataset.resultHighlight || ""
      }))
    };
  }, { selector, className, solutionMode });
}

function assertState(result, label, sourceItemId, solutionMode) {
  if (result.pageOverflow) fail(`${label}: 페이지 가로 넘침이 있습니다.`);
  if (result.itemCount !== 3 || result.figureCount !== 3 || result.hidden) fail(`${label}: 고정 문항 3개가 모두 보이지 않습니다.`);
  if (result.clipped) fail(`${label}: 문항 또는 그림이 잘립니다.`);
  if (result.broken) fail(`${label}: 깨진 값이 보입니다.`);
  if (result.answerLeak) fail(`${label}: 문제 그림에 답이 노출됩니다.`);
  for (const [index, figure] of result.figures.entries()) {
    if (figure.width < 180 || figure.height < 95) fail(`${label} ${index + 1}: 그림 크기가 너무 작습니다.`);
    if (figure.sourceItem !== sourceItemId || figure.candidates !== "1") fail(`${label} ${index + 1}: 원본 ID 또는 단일 답 계약이 다릅니다.`);
    if (sourceItemId.endsWith("4-3") && !figure.hasOverlap) fail(`${label} ${index + 1}: 겹친 부분이 없습니다.`);
    if (sourceItemId.endsWith("4-4") && (!figure.hasMotion || !["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"].every(point => figure.pointLabels.includes(point)))) fail(`${label} ${index + 1}: 이동 선분 또는 점 이름이 빠졌습니다.`);
    if (solutionMode && !figure.result) fail(`${label} ${index + 1}: 풀이 그림의 답 확인값이 없습니다.`);
  }
}

async function inspect(page, type, viewport, difficulty, withPdf) {
  const className = type.sourceItemId.endsWith("4-3") ? "source51-e4-overlap" : "source51-e4-motion";
  const query = `?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`;
  await page.goto(`${baseUrl}${query}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const stem = `${type.sourceItemId}-${viewport}-d${difficulty}`;
  const problem = await state(page, "#problemView .question-item", className, false);
  assertState(problem, `${stem}/문제`, type.sourceItemId, false);
  await page.screenshot({ path: path.join(outputDir, `${stem}-problem.png`), fullPage: true });
  screenshots += 1;
  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await state(page, "#problemView .question-item", className, false), `${stem}/A4 문제`, type.sourceItemId, false);
    const file = path.join(outputDir, `${stem}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${stem}: 문제 PDF가 비정상입니다.`); else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  const solution = await state(page, "#solutionView .solution-item", className, true);
  assertState(solution, `${stem}/풀이`, type.sourceItemId, true);
  await page.screenshot({ path: path.join(outputDir, `${stem}-solution.png`), fullPage: true });
  screenshots += 1;
  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await state(page, "#solutionView .solution-item", className, true), `${stem}/A4 풀이`, type.sourceItemId, true);
    const file = path.join(outputDir, `${stem}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${stem}: 풀이 PDF가 비정상입니다.`); else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (types.length !== 2) fail("예제 4-3·4-4 공개 유형 두 개를 찾을 수 없습니다.");
  for (const type of types) {
    if (type.reviewLocked || type.generationMode !== "fixed-verified-pool" || type.verifiedVariantCount !== 3) fail(`${type.sourceItemId}: 공개 계약이 다릅니다.`);
  }
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const type of types) {
      for (const difficulty of [-1, 0, 1]) {
        const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
        listen(desktop, `${type.sourceItemId}/desktop/${difficulty}`);
        await inspect(desktop, type, "desktop", difficulty, true);
        await desktop.close();
        const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
        listen(mobile, `${type.sourceItemId}/mobile/${difficulty}`);
        await inspect(mobile, type, "mobile", difficulty, false);
        await mobile.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 24 || pdfs !== 12) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/24, A4 ${pdfs}/12`);
  const summary = failures.length ? `실패:\n${failures.join("\n")}\n` : `통과: PC·390px 문제/풀이 화면 ${screenshots}장 · A4 PDF ${pdfs}개\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 6단원 예제 4-3·4-4 브라우저·A4 감사 통과: ${summary.trim()} · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 6단원 예제 4-3·4-4 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
