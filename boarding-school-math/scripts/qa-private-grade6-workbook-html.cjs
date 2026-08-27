#!/usr/bin/env node
"use strict";

/*
 * Local-only visual QA for separately rendered private Grade 6 workbooks.
 * This public source contains no private source material and writes only
 * screenshots to an explicit external QA directory.
 */

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const renderer = require("./render-private-grade6-workbook.cjs");

const LOCALES = Object.freeze(["ko", "en", "zh-Hans"]);
const AUDIENCES = Object.freeze(["student", "teacher"]);
const VIEWPORTS = Object.freeze([
  Object.freeze({ label: "desktop", width: 1440, height: 1000 }),
  Object.freeze({ label: "mobile", width: 390, height: 844 })
]);

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function assert(condition, code) {
  if (!condition) fail(code);
}

function parseArguments(args) {
  assert(args.length === 6, "PRIVATE_HTML_QA_COMMAND_INVALID");
  const values = Object.create(null);
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    assert(["--input-root", "--unit", "--output"].includes(key) && typeof value === "string" && value.length > 0, "PRIVATE_HTML_QA_COMMAND_INVALID");
    assert(values[key] === undefined, "PRIVATE_HTML_QA_COMMAND_INVALID");
    values[key] = value;
  }
  assert(path.isAbsolute(values["--input-root"]) && path.isAbsolute(values["--output"]) && /^[a-z0-9-]+$/u.test(values["--unit"]), "PRIVATE_HTML_QA_COMMAND_INVALID");
  return Object.freeze({
    inputRoot: path.resolve(values["--input-root"]),
    unitId: values["--unit"],
    outputRoot: path.resolve(values["--output"])
  });
}

function assertOutputMissing(filePath) {
  try {
    fs.lstatSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    fail("PRIVATE_HTML_QA_OUTPUT_UNSAFE");
  }
  fail("PRIVATE_HTML_QA_OUTPUT_EXISTS");
}

function removeOwnedFile(filePath) {
  try {
    const stat = fs.lstatSync(filePath);
    assert(stat.isFile() && !stat.isSymbolicLink(), "PRIVATE_HTML_QA_CLEANUP_FAILED");
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    if (error && error.code === "PRIVATE_HTML_QA_CLEANUP_FAILED") throw error;
    fail("PRIVATE_HTML_QA_CLEANUP_FAILED");
  }
}

function createOwnedTemporaryDirectory(outputRoot) {
  const temporaryRoot = fs.mkdtempSync(path.join(outputRoot, ".private-html-qa-"));
  const stat = fs.lstatSync(temporaryRoot);
  assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_HTML_QA_OUTPUT_UNSAFE");
  try {
    fs.chmodSync(temporaryRoot, 0o700);
  } catch (_chmodError) {
    // Windows can ignore POSIX modes; the unique external directory is still
    // owned by this invocation and protected by exclusive final copies.
  }
  return temporaryRoot;
}

function removeOwnedTemporaryDirectory(temporaryRoot) {
  try {
    const stat = fs.lstatSync(temporaryRoot);
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_HTML_QA_CLEANUP_FAILED");
    fs.rmSync(temporaryRoot, { recursive: true, force: false, maxRetries: 1 });
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    if (error && error.code === "PRIVATE_HTML_QA_CLEANUP_FAILED") throw error;
    fail("PRIVATE_HTML_QA_CLEANUP_FAILED");
  }
}

function copyScreenshotExclusive(temporaryPath, outputPath) {
  try {
    fs.copyFileSync(temporaryPath, outputPath, fs.constants.COPYFILE_EXCL);
  } catch (error) {
    if (error && error.code === "EEXIST") fail("PRIVATE_HTML_QA_OUTPUT_EXISTS");
    fail("PRIVATE_HTML_QA_OUTPUT_WRITE_FAILED");
  }
}

function expectedFileName(unitId, locale, audience) {
  return `${unitId.replace(/^ccss-/u, "")}-${locale}-${audience}.html`;
}

function expectedScreenshotName(unitId, locale, audience, viewport) {
  return `${unitId.replace(/^ccss-/u, "")}-${locale}-${audience}-${viewport}.png`;
}

