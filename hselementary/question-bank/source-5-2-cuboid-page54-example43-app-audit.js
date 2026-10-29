"use strict";
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const id = "5-2-u5-e4-example-4-3";
const base = process.env.HSE_BANK_URL || "http://127.0.0.1:8765/hselementary/question-bank/";
const out = process.env.MAC_CHECK_OUTPUT || fs.mkdtempSync(path.join(require("node:os").tmpdir(), "gfield-p54e43-"));
(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = { status: "running", sourceItemId: id, answer: "116", states: { problem: [], solution: [] }, errors: [], pdfPages: {} };
  try {
    fs.mkdirSync(out, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    page.on("pageerror", error => report.errors.push(error.message));
    const blockedExternal = [];
    await page.route("**/*", route => {
      const url = new URL(route.request().url());
      if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== new URL(base).origin) {
        blockedExternal.push(url.href);
        return route.abort();
      }
      return route.continue();
    });
    report.blockedExternal = blockedExternal;
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("#gradeFilter [data-grade='5']").click();
    await page.locator("#termFilter [data-term='2']").click();
    await page.locator("#unitFilter").selectOption("5-2-u5");
    const checkbox = page.locator(`input[data-type-id="${id}"]`);
    await checkbox.waitFor({ state: "attached" });
    if (await checkbox.count() !== 1 || await checkbox.isDisabled()) throw new Error("예제 4-3 유형이 없거나 생성 잠금 상태입니다.");
    await checkbox.check({ force: true });
    await page.locator("#generateButton").click();
    await page.waitForSelector(".source52-p54e43-question");
    const visible = await page.locator(".source52-p54e43-question").innerText();
    if (!visible.includes("눈 수의 합은 얼마인가요?") || await page.locator(".source52-p54e43-question .front-face").count() !== 6 || await page.locator(".source52-p54e43-question .top-face").count() !== 6) throw new Error("원문형 3×2×2 그림 또는 질문이 누락되었습니다.");
    await page.screenshot({ path: path.join(out, "app-problem-1440.png"), fullPage: true });
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(out, "app-problem-a4.pdf"), format: "A4", printBackground: true });
    report.pdfPages.problem = Number((fs.readFileSync(path.join(out, "app-problem-a4.pdf")).toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length);
    await page.emulateMedia({ media: "screen" });
    for (const width of [1440, 375, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const geometry = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, visibleBlockCount: Array.from(document.querySelectorAll(".source52-p54e43-block")).filter(svg => svg.getClientRects().length > 0).length }));
      if (geometry.scrollWidth > width || geometry.visibleBlockCount !== 1) throw new Error(`${width}px 문제 화면 렌더/넘침 오류: ${JSON.stringify(geometry)}`);
      report.states.problem.push(geometry);
      if (width !== 1440) await page.screenshot({ path: path.join(out, `app-problem-${width}.png`), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.locator("#solutionTab").click();
    await page.waitForSelector(".source52-p54e43-solution");
    const solution = await page.locator(".source52-p54e43-solution").innerText();
    if (!solution.includes("28 + 40 + 48 = 116") || !solution.includes("답: 116") || await page.locator(".source52-p54e43-solution li").count() !== 3) throw new Error("풀이의 세 축별 합 또는 답이 다릅니다.");
    await page.screenshot({ path: path.join(out, "app-solution-1440.png"), fullPage: true });
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: path.join(out, "app-solution-a4.pdf"), format: "A4", printBackground: true });
    report.pdfPages.solution = Number((fs.readFileSync(path.join(out, "app-solution-a4.pdf")).toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length);
    await page.emulateMedia({ media: "screen" });
    for (const width of [1440, 375, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const geometry = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, visibleBlockCount: Array.from(document.querySelectorAll(".source52-p54e43-block")).filter(svg => svg.getClientRects().length > 0).length }));
      if (geometry.scrollWidth > width || geometry.visibleBlockCount !== 1) throw new Error(`${width}px 풀이 화면 렌더/넘침 오류: ${JSON.stringify(geometry)}`);
      report.states.solution.push(geometry);
      if (width !== 1440) await page.screenshot({ path: path.join(out, `app-solution-${width}.png`), fullPage: true });
    }
    if (report.errors.length) throw new Error(report.errors.join("; "));
    if (report.pdfPages.problem !== 1 || report.pdfPages.solution !== 1) throw new Error(`A4 페이지 수 오류: ${JSON.stringify(report.pdfPages)}`);
    report.status = "passed";
    fs.writeFileSync(path.join(out, "app-audit.json"), JSON.stringify(report, null, 2) + "\n");
    console.log(JSON.stringify(report));
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
