"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { methodReviewInfo } = require("../scripts/sync-dolpa-question-db-memory.cjs");

test("공통수학1 풀이 검수 자료를 중2-2 자료와 다른 ID로 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-cm1-202405-v1.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-D59E26A73CC1" }));
  fs.writeFileSync(reviewPath, JSON.stringify({ sourceId: "DP-SRC-D59E26A73CC1" }));
  const info = methodReviewInfo(manifestPath, reviewPath);
  assert.equal(info.key, "cm1");
  assert.equal(info.label, "공통수학1");
  assert.equal(info.pageSourceId, "dp-cm1-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-cm1-method-review-v1");
  assert.equal(info.recordId, "dp.cm1.method-review.20260829");
  assert.match(info.methodRelativePath, /dolpa-method-review-dp-cm1-202405-v1\.json$/);
});

test("2-1A 풀이 검수 자료를 독립된 ID로 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m21a-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m21a-202405-r3-v1.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-A64644977758" }));
  fs.writeFileSync(reviewPath, JSON.stringify({ sourceId: "DP-SRC-A64644977758" }));
  const info = methodReviewInfo(manifestPath, reviewPath);
  assert.equal(info.key, "m21a");
  assert.equal(info.label, "2-1A");
  assert.equal(info.pageSourceId, "dp-m21a-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m21a-method-review-v1");
  assert.equal(info.recordId, "dp.m21a.method-review.20260829");
  assert.equal(info.classificationSourceId, "dp-m21a-classification-review-v1");
});

test("2-1A 2회 시험지 검수 자료를 기존 2-1A와 다른 ID로 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m21a-r2-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m21a-202404-r2-v1.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m21a-202404-r2-v1.json");
  for (const filePath of [manifestPath, reviewPath, paperPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-DB47B7D84331" }));
  }
  const info = methodReviewInfo(manifestPath, reviewPath, null, paperPath);
  assert.equal(info.key, "m21a-r2");
  assert.equal(info.label, "2-1A 2회");
  assert.equal(info.pageSourceId, "dp-m21a-r2-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m21a-r2-method-review-v1");
  assert.equal(info.paperSourceId, "dp-m21a-r2-paper-review-v1");
  assert.equal(info.recordId, "dp.m21a-r2.method-review.20260829");
});

test("중2-2 3회 시험지 검수 자료를 기존 중2-2와 다른 ID로 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22-r3-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m22-202403-r3-v1.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22-202403-r3-v1.json");
  for (const filePath of [manifestPath, reviewPath, paperPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-31111C2CA38E" }));
  }
  const info = methodReviewInfo(manifestPath, reviewPath, null, paperPath);
  assert.equal(info.key, "m22-r3");
  assert.equal(info.label, "중2-2 3회");
  assert.equal(info.pageSourceId, "dp-m22-r3-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m22-r3-method-review-v1");
  assert.equal(info.paperSourceId, "dp-m22-r3-paper-review-v1");
  assert.equal(info.recordId, "dp.m22-r3.method-review.20260829");
});

test("중2-2S 2회 시험지 검수 자료를 다른 중2-2 원본과 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22s-r2-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m22s-202404-r2-v1.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22s-202404-r2-v1.json");
  for (const filePath of [manifestPath, reviewPath, paperPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-5CD3016EB886" }));
  }
  const info = methodReviewInfo(manifestPath, reviewPath, null, paperPath);
  assert.equal(info.key, "m22s-r2");
  assert.equal(info.label, "중2-2S 2회");
  assert.equal(info.pageSourceId, "dp-m22s-r2-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m22s-r2-method-review-v1");
  assert.equal(info.paperSourceId, "dp-m22s-r2-paper-review-v1");
  assert.equal(info.recordId, "dp.m22s-r2.method-review.20260829");
});

test("중2-2S 3회 시험지 검수 자료를 피타고라스 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22s-r3-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m22s-202405-r3-v1.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22s-202405-r3-v1.json");
  for (const filePath of [manifestPath, reviewPath, paperPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-2B760BCB6E29" }));
  }
  const info = methodReviewInfo(manifestPath, reviewPath, null, paperPath);
  assert.equal(info.key, "m22s-r3");
  assert.equal(info.label, "중2-2S 3회");
  assert.equal(info.pageSourceId, "dp-m22s-r3-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m22s-r3-method-review-v1");
  assert.equal(info.paperSourceId, "dp-m22s-r3-paper-review-v1");
  assert.equal(info.recordId, "dp.m22s-r3.method-review.20260829");
});

