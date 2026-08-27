#!/usr/bin/env node
"use strict";

/*
 * Local-only PDF export for one already-rendered private Grade 6 HTML workbook.
 * It accepts only explicit external paths, writes no public release artifact,
 * and never overwrites a file created by another invocation.
 */

const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const renderer = require("./render-private-grade6-workbook.cjs");

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function assert(condition, code) {
  if (!condition) fail(code);
}

function parseWorkbookFileName(filePath, extension) {
  const match = /^([a-z0-9]+(?:-[A-Za-z0-9]+)*)-(student|teacher)\.([a-z]+)$/u.exec(path.basename(filePath));
  assert(match && match[3] === extension, "PRIVATE_PDF_EXPORT_COMMAND_INVALID");
  return Object.freeze({ stem: match[1], audience: match[2] });
}

function parseArguments(args) {
  assert(args.length === 4, "PRIVATE_PDF_EXPORT_COMMAND_INVALID");
  const values = Object.create(null);
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    assert(["--input", "--output"].includes(key) && typeof value === "string" && value.length > 0 && values[key] === undefined, "PRIVATE_PDF_EXPORT_COMMAND_INVALID");
    values[key] = value;
  }
  assert(path.isAbsolute(values["--input"]) && path.isAbsolute(values["--output"]), "PRIVATE_PDF_EXPORT_COMMAND_INVALID");
  const inputFile = parseWorkbookFileName(values["--input"], "html");
  const outputFile = parseWorkbookFileName(values["--output"], "pdf");
  assert(inputFile.stem === outputFile.stem && inputFile.audience === outputFile.audience, "PRIVATE_PDF_EXPORT_FILE_BINDING_INVALID");
  return Object.freeze({ inputPath: path.resolve(values["--input"]), outputPath: path.resolve(values["--output"]) });
}

function assertOutputMissing(filePath) {
  try {
    fs.lstatSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    fail("PRIVATE_PDF_EXPORT_OUTPUT_UNSAFE");
  }
  fail("PRIVATE_PDF_EXPORT_OUTPUT_EXISTS");
}

function removeOwnedFile(filePath) {
  try {
    const stat = fs.lstatSync(filePath);
    assert(stat.isFile() && !stat.isSymbolicLink(), "PRIVATE_PDF_EXPORT_CLEANUP_FAILED");
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    if (error && error.code === "PRIVATE_PDF_EXPORT_CLEANUP_FAILED") throw error;
    fail("PRIVATE_PDF_EXPORT_CLEANUP_FAILED");
  }
}

function inspectInput(inputPath, expectedAudience) {
  const stat = fs.lstatSync(inputPath);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= 5 * 1024 * 1024, "PRIVATE_PDF_EXPORT_INPUT_UNSAFE");
  const source = fs.readFileSync(inputPath, "utf8");
  const audienceMatch = /<main\b[^>]*\bdata-document-audience="(student|teacher)"/iu.exec(source);
  const targetPageMatch = /<main\b[^>]*\bdata-layout-target-pages="([1-9][0-9]*)"/iu.exec(source);
  const privateNoticeMatch = /<div\b[^>]*\bclass="private-watermark"[^>]*>([^<>]+)<\/div>/iu.exec(source);
  assert(audienceMatch && targetPageMatch && privateNoticeMatch && !/<script\b/iu.test(source), "PRIVATE_PDF_EXPORT_INPUT_INVALID");
  assert(audienceMatch[1] === expectedAudience, "PRIVATE_PDF_EXPORT_FILE_BINDING_INVALID");
  return Object.freeze({ audience: audienceMatch[1], targetPages: Number(targetPageMatch[1]), privateNotice: privateNoticeMatch[1] });
}

function privateFooterTemplate(privateNotice) {
  assert(typeof privateNotice === "string" && privateNotice.length > 0 && !/[<>\u0000]/u.test(privateNotice), "PRIVATE_PDF_EXPORT_INPUT_INVALID");
  return `<div style="width:100%; padding-right:0.08in; color:#9f1239; font-family:Arial,sans-serif; font-size:7px; font-weight:800; line-height:1.1; opacity:0.72; text-align:right;">${privateNotice}</div>`;
}

