import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const out = process.env.FIELDS_CAPTURE_DIR;
const privatePath = process.env.FIELDS_PRIVATE_ANSWER_BANK;
assert.ok(out && privatePath, "Set FIELDS_CAPTURE_DIR and FIELDS_PRIVATE_ANSWER_BANK");
await mkdir(out, { recursive: true });
const privateBank = JSON.parse(await readFile(privatePath, "utf8"));
const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")));
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));
const browser = await chromium.launch();
const report = [];
const ids = Array.from({ length: 21 }, (_, i) => `D${String(i + 1).padStart(2, "0")}`);

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ answers: privateBank.books["book-01"] }) }));
  await page.addInitScript(() => { sessionStorage.setItem("gfield_fields_session", "isolated-hands-on-paper"); window.print = () => {}; });
  await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=PAPER-QA&book=book-01`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  for (const mode of ["study", "answers", "quick", "both"]) {
    await page.locator("#coursePrintMode").selectOption(mode);
    await page.locator("#printBookButton").click();
    await page.waitForFunction(() => !document.querySelector("#printBookButton").disabled);
    assert.match(await page.locator("#printStatus").innerText(), /^A4 /);
    const root = page.locator("#goldPrintRoot");
    const student = await root.locator('[data-print-role="student"]').evaluateAll((nodes) => nodes.map((node) => node.dataset.printChallenge));
    const answers = await root.locator('[data-print-role="answer"]').evaluateAll((nodes) => nodes.map((node) => node.dataset.printChallenge));
    assert.deepEqual(student, ["study", "both"].includes(mode) ? ids : []);
    assert.deepEqual(answers, ["answers", "quick", "both"].includes(mode) ? ids : []);
    if (["study", "both"].includes(mode)) {
      const visible = await root.locator('[data-print-role="student"]').evaluateAll((nodes) => nodes.map((node) => {
        const copy = node.cloneNode(true);
        copy.querySelector(".hand-paper-item-title")?.remove();
        copy.querySelectorAll("*").forEach((element) => [...element.attributes]
          .filter((attribute) => attribute.name.startsWith("data-"))
          .forEach((attribute) => element.removeAttribute(attribute.name)));
        return { activity: node.dataset.printActivity, content: copy.innerHTML.replace(/\s+/g, " ").trim() };
      }));
      const byActivity = new Map();
      for (const item of visible) byActivity.set(item.activity, [...(byActivity.get(item.activity) || []), item.content]);
      for (const [activity, variants] of byActivity) {
        assert.equal(new Set(variants).size, variants.length, `${activity}: repeated visible challenge`);
      }
    }
    assert.equal(await root.locator('[data-print-role="student"] .hand-paper-answer-summary,[data-print-role="student"] .hand-paper-solution-steps').count(), 0);
    assert.equal(await root.locator('[data-print-role="answer"] .hand-paper-answer-summary').count(), answers.length);
    if (mode === "quick") {
      assert.equal(await root.locator('[data-print-role="answer"] .hand-paper-solution-steps').count(), 0,
        "Quick answers must not include worked solution steps");
      assert.equal(await root.locator('[data-print-role="answer"] .hand-paper-prompt').count(), 0,
        "Quick answers must not repeat student prompts");
    }
    if (mode === "answers") {
      assert.equal(await root.locator('[data-print-role="answer"] .hand-paper-solution-steps').count(), answers.length,
        "Worked answer mode must explain every hands-on challenge");
    }
    assert.equal(await root.locator('[data-print-role="student"] [data-print-response]').count() > 21, student.length > 0);
    assert.equal(await root.locator(".gold-hands-on,.hand-scene").count(), 0);
    await page.emulateMedia({ media: "print" });
    if (["study", "both"].includes(mode)) {
      assert.deepEqual(await root.locator(".gold-print-cover-path li span").allTextContents(),
        ["개념 그림", "직접 해보기", "골든벨", "유사 연습", mode === "both" ? "답안과 풀이" : "스스로 점검"]);
      assert.equal(await root.locator(".gold-print-cover-path li").evaluateAll((nodes) =>
        nodes.some((node) => node.scrollWidth > node.clientWidth + 2)), false, "Cover path must fit the paper");
    }
    const bounds = await root.locator(".hand-paper-page").evaluateAll((pages) => pages.map((page) => {
      const footer = page.querySelector(":scope > .gold-print-footer").getBoundingClientRect();
      const content = page.querySelector(".hand-paper-grid").getBoundingClientRect();
      return { part: page.dataset.printPart, contentBottom: content.bottom, footerTop: footer.top,
        width: content.width, height: content.height, children: page.querySelectorAll(".hand-paper-item").length,
        overflow: page.scrollWidth > page.clientWidth + 2 };
    }));
    assert.ok(bounds.length > 0);
    for (const b of bounds) {
      assert.ok(b.contentBottom <= b.footerTop - 4, `${mode} ${b.part}: item overlaps footer`);
      assert.equal(b.overflow, false, `${mode} ${b.part}: horizontal overflow`);
      assert.ok(b.width > 200 && b.height > 40 && b.children > 0, `${mode} ${b.part}: missing paper question`);
    }
    const domCount = await root.locator(".gold-print-page").count();
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    const physicalCount = (await PDFDocument.load(pdf)).getPageCount();
    assert.equal(physicalCount, domCount, `${mode}: browser created overflow pages`);
    const firstAnswerIndex = await root.locator(".gold-print-page").evaluateAll((pages) => pages.findIndex((node) => node.dataset.printPart.startsWith("answers-")));
    if (mode === "both") assert.equal(firstAnswerIndex % 2, 0, "Answers must start on the front of a new sheet");
    if (["answers", "quick"].includes(mode)) assert.equal(await root.locator(".gold-print-cover,.gold-print-duplex-blank").count(), 0);
    await writeFile(path.join(out, `book01-hands-on-${mode}.pdf`), pdf);
    report.push({ mode, student: student.length, answers: answers.length, paperPages: bounds.length, pages: physicalCount, firstAnswer: firstAnswerIndex + 1 });
    await page.emulateMedia({ media: "screen" });
  }
  assert.deepEqual(errors, []);
  await writeFile(path.join(out, "paper-review.json"), JSON.stringify(report, null, 2));
  console.log(`HANDS_ON_PAPER_OK ${JSON.stringify(report)}`);
} finally {
  await browser.close();
}
