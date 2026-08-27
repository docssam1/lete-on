"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assetsModule = require("../server/academy-question-assets.js");

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");

test("비공개 문항 페이지는 검수 manifest와 해시가 있는 PNG만 찾는다", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "academy-pages-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const sourceId = "DP-SRC-AAAAAAAAAAAA";
  const folder = path.join(root, sourceId);
  fs.mkdirSync(folder);
  fs.writeFileSync(path.join(folder, "page-003.png"), PNG);
  const sha256 = crypto.createHash("sha256").update(PNG).digest("hex");
  fs.writeFileSync(path.join(folder, "manifest.json"), JSON.stringify({
    schemaVersion: assetsModule.SCHEMA_VERSION,
    sourceId,
    assets: [{ assetId: `${sourceId}:page:003`, pageNumber: 3, fileName: "page-003.png", sha256 }]
  }));
  const load = assetsModule.createLoader({ root });
  const asset = load(sourceId, 3);
  assert.equal(asset.mimeType, "image/png");
  assert.equal(asset.assetRevision, `sha256:${sha256}`);
  assert.equal(load(sourceId, 4), null);
  assert.equal(load("../escape", 3), null);
});
