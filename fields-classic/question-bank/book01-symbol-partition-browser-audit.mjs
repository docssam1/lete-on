import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const browser = await chromium.launch({ headless: true });

async function buildWorksheet(page) {
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=SYMBOL-AUDIT&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="practice"]').click();
  const type = page.locator('.curriculum-type[data-preview-type="symbol-balanced-congruent-partition"]').first();
  assert.equal(await type.count(), 1, "symbol partition curriculum type missing");
  await type.locator("input").check();
  await page.locator("#questionCount").fill("2");
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click();
}

async function edgeCount(board, classNames) {
  return board.locator("i").evaluateAll((cells, names) => cells.reduce((total, cell) =>
    total + names.filter((name) => cell.classList.contains(name)).length, 0), classNames);
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await buildWorksheet(page);
  const problemBoards = page.locator("#questionGrid .b1-partition-grid");
  assert.equal(await problemBoards.count(), 2, "symbol partition worksheet count mismatch");
  for (let index = 0; index < 2; index += 1) {
    const board = problemBoards.nth(index);
    assert.equal(await edgeCount(board, ["guide-right", "guide-bottom"]), 4, `problem ${index + 1}: central guide count mismatch`);
    assert.equal(await edgeCount(board, ["completion-right", "completion-bottom", "cut-right", "cut-bottom"]), 0, `problem ${index + 1}: answer lines leaked`);
  }
  assert.equal(await page.locator("#questionGrid .answer-line").count(), 0, "symbol drawing task rendered text answer inputs");
  await page.locator("#answerButton").click();
  const answerBoards = page.locator("#answerDialog .b1-partition-grid");
  assert.equal(await answerBoards.count(), 2, "symbol partition answer visual missing");
  for (let index = 0; index < 2; index += 1) {
    const board = answerBoards.nth(index);
    assert.equal(await edgeCount(board, ["guide-right", "guide-bottom"]), 4, `answer ${index + 1}: red guide count mismatch`);
    assert.equal(await edgeCount(board, ["completion-right", "completion-bottom"]), 8, `answer ${index + 1}: completion line count mismatch`);
    assert.equal(await board.locator(".piece-a,.piece-b,.piece-c,.piece-d").count(), 0, `answer ${index + 1}: source answer should not use piece fills`);
  }
  if (process.env.SYMBOL_PARTITION_SCREENSHOT) await page.screenshot({ path: process.env.SYMBOL_PARTITION_SCREENSHOT, fullPage: true });
  await page.locator("#closeAnswer").click();
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  const printPages = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  assert.equal(printPages, 1, `two symbol partition questions should print on one page, got ${printPages}`);
  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await buildWorksheet(mobile);
  assert.equal(await mobile.locator("#questionGrid .b1-partition-grid").count(), 2, "mobile symbol partition count mismatch");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "mobile horizontal overflow");
  console.log(`BOOK01_SYMBOL_PARTITION_BROWSER_OK problems=2 guide=4 completion=8 unique=1 mobile=2 printPages=${printPages}`);
} finally {
  await browser.close();
}
