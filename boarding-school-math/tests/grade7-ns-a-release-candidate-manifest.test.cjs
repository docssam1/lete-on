"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const childProcess = require("node:child_process");

const repoRoot = childProcess.execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const manifestPath = "boarding-school-math/docs/GRADE7_NS_A_RELEASE_CANDIDATE_MANIFEST_2026-10-14.md";
// Preserve the reviewed candidate as historical evidence. Later source edits and
// staging must not rewrite its hashes or turn normal pretest into a dirty-tree gate.
const candidateCommit = "306c575c4b8ee182ac78fe19c9da6683b9fd51fb";

function git(root, args) {
  return childProcess.execFileSync("git", args, { cwd: root });
}

function rows(manifestText) {
  return Array.from(manifestText.matchAll(/^\| (M|\?\?) \| `([^`]+)` \| (\d+) \| `([a-f0-9]{64})` \|$/gmu), function (match) {
    return { state: match[1], relativePath: match[2], bytes: Number(match[3]), sha256: match[4] };
  });
}

function verifySnapshot(root, commit, snapshotManifestPath, payloadCount) {
  assert.match(commit, /^[a-f0-9]{40}$/u, "snapshot requires an immutable commit id");
  const ancestry = git(root, ["rev-list", "--parents", "-n", "1", commit]).toString("utf8").trim().split(" ");
  assert.equal(ancestry.length, 2, "candidate snapshot must have exactly one parent");
  assert.equal(ancestry[0], commit);
  const manifestText = git(root, ["show", `${commit}:${snapshotManifestPath}`]).toString("utf8");
  assert.match(manifestText, new RegExp(`^- Base HEAD: \x60${ancestry[1]}\x60$`, "mu"), "manifest base must be the snapshot parent");
  const entries = rows(manifestText);
  assert.equal(entries.length, payloadCount);
  assert.equal(new Set(entries.map(function (entry) { return entry.relativePath; })).size, entries.length);
  const fields = git(root, ["diff-tree", "--no-commit-id", "--name-status", "--no-renames", "-r", "-z", ancestry[1], commit]).toString("utf8").split("\0");
  assert.equal(fields.pop(), "");
  assert.equal(fields.length % 2, 0);
  const changes = new Map();
  for (let index = 0; index < fields.length; index += 2) changes.set(fields[index + 1], fields[index]);
  assert.equal(changes.size, payloadCount + 1, "snapshot must contain only its manifest and payload");
  assert.equal(changes.get(snapshotManifestPath), "A", "snapshot must add its manifest");
  changes.delete(snapshotManifestPath);
  assert.deepEqual(entries.map(function (entry) { return entry.relativePath; }).sort(), Array.from(changes.keys()).sort());
  entries.forEach(function (entry) {
    assert.equal(changes.get(entry.relativePath), entry.state === "??" ? "A" : "M", `${entry.relativePath}:status`);
    const bytes = git(root, ["show", `${commit}:${entry.relativePath}`]);
    assert.equal(bytes.byteLength, entry.bytes, `${entry.relativePath}:bytes`);
    assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), entry.sha256, `${entry.relativePath}:sha256`);
  });
  return manifestText;
}

test("release-candidate manifest hashes the 38 payloads in the preserved 39-file commit", function () {
  verifySnapshot(repoRoot, candidateCommit, manifestPath, 38);
});

test("release-candidate manifest keeps the diagnostic release gates explicit", function () {
  const manifestText = git(repoRoot, ["show", `${candidateCommit}:${manifestPath}`]).toString("utf8");
  assert.match(manifestText, /18 unseen diagnostic items[\s\S]*do not exist yet/u);
  assert.match(manifestText, /No immutable 18-item signed form exists/u);
  assert.match(manifestText, /zero staged/u);
  assert.match(manifestText, /Push only after the requested authorization/u);
  assert.match(manifestText, /Merge\/deploy only after separate authorization/u);
});

function fixture(t, transformManifest) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-candidate-snapshot-"));
  t.after(function () { fs.rmSync(root, { recursive: true, force: true }); });
  git(root, ["init", "--quiet"]);
  git(root, ["config", "core.autocrlf", "false"]);
  git(root, ["config", "core.hooksPath", path.join(root, "disabled-hooks")]);
  git(root, ["config", "user.name", "GFIELD Test"]);
  git(root, ["config", "user.email", "gfield-test@example.invalid"]);
  function commit() {
    git(root, ["add", "--all"]);
    git(root, ["-c", "commit.gpgSign=false", "commit", "--quiet", "-m", "fixture"]);
    return git(root, ["rev-parse", "HEAD"]).toString("utf8").trim();
  }
  fs.writeFileSync(path.join(root, "existing.txt"), "before\n");
  const base = commit();
  const payloads = [["M", "existing.txt", "after\r\n"], ["??", "new.txt", "new payload\n"]];
  payloads.forEach(function (entry) { fs.writeFileSync(path.join(root, entry[1]), entry[2]); });
  const table = payloads.map(function (entry) {
    const bytes = Buffer.from(entry[2]);
    return `| ${entry[0]} | \x60${entry[1]}\x60 | ${bytes.byteLength} | \x60${crypto.createHash("sha256").update(bytes).digest("hex")}\x60 |`;
  }).join("\n");
  const manifest = `- Base HEAD: \x60${base}\x60\n${table}\n`;
  fs.writeFileSync(path.join(root, "manifest.md"), transformManifest ? transformManifest(manifest) : manifest);
  return { root, snapshot: commit(), commit };
}

test("snapshot verification survives dirty files, staging, and later commits", function (t) {
  const source = fixture(t);
  const verify = function () { return verifySnapshot(source.root, source.snapshot, "manifest.md", 2); };
  const original = verify();
  fs.writeFileSync(path.join(source.root, "existing.txt"), "future payload\n");
  fs.writeFileSync(path.join(source.root, "manifest.md"), "future manifest\n");
  fs.writeFileSync(path.join(source.root, "unrelated.txt"), "unrelated future work\n");
  fs.unlinkSync(path.join(source.root, "new.txt"));
  assert.equal(verify(), original);
  git(source.root, ["add", "--all"]);
  assert.equal(verify(), original);
  source.commit();
  assert.equal(verify(), original);
});

test("snapshot verification rejects a tampered immutable payload hash", function (t) {
  const source = fixture(t, function (manifest) { return manifest.replace(/`[a-f0-9]{64}`/u, `\x60${"0".repeat(64)}\x60`); });
  assert.throws(function () { verifySnapshot(source.root, source.snapshot, "manifest.md", 2); }, /existing\.txt:sha256/u);
});

test("snapshot verification rejects a manifest that names a different payload", function (t) {
  const source = fixture(t, function (manifest) { return manifest.replace("`new.txt`", "`unexpected.txt`"); });
  assert.throws(function () { verifySnapshot(source.root, source.snapshot, "manifest.md", 2); }, assert.AssertionError);
});
