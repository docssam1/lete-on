"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const repoRoot = childProcess.execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const manifestPath = "boarding-school-math/docs/GRADE7_NS_A_RELEASE_CANDIDATE_MANIFEST_2026-10-14.md";
const manifestText = fs.readFileSync(path.join(repoRoot, manifestPath), "utf8");

function rows() {
  return Array.from(manifestText.matchAll(/^\| (M|\?\?) \| `([^`]+)` \| (\d+) \| `([a-f0-9]{64})` \|$/gmu), function (match) {
    return { state: match[1], relativePath: match[2], bytes: Number(match[3]), sha256: match[4] };
  });
}

function statusMap() {
  const output = childProcess.execFileSync("git", ["status", "--porcelain=v1"], { cwd: repoRoot, encoding: "utf8" });
  return new Map(output.split(/\r?\n/u).filter(Boolean).map(function (line) {
    return [line.slice(3), line.slice(0, 2).trim()];
  }).filter(function (entry) { return entry[0] !== manifestPath; }));
}

test("release-candidate manifest hashes every changed payload file except itself", function () {
  const entries = rows();
  assert.equal(entries.length, 38);
  assert.equal(new Set(entries.map(function (entry) { return entry.relativePath; })).size, entries.length);
  const actualStatus = statusMap();
  assert.deepEqual(entries.map(function (entry) { return entry.relativePath; }).sort(), Array.from(actualStatus.keys()).sort());
  entries.forEach(function (entry) {
    assert.equal(actualStatus.get(entry.relativePath), entry.state, `${entry.relativePath}:status`);
    const bytes = fs.readFileSync(path.join(repoRoot, entry.relativePath));
    assert.equal(bytes.byteLength, entry.bytes, `${entry.relativePath}:bytes`);
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${entry.relativePath}:sha256`);
  });
});

test("release-candidate manifest keeps the diagnostic release gates explicit", function () {
  assert.match(manifestText, /18 unseen diagnostic items[\s\S]*do not exist yet/u);
  assert.match(manifestText, /No immutable 18-item signed form exists/u);
  assert.match(manifestText, /zero staged/u);
  assert.match(manifestText, /Push only after the requested authorization/u);
  assert.match(manifestText, /Merge\/deploy only after separate authorization/u);
});
