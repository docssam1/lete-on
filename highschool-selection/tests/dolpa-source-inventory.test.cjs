"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const test = require("node:test");

const script = path.resolve(__dirname, "../scripts/build-dolpa-source-inventory.cjs");
const syncScript = path.resolve(__dirname, "../scripts/sync-dolpa-source-inventory-memory.cjs");
const converterScript = path.resolve(__dirname, "../scripts/convert-dolpa-hwp-to-pdf.ps1");

test("돌파 HWP 중복 경로를 원본 ID 하나로 묶고 변환 대기열을 만든다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-source-inventory-"));
  const active = path.join(root, "2관 돌파 입반시험지_3번째", "초등", "2024년", "돌파수학 초등관 2-2 입반테스트.hwp");
  const legacy = path.join(root, "2관 돌파 입반시험지_2번째", "초등", "입테시험지 이전 버전", "돌파수학 초등관 2-2 입반테스트.hwp");
  const mock = path.join(root, "중등관 모의고사", "수학상 1회.hwp");
  [active, legacy, mock].forEach(filePath => fs.mkdirSync(path.dirname(filePath), { recursive: true }));
  fs.writeFileSync(active, "same exam", "utf8");
  fs.writeFileSync(legacy, "same exam", "utf8");
  fs.writeFileSync(mock, "different exam", "utf8");

  const inventoryPath = path.join(root, "out", "inventory.json");
  const queuePath = path.join(root, "out", "queue.json");
  execFileSync(process.execPath, [script, root, inventoryPath, queuePath]);

  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  assert.equal(inventory.summary.hwpPathCount, 3);
  assert.equal(inventory.summary.uniqueSourceCount, 2);
  assert.equal(inventory.summary.duplicatePathCount, 1);
  assert.equal(queue.jobs.length, 2);
  assert.equal(queue.summary.skippedDuplicatePaths, 1);
  assert.equal(queue.jobs[0].courseHint, "중2-2");
  assert.equal(queue.jobs[1].familyHint, "모의고사");

  const duplicated = inventory.sources.find(source => source.aliasCount === 2);
  assert.match(duplicated.canonicalRelativePath, /_3번째/);
  assert.equal(duplicated.courseHints[0], "중2-2");
  assert.equal(duplicated.aliases.some(alias => alias.layer === "과거·후보"), true);
  assert.equal(duplicated.reviewStatus, "파일명 기준 임시 분류");
});

test("돌파 전체 자료대장과 변환 대기열을 비공개 자료 목록에 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-source-memory-"));
  const catalogPath = path.join(root, "source-memory.json");
  const inventoryPath = path.join(root, "dolpa-source-inventory-v2.json");
  const queuePath = path.join(root, "dolpa-hwp-pdf-conversion-queue-v1.json");
  fs.writeFileSync(catalogPath, JSON.stringify({ version: 1, name: "test", root, updated: "2026-08-27", sources: [], records: [] }));
  fs.writeFileSync(inventoryPath, JSON.stringify({
    schemaVersion: 2,
    summary: { hwpPathCount: 693, uniqueSourceCount: 334, duplicatePathCount: 359 }
  }));
  fs.writeFileSync(queuePath, JSON.stringify({
    summary: { pending: 314, completed: 20, failed: 0, skippedDuplicatePaths: 359 },
    jobs: Array.from({ length: 334 }, (_, index) => ({ order: index + 1 }))
  }));

  execFileSync(process.execPath, [syncScript, catalogPath, inventoryPath, queuePath]);
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  assert.equal(catalog.sources.length, 2);
  assert.equal(catalog.records.length, 1);
  assert.equal(catalog.records[0].status, "verified");
  assert.match(catalog.records[0].summary, /입반시험 213개와 모의고사 121개/);
  assert.match(catalog.records[0].summary, /완료 20개, 대기 314개/);
});

test("nPDF 배치 변환기는 경로를 제한하고 설정과 기본 프린터를 복원한다", () => {
  const text = fs.readFileSync(converterScript, "utf8");
  assert.match(text, /Resolve-SafeChild/);
  assert.match(text, /canonicalRelativePath|inputRelativePath/);
  assert.match(text, /Set-NpdfConfig/);
  assert.match(text, /Set-DefaultPrinter \$defaultBefore/);
  assert.match(text, /\[IO\.File\]::WriteAllBytes\(\$NpdfConfig, \$configBackup\)/);
  assert.match(text, /Move-Item -LiteralPath \$pdf\.FullName -Destination \$finalPath/);
  assert.match(text, /\[string\]\$SourceId/);
  assert.match(text, /\$_\.sourceId -eq \$SourceId/);
  assert.doesNotMatch(text, /Remove-Item/);
});
