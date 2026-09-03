"use strict";

// Replaces only the 15 private Premier manifest objects after a reviewed build.
// A service-role key must be provided through the process environment and is
// never read from or written to this repository.

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectUrl = String(process.env.SUPABASE_URL || "https://uqtkxhchtbcizzteuvsq.supabase.co").replace(/\/$/, "");
const serviceKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
if (!process.env.HF_RELEASE_ROOT) throw new Error("HF_RELEASE_ROOT가 필요합니다.");
const releaseRoot = path.resolve(process.env.HF_RELEASE_ROOT);

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function storagePathUrl(objectPath) {
  return objectPath.split("/").map(encodeURIComponent).join("/");
}

async function main() {
  assert.ok(serviceKey, "SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  const inventory = JSON.parse(fs.readFileSync(path.join(releaseRoot, "inventory.json"), "utf8"));
  assert.equal(inventory.rounds.length, 15, "15회분 배포 목록이 아닙니다.");

  let totalBytes = 0;
  const uploaded = [];
  for (const round of inventory.rounds) {
    const objectPath = `${round.storagePrefix}/manifest.json`;
    const file = path.join(releaseRoot, "storage", ...objectPath.split("/"));
    const buffer = fs.readFileSync(file);
    const expected = round.files.find(item => item.name === "manifest.json");
    assert.ok(expected, `${round.slug}: manifest 목록이 없습니다.`);
    assert.equal(buffer.byteLength, expected.byteSize, `${round.slug}: manifest 크기가 다릅니다.`);
    assert.equal(sha256(buffer), expected.sha256, `${round.slug}: manifest 해시가 다릅니다.`);

    const response = await fetch(`${projectUrl}/storage/v1/object/hf-mock-private/${storagePathUrl(objectPath)}`, {
      method: "PUT",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        "x-upsert": "true"
      },
      body: buffer
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      throw new Error(`${round.slug}: 비공개 manifest 교체 실패 (${response.status}) ${detail}`);
    }
    totalBytes += buffer.byteLength;
    uploaded.push({ slug: round.slug, objectPath, byteSize: buffer.byteLength, sha256: expected.sha256 });
  }

  process.stdout.write(`${JSON.stringify({ uploaded: uploaded.length, totalBytes, manifests: uploaded }, null, 2)}\n`);
}

main().catch(error => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
