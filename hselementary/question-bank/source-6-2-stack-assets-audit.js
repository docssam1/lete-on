"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const models = require("./source-6-2-stack-models.js");
const directory = path.join(__dirname, "assets", "source-6-2-stacks");
const runtimeFiles = ["source-6-2-stack-models.js", "source-6-2-stack-renderer.mjs", "source-6-2-stack-review.html", "source-6-2-stack-review.css"];
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
const textSha = value => sha(value.toString("utf8").replace(/\r\n/g, "\n"));
const contractSha = (definition, pool) => sha(JSON.stringify({
  sourceItemId: definition.sourceItemId, countGiven: definition.countGiven, pool
}));
function pngSize(bytes) {
  assert(bytes.length > 32);
  assert(bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), "PNG signature");
  assert.equal(bytes.toString("ascii", 12, 16), "IHDR");
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}
function verify(manifest, readFile = filename => fs.readFileSync(path.join(directory, filename))) {
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.releaseStatus, "locked");
  assert.equal(manifest.usage, "answer-only-canonical-source-model");
  assert.deepEqual(manifest.camera, ["right", "above", "front"]);
  assert.equal(manifest.runtimeHashEncoding, "utf8-lf");
  assert.deepEqual(manifest.exportSettings, {width:640,height:520,pixelRatio:2,directionFontSize:28});
  assert.deepEqual(Object.keys(manifest.runtimeHashes).sort(), [...runtimeFiles].sort());
  for (const name of runtimeFiles) assert.equal(manifest.runtimeHashes[name], textSha(fs.readFileSync(path.join(__dirname, name))), `Stale runtime: ${name}`);
  const expected = models.definitions.flatMap(definition => definition.pools.map((pool, variant) => ({definition, pool, variant})));
  assert.equal(manifest.assets.length, expected.length);
  const files = new Set();
  for (let index = 0; index < expected.length; index++) {
    const {definition, pool, variant} = expected[index], asset = manifest.assets[index];
    const filename = `${definition.sourceItemId}-v${variant}.png`;
    assert.equal(asset.file, filename);
    assert(!files.has(filename)); files.add(filename);
    assert.equal(asset.sourceItemId, definition.sourceItemId);
    assert.equal(asset.variant, variant);
    assert.equal(asset.contractSha256, contractSha(definition, pool));
    assert.equal(asset.byteLength, readFile(filename).length);
    assert.deepEqual(asset.size, [1280,1040]);
    const bytes = readFile(filename);
    assert.deepEqual(pngSize(bytes), asset.size);
    assert.equal(sha(bytes), asset.sha256, `Changed PNG: ${filename}`);
  }
  return manifest.assets.length;
}
function run() {
  assert.equal(textSha("line1\nline2\n"), textSha("line1\r\nline2\r\n"), "Runtime fingerprints ignore checkout line endings, not code changes");
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, "manifest.json"), "utf8"));
  const count = verify(manifest);
  const clone = () => structuredClone(manifest);
  for (const mutate of [
    m => { m.releaseStatus = "verified"; },
    m => { m.usage = "question"; },
    m => { m.camera.reverse(); },
    m => { m.assets.pop(); },
    m => { m.assets[1] = m.assets[0]; },
    m => { m.assets[0].file = "../answer.png"; },
    m => { m.assets[0].sourceItemId = m.assets[3].sourceItemId; },
    m => { m.assets[0].contractSha256 = "0".repeat(64); },
    m => { m.assets[0].size = [640,520]; },
    m => { m.runtimeHashes[ runtimeFiles[0] ] = "0".repeat(64); }
  ]) { const invalid = clone(); mutate(invalid); assert.throws(() => verify(invalid)); }
  assert.throws(() => verify(manifest, filename => {
    const bytes = fs.readFileSync(path.join(directory, filename));
    bytes[bytes.length - 1] ^= 1;
    return bytes;
  }));
  console.log(`Canonical stack assets: ${count} model-linked PNGs, runtime/model/PNG hashes, exact dimensions and 11 negative controls passed. Learner release is controlled separately by inventory and actual-bank audits.`);
}
if (require.main === module) run();
module.exports = {directory, runtimeFiles, sha, textSha, contractSha, pngSize, verify};
