(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_REVIEW_SUMMARY_SECURITY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const EXAM_ID = "sh-selection-r01";
  const ROUND_CODE = "SH-R01";
  const REVIEW_VERSION = "rv-20260822-agent-01";
  const CLASSIFICATION_NUMBERS = Object.freeze([2, 6, 9, 14, 18, 21, 23, 24, 27, 28, 29, 36]);
  const ROUND_DECISIONS = Object.freeze(["pending", "approved", "returned"]);
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl", "url", "uri"
  ]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;

  const CORRECTION_LABELS = Object.freeze({
    same_type_same_difficulty: "동형 교체·독립검산 완료",
    answer_key: "채점 키 교정",
    independent_answer_verification: "독립검산 답 적용",
    source_faithful_typo: "원문 오기 교정",
    solution_typo: "풀이 오기 교정",
    table_layout: "표 레이아웃 보정"
  });

  function fail(message) { throw new Error(message); }

  function inspectForbidden(value, location, issues) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      inspectForbidden(value[key], `${location}.${key}`, issues);
    });
  }

  function createSummary(inventory) {
    if (!inventory || !Array.isArray(inventory.items) || inventory.items.length !== 40) fail("invalid SH-R01 inventory");
    const byNumber = new Map(inventory.items.map(function (item) { return [item.number, item]; }));
    const decisions = inventory.agentDecisionSummary && Array.isArray(inventory.agentDecisionSummary.items)
      ? inventory.agentDecisionSummary.items : [];
    if (decisions.length !== 9) fail("invalid SH-R01 agent decision summary");
    const blocked = decisions.map(function (decision) {
      const item = byNumber.get(decision.number);
      const label = CORRECTION_LABELS[decision.correctionKind];
      if (!item || !label) fail(`missing SH-R01 remediation ${decision.number}`);
      return Object.freeze({
        itemId: item.id,
        number: decision.number,
        queue: "blocked",
        action: decision.disposition === "replace" ? "replace" : decision.correctionKind,
        label,
        status: decision.executionStatus === "pending" ? "pending" : "agent-reviewed",
        protectedArtifactStatus: decision.executionStatus === "pending" ? "pending" : "verified"
      });
    });
    const classification = CLASSIFICATION_NUMBERS.map(function (number) {
      const item = byNumber.get(number);
      if (!item) fail(`missing SH-R01 item ${number}`);
      return Object.freeze({
        itemId: item.id,
        number,
        queue: "classification",
        action: "confirm-candidate",
        label: "2022 개정 분류 재검수 완료",
        status: item.classificationStatus === "verified" ? "agent-reviewed" : "pending",
        curriculumCandidate: item.curriculumCandidate,
        majorCandidate: item.majorCandidate,
        detailCandidate: item.detailCandidate
      });
    });
    const items = Object.freeze(blocked.concat(classification).sort(function (a, b) { return a.number - b.number; }));
    return Object.freeze({
      examId: EXAM_ID,
      roundCode: ROUND_CODE,
      reviewVersion: REVIEW_VERSION,
      blockedCount: blocked.length,
      classificationCount: classification.length,
      items,
      originalPreserved: true,
      protectedValuesIncluded: false
    });
  }

  function validateSummary(summary, inventory) {
    const issues = [];
    if (!summary || summary.examId !== EXAM_ID) issues.push("summary.exam_id");
    if (!summary || summary.roundCode !== ROUND_CODE) issues.push("summary.round_code");
    if (!summary || summary.reviewVersion !== REVIEW_VERSION) issues.push("summary.review_version");
    if (!summary || summary.blockedCount !== 9) issues.push("summary.blocked_count");
    if (!summary || summary.classificationCount !== 12) issues.push("summary.classification_count");
    if (!summary || summary.originalPreserved !== true) issues.push("summary.original_preserved");
    if (!summary || summary.protectedValuesIncluded !== false) issues.push("summary.protected_values");
    const rows = summary && Array.isArray(summary.items) ? summary.items : [];
    if (rows.length !== 21) issues.push("summary.item_count");
    const inventoryByNumber = new Map((inventory && Array.isArray(inventory.items) ? inventory.items : []).map(function (item) { return [item.number, item]; }));
    const seen = new Set();
    rows.forEach(function (row, index) {
      const expected = inventoryByNumber.get(row && row.number);
      const prefix = `item.${index + 1}`;
      if (!row || !expected || row.itemId !== expected.id) issues.push(`${prefix}.id`);
      if (!row || seen.has(row.number)) issues.push(`${prefix}.duplicate`);
      if (row) seen.add(row.number);
      if (!row || !["blocked", "classification"].includes(row.queue)) issues.push(`${prefix}.queue`);
      if (!row || !["pending", "agent-reviewed"].includes(row.status)) issues.push(`${prefix}.status`);
      if (row && row.action === "replace" && row.protectedArtifactStatus !== "verified") issues.push(`${prefix}.protected_artifact_status`);
    });
    inspectForbidden(summary, "summary", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function createPendingRoundPacket() {
    return Object.freeze({
      examId: EXAM_ID,
      roundCode: ROUND_CODE,
      reviewVersion: REVIEW_VERSION,
      decision: "pending"
    });
  }

  function validateRoundPacket(packet) {
    const issues = [];
    if (!packet || packet.examId !== EXAM_ID) issues.push("packet.exam_id");
    if (!packet || packet.roundCode !== ROUND_CODE) issues.push("packet.round_code");
    if (!packet || packet.reviewVersion !== REVIEW_VERSION) issues.push("packet.review_version");
    if (!packet || !ROUND_DECISIONS.includes(packet.decision)) issues.push("packet.decision");
    inspectForbidden(packet, "packet", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function canRequestRoundApproval() {
    return false;
  }

  function buildRoundDecisionRequest() {
    fail("round-decision endpoint is disabled; use the SH-R01 release gate final confirmation");
  }

  function evaluateReleaseGate(summary, packet, inventory, releaseReadiness) {
    const issues = Array.from(validateSummary(summary, inventory)).concat(Array.from(validateRoundPacket(packet)));
    if (!packet || packet.decision !== "approved") issues.push("round.final_approval_pending");
    issues.push("release.full_item_gate_required", "release.final_print_proof_required");
    return Object.freeze({
      reviewReady: false,
      canAssemble: false,
      canRelease: false,
      issues: Object.freeze(Array.from(new Set(issues)).sort())
    });
  }

  return Object.freeze({
    EXAM_ID,
    ROUND_CODE,
    REVIEW_VERSION,
    CLASSIFICATION_NUMBERS,
    FORBIDDEN_KEYS,
    CORRECTION_LABELS,
    createSummary,
    validateSummary,
    createPendingRoundPacket,
    validateRoundPacket,
    canRequestRoundApproval,
    buildRoundDecisionRequest,
    evaluateReleaseGate
  });
});
