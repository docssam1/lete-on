import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const modules = process.env.CODEX_NODE_MODULES
  || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = await import(pathToFileURL(path.join(modules, "playwright/index.mjs")).href);
const { PDFDocument } = createRequire(import.meta.url)(path.join(modules, "pdf-lib"));

const base = process.env.FIELDS_BASE_URL || "http://127.0.0.1:8794";
const url = `${base}/fields-classic/question-bank/?student=DEMO&mode=curriculum`;
const output = process.env.FIELDS_CAPTURE_DIR
  || path.join(os.tmpdir(), "fields-question-bank-layout-audit");
const viewports = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 900 }];
const modes = ["exam", "curriculum", "type"];
const report = {
  url,
  scope: "Question-bank UI regression only; no mathematical or source-content audit",
  viewports,
  checks: [],
  failures: [],
  pageErrors: []
};

await fs.mkdir(output, { recursive: true });

function check(name, pass, details = {}) {
  const item = { name, pass: Boolean(pass), ...details };
  report.checks.push(item);
  if (!item.pass) report.failures.push(item);
  return item.pass;
}

function errorText(error) {
  return error instanceof Error ? error.message : String(error);
}

async function settle(page) {
  await page.waitForTimeout(60);
}

async function capture(page, filename) {
  try {
    await page.screenshot({ path: path.join(output, filename), fullPage: false });
  } catch (error) {
    check(`screenshot:${filename}`, false, { error: errorText(error) });
  }
}

async function gotoBank(page, context) {
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.locator("#builderPanel").waitFor({ state: "visible", timeout: 10000 });
    check("navigation", Boolean(response?.ok()), { context, status: response?.status() ?? null });
    await settle(page);
    return true;
  } catch (error) {
    check("navigation", false, { context, error: errorText(error) });
    return false;
  }
}

async function auditOverflow(page, context) {
  try {
    const result = await page.evaluate(() => {
      const panel = document.querySelector("#builderPanel");
      const worksheet = document.querySelector("#worksheetSection");
      return {
        document: document.documentElement.scrollWidth - innerWidth,
        body: document.body.scrollWidth - innerWidth,
        panel: panel ? panel.scrollWidth - panel.clientWidth : null,
        worksheet: worksheet && !worksheet.hidden ? worksheet.scrollWidth - worksheet.clientWidth : null
      };
    });
    const maxOverflow = Math.max(result.document, result.body, result.panel || 0, result.worksheet || 0);
    check(`no-horizontal-overflow:${context}`, maxOverflow <= 1, { context, maxOverflow, result });
  } catch (error) {
    check(`no-horizontal-overflow:${context}`, false, { context, error: errorText(error) });
  }
}

async function auditFonts(page, mode, context) {
  const selectors = {
    type: mode === "exam"
      ? ["#examTypeList .exam-row > span:not(.number) > strong"]
      : mode === "curriculum"
        ? ["#curriculumTree .curriculum-type > span > strong", "#curriculumTree .unit-test-question strong"]
        : ["#bankTypeTree .type-leaf > span > strong"],
    metadata: mode === "exam"
      ? ["#examTypeList .exam-row > span:not(.number) > span"]
      : mode === "curriculum"
        ? ["#curriculumTree .curriculum-type > span > span", "#curriculumTree .unit-test-question small"]
        : ["#bankTypeTree .type-leaf > span > span"]
  };
  try {
    const result = await page.evaluate((input) => {
      const displayed = (node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && node.textContent.trim();
      };
      const collect = (list) => list.flatMap((selector) => [...document.querySelectorAll(selector)]
        .filter(displayed)
        .map((node) => ({ selector, text: node.textContent.trim().slice(0, 80), fontSize: parseFloat(getComputedStyle(node).fontSize) })));
      return { type: collect(input.type), metadata: collect(input.metadata) };
    }, selectors);
    const typeMin = result.type.length ? Math.min(...result.type.map((item) => item.fontSize)) : 0;
    const metadataMin = result.metadata.length ? Math.min(...result.metadata.map((item) => item.fontSize)) : 0;
    check(`type-fonts>=15:${context}`, result.type.length > 0 && typeMin >= 15, {
      mode, context, sampleCount: result.type.length, minFontSize: typeMin, violations: result.type.filter((item) => item.fontSize < 15).slice(0, 8)
    });
    check(`metadata-fonts>=12:${context}`, result.metadata.length > 0 && metadataMin >= 12, {
      mode, context, sampleCount: result.metadata.length, minFontSize: metadataMin, violations: result.metadata.filter((item) => item.fontSize < 12).slice(0, 8)
    });
  } catch (error) {
    check(`font-audit:${context}`, false, { mode, context, error: errorText(error) });
  }
}

