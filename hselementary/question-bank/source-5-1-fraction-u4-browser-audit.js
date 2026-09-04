"use strict";

// Independent browser, mobile, and A4 audit for every source type in 5-1 U4.
// It deliberately reads rendered DOM and generator contracts separately.
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-1");
const unit = semester?.units.find(item => item.id === "5-1-u4");
const types = unit?.subunits.flatMap(subunit => subunit.types) || [];
const publicTypes = types.filter(type => !type.reviewLocked);
const lockedTypes = types.filter(type => type.reviewLocked);
const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8878/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(__dirname, "tmp", "u4-fraction-browser-audit");
const failures = [];
const captures = [];

function fail(message) {
  failures.push(message);
}

function typeSignature(type) {
  const generated = api.generate(type, 2, 0, 20260904, type.variant ?? 0);
  const match = generated?.prompt?.match(/\s(data-[\w-]+-kind)="([^"]+)"/);
  return match ? `${match[1]}=${match[2]}` : "";
}

function verifyCatalogData() {
  const expectedPrefixes = ["e1", "e2", "e3", "e4"];
  if (!unit) fail("5-1 4단원을 찾지 못했습니다.");
  if (types.length !== 44 || publicTypes.length !== 43 || lockedTypes.length !== 1) {
    fail(`유형 수가 다릅니다: 전체 ${types.length}/44, 공개 ${publicTypes.length}/43, 잠금 ${lockedTypes.length}/1`);
  }
  for (const prefix of expectedPrefixes) {
    const group = types.filter(type => type.sourceItemId?.startsWith(`5-1-u4-${prefix}-`));
    if (group.length !== 11) fail(`${prefix.toUpperCase()} 원문 유형 수가 ${group.length}개입니다. 11개여야 합니다.`);
    if (group.some(type => !type.sourceItemId || !type.label || !type.name)) fail(`${prefix.toUpperCase()}에 원문 ID 또는 유형명이 비어 있습니다.`);
  }
  const locked = lockedTypes[0];
  if (!locked || locked.sourceItemId !== "5-1-u4-e1-mission-6") fail("잠금 항목은 E1 Mission 6 하나여야 합니다.");
  if (locked && api.generatorKey(locked)) fail("E1 Mission 6 잠금 유형에 생성기가 연결되어 있습니다.");
  for (const type of publicTypes) {
    if (!api.generatorKey(type)) fail(`${type.sourceItemId}: 공개 유형에 생성기가 없습니다.`);
    if (!typeSignature(type)) fail(`${type.sourceItemId}: 생성 문제의 원문 분기 표지를 읽지 못했습니다.`);
  }
}

function auditConsole(page, label) {
  page.on("pageerror", error => fail(`${label}: page 오류 ${error.message}`));
  page.on("console", message => {
    const text = message.text();
    if (message.type() === "error" && !/ERR_NETWORK_ACCESS_DENIED|404/.test(text)) fail(`${label}: console 오류 ${text}`);
  });
}

async function capture(page, name) {
  const file = path.join(outputDir, name);
  await page.screenshot({ path: file, fullPage: true });
  captures.push(file);
}

async function chooseUnit(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await page.click('#gradeFilter [data-grade="5"]');
  await page.click('#termFilter [data-term="1"]');
  await page.selectOption("#unitFilter", "5-1-u4");
}

