(function (root) {
  "use strict";

  const targets = Object.freeze([
    Object.freeze({
      id: "dp-middle2-2-transfer",
      programId: "DP",
      title: "돌파 중2-2 입반 대비",
      scopeLabel: "중1-1~중2-1 연립일차방정식까지",
      expectedQuestionCount: 30,
      evidenceStatus: "verified",
      evidenceRefs: Object.freeze(["PUBLIC:DP-TIMETABLE-2026-09"])
    }),
    Object.freeze({
      id: "dp-common1-entry-202405",
      programId: "DP",
      title: "돌파 공통수학1 입반 대비",
      scopeLabel: "중2-1~중3-2",
      expectedQuestionCount: 30,
      evidenceStatus: "verified",
      evidenceRefs: Object.freeze(["PUBLIC:DP-TIMETABLE-2026-09"])
    })
  ]);

  const byId = new Map(targets.map(function (target) { return [target.id, target]; }));

  function clean(value) {
    return String(value == null ? "" : value).trim();
  }

  function semesterParts(value) {
    return clean(value).match(/중[1-3]-[1-2]/g) || [];
  }

  function result(eligible, reason) {
    return Object.freeze({ eligible, reason });
  }

  function evaluateMiddle22(question) {
    if (clean(question.sourceRelation) !== "original") return result(false, "원본 문항이 아님");
    const semester = clean(question.semester || (question.classification && question.classification.semester));
    const unit = clean(question.minorUnit || question.unit || (question.classification && (question.classification.minorUnit || question.classification.unit)));
    const parts = semesterParts(semester);
    if (parts.length !== 1 || !new Set(["중1-1", "중1-2", "중2-1"]).has(parts[0])) {
      return result(false, "중1-1~중2-1 범위 밖");
    }
    if (parts[0] === "중2-1" && /일차함수/.test(unit)) {
      return result(false, "연립일차방정식 뒤 단원");
    }
    return result(true, "시험 범위 안의 원본 문항");
  }

  function evaluateCommon1(question) {
    if (clean(question.sourceRelation) !== "original") return result(false, "원본 문항이 아님");
    const semester = clean(question.semester || (question.classification && question.classification.semester));
    const parts = semesterParts(semester);
    const allowed = new Set(["중2-1", "중2-2", "중3-1", "중3-2"]);
    if (!parts.length || parts.some(function (part) { return !allowed.has(part); })) {
      return result(false, "중2-1~중3-2 범위 밖");
    }
    return result(true, "시험 범위 안의 원본 문항");
  }

  function evaluateQuestion(targetId, question) {
    const id = clean(targetId);
    if (!byId.has(id)) return result(false, "알 수 없는 시험 범위");
    if (id === "dp-middle2-2-transfer") return evaluateMiddle22(question || {});
    if (id === "dp-common1-entry-202405") return evaluateCommon1(question || {});
    return result(false, "알 수 없는 시험 범위");
  }

  const api = Object.freeze({
    targets,
    getTarget(id) { return byId.get(clean(id)) || null; },
    evaluateQuestion
  });

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.HIGHSELECT_DOLPA_TARGET_SCOPES = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
