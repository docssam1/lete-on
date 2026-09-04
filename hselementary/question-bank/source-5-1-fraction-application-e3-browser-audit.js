"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u5");
const application = unit?.subunits.find(item => item.types?.some(type => type.sourceItemId?.startsWith("5-1-u5-e3-")));
const types = application?.types || [];
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "5-1-fraction-application-e3-browser-audit");
const failures = [];
let screenshots = 0;
let pdfs = 0;

const fail = message => failures.push(message);
const keyFor = (type, viewport, difficulty) => `${type.sourceItemId}-${viewport}-difficulty-${difficulty}`;

function verifyCatalogContract() {
  if (!unit || !application) fail("5-1 5단원 분수의 덧셈과 뺄셈 활용 소단원을 찾지 못했습니다.");
  if (types.length !== 11) fail(`분수의 활용 유형 수가 11개가 아닙니다: ${types.length}`);
  if (types.some(type => !type.sourceItemId?.startsWith("5-1-u5-e3-"))) fail("분수의 활용 목록에 다른 소단원 유형이 섞였습니다.");
  if (types.filter(type => type.reviewLocked).length !== 0) fail("E3 11유형에 검수 뒤에도 잠금 상태가 남아 있습니다.");
  for (const type of types) {
    if (api.generatorKey(type) !== "fractionApplicationE3") fail(`${type.sourceItemId}: 전용 생성기가 연결되지 않았습니다.`);
    if (!type.sourceVerified || type.sourceTier !== "advanced") fail(`${type.sourceItemId}: 심화 원문 확인 상태가 다릅니다.`);
  }
}