function inspectGeneratedPdf(pdfPath) {
  const stat = fs.lstatSync(pdfPath);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= 20 * 1024 * 1024, "PRIVATE_PDF_EXPORT_GENERATION_FAILED");
  const source = fs.readFileSync(pdfPath, "latin1");
  assert(source.startsWith("%PDF-"), "PRIVATE_PDF_EXPORT_GENERATION_FAILED");
  const pages = (source.match(/\/Type\s*\/Page\b/gu) || []).length;
  const letterPageBoxes = (source.match(/\/MediaBox\s*\[\s*0\s+0\s+612(?:\.0+)?\s+792(?:\.0+)?\s*\]/gu) || []).length;
  assert(pages > 0 && letterPageBoxes === pages, "PRIVATE_PDF_EXPORT_PAGE_LAYOUT_INVALID");
  return Object.freeze({ pages, pageSize: "letter" });
}

async function exportPdf(options) {
  const inputRoot = renderer.assertExternalDirectory(path.dirname(options.inputPath));
  const outputRoot = renderer.assertExternalDirectory(path.dirname(options.outputPath));
  const inputPath = path.join(inputRoot, path.basename(options.inputPath));
  const outputPath = path.join(outputRoot, path.basename(options.outputPath));
  const inputFile = parseWorkbookFileName(inputPath, "html");
  const outputFile = parseWorkbookFileName(outputPath, "pdf");
  assert(inputFile.stem === outputFile.stem && inputFile.audience === outputFile.audience, "PRIVATE_PDF_EXPORT_FILE_BINDING_INVALID");
  const input = inspectInput(inputPath, inputFile.audience);
  fs.mkdirSync(outputRoot, { recursive: true });
  assert(renderer.assertExternalDirectory(outputRoot) === outputRoot, "PRIVATE_PDF_EXPORT_OUTPUT_UNSAFE");
  assertOutputMissing(outputPath);
  const temporaryPath = path.join(outputRoot, `.${path.basename(outputPath)}.${process.pid}.tmp.pdf`);
  assertOutputMissing(temporaryPath);
  let browser;
  let outputOwned = false;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    try {
      await page.goto(pathToFileURL(inputPath).href, { waitUntil: "load" });
      await page.evaluate(function () { return document.fonts.ready; });
      const documentState = await page.evaluate(function () {
        const root = document.documentElement;
        const main = document.querySelector("main");
        const watermark = document.querySelector(".private-watermark");
        return {
          overflow: root.scrollWidth > window.innerWidth + 1,
          audience: main && main.dataset.documentAudience,
          targetPages: main && main.dataset.layoutTargetPages,
          watermark: watermark ? getComputedStyle(watermark).display : "",
          scriptCount: document.scripts.length
        };
      });
      assert(documentState.overflow === false && documentState.audience === input.audience && Number(documentState.targetPages) === input.targetPages && documentState.scriptCount === 0, "PRIVATE_PDF_EXPORT_DOCUMENT_INVALID");
      await page.emulateMedia({ media: "print" });
      const printWatermark = await page.evaluate(function () {
        const watermark = document.querySelector(".private-watermark");
        return watermark ? getComputedStyle(watermark).display : "";
      });
      assert(printWatermark === "block", "PRIVATE_PDF_EXPORT_WATERMARK_INVALID");
      await page.addStyleTag({ content: "@media print { .private-watermark { display: none !important; } }" });
      await page.pdf({
        path: temporaryPath,
        format: "Letter",
        preferCSSPageSize: true,
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: privateFooterTemplate(input.privateNotice)
      });
    } finally {
      await page.close();
    }
    const generated = inspectGeneratedPdf(temporaryPath);
    assert(generated.pages === input.targetPages, "PRIVATE_PDF_EXPORT_PAGE_COUNT_INVALID");
    fs.copyFileSync(temporaryPath, outputPath, fs.constants.COPYFILE_EXCL);
    outputOwned = true;
    return Object.freeze({ outputPath, audience: input.audience, targetPages: input.targetPages, pages: generated.pages, pageSize: generated.pageSize });
  } catch (error) {
    if (outputOwned) removeOwnedFile(outputPath);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (_closeError) {
        // The PDF file is already verified as written before browser teardown.
      }
    }
    removeOwnedFile(temporaryPath);
  }
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = await exportPdf(options);
    process.stdout.write(`PRIVATE_WORKBOOK_PDF_EXPORT_OK audience=${result.audience} pages=${result.pages} pageSize=${result.pageSize}\n`);
  } catch (error) {
    process.stderr.write(`PRIVATE_WORKBOOK_PDF_EXPORT_FAILED code=${error && error.code ? error.code : "UNEXPECTED_PDF_EXPORT_ERROR"}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = Object.freeze({ exportPdf, inspectGeneratedPdf, inspectInput, parseArguments, parseWorkbookFileName, privateFooterTemplate });
