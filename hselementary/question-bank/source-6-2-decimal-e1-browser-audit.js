"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = process.env.HSE_URL || "http://127.0.0.1:8896/hselementary/question-bank/";
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hse-6-2-decimal-e1-browser-audit");
const ids = ["6-2-u2-e1-exploration-1", "6-2-u2-e1-exploration-2", "6-2-u2-e1-example-1"];
const failures = [];

async function inspect(page, selector) {
  return page.evaluate(selected => {
    const nodes = [...document.querySelectorAll(selected)];
    return {
      count: nodes.length,
      text: nodes.map(node => node.innerText).join(" "),
      overflow: document.documentElement.scrollWidth > innerWidth + 1 || nodes.some(node => node.scrollWidth > node.clientWidth + 1)
    };
  }, selector);
}

async function check(browser, id, width, label) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.on("pageerror", error => failures.push(`${id} ${label}: ${error.message}`));
  await page.goto(`${baseUrl}?type=${id}&review=1`, { waitUntil: "domcontentloaded", timeout: 90000 });
  try {
    await page.locator("#worksheet:not([hidden])").waitFor({ state: "visible", timeout: 8000 });
  } catch (error) {
    const state = await page.evaluate(() => ({ title: document.title, scripts: [...document.scripts].map(script => script.src), worksheet: document.querySelector("#worksheet")?.outerHTML.slice(0, 200), body: document.body?.innerText.slice(0, 500) }));
    throw new Error(`${id} ${label}: 문제 화면을 열지 못했습니다. ${JSON.stringify(state)} / ${failures.join("; ")}`);
  }
  const problem = await inspect(page, "#problemView .question-item");
  if (!problem.count || !problem.text.trim() || problem.overflow) failures.push(`${id} ${label}: 문제 표시가 비었거나 넘침`);
  await page.screenshot({ path: path.join(outputDir, `${id}-${label}-problem.png`), fullPage: true });
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    if ((await inspect(page, "#problemView .question-item")).overflow) failures.push(`${id}: A4 문제 넘침`);
    await page.pdf({ path: path.join(outputDir, `${id}-problem.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen" });
  }
  await page.locator("#solutionTab").click();
  const solution = await inspect(page, "#solutionView .solution-item");
  if (!solution.count || !solution.text.trim() || solution.overflow) failures.push(`${id} ${label}: 풀이 표시가 비었거나 넘침`);
  await page.screenshot({ path: path.join(outputDir, `${id}-${label}-solution.png`), fullPage: true });
  if (label === "desktop") {
    await page.emulateMedia({ media: "print" });
    if ((await inspect(page, "#solutionView .solution-item")).overflow) failures.push(`${id}: A4 풀이 넘침`);
    await page.pdf({ path: path.join(outputDir, `${id}-solution.pdf`), format: "A4", printBackground: true, preferCSSPageSize: true });
  }
  await page.close();
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.HSE_CHROMIUM_EXECUTABLE || undefined });
  try {
    for (const id of ids) {
      await check(browser, id, 1280, "desktop");
      await check(browser, id, 390, "mobile");
    }
  } finally {
    await browser.close();
  }
  if (failures.length) throw new Error(failures.join("\n"));
  for (const id of ids) for (const suffix of ["problem", "solution"]) {
    if (fs.statSync(path.join(outputDir, `${id}-${suffix}.pdf`)).size < 5000) throw new Error(`${id}: A4 ${suffix} PDF가 비었습니다.`);
  }
  console.log(`6-2 소수 나눗셈 E1 브라우저 감사 통과: 3유형 · PC/모바일 12화면 · A4 6파일 · ${outputDir}`);
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
