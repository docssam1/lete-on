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
