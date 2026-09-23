"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");

const sourceItemId = "5-1-u6-e3-example-3-1";
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8898/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-5-1-u6-e3-example-3-1");
const failures = [];
let screenshots = 0;
let pdfs = 0;
const fail = message => failures.push(message);
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);

function listen(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|ERR_QUIC_PROTOCOL_ERROR|Failed to load resource:.*404/.test(message.text())) fail(`${label}: 콘솔 오류 ${message.text()}`);
  });
}

async function state(page, selector, solutionMode) {
  return page.evaluate(({ selector, solutionMode, sourceItemId }) => {
    const items = [...document.querySelectorAll(selector)];
    const figures = items.flatMap(item => [...item.querySelectorAll("svg.source51-e3-overlap")]);
    const clipped = element => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
    const overlaps = boxes => boxes.some((left, leftIndex) => boxes.some((right, rightIndex) => leftIndex < rightIndex && left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top));
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      itemCount: items.length,
      figureCount: figures.length,
      hidden: items.some(item => item.hidden || getComputedStyle(item).display === "none"),
      clipped: items.some(clipped) || figures.some(clipped),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      answerLeak: !solutionMode && figures.some(figure => figure.dataset.resultHighlight || figure.dataset.overlapArea),
      figures: figures.map(figure => {
        const nodes = [...figure.querySelectorAll(".source51-e3-overlap-measure,.source51-e3-overlap-point")];
        const boxes = nodes.map(node => node.getBoundingClientRect());
        return {
          width: figure.getBoundingClientRect().width,
          height: figure.getBoundingClientRect().height,
          sourceItem: figure.dataset.sourceItem,
          candidates: figure.dataset.answerCandidateCount,
          hasUnion: Boolean(figure.querySelector('[data-layout-role="shaded-union"]')),
          hasOverlap: Boolean(figure.querySelector('[data-layout-role="overlap-triangle"]')),
          pointLabels: [...figure.querySelectorAll('[data-layout-role="point-label"]')].map(node => node.textContent.trim()),
          measureCount: figure.querySelectorAll(".source51-e3-overlap-measure").length,
          labelsOverlap: overlaps(boxes),
          result: figure.dataset.resultHighlight || "",
          expectedSource: sourceItemId
        };
      })
    };
  }, { selector, solutionMode, sourceItemId });
}

function assertState(result, label, solutionMode) {
  if (result.pageOverflow) fail(`${label}: 페이지 가로 넘침이 있습니다.`);
  if (result.itemCount !== 3 || result.figureCount !== 3 || result.hidden) fail(`${label}: 고정 문항 3개가 모두 보이지 않습니다.`);
  if (result.clipped) fail(`${label}: 문항 또는 그림이 잘립니다.`);
  if (result.broken) fail(`${label}: 깨진 값이 보입니다.`);
  if (result.answerLeak) fail(`${label}: 문제 그림에 답이 노출됩니다.`);
  for (const [index, figure] of result.figures.entries()) {
    if (figure.width < 180 || figure.height < 95) fail(`${label} ${index + 1}: 그림 크기가 너무 작습니다.`);
    if (figure.sourceItem !== figure.expectedSource || figure.candidates !== "1") fail(`${label} ${index + 1}: 원본 ID 또는 단일 답 계약이 다릅니다.`);
    if (!figure.hasUnion || !figure.hasOverlap || figure.measureCount !== 3) fail(`${label} ${index + 1}: 색칠 영역·겹친 삼각형·세 길이 중 빠진 것이 있습니다.`);
    if (!["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ"].every(point => figure.pointLabels.includes(point))) fail(`${label} ${index + 1}: 점 이름이 빠졌습니다.`);
    if (figure.labelsOverlap) fail(`${label} ${index + 1}: 길이 또는 점 이름이 서로 겹칩니다.`);
    if (solutionMode && !figure.result) fail(`${label} ${index + 1}: 풀이 그림의 답 확인값이 없습니다.`);
  }
}

async function inspect(page, viewport, difficulty, withPdf) {
  const query = `?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`;
  await page.goto(`${baseUrl}${query}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const stem = `${sourceItemId}-${viewport}-d${difficulty}`;
  assertState(await state(page, "#problemView .question-item", false), `${stem}/문제`, false);
  await page.screenshot({ path: path.join(outputDir, `${stem}-problem.png`), fullPage: true });
  screenshots += 1;
  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await state(page, "#problemView .question-item", false), `${stem}/A4 문제`, false);
    const file = path.join(outputDir, `${stem}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${stem}: 문제 PDF가 비정상입니다.`); else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  assertState(await state(page, "#solutionView .solution-item", true), `${stem}/풀이`, true);
  await page.screenshot({ path: path.join(outputDir, `${stem}-solution.png`), fullPage: true });
  screenshots += 1;
  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await state(page, "#solutionView .solution-item", true), `${stem}/A4 풀이`, true);
    const file = path.join(outputDir, `${stem}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${stem}: 풀이 PDF가 비정상입니다.`); else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  if (!type || type.reviewLocked || type.generationMode !== "fixed-verified-pool" || type.verifiedVariantCount !== 3) fail("예제 3-1 공개 유형 계약이 다릅니다.");
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const difficulty of [-1, 0, 1]) {
      const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      listen(desktop, `desktop/${difficulty}`);
      await inspect(desktop, "desktop", difficulty, true);
      await desktop.close();
      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
      listen(mobile, `mobile/${difficulty}`);
      await inspect(mobile, "mobile", difficulty, false);
      await mobile.close();
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 12 || pdfs !== 6) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/12, A4 ${pdfs}/6`);
  const summary = failures.length ? `실패:\n${failures.join("\n")}\n` : `통과: PC·390px 문제/풀이 화면 ${screenshots}장 · A4 PDF ${pdfs}개\n`;
  fs.writeFileSync(path.join(outputDir, "audit-result.txt"), summary, "utf8");
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 6단원 예제 3-1 브라우저·A4 감사 통과: ${summary.trim()} · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 6단원 예제 3-1 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
