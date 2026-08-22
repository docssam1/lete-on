const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const security = require(path.join(root, "shared", "review-evidence-security.js"));
const inventory = require(path.join(root, "data", "review-only", "sh-r01-inventory.js")).inventory;
const item = inventory.items[2];
const now = Date.UTC(2026, 7, 22, 4, 0, 0);
const runtime = { assetHosts: ["secure.example.test"], maxPageUrlTtlSeconds: 900 };

function packet() {
  return {
    examId: security.EXAM_ID,
    roundCode: security.ROUND_CODE,
    reviewVersion: "audit-20260822-v1",
    itemId: item.id,
    number: item.number,
    expiresAt: new Date(now + 5 * 60 * 1000).toISOString(),
    sourceFingerprintMatched: true,
    panels: [
      { role: "problem", url: "https://secure.example.test/review/q3-problem.png?sig=1", mimeType: "image/png" },
      { role: "source-key", url: "https://secure.example.test/review/q3-key.webp?sig=2", mimeType: "image/webp" },
      { role: "independent-audit", url: "https://secure.example.test/review/q3-audit.jpg?sig=3", mimeType: "image/jpeg" }
    ]
  };
}

test("accepts exactly three short-lived image-only admin evidence panels", () => {
  const value = security.validateEvidencePacket(packet(), item, runtime, now);
  assert.equal(value.itemId, item.id);
  assert.deepEqual(value.panels.map(panel => panel.role), security.PANEL_ROLES);
  assert.equal(JSON.stringify(value).includes("answer"), false);
});

test("rejects structured answers, original document paths, wrong hosts, and long TTLs", () => {
  const withAnswer = packet(); withAnswer.answer = "hidden";
  assert.throws(() => security.validateEvidencePacket(withAnswer, item, runtime, now));

  const pdf = packet(); pdf.panels[0].url = "https://secure.example.test/private/source.pdf?sig=1";
  assert.throws(() => security.validateEvidencePacket(pdf, item, runtime, now));

  const host = packet(); host.panels[1].url = "https://other.example.test/review/key.png?sig=2";
  assert.throws(() => security.validateEvidencePacket(host, item, runtime, now));

  const ttl = packet(); ttl.expiresAt = new Date(now + 11 * 60 * 1000).toISOString();
  assert.throws(() => security.validateEvidencePacket(ttl, item, runtime, now));
});

test("rejects missing, duplicate, or mismatched evidence roles and item identity", () => {
  const duplicate = packet(); duplicate.panels[2].role = "problem";
  assert.throws(() => security.validateEvidencePacket(duplicate, item, runtime, now));

  const wrongItem = packet(); wrongItem.number = 4;
  assert.throws(() => security.validateEvidencePacket(wrongItem, item, runtime, now));

  const unmatched = packet(); unmatched.sourceFingerprintMatched = false;
  assert.throws(() => security.validateEvidencePacket(unmatched, item, runtime, now));
});

test("admin evidence UI requires no-store API images and exposes no download fallback", () => {
  const html = fs.readFileSync(path.join(root, "admin", "item-review.html"), "utf8");
  const page = fs.readFileSync(path.join(root, "shared", "review-evidence-page.js"), "utf8");
  const list = fs.readFileSync(path.join(root, "shared", "review-page.js"), "utf8");
  assert.equal(html.includes("review-evidence-security.js"), true);
  assert.equal(html.includes("no-store"), true);
  assert.equal(page.includes('credentials: "include"'), true);
  assert.equal(page.includes('cache: "no-store"'), true);
  assert.equal(page.includes("Cache-Control"), true);
  assert.equal(page.includes("download"), false);
  assert.equal(page.includes("localStorage"), false);
  assert.equal(page.includes("&quot;"), true);
  assert.equal(page.includes("&#39;"), true);
  assert.equal(list.includes("./item-review.html?number="), true);
});
