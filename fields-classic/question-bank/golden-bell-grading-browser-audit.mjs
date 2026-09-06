import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { hasProtectedAnswer, hydrateProtectedAnswers } from "./golden-bell-protected.js";

for (const answer of [undefined, null, "", "  ", [], [""], {}, true, NaN]) {
  assert.equal(hasProtectedAnswer({ answer }), false);
  assert.throws(() => hydrateProtectedAnswers({ answerRef: "test" }, { test: { answer } }), /protected_answers_incomplete/);
}
assert.equal(hasProtectedAnswer({ answer: 0 }), true);
assert.equal(hasProtectedAnswer({ answer: ["9", 9] }), true);
assert.equal(hasProtectedAnswer({ parts: [{ answer: 0 }, {}] }), false);
const atomic = { items: [{ answerRef: "first" }, { answerRef: "second" }] };
assert.throws(() => hydrateProtectedAnswers(atomic, { first: { answer: "9" } }), /protected_answers_incomplete/);
assert.equal(Object.hasOwn(atomic.items[0], "answer"), false, "A partial response must not expose a partial book");
const solutionOnly = { answerRef: "solution" };
hydrateProtectedAnswers(solutionOnly, { solution: { solution: "Synthetic worked example" } });
assert.equal(hasProtectedAnswer(solutionOnly), false);

// Read locally supplied private fixtures; never bundle answers or credentials in this audit.
assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "Set FIELDS_PRIVATE_ANSWER_BANK to the private answer bank");
const privateBank = JSON.parse(await fs.readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
for (const book of GOLDEN_BELL_BOOKS) hydrateProtectedAnswers(structuredClone(book), privateBank.books[book.id]);
const clock = GOLDEN_BELL_BOOKS[0].lessons.find(lesson => lesson.id === "clock-turning");
const clockAnswer = privateBank.books["book-01"][clock.extension.answerRef].answer;
assert.equal(String(clockAnswer), "9", "The reported half-turn from 3 must reach 9");

const modules = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = process.env.FIELDS_CAPTURE_DIR;
if (output) await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report = { bindingBooks: GOLDEN_BELL_BOOKS.length, cases: [], scope: "Isolated authorization fixtures, not live student authentication or a full mathematical audit" };
const student = "CLOCK-AUDIT";
const storageKey = `fields-classic-golden-bell:${student}`;
const progressSeed = { "book-01": { "clock-turning": { original: true } } };

try {
  for (const width of [1440, 390]) {
    for (const mode of ["guest", "unauthorized", "empty", "missing", "invalid", "valid", "delayed"]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        let release;
        const delayed = new Promise(resolve => { release = resolve; });
        let answerRequests = 0;
        await context.addInitScript(({ mode, storageKey, progressSeed }) => {
          localStorage.setItem(storageKey, JSON.stringify(progressSeed));
          if (mode !== "guest") sessionStorage.setItem("gfield_fields_session", "isolated-audit-session");
        }, { mode, storageKey, progressSeed });
        await page.route("**/functions/v1/fields-auth", route => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
        await page.route("**/functions/v1/golden-bell-answers", async route => {
          answerRequests += 1;
          if (mode === "delayed") await delayed;
          const answers = structuredClone(privateBank.books["book-01"]);
          if (mode === "missing") delete answers[clock.extension.answerRef];
          if (mode === "invalid") answers[clock.extension.answerRef].answer = null;
          await route.fulfill({ status: mode === "unauthorized" ? 401 : 200, contentType: "application/json", body: JSON.stringify({ answers: mode === "empty" ? {} : answers }) });
        });
        await page.goto(`${base}/fields-classic/question-bank/golden-bell.html?student=${student}&book=book-01`, { waitUntil: mode === "delayed" ? "domcontentloaded" : "networkidle" });
        await page.locator('[data-phase="extension"]').click();
        const input = page.locator('[data-answer-scope="extension"]');
        const check = page.locator('[data-check="extension"]');
        await input.fill("9");
        if (mode === "delayed") {
          assert.equal(await check.isDisabled(), true, "Typing while answers load must not unlock grading");
          release();
          await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
          assert.equal(await input.inputValue(), "9", "Loading must preserve the child's answer");
        }
        if (["valid", "delayed"].includes(mode)) {
          assert.equal(await check.isEnabled(), true);
          await input.fill("8");
          await check.click();
          assert.equal(await page.locator(".extension-study.incorrect").count(), 1);
          assert.doesNotMatch(await page.locator(".feedback").textContent(), /2에서|맞은편 8/, "Do not borrow a different question's explanation");
          await input.fill("9");
          await check.click();
          assert.equal(await page.locator(".feedback.success").count(), 1, "3 + half a turn must accept 9");
          const progress = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
          assert.equal(progress["book-01"]["clock-turning"].outcomes.extension["clock-turning:extension"].status, "correct");
          if (output && mode === "valid") await page.locator("#lessonContent").screenshot({ path: path.join(output, `clock-correct-${width}.png`) });
        } else {
          assert.equal(await check.isDisabled(), true, `${mode}: typing must not unlock grading`);
          await check.dispatchEvent("click");
          await page.locator("[data-extension-answer]").dispatchEvent("click");
          assert.equal(await page.locator(".feedback,.extension-solution").count(), 0);
          assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey), progressSeed, "Unavailable answers must not create wrong or revealed outcomes");
          assert.equal(await page.locator(".protected-answer-notice").count(), 1);
          if (["empty", "missing", "invalid"].includes(mode)) assert.match(await page.locator(".protected-answer-notice").textContent(), /오답으로 기록하지/);
          await page.locator('[data-phase="original"]').click();
          const first = page.locator('[data-answer-scope="original"]').first();
          await first.fill("6");
          const originalCheck = page.locator("[data-original-check],[data-check='original']").first();
          assert.equal(await originalCheck.isDisabled(), true, "Original-question inputs must preserve the same lock");
          await originalCheck.dispatchEvent("click");
          assert.deepEqual(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey), progressSeed);
          if (mode === "guest") assert.equal(answerRequests, 0, "Do not request answers without an authorized session");
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        assert.deepEqual(errors, []);
        report.cases.push({ width, mode, passed: true });
      } finally {
        await context.close();
      }
    }
  }
  if (output) await fs.writeFile(path.join(output, "grading-audit.json"), JSON.stringify(report, null, 2));
  console.log(`GRADING_BROWSER_OK ${JSON.stringify(report)}`);
} finally {
  await browser.close();
}
