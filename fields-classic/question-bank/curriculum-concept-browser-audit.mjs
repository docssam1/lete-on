import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const browser = await chromium.launch({ headless: true });
const expectedOfflineError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function buildConceptWorksheet(page, label) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !expectedOfflineError(message.text())) errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/fields-classic/question-bank/?student=CONCEPT-AUDIT&mode=curriculum`, { waitUntil: "networkidle" });
  await page.locator('#curriculumStageChoices button[data-stage="concept"]').click();
  const firstType = page.locator('.curriculum-type[data-preview-type]:has(input:not([disabled]))').first();
  assert.equal(await firstType.count(), 1, `${label}: selectable concept type missing`);

  if (label === "desktop") {
    await firstType.hover();
    await page.locator("#typePreview:not([hidden])").waitFor();
    assert.equal(await page.locator("#typePreview .textbook-concept-tutorial.compact").count(), 1, "hover tutorial missing");
    assert.equal(await page.locator("#typePreview .textbook-concept-tutorial li").count(), 3, "hover tutorial steps missing");
  }

  await firstType.locator("input").check();
  await page.locator("#questionCount").fill("2");
  await page.locator("#questionCount").dispatchEvent("input");
  await page.locator("#buildButton").click();
  assert.equal(await page.locator(".question-card").count(), 2, `${label}: expected two questions`);
  assert.equal(await page.locator("#typePreview[hidden]").count(), 1, `${label}: preview remained open over worksheet`);
  assert.equal(await page.locator("#questionGrid .textbook-concept-tutorial").count(), 2, `${label}: tutorial count mismatch`);
  assert.equal(await page.locator("#questionGrid .textbook-concept-tutorial li").count(), 6, `${label}: tutorial step count mismatch`);
  assert.equal(await page.locator(".concept-guide").count(), 0, `${label}: old concept guide duplicated`);
  assert.equal(await page.locator(".concept-worked-solution").count(), 2, `${label}: solution disclosure missing`);
  await page.locator(".concept-worked-solution summary").first().click();
  assert.ok((await page.locator(".concept-worked-solution[open] p").first().innerText()).trim(), `${label}: solution empty`);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), false, `${label}: horizontal overflow`);
  assert.deepEqual(errors, [], `${label}: browser errors ${errors.join(" | ")}`);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  await buildConceptWorksheet(desktop, "desktop");
  await desktop.emulateMedia({ media: "print" });
  const pdf = await desktop.pdf({ format: "A4", printBackground: true });
  const printPages = (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length;
  assert.equal(printPages, 1, `two concept questions should print on one page, got ${printPages}`);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await buildConceptWorksheet(mobile, "mobile");
  console.log("CURRICULUM_CONCEPT_BROWSER_OK desktop mobile preview tutorial solution printPages=1");
} finally {
  await browser.close();
}