async function auditSearch(page, context) {
  try {
    const before = await page.locator(".bank-search label, #bankSearchStatus").evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }));
    const fontSize = await page.locator("#bankSearch").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    await page.locator("#bankSearch").fill("색종이");
    await settle(page);
    const clear = page.locator("#clearBankSearch");
    const clearVisible = await clear.isVisible();
    const clearBox = await clear.boundingBox();
    const afterQuery = await page.locator(".bank-search label, #bankSearchStatus").evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }));
    const stableAfterQuery = before.length === afterQuery.length && before.every((item, index) => {
      const next = afterQuery[index];
      return ["x", "y", "width", "height"].every((key) => Math.abs(item[key] - next[key]) <= 1.5);
    });
    check(`search-font>=16:${context}`, fontSize >= 16, { context, fontSize });
    check(`search-clear-visible:${context}`, clearVisible && clearBox?.width >= 44 && clearBox?.height >= 44, {
      context, clearVisible, clearBox
    });
    check(`search-clear-layout-stable:${context}`, stableAfterQuery, { context, before, afterQuery });
    await clear.click();
    await settle(page);
    const focused = await page.evaluate(() => document.activeElement?.id);
    check(`search-clear-focuses-input:${context}`, focused === "bankSearch", { context, focused });
  } catch (error) {
    check(`search-audit:${context}`, false, { context, error: errorText(error) });
  }
}

async function auditDockStructure(page, context) {
  try {
    const result = await page.evaluate(() => {
      const panel = document.querySelector("#builderPanel");
      const body = document.querySelector(".builder-body");
      const dock = panel?.querySelector(".selection-dock");
      const style = dock ? getComputedStyle(dock) : null;
      return {
        exists: Boolean(dock),
        insidePanel: Boolean(panel && dock && panel.contains(dock)),
        outsideBody: Boolean(dock && body && !body.contains(dock)),
        hasSummary: Boolean(dock?.querySelector("#selectionTotal")),
        hasBuildButton: Boolean(dock?.querySelector("#buildButton")),
        hasSettingsJump: dock?.querySelector(".settings-jump")?.getAttribute("href") === "#bankSettings"
          && Boolean(document.querySelector("#bankSettings")),
        position: style?.position || null,
        bottom: style ? parseFloat(style.bottom) : null
      };
    });
    check(`selection-dock-structure:${context}`, result.exists && result.insidePanel && result.outsideBody
      && result.hasSummary && result.hasBuildButton && result.hasSettingsJump
      && result.position === "sticky" && result.bottom >= 0, { context, result });
  } catch (error) {
    check(`selection-dock-structure:${context}`, false, { context, error: errorText(error) });
  }
}

async function auditDockPositions(page, viewport, context) {
  const positions = ["top", "middle", "bottom"];
  try {
    const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - innerHeight));
    const yValues = [0, Math.floor(maxScroll / 2), maxScroll];
    for (let index = 0; index < positions.length; index += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), yValues[index]);
      await settle(page);
      const result = await page.evaluate(() => {
        const visible = (node) => {
          if (!node) return false;
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0
            && rect.top >= -0.5 && rect.bottom <= innerHeight + 0.5
            && rect.left >= -0.5 && rect.right <= innerWidth + 0.5;
        };
        const button = document.querySelector(".selection-dock #buildButton");
        const buttonRect = button?.getBoundingClientRect();
        const hitTarget = buttonRect
          ? document.elementFromPoint(buttonRect.left + buttonRect.width / 2, buttonRect.top + buttonRect.height / 2)
          : null;
        return {
          dock: visible(document.querySelector(".selection-dock")),
          button: visible(button),
          buttonHit: Boolean(button && hitTarget && (hitTarget === button || button.contains(hitTarget))),
          y: scrollY,
          maxScroll: Math.max(0, document.documentElement.scrollHeight - innerHeight)
        };
      });
      check(`selection-dock-visible-${positions[index]}:${context}`, result.dock && result.button && result.buttonHit, { context, position: positions[index], result });
      await capture(page, `dock-${viewport.name}-${positions[index]}.png`);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
  } catch (error) {
    check(`selection-dock-position-audit:${context}`, false, { context, error: errorText(error) });
  }
}

