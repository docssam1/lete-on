(function (root, factory) {
  const projections = typeof module === "object" && module.exports
    ? require("./unit-screener-report-projections.js")
    : root.GFIELDUnitScreenerReportProjections;
  const api = factory(projections);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade7NSATeacherNextStepPlan = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (projections) {
  "use strict";

  if (!projections) throw new Error("GFIELDUnitScreenerReportProjections is required");

  const FOCUS = Object.freeze({
    "7.NS.A.1a": Object.freeze({ ko: "반대되는 양이 0이 되는 상황 설명", en: "Describe a context where opposite quantities combine to zero", "zh-Hans": "说明相反数量相加为零的情境" }),
    "7.NS.A.1b": Object.freeze({ ko: "유리수의 합을 수직선의 방향과 거리로 표현", en: "Represent rational sums with number-line direction and distance", "zh-Hans": "用数轴方向和距离表示有理数和" }),
    "7.NS.A.1c": Object.freeze({ ko: "뺄셈을 반대수의 덧셈으로 바꾸고 거리 해석", en: "Rewrite subtraction as adding the opposite and interpret distance", "zh-Hans": "把减法改写为加相反数并解释距离" }),
    "7.NS.A.1d": Object.freeze({ ko: "덧셈·뺄셈 성질을 계산 전략으로 활용", en: "Use addition and subtraction properties as strategies", "zh-Hans": "运用加法和减法性质作为计算策略" }),
    "7.NS.A.2a": Object.freeze({ ko: "유리수 곱셈의 부호와 맥락 설명", en: "Explain signed rational products in context", "zh-Hans": "结合情境解释有理数乘积的符号" }),
    "7.NS.A.2b": Object.freeze({ ko: "0이 아닌 수로 나누기와 몫의 부호 해석", en: "Interpret quotients and signs with nonzero divisors", "zh-Hans": "解释非零除数下的商及其符号" }),
    "7.NS.A.2c": Object.freeze({ ko: "곱셈·나눗셈 성질을 계산 전략으로 활용", en: "Use multiplication and division properties as strategies", "zh-Hans": "运用乘法和除法性质作为计算策略" }),
    "7.NS.A.2d": Object.freeze({ ko: "긴 나눗셈으로 유한·순환소수 설명", en: "Use long division to explain terminating and repeating decimals", "zh-Hans": "用长除法说明有限小数和循环小数" }),
    "7.NS.A.3": Object.freeze({ ko: "실생활·수학 문제에서 유리수 연산 연결", en: "Connect rational operations in real-world and mathematical problems", "zh-Hans": "在实际和数学问题中综合运用有理数运算" })
  });

  function fail(message) { throw new Error(message); }
  function denseArray(value, label) {
    if (!Array.isArray(value) || Object.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length) fail(`${label} must be an array`);
    if (Object.keys(value).length !== value.length || Object.keys(value).some(function (key, index) { return key !== String(index); })) fail(`${label} must be dense`);
    return value;
  }

  function buildDraft(teacherReport, teacherConfirmedFocusIds, locale) {
    if (projections.validateTeacherReport(teacherReport) !== true) fail("teacher report is invalid");
    if (teacherReport.assessment.purpose !== "unit-screener" || teacherReport.assessment.blueprintId !== "asm-bdg-grade7-nsa-screener-v1") fail("Grade 7 NS.A unit-screener report is required");
    if (!["ko", "en", "zh-Hans"].includes(locale)) fail("teacher locale is invalid");
    const selected = denseArray(teacherConfirmedFocusIds, "selectedFocusIds");
    if (!selected.length || selected.length > Object.keys(FOCUS).length) fail("select at least one focus");
    if (selected.some(function (id) { return typeof id !== "string" || !Object.prototype.hasOwnProperty.call(FOCUS, id); }) || new Set(selected).size !== selected.length) fail("selected focus input is invalid");

    const reportFocuses = new Map(teacherReport.focuses.map(function (focus) { return [focus.standardFocus, focus]; }));
    const steps = selected.map(function (focusId) {
      const focus = reportFocuses.get(focusId);
      if (!focus) fail("selected focus is not in the reviewed report");
      const sufficient = focus.minimumObservationsMet === true;
      return Object.freeze({
        standardFocus: focusId,
        title: FOCUS[focusId][locale],
        callerSelected: true,
        reviewedObservationCount: focus.itemCount,
        state: sufficient ? "awaiting-authenticated-teacher-review" : "additional-observation-needed",
        resourceResolutionState: sufficient ? "locked-until-teacher-authorization" : "not-available-insufficient-evidence"
      });
    });

    return Object.freeze({
      schemaVersion: "gfield-grade7-ns-a-teacher-next-step-draft-v1",
      audience: "teacher",
      authorizationVerified: false,
      requiresAuthenticatedTeacherDelivery: true,
      releaseState: "locked-review-preview-only",
      locale: locale,
      sourceAssessment: Object.freeze({ blueprintId: teacherReport.assessment.blueprintId, blueprintVersion: teacherReport.assessment.blueprintVersion, purpose: teacherReport.assessment.purpose }),
      sourceBindingState: "blueprint-only-awaiting-authenticated-attempt-binding",
      selectionProvenance: "unverified-caller-input",
      steps: Object.freeze(steps),
      teacherConfirmationRequired: true,
      automaticPrescription: false,
      studentAssignmentAuthorized: false
    });
  }

  return Object.freeze({ buildDraft: buildDraft });
});
