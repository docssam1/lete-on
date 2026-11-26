"use strict";
// 2026-11-25: A4 인쇄 글꼴 명조 통일 감사.
// - print-typography.css가 index.html의 마지막 스타일인지(앞의 문항별 글꼴 지정을 덮는지) 본다.
// - 앱 인쇄 메뉴로 문제·정답·풀이·빠른 정답을 만든 뒤 print 미디어에서 글자 요소의 실제 렌더 글꼴(CDP)을 모은다.
//   CSS 글꼴 이름이 아니라 실제로 그려진 글꼴을 본다(Windows에서 ㉮가 Malgun Gothic으로 대체되던 문제).
// - 화면 글꼴은 Pretendard 그대로, 돌린 숫자 문항의 그림 글자는 명조로 바꾸지 않는지 본다.
// 필요: HSE_PLAYWRIGHT_PATH, HSE_CHROMIUM_EXECUTABLE(선택), HSE_BASE_URL(문제은행 주소, 끝 /).
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const links = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="\.\/([^"?]+)/g)].map(match => match[1]);
assert.equal(links.at(-1), "print-typography.css", "print-typography.css must be the last stylesheet");
const css = fs.readFileSync(path.join(__dirname, "print-typography.css"), "utf8");
for (const weight of ["400", "600", "700"]) assert.match(css, new RegExp(`noto-serif-kr-korean-${weight}-normal\\.woff2`));
for (const keep of [".long-operation", ".source-division-work", ".equation-boxes", ".digital-number"]) assert.ok(css.includes(keep), `${keep} keeps its fixed-width font`);

const base = process.env.HSE_BASE_URL;
if (!base || !process.env.HSE_PLAYWRIGHT_PATH) {
  console.log("PASS (static only): set HSE_BASE_URL and HSE_PLAYWRIGHT_PATH for the browser check");
  process.exit(0);
}
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH);
const TYPES = ["4-2-u4-t2-7", "6-2-u4-e2-mission-3", "6-2-u3-e1-example-2", "4-1-u2-t1"];
// 명조 파일에 없는 기호는 저장소 Pretendard가 이어 받는다.
const SYMBOL_ONLY = /^[\s①-⑳□■○●△▲☆★→←↑↓∠·,.()]*$/;

async function renderedFonts(page, selector) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  await page.evaluate(sel => {
    let n = 0;
    for (const el of document.querySelectorAll(sel)) {
      if ([...el.childNodes].some(child => child.nodeType === 3 && child.textContent.trim())) el.setAttribute("data-font-probe", String(n++));
    }
  }, selector);
  const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "[data-font-probe]" });
  const rows = [];
  for (const nodeId of nodeIds) {
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId });
    const text = outerHTML.replace(/<[^>]*>/g, "").trim();
    rows.push({ fonts: fonts.map(font => font.familyName), text });
  }
  await page.evaluate(() => document.querySelectorAll("[data-font-probe]").forEach(el => el.removeAttribute("data-font-probe")));
  return rows;
}

(async () => {
  const browser = await chromium.launch(process.env.HSE_CHROMIUM_EXECUTABLE ? { executablePath: process.env.HSE_CHROMIUM_EXECUTABLE } : {});
  const summary = [];
  try {
    for (const id of TYPES) {
      for (const mode of ["problem", "solution", "answer-key"]) {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        await page.addInitScript(() => { window.print = () => { window.__printCalls = (window.__printCalls || 0) + 1; }; });
        await page.goto(new URL(`?type=${encodeURIComponent(id)}&review=1`, base).href);
        await page.locator("#worksheet:not([hidden])").waitFor();
        if (mode === "problem") {
          const screenFont = await page.locator("#problemView .question-prompt").first().evaluate(el => getComputedStyle(el).fontFamily);
          assert.match(screenFont, /^Pretendard/, `${id}: screen font stays Pretendard`);
        }
        await page.locator("#printMenuButton").click();
        await page.locator(`#printMenuList [data-print-mode="${mode}"]`).click();
        await page.waitForFunction(() => window.__printCalls > 0, null, { timeout: 20000 });
        await page.emulateMedia({ media: "print" });
        await page.evaluate(() => document.fonts.ready);
        const view = mode === "problem" ? "#problemView" : mode === "solution" ? "#solutionView" : "#answerKeyView";
        const rows = await renderedFonts(page, `${view} :is(.question-item,.solution-item,.answer-key-page) *`);
        assert.ok(rows.length > 0, `${id} ${mode}: no printed text found`);
        for (const row of rows) {
          const foreign = row.fonts.filter(name => !/^Noto Serif KR/.test(name));
          if (!foreign.length) continue;
          assert.ok(foreign.every(name => /^Pretendard/.test(name)), `${id} ${mode}: "${row.text.slice(0, 40)}" printed with ${foreign.join(", ")}`);
          assert.ok(row.fonts.some(name => /^Noto Serif KR/.test(name)) || SYMBOL_ONLY.test(row.text), `${id} ${mode}: "${row.text.slice(0, 40)}" is not serif`);
        }
        summary.push(`${id} ${mode}: ${rows.length}`);
        await page.close();
      }
    }
    // 글자 모양이 조건인 돌린 숫자 문항의 그림 글자는 명조로 바꾸지 않는다.
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(new URL("?type=5-2-u3-e8-mission-5-original&review=1", base).href);
    await page.locator("#worksheet:not([hidden])").waitFor();
    await page.emulateMedia({ media: "print" });
    const svgFonts = await page.locator('#problemView [data-source-item-id="5-2-u3-e8-mission-5-original"] svg text').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fontFamily));
    assert.ok(svgFonts.length && svgFonts.every(family => !/HSE Print Serif/.test(family)), "rotated-digit figure keeps its own font");
    await page.close();
  } finally {
    await browser.close();
  }
  console.log(`PASS: print serif typography — ${summary.length} printed views, screen font unchanged, glyph-shape figure exempt`);
})().catch(error => { console.error(error); process.exit(1); });