const checkboxSelectors = {
  exam: '#examTypeList input[data-exam-key]:not([disabled])',
  curriculum: '#curriculumTree input[data-curriculum-key]:not([disabled]), #curriculumTree input[data-unit-test-key]:not([disabled])',
  type: '#bankTypeTree input[data-type-id]:not([disabled])'
};

async function chooseAvailable(page, mode, context) {
  const locator = page.locator(checkboxSelectors[mode]).first();
  try {
    const count = await page.locator(checkboxSelectors[mode]).count();
    if (!count) {
      check(`available-checkbox:${context}`, false, { mode, reason: "no enabled checkbox with an actual selection key" });
      return null;
    }
    const key = await locator.evaluate((node) => node.dataset.examKey || node.dataset.curriculumKey || node.dataset.unitTestKey || node.dataset.typeId || "");
    await locator.check();
    await settle(page);
    const summary = await page.locator("#selectionTotal").textContent();
    check(`available-checkbox:${context}`, Boolean(key) && Boolean(summary && !summary.startsWith("0")), { mode, key, summary });
    return { key, summary: summary || "" };
  } catch (error) {
    check(`available-checkbox:${context}`, false, { mode, error: errorText(error) });
    return null;
  }
}

async function auditCurriculumPersistence(page, viewport) {
  const selected = await chooseAvailable(page, "curriculum", `${viewport.name}:curriculum-persistence`);
  if (!selected) return;
  try {
    const searchInput = page.locator("#bankSearch");
    await searchInput.fill("색종이");
    await settle(page);
    const afterSearch = await page.locator("#selectionTotal").textContent();
    check(`summary-persists-through-search:${viewport.name}`, afterSearch === selected.summary, {
      viewport: viewport.name, before: selected.summary, after: afterSearch
    });
    await page.locator("#clearBankSearch").click();
    await settle(page);
    const bookButtons = page.locator("#curriculumTree button[data-curriculum-book]");
    const bookCount = await bookButtons.count();
    if (bookCount < 2) {
      check(`summary-book-change:${viewport.name}`, false, { reason: "fewer than two curriculum book tabs" });
      return;
    }
    const selectedBook = String(selected.key).split(":")[0];
    const otherIndex = await bookButtons.evaluateAll((buttons, current) => {
      const index = buttons.findIndex((button) => button.dataset.curriculumBook !== current);
      return index < 0 ? 0 : index;
    }, selectedBook);
    await bookButtons.nth(otherIndex).click();
    await settle(page);
    const afterBook = await page.locator("#selectionTotal").textContent();
    check(`summary-persists-through-book-change:${viewport.name}`, afterBook === selected.summary, {
      viewport: viewport.name, before: selected.summary, after: afterBook, selectedBook, otherIndex
    });
    const originalButton = page.locator(`button[data-curriculum-book="${selectedBook}"]`);
    if (await originalButton.count()) {
      await originalButton.click();
      await settle(page);
    }
    const stillChecked = await page.locator("#curriculumTree input[data-curriculum-key], #curriculumTree input[data-unit-test-key]")
      .evaluateAll((nodes, wanted) => nodes.some((node) => (node.dataset.curriculumKey || node.dataset.unitTestKey) === wanted && node.checked), selected.key);
    check(`selected-key-persists-through-book-change:${viewport.name}`, stillChecked, { viewport: viewport.name, key: selected.key });
  } catch (error) {
    check(`curriculum-persistence:${viewport.name}`, false, { viewport: viewport.name, error: errorText(error) });
  }
}

async function auditMode(page, viewport, mode) {
  const context = `${viewport.name}:${mode}`;
  try {
    await page.locator(`#builderTabs button[data-mode="${mode}"]`).click();
    await settle(page);
    const active = await page.locator(`#${mode === "exam" ? "examBuilder" : mode === "curriculum" ? "curriculumBuilder" : "typeBuilder"}`).isVisible();
    check(`finding-tab-visible:${context}`, active, { mode, active });
    await auditOverflow(page, context);
    await auditFonts(page, mode, context);
    await chooseAvailable(page, mode, context);
    await capture(page, `${viewport.name}-${mode}.png`);
  } catch (error) {
    check(`finding-tab:${context}`, false, { mode, error: errorText(error) });
  }
}

