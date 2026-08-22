const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const security = require(path.join(root, "shared", "review-security.js"));
const review = require(path.join(root, "data", "review-only", "sh-r01-inventory.js"));

function verifiedPacket() {
  return {
    examId: security.EXAM_ID,
    roundCode: security.ROUND_CODE,
    reviewVersion: "rv-20260822-01",
    examChecks: {
      responseSchemaStatus: "verified",
      scoringPolicyStatus: "verified",
      printAuditStatus: "passed",
      signedAssetStatus: "verified"
    },
    items: review.inventory.items.map(item => ({
      itemId: item.id,
      number: item.number,
      answerStatus: "verified",
      classificationStatus: "verified",
      visualStatus: "passed",
      sourceFingerprintMatched: true,
      correctionArtifactMatched: true,
      resolutionStatus: "pending"
    }))
  };
}

test("review console exposes all 40 candidates but no protected content", () => {
  const html = fs.readFileSync(path.join(root, "admin", "review.html"), "utf8");
  const page = fs.readFileSync(path.join(root, "shared", "review-page.js"), "utf8");
  assert.match(html, /40문항 개별 검수/);
  assert.match(html, /sh-r01-inventory\.js/);
  assert.match(page, /requireAdmin/);
  ["answerKey", "correctAnswer", "questionText", "sourcePath", "pdfUrl", "localStorage\.setItem"].forEach(term => {
    assert.equal(new RegExp(term).test(html + page), false, `${term} must not appear in review console`);
  });
});

test("offline review packet is read-only and keeps every agent resolution pending", () => {
  const packet = security.createPendingPacket(review.inventory);
  assert.deepEqual(security.validateStatusPacket(packet, review.inventory), []);
  assert.equal(packet.items.length, 40);
  assert.equal(packet.items.every(item => item.resolutionStatus === "pending"), true);
  assert.equal(packet.items.some((item, index) => security.canResolve(review.inventory.items[index], item, "agent_verify")), false);
});

test("agent resolution is allowed only after answer, classification, visual, and fingerprint gates", () => {
  const packet = verifiedPacket();
  assert.deepEqual(security.validateStatusPacket(packet, review.inventory), []);
  assert.equal(security.canResolve(review.inventory.items[0], packet.items[0], "agent_verify"), true);
  assert.deepEqual(security.buildResolutionRequest(packet, review.inventory, 1, "agent_verify"), {
    examId: security.EXAM_ID,
    itemId: review.inventory.items[0].id,
    number: 1,
    reviewVersion: packet.reviewVersion,
    decision: "agent_verify",
    resolutionStatus: "agent_verified"
  });
  for (const key of ["answerStatus", "classificationStatus", "visualStatus", "sourceFingerprintMatched", "correctionArtifactMatched"]) {
    const blocked = verifiedPacket();
    blocked.items[0][key] = key.endsWith("Matched") ? false : "pending";
    assert.equal(security.canResolve(review.inventory.items[0], blocked.items[0], "agent_verify"), false, key);
    assert.throws(() => security.buildResolutionRequest(blocked, review.inventory, 1, "agent_verify"));
  }
});

test("scoring exclusion requires visual and fingerprint safety but not an invented answer", () => {
  const packet = verifiedPacket();
  packet.items[0].answerStatus = "blocked";
  packet.items[0].classificationStatus = "blocked";
  assert.equal(security.canResolve(review.inventory.items[0], packet.items[0], "scoring_excluded"), true);
  assert.equal(security.buildResolutionRequest(packet, review.inventory, 1, "scoring_excluded").resolutionStatus, "scoring_excluded");
  packet.items[0].sourceFingerprintMatched = false;
  assert.equal(security.canResolve(review.inventory.items[0], packet.items[0], "scoring_excluded"), false);
});

test("status packets reject answers, source paths, and missing rows", () => {
  const answerLeak = verifiedPacket();
  answerLeak.items[0].correctAnswer = "hidden";
  assert.ok(security.validateStatusPacket(answerLeak, review.inventory).some(issue => issue.includes("forbidden")));
  const pathLeak = verifiedPacket();
  pathLeak.privateNote = "G:\\private\\source.pdf";
  assert.ok(security.validateStatusPacket(pathLeak, review.inventory).some(issue => issue.includes("private_location")));
  const missing = verifiedPacket();
  missing.items.pop();
  assert.ok(security.validateStatusPacket(missing, review.inventory).includes("packet.item_count"));
  const legacyApproval = verifiedPacket();
  legacyApproval.items[0].userApproval = "approved";
  assert.ok(security.validateStatusPacket(legacyApproval, review.inventory).some(issue => issue.includes("forbidden")));
  const missingExamCheck = verifiedPacket();
  missingExamCheck.examChecks.scoringPolicyStatus = "pending";
  assert.deepEqual(security.validateStatusPacket(missingExamCheck, review.inventory), []);
  delete missingExamCheck.examChecks.scoringPolicyStatus;
  assert.ok(security.validateStatusPacket(missingExamCheck, review.inventory).some(issue => issue.includes("exam_checks")));
});
