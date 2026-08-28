"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const archive = require("../competition/sasmo-k12-public-archive.json");

test("SASMO public archive exposes only verified source-hosted links", function () {
  assert.equal(archive.schemaVersion, "1.0.0");
  assert.deepEqual(archive.coverage.years, [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]);
  assert.equal(archive.coverage.recordCount, 88);
  assert.equal(archive.coverage.assetCount, 144);
  assert.equal(archive.records.length, 88);

  const recordIds = new Set();
  const assetUrls = new Set();
  const allowedTypes = new Set(["p", "s", "ps", "a", "pa"]);
  archive.records.forEach(function (record) {
    assert.equal(recordIds.has(record.id), false, `duplicate record ${record.id}`);
    recordIds.add(record.id);
    assert.ok(Number.isInteger(record.grade) && record.grade >= 1 && record.grade <= 10);
    assert.ok(record.year >= 2014 && record.year <= 2024);
    const source = new URL(record.sourcePageUrl);
    assert.equal(source.protocol, "https:");
    assert.equal(source.hostname, "www.k12mathcontests.com");
    assert.match(source.pathname, new RegExp(`^/download/sasmo/${record.year}/`));
    assert.ok(record.assets.length >= 1);
    record.assets.forEach(function (asset) {
      assert.equal(allowedTypes.has(asset.type), true, `unexpected type ${asset.type}`);
      assert.ok(Number.isInteger(asset.pages) && asset.pages > 0);
      assert.ok(Number.isInteger(asset.bytes) && asset.bytes > 0);
      const file = new URL(asset.url);
      assert.equal(file.protocol, "https:");
      assert.equal(file.hostname, "files.k12mathcontests.com");
      assert.match(file.pathname, /\.pdf$/i);
      assert.equal(assetUrls.has(asset.url), false, `duplicate asset ${asset.url}`);
      assetUrls.add(asset.url);
    });
  });
  assert.equal(recordIds.size, 88);
  assert.equal(assetUrls.size, 144);
  assert.equal(assetUrls.has("https://files.k12mathcontests.com/sasmo_2024_primary6.pdf"), true);
});

test("SASMO public archive contains no private inventory or question payload", function () {
  const serialized = JSON.stringify(archive);
  [
    "localRelativePath", "sha256", "retrievedAt", "browserDelivery", "publicRepository",
    "privateOnly", "questionText", "answerKey", "solutionText", "rubricDraft", "private-authoring"
  ].forEach(function (token) {
    assert.equal(serialized.includes(token), false, `public archive leaked ${token}`);
  });
  assert.equal(serialized.includes("E:/Codex"), false);
  assert.equal(serialized.includes("E:\\Codex"), false);
});
