const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");

test("shared question ids stay stable and contain no academy code", () => {
  const key = index.createLocatorKey("a".repeat(64), 12, 3);
  const first = core.createSharedBankId("question", key);
  const repeated = core.createSharedBankId("question", key);

  assert.equal(first, repeated);
  assert.match(first, /^qst-bnk-[0-9a-f]{16}$/);
  assert.deepEqual(core.parseSharedBankId(first), {
    entity: "question",
    scope: "BNK",
    digest: first.slice(-16)
  });
  assert.equal(core.isSharedBankId(first, "question"), true);
  assert.doesNotMatch(first, /^qst-(sh|dp|wm|ed|dg|sm)-/);
});

test("a located source item is private-safe and locked until classification", () => {
  const fingerprint = "b".repeat(64);
  const key = index.createLocatorKey(fingerprint, 8, 2);
  const entry = index.createItemIndexEntry({
    id: core.createSharedBankId("question", key),
    sourceRef: core.createSharedBankId("source", `sha256:${fingerprint}`),
    locator: { page: 8, slot: 2, kind: "example", box: { x: 0.1, y: 0.3, width: 0.8, height: 0.2 } },
    discoveryStatus: "ocr_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: ["SH", "DP", "ED", "WM"],
    releaseStatus: "locked"
  });

  assert.equal(entry.curriculum, null);
  assert.equal(entry.releaseStatus, "locked");
  assert.deepEqual(entry.reuse, ["DP", "ED", "SH", "WM"]);
  assert.equal(JSON.stringify(entry).includes("G:\\"), false);
});

test("the public index rejects prompt, answer, path, and unverified release fields", () => {
  const fingerprint = "c".repeat(64);
  const base = {
    id: core.createSharedBankId("question", index.createLocatorKey(fingerprint, 1, 1)),
    sourceRef: core.createSharedBankId("source", `sha256:${fingerprint}`),
    locator: { page: 1, slot: 1, kind: "unknown" },
    discoveryStatus: "page_located",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: ["SH"],
    releaseStatus: "locked"
  };

  assert.throws(() => index.createItemIndexEntry({ ...base, prompt: "protected" }), /protected or unknown fields/);
  assert.throws(() => index.createItemIndexEntry({ ...base, answer: "protected" }), /protected or unknown fields/);
  assert.throws(() => index.createItemIndexEntry({ ...base, path: "private/path" }), /protected or unknown fields/);
  assert.throws(() => index.createItemIndexEntry({ ...base, releaseStatus: "approved" }), /release locked/);
});

test("layout-detected items remain discovery-only and release locked", () => {
  const fingerprint = "d".repeat(64);
  const entry = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(fingerprint, 22, 9)),
    sourceRef: core.createSharedBankId("source", `sha256:${fingerprint}`),
    locator: { page: 22, slot: 9, kind: "mission", box: { x: 0.51, y: 0.42, width: 0.45, height: 0.23 } },
    discoveryStatus: "layout_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: ["SH", "DP"],
    releaseStatus: "locked"
  });

  assert.equal(entry.discoveryStatus, "layout_candidate");
  assert.equal(entry.releaseStatus, "locked");
  assert.equal(entry.curriculum, null);
});