async function auditCatalog(browser, viewport, label) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  auditConsole(page, `${label} 목록`);
  await chooseUnit(page);
  const ids = await page.locator("[data-preview-type-id]").evaluateAll(rows => rows.map(row => row.dataset.previewTypeId));
  const expected = types.map(type => type.id);
  if (ids.length !== 44 || new Set(ids).size !== 44 || expected.some(id => !ids.includes(id))) {
    fail(`${label} 목록: 44개 원문 유형이 각각 한 줄로 보이지 않습니다.`);
  }

  for (const type of types) {
    const row = page.locator(`[data-preview-type-id="${type.id}"]`);
    if (await row.count() !== 1) {
      fail(`${label} ${type.sourceItemId}: 유형 행을 찾지 못했습니다.`);
      continue;
    }
    await row.scrollIntoViewIfNeeded();
    await row.click();
    const popover = page.locator("#typePreviewPopover:not([hidden])");
    await popover.waitFor({ state: "visible" });
    const state = await page.evaluate(({ id, mobile }) => {
      const row = document.querySelector(`[data-preview-type-id="${id}"]`);
      const popover = document.querySelector("#typePreviewPopover:not([hidden])");
      const tree = document.querySelector(".tree-pane");
      const composition = document.querySelector(".composition-pane");
      const rect = element => element?.getBoundingClientRect();
      const intersects = (a, b) => a && b && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      const popoverRect = rect(popover);
      const rowRect = rect(row);
      const treeRect = rect(tree);
      const compositionRect = rect(composition);
      const style = popover ? getComputedStyle(popover) : null;
      const clipped = Boolean(popover && ((["hidden", "clip"].includes(style.overflowX) && popover.scrollWidth > popover.clientWidth + 1) || (["hidden", "clip"].includes(style.overflowY) && popover.scrollHeight > popover.clientHeight + 1)));
      return {
        text: popover?.innerText || "",
        pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        clipped,
        overlapRow: intersects(popoverRect, rowRect),
        desktopInSpace: mobile ? true : Boolean(popoverRect && compositionRect && popoverRect.left >= compositionRect.left - 1 && popoverRect.right <= compositionRect.right + 1),
        desktopOverTree: mobile ? false : intersects(popoverRect, treeRect),
        mobileAdjacent: mobile ? popover?.previousElementSibling === row : true
      };
    }, { id: type.id, mobile: label === "mobile" });
    if (!state.text.includes(type.label)) fail(`${label} ${type.sourceItemId}: 미리보기 제목이 다릅니다.`);
    if (state.pageOverflow || state.clipped || state.overlapRow || !state.desktopInSpace || state.desktopOverTree || !state.mobileAdjacent) {
      fail(`${label} ${type.sourceItemId}: 미리보기가 가용 공간을 벗어나거나 목록을 가립니다.`);
    }
    if (type.reviewLocked) {
      const reason = type.reviewReason || "원문 구조와 정답을 더 확인해야 합니다.";
      if (!state.text.includes("검수 대기") || !state.text.includes(reason)) fail(`${label} ${type.sourceItemId}: 잠금 상태 또는 잠금 이유가 보이지 않습니다.`);
    } else if (!state.text.includes("대표 문제")) {
      fail(`${label} ${type.sourceItemId}: 공개 유형의 대표 문제가 보이지 않습니다.`);
    }
    await page.locator("[data-close-type-preview]").click();
  }
  await capture(page, `catalog-${label}.png`);
  await page.close();
}

function reportedContract(pageState, type, label) {
  if (pageState.pageOverflow) fail(`${type.sourceItemId} ${label}: 가로 넘침이 있습니다.`);
  if (pageState.broken) fail(`${type.sourceItemId} ${label}: undefined, NaN, Infinity 또는 null이 보입니다.`);
  if (pageState.count !== 3 || pageState.empty) fail(`${type.sourceItemId} ${label}: 생성 문항이 세 개 모두 보이지 않습니다.`);
  if (pageState.clipped || pageState.overlap) fail(`${type.sourceItemId} ${label}: 긴 문장·답 집합·수식이 잘리거나 겹칩니다.`);
}

async function renderedState(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    const isClipped = element => {
      const style = getComputedStyle(element);
      return (["hidden", "clip"].includes(style.overflowX) && element.scrollWidth > element.clientWidth + 1)
        || (["hidden", "clip"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1);
    };
    const overlap = node => {
      const boxes = [...node.children].map(element => element.getBoundingClientRect()).filter(box => box.width > 1 && box.height > 1);
      return boxes.some((a, index) => boxes.slice(index + 1).some(b => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1 && Math.abs(a.top - b.top) > 3));
    };
    const fractions = nodes.flatMap(node => [...node.querySelectorAll(".math-fraction")]);
    const fractionBad = fractions.some(fraction => {
      const parts = fraction.children;
      if (parts.length !== 2) return true;
      const numerator = parts[0].getBoundingClientRect();
      const denominator = parts[1].getBoundingClientRect();
      return numerator.width < 1 || denominator.width < 1 || numerator.bottom > denominator.top + 1;
    });
    const signatures = nodes.map(node => [...node.querySelectorAll("[hidden]")].map(element => {
      const attribute = [...element.attributes].find(item => item.name.endsWith("-kind"));
      return attribute ? `${attribute.name}=${attribute.value}` : "";
    }).filter(Boolean).join("|"));
    return {
      count: nodes.length,
      empty: nodes.some(node => !node.innerText.trim()),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: nodes.some(isClipped),
      overlap: nodes.some(overlap),
      broken: /undefined|null|NaN|Infinity|\$\{/.test(document.body.innerText),
      fractionCount: fractions.length,
      fractionBad,
      rawSlash: nodes.some(node => /(^|[^0-9])\d+\/\d+(?![0-9])/.test(node.innerText)),
      answers: nodes.map(node => node.querySelector("header strong")?.innerText.trim() || ""),
      prompts: nodes.map(node => node.querySelector(".question-prompt")?.innerText.trim() || ""),
      signatures,
      solutionLeak: document.querySelectorAll("#problemView .solution-item").length > 0 || !document.querySelector("#solutionView")?.hidden
    };
  }, selector);
}