test("중2-2 4개월반 1회 검수 자료를 중2-1 전체 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22-4m-r1-"));
  const manifestPath = path.join(root, "manifest.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22-202405-r1-v1.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22-202405-r1-v1.json");
  const analysisPath = path.join(root, "dolpa-analysis-report-dp-m22-202405-r1-v1.json");
  for (const filePath of [manifestPath, paperPath, difficultyPath, analysisPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-E572F8D7C5AA" }));
  }
  const info = methodReviewInfo(manifestPath, null, null, paperPath, difficultyPath, analysisPath);
  assert.equal(info.key, "m22-4m-r1");
  assert.equal(info.label, "중2-2 4개월반 1회");
  assert.equal(info.pageSourceId, "dp-m22-4m-r1-page-assets-v1");
  assert.equal(info.paperSourceId, "dp-m22-4m-r1-paper-review-v1");
  assert.equal(info.difficultySourceId, "dp-m22-4m-r1-difficulty-review-v1");
  assert.equal(info.analysisSourceId, "dp-m22-4m-r1-analysis-report-v1");
});

test("2024년 1월 중2-2 심화 3회 검수 자료를 독립 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22s-202401-r3-"));
  const manifestPath = path.join(root, "manifest.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22s-202401-r3-v1.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22s-202401-r3-v1.json");
  const analysisPath = path.join(root, "dolpa-analysis-report-dp-m22s-202401-r3-v1.json");
  for (const filePath of [manifestPath, paperPath, difficultyPath, analysisPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-BB2F1022D68C" }));
  }
  const info = methodReviewInfo(manifestPath, null, null, paperPath, difficultyPath, analysisPath);
  assert.equal(info.key, "m22s-202401-r3");
  assert.equal(info.label, "중2-2 심화 3회(2024년 1월)");
  assert.equal(info.pageSourceId, "dp-m22s-202401-r3-page-assets-v1");
  assert.equal(info.paperSourceId, "dp-m22s-202401-r3-paper-review-v1");
  assert.equal(info.difficultySourceId, "dp-m22s-202401-r3-difficulty-review-v1");
  assert.equal(info.analysisSourceId, "dp-m22s-202401-r3-analysis-report-v1");
});

test("2023년 5월판 중2-2 기본 1회 검수 자료를 부분 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22-202305-r1-"));
  const manifestPath = path.join(root, "manifest.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22-202305-r1-v1.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22-202305-r1-v1.json");
  const analysisPath = path.join(root, "dolpa-analysis-report-dp-m22-202305-r1-v1.json");
  for (const filePath of [manifestPath, paperPath, difficultyPath, analysisPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-2C80CCC0CAC5" }));
  }
  const info = methodReviewInfo(manifestPath, null, null, paperPath, difficultyPath, analysisPath);
  assert.equal(info.key, "m22-202305-r1");
  assert.equal(info.label, "중2-2 기본 1회(2023년 5월판)");
  assert.equal(info.pageSourceId, "dp-m22-202305-r1-page-assets-v1");
  assert.equal(info.paperSourceId, "dp-m22-202305-r1-paper-review-v1");
  assert.equal(info.difficultySourceId, "dp-m22-202305-r1-difficulty-review-v1");
  assert.equal(info.analysisSourceId, "dp-m22-202305-r1-analysis-report-v1");
});

test("2024년 1월 중2-2 기본 1회 검수 자료를 중2-1 전 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22-202401-r1-"));
  const manifestPath = path.join(root, "manifest.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22-202401-r1-v1.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22-202401-r1-v1.json");
  const analysisPath = path.join(root, "dolpa-analysis-report-dp-m22-202401-r1-v1.json");
  for (const filePath of [manifestPath, paperPath, difficultyPath, analysisPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-ADA50E87C491" }));
  }
  const info = methodReviewInfo(manifestPath, null, null, paperPath, difficultyPath, analysisPath);
  assert.equal(info.key, "m22-202401-r1");
  assert.equal(info.label, "중2-2 기본 1회(2024년 1월)");
  assert.deepEqual(info.tags, ["middle2-2", "basic", "full-range"]);
  assert.equal(info.pageSourceId, "dp-m22-202401-r1-page-assets-v1");
  assert.equal(info.paperSourceId, "dp-m22-202401-r1-paper-review-v1");
  assert.equal(info.difficultySourceId, "dp-m22-202401-r1-difficulty-review-v1");
  assert.equal(info.analysisSourceId, "dp-m22-202401-r1-analysis-report-v1");
});

test("2024년 2월 중2-2 심화 4회 검수 자료를 중2-2 전 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m22s-202402-r4-"));
  const manifestPath = path.join(root, "manifest.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m22s-202402-r4-v1.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22s-202402-r4-v1.json");
  const analysisPath = path.join(root, "dolpa-analysis-report-dp-m22s-202402-r4-v1.json");
  for (const filePath of [manifestPath, paperPath, difficultyPath, analysisPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-A2E82579C195" }));
  }
  const info = methodReviewInfo(manifestPath, null, null, paperPath, difficultyPath, analysisPath);
  assert.equal(info.key, "m22s-202402-r4");
  assert.equal(info.label, "중2-2 심화 4회(2024년 2월)");
  assert.deepEqual(info.tags, ["middle2-2", "advanced", "full-range"]);
  assert.equal(info.pageSourceId, "dp-m22s-202402-r4-page-assets-v1");
  assert.equal(info.paperSourceId, "dp-m22s-202402-r4-paper-review-v1");
  assert.equal(info.difficultySourceId, "dp-m22s-202402-r4-difficulty-review-v1");
  assert.equal(info.analysisSourceId, "dp-m22s-202402-r4-analysis-report-v1");
});

