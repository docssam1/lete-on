(function (root, factory) {
  "use strict";
  const examSecurity = typeof module !== "undefined" && module.exports
    ? require("./exam-security.js")
    : root.HIGHSELECT_EXAM_SECURITY;
  const printPolicy = typeof module !== "undefined" && module.exports
    ? require("../data/print-exam-policy.js")
    : root.HIGHSELECT_PRINT_EXAM_POLICY;
  const api = factory(examSecurity, printPolicy);
  root.HIGHSELECT_PRINT_EXAM_SECURITY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function (examSecurity, printPolicy) {
  "use strict";

  if (!examSecurity || !printPolicy) throw new Error("exam security and print policy modules are required");

  const LEAK_KEYS = Object.freeze([
    "answer", "answers", "answerSpec", "answerKey", "correctAnswer", "solution", "explanation",
    "questionText", "prompt", "originalPath", "pdfUrl", "downloadUrl", "storageUrl"
  ]);

  function fail(message) { throw new Error(message); }

  function rejectLeaks(value) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      if (LEAK_KEYS.includes(key)) fail("인쇄 패킷에 비공개 문항 정보가 포함되어 있습니다.");
      rejectLeaks(value[key]);
    });
  }

  function validatePrintPacket(manifest, printPlan, layoutProfile, exam, session, runtime, nowMs) {
    rejectLeaks(manifest);
    rejectLeaks(printPlan);
    rejectLeaks(layoutProfile);
    if (!printPlan || printPlan.rasterPolicy !== printPolicy.RASTER_POLICY || printPlan.assemblyEligible !== true) {
      fail("승인된 인쇄 계획이 필요합니다.");
    }
    if (printPlan.approvalStatus !== "approved") fail("사용자 승인 전에는 인쇄할 수 없습니다.");
    if (!layoutProfile || layoutProfile.rasterPolicy !== printPolicy.RASTER_POLICY) fail("인쇄 레이아웃 정책이 올바르지 않습니다.");
    if (layoutProfile.id !== printPlan.layoutProfileId) fail("인쇄 레이아웃 식별자가 일치하지 않습니다.");
    if (!exam || exam.id !== printPlan.examId || exam.pageCount !== printPlan.pageCount) fail("인쇄 시험 구성이 일치하지 않습니다.");
    if (!manifest || manifest.printPlanId !== printPlan.id) fail("인쇄 계획 식별자가 일치하지 않습니다.");
    if (manifest.printPlanFingerprint !== printPlan.printPlanFingerprint) fail("인쇄 계획 지문이 일치하지 않습니다.");
    if (manifest.layoutProfileId !== layoutProfile.id) fail("인쇄 레이아웃 식별자가 일치하지 않습니다.");
    if (manifest.referenceDesignFingerprint !== layoutProfile.referenceDesignFingerprint) fail("참고 디자인 지문이 일치하지 않습니다.");

    const rasters = examSecurity.validateManifest(manifest, exam, session, runtime, nowMs);
    const pages = rasters.map(function (raster, index) {
      const planPage = printPlan.pages[index];
      if (!planPage || planPage.number !== raster.number) fail("인쇄 페이지 계획이 일치하지 않습니다.");
      return Object.freeze({
        number: raster.number,
        url: raster.url,
        mimeType: raster.mimeType,
        assetVariant: planPage.assetVariant,
        lineageIds: planPage.lineageIds,
        sourceRefs: planPage.sourceRefs
      });
    });
    return Object.freeze({
      examId: exam.id,
      printPlanId: printPlan.id,
      layoutProfileId: layoutProfile.id,
      pageSize: layoutProfile.pageSize,
      widthMm: layoutProfile.widthMm,
      heightMm: layoutProfile.heightMm,
      rasterPolicy: printPolicy.RASTER_POLICY,
      verified: true,
      pages: Object.freeze(pages)
    });
  }

  return Object.freeze({ LEAK_KEYS, validatePrintPacket });
});
