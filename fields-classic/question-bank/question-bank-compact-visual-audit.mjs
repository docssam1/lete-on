import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { GENERATORS } from "./generators.js";
import { DIAGNOSTIC_EXAM_TYPES, EXAMS, FINAL_EXAM_TYPES, PRACTICE_EXAM_TYPES } from "./source-data.js";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const output = path.join(os.tmpdir(), "fields-compact-visual-audit");
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const [name, generator] of [
  ["totalDifference", GENERATORS.totalDifference],
  ["totalDifferenceShare", GENERATORS.totalDifferenceShare],
  ["totalDifferenceCandyShare", GENERATORS.totalDifferenceCandyShare]
]) {
  for (const difficulty of [1, 2, 3]) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const problem = generator({ difficulty });
      assert(problem?.visual?.layoutRole === "support", `${name} ${difficulty}: support role missing`);
      assert(problem?.visual?.compactPolicy === "omit", `${name} ${difficulty}: compact omit policy missing`);
      assert(Boolean(problem?.prompt && problem?.answer && problem?.solution), `${name} ${difficulty}: text contract incomplete`);
      if (name === "totalDifference") {
        assert(problem.meta.older + problem.meta.younger === problem.meta.sum, `${name} ${difficulty}: sum mismatch`);
        assert(problem.meta.older - problem.meta.younger === problem.meta.gap, `${name} ${difficulty}: difference mismatch`);
      } else {
        assert(problem.meta.larger + problem.meta.smaller === problem.meta.total, `${name} ${difficulty}: total mismatch`);
        assert(problem.meta.larger - problem.meta.smaller === problem.meta.difference, `${name} ${difficulty}: difference mismatch`);
      }
    }
  }
}

await fs.mkdir(output, { recursive: true });
const exams = [...EXAMS, ...PRACTICE_EXAM_TYPES, ...DIAGNOSTIC_EXAM_TYPES, ...FINAL_EXAM_TYPES];
const browser = await chromium.launch({ headless: true });
const inspected = [];
const omittedReferences = new Set();

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  for (const exam of exams) {
    await page.goto(`${base}/fields-classic/question-bank/?student=DEMO&mode=exam&exam=${exam.id}`, {
      waitUntil: "networkidle",
      timeout: 30000
    });
    const build = page.locator("#buildButton");
    if (await build.isDisabled()) {
      failures.push(`${exam.id} ${viewport.name}: build button disabled`);
      continue;
    }
    await build.click();
    await page.locator(".question-card").first().waitFor({ state: "visible" });
    const screen = await page.locator(".question-card").evaluateAll((cards) => cards.map((card) => ({
      reference: card.querySelector(".question-reference")?.textContent?.trim() || "",
      policy: card.dataset.visualPolicy,
      visualCount: card.querySelectorAll(":scope > .visual").length,
      horizontalOverflow: card.scrollWidth - card.clientWidth
    })));
    screen.forEach((item) => {
      if (item.policy === "support-omit") {
        omittedReferences.add(item.reference);
        assert(item.visualCount === 0, `${exam.id} ${viewport.name}: omitted support visual rendered at ${item.reference}`);
      }
      assert(item.horizontalOverflow <= 1, `${exam.id} ${viewport.name}: screen overflow at ${item.reference}`);
    });

    if (viewport.name === "desktop") {
      await page.emulateMedia({ media: "print" });
      const print = await page.locator(".question-card").evaluateAll((cards) => cards.map((card) => {
        const cardRect = card.getBoundingClientRect();
        const pageRect = card.closest(".question-page")?.getBoundingClientRect();
        return {
          reference: card.querySelector(".question-reference")?.textContent?.trim() || "",
          verticalOverflow: card.scrollHeight - card.clientHeight,
          insidePage: Boolean(pageRect && cardRect.top >= pageRect.top - 1 && cardRect.bottom <= pageRect.bottom + 1)
        };
      }));
      print.forEach((item) => {
        assert(item.verticalOverflow <= 1, `${exam.id}: print overflow at ${item.reference}`);
        assert(item.insidePage, `${exam.id}: card escaped A4 page at ${item.reference}`);
      });
      await page.emulateMedia({ media: "screen" });
    }
    inspected.push({ viewport: viewport.name, examId: exam.id, questions: screen.length, omitted: screen.filter((item) => item.policy === "support-omit").length });
  }
  await page.close();
}

await browser.close();
const report = {
  exams: exams.length,
  questions: inspected.filter((item) => item.viewport === "desktop").reduce((sum, item) => sum + item.questions, 0),
  viewportChecks: inspected.reduce((sum, item) => sum + item.questions, 0),
  omittedQuestions: omittedReferences.size,
  failures
};
await fs.writeFile(path.join(output, "report.json"), `${JSON.stringify({ report, omittedReferences: [...omittedReferences], inspected }, null, 2)}\n`, "utf8");
if (failures.length) {
  console.error("QUESTION_BANK_COMPACT_VISUAL_AUDIT_FAILED", JSON.stringify(report));
  process.exitCode = 1;
} else {
  console.log("QUESTION_BANK_COMPACT_VISUAL_AUDIT_OK", JSON.stringify({ ...report, output }));
}
