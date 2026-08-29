"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const [catalogArgument, inventoryArgument, queueArgument] = process.argv.slice(2);
if (!catalogArgument || !inventoryArgument || !queueArgument) {
  throw new Error("자료 목록, 돌파 원본 자료대장, PDF 변환 대기열 경로가 필요합니다.");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fingerprint(filePath) {
  const bytes = fs.readFileSync(filePath);
  const stat = fs.statSync(filePath, { bigint: true });
  return {
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    size: Number(stat.size),
    mtime_ns: Number(stat.mtimeNs)
  };
}

function upsert(list, id, value) {
  const index = list.findIndex(entry => entry.id === id);
  if (index >= 0) list[index] = value;
  else list.push(value);
}

const catalogPath = path.resolve(catalogArgument);
const inventoryPath = path.resolve(inventoryArgument);
const queuePath = path.resolve(queueArgument);
const catalog = readJson(catalogPath);
const inventory = readJson(inventoryPath);
const queue = readJson(queuePath);
const updatedDate = new Date().toISOString().slice(0, 10);

if (inventory.schemaVersion !== 2 || inventory.summary.hwpPathCount !== 693
  || inventory.summary.uniqueSourceCount !== 334 || inventory.summary.duplicatePathCount !== 359) {
  throw new Error(`돌파 원본 자료대장 수량을 확인해 주세요: ${JSON.stringify(inventory.summary)}`);
}
const queueCount = Number(queue.summary.pending || 0) + Number(queue.summary.completed || 0) + Number(queue.summary.failed || 0);
if (queue.jobs.length !== 334 || queueCount !== 334 || queue.summary.skippedDuplicatePaths !== 359) {
  throw new Error("돌파 PDF 변환 대기열 수량을 확인해 주세요.");
}

const inventorySource = {
  id: "dp-source-inventory-v2",
  title: "돌파 HWP 693경로·고유 원본 334개 자료대장",
  path: "지필드메모리/highschool-selection/question-bank/dolpa-source-inventory-v2.json",
  kind: "json",
  sensitivity: "private",
  ...fingerprint(inventoryPath)
};
const queueSource = {
  id: "dp-hwp-pdf-conversion-queue-v1",
  title: `돌파 HWP 고유 원본 334개 PDF 변환 대기열(완료 ${queue.summary.completed || 0}개)`,
  path: "지필드메모리/highschool-selection/question-bank/dolpa-hwp-pdf-conversion-queue-v1.json",
  kind: "json",
  sensitivity: "private",
  ...fingerprint(queuePath)
};
upsert(catalog.sources, inventorySource.id, inventorySource);
upsert(catalog.sources, queueSource.id, queueSource);

const record = {
  id: "dp.source-inventory.20260827",
  title: "돌파 원본 전체 자료대장과 PDF 변환 순서",
  aliases: ["돌파 원본 693개 목록", "돌파 고유 원본 334개"],
  tags: ["dp", "source-inventory", "hwp", "deduplication", "pdf-queue"],
  summary: `돌파 HWP 693경로를 SHA-256으로 대조해 내용이 다른 원본 334개와 중복 경로 359개로 나눴다. 고유 원본은 입반시험 213개와 모의고사 121개다. nPDF 변환은 완료 ${queue.summary.completed || 0}개, 대기 ${queue.summary.pending || 0}개, 실패 ${queue.summary.failed || 0}개이며 과정 표시는 원본 표지 검수 전까지 파일명 기준 임시 분류다.`,
  status: "verified",
  sensitivity: "private",
  updated: updatedDate,
  pointers: [
    {
      source_id: inventorySource.id,
      role: "audit",
      locator: "summary, sources[1:334]",
      note: "693경로의 해시 중복 제거와 334개 고유 원본 목록"
    },
    {
      source_id: queueSource.id,
      role: "decision",
      locator: "jobs[1:334]",
      note: "중복 변환을 제외한 nPDF 변환 순서"
    }
  ]
};
upsert(catalog.records, record.id, record);
catalog.updated = updatedDate;
writeJson(catalogPath, catalog);
process.stdout.write(`${JSON.stringify({ paths: 693, unique: 334, duplicates: 359, pending: queue.summary.pending || 0, completed: queue.summary.completed || 0, failed: queue.summary.failed || 0 })}\n`);