function listenForPageErrors(page, label) {
  page.on("pageerror", error => fail(`${label}: 브라우저 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|ERR_QUIC_PROTOCOL_ERROR|Failed to load resource:.*404/.test(text)) {
      fail(`${label}: 콘솔 오류 ${text}`);
    }
  });
}

async function chooseUnit(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u5");
}

async function inspectCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  listenForPageErrors(page, `${label} 목록`);
  await chooseUnit(page);
  const ids = await page.locator("[data-preview-type-id]").evaluateAll(rows => rows.map(row => row.dataset.previewTypeId).filter(Boolean));
  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (!ids.includes(type.id) || await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 목록 행을 찾지 못했습니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(id => {
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const row = document.querySelector(`[data-preview-type-id="${id}"]`);
      const rect = element => element?.getBoundingClientRect();
      const overlaps = (left, right) => left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1;
      const clips = element => {
        if (!element) return true;
        const style = getComputedStyle(element);
        return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
          || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
      };
      const coveredControl = control => {
        const controlRect = rect(control);
        if (!popover || !controlRect || !overlaps(rect(popover), controlRect)) return false;
        const x = Math.max(0, Math.min(innerWidth - 1, controlRect.left + controlRect.width / 2));
        const y = Math.max(0, Math.min(innerHeight - 1, controlRect.top + controlRect.height / 2));
        return document.elementFromPoint(x, y)?.closest("#typePreviewPopover") === popover;
      };
      return {
        text: popover?.innerText || "",
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        clipped: clips(popover),
        coversSelectedRow: overlaps(rect(popover), rect(row)),
        coversControl: [document.querySelector("#generateButton"), document.querySelector("#questionCountInput"), document.querySelector("#difficultyFilter")].some(coveredControl)
      };
    }, type.id);
    if (!state.text.includes(type.label) || !state.text.includes("대표 문제")) fail(`${label} ${type.sourceItemId}: 미리보기 제목 또는 대표 문제가 보이지 않습니다.`);
    if (state.pageOverflow || state.clipped || state.coversSelectedRow || state.coversControl) fail(`${label} ${type.sourceItemId}: 미리보기가 잘리거나 선택 행·조작 버튼을 가립니다.`);
    await page.locator("[data-close-type-preview]").click();
  }
  await page.screenshot({ path: path.join(outputDir, `catalog-${label}.png`), fullPage: true });
  screenshots += 1;
  await page.close();
}

function cssClips(element) {
  if (!element) return true;
  const style = getComputedStyle(element);
  return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
    || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
}

function cubeState(cube) {
  const overlaps = (left, right) => left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1;
  const vertices = Object.fromEntries((cube.dataset.vertices || "").split("|").map(part => {
    const [name, values] = part.split(":");
    return [name, values];
  }));
  const edges = (cube.dataset.edges || "").split(",").filter(Boolean);
  const hidden = (cube.dataset.hiddenEdges || "").split(",").filter(Boolean);
  const svg = cube.querySelector("svg");
  const svgRect = svg?.getBoundingClientRect();
  const pointFor = line => {
    const x = Number(line.getAttribute("x1"));
    const y = Number(line.getAttribute("y1"));
    const x2 = Number(line.getAttribute("x2"));
    const y2 = Number(line.getAttribute("y2"));
    if (!svgRect || !Number.isFinite(x + y + x2 + y2)) return null;
    const viewBox = svg.viewBox.baseVal;
    return {
      x1: svgRect.left + x / viewBox.width * svgRect.width,
      y1: svgRect.top + y / viewBox.height * svgRect.height,
      x2: svgRect.left + x2 / viewBox.width * svgRect.width,
      y2: svgRect.top + y2 / viewBox.height * svgRect.height
    };
  };
  const distanceToSegment = (x, y, line) => {
    const dx = line.x2 - line.x1;
    const dy = line.y2 - line.y1;
    const lengthSquared = dx * dx + dy * dy;
    if (!lengthSquared) return Infinity;
    const t = Math.max(0, Math.min(1, ((x - line.x1) * dx + (y - line.y1) * dy) / lengthSquared));
    return Math.hypot(x - (line.x1 + t * dx), y - (line.y1 + t * dy));
  };
  const lines = [...cube.querySelectorAll("line")].map(pointFor).filter(Boolean);
  const labels = [...cube.querySelectorAll(".e3-cube-label")].map(label => {
    const rect = label.getBoundingClientRect();
    return { vertex: label.dataset.vertex, text: label.textContent.replace(/\s+/g, ""), rect };
  });
  const labelOverlaps = labels.some((label, index) => labels.slice(index + 1).some(other => overlaps(label.rect, other.rect)));
  const labelsOnLine = labels.filter(label => {
    const x = label.rect.left + label.rect.width / 2;
    const y = label.rect.top + label.rect.height / 2;
    return lines.some(line => distanceToSegment(x, y, line) < 1);
  });
  return { vertices, edges, hidden, lines: lines.length, labels, labelOverlaps, labelsOnLine: labelsOnLine.map(label => label.vertex), width: cube.getBoundingClientRect().width, height: cube.getBoundingClientRect().height };
}

async function renderedState(page, selector) {
  return page.evaluate(selected => {
    const clips = element => {
      if (!element) return true;
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const inspectCube = cube => {
      const overlaps = (left, right) => left && right && left.left < right.right - 1 && left.right > right.left + 1 && left.top < right.bottom - 1 && left.bottom > right.top + 1;
      const vertices = Object.fromEntries((cube.dataset.vertices || "").split("|").map(part => {
        const [name, values] = part.split(":");
        return [name, values];
      }));
      const edges = (cube.dataset.edges || "").split(",").filter(Boolean);
      const hidden = (cube.dataset.hiddenEdges || "").split(",").filter(Boolean);
      const svg = cube.querySelector("svg");
      const svgRect = svg?.getBoundingClientRect();
      const pointFor = line => {
        const x = Number(line.getAttribute("x1"));
        const y = Number(line.getAttribute("y1"));
        const x2 = Number(line.getAttribute("x2"));
        const y2 = Number(line.getAttribute("y2"));
        if (!svgRect || !Number.isFinite(x + y + x2 + y2)) return null;
        const viewBox = svg.viewBox.baseVal;
        return { x1: svgRect.left + x / viewBox.width * svgRect.width, y1: svgRect.top + y / viewBox.height * svgRect.height, x2: svgRect.left + x2 / viewBox.width * svgRect.width, y2: svgRect.top + y2 / viewBox.height * svgRect.height };
      };
      const distanceToSegment = (x, y, line) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const lengthSquared = dx * dx + dy * dy;
        if (!lengthSquared) return Infinity;
        const t = Math.max(0, Math.min(1, ((x - line.x1) * dx + (y - line.y1) * dy) / lengthSquared));
        return Math.hypot(x - (line.x1 + t * dx), y - (line.y1 + t * dy));
      };
      const lines = [...cube.querySelectorAll("line")].map(pointFor).filter(Boolean);
      const labels = [...cube.querySelectorAll(".e3-cube-label")].map(label => {
        const rect = label.getBoundingClientRect();
        return { vertex: label.dataset.vertex, text: label.textContent.replace(/\s+/g, ""), rect };
      });
      const labelOverlaps = labels.some((label, index) => labels.slice(index + 1).some(other => overlaps(label.rect, other.rect)));
      const labelsOnLine = labels.filter(label => {
        const x = label.rect.left + label.rect.width / 2;
        const y = label.rect.top + label.rect.height / 2;
        return lines.some(line => distanceToSegment(x, y, line) < 1);
      });
      return { vertices, edges, hidden, lines: lines.length, labels, labelOverlaps, labelsOnLine: labelsOnLine.map(label => label.vertex), width: cube.getBoundingClientRect().width, height: cube.getBoundingClientRect().height };
    };
    const nodes = [...document.querySelectorAll(selected)];
    const fractions = nodes.flatMap(node => [...node.querySelectorAll(".math-fraction")]);
    const fractionBad = fractions.some(fraction => {
      const [numerator, denominator] = fraction.children;
      if (!numerator || !denominator) return true;
      const top = numerator.getBoundingClientRect();
      const bottom = denominator.getBoundingClientRect();
      const fractionBox = fraction.getBoundingClientRect();
      return top.width < 1 || bottom.width < 1 || fractionBox.width < 1 || top.bottom > bottom.top + 1;
    });
    const mixedBad = nodes.flatMap(node => [...node.querySelectorAll(".math-mixed-number")]).some(mixed => {
      const fraction = mixed.querySelector(":scope > .math-fraction");
      if (!fraction) return true;
      const mixedBox = mixed.getBoundingClientRect();
      const fractionBox = fraction.getBoundingClientRect();
      return fractionBox.top < mixedBox.top - 2 || fractionBox.bottom > mixedBox.bottom + 2 || fractionBox.width < 1;
    });
    const checkNodes = [
      ...nodes,
      ...nodes.flatMap(node => [...node.querySelectorAll(".question-prompt, .solution-item p, .equation, .sequence, .number-cards, .problem-table, .math-mixed-number, .e3-cube-diagram")]),
      ...document.querySelectorAll(".print-page")
    ];
    return {
      count: nodes.length,
      empty: nodes.some(node => !node.innerText.trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: checkNodes.some(clips),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      fractionCount: fractions.length,
      fractionBad,
      mixedBad,
      answers: nodes.map(node => node.querySelector("header strong")?.innerText.replace(/\s+/g, " ").trim() || ""),
      rows: nodes.map(node => node.querySelector("header b")?.textContent.trim() || ""),
      solutionVisible: !document.querySelector("#solutionView")?.hidden && getComputedStyle(document.querySelector("#solutionView")).display !== "none",
      solutionLeak: document.querySelectorAll("#problemView .solution-item").length > 0,
      cardCount: nodes.flatMap(node => [...node.querySelectorAll(".number-cards .digit-card")]).length,
      cube: nodes.flatMap(node => [...node.querySelectorAll(".e3-cube-diagram")]).map(inspectCube)
    };
  }, selector);
}

function reportCube(state, key, view, difficulty) {
  if (state.cube.length !== 3) fail(`${key} ${view}: 정육면체 그림 3개가 모두 보이지 않습니다.`);
  for (const [index, cube] of state.cube.entries()) {
    const expectedEdges = ["AB", "AC", "AG", "BD", "BH", "CD", "CE", "DF", "EF", "EG", "FH", "GH"];
    if (cube.width < 180 || cube.height < 150) fail(`${key} ${view} ${index + 1}번: 정육면체 그림이 너무 작습니다.`);
    if (Object.keys(cube.vertices).sort().join(",") !== "A,B,C,D,E,F,G,H") fail(`${key} ${view} ${index + 1}번: 꼭짓점 8개 자료가 정확하지 않습니다.`);
    if ([...cube.edges].sort().join(",") !== expectedEdges.join(",") || cube.lines !== 12) fail(`${key} ${view} ${index + 1}번: 모서리 12개가 정확하지 않습니다.`);
    if ([...cube.hidden].sort().join(",") !== "AG,GH") fail(`${key} ${view} ${index + 1}번: 숨은 모서리 점선이 AG·GH 두 개가 아닙니다.`);
    const labels = Object.fromEntries(cube.labels.map(label => [label.vertex, label.text]));
    if (labels.C !== "가" || labels.G !== "나" || labels.F !== "다") fail(`${key} ${view} ${index + 1}번: C=(가), G=(나), F=(다) 위치가 아닙니다.`);
    if (difficulty === -1 && cube.vertices.H !== "9,4") fail(`${key} ${view} ${index + 1}번: 원본 기준 H=2와1/4가 아닙니다.`);
    if (cube.labelOverlaps || cube.labelsOnLine.length) fail(`${key} ${view} ${index + 1}번: 꼭짓점 라벨 ${cube.labelsOnLine.join(",") || "서로"}가 선과 겹칩니다.`);
  }
}

function reportState(state, type, key, view, difficulty) {
  if (state.pageOverflow) fail(`${key} ${view}: 가로 넘침이 있습니다.`);
  if (state.count !== 3 || state.empty) fail(`${key} ${view}: 생성 문항 3개가 모두 보이지 않습니다.`);
  if (state.clipped) fail(`${key} ${view}: 수식·문항 상자가 가로 또는 세로로 잘립니다.`);
  if (state.broken) fail(`${key} ${view}: 깨진 값이 보입니다.`);
  const answerMayHaveNoFraction = type.sourceItemId === "5-1-u5-e3-mission-6" && view.includes("정답");
  if ((!answerMayHaveNoFraction && state.fractionCount < 1) || state.fractionBad) fail(`${key} ${view}: 분수의 분자·분모 기준선 또는 크기가 비정상입니다.`);
  if (state.mixedBad) fail(`${key} ${view}: 대분수의 자연수와 분수 부분 기준선이 맞지 않습니다.`);
  if (type.sourceItemId === "5-1-u5-e3-exploration" && view.includes("문제")) reportCube(state, key, view, difficulty);
}

async function captureCubeRepresentative(page, key, view, print) {
  await page.screenshot({ path: path.join(outputDir, `cube-${key}-${view}${print ? "-a4" : ""}.png`), fullPage: true });
  screenshots += 1;
}

async function inspectType(browser, type, viewport, viewportLabel, difficulty) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const key = keyFor(type, viewportLabel, difficulty);
  page.setDefaultTimeout(60000);
  listenForPageErrors(page, key);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=${difficulty}`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const selected = await page.evaluate(() => ({
    count: document.querySelector("#selectedTypeCount")?.textContent.trim(),
    reviewRows: document.querySelectorAll("#reviewSelectedTypes > div").length,
    questionRows: document.querySelectorAll("#reviewQuestionList a").length
  }));
  if (selected.count !== "1" || selected.reviewRows !== 1 || selected.questionRows !== 3) fail(`${key}: 한 유형 선택의 목록 또는 문항 수가 다릅니다.`);

  let state = await renderedState(page, "#problemView .question-item");
  reportState(state, type, key, "문제", difficulty);
  if (state.solutionVisible || state.solutionLeak) fail(`${key} 문제: 정답·풀이가 문제 화면에 섞였습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-problem.png`), fullPage: true });
  screenshots += 1;
  if (type.sourceItemId === "5-1-u5-e3-exploration" && difficulty === -1) await captureCubeRepresentative(page, viewportLabel, "problem", false);

  if (difficulty === 0 && viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#problemView .question-item");
    reportState(state, type, key, "A4 문제", difficulty);
    if (state.solutionVisible || state.solutionLeak) fail(`${key} A4 문제: 정답·풀이가 문제지에 섞였습니다.`);
    const pdf = path.join(outputDir, `${type.sourceItemId}-problem.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 문제: PDF 생성이 비정상입니다.`);
    pdfs += 1;
    if (type.sourceItemId === "5-1-u5-e3-exploration") await captureCubeRepresentative(page, "desktop", "problem", true);
    await page.emulateMedia({ media: "screen" });
  }

  await page.click("#solutionTab");
  state = await renderedState(page, "#solutionView .solution-item");
  reportState(state, type, key, "정답·풀이", difficulty);
  if (!state.solutionVisible) fail(`${key} 정답·풀이: 정답 탭이 열리지 않습니다.`);
  if (state.rows.join(",") !== "1,2,3" || state.answers.some(answer => !answer)) fail(`${key} 정답·풀이: 생성 문항마다 정답 한 줄이 없습니다.`);
  await page.screenshot({ path: path.join(outputDir, `${key}-solution.png`), fullPage: true });
  screenshots += 1;
  if (type.sourceItemId === "5-1-u5-e3-exploration" && difficulty === -1 && viewportLabel === "desktop") await captureCubeRepresentative(page, "desktop", "solution", false);

  if (difficulty === 0 && viewportLabel === "desktop") {
    await page.emulateMedia({ media: "print" });
    state = await renderedState(page, "#solutionView .solution-item");
    reportState(state, type, key, "A4 정답·풀이", difficulty);
    if (state.rows.join(",") !== "1,2,3") fail(`${key} A4 정답·풀이: 문항별 정답 행 수가 다릅니다.`);
    const pdf = path.join(outputDir, `${type.sourceItemId}-solution.pdf`);
    await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(pdf) || fs.statSync(pdf).size < 5000) fail(`${key} A4 정답·풀이: PDF 생성이 비정상입니다.`);
    pdfs += 1;
    if (type.sourceItemId === "5-1-u5-e3-exploration") await captureCubeRepresentative(page, "desktop", "solution", true);
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  verifyCatalogContract();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    await inspectCatalog(browser, { width: 1440, height: 900 }, "desktop");
    await inspectCatalog(browser, { width: 390, height: 844 }, "mobile");
    for (const difficulty of [-1, 0, 1]) for (const type of types) {
      await inspectType(browser, type, { width: 1440, height: 900 }, "desktop", difficulty);
      await inspectType(browser, type, { width: 390, height: 844 }, "mobile", difficulty);
    }
  } finally {
    await browser.close();
  }
  if (screenshots !== 139 || pdfs !== 22) fail(`검수 산출물 수가 다릅니다: 화면 ${screenshots}/139, A4 ${pdfs}/22`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 분수의 덧셈과 뺄셈 활용 E3 브라우저·A4 감사 통과: 11유형 · 난이도 3단계 · PC/모바일 화면 ${screenshots}장 · A4 문제·정답 ${pdfs}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 분수의 덧셈과 뺄셈 활용 E3 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
