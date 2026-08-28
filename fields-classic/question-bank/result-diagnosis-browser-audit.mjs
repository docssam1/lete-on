import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const runtimeModules = process.env.CODEX_NODE_MODULES
  || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(pathToFileURL(path.join(runtimeModules, "playwright", "index.mjs")).href);
const baseUrl = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const screenshotDir = process.env.TEMP || process.cwd();
const browser = await chromium.launch({ headless: true });
const isExpectedOfflineFontError = (message) => message.includes("ERR_NETWORK_ACCESS_DENIED");

async function fillResults(page, correctCount) {
  const rows = page.locator(".response-row");
  const total = await rows.count();
  for (let index = 0; index < total; index += 1) {
    await rows.nth(index).locator(index < correctCount ? "button[data-result=correct]" : "button[data-result=incorrect]").click();
  }
  await page.locator("#showResult").click();
  return total;
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const desktopErrors = [];
  desktop.on("console", (message) => { if (message.type() === "error") desktopErrors.push(message.text()); });
  desktop.on("pageerror", (error) => desktopErrors.push(error.message));
  await desktop.goto(`${baseUrl}/fields-classic/question-bank/result-diagnosis.html?student=AUDIT&exam=diagnostic-mock`, { waitUntil: "networkidle" });
  await desktop.evaluate(() => localStorage.clear());
  await desktop.reload({ waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".response-row").count(), 25, "진단 모의고사는 25문항이어야 한다.");
  assert.equal(await fillResults(desktop, 20), 25);
  assert.equal(await desktop.locator("#scoreValue").textContent(), "80점");
  assert.equal(await desktop.locator("#diagnosisPanel").isVisible(), true);
  assert.ok(await desktop.locator(".weak-type").count() > 0, "오답 세부 유형이 표시되지 않음");
  assert.equal(await desktop.locator("#printResult").isVisible(), true, "결과 인쇄 버튼이 표시되지 않음");
  assert.equal(await desktop.locator("#printStudent").textContent(), "AUDIT 학생");
  assert.equal(await desktop.locator("#printWatermark span").count(), 6, "인쇄 워터마크 반복 수가 다름");
  const remedialHref = await desktop.locator("#remediationLink").getAttribute("href");
  assert.ok(remedialHref.includes("mode=type") && remedialHref.includes("types="), "보충 문제 링크가 유형 선택으로 연결되지 않음");
  assert.deepEqual(desktopErrors.filter((message) => !isExpectedOfflineFontError(message)), [], `브라우저 오류: ${desktopErrors.join(" | ")}`);
  await desktop.screenshot({ path: path.join(screenshotDir, "fields-result-diagnosis-desktop.png"), fullPage: true });
  await desktop.emulateMedia({ media: "print" });
  assert.equal(await desktop.locator(".entry-panel").evaluate((element) => getComputedStyle(element).display), "none", "인쇄에서 O/X 입력 화면이 숨겨지지 않음");
  assert.equal(await desktop.locator(".remediation-panel").evaluate((element) => getComputedStyle(element).display), "none", "인쇄에서 보충 설정이 숨겨지지 않음");
  assert.notEqual(await desktop.locator("#diagnosisPanel").evaluate((element) => getComputedStyle(element).display), "none", "인쇄에서 진단 결과가 숨겨짐");
  const printPdfPath = path.join(screenshotDir, "fields-result-diagnosis-print.pdf");
  await desktop.pdf({ path: printPdfPath, format: "A4", printBackground: true, margin: { top: "11mm", right: "11mm", bottom: "11mm", left: "11mm" } });
  const printPdfSize = (await stat(printPdfPath)).size;
  assert.ok(printPdfSize > 20_000, `인쇄 PDF가 비정상적으로 작음: ${printPdfSize}`);
  await desktop.emulateMedia({ media: "screen" });

  await desktop.goto(new URL(remedialHref, desktop.url()).href, { waitUntil: "networkidle" });
  assert.equal(await desktop.locator("button[data-mode=type]").getAttribute("class"), "active", "유형별 탭이 열리지 않음");
  const preselectedTypeCount = await desktop.locator("#bankTypeTree input[data-type-id]:checked").count();
  assert.ok(preselectedTypeCount > 0, "취약 유형이 미리 선택되지 않음");

  await desktop.goto(`${baseUrl}/fields-classic/question-bank/result-diagnosis.html?student=AUDIT&exam=final-1`, { waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".response-row").count(), 20, "파이널 시험은 20문항이어야 한다.");
  await fillResults(desktop, 20);
  assert.equal(await desktop.locator("#scoreValue").textContent(), "100점");
  assert.equal(await desktop.locator(".all-clear").count(), 1, "만점 상태가 표시되지 않음");

  await desktop.goto(`${baseUrl}/fields-classic/question-bank/original-diagnosis.html?student=AUDIT&exam=k6-2023-02`, { waitUntil: "networkidle" });
  assert.equal(await desktop.locator(".response-card").count(), 20, "기존 원본 진단 화면이 변경됨");
  assert.equal(await desktop.locator("#showResult").isDisabled(), true, "기존 원본 진단의 입력 게이트가 변경됨");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const mobileErrors = [];
  mobile.on("console", (message) => { if (message.type() === "error") mobileErrors.push(message.text()); });
  mobile.on("pageerror", (error) => mobileErrors.push(error.message));
  await mobile.goto(`${baseUrl}/fields-classic/question-bank/result-diagnosis.html?student=AUDIT-MOBILE&exam=diagnostic-mock`, { waitUntil: "networkidle" });
  const overflow = await mobile.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert.ok(overflow.scrollWidth <= overflow.clientWidth + 1, `모바일 가로 넘침: ${JSON.stringify(overflow)}`);
  assert.equal(await mobile.locator(".response-row").count(), 25);
  assert.deepEqual(mobileErrors.filter((message) => !isExpectedOfflineFontError(message)), [], `모바일 브라우저 오류: ${mobileErrors.join(" | ")}`);
  await mobile.screenshot({ path: path.join(screenshotDir, "fields-result-diagnosis-mobile.png"), fullPage: true });

  await mobile.goto(`${baseUrl}/fields-classic/question-bank/?student=AUDIT-MOBILE`, { waitUntil: "networkidle" });
  assert.equal(await mobile.locator("#resultDiagnosisLink").count(), 1, "문제은행에 시험 결과 진단 링크가 없음");
  assert.equal(await mobile.locator("#goldenBellLink").count(), 1, "골든벨 학습 링크가 사라짐");
  const bankOverflow = await mobile.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert.ok(bankOverflow.scrollWidth <= bankOverflow.clientWidth + 1, `문제은행 모바일 가로 넘침: ${JSON.stringify(bankOverflow)}`);

  console.log(JSON.stringify({
    desktop: { questionCount: 25, score: 80, screenshot: path.join(screenshotDir, "fields-result-diagnosis-desktop.png"), printPdfPath, printPdfSize },
    remediation: { preselectedTypeCount },
    final: { questionCount: 20, score: 100 },
    mobile: { ...overflow, bankOverflow, screenshot: path.join(screenshotDir, "fields-result-diagnosis-mobile.png") }
  }, null, 2));
} finally {
  await browser.close();
}
