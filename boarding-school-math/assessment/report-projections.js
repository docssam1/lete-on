(function (root, factory) {
  const engine = typeof module === "object" && module.exports
    ? require("./diagnostic-engine.js")
    : root.GFIELDDiagnosticEngine;
  const api = factory(engine);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDDiagnosticReportProjections = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (engine) {
  "use strict";

  if (!engine) throw new Error("GFIELDDiagnosticEngine is required");

  const SCHEMA_VERSION = "gfield-diagnostic-report-projection-v1";
  const FORBIDDEN_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "solution", "rubric",
    "privatepayload", "privatescoring", "scoringspec", "acceptedalternatives"
  ]);
  const STATUS_COPY = Object.freeze({
    "needs-more-learning": Object.freeze({
      ko: "우선 보완 학습이 필요합니다.", en: "Targeted learning is needed first.", "zh-Hans": "需要先进行针对性学习。"
    }),
    "needs-more-evidence": Object.freeze({
      ko: "추가 학습 근거와 교사 검토가 필요합니다.", en: "Additional learning evidence and teacher review are needed.", "zh-Hans": "需要补充学习证据和教师审核。"
    }),
    "eligible-for-server-verification": Object.freeze({
      ko: "학교의 최종 확인을 위해 제출할 수 있습니다.", en: "This may be submitted for the school's final verification.", "zh-Hans": "可提交学校进行最终核验。"
    })
  });

  function fail(message) { throw new Error(message); }
  function isRecord(value) { return !!value && typeof value === "object" && !Array.isArray(value); }
  function denseArray(value, field) {
    if (!Array.isArray(value)) fail(`${field} must be an array`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not have empty slots`);
    }
    return value;
  }
  function requireText(value, field) {
    if (typeof value !== "string" || !value || value !== value.trim()) fail(`${field} is required`);
    return value;
  }
  function noPrivateKeys(value, field) {
    if (Array.isArray(value)) return value.forEach(function (entry, index) { noPrivateKeys(entry, `${field}[${index}]`); });
    if (!isRecord(value)) return;
    Object.keys(value).forEach(function (key) {
      if (FORBIDDEN_KEYS.has(key.toLowerCase())) fail(`${field}.${key} is private answer data`);
      noPrivateKeys(value[key], `${field}.${key}`);
    });
  }
  function errorBreakdown(errorCounts) {
    if (!isRecord(errorCounts)) fail("domain.errorCounts must be an object");
    return Object.freeze(Object.keys(errorCounts).sort(function (left, right) {
      return errorCounts[right] - errorCounts[left] || left.localeCompare(right);
    }).map(function (errorType) {
      if (!engine.ERROR_TYPES.includes(errorType) || !Number.isInteger(errorCounts[errorType]) || errorCounts[errorType] < 1) {
        fail("domain.errorCounts contains an invalid error type or count");
      }
      return Object.freeze({ errorType, count: errorCounts[errorType] });
    }));
  }
  function validateAnalysisReport(report) {
    if (!isRecord(report)) fail("analysis report must be an object");
    if (report.schemaVersion !== engine.SCHEMA_VERSION) fail("analysis report schema version is unsupported");
    requireText(report.blueprintId, "analysis report blueprintId");
    if (!Number.isInteger(report.blueprintVersion) || report.blueprintVersion < 1) fail("analysis report blueprintVersion is invalid");
    requireText(report.learnerId, "analysis report learnerId");
    if (!isRecord(report.score) || !Number.isFinite(report.score.earnedPoints) || !Number.isFinite(report.score.maxPoints) ||
      !Number.isFinite(report.score.percentage) || typeof report.score.performanceBand !== "string") fail("analysis report score is invalid");
    denseArray(report.domains, "analysis report domains").forEach(function (domain) {
      if (!isRecord(domain)) fail("analysis report domain is invalid");
      requireText(domain.domainId, "analysis report domainId");
      errorBreakdown(domain.errorCounts);
    });
    denseArray(report.itemFeedback, "analysis report itemFeedback").forEach(function (item) {
      if (!isRecord(item)) fail("analysis report item feedback is invalid");
      ["itemId", "skillId", "domainId", "outcomeCode", "commentCode"].forEach(function (field) { requireText(item[field], `analysis report item.${field}`); });
      if (!isRecord(item.comment)) fail("analysis report item comment is invalid");
      ["ko", "en"].forEach(function (locale) { requireText(item.comment[locale], `analysis report item comment.${locale}`); });
    });
    if (!isRecord(report.promotionReview) || report.promotionReview.automaticPromotion !== false || report.promotionReview.requiresServerAuthorization !== true) {
      fail("analysis report promotion review is invalid");
    }
    if (!STATUS_COPY[report.promotionReview.status]) fail("analysis report promotion status is invalid");
    noPrivateKeys(report, "analysis report");
    return true;
  }
  function projectDomain(domain) {
    return Object.freeze({
      domainId: domain.domainId,
      earnedPoints: domain.earnedPoints,
      maxPoints: domain.maxPoints,
      percentage: domain.percentage,
      errorBreakdown: errorBreakdown(domain.errorCounts)
    });
  }
  function projectFeedback(item, index, includeItemId) {
    const result = {
      questionNumber: index + 1,
      skillId: item.skillId,
      domainId: item.domainId,
      outcomeCode: item.outcomeCode,
      errorType: item.errorType,
      commentCode: item.commentCode,
      comment: Object.freeze({ ko: item.comment.ko, en: item.comment.en, "zh-Hans": item.comment["zh-Hans"] || item.comment.en })
    };
    if (includeItemId) result.itemId = item.itemId;
    return Object.freeze(result);
  }
  function projectPriorities(report) {
    return Object.freeze(report.lessonPriorities.map(function (priority) {
      return Object.freeze({
        domainId: priority.domainId,
        mode: priority.mode,
        percentage: priority.percentage,
        errorBreakdown: errorBreakdown(priority.errorCounts)
      });
    }));
  }
  function projectPromotion(report, includeInternal) {
    const review = report.promotionReview;
    const result = {
      status: review.status,
      statusMessage: STATUS_COPY[review.status],
      automaticPromotion: false,
      finalDecision: "school-review-required",
      blockers: Object.freeze(review.blockers.slice()),
      missingEvidence: Object.freeze(review.missingEvidence.slice()),
      lowDomainIds: Object.freeze(review.lowDomainIds.slice()),
      prerequisiteGapCount: review.prerequisiteGapCount
    };
    if (includeInternal) {
      result.requiresServerAuthorization = true;
      result.serverAuthorizationVerified = review.serverAuthorizationVerified === true;
      result.decisionAuthority = report.policy.owner;
      result.boundEvidenceRecordIds = Object.freeze(review.boundEvidenceRecordIds.slice());
    }
    return Object.freeze(result);
  }
  function buildStudentReport(report) {
    validateAnalysisReport(report);
    const projection = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "student",
      deliveryRequirement: "authenticated-owner-only",
      authorizationVerified: false,
      assessment: Object.freeze({ blueprintId: report.blueprintId, blueprintVersion: report.blueprintVersion }),
      score: Object.freeze({ earnedPoints: report.score.earnedPoints, maxPoints: report.score.maxPoints, percentage: report.score.percentage, performanceBand: report.score.performanceBand }),
      domains: Object.freeze(report.domains.map(projectDomain)),
      itemFeedback: Object.freeze(report.itemFeedback.map(function (item, index) { return projectFeedback(item, index, false); })),
      lessonPriorities: projectPriorities(report),
      promotionReview: projectPromotion(report, false)
    });
    validateStudentReport(projection);
    return projection;
  }
  function buildTeacherReport(report) {
    validateAnalysisReport(report);
    const projection = Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "teacher",
      deliveryRequirement: "authenticated-teacher-or-admin-only",
      authorizationVerified: false,
      assessment: Object.freeze({ blueprintId: report.blueprintId, blueprintVersion: report.blueprintVersion, learnerId: report.learnerId }),
      policy: report.policy,
      score: Object.freeze({ earnedPoints: report.score.earnedPoints, maxPoints: report.score.maxPoints, percentage: report.score.percentage, performanceBand: report.score.performanceBand }),
      domains: Object.freeze(report.domains.map(projectDomain)),
      itemFeedback: Object.freeze(report.itemFeedback.map(function (item, index) { return projectFeedback(item, index, true); })),
      lessonPriorities: projectPriorities(report),
      promotionReview: projectPromotion(report, true)
    });
    validateTeacherReport(projection);
    return projection;
  }
  function validateStudentReport(projection) {
    if (!isRecord(projection) || projection.schemaVersion !== SCHEMA_VERSION || projection.audience !== "student" ||
      projection.deliveryRequirement !== "authenticated-owner-only" || projection.authorizationVerified !== false) fail("student projection is invalid");
    if (Object.prototype.hasOwnProperty.call(projection.assessment, "learnerId") || Object.prototype.hasOwnProperty.call(projection, "policy")) {
      fail("student projection contains internal identity or policy data");
    }
    projection.itemFeedback.forEach(function (item) {
      if (Object.prototype.hasOwnProperty.call(item, "itemId")) fail("student projection contains internal item identity");
    });
    noPrivateKeys(projection, "student projection");
    return true;
  }
  function validateTeacherReport(projection) {
    if (!isRecord(projection) || projection.schemaVersion !== SCHEMA_VERSION || projection.audience !== "teacher" ||
      projection.deliveryRequirement !== "authenticated-teacher-or-admin-only" || projection.authorizationVerified !== false) fail("teacher projection is invalid");
    noPrivateKeys(projection, "teacher projection");
    return true;
  }

  return Object.freeze({ SCHEMA_VERSION, validateAnalysisReport, buildStudentReport, buildTeacherReport, validateStudentReport, validateTeacherReport });
});