async function auditBuildWorkflow(page, viewport) {
  const context = `${viewport.name}:build`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.locator("#builderPanel").waitFor({ state: "visible", timeout: 10000 });
    await settle(page);
    await page.locator('#builderTabs button[data-mode="curriculum"]').click();
    await settle(page);
    const selected = await chooseAvailable(page, "curriculum", context);
    if (!selected) return;
    const countInput = page.locator("#questionCount");
    await countInput.fill("3");
    await countInput.dispatchEvent("change");
    await settle(page);
    const countValue = await countInput.inputValue();
    check(`small-count-set:${context}`, countValue === "3", { context, countValue });
    const button = page.locator("#buildButton");
    check(`build-button-enabled:${context}`, await button.isEnabled(), { context });
    await button.click();
    await page.locator("#worksheetSection").waitFor({ state: "visible", timeout: 30000 });
    await settle(page);
    const questionCount = await page.locator(".question-card").count();
    check(`worksheet-has-exactly-3-questions:${context}`, questionCount === 3, { context, questionCount });
    check(`selection-dock-absent-on-worksheet:${context}`, !(await page.locator(".selection-dock").isVisible()), { context });
    check(`builder-hidden-on-worksheet:${context}`, await page.locator("#builderPanel").isHidden(), { context });
    await capture(page, `${viewport.name}-worksheet.png`);
    if (viewport.name === "desktop") {
      await page.emulateMedia({ media: "print" });
      const printDockVisible = await page.locator(".selection-dock").isVisible();
      check(`selection-dock-absent-in-print:${context}`, !printDockVisible, { context, printDockVisible });
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
      const pdfDoc = await PDFDocument.load(pdf);
      check(`worksheet-pdf-has-exactly-2-pages:${context}`, pdfDoc.getPageCount() === 2, { context, pages: pdfDoc.getPageCount() });
      await fs.writeFile(path.join(output, "worksheet-no-answers.pdf"), pdf);
      await page.emulateMedia({ media: "screen" });
    }
    await page.locator("#backToBuilder").click();
    await settle(page);
    check(`back-to-builder:${context}`, await page.locator("#builderPanel").isVisible() && await page.locator("#worksheetSection").isHidden(), { context });
    await auditDockStructure(page, context);
    await auditDockPositions(page, viewport, context);
    await auditOverflow(page, `${context}:back`);
  } catch (error) {
    check(`build-workflow:${context}`, false, { context, error: errorText(error) });
  }
}

const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      locale: "ko-KR",
      isMobile: viewport.name === "mobile",
      hasTouch: viewport.name === "mobile"
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => report.pageErrors.push({ viewport: viewport.name, message: error.message }));
    try {
      if (!(await gotoBank(page, viewport.name))) continue;
      await auditOverflow(page, `${viewport.name}:initial`);
      await auditDockStructure(page, `${viewport.name}:initial`);
      await auditSearch(page, `${viewport.name}:initial`);
      for (const mode of modes) {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.locator("#builderPanel").waitFor({ state: "visible", timeout: 10000 });
        await settle(page);
        await auditMode(page, viewport, mode);
      }
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.locator("#builderPanel").waitFor({ state: "visible", timeout: 10000 });
      await settle(page);
      await auditCurriculumPersistence(page, viewport);
      await auditDockPositions(page, viewport, `${viewport.name}:selected`);
      await auditBuildWorkflow(page, viewport);
    } catch (error) {
      check(`viewport-run:${viewport.name}`, false, { viewport: viewport.name, error: errorText(error) });
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

report.pageErrorCount = report.pageErrors.length;
check("page-errors", report.pageErrorCount === 0, {
  pageErrorCount: report.pageErrorCount,
  pageErrors: report.pageErrors.slice(0, 12)
});
report.pass = report.failures.length === 0;
await fs.writeFile(path.join(output, "question-bank-layout-browser-audit.json"), JSON.stringify(report, null, 2));
console.log(`${report.pass ? "QUESTION_BANK_LAYOUT_BROWSER_AUDIT_OK" : "QUESTION_BANK_LAYOUT_BROWSER_AUDIT_FAILED"} ${JSON.stringify({ checks: report.checks.length, failures: report.failures.length, pageErrors: report.pageErrorCount, output })}`);
process.exitCode = report.pass ? 0 : 1;
