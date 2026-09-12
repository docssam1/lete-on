"use strict";

const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");

const root = path.resolve(__dirname, "../..");
const outputDir = process.env.HSE_SCREENSHOT_DIR || path.join(os.tmpdir(), "hselementary-type-preview-ux-audit");
const targetTypeId = process.env.HSE_PREVIEW_TYPE_ID || "6-1-u6-e1-exploration";
const failures = [];

function fail(message) {
  failures.push(message);
}

function startServer() {
  const server = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
    const relative = requestPath === "/" ? "/hselementary/question-bank/index.html" : requestPath;
    const filePath = path.resolve(root, `.${relative}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404);
      response.end("not found");
      return;
    }
    const contentType = {
      ".css": "text/css",
      ".html": "text/html",
      ".js": "application/javascript",
      ".json": "application/json",
      ".svg": "image/svg+xml"
    }[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8`, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve({
    server,
    baseUrl: `http://127.0.0.1:${server.address().port}`
  })));
}

async function inspectPreview(page, viewportName) {
  const row = page.locator(`[data-preview-type-id="${targetTypeId}"]`);
  await row.scrollIntoViewIfNeeded();
  const selectedBefore = await page.locator("input[data-type-id]:checked").count();
  await row.locator(".tree-type-preview-action").click();

  const popover = page.locator("#typePreviewPopover");
  await popover.waitFor({ state: "visible" });
  const state = await page.evaluate(({ id, mobile }) => {
    const anchor = document.querySelector(`[data-preview-type-id="${id}"]`);
    const preview = document.querySelector("#typePreviewPopover");
    const previewRect = preview.getBoundingClientRect();
    const questionRect = preview.querySelector(".type-preview-question")?.getBoundingClientRect();
    const diagrams = [...preview.querySelectorAll("svg")].map(svg => {
      const rect = svg.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    });
    return {
      mobile,
      parentMatches: mobile
        ? preview.previousElementSibling === anchor
        : preview.parentElement?.classList.contains("composition-pane"),
      position: getComputedStyle(preview).position,
      previewRect: { left: previewRect.left, right: previewRect.right, width: previewRect.width },
      questionRect: questionRect && { left: questionRect.left, right: questionRect.right, width: questionRect.width },
      diagrams,
      previewOverflow: preview.scrollWidth > preview.clientWidth + 2,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      expanded: anchor?.getAttribute("aria-expanded"),
      hiddenAnswerMarkers: preview.querySelectorAll("[data-surface-answer],.source61-surface-e1-result").length,
      title: preview.querySelector("header strong")?.textContent?.trim() || ""
    };
  }, { id: targetTypeId, mobile: viewportName === "mobile" });

  if (!state.parentMatches) fail(`${viewportName}: 미리보기 위치가 화면 규칙과 다릅니다.`);
  if (state.position !== "static") fail(`${viewportName}: 미리보기가 목록 위에 떠 있습니다 (${state.position}).`);
  if (state.previewOverflow || state.pageOverflow) fail(`${viewportName}: 미리보기 또는 페이지에 가로 잘림이 있습니다.`);
  if (state.previewRect.left < -1 || state.previewRect.right > (viewportName === "mobile" ? 391 : 1441)) fail(`${viewportName}: 미리보기가 화면 밖으로 나갑니다.`);
  if (state.questionRect && (state.questionRect.left < state.previewRect.left - 1 || state.questionRect.right > state.previewRect.right + 1)) fail(`${viewportName}: 문제 내용이 미리보기 밖으로 나갑니다.`);
  if (state.diagrams.some(rect => rect.left < state.previewRect.left - 1 || rect.right > state.previewRect.right + 1)) fail(`${viewportName}: 도형이 미리보기 밖으로 나갑니다.`);
  if (state.expanded !== "true") fail(`${viewportName}: 열린 상태가 보조기기에 전달되지 않습니다.`);
  if (state.hiddenAnswerMarkers) fail(`${viewportName}: 학생용 미리보기에 정답 표시가 포함됐습니다.`);
  if (!state.title) fail(`${viewportName}: 미리보기 유형명이 비었습니다.`);
  if (await page.locator("input[data-type-id]:checked").count() !== selectedBefore) fail(`${viewportName}: 미리보기 동작이 유형 선택을 바꿨습니다.`);

  await page.screenshot({ path: path.join(outputDir, `${viewportName}-open.png`), fullPage: true });
  await page.screenshot({ path: path.join(outputDir, `${viewportName}-open-viewport.png`), fullPage: false });
  await popover.locator("[data-close-type-preview]").click();
  if (await popover.isVisible()) fail(`${viewportName}: 닫기 버튼으로 미리보기가 닫히지 않습니다.`);
  if (!(await row.evaluate(node => document.activeElement === node))) fail(`${viewportName}: 닫은 뒤 유형 행으로 초점이 돌아오지 않습니다.`);

  await row.press("Enter");
  await popover.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  if (await popover.isVisible()) fail(`${viewportName}: Esc로 미리보기가 닫히지 않습니다.`);
}

async function main() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  const { server, baseUrl } = await startServer();
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 960 },
      { name: "mobile", width: 390, height: 844 }
    ]) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      await page.goto(`${baseUrl}/hselementary/question-bank/index.html`, { waitUntil: "networkidle" });
      await page.locator('[data-grade="6"]').click();
      await page.locator('[data-term="1"]').click();
      await inspectPreview(page, viewport.name);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`유형 미리보기 UI 감사 통과: 클릭/키보드/Esc/초점 복귀/선택 불변/잘림 없음 (${outputDir})`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