async function inspectDocument(page, audience, unitId) {
  return page.evaluate(function (expectedAudience) {
    const root = document.documentElement;
    const main = document.querySelector("main");
    const watermark = document.querySelector(".private-watermark");
    return {
      audience: main && main.dataset.documentAudience,
      targetPages: main && main.dataset.layoutTargetPages,
      overflow: root.scrollWidth > window.innerWidth + 1,
      scriptCount: document.scripts.length,
      formControlCount: document.querySelectorAll("input, select, textarea, [value], :checked").length,
      truthControlCount: document.querySelectorAll(".truth-value").length,
      watermarkPresent: !!watermark,
      printWatermark: watermark ? getComputedStyle(watermark).display : "",
      expectedAudience
    };
  }, audience).then(function (result) {
    assert(result.audience === audience, "PRIVATE_HTML_QA_AUDIENCE_INVALID");
    assert(/^[1-9][0-9]*$/u.test(String(result.targetPages || "")), "PRIVATE_HTML_QA_LAYOUT_TARGET_INVALID");
    assert(result.overflow === false && result.scriptCount === 0 && result.formControlCount === 0 && result.watermarkPresent, "PRIVATE_HTML_QA_DOCUMENT_UNSAFE");
    if (unitId === "ccss-6-ee-b") {
      assert(result.truthControlCount === (audience === "student" ? 22 : 0), "PRIVATE_HTML_QA_RESPONSE_UI_INVALID");
    }
  });
}

async function runQa(options) {
  const inputRoot = renderer.assertExternalDirectory(options.inputRoot);
  const outputRoot = renderer.assertExternalDirectory(options.outputRoot);
  assert(inputRoot !== outputRoot, "PRIVATE_HTML_QA_OUTPUT_OVERLAPS_INPUT");
  fs.mkdirSync(outputRoot, { recursive: true });
  assert(renderer.assertExternalDirectory(outputRoot) === outputRoot, "PRIVATE_HTML_QA_OUTPUT_UNSAFE");
  const plan = LOCALES.flatMap(function (locale) {
    return AUDIENCES.flatMap(function (audience) {
      return VIEWPORTS.map(function (viewport) {
        const inputPath = path.join(inputRoot, expectedFileName(options.unitId, locale, audience));
        const outputPath = path.join(outputRoot, expectedScreenshotName(options.unitId, locale, audience, viewport.label));
        const inputStat = fs.lstatSync(inputPath);
        assert(inputStat.isFile() && !inputStat.isSymbolicLink() && inputStat.size > 0 && inputStat.size <= 5 * 1024 * 1024, "PRIVATE_HTML_QA_INPUT_UNSAFE");
        assertOutputMissing(outputPath);
        return Object.freeze({ locale, audience, viewport, inputPath, outputPath });
      });
    });
  });
  const temporaryRoot = createOwnedTemporaryDirectory(outputRoot);
  const stagedPlan = plan.map(function (item) {
    return Object.freeze({ ...item, temporaryPath: path.join(temporaryRoot, path.basename(item.outputPath)) });
  });
  const finalized = [];
  let browser;
  let failed = false;
  try {
    browser = await chromium.launch({ headless: true });
    for (const item of stagedPlan) {
      const page = await browser.newPage({ viewport: { width: item.viewport.width, height: item.viewport.height }, deviceScaleFactor: 1 });
      try {
        await page.goto(pathToFileURL(item.inputPath).href, { waitUntil: "load" });
        await page.evaluate(function () { return document.fonts.ready; });
        await inspectDocument(page, item.audience, options.unitId);
        await page.screenshot({ path: item.temporaryPath, fullPage: true });
        await page.emulateMedia({ media: "print" });
        const printWatermark = await page.evaluate(function () {
          const watermark = document.querySelector(".private-watermark");
          return watermark ? getComputedStyle(watermark).display : "";
        });
        assert(printWatermark === "block", "PRIVATE_HTML_QA_PRINT_WATERMARK_INVALID");
      } finally {
        await page.close();
      }
    }
    stagedPlan.forEach(function (item) {
      assertOutputMissing(item.outputPath);
      copyScreenshotExclusive(item.temporaryPath, item.outputPath);
      finalized.push(item.outputPath);
    });
  } catch (error) {
    failed = true;
    finalized.forEach(function (outputPath) {
      try {
        removeOwnedFile(outputPath);
      } catch (_cleanupError) {
        // The original QA failure remains the useful result. Only files copied
        // by this invocation are eligible for rollback.
      }
    });
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (_closeError) {
        // All page-level assertions and screenshots have already completed.
      }
    }
    try {
      removeOwnedTemporaryDirectory(temporaryRoot);
    } catch (cleanupError) {
      if (!failed) throw cleanupError;
    }
  }
  return Object.freeze({ files: LOCALES.length * AUDIENCES.length, viewports: plan.length, printWatermarks: LOCALES.length * AUDIENCES.length });
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = await runQa(options);
    process.stdout.write(`PRIVATE_RENDER_HTML_QA_OK unit=${options.unitId} files=${result.files} viewports=${result.viewports} printWatermarks=${result.printWatermarks}\n`);
  } catch (error) {
    process.stderr.write(`PRIVATE_RENDER_HTML_QA_FAILED code=${error && error.code ? error.code : "UNEXPECTED_HTML_QA_ERROR"}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = Object.freeze({
  expectedFileName,
  expectedScreenshotName,
  copyScreenshotExclusive,
  createOwnedTemporaryDirectory,
  parseArguments,
  removeOwnedTemporaryDirectory,
  runQa
});
