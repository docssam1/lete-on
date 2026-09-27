"use strict";

// Browser-only audit. Render files stay outside the repository by default.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");

const sourceItemId = "5-1-u6-e4-example-4-1";
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8895/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-5-1-u6-e4-example-4-1-browser-audit");
const summaryPath = path.join(outputDir, "audit-result.txt");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);

const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u6");
const type = unit?.subunits.flatMap(item => item.types).find(item => item.sourceItemId === sourceItemId);

function inspectCatalogContract() {
  if (!type) return fail("예제 4-1 유형을 찾을 수 없습니다.");
  if (type.generatorKey !== "source51TrapezoidShadedRatioHeightE4" || type.variant !== 2) fail("전용 생성기 또는 유형 분기가 다릅니다.");
  if (type.reviewLocked || type.generationMode !== "fixed-verified-pool" || type.verifiedVariantCount !== 3) fail("공개 고정 검증 묶음 계약이 다릅니다.");
  if (!type.answerVisualRequired || type.answerVisualStatus !== "verified") fail("정답 그림 공개 계약이 다릅니다.");
}

function listen(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|ERR_QUIC_PROTOCOL_ERROR|Failed to load resource:.*404/.test(message.text())) {
      fail(`${label}: 콘솔 오류 ${message.text()}`);
    }
  });
}

async function visualState(page, selector, solutionMode) {
  return page.evaluate(({ selector, solutionMode }) => {
    const nodes = [...document.querySelectorAll(selector)];
    const clip = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const figures = nodes.flatMap(node => [...node.querySelectorAll("svg.geometry-diagram.source51-e4-ratio-trapezoid")]);
    const figureStates = figures.map(svg => {
      const rect = svg.getBoundingClientRect();
      const labels = [...svg.querySelectorAll("text")].map(node => node.textContent.trim());
      return {
        width: rect.width,
        height: rect.height,
        clipped: clip(svg),
        target: svg.querySelector('[data-target-segment="ㅁㅂ"]')?.getAttribute("data-owner-id") || "",
        known: svg.querySelector('[data-known-segment="ㅂㅅ"]')?.getAttribute("data-owner-id") || "",
        targetHeight: svg.dataset.targetHeight || "",
        top: svg.dataset.topBase || "",
        bottom: svg.dataset.bottomBase || "",
        lowerHeight: svg.dataset.lowerHeight || "",
        hasRegionProse: [...svg.querySelectorAll("text")].some(node => /색칠한 부분|색칠하지 않은 부분/.test(node.textContent)),
        labels
      };
    });
    return {
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      count: nodes.length,
      hidden: nodes.some(node => node.hidden || getComputedStyle(node).display === "none"),
      clipped: nodes.some(clip) || figures.some(clip),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      answerLeak: !solutionMode && /ㅁㅂ\s*=\s*\d+\s*cm/.test(nodes.map(node => node.innerText).join("\n")),
      figures: figureStates
    };
  }, { selector, solutionMode });
}

