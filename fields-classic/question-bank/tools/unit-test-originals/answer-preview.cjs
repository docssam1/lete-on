// 정답(비공개, 저장소 밖 JSON)을 원문 풀기 화면에 흉내 내어 넣고 「답안 확인」·「답안지 인쇄」를 찍는다.
//   NODE_PATH=… node tools/unit-test-originals/answer-preview.cjs book-02 <정답 JSON> <출력 폴더>
// 정답 JSON 꼴: { "book": "book-02", "answers": { "1": { "text": "...", "visual": {...}?, "sourceNote": "..."? }, … } }
// ⚠ 정답 JSON 은 저장소에 두지 않는다(세션 임시 폴더). DB 에는 관리자가 넣는다.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const [bookId, file, out, base = "http://127.0.0.1:8767"] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(file, "utf8"));
const answers = Object.fromEntries(Object.entries(payload.answers).map(([k, v]) => [k, { text: v.text, visual: v.visual || null }]));
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route(/unit-test-answers/, (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ bookId, answers }) }));
  await page.route(/supabase\.co(?!.*unit-test-answers)/, (r) => r.fulfill({ status: 503, body: "" }));
  await page.goto(`${base}/fields-classic/question-bank/unit-test-viewer.html?book=${bookId}&student=DEMO&preview=typeset`, { waitUntil: "networkidle" });
  await page.click("#checkButton");
  await page.waitForTimeout(1000);
  console.log("answers shown", await page.locator(".ut-key span:not(.is-off)").count(), "errors", JSON.stringify(errors));
  await page.evaluate(() => document.body.classList.add("print-answers"));
  await page.pdf({ path: path.join(out, "answer-key.pdf"), preferCSSPageSize: true, printBackground: true });
  console.log("saved", path.join(out, "answer-key.pdf"), "(pdftoppm -r 60 -png 로 그림으로 바꿔 본다)");
  await browser.close();
})();