async function auditGeneratedType(browser, type, viewport, label, createPdf) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);
  auditConsole(page, `${type.sourceItemId} ${label}`);
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible" });
  const problem = await renderedState(page, "#problemView .question-item");
  reportedContract(problem, type, `${label} 문제`);
  if ((problem.fractionCount && problem.fractionBad) || problem.rawSlash) fail(`${type.sourceItemId} ${label}: 분수가 공통 세로 분수 DOM으로 렌더되지 않았습니다.`);
  if (problem.solutionLeak) fail(`${type.sourceItemId} ${label}: 문제 화면에 정답 또는 풀이가 노출됩니다.`);
  const expected = typeSignature(type);
  if (problem.signatures.some(signature => signature !== expected)) {
    fail(`${type.sourceItemId} ${label}: 선택한 원문 유형(${expected})과 생성 문제 분기(${problem.signatures.join(" | ")})가 일치하지 않습니다.`);
  }
  if (new Set(problem.prompts).size !== 3) fail(`${type.sourceItemId} ${label}: 세 생성 문항이 고정 문제를 반복합니다.`);
  if (createPdf) {
    await page.emulateMedia({ media: "print" });
    const printed = await renderedState(page, "#problemView .question-item");
    reportedContract(printed, type, "A4 문제");
    if (printed.solutionLeak) fail(`${type.sourceItemId} A4 문제: 정답·풀이가 문제지에 섞입니다.`);
    const file = path.join(outputDir, `${type.id}-problem.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${type.sourceItemId} A4 문제: PDF 생성이 비정상입니다.`);
    await page.emulateMedia({ media: "screen" });
  }
  await page.click("#solutionTab");
  const solution = await renderedState(page, "#solutionView .solution-item");
  reportedContract(solution, type, `${label} 정답·풀이`);
  if ((solution.fractionCount && solution.fractionBad) || solution.rawSlash) fail(`${type.sourceItemId} ${label} 정답·풀이: 분수 수식 공통 렌더가 깨졌습니다.`);
  if (new Set(solution.answers).size < 2 || solution.answers.some(answer => !answer)) fail(`${type.sourceItemId} ${label} 정답·풀이: 답 다양성 또는 답 표시가 부족합니다.`);
  if (createPdf) {
    await page.emulateMedia({ media: "print" });
    const printed = await renderedState(page, "#solutionView .solution-item");
    reportedContract(printed, type, "A4 정답·풀이");
    const file = path.join(outputDir, `${type.id}-solution.pdf`);
    await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true });
    if (!fs.existsSync(file) || fs.statSync(file).size < 5000) fail(`${type.sourceItemId} A4 정답·풀이: PDF 생성이 비정상입니다.`);
  }
  await page.close();
}

async function auditLockedRoute(browser) {
  const type = lockedTypes[0];
  if (!type) return;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${baseUrl}?type=${encodeURIComponent(type.id)}&review=1&difficulty=0`, { waitUntil: "domcontentloaded", timeout: 90000 });
  const state = await page.evaluate(() => ({
    worksheet: !document.querySelector("#worksheet")?.hidden,
    disabled: document.querySelector("#generateButton")?.disabled === true,
    selected: document.querySelector("#selectedTypeCount")?.textContent,
    text: document.body.innerText
  }));
  if (state.worksheet || !state.disabled || state.selected !== "0" || !state.text.includes("검수 대기")) fail(`${type.sourceItemId}: 잠금 유형의 생성 경로 또는 잠금 이유 표시가 잘못되었습니다.`);
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  verifyCatalogData();
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  await auditCatalog(browser, { width: 1440, height: 900 }, "desktop");
  await auditCatalog(browser, { width: 390, height: 844 }, "mobile");
  await auditLockedRoute(browser);
  for (const type of publicTypes) {
    await auditGeneratedType(browser, type, { width: 1440, height: 900 }, "desktop", true);
    await auditGeneratedType(browser, type, { width: 390, height: 844 }, "mobile", false);
  }
  await browser.close();
  if (failures.length) throw new Error(failures.join("\n"));
  console.log(`5-1 U4 분수 전체 브라우저·A4 감사 통과: 44유형(공개 43/잠금 1) · PC·모바일 목록과 생성 · A4 문제·정답 ${publicTypes.length * 2}개 · ${outputDir}`);
})().catch(error => {
  console.error(`5-1 U4 분수 전체 브라우저·A4 감사 실패: ${error.stack || error}`);
  process.exit(1);
});
