import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";

function syntheticRecords(book) {
  const records = {};
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.answerRef) records[node.answerRef] = { answer: "검사용", solution: "동작 구조 검사용 풀이" };
    Object.values(node).forEach(visit);
  };
  visit(book);
  return records;
}

const fixtures = Object.fromEntries(GOLDEN_BELL_BOOKS.map((book) => [book.id, syntheticRecords(book)]));
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/functions/v1/fields-auth", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.route("**/functions/v1/golden-bell-answers", (route) => {
    const { bookId } = route.request().postDataJSON();
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answers: fixtures[bookId] }) });
  });
  await page.addInitScript(() => {
    sessionStorage.setItem("gfield_fields_session", "isolated-motion-audit");
    sessionStorage.setItem("gf_n", "DEMO");
  });

  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-01`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  assert.equal((await page.locator(".experience-progress").textContent()).trim(), "1 / 5");
  await page.locator('[data-experience-action="play"]').click();
  assert.equal((await page.locator(".experience-progress").textContent()).trim(), "5 / 5", "reduced motion play must snap without a timer");
  await page.waitForTimeout(1700);
  assert.equal((await page.locator(".experience-progress").textContent()).trim(), "5 / 5", "reduced motion must not continue a hidden timer");

  await page.goto(`${baseUrl}/fields-classic/question-bank/golden-bell.html?student=DEMO&book=book-05`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => !document.querySelector(".protected-answer-notice"));
  await page.locator('[data-lesson="cube-tetrahedral-growth"]').click();
  const triangularProgress = (await page.locator(".experience-progress").textContent()).trim();
  const triangularSteps = Number(triangularProgress.split("/").at(-1).trim());
  assert.equal(triangularProgress, `1 / ${triangularSteps}`);
  assert.ok(triangularSteps > 1);
  await page.waitForTimeout(1200);
  assert.equal((await page.locator(".experience-progress").textContent()).trim(), `1 / ${triangularSteps}`, "reduced motion must suppress triangular autoplay");
  await page.locator('[data-experience-action="play"]').click();
  assert.equal((await page.locator(".experience-progress").textContent()).trim(), `${triangularSteps} / ${triangularSteps}`);
  assert.deepEqual(errors, []);
  console.log("GOLDEN_BELL_REDUCED_MOTION_OK viewport=390 autoplay=off play=snap");
} finally {
  await browser.close();
}
