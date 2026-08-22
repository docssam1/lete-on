(function (root, factory) {
  "use strict";
  const security = typeof module !== "undefined" && module.exports
    ? require("./review-security.js")
    : root.HIGHSELECT_REVIEW_SECURITY;
  const api = factory(security);
  root.HIGHSELECT_SH_R01_RELEASE_GATE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (security) {
  "use strict";

  if (!security) throw new Error("HIGHSELECT_REVIEW_SECURITY is required");

  const FINAL_CONFIRMATIONS = Object.freeze(["pending", "confirmed", "rejected"]);
  const PRIVATE_LOCATION_PATTERN = /(?:^[A-Za-z]:[\\/]|file:\/\/|\\\\[^\\]+\\|\.(?:pdf|hwp)(?:$|[?#]))/i;
  const FORBIDDEN_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "sourcePath", "filePath", "pdfUrl", "downloadUrl", "storageUrl",
    "url", "uri", "pageImage", "imageData"
  ]);

  function inspectForbidden(value, location, issues) {
    if (typeof value === "string" && PRIVATE_LOCATION_PATTERN.test(value)) issues.push(`${location}.private_location`);
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.includes(key)) issues.push(`${location}.${key}.forbidden`);
      inspectForbidden(value[key], `${location}.${key}`, issues);
    });
  }

  function rowHasVerifiedEvidence(row) {
    return !!row
      && row.answerStatus === "verified"
      && row.classificationStatus === "verified"
      && row.visualStatus === "passed"
      && row.sourceFingerprintMatched === true
      && row.correctionArtifactMatched === true;
  }

  function rowIsSafelyResolved(row) {
    if (!row) return false;
    if (row.resolutionStatus === "agent_verified" || row.resolutionStatus === "replacement_verified") {
      return rowHasVerifiedEvidence(row);
    }
    if (row.resolutionStatus === "scoring_excluded") {
      return row.visualStatus === "passed" && row.sourceFingerprintMatched === true;
    }
    return false;
  }

  function rowSatisfiesAgentDecision(row, decision) {
    if (!rowIsSafelyResolved(row) || !decision || row.correctionArtifactMatched !== true) return false;
    if (decision.disposition === "replace") {
      return row.resolutionStatus === "replacement_verified" || row.resolutionStatus === "scoring_excluded";
    }
    return row.resolutionStatus === "agent_verified" || row.resolutionStatus === "scoring_excluded";
  }

  function validateFinalConfirmation(confirmation, packet, counts) {
    const issues = [];
    if (!confirmation) return Object.freeze(["final_confirmation.pending"]);
    if (confirmation.examId !== security.EXAM_ID) issues.push("final_confirmation.exam_id");
    if (confirmation.roundCode !== security.ROUND_CODE) issues.push("final_confirmation.round_code");
    if (confirmation.reviewVersion !== packet.reviewVersion) issues.push("final_confirmation.review_version");
    if (!FINAL_CONFIRMATIONS.includes(confirmation.confirmation)) issues.push("final_confirmation.state");
    if (confirmation.confirmation !== "confirmed") issues.push("final_confirmation.pending");
    if (confirmation.itemCount !== counts.itemCount) issues.push("final_confirmation.item_count");
    if (confirmation.activeItemCount !== counts.activeItemCount) issues.push("final_confirmation.active_item_count");
    if (confirmation.excludedItemCount !== counts.excludedItemCount) issues.push("final_confirmation.excluded_item_count");
    if (confirmation.activeItemCount + confirmation.excludedItemCount !== confirmation.itemCount) issues.push("final_confirmation.count_total");
    inspectForbidden(confirmation, "final_confirmation", issues);
    return Object.freeze(Array.from(new Set(issues)).sort());
  }

  function evaluate(exam, inventory, packet, finalConfirmation) {
    const reasons = [];
    const packetIssues = security.validateStatusPacket(packet, inventory);
    packetIssues.forEach(function (issue) { reasons.push(`status.${issue}`); });
    const rows = packetIssues.length || !packet || !Array.isArray(packet.items) ? [] : packet.items;
    const byNumber = new Map(rows.map(function (row) { return [row.number, row]; }));
    const blockerItems = inventory && inventory.releaseBlockerSummary && Array.isArray(inventory.releaseBlockerSummary.items)
      ? inventory.releaseBlockerSummary.items : [];
    const ownerReviewItems = inventory && inventory.classificationReviewSummary && Array.isArray(inventory.classificationReviewSummary.ownerReviewItems)
      ? inventory.classificationReviewSummary.ownerReviewItems : [];
    const decisions = inventory && inventory.agentDecisionSummary && Array.isArray(inventory.agentDecisionSummary.items)
      ? new Map(inventory.agentDecisionSummary.items.map(function (decision) { return [decision.number, decision]; })) : new Map();
    const correctionExecutionPendingItems = Array.from(decisions.values()).filter(function (decision) {
      return decision.executionStatus === "pending";
    }).map(function (decision) { return decision.number; });
    const unresolvedItems = rows.filter(function (row) { return !rowIsSafelyResolved(row); }).map(function (row) { return row.number; });
    const releaseBlockerPendingItems = blockerItems.filter(function (number) {
      return !rowSatisfiesAgentDecision(byNumber.get(number), decisions.get(number));
    });
    const classificationPendingItems = ownerReviewItems.filter(function (number) {
      const row = byNumber.get(number);
      return !row || (row.classificationStatus !== "verified" && row.resolutionStatus !== "scoring_excluded");
    });
    const excludedItems = rows.filter(function (row) { return row.resolutionStatus === "scoring_excluded" && rowIsSafelyResolved(row); });
    const activeItems = rows.filter(function (row) {
      return (row.resolutionStatus === "agent_verified" || row.resolutionStatus === "replacement_verified") && rowIsSafelyResolved(row);
    });
    const counts = Object.freeze({
      itemCount: rows.length,
      activeItemCount: activeItems.length,
      excludedItemCount: excludedItems.length,
      unresolvedItemCount: unresolvedItems.length,
      releaseBlockerPendingCount: releaseBlockerPendingItems.length,
      correctionExecutionPendingCount: correctionExecutionPendingItems.length,
      classificationPendingCount: classificationPendingItems.length
    });

    if (rows.length !== 40) reasons.push("release.item_count");
    if (unresolvedItems.length) reasons.push("release.agent_resolution_pending");
    if (correctionExecutionPendingItems.length) reasons.push("release.correction_execution_pending");
    if (releaseBlockerPendingItems.length) reasons.push("release.correction_resolution_pending");
    if (classificationPendingItems.length) reasons.push("release.classification_review_pending");
    const examChecks = packet && packet.examChecks || {};
    const examChecksReady = examChecks.responseSchemaStatus === "verified"
      && examChecks.scoringPolicyStatus === "verified"
      && examChecks.printAuditStatus === "passed"
      && examChecks.signedAssetStatus === "verified";
    if (examChecks.responseSchemaStatus !== "verified") reasons.push("release.response_schema_pending");
    if (examChecks.scoringPolicyStatus !== "verified") reasons.push("release.scoring_policy_pending");
    if (examChecks.printAuditStatus !== "passed") reasons.push("release.print_audit_pending");
    if (examChecks.signedAssetStatus !== "verified") reasons.push("release.signed_asset_pending");

    const readyForFinalConfirmation = packetIssues.length === 0
      && rows.length === 40
      && unresolvedItems.length === 0
      && correctionExecutionPendingItems.length === 0
      && releaseBlockerPendingItems.length === 0
      && classificationPendingItems.length === 0
      && examChecksReady;
    const confirmationIssues = readyForFinalConfirmation
      ? validateFinalConfirmation(finalConfirmation, packet, counts)
      : Object.freeze(["final_confirmation.not_ready"]);
    confirmationIssues.forEach(function (issue) { reasons.push(issue); });

    if (!exam || exam.id !== security.EXAM_ID) reasons.push("catalog.exam_id");
    if (!exam || exam.questionCount !== 40 || exam.pageCount !== 8) reasons.push("catalog.structure");
    if (!exam || exam.sourceStatus !== "audited") reasons.push("catalog.source_status");
    if (!exam || exam.answerStatus !== "verified") reasons.push("catalog.answer_status");
    if (!exam || exam.classificationStatus !== "verified") reasons.push("catalog.classification_status");
    if (!exam || exam.assetPolicy !== "signed-page-images") reasons.push("catalog.asset_policy");
    if (!exam || exam.releaseStatus !== "released") reasons.push("catalog.release_status");

    const finalConfirmed = confirmationIssues.length === 0;
    const canPromoteCatalog = readyForFinalConfirmation && finalConfirmed;
    const canServeStudents = canPromoteCatalog
      && !!exam
      && exam.sourceStatus === "audited"
      && exam.answerStatus === "verified"
      && exam.classificationStatus === "verified"
      && exam.releaseStatus === "released"
      && exam.assetPolicy === "signed-page-images";

    return Object.freeze({
      examId: security.EXAM_ID,
      roundCode: security.ROUND_CODE,
      reviewVersion: packet && typeof packet.reviewVersion === "string" ? packet.reviewVersion : "",
      counts,
      unresolvedItems: Object.freeze(unresolvedItems),
      releaseBlockerPendingItems: Object.freeze(releaseBlockerPendingItems),
      correctionExecutionPendingItems: Object.freeze(correctionExecutionPendingItems),
      classificationPendingItems: Object.freeze(classificationPendingItems),
      examChecksReady,
      readyForFinalConfirmation,
      finalConfirmed,
      canPromoteCatalog,
      canServeStudents,
      reasons: Object.freeze(Array.from(new Set(reasons)).sort())
    });
  }

  function buildFinalConfirmationRequest(exam, inventory, packet) {
    const readiness = evaluate(exam, inventory, packet, null);
    if (!readiness.readyForFinalConfirmation) throw new Error("exam review is not ready for final confirmation");
    return Object.freeze({
      examId: security.EXAM_ID,
      roundCode: security.ROUND_CODE,
      reviewVersion: packet.reviewVersion,
      confirmation: "confirmed",
      itemCount: readiness.counts.itemCount,
      activeItemCount: readiness.counts.activeItemCount,
      excludedItemCount: readiness.counts.excludedItemCount
    });
  }

  return Object.freeze({
    FINAL_CONFIRMATIONS,
    evaluate,
    validateFinalConfirmation,
    buildFinalConfirmationRequest,
    rowHasVerifiedEvidence,
    rowIsSafelyResolved,
    rowSatisfiesAgentDecision
  });
});
