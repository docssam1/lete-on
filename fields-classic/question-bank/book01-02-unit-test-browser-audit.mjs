import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { BOOK01_02_UNIT_TEST_LINKS } from "./book01-02-unit-test-links.js";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR;
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const [bookId, inventory] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      // 단원 목록에는 권별평가를 섞지 않는다(원장 「아래 단원별로 구분한 것만 살려」). 권별평가는 심화 옆 「권별평가」 칸에서
      // 따로 고르고(원장 2026-10-27), 주소 set=unit-test 는 그 칸을 연다 — 검토를 마친 번호만 담겨야 한다.
      await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum&book=${bookId}`, { waitUntil: "networkidle" });
      assert.equal(await page.locator("input[data-unit-test-key]").count(), 0, "단원 목록에 권별평가 문항을 섞지 않는다");
      assert.equal(await page.locator("#curriculumTree button[data-curriculum-view=\"unit-test\"]").count(), 1, "심화 옆 권별평가 칸");
      await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum&book=${bookId}&set=unit-test`, { waitUntil: "networkidle" });
      const expected = inventory.filter((entry) => entry.verified);
      assert.equal(await page.locator("input[data-unit-test-key]:checked").count(), expected.length, "권별평가 칸에 검토한 번호가 골라져 있다");
      assert.equal(await page.locator(".curriculum-unit").count(), 0, "권별평가 칸에서는 단원 목록을 숨긴다");
      await page.locator("#buildButton").click(); await page.locator("#edNext").click();   // 2단계 상세 편집을 지나 인쇄 화면으로
      await page.locator("#worksheetSection").waitFor({ state: "visible" });
      const cards = page.locator(".question-card");
      assert.equal(await cards.count(), expected.length);
      const types = await cards.evaluateAll((nodes) => nodes.map((node) => node.dataset.typeId).sort());
      assert.deepEqual(types, expected.map((entry) => entry.typeId).sort(), "Only the reviewed source links may reach the worksheet");
      assert.doesNotMatch(await cards.allTextContents().then((texts) => texts.join(" ")), /undefined|NaN|\[object Object\]/);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (bookId === "book-02") {
        const card = (number) => cards.nth(number - 1);
        assert.equal(await card(6).locator(".b2-equation-stack").count(), 1);
        assert.equal(await card(7).locator(".b2-scale").count(), 3);
        assert.equal(await card(10).locator(".multi-part-visuals>figure").count(), 2);
        assert.equal(await card(10).locator(".b2-sequence").count(), 2);
        assert.equal(await card(11).locator(".b2-sequence").count(), 1);
        assert.equal(await card(13).locator(".b2-house-growth figure").count(), 3);
        assert.equal(await card(14).locator(".b2-triangle-growth figure").count(), 4);
        assert.equal(await card(15).locator(".b2-fold-growth figure").count(), 3);
        assert.equal(await card(16).locator(".b2-number-rule-rows.table>div").count(), 4);
        assert.equal(await card(17).locator(".b2-number-rule-rows.equation>div").count(), 4);
        assert.equal(await card(18).locator(".b2-promise-set.triangle figure").count(), 4);
        assert.equal(await card(19).locator(".b2-sudoku>span").count(), 9);
        assert.equal(await card(20).locator(".b2-sudoku>span").count(), 16);
        assert.equal(await card(20).getAttribute("data-type-id"), "sudoku-four-irregular-region");
        assert.equal(await card(21).locator(".b2-promise-set.diamond figure").count(), 4);
        assert.equal(await card(23).locator(".b2-equation-stack").count(), 1);
        assert.equal(await card(25).locator(".b2-stone-growth figure").count(), 6);
        assert.match(await card(19).locator(".drawing-answer-note").textContent(), /빈칸에 수/);
        assert.match(await card(20).locator(".drawing-answer-note").textContent(), /빈칸에 수/);
        await page.locator("#answerButton").click();
        await page.locator("#answerDialog").waitFor({ state: "visible" });
        assert.equal(await page.locator("#answerBody>tr").count(), 25);
        assert.equal(await page.locator("#answerDialog .b2-sudoku").count(), 2);
        assert.ok(await page.locator("#answerDialog .answer-part-visuals").count() >= 1);
        assert.doesNotMatch(await page.locator("#answerDialog").textContent(), /undefined|NaN|\[object Object\]/);
        if (output) await page.locator("#answerDialog").screenshot({ path: path.join(output, `book-02-unit-answers-${width}.png`) });
        await page.locator("#closeAnswer").click();
      }
      if (bookId === "book-01") {
        const folding = page.locator(".fold-number-steps");
        assert.equal(await folding.locator("figure").count(), 4);
        const directions = await folding.evaluate((node) => ({ h: node.dataset.foldHorizontal, v: node.dataset.foldVertical }));
        assert.match(await folding.locator("figcaption").nth(0).textContent(), directions.h === "up" ? /아래쪽을 위로/ : /위쪽을 아래로/);
        assert.match(await folding.locator("figcaption").nth(1).textContent(), directions.v === "left" ? /오른쪽을 왼쪽으로/ : /왼쪽을 오른쪽으로/);
        const card = (number) => cards.nth(number - 1);
        // 원본 구조: 두 문제·세 그림·접는 단계 수가 원본과 같아야 한다.
        assert.equal(await card(1).locator(".b1-ut-set>figure").count(), 2);
        assert.equal(await card(2).locator(".b1-ut-set>figure").count(), 2);
        assert.equal(await card(3).locator(".b1-ut-set>figure").count(), 2);
        assert.equal(await card(6).locator(".b1-ut-set>figure").count(), 2);
        assert.equal(await card(15).locator(".b1-ut-set>figure").count(), 2);
        assert.equal(await card(4).locator(".b1-ut-svg text").count(), 9);
        assert.equal(await card(9).locator(".b1-ut-svg").count(), 1);
        assert.equal(await card(10).locator(".b1-ut-svg").count(), 1);
        assert.equal(await card(12).locator(".b1-ut-svg").count(), 1);
        assert.equal(await card(16).locator(".b1-ut-svg").count(), 1);
        assert.equal(await card(19).locator(".b1-ut-conditions li").count(), 2);
        assert.equal(await card(20).locator(".b1-ut-conditions li").count(), 2);
        assert.equal(await card(21).locator(".b1-ut-conditions li").count(), 2);
        assert.equal(await card(23).locator(".b1-ut-conditions li").count(), 3);
        assert.equal(await card(25).locator(".b1-ut-conditions li").count(), 3);
        for (const [index, item] of (await cards.all()).entries()) {
          if ([19, 20].includes(index + 1)) continue;   // 조건 상자만 있는 문항(원본도 그림이 없다)
          assert.ok(await item.locator("svg").count(), `${index + 1}번 그림이 없다`);
          const bounds = await item.locator("svg").first().boundingBox();
          assert.ok(bounds.width > 100 && bounds.height > 50, `${index + 1}번 그림이 너무 작다`);
        }
        // 그림의 채움은 그림 안에 적었다 — CSS가 없는 화면에서 검게 칠해지는 칸이 없어야 한다.
        const blackFills = await page.evaluate(() => [...document.querySelectorAll(".question-card .b1-ut-svg :is(rect,polygon,circle,path)")]
          .filter((node) => ["rgb(0, 0, 0)"].includes(getComputedStyle(node).fill)).length);
        assert.equal(blackFills, 0, "권별테스트 그림에 검게 칠해진 도형이 있다");
        await page.locator("#answerButton").click();
        await page.locator("#answerDialog").waitFor({ state: "visible" });
        assert.equal(await page.locator("#answerBody>tr").count(), 25);
        assert.ok(await page.locator("#answerDialog .b1-ut-svg").count() >= 10, "그림 답이 답안지에 나와야 한다");
        assert.doesNotMatch(await page.locator("#answerDialog").textContent(), /undefined|NaN|\[object Object\]/);
        if (output) await page.locator("#answerDialog").screenshot({ path: path.join(output, `book-01-unit-answers-${width}.png`) });
        await page.locator("#closeAnswer").click();
      }
      if (output) await page.screenshot({ path: path.join(output, `${bookId}-unit-worksheet-${width}.png`), fullPage: true });
      await page.emulateMedia({ media: "print" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfPages = (await PDFDocument.load(pdf)).getPageCount();
      if (output) await writeFile(path.join(output, `${bookId}-unit-worksheet-${width}.pdf`), pdf);
      assert.equal(pdfPages, Math.ceil(expected.length / 2), "The print layout must keep two questions per A4 page without an extra page");
      await page.emulateMedia({ media: "screen" });
      await page.locator("#backToBuilder").click();
      assert.equal(await page.locator(".ed-card").count(), expected.length, "인쇄 화면에서 돌아오면 상세 편집에 같은 문제가 있다");
      assert.deepEqual(errors, []);
      results.push({ bookId, width, inventory: inventory.length, enabled: expected.length, held: inventory.length - expected.length, pdfPages });
      await page.close();
    }
  }
  if (output) await writeFile(path.join(output, "unit-test-links-browser-audit.json"), JSON.stringify({ results }, null, 2));
  console.log(`UNIT_TEST_LINKS_BROWSER_OK ${JSON.stringify({ results })}`);
} finally {
  await browser.close();
}
