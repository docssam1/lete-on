(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_REVIEW_SECURITY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_ID = "sh-selection-r01";
  const ROUND_CODE = "SH-R01";
  const ANSWER_STATES = Object.freeze(["pending", "verified", "blocked"]);
  const REVIEW_STATES = Object.freeze(["pending", "verified", "blocked"]);
  const VISUAL_STATES = Object.freeze(["pending", "passed", "blocked"]);
  const RESOLUTION_STATES = Object.freeze(["pending", "agent_verified", "replacement_verified", "scoring_excluded"]);
  const RESOLUTION_DECISIONS = Object.freeze(["agent_verify", "replacement_verified", "scoring_excluded"]);
  const EXAM_CHECK_STATES = Object.freeze({
    responseSchemaStatus: Object.freeze(["pending", "verified", "blocked"]),
    scoringPolicyStatus: Object.freeze(["pending", "verified", "blocked"]),
    printAuditStatus: Object.freeze(["pending", "passed", "blocked"]),
    signedAssetStatus: Object.freeze(["pending", "verified", "blocked"])
  });
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl",
    "url", "uri", "pageImage", "imageData", "userApproval"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;

  function inspectForbidden(value, location, issues) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      inspectForbidden(value[key], `${location}.${key}`, issues);
    });
  }

  function validateStatusPacket(packet, inventory) {
    const issues = [];
    if (!packet || packet.examId !== EXAM_ID) issues.push("packet.exam_id");
    if (!packet || packet.roundCode !== ROUND_CODE) issues.push("packet.round_code");
    if (!packet || typeof packet.reviewVersion !== "string" || !packet.reviewVersion.trim()) issues.push("packet.review_version");
    const examChecks = packet && packet.examChecks;
    Object.keys(EXAM_CHECK_STATES).forEach(function (key) {
      if (!examChecks || !EXAM_CHECK_STATES[key].includes(examChecks[key])) issues.push(`packet.exam_checks.${key}`);
    });
    const sourceItems = inventory && Array.isArray(inventory.items) ? inventory.items : [];
    const rows = packet && Array.isArray(packet.items) ? packet.items : [];
    if (sourceItems.length !== 40) issues.push("inventory.item_count");
    if (rows.length !== sourceItems.length) issues.push("packet.item_count");
    const seen = new Set();
    rows.forEach(function (row, index) {
      const expected = sourceItems[index];
      const prefix = `item.${index + 1}`;
      if (!row || !expected || row.itemId !== expected.id) issues.push(`${prefix}.id`);
      if (!row || !expected || row.number !== expected.number) issues.push(`${prefix}.number`);
      if (!row || seen.has(row.itemId)) issues.push(`${prefix}.duplicate`);
      if (row && row.itemId) seen.add(row.itemId);
      if (!row || !ANSWER_STATES.includes(row.answerStatus)) issues.push(`${prefix}.answer_status`);
      if (!row || !REVIEW_STATES.includes(row.classificationStatus)) issues.push(`${prefix}.classification_status`);
      if (!row || !VISUAL_STATES.includes(row.visualStatus)) issues.push(`${prefix}.visual_status`);
      if (!row || !RESOLUTION_STATES.includes(row.resolutionStatus)) issues.push(`${prefix}.resolution_status`);
      if (!row || typeof row.sourceFingerprintMatched !== "boolean") issues.push(`${prefix}.fingerprint_match`);
      if (!row || typeof row.correctionArtifactMatched !== "boolean") issues.push(`${prefix}.correction_artifact_match`);
    });
    inspectForbidden(packet, "packet", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function hasVerifiedEvidence(item, status) {
    return !!item && !!status
      && status.itemId === item.id
      && status.number === item.number
      && status.answerStatus === "verified"
      && status.classificationStatus === "verified"
      && status.visualStatus === "passed"
      && status.sourceFingerprintMatched === true
      && status.correctionArtifactMatched === true;
  }

  function canResolve(item, status, decision) {
    if (!item || !status || status.resolutionStatus !== "pending" || !RESOLUTION_DECISIONS.includes(decision)) return false;
    if (decision === "agent_verify" || decision === "replacement_verified") return hasVerifiedEvidence(item, status);
    return status.itemId === item.id
      && status.number === item.number
      && status.visualStatus === "passed"
      && status.sourceFingerprintMatched === true;
  }

  function buildResolutionRequest(packet, inventory, itemNumber, decision) {
    const issues = validateStatusPacket(packet, inventory);
    if (issues.length) throw new Error(`invalid review packet: ${issues.join(",")}`);
    if (!RESOLUTION_DECISIONS.includes(decision)) throw new Error("invalid review decision");
    const item = inventory.items.find(function (candidate) { return candidate.number === itemNumber; });
    const status = packet.items.find(function (candidate) { return candidate.number === itemNumber; });
    if (!item || !status) throw new Error("review item not found");
    if (!canResolve(item, status, decision)) throw new Error("review item is not eligible for agent resolution");
    return Object.freeze({
      examId: EXAM_ID,
      itemId: item.id,
      number: item.number,
      reviewVersion: packet.reviewVersion,
      decision,
      resolutionStatus: decision === "agent_verify" ? "agent_verified" : decision
    });
  }

  function createPendingPacket(inventory) {
    return Object.freeze({
      examId: EXAM_ID,
      roundCode: ROUND_CODE,
      reviewVersion: "offline-read-only",
      examChecks: Object.freeze({
        responseSchemaStatus: "pending",
        scoringPolicyStatus: "pending",
        printAuditStatus: "pending",
        signedAssetStatus: "pending"
      }),
      items: Object.freeze(inventory.items.map(function (item) {
        return Object.freeze({
          itemId: item.id,
          number: item.number,
          answerStatus: "pending",
          classificationStatus: "pending",
          visualStatus: "pending",
          sourceFingerprintMatched: false,
          correctionArtifactMatched: !(inventory.releaseBlockerSummary && inventory.releaseBlockerSummary.items.includes(item.number)),
          resolutionStatus: "pending"
        });
      }))
    });
  }

  return Object.freeze({
    EXAM_ID,
    ROUND_CODE,
    FORBIDDEN_KEYS,
    RESOLUTION_STATES,
    RESOLUTION_DECISIONS,
    EXAM_CHECK_STATES,
    validateStatusPacket,
    hasVerifiedEvidence,
    canResolve,
    buildResolutionRequest,
    createPendingPacket
  });
});
