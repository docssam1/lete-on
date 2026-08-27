"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const [queueArgument, outputRootArgument, pdfInfoArgument] = process.argv.slice(2);
if (!queueArgument || !outputRootArgument || !pdfInfoArgument) {
  throw new Error("PDF 변환 대기열, 결과 폴더, pdfinfo 경로가 필요합니다.");
}

const queue = JSON.parse(fs.readFileSync(path.resolve(queueArgument), "utf8"));
const outputRoot = path.resolve(outputRootArgument);
const pdfInfo = path.resolve(pdfInfoArgument);
const outputPrefix = `${outputRoot}${path.sep}`.toLowerCase();
const completed = queue.jobs.filter(job => job.status === "변환 완료");
const issues = [];

completed.forEach(job => {
  const pdfPath = path.resolve(outputRoot, job.outputRelativePath);
  if (!pdfPath.toLowerCase().startsWith(outputPrefix)) {
    issues.push(`${job.sourceId}: 결과 폴더 밖의 경로`);
    return;
  }
  if (!fs.existsSync(pdfPath)) {
    issues.push(`${job.sourceId}: PDF 없음`);
    return;
  }
  const bytes = fs.readFileSync(pdfPath);
  if (bytes.length < 1024 || bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    issues.push(`${job.sourceId}: PDF 파일 머리 또는 크기 오류`);
    return;
  }
  const info = execFileSync(pdfInfo, [pdfPath], { encoding: "utf8" });
  const match = info.match(/^Pages:\s+(\d+)/m);
  const pages = match ? Number(match[1]) : 0;
  if (pages < 1 || pages !== Number(job.pageCount)) issues.push(`${job.sourceId}: 페이지 수 불일치 ${pages}/${job.pageCount}`);
  if (bytes.length !== Number(job.outputSize)) issues.push(`${job.sourceId}: 파일 크기 불일치 ${bytes.length}/${job.outputSize}`);
});

const summary = {
  completed: completed.length,
  checked: completed.length,
  issueCount: issues.length,
  totalPages: completed.reduce((sum, job) => sum + Number(job.pageCount || 0), 0),
  totalBytes: completed.reduce((sum, job) => sum + Number(job.outputSize || 0), 0)
};
process.stdout.write(`${JSON.stringify({ summary, issues }, null, 2)}\n`);
if (issues.length) process.exitCode = 1;