function assertState(state, label, solutionMode) {
  if (state.pageOverflow) fail(`${label}: 가로 넘침이 있습니다.`);
  if (state.count !== 3 || state.hidden) fail(`${label}: 3문항이 모두 보이지 않습니다.`);
  if (state.clipped) fail(`${label}: 문항 또는 그림이 잘립니다.`);
  if (state.broken) fail(`${label}: 깨진 값이 보입니다.`);
  if (!solutionMode && state.answerLeak) fail(`${label}: 문제 화면에 ㅁㅂ의 답이 노출됩니다.`);
  if (state.figures.length !== 3) fail(`${label}: 사다리꼴 그림 3개가 렌더되지 않았습니다.`);
  for (const [index, figure] of state.figures.entries()) {
    if (figure.width < 180 || figure.height < 150 || figure.clipped) fail(`${label} ${index + 1}: 그림 크기 또는 잘림이 비정상입니다.`);
    if (figure.target !== "segment-ㅁㅂ" || figure.known !== "segment-ㅂㅅ") fail(`${label} ${index + 1}: ㅁㅂ·ㅂㅅ 그림 의미가 없습니다.`);
    if (figure.hasRegionProse) fail(`${label} ${index + 1}: 도형 안에 불필요한 색칠 설명 글씨가 남아 있습니다.`);
    if (!["ㅁ", "ㅂ", "ㅅ", `${figure.top} cm`, `${figure.bottom} cm`, `${figure.lowerHeight} cm`].every(labelText => figure.labels.includes(labelText))) {
      fail(`${label} ${index + 1}: 점 또는 이 변형의 밑변·아래 높이 표기가 빠졌습니다.`);
    }
    if (solutionMode && (!/^\d+$/.test(figure.targetHeight) || !figure.labels.some(text => text.startsWith("ㅁㅂ = ")) || !figure.labels.some(text => text.startsWith("전체 높이 ")))) {
      fail(`${label} ${index + 1}: 정답 그림의 ㅁㅂ 또는 전체 높이 표시가 없습니다.`);
    }
    if (!solutionMode && figure.targetHeight) fail(`${label} ${index + 1}: 문제 그림에 답 길이가 포함됩니다.`);
  }
}

async function inspect(page, viewportLabel, difficulty, withPdf) {
  const query = `?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`;
  await page.goto(`${baseUrl}${query}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const problemState = await visualState(page, "#problemView .question-item", false);
  assertState(problemState, `${viewportLabel}/난이도${difficulty}/문제`, false);
  await page.screenshot({ path: path.join(outputDir, `${viewportLabel}-d${difficulty}-problem.png`), fullPage: true });
  screenshots += 1;

  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await visualState(page, "#problemView .question-item", false), `A4/난이도${difficulty}/문제`, false);
    const pdf = path.join(outputDir, `a4-d${difficulty}-problem.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`A4/난이도${difficulty}/문제: PDF 생성이 비정상입니다.`);
    else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  const solutionState = await visualState(page, "#solutionView .solution-item", true);
  assertState(solutionState, `${viewportLabel}/난이도${difficulty}/정답`, true);
  await page.screenshot({ path: path.join(outputDir, `${viewportLabel}-d${difficulty}-solution.png`), fullPage: true });
  screenshots += 1;

  if (withPdf) {
    await page.emulateMedia({ media: "print" });
    assertState(await visualState(page, "#solutionView .solution-item", true), `A4/난이도${difficulty}/정답`, true);
    const pdf = path.join(outputDir, `a4-d${difficulty}-solution.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`A4/난이도${difficulty}/정답: PDF 생성이 비정상입니다.`);
    else pdfs += 1;
    await page.emulateMedia({ media: "screen" });
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  inspectCatalogContract();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const difficulty of [-1, 0, 1]) {
      const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      listen(desktop, `desktop/난이도${difficulty}`);
      await inspect(desktop, "desktop", difficulty, true);
      await desktop.close();
      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
      listen(mobile, `mobile/난이도${difficulty}`);
      await inspect(mobile, "mobile", difficulty, false);
      await mobile.close();
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 12 || pdfs !== 6) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/12, A4 ${pdfs}/6`);
  if (failures.length) {
    fs.writeFileSync(summaryPath, `실패:\n${failures.join("\n")}\n`, "utf8");
    throw new Error(failures.join("\n"));
  }
  const summary = `통과: PC·390px 문제/정답 화면 ${screenshots}장 · A4 PDF ${pdfs}개\n`;
  fs.writeFileSync(summaryPath, summary, "utf8");
  console.log(`5-1 6단원 예제 4-1 브라우저·A4 감사 통과: ${summary.trim()} · ${outputDir}`);
})().catch(error => {
  try { fs.writeFileSync(summaryPath, `실패:\n${error.stack || error}\n`, "utf8"); } catch (_) {}
  console.error(`5-1 6단원 예제 4-1 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
