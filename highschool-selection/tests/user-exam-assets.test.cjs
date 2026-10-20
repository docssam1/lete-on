"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const core = require("../data/question-bank-core.js");
const assetsModule = require("../server/user-exam-assets.js");

function fixture(assetPath, revision) {
  const itemId = core.createNeutralId("question", "DP", "user-exam:assets:test:01");
  return {
    itemId,
    itemVersionId: "user-exam-assets-test-v1",
    data: {
      schemaVersion: assetsModule.SCHEMA_VERSION,
      assets: {
        [itemId]: {
          assetKey: "user.exam.asset.test.01",
          itemVersionId: "user-exam-assets-test-v1",
          assetPath,
          mimeType: "image/png",
          assetRevision: revision
        }
      }
    }
  };
}

test("user exam item assets are pinned to an exact item version and content hash", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-user-exam-assets-"));
  const assetPath = path.join(root, "item.png");
  const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 1]);
  fs.writeFileSync(assetPath, bytes);
  const revision = `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
  try {
    const valid = fixture(assetPath, revision);
    const normalized = assetsModule.normalize(valid.data);
    assert.equal(normalized.assets[valid.itemId].itemVersionId, valid.itemVersionId);
    const load = assetsModule.createLoader({ data: valid.data });
    assert.equal(load(valid.itemId, valid.itemVersionId).assetRevision, revision);
    assert.equal(load(valid.itemId, "older-version"), null);

    const missingVersion = fixture(assetPath, revision);
    delete missingVersion.data.assets[missingVersion.itemId].itemVersionId;
    assert.throws(() => assetsModule.normalize(missingVersion.data), /itemVersionId is invalid/);
    const relative = fixture("item.png", revision);
    assert.throws(() => assetsModule.normalize(relative.data), /must be absolute/);
    const unknown = fixture(assetPath, revision);
    unknown.data.assets[unknown.itemId].answer = "12";
    assert.throws(() => assetsModule.normalize(unknown.data), /answer is not allowed/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