test("2-1S 3회 시험지 검수 자료를 연립일차방정식 종료 범위 원본으로 구분한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-m21s-r3-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "dolpa-method-review-dp-m21s-202405-r3-v1.json");
  const classificationPath = path.join(root, "dolpa-classification-review-dp-m21s-202405-r3-v1.json");
  const paperPath = path.join(root, "dolpa-paper-review-dp-m21s-202405-r3-v1.json");
  for (const filePath of [manifestPath, reviewPath, classificationPath, paperPath]) {
    fs.writeFileSync(filePath, JSON.stringify({ sourceId: "DP-SRC-40CB36024FBC" }));
  }
  const info = methodReviewInfo(manifestPath, reviewPath, classificationPath, paperPath);
  assert.equal(info.key, "m21s-r3");
  assert.equal(info.label, "2-1S 3회");
  assert.equal(info.pageSourceId, "dp-m21s-r3-page-assets-v1");
  assert.equal(info.methodSourceId, "dp-m21s-r3-method-review-v1");
  assert.equal(info.classificationSourceId, "dp-m21s-r3-classification-review-v1");
  assert.equal(info.paperSourceId, "dp-m21s-r3-paper-review-v1");
  assert.equal(info.recordId, "dp.m21s-r3.method-review.20260829");
});

test("중2-2S 1회 난이도 검수 자료를 원본 페이지와 같은 ID로 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-difficulty-memory-m22s-r1-"));
  const manifestPath = path.join(root, "manifest.json");
  const difficultyPath = path.join(root, "dolpa-difficulty-review-dp-m22s-202403-r1-v1.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-8BB6E543C0F7" }));
  fs.writeFileSync(difficultyPath, JSON.stringify({ sourceId: "DP-SRC-8BB6E543C0F7" }));
  const info = methodReviewInfo(manifestPath, null, null, null, difficultyPath);
  assert.equal(info.key, "m22s-r1");
  assert.equal(info.difficultySourceId, "dp-m22s-r1-difficulty-review-v1");
  assert.equal(info.pageSourceId, "dp-m22s-r1-page-assets-v1");
});

test("중2-2S 1회 분석지를 난이도 검수와 같은 원본에 연결한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-analysis-memory-m22s-r1-"));
  const difficultyPath = path.join(root, "difficulty.json");
  const analysisPath = path.join(root, "analysis.json");
  fs.writeFileSync(difficultyPath, JSON.stringify({ sourceId: "DP-SRC-8BB6E543C0F7" }));
  fs.writeFileSync(analysisPath, JSON.stringify({ sourceId: "DP-SRC-8BB6E543C0F7" }));
  const info = methodReviewInfo(null, null, null, null, difficultyPath, analysisPath);
  assert.equal(info.analysisSourceId, "dp-m22s-r1-analysis-report-v1");
  fs.writeFileSync(analysisPath, JSON.stringify({ sourceId: "DP-SRC-40CB36024FBC" }));
  assert.throws(() => methodReviewInfo(null, null, null, null, difficultyPath, analysisPath), /sourceId가 다릅니다/);
});

test("2-1A 분류 교정표는 원본 페이지·풀이표와 같은 sourceId만 허용한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-classification-memory-m21a-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "method.json");
  const classificationPath = path.join(root, "classification.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-A64644977758" }));
  fs.writeFileSync(reviewPath, JSON.stringify({ sourceId: "DP-SRC-A64644977758" }));
  fs.writeFileSync(classificationPath, JSON.stringify({ sourceId: "DP-SRC-A64644977758" }));
  const info = methodReviewInfo(manifestPath, reviewPath, classificationPath);
  assert.equal(info.classificationSourceId, "dp-m21a-classification-review-v1");
  fs.writeFileSync(classificationPath, JSON.stringify({ sourceId: "DP-SRC-D59E26A73CC1" }));
  assert.throws(() => methodReviewInfo(manifestPath, reviewPath, classificationPath), /sourceId가 다릅니다/);
});

test("원본 페이지와 풀이 검수표의 sourceId가 다르면 중단한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-mismatch-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "review.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-DE99B9857905" }));
  fs.writeFileSync(reviewPath, JSON.stringify({ sourceId: "DP-SRC-D59E26A73CC1" }));
  assert.throws(() => methodReviewInfo(manifestPath, reviewPath), /sourceId가 다릅니다/);
});
