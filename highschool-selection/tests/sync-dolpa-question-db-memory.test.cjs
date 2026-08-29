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

test("원본 페이지와 풀이 검수표의 sourceId가 다르면 중단한다", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-method-memory-mismatch-"));
  const manifestPath = path.join(root, "manifest.json");
  const reviewPath = path.join(root, "review.json");
  fs.writeFileSync(manifestPath, JSON.stringify({ sourceId: "DP-SRC-DE99B9857905" }));
  fs.writeFileSync(reviewPath, JSON.stringify({ sourceId: "DP-SRC-D59E26A73CC1" }));
  assert.throws(() => methodReviewInfo(manifestPath, reviewPath), /sourceId가 다릅니다/);
});
