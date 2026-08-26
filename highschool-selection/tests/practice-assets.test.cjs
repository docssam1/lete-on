const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const core = require("../data/question-bank-core.js");
const assetsModule = require("../server/practice-assets.js");

function fixture(assetPath, revision) {
  const questionId = core.createNeutralId("question", "SH", "practice:assets:test:01");
  return {
    questionId,
    data: {
      schemaVersion: assetsModule.SCHEMA_VERSION,
      assets: {
        [questionId]: {
          assetKey: "practice.asset.test.01",
          assetPath,
          mimeType: "image/png",
          assetRevision: revision
        }
      }
    }
  };
}

test("private practice asset registry accepts only absolute image allowlist records", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-practice-asset-registry-"));
  const assetPath = path.join(root, "item.png");
  const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  fs.writeFileSync(assetPath, bytes);
  const revision = `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
  try {
    const valid = fixture(assetPath, revision);
    const normalized = assetsModule.normalize(valid.data);
    assert.equal(normalized.assets[valid.questionId].assetPath, path.resolve(assetPath));
    assert.equal(assetsModule.createLoader({ data: valid.data })(valid.questionId).assetRevision, revision);

    const relative = fixture("item.png", revision);
    assert.throws(() => assetsModule.normalize(relative.data), /must be absolute/);
    const wrongRevision = fixture(assetPath, "sha256:not-a-hash");
    assert.throws(() => assetsModule.normalize(wrongRevision.data), /assetRevision is invalid/);
    const wrongMime = fixture(assetPath, revision);
    wrongMime.data.assets[wrongMime.questionId].mimeType = "application/pdf";
    assert.throws(() => assetsModule.normalize(wrongMime.data), /mimeType is invalid/);
    const unknown = fixture(assetPath, revision);
    unknown.data.assets[unknown.questionId].downloadUrl = "https://example.test/item.png";
    assert.throws(() => assetsModule.normalize(unknown.data), /downloadUrl is not allowed/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
