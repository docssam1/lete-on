import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("ERR_NETWORK_ACCESS_DENIED")) errors.push(message.text());
  });
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=PARTITION-AUDIT&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="practice"]').click();
  for (const typeId of ["rotational-partition-two", "rotational-partition-four"]) {
    const type = page.locator(`.curriculum-type[data-preview-type="${typeId}"]`).first();
    assert.equal(await type.count(), 1, `${typeId}: selectable curriculum type missing`);
    await type.locator("input").check();
  }
  await page.locator("#questionCount").fill("2");
  await page.locator("#questionCount").dispatchEvent("change");
  await page.locator("#buildButton").click();
  assert.equal(await page.locator("#questionGrid .b1-rotational-partition").count(), 2, "rotational partition worksheet count mismatch");
  assert.equal(await page.locator("#questionGrid .b1-rotational-partition .b1-rotation-line.given").count(), 2, "each problem must reveal one complete red guide path");
  assert.equal(await page.locator("#questionGrid .answer-line").count(), 0, "drawing question incorrectly renders a text answer line");
  assert.equal(await page.locator("#questionGrid .drawing-answer-note").count(), 2, "drawing instruction count mismatch");
  const guidePointCounts = await page.locator("#questionGrid .b1-rotational-partition .b1-rotation-line.given").evaluateAll((lines) =>
    lines.map((line) => line.getAttribute("points").trim().split(/\s+/).length)
  );
  assert.ok(guidePointCounts.every((count) => count >= 3), `guide paths are too short: ${guidePointCounts.join(",")}`);
  if (process.env.PARTITION_WORKSHEET_SCREENSHOT) await page.screenshot({ path: process.env.PARTITION_WORKSHEET_SCREENSHOT, fullPage: true });
  await page.locator("#answerButton").click();
  const answerBoards = page.locator("#answerDialog .b1-rotational-partition");
  assert.equal(await answerBoards.count(), 2, "rotational partition answer visual missing");
  const answerLineCounts = await answerBoards.evaluateAll((boards) => boards.map((board) => board.querySelectorAll(".b1-rotation-line").length));
  assert.deepEqual(answerLineCounts.sort((a, b) => a - b), [2, 4], "answer must contain one half-turn copy or three quarter-turn copies");
  if (process.env.PARTITION_SCREENSHOT) await page.screenshot({ path: process.env.PARTITION_SCREENSHOT, fullPage: true });
  await page.locator("#closeAnswer").click();
  await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  const printPages = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  assert.equal(printPages, 1, `two partition questions should print on one page, got ${printPages}`);
  assert.deepEqual(errors, [], `browser errors: ${errors.join(" | ")}`);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/fields-classic/question-bank/?student=PARTITION-MOBILE&mode=curriculum`, { waitUntil: "networkidle" });
  await mobile.locator('#curriculumStageChoices button[data-stage="practice"]').click();
  for (const typeId of ["rotational-partition-two", "rotational-partition-four"]) {
    await mobile.locator(`.curriculum-type[data-preview-type="${typeId}"]`).first().locator("input").check();
  }
  await mobile.locator("#questionCount").fill("2");
  await mobile.locator("#questionCount").dispatchEvent("change");
  await mobile.locator("#buildButton").click();
  assert.equal(await mobile.locator("#questionGrid .b1-rotational-partition").count(), 2, "mobile partition worksheet count mismatch");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, "mobile horizontal overflow");
  console.log(`BOOK01_PARTITION_BROWSER_OK guidePoints=${guidePointCounts.join(",")} answerLines=${answerLineCounts.join(",")} mobile=2 printPages=${printPages}`);
} finally {
  await browser.close();
}
