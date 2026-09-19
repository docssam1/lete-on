const fs = require("fs");
const os = require("os");
const path = require("path");

const base = process.argv[2] || "http://127.0.0.1:8894/hsmiddle";
const output = path.resolve(process.argv[3] || path.join(os.tmpdir(), "hsmiddle-report-audit"));
const playwrightPaths = [
  process.env.PLAYWRIGHT_PATH,
  "playwright"
].filter(Boolean);
const playwrightPath = playwrightPaths.find(candidate => {
  try { require.resolve(candidate); return true; } catch (_) { return false; }
});
if (!playwrightPath) throw new Error("Playwright runtime not found. Set PLAYWRIGHT_PATH.");
const { chromium } = require(playwrightPath);

fs.mkdirSync(output, { recursive: true });
const assert = (value, message) => { if (!value) throw new Error(message); };
const url = target => base + "/" + target;
const seed = () => {
  localStorage.setItem("hs-student", "DEMO");
  localStorage.setItem("hs-code", "HS-DEMO");
  localStorage.setItem("hsm-mark-mode", "ox");
  for (let i = 1; i <= 40; i++) localStorage.setItem("hsm-ox-" + i, i % 5 === 0 ? "x" : "o");
};
const adminSeed = () => {
  localStorage.setItem("hs-student", "docssam");
  localStorage.setItem("hs-code", "01020837265");
  localStorage.setItem("hsm-mark-mode", "ox");
  for (let i = 1; i <= 40; i++) localStorage.setItem("hsm-ox-" + i, i % 5 === 0 ? "x" : "o");
  window.__printCalls = 0;
  window.print = () => { window.__printCalls += 1; };
};

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--disable-gpu"] });
  async function withPage(target, size, callback, initializer = seed) {
    const [width, height] = size.split(",").map(Number);
    const context = await browser.newContext({ viewport: { width, height: Math.min(height, 1200) }, deviceScaleFactor: 1 });
    await context.addInitScript(initializer);
    const page = await context.newPage();
    await page.goto(url(target), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(250);
    try { return await callback(page); } finally { await context.close(); }
  }
  const dom = (target, size) => withPage(target, size, page => page.content());
  const shot = (target, size, name) => withPage(target, size, async page => {
    const file = path.join(output, name);
    await page.screenshot({ path: file, fullPage: true });
    assert(fs.existsSync(file) && fs.statSync(file).size > 10000, "missing screenshot " + name);
  });
  const elementShot = (target, size, selector, name) => withPage(target, size, async page => {
    const file = path.join(output, name);
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded();
    await locator.screenshot({ path: file });
    assert(fs.existsSync(file) && fs.statSync(file).size > 3000, "missing element screenshot " + name);
  });

  try {
    await withPage("diagnostic.html", "1440,900", async page => {
      assert(await page.locator(".item").count() === 40, "O/X input must render 40 items");
      assert(await page.locator(".list.ox-grid").count() === 1, "O/X quick grid missing");
      assert((await page.locator("#autosave").innerText()).includes("40/40문항"), "automatic score snapshot status missing");
    });
    await shot("diagnostic.html", "1440,900", "diagnostic-ox-desktop.png");
    await withPage("diagnostic.html", "390,844", async page => {
      const columns = await page.locator(".list.ox-grid").evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
      assert(columns === 4, "mobile O/X input must keep four questions per row");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile diagnostic has horizontal overflow");
    });
    await shot("diagnostic.html", "390,844", "diagnostic-ox-mobile.png");
    await elementShot("diagnostic.html", "390,844", ".list.ox-grid", "diagnostic-ox-grid-mobile.png");
    await withPage("diagnostic.html", "1440,900", async page => {
      await page.evaluate(() => {
        for (let i = 1; i <= 40; i++) { localStorage.removeItem("hsm-ox-" + i); localStorage.removeItem("hsm-answer-" + i); }
        setMark("answer");
      });
      await page.locator('[data-q="1"]').fill("2527869999999999");
      const answerScore = await page.locator("#score").innerText();
      await page.evaluate(() => setMark("ox"));
      assert(await page.locator("#score").innerText() === answerScore && answerScore === "2.5", "answer score was lost after switching to O/X mode");
    });
    await withPage("diagnostic.html", "1440,900", async page => {
      const dialogs = [];
      page.on("dialog", async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
      await page.evaluate(() => { window.HSMIDDLE_CLOUD = null; });
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      await page.evaluate(() => setOX(1, "x"));
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      await page.evaluate(() => setOX(1, "o"));
      await page.locator("#saveScoreBtn").click();
      await page.waitForTimeout(150);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("hsm-history-diagnostic-DEMO") || "[]"));
      assert(saved.length === 2, "a non-consecutive duplicate diagnostic result must not be saved twice");
      assert(dialogs.some(message => message.includes("이미 저장")), "duplicate score save warning missing");
    });

    await withPage("report.html", "1440,900", async page => {
      assert(await page.locator(".chart").count() === 4, "report must render four charts");
      assert(await page.locator(".diagnostic-cell").count() === 40, "report must render 40 O/X cells");
      assert(await page.locator(".plan-step").count() === 3, "report must render a three-step learning plan");
      const body = await page.locator("body").innerText();
      assert(body.includes("꼭 맞아야 할 문항") && body.includes("정답률 60% 이상"), "must-correct section or criterion missing");
      assert(body.includes("5번, 10번, 20번을 틀렸습니다"), "must-correct wrong-number analysis missing");
      assert(body.includes("선택 번호 인쇄") && body.includes("오답 전체 인쇄"), "wrong-answer print controls missing");
      assert(body.includes("별도 문제은행 이용 계정"), "diagnostic-only account must see the separate-product notice");
    });
    await shot("report.html", "1440,900", "report-desktop.png");
    await withPage("report.html", "390,844", async page => {
      const columns = await page.locator(".diagnostic-grid").evaluate(node => getComputedStyle(node).gridTemplateColumns.split(" ").length);
      assert(columns === 4, "mobile report O/X grid must keep four questions per row");
      assert(await page.locator(".errtable tbody tr").first().evaluate(node => getComputedStyle(node).display) === "grid", "mobile wrong-answer rows must use card layout");
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile report has horizontal overflow");
    });
    await shot("report.html", "390,844", "report-mobile.png");
    await elementShot("report.html", "390,844", ".diagnostic-grid", "report-ox-grid-mobile.png");
    await elementShot("report.html", "390,844", ".essential-note", "report-essential-mobile.png");
    await elementShot("report.html", "390,844", ".plan", "report-plan-mobile.png");
    await elementShot("report.html", "390,844", ".errtable tbody tr", "report-wrong-card-mobile.png");

    await withPage("report.html", "1440,900", async page => {
      const labels = await page.locator(".print-group button").allTextContents();
      assert(labels.includes("선택 유사문제 인쇄") && labels.includes("오답 유사문제 전체 인쇄"), "similar-problem print controls missing for entitled account");
      const targets = await page.evaluate(() => {
        const opened = [];
        window.open = target => { opened.push(String(target)); };
        toggleWrongPicks(false);
        for (const input of document.querySelectorAll("[data-wrong-pick]")) input.checked = input.value === "5" || input.value === "10";
        setWrongPrintMode("answer");
        printSelectedSimilar();
        printAllSimilar();
        return opened;
      });
      assert(targets[0].includes("qs=5,10") && targets[0].includes("mode=answer") && targets[0].includes("autoprint=1"), "selected similar-problem print URL is incorrect");
      assert(targets[1].includes("qs=5,10,15,20,25,30,35,40"), "all-wrong similar-problem print URL is incorrect");
      const file = path.join(output, "report-similar-print-controls.png");
      await page.locator(".print-tools").screenshot({ path: file });
      assert(fs.statSync(file).size > 3000, "similar-problem print controls screenshot missing");
    }, adminSeed);

    const problemTarget = "viewer.html?doc=diagnostic-review&qs=1,2,3,4,5,6,7,8&mode=problem&student=DEMO";
    await withPage(problemTarget, "1100,900", async page => {
      assert(await page.locator(".page.review-page").count() === 8, "selected-number print must render eight pages");
      assert(await page.locator(".page.answer-sheet").count() === 0, "problem-only print leaked answer sheet");
      const canvases = await page.locator("canvas").evaluateAll(nodes => nodes.map(node => [node.width, node.height]));
      assert(canvases.length === 8 && canvases.every(([width, height]) => width > 0 && height > 0), "question crops did not render");
    });
    await shot(problemTarget, "1100,900", "wrong-print-problem-only.png");

    const answerTarget = "viewer.html?doc=diagnostic-review&qs=1,2,3,4,5,6,7,8&mode=answer&student=DEMO";
    await withPage(answerTarget, "1100,900", async page => {
      assert(await page.locator(".page.answer-sheet").count() === 1, "problem+answer print must append an answer sheet");
      assert((await page.locator(".answer-sheet").innerText()).includes("2527869999999999"), "official answer missing from answer sheet");
    });
    await shot(answerTarget, "1100,900", "wrong-print-problem-answer.png");
    await withPage(answerTarget, "1100,900", async page => {
      await page.emulateMedia({ media: "print" });
      await page.pdf({ path: path.join(output, "wrong-print-problem-answer.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    });

    const library = await dom("library.html", "1440,900");
    assert(/중등 심화 문제은행[\s\S]{0,2000}잠김/.test(library), "question bank must be a separately locked product for DEMO");
    await withPage("question-bank/", "1440,900", async page => {
      assert(await page.locator("#accessGate").isVisible(), "direct question-bank access must be locked for a diagnostic-only account");
      assert(!(await page.locator("#app").isVisible()), "question-bank app leaked to a diagnostic-only account");
    });

    const combinedTarget = "question-bank/?qs=5,10&mode=answer&autoprint=1";
    await withPage(combinedTarget, "1440,900", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      assert(await page.locator(".combined-part.problem-part").count() === 1, "combined print problem part missing");
      assert(await page.locator(".combined-part.answer-part").count() === 1, "combined print answer part missing");
      assert(await page.locator(".problem-part .set-section").count() === 2, "selected similar-problem types missing from problem part");
      assert(await page.locator(".answer-part .set-section").count() === 2, "selected similar-problem types missing from answer part");
      assert(await page.locator(".answer-part .page").count() === 2, "combined print must append quick-answer pages only");
      const answerSources = await page.locator(".answer-part img").evaluateAll(images => images.map(image => image.getAttribute("src")));
      assert(answerSources.every(source => /\/page-4\.png$/.test(source)), "solution pages leaked into problem+answer print");
      assert(await page.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0)), "combined print contains a broken image");
    }, adminSeed);
    await withPage(combinedTarget, "390,844", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile combined print has horizontal overflow");
      const file = path.join(output, "similar-print-combined-mobile.png");
      await page.screenshot({ path: file, fullPage: true });
    }, adminSeed);
    await withPage(combinedTarget, "1100,900", async page => {
      await page.waitForFunction(() => window.__printCalls === 1);
      await page.emulateMedia({ media: "print" });
      await page.pdf({ path: path.join(output, "similar-print-combined.pdf"), format: "A4", printBackground: true, preferCSSPageSize: true });
    }, adminSeed);

    await withPage("question-bank/?qs=5,99&mode=problem", "1440,900", async page => {
      const notice = await page.locator("#linkedNotice").innerText();
      assert(notice.includes("99번") && notice.includes("제외"), "unavailable similar-problem number must be disclosed");
    }, adminSeed);
    console.log(JSON.stringify({ ok: true, output, files: fs.readdirSync(output).filter(name => !name.startsWith(".")).sort() }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
