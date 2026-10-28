// 권별 테스트 원문 다시 짜기 — 원문 스캔과 다시 짠 쪽을 나란히 찍는다.
//   NODE_PATH=<playwright가 든 node_modules> node tools/unit-test-originals/compare.cjs book-02 <출력 폴더> [기본 주소]
// 기본 주소: http://127.0.0.1:8767 (저장소 루트를 내보내는 정적 서버). 출력: cmp-p1.png … (왼쪽 원문 · 오른쪽 다시 짠 쪽),
// 폰 폭(390) 쪽 그림, 콘솔 오류·그림 잘림 보고. 원문 스캔: fields-classic/question-bank/assets/unit-tests/bookNN/page-NN.png
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path");
const [bookId, out, base = "http://127.0.0.1:8767"] = process.argv.slice(2);
const root = path.resolve(__dirname, "../..");
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    await page.route(/supabase\.co/, (r) => r.fulfill({ status: 503, body: "" }));
    await page.goto(`${base}/fields-classic/question-bank/unit-test-viewer.html?book=${bookId}&student=DEMO&preview=typeset`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.addStyleTag({ content: ".ut-header{position:static!important}" });
    const pages = await page.locator(".ut-test-page").count();
    const clipped = await page.evaluate(() => [...document.querySelectorAll(".ut-q")].map((q) => { const f = q.querySelector(".ut-q-fig"); return f && f.scrollHeight > f.clientHeight + 2 ? q.getAttribute("aria-label") : ""; }).filter(Boolean));
    console.log(`${width}px pages=${pages} clipped=${JSON.stringify(clipped)} errors=${JSON.stringify(errors)}`);
    for (let i = 0; i < pages; i += 1) await page.locator(".ut-test-page").nth(i).screenshot({ path: path.join(out, `typeset-${width}-p${i + 1}.png`) });
    await page.close();
  }
  await browser.close();
  const folder = bookId.replace("-", "");
  for (let i = 1; ; i += 1) {
    const scan = path.join(root, "assets/unit-tests", folder, `page-${String(i).padStart(2, "0")}.png`);
    const mine = path.join(out, `typeset-1280-p${i}.png`);
    if (!fs.existsSync(scan) && !fs.existsSync(mine)) break;
    const parts = [scan, mine].filter((file) => fs.existsSync(file));
    execFileSync("convert", [...parts.flatMap((file) => [file, "-resize", "620x"]), "+append", path.join(out, `cmp-p${i}.png`)]);
  }
  console.log("saved", out);
})();
